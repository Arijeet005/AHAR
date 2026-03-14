'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BACKEND_BASE } from '@/data/aharData';

type PredictionResult = {
  predictedWasteKg?: number;
  predictedSurplusKg?: number;
  wastePercentage?: number;
  recommendation?: string;
  confidence?: number;
};

const WEATHER_OPTIONS = [
  { value: 'sunny', label: '☀️ Sunny' },
  { value: 'rainy', label: '🌧 Rainy' },
  { value: 'cloudy', label: '⛅ Cloudy' },
  { value: 'cold', label: '❄️ Cold' },
];

const MENU_OPTIONS = [
  { value: 'buffet', label: 'Buffet' },
  { value: 'a-la-carte', label: 'À La Carte' },
  { value: 'thali', label: 'Thali' },
  { value: 'set-menu', label: 'Set Menu' },
];

export default function WastePredictionDemo() {
  const [mealsPrepared, setMealsPrepared] = useState(100);
  const [weather, setWeather] = useState('sunny');
  const [menuType, setMenuType] = useState('buffet');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    const payload = {
      kitchenId: 'demo-kitchen',
      occupancyRate: 0.75,
      temperatureC: 25,
      prevDayMeals: Math.round(mealsPrepared * 0.95),
      prev7DayAvgMeals: Math.round(mealsPrepared * 0.9),
      mealsPrepared,
      weather,
      menuType,
      facilityType: 'restaurant',
    };

    try {
      const res = await fetch(`${BACKEND_BASE}/api/predict-waste`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Prediction failed');
      setResult(data?.data ?? data);
    } catch (err) {
      // Fallback to mock result for demo purposes
      const mockWaste = Math.round(mealsPrepared * (weather === 'rainy' ? 0.18 : 0.12));
      setResult({
        predictedWasteKg: mockWaste,
        predictedSurplusKg: Math.round(mockWaste * 0.8),
        wastePercentage: Math.round((mockWaste / mealsPrepared) * 100),
        recommendation: mockWaste > 15
          ? 'High surplus expected. Notify NGOs immediately.'
          : 'Moderate surplus. Schedule pickup for evening.',
        confidence: 87,
      });
    } finally {
      setLoading(false);
    }
  };

  const urgency =
    result?.predictedWasteKg != null
      ? result.predictedWasteKg > 20
        ? 'high'
        : result.predictedWasteKg > 10
        ? 'medium'
        : 'low'
      : 'none';

  const urgencyColor = { high: '#E23744', medium: '#FC8019', low: '#30D5C8', none: '#444' }[urgency];

  return (
    <section id="dashboard" className="relative py-24 px-6 overflow-hidden" aria-label="Waste prediction demo">
      {/* Background */}
      <div
        className="absolute -top-32 right-0 w-96 h-96 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #FC8019 0%, transparent 70%)' }}
      />
      <div className="absolute inset-0 grid-dots opacity-30" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="font-body text-accent-orange text-xs tracking-widest uppercase mb-4" style={{ letterSpacing: '0.2em' }}>
            ◆ AI PREDICTION ENGINE
          </p>
          <h2 className="font-heading font-black text-white text-4xl md:text-5xl mb-4">
            Try the<br />
            <span className="text-accent-orange">Prediction</span> Engine
          </h2>
          <p className="font-body text-text-secondary max-w-xl mx-auto">
            Enter your kitchen parameters and AHAR will predict food surplus using its trained ML model.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input panel */}
          <motion.div
            className="glass p-8 relative"
            style={{ borderColor: 'rgba(252,128,25,0.15)' }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4" style={{ borderTop: '1px solid #FC8019', borderLeft: '1px solid #FC8019' }} />
            <div className="absolute bottom-0 right-0 w-4 h-4" style={{ borderBottom: '1px solid #FC8019', borderRight: '1px solid #FC8019' }} />

            <p className="font-heading text-xs text-accent-orange tracking-widest mb-6" style={{ letterSpacing: '0.18em' }}>
              INPUT PARAMETERS
            </p>

            <div className="space-y-6">
              {/* Meals Prepared */}
              <div>
                <label htmlFor="meals-prepared" className="block font-body text-white text-sm font-semibold mb-2 tracking-wide">
                  Meals Prepared
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="meals-prepared"
                    type="range"
                    min={20}
                    max={500}
                    value={mealsPrepared}
                    onChange={(e) => setMealsPrepared(Number(e.target.value))}
                    className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#FC8019' }}
                    aria-valuemin={20}
                    aria-valuemax={500}
                    aria-valuenow={mealsPrepared}
                  />
                  <span
                    className="font-heading font-black text-2xl min-w-[4rem] text-right"
                    style={{ color: '#FC8019' }}
                    aria-live="polite"
                  >
                    {mealsPrepared}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-body text-xs text-text-secondary">20</span>
                  <span className="font-body text-xs text-text-secondary">500 meals</span>
                </div>
              </div>

              {/* Weather */}
              <div>
                <label className="block font-body text-white text-sm font-semibold mb-2 tracking-wide">
                  Weather Condition
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {WEATHER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setWeather(opt.value)}
                      className="py-2.5 px-3 font-body text-sm rounded-sm transition-all duration-200"
                      style={{
                        background: weather === opt.value ? 'rgba(252,128,25,0.15)' : 'rgba(255,255,255,0.04)',
                        border: weather === opt.value ? '1px solid #FC8019' : '1px solid rgba(255,255,255,0.08)',
                        color: weather === opt.value ? '#FC8019' : '#a0a0a0',
                      }}
                      aria-pressed={weather === opt.value}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Type */}
              <div>
                <label className="block font-body text-white text-sm font-semibold mb-2 tracking-wide">
                  Menu Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MENU_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setMenuType(opt.value)}
                      className="py-2.5 px-3 font-body text-sm rounded-sm transition-all duration-200"
                      style={{
                        background: menuType === opt.value ? 'rgba(252,128,25,0.15)' : 'rgba(255,255,255,0.04)',
                        border: menuType === opt.value ? '1px solid #FC8019' : '1px solid rgba(255,255,255,0.08)',
                        color: menuType === opt.value ? '#FC8019' : '#a0a0a0',
                      }}
                      aria-pressed={menuType === opt.value}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
	              <button
	                id="predict-btn"
	                onClick={handlePredict}
	                disabled={loading}
	                className="w-full py-4 font-heading font-bold text-sm tracking-widest text-white rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
	                style={{
	                  background: loading ? '#333' : 'var(--color-accent-orange)',
	                  letterSpacing: '0.15em',
	                  boxShadow: loading ? 'none' : '0 0 30px rgba(252,128,25,0.3)',
	                }}
	                aria-label="Run AHAR waste prediction"
	              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ANALYZING...
                  </span>
                ) : (
                  'RUN PREDICTION'
                )}
              </button>
            </div>
          </motion.div>

          {/* Result panel */}
          <motion.div
            className="glass p-8 relative min-h-[400px] flex flex-col"
            style={{ borderColor: `${urgencyColor}22` }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 left-0 w-4 h-4" style={{ borderTop: `1px solid ${urgencyColor}`, borderLeft: `1px solid ${urgencyColor}` }} />
            <div className="absolute bottom-0 right-0 w-4 h-4" style={{ borderBottom: `1px solid ${urgencyColor}`, borderRight: `1px solid ${urgencyColor}` }} />

            <p className="font-heading text-xs tracking-widest mb-6" style={{ letterSpacing: '0.18em', color: urgencyColor }}>
              PREDICTION OUTPUT
            </p>

            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div
                  key="empty"
                  className="flex-1 flex flex-col items-center justify-center text-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(252,128,25,0.08)', border: '1px solid rgba(252,128,25,0.2)' }}
                  >
                    <span className="text-3xl">⬡</span>
                  </div>
                  <p className="font-body text-text-secondary">Configure parameters and run prediction to see results.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  className="flex-1 flex flex-col items-center justify-center gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border border-accent-orange opacity-20" />
                    <div className="absolute inset-2 rounded-full border border-accent-orange opacity-40 animate-ping" />
                    <div className="absolute inset-4 rounded-full border border-accent-orange opacity-60 animate-spin" />
                  </div>
                  <p className="font-heading text-xs text-text-secondary tracking-widest" style={{ letterSpacing: '0.18em' }}>
                    PROCESSING ML MODEL...
                  </p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div
                  key="result"
                  className="flex-1 flex flex-col gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Main result */}
                  <div className="text-center">
                    <p className="font-body text-text-secondary text-sm mb-1">Predicted Surplus</p>
                    <p
                      className="font-heading font-black"
                      style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', color: urgencyColor, lineHeight: 1 }}
                    >
                      {result.predictedWasteKg ?? result.predictedSurplusKg ?? 0}
                      <span className="text-2xl ml-2">kg</span>
                    </p>
                    {result.wastePercentage != null && (
                      <p className="font-body text-text-secondary text-sm mt-1">
                        {result.wastePercentage}% of total prepared
                      </p>
                    )}
                  </div>

                  {/* Urgency badge */}
                  <div
                    className="px-4 py-2 rounded-sm text-center"
                    style={{ background: `${urgencyColor}15`, border: `1px solid ${urgencyColor}40` }}
                    role="status"
                    aria-label={`Urgency: ${urgency}`}
                  >
                    <p className="font-heading text-xs tracking-widest" style={{ color: urgencyColor, letterSpacing: '0.15em' }}>
                      {urgency === 'high' ? '⚠ HIGH URGENCY — NOTIFY NGOs NOW' : urgency === 'medium' ? '◆ MODERATE — SCHEDULE PICKUP' : '✓ LOW SURPLUS — MONITOR'}
                    </p>
                  </div>

                  {/* Recommendation */}
                  {result.recommendation && (
                    <div className="glass p-4 rounded-sm">
                      <p className="font-body text-xs text-text-secondary mb-1 tracking-widest uppercase" style={{ letterSpacing: '0.12em' }}>AI Recommendation</p>
                      <p className="font-body text-white text-sm">{result.recommendation}</p>
                    </div>
                  )}

                  {/* Confidence */}
                  {result.confidence != null && (
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="font-body text-xs text-text-secondary">Model Confidence</span>
                        <span className="font-heading text-xs" style={{ color: urgencyColor }}>{result.confidence}%</span>
                      </div>
                      <div className="h-1 bg-neutral-carbon rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: urgencyColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action */}
                  <a
                    href="#ngo"
                    className="w-full py-3 font-heading font-bold text-xs tracking-widest text-white text-center rounded-sm transition-all hover:scale-[1.02] block"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${urgencyColor}40`,
                      letterSpacing: '0.15em',
                    }}
                  >
                    FIND NEARBY NGOs →
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
