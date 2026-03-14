'use client';

import { useEffect, useRef } from 'react';
import { useScroll } from 'framer-motion';
import Link from 'next/link';

import AppShell from '@/components/AppShell';
import HeroScrollExperience from '@/components/HeroScrollExperience';
import Footer from '@/components/Footer';

import DashboardView from '@/components/dashboard/DashboardView';
import PredictionView from '@/components/prediction/PredictionView';

<<<<<<< HEAD
import InventoryPage from './(saas)/inventory/page';
import DonationsPage from './(saas)/donations/page';
import PaymentPage from './(saas)/payment/page';
import GuidePage from './(saas)/guide/page';
import PricingPage from './(saas)/pricing/page';
import { T } from '@/hooks/useTranslate';
=======
	import InventoryPage from './(saas)/inventory/page';
	import DonationsPage from './(saas)/donations/page';
	import GuidePage from './(saas)/guide/page';
	import PricingPage from './(saas)/pricing/page';
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841

export default function HomePage() {
  // Entry root: /#dashboard (set without auto-scrolling so the scroll intro still plays first)
  useEffect(() => {
    const id = window.location.hash.replace('#', '').trim() || 'dashboard';
    if (!window.location.hash) {
      // Avoid triggering browser's hash scroll on first load.
      history.replaceState(null, '', `/#${id}`);
    }
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <AppShell>
      {/* AppShell adds padding; pull the landing full-bleed. */}
      <div className="-mx-5 md:-mx-8 -mt-6">
        <main className="min-h-screen" id="main-content">
          <a
            href="#below-fold"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-accent-turquoise focus:text-base-dark focus:font-heading focus:text-xs focus:rounded-sm"
          >
            <T>Skip scroll experience</T>
          </a>

          {/* Scrollytelling intro (3 phases) */}
          <section
            id="intro"
            ref={containerRef}
            className="relative"
            style={{ height: '500vh' }}
            aria-label="AHAR scrollytelling experience"
          >
            <div className="sticky top-0 h-screen w-full overflow-hidden">
              <HeroScrollExperience scrollYProgress={scrollYProgress} />
            </div>
          </section>

          {/* Continuation: feature sections */}
          <div id="below-fold" className="relative z-20" tabIndex={-1}>
            <div
              className="w-full h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(48,213,200,0.3), transparent)' }}
            />

            <section id="dashboard" className="max-w-7xl mx-auto px-6 py-16" aria-label="Dashboard">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <p className="font-body text-accent-turquoise text-xs tracking-widest uppercase" style={{ letterSpacing: '0.2em' }}>
                    <T>CONTINUE</T>
                  </p>
<<<<<<< HEAD
                  <h2 className="font-heading font-black text-white text-3xl md:text-4xl"><T>Dashboard</T></h2>
                </div>
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-sm font-heading text-xs tracking-widest"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-accent-red), var(--color-accent-orange))',
                    letterSpacing: '0.14em',
                  }}
                >
                  <T>OPEN FULL</T>
=======
                  <h2 className="font-heading font-black text-text-primary text-3xl md:text-4xl">Dashboard</h2>
                </div>
	                <Link
	                  href="/dashboard"
	                  className="px-5 py-2.5 rounded-sm font-heading text-xs tracking-widest"
	                  style={{
	                    background: 'var(--color-accent-red)',
	                    color: '#fff',
	                    letterSpacing: '0.14em',
	                  }}
	                >
	                  OPEN FULL
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841
                </Link>
              </div>
              <DashboardView />
            </section>

            <div className="max-w-7xl mx-auto px-6">
              <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(252,128,25,0.25), transparent)' }} />
            </div>

            <section id="prediction" className="max-w-7xl mx-auto px-6 py-16" aria-label="Prediction">
              <div className="flex items-center justify-between gap-3 mb-6">
<<<<<<< HEAD
                <h2 className="font-heading font-black text-white text-3xl md:text-4xl"><T>Prediction</T></h2>
                <Link
                  href="/prediction"
                  className="px-5 py-2.5 rounded-sm font-heading text-xs tracking-widest"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-accent-orange), var(--color-accent-turquoise))',
                    letterSpacing: '0.14em',
                  }}
                >
                  <T>OPEN FULL</T>
=======
                <h2 className="font-heading font-black text-text-primary text-3xl md:text-4xl">Prediction</h2>
	                <Link
	                  href="/prediction"
	                  className="px-5 py-2.5 rounded-sm font-heading text-xs tracking-widest"
	                  style={{
	                    background: 'var(--color-accent-orange)',
	                    color: '#fff',
	                    letterSpacing: '0.14em',
	                  }}
	                >
	                  OPEN FULL
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841
                </Link>
              </div>
              <PredictionView />
            </section>

            <div className="max-w-7xl mx-auto px-6">
              <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(48,213,200,0.25), transparent)' }} />
            </div>

            <section id="inventory" className="max-w-7xl mx-auto px-6 py-16" aria-label="Inventory Hub">
              <div className="flex items-center justify-between gap-3 mb-6">
<<<<<<< HEAD
                <h2 className="font-heading font-black text-white text-3xl md:text-4xl"><T>Inventory Hub</T></h2>
                <Link
                  href="/inventory"
                  className="px-5 py-2.5 rounded-sm font-heading text-xs tracking-widest"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-accent-turquoise), var(--color-accent-orange))',
                    letterSpacing: '0.14em',
                  }}
                >
                  <T>OPEN FULL</T>
=======
                <h2 className="font-heading font-black text-text-primary text-3xl md:text-4xl">Inventory Hub</h2>
	                <Link
	                  href="/inventory"
	                  className="px-5 py-2.5 rounded-sm font-heading text-xs tracking-widest"
	                  style={{
	                    background: 'var(--color-accent-turquoise)',
	                    color: '#fff',
	                    letterSpacing: '0.14em',
	                  }}
	                >
	                  OPEN FULL
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841
                </Link>
              </div>
              <InventoryPage />
            </section>

            <div className="max-w-7xl mx-auto px-6">
              <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(226,55,68,0.25), transparent)' }} />
            </div>

            <section id="donations" className="max-w-7xl mx-auto px-6 py-16" aria-label="Donation Locator">
              <div className="flex items-center justify-between gap-3 mb-6">
<<<<<<< HEAD
                <h2 className="font-heading font-black text-white text-3xl md:text-4xl"><T>Donation Locator</T></h2>
                <Link
                  href="/donations"
                  className="px-5 py-2.5 rounded-sm font-heading text-xs tracking-widest"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-accent-red), var(--color-accent-turquoise))',
                    letterSpacing: '0.14em',
                  }}
                >
                  <T>OPEN FULL</T>
=======
                <h2 className="font-heading font-black text-text-primary text-3xl md:text-4xl">Donation Locator</h2>
	                <Link
	                  href="/donations"
	                  className="px-5 py-2.5 rounded-sm font-heading text-xs tracking-widest"
	                  style={{
	                    background: 'var(--color-accent-red)',
	                    color: '#fff',
	                    letterSpacing: '0.14em',
	                  }}
	                >
	                  OPEN FULL
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841
                </Link>
              </div>
              <DonationsPage />
            </section>

<<<<<<< HEAD
            <section id="payment" className="max-w-7xl mx-auto px-6 py-16" aria-label="Payment">
              <div className="flex items-center justify-between gap-3 mb-6">
                <h2 className="font-heading font-black text-white text-3xl md:text-4xl"><T>Payment</T></h2>
                <Link
                  href="/payment"
                  className="px-5 py-2.5 rounded-sm font-heading text-xs tracking-widest"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    letterSpacing: '0.14em',
                  }}
                >
                  <T>OPEN FULL</T>
                </Link>
              </div>
              <PaymentPage />
            </section>

            <section id="guide" className="max-w-7xl mx-auto px-6 py-16" aria-label="Guide">
              <div className="flex items-center justify-between gap-3 mb-6">
                <h2 className="font-heading font-black text-white text-3xl md:text-4xl"><T>Guide</T></h2>
=======
	            <section id="guide" className="max-w-7xl mx-auto px-6 py-16" aria-label="Guide">
	              <div className="flex items-center justify-between gap-3 mb-6">
	                <h2 className="font-heading font-black text-text-primary text-3xl md:text-4xl">Guide</h2>
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841
                <Link
                  href="/guide"
                  className="px-5 py-2.5 rounded-sm font-heading text-xs tracking-widest"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    letterSpacing: '0.14em',
                  }}
                >
                  <T>OPEN FULL</T>
                </Link>
              </div>
              <GuidePage />
            </section>

            <section id="pricing" className="max-w-7xl mx-auto px-6 py-16" aria-label="Pricing">
              <div className="flex items-center justify-between gap-3 mb-6">
<<<<<<< HEAD
                <h2 className="font-heading font-black text-white text-3xl md:text-4xl"><T>Pricing</T></h2>
=======
                <h2 className="font-heading font-black text-text-primary text-3xl md:text-4xl">Pricing</h2>
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841
                <Link
                  href="/pricing"
                  className="px-5 py-2.5 rounded-sm font-heading text-xs tracking-widest"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    letterSpacing: '0.14em',
                  }}
                >
                  <T>OPEN FULL</T>
                </Link>
              </div>
              <PricingPage />
            </section>

            <Footer />
          </div>

          <section className="sr-only" aria-label="Page summary">
<<<<<<< HEAD
            <h1><T>AHAR — AI-based Food Waste Prediction and Management System</T></h1>
            <p>
              <T>AHAR is a platform that uses artificial intelligence to predict food surplus before it becomes waste.</T>
              <T>Use the scrollytelling intro and then continue into the dashboard, prediction, inventory, donations, payment, guide, and pricing sections.</T>
            </p>
=======
            <h1>AHAR — AI-based Food Waste Prediction and Management System</h1>
	            <p>
	              AHAR is a platform that uses artificial intelligence to predict food surplus before it becomes waste.
	              Use the scrollytelling intro and then continue into the dashboard, prediction, inventory, donations, guide, and pricing sections.
	            </p>
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841
          </section>
        </main>
      </div>
    </AppShell>
  );
}
