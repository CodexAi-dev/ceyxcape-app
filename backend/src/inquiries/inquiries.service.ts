import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Inquiry } from './inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepo: Repository<Inquiry>,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateInquiryDto): Promise<{ message: string; id: number }> {
    // 1. Persist the inquiry so nothing is lost even if email fails.
    const inquiry = this.inquiryRepo.create({
      type: dto.type ?? 'general',
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      subject: dto.subject,
      message: dto.message,
      tourId: dto.tour_id,
      tourName: dto.tour_name,
      tourDate: dto.tour_date,
      participants: dto.participants,
      status: 'new',
    });
    const saved = await this.inquiryRepo.save(inquiry);

    // 2. Notify the business + confirm to the customer (fire-and-forget; never
    //    block the response or fail the request on email errors).
    this.sendNotifications(saved).catch((err) =>
      this.logger.error('Inquiry notification error', err),
    );

    return {
      message:
        'Thank you for your inquiry! Our team will get back to you shortly.',
      id: saved.id,
    };
  }

  async findAll(): Promise<Inquiry[]> {
    return this.inquiryRepo.find({ order: { createdAt: 'DESC' } });
  }

  async markRead(id: number): Promise<Inquiry | null> {
    await this.inquiryRepo.update(id, { status: 'read' });
    return this.inquiryRepo.findOne({ where: { id } });
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    await this.inquiryRepo.delete(id);
    return { message: 'Inquiry deleted', id };
  }

  // ── Email helpers ──────────────────────────────────────────────
  private async sendNotifications(inquiry: Inquiry): Promise<void> {
    const adminEmail = this.config.get<string>(
      'ADMIN_EMAIL',
      this.config.get<string>('MAIL_FROM', 'info@ceyxcape.com'),
    );

    await Promise.all([
      this.mail.send({
        to: adminEmail,
        replyTo: inquiry.email,
        subject: this.adminSubject(inquiry),
        html: this.adminHtml(inquiry),
      }),
      this.mail.send({
        to: inquiry.email,
        subject: 'We received your inquiry — CeyXcape',
        html: this.customerHtml(inquiry),
      }),
    ]);
  }

  private adminSubject(i: Inquiry): string {
    return i.type === 'tour' && i.tourName
      ? `New tour inquiry: ${i.tourName} — from ${i.name}`
      : `New inquiry from ${i.name}`;
  }

  private adminHtml(i: Inquiry): string {
    const row = (label: string, value?: string | number | null) =>
      value
        ? `<tr><td style="padding:6px 12px;color:#64748b;font-weight:600">${label}</td><td style="padding:6px 12px;color:#0f172a">${value}</td></tr>`
        : '';

    return `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#0f172a">New ${i.type === 'tour' ? 'Tour ' : ''}Inquiry</h2>
        <table style="border-collapse:collapse;width:100%;background:#f8fafc;border-radius:8px">
          ${row('Name', i.name)}
          ${row('Email', i.email)}
          ${row('Phone', i.phone)}
          ${row('Tour', i.tourName)}
          ${row('Preferred date', i.tourDate)}
          ${row('Participants', i.participants)}
          ${row('Subject', i.subject)}
        </table>
        <h3 style="color:#0f172a;margin-top:20px">Message</h3>
        <p style="color:#334155;line-height:1.6;white-space:pre-wrap">${i.message}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0"/>
        <p style="color:#94a3b8;font-size:12px">
          Reply directly to this email to respond to ${i.name}.
          Inquiry #${i.id} · ${new Date(i.createdAt).toLocaleString()}
        </p>
      </div>`;
  }

  private customerHtml(i: Inquiry): string {
    return `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#0f172a">Thank you, ${i.name}!</h2>
        <p style="color:#334155;line-height:1.6">
          We've received your inquiry${i.tourName ? ` about <strong>${i.tourName}</strong>` : ''}
          and one of our travel experts will get back to you shortly — usually within a few hours.
        </p>
        <p style="color:#334155;line-height:1.6">
          For an instant response, message us on WhatsApp at
          <a href="https://wa.me/94786281242" style="color:#b8962e">+94 78 628 1242</a>
          or call us directly.
        </p>
        <div style="background:#fff9f0;border:1px solid #f0e0c0;border-radius:8px;padding:16px;margin:20px 0">
          <p style="color:#64748b;margin:0 0 8px;font-weight:600">Your message:</p>
          <p style="color:#334155;margin:0;white-space:pre-wrap">${i.message}</p>
        </div>
        <p style="color:#94a3b8;font-size:13px">Warm regards,<br/>The CeyXcape Team</p>
      </div>`;
  }
}
