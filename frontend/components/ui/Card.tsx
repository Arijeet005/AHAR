import React from 'react';

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`glass rounded-sm ${className}`}>{children}</div>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-heading font-bold text-sm tracking-widest text-text-secondary" style={{ letterSpacing: '0.18em' }}>
      {children}
    </p>
  );
}

