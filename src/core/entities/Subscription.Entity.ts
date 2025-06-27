import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import {
  SubscriptionTier,
  SubscriptionStatus,
} from '../../lib/enums/SubscriptionEnum';

@Entity('subscriptions')
@Index(['userId', 'status'])
@Index(['tier', 'status'])
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({
    type: 'enum',
    enum: SubscriptionTier,
    default: SubscriptionTier.TRIAL,
  })
  tier: SubscriptionTier;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING,
  })
  status: SubscriptionStatus;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  trialEndDate: Date;

  @Column('json', { nullable: true })
  features: Record<string, any>;

  @Column('json', { nullable: true })
  limits: Record<string, number>;

  @Column({ nullable: true })
  paymentMethodId: string;

  @Column({ nullable: true })
  stripeSubscriptionId: string;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ type: 'timestamp', nullable: true })
  lastPaymentDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextPaymentDate: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ default: true })
  isAutoRenew: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
