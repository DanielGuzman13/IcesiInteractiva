'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Destino = {
  id: 'ganador' | 'lento' | 'error';
  label: string;
  emoji: string;
  descripcion: string;
  feedback: string;
  score: 100 | 50 | 0;
  resultado: 'correcto' | 'regular' | 'incorrecto';
  cx: number;
  cy: number;
};

const VB_W = 100;
const VB_H = 56.25;

// Lateral DevOps empieza en la banda derecha y avanza
const LATERAL_START = { x: 72, y: 90 };
const LATERAL_RUN = { x: 85, y: 72 };
const BALL_START = { x: 72, y: 90 };

const DESTINOS: Destino[] = [
  {
    id: 'ganador',
    label: 'Punto Ganador',
    emoji: '🎯',
    descripcion: 'Centro perfecto al segundo palo',
    feedback: '¡Jugada impecable! Tu sistema de pases funcionó a la perfección y el balón llegó a su destino por la vía rápida.',
    score: 100,
    resultado: 'correcto',
    cx: 92,
    cy: VB_H * 0.4,
  },
  {
    id: 'lento',
    label: 'Punto Lento',
    emoji: '🐢',
    descripcion: 'Centro al primer palo, difícil de rematar',
    feedback: 'Funcionó, pero fue lento. Como Lateral (DevOps), hiciste un despliegue manual sin automatización. El equipo llegó al objetivo pero con más esfuerzo.',
    score: 50,
    resultado: 'regular',
    cx: 88,
    cy: VB_H * 0.65,
  },
  {
    id: 'error',
    label: 'Centro Fallido',
    emoji: '❌',
    descripcion: 'Balón se va fuera del área',
    feedback: '¡Despliegue fallido! Como Lateral (DevOps), no confiaste en tus herramientas de automatización, el código llegó roto al servidor. La pipeline es tu mejor aliado.',
    score: 0,
    resultado: 'incorrecto',
    cx: 82,
    cy: VB_H * 0.15,
  },
];

interface Props {
  onComplete: (score: number) => void;
}

export const Actividad1CentroPrecision: React.FC<Props> = ({ onComplete }) => {
  const [fase, setFase] = useState<'elige' | 'animando' | 'modal'>('elige');
  const [elegido, setElegido] = useState<Destino | null>(null);
  const [lateralPos, setLateralPos] = useState(LATERAL_START);
  const [ballPos, setBallPos] = useState(BALL_START);
  const [lateralAnimate, setLateralAnimate] = useState(false);

  const handleElegir = (dest: Destino) => {
    if (fase !== 'elige') return;
    setElegido(dest);
    setFase('animando');

    // Persistir UserAnswer
    if (typeof window !== 'undefined') {
      const pre = localStorage.getItem('currentPlayer') || 'guest';
      const answers = JSON.parse(localStorage.getItem(`${pre}_devops_answers`) || '{}');
      answers['actividad1'] = { opcion: dest.id, label: dest.label, score: dest.score, resultado: dest.resultado };
      localStorage.setItem(`${pre}_devops_answers`, JSON.stringify(answers));
    }

    // 1. Lateral sube por la banda
    setLateralAnimate(true);
    setTimeout(() => setLateralPos(LATERAL_RUN), 0);

    // 2. Balón se centra al destino
    setTimeout(() => setBallPos({ x: dest.cx, y: dest.cy }), 900);

    // 3. Modal
    setTimeout(() => setFase('modal'), 2200);
  };

  const colorBorde = { correcto: 'border-green-500', regular: 'border-yellow-500', incorrecto: 'border-red-500' };
  const colorBg = { correcto: 'bg-green-50', regular: 'bg-yellow-50', incorrecto: 'bg-red-50' };

  return (
    <div className="w-full">
      <div className="text-center mb-5">
        <span className="inline-block bg-cyan-100 text-cyan-800 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
          Actividad 1 de 2
        </span>
        <h2 className="text-2xl font-extrabold text-gray-800">🏃 El Centro de Precisión</h2>
        <p className="text-gray-500 text-sm mt-1">El lateral corre por la banda. ¿A qué punto envías el centro?</p>
      </div>

      {/* Campo SVG 16:9 */}
      <div className="relative w-full rounded-xl overflow-hidden border-4 border-green-900 shadow-inner"
        style={{ background: '#2E7D32', paddingBottom: '56.25%' }}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 w-full h-full">
          <rect width={VB_W} height={VB_H} fill="#2E7D32" />
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i} x={i * 20} y={0} width={10} height={VB_H} fill="#297528" opacity="0.35" />
          ))}

          {/* Línea de fondo derecha y área */}
          <rect x={VB_W * 0.82} y={VB_H * 0.22} width={VB_W * 0.18} height={VB_H * 0.56} fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
          <rect x={VB_W * 0.9} y={VB_H * 0.36} width={VB_W * 0.1} height={VB_H * 0.28} fill="none" stroke="white" strokeWidth="0.4" opacity="0.5" />
          <rect x={VB_W * 0.97} y={VB_H * 0.38} width="3" height={VB_H * 0.24} fill="#888" stroke="white" strokeWidth="0.6" rx="0.3" />

          {/* Banda derecha */}
          <line x1={VB_W} y1={0} x2={VB_W} y2={VB_H} stroke="white" strokeWidth="0.5" opacity="0.4" />

          {/* Puntos de destino (solo en fase elige) */}
          {fase === 'elige' && DESTINOS.map(d => {
            const cols = { correcto: '#22c55e', regular: '#eab308', incorrecto: '#ef4444' };
            return (
              <g key={d.id} onClick={() => handleElegir(d)} style={{ cursor: 'pointer' }}>
                <circle cx={d.cx} cy={d.cy} r="5" fill={cols[d.resultado]} opacity="0.3">
                  <animate attributeName="r" values="4;6;4" dur="1.3s" repeatCount="indefinite" />
                </circle>
                <circle cx={d.cx} cy={d.cy} r="2.5" fill={cols[d.resultado]} stroke="white" strokeWidth="0.6" />
                <text x={d.cx} y={d.cy + 6.5} textAnchor="middle" fontSize="2.2" fill="white" fontWeight="bold">{d.label}</text>
              </g>
            );
          })}

          {/* Compañeros en el área */}
          {[{ cx: 90, cy: VB_H * 0.5 }, { cx: 88, cy: VB_H * 0.32 }].map((p, i) => (
            <g key={i}>
              <circle cx={p.cx} cy={p.cy} r="2.5" fill="#1d4ed8" stroke="white" strokeWidth="0.5" opacity="0.7" />
              <text x={p.cx} y={p.cy + 1} textAnchor="middle" fontSize="2" fill="white">A</text>
            </g>
          ))}

          {/* Defensa rival */}
          <circle cx={89} cy={VB_H * 0.6} r="2.5" fill="#c0392b" stroke="white" strokeWidth="0.5" opacity="0.7" />
          <text x={89} y={VB_H * 0.6 + 1} textAnchor="middle" fontSize="2" fill="white">R</text>

          {/* Trayectoria del centro */}
          {elegido && (
            <motion.line
              x1={LATERAL_RUN.x} y1={LATERAL_RUN.y}
              x2={elegido.cx} y2={elegido.cy}
              stroke="yellow" strokeWidth="0.5" strokeDasharray="2 1" opacity="0.7"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            />
          )}

          {/* Lateral DevOps — sube por banda con Framer Motion */}
          <motion.g
            animate={lateralAnimate ? { x: LATERAL_RUN.x - LATERAL_START.x, y: LATERAL_RUN.y - LATERAL_START.y } : { x: 0, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Aura cyan pulsante */}
            {fase === 'elige' && (
              <circle cx={LATERAL_START.x} cy={LATERAL_START.y} r="7" fill="#06b6d4" opacity="0.2">
                <animate attributeName="r" values="6;9;6" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.06;0.2" dur="1.2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={LATERAL_START.x} cy={LATERAL_START.y} r="3.5" fill="#0891b2" stroke="#67e8f9" strokeWidth="1" />
            <text x={LATERAL_START.x} y={LATERAL_START.y + 1.2} textAnchor="middle" fontSize="2.6" fill="white" fontWeight="bold">DO</text>
          </motion.g>

          {/* Balón */}
          <motion.text textAnchor="middle" fontSize="4"
            animate={{ x: ballPos.x, y: ballPos.y }}
            transition={{ duration: 0.8, ease: 'easeIn', delay: 0.9 }}>
            ⚽
          </motion.text>
        </svg>
      </div>

      {/* Botones alternativos */}
      {fase === 'elige' && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {DESTINOS.map(d => (
            <button key={d.id} onClick={() => handleElegir(d)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 border-dashed p-3 text-sm font-bold transition-all hover:scale-105 active:scale-95
                ${d.resultado === 'correcto' ? 'border-gray-300 hover:bg-gray-50 text-gray-800'
                  : d.resultado === 'regular' ? 'border-gray-300 hover:bg-gray-50 text-gray-800'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-800'}`}>
              <span className="text-2xl">{d.emoji}</span>
              <span>{d.label}</span>
              <span className="text-xs text-gray-500 font-normal">{d.descripcion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {fase === 'modal' && elegido && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={`bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-t-8 ${colorBorde[elegido.resultado]}`}
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
              <div className="text-5xl mb-3">{elegido.emoji}</div>
              <h3 className="text-xl font-extrabold text-gray-800 mb-2">{elegido.label}</h3>
              <div className="inline-block bg-cyan-100 text-cyan-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                🔗 Relación con el Rol
              </div>
              <p className={`text-sm leading-relaxed mb-4 ${elegido.resultado === 'correcto' ? 'text-green-700' : elegido.resultado === 'regular' ? 'text-yellow-700' : 'text-red-700'}`}>
                {elegido.feedback}
              </p>
              <div className={`inline-block rounded-xl border py-3 px-6 mb-6 ${colorBg[elegido.resultado]}`}>
                <span className={`font-black text-2xl ${elegido.resultado === 'correcto' ? 'text-green-600' : elegido.resultado === 'regular' ? 'text-yellow-600' : 'text-red-500'}`}>
                  {elegido.score > 0 ? `+${elegido.score} pts` : '0 pts — Pipeline roto'}
                </span>
              </div>
              <br />
              <button onClick={() => onComplete(elegido.score)}
                className="bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md">
                Actividad 2 →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
