import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TherapistSpecialization } from '../../../../lib/enums/TherapistEnum';

export class CreateTherapistDto {
  @ApiProperty({
    description: 'Therapist first name',
    example: 'Dr. John',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Therapist last name',
    example: 'Smith',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Therapist email address',
    example: 'john.smith@therapy.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Therapist specialization',
    enum: TherapistSpecialization,
    example: TherapistSpecialization.PSYCHOLOGIST,
  })
  @IsEnum(TherapistSpecialization)
  specialization: TherapistSpecialization;

  @ApiProperty({
    description: 'Therapist phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Therapist gender',
    example: 'Male',
    required: false,
  })
  @IsOptional()
  gender?: string;

  @ApiProperty({
    description: 'Languages spoken by therapist',
    example: ['English', 'Spanish'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  languages?: string[];

  @ApiProperty({
    description: 'Years of experience',
    example: 5,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  yearsOfExperience?: number;
}
