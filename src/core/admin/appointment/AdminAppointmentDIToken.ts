import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../../entities';

export class AdminAppointmentDIToken {
  static readonly AdminAppointmentSymbol = 'AdminAppointment';
  static readonly AdminAppointmentEntity = TypeOrmModule.forFeature([
    Appointment,
  ]);
}
