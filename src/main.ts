import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.disable('x-powered-by');
  app.use(morgan('dev'));
  app.enableCors();

  const configService = app.get(ConfigService);
  const $PORT = configService.get('PORT') || 3000; // Asegúrate de que haya un valor por defecto

  await app.listen($PORT);
  console.log(`Listening in ${await app.getUrl()}`);
}

bootstrap();
