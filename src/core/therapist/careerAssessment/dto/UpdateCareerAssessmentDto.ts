import { PartialType } from '@nestjs/swagger';
import { CreateCareerAssessmentDto } from './CreateCareerAssessmentDto';

export class UpdateCareerAssessmentDto extends PartialType(
  CreateCareerAssessmentDto,
) {}
