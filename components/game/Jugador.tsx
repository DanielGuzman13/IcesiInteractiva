import React from 'react';
import Link from 'next/link';
import { JugadorType } from '../../lib/jugadores';

interface JugadorProps {
  jugador: JugadorType;
}

export const Jugador: React.FC<JugadorProps> = ({ jugador }) => {
  const isEquipoA = jugador.equipo === 'A';

  const content = (
    <div className="flex flex-col items-center justify-center relative translate-y-3 cursor-pointer">
      <div className="relative">
        <div
          className={`relative transition-transform flex items-center justify-center
            ${jugador.ruta ? 'group-hover:scale-110' : 'cursor-default'}
            ${jugador.imagen ? 'w-14 h-14 sm:w-16 sm:h-16 shadow-none' : 'w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 shadow-lg box-border'}
            ${!jugador.imagen && isEquipoA ? 'border-blue-400 shadow-blue-500/30' : ''}
            ${!jugador.imagen && !isEquipoA ? 'border-red-400 opacity-80' : ''}
            ${!jugador.imagen && jugador.ruta ? 'group-hover:border-yellow-400 group-hover:shadow-yellow-400/50' : ''}`}
        >
          {jugador.imagen ? (
            <img 
              src={jugador.imagen} 
              alt={jugador.rol} 
              className="w-full h-full object-contain filter drop-shadow-md" 
            />
          ) : (
            <div className={`w-full h-full ${jugador.color}`} />
          )}
        </div>

        {/* Badge Capitán estético y no intrusivo */}
        {jugador.esCapitan && (
          <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 border border-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black z-20 shadow-md">
            C
          </div>
        )}
      </div>

      {/* Etiqueta de nombre estilizada estilo manager game */}
      <div className="mt-1 bg-black text-white px-2.5 py-1 rounded shadow-lg text-[11px] sm:text-xs font-black tracking-wide whitespace-nowrap border border-white/40 z-30 shadow-black/50">
        {jugador.rol.toUpperCase()}
      </div>
    </div>
  );

  if (jugador.ruta) {
    return (
      <Link
        href={jugador.ruta}
        className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
        style={{ top: jugador.posicion.top, left: jugador.posicion.left }}
        title={`Equipo A - ${jugador.rol}`}
      >
        {content}
      </Link>
    );
  }

  // Equipo B: solo visual, no clickeable
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ top: jugador.posicion.top, left: jugador.posicion.left }}
      title="Equipo Rival"
    >
      {content}
    </div>
  );
};
