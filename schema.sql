-- LUVVA Secure Gateway V6.0 Dashboard Core
create extension if not exists pgcrypto;
create table if not exists visitors(id uuid primary key default gen_random_uuid(),display_name text,first_visit_at timestamptz default now(),last_visit_at timestamptz default now(),visit_count integer default 1,country text,created_at timestamptz default now(),updated_at timestamptz default now());
create table if not exists identities(id uuid primary key default gen_random_uuid(),visitor_id uuid not null references visitors(id) on delete cascade,provider text not null check(provider in('google','whatsapp','email','wechat','owner')),provider_subject text not null,normalized_identity text,verified boolean default false,verified_at timestamptz,last_login_at timestamptz,unique(provider,provider_subject));
create table if not exists permissions(id uuid primary key default gen_random_uuid(),identity_id uuid unique not null references identities(id) on delete cascade,access_state text not null default 'temporary' check(access_state in('owner','administrator','permanent','temporary','blocked','expired')),expires_at timestamptz,blocked_at timestamptz,blocked_reason text,updated_by uuid,updated_at timestamptz default now());
create table if not exists sessions(id uuid primary key default gen_random_uuid(),identity_id uuid not null references identities(id) on delete cascade,started_at timestamptz default now(),expires_at timestamptz,last_seen_at timestamptz default now(),ended_at timestamptz,ended_reason text,status text default 'active',device_hash text,ip_hash text,user_agent text,contact_reminder_shown_at timestamptz);
create table if not exists contact_submissions(id uuid primary key default gen_random_uuid(),visitor_id uuid not null references visitors(id) on delete cascade,identity_id uuid references identities(id) on delete set null,name text,email text,phone text,company text,message text,submitted_at timestamptz default now());
alter table contact_submissions add column if not exists position text;
alter table contact_submissions add column if not exists country text;
alter table contact_submissions add column if not exists interest text;
alter table contact_submissions add column if not exists consent boolean default false;
create table if not exists admin_users(id uuid primary key default gen_random_uuid(),auth_user_id uuid unique,display_name text,role text not null default 'administrator' check(role in('owner','administrator')),active boolean default true,created_at timestamptz default now());
create table if not exists audit_log(id bigint generated always as identity primary key,actor text,action text not null,entity_type text,entity_id text,metadata jsonb default '{}'::jsonb,created_at timestamptz default now());
create table if not exists owner_access_challenges(id uuid primary key default gen_random_uuid(),token_hash text unique not null,access_type text not null check(access_type in('website','dashboard')),status text not null default 'pending' check(status in('pending','approved','denied','expired','used')),expires_at timestamptz not null,approved_at timestamptz,approved_session_token text,user_agent text,request_ip_hash text,created_at timestamptz default now());
create index if not exists sessions_last_seen_idx on sessions(last_seen_at desc);create index if not exists audit_created_idx on audit_log(created_at desc);create index if not exists owner_challenge_hash_idx on owner_access_challenges(token_hash);
create or replace view dashboard_visitors as
select i.id identity_id,v.id visitor_id,v.display_name,i.provider,i.provider_subject,i.normalized_identity,i.verified,i.last_login_at,v.first_visit_at,v.last_visit_at,v.visit_count,v.country,p.access_state,p.expires_at,p.blocked_at,p.blocked_reason,s.id session_id,s.started_at,s.last_seen_at,s.status,s.user_agent,exists(select 1 from contact_submissions c where c.visitor_id=v.id) contact_completed
from identities i join visitors v on v.id=i.visitor_id left join permissions p on p.identity_id=i.id left join lateral(select * from sessions ss where ss.identity_id=i.id order by ss.started_at desc limit 1)s on true;
-- IMPORTANT: Enable RLS for public-facing tables and keep service-role keys server-side only.

-- LUVVA V7.1 Meta WhatsApp OTP
create table if not exists whatsapp_otp_challenges(
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  used boolean not null default false,
  meta_message_id text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists whatsapp_otp_phone_created_idx on whatsapp_otp_challenges(phone, created_at desc);
create index if not exists whatsapp_otp_expiry_idx on whatsapp_otp_challenges(expires_at);
alter table whatsapp_otp_challenges enable row level security;
-- No public policies: this table is accessed only by server-side service-role requests.

-- LUVVA V7.7 Business Email OTP
create table if not exists email_otp_challenges(
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  used boolean not null default false,
  provider_message_id text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists email_otp_email_created_idx on email_otp_challenges(email, created_at desc);
create index if not exists email_otp_expiry_idx on email_otp_challenges(expires_at);
alter table email_otp_challenges enable row level security;
-- No public policies: service-role access only.
