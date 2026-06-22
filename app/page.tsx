'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/ui/navbar';
import { Footer } from '../components/ui/footer';
import { VisualizationCanvas } from '../components/visualizer/visualization-canvas';
import { PATTERNS } from '../data/patterns';
import { Variants } from 'framer-motion';

// Animation variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function LandingPage() {
  const demoPattern = PATTERNS['dijkstra'];
  const [currentStep, setCurrentStep] = useState(0);

  // Auto-animate the demo widget
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % demoPattern.steps.length);
    }, 2000); // Change step every 2 seconds
    return () => clearInterval(timer);
  }, [demoPattern.steps.length]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--color-bg-base)]">
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-purple-600 blur-[100px] rounded-full mix-blend-screen" />
      </div>
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay -z-10" />

      <Navbar />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="container mx-auto px-4 pt-32 pb-20 md:pt-40 md:pb-32 flex flex-col items-center text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-3 py-1 text-sm text-[var(--color-accent)] backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[var(--color-accent)] mr-2 animate-pulse"></span>
              DeepSeek V4 Pro AI Engine Active
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="font-mono text-5xl md:text-7xl lg:text-[80px] leading-[1.1] font-medium tracking-tight mb-8">
              Your code,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-text-muted)]">
                beautifully animated.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mb-12 leading-relaxed">
              Paste your DSA code &rarr; AI traces every pointer &rarr; see exactly where it breaks and how to fix it in real-time.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-24">
              <Link href="/app">
                <Button size="lg" className="h-12 px-8 text-base shadow-[0_0_40px_rgba(123,111,240,0.4)] hover:shadow-[0_0_60px_rgba(123,111,240,0.6)] transition-shadow">
                  Start Animating Free
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="ghost" size="lg" className="h-12 px-8 text-base border border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)]">
                  Watch Demo &darr;
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* LIVE DEMO WIDGET */}
          <motion.div 
            id="demo"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-5xl mx-auto rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-surface)] shadow-2xl overflow-hidden relative group"
          >
            {/* Ambient glow behind the widget */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-elevated)] to-transparent opacity-50 pointer-events-none" />
            
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg-base)]/50 backdrop-blur-sm relative z-10">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="text-xs font-mono text-[var(--color-text-muted)] flex items-center">
                <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                dijkstra_shortest_path.py
              </div>
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)]" />
              </div>
            </div>
            
            <div className="relative z-10">
              <VisualizationCanvas stepData={demoPattern.steps[currentStep]} layoutType="graph" />
            </div>
            
            <div className="bg-[var(--color-bg-base)]/80 backdrop-blur p-6 text-left border-t border-[var(--color-border)] relative z-10 h-[100px] flex flex-col justify-center">
              <div className="font-mono text-sm text-[var(--color-accent)] mb-2 flex items-center">
                <span className="mr-3 text-[var(--color-text-muted)]">{String(currentStep + 1).padStart(2, '0')}</span>
                {demoPattern.steps[currentStep].code_line}
              </div>
              <div className="text-sm text-[var(--color-text-secondary)] border-l-2 border-[var(--color-accent)] pl-4 truncate">
                {demoPattern.steps[currentStep].description}
              </div>
            </div>
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-gradient-to-b from-[var(--color-bg-base)] to-[var(--color-bg-surface)] py-32 border-t border-[var(--color-border)] relative">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">How AlgoViz Works</h2>
              <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">From raw code to complete understanding in three simple steps.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { step: "01", title: "Paste Code", desc: "Drop your C++, Python, or Java snippet. Provide an input array or linked list payload." },
                { step: "02", title: "Watch it Run", desc: "Our AI Engine traces execution line-by-line, creating a fluid, interactive visual diagram." },
                { step: "03", title: "Fix Bugs Fast", desc: "See exactly where your pointer went rogue. Compare your logic side-by-side with the correct pattern." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 0.5 }}
                  className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-base)] hover:border-[var(--color-accent)]/50 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 text-[120px] font-mono font-bold text-[var(--color-bg-elevated)] leading-none -mt-8 -mr-8 opacity-50 group-hover:opacity-100 transition-opacity">
                    {item.step}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">{item.title}</h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
