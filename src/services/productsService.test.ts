import { ProductsService } from './productsService'
import { ProductsRepository } from '../repos'

jest.mock('../repos')

describe('ProductsService', () => {
  let productsService: ProductsService
  let mockProductsRepository: jest.Mocked<ProductsRepository>

  beforeEach(() => {
    mockProductsRepository = {
      findOneProductById: jest.fn(),
    } as unknown as jest.Mocked<ProductsRepository>

    productsService = new ProductsService(mockProductsRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('findOneProductById', () => {
    it('should return the product if found', async () => {
      const product = {
        id: '123',
        name: 'Product A',
        createdAt: new Date(),
        updatedAt: new Date(),
        ingredients: [
          {
            productId: '123',
            ingredientId: 'ing1',
            quantity: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      }
      mockProductsRepository.findOneProductById.mockResolvedValue(product)

      const result = await productsService.findOneProductById({ id: '123' })

      expect(mockProductsRepository.findOneProductById).toHaveBeenCalledWith(
        { id: '123' },
        undefined
      )
      expect(result).toEqual(product)
    })

    it('should throw an error if the product is not found', async () => {
      mockProductsRepository.findOneProductById.mockResolvedValue(null)

      await expect(
        productsService.findOneProductById({ id: '123' })
      ).rejects.toThrow('Product with id: 123 not found')

      expect(mockProductsRepository.findOneProductById).toHaveBeenCalledWith(
        { id: '123' },
        undefined
      )
    })

    it('should rethrow any errors from the repository', async () => {
      const error = new Error('Database error')
      mockProductsRepository.findOneProductById.mockRejectedValue(error)

      await expect(
        productsService.findOneProductById({ id: '123' })
      ).rejects.toThrow('Database error')

      expect(mockProductsRepository.findOneProductById).toHaveBeenCalledWith(
        { id: '123' },
        undefined
      )
    })
  })
})
