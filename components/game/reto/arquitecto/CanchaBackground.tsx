'use client';

const CanchaBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Fondo de cancha de fútbol */}
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

      {/* Contenedor principal que ocupa toda la pantalla */}
      <div className="relative z-10 h-full w-full flex items-center justify-center p-4">
        <div className="w-full h-full max-w-full max-h-full bg-white/50 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CanchaBackground;
