import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, OrderItem } from './order.model';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersRepository } from './orders.repository';
import { Order } from './order.entity';
import { CommandHandler, ICommandHandler, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FetchOrderByIdQuery, FetchOrdersQuery } from './orders.queries';
import { CreateOrderCommand, DeleteOrderByIdCommand, UpdateOrderItemCommand, UpdateOrderStatusCommand } from './orders.commands';

//@Injectable()
@QueryHandler(FetchOrdersQuery)
export class FetchOrdersHandler implements IQueryHandler<FetchOrdersQuery>{
    constructor(
        @InjectRepository(OrdersRepository)
        private ordersRepository: OrdersRepository,
    ){}
    async execute(): Promise<Order[]>{
        return await this.ordersRepository.find();
    }
}
@QueryHandler(FetchOrderByIdQuery)
export class FetchOrderByIdQueryHandler implements IQueryHandler<FetchOrderByIdQuery> {
    constructor(
        @InjectRepository(OrdersRepository)
        private ordersRepository: OrdersRepository,
    ){}
    async execute(command: FetchOrderByIdQuery): Promise<Order>{
        const found = await this.ordersRepository.findOneBy({ orderId:command.orderId });
        if(!found)
        throw new NotFoundException(`Task with ${command.orderId} not found!`);
        return found;
    }
}
//@Injectable()
@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommand>{
    constructor(
        @InjectRepository(OrdersRepository)
        private ordersRepository: OrdersRepository,
    ){}
    private calculateTotal(total, discount): number {
        // const { totalCost, discount } = order;
         const discountedPrice = total - discount;
         const gst = discountedPrice * 0.05;
         return discountedPrice  + gst;
        // return await this.ordersRepository.save(order);
     }
    async execute(command: CreateOrderCommand): Promise<Order>{
       const { createOrderDto } = command;
       const { 
        restaurantId,
        customerId,
        orderItems,
        totalCost,
        finalCost,
        discount,
       } = createOrderDto;
       const total = this.calculateTotal(totalCost, discount);
       const order: Order = {
            restaurantId,
            customerId,
            orderItems,
            totalCost,
            finalCost: total,
            discount,
            orderDTime: new Date(),
            orderStatusUpdateDTime: new Date(),
            status: OrderStatus.OPEN
         }
         return await this.ordersRepository.save(order);
    }
}

@CommandHandler(DeleteOrderByIdCommand)
export class DeleteOrderByIdCommandHandler implements ICommandHandler<DeleteOrderByIdCommand>{
    constructor(
        @InjectRepository(OrdersRepository)
        private ordersRepository: OrdersRepository,
    ){}
    async execute(command: DeleteOrderByIdCommand): Promise<{ affected?: number }> {
        return await this.ordersRepository.delete({orderId: command.id});
    }
}
@CommandHandler(UpdateOrderStatusCommand)
export class UpdateOrderStatusCommandHandler implements ICommandHandler<UpdateOrderStatusCommand>{
    constructor(
        @InjectRepository(OrdersRepository)
        private ordersRepository: OrdersRepository,
    ){}
    async execute(command: UpdateOrderStatusCommand): Promise<Order> {
        const order = await this.ordersRepository.findOneBy({ orderId: command.orderId });
        if(!order)
        throw new NotFoundException(`Task with ${command.orderId} not found!`);
    //let order = await FetchOrderByIdQueryHandler//await this.getOrderById(orderId);
        order.status = command.status;
        order.orderStatusUpdateDTime = new Date();
        return await this.ordersRepository.save(order);
    }
}
@CommandHandler(UpdateOrderItemCommand)
export class UpdateOrderItemCommandHandler implements ICommandHandler<UpdateOrderItemCommand>{
    constructor(
        @InjectRepository(OrdersRepository)
        private ordersRepository: OrdersRepository,
    ){}
     async execute(command : UpdateOrderItemCommand): Promise<Order> {
         const { updateObject } = command; 
         const {orderId, itemId, newQty} = updateObject;
         //let order = await this.getOrderById(orderId);
         const order = await this.ordersRepository.findOneBy({ orderId: orderId });
         if(!order)
         throw new NotFoundException(`Task with ${orderId} not found!`);
         const items = order.orderItems;
         const item: OrderItem = items.find(item => item.itemId === itemId) 
         const {qty: prevQty, price } = item;
         const diffQty = newQty - prevQty;
         order.totalCost += (diffQty * price); 
         order.finalCost += (diffQty * price);
         return await this.ordersRepository.save(order);
     }
}
