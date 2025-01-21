export * from '@prisma/client'
import { Prisma, PrismaClient } from '@prisma/client'
import 'dotenv/config'
import logger from './logger';

export const client = new PrismaClient({
  transactionOptions: {
    maxWait: 5000, 
    timeout: 50000,
  },
})


export const isPrismaHealthy = async (): Promise<boolean> => {
  try {
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch (_) {
    return false;
  }
};

