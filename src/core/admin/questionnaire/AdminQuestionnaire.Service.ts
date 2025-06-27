import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminQuestionnaireRepository } from './AdminQuestionnaire.Repository';
import { CreateQuestionnaireDto } from './dto/CreateQuestionnaireDto';
import { UpdateQuestionnaireDto } from './dto/UpdateQuestionnaireDto';
import { FilterQuestionnaireDto } from './dto/FilterQuestionnaireDto';
import { Questionnaire } from '../../entities/Questionnaire.Entity';

@Injectable()
export class AdminQuestionnaireService {
  constructor(
    private readonly adminQuestionnaireRepository: AdminQuestionnaireRepository,
  ) {}

  async create(
    createQuestionnaireDto: CreateQuestionnaireDto,
  ): Promise<Questionnaire> {
    return await this.adminQuestionnaireRepository.create(
      createQuestionnaireDto,
    );
  }

  async findAll(filterDto?: FilterQuestionnaireDto): Promise<{
    data: Questionnaire[];
    total: number;
    page?: number;
    limit?: number;
  }> {
    const [data, total] = await Promise.all([
      this.adminQuestionnaireRepository.findAll(filterDto),
      this.adminQuestionnaireRepository.count(filterDto),
    ]);

    return {
      data,
      total,
      ...(filterDto?.page && { page: filterDto.page }),
      ...(filterDto?.limit && { limit: filterDto.limit }),
    };
  }

  async findOne(id: string): Promise<Questionnaire> {
    const questionnaire = await this.adminQuestionnaireRepository.findOne(id);
    if (!questionnaire) {
      throw new NotFoundException(`Questionnaire with ID ${id} not found`);
    }
    return questionnaire;
  }

  async update(
    id: string,
    updateQuestionnaireDto: UpdateQuestionnaireDto,
  ): Promise<Questionnaire> {
    const questionnaire = await this.adminQuestionnaireRepository.update(
      id,
      updateQuestionnaireDto,
    );
    if (!questionnaire) {
      throw new NotFoundException(`Questionnaire with ID ${id} not found`);
    }
    return questionnaire;
  }

  async remove(id: string): Promise<void> {
    const questionnaire = await this.adminQuestionnaireRepository.findOne(id);
    if (!questionnaire) {
      throw new NotFoundException(`Questionnaire with ID ${id} not found`);
    }
    await this.adminQuestionnaireRepository.remove(id);
  }

  async publish(id: string): Promise<Questionnaire> {
    return await this.update(id, { isPublished: true });
  }

  async unpublish(id: string): Promise<Questionnaire> {
    return await this.update(id, { isPublished: false });
  }

  async activate(id: string): Promise<Questionnaire> {
    return await this.update(id, { isActive: true });
  }

  async deactivate(id: string): Promise<Questionnaire> {
    return await this.update(id, { isActive: false });
  }
}
