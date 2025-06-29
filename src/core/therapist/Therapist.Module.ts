import { Module } from '@nestjs/common';
import { TherapistAppointmentModule } from './appointment/TherapistAppointment.Module';
import { TherapistCareerAssessmentModule } from './careerAssessment/TherapistCareerAssessment.Module';

// Export the therapist modules array for reuse in Swagger configuration
export const THERAPIST_MODULES = [
  TherapistAppointmentModule,
  TherapistCareerAssessmentModule,
];

@Module({
  imports: THERAPIST_MODULES,
})
export class TherapistModule {}
