import { PartialType } from '@nestjs/swagger';
import { CreateQuestionnaireDto } from './CreateQuestionnaireDto';

export class UpdateQuestionnaireDto extends PartialType(
  CreateQuestionnaireDto,
) {}
