'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowUpRight, GraduationCap, Globe2, FileCheck, MapPin } from 'lucide-react';

export default function HomePage() {
  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] },
  };

  return (
    <div className="min-h-screen bg-background bg-noise overflow-hidden selection:bg-primary/20">
      {/* Editorial Navigation */}
      <nav className="relative z-50 border-b border-black/5">
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-serif font-black tracking-tight text-foreground">
                Studented.me
              </span>
            </div>
            <div className="flex gap-6 items-center">
              <Link href="/login" className="text-sm tracking-wide uppercase hover:opacity-70 transition-opacity">
                Log In
              </Link>
              <Link href="/register">
                <Button className="rounded-none bg-foreground text-background hover:bg-foreground/90 px-8 h-12 text-sm tracking-wide uppercase">
                  Begin Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Editorial Hero Section */}
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-48 px-6 lg:px-12 max-w-[90rem] mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center"
          >
            {/* Left large typography */}
            <div className="lg:col-span-8 z-10">
              <motion.h1 
                variants={fadeInUp}
                className="text-6xl md:text-8xl lg:text-[7.5rem] leading-[0.9] font-serif font-medium tracking-tighter text-foreground"
              >
                The Art of <br />
                <span className="italic text-primary">Global</span> Education.
              </motion.h1>
              
              <motion.div variants={fadeInUp} className="mt-12 max-w-xl">
                <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed font-light">
                  A curated concierge for your international academic journey. From elite university applications to visa orchestration, we elevate the process of studying abroad.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 mt-12 items-start sm:items-center">
                  <Link href="/register">
                    <Button size="lg" className="rounded-none bg-primary hover:bg-primary/90 text-primary-foreground text-base h-16 px-10 border-0 group shadow-none">
                      Explore Programs
                      <ArrowUpRight className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/about" className="text-sm uppercase tracking-widest border-b border-foreground/30 pb-1 hover:border-foreground transition-colors">
                    Our Philosophy
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right side abstract/editorial elements */}
            <motion.div 
              variants={fadeInUp}
              className="lg:col-span-4 relative h-full hidden lg:block"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[120%] h-[140%] bg-secondary/10 -z-10 rounded-full blur-3xl" />
              <div className="space-y-12 pl-12 border-l border-foreground/10">
                <div>
                  <div className="text-5xl font-serif text-foreground">50+</div>
                  <div className="text-sm uppercase tracking-widest text-foreground/50 mt-2">Destinations</div>
                </div>
                <div>
                  <div className="text-5xl font-serif text-foreground">10k</div>
                  <div className="text-sm uppercase tracking-widest text-foreground/50 mt-2">Curated Programs</div>
                </div>
                <div>
                  <div className="text-5xl font-serif text-foreground">95%</div>
                  <div className="text-sm uppercase tracking-widest text-foreground/50 mt-2">Placement Rate</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Asymmetrical Bento/Editorial Features */}
        <section className="bg-secondary py-32 px-6 lg:px-12 text-secondary-foreground relative z-10">
          <div className="max-w-[90rem] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-serif leading-tight max-w-3xl">
                A seamless, sophisticated approach to international admissions.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Large Feature Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:col-span-2 bg-background p-12 lg:p-16 border border-border group"
              >
                <Globe2 className="h-10 w-10 text-primary mb-12 stroke-1 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-3xl font-serif mb-6 text-foreground">Global Horizons</h3>
                <p className="text-lg text-foreground/70 font-light max-w-xl">
                  Bespoke pairing with institutions across Europe, North America, and Asia. We look beyond rankings to find the academic environment that aligns with your distinct aspirations.
                </p>
              </motion.div>

              {/* Smaller Feature Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-background p-12 lg:p-16 border border-border group"
              >
                <GraduationCap className="h-10 w-10 text-primary mb-12 stroke-1 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-2xl font-serif mb-6 text-foreground">Scholarships</h3>
                <p className="text-base text-foreground/70 font-light">
                  Strategic guidance on securing merit-based financial aid and exclusive grants to fund your studies.
                </p>
              </motion.div>

              {/* Smaller Feature Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-background p-12 lg:p-16 border border-border group"
              >
                <FileCheck className="h-10 w-10 text-primary mb-12 stroke-1 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-2xl font-serif mb-6 text-foreground">Dossier Curation</h3>
                <p className="text-base text-foreground/70 font-light">
                  Impeccable document management. We ensure every application portfolio is polished, verified, and compelling.
                </p>
              </motion.div>

              {/* Large Feature Card Image Placeholder (Using Text/Color for now) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="lg:col-span-2 bg-primary p-12 lg:p-16 flex flex-col justify-between items-start"
              >
                <MapPin className="h-10 w-10 text-primary-foreground mb-12 stroke-1" />
                <div>
                  <h3 className="text-3xl font-serif mb-6 text-primary-foreground">End-to-End Orchestration</h3>
                  <p className="text-lg text-primary-foreground/90 font-light max-w-xl">
                    From finalizing your statement of purpose to navigating complex visa bureaucracy, our advisors provide precise, continuous support until you arrive on campus.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Minimalist Process Section */}
        <section className="py-32 px-6 lg:px-12">
          <div className="max-w-[90rem] mx-auto">
            <div className="border-t border-foreground p-8" />
            
            <div className="grid lg:grid-cols-2 gap-20">
              <div>
                <h2 className="text-5xl font-serif sticky top-32">The Method.</h2>
              </div>
              
              <div className="space-y-24">
                {[
                  { step: '01', title: 'Consultation', desc: 'A rigorous review of your academic profile and personal ambitions.' },
                  { step: '02', title: 'Selection', desc: 'Curating a tailored list of exceptional institutions and programs.' },
                  { step: '03', title: 'Preparation', desc: 'Refining applications, essays, and portfolios to perfection.' },
                  { step: '04', title: 'Acceptance', desc: 'Managing offers, securing visas, and transition planning.' }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative pl-12 border-l border-foreground/10 pb-12"
                  >
                    <span className="absolute -left-[2px] top-0 text-sm font-serif text-primary bg-background py-2">
                      {item.step}
                    </span>
                    <h3 className="text-3xl font-serif mb-4">{item.title}</h3>
                    <p className="text-lg text-foreground/60 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Elegant Footer */}
      <footer className="bg-foreground text-background py-20 px-6 lg:px-12">
        <div className="max-w-[90rem] mx-auto">
          <div className="grid md:grid-cols-12 gap-12 lg:gap-8 mb-20">
            <div className="md:col-span-5">
              <span className="text-4xl font-serif font-black tracking-tight mb-8 block">
                Studented.me
              </span>
              <p className="text-background/60 font-light max-w-sm text-lg">
                Curators of exceptional international academic experiences.
              </p>
            </div>
            
            <div className="md:col-span-2 md:col-start-7">
              <h4 className="text-xs uppercase tracking-widest text-background/40 mb-6">Directory</h4>
              <ul className="space-y-4 font-light">
                <li><Link href="/programs" className="hover:text-primary transition-colors">Programs</Link></li>
                <li><Link href="/advisors" className="hover:text-primary transition-colors">Advisors</Link></li>
                <li><Link href="/scholarships" className="hover:text-primary transition-colors">Scholarships</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-xs uppercase tracking-widest text-background/40 mb-6">Legal</h4>
              <ul className="space-y-4 font-light">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-xs uppercase tracking-widest text-background/40 mb-6">Connect</h4>
              <ul className="space-y-4 font-light">
                <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center text-sm text-background/40 font-light">
            <p>© {new Date().getFullYear()} Studented.me. All rights reserved.</p>
            <p className="mt-4 md:mt-0 uppercase tracking-widest text-xs">Excellence in Education</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
