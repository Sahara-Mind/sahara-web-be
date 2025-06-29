import { TypeOrmModule } from '@nestjs/typeorm';
import { CareerAssessment, CareerAssessmentAssignment } from '../../entities';

export const TherapistCareerAssessmentDIToken = {
  CareerAssessmentEntity: TypeOrmModule.forFeature([CareerAssessment]),
  CareerAssessmentAssignmentEntity: TypeOrmModule.forFeature([
    CareerAssessmentAssignment,
  ]),
};
