import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Bir uç noktayı kimlik doğrulamadan muaf tutar.
 * Global JWT guard bu işaretli uç noktaları atlar.
 *
 * Kullanım:
 *   @Public()
 *   @Post('login')
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
