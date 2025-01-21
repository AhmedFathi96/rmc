import { Ingredient } from '../types'
import { checkRemainingIngredientsPercentage } from './sharedUtils'

jest.mock('./logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}))

describe('checkRemainingIngredientsPercentage', () => {
  const mockIngredient: Ingredient = {
    id: 'test-ingredient',
    stock: 1000,
    emailSent: false,
    name: 'Test Ingredient',
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should calculate the remaining percentage correctly', async () => {
    const args = {
      ingredient: mockIngredient,
      consumedQuantity: 200,
    }

    const result = await checkRemainingIngredientsPercentage(args)

    expect(result).toBe(80) // (800 / 1000) * 100
  })

  it('should throw an error if ingredient stock is zero', async () => {
    const args = {
      ingredient: { ...mockIngredient, stock: 0 },
      consumedQuantity: 100,
    }

    await expect(checkRemainingIngredientsPercentage(args)).rejects.toThrow(
      `Stock for ingredient ${mockIngredient.id} is invalid`
    )
  })

  it('should throw an error if consumed quantity is negative', async () => {
    const args = {
      ingredient: mockIngredient,
      consumedQuantity: -50,
    }

    await expect(checkRemainingIngredientsPercentage(args)).rejects.toThrow(
      `Consumed quantity for ingredient ${mockIngredient.id} cannot be negative`
    )
  })

  it('should throw an error if stock goes negative after consumption', async () => {
    const args = {
      ingredient: mockIngredient,
      consumedQuantity: 1500, // More than available stock
    }

    await expect(checkRemainingIngredientsPercentage(args)).rejects.toThrow(
      `Insufficient stock for ingredient ${mockIngredient.id}. Stock cannot be negative.`
    )
  })
})
