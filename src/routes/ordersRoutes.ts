import { Router, Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { CreateOrder } from '../controllers';
import { createOrderSchema } from '../types';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info({
            message: 'Incoming request to create an order',
            endpoint: req.originalUrl,
            method: req.method,
            payload: req.body,
        });

        const validatedBody = createOrderSchema.parse(req.body);

        await CreateOrder({ products: validatedBody.products });

        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error: any) {
        logger.error({
            message: 'Error in /orders POST route',
            endpoint: req.originalUrl,
            method: req.method,
            payload: req.body,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });
        next(error);
    }
});

export default router;
