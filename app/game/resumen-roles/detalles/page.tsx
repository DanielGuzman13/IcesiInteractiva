'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES = [
  {
    title: 'Product Owner',
    id: 'product-owner',
    description: 'El Product Owner profesional toma decisiones sobre qué construir primero y por qué eso importa para el negocio y para el usuario. Su función es convertir necesidades reales en prioridades claras para que el equipo no trabaje a ciegas. Su trabajo asegura que cada entrega tenga impacto real, y que el producto crezca con propósito. Ese enfoque en valor es lo que diferencia un proyecto ocupado de un producto exitoso.'
  },
  {
    title: 'Arquitecto',
    id: 'arquitecto',
    description: 'El Arquitecto de Software no solo hace diagramas: define la base del sistema para que sea claro, mantenible y escalable. Una buena arquitectura permite desarrollar más rápido, con menos errores y sin romper lo existente. En la industria es clave, porque una mala arquitectura cuesta tiempo y dinero. Su rol es anticipar problemas y transformar la complejidad en una estructura sólida.'
  },
  {
    title: 'Frontend Developer',
    id: 'frontend',
    description: 'El Frontend, debe pensar siempre en la persona que está al otro lado de la pantalla. Se construye la parte visible del producto, y el objetivo es que todo sea claro, rápido y fácil de usar. No se trata solo de que “se vea bonito”, sino de que cada botón, cada texto y cada interacción ayuden al usuario a lograr su objetivo sin frustración. El trabajo convierte la tecnología en algo realmente útil para las personas.'
  },
  {
    title: 'Backend Developer',
    id: 'backend',
    description: 'El Backend Developer, debe entender que es el motor oculto del sistema. El gestiona los datos, asegura la seguridad del servidor y construye la lógica que hace que todo funcione detrás de escena. Su misión es que la comunicación entre las partes sea fluida, escalable y protegida contra fallos. Un backend sólido permite que miles de usuarios se conecten sin problemas, y esa es la responsabilidad que debe asumir.'
  },
  {
    title: 'QA Engineer',
    id: 'qa',
    description: 'El QA/Tester debe entender muy bien cuál es su misión dentro del equipo. No solo busca errores: protege el producto y a los usuarios en cada cambio que se hace. Cuando hace esto correctamente, evitamos caídas del sistema, retrabajos innecesarios, pérdidas de tiempo, costos extras y molestias para los clientes. En la industria, eso vale muchísimo, porque un pequeño fallo puede afectar a miles de personas y dañar la confianza de la empresa en la que estes trabajando.'
  },
  {
    title: 'DevOps Engineer',
    id: 'devops',
    description: 'El DevOps, debe entender que conecta desarrollo con operación para que el software llegue a producción de forma segura y constante. Automatiza procesos, monitorea el sistema y responde rápido cuando algo falla. Eso significa que de la misma forma que ayudo a las aeronaves a circular por la pista de despliegue y todo fluya, el desarrollo de software puede sentirse igual.'
  },
  {
    title: 'Team Manager',
    id: 'team-manager',
    description: 'El Team Manager, no solo reparto tareas: yo alineo al equipo hacia una meta común y elimino bloqueos para que todos avancen. Mi trabajo es priorizar, coordinar y asegurar que cada persona aporte donde genera más valor. Cuando esto se hace bien, hay menos retrabajo, mejor comunicación y resultados más sólidos en menos tiempo. Mi rol convierte esfuerzo individual en rendimiento colectivo.'
  }
];

export default function DetallesRolesPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = React.useState<typeof ROLES[0] | null>(null);
  const [showIntroModal, setShowIntroModal] = React.useState(true);

  return (
    <main className="min-h-screen w-full max-w-full bg-[#F8FAFC] flex flex-col font-sans text-slate-900 border-t-[6px] border-indigo-600 overflow-x-hidden">
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        {/* Header Section */}
        <header className="text-center mb-8 flex-none">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-2 tracking-tight">
              Especialidades Técnicas
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium italic">
              Haz clic en cada rol para descubrir sus responsabilidades clave.
            </p>
          </motion.div>
        </header>

        {/* Roles Grid Section (Natural Browser Scroll) */}
        <div className="w-full">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 py-4 w-full h-fit max-w-6xl mx-auto">
            {ROLES.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setSelectedRole(role)}
                className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden flex flex-col group cursor-pointer hover:shadow-xl hover:border-indigo-200 transition-all duration-300 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-2rem)] xl:w-[calc(25%-2rem)] max-w-[280px] hover:-translate-y-2"
              >
                {/* Contenedor de Imagen */}
                <div className="aspect-[4/3] md:aspect-[4/5] bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={`/images/roles/${role.id}.png`}
                    alt={role.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600/10 backdrop-blur-[2px]">
                    <div className="bg-white rounded-full py-2 px-4 shadow-xl text-indigo-600 font-bold text-xs uppercase tracking-widest">
                      Ver detalle
                    </div>
                  </div>
                </div>

                {/* Título */}
                <div className="p-2 md:p-4 text-center bg-white flex-none flex items-center justify-center min-h-[40px] md:min-h-[70px]">
                  <h2 className="text-[10px] md:text-xl font-extrabold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">
                    {role.title}
                  </h2>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 mb-8 text-center"
        >
          <button
            onClick={() => router.push('/')}
            className="group relative inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-950 text-white font-black py-5 px-14 rounded-full transition-all shadow-2xl active:scale-95 text-xl tracking-tight overflow-hidden"
          >
            <span className="relative z-10">VOLVER A JUGAR</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </motion.footer>
      </div>

      {/* Intro Modal Overlay */}
      <AnimatePresence>
        {showIntroModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-indigo-900/40 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-sm overflow-hidden text-center p-10 border-b-[12px] border-indigo-600"
            >
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                💡
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">
                ¡Explora los roles!
              </h3>
              <p className="text-lg text-slate-600 mb-8 font-medium leading-relaxed">
                Puedes clickear en cualquier rol para saber más sobre sus funciones.
              </p>
              <button
                onClick={() => setShowIntroModal(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl transition-all shadow-lg active:scale-95"
              >
                ENTENDIDO
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description Modal Overlay */}
      <AnimatePresence>
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl overflow-hidden border-t-[10px] border-indigo-600"
            >
              <div className="p-10 md:p-14">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-indigo-600 font-extrabold uppercase tracking-widest text-sm">Descripción del Rol</span>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">{selectedRole.title}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedRole(null)} 
                    className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all text-2xl font-bold shadow-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-12 items-center mb-12">
                  <div className="flex-1 order-2 md:order-1">
                    <p className="text-xl md:text-2xl text-slate-700 font-medium leading-[1.6] tracking-tight text-justify">
                      {selectedRole.description}
                    </p>
                  </div>
                  
                  <div className="w-full md:w-[45%] aspect-square md:aspect-[4/5] bg-slate-100 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-inner order-1 md:order-2 group">
                    <img
                      src={`/images/roles/${selectedRole.id}.png`}
                      alt={selectedRole.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRole(null)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-2xl transition-all shadow-xl active:scale-95 text-xl tracking-wide border-b-4 border-indigo-800"
                >
                  ENTENDIDO
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
