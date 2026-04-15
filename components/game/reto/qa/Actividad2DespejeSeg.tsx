'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Direccion = {
  id: 'banda' | 'centro' | 'atras';
  label: string;
  emoji: string;
  descripcion: string;
  score: 100 | 50 | 0;
  resultado: 'correcto' | 'regular' | 'incorrecto';
  feedback: string;
  ballTarget: { x: number; y: number };
  angle: number; // grados para la flecha
};

const VB_W = 100;
const VB_H = 56.25;

const BALL_POS = { x: 22, y: VB_H * 0.5 };

const DIRECCIONES: Direccion[] = [
  {
    id: 'banda',
    label: 'Banda (Lateral)',
    emoji: '↖️',
    descripcion: 'Botas el balón fuera del área por la banda',
    score: 100,
    resultado: 'correcto',
    feedback: '¡Balón fuera! Como Defensa (QA), sabes cuándo un error es tan grave que debe detener el proceso para limpiar el sistema. Priorizaste la seguridad del arco sobre el juego bonito.',
    ballTarget: { x: 10, y: VB_H * 0.12 },
    angle: -130,
  },
  {
    id: 'centro',
    label: 'Centro (Medio Campo)',
    emoji: '↑',
    descripcion: 'Despejas hacia medio campo, zona dividida',
    score: 50,
    resultado: 'regular',
    feedback: 'Juego dividido. Como Defensa (QA), reportaste el error pero lo dejaste en manos de otros sin asegurar que se eliminara el riesgo. El peligro sigue latente.',
    ballTarget: { x: 50, y: VB_H * 0.5 },
    angle: 0,
  },
  {
    id: 'atras',
    label: 'Atrás (Portero)',
    emoji: '↙️',
    descripcion: 'Le devuelves el balón al portero bajo presión',
    score: 0,
    resultado: 'incorrecto',
    feedback: '¡Error fatal! Como Defensa (QA), intentar una solución rápida sin pensar en las consecuencias puede romper otras partes del sistema. Regalaste un gol por no ser precavido.',
    ballTarget: { x: 6, y: VB_H * 0.85 },
    angle: 140,
  },
];

interface Props {
  onComplete: (score: number) => void;
}

export const Actividad2DespejeSeg: React.FC<Props> = ({ onComplete }) => {
  const [fase, setFase] = useState<'elige' | 'animar' | 'modal'>('elige');
  const [elegida, setElegida] = useState<Direccion | null>(null);
  const [ballPos, setBallPos] = useState(BALL_POS);
  const [golazo, setGolazo] = useState(false);

  const handleElegir = (dir: Direccion) => {
    if (fase !== 'elige') return;
    setElegida(dir);
    setFase('animar');

    // Persistir UserAnswer en localStorage
    if (typeof window !== 'undefined') {
      const pre = localStorage.getItem('currentPlayer') || 'guest';
      const answers = JSON.parse(localStorage.getItem(`${pre}_qa_answers`) || '{}');
      answers['actividad2'] = { opcion: dir.id, label: dir.label, score: dir.score, resultado: dir.resultado };
      localStorage.setItem(`${pre}_qa_answers`, JSON.stringify(answers));
    }

    setTimeout(() => {
      setBallPos(dir.ballTarget);
      if (dir.resultado === 'incorrecto') setGolazo(true);
    }, 300);

    setTimeout(() => setFase('modal'), 2000);
  };

  const resultadoColor = {
    correcto: 'border-green-500',
    regular: 'border-yellow-500',
    incorrecto: 'border-red-500',
  };
  const resultadoBg = {
    correcto: 'bg-green-50',
    regular: 'bg-yellow-50',
    incorrecto: 'bg-red-50',
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-5">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
          Actividad 2 de 2
        </span>
        <h2 className="text-2xl font-extrabold text-gray-800">🧹 El Despeje de Seguridad</h2>
        <p className="text-gray-500 text-sm mt-1">El balón quedó en el punto penal. Llegas primero, pero el rival viene encima. ¿A dónde lo envías?</p>
      </div>

      {/* Campo SVG */}
      <div
        className="relative w-full rounded-xl overflow-hidden border-4 border-green-900 shadow-inner"
        style={{ background: '#2E7D32', paddingBottom: '56.25%' }}
      >
        <svg
          viewBox="0 10 64 36"
          className="absolute inset-0 w-full h-full"
        >
          <rect width={VB_W} height={VB_H} fill="#2E7D32" />
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i} x={i * 20} y={0} width={10} height={VB_H} fill="#297528" opacity="0.35" />
          ))}

          {/* Líneas del campo */}
          <rect x="0" y={VB_H * 0.22} width={VB_W * 0.18} height={VB_H * 0.56} fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
          <rect x="0" y={VB_H * 0.36} width={VB_W * 0.08} height={VB_H * 0.28} fill="none" stroke="white" strokeWidth="0.4" opacity="0.5" />
          <rect x="0" y={VB_H * 0.38} width="2" height={VB_H * 0.24} fill="#888" stroke="white" strokeWidth="0.6" rx="0.3" />

          {/* Punto penal */}
          <circle cx={BALL_POS.x} cy={BALL_POS.y} r="0.8" fill="white" opacity="0.7" />

          {/* Rival encima (rojo, próximo al balón) */}
          <motion.g
            animate={fase === 'animar' && elegida?.id === 'atras'
              ? { x: -10, y: 8 }
              : { x: 0, y: 0 }
            }
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <circle cx={BALL_POS.x + 6} cy={BALL_POS.y - 5} r="2.5" fill="#c0392b" stroke="white" strokeWidth="0.5" />
            <text x={BALL_POS.x + 6} y={BALL_POS.y - 4.1} textAnchor="middle" fontSize="2.2" fill="white" fontWeight="bold">R</text>
          </motion.g>

          {/* Defensa QA (azul) con aura — jugador activo */}
          {fase === 'elige' && (
            <circle cx={BALL_POS.x - 3} cy={BALL_POS.y} r="6" fill="#3b82f6" opacity="0.2">
              <animate attributeName="r" values="5;7.5;5" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.06;0.2" dur="1.2s" repeatCount="indefinite" />
            </circle>
          )}
          <circle cx={BALL_POS.x - 3} cy={BALL_POS.y} r="2.8" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="1" />
          <text x={BALL_POS.x - 3} y={BALL_POS.y + 1.0} textAnchor="middle" fontSize="2.3" fill="white" fontWeight="bold">QA</text>

          {/* Portero (esquina inferior izquierda) */}
          <circle cx={6} cy={VB_H * 0.5} r="2.5" fill="#1d4ed8" stroke="white" strokeWidth="0.5" opacity="0.85" />
          <text x={6} y={VB_H * 0.5 + 0.9} textAnchor="middle" fontSize="1.9" fill="white">PO</text>

          {/* Flechas de dirección (solo en fase elige) */}
          {fase === 'elige' && DIRECCIONES.map(dir => {
            const angle = dir.angle * (Math.PI / 180);
            const len = 14;
            const x2 = BALL_POS.x + Math.cos(angle) * len;
            const y2 = BALL_POS.y + Math.sin(angle) * len;
            const colors = { correcto: '#22c55e', regular: '#eab308', incorrecto: '#ef4444' };
            return (
              <g
                key={dir.id}
                onClick={() => handleElegir(dir)}
                style={{ cursor: 'pointer' }}
              >
                <line
                  x1={BALL_POS.x} y1={BALL_POS.y}
                  x2={x2} y2={y2}
                  stroke={colors[dir.resultado]}
                  strokeWidth="0.8"
                  markerEnd={`url(#arrow-${dir.id})`}
                  opacity="0.85"
                />
                {/* Zona clicable transparente alrededor de la flecha */}
                <circle cx={x2} cy={y2} r="3" fill={colors[dir.resultado]} opacity="0.25" />
                <text x={x2} y={y2 + 0.8} textAnchor="middle" fontSize="2.4">{dir.emoji}</text>
                <text x={x2} y={y2 + 3.5} textAnchor="middle" fontSize="1.6" fill="white" fontWeight="bold">{dir.label}</text>
              </g>
            );
          })}

          {/* Definición flechas SVG */}
          <defs>
            {DIRECCIONES.map(dir => {
              const colors = { correcto: '#22c55e', regular: '#eab308', incorrecto: '#ef4444' };
              return (
                <marker key={dir.id} id={`arrow-${dir.id}`} viewBox="0 0 10 10" refX="10" refY="5"
                  markerWidth="2.5" markerHeight="2.5" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={colors[dir.resultado]} />
                </marker>
              );
            })}
          </defs>

          {/* Balón animado */}
          <motion.g
            animate={{ x: ballPos.x - BALL_POS.x, y: ballPos.y - BALL_POS.y }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <text
              x={BALL_POS.x}
              y={BALL_POS.y}
              textAnchor="middle"
              fontSize="4"
            >
              ⚽
            </text>
          </motion.g>

          {/* GOL si intercepta el rival */}
          <AnimatePresence>
            {golazo && (
              <motion.g
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <text x={VB_W / 2} y={VB_H / 2} textAnchor="middle" fontSize="9"
                  fill="#ef4444" fontWeight="bold" opacity="0.95">¡GOL!</text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Botones alternativos */}
      {fase === 'elige' && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {DIRECCIONES.map(d => (
            <button
              key={d.id}
              onClick={() => handleElegir(d)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 border-dashed p-3 text-sm font-bold transition-all hover:scale-105 active:scale-95
                ${d.resultado === 'correcto' ? 'border-gray-300 hover:bg-gray-50 text-gray-800'
                  : d.resultado === 'regular' ? 'border-gray-300 hover:bg-gray-50 text-gray-800'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-800'}`}
            >
              <span className="text-2xl">{d.emoji}</span>
              <span>{d.label}</span>
              <span className="text-xs text-gray-500 font-normal">{d.descripcion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Modal de resultado */}
      <AnimatePresence>
        {fase === 'modal' && elegida && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className={`bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-t-8 ${resultadoColor[elegida.resultado]}`}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="text-5xl mb-3">
                {elegida.resultado === 'correcto' ? '🧹' : elegida.resultado === 'regular' ? '⚠️' : '😱'}
              </div>
              <h3 className="text-xl font-extrabold text-gray-800 mb-2">{elegida.label}</h3>
              <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                🔗 Relación con el Rol
              </div>
              <p className={`text-sm leading-relaxed mb-4
                ${elegida.resultado === 'correcto' ? 'text-green-700'
                  : elegida.resultado === 'regular' ? 'text-yellow-700' : 'text-red-700'}`}>
                {elegida.feedback}
              </p>
              <div className={`inline-block rounded-xl border py-3 px-6 mb-6 ${resultadoBg[elegida.resultado]}`}>
                <span className={`font-black text-2xl
                  ${elegida.resultado === 'correcto' ? 'text-green-600'
                    : elegida.resultado === 'regular' ? 'text-yellow-600' : 'text-red-500'}`}>
                  {elegida.score > 0 ? `+${elegida.score} pts` : '0 pts — ¡GOL EN CONTRA!'}
                </span>
              </div>
              <br />
              <button
                onClick={() => onComplete(elegida.score)}
                className="bg-gray-800 hover:bg-gray-900 active:scale-95 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md"
              >
                Continuar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
