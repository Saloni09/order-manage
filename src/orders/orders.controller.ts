import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateOrderCommand,
  DeleteOrderByIdCommand,
  UpdateOrderItemCommand,
  UpdateOrderStatusCommand,
} from './orders.commands';
import { OrderStatus } from './order.model';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-task.dto';
import { Order } from './order.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FetchOrderByIdQuery, FetchOrdersQuery } from './orders.queries';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'List of orders' })
  getAllOrders(): Promise<Order[]> {
    return this.queryBus.execute(new FetchOrdersQuery());
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order details' })
  getOrderById(@Param('id') id: string): Promise<Order> {
    return this.queryBus.execute(new FetchOrderByIdQuery(id));
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  deleteOrderById(@Param('id') id: string): Promise<{ affected?: number }> {
    return this.commandBus.execute(new DeleteOrderByIdCommand(id));
  }

  @Patch('/:id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ): Promise<Order> {
    return this.commandBus.execute(new UpdateOrderStatusCommand(id, status));
  }

  @Post()
  @ApiOperation({ summary: 'Update order item' })
  @ApiResponse({ status: 200, description: 'Order item updated successfully' })
  updateOrder(@Body() updateObject: UpdateOrderDto): Promise<Order> {
    return this.commandBus.execute(new UpdateOrderItemCommand(updateObject));
  }

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.commandBus.execute(new CreateOrderCommand(createOrderDto));
  }

  @Get('/crash')
  @ApiOperation({ summary: 'Crash server (for testing purposes only)' })
  @ApiResponse({ status: 500, description: 'Server crashed' })
  crash() {
    throw new Error('Crash Server!');
  }
}