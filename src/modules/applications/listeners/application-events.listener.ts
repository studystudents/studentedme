import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ApplicationEventsListener {
  private readonly logger = new Logger(ApplicationEventsListener.name);

  constructor(private prisma: PrismaService) {}

  /**
   * When application is created, send welcome email to student
   */
  @OnEvent('application.created')
  async handleApplicationCreated(event: any) {
    const { applicationId, studentId } = event.payload;

    this.logger.log(`Handling application.created event for ${applicationId}`);

    this.logger.log(`[notify] send-email to student ${studentId}: application-created for ${applicationId}`);

    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { counselor: true },
    });

    if (application?.counselorId) {
      this.logger.log(`[task] create-task: Review new application, assigned to ${application.counselorId}`);
    }
  }

  /**
   * When application status changes, trigger appropriate workflows
   */
  @OnEvent('application.status_changed')
  async handleApplicationStatusChanged(event: any) {
    const { applicationId, studentId, toStatus, fromStatus } = event.payload;

    this.logger.log(`Application ${applicationId} status changed: ${fromStatus} → ${toStatus}`);

    this.logger.log(`[notify] send-notification to student ${studentId}: application_status_changed (${fromStatus} → ${toStatus})`);

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

        if (app.counselorId) {
          this.logger.log(`[notify] send-notification to counselor ${app.counselorId}: application_ready_for_review for ${app.id}`);
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

    this.logger.log(`[notify] send-notification to student ${studentId}: document_rejected (${documentId})`);

    this.logger.log(`[task] create-task: Reupload rejected document, assigned to ${studentId}`);
  }

  private async handleDocumentsPending(applicationId: string, studentId: string) {
    this.logger.log(`[notify] send-email to student ${studentId}: documents-required for ${applicationId}`);
    this.logger.log(`[task] create-task: Upload required documents, assigned to ${studentId}`);
  }

  private async handleReadyForReview(applicationId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application?.counselorId) return;

    this.logger.log(`[task] create-task: Review application for submission, assigned to ${application.counselorId}`);
  }

  private async handleApplicationSubmitted(applicationId: string, studentId: string) {
    this.logger.log(`[notify] send-email to student ${studentId}: application-submitted for ${applicationId}`);
    this.logger.log(`[task] create-reminder: check_decision for ${applicationId} in 30 days`);
  }

  private async handleApplicationAccepted(applicationId: string, studentId: string) {
    this.logger.log(`[notify] send-email to student ${studentId}: application-accepted for ${applicationId}`);

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

      if (!application?.opportunity) {
        this.logger.warn(`Cannot create visa case: application or opportunity not found for ${applicationId}`);
        return;
      }

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
    this.logger.log(`[notify] send-email to student ${studentId}: application-rejected for ${applicationId}`);

    // Offer consultation with counselor
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (application?.counselorId) {
      this.logger.log(`[task] create-task: Schedule rejection debrief consultation, assigned to ${application.counselorId}`);
    }
  }
}
