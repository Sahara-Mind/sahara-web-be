import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AdminSubscriptionRepository } from './AdminSubscription.Repository';
import { CreateSubscriptionDto } from './dto/CreateSubscriptionDto';
import { UpdateSubscriptionDto } from './dto/UpdateSubscriptionDto';
import { FilterSubscriptionDto } from './dto/FilterSubscriptionDto';
import { SubscriptionEntity } from '../../entities/Subscription.Entity';
import {
  SubscriptionTier,
  SubscriptionStatus,
} from '../../../lib/enums/SubscriptionEnum';

@Injectable()
export class AdminSubscriptionService {
  constructor(
    private readonly subscriptionRepository: AdminSubscriptionRepository,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    // Check if user already has an active subscription
    const existingSubscription =
      await this.subscriptionRepository.findActiveByUserId(
        createSubscriptionDto.userId,
      );

    if (existingSubscription) {
      throw new BadRequestException('User already has an active subscription');
    }

    // Set default features and limits based on tier
    const subscriptionData = {
      ...createSubscriptionDto,
      features:
        createSubscriptionDto.features ||
        this.getDefaultFeatures(createSubscriptionDto.tier),
      limits:
        createSubscriptionDto.limits ||
        this.getDefaultLimits(createSubscriptionDto.tier),
      price:
        createSubscriptionDto.price ||
        this.getDefaultPrice(createSubscriptionDto.tier),
    };

    // Set trial end date for trial subscriptions
    if (
      createSubscriptionDto.tier === SubscriptionTier.TRIAL &&
      !createSubscriptionDto.trialEndDate
    ) {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial
      subscriptionData.trialEndDate = trialEndDate.toISOString();
    }

    return await this.subscriptionRepository.create(subscriptionData);
  }

  async findAll(filterDto: FilterSubscriptionDto) {
    const { data, total } =
      await this.subscriptionRepository.findAll(filterDto);
    const totalPages = Math.ceil(total / filterDto.limit);

    return {
      data,
      total,
      page: filterDto.page,
      limit: filterDto.limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionRepository.findOne(id);
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return subscription;
  }

  async findByUserId(userId: string): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.findByUserId(userId);
  }

  async findActiveByUserId(userId: string): Promise<SubscriptionEntity | null> {
    return await this.subscriptionRepository.findActiveByUserId(userId);
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    const subscription = await this.findOne(id);

    // If tier is being updated, update features and limits
    if (
      updateSubscriptionDto.tier &&
      updateSubscriptionDto.tier !== subscription.tier
    ) {
      updateSubscriptionDto.features =
        updateSubscriptionDto.features ||
        this.getDefaultFeatures(updateSubscriptionDto.tier);
      updateSubscriptionDto.limits =
        updateSubscriptionDto.limits ||
        this.getDefaultLimits(updateSubscriptionDto.tier);
      updateSubscriptionDto.price =
        updateSubscriptionDto.price ||
        this.getDefaultPrice(updateSubscriptionDto.tier);
    }

    const updatedSubscription = await this.subscriptionRepository.update(
      id,
      updateSubscriptionDto,
    );
    if (!updatedSubscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return updatedSubscription;
  }

  async cancelSubscription(
    id: string,
    reason?: string,
  ): Promise<SubscriptionEntity> {
    const subscription = await this.findOne(id);

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new BadRequestException('Subscription is already cancelled');
    }

    const cancelledSubscription =
      await this.subscriptionRepository.cancelSubscription(id, reason);
    if (!cancelledSubscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return cancelledSubscription;
  }

  async reactivateSubscription(id: string): Promise<SubscriptionEntity> {
    const subscription = await this.findOne(id);

    if (subscription.status !== SubscriptionStatus.CANCELLED) {
      throw new BadRequestException(
        'Only cancelled subscriptions can be reactivated',
      );
    }

    const reactivatedSubscription =
      await this.subscriptionRepository.reactivateSubscription(id);
    if (!reactivatedSubscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return reactivatedSubscription;
  }

  async upgradeSubscription(
    id: string,
    newTier: SubscriptionTier,
  ): Promise<SubscriptionEntity> {
    const subscription = await this.findOne(id);

    const tierHierarchy = [
      SubscriptionTier.TRIAL,
      SubscriptionTier.BASIC,
      SubscriptionTier.STANDARD,
      SubscriptionTier.PREMIUM,
    ];

    const currentTierIndex = tierHierarchy.indexOf(subscription.tier);
    const newTierIndex = tierHierarchy.indexOf(newTier);

    if (newTierIndex <= currentTierIndex) {
      throw new BadRequestException(
        'New tier must be higher than current tier for upgrade',
      );
    }

    return await this.update(id, {
      tier: newTier,
      features: this.getDefaultFeatures(newTier),
      limits: this.getDefaultLimits(newTier),
      price: this.getDefaultPrice(newTier),
    });
  }

  async downgradeSubscription(
    id: string,
    newTier: SubscriptionTier,
  ): Promise<SubscriptionEntity> {
    const subscription = await this.findOne(id);

    const tierHierarchy = [
      SubscriptionTier.TRIAL,
      SubscriptionTier.BASIC,
      SubscriptionTier.STANDARD,
      SubscriptionTier.PREMIUM,
    ];

    const currentTierIndex = tierHierarchy.indexOf(subscription.tier);
    const newTierIndex = tierHierarchy.indexOf(newTier);

    if (newTierIndex >= currentTierIndex) {
      throw new BadRequestException(
        'New tier must be lower than current tier for downgrade',
      );
    }

    return await this.update(id, {
      tier: newTier,
      features: this.getDefaultFeatures(newTier),
      limits: this.getDefaultLimits(newTier),
      price: this.getDefaultPrice(newTier),
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Ensure subscription exists
    await this.subscriptionRepository.remove(id);
  }

  async getSubscriptionStats() {
    return await this.subscriptionRepository.getSubscriptionStats();
  }

  async processExpiredSubscriptions(): Promise<number> {
    const expiredSubscriptions =
      await this.subscriptionRepository.findExpiredSubscriptions();
    let processedCount = 0;

    for (const subscription of expiredSubscriptions) {
      await this.subscriptionRepository.update(subscription.id, {
        status: SubscriptionStatus.EXPIRED,
      });
      processedCount++;
    }

    return processedCount;
  }

  async getTrialExpiringSoon(days: number = 7): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.findTrialExpiringSoon(days);
  }

  async checkUserSubscriptionAccess(
    userId: string,
    feature: string,
  ): Promise<boolean> {
    const subscription =
      await this.subscriptionRepository.findActiveByUserId(userId);

    if (!subscription) {
      return false;
    }

    // Check if subscription is expired
    if (subscription.endDate && subscription.endDate < new Date()) {
      return false;
    }

    // Check if trial is expired
    if (
      subscription.tier === SubscriptionTier.TRIAL &&
      subscription.trialEndDate &&
      subscription.trialEndDate < new Date()
    ) {
      return false;
    }

    // Check if feature is available in current tier
    return subscription.features?.[feature] === true;
  }

  async checkUserSubscriptionLimit(
    userId: string,
    limitType: string,
  ): Promise<{ hasAccess: boolean; currentLimit: number; used?: number }> {
    const subscription =
      await this.subscriptionRepository.findActiveByUserId(userId);

    if (!subscription) {
      return { hasAccess: false, currentLimit: 0 };
    }

    const currentLimit = subscription.limits?.[limitType] || 0;

    return {
      hasAccess: currentLimit > 0,
      currentLimit,
      // TODO: Implement usage tracking to return 'used' count
    };
  }

  private getDefaultFeatures(tier: SubscriptionTier): Record<string, any> {
    const features = {
      [SubscriptionTier.TRIAL]: {
        therapistAccess: true,
        appointmentBooking: true,
        basicQuestionnaires: true,
        emailSupport: true,
        dashboardAccess: true,
        exportData: false,
        advancedAnalytics: false,
        prioritySupport: false,
        customBranding: false,
      },
      [SubscriptionTier.BASIC]: {
        therapistAccess: true,
        appointmentBooking: true,
        basicQuestionnaires: true,
        emailSupport: true,
        dashboardAccess: true,
        exportData: true,
        advancedAnalytics: false,
        prioritySupport: false,
        customBranding: false,
      },
      [SubscriptionTier.STANDARD]: {
        therapistAccess: true,
        appointmentBooking: true,
        basicQuestionnaires: true,
        advancedQuestionnaires: true,
        emailSupport: true,
        dashboardAccess: true,
        exportData: true,
        advancedAnalytics: true,
        prioritySupport: false,
        customBranding: false,
      },
      [SubscriptionTier.PREMIUM]: {
        therapistAccess: true,
        appointmentBooking: true,
        basicQuestionnaires: true,
        advancedQuestionnaires: true,
        emailSupport: true,
        dashboardAccess: true,
        exportData: true,
        advancedAnalytics: true,
        prioritySupport: true,
        customBranding: true,
        apiAccess: true,
        whiteLabel: true,
      },
    };

    return features[tier] || {};
  }

  private getDefaultLimits(tier: SubscriptionTier): Record<string, number> {
    const limits = {
      [SubscriptionTier.TRIAL]: {
        maxAppointments: 5,
        maxTherapists: 1,
        maxQuestionnaires: 3,
        maxPatients: 10,
        storageGB: 1,
      },
      [SubscriptionTier.BASIC]: {
        maxAppointments: 50,
        maxTherapists: 3,
        maxQuestionnaires: 10,
        maxPatients: 100,
        storageGB: 5,
      },
      [SubscriptionTier.STANDARD]: {
        maxAppointments: 200,
        maxTherapists: 10,
        maxQuestionnaires: 50,
        maxPatients: 500,
        storageGB: 20,
      },
      [SubscriptionTier.PREMIUM]: {
        maxAppointments: -1, // Unlimited
        maxTherapists: -1, // Unlimited
        maxQuestionnaires: -1, // Unlimited
        maxPatients: -1, // Unlimited
        storageGB: 100,
      },
    };

    return limits[tier] || {};
  }

  private getDefaultPrice(tier: SubscriptionTier): number {
    const prices = {
      [SubscriptionTier.TRIAL]: 0,
      [SubscriptionTier.BASIC]: 29.99,
      [SubscriptionTier.STANDARD]: 79.99,
      [SubscriptionTier.PREMIUM]: 199.99,
    };

    return prices[tier] || 0;
  }
}
