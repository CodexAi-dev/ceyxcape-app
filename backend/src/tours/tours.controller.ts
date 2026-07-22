import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ToursService } from './tours.service';
import { QueryToursDto } from './dto/query-tours.dto';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { memoryUpload, uploadImage } from '../common/supabase-storage';

@ApiTags('Tours')
@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  // ── Public ──
  @Get()
  @ApiOperation({ summary: 'Get all active tours with filtering and pagination' })
  findAll(@Query() query: QueryToursDto) {
    return this.toursService.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured tours for homepage' })
  findFeatured() {
    return this.toursService.findFeatured();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all available tour categories' })
  getCategories() {
    return this.toursService.getCategories();
  }

  // ── Admin (must be declared before ':id' so the static path wins) ──
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List ALL tours incl. inactive (admin only)' })
  findAllAdmin() {
    return this.toursService.findAllAdmin();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single tour for editing (admin only)' })
  findOneAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.toursService.findOneAdmin(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a tour (admin only)' })
  create(@Body() dto: CreateTourDto) {
    return this.toursService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a tour (admin only)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTourDto) {
    return this.toursService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a tour (admin only)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.toursService.remove(id);
  }

  // ── Image uploads (admin) ──
  @Post(':id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', memoryUpload))
  @ApiOperation({ summary: 'Upload/replace a tour main image (admin only)' })
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No image file provided');
    const url = await uploadImage('tours', file);
    return this.toursService.setImage(id, url);
  }

  @Post(':id/gallery')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 12, memoryUpload))
  @ApiOperation({ summary: 'Add gallery images to a tour (admin only)' })
  async uploadGallery(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No image files provided');
    }
    const urls = await Promise.all(files.map((f) => uploadImage('tours', f)));
    return this.toursService.addGalleryImages(id, urls);
  }

  // Image URL passed as a query param (?image=<url>) since a full Storage URL
  // can't sit in a path segment.
  @Delete(':id/gallery')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a gallery image from a tour (admin only)' })
  removeGalleryImage(
    @Param('id', ParseIntPipe) id: number,
    @Query('image') image: string,
  ) {
    if (!image) throw new BadRequestException('No image specified');
    return this.toursService.removeGalleryImage(id, image);
  }

  // ── Public single tour (keep last: ':id' catches everything else) ──
  @Get(':id')
  @ApiOperation({ summary: 'Get a single tour by ID' })
  @ApiResponse({ status: 404, description: 'Tour not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.toursService.findOne(id);
  }
}
