import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, OrderItem } from './order.model';
import { CreateOrderDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersRepository } from './orders.repository';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrdersRepository)
        private ordersRepository: OrdersRepository,
    ){}
    async getAllOrders(): Promise<Order[]>{
        return await this.ordersRepository.find();
    }
    async createOrder(createOrderDto: CreateOrderDto): Promise<Order>{
       const { 
        restaurantId,
        customerId,
        orderItems,
        totalCost,
        finalCost,
        discount,
       } = createOrderDto;
         const order: Order = {
            restaurantId,
            customerId,
            orderItems,
            totalCost,
            finalCost,
            discount,
            orderDTime: new Date(),
            orderStatusUpdateDTime: new Date(),
            status: OrderStatus.OPEN
         }
         return await this.ordersRepository.save(order);
    }
    async getOrderById(id: string): Promise<Order>{
        const found = await this.ordersRepository.findOneBy({ orderId:id });
        if(!found)
        throw new NotFoundException(`Task with ${id} not found!`);
        return found;
    }
    async deleteOrderById(id: string): Promise<{ affected?: number }> {
        return await this.ordersRepository.delete({orderId: id});
    }
    async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
        let order = await this.getOrderById(orderId);
        order.status = status;
        order.orderStatusUpdateDTime = new Date();
        return await this.ordersRepository.save(order);
    }
    async calculateTotal(order: Order): Promise<Order> {
        const { totalCost, discount } = order;
        const gst = totalCost * 0.05;
        order.totalCost = totalCost - discount + gst;
        return await this.ordersRepository.save(order);
    }
    async updateOrderItem(oid: string, itemId: string, newQty: number): Promise<Order> {
        let order = await this.getOrderById(oid);
        const items = order.orderItems;
        const item: OrderItem = items.find(item => item.itemId === itemId) 
        const {qty: prevQty, price } = item;
        const diffQty = newQty - prevQty;
        order.totalCost += (diffQty * price); 
        order.finalCost += (diffQty * price);
        return await this.calculateTotal(order);
    }
}
