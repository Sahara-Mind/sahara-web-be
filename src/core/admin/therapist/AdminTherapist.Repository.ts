import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Therapist } from '../../entities';
import { CreateTherapistDto } from './dto/CreateTherapistDto';
import { UpdateTherapistDto } from './dto/UpdateTherapistDto';
import { FilterTherapistDto } from './dto/FilterTherapistDto';

@Injectable()
export class AdminTherapistRepository {
  constructor(
    @InjectRepository(Therapist)
    private readonly therapistRepository: Repository<Therapist>,
  ) {}

  async createTherapist(dto: CreateTherapistDto): Promise<Therapist> {
    const therapist = this.therapistRepository.create(dto);
    return await this.therapistRepository.save(therapist);
  }

  async findAllTherapists(filter: FilterTherapistDto): Promise<Therapist[]> {
    const queryBuilder =
      this.therapistRepository.createQueryBuilder('therapist');

    if (filter.language) {
      queryBuilder.andWhere('therapist.languages @> ARRAY[:language]', {
        language: filter.language,
      });
    }

    if (filter.specialization) {
      queryBuilder.andWhere('therapist.specialization = :specialization', {
        specialization: filter.specialization,
      });
    }

    if (filter.gender) {
      queryBuilder.andWhere('therapist.gender = :gender', {
        gender: filter.gender,
      });
    }

    if (filter.minYearsExperience) {
      queryBuilder.andWhere('therapist.yearsOfExperience >= :minYears', {
        minYears: filter.minYearsExperience,
      });
    }

    return await queryBuilder.getMany();
  }

  async findTherapistById(id: string): Promise<Therapist | null> {
    return await this.therapistRepository.findOne({ where: { id } });
  }

  async updateTherapist(
    id: string,
    dto: UpdateTherapistDto,
  ): Promise<Therapist | null> {
    await this.therapistRepository.update(id, dto);
    return await this.findTherapistById(id);
  }

  async deleteTherapist(id: string): Promise<void> {
    await this.therapistRepository.delete(id);
  }
}
