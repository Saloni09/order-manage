import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem, OrderStatus } from "./order.model";

@Entity()
export class Order{
    @PrimaryGeneratedColumn('uuid')
    orderId?: string;
    @Column()
    restaurantId: string;
    @Column()
    customerId: string;
    @Column()
    orderDTime: Date;
    @Column()
    orderStatusUpdateDTime: Date;
    @Column()
    orderItems: Array<OrderItem> | [];
    @Column()
    totalCost: number;
    @Column()
    finalCost: number;
    @Column()
    discount?: number;
    @Column()
    status: OrderStatus;
}