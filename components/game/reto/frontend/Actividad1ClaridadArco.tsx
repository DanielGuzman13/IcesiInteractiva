'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Pasillo = {
  id: 'iluminado' | 'estrecho' | 'bloqueado';
  label: string;
  emoji: string;
  descripcion: string;
  score: 100 | 50 | 0;
  resultado: 'correcto' | 'regular' | 'incorrecto';
  feedback: string;
  ballTarget: { x: number; y: number };
  colorClass: string;
  colorHex: string;
};

const VB_W = 100;
const VB_H = 56.25;

const BALL_POS = { x: 50, y: VB_H * 0.5 };

const PASILLOS: Pasillo[] = [
  {
    id: 'iluminado',
    label: 'Pasillo Vacio',
    emoji: '',
    descripcion: 'Camino despejado, remate limpio',
    score: 100,
    resultado: 'correcto',
    feedback: '¡Qué claridad! Elegiste el camino que todos podían ver y el balón entró limpio. (En el equipo, esto es usar una buena Jerarquía Visual; pusiste lo más importante donde el ojo del usuario lo ve primero)',
    ballTarget: { x: 97, y: VB_H * 0.5 },
    colorClass: 'border-cyan-400 text-cyan-800 bg-cyan-50/40 hover:bg-cyan-100/80',
    colorHex: '#0891b2'
  },
  {
    id: 'estrecho',
    label: 'Pasillo Estrecho',
    emoji: '',
    descripcion: 'Pocos espacios, remate apretado',
    score: 50,
    resultado: 'regular',
    feedback: '¡Uff, pasó raspando! El balón pegó en el palo y entró de milagro. (Tu interfaz está un poco Saturada; el usuario encontró el botón, pero le costó trabajo distinguirlo entre tantos elementos)',
    ballTarget: { x: 97, y: VB_H * 0.35 },
    colorClass: 'border-fuchsia-400 text-fuchsia-800 bg-fuchsia-50/40 hover:bg-fuchsia-100/80',
    colorHex: '#c026d3'
  },
  {
    id: 'bloqueado',
    label: 'Pasillo Bloqueado',
    emoji: '',
    descripcion: 'Camino con muchos rivales',
    score: 0,
    resultado: 'incorrecto',
    feedback: '¡Bloqueado! Le pegaste directo al defensa que tenías enfrente. (El Diseño es Confuso; pusiste tantas cosas en la pantalla que el usuario no supo a qué darle clic y se perdió)',
    ballTarget: { x: 82, y: VB_H * 0.75 },
    colorClass: 'border-orange-400 text-orange-800 bg-orange-50/40 hover:bg-orange-100/80',
    colorHex: '#d97706'
  },
];

interface Props {
  onComplete: (score: number) => void;
}

export const Actividad1ClaridadArco: React.FC<Props> = ({ onComplete }) => {
  const [fase, setFase] = useState<'elige' | 'animar' | 'modal'>('elige');
  const [elegido, setElegido] = useState<Pasillo | null>(null);
  const [ballPos, setBallPos] = useState(BALL_POS);
  const [bloqueoAnim, setBloqueoAnim] = useState(false);

  const handleElegir = (pasillo: Pasillo) => {
    if (fase !== 'elige') return;
    setElegido(pasillo);
    setFase('animar');

    if (typeof window !== 'undefined') {
      const pre = localStorage.getItem('currentPlayer') || 'guest';
      const answers = JSON.parse(localStorage.getItem(`${pre}_frontend_answers`) || '{}');
      answers['actividad1'] = { opcion: pasillo.id, label: pasillo.label, score: pasillo.score, resultado: pasillo.resultado };
      localStorage.setItem(`${pre}_frontend_answers`, JSON.stringify(answers));
    }

    setTimeout(() => {
      setBallPos(pasillo.ballTarget);
      if (pasillo.resultado === 'incorrecto') {
        setTimeout(() => setBloqueoAnim(true), 400);
      }
    }, 400);

    setTimeout(() => setFase('modal'), 2000);
  };

  const resultadoColor = { correcto: 'border-green-500', regular: 'border-yellow-500', incorrecto: 'border-red-500' };
  const resultadoBg = { correcto: 'bg-green-50', regular: 'bg-yellow-50', incorrecto: 'bg-red-50' };

  return (
    <div className="w-full">
      <div className="text-center mb-5">
        <span className="inline-block bg-pink-100 text-pink-800 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
          Actividad 1 de 2
        </span>
        <h2 className="text-2xl font-extrabold text-gray-800">🎯 La Claridad del Arco</h2>
        <p className="text-gray-500 text-sm mt-1">Estás al borde del área. Hay 3 pasillos hacia el arco. ¿Cuál eliges para rematar?</p>
      </div>

      <div className="relative w-full rounded-xl overflow-hidden border-4 border-green-900 shadow-inner" style={{ background: '#2E7D32', paddingBottom: '56.25%' }}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 w-full h-full">
          <rect width={VB_W} height={VB_H} fill="#2E7D32" />
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i} x={i * 20} y={0} width={10} height={VB_H} fill="#297528" opacity="0.35" />
          ))}

          {/* Área rival y portería (Ampliada) */}
          <rect x={VB_W * 0.82} y={VB_H * 0.15} width={VB_W * 0.18} height={VB_H * 0.7} fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
          <rect x={VB_W * 0.9} y={VB_H * 0.28} width={VB_W * 0.1} height={VB_H * 0.44} fill="none" stroke="white" strokeWidth="0.4" opacity="0.5" />
          <rect x={VB_W * 0.97} y={VB_H * 0.3} width="3" height={VB_H * 0.4} fill="#888" stroke="white" strokeWidth="0.6" rx="0.3" />

          {/* Delantero Frontend (Azul) */}
          {fase === 'elige' && (
            <circle cx={BALL_POS.x - 3} cy={BALL_POS.y} r="7" fill="#3b82f6" opacity="0.2">
              <animate attributeName="r" values="6;9;6" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.06;0.2" dur="1.2s" repeatCount="indefinite" />
            </circle>
          )}
          <circle cx={BALL_POS.x - 3} cy={BALL_POS.y} r="3.5" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="1" />
          <text x={BALL_POS.x - 3} y={BALL_POS.y + 1.2} textAnchor="middle" fontSize="2.8" fill="white" fontWeight="bold">FE</text>

          {/* Defensas / Rivales (Rojos con R) */}
          {[
            { cx: 83, cy: VB_H * 0.75 },
            { cx: 83, cy: VB_H * 0.82 },
            { cx: 85, cy: VB_H * 0.25 },
            { cx: 86, cy: VB_H * 0.45 }
          ].map((p, i) => (
            <g key={i}>
              <circle cx={p.cx} cy={p.cy} r="2.5" fill="#c0392b" stroke="white" strokeWidth="0.5" />
              <text x={p.cx} y={p.cy + 1} textAnchor="middle" fontSize="2.2" fill="white" fontWeight="bold">R</text>
            </g>
          ))}

          {/* Carriles de remate (Pasillos visuales) */}
          {fase === 'elige' && PASILLOS.map(p => {
            return (
              <g key={p.id} onClick={() => handleElegir(p)} style={{ cursor: 'pointer' }} className="group">
                {/* Línea de trayectoria sutil con su respectivo color */}
                <line
                  x1={BALL_POS.x} y1={BALL_POS.y}
                  x2={p.ballTarget.x} y2={p.ballTarget.y}
                  stroke={p.colorHex} strokeWidth="4" strokeLinecap="round" opacity="0.1"
                  className="group-hover:opacity-40 transition-opacity"
                />
                <line
                  x1={BALL_POS.x} y1={BALL_POS.y}
                  x2={p.ballTarget.x} y2={p.ballTarget.y}
                  stroke={p.colorHex} strokeWidth="1" strokeDasharray="3 2" opacity="0.4"
                  className="group-hover:opacity-100 transition-opacity"
                />
                {/* Zona de impacto final */}
                <circle
                  cx={p.ballTarget.x} cy={p.ballTarget.y} r="3.5"
                  fill={p.colorHex} opacity="0.15" className="group-hover:opacity-60 transition-opacity"
                />
              </g>
            );
          })}

          <motion.text textAnchor="middle" fontSize="4"
            animate={{ x: ballPos.x, y: ballPos.y }}
            transition={{ duration: 0.8, ease: 'easeOut' }}>
            ⚽
          </motion.text>

          <AnimatePresence>
            {bloqueoAnim && (
              <motion.text x={83} y={VB_H * 0.75} textAnchor="middle" fontSize="6"
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1.5 }} exit={{ opacity: 0 }}>
                💥
              </motion.text>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {fase === 'animar' && elegido?.resultado === 'correcto' && (
              <motion.text x={VB_W * 0.93} y={VB_H / 2} textAnchor="middle" fontSize="8" fill="#22c55e" fontWeight="bold"
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}>
                ¡GOL!
              </motion.text>
            )}
          </AnimatePresence>

        </svg>
      </div>

      {fase === 'elige' && (
        <div className="grid grid-cols-3 gap-3 mt-4 p-4">
          {PASILLOS.map(p => (
            <button key={p.id} onClick={() => handleElegir(p)}
              className={`flex flex-col items-center gap-1 rounded-2xl border-b-4 border-2 p-2.5 text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-xl backdrop-blur-sm ${p.colorClass}`}>
              <div className="w-8 h-8 rounded-full mb-1 flex items-center justify-center text-white font-black" style={{ backgroundColor: p.colorHex }}>
                ⚽
              </div>
              <span className="text-gray-800 text-[13px] leading-tight">{p.label}</span>
              <span className="text-[11px] font-normal opacity-80 leading-tight text-center h-8 flex items-center">{p.descripcion}</span>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {fase === 'modal' && elegido && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={`bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-t-8 ${resultadoColor[elegido.resultado]}`}
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
              <div className="text-5xl mb-3">{elegido.resultado === 'correcto' ? '🥅' : elegido.resultado === 'regular' ? '😨' : '🧱'}</div>
              <h3 className="text-xl font-extrabold text-gray-800 mb-2">{elegido.label}</h3>
              <div className="inline-block bg-pink-100 text-pink-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                🔗 Relación con el Rol (UI)
              </div>
              <p className={`text-sm leading-relaxed mb-4 ${elegido.resultado === 'correcto' ? 'text-green-700' : elegido.resultado === 'regular' ? 'text-yellow-700' : 'text-red-700'}`}>
                {elegido.feedback}
              </p>
              <div className={`inline-block rounded-xl border py-3 px-6 mb-6 ${resultadoBg[elegido.resultado]}`}>
                <span className={`font-black text-2xl ${elegido.resultado === 'correcto' ? 'text-green-600' : elegido.resultado === 'regular' ? 'text-yellow-600' : 'text-red-500'}`}>
                  {elegido.score > 0 ? `+${elegido.score} pts` : '0 pts — Diseño Confuso'}
                </span>
              </div>
              <br />
              <button onClick={() => onComplete(elegido.score)}
                className="bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md">
                Actividad 2 →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
