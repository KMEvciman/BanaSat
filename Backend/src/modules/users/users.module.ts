import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

/**
 * Kullanıcı modülü: veri katmanı (UsersService) + profil uç noktaları.
 * Auth ve diğer modüller UsersService'i kullanır.
 */
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
