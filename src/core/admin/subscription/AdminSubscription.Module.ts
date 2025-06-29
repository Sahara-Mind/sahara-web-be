import { Module } from '@nestjs/common';
import { AdminSubscriptionController } from './AdminSubscription.Controller';
import { AdminSubscriptionService } from './AdminSubscription.Service';
import { AdminSubscriptionRepository } from './AdminSubscription.Repository';
import { AdminSubscriptionDIToken } from './AdminSubscriptionDIToken';

@Module({
  imports: [AdminSubscriptionDIToken.AdminSubscriptionEntity],
  controllers: [AdminSubscriptionController],
  providers: [AdminSubscriptionService, AdminSubscriptionRepository],
  exports: [AdminSubscriptionService],
})
export class AdminSubscriptionModule {}
