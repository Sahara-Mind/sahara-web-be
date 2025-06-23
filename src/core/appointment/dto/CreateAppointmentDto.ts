import { IsUUID, IsDate, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEndTimeAfterStartTime } from './StartEndTimeValidationCheck';

export class CreateAppointmentDto {
  @IsUUID()
  therapistId: string;

  @IsDate()
  @Type(() => Date)
  appointmentDate: Date;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm format',
  })
  endTime: string;

  @IsEndTimeAfterStartTime({
    message: 'endTime must be after startTime',
  })
  checkTime: string;
}
