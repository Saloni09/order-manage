import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders/order.entity';

@Module({
  imports: [
    OrdersModule,
    TypeOrmModule.forRoot({
      "type": "mongodb",
      "url": "mongodb+srv://sapient064:VMWare%402020@cluster-sap-restaurant.bsirfia.mongodb.net/foodzap",
      "useNewUrlParser": true,
      "synchronize": true,
      "logging": true,
      "entities": [Order],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
