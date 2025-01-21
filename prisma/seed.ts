import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import logger from '../src/utils/logger'

const prisma = new PrismaClient()

async function main() {
  try {
    const beefId = uuidv4()
    const cheeseId = uuidv4()
    const onionId = uuidv4()

    await prisma.ingredients.createMany({
      data: [
        {
          id: beefId,
          name: 'Beef',
          stock: 20000,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // 20kg
        {
          id: cheeseId,
          name: 'Cheese',
          stock: 5000,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // 5kg
        {
          id: onionId,
          name: 'Onion',
          stock: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // 1kg
      ],
    })

    logger.info('Ingredients seeded.')

    const burgerId = uuidv4()
    logger.info(`Product id is: ================> ${burgerId}`)
    await prisma.products.create({
      data: {
        id: burgerId,
        name: 'Burger',
        createdAt: new Date(),
        updatedAt: new Date(),
        ingredients: {
          create: [
            {
              ingredientId: beefId,
              quantity: 150,
              createdAt: new Date(),
              updatedAt: new Date(),
            }, // 150g Beef
            {
              ingredientId: cheeseId,
              quantity: 30,
              createdAt: new Date(),
              updatedAt: new Date(),
            }, // 30g Cheese
            {
              ingredientId: onionId,
              quantity: 20,
              createdAt: new Date(),
              updatedAt: new Date(),
            }, // 20g Onion
          ],
        },
      },
    })

    logger.info('Products seeded.')

    const orderId = uuidv4()

    await prisma.orders.create({
      data: {
        id: orderId,
        createdAt: new Date(),
        updatedAt: new Date(),
        products: {
          create: [
            {
              productId: burgerId,
              quantity: 2,
              createdAt: new Date(),
              updatedAt: new Date(),
            }, // 2 Burgers
          ],
        },
      },
    })

    logger.info('Orders seeded.')
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Seeding failed: ${error.message}`)
    } else {
      logger.error('Seeding failed with an unknown error.')
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    logger.info('Database connection closed.')
  }
}

main()
  .then(() => {
    logger.info('Seeding completed successfully.')
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      logger.error(`Unexpected error: ${error.message}`)
    } else {
      logger.error('Unexpected error occurred.')
    }
    process.exit(1)
  })
