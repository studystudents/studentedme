import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { GenerateSopDto } from './dto/generate-sop.dto';

export interface SopResult {
  letter: string;
  wordCount: number;
  language: string;
}

const FEW_SHOT_EXAMPLE = `EXAMPLE OF AN EXCELLENT STATEMENT OF PURPOSE (Economics / Master's / LSE):

"Dear Admissions Committee,

The moment I watched my father struggle to navigate complex financial documents — documents that would determine our family's economic future — I understood that financial literacy is not merely an academic pursuit; it is a lifeline. Growing up in Kazakhstan, where economic transition has created both opportunity and uncertainty, I saw firsthand how analytical skills could transform lives. This conviction has guided my academic journey and brought me to pursue a Master's in Economics at LSE.

At Nazarbayev University, I graduated with a GPA of 3.9/4.0, where my coursework in econometrics and development economics gave me theoretical frameworks to analyze the policy challenges I had observed. My undergraduate thesis — a quantitative analysis of microfinance impact in rural Kazakhstan — was subsequently published in a regional economics journal, marking my first contribution to academic discourse. Through two internships at Kazakhstan Development Bank and Deloitte Almaty, I translated this theoretical knowledge into practical impact, building financial models that informed multi-million dollar investment decisions.

What draws me specifically to LSE is the intersection of rigorous economic theory and policy application that defines your program. Professor [Name]'s research on emerging market financial systems directly aligns with my own interests, and I am eager to contribute to this work. The MSc Economics program's emphasis on econometric methods will allow me to build on my existing quantitative foundation while developing the sophisticated modeling techniques required for high-level policy analysis.

Upon completing my degree, I aim to return to Kazakhstan to work with the government's economic advisory council, bringing evidence-based approaches to fiscal and monetary policy. In the longer term, I envision pursuing doctoral research on financial inclusion in post-Soviet economies.

I am confident that my analytical background, research experience, and genuine commitment to economic development make me a strong candidate for this program. I look forward to contributing to LSE's intellectual community.

Sincerely,
[Name]"

Key qualities of this excellent SOP:
- Opens with a personal, emotional hook (not "I am applying to...")
- Connects personal background to academic/career trajectory
- Cites specific achievements with concrete details (GPA, publication, named internship companies)
- References specific program features and professors at the target university
- States clear, specific career goals
- Written in authentic first-person voice
- Flows naturally from personal story → academic background → target university fit → future goals`;

@Injectable()
export class SopGeneratorService {
  private readonly logger = new Logger(SopGeneratorService.name);
  private readonly client: Groq;

  constructor(private readonly config: ConfigService) {
    const apiKey = process.env.GROQ_API_KEY || this.config.get<string>('GROQ_API_KEY');
    if (!apiKey) {
      this.logger.warn('GROQ_API_KEY is not set. SOP generation will not work.');
    } else {
      this.logger.log(`GROQ_API_KEY loaded (starts with: ${apiKey.substring(0, 8)}...)`);
    }
    this.client = new Groq({ apiKey: apiKey || 'placeholder' });
  }

  async generateSop(dto: GenerateSopDto): Promise<SopResult> {
    const normalizedGpa = dto.gpaScale === 5.0
      ? (dto.gpa / 5.0) * 4.0
      : dto.gpa;

    const languageScore = dto.ielts
      ? `IELTS: ${dto.ielts}`
      : dto.toefl
      ? `TOEFL: ${dto.toefl}`
      : 'Not specified';

    const toneInstructions = {
      formal: 'Use a formal, professional tone. Keep sentences precise and structured. Suitable for business or law programs.',
      personal: 'Use a warm, personal tone with genuine voice. Balance professionalism with authentic storytelling.',
      'research-focused': 'Use an academic, research-oriented tone. Emphasize intellectual curiosity, methodology interests, and scholarly goals.',
    };

    const languageInstructions = dto.language === 'ru'
      ? 'Write the ENTIRE letter in Russian (Русский язык). Use proper academic Russian style.'
      : 'Write the ENTIRE letter in English.';

    const systemPrompt = `You are an expert university admissions counselor who has helped thousands of students get into top universities. You write outstanding Statements of Purpose that are personal, compelling, and specific. Your letters always:
1. Open with a memorable hook (personal story, not "I am applying to...")
2. Connect personal background to academic journey
3. Mention specific professors, labs, or research areas at the target university
4. Show clear career goals
5. Are written in first person with authentic voice`;

    const userPrompt = `${FEW_SHOT_EXAMPLE}

---

Now write an outstanding Statement of Purpose (Motivation Letter) for the following student. Follow the same quality standards as the example above.

## Student Profile
- Nationality: ${dto.nationality}
- Undergraduate University: ${dto.undergradUniversity || 'Not specified'}
- GPA: ${dto.gpa} / ${dto.gpaScale} (normalized to 4.0 scale: ${normalizedGpa.toFixed(2)})
- Language Score: ${languageScore}

## Target Program
- University: ${dto.targetUniversity}
- Country: ${dto.targetCountry}
- Program Type: ${dto.programType}
- Field of Study: ${dto.fieldOfStudy}

## Research & Professional Experience
- Publications: ${dto.publications}
- Research Experience: ${dto.researchExperienceYears} year(s)
- Internships: ${dto.internships}
- Work Experience: ${dto.workExperienceYears} year(s)

## Achievements
- Olympiad Winner: ${dto.olympiadWinner ? 'Yes (national/international level)' : 'No'}
- Hackathon Wins: ${dto.hackathonWins}
- GitHub Stars: ${dto.githubStars}
${dto.awards ? `- Awards/Honors: ${dto.awards}` : ''}
${dto.extracurricular ? `- Extracurricular Activities: ${dto.extracurricular}` : ''}

## Student's Own Inputs
${dto.careerGoals ? `Career Goals: ${dto.careerGoals}` : 'Career goals not specified — infer from context and make them specific and compelling.'}
${dto.keyHighlights ? `Key aspects to emphasize: ${dto.keyHighlights}` : ''}

## Letter Requirements
- Tone: ${toneInstructions[dto.tone]}
- ${languageInstructions}
- Target word count: approximately ${dto.wordCount} words (±50 words)
- Do NOT use placeholder text like [Professor Name] — instead write naturally around it (e.g., "the faculty's work in X" or reference specific known research areas)
- Do NOT write anything outside the letter itself (no explanations, no metadata)

Write only the letter text, starting directly with the salutation or opening line.`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gemma2-9b-it',
        max_tokens: 2048,
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      const letter = completion.choices[0]?.message?.content?.trim() || '';

      if (!letter) {
        throw new Error('No text response received from AI');
      }

      const wordCount = letter.split(/\s+/).filter(Boolean).length;

      return {
        letter,
        wordCount,
        language: dto.language,
      };
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to generate SOP: ${errMsg}`);
      throw new InternalServerErrorException(`SOP generation failed: ${errMsg}`);
    }
  }
}
