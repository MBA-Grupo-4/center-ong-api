// ong.controller.ts
import { Controller, Get, Param, Body, Put } from '@nestjs/common';
import { OngService } from './ong.service';
import { Ong } from '../entity/ong.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Ongs')
@Controller('ongs')
export class OngController {
  constructor(private readonly ongService: OngService) {}

  @Get()
  getAllUsers(): Ong[] {
    return this.ongService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') userId: number): Ong {
    return this.ongService.getUserById(userId);
  }

  @Put(':id/approve')
  approveUser(@Param('id') userId: number): Ong {
    return this.ongService.approveUser(userId);
  }

  @Put(':id/reject')
  rejectUser(@Param('id') userId: number, @Body('rejectionReason') rejectionReason: string): Ong {
    return this.ongService.rejectUser(userId, rejectionReason);
  }
}
