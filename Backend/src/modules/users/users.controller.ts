import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Public } from '@common/decorators/public.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** Giriş yapan kullanıcının kendi profilini günceller. */
  @Patch('me')
  updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  /** Parola değiştir. */
  @HttpCode(HttpStatus.OK)
  @Patch('me/password')
  async changePassword(
    @CurrentUser('userId') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(userId, dto);
    return { message: 'Parola güncellendi. Lütfen tekrar giriş yapın.' };
  }

  /**
   * Başka bir kullanıcının herkese açık profili.
   * (Satıcı/alıcı "Profili Gör" için.) E-posta/telefon gizlidir.
   */
  @Public()
  @Get(':id')
  getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }
}
