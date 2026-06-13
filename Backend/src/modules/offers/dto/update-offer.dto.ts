import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

/** Teklif düzenleme (yalnızca beklemedeki teklifler). */
export class UpdateOfferDto {
  @IsOptional()
  @IsNumber({}, { message: 'Fiyat sayı olmalıdır.' })
  @Min(1, { message: 'Fiyat en az 1 olmalıdır.' })
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
