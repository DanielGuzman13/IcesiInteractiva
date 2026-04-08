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
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center border-2 shadow-lg transition-transform box-border
            ${jugador.ruta ? 'group-hover:scale-110 group-hover:border-yellow-400 group-hover:shadow-yellow-400/50' : 'cursor-default'}
            ${isEquipoA ? 'border-blue-400 shadow-blue-500/30' : 'border-red-400 opacity-80'}`}
        >
          {jugador.imagen ? (
            <img src={jugador.imagen} alt={jugador.rol} className="w-full h-full object-cover" />
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
      <div className="mt-1 bg-gray-900/90 text-white px-2 py-0.5 rounded shadow text-[9px] sm:text-[10px] font-bold whitespace-nowrap border border-white/20 z-30">
        {jugador.rol}
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
