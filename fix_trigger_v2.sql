DROP TRIGGER IF EXISTS trigger_update_session_stats ON user_answers;
DROP FUNCTION IF EXISTS update_session_stats();

CREATE OR REPLACE FUNCTION update_session_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE game_sessions
    SET
        score = (
            SELECT COALESCE(SUM(score), 0)
            FROM user_answers
            WHERE user_id = NEW.user_id
            AND answered_at >= (SELECT started_at FROM game_sessions WHERE id = NEW.play_step_id::uuid)
        ),
        completed_challenges = (
            SELECT COUNT(*)
            FROM user_answers
            WHERE user_id = NEW.user_id
            AND is_correct = TRUE
            AND answered_at >= (SELECT started_at FROM game_sessions WHERE id = NEW.play_step_id::uuid)
        )
    WHERE id = NEW.play_step_id::uuid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_stats
    AFTER INSERT ON user_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_session_stats();
