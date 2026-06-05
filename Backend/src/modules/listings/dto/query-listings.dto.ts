import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ListingStatus } from '@prisma/client';
import { PaginationDto } from '@common/dto/pagination.dto';

/** İlan listeleme sıralama seçenekleri (frontend ile uyumlu). */
export enum ListingSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  MOST_OFFERS = 'most-offers',
  MOST_VIEWS = 'most-views',
}

/**
 * İlan listeleme filtreleri. Sayfalama (page/limit) PaginationDto'dan gelir.
 * Örn: ?page=1&limit=20&categorySlug=elektronik&status=AKTIF&search=iphone&sort=most-offers
 */
export class QueryListingsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  categorySlug?: string;

  @IsOptional()
  @IsEnum(ListingStatus, { message: 'Geçersiz durum filtresi.' })
  status?: ListingStatus;

  /** Yalnızca belirli bir kullanıcının ilanları (örn. "Taleplerim"). */
  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @IsEnum(ListingSort, { message: 'Geçersiz sıralama seçeneği.' })
  sort?: ListingSort = ListingSort.NEWEST;
}
