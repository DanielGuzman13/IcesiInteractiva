'use client';

import { useState, useRef } from 'react';
import FutbolEditor from '@/components/FutbolEditor';
import { JugadaValidator } from '@/lib/validation/jugada-validator';
import { Workspace } from 'blockly';

interface ValidationResult {
  isValid: boolean;
  messages: string[];
  pseudocode: string;
}

export default function FutbolPage() {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    messages: [],
    pseudocode: '// Tu jugada aparecerá aquí'
  });
  const workspaceRef = useRef<Workspace | null>(null);

  const handleWorkspaceChange = (workspace: Workspace) => {
    workspaceRef.current = workspace;
  };

  const validarJugada = () => {
    if (workspaceRef.current) {
      try {
        const validator = new JugadaValidator(workspaceRef.current);
        const result = validator.validarJugada();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
            ⚽ Editor de Jugadas de Fútbol
          </h1>
          <p className="text-gray-600">
            Construye jugadas usando lógica de programación. Arrastra bloques para crear tu estrategia.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Editor Blockly */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Editor Visual</h2>
              <div className="space-x-2">
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
            <FutbolEditor onWorkspaceChange={handleWorkspaceChange} />
          </div>

          {/* Results Panel */}
          <div className="space-y-4">
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
              <pre className="font-mono text-sm h-64 overflow-auto">
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
                <li><span className="text-orange-600 font-medium">Control:</span> INICIO, FIN, SI, SINO</li>
                <li><span className="text-green-600 font-medium">Condiciones:</span> hay defensa cerca, distancia al arco &lt; 20</li>
                <li><span className="text-blue-600 font-medium">Acciones:</span> avanzar, pasar balón, disparar</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Reglas:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Máximo 6 bloques de acción</li>
                <li>• Debe incluir un bloque "disparar"</li>
                <li>• Siempre evaluar distancia antes de disparar</li>
                <li>• No ignorar la condición de defensa</li>
                <li>• Usar estructura SI/SINO correctamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
