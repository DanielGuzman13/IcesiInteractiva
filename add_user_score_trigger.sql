-- Función para actualizar total_score del usuario
CREATE OR REPLACE FUNCTION update_user_total_score()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET total_score = (
        SELECT COALESCE(SUM(score), 0)
        FROM user_answers
        WHERE user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger si no existe
DROP TRIGGER IF EXISTS trigger_update_user_total_score ON user_answers;
CREATE TRIGGER trigger_update_user_total_score
    AFTER INSERT ON user_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_user_total_score();
