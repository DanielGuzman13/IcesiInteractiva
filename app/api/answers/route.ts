import { NextRequest, NextResponse } from 'next/server';
import { UserAnswerRepository } from '../../../repositories/UserAnswerRepository';
import { UserRepository } from '../../../repositories/UserRepository';

const userAnswerRepository = new UserAnswerRepository();
const userRepository = new UserRepository();

// Guardar respuesta de usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, challengeId, playStepId, answer, isCorrect, responseTime, attempts, score } = body;

    console.log('POST /api/answers received:', { userId, challengeId, playStepId, score });

    if (!userId || !challengeId || !playStepId) {
      console.error('Missing required fields:', { userId, challengeId, playStepId });
      return NextResponse.json(
        { error: 'userId, challengeId, and playStepId are required' },
        { status: 400 }
      );
    }

    // Guardar respuesta
    console.log('Creating user answer...');
    const userAnswer = await userAnswerRepository.create({
      userId,
      challengeId,
      playStepId,
      answer,
      isCorrect,
      responseTime: responseTime || 0,
      attempts: attempts || 1,
      score: score || 0
    });
    console.log('User answer created:', userAnswer);

    // Actualizar score del usuario
    if (score) {
      console.log('Updating user score:', { userId, score });
      await userRepository.updateScore(userId, score);
      console.log('User score updated successfully');
    }

    return NextResponse.json({
      answer: userAnswer,
      message: 'Respuesta guardada y score actualizado'
    });
  } catch (error) {
    console.error('Error saving answer:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Obtener respuestas de un usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const answers = await userAnswerRepository.findByUserId(userId);

    return NextResponse.json({ answers });
  } catch (error) {
    console.error('Error getting answers:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
