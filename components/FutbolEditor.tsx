'use client';

import { useEffect, useRef } from 'react';
import { inject, Workspace, WorkspaceSvg, Events } from 'blockly';
import modernTheme from '@blockly/theme-modern';
import darkTheme from '@blockly/theme-dark';
import { futbolToolbox } from '@/lib/toolbox/futbol-toolbox';
import { defineFutbolBlocks, registerFutbolGenerators } from '@/lib/blocks/futbol-blocks';

interface FutbolEditorProps {
  onWorkspaceChange?: (workspace: Workspace) => void;
}

export default function FutbolEditor({ onWorkspaceChange }: FutbolEditorProps) {
  const futbolDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<WorkspaceSvg | null>(null);

  useEffect(() => {
    if (futbolDiv.current && !workspace.current) {
      // Definir los bloques personalizados
      defineFutbolBlocks();
      registerFutbolGenerators();

      // Inicializar el workspace de Blockly con toolbox personalizada
      workspace.current = inject(futbolDiv.current, {
        theme: darkTheme,
        toolbox: futbolToolbox,
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true
        },
        zoom: {
          controls: false,
          wheel: false,
          startScale: 0.9,
          maxScale: 2,
          minScale: 0.9,
          scaleSpeed: 1.2
        },
        trashcan: true,
        maxBlocks: 12 // Limitar a 12 bloques para mantener la simplicidad
      });

      // Agregar listener para cambios en el workspace
      if (onWorkspaceChange) {
        workspace.current.addChangeListener((event) => {
          onWorkspaceChange(workspace.current!);
        });
      }
    }

    // Cleanup
    return () => {
      if (workspace.current) {
        workspace.current.dispose();
        workspace.current = null;
      }
    };
  }, [onWorkspaceChange]);

  return (
    <div className="w-full h-full">
      <div 
        ref={futbolDiv} 
        className="w-full h-full min-h-[500px]"
        style={{ height: '600px' }}
      />
    </div>
  );
}
