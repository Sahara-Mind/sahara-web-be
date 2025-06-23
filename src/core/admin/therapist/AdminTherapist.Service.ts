import { Injectable } from '@nestjs/common';
import { AdminTherapistRepository } from './AdminTherapist.Repository';
import { Therapist } from '../../entities';
import { CreateTherapistDto } from './dto/CreateTherapistDto';
import { UpdateTherapistDto } from './dto/UpdateTherapistDto';
import { FilterTherapistDto } from './dto/FilterTherapistDto';

@Injectable()
export class AdminTherapistService {
  constructor(
    private readonly adminTherapistRepository: AdminTherapistRepository,
  ) {}

  async createTherapist(dto: CreateTherapistDto): Promise<Therapist> {
    return await this.adminTherapistRepository.createTherapist(dto);
  }

  async findAllTherapists(filter: FilterTherapistDto): Promise<Therapist[]> {
    return await this.adminTherapistRepository.findAllTherapists(filter);
  }

  async findTherapistById(id: string): Promise<Therapist | null> {
    return await this.adminTherapistRepository.findTherapistById(id);
  }

  async updateTherapist(
    id: string,
    dto: UpdateTherapistDto,
  ): Promise<Therapist | null> {
    return await this.adminTherapistRepository.updateTherapist(id, dto);
  }

  async deleteTherapist(id: string): Promise<void> {
    return await this.adminTherapistRepository.deleteTherapist(id);
  }
}
