import { redirect } from 'next/navigation';

export default function PaymentPage({
  searchParams,
}: {
  searchParams?: {
    tab?: string;
  };
}) {
  const tab = searchParams?.tab;
  const next = tab ? `/pricing?tab=${encodeURIComponent(tab)}` : '/pricing?tab=billing';
  redirect(next);
}
