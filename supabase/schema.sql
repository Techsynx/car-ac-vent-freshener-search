-- =========================================================
-- Car AC Vent Air Freshener Search Tool
-- Supabase / PostgreSQL Database Schema
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------
-- 1. PRODUCTS TABLE
-- Stores verified vent air freshener products with AI evaluation
-- ---------------------------------------------------------
create table if not exists products (
    id text primary key,
    name text not null,
    link text not null,
    source_website text not null,
    price numeric(10, 2) not null default 0.00,
    currency text not null default 'USD',
    rating numeric(3, 2) not null default 0.0,
    review_count integer not null default 0,
    image_url text,
    is_vent_freshener boolean not null default true,
    vent_confidence integer not null default 100,
    genuine_score integer not null default 85,
    genuine_reason text,
    last_fetched_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index on last_fetched_at for cache freshness check
create index if not exists idx_products_last_fetched on products (last_fetched_at desc);
create index if not exists idx_products_genuine_score on products (genuine_score desc);

-- ---------------------------------------------------------
-- 2. SEARCH CACHE TABLE
-- Stores user queries, matching products, and timestamp for offline/saved fallback
-- ---------------------------------------------------------
create table if not exists search_cache (
    id text primary key,
    query text not null,
    normalized_query text not null,
    product_ids jsonb not null default '[]'::jsonb,
    products_data jsonb not null default '[]'::jsonb,
    status text not null default 'live' check (status in ('live', 'saved')),
    last_searched_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index on normalized search query for instant cache lookup (<24h check)
create index if not exists idx_search_cache_query on search_cache (normalized_query);
create index if not exists idx_search_cache_timestamp on search_cache (last_searched_at desc);

-- ---------------------------------------------------------
-- Row Level Security (RLS) - Public Read & Write for Demo/Vercel
-- ---------------------------------------------------------
alter table products enable row level security;
alter table search_cache enable row level security;

create policy "Allow public read access to products"
    on products for select
    using (true);

create policy "Allow public insert/update to products"
    on products for all
    using (true);

create policy "Allow public read access to search_cache"
    on search_cache for select
    using (true);

create policy "Allow public insert/update to search_cache"
    on search_cache for all
    using (true);
