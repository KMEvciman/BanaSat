import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

/**
 * Parola ve token hash'leme için tek sorumlu servis.
 * bcrypt detayları tek yerde toplanır; Auth ve Users bunu kullanır.
 */
@Injectable()
export class HashingService {
  constructor(private readonly config: ConfigService) {}

  hash(value: string): Promise<string> {
    const rounds = this.config.get<number>('bcrypt.saltRounds') ?? 12;
    return bcrypt.hash(value, rounds);
  }

  compare(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }
}
