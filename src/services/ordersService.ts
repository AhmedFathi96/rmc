import { ordersRepository, OrdersRepository } from "../repos";
import logger from "../utils/logger";

export class OrdersService {
    constructor(private readonly ordersRepository: OrdersRepository){}
    async createOrder(args: {products: {productId: string, quantity: number}[]}) {
        try{
            return await this.ordersRepository.createOrder(args);
        }catch(error){
            logger.error('Error happened while creating order', error);
            throw error;
        }
    }
}
export const ordersService = new OrdersService(ordersRepository);
