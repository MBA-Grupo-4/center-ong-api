import { Module } from '@nestjs/common';
import { OngController } from './ong.controller';
import { OngService } from './ong.service';

@Module({
  controllers: [OngController],
  providers: [OngService],
})
export class AppModule {}