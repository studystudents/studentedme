// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with demo data...');

  // Clear existing data (in development only!)
  console.log('Clearing existing data...');
  await prisma.$executeRaw`TRUNCATE TABLE "users", "institutions", "opportunities", "documents", "applications" RESTART IDENTITY CASCADE`;

  // Create demo users
  console.log('Creating demo users...');

  const hashedPassword = await bcrypt.hash('Demo123!', 12);

  const demoStudent = await prisma.user.create({
    data: {
      email: 'student@demo.com',
      passwordHash: hashedPassword,
      firstName: 'Alex',
      lastName: 'Johnson',
      userType: 'STUDENT',
      phone: '+1234567890',
      student: {
        create: {
          dateOfBirth: new Date('2002-05-15'),
          nationality: 'USA',
          countryOfResidence: 'United States',
        },
      },
    },
    include: {
      student: true,
    },
  });

  const demoCounselor = await prisma.user.create({
    data: {
      email: 'counselor@demo.com',
      passwordHash: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Williams',
      userType: 'STAFF',
      staff: {
        create: {
          staffRole: 'COUNSELOR',
          hireDate: new Date('2024-01-15'),
        },
      },
    },
    include: {
      staff: true,
    },
  });

  console.log('✅ Created demo users');

  // Create institutions
  console.log('Creating institutions...');

  const institutions = [
    {
      name: 'Harvard University',
      slug: 'harvard-university',
      country: 'USA',
      city: 'Cambridge',
      ranking: 1,
      logo: 'https://upload.wikimedia.org/wikipedia/en/2/29/Harvard_shield_wreath.svg',
    },
    {
      name: 'Stanford University',
      slug: 'stanford-university',
      country: 'USA',
      city: 'Stanford',
      ranking: 2,
      logo: 'https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/block-s-right.png',
    },
    {
      name: 'MIT',
      slug: 'mit',
      country: 'USA',
      city: 'Cambridge',
      ranking: 3,
      logo: 'https://web.mit.edu/graphicidentity/images/mit-logo.svg',
    },
    {
      name: 'University of Oxford',
      slug: 'university-of-oxford',
      country: 'UK',
      city: 'Oxford',
      ranking: 4,
      logo: 'https://www.ox.ac.uk/sites/files/oxford/styles/ow_large/public/field/field_image_main/Oxford%20logo.jpg',
    },
    {
      name: 'University of Cambridge',
      slug: 'university-of-cambridge',
      country: 'UK',
      city: 'Cambridge',
      ranking: 5,
      logo: 'https://www.cam.ac.uk/sites/www.cam.ac.uk/themes/fresh/images/interface/cambridge_university2.svg',
    },
    {
      name: 'ETH Zurich',
      slug: 'eth-zurich',
      country: 'Switzerland',
      city: 'Zurich',
      ranking: 6,
      logo: 'https://ethz.ch/etc/designs/ethz/img/header/ethz_logo_black.svg',
    },
    {
      name: 'University of Toronto',
      slug: 'university-of-toronto',
      country: 'Canada',
      city: 'Toronto',
      ranking: 18,
      logo: 'https://www.utoronto.ca/sites/default/files/UofT-Logo.svg',
    },
    {
      name: 'University of Melbourne',
      slug: 'university-of-melbourne',
      country: 'Australia',
      city: 'Melbourne',
      ranking: 14,
      logo: 'https://www.unimelb.edu.au/__data/assets/image/0006/3395535/logo.svg',
    },
    {
      name: 'Technical University of Munich',
      slug: 'technical-university-of-munich',
      country: 'Germany',
      city: 'Munich',
      ranking: 50,
      logo: 'https://www.tum.de/typo3conf/ext/tum_base_template/Resources/Public/Images/tum-logo.svg',
    },
    {
      name: 'National University of Singapore',
      slug: 'national-university-of-singapore',
      country: 'Singapore',
      city: 'Singapore',
      ranking: 11,
      logo: 'https://nus.edu.sg/images/default-source/identity-images/NUS_logo_full-horizontal.jpg',
    },
  ];

  const createdInstitutions = [];
  for (const inst of institutions) {
    const created = await prisma.institution.create({ data: inst });
    createdInstitutions.push(created);
  }

  console.log('✅ Created institutions');

  // Create university programs
  console.log('Creating university programs...');

  const programs = [
    // Computer Science programs
    {
      type: 'PROGRAM',
      institutionId: createdInstitutions[0].id,
      name: 'Master of Science in Computer Science',
      slug: 'harvard-ms-cs',
      country: 'USA',
      city: 'Cambridge',
      degreeLevel: 'MASTER',
      fieldOfStudy: 'Computer Science',
      durationMonths: 24,
      tuitionFee: 54768,
      currency: 'USD',
      description: 'Advanced CS program covering AI, ML, and distributed systems',
      intakeSeason: 'Fall 2026',
    },
    {
      type: 'PROGRAM',
      institutionId: createdInstitutions[1].id,
      name: 'MS in Artificial Intelligence',
      slug: 'stanford-ms-ai',
      country: 'USA',
      city: 'Stanford',
      degreeLevel: 'MASTER',
      fieldOfStudy: 'Artificial Intelligence',
      durationMonths: 24,
      tuitionFee: 57693,
      currency: 'USD',
      description: 'Cutting-edge AI research and applications',
      intakeSeason: 'Fall 2026',
    },
    {
      type: 'PROGRAM',
      institutionId: createdInstitutions[2].id,
      name: 'Master of Engineering in Computer Science',
      slug: 'mit-meng-cs',
      country: 'USA',
      city: 'Cambridge',
      degreeLevel: 'MASTER',
      fieldOfStudy: 'Computer Science',
      durationMonths: 12,
      tuitionFee: 77020,
      currency: 'USD',
      description: 'Intensive one-year program for top students',
      intakeSeason: 'Fall 2026',
    },
    // Business programs
    {
      type: 'PROGRAM',
      institutionId: createdInstitutions[0].id,
      name: 'MBA',
      slug: 'harvard-mba',
      country: 'USA',
      city: 'Cambridge',
      degreeLevel: 'MASTER',
      fieldOfStudy: 'Business Administration',
      durationMonths: 24,
      tuitionFee: 73440,
      currency: 'USD',
      description: 'World-renowned MBA program',
      intakeSeason: 'Fall 2026',
    },
    {
      type: 'PROGRAM',
      institutionId: createdInstitutions[3].id,
      name: 'Master in Business Administration',
      slug: 'oxford-mba',
      country: 'UK',
      city: 'Oxford',
      degreeLevel: 'MASTER',
      fieldOfStudy: 'Business Administration',
      durationMonths: 12,
      tuitionFee: 67715,
      currency: 'GBP',
      description: 'One-year full-time MBA',
      intakeSeason: 'Fall 2026',
    },
    // Engineering programs
    {
      type: 'PROGRAM',
      institutionId: createdInstitutions[5].id,
      name: 'MSc in Mechanical Engineering',
      slug: 'eth-msc-mechanical',
      country: 'Switzerland',
      city: 'Zurich',
      degreeLevel: 'MASTER',
      fieldOfStudy: 'Mechanical Engineering',
      durationMonths: 24,
      tuitionFee: 1298,
      currency: 'CHF',
      description: 'Top-ranked engineering program in Europe',
      intakeSeason: 'Fall 2026',
    },
    {
      type: 'PROGRAM',
      institutionId: createdInstitutions[8].id,
      name: 'Master in Automotive Engineering',
      slug: 'tum-automotive',
      country: 'Germany',
      city: 'Munich',
      degreeLevel: 'MASTER',
      fieldOfStudy: 'Automotive Engineering',
      durationMonths: 24,
      tuitionFee: 0,
      currency: 'EUR',
      description: 'Tuition-free program in Germany',
      intakeSeason: 'Fall 2026',
    },
    // Data Science programs
    {
      type: 'PROGRAM',
      institutionId: createdInstitutions[1].id,
      name: 'MS in Data Science',
      slug: 'stanford-ms-data-science',
      country: 'USA',
      city: 'Stanford',
      degreeLevel: 'MASTER',
      fieldOfStudy: 'Data Science',
      durationMonths: 18,
      tuitionFee: 57693,
      currency: 'USD',
      description: 'Applied data science with industry projects',
      intakeSeason: 'Fall 2026',
    },
    {
      type: 'PROGRAM',
      institutionId: createdInstitutions[6].id,
      name: 'Master of Data Science',
      slug: 'toronto-mds',
      country: 'Canada',
      city: 'Toronto',
      degreeLevel: 'MASTER',
      fieldOfStudy: 'Data Science',
      durationMonths: 12,
      tuitionFee: 42000,
      currency: 'CAD',
      description: 'Professional program with co-op',
      intakeSeason: 'Fall 2026',
    },
    // PhD programs
    {
      type: 'PROGRAM',
      institutionId: createdInstitutions[2].id,
      name: 'PhD in Computer Science',
      slug: 'mit-phd-cs',
      country: 'USA',
      city: 'Cambridge',
      degreeLevel: 'DOCTORATE',
      fieldOfStudy: 'Computer Science',
      durationMonths: 60,
      tuitionFee: 0,
      currency: 'USD',
      description: 'Fully funded PhD with stipend',
      intakeSeason: 'Fall 2026',
    },
  ];

  const createdPrograms = [];
  for (const program of programs) {
    const created = await prisma.opportunity.create({ data: program });
    createdPrograms.push(created);
  }

  console.log('✅ Created programs');

  // Create scholarships
  console.log('Creating scholarships...');

  const scholarships = [
    {
      type: 'SCHOLARSHIP',
      institutionId: createdInstitutions[0].id, // Use Harvard as placeholder
      name: 'Fulbright Foreign Student Program',
      slug: 'fulbright-scholarship',
      country: 'USA',
      degreeLevel: 'MASTER',
      scholarshipAmount: 50000,
      currency: 'USD',
      description: 'Fully funded scholarship for international students to study in the USA',
      intakeSeason: 'Fall 2026',
    },
    {
      type: 'SCHOLARSHIP',
      institutionId: createdInstitutions[3].id, // Oxford
      name: 'Chevening Scholarships',
      slug: 'chevening-scholarship',
      country: 'UK',
      degreeLevel: 'MASTER',
      scholarshipAmount: 35000,
      currency: 'GBP',
      description: 'UK government scholarship for future leaders',
      intakeSeason: 'Fall 2026',
    },
    {
      type: 'SCHOLARSHIP',
      institutionId: createdInstitutions[8].id, // TUM
      name: 'DAAD Scholarship',
      slug: 'daad-scholarship',
      country: 'Germany',
      degreeLevel: 'MASTER',
      scholarshipAmount: 20000,
      currency: 'EUR',
      description: 'German Academic Exchange Service scholarships',
      intakeSeason: 'Fall 2026',
    },
    {
      type: 'SCHOLARSHIP',
      institutionId: createdInstitutions[7].id, // Melbourne
      name: 'Australia Awards',
      slug: 'australia-awards',
      country: 'Australia',
      degreeLevel: 'MASTER',
      scholarshipAmount: 40000,
      currency: 'AUD',
      description: 'Fully funded scholarships to study in Australia',
      intakeSeason: 'Fall 2026',
    },
  ];

  for (const scholarship of scholarships) {
    await prisma.opportunity.create({ data: scholarship });
  }

  console.log('✅ Created scholarships');

  // Create sample applications for demo student
  console.log('Creating sample applications...');

  const applicationStatuses = [
    { opportunityId: createdPrograms[0].id, status: 'IN_REVIEW' },
    { opportunityId: createdPrograms[1].id, status: 'DOCUMENTS_PENDING' },
    { opportunityId: createdPrograms[7].id, status: 'SUBMITTED' },
  ] as const;

  for (const [index, appData] of applicationStatuses.entries()) {
    await prisma.application.create({
      data: {
        studentId: demoStudent.id,
        opportunityId: appData.opportunityId,
        applicationNumber: `APP-2026-${String(index + 1).padStart(5, '0')}`,
        status: appData.status,
        counselorId: demoCounselor.id,
        submittedAt: appData.status === 'SUBMITTED' ? new Date() : null,
      },
    });
  }

  console.log('✅ Created applications');

  // Create sample documents
  console.log('Creating sample documents...');

  const documents = [
    {
      studentId: demoStudent.id,
      documentType: 'PASSPORT',
      title: 'Passport',
      reviewStatus: 'APPROVED',
      expiryDate: new Date('2030-05-15'),
    },
    {
      studentId: demoStudent.id,
      documentType: 'TRANSCRIPT',
      title: 'Academic Transcript',
      reviewStatus: 'APPROVED',
    },
    {
      studentId: demoStudent.id,
      documentType: 'RECOMMENDATION_LETTER',
      title: 'Letter of Recommendation',
      reviewStatus: 'PENDING_REVIEW',
    },
  ];

  for (const doc of documents) {
    await prisma.document.create({ data: doc });
  }

  console.log('✅ Created documents');

  console.log('');
  console.log('✅ Seeding complete!');
  console.log('');
  console.log('📧 Demo accounts created:');
  console.log('   Student: student@demo.com / Demo123!');
  console.log('   Counselor: counselor@demo.com / Demo123!');
  console.log('');
  console.log('📊 Data created:');
  console.log(`   ${createdInstitutions.length} institutions`);
  console.log(`   ${createdPrograms.length} university programs`);
  console.log(`   ${scholarships.length} scholarships`);
  console.log(`   ${applicationStatuses.length} sample applications`);
  console.log(`   ${documents.length} sample documents`);
  console.log('');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
