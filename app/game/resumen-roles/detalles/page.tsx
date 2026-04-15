'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES = [
  {
    title: 'Product Owner',
    id: 'product-owner',
    description: 'Define la visión del producto, prioriza los requerimientos y asegura que el equipo genere el máximo valor para el usuario final.'
  },
  {
    title: 'Arquitecto',
    id: 'arquitecto',
    description: 'Diseña la estructura técnica de alto nivel, asegura la escalabilidad y toma decisiones críticas sobre las tecnologías a utilizar.'
  },
  {
    title: 'Frontend Developer',
    id: 'frontend',
    description: 'Se encarga de la interfaz y la experiencia del usuario, traduciendo el diseño en código interactivo y funcional.'
  },
  {
    title: 'Backend Developer',
    id: 'backend',
    description: 'Implementa la lógica del lado del servidor, gestiona la base de datos y garantiza que la comunicación de datos sea fluida y segura.'
  },
  {
    title: 'QA Engineer',
    id: 'qa',
    description: 'Realiza pruebas exhaustivas para asegurar que el sistema esté libre de errores y cumpla con los estándares de calidad definidos.'
  },
  {
    title: 'DevOps Engineer',
    id: 'devops',
    description: 'Gestiona la infraestructura, automatiza los despliegues y asegura que el ciclo de vida del desarrollo sea ágil y eficiente.'
  },
  {
    title: 'Team Manager',
    id: 'team-manager',
    description: 'Lidera y coordina al equipo, gestiona el talento y asegura que los objetivos del proyecto se cumplan en tiempo y forma.'
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border-t-8 border-indigo-500"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Descripción del Rol</span>
                    <h3 className="text-3xl font-black text-slate-800">{selectedRole.title}</h3>
                  </div>
                  <button onClick={() => setSelectedRole(null)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">✕</button>
                </div>

                <div className="aspect-video bg-slate-100 rounded-2xl mb-6 overflow-hidden border border-slate-100">
                  <img
                    src={`/images/roles/${selectedRole.id}.png`}
                    alt={selectedRole.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-xl text-slate-700 mb-8 font-medium leading-relaxed">
                  {selectedRole.description}
                </p>

                <button
                  onClick={() => setSelectedRole(null)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
