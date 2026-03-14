'use client';

import { useTransform, MotionValue, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HUD_PHASES, SOLUTION_CARDS, BACKEND_BASE } from '@/data/aharData';
<<<<<<< HEAD
import { T } from '@/hooks/useTranslate';
=======
import { useTheme } from '@/lib/theme';
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841

interface HeroScrollExperienceProps {
  scrollYProgress: MotionValue<number>;
}

type DashboardData = {
  totalWasteKg?: number;
  avgEfficiencyRate?: number;
  estimatedCostSavings?: number;
};

function usePhaseValue<T>(scrollYProgress: MotionValue<number>, values: T[], inputRange: number[]) {
  return useTransform(scrollYProgress, inputRange, values);
}

// Scan line top for the moving scan effect
function ScanLine({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none z-10"
      style={{
        top: y,
        background: 'linear-gradient(90deg, transparent, rgba(48,213,200,0.4), transparent)',
      }}
    />
  );
}

function HUDCornerDecor({ color }: { color: string }) {
  return (
    <>
      {/* Top-left */}
      <div className="absolute top-3 left-3 w-6 h-6 pointer-events-none" style={{ borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      {/* Top-right */}
      <div className="absolute top-3 right-3 w-6 h-6 pointer-events-none" style={{ borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
      {/* Bottom-left */}
      <div className="absolute bottom-3 left-3 w-6 h-6 pointer-events-none" style={{ borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      {/* Bottom-right */}
      <div className="absolute bottom-3 right-3 w-6 h-6 pointer-events-none" style={{ borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
    </>
  );
}

export default function HeroScrollExperience({ scrollYProgress }: HeroScrollExperienceProps) {
  const { theme } = useTheme();
  const [dashData, setDashData] = useState<DashboardData>({});

  // Fetch dashboard data once
  useEffect(() => {
    fetch(`${BACKEND_BASE}/api/analytics/waste-dashboard`)
      .then((r) => r.json())
      .then((d) => { if (d?.data) setDashData(d.data); })
      .catch(() => { });
  }, []);

  // ────────── Phase 1: 0→30% (Problem) ──────────
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.25, 0.32], [1, 1, 1, 0]);
  const phase1TranslateY = useTransform(scrollYProgress, [0, 0.32], [0, -40]);

  // ────────── Phase 2: 30→70% (Solution) ──────────
  const phase2Opacity = useTransform(scrollYProgress, [0.28, 0.35, 0.62, 0.7], [0, 1, 1, 0]);
  const phase2TranslateY = useTransform(scrollYProgress, [0.28, 0.35, 0.62, 0.7], [40, 0, 0, -40]);

  // ────────── Phase 3: 70→100% (Impact) ──────────
  const phase3Opacity = useTransform(scrollYProgress, [0.68, 0.75, 0.95, 1], [0, 1, 1, 1]);
  const phase3TranslateY = useTransform(scrollYProgress, [0.68, 0.75], [40, 0]);

  // Background color shift
  const bgOpacityRed = useTransform(scrollYProgress, [0, 0.25, 0.32], [0.08, 0.12, 0]);
  const bgOpacityOrange = useTransform(scrollYProgress, [0.28, 0.5, 0.68, 0.7], [0, 0.08, 0.08, 0]);
  const bgOpacityTurquoise = useTransform(scrollYProgress, [0.68, 0.85], [0, 0.06]);

  // Phase label progress
  const accentColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.3, 0.7, 0.7, 1],
    ['#E23744', '#E23744', '#FC8019', '#FC8019', '#30D5C8', '#30D5C8']
  );

  // HUD status text
  const hudStatus = useTransform(
    scrollYProgress,
    [0, 0.3, 0.3, 0.7, 0.7, 1],
    ['CRISIS DETECTED', 'CRISIS DETECTED', 'SYSTEM ONLINE', 'SYSTEM ONLINE', 'IMPACT LOGGED', 'IMPACT LOGGED']
  );

  // Keep hook calls out of JSX/branches to avoid hook order mismatches.
  const dotOpacities = [
    useTransform(scrollYProgress, [0.2 - 0.05, 0.2 + 0.05], [0.3, 1]),
    useTransform(scrollYProgress, [0.5 - 0.05, 0.5 + 0.05], [0.3, 1]),
    useTransform(scrollYProgress, [0.8 - 0.05, 0.8 + 0.05], [0.3, 1]),
  ];
  const bottomProgressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Expose the current HUD status value for rendering (motion values are not directly renderable)
  const [hudStatusText, setHudStatusText] = useState<string>(hudStatus.get());
  useEffect(() => {
    const unsubscribe = hudStatus.onChange((value) => setHudStatusText(value));
    return unsubscribe;
  }, [hudStatus]);

  return (
    <div className="relative w-full h-screen overflow-hidden grid-dots scanlines" aria-hidden="true">
      {/* Ambient background glows */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: bgOpacityRed, background: 'radial-gradient(ellipse at 20% 50%, #E23744 0%, transparent 60%)' }} />
      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: bgOpacityOrange, background: 'radial-gradient(ellipse at 80% 50%, #FC8019 0%, transparent 60%)' }} />
      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: bgOpacityTurquoise, background: 'radial-gradient(ellipse at 50% 30%, #30D5C8 0%, transparent 60%)' }} />

      {/* HUD corner decorators */}
      <HUDCornerDecor color="rgba(255,255,255,0.08)" />

      {/* Moving scan line */}
      <ScanLine scrollYProgress={scrollYProgress} />

      {/* ─── Top HUD bar ─── */}
      <div className="absolute top-20 left-0 right-0 px-8 flex items-center justify-between z-10">
        <motion.span
          className="font-heading text-xs tracking-widest"
          style={{ color: accentColor, fontSize: '0.65rem', letterSpacing: '0.2em' }}
        >
          ◆ {hudStatusText}
        </motion.span>
        <div className="flex items-center gap-4">
          {dotOpacities.map((opacity, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: accentColor, opacity }}
            />
          ))}
        </div>
        <motion.span className="font-heading text-xs text-text-secondary" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}>
          AHAR//v2.0
        </motion.span>
      </div>

      {/* ━━━━━━ PHASE 1 — Problem ━━━━━━ */}
      <motion.div
        className="absolute inset-0 flex items-center justify-between px-8 md:px-16"
        style={{ opacity: phase1Opacity, y: phase1TranslateY }}
      >
        {/* Left edge — big stat */}
        <div className="max-w-[45%]">
          <p className="font-body text-accent-red text-xs tracking-widest uppercase mb-3" style={{ letterSpacing: '0.2em' }}>
            <T>GLOBAL FOOD WASTE</T>
          </p>
          <h2
            className="font-heading font-black text-white leading-none mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', textShadow: '0 0 40px rgba(226,55,68,0.4)' }}
          >
            1/3 of all food<br />
            <span className="text-accent-red"><T>produced</T></span><br />
            <T>globally is</T><br />
            <span className="text-accent-red"><T>wasted.</T></span>
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-accent-red" />
            <p className="font-body text-text-secondary text-sm tracking-wide">UNFAO, 2024</p>
          </div>
        </div>

        {/* Right edge — sub-stats */}
        <div className="hidden md:flex flex-col items-end gap-6 max-w-[40%] text-right">
          {[
            { value: '1.3B', label: 'tonnes wasted yearly', accent: '#E23744' },
            { value: '828M', label: 'people go hungry globally', accent: '#FC8019' },
            { value: '8-10%', label: 'of global CO₂ from food waste', accent: '#E23744' },
          ].map((stat, i) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <p className="font-heading font-bold text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: stat.accent }}>
                {stat.value}
              </p>
              <p className="font-body text-text-secondary text-sm"><T>{stat.label}</T></p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ━━━━━━ PHASE 2 — Solution ━━━━━━ */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-8"
        style={{ opacity: phase2Opacity, y: phase2TranslateY }}
      >
        <p className="font-body text-accent-orange text-xs tracking-widest uppercase mb-4 text-center" style={{ letterSpacing: '0.2em' }}>
          <T>AHAR SYSTEM ARCHITECTURE</T>
        </p>
        <h2
          className="font-heading font-black text-white text-center mb-10"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}
        >
          <T>AI predicts surplus.</T><br />
          <span className="text-accent-orange"><T>NGOs collect it.</T></span>
        </h2>

        {/* HUD cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
          {SOLUTION_CARDS.map((card) => {
            const colorMap: Record<string, string> = {
              'accent-orange': '#FC8019',
              'accent-turquoise': '#30D5C8',
              'accent-red': '#E23744',
            };
            const hex = colorMap[card.color] ?? '#FC8019';
            return (
              <div
                key={card.id}
                className="relative glass p-5 hud-corner"
                style={{ borderColor: `${hex}22` }}
              >
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-3 h-3" style={{ borderTop: `1px solid ${hex}`, borderLeft: `1px solid ${hex}` }} />
                <div className="absolute bottom-0 right-0 w-3 h-3" style={{ borderBottom: `1px solid ${hex}`, borderRight: `1px solid ${hex}` }} />

                <p className="text-2xl mb-3">{card.icon}</p>
                <p className="font-heading font-bold text-white text-sm mb-2" style={{ letterSpacing: '0.08em' }}>
                  <T>{card.title}</T>
                </p>
                <p className="font-body text-text-secondary text-sm leading-relaxed mb-4"><T>{card.desc}</T></p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-heading font-black text-2xl" style={{ color: hex }}>{card.stat}</span>
                  <span className="font-body text-xs text-text-secondary"><T>{card.statLabel}</T></span>
                </div>

                {/* Live data from API */}
                {card.id === 'prediction' && dashData.avgEfficiencyRate && (
                  <p className="font-body text-xs mt-2" style={{ color: hex }}>
                    ▲ {(dashData.avgEfficiencyRate * 100).toFixed(1)}% efficiency today
                  </p>
                )}
                {card.id === 'ngo' && dashData.totalWasteKg && (
                  <p className="font-body text-xs mt-2" style={{ color: hex }}>
                    ▲ {dashData.totalWasteKg.toFixed(0)}kg tracked
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ━━━━━━ PHASE 3 — Impact ━━━━━━ */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-8"
        style={{ opacity: phase3Opacity, y: phase3TranslateY }}
      >
        <p className="font-body text-accent-turquoise text-xs tracking-widest uppercase mb-4 text-center" style={{ letterSpacing: '0.2em' }}>
          <T>MISSION IMPACT</T>
        </p>
        <h2
          className="font-heading font-black text-center mb-4"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            ...(theme === 'light'
              ? {
                  color: 'var(--text)',
                  background: 'none',
                  WebkitBackgroundClip: 'initial',
                  WebkitTextFillColor: 'initial',
                }
              : {
                  background: 'linear-gradient(135deg, #30D5C8, #ffffff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }),
            lineHeight: 1.05,
          }}
        >
          <T>Predict Waste.</T><br /><T>Feed People.</T>
        </h2>
        <p className="font-body text-text-secondary text-base text-center max-w-md mb-12">
          <T>Every prediction. Every donation. Every meal. Tracked in real time.</T>
        </p>

        {/* Bottom edge — scroll prompt */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-px bg-accent-turquoise opacity-40" />
          <p className="font-body text-xs text-text-secondary tracking-widest uppercase" style={{ letterSpacing: '0.2em' }}><T>Scroll to explore</T></p>
          <div className="w-16 h-px bg-accent-turquoise opacity-40" />
        </div>
      </motion.div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-carbon z-10">
        <motion.div
          className="h-full"
          style={{
            width: bottomProgressWidth,
            backgroundColor: accentColor,
          }}
        />
      </div>

      {/* Screen-reader text summary */}
      <p className="sr-only">
        AHAR scrollytelling experience. Phase 1: One third of food produced globally is wasted while millions go hungry.
        Phase 2: AHAR uses AI to predict food surplus, redistributes via NGO network with smart routing.
        Phase 3: Our mission — Predict Waste. Feed People. Real meals saved, tracked every day.
      </p>
    </div>
  );
}
