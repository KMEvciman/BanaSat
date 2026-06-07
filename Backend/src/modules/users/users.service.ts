import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { HashingService } from '@common/hashing/hashing.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AVATAR_UPLOAD_DIR } from './avatar-upload.config';

/**
 * İstemciye gönderilebilecek güvenli kullanıcı alanları.
 * passwordHash ve refreshTokenHash gibi hassas alanları ASLA içermez.
 */
export const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  phone: true,
  avatarUrl: true,
  bio: true,
  location: true,
  role: true,
  isVerified: true,
  ratingAvg: true,
  ratingCount: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

/**
 * Başka kullanıcıların görebileceği herkese açık profil alanları.
 * Gizlilik gereği e-posta ve telefon İÇERMEZ.
 */
export const PUBLIC_PROFILE_SELECT = {
  id: true,
  name: true,
  avatarUrl: true,
  bio: true,
  location: true,
  isVerified: true,
  ratingAvg: true,
  ratingCount: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{
  select: typeof PUBLIC_USER_SELECT;
}>;

/**
 * Kullanıcı verisi erişim katmanı. Tüm kullanıcı veritabanı
 * işlemleri tek bir yerde toplanır; diğer modüller bu servisi kullanır.
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
    private readonly config: ConfigService,
  ) {}

  /** Yeni kullanıcı oluşturur (parola zaten hash'lenmiş gelmeli). */
  create(data: {
    email: string;
    passwordHash: string;
    name: string;
    phone?: string;
  }): Promise<PublicUser> {
    return this.prisma.user.create({
      data,
      select: PUBLIC_USER_SELECT,
    });
  }

  /** Parola/refresh hash dahil tam kaydı getirir (yalnızca dahili kullanım). */
  findByEmailWithSecrets(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByIdWithSecrets(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /** Güvenli (public) kullanıcı kaydını getirir. */
  findById(id: string): Promise<PublicUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: PUBLIC_USER_SELECT,
    });
  }

  /** Bir e-postanın zaten kayıtlı olup olmadığını kontrol eder. */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } });
    return count > 0;
  }

  /** Refresh token'ın hash'ini saklar (oturum açıkken) veya temizler (çıkışta). */
  setRefreshTokenHash(userId: string, refreshTokenHash: string | null): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }

  /** Başka bir kullanıcının herkese açık profili (e-posta/telefon gizli). */
  async getPublicProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: PUBLIC_PROFILE_SELECT,
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı.');
    }
    return user;
  }

  /** Giriş yapan kullanıcının profilini günceller. */
  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<PublicUser> {
    // E-posta değiştiriliyorsa, başka bir kullanıcı tarafından
    // kullanılmadığından emin ol.
    if (dto.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
        select: { id: true },
      });
      if (existing && existing.id !== userId) {
        throw new ConflictException('Bu e-posta adresi başka bir hesapta kayıtlı.');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        bio: dto.bio,
        location: dto.location,
        avatarUrl: dto.avatarUrl,
      },
      select: PUBLIC_USER_SELECT,
    });
  }

  /** Parola değiştirir; mevcut parola doğrulanır ve oturumlar sıfırlanır. */
  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.findByIdWithSecrets(userId);
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı.');
    }

    const matches = await this.hashing.compare(dto.currentPassword, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Mevcut parola hatalı.');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('Yeni parola eskisiyle aynı olamaz.');
    }

    const newHash = await this.hashing.hash(dto.newPassword);
    // Parola değişince güvenlik için refresh token'ı da geçersiz kıl.
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash, refreshTokenHash: null },
    });
  }

  /**
   * Yüklenen avatar dosyasını kullanıcıya atar; varsa eski dosyayı diskten siler.
   * @param filename Multer tarafından kaydedilen dosya adı.
   */
  async setAvatar(userId: string, filename: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı.');
    }

    const appUrl = this.config.get<string>('appUrl');
    const newUrl = `${appUrl}/uploads/avatars/${filename}`;

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: newUrl },
      select: PUBLIC_USER_SELECT,
    });

    // Eski avatar bizim yüklediğimiz bir dosyaysa diskten temizle.
    await this.removeOldAvatarFile(user.avatarUrl);

    return updated;
  }

  /** Eski avatar yerel bir yükleme dosyasıysa diskten siler (hata olsa da akışı bozmaz). */
  private async removeOldAvatarFile(oldUrl: string | null): Promise<void> {
    if (!oldUrl || !oldUrl.includes('/uploads/avatars/')) {
      return;
    }
    const oldFilename = oldUrl.split('/uploads/avatars/').pop();
    if (!oldFilename) {
      return;
    }
    try {
      await unlink(join(AVATAR_UPLOAD_DIR, oldFilename));
    } catch {
      // Dosya yoksa veya silinemezse sessizce geç.
    }
  }
}
