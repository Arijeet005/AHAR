'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const year = 2026;
  return (
    <footer
      className="relative border-t py-16 px-6 overflow-hidden"
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      aria-label="Site footer"
    >
      {/* Grid bg */}
      <div className="absolute inset-0 grid-dots opacity-20" />

      {/* Turquoise glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom, rgba(48,213,200,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-sm flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #E23744, #FC8019)' }}
              >
                <span className="text-white font-heading font-black text-sm">A</span>
              </div>
              <span className="font-heading font-bold text-lg text-white tracking-widest" style={{ letterSpacing: '0.25em' }}>AHAR</span>
            </div>
            <p className="font-body text-text-secondary text-sm leading-relaxed max-w-xs">
              AI-based Food Waste Prediction & Management System. Predicting surplus. Feeding people.
            </p>
            <p className="font-heading text-xs mt-4" style={{ color: '#E23744', letterSpacing: '0.15em' }}>
              PREDICT WASTE. FEED PEOPLE.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-heading text-xs text-white tracking-widest mb-4" style={{ letterSpacing: '0.18em' }}>PLATFORM</p>
            <ul className="space-y-2.5">
              {['Features', 'NGO Network', 'Dashboard', 'Donate Food'].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="font-body text-text-secondary text-sm hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social / mission */}
          <div>
            <p className="font-heading text-xs text-white tracking-widest mb-4" style={{ letterSpacing: '0.18em' }}>MISSION</p>
            <ul className="space-y-2">
              {[
                { label: '🍽 0 Meals Wasted', color: '#30D5C8' },
                { label: '🌾 Sustainable Food Chain', color: '#FC8019' },
                { label: '🌍 Zero Carbon Waste', color: '#E23744' },
              ].map((item) => (
                <li key={item.label}>
                  <span className="font-body text-sm" style={{ color: item.color }}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="font-body text-text-secondary text-xs">
            © {year} AHAR. Built with purpose at Reckon 7.0.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-turquoise animate-pulse" />
            <span className="font-heading text-xs text-text-secondary" style={{ letterSpacing: '0.15em' }}>
              SYSTEM OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
