-- ============= TABLAS PRINCIPALES =============

-- Usuarios/Estudiantes
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_normalized VARCHAR(255) UNIQUE NOT NULL,
    salon VARCHAR(10) CHECK (salon IN ('205M', '206M')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_score INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1
);

-- Jugadas predefinidas (flujos de trabajo)
CREATE TABLE plays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    total_steps INTEGER NOT NULL,
    estimated_duration INTEGER NOT NULL, -- minutos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pasos de jugada (secuencia de roles)
CREATE TABLE play_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    play_id UUID REFERENCES plays(id) ON DELETE CASCADE,
    "order" INTEGER NOT NULL,
    role VARCHAR(50) NOT NULL,
    challenge_id UUID,
    ball_top VARCHAR(10) NOT NULL,
    ball_left VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    oral_explanation TEXT NOT NULL,
    time_limit INTEGER, -- segundos
    UNIQUE(play_id, "order")
);

-- Retos/Desafíos
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('quiz', 'code', 'simulation', 'drag-drop')),
    content JSONB NOT NULL,
    correct_answer JSONB NOT NULL,
    points INTEGER NOT NULL,
    hints TEXT[],
    explanation TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE play_steps
ADD CONSTRAINT fk_play_steps_challenge
FOREIGN KEY (challenge_id) REFERENCES challenges(id);

-- Sesiones de juego
CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_play_id UUID REFERENCES plays(id),
    score INTEGER DEFAULT 0,
    completed_challenges INTEGER DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('active', 'paused', 'completed', 'abandoned')) DEFAULT 'active',
    completed_at TIMESTAMP
);

-- ============= TABLAS DE PROGRESO =============

-- Progreso del usuario en jugadas
CREATE TABLE user_play_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    play_id UUID REFERENCES plays(id) ON DELETE CASCADE,
    session_game_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 0,
    completed_steps UUID[] DEFAULT '{}',
    score INTEGER DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('in-progress', 'completed', 'failed')) DEFAULT 'in-progress',
    completed_at TIMESTAMP,
    UNIQUE(user_id, play_id, session_game_id)
);

-- Respuestas de usuarios
CREATE TABLE user_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    challenge_id VARCHAR(255) NOT NULL,
    play_step_id VARCHAR(255) NOT NULL,
    answer JSONB NOT NULL,
    is_correct BOOLEAN NOT NULL,
    response_time INTEGER NOT NULL, -- segundos
    attempts INTEGER DEFAULT 1,
    score INTEGER NOT NULL,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============= TABLAS DE ESTADO =============

-- Estado del partido
CREATE TABLE match_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_game_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    team_a_score INTEGER DEFAULT 0,
    team_b_score INTEGER DEFAULT 0,
    ball_top VARCHAR(10) NOT NULL,
    ball_left VARCHAR(10) NOT NULL,
    current_game_role VARCHAR(50),
    ball_moving BOOLEAN DEFAULT FALSE,
    target_top VARCHAR(10),
    target_left VARCHAR(10),
    current_play_id UUID REFERENCES plays(id),
    current_step INTEGER DEFAULT 0,
    possession VARCHAR(10) CHECK (possession IN ('A', 'B')) DEFAULT 'A',
    status VARCHAR(20) CHECK (status IN ('playing', 'paused', 'finished')) DEFAULT 'playing',
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    elapsed_time INTEGER DEFAULT 0, -- segundos
    UNIQUE(session_game_id)
);

-- ============= CONFIGURACIÓN =============

CREATE TABLE game_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    play_duration INTEGER DEFAULT 30, -- minutos
    score_per_correct_answer INTEGER DEFAULT 100,
    score_penalty_per_wrong_answer INTEGER DEFAULT 25,
    time_bonus_per_second INTEGER DEFAULT 2,
    max_attempts_per_challenge INTEGER DEFAULT 3,
    oral_explanation_duration INTEGER DEFAULT 30, -- segundos
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============= ÍNDICES =============

CREATE INDEX idx_users_name_normalized ON users(name_normalized);
CREATE INDEX idx_game_sessions_user ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);
CREATE INDEX idx_play_steps_play ON play_steps(play_id);
CREATE INDEX idx_play_steps_role ON play_steps(role);
CREATE INDEX idx_challenges_role ON challenges(role);
CREATE INDEX idx_user_answers_user ON user_answers(user_id);
CREATE INDEX idx_user_answers_challenge ON user_answers(challenge_id);
CREATE INDEX idx_user_play_progress_user ON user_play_progress(user_id);
CREATE INDEX idx_user_play_progress_play ON user_play_progress(play_id);

-- ============= TRIGGERS =============

-- Actualizar last_login_at cuando el usuario inicia sesión
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users 
    SET last_login_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estadísticas
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

CREATE TRIGGER trigger_update_last_login
    AFTER INSERT ON game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_last_login();

CREATE TRIGGER trigger_update_session_stats
    AFTER INSERT ON user_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_session_stats();

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

CREATE TRIGGER trigger_update_user_total_score
    AFTER INSERT ON user_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_user_total_score();
