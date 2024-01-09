//auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authentication } from 'src/entity/auth';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() auth : Authentication) {
    return this.authService.validateUser(auth);
  }
}
