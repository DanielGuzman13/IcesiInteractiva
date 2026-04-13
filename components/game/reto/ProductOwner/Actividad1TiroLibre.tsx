'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BarreraOpt = {
  id: 'reforzada' | 'ligera' | 'sin';
  label: string;
  emoji: string;
  descripcion: string;
  jugadores: number;
  score: 100 | 50 | 0;
  resultado: 'correcto' | 'regular' | 'incorrecto';
  feedback: string;
  colorClass: string;
};

const VB_W = 100;
const VB_H = 56.25;

const RIVAL_POS = { x: 50, y: VB_H * 0.15 };
const PORTERO_POS = { x: 50, y: VB_H * 0.9 };
const BARRERA_Y = VB_H * 0.45;

const OPCIONES: BarreraOpt[] = [
  {
    id: 'reforzada',
    label: 'Barrera Reforzada',
    emoji: '🧱',
    descripcion: '5 jugadores cubriendo el poste clave',
    jugadores: 5,
    score: 100,
    resultado: 'correcto',
    feedback: '¡Bloqueo perfecto! El peligro pasó sin que tuvieras que esforzarte. (Como Product Owner, decidiste cubrir el riesgo más alto primero para que el proyecto no falle en el lanzamiento)',
    colorClass: 'border-gray-300 hover:bg-gray-50 text-gray-800',
  },
  {
    id: 'ligera',
    label: 'Barrera Ligera',
    emoji: '🕴️',
    descripcion: '2 jugadores, dejas espacios probables',
    jugadores: 2,
    score: 50,
    resultado: 'regular',
    feedback: '¡La sacaste con las uñas! El balón casi entra. (Arriesgaste la estabilidad del proyecto por querer avanzar rápido en otras cosas sin asegurar la base)',
    colorClass: 'border-gray-300 hover:bg-gray-50 text-gray-800',
  },
  {
    id: 'sin',
    label: 'Sin Barrera',
    emoji: '🏃‍♂️',
    descripcion: 'Confías solo en tus propios reflejos',
    jugadores: 0,
    score: 0,
    resultado: 'incorrecto',
    feedback: '¡Gol en contra! El balón entró caminando. (No escuchaste las alertas de riesgo y un problema predecible destruyó el éxito de tu software)',
    colorClass: 'border-gray-300 hover:bg-gray-50 text-gray-800',
  },
];

interface Props {
  onComplete: (score: number) => void;
}

export const Actividad1TiroLibre: React.FC<Props> = ({ onComplete }) => {
  const [fase, setFase] = useState<'elige' | 'prepara' | 'tiro' | 'modal'>('elige');
  const [elegida, setElegida] = useState<BarreraOpt | null>(null);

  const handleElegir = (opt: BarreraOpt) => {
    if (fase !== 'elige') return;
    setElegida(opt);
    setFase('prepara');

    if (typeof window !== 'undefined') {
      const pre = localStorage.getItem('currentPlayer') || 'guest';
      const answers = JSON.parse(localStorage.getItem(`${pre}_po_answers`) || '{}');
      answers['actividad1'] = { opcion: opt.id, label: opt.label, score: opt.score, resultado: opt.resultado };
      localStorage.setItem(`${pre}_po_answers`, JSON.stringify(answers));
    }

    // El rival patea después de organizar la barrera
    setTimeout(() => {
      setFase('tiro');
    }, 1500);

    // Modal aparece después de la jugada
    setTimeout(() => {
      setFase('modal');
    }, 3500);
  };

  const getBallTarget = () => {
    if (elegida?.id === 'reforzada') {
      return { x: 50, y: BARRERA_Y }; // choca en la barrera
    } else if (elegida?.id === 'ligera') {
      return { x: 30, y: VB_H * 0.9 }; // entra por el lado, portero vuela
    } else {
      return { x: 25, y: VB_H * 0.9 }; // palo lejano, gol
    }
  };

  const getPorteroAnim = () => {
    if (fase === 'tiro') {
      if (elegida?.id === 'ligera') {
        return { x: -16, y: 0 }; // Portero se estira (vuela) a atajar
      }
      if (elegida?.id === 'reforzada') {
        return { x: 0, y: 0 }; // Portero tranquilo
      }
      if (elegida?.id === 'sin') {
        return { x: -4, y: 0 }; // Duda un instante pero no llega
      }
    }
    return { x: 0, y: 0 };
  };

  const resultadoColor = { correcto: 'border-green-500', regular: 'border-yellow-500', incorrecto: 'border-red-500' };
  const resultadoBg = { correcto: 'bg-green-50', regular: 'bg-yellow-50', incorrecto: 'bg-red-50' };

  return (
    <div className="w-full">
      <div className="text-center mb-5">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
          Actividad 1 de 2
        </span>
        <h2 className="text-2xl font-extrabold text-gray-800">🧱 El Grito de la Barrera</h2>
        <p className="text-gray-500 text-sm mt-1">El rival va a cobrar un tiro libre. Eres el Product Owner (Portero), organiza tu defensa ante este riesgo.</p>
      </div>

      <div className="relative w-full rounded-xl overflow-hidden border-4 border-green-900 shadow-inner" style={{ background: '#2E7D32', paddingBottom: '56.25%' }}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 w-full h-full">
          {/* Césped */}
          <rect width={VB_W} height={VB_H} fill="#2E7D32" />
          {[0,1,2,3,4].map(i => (
            <rect key={i} x={i*20} y={0} width={10} height={VB_H} fill="#297528" opacity="0.35" />
          ))}

          {/* Área propia */}
          <rect x={VB_W*0.22} y={VB_H*0.75} width={VB_W*0.56} height={VB_H*0.25} fill="none" stroke="white" strokeWidth="0.5" opacity="0.6"/>
          <rect x={VB_W*0.36} y={VB_H*0.88} width={VB_W*0.28} height={VB_H*0.12} fill="none" stroke="white" strokeWidth="0.4" opacity="0.5"/>
          {/* Media luna invertida */}
          <path d="M 37.3 42.18 A 10 10 0 0 1 62.7 42.18" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
          {/* Arco */}
          <rect x={VB_W*0.42} y={VB_H} width={VB_W*0.16} height={VB_H*0.06} fill="#888" stroke="white" strokeWidth="0.6" rx="0.3"/>

          {/* Rival pateador (Rojo) */}
          <circle cx={RIVAL_POS.x} cy={RIVAL_POS.y} r="3.5" fill="#e11d48" stroke="white" strokeWidth="0.5"/>
          <text x={RIVAL_POS.x} y={RIVAL_POS.y+1.2} textAnchor="middle" fontSize="2.5" fill="white" fontWeight="bold">R</text>

          {/* Compañeros haciendo la barrera */}
          <AnimatePresence>
            {(fase === 'prepara' || fase === 'tiro' || fase === 'modal') && elegida && (
              [...Array(elegida.jugadores)].map((_, i) => {
                const totalJ = elegida.jugadores;
                const offset = (i - (totalJ - 1) / 2) * 5.5; // Espaciado entre jugadores
                return (
                  <motion.g
                    key={`barrera-${i}`}
                    initial={{ y: -VB_H, x: 50 + offset, opacity: 0 }}
                    animate={{ y: BARRERA_Y, x: 50 + offset, opacity: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.1, type: 'spring' }}
                  >
                    <circle cx={0} cy={0} r="3" fill="#1d4ed8" stroke="white" strokeWidth="0.5" />
                    <text x={0} y={1} textAnchor="middle" fontSize="2.2" fill="white">C</text>
                  </motion.g>
                );
              })
            )}
          </AnimatePresence>

          {/* Portero (Azul, aura cuando elige) */}
          <motion.g
            animate={getPorteroAnim()}
            transition={{ duration: 0.5, ease: 'easeOut', delay: elegida?.id === 'ligera' ? 0.3 : 0 }}
          >
            {fase === 'elige' && (
              <circle cx={PORTERO_POS.x} cy={PORTERO_POS.y} r="7" fill="#3b82f6" opacity="0.2">
                <animate attributeName="r" values="6;9;6" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.06;0.2" dur="1.2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={PORTERO_POS.x} cy={PORTERO_POS.y} r="3.5" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="1" />
            <text x={PORTERO_POS.x} y={PORTERO_POS.y+1.2} textAnchor="middle" fontSize="2.5" fill="white" fontWeight="bold">PO</text>
          </motion.g>

          {/* Balón Animado */}
          <motion.text textAnchor="middle" fontSize="4"
            initial={{ x: RIVAL_POS.x, y: RIVAL_POS.y + 4 }}
            animate={
              fase === 'tiro' || fase === 'modal'
                ? getBallTarget()
                : { x: RIVAL_POS.x, y: RIVAL_POS.y + 4 }
            }
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            ⚽
          </motion.text>

          {/* GOL Text */}
          <AnimatePresence>
            {fase === 'tiro' && elegida?.id === 'sin' && (
              <motion.text x={VB_W*0.6} y={VB_H*0.9} textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold"
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}>
                ¡GOL!
              </motion.text>
            )}
          </AnimatePresence>

        </svg>
      </div>

      {fase === 'elige' && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {OPCIONES.map(o => (
            <button key={o.id} onClick={() => handleElegir(o)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 border-dashed p-3 text-sm font-bold transition-all hover:scale-105 active:scale-95 ${o.colorClass}`}>
              <span className="text-2xl">{o.emoji}</span>
              <span>{o.label}</span>
              <span className="text-xs text-gray-500 font-normal">{o.descripcion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Moda Feedback */}
      <AnimatePresence>
        {fase === 'modal' && elegida && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={`bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-t-8 ${resultadoColor[elegida.resultado]}`}
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
              <div className="text-5xl mb-3">{elegida.resultado === 'correcto' ? '🧱' : elegida.resultado === 'regular' ? '😨' : '😱'}</div>
              <h3 className="text-xl font-extrabold text-gray-800 mb-2">{elegida.label}</h3>
              <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                🔗 Relación con el Rol (PO)
              </div>
              <p className={`text-sm leading-relaxed mb-4 ${elegida.resultado === 'correcto' ? 'text-green-700' : elegida.resultado === 'regular' ? 'text-yellow-700' : 'text-red-700'}`}>
                {elegida.feedback}
              </p>
              <div className={`inline-block rounded-xl border py-3 px-6 mb-6 ${resultadoBg[elegida.resultado]}`}>
                <span className={`font-black text-2xl ${elegida.resultado === 'correcto' ? 'text-green-600' : elegida.resultado === 'regular' ? 'text-yellow-600' : 'text-red-500'}`}>
                  {elegida.score > 0 ? `+${elegida.score} pts` : '0 pts — Software Destruido'}
                </span>
              </div>
              <br/>
              <button onClick={() => onComplete(elegida.score)}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md">
                Continuar a Actividad 2 →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
