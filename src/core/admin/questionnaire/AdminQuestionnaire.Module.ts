import { Module } from '@nestjs/common';
import { AdminQuestionnaireController } from './AdminQuestionnaire.Controller';
import { AdminQuestionnaireService } from './AdminQuestionnaire.Service';
import { AdminQuestionnaireRepository } from './AdminQuestionnaire.Repository';
import { AdminQuestionnaireDIToken } from './AdminQuestionnaireDIToken';

@Module({
  imports: [AdminQuestionnaireDIToken.AdminQuestionnaireEntity],
  controllers: [AdminQuestionnaireController],
  providers: [AdminQuestionnaireService, AdminQuestionnaireRepository],
  exports: [AdminQuestionnaireService],
})
export class AdminQuestionnaireModule {}
