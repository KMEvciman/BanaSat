import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthUser } from '@common/decorators/current-user.decorator';
import { UsersService } from '@modules/users/users.service';

/**
 * Access token doğrulama. Authorization: Bearer <token> başlığından
 * okur, imzayı access secret ile doğrular, kullanıcının hâlâ var
 * olduğunu kontrol eder ve req.user'ı doldurur.
 */
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly users: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.accessSecret'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    // Token geçerli olsa bile kullanıcı silinmiş olabilir (örn. DB sıfırlandı).
    const user = await this.users.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı.');
    }
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
