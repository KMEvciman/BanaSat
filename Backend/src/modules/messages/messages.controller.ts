import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';

/**
 * Mesajlaşma uç noktaları. Tümü korumalıdır; yalnızca konuşmanın
 * katılımcıları erişebilir.
 */
@Controller('conversations')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  /** Konuşma başlat veya mevcut olanı getir. */
  @Post()
  createOrGet(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateConversationDto,
  ) {
    return this.messagesService.createOrGet(userId, dto);
  }

  /** Kullanıcının tüm konuşmaları (mesajlar sayfası kenar çubuğu). */
  @Get()
  findMine(@CurrentUser('userId') userId: string) {
    return this.messagesService.findMine(userId);
  }

  /** Tek konuşma + mesajları. */
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.messagesService.findOne(id, userId);
  }

  /** Konuşmaya mesaj gönder. */
  @Post(':id/messages')
  sendMessage(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagesService.sendMessage(id, userId, dto);
  }

  /** Konuşmadaki mesajları okundu işaretle. */
  @HttpCode(HttpStatus.OK)
  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.messagesService.markAsRead(id, userId);
  }
}
