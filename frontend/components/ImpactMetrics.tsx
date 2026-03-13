'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { METRICS_LABELS, BACKEND_BASE } from '@/data/aharData';

type MetricsData = {
  mealsProvided?: number;
  foodSavedKg?: number;
  co2ReducedKg?: number;
  [key: string]: number | undefined;
};

function AnimatedCounter({
  target,
  duration = 2.5,
  suffix = '',
  unit = '',
}: {
  target: number;
  duration?: number;
  suffix?: string;
  unit?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const raf = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, target, duration]);

  const formatted = count.toLocaleString();
  return (
    <span ref={ref} aria-label={`${formatted}${unit}${suffix}`}>
      {formatted}
      {unit && <span className="text-xl ml-1">{unit}</span>}
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

export default function ImpactMetrics() {
  const [metrics, setMetrics] = useState<MetricsData>({
    mealsProvided: 24780,
    foodSavedKg: 8320,
    co2ReducedKg: 14560,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_BASE}/api/analytics/waste-dashboard`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.data) {
          const data = d.data;
          setMetrics({
            mealsProvided: data.totalMealsProvided ?? metrics.mealsProvided,
            foodSavedKg: data.totalWasteKg ? data.totalWasteKg * 0.6 : metrics.foodSavedKg,
            co2ReducedKg: data.totalWasteKg ? data.totalWasteKg * 1.75 : metrics.co2ReducedKg,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const colorMap: Record<string, string> = {
    'accent-turquoise': '#30D5C8',
    'accent-orange': '#FC8019',
    'accent-red': '#E23744',
  };

  return (
    <section
      id="features"
      className="relative py-24 px-6 overflow-hidden"
      aria-label="Impact metrics"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 grid-dots opacity-50" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(48,213,200,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="font-body text-accent-turquoise text-xs tracking-widest uppercase mb-4" style={{ letterSpacing: '0.2em' }}>
            ◆ REAL-TIME IMPACT
          </p>
          <h2 className="font-heading font-black text-white text-4xl md:text-5xl mb-4">
            Every Number<br />
            <span className="text-accent-turquoise">Tells a Story</span>
          </h2>
          <p className="font-body text-text-secondary max-w-xl mx-auto">
            Live data from the AHAR platform. Updated with every donation and prediction.
          </p>
        </motion.div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {METRICS_LABELS.map((metric, i) => {
            const hex = colorMap[metric.color] ?? '#30D5C8';
            const value = metrics[metric.key] ?? 0;
            return (
              <motion.div
                key={metric.key}
                className="relative glass p-8 text-center overflow-hidden"
                style={{ borderColor: `${hex}1A` }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4" style={{ borderTop: `1px solid ${hex}`, borderLeft: `1px solid ${hex}` }} />
                <div className="absolute bottom-0 right-0 w-4 h-4" style={{ borderBottom: `1px solid ${hex}`, borderRight: `1px solid ${hex}` }} />

                {/* Ambient glow */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at center, ${hex}0A 0%, transparent 70%)` }}
                />

                <p className="text-4xl mb-4">{metric.icon}</p>

                <div
                  className="font-heading font-black mb-2"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: hex }}
                  aria-live="polite"
                >
                  {loading ? (
                    <span className="opacity-40">—</span>
                  ) : (
                    <AnimatedCounter
                      target={Math.round(value)}
                      suffix={metric.suffix}
                      unit={metric.unit}
                    />
                  )}
                </div>
                <p className="font-body text-white font-semibold text-lg mb-1">{metric.label}</p>
                <p className="font-body text-text-secondary text-sm">and counting</p>

                {/* Bottom accent line */}
                <div className="mt-6 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${hex}60, transparent)` }} />
              </motion.div>
            );
          })}
        </div>

        {/* Tagline */}
        <motion.div
          className="text-center mt-16 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="font-heading text-xl text-white">
            Powered by <span className="text-accent-orange">AI</span>. Driven by <span className="text-accent-turquoise">Purpose</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
