import { Workspace } from 'blockly';

interface ValidationResult {
  isValid: boolean;
  messages: string[];
  pseudocode: string;
}

export class JugadaValidator {
  private workspace: Workspace;

  constructor(workspace: Workspace) {
    this.workspace = workspace;
  }

  validarJugada(): ValidationResult {
    const messages: string[] = [];
    let pseudocode = '';
    let isValid = true;

    // Obtener todos los bloques del workspace
    const blocks = this.workspace.getAllBlocks();
    
    // Validaciones básicas
    const validationResults = [
      this.validarEstructuraBasica(blocks),
      this.validarBloquesAccion(blocks),
      this.validarLogicaDisparo(blocks),
      this.validarCondicionDefensa(blocks),
      this.validarEstructuraIfElse(blocks)
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
      messages.push('¡Buena lógica! La jugada está bien estructurada.');
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
    if (siBlocks.length > 2) {
      messages.push('Demasiadas estructuras condicionales (máximo 2)');
      isValid = false;
    }

    return { isValid, messages };
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
      default:
        return 'condición';
    }
  }
}
