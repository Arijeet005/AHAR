'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardTitle } from '@/components/ui/Card';
import { SubTabs } from '@/components/ui/SubTabs';
import { Sparkline } from '@/components/ui/Charts';
import { Badge } from '@/components/ui/Badge';

type DashTab = 'key' | 'range' | 'reports';

export default function DashboardView({ tabFromQuery }: { tabFromQuery?: DashTab }) {
  const [tab, setTab] = useState<DashTab>(tabFromQuery ?? 'key');
  const [range, setRange] = useState<'1w' | '1m' | '1y' | 'all'>('1m');

  useEffect(() => {
    if (!tabFromQuery) return;
    setTab(tabFromQuery);
  }, [tabFromQuery]);

  const tabs = useMemo(
    () => [
      { key: 'key' as const, label: 'Key Analytics' },
      { key: 'range' as const, label: 'Time Range Analytics' },
      { key: 'reports' as const, label: 'Reports' },
    ],
    []
  );

  const history = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => {
        // Keep SSR/CSR deterministic to avoid hydration mismatch.
        const base = Date.parse('2026-03-13T00:00:00.000Z');
        const waste = Math.max(0, Math.round(12 + Math.sin(i / 2) * 5 + i * 0.6));
        const predicted = 220 + i * 10;
        const expected = 200 + i * 9;
        const efficiency = Math.max(0, Math.min(100, Math.round(88 - waste * 0.6)));
        const risk = waste > 18 ? 'High' : 'Low';
        return {
          date: new Date(base - i * 86400000).toISOString().slice(0, 10),
          expected,
          predicted,
          waste,
          efficiency,
          risk,
          donation: waste > 16 ? 'Yes' : 'No',
        };
      }),
    []
  );

  const wasteTrend = useMemo(() => history.slice().reverse().map((h) => h.waste), [history]);
  const efficiencyTrend = useMemo(() => history.slice().reverse().map((h) => h.efficiency), [history]);

  return (
    <div className="flex flex-col gap-5">
      <SubTabs items={tabs} active={tab} onChange={setTab} />

      {tab === 'key' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
            {[
              { label: 'Total Predictions Run', value: '1,284' },
              { label: 'Total Estimated Waste', value: '18,920 plates' },
              { label: 'Avg Waste / Prediction', value: '14.7 plates' },
              { label: 'Overall Efficiency Rate', value: '88.2%' },
              { label: 'Money Saved', value: 'INR 2.4L' },
              { label: 'Plates Saved', value: '9,120' },
            ].map((kpi) => (
              <Card key={kpi.label} className="p-4 border border-white/10">
                <CardTitle>{kpi.label}</CardTitle>
                <p className="font-heading font-black text-2xl mt-2 text-text-primary">{kpi.value}</p>
                <div
                  className="mt-3 h-px w-full"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(48,213,200,0.3), transparent)' }}
                />
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card className="p-5 xl:col-span-2 border border-white/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Waste Trend</CardTitle>
                  <p className="font-body text-xs text-text-secondary mt-1">Last N predictions</p>
                </div>
                <Badge tone="warn">LIVE</Badge>
              </div>
              <div className="mt-4">
                <Sparkline data={wasteTrend} stroke="var(--color-accent-orange)" fill="rgba(252,128,25,0.14)" />
              </div>
            </Card>

            <Card className="p-5 border border-white/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Efficiency Progress</CardTitle>
                  <p className="font-body text-xs text-text-secondary mt-1">Higher is better</p>
                </div>
                <Badge tone="good">OK</Badge>
              </div>
              <div className="mt-4">
                <Sparkline data={efficiencyTrend} />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card className="p-5 xl:col-span-1 border border-white/10">
              <CardTitle>Latest Prediction Snapshot</CardTitle>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { k: 'Date & time', v: 'Today, 7:30 PM' },
                  { k: 'Expected People', v: '240' },
                  { k: 'Predicted Quantity', v: '265 plates' },
                  { k: 'Estimated Waste', v: '16 plates' },
                  { k: 'Day of Week', v: 'Fri' },
                  { k: 'Weather', v: 'Clear' },
                  { k: 'Event Multiplier', v: '1.10x' },
                  { k: 'Weather Multiplier', v: '1.00x' },
                ].map((row) => (
                  <div key={row.k} className="glass p-3 rounded-sm border border-white/10">
                    <p className="font-body text-[11px] text-text-secondary">{row.k}</p>
                    <p className="font-heading font-bold text-sm mt-1 text-text-primary">{row.v}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 xl:col-span-2 border border-white/10 overflow-x-auto">
              <CardTitle>Prediction History</CardTitle>
              <table className="w-full mt-4 text-sm">
                <thead>
                  <tr className="text-text-secondary font-body text-xs">
                    {['Date', 'Expected', 'Predicted', 'Waste', 'Efficiency', 'Risk', 'Donation'].map((h) => (
                      <th key={h} className="text-left py-2 pr-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr key={row.date} className="border-t border-white/10">
                      <td className="py-2 pr-3 whitespace-nowrap text-text-primary">{row.date}</td>
                      <td className="py-2 pr-3 whitespace-nowrap text-text-secondary">{row.expected}</td>
                      <td className="py-2 pr-3 whitespace-nowrap text-text-secondary">{row.predicted}</td>
                      <td className="py-2 pr-3 whitespace-nowrap text-text-secondary">{row.waste}</td>
                      <td className="py-2 pr-3 whitespace-nowrap text-text-secondary">{row.efficiency}%</td>
                      <td className="py-2 pr-3 whitespace-nowrap">
                        <Badge tone={row.risk === 'High' ? 'bad' : 'good'}>{row.risk}</Badge>
                      </td>
                      <td className="py-2 pr-3 whitespace-nowrap">
                        <Badge tone={row.donation === 'Yes' ? 'warn' : 'neutral'}>{row.donation}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </>
      )}

      {tab === 'range' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { k: '1w' as const, label: '1 Week' },
              { k: '1m' as const, label: '1 Month' },
              { k: '1y' as const, label: '1 Year' },
              { k: 'all' as const, label: 'All Time' },
            ].map((b) => {
              const isActive = range === b.k;
              return (
                <button
                  key={b.k}
                  className="px-4 py-2 rounded-sm font-body text-xs tracking-widest"
                  onClick={() => setRange(b.k)}
                  style={{
                    letterSpacing: '0.14em',
                    background: isActive ? 'rgba(252,128,25,0.12)' : 'rgba(255,255,255,0.04)',
                    border: isActive ? '1px solid rgba(252,128,25,0.3)' : '1px solid rgba(255,255,255,0.08)',
                    color: isActive ? 'var(--color-accent-orange)' : 'var(--color-text-secondary)',
                  }}
                >
                  {b.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card className="p-5 xl:col-span-2 border border-white/10">
              <CardTitle>Waste + Efficiency Over Time</CardTitle>
              <p className="font-body text-xs text-text-secondary mt-1">Range: {range.toUpperCase()}</p>
              <div className="mt-4">
                <Sparkline data={wasteTrend} stroke="var(--color-accent-red)" fill="rgba(226,55,68,0.14)" />
                <div className="mt-2">
                  <Sparkline data={efficiencyTrend} />
                </div>
              </div>
            </Card>

            <Card className="p-5 border border-white/10">
              <CardTitle>Donations Recommended</CardTitle>
              <p className="font-body text-xs text-text-secondary mt-1">Count over time</p>
              <div className="mt-4">
                <Sparkline
                  data={history.slice().reverse().map((h) => (h.donation === 'Yes' ? 1 : 0))}
                  stroke="var(--color-accent-orange)"
                  fill="rgba(252,128,25,0.14)"
                />
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="p-5 border border-white/10">
            <CardTitle>Download Weekly Report (PDF)</CardTitle>
            <p className="font-body text-sm text-text-secondary mt-2">Executive summary of waste and efficiency.</p>
	            <button
	              className="mt-4 w-full py-2.5 rounded-sm font-heading text-xs tracking-widest"
	              style={{
	                background: 'var(--color-accent-orange)',
	                color: '#fff',
	                letterSpacing: '0.14em',
	              }}
	            >
	              DOWNLOAD
            </button>
          </Card>

          <Card className="p-5 border border-white/10">
            <CardTitle>Download Monthly Report (PDF)</CardTitle>
            <p className="font-body text-sm text-text-secondary mt-2">Trends, anomalies, and actions.</p>
	            <button
	              className="mt-4 w-full py-2.5 rounded-sm font-heading text-xs tracking-widest"
	              style={{
	                background: 'var(--color-accent-turquoise)',
	                color: '#fff',
	                letterSpacing: '0.14em',
	              }}
	            >
	              DOWNLOAD
            </button>
          </Card>

          <Card className="p-5 border border-white/10">
            <CardTitle>Download Custom CSV</CardTitle>
            <p className="font-body text-sm text-text-secondary mt-2">Export raw prediction history.</p>
            <button
              className="mt-4 w-full py-2.5 rounded-sm font-heading text-xs tracking-widest"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: 'var(--color-text-primary)',
                letterSpacing: '0.14em',
              }}
            >
              EXPORT
            </button>
          </Card>

          <Card className="p-5 border border-white/10 xl:col-span-3">
            <CardTitle>Generate Report</CardTitle>
            <div className="mt-4 flex flex-col md:flex-row gap-3">
              <input
                className="glass px-3 py-2 rounded-sm font-body text-sm text-text-primary border border-white/10"
                type="date"
                aria-label="Start date"
              />
              <input
                className="glass px-3 py-2 rounded-sm font-body text-sm text-text-primary border border-white/10"
                type="date"
                aria-label="End date"
              />
	              <button
	                className="px-5 py-2.5 rounded-sm font-heading text-xs tracking-widest"
	                style={{
	                  background: 'var(--color-accent-red)',
	                  color: '#fff',
	                  letterSpacing: '0.14em',
	                }}
	              >
	                GENERATE
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
