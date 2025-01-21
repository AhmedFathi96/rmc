import { Worker } from 'bullmq'
import logger from './utils/logger'
import { sendEmailJob } from './jobs/sendingEmailJob'
import Redis from 'ioredis'

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT || '6379'),
})

connection.on('connect', () => {
  logger.info('Redis connected successfully for the worker.')
})

connection.on('error', (err) => {
  logger.error('Redis connection error for the worker:', err)
})

const connectionOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
}

const worker = new Worker('send-email', sendEmailJob, {
  connection: connectionOptions,
})

worker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id || 'unknown'} failed: ${err.message}`)
})

logger.info('Worker is ready to process jobs')
