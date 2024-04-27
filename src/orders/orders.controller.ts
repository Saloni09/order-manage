import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
//import { OrdersService } from './orders.service';
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

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  //@MessagePattern({cmd: 'get_orders'})
  @Get()
  getAllOrders(): Promise<Order[]> {
    return this.queryBus.execute(new FetchOrdersQuery());
  }
  //@MessagePattern({cmd: 'get_order'})
  @Get('/:id')
  getOrderById(@Param('id') id: string): Promise<Order> {
    return this.queryBus.execute(new FetchOrderByIdQuery(id));
    //.getOrderById(id);
  }
  // @MessagePattern({cmd: 'delete_order'})
  @Delete('/:id')
  deleteOrderById(@Param('id') id: string): Promise<{ affected?: number }> {
    return this.commandBus.execute(new DeleteOrderByIdCommand(id));
    //return this.ordersService.deleteOrderById(id);
  }
  //@MessagePattern({cmd: 'update_order'})
  @Patch('/:id/status')
  updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ): Promise<Order> {
    return this.commandBus.execute(new UpdateOrderStatusCommand(id, status));
    //return this.ordersService.updateOrderStatus(id, status)
  }
  @Post()
  updateOrder(@Body() updateObject: UpdateOrderDto): Promise<Order> {
    return this.commandBus.execute(new UpdateOrderItemCommand(updateObject));
  }
  // @MessagePattern({cmd: 'create_order'})
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.commandBus.execute(new CreateOrderCommand(createOrderDto));
    //return this.ordersService.createOrder(createOrderDto);
  }
  @Get('/crash')
  crash() {
    throw new Error('Crash Server!');
  }
}
