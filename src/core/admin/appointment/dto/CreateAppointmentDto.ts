import { IsUUID, IsDate, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEndTimeAfterStartTime } from '../../../../lib/decorators/StartEndTimeValidationCheck';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Therapist ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  therapistId: string;

  @ApiProperty({
    description: 'User ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Appointment date',
    example: '2023-12-25',
  })
  @IsDate()
  @Type(() => Date)
  appointmentDate: Date;

  @ApiProperty({
    description: 'Start time in HH:mm format',
    example: '09:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime: string;

  @ApiProperty({
    description: 'End time in HH:mm format',
    example: '10:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm format',
  })
  endTime: string;

  @ApiProperty({
    description: 'Time validation check (endTime must be after startTime)',
    example: '10:00',
  })
  @IsEndTimeAfterStartTime({
    message: 'endTime must be after startTime',
  })
  checkTime: string;
}
