import { Controller, Post, Body, UseGuards, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { ReviewDocumentDto } from './dto/review-document.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('documents')
@Controller({ path: 'documents', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user documents' })
  async findAll(@Query() filters: any, @CurrentUser() user: any) {
    return this.documentsService.findAll(user.userId, user.userType, filters);
  }

  @Post('upload-url')
  @ApiOperation({ summary: 'Request presigned upload URL' })
  async requestUploadUrl(@Body() dto: CreateDocumentDto, @CurrentUser() user: any) {
    return this.documentsService.requestUploadUrl(user.userId, dto);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm file upload' })
  async confirmUpload(
    @Param('id') id: string,
    @Body() body: { fileKey: string; versionId: string },
    @CurrentUser() user: any,
  ) {
    return this.documentsService.confirmUpload(id, user.userId, body.fileKey, body.versionId);
  }

  @Get(':id/download-url')
  @ApiOperation({ summary: 'Get presigned download URL' })
  async getDownloadUrl(@Param('id') id: string, @CurrentUser() user: any) {
    return this.documentsService.getDownloadUrl(id, user.userId, user.userType);
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Review a document (Staff only)' })
  async review(
    @Param('id') id: string,
    @Body() dto: ReviewDocumentDto,
    @CurrentUser() user: any,
  ) {
    return this.documentsService.review(id, dto, user.userId);
  }
}
