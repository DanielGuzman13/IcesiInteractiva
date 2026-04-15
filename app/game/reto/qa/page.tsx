'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Actividad1BloqueoAngulo } from '../../../../components/game/reto/qa/Actividad1BloqueoAngulo';
import { Actividad2DespejeSeg } from '../../../../components/game/reto/qa/Actividad2DespejeSeg';
import { useGamePersistence } from '@/hooks/useGamePersistence';
import RoleDialogueOverlay from '@/components/game/reto/RoleDialogueOverlay';

// Score persistido en localStorage (simula UserAnswer hasta que BD esté conectada)
const guardarScore = (actividad: string, score: number) => {
  if (typeof window === 'undefined') return;
  const prev = JSON.parse(localStorage.getItem('qa_scores') || '{}');
  prev[actividad] = score;
  localStorage.setItem('qa_scores', JSON.stringify(prev));
};

type Paso = 'intro' | 'actividad1' | 'actividad2' | 'resultado';
type DialogoPendiente = { activity: 1 | 2; nextStep: 'actividad2' | 'resultado' } | null;

export default function QARetoPage() {
  const { saveAnswer } = useGamePersistence();
  const [paso, setPaso] = useState<Paso>('intro');
  const [scoreA1, setScoreA1] = useState(0);
  const [scoreA2, setScoreA2] = useState(0);
  const [dialogoPendiente, setDialogoPendiente] = useState<DialogoPendiente>(null);

  const handleA1Complete = (score: number) => {
    setScoreA1(score);
    guardarScore('actividad1_bloqueo', score);
    setDialogoPendiente({ activity: 1, nextStep: 'actividad2' });

    // Guardar respuesta en PostgreSQL
    saveAnswer('qa-actividad-1', { score }, score > 0, score);
  };

  const handleA2Complete = (score: number) => {
    setScoreA2(score);
    guardarScore('actividad2_despeje', score);
    setDialogoPendiente({ activity: 2, nextStep: 'resultado' });

    // Guardar respuesta en PostgreSQL
    saveAnswer('qa-actividad-2', { score }, score > 0, score);
  };

  const handleContinueDialog = () => {
    if (!dialogoPendiente) return;
    setPaso(dialogoPendiente.nextStep);
    setDialogoPendiente(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const total = scoreA1 + scoreA2;

  const getNivel = () => {
    if (total >= 180) return { label: '🥇 QA Maestro — Cero bugs en producción', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-300' };
    if (total >= 100) return { label: '🥈 QA Competente — Algunos riesgos controlados', color: 'text-gray-500', bg: 'bg-gray-50 border-gray-300' };
    return { label: '🥉 QA en Formación — Bugs escaparon a producción', color: 'text-red-500', bg: 'bg-red-50 border-red-200' };
  };

  const progreso = paso === 'intro' ? 0 : paso === 'actividad1' ? 1 : paso === 'actividad2' ? 2 : 3;

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-900 via-yellow-800 to-orange-700 flex flex-col items-center py-8 px-4">
      {dialogoPendiente && (
        <RoleDialogueOverlay role="qa" activity={dialogoPendiente.activity} onContinue={handleContinueDialog} />
      )}

      {/* Top bar */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <Link href="/game" className="text-white/80 hover:text-white text-sm font-semibold flex items-center gap-1 transition-colors">
          ← Volver a la cancha
        </Link>
        {/* Barra de progreso */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-3 h-3 rounded-full border-2 border-white transition-all ${progreso >= i ? 'bg-green-400' : 'bg-white/20'}`} />
            ))}
          </div>
          <span className="text-white/70 text-xs">{progreso}/2 actividades</span>
        </div>
      </div>

      {/* Tarjeta principal */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header del rol */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-500 px-8 py-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-3xl shadow-inner">
              🛡️
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-yellow-200 mb-0.5">Rol del equipo</div>
              <h1 className="text-3xl font-extrabold">Defensa Central</h1>
              <div className="text-yellow-200 text-sm font-medium">QA / Tester · Detección y Prevención de Errores</div>
            </div>
            {paso !== 'intro' && paso !== 'resultado' && (
              <div className="ml-auto text-right">
                <div className="text-xs text-yellow-200">Score parcial</div>
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
                El <strong>QA / Tester</strong> es el defensa central del equipo: detecta errores antes de que lleguen a producción
                y decide con inteligencia cómo eliminar los riesgos del sistema.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
                {[
                  { icon: '🛡️', title: 'Actividad 1 — El Bloqueo de Ángulo', desc: 'Posiciónate para bloquear el remate rival antes de que sea gol' },
                  { icon: '🧹', title: 'Actividad 2 — El Despeje de Seguridad', desc: 'Decide hacia dónde enviar el balón bajo presión del rival' },
                ].map(a => (
                  <div key={a.title} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="text-2xl mb-2">{a.icon}</div>
                    <div className="font-bold text-gray-800 text-sm">{a.title}</div>
                    <div className="text-gray-500 text-xs mt-1">{a.desc}</div>
                  </div>
                ))}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800 text-left">
                <strong>⚠️ Puntuación:</strong> Cada actividad vale hasta <strong>100 pts</strong>. Total máximo: <strong>200 pts</strong>.
                Las decisiones incorrectas pueden dar <strong>0 pts</strong> (¡gol en contra!).
              </div>
              <button
                onClick={() => setPaso('actividad1')}
                className="bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-white font-bold py-4 px-10 rounded-full text-lg transition-all shadow-lg"
              >
                ¡Comenzar reto! 🛡️
              </button>
            </div>
          )}

          {/* ACTIVIDAD 1 */}
          {paso === 'actividad1' && <Actividad1BloqueoAngulo onComplete={handleA1Complete} />}

          {/* ACTIVIDAD 2 */}
          {paso === 'actividad2' && <Actividad2DespejeSeg onComplete={handleA2Complete} />}

          {/* RESULTADO FINAL */}
          {paso === 'resultado' && (() => {
            const nivel = getNivel();
            return (
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {total >= 180 ? '🏆' : total >= 100 ? '🥈' : '🥉'}
                </div>
                <h2 className="text-3xl font-extrabold text-gray-800 mb-2">¡Reto Completado!</h2>
                <p className="text-gray-500 mb-6">
                  Has completado las 2 actividades del rol <strong>QA / Defensa Central</strong>
                </p>

                {/* Score breakdown */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: 'Bloqueo de Ángulo', score: scoreA1, icon: '🛡️' },
                    { label: 'Despeje de Seguridad', score: scoreA2, icon: '🧹' },
                    { label: 'Total', score: total, icon: '🏆', bold: true },
                  ].map(item => (
                    <div key={item.label} className={`rounded-xl border p-4 ${item.bold ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className={`text-2xl font-black ${item.bold ? 'text-yellow-600' : item.score === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                        {item.score} pts
                      </div>
                      <div className="text-xs text-gray-500">{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Nivel */}
                <div className={`inline-block rounded-xl border-2 px-6 py-3 mb-8 ${nivel.bg}`}>
                  <span className={`text-lg font-extrabold ${nivel.color}`}>{nivel.label}</span>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-sm text-gray-600 text-left">
                  <strong>💡 Reflexión:</strong> El QA no es solo encontrar bugs; es proteger al equipo de consecuencias
                  costosas tomando las decisiones correctas bajo presión, igual que un defensa central que mantiene la portería a cero.
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
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md text-center"
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
