import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListingStatus, OfferStatus, Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { SendOfferDto } from './dto/send-offer.dto';

/** Konuşma listesinde dönecek katılımcı/ilan özet alanları. */
const CONVERSATION_SELECT = {
  id: true,
  createdAt: true,
  updatedAt: true,
  buyer: { select: { id: true, name: true, avatarUrl: true } },
  seller: { select: { id: true, name: true, avatarUrl: true } },
  listing: { select: { id: true, title: true, coverImageUrl: true } },
} satisfies Prisma.ConversationSelect;

/** Tek bir mesajda dönecek alanlar (teklif kartı bilgisi dahil). */
const MESSAGE_SELECT = {
  id: true,
  content: true,
  senderId: true,
  type: true,
  readAt: true,
  createdAt: true,
  // Teklif anlık görüntüsü (mesaj başına önerilen değerler).
  offerPrice: true,
  offerDeliveryTime: true,
  offerNote: true,
  // Bağlı teklifin güncel durumu (kabul/red/beklemede) + varsa siparişi.
  offer: {
    select: {
      id: true,
      status: true,
      sellerId: true,
      order: { select: { id: true, status: true } },
    },
  },
} satisfies Prisma.MessageSelect;

/** Decimal offerPrice'ı number'a çeviren mesaj normalleştirici. */
function normalizeMessage<T extends { offerPrice?: Prisma.Decimal | null }>(message: T) {
  if (message.offerPrice != null) {
    return { ...message, offerPrice: Number(message.offerPrice) };
  }
  return message;
}

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
          select: MESSAGE_SELECT,
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Konuşma bulunamadı.');
    }
    this.assertParticipant(conversation.buyer.id, conversation.seller.id, userId);

    // Bu ilanda satıcının teklif gönderimi engellenmiş mi? (türetilmiş)
    const offersBlocked = conversation.listing
      ? (await this.prisma.offerBlock.count({
          where: {
            listingId: conversation.listing.id,
            blockedUserId: conversation.seller.id,
          },
        })) > 0
      : false;

    return {
      ...conversation,
      offersBlocked,
      messages: conversation.messages.map((m) => normalizeMessage(m)),
    };
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
        select: MESSAGE_SELECT,
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return normalizeMessage(message);
  }

  /**
   * Sohbet içinden teklif/karşı-teklif gönderir. Hem satıcı hem alıcı
   * (ilan sahibi) teklif sunabilir; böylece karşılıklı pazarlık yapılır.
   * Teklif, konuşmanın satıcısına ait tekil Offer kaydı üzerinden yürür
   * (upsert) ve her mesaj o anki fiyatın anlık görüntüsünü saklar.
   */
  async sendOffer(conversationId: string, senderId: string, dto: SendOfferDto) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        buyerId: true,
        sellerId: true,
        listingId: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Konuşma bulunamadı.');
    }
    this.assertParticipant(conversation.buyerId, conversation.sellerId, senderId);

    if (!conversation.listingId) {
      throw new BadRequestException('Bu konuşma bir ilana bağlı değil.');
    }

    // İlan sahibi, satıcının bu ilana teklif vermesini engellediyse reddet.
    const blocked = await this.prisma.offerBlock.count({
      where: { listingId: conversation.listingId, blockedUserId: conversation.sellerId },
    });
    if (blocked > 0) {
      throw new ForbiddenException('Bu ilana teklif gönderimi engellenmiş.');
    }

    // İlanın hâlâ teklif almaya açık olduğunu doğrula.
    const listing = await this.prisma.listing.findUnique({
      where: { id: conversation.listingId },
      select: { status: true },
    });
    if (!listing || listing.status !== ListingStatus.AKTIF) {
      throw new BadRequestException('Bu ilan teklif almaya kapalı.');
    }

    // Teklif her zaman konuşmanın satıcısına ait kayıt üzerinden yürür.
    const deliveryTime = dto.deliveryTime?.trim() || 'Belirtilmedi';
    const offer = await this.prisma.offer.upsert({
      where: {
        listingId_sellerId: {
          listingId: conversation.listingId,
          sellerId: conversation.sellerId,
        },
      },
      update: {
        price: dto.price,
        deliveryTime,
        note: dto.note ?? '',
        status: OfferStatus.BEKLEMEDE,
      },
      create: {
        listingId: conversation.listingId,
        sellerId: conversation.sellerId,
        price: dto.price,
        deliveryTime,
        note: dto.note ?? '',
      },
      select: { id: true },
    });

    // Gönderen satıcıysa "teklif", alıcıysa "karşı teklif".
    const isCounter = senderId === conversation.buyerId;
    const content = `₺${dto.price.toLocaleString('tr-TR')} ${isCounter ? 'karşı teklif' : 'teklif'} sundu`;

    const [message] = await this.prisma.$transaction([
      this.prisma.message.create({
        data: {
          conversationId,
          senderId,
          content,
          type: 'OFFER',
          offerId: offer.id,
          offerPrice: dto.price,
          offerDeliveryTime: dto.deliveryTime?.trim() || null,
          offerNote: dto.note ?? '',
        },
        select: MESSAGE_SELECT,
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return normalizeMessage(message);
  }

  /**
   * Konuşmadaki güncel teklifi kabul eder. Yalnızca son teklifi
   * gönderen DIŞINDAKI katılımcı kabul edebilir (kendi teklifini kabul edemez).
   * Kabul edilen teklif KABUL olur, ilan BEKLEMEDE'ye geçer ve alıcı için
   * bir sipariş (ODEME_BEKLENIYOR) oluşturulur ("Siparişlerim").
   */
  async acceptOffer(conversationId: string, userId: string) {
    const { conversation, offer } = await this.getActiveOffer(conversationId, userId);

    await this.prisma.$transaction([
      this.prisma.offer.update({
        where: { id: offer.id },
        data: { status: OfferStatus.KABUL },
      }),
      this.prisma.listing.update({
        where: { id: conversation.listingId! },
        data: { status: ListingStatus.BEKLEMEDE },
      }),
      // Teklif kabul edilince sipariş oluştur (varsa dokunma).
      this.prisma.order.upsert({
        where: { offerId: offer.id },
        update: {},
        create: {
          offerId: offer.id,
          buyerId: conversation.buyerId,
          amount: offer.price,
        },
      }),
    ]);

    return { ok: true };
  }

  /** Konuşmadaki güncel teklifi reddeder (son teklifi gönderen hariç). */
  async rejectOffer(conversationId: string, userId: string) {
    const { offer } = await this.getActiveOffer(conversationId, userId);

    await this.prisma.offer.update({
      where: { id: offer.id },
      data: { status: OfferStatus.RED },
    });

    return { ok: true };
  }

  /**
   * Engelleme modalı için: ilan sahibinin tüm ilanları + karşı tarafın
   * (satıcının) her ilanda engelli olup olmadığı bilgisi.
   */
  async getOfferBlockOptions(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { buyerId: true, sellerId: true },
    });

    if (!conversation) {
      throw new NotFoundException('Konuşma bulunamadı.');
    }
    this.assertParticipant(conversation.buyerId, conversation.sellerId, userId);
    if (userId !== conversation.buyerId) {
      throw new ForbiddenException('Bu işlemi yalnızca ilan sahibi yapabilir.');
    }

    const [listings, blocks] = await Promise.all([
      this.prisma.listing.findMany({
        where: { ownerId: conversation.buyerId },
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, coverImageUrl: true, status: true },
      }),
      this.prisma.offerBlock.findMany({
        where: { blockedUserId: conversation.sellerId, listing: { ownerId: conversation.buyerId } },
        select: { listingId: true },
      }),
    ]);

    const blockedSet = new Set(blocks.map((b) => b.listingId));

    return {
      sellerId: conversation.sellerId,
      listings: listings.map((l) => ({ ...l, blocked: blockedSet.has(l.id) })),
    };
  }

  /**
   * Karşı tarafın (satıcının) engellendiği ilanları senkronize eder:
   * verilen listingIds engellenir, kalan ilanlardaki engel kaldırılır.
   * Yalnızca ilan sahibi çağırabilir.
   */
  async setOfferBlocks(conversationId: string, userId: string, listingIds: string[]) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { buyerId: true, sellerId: true },
    });

    if (!conversation) {
      throw new NotFoundException('Konuşma bulunamadı.');
    }
    this.assertParticipant(conversation.buyerId, conversation.sellerId, userId);
    if (userId !== conversation.buyerId) {
      throw new ForbiddenException('Bu işlemi yalnızca ilan sahibi yapabilir.');
    }

    // Yalnızca ilan sahibine ait ilanlar için işlem yapılır (güvenlik).
    const ownListings = await this.prisma.listing.findMany({
      where: { ownerId: conversation.buyerId },
      select: { id: true },
    });
    const ownIds = new Set(ownListings.map((l) => l.id));
    const targetIds = listingIds.filter((id) => ownIds.has(id));

    await this.prisma.$transaction([
      // Seçilmeyen ilanlardaki engelleri kaldır.
      this.prisma.offerBlock.deleteMany({
        where: {
          blockedUserId: conversation.sellerId,
          listing: { ownerId: conversation.buyerId },
          listingId: { notIn: targetIds.length ? targetIds : ['__none__'] },
        },
      }),
      // Seçilen ilanlar için engelleri ekle (varsa atla).
      ...targetIds.map((listingId) =>
        this.prisma.offerBlock.upsert({
          where: {
            listingId_blockedUserId: { listingId, blockedUserId: conversation.sellerId },
          },
          update: {},
          create: { listingId, blockedUserId: conversation.sellerId },
        }),
      ),
    ]);

    return { blockedListingIds: targetIds };
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

  /**
   * Kabul/red için konuşmanın güncel (BEKLEMEDE) teklifini getirir.
   * Son teklifi gönderen taraf kendi teklifini yanıtlayamaz.
   */
  private async getActiveOffer(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true, buyerId: true, sellerId: true, listingId: true },
    });

    if (!conversation) {
      throw new NotFoundException('Konuşma bulunamadı.');
    }
    this.assertParticipant(conversation.buyerId, conversation.sellerId, userId);
    if (!conversation.listingId) {
      throw new BadRequestException('Bu konuşma bir ilana bağlı değil.');
    }

    const offer = await this.prisma.offer.findUnique({
      where: {
        listingId_sellerId: {
          listingId: conversation.listingId,
          sellerId: conversation.sellerId,
        },
      },
      select: { id: true, status: true, price: true },
    });

    if (!offer) {
      throw new NotFoundException('Yanıtlanacak teklif bulunamadı.');
    }
    if (offer.status !== OfferStatus.BEKLEMEDE) {
      throw new BadRequestException('Bu teklif zaten yanıtlanmış.');
    }

    // Son teklif mesajını gönderen kişi kendi teklifini yanıtlayamaz.
    const lastOfferMessage = await this.prisma.message.findFirst({
      where: { conversationId, type: 'OFFER' },
      orderBy: { createdAt: 'desc' },
      select: { senderId: true },
    });
    if (lastOfferMessage && lastOfferMessage.senderId === userId) {
      throw new ForbiddenException('Kendi gönderdiğiniz teklifi yanıtlayamazsınız.');
    }

    return { conversation, offer };
  }
}
