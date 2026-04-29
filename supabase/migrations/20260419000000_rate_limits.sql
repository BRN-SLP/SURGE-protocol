create table if not exists rate_limits (
  ip       text        primary key,
  count    integer     not null default 1,
  reset_at timestamptz not null
);

-- Allow service-role only; no anon/authenticated access needed
alter table rate_limits enable row level security;
