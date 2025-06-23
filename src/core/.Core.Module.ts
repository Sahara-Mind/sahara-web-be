import { Module } from '@nestjs/common';
import { UserModule } from './user/User.Module';
import { AuthModule } from './auth/Auth.Module';
import { TherapistModule } from './therapist/Therapist.Module';
import { AppointmentModule } from './appointment/Appointment.Module';
@Module({
  imports: [UserModule, AuthModule, TherapistModule, AppointmentModule],
})
export class CoreModule {}
