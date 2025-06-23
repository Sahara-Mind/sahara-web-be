import { Module } from '@nestjs/common';
import { AdminAppointmentController } from './AdminAppointment.Controller';
import { AdminAppointmentService } from './AdminAppointment.Service';
import { AdminAppointmentRepository } from './AdminAppointment.Repository';
import { AdminAppointmentDIToken } from './AdminAppointmentDIToken';

@Module({
  imports: [AdminAppointmentDIToken.AdminAppointmentEntity],
  controllers: [AdminAppointmentController],
  providers: [AdminAppointmentService, AdminAppointmentRepository],
  exports: [AdminAppointmentService],
})
export class AdminAppointmentModule {}
