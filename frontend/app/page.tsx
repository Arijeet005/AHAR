'use client';

import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroScrollExperience from '@/components/HeroScrollExperience';
import ImpactMetrics from '@/components/ImpactMetrics';
import WastePredictionDemo from '@/components/WastePredictionDemo';
import NGOLocator from '@/components/NGOLocator';
import Footer from '@/components/Footer';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Single scroll source ──────────────────────────────────────────
  // ALL children must use this; no component may own its own useScroll.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  // ─────────────────────────────────────────────────────────────────

  return (
    <main className="bg-base-dark min-h-screen" id="main-content">
      {/* Skip link for keyboard users */}
      <a
        href="#below-fold"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-accent-turquoise focus:text-base-dark focus:font-heading focus:text-xs focus:rounded-sm"
      >
        Skip scroll experience
      </a>

      {/* ── Navbar ── */}
      <Navbar scrollYProgress={scrollYProgress} />

      {/* ── Cinematic scroll section (500 vh) ── */}
      <section
        ref={containerRef}
        className="relative"
        style={{ height: '500vh' }}
        aria-label="AHAR scrollytelling experience"
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <HeroScrollExperience scrollYProgress={scrollYProgress} />
        </div>
      </section>

      {/* ── Below-fold content ── */}
      <div
        id="below-fold"
        className="relative z-20 bg-base-dark"
        tabIndex={-1}
      >
        {/* Divider */}
        <div
          className="w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(48,213,200,0.3), transparent)' }}
        />

        <ImpactMetrics />

        {/* Section divider */}
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="h-px w-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(252,128,25,0.2), transparent)' }}
          />
        </div>

        <WastePredictionDemo />

        {/* Section divider */}
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="h-px w-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(48,213,200,0.2), transparent)' }}
          />
        </div>

        <NGOLocator />

        <Footer />
      </div>

      {/* Screen-reader summary of the full page for accessibility */}
      <section className="sr-only" aria-label="Page summary">
        <h1>AHAR — AI-based Food Waste Prediction and Management System</h1>
        <p>
          AHAR is a platform that uses artificial intelligence to predict food surplus before it becomes waste.
          One third of all food produced globally is wasted while 828 million people go hungry.
          AHAR connects food-surplus kitchens with nearby NGOs for instant redistribution.
          Key features include AI waste prediction with 94% accuracy, an NGO redistribution network,
          and smart donation routing. Use the interactive prediction demo and NGO locator on this page.
        </p>
      </section>
    </main>
  );
}
