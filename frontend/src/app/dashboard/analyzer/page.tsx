'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  MapPin,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface AdmissionProbability {
  top10: number;
  top50: number;
  top100: number;
  top200: number;
}

interface RecommendedProgram {
  university: string;
  program: string;
  country: string;
  matchScore: number;
  reason: string;
}

interface AnalysisResult {
  overallScore: number;
  admissionProbability: AdmissionProbability;
  strengths: string[];
  weaknesses: string[];
  recommendedPrograms: RecommendedProgram[];
  actionItems: string[];
  profileSummary: string;
  competitiveAnalysis: string;
}

interface HistoryEntry {
  date: string;
  fieldOfStudy: string;
  programType: string;
  overallScore: number;
  result: AnalysisResult;
}

const defaultForm = {
  gpa: '',
  gpaScale: '4.0',
  programType: 'MASTER',
  fieldOfStudy: '',
  languageType: 'ielts',
  ielts: '',
  toefl: '',
  showGre: false,
  greVerbal: '',
  greQuant: '',
  greAwa: '',
  publications: '0',
  researchExperienceYears: '0',
  internships: '0',
  workExperienceYears: '0',
  olympiadWinner: false,
  hackathonWins: '0',
  openSourceProjects: '0',
  githubStars: '0',
  kaggleRank: 'None',
  recommendationLetters: '2',
  sopQuality: 'Good',
  extracurricular: '0',
  undergradUniversityRank: '',
  targetUniversityRank: '',
  targetCountry: '',
  volunteerHours: '0',
  awardsCount: '0',
  languagesSpoken: '1',
  leadershipRoles: '0',
};

function ScoreCircle({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 70 ? '#22c55e' : score >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-foreground/10"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-serif font-bold" style={{ color }}>
            {score}
          </span>
          <span className="text-xs text-foreground/40 uppercase tracking-widest">/ 100</span>
        </div>
      </div>
      <p className="text-sm text-foreground/50">Overall Score</p>
    </div>
  );
}

function ProbabilityBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 60 ? 'bg-emerald-500' : value >= 35 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="flex items-center gap-4">
      <span className="text-xs text-foreground/50 w-16 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-foreground/10 overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-medium w-10 text-right">{value}%</span>
    </div>
  );
}

export default function AnalyzerPage() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load saved form and history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('analyzerForm');
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch {
        // ignore parse errors
      }
    }
    const savedHistory = localStorage.getItem('analyzerHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const set = (key: string, value: string | boolean) => {
    setForm((f) => {
      const updated = { ...f, [key]: value };
      localStorage.setItem('analyzerForm', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const payload: Record<string, unknown> = {
      gpa: parseFloat(form.gpa),
      gpaScale: parseFloat(form.gpaScale),
      programType: form.programType,
      fieldOfStudy: form.fieldOfStudy,
      publications: parseInt(form.publications) || 0,
      researchExperienceYears: parseInt(form.researchExperienceYears) || 0,
      internships: parseInt(form.internships) || 0,
      workExperienceYears: parseInt(form.workExperienceYears) || 0,
      olympiadWinner: form.olympiadWinner,
      hackathonWins: parseInt(form.hackathonWins) || 0,
      openSourceProjects: parseInt(form.openSourceProjects) || 0,
      githubStars: parseInt(form.githubStars) || 0,
      recommendationLetters: parseInt(form.recommendationLetters) || 0,
      sopQuality: form.sopQuality,
      extracurricular: parseInt(form.extracurricular) || 0,
      volunteerHours: parseInt(form.volunteerHours) || 0,
      awardsCount: parseInt(form.awardsCount) || 0,
      languagesSpoken: parseInt(form.languagesSpoken) || 1,
      leadershipRoles: parseInt(form.leadershipRoles) || 0,
    };

    if (form.languageType === 'ielts' && form.ielts) {
      payload.ielts = parseFloat(form.ielts);
    } else if (form.languageType === 'toefl' && form.toefl) {
      payload.toefl = parseInt(form.toefl);
    }

    if (form.showGre) {
      if (form.greVerbal) payload.greVerbal = parseInt(form.greVerbal);
      if (form.greQuant) payload.greQuant = parseInt(form.greQuant);
      if (form.greAwa) payload.greAwa = parseFloat(form.greAwa);
    }

    if (form.kaggleRank && form.kaggleRank !== 'None') {
      payload.kaggleRank = form.kaggleRank;
    }

    if (form.undergradUniversityRank) payload.undergradUniversityRank = form.undergradUniversityRank;
    if (form.targetUniversityRank) payload.targetUniversityRank = form.targetUniversityRank;
    if (form.targetCountry) payload.targetCountry = form.targetCountry;

    try {
      const res = await fetch(`${API_URL}/analyzer/analyze`, {
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

      const data: AnalysisResult = await res.json();
      setResult(data);

      // Save to history
      const entry: HistoryEntry = {
        date: new Date().toISOString(),
        fieldOfStudy: form.fieldOfStudy,
        programType: form.programType,
        overallScore: data.overallScore,
        result: data,
      };
      setHistory((prev) => {
        const updated = [entry, ...prev].slice(0, 10);
        localStorage.setItem('analyzerHistory', JSON.stringify(updated));
        return updated;
      });

      setTimeout(() => {
        document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full h-10 px-3 border border-foreground/15 bg-transparent text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors';
  const selectCls =
    'w-full h-10 px-3 border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/40 transition-colors';
  const labelCls = 'block text-xs uppercase tracking-widest text-foreground/40 mb-1.5';
  const sectionCls = 'border border-foreground/10 p-6 space-y-5';

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl">
        {/* Header */}
        <div className="border-b border-foreground/10 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-3xl font-serif font-medium tracking-tight">AI Portfolio Analyzer</h1>
          </div>
          <p className="text-foreground/50 font-light text-sm">
            Enter your academic profile to receive an AI-powered admissions assessment and personalized recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">

              {/* Academic Basics */}
              <div className={sectionCls}>
                <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/60 border-b border-foreground/10 pb-3">
                  Academic Profile
                </h2>
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
                    <select value={form.gpaScale} onChange={(e) => set('gpaScale', e.target.value)} className={selectCls}>
                      <option value="4.0">4.0</option>
                      <option value="5.0">5.0</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Program Type</label>
                    <select value={form.programType} onChange={(e) => set('programType', e.target.value)} className={selectCls}>
                      <option value="HIGH_SCHOOL">High School Graduate</option>
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
                <div>
                  <label className={labelCls}>Undergraduate University Rank (approx.)</label>
                  <input
                    type="text"
                    placeholder="e.g. 200, Top 500, unknown"
                    value={form.undergradUniversityRank}
                    onChange={(e) => set('undergradUniversityRank', e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Language Scores */}
              <div className={sectionCls}>
                <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/60 border-b border-foreground/10 pb-3">
                  Language Proficiency
                </h2>
                <div className="flex gap-2 mb-4">
                  {(['ielts', 'toefl'] as const).map((lt) => (
                    <button
                      key={lt}
                      type="button"
                      onClick={() => set('languageType', lt)}
                      className={`px-4 h-8 text-xs uppercase tracking-wide border transition-colors ${
                        form.languageType === lt
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-foreground/15 text-foreground/50 hover:border-foreground/40 hover:text-foreground'
                      }`}
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

                {/* GRE collapsible */}
                <button
                  type="button"
                  onClick={() => set('showGre', !form.showGre)}
                  className="flex items-center gap-2 text-xs text-foreground/50 hover:text-foreground transition-colors mt-2"
                >
                  {form.showGre ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  GRE Scores (optional)
                </button>
                {form.showGre && (
                  <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-foreground/10">
                    <div>
                      <label className={labelCls}>GRE Verbal</label>
                      <input
                        type="number"
                        min="130"
                        max="170"
                        placeholder="130-170"
                        value={form.greVerbal}
                        onChange={(e) => set('greVerbal', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>GRE Quant</label>
                      <input
                        type="number"
                        min="130"
                        max="170"
                        placeholder="130-170"
                        value={form.greQuant}
                        onChange={(e) => set('greQuant', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>GRE AWA</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="6"
                        placeholder="0-6"
                        value={form.greAwa}
                        onChange={(e) => set('greAwa', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Research & Experience */}
              <div className={sectionCls}>
                <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/60 border-b border-foreground/10 pb-3">
                  Research & Experience
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
                </div>
              </div>

              {/* Achievements */}
              <div className={sectionCls}>
                <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/60 border-b border-foreground/10 pb-3">
                  Achievements & Technical Skills
                </h2>
                <div className="flex items-center gap-3 mb-4">
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
                <div className="grid grid-cols-2 gap-4">
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
                    <label className={labelCls}>Open Source Projects</label>
                    <input
                      type="number"
                      min="0"
                      value={form.openSourceProjects}
                      onChange={(e) => set('openSourceProjects', e.target.value)}
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
                  <div>
                    <label className={labelCls}>Kaggle Rank</label>
                    <select value={form.kaggleRank} onChange={(e) => set('kaggleRank', e.target.value)} className={selectCls}>
                      <option value="None">None</option>
                      <option value="Novice">Novice</option>
                      <option value="Contributor">Contributor</option>
                      <option value="Expert">Expert</option>
                      <option value="Master">Master</option>
                      <option value="Grandmaster">Grandmaster</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">

              {/* Application Materials */}
              <div className={sectionCls}>
                <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/60 border-b border-foreground/10 pb-3">
                  Application Materials
                </h2>
                <div>
                  <label className={labelCls}>Recommendation Letters</label>
                  <select value={form.recommendationLetters} onChange={(e) => set('recommendationLetters', e.target.value)} className={selectCls}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Statement of Purpose Quality</label>
                  <select value={form.sopQuality} onChange={(e) => set('sopQuality', e.target.value)} className={selectCls}>
                    <option value="Weak">Weak</option>
                    <option value="Average">Average</option>
                    <option value="Good">Good</option>
                    <option value="Excellent">Excellent</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Extracurricular Activities (count)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.extracurricular}
                    onChange={(e) => set('extracurricular', e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Extra Profile */}
              <div className={sectionCls}>
                <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/60 border-b border-foreground/10 pb-3">
                  Additional Details
                </h2>
                <div>
                  <label className={labelCls}>Volunteer Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={form.volunteerHours}
                    onChange={(e) => set('volunteerHours', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Awards Count</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={form.awardsCount}
                    onChange={(e) => set('awardsCount', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Languages Spoken</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.languagesSpoken}
                    onChange={(e) => set('languagesSpoken', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Leadership Roles</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={form.leadershipRoles}
                    onChange={(e) => set('leadershipRoles', e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Target */}
              <div className={sectionCls}>
                <h2 className="text-sm font-medium uppercase tracking-widest text-foreground/60 border-b border-foreground/10 pb-3">
                  Target Preferences
                </h2>
                <div>
                  <label className={labelCls}>Target University Rank</label>
                  <input
                    type="text"
                    placeholder="e.g. Top 50, Top 100"
                    value={form.targetUniversityRank}
                    onChange={(e) => set('targetUniversityRank', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Target Country</label>
                  <input
                    type="text"
                    placeholder="e.g. Germany, USA, Canada"
                    value={form.targetCountry}
                    onChange={(e) => set('targetCountry', e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-white text-sm tracking-wide font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze My Profile
                  </>
                )}
              </button>

              {error && (
                <div className="border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-600">
                  {error}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Results */}
        {result && (
          <div id="analysis-results" className="space-y-6 pt-6 border-t border-foreground/10">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-serif font-medium tracking-tight">Analysis Results</h2>
            </div>

            {/* Score + Probabilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-foreground/10 p-8 flex items-center justify-center">
                <ScoreCircle score={result.overallScore} />
              </div>
              <div className="border border-foreground/10 p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-foreground/40 mb-4">
                  Admission Probability
                </h3>
                <ProbabilityBar label="Top 10" value={result.admissionProbability.top10} />
                <ProbabilityBar label="Top 50" value={result.admissionProbability.top50} />
                <ProbabilityBar label="Top 100" value={result.admissionProbability.top100} />
                <ProbabilityBar label="Top 200" value={result.admissionProbability.top200} />
              </div>
            </div>

            {/* Profile Summary */}
            <div className="border border-foreground/10 p-6">
              <h3 className="text-xs uppercase tracking-widest text-foreground/40 mb-3">Profile Summary</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{result.profileSummary}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-foreground/10 p-6">
                <h3 className="text-xs uppercase tracking-widest text-foreground/40 mb-4">Strengths</h3>
                <ul className="space-y-3">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-foreground/80">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-foreground/10 p-6">
                <h3 className="text-xs uppercase tracking-widest text-foreground/40 mb-4">Areas to Improve</h3>
                <ul className="space-y-3">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <XCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                      <span className="text-foreground/80">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Items */}
            <div className="border border-foreground/10 p-6">
              <h3 className="text-xs uppercase tracking-widest text-foreground/40 mb-4">Action Items</h3>
              <ol className="space-y-3">
                {result.actionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm">
                    <span className="flex-shrink-0 h-6 w-6 border border-primary text-primary text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <span className="text-foreground/80 pt-0.5">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Recommended Programs */}
            <div className="border border-foreground/10 p-6">
              <h3 className="text-xs uppercase tracking-widest text-foreground/40 mb-4">
                Recommended Programs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.recommendedPrograms.map((prog, i) => (
                  <div key={i} className="border border-foreground/10 p-5 space-y-3 hover:border-foreground/25 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <GraduationCap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-xs font-medium px-2 py-0.5 border border-foreground/15 text-foreground/50 ml-auto">
                        {prog.matchScore}% match
                      </span>
                    </div>
                    <div>
                      <p className="font-serif text-sm font-medium text-foreground leading-snug">{prog.program}</p>
                      <p className="text-xs text-foreground/50 mt-1">{prog.university}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-foreground/40">
                      <MapPin className="h-3 w-3" />
                      <span>{prog.country}</span>
                    </div>
                    <p className="text-xs text-foreground/60 leading-relaxed border-t border-foreground/10 pt-3">
                      {prog.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitive Analysis */}
            <div className="border border-foreground/10 p-6">
              <h3 className="text-xs uppercase tracking-widest text-foreground/40 mb-3">Competitive Analysis</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{result.competitiveAnalysis}</p>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-foreground/10">
            <h2 className="text-lg font-serif font-medium tracking-tight">Analysis History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((entry, i) => {
                const scoreColor =
                  entry.overallScore >= 70
                    ? 'text-emerald-500'
                    : entry.overallScore >= 45
                    ? 'text-amber-500'
                    : 'text-rose-500';
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setResult(entry.result);
                      setTimeout(() => {
                        document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="border border-foreground/10 p-4 text-left space-y-2 hover:border-foreground/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-serif font-bold ${scoreColor}`}>
                        {entry.overallScore}
                      </span>
                      <span className="text-xs text-foreground/40">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">{entry.fieldOfStudy}</p>
                    <p className="text-xs text-foreground/50 uppercase tracking-wide">{entry.programType}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
