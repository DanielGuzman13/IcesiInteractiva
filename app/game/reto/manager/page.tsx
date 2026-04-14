'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Actividad1PaseFiltrado } from '../../../../components/game/reto/manager/Actividad1PaseFiltrado';
import { Actividad2CambioFrente } from '../../../../components/game/reto/manager/Actividad2CambioFrente';
import { useGamePersistence } from '@/hooks/useGamePersistence';

// Score persistido en localStorage (simula UserAnswer hasta que BD esté conectada)
const guardarScore = (actividad: string, score: number) => {
  if (typeof window === 'undefined') return;
  const pre = localStorage.getItem('currentPlayer') || 'guest';
  const prev = JSON.parse(localStorage.getItem(`${pre}_manager_scores`) || '{}');
  prev[actividad] = score;
  localStorage.setItem(`${pre}_manager_scores`, JSON.stringify(prev));
};

type Paso = 'intro' | 'actividad1' | 'actividad2' | 'resultado';

export default function ManagerRetoPage() {
  const { saveAnswer } = useGamePersistence();
  const [paso, setPaso] = useState<Paso>('intro');
  const [scoreA1, setScoreA1] = useState(0);
  const [scoreA2, setScoreA2] = useState(0);

  const handleA1Complete = (score: number) => {
    setScoreA1(score);
    guardarScore('actividad1_pase', score);
    setPaso('actividad2');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Guardar respuesta en PostgreSQL
    saveAnswer('manager-actividad-1', { score }, score > 0, score);
  };

  const handleA2Complete = (score: number) => {
    setScoreA2(score);
    guardarScore('actividad2_cambio', score);
    setPaso('resultado');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Guardar respuesta en PostgreSQL
    saveAnswer('manager-actividad-2', { score }, score > 0, score);
  };

  const total = scoreA1 + scoreA2;

  const getNivel = () => {
    if (total >= 180) return { label: '🥇 Manager de Élite — Estrategia y Control Total', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-300' };
    if (total >= 100) return { label: '🥈 Manager Funcional — Cumple la Tarea Bajo Presión', color: 'text-gray-500', bg: 'bg-gray-50 border-gray-300' };
    return { label: '🥉 Manager Apurado — Caos en la Organización', color: 'text-red-500', bg: 'bg-red-50 border-red-200' };
  };

  const progreso = paso === 'intro' ? 0 : paso === 'actividad1' ? 1 : paso === 'actividad2' ? 2 : 3;

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-yellow-700 flex flex-col items-center py-8 px-4">
      {/* Top bar */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <Link href="/game" className="text-white/80 hover:text-white text-sm font-semibold flex items-center gap-1 transition-colors">
          ← Volver a la cancha
        </Link>
        {/* Barra de progreso */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-3 h-3 rounded-full border-2 border-white transition-all ${progreso >= i ? 'bg-amber-400' : 'bg-white/20'}`} />
            ))}
          </div>
          <span className="text-white/70 text-xs">{progreso}/2 actividades</span>
        </div>
      </div>

      {/* Tarjeta principal */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header del rol */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/30 border-2 border-white flex items-center justify-center text-3xl shadow-inner text-amber-900 border-opacity-70 bg-gradient-to-tr from-amber-200 to-yellow-100">
              🧠
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-amber-100 mb-0.5">Rol del equipo</div>
              <h1 className="text-3xl font-extrabold text-white drop-shadow-sm">Volante Ofensivo</h1>
              <div className="text-amber-100 text-sm font-medium">Team Manager · Cerebro y Estrategia del Equipo</div>
            </div>
            {paso !== 'intro' && paso !== 'resultado' && (
              <div className="ml-auto text-right">
                <div className="text-xs text-amber-100">Score parcial</div>
                <div className="text-2xl font-black">{scoreA1} pts</div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* INTRO */}
          {paso === 'intro' && (
            <div className="text-center">
              <p className="text-gray-600 text-base leading-relaxed max-w-2xl mx-auto mb-6">
                El <strong>Team Manager</strong> es el &apos;10&apos; del equipo. Todo el juego pasa por ti. 
                Como estratega, debes analizar el campo, delegar funciones correctamente, y 
                asegurarte de que la información (o el balón) llegue exactamente a donde el equipo lo necesita.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
                {[
                  { icon: '👟', title: 'Actividad 1 — El Pase Filtrado', desc: 'Evalúa el campo y escoge el tipo de pase correcto para evadir la presión técnica.' },
                  { icon: '🗺️', title: 'Actividad 2 — El Cambio de Frente', desc: 'Gestiona la sobrecarga de trabajo delegando y distribuyendo recursos al espacio libre.' },
                ].map(a => (
                  <div key={a.title} className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-2">{a.icon}</div>
                    <div className="font-bold text-gray-800 text-sm">{a.title}</div>
                    <div className="text-gray-500 text-xs mt-1">{a.desc}</div>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800 text-left">
                <strong>💡 Recuerda:</strong> Una buena decisión ahorra trabajo doble. Busca las soluciones más inteligentes (Puntuación máxima: <strong>200 pts</strong>).
              </div>
              <button
                onClick={() => setPaso('actividad1')}
                className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold py-4 px-12 rounded-full text-lg transition-all shadow-xl shadow-amber-500/30"
              >
                Poner el balón a rodar ⚽
              </button>
            </div>
          )}

          {/* ACTIVIDAD 1 */}
          {paso === 'actividad1' && <Actividad1PaseFiltrado onComplete={handleA1Complete} />}

          {/* ACTIVIDAD 2 */}
          {paso === 'actividad2' && <Actividad2CambioFrente onComplete={handleA2Complete} />}

          {/* RESULTADO FINAL */}
          {paso === 'resultado' && (() => {
            const nivel = getNivel();
            return (
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {total >= 180 ? '👑' : total >= 100 ? '👍' : '🏃'}
                </div>
                <h2 className="text-4xl font-extrabold text-gray-800 mb-2">¡Silbatazo Final!</h2>
                <p className="text-gray-500 mb-8 max-w-xl mx-auto">
                  El rol de <strong>Team Manager</strong> requiere visión de campo, inteligencia técnica y comunicación clara con los desarrolladores.
                </p>

                {/* Score breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                  {[
                    { label: 'El Pase Filtrado', score: scoreA1, icon: '👟' },
                    { label: 'El Cambio de Frente', score: scoreA2, icon: '🗺️' },
                    { label: 'Puntaje Total', score: total, icon: '🧠', bold: true },
                  ].map(item => (
                    <div key={item.label} className={`rounded-2xl border-2 p-5 ${item.bold ? 'border-amber-400 bg-amber-50 shadow-sm' : 'border-slate-200 bg-slate-50'}`}>
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div className={`text-3xl font-black ${item.bold ? 'text-amber-600' : item.score === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                         {item.score} <span className="text-sm font-medium text-gray-400">pts</span>
                      </div>
                      <div className={`text-xs uppercase tracking-wider font-bold mt-1 ${item.bold ? 'text-amber-800' : 'text-gray-500'}`}>{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Nivel */}
                <div className={`inline-block rounded-2xl border-2 px-8 py-4 mb-10 ${nivel.bg}`}>
                  <span className={`text-xl font-black ${nivel.color}`}>{nivel.label}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 text-sm text-slate-700 text-left max-w-2xl mx-auto shadow-sm">
                  <div className="font-bold text-amber-600 mb-2">⚽ Análisis del Rendimiento 💻</div>
                  Ser el &apos;10&apos; del equipo es saber manejar los recursos y elegir las técnicas adecuadas. Las decisiones monolíticas forzan al equipo a luchar internamente, el micromanagement hace perder el balón, pero delegar con buena arquitectura rompe líneas y facilita el gol.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => { setPaso('intro'); setScoreA1(0); setScoreA2(0); }}
                    className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-bold py-3 px-8 rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-slate-100"
                  >
                    🔄 Revisar el VAR (Reintentar)
                  </button>
                  <Link
                    href="/game"
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-10 rounded-full transition-all shadow-lg text-center"
                  >
                    ← Volver a la cancha
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </main>
  );
}
