import { Module } from '@nestjs/common';
import { UserModule } from './user/User.Module';
import { AuthModule } from './auth/Auth.Module';
import { AdminModule } from './admin/AdminModule';
import { TherapistModule } from './therapist/Therapist.Module';

@Module({
  imports: [UserModule, AuthModule, AdminModule, TherapistModule],
})
export class CoreModule {}
