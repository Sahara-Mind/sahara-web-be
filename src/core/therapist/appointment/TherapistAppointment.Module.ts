import { Module } from '@nestjs/common';
import { TherapistAppointmentController } from './TherapistAppointment.Controller';
import { TherapistAppointmentService } from './TherapistAppointment.Service';
import { TherapistAppointmentRepository } from './TherapistAppointment.Repository';
import { TherapistAppointmentDIToken } from './TherapistAppointmentDIToken';

@Module({
  imports: [TherapistAppointmentDIToken.TherapistAppointmentEntity],
  controllers: [TherapistAppointmentController],
  providers: [TherapistAppointmentService, TherapistAppointmentRepository],
  exports: [TherapistAppointmentService],
})
export class TherapistAppointmentModule {}
