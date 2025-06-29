import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TherapistAppointmentService } from './TherapistAppointment.Service';
import {
  FilterTherapistAppointmentDto,
  AppointmentTimeFilter,
} from './dto/FilterTherapistAppointmentDto';
import { Appointment } from '../../entities/Appointment.Entity';
import { CustomAuthGuard } from '../../auth/guards/AuthGuard';

@ApiTags('Therapist - Appointments')
@ApiBearerAuth()
@Controller('therapist/appointments')
@UseGuards(CustomAuthGuard)
export class TherapistAppointmentController {
  constructor(
    private readonly therapistAppointmentService: TherapistAppointmentService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get therapist appointments',
    description:
      'Retrieves all appointments for the authenticated therapist with optional filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'List of therapist appointments',
    type: [Appointment],
  })
  async findMyAppointments(
    @Req() req: any,
    @Query() filterDto: FilterTherapistAppointmentDto,
  ): Promise<Appointment[]> {
    const therapistId = req.user.id; // Assuming user ID is the therapist ID from auth guard

    switch (filterDto.timeFilter) {
      case AppointmentTimeFilter.TODAY:
        return await this.therapistAppointmentService.findTodayAppointments(
          therapistId,
        );

      case AppointmentTimeFilter.UPCOMING:
        return await this.therapistAppointmentService.findUpcomingAppointments(
          therapistId,
        );

      case AppointmentTimeFilter.PAST:
        return await this.therapistAppointmentService.findPastAppointments(
          therapistId,
        );

      default:
        if (filterDto.date) {
          return await this.therapistAppointmentService.findAppointmentsByDate(
            therapistId,
            new Date(filterDto.date),
          );
        }
        return await this.therapistAppointmentService.findAllAppointmentsByTherapist(
          therapistId,
        );
    }
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get appointment statistics',
    description:
      'Retrieves appointment statistics for the authenticated therapist',
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment statistics',
    schema: {
      type: 'object',
      properties: {
        totalAppointments: { type: 'number', example: 150 },
        todayAppointments: { type: 'number', example: 5 },
        upcomingAppointments: { type: 'number', example: 25 },
      },
    },
  })
  async getMyAppointmentStats(@Req() req: any) {
    const therapistId = req.user.id;
    return await this.therapistAppointmentService.getAppointmentStats(
      therapistId,
    );
  }

  @Get('today')
  @ApiOperation({
    summary: "Get today's appointments",
    description:
      'Retrieves all appointments for today for the authenticated therapist',
  })
  @ApiResponse({
    status: 200,
    description: "Today's appointments",
    type: [Appointment],
  })
  async getTodayAppointments(@Req() req: any): Promise<Appointment[]> {
    const therapistId = req.user.id;
    return await this.therapistAppointmentService.findTodayAppointments(
      therapistId,
    );
  }

  @Get('upcoming')
  @ApiOperation({
    summary: 'Get upcoming appointments',
    description:
      'Retrieves all upcoming appointments for the authenticated therapist',
  })
  @ApiResponse({
    status: 200,
    description: 'Upcoming appointments',
    type: [Appointment],
  })
  async getUpcomingAppointments(@Req() req: any): Promise<Appointment[]> {
    const therapistId = req.user.id;
    return await this.therapistAppointmentService.findUpcomingAppointments(
      therapistId,
    );
  }

  @Get('past')
  @ApiOperation({
    summary: 'Get past appointments',
    description:
      'Retrieves all past appointments for the authenticated therapist',
  })
  @ApiResponse({
    status: 200,
    description: 'Past appointments',
    type: [Appointment],
  })
  async getPastAppointments(@Req() req: any): Promise<Appointment[]> {
    const therapistId = req.user.id;
    return await this.therapistAppointmentService.findPastAppointments(
      therapistId,
    );
  }

  @Get('date/:date')
  @ApiOperation({
    summary: 'Get appointments by date',
    description:
      'Retrieves all appointments for a specific date for the authenticated therapist',
  })
  @ApiParam({
    name: 'date',
    description: 'Date in YYYY-MM-DD format',
    example: '2024-01-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Appointments for the specified date',
    type: [Appointment],
  })
  async getAppointmentsByDate(
    @Req() req: any,
    @Param('date') date: string,
  ): Promise<Appointment[]> {
    const therapistId = req.user.id;
    return await this.therapistAppointmentService.findAppointmentsByDate(
      therapistId,
      new Date(date),
    );
  }

  @Get(':appointmentId')
  @ApiOperation({
    summary: 'Get appointment by ID',
    description:
      'Retrieves a specific appointment by ID (only if it belongs to the authenticated therapist)',
  })
  @ApiParam({
    name: 'appointmentId',
    description: 'Appointment UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment details',
    type: Appointment,
  })
  @ApiResponse({
    status: 404,
    description: 'Appointment not found or not accessible',
  })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - appointment does not belong to this therapist',
  })
  async findAppointmentById(
    @Req() req: any,
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
  ): Promise<Appointment> {
    const therapistId = req.user.id;
    return await this.therapistAppointmentService.findAppointmentById(
      appointmentId,
      therapistId,
    );
  }
}
