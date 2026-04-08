import React from 'react';
import Link from 'next/link';
import { jugadoresData } from '../../lib/jugadores';
import { Jugador } from './Jugador';

export const Cancha: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col flex-1 min-h-0 max-w-[95%] lg:max-w-[90%] mx-auto px-2 pb-2">
      {/* Leyenda minimalista integrada */}
      <div className="flex-none flex justify-center gap-4 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span>Ingeniería (Tú)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600 opacity-80"></div>
          <span>Bugs (Rival)</span>
        </div>
      </div>

      {/* Cancha horizontal (landscape) expansiva y auto-contenida */}
      <div className="flex-1 min-h-[0] w-full flex items-center justify-center overflow-hidden">
        <div className="relative aspect-video w-full max-h-full rounded-xl overflow-hidden border-[6px] sm:border-[8px] border-gray-900 bg-[#2b722d] shadow-2xl" 
             style={{ maxHeight: '100%', maxWidth: 'calc(100vh * 16 / 9)' }}>
          {/* Franjas de corte de césped profesional */}
          <div className="absolute inset-0 flex">
            {[...Array(14)].map((_, i) => (
               <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`} />
            ))}
          </div>

          {/* Línea central vertical */}
          <div className="absolute top-0 left-1/2 w-1 h-full bg-white/60 -translate-x-1/2"></div>
          
          {/* Círculo central */}
          <div className="absolute top-1/2 left-1/2 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white/60 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
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
        <div className="flex-none mt-2 flex flex-wrap justify-center items-center gap-3 px-2">
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
