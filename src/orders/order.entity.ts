import { Column, Entity, ObjectIdColumn } from "typeorm";
import { OrderItem, OrderStatus } from "./order.model";

@Entity()
export class Order{
    @ObjectIdColumn()
    orderId?: string;
    @Column()
    restaurantId: string;
    @Column()
    customerId: string;
    @Column({type:'timestamp', default: ()=> 'CURRENT_TIMESTAMP'})
    orderDTime?: Date;
    @Column({type:'timestamp', default: ()=> 'CURRENT_TIMESTAMP'})
    orderStatusUpdateDTime?: Date;
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