import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '../repositories/UserRepository';

export class UserController {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  // Login con nombre de usuario único
  async login(request: NextRequest) {
    try {
      const body = await request.json();
      const { name, salon } = body;

      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'El nombre de usuario es requerido' },
          { status: 400 }
        );
      }

      if (name.trim().length > 60) {
        return NextResponse.json(
          { error: 'El nombre de usuario no puede superar 60 caracteres' },
          { status: 400 }
        );
      }

      // Validar salon si se proporciona
      if (salon && salon !== '205M' && salon !== '206M') {
        return NextResponse.json(
          { error: 'El salón debe ser 205M o 206M' },
          { status: 400 }
        );
      }

      // Buscar usuario por nombre
      let user = await this.userRepository.findByName(name.trim());

      // Si ya existe, permitir continuar (actualizar último login)
      if (user) {
        await this.userRepository.updateLastLogin(user.id);
      } else {
        // Crear nuevo usuario
        user = await this.userRepository.create({
          name: name.trim(),
          salon: salon as '205M' | '206M'
        });
        // Actualizar último login para nuevos usuarios
        await this.userRepository.updateLastLogin(user.id);
      }

      const response = NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          salon: user.salon,
          totalScore: user.totalScore,
          currentLevel: user.currentLevel
        }
      });

      const cookieOptions = {
        httpOnly: true,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 8,
      };

      // Limpiar cookies existentes antes de establecer nuevas
      response.cookies.delete('player_id');
      response.cookies.delete('player_name');

      response.cookies.set('player_id', user.id, cookieOptions);
      response.cookies.set('player_name', user.name, cookieOptions);

      return response;
    } catch (error) {
      console.error('Error en login:', error);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }
  }

  // Obtener perfil de usuario
  async getProfile(request: NextRequest, userId: string) {
    try {
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: user.id,
        name: user.name,
        totalScore: user.totalScore,
        currentLevel: user.currentLevel,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      });
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }
  }

  // Actualizar score del usuario
  async updateScore(request: NextRequest, userId: string) {
    try {
      const body = await request.json();
      const { score } = body;

      if (typeof score !== 'number' || !Number.isFinite(score)) {
        return NextResponse.json(
          { error: 'El score debe ser un número' },
          { status: 400 }
        );
      }

      if (Math.abs(score) > 10000) {
        return NextResponse.json(
          { error: 'El score excede el límite permitido por operación' },
          { status: 400 }
        );
      }

      const user = await this.userRepository.updateScore(userId, score);

      return NextResponse.json({
        id: user.id,
        name: user.name,
        totalScore: user.totalScore,
        currentLevel: user.currentLevel
      });
    } catch (error) {
      console.error('Error al actualizar score:', error);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }
  }

  // Obtener ranking de jugadores
  async getRanking(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '10');

      const topPlayers = await this.userRepository.getTopPlayers(limit);

      return NextResponse.json({
        players: topPlayers.map(player => ({
          id: player.id,
          name: player.name,
          totalScore: player.totalScore,
          currentLevel: player.currentLevel
        }))
      });
    } catch (error) {
      console.error('Error al obtener ranking:', error);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }
  }

  // Obtener ranking de jugadores por salón
  async getRankingBySalon(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const salon = searchParams.get('salon');
      const limit = parseInt(searchParams.get('limit') || '10');

      if (!salon || (salon !== '205M' && salon !== '206M')) {
        return NextResponse.json(
          { error: 'El salón debe ser 205M o 206M' },
          { status: 400 }
        );
      }

      const topPlayers = await this.userRepository.getTopPlayersBySalon(salon, limit);

      return NextResponse.json({
        salon,
        players: topPlayers.map(player => ({
          id: player.id,
          name: player.name,
          salon: player.salon,
          totalScore: player.totalScore,
          currentLevel: player.currentLevel
        }))
      });
    } catch (error) {
      console.error('Error al obtener ranking por salón:', error);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }
  }
}
