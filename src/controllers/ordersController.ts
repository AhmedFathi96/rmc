import { ingredientsService, ordersService, productsService } from '../services'
import { Ingredient } from '../types'
import { checkRemainingIngredientsPercentage } from '../utils'
import logger from '../utils/logger'
import { sendEmail } from './emailController'

export const CreateOrder = async (args: {
  products: { productId: string; quantity: number }[]
}) => {
  logger.info('Calling create order controller with args')

  try {
    const ingredientUpdates = new Map<
      string,
      { updatedStock: number; consumedQuantity: number; ingredient: Ingredient }
    >()

    for (const product of args.products) {
      const productDetails = await productsService.findOneProductById({
        id: product.productId,
      })

      for (const productIngredient of productDetails.ingredients) {
        const consumedQuantity = productIngredient.quantity * product.quantity

        if (!ingredientUpdates.has(productIngredient.ingredientId)) {
          const ingredient = await ingredientsService.findOneIngredientById({
            id: productIngredient.ingredientId,
          })

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

    await Promise.all(
      Array.from(ingredientUpdates.entries()).map(
        async ([
          ingredientId,
          { updatedStock, consumedQuantity, ingredient },
        ]) => {
          if (updatedStock < 0) {
            logger.error(`Stock for ingredient ${ingredientId} is insufficient`)
            throw new Error(
              `Stock for ingredient ${ingredientId} is insufficient`
            )
          }

          await ingredientsService.updateStockByIngredientId(
            {
              id: ingredientId,
            },
            { stock: updatedStock }
          )

          const remainingPercentage = await checkRemainingIngredientsPercentage(
            {
              ingredient,
              consumedQuantity,
            }
          )

          if (remainingPercentage <= 10 && !ingredient.emailSent) {
            logger.info(`Sending email for ingredient ${ingredientId}`)
            await sendEmail({
              to: process.env.EMAIL_TO || '',
              subject: 'WARNING: Low stock of an ingredient',
              text: `The stock for ${ingredient.name} is critically low. Only ${remainingPercentage}% remains.`,
            })

            await ingredientsService.updateStockByIngredientId(
              {
                id: ingredientId,
              },
              { emailSent: false }
            )
          }
        }
      )
    )

    await ordersService.createOrder(args)

    logger.info('Order created successfully')
  } catch (error) {
    logger.error(
      'Error occurred while processing create order controller',
      error
    )
    throw error
  }
}
