import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

/** Kategori yanıtında dönecek alanlar + her kategorideki aktif ilan sayısı. */
const CATEGORY_SELECT = {
  id: true,
  name: true,
  slug: true,
  icon: true,
  _count: {
    select: {
      listings: { where: { status: 'AKTIF' } },
    },
  },
} satisfies Prisma.CategorySelect;

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Tüm kategorileri, isme göre sıralı, aktif ilan sayılarıyla döndürür. */
  async findAll() {
    const categories = await this.prisma.category.findMany({
      select: CATEGORY_SELECT,
      orderBy: { name: 'asc' },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      listingCount: c._count.listings,
    }));
  }

  /** Slug'a göre tek bir kategori getirir. */
  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      select: CATEGORY_SELECT,
    });

    if (!category) {
      throw new NotFoundException('Kategori bulunamadı.');
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      listingCount: category._count.listings,
    };
  }
}
