import { Injectable } from '@nestjs/common';
import { AppointmentRepository } from './Appointment.Repository';
import { Appointment } from './entities/Appointment.Entity';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';
import { JwtPayload } from '../auth/Constants';

@Injectable()
export class AppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async createAppointment(
    dto: CreateAppointmentDto,
    user: JwtPayload,
  ): Promise<Appointment> {
    return await this.appointmentRepository.createAppointment(dto, user);
  }

  async findAllAppointments(): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.findAllAppointments();
    appointments.forEach((app) => {
      if (app.user) delete app.user.password;
    });
    return appointments;
  }

  async findMyAppointments(user: JwtPayload): Promise<Appointment[]> {
    const appointments =
      await this.appointmentRepository.findMyAppointments(user);
    appointments.forEach((app) => {
      if (app.user) delete app.user.password;
    });
    return appointments;
  }
}
