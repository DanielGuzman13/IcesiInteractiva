import React from 'react';
import Link from 'next/link';
import { Cancha } from '../../components/game/Cancha';

export default function GamePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 px-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold underline">
          &larr; Volver al inicio
        </Link>
        <div className="text-xl font-bold text-gray-800">
          Partido en Curso
        </div>
      </div>
      
      <p className="text-gray-600 mb-8 max-w-2xl text-center">
        Dos equipos simulando un ciclo de desarrollo. Selecciona a cualquier jugador de la cancha (Equipo Azul o Equipo Rojo) para visitar su reto correspondiente. Busca a los capitanes "C".
      </p>

      <Cancha />
    </main>
  );
}
