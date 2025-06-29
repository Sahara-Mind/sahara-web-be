import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AdminSubscriptionService } from './AdminSubscription.Service';
import { CreateSubscriptionDto } from './dto/CreateSubscriptionDto';
import { UpdateSubscriptionDto } from './dto/UpdateSubscriptionDto';
import { FilterSubscriptionDto } from './dto/FilterSubscriptionDto';
import {
  SubscriptionResponseDto,
  PaginatedSubscriptionResponseDto,
} from './dto/SubscriptionResponseDto';
import { SubscriptionTier } from '../../../lib/enums/SubscriptionEnum';

@ApiTags('Admin - Subscriptions')
@Controller('admin/subscriptions')
export class AdminSubscriptionController {
  constructor(private readonly subscriptionService: AdminSubscriptionService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new subscription',
    description:
      'Creates a new subscription for a user with specified tier and configuration',
  })
  @ApiResponse({
    status: 201,
    description: 'Subscription created successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - User already has active subscription or invalid data',
  })
  @ApiBody({ type: CreateSubscriptionDto })
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return await this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all subscriptions with filtering',
    description:
      'Retrieves paginated list of subscriptions with optional filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Subscriptions retrieved successfully',
    type: PaginatedSubscriptionResponseDto,
  })
  async findAll(@Query() filterDto: FilterSubscriptionDto) {
    return await this.subscriptionService.findAll(filterDto);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get subscription statistics',
    description: 'Retrieves comprehensive statistics about subscriptions',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 150 },
        byTier: {
          type: 'object',
          properties: {
            trial: { type: 'number', example: 25 },
            basic: { type: 'number', example: 75 },
            standard: { type: 'number', example: 35 },
            premium: { type: 'number', example: 15 },
          },
        },
        byStatus: {
          type: 'object',
          properties: {
            active: { type: 'number', example: 120 },
            inactive: { type: 'number', example: 10 },
            cancelled: { type: 'number', example: 15 },
            expired: { type: 'number', example: 5 },
            pending: { type: 'number', example: 0 },
          },
        },
        activeRevenue: { type: 'number', example: 8500.5 },
      },
    },
  })
  async getStats() {
    return await this.subscriptionService.getSubscriptionStats();
  }

  @Get('trials-expiring')
  @ApiOperation({
    summary: 'Get trials expiring soon',
    description:
      'Retrieves trial subscriptions that are expiring within specified days',
  })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Number of days to look ahead (default: 7)',
    example: 7,
  })
  @ApiResponse({
    status: 200,
    description: 'Expiring trials retrieved successfully',
    type: [SubscriptionResponseDto],
  })
  async getTrialsExpiringSoon(@Query('days') days?: string) {
    const daysNumber = days ? parseInt(days, 10) : 7;
    return await this.subscriptionService.getTrialExpiringSoon(daysNumber);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get subscriptions by user ID',
    description: 'Retrieves all subscriptions for a specific user',
  })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'User subscriptions retrieved successfully',
    type: [SubscriptionResponseDto],
  })
  async findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.subscriptionService.findByUserId(userId);
  }

  @Get('user/:userId/active')
  @ApiOperation({
    summary: 'Get active subscription by user ID',
    description:
      'Retrieves the current active subscription for a specific user',
  })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Active subscription retrieved successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No active subscription found for user',
  })
  async findActiveByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.subscriptionService.findActiveByUserId(userId);
  }

  @Get(':subscriptionId')
  @ApiOperation({
    summary: 'Get subscription by ID',
    description: 'Retrieves a specific subscription by its ID',
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'Subscription UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription retrieved successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription not found',
  })
  async findOne(
    @Param('subscriptionId', ParseUUIDPipe) subscriptionId: string,
  ) {
    return await this.subscriptionService.findOne(subscriptionId);
  }

  @Patch(':subscriptionId')
  @ApiOperation({
    summary: 'Update subscription',
    description: 'Updates a subscription with new data',
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'Subscription UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription updated successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription not found',
  })
  @ApiBody({ type: UpdateSubscriptionDto })
  async update(
    @Param('subscriptionId', ParseUUIDPipe) subscriptionId: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return await this.subscriptionService.update(
      subscriptionId,
      updateSubscriptionDto,
    );
  }

  @Patch(':subscriptionId/cancel')
  @ApiOperation({
    summary: 'Cancel subscription',
    description: 'Cancels an active subscription with optional reason',
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'Subscription UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          description: 'Reason for cancellation',
          example: 'User requested cancellation',
        },
      },
    },
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription cancelled successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Subscription already cancelled',
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription not found',
  })
  async cancel(
    @Param('subscriptionId', ParseUUIDPipe) subscriptionId: string,
    @Body() body?: { reason?: string },
  ) {
    return await this.subscriptionService.cancelSubscription(
      subscriptionId,
      body?.reason,
    );
  }

  @Patch(':subscriptionId/reactivate')
  @ApiOperation({
    summary: 'Reactivate subscription',
    description: 'Reactivates a cancelled subscription',
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'Subscription UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription reactivated successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Only cancelled subscriptions can be reactivated',
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription not found',
  })
  async reactivate(
    @Param('subscriptionId', ParseUUIDPipe) subscriptionId: string,
  ) {
    return await this.subscriptionService.reactivateSubscription(
      subscriptionId,
    );
  }

  @Patch(':subscriptionId/upgrade')
  @ApiOperation({
    summary: 'Upgrade subscription',
    description: 'Upgrades a subscription to a higher tier',
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'Subscription UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tier: {
          type: 'string',
          enum: Object.values(SubscriptionTier),
          description: 'New subscription tier',
          example: SubscriptionTier.PREMIUM,
        },
      },
      required: ['tier'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription upgraded successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'New tier must be higher than current tier',
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription not found',
  })
  async upgrade(
    @Param('subscriptionId', ParseUUIDPipe) subscriptionId: string,
    @Body() body: { tier: SubscriptionTier },
  ) {
    return await this.subscriptionService.upgradeSubscription(
      subscriptionId,
      body.tier,
    );
  }

  @Patch(':subscriptionId/downgrade')
  @ApiOperation({
    summary: 'Downgrade subscription',
    description: 'Downgrades a subscription to a lower tier',
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'Subscription UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tier: {
          type: 'string',
          enum: Object.values(SubscriptionTier),
          description: 'New subscription tier',
          example: SubscriptionTier.BASIC,
        },
      },
      required: ['tier'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription downgraded successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'New tier must be lower than current tier',
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription not found',
  })
  async downgrade(
    @Param('subscriptionId', ParseUUIDPipe) subscriptionId: string,
    @Body() body: { tier: SubscriptionTier },
  ) {
    return await this.subscriptionService.downgradeSubscription(
      subscriptionId,
      body.tier,
    );
  }

  @Post('process-expired')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Process expired subscriptions',
    description: 'Batch process to mark expired subscriptions as expired',
  })
  @ApiResponse({
    status: 200,
    description: 'Expired subscriptions processed',
    schema: {
      type: 'object',
      properties: {
        processedCount: {
          type: 'number',
          description: 'Number of subscriptions marked as expired',
          example: 5,
        },
      },
    },
  })
  async processExpiredSubscriptions() {
    const processedCount =
      await this.subscriptionService.processExpiredSubscriptions();
    return { processedCount };
  }

  @Get('user/:userId/access/:feature')
  @ApiOperation({
    summary: 'Check user feature access',
    description:
      'Checks if a user has access to a specific feature based on their subscription',
  })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'feature',
    description: 'Feature name to check',
    example: 'advancedAnalytics',
  })
  @ApiResponse({
    status: 200,
    description: 'Feature access check completed',
    schema: {
      type: 'object',
      properties: {
        hasAccess: {
          type: 'boolean',
          description: 'Whether user has access to the feature',
          example: true,
        },
      },
    },
  })
  async checkFeatureAccess(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('feature') feature: string,
  ) {
    const hasAccess =
      await this.subscriptionService.checkUserSubscriptionAccess(
        userId,
        feature,
      );
    return { hasAccess };
  }

  @Get('user/:userId/limit/:limitType')
  @ApiOperation({
    summary: 'Check user subscription limit',
    description: 'Checks the subscription limit for a specific resource type',
  })
  @ApiParam({
    name: 'userId',
    description: 'User UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'limitType',
    description: 'Limit type to check',
    example: 'maxAppointments',
  })
  @ApiResponse({
    status: 200,
    description: 'Limit check completed',
    schema: {
      type: 'object',
      properties: {
        hasAccess: {
          type: 'boolean',
          description: 'Whether user has access to this resource',
          example: true,
        },
        currentLimit: {
          type: 'number',
          description: 'Current limit for this resource (-1 for unlimited)',
          example: 50,
        },
        used: {
          type: 'number',
          description: 'Currently used count (if available)',
          example: 15,
        },
      },
    },
  })
  async checkSubscriptionLimit(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('limitType') limitType: string,
  ) {
    return await this.subscriptionService.checkUserSubscriptionLimit(
      userId,
      limitType,
    );
  }

  @Delete(':subscriptionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete subscription',
    description: 'Permanently deletes a subscription (use with caution)',
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'Subscription UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Subscription deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription not found',
  })
  async remove(@Param('subscriptionId', ParseUUIDPipe) subscriptionId: string) {
    await this.subscriptionService.remove(subscriptionId);
  }
}
