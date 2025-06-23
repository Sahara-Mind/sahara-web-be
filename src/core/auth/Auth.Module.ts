import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './Auth.Service';
import { AuthController } from './Auth.Controller';
import { UserModule } from '../user/User.Module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './Auth.Strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    JwtModule.register({
      secret: process.env.CUSTOM_JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
