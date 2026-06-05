import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    // Ortam değişkenlerini yükle, doğrula ve global olarak sun.
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    CategoriesModule,
    // Diğer özellik modülleri (users profili, listings, offers, messages)
    // sonraki adımlarda buraya eklenecek.
  ],
})
export class AppModule {}
