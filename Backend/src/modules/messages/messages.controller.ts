import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { SendOfferDto } from './dto/send-offer.dto';
import { SetOfferBlocksDto } from './dto/set-offer-blocks.dto';
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

  /** Sohbet içinden teklif / karşı-teklif gönder (her iki taraf). */
  @Post(':id/offer')
  sendOffer(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: SendOfferDto,
  ) {
    return this.messagesService.sendOffer(id, userId, dto);
  }

  /** Güncel teklifi kabul et (son teklifi gönderen hariç). */
  @HttpCode(HttpStatus.OK)
  @Patch(':id/offer/accept')
  acceptOffer(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.messagesService.acceptOffer(id, userId);
  }

  /** Güncel teklifi reddet (son teklifi gönderen hariç). */
  @HttpCode(HttpStatus.OK)
  @Patch(':id/offer/reject')
  rejectOffer(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.messagesService.rejectOffer(id, userId);
  }

  /** Engelleme modalı için ilan sahibinin ilanları + engel durumları. */
  @Get(':id/offer-blocks')
  getOfferBlockOptions(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.messagesService.getOfferBlockOptions(id, userId);
  }

  /** Karşı tarafın engellendiği ilanları senkronize et (yalnızca ilan sahibi). */
  @HttpCode(HttpStatus.OK)
  @Put(':id/offer-blocks')
  setOfferBlocks(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: SetOfferBlocksDto,
  ) {
    return this.messagesService.setOfferBlocks(id, userId, dto.listingIds);
  }

  /** Konuşmadaki mesajları okundu işaretle. */
  @HttpCode(HttpStatus.OK)
  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.messagesService.markAsRead(id, userId);
  }
}
