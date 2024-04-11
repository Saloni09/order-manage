import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from './order.model';
import { CreateOrderDto } from './dto/create-task.dto';
import { Order } from './order.entity';
import { MessagePattern } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService){}
    @MessagePattern({cmd: 'get_orders'})
    //@Get()
    getAllOrders(): Promise<Order[]> {
        return this.ordersService.getAllOrders();
    }
    @MessagePattern({cmd: 'get_order'})
    //@Get('/:id')
    getOrderById(@Param('id') id: string): Promise<Order> {
        return this.ordersService.getOrderById(id);
    }
    @MessagePattern({cmd: 'delete_order'})
    //@Delete('/:id')
    deleteOrderById(@Param('id') id: string): Promise<{ affected?: number }> {
        return this.ordersService.deleteOrderById(id);
    }
    @MessagePattern({cmd: 'update_order'})
    //@Patch('/:id/status')
    updateOrderStatus(
        @Param('id') id: string,
        @Body('status') status: OrderStatus
        ): Promise<Order>{
        return this.ordersService.updateOrderStatus(id, status)
    }
    @MessagePattern({cmd: 'create_order'})
   // @Post()
    createOrder(
        @Body() createOrderDto: CreateOrderDto
    ): Promise<Order> {
        return this.ordersService.createOrder(createOrderDto);
    }
}
