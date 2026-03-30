'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin, Search } from 'lucide-react';
import { PublicNav } from '@/components/public-nav';
import { PublicFooter } from '@/components/public-footer';
import { useLanguage } from '@/lib/i18n';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const DEGREE_LEVELS = ['All', 'BACHELOR', 'MASTER', 'DOCTORATE', 'CERTIFICATE'];
const DEGREE_LABELS: Record<string, string> = {
  All: 'All',
  BACHELOR: 'Bachelor',
  MASTER: 'Master',
  DOCTORATE: 'PhD',
  CERTIFICATE: 'Exchange',
};

const COUNTRIES = ['All', 'United States', 'United Kingdom', 'Germany', 'Switzerland', 'Netherlands', 'Italy', 'Canada', 'Australia', 'Singapore', 'France', 'Finland', 'Sweden'];

interface Program {
  id: string;
  name: string;
  type: string;
  degreeLevel: string;
  fieldOfStudy: string;
  tuitionFee: string | number | null;
  currency: string;
  durationMonths: number;
  intakeSeason: string;
  country: string;
  city: string;
  language: string;
  institution: {
    name: string;
    ranking?: number;
    country: string;
    city?: string;
  };
}

export default function ProgramsPage() {
  const { t } = useLanguage();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('All');
  const [degree, setDegree] = useState('All');
  const [page, setPage] = useState(1);

  const limit = 24;

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      const params = new URLSearchParams({ limit: String(limit), page: String(page) });
      if (country !== 'All') params.set('country', country);
      if (degree !== 'All') params.set('degreeLevel', degree);
      if (search) params.set('search', search);

      try {
        const res = await fetch(`${API_URL}/opportunities?${params}`);
        const data = await res.json();
        setPrograms(data.data || []);
        setTotal(data.meta?.total || 0);
      } catch {
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchPrograms, search ? 400 : 0);
    return () => clearTimeout(debounce);
  }, [country, degree, search, page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-background bg-noise">
      <PublicNav />

      <main>
        {/* Hero */}
        <section className="pt-16 pb-16 lg:pt-36 px-6 lg:px-12 max-w-[90rem] mx-auto border-b border-foreground/10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-xs uppercase tracking-widest text-primary mb-8">{t('programs.badge')}</p>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-medium tracking-tighter text-foreground leading-[0.9]">
              {t('programs.hero1')}<br />
              <span className="italic text-primary">{t('programs.hero2')}</span><br />
              {t('programs.hero3')}
            </h1>
            <p className="mt-10 text-xl text-foreground/70 font-light max-w-xl leading-relaxed">
              {total > 0
                ? t('programs.heroSub').replace('{count}', String(total))
                : t('programs.heroSubDefault')}
            </p>
          </motion.div>
        </section>

        {/* Filters */}
        <section className="py-6 md:py-10 px-6 lg:px-12 border-b border-foreground/10 sticky top-0 bg-background z-10">
          <div className="max-w-[90rem] mx-auto space-y-4 md:space-y-6">
            {/* Search */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
              <input
                type="text"
                placeholder="Search by program or university..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-11 pr-4 h-12 border border-foreground/15 bg-transparent text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-6 md:gap-8">
              {/* Degree filter */}
              <div>
                <p className="text-xs uppercase tracking-widest text-foreground/40 mb-3">{t('programs.degree')}</p>
                <div className="flex flex-wrap gap-2">
                  {DEGREE_LEVELS.map((d) => (
                    <button
                      key={d}
                      onClick={() => { setDegree(d); setPage(1); }}
                      className={`px-4 h-9 text-xs uppercase tracking-wide transition-colors border ${
                        degree === d
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-foreground/20 text-foreground/50 hover:border-foreground/50 hover:text-foreground'
                      }`}
                    >
                      {DEGREE_LABELS[d]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country filter */}
              <div>
                <p className="text-xs uppercase tracking-widest text-foreground/40 mb-3">{t('programs.country')}</p>
                <div className="flex flex-wrap gap-2">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCountry(c); setPage(1); }}
                      className={`px-4 h-9 text-xs uppercase tracking-wide transition-colors border ${
                        country === c
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-foreground/20 text-foreground/50 hover:border-foreground/50 hover:text-foreground'
                      }`}
                    >
                      {c === 'United States' ? 'USA' : c === 'United Kingdom' ? 'UK' : c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-16 px-6 lg:px-12">
          <div className="max-w-[90rem] mx-auto">
            <p className="text-xs uppercase tracking-widest text-foreground/40 mb-12">
              {loading ? t('programs.loading') : `${total} ${total !== 1 ? t('programs.foundPlural') : t('programs.found')}`}
            </p>

            {loading ? (
              <div className="space-y-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border-t border-foreground/10 py-10 animate-pulse">
                    <div className="h-5 w-64 bg-foreground/5 mb-3" />
                    <div className="h-4 w-40 bg-foreground/5" />
                  </div>
                ))}
              </div>
            ) : programs.length === 0 ? (
              <div className="border-t border-foreground/10 py-24 text-center">
                <p className="text-foreground/40 font-light">{t('programs.noResults')}</p>
              </div>
            ) : (
              <div className="space-y-0">
                {programs.map((program, i) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="border-t border-foreground/10 py-6 md:py-10 grid md:grid-cols-12 gap-3 md:gap-6 group"
                  >
                    <div className="md:col-span-1 flex flex-row md:flex-col gap-2 items-center md:items-start">
                      <span className="text-xs uppercase tracking-widest border border-foreground/10 px-2 py-1 text-foreground/40 w-fit">
                        {DEGREE_LABELS[program.degreeLevel] || program.degreeLevel}
                      </span>
                      {program.institution.ranking && (
                        <span className="text-xs text-primary font-medium">#{program.institution.ranking}</span>
                      )}
                    </div>

                    <div className="md:col-span-5">
                      <h3 className="text-lg md:text-xl font-serif mb-1 group-hover:text-primary transition-colors">{program.name}</h3>
                      <p className="text-foreground/60 font-light text-sm">{program.institution.name}</p>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-1">
                      {program.fieldOfStudy && (
                        <span className="text-sm font-light text-foreground/70">{program.fieldOfStudy}</span>
                      )}
                      {program.language && (
                        <span className="text-xs text-foreground/40 uppercase tracking-wide">{program.language}</span>
                      )}
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-1">
                      {Number(program.tuitionFee) > 0 ? (
                        <span className="text-sm font-serif text-primary">
                          {Number(program.tuitionFee).toLocaleString()} {program.currency}
                        </span>
                      ) : (
                        <span className="text-sm font-serif text-green-600">Free</span>
                      )}
                      <span className="text-xs text-foreground/40">
                        <MapPin className="inline h-3 w-3 mr-1" />
                        {program.city}, {program.country}
                      </span>
                    </div>

                    <div className="md:col-span-1 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-between gap-2">
                      {program.intakeSeason && (
                        <span className="text-xs text-foreground/40 md:text-right">{program.intakeSeason}</span>
                      )}
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
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 h-10 text-xs uppercase tracking-widest border border-foreground/20 text-foreground/50 hover:border-foreground/50 hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <span className="text-xs text-foreground/40 px-4">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-6 h-10 text-xs uppercase tracking-widest border border-foreground/20 text-foreground/50 hover:border-foreground/50 hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 lg:px-12 bg-secondary text-secondary-foreground">
          <div className="max-w-[90rem] mx-auto text-center">
            <h2 className="text-4xl font-serif mb-6">{t('programs.ctaTitle')}</h2>
            <p className="text-secondary-foreground/60 font-light text-lg mb-10">
              {t('programs.ctaSub')}
            </p>
            <Link href="/register">
              <button className="rounded-none border border-secondary-foreground/20 hover:bg-secondary-foreground hover:text-secondary transition-colors px-12 h-14 text-sm tracking-widest uppercase">
                {t('programs.ctaBtn')}
              </button>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
