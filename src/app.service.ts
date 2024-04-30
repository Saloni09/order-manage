import { Injectable } from '@nestjs/common';
//import { Logger } from 'nestjs-pino'

@Injectable()
export class AppService {
 // constructor(private readonly logger:Logger){}
  getHello(): string {
    //this.logger.log('App service running..');
    return 'Hello World!';
  }
}
