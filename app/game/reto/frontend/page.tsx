'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Actividad1ClaridadArco } from '@/components/game/reto/frontend/Actividad1ClaridadArco';
import { Actividad2RegateEfectivo } from '@/components/game/reto/frontend/Actividad2RegateEfectivo';

const guardarScore = (score: number) => {
  if (typeof window === 'undefined') return;
  const prev = JSON.parse(localStorage.getItem('frontend_scores') || '{}');
  prev['total'] = score;
  localStorage.setItem('frontend_scores', JSON.stringify(prev));
};

type Paso = 'intro' | 'actividad1' | 'actividad2' | 'resultado';

export default function FrontendRetoPage() {
  const [paso, setPaso] = useState<Paso>('intro');
  const [scoreA1, setScoreA1] = useState(0);
  const [scoreA2, setScoreA2] = useState(0);

  const handleA1Complete = (score: number) => {
    setScoreA1(score);
    setPaso('actividad2');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleA2Complete = (score: number) => {
    setScoreA2(score);
    guardarScore(scoreA1 + score);
    setPaso('resultado');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const total = scoreA1 + scoreA2;
  const progreso = paso === 'intro' ? 0 : paso === 'actividad1' ? 1 : paso === 'actividad2' ? 2 : 3;

  const getNivel = () => {
    if (total >= 180) return { label: '🥇 Frontend Estrella — UI/UX Impecable', color: 'text-pink-600', bg: 'bg-pink-50 border-pink-300' };
    if (total >= 100) return { label: '🥈 Frontend Promedio — Interfaz funcional pero pesada', color: 'text-gray-500', bg: 'bg-gray-50 border-gray-300' };
    return { label: '🥉 Frontend Novato — Diseño confuso y UX frustrante', color: 'text-red-500', bg: 'bg-red-50 border-red-200' };
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-800 to-rose-700 flex flex-col items-center py-8 px-4">
      {/* Top bar */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <Link href="/game" className="text-white/80 hover:text-white text-sm font-semibold flex items-center gap-1 transition-colors">
          ← Volver a la cancha
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-3 h-3 rounded-full border-2 border-white transition-all ${progreso >= i ? 'bg-pink-400' : 'bg-white/20'}`} />
            ))}
          </div>
          <span className="text-white/70 text-xs">{Math.min(progreso, 2)}/2 actividades</span>
        </div>
      </div>

      {/* Card principal */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header del rol */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-500 px-8 py-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-3xl shadow-inner">
              🎨
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-pink-200 mb-0.5">Rol del equipo</div>
              <h1 className="text-3xl font-extrabold">Delantero</h1>
              <div className="text-pink-200 text-sm font-medium">Frontend · UI / UX e Interacción</div>
            </div>
            {paso !== 'intro' && paso !== 'resultado' && (
              <div className="ml-auto text-right">
                <div className="text-xs text-pink-200">Score parcial</div>
                <div className="text-2xl font-black">{scoreA1} pts</div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* INTRO */}
          {paso === 'intro' && (
            <div className="text-center">
              <p className="text-gray-600 text-base leading-relaxed max-w-xl mx-auto mb-6">
                El <strong>Frontend</strong> es el delantero del equipo: el jugador que define las jugadas y anota los goles, y también el que interactúa directamente con el cliente final conectando con sus emociones. Una buena interfaz es como un buen ataque, siempre debe dar resultados.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-6">
                {[
                  { icon: '🎯', title: 'Actividad 1 — Claridad del Arco', desc: 'Evalúa la jerarquía visual mediante qué tan despejado está un pasillo de remate.' },
                  { icon: '⚡', title: 'Actividad 2 — Regate Efectivo', desc: 'Comprueba el valor de una UX fluida mediante tu interacción en movimiento contra el defensa.' },
                ].map(a => (
                  <div key={a.title} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="text-2xl mb-2">{a.icon}</div>
                    <div className="font-bold text-gray-800 text-sm">{a.title}</div>
                    <div className="text-gray-500 text-xs mt-1">{a.desc}</div>
                  </div>
                ))}
              </div>
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-6 text-sm text-pink-800 text-left">
                <strong>🎨 Puntuación total máxima: 200 pts.</strong> Evalúa tu capacidad de crear interacciones y jerarquías visuales intuitivas.
              </div>
              <button onClick={() => setPaso('actividad1')}
                className="bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-bold py-4 px-10 rounded-full text-lg transition-all shadow-lg">
                ¡Comenzar reto! 🎨
              </button>
            </div>
          )}

          {paso === 'actividad1' && <Actividad1ClaridadArco onComplete={handleA1Complete} />}
          {paso === 'actividad2' && <Actividad2RegateEfectivo onComplete={handleA2Complete} />}

          {/* RESULTADO FINAL */}
          {paso === 'resultado' && (() => {
            const nivel = getNivel();
            return (
              <div className="text-center">
                <div className="text-6xl mb-4">{total >= 180 ? '🏆' : total >= 100 ? '🥈' : '🥉'}</div>
                <h2 className="text-3xl font-extrabold text-gray-800 mb-2">¡Resumen de Goleadores!</h2>
                <p className="text-gray-500 mb-6">Has completado las 2 actividades del rol <strong>Frontend / Delantero</strong></p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: 'Claridad del Arco', score: scoreA1, icon: '🎯' },
                    { label: 'Regate Efectivo', score: scoreA2, icon: '🏃' },
                    { label: 'Total', score: total, icon: '🏆', bold: true },
                  ].map(item => (
                    <div key={item.label} className={`rounded-xl border p-4 ${item.bold ? 'border-pink-300 bg-pink-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className={`text-2xl font-black ${item.bold ? 'text-pink-600' : item.score === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                        {item.score} pts
                      </div>
                      <div className="text-xs text-gray-500">{item.label}</div>
                    </div>
                  ))}
                </div>

                <div className={`inline-block rounded-xl border-2 px-6 py-3 mb-6 ${nivel.bg}`}>
                  <span className={`text-lg font-extrabold ${nivel.color}`}>{nivel.label}</span>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-sm text-gray-600 text-left">
                  <strong>💡 Reflexión:</strong> Como Frontend, no sólo conectas visualmente el balón a la portería, sino que facilitas al usuario que cada interacción y 'regate' se sienta natural y efectiva sin estropear su experiencia (UX).
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={() => { setPaso('intro'); setScoreA1(0); setScoreA2(0); }}
                    className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-3 px-6 rounded-full transition-all">
                    🔄 Intentar de nuevo
                  </button>
                  <Link href="/game"
                    className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md text-center">
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
