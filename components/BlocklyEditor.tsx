'use client';

import { useEffect, useRef } from 'react';
import { inject, Workspace, Xml, utils } from 'blockly';
import modernTheme from '@blockly/theme-modern';

interface BlocklyEditorProps {
  initialXml?: string;
  onWorkspaceChange?: (workspace: Workspace) => void;
}

export default function BlocklyEditor({ initialXml, onWorkspaceChange }: BlocklyEditorProps) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<Workspace | null>(null);

  useEffect(() => {
    if (blocklyDiv.current && !workspace.current) {
      // Inicializar el workspace de Blockly
      workspace.current = inject(blocklyDiv.current, {
        theme: modernTheme,
        toolbox: {
          kind: 'categoryToolbox',
          contents: [
            {
              kind: 'category',
              name: 'Logic',
              colour: '210',
              contents: [
                {
                  kind: 'block',
                  type: 'controls_if'
                },
                {
                  kind: 'block',
                  type: 'logic_compare'
                },
                {
                  kind: 'block',
                  type: 'logic_operation'
                },
                {
                  kind: 'block',
                  type: 'logic_boolean'
                }
              ]
            },
            {
              kind: 'category',
              name: 'Loops',
              colour: '120',
              contents: [
                {
                  kind: 'block',
                  type: 'controls_repeat_ext'
                },
                {
                  kind: 'block',
                  type: 'controls_whileUntil'
                },
                {
                  kind: 'block',
                  type: 'controls_for'
                }
              ]
            },
            {
              kind: 'category',
              name: 'Math',
              colour: '230',
              contents: [
                {
                  kind: 'block',
                  type: 'math_number'
                },
                {
                  kind: 'block',
                  type: 'math_arithmetic'
                },
                {
                  kind: 'block',
                  type: 'math_random_int'
                }
              ]
            },
            {
              kind: 'category',
              name: 'Text',
              colour: '160',
              contents: [
                {
                  kind: 'block',
                  type: 'text'
                },
                {
                  kind: 'block',
                  type: 'text_join'
                },
                {
                  kind: 'block',
                  type: 'text_print'
                }
              ]
            },
            {
              kind: 'category',
              name: 'Variables',
              colour: '330',
              custom: 'VARIABLE'
            }
          ]
        },
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        },
        trashcan: true
      });

      // Cargar XML inicial si se proporciona
      if (initialXml) {
        try {
          const xml = utils.xml.textToDom(initialXml);
          Xml.domToWorkspace(xml, workspace.current);
        } catch (e) {
          console.error('Error loading initial XML:', e);
        }
      }

      // Agregar listener para cambios en el workspace
      if (onWorkspaceChange) {
        workspace.current.addChangeListener(() => {
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
  }, [initialXml, onWorkspaceChange]);

  return (
    <div className="w-full h-full">
      <div 
        ref={blocklyDiv} 
        className="w-full h-full min-h-[500px]"
        style={{ height: '600px' }}
      />
    </div>
  );
}
