import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.disable('x-powered-by');
  app.use(morgan('dev'));
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('ShortUrl API')
    .setDescription(
      'API for generating, managing, and retrieving short URLs. This service allows users to easily convert long, complex URLs into shortened links, track usage statistics, and manage existing links. Ideal for applications that require efficient and user-friendly URL shortening solutions.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);
  const $PORT = configService.get('PORT') || 3000;

  await app.listen($PORT);
  console.log(`Listening in ${await app.getUrl()}`);
}

bootstrap();
