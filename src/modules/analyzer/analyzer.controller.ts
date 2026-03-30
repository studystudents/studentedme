import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyzerService } from './analyzer.service';
import { AnalyzeProfileDto } from './dto/analyze-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('analyzer')
@Controller({ path: 'analyzer', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyzerController {
  constructor(private readonly analyzerService: AnalyzerService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze student profile and get AI-powered admissions assessment' })
  async analyze(@Body() dto: AnalyzeProfileDto) {
    return this.analyzerService.analyzeProfile(dto);
  }
}
