// user.controller.ts
import { Controller, Get, Param, Post, Body, Put, Delete, Res, HttpCode, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entity/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(Number(id));
  }

  @Post()
  @HttpCode(200)
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  update(@Body() user: User): Promise<User> {
    return this.userService.update(user);
  }

  @Delete()
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async delete(id:number){
    return await this.userService.delete(id);    
  }

}
