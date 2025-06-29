import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from '../../infra/queue/Queue.Module';
import { NotificationController } from './Notification.Controller';
import { NotificationService } from './Notification.Service';
import { QueueInfoController } from './QueueInfo.Controller';
import { BullBoardMiddleware } from '../../lib/middleware';
import { QUEUE_NAMES } from '../../lib/constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAMES.EMAIL_NOTIFICATIONS,
    }),
    QueueModule,
  ],
  controllers: [NotificationController, QueueInfoController],
  providers: [NotificationService, BullBoardMiddleware],
  exports: [NotificationService],
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BullBoardMiddleware).forRoutes('admin/queues');
  }
}
