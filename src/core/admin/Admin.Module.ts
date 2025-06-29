import { Module } from '@nestjs/common';
import { AdminAppointmentModule } from './appointment/AdminAppointment.Module';
import { AdminTherapistModule } from './therapist/AdminTherapist.Module';
import { AdminQuestionnaireModule } from './questionnaire/AdminQuestionnaire.Module';
import { AdminSubscriptionModule } from './subscription/AdminSubscription.Module';

// Export the admin modules array for reuse in Swagger configuration
export const ADMIN_MODULES = [
  AdminAppointmentModule,
  AdminTherapistModule,
  AdminQuestionnaireModule,
  AdminSubscriptionModule,
];

@Module({
  imports: ADMIN_MODULES,
})
export class AdminModule {}
