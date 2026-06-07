import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

/** Konuşma listesinde dönecek katılımcı/ilan özet alanları. */
const CONVERSATION_SELECT = {
  id: true,
  createdAt: true,
  updatedAt: true,
  buyer: { select: { id: true, name: true, avatarUrl: true } },
  seller: { select: { id: true, name: true, avatarUrl: true } },
  listing: { select: { id: true, title: true, coverImageUrl: true } },
} satisfies Prisma.ConversationSelect;

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Bir ilan bağlamında konuşma başlatır; varsa mevcut olanı döndürür. */
  async createOrGet(userId: string, dto: CreateConversationDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      select: { id: true, ownerId: true },
    });
    if (!listing) {
      throw new NotFoundException('İlan bulunamadı.');
    }

    // Alıcı her zaman ilan sahibidir. Satıcı, ilan sahibi olmayan taraftır.
    let buyerId: string;
    let sellerId: string;

    if (listing.ownerId === userId) {
      // İlan sahibi başlatıyorsa, konuşulacak satıcı belirtilmeli.
      if (!dto.participantId) {
        throw new BadRequestException('Konuşulacak kullanıcı belirtilmelidir.');
      }
      if (dto.participantId === userId) {
        throw new BadRequestException('Kendinizle konuşma başlatamazsınız.');
      }
      buyerId = userId;
      sellerId = dto.participantId;
    } else {
      // Satıcı başlatıyorsa, karşı taraf ilan sahibidir.
      buyerId = listing.ownerId;
      sellerId = userId;
    }

    // Karşı tarafın varlığını doğrula.
    const participantExists = await this.prisma.user.count({
      where: { id: sellerId === userId ? buyerId : sellerId },
    });
    if (!participantExists) {
      throw new NotFoundException('Konuşulacak kullanıcı bulunamadı.');
    }

    const conversation = await this.prisma.conversation.upsert({
      where: {
        listingId_buyerId_sellerId: { listingId: dto.listingId, buyerId, sellerId },
      },
      update: {},
      create: { listingId: dto.listingId, buyerId, sellerId },
      select: CONVERSATION_SELECT,
    });

    return conversation;
  }

  /** Giriş yapan kullanıcının tüm konuşmaları (son mesaj + okunmamış sayısı). */
  async findMine(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
      orderBy: { updatedAt: 'desc' },
      select: {
        ...CONVERSATION_SELECT,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, createdAt: true, senderId: true },
        },
        _count: {
          select: {
            messages: { where: { readAt: null, senderId: { not: userId } } },
          },
        },
      },
    });

    return conversations.map((c) => {
      const { messages, _count, buyer, seller, ...rest } = c;
      return {
        ...rest,
        // Karşı taraf: kullanıcı alıcıysa satıcı, değilse alıcı.
        counterpart: c.buyer.id === userId ? seller : buyer,
        lastMessage: messages[0] ?? null,
        unreadCount: _count.messages,
      };
    });
  }

  /** Konuşma detayı + tüm mesajlar. Yalnızca katılımcılar erişebilir. */
  async findOne(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        ...CONVERSATION_SELECT,
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            senderId: true,
            readAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Konuşma bulunamadı.');
    }
    this.assertParticipant(conversation.buyer.id, conversation.seller.id, userId);

    return conversation;
  }

  /** Konuşmaya mesaj gönderir. */
  async sendMessage(conversationId: string, senderId: string, dto: SendMessageDto) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true, buyerId: true, sellerId: true },
    });

    if (!conversation) {
      throw new NotFoundException('Konuşma bulunamadı.');
    }
    this.assertParticipant(conversation.buyerId, conversation.sellerId, senderId);

    // Mesajı oluştur ve konuşmanın updatedAt'ini güncelle (sıralama için).
    const [message] = await this.prisma.$transaction([
      this.prisma.message.create({
        data: { conversationId, senderId, content: dto.content },
        select: {
          id: true,
          content: true,
          senderId: true,
          readAt: true,
          createdAt: true,
        },
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return message;
  }

  /** Karşı tarafın gönderdiği okunmamış mesajları okundu olarak işaretler. */
  async markAsRead(conversationId: string, userId: string): Promise<{ updated: number }> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { buyerId: true, sellerId: true },
    });

    if (!conversation) {
      throw new NotFoundException('Konuşma bulunamadı.');
    }
    this.assertParticipant(conversation.buyerId, conversation.sellerId, userId);

    const result = await this.prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, readAt: null },
      data: { readAt: new Date() },
    });

    return { updated: result.count };
  }

  // ---------------------------------------------------------------
  // Yardımcı (private) metotlar
  // ---------------------------------------------------------------

  /** İsteyenin konuşmanın katılımcısı olduğunu doğrular. */
  private assertParticipant(buyerId: string, sellerId: string, userId: string): void {
    if (userId !== buyerId && userId !== sellerId) {
      throw new ForbiddenException('Bu konuşmaya erişim yetkiniz yok.');
    }
  }
}
