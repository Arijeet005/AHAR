'use client';

import React from 'react';

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function Sparkline({
  data,
  stroke = 'var(--color-accent-turquoise)',
  fill = 'rgba(48,213,200,0.12)',
}: {
  data: number[];
  stroke?: string;
  fill?: string;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(1, max - min);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = (1 - clamp01((v - min) / range)) * 100;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 100" className="w-full h-16" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="2" />
      <polygon points={`0,100 ${points} 100,100`} fill={fill} />
    </svg>
  );
}

