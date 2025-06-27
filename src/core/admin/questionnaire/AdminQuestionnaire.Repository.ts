import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionnaire } from '../../entities/Questionnaire.Entity';
import { CreateQuestionnaireDto } from './dto/CreateQuestionnaireDto';
import { UpdateQuestionnaireDto } from './dto/UpdateQuestionnaireDto';
import { FilterQuestionnaireDto } from './dto/FilterQuestionnaireDto';

@Injectable()
export class AdminQuestionnaireRepository {
  constructor(
    @InjectRepository(Questionnaire)
    private readonly questionnaireRepository: Repository<Questionnaire>,
  ) {}

  async create(
    createQuestionnaireDto: CreateQuestionnaireDto,
  ): Promise<Questionnaire> {
    const questionnaire = this.questionnaireRepository.create(
      createQuestionnaireDto,
    );
    return await this.questionnaireRepository.save(questionnaire);
  }

  async findAll(filterDto?: FilterQuestionnaireDto): Promise<Questionnaire[]> {
    const queryBuilder =
      this.questionnaireRepository.createQueryBuilder('questionnaire');

    if (filterDto?.type) {
      queryBuilder.andWhere('questionnaire.type = :type', {
        type: filterDto.type,
      });
    }

    if (filterDto?.isActive !== undefined) {
      queryBuilder.andWhere('questionnaire.isActive = :isActive', {
        isActive: filterDto.isActive,
      });
    }

    if (filterDto?.isPublished !== undefined) {
      queryBuilder.andWhere('questionnaire.isPublished = :isPublished', {
        isPublished: filterDto.isPublished,
      });
    }

    if (filterDto?.search) {
      queryBuilder.andWhere(
        '(questionnaire.title ILIKE :search OR questionnaire.description ILIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    queryBuilder.orderBy('questionnaire.createdAt', 'DESC');

    if (filterDto?.limit) {
      queryBuilder.limit(filterDto.limit);
    }

    if (filterDto?.offset) {
      queryBuilder.offset(filterDto.offset);
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Questionnaire | null> {
    return await this.questionnaireRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateQuestionnaireDto: UpdateQuestionnaireDto,
  ): Promise<Questionnaire | null> {
    await this.questionnaireRepository.update(id, updateQuestionnaireDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.questionnaireRepository.delete(id);
  }

  async count(filterDto?: FilterQuestionnaireDto): Promise<number> {
    const queryBuilder =
      this.questionnaireRepository.createQueryBuilder('questionnaire');

    if (filterDto?.type) {
      queryBuilder.andWhere('questionnaire.type = :type', {
        type: filterDto.type,
      });
    }

    if (filterDto?.isActive !== undefined) {
      queryBuilder.andWhere('questionnaire.isActive = :isActive', {
        isActive: filterDto.isActive,
      });
    }

    if (filterDto?.isPublished !== undefined) {
      queryBuilder.andWhere('questionnaire.isPublished = :isPublished', {
        isPublished: filterDto.isPublished,
      });
    }

    if (filterDto?.search) {
      queryBuilder.andWhere(
        '(questionnaire.title ILIKE :search OR questionnaire.description ILIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    return await queryBuilder.getCount();
  }
}
