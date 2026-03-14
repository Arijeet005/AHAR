'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardTitle } from '@/components/ui/Card';
import { SubTabs } from '@/components/ui/SubTabs';
import { Badge } from '@/components/ui/Badge';
import { useTranslate, T } from '@/hooks/useTranslate';

type InvTab = 'all' | 'soon' | 'add' | 'expired';

type Item = {
  id: string;
  name: string;
  category: string;
  qty: number;
  unit: string;
  expiry: string; // yyyy-mm-dd
  imageUrl?: string;
  notes?: string;
};

function daysUntil(dateStr: string) {
  // Keep deterministic across SSR/CSR (avoid hydration mismatch).
  // This is demo UI data; swap to real server-provided "today" later.
  const base = Date.parse('2026-03-13T00:00:00.000Z');
  const d = Date.parse(dateStr + 'T00:00:00.000Z');
  return Math.round((d - base) / 86400000);
}

export default function InventoryPage() {
  const [tab, setTab] = useState<InvTab>('all');
  const [method, setMethod] = useState<'autofill' | 'new'>('autofill');
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  // Tab label translations
  const tAll = useTranslate('All');
  const tExpirySoon = useTranslate('Expiry Soon');
  const tAddItem = useTranslate('Add Item');
  const tExpired = useTranslate('Expired');
  const tExpiredDaysAgo = useTranslate('days ago');
  const tExpiresToday = useTranslate('Expires today');
  const tDaysLeft = useTranslate('days left');
  const tNewItem = useTranslate('New item');
  const tCategory = useTranslate('Category');

  useEffect(() => {
    if (tabParam !== 'all' && tabParam !== 'soon' && tabParam !== 'add' && tabParam !== 'expired') return;
    setTab(tabParam);
  }, [tabParam]);

  const items: Item[] = useMemo(
    () => [
      {
        id: '1',
        name: 'Tomatoes',
        category: 'Vegetables',
        qty: 8,
        unit: 'kg',
        expiry: '2026-03-15',
        imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=60',
        notes: 'Keep dry',
      },
      {
        id: '2',
        name: 'Paneer',
        category: 'Dairy',
        qty: 12,
        unit: 'packs',
        expiry: '2026-03-14',
        imageUrl: 'https://images.unsplash.com/photo-1625944228741-cf30983ec4b7?auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '3',
        name: 'Basmati Rice',
        category: 'Grains',
        qty: 25,
        unit: 'kg',
        expiry: '2026-05-20',
        imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd4?auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '4',
        name: 'Bananas',
        category: 'Fruits',
        qty: 60,
        unit: 'pcs',
        expiry: '2026-03-13',
        imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=60',
      },
    ],
    []
  );

  const tabs = useMemo(
    () => [
      { key: 'all' as const, label: tAll },
      { key: 'soon' as const, label: tExpirySoon },
      { key: 'add' as const, label: tAddItem },
      { key: 'expired' as const, label: tExpired },
    ],
    [tAll, tExpirySoon, tAddItem, tExpired]
  );

  const filtered = useMemo(() => {
    if (tab === 'all') return items;
    if (tab === 'soon')
      return items.filter((it) => {
        const d = daysUntil(it.expiry);
        return d >= 0 && d <= 3;
      });
    if (tab === 'expired') return items.filter((it) => daysUntil(it.expiry) < 0);
    return items;
  }, [items, tab]);

  const [selectedName, setSelectedName] = useState(items[0]?.name ?? '');
  const selectedItem = useMemo(() => items.find((i) => i.name === selectedName) ?? null, [items, selectedName]);
  const [editQty, setEditQty] = useState(5);
  const [editExpiry, setEditExpiry] = useState('2026-03-16');

  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    qty: 0,
    unit: 'kg',
    expiry: '',
    imageUrl: '',
    notes: '',
  });

  return (
    <div className="flex flex-col gap-5">
      <SubTabs items={tabs} active={tab} onChange={setTab} />

      {tab !== 'add' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((it) => {
            const d = daysUntil(it.expiry);
            const tone = d < 0 ? 'bad' : d <= 3 ? 'warn' : 'good';
            const label = d < 0 ? `${tExpired} ${Math.abs(d)} ${tExpiredDaysAgo}` : d === 0 ? tExpiresToday : `${d} ${tDaysLeft}`;
            const progress = Math.max(0, Math.min(100, Math.round(((d < 0 ? 0 : d) / 10) * 100)));
            return (
              <Card key={it.id} className="overflow-hidden border border-white/10">
                <div
                  className="h-36"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${it.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-heading font-black text-lg text-text-primary">{it.name}</p>
                      <p className="font-body text-xs text-text-secondary mt-1">{it.category}</p>
                    </div>
                    <Badge tone={tone as any}>{label}</Badge>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <p className="font-body text-text-secondary">
                      <T>Qty:</T> <span className="text-text-primary font-semibold">{it.qty} {it.unit}</span>
                    </p>
                    <p className="font-body text-text-secondary">
                      <T>Exp:</T> <span className="text-text-primary font-semibold">{it.expiry}</span>
                    </p>
                  </div>

                  <div className="mt-3 h-1 rounded-sm overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div
                      className="h-full"
                      style={{
                        width: `${progress}%`,
                        background:
                          tone === 'bad'
                            ? 'var(--color-accent-red)'
                            : tone === 'warn'
                              ? 'var(--color-accent-orange)'
                              : 'var(--color-accent-turquoise)',
                      }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === 'add' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="p-5 border border-white/10 xl:col-span-2">
            <CardTitle><T>Add Item</T></CardTitle>
            <p className="font-body text-sm text-text-secondary mt-2"><T>Choose a method.</T></p>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setMethod('autofill')}
                className="px-4 py-2 rounded-sm font-body text-xs tracking-widest"
                style={{
                  letterSpacing: '0.14em',
                  background: method === 'autofill' ? 'rgba(48,213,200,0.12)' : 'rgba(255,255,255,0.04)',
                  border: method === 'autofill' ? '1px solid rgba(48,213,200,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  color: method === 'autofill' ? 'var(--color-accent-turquoise)' : 'var(--color-text-secondary)',
                }}
              >
                <T>METHOD 1 – SMART AUTOFILL</T>
              </button>
              <button
                onClick={() => setMethod('new')}
                className="px-4 py-2 rounded-sm font-body text-xs tracking-widest"
                style={{
                  letterSpacing: '0.14em',
                  background: method === 'new' ? 'rgba(252,128,25,0.12)' : 'rgba(255,255,255,0.04)',
                  border: method === 'new' ? '1px solid rgba(252,128,25,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  color: method === 'new' ? 'var(--color-accent-orange)' : 'var(--color-text-secondary)',
                }}
              >
                <T>METHOD 2 – NEW ITEM ENTRY</T>
              </button>
            </div>

            {method === 'autofill' && (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="font-body text-xs text-text-secondary mb-2"><T>Select Item</T></p>
                  <select
                    className="glass w-full border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary"
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.name}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="font-body text-xs text-text-secondary mb-2"><T>Quantity</T></p>
                  <input
                    className="glass w-full border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary"
                    type="number"
                    value={editQty}
                    onChange={(e) => setEditQty(Number(e.target.value))}
                  />
                </div>
                <div>
                  <p className="font-body text-xs text-text-secondary mb-2"><T>Expiry Date</T></p>
                  <input
                    className="glass w-full border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary"
                    type="date"
                    value={editExpiry}
                    onChange={(e) => setEditExpiry(e.target.value)}
                  />
                </div>
              </div>
            )}

            {method === 'new' && (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="font-body text-xs text-text-secondary mb-2"><T>Item Name</T></p>
                  <input
                    className="glass w-full border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary"
                    value={newItem.name}
                    onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <p className="font-body text-xs text-text-secondary mb-2"><T>Category</T></p>
                  <input
                    className="glass w-full border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary"
                    value={newItem.category}
                    onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value }))}
                  />
                </div>
                <div>
                  <p className="font-body text-xs text-text-secondary mb-2"><T>Quantity + Unit</T></p>
                  <div className="flex gap-2">
                    <input
                      className="glass w-full border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary"
                      type="number"
                      value={newItem.qty}
                      onChange={(e) => setNewItem((p) => ({ ...p, qty: Number(e.target.value) }))}
                    />
                    <input
                      className="glass w-24 border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary"
                      value={newItem.unit}
                      onChange={(e) => setNewItem((p) => ({ ...p, unit: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <p className="font-body text-xs text-text-secondary mb-2"><T>Expiry Date</T></p>
                  <input
                    className="glass w-full border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary"
                    type="date"
                    value={newItem.expiry}
                    onChange={(e) => setNewItem((p) => ({ ...p, expiry: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <p className="font-body text-xs text-text-secondary mb-2"><T>Image URL</T></p>
                  <input
                    className="glass w-full border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary"
                    value={newItem.imageUrl}
                    onChange={(e) => setNewItem((p) => ({ ...p, imageUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2">
                  <p className="font-body text-xs text-text-secondary mb-2"><T>Notes</T></p>
                  <textarea
                    className="glass w-full border border-white/10 rounded-sm px-3 py-2.5 font-body text-sm text-text-primary min-h-24"
                    value={newItem.notes}
                    onChange={(e) => setNewItem((p) => ({ ...p, notes: e.target.value }))}
                  />
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <button
                className="px-6 py-3 rounded-sm font-heading text-xs tracking-widest"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent-turquoise), var(--color-accent-orange))',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '0.14em',
                }}
              >
                <T>SAVE ITEM</T>
              </button>
              <button
                className="px-6 py-3 rounded-sm font-heading text-xs tracking-widest"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '0.14em',
                }}
                onClick={() => setNewItem({ name: '', category: '', qty: 0, unit: 'kg', expiry: '', imageUrl: '', notes: '' })}
              >
                <T>RESET</T>
              </button>
            </div>
          </Card>

          <Card className="p-5 border border-white/10">
            <CardTitle><T>Preview</T></CardTitle>
            <div className="mt-4">
              {method === 'autofill' && selectedItem ? (
                <div className="overflow-hidden rounded-sm border border-white/10">
                  <div
                    className="h-40"
                    style={{
                      backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.65)), url(${selectedItem.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="p-4">
                    <p className="font-heading font-black text-lg text-text-primary">{selectedItem.name}</p>
                    <p className="font-body text-sm text-text-secondary mt-1">{selectedItem.category}</p>
                    <p className="font-body text-sm text-text-secondary mt-2">
                      <T>Qty:</T> <span className="text-text-primary font-semibold">{editQty}</span>
                    </p>
                    <p className="font-body text-sm text-text-secondary mt-1">
                      <T>Expiry:</T> <span className="text-text-primary font-semibold">{editExpiry}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-sm border border-white/10">
                  <div
                    className="h-40"
                    style={{
                      backgroundImage: newItem.imageUrl
                        ? `linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.65)), url(${newItem.imageUrl})`
                        : 'linear-gradient(135deg, rgba(226,55,68,0.15), rgba(252,128,25,0.15))',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="p-4">
                    <p className="font-heading font-black text-lg text-text-primary">{newItem.name || tNewItem}</p>
                    <p className="font-body text-sm text-text-secondary mt-1">{newItem.category || tCategory}</p>
                    <p className="font-body text-sm text-text-secondary mt-2">
                      <T>Qty:</T>{' '}
                      <span className="text-text-primary font-semibold">
                        {newItem.qty || 0} {newItem.unit}
                      </span>
                    </p>
                    <p className="font-body text-sm text-text-secondary mt-1">
                      <T>Expiry:</T> <span className="text-text-primary font-semibold">{newItem.expiry || '-'}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
