import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Doğrulanmış kullanıcının JWT payload'ından gelen bilgilerini
 * controller metotlarına enjekte eder.
 *
 * Kullanım:
 *   @Get('me')
 *   getMe(@CurrentUser() user: AuthUser) { ... }
 *   @Get('me')
 *   getId(@CurrentUser('userId') userId: string) { ... }
 */
export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthUser;
    return data ? user?.[data] : user;
  },
);
