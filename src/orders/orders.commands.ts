import { ICommand } from '@nestjs/cqrs';
import { OrderStatus } from './order.model';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-task.dto';

export class DeleteOrderByIdCommand /*implements ICommand*/ {
  constructor(public readonly id: string) {}
}

export class UpdateOrderStatusCommand /*implements ICommand*/ {
  constructor(public readonly orderId: string, public readonly status: OrderStatus) {}
}

export class CreateOrderCommand /*implements ICommand*/ {
    constructor(public readonly createOrderDto: CreateOrderDto) {}
}

export class UpdateOrderItemCommand /*implements ICommand*/ {
    constructor(public readonly updateObject : UpdateOrderDto){}
}