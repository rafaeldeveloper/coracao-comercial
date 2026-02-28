import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user || user.type !== 'user') {
      throw new UnauthorizedException('Acesso restrito a usuários');
    }
    return user;
  }
}

@Injectable()
export class BusinessGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user || user.type !== 'business') {
      throw new UnauthorizedException('Acesso restrito a comerciantes');
    }
    return user;
  }
}
