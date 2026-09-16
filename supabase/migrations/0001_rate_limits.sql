-- Rate limiting counters.
--
-- Holds a salted hash, a window and a count. No IP address, no link to a
-- submission, nothing that identifies a person. That keeps abuse protection
-- compatible with collecting the minimum (non-negotiable 7).
create table if not exists rate_limits (
  key_hash text not null,
  window_start timestamptz not null,
  count integer not null default 0,
  primary key (key_hash, window_start)
);
alter table rate_limits enable row level security;

-- Atomic increment, so two concurrent submissions cannot both read a stale count.
create or replace function bump_rate_limit(p_key text, p_window_start timestamptz)
returns table (count integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  insert into rate_limits (key_hash, window_start, count)
  values (p_key, p_window_start, 1)
  on conflict (key_hash, window_start)
  do update set count = rate_limits.count + 1
  returning rate_limits.count;
end;
$$;

-- Housekeeping: nothing here is useful beyond its window. Run daily, e.g. pg_cron:
--   delete from rate_limits where window_start < now() - interval '1 day';
