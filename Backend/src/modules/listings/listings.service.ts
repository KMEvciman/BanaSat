import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginatedResult } from '@common/dto/pagination.dto';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingSort, QueryListingsDto } from './dto/query-listings.dto';

/** Kart görünümünde dönecek ilan alanları. */
const LISTING_CARD_SELECT = {
  id: true,
  title: true,
  description: true,
  budgetLabel: true,
  location: true,
  province: true,
  district: true,
  status: true,
  coverImageUrl: true,
  views: true,
  deadline: true,
  createdAt: true,
  category: { select: { id: true, name: true, slug: true, icon: true } },
  owner: {
    select: { id: true, name: true, avatarUrl: true, ratingAvg: true, isVerified: true },
  },
  _count: { select: { offers: true } },
} satisfies Prisma.ListingSelect;

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Yeni ilan oluşturur. Kategori varlığı doğrulanır. */
  async create(ownerId: string, dto: CreateListingDto) {
    await this.assertCategoryExists(dto.categoryId);

    const listing = await this.prisma.listing.create({
      data: {
        title: dto.title,
        description: dto.description,
        fullDescription: dto.fullDescription,
        budgetLabel: dto.budgetLabel,
        location: dto.location,
        province: dto.province,
        district: dto.district,
        coverImageUrl: dto.coverImageUrl,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        owner: { connect: { id: ownerId } },
        category: { connect: { id: dto.categoryId } },
        images: dto.imageUrls?.length
          ? { create: dto.imageUrls.map((url) => ({ url })) }
          : undefined,
      },
      select: LISTING_CARD_SELECT,
    });

    return this.toCard(listing);
  }

  /** Filtreleme + sıralama + sayfalama ile ilan listesi. */
  async findAll(query: QueryListingsDto): Promise<PaginatedResult<unknown>> {
    const where: Prisma.ListingWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }
    if (query.categorySlug) {
      where.category = { slug: query.categorySlug };
    }
    if (query.province) {
      where.province = query.province;
    }
    if (query.ownerId) {
      where.ownerId = query.ownerId;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { fullDescription: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.listing.count({ where }),
      this.prisma.listing.findMany({
        where,
        select: LISTING_CARD_SELECT,
        orderBy: this.buildOrderBy(query.sort),
        skip: query.skip,
        take: query.limit,
      }),
    ]);

    return {
      items: items.map((l) => this.toCard(l)),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  /** Tek ilan detayı. Her görüntülemede görüntülenme sayacı artar. */
  async findOne(id: string) {
    try {
      const listing = await this.prisma.listing.update({
        where: { id },
        data: { views: { increment: 1 } },
        select: {
          ...LISTING_CARD_SELECT,
          fullDescription: true,
          updatedAt: true,
          owner: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              ratingAvg: true,
              ratingCount: true,
              isVerified: true,
            },
          },
          images: { select: { id: true, url: true } },
          offers: {
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              price: true,
              deliveryTime: true,
              warranty: true,
              shippingInfo: true,
              note: true,
              status: true,
              createdAt: true,
              seller: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                  ratingAvg: true,
                  ratingCount: true,
                  isVerified: true,
                },
              },
            },
          },
        },
      });

      return {
        ...this.toCard(listing),
        fullDescription: listing.fullDescription,
        updatedAt: listing.updatedAt,
        images: listing.images,
        offers: listing.offers.map((o) => ({
          ...o,
          price: Number(o.price),
        })),
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('İlan bulunamadı.');
      }
      throw error;
    }
  }

  /** İlan günceller. Yalnızca ilan sahibi yapabilir. */
  async update(id: string, userId: string, dto: UpdateListingDto) {
    await this.assertOwnership(id, userId);

    if (dto.categoryId) {
      await this.assertCategoryExists(dto.categoryId);
    }

    const listing = await this.prisma.listing.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        fullDescription: dto.fullDescription,
        budgetLabel: dto.budgetLabel,
        location: dto.location,
        province: dto.province,
        district: dto.district,
        coverImageUrl: dto.coverImageUrl,
        status: dto.status,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        categoryId: dto.categoryId,
      },
      select: LISTING_CARD_SELECT,
    });

    return this.toCard(listing);
  }

  /** İlan siler. Yalnızca ilan sahibi yapabilir. */
  async remove(id: string, userId: string): Promise<void> {
    await this.assertOwnership(id, userId);
    await this.prisma.listing.delete({ where: { id } });
  }

  // ---------------------------------------------------------------
  // Yardımcı (private) metotlar
  // ---------------------------------------------------------------

  private buildOrderBy(
    sort?: ListingSort,
  ): Prisma.ListingOrderByWithRelationInput | Prisma.ListingOrderByWithRelationInput[] {
    switch (sort) {
      case ListingSort.OLDEST:
        return { createdAt: 'asc' };
      case ListingSort.MOST_OFFERS:
        return { offers: { _count: 'desc' } };
      case ListingSort.MOST_VIEWS:
        return { views: 'desc' };
      case ListingSort.NEWEST:
      default:
        return { createdAt: 'desc' };
    }
  }

  private async assertCategoryExists(categoryId: string): Promise<void> {
    const exists = await this.prisma.category.count({ where: { id: categoryId } });
    if (!exists) {
      throw new NotFoundException('Seçilen kategori bulunamadı.');
    }
  }

  private async assertOwnership(listingId: string, userId: string): Promise<void> {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      select: { ownerId: true },
    });

    if (!listing) {
      throw new NotFoundException('İlan bulunamadı.');
    }
    if (listing.ownerId !== userId) {
      throw new ForbiddenException('Bu ilan üzerinde işlem yapma yetkiniz yok.');
    }
  }

  /** Prisma kaydını temiz, frontend-dostu bir karta dönüştürür. */
  private toCard(listing: {
    _count: { offers: number };
    [key: string]: unknown;
  }) {
    const { _count, ...rest } = listing;
    return { ...rest, offerCount: _count.offers };
  }
}
