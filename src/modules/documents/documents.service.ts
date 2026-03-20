import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../database/prisma.service';
import { StorageService } from '../../storage/storage.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { ReviewDocumentDto } from './dto/review-document.dto';
import { DocumentReviewStatus, UserType } from '@prisma/client';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private eventEmitter: EventEmitter2,
  ) {}

  async requestUploadUrl(userId: string, dto: CreateDocumentDto) {
    // Verify student exists
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new BadRequestException('Student profile not found');
    }

    // Create pending document record
    const document = await this.prisma.document.create({
      data: {
        studentId: userId,
        documentType: dto.documentType,
        title: dto.title,
        description: dto.description,
        reviewStatus: DocumentReviewStatus.UPLOADED,
        issueDate: dto.issueDate,
        expiryDate: dto.expiryDate,
        issuingAuthority: dto.issuingAuthority,
        tags: dto.tags || [],
      },
    });

    // Generate unique file key
    const versionId = `ver_${Date.now()}`;
    const sanitizedFilename = this.sanitizeFilename(dto.fileName);
    const fileKey = `students/${userId}/${document.id}/${versionId}/${sanitizedFilename}`;

    // Generate signed upload URL (5 minutes expiry)
    const uploadUrl = await this.storageService.generateSignedUploadUrl(
      fileKey,
      dto.fileSize,
      dto.mimeType,
    );

    this.logger.log(`Upload URL generated for document ${document.id}`);

    return {
      documentId: document.id,
      uploadUrl,
      fileKey,
      versionId,
      expiresIn: 300, // 5 minutes
    };
  }

  async confirmUpload(documentId: string, userId: string, fileKey: string, versionId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.studentId !== userId) {
      throw new ForbiddenException('You do not have permission to modify this document');
    }

    // Verify file exists in storage
    const fileExists = await this.storageService.fileExists(fileKey);
    if (!fileExists) {
      throw new BadRequestException('File upload not completed');
    }

    // Get file metadata
    const metadata = await this.storageService.getFileMetadata(fileKey);

    // Create document version
    const version = await this.prisma.documentVersion.create({
      data: {
        documentId,
        versionNumber: 1,
        fileKey,
        fileName: this.extractFilename(fileKey),
        fileSize: BigInt(metadata.size),
        mimeType: metadata.contentType,
        uploadedBy: userId,
      },
    });

    // Update document with current version
    const updatedDocument = await this.prisma.document.update({
      where: { id: documentId },
      data: {
        currentVersionId: version.id,
        reviewStatus: DocumentReviewStatus.PENDING_REVIEW,
      },
    });

    // Emit event
    this.eventEmitter.emit('document.uploaded', {
      eventType: 'document.uploaded',
      aggregateType: 'Document',
      aggregateId: documentId,
      payload: {
        documentId,
        studentId: userId,
        documentType: document.documentType,
        versionId: version.id,
        fileKey,
      },
      metadata: {
        userId,
        timestamp: new Date(),
      },
    });

    // MVP: Skipping document queue (virus-scan, ocr) to avoid Redis dependency

    this.logger.log(`Document ${documentId} upload confirmed, version ${version.versionNumber} created`);

    return updatedDocument;
  }

  async getDownloadUrl(documentId: string, userId: string, userType: UserType) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: {
        currentVersion: true,
        student: true,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Authorization check
    await this.checkAccess(document, userId, userType, 'read');

    if (!document.currentVersion) {
      throw new BadRequestException('No file uploaded for this document');
    }

    // Generate signed download URL (15 minutes expiry)
    const downloadUrl = await this.storageService.generateSignedDownloadUrl(
      document.currentVersion.fileKey,
    );

    // Log access for audit
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'document.downloaded',
        entityType: 'Document',
        entityId: documentId,
        metadata: {
          fileName: document.currentVersion.fileName,
          fileKey: document.currentVersion.fileKey,
        },
      },
    });

    this.logger.log(`Download URL generated for document ${documentId} by user ${userId}`);

    return {
      downloadUrl,
      fileName: document.currentVersion.fileName,
      expiresIn: 900, // 15 minutes
    };
  }

  async review(documentId: string, dto: ReviewDocumentDto, reviewerId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: {
        student: true,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Verify reviewer is document specialist
    const reviewer = await this.prisma.staff.findUnique({
      where: { userId: reviewerId },
    });

    if (!reviewer || (reviewer.staffRole !== 'DOCUMENT_SPECIALIST' && reviewer.staffRole !== 'SUPERADMIN')) {
      throw new ForbiddenException('Only document specialists can review documents');
    }

    // Update document status
    const updatedDocument = await this.prisma.document.update({
      where: { id: documentId },
      data: {
        reviewStatus: dto.status,
      },
    });

    // Create review record
    await this.prisma.documentReview.create({
      data: {
        documentId,
        reviewerId,
        status: dto.status,
        comments: dto.comments,
      },
    });

    // Emit event
    const eventType = dto.status === DocumentReviewStatus.APPROVED
      ? 'document.approved'
      : 'document.rejected';

    this.eventEmitter.emit(eventType, {
      eventType,
      aggregateType: 'Document',
      aggregateId: documentId,
      payload: {
        documentId,
        studentId: document.studentId,
        documentType: document.documentType,
        reviewerId,
        status: dto.status,
        comments: dto.comments,
      },
      metadata: {
        userId: reviewerId,
        timestamp: new Date(),
      },
    });

    this.logger.log(`Document ${documentId} reviewed: ${dto.status}`);

    return updatedDocument;
  }

  async findAll(userId: string, userType: UserType, filters: any = {}) {
    const where: any = { deletedAt: null };

    // Apply authorization
    if (userType === UserType.STUDENT) {
      where.studentId = userId;
    } else if (userType === UserType.STAFF) {
      const staff = await this.prisma.staff.findUnique({ where: { userId } });

      if (!staff) {
        throw new ForbiddenException('Staff profile not found');
      }

      if (staff.staffRole === 'DOCUMENT_SPECIALIST') {
        // Document specialists see documents in review queue
        where.reviewStatus = {
          in: [DocumentReviewStatus.PENDING_REVIEW, DocumentReviewStatus.IN_REVIEW],
        };
      } else if (staff.staffRole !== 'SUPERADMIN') {
        // Other staff see documents for their assigned applications
        const assignedApplications = await this.prisma.application.findMany({
          where: {
            OR: [
              { counselorId: userId },
              { specialistId: userId },
            ],
          },
          select: { id: true },
        });

        const applicationIds = assignedApplications.map(a => a.id);

        where.applications = {
          some: {
            applicationId: { in: applicationIds },
          },
        };
      }
    }

    // Apply filters
    if (filters.documentType) {
      where.documentType = filters.documentType;
    }
    if (filters.reviewStatus) {
      where.reviewStatus = filters.reviewStatus;
    }

    const documents = await this.prisma.document.findMany({
      where,
      include: {
        currentVersion: true,
        student: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return documents;
  }

  async checkExpiringDocuments() {
    const today = new Date();
    const checkDays = [30, 14, 7, 3, 1];

    for (const days of checkDays) {
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + days);
      targetDate.setHours(0, 0, 0, 0);

      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const expiringDocs = await this.prisma.document.findMany({
        where: {
          expiryDate: {
            gte: targetDate,
            lt: nextDay,
          },
          reviewStatus: DocumentReviewStatus.APPROVED,
          deletedAt: null,
        },
        include: {
          student: { include: { user: true } },
        },
      });

      for (const doc of expiringDocs) {
        this.eventEmitter.emit('document.expiry_approaching', {
          eventType: 'document.expiry_approaching',
          aggregateType: 'Document',
          aggregateId: doc.id,
          payload: {
            documentId: doc.id,
            studentId: doc.studentId,
            documentType: doc.documentType,
            daysRemaining: days,
            expiryDate: doc.expiryDate,
          },
          metadata: { timestamp: new Date() },
        });
      }
    }

    // Auto-expire documents past expiry date
    await this.prisma.document.updateMany({
      where: {
        expiryDate: { lt: today },
        reviewStatus: DocumentReviewStatus.APPROVED,
      },
      data: {
        reviewStatus: DocumentReviewStatus.EXPIRED,
      },
    });

    this.logger.log('Document expiry check completed');
  }

  private async checkAccess(
    document: any,
    userId: string,
    userType: UserType,
    action: 'read' | 'write' | 'review',
  ) {
    // Student can access own documents
    if (userType === UserType.STUDENT) {
      if (document.studentId !== userId) {
        throw new ForbiddenException('You do not have access to this document');
      }
      return;
    }

    // Staff access rules
    if (userType === UserType.STAFF) {
      const staff = await this.prisma.staff.findUnique({ where: { userId } });

      if (!staff) {
        throw new ForbiddenException('Staff profile not found');
      }

      if (staff.staffRole === 'SUPERADMIN') {
        return;
      }

      // Document specialists can review any document
      if (staff.staffRole === 'DOCUMENT_SPECIALIST' && action === 'review') {
        return;
      }

      // Check if document is linked to assigned application
      const assignedApplications = await this.prisma.application.findMany({
        where: {
          OR: [
            { counselorId: userId },
            { specialistId: userId },
          ],
          documents: {
            some: { documentId: document.id },
          },
        },
      });

      if (assignedApplications.length > 0) {
        return;
      }

      throw new ForbiddenException('You do not have access to this document');
    }

    throw new ForbiddenException('Unauthorized');
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '_')
      .replace(/_+/g, '_');
  }

  private extractFilename(fileKey: string): string {
    return fileKey.split('/').pop() || 'unknown';
  }
}
