import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

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

export type PublicUser = Prisma.UserGetPayload<{
  select: typeof PUBLIC_USER_SELECT;
}>;

/**
 * Kullanıcı verisi erişim katmanı. Tüm kullanıcı veritabanı
 * işlemleri tek bir yerde toplanır; diğer modüller bu servisi kullanır.
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
}
