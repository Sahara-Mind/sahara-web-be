import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAMES, QUEUE_JOB_TYPES } from '../../lib/constants';

export interface EmailJobPayload {
  to: string[];
  templateId?: string;
  subject?: string;
  html?: string;
  from?: string;
  dynamicData?: any;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  delay?: number; // milliseconds
}

export interface JobOptions {
  priority?: 'low' | 'normal' | 'high' | 'critical';
  delay?: number;
  attempts?: number;
}

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.EMAIL_NOTIFICATIONS) private emailQueue: Queue,
  ) {}

  // Generic method to add any job to the email queue
  async addEmailJob(
    jobType: string,
    payload: EmailJobPayload,
    options?: JobOptions,
  ): Promise<void> {
    const jobOptions = {
      priority: this.getPriorityValue(
        options?.priority || payload.priority || 'normal',
      ),
      delay: options?.delay || payload.delay || 0,
      attempts: options?.attempts || 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 10,
      removeOnFail: 5,
    };

    await this.emailQueue.add(jobType, payload, jobOptions);
  }

  // Specific email job methods
  async sendEmail(payload: EmailJobPayload): Promise<void> {
    await this.addEmailJob(QUEUE_JOB_TYPES.EMAIL.SEND_EMAIL, payload);
  }

  async sendTemplateEmail(payload: EmailJobPayload): Promise<void> {
    if (!payload.templateId) {
      throw new Error('Template ID is required for template emails');
    }
    await this.addEmailJob(QUEUE_JOB_TYPES.EMAIL.SEND_TEMPLATE_EMAIL, payload);
  }

  // Queue management methods
  async getQueueStats(queueName: string = QUEUE_NAMES.EMAIL_NOTIFICATIONS) {
    const queue =
      queueName === QUEUE_NAMES.EMAIL_NOTIFICATIONS
        ? this.emailQueue
        : this.emailQueue;

    const waiting = await queue.getWaiting();
    const active = await queue.getActive();
    const completed = await queue.getCompleted();
    const failed = await queue.getFailed();

    return {
      queueName,
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      total: waiting.length + active.length + completed.length + failed.length,
    };
  }

  async retryFailedJobs(
    queueName: string = QUEUE_NAMES.EMAIL_NOTIFICATIONS,
  ): Promise<void> {
    const queue =
      queueName === QUEUE_NAMES.EMAIL_NOTIFICATIONS
        ? this.emailQueue
        : this.emailQueue;
    const failedJobs = await queue.getFailed();

    for (const job of failedJobs) {
      await job.retry();
    }
  }

  async clearQueue(
    queueName: string = QUEUE_NAMES.EMAIL_NOTIFICATIONS,
  ): Promise<void> {
    const queue =
      queueName === QUEUE_NAMES.EMAIL_NOTIFICATIONS
        ? this.emailQueue
        : this.emailQueue;
    await queue.clean(0, 'completed');
    await queue.clean(0, 'failed');
  }

  // Utility methods
  private getPriorityValue(priority: string): number {
    const priorities = {
      low: 1,
      normal: 5,
      high: 10,
      critical: 15,
    };
    return priorities[priority] || 5;
  }

  // Future: Add methods for other queue types
  // async addFileProcessingJob(payload: FileJobPayload): Promise<void> { ... }
  // async addDataSyncJob(payload: DataSyncJobPayload): Promise<void> { ... }
}
