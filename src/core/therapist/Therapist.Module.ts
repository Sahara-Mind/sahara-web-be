import { Module } from '@nestjs/common';

// Export the therapist modules array for reuse in Swagger configuration
// Currently empty, but ready for future therapist functionality
export const THERAPIST_MODULES: any[] = [];

@Module({
  imports: THERAPIST_MODULES,
})
export class TherapistModule {}
