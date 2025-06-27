import { TypeOrmModule } from '@nestjs/typeorm';
import { Questionnaire } from '../../entities/Questionnaire.Entity';

export const AdminQuestionnaireDIToken = {
  AdminQuestionnaireEntity: TypeOrmModule.forFeature([Questionnaire]),
};
