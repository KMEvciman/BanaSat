import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { ListingStatus } from '@prisma/client';
import { CreateListingDto } from './create-listing.dto';

/**
 * Güncelleme: CreateListingDto'nun tüm alanları opsiyonel + durum.
 * Sahibi ilanı düzenleyebilir veya durumunu değiştirebilir.
 */
export class UpdateListingDto extends PartialType(CreateListingDto) {
  @IsOptional()
  @IsEnum(ListingStatus, { message: 'Geçersiz ilan durumu.' })
  status?: ListingStatus;
}
