import { Injectable } from '@nestjs/common';
import { QueueService, EmailJobPayload } from '../../infra/queue/Queue.Service';
import { EmailTemplateID } from '../../infra/sendgrid/EmailTemplateID';

@Injectable()
export class NotificationService {
  constructor(private readonly queueService: QueueService) {}

  // High-level notification methods with business logic
  async sendWelcomeEmail(email: string, userData: any): Promise<void> {
    const payload: EmailJobPayload = {
      to: [email],
      templateId: EmailTemplateID.welcomeEmail,
      dynamicData: {
        firstName: userData.firstName || 'User',
        lastName: userData.lastName || '',
        companyName: userData.companyName || 'Sahara Mind',
        ...userData,
      },
      priority: 'high',
    };

    await this.queueService.sendTemplateEmail(payload);
  }

  async sendPasswordResetEmail(email: string, resetData: any): Promise<void> {
    const payload: EmailJobPayload = {
      to: [email],
      templateId: EmailTemplateID.resetPassword,
      dynamicData: {
        resetLink: resetData.resetLink,
        expiryTime: resetData.expiryTime || '24 hours',
        ...resetData,
      },
      priority: 'critical',
    };

    await this.queueService.sendTemplateEmail(payload);
  }

  async sendInviteEmail(email: string, inviteData: any): Promise<void> {
    const payload: EmailJobPayload = {
      to: [email],
      templateId: EmailTemplateID.inviteUser,
      dynamicData: {
        inviterName: inviteData.inviterName,
        organizationName: inviteData.organizationName,
        inviteLink: inviteData.inviteLink,
        ...inviteData,
      },
      priority: 'high',
    };

    await this.queueService.sendTemplateEmail(payload);
  }

  async sendReminderEmail(email: string, reminderData: any): Promise<void> {
    const payload: EmailJobPayload = {
      to: [email],
      templateId: EmailTemplateID.remindUser,
      dynamicData: reminderData,
      priority: 'normal',
    };

    await this.queueService.sendTemplateEmail(payload);
  }

  // Generic email methods
  async sendCustomEmail(payload: EmailJobPayload): Promise<void> {
    await this.queueService.sendEmail(payload);
  }

  async sendCustomTemplateEmail(payload: EmailJobPayload): Promise<void> {
    await this.queueService.sendTemplateEmail(payload);
  }

  // Bulk notification methods
  async sendBulkWelcomeEmails(
    users: Array<{ email: string; userData: any }>,
  ): Promise<void> {
    const promises = users.map((user) =>
      this.sendWelcomeEmail(user.email, user.userData),
    );
    await Promise.all(promises);
  }

  async sendBulkNotification(
    emails: string[],
    templateId: string,
    dynamicData: any,
  ): Promise<void> {
    const payload: EmailJobPayload = {
      to: emails,
      templateId,
      dynamicData,
      priority: 'normal',
    };

    await this.queueService.sendTemplateEmail(payload);
  }

  // Queue management delegation
  async getQueueStats() {
    return await this.queueService.getQueueStats();
  }

  async retryFailedJobs(): Promise<void> {
    await this.queueService.retryFailedJobs();
  }

  async clearQueue(): Promise<void> {
    await this.queueService.clearQueue();
  }
}
