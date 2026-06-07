import { randomUUID } from 'crypto';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

/** Avatar dosyalarının kaydedileceği klasör (proje köküne göre). */
export const AVATAR_UPLOAD_DIR = './uploads/avatars';

/** İzin verilen görsel MIME tipleri. */
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/** Maksimum dosya boyutu: 5 MB. */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Avatar yüklemesi için multer yapılandırması.
 * - Diske benzersiz adla kaydeder (uuid + uzantı)
 * - Yalnızca görsel tiplerine ve 5MB sınırına izin verir
 */
export const avatarMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: AVATAR_UPLOAD_DIR,
    filename: (_req, file, cb) => {
      const uniqueName = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      cb(
        new BadRequestException('Yalnızca JPEG, PNG, GIF veya WEBP görseller yüklenebilir.'),
        false,
      );
      return;
    }
    cb(null, true);
  },
  limits: { fileSize: MAX_FILE_SIZE },
};
