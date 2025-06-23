import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities';

export class UserDIToken {
  static readonly UserSymbol = 'User';
  static readonly UserEntity = TypeOrmModule.forFeature([User]);
}
