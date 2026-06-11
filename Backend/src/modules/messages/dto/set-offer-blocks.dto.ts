import { IsArray, IsString } from 'class-validator';

/** Karşı tarafın engelleneceği ilan id'leri (senkronize edilir). */
export class SetOfferBlocksDto {
  @IsArray()
  @IsString({ each: true })
  listingIds: string[];
}
