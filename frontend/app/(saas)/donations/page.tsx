'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardTitle } from '@/components/ui/Card';
import { SubTabs } from '@/components/ui/SubTabs';
import { Badge } from '@/components/ui/Badge';
import NGOLocator from '@/components/NGOLocator';
import { useTranslate, T } from '@/hooks/useTranslate';

type DonTab = 'nearest' | 'history' | 'map';

function DonationsPageContent() {
  const [tab, setTab] = useState<DonTab>('map');
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  // Tab label translations
  const tNearestNGOs = useTranslate('Nearest NGOs');
  const tHistory = useTranslate('History');
  const tMap = useTranslate('Map (optional)');

  useEffect(() => {
    if (tabParam !== 'nearest' && tabParam !== 'history' && tabParam !== 'map') return;
    setTab(tabParam);
  }, [tabParam]);

  const tabs = useMemo(
    () => [
<<<<<<< HEAD
      { key: 'nearest' as const, label: tNearestNGOs },
      { key: 'history' as const, label: tHistory },
      { key: 'map' as const, label: tMap },
=======
      { key: 'map' as const, label: 'Map' },
      { key: 'nearest' as const, label: 'Nearest NGOs' },
      { key: 'history' as const, label: 'History' },
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841
    ],
    [tNearestNGOs, tHistory, tMap]
  );

  const ngos = useMemo(
    () => [
      { name: 'Robin Hood Army', dist: 2.3, desc: 'Rapid pickup partner for cooked food.', phone: '+91-98xxxxxx02' },
      { name: 'Feeding India Network', dist: 4.1, desc: 'Packaged and raw accepted with scheduling.', phone: '+91-98xxxxxx03' },
      { name: 'No Food Waste India', dist: 6.0, desc: 'Night pickups supported in select zones.', phone: '+91-98xxxxxx04' },
    ],
    []
  );

  const history = useMemo(
    () => [
      { date: '2026-03-11', ngo: 'Robin Hood Army', type: 'Cooked', qty: '35 plates', status: 'Completed' },
      { date: '2026-03-07', ngo: 'Feeding India Network', type: 'Packaged', qty: '18 boxes', status: 'In Transit' },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-5">
      <SubTabs items={tabs} active={tab} onChange={setTab} />

      {tab === 'nearest' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {ngos
            .slice()
            .sort((a, b) => a.dist - b.dist)
            .map((ngo) => (
              <Card key={ngo.name} className="p-5 border border-white/10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-heading font-black text-lg text-text-primary">{ngo.name}</p>
                    <p className="font-body text-sm text-text-secondary mt-1">{ngo.desc}</p>
                  </div>
                  <Badge tone="good">{ngo.dist.toFixed(1)} km</Badge>
                </div>
                <p className="font-body text-xs text-text-secondary mt-4"><T>Contact:</T> {ngo.phone}</p>
                <div className="mt-4 flex flex-wrap gap-2">
<<<<<<< HEAD
                  <button
                    className="px-4 py-2 rounded-sm font-heading text-xs tracking-widest"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-accent-turquoise), var(--color-accent-orange))',
                      color: 'var(--color-text-primary)',
                      letterSpacing: '0.14em',
                    }}
                  >
                    <T>VIEW DETAILS</T>
                  </button>
=======
	                  <button
	                    className="px-4 py-2 rounded-sm font-heading text-xs tracking-widest"
	                    style={{
	                      background: 'var(--color-accent-turquoise)',
	                      color: '#fff',
	                      letterSpacing: '0.14em',
	                    }}
	                  >
	                    VIEW DETAILS
	                  </button>
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841
                  <button
                    className="px-4 py-2 rounded-sm font-heading text-xs tracking-widest"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'var(--color-text-primary)',
                      letterSpacing: '0.14em',
                    }}
                  >
                    <T>REQUEST PICKUP</T>
                  </button>
                </div>
              </Card>
            ))}
        </div>
      )}

      {tab === 'history' && (
        <Card className="p-5 border border-white/10 overflow-x-auto">
          <CardTitle><T>Past Donations</T></CardTitle>
          <table className="w-full mt-4 text-sm">
            <thead>
              <tr className="text-text-secondary font-body text-xs">
                {['Date', 'NGO', 'Food Type', 'Quantity', 'Status'].map((h) => (
                  <th key={h} className="text-left py-2 pr-3 whitespace-nowrap">
                    <T>{h}</T>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr key={row.date + row.ngo} className="border-t border-white/10">
                  <td className="py-2 pr-3 whitespace-nowrap text-text-primary">{row.date}</td>
                  <td className="py-2 pr-3 whitespace-nowrap text-text-secondary">{row.ngo}</td>
                  <td className="py-2 pr-3 whitespace-nowrap text-text-secondary">{row.type}</td>
                  <td className="py-2 pr-3 whitespace-nowrap text-text-secondary">{row.qty}</td>
                  <td className="py-2 pr-3 whitespace-nowrap">
                    <Badge tone={row.status === 'Completed' ? 'good' : 'warn'}><T>{row.status}</T></Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'map' && (
        <div className="flex flex-col gap-4">
          <Card className="p-5 border border-white/10">
            <CardTitle><T>Map</T></CardTitle>
            <p className="font-body text-sm text-text-secondary mt-2"><T>This embeds your existing NGO locator map module.</T></p>
          </Card>
          <NGOLocator />
        </div>
      )}
    </div>
  );
}

export default function DonationsPage() {
  return (
    <Suspense fallback={null}>
      <DonationsPageContent />
    </Suspense>
  );
}
