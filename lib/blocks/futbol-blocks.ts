import { Blocks } from 'blockly';

// Definir los bloques personalizados para fútbol
export function defineFutbolBlocks() {
  // Bloques de Control (Naranja)
  Blocks['futbol_inicio'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('INICIO');
      this.setNextStatement(true, null);
      this.setColour(270); // Naranja
      this.setTooltip('Comienzo de la jugada');
    }
  };

  Blocks['futbol_fin'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('FIN');
      this.setPreviousStatement(true, null);
      this.setColour(270); // Naranja
      this.setTooltip('Fin de la jugada');
    }
  };

  Blocks['futbol_si'] = {
    init: function() {
      this.appendValueInput('CONDITION')
        .setCheck('Boolean')
        .appendField('SI');
      this.appendStatementInput('THEN')
        .appendField('entonces');
      this.appendStatementInput('ELSE')
        .appendField('SINO');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(270); // Naranja
      this.setTooltip('Estructura condicional SI/SINO');
    }
  };


  Blocks['futbol_repetir_4'] = {
    init: function() {
      this.appendStatementInput('DO')
        .appendField('REPETIR 4 VECES (avanzar 5 metros)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(270); // Naranja
      this.setTooltip('Repite las acciones internas 4 veces (20 metros en tramos de 5).');
    }
  };

  // Bloques de Condición (Verde)
  Blocks['futbol_defensa_cerca'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('hay defensa cerca');
      this.setOutput(true, 'Boolean');
      this.setColour(120); // Verde
      this.setTooltip('Verifica si hay un defensor cercano');
    }
  };

  Blocks['futbol_distancia_arco'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('distancia al arco < 20');
      this.setOutput(true, 'Boolean');
      this.setColour(120); // Verde
      this.setTooltip('Verifica si está a menos de 20 metros del arco');
    }
  };

  // Bloques de Acción (Azul)
  Blocks['futbol_avanzar'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('avanzar');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230); // Azul
      this.setTooltip('Avanzar con el balón');
    }
  };

  Blocks['futbol_pasar'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('pasar balón');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230); // Azul
      this.setTooltip('Pasar el balón a un compañero');
    }
  };

  Blocks['futbol_disparar'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('disparar');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230); // Azul
      this.setTooltip('Disparar al arco');
    }
  };
}

// Definir el generador para los bloques (sin JavaScript dependency)
export function registerFutbolGenerators() {
  // Los generadores se manejarán desde el validador
}
