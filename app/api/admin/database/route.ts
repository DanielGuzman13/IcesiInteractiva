import { NextRequest, NextResponse } from 'next/server';
import { getPostgresPool } from '../../../lib/database/postgres';

// Limpiar toda la base de datos (PELIGROSO)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const confirm = searchParams.get('confirm');

    // Requiere confirmación explícita
    if (confirm !== 'YES_I_AM_SURE') {
      return NextResponse.json(
        { error: 'Confirmación requerida. Agrega ?confirm=YES_I_AM_SURE a la URL' },
        { status: 400 }
      );
    }

    const pool = getPostgresPool();

    // Eliminar datos en orden correcto por foreign keys
    await pool.query('DELETE FROM user_answers');
    await pool.query('DELETE FROM user_play_progress');
    await pool.query('DELETE FROM match_states');
    await pool.query('DELETE FROM game_sessions');
    await pool.query('DELETE FROM play_steps');
    await pool.query('DELETE FROM plays');
    await pool.query('DELETE FROM challenges');
    await pool.query('DELETE FROM game_config');
    await pool.query('DELETE FROM users');

    return NextResponse.json({ 
      message: 'Base de datos limpiada exitosamente' 
    });
  } catch (error) {
    console.error('Error clearing database:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
