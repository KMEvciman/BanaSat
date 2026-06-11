import { randomUUID } from 'crypto';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

/** İlan görsellerinin kaydedileceği klasör (proje köküne göre). */
export const LISTING_UPLOAD_DIR = './uploads/listings';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/** İlan görseli yüklemesi için multer yapılandırması. */
export const listingMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: LISTING_UPLOAD_DIR,
    filename: (_req, file, cb) => {
      const uniqueName = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      cb(new BadRequestException('Yalnızca JPEG, PNG, GIF veya WEBP görseller yüklenebilir.'), false);
      return;
    }
    cb(null, true);
  },
  limits: { fileSize: MAX_FILE_SIZE },
};
