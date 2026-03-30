'use client';

import { motion } from 'framer-motion';
import { PublicNav } from '@/components/public-nav';
import { PublicFooter } from '@/components/public-footer';
import { useLanguage } from '@/lib/i18n';


export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background bg-noise">
      <PublicNav />
      <main>
        <section className="pt-24 pb-20 lg:pt-36 px-6 lg:px-12 max-w-[90rem] mx-auto border-b border-foreground/10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-xs uppercase tracking-widest text-primary mb-8">{t('contact.badge')}</p>
            <h1 className="text-6xl md:text-8xl font-serif font-medium tracking-tighter text-foreground leading-[0.9]">
              {t('contact.hero1')}<br />
              <span className="italic text-primary">{t('contact.hero2')}</span>
            </h1>
            <p className="mt-10 text-xl text-foreground/70 font-light max-w-lg leading-relaxed">{t('contact.heroPara')}</p>
          </motion.div>
        </section>

        <section className="py-32 px-6 lg:px-12 max-w-[90rem] mx-auto">
          <div className="grid lg:grid-cols-2 gap-24">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-3xl font-serif mb-12">{t('contact.formTitle')}</h2>
              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-3">{t('contact.firstName')}</label>
                    <input type="text" className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-3">{t('contact.lastName')}</label>
                    <input type="text" className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-3">{t('contact.email')}</label>
                  <input type="email" className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-3">{t('contact.subject')}</label>
                  <input type="text" placeholder={t('contact.subjectPlaceholder')} className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-foreground/50 mb-3">{t('contact.message')}</label>
                  <textarea rows={5} placeholder={t('contact.messagePlaceholder')} className="w-full border-b border-foreground/20 bg-transparent py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors resize-none" />
                </div>
                <button type="submit" className="rounded-none bg-foreground text-background hover:bg-foreground/90 px-12 h-14 text-sm tracking-widest uppercase transition-colors">
                  {t('contact.send')}
                </button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="space-y-16">
              <div>
                <p className="text-xs uppercase tracking-widest text-foreground/40 mb-4">{t('contact.general')}</p>
                <p className="text-lg font-light text-foreground/70">amir@placeq.com</p>
                <p className="text-lg font-light text-foreground/70">+39 378 092 0686</p>
                <p className="text-sm text-foreground/40 mt-2">24/7</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
