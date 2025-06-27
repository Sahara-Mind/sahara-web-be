import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { SubscriptionEntity } from '../../entities/Subscription.Entity';
import {
  SubscriptionStatus,
  SubscriptionTier,
} from '../../../lib/enums/SubscriptionEnum';
import { CreateSubscriptionDto } from './dto/CreateSubscriptionDto';
import { UpdateSubscriptionDto } from './dto/UpdateSubscriptionDto';
import { FilterSubscriptionDto } from './dto/FilterSubscriptionDto';

@Injectable()
export class AdminSubscriptionRepository {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    const subscription = this.subscriptionRepository.create({
      ...createSubscriptionDto,
      startDate: createSubscriptionDto.startDate
        ? new Date(createSubscriptionDto.startDate)
        : undefined,
      endDate: createSubscriptionDto.endDate
        ? new Date(createSubscriptionDto.endDate)
        : undefined,
      trialEndDate: createSubscriptionDto.trialEndDate
        ? new Date(createSubscriptionDto.trialEndDate)
        : undefined,
    });

    return await this.subscriptionRepository.save(subscription);
  }

  async findAll(
    filterDto: FilterSubscriptionDto,
  ): Promise<{ data: SubscriptionEntity[]; total: number }> {
    const { page = 1, limit = 10, ...filters } = filterDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.buildFilterQuery(filters);

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('subscription.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: string): Promise<SubscriptionEntity | null> {
    return await this.subscriptionRepository.findOne({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByUserId(userId: string): Promise<SubscriptionEntity | null> {
    return await this.subscriptionRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStripeCustomerId(
    stripeCustomerId: string,
  ): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.find({
      where: { stripeCustomerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findExpiredSubscriptions(): Promise<SubscriptionEntity[]> {
    const now = new Date();
    return await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.endDate < :now', { now })
      .andWhere('subscription.status = :status', {
        status: SubscriptionStatus.ACTIVE,
      })
      .getMany();
  }

  async findTrialExpiringSoon(days: number = 7): Promise<SubscriptionEntity[]> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    return await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.trialEndDate <= :expiryDate', { expiryDate })
      .andWhere('subscription.trialEndDate > :now', { now: new Date() })
      .andWhere('subscription.tier = :tier', { tier: SubscriptionTier.TRIAL })
      .andWhere('subscription.status = :status', {
        status: SubscriptionStatus.ACTIVE,
      })
      .getMany();
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionEntity | null> {
    const updateData = {
      ...updateSubscriptionDto,
      startDate: updateSubscriptionDto.startDate
        ? new Date(updateSubscriptionDto.startDate)
        : undefined,
      endDate: updateSubscriptionDto.endDate
        ? new Date(updateSubscriptionDto.endDate)
        : undefined,
      trialEndDate: updateSubscriptionDto.trialEndDate
        ? new Date(updateSubscriptionDto.trialEndDate)
        : undefined,
    };

    await this.subscriptionRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async cancelSubscription(
    id: string,
    reason?: string,
  ): Promise<SubscriptionEntity | null> {
    await this.subscriptionRepository.update(id, {
      status: SubscriptionStatus.CANCELLED,
      cancellationReason: reason,
      cancelledAt: new Date(),
      isAutoRenew: false,
    });
    return await this.findOne(id);
  }

  async reactivateSubscription(id: string): Promise<SubscriptionEntity | null> {
    await this.subscriptionRepository.update(id, {
      status: SubscriptionStatus.ACTIVE,
      cancellationReason: null,
      cancelledAt: null,
    });
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.subscriptionRepository.delete(id);
  }

  async getSubscriptionStats(): Promise<{
    total: number;
    byTier: Record<SubscriptionTier, number>;
    byStatus: Record<SubscriptionStatus, number>;
    activeRevenue: number;
  }> {
    const total = await this.subscriptionRepository.count();

    const tierStats = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .select('subscription.tier', 'tier')
      .addSelect('COUNT(*)', 'count')
      .groupBy('subscription.tier')
      .getRawMany();

    const statusStats = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .select('subscription.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('subscription.status')
      .getRawMany();

    const revenueResult = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .select('SUM(subscription.price)', 'revenue')
      .where('subscription.status = :status', {
        status: SubscriptionStatus.ACTIVE,
      })
      .getRawOne();

    const byTier = {} as Record<SubscriptionTier, number>;
    Object.values(SubscriptionTier).forEach((tier) => (byTier[tier] = 0));
    tierStats.forEach((stat) => (byTier[stat.tier] = parseInt(stat.count)));

    const byStatus = {} as Record<SubscriptionStatus, number>;
    Object.values(SubscriptionStatus).forEach(
      (status) => (byStatus[status] = 0),
    );
    statusStats.forEach(
      (stat) => (byStatus[stat.status] = parseInt(stat.count)),
    );

    return {
      total,
      byTier,
      byStatus,
      activeRevenue: parseFloat(revenueResult?.revenue || '0'),
    };
  }

  private buildFilterQuery(
    filters: Omit<FilterSubscriptionDto, 'page' | 'limit'>,
  ): SelectQueryBuilder<SubscriptionEntity> {
    const queryBuilder =
      this.subscriptionRepository.createQueryBuilder('subscription');

    if (filters.userId) {
      queryBuilder.andWhere('subscription.userId = :userId', {
        userId: filters.userId,
      });
    }

    if (filters.tier) {
      queryBuilder.andWhere('subscription.tier = :tier', {
        tier: filters.tier,
      });
    }

    if (filters.status) {
      queryBuilder.andWhere('subscription.status = :status', {
        status: filters.status,
      });
    }

    if (filters.stripeCustomerId) {
      queryBuilder.andWhere(
        'subscription.stripeCustomerId = :stripeCustomerId',
        {
          stripeCustomerId: filters.stripeCustomerId,
        },
      );
    }

    if (filters.createdAfter) {
      queryBuilder.andWhere('subscription.createdAt >= :createdAfter', {
        createdAfter: new Date(filters.createdAfter),
      });
    }

    if (filters.createdBefore) {
      queryBuilder.andWhere('subscription.createdAt <= :createdBefore', {
        createdBefore: new Date(filters.createdBefore),
      });
    }

    if (filters.isExpired !== undefined) {
      const now = new Date();
      if (filters.isExpired) {
        queryBuilder.andWhere('subscription.endDate < :now', { now });
      } else {
        queryBuilder.andWhere(
          '(subscription.endDate IS NULL OR subscription.endDate > :now)',
          { now },
        );
      }
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(subscription.notes ILIKE :search OR subscription.cancellationReason ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    return queryBuilder;
  }
}
