'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLanguage, type Locale } from '@/lib/i18n';
import { Menu, X } from 'lucide-react';

export function PublicNav() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: '/about', label: t('nav.about') },
    { href: '/programs', label: t('nav.programs') },
    { href: '/advisors', label: t('nav.advisors') },
    { href: '/scholarships', label: t('nav.scholarships') },
    { href: '/pricing', label: t('nav.pricing') },
  ];

  return (
    <nav className="relative z-50 border-b border-black/5 bg-background">
      <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20 md:h-24">
          <Link href="/">
            <span className="text-2xl md:text-3xl font-serif font-black tracking-tight text-foreground hover:text-primary transition-colors">
              Studented.me
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs tracking-widest uppercase transition-opacity ${
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex gap-4 items-center">
            <div className="flex items-center border border-foreground/10 overflow-hidden">
              {(['en', 'ru', 'kz'] as Locale[]).map((l) => (
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
            <Link href="/login" className="text-sm tracking-wide uppercase hover:opacity-70 transition-opacity">
              {t('nav.login')}
            </Link>
            <Link href="/register">
              <Button className="rounded-none bg-foreground text-background hover:bg-foreground/90 px-8 h-12 text-sm tracking-wide uppercase shadow-none">
                {t('nav.cta')}
              </Button>
            </Link>
          </div>

          {/* Mobile: language + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <div className="flex items-center border border-foreground/10 overflow-hidden">
              {(['en', 'ru', 'kz'] as Locale[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-2 h-7 text-xs uppercase tracking-widest transition-colors ${
                    locale === l
                      ? 'bg-foreground text-background'
                      : 'text-foreground/40 hover:text-foreground'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-foreground/10 bg-background px-6 py-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-3 text-sm tracking-widest uppercase transition-colors ${
                pathname === link.href
                  ? 'text-primary'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3 border-t border-foreground/10 mt-4">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm tracking-wide uppercase hover:opacity-70 transition-opacity"
            >
              {t('nav.login')}
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="rounded-none bg-foreground text-background hover:bg-foreground/90 w-full h-12 text-sm tracking-wide uppercase shadow-none">
                {t('nav.cta')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
