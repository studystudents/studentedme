import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SopGeneratorService } from './sop-generator.service';
import { GenerateSopDto } from './dto/generate-sop.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('sop-generator')
@Controller({ path: 'sop-generator', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SopGeneratorController {
  constructor(private readonly sopGeneratorService: SopGeneratorService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a personalized Statement of Purpose using AI' })
  async generate(@Body() dto: GenerateSopDto) {
    return this.sopGeneratorService.generateSop(dto);
  }
}
