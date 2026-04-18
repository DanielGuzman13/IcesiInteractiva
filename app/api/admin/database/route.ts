import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '@/repositories/UserRepository';
import { UserAnswerRepository } from '@/repositories/UserAnswerRepository';
import { GameSessionRepository } from '@/repositories/GameSessionRepository';

const userRepository = new UserRepository();
const userAnswerRepository = new UserAnswerRepository();
const gameSessionRepository = new GameSessionRepository();

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

    const users = await userRepository.findAll();
    const sessions = await gameSessionRepository.findAll();
    const answers = await userAnswerRepository.findAll();

    await Promise.all(answers.map(answer => userAnswerRepository.delete(answer.id)));
    await Promise.all(sessions.map(session => gameSessionRepository.delete(session.id)));
    await Promise.all(users.map(user => userRepository.delete(user.id)));

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
