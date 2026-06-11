import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { QueryOffersDto } from './dto/query-offers.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  /** Satıcı bir ilana teklif verir. */
  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateOfferDto) {
    return this.offersService.create(userId, dto);
  }

  /** Giriş yapan kullanıcının verdiği teklifler ("Tekliflerim"). */
  @Get('mine')
  findMine(@CurrentUser('userId') userId: string, @Query() query: QueryOffersDto) {
    return this.offersService.findMine(userId, query);
  }

  /** İlan sahibi teklifi kabul eder. */
  @Patch(':id/accept')
  accept(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.offersService.accept(id, userId);
  }

  /** İlan sahibi teklifi reddeder. */
  @Patch(':id/reject')
  reject(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.offersService.reject(id, userId);
  }

  /** Satıcı kendi teklifini geri çeker. */
  @Patch(':id/withdraw')
  withdraw(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.offersService.withdraw(id, userId);
  }

  /** Satıcı kendi teklifini tamamen siler. */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.offersService.remove(id, userId);
  }
}
