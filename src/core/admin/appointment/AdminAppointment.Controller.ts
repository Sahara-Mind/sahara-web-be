import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminAppointmentService } from './AdminAppointment.Service';
import { Appointment } from '../../entities';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';
import { CustomAuthGuard } from '../../auth/guards/AuthGuard';

@ApiTags('admin/appointment')
@ApiBearerAuth()
@Controller('admin/appointments')
@UseGuards(CustomAuthGuard)
export class AdminAppointmentController {
  constructor(
    private readonly adminAppointmentService: AdminAppointmentService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({
    status: 200,
    description: 'List of all appointments',
    type: [Appointment],
  })
  async findAll(): Promise<Appointment[]> {
    return this.adminAppointmentService.findAllAppointments();
  }

  @Get(':appointmentId')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiParam({ name: 'appointmentId', description: 'Appointment ID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment found',
    type: Appointment,
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async findById(
    @Param('appointmentId') appointmentId: string,
  ): Promise<Appointment | null> {
    return this.adminAppointmentService.findAppointmentById(appointmentId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({
    status: 201,
    description: 'Appointment created successfully',
    type: Appointment,
  })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.adminAppointmentService.createAppointment(createAppointmentDto);
  }

  @Put(':appointmentId')
  @ApiOperation({ summary: 'Update appointment by ID' })
  @ApiParam({ name: 'appointmentId', description: 'Appointment ID' })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({
    status: 200,
    description: 'Appointment updated successfully',
    type: Appointment,
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async update(
    @Param('appointmentId') appointmentId: string,
    @Body() updateDto: any,
  ): Promise<Appointment | null> {
    return this.adminAppointmentService.updateAppointment(
      appointmentId,
      updateDto,
    );
  }

  @Delete(':appointmentId')
  @ApiOperation({ summary: 'Delete appointment by ID' })
  @ApiParam({ name: 'appointmentId', description: 'Appointment ID' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async delete(@Param('appointmentId') appointmentId: string): Promise<void> {
    return this.adminAppointmentService.deleteAppointment(appointmentId);
  }
}
