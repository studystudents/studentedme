import { IsNumber, IsString, IsOptional, IsEnum, IsBoolean, Min, Max } from 'class-validator';

export enum ProgramType {
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  PHD = 'PHD',
}

export enum SopQuality {
  WEAK = 'Weak',
  AVERAGE = 'Average',
  GOOD = 'Good',
  EXCELLENT = 'Excellent',
}

export class AnalyzeProfileDto {
  @IsNumber() gpa: number;
  @IsNumber() gpaScale: number;
  @IsEnum(ProgramType) programType: ProgramType;
  @IsString() fieldOfStudy: string;
  @IsOptional() @IsNumber() ielts?: number;
  @IsOptional() @IsNumber() toefl?: number;
  @IsOptional() @IsNumber() greVerbal?: number;
  @IsOptional() @IsNumber() greQuant?: number;
  @IsOptional() @IsNumber() greAwa?: number;
  @IsNumber() publications: number;
  @IsNumber() researchExperienceYears: number;
  @IsNumber() internships: number;
  @IsNumber() workExperienceYears: number;
  @IsBoolean() olympiadWinner: boolean;
  @IsNumber() hackathonWins: number;
  @IsNumber() openSourceProjects: number;
  @IsNumber() githubStars: number;
  @IsOptional() @IsString() kaggleRank?: string;
  @IsNumber() @Min(0) @Max(3) recommendationLetters: number;
  @IsEnum(SopQuality) sopQuality: SopQuality;
  @IsNumber() extracurricular: number;
  @IsOptional() @IsString() undergradUniversityRank?: string;
  @IsOptional() @IsString() targetUniversityRank?: string;
  @IsOptional() @IsString() targetCountry?: string;
  @IsNumber() volunteerHours: number;
  @IsNumber() awardsCount: number;
  @IsNumber() languagesSpoken: number;
  @IsNumber() leadershipRoles: number;
}
