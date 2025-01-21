import { Prisma, PrismaClient } from '@prisma/client'

export class OrdersRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createOrder(
    args: {
      products: { productId: string; quantity: number }[]
    },
    tx?: Prisma.TransactionClient
  ) {
    const prismaClient = tx || this.prisma

    return await prismaClient.orders.create({
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
    })
  }
}

export const ordersRepository = new OrdersRepository(new PrismaClient())
