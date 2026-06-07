import { IsString, MaxLength, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @MinLength(1, { message: 'Mesaj boş olamaz.' })
  @MaxLength(2000, { message: 'Mesaj en fazla 2000 karakter olabilir.' })
  content: string;
}
