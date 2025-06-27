import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from '../../entities/Subscription.Entity';

export const AdminSubscriptionDIToken = {
  AdminSubscriptionEntity: TypeOrmModule.forFeature([SubscriptionEntity]),
};
