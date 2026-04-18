import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '@/repositories/UserRepository';
import { UserAnswerRepository } from '@/repositories/UserAnswerRepository';

const userRepository = new UserRepository();
const userAnswerRepository = new UserAnswerRepository();

type DebugResponseRow = {
  user_id: string;
  user_name: string;
  salon: string | undefined;
  answer_id: string | null;
  challenge_id: string | null;
  play_step_id: string | null;
  answer: unknown;
  is_correct: boolean | null;
  answer_score: number | null;
  answered_at: Date | null;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salon = searchParams.get('salon');

    const [users, answers] = await Promise.all([
      salon
        ? userRepository.findAll({ salon: salon as '205M' | '206M' })
        : userRepository.findAll(),
      userAnswerRepository.findAll(),
    ]);

    const rows: DebugResponseRow[] = users.flatMap((user): DebugResponseRow[] => {
      const userAnswers = answers.filter(answer => answer.userId === user.id);

      if (userAnswers.length === 0) {
        return [{
          user_id: user.id,
          user_name: user.name,
          salon: user.salon,
          answer_id: null,
          challenge_id: null,
          play_step_id: null,
          answer: null,
          is_correct: null,
          answer_score: null,
          answered_at: null,
        }];
      }

      return userAnswers.map(answer => ({
        user_id: user.id,
        user_name: user.name,
        salon: user.salon,
        answer_id: answer.id,
        challenge_id: answer.challengeId,
        play_step_id: answer.playStepId,
        answer: answer.answer,
        is_correct: answer.isCorrect,
        answer_score: answer.score,
        answered_at: answer.answeredAt,
      }));
    }).sort((a, b) => {
      if (!a.answered_at && !b.answered_at) return 0;
      if (!a.answered_at) return 1;
      if (!b.answered_at) return -1;
      return new Date(b.answered_at).getTime() - new Date(a.answered_at).getTime();
    });

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
