import { Prisma, PrismaClient } from "@prisma/client";

export class ProductsRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient){}

    async findOneProductById(query: { id: string }) {
        return await this.prisma.products.findUnique({
            where: query,
            include: {
                ingredients: true,
            },
        });
    }
}

export const productsRepository = new ProductsRepository(new PrismaClient());
