import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Global modül: PrismaService her yerde import edilmeden kullanılabilir.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
