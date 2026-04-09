import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("STEP-1")
  app.useGlobalPipes(new ValidationPipe()) //=> pipelarni global tarzda ornatamiz.
  console.log("STEP-2")
  app.useGlobalInterceptors(new LoggingInterceptor()) //=> Logging interceptorni hosil qildik natijada terminalda re/res haqida bazi malumotlarga ega bolamiz
  console.log("STEP-8")
  await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
