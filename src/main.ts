import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getBotToken } from 'nestjs-telegraf';

import { AppModule } from './app.module';
import { AppConfig } from './configs/configs.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  const bot = app.get(getBotToken());
  app.use(bot.webhookCallback('/telegram'));

  app.setGlobalPrefix('/api', {
    exclude: ['docs', 'docs-json', '/'],
  });

  const config = new DocumentBuilder()
    .setTitle('OnBoarding API')
    .setDescription('The OnBoarding API description')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'apiKey', name: 'Hash', in: 'header' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
      persistAuthorization: true,
    },
  });
  await app.listen(appConfig.port, appConfig.host, () => {
    Logger.log(`Server running on http://${appConfig.host}:${appConfig.port}`);
    Logger.log(
      `Swagger running on http://${appConfig.host}:${appConfig.port}/docs`,
    );
  });
}
void bootstrap();
