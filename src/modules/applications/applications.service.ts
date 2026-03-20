import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../database/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { ApplicationStatus, UserType } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(userId: string, dto: CreateApplicationDto) {
    // Verify student exists
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new BadRequestException('Student profile not found');
    }

    // Verify opportunity exists
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id: dto.opportunityId },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    // Check if student already has an application for this opportunity
    const existingApp = await this.prisma.application.findFirst({
      where: {
        studentId: userId,
        opportunityId: dto.opportunityId,
        deletedAt: null,
      },
    });

    if (existingApp) {
      throw new BadRequestException('You already have an application for this opportunity');
    }

    // Get or create student case
    let studentCase = await this.prisma.studentCase.findUnique({
      where: { studentId: userId },
    });

    if (!studentCase) {
      const caseNumber = await this.generateCaseNumber();
      studentCase = await this.prisma.studentCase.create({
        data: {
          studentId: userId,
          caseNumber,
        },
      });
    }

    // Generate application number
    const applicationNumber = await this.generateApplicationNumber();

    // Determine initial status based on profile completeness
    const profile = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        educationHistory: true,
        languageScores: true,
        preferences: true,
      },
    });

    const isProfileComplete = this.checkProfileCompleteness(profile);
    const initialStatus = isProfileComplete
      ? ApplicationStatus.DOCUMENTS_PENDING
      : ApplicationStatus.PROFILE_INCOMPLETE;

    // Create application
    const application = await this.prisma.application.create({
      data: {
        studentId: userId,
        opportunityId: dto.opportunityId,
        studentCaseId: studentCase.id,
        applicationNumber,
        status: initialStatus,
        targetDeadline: dto.targetDeadline,
        counselorId: dto.counselorId,
      },
      include: {
        opportunity: {
          include: { institution: true },
        },
        student: {
          include: { user: true },
        },
      },
    });

    // Create status history
    await this.createStatusHistory(application.id, null, initialStatus, 'Application created');

    // Create checklist from opportunity requirements
    await this.createChecklist(application.id, dto.opportunityId);

    // Emit event
    this.eventEmitter.emit('application.created', {
      eventType: 'application.created',
      aggregateType: 'Application',
      aggregateId: application.id,
      payload: {
        applicationId: application.id,
        studentId: userId,
        opportunityId: dto.opportunityId,
        status: initialStatus,
      },
      metadata: {
        userId,
        timestamp: new Date(),
      },
    });

    this.logger.log(`Application created: ${application.applicationNumber}`);

    return application;
  }

  async findOne(applicationId: string, userId: string, userType: UserType) {
    const isStaff = userType === UserType.STAFF;

    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        opportunity: {
          include: { institution: true },
        },
        student: {
          include: { user: true },
        },
        counselor: {
          include: { user: true },
        },
        specialist: {
          include: { user: true },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        documents: {
          include: {
            document: true,
          },
        },
        notes: {
          where: {
            OR: [
              { isInternal: false },
              ...(isStaff ? [{ isInternal: true }] : []),
            ],
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Authorization check
    await this.checkAccess(application, userId, userType, 'read');

    return application;
  }

  async findAll(userId: string, userType: UserType, filters: any = {}) {
    const where: any = { deletedAt: null };

    // Apply authorization
    if (userType === UserType.STUDENT) {
      where.studentId = userId;
    } else if (userType === UserType.STAFF) {
      const staff = await this.prisma.staff.findUnique({ where: { userId } });
      if (staff && staff.staffRole !== 'SUPERADMIN') {
        where.OR = [
          { counselorId: userId },
          { specialistId: userId },
        ];
      }
    }

    // Apply filters
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.opportunityType) {
      where.opportunity = { type: filters.opportunityType };
    }

    const applications = await this.prisma.application.findMany({
      where,
      include: {
        opportunity: {
          include: { institution: true },
        },
        student: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return applications;
  }

  async changeStatus(applicationId: string, dto: ChangeStatusDto, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { opportunity: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Validate transition
    this.validateStatusTransition(application.status, dto.newStatus);

    // Update application
    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: dto.newStatus,
        ...(dto.newStatus === ApplicationStatus.SUBMITTED && { submittedAt: new Date() }),
        ...(dto.newStatus === ApplicationStatus.ACCEPTED && { decisionDate: new Date() }),
        ...(dto.newStatus === ApplicationStatus.REJECTED && { decisionDate: new Date() }),
      },
    });

    // Create status history
    await this.createStatusHistory(
      applicationId,
      application.status,
      dto.newStatus,
      dto.reason,
      userId,
    );

    // Emit event
    this.eventEmitter.emit('application.status_changed', {
      eventType: 'application.status_changed',
      aggregateType: 'Application',
      aggregateId: applicationId,
      payload: {
        applicationId,
        studentId: application.studentId,
        opportunityId: application.opportunityId,
        fromStatus: application.status,
        toStatus: dto.newStatus,
        changedBy: userId,
        reason: dto.reason,
      },
      metadata: {
        userId,
        timestamp: new Date(),
      },
    });

    this.logger.log(`Application ${applicationId} status changed: ${application.status} → ${dto.newStatus}`);

    return updated;
  }

  async submit(applicationId: string, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { documents: { include: { document: true } } },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // MVP: Bypass strict document approval check so students can test the submit flow without an admin panel
    // const allDocsApproved = application.documents.every(
    //   ad => ad.document.reviewStatus === 'APPROVED',
    // );
    // if (!allDocsApproved) {
    //   throw new BadRequestException('Cannot submit: Not all required documents are approved');
    // }

    // Check current status
    const allowedStatuses: ApplicationStatus[] = [
      ApplicationStatus.DRAFT, 
      ApplicationStatus.PROFILE_INCOMPLETE, 
      ApplicationStatus.DOCUMENTS_PENDING, 
      ApplicationStatus.READY_FOR_REVIEW, 
      ApplicationStatus.SUBMISSION_READY
    ];
    if (!allowedStatuses.includes(application.status)) {
      throw new BadRequestException(`Cannot submit application in ${application.status} status`);
    }

    return this.changeStatus(
      applicationId,
      { newStatus: ApplicationStatus.SUBMITTED, reason: 'Application submitted to institution' },
      userId,
    );
  }

  private checkProfileCompleteness(profile: any): boolean {
    return (
      profile.educationHistory.length > 0 &&
      profile.languageScores.length > 0 &&
      profile.preferences !== null
    );
  }

  private validateStatusTransition(fromStatus: ApplicationStatus, toStatus: ApplicationStatus) {
    const validTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
      [ApplicationStatus.DRAFT]: [ApplicationStatus.PROFILE_INCOMPLETE, ApplicationStatus.DOCUMENTS_PENDING],
      [ApplicationStatus.PROFILE_INCOMPLETE]: [ApplicationStatus.DOCUMENTS_PENDING],
      [ApplicationStatus.DOCUMENTS_PENDING]: [ApplicationStatus.READY_FOR_REVIEW],
      [ApplicationStatus.READY_FOR_REVIEW]: [ApplicationStatus.IN_REVIEW, ApplicationStatus.DOCUMENTS_PENDING],
      [ApplicationStatus.IN_REVIEW]: [ApplicationStatus.SUBMISSION_READY, ApplicationStatus.DOCUMENTS_PENDING],
      [ApplicationStatus.SUBMISSION_READY]: [ApplicationStatus.SUBMITTED],
      [ApplicationStatus.SUBMITTED]: [ApplicationStatus.AWAITING_DECISION],
      [ApplicationStatus.AWAITING_DECISION]: [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED, ApplicationStatus.WAITLISTED],
      [ApplicationStatus.WAITLISTED]: [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED],
      [ApplicationStatus.ACCEPTED]: [ApplicationStatus.ENROLLED, ApplicationStatus.DECLINED],
      [ApplicationStatus.ENROLLED]: [],
      [ApplicationStatus.DECLINED]: [],
      [ApplicationStatus.REJECTED]: [],
    };

    const allowed = validTransitions[fromStatus] || [];
    if (!allowed.includes(toStatus)) {
      throw new BadRequestException(
        `Invalid status transition: ${fromStatus} → ${toStatus}`,
      );
    }
  }

  private async createStatusHistory(
    applicationId: string,
    fromStatus: ApplicationStatus | null,
    toStatus: ApplicationStatus,
    reason?: string,
    changedBy?: string,
  ) {
    await this.prisma.applicationStatusHistory.create({
      data: {
        applicationId,
        fromStatus,
        toStatus,
        reason,
        changedBy,
      },
    });
  }

  private async createChecklist(applicationId: string, opportunityId: string) {
    // Get requirements for this opportunity
    const requirements = await this.prisma.opportunityRequirement.findMany({
      where: { opportunityId },
      orderBy: { displayOrder: 'asc' },
    });

    const checklistItems = requirements.map((req, index) => ({
      itemId: `req_${index}`,
      title: `${req.documentType} - ${req.description || ''}`,
      status: 'PENDING',
      isRequired: req.isRequired,
      completedAt: null,
    }));

    await this.prisma.checklistInstance.create({
      data: {
        applicationId,
        items: checklistItems,
      },
    });
  }

  private async checkAccess(
    application: any,
    userId: string,
    userType: UserType,
    action: 'read' | 'update' | 'delete',
  ) {
    // Student can access own applications
    if (userType === UserType.STUDENT) {
      if (application.studentId !== userId) {
        throw new ForbiddenException('You do not have access to this application');
      }
      return;
    }

    // Staff can access assigned applications
    if (userType === UserType.STAFF) {
      const staff = await this.prisma.staff.findUnique({ where: { userId } });

      if (!staff) {
        throw new ForbiddenException('Staff profile not found');
      }

      if (staff.staffRole === 'SUPERADMIN') {
        return;
      }

      // Counselor/Specialist can access assigned applications
      if (application.counselorId === userId || application.specialistId === userId) {
        return;
      }

      throw new ForbiddenException('You do not have access to this application');
    }

    throw new ForbiddenException('Unauthorized');
  }

  private async generateApplicationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.application.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
        },
      },
    });

    return `APP-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  private async generateCaseNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.studentCase.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
        },
      },
    });

    return `SC-${year}-${String(count + 1).padStart(5, '0')}`;
  }
}
