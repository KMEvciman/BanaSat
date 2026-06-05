import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtRefreshUser } from '../interfaces/jwt-payload.interface';

/**
 * Yalnızca JwtRefreshGuard ile korunan uç noktalarda kullanılır.
 * req.user üzerindeki ham refresh token'ı enjekte eder.
 */
export const RefreshToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return (request.user as JwtRefreshUser)?.refreshToken;
  },
);
