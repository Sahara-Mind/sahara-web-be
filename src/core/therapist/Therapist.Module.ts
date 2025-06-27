import { Module } from '@nestjs/common';
import { TherapistAppointmentModule } from './appointment/TherapistAppointment.Module';

// Export the therapist modules array for reuse in Swagger configuration
export const THERAPIST_MODULES = [TherapistAppointmentModule];

@Module({
  imports: THERAPIST_MODULES,
})
export class TherapistModule {}
