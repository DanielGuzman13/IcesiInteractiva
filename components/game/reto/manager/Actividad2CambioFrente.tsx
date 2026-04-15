'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: (score: number) => void;
}

type Opcion = 'cambio' | 'aguantar' | 'solo' | null;

export const Actividad2CambioFrente = ({ onComplete }: Props) => {
  const [fase, setFase] = useState<'eleccion' | 'animando' | 'feedback'>('eleccion');
  const [eleccion, setEleccion] = useState<Opcion>(null);

  const manejarEleccion = (opcion: Opcion) => {
    setEleccion(opcion);
    setFase('animando');

    // Simulate animation duration then show feedback
    setTimeout(() => {
      setFase('feedback');
    }, 2000);
  };

  const opciones = [
    { id: 'cambio', label: 'Cambio de Frente', desc: 'Despejar el área pasándola al compañero libre', puntos: 100 },
    { id: 'aguantar', label: 'Aguantar el Balón', desc: 'Cubrir el balón bajo presión pesada', puntos: 50 },
    { id: 'solo', label: 'Irse Solo', desc: 'Intentar driblear a todos los rivales', puntos: 0 },
  ];

  const opcionSeleccionada = opciones.find(o => o.id === eleccion);

  return (
    <div className="w-full relative">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🗺️ Actividad 2: El Cambio de Frente</h2>
          <p className="text-gray-600 mb-4">
            Estás atrapado en una esquina con <strong>muchos rivales encima</strong>. La presión es alta y casi pierdes el balón. Sin embargo, al otro lado de la cancha, un compañero (Azul) corre sin ninguna marca.
          </p>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6">
            <h3 className="font-semibold text-amber-800 mb-1">Misión:</h3>
            <p className="text-sm text-amber-700">Decide cómo manejar la presión. Tratar de hacerlo todo tú mismo puede ser riesgoso.</p>
          </div>

          {fase === 'eleccion' && (
            <div className="space-y-3">
              {opciones.map((opc) => (
                <button
                  key={opc.id}
                  onClick={() => manejarEleccion(opc.id as Opcion)}
                  className="w-full text-left bg-white border-2 border-slate-200 hover:border-amber-400 p-4 rounded-xl transition-all shadow-sm flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-gray-800 group-hover:text-amber-700">{opc.label}</div>
                    <div className="text-sm text-gray-500">{opc.desc}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-500">&rarr;</div>
                </button>
              ))}
            </div>
          )}

          {fase === 'feedback' && opcionSeleccionada && (
            <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl animate-fade-in text-center mt-4">
              <div className="text-5xl mb-4">
                {opcionSeleccionada.puntos === 100 ? '🌟' : opcionSeleccionada.puntos === 50 ? '🛡️' : '❌'}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {opcionSeleccionada.puntos} Puntos
              </h3>
              <p className="text-gray-700 mb-6 text-sm leading-relaxed p-4 bg-white rounded-xl shadow-inner text-left">
                {opcionSeleccionada.id === 'cambio' &&
                  <span>¡Qué visión! Sacaste el balón del desorden y lo mandaste a donde había espacio para jugar. <strong className="text-amber-700">(Como Mediocampista (Team Manager), supiste Gestionar Recursos para evitar que una parte del equipo se sature de trabajo)</strong>.</span>
                }
                {opcionSeleccionada.id === 'aguantar' &&
                  <span>Te quedaste con la pelota pero el equipo sigue encerrado bajo presión. <strong className="text-amber-700">(Decidiste no delegar y que el equipo resolviera la Sobrecarga de Tareas sin ayuda externa)</strong>.</span>
                }
                {opcionSeleccionada.id === 'solo' &&
                  <span>Te quitaron el balón por querer hacer todo tú. <strong className="text-amber-700">(Caíste en el Micromanagement; intentaste hacer el trabajo de todos y el proyecto se desordenó)</strong>.</span>
                }
              </p>
              <button
                onClick={() => onComplete(opcionSeleccionada.puntos)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-10 rounded-full transition-all shadow-md w-full sm:w-auto"
              >
                Continuar
              </button>
            </div>
          )}
        </div>

        {/* Mini Cancha Visualización */}
        <div className="w-full md:w-2/5 aspect-[3/4] bg-green-600 border-4 border-white shadow-xl rounded-md relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '10% 10%' }}></div>

          {/* Compañero - Libre en el otro extremo */}
          <div className="absolute w-8 h-8 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center font-bold text-white shadow-md text-xs top-20 left-[85%] -translate-x-1/2 z-10 
            transition-transform duration-500" style={{ transform: fase === 'animando' && eleccion === 'cambio' ? 'translateX(-50%) scale(1.1)' : 'translateX(-50%)' }}>
            7
          </div>

          {/* Rivales apilados */}
          <div className="absolute w-6 h-6 bg-red-600 border-2 border-white rounded-full top-[60%] left-[25%] -translate-x-1/2 z-10 transition-all duration-1000" style={{ top: fase === 'animando' && eleccion === 'solo' ? '70%' : '60%', left: fase === 'animando' && eleccion === 'solo' ? '20%' : '25%' }}></div>
          <div className="absolute w-6 h-6 bg-red-600 border-2 border-white rounded-full top-[70%] left-[30%] -translate-x-1/2 z-10 transition-all duration-1000" style={{ top: fase === 'animando' && eleccion === 'solo' ? '75%' : '70%', left: fase === 'animando' && eleccion === 'solo' ? '20%' : '30%' }}></div>
          <div className="absolute w-6 h-6 bg-red-600 border-2 border-white rounded-full top-[80%] left-[25%] -translate-x-1/2 z-10 transition-all duration-1000" style={{ top: fase === 'animando' && eleccion === 'solo' ? '80%' : '80%', left: fase === 'animando' && eleccion === 'solo' ? '15%' : '25%' }}></div>

          {/* Manager atrapado en esquina (Usuario) */}
          <div className="absolute w-8 h-8 bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-white rounded-full flex items-center justify-center shadow-lg text-xs top-[75%] left-[15%] -translate-x-1/2 z-10 transition-all duration-1000" style={{ top: fase === 'animando' && eleccion === 'solo' ? '65%' : '75%', left: fase === 'animando' && eleccion === 'solo' ? '25%' : '15%' }}>
            🧠
          </div>

          {/* Balón */}
          <motion.div
            className="absolute w-4 h-4 bg-white border border-slate-300 rounded-full flex items-center justify-center text-[10px] z-20 shadow-xl"
            initial={{ top: '75%', left: '15%', x: '-50%', y: '-10px', scale: 1 }}
            animate={
              fase === 'animando' || fase === 'feedback' ?
                (eleccion === 'cambio' ? {
                  top: ['75%', '45%', '20%'],
                  left: ['15%', '50%', '85%'],
                  scale: [1, 2.8, 1], // Pase largo aéreo
                  transition: { duration: 1.5, ease: 'easeInOut' }
                } : eleccion === 'aguantar' ? {
                  top: ['75%', '72%', '78%', '75%'],
                  left: ['15%', '18%', '12%', '15%'],
                  scale: [1, 1, 1, 1],
                  transition: { duration: 1.5, ease: 'easeInOut' } // Se queda ahí mismo
                } : eleccion === 'solo' ? {
                  top: ['75%', '70%'],
                  left: ['15%', '25%'], // Lo chocan y pierde el balón
                  scale: [1, 1],
                  transition: { duration: 0.8, ease: 'easeOut' }
                } : {})
                : {}
            }
          >
            ⚽
          </motion.div>
        </div>
      </div>
    </div>
  );
};
