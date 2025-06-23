import { TypeOrmModule } from '@nestjs/typeorm';
import { Therapist } from '../../entities';

export class AdminTherapistDIToken {
  static readonly AdminTherapistSymbol = 'AdminTherapist';
  static readonly AdminTherapistEntity = TypeOrmModule.forFeature([Therapist]);
}
