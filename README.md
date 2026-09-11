# NexusAssets

NexusAssets is a Supabase-backed IT asset management dashboard for tracking hardware, assignments, support tickets, software licenses, vendors, and purchase orders.

## Core features

- Asset inventory with search, categories, status labels, cost, serial, and assignment details.
- Asset handover workflow for employee, department, location, and date tracking.
- Support-ticket and software-license records linked to managed assets.
- Vendor and purchase-order management.
- Dashboard summaries, reports, settings, and data refresh controls.
- Browser-side CRUD operations persisted to Supabase.

## Technology stack

- Next.js 16, React 19, and TypeScript
- Tailwind CSS 4
- Supabase JavaScript client loaded in the browser
- Flatpickr and Phosphor Icons loaded from public CDNs
- Modular browser JavaScript under `public/js/`

## Prerequisites

- Node.js and npm
- A Supabase project with suitable tables and Row Level Security policies
- Network access to the configured CDNs

## Local setup

```bash
git clone https://github.com/varunisrani/asset-man.git
cd asset-man
npm ci
```

Create `.env.local` using the names below, then run:

```bash
npm run dev
```

The default development URL is `http://localhost:3000`.

Production and lint commands:

```bash
npm run build
npm run start
npm run lint
```

## Configuration

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL exposed to the browser client. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Yes | Browser-safe Supabase publishable key. |

## Project structure

- `app/page.tsx` — application shell, forms, and client configuration injection.
- `app/globals.css` — dashboard styling.
- `public/js/store.js` — Supabase data access and record mapping.
- `public/js/app.js` — navigation and form orchestration.
- `public/js/components/` — dashboard, assets, tickets, licenses, procurement, reports, and settings views.

## Status and limitations

The repository does not include Supabase schema migrations or seed data. The client expects `assets`, `support_tickets`, `software_licenses`, `vendors`, `purchase_orders`, `asset_categories`, `asset_status_labels`, and `workspace_users` tables with compatible columns. Because writes happen from a public browser client, production safety depends on correctly scoped Supabase Row Level Security policies. No automated test script is defined.