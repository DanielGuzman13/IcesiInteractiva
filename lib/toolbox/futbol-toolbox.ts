export const futbolToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Control',
      colour: '270',
      contents: [
        {
          kind: 'block',
          type: 'futbol_inicio'
        },
        {
          kind: 'block',
          type: 'futbol_fin'
        },
        {
          kind: 'block',
          type: 'futbol_si'
        },
        {
          kind: 'block',
          type: 'futbol_repetir_4'
        },
        {
          kind: 'block',
          type: 'futbol_fin_si'
        }
      ]
    },
    {
      kind: 'category',
      name: 'Condiciones',
      colour: '120',
      contents: [
        {
          kind: 'block',
          type: 'futbol_defensa_cerca'
        },
        {
          kind: 'block',
          type: 'futbol_distancia_arco'
        },
        {
          kind: 'block',
          type: 'futbol_companero_libre'
        }
      ]
    },
    {
      kind: 'category',
      name: 'Acciones',
      colour: '230',
      contents: [
        {
          kind: 'block',
          type: 'futbol_avanzar'
        },
        {
          kind: 'block',
          type: 'futbol_pasar'
        },
        {
          kind: 'block',
          type: 'futbol_disparar'
        }
      ]
    }
  ]
};
