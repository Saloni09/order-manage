
import { IQuery } from '@nestjs/cqrs';

export class FetchOrdersQuery implements IQuery {}

export class FetchOrderByIdQuery /*implements IQuery*/ {
    constructor(readonly orderId?: string) {}
}
