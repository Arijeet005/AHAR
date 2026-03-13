'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardTitle } from '@/components/ui/Card';
import { SubTabs } from '@/components/ui/SubTabs';
import { Accordion } from '@/components/ui/Accordion';

type GuideTab = 'start' | 'features' | 'talk' | 'demo';

export default function GuidePage() {
  const [tab, setTab] = useState<GuideTab>('start');
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  useEffect(() => {
    if (tabParam !== 'start' && tabParam !== 'features' && tabParam !== 'talk' && tabParam !== 'demo') return;
    setTab(tabParam);
  }, [tabParam]);

  const tabs = useMemo(
    () => [
      { key: 'start' as const, label: 'Getting Started' },
      { key: 'features' as const, label: 'Features' },
      { key: 'talk' as const, label: 'Talk to Us' },
      { key: 'demo' as const, label: 'Free Demo' },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-5">
      <SubTabs items={tabs} active={tab} onChange={setTab} />

      {(tab === 'start' || tab === 'features') && (
        <Card className="p-5 border border-white/10">
          <CardTitle>{tab === 'start' ? 'Getting Started' : 'Features'}</CardTitle>
          <div className="mt-4">
            <Accordion
              items={[
                {
                  title: 'Dashboard',
                  body: 'Use Key Analytics to track waste trend, efficiency progress, and view the latest snapshot and history.',
                },
                {
                  title: 'Prediction',
                  body: 'Enter meal context, expected people, and multipliers, then run prediction to get waste risk and recommendation.',
                },
                {
                  title: 'Inventory Hub',
                  body: 'Track expiry and freshness. Use Add Item with Smart Autofill or New Item Entry.',
                },
                {
                  title: 'Donation Locator',
                  body: 'Find nearest NGOs and log donation history. Use map when needed.',
                },
              ]}
            />
          </div>
        </Card>
      )}

      {tab === 'talk' && (
        <Card className="p-5 border border-white/10 max-w-3xl">
          <CardTitle>Contact Us</CardTitle>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder="Name" />
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder="Email" />
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder="Organization" />
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder="Subject" />
            <textarea className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary min-h-28 md:col-span-2" placeholder="Message" />
          </div>
          <button
            className="mt-4 px-6 py-3 rounded-sm font-heading text-xs tracking-widest"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-red), var(--color-accent-orange))',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.14em',
            }}
          >
            SUBMIT
          </button>
        </Card>
      )}

      {tab === 'demo' && (
        <Card className="p-5 border border-white/10 max-w-3xl">
          <CardTitle>Request a Free Demo</CardTitle>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder="Name" />
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder="Email" />
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder="Phone" />
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder="Restaurant/Hotel Name" />
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" type="datetime-local" aria-label="Preferred Date & Time" />
            <select className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" defaultValue="Online">
              <option>Online</option>
              <option>On-site demo</option>
            </select>
          </div>
          <button
            className="mt-4 px-6 py-3 rounded-sm font-heading text-xs tracking-widest"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-turquoise), var(--color-accent-orange))',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.14em',
            }}
          >
            REQUEST DEMO
          </button>
        </Card>
      )}
    </div>
  );
}
