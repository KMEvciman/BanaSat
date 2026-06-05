import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz.' })
  email: string;

  @IsString()
  @MinLength(2, { message: 'İsim en az 2 karakter olmalıdır.' })
  @MaxLength(80)
  name: string;

  @IsString()
  @MinLength(8, { message: 'Parola en az 8 karakter olmalıdır.' })
  @MaxLength(72, { message: 'Parola en fazla 72 karakter olabilir.' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d)/, {
    message: 'Parola harf ve rakam içermelidir.',
  })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
