import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { TherapistAppointmentRepository } from './TherapistAppointment.Repository';
import { Appointment } from '../../entities/Appointment.Entity';

@Injectable()
export class TherapistAppointmentService {
  constructor(
    private readonly therapistAppointmentRepository: TherapistAppointmentRepository,
  ) {}

  async findAllAppointmentsByTherapist(
    therapistId: string,
  ): Promise<Appointment[]> {
    return await this.therapistAppointmentRepository.findAllByTherapistId(
      therapistId,
    );
  }

  async findAppointmentById(
    appointmentId: string,
    therapistId: string,
  ): Promise<Appointment> {
    const appointment =
      await this.therapistAppointmentRepository.findOneByIdAndTherapistId(
        appointmentId,
        therapistId,
      );

    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointmentId} not found or not accessible`,
      );
    }

    return appointment;
  }

  async findUpcomingAppointments(therapistId: string): Promise<Appointment[]> {
    return await this.therapistAppointmentRepository.findUpcomingAppointmentsByTherapistId(
      therapistId,
    );
  }

  async findPastAppointments(therapistId: string): Promise<Appointment[]> {
    return await this.therapistAppointmentRepository.findPastAppointmentsByTherapistId(
      therapistId,
    );
  }

  async findTodayAppointments(therapistId: string): Promise<Appointment[]> {
    return await this.therapistAppointmentRepository.findTodayAppointmentsByTherapistId(
      therapistId,
    );
  }

  async findAppointmentsByDate(
    therapistId: string,
    date: Date,
  ): Promise<Appointment[]> {
    return await this.therapistAppointmentRepository.findAppointmentsByDateAndTherapistId(
      therapistId,
      date,
    );
  }

  async getAppointmentStats(therapistId: string): Promise<{
    totalAppointments: number;
    todayAppointments: number;
    upcomingAppointments: number;
  }> {
    const [totalAppointments, todayAppointments, upcomingAppointments] =
      await Promise.all([
        this.therapistAppointmentRepository.countAppointmentsByTherapistId(
          therapistId,
        ),
        this.therapistAppointmentRepository
          .findTodayAppointmentsByTherapistId(therapistId)
          .then((apps) => apps.length),
        this.therapistAppointmentRepository
          .findUpcomingAppointmentsByTherapistId(therapistId)
          .then((apps) => apps.length),
      ]);

    return {
      totalAppointments,
      todayAppointments,
      upcomingAppointments,
    };
  }

  /**
   * Validate that the therapist can access this appointment
   * This method ensures proper access control
   */
  private async validateTherapistAccess(
    appointmentId: string,
    therapistId: string,
  ): Promise<void> {
    const appointment =
      await this.therapistAppointmentRepository.findOneByIdAndTherapistId(
        appointmentId,
        therapistId,
      );

    if (!appointment) {
      throw new ForbiddenException(
        'You do not have permission to access this appointment',
      );
    }
  }
}
