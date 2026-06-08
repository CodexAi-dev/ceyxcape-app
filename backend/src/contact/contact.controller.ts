import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ContactDto } from '../common/dto/contact.dto';
import { SanitizePipe } from '../common/pipes/sanitize.pipe';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  // Strict: 5 submissions per 15 minutes per IP — prevents spam
  @Post()
  @Throttle({ default: { ttl: 900000, limit: 5 } })
  @ApiOperation({ summary: 'Submit a contact / enquiry form' })
  submit(@Body(SanitizePipe) dto: ContactDto) {
    // SanitizePipe strips XSS from name/message before any processing
    // TODO: wire to email service (Nodemailer/SendGrid)
    return { message: 'Your message has been received. We will contact you shortly.' };
  }
}
