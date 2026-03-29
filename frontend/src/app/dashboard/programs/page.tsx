'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Search, MapPin, GraduationCap, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const DEGREE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Bachelor', value: 'BACHELOR' },
  { label: 'Master', value: 'MASTER' },
  { label: 'PhD', value: 'DOCTORATE' },
  { label: 'Exchange', value: 'CERTIFICATE' },
];

const TYPE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Programs', value: 'PROGRAM' },
  { label: 'Scholarships', value: 'SCHOLARSHIP' },
];

const COUNTRY_OPTIONS = [
  { label: 'All Countries', value: '' },
  { label: 'USA', value: 'United States' },
  { label: 'UK', value: 'United Kingdom' },
  { label: 'Germany', value: 'Germany' },
  { label: 'Switzerland', value: 'Switzerland' },
  { label: 'Netherlands', value: 'Netherlands' },
  { label: 'Italy', value: 'Italy' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Finland', value: 'Finland' },
  { label: 'Sweden', value: 'Sweden' },
  { label: 'France', value: 'France' },
];

const DEGREE_LABEL: Record<string, string> = {
  BACHELOR: 'Bachelor',
  MASTER: 'Master',
  DOCTORATE: 'PhD',
  CERTIFICATE: 'Exchange',
  ASSOCIATE: 'Associate',
  DIPLOMA: 'Diploma',
};

interface Program {
  id: string;
  name: string;
  type: string;
  degreeLevel: string;
  fieldOfStudy?: string;
  tuitionFee?: string | number | null;
  currency?: string;
  durationMonths?: number;
  intakeSeason?: string;
  country: string;
  city?: string;
  language?: string;
  description?: string;
  institution: {
    id: string;
    name: string;
    ranking?: number;
    country: string;
    city?: string;
    logo?: string;
    website?: string;
  };
}

const LIMIT = 20;

export default function ProgramsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [degree, setDegree] = useState('');
  const [type, setType] = useState('');
  const [country, setCountry] = useState('');
  const [page, setPage] = useState(1);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(LIMIT), page: String(page) });
    if (degree) params.set('degreeLevel', degree);
    if (type) params.set('type', type);
    if (country) params.set('country', country);
    if (search) params.set('search', search);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const res = await fetch(`${API_URL}/opportunities?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setPrograms(data.data || []);
      setTotal(data.meta?.total || 0);
    } catch {
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  }, [search, degree, type, country, page]);

  useEffect(() => {
    const debounce = setTimeout(fetchPrograms, search ? 400 : 0);
    return () => clearTimeout(debounce);
  }, [fetchPrograms]);

  const totalPages = Math.ceil(total / LIMIT);

  const handleFilter = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-foreground/10 pb-8">
          <h1 className="text-3xl font-serif font-medium tracking-tight">{t('dashboard.programs.title')}</h1>
          <p className="text-foreground/50 font-light mt-1 text-sm">
            {total > 0
              ? t('dashboard.programs.subtitleCount').replace('{total}', String(total))
              : t('dashboard.programs.subtitleDefault')}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
          <input
            type="text"
            placeholder={t('dashboard.programs.searchPlaceholder')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 h-11 border border-foreground/15 bg-transparent text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-foreground/40 mb-2">{t('dashboard.programs.typeLabel')}</p>
            <div className="flex gap-1">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleFilter(setType)(opt.value)}
                  className={`px-3 h-8 text-xs tracking-wide border transition-colors ${
                    type === opt.value
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-foreground/15 text-foreground/50 hover:border-foreground/40 hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-foreground/40 mb-2">{t('dashboard.programs.degreeLabel')}</p>
            <div className="flex gap-1 flex-wrap">
              {DEGREE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleFilter(setDegree)(opt.value)}
                  className={`px-3 h-8 text-xs tracking-wide border transition-colors ${
                    degree === opt.value
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-foreground/15 text-foreground/50 hover:border-foreground/40 hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-foreground/40 mb-2">{t('dashboard.programs.countryLabel')}</p>
            <select
              value={country}
              onChange={(e) => handleFilter(setCountry)(e.target.value)}
              className="h-8 px-3 text-xs border border-foreground/15 bg-background text-foreground/70 focus:outline-none focus:border-foreground/40 transition-colors"
            >
              {COUNTRY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-t border-foreground/10 py-6 animate-pulse">
                <div className="flex gap-6">
                  <div className="h-4 w-16 bg-foreground/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-72 bg-foreground/5" />
                    <div className="h-4 w-48 bg-foreground/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="border-t border-foreground/10 py-24 text-center">
            <Search className="h-8 w-8 text-foreground/20 mx-auto mb-4" />
            <p className="text-foreground/40 font-light text-sm">{t('dashboard.programs.noResults')}</p>
          </div>
        ) : (
          <>
            <div className="space-y-0">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="border-t border-foreground/10 py-6 grid grid-cols-12 gap-4 group hover:bg-foreground/[0.02] transition-colors -mx-2 px-2"
                >
                  {/* Degree badge + ranking */}
                  <div className="col-span-1 pt-0.5 flex flex-col gap-1.5">
                    <span className="text-xs border border-foreground/10 px-2 py-0.5 text-foreground/40 w-fit whitespace-nowrap">
                      {DEGREE_LABEL[program.degreeLevel] || program.degreeLevel}
                    </span>
                    {program.institution.ranking && (
                      <span className="text-xs text-primary font-medium">#{program.institution.ranking}</span>
                    )}
                  </div>

                  {/* Name + university */}
                  <div className="col-span-4 flex items-start gap-3">
                    {/* Logo */}
                    <div className="h-8 w-8 flex-shrink-0 border border-foreground/8 flex items-center justify-center overflow-hidden bg-white">
                      {program.institution.logo ? (
                        <img
                          src={program.institution.logo}
                          alt={program.institution.name}
                          className="h-6 w-6 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <span className="text-xs font-serif text-foreground/40">
                          {program.institution.name[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-medium group-hover:text-primary transition-colors leading-snug mb-1">
                        {program.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-foreground/50 text-xs">
                        <GraduationCap className="h-3 w-3 flex-shrink-0" />
                        <span>{program.institution.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Field + language */}
                  <div className="col-span-2 flex flex-col gap-1 justify-center">
                    {program.fieldOfStudy && (
                      <span className="text-xs text-foreground/60">{program.fieldOfStudy}</span>
                    )}
                    {program.language && (
                      <span className="text-xs text-foreground/30 uppercase tracking-wide">{program.language}</span>
                    )}
                  </div>

                  {/* Location + duration */}
                  <div className="col-span-2 flex flex-col gap-1 justify-center">
                    <div className="flex items-center gap-1 text-xs text-foreground/50">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span>{program.city}, {program.country}</span>
                    </div>
                    {program.durationMonths && (
                      <div className="flex items-center gap-1 text-xs text-foreground/40">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span>{program.durationMonths} mo.</span>
                      </div>
                    )}
                  </div>

                  {/* Tuition */}
                  <div className="col-span-2 flex flex-col gap-1 justify-center">
                    {Number(program.tuitionFee) > 0 ? (
                      <span className="text-sm font-serif text-foreground/80">
                        {Number(program.tuitionFee).toLocaleString()} <span className="text-xs text-foreground/40">{program.currency}</span>
                      </span>
                    ) : (
                      <span className="text-sm font-serif text-emerald-600">Free</span>
                    )}
                    {program.intakeSeason && (
                      <span className="text-xs text-foreground/30">{program.intakeSeason}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <Link href={`/dashboard/applications/new?opportunityId=${program.id}`}>
                      <button className="h-8 px-3 text-xs border border-foreground/15 text-foreground/60 hover:bg-foreground hover:text-background hover:border-foreground transition-colors whitespace-nowrap">
                        {t('dashboard.programs.applyBtn')}
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
              <div className="border-t border-foreground/10" />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-foreground/40">
                  {t('dashboard.programs.pageOf')
                    .replace('{page}', String(page))
                    .replace('{total}', String(totalPages))
                    .replace('{count}', String(total))}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-8 w-8 flex items-center justify-center border border-foreground/15 text-foreground/50 hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = page <= 3 ? i + 1 : page - 2 + i;
                    if (p > totalPages) return null;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`h-8 w-8 text-xs border transition-colors ${
                          p === page
                            ? 'bg-foreground text-background border-foreground'
                            : 'border-foreground/15 text-foreground/50 hover:border-foreground/40 hover:text-foreground'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="h-8 w-8 flex items-center justify-center border border-foreground/15 text-foreground/50 hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
