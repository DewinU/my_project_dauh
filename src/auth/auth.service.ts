import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(user: LoginDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      foundUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwt = this.jwtService.sign({
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
      tenantId: foundUser.tenantId,
    });

    return {
      access_token: jwt,
    };
  }
}
