import { Prisma, PrismaClient } from "@prisma/client";

export class IngredientsRepository {
    constructor(private readonly prisma: PrismaClient| Prisma.TransactionClient){}

    async findOneIngredientById(query: { id: string }) {
        return await this.prisma.ingredients.findUnique({
            where: query,
        });
    }

    async updateStockByIngredientId(query: { id: string, stock: number }) {
        return await this.prisma.ingredients.update({
            where: { id: query.id },
            data: { stock: query.stock },
        });
    }
}

export const ingredientsRepository = new IngredientsRepository(new PrismaClient());
