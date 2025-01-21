import { Worker } from 'bullmq';
import Redis from 'ioredis';
import logger from '../utils/logger';
import nodemailer from 'nodemailer';

const connection = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || '6379'),
});

connection.on('connect', () => {
    logger.info('Redis connected successfully for the worker.');
});

connection.on('error', (err) => {
    logger.error('Redis connection error for the worker:', err);
});

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const worker = new Worker(
    'emailQueue',
    async (job) => {
        logger.info(`Processing job ${job.id} with data: ${JSON.stringify(job.data)}`);

        const { to, subject, text, html } = job.data;

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM || 'no-reply@example.com',
                to,
                subject,
                text,
                html,
            });

            logger.info(`Email sent to ${to} for job ${job.id}`);
        } catch (error) {
            logger.error(`Failed to send email for job ${job.id}: ${error}`);
            throw error; 
        }
    },
    { connection }
);

worker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed: ${err.message}`);
});

export default worker;
