import { IsOptional, IsDateString, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum AppointmentTimeFilter {
  ALL = 'all',
  TODAY = 'today',
  UPCOMING = 'upcoming',
  PAST = 'past',
}

export class FilterTherapistAppointmentDto {
  @ApiPropertyOptional({
    description: 'Filter appointments by time period',
    enum: AppointmentTimeFilter,
    default: AppointmentTimeFilter.ALL,
    example: AppointmentTimeFilter.UPCOMING,
  })
  @IsOptional()
  @IsEnum(AppointmentTimeFilter)
  timeFilter?: AppointmentTimeFilter = AppointmentTimeFilter.ALL;

  @ApiPropertyOptional({
    description: 'Filter appointments by specific date (YYYY-MM-DD format)',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Search term for patient name or appointment details',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Start date for date range filter (YYYY-MM-DD format)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for date range filter (YYYY-MM-DD format)',
    example: '2024-01-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
