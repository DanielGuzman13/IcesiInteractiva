import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '../../../../repositories/UserRepository';

const userRepository = new UserRepository();

// Obtener usuario actual desde cookie
export async function GET(request: NextRequest) {
  try {
    const playerId = request.cookies.get('player_id')?.value;

    if (!playerId) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    const user = await userRepository.findById(playerId);

    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        salon: user.salon,
        totalScore: user.totalScore,
        currentLevel: user.currentLevel
      }
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json(
      { user: null },
      { status: 200 }
    );
  }
}
