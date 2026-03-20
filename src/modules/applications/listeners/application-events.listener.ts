import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../../database/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ApplicationEventsListener {
  private readonly logger = new Logger(ApplicationEventsListener.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('notifications') private notificationsQueue: Queue,
    @InjectQueue('tasks') private tasksQueue: Queue,
  ) {}

  /**
   * When application is created, send welcome email to student
   */
  @OnEvent('application.created')
  async handleApplicationCreated(event: any) {
    const { applicationId, studentId } = event.payload;

    this.logger.log(`Handling application.created event for ${applicationId}`);

    // Send welcome email
    await this.notificationsQueue.add('send-email', {
      userId: studentId,
      templateName: 'application-created',
      data: { applicationId },
    });

    // Create task for counselor to review profile
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { counselor: true },
    });

    if (application?.counselorId) {
      await this.tasksQueue.add('create-task', {
        title: 'Review new application',
        assignedTo: application.counselorId,
        relatedEntityType: 'Application',
        relatedEntityId: applicationId,
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });
    }
  }

  /**
   * When application status changes, trigger appropriate workflows
   */
  @OnEvent('application.status_changed')
  async handleApplicationStatusChanged(event: any) {
    const { applicationId, studentId, toStatus, fromStatus } = event.payload;

    this.logger.log(`Application ${applicationId} status changed: ${fromStatus} → ${toStatus}`);

    // Send notification to student
    await this.notificationsQueue.add('send-notification', {
      userId: studentId,
      type: 'application_status_changed',
      templateName: 'application-status-changed',
      data: {
        applicationId,
        oldStatus: fromStatus,
        newStatus: toStatus,
      },
    });

    // Specific workflows based on new status
    switch (toStatus) {
      case 'DOCUMENTS_PENDING':
        await this.handleDocumentsPending(applicationId, studentId);
        break;

      case 'READY_FOR_REVIEW':
        await this.handleReadyForReview(applicationId);
        break;

      case 'SUBMITTED':
        await this.handleApplicationSubmitted(applicationId, studentId);
        break;

      case 'ACCEPTED':
        await this.handleApplicationAccepted(applicationId, studentId);
        break;

      case 'REJECTED':
        await this.handleApplicationRejected(applicationId, studentId);
        break;
    }
  }

  /**
   * When document is approved, check if application can move forward
   */
  @OnEvent('document.approved')
  async handleDocumentApproved(event: any) {
    const { documentId, studentId } = event.payload;

    this.logger.log(`Document ${documentId} approved`);

    // Find all applications using this document
    const applications = await this.prisma.application.findMany({
      where: {
        studentId,
        documents: {
          some: { documentId },
        },
        status: 'DOCUMENTS_PENDING',
      },
      include: {
        documents: {
          include: { document: true },
        },
      },
    });

    // Check each application to see if all docs are now approved
    for (const app of applications) {
      const allApproved = app.documents.every(
        ad => ad.document.reviewStatus === 'APPROVED',
      );

      if (allApproved) {
        // Auto-transition to READY_FOR_REVIEW
        await this.prisma.application.update({
          where: { id: app.id },
          data: { status: 'READY_FOR_REVIEW' },
        });

        // Create status history
        await this.prisma.applicationStatusHistory.create({
          data: {
            applicationId: app.id,
            fromStatus: 'DOCUMENTS_PENDING',
            toStatus: 'READY_FOR_REVIEW',
            reason: 'All required documents approved',
          },
        });

        // Notify counselor
        if (app.counselorId) {
          await this.notificationsQueue.add('send-notification', {
            userId: app.counselorId,
            type: 'application_ready_for_review',
            data: {
              applicationId: app.id,
              studentId,
            },
          });
        }

        this.logger.log(`Application ${app.id} auto-advanced to READY_FOR_REVIEW`);
      }
    }
  }

  /**
   * When document is rejected, notify student and create task
   */
  @OnEvent('document.rejected')
  async handleDocumentRejected(event: any) {
    const { documentId, studentId, comments } = event.payload;

    this.logger.log(`Document ${documentId} rejected`);

    // Send notification to student
    await this.notificationsQueue.add('send-notification', {
      userId: studentId,
      type: 'document_rejected',
      templateName: 'document-rejected',
      data: {
        documentId,
        reason: comments,
      },
    });

    // Create task for student to reupload
    await this.tasksQueue.add('create-task', {
      title: 'Reupload rejected document',
      assignedTo: studentId,
      relatedEntityType: 'Document',
      relatedEntityId: documentId,
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    });
  }

  private async handleDocumentsPending(applicationId: string, studentId: string) {
    // Send email with list of required documents
    await this.notificationsQueue.add('send-email', {
      userId: studentId,
      templateName: 'documents-required',
      data: { applicationId },
    });

    // Create task for student
    await this.tasksQueue.add('create-task', {
      title: 'Upload required documents',
      assignedTo: studentId,
      relatedEntityType: 'Application',
      relatedEntityId: applicationId,
      priority: 'HIGH',
    });
  }

  private async handleReadyForReview(applicationId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application?.counselorId) return;

    // Create task for counselor to review
    await this.tasksQueue.add('create-task', {
      title: 'Review application for submission',
      assignedTo: application.counselorId,
      relatedEntityType: 'Application',
      relatedEntityId: applicationId,
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
    });
  }

  private async handleApplicationSubmitted(applicationId: string, studentId: string) {
    // Send confirmation email
    await this.notificationsQueue.add('send-email', {
      userId: studentId,
      templateName: 'application-submitted',
      data: { applicationId },
    });

    // Create reminder to check for decision in 30 days
    await this.tasksQueue.add(
      'create-reminder',
      {
        applicationId,
        reminderType: 'check_decision',
      },
      {
        delay: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    );
  }

  private async handleApplicationAccepted(applicationId: string, studentId: string) {
    // Send congratulations email
    await this.notificationsQueue.add('send-email', {
      userId: studentId,
      templateName: 'application-accepted',
      data: { applicationId },
    });

    // Check if student needs visa, create visa case
    const student = await this.prisma.student.findUnique({
      where: { userId: studentId },
      include: { preferences: true },
    });

    if (student?.preferences?.needsVisa) {
      const application = await this.prisma.application.findUnique({
        where: { id: applicationId },
        include: { opportunity: true },
      });

      // Create visa case
      await this.prisma.visaCase.create({
        data: {
          studentId,
          applicationId,
          caseNumber: `VISA-${Date.now()}`,
          destinationCountry: application.opportunity.country,
          visaType: 'STUDENT',
          status: 'CREATED',
        },
      });

      this.logger.log(`Visa case created for student ${studentId}`);
    }

    // Check if invoice should be created (if package pending payment)
    // This would integrate with your payment logic
  }

  private async handleApplicationRejected(applicationId: string, studentId: string) {
    // Send empathetic rejection email
    await this.notificationsQueue.add('send-email', {
      userId: studentId,
      templateName: 'application-rejected',
      data: { applicationId },
    });

    // Offer consultation with counselor
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (application?.counselorId) {
      await this.tasksQueue.add('create-task', {
        title: 'Schedule rejection debrief consultation',
        assignedTo: application.counselorId,
        relatedEntityType: 'Application',
        relatedEntityId: applicationId,
        priority: 'HIGH',
      });
    }
  }
}
