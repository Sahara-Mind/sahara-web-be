import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TherapistService } from './Therapist.Service';
import { Therapist } from './entities/Therapist.Entity';
import { CreateTherapistDto } from './dto/CreateTherapistDto';
import { FilterTherapistDto } from './dto/FilterTherapistDto';

@Controller('therapists')
export class TherapistController {
  constructor(private readonly therapistService: TherapistService) {}

  @Post()
  async create(
    @Body() createTherapistDto: CreateTherapistDto,
  ): Promise<Therapist> {
    return this.therapistService.createTherapist(createTherapistDto);
  }

  @Get()
  async findAll(@Query() filter: FilterTherapistDto): Promise<Therapist[]> {
    const therapists = await this.therapistService.findAllTherapists(filter);
    return therapists;
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Therapist> {
    const therapists = await this.therapistService.findById(id);
    return therapists;
  }
}
