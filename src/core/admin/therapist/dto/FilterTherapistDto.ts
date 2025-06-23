import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterTherapistDto {
  @ApiProperty({
    description: 'Filter by language spoken',
    example: 'English',
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({
    description: 'Filter by specialization',
    example: 'Psychologist',
    required: false,
  })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({
    description: 'Filter by gender',
    example: 'Male',
    required: false,
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({
    description: 'Minimum years of experience',
    example: 3,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minYearsExperience?: number;
}
