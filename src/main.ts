import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       host: 'localhost',
  //       port: 4000,
  //     },
  //   },
  // );

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(),
    { cors: true  }
  );
  // app.useLogger(app.get(Logger));
  // const logger = pino({
  //   customLevels: {
  //     default: 30,
  //   },
  // });
  app.use(helmet());
  app.use(rateLimit({
    windowMs: 5 * 60 *1000,
    max: 100,
  }))
  const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            // exceptionFactory: errors => new BadRequestException(errors),
            dismissDefaultMessages: true,
            validationError: {
                target: false,
            },
        }),
    );
  const config = new DocumentBuilder()
    .setTitle('Orders for Foodzap')
    .setDescription('APIS for Order Management of Foodzap')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(6001);
}
bootstrap();
