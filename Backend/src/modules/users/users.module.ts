import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

/**
 * Kullanıcı veri katmanı. Auth ve diğer modüller UsersService'i kullanır.
 * (Profil görüntüleme/güncelleme uç noktaları sonraki adımda eklenecek.)
 */
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
