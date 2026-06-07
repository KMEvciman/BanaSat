import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListingStatus, OfferStatus, OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

/** Sipariş yanıtında dönecek ilişkili alanlar. */
const ORDER_SELECT = {
  id: true,
  status: true,
  amount: true,
  shippingName: true,
  shippingPhone: true,
  shippingAddress: true,
  shippingCity: true,
  createdAt: true,
  updatedAt: true,
  buyer: { select: { id: true, name: true, avatarUrl: true } },
  offer: {
    select: {
      id: true,
      price: true,
      deliveryTime: true,
      seller: { select: { id: true, name: true, avatarUrl: true } },
      listing: {
        select: {
          id: true,
          title: true,
          coverImageUrl: true,
          category: { select: { name: true, slug: true } },
        },
      },
    },
  },
} satisfies Prisma.OrderSelect;

/**
 * İzin verilen durum geçişleri ve geçişi kimin yapabileceği.
 * 'buyer' = alıcı (ilan sahibi), 'seller' = teklifi veren.
 */
const STATUS_TRANSITIONS: Record<string, { next: OrderStatus; actor: 'buyer' | 'seller' }> = {
  [OrderStatus.ODENDI]: { next: OrderStatus.HAZIRLANIYOR, actor: 'seller' },
  [OrderStatus.HAZIRLANIYOR]: { next: OrderStatus.KARGODA, actor: 'seller' },
  [OrderStatus.KARGODA]: { next: OrderStatus.TESLIM_EDILDI, actor: 'buyer' },
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Kabul edilmiş bir teklif için sipariş oluşturur. Yalnızca alıcı. */
  async create(buyerId: string, dto: CreateOrderDto) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: dto.offerId },
      select: {
        id: true,
        price: true,
        status: true,
        listing: { select: { ownerId: true } },
      },
    });

    if (!offer) {
      throw new NotFoundException('Teklif bulunamadı.');
    }
    if (offer.listing.ownerId !== buyerId) {
      throw new ForbiddenException('Yalnızca ilan sahibi sipariş oluşturabilir.');
    }
    if (offer.status !== OfferStatus.KABUL) {
      throw new BadRequestException('Yalnızca kabul edilmiş teklif için sipariş oluşturulabilir.');
    }

    try {
      const order = await this.prisma.order.create({
        data: {
          offerId: dto.offerId,
          buyerId,
          amount: offer.price,
          shippingName: dto.shippingName,
          shippingPhone: dto.shippingPhone,
          shippingAddress: dto.shippingAddress,
          shippingCity: dto.shippingCity,
        },
        select: ORDER_SELECT,
      });
      return this.toOrder(order);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Bu teklif için zaten bir sipariş mevcut.');
      }
      throw error;
    }
  }

  /**
   * Ödeme (simülasyon). Sipariş ODENDI olur, ilgili ilan TAMAMLANDI'ya geçer.
   * Gerçek ödeme entegrasyonu (iyzico/Stripe vb.) ileride buraya eklenir.
   */
  async pay(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        buyerId: true,
        status: true,
        offer: { select: { listingId: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Sipariş bulunamadı.');
    }
    if (order.buyerId !== userId) {
      throw new ForbiddenException('Bu sipariş üzerinde işlem yapma yetkiniz yok.');
    }
    if (order.status !== OrderStatus.ODEME_BEKLENIYOR) {
      throw new BadRequestException('Bu sipariş zaten ödenmiş veya iptal edilmiş.');
    }

    const [, updated] = await this.prisma.$transaction([
      this.prisma.listing.update({
        where: { id: order.offer.listingId },
        data: { status: ListingStatus.TAMAMLANDI },
      }),
      this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.ODENDI },
        select: ORDER_SELECT,
      }),
    ]);

    return this.toOrder(updated);
  }

  /** Alıcının siparişleri ("Alımlarım"). */
  async findMyPurchases(buyerId: string) {
    const orders = await this.prisma.order.findMany({
      where: { buyerId },
      orderBy: { createdAt: 'desc' },
      select: ORDER_SELECT,
    });
    return orders.map((o) => this.toOrder(o));
  }

  /** Satıcının satışları ("Satışlarım"). */
  async findMySales(sellerId: string) {
    const orders = await this.prisma.order.findMany({
      where: { offer: { sellerId } },
      orderBy: { createdAt: 'desc' },
      select: ORDER_SELECT,
    });
    return orders.map((o) => this.toOrder(o));
  }

  /** Sipariş detayı. Yalnızca alıcı veya satıcı görebilir. */
  async findOne(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { ...ORDER_SELECT, offer: { select: { sellerId: true, ...ORDER_SELECT.offer.select } } },
    });

    if (!order) {
      throw new NotFoundException('Sipariş bulunamadı.');
    }
    this.assertParticipant(order.buyer.id, order.offer.sellerId, userId);

    return this.toOrder(order);
  }

  /** Sipariş durumunu bir sonraki adıma taşır (kargo/teslim akışı). */
  async advanceStatus(orderId: string, userId: string, targetStatus: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        buyerId: true,
        offer: { select: { sellerId: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Sipariş bulunamadı.');
    }
    this.assertParticipant(order.buyerId, order.offer.sellerId, userId);

    const transition = STATUS_TRANSITIONS[order.status];
    if (!transition || transition.next !== targetStatus) {
      throw new BadRequestException(
        `'${order.status}' durumundan '${targetStatus}' durumuna geçilemez.`,
      );
    }

    const isBuyer = userId === order.buyerId;
    const actorOk = transition.actor === 'buyer' ? isBuyer : !isBuyer;
    if (!actorOk) {
      throw new ForbiddenException('Bu durum değişikliğini yapma yetkiniz yok.');
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: targetStatus },
      select: ORDER_SELECT,
    });

    return this.toOrder(updated);
  }

  /** Siparişi iptal eder (yalnızca ödeme beklenirken, alıcı veya satıcı). */
  async cancel(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        buyerId: true,
        offer: { select: { sellerId: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Sipariş bulunamadı.');
    }
    this.assertParticipant(order.buyerId, order.offer.sellerId, userId);

    if (order.status !== OrderStatus.ODEME_BEKLENIYOR) {
      throw new BadRequestException('Yalnızca ödeme beklenen siparişler iptal edilebilir.');
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.IPTAL },
      select: ORDER_SELECT,
    });

    return this.toOrder(updated);
  }

  // ---------------------------------------------------------------
  // Yardımcı (private) metotlar
  // ---------------------------------------------------------------

  private assertParticipant(buyerId: string, sellerId: string, userId: string): void {
    if (userId !== buyerId && userId !== sellerId) {
      throw new ForbiddenException('Bu sipariş üzerinde işlem yapma yetkiniz yok.');
    }
  }

  /** Decimal alanları number'a çevirir. */
  private toOrder(order: Record<string, any>) {
    const result: Record<string, any> = { ...order, amount: Number(order.amount) };
    if (order.offer) {
      result.offer = { ...order.offer, price: Number(order.offer.price) };
      delete result.offer.sellerId;
    }
    return result;
  }
}
