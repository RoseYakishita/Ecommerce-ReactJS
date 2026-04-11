import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendContactDto } from './dto/send-contact.dto';

const sanitizeGmailAppPassword = (value?: string) => (value || '').replace(/\s+/g, '');

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendMessage(payload: SendContactDto) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT') || 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = sanitizeGmailAppPassword(this.configService.get<string>('SMTP_PASS'));
    const to = this.configService.get<string>('CONTACT_RECEIVER_EMAIL') || 'hungdo1388@gmail.com';

    if (!host || !user || !pass) {
      throw new BadRequestException('SMTP is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.');
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const html = `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Subject:</strong> ${payload.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${payload.message.replace(/\n/g, '<br/>')}</p>
    `;

    try {
      await transporter.sendMail({
        from: `Lumina Contact <${user}>`,
        to,
        replyTo: payload.email,
        subject: `[Contact] ${payload.subject}`,
        text: `Name: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject}\n\n${payload.message}`,
        html,
      });

      this.logger.log(JSON.stringify({
        event: 'contact_mail_sent',
        receiver: to,
        senderEmail: payload.email,
        subject: payload.subject,
        timestamp: new Date().toISOString(),
      }));

      return { success: true, message: 'Message sent successfully' };
    } catch (err: any) {
      const detail = err?.response || err?.message || 'Unknown SMTP error';
      this.logger.error(JSON.stringify({
        event: 'contact_mail_failed',
        receiver: to,
        senderEmail: payload.email,
        subject: payload.subject,
        error: detail,
        timestamp: new Date().toISOString(),
      }));
      throw new InternalServerErrorException(`Cannot send email: ${detail}`);
    }
  }
}
