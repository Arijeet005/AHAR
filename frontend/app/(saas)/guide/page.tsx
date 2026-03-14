'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardTitle } from '@/components/ui/Card';
import { SubTabs } from '@/components/ui/SubTabs';
import { Accordion } from '@/components/ui/Accordion';
import { useTranslate, T } from '@/hooks/useTranslate';

type GuideTab = 'start' | 'features' | 'talk' | 'demo';

function GuidePageContent() {
  const [tab, setTab] = useState<GuideTab>('start');
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  // Tab label translations
  const tGettingStarted = useTranslate('Getting Started');
  const tFeatures = useTranslate('Features');
  const tTalkToUs = useTranslate('Talk to Us');
  const tFreeDemo = useTranslate('Free Demo');
  const tDashboard = useTranslate('Dashboard');
  const tPrediction = useTranslate('Prediction');
  const tInventoryHub = useTranslate('Inventory Hub');
  const tDonationLocator = useTranslate('Donation Locator');
  const tBodyDashboard = useTranslate('Use Key Analytics to track waste trend, efficiency progress, and view the latest snapshot and history.');
  const tBodyPrediction = useTranslate('Enter meal context, expected people, and multipliers, then run prediction to get waste risk and recommendation.');
  const tBodyInventory = useTranslate('Track expiry and freshness. Use Add Item with Smart Autofill or New Item Entry.');
  const tBodyDonation = useTranslate('Find nearest NGOs and log donation history. Use map when needed.');
  const phName = useTranslate('Name');
  const phEmail = useTranslate('Email');
  const phOrg = useTranslate('Organization');
  const phSubject = useTranslate('Subject');
  const phMessage = useTranslate('Message');
  const phPhone = useTranslate('Phone');
  const phHotel = useTranslate('Restaurant/Hotel Name');
  const tOnline = useTranslate('Online');
  const tOnsiteDemo = useTranslate('On-site demo');

  useEffect(() => {
    if (tabParam !== 'start' && tabParam !== 'features' && tabParam !== 'talk' && tabParam !== 'demo') return;
    setTab(tabParam);
  }, [tabParam]);

  const tabs = useMemo(
    () => [
      { key: 'start' as const, label: tGettingStarted },
      { key: 'features' as const, label: tFeatures },
      { key: 'talk' as const, label: tTalkToUs },
      { key: 'demo' as const, label: tFreeDemo },
    ],
    [tGettingStarted, tFeatures, tTalkToUs, tFreeDemo]
  );

  return (
    <div className="flex flex-col gap-5">
      <SubTabs items={tabs} active={tab} onChange={setTab} />

      {(tab === 'start' || tab === 'features') && (
        <Card className="p-5 border border-white/10">
          <CardTitle>{tab === 'start' ? <T>Getting Started</T> : <T>Features</T>}</CardTitle>
          <div className="mt-4">
            <Accordion
              items={[
                {
                  title: tDashboard,
                  body: tBodyDashboard,
                },
                {
                  title: tPrediction,
                  body: tBodyPrediction,
                },
                {
                  title: tInventoryHub,
                  body: tBodyInventory,
                },
                {
                  title: tDonationLocator,
                  body: tBodyDonation,
                },
              ]}
            />
          </div>
        </Card>
      )}

      {tab === 'talk' && (
        <Card className="p-5 border border-white/10 max-w-3xl">
          <CardTitle><T>Contact Us</T></CardTitle>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder={phName} />
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder={phEmail} />
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder={phOrg} />
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder={phSubject} />
            <textarea className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary min-h-28 md:col-span-2" placeholder={phMessage} />
          </div>
<<<<<<< HEAD
          <button
            className="mt-4 px-6 py-3 rounded-sm font-heading text-xs tracking-widest"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-red), var(--color-accent-orange))',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.14em',
            }}
          >
            <T>SUBMIT</T>
=======
	          <button
	            className="mt-4 px-6 py-3 rounded-sm font-heading text-xs tracking-widest"
	            style={{
	              background: 'var(--color-accent-orange)',
	              color: '#fff',
	              letterSpacing: '0.14em',
	            }}
	          >
	            SUBMIT
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841
          </button>
        </Card>
      )}

      {tab === 'demo' && (
        <Card className="p-5 border border-white/10 max-w-3xl">
          <CardTitle><T>Request a Free Demo</T></CardTitle>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder={phName} />
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder={phEmail} />
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder={phPhone} />
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder={phHotel} />
            <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" type="datetime-local" aria-label="Preferred Date & Time" />
            <select className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" defaultValue="Online">
              <option value="Online">{tOnline}</option>
              <option value="On-site demo">{tOnsiteDemo}</option>
            </select>
          </div>
<<<<<<< HEAD
          <button
            className="mt-4 px-6 py-3 rounded-sm font-heading text-xs tracking-widest"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-turquoise), var(--color-accent-orange))',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.14em',
            }}
          >
            <T>REQUEST DEMO</T>
=======
	          <button
	            className="mt-4 px-6 py-3 rounded-sm font-heading text-xs tracking-widest"
	            style={{
	              background: 'var(--color-accent-turquoise)',
	              color: '#fff',
	              letterSpacing: '0.14em',
	            }}
	          >
	            REQUEST DEMO
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841
          </button>
        </Card>
      )}
    </div>
  );
}

export default function GuidePage() {
  return (
    <Suspense fallback={null}>
      <GuidePageContent />
    </Suspense>
  );
}
