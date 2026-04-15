'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Actividad1TiroLibre } from '@/components/game/reto/ProductOwner/Actividad1TiroLibre';
import { Actividad2Salida } from '@/components/game/reto/ProductOwner/Actividad2Salida';
import { useGamePersistence } from '@/hooks/useGamePersistence';
import RoleDialogueOverlay from '@/components/game/reto/RoleDialogueOverlay';

type Paso = 'intro' | 'actividad1' | 'actividad2' | 'resultado';
type DialogoPendiente = { activity: 1 | 2; nextStep: 'actividad2' | 'resultado' } | null;

export default function PorteroRetoPage() {
  const { saveAnswer } = useGamePersistence();
  const [paso, setPaso] = useState<Paso>('intro');
  const [scoreA1, setScoreA1] = useState(0);
  const [scoreA2, setScoreA2] = useState(0);
  const [dialogoPendiente, setDialogoPendiente] = useState<DialogoPendiente>(null);

  const handleA1Complete = (score: number) => {
    setScoreA1(score);
    setDialogoPendiente({ activity: 1, nextStep: 'actividad2' });

    // Guardar respuesta en PostgreSQL
    saveAnswer('po-actividad-1', { score }, score > 0, score);
  };

  const handleA2Complete = (score: number) => {
    setScoreA2(score);
    setDialogoPendiente({ activity: 2, nextStep: 'resultado' });

    // Guardar respuesta en PostgreSQL
    saveAnswer('po-actividad-2', { score }, score > 0, score);
  };

  const handleContinueDialog = () => {
    if (!dialogoPendiente) return;
    setPaso(dialogoPendiente.nextStep);
    setDialogoPendiente(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalScore = scoreA1 + scoreA2;

  const getNivel = () => {
    if (totalScore >= 55) return { label: '🥇 Product Owner Experto', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-300' };
    if (totalScore >= 35) return { label: '🥈 Product Owner Competente', color: 'text-gray-500', bg: 'bg-gray-50 border-gray-300' };
    return { label: '🥉 Product Owner en Formación', color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' };
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex flex-col items-center py-8 px-4">
      {dialogoPendiente && (
        <RoleDialogueOverlay role="product-owner" activity={dialogoPendiente.activity} onContinue={handleContinueDialog} />
      )}

      {/* Top bar */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <Link
          href="/game"
          className="text-white/80 hover:text-white text-sm font-semibold flex items-center gap-1 transition-colors"
        >
          ← Volver a la cancha
        </Link>
        <div className="flex items-center gap-3">
          {/* Progreso */}
          <div className="flex gap-1.5">
            {(['actividad1', 'actividad2', 'resultado'] as const).map((p, i) => (
              <div
                key={p}
                className={`w-3 h-3 rounded-full border-2 border-white transition-all ${
                  paso === 'intro' ? 'bg-white/20' :
                  paso === 'actividad1' && i === 0 ? 'bg-white' :
                  paso === 'actividad2' && i <= 1 ? (i === 1 ? 'bg-white' : 'bg-green-400') :
                  paso === 'resultado' ? 'bg-green-400' :
                  'bg-white/20'
                }`}
              />
            ))}
          </div>
          <span className="text-white/70 text-xs">
            {paso === 'intro' ? '0/2' : paso === 'actividad1' ? '1/2' : paso === 'actividad2' ? '2/2' : '✓'}
          </span>
        </div>
      </div>

      {/* Card principal */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header del rol */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 border-3 border-white flex items-center justify-center text-3xl shadow-inner">
              🥅
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-0.5">Rol del equipo</div>
              <h1 className="text-3xl font-extrabold">Portero</h1>
              <div className="text-blue-200 text-sm font-medium">Product Owner · Priorización y Decisión</div>
            </div>
            {paso !== 'intro' && paso !== 'resultado' && (
              <div className="ml-auto text-right">
                <div className="text-xs text-blue-200">Score acumulado</div>
                <div className="text-2xl font-black">{scoreA1 + (paso === 'actividad2' ? 0 : 0)} pts</div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* INTRO */}
          {paso === 'intro' && (
            <div className="text-center">
              <div className="mb-8">
                <p className="text-gray-600 text-base leading-relaxed max-w-xl mx-auto">
                  El <strong>Product Owner</strong> es como el portero: tiene la última palabra sobre qué entra y qué no.
                  Define la estrategia del producto, prioriza el backlog y toma decisiones clave en cada momento.
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {[
                    { icon: '⚽', title: 'Actividad 1 — Tiro Libre', desc: 'Prioriza la jugada que más valor genera en un momento crítico' },
                    { icon: '🎯', title: 'Actividad 2 — Salida de Balón', desc: 'Decide la dirección estratégica del equipo para avanzar' },
                  ].map(a => (
                    <div key={a.title} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="text-2xl mb-2">{a.icon}</div>
                      <div className="font-bold text-gray-800 text-sm">{a.title}</div>
                      <div className="text-gray-500 text-xs mt-1">{a.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setPaso('actividad1')}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-4 px-10 rounded-full text-lg transition-all shadow-lg"
              >
                ¡Comenzar reto! ⚽
              </button>
            </div>
          )}

          {/* ACTIVIDAD 1 */}
          {paso === 'actividad1' && (
            <Actividad1TiroLibre onComplete={handleA1Complete} />
          )}

          {/* ACTIVIDAD 2 */}
          {paso === 'actividad2' && (
            <Actividad2Salida onComplete={handleA2Complete} />
          )}

          {/* RESULTADO FINAL */}
          {paso === 'resultado' && (() => {
            const nivel = getNivel();
            return (
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">🏆</div>
                <h2 className="text-3xl font-extrabold text-gray-800 mb-2">¡Reto Completado!</h2>
                <p className="text-gray-500 mb-6">Has completado las 2 actividades del rol <strong>Product Owner</strong></p>

                {/* Score breakdown */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: 'Actividad 1', score: scoreA1, icon: '⚽' },
                    { label: 'Actividad 2', score: scoreA2, icon: '🎯' },
                    { label: 'Total', score: totalScore, icon: '🏆', bold: true },
                  ].map(item => (
                    <div key={item.label} className={`rounded-xl border p-4 ${item.bold ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className={`text-2xl font-black ${item.bold ? 'text-yellow-600' : 'text-gray-700'}`}>{item.score} pts</div>
                      <div className="text-xs text-gray-500">{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Nivel */}
                <div className={`inline-block rounded-xl border-2 px-6 py-3 mb-8 ${nivel.bg}`}>
                  <span className={`text-xl font-extrabold ${nivel.color}`}>{nivel.label}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => { setPaso('intro'); setScoreA1(0); setScoreA2(0); }}
                    className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-3 px-6 rounded-full transition-all"
                  >
                    🔄 Intentar de nuevo
                  </button>
                  <Link
                    href="/game"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md text-center"
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
