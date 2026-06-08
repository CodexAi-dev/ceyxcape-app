import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Tour } from '../tours/tour.entity';
import { Inquiry } from '../inquiries/inquiry.entity';
import { GalleryImage } from '../gallery/gallery-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tour, Inquiry, GalleryImage])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
