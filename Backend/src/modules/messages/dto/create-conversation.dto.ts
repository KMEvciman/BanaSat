import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Konuşma başlatma/getirme. Bir ilan bağlamında açılır.
 * Başlatan kişi ilan sahibiyse, konuşulacak satıcı (participantId) belirtilmelidir.
 * Başlatan ilan sahibi değilse, karşı taraf otomatik ilan sahibidir.
 */
export class CreateConversationDto {
  @IsString()
  @IsNotEmpty({ message: 'İlan belirtilmelidir.' })
  listingId: string;

  @IsOptional()
  @IsString()
  participantId?: string;
}
