import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { HashingModule } from './common/hashing/hashing.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ListingsModule } from './modules/listings/listings.module';
import { OffersModule } from './modules/offers/offers.module';

@Module({
  imports: [
    // Ortam değişkenlerini yükle, doğrula ve global olarak sun.
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    PrismaModule,
    HashingModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ListingsModule,
    OffersModule,
    // Kalan özellik modülü (messages) sonraki adımda eklenecek.
  ],
})
export class AppModule {}
