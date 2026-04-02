import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserInput, UpdateUserInput } from '../models/User';

export class UserController {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  // Login con nombre de usuario único
  async login(request: NextRequest) {
    try {
      const body = await request.json();
      const { name } = body;

      if (!name || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'El nombre de usuario es requerido' },
          { status: 400 }
        );
      }

      // Buscar usuario por nombre
      let user = await this.userRepository.findByName(name.trim());

      // Si no existe, crearlo
      if (!user) {
        user = await this.userRepository.create({ name: name.trim() });
      }

      // Actualizar último login
      await this.userRepository.updateLastLogin(user.id);

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          totalScore: user.totalScore,
          currentLevel: user.currentLevel
        }
      });
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

      if (typeof score !== 'number') {
        return NextResponse.json(
          { error: 'El score debe ser un número' },
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
}
