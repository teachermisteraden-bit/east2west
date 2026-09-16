-- Double opt-in housekeeping for the newsletter.
--
-- The supplied schema declares `token` as not null with no default and no index,
-- but confirmation looks a subscriber up BY token. Without an index that is a
-- sequential scan, and without a default every insert has to invent one.
alter table newsletter alter column token set default encode(gen_random_bytes(24), 'hex');
create unique index if not exists newsletter_token_idx on newsletter (token);

-- Confirmation links should not stay valid forever.
alter table newsletter add column if not exists token_expires_at timestamptz
  default (now() + interval '7 days');
