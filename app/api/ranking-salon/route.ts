import { NextRequest } from 'next/server';
import { UserController } from '../../../controllers/UserController';
import { UserRepository } from '../../../repositories/UserRepository';

// Instancia del controller y repository
const userRepository = new UserRepository();
const userController = new UserController(userRepository);

export async function GET(request: NextRequest) {
  return userController.getRankingBySalon(request);
}
