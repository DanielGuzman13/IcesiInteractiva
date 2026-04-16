import { NextRequest, NextResponse } from 'next/server';
import { getPostgresPool } from '@/lib/database/postgres';

interface UserAnswer {
  id: string;
  challengeId: string;
  playStepId: string;
  answer: any;
  isCorrect: boolean;
  score: number;
  answeredAt: string;
  role: string | null;
}

interface UserWithAnswers {
  id: string;
  name: string;
  salon: string;
  totalScore: number;
  answers: UserAnswer[];
  roleCounts: Record<string, number>;
  favoriteRole: string | null;
  totalAnswers: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salon = searchParams.get('salon');

    if (!salon || (salon !== '205M' && salon !== '206M')) {
      return NextResponse.json(
        { error: 'Parámetro salon es requerido y debe ser 205M o 206M' },
        { status: 400 }
      );
    }

    const pool = getPostgresPool();

    // Obtener usuarios del salón con sus respuestas de pregunta abierta (role-feedback)
    const query = `
      SELECT 
        u.id as user_id,
        u.name as user_name,
        u.salon,
        u.total_score,
        ua.id as answer_id,
        ua.challenge_id,
        ua.play_step_id,
        ua.answer,
        ua.is_correct,
        ua.score as answer_score,
        ua.answered_at
      FROM users u
      INNER JOIN user_answers ua ON u.id = ua.user_id
      WHERE u.salon = $1
        AND ua.challenge_id LIKE 'role-feedback-%'
      ORDER BY ua.answered_at DESC
    `;

    const result = await pool.query(query, [salon]);
    const rows = result.rows;

    // Agrupar respuestas por usuario
    const usersMap = new Map();

    rows.forEach((row: any) => {
      const userId = row.user_id;
      
      if (!usersMap.has(userId)) {
        usersMap.set(userId, {
          id: userId,
          name: row.user_name,
          salon: row.salon,
          totalScore: row.total_score,
          answers: [],
          roleCounts: {} as Record<string, number>
        });
      }

      const user = usersMap.get(userId);

      if (row.answer_id) {
        // Extraer el rol del challenge_id (formato: role-feedback-{rol})
        let role = null;
        if (row.challenge_id && row.challenge_id.startsWith('role-feedback-')) {
          role = row.challenge_id.replace('role-feedback-', '');
        }

        user.answers.push({
          id: row.answer_id,
          challengeId: row.challenge_id,
          playStepId: row.play_step_id,
          answer: row.answer,
          isCorrect: row.is_correct,
          score: row.answer_score,
          answeredAt: row.answered_at,
          role
        });

        // Contar respuestas por rol
        if (role) {
          user.roleCounts[role] = (user.roleCounts[role] || 0) + 1;
        }
      }
    });

    // Convertir a array y determinar el rol favorito de cada usuario
    const users = Array.from(usersMap.values()).map(user => {
      let favoriteRole: string | null = null;
      let maxCount = 0;

      const roleKeys = Object.keys(user.roleCounts);
      for (const role of roleKeys) {
        const count = user.roleCounts[role] as number;
        if (count > maxCount) {
          maxCount = count;
          favoriteRole = role;
        }
      }

      return {
        ...user,
        favoriteRole,
        totalAnswers: user.answers.length
      };
    });

    return NextResponse.json({
      salon,
      users,
      totalUsers: users.length,
      totalAnswers: users.reduce((sum, user) => sum + user.answers.length, 0)
    });

  } catch (error) {
    console.error('Error fetching respuestas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función auxiliar para extraer el rol de un ID
function extractRoleFromId(id: string): string | null {
  if (!id) return null;

  const roles = ['arquitecto', 'devops', 'frontend', 'manager', 'portero', 'qa', 'product_owner'];
  
  for (const role of roles) {
    if (id.toLowerCase().includes(role)) {
      return role;
    }
  }

  // Si no encuentra rol conocido, retorna null
  return null;
}
