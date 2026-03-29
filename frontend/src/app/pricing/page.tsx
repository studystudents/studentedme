'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import { PublicNav } from '@/components/public-nav';
import { PublicFooter } from '@/components/public-footer';
import { useLanguage } from '@/lib/i18n';

export default function PricingPage() {
  const { t } = useLanguage();

  const plans = [
    {
      name: 'Basic',
      price: '$299',
      period: t('pricing.period1'),
      tagline: t('pricing.tag1'),
      features: [
        'Access to full program catalog',
        'University matching tool',
        'Document checklist',
        'Email support',
        'Application tracker',
        '1 counselor consultation',
      ],
      cta: t('pricing.cta1'),
      highlight: false,
    },
    {
      name: 'Premium',
      price: '$899',
      period: t('pricing.period2'),
      tagline: t('pricing.tag2'),
      features: [
        'Everything in Basic',
        'Dedicated education counselor',
        'Personal statement review (3 rounds)',
        'Document verification service',
        'Scholarship matching',
        '5 counselor consultations',
        'Visa preparation guide',
        'Priority support',
      ],
      cta: t('pricing.cta2'),
      highlight: true,
    },
    {
      name: 'White-Glove',
      price: '$2,499',
      period: t('pricing.period3'),
      tagline: t('pricing.tag3'),
      features: [
        'Everything in Premium',
        'Unlimited counselor access',
        'Full application management',
        'Visa application support',
        'Pre-departure orientation',
        'Airport & housing assistance',
        'Post-arrival check-ins',
        'Dedicated account manager',
      ],
      cta: t('pricing.cta3'),
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background bg-noise">
      <PublicNav />

      <main>
        {/* Hero */}
        <section className="pt-24 pb-20 lg:pt-36 px-6 lg:px-12 max-w-[90rem] mx-auto border-b border-foreground/10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-widest text-primary mb-8">{t('pricing.badge')}</p>
            <h1 className="text-6xl md:text-8xl font-serif font-medium tracking-tighter text-foreground leading-[0.9]">
              {t('pricing.hero1')}<br />
              <span className="italic text-primary">{t('pricing.hero2')}</span><br />
              {t('pricing.hero3')}
            </h1>
            <p className="mt-10 text-xl text-foreground/70 font-light max-w-xl leading-relaxed">
              {t('pricing.heroPara')}
            </p>
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="py-32 px-6 lg:px-12">
          <div className="max-w-[90rem] mx-auto grid md:grid-cols-3 gap-0">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`border border-border p-12 flex flex-col ${
                  plan.highlight ? 'bg-secondary text-secondary-foreground' : 'bg-background'
                }`}
              >
                <p className="text-xs uppercase tracking-widest mb-2 opacity-50">{plan.tagline}</p>
                <h2 className="text-4xl font-serif mb-6">{plan.name}</h2>
                <div className="mb-10">
                  <span className="text-5xl font-serif">{plan.price}</span>
                  <span className="text-sm opacity-50 ml-2">{plan.period}</span>
                </div>
                <ul className="space-y-4 flex-1 mb-12">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm font-light">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <button className={`w-full rounded-none h-14 text-sm tracking-widest uppercase transition-colors flex items-center justify-center gap-2 group ${
                    plan.highlight
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-foreground/20 hover:bg-foreground hover:text-background'
                  }`}>
                    {plan.cta}
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ strip */}
        <section className="py-24 px-6 lg:px-12 bg-muted">
          <div className="max-w-[90rem] mx-auto grid md:grid-cols-2 gap-16">
            <h2 className="text-4xl font-serif">{t('pricing.faqTitle')}</h2>
            <div className="space-y-10">
              {[
                { q: 'Can I upgrade my plan later?', a: 'Yes. You can upgrade to a higher plan at any time and only pay the difference.' },
                { q: 'Is there a money-back guarantee?', a: 'We offer a full refund within 7 days if you have not used any counselor sessions.' },
                { q: 'What if I apply to multiple universities?', a: 'The Premium and White-Glove plans cover multiple applications within one cycle.' },
                { q: 'How do I get started?', a: 'Create an account, choose your plan, and you will be matched with a counselor within 24 hours.' },
              ].map((item) => (
                <div key={item.q} className="border-t border-foreground/10 pt-6">
                  <h3 className="font-serif text-lg mb-2">{item.q}</h3>
                  <p className="text-foreground/60 font-light text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 lg:px-12 bg-foreground text-background">
          <div className="max-w-[90rem] mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <h2 className="text-4xl md:text-5xl font-serif max-w-xl">{t('pricing.freeCall')}</h2>
            <Link href="/contact">
              <button className="rounded-none border border-background/30 hover:bg-background hover:text-foreground transition-colors px-12 h-14 text-sm tracking-widest uppercase">
                {t('pricing.bookCall')}
              </button>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
