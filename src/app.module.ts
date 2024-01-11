// AppModule
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { DataSource } from 'typeorm';
import { CategoryModule } from './category/category.module';
import { User } from './entity/user.entity';
import { Category } from './entity/category.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '172.20.0.1',
      port: 3707,
      username: 'root',
      password: 'MBAGrupo4',
      database: 'center',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true      
    }),
    UserModule,
    CategoryModule,
    AuthModule
  ]
})

export class AppModule {
  constructor(private dataSource: DataSource) {}
}
