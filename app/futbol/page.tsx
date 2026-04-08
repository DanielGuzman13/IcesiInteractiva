'use client';

import { useState, useRef, useCallback } from 'react';
import FutbolEditor from '@/components/FutbolEditor';
import { JugadaValidator, ValidationMode } from '@/lib/validation/jugada-validator';
import { Workspace } from 'blockly';

interface ValidationResult {
  isValid: boolean;
  messages: string[];
  pseudocode: string;
}

export default function FutbolPage() {
  const [validationMode, setValidationMode] = useState<ValidationMode>('logica_disparo');
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    messages: [],
    pseudocode: '// Tu jugada aparecerá aquí'
  });
  const workspaceRef = useRef<Workspace | null>(null);

  const handleWorkspaceChange = useCallback((workspace: Workspace) => {
    workspaceRef.current = workspace;
  }, []);

  const validarJugada = () => {
    if (workspaceRef.current) {
      try {
        const validator = new JugadaValidator(workspaceRef.current);
        const result = validator.validarJugada(validationMode);
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

    if (mode === 'logica_triangulacion') {
      return 'Lógica 3 – Construye una jugada ofensiva basada en triangulación de pases. Primero, evalúa si hay un compañero libre para decidir la acción inicial. Luego, realiza al menos dos pases antes del remate. Finalmente, decide por distancia al arco si dispara o si mantiene la posesión con otro pase. La jugada debe comenzar con INICIO y terminar con FIN, manteniendo una estructura ordenada.';
    }

    return 'Lógica 1 – Construye una jugada ofensiva que comience en INICIO y termine en FIN. Primero, evalúa si hay defensa cerca para decidir la acción inicial: si hay defensa, pasa el balón; si no hay defensa, avanza. Luego, toma una decisión final según la distancia al arco: si la distancia es menor a 20, debes disparar; si no, debes mantener la jugada con un pase. Organiza la secuencia con bloques SI/SINO de forma clara y en el orden correcto.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
            Jugadas de Fútbol
          </h1>
          <p className="text-gray-600">
            Construye jugadas usando lógica de programación. Arrastra bloques para crear tu estrategia.
          </p>
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
                  <option value="logica_triangulacion">Lógica 3: Triangulación de pases</option>
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
                  hay defensa cerca, distancia al arco &lt; 20, hay compañero libre
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
                ) : validationMode === 'logica_triangulacion' ? (
                  <>
                    <li>• Debes usar al menos 2 bloques "pasar balón" para triangular</li>
                    <li>• Incluye un SI con la condición "hay compañero libre"</li>
                    <li>• Cierra con: SI distancia al arco &lt; 20 → disparar, SINO → pasar balón</li>
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
