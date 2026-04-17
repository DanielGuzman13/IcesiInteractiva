'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Zona = {
  id: 'izquierdo' | 'centro' | 'derecho';
  label: string;
  emoji: string;
  descripcion: string;
  score: 100 | 50 | 0;
  feedback: string;
  resultado: 'correcto' | 'regular' | 'incorrecto';
  ballTarget: { x: number; y: number };
  defensaTarget: { x: number; y: number };
};

const ZONAS: Zona[] = [
  {
    id: 'izquierdo',
    label: 'Zona 1',
    emoji: '1',
    descripcion: 'Bloqueo Lateral Inferior',
    score: 100,
    resultado: 'correcto',
    feedback: '¡Gran bloqueo! Como Defensa (QA), te posicionaste donde el error era más probable. Detectar un fallo antes de que el usuario lo vea es como evitar un gol en el último minuto.',
    ballTarget: { x: 14, y: 40.5 },
    defensaTarget: { x: 13, y: 40.5 },
  },
  {
    id: 'centro',
    label: 'Zona 2',
    emoji: '2',
    descripcion: 'Bloqueo Central',
    score: 50,
    resultado: 'regular',
    feedback: 'Balón desviado. Encontraste el error, pero no lo solucionaste del todo. Como Defensa (QA), el riesgo sigue ahí, igual que un bug que se parchea mal.',
    ballTarget: { x: 14, y: 28.5 },
    defensaTarget: { x: 13, y: 28.5 },
  },
  {
    id: 'derecho',
    label: 'Zona 3',
    emoji: '3',
    descripcion: 'Bloqueo Lateral Superior',
    score: 0,
    resultado: 'incorrecto',
    feedback: '¡Gol en contra! No probaste la zona crítica. Como Defensa (QA), si no revisas donde es más peligroso, el error llega al cliente y el sistema falla.',
    ballTarget: { x: -3, y: 16.5 },
    defensaTarget: { x: 13, y: 28.5 }, // Defensa se queda en el centro o falla
  },
];

// Coordenadas como % sobre viewBox 100x56.25 (ratio 16:9)
const VB_W = 100;
const VB_H = 56.25;

const DELANTERO_START = { x: 60, y: 28.5 };
const DEFENSA_START = { x: 30, y: 28.5 };
const PORTERO_START = { x: 4, y: 28.5 };
const BALL_START = { x: 60, y: 28.5 };

interface Props {
  onComplete: (score: number) => void;
}

export const Actividad1BloqueoAngulo: React.FC<Props> = ({ onComplete }) => {
  const [fase, setFase] = useState<'elige' | 'animar' | 'modal'>('elige');
  const [elegida, setElegida] = useState<Zona | null>(null);
  const [ballPos, setBallPos] = useState(BALL_START);
  const [defensaPos, setDefensaPos] = useState(DEFENSA_START);
  const [porteroPos, setPorteroPos] = useState(PORTERO_START);
  const [golazo, setGolazo] = useState(false);

  const handleElegir = (zona: Zona) => {
    if (fase !== 'elige') return;
    setElegida(zona);
    setFase('animar');

    // Persistir UserAnswer en localStorage
    if (typeof window !== 'undefined') {
      const pre = localStorage.getItem('currentPlayer') || 'guest';
      const answers = JSON.parse(localStorage.getItem(`${pre}_qa_answers`) || '{}');
      answers['actividad1'] = { opcion: zona.id, label: zona.label, score: zona.score, resultado: zona.resultado };
      localStorage.setItem(`${pre}_qa_answers`, JSON.stringify(answers));
    }

    // Todo ocurre de forma coordinada al elegir
    setBallPos(zona.ballTarget);
    setDefensaPos(zona.defensaTarget);
    
    // El portero reacciona
    if (zona.resultado === 'incorrecto') {
      setGolazo(true);
      setPorteroPos({ x: 4, y: zona.ballTarget.y > 28.5 ? 35 : 22 }); // Portero se lanza pero no llega
    } else {
      setPorteroPos({ x: 4, y: zona.ballTarget.y }); // Portero acompaña
    }

    setTimeout(() => setFase('modal'), 1600);
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
        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
          Actividad 1 de 2
        </span>
        <h2 className="text-2xl font-extrabold text-gray-800">🛡️ El Bloqueo de Ángulo</h2>
        <p className="text-gray-500 text-sm mt-1">El delantero rival avanza. ¿Dónde te posicionas para bloquearlo?</p>
      </div>

      {/* Campo SVG 16:9 */}
      <div
        className="relative w-full rounded-xl overflow-hidden border-4 border-green-900 shadow-inner"
        style={{ background: '#2E7D32', paddingBottom: '56.25%' }}
      >
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="absolute inset-0 w-full h-full"
          style={{ display: 'block' }}
        >
          {/* Césped */}
          <rect width={VB_W} height={VB_H} fill="#2E7D32" />
          {/* Franjas de césped */}
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i} x={i * 20} y={0} width={10} height={VB_H} fill="#297528" opacity="0.4" />
          ))}

          {/* Línea de fondo izquierda */}
          <line x1="0" y1="0" x2="0" y2={VB_H} stroke="white" strokeWidth="0.5" />
          {/* Área penal izquierda */}
          <rect x="0" y={VB_H * 0.22} width={VB_W * 0.18} height={VB_H * 0.56}
            fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
          {/* Área chica */}
          <rect x="0" y={VB_H * 0.36} width={VB_W * 0.08} height={VB_H * 0.28}
            fill="none" stroke="white" strokeWidth="0.4" opacity="0.5" />
          {/* Arco izquierdo (más grande) */}
          <rect x="0" y="10" width="2" height="37"
            fill="#888" stroke="white" strokeWidth="0.6" rx="0.3" />

          {/* Zonas de bloqueo sombreadas (solo en fase 'elige') */}
          {fase === 'elige' && (
            <>
              {[
                { y: 35, zona: ZONAS[0], n: '1' },
                { y: 23, zona: ZONAS[1], n: '2' },
                { y: 11, zona: ZONAS[2], n: '3' }
              ].map((item) => (
                <g key={item.zona.id} className="cursor-pointer group" onClick={() => handleElegir(item.zona)}>
                  <rect
                    x="10" y={item.y} width="14" height="11"
                    fill="white" opacity="0.1" rx="2" stroke="white" strokeWidth="0.5"
                    className="transition-all duration-300 group-hover:opacity-30 group-hover:fill-blue-100"
                  />
                  <text x="17" y={item.y + 7.5} textAnchor="middle" fontSize="8" fill="black" opacity="0.2" fontWeight="900" style={{ pointerEvents: 'none' }}>
                    {item.n}
                  </text>
                  <text x="17" y={item.y + 7} textAnchor="middle" fontSize="8" fill="white" fontWeight="900" style={{ pointerEvents: 'none' }}>
                    {item.n}
                  </text>
                </g>
              ))}
            </>
          )}

          {/* Delantero rival (rojo) */}
          <motion.g
            animate={{ x: fase === 'animar' ? -5 : 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <circle cx={DELANTERO_START.x} cy={DELANTERO_START.y} r="3.5" fill="#c0392b" stroke="white" strokeWidth="0.6" />
            <text x={DELANTERO_START.x} y={DELANTERO_START.y + 1.2} textAnchor="middle" fontSize="3" fill="white" fontWeight="bold">R</text>
            <text x={DELANTERO_START.x} y={DELANTERO_START.y + 5.5} textAnchor="middle" fontSize="2.2" fill="white" opacity="0.85">Rival</text>
          </motion.g>

          {/* Portero (verde) */}
          <motion.g
            animate={{ x: porteroPos.x - PORTERO_START.x, y: porteroPos.y - PORTERO_START.y }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <circle cx={PORTERO_START.x} cy={PORTERO_START.y} r="3" fill="#27ae60" stroke="#2ecc71" strokeWidth="0.8" />
            <text x={PORTERO_START.x} y={PORTERO_START.y + 1} textAnchor="middle" fontSize="2.5" fill="white" fontWeight="bold">P</text>
          </motion.g>

          {/* Defensa (azul) con aura — se mueve a la zona elegida */}
          <motion.g
            animate={{ x: defensaPos.x - DEFENSA_START.x, y: defensaPos.y - DEFENSA_START.y }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Aura azul pulsante — indica jugador activo */}
            <circle cx={DEFENSA_START.x} cy={DEFENSA_START.y} r="6.5" fill="#3b82f6" opacity="0.25">
              {fase === 'elige' && <animate attributeName="r" values="6;8;6" dur="1.2s" repeatCount="indefinite" />}
              {fase === 'elige' && <animate attributeName="opacity" values="0.25;0.08;0.25" dur="1.2s" repeatCount="indefinite" />}
            </circle>
            <circle cx={DEFENSA_START.x} cy={DEFENSA_START.y} r="3.5" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="1" />
            <text x={DEFENSA_START.x} y={DEFENSA_START.y + 1.2} textAnchor="middle" fontSize="2.8" fill="white" fontWeight="bold">QA</text>
          </motion.g>

          {/* Balón animado */}
          <motion.g
            animate={{ x: ballPos.x - BALL_START.x, y: ballPos.y - BALL_START.y }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <text
              x={BALL_START.x}
              y={BALL_START.y}
              textAnchor="middle"
              fontSize="4"
            >
              ⚽
            </text>
          </motion.g>

          {/* GOL en contra */}
          <AnimatePresence>
            {golazo && (
              <motion.text
                x={VB_W / 2} y={VB_H / 2}
                textAnchor="middle"
                fontSize="10"
                fill="#ef4444"
                fontWeight="bold"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                ¡GOL!
              </motion.text>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Botones de zona (alternativa visual debajo del campo) */}
      {fase === 'elige' && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {ZONAS.map(z => (
            <button
              key={z.id}
              onClick={() => handleElegir(z)}
              className="flex flex-col items-center gap-1 rounded-2xl border-2 border-gray-200 bg-white/40 p-4 text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer hover:bg-white hover:shadow-xl group grow backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-2xl mb-1 shadow-lg group-hover:bg-blue-700 transition-colors">
                {z.emoji}
              </div>
              <span className="text-gray-800 text-base">{z.label}</span>
              <span className="text-[15px] text-gray-500 font-normal leading-tight text-center">{z.descripcion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Modal de resultado */}
      <AnimatePresence>
        {fase === 'modal' && elegida && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-t-8 ${resultadoColor[elegida.resultado]}`}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="text-5xl mb-3">
                {elegida.resultado === 'correcto' ? '🛡️' : elegida.resultado === 'regular' ? '↩️' : '😱'}
              </div>
              <h3 className="text-xl font-extrabold text-gray-800 mb-2">{elegida.label}</h3>
              {/* Etiqueta relación rol */}
              <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                🔗 Relación con el Rol
              </div>
              <p className={`text-sm leading-relaxed mb-4
                ${elegida.resultado === 'correcto' ? 'text-green-700' :
                  elegida.resultado === 'regular' ? 'text-yellow-700' : 'text-red-700'}`}>
                {elegida.feedback}
              </p>
              <div className={`inline-block rounded-xl border py-3 px-6 mb-6 ${resultadoBg[elegida.resultado]}`}>
                <span className={`font-black text-2xl
                  ${elegida.resultado === 'correcto' ? 'text-green-600' :
                    elegida.resultado === 'regular' ? 'text-yellow-600' : 'text-red-500'}`}>
                  {elegida.score > 0 ? `+${elegida.score} pts` : '0 pts — ¡GOL EN CONTRA!'}
                </span>
              </div>
              <br />
              <button
                onClick={() => onComplete(elegida.score)}
                className="bg-gray-800 hover:bg-gray-900 active:scale-95 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md"
              >
                Actividad 2 →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
