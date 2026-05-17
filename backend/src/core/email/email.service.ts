import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import handlebars from 'handlebars';
import mjml2html from 'mjml';

import { EmailTemplates, SendVerificationEmailOptions } from './email.types';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow('EMAIL_HOST'),
      port: Number(this.configService.getOrThrow('EMAIL_PORT')),
      secure: true,
      auth: {
        user: this.configService.getOrThrow('EMAIL_USER'),
        pass: this.configService.getOrThrow('EMAIL_PASSWORD'),
      },
    });
  }

  // Завантаження шаблону email
  private async loadTemplate<T extends keyof EmailTemplates>(
    templateName: T,
    data: EmailTemplates[T],
  ): Promise<string> {
    // шлях до шаблону
    const filePath = path.resolve(
      'src/core/email/templates',
      `${templateName}.mjml`,
    );

    // читаємо файл
    const source = await fs.readFile(filePath, 'utf8');

    // handlebars compile
    const compiled = handlebars.compile(source);

    // підстановка {{...}}
    const mjml = compiled(data);

    // конвертація MJML -> HTML
    const { html } = await mjml2html(mjml);

    return html;
  }

  async sendEmail<T extends keyof EmailTemplates>(
    to: string, // кому
    subject: string, // тема
    template: T, // шаблон
    data: EmailTemplates[T], // дані для шаблону
  ) {
    // HTML лист
    const html = await this.loadTemplate(template, data);

    // відправка
    await this.transporter.sendMail({
      from: this.configService.getOrThrow('EMAIL_FROM'),
      to,
      subject,
      html,
    });
  }

  // 🔵 Email підтвердження пошти
  async sendVerificationEmail({
    email,
    username,
    confirmationLink,
  }: SendVerificationEmailOptions) {
    await this.sendEmail(email, 'Verify your email', 'verify-email', {
      username,
      confirmationLink,
    });
  }
}
