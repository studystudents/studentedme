'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PublicNav } from '@/components/public-nav';
import { PublicFooter } from '@/components/public-footer';
import { useLanguage } from '@/lib/i18n';

const scholarships = [
  { name: 'Chevening Scholarship', country: 'UK', amount: 'Full funding', deadline: 'Nov 2025', field: 'All fields', level: 'Masters', desc: 'UK government scholarship for outstanding professionals with leadership potential.' },
  { name: 'DAAD Scholarship', country: 'Germany', amount: '€1,200/month', deadline: 'Oct 2025', field: 'All fields', level: 'Masters / PhD', desc: 'German Academic Exchange Service — funding for international students at German universities.' },
  { name: 'Erasmus Mundus', country: 'EU', amount: '€1,400/month', deadline: 'Jan 2026', field: 'Various', level: 'Masters', desc: "Joint European master's programs with full scholarship from the EU across multiple countries." },
  { name: 'Gates Cambridge Scholarship', country: 'UK', amount: 'Full funding', deadline: 'Dec 2025', field: 'All fields', level: 'Masters / PhD', desc: 'Prestigious scholarship at the University of Cambridge for outstanding students globally.' },
  { name: 'Australia Awards', country: 'Australia', amount: 'Full funding', deadline: 'Apr 2026', field: 'Development-related', level: 'Masters', desc: 'Australian government scholarships for students from developing nations.' },
  { name: 'Knight-Hennessy Scholars', country: 'USA', amount: 'Full funding', deadline: 'Oct 2025', field: 'All fields', level: 'Graduate', desc: 'Stanford University scholarship for emerging leaders pursuing graduate education.' },
  { name: 'Holland Scholarship', country: 'Netherlands', amount: '€5,000', deadline: 'May 2026', field: 'All fields', level: 'Bachelors / Masters', desc: 'Dutch Ministry of Education scholarship for international students from outside the EEA.' },
  { name: 'NUS Research Scholarship', country: 'Singapore', amount: 'Full + stipend', deadline: 'Rolling', field: 'STEM, Business', level: 'PhD', desc: 'National University of Singapore scholarship for research students in priority disciplines.' },
];

const countries = ['All', 'UK', 'Germany', 'EU', 'USA', 'Australia', 'Netherlands', 'Singapore'];
const levels = ['All', 'Bachelors', 'Masters', 'PhD', 'Graduate'];

export default function ScholarshipsPage() {
  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const filtered = scholarships.filter((s) => {
    const countryMatch = selectedCountry === 'All' || s.country === selectedCountry;
    const levelMatch = selectedLevel === 'All' || s.level.includes(selectedLevel);
    return countryMatch && levelMatch;
  });

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
            <p className="text-xs uppercase tracking-widest text-primary mb-8">{t('scholarships.badge')}</p>
            <h1 className="text-6xl md:text-8xl font-serif font-medium tracking-tighter text-foreground leading-[0.9]">
              {t('scholarships.hero1')}<br />
              <span className="italic text-primary">{t('scholarships.hero2')}</span><br />
              {t('scholarships.hero3')}
            </h1>
            <p className="mt-10 text-xl text-foreground/70 font-light max-w-xl leading-relaxed">
              {t('scholarships.heroPara')}
            </p>
          </motion.div>
        </section>

        {/* Filters */}
        <section className="py-12 px-6 lg:px-12 border-b border-foreground/10 sticky top-0 bg-background z-10">
          <div className="max-w-[90rem] mx-auto flex flex-wrap gap-8 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-foreground/40 mb-3">{t('scholarships.country')}</p>
              <div className="flex flex-wrap gap-2">
                {countries.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCountry(c)}
                    className={`px-4 h-9 text-xs uppercase tracking-wide transition-colors border ${
                      selectedCountry === c
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-foreground/20 text-foreground/50 hover:border-foreground/50 hover:text-foreground'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-foreground/40 mb-3">{t('scholarships.level')}</p>
              <div className="flex flex-wrap gap-2">
                {levels.map((l) => (
                  <button
                    key={l}
                    onClick={() => setSelectedLevel(l)}
                    className={`px-4 h-9 text-xs uppercase tracking-wide transition-colors border ${
                      selectedLevel === l
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-foreground/20 text-foreground/50 hover:border-foreground/50 hover:text-foreground'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Scholarship list */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-[90rem] mx-auto">
            <p className="text-xs uppercase tracking-widest text-foreground/40 mb-12">
              {filtered.length} {filtered.length !== 1 ? t('scholarships.foundPlural') : t('scholarships.found')}
            </p>
            <div className="space-y-0">
              {filtered.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="border-t border-foreground/10 py-10 grid md:grid-cols-12 gap-6 group"
                >
                  <div className="md:col-span-1">
                    <span className="text-xs uppercase tracking-widest border border-foreground/10 px-2 py-1 text-foreground/40">{s.country}</span>
                  </div>
                  <div className="md:col-span-6">
                    <h3 className="text-2xl font-serif mb-2 group-hover:text-primary transition-colors">{s.name}</h3>
                    <p className="text-foreground/60 font-light text-sm leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <span className="text-lg font-serif text-primary">{s.amount}</span>
                    <span className="text-xs text-foreground/40 uppercase tracking-wide">{s.level}</span>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs uppercase tracking-widest text-foreground/40 mb-1">{t('scholarships.deadline')}</p>
                    <p className="text-sm font-light">{s.deadline}</p>
                  </div>
                  <div className="md:col-span-1 flex items-center justify-end">
                    <Link href="/register">
                      <button className="rounded-none border border-foreground/20 hover:bg-foreground hover:text-background transition-colors w-10 h-10 flex items-center justify-center group/btn">
                        <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
              <div className="border-t border-foreground/10" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 lg:px-12 bg-secondary text-secondary-foreground">
          <div className="max-w-[90rem] mx-auto text-center">
            <h2 className="text-4xl font-serif mb-6">{t('scholarships.ctaTitle')}</h2>
            <p className="text-secondary-foreground/60 font-light text-lg mb-10">
              {t('scholarships.ctaSub')}
            </p>
            <Link href="/contact">
              <button className="rounded-none border border-secondary-foreground/20 hover:bg-secondary-foreground hover:text-secondary transition-colors px-12 h-14 text-sm tracking-widest uppercase">
                {t('scholarships.ctaBtn')}
              </button>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
