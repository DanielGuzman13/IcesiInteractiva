import { NextRequest, NextResponse } from 'next/server';
import { UserAnswerRepository } from '../../../repositories/UserAnswerRepository';
import { UserRepository } from '../../../repositories/UserRepository';
import { GameSessionRepository } from '../../../repositories/GameSessionRepository';

const userAnswerRepository = new UserAnswerRepository();
const userRepository = new UserRepository();
const gameSessionRepository = new GameSessionRepository();

// Guardar respuesta de usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, challengeId, playStepId, answer, isCorrect, responseTime, attempts, score } = body;

    console.log('POST /api/answers received:', { userId, challengeId, playStepId, score });

    if (!userId || !challengeId) {
      console.error('Missing required fields:', { userId, challengeId });
      return NextResponse.json(
        { error: 'userId and challengeId are required' },
        { status: 400 }
      );
    }

    // Fallback para playStepId si llega nulo (evitar error de base de datos)
    let effectivePlayStepId = playStepId;
    if (!effectivePlayStepId) {
      console.log('playStepId is null, searching for active session for user:', userId);
      const sessions = await gameSessionRepository.findByUserId(userId);
      const activeSession = sessions.find(s => s.status === 'active');
      
      if (activeSession) {
        effectivePlayStepId = activeSession.id;
        console.log('Found active session to use as playStepId:', effectivePlayStepId);
      } else {
        // Si no hay sesión activa, creamos una de emergencia para no perder la respuesta
        console.log('No active session found, creating emergency session...');
        const newSession = await gameSessionRepository.create({
          userId,
          currentPlayId: challengeId
        });
        effectivePlayStepId = newSession.id;
        console.log('Created emergency session:', effectivePlayStepId);
      }
    }

    // Guardar respuesta
    console.log('Creating user answer...');
    const userAnswer = await userAnswerRepository.create({
      userId,
      challengeId,
      playStepId: effectivePlayStepId,
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
