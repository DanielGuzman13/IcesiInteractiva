'use client';

import React, { useState, DragEvent, useEffect } from 'react';

interface Atributo {
  id: string;
  nombre: string;
  tipo: string;
  claseId: string | null;
  esCorrecto: boolean;
}

interface ClaseConAtributos {
  id: string;
  nombre: string;
  atributosAsignados: Atributo[];
}

const Actividad2AsignarAtributos: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  // Clases identificadas en la actividad anterior
  const [clases, setClases] = useState<ClaseConAtributos[]>([
    {
      id: 'equipo',
      nombre: 'Equipo',
      atributosAsignados: []
    },
    {
      id: 'jugador',
      nombre: 'Jugador',
      atributosAsignados: []
    },
    {
      id: 'partido',
      nombre: 'Partido',
      atributosAsignados: []
    },
    {
      id: 'estadistica',
      nombre: 'Estadistica',
      atributosAsignados: []
    },
    {
      id: 'tactica',
      nombre: 'Tactica',
      atributosAsignados: []
    }
  ]);

  // Atributos disponibles - más asignados previamente (solo 7 por organizar)
  const [atributosDisponibles, setAtributosDisponibles] = useState<Atributo[]>([
    { id: 'a1', nombre: 'nombreEquipo', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a2', nombre: 'jugadores', tipo: 'Jugador[]', claseId: null, esCorrecto: false },
    { id: 'a3', nombre: 'puntos', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a4', nombre: 'nombre', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a5', nombre: 'posicion', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a6', nombre: 'fecha', tipo: 'Date', claseId: null, esCorrecto: false },
    { id: 'a7', nombre: 'resultado', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a8', nombre: 'goles', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a9', nombre: 'asistencias', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a10', nombre: 'formacion', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a11', nombre: 'estrategia', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a12', nombre: 'tiempoJugado', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a13', nombre: 'tarjetasAmarillas', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a14', nombre: 'tarjetasRojas', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'd1', nombre: 'colorCamiseta', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'd2', nombre: 'estadio', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'd3', nombre: 'arbitro', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'd4', nombre: 'temperatura', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'd5', nombre: 'publico', tipo: 'number', claseId: null, esCorrecto: false }
  ]);

  const [draggedAttribute, setDraggedAttribute] = useState<string | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [mensajeEmergente, setMensajeEmergente] = useState<string | null>(null);

  // Respuestas correctas para validar
  const respuestasCorrectas = {
    equipo: ['nombreEquipo', 'jugadores', 'puntos'],
    jugador: ['nombre', 'posicion', 'goles', 'asistencias', 'tiempoJugado', 'tarjetasAmarillas', 'tarjetasRojas'],
    partido: ['fecha', 'resultado', 'estadio', 'arbitro'],
    estadistica: ['goles', 'asistencias', 'tiempoJugado'],
    tactica: ['formacion', 'estrategia']
  };

  // Mensajes de analogías arquitecto-fútbol
  const mensajesArquitecto = [
    "El arquitecto diseña las clases como un técnico define la formación del equipo.",
    "Cada atributo es como una habilidad específica que necesita un jugador.",
    "La estructura del sistema es como el esquema táctico de un partido.",
    "Los atributos correctos en cada clase son como poner al jugador en su posición ideal.",
    "Un buen diseño es como una estrategia bien ejecutada en el campo.",
    "La arquitectura de software es el plan de juego que guía al equipo de desarrollo.",
    "Las relaciones entre clases son como los pases entre jugadores.",
    "Un atributo mal ubicado es como un jugador fuera de posición."
  ];

  // Inicializar con más atributos ya asignados (solo 7 por organizar)
  useEffect(() => {
    const asignacionesPredefinidas = [
      { atributoId: 'a1', claseId: 'equipo' }, // nombreEquipo -> Equipo
      { atributoId: 'a2', claseId: 'equipo' }, // jugadores -> Equipo
      { atributoId: 'a4', claseId: 'jugador' }, // nombre -> Jugador
      { atributoId: 'a5', claseId: 'jugador' }, // posicion -> Jugador
      { atributoId: 'a6', claseId: 'partido' }, // fecha -> Partido
      { atributoId: 'a10', claseId: 'tactica' }, // formacion -> Tactica
      { atributoId: 'a8', claseId: 'estadistica' } // goles -> Estadistica
    ];

    const atributosActualizados = atributosDisponibles.map(atributo => {
      const asignacion = asignacionesPredefinidas.find(a => a.atributoId === atributo.id);
      if (asignacion) {
        return {
          ...atributo,
          claseId: asignacion.claseId,
          esCorrecto: respuestasCorrectas[asignacion.claseId as keyof typeof respuestasCorrectas].includes(atributo.nombre)
        };
      }
      return atributo;
    });

    setAtributosDisponibles(atributosActualizados);

    // Actualizar clases con los atributos preasignados
    const clasesActualizadas = clases.map(clase => {
      const atributosDeClase = atributosActualizados.filter(a => a.claseId === clase.id);
      return { ...clase, atributosAsignados: atributosDeClase };
    });

    setClases(clasesActualizadas);

    // Mostrar mensaje inicial
    setTimeout(() => {
      mostrarMensajeAleatorio();
    }, 1000);
  }, []);

  const mostrarMensajeAleatorio = () => {
    const mensajeAleatorio = mensajesArquitecto[Math.floor(Math.random() * mensajesArquitecto.length)];
    setMensajeEmergente(mensajeAleatorio);
    setTimeout(() => setMensajeEmergente(null), 4000);
  };

  const handleDragStart = (e: DragEvent, atributoId: string) => {
    setDraggedAttribute(atributoId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: DragEvent, claseId: string) => {
    e.preventDefault();
    
    if (!draggedAttribute) return;

    const atributo = atributosDisponibles.find(a => a.id === draggedAttribute);
    if (!atributo || atributo.claseId) return;

    // Asignar atributo a la clase
    const atributoActualizado = {
      ...atributo,
      claseId,
      esCorrecto: respuestasCorrectas[claseId as keyof typeof respuestasCorrectas].includes(atributo.nombre)
    };

    // Actualizar atributos disponibles
    setAtributosDisponibles(prev => prev.map(a => 
      a.id === draggedAttribute ? atributoActualizado : a
    ));

    // Actualizar clase
    setClases(prev => prev.map(clase => 
      clase.id === claseId 
        ? { ...clase, atributosAsignados: [...clase.atributosAsignados, atributoActualizado] }
        : clase
    ));

    setDraggedAttribute(null);

    // Mostrar mensaje ocasionalmente
    if (Math.random() > 0.7) {
      mostrarMensajeAleatorio();
    }
  };

  const handleRemoveAttribute = (claseId: string, atributoId: string) => {
    // Liberar atributo
    setAtributosDisponibles(prev => prev.map(a => 
      a.id === atributoId ? { ...a, claseId: null, esCorrecto: false } : a
    ));

    // Quitar de la clase
    setClases(prev => prev.map(clase => 
      clase.id === claseId 
        ? { ...clase, atributosAsignados: clase.atributosAsignados.filter(a => a.id !== atributoId) }
        : clase
    ));
  };

  const calcularScore = () => {
    let correctas = 0;
    let incorrectas = 0;

    clases.forEach(clase => {
      clase.atributosAsignados.forEach(atributo => {
        if (atributo.esCorrecto) correctas++;
        else incorrectas++;
      });
    });

    // 10 pts por cada correcta, -5 pts por cada incorrecta
    return Math.max(0, (correctas * 10) - (incorrectas * 5));
  };

  const handleSubmit = () => {
    setMostrarResultado(true);
    const score = calcularScore();
    
    // Mostrar mensaje final
    setMensajeEmergente("¡Como un arquitecto que finaliza su diseño, has organizado la estructura del sistema!");
    setTimeout(() => onComplete(score), 3000);
  };

  const resetActivity = () => {
    // Liberar todos los atributos excepto los preasignados
    const asignacionesPredefinidas = ['a1', 'a2', 'a4', 'a5', 'a6', 'a10', 'a8'];
    
    setAtributosDisponibles(prev => prev.map(a => 
      asignacionesPredefinidas.includes(a.id) ? a : { ...a, claseId: null, esCorrecto: false }
    ));
    
    // Limpiar clases manteniendo atributos preasignados
    setClases(prev => prev.map(clase => ({
      ...clase, 
      atributosAsignados: clase.atributosAsignados.filter(a => asignacionesPredefinidas.includes(a.id))
    })));
    
    setMostrarResultado(false);
    setDraggedAttribute(null);
  };

  const todosAsignados = atributosDisponibles.filter(a => a.claseId).length >= 14; // 7 preasignados + 7 por asignar

  return (
    <div className="w-full relative">
      {/* Mensaje Emergente */}
      {mensajeEmergente && (
        <div className="fixed top-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm animate-pulse">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{'\ud83c\udfc6'}</span>
            <p className="text-sm font-medium">{mensajeEmergente}</p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Actividad 2: Asignación de Atributos</h3>
        <p className="text-gray-600 text-sm">
          La mayoría de los atributos ya están organizados. Solo necesitas asignar los 7 atributos restantes 
          en las clases correctas según su responsabilidad en el sistema.
        </p>
      </div>

      {/* Panel de atributos disponibles */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Atributos por Organizar:</h4>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-lg">
          {atributosDisponibles.filter(a => !a.claseId).map(atributo => (
            <div
              key={atributo.id}
              draggable
              onDragStart={(e) => handleDragStart(e, atributo.id)}
              className="bg-purple-100 hover:bg-purple-200 border-2 border-purple-300 rounded-lg px-3 py-2 cursor-move transition-colors select-none"
            >
              <span className="font-medium text-gray-800 text-sm">{atributo.nombre}</span>
              <span className="text-xs text-purple-600 ml-1">({atributo.tipo})</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {atributosDisponibles.filter(a => !a.claseId).length} atributos por organizar
        </div>
      </div>

      {/* Clases con sus atributos (la mayoría ya asignados) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {clases.map(clase => (
          <div
            key={clase.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, clase.id)}
            className={`border-2 rounded-xl p-4 transition-all ${
              mostrarResultado
                ? 'bg-gray-50 border-gray-300'
                : 'bg-white border-gray-400 hover:border-purple-400'
            }`}
          >
            <h5 className="font-bold text-gray-800 mb-3 text-center">{clase.nombre}</h5>
            <div className="min-h-[120px] space-y-2">
              {clase.atributosAsignados.length === 0 ? (
                <div className="text-gray-400 text-sm text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                  Arrastra atributos aquí
                </div>
              ) : (
                clase.atributosAsignados.map(atributo => (
                  <div
                    key={atributo.id}
                    className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                      mostrarResultado
                        ? atributo.esCorrecto
                          ? 'bg-green-100 border border-green-300'
                          : 'bg-red-100 border border-red-300'
                        : atributo.claseId && ['a1', 'a2', 'a4', 'a5', 'a6', 'a10', 'a8'].includes(atributo.id)
                          ? 'bg-blue-100 border border-blue-300'
                          : 'bg-purple-50 border border-purple-200'
                    }`}
                  >
                    <div>
                      <span className={`font-medium ${mostrarResultado && !atributo.esCorrecto ? 'text-red-600' : 'text-gray-700'}`}>
                        {atributo.nombre}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">({atributo.tipo})</span>
                    </div>
                    {!mostrarResultado && !['a1', 'a2', 'a4', 'a5', 'a6', 'a10', 'a8'].includes(atributo.id) && (
                      <button
                        onClick={() => handleRemoveAttribute(clase.id, atributo.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-bold"
                      >
                        ×
                      </button>
                    )}
                    {['a1', 'a2', 'a4', 'a5', 'a6', 'a10', 'a8'].includes(atributo.id) && (
                      <span className="text-xs text-blue-600 font-medium">Ejemplo</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Botones */}
      <div className="flex justify-center gap-4">
        <button
          onClick={resetActivity}
          className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-2 px-6 rounded-full transition-all"
        >
          Reiniciar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!todosAsignados || mostrarResultado}
          className={`font-bold py-2 px-8 rounded-full transition-all ${
            todosAsignados && !mostrarResultado
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {mostrarResultado ? `Score: ${calcularScore()} pts` : 'Validar Asignación'}
        </button>
      </div>

      {mostrarResultado && (
        <div className="mt-6 text-center">
          <div className={`text-lg font-semibold ${calcularScore() >= 100 ? 'text-green-600' : calcularScore() >= 50 ? 'text-blue-600' : 'text-orange-600'}`}>
            {calcularScore() >= 100 ? '¡Excelente! Dominaste la asignación de atributos' :
             calcularScore() >= 50 ? 'Buen trabajo! La mayoría son correctas' :
             'Sigue practicando el diseño de atributos'}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Atributos correctos: {clases.reduce((acc, clase) => acc + clase.atributosAsignados.filter(a => a.esCorrecto).length, 0)} / 
            {clases.reduce((acc, clase) => acc + clase.atributosAsignados.length, 0)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Actividad2AsignarAtributos;
