import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const nationalities = ['Kazakh', 'Uzbek', 'Kyrgyz', 'Russian', 'Ukrainian', 'Turkish', 'Chinese', 'Indian', 'Nigerian', 'Brazilian', 'Iranian', 'Pakistani', 'Egyptian', 'Vietnamese', 'Indonesian'];
const fields = ['Data Science', 'Computer Science', 'Machine Learning', 'Business Analytics', 'Economics', 'Finance', 'Electrical Engineering', 'Bioinformatics', 'Robotics', 'Cybersecurity', 'Artificial Intelligence', 'Software Engineering'];
const universities = ['TU Munich', 'ETH Zurich', 'Delft University', 'University of Bologna', 'Lund University', 'McGill University', 'UCL', 'LSE', 'KU Leuven', 'University of Amsterdam', 'Sciences Po', 'Politecnico di Milano', 'University of Melbourne', 'University of Toronto'];
const countries = ['Germany', 'Switzerland', 'Netherlands', 'Italy', 'Sweden', 'Canada', 'UK', 'Belgium', 'France', 'Australia'];
const programTypes = ['BACHELOR', 'MASTER', 'PHD'];
const sopQualities = ['Weak', 'Average', 'Good', 'Excellent'];
const undergradUnis = ['Nazarbayev University', 'KIMEP University', 'Al-Farabi University', 'Tashkent State University', 'Moscow State University', 'Saint Petersburg University', 'Kyiv Polytechnic', 'Bogazici University', 'Tsinghua University', 'IIT Delhi', 'University of Lagos', 'University of São Paulo', 'Unranked local university'];

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomFloat(min, max) { return Math.round((Math.random() * (max - min) + min) * 10) / 10; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateProfile(id) {
  const quality = Math.random();
  let sopQuality, gpa, ielts, publications, accepted;

  if (quality < 0.25) {
    sopQuality = 'Weak'; gpa = randomFloat(2.4, 3.0); ielts = randomFloat(5.5, 6.5);
    publications = 0; accepted = Math.random() < 0.15;
  } else if (quality < 0.55) {
    sopQuality = 'Average'; gpa = randomFloat(3.0, 3.4); ielts = randomFloat(6.5, 7.2);
    publications = randomInt(0, 1); accepted = Math.random() < 0.35;
  } else if (quality < 0.80) {
    sopQuality = 'Good'; gpa = randomFloat(3.4, 3.7); ielts = randomFloat(7.0, 7.8);
    publications = randomInt(0, 2); accepted = Math.random() < 0.65;
  } else {
    sopQuality = 'Excellent'; gpa = randomFloat(3.7, 4.0); ielts = randomFloat(7.5, 9.0);
    publications = randomInt(1, 4); accepted = Math.random() < 0.85;
  }

  const nationality = pick(nationalities);
  const field = pick(fields);
  const university = pick(universities);
  const country = pick(countries);
  const programType = pick(programTypes);
  const undergrad = pick(undergradUnis);

  const awardsPool = ['Dean\'s List 2022', 'Dean\'s List 2023', 'Best Thesis Award', 'National Scholarship', 'Presidential Scholarship', 'Olympiad Bronze Medal', 'Hackathon 1st Place', 'Research Grant Recipient'];
  const extraPool = ['AI Club president', 'Math olympiad coach', 'Student government member', 'Debate club', 'Volunteer tutor', 'Chess club captain', 'Research assistant'];

  const numAwards = gpa > 3.6 ? randomInt(1, 3) : randomInt(0, 1);
  const awards = [];
  for (let i = 0; i < numAwards; i++) {
    const a = pick(awardsPool);
    if (!awards.includes(a)) awards.push(a);
  }

  const numExtra = randomInt(0, 2);
  const extra = [];
  for (let i = 0; i < numExtra; i++) {
    const e = pick(extraPool);
    if (!extra.includes(e)) extra.push(e);
  }

  return {
    id,
    profile: {
      nationality,
      gpa,
      gpa_scale: 4.0,
      program_type: programType,
      field_of_study: field,
      target_university: university,
      target_country: country,
      ielts,
      publications,
      research_experience_years: randomInt(0, 3),
      internships: randomInt(0, 4),
      work_experience_years: randomInt(0, 3),
      olympiad_winner: Math.random() < 0.15,
      hackathon_wins: randomInt(0, 3),
      github_stars: randomInt(0, 2000),
      sop_quality: sopQuality,
      languages_spoken: randomInt(1, 4),
      undergrad_university: undergrad,
      volunteer_hours: randomInt(0, 200),
      awards,
      extracurricular: extra,
    },
    accepted,
  };
}

async function generateLetter(entry) {
  const p = entry.profile;

  const prompt = `Write a university Statement of Purpose (motivation letter) for this student profile.

Profile:
- Nationality: ${p.nationality}
- Program: ${p.program_type} in ${p.field_of_study} at ${p.target_university}, ${p.target_country}
- GPA: ${p.gpa}/4.0 from ${p.undergrad_university}
- IELTS: ${p.ielts}
- Publications: ${p.publications}
- Research experience: ${p.research_experience_years} years
- Internships: ${p.internships}
- Work experience: ${p.work_experience_years} years
- Hackathon wins: ${p.hackathon_wins}
- GitHub stars: ${p.github_stars}
- Languages spoken: ${p.languages_spoken}
- Volunteer hours: ${p.volunteer_hours}
- Awards: ${p.awards.length > 0 ? p.awards.join(', ') : 'none'}
- Extracurricular: ${p.extracurricular.length > 0 ? p.extracurricular.join(', ') : 'none'}
- SOP quality target: ${p.sop_quality}

Quality guidelines:
- Weak: generic, grammar errors, no specific story, vague goals, 150-200 words
- Average: structured but generic, mentions university name, 250-350 words
- Good: specific details, clear motivation, why this university, 350-450 words
- Excellent: compelling personal story, specific research interests, clear career goals, why THIS program specifically, strong opening hook, 450-600 words

Write ONLY the letter text (starting with "Dear Admissions Committee," or similar). No JSON, no extra text.`;

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1024,
    temperature: 0.8,
    messages: [{ role: 'user', content: prompt }],
  });

  return completion.choices[0]?.message?.content?.trim() || '';
}

async function main() {
  const outputPath = path.join(process.cwd(), 'data', 'sop_dataset.json');

  // Load existing 3 entries
  const existing = [
    { id: 1, profile: { nationality: 'Kazakh', gpa: 3.8, gpa_scale: 4.0, program_type: 'MASTER', field_of_study: 'Data Science', target_university: 'TU Munich', target_country: 'Germany', ielts: 7.5, publications: 1, research_experience_years: 1, internships: 2, work_experience_years: 1, olympiad_winner: false, hackathon_wins: 1, github_stars: 110, sop_quality: 'Excellent', languages_spoken: 3, undergrad_university: 'Nazarbayev University', volunteer_hours: 60, awards: ["Dean's List 2023"], extracurricular: ['AI Club president'] }, motivation_letter: "Dear Admissions Committee,\n\nGrowing up in Kazakhstan, I witnessed how data-driven decisions are reshaping industries. During my studies at Nazarbayev University, where I achieved a GPA of 3.8/4.0, I developed a strong interest in machine learning applications for public services. My undergraduate thesis, which resulted in one publication, explored predictive modeling for urban mobility.\n\nThrough two internships and one year of professional experience, I applied data science techniques in real-world environments. I also participated in hackathons, winning one competition focused on predictive analytics.\n\nTU Munich stands out to me because of its strong emphasis on applied machine learning and its collaboration with industry. I am particularly interested in research on scalable data systems.\n\nMy goal is to contribute to smart city development in Central Asia.\n\nSincerely,\nAruzhan", accepted: true, quality_score: 9 },
    { id: 2, profile: { nationality: 'Uzbek', gpa: 3.1, gpa_scale: 4.0, program_type: 'MASTER', field_of_study: 'Economics', target_university: 'LSE', target_country: 'UK', ielts: 6.5, publications: 0, research_experience_years: 0, internships: 1, work_experience_years: 0, olympiad_winner: false, hackathon_wins: 0, github_stars: 5, sop_quality: 'Weak', languages_spoken: 2, undergrad_university: 'Tashkent State University', volunteer_hours: 10, awards: [], extracurricular: [] }, motivation_letter: "Dear Sir or Madam,\n\nI want study Economics in your university. My GPA is 3.1 and I studied economics subjects. I think LSE is very famous and good ranking so I apply. I did one internship in local bank.\n\nI like economics because it is interesting and useful. I want improve my knowledge and get better job in future.\n\nI don't have research but I am hardworking student.\n\nThank you for consider my application.\n\nBest regards,\nRahim", accepted: false, quality_score: 4 },
    { id: 3, profile: { nationality: 'Chinese', gpa: 3.6, gpa_scale: 4.0, program_type: 'MASTER', field_of_study: 'Computer Science', target_university: 'ETH Zurich', target_country: 'Switzerland', ielts: 7.0, publications: 0, research_experience_years: 1, internships: 2, work_experience_years: 0, olympiad_winner: false, hackathon_wins: 0, github_stars: 80, sop_quality: 'Good', languages_spoken: 2, undergrad_university: 'Tsinghua University', volunteer_hours: 20, awards: ['Scholarship Award'], extracurricular: ['Coding club'] }, motivation_letter: "Dear Admissions Committee,\n\nI am applying for the Master's in Computer Science at ETH Zurich. I graduated from Tsinghua University with GPA 3.6/4.0. During my studies, I gained strong programming skills and completed projects in algorithms and distributed systems.\n\nI completed two internships where I worked on backend systems. I also have one year of research experience assisting a professor.\n\nETH Zurich is attractive because of its global reputation and strong research output.\n\nI hope to deepen my technical knowledge and work in software engineering.\n\nSincerely,\nLi Wei", accepted: true, quality_score: 7 },
  ];

  const dataset = [...existing];
  const total = 200;

  console.log(`Starting generation of ${total - existing.length} new entries...\n`);

  for (let i = existing.length + 1; i <= total; i++) {
    try {
      process.stdout.write(`Generating entry ${i}/${total}...`);
      const entry = generateProfile(i);
      const letter = await generateLetter(entry);
      const qualityMap = { Weak: randomInt(2, 4), Average: randomInt(5, 6), Good: randomInt(7, 8), Excellent: randomInt(9, 10) };
      entry.motivation_letter = letter;
      entry.quality_score = qualityMap[entry.profile.sop_quality];
      dataset.push(entry);
      console.log(` ✓ (${entry.profile.sop_quality}, ${entry.accepted ? 'accepted' : 'rejected'})`);

      // Save progress every 10 entries
      if (i % 10 === 0) {
        fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2));
        console.log(`  → Saved ${dataset.length} entries to sop_dataset.json\n`);
      }

      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`  ✗ Error on entry ${i}: ${err.message}`);
      await new Promise(r => setTimeout(r, 2000));
      i--; // retry
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2));
  console.log(`\n✅ Done! Generated ${dataset.length} entries → data/sop_dataset.json`);
}

main();
