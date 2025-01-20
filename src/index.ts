import express, { Request, Response } from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import ordersRouter from './routes/ordersRoutes';
import logger from './utils/logger';
import { isPrismaHealthy } from './utils';
import { errorHandler } from './middlewares';

dotenv.config();

const app = express()
const port = process.env.APP_PORT || 3000
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req: Request, res: Response) => {
  try {
    const prisma = await isPrismaHealthy()
    res.status(prisma ? 200 : 400).send({ result: prisma })
  } catch (error) {
    res.status(400).send({ error })
  }
})


app.use('/orders', ordersRouter);

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
