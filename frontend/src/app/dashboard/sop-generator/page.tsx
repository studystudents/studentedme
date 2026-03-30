'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  FileText,
  Loader2,
  Copy,
  Download,
  RefreshCw,
  CheckCheck,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface SopResult {
  letter: string;
  wordCount: number;
  language: string;
}

const defaultForm = {
  // Target program
  targetUniversity: '',
  targetCountry: '',
  programType: 'MASTER' as 'BACHELOR' | 'MASTER' | 'PHD',
  fieldOfStudy: '',

  // Profile
  nationality: '',
  gpa: '',
  gpaScale: '4.0',
  undergradUniversity: '',
  languageType: 'ielts',
  ielts: '',
  toefl: '',

  // Experience
  publications: '0',
  researchExperienceYears: '0',
  internships: '0',
  workExperienceYears: '0',
  hackathonWins: '0',
  githubStars: '0',
  olympiadWinner: false,

  // Achievements & Goals
  awards: '',
  extracurricular: '',
  careerGoals: '',
  keyHighlights: '',

  // Letter settings
  tone: 'personal' as 'formal' | 'personal' | 'research-focused',
  language: 'en' as 'en' | 'ru',
  wordCount: 500 as 400 | 500 | 600,
};

export default function SopGeneratorPage() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SopResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (key: string, value: string | boolean | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const payload: Record<string, unknown> = {
      nationality: form.nationality,
      programType: form.programType,
      fieldOfStudy: form.fieldOfStudy,
      targetUniversity: form.targetUniversity,
      targetCountry: form.targetCountry,
      gpa: parseFloat(form.gpa),
      gpaScale: parseFloat(form.gpaScale),
      publications: parseInt(form.publications) || 0,
      researchExperienceYears: parseInt(form.researchExperienceYears) || 0,
      internships: parseInt(form.internships) || 0,
      workExperienceYears: parseInt(form.workExperienceYears) || 0,
      olympiadWinner: form.olympiadWinner,
      hackathonWins: parseInt(form.hackathonWins) || 0,
      githubStars: parseInt(form.githubStars) || 0,
      tone: form.tone,
      language: form.language,
      wordCount: form.wordCount,
    };

    if (form.undergradUniversity) payload.undergradUniversity = form.undergradUniversity;
    if (form.languageType === 'ielts' && form.ielts) payload.ielts = parseFloat(form.ielts);
    if (form.languageType === 'toefl' && form.toefl) payload.toefl = parseInt(form.toefl);
    if (form.awards) payload.awards = form.awards;
    if (form.extracurricular) payload.extracurricular = form.extracurricular;
    if (form.careerGoals) payload.careerGoals = form.careerGoals;
    if (form.keyHighlights) payload.keyHighlights = form.keyHighlights;

    try {
      const res = await fetch(`${API_URL}/sop-generator/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Request failed (${res.status})`);
      }

      const data: SopResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.letter) return;
    await navigator.clipboard.writeText(result.letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result?.letter) return;
    const blob = new Blob([result.letter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOP_${form.targetUniversity.replace(/\s+/g, '_') || 'letter'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls =
    'w-full h-10 px-3 border border-foreground/15 bg-transparent text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors';
  const selectCls =
    'w-full h-10 px-3 border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40 transition-colors';
  const labelCls = 'block text-xs uppercase tracking-widest text-foreground/40 mb-1.5';
  const sectionCls = 'border border-foreground/10 p-6 space-y-5';
  const textareaCls =
    'w-full px-3 py-2.5 border border-foreground/15 bg-transparent text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors resize-none';

  const toggleBtnCls = (active: boolean) =>
    `px-4 h-8 text-xs uppercase tracking-wide border transition-colors ${
      active
        ? 'bg-foreground text-background border-foreground'
        : 'border-foreground/15 text-foreground/50 hover:border-foreground/40 hover:text-foreground'
    }`;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl">
        {/* Header */}
        <div className="border-b border-foreground/10 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-3xl font-serif font-medium tracking-tight">SOP Generator</h1>
          </div>
          <p className="text-foreground/50 font-light text-sm">
            Generate a compelling, personalized Statement of Purpose using AI — tailored to your profile and target program.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN — Form */}
            <div className="space-y-6">

              {/* Target Program */}
              <div className={sectionCls}>
                <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/60 border-b border-foreground/10 pb-3">
                  Target Program
                </h2>
                <div>
                  <label className={labelCls}>University Name</label>
                  <input
                    type="text"
                    placeholder="e.g. MIT, LSE, ETH Zurich"
                    value={form.targetUniversity}
                    onChange={(e) => set('targetUniversity', e.target.value)}
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Country</label>
                  <input
                    type="text"
                    placeholder="e.g. USA, UK, Germany"
                    value={form.targetCountry}
                    onChange={(e) => set('targetCountry', e.target.value)}
                    required
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Program Type</label>
                    <select
                      value={form.programType}
                      onChange={(e) => set('programType', e.target.value)}
                      className={selectCls}
                    >
                      <option value="BACHELOR">Bachelor</option>
                      <option value="MASTER">Master</option>
                      <option value="PHD">PhD</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Field of Study</label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science"
                      value={form.fieldOfStudy}
                      onChange={(e) => set('fieldOfStudy', e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Your Profile */}
              <div className={sectionCls}>
                <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/60 border-b border-foreground/10 pb-3">
                  Your Profile
                </h2>
                <div>
                  <label className={labelCls}>Nationality</label>
                  <input
                    type="text"
                    placeholder="e.g. Kazakhstani, Russian, Indian"
                    value={form.nationality}
                    onChange={(e) => set('nationality', e.target.value)}
                    required
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>GPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      placeholder="e.g. 3.7"
                      value={form.gpa}
                      onChange={(e) => set('gpa', e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>GPA Scale</label>
                    <select
                      value={form.gpaScale}
                      onChange={(e) => set('gpaScale', e.target.value)}
                      className={selectCls}
                    >
                      <option value="4.0">4.0</option>
                      <option value="5.0">5.0</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Undergraduate University</label>
                  <input
                    type="text"
                    placeholder="e.g. Nazarbayev University"
                    value={form.undergradUniversity}
                    onChange={(e) => set('undergradUniversity', e.target.value)}
                    className={inputCls}
                  />
                </div>
                {/* Language score tabs */}
                <div>
                  <div className="flex gap-2 mb-3">
                    {(['ielts', 'toefl'] as const).map((lt) => (
                      <button
                        key={lt}
                        type="button"
                        onClick={() => set('languageType', lt)}
                        className={toggleBtnCls(form.languageType === lt)}
                      >
                        {lt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  {form.languageType === 'ielts' ? (
                    <div>
                      <label className={labelCls}>IELTS Score (Overall Band)</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="9"
                        placeholder="e.g. 7.5"
                        value={form.ielts}
                        onChange={(e) => set('ielts', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className={labelCls}>TOEFL iBT Score</label>
                      <input
                        type="number"
                        min="0"
                        max="120"
                        placeholder="e.g. 105"
                        value={form.toefl}
                        onChange={(e) => set('toefl', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div className={sectionCls}>
                <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/60 border-b border-foreground/10 pb-3">
                  Experience
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Publications</label>
                    <input
                      type="number"
                      min="0"
                      value={form.publications}
                      onChange={(e) => set('publications', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Research Experience (years)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={form.researchExperienceYears}
                      onChange={(e) => set('researchExperienceYears', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Internships</label>
                    <input
                      type="number"
                      min="0"
                      value={form.internships}
                      onChange={(e) => set('internships', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Work Experience (years)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={form.workExperienceYears}
                      onChange={(e) => set('workExperienceYears', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Hackathon Wins</label>
                    <input
                      type="number"
                      min="0"
                      value={form.hackathonWins}
                      onChange={(e) => set('hackathonWins', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>GitHub Stars (total)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.githubStars}
                      onChange={(e) => set('githubStars', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <input
                    id="olympiad"
                    type="checkbox"
                    checked={form.olympiadWinner}
                    onChange={(e) => set('olympiadWinner', e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  <label htmlFor="olympiad" className="text-sm text-foreground/70">
                    Olympiad Winner (national or international)
                  </label>
                </div>
              </div>

              {/* Achievements & Goals */}
              <div className={sectionCls}>
                <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/60 border-b border-foreground/10 pb-3">
                  Achievements & Goals
                </h2>
                <div>
                  <label className={labelCls}>Awards & Honors</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Dean's List, National Scholarship, Best Thesis Award"
                    value={form.awards}
                    onChange={(e) => set('awards', e.target.value)}
                    className={textareaCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Extracurricular Activities</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Student council president, debate club, volunteer teaching"
                    value={form.extracurricular}
                    onChange={(e) => set('extracurricular', e.target.value)}
                    className={textareaCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Career Goals</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your career goals and what you want to achieve..."
                    value={form.careerGoals}
                    onChange={(e) => set('careerGoals', e.target.value)}
                    className={textareaCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Key Highlights to Emphasize</label>
                  <textarea
                    rows={2}
                    placeholder="What specific aspects of your profile should be emphasized?"
                    value={form.keyHighlights}
                    onChange={(e) => set('keyHighlights', e.target.value)}
                    className={textareaCls}
                  />
                </div>
              </div>

              {/* Letter Settings */}
              <div className={sectionCls}>
                <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/60 border-b border-foreground/10 pb-3">
                  Letter Settings
                </h2>

                {/* Tone */}
                <div>
                  <label className={labelCls}>Tone</label>
                  <div className="flex gap-2">
                    {(['personal', 'formal', 'research-focused'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set('tone', t)}
                        className={toggleBtnCls(form.tone === t)}
                      >
                        {t === 'research-focused' ? 'Research' : t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className={labelCls}>Language</label>
                  <div className="flex gap-2">
                    {(['en', 'ru'] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => set('language', l)}
                        className={toggleBtnCls(form.language === l)}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Word Count */}
                <div>
                  <label className={labelCls}>Word Count</label>
                  <div className="flex gap-2">
                    {([400, 500, 600] as const).map((wc) => (
                      <button
                        key={wc}
                        type="button"
                        onClick={() => set('wordCount', wc)}
                        className={toggleBtnCls(form.wordCount === wc)}
                      >
                        {wc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-white text-sm tracking-wide font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Your SOP...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    ✨ Generate My SOP
                  </>
                )}
              </button>

              {error && (
                <div className="border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-600">
                  {error}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN — Output */}
            <div className="space-y-4">
              <div className="border border-foreground/10 p-6 space-y-4 sticky top-6">
                <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
                  <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/60">
                    Generated Letter
                  </h2>
                  {result && (
                    <span className="text-xs border border-foreground/15 px-2 py-0.5 text-foreground/50">
                      {result.wordCount} words
                    </span>
                  )}
                </div>

                {/* Output area */}
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-3 bg-foreground/8 rounded"
                        style={{ width: `${70 + Math.random() * 30}%` }}
                      />
                    ))}
                    <div className="pt-4 space-y-3">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-3 bg-foreground/8 rounded"
                          style={{ width: `${60 + Math.random() * 40}%` }}
                        />
                      ))}
                    </div>
                  </div>
                ) : result ? (
                  <textarea
                    readOnly
                    value={result.letter}
                    className="w-full h-[600px] px-3 py-2.5 border border-foreground/10 bg-foreground/2 text-sm text-foreground leading-relaxed font-mono focus:outline-none resize-none"
                  />
                ) : (
                  <div className="h-[600px] border border-dashed border-foreground/15 flex flex-col items-center justify-center gap-3 text-foreground/30">
                    <FileText className="h-10 w-10" />
                    <p className="text-sm">Your letter will appear here</p>
                    <p className="text-xs">Fill in the form and click Generate</p>
                  </div>
                )}

                {/* Action buttons */}
                {result && (
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-4 h-9 border border-foreground/15 text-xs uppercase tracking-wide text-foreground/60 hover:border-foreground/40 hover:text-foreground transition-colors"
                    >
                      {copied ? (
                        <>
                          <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 h-9 border border-foreground/15 text-xs uppercase tracking-wide text-foreground/60 hover:border-foreground/40 hover:text-foreground transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download .txt
                    </button>
                    <button
                      type="submit"
                      form="sop-form"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 h-9 border border-foreground/15 text-xs uppercase tracking-wide text-foreground/60 hover:border-foreground/40 hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed ml-auto"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Regenerate
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
