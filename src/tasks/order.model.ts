// export interface Task {
//     id: string;
//     title: string;
//     description: string;
//     status: TaskStatus;
// }
export class OrderItem {
    itemId: string;
    item: string;
    price: number;
    qty: number;
}

export enum OrderStatus{
    OPEN ="PLACED",
    IN_PROGRESS="IN_TRANSIT",
    DONE="DELIVERED",
    CANCEL="CANCELLED"
}