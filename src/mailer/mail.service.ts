// mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string, resetLink: string): Promise<void> {
    console.log(email)
    console.log(resetLink)
    await this.mailerService.sendMail({
      to: email,
      subject: 'Redefinição de Senha',
      template: 'reset-password',
      context: {
        resetLink,
      },
    });
  }
}
