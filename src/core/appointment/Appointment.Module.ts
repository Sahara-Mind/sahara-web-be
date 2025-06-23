import { Module } from '@nestjs/common';

import { AppointmentController } from './Appointment.Controller';
import { AppointmentRepository } from './Appointment.Repository';
import { AppointmentService } from './Appointment.Service';
import { AppointmentDIToken } from './AppointmentDIToken';

@Module({
  imports: [AppointmentDIToken.AppointmentEntity],
  controllers: [AppointmentController],
  providers: [AppointmentRepository, AppointmentService],
  exports: [AppointmentService, AppointmentRepository],
})
export class AppointmentModule {}
