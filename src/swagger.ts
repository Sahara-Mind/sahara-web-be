import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ADMIN_MODULES } from './core/admin/Admin.Module';
import { THERAPIST_MODULES } from './core/therapist/Therapist.Module';
import { PUBLIC_MODULES } from './core/.Core.Module';

function createSwaggerDocument(app: INestApplication, config, modules) {
  return SwaggerModule.createDocument(app, config, {
    include: modules,
  });
}

const API_NAME = 'Sahara Mind API';

export function setupSwagger(app: INestApplication) {
  const adminConfig = new DocumentBuilder()
    .setTitle(`${API_NAME} - Admin`)
    .setDescription('API documentation for Sahara Mind Admin')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const therapistConfig = new DocumentBuilder()
    .setTitle(`${API_NAME} - Therapist`)
    .setDescription('API documentation for Sahara Mind Therapist')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const publicConfig = new DocumentBuilder()
    .setTitle(`${API_NAME} - Public`)
    .setDescription('Public API documentation for Sahara Mind')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const allConfig = new DocumentBuilder()
    .setTitle(`${API_NAME} - All`)
    .setDescription('Complete API documentation for Sahara Mind')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const adminDocument = createSwaggerDocument(app, adminConfig, ADMIN_MODULES);

  const therapistDocument = createSwaggerDocument(
    app,
    therapistConfig,
    THERAPIST_MODULES,
  );

  const publicDocument = createSwaggerDocument(
    app,
    publicConfig,
    PUBLIC_MODULES,
  );
  const allDocument = SwaggerModule.createDocument(app, allConfig);

  SwaggerModule.setup('api', app, publicDocument);
  SwaggerModule.setup('api/admin', app, adminDocument);
  SwaggerModule.setup('api/therapist', app, therapistDocument);
  SwaggerModule.setup('api/all', app, allDocument);
}
