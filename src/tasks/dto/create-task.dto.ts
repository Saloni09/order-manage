import { OrderItem, OrderStatus } from "../order.model";

export class CreateOrderDto {
    restaurantId: string;
    customerId: string;
    orderItems: Array<OrderItem> | [];
    totalCost: number;
    finalCost: number;
    discount: number;
    status: OrderStatus;
}