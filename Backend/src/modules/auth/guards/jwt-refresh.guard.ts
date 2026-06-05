import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Yalnızca /auth/refresh uç noktasında kullanılır.
 * Refresh token'ı doğrular.
 */
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
