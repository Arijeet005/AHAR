'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardView from '@/components/dashboard/DashboardView';

type DashTab = 'key' | 'range' | 'reports';

function coerceTab(v: string | null): DashTab | undefined {
  if (v === 'key' || v === 'range' || v === 'reports') return v;
  return undefined;
}

function DashboardPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tabFromQuery = useMemo(() => coerceTab(tabParam), [tabParam]);
  return <DashboardView tabFromQuery={tabFromQuery} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardPageContent />
    </Suspense>
  );
}
