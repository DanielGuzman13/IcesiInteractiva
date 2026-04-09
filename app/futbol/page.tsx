'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FutbolEditor from '@/components/FutbolEditor';
import { JugadaValidator, ValidationMode } from '@/lib/validation/jugada-validator';
import { Workspace } from 'blockly';

const TIMER_SECONDS = 10 * 60;

interface ValidationResult {
  isValid: boolean;
  messages: string[];
  pseudocode: string;
}

const POINTS_PER_LOGIC: Record<ValidationMode, number> = {
  logica_disparo: 100,
  logica_ciclo: 100,
};

interface FutbolScoreState {
  logica_disparo?: number;
  logica_ciclo?: number;
  total?: number;
}

export default function FutbolPage() {
  const router = useRouter();
  const [validationMode, setValidationMode] = useState<ValidationMode>('logica_disparo');
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    messages: [],
    pseudocode: '// Tu jugada aparecerá aquí'
  });
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_SECONDS);
  const workspaceRef = useRef<Workspace | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(intervalId);
          router.replace('/game');
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [router]);

  const formattedMinutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const formattedSeconds = String(timeLeft % 60).padStart(2, '0');

  const handleWorkspaceChange = useCallback((workspace: Workspace) => {
    workspaceRef.current = workspace;
  }, []);

  const asignarPuntosSiAplica = (mode: ValidationMode) => {
    if (typeof window === 'undefined') {
      return { assigned: false, points: 0, alreadyAwarded: false };
    }

    const currentPlayer = localStorage.getItem('currentPlayer') || 'guest';
    const storageKey = `${currentPlayer}_futbol_scores`;

    let prev: FutbolScoreState = {};
    try {
      prev = JSON.parse(localStorage.getItem(storageKey) || '{}') as FutbolScoreState;
    } catch {
      prev = {};
    }

    const alreadyAwarded = (prev[mode] ?? 0) > 0;
    if (alreadyAwarded) {
      return { assigned: false, points: 0, alreadyAwarded: true };
    }

    const points = POINTS_PER_LOGIC[mode];
    const next: FutbolScoreState = {
      ...prev,
      [mode]: points,
      total: (prev.total ?? 0) + points,
    };

    localStorage.setItem(storageKey, JSON.stringify(next));

    return { assigned: true, points, alreadyAwarded: false };
  };

  const validarJugada = () => {
    if (workspaceRef.current) {
      try {
        const validator = new JugadaValidator(workspaceRef.current);
        const result = validator.validarJugada(validationMode);

        if (result.isValid) {
          const award = asignarPuntosSiAplica(validationMode);

          if (award.assigned) {
            setValidationResult({
              ...result,
              messages: [...result.messages, `+${award.points} puntos asignados a tu jugador por esta lógica.`],
            });
            return;
          }

          if (award.alreadyAwarded) {
            setValidationResult({
              ...result,
              messages: [...result.messages, 'Esta lógica ya otorgó puntos anteriormente para tu jugador.'],
            });
            return;
          }
        }

        setValidationResult(result);
      } catch (error) {
        console.error('Error validando la jugada:', error);
        setValidationResult({
          isValid: false,
          messages: ['Error al validar la jugada'],
          pseudocode: '// Error en la validación'
        });
      }
    }
  };

  const limpiarWorkspace = () => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
      setValidationResult({
        isValid: false,
        messages: [],
        pseudocode: '// Tu jugada aparecerá aquí'
      });
    }
  };

  const getMessageColor = (isValid: boolean) => {
    return isValid ? 'text-green-600' : 'text-red-600';
  };

  const getBorderColor = (isValid: boolean) => {
    return isValid ? 'border-green-500' : 'border-red-500';
  };

  const getChallengeStatement = (mode: ValidationMode) => {
    if (mode === 'logica_ciclo') {
      return 'Lógica 2 – Construye una jugada de contraataque que avance 20 metros en tramos de 5 metros usando un bloque de repetición de 4 veces. En cada repetición, evalúa si hay defensa cerca para decidir entre pasar o seguir avanzando. Al finalizar el ciclo, cierra la jugada con una decisión por distancia al arco: si es menor a 20, dispara; si no, pasa el balón. La secuencia debe comenzar con INICIO y terminar con FIN.';
    }

    return 'Lógica 1 – Construye una jugada ofensiva que comience en INICIO y termine en FIN. Primero, evalúa si hay defensa cerca para decidir la acción inicial: si hay defensa, pasa el balón; si no hay defensa, avanza. Luego, toma una decisión final según la distancia al arco: si la distancia es menor a 20, debes disparar; si no, debes mantener la jugada con un pase. Organiza la secuencia con bloques SI/SINO de forma clara y en el orden correcto.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
                Jugadas de Fútbol
              </h1>
              <p className="text-gray-600">
                Construye jugadas usando lógica de programación. Arrastra bloques para crear tu estrategia.
              </p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center sm:min-w-40">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Tiempo restante</p>
              <p className="text-2xl font-bold text-red-700">
                {formattedMinutes}:{formattedSeconds}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Editor Blockly */}
          <div className="bg-white rounded-lg shadow-lg p-4 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Editor Visual</h2>
              <div className="flex items-center gap-2">
                <select
                  value={validationMode}
                  onChange={(event) => setValidationMode(event.target.value as ValidationMode)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white"
                >
                  <option value="logica_disparo">Lógica 1: Disparo por distancia</option>
                  <option value="logica_ciclo">Lógica 2: Contraataque con ciclo</option>
                </select>
                <button
                  onClick={validarJugada}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Validar Jugada
                </button>
                <button
                  onClick={limpiarWorkspace}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </div>

            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-2 text-base font-semibold text-blue-900">Enunciado de la lógica seleccionada</h3>
              <p className="text-sm leading-relaxed text-blue-900">
                {getChallengeStatement(validationMode)}
              </p>
            </div>

            <FutbolEditor onWorkspaceChange={handleWorkspaceChange} />
          </div>

          {/* Results Panel */}
          <div className="space-y-4 lg:col-span-1">
            {/* Messages */}
            <div className={`bg-white rounded-lg shadow-lg p-4 border-2 ${getBorderColor(validationResult.isValid)}`}>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Resultados</h2>
              {validationResult.messages.length > 0 ? (
                <div className="space-y-2">
                  {validationResult.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${getMessageColor(validationResult.isValid)} ${
                        validationResult.isValid ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      {message}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Valida tu jugada para ver los resultados aquí
                </p>
              )}
            </div>

            {/* Pseudocode */}
            <div className="bg-gray-900 text-green-400 rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold text-white mb-3">Pseudocódigo</h2>
              <pre className="font-mono text-sm h-48 overflow-auto">
                {validationResult.pseudocode}
              </pre>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">🎯 Cómo jugar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Bloques Disponibles:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>
                  <span className="inline-block rounded-md bg-orange-100 px-2 py-1 text-base font-bold text-orange-800">
                    Control:
                  </span>{' '}
                  INICIO, FIN, SI, SINO, REPETIR 4 VECES
                </li>
                <li>
                  <span className="inline-block rounded-md bg-green-100 px-2 py-1 text-base font-bold text-green-800">
                    Condiciones:
                  </span>{' '}
                  hay defensa cerca, distancia al arco &lt; 20
                </li>
                <li>
                  <span className="inline-block rounded-md bg-blue-100 px-2 py-1 text-base font-bold text-blue-800">
                    Acciones:
                  </span>{' '}
                  avanzar, pasar balón, disparar
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Reglas:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Máximo 6 bloques de acción</li>
                <li>• Debe incluir un bloque "disparar"</li>
                {validationMode === 'logica_ciclo' ? (
                  <>
                    <li>• Debes usar "REPETIR 4 VECES" para representar 20 metros en tramos de 5</li>
                    <li>• Dentro del ciclo, evalúa "hay defensa cerca" con SI/SINO</li>
                    <li>• Cierra la jugada con: SI distancia al arco &lt; 20 → disparar, SINO → pasar balón</li>
                  </>
                ) : (
                  <>
                    <li>• Evalúa la distancia al arco antes de disparar</li>
                    <li>• Si usas "hay defensa cerca", debes manejarla con SI/SINO</li>
                    <li>• No es obligatorio usar el ciclo en este modo</li>
                  </>
                )}
                <li>• Usa estructuras SI/SINO de forma ordenada (máximo 3)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
