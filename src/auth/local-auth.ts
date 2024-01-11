//local.auth.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authentication } from 'src/entity/auth';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(auth : Authentication): Promise<any> {
    const user = await this.authService.validateUser(auth);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
