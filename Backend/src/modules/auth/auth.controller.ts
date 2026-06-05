import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '@common/decorators/public.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { RefreshToken } from './decorators/refresh-token.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Yeni kullanıcı kaydı. */
  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /** E-posta + parola ile giriş. */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Access token süresi dolduğunda yeni token çifti alır.
   * Authorization başlığında refresh token gönderilmelidir.
   */
  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(
    @CurrentUser('userId') userId: string,
    @RefreshToken() refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  /** Çıkış yapar; sunucudaki refresh token'ı geçersiz kılar. */
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@CurrentUser('userId') userId: string) {
    await this.authService.logout(userId);
    return { message: 'Çıkış yapıldı.' };
  }

  /** Giriş yapmış kullanıcının profil bilgileri. */
  @Get('me')
  me(@CurrentUser('userId') userId: string) {
    return this.authService.getProfile(userId);
  }
}
