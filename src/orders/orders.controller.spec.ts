import { OrdersController } from './orders.controller'; // Assuming orders.controller is the file path
import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus, CommandBus } from '@nestjs/cqrs'; // Assuming imports for QueryBus and CommandBus
import { CreateOrderDto } from './dto/create-task.dto';
import { Order } from './order.entity';
import { CreateOrderCommand, DeleteOrderByIdCommand, UpdateOrderStatusCommand } from './orders.commands';
import { OrderStatus } from './order.model';
import { FetchOrderByIdQuery, FetchOrdersQuery } from './orders.queries';

// Mock query and command execution (replace with your actual implementations)
const mockQueryBus = {
  execute: jest.fn((query) => Promise.resolve(query)),
};
const mockCommandBus = {
  execute: jest.fn((command) => Promise.resolve(command)),
};

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: QueryBus, useValue: mockQueryBus },
        { provide: CommandBus, useValue: mockCommandBus },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      const expectedOrders: Order[] = []; // Replace with your expected order data
      mockQueryBus.execute.mockReturnValueOnce(Promise.resolve(expectedOrders));
      const result = await controller.getAllOrders();
      expect(result).toBe(expectedOrders);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(new FetchOrdersQuery());
    });
  });

  describe('getOrderById', () => {
    it('should return order by id', async () => {
      const id = '123';
      const expectedOrder: Order = {
        orderId:'123',
        restaurantId: '321ss',
        customerId: '5ft3',
        //orderDTime: now()
        //orderStatusUpdateDTime: Date;
        orderItems: [{
          itemId: 'ht32',
          item: 'pasta',
          price: 398,
          qty: 2
        }],
        totalCost: 0,
        finalCost: 0,
        discount: 0,
        status: OrderStatus.IN_PROGRESS
        }; // Replace with your expected order data
      mockQueryBus.execute.mockReturnValueOnce(Promise.resolve(expectedOrder));
      const result = await controller.getOrderById(id);
      expect(result).toBe(expectedOrder);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(new FetchOrderByIdQuery(id));
    });
  });

  describe('deleteOrderById', () => {
    it('should delete order by id', async () => {
      const id = '123';
      const expectedResponse = { affected: 1 }; // Replace with your expected response
      mockCommandBus.execute.mockReturnValueOnce(Promise.resolve(expectedResponse));
      const result = await controller.deleteOrderById(id);
      expect(result).toBe(expectedResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(new DeleteOrderByIdCommand(id));
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      const id = '123';
      const status = OrderStatus.DONE; // Assuming OrderStatus enum
      const expectedOrder: Order = {
        orderId:'123',
        restaurantId: '321ss',
        customerId: '5ft3',
        //orderDTime: now()
        //orderStatusUpdateDTime: Date;
        orderItems: [{
          itemId: 'ht32',
          item: 'pasta',
          price: 398,
          qty: 2
        }],
        totalCost: 0,
        finalCost: 0,
        discount: 0,
        status: OrderStatus.DONE
        }; // Replace with your expected updated order data
      mockCommandBus.execute.mockReturnValueOnce(Promise.resolve(expectedOrder));
      const result = await controller.updateOrderStatus(id, status);
      expect(result).toBe(expectedOrder);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(new UpdateOrderStatusCommand(id, status));
    });
  });

  describe('createOrder', () => {
    it('should create order', async () => {
      const createOrderDto: CreateOrderDto = {
        restaurantId: '321ss',
        customerId: '5ft3',
        orderItems: [{
      itemId: 'ht32',
          item: 'pasta',
          price: 398,
          qty: 2
    }],
        totalCost: 796,
        finalCost: 0,
        discount: 0,
        status: OrderStatus.IN_PROGRESS
    }; // Replace with your create order data
      const expectedOrder: Order = {
        orderId:'123',
        restaurantId: '321ss',
        customerId: '5ft3',
        orderItems: [{
          itemId: 'ht32',
          item: 'pasta',
          price: 398,
          qty: 2
        }],
        totalCost: 796,
        finalCost: 0,
        discount: 0,
        status: OrderStatus.DONE
        }; // Replace with your expected created order data
      mockCommandBus.execute.mockReturnValueOnce(Promise.resolve(expectedOrder));
      const result = await controller.createOrder(createOrderDto);
      expect(result).toBe(expectedOrder);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(new CreateOrderCommand(createOrderDto));
    });
  });

  describe('crash', () => {
    it('should throw error when crashing', async () => {
      expect.assertions(1);
      try {
        await controller.crash();
      } catch (error) {
        expect(error.message).toBe('Crash Server!');
      }
    });
  });
});
