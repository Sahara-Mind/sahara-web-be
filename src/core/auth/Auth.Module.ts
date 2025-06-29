import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './Auth.Service';
import { AuthController } from './Auth.Controller';
import { UserModule } from '../user/User.Module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './Auth.Strategy';
import { SendGridModule } from '../../infra/sendgrid/SendGrid.Module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    JwtModule.register({
      secret: process.env.CUSTOM_JWT_SECRET,
    }),
    SendGridModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
