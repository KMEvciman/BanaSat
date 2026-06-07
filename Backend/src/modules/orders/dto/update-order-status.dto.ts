import { IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

/**
 * Sipariş durumu güncelleme. İzin verilen geçişler ve hangi tarafın
 * yapabileceği serviste denetlenir.
 */
export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, { message: 'Geçersiz sipariş durumu.' })
  status: OrderStatus;
}
