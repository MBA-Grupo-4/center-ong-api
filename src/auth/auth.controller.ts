//auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authentication } from 'src/entity/auth';
import { ApiTags } from '@nestjs/swagger';
import { ResetPasswordView } from 'src/entity/reset-password-view';
import { ForgotPasswordView } from 'src/entity/forgot-password-view';


@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() auth : Authentication) {
    return this.authService.validateUser(auth);
  }

  @Post('forgot-password')
  async forgotPassword(@Body()  f: ForgotPasswordView): Promise<void> {    
    await this.authService.sendPasswordResetEmail(f.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() reset : ResetPasswordView): Promise<void> {    
    await this.authService.resetPassword(reset.token, reset.newPassword);
  }
}
