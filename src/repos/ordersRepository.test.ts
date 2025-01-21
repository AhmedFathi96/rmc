import { Prisma, PrismaClient } from '@prisma/client'
import { OrdersRepository } from './ordersRepository'

// Define mockPrismaClient
let mockPrismaClient: jest.Mocked<PrismaClient>

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  }
})

describe('OrdersRepository', () => {
  let ordersRepository: OrdersRepository

  beforeEach(() => {
    mockPrismaClient = {
      orders: {
        create: jest.fn(),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $on: jest.fn(),
      $executeRaw: jest.fn(),
      $queryRaw: jest.fn(),
      $transaction: jest.fn(),
    } as unknown as jest.Mocked<PrismaClient>

    ordersRepository = new OrdersRepository(mockPrismaClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createOrder', () => {
    it('should create an order with products', async () => {
      const orderArgs = {
        products: [
          { productId: 'product1', quantity: 2 },
          { productId: 'product2', quantity: 3 },
        ],
      }

      const expectedOrder = {
        id: 'order1',
        updatedAt: new Date(),
        products: [
          { productId: 'product1', quantity: 2, updatedAt: new Date() },
          { productId: 'product2', quantity: 3, updatedAt: new Date() },
        ],
      }

      ;(mockPrismaClient.orders.create as jest.Mock).mockImplementation(() =>
        Promise.resolve(expectedOrder)
      )

      const result = await ordersRepository.createOrder(orderArgs)

      expect(mockPrismaClient.orders.create).toHaveBeenCalledWith({
        data: {
          updatedAt: expect.any(Date),
          products: {
            create: [
              {
                productId: 'product1',
                quantity: 2,
                updatedAt: expect.any(Date),
              },
              {
                productId: 'product2',
                quantity: 3,
                updatedAt: expect.any(Date),
              },
            ],
          },
        },
      })

      expect(result).toEqual(expectedOrder)
    })

    it('should use the provided transaction client if available', async () => {
      const orderArgs = {
        products: [{ productId: 'product1', quantity: 1 }],
      }

      const txMock = {
        orders: {
          create: jest.fn().mockImplementation(() =>
            Promise.resolve({
              id: 'order2',
              updatedAt: new Date(),
              products: [
                { productId: 'product1', quantity: 1, updatedAt: new Date() },
              ],
            })
          ),
        },
      } as unknown as jest.Mocked<Prisma.TransactionClient>

      const result = await ordersRepository.createOrder(orderArgs, txMock)

      expect(txMock.orders.create).toHaveBeenCalledWith({
        data: {
          updatedAt: expect.any(Date),
          products: {
            create: [
              {
                productId: 'product1',
                quantity: 1,
                updatedAt: expect.any(Date),
              },
            ],
          },
        },
      })

      expect(result).toEqual({
        id: 'order2',
        updatedAt: expect.any(Date),
        products: [
          { productId: 'product1', quantity: 1, updatedAt: expect.any(Date) },
        ],
      })
    })

    it('should throw an error if creating the order fails', async () => {
      const orderArgs = {
        products: [{ productId: 'product1', quantity: 1 }],
      }

      ;(mockPrismaClient.orders.create as jest.Mock).mockImplementation(() =>
        Promise.reject(new Error('Database error'))
      )

      await expect(ordersRepository.createOrder(orderArgs)).rejects.toThrow(
        'Database error'
      )

      expect(mockPrismaClient.orders.create).toHaveBeenCalledWith({
        data: {
          updatedAt: expect.any(Date),
          products: {
            create: [
              {
                productId: 'product1',
                quantity: 1,
                updatedAt: expect.any(Date),
              },
            ],
          },
        },
      })
    })
  })
})
