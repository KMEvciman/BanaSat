import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { mkdirSync } from 'fs';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const logger = new Logger('Bootstrap');
  const config = app.get(ConfigService);

  // Güvenlik HTTP başlıkları. Statik dosyaların farklı origin'den
  // (frontend) yüklenebilmesi için CORP politikasını gevşetiyoruz.
  app.use(
    helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }),
  );

  // CORS - sadece frontend adresine izin ver
  app.enableCors({
    origin: config.get<string>('corsOrigin'),
    credentials: true,
  });

  // Yüklenen dosyaları (avatarlar) /uploads altından statik sun.
  const uploadsPath = join(process.cwd(), 'uploads');
  mkdirSync(join(uploadsPath, 'avatars'), { recursive: true });
  mkdirSync(join(uploadsPath, 'listings'), { recursive: true });
  app.useStaticAssets(uploadsPath, { prefix: '/uploads' });

  // Tüm API uç noktaları /api altında (statik /uploads hariç)
  app.setGlobalPrefix('api');

  // Gelen verileri global olarak doğrula ve temizle
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO'da olmayan alanları at
      forbidNonWhitelisted: true, // Fazladan alan gelirse hata ver
      transform: true, // Payload'ı DTO tipine dönüştür
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Tutarlı hata ve başarı yanıtları
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Uygulama kapanırken Prisma gibi servisleri düzgün kapat
  app.enableShutdownHooks();

  const port = config.get<number>('port') ?? 4000;
  await app.listen(port);
  logger.log(`BanaSat backend çalışıyor: http://localhost:${port}/api`);
}

bootstrap();
