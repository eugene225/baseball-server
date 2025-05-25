import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const port = process.env.SERVER_PORT;

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5001', 'http://52.65.47.31:5000', 'https://haengbokza.site'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(port);
}
bootstrap();
