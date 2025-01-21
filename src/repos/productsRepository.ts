import { Prisma, PrismaClient } from '@prisma/client'

export class ProductsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOneProductById(
    query: { id: string },
    tx?: Prisma.TransactionClient
  ) {
    const prismaClient = tx || this.prisma
    return await prismaClient.products.findUnique({
      where: query,
      include: {
        ingredients: true,
      },
    })
  }
}

export const productsRepository = new ProductsRepository(new PrismaClient())
