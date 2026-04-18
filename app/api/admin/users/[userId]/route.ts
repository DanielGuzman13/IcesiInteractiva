import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '../../../../../repositories/UserRepository';
import { UserAnswerRepository } from '../../../../../repositories/UserAnswerRepository';
import { GameSessionRepository } from '../../../../../repositories/GameSessionRepository';

const userRepository = new UserRepository();
const userAnswerRepository = new UserAnswerRepository();
const gameSessionRepository = new GameSessionRepository();

// Eliminar usuario específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const confirm = searchParams.get('confirm');

    console.log('DELETE /api/admin/users/[userId] called:', { userId, confirm });

    // Requiere confirmación explícita
    if (confirm !== 'YES') {
      console.log('Confirmation failed');
      return NextResponse.json(
        { error: 'Confirmación requerida. Agrega ?confirm=YES a la URL' },
        { status: 400 }
      );
    }

    // Eliminar usuario directamente
    console.log('Deleting user...');

    const [userAnswers, sessions] = await Promise.all([
      userAnswerRepository.findByUserId(userId),
      gameSessionRepository.findByUserId(userId),
    ]);

    await Promise.all(userAnswers.map(answer => userAnswerRepository.delete(answer.id)));
    await Promise.all(sessions.map(session => gameSessionRepository.delete(session.id)));
    await userRepository.delete(userId);
    console.log('User deleted successfully');

    return NextResponse.json({
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
