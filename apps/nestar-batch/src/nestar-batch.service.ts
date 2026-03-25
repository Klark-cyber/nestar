import { Injectable } from '@nestjs/common';

@Injectable()
export class NestarBatchService {
  getHello(): string {
    console.log("okkk")
    return 'Welcome to nestar batch server!';
  }
}
