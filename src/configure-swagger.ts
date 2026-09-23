    import { INestApplication } from '@nestjs/common';
    import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

    export function configureSwagger(app: INestApplication): void {
      const config = new DocumentBuilder()
        .setTitle('CampusRate API')
        .setDescription(
          "API REST permettant aux étudiants et/ou au personnel d'un campus de noter des lieux"
        )
        .setVersion('1.0.0')
        .addTag('Endroits', 'Gestion des endroits')
        .addTag('Appréciations', 'Gestion des appréciations')
        .build();

      const documentFactory = () =>
        SwaggerModule.createDocument(app, config);

      SwaggerModule.setup('docs', app, documentFactory, {
        jsonDocumentUrl: 'openapi.json',
        customSiteTitle: 'CampusRate API - Documentation',
      });
    }