import { PrismaClient } from '@prisma/client'

export class IngredientsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOneIngredientById(query: { id: string }) {
    return await this.prisma.ingredients.findUnique({
      where: query,
    })
  }

  async updateStockByIngredientId(
    query: { id: string },
    args: { stock?: number; emailSent?: boolean }
  ) {
    return await this.prisma.ingredients.update({
      where: query,
      data: args,
    })
  }
}

export const ingredientsRepository = new IngredientsRepository(
  new PrismaClient()
)
