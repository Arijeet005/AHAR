'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardTitle } from '@/components/ui/Card';
import { T, useTranslate } from '@/hooks/useTranslate';

type Weather = 'Clear' | 'Rain' | 'Cloudy';
type EventType = 'Normal' | 'Wedding' | 'Conference' | 'Festival';

export default function PredictionView() {
  const [query, setQuery] = useState('');
  const [expectedPeople, setExpectedPeople] = useState(220);
  // Keep SSR/CSR deterministic to avoid hydration mismatch. We'll update on mount.
  const [dateTime, setDateTime] = useState('2026-03-13T19:30');
  const [weather, setWeather] = useState<Weather>('Clear');
  const [eventType, setEventType] = useState<EventType>('Normal');
  const [eventMultiplier, setEventMultiplier] = useState(1.0);
  const [result, setResult] = useState<null | { predicted: number; waste: number; efficiency: number; rec: 'Donate' | 'Normal' }>(
    null
  );
  const contextPlaceholder = useTranslate('Add food / menu context...');

  useEffect(() => {
    setDateTime(new Date().toISOString().slice(0, 16));
  }, []);

  const weatherMultiplier = useMemo(() => (weather === 'Rain' ? 0.94 : weather === 'Cloudy' ? 0.98 : 1.0), [weather]);

  const run = () => {
    const base = expectedPeople * (0.98 + Math.min(0.08, Math.max(0, query.length / 1200)));
    const predicted = Math.round(base * eventMultiplier * weatherMultiplier);
    const waste = Math.max(0, Math.round(predicted * 0.06));
    const efficiency = Math.max(0, Math.min(100, Math.round(92 - waste * 0.4)));
    setResult({ predicted, waste, efficiency, rec: waste >= 14 ? 'Donate' : 'Normal' });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <Card className="p-5 border border-white/10 xl:col-span-2">
        <CardTitle><T>AI Demand Prediction</T></CardTitle>
        <p className="font-body text-sm text-text-secondary mt-2">
          <T>Enter meal context and operational signals. AHAR estimates plates required and potential waste.</T>
        </p>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <p className="font-body text-xs text-text-secondary mb-2"><T>Meal context (MyFitnessPal style)</T></p>
            <div className="glass border border-white/10 rounded-sm flex items-center gap-2 px-3 py-2.5">
              <span className="text-text-secondary">⌕</span>
              <input
                className="bg-transparent outline-none w-full font-body text-sm text-text-primary"
                placeholder={contextPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <p className="font-body text-xs text-text-secondary mb-2"><T>Expected People</T></p>
            <input
              className="glass w-full border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary"
              type="number"
              value={expectedPeople}
              onChange={(e) => setExpectedPeople(Number(e.target.value))}
              min={0}
            />
          </div>

          <div>
            <p className="font-body text-xs text-text-secondary mb-2"><T>Date & Time</T></p>
            <input
              className="glass w-full border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </div>

          <div>
            <p className="font-body text-xs text-text-secondary mb-2"><T>Weather</T></p>
            <select
              className="glass w-full border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary"
              value={weather}
              onChange={(e) => setWeather(e.target.value as Weather)}
            >
              <option value="Clear"><T>Clear</T></option>
              <option value="Cloudy"><T>Cloudy</T></option>
              <option value="Rain"><T>Rain</T></option>
            </select>
          </div>

          <div>
            <p className="font-body text-xs text-text-secondary mb-2"><T>Event Type</T></p>
            <select
              className="glass w-full border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary"
              value={eventType}
              onChange={(e) => {
                const v = e.target.value as EventType;
                setEventType(v);
                setEventMultiplier(v === 'Wedding' ? 1.2 : v === 'Conference' ? 1.1 : v === 'Festival' ? 1.25 : 1.0);
              }}
            >
              <option value="Normal"><T>Normal</T></option>
              <option value="Wedding"><T>Wedding</T></option>
              <option value="Conference"><T>Conference</T></option>
              <option value="Festival"><T>Festival</T></option>
            </select>
          </div>

          <div>
            <p className="font-body text-xs text-text-secondary mb-2"><T>Event Multiplier</T></p>
            <input
              className="glass w-full border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary"
              type="number"
              step="0.01"
              value={eventMultiplier}
              onChange={(e) => setEventMultiplier(Number(e.target.value))}
              min={0.5}
              max={2.0}
            />
          </div>
        </div>

        <button
          className="mt-5 w-full md:w-auto px-6 py-3 rounded-sm font-heading text-xs tracking-widest"
          onClick={run}
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-orange), var(--color-accent-red))',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.14em',
          }}
        >
          <T>RUN PREDICTION</T>
        </button>
      </Card>

      <Card className="p-5 border border-white/10">
        <CardTitle><T>Prediction Result</T></CardTitle>
        <div className="mt-4">
          {!result ? (
            <p className="font-body text-sm text-text-secondary"><T>Run a prediction to see results.</T></p>
          ) : (
            <div className="flex flex-col gap-3">
              {[
                { k: 'Predicted Plates', v: `${result.predicted}` },
                { k: 'Estimated Waste', v: `${result.waste} plates` },
                { k: 'Efficiency Estimate', v: `${result.efficiency}%` },
                { k: 'Recommendation', v: result.rec === 'Donate' ? 'Donation Recommended' : 'Normal Service' },
              ].map((r) => (
                <div key={r.k} className="glass p-4 rounded-sm border border-white/10">
                  <p className="font-body text-xs text-text-secondary"><T>{r.k}</T></p>
                  <p className="font-heading font-black text-xl mt-2 text-text-primary"><T>{r.v}</T></p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
