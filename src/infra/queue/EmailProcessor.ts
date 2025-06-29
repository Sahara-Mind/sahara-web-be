import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SendGridService } from '../sendgrid/SendGrid.Service';
import { EmailJobPayload } from './Queue.Service';
import { QUEUE_NAMES, QUEUE_JOB_TYPES } from '../../lib/constants';

@Processor(QUEUE_NAMES.EMAIL_NOTIFICATIONS)
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly sendGridService: SendGridService) {}

  @Process(QUEUE_JOB_TYPES.EMAIL.SEND_EMAIL)
  async handleSendEmail(job: Job<EmailJobPayload>) {
    const { data } = job;
    this.logger.log(`Processing send-email job for ${data.to.join(', ')}`);

    try {
      if (!data.subject || !data.html) {
        throw new Error(
          'Subject and HTML content are required for simple emails',
        );
      }

      for (const email of data.to) {
        await this.sendGridService.sendMailSimple({
          to: email,
          from: data.from || 'support@saharamind.com',
          subject: data.subject,
          html: data.html,
        });
      }

      this.logger.log(`Successfully sent email to ${data.to.join(', ')}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${data.to.join(', ')}: ${error.message}`,
      );
      throw error;
    }
  }

  @Process(QUEUE_JOB_TYPES.EMAIL.SEND_TEMPLATE_EMAIL)
  async handleSendTemplateEmail(job: Job<EmailJobPayload>) {
    const { data } = job;
    this.logger.log(
      `Processing send-template-email job for ${data.to.join(', ')}`,
    );

    try {
      if (!data.templateId) {
        throw new Error('Template ID is required for template emails');
      }

      await this.sendGridService.sendMail({
        toEmailAddresses: data.to,
        templateId: data.templateId,
        fromEmailAddress: data.from,
        body: data.dynamicData,
      });

      this.logger.log(
        `Successfully sent template email to ${data.to.join(', ')}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send template email to ${data.to.join(', ')}: ${error.message}`,
      );
      throw error;
    }
  }
}
