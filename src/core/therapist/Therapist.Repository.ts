import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Therapist } from './entities/Therapist.Entity';
import { FilterTherapistDto } from './dto/FilterTherapistDto';

@Injectable()
export class TherapistRepository {
  constructor(
    @InjectRepository(Therapist)
    private readonly repository: Repository<Therapist>,
  ) {}

  async createTherapist(therapist: Partial<Therapist>): Promise<Therapist> {
    const newTherapist = this.repository.create(therapist);
    return this.repository.save(newTherapist);
  }

  async findByEmail(email: string): Promise<Therapist> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(therapistId: string): Promise<Therapist> {
    return this.repository.findOne({ where: { id: therapistId } });
  }

  async findAllTherapists(filter: FilterTherapistDto): Promise<Therapist[]> {
    const query = this.repository.createQueryBuilder('therapist');

    // language filter applied
    if (filter?.language) {
      query.andWhere(':language = ANY(therapist.languages)', {
        language: filter.language,
      });
    }

    // specialization filter applied
    if (filter?.specialization) {
      query.andWhere('therapist.specialization = :specialization', {
        specialization: filter.specialization,
      });
    }

    // gender filter applied
    if (filter?.gender) {
      query.andWhere('therapist.gender = :gender', {
        gender: filter.gender,
      });
    }

    // minYearsExperience filter applied
    if (filter?.minYearsExperience) {
      query.andWhere('therapist.yearsOfExperience >= :years', {
        years: filter.minYearsExperience,
      });
    }

    return query.getMany();
  }
}
