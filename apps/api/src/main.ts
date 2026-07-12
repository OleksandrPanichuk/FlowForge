import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestLoggerService } from './infrastructure/logger';

async function bootstrap() {
  const logger = new NestLoggerService();
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
