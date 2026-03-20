import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsDateString, Matches } from 'class-validator';
import { UserType } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'Phone must be in E.164 format (e.g., +1234567890)' })
  phone?: string;

  @ApiProperty({ enum: UserType, default: UserType.STUDENT, required: false })
  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;

  // Student-specific fields (required if userType is STUDENT)
  @ApiProperty({ example: '2000-01-15', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ example: 'US', required: false })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ example: 'US', required: false })
  @IsOptional()
  @IsString()
  countryOfResidence?: string;
}
