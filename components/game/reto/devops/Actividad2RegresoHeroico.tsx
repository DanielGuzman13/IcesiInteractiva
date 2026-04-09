'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Accion = {
  id: 'correr' | 'apoyo' | 'quieto';
  label: string;
  emoji: string;
  descripcion: string;
  feedback: string;
  score: 100 | 50 | 0;
  resultado: 'correcto' | 'regular' | 'incorrecto';
  color: string;
};

const VB_W = 100;
const VB_H = 56.25;

const RIVAL_PATH_START = { x: 60, y: VB_H * 0.5 };
const RIVAL_PATH_END   = { x: 8,  y: VB_H * 0.5 };
const LATERAL_START    = { x: 70, y: VB_H * 0.85 };
const LATERAL_RECOVER  = { x: 45, y: VB_H * 0.5 };

const ACCIONES: Accion[] = [
  {
    id: 'correr',
    label: 'Correr y Recuperar',
    emoji: '⚡',
    descripcion: 'Sprints a máxima velocidad para interceptar',
    feedback: '¡Rollback ejecutado! Detectaste el fallo en producción y devolviste el sistema a un estado estable al instante. Esto es monitoreo proactivo y recuperación automática.',
    score: 100,
    resultado: 'correcto',
    color: 'border-gray-300 hover:bg-gray-50 text-gray-800',
  },
  {
    id: 'apoyo',
    label: 'Pedir Apoyo',
    emoji: '📣',
    descripcion: 'Pides refuerzos a otro jugador',
    feedback: 'Error detectado tarde. El sistema se salvó por poco gracias al equipo, pero un buen DevOps tiene alertas automáticas que no dependen de que alguien llame a otro.',
    score: 50,
    resultado: 'regular',
    color: 'border-gray-300 hover:bg-gray-50 text-gray-800',
  },
  {
    id: 'quieto',
    label: 'Quedarse Quieto',
    emoji: '🪨',
    descripcion: 'Confías en que el portero lo ataje',
    feedback: '¡Gol! No tenías monitoreo activo del sistema. El error llegó al usuario final y destruyó la experiencia. Como DevOps, el uptime es tu responsabilidad 24/7.',
    score: 0,
    resultado: 'incorrecto',
    color: 'border-gray-300 hover:bg-gray-50 text-gray-800',
  },
];

interface Props {
  onComplete: (score: number) => void;
}

export const Actividad2RegresoHeroico: React.FC<Props> = ({ onComplete }) => {
  const [fase, setFase] = useState<'elige' | 'animando' | 'modal'>('elige');
  const [elegida, setElegida] = useState<Accion | null>(null);
  const [golazo, setGolazo] = useState(false);
  const [rivalAnimate, setRivalAnimate] = useState(false);
  const [lateralAnimate, setLateralAnimate] = useState(false);

  const handleElegir = (accion: Accion) => {
    if (fase !== 'elige') return;
    setElegida(accion);
    setFase('animando');

    // Persistir UserAnswer
    if (typeof window !== 'undefined') {
      const pre = localStorage.getItem('currentPlayer') || 'guest';
      const answers = JSON.parse(localStorage.getItem(`${pre}_devops_answers`) || '{}');
      answers['actividad2'] = { opcion: accion.id, label: accion.label, score: accion.score, resultado: accion.resultado };
      localStorage.setItem(`${pre}_devops_answers`, JSON.stringify(answers));
    }

    setRivalAnimate(true);

    if (accion.id === 'correr') {
      // Lateral intercepta al rival
      setLateralAnimate(true);
      setTimeout(() => setFase('modal'), 2000);
    } else if (accion.id === 'apoyo') {
      setTimeout(() => setFase('modal'), 2000);
    } else {
      // Rival llega al arco → gol
      setTimeout(() => setGolazo(true), 1500);
      setTimeout(() => setFase('modal'), 2500);
    }
  };

  const colorBorde = { correcto: 'border-green-500', regular: 'border-yellow-500', incorrecto: 'border-red-500' };
  const colorBg    = { correcto: 'bg-green-50',     regular: 'bg-yellow-50',     incorrecto: 'bg-red-50'     };

  return (
    <div className="w-full">
      <div className="text-center mb-5">
        <span className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
          Actividad 2 de 2
        </span>
        <h2 className="text-2xl font-extrabold text-gray-800">🏃‍♂️ El Regreso Heroico</h2>
        <p className="text-gray-500 text-sm mt-1">El rival avanza hacia tu arco tras un error. Tu lateral está lejos. ¿Qué haces?</p>
      </div>

      <div className="relative w-full rounded-xl overflow-hidden border-4 border-green-900 shadow-inner"
        style={{ background: '#2E7D32', paddingBottom: '56.25%' }}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 w-full h-full">
          <rect width={VB_W} height={VB_H} fill="#2E7D32" />
          {[0,1,2,3,4].map(i => (
            <rect key={i} x={i*20} y={0} width={10} height={VB_H} fill="#297528" opacity="0.35" />
          ))}

          {/* Área y arco izquierdo */}
          <rect x={0} y={VB_H*0.22} width={VB_W*0.18} height={VB_H*0.56} fill="none" stroke="white" strokeWidth="0.5" opacity="0.6"/>
          <rect x={0} y={VB_H*0.36} width={VB_W*0.08} height={VB_H*0.28} fill="none" stroke="white" strokeWidth="0.4" opacity="0.5"/>
          <rect x={0} y={VB_H*0.38} width="2" height={VB_H*0.24} fill="#888" stroke="white" strokeWidth="0.6" rx="0.3"/>

          {/* Portero propio */}
          <circle cx={4} cy={VB_H*0.5} r="3" fill="#1d4ed8" stroke="white" strokeWidth="0.5" opacity="0.8"/>
          <text x={4} y={VB_H*0.5+1} textAnchor="middle" fontSize="2.2" fill="white">PO</text>

          {/* Compañero de apoyo (visible si eligió apoyo) */}
          {elegida?.id === 'apoyo' && (
            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
              <circle cx={30} cy={VB_H*0.3} r="3" fill="#1d4ed8" stroke="#67e8f9" strokeWidth="0.8"/>
              <text x={30} y={VB_H*0.3+1} textAnchor="middle" fontSize="2.2" fill="white">A</text>
            </motion.g>
          )}

          {/* Rival avanzando con el balón */}
          <motion.g
            animate={rivalAnimate
              ? { x: RIVAL_PATH_END.x - RIVAL_PATH_START.x, y: 0 }
              : { x: 0, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeIn' }}
          >
            <circle cx={RIVAL_PATH_START.x} cy={RIVAL_PATH_START.y} r="3.5" fill="#c0392b" stroke="white" strokeWidth="0.7"/>
            <text x={RIVAL_PATH_START.x} y={RIVAL_PATH_START.y+1.2} textAnchor="middle" fontSize="2.5" fill="white" fontWeight="bold">R</text>
            {/* Balón junto al rival */}
            <text x={RIVAL_PATH_START.x+4} y={RIVAL_PATH_START.y+1} fontSize="3.5">⚽</text>
          </motion.g>

          {/* Lateral DevOps — solo se mueve si eligió "correr" */}
          <motion.g
            animate={lateralAnimate
              ? { x: LATERAL_RECOVER.x - LATERAL_START.x, y: LATERAL_RECOVER.y - LATERAL_START.y }
              : { x: 0, y: 0 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
          >
            {/* Aura pulsante solo en fase elige */}
            {fase === 'elige' && (
              <circle cx={LATERAL_START.x} cy={LATERAL_START.y} r="7" fill="#06b6d4" opacity="0.2">
                <animate attributeName="r" values="6;9;6" dur="1.2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.2;0.06;0.2" dur="1.2s" repeatCount="indefinite"/>
              </circle>
            )}
            <circle cx={LATERAL_START.x} cy={LATERAL_START.y} r="3.5" fill="#0891b2" stroke="#67e8f9" strokeWidth="1"/>
            <text x={LATERAL_START.x} y={LATERAL_START.y+1.2} textAnchor="middle" fontSize="2.6" fill="white" fontWeight="bold">DO</text>
          </motion.g>

          {/* GOL */}
          <AnimatePresence>
            {golazo && (
              <motion.text x={VB_W/2} y={VB_H/2} textAnchor="middle" fontSize="9"
                fill="#ef4444" fontWeight="bold"
                initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}>
                ¡GOL!
              </motion.text>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Botones */}
      {fase === 'elige' && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {ACCIONES.map(a => (
            <button key={a.id} onClick={() => handleElegir(a)}
              className={`flex flex-col items-center gap-1 rounded-xl border-2 border-dashed p-3 text-sm font-bold transition-all hover:scale-105 active:scale-95 ${a.color}`}>
              <span className="text-2xl">{a.emoji}</span>
              <span>{a.label}</span>
              <span className="text-xs text-gray-500 font-normal">{a.descripcion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {fase === 'modal' && elegida && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={`bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-t-8 ${colorBorde[elegida.resultado]}`}
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
              <div className="text-5xl mb-3">{elegida.emoji}</div>
              <h3 className="text-xl font-extrabold text-gray-800 mb-2">{elegida.label}</h3>
              <div className="inline-block bg-cyan-100 text-cyan-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                🔗 Relación con el Rol
              </div>
              <p className={`text-sm leading-relaxed mb-4 ${elegida.resultado === 'correcto' ? 'text-green-700' : elegida.resultado === 'regular' ? 'text-yellow-700' : 'text-red-700'}`}>
                {elegida.feedback}
              </p>
              <div className={`inline-block rounded-xl border py-3 px-6 mb-6 ${colorBg[elegida.resultado]}`}>
                <span className={`font-black text-2xl ${elegida.resultado === 'correcto' ? 'text-green-600' : elegida.resultado === 'regular' ? 'text-yellow-600' : 'text-red-500'}`}>
                  {elegida.score > 0 ? `+${elegida.score} pts` : '0 pts — Sistema caído'}
                </span>
              </div>
              <br/>
              <button onClick={() => onComplete(elegida.score)}
                className="bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md">
                Ver Resultado Final 🏆
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
