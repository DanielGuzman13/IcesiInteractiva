'use client';

import { useState, useRef, useCallback } from 'react';
import BlocklyEditor from '@/components/BlocklyEditor';
import { CustomGenerator } from '@/lib/generators/custom-generator';
import { Workspace, Xml } from 'blockly';

export default function BlocklyPage() {
  const [generatedCode, setGeneratedCode] = useState<string>('// Tu código generado aparecerá aquí');
  const workspaceRef = useRef<Workspace | null>(null);

  const handleWorkspaceChange = useCallback((workspace: Workspace) => {
    workspaceRef.current = workspace;
  }, []);

  const generateCode = () => {
    if (workspaceRef.current) {
      try {
        // Generar código XML del workspace
        const xml = Xml.workspaceToDom(workspaceRef.current);
        const xmlString = new XMLSerializer().serializeToString(xml);
        setGeneratedCode(`// Código XML generado del workspace:\n${xmlString}`);
      } catch (error) {
        console.error('Error generando código:', error);
        setGeneratedCode('// Error al generar el código');
      }
    }
  };

  const clearWorkspace = () => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
      setGeneratedCode('// Tu código generado aparecerá aquí');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Blockly Editor</h1>
          <p className="text-gray-600">
            Arrastra bloques para crear programas y genera código personalizado
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Editor Blockly */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Editor Visual</h2>
              <div className="space-x-2">
                <button
                  onClick={generateCode}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Generar Código
                </button>
                <button
                  onClick={clearWorkspace}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </div>
            <BlocklyEditor onWorkspaceChange={handleWorkspaceChange} />
          </div>

          {/* Código generado */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Código Generado</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-auto">
              <pre>{generatedCode}</pre>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Cómo usar</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Arrastra bloques desde el panel izquierdo hacia el área de trabajo</li>
            <li>Conecta los bloques para crear tu programa</li>
            <li>Usa bloques de lógica, matemáticas, texto y variables</li>
            <li>Haz clic en "Generar Código" para ver el código resultante</li>
            <li>El código generado usa un lenguaje personalizado basado en la sintaxis de JavaScript</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
