import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ example: 'opp_cm3a8c9d0000108l6h2345678' })
  @IsString()
  opportunityId: string;

  @ApiProperty({ example: '2026-12-01T23:59:59Z', required: false })
  @IsOptional()
  @IsDateString()
  targetDeadline?: string;

  @ApiProperty({ example: 'counselor_cm3a8d9e0000208l6h3456789', required: false })
  @IsOptional()
  @IsString()
  counselorId?: string;
}
