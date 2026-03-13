import React from 'react';

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'good' | 'warn' | 'bad';
}) {
  const styles =
    tone === 'good'
      ? { background: 'rgba(48,213,200,0.12)', border: '1px solid rgba(48,213,200,0.28)', color: 'var(--color-accent-turquoise)' }
      : tone === 'warn'
        ? { background: 'rgba(252,128,25,0.12)', border: '1px solid rgba(252,128,25,0.28)', color: 'var(--color-accent-orange)' }
        : tone === 'bad'
          ? { background: 'rgba(226,55,68,0.12)', border: '1px solid rgba(226,55,68,0.28)', color: 'var(--color-accent-red)' }
          : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--color-text-secondary)' };

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-sm font-body text-xs" style={styles}>
      {children}
    </span>
  );
}

