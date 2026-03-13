export const HUD_PHASES = [
  {
    phase: 1,
    range: [0, 0.3] as [number, number],
    label: 'CRISIS DETECTED',
    accent: 'accent-red',
    headline: '1/3 of all food\nproduced globally\nis wasted.',
    subline: 'Millions go hungry while tonnes of food are discarded every day.',
    hudLines: ['WASTE DETECTED', 'SYSTEM ALERT', 'CRITICAL SURPLUS'],
  },
  {
    phase: 2,
    range: [0.3, 0.7] as [number, number],
    label: 'SYSTEM ONLINE',
    accent: 'accent-orange',
    headline: 'AHAR predicts\nsurplus before\nit becomes waste.',
    subline: 'AI-powered intelligence. Real-time NGO routing. Smart redistribution.',
    hudLines: ['AI NOMINAL', 'NGO SYNC', 'ROUTING ACTIVE'],
  },
  {
    phase: 3,
    range: [0.7, 1.0] as [number, number],
    label: 'IMPACT LOGGED',
    accent: 'accent-turquoise',
    headline: 'Predict Waste.\nFeed People.',
    subline: 'Real meals. Real impact. Tracked every day.',
    hudLines: ['MEALS SAVED', 'CO₂ REDUCED', 'MISSION SUCCESS'],
  },
];

export const HUD_SHORT_COPY = [
  'SCAN', 'PREDICT', 'ROUTE', 'DONATE', 'SAVE', 'TRACK',
  'ALERT', 'SYNC', 'FEED', 'REDUCE', 'IMPACT', 'CONNECT',
];

export const METRICS_LABELS = [
  {
    key: 'mealsProvided',
    label: 'Meals Provided',
    unit: '',
    suffix: '+',
    color: 'accent-turquoise',
    icon: '🍽',
  },
  {
    key: 'foodSavedKg',
    label: 'Food Saved',
    unit: 'kg',
    suffix: '+',
    color: 'accent-orange',
    icon: '🌾',
  },
  {
    key: 'co2ReducedKg',
    label: 'CO₂ Reduced',
    unit: 'kg',
    suffix: '+',
    color: 'accent-red',
    icon: '🌍',
  },
];

export const SOLUTION_CARDS = [
  {
    id: 'prediction',
    icon: '⬡',
    title: 'AI Waste Prediction',
    desc: 'ML models trained on consumption patterns forecast surplus up to 24h ahead.',
    stat: '94%',
    statLabel: 'accuracy',
    color: 'accent-orange',
  },
  {
    id: 'ngo',
    icon: '◈',
    title: 'NGO Redistribution Network',
    desc: 'Geo-matched NGOs receive instant alerts and pickup requests.',
    stat: '2min',
    statLabel: 'avg response',
    color: 'accent-turquoise',
  },
  {
    id: 'routing',
    icon: '◉',
    title: 'Smart Donation Routing',
    desc: 'Optimal donor-to-NGO matching using distance, capacity and food type filters.',
    stat: '0₹',
    statLabel: 'platform fee',
    color: 'accent-red',
  },
];

export const BACKEND_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
