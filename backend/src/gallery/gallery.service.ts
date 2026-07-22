import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryImage } from './gallery-image.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { deleteImage } from '../common/supabase-storage';

// The curated images that already ship in frontend/public — seeded once so the
// public gallery looks identical, then fully manageable from the admin panel.
const SEED: Array<{ src: string; title: string; category: string }> = [
  { src: '/images/gallery/img_68ceefe478623_mirissa.jpg', title: 'Mirissa Beach', category: 'Beaches' },
  { src: '/images/gallery/img_690352b95d2c6_unawatuna.jpg', title: 'Unawatuna Bay', category: 'Beaches' },
  { src: '/images/mirissa.webp', title: 'Sunset at Mirissa', category: 'Beaches' },
  { src: '/images/thangalla.webp', title: 'Tangalle Coast', category: 'Beaches' },
  { src: '/images/benthota.webp', title: 'Bentota River', category: 'Beaches' },
  { src: '/images/gallery/img_6903503a07449_sigiriya1.jpg', title: 'Sigiriya Rock Fortress', category: 'Heritage' },
  { src: '/images/gallery/img_690352288d63f_golden temple.jpg', title: 'Golden Temple', category: 'Heritage' },
  { src: '/images/gallery/img_6903547450069_anuradapura.jpg', title: 'Anuradhapura Ruins', category: 'Heritage' },
  { src: '/images/gallefort.webp', title: 'Galle Fort', category: 'Heritage' },
  { src: '/images/kandy.webp', title: 'Kandy Temple', category: 'Heritage' },
  { src: '/images/anuradhapura.webp', title: 'Ancient Stupas', category: 'Heritage' },
  { src: '/images/gallery/img_690351150edc8_yala.jpg', title: 'Yala Leopard', category: 'Wildlife' },
  { src: '/images/yala.webp', title: 'Yala Safari', category: 'Wildlife' },
  { src: '/images/wild-elephants.webp', title: 'Wild Elephants', category: 'Wildlife' },
  { src: '/images/bird.jpg', title: 'Bird Sanctuary', category: 'Wildlife' },
  { src: '/images/rafting.webp', title: 'White Water Rafting', category: 'Adventure' },
  { src: '/images/gallery/img_69035320a8215_WhatsApp Image 2025-09-06 at 14.41.26_e71d6720.jpg', title: 'Mountain Trek', category: 'Adventure' },
  { src: '/images/gallery/img_690354ce0e932_WhatsApp Image 2025-09-06 at 14.46.51_4338d7c5.jpg', title: 'Scenic Drive', category: 'Adventure' },
  { src: '/images/gallery/img_6903540377494_happyt.jpg', title: 'Happy Travellers', category: 'Culture' },
  { src: '/images/gallery/img_6903518b32d20_WhatsApp Image 2025-09-11 at 10.01.24_baaee458.jpg', title: 'Local Culture', category: 'Culture' },
  { src: '/images/gallery/img_690353595cab1_WhatsApp Image 2025-09-11 at 10.01.37_d879dd28.jpg', title: 'Sri Lanka Moments', category: 'Culture' },
  { src: '/images/gallery/img_690353954ff7b_WhatsApp Image 2025-09-11 at 10.01.33_423516b6.jpg', title: 'Tour Memories', category: 'Culture' },
  { src: '/images/gallery/img_690353d316f91_WhatsApp Image 2025-10-29 at 14.10.39_cebca828.jpg', title: 'Island Life', category: 'Culture' },
  { src: '/images/gallery/img_68cef2ad6163a_udara-karunarathna-PPGM2ZpCrzc-unsplash.jpg', title: 'Sri Lanka Views', category: 'Culture' },
  { src: '/images/ella.webp', title: 'Ella Valley', category: 'Scenery' },
  { src: '/images/sigiriya1.webp', title: 'Sigiriya Sunrise', category: 'Scenery' },
  { src: '/images/trinco.webp', title: 'Trincomalee', category: 'Scenery' },
  { src: '/images/hambanthota.webp', title: 'Hambantota', category: 'Scenery' },
];

@Injectable()
export class GalleryService implements OnModuleInit {
  private readonly logger = new Logger(GalleryService.name);

  constructor(
    @InjectRepository(GalleryImage)
    private readonly repo: Repository<GalleryImage>,
  ) {}

  // Seed the curated images on first run so the public gallery isn't empty.
  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
      await this.repo.save(SEED.map((s) => this.repo.create(s)));
      this.logger.log(`Seeded ${SEED.length} gallery images`);
    }
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async create(src: string, dto: CreateGalleryDto) {
    const img = this.repo.create({
      src, // full Supabase Storage URL
      title: dto.title || 'CeyXcape Sri Lanka',
      category: dto.category || 'Gallery',
    });
    return this.repo.save(img);
  }

  async remove(id: number) {
    const img = await this.repo.findOne({ where: { id } });
    if (!img) throw new NotFoundException(`Image #${id} not found`);
    // Remove from Storage if it's a Storage URL (no-op for static assets).
    await deleteImage(img.src);
    await this.repo.delete(id);
    return { message: 'Image deleted', id };
  }
}
