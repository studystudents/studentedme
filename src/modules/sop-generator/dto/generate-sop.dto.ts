import { IsString, IsNumber, IsBoolean, IsOptional, IsIn, Min, Max } from 'class-validator';

export class GenerateSopDto {
  // Student profile
  @IsString()
  nationality: string;

  @IsIn(['BACHELOR', 'MASTER', 'PHD'])
  programType: 'BACHELOR' | 'MASTER' | 'PHD';

  @IsString()
  fieldOfStudy: string;

  @IsString()
  targetUniversity: string;

  @IsString()
  targetCountry: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  gpa: number;

  @IsNumber()
  gpaScale: number;

  @IsOptional()
  @IsString()
  undergradUniversity?: string;

  // Scores
  @IsOptional()
  @IsNumber()
  ielts?: number;

  @IsOptional()
  @IsNumber()
  toefl?: number;

  // Experience
  @IsNumber()
  @Min(0)
  publications: number;

  @IsNumber()
  @Min(0)
  researchExperienceYears: number;

  @IsNumber()
  @Min(0)
  internships: number;

  @IsNumber()
  @Min(0)
  workExperienceYears: number;

  // Achievements
  @IsBoolean()
  olympiadWinner: boolean;

  @IsNumber()
  @Min(0)
  hackathonWins: number;

  @IsNumber()
  @Min(0)
  githubStars: number;

  @IsOptional()
  @IsString()
  awards?: string;

  @IsOptional()
  @IsString()
  extracurricular?: string;

  // Letter customization
  @IsIn(['formal', 'personal', 'research-focused'])
  tone: 'formal' | 'personal' | 'research-focused';

  @IsIn(['en', 'ru'])
  language: 'en' | 'ru';

  @IsIn([400, 500, 600])
  wordCount: 400 | 500 | 600;

  @IsOptional()
  @IsString()
  keyHighlights?: string;

  @IsOptional()
  @IsString()
  careerGoals?: string;
}
