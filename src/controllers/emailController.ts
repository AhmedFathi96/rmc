import { emailQueue } from '../queues/emailQueue'

export const sendEmail = async (emailData: {
  to: string
  subject: string
  text?: string
  html?: string
}) => {
  await emailQueue.add('send-email', emailData)
}
