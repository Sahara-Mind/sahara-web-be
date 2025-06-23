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

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({
    status: 200,
    description: 'Appointment found',
    type: Appointment,
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async findById(@Param('id') id: string): Promise<Appointment | null> {
    return this.adminAppointmentService.findAppointmentById(id);
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

  @Put(':id')
  @ApiOperation({ summary: 'Update appointment by ID' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({
    status: 200,
    description: 'Appointment updated successfully',
    type: Appointment,
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
  ): Promise<Appointment | null> {
    return this.adminAppointmentService.updateAppointment(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete appointment by ID' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.adminAppointmentService.deleteAppointment(id);
  }
}
