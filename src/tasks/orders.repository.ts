import { Repository } from "typeorm";
import { Order } from "./order.entity";


export class OrdersRepository extends Repository<Order>{}