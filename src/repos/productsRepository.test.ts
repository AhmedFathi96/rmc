import { Prisma, PrismaClient } from '@prisma/client'
import { ProductsRepository } from './productsRepository'

let mockPrismaClient: jest.Mocked<PrismaClient>

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  }
})

describe('ProductsRepository', () => {
  let productsRepository: ProductsRepository

  beforeEach(() => {
    mockPrismaClient = {
      products: {
        findUnique: jest.fn(),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $on: jest.fn(),
      $executeRaw: jest.fn(),
      $queryRaw: jest.fn(),
      $transaction: jest.fn(),
    } as unknown as jest.Mocked<PrismaClient>

    productsRepository = new ProductsRepository(mockPrismaClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('findOneProductById', () => {
    it('should find a product by id with its ingredients', async () => {
      const productId = 'product1'
      const productData = {
        id: productId,
        name: 'Product Name',
        ingredients: [
          { id: 'ingredient1', name: 'Ingredient 1' },
          { id: 'ingredient2', name: 'Ingredient 2' },
        ],
      }

      ;(mockPrismaClient.products.findUnique as jest.Mock).mockResolvedValue(
        productData
      )

      const result = await productsRepository.findOneProductById({
        id: productId,
      })

      expect(mockPrismaClient.products.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
        include: { ingredients: true },
      })
      expect(result).toEqual(productData)
    })

    it('should return null if the product is not found', async () => {
      const productId = 'nonexistent-product'

      // Mock the findUnique method to return null
      ;(mockPrismaClient.products.findUnique as jest.Mock).mockResolvedValue(
        null
      )

      const result = await productsRepository.findOneProductById({
        id: productId,
      })

      expect(mockPrismaClient.products.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
        include: { ingredients: true },
      })
      expect(result).toBeNull()
    })

    it('should use the provided transaction client if available', async () => {
      const productId = 'product2'
      const productData = {
        id: productId,
        name: 'Another Product',
        ingredients: [{ id: 'ingredient3', name: 'Ingredient 3' }],
      }

      const txMock = {
        products: {
          findUnique: jest.fn().mockResolvedValue(productData),
        },
      } as unknown as jest.Mocked<Prisma.TransactionClient>

      const result = await productsRepository.findOneProductById(
        { id: productId },
        txMock
      )

      expect(txMock.products.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
        include: { ingredients: true },
      })
      expect(result).toEqual(productData)
    })

    it('should throw an error if findUnique fails', async () => {
      const productId = 'product-error'

      ;(mockPrismaClient.products.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        productsRepository.findOneProductById({ id: productId })
      ).rejects.toThrow('Database error')

      expect(mockPrismaClient.products.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
        include: { ingredients: true },
      })
    })
  })
})
