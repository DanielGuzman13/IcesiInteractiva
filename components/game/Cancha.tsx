import React from 'react';
import Link from 'next/link';
import { jugadoresData } from '../../lib/jugadores';
import { Jugador } from './Jugador';

export const Cancha: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-2">
      {/* Leyenda */}
      <div className="flex justify-center gap-6 mb-4 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow"></div>
          <span className="text-gray-700">Equipo A (Tu equipo — clickeable)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow opacity-80"></div>
          <span className="text-gray-600">Equipo B (Rival — solo visual)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-white shadow"></div>
          <span className="text-gray-700">Capitán</span>
        </div>
      </div>

      {/* Cancha horizontal (landscape) */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
        <div className="absolute inset-0 bg-[#2E7D32] border-4 border-white overflow-hidden shadow-2xl rounded-lg">
          
          {/* Línea central vertical */}
          <div className="absolute top-0 left-1/2 w-1 h-full bg-white/60 -translate-x-1/2"></div>
          
          {/* Círculo central */}
          <div className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white/60 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white/90 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          {/* Área Penalty Izquierda (Portería A) */}
          <div className="absolute top-1/2 left-0 w-[13%] h-[55%] border-t-4 border-r-4 border-b-4 border-white/60 -translate-y-1/2 pointer-events-none"></div>
          {/* Área chica Izquierda */}
          <div className="absolute top-1/2 left-0 w-[6%] h-[30%] border-t-4 border-r-4 border-b-4 border-white/60 -translate-y-1/2 pointer-events-none"></div>
          
          {/* Área Penalty Derecha (Portería B) */}
          <div className="absolute top-1/2 right-0 w-[13%] h-[55%] border-t-4 border-l-4 border-b-4 border-white/60 -translate-y-1/2 pointer-events-none"></div>
          {/* Área chica Derecha */}
          <div className="absolute top-1/2 right-0 w-[6%] h-[30%] border-t-4 border-l-4 border-b-4 border-white/60 -translate-y-1/2 pointer-events-none"></div>

          {/* Jugadores dentro de la cancha */}
          {jugadoresData.filter(j => !j.fueraDeCampo).map(jugador => (
            <Jugador key={jugador.id} jugador={jugador} />
          ))}
        </div>
      </div>

      {/* Técnicos / Roles fuera de campo */}
      {jugadoresData.some(j => j.fueraDeCampo) && (
        <div className="mt-4 flex flex-wrap items-center gap-4 px-2">
          {jugadoresData.filter(j => j.fueraDeCampo).map(jugador => (
            jugador.ruta ? (
              <Link
                key={jugador.id}
                href={jugador.ruta}
                className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-400 transition-colors rounded-lg px-3 py-2 group cursor-pointer"
                title={`${jugador.rol} — Fuera de campo`}
              >
                <div className={`w-8 h-8 rounded-full ${jugador.color} border-2 border-white shadow flex items-center justify-center group-hover:scale-110 transition-transform`} />
                <div>
                  <div className="text-xs font-bold text-indigo-800">{jugador.rol}</div>
                  <div className="text-[10px] text-indigo-500">Arquitecto de Software</div>
                </div>
              </Link>
            ) : (
              <div
                key={jugador.id}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
              >
                <div className={`w-8 h-8 rounded-full ${jugador.color} border-2 border-white shadow`} />
                <div className="text-xs font-semibold text-gray-700">{jugador.rol}</div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};
