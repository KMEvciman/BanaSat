import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { avatarMulterOptions } from './avatar-upload.config';
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
   * Profil fotoğrafı yükler (multipart/form-data, alan adı: "avatar").
   * Yalnızca görsel, en fazla 5MB.
   */
  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('avatar', avatarMulterOptions))
  uploadAvatar(
    @CurrentUser('userId') userId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Yüklenecek bir görsel seçilmedi.');
    }
    return this.usersService.setAvatar(userId, file.filename);
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
