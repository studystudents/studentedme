'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PublicNav } from '@/components/public-nav';
import { PublicFooter } from '@/components/public-footer';
import { useLanguage } from '@/lib/i18n';

const positions = [
  { title: 'Senior Education Counselor', dept: 'Counseling', location: 'Boston, MA', type: 'Full-time', desc: 'Guide students through the international application process and help them achieve their academic goals.', reqs: ['5+ years counseling experience', 'International education expertise', 'Strong communication skills'] },
  { title: 'Full Stack Engineer', dept: 'Engineering', location: 'Remote', type: 'Full-time', desc: 'Build and maintain our platform using Next.js, Node.js, and PostgreSQL to serve thousands of students.', reqs: ['3+ years full-stack experience', 'Next.js/React expertise', 'Strong system design skills'] },
  { title: 'Product Designer', dept: 'Design', location: 'Remote / Boston', type: 'Full-time', desc: 'Design beautiful, intuitive experiences that make international education accessible to everyone.', reqs: ['4+ years product design', 'Figma expertise', 'User research experience'] },
  { title: 'Marketing Manager', dept: 'Marketing', location: 'Singapore', type: 'Full-time', desc: 'Lead marketing campaigns across Asia-Pacific to reach and support students in the region.', reqs: ['5+ years marketing experience', 'EdTech background preferred', 'Data-driven approach'] },
  { title: 'Visa Specialist', dept: 'Operations', location: 'London, UK', type: 'Full-time', desc: 'Support students through visa application processes for UK, EU, and global destinations.', reqs: ['Immigration law knowledge', 'Attention to detail', '3+ years relevant experience'] },
  { title: 'Data Analyst', dept: 'Analytics', location: 'Remote', type: 'Full-time', desc: 'Analyze student data to improve outcomes and optimize our matching algorithms.', reqs: ['SQL/Python proficiency', 'Data visualization skills', 'Statistical analysis experience'] },
];

const benefits = [
  { title: 'Health & Wellness', desc: 'Comprehensive health insurance, mental health support, and wellness programs' },
  { title: 'Remote-Friendly', desc: 'Flexible work arrangements with options for remote and hybrid work' },
  { title: 'Growth Opportunities', desc: 'Career development programs, mentorship, and learning budgets' },
  { title: 'Global Impact', desc: 'Help students worldwide achieve their education dreams' },
  { title: 'Inclusive Culture', desc: 'Diverse, supportive team with strong values and collaboration' },
  { title: 'Competitive Pay', desc: 'Market-leading salaries, equity options, and performance bonuses' },
];

export default function CareersPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background bg-noise">
      <PublicNav />

      <main>
        {/* Hero */}
        <section className="pt-24 pb-20 lg:pt-36 px-6 lg:px-12 max-w-[90rem] mx-auto border-b border-foreground/10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-widest text-primary mb-8">{t('careers.badge')}</p>
            <h1 className="text-6xl md:text-8xl font-serif font-medium tracking-tighter text-foreground leading-[0.9]">
              {t('careers.hero1')}<br />
              <span className="italic text-primary">{t('careers.hero2')}</span>
            </h1>
            <p className="mt-10 text-xl text-foreground/70 font-light max-w-xl leading-relaxed">
              {t('careers.heroPara')}
            </p>
          </motion.div>
        </section>

        {/* Culture stats */}
        <section className="py-20 px-6 lg:px-12 bg-secondary text-secondary-foreground">
          <div className="max-w-[90rem] mx-auto grid grid-cols-3 gap-8 max-w-2xl">
            {[
              { num: '50+', label: t('careers.teamMembers') },
              { num: '15+', label: t('careers.countries') },
              { num: '4.8/5', label: t('careers.rating') },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-5xl font-serif mb-2">{stat.num}</div>
                <div className="text-xs uppercase tracking-widest text-secondary-foreground/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="py-32 px-6 lg:px-12">
          <div className="max-w-[90rem] mx-auto">
            <div className="border-t border-foreground/10 pt-12 mb-20">
              <p className="text-xs uppercase tracking-widest text-foreground/40 mb-4">{t('careers.benefitsLabel')}</p>
              <h2 className="text-5xl font-serif">{t('careers.benefitsTitle')}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  viewport={{ once: true, amount: 0 }}
                  className="border border-border p-10 flex flex-col gap-3"
                >
                  <span className="text-xs font-serif text-primary">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-xl font-serif">{b.title}</h3>
                  <p className="text-sm text-foreground/60 font-light leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-32 px-6 lg:px-12 bg-muted">
          <div className="max-w-[90rem] mx-auto">
            <div className="mb-20">
              <p className="text-xs uppercase tracking-widest text-foreground/40 mb-4">{t('careers.openLabel')}</p>
              <h2 className="text-5xl font-serif">{t('careers.openTitle')}</h2>
            </div>
            <div className="space-y-0">
              {positions.map((pos, i) => (
                <motion.div
                  key={pos.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  viewport={{ once: true, amount: 0 }}
                  className="border-t border-foreground/10 py-10 flex flex-col md:flex-row md:items-start justify-between gap-6 group"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-4 items-center mb-3">
                      <h3 className="text-2xl font-serif group-hover:text-primary transition-colors">{pos.title}</h3>
                      <span className="text-xs uppercase tracking-widest border border-foreground/20 px-3 py-1 text-foreground/50">{pos.dept}</span>
                      <span className="text-xs uppercase tracking-widest text-foreground/40">{pos.location}</span>
                    </div>
                    <p className="text-foreground/60 font-light mb-4 max-w-2xl">{pos.desc}</p>
                    <ul className="flex flex-wrap gap-3">
                      {pos.reqs.map((r) => (
                        <li key={r} className="text-xs uppercase tracking-wide text-foreground/40 border-b border-foreground/10 pb-1">{r}</li>
                      ))}
                    </ul>
                  </div>
                  <Link href="/contact">
                    <button className="rounded-none border border-foreground/20 hover:bg-foreground hover:text-background transition-colors px-8 h-12 text-sm tracking-widest uppercase flex items-center gap-2 group/btn">
                      {t('careers.apply')}
                      <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  </Link>
                </motion.div>
              ))}
              <div className="border-t border-foreground/10" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-[90rem] mx-auto text-center">
            <h2 className="text-4xl font-serif mb-6">{t('careers.noRole')}</h2>
            <p className="text-lg text-foreground/60 font-light mb-10">
              {t('careers.noRoleSub')}
            </p>
            <Link href="/contact">
              <button className="rounded-none bg-foreground text-background hover:bg-foreground/90 px-12 h-14 text-sm tracking-widest uppercase transition-colors">
                {t('careers.getInTouch')}
              </button>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
