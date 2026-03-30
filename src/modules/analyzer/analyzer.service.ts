import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { AnalyzeProfileDto } from './dto/analyze-profile.dto';

interface AdmissionProbability {
  top10: number;
  top50: number;
  top100: number;
  top200: number;
}

interface RecommendedProgram {
  university: string;
  program: string;
  country: string;
  matchScore: number;
  reason: string;
}

export interface AnalysisResult {
  overallScore: number;
  admissionProbability: AdmissionProbability;
  strengths: string[];
  weaknesses: string[];
  recommendedPrograms: RecommendedProgram[];
  actionItems: string[];
  profileSummary: string;
  competitiveAnalysis: string;
}

@Injectable()
export class AnalyzerService {
  private readonly logger = new Logger(AnalyzerService.name);
  private readonly client: Groq;

  constructor(private readonly config: ConfigService) {
    const apiKey = process.env.GROQ_API_KEY || this.config.get<string>('GROQ_API_KEY');
    if (!apiKey) {
      this.logger.warn('GROQ_API_KEY is not set. AI analysis will not work.');
    } else {
      this.logger.log(`GROQ_API_KEY loaded (starts with: ${apiKey.substring(0, 8)}...)`);
    }
    this.client = new Groq({ apiKey: apiKey || 'placeholder' });
  }

  async analyzeProfile(dto: AnalyzeProfileDto): Promise<AnalysisResult> {
    const normalizedGpa = dto.gpaScale === 5.0
      ? (dto.gpa / 5.0) * 4.0
      : dto.gpa;

    const languageScore = dto.ielts
      ? `IELTS: ${dto.ielts}`
      : dto.toefl
      ? `TOEFL: ${dto.toefl}`
      : 'No language score provided';

    const greSection = dto.greVerbal || dto.greQuant
      ? `GRE: Verbal ${dto.greVerbal ?? 'N/A'}, Quant ${dto.greQuant ?? 'N/A'}, AWA ${dto.greAwa ?? 'N/A'}`
      : 'No GRE scores provided';

    const userPrompt = `
Please analyze the following student profile and provide a comprehensive admissions assessment.

## Student Academic Profile

**Degree Sought:** ${dto.programType} in ${dto.fieldOfStudy}
**GPA:** ${dto.gpa} / ${dto.gpaScale} (normalized to 4.0 scale: ${normalizedGpa.toFixed(2)})
**Language Proficiency:** ${languageScore}
**${greSection}**

## Research & Professional Background
- Publications: ${dto.publications}
- Research Experience: ${dto.researchExperienceYears} year(s)
- Internships completed: ${dto.internships}
- Work Experience: ${dto.workExperienceYears} year(s)

## Achievements & Technical Skills
- Olympiad Winner: ${dto.olympiadWinner ? 'Yes' : 'No'}
- Hackathon Wins: ${dto.hackathonWins}
- Open Source Projects: ${dto.openSourceProjects}
- GitHub Stars: ${dto.githubStars}
- Kaggle Rank: ${dto.kaggleRank || 'None'}

## Application Materials
- Recommendation Letters: ${dto.recommendationLetters} / 3
- Statement of Purpose Quality: ${dto.sopQuality}
- Extracurricular Activities: ${dto.extracurricular}

## Additional Profile Details
- Volunteer Hours: ${dto.volunteerHours}
- Awards Count: ${dto.awardsCount}
- Languages Spoken: ${dto.languagesSpoken}
- Leadership Roles: ${dto.leadershipRoles}
- Undergraduate University Rank: ${dto.undergradUniversityRank || 'Not specified'}
- Target University Rank: ${dto.targetUniversityRank || 'Not specified'}
- Target Country: ${dto.targetCountry || 'Not specified'}

## Reference Statistics (from historical dataset)
- Average GPA for accepted Master's students: 3.55 / 4.0
- Average GPA for accepted PhD students: 3.82 / 4.0
- Students with Excellent SOP have ~75% acceptance rate at top-100 universities
- Students with 2+ publications have significantly higher PhD admission rates
- IELTS >= 7.0 or TOEFL >= 100 is typically required for top-50 universities
- Students with 3 strong recommendation letters outperform peers by ~30%

Based on this profile, provide a detailed admissions analysis. Respond ONLY with valid JSON matching this exact structure:
{
  "overallScore": <integer 0-100>,
  "admissionProbability": {
    "top10": <integer 0-100>,
    "top50": <integer 0-100>,
    "top100": <integer 0-100>,
    "top200": <integer 0-100>
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendedPrograms": [
    {"university": "University Name", "program": "Program Name", "country": "Country", "matchScore": 85, "reason": "Brief reason why this is a good fit"},
    {"university": "University Name", "program": "Program Name", "country": "Country", "matchScore": 75, "reason": "Brief reason"},
    {"university": "University Name", "program": "Program Name", "country": "Country", "matchScore": 65, "reason": "Brief reason"}
  ],
  "actionItems": ["Specific action 1", "Specific action 2", "Specific action 3"],
  "profileSummary": "2-3 sentence summary of the student's profile and overall competitiveness.",
  "competitiveAnalysis": "A paragraph comparing this student to typical accepted students at their target tier of universities."
}
`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 4096,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: `You are an expert university admissions counselor with 20+ years of experience.
Analyze the student's academic profile and provide detailed, actionable feedback.
You must respond in valid JSON format only. Do not include any text outside of the JSON object.`,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      let jsonText = completion.choices[0]?.message?.content || '';

      if (!jsonText) {
        throw new Error('No text response received from Claude');
      }

      // Clean up potential markdown code blocks
      jsonText = jsonText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();

      const result: AnalysisResult = JSON.parse(jsonText);

      // Validate and sanitize the result
      result.overallScore = Math.min(100, Math.max(0, Math.round(result.overallScore)));
      result.admissionProbability.top10 = Math.min(100, Math.max(0, Math.round(result.admissionProbability.top10)));
      result.admissionProbability.top50 = Math.min(100, Math.max(0, Math.round(result.admissionProbability.top50)));
      result.admissionProbability.top100 = Math.min(100, Math.max(0, Math.round(result.admissionProbability.top100)));
      result.admissionProbability.top200 = Math.min(100, Math.max(0, Math.round(result.admissionProbability.top200)));

      return result;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to analyze profile: ${errMsg}`);
      if (error instanceof SyntaxError) {
        throw new InternalServerErrorException(`Failed to parse AI response: ${errMsg}`);
      }
      throw new InternalServerErrorException(`AI analysis failed: ${errMsg}`);
    }
  }
}
