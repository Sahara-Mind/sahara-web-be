import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  SubscriptionTier,
  SubscriptionStatus,
} from '../../../../lib/enums/SubscriptionEnum';

export class SubscriptionResponseDto {
  @ApiProperty({
    description: 'Subscription ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @ApiProperty({
    description: 'Subscription tier',
    enum: SubscriptionTier,
    example: SubscriptionTier.BASIC,
  })
  tier: SubscriptionTier;

  @ApiProperty({
    description: 'Subscription status',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @ApiPropertyOptional({
    description: 'Subscription price',
    example: 29.99,
  })
  price?: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
  })
  currency: string;

  @ApiPropertyOptional({
    description: 'Subscription start date',
    example: '2024-01-01T00:00:00Z',
  })
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Subscription end date',
    example: '2024-12-31T23:59:59Z',
  })
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Trial end date',
    example: '2024-01-15T23:59:59Z',
  })
  trialEndDate?: Date;

  @ApiPropertyOptional({
    description: 'Available features for this subscription',
    example: {
      therapistAccess: true,
      appointmentLimit: 10,
      questionnaireAccess: true,
    },
  })
  features?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Usage limits for this subscription',
    example: {
      maxAppointments: 10,
      maxTherapists: 2,
      maxQuestionnaires: 5,
    },
  })
  limits?: Record<string, number>;

  @ApiPropertyOptional({
    description: 'Last payment date',
    example: '2024-01-01T00:00:00Z',
  })
  lastPaymentDate?: Date;

  @ApiPropertyOptional({
    description: 'Next payment date',
    example: '2024-02-01T00:00:00Z',
  })
  nextPaymentDate?: Date;

  @ApiProperty({
    description: 'Whether subscription auto-renews',
    example: true,
  })
  isAutoRenew: boolean;

  @ApiPropertyOptional({
    description: 'Cancellation reason',
    example: 'User requested cancellation',
  })
  cancellationReason?: string;

  @ApiPropertyOptional({
    description: 'Date when subscription was cancelled',
    example: '2024-06-01T00:00:00Z',
  })
  cancelledAt?: Date;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Promotional subscription',
  })
  notes?: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00Z',
  })
  updatedAt: Date;
}

export class PaginatedSubscriptionResponseDto {
  @ApiProperty({
    type: [SubscriptionResponseDto],
    description: 'Array of subscriptions',
  })
  data: SubscriptionResponseDto[];

  @ApiProperty({
    description: 'Total number of subscriptions',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;
}
