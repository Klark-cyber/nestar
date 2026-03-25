import { Controller, Get } from '@nestjs/common';
import { NestarBatchService } from './nestar-batch.service';
import { ConfigModule } from "@nestjs/config"; //.env ichidagilarni import qilish imkonini beruvchi package

@Controller()
export class NestarBatchController {
  constructor(private readonly nestarBatchService: NestarBatchService) {}

  @Get()
  getHello(): string {
    return this.nestarBatchService.getHello();
  }
}
