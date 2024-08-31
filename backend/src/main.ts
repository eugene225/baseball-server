import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './global/filter/httpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.SERVER_PORT;

  // filter
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
}
bootstrap();
