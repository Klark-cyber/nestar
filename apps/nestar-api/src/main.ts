import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()) //=> pipelarni global tarzda ornatamiz.
  await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
