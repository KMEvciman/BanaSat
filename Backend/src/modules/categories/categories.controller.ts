import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Public } from '@common/decorators/public.decorator';

/**
 * Kategoriler herkese açıktır (gezinmek için giriş gerekmez).
 */
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /** Tüm kategoriler (aktif ilan sayılarıyla). */
  @Public()
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  /** Slug ile tek kategori. */
  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }
}
