'use client';

import React, { useState, useEffect } from 'react';

interface Player {
  id: string;
  name: string;
  salon: string;
  totalScore: number;
  currentLevel: number;
}

interface RankingData {
  salon: string;
  players: Player[];
}

export default function RankingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedSalon, setSelectedSalon] = useState<'205M' | '206M'>('205M');
  const [ranking205M, setRanking205M] = useState<Player[]>([]);
  const [ranking206M, setRanking206M] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Contraseña para acceder al ranking
  const ADMIN_PASSWORD = 'icesi2024';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      // Cargar ambos rankings al autenticarse
      fetchRanking('205M');
      fetchRanking('206M');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const fetchRanking = async (salon: '205M' | '206M') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/ranking-salon?salon=${salon}&limit=20`);
      if (!response.ok) {
        throw new Error('Error al obtener ranking');
      }
      const data: RankingData = await response.json();
      
      if (salon === '205M') {
        setRanking205M(data.players);
      } else {
        setRanking206M(data.players);
      }
    } catch (err) {
      console.error('Error fetching ranking:', err);
      setError('Error al cargar el ranking');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar ranking automáticamente cada 3 segundos
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchRanking('205M');
      fetchRanking('206M');
    }, 3000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Renderizar tabla de ranking
  const renderRankingTable = (players: Player[], salon: string) => {
    if (players.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No hay jugadores en este salón aún
        </div>
      );
    }

    return (
      <table className="w-full">
        <thead>
          <tr className="bg-purple-600 text-white">
            <th className="px-4 py-3 text-left rounded-tl-lg">#</th>
            <th className="px-4 py-3 text-left">Jugador</th>
            <th className="px-4 py-3 text-right">Puntos</th>
            <th className="px-4 py-3 text-right rounded-tr-lg">Nivel</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr
              key={player.id}
              className={`${
                index === 0 ? 'bg-yellow-100' : 
                index === 1 ? 'bg-gray-200' : 
                index === 2 ? 'bg-orange-100' : 
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } hover:bg-purple-50 transition-colors`}
            >
              <td className="px-4 py-3 font-bold text-gray-700">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && index + 1}
              </td>
              <td className="px-4 py-3 font-semibold text-gray-800">{player.name}</td>
              <td className="px-4 py-3 text-right font-bold text-purple-600">
                {player.totalScore.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right text-gray-600">
                Nivel {player.currentLevel}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Ranking en Vivo</h1>
            <p className="text-gray-600">Ingresa la contraseña para acceder al ranking de salones</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
                autoFocus
              />
            </div>
            {error && (
              <div className="text-red-500 text-center font-semibold">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              Acceder
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-bold text-white mb-2">Ranking en Vivo</h1>
          <p className="text-purple-200">Actualización automática cada 3 segundos</p>
        </div>

        {/* Tablas de ranking */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Salón 205M */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🏫</span> Salón 205M
              </h2>
            </div>
            <div className="p-6">
              {loading && ranking205M.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Cargando...</div>
              ) : (
                renderRankingTable(ranking205M, '205M')
              )}
            </div>
          </div>

          {/* Salón 206M */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🏫</span> Salón 206M
              </h2>
            </div>
            <div className="p-6">
              {loading && ranking206M.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Cargando...</div>
              ) : (
                renderRankingTable(ranking206M, '206M')
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-purple-200">
          <p className="text-sm">
            Los datos se actualizan automáticamente en tiempo real mientras los jugadores completan actividades
          </p>
        </div>
      </div>
    </div>
  );
}
