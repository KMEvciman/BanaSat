import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger('Bootstrap');
  const config = app.get(ConfigService);

  // Güvenlik HTTP başlıkları
  app.use(helmet());

  // CORS - sadece frontend adresine izin ver
  app.enableCors({
    origin: config.get<string>('corsOrigin'),
    credentials: true,
  });

  // Tüm uç noktalar /api altında
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
