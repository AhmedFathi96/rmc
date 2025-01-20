import { productsRepository, ProductsRepository } from "../repos";
import logger from "../utils/logger";

export class ProductsService {
    constructor(private readonly productsRepository: ProductsRepository){}
    async findOneProductById(query: { id: string }) {
        try{
            const product = await this.productsRepository.findOneProductById(query);
            
            if (!product) {
                logger.error(`Product with id: ${query.id} not found`);
                throw new Error(`Product with id: ${query.id} not found`);
            }

            return product
        }catch(error){
            logger.error(`Error happened while finding product with id: ${query.id}`, error);
            throw error;
        }
    }
}
export const productsService = new ProductsService(productsRepository);
