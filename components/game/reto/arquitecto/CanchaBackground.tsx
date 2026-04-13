'use client';

const CanchaBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl">
      {/* Fondo de cancha de fútbol - ahora relativo al contenedor padre */}
      <div className="absolute inset-0 bg-[#2b722c]">
        {/* Franjas de corte de césped profesional */}
        <div className="absolute inset-0 flex">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`} />
          ))}
        </div>

        {/* Línea central vertical */}
        <div className="absolute top-0 left-1/2 w-1 h-full bg-white/60 -translate-x-1/2"></div>

        {/* Círculo central */}
        <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full border-4 border-white/60 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white/90 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        {/* Áreas de penalty */}
        <div className="absolute top-1/2 left-0 w-[15%] h-[60%] border-t-4 border-r-4 border-b-4 border-white/60 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-[15%] h-[60%] border-t-4 border-l-4 border-b-4 border-white/60 -translate-y-1/2 pointer-events-none"></div>

        {/* Áreas chicas */}
        <div className="absolute top-1/2 left-0 w-[7%] h-[35%] border-t-4 border-r-4 border-b-4 border-white/60 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-[7%] h-[35%] border-t-4 border-l-4 border-b-4 border-white/60 -translate-y-1/2 pointer-events-none"></div>
      </div>

      {/* Contenedor de contenido - ahora se ajusta al padre sin forzar pantalla completa */}
      <div className="relative z-10 h-full w-full p-3">
        <div className="w-full h-full min-h-[480px] bg-white/60 backdrop-blur-sm rounded-xl shadow-xl p-3 sm:p-4 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CanchaBackground;
