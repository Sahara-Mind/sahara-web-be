import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminTherapistService } from './AdminTherapist.Service';
import { Therapist } from '../../entities';
import { CreateTherapistDto } from './dto/CreateTherapistDto';
import { UpdateTherapistDto } from './dto/UpdateTherapistDto';
import { FilterTherapistDto } from './dto/FilterTherapistDto';
import { CustomAuthGuard } from '../../auth/guards/AuthGuard';

@ApiTags('admin/therapist')
@ApiBearerAuth()
@Controller('admin/therapists')
@UseGuards(CustomAuthGuard)
export class AdminTherapistController {
  constructor(private readonly adminTherapistService: AdminTherapistService) {}

  @Get()
  @ApiOperation({ summary: 'Get all therapists with optional filtering' })
  @ApiQuery({
    name: 'specialization',
    required: false,
    description: 'Filter by specialization',
  })
  @ApiQuery({
    name: 'gender',
    required: false,
    description: 'Filter by gender',
  })
  @ApiResponse({
    status: 200,
    description: 'List of therapists',
    type: [Therapist],
  })
  async findAll(@Query() filter: FilterTherapistDto): Promise<Therapist[]> {
    return this.adminTherapistService.findAllTherapists(filter);
  }

  @Get(':therapistId')
  @ApiOperation({ summary: 'Get therapist by ID' })
  @ApiParam({ name: 'therapistId', description: 'Therapist ID' })
  @ApiResponse({
    status: 200,
    description: 'Therapist found',
    type: Therapist,
  })
  @ApiResponse({ status: 404, description: 'Therapist not found' })
  async findById(
    @Param('therapistId') therapistId: string,
  ): Promise<Therapist | null> {
    return this.adminTherapistService.findTherapistById(therapistId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new therapist' })
  @ApiBody({ type: CreateTherapistDto })
  @ApiResponse({
    status: 201,
    description: 'Therapist created successfully',
    type: Therapist,
  })
  async create(
    @Body() createTherapistDto: CreateTherapistDto,
  ): Promise<Therapist> {
    return this.adminTherapistService.createTherapist(createTherapistDto);
  }

  @Put(':therapistId')
  @ApiOperation({ summary: 'Update therapist by ID' })
  @ApiParam({ name: 'therapistId', description: 'Therapist ID' })
  @ApiBody({ type: UpdateTherapistDto })
  @ApiResponse({
    status: 200,
    description: 'Therapist updated successfully',
    type: Therapist,
  })
  @ApiResponse({ status: 404, description: 'Therapist not found' })
  async update(
    @Param('therapistId') therapistId: string,
    @Body() updateTherapistDto: UpdateTherapistDto,
  ): Promise<Therapist | null> {
    return this.adminTherapistService.updateTherapist(
      therapistId,
      updateTherapistDto,
    );
  }

  @Delete(':therapistId')
  @ApiOperation({ summary: 'Delete therapist by ID' })
  @ApiParam({ name: 'therapistId', description: 'Therapist ID' })
  @ApiResponse({ status: 200, description: 'Therapist deleted successfully' })
  @ApiResponse({ status: 404, description: 'Therapist not found' })
  async delete(@Param('therapistId') therapistId: string): Promise<void> {
    return this.adminTherapistService.deleteTherapist(therapistId);
  }
}
