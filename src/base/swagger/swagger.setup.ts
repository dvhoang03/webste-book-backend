import { INestApplication, Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from '@/config';

export function initSwagger(app: INestApplication) {
  const configSwagger = new DocumentBuilder()
    .setTitle('Document api for website book ecommerce')
    .setDescription('api doc cua website ban va thue sach')
    .setContact(
      'hoang',
      'http://facebook.com',
      'duongviethoang240803@gmail.com',
    )
    .addServer(config.DOMAIN)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('apidoc', app, document, {
    customSiteTitle: 'PRODUCT' + ' API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
    },
  });
}
