import { Generator, Block } from 'blockly';

// Definir el generador personalizado
export class CustomGenerator extends Generator {
  constructor() {
    super('CustomLanguage');
  }

  // Método para generar código a partir de un bloque
  blockToCode(block: Block): string | [string, number] {
    switch (block.type) {
      case 'text_print':
        return this.generatePrint(block);
      case 'math_number':
        return this.generateNumber(block);
      case 'controls_if':
        return this.generateIf(block);
      case 'logic_compare':
        return this.generateCompare(block);
      case 'logic_boolean':
        return this.generateBoolean(block);
      default:
        return '';
    }
  }

  private generatePrint(block: Block): string {
    // Obtener el valor del campo de texto
    const message = block.getFieldValue('TEXT') || "'Hello'";
    return `print(${message});\n`;
  }

  private generateNumber(block: Block): [string, number] {
    const code = String(block.getFieldValue('NUM'));
    return [code, this.ORDER_ATOMIC];
  }

  private generateIf(block: Block): string {
    let code = 'if (';
    // Para simplificar, generamos una estructura básica
    code += 'true) {\n';
    code += '  // Código del if\n';
    code += '}\n';
    return code;
  }

  private generateCompare(block: Block): [string, number] {
    const operator = block.getFieldValue('OP');
    const order = this.ORDER_RELATIONAL;
    
    let code = 'true'; // Simplificado
    return [code, order];
  }

  private generateBoolean(block: Block): [string, number] {
    const boolValue = block.getFieldValue('BOOL') === 'TRUE';
    return [boolValue ? 'true' : 'false', this.ORDER_ATOMIC];
  }

  // Definir precedencia de operadores
  ORDER_ATOMIC = 0;
  ORDER_NONE = 99;
  ORDER_RELATIONAL = 8;
}

// Registrar el generador
export function registerCustomGenerator() {
  // El generador se registra automáticamente al importar
  // No necesitamos registrarlo manualmente en las versiones recientes de Blockly
}
