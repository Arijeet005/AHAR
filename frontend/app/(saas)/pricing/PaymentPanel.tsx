'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardTitle } from '@/components/ui/Card';
import { SubTabs } from '@/components/ui/SubTabs';

type PayTab = 'billing' | 'invoices' | 'methods';

export default function PaymentPanel() {
  const [tab, setTab] = useState<PayTab>('billing');
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  useEffect(() => {
    if (tabParam !== 'billing' && tabParam !== 'invoices' && tabParam !== 'methods') return;
    setTab(tabParam);
  }, [tabParam]);

  const tabs = useMemo(
    () => [
      { key: 'billing' as const, label: 'Billing' },
      { key: 'invoices' as const, label: 'Invoices' },
      { key: 'methods' as const, label: 'Payment Methods' },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-5">
      <SubTabs items={tabs} active={tab} onChange={setTab} />

      {tab === 'billing' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="p-5 border border-white/10 xl:col-span-2">
            <CardTitle>Current Plan</CardTitle>
            <p className="font-heading font-black text-3xl mt-3 text-text-primary">Pro</p>
            <p className="font-body text-sm text-text-secondary mt-2">Renewal: 2026-04-01</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                className="px-6 py-3 rounded-sm font-heading text-xs tracking-widest"
                style={{
                  background: 'var(--color-accent-red)',
                  color: '#fff',
                  letterSpacing: '0.14em',
                }}
              >
                UPGRADE
              </button>
              <button
                className="px-6 py-3 rounded-sm font-heading text-xs tracking-widest"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '0.14em',
                }}
              >
                MANAGE BILLING
              </button>
            </div>
          </Card>

          <Card className="p-5 border border-white/10">
            <CardTitle>Pricing Summary</CardTitle>
            <div className="mt-4 glass p-4 rounded-sm border border-white/10">
              <p className="font-body text-sm text-text-secondary">Monthly</p>
              <p className="font-heading font-black text-2xl text-text-primary mt-1">₹ 4,999</p>
            </div>
            <div className="mt-3 glass p-4 rounded-sm border border-white/10">
              <p className="font-body text-sm text-text-secondary">Yearly</p>
              <p className="font-heading font-black text-2xl text-text-primary mt-1">₹ 49,999</p>
            </div>
          </Card>
        </div>
      )}

      {tab === 'invoices' && (
        <Card className="p-5 border border-white/10">
          <CardTitle>Invoices</CardTitle>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {['2026-03', '2026-02', '2026-01'].map((m) => (
              <div key={m} className="glass p-4 rounded-sm border border-white/10">
                <p className="font-heading font-bold text-text-primary">{m}</p>
                <p className="font-body text-sm text-text-secondary mt-1">AHAR Pro Subscription</p>
                <button
                  className="mt-3 w-full py-2.5 rounded-sm font-heading text-xs tracking-widest"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '0.14em',
                  }}
                >
                  DOWNLOAD PDF
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'methods' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="p-5 border border-white/10 xl:col-span-2">
            <CardTitle>Stored Payment Methods</CardTitle>
            <div className="mt-4 flex flex-col gap-3">
              {[
                { brand: 'Visa', last4: '4242', exp: '08/28' },
                { brand: 'Mastercard', last4: '4444', exp: '11/27' },
              ].map((c) => (
                <div key={c.last4} className="glass p-4 rounded-sm border border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-heading font-bold text-text-primary">
                      {c.brand} •••• {c.last4}
                    </p>
                    <p className="font-body text-sm text-text-secondary mt-1">Expires {c.exp}</p>
                  </div>
                  <button
                    className="px-4 py-2 rounded-sm font-heading text-xs tracking-widest"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'var(--color-text-primary)',
                      letterSpacing: '0.14em',
                    }}
                  >
                    REMOVE
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 border border-white/10">
            <CardTitle>Add New Method</CardTitle>
            <p className="font-body text-sm text-text-secondary mt-2">Connect a new card (placeholder UI).</p>
            <button
              className="mt-4 w-full py-3 rounded-sm font-heading text-xs tracking-widest"
              style={{
                background: 'var(--color-accent-turquoise)',
                color: '#fff',
                letterSpacing: '0.14em',
              }}
            >
              ADD CARD
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
