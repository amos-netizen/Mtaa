import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
import * as sgMail from '@sendgrid/mail';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Email Service
 * Supports multiple email providers: SendGrid, Mailgun, and SMTP
 */
@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private emailProvider: 'sendgrid' | 'mailgun' | 'smtp' | 'none' = 'none';
  private smtpTransporter: nodemailer.Transporter | null = null;
  private mailgunClient: any = null;

  constructor(private configService: AppConfigService) {}

  async onModuleInit() {
    await this.initializeEmailProvider();
  }

  /**
   * Initialize the email provider based on environment variables
   */
  private async initializeEmailProvider() {
    const emailService = this.configService.get('EMAIL_SERVICE')?.toLowerCase() || 'none';
    const apiKey = this.configService.get('EMAIL_SERVICE_API_KEY');
    const fromAddress = this.configService.get('EMAIL_FROM_ADDRESS');

    if (!fromAddress) {
      this.logger.warn('EMAIL_FROM_ADDRESS not set. Email functionality will be disabled.');
      this.emailProvider = 'none';
      return;
    }

    switch (emailService) {
      case 'sendgrid':
        if (!apiKey) {
          this.logger.warn('EMAIL_SERVICE_API_KEY not set for SendGrid. Email functionality disabled.');
          this.emailProvider = 'none';
          return;
        }
        sgMail.setApiKey(apiKey);
        this.emailProvider = 'sendgrid';
        this.logger.log('SendGrid email service initialized');
        break;

      case 'mailgun':
        if (!apiKey) {
          this.logger.warn('EMAIL_SERVICE_API_KEY not set for Mailgun. Email functionality disabled.');
          this.emailProvider = 'none';
          return;
        }
        const mailgunDomain = this.configService.get('MAILGUN_DOMAIN');
        if (!mailgunDomain) {
          this.logger.warn('MAILGUN_DOMAIN not set. Email functionality disabled.');
          this.emailProvider = 'none';
          return;
        }
        const mailgun = new Mailgun(FormData as any);
        this.mailgunClient = mailgun.client({
          username: 'api',
          key: apiKey,
        });
        this.mailgunClient.domain = mailgunDomain;
        this.emailProvider = 'mailgun';
        this.logger.log('Mailgun email service initialized');
        break;

      case 'smtp':
        const smtpHost = this.configService.get('SMTP_HOST');
        const smtpPort = parseInt(this.configService.get('SMTP_PORT') || '587', 10);
        const smtpUser = this.configService.get('SMTP_USER');
        const smtpPassword = this.configService.get('SMTP_PASSWORD');
        const smtpSecure = this.configService.get('SMTP_SECURE') === 'true';

        if (!smtpHost || !smtpUser || !smtpPassword) {
          this.logger.warn('SMTP configuration incomplete. Email functionality disabled.');
          this.emailProvider = 'none';
          return;
        }

        this.smtpTransporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPassword,
          },
        });

        // Verify SMTP connection
        try {
          await this.smtpTransporter.verify();
          this.emailProvider = 'smtp';
          this.logger.log('SMTP email service initialized');
        } catch (error) {
          this.logger.error('SMTP connection failed:', error);
          this.emailProvider = 'none';
        }
        break;

      default:
        this.logger.warn(`Unknown email service: ${emailService}. Email functionality disabled.`);
        this.emailProvider = 'none';
    }
  }

  /**
   * Send an email using the configured provider
   */
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    if (this.emailProvider === 'none') {
      this.logger.warn('Email service not configured. Email not sent.');
      return {
        success: false,
        error: 'Email service not configured',
      };
    }

    const fromAddress = options.from || this.configService.get('EMAIL_FROM_ADDRESS') || 'noreply@mymtaa.com';

    try {
      switch (this.emailProvider) {
        case 'sendgrid':
          return await this.sendViaSendGrid({ ...options, from: fromAddress });
        case 'mailgun':
          return await this.sendViaMailgun({ ...options, from: fromAddress });
        case 'smtp':
          return await this.sendViaSMTP({ ...options, from: fromAddress });
        default:
          return {
            success: false,
            error: 'Email provider not initialized',
          };
      }
    } catch (error: any) {
      this.logger.error('Failed to send email:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  /**
   * Send email via SendGrid
   */
  private async sendViaSendGrid(options: EmailOptions): Promise<EmailResult> {
    try {
      const msg: any = {
        to: Array.isArray(options.to) ? options.to : [options.to],
        from: options.from!,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      };

      if (options.cc) {
        msg.cc = Array.isArray(options.cc) ? options.cc : [options.cc];
      }
      if (options.bcc) {
        msg.bcc = Array.isArray(options.bcc) ? options.bcc : [options.bcc];
      }
      if (options.attachments) {
        msg.attachments = options.attachments.map((att) => ({
          filename: att.filename,
          content: att.content.toString('base64'),
          type: att.contentType,
          disposition: 'attachment',
        }));
      }

      const [response] = await sgMail.send(msg);
      this.logger.log(`Email sent via SendGrid to ${options.to}: ${response.statusCode}`);

      return {
        success: true,
        messageId: response.headers['x-message-id'] as string,
      };
    } catch (error: any) {
      this.logger.error('SendGrid error:', error.response?.body || error);
      return {
        success: false,
        error: error.response?.body?.errors?.[0]?.message || error.message,
      };
    }
  }

  /**
   * Send email via Mailgun
   */
  private async sendViaMailgun(options: EmailOptions): Promise<EmailResult> {
    try {
      const messageData: any = {
        from: options.from!,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      };

      if (options.cc) {
        messageData.cc = Array.isArray(options.cc) ? options.cc : [options.cc];
      }
      if (options.bcc) {
        messageData.bcc = Array.isArray(options.bcc) ? options.bcc : [options.bcc];
      }
      if (options.attachments) {
        messageData.attachment = options.attachments.map((att) => ({
          filename: att.filename,
          data: att.content,
        }));
      }

      const response = await this.mailgunClient.messages.create(this.mailgunClient.domain, messageData);
      this.logger.log(`Email sent via Mailgun to ${options.to}: ${response.id}`);

      return {
        success: true,
        messageId: response.id,
      };
    } catch (error: any) {
      this.logger.error('Mailgun error:', error);
      return {
        success: false,
        error: error.message || 'Unknown Mailgun error',
      };
    }
  }

  /**
   * Send email via SMTP
   */
  private async sendViaSMTP(options: EmailOptions): Promise<EmailResult> {
    if (!this.smtpTransporter) {
      return {
        success: false,
        error: 'SMTP transporter not initialized',
      };
    }

    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: options.from!,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      };

      if (options.cc) {
        mailOptions.cc = Array.isArray(options.cc) ? options.cc.join(', ') : options.cc;
      }
      if (options.bcc) {
        mailOptions.bcc = Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc;
      }
      if (options.attachments) {
        mailOptions.attachments = options.attachments.map((att) => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
        }));
      }

      const info = await this.smtpTransporter.sendMail(mailOptions);
      this.logger.log(`Email sent via SMTP to ${options.to}: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error: any) {
      this.logger.error('SMTP error:', error);
      return {
        success: false,
        error: error.message || 'Unknown SMTP error',
      };
    }
  }

  /**
   * Strip HTML tags from text (for plain text fallback)
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }

  /**
   * Send verification email for user registration
   */
  async sendVerificationEmail(email: string, verificationToken: string, userName: string): Promise<EmailResult> {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const verificationLink = `${frontendUrl}/auth/verify-email?token=${verificationToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - MTAA</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome to MTAA!</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi ${userName},</p>
            <p>Thank you for registering with MTAA! Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${verificationLink}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with MTAA, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} MTAA. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Verify Your Email Address - MTAA',
      html,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetToken: string, userName: string): Promise<EmailResult> {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password - MTAA</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Password Reset Request</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi ${userName},</p>
            <p>We received a request to reset your password for your MTAA account. Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #f5576c;">${resetLink}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} MTAA. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Reset Your Password - MTAA',
      html,
    });
  }

  /**
   * Send emergency alert notification email
   */
  async sendEmergencyAlertEmail(
    email: string,
    alertTitle: string,
    alertDescription: string,
    alertType: string,
    neighborhoodName: string,
  ): Promise<EmailResult> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Emergency Alert - MTAA</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🚨 Emergency Alert</h1>
          </div>
          <div style="background: #fff; padding: 30px; border-radius: 0 0 10px 10px; border-left: 4px solid #ff6b6b;">
            <h2 style="color: #ff6b6b; margin-top: 0;">${alertTitle}</h2>
            <p><strong>Type:</strong> ${alertType}</p>
            <p><strong>Location:</strong> ${neighborhoodName}</p>
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0;">${alertDescription}</p>
            </div>
            <p>Please stay safe and follow any instructions from local authorities.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} MTAA. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `🚨 Emergency Alert: ${alertTitle} - ${neighborhoodName}`,
      html,
    });
  }

  /**
   * Send job application notification email
   */
  async sendJobApplicationEmail(
    employerEmail: string,
    applicantName: string,
    jobTitle: string,
    coverLetter: string,
  ): Promise<EmailResult> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Job Application - MTAA</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">New Job Application</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>You have received a new application for the position:</p>
            <h2 style="color: #4facfe;">${jobTitle}</h2>
            <p><strong>Applicant:</strong> ${applicantName}</p>
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Cover Letter:</h3>
              <p style="white-space: pre-wrap;">${coverLetter}</p>
            </div>
            <p>Please log in to your MTAA account to review the full application and respond.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} MTAA. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: employerEmail,
      subject: `New Application for ${jobTitle} - MTAA`,
      html,
    });
  }

  /**
   * Send message notification email
   */
  async sendMessageNotificationEmail(
    recipientEmail: string,
    senderName: string,
    messagePreview: string,
    conversationLink: string,
  ): Promise<EmailResult> {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const fullLink = conversationLink.startsWith('http') ? conversationLink : `${frontendUrl}${conversationLink}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Message - MTAA</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #333; margin: 0;">💬 New Message</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p><strong>${senderName}</strong> sent you a message:</p>
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #a8edea;">
              <p style="margin: 0; white-space: pre-wrap;">${messagePreview}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${fullLink}" style="background: #a8edea; color: #333; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">View Message</a>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} MTAA. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: recipientEmail,
      subject: `New message from ${senderName} - MTAA`,
      html,
    });
  }
}

