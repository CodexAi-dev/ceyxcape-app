import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

// Centralised email sending. Reads SMTP settings from .env.
// If SMTP is not configured (or still using placeholder creds), it degrades
// gracefully: it logs the email instead of failing — so an inquiry is never
// lost just because mail isn't set up yet.
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('MAIL_HOST');
    const user = this.config.get<string>('MAIL_USER');
    const pass = this.config.get<string>('MAIL_PASSWORD');
    this.from = this.config.get<string>('MAIL_FROM', 'noreply@ceyxcape.com');

    // Treat the shipped placeholder credentials as "not configured".
    const isPlaceholder =
      !user || !pass || user === 'test@example.com' || pass === 'test123456';

    if (host && !isPlaceholder) {
      const port = Number(this.config.get<number>('MAIL_PORT', 587));
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // 465 = implicit TLS, 587 = STARTTLS
        auth: { user, pass },
      });
      this.logger.log(`Mail transport ready (${host}:${port})`);
    } else {
      this.logger.warn(
        'SMTP not configured — emails will be logged to console only. ' +
          'Set MAIL_HOST / MAIL_USER / MAIL_PASSWORD in .env to send real emails.',
      );
    }
  }

  /**
   * Send an email. Never throws — failures are logged so the calling request
   * (e.g. an inquiry submission) still succeeds.
   */
  async send(opts: {
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
  }): Promise<boolean> {
    if (!this.transporter) {
      this.logger.log(
        `[MAIL — not sent, SMTP off] to=${opts.to} subject="${opts.subject}"`,
      );
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        replyTo: opts.replyTo,
      });
      this.logger.log(`Email sent to ${opts.to} — "${opts.subject}"`);
      return true;
    } catch (err) {
      this.logger.error(`Failed to send email to ${opts.to}`, err as Error);
      return false;
    }
  }
}
