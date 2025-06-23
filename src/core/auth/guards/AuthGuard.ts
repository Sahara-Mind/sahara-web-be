import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
  canActivate(context: any) {
    return super.canActivate(context);
  }
}
