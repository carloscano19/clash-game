-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Function to automatically update 'updated_at' timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    ssu_balance NUMERIC(18, 6) NOT NULL DEFAULT 0 CHECK (ssu_balance >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- users_public view
CREATE VIEW public.users_public AS
SELECT id, display_name, avatar_url FROM public.users;

-- fan_token_balances table
CREATE TABLE public.fan_token_balances (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token_symbol TEXT NOT NULL,
    balance NUMERIC(18, 6) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    PRIMARY KEY (user_id, token_symbol)
);

-- matches table
CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT UNIQUE NOT NULL,
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    kickoff_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'live', 'finished', 'voided'))
);

-- lobbies table
CREATE TABLE public.lobbies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    is_open BOOLEAN NOT NULL DEFAULT true
);

-- lobby_entries table
CREATE TABLE public.lobby_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lobby_id UUID NOT NULL REFERENCES public.lobbies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    entered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('waiting', 'matched', 'timed_out', 'cancelled')),
    matched_with UUID REFERENCES public.users(id),
    stake_currency TEXT NOT NULL CHECK (stake_currency IN ('SSU', 'FAN_TOKEN')),
    stake_amount NUMERIC(18, 6) NOT NULL CHECK (stake_amount > 0),
    stake_token_symbol TEXT
);

-- Unique constraint: A user can only be queued once per lobby
CREATE UNIQUE INDEX idx_lobby_entries_unique_waiting 
ON public.lobby_entries (lobby_id, user_id) 
WHERE status = 'waiting';

-- challenges table
CREATE TABLE public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK (kind IN ('preset', 'custom_nlp')),
    raw_text TEXT NOT NULL,
    parsed_predicate JSONB NOT NULL,
    time_window_start_minute INT NOT NULL,
    time_window_end_minute INT NOT NULL,
    side_a_predicate JSONB NOT NULL,
    side_b_predicate JSONB NOT NULL
);

-- duels table
CREATE TABLE public.duels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    user_a UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_b UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES public.challenges(id),
    stake_currency TEXT NOT NULL CHECK (stake_currency IN ('SSU', 'FAN_TOKEN')),
    stake_amount NUMERIC(18, 6) NOT NULL CHECK (stake_amount > 0),
    stake_token_symbol TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending_proposal', 'pending_acceptance', 'active', 'arbitrating', 'resolved', 'voided')),
    winner_user_id UUID REFERENCES public.users(id),
    resolved_at TIMESTAMPTZ,
    resolution_reason TEXT,
    arbitrage_confidence NUMERIC(3, 2) CHECK (arbitrage_confidence >= 0 AND arbitrage_confidence <= 1)
);

-- escrow_transactions table (Append-only ledger)
CREATE TABLE public.escrow_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    duel_id UUID NOT NULL REFERENCES public.duels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    direction TEXT NOT NULL CHECK (direction IN ('lock', 'release_winner', 'refund')),
    currency TEXT NOT NULL CHECK (currency IN ('SSU', 'FAN_TOKEN')),
    amount NUMERIC(18, 6) NOT NULL CHECK (amount > 0),
    token_symbol TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- arbitrage_decisions table
CREATE TABLE public.arbitrage_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    duel_id UUID NOT NULL REFERENCES public.duels(id) ON DELETE CASCADE,
    model TEXT NOT NULL,
    prompt_hash TEXT NOT NULL,
    raw_response JSONB NOT NULL,
    decision TEXT NOT NULL CHECK (decision IN ('user_a_wins', 'user_b_wins', 'void')),
    confidence NUMERIC(3, 2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auth trigger to create public user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, display_name, ssu_balance)
    VALUES (
        NEW.id,
        SPLIT_PART(NEW.email, '@', 1), -- display name defaults to email local-part
        1000 -- Initial SSU balance
    );
    
    INSERT INTO public.fan_token_balances (user_id, token_symbol, balance)
    VALUES 
        (NEW.id, 'ARG', 5.0),
        (NEW.id, 'BRA', 5.0),
        (NEW.id, 'POR', 5.0);
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
