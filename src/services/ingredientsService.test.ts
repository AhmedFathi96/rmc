import { IngredientsService } from './ingredientsService'
import { IngredientsRepository } from '../repos'

jest.mock('../repos')

describe('IngredientsService', () => {
  let ingredientsService: IngredientsService
  let mockIngredientsRepository: jest.Mocked<IngredientsRepository>

  beforeEach(() => {
    mockIngredientsRepository = {
      findOneIngredientById: jest.fn(),
      updateStockByIngredientId: jest.fn(),
    } as unknown as jest.Mocked<IngredientsRepository>

    ingredientsService = new IngredientsService(mockIngredientsRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('findOneIngredientById', () => {
    it('should return the ingredient if found', async () => {
      const ingredient = {
        id: '123',
        name: 'Onion',
        stock: 50,
        emailSent: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockIngredientsRepository.findOneIngredientById.mockResolvedValue(
        ingredient
      )

      const result = await ingredientsService.findOneIngredientById({
        id: '123',
      })

      expect(
        mockIngredientsRepository.findOneIngredientById
      ).toHaveBeenCalledWith({ id: '123' }, undefined)
      expect(result).toEqual(ingredient)
    })

    it('should throw an error if the ingredient is not found', async () => {
      mockIngredientsRepository.findOneIngredientById.mockResolvedValue(null)

      await expect(
        ingredientsService.findOneIngredientById({ id: '123' })
      ).rejects.toThrow('Ingredient with id: 123 not found')

      expect(
        mockIngredientsRepository.findOneIngredientById
      ).toHaveBeenCalledWith({ id: '123' }, undefined)
    })

    it('should rethrow any errors from the repository', async () => {
      const error = new Error('Database error')
      mockIngredientsRepository.findOneIngredientById.mockRejectedValue(error)

      await expect(
        ingredientsService.findOneIngredientById({ id: '123' })
      ).rejects.toThrow('Database error')
    })
  })

  describe('updateStockByIngredientId', () => {
    it('should update the stock and return the updated ingredient', async () => {
      const updatedIngredient = {
        id: '123',
        name: 'Onion',
        stock: 40,
        emailSent: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockIngredientsRepository.updateStockByIngredientId.mockResolvedValue(
        updatedIngredient
      )

      const result = await ingredientsService.updateStockByIngredientId(
        { id: '123' },
        { stock: 40, emailSent: true }
      )

      expect(
        mockIngredientsRepository.updateStockByIngredientId
      ).toHaveBeenCalledWith(
        { id: '123' },
        { stock: 40, emailSent: true },
        undefined
      )
      expect(result).toEqual(updatedIngredient)
    })

    it('should rethrow any errors from the repository', async () => {
      const error = new Error('Database error')
      mockIngredientsRepository.updateStockByIngredientId.mockRejectedValue(
        error
      )

      await expect(
        ingredientsService.updateStockByIngredientId(
          { id: '123' },
          { stock: 40 }
        )
      ).rejects.toThrow('Database error')
    })
  })
})
