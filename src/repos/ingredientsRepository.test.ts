import { PrismaClient } from '@prisma/client'
import { IngredientsRepository } from './ingredientsRepository'

let mockPrismaClient: jest.Mocked<PrismaClient>

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  }
})

describe('IngredientsRepository', () => {
  let ingredientsRepository: IngredientsRepository

  beforeEach(() => {
    mockPrismaClient = {
      ingredients: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $on: jest.fn(),
      $executeRaw: jest.fn(),
      $queryRaw: jest.fn(),
      $transaction: jest.fn(),
    } as unknown as jest.Mocked<PrismaClient>

    ingredientsRepository = new IngredientsRepository(mockPrismaClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('findOneIngredientById', () => {
    it('should find an ingredient by id', async () => {
      const ingredient = {
        id: '123',
        name: 'Onion',
        stock: 50,
        emailSent: false,
      }

      ;(mockPrismaClient.ingredients.findUnique as jest.Mock).mockResolvedValue(
        ingredient
      )

      const result = await ingredientsRepository.findOneIngredientById({
        id: '123',
      })

      expect(mockPrismaClient.ingredients.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      })
      expect(result).toEqual(ingredient)
    })

    it('should return null if ingredient is not found', async () => {
      ;(mockPrismaClient.ingredients.findUnique as jest.Mock).mockResolvedValue(
        null
      )

      const result = await ingredientsRepository.findOneIngredientById({
        id: 'not-found',
      })

      expect(mockPrismaClient.ingredients.findUnique).toHaveBeenCalledWith({
        where: { id: 'not-found' },
      })
      expect(result).toBeNull()
    })
  })

  describe('updateStockByIngredientId', () => {
    it('should update the stock and emailSent for an ingredient', async () => {
      const updatedIngredient = {
        id: '123',
        name: 'Onion',
        stock: 40,
        emailSent: true,
      }

      ;(mockPrismaClient.ingredients.update as jest.Mock).mockResolvedValue(
        updatedIngredient
      )

      const result = await ingredientsRepository.updateStockByIngredientId(
        { id: '123' },
        { stock: 40, emailSent: true }
      )

      expect(mockPrismaClient.ingredients.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: { stock: 40, emailSent: true },
      })
      expect(result).toEqual(updatedIngredient)
    })

    it('should handle errors when updating stock', async () => {
      ;(mockPrismaClient.ingredients.update as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        ingredientsRepository.updateStockByIngredientId(
          { id: '123' },
          { stock: 40 }
        )
      ).rejects.toThrow('Database error')

      expect(mockPrismaClient.ingredients.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: { stock: 40 },
      })
    })
  })
})
