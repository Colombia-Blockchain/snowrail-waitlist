# SnowRail Waitlist

A B2B waitlist landing page for SnowRail - programmable financial execution for milestone-based payouts with USDC → USD settlement.

## Stack

- **Frontend**: Vite + React + TypeScript
- **Styling**: TailwindCSS v4
- **Backend**: Supabase (Postgres + RLS + Edge Functions)

## Features

- Multi-step form with progress indicator
- Lead segmentation (B2B Treasury, Agent builders, Ramp partners, RWA connectors)
- Server-side scoring algorithm (0-100) with track assignment (Pilot/Discovery/Nurture)
- Secure submission via Edge Function (no direct anon inserts)
- Mobile-responsive, professional B2B design

## Local Development

### Prerequisites

- Node.js 18+
- npm or pnpm
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for local backend)

### Setup

1. Clone and install dependencies:

```bash
cd snowrail-waitlist
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Fill in your Supabase credentials in `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Start the dev server:

```bash
npm run dev
```

The app runs in **mock mode** if Supabase env vars are not set, computing scores client-side.

## Supabase Setup

### 1. Create the Database Table

Run the migration in your Supabase SQL Editor or via CLI:

```bash
supabase db push
```

Or manually execute `supabase/migrations/20240101000000_create_waitlist_signups.sql`.

### 2. Deploy the Edge Function

```bash
supabase functions deploy submit-waitlist
```

The Edge Function:
- Validates all required fields
- Computes score server-side (prevents manipulation)
- Inserts with service role (bypasses RLS)
- Handles duplicate email gracefully

### 3. Configure CORS (if needed)

The Edge Function includes permissive CORS headers. For production, restrict `Access-Control-Allow-Origin` to your domain.

## Scoring Algorithm

The score (0-100) is computed from 5 signals:

| Signal | Max Points | Criteria |
|--------|------------|----------|
| Pain | 20 | High-pain use cases (AP automation, payouts) = 15; Other = 5 |
| Volume | 20 | <5k=2, 5k-25k=8, 25k-100k=14, 100k-500k=18, >500k=20 |
| Complexity | 20 | +4 per trigger selected (max 20) |
| Controls | 20 | Max of approval type score and audit level score |
| Implementability | 20 | Website +5, Decision maker +10, B2B Treasury +5 |

**Track Assignment:**
- Score >= 70 → **PILOT** (priority for early access)
- Score 40-69 → **DISCOVERY** (qualified, needs nurturing)
- Score < 40 → **NURTURE** (general interest)

## Project Structure

```
snowrail-waitlist/
├── src/
│   ├── components/       # React components
│   ├── lib/              # Supabase client, scoring logic
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── supabase/
│   ├── migrations/       # SQL migrations
│   └── functions/        # Edge Functions
├── .env.example
└── package.json
```

## Deployment

### Frontend (Vercel/Netlify)

1. Connect your repository
2. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Build command: `npm run build`
4. Output directory: `dist`

### Backend (Supabase)

1. Link your project: `supabase link --project-ref your-ref`
2. Push migrations: `supabase db push`
3. Deploy function: `supabase functions deploy submit-waitlist`

## Privacy

This waitlist collects business contact information only. No sensitive data (bank accounts, KYC documents) is requested. All submissions require explicit consent.
