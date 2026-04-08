'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Debes escribir un nombre para continuar.');
      return;
    }

    // Guardar el identificador del jugador actual para aislar sus puntajes
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentPlayer', trimmedName);
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: trimmedName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? 'No fue posible iniciar la partida.');
        return;
      }

      router.push('/game');
      router.refresh();
    } catch {
      setError('No fue posible conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-blue-50 p-6">
      <div className="text-center max-w-2xl w-full bg-white p-10 rounded-3xl shadow-2xl">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-6 tracking-tight">
          ICESI INTERACTIVA ⚽
        </h1>

        <p className="text-xl text-gray-700 mb-8">
          Escribe tu nombre para entrar a la partida y comenzar el juego.
        </p>

        <form onSubmit={handleJoin} className="flex flex-col gap-4 mb-8">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Tu nombre"
            maxLength={60}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            style={{ zIndex: 10, position: 'relative' }}
          />

          {error && <p className="text-red-600 text-sm text-left">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-10 rounded-full text-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            {isLoading ? 'Entrando...' : 'Entrar a la partida'}
          </button>
        </form>

        {/* <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/futbol"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            ⚽ Editor Fútbol
          </Link>

          <Link
            href="/blockly"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            Blockly Editor
          </Link>
        </div> */}
      </div>
    </main>
  );
}