'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'icesi2024') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Panel de Administración
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa la contraseña"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Acceder
            </button>
          </form>
        </div>
      </div>
    );
  }

  const adminPages = [
    {
      name: 'Ranking',
      description: 'Ver el ranking de estudiantes por salón en tiempo real',
      url: '/admin/ranking',
      icon: '🏆',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      name: 'Base de Datos',
      description: 'Gestionar usuarios y limpiar la base de datos',
      url: '/admin/database',
      icon: '🗄️',
      color: 'from-blue-400 to-blue-600'
    },
    {
      name: 'Respuestas',
      description: 'Ver respuestas de estudiantes por salón en tiempo real',
      url: '/admin/respuestas',
      icon: '📊',
      color: 'from-green-400 to-emerald-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Selecciona una herramienta de administración
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminPages.map((page) => (
            <Link
              key={page.url}
              href={page.url}
              className="group"
            >
              <div className={`bg-gradient-to-br ${page.color} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full`}>
                <div className="text-5xl mb-4">{page.icon}</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {page.name}
                </h2>
                <p className="text-white/90 text-sm">
                  {page.description}
                </p>
                <div className="mt-4 flex items-center text-white/80 text-sm group-hover:text-white transition-colors">
                  <span>Abrir</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-gray-600 hover:text-gray-800 text-sm underline"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
