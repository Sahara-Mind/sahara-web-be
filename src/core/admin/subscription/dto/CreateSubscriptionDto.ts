import {
  IsEnum,
  IsUUID,
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
  IsObject,
  IsNumber,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  SubscriptionTier,
  SubscriptionStatus,
} from '../../../../lib/enums/SubscriptionEnum';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'User ID to assign subscription to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Subscription tier',
    enum: SubscriptionTier,
    example: SubscriptionTier.BASIC,
  })
  @IsEnum(SubscriptionTier)
  tier: SubscriptionTier;

  @ApiPropertyOptional({
    description: 'Subscription status',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiPropertyOptional({
    description: 'Subscription price',
    example: 29.99,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  price?: number;

  @ApiPropertyOptional({
    description: 'Currency code',
    example: 'USD',
    maxLength: 3,
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @ApiPropertyOptional({
    description: 'Subscription start date',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Subscription end date',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Trial end date',
    example: '2024-01-15T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  trialEndDate?: string;

  @ApiPropertyOptional({
    description: 'Available features for this subscription',
    example: {
      therapistAccess: true,
      appointmentLimit: 10,
      questionnaireAccess: true,
    },
  })
  @IsOptional()
  @IsObject()
  features?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Usage limits for this subscription',
    example: {
      maxAppointments: 10,
      maxTherapists: 2,
      maxQuestionnaires: 5,
    },
  })
  @IsOptional()
  @IsObject()
  limits?: Record<string, number>;

  @ApiPropertyOptional({
    description: 'Payment method identifier',
    example: 'pm_1234567890',
  })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @ApiPropertyOptional({
    description: 'Stripe subscription ID',
    example: 'sub_1234567890',
  })
  @IsOptional()
  @IsString()
  stripeSubscriptionId?: string;

  @ApiPropertyOptional({
    description: 'Stripe customer ID',
    example: 'cus_1234567890',
  })
  @IsOptional()
  @IsString()
  stripeCustomerId?: string;

  @ApiPropertyOptional({
    description: 'Whether subscription auto-renews',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isAutoRenew?: boolean;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Promotional subscription',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
