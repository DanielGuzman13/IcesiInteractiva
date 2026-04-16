const { Pool } = require('pg');

async function updateAllScores() {
  console.log('🔄 Actualizando todos los scores de usuarios...\n');

  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'icesi_interactiva'
  });

  try {
    // Actualizar todos los usuarios
    const result = await pool.query(`
      UPDATE users
      SET total_score = (
        SELECT COALESCE(SUM(score), 0)
        FROM user_answers
        WHERE user_id = users.id
      )
      RETURNING id, name, total_score
    `);

    console.log(`✅ ${result.rowCount} usuarios actualizados`);
    console.table(result.rows.slice(0, 10));

    console.log('\n🎉 Todos los scores actualizados correctamente!');
    console.log('💡 Ahora el ranking debería mostrar los puntajes correctos');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

updateAllScores();
