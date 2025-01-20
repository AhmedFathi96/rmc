import { Prisma, PrismaClient } from "@prisma/client";

export class OrdersRepository {
    constructor(private readonly prisma: PrismaClient | Prisma.TransactionClient){}

    async createOrder(args: {products: {productId: string, quantity: number}[]}) {
        return await this.prisma.orders.create({
            data: {
                updatedAt: new Date(),
                products: {
                    create: args.products.map((product) => ({
                        productId: product.productId,
                        quantity: product.quantity,
                        updatedAt: new Date(),
                    })),
                },
            },
        });
    }
}

export const ordersRepository = new OrdersRepository(new PrismaClient());
