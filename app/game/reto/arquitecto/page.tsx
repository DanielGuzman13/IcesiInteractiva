'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Actividad1DiagramaClases from '@/components/game/reto/arquitecto/Actividad1DiagramaClases';
import Actividad2AsignarAtributos from '@/components/game/reto/arquitecto/Actividad2AsignarAtributos';

type Paso = 'intro' | 'actividad1' | 'actividad2' | 'resultado';

export default function ArquitectoRetoPage() {
  const [paso, setPaso] = useState<Paso>('intro');
  const [scoreA1, setScoreA1] = useState(0);
  const [scoreA2, setScoreA2] = useState(0);
  const [mensajeEmergente, setMensajeEmergente] = useState<string | null>(null);

  const handleA1Complete = (score: number) => {
    setScoreA1(score);
    setPaso('actividad2');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Mostrar mensaje de transición
    const mensajes = [
      "¡Excelente! Como un técnico que define las posiciones, has identificado las clases del sistema.",
      "¡Bien hecho! Ahora vamos a detallar cada clase con sus atributos específicos.",
      "Perfecto! Has diseñado la estructura básica como un arquitecto diseña los planos."
    ];
    setMensajeEmergente(mensajes[Math.floor(Math.random() * mensajes.length)]);
    setTimeout(() => setMensajeEmergente(null), 4000);
  };

  const handleA2Complete = (score: number) => {
    setScoreA2(score);
    setPaso('resultado');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Mostrar mensaje final
    const mensajes = [
      "¡Increíble! Has completado el diseño arquitectónico del sistema.",
      "¡Perfecto! Como un arquitecto que finaliza su obra, has organizado toda la estructura.",
      "¡Excelente trabajo! Has diseñado un sistema tan bien estructurado como un equipo campeón."
    ];
    setMensajeEmergente(mensajes[Math.floor(Math.random() * mensajes.length)]);
    setTimeout(() => setMensajeEmergente(null), 4000);
  };

  const totalScore = scoreA1 + scoreA2;

  const getNivel = () => {
    if (totalScore >= 180) return { label: 'Arquitecto Maestro - Diseño Estructural Perfecto', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-300' };
    if (totalScore >= 120) return { label: 'Arquitecto Competente - Estructura Sólida', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-300' };
    return { label: 'Arquitecto Junior - Necesita Mejorar la Visión', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' };
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700 flex flex-col items-center py-8 px-4 relative">
      
      {/* Mensaje Emergente */}
      {mensajeEmergente && (
        <div className="fixed top-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm animate-pulse">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{'\ud83c\udfc6'}</span>
            <p className="text-sm font-medium">{mensajeEmergente}</p>
          </div>
        </div>
      )}
      {/* Top bar */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <Link
          href="/game"
          className="text-white/80 hover:text-white text-sm font-semibold flex items-center gap-1 transition-colors"
        >
          &larr; Volver a la cancha
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
                  paso === 'actividad2' && i <= 1 ? (i === 1 ? 'bg-white' : 'bg-purple-400') :
                  paso === 'resultado' ? 'bg-purple-400' :
                  'bg-white/20'
                }`}
              />
            ))}
          </div>
          <span className="text-white/70 text-xs">
            {paso === 'intro' ? '0/2' : paso === 'actividad1' ? '1/2' : paso === 'actividad2' ? '2/2' : '¡'}
          </span>
        </div>
      </div>

      {/* Card principal */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header del rol */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 px-8 py-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 border-3 border-white flex items-center justify-center text-3xl shadow-inner">
              <div className="text-4xl">{'\ud83c\udfd7\ufe0f'}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-purple-200 mb-0.5">Rol estratégico</div>
              <h1 className="text-3xl font-extrabold">Arquitecto de Software</h1>
              <div className="text-purple-200 text-sm font-medium">Diseño Estructural y Patrones Arquitectónicos</div>
            </div>
            {paso !== 'intro' && paso !== 'resultado' && (
              <div className="ml-auto text-right">
                <div className="text-xs text-purple-200">Score acumulado</div>
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
                <p className="text-gray-600 text-base leading-relaxed max-w-2xl mx-auto mb-6">
                  El <strong>Arquitecto de Software</strong> es como el director técnico del equipo: no está en cada jugada, 
                  pero define cómo juega todo el sistema. Diseña la estructura, establece los patrones y asegura que 
                  cada componente tenga su lugar y función correcta.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 text-sm text-purple-800 text-left">
                  <strong>Visión del Arquitecto:</strong> Un buen diseño arquitectónico es como una formación táctica perfecta - 
                  cada jugador (clase) sabe dónde estar, qué hacer y cómo comunicarse con los demás.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {[
                    { icon: '🧭', title: 'Actividad 1 - Diseño Estructural', desc: 'Identifica las clases principales del sistema y colócalas en el diagrama arquitectónico' },
                    { icon: '⚙️', title: 'Actividad 2 - Definición de Atributos', desc: 'Asigna los atributos correctos a cada clase según su responsabilidad en el sistema' },
                  ].map(a => (
                    <div key={a.title} className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="text-2xl mb-2">{a.icon}</div>
                      <div className="font-bold text-gray-800 text-sm">{a.title}</div>
                      <div className="text-gray-500 text-xs mt-1">{a.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setPaso('actividad1')}
                className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold py-4 px-12 rounded-full text-lg transition-all shadow-lg"
              >
                Comenzar Diseño Arquitectónico
              </button>
            </div>
          )}

          {/* ACTIVIDAD 1 */}
          {paso === 'actividad1' && (
            <Actividad1DiagramaClases onComplete={handleA1Complete} />
          )}

          {/* ACTIVIDAD 2 */}
          {paso === 'actividad2' && (
            <Actividad2AsignarAtributos onComplete={handleA2Complete} />
          )}

          {/* RESULTADO FINAL */}
          {paso === 'resultado' && (() => {
            const nivel = getNivel();
            return (
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">
                  {totalScore >= 180 ? '🧭' : totalScore >= 120 ? '✅' : '⚠️'}
                </div>
                <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Diseño Arquitectónico Completado</h2>
                <p className="text-gray-500 mb-6">Has completado el análisis estructural del sistema</p>

                {/* Score breakdown */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: 'Diseño Estructural', score: scoreA1, icon: '🧭' },
                    { label: 'Asignación de Atributos', score: scoreA2, icon: '⚙️' },
                    { label: 'Total', score: totalScore, icon: '🏆', bold: true },
                  ].map(item => (
                    <div key={item.label} className={`rounded-xl border p-4 ${item.bold ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className={`text-2xl font-black ${item.bold ? 'text-purple-600' : 'text-gray-700'}`}>{item.score} pts</div>
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
                    Rediseñar Arquitectura
                  </button>
                  <Link
                    href="/game"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md text-center"
                  >
                    &larr; Volver a la cancha
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
