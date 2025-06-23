import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/Appointment.Entity';
import { JwtPayload } from '../auth/Constants';

@Injectable()
export class AppointmentRepository {
  constructor(
    @InjectRepository(Appointment)
    private readonly repository: Repository<Appointment>,
  ) {}

  async createAppointment(
    appointment: Partial<Appointment>,
    user: JwtPayload,
  ): Promise<Appointment> {
    const { therapistId, appointmentDate, startTime, endTime } = appointment;

    // test if time slot is booked ??
    const conflict = await this.repository
      .createQueryBuilder('appointment')
      .where('appointment.therapistId = :therapistId', { therapistId })
      .andWhere('appointment.appointmentDate = :appointmentDate', {
        appointmentDate,
      })
      .andWhere(
        'appointment.startTime < :endTime AND appointment.endTime > :startTime',
        {
          startTime,
          endTime,
        },
      )
      .getOne();

    if (conflict) {
      throw new BadRequestException('Time slot already booked');
    }
    const newAppointment = this.repository.create({
      ...appointment,
      userId: user.sub,
    });
    return this.repository.save(newAppointment);
  }

  async findAllAppointments(): Promise<Appointment[]> {
    return this.repository.find({});
  }

  async findMyAppointments(user: JwtPayload): Promise<Appointment[]> {
    return this.repository.find({ where: { userId: user.sub } });
  }
}
