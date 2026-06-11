import { Controller, Get } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Public } from '@common/decorators/public.decorator';

/** İl/ilçe lokasyon verisi. Herkese açık. */
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  /** Tüm iller ve ilçeleri. */
  @Public()
  @Get()
  findAll() {
    return this.locationsService.findAll();
  }
}
