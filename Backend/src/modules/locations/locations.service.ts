import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Tüm iller + ilçeleri (lokasyon seçim listelerini besler). */
  async findAll() {
    const provinces = await this.prisma.province.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        plate: true,
        name: true,
        districts: { orderBy: { name: 'asc' }, select: { id: true, name: true } },
      },
    });
    return provinces;
  }
}
