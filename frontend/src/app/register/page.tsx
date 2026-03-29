'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', dateOfBirth: '', nationality: '', countryOfResidence: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cleanData = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== '')) as typeof formData;
      await register(cleanData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, name: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-3">{label}</label>
      <input type={type} name={name} placeholder={placeholder} value={(formData as any)[name]} onChange={handleChange} className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background bg-noise flex">
      <div className="hidden lg:flex lg:w-2/5 bg-primary flex-col justify-between p-16">
        <Link href="/"><span className="text-3xl font-serif font-black tracking-tight text-primary-foreground hover:opacity-80 transition-opacity">Studented.me</span></Link>
        <div>
          <h2 className="text-5xl font-serif text-primary-foreground mb-6 leading-tight">
            {t('register.brandTitle1')}<br />
            <span className="italic">{t('register.brandTitle2')}</span><br />
            {t('register.brandTitle3')}
          </h2>
          <p className="text-primary-foreground/70 font-light text-lg">{t('register.brandSub')}</p>
        </div>
        <p className="text-primary-foreground/40 text-xs uppercase tracking-widest">{t('footer.tagline')}</p>
      </div>

      <div className="w-full lg:w-3/5 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl w-full mx-auto">
          <div className="lg:hidden mb-12">
            <Link href="/"><span className="text-2xl font-serif font-black tracking-tight text-foreground">Studented.me</span></Link>
          </div>
          <p className="text-xs uppercase tracking-widest text-primary mb-4">{t('register.badge')}</p>
          <h1 className="text-4xl font-serif font-medium tracking-tight text-foreground mb-12">{t('register.title')}</h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <div className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}
            <div className="grid md:grid-cols-2 gap-8">
              {field(t('register.firstName'), 'firstName', 'text', 'Айдар')}
              {field(t('register.lastName'), 'lastName', 'text', 'Сейткали')}
            </div>
            {field(t('register.email'), 'email', 'email', 'you@example.com')}
            <div>
              <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-3">{t('register.password')}</label>
              <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors" />
              <p className="text-xs text-foreground/40 mt-2">{t('register.passwordHint')}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-3">{t('register.phone')} <span className="normal-case">{t('register.optional')}</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+7 777 777 77 77" className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-3">{t('register.dob')} <span className="normal-case">{t('register.optional')}</span></label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-3">{t('register.nationality')} <span className="normal-case">{t('register.optional')}</span></label>
                <input name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Kazakhstan" className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-3">{t('register.country')} <span className="normal-case">{t('register.optional')}</span></label>
                <input name="countryOfResidence" value={formData.countryOfResidence} onChange={handleChange} placeholder="Kazakhstan" className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 h-14 text-sm tracking-widest uppercase transition-colors">
              {loading ? t('register.submitting') : t('register.submit')}
            </button>
          </form>
          <p className="mt-10 text-sm text-foreground/50">
            {t('register.hasAccount')}{' '}
            <Link href="/login" className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">{t('register.signin')}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
