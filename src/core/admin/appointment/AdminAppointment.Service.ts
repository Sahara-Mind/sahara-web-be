import { Injectable } from '@nestjs/common';
import { AdminAppointmentRepository } from './AdminAppointment.Repository';
import { Appointment } from '../../entities';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';

@Injectable()
export class AdminAppointmentService {
  constructor(
    private readonly adminAppointmentRepository: AdminAppointmentRepository,
  ) {}

  async createAppointment(dto: CreateAppointmentDto): Promise<Appointment> {
    return await this.adminAppointmentRepository.createAppointment(dto);
  }

  async findAllAppointments(): Promise<Appointment[]> {
    const appointments =
      await this.adminAppointmentRepository.findAllAppointments();
    appointments.forEach((app) => {
      if (app.user) delete app.user.password;
    });
    return appointments;
  }

  async findAppointmentById(id: string): Promise<Appointment | null> {
    const appointment =
      await this.adminAppointmentRepository.findAppointmentById(id);
    if (appointment && appointment.user) delete appointment.user.password;
    return appointment;
  }

  async updateAppointment(id: string, dto: any): Promise<Appointment | null> {
    return await this.adminAppointmentRepository.updateAppointment(id, dto);
  }

  async deleteAppointment(id: string): Promise<void> {
    return await this.adminAppointmentRepository.deleteAppointment(id);
  }
}
