import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';

export class ChangeStatusDto {
  @ApiProperty({ enum: ApplicationStatus })
  @IsEnum(ApplicationStatus)
  newStatus: ApplicationStatus;

  @ApiProperty({ example: 'All documents approved', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
