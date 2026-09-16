-- Submissions from the five /join modes. Row Level Security on; only the service role writes and reads.
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  mode text not null check (mode in ('graduate','university','sponsor','business','chapter')),
  locale text not null check (locale in ('en','ar')),
  payload jsonb not null,            -- validated form fields (no consent text duplication)
  consent_at timestamptz not null,
  utm_source text, utm_medium text, utm_campaign text,
  campaign text,                     -- from /go/[campaign]
  ref text,                          -- referral code used
  referral_code text unique,         -- code issued to this submitter (graduates)
  status text not null default 'new' check (status in ('new','contacted','accepted','declined'))
);
alter table submissions enable row level security;

create table if not exists newsletter (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  locale text not null check (locale in ('en','ar')),
  confirmed_at timestamptz,
  token text not null,
  unique (email, locale)
);
alter table newsletter enable row level security;

-- North-star metric, entered manually by the owner in /admin
create table if not exists opportunities (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('job','contract','referral','startup')),
  note text,
  occurred_on date not null
);
alter table opportunities enable row level security;
