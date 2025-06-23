import { TypeOrmModule } from '@nestjs/typeorm';
import { Therapist } from './entities/Therapist.Entity';

export class TherapistDIToken {
  static readonly TherapistSymbol = 'Therapist';
  static readonly TherapistEntity = TypeOrmModule.forFeature([Therapist]);
}
