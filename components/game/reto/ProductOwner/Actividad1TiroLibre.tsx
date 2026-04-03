'use client';

import React, { useState } from 'react';

type Opcion = {
  id: string;
  emoji: string;
  label: string;
  descripcion: string;
  equivalencia: string;
  score: number;
  targetX: number;
  targetY: number;
  color: string;
};

const OPCIONES: Opcion[] = [
  {
    id: 'remate',
    emoji: '⚽',
    label: 'Remate Directo',
    descripcion: 'Vas directo al arco con potencia.',
    equivalencia: 'priorizar la función estrella que captará nuevos usuarios y generará el mayor impacto inmediato en el producto.',
    score: 30,
    targetX: 88,
    targetY: 50,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    id: 'extremo',
    emoji: '↗️',
    label: 'Pase al Extremo',
    descripcion: 'Buscas al extremo para una jugada elaborada.',
    equivalencia: 'priorizar una mejora técnica necesaria para que el equipo pueda avanzar con solidez y sin tropiezos.',
    score: 20,
    targetX: 75,
    targetY: 15,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    id: 'distraccion',
    emoji: '🎭',
    label: 'Jugada de Distracción',
    descripcion: 'Sorprendes con una táctica inesperada.',
    equivalencia: 'apostar por innovación y experimentación. Puede abrirte nuevos caminos, aunque con mayor risk.',
    score: 10,
    targetX: 65,
    targetY: 80,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
];

interface Props {
  onComplete: (score: number) => void;
}

export const Actividad1TiroLibre: React.FC<Props> = ({ onComplete }) => {
  const [elegida, setElegida] = useState<Opcion | null>(null);
  const [animating, setAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Posición inicial del balón (porcentajes sobre el SVG viewBox 0 0 100 100)
  const ballStartX = 30;
  const ballStartY = 50;

  const [ballPos, setBallPos] = useState({ x: ballStartX, y: ballStartY });

  const handleElegir = (opcion: Opcion) => {
    if (animating || elegida) return;
    setElegida(opcion);
    setAnimating(true);

    // Animar el balón en pasos
    const steps = 20;
    const dx = (opcion.targetX - ballStartX) / steps;
    const dy = (opcion.targetY - ballStartY) / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setBallPos(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      if (step >= steps) {
        clearInterval(interval);
        setAnimating(false);
        setShowModal(true);
      }
    }, 40);
  };

  const handleContinuar = () => {
    setShowModal(false);
    if (elegida) onComplete(elegida.score);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
          Actividad 1 de 2
        </span>
        <h2 className="text-2xl font-extrabold text-gray-800">⚽ El Capitán del Tiro Libre</h2>
        <p className="text-gray-500 mt-1 text-sm">Elige la jugada que genera más valor en este momento crítico</p>
      </div>

      {/* Campo SVG */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-inner border-4 border-green-900" style={{ background: '#2E7D32' }}>
        <svg viewBox="0 0 100 100" className="w-full" style={{ display: 'block', aspectRatio: '16/9', maxHeight: '340px' }}>
          {/* Campo */}
          <rect width="100" height="100" fill="#2E7D32" />

          {/* Línea de fondo derecha */}
          <line x1="95" y1="0" x2="95" y2="100" stroke="white" strokeWidth="0.5" opacity="0.5" />

          {/* Área penal derecha */}
          <rect x="82" y="22" width="18" height="56" fill="none" stroke="white" strokeWidth="0.6" opacity="0.6" />
          {/* Área chica derecha */}
          <rect x="90" y="36" width="10" height="28" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />

          {/* Arco derecho */}
          <rect x="97" y="38" width="3" height="24" fill="none" stroke="white" strokeWidth="1" rx="0.5" />

          {/* Barrera (rivales) */}
          {[42, 47, 52, 57].map((y, i) => (
            <g key={i}>
              <circle cx="55" cy={y} r="3.5" fill="#c0392b" stroke="white" strokeWidth="0.5" />
              <text x="55" y={y + 1} textAnchor="middle" fontSize="2.5" fill="white" fontWeight="bold">R</text>
            </g>
          ))}

          {/* Posición del balón */}
          <circle
            cx={ballPos.x}
            cy={ballPos.y}
            r="3"
            fill="white"
            stroke="#333"
            strokeWidth="0.5"
            style={{ transition: animating ? 'none' : 'all 0.1s' }}
          />
          {/* Hexágonos del balón */}
          <text x={ballPos.x} y={ballPos.y + 1} textAnchor="middle" fontSize="3" fill="#333">⚽</text>

          {/* Líneas de trayectoria (cuando se eligió) */}
          {elegida && (
            <line
              x1={ballStartX} y1={ballStartY}
              x2={elegida.targetX} y2={elegida.targetY}
              stroke="yellow" strokeWidth="0.4" strokeDasharray="2 1" opacity="0.6"
            />
          )}
        </svg>

        {/* Botones de opciones — sobre el campo, en la zona del balón */}
        {!elegida && (
          <div className="absolute inset-0 flex items-center justify-start pl-[5%] pb-4">
            <div className="flex flex-col gap-2">
              {OPCIONES.map(op => (
                <button
                  key={op.id}
                  onClick={() => handleElegir(op)}
                  className={`${op.color} text-white font-bold rounded-xl px-4 py-2 shadow-lg text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95`}
                >
                  <span className="text-lg">{op.emoji}</span>
                  <span>{op.label}</span>
                  {/* <span className="ml-auto bg-white/20 rounded px-1.5 py-0.5 text-xs">+{op.score}pts</span> */}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Descripción de opciones */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {OPCIONES.map(op => (
          <div
            key={op.id}
            className={`rounded-xl border p-3 text-center text-xs transition-all ${elegida?.id === op.id ? 'border-yellow-400 bg-yellow-50 shadow' : 'border-gray-200 bg-gray-50'}`}
          >
            <div className="text-2xl mb-1">{op.emoji}</div>
            <div className="font-bold text-gray-700">{op.label}</div>
            <div className="text-gray-500 mt-1">{op.descripcion}</div>
          </div>
        ))}
      </div>

      {/* Modal de feedback */}
      {showModal && elegida && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-t-8 border-green-500 animate-in fade-in zoom-in duration-300">
            <div className="text-5xl mb-4">{elegida.emoji}</div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-3">
              ¡Elegiste: {elegida.label}!
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Como <strong>Product Owner</strong>, elegiste <em>{elegida.label}</em>.{' '}
              En el software, esto equivale a{' '}
              <strong className="text-green-700">{elegida.equivalencia}</strong>
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl py-3 px-5 mb-6 inline-block">
              <span className="text-green-600 font-black text-2xl">+{elegida.score} pts</span>
            </div>
            <br />
            <button
              onClick={handleContinuar}
              className="bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md"
            >
              Continuar a Actividad 2 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
