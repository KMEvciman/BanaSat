import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

/** Sohbet içinden teklif/karşı-teklif gönderirken kullanılan veri. */
export class SendOfferDto {
  @IsNumber({}, { message: 'Fiyat sayı olmalıdır.' })
  @Min(1, { message: 'Fiyat en az 1 olmalıdır.' })
  price: number;

  @IsString()
  @MinLength(1, { message: 'Teslim süresi belirtilmelidir.' })
  @MaxLength(100)
  deliveryTime: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
