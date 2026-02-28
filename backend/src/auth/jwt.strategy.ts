import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { BusinessOwnersService } from '../business-owners/business-owners.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private businessOwnersService: BusinessOwnersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'coracao-comercial-jwt-secret-dev',
    });
  }

  async validate(payload: { sub: number; email: string; type: 'user' | 'business' }) {
    if (payload.type === 'business') {
      const owner = await this.businessOwnersService.findById(payload.sub);
      if (!owner) throw new UnauthorizedException();
      return { ...owner, type: 'business' };
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return { ...user, type: 'user' };
  }
}
