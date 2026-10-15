    import { INestApplication } from '@nestjs/common';
    import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

    export function configureSwagger(app: INestApplication): void {
      const config = new DocumentBuilder()
        .setTitle('CampusRate API')
        .setDescription(
          `API REST permettant aux étudiants et/ou au personnel d'un campus de noter des lieux
          Il y a maintenant la validation de données gérés par le serveur.
          
          Règles : 
          - Les champs id, createdAt, updatedAt, averageRating et reviewCount sont gérés par le serveur : les envoyer provoque une erreur 400.
          - Un avis ne peut être créé que pour un lieu existant (erreur 404 sinon).
          - Un lieu qui possède des avis ne peut pas être supprimé.
          
          Les erreurs sont tous sous format application/problem+json (RFC 7807)
          `
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