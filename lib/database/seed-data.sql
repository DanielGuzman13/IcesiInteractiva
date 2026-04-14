-- ============= DATOS INICIALES =============

-- Configuración inicial del juego
INSERT INTO game_config (
    play_duration,
    score_per_correct_answer,
    score_penalty_per_wrong_answer,
    time_bonus_per_second,
    max_attempts_per_challenge,
    oral_explanation_duration
) VALUES (
    30, -- 30 minutos por jugada
    100, -- 100 puntos por respuesta correcta
    25, -- -25 puntos por respuesta incorrecta
    2, -- 2 puntos bonus por segundo restante
    3, -- máximo 3 intentos por reto
    30 -- 30 segundos de explicación oral
);

-- Nota: Los datos de prueba (plays, challenges, users, etc.) se crearán dinámicamente desde la aplicación
-- cuando sea necesario. Esto evita problemas con referencias de UUIDs entre tablas.
