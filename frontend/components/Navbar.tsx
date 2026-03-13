'use client';

import { useEffect, useState } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';

interface NavbarProps {
  scrollYProgress: MotionValue<number>;
}

export default function Navbar({ scrollYProgress }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => setScrolled(v > 0.02));
    return () => unsubscribe();
  }, [scrollYProgress]);

  const navLinks = [
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Prediction', href: '#prediction' },
    { label: 'Inventory', href: '#inventory' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <motion.nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong' : 'bg-transparent'
      }`}
      style={{
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="AHAR - Home"
        >
          <div
            className="w-8 h-8 rounded-sm flex items-center justify-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #E23744, #FC8019)',
            }}
          >
            <span className="text-white font-heading font-black text-sm">A</span>
          </div>
          <span
            className="font-heading font-bold text-lg tracking-widest text-white group-hover:text-accent-orange transition-colors"
            style={{ letterSpacing: '0.25em' }}
          >
            AHAR
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-8">
          {/* Nav links — hidden on mobile */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-body font-medium text-sm tracking-widest uppercase text-text-secondary hover:text-white transition-colors duration-300"
                  style={{ fontSize: '0.75rem', letterSpacing: '0.18em' }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="#donations"
            id="nav-donate-cta"
            className="relative overflow-hidden font-heading font-semibold text-xs tracking-widest px-5 py-2.5 rounded-sm text-white transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #E23744, #FC8019)',
              letterSpacing: '0.12em',
              boxShadow: '0 0 20px rgba(226,55,68,0.25)',
            }}
            aria-label="Donate food using AHAR"
          >
            DONATE FOOD
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
