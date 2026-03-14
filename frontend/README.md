AHAR frontend (Next.js App Router).

## Routes

- `/dashboard`: Analytics dashboard (tabs: Key Analytics, Time Range Analytics, Reports)
- `/prediction`: AI demand prediction form + result card
- `/inventory`: Inventory Hub (tabs: All, Expiry Soon, Add Item, Expired)
- `/donations`: Donation Locator (tabs: Map, Nearest NGOs, History)
- `/guide`: Getting Started, Features, Talk to Us, Free Demo
- `/pricing`: Pricing plans + Billing/Invoices/Payment Methods
- `/payment`: Redirects to `/pricing` (back-compat)
- `/login`, `/register`: Placeholder auth screens

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend base URL (example local: `http://localhost:5000`). On Vercel, set this to your deployed backend URL (Render, etc.).

## Deploy on Vercel

If deploying from the monorepo, set Vercel Project Settings:

- Git repo: `Arijeet005/AHAR`
- Root Directory: `frontend`

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
