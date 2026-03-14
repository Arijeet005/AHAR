import Link from 'next/link';
import { Card, CardTitle } from '@/components/ui/Card';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md p-6 border border-white/10">
        <CardTitle>Login</CardTitle>
        <p className="font-body text-sm text-text-secondary mt-2">Auth wiring placeholder.</p>
        <div className="mt-5 flex flex-col gap-3">
          <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder="Email" />
          <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder="Password" type="password" />
	          <button
	            className="mt-2 w-full py-3 rounded-sm font-heading text-xs tracking-widest"
	            style={{
	              background: 'var(--color-accent-red)',
	              color: '#fff',
	              letterSpacing: '0.14em',
	            }}
	          >
	            LOGIN
          </button>
          <p className="font-body text-sm text-text-secondary">
            New here?{' '}
            <Link href="/register" className="text-accent-turquoise underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
