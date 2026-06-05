import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingsDto } from './dto/query-listings.dto';
import { Public } from '@common/decorators/public.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  /** İlan listesi: filtreleme, sıralama, sayfalama. Herkese açık. */
  @Public()
  @Get()
  findAll(@Query() query: QueryListingsDto) {
    return this.listingsService.findAll(query);
  }

  /** İlan detayı. Herkese açık (görüntülenme sayacını artırır). */
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  /** Yeni ilan oluştur. Sahibi giriş yapan kullanıcıdır. */
  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateListingDto) {
    return this.listingsService.create(userId, dto);
  }

  /** İlan güncelle. Yalnızca sahibi. */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, userId, dto);
  }

  /** İlan sil. Yalnızca sahibi. */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.listingsService.remove(id, userId);
  }
}
