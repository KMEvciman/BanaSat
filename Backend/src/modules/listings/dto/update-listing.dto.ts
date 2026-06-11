import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ListingStatus } from '@prisma/client';

/**
 * İlan güncelleme. Tüm alanlar opsiyoneldir; yalnızca gönderilenler
 * güncellenir. Sahibi durumu da değiştirebilir (örn. TAMAMLANDI/IPTAL).
 */
export class UpdateListingDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(300)
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  fullDescription?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  budgetLabel?: string;

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

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsISO8601()
  deadline?: string;

  @IsOptional()
  @IsEnum(ListingStatus, { message: 'Geçersiz ilan durumu.' })
  status?: ListingStatus;
}
