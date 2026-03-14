'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';
import { T } from '@/hooks/useTranslate';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type NavItem = {
  key:
<<<<<<< HEAD
  | 'dashboard'
  | 'prediction'
  | 'inventoryHub'
  | 'donationLocator'
  | 'payment'
  | 'guide'
  | 'pricing';
=======
    | 'dashboard'
    | 'prediction'
    | 'inventoryHub'
    | 'donationLocator'
    | 'guide'
    | 'pricing';
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841
  href: string;
};

function Icon({ name }: { name: NavItem['key'] }) {
  const common = 'w-4 h-4';
  switch (name) {
    case 'dashboard':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-11h7V4h-7v5Z" fill="currentColor" opacity="0.9" />
        </svg>
      );
    case 'prediction':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 12h6l2-7 2 14 2-7h4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case 'inventoryHub':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'donationLocator':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z" stroke="currentColor" strokeWidth="2" />
          <path d="M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="currentColor" opacity="0.9" />
        </svg>
      );
    case 'guide':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 6a3 3 0 0 1 3-3h13v16H7a3 3 0 0 0-3 3V6Z" stroke="currentColor" strokeWidth="2" />
          <path d="M7 3v16" stroke="currentColor" strokeWidth="2" opacity="0.6" />
        </svg>
      );
    case 'pricing':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 7h12l-1 14H7L6 7Z" stroke="currentColor" strokeWidth="2" />
          <path d="M9 7a3 3 0 1 1 6 0" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
}

function pageTitleFromPath(pathname: string) {
  if (pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/prediction')) return 'Prediction';
  if (pathname.startsWith('/inventory')) return 'Inventory Hub';
  if (pathname.startsWith('/donations')) return 'Donation Locator';
  if (pathname.startsWith('/guide')) return 'Guide';
  if (pathname.startsWith('/pricing')) return 'Pricing';
  return 'AHAR';
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('dashboard');

  const activeAccent = theme === 'light' ? 'var(--color-accent-red)' : 'var(--color-accent-turquoise)';
  const activeBg = theme === 'light' ? 'rgba(203, 32, 45, 0.10)' : 'rgba(48, 213, 200, 0.12)';
  const activeBorder = theme === 'light' ? 'rgba(203, 32, 45, 0.26)' : 'rgba(48, 213, 200, 0.25)';

  const navMode: 'routes' | 'anchors' = pathname === '/' ? 'anchors' : 'routes';

  const nav: NavItem[] = useMemo(() => {
    if (navMode === 'anchors') {
      return [
        { key: 'dashboard', href: '/#dashboard' },
        { key: 'prediction', href: '/#prediction' },
        { key: 'inventoryHub', href: '/#inventory' },
        { key: 'donationLocator', href: '/#donations' },
        { key: 'guide', href: '/#guide' },
        { key: 'pricing', href: '/#pricing' },
      ];
    }

    return [
      { key: 'dashboard', href: '/dashboard' },
      { key: 'prediction', href: '/prediction' },
      { key: 'inventoryHub', href: '/inventory' },
      { key: 'donationLocator', href: '/donations' },
      { key: 'guide', href: '/guide' },
      { key: 'pricing', href: '/pricing' },
    ];
  }, [navMode]);

  const title = pageTitleFromPath(pathname);

  const subMenu = useMemo(() => {
    return {
      dashboard: [
        { label: 'Key Analytics', href: '/dashboard?tab=key' as const },
        { label: 'Time Range', href: '/dashboard?tab=range' as const },
        { label: 'Reports', href: '/dashboard?tab=reports' as const },
      ],
      prediction: [{ label: 'Run Prediction', href: '/prediction' as const }],
      inventoryHub: [
        { label: 'All', href: '/inventory?tab=all' as const },
        { label: 'Expiry Soon', href: '/inventory?tab=soon' as const },
        { label: 'Add Item', href: '/inventory?tab=add' as const },
        { label: 'Expired', href: '/inventory?tab=expired' as const },
      ],
      donationLocator: [
<<<<<<< HEAD
        { label: 'Nearest NGOs', href: '/donations?tab=nearest' as const },
        { label: 'History', href: '/donations?tab=history' as const },
        { label: 'Map', href: '/donations?tab=map' as const },
      ],
      payment: [
        { label: 'Billing', href: '/payment?tab=billing' as const },
        { label: 'Invoices', href: '/payment?tab=invoices' as const },
        { label: 'Payment Methods', href: '/payment?tab=methods' as const },
=======
        { label: 'Map', href: '/donations?tab=map' },
        { label: 'Nearest NGOs', href: '/donations?tab=nearest' },
        { label: 'History', href: '/donations?tab=history' },
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841
      ],
      guide: [
        { label: 'Getting Started', href: '/guide?tab=start' as const },
        { label: 'Features', href: '/guide?tab=features' as const },
        { label: 'Talk to Us', href: '/guide?tab=talk' as const },
        { label: 'Free Demo', href: '/guide?tab=demo' as const },
      ],
<<<<<<< HEAD
      pricing: [{ label: 'Plans', href: '/pricing' as const }],
=======
      pricing: [
        { label: 'Plans', href: '/pricing' },
        { label: 'Billing', href: '/pricing?tab=billing' },
        { label: 'Invoices', href: '/pricing?tab=invoices' },
        { label: 'Payment Methods', href: '/pricing?tab=methods' },
      ],
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841
    } satisfies Record<NavItem['key'], { label: string; href: string }[]>;
  }, []);

  useEffect(() => {
    if (navMode !== 'anchors') return;
    const update = () => {
      const h = window.location.hash.replace('#', '').trim();
      if (h) setActiveHash(h);
    };
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, [navMode]);

  useEffect(() => {
    if (navMode !== 'anchors') return;

    const ids = nav
      .map((i) => i.href.split('#')[1])
      .filter((v): v is string => Boolean(v));

    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!targets.length) return;

    let raf = 0;
    const setActive = (id: string) => {
      setActiveHash(id);
      if (window.location.hash !== `#${id}`) {
        history.replaceState(null, '', `/#${id}`);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.target instanceof HTMLElement)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const top = visible[0]?.target as HTMLElement | undefined;
        const id = top?.id;
        if (!id) return;

        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => setActive(id));
      },
      {
        root: null,
        threshold: [0.15, 0.25, 0.35, 0.5, 0.65],
        rootMargin: '-35% 0px -55% 0px',
      }
    );

    targets.forEach((t) => observer.observe(t));

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [navMode, nav]);

  const Sidebar = (
    <aside className="h-full flex flex-col bg-neutral-dim/70 glass-strong border-r" style={{ borderColor: 'var(--glass-border)' }}>
      <div className="px-5 py-5 flex items-center justify-between">
        <Link href={navMode === 'anchors' ? '/#dashboard' : '/dashboard'} className="flex items-center gap-3" aria-label="AHAR Home">
          <div
            className="w-9 h-9 rounded-sm flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-accent-red), var(--color-accent-orange))' }}
          >
            <span className="font-heading font-black text-sm" style={{ color: 'var(--color-text-primary)' }}>
              A
            </span>
          </div>
          <div className="leading-tight">
            <p className="font-heading font-black tracking-widest" style={{ letterSpacing: '0.22em' }}>
              AHAR
            </p>
            <p className="font-body text-xs text-text-secondary"><T>Hospitality Optimizer</T></p>
          </div>
        </Link>
        <button
          className="md:hidden text-text-secondary hover:text-text-primary"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav className="px-3 pb-5" aria-label="Primary">
        <ul role="list" className="flex flex-col gap-1">
          {nav.map((item) => {
            const active =
              navMode === 'anchors'
                ? activeHash === item.href.split('#')[1]
                : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors"
                  style={{
                    background: active ? activeBg : 'transparent',
                    border: active ? `1px solid ${activeBorder}` : '1px solid transparent',
                    color: active ? activeAccent : 'var(--color-text-secondary)',
                  }}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="shrink-0">
                    <Icon name={item.key} />
                  </span>
                  <span className="font-body text-sm"><T>{t(item.key)}</T></span>
                </Link>

                {active && subMenu[item.key]?.length ? (
                  <ul role="list" className="mt-1 ml-10 flex flex-col gap-1">
                    {subMenu[item.key].map((s) => (
                      <li key={s.href}>
                        <Link
                          href={s.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-1.5 rounded-sm font-body text-xs text-text-secondary hover:text-text-primary"
                          style={{ border: '1px solid var(--glass-border)' }}
                        >
                          <T>{s.label}</T>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto px-5 py-5">
        <div className="glass p-4 rounded-sm">
          <p className="font-heading text-xs tracking-widest text-text-secondary" style={{ letterSpacing: '0.18em' }}>
            STATUS
          </p>
          <p className="font-body text-sm text-text-primary mt-1"><T>AI models: Online</T></p>
          <p className="font-body text-xs text-text-secondary mt-1"><T>Last sync: just now</T></p>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen">
      {theme === 'light' ? (
        <>
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              backgroundColor: 'var(--bg)',
              backgroundImage: 'var(--app-bg-texture)',
              backgroundRepeat: 'repeat',
            }}
          />
          <div
            className="fixed inset-0 pointer-events-none opacity-70"
            style={{
              background:
                'radial-gradient(ellipse at 15% 10%, var(--primary-soft), transparent 55%), radial-gradient(ellipse at 85% 20%, var(--accent-soft), transparent 55%), radial-gradient(ellipse at 50% 70%, var(--info-soft), transparent 60%)',
            }}
          />
        </>
      ) : (
        <>
          {/* Subtle background layer */}
          <div
            className="fixed inset-0 pointer-events-none opacity-60"
            style={{
              background:
                'radial-gradient(ellipse at 15% 10%, rgba(226,55,68,0.08), transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(252,128,25,0.08), transparent 55%), radial-gradient(ellipse at 50% 70%, rgba(48,213,200,0.08), transparent 60%)',
            }}
          />
          <div className="fixed inset-0 grid-dots pointer-events-none opacity-25" />
        </>
      )}

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <div className="hidden md:block md:sticky md:top-0 md:h-screen">{Sidebar}</div>

        {/* Mobile sidebar */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-[1000]">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-[86%] max-w-[320px]">{Sidebar}</div>
          </div>
        )}

        <div className="min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-50 border-b bg-base-dark/70 backdrop-blur-md" style={{ borderColor: 'var(--glass-border)' }}>
            <div className="px-5 md:px-8 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  className="md:hidden glass px-3 py-2 rounded-sm text-text-secondary hover:text-text-primary"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open navigation"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <div className="min-w-0">
                  <p className="font-heading font-black text-xl text-text-primary truncate">{title}</p>
                  <p className="font-body text-xs text-text-secondary truncate">
                    <T>AHAR - AI-based Hospitality and Resource Optimizer</T>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <LanguageSwitcher />

                <button
                  className="glass px-3 py-2 rounded-sm font-body text-xs text-text-primary"
                  onClick={toggleTheme}
                  aria-label={t('theme')}
                >
                  {theme === 'dark' ? <T>Dark</T> : <T>Light</T>}
                </button>

                <Link
                  href="/login"
                  className="hidden sm:inline-flex glass px-3 py-2 rounded-sm font-body text-xs text-text-primary hover:border-white/20"
                >
                  <T>{t('login')}</T>
                </Link>
<<<<<<< HEAD
                <Link
                  href="/register"
                  className="hidden sm:inline-flex px-3 py-2 rounded-sm font-heading text-xs tracking-widest"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-accent-red), var(--color-accent-orange))',
                    color: 'var(--color-text-primary)',
                    letterSpacing: '0.14em',
                  }}
                >
                  <T>{t('register')}</T>
=======
	                <Link
	                  href="/register"
	                  className="hidden sm:inline-flex px-3 py-2 rounded-sm font-heading text-xs tracking-widest"
	                  style={{
	                    background: 'var(--color-accent-orange)',
	                    color: '#fff',
	                    letterSpacing: '0.14em',
	                  }}
	                >
	                  {t('register')}
>>>>>>> 830dca374aabc8c4aa8648db87b68eb1e0543841
                </Link>
              </div>
            </div>
          </header>

          <main className="px-5 md:px-8 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
