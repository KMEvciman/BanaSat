import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

/** Değerlendirme yanıtında dönecek alanlar. */
const REVIEW_SELECT = {
  id: true,
  rating: true,
  comment: true,
  createdAt: true,
  author: { select: { id: true, name: true, avatarUrl: true } },
  order: {
    select: {
      offer: { select: { listing: { select: { id: true, title: true } } } },
    },
  },
} satisfies Prisma.ReviewSelect;

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Teslim edilmiş bir sipariş için satıcıyı değerlendirir.
   * Satıcının rating ortalaması ve sayısı atomik olarak güncellenir.
   */
  async create(authorId: string, dto: CreateReviewDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      select: {
        id: true,
        buyerId: true,
        status: true,
        offer: { select: { sellerId: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Sipariş bulunamadı.');
    }
    if (order.buyerId !== authorId) {
      throw new ForbiddenException('Yalnızca siparişi veren alıcı değerlendirme yapabilir.');
    }
    if (order.status !== OrderStatus.TESLIM_EDILDI) {
      throw new BadRequestException('Yalnızca teslim edilmiş siparişler değerlendirilebilir.');
    }

    const targetId = order.offer.sellerId;

    try {
      // Değerlendirmeyi oluştur ve satıcı puan ortalamasını tek transaction'da güncelle.
      const review = await this.prisma.$transaction(async (tx) => {
        const created = await tx.review.create({
          data: {
            orderId: dto.orderId,
            authorId,
            targetId,
            rating: dto.rating,
            comment: dto.comment,
          },
          select: REVIEW_SELECT,
        });

        const target = await tx.user.findUnique({
          where: { id: targetId },
          select: { ratingAvg: true, ratingCount: true },
        });

        const newCount = (target?.ratingCount ?? 0) + 1;
        const newAvg =
          ((target?.ratingAvg ?? 0) * (target?.ratingCount ?? 0) + dto.rating) / newCount;

        await tx.user.update({
          where: { id: targetId },
          data: {
            ratingCount: newCount,
            ratingAvg: Math.round(newAvg * 100) / 100,
          },
        });

        return created;
      });

      return review;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Bu sipariş zaten değerlendirilmiş.');
      }
      throw error;
    }
  }

  /** Bir kullanıcının aldığı tüm değerlendirmeler (herkese açık). */
  async findForUser(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { targetId: userId },
      orderBy: { createdAt: 'desc' },
      select: REVIEW_SELECT,
    });
    return reviews;
  }
}
