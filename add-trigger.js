const { Pool } = require('pg');

async function addTrigger() {
  console.log('🚀 Agregando trigger para actualizar total_score...\n');

  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'icesi_interactiva'
  });

  try {
    // Verificar conexión
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa\n');

    // Crear función y trigger
    const sql = `
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
    `;

    await pool.query(sql);
    console.log('✅ Trigger agregado exitosamente\n');
    console.log('🎉 Ahora el ranking se actualizará automáticamente cuando los jugadores completen actividades\n');

    // Actualizar scores existentes
    console.log('📊 Actualizando scores existentes...');
    await pool.query(`
      UPDATE users
      SET total_score = (
        SELECT COALESCE(SUM(score), 0)
        FROM user_answers
        WHERE user_id = users.id
      )
    `);
    console.log('✅ Scores existentes actualizados\n');

  } catch (error) {
    console.error('❌ Error al agregar trigger:');
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

addTrigger();
