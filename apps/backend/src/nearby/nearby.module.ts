import { Module } from '@nestjs/common';
import { NearbyController } from './nearby.controller';
import { NearbyService } from './nearby.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NearbyController],
  providers: [NearbyService],
  exports: [NearbyService],
})
export class NearbyModule {}

