import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OpportunitiesService } from './opportunities.service';
import { OpportunityType, DegreeLevel } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('opportunities')
@Controller({ path: 'opportunities', version: '1' })
export class OpportunitiesController {
  constructor(private opportunitiesService: OpportunitiesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all opportunities (programs & scholarships)' })
  @ApiQuery({ name: 'type', required: false, enum: OpportunityType })
  @ApiQuery({ name: 'country', required: false })
  @ApiQuery({ name: 'degreeLevel', required: false, enum: DegreeLevel })
  @ApiQuery({ name: 'fieldOfStudy', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('type') type?: OpportunityType,
    @Query('country') country?: string,
    @Query('degreeLevel') degreeLevel?: DegreeLevel,
    @Query('fieldOfStudy') fieldOfStudy?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.opportunitiesService.findAll({
      type,
      country,
      degreeLevel,
      fieldOfStudy,
      search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Get opportunities statistics' })
  async getStats() {
    return this.opportunitiesService.getStats();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get opportunity by ID' })
  async findOne(@Param('id') id: string) {
    return this.opportunitiesService.findOne(id);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get opportunity by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.opportunitiesService.findBySlug(slug);
  }
}
