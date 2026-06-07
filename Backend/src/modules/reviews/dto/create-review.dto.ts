import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * Değerlendirme oluşturma. Teslim edilmiş bir sipariş için yapılır.
 */
export class CreateReviewDto {
  @IsString()
  @IsNotEmpty({ message: 'Sipariş belirtilmelidir.' })
  orderId: string;

  @IsInt({ message: 'Puan tam sayı olmalıdır.' })
  @Min(1, { message: 'Puan en az 1 olmalıdır.' })
  @Max(5, { message: 'Puan en fazla 5 olmalıdır.' })
  rating: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Yorum en fazla 1000 karakter olabilir.' })
  comment?: string;
}
