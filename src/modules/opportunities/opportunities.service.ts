import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OpportunityType, DegreeLevel } from '@prisma/client';

@Injectable()
export class OpportunitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: {
    type?: OpportunityType;
    country?: string;
    degreeLevel?: DegreeLevel;
    fieldOfStudy?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      type,
      country,
      degreeLevel,
      fieldOfStudy,
      search,
      page = 1,
      limit = 20,
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (country) {
      where.country = country;
    }

    if (degreeLevel) {
      where.degreeLevel = degreeLevel;
    }

    if (fieldOfStudy) {
      where.fieldOfStudy = {
        contains: fieldOfStudy,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { fieldOfStudy: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [opportunities, total] = await Promise.all([
      this.prisma.opportunity.findMany({
        where,
        skip,
        take: limit,
        include: {
          institution: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              country: true,
              city: true,
              ranking: true,
            },
          },
        },
        orderBy: [
          { institution: { ranking: 'asc' } },
          { name: 'asc' },
        ],
      }),
      this.prisma.opportunity.count({ where }),
    ]);

    return {
      data: opportunities,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.opportunity.findUnique({
      where: { id },
      include: {
        institution: true,
        applications: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.opportunity.findFirst({
      where: {
        slug,
      },
      include: {
        institution: true,
      },
    });
  }

  async getStats() {
    const [programs, scholarships, countries, institutions] = await Promise.all([
      this.prisma.opportunity.count({
        where: { type: 'PROGRAM' },
      }),
      this.prisma.opportunity.count({
        where: { type: 'SCHOLARSHIP' },
      }),
      this.prisma.opportunity.findMany({
        select: { country: true },
        distinct: ['country'],
      }),
      this.prisma.institution.count(),
    ]);

    return {
      programs,
      scholarships,
      countries: countries.length,
      institutions,
    };
  }
}
