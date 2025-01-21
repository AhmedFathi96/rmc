import { CreateOrder } from './ordersController'
import { ingredientsService, productsService, ordersService } from '../services'
import { PrismaClient } from '@prisma/client'
import { Ingredient } from '../types'

jest.mock('../services')
jest.mock('./emailController', () => ({
  sendEmail: jest.fn(),
}))
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  checkRemainingIngredientsPercentage: jest.fn(() => Promise.resolve(50)),
}))

const prismaMock = {
  $transaction: jest.fn(async (callback: any) => {
    const tx = {}
    return callback(tx)
  }),
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prismaMock),
}))

describe('CreateOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.REDIS_PORT = '6379'
    process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/testdb'
  })

  it('should persist the order in the database', async () => {
    const mockArgs = {
      products: [{ productId: '1', quantity: 2 }],
    }

    const mockProduct = {
      id: '1',
      ingredients: [
        { ingredientId: 'beef', quantity: 150 },
        { ingredientId: 'cheese', quantity: 30 },
      ],
    }

    const mockIngredients: Record<string, Ingredient> = {
      beef: { id: 'beef', stock: 20000, emailSent: false, name: 'Beef' },
      cheese: { id: 'cheese', stock: 5000, emailSent: false, name: 'Cheese' },
    }

    productsService.findOneProductById = jest
      .fn()
      .mockResolvedValue(mockProduct)
    ingredientsService.findOneIngredientById = jest
      .fn()
      .mockImplementation(({ id }) => Promise.resolve(mockIngredients[id]))
    ingredientsService.updateStockByIngredientId = jest.fn()
    ordersService.createOrder = jest.fn()

    // Call CreateOrder with mocked PrismaClient
    await CreateOrder(mockArgs, prismaMock as unknown as PrismaClient)

    expect(productsService.findOneProductById).toHaveBeenCalledWith(
      { id: '1' },
      expect.any(Object)
    )
    expect(ingredientsService.findOneIngredientById).toHaveBeenCalledWith(
      { id: 'beef' },
      expect.any(Object)
    )
    expect(ingredientsService.updateStockByIngredientId).toHaveBeenCalledTimes(
      2
    )
    expect(ordersService.createOrder).toHaveBeenCalledWith(
      mockArgs,
      expect.any(Object)
    )
  })
})
