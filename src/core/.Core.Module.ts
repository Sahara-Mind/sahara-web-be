import { Module } from '@nestjs/common';
import { AdminModule } from './admin/Admin.Module';
import { TherapistModule } from './therapist/Therapist.Module';
import { AuthModule } from './auth/Auth.Module';
import { UserModule } from './user/User.Module';
import { NotificationModule } from './notification/Notification.Module';

// Export the public modules array for reuse in Swagger configuration
export const PUBLIC_MODULES = [AuthModule, UserModule, NotificationModule];

@Module({
  imports: [...PUBLIC_MODULES, AdminModule, TherapistModule],
})
export class CoreModule {}
