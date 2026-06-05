/**
 * JWT içinde taşınan veri. `sub` standardı gereği kullanıcı kimliğidir.
 */
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

/**
 * Refresh stratejisi doğrulama sonrası req.user'a koyduğu yapı:
 * access kullanıcısıyla aynı alanlar + ham refresh token.
 * (DB'deki hash ile karşılaştırmak için ham token gereklidir.)
 */
export interface JwtRefreshUser {
  userId: string;
  email: string;
  role: string;
  refreshToken: string;
}

/** Üretilen token çifti. */
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
