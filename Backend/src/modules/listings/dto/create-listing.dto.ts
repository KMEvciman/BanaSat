import {
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateListingDto {
  @IsString()
  @MinLength(5, { message: 'Başlık en az 5 karakter olmalıdır.' })
  @MaxLength(120)
  title: string;

  @IsString()
  @MinLength(10, { message: 'Kısa açıklama en az 10 karakter olmalıdır.' })
  @MaxLength(300)
  description: string;

  @IsString()
  @MinLength(20, { message: 'Detaylı açıklama en az 20 karakter olmalıdır.' })
  @MaxLength(5000)
  fullDescription: string;

  @IsString()
  @IsNotEmpty({ message: 'Kategori seçilmelidir.' })
  categoryId: string;

  /** Serbest metin bütçe etiketi: "5.000 - 10.000 TL" gibi. */
  @IsString()
  @IsNotEmpty({ message: 'Bütçe bilgisi gereklidir.' })
  @MaxLength(60)
  budgetLabel: string;

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
  @IsString()
  @MaxLength(500)
  coverImageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true, message: 'Görseller geçerli URL olmalıdır.' })
  imageUrls?: string[];

  /** ISO 8601 tarih: son teklif tarihi. */
  @IsOptional()
  @IsISO8601({}, { message: 'Geçerli bir tarih giriniz.' })
  deadline?: string;
}
