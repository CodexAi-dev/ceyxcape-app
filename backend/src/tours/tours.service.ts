import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, IsNull } from 'typeorm';
import { Tour } from './tour.entity';
import { QueryToursDto } from './dto/query-tours.dto';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { TOURS_UPLOAD_DIR, deleteUploadedFile } from '../common/upload.config';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepo: Repository<Tour>,
  ) {}

  // Map a (camelCase) entity to the snake_case shape the frontend expects.
  // This is also what fixes discount_price / start_location / itinerary etc.
  private toResponse(t: Tour) {
    return {
      id: t.id,
      tour_code: t.tourCode ?? null,
      name: t.name,
      description: t.description ?? null,
      category: t.category ?? null,
      start_location: t.startLocation ?? null,
      location: t.location ?? null,
      duration: t.duration ?? null,
      price: t.price != null ? Number(t.price) : null,
      discount_price: t.discountPrice != null ? Number(t.discountPrice) : null,
      image: t.image ?? null,
      gallery: t.gallery ?? [],
      itinerary: t.itinerary ?? [],
      includes: t.includes ?? [],
      excludes: t.excludes ?? [],
      status: t.status,
      featured: !!t.featured,
      views: t.views ?? 0,
      created_at: t.createdAt,
      updated_at: t.updatedAt,
    };
  }

  async findAll(query: QueryToursDto) {
    const { search, category, duration, price, sort, page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const qb: SelectQueryBuilder<Tour> = this.tourRepo
      .createQueryBuilder('tour')
      .where('tour.status = :status', { status: 'active' })
      .andWhere('tour.deletedAt IS NULL');

    if (search) {
      qb.andWhere(
        '(tour.name LIKE :search OR tour.description LIKE :search OR tour.startLocation LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      qb.andWhere('tour.category = :category', { category });
    }

    if (duration) {
      switch (duration) {
        case '1-3':  qb.andWhere('tour.duration BETWEEN 1 AND 3');  break;
        case '4-7':  qb.andWhere('tour.duration BETWEEN 4 AND 7');  break;
        case '8-14': qb.andWhere('tour.duration BETWEEN 8 AND 14'); break;
        case '15+':  qb.andWhere('tour.duration >= 15');            break;
      }
    }

    if (price) {
      switch (price) {
        case '0-500':
          qb.andWhere('COALESCE(NULLIF(tour.discountPrice, 0), tour.price) <= 500'); break;
        case '500-1000':
          qb.andWhere('COALESCE(NULLIF(tour.discountPrice, 0), tour.price) BETWEEN 500 AND 1000'); break;
        case '1000-2000':
          qb.andWhere('COALESCE(NULLIF(tour.discountPrice, 0), tour.price) BETWEEN 1000 AND 2000'); break;
        case '2000+':
          qb.andWhere('COALESCE(NULLIF(tour.discountPrice, 0), tour.price) >= 2000'); break;
      }
    }

    switch (sort) {
      case 'price_low':  qb.orderBy('COALESCE(NULLIF(tour.discountPrice, 0), tour.price)', 'ASC');  break;
      case 'price_high': qb.orderBy('COALESCE(NULLIF(tour.discountPrice, 0), tour.price)', 'DESC'); break;
      case 'newest':     qb.orderBy('tour.createdAt', 'DESC'); break;
      default:           qb.orderBy('tour.featured', 'DESC').addOrderBy('tour.createdAt', 'DESC');
    }

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data: data.map((t) => this.toResponse(t)),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findFeatured(limit = 6) {
    const tours = await this.tourRepo.find({
      where: { status: 'active', featured: true },
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return tours.map((t) => this.toResponse(t));
  }

  async findOne(id: number) {
    const tour = await this.tourRepo.findOne({ where: { id, status: 'active' } });
    if (!tour) throw new NotFoundException(`Tour #${id} not found`);
    await this.tourRepo.increment({ id }, 'views', 1);
    return this.toResponse({ ...tour, views: (tour.views ?? 0) + 1 } as Tour);
  }

  async getCategories(): Promise<string[]> {
    const rows = await this.tourRepo
      .createQueryBuilder('tour')
      .select('DISTINCT tour.category', 'category')
      .where('tour.status = :status', { status: 'active' })
      .andWhere('tour.category IS NOT NULL')
      .getRawMany();
    return rows.map((r) => r.category).filter(Boolean);
  }

  // ── Admin ───────────────────────────────────────────────────────
  async findAllAdmin() {
    const tours = await this.tourRepo.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
    return tours.map((t) => this.toResponse(t));
  }

  async findOneAdmin(id: number) {
    const tour = await this.tourRepo.findOne({ where: { id } });
    if (!tour) throw new NotFoundException(`Tour #${id} not found`);
    return this.toResponse(tour);
  }

  async create(dto: CreateTourDto) {
    const tour = this.tourRepo.create(this.fromDto(dto));
    const saved = await this.tourRepo.save(tour);
    return this.toResponse(saved);
  }

  async update(id: number, dto: UpdateTourDto) {
    const tour = await this.tourRepo.findOne({ where: { id } });
    if (!tour) throw new NotFoundException(`Tour #${id} not found`);
    Object.assign(tour, this.fromDto(dto));
    const saved = await this.tourRepo.save(tour);
    return this.toResponse(saved);
  }

  async remove(id: number) {
    const tour = await this.tourRepo.findOne({ where: { id } });
    if (!tour) throw new NotFoundException(`Tour #${id} not found`);
    await this.tourRepo.softDelete(id); // sets deleted_at, keeps the row
    return { message: 'Tour deleted', id };
  }

  // Set the main image (filename only). Removes the previous image file.
  async setImage(id: number, filename: string) {
    const tour = await this.tourRepo.findOne({ where: { id } });
    if (!tour) throw new NotFoundException(`Tour #${id} not found`);
    if (tour.image && tour.image !== filename) {
      deleteUploadedFile(TOURS_UPLOAD_DIR, tour.image);
    }
    tour.image = filename;
    return this.toResponse(await this.tourRepo.save(tour));
  }

  async addGalleryImages(id: number, filenames: string[]) {
    const tour = await this.tourRepo.findOne({ where: { id } });
    if (!tour) throw new NotFoundException(`Tour #${id} not found`);
    tour.gallery = [...(tour.gallery ?? []), ...filenames];
    return this.toResponse(await this.tourRepo.save(tour));
  }

  async removeGalleryImage(id: number, filename: string) {
    const tour = await this.tourRepo.findOne({ where: { id } });
    if (!tour) throw new NotFoundException(`Tour #${id} not found`);
    tour.gallery = (tour.gallery ?? []).filter((f) => f !== filename);
    deleteUploadedFile(TOURS_UPLOAD_DIR, filename);
    return this.toResponse(await this.tourRepo.save(tour));
  }

  // Map snake_case DTO → entity columns, skipping undefined keys.
  private fromDto(dto: CreateTourDto | UpdateTourDto): Partial<Tour> {
    const out: Partial<Tour> = {};
    if (dto.name !== undefined) out.name = dto.name;
    if (dto.tour_code !== undefined) out.tourCode = dto.tour_code;
    if (dto.description !== undefined) out.description = dto.description;
    if (dto.category !== undefined) out.category = dto.category;
    if (dto.start_location !== undefined) out.startLocation = dto.start_location;
    if (dto.location !== undefined) out.location = dto.location;
    if (dto.duration !== undefined) out.duration = dto.duration;
    if (dto.price !== undefined) out.price = dto.price;
    if (dto.discount_price !== undefined) out.discountPrice = dto.discount_price;
    if (dto.image !== undefined) out.image = dto.image;
    if (dto.gallery !== undefined) out.gallery = dto.gallery;
    if (dto.itinerary !== undefined) out.itinerary = dto.itinerary;
    if (dto.includes !== undefined) out.includes = dto.includes;
    if (dto.excludes !== undefined) out.excludes = dto.excludes;
    if (dto.status !== undefined) out.status = dto.status;
    if (dto.featured !== undefined) out.featured = dto.featured;
    return out;
  }
}
