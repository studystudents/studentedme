'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { History, Sparkles, FileText, ChevronDown, ChevronUp, Copy, CheckCheck, Trash2 } from 'lucide-react';

interface AnalysisHistoryEntry {
  id: string;
  date: string;
  fieldOfStudy: string;
  programType: string;
  overallScore: number;
  result: {
    profileSummary: string;
    strengths: string[];
    weaknesses: string[];
    actionItems: string[];
    competitiveAnalysis: string;
    admissionProbability: { top10: number; top50: number; top100: number; top200: number };
    recommendedPrograms: { university: string; program: string; country: string; matchScore: number; reason: string }[];
  };
}

interface SopHistoryEntry {
  id: string;
  date: string;
  targetUniversity: string;
  fieldOfStudy: string;
  programType: string;
  letter: string;
}

export default function HistoryPage() {
  const [tab, setTab] = useState<'analysis' | 'sop'>('analysis');
  const [analyses, setAnalyses] = useState<AnalysisHistoryEntry[]>([]);
  const [sops, setSops] = useState<SopHistoryEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    try {
      const a = localStorage.getItem('analyzerHistory');
      if (a) setAnalyses(JSON.parse(a));
      const s = localStorage.getItem('sopHistory');
      if (s) setSops(JSON.parse(s));
    } catch {}
  }, []);

  const deleteAnalysis = (id: string) => {
    const updated = analyses.filter((a) => a.id !== id);
    setAnalyses(updated);
    localStorage.setItem('analyzerHistory', JSON.stringify(updated));
  };

  const deleteSop = (id: string) => {
    const updated = sops.filter((s) => s.id !== id);
    setSops(updated);
    localStorage.setItem('sopHistory', JSON.stringify(updated));
  };

  const copyLetter = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const scoreColor = (s: number) => s >= 70 ? '#22c55e' : s >= 45 ? '#f59e0b' : '#ef4444';

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const programLabel: Record<string, string> = {
    HIGH_SCHOOL: 'High School',
    BACHELOR: 'Bachelor',
    MASTER: 'Master',
    PHD: 'PhD',
    DOCTORATE: 'Doctorate',
    CERTIFICATE: 'Certificate',
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <History className="h-5 w-5 text-foreground/40" />
            <h1 className="text-2xl font-serif font-bold">History</h1>
          </div>
          <p className="text-sm text-foreground/50">Your past AI analyses and generated motivation letters</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-foreground/10 mb-8">
          <button
            onClick={() => setTab('analysis')}
            className={`flex items-center gap-2 px-6 py-3 text-sm tracking-wide border-b-2 transition-colors ${
              tab === 'analysis'
                ? 'border-foreground text-foreground'
                : 'border-transparent text-foreground/40 hover:text-foreground'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            AI Analysis
            {analyses.length > 0 && (
              <span className="ml-1 bg-foreground text-background text-xs px-1.5 py-0.5 rounded-full">
                {analyses.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('sop')}
            className={`flex items-center gap-2 px-6 py-3 text-sm tracking-wide border-b-2 transition-colors ${
              tab === 'sop'
                ? 'border-foreground text-foreground'
                : 'border-transparent text-foreground/40 hover:text-foreground'
            }`}
          >
            <FileText className="h-4 w-4" />
            SOP Letters
            {sops.length > 0 && (
              <span className="ml-1 bg-foreground text-background text-xs px-1.5 py-0.5 rounded-full">
                {sops.length}
              </span>
            )}
          </button>
        </div>

        {/* AI Analysis Tab */}
        {tab === 'analysis' && (
          <div className="space-y-4">
            {analyses.length === 0 ? (
              <div className="text-center py-20 border border-foreground/8">
                <Sparkles className="h-8 w-8 text-foreground/20 mx-auto mb-3" />
                <p className="text-foreground/40 text-sm">No analyses yet</p>
                <p className="text-foreground/30 text-xs mt-1">Go to AI Analyzer to analyze your profile</p>
              </div>
            ) : (
              analyses.map((entry) => (
                <div key={entry.id} className="border border-foreground/10">
                  {/* Card Header */}
                  <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 flex items-center justify-center border-2 font-serif font-bold text-lg"
                        style={{ borderColor: scoreColor(entry.overallScore), color: scoreColor(entry.overallScore) }}
                      >
                        {entry.overallScore}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{entry.fieldOfStudy || 'No field specified'}</p>
                        <p className="text-xs text-foreground/40 mt-0.5">
                          {programLabel[entry.programType] || entry.programType} · {formatDate(entry.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteAnalysis(entry.id)}
                        className="p-2 text-foreground/30 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                        className="p-2 text-foreground/40 hover:text-foreground transition-colors"
                      >
                        {expandedId === entry.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {expandedId === entry.id && entry.result && (
                    <div className="border-t border-foreground/10 p-5 space-y-5 bg-foreground/[0.02]">
                      {/* Summary */}
                      {entry.result.profileSummary && (
                        <div>
                          <p className="text-xs uppercase tracking-widest text-foreground/40 mb-2">Profile Summary</p>
                          <p className="text-sm text-foreground/70">{entry.result.profileSummary}</p>
                        </div>
                      )}

                      {/* Admission Probability */}
                      {entry.result.admissionProbability && (
                        <div>
                          <p className="text-xs uppercase tracking-widest text-foreground/40 mb-3">Admission Probability</p>
                          <div className="grid grid-cols-4 gap-3">
                            {Object.entries(entry.result.admissionProbability).map(([key, val]) => (
                              <div key={key} className="text-center border border-foreground/8 p-3">
                                <p className="text-lg font-serif font-bold">{val}%</p>
                                <p className="text-xs text-foreground/40 mt-1">{key.replace('top', 'Top ')}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Strengths & Weaknesses */}
                      <div className="grid grid-cols-2 gap-4">
                        {entry.result.strengths?.length > 0 && (
                          <div>
                            <p className="text-xs uppercase tracking-widest text-foreground/40 mb-2">Strengths</p>
                            <ul className="space-y-1">
                              {entry.result.strengths.map((s, i) => (
                                <li key={i} className="text-xs text-foreground/70 flex gap-2">
                                  <span className="text-emerald-500 mt-0.5">+</span> {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {entry.result.weaknesses?.length > 0 && (
                          <div>
                            <p className="text-xs uppercase tracking-widest text-foreground/40 mb-2">Weaknesses</p>
                            <ul className="space-y-1">
                              {entry.result.weaknesses.map((w, i) => (
                                <li key={i} className="text-xs text-foreground/70 flex gap-2">
                                  <span className="text-rose-500 mt-0.5">-</span> {w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Action Items */}
                      {entry.result.actionItems?.length > 0 && (
                        <div>
                          <p className="text-xs uppercase tracking-widest text-foreground/40 mb-2">Action Plan</p>
                          <ol className="space-y-1">
                            {entry.result.actionItems.map((item, i) => (
                              <li key={i} className="text-xs text-foreground/70 flex gap-2">
                                <span className="text-foreground/30 shrink-0">{i + 1}.</span> {item}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* SOP Tab */}
        {tab === 'sop' && (
          <div className="space-y-4">
            {sops.length === 0 ? (
              <div className="text-center py-20 border border-foreground/8">
                <FileText className="h-8 w-8 text-foreground/20 mx-auto mb-3" />
                <p className="text-foreground/40 text-sm">No letters yet</p>
                <p className="text-foreground/30 text-xs mt-1">Go to SOP Generator to create your first letter</p>
              </div>
            ) : (
              sops.map((entry) => (
                <div key={entry.id} className="border border-foreground/10">
                  {/* Card Header */}
                  <div className="flex items-center justify-between p-5">
                    <div>
                      <p className="font-medium text-sm">{entry.targetUniversity || 'University not specified'}</p>
                      <p className="text-xs text-foreground/40 mt-0.5">
                        {entry.fieldOfStudy || 'No field'} · {programLabel[entry.programType] || entry.programType} · {formatDate(entry.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyLetter(entry.id, entry.letter)}
                        className="p-2 text-foreground/40 hover:text-foreground transition-colors"
                        title="Copy letter"
                      >
                        {copied === entry.id ? <CheckCheck className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => deleteSop(entry.id)}
                        className="p-2 text-foreground/30 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                        className="p-2 text-foreground/40 hover:text-foreground transition-colors"
                      >
                        {expandedId === entry.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Letter Preview */}
                  {expandedId !== entry.id && (
                    <div className="px-5 pb-4">
                      <p className="text-xs text-foreground/40 line-clamp-2">{entry.letter.slice(0, 200)}...</p>
                    </div>
                  )}

                  {/* Full Letter */}
                  {expandedId === entry.id && (
                    <div className="border-t border-foreground/10 p-5 bg-foreground/[0.02]">
                      <pre className="text-sm text-foreground/80 whitespace-pre-wrap font-sans leading-relaxed">
                        {entry.letter}
                      </pre>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
