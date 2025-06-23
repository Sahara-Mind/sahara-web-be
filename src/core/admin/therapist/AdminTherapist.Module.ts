import { Module } from '@nestjs/common';
import { AdminTherapistController } from './AdminTherapist.Controller';
import { AdminTherapistService } from './AdminTherapist.Service';
import { AdminTherapistRepository } from './AdminTherapist.Repository';
import { AdminTherapistDIToken } from './AdminTherapistDIToken';

@Module({
  imports: [AdminTherapistDIToken.AdminTherapistEntity],
  controllers: [AdminTherapistController],
  providers: [AdminTherapistService, AdminTherapistRepository],
  exports: [AdminTherapistService],
})
export class AdminTherapistModule {}
