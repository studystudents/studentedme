'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import {
  LayoutDashboard,
  Search,
  FileText,
  FolderOpen,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout, checkAuth } = useAuth();
  const { t, locale, setLocale } = useLanguage();

  const navigation = [
    { name: t('dashboard.nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('dashboard.nav.programs'), href: '/dashboard/programs', icon: Search },
    { name: t('dashboard.nav.applications'), href: '/dashboard/applications', icon: FileText },
    { name: t('dashboard.nav.documents'), href: '/dashboard/documents', icon: FolderOpen },
    { name: 'AI Analyzer', href: '/dashboard/analyzer', icon: Sparkles },
    { name: 'SOP Generator', href: '/dashboard/sop-generator', icon: FileText },
    { name: t('dashboard.nav.settings'), href: '/dashboard/settings', icon: Settings },
  ];

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-foreground text-background flex flex-col border-r border-foreground/10">
        {/* Logo */}
        <div className="px-8 py-8 border-b border-background/10">
          <Link href="/">
            <span className="text-2xl font-serif font-black tracking-tight text-background hover:text-primary transition-colors">
              Studented.me
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="px-8 py-6 border-b border-background/10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif text-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div className="text-sm font-medium text-background">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-background/40 truncate max-w-[120px]">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm tracking-wide transition-colors ${
                  isActive
                    ? 'bg-background text-foreground'
                    : 'text-background/60 hover:text-background hover:bg-background/10'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Language switcher */}
        <div className="px-6 py-4 border-b border-background/10">
          <div className="flex items-center border border-background/20 overflow-hidden w-fit">
            {(['en', 'ru'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-3 h-7 text-xs uppercase tracking-widest transition-colors ${
                  locale === l ? 'bg-background text-foreground' : 'text-background/40 hover:text-background'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-background/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-sm text-background/50 hover:text-background transition-colors">
            <LogOut className="h-4 w-4" />
            <span>{t('dashboard.nav.signout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-screen bg-background p-8">
        {children}
      </main>
    </div>
  );
}
