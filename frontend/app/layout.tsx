import type { Metadata } from 'next';
import { Orbitron, Rajdhani } from 'next/font/google';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-rajdhani',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'AHAR — AI-based Food Waste Prediction & Management',
  description:
    'AHAR uses AI to predict food surplus, connect NGOs, and eliminate food waste. Join the mission to feed people and protect the planet.',
  keywords: ['food waste', 'AI prediction', 'NGO', 'food donation', 'sustainability', 'AHAR'],
  openGraph: {
    title: 'AHAR — Predict Waste. Feed People.',
    description: 'AI-driven food redistribution system saving meals and reducing CO₂.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body className="antialiased bg-base-dark text-white overflow-x-hidden">{children}</body>
    </html>
  );
}
