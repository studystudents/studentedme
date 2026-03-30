import { Module } from '@nestjs/common';
import { SopGeneratorService } from './sop-generator.service';
import { SopGeneratorController } from './sop-generator.controller';

@Module({
  controllers: [SopGeneratorController],
  providers: [SopGeneratorService],
  exports: [SopGeneratorService],
})
export class SopGeneratorModule {}
