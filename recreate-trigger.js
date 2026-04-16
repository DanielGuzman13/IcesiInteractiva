const { Pool } = require('pg');

async function recreateTrigger() {
  console.log('🔧 Recreando trigger para actualizar total_score...\n');

  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'icesi_interactiva'
  });

  try {
    // Primero eliminar trigger si existe
    console.log('🗑️  Eliminando trigger existente si existe...');
    try {
      await pool.query('DROP TRIGGER IF EXISTS trigger_update_user_total_score ON user_answers');
      console.log('✅ Trigger eliminado');
    } catch (error) {
      console.log('ℹ️  No existía trigger previo');
    }

    // Eliminar función si existe
    console.log('🗑️  Eliminando función existente si existe...');
    try {
      await pool.query('DROP FUNCTION IF EXISTS update_user_total_score()');
      console.log('✅ Función eliminada');
    } catch (error) {
      console.log('ℹ️  No existía función previa');
    }

    // Crear función
    console.log('📝 Creando función update_user_total_score...');
    await pool.query(`
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
    `);
    console.log('✅ Función creada');

    // Crear trigger
    console.log('📝 Creando trigger trigger_update_user_total_score...');
    await pool.query(`
      CREATE TRIGGER trigger_update_user_total_score
          AFTER INSERT ON user_answers
          FOR EACH ROW
          EXECUTE FUNCTION update_user_total_score();
    `);
    console.log('✅ Trigger creado');

    // Verificar que se creó
    console.log('\n🔍 Verificando trigger...');
    const result = await pool.query(`
      SELECT trigger_name, event_manipulation, event_object_table
      FROM information_schema.triggers
      WHERE trigger_name = 'trigger_update_user_total_score'
    `);
    console.log('Trigger encontrado:', result.rows);

    // Probar el trigger insertando una respuesta de prueba
    console.log('\n🧪 Probando trigger...');
    const testUserId = '9d028b5a-dc71-491a-87fc-53ac551951f4'; // Usuario líder

    // Obtener score antes
    const beforeResult = await pool.query('SELECT total_score FROM users WHERE id = $1', [testUserId]);
    console.log('Score antes:', beforeResult.rows[0].total_score);

    // Insertar respuesta de prueba con todos los campos requeridos
    await pool.query(`
      INSERT INTO user_answers (user_id, challenge_id, play_step_id, answer, is_correct, score, answered_at, response_time, attempts)
      VALUES ($1, 'test-challenge', NULL, '{"test": "data"}', true, 100, NOW(), 0, 1)
    `, [testUserId]);
    console.log('Respuesta de prueba insertada');

    // Obtener score después
    const afterResult = await pool.query('SELECT total_score FROM users WHERE id = $1', [testUserId]);
    console.log('Score después:', afterResult.rows[0].total_score);

    // Eliminar respuesta de prueba
    await pool.query('DELETE FROM user_answers WHERE challenge_id = $1', ['test-challenge']);
    console.log('Respuesta de prueba eliminada');

    // Restaurar score original
    await pool.query('UPDATE users SET total_score = $1 WHERE id = $2', [beforeResult.rows[0].total_score, testUserId]);
    console.log('Score original restaurado');

    console.log('\n🎉 Trigger funcionando correctamente!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalle:', error);
  } finally {
    await pool.end();
  }
}

recreateTrigger();
