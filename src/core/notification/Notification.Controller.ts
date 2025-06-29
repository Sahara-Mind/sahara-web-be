import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { NotificationService } from './Notification.Service';
import { EmailJobPayload } from '../../infra/queue/Queue.Service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('email/send')
  @ApiOperation({
    summary: 'Send email notification',
    description: 'Queue an email notification to be sent asynchronously',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        to: {
          type: 'array',
          items: { type: 'string' },
          example: ['user@example.com'],
        },
        subject: { type: 'string', example: 'Welcome!' },
        html: { type: 'string', example: '<h1>Hello World</h1>' },
        from: { type: 'string', example: 'support@saharamind.com' },
        priority: {
          type: 'string',
          enum: ['low', 'normal', 'high', 'critical'],
          example: 'normal',
        },
        delay: { type: 'number', example: 0 },
      },
      required: ['to', 'subject', 'html'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Email queued successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        status: { type: 'string' },
      },
    },
  })
  async sendEmail(@Body() payload: EmailJobPayload) {
    await this.notificationService.sendCustomEmail(payload);
    return {
      message: 'Email notification queued successfully',
      status: 'queued',
    };
  }

  @Post('email/template')
  @ApiOperation({
    summary: 'Send template email notification',
    description:
      'Queue a template email notification to be sent asynchronously',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        to: {
          type: 'array',
          items: { type: 'string' },
          example: ['user@example.com'],
        },
        templateId: {
          type: 'string',
          example: 'd-00d77af451e04436ac4906c0af8c107b',
        },
        dynamicData: {
          type: 'object',
          example: { firstName: 'John', companyName: 'Acme Corp' },
        },
        from: { type: 'string', example: 'support@saharamind.com' },
        priority: {
          type: 'string',
          enum: ['low', 'normal', 'high', 'critical'],
          example: 'normal',
        },
        delay: { type: 'number', example: 0 },
      },
      required: ['to', 'templateId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Template email queued successfully',
  })
  async sendTemplateEmail(@Body() payload: EmailJobPayload) {
    await this.notificationService.sendCustomTemplateEmail(payload);
    return {
      message: 'Template email notification queued successfully',
      status: 'queued',
    };
  }

  @Post('email/welcome')
  @ApiOperation({
    summary: 'Send welcome email',
    description: 'Queue a welcome email using the predefined template',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        userData: {
          type: 'object',
          example: { firstName: 'John', lastName: 'Doe' },
        },
      },
      required: ['email', 'userData'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Welcome email queued successfully',
  })
  async sendWelcomeEmail(@Body() body: { email: string; userData: any }) {
    await this.notificationService.sendWelcomeEmail(body.email, body.userData);
    return {
      message: 'Welcome email queued successfully',
      status: 'queued',
    };
  }

  @Post('email/bulk-welcome')
  @ApiOperation({
    summary: 'Send bulk welcome emails',
    description: 'Queue multiple welcome emails to be sent asynchronously',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              userData: { type: 'object' },
            },
          },
          example: [
            { email: 'user1@example.com', userData: { firstName: 'John' } },
            { email: 'user2@example.com', userData: { firstName: 'Jane' } },
          ],
        },
      },
      required: ['users'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Bulk welcome emails queued successfully',
  })
  async sendBulkWelcomeEmails(
    @Body() body: { users: Array<{ email: string; userData: any }> },
  ) {
    await this.notificationService.sendBulkWelcomeEmails(body.users);
    return {
      message: `${body.users.length} welcome emails queued successfully`,
      status: 'queued',
    };
  }

  @Get('queue/stats')
  @ApiOperation({
    summary: 'Get queue statistics',
    description: 'Get current statistics of the email notification queue',
  })
  @ApiResponse({
    status: 200,
    description: 'Queue statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        queueName: { type: 'string' },
        waiting: { type: 'number' },
        active: { type: 'number' },
        completed: { type: 'number' },
        failed: { type: 'number' },
        total: { type: 'number' },
      },
    },
  })
  async getQueueStats() {
    return await this.notificationService.getQueueStats();
  }

  @Patch('queue/retry-failed')
  @ApiOperation({
    summary: 'Retry failed jobs',
    description: 'Retry all failed jobs in the email notification queue',
  })
  @ApiResponse({
    status: 200,
    description: 'Failed jobs retried successfully',
  })
  async retryFailedJobs() {
    await this.notificationService.retryFailedJobs();
    return {
      message: 'Failed jobs have been queued for retry',
      status: 'success',
    };
  }

  @Patch('queue/clear')
  @ApiOperation({
    summary: 'Clear completed and failed jobs',
    description: 'Clear completed and failed jobs from the queue',
  })
  @ApiResponse({
    status: 200,
    description: 'Queue cleared successfully',
  })
  async clearQueue() {
    await this.notificationService.clearQueue();
    return {
      message: 'Queue has been cleared',
      status: 'success',
    };
  }

  @Get('test-queue')
  @ApiOperation({
    summary: 'Test notification queue',
    description: 'Send a test email through the notification queue',
  })
  @ApiResponse({
    status: 200,
    description: 'Test notification queued successfully',
  })
  async testQueue() {
    await this.notificationService.sendWelcomeEmail('yugalkhati570@gmail.com', {
      firstName: 'Test User',
      lastName: 'Queue Test',
      companyName: 'Sahara Mind',
    });

    return {
      message: 'Test welcome email queued successfully',
      status: 'queued',
      note: 'Check your email and queue stats to verify delivery',
    };
  }
}
