import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Public } from '@common/decorators/public.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /** Teslim edilmiş sipariş için satıcıyı değerlendir. */
  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(userId, dto);
  }

  /** Bir kullanıcının aldığı değerlendirmeler (herkese açık). */
  @Public()
  @Get('user/:userId')
  findForUser(@Param('userId') userId: string) {
    return this.reviewsService.findForUser(userId);
  }
}
