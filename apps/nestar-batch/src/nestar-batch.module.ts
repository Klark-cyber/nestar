import { Module } from '@nestjs/common';
import { NestarBatchController } from './nestar-batch.controller';
import { NestarBatchService } from './nestar-batch.service';
import { ConfigModule } from "@nestjs/config"; //.env ichidagilarni import qilish imkonini beruvchi package

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [NestarBatchController],
  providers: [NestarBatchService],
})
export class NestarBatchModule {}


