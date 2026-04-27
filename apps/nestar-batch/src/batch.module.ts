import { Module } from '@nestjs/common';
import { BatchController as BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { ConfigModule } from "@nestjs/config"; //.env ichidagilarni import qilish imkonini beruvchi package
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, ScheduleModule.forRoot()],
  controllers: [BatchController],
  providers: [BatchService],
})
export class BatchModule {}


