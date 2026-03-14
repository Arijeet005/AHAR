'use client';

import Link from 'next/link';
import { Card, CardTitle } from '@/components/ui/Card';
import { T, useTranslate } from '@/hooks/useTranslate';

export default function RegisterPage() {
  const phName = useTranslate('Name');
  const phEmail = useTranslate('Email');
  const phPassword = useTranslate('Password');

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md p-6 border border-white/10">
        <CardTitle><T>Register</T></CardTitle>
        <p className="font-body text-sm text-text-secondary mt-2"><T>Auth wiring placeholder.</T></p>
        <div className="mt-5 flex flex-col gap-3">
          <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder={phName} />
          <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder={phEmail} />
          <input className="glass border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary" placeholder={phPassword} type="password" />
          <button
            className="mt-2 w-full py-3 rounded-sm font-heading text-xs tracking-widest"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-turquoise), var(--color-accent-orange))',
              color: 'var(--color-text-primary)',
              letterSpacing: '0.14em',
            }}
          >
            <T>REGISTER</T>
          </button>
          <p className="font-body text-sm text-text-secondary">
            <T>Already have an account?</T>{' '}
            <Link href="/login" className="text-accent-turquoise underline underline-offset-4">
              <T>Login</T>
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

