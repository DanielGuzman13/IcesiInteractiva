import { Workspace } from 'blockly';

interface ValidationResult {
  isValid: boolean;
  messages: string[];
  pseudocode: string;
}

export type ValidationMode = 'logica_disparo' | 'logica_ciclo' | 'logica_triangulacion';

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
        : [
            this.validarLogicaDisparo(blocks),
            this.validarCondicionDefensa(blocks)
          ];

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
    const messages: string[] = [];
    let isValid = true;

    // Buscar el bloque disparar
    const disparoBlock = blocks.find(block => block.type === 'futbol_disparar');
    
    if (disparoBlock) {
      // Verificar si está dentro de una estructura condicional
      const parentBlock = disparoBlock.getParent();
      if (!parentBlock || parentBlock.type !== 'futbol_si') {
        messages.push('Falta condición antes de disparar');
        isValid = false;
      }

      // Verificar si la condición incluye distancia al arco
      if (parentBlock && parentBlock.type === 'futbol_si') {
        const conditionBlock = parentBlock.getInputTargetBlock('CONDITION');
        if (!conditionBlock || conditionBlock.type !== 'futbol_distancia_arco') {
          messages.push('Debes verificar la distancia al arco antes de disparar');
          isValid = false;
        }
      }
    }

    return { isValid, messages };
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
    const messages: string[] = [];
    let isValid = true;

    const cicloBlocks = blocks.filter(block => block.type === 'futbol_repetir_4');

    if (cicloBlocks.length === 0) {
      messages.push('Debes usar el bloque "REPETIR 4 VECES" para avanzar 20 metros en intervalos de 5.');
      return { isValid: false, messages };
    }

    if (cicloBlocks.length > 1) {
      messages.push('Usa solo un bloque "REPETIR 4 VECES" para esta jugada.');
      isValid = false;
    }

    const ciclo = cicloBlocks[0];
    const bloqueInicialCiclo = ciclo.getInputTargetBlock('DO');

    if (!bloqueInicialCiclo) {
      messages.push('El ciclo debe contener acciones en su interior.');
      return { isValid: false, messages };
    }

    const tieneAvanzar = this.secuenciaContieneTipo(bloqueInicialCiclo, 'futbol_avanzar');
    if (!tieneAvanzar) {
      messages.push('Dentro del ciclo debes incluir "avanzar" (cada iteración representa 5 metros).');
      isValid = false;
    }

    const tieneDecisionDefensa = this.existeSiConCondicion(bloqueInicialCiclo, 'futbol_defensa_cerca');
    if (!tieneDecisionDefensa) {
      messages.push('Dentro del ciclo debes evaluar "hay defensa cerca" con un bloque SI.');
      isValid = false;
    }

    const tieneCierrePorDistancia = blocks.some(block => {
      if (block.type !== 'futbol_si') return false;

      const condicion = block.getInputTargetBlock('CONDITION');
      if (!condicion || condicion.type !== 'futbol_distancia_arco') return false;

      const thenBlock = block.getInputTargetBlock('THEN');
      const elseBlock = block.getInputTargetBlock('ELSE');

      return this.secuenciaContieneTipo(thenBlock, 'futbol_disparar') &&
        this.secuenciaContieneTipo(elseBlock, 'futbol_pasar');
    });

    if (!tieneCierrePorDistancia) {
      messages.push('Después del ciclo debes cerrar con: SI distancia al arco < 20 ENTONCES disparar, SINO pasar balón.');
      isValid = false;
    }

    return { isValid, messages };
  }

  private validarLogicaTriangulacion(blocks: any[]): { isValid: boolean; messages: string[] } {
    const messages: string[] = [];
    let isValid = true;

    const pases = blocks.filter(block => block.type === 'futbol_pasar');
    if (pases.length < 2) {
      messages.push('La triangulación requiere al menos 2 bloques "pasar balón" antes del remate.');
      isValid = false;
    }

    const siConCompaneroLibre = blocks.some(block => {
      if (block.type !== 'futbol_si') return false;
      const conditionBlock = block.getInputTargetBlock('CONDITION');
      return conditionBlock && conditionBlock.type === 'futbol_companero_libre';
    });

    if (!siConCompaneroLibre) {
      messages.push('Debes usar un bloque SI con la condición "hay compañero libre".');
      isValid = false;
    }

    const tieneCierrePorDistancia = blocks.some(block => {
      if (block.type !== 'futbol_si') return false;

      const condicion = block.getInputTargetBlock('CONDITION');
      if (!condicion || condicion.type !== 'futbol_distancia_arco') return false;

      const thenBlock = block.getInputTargetBlock('THEN');
      const elseBlock = block.getInputTargetBlock('ELSE');

      return this.secuenciaContieneTipo(thenBlock, 'futbol_disparar') &&
        this.secuenciaContieneTipo(elseBlock, 'futbol_pasar');
    });

    if (!tieneCierrePorDistancia) {
      messages.push('Cierra la jugada con: SI distancia al arco < 20 ENTONCES disparar, SINO pasar balón.');
      isValid = false;
    }

    return { isValid, messages };
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
