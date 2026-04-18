import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '@/repositories/UserRepository';
import { UserAnswerRepository } from '@/repositories/UserAnswerRepository';

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

const userRepository = new UserRepository();
const userAnswerRepository = new UserAnswerRepository();

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

    const [usersInSalon, allAnswers] = await Promise.all([
      userRepository.findAll({ salon: salon as '205M' | '206M' }),
      userAnswerRepository.findAll(),
    ]);

    const rows = usersInSalon.flatMap(user =>
      allAnswers
        .filter(answer => answer.userId === user.id && answer.challengeId.startsWith('role-feedback-'))
        .map(answer => ({
          user_id: user.id,
          user_name: user.name,
          salon: user.salon,
          total_score: user.totalScore,
          answer_id: answer.id,
          challenge_id: answer.challengeId,
          play_step_id: answer.playStepId,
          answer: answer.answer,
          is_correct: answer.isCorrect,
          answer_score: answer.score,
          answered_at: answer.answeredAt,
        }))
    ).sort((a, b) => new Date(b.answered_at).getTime() - new Date(a.answered_at).getTime());

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
