import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './Auth.Service';
import { LogInDto } from './dto/LoginDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LogInDto) {
    return this.authService.login(loginDto);
  }
}
