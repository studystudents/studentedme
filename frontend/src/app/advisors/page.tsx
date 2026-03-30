'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PublicNav } from '@/components/public-nav';
import { PublicFooter } from '@/components/public-footer';
import { useLanguage } from '@/lib/i18n';

const advisors = [
  {
    name: 'Amir Mastikbayev',
    role: 'Co-founder — Data & Strategy',
    regions: ['Italy', 'Turkey', 'Spain'],
    langs: 'English, Russian, Kazakh',
    years: 3,
    placements: 50,
    bio: 'MSc Data Analytics graduate from Università Ca\' Foscari Venezia (110/110). Built Studented.me to help students find and apply to the right programs. Combines data-driven thinking with first-hand experience studying across Europe.',
  },
  {
    name: 'Tomiris Zhumagaliyeva',
    role: 'Educational Advisor',
    regions: ['Italy', 'Azerbaijan', 'Kazakhstan'],
    langs: 'English, Russian, Kazakh',
    years: 2,
    placements: 40,
    bio: 'BA Economics & Finance, Università Ca\' Foscari Venezia. Educational consultant with experience at SmarTestPrep, AB Education and Impact Admissions. Advised students on top global universities, admissions strategy, and Italian visa compliance. Erasmus+ alumna across three countries.',
  },
];

export default function AdvisorsPage() {
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
            <p className="text-xs uppercase tracking-widest text-primary mb-8">{t('advisors.badge')}</p>
            <h1 className="text-6xl md:text-8xl font-serif font-medium tracking-tighter text-foreground leading-[0.9]">
              {t('advisors.hero1')}<br />
              <span className="italic text-primary">{t('advisors.hero2')}</span>
            </h1>
            <p className="mt-10 text-xl text-foreground/70 font-light max-w-xl leading-relaxed">
              {t('advisors.heroPara')}
            </p>
          </motion.div>
        </section>

        {/* Stats strip */}
        <section className="py-16 px-6 lg:px-12 border-b border-foreground/10">
          <div className="max-w-[90rem] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '2', label: t('advisors.advisors') },
              { num: '3', label: t('advisors.languages') },
              { num: '5+', label: t('advisors.countries') },
              { num: '90+', label: t('advisors.placed') },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-5xl font-serif text-foreground mb-2">{stat.num}</div>
                <div className="text-xs uppercase tracking-widest text-foreground/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Advisor Grid */}
        <section className="py-32 px-6 lg:px-12">
          <div className="max-w-[90rem] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-0">
            {advisors.map((advisor, i) => (
              <motion.div
                key={advisor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                viewport={{ once: true, amount: 0 }}
                className="border border-border p-10 flex flex-col gap-4 group hover:bg-muted transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif text-xl">
                    {advisor.name[0]}
                  </div>
                  <span className="text-xs uppercase tracking-widest text-foreground/30 border border-foreground/10 px-3 py-1">
                    {advisor.years} {t('advisors.yrs')}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-serif">{advisor.name}</h3>
                  <p className="text-xs uppercase tracking-widest text-primary mt-1">{advisor.role}</p>
                </div>
                <p className="text-sm text-foreground/60 font-light leading-relaxed flex-1">{advisor.bio}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {advisor.regions.map((r) => (
                    <span key={r} className="text-xs border border-foreground/10 px-2 py-1 text-foreground/50">{r}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-foreground/40 pt-4 border-t border-foreground/10">
                  <span>{advisor.placements}+ placed</span>
                  <span>{advisor.langs}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 lg:px-12 bg-primary">
          <div className="max-w-[90rem] mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <h2 className="text-4xl md:text-5xl font-serif text-primary-foreground max-w-xl">
              {t('advisors.ctaTitle')}
            </h2>
            <Link href="/register">
              <button className="rounded-none bg-primary-foreground text-primary hover:opacity-90 transition-opacity px-12 h-14 text-sm tracking-widest uppercase flex items-center gap-2 group">
                {t('advisors.ctaBtn')}
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
