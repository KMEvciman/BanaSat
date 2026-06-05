import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OfferStatus } from '@prisma/client';
import { PaginationDto } from '@common/dto/pagination.dto';

/** Teklif listeleme sıralama seçenekleri (frontend "Tekliflerim" ile uyumlu). */
export enum OfferSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  PRICE_HIGH = 'price-high',
  PRICE_LOW = 'price-low',
}

/**
 * "Tekliflerim" sayfası filtreleri.
 * Örn: ?status=BEKLEMEDE&categorySlug=elektronik&search=iphone&sort=price-low
 */
export class QueryOffersDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OfferStatus, { message: 'Geçersiz teklif durumu.' })
  status?: OfferStatus;

  @IsOptional()
  @IsString()
  categorySlug?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(OfferSort, { message: 'Geçersiz sıralama seçeneği.' })
  sort?: OfferSort = OfferSort.NEWEST;
}
