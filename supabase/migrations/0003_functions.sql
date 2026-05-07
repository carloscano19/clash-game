-- Stubs for core functions to be implemented in Phase 3 and Phase 5

-- Phase 3
CREATE OR REPLACE FUNCTION try_match(p_lobby_id uuid, p_user_id uuid)
RETURNS uuid AS $$
BEGIN
    RAISE NOTICE 'todo: implement try_match in Phase 3';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 4
CREATE OR REPLACE FUNCTION propose_challenge(p_duel_id uuid, p_predicate jsonb, p_raw_text text)
RETURNS void AS $$
BEGIN
    RAISE NOTICE 'todo: implement propose_challenge in Phase 4';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION accept_duel(p_duel_id uuid)
RETURNS void AS $$
BEGIN
    RAISE NOTICE 'todo: implement accept_duel in Phase 4';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decline_duel(p_duel_id uuid)
RETURNS void AS $$
BEGIN
    RAISE NOTICE 'todo: implement decline_duel in Phase 4';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 5
CREATE OR REPLACE FUNCTION lock_escrow(p_duel_id uuid)
RETURNS void AS $$
BEGIN
    RAISE NOTICE 'todo: implement lock_escrow in Phase 5';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION release_escrow_to_winner(p_duel_id uuid, p_winner_id uuid)
RETURNS void AS $$
BEGIN
    RAISE NOTICE 'todo: implement release_escrow_to_winner in Phase 5';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION refund_escrow(p_duel_id uuid)
RETURNS void AS $$
BEGIN
    RAISE NOTICE 'todo: implement refund_escrow in Phase 5';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
