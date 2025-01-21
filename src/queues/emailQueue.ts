import { Queue } from 'bullmq'

export const emailQueue = new Queue('send-email', {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: true,
  },
})

emailQueue.on('error', (err) => {
  console.error('Queue connection error:', err)
})

console.log('Queue is connected to Redis:', {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
})
