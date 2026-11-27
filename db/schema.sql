-- Leaderboard for the Finn-Brinn Connections game.
-- Safe to re-run: everything is IF NOT EXISTS. Apply with `npm run db:migrate`.

create table if not exists leaderboard_entries (
  id            bigint generated always as identity primary key,
  event_slug    text        not null,
  player_id     uuid        not null,
  player_name   text        not null check (char_length(player_name) between 1 and 60),
  status        text        not null check (status in ('win', 'loss')),
  mistakes_used smallint    not null check (mistakes_used between 0 and 4),
  duration_ms   integer     not null check (duration_ms > 0),
  created_at    timestamptz not null default now(),

  -- There is one puzzle, so a player's FIRST finish is the one that counts.
  -- Without this, anyone could replay with the answers known and top the board.
  unique (event_slug, player_id)
);

create index if not exists leaderboard_entries_rank_idx
  on leaderboard_entries (event_slug, status, mistakes_used, duration_ms);
