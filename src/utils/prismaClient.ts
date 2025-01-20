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


export const transactionWrapper = async <T>(
  fn: (transactionPrisma: Prisma.TransactionClient) => Promise<T>
): Promise<T> => {
  try {
    return await client.$transaction(async (transactionPrisma) => {
      return await fn(transactionPrisma);
    });
  } catch (error) {
    logger.error('Transaction failed:', error);
    throw error;
  }
};


export const isPrismaHealthy = async (): Promise<boolean> => {
  try {
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch (_) {
    return false;
  }
};

