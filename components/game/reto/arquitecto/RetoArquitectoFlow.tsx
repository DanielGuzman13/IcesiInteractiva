import React, { useState } from 'react';
import Actividad1DiagramaClases from './Actividad1DiagramaClases';
import Actividad2AsignarAtributos from './Actividad2AsignarAtributos';
import { useGamePersistence } from '@/hooks/useGamePersistence';

type Paso = 'intro' | 'actividad1' | 'actividad2' | 'resultado';

interface RetoArquitectoFlowProps {
  onFinish: () => void;
}

export default function RetoArquitectoFlow({ onFinish }: RetoArquitectoFlowProps) {
  const { saveAnswer } = useGamePersistence();
  const [paso, setPaso] = useState<Paso>('intro');
  const [scoreA1, setScoreA1] = useState(0);
  const [scoreA2, setScoreA2] = useState(0);
  const [mensajeEmergente, setMensajeEmergente] = useState<string | null>(null);

  const handleA1Complete = (score: number) => {
    setScoreA1(score);
    setPaso('actividad2');

    // Guardar respuesta en PostgreSQL
    saveAnswer('arquitecto-actividad-1', { score }, score > 0, score);

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

    // Guardar en Storage
    const val = localStorage.getItem('currentPlayer') || 'guest';
    const ans = JSON.parse(localStorage.getItem(`${val}_arquitecto_answers`) || '{}');
    ans['score'] = scoreA1 + score;
    localStorage.setItem(`${val}_arquitecto_answers`, JSON.stringify(ans));

    // Guardar respuesta en PostgreSQL
    saveAnswer('arquitecto-actividad-2', { score }, score > 0, score);

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
    if (totalScore >= 180) return { label: '🥇 Arquitecto Maestro — Diseño Estructural Perfecto', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-300' };
    if (totalScore >= 120) return { label: '🥈 Arquitecto Competente — Estructura Sólida', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-300' };
    return { label: '🥉 Arquitecto Junior — Necesita Mejorar la Visión', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' };
  };

  const total = scoreA1 + scoreA2;
  const progreso = paso === 'intro' ? 0 : paso === 'actividad1' ? 1 : paso === 'actividad2' ? 2 : 3;

  return (
    <div className="w-full max-w-7xl 2xl:max-w-[1400px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col relative my-auto max-h-[90vh]">
      
      {mensajeEmergente && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce font-bold text-sm">
          {mensajeEmergente}
        </div>
      )}

      {/* Header del rol */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-8 py-6 text-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-3xl shadow-inner">
            🏗️
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-purple-200 mb-0.5">Rol del equipo</div>
            <h1 className="text-3xl font-extrabold">Director Técnico</h1>
            <div className="text-purple-200 text-sm font-medium">Arquitecto de Software · Diseño Estructural y Patrones</div>
          </div>
          {paso !== 'intro' && paso !== 'resultado' && (
            <div className="ml-auto text-right">
              <div className="text-xs text-purple-200">Score parcial</div>
              <div className="text-2xl font-black">{scoreA1} pts</div>
              <div className="mt-2 flex gap-1.5 justify-end">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-3 h-3 rounded-full border-2 border-white transition-all ${progreso >= i ? 'bg-purple-300' : 'bg-white/20'}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 overflow-y-auto">
        {/* INTRO */}
        {paso === 'intro' && (
          <div className="text-center py-4">
            <p className="text-gray-600 text-base leading-relaxed max-w-xl mx-auto mb-6">
              El <strong>Arquitecto de Software</strong> es el estratega del equipo: diseña la estructura del sistema,
              define las clases y sus relaciones, y establece los patrones que guiarán todo el desarrollo.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-6 max-w-2xl mx-auto">
              {[
                { icon: '🧭', title: 'Actividad 1 — Diagrama de Clases', desc: 'Organiza las clases principales en el diagrama arquitectónico' },
                { icon: '⚙️', title: 'Actividad 2 — Asignación de Atributos', desc: 'Define los atributos correctos para cada clase' },
              ].map(a => (
                <div key={a.title} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="text-2xl mb-2">{a.icon}</div>
                  <div className="font-bold text-gray-800 text-sm">{a.title}</div>
                  <div className="text-gray-500 text-xs mt-1">{a.desc}</div>
                </div>
              ))}
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-8 text-sm text-purple-800 text-left max-w-2xl mx-auto">
              <strong>🏗️ Puntuación máxima: 200 pts.</strong> Cada actividad vale hasta <strong>100 pts</strong>.
              Las decisiones incorrectas significan <em>arquitectura confusa</em> o <em>sistema desestructurado</em> — 0 pts.
            </div>
            <button onClick={() => setPaso('actividad1')}
              className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold py-4 px-10 rounded-full text-lg transition-all shadow-lg">
              ¡Comenzar reto! 🏗️
            </button>
          </div>
        )}

        {/* ACTIVIDAD 1 */}
        {paso === 'actividad1' && (
          <div className="min-h-[50vh]">
            <Actividad1DiagramaClases onComplete={handleA1Complete} />
          </div>
        )}

        {/* ACTIVIDAD 2 */}
        {paso === 'actividad2' && (
          <div className="min-h-[50vh]">
            <Actividad2AsignarAtributos onComplete={handleA2Complete} />
          </div>
        )}

        {/* RESULTADO FINAL */}
        {paso === 'resultado' && (() => {
          const nivel = getNivel();
          return (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">{total >= 180 ? '🏆' : total >= 120 ? '🥈' : '🥉'}</div>
              <h2 className="text-3xl font-extrabold text-gray-800 mb-2">¡Reto Completado!</h2>
              <p className="text-gray-500 mb-6">Has completado las 2 actividades del rol <strong>Arquitecto de Software</strong></p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
                {[
                  { label: 'Diagrama de Clases', score: scoreA1, icon: '🧭' },
                  { label: 'Asignación de Atributos', score: scoreA2, icon: '⚙️' },
                  { label: 'Total', score: total, icon: '🏆', bold: true },
                ].map(item => (
                  <div key={item.label} className={`rounded-xl border p-4 ${item.bold ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className={`text-3xl font-black ${item.bold ? 'text-purple-600' : item.score === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                      {item.score} pts
                    </div>
                    <div className="text-sm font-medium text-gray-500 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className={`inline-block rounded-xl border-2 px-8 py-4 mb-8 shadow-sm ${nivel.bg}`}>
                <span className={`text-xl font-extrabold ${nivel.color}`}>{nivel.label}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                <button
                  onClick={() => { setPaso('intro'); setScoreA1(0); setScoreA2(0); }}
                  className="border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-8 rounded-full transition-all"
                >
                  Reintentar Arquitectura
                </button>
                <button
                  onClick={onFinish}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-10 rounded-full transition-all shadow-lg text-center flex flex-col items-center leading-tight active:scale-95"
                >
                  <span className="text-lg">Confirmar Estructura &larr;</span>
                  <span className="text-xs font-medium mt-1 opacity-90">(Volver a la cancha)</span>
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
