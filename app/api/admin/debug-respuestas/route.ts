import { NextRequest, NextResponse } from 'next/server';
import { getPostgresPool } from '@/lib/database/postgres';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salon = searchParams.get('salon');

    const pool = getPostgresPool();

    // Obtener todas las respuestas sin filtrar
    let query = `
      SELECT 
        u.id as user_id,
        u.name as user_name,
        u.salon,
        ua.id as answer_id,
        ua.challenge_id,
        ua.play_step_id,
        ua.answer,
        ua.is_correct,
        ua.score as answer_score,
        ua.answered_at
      FROM users u
      LEFT JOIN user_answers ua ON u.id = ua.user_id
    `;

    const params: any[] = [];

    if (salon) {
      query += ` WHERE u.salon = $1`;
      params.push(salon);
    }

    query += ` ORDER BY ua.answered_at DESC`;

    const result = await pool.query(query, params);
    const rows = result.rows;

    return NextResponse.json({
      total: rows.length,
      rows: rows.map(row => ({
        userId: row.user_id,
        userName: row.user_name,
        salon: row.salon,
        answerId: row.answer_id,
        challengeId: row.challenge_id,
        playStepId: row.play_step_id,
        answer: row.answer,
        isCorrect: row.is_correct,
        score: row.answer_score,
        answeredAt: row.answered_at
      }))
    });

  } catch (error) {
    console.error('Error debugging respuestas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: String(error) },
      { status: 500 }
    );
  }
}
