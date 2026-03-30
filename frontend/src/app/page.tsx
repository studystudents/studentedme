'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowUpRight, GraduationCap, Globe2, FileCheck, MapPin } from 'lucide-react';
import { PublicFooter } from '@/components/public-footer';
import { useLanguage, type Locale } from '@/lib/i18n';

export default function HomePage() {
  const { t, locale, setLocale } = useLanguage();

  const stagger = {
    animate: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
  };

  const features = [
    { icon: GraduationCap, title: t('home.step1Title'), desc: t('home.step1Desc'), num: '01' },
    { icon: FileCheck, title: t('home.step2Title'), desc: t('home.step2Desc'), num: '02' },
    { icon: Globe2, title: t('home.step3Title'), desc: t('home.step3Desc'), num: '03' },
    { icon: MapPin, title: t('home.step4Title'), desc: t('home.step4Desc'), num: '04' },
  ];

  const programs = [
    { university: 'University of Amsterdam', program: 'MSc Data Science & AI', location: 'Amsterdam, Netherlands', type: 'Masters' },
    { university: 'Sciences Po Paris', program: 'Master in International Affairs', location: 'Paris, France', type: 'Masters' },
    { university: 'University of Toronto', program: 'MBA Program', location: 'Toronto, Canada', type: 'MBA' },
    { university: 'ETH Zurich', program: 'MSc Computer Science', location: 'Zurich, Switzerland', type: 'Masters' },
    { university: 'University of Melbourne', program: 'Master of Architecture', location: 'Melbourne, Australia', type: 'Masters' },
    { university: 'LSE', program: 'MSc Finance', location: 'London, UK', type: 'Masters' },
  ];


  return (
    <div className="min-h-screen bg-background bg-noise">
      {/* Navigation */}
      <nav className="relative z-50 border-b border-black/5">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-24">
            <span className="text-3xl font-serif font-black tracking-tight text-foreground">Studented.me</span>
            <div className="hidden md:flex items-center gap-8">
              {[
                { href: '/about', label: t('nav.about') },
                { href: '/programs', label: t('nav.programs') },
                { href: '/advisors', label: t('nav.advisors') },
                { href: '/scholarships', label: t('nav.scholarships') },
                { href: '/pricing', label: t('nav.pricing') },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-xs tracking-widest uppercase text-foreground/70 hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center border border-foreground/10 overflow-hidden">
                {(['en', 'ru'] as Locale[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className={`px-3 h-8 text-xs uppercase tracking-widest transition-colors ${
                      locale === l
                        ? 'bg-foreground text-background'
                        : 'text-foreground/40 hover:text-foreground'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <Link href="/login" className="text-sm tracking-wide uppercase hover:opacity-70 transition-opacity">{t('nav.login')}</Link>
              <Link href="/register">
                <Button className="rounded-none bg-foreground text-background hover:bg-foreground/90 px-8 h-12 text-sm tracking-wide uppercase shadow-none">{t('nav.cta')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-24 lg:pt-28 lg:pb-32 px-6 lg:px-12 max-w-[90rem] mx-auto">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center"
          >
            <motion.div variants={fadeInUp} className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 border border-border bg-muted px-4 py-2 rounded-none text-xs uppercase tracking-widest text-muted-foreground mb-10">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {t('home.badge')}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tighter text-foreground leading-[1.0] mb-8">
                {t('home.hero1')}{' '}
                <em className="not-italic text-primary">{t('home.hero2')}</em>{' '}
                {t('home.hero3')}{' '}
                {t('home.hero4')}
              </h1>
              <p className="text-lg text-foreground/70 font-light leading-relaxed mb-10 max-w-lg">
                {t('home.heroSub')}
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/register">
                  <Button className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 text-sm tracking-widest uppercase shadow-none group">
                    {t('home.ctaPrimary')}
                    <ArrowUpRight className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/programs">
                  <Button variant="outline" className="rounded-none border-foreground/20 h-14 px-10 text-sm tracking-widest uppercase shadow-none hover:bg-muted">
                    {t('home.ctaSecondary')}
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="lg:col-start-9 lg:col-span-4 flex flex-col gap-10 border-l border-foreground/10 pl-12">
              {[
                { num: '157+', label: t('home.stats3') },
                { num: '70+', label: t('home.stats2') },
                { num: '15+', label: t('home.stats4') },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-5xl font-serif text-foreground mb-1">{stat.num}</div>
                  <div className="text-xs uppercase tracking-widest text-foreground/50">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="py-32 lg:py-48 px-6 lg:px-12">
          <div className="max-w-[90rem] mx-auto">
            <div className="grid lg:grid-cols-12 gap-8 mb-20">
              <div className="lg:col-span-4">
                <p className="text-xs uppercase tracking-widest text-foreground/40 mb-4">{t('home.howTitle')}</p>
                <h2 className="text-5xl md:text-6xl font-serif tracking-tighter">{t('home.howTitle')}</h2>
              </div>
              <div className="lg:col-span-5 lg:col-start-7 flex items-end">
                <p className="text-lg text-foreground/60 font-light leading-relaxed">{t('home.howSub')}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true, amount: 0 }}
                  className="border border-border p-10 flex flex-col gap-6 group hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-6 w-6 text-primary" />
                    <span className="text-xs font-serif text-foreground/20">{feature.num}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-3">{feature.title}</h3>
                    <p className="text-sm text-foreground/60 font-light leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Programs */}
        <section className="py-32 px-6 lg:px-12 bg-secondary text-secondary-foreground">
          <div className="max-w-[90rem] mx-auto">
            <div className="flex items-end justify-between mb-20">
              <div>
                <p className="text-xs uppercase tracking-widest text-secondary-foreground/40 mb-4">{t('home.featuredTitle')}</p>
                <h2 className="text-5xl font-serif">{t('home.featuredTitle')}</h2>
                <p className="text-secondary-foreground/60 font-light mt-4 max-w-md">{t('home.featuredSub')}</p>
              </div>
              <Link href="/programs" className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest text-secondary-foreground/60 hover:text-secondary-foreground transition-colors group">
                {t('home.viewAll')}
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0">
              {programs.map((program, i) => (
                <motion.div
                  key={`${program.university}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  viewport={{ once: true, amount: 0 }}
                  className="border border-secondary-foreground/10 p-8 flex flex-col gap-4 group hover:bg-secondary-foreground/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-primary border border-primary/30 px-2 py-1">{program.type}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-1 group-hover:text-primary transition-colors">{program.program}</h3>
                    <p className="text-secondary-foreground/60 font-light text-sm">{program.university}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-secondary-foreground/40 mt-auto">
                    <MapPin className="h-3 w-3" />
                    {program.location}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-32 px-6 lg:px-12 bg-primary">
          <div className="max-w-[90rem] mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div>
              <h2 className="text-5xl md:text-6xl font-serif text-primary-foreground mb-4">
                {t('home.ctaSection')}
              </h2>
              <p className="text-primary-foreground/70 font-light text-lg">{t('home.ctaSectionSub')}</p>
            </div>
            <Link href="/register">
              <Button className="rounded-none bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-16 px-12 text-sm tracking-widest uppercase shadow-none group shrink-0">
                {t('home.ctaSectionBtn')}
                <ArrowUpRight className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
