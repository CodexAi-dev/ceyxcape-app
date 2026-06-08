import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { SanitizePipe } from '../common/pipes/sanitize.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  // Public submission — strict throttle to stop spam (5 per 15 min per IP).
  // SanitizePipe strips XSS from every string field before processing.
  @Post()
  @Throttle({ default: { ttl: 900000, limit: 5 } })
  @ApiOperation({ summary: 'Submit an inquiry (contact form or tour enquiry)' })
  create(@Body(SanitizePipe) dto: CreateInquiryDto) {
    return this.inquiriesService.create(dto);
  }

  // ── Admin-only management ──
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all inquiries (admin only)' })
  findAll() {
    return this.inquiriesService.findAll();
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark an inquiry as read (admin only)' })
  markRead(@Param('id', ParseIntPipe) id: number) {
    return this.inquiriesService.markRead(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an inquiry (admin only)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inquiriesService.remove(id);
  }
}
