import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour } from './tour.entity';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tour])],
  controllers: [ToursController],
  providers: [ToursService],
  exports: [ToursService],
})
export class ToursModule {}
