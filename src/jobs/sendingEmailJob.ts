import { Job } from 'bullmq'
import logger from '../utils/logger'
import transporter from '../utils/nodemailer'

export const sendEmailJob = async (job: Job) => {
  logger.info(`Processing job ${job.id} with data:`, job.data)

  const { to, subject, text, html } = job.data

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    })

    logger.info(`Email sent to ${to} for job ${job.id}`)
  } catch (error) {
    logger.error(`Failed to send email for job ${job.id}: ${error}`)
    throw error
  }
}
