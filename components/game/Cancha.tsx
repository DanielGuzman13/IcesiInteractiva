'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jugadoresData } from '../../lib/jugadores';
import { Jugador } from './Jugador';
import { Actividad1TiroLibre } from './reto/ProductOwner/Actividad1TiroLibre';
import { Actividad2Salida } from './reto/ProductOwner/Actividad2Salida';
import { Actividad1BloqueoAngulo } from './reto/qa/Actividad1BloqueoAngulo';
import { Actividad2DespejeSeg } from './reto/qa/Actividad2DespejeSeg';

// Tipos requeridos
type GameFlowState = 
  | 'init'
  | 'pre_kickoff'
  | 'kickoff_anim'
  | 'po_act1_intro' 
  | 'po_act1_frozen'
  | 'po_act1_resolving'
  | 'po_act1_fail_reset'
  | 'po_act2_walk'
  | 'po_act2_frozen'
  | 'po_act2_resolving'
  | 'qa_act1_intro'
  | 'qa_act1_frozen'
  | 'qa_act1_resolving'
  | 'qa_act2_intro'
  | 'qa_act2_frozen'
  | 'qa_act2_resolving'
  | 'po_done' // Usado si carga y todo está listo, podemos saltar a qa_done o al siguiente
  | 'qa_done'
  | 'next_roles';

// Opciones originales removidas porque ahora se usan los componentes completos

export const Cancha: React.FC = () => {
  const [gameState, setGameState] = useState<GameFlowState>('init');
  const [goals, setGoals] = useState({ a: 0, b: 0 });
  const [totalScore, setTotalScore] = useState(0);

  // Animaciones estado global
  const [ballParams, setBallParams] = useState({ top: '50%', left: '50%', scale: 1, text: '⚽' });
  const [poPos, setPoPos] = useState({ top: '50%', left: '5%' }); // Portero
  const [showFlash, setShowFlash] = useState(false);
  
  // Feedback Data
  const [feedback, setFeedback] = useState<{show: boolean, msg: string, score: number, ok: boolean}>({show: false, msg: '', score: 0, ok: true});
  
  // Storage logic
  const [pre, setPre] = useState('guest');

  // Helper para buscar posición de jugadores
  const getJugadorPos = (id: string, defLeft = '50%') => {
    return jugadoresData.find(j => j.id === id)?.posicion || { top: '50%', left: defLeft };
  };

  useEffect(() => {
    const val = localStorage.getItem('currentPlayer') || 'guest';
    setPre(val);

    // Revisar si PO ya fue completado alguna vez para reanudar desde ahí o no
    const p = JSON.parse(localStorage.getItem(`${val}_po_answers`) || '{}');
    if (p.actividad1?.score !== undefined && p.actividad2?.score !== undefined) {
      setGameState('po_done');
      // Set results
      let ga = 0, gb = 0, ts = 0;
      ts += (p.actividad1.score + p.actividad2.score);
      if (ts > 0) ga++; else gb++;
      setGoals({ a: ga, b: gb });
      setTotalScore(ts);
      
      const lastPlayer = getJugadorPos('a-defensa-central-1');
      setBallParams({ top: lastPlayer.top, left: lastPlayer.left, scale: 1, text: '⚽' });
      setGameState('next_roles'); // Pasa al siguiente o se queda en idle
    } else {
      // Comenzar la secuencia de PO
      setGameState('pre_kickoff');
      setBallParams({ top: '50%', left: '50%', scale: 1, text: '⚽' });
    }
  }, []);

  // KICK-OFF MOVIE
  const handleKickoff = () => {
    setGameState('kickoff_anim');
    
    // Pase a Backend
    const back = getJugadorPos('a-medio-centro-2');
    setTimeout(() => setBallParams({ top: back.top, left: back.left, scale: 1, text: '⚽' }), 500);

    // Pase a Manager
    const man = getJugadorPos('a-volante-ofensivo');
    setTimeout(() => setBallParams({ top: man.top, left: man.left, scale: 1, text: '⚽' }), 1200);

    // Pase a Frontend
    const front = getJugadorPos('a-delantero-1');
    setTimeout(() => setBallParams({ top: front.top, left: front.left, scale: 1, text: '⚽' }), 1900);

    // Robo Rival y corre al centro
    const rival = getJugadorPos('b-delantero-1');
    setTimeout(() => {
      setBallParams({ top: rival.top, left: rival.left, scale: 1.2, text: '⚽' });
      setTimeout(() => {
         // Rival corre a cobrar tiro libre en el centro-izq
         setBallParams({ top: '40%', left: '40%', scale: 1.2, text: '⚽' });
         setTimeout(() => startAct1(), 1000); // Lanza la primera actividad
      }, 700);
    }, 2600);
  };

  // SECUENCIA 1: Tiro Libre
  const startAct1 = () => {
    setGameState('po_act1_intro');
    const rivalObj = getJugadorPos('b-delantero-1', '50%');

    // Anima el balón viajando hacia el arco y lo "congela" a medio camino
    setTimeout(() => {
      // Punto medio
      const destTop = `calc((${rivalObj.top} + 50%) / 2)`;
      const destLeft = `calc((${rivalObj.left} + 5%) / 2)`;
      setBallParams({ top: destTop, left: destLeft, scale: 2, text: '⚽' });
      
      setTimeout(() => {
        setGameState('po_act1_frozen'); // Freeze Frame 1
      }, 500); 
    }, 1000);
  };

  const handleAct1Choice = (score: number) => {
    setGameState('po_act1_resolving');
    
    const ans = JSON.parse(localStorage.getItem(`${pre}_po_answers`) || '{}');
    ans['actividad1'] = { score: score };
    localStorage.setItem(`${pre}_po_answers`, JSON.stringify(ans));

    setTotalScore(prev => prev + score);

    if (score > 0) {
      // Exito: Portero atrapa
      setBallParams({ top: '50%', left: '5%', scale: 1, text: '⚽' });
      setFeedback({ show: true, msg: '¡Balón atrapado! Riesgo contenido.', score: score, ok: true });
      
      setTimeout(() => {
        setFeedback(f => ({...f, show: false}));
        startAct2Transition();
      }, 3000);
    } else {
      // Fallo: Gol rival
      setBallParams({ top: '50%', left: '0%', scale: 1.5, text: '⚽' }); // Entra al arco rojo
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 500);
      setGoals(g => ({...g, b: g.b + 1}));
      
      setFeedback({ show: true, msg: '¡Gol en contra! Repitiendo saque de centro.', score: 0, ok: false });
      
      setTimeout(() => {
        setFeedback(f => ({...f, show: false}));
        setGameState('pre_kickoff'); // Regresa al kickoff
        setBallParams({ top: '50%', left: '50%', scale: 1, text: '⚽' });
      }, 4000);
    }
  };

  // SECUENCIA 2: Transición fluida
  const [cameraScale, setCameraScale] = useState(1.1);

  const startAct2Transition = () => {
    setGameState('po_act2_walk');
    // Portero camina con balón
    setPoPos({ top: '50%', left: '16%' }); // Borde del área
    setBallParams({ top: '50%', left: '16%', scale: 1, text: '⚽' });
    setCameraScale(1); // Zoom OUT

    // Pasan 10 min imaginarios
    setTimeout(() => {
       setGameState('po_act2_frozen'); // Freeze Frame 2
    }, 1500);
  };

  const handleAct2Choice = (score: number) => {
    setGameState('po_act2_resolving');
    
    const ans = JSON.parse(localStorage.getItem(`${pre}_po_answers`) || '{}');
    ans['actividad2'] = { score: score };
    localStorage.setItem(`${pre}_po_answers`, JSON.stringify(ans));

    setTotalScore(prev => prev + score);

    // Selecciona el target según el score de Actividad2
    // En Actividad2Salida.tsx: Corto/Central = 30pts, Medio = 15pts, Largo = 5pts
    let optId = 'corto';
    if (score === 15) optId = 'medio';
    if (score === 5) optId = 'largo';

    const targetIdMap: Record<string, string> = {
       'corto': 'a-defensa-central-1', // SIEMPRE OBLIGAMOS A QUE LE CAIGA AL QA SEGUN PROM.MD
       'medio': 'a-defensa-central-1',
       'largo': 'a-defensa-central-1'
    };

    // Animación física del pase al QA
    const target = getJugadorPos(targetIdMap[optId]);
    setBallParams({ top: target.top, left: target.left, scale: optId === 'largo' ? 2 : 1, text: '⚽' });

    setFeedback({ show: true, msg: `Pase de salida ejecutado con éxito.`, score: score, ok: true });

    setTimeout(() => {
      // El balón aterriza
      setBallParams({ top: target.top, left: target.left, scale: 1, text: '⚽' });
      // Goles azules (Opcional, suma goles)
      setGoals(g => ({...g, a: g.a + 1}));
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 500);

      setTimeout(() => {
        setFeedback({ show: true, msg: 'El PO ha validado la entrada; ahora el sistema entra en fase de pruebas. El balón le cae al QA, quien debe asegurar que el ataque rival no encuentre vulnerabilidades.', score: 0, ok: true });
        
        setTimeout(() => {
           setFeedback(f => ({...f, show: false}));
           startQaAct1(); // Arranca QA
        }, 5000); // 5 segundos para que lean la narrativa de transición
      }, 2500);
    }, 1000);
  };

  // SECUENCIA QA: Actividad 1
  const startQaAct1 = () => {
    setGameState('qa_act1_intro');
    // Animación de un rival presionando alto al QA
    const qa = getJugadorPos('a-defensa-central-1');
    const rivalObj = getJugadorPos('b-delantero-2', '45%'); // rival cerca
    
    // Mover un poco al rival hacia el QA
    setTimeout(() => {
       setGameState('qa_act1_frozen');
    }, 1200);
  };

  const handleQaAct1Choice = (score: number) => {
    setGameState('qa_act1_resolving');

    const ans = JSON.parse(localStorage.getItem(`${pre}_qa_answers`) || '{}');
    ans['actividad1'] = { score: score };
    localStorage.setItem(`${pre}_qa_answers`, JSON.stringify(ans));

    setTotalScore(prev => prev + score);

    if (score > 0) {
      setFeedback({ show: true, msg: '¡Smoke Test superado! Amenaza inicial controlada.', score: score, ok: true });
      setTimeout(() => {
        setFeedback(f => ({...f, show: false}));
        startQaAct2(); 
      }, 3000);
    } else {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 500);
      setGoals(g => ({...g, b: g.b + 1}));
      
      setFeedback({ show: true, msg: '¡Pipeline de defensa roto! El Bug se ha filtrado a producción. Reiniciando bloque de pruebas...', score: 0, ok: false });
      
      setTimeout(() => {
        setFeedback(f => ({...f, show: false}));
        startQaAct1(); 
      }, 4500);
    }
  };

  const startQaAct2 = () => {
    setGameState('qa_act2_intro');
    // Animacion Regression testing
    setTimeout(() => {
      setGameState('qa_act2_frozen');
    }, 1000);
  };

  const handleQaAct2Choice = (score: number) => {
    setGameState('qa_act2_resolving');

    const ans = JSON.parse(localStorage.getItem(`${pre}_qa_answers`) || '{}');
    ans['actividad2'] = { score: score };
    localStorage.setItem(`${pre}_qa_answers`, JSON.stringify(ans));

    setTotalScore(prev => prev + score);

    if (score > 0) {
      setFeedback({ show: true, msg: '¡Regression Testing exitoso! Defensa estable.', score: score, ok: true });
      setTimeout(() => {
        setFeedback(f => ({...f, show: false}));
        
        // El QA levanta la cabeza y pasa al developer
        const developer = getJugadorPos('a-medio-centro-1');
        setBallParams({ top: developer.top, left: developer.left, scale: 1, text: '⚽' });
        
        setFeedback({ show: true, msg: 'El QA limpia la jugada y entrega el balón al Developer (Mediocampista) para iniciar la construcción.', score: 0, ok: true });
        setTimeout(() => {
           setFeedback(f => ({...f, show: false}));
           setGameState('qa_done');
        }, 4000);

      }, 3000);
    } else {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 500);
      setGoals(g => ({...g, b: g.b + 1}));
      
      setFeedback({ show: true, msg: '¡Defensa Inestable ante el parche! El regresivo falló y regalaste un contraataque.', score: 0, ok: false });
      
      setTimeout(() => {
        setFeedback(f => ({...f, show: false}));
        startQaAct2(); 
      }, 4000);
    }
  };

  return (
    <div className="w-full h-full flex flex-col flex-1 min-h-[0] max-w-[95%] lg:max-w-[90%] mx-auto px-2 pb-2">
      
      <AnimatePresence>
        {showFlash && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white z-[9999] pointer-events-none" />
        )}
      </AnimatePresence>

      <div className="flex-none flex justify-center mb-1 text-sm font-black tracking-wider transition-colors duration-500" style={{ color: gameState.includes('po_act2') ? '#ef4444' : '#374151' }}>
         MINUTO: {gameState === 'pre_kickoff' || gameState === 'kickoff_anim' ? "00:00" : gameState.includes('act1') ? "15:00" : gameState.includes('act2') ? "15:00 ⏩ 15:10" : "30:00"}
      </div>

      <div className="flex-none flex justify-between px-6 mb-2">
         <div className="flex bg-blue-900 border-2 border-blue-500 rounded-lg overflow-hidden shadow-xl text-white font-mono font-black text-xl">
           <div className="px-4 py-1 bg-blue-700">AZUL</div>
           <div className="px-4 py-1 bg-black">{goals.a} - {goals.b}</div>
           <div className="px-4 py-1 bg-red-700">ROJO</div>
         </div>
      </div>

      <div className="flex-1 min-h-[0] w-full flex flex-col items-center justify-center overflow-hidden relative">
        <motion.div 
             animate={{ scale: gameState === 'pre_kickoff' || gameState === 'po_act1_frozen' ? 1.05 : cameraScale }}
             transition={{ duration: 1.5, type: 'spring' }}
             className="relative aspect-video w-full max-h-full rounded-xl overflow-hidden border-[6px] sm:border-[8px] border-gray-900 bg-[#2b722d] shadow-2xl" 
             style={{ maxHeight: '100%', maxWidth: 'calc(100vh * 16 / 9)' }}>
          
          <div className="absolute inset-0 flex">
            {[...Array(14)].map((_, i) => (
               <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`} />
            ))}
          </div>
          
          {/* Cancha decor */}
          <div className="absolute top-0 left-1/2 w-1 h-full bg-white/60 -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-0 w-[13%] h-[55%] border-t-4 border-r-4 border-b-4 border-white/60 -translate-y-1/2 pointer-events-none"></div>

          {/* Jugadores y Zona Técnica */}
          {jugadoresData.map(jugador => {
             let isTarget = false;
             let isDimmed = false;
             let top = jugador.posicion.top;
             let left = jugador.posicion.left;

             // Modificaciones especiales de estado
             if (jugador.id === 'a-portero') {
                top = poPos.top;
                left = poPos.left;
             }

             if (gameState === 'po_act2_frozen') {
               // En Reto 2, obligamos el pase al QA iluminando a los 3 pero la logica dirige todo a QA
               if (['a-defensa-central-1', 'a-lateral-derecho', 'a-delantero-2'].includes(jugador.id)) {
                 isTarget = true;
               } else if (jugador.equipo === 'B') {
                 // Rivales hacen sombra
                  top = `calc(${jugador.posicion.top} + ${Math.random()*4-2}%)`;
                  left = `calc(${jugador.posicion.left} - 5%)`;
               } else {
                 isDimmed = true;
               }
             }

             if (gameState.includes('qa_act1')) {
                if (jugador.id === 'b-delantero-2') {
                    // Presion alta sobre qa (Central)
                    top = 'calc(50% + 5%)';
                    left = 'calc(18% + 5%)'; 
                }
             }
             if (gameState === 'qa_act1_frozen' || gameState === 'qa_act2_frozen') {
                if (jugador.id === 'a-defensa-central-1') isTarget = true;
                else isDimmed = true;
             }

             // Ajuste para la Zona Técnica (Fuera de la Cancha)
             if (jugador.fueraDeCampo) {
               top = '92%'; // Posición cerca del borde inferior
               left = '50%'; // Centro
             }

             return (
               <motion.div key={jugador.id} 
                  animate={{ top, left, opacity: isDimmed ? 0.3 : 1 }}
                  transition={{ duration: 1.5, type: 'spring' }}
                  className="absolute" style={{ transform: 'translate(-50%, -50%)', zIndex: isTarget ? 50 : 10 }}
               >
                 <div className="relative flex flex-col items-center">
                    {isTarget && (
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-60 z-[-1]" />
                    )}
                    {/* Indicador de Zona Técnica justo debajo del jugador si está fuera del campo */}
                    {jugador.fueraDeCampo && (
                      <div className="absolute top-10 whitespace-nowrap text-[10px] font-black text-white/70 tracking-widest bg-black/40 px-2 py-0.5 rounded border border-white/20">
                        ZONA TÉCNICA
                      </div>
                    )}
                    {/* Render estricto del visual */}
                    <div className="pointer-events-none">
                       <Jugador jugador={jugador} />
                    </div>
                 </div>
               </motion.div>
             );
          })}

          <motion.div 
            className="absolute z-50 text-2xl sm:text-3xl pointer-events-none"
            animate={{ top: ballParams.top, left: ballParams.left, scale: ballParams.scale, rotate: gameState.includes('resolving') || gameState === 'kickoff_anim' ? 360 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            {ballParams.text}
          </motion.div>
          
          {/* Capas de Interfaz (Overlays de Modales) */}
          <AnimatePresence>
            {/* INICIO PARTIDO BTN */}
            {gameState === 'pre_kickoff' && (
              <motion.button 
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                onClick={handleKickoff}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] bg-emerald-500 hover:bg-emerald-600 border-4 border-white text-white font-black px-6 py-6 rounded-full shadow-2xl transition hover:scale-110 active:scale-95"
              >
                ⚽ INICIAR PARTIDO
              </motion.button>
            )}

            {/* Actividad 1 - El Grito de la Barrera OVERLAY */}
            {gameState === 'po_act1_frozen' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
              >
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-blue-500">
                  <div className="bg-blue-600 px-4 py-3 text-white flex justify-between items-center shadow">
                    <h2 className="font-black text-xl">🔥 ¡RETO ACTIVADO: GESTIÓN DE RIESGOS!</h2>
                    <span className="text-sm bg-black/30 px-3 py-1 rounded-full border border-white/20">Jugador: Product Owner</span>
                  </div>
                  <div className="h-[75vh] min-h-[500px] overflow-y-auto bg-green-50 relative">
                     <Actividad1TiroLibre onComplete={handleAct1Choice} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actividad 2 - Salida OVERLAY */}
            {gameState === 'po_act2_frozen' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
              >
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-green-500">
                  <div className="bg-green-600 px-4 py-3 text-white flex justify-between items-center shadow">
                    <h2 className="font-black text-xl">🎯 ¡RETO ACTIVADO: DIRECCIÓN DE SALIDA!</h2>
                    <span className="text-sm bg-black/30 px-3 py-1 rounded-full border border-white/20">Jugador: Product Owner</span>
                  </div>
                  <div className="h-[75vh] min-h-[500px] overflow-y-auto bg-green-50 relative">
                     <Actividad2Salida onComplete={handleAct2Choice} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* QA Actividad 1 - Smoke Test OVERLAY */}
            {gameState === 'qa_act1_frozen' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
              >
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-blue-600">
                  <div className="bg-blue-700 px-4 py-3 text-white flex justify-between items-center shadow">
                    <h2 className="font-black text-xl">🛡️ ¡SMOKE TEST: BLOQUEO RÁPIDO!</h2>
                    <span className="text-sm bg-black/30 px-3 py-1 rounded-full border border-white/20">Jugador: QA</span>
                  </div>
                  <div className="h-[75vh] min-h-[500px] overflow-y-auto bg-blue-50 relative">
                     <Actividad1BloqueoAngulo onComplete={handleQaAct1Choice} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* QA Actividad 2 - Regression Testing OVERLAY */}
            {gameState === 'qa_act2_frozen' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
              >
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-teal-600">
                  <div className="bg-teal-700 px-4 py-3 text-white flex justify-between items-center shadow">
                    <h2 className="font-black text-xl">🧹 ¡REGRESSION TESTING: DESPEJE ESTABLE!</h2>
                    <span className="text-sm bg-black/30 px-3 py-1 rounded-full border border-white/20">Jugador: QA</span>
                  </div>
                  <div className="h-[75vh] min-h-[500px] overflow-y-auto bg-teal-50 relative">
                     <Actividad2DespejeSeg onComplete={handleQaAct2Choice} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Feedback Popups */}
            {feedback.show && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-2xl shadow-2xl border-4 z-[200] text-center ${feedback.ok ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}
              >
                <div className="text-4xl mb-2">{feedback.ok ? '✅' : '❌'}</div>
                <h2 className={`font-black text-2xl ${feedback.ok ? 'text-green-800' : 'text-red-800'}`}>{feedback.msg}</h2>
                <div className="mt-4 font-mono font-bold text-lg bg-white px-4 py-2 rounded-lg border inline-block">+{feedback.score} pts</div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
