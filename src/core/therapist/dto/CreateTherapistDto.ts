import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  IsEnum,
} from 'class-validator';
import { TherapistSpecialization } from '../entities/TherapistEnum';

export class CreateTherapistDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsEnum(TherapistSpecialization)
  specialization: TherapistSpecialization;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  gender?: string;

  @IsOptional()
  @IsArray()
  languages?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsOfExperience?: number;
}
