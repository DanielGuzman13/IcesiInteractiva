import React from 'react';
import { cookies } from 'next/headers';
import { Cancha } from '../../components/game/Cancha';
import { LogoutButton } from '../../components/game/LogoutButton';

export default async function GamePage() {
  const cookieStore = await cookies();
  const playerName = cookieStore.get('player_name')?.value;

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 px-4">
        <LogoutButton />
        <div className="text-right">
          <div>
            <div className="text-xl font-bold text-gray-800">Partido en Curso</div>
            {playerName && <div className="text-sm text-gray-600">Jugador: {playerName}</div>}
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-8 max-w-2xl text-center">
        Dos equipos simulando un ciclo de desarrollo. Selecciona a cualquier jugador de la cancha (Equipo Azul o Equipo Rojo) para visitar su reto correspondiente. Busca a los capitanes &quot;C&quot;.
      </p>

      <Cancha />
    </main>
  );
}
