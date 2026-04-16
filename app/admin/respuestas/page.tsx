'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserAnswer {
  id: string;
  challengeId: string;
  playStepId: string;
  answer: any;
  isCorrect: boolean;
  score: number;
  answeredAt: string;
  role: string | null;
}

interface User {
  id: string;
  name: string;
  salon: string;
  totalScore: number;
  answers: UserAnswer[];
  roleCounts: Record<string, number>;
  favoriteRole: string | null;
  totalAnswers: number;
}

interface RespuestasData {
  salon: string;
  users: User[];
  totalUsers: number;
  totalAnswers: number;
}

const roleColors: Record<string, string> = {
  arquitecto: 'bg-purple-500',
  devops: 'bg-blue-500',
  frontend: 'bg-green-500',
  manager: 'bg-yellow-500',
  portero: 'bg-red-500',
  qa: 'bg-orange-500',
  product_owner: 'bg-pink-500'
};

const roleIcons: Record<string, string> = {
  arquitecto: '🏗️',
  devops: '⚙️',
  frontend: '🎨',
  manager: '👔',
  portero: '🧤',
  qa: '🔍',
  product_owner: '📋'
};

export default function AdminRespuestas() {
  const [selectedSalon, setSelectedSalon] = useState<'205M' | '206M' | ''>('');
  const [data, setData] = useState<RespuestasData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRespuestas = async () => {
    if (!selectedSalon) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/respuestas?salon=${selectedSalon}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al obtener respuestas');
      }

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSalon) {
      fetchRespuestas();
      
      // Polling cada 3 segundos para actualización en tiempo real
      const interval = setInterval(fetchRespuestas, 3000);
      
      return () => clearInterval(interval);
    }
  }, [selectedSalon]);

  if (!selectedSalon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Respuestas por Salón
          </h1>
          <div className="space-y-4">
            <p className="text-gray-600 text-center mb-4">
              Selecciona el salón para ver las respuestas de los estudiantes
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedSalon('205M')}
                className="flex-1 py-4 px-6 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg bg-blue-600 hover:bg-blue-700 text-white text-xl"
              >
                205M
              </button>
              <button
                onClick={() => setSelectedSalon('206M')}
                className="flex-1 py-4 px-6 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg bg-purple-600 hover:bg-purple-700 text-white text-xl"
              >
                206M
              </button>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-800 text-sm underline"
            >
              Volver al panel de administración
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Respuestas - Salón {selectedSalon}
              </h1>
              <p className="text-gray-600">
                Visualización en tiempo real de las respuestas de los estudiantes
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedSalon('')}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Cambiar Salón
              </button>
              <Link
                href="/admin"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Panel Admin
              </Link>
            </div>
          </div>
        </div>

        {loading && !data && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando respuestas...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {data && (
          <>
            {/* Feed de Respuestas en Tiempo Real */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                � Respuestas a Pregunta Abierta
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Total: {data.totalAnswers} respuesta{data.totalAnswers !== 1 ? 's' : ''}
              </p>

              <div className="space-y-4">
                {data.users.map((user) => (
                  user.answers.length > 0 && user.answers[0].answer?.response && (
                    <div
                      key={user.id}
                      className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">{user.name}</h3>
                            <p className="text-xs text-gray-500">{user.salon}</p>
                          </div>
                        </div>
                        {user.answers[0].role && (
                          <div
                            className={`${roleColors[user.answers[0].role] || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm`}
                          >
                            {roleIcons[user.answers[0].role] || '📌'} {user.answers[0].role}
                          </div>
                        )}
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-100">
                        <p className="text-gray-700">
                          {user.answers[0].answer.response}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(user.answers[0].answeredAt).toLocaleString('es-ES')}
                      </p>
                    </div>
                  )
                ))}
              </div>

              {data.users.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    Aún no hay respuestas a la pregunta abierta en el salón {selectedSalon}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
