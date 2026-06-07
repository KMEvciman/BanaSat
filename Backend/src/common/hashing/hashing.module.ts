import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing.service';

/**
 * Global modül: HashingService her yerde import edilmeden kullanılabilir.
 */
@Global()
@Module({
  providers: [HashingService],
  exports: [HashingService],
})
export class HashingModule {}
