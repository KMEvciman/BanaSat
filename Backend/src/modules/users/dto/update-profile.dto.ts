import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Profil güncelleme. Tüm alanlar opsiyoneldir; yalnızca gönderilenler
 * güncellenir. (Parola değişikliği ayrı uç noktadadır.)
 */
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'İsim en az 2 karakter olmalıdır.' })
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz.' })
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Hakkımda en fazla 500 karakter olabilir.' })
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  province?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  district?: string;

  /** Avatar görseli (URL veya data URL). */
  @IsOptional()
  @IsString()
  @MaxLength(500000)
  avatarUrl?: string;
}
