'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { jugadoresData } from '../../../lib/jugadores';
import { useGamePersistence } from '../../../hooks/useGamePersistence';
import { AnimatePresence } from 'framer-motion';

const ROLES = [
  { title: 'Product Owner', id: 'product-owner' },
  { title: 'Arquitecto', id: 'arquitecto' },
  { title: 'Frontend Developer', id: 'frontend' },
  { title: 'Backend Developer', id: 'backend' },
  { title: 'QA/Tester', id: 'qa' },
  { title: 'DevOps Engineer', id: 'devops' },
  { title: 'Team Manager', id: 'team-manager' }
];

export default function ResumenRolesPage() {
  const router = useRouter();
  const { userId, saveAnswer } = useGamePersistence();
  const [selectedRole, setSelectedRole] = React.useState<typeof ROLES[0] | null>(null);
  const [feedback, setFeedback] = React.useState('');
  const [answeredRoles, setAnsweredRoles] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showFinalize, setShowFinalize] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [showIntroModal, setShowIntroModal] = React.useState(true);

  // Cargar respuestas previas para evitar duplicados
  React.useEffect(() => {
    if (userId) {
      fetch(`/api/answers?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.answers) {
            const roles = data.answers
              .filter((ans: any) => ans.challengeId.startsWith('role-feedback-'))
              .map((ans: any) => ans.challengeId.replace('role-feedback-', ''));
            setAnsweredRoles(roles);
            if (roles.length > 0) {
              setShowFinalize(true);
              setShowIntroModal(false); // No mostrar intro si ya respondió
            }
          }
        })
        .catch(err => console.error('Error fetching answers:', err));
    }
  }, [userId]);

  const hasAnyAnswer = answeredRoles.length > 0;

  const handleSubmitFeedback = async () => {
    if (!selectedRole || !feedback.trim() || isSubmitting || hasAnyAnswer) return;

    setIsSubmitting(true);
    try {
      const challengeId = `role-feedback-${selectedRole.id}`;
      await saveAnswer(challengeId, { response: feedback }, true, 0);

      setAnsweredRoles([selectedRole.id]);
      setSelectedRole(null);
      setFeedback('');
      setShowFinalize(true);

      // Mostrar aviso de éxito en lugar de redirección inmediata
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saving feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full max-w-full bg-[#F8FAFC] flex flex-col font-sans text-slate-900 border-t-[6px] border-blue-600 overflow-x-hidden"
    >
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        {/* Header Section (Compact) */}
        <header className="text-center mb-8 flex-none">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-2 tracking-tight">
              Siguiente Paso
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium italic">
              {hasAnyAnswer
                ? "Gracias por tu opinión. Ahora puedes explorar los detalles de cada rol."
                : "Escoge el rol que más te llamó la atención (solo puedes elegir uno)."}
            </p>
          </motion.div>
        </header>

        {/* Roles Grid Section (Natural Browser Scroll) */}
        <div className="w-full">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 py-4 w-full h-fit max-w-6xl mx-auto">
            {ROLES.map((role, index) => {
              const isThisAnswered = answeredRoles.includes(role.id);
              
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => !hasAnyAnswer && setSelectedRole(role)}
                  className={`bg-white rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden flex flex-col group transition-all duration-300 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-2rem)] xl:w-[calc(25%-2rem)] max-w-[280px] ${hasAnyAnswer
                    ? isThisAnswered ? 'ring-4 ring-blue-500 shadow-xl' : 'opacity-40 grayscale cursor-default'
                    : 'cursor-pointer hover:shadow-xl hover:border-blue-200 hover:-translate-y-2'
                    }`}
                >
                  {/* Contenedor de Imagen (Adaptable) */}
                  <div className="aspect-[4/3] md:aspect-[4/5] bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    {isThisAnswered && (
                      <div className="absolute inset-0 bg-blue-600/20 z-10 flex items-center justify-center">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white rounded-full p-3 shadow-2xl">
                          <span className="text-2xl md:text-4xl">⭐</span>
                        </motion.div>
                      </div>
                    )}

                    <img
                      src={`/images/roles/${role.id}.png`}
                      alt={role.title}
                      className="w-full h-full object-cover"
                    />

                    {!isThisAnswered && (
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    )}
                  </div>

                  {/* Título (Compacto) */}
                  <div className="p-2 md:p-4 text-center bg-white flex-none flex items-center justify-center min-h-[40px] md:min-h-[70px]">
                    <h2 className="text-[10px] md:text-xl font-extrabold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
                      {role.title}
                    </h2>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feedback Modal Overlay */}
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border-t-8 border-blue-500"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Feedback del Rol</span>
                    <h3 className="text-3xl font-black text-slate-800">{selectedRole.title}</h3>
                  </div>
                  <button onClick={() => setSelectedRole(null)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">✕</button>
                </div>

                <p className="text-lg text-slate-600 mb-6 font-medium">
                  ¿Qué fue lo que más te gustó de este rol?
                </p>

                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Escribe tu opinión aquí..."
                  className="w-full h-40 p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-colors text-slate-700 font-medium resize-none bg-slate-50"
                />

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!feedback.trim() || isSubmitting}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Respuesta'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro Modal Overlay */}
      <AnimatePresence>
        {showIntroModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="fixed inset-0 z-[300] bg-blue-900/40 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300, delay: 1.0 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden text-center p-10 border-b-[12px] border-blue-600"
            >
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
                👋
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-6 leading-tight">
                ¡Bienvenido!
              </h3>
              <p className="text-xl text-slate-600 mb-10 font-medium leading-relaxed">
                Estás en una página donde debes seleccionar solo uno de los roles, específicamente el que más te guste.
              </p>
              <button
                onClick={() => setShowIntroModal(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-2xl transition-all shadow-xl shadow-blue-200 active:scale-95 text-lg"
              >
                ENTENDIDO
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-blue-900/40 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden text-center p-10 border-b-[12px] border-blue-600"
            >
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse text-4xl">
                🚀
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-6 leading-tight">
                ¡Excelente elección!
              </h3>
              <p className="text-xl text-slate-600 mb-10 font-medium leading-relaxed">
                Muy bien, ahora podrás darle clic a todos los roles para ver en qué consiste cada uno.
              </p>
              <button
                onClick={() => router.push('/game/resumen-roles/detalles')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-2xl transition-all shadow-xl shadow-blue-200 active:scale-95 text-lg"
              >
                CONTINUAR
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
