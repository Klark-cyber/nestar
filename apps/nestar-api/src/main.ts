import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()) //=> pipelarni global tarzda ornatamiz.
  app.useGlobalInterceptors(new LoggingInterceptor()) //=> Logging interceptorni hosil qildik natijada terminalda re/res haqida bazi malumotlarga ega bolamiz
  await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
