import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from '@common/hashing/hashing.service';
import { UsersService, PublicUser } from '@modules/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload, Tokens } from './interfaces/jwt-payload.interface';

export interface AuthResult {
  user: PublicUser;
  tokens: Tokens;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly hashing: HashingService,
  ) {}

  /** Yeni kullanıcı kaydı oluşturur ve token çifti döndürür. */
  async register(dto: RegisterDto): Promise<AuthResult> {
    const emailExists = await this.users.existsByEmail(dto.email);
    if (emailExists) {
      throw new ConflictException('Bu e-posta adresi zaten kayıtlı.');
    }

    const passwordHash = await this.hashing.hash(dto.password);
    const user = await this.users.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      phone: dto.phone,
      province: dto.province,
      district: dto.district,
    });

    const tokens = await this.issueTokens(user.id, user.email, user.role);
    await this.persistRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }

  /** E-posta + parola ile giriş yapar. */
  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.users.findByEmailWithSecrets(dto.email);
    if (!user) {
      throw new UnauthorizedException('E-posta veya parola hatalı.');
    }

    const passwordMatches = await this.hashing.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('E-posta veya parola hatalı.');
    }

    const tokens = await this.issueTokens(user.id, user.email, user.role);
    await this.persistRefreshToken(user.id, tokens.refreshToken);

    return { user: await this.users.findById(user.id), tokens } as AuthResult;
  }

  /** Geçerli refresh token ile yeni token çifti üretir (token rotation). */
  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.users.findByIdWithSecrets(userId);
    if (!user || !user.refreshTokenHash) {
      throw new ForbiddenException('Erişim reddedildi.');
    }

    const tokenMatches = await this.hashing.compare(refreshToken, user.refreshTokenHash);
    if (!tokenMatches) {
      throw new ForbiddenException('Erişim reddedildi.');
    }

    const tokens = await this.issueTokens(user.id, user.email, user.role);
    await this.persistRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  /** Çıkış: refresh token hash'ini temizler, böylece token geçersizleşir. */
  async logout(userId: string): Promise<void> {
    await this.users.setRefreshTokenHash(userId, null);
  }

  /** Giriş yapmış kullanıcının güncel bilgilerini döndürür. */
  async getProfile(userId: string): Promise<PublicUser> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı.');
    }
    return user;
  }

  // ---------------------------------------------------------------
  // Yardımcı (private) metotlar
  // ---------------------------------------------------------------

  private async issueTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<Tokens> {
    const payload: JwtPayload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('jwt.accessSecret'),
        expiresIn: this.config.get<string>('jwt.accessExpiresIn'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('jwt.refreshSecret'),
        expiresIn: this.config.get<string>('jwt.refreshExpiresIn'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async persistRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hash = await this.hashing.hash(refreshToken);
    await this.users.setRefreshTokenHash(userId, hash);
  }
}
