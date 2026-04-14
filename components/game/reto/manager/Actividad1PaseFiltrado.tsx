'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: (score: number) => void;
}

type OpcionPase = 'arriba' | 'pie' | 'ciegas' | null;

export const Actividad1PaseFiltrado = ({ onComplete }: Props) => {
  const [fase, setFase] = useState<'eleccion' | 'animando' | 'feedback'>('eleccion');
  const [eleccion, setEleccion] = useState<OpcionPase>(null);

  const manejarEleccion = (opcion: OpcionPase) => {
    setEleccion(opcion);
    setFase('animando');

    // Simulate animation duration then show feedback
    setTimeout(() => {
      setFase('feedback');
    }, 2000);
  };

  const opciones = [
    { id: 'arriba', label: 'Pase por Arriba', desc: 'Superar la línea de defensas', puntos: 100 },
    { id: 'pie', label: 'Pase al Pie', desc: 'Raso pero seguro', puntos: 50 },
    { id: 'ciegas', label: 'Pase sin Mirar', desc: 'Sorprender sin mirar hacia dónde', puntos: 0 },
  ];

  const opcionSeleccionada = opciones.find(o => o.id === eleccion);

  return (
    <div className="w-full relative">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">⚽ Actividad 1: El Pase Filtrado</h2>
          <p className="text-gray-600 mb-4">
            El &apos;10&apos; (Mediocampista (Team Manager)) tiene el balón en el centro del campo. Tienes un compañero buscando el espacio, pero hay <strong>tres defensas rivales</strong> bloqueando las líneas rasantes de pase. ¿Cómo le harás llegar el balón?
          </p>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
            <h3 className="font-semibold text-blue-800 mb-1">Misión:</h3>
            <p className="text-sm text-blue-700">El delantero azul te marca el desmarque, debes calcular la mejor intención para no perder el control.</p>
          </div>

          {fase === 'eleccion' && (
            <div className="space-y-3">
              {opciones.map((opc) => (
                <button
                  key={opc.id}
                  onClick={() => manejarEleccion(opc.id as OpcionPase)}
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
                {opcionSeleccionada.id === 'arriba' &&
                  <span>¡Asistencia de crack! Viste el hueco y mandaste el balón por donde nadie lo esperaba. <strong className="text-amber-700">(En el equipo, esto es elegir la mejor Arquitectura Técnica para saltar los problemas más difíciles)</strong>.</span>
                }
                {opcionSeleccionada.id === 'pie' &&
                  <span>Jugada segura. Mantuviste el balón pero obligaste a tu delantero a pelear contra tres defensas. <strong className="text-amber-700">(Elegiste una Solución Monolítica o simple; funciona, pero el equipo tendrá que trabajar el doble)</strong>.</span>
                }
                {opcionSeleccionada.id === 'ciegas' &&
                  <span>¡Balón perdido! Mandaste el pase a donde no había nadie. <strong className="text-amber-700">(No hubo Comunicación Técnica con los desarrolladores y nadie entendió cómo implementar la idea)</strong>.</span>
                }
              </p>
              <button
                onClick={() => onComplete(opcionSeleccionada.puntos)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-10 rounded-full transition-all shadow-md w-full sm:w-auto"
              >
                Siguiente jugada →
              </button>
            </div>
          )}
        </div>

        {/* Mini Cancha Visualización */}
        <div className="w-full md:w-2/5 aspect-[3/4] bg-green-600 border-4 border-white shadow-xl rounded-md relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '10% 10%' }}></div>

          {/* Compañero - Delantero Azul */}
          <div className="absolute w-8 h-8 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center font-bold text-white shadow-md text-xs top-10 left-1/2 -translate-x-1/2 z-10 transition-transform duration-1000" style={{ transform: fase !== 'eleccion' && eleccion !== 'ciegas' ? 'translate(-50%, -10px) scale(1.1)' : 'translate(-50%, 0)' }}>
            9
          </div>

          {/* Tres Defensas rivales cerrando */}
          <div className="absolute w-6 h-6 bg-red-600 border-2 border-white rounded-full top-[35%] left-[30%] -translate-x-1/2 z-10"></div>
          <div className="absolute w-6 h-6 bg-red-600 border-2 border-white rounded-full top-[30%] left-[50%] -translate-x-1/2 z-10"></div>
          <div className="absolute w-6 h-6 bg-red-600 border-2 border-white rounded-full top-[35%] left-[70%] -translate-x-1/2 z-10"></div>

          {/* Manager (Usuario) */}
          <div className="absolute w-8 h-8 bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-white rounded-full flex items-center justify-center shadow-lg text-xs top-[75%] left-1/2 -translate-x-1/2 z-10">
            🧠
          </div>

          {/* Balón */}
          <motion.div
            className="absolute w-4 h-4 bg-white border border-slate-300 rounded-full flex items-center justify-center text-[10px] z-20 shadow-xl"
            initial={{ top: '75%', left: '50%', x: '-50%', y: '-10px', scale: 1 }}
            animate={
              fase === 'animando' || fase === 'feedback' ?
                (eleccion === 'arriba' ? {
                  top: ['75%', '40%', '15%'],
                  left: ['50%', '50%', '50%'],
                  scale: [1, 2.5, 1], // El balón toma altura
                  transition: { duration: 1.5, ease: 'easeInOut' }
                } : eleccion === 'pie' ? {
                  top: ['75%', '50%', '35%'],
                  left: ['50%', '50%', '45%'], // Rebota en los defensas
                  scale: [1, 1, 1], // A ras de piso
                  transition: { duration: 1.5, ease: 'easeOut' }
                } : eleccion === 'ciegas' ? {
                  top: ['75%', '50%', '20%'],
                  left: ['50%', '80%', '90%'], // Se va hacia fuera
                  scale: [1, 1, 1],
                  transition: { duration: 1.5, ease: 'easeOut' }
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
