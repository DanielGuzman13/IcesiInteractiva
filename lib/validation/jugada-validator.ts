import { Workspace } from 'blockly';

interface ValidationResult {
  isValid: boolean;
  messages: string[];
  pseudocode: string;
}

export type ValidationMode = 'logica_disparo' | 'logica_ciclo' | 'logica_triangulacion';

type ActionType = 'avanzar' | 'pasar' | 'disparar' | 'fin';
type ConditionType = 'futbol_defensa_cerca' | 'futbol_distancia_arco' | 'futbol_companero_libre';

type ProgramNode =
  | { kind: 'action'; action: ActionType }
  | { kind: 'if'; condition: ConditionType; thenBranch: ProgramNode[]; elseBranch: ProgramNode[] }
  | { kind: 'repeat4'; body: ProgramNode[] };

interface StrictTemplate {
  id: string;
  sequence: ProgramNode[];
}

export class JugadaValidator {
  private workspace: Workspace;

  constructor(workspace: Workspace) {
    this.workspace = workspace;
  }

  validarJugada(mode: ValidationMode = 'logica_disparo'): ValidationResult {
    const messages: string[] = [];
    let pseudocode = '';
    let isValid = true;

    // Obtener todos los bloques del workspace
    const blocks = this.workspace.getAllBlocks();
    
    const baseValidationResults = [
      this.validarEstructuraBasica(blocks),
      this.validarBloquesAccion(blocks),
      this.validarEstructuraIfElse(blocks)
    ];

    const modeValidationResults = mode === 'logica_ciclo'
      ? [this.validarCicloContraataque(blocks)]
      : mode === 'logica_triangulacion'
        ? [this.validarLogicaTriangulacion(blocks)]
        : [this.validarLogicaDisparo(blocks)];

    const validationResults = [
      ...baseValidationResults,
      ...modeValidationResults
    ];

    // Combinar todos los mensajes
    validationResults.forEach(result => {
      messages.push(...result.messages);
      if (!result.isValid) {
        isValid = false;
      }
    });

    // Generar pseudocódigo
    pseudocode = this.generarPseudocodigo(blocks);

    // Agregar mensaje de éxito si todo es válido
    if (isValid && messages.length === 0) {
      if (mode === 'logica_ciclo') {
        messages.push('¡Excelente! La lógica de contraataque con ciclo está bien estructurada.');
      } else if (mode === 'logica_triangulacion') {
        messages.push('¡Excelente! La lógica de triangulación de pases está bien estructurada.');
      } else {
        messages.push('¡Excelente! La lógica de disparo por distancia está bien estructurada.');
      }
    }

    return {
      isValid,
      messages,
      pseudocode
    };
  }

  private validarEstructuraBasica(blocks: any[]): { isValid: boolean; messages: string[] } {
    const messages: string[] = [];
    let isValid = true;

    const hasInicio = blocks.some(block => block.type === 'futbol_inicio');
    const hasFin = blocks.some(block => block.type === 'futbol_fin');

    if (!hasInicio) {
      messages.push('Falta el bloque INICIO');
      isValid = false;
    }

    if (!hasFin) {
      messages.push('Falta el bloque FIN');
      isValid = false;
    }

    return { isValid, messages };
  }

  private validarBloquesAccion(blocks: any[]): { isValid: boolean; messages: string[] } {
    const messages: string[] = [];
    let isValid = true;

    const actionBlocks = blocks.filter(block => 
      ['futbol_avanzar', 'futbol_pasar', 'futbol_disparar'].includes(block.type)
    );

    if (actionBlocks.length > 6) {
      messages.push('Demasiados bloques de acción (máximo 6)');
      isValid = false;
    }

    const hasDisparo = blocks.some(block => block.type === 'futbol_disparar');
    if (!hasDisparo) {
      messages.push('La jugada debe incluir un bloque "disparar"');
      isValid = false;
    }

    return { isValid, messages };
  }

  private validarLogicaDisparo(blocks: any[]): { isValid: boolean; messages: string[] } {
    return this.validarContraPlantillas(blocks, 'logica_disparo');
  }

  private validarCondicionDefensa(blocks: any[]): { isValid: boolean; messages: string[] } {
    const messages: string[] = [];
    let isValid = true;

    // Verificar si hay bloques de defensa cerca
    const defensaBlocks = blocks.filter(block => block.type === 'futbol_defensa_cerca');
    
    if (defensaBlocks.length > 0) {
      // Verificar si se maneja la condición de defensa
      const siBlocks = blocks.filter(block => block.type === 'futbol_si');
      
      let defensaManejada = false;
      siBlocks.forEach(siBlock => {
        const conditionBlock = siBlock.getInputTargetBlock('CONDITION');
        if (conditionBlock && conditionBlock.type === 'futbol_defensa_cerca') {
          defensaManejada = true;
        }
      });

      if (!defensaManejada) {
        messages.push('No se ignora la condición de defensa');
        isValid = false;
      }
    }

    return { isValid, messages };
  }

  private validarEstructuraIfElse(blocks: any[]): { isValid: boolean; messages: string[] } {
    const messages: string[] = [];
    let isValid = true;

    const siBlocks = blocks.filter(block => block.type === 'futbol_si');
    
    // Verificar que no haya estructuras anidadas complejas
    if (siBlocks.length > 3) {
      messages.push('Demasiadas estructuras condicionales (máximo 3)');
      isValid = false;
    }

    return { isValid, messages };
  }

  private validarCicloContraataque(blocks: any[]): { isValid: boolean; messages: string[] } {
    return this.validarContraPlantillas(blocks, 'logica_ciclo');
  }

  private validarLogicaTriangulacion(blocks: any[]): { isValid: boolean; messages: string[] } {
    return this.validarContraPlantillas(blocks, 'logica_triangulacion');
  }

  private validarContraPlantillas(blocks: any[], mode: ValidationMode): { isValid: boolean; messages: string[] } {
    const parseResult = this.construirProgramaEstructurado(blocks);
    if (!parseResult.isValid) {
      return { isValid: false, messages: parseResult.messages };
    }

    const templates = this.obtenerPlantillasEstrictas(mode);
    const coincide = templates.some(template => this.coincideSecuencia(parseResult.sequence, template.sequence));

    if (coincide) {
      return { isValid: true, messages: [] };
    }

    return {
      isValid: false,
      messages: [
        'La jugada no coincide con una opción estricta permitida para esta lógica.',
        ...this.obtenerMensajesPlantillasPermitidas(mode)
      ]
    };
  }

  private construirProgramaEstructurado(blocks: any[]): { isValid: boolean; messages: string[]; sequence: ProgramNode[] } {
    const messages: string[] = [];

    const inicioBlocks = blocks.filter(block => block.type === 'futbol_inicio');
    if (inicioBlocks.length !== 1) {
      messages.push('Debe existir exactamente un bloque INICIO.');
      return { isValid: false, messages, sequence: [] };
    }

    const finBlocks = blocks.filter(block => block.type === 'futbol_fin');
    if (finBlocks.length !== 1) {
      messages.push('Debe existir exactamente un bloque FIN.');
      return { isValid: false, messages, sequence: [] };
    }

    const inicio = inicioBlocks[0];
    const sequence = this.parsearSecuencia(inicio.getNextBlock(), messages);

    if (messages.length > 0) {
      return { isValid: false, messages, sequence: [] };
    }

    if (sequence.length === 0) {
      messages.push('La jugada no tiene pasos después de INICIO.');
      return { isValid: false, messages, sequence: [] };
    }

    const ultimo = sequence[sequence.length - 1];
    if (!(ultimo.kind === 'action' && ultimo.action === 'fin')) {
      messages.push('La jugada debe terminar con FIN como último paso principal.');
      return { isValid: false, messages, sequence: [] };
    }

    const finTopLevel = sequence.filter(node => node.kind === 'action' && node.action === 'fin').length;
    if (finTopLevel !== 1) {
      messages.push('Solo se permite un bloque FIN en la secuencia principal.');
      return { isValid: false, messages, sequence: [] };
    }

    if (this.contieneFinAnidado(sequence.slice(0, -1))) {
      messages.push('FIN no puede estar dentro de ramas SI/SINO ni dentro de REPETIR.');
      return { isValid: false, messages, sequence: [] };
    }

    const visitados = new Set<string>();
    this.recorrerConexiones(inicio, visitados);

    const noConectados = blocks.filter(block => !visitados.has(block.id));
    if (noConectados.length > 0) {
      messages.push('Hay bloques sueltos o fuera del flujo principal. Elimina los bloques no conectados.');
      return { isValid: false, messages, sequence: [] };
    }

    return { isValid: true, messages, sequence };
  }

  private parsearSecuencia(startBlock: any, messages: string[]): ProgramNode[] {
    const sequence: ProgramNode[] = [];
    let actual = startBlock;

    while (actual) {
      const node = this.parsearNodo(actual, messages);
      if (!node) {
        return [];
      }

      sequence.push(node);
      actual = actual.getNextBlock();
    }

    return sequence;
  }

  private parsearNodo(block: any, messages: string[]): ProgramNode | null {
    switch (block.type) {
      case 'futbol_avanzar':
        return { kind: 'action', action: 'avanzar' };
      case 'futbol_pasar':
        return { kind: 'action', action: 'pasar' };
      case 'futbol_disparar':
        return { kind: 'action', action: 'disparar' };
      case 'futbol_fin':
        return { kind: 'action', action: 'fin' };
      case 'futbol_si': {
        const conditionBlock = block.getInputTargetBlock('CONDITION');
        if (!conditionBlock || !this.esCondicionValida(conditionBlock.type)) {
          messages.push('Cada bloque SI debe tener una condición válida (defensa cerca, distancia al arco o compañero libre).');
          return null;
        }

        const thenBranch = this.parsearSecuencia(block.getInputTargetBlock('THEN'), messages);
        const elseBranch = this.parsearSecuencia(block.getInputTargetBlock('ELSE'), messages);
        if (messages.length > 0) {
          return null;
        }

        return {
          kind: 'if',
          condition: conditionBlock.type,
          thenBranch,
          elseBranch
        };
      }
      case 'futbol_repetir_4': {
        const body = this.parsearSecuencia(block.getInputTargetBlock('DO'), messages);
        if (messages.length > 0) {
          return null;
        }

        return {
          kind: 'repeat4',
          body
        };
      }
      case 'futbol_inicio':
        messages.push('INICIO no puede estar anidado dentro de la secuencia.');
        return null;
      default:
        messages.push(`Bloque no permitido en validación estricta: ${block.type}`);
        return null;
    }
  }

  private recorrerConexiones(block: any, visitados: Set<string>): void {
    if (!block || visitados.has(block.id)) {
      return;
    }

    visitados.add(block.id);

    this.recorrerConexiones(block.getNextBlock(), visitados);
    this.recorrerConexiones(block.getInputTargetBlock('CONDITION'), visitados);
    this.recorrerConexiones(block.getInputTargetBlock('THEN'), visitados);
    this.recorrerConexiones(block.getInputTargetBlock('ELSE'), visitados);
    this.recorrerConexiones(block.getInputTargetBlock('DO'), visitados);
  }

  private contieneFinAnidado(sequence: ProgramNode[]): boolean {
    for (const node of sequence) {
      if (node.kind === 'action' && node.action === 'fin') {
        return true;
      }

      if (node.kind === 'if') {
        if (this.contieneFinAnidado(node.thenBranch) || this.contieneFinAnidado(node.elseBranch)) {
          return true;
        }
      }

      if (node.kind === 'repeat4') {
        if (this.contieneFinAnidado(node.body)) {
          return true;
        }
      }
    }

    return false;
  }

  private coincideSecuencia(actual: ProgramNode[], expected: ProgramNode[]): boolean {
    if (actual.length !== expected.length) {
      return false;
    }

    for (let index = 0; index < actual.length; index += 1) {
      if (!this.coincideNodo(actual[index], expected[index])) {
        return false;
      }
    }

    return true;
  }

  private coincideNodo(actual: ProgramNode, expected: ProgramNode): boolean {
    if (actual.kind !== expected.kind) {
      return false;
    }

    if (actual.kind === 'action' && expected.kind === 'action') {
      return actual.action === expected.action;
    }

    if (actual.kind === 'if' && expected.kind === 'if') {
      return actual.condition === expected.condition &&
        this.coincideSecuencia(actual.thenBranch, expected.thenBranch) &&
        this.coincideSecuencia(actual.elseBranch, expected.elseBranch);
    }

    if (actual.kind === 'repeat4' && expected.kind === 'repeat4') {
      return this.coincideSecuencia(actual.body, expected.body);
    }

    return false;
  }

  private esCondicionValida(conditionType: string): conditionType is ConditionType {
    return ['futbol_defensa_cerca', 'futbol_distancia_arco', 'futbol_companero_libre'].includes(conditionType);
  }

  private accion(action: ActionType): ProgramNode {
    return { kind: 'action', action };
  }

  private si(condition: ConditionType, thenBranch: ProgramNode[], elseBranch: ProgramNode[]): ProgramNode {
    return { kind: 'if', condition, thenBranch, elseBranch };
  }

  private repetir4(body: ProgramNode[]): ProgramNode {
    return { kind: 'repeat4', body };
  }

  private obtenerPlantillasEstrictas(mode: ValidationMode): StrictTemplate[] {
    if (mode === 'logica_disparo') {
      return [
        {
          id: 'A1.1',
          sequence: [
            this.si('futbol_defensa_cerca', [this.accion('pasar')], [this.accion('avanzar')]),
            this.si('futbol_distancia_arco', [this.accion('disparar')], [this.accion('pasar')]),
            this.accion('fin')
          ]
        },
        {
          id: 'A1.2',
          sequence: [
            this.si('futbol_defensa_cerca', [this.accion('pasar')], [this.accion('avanzar')]),
            this.accion('avanzar'),
            this.si('futbol_distancia_arco', [this.accion('disparar')], [this.accion('pasar')]),
            this.accion('fin')
          ]
        },
        {
          id: 'A1.3',
          sequence: [
            this.si('futbol_defensa_cerca', [this.accion('pasar')], [this.accion('avanzar')]),
            this.accion('pasar'),
            this.si('futbol_distancia_arco', [this.accion('disparar')], [this.accion('avanzar')]),
            this.accion('fin')
          ]
        },
        {
          id: 'A1.4',
          sequence: [
            this.si(
              'futbol_defensa_cerca',
              [this.accion('pasar')],
              [
                this.accion('avanzar'),
                this.si('futbol_distancia_arco', [this.accion('disparar')], [this.accion('pasar')])
              ]
            ),
            this.accion('fin')
          ]
        }
      ];
    }

    if (mode === 'logica_ciclo') {
      return [
        {
          id: 'A2.1',
          sequence: [
            this.repetir4([
              this.si('futbol_defensa_cerca', [this.accion('pasar')], [this.accion('avanzar')])
            ]),
            this.si('futbol_distancia_arco', [this.accion('disparar')], [this.accion('pasar')]),
            this.accion('fin')
          ]
        },
        {
          id: 'A2.2',
          sequence: [
            this.repetir4([
              this.si('futbol_defensa_cerca', [this.accion('avanzar')], [this.accion('avanzar')])
            ]),
            this.si('futbol_distancia_arco', [this.accion('disparar')], [this.accion('pasar')]),
            this.accion('fin')
          ]
        },
        {
          id: 'A2.3',
          sequence: [
            this.repetir4([
              this.si('futbol_defensa_cerca', [this.accion('pasar')], [this.accion('avanzar')])
            ]),
            this.accion('pasar'),
            this.si('futbol_distancia_arco', [this.accion('disparar')], [this.accion('pasar')]),
            this.accion('fin')
          ]
        },
        {
          id: 'A2.4',
          sequence: [
            this.repetir4([
              this.si('futbol_defensa_cerca', [this.accion('avanzar')], [this.accion('pasar')])
            ]),
            this.si('futbol_distancia_arco', [this.accion('disparar')], [this.accion('pasar')]),
            this.accion('fin')
          ]
        }
      ];
    }

    return [
      {
        id: 'A3.1',
        sequence: [
          this.si('futbol_companero_libre', [this.accion('pasar')], [this.accion('avanzar')]),
          this.accion('pasar'),
          this.si('futbol_distancia_arco', [this.accion('disparar')], [this.accion('pasar')]),
          this.accion('fin')
        ]
      },
      {
        id: 'A3.2',
        sequence: [
          this.si('futbol_companero_libre', [this.accion('pasar')], [this.accion('pasar')]),
          this.accion('pasar'),
          this.si('futbol_distancia_arco', [this.accion('disparar')], [this.accion('pasar')]),
          this.accion('fin')
        ]
      },
      {
        id: 'A3.3',
        sequence: [
          this.si('futbol_companero_libre', [this.accion('pasar')], [this.accion('avanzar')]),
          this.accion('pasar'),
          this.accion('avanzar'),
          this.si('futbol_distancia_arco', [this.accion('disparar')], [this.accion('pasar')]),
          this.accion('fin')
        ]
      }
    ];
  }

  private obtenerMensajesPlantillasPermitidas(mode: ValidationMode): string[] {
    if (mode === 'logica_disparo') {
      return [
        'Opciones válidas Lógica 1:',
        'A1.1: SI defensa_cerca (pasar / avanzar) -> SI distancia<20 (disparar / pasar) -> FIN',
        'A1.2: SI defensa_cerca (pasar / avanzar) -> avanzar -> SI distancia<20 (disparar / pasar) -> FIN',
        'A1.3: SI defensa_cerca (pasar / avanzar) -> pasar -> SI distancia<20 (disparar / avanzar) -> FIN',
        'A1.4: SI defensa_cerca (pasar / [avanzar -> SI distancia<20 (disparar / pasar)]) -> FIN'
      ];
    }

    if (mode === 'logica_ciclo') {
      return [
        'Opciones válidas Lógica 2:',
        'A2.1: REPETIR 4 { SI defensa_cerca (pasar / avanzar) } -> SI distancia<20 (disparar / pasar) -> FIN',
        'A2.2: REPETIR 4 { SI defensa_cerca (avanzar / avanzar) } -> SI distancia<20 (disparar / pasar) -> FIN',
        'A2.3: REPETIR 4 { SI defensa_cerca (pasar / avanzar) } -> pasar -> SI distancia<20 (disparar / pasar) -> FIN',
        'A2.4: REPETIR 4 { SI defensa_cerca (avanzar / pasar) } -> SI distancia<20 (disparar / pasar) -> FIN'
      ];
    }

    return [
      'Opciones válidas Lógica 3:',
      'A3.1: SI compañero_libre (pasar / avanzar) -> pasar -> SI distancia<20 (disparar / pasar) -> FIN',
      'A3.2: SI compañero_libre (pasar / pasar) -> pasar -> SI distancia<20 (disparar / pasar) -> FIN',
      'A3.3: SI compañero_libre (pasar / avanzar) -> pasar -> avanzar -> SI distancia<20 (disparar / pasar) -> FIN'
    ];
  }

  private secuenciaContieneTipo(block: any, blockType: string): boolean {
    let actual = block;

    while (actual) {
      if (actual.type === blockType) {
        return true;
      }

      if (actual.type === 'futbol_si') {
        const thenBlock = actual.getInputTargetBlock('THEN');
        const elseBlock = actual.getInputTargetBlock('ELSE');

        if (this.secuenciaContieneTipo(thenBlock, blockType) || this.secuenciaContieneTipo(elseBlock, blockType)) {
          return true;
        }
      }

      if (actual.type === 'futbol_repetir_4') {
        const doBlock = actual.getInputTargetBlock('DO');
        if (this.secuenciaContieneTipo(doBlock, blockType)) {
          return true;
        }
      }

      actual = actual.getNextBlock();
    }

    return false;
  }

  private existeSiConCondicion(block: any, conditionType: string): boolean {
    let actual = block;

    while (actual) {
      if (actual.type === 'futbol_si') {
        const conditionBlock = actual.getInputTargetBlock('CONDITION');
        if (conditionBlock && conditionBlock.type === conditionType) {
          return true;
        }

        const thenBlock = actual.getInputTargetBlock('THEN');
        const elseBlock = actual.getInputTargetBlock('ELSE');
        if (this.existeSiConCondicion(thenBlock, conditionType) || this.existeSiConCondicion(elseBlock, conditionType)) {
          return true;
        }
      }

      if (actual.type === 'futbol_repetir_4') {
        const doBlock = actual.getInputTargetBlock('DO');
        if (this.existeSiConCondicion(doBlock, conditionType)) {
          return true;
        }
      }

      actual = actual.getNextBlock();
    }

    return false;
  }

  private generarPseudocodigo(blocks: any[]): string {
    let pseudocode = '';
    
    // Ordenar bloques por posición para generar el código en secuencia
    const sortedBlocks = blocks.sort((a, b) => {
      const aY = a.getRelativeToSurfaceXY().y;
      const bY = b.getRelativeToSurfaceXY().y;
      return aY - bY;
    });

    // Encontrar el bloque INICIO
    const inicioBlock = sortedBlocks.find(block => block.type === 'futbol_inicio');
    
    if (inicioBlock) {
      pseudocode = this.generarCodigoDesdeBloque(inicioBlock);
    }

    return pseudocode;
  }

  private generarCodigoDesdeBloque(block: any): string {
    let codigo = '';
    
    if (!block) return codigo;

    // Generar código según el tipo de bloque
    switch (block.type) {
      case 'futbol_inicio':
        codigo += 'INICIO\n';
        break;
      case 'futbol_fin':
        codigo += 'FIN\n';
        break;
      case 'futbol_si':
        const conditionBlock = block.getInputTargetBlock('CONDITION');
        const conditionName = conditionBlock ? this.getConditionName(conditionBlock.type) : 'condición';
        
        codigo += `SI ${conditionName}\n`;
        
        // Generar código del bloque THEN
        const thenBlock = block.getInputTargetBlock('THEN');
        if (thenBlock) {
          codigo += this.generarCodigoDesdeBloque(thenBlock);
        }
        
        // Generar código del bloque ELSE
        const elseBlock = block.getInputTargetBlock('ELSE');
        if (elseBlock) {
          codigo += 'SINO\n';
          codigo += this.generarCodigoDesdeBloque(elseBlock);
        }
        
        codigo += 'FIN SI\n';
        break;
      case 'futbol_repetir_4':
        codigo += 'REPETIR 4 VECES\n';
        const doBlock = block.getInputTargetBlock('DO');
        if (doBlock) {
          codigo += this.generarCodigoDesdeBloque(doBlock);
        }
        codigo += 'FIN REPETIR\n';
        break;
      case 'futbol_avanzar':
        codigo += 'avanzar\n';
        break;
      case 'futbol_pasar':
        codigo += 'pasar balón\n';
        break;
      case 'futbol_disparar':
        codigo += 'disparar\n';
        break;
    }

    // Generar código del siguiente bloque
    const nextBlock = block.getNextBlock();
    if (nextBlock) {
      codigo += this.generarCodigoDesdeBloque(nextBlock);
    }

    return codigo;
  }

  private getConditionName(blockType: string): string {
    switch (blockType) {
      case 'futbol_defensa_cerca':
        return 'hay defensa cerca';
      case 'futbol_distancia_arco':
        return 'distancia al arco < 20';
      case 'futbol_companero_libre':
        return 'hay compañero libre';
      default:
        return 'condición';
    }
  }
}
