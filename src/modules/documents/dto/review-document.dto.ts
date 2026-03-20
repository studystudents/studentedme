import { IsEnum, IsString, IsOptional } from 'class-validator';
import { DocumentReviewStatus } from '@prisma/client';

export class ReviewDocumentDto {
  @IsEnum(DocumentReviewStatus)
  status: DocumentReviewStatus;

  @IsString()
  @IsOptional()
  comments?: string;
}
