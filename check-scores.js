const { Pool } = require('pg');

async function checkScores() {
  console.log('🔍 Verificando scores en la base de datos...\n');

  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'icesi_interactiva'
  });

  try {
    // Verificar usuarios y sus total_score
    console.log('📊 Usuarios y total_score:');
    const usersResult = await pool.query(`
      SELECT id, name, salon, total_score
      FROM users
      ORDER BY total_score DESC
      LIMIT 10
    `);
    console.table(usersResult.rows);

    // Verificar respuestas y sus scores
    console.log('\n📝 Respuestas recientes:');
    const answersResult = await pool.query(`
      SELECT 
        ua.id,
        u.name,
        ua.challenge_id,
        ua.score,
        ua.answered_at
      FROM user_answers ua
      JOIN users u ON ua.user_id = u.id
      ORDER BY ua.answered_at DESC
      LIMIT 10
    `);
    console.table(answersResult.rows);

    // Verificar sum de scores por usuario
    console.log('\n🧮 Suma de scores por usuario (manual):');
    const sumResult = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.total_score as current_total,
        COALESCE(SUM(ua.score), 0) as calculated_total
      FROM users u
      LEFT JOIN user_answers ua ON u.id = ua.user_id
      GROUP BY u.id, u.name, u.total_score
      ORDER BY calculated_total DESC
      LIMIT 10
    `);
    console.table(sumResult.rows);

    // Verificar si el trigger existe
    console.log('\n🔧 Verificando triggers:');
    const triggerResult = await pool.query(`
      SELECT trigger_name, event_manipulation, event_object_table
      FROM information_schema.triggers
      WHERE trigger_name LIKE '%user_score%'
    `);
    console.log('Triggers encontrados:', triggerResult.rows);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkScores();
