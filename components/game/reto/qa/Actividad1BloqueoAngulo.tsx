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
    label: 'Poste Izquierdo',
    emoji: '🟢',
    descripcion: 'Cubres el ángulo inferior',
    score: 100,
    resultado: 'correcto',
    feedback: '¡Gran bloqueo! Como QA, te posicionaste donde el error era más probable. Detectar un fallo antes de que el usuario lo vea es como evitar un gol en el último minuto.',
    ballTarget: { x: 14, y: 37 },
    defensaTarget: { x: 13, y: 38 },
  },
  {
    id: 'centro',
    label: 'Centro',
    emoji: '🟡',
    descripcion: 'Cubres el centro del arco',
    score: 50,
    resultado: 'regular',
    feedback: 'Balón desviado. Encontraste el error, pero no lo solucionaste del todo. El riesgo sigue ahí, igual que un bug que se parchea mal y genera un tiro de esquina.',
    ballTarget: { x: 14, y: 50 },
    defensaTarget: { x: 13, y: 50 },
  },
  {
    id: 'derecho',
    label: 'Poste Derecho',
    emoji: '🔴',
    descripcion: 'Cubres el ángulo superior',
    score: 0,
    resultado: 'incorrecto',
    feedback: '¡Gol en contra! No probaste la zona crítica. En software, si el QA no revisa donde es más peligroso, el error llega al cliente y el sistema falla.',
    ballTarget: { x: 14, y: 62 },
    defensaTarget: { x: 13, y: 62 },
  },
];

// Coordenadas como % sobre viewBox 100x56.25 (ratio 16:9)
const VB_W = 100;
const VB_H = 56.25;

const DELANTERO_START = { x: 40, y: 50 };
const DEFENSA_START   = { x: 16, y: 50 };
const BALL_START      = { x: 40, y: 50 };

interface Props {
  onComplete: (score: number) => void;
}

export const Actividad1BloqueoAngulo: React.FC<Props> = ({ onComplete }) => {
  const [fase, setFase] = useState<'elige' | 'animar' | 'modal'>('elige');
  const [elegida, setElegida] = useState<Zona | null>(null);
  const [ballPos, setBallPos] = useState(BALL_START);
  const [defensaPos, setDefensaPos] = useState(DEFENSA_START);
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

    setDefensaPos(zona.defensaTarget);
    setTimeout(() => {
      setBallPos(zona.ballTarget);
      if (zona.resultado === 'incorrecto') setGolazo(true);
    }, 700);
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
          {[0,1,2,3,4].map(i => (
            <rect key={i} x={i*20} y={0} width={10} height={VB_H} fill="#297528" opacity="0.4" />
          ))}

          {/* Línea de fondo izquierda */}
          <line x1="0" y1="0" x2="0" y2={VB_H} stroke="white" strokeWidth="0.5" />
          {/* Área penal izquierda */}
          <rect x="0" y={VB_H*0.22} width={VB_W*0.18} height={VB_H*0.56}
            fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
          {/* Área chica */}
          <rect x="0" y={VB_H*0.36} width={VB_W*0.08} height={VB_H*0.28}
            fill="none" stroke="white" strokeWidth="0.4" opacity="0.5" />
          {/* Arco izquierdo */}
          <rect x="0" y={VB_H*0.38} width="2" height={VB_H*0.24}
            fill="#888" stroke="white" strokeWidth="0.6" rx="0.3" />

          {/* Zonas de bloqueo sombreadas (solo en fase 'elige') */}
          {fase === 'elige' && (
            <>
              {/* Poste izquierdo */}
              <rect x="10" y={VB_H*0.56} width="12" height={VB_H*0.22}
                fill="#22c55e" opacity="0.25" rx="1"
                className="cursor-pointer" onClick={() => handleElegir(ZONAS[0])}
              />
              {/* Centro */}
              <rect x="10" y={VB_H*0.39} width="12" height={VB_H*0.22}
                fill="#eab308" opacity="0.25" rx="1"
                className="cursor-pointer" onClick={() => handleElegir(ZONAS[1])}
              />
              {/* Poste derecho */}
              <rect x="10" y={VB_H*0.22} width="12" height={VB_H*0.22}
                fill="#ef4444" opacity="0.25" rx="1"
                className="cursor-pointer" onClick={() => handleElegir(ZONAS[2])}
              />
              {/* Etiquetas de zona */}
              <text x="16" y={VB_H*0.72} textAnchor="middle" fontSize="2.2" fill="white" fontWeight="bold">Poste Izq.</text>
              <text x="16" y={VB_H*0.52} textAnchor="middle" fontSize="2.2" fill="white" fontWeight="bold">Centro</text>
              <text x="16" y={VB_H*0.34} textAnchor="middle" fontSize="2.2" fill="white" fontWeight="bold">Poste Der.</text>
            </>
          )}

          {/* Delantero rival (rojo) */}
          <motion.g
            animate={{ x: fase === 'animar' ? -15 : 0 }}
            transition={{ duration: 0.6, ease: 'easeIn' }}
          >
            <circle cx={DELANTERO_START.x} cy={DELANTERO_START.y} r="3.5" fill="#c0392b" stroke="white" strokeWidth="0.6" />
            <text x={DELANTERO_START.x} y={DELANTERO_START.y + 1.2} textAnchor="middle" fontSize="3" fill="white" fontWeight="bold">R</text>
            <text x={DELANTERO_START.x} y={DELANTERO_START.y + 5.5} textAnchor="middle" fontSize="2.2" fill="white" opacity="0.85">Rival</text>
          </motion.g>

          {/* Defensa (azul) con aura — se mueve a la zona elegida */}
          <motion.g
            animate={{ x: defensaPos.x - DEFENSA_START.x, y: defensaPos.y - DEFENSA_START.y }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
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
            transition={{ duration: 1, ease: 'easeIn', delay: 0.7 }}
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
              className={`flex flex-col items-center gap-1 rounded-xl border-2 border-dashed p-3 text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer
                ${z.resultado === 'correcto' ? 'border-green-400 hover:bg-green-50 text-green-800' :
                  z.resultado === 'regular'  ? 'border-yellow-400 hover:bg-yellow-50 text-yellow-800' :
                  'border-red-400 hover:bg-red-50 text-red-800'}`}
            >
              <span className="text-2xl">{z.emoji}</span>
              <span>{z.label}</span>
              <span className="text-xs text-gray-500 font-normal">{z.descripcion}</span>
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
