import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../../entities/Appointment.Entity';

@Injectable()
export class TherapistAppointmentRepository {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async findAllByTherapistId(therapistId: string): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { therapistId },
      relations: ['user', 'therapist'],
      order: { appointmentDate: 'DESC', startTime: 'ASC' },
    });
  }

  async findOneByIdAndTherapistId(
    id: string,
    therapistId: string,
  ): Promise<Appointment | null> {
    return await this.appointmentRepository.findOne({
      where: { id, therapistId },
      relations: ['user', 'therapist'],
    });
  }

  async findUpcomingAppointmentsByTherapistId(
    therapistId: string,
  ): Promise<Appointment[]> {
    const now = new Date();
    return await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.user', 'user')
      .leftJoinAndSelect('appointment.therapist', 'therapist')
      .where('appointment.therapistId = :therapistId', { therapistId })
      .andWhere('appointment.appointmentDate >= :now', { now })
      .orderBy('appointment.appointmentDate', 'ASC')
      .addOrderBy('appointment.startTime', 'ASC')
      .getMany();
  }

  async findPastAppointmentsByTherapistId(
    therapistId: string,
  ): Promise<Appointment[]> {
    const now = new Date();
    return await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.user', 'user')
      .leftJoinAndSelect('appointment.therapist', 'therapist')
      .where('appointment.therapistId = :therapistId', { therapistId })
      .andWhere('appointment.appointmentDate < :now', { now })
      .orderBy('appointment.appointmentDate', 'DESC')
      .addOrderBy('appointment.startTime', 'DESC')
      .getMany();
  }

  async findTodayAppointmentsByTherapistId(
    therapistId: string,
  ): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.user', 'user')
      .leftJoinAndSelect('appointment.therapist', 'therapist')
      .where('appointment.therapistId = :therapistId', { therapistId })
      .andWhere('appointment.appointmentDate >= :today', { today })
      .andWhere('appointment.appointmentDate < :tomorrow', { tomorrow })
      .orderBy('appointment.startTime', 'ASC')
      .getMany();
  }

  async countAppointmentsByTherapistId(therapistId: string): Promise<number> {
    return await this.appointmentRepository.count({
      where: { therapistId },
    });
  }

  async findAppointmentsByDateAndTherapistId(
    therapistId: string,
    date: Date,
  ): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.user', 'user')
      .leftJoinAndSelect('appointment.therapist', 'therapist')
      .where('appointment.therapistId = :therapistId', { therapistId })
      .andWhere('appointment.appointmentDate >= :startOfDay', { startOfDay })
      .andWhere('appointment.appointmentDate <= :endOfDay', { endOfDay })
      .orderBy('appointment.startTime', 'ASC')
      .getMany();
  }
}
