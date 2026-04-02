import { NextRequest } from 'next/server';
import { UserController } from '../../../../controllers/UserController';
import { UserRepository } from '../../../../repositories/UserRepository';

// Instancia del controller y repository
const userRepository = new UserRepository();
const userController = new UserController(userRepository);

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  return userController.getProfile(request, params.userId);
}

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  return userController.updateScore(request, params.userId);
}
