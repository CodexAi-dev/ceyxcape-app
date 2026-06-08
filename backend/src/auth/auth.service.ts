import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      email,
      password: hashed,
      firstName: dto.first_name,
      lastName: dto.last_name,
      phone: dto.phone,
      role: 'user',
      status: 'active',
    });
    const saved = await this.userRepo.save(user);
    return this.buildResponse(saved);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email.trim().toLowerCase() },
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'phone', 'profilePic', 'role', 'status'],
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== 'active') throw new UnauthorizedException('Account is suspended');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.buildResponse(user);
  }

  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return this.sanitize(user);
  }

  private buildResponse(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: this.sanitize(user),
    };
  }

  // Map TypeORM camelCase entity → snake_case API shape the frontend expects.
  private sanitize(user: User) {
    return {
      id: user.id,
      email: user.email,
      username: user.username ?? null,
      first_name: user.firstName ?? null,
      last_name: user.lastName ?? null,
      phone: user.phone ?? null,
      profile_pic: user.profilePic ?? null,
      role: user.role,
      status: user.status,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}
