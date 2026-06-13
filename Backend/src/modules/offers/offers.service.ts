import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListingStatus, OfferStatus, Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginatedResult } from '@common/dto/pagination.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferSort, QueryOffersDto } from './dto/query-offers.dto';

/** Teklif kartında (Tekliflerim) dönecek ilişkili ilan özeti. */
const OFFER_WITH_LISTING_SELECT = {
  id: true,
  price: true,
  deliveryTime: true,
  warranty: true,
  shippingInfo: true,
  note: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  listing: {
    select: {
      id: true,
      title: true,
      description: true,
      budgetLabel: true,
      coverImageUrl: true,
      status: true,
      views: true,
      category: { select: { id: true, name: true, slug: true, icon: true } },
      owner: { select: { id: true, name: true, avatarUrl: true } },
      _count: { select: { offers: true } },
    },
  },
} satisfies Prisma.OfferSelect;

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Satıcı bir ilana teklif verir. */
  async create(sellerId: string, dto: CreateOfferDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      select: { id: true, ownerId: true, status: true },
    });

    if (!listing) {
      throw new NotFoundException('İlan bulunamadı.');
    }
    if (listing.ownerId === sellerId) {
      throw new ForbiddenException('Kendi ilanınıza teklif veremezsiniz.');
    }
    if (listing.status !== ListingStatus.AKTIF) {
      throw new BadRequestException('Bu ilan teklif almaya kapalı.');
    }

    // İlan sahibi bu kullanıcıyı bu ilanda engellediyse teklif kabul edilmez.
    const blocked = await this.prisma.offerBlock.count({
      where: { listingId: dto.listingId, blockedUserId: sellerId },
    });
    if (blocked > 0) {
      throw new ForbiddenException('Bu ilana teklif gönderimi engellenmiş.');
    }

    try {
      const offer = await this.prisma.offer.create({
        data: {
          listingId: dto.listingId,
          sellerId,
          price: dto.price,
          deliveryTime: dto.deliveryTime,
          warranty: dto.warranty,
          shippingInfo: dto.shippingInfo,
          note: dto.note,
        },
        select: OFFER_WITH_LISTING_SELECT,
      });
      return this.toOffer(offer);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Bu ilana zaten bir teklif verdiniz.');
      }
      throw error;
    }
  }

  /** Giriş yapan satıcının verdiği teklifler (filtre + sıralama + sayfalama). */
  async findMine(
    sellerId: string,
    query: QueryOffersDto,
  ): Promise<PaginatedResult<unknown>> {
    const where: Prisma.OfferWhereInput = { sellerId };

    if (query.status) {
      where.status = query.status;
    }
    if (query.categorySlug) {
      where.listing = { category: { slug: query.categorySlug } };
    }
    if (query.search) {
      where.listing = {
        ...(where.listing as Prisma.ListingWhereInput),
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
        ],
      };
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.offer.count({ where }),
      this.prisma.offer.findMany({
        where,
        select: OFFER_WITH_LISTING_SELECT,
        orderBy: this.buildOrderBy(query.sort),
        skip: query.skip,
        take: query.limit,
      }),
    ]);

    return {
      items: items.map((o) => this.toOffer(o)),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  /** İlan sahibi teklifi kabul eder. İlan "beklemede"ye geçer + sipariş oluşur. */
  async accept(offerId: string, userId: string) {
    const offer = await this.getOfferForOwnerAction(offerId, userId);

    const [, updated] = await this.prisma.$transaction([
      this.prisma.listing.update({
        where: { id: offer.listingId },
        data: { status: ListingStatus.BEKLEMEDE },
      }),
      this.prisma.offer.update({
        where: { id: offerId },
        data: { status: OfferStatus.KABUL },
        select: OFFER_WITH_LISTING_SELECT,
      }),
      // Kabul edilince sipariş oluştur (varsa dokunma) - "Siparişlerim".
      this.prisma.order.upsert({
        where: { offerId },
        update: {},
        create: { offerId, buyerId: userId, amount: offer.price },
      }),
    ]);

    return this.toOffer(updated);
  }

  /** İlan sahibi teklifi reddeder. */
  async reject(offerId: string, userId: string) {
    await this.getOfferForOwnerAction(offerId, userId);

    const updated = await this.prisma.offer.update({
      where: { id: offerId },
      data: { status: OfferStatus.RED },
      select: OFFER_WITH_LISTING_SELECT,
    });

    return this.toOffer(updated);
  }

  /** Satıcı kendi teklifini geri çeker. */
  async withdraw(offerId: string, sellerId: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      select: { id: true, sellerId: true, status: true },
    });

    if (!offer) {
      throw new NotFoundException('Teklif bulunamadı.');
    }
    if (offer.sellerId !== sellerId) {
      throw new ForbiddenException('Bu teklif üzerinde işlem yapma yetkiniz yok.');
    }
    if (offer.status !== OfferStatus.BEKLEMEDE) {
      throw new BadRequestException('Yalnızca beklemedeki teklifler geri çekilebilir.');
    }

    const updated = await this.prisma.offer.update({
      where: { id: offerId },
      data: { status: OfferStatus.GERI_CEKILDI },
      select: OFFER_WITH_LISTING_SELECT,
    });

    return this.toOffer(updated);
  }

  /** Satıcı kendi teklifini düzenler (yalnızca beklemedeki teklifler). */
  async update(
    offerId: string,
    sellerId: string,
    dto: { price?: number; note?: string },
  ) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      select: { id: true, sellerId: true, status: true },
    });

    if (!offer) {
      throw new NotFoundException('Teklif bulunamadı.');
    }
    if (offer.sellerId !== sellerId) {
      throw new ForbiddenException('Bu teklif üzerinde işlem yapma yetkiniz yok.');
    }
    if (offer.status !== OfferStatus.BEKLEMEDE) {
      throw new BadRequestException('Yalnızca beklemedeki teklifler düzenlenebilir.');
    }

    const updated = await this.prisma.offer.update({
      where: { id: offerId },
      data: { price: dto.price, note: dto.note },
      select: OFFER_WITH_LISTING_SELECT,
    });

    return this.toOffer(updated);
  }

  /**
   * Satıcı kendi teklifini tamamen siler (geçmiş teklifler dahil, her durumda).
   * İlgili sipariş varsa cascade ile birlikte silinir.
   */
  async remove(offerId: string, sellerId: string): Promise<void> {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      select: { id: true, sellerId: true },
    });

    if (!offer) {
      throw new NotFoundException('Teklif bulunamadı.');
    }
    if (offer.sellerId !== sellerId) {
      throw new ForbiddenException('Bu teklif üzerinde işlem yapma yetkiniz yok.');
    }

    await this.prisma.offer.delete({ where: { id: offerId } });
  }

  // ---------------------------------------------------------------
  // Yardımcı (private) metotlar
  // ---------------------------------------------------------------

  /**
   * Kabul/red gibi sahip işlemleri için teklifi getirir ve
   * isteyenin gerçekten ilan sahibi + teklifin beklemede olduğunu doğrular.
   */
  private async getOfferForOwnerAction(offerId: string, userId: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      select: { id: true, status: true, listingId: true, price: true, listing: { select: { ownerId: true } } },
    });

    if (!offer) {
      throw new NotFoundException('Teklif bulunamadı.');
    }
    if (offer.listing.ownerId !== userId) {
      throw new ForbiddenException('Bu teklif üzerinde işlem yapma yetkiniz yok.');
    }
    if (offer.status !== OfferStatus.BEKLEMEDE) {
      throw new BadRequestException('Bu teklif zaten yanıtlanmış.');
    }

    return offer;
  }

  private buildOrderBy(sort?: OfferSort): Prisma.OfferOrderByWithRelationInput {
    switch (sort) {
      case OfferSort.OLDEST:
        return { createdAt: 'asc' };
      case OfferSort.PRICE_HIGH:
        return { price: 'desc' };
      case OfferSort.PRICE_LOW:
        return { price: 'asc' };
      case OfferSort.NEWEST:
      default:
        return { createdAt: 'desc' };
    }
  }

  /** Decimal fiyatı number'a çevirir, ilişkili sayacı düzleştirir. */
  private toOffer(offer: Record<string, any>) {
    const result: Record<string, any> = { ...offer, price: Number(offer.price) };
    if (offer.listing?._count) {
      result.listing = {
        ...offer.listing,
        offerCount: offer.listing._count.offers,
      };
      delete result.listing._count;
    }
    return result;
  }
}
