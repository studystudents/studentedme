'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { applicationsApi } from '@/lib/api';
import Link from 'next/link';
import { Calendar, Clock, AlertTriangle, CheckCircle2, ChevronRight, Bell } from 'lucide-react';

interface DeadlineItem {
  id: string;
  applicationNumber: string;
  programName: string;
  institutionName: string;
  institutionLogo?: string;
  deadline: string | null;
  status: string;
  daysLeft: number | null;
}

function getUrgency(daysLeft: number | null): 'overdue' | 'critical' | 'soon' | 'ok' | 'none' {
  if (daysLeft === null) return 'none';
  if (daysLeft < 0) return 'overdue';
  if (daysLeft <= 7) return 'critical';
  if (daysLeft <= 30) return 'soon';
  return 'ok';
}

const urgencyConfig = {
  overdue: { label: 'Overdue', bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500', icon: AlertTriangle },
  critical: { label: 'This week', bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500', icon: Bell },
  soon: { label: 'This month', bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400', icon: Clock },
  ok: { label: 'Upcoming', bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', dot: 'bg-green-500', icon: Calendar },
  none: { label: 'No deadline', bg: 'bg-gray-50', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-500', dot: 'bg-gray-300', icon: Calendar },
};

function formatDeadline(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function calcDaysLeft(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const deadline = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  return Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'overdue' | 'critical' | 'soon' | 'ok'>('all');

  useEffect(() => {
    applicationsApi.getAll().then((apps) => {
      const items: DeadlineItem[] = apps.map((app: any) => {
        const deadline = app.targetDeadline || app.opportunity?.deadline || app.opportunity?.registrationDeadline || null;
        return {
          id: app.id,
          applicationNumber: app.applicationNumber,
          programName: app.opportunity?.name || 'Unknown Program',
          institutionName: app.opportunity?.institution?.name || '',
          institutionLogo: app.opportunity?.institution?.logo || app.opportunity?.institution?.logoUrl,
          deadline,
          status: app.status,
          daysLeft: calcDaysLeft(deadline),
        };
      });
      // Sort: overdue first, then by days left ascending, then no deadline last
      items.sort((a, b) => {
        if (a.daysLeft === null && b.daysLeft === null) return 0;
        if (a.daysLeft === null) return 1;
        if (b.daysLeft === null) return -1;
        return a.daysLeft - b.daysLeft;
      });
      setDeadlines(items);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? deadlines : deadlines.filter(d => getUrgency(d.daysLeft) === filter);

  const counts = {
    overdue: deadlines.filter(d => getUrgency(d.daysLeft) === 'overdue').length,
    critical: deadlines.filter(d => getUrgency(d.daysLeft) === 'critical').length,
    soon: deadlines.filter(d => getUrgency(d.daysLeft) === 'soon').length,
    ok: deadlines.filter(d => getUrgency(d.daysLeft) === 'ok').length,
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground tracking-tight">Deadline Tracker</h1>
          <p className="text-sm text-foreground/50 mt-1">Stay on top of your application deadlines</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: 'overdue', label: 'Overdue', count: counts.overdue, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
            { key: 'critical', label: 'This week', count: counts.critical, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
            { key: 'soon', label: 'This month', count: counts.soon, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
            { key: 'ok', label: 'Upcoming', count: counts.ok, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
          ].map(({ key, label, count, color, bg }) => (
            <button
              key={key}
              onClick={() => setFilter(filter === key as any ? 'all' : key as any)}
              className={`border rounded-lg p-4 text-left transition-all ${bg} ${filter === key ? 'ring-2 ring-offset-1 ring-foreground/20' : 'hover:opacity-80'}`}
            >
              <div className={`text-2xl font-serif font-bold ${color}`}>{count}</div>
              <div className="text-xs text-foreground/60 mt-1">{label}</div>
            </button>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 border-b border-foreground/8 pb-0">
          {(['all', 'overdue', 'critical', 'soon', 'ok'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors capitalize ${
                filter === f ? 'border-foreground text-foreground' : 'border-transparent text-foreground/40 hover:text-foreground/70'
              }`}
            >
              {f === 'all' ? `All (${deadlines.length})` : f === 'critical' ? 'This week' : f === 'soon' ? 'This month' : f === 'ok' ? 'Upcoming' : 'Overdue'}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 rounded-lg bg-foreground/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-foreground/40">
            <CheckCircle2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No deadlines in this category</p>
            <p className="text-sm mt-1">
              {deadlines.length === 0 ? (
                <>You have no applications yet. <Link href="/dashboard/programs" className="underline">Browse programs</Link></>
              ) : 'All caught up!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const urgency = getUrgency(item.daysLeft);
              const cfg = urgencyConfig[urgency];
              const Icon = cfg.icon;
              return (
                <Link key={item.id} href={`/dashboard/applications/${item.id}`}>
                  <div className={`flex items-center gap-4 border rounded-lg p-4 ${cfg.bg} ${cfg.border} hover:opacity-80 transition-opacity cursor-pointer`}>
                    {/* Logo / initial */}
                    <div className="h-10 w-10 flex-shrink-0 border border-foreground/8 flex items-center justify-center overflow-hidden bg-white rounded-sm">
                      {item.institutionLogo ? (
                        <img src={item.institutionLogo} alt={item.institutionName} className="h-8 w-8 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <span className="text-sm font-serif text-foreground/40">{item.institutionName?.[0] || '?'}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{item.programName}</p>
                      <p className="text-xs text-foreground/50 truncate">{item.institutionName}</p>
                    </div>

                    {/* Deadline */}
                    <div className="flex-shrink-0 text-right">
                      {item.deadline ? (
                        <>
                          <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                            <Icon className="h-3 w-3" />
                            {item.daysLeft !== null && item.daysLeft < 0
                              ? `${Math.abs(item.daysLeft)}d overdue`
                              : item.daysLeft === 0
                              ? 'Today!'
                              : item.daysLeft === 1
                              ? 'Tomorrow'
                              : `${item.daysLeft}d left`}
                          </div>
                          <p className="text-xs text-foreground/40 mt-1">{formatDeadline(item.deadline)}</p>
                        </>
                      ) : (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.badge}`}>No deadline</span>
                      )}
                    </div>

                    <ChevronRight className="h-4 w-4 text-foreground/30 flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
