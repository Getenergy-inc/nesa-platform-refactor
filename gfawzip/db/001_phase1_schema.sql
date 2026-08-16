-- ============================================================================
-- GFA WZIP WALLET — PHASE 1 SCHEMA
-- GFA WZIP Technology Limited
--
-- Wallet / ledger / payment-orchestration infrastructure.
-- NOT a bank, PSP, MTO or custodian. Custody and settlement of third-party
-- funds occur only at appropriately authorised banks/PSPs.
--
-- Money is stored in MINOR UNITS (bigint). Never floats. Never numeric drift.
-- Ledger entries are immutable: corrections are reversing entries only.
-- ============================================================================

-- ── ENUMS ───────────────────────────────────────────────────────────────────

create type public.gfaw_wallet_type as enum (
  'INDIVIDUAL',       -- users, members, donors, sponsors, volunteers, customers
  'ORGANISATION',     -- NESA-Africa, EduAid-Africa, SCEF, future organisations
  'PROGRAMME',        -- RMSA, scholarships, special-needs, regional interventions
  'CHAPTER',          -- local / regional / international / diaspora chapters
  'CAMPAIGN',         -- gala, TV, webinar, podcast, fundraising
  'MERCHANT',         -- approved vendors and service providers
  'GFAWZIP_REVENUE'   -- GFA WZIP's OWN earned income. Never programme funds.
);

create type public.gfaw_owner_kind as enum (
  'USER','ORGANISATION','PROGRAMME','CHAPTER','CAMPAIGN','MERCHANT','PLATFORM'
);

create type public.gfaw_wallet_status as enum ('ACTIVE','FROZEN','CLOSED');

-- Ledger direction (double entry).
create type public.gfaw_direction as enum ('DEBIT','CREDIT');

-- Bucket a ledger entry lands in. Drives which balance it moves.
create type public.gfaw_balance_bucket as enum (
  'AVAILABLE','PENDING','RESERVED','RESTRICTED','SETTLED','UNSETTLED'
);

create type public.gfaw_entry_type as enum (
  'CREDIT','DEBIT','TRANSFER_IN','TRANSFER_OUT','HOLD','RELEASE',
  'REFUND','REVERSAL','ADJUSTMENT','FEE','COMMISSION','MARKUP',
  'ALLOCATION','SETTLEMENT','CHARGEBACK'
);

create type public.gfaw_txn_status as enum (
  'PENDING','POSTED','REVERSED','FAILED'
);

create type public.gfaw_intent_status as enum (
  'CREATED','PENDING','PROCESSING','SUCCESSFUL','FAILED',
  'EXPIRED','CANCELLED','REFUNDED','PARTIALLY_REFUNDED'
);

create type public.gfaw_provider_key as enum (
  'GFAWZIP_WALLET','BANK_TRANSFER','PAYSTACK','FLUTTERWAVE','MANUAL'
);

create type public.gfaw_role as enum (
  'SUPER_ADMIN','GFAWZIP_FINANCE','GFAWZIP_SETTLEMENT','GFAWZIP_COMPLIANCE',
  'GFAWZIP_SUPPORT','ORG_ADMIN','ORG_FINANCE','CHAPTER_ADMIN','CHAPTER_FINANCE',
  'PROGRAMME_MANAGER','SPONSOR_MANAGER','AUDITOR','READ_ONLY','DONOR','CUSTOMER'
);

-- ── ROLES (never on the profile row — privilege escalation risk) ────────────

create table public.gfaw_user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.gfaw_role not null,
  -- Optional scope: role applies only within this organisation/chapter.
  scope_kind public.gfaw_owner_kind,
  scope_id uuid,
  granted_by uuid,
  created_at timestamptz not null default now(),
  unique (user_id, role, scope_kind, scope_id)
);

grant select on public.gfaw_user_roles to authenticated;
grant all on public.gfaw_user_roles to service_role;
alter table public.gfaw_user_roles enable row level security;

create or replace function public.gfaw_has_role(_user_id uuid, _role public.gfaw_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.gfaw_user_roles
                 where user_id = _user_id and role = _role)
$$;

create or replace function public.gfaw_is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.gfaw_user_roles
                 where user_id = _user_id
                   and role in ('SUPER_ADMIN','GFAWZIP_FINANCE','GFAWZIP_SETTLEMENT',
                                'GFAWZIP_COMPLIANCE','GFAWZIP_SUPPORT','AUDITOR'))
$$;

create policy "own roles readable" on public.gfaw_user_roles
  for select to authenticated using (user_id = auth.uid() or public.gfaw_is_staff(auth.uid()));

-- ── ACCOUNTS (GFAW IDs) ─────────────────────────────────────────────────────

create sequence if not exists public.gfaw_account_seq;

create or replace function public.gfaw_next_id()
returns text language sql volatile as $$
  select 'GFAW-' || lpad(nextval('public.gfaw_account_seq')::text, 8, '0')
$$;

create table public.gfaw_accounts (
  id uuid primary key default gen_random_uuid(),
  gfaw_id text not null unique default public.gfaw_next_id(),
  owner_kind public.gfaw_owner_kind not null,
  -- auth user for INDIVIDUAL accounts; null for institutional accounts.
  user_id uuid,
  display_name text not null,
  country_code text,
  -- KYC/KYB is Phase 4; the column exists so status is never ambiguous.
  verification_status text not null default 'UNVERIFIED',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index gfaw_accounts_user_idx on public.gfaw_accounts (user_id);

grant select on public.gfaw_accounts to authenticated;
grant all on public.gfaw_accounts to service_role;
alter table public.gfaw_accounts enable row level security;

create policy "own account readable" on public.gfaw_accounts
  for select to authenticated
  using (user_id = auth.uid() or public.gfaw_is_staff(auth.uid()));

-- ── WALLETS ─────────────────────────────────────────────────────────────────

create table public.gfaw_wallets (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.gfaw_accounts(id) on delete restrict,
  wallet_type public.gfaw_wallet_type not null,
  currency text not null,                       -- ISO-4217, e.g. NGN, USD, GBP
  label text not null,
  status public.gfaw_wallet_status not null default 'ACTIVE',
  -- Restricted-purpose funds (e.g. RMSA-2027). Enforced by transfer policy.
  is_restricted boolean not null default false,
  restriction_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (account_id, wallet_type, currency, label)
);

create index gfaw_wallets_account_idx on public.gfaw_wallets (account_id);

grant select on public.gfaw_wallets to authenticated;
grant all on public.gfaw_wallets to service_role;
alter table public.gfaw_wallets enable row level security;

create policy "own wallets readable" on public.gfaw_wallets
  for select to authenticated
  using (
    exists (select 1 from public.gfaw_accounts a
            where a.id = account_id and a.user_id = auth.uid())
    or public.gfaw_is_staff(auth.uid())
  );

-- ── TRANSACTIONS (the balanced envelope for ledger entries) ─────────────────

create table public.gfaw_transactions (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  status public.gfaw_txn_status not null default 'PENDING',
  currency text not null,
  purpose text not null,
  -- Prevents duplicate creation from repeated provider webhooks.
  idempotency_key text unique,
  provider public.gfaw_provider_key,
  provider_reference text,
  payment_intent_id uuid,
  -- Set only when this transaction reverses another one.
  reverses_transaction_id uuid references public.gfaw_transactions(id),
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  posted_at timestamptz
);

create index gfaw_txn_provider_ref_idx on public.gfaw_transactions (provider, provider_reference);

grant select on public.gfaw_transactions to authenticated;
grant all on public.gfaw_transactions to service_role;
alter table public.gfaw_transactions enable row level security;

create policy "staff read transactions" on public.gfaw_transactions
  for select to authenticated using (public.gfaw_is_staff(auth.uid()));

-- ── LEDGER ENTRIES (immutable, append only) ─────────────────────────────────

create table public.gfaw_ledger_entries (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.gfaw_transactions(id) on delete restrict,
  wallet_id uuid not null references public.gfaw_wallets(id) on delete restrict,
  direction public.gfaw_direction not null,
  entry_type public.gfaw_entry_type not null,
  bucket public.gfaw_balance_bucket not null default 'AVAILABLE',
  -- MINOR UNITS. Always positive; direction carries the sign.
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null,
  -- Multi-currency provenance. Never silently convert.
  original_currency text,
  original_amount_minor bigint,
  fx_rate numeric(20,10),
  fx_source text,
  fx_at timestamptz,
  narrative text,
  created_at timestamptz not null default now()
);

create index gfaw_entries_wallet_idx on public.gfaw_ledger_entries (wallet_id, created_at desc);
create index gfaw_entries_txn_idx on public.gfaw_ledger_entries (transaction_id);

grant select on public.gfaw_ledger_entries to authenticated;
grant all on public.gfaw_ledger_entries to service_role;
alter table public.gfaw_ledger_entries enable row level security;

create policy "own ledger readable" on public.gfaw_ledger_entries
  for select to authenticated
  using (
    exists (
      select 1 from public.gfaw_wallets w
      join public.gfaw_accounts a on a.id = w.account_id
      where w.id = wallet_id and a.user_id = auth.uid()
    )
    or public.gfaw_is_staff(auth.uid())
  );

-- Immutability: no UPDATE, no DELETE, ever. Corrections are reversing entries.
create or replace function public.gfaw_block_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'GFA WZIP ledger records are immutable; post a reversing entry instead';
end;
$$;

create trigger gfaw_entries_immutable
  before update or delete on public.gfaw_ledger_entries
  for each row execute function public.gfaw_block_mutation();

-- A transaction may only be POSTED when its entries balance per currency.
create or replace function public.gfaw_assert_balanced(_transaction_id uuid)
returns void language plpgsql as $$
declare rec record;
begin
  for rec in
    select currency,
           sum(case when direction = 'DEBIT'  then amount_minor else 0 end) as dr,
           sum(case when direction = 'CREDIT' then amount_minor else 0 end) as cr
    from public.gfaw_ledger_entries
    where transaction_id = _transaction_id
    group by currency
  loop
    if rec.dr <> rec.cr then
      raise exception 'Unbalanced transaction % in %: debits % <> credits %',
        _transaction_id, rec.currency, rec.dr, rec.cr;
    end if;
  end loop;
end;
$$;

create or replace function public.gfaw_check_balance_on_post()
returns trigger language plpgsql as $$
begin
  if new.status = 'POSTED' and (old.status is distinct from 'POSTED') then
    perform public.gfaw_assert_balanced(new.id);
    new.posted_at := coalesce(new.posted_at, now());
  end if;
  return new;
end;
$$;

create trigger gfaw_txn_balance_gate
  before update on public.gfaw_transactions
  for each row execute function public.gfaw_check_balance_on_post();

-- ── BALANCES (derived, never stored) ────────────────────────────────────────

create or replace view public.gfaw_wallet_balances
with (security_invoker = true) as
select
  w.id as wallet_id,
  w.account_id,
  w.currency,
  coalesce(sum(case when e.bucket = 'AVAILABLE'  then e.signed else 0 end), 0) as available_minor,
  coalesce(sum(case when e.bucket = 'PENDING'    then e.signed else 0 end), 0) as pending_minor,
  coalesce(sum(case when e.bucket = 'RESERVED'   then e.signed else 0 end), 0) as reserved_minor,
  coalesce(sum(case when e.bucket = 'RESTRICTED' then e.signed else 0 end), 0) as restricted_minor,
  coalesce(sum(case when e.bucket = 'SETTLED'    then e.signed else 0 end), 0) as settled_minor,
  coalesce(sum(case when e.bucket = 'UNSETTLED'  then e.signed else 0 end), 0) as unsettled_minor,
  coalesce(sum(e.signed), 0) as ledger_balance_minor
from public.gfaw_wallets w
left join (
  select le.wallet_id, le.bucket,
         case when le.direction = 'CREDIT' then le.amount_minor else -le.amount_minor end as signed
  from public.gfaw_ledger_entries le
  join public.gfaw_transactions t on t.id = le.transaction_id
  where t.status = 'POSTED'
) e on e.wallet_id = w.id
group by w.id, w.account_id, w.currency;

grant select on public.gfaw_wallet_balances to authenticated, service_role;

-- ── PAYMENT INTENTS ─────────────────────────────────────────────────────────

create table public.gfaw_payment_intents (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  account_id uuid references public.gfaw_accounts(id),
  destination_wallet_id uuid references public.gfaw_wallets(id),
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null,
  purpose text not null,
  programme_ref text,
  campaign_ref text,
  provider public.gfaw_provider_key not null,
  -- Fees/allocation are resolved from approved configuration, never hardcoded.
  allocation_rule_ref text,
  status public.gfaw_intent_status not null default 'CREATED',
  provider_reference text,
  checkout_url text,
  -- Unique bank narration for offline transfer reconciliation.
  bank_transfer_reference text,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.gfaw_payment_intents to authenticated;
grant all on public.gfaw_payment_intents to service_role;
alter table public.gfaw_payment_intents enable row level security;

create policy "own intents readable" on public.gfaw_payment_intents
  for select to authenticated
  using (
    exists (select 1 from public.gfaw_accounts a
            where a.id = account_id and a.user_id = auth.uid())
    or public.gfaw_is_staff(auth.uid())
  );

-- ── RECEIPTS ────────────────────────────────────────────────────────────────

create sequence if not exists public.gfaw_receipt_seq;

create table public.gfaw_receipts (
  id uuid primary key default gen_random_uuid(),
  receipt_number text not null unique
    default 'GFAW-RCT-' || lpad(nextval('public.gfaw_receipt_seq')::text, 10, '0'),
  transaction_id uuid not null references public.gfaw_transactions(id),
  account_id uuid references public.gfaw_accounts(id),
  payer_name text,
  amount_minor bigint not null,
  currency text not null,
  fees_minor bigint not null default 0,
  purpose text not null,
  programme_ref text,
  beneficiary text,
  restriction_ref text,
  payment_method text,
  issued_at timestamptz not null default now()
);

grant select on public.gfaw_receipts to authenticated;
grant all on public.gfaw_receipts to service_role;
alter table public.gfaw_receipts enable row level security;

create policy "own receipts readable" on public.gfaw_receipts
  for select to authenticated
  using (
    exists (select 1 from public.gfaw_accounts a
            where a.id = account_id and a.user_id = auth.uid())
    or public.gfaw_is_staff(auth.uid())
  );

-- ── PROVIDER WEBHOOK LOG (idempotency) ──────────────────────────────────────

create table public.gfaw_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider public.gfaw_provider_key not null,
  provider_event_id text,
  signature_verified boolean not null default false,
  payload jsonb not null,
  processed boolean not null default false,
  processed_at timestamptz,
  error text,
  received_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

grant all on public.gfaw_webhook_events to service_role;
alter table public.gfaw_webhook_events enable row level security;

create policy "staff read webhooks" on public.gfaw_webhook_events
  for select to authenticated using (public.gfaw_is_staff(auth.uid()));

-- ── AUDIT LOG (immutable) ───────────────────────────────────────────────────

create table public.gfaw_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  actor_role public.gfaw_role,
  action text not null,
  object_type text not null,
  object_id text,
  old_value jsonb,
  new_value jsonb,
  reason text,
  approval_ref text,
  ip inet,
  created_at timestamptz not null default now()
);

grant select on public.gfaw_audit_logs to authenticated;
grant all on public.gfaw_audit_logs to service_role;
alter table public.gfaw_audit_logs enable row level security;

create policy "staff read audit" on public.gfaw_audit_logs
  for select to authenticated using (public.gfaw_is_staff(auth.uid()));

create trigger gfaw_audit_immutable
  before update or delete on public.gfaw_audit_logs
  for each row execute function public.gfaw_block_mutation();

-- ── PHASE 2 RESERVATIONS ────────────────────────────────────────────────────
-- Declared now so the ledger never needs a breaking migration later.
-- No engine logic ships in Phase 1 and no percentages are seeded anywhere.

create table public.gfaw_allocation_rules (
  id uuid primary key default gen_random_uuid(),
  rule_ref text not null unique,
  entity text not null,
  programme_ref text,
  product_ref text,
  campaign_ref text,
  revenue_type text,
  -- Either percent_bps OR fixed_amount_minor. Values come from approved contracts.
  percent_bps integer check (percent_bps between 0 and 10000),
  fixed_amount_minor bigint,
  currency text,
  beneficiary text not null,
  destination_ref text,
  effective_from date not null,
  effective_to date,
  contract_reference text,
  approval_status text not null default 'DRAFT',
  created_by uuid, checked_by uuid, authorised_by uuid,
  created_at timestamptz not null default now(),
  check (percent_bps is not null or fixed_amount_minor is not null)
);

grant select on public.gfaw_allocation_rules to authenticated;
grant all on public.gfaw_allocation_rules to service_role;
alter table public.gfaw_allocation_rules enable row level security;

create policy "staff read allocation rules" on public.gfaw_allocation_rules
  for select to authenticated using (public.gfaw_is_staff(auth.uid()));

create table public.gfaw_bank_accounts (
  id uuid primary key default gen_random_uuid(),
  account_name text not null,
  bank_name text not null,
  account_identifier text not null,
  currency text not null,
  entity text not null,
  purpose text,
  account_type text,
  country_code text,
  verification_status text not null default 'UNVERIFIED',
  effective_from date,
  last_verified_at timestamptz,
  -- Maker-checker-authoriser is mandatory for any change here.
  approval_status text not null default 'DRAFT',
  created_by uuid, checked_by uuid, authorised_by uuid,
  created_at timestamptz not null default now()
);

grant all on public.gfaw_bank_accounts to service_role;
alter table public.gfaw_bank_accounts enable row level security;

create policy "finance read bank accounts" on public.gfaw_bank_accounts
  for select to authenticated
  using (public.gfaw_has_role(auth.uid(), 'GFAWZIP_FINANCE')
      or public.gfaw_has_role(auth.uid(), 'SUPER_ADMIN'));
