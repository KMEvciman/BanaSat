import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /** Kabul edilmiş teklif için sipariş oluştur. */
  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(userId, dto);
  }

  /** Ödemeyi tamamla (simülasyon). */
  @HttpCode(HttpStatus.OK)
  @Post(':id/pay')
  pay(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.ordersService.pay(id, userId);
  }

  /** Alımlarım. */
  @Get('mine')
  findMyPurchases(@CurrentUser('userId') userId: string) {
    return this.ordersService.findMyPurchases(userId);
  }

  /** Satışlarım. */
  @Get('sales')
  findMySales(@CurrentUser('userId') userId: string) {
    return this.ordersService.findMySales(userId);
  }

  /** Sipariş detayı. */
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.ordersService.findOne(id, userId);
  }

  /** Sipariş durumunu ilerlet (hazırlanıyor → kargoda → teslim edildi). */
  @Patch(':id/status')
  advanceStatus(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.advanceStatus(id, userId, dto.status);
  }

  /** Siparişi iptal et. */
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.ordersService.cancel(id, userId);
  }
}
