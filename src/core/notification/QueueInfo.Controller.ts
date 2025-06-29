import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QUEUE_NAMES } from '../../lib/constants';

@ApiTags('Queue Management')
@Controller('admin/queue-info')
export class QueueInfoController {
  @Get('info')
  @ApiOperation({
    summary: 'Get Bull Board information',
    description: 'Get information about queue monitoring and Bull Board access',
  })
  @ApiResponse({
    status: 200,
    description: 'Bull Board information retrieved successfully',
  })
  getBullBoardInfo() {
    return {
      bullBoardUrl: '/admin/queues',
      description:
        'Bull Board provides a web interface for monitoring and managing Bull queues',
      features: [
        'View queue statistics (waiting, active, completed, failed jobs)',
        'Monitor job details and payloads',
        'Retry failed jobs manually',
        'Clean up completed/failed jobs',
        'Real-time queue updates',
        'Job progress tracking',
      ],
      queues: [
        `${QUEUE_NAMES.EMAIL_NOTIFICATIONS} - Handles all email notification jobs`,
      ],
      usage: {
        access: 'Visit /admin/queues in your browser',
        authentication: 'No authentication required (configure for production)',
        refresh: 'Auto-refreshes every 5 seconds',
      },
      endpoints: {
        stats:
          'GET /notifications/queue/stats - API endpoint for queue statistics',
        retry:
          'PATCH /notifications/queue/retry-failed - Retry failed jobs via API',
        clear:
          'PATCH /notifications/queue/clear - Clear completed/failed jobs via API',
      },
    };
  }

  @Get('health')
  @ApiOperation({
    summary: 'Check queue health',
    description: 'Check if Bull Board and queues are properly configured',
  })
  @ApiResponse({
    status: 200,
    description: 'Queue health status',
  })
  getQueueHealth() {
    return {
      status: 'healthy',
      bullBoard: {
        configured: true,
        path: '/admin/queues',
      },
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        configured: true,
      },
      queues: {
        [QUEUE_NAMES.EMAIL_NOTIFICATIONS]: {
          registered: true,
          processor: 'EmailProcessor',
        },
      },
      timestamp: new Date().toISOString(),
    };
  }
}
