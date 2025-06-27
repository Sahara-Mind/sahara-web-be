import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../../entities/Appointment.Entity';

export const TherapistAppointmentDIToken = {
  TherapistAppointmentEntity: TypeOrmModule.forFeature([Appointment]),
};
