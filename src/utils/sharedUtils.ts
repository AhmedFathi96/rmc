import { Ingredient } from '../types'
import logger from './logger'

export const checkRemainingIngredientsPercentage = async (args: {
  ingredient: Ingredient
  consumedQuantity: number
}): Promise<number> => {
  logger.info(`Checking remaining ingredient ${args.ingredient.id} percentage`)
  try {
    const { ingredient, consumedQuantity } = args

    if (ingredient.stock <= 0) {
      throw new Error(`Stock for ingredient ${ingredient.id} is invalid`)
    }

    if (consumedQuantity < 0) {
      throw new Error(
        `Consumed quantity for ingredient ${ingredient.id} cannot be negative`
      )
    }

    const updatedStock = ingredient.stock - consumedQuantity

    if (updatedStock < 0) {
      throw new Error(
        `Insufficient stock for ingredient ${ingredient.id}. Stock cannot be negative.`
      )
    }

    return (updatedStock / ingredient.stock) * 100
  } catch (error) {
    logger.error(
      `Error happened while checking remaining ingredient ${args.ingredient.id} percentage`,
      error
    )
    throw error
  }
}
