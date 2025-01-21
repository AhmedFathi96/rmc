import { OrdersService } from './ordersService'
import { OrdersRepository } from '../repos'

jest.mock('../repos')

describe('OrdersService', () => {
  let ordersService: OrdersService
  let mockOrdersRepository: jest.Mocked<OrdersRepository>

  beforeEach(() => {
    mockOrdersRepository = {
      createOrder: jest.fn(),
    } as unknown as jest.Mocked<OrdersRepository>

    ordersService = new OrdersService(mockOrdersRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const orderArgs = {
        products: [
          { productId: 'prod1', quantity: 2 },
          { productId: 'prod2', quantity: 1 },
        ],
      }
      const createdOrder = {
        id: 'order1',
        createdAt: new Date(),
        updatedAt: new Date(),
        products: orderArgs.products,
      }
      mockOrdersRepository.createOrder.mockResolvedValue(createdOrder)

      const result = await ordersService.createOrder(orderArgs)

      expect(mockOrdersRepository.createOrder).toHaveBeenCalledWith(
        orderArgs,
        undefined
      )
      expect(result).toEqual(createdOrder)
    })

    it('should rethrow any errors from the repository', async () => {
      const error = new Error('Database error')
      const orderArgs = {
        products: [
          { productId: 'prod1', quantity: 2 },
          { productId: 'prod2', quantity: 1 },
        ],
      }
      mockOrdersRepository.createOrder.mockRejectedValue(error)

      await expect(ordersService.createOrder(orderArgs)).rejects.toThrow(
        'Database error'
      )

      expect(mockOrdersRepository.createOrder).toHaveBeenCalledWith(
        orderArgs,
        undefined
      )
    })
  })
})
