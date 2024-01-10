//auth.service.ts
import {
    Injectable,
    NotAcceptableException,
    UnauthorizedException,
  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Authentication } from 'src/entity/auth';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { CryptoService } from './crypto.service';


  @Injectable()
  export class AuthService {
    constructor(
      private readonly usersService: UserService,
      private jwtService: JwtService,
      private readonly cryptoService: CryptoService
    ) {}
    async validateUser(auth : Authentication): Promise<any> {
      const user = await this.usersService.findByEmail(auth.email);

      if (!user)
        throw new UnauthorizedException('Usuário inexistente');       

      const pass = user.password;
      const isPasswordValid = await this.cryptoService.comparePasswords(auth.password, pass);

      if (isPasswordValid)
        return await this.gerarToken(user);
      
      throw new UnauthorizedException('Usuário ou Senha Inválidos');
    }
  
    async gerarToken(payload: User) {
      delete payload.password;
      return {       
        user: payload,
        access_token: this.jwtService.sign(
          { email: payload.email },
          {
            secret: 'topSecret512',
            expiresIn: '7d',
          },
        ),
      };
    }
  }
  