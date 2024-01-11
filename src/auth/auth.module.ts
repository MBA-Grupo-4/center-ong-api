//auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { Category } from 'src/entity/category.entity';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { LocalStrategy } from './local-auth';
import { AuthController } from './auth.controller';
import { CryptoService } from './crypto.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category]),
    PassportModule,
    JwtModule,
  ],
  providers: [AuthService, UserService, LocalStrategy, CryptoService],
  controllers: [AuthController]
})
export class AuthModule {}
