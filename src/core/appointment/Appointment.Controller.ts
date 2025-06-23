import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppointmentService } from './Appointment.Service';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';
import { Appointment } from './entities/Appointment.Entity';
import { CustomAuthGuard } from '../auth/guards/AuthGuard';
import { CurrentUser } from '../../lib/decorators/CurrentUserDecorator';
import { JwtPayload } from '../auth/Constants';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async get(): Promise<Appointment[]> {
    return this.appointmentService.findAllAppointments();
  }

  @Get('/my')
  @UseGuards(CustomAuthGuard)
  async getMyAppointments(
    @CurrentUser() user: JwtPayload,
  ): Promise<Appointment[]> {
    return this.appointmentService.findMyAppointments(user);
  }

  @Post()
  @UseGuards(CustomAuthGuard)
  async create(
    @Body() dto: CreateAppointmentDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<Appointment> {
    return this.appointmentService.createAppointment(dto, user);
  }
}
