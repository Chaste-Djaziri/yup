create table public.email_logs (
  id serial primary key,
  application_id text not null,
  email_id text,
  to_email text not null,
  subject text,
  status text not null,        -- e.g. 'pending', 'sent', 'failed'
  event_type text,             -- e.g. 'pending', 'sent'
  bounce_reason text,
  metadata jsonb,
  created_at timestamp with time zone default now(),
  sent_at timestamp with time zone,
  delivered_at timestamp with time zone,
  opened_at timestamp with time zone,
  clicked_at timestamp with time zone,
  open_count integer default 0,
  click_count integer default 0
);
