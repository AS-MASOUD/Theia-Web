# Theia Web — Public Marketing Frontend

The official, high-performance public marketing website and educational financial portal for **Theia Finance**.

---

## Architectural Role

`theia-web` is an independent Next.js 16 App Router application organized within a pnpm/Turborepo workspace. It operates independently from the authenticated financial command centers (`theia-dashboard` and `theia-mobile`) and provides:

- **Public Landing Page (`/`):** Hero, product value proposition, tabbed interactive demo, and market spotlight.
- **Markets Hub (`/markets`, `/markets/[symbol]`):** Public currency, gold coin, cryptocurrency, and commodity discovery with conversion calculators.
- **Insights & Editorial (`/insights`, `/insights/[slug]`):** SEO-optimized financial articles and analysis backed by `theia-web-api`.
- **Product Features (`/features`):** Detailed breakdown of AI financial reasoning, asset ledger, and debt management.
- **Pricing & Entitlements (`/pricing`):** Transparent tier comparison for Free and Pro subscriptions.
- **Customer Entry Points (`/contact`, `/faq`, `/support`, `/releases`, `/terms`):** Interactive contact submission and legal documentation.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict mode)
- **Styling:** Tailwind CSS v4, custom Obsidian-surface tokens, warm amber accents
- **Typography:** Self-hosted Persian Kalameh WOFF2 fonts with `swap` display (zero external font dependencies)
- **State & Data Fetching:** TanStack React Query v5
- **Icons:** Lucide React
- **Packaging:** pnpm workspace + Turborepo

---

## Local Development

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server on port 3000 (or specified port)
pnpm run dev

# 3. Production build
pnpm run build

# 4. Run test suite
pnpm run test
```

---

## Docker Deployment

```bash
docker build -t theia-web:latest .
docker run -p 3000:3000 --env-file .env theia-web:latest
```
