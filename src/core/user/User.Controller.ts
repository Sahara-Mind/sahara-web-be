import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './User.Service';
import { CreateUserDto } from './dto/CreateUserDto';
import { User } from './entities/User.Entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async get(): Promise<User[]> {
    return this.userService.findAllUsers();
  }
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(dto);
  }
}
