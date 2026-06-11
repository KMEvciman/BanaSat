import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @MinLength(1, { message: 'Adres başlığı gereklidir.' })
  @MaxLength(50)
  title: string;

  @IsString()
  @MinLength(1, { message: 'İl seçilmelidir.' })
  @MaxLength(50)
  province: string;

  @IsString()
  @MinLength(1, { message: 'İlçe seçilmelidir.' })
  @MaxLength(50)
  district: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  fullAddress?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  title?: string;

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
  fullAddress?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
