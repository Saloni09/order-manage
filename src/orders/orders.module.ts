import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
//import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersRepository } from './orders.repository';
import {
  CreateOrderCommandHandler,
  DeleteOrderByIdCommandHandler,
  FetchOrderByIdQueryHandler,
  FetchOrdersHandler,
  UpdateOrderItemCommandHandler,
  UpdateOrderStatusCommandHandler,
} from './orders.handlers';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersRepository]), CqrsModule],
  controllers: [OrdersController],
  providers: [
    FetchOrdersHandler,
    FetchOrderByIdQueryHandler,
    CreateOrderCommandHandler,
    DeleteOrderByIdCommandHandler,
    UpdateOrderStatusCommandHandler,
    UpdateOrderItemCommandHandler,
    /*,OrdersService*/
  ],
})
export class OrdersModule {}
