'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardTitle } from '@/components/ui/Card';
import { SubTabs } from '@/components/ui/SubTabs';
import { useTranslate, T } from '@/hooks/useTranslate';

type PayTab = 'billing' | 'invoices' | 'methods';

export default function PaymentPage() {
  const [tab, setTab] = useState<PayTab>('billing');
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  // Tab label translations
  const tBilling = useTranslate('Billing');
  const tInvoices = useTranslate('Invoices');
  const tPaymentMethods = useTranslate('Payment Methods');

  useEffect(() => {
    if (tabParam !== 'billing' && tabParam !== 'invoices' && tabParam !== 'methods') return;
    setTab(tabParam);
  }, [tabParam]);

  const tabs = useMemo(
    () => [
      { key: 'billing' as const, label: tBilling },
      { key: 'invoices' as const, label: tInvoices },
      { key: 'methods' as const, label: tPaymentMethods },
    ],
    [tBilling, tInvoices, tPaymentMethods]
  );

  return (
    <div className="flex flex-col gap-5">
      <SubTabs items={tabs} active={tab} onChange={setTab} />

      {tab === 'billing' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="p-5 border border-white/10 xl:col-span-2">
            <CardTitle><T>Current Plan</T></CardTitle>
            <p className="font-heading font-black text-3xl mt-3 text-text-primary">Pro</p>
            <p className="font-body text-sm text-text-secondary mt-2"><T>Renewal:</T> 2026-04-01</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                className="px-6 py-3 rounded-sm font-heading text-xs tracking-widest"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent-red), var(--color-accent-orange))',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '0.14em',
                }}
              >
                <T>UPGRADE</T>
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
                <T>MANAGE BILLING</T>
              </button>
            </div>
          </Card>

          <Card className="p-5 border border-white/10">
            <CardTitle><T>Pricing Summary</T></CardTitle>
            <div className="mt-4 glass p-4 rounded-sm border border-white/10">
              <p className="font-body text-sm text-text-secondary"><T>Monthly</T></p>
              <p className="font-heading font-black text-2xl text-text-primary mt-1">₹ 4,999</p>
            </div>
            <div className="mt-3 glass p-4 rounded-sm border border-white/10">
              <p className="font-body text-sm text-text-secondary"><T>Yearly</T></p>
              <p className="font-heading font-black text-2xl text-text-primary mt-1">₹ 49,999</p>
            </div>
          </Card>
        </div>
      )}

      {tab === 'invoices' && (
        <Card className="p-5 border border-white/10">
          <CardTitle><T>Invoices</T></CardTitle>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {['2026-03', '2026-02', '2026-01'].map((m) => (
              <div key={m} className="glass p-4 rounded-sm border border-white/10">
                <p className="font-heading font-bold text-text-primary">{m}</p>
                <p className="font-body text-sm text-text-secondary mt-1"><T>AHAR Pro Subscription</T></p>
                <button
                  className="mt-3 w-full py-2.5 rounded-sm font-heading text-xs tracking-widest"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '0.14em',
                  }}
                >
                  <T>DOWNLOAD PDF</T>
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'methods' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="p-5 border border-white/10 xl:col-span-2">
            <CardTitle><T>Stored Payment Methods</T></CardTitle>
            <div className="mt-4 flex flex-col gap-3">
              {[
                { brand: 'Visa', last4: '4242', exp: '08/28' },
                { brand: 'Mastercard', last4: '4444', exp: '11/27' },
              ].map((c) => (
                <div
                  key={c.last4}
                  className="glass p-4 rounded-sm border border-white/10 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-heading font-bold text-text-primary">
                      {c.brand} •••• {c.last4}
                    </p>
                    <p className="font-body text-sm text-text-secondary mt-1"><T>Expires</T> {c.exp}</p>
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
                    <T>REMOVE</T>
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 border border-white/10">
            <CardTitle><T>Add New Method</T></CardTitle>
            <p className="font-body text-sm text-text-secondary mt-2"><T>Connect a new card (placeholder UI).</T></p>
            <button
              className="mt-4 w-full py-3 rounded-sm font-heading text-xs tracking-widest"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent-turquoise), var(--color-accent-orange))',
                color: 'var(--color-text-primary)',
                letterSpacing: '0.14em',
              }}
            >
              <T>ADD CARD</T>
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
