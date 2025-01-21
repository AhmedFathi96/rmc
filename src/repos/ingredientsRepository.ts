import { Prisma, PrismaClient } from '@prisma/client'

export class IngredientsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOneIngredientById(
    query: { id: string },
    tx?: Prisma.TransactionClient
  ) {
    const prismaClient = tx || this.prisma
    return await prismaClient.ingredients.findUnique({
      where: query,
    })
  }

  async updateStockByIngredientId(
    query: { id: string },
    args: { stock?: number; emailSent?: boolean },
    tx?: Prisma.TransactionClient
  ) {
    const prismaClient = tx || this.prisma
    return await prismaClient.ingredients.update({
      where: query,
      data: args,
    })
  }
}

export const ingredientsRepository = new IngredientsRepository(
  new PrismaClient()
)
