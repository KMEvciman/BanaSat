import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty({ message: 'İlan belirtilmelidir.' })
  listingId: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Geçerli bir fiyat giriniz.' })
  @Min(1, { message: 'Fiyat 0\'dan büyük olmalıdır.' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'Teslimat süresi gereklidir.' })
  @MaxLength(60)
  deliveryTime: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  warranty?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  shippingInfo?: string;

  @IsString()
  @MinLength(10, { message: 'Teklif notu en az 10 karakter olmalıdır.' })
  @MaxLength(1000)
  note: string;
}
