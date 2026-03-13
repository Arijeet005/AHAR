'use client';

import React, { useState } from 'react';

export function Accordion({
  items,
}: {
  items: { title: string; body: React.ReactNode }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-2">
      {items.map((it, idx) => {
        const isOpen = open === idx;
        return (
          <div key={it.title} className="glass rounded-sm border border-white/10 overflow-hidden">
            <button
              className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left"
              onClick={() => setOpen(isOpen ? null : idx)}
              aria-expanded={isOpen}
            >
              <p className="font-heading font-bold text-sm text-text-primary">{it.title}</p>
              <span className="font-heading text-text-secondary">{isOpen ? '-' : '+'}</span>
            </button>
            {isOpen && <div className="px-4 pb-4 font-body text-sm text-text-secondary">{it.body}</div>}
          </div>
        );
      })}
    </div>
  );
}

