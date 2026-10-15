import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType, MethodNotAllowedException } from '@nestjs/common';
import { ProblemDetailsFilter } from './common/filters/problem-details.filter';
import { configureSwagger } from './configure-swagger';
import helmet from 'helmet';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as http from 'node:http';
import 'dotenv/config';

async function bootstrap() {

  const keyPath = process.env.HTTPS_KEY_PATH
  const certPath = process.env.HTTPS_CERT_PATH

  if(!keyPath || !certPath){
    throw new Error('HTTPS_KEY_PATH et HTTPS_CERT_PATH sont obligatoires (Veuillez vérifier le .env et le .env.example)')
  }

  const httpsOptions = {
    key: fs.readFileSync(
      path.join(process.cwd(), keyPath!),
    ),
    cert: fs.readFileSync(
      path.join(process.cwd(), certPath!),
    ),
  }
  
  const app = await NestFactory.create(AppModule, {
    httpsOptions
  });

  app.setGlobalPrefix('api');

  const allowedMethods = ['GET', 'POST', 'PATCH', 'DELETE','OPTIONS'];
  app.use(
    helmet(),
    (req: any, _res: any, next: any) => {
      if (!allowedMethods.includes(req.method)) {
        return next(new MethodNotAllowedException(`Méthode ${req.method} non autorisée.`));
      }
      next();
    }
  );

  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET','POST','DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
  
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

  const redirectPort = Number(process.env.HTTP_REDIRECT_PORT) || 3001
  http
  .createServer((req, res) => {
    res.writeHead(301, { Location: `https://localhost:${process.env.PORT }${req.url ?? '/'}` })
    res.end()
  })
  .listen(redirectPort)
}
bootstrap();
