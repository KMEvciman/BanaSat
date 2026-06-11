import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { listingMulterOptions } from './listing-upload.config';

/** Görsel yükleme uç noktaları (ilan kapak/galeri görselleri). */
@Controller('uploads')
export class UploadsController {
  constructor(private readonly config: ConfigService) {}

  /** Tek bir görsel yükler ve erişilebilir URL'sini döndürür. */
  @Post('image')
  @UseInterceptors(FileInterceptor('image', listingMulterOptions))
  uploadImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Yüklenecek bir görsel seçilmedi.');
    }
    const appUrl = this.config.get<string>('appUrl');
    return { url: `${appUrl}/uploads/listings/${file.filename}` };
  }
}
