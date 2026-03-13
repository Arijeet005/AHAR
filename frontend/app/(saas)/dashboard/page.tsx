'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardView from '@/components/dashboard/DashboardView';

type DashTab = 'key' | 'range' | 'reports';

function coerceTab(v: string | null): DashTab | undefined {
  if (v === 'key' || v === 'range' || v === 'reports') return v;
  return undefined;
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tabFromQuery = useMemo(() => coerceTab(tabParam), [tabParam]);
  return <DashboardView tabFromQuery={tabFromQuery} />;
}
