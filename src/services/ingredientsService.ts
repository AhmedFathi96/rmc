import { ingredientsRepository, IngredientsRepository } from '../repos'
import logger from '../utils/logger'

export class IngredientsService {
  constructor(private readonly ingredientsRepository: IngredientsRepository) {}

  async findOneIngredientById(query: { id: string }) {
    try {
      const ingredient = await this.ingredientsRepository.findOneIngredientById(
        query
      )

      if (!ingredient) {
        logger.error(`Ingredient with id: ${query.id} not found`)
        throw new Error(`Ingredient with id: ${query.id} not found`)
      }

      return ingredient
    } catch (error) {
      logger.error(
        `Error happened while finding ingredient with id: ${query.id}`,
        error
      )
      throw error
    }
  }
  async updateStockByIngredientId(
    query: { id: string },
    args: { stock?: number; emailSent?: boolean }
  ) {
    try {
      return await this.ingredientsRepository.updateStockByIngredientId(
        query,
        args
      )
    } catch (error) {
      logger.error(
        `Error happened while updating stock for ingredient with id: ${query.id}`,
        error
      )
      throw error
    }
  }
}
export const ingredientsService = new IngredientsService(ingredientsRepository)
