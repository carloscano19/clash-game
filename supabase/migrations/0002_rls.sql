-- Enable RLS on all public tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_token_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arbitrage_decisions ENABLE ROW LEVEL SECURITY;

-- Default Deny All is implicit once RLS is enabled

-- users
-- Users can read their own row (for private data like ssu_balance)
CREATE POLICY "Users can view their own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Note: The users_public view bypasses RLS on users table by default, 
-- but we should ensure only authenticated users can access the DB anyway via API.
-- Actually, views don't have RLS unless security_barrier is true. We'll leave it as is.

-- fan_token_balances
CREATE POLICY "Users can view their own fan token balances"
    ON public.fan_token_balances
    FOR SELECT
    USING (auth.uid() = user_id);

-- matches (Public read-only for authenticated)
CREATE POLICY "Matches are viewable by everyone"
    ON public.matches
    FOR SELECT
    TO authenticated
    USING (true);

-- lobbies (Public read-only for authenticated)
CREATE POLICY "Lobbies are viewable by everyone"
    ON public.lobbies
    FOR SELECT
    TO authenticated
    USING (true);

-- lobby_entries
-- Users can insert their own entry
CREATE POLICY "Users can insert their own lobby entry"
    ON public.lobby_entries
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can read their own entry
CREATE POLICY "Users can view their own lobby entries"
    ON public.lobby_entries
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- duels
-- Users can read duels they are involved in
CREATE POLICY "Users can view duels they are part of"
    ON public.duels
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_a OR auth.uid() = user_b);

-- challenges
-- Since challenges are bound to a match, we can just let users read them, or restrict to duel participants.
-- To avoid complex joins causing performance issues, we allow authenticated users to read challenges.
CREATE POLICY "Challenges are viewable by authenticated users"
    ON public.challenges
    FOR SELECT
    TO authenticated
    USING (true);

-- escrow_transactions
-- Users can read their own escrow transactions
CREATE POLICY "Users can view their own escrow transactions"
    ON public.escrow_transactions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- arbitrage_decisions
-- Read-only for users involved in the duel
CREATE POLICY "Users can view arbitrage decisions for their duels"
    ON public.arbitrage_decisions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.duels
            WHERE duels.id = arbitrage_decisions.duel_id
            AND (duels.user_a = auth.uid() OR duels.user_b = auth.uid())
        )
    );
