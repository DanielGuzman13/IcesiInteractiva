import { NextRequest, NextResponse } from 'next/server';
import { GameSessionRepository } from '../../../repositories/GameSessionRepository';
import { UserRepository } from '../../../repositories/UserRepository';

const gameSessionRepository = new GameSessionRepository();
const userRepository = new UserRepository();

// Crear nueva sesión de juego
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, currentPlayId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const session = await gameSessionRepository.create({
      userId,
      currentPlayId: currentPlayId || null
    });

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Obtener sesión activa del usuario
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

    const sessions = await gameSessionRepository.findByUserId(userId);
    const activeSession = sessions.find((s: { status: string }) => s.status === 'active');

    if (!activeSession) {
      return NextResponse.json({ session: null });
    }

    return NextResponse.json({ session: activeSession });
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
