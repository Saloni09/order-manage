import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { Order } from './orders/order.entity';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
//import {v4 as uuid} from 'uuid';
//import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // LoggerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => {
    //     return {
    //       pinoHttp: {
    //         level: 30,//config.get('default'), // Or any other config value
    //         genReqId: (request) => request.headers['x-correlation-id'] || uuid(),
    //       },
    //     };
    //   },
    // }),
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true
          }
        }
      }
    }),
    OrdersModule,
    TypeOrmModule.forRoot({
      "type": "mongodb",
      "url": "mongodb+srv://sapient064:VMWare%402020@cluster-sap-restaurant.bsirfia.mongodb.net/foodzap",
      "useNewUrlParser": true,
      "synchronize": true,
      "logging": true,
      "entities": ["dist/*.entity{.ts,.js}"],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
