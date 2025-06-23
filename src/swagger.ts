import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { AdminAppointmentModule } from './core/admin/appointment/AdminAppointment.Module';
import { AdminTherapistModule } from './core/admin/therapist/AdminTherapist.Module';
import { AuthModule } from './core/auth/Auth.Module';
import { UserModule } from './core/user/User.Module';
import { TherapistModule } from './core/therapist/Therapist.Module';

function createSwaggerDocument(app: INestApplication, config, modules) {
  return SwaggerModule.createDocument(app, config, {
    include: modules,
  });
}

export function setupSwagger(app: INestApplication) {
  const adminConfig = new DocumentBuilder()
    .setTitle('Sahara Mind API - Admin')
    .setDescription('API documentation for Sahara Mind Admin')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const therapistConfig = new DocumentBuilder()
    .setTitle('Sahara Mind API - Therapist')
    .setDescription('API documentation for Sahara Mind Therapist')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const publicConfig = new DocumentBuilder()
    .setTitle('Sahara Mind API - Public')
    .setDescription('Public API documentation for Sahara Mind')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const allConfig = new DocumentBuilder()
    .setTitle('Sahara Mind API - All')
    .setDescription('Complete API documentation for Sahara Mind')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const adminDocument = createSwaggerDocument(app, adminConfig, [
    AdminAppointmentModule,
    AdminTherapistModule,
  ]);

  const therapistDocument = createSwaggerDocument(app, therapistConfig, [
    TherapistModule,
  ]);

  const publicDocument = createSwaggerDocument(app, publicConfig, [
    AuthModule,
    UserModule,
  ]);
  const allDocument = SwaggerModule.createDocument(app, allConfig);

  SwaggerModule.setup('api', app, publicDocument);
  SwaggerModule.setup('api/admin', app, adminDocument);
  SwaggerModule.setup('api/therapist', app, therapistDocument);
  SwaggerModule.setup('api/all', app, allDocument);
}
