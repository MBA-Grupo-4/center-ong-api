import { Controller, Get, Param, Post, Body, Put, Delete, Res, HttpCode, UseGuards, BadRequestException, Scope } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entity/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserFollow } from 'src/entity/view/user/user-follow';
import { BaseNotification } from 'src/entity/base.notification';

@ApiTags('Users')
@Controller('users')
export class UserController extends BaseNotification {
  constructor(private readonly userService: UserService) { 
    super(); 
  }

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

    this.clearNotifications()
    this.isRequired(user.name, 'Informe o nome')
    this.isRequired(user.username, 'Informe o username')
    this.isRequired(user.password, 'Informe a senha')    
    this.isRequired(user.email, 'Informe o e-mail ')
    this.isEmail(user.email, 'E-mail inválido')
    this.hasMaxLen(user.aboutme, 300, 'aboutme no maximo 300 caracteres')

    if(!this.valid())
      throw new BadRequestException(this.allNotifications)

    return this.userService.create(user);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  update(@Body() user: User): Promise<User> {
    
    this.clearNotifications()
    super.isRequired(user.name, 'Informe o nome')
    super.isRequired(user.username, 'Informe o username')
    super.isRequired(user.password, 'Informe a senha')    
    super.isRequired(user.email, 'Informe o e-mail ')
    super.isEmail(user.email, 'E-mail inválido')
    super.hasMaxLen(user.aboutme, 10, 'Aboutme no maximo 300 caracteres')

    if(!this.valid())
      throw new BadRequestException(this.allNotifications)

    return this.userService.update(user);
  }

  @Delete()
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async delete(id:number){
    return await this.userService.delete(id);    
  }


  @UseGuards(AuthGuard('jwt'))
  @Post('follow')
  async followUser(@Body() userf: UserFollow) {    
    await this.userService.followUser(userf.followerId, userf.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('unfollow')
  async unfollowUser(@Body() userf: UserFollow) {    
    await this.userService.unfollowUser(userf.followerId, userf.userId);
  }

}
