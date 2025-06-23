import { ConflictException, Injectable } from '@nestjs/common';
import { TherapistRepository } from './Therapist.Repository';
import { CreateTherapistDto } from './dto/CreateTherapistDto';

import { Therapist } from './entities/Therapist.Entity';
import { FilterTherapistDto } from './dto/FilterTherapistDto';

@Injectable()
export class TherapistService {
  constructor(private readonly therapistRepository: TherapistRepository) {}

  async createTherapist(
    createTherapistDto: CreateTherapistDto,
  ): Promise<Therapist> {
    const existingTherapist = await this.therapistRepository.findByEmail(
      createTherapistDto.email,
    );
    if (existingTherapist) {
      throw new ConflictException('Therapist with this mail already exists.');
    }

    const therapist =
      await this.therapistRepository.createTherapist(createTherapistDto);

    return therapist;
  }

  async findAllTherapists(filter: FilterTherapistDto): Promise<Therapist[]> {
    return this.therapistRepository.findAllTherapists(filter);
  }

  async findByEmail(email: string): Promise<Therapist> {
    return this.therapistRepository.findByEmail(email);
  }

  async findById(therapistId: string): Promise<Therapist> {
    return this.therapistRepository.findById(therapistId);
  }
}
