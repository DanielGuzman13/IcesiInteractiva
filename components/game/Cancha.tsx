'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { jugadoresData } from '../../lib/jugadores';
import { Jugador } from './Jugador';
import { Actividad1TiroLibre } from './reto/ProductOwner/Actividad1TiroLibre';
import { Actividad2Salida } from './reto/ProductOwner/Actividad2Salida';
import { Actividad1BloqueoAngulo } from './reto/qa/Actividad1BloqueoAngulo';
import { Actividad2DespejeSeg } from './reto/qa/Actividad2DespejeSeg';
import { Actividad1CentroPrecision } from './reto/devops/Actividad1CentroPrecision';
import { Actividad2RegresoHeroico } from './reto/devops/Actividad2RegresoHeroico';
import { Actividad1PaseFiltrado } from './reto/manager/Actividad1PaseFiltrado';
import { Actividad2CambioFrente } from './reto/manager/Actividad2CambioFrente';
import { Actividad1ClaridadArco } from './reto/frontend/Actividad1ClaridadArco';
import { Actividad2RegateEfectivo } from './reto/frontend/Actividad2RegateEfectivo';
import RoleDialogueOverlay from './reto/RoleDialogueOverlay';
import { useGamePersistence } from '../../hooks/useGamePersistence';
import { HUD } from './HUD';
import RetoArquitectoFlow from './reto/arquitecto/RetoArquitectoFlow';

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
  | 'devops_act1_intro'
  | 'devops_act1_frozen'
  | 'devops_act1_resolving'
  | 'manager_act1_intro'
  | 'manager_act1_frozen'
  | 'manager_act1_resolving'
  | 'manager_act2_intro'
  | 'manager_act2_frozen'
  | 'manager_act2_resolving'
  | 'halftime_idle'
  | 'arquitecto_frozen'
  | 'frontend_act1_intro'
  | 'frontend_act1_frozen'
  | 'frontend_act1_resolving'
  | 'frontend_act2_intro'
  | 'frontend_act2_frozen'
  | 'frontend_act2_resolving'
  | 'devops_act2_intro'
  | 'devops_act2_frozen'
  | 'devops_act2_resolving'
  | 'game_over'
  | 'next_roles';

type PendingRoleDialog = {
  role: 'product-owner' | 'qa' | 'devops' | 'manager' | 'frontend' | 'backend';
  activity: 1 | 2;
  onContinue: () => void;
} | null;

// Opciones originales removidas porque ahora se usan los componentes completos

export const Cancha: React.FC = () => {
  const router = useRouter();
  const { userId, sessionId, createGameSession, saveAnswer } = useGamePersistence();
  const [gameState, setGameState] = useState<GameFlowState>('init');
  const [isSecondHalf, setIsSecondHalf] = useState(false);
  const [goals, setGoals] = useState({ a: 0, b: 0 });
  const [totalScore, setTotalScore] = useState(0);

  // Animaciones estado global
  const [ballParams, setBallParams] = useState({ top: '50%', left: '50%', scale: 1, text: '⚽' });
  const [poPos, setPoPos] = useState({ top: '50%', left: '5%' }); // Portero
  const [showFlash, setShowFlash] = useState(false);

  // Futbol Animation
  const [futbolAnimation, setFutbolAnimation] = useState<{ show: boolean; points: number; logicMode: string }>({ show: false, points: 0, logicMode: '' });
  const futbolAnimationHandledRef = useRef(false);
  const [pendingRoleDialog, setPendingRoleDialog] = useState<PendingRoleDialog>(null);

  // Feedback Data
  const [feedback, setFeedback] = useState<{
    show: boolean,
    msg: string,
    score: number,
    ok: boolean,
    onContinue?: () => void
  }>({ show: false, msg: '', score: 0, ok: true });

  // Storage logic
  const [pre, setPre] = useState('guest');

  const showRoleDialog = (
    role: 'product-owner' | 'qa' | 'devops' | 'manager' | 'frontend' | 'backend',
    activity: 1 | 2,
    onContinue: () => void
  ) => {
    setPendingRoleDialog({ role, activity, onContinue });
  };

  // Helper para buscar posición de jugadores
  const getJugadorPos = (id: string, defLeft = '50%') => {
    return jugadoresData.find(j => j.id === id)?.posicion || { top: '50%', left: defLeft };
  };

  useEffect(() => {
    const val = localStorage.getItem('currentPlayer') || 'guest';
    setPre(val);

    // Restauración de estado paso a paso
    const p = JSON.parse(localStorage.getItem(`${val}_po_answers`) || '{}');
    const qa = JSON.parse(localStorage.getItem(`${val}_qa_answers`) || '{}');
    const devops = JSON.parse(localStorage.getItem(`${val}_devops_answers`) || '{}');
    const manager = JSON.parse(localStorage.getItem(`${val}_manager_answers`) || '{}');
    const arquitecto = JSON.parse(localStorage.getItem(`${val}_arquitecto_answers`) || '{}');

    let ga = 0, gb = 0;
    const savedTs = parseInt(localStorage.getItem(`${val}_total_score`) || '0', 10);
    let ts = savedTs;

    const isPoDone = p.actividad1?.score !== undefined && p.actividad2?.score !== undefined;
    const isQaDone = qa.actividad1?.score !== undefined && qa.actividad2?.score !== undefined;
    const isDevopsDone = devops.actividad1?.score !== undefined;
    const isManagerDone = manager.actividad1?.score !== undefined && manager.actividad2?.score !== undefined;
    const isArquitectoDone = arquitecto.score !== undefined;

    if (isPoDone) { ts += (p.actividad1.score + p.actividad2.score); if (ts > 0) ga++; else gb++; }
    if (isQaDone) { ts += (qa.actividad1.score + qa.actividad2.score); }
    if (isDevopsDone) { ts += devops.actividad1.score; }
    if (isManagerDone) { ts += (manager.actividad1.score + manager.actividad2.score); }

    setGoals({ a: ga, b: gb });
    setTotalScore(ts);

    if (isArquitectoDone) {
      setIsSecondHalf(true);
      // Cuando arranca el 2do tiempo, el balón va al Frontend (Delantero 1)
      const frontendPos = getJugadorPos('a-delantero-1');
      setGameState('frontend_act1_intro');
      setBallParams({ top: '50%', left: '50%', scale: 1, text: '⚽' });
      setFeedback({
        show: true,
        msg: '¡Inicia el Segundo Tiempo! Tras la charla técnica del Técnico (Arquitecto), el equipo sale con estructura sólida y el Delantero (Frontend) recibe el balón.',
        score: 0,
        ok: true,
        onContinue: () => {
          setFeedback(f => ({ ...f, show: false }));
          setBallParams({ top: frontendPos.top, left: frontendPos.left, scale: 1, text: '⚽' });
          setTimeout(() => {
            setGameState('frontend_act1_frozen');
          }, 1000);
        }
      });
    } else if (isManagerDone) {
      setGameState('halftime_idle');
      const managerPos = getJugadorPos('a-volante-ofensivo');
      setBallParams({ top: managerPos.top, left: managerPos.left, scale: 1, text: '⚽' });
    } else if (isDevopsDone) {
      setGameState('manager_act1_frozen');
      const devopsPos = getJugadorPos('a-volante-ofensivo');
      setBallParams({ top: devopsPos.top, left: devopsPos.left, scale: 1, text: '⚽' });
    } else if (isQaDone) {
      setGameState('devops_act1_frozen');
      const qaPos = getJugadorPos('a-lateral-izquierdo');
      setBallParams({ top: qaPos.top, left: qaPos.left, scale: 1, text: '⚽' });
    } else if (isPoDone) {
      setGameState('qa_act1_frozen');
      const poPos = getJugadorPos('a-defensa-central-1');
      setBallParams({ top: poPos.top, left: poPos.left, scale: 1, text: '⚽' });
    } else {
      setGameState('pre_kickoff');
      setBallParams({ top: '50%', left: '50%', scale: 1, text: '⚽' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Crear sesión de juego en PostgreSQL (separado para evitar loop de dependencias)
  useEffect(() => {
    if (userId && !sessionId) {
      createGameSession();
    }
  }, [userId, sessionId]);

  // Detectar animación de futbol
  useEffect(() => {
    if (futbolAnimationHandledRef.current) return;

    const val = localStorage.getItem('currentPlayer') || 'guest';
    const futbolAnimData = localStorage.getItem(`${val}_futbol_animation`);

    if (futbolAnimData) {
      try {
        futbolAnimationHandledRef.current = true;
        const animData = JSON.parse(futbolAnimData);
        setFutbolAnimation({ show: true, points: animData.points, logicMode: animData.logicMode });

        // Clear the localStorage flag
        localStorage.removeItem(`${val}_futbol_animation`);
      } catch (error) {
        console.error('Error parsing futbol animation data:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinueFromFutbol = () => {
    setFutbolAnimation((prev) => ({ ...prev, show: false }));
    showRoleDialog('backend', 1, () => {
      setPendingRoleDialog(null);
      setGameState('halftime_idle');
    });
  };

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
    setTotalScore(prev => prev + score);
    setGameState('po_act1_resolving');

    const ans = JSON.parse(localStorage.getItem(`${pre}_po_answers`) || '{}');
    ans['actividad1'] = { score: score };
    localStorage.setItem(`${pre}_po_answers`, JSON.stringify(ans));

    saveAnswer('po-actividad-1', { score }, score > 0, score);

    if (score > 0) {
      setBallParams({ top: '50%', left: '5%', scale: 1, text: '⚽' });
      setFeedback({
        show: true,
        msg: '¡Balón atrapado! Riesgo contenido.',
        score: score,
        ok: true,
        onContinue: () => {
          setFeedback(f => ({ ...f, show: false }));
          startAct2Transition();
        }
      });
    } else {
      setBallParams({ top: '50%', left: '0%', scale: 1.5, text: '⚽' });
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 500);
      setGoals(g => ({ ...g, b: g.b + 1 }));

      setFeedback({
        show: true,
        msg: '¡Gol en contra! Repitiendo saque de centro.',
        score: 0,
        ok: false,
        onContinue: () => {
          setFeedback(f => ({ ...f, show: false }));
          // Seguimos a la fase de PO 2
          startAct2Transition();
        }
      });
    }
  };

  // SECUENCIA 2: Transición fluida
  const [cameraScale, setCameraScale] = useState(1);

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
    showRoleDialog('product-owner', 2, () => {
      setPendingRoleDialog(null);
      setTotalScore(prev => prev + score);
      setGameState('po_act2_resolving');

      const ans = JSON.parse(localStorage.getItem(`${pre}_po_answers`) || '{}');
      ans['actividad2'] = { score: score };
      localStorage.setItem(`${pre}_po_answers`, JSON.stringify(ans));

      saveAnswer('po-actividad-2', { score }, score > 0, score);

      let optId = 'corto';
      if (score === 15) optId = 'medio';
      if (score === 5) optId = 'largo';

      const targetIdMap: Record<string, string> = {
        'corto': 'a-defensa-central-1',
        'medio': 'a-defensa-central-1',
        'largo': 'a-defensa-central-1'
      };

      const target = getJugadorPos(targetIdMap[optId]);
      setBallParams({ top: target.top, left: target.left, scale: optId === 'largo' ? 2 : 1, text: '⚽' });
      setPoPos({ top: '50%', left: '5%' }); // Portero regresa al arco

      // En Salida (PO 2) no hay gol directo, es una transición.

      setFeedback({
        show: true,
        msg: `Pase de salida ejecutado con éxito.`,
        score: score,
        ok: true,
        onContinue: () => {
          setFeedback({
            show: true,
            msg: 'El Portero (Product Owner) ha validado la entrada; ahora el sistema entra en fase de pruebas. El balón le cae al Defensa (QA), quien debe asegurar que el ataque rival no encuentre vulnerabilidades.',
            score: 0,
            ok: true,
            onContinue: () => {
              setFeedback(f => ({ ...f, show: false }));
              startQaAct1();
            }
          });
        }
      });
    });
  };

  // SECUENCIA QA: Actividad 1
  const startQaAct1 = () => {
    setGameState('qa_act1_intro');
    setTimeout(() => {
      setGameState('qa_act1_frozen');
    }, 1200);
  };

  const handleQaAct1Choice = (score: number) => {
    setGameState('qa_act1_resolving');
    const ans = JSON.parse(localStorage.getItem(`${pre}_qa_answers`) || '{}');
    ans['actividad1'] = { score: score };
    localStorage.setItem(`${pre}_qa_answers`, JSON.stringify(ans));

    saveAnswer('qa-actividad-1', { score }, score > 0, score);

    setTotalScore(prev => prev + score);

    if (score > 0) {
      setFeedback({
        show: true,
        msg: '¡Test superado! Amenaza inicial controlada.',
        score: score,
        ok: true,
        onContinue: () => {
          setFeedback(f => ({ ...f, show: false }));
          startQaAct2();
        }
      });
    } else {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 500);
      setGoals(g => ({ ...g, b: g.b + 1 }));
      setFeedback({
        show: true,
        msg: 'El Bug se ha filtrado a producción. Reiniciando bloque de pruebas...',
        score: 0,
        ok: false,
        onContinue: () => {
          setFeedback(f => ({ ...f, show: false }));
          // Procedemos a la siguiente tarea de QA (QA 2)
          startQaAct2();
        }
      });
    }
  };

  const startQaAct2 = () => {
    setGameState('qa_act2_intro');
    setTimeout(() => {
      setGameState('qa_act2_frozen');
    }, 1000);
  };

  const handleQaAct2Choice = (score: number) => {
    showRoleDialog('qa', 2, () => {
      setPendingRoleDialog(null);
      setGameState('qa_act2_resolving');
      const ans = JSON.parse(localStorage.getItem(`${pre}_qa_answers`) || '{}');
      ans['actividad2'] = { score: score };
      localStorage.setItem(`${pre}_qa_answers`, JSON.stringify(ans));

      saveAnswer('qa-actividad-2', { score }, score > 0, score);

      setTotalScore(prev => prev + score);

      if (score > 0) {
        setFeedback({
          show: true,
          msg: '¡Testing exitoso! Defensa estable.',
          score: score,
          ok: true,
          onContinue: () => {
            setFeedback(f => ({ ...f, show: false }));
            const devops = getJugadorPos('a-lateral-izquierdo');
            setBallParams({ top: devops.top, left: devops.left, scale: 1, text: '⚽' });
            setFeedback({
              show: true,
              msg: 'Con los errores corregidos y la defensa firme, el Defensa (QA) le entrega el balón al Lateral (DevOps), el encargado de que el sistema esté listo.',
              score: 0,
              ok: true,
              onContinue: () => {
                setFeedback(f => ({ ...f, show: false }));
                startDevopsAct1();
              }
            });
          }
        });
      } else {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 500);
        setGoals(g => ({ ...g, b: g.b + 1 }));
        setFeedback({
          show: true,
          msg: '¡Defensa Inestable ante el parche! El regresivo falló y regalaste un contraataque.',
          score: 0,
          ok: false,
          onContinue: () => {
            setFeedback(f => ({ ...f, show: false }));
            // Procedemos a la fase de DevOps 1
            startDevopsAct1();
          }
        });
      }
    });
  };

  const startDevopsAct1 = () => {
    setGameState('devops_act1_intro');
    setTimeout(() => {
      setGameState('devops_act1_frozen');
    }, 1200);
  };

  const handleDevopsAct1Choice = (score: number) => {
    setGameState('devops_act1_resolving');
    const ans = JSON.parse(localStorage.getItem(`${pre}_devops_answers`) || '{}');
    ans['actividad1'] = { score: score };
    localStorage.setItem(`${pre}_devops_answers`, JSON.stringify(ans));

    saveAnswer('devops-actividad-1', { score }, score > 0, score);

    setTotalScore(prev => prev + score);

    const msgs = {
      100: '¡Pase de oro! No perdimos tiempo moviendo el balón paso a paso; gracias a tu elección llegó directo al objetivo.',
      50: 'Centro al primer palo. El equipo llegó al objetivo pero con riesgo de errores humanos (despliegue manual).',
      0: '¡Despliegue fallido! El código llegó roto al servidor.'
    };

    // En Centro (DevOps 1) no hay gol en contra si fallas, solo se pierde el balón.

    setFeedback({
      show: true,
      msg: msgs[score as keyof typeof msgs] || 'Resultado promediado.',
      score: score,
      ok: score > 0,
      onContinue: () => {
        setFeedback(f => ({ ...f, show: false }));
        // Proceso de transición al Manager, incluso si falló el centro
        const manager = getJugadorPos('a-volante-ofensivo');
        setBallParams({ top: manager.top, left: manager.left, scale: 1.5, text: '⚽' });
        setFeedback({
          show: true,
          msg: score > 0 
            ? '¡Pase perfecto! El balón fluye sin problemas hasta el mediocampo. Es el momento del Estratega (Team Manager).'
            : '¡Recuperación forzada! A pesar del mal centro, el equipo logra recuperar el balón en el mediocampo para el Estratega.',
          score: 0,
          ok: true,
          onContinue: () => {
            setBallParams({ top: manager.top, left: manager.left, scale: 1, text: '⚽' });
            setFeedback(f => ({ ...f, show: false }));
            startManagerAct1();
          }
        });
      }
    });
  };

  const startManagerAct1 = () => {
    setGameState('manager_act1_intro');
    setTimeout(() => {
      setGameState('manager_act1_frozen');
    }, 1200);
  };

  const handleManagerAct1Choice = (score: number) => {
    setGameState('manager_act1_resolving');
    const ans = JSON.parse(localStorage.getItem(`${pre}_manager_answers`) || '{}');
    ans['actividad1'] = { score: score };
    localStorage.setItem(`${pre}_manager_answers`, JSON.stringify(ans));

    saveAnswer('manager-actividad-1', { score }, score > 0, score);

    setTotalScore(prev => prev + score);

    const msgs = {
      100: '¡Asistencia de crack! Elegiste la mejor arquitectura técnica para superar la defensa.',
      50: 'Pase seguro pero lento. Jugada monolítica que obliga al equipo a pelear más.',
      0: '¡Balón perdido! Falta de comunicación técnica.'
    };

    // En Pase (Manager 1) no hay gol en contra.

    setFeedback({
      show: true,
      msg: msgs[score as keyof typeof msgs] || 'Asistencia procesada.',
      score: score,
      ok: score > 0,
      onContinue: () => {
        setFeedback(f => ({ ...f, show: false }));
        // Siempre procedemos a Manager 2
        startManagerAct2();
      }
    });
  };

  const startManagerAct2 = () => {
    setGameState('manager_act2_intro');
    setTimeout(() => {
      setGameState('manager_act2_frozen');
    }, 1000);
  };

  const handleManagerAct2Choice = (score: number) => {
    showRoleDialog('manager', 2, () => {
      setPendingRoleDialog(null);
      setGameState('manager_act2_resolving');
      const ans = JSON.parse(localStorage.getItem(`${pre}_manager_answers`) || '{}');
      ans['actividad2'] = { score: score };
      localStorage.setItem(`${pre}_manager_answers`, JSON.stringify(ans));

      saveAnswer('manager-actividad-2', { score }, score > 0, score);

      setTotalScore(prev => prev + score);

      const msgs = {
        100: '¡Excelente gestión! Mandaste el balón al espacio libre para evitar sobrecargar al equipo.',
        50: '¡Aguardaste bajo presión! Has mantenido posesión pero no delegaste.',
        0: '¡Micromanagement! Intentaste hacerlo todo solo y perdiste el balón.'
      };

      // En Cambio de Frente (Manager 2) no hay gol en contra.

      setFeedback({
        show: true,
        msg: msgs[score as keyof typeof msgs] || 'Gestión finalizada.',
        score: score,
        ok: score > 0,
        onContinue: () => {
          setFeedback(f => ({ ...f, show: false }));
          const backend = getJugadorPos('a-medio-centro-2');
          setBallParams({ top: backend.top, left: backend.left, scale: 1, text: '⚽' });
          setFeedback({
            show: true,
            msg: score > 0 
              ? '¡Estrategia definida! El Mediocampista (Team Manager) deja el balón servido para el Mediocentro (Backend).'
              : '¡Jugada accidentada! Tras un mal manejo, el balón le queda dividido al Mediocentro (Backend).',
            score: 0,
            ok: true,
            onContinue: () => {
              setFeedback(f => ({ ...f, show: false }));
              setGameState('next_roles');
              router.push('/futbol');
            }
          });
        }
      });
    });
  };
  const handleArquitectoDone = () => {
    setIsSecondHalf(true);
    const frontendPos = getJugadorPos('a-delantero-1');
    setGameState('frontend_act1_intro');
    setBallParams({ top: '50%', left: '50%', scale: 1, text: '⚽' });
    setFeedback({
      show: true,
      msg: '¡Inicia el Segundo Tiempo! Tras la charla técnica del Técnico (Arquitecto), el equipo sale con estructura sólida y el Delantero (Frontend) recibe el balón.',
      score: 0,
      ok: true,
      onContinue: () => {
        setFeedback(f => ({ ...f, show: false }));
        setBallParams({ top: frontendPos.top, left: frontendPos.left, scale: 1, text: '⚽' });
        setTimeout(() => {
          setGameState('frontend_act1_frozen');
        }, 1000);
      }
    });
  };

  const handleFrontendAct1Choice = (score: number) => {
    setGameState('frontend_act1_resolving');

    saveAnswer('frontend-actividad-1', { score }, score > 0, score);

    setTotalScore(prev => prev + score);
    const msgs = {
      100: '¡Golazo Visual! La jerarquía es perfecta y el usuario sabe exactamente qué hacer.',
      50: '¡Entra de milagro! La interfaz está un poco saturada.',
      0: '¡Bloqueado! Diseño confuso.'
    };

    if (score > 0) {
      setGoals(g => ({ ...g, a: g.a + 1 }));
    }
    // Si falla el delantero, no se suma gol en contra automático aquí.

    setFeedback({
      show: true,
      msg: msgs[score as keyof typeof msgs] || 'Diseño validado.',
      score: score,
      ok: score > 0,
      onContinue: () => {
        setFeedback(f => ({ ...f, show: false }));
        // Siempre procedemos a Frontend 2
        setGameState('frontend_act2_frozen');
      }
    });
  };

  const handleFrontendAct2Choice = (score: number) => {
    showRoleDialog('frontend', 2, () => {
      setPendingRoleDialog(null);
      setGameState('frontend_act2_resolving');

      saveAnswer('frontend-actividad-2', { score }, score > 0, score);
      setTotalScore(prev => prev + score);

      const msgs = {
        100: '¡Amague Veloz! Interacción ágil, sin fricciones.',
        50: '¡Choque fuerte! La interacción fue pesada.',
        0: '¡Duda! Te quedaste estático.'
      };

      if (score > 0) {
        setGoals(g => ({ ...g, a: g.a + 1 }));
      }
      // Si falla el regate, se pierde el balón pero no es gol en contra automático.

      setFeedback({
        show: true,
        msg: msgs[score as keyof typeof msgs] || 'Interacción procesada.',
        score: score,
        ok: score > 0,
        onContinue: () => {
          setFeedback(f => ({ ...f, show: false }));
          // Siempre activamos el contraataque, sea gol o pérdida
          setFeedback({
            show: true,
            msg: score > 0 
              ? '¡GOLAAAAAZO! Pero el rival saca rápido aprovechando un descuido.'
              : '¡Balón perdido! El rival recupera y lanza un contraataque fulminante.',
            score: 0,
            ok: true,
            onContinue: () => {
              setFeedback(f => ({ ...f, show: false }));

              setTimeout(() => {
                // 2. Reinicio en la mitad
                setBallParams({ top: '50%', left: '50%', scale: 1.2, text: '⚽' });

                setTimeout(() => {
                  // 3. Jugador rival recibe en el centro
                  const rival1 = getJugadorPos('b-medio-2');
                  setBallParams({ top: rival1.top, left: rival1.left, scale: 1, text: '⚽' });

                  setTimeout(() => {
                    // 4. Pase al siguiente rival avanzando
                    const rival2 = getJugadorPos('b-delantero-2');
                    setBallParams({ top: rival2.top, left: rival2.left, scale: 1, text: '⚽' });

                    setTimeout(() => {
                      // 6. Pase al delantero rival para el contraataque
                      const rival3 = getJugadorPos('b-delantero-1');
                      setBallParams({ top: rival3.top, left: rival3.left, scale: 1.2, text: '⚽' });

                      setTimeout(() => {
                        setGameState('devops_act2_frozen');
                      }, 2000);
                    }, 1000);
                  }, 1000);
                }, 1500); // Pausa en el centro para que se vea el reinicio
              }, 1000); // Pausa en el gol
            }
          });
        }
      });
    });
  };

  const handleDevopsAct2Choice = (score: number) => {
    showRoleDialog('devops', 2, () => {
      setPendingRoleDialog(null);
      setGameState('devops_act2_resolving');

      saveAnswer('devops-actividad-2', { score }, score > 0, score);

      setTotalScore(prev => prev + score);

      if (score === 0) {
        setGoals(g => ({ ...g, b: g.b + 1 }));
      }

      setFeedback({
        show: true,
        msg: score > 0 ? '¡El despliegue está asegurado! El partido ha finalizado.' : '¡Caída del sistema! No pudiste mantener el servicio.',
        score: score,
        ok: score > 0,
        onContinue: () => {
          setFeedback(f => ({ ...f, show: false }));
          // Final del partido, independientemente del score
          setGameState('game_over');
        }
      });
    });
  };

  return (
    <div className="w-full h-full flex flex-col flex-1 min-h-[0] max-w-[95%] lg:max-w-[90%] mx-auto px-2 pb-2">

      <AnimatePresence>
        {showFlash && (
          <motion.div key="flash-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white z-[9999] pointer-events-none" />
        )}
      </AnimatePresence>

      <HUD
        goalsA={goals.a}
        goalsB={goals.b}
        minuteText={gameState === 'pre_kickoff' || gameState === 'kickoff_anim' ? "00:00" : gameState.includes('act1') ? "15:00" : gameState.includes('act2') ? "15:10" : "30:00"}
        totalScoreOverride={totalScore}
      />

      <div className="flex-1 min-h-[0] w-full flex flex-col items-center justify-center overflow-hidden relative">
        <motion.div
          animate={{
            scale: (gameState === 'pre_kickoff' || gameState.includes('_frozen') || gameState.includes('_resolving')) ? 1 : cameraScale
          }}
          transition={{ duration: 1.5, type: 'spring' }}
          className="relative aspect-video w-full max-h-full rounded-xl border-4 border-white/20 bg-[#2b722d] shadow-2xl"
          style={{
            maxHeight: '100%',
            maxWidth: 'calc(100vh * 16 / 9)',
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            WebkitFontSmoothing: 'antialiased'
          }}>

          {/* Decor Wrapper to keep grass lines inside rounded corners */}
          <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
            <div className="absolute inset-0 flex">
              {[...Array(14)].map((_, i) => (
                <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`} />
              ))}
            </div>

            {/* Cancha decor */}
            <div className="absolute top-0 left-1/2 w-1 h-full bg-white/60 -translate-x-1/2"></div>
            {/* Lado Izquierdo */}
            <div className="absolute top-1/2 left-0 w-[13%] h-[55%] border-t-4 border-r-4 border-b-4 border-white/60 -translate-y-1/2 opacity-50"></div>
            {/* Lado Derecho */}
            <div className="absolute top-1/2 right-0 w-[13%] h-[55%] border-t-4 border-l-4 border-b-4 border-white/60 -translate-y-1/2 opacity-50"></div>
          </div>

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
                // Rivales hacen sombra (Posicionamiento determinístico para evitar error de pureza y saltos visuales)
                const offset = jugador.id.length % 5 - 2; // -2 a 2
                top = `calc(${jugador.posicion.top} + ${offset}%)`;
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
            if (gameState === 'devops_act1_frozen') {
              if (jugador.id === 'a-lateral-izquierdo') isTarget = true;
              else isDimmed = true;
            }
            if (gameState === 'devops_act2_frozen') {
              // Lateral derecho o DevOps para esta fase
              if (jugador.id === 'a-lateral-derecho') isTarget = true;
              else isDimmed = true;
            }
            if (gameState === 'manager_act1_frozen' || gameState === 'manager_act2_frozen') {
              if (jugador.id === 'a-volante-ofensivo') isTarget = true;
              else isDimmed = true;
            }

            // Inversión de lado de la cancha en el Segundo Tiempo
            let finalLeft = left;
            if (isSecondHalf && finalLeft.includes('%')) {
              finalLeft = `calc(100% - ${finalLeft})`;
            }

            // Ajuste para la Zona Técnica (Fuera de la Cancha)
            if (jugador.fueraDeCampo) {
              top = '92%'; // Posición cerca del borde inferior
              finalLeft = '50%'; // Centro
            }

            return (
              <motion.div key={jugador.id}
                animate={{ top, left: finalLeft, opacity: isDimmed ? 0.3 : 1 }}
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
            animate={{
              top: ballParams.top,
              left: isSecondHalf && typeof ballParams.left === 'string' && ballParams.left.includes('%') ? `calc(100% - ${ballParams.left})` : ballParams.left,
              scale: ballParams.scale,
              rotate: gameState.includes('resolving') || gameState === 'kickoff_anim' ? 360 : 0
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            {ballParams.text}
          </motion.div>

          <AnimatePresence>
            {/* INICIO PARTIDO BTN */}
            {gameState === 'pre_kickoff' && (
              <motion.button
                key="kickoff-button"
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                onClick={handleKickoff}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] bg-emerald-500 hover:bg-emerald-600 border-4 border-white text-white font-black px-6 py-6 rounded-full shadow-2xl transition hover:scale-110 active:scale-95"
              >
                ⚽ INICIAR PARTIDO
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {pendingRoleDialog && (
          <RoleDialogueOverlay
            key={`role-dialog-${pendingRoleDialog.role}-${pendingRoleDialog.activity}`}
            role={pendingRoleDialog.role}
            activity={pendingRoleDialog.activity}
            onContinue={pendingRoleDialog.onContinue}
          />
        )}

        {/* Actividad 1 - El Grito de la Barrera OVERLAY */}
        {gameState === 'po_act1_frozen' && (
          <motion.div key="po-act1-overlay" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-green-500">
              <div className="bg-green-600 px-4 py-3 text-white flex justify-between items-center shadow">
                <h2 className="font-black text-xl">🔥 ¡RETO ACTIVADO: GESTIÓN DE RIESGOS!</h2>
                <span className="text-sm bg-black/30 px-3 py-1 rounded-full border border-white/20">Jugador: Portero (Product Owner)</span>
              </div>
              <div className="overflow-y-auto bg-green-50 relative p-4 md:p-6">
                <Actividad1TiroLibre onComplete={handleAct1Choice} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Actividad 2 - Salida OVERLAY */}
        {gameState === 'po_act2_frozen' && (
          <motion.div key="po-act2-overlay" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-green-500">
              <div className="bg-green-600 px-4 py-3 text-white flex justify-between items-center shadow">
                <h2 className="font-black text-xl">🎯 ¡RETO ACTIVADO: DIRECCIÓN DE SALIDA!</h2>
                <span className="text-sm bg-black/30 px-3 py-1 rounded-full border border-white/20">Jugador: Portero (Product Owner)</span>
              </div>
              <div className="overflow-y-auto bg-green-50 relative p-4 md:p-6">
                <Actividad2Salida onComplete={handleAct2Choice} />
              </div>
            </div>
          </motion.div>
        )}

        {/* QA Actividad 1 - Test OVERLAY */}
        {gameState === 'qa_act1_frozen' && (
          <motion.div key="qa-act1-overlay" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-blue-600">
              <div className="bg-blue-700 px-4 py-3 text-white flex justify-between items-center shadow">
                <h2 className="font-black text-xl">🛡️ ¡TEST: BLOQUEO RÁPIDO!</h2>
                <span className="text-sm bg-black/30 px-3 py-1 rounded-full border border-white/20">Jugador: Defensa (QA)</span>
              </div>
              <div className="overflow-y-auto bg-blue-50 relative p-4 md:p-6">
                <Actividad1BloqueoAngulo onComplete={handleQaAct1Choice} />
              </div>
            </div>
          </motion.div>
        )}

        {/* QA Actividad 2 - Regression Testing OVERLAY */}
        {gameState === 'qa_act2_frozen' && (
          <motion.div key="qa-act2-overlay" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-teal-600">
              <div className="bg-teal-700 px-4 py-3 text-white flex justify-between items-center shadow">
                <h2 className="font-black text-xl">🧹 ¡REGRESSION TESTING: DESPEJE ESTABLE!</h2>
                <span className="text-sm bg-black/30 px-3 py-1 rounded-full border border-white/20">Jugador: Defensa (QA)</span>
              </div>
              <div className="overflow-y-auto bg-teal-50 relative p-4 md:p-6">
                <Actividad2DespejeSeg onComplete={handleQaAct2Choice} />
              </div>
            </div>
          </motion.div>
        )}

        {/* DevOps Actividad 1*/}
        {gameState === 'devops_act1_frozen' && (
          <motion.div key="devops-act1-overlay" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-blue-400">
              <div className="bg-blue-600 px-4 py-3 text-white flex justify-between items-center shadow">
                <h2 className="font-black text-xl">🚀 ¡DEVOPS: DESPLIEGUE DE COMUNICACIÓN (CENTRO)!</h2>
                <span className="text-sm bg-black/30 px-3 py-1 rounded-full border border-white/20">Jugador: Lateral (DevOps)</span>
              </div>
              <div className="overflow-y-auto bg-blue-50 relative p-4 md:p-6">
                <Actividad1CentroPrecision onComplete={handleDevopsAct1Choice} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Manager Actividad 1 - OVERLAY */}
        {gameState === 'manager_act1_frozen' && (
          <motion.div key="manager-act1-overlay" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-amber-400">
              <div className="bg-amber-500 px-4 py-3 text-white flex justify-between items-center shadow">
                <h2 className="font-black text-xl">👟 ¡TEAM MANAGER: EL PASE FILTRADO!</h2>
                <span className="text-sm bg-black/30 px-3 py-1 rounded-full border border-white/20">Jugador: Mediocampista (Team Manager)</span>
              </div>
              <div className="overflow-y-auto bg-amber-50 relative p-4 md:p-6">
                <Actividad1PaseFiltrado onComplete={handleManagerAct1Choice} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Manager Actividad 2 - OVERLAY */}
        {gameState === 'manager_act2_frozen' && (
          <motion.div key="manager-act2-overlay" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-amber-600">
              <div className="bg-amber-600 px-4 py-3 text-white flex justify-between items-center shadow">
                <h2 className="font-black text-xl">🗺️ ¡TEAM MANAGER: EL CAMBIO DE FRENTE!</h2>
                <span className="text-sm bg-black/30 px-3 py-1 rounded-full border border-white/20">Jugador: Mediocampista (Team Manager)</span>
              </div>
              <div className="overflow-y-auto bg-amber-50 relative p-4 md:p-6">
                <Actividad2CambioFrente onComplete={handleManagerAct2Choice} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Halftime Modal OVERLAY */}
        {gameState === 'halftime_idle' && (
          <motion.div key="halftime-overlay" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-red-500 text-center p-8">
              <h2 className="font-black text-4xl mb-4 text-red-700">⏱️ MEDIO TIEMPO ⏸️</h2>
              <p className="text-xl font-medium text-gray-700 mb-8">
                Has completado la primera mitad del partido. Puedes ir a la sala de máquinas del Backend o dirigirte al Vestuario para planificar tu Arquitectura.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setGameState('arquitecto_frozen')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition-colors text-lg shadow-lg active:scale-95"
                >
                  Continuar al Vestuario
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Arquitecto OVERLAY */}
        {gameState === 'arquitecto_frozen' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <RetoArquitectoFlow onFinish={handleArquitectoDone} />
          </motion.div>
        )}

        {/* Frontend Actividad 1 - OVERLAY */}
        {gameState === 'frontend_act1_frozen' && (
          <motion.div key="frontend-act1-overlay" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-emerald-500">
              <div className="bg-emerald-600 px-4 py-3 text-white flex justify-between items-center shadow">
                <h2 className="font-black text-xl">🎯 ¡FRONTEND: CLARIDAD DEL ARCO!</h2>
                <span className="text-sm bg-black/30 px-3 py-1 rounded-full border border-white/20">Jugador: Delantero 1</span>
              </div>
              <div className="overflow-y-auto bg-emerald-50 relative">
                <Actividad1ClaridadArco onComplete={handleFrontendAct1Choice} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Frontend Actividad 2 - OVERLAY */}
        {gameState === 'frontend_act2_frozen' && (
          <motion.div key="frontend-act2-overlay" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-emerald-600">
              <div className="bg-emerald-700 px-4 py-3 text-white flex justify-between items-center shadow">
                <h2 className="font-black text-xl">⚡ ¡FRONTEND: REGATE EFECTIVO!</h2>
                <span className="text-sm bg-black/30 px-3 py-1 rounded-full border border-white/20">Jugador: Delantero 1</span>
              </div>
              <div className="overflow-y-auto bg-emerald-50 relative">
                <Actividad2RegateEfectivo onComplete={handleFrontendAct2Choice} />
              </div>
            </div>
          </motion.div>
        )}

        {/* DevOps Actividad 2 - OVERLAY */}
        {gameState === 'devops_act2_frozen' && (
          <motion.div key="devops-act2-overlay" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-indigo-600">
              <div className="bg-indigo-700 px-4 py-3 text-white flex justify-between items-center shadow">
                <h2 className="font-black text-xl">🛡️ ¡DEVOPS: REGRESO HEROICO!</h2>
                <span className="text-sm bg-black/30 px-3 py-1 rounded-full border border-white/20">Jugador: DevOps</span>
              </div>
              <div className="overflow-y-auto bg-indigo-50 relative">
                <Actividad2RegresoHeroico onComplete={handleDevopsAct2Choice} />
              </div>
            </div>
          </motion.div>
        )}

        {/* GAME OVER OVERLAY */}
        {gameState === 'game_over' && (
          <motion.div key="game-over-overlay" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto"
          >
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden mt-8 mb-8 border-[6px] border-yellow-500 text-center p-12">
              <h2 className="font-black text-6xl mb-4 text-yellow-500">🏆 VICTORIA 🏆</h2>
              <p className="text-2xl font-medium text-gray-700 mb-8 leading-relaxed">
                ¡Felicidades! Has recorrido todos los perfiles de ingeniería. El partido ha terminado y has conseguido el resultado necesario para avanzar.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                {/* <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 px-8 rounded-full transition-all text-xl shadow-lg active:scale-95 border-2 border-gray-200"
                    >
                      JUGAR DE NUEVO
                    </button> */}
                <button
                  onClick={() => router.push('/game/resumen-roles')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-black py-4 px-10 rounded-full transition-all text-2xl shadow-2xl active:scale-95 border-b-4 border-yellow-700"
                >
                  CONTINUAR →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Feedback Popups */}
        {feedback.show && (
          <motion.div key="feedback-popup" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-2xl shadow-2xl border-4 z-[200] text-center ${feedback.ok ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}
          >
            <div className="flex flex-col items-center gap-4 justify-center">
              <div className="flex items-center gap-3 justify-center">
                <div className="text-3xl sm:text-4xl">{feedback.ok ? '✅' : '❌'}</div>
                <h2 className={`font-black text-xl sm:text-2xl ${feedback.ok ? 'text-green-800' : 'text-red-800'}`}>{feedback.msg}</h2>
              </div>
              {/* Score badge removed as requested by user - redundant */}

              <button
                onClick={() => {
                  if (feedback.onContinue) {
                    feedback.onContinue();
                  } else {
                    setFeedback(f => ({ ...f, show: false }));
                  }
                }}
                className={`mt-2 ${feedback.ok ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white font-bold py-2 px-8 rounded-full transition-all shadow-md active:scale-95`}
              >
                Continuar →
              </button>
            </div>
          </motion.div>
        )}

        {/* Futbol Logic Points Animation Overlay */}
        {futbolAnimation.show && (
          <motion.div
            key="futbol-points-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-t-8 border-green-500"
            >
              <div className="text-5xl mb-3">⚽</div>
              <h3 className="text-xl font-extrabold text-gray-800 mb-2">
                {futbolAnimation.logicMode === 'logica_disparo' ? 'Lógica 1 Completada' : 'Lógica 2 Completada'}
              </h3>
              <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                🔗 Relación con el Rol (Backend)
              </div>
              <p className="text-sm leading-relaxed mb-4 text-green-700">
                ¡Buena lectura de juego! Validaste correctamente la lógica y tomaste una decisión técnica sólida para continuar el flujo del partido.
              </p>
              <div className="inline-block rounded-xl border py-3 px-6 mb-6 bg-green-50 border-green-200">
                <span className="font-black text-2xl text-green-600">
                  +{futbolAnimation.points} pts
                </span>
              </div>
              <br />
              <button
                onClick={handleContinueFromFutbol}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md"
              >
                Continuar
              </button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
