'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';

export type SubTabItem<T extends string> = {
  key: T;
  label: string;
};

export function SubTabs<T extends string>({
  items,
  active,
  onChange,
}: {
  items: SubTabItem<T>[];
  active: T;
  onChange: (key: T) => void;
}) {
  const { theme } = useTheme();
  const accent = theme === 'light' ? 'var(--color-accent-red)' : 'var(--color-accent-turquoise)';
  const activeBg = theme === 'light' ? 'rgba(203, 32, 45, 0.10)' : 'rgba(48, 213, 200, 0.12)';
  const activeBorder = theme === 'light' ? 'rgba(203, 32, 45, 0.28)' : 'rgba(48, 213, 200, 0.3)';
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {items.map((item) => {
        const isActive = item.key === active;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className="shrink-0 px-4 py-2 rounded-sm font-body text-xs tracking-widest transition-colors"
            style={{
              letterSpacing: '0.14em',
              background: isActive ? activeBg : 'rgba(255,255,255,0.04)',
              border: isActive ? `1px solid ${activeBorder}` : '1px solid rgba(255,255,255,0.08)',
              color: isActive ? accent : 'var(--color-text-secondary)',
            }}
            aria-pressed={isActive}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
