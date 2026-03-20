import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserType } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already registered');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(dto.password, 12);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
          userType: dto.userType || UserType.STUDENT,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
        },
      });

      // If student, create student profile
      if (user.userType === UserType.STUDENT) {
        await this.prisma.student.create({
          data: {
            userId: user.id,
            dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : new Date('2000-01-01'), // Ensure Date object
            nationality: dto.nationality || 'Unknown',
            countryOfResidence: dto.countryOfResidence || 'Unknown',
          },
        });
      }

      this.logger.log(`New user registered: ${user.email}`);

      // Generate tokens
      const tokens = await this.generateTokens(user);

      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Registration failed for ${dto.email}: ${err.message}`, err.stack);
      throw error;
    }
  }

  async login(dto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    this.logger.log(`User logged in: ${user.email}`);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshTokens(userId: string | undefined, refreshToken: string) {
    // Find session
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || (userId && session.userId !== userId)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if session expired
    if (new Date() > session.expiresAt) {
      await this.prisma.session.delete({ where: { id: session.id } });
      throw new UnauthorizedException('Refresh token expired');
    }

    // Check if session revoked
    if (session.revokedAt) {
      throw new UnauthorizedException('Session has been revoked');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(session.user);

    // Delete old session
    await this.prisma.session.delete({ where: { id: session.id } });

    return tokens;
  }

  async logout(userId: string, refreshToken: string) {
    // Revoke session
    await this.prisma.session.updateMany({
      where: {
        userId,
        refreshToken,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    this.logger.log(`User logged out: ${userId}`);
  }

  private async generateTokens(user: any) {
    // Get user permissions
    const permissions = await this.getUserPermissions(user);

    // Generate access token (short-lived)
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        userType: user.userType,
        permissions,
      },
      {
        expiresIn: '15m',
      },
    );

    // Generate refresh token (long-lived)
    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
        type: 'refresh',
      },
      {
        expiresIn: '30d',
      },
    );

    // Store refresh token in database
    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  private async getUserPermissions(user: any): Promise<string[]> {
    if (user.userType === UserType.STUDENT) {
      return [
        'profile:read',
        'profile:update',
        'documents:upload',
        'documents:read:own',
        'applications:read:own',
        'applications:create',
      ];
    }

    if (user.userType === UserType.STAFF) {
      const staff = await this.prisma.staff.findUnique({
        where: { userId: user.id },
        include: { roles: { include: { role: true } } },
      });

      if (!staff) return [];

      // Superadmin has all permissions
      if (staff.staffRole === 'SUPERADMIN') {
        return ['*'];
      }

      // Collect permissions from all assigned roles
      const permissions = new Set<string>();
      for (const roleAssignment of staff.roles) {
        const rolePermissions = roleAssignment.role.permissions as string[];
        rolePermissions.forEach(p => permissions.add(p));
      }

      return Array.from(permissions);
    }

    return [];
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.status !== 'ACTIVE') {
      return null;
    }

    return this.sanitizeUser(user);
  }
}
