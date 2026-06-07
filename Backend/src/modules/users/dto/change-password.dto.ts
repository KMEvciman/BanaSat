import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(1, { message: 'Mevcut parola gereklidir.' })
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: 'Yeni parola en az 8 karakter olmalıdır.' })
  @MaxLength(72)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d)/, {
    message: 'Yeni parola harf ve rakam içermelidir.',
  })
  newPassword: string;
}
