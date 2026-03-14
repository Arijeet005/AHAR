import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

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
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
        />
      </head>
      <body className="antialiased bg-base-dark text-text-primary overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
