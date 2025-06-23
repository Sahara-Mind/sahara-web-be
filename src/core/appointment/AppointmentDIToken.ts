import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/Appointment.Entity';

export class AppointmentDIToken {
  static readonly AppointmentSymbol = 'Appointment';
  static readonly AppointmentEntity = TypeOrmModule.forFeature([Appointment]);
}
