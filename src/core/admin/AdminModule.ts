import { Module } from '@nestjs/common';
import { AdminAppointmentModule } from './appointment/AdminAppointment.Module';
import { AdminTherapistModule } from './therapist/AdminTherapist.Module';

@Module({
  imports: [AdminAppointmentModule, AdminTherapistModule],
})
export class AdminModule {}
