import { Worker, Queue } from 'bullmq';
import Redis from 'ioredis';
import logger from './utils/logger';

// Configure Redis connection with required options
const connectionOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

const worker = new Worker(
  'emails',
  async (job) => {
    logger.info(`Processing job ${job.id}`);
  },
  {
    connection: connectionOptions,
  }
);

worker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id || 'unknown'} failed: ${err.message}`);
});

logger.info('Worker is ready to process jobs');
