import React from 'react';
import Link from 'next/link';
import { JugadorType } from '../../lib/jugadores';

interface JugadorProps {
  jugador: JugadorType;
}

export const Jugador: React.FC<JugadorProps> = ({ jugador }) => {
  const content = (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div
          className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-[9px] font-bold text-white border-2 ${jugador.esCapitan ? 'border-yellow-400' : 'border-white'} ${jugador.color} ${jugador.ruta ? 'group-hover:scale-110 transition-transform' : 'opacity-80 cursor-default'}`}
        >
          {jugador.ruta && (
            <span className="hidden group-hover:block text-[7px]">VER</span>
          )}
        </div>

        {/* Badge Capitán */}
        {jugador.esCapitan && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 border border-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black z-20 shadow">
            C
          </div>
        )}
      </div>

      {/* Etiqueta de nombre */}
      <div className="mt-1 bg-white/95 px-1.5 py-0.5 rounded shadow text-[9px] font-semibold text-gray-800 whitespace-nowrap border border-gray-200">
        {jugador.rol === 'Rival' ? (
          <span className="text-red-700 italic">Rival</span>
        ) : (
          jugador.rol
        )}
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
