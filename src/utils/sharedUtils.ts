import { Ingredient } from '../types'
import logger from './logger'

export const checkRemainingIngredientsPercentage = async (args: {
  ingredient: Ingredient
  consumedQuantity: number
}): Promise<number> => {
  logger.info(`Checking remaining ingredient ${args.ingredient.id} percentage`)
  try {
    const updatedStock = args.ingredient.stock - args.consumedQuantity
    return (updatedStock / args.ingredient.stock) * 100
  } catch (error) {
    logger.error(
      `Error happened while checking remaining ingredient ${args.ingredient.id} percentage`,
      error
    )
    throw error
  }
}
