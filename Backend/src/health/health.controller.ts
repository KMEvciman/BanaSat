import { Controller, Get } from '@nestjs/common';
import { Public } from '@common/decorators/public.decorator';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * Uygulamanın ve veritabanı bağlantısının sağlık durumunu döndürür.
 * Monitoring / load balancer'lar için kullanılır.
 */
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  async check() {
    let database = 'down';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      database = 'up';
    } catch {
      database = 'down';
    }

    return {
      status: database === 'up' ? 'ok' : 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: { database },
    };
  }
}
