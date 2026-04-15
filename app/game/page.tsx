import React from 'react';
import { cookies } from 'next/headers';
import { Cancha } from '../../components/game/Cancha';
import { LogoutButton } from '../../components/game/LogoutButton';
import { HUD } from '../../components/game/HUD';

export default async function GamePage() {
  const cookieStore = await cookies();
  const playerName = cookieStore.get('player_name')?.value;

  return (
    <main className="flex h-screen overflow-hidden flex-col items-center bg-gray-100 p-2 sm:p-4">
      <div className="w-full max-w-4xl flex justify-between items-center mb-4 px-2 sm:px-4">
        <LogoutButton />
        <div className="text-right">
          <div>
            <div className="text-xl font-bold text-gray-800">Partido en Curso</div>
            {playerName && <div className="text-sm text-gray-600">Jugador: {playerName}</div>}
          </div>
        </div>
      </div>
      
      <Cancha />
    </main>
  );
}
