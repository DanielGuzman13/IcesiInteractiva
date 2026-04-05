'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Movimiento = {
  id: 'amague' | 'choque' | 'dudar';
  label: string;
  emoji: string;
  descripcion: string;
  score: 100 | 50 | 0;
  resultado: 'correcto' | 'regular' | 'incorrecto';
  feedback: string;
  colorClass: string;
};

const VB_W = 100;
const VB_H = 56.25;

const FE_START = { x: 70, y: VB_H * 0.8 };
const FE_END = { x: 92, y: VB_H * 0.4 };
const DF_START = { x: 80, y: VB_H * 0.2 };
const DF_END = { x: 80, y: VB_H * 0.6 };

const MOVS: Movimiento[] = [
  {
    id: 'amague',
    label: 'Amague Veloz',
    emoji: '🌪️',
    descripcion: 'Un movimiento ágil y sin interrupciones',
    score: 100,
    resultado: 'correcto',
    feedback: '¡Qué finta! Lo dejaste sembrado en el piso con pura agilidad. (Tu aplicación tiene una Experiencia de Usuario (UX) fluida y rápida que encanta al cliente)',
    colorClass: 'border-green-400 hover:bg-green-50 text-green-800',
  },
  {
    id: 'choque',
    label: 'Choque Fuerte',
    emoji: '💥',
    descripcion: 'Poco fluido, pero efectivo',
    score: 50,
    resultado: 'regular',
    feedback: '¡Pasaste! Pero el choque te frenó y casi pierdes el control. (La Interacción es Pesada; el usuario sintió que el sistema tardaba en responder y la navegación fue tosca)',
    colorClass: 'border-yellow-400 hover:bg-yellow-50 text-yellow-800',
  },
  {
    id: 'dudar',
    label: 'Dudar',
    emoji: '🤔',
    descripcion: 'Te quedas estático esperando',
    score: 0,
    resultado: 'incorrecto',
    feedback: '¡Perdiste el balón! Te enredaste solo y te quitaron la oportunidad. (Hay demasiados Errores de Interacción; el usuario intenta avanzar pero el sistema no responde y la experiencia es frustrante)',
    colorClass: 'border-red-400 hover:bg-red-50 text-red-800',
  },
];

interface Props {
  onComplete: (score: number) => void;
}

export const Actividad2RegateEfectivo: React.FC<Props> = ({ onComplete }) => {
  const [fase, setFase] = useState<'elige' | 'amague' | 'choque' | 'dudar' | 'modal'>('elige');
  const [elegido, setElegido] = useState<Movimiento | null>(null);

  const handleElegir = (mov: Movimiento) => {
    if (fase !== 'elige') return;
    setElegido(mov);
    setFase(mov.id);

    if (typeof window !== 'undefined') {
      const answers = JSON.parse(localStorage.getItem('frontend_answers') || '{}');
      answers['actividad2'] = { opcion: mov.id, label: mov.label, score: mov.score, resultado: mov.resultado };
      localStorage.setItem('frontend_answers', JSON.stringify(answers));
    }

    setTimeout(() => setFase('modal'), 2500);
  };

  const resultadoColor = { correcto: 'border-green-500', regular: 'border-yellow-500', incorrecto: 'border-red-500' };
  const resultadoBg = { correcto: 'bg-green-50', regular: 'bg-yellow-50', incorrecto: 'bg-red-50' };

  return (
    <div className="w-full">
      <div className="text-center mb-5">
        <span className="inline-block bg-pink-100 text-pink-800 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
          Actividad 2 de 2
        </span>
        <h2 className="text-2xl font-extrabold text-gray-800">🏃 El Regate Efectivo</h2>
        <p className="text-gray-500 text-sm mt-1">Un defensa veloz se cruza en tu camino al arco. ¿Cómo lo superas?</p>
      </div>

      <div className="relative w-full rounded-xl overflow-hidden border-4 border-green-900 shadow-inner" style={{ background: '#2E7D32', paddingBottom: '56.25%' }}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 w-full h-full">
          <rect width={VB_W} height={VB_H} fill="#2E7D32" />
          {[0,1,2,3,4].map(i => (
            <rect key={i} x={i*20} y={0} width={10} height={VB_H} fill="#297528" opacity="0.35" />
          ))}

          {/* Área y arco */}
          <rect x={VB_W*0.82} y={VB_H*0.22} width={VB_W*0.18} height={VB_H*0.56} fill="none" stroke="white" strokeWidth="0.5" opacity="0.6"/>
          <rect x={VB_W*0.9} y={VB_H*0.36} width={VB_W*0.1} height={VB_H*0.28} fill="none" stroke="white" strokeWidth="0.4" opacity="0.5"/>

          {/* Defensa Rival */}
          <motion.g
            animate={
              fase === 'amague' || fase === 'choque' || fase === 'dudar'
                ? { x: DF_END.x - DF_START.x, y: DF_END.y - DF_START.y } : { x: 0, y: 0 }
            }
            transition={{ duration: 1.2, ease: 'linear' }}
          >
            <circle cx={DF_START.x} cy={DF_START.y} r="3.5" fill="#1d4ed8" stroke="white" strokeWidth="0.7"/>
            <text x={DF_START.x} y={DF_START.y+1.2} textAnchor="middle" fontSize="2.5" fill="white" fontWeight="bold">D</text>
          </motion.g>

          {/* Delantero Frontend (Rojo) con el balón */}
          <motion.g
            animate={
              fase === 'amague' ? {
                x: [0, 5, 10, 22],
                y: [0, -15, 0, -20],
              } :
              fase === 'choque' ? {
                x: [0, 10, 6, 22],
                y: [0, -20, -18, -20],
              } :
              fase === 'dudar' ? {
                x: [0, 5, 2],
                y: [0, -5, -4],
              } : { x: 0, y: 0 }
            }
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            {fase === 'elige' && (
              <circle cx={FE_START.x} cy={FE_START.y} r="7" fill="#f43f5e" opacity="0.2">
                <animate attributeName="r" values="6;9;6" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.06;0.2" dur="1.2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={FE_START.x} cy={FE_START.y} r="3.5" fill="#e11d48" stroke="#fecdd3" strokeWidth="1" />
            <text x={FE_START.x} y={FE_START.y+1.2} textAnchor="middle" fontSize="2.5" fill="white" fontWeight="bold">FE</text>
            {/* Balón pegado */}
            <text x={FE_START.x+2} y={FE_START.y-1} textAnchor="middle" fontSize="2.5">⚽</text>
          </motion.g>

          <AnimatePresence>
            {fase === 'choque' && (
              <motion.text x={DF_END.x} y={DF_END.y} textAnchor="middle" fontSize="6"
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1.5 }} exit={{ opacity: 0 }} transition={{ delay: 1.0 }}>
                💥
              </motion.text>
            )}
            {fase === 'dudar' && (
              <motion.text x={DF_END.x-5} y={DF_END.y} textAnchor="middle" fontSize="6"
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1.2 }} exit={{ opacity: 0 }} transition={{ delay: 1.0 }}>
                ❌
              </motion.text>
            )}
            {fase === 'amague' && (
              <motion.text x={VB_W*0.92} y={VB_H*0.4} textAnchor="middle" fontSize="8" fill="#22c55e" fontWeight="bold"
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.3 }}>
                ¡GOL!
              </motion.text>
            )}
          </AnimatePresence>

        </svg>
      </div>

      {fase === 'elige' && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {MOVS.map(m => (
            <button key={m.id} onClick={() => handleElegir(m)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 border-dashed p-3 text-sm font-bold transition-all hover:scale-105 active:scale-95 ${m.colorClass}`}>
              <span className="text-2xl">{m.emoji}</span>
              <span>{m.label}</span>
              <span className="text-xs text-gray-500 font-normal">{m.descripcion}</span>
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
              <div className="text-5xl mb-3">{elegido.emoji}</div>
              <h3 className="text-xl font-extrabold text-gray-800 mb-2">{elegido.label}</h3>
              <div className="inline-block bg-pink-100 text-pink-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                🔗 Relación con el Rol (UX)
              </div>
              <p className={`text-sm leading-relaxed mb-4 ${elegido.resultado === 'correcto' ? 'text-green-700' : elegido.resultado === 'regular' ? 'text-yellow-700' : 'text-red-700'}`}>
                {elegido.feedback}
              </p>
              <div className={`inline-block rounded-xl border py-3 px-6 mb-6 ${resultadoBg[elegido.resultado]}`}>
                <span className={`font-black text-2xl ${elegido.resultado === 'correcto' ? 'text-green-600' : elegido.resultado === 'regular' ? 'text-yellow-600' : 'text-red-500'}`}>
                  {elegido.score > 0 ? `+${elegido.score} pts` : '0 pts — UX Frustrante'}
                </span>
              </div>
              <br/>
              <button onClick={() => onComplete(elegido.score)}
                className="bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md">
                Ver Goleadores 🏆
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
