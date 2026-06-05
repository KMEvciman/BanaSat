import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma istemcisini NestJS yaşam döngüsüne bağlar.
 * Uygulama açılırken veritabanına bağlanır, kapanırken bağlantıyı keser.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { level: 'warn', emit: 'event' },
        { level: 'error', emit: 'event' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Veritabanı bağlantısı kuruldu.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Veritabanı bağlantısı kapatıldı.');
  }
}
