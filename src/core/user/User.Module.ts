import { Module } from '@nestjs/common';

import { UserController } from './User.Controller';
import { UserRepository } from './User.Repository';
import { UserService } from './User.Service';
import { UserDIToken } from './UserDIToken';

@Module({
  imports: [UserDIToken.UserEntity],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
