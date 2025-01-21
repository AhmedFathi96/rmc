import nodemailer, { Transporter } from 'nodemailer'

interface EmailOptions {
  from: string
  to: string
  subject: string
  text?: string
  html?: string
}

export class EMAILEmailClient {
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }

  async sendMail(options: EmailOptions): Promise<void> {
    await this.transporter.sendMail(options)
  }
}
