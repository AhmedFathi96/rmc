import { PrismaClient } from '@prisma/client'
import logger from '../utils/logger'
import { ingredientsService, productsService, ordersService } from '../services'
import { sendEmail } from './emailController'
import { checkRemainingIngredientsPercentage } from '../utils'
import { Ingredient } from '../types'

export const CreateOrder = async (
  args: { products: { productId: string; quantity: number }[] },
  prisma: PrismaClient = new PrismaClient()
) => {
  logger.info('Calling create order controller with args')

  try {
    const ingredientUpdates = new Map<
      string,
      { updatedStock: number; consumedQuantity: number; ingredient: Ingredient }
    >()

    await prisma.$transaction(async (tx) => {
      for (const product of args.products) {
        const productDetails = await productsService.findOneProductById(
          { id: product.productId },
          tx
        )

        for (const productIngredient of productDetails.ingredients) {
          const consumedQuantity = productIngredient.quantity * product.quantity

          if (!ingredientUpdates.has(productIngredient.ingredientId)) {
            const ingredient = await ingredientsService.findOneIngredientById(
              { id: productIngredient.ingredientId },
              tx
            )

            ingredientUpdates.set(productIngredient.ingredientId, {
              updatedStock: ingredient.stock,
              consumedQuantity: 0,
              ingredient,
            })
          }

          const ingredientData = ingredientUpdates.get(
            productIngredient.ingredientId
          )!
          ingredientData.updatedStock -= consumedQuantity
          ingredientData.consumedQuantity += consumedQuantity
        }
      }

      for (const [
        ingredientId,
        { updatedStock, consumedQuantity, ingredient },
      ] of ingredientUpdates.entries()) {
        if (updatedStock < 0) {
          logger.error(`Stock for ingredient ${ingredientId} is insufficient`)
          throw new Error(
            `Stock for ingredient ${ingredientId} is insufficient`
          )
        }

        await ingredientsService.updateStockByIngredientId(
          { id: ingredientId },
          { stock: updatedStock },
          tx
        )

        const remainingPercentage = await checkRemainingIngredientsPercentage({
          ingredient,
          consumedQuantity,
        })

        if (
          remainingPercentage <= +(process.env.LOW_STOCK_THRESHOLD || 50) &&
          !ingredient.emailSent
        ) {
          logger.info(`Sending email for ingredient ${ingredientId}`)
          await sendEmail({
            to: process.env.EMAIL_TO || '',
            subject: 'WARNING: Low stock of an ingredient',
            text: `The stock for ${ingredient.name} is critically low. Only ${remainingPercentage}% remains.`,
          })

          await ingredientsService.updateStockByIngredientId(
            { id: ingredientId },
            { emailSent: true },
            tx
          )
        }
      }

      await ordersService.createOrder(args, tx)
    })

    logger.info('Order created successfully')
  } catch (error) {
    logger.error(
      'Error occurred while processing create order controller',
      error
    )
    throw error
  }
}
