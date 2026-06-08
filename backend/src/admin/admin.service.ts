import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Tour } from '../tours/tour.entity';
import { Inquiry } from '../inquiries/inquiry.entity';
import { GalleryImage } from '../gallery/gallery-image.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Tour) private readonly tourRepo: Repository<Tour>,
    @InjectRepository(Inquiry) private readonly inquiryRepo: Repository<Inquiry>,
    @InjectRepository(GalleryImage) private readonly galleryRepo: Repository<GalleryImage>,
  ) {}

  async getStats() {
    const [tours, activeTours, inquiries, newInquiries, gallery] = await Promise.all([
      this.tourRepo.count({ where: { deletedAt: IsNull() } }),
      this.tourRepo.count({ where: { deletedAt: IsNull(), status: 'active' } }),
      this.inquiryRepo.count(),
      this.inquiryRepo.count({ where: { status: 'new' } }),
      this.galleryRepo.count(),
    ]);

    return {
      tours,
      activeTours,
      inactiveTours: tours - activeTours,
      inquiries,
      newInquiries,
      gallery,
    };
  }
}
