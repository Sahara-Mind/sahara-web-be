import {
  IsOptional,
  IsEnum,
  IsUUID,
  IsString,
  IsDateString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  SubscriptionTier,
  SubscriptionStatus,
} from '../../../../lib/enums/SubscriptionEnum';

export class FilterSubscriptionDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search by user ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by subscription tier',
    enum: SubscriptionTier,
  })
  @IsOptional()
  @IsEnum(SubscriptionTier)
  tier?: SubscriptionTier;

  @ApiPropertyOptional({
    description: 'Filter by subscription status',
    enum: SubscriptionStatus,
  })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiPropertyOptional({
    description: 'Filter by Stripe customer ID',
    example: 'cus_1234567890',
  })
  @IsOptional()
  @IsString()
  stripeCustomerId?: string;

  @ApiPropertyOptional({
    description: 'Filter subscriptions created after this date',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  createdAfter?: string;

  @ApiPropertyOptional({
    description: 'Filter subscriptions created before this date',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  createdBefore?: string;

  @ApiPropertyOptional({
    description: 'Filter by expiration - true for expired, false for active',
    example: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  isExpired?: boolean;

  @ApiPropertyOptional({
    description: 'Search term for notes or general search',
    example: 'promotional',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
