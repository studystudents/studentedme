import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        student: true,
        staff: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        staff: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: {
          student: true,
          staff: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users.map(({ passwordHash, ...user }) => user),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async updateStudentProfile(userId: string, dto: import('./dto/update-student-profile.dto').UpdateStudentProfileDto) {
    const { firstName, lastName, phone, ...studentData } = dto;

    const userUpdate: any = {};
    if (firstName) userUpdate.firstName = firstName;
    if (lastName) userUpdate.lastName = lastName;
    if (phone !== undefined) userUpdate.phone = phone;

    const studentUpdate: any = {};
    if (studentData.dateOfBirth) studentUpdate.dateOfBirth = new Date(studentData.dateOfBirth);
    if (studentData.nationality !== undefined) studentUpdate.nationality = studentData.nationality;
    if (studentData.countryOfResidence !== undefined) studentUpdate.countryOfResidence = studentData.countryOfResidence;
    if (studentData.cityOfResidence !== undefined) studentUpdate.cityOfResidence = studentData.cityOfResidence;
    if (studentData.address !== undefined) studentUpdate.address = studentData.address;
    if (studentData.passportNumber !== undefined) studentUpdate.passportNumber = studentData.passportNumber;
    if (studentData.passportExpiry) studentUpdate.passportExpiry = new Date(studentData.passportExpiry);
    if (studentData.emergencyContactName !== undefined) studentUpdate.emergencyContactName = studentData.emergencyContactName;
    if (studentData.emergencyContactPhone !== undefined) studentUpdate.emergencyContactPhone = studentData.emergencyContactPhone;

    // Check if profile completeness needs an update
    // Simple mock logic for MVP: if all basic fields are there, 100%
    if (Object.keys(studentUpdate).length > 0) {
      studentUpdate.profileCompleteness = 100;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...userUpdate,
        ...(Object.keys(studentUpdate).length > 0 && {
          student: {
            update: studentUpdate,
          },
        }),
      },
      include: {
        student: true,
      },
    });
  }
}
