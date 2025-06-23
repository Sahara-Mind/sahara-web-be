import { Module } from '@nestjs/common';
import { AdminAppointmentModule } from './appointment/AdminAppointment.Module';
import { AdminTherapistModule } from './therapist/AdminTherapist.Module';

// Export the admin modules array for reuse in Swagger configuration
export const ADMIN_MODULES = [AdminAppointmentModule, AdminTherapistModule];

@Module({
  imports: ADMIN_MODULES,
})
export class AdminModule {}
