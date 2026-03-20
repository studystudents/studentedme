import { Controller, Post, Body, UseGuards, Get, Param, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('applications')
@Controller({ path: 'applications', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new application' })
  async create(@Body() dto: CreateApplicationDto, @CurrentUser() user: any) {
    return this.applicationsService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all applications for the current user' })
  async findAll(@Query() filters: any, @CurrentUser() user: any) {
    return this.applicationsService.findAll(user.userId, user.userType, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific application details' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationsService.findOne(id, user.userId, user.userType);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Change application status (Staff/Admin)' })
  async changeStatus(
    @Param('id') id: string,
    @Body() dto: ChangeStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.applicationsService.changeStatus(id, dto, user.userId);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit an application for review' })
  async submit(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationsService.submit(id, user.userId);
  }
}
