import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../../entities';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';

@Injectable()
export class AdminAppointmentRepository {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async createAppointment(dto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentRepository.create({
      ...dto,
      userId: dto.userId,
    });
    return await this.appointmentRepository.save(appointment);
  }

  async findAllAppointments(): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      relations: ['user', 'therapist'],
    });
  }

  async findAppointmentById(id: string): Promise<Appointment | null> {
    return await this.appointmentRepository.findOne({
      where: { id },
      relations: ['user', 'therapist'],
    });
  }

  async updateAppointment(id: string, dto: any): Promise<Appointment | null> {
    await this.appointmentRepository.update(id, dto);
    return await this.findAppointmentById(id);
  }

  async deleteAppointment(id: string): Promise<void> {
    await this.appointmentRepository.delete(id);
  }
}
