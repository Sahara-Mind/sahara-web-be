import { Module } from '@nestjs/common';
import { TherapistCareerAssessmentController } from './TherapistCareerAssessment.Controller';
import { TherapistCareerAssessmentService } from './TherapistCareerAssessment.Service';
import { TherapistCareerAssessmentRepository } from './TherapistCareerAssessment.Repository';
import { TherapistCareerAssessmentDIToken } from './TherapistCareerAssessmentDIToken';

@Module({
  imports: [
    TherapistCareerAssessmentDIToken.CareerAssessmentEntity,
    TherapistCareerAssessmentDIToken.CareerAssessmentAssignmentEntity,
  ],
  controllers: [TherapistCareerAssessmentController],
  providers: [
    TherapistCareerAssessmentService,
    TherapistCareerAssessmentRepository,
  ],
  exports: [TherapistCareerAssessmentService],
})
export class TherapistCareerAssessmentModule {}
