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

-- ============= JUGADAS PREDEFINIDAS =============

-- Jugada 1: Flujo básico de desarrollo
INSERT INTO plays (id, name, description, difficulty, total_steps, estimated_duration) VALUES
('play-001', 'Desarrollo Básico', 'Flujo completo desde la definición del producto hasta el despliegue', 'beginner', 7, 15),
('play-002', 'Sprint Complejo', 'Sprint con múltiples integraciones y pruebas avanzadas', 'intermediate', 10, 25),
('play-003', 'Producción Crítica', 'Manejo de incidentes en producción con rollback urgente', 'advanced', 8, 20);

-- ============= PASOS DE JUGADA 1 - Desarrollo Básico =============

INSERT INTO play_steps (id, play_id, "order", role, challenge_id, ball_top, ball_left, message, oral_explanation, time_limit) VALUES
('step-001-1', 'play-001', 1, 'product-owner', 'chal-po-001', '50%', '5%', '¡El Product Owner define los requisitos!', 'El Product Owner es responsable de definir qué características se desarrollarán y priorizarlas según el valor para el negocio.', 60),
('step-001-2', 'play-001', 2, 'architect', 'chal-arch-001', '50%', '15%', 'El Arquitecto diseña la solución', 'El Arquitecto de Software define la estructura técnica que soportará los requisitos definidos por el Product Owner.', 90),
('step-001-3', 'play-001', 3, 'backend', 'chal-be-001', '35%', '30%', 'Backend desarrolla la lógica', 'Los desarrolladores Backend implementan la lógica del servidor y las APIs que consumirá el Frontend.', 120),
('step-001-4', 'play-001', 4, 'frontend', 'chal-fe-001', '25%', '50%', 'Frontend construye la interfaz', 'Los desarrolladores Frontend crean la interfaz de usuario que interactuará con las APIs del Backend.', 120),
('step-001-5', 'play-001', 5, 'qa-tester', 'chal-qa-001', '35%', '70%', 'QA prueba la funcionalidad', 'Los testers verifican que todo funcione correctamente y detectan errores antes del lanzamiento.', 90),
('step-001-6', 'play-001', 6, 'devops', 'chal-devops-001', '50%', '85%', 'DevOps prepara el despliegue', 'DevOps automatiza el proceso de despliegue y asegura que todo esté listo para producción.', 60),
('step-001-7', 'play-001', 7, 'team-manager', 'chal-tm-001', '50%', '95%', 'Team Manager da el visto bueno final', 'El Team Manager revisa que todo cumpla con los estándares de calidad y autoriza el lanzamiento.', 60);

-- ============= RETOS/EJEMPLOS =============

-- Retos Product Owner
INSERT INTO challenges (id, role, title, description, type, content, correct_answer, points, hints, explanation) VALUES
('chal-po-001', 'product-owner', 'Priorización de Features', 'Ordena estas características por valor de negocio', 'drag-drop', 
'{"items": ["Login de usuarios", "Panel de administración", "Botón de compartir", "Modo oscuro"]}', 
'["Login de usuarios", "Panel de administración", "Botón de compartir", "Modo oscuro"]', 
100, 
'["Piensa en qué es esencial vs qué es un extra"]', 
'El login es fundamental, el panel admin permite gestión, compartir ayuda crecimiento, modo oscuro es nice-to-have');

-- Retos Arquitecto
INSERT INTO challenges (id, role, title, description, type, content, correct_answer, points, hints, explanation) VALUES
('chal-arch-001', 'architect', 'Diseño de Sistema', 'Selecciona el patrón arquitectónico adecuado', 'quiz',
'{"question": "Para una app que necesita procesar miles de peticiones simultáneas, ¿qué patrón es mejor?", "options": ["Monolito", "Microservicios", "Serverless", "SPA"]}',
1, -- Microservicios
100,
'["Piensa en escalabilidad y distribución de carga"]',
'Microservicios permiten escalar componentes independientemente y manejar alta concurrencia');

-- Retos Backend
INSERT INTO challenges (id, role, title, description, type, content, correct_answer, points, hints, explanation) VALUES
('chal-be-001', 'backend', 'API RESTful', '¿Qué método HTTP usar para actualizar parcialmente un recurso?', 'quiz',
'{"question": "Método HTTP para actualización parcial de un recurso", "options": ["GET", "POST", "PUT", "PATCH"]}',
3, -- PATCH
100,
'["Piensa en modificar solo algunos campos, no todo el recurso"]',
'PATCH es específico para modificaciones parciales, PUT reemplaza todo el recurso');

-- Retos Frontend
INSERT INTO challenges (id, role, title, description, type, content, correct_answer, points, hints, explanation) VALUES
('chal-fe-001', 'frontend', 'Estado en React', '¿Qué hook usar para manejar efectos secundarios?', 'quiz',
'{"question": "Hook de React para efectos secundarios como llamadas API", "options": ["useState", "useEffect", "useContext", "useReducer"]}',
1, -- useEffect
100,
'["Piensa en operaciones que ocurren después del render"]',
'useEffect se usa para efectos secundarios como llamadas a APIs, suscripciones, etc.');

-- Retos QA
INSERT INTO challenges (id, role, title, description, type, content, correct_answer, points, hints, explanation) VALUES
('chal-qa-001', 'qa-tester', 'Tipos de Pruebas', 'Ordena las pruebas por nivel de complejidad', 'drag-drop',
'{"items": ["Unit Test", "Integration Test", "E2E Test", "Smoke Test"]}',
'["Unit Test", "Integration Test", "E2E Test", "Smoke Test"]',
100,
'["Piensa en el alcance: desde una función hasta el sistema completo"]',
'Unit prueba una función, Integration prueba componentes juntos, E2E prueba flujo completo, Smoke verifica funcionalidad crítica');

-- Retos DevOps
INSERT INTO challenges (id, role, title, description, type, content, correct_answer, points, hints, explanation) VALUES
('chal-devops-001', 'devops', 'CI/CD Pipeline', '¿Qué etapa viene después del build en CI/CD?', 'quiz',
'{"question": "Etapa que sigue al build en un pipeline típico", "options": ["Code", "Build", "Test", "Deploy"]}',
2, -- Test
100,
'["Piensa en el flujo: código → compilar → ? → desplegar"]',
'Después de construir (build) se deben ejecutar pruebas (test) antes de desplegar (deploy)');

-- Retos Team Manager
INSERT INTO challenges (id, role, title, description, type, content, correct_answer, points, hints, explanation) VALUES
('chal-tm-001', 'team-manager', 'Code Review', '¿Qué es más importante en un code review?', 'quiz',
'{"question": "Prioridad principal en code review", "options": ["Estilo de código", "Performance", "Lógica correcta", "Comentarios"]}',
2, -- Lógica correcta
100,
'["Piensa en qué afecta directamente la funcionalidad"]',
'La lógica correcta es crítica; el estilo es importante pero secundario, la performance y comentarios son valiosos pero la corrección es fundamental');

-- ============= USUARIOS DE PRUEBA =============

INSERT INTO users (id, name, name_normalized, total_score, current_level) VALUES
('user-001', 'Estudiante Demo', 'estudiante demo', 0, 1),
('user-002', 'Profesor Guía', 'profesor guía', 500, 3);

-- ============= SESIONES DE EJEMPLO =============

INSERT INTO game_sessions (id, user_id, current_play_id, score, completed_challenges, status) VALUES
('session-001', 'user-001', 'play-001', 0, 0, 'active');
