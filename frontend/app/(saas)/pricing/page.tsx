import { Card, CardTitle } from '@/components/ui/Card';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '₹ 1,999/mo',
      features: ['1 location', '200 predictions/mo', 'Basic inventory', 'Email support'],
      accent: 'var(--color-accent-orange)',
    },
    {
      name: 'Pro',
      price: '₹ 4,999/mo',
      features: ['5 locations', '2,000 predictions/mo', 'Donation routing', 'Priority support'],
      accent: 'var(--color-accent-red)',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited locations', 'Custom ML tuning', 'SLA + onboarding', 'Dedicated success manager'],
      accent: 'var(--color-accent-turquoise)',
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {plans.map((p) => (
        <Card key={p.name} className="p-6 border border-white/10">
          <CardTitle>{p.name}</CardTitle>
          <p className="font-heading font-black text-3xl mt-3 text-text-primary">{p.price}</p>
          <ul className="mt-4 flex flex-col gap-2 font-body text-sm text-text-secondary" role="list">
            {p.features.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
          <button
            className="mt-6 w-full py-3 rounded-sm font-heading text-xs tracking-widest"
            style={{
              background: `linear-gradient(135deg, ${p.accent}, var(--color-accent-orange))`,
              color: 'var(--color-text-primary)',
              letterSpacing: '0.14em',
            }}
          >
            CHOOSE PLAN
          </button>
        </Card>
      ))}
    </div>
  );
}

