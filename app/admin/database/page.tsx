'use client';

import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  salon: string;
  totalScore: number;
  currentLevel: number;
  created_at: string;
}

export default function DatabaseAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Contraseña para acceder al admin
  const ADMIN_PASSWORD = 'icesi2024';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      fetchUsers();
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ranking?limit=100');
      if (!response.ok) throw new Error('Error al obtener usuarios');
      const data = await response.json();
      setUsers(data.players || []);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearDatabase = async () => {
    if (!showClearConfirm) {
      setShowClearConfirm(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/database?confirm=YES_I_AM_SURE', {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al limpiar base de datos');

      setSuccess('Base de datos limpiada exitosamente');
      setUsers([]);
      setShowClearConfirm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al limpiar base de datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (showDeleteConfirm !== userId) {
      setShowDeleteConfirm(userId);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}?confirm=YES`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar usuario');

      setSuccess('Usuario eliminado exitosamente');
      setShowDeleteConfirm(null);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al eliminar usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🗄️</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Administración de Base de Datos</h1>
            <p className="text-gray-600">Ingresa la contraseña para acceder</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-lg"
                autoFocus
              />
            </div>
            {error && (
              <div className="text-red-500 text-center font-semibold">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              Acceder
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🗄️</div>
          <h1 className="text-4xl font-bold text-white mb-2">Administración de Base de Datos</h1>
          <p className="text-orange-200">Gestión de usuarios y limpieza de datos</p>
        </div>

        {/* Alertas */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {/* Botón para limpiar base de datos */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-2">
            <span>⚠️</span> Limpiar Base de Datos
          </h2>
          <p className="text-gray-600 mb-4">
            Esta acción eliminará TODOS los datos: usuarios, respuestas, sesiones, retos, etc.
            Esta acción es irreversible.
          </p>

          {!showClearConfirm ? (
            <button
              onClick={clearDatabase}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Limpiar Base de Datos
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-red-600 font-bold">¿Estás seguro? Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button
                  onClick={clearDatabase}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {loading ? 'Limpiando...' : 'Sí, limpiar todo'}
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lista de usuarios */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span>👥</span> Usuarios ({users.length})
            </h2>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>

          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay usuarios registrados</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <div className="font-bold text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-600">
                      Salón: {user.salon} | Puntos: {user.totalScore} | Nivel: {user.currentLevel}
                    </div>
                    <div className="text-xs text-gray-400">
                      Creado: {new Date(user.created_at).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteUser(user.id)}
                    disabled={loading}
                    className={`${
                      showDeleteConfirm === user.id
                        ? 'bg-red-700 hover:bg-red-800'
                        : 'bg-red-600 hover:bg-red-700'
                    } disabled:bg-red-400 text-white font-bold py-2 px-4 rounded-lg transition-colors`}
                  >
                    {showDeleteConfirm === user.id ? '¿Eliminar?' : 'Eliminar'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
