# Token Cost Guard — Web Dashboard

## Vision
One dashboard to see all your AI API costs. Connect your accounts, see your spend instantly.

## User Flow
1. Land on tokencostguard.com
2. Click "Get Started"
3. Sign up (Google OAuth or email)
4. Add API keys (Anthropic, OpenAI)
5. **Instantly see unified cost dashboard**

## MVP Features

### Dashboard
- Total spend (all providers combined)
- Spend by provider (pie chart)
- Spend by model (bar chart)
- Daily spend trend (last 30 days)
- Current billing period summary

### Connections
- Add/remove API keys
- Test connection (verify key works)
- Last synced timestamp

### Alerts (v1.1)
- Email when daily spend exceeds threshold
- Weekly summary email

## Tech Stack
- **Frontend:** Next.js 14 (App Router)
- **Hosting:** Vercel
- **Auth:** Supabase Auth (Google + Email)
- **Database:** Supabase Postgres
- **Styling:** Tailwind CSS
- **Charts:** Recharts

## API Integrations

### Anthropic Usage API
- Endpoint: `https://api.anthropic.com/v1/usage`
- Auth: API key in header
- Returns: Daily usage by model

### OpenAI Usage API  
- Endpoint: `https://api.openai.com/v1/usage`
- Auth: API key in header
- Returns: Usage data by day/model

## Database Schema

```sql
-- Users (handled by Supabase Auth)

-- API Connections
create table connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  provider text not null, -- 'anthropic', 'openai'
  api_key_encrypted text not null,
  is_valid boolean default true,
  last_synced_at timestamp,
  created_at timestamp default now()
);

-- Cached Usage Data
create table usage_cache (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid references connections(id),
  date date not null,
  model text not null,
  input_tokens bigint,
  output_tokens bigint,
  cost_usd decimal(10,4),
  created_at timestamp default now(),
  unique(connection_id, date, model)
);
```

## Security
- API keys encrypted at rest (Supabase Vault or similar)
- Keys never exposed to frontend
- All API queries happen server-side
- Users can delete their data anytime

## Monetization
- **Free:** Connect 1 provider, 7-day history
- **Pro ($9/mo):** Unlimited providers, full history, alerts, export

## Pages
1. `/` — Landing page (value prop, CTA)
2. `/login` — Auth page
3. `/dashboard` — Main dashboard (protected)
4. `/settings` — Manage connections, alerts, account
5. `/pricing` — Pro upgrade

## Success Metrics
- Time to value: < 2 minutes from signup to seeing costs
- Activation: User adds at least 1 API key
- Retention: User returns within 7 days

## Timeline
- Day 1: Project setup, auth, landing page
- Day 2: Connections page, API integrations
- Day 3: Dashboard with real data
- Day 4: Polish, deploy, test
- Day 5: Launch
