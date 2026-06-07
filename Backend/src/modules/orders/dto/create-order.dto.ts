import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Sipariş oluşturma. Kabul edilmiş bir teklif için açılır.
 * Teslimat bilgileri ödeme ekranından gelir.
 */
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Teklif belirtilmelidir.' })
  offerId: string;

  @IsString()
  @IsNotEmpty({ message: 'Ad soyad gereklidir.' })
  @MaxLength(120)
  shippingName: string;

  @IsString()
  @IsNotEmpty({ message: 'Telefon gereklidir.' })
  @MaxLength(20)
  shippingPhone: string;

  @IsString()
  @IsNotEmpty({ message: 'Adres gereklidir.' })
  @MaxLength(500)
  shippingAddress: string;

  @IsString()
  @IsNotEmpty({ message: 'Şehir gereklidir.' })
  @MaxLength(60)
  shippingCity: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  shippingZip?: string;
}
