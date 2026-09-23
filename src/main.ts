import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ProblemDetailsFilter } from './common/filters/problem-details.filter';
import { configureSwagger } from './configure-swagger';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  app.useGlobalFilters(new ProblemDetailsFilter());

  configureSwagger(app);
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
