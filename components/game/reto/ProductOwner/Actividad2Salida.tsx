'use client';

import React, { useState } from 'react';

type Companero = {
  id: string;
  emoji: string;
  label: string;
  descripcion: string;
  equivalencia: string;
  score: number;
  cx: number;
  cy: number;
  color: string;
  dotColor: string;
};

const COMPANEROS: Companero[] = [
  {
    id: 'corto',
    emoji: '🟢1️⃣',
    label: 'Pase Corto',
    descripcion: 'Al compañero más cercano — seguro y controlado.',
    equivalencia: 'mejorar y estabilizar lo que ya funciona. Menos risk, avance gradual y mayor confianza del equipo.',
    score: 10,
    cx: 35,
    cy: 50,
    color: 'border-green-400',
    dotColor: '#22c55e',
  },
  {
    id: 'medio',
    emoji: '🟡',
    label: 'Avance Medio',
    descripcion: 'A un compañero en el medio — equilibrio y progreso.',
    equivalencia: 'crear nuevas herramientas útiles que amplían las capacidades del equipo sin jugarse todo de una.',
    score: 20,
    cx: 50,
    cy: 25,
    color: 'border-yellow-400',
    dotColor: '#eab308',
  },
  {
    id: 'largo',
    emoji: '🔴',
    label: 'Pase Largo',
    descripcion: 'Al compañero más adelantado — ambicioso y directo.',
    equivalencia: 'ir directamente por el objetivo principal del cliente. Alto impacto, pero requiere ejecución precisa.',
    score: 30,
    cx: 65,
    cy: 70,
    color: 'border-red-400',
    dotColor: '#ef4444',
  },
];

// Posición del portero (PO)
const PO = { cx: 8, cy: 50 };

interface Props {
  onComplete: (score: number) => void;
}

export const Actividad2Salida: React.FC<Props> = ({ onComplete }) => {
  const [elegido, setElegido] = useState<Companero | null>(null);
  const [animating, setAnimating] = useState(false);
  const [ballPos, setBallPos] = useState({ x: PO.cx, y: PO.cy });
  const [showModal, setShowModal] = useState(false);

  const handleElegir = (comp: Companero) => {
    if (animating || elegido) return;
    setElegido(comp);
    setAnimating(true);

    if (typeof window !== 'undefined') {
      const pre = localStorage.getItem('currentPlayer') || 'guest';
      const answers = JSON.parse(localStorage.getItem(`${pre}_po_answers`) || '{}');
      answers['actividad2'] = { opcion: comp.id, label: comp.label, score: comp.score };
      localStorage.setItem(`${pre}_po_answers`, JSON.stringify(answers));
    }

    const steps = 25;
    const dx = (comp.cx - PO.cx) / steps;
    const dy = (comp.cy - PO.cy) / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setBallPos(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      if (step >= steps) {
        clearInterval(interval);
        setAnimating(false);
        setShowModal(true);
      }
    }, 35);
  };

  const handleFinalizar = () => {
    setShowModal(false);
    if (elegido) onComplete(elegido.score);
  };

  return (
    <div className="w-full">
      <p className="text-gray-700 text-base font-semibold mb-4 text-center">Tienes el balón. Decide a quién pasarle para iniciar el avance</p>

      {/* Instrucción */}
      {/* <p className="text-center text-sm text-gray-600 mb-4">
        👆 Haz clic en el jugador al que quieras pasarle
      </p> */}

      {/* Campo SVG */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-inner border-4 border-green-800" style={{ background: '#2E7D32' }}>
        <svg viewBox="0 0 100 100" className="w-full" style={{ display: 'block', aspectRatio: '16/9', maxHeight: '340px' }}>
          <rect width="100" height="100" fill="#2E7D32" />

          {/* Línea de medio campo */}
          <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.5" opacity="0.4" />

          {/* Área penal izquierda */}
          <rect x="0" y="22" width="18" height="56" fill="none" stroke="white" strokeWidth="0.6" opacity="0.5" />
          {/* Área chica */}
          <rect x="0" y="36" width="8" height="28" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
          {/* Arco izquierdo */}
          <rect x="0" y="38" width="2" height="24" fill="none" stroke="white" strokeWidth="0.8" />

          {/* Trayectoria del pase */}
          {elegido && (
            <line
              x1={PO.cx} y1={PO.cy}
              x2={elegido.cx} y2={elegido.cy}
              stroke="yellow" strokeWidth="0.5" strokeDasharray="2 1" opacity="0.7"
            />
          )}

          {/* Portero / PO */}
          <circle cx={PO.cx} cy={PO.cy} r="4" fill="#1d4ed8" stroke="white" strokeWidth="0.8" />
          <text x={PO.cx} y={PO.cy + 1.2} textAnchor="middle" fontSize="3" fill="white" fontWeight="bold">PO</text>
          <text x={PO.cx} y={PO.cy + 7} textAnchor="middle" fontSize="2.5" fill="white" opacity="0.8">Portero (Product Owner)</text>

          {/* Compañeros clicables */}
          {COMPANEROS.map(comp => (
            <g
              key={comp.id}
              onClick={() => handleElegir(comp)}
              style={{ cursor: elegido ? 'default' : 'pointer' }}
            >
              {/* Anillo de selección */}
              {!elegido && (
                <circle cx={comp.cx} cy={comp.cy} r="7" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" strokeDasharray="2 1">
                  <animate attributeName="r" values="6;8;6" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={comp.cx} cy={comp.cy} r="4.5"
                fill={comp.dotColor}
                stroke={elegido?.id === comp.id ? 'yellow' : 'white'}
                strokeWidth={elegido?.id === comp.id ? '1.2' : '0.7'}
                opacity={elegido && elegido.id !== comp.id ? 0.4 : 1}
              />
              <text x={comp.cx} y={comp.cy + 1.5} textAnchor="middle" fontSize="3.5" fill="white">
                {comp.id === 'corto' ? '🟢1️⃣' : comp.id === 'medio' ? '🟡' : '🔴'}
              </text>
              <text x={comp.cx} y={comp.cy + 8} textAnchor="middle" fontSize="2.5" fill="white" opacity="0.9">
                {comp.label}
              </text>
            </g>
          ))}

          {/* Balón */}
          <text x={ballPos.x} y={ballPos.y + 1} textAnchor="middle" fontSize="4">⚽</text>
        </svg>
      </div>

      {/* Descripción de opciones */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {COMPANEROS.map(comp => (
          <button
            key={comp.id}
            disabled={!!elegido}
            onClick={() => handleElegir(comp)}
            className={`rounded-xl border-2 p-3 text-center text-xs transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${elegido?.id === comp.id ? `${comp.color} bg-yellow-50 shadow` : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
          >
            <div className="text-2xl mb-1">{comp.emoji}</div>
            <div className="font-bold text-gray-700">{comp.label}</div>
            <div className="text-gray-500 mt-1">{comp.descripcion}</div>
          </button>
        ))}
      </div>

      {/* Modal de feedback */}
      {showModal && elegido && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-t-8 border-blue-500 animate-in fade-in zoom-in duration-300">
            <div className="text-5xl mb-4">{elegido.emoji}</div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-3">
              ¡{elegido.label}!
            </h3>
            <p className="text-gray-600 mb-2 leading-relaxed">
              El <strong>Product Owner </strong> da el &quot;primer pase&quot; de cada función del software.
              Al elegir el <strong>{elegido.label}</strong>, decidiste{' '}
              <strong className="text-blue-700">{elegido.equivalencia}</strong>
            </p>
            <p className="text-xs text-gray-600 mb-4 italic">
              Esta decisión define si el equipo avanza lento y seguro, o rápido y con más riesgo.
            </p>
            {/* Score badge removed - redundant */}
            <br />
            <button
              onClick={handleFinalizar}
              className="bg-gray-800 hover:bg-gray-900 active:scale-95 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
