'use client';

import { useState, useEffect, DragEvent } from 'react';
import ArquitectoGuide from './ArquitectoGuide';
import CanchaBackground from './CanchaBackground';

interface Atributo {
  id: string;
  nombre: string;
  tipo: string;
  claseId: string | null;
  esCorrecto: boolean;
}

interface Clase {
  id: string;
  nombre: string;
  atributosAsignados: Atributo[];
}

const Actividad2AsignarAtributos: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [clases, setClases] = useState<Clase[]>([
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

  const [atributosDisponibles, setAtributosDisponibles] = useState<Atributo[]>([
    { id: 'a1', nombre: 'Nombre Del Equipo', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a2', nombre: 'Integrantes', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a3', nombre: 'Puntos Totales', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a4', nombre: 'Nombre Jugador', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a5', nombre: 'Posicion Campo', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a6', nombre: 'Fecha Partido', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a7', nombre: 'Marcador Final', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a8', nombre: 'Goles Marcados', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a9', nombre: 'Asistencias Realizadas', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a10', nombre: 'Formacion Tactica', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a11', nombre: 'Estrategia Juego', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a12', nombre: 'Minutos Jugados', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a13', nombre: 'Amonestaciones', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a14', nombre: 'Expulsiones', tipo: 'number', claseId: null, esCorrecto: false }
  ]);

  const [draggedAttribute, setDraggedAttribute] = useState<string | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [mensajeEmergente, setMensajeEmergente] = useState<string | null>(null);

  // Respuestas correctas para validar
  const respuestasCorrectas = {
    equipo: ['Nombre Del Equipo', 'Integrantes', 'Puntos Totales'],
    jugador: ['Nombre Jugador', 'Posicion Campo', 'Goles Marcados', 'Asistencias Realizadas', 'Minutos Jugados', 'Amonestaciones', 'Expulsiones'],
    partido: ['Fecha Partido', 'Marcador Final', 'Estadio', 'Arbitro'],
    estadistica: ['Goles Marcados', 'Asistencias Realizadas', 'Minutos Jugados'],
    tactica: ['Formacion Tactica', 'Estrategia Juego']
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

  // Inicializar con más atributos ya asignados (solo 2 por organizar)
  useEffect(() => {
    const asignacionesPredefinidas = [
      { atributoId: 'a3', claseId: 'equipo' }, // puntos Totales -> Equipo
      { atributoId: 'a7', claseId: 'partido' }, // marcador Final -> Partido
      { atributoId: 'a9', claseId: 'estadistica' }, // asistencias Realizadas -> Estadistica
      { atributoId: 'a12', claseId: 'jugador' }, // minutos Jugados -> Jugador
      { atributoId: 'a11', claseId: 'tactica' }, // estrategia Juego -> Tactica
      { atributoId: 'a13', claseId: 'jugador' }, // amonestaciones -> Jugador
      { atributoId: 'a14', claseId: 'jugador' } // expulsiones -> Jugador
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
    const correctos = clases.reduce((acc, clase) => acc + clase.atributosAsignados.filter(a => a.esCorrecto).length, 0);
    const total = clases.reduce((acc, clase) => acc + clase.atributosAsignados.length, 0);
    
    if (correctos === 14 && total === 14) {
      setMensajeEmergente("¡Excelente! Dominaste la asignación de atributos\nAtributos correctos: 14/14");
    } else {
      setMensajeEmergente("¡Como un arquitecto que finaliza su diseño, ha organizado la estructura del sistema!");
    }
    // No avanzar automáticamente - esperar a que el usuario dé siguiente
  };

  const handleContinue = () => {
    onComplete(calcularScore());
  };

  const resetActivity = () => {
    // Liberar todos los atributos excepto los preasignados
    const asignacionesPredefinidas = ['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'];
    
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

  const todosAsignados = atributosDisponibles.filter(a => a.claseId).length >= 9; // 7 preasignados + 2 por asignar

  return (
    <CanchaBackground>
      <div className="w-full h-full flex flex-col">
        {/* Mensaje Emergente */}
        {mensajeEmergente && (
          <div className="fixed top-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm animate-pulse">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{'\ud83c\udfc6'}</span>
              <p className="text-sm font-medium">{mensajeEmergente}</p>
            </div>
          </div>
        )}


        {/* Título y enunciado en la parte superior */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Actividad 2: Asignación de Atributos</h3>
          <p className="text-gray-600 text-sm">
            La mayoría de los atributos ya están organizados. Solo necesitas asignar los 7 atributos restantes 
            en las clases correctas según su responsabilidad en el sistema.
          </p>
        </div>

        {/* Layout principal: opciones y guía a la izquierda, clases a la derecha */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1 overflow-x-auto">
          {/* Panel lateral izquierdo - opciones y guía */}
          <div className="w-full lg:w-80">
            <div className="bg-white/50 border-2 border-gray-200 rounded-xl p-6 h-full flex flex-col">
              {/* Panel de atributos disponibles */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Atributos por Organizar:</h4>
                <div className="flex flex-col gap-2 p-3 bg-gray-50/50 rounded-lg">
                  {atributosDisponibles.filter(a => !a.claseId).map(atributo => (
                    <div
                      key={atributo.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, atributo.id)}
                      className="bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded-lg px-3 py-2 cursor-move transition-colors select-none text-left"
                    >
                      <span className="font-medium text-gray-800 text-sm">{atributo.nombre}</span>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {atributosDisponibles.filter(a => !a.claseId).length} atributos por organizar
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-3 mb-6">
                <button
                  onClick={resetActivity}
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-3 px-8 rounded-full transition-all"
                >
                  Reiniciar
                </button>
                {!mostrarResultado ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!todosAsignados}
                    className={`font-bold py-3 px-10 rounded-full transition-all ${
                      todosAsignados
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Validar Asignación
                  </button>
                ) : (
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-2">Score: {calcularScore()} pts</div>
                    <div className="text-sm text-gray-600 mb-4">
                      Revisa los atributos incorrectos antes de continuar.
                    </div>
                    <button
                      onClick={handleContinue}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </div>

              {mostrarResultado && (
                <div className="mb-6 text-center">
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
          </div>

          {/* Clases con sus atributos - lado derecho */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 h-auto items-start justify-start">
              {/* Primera fila - Equipo */}
              <div className="col-span-1">
                {clases[0] && (
                  <div
                    key={clases[0].id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, clases[0].id)}
                    className={`border-2 rounded-lg p-1 transition-all ${
                      mostrarResultado
                        ? 'bg-gray-50/50 border-gray-300'
                        : 'bg-white/50 border-gray-400 hover:border-purple-400'
                    }`}
                  >
                    <h5 className="font-bold text-gray-800 mb-0.5 text-center text-xs">{clases[0].nombre}</h5>
                    <div className="min-h-[60px] space-y-0.5">
                      <div className="text-xs text-gray-500 mb-1 text-center">
                        Faltan: {Math.max(0, respuestasCorrectas.equipo.length - clases[0].atributosAsignados.length)} atributos
                      </div>
                      {clases[0].atributosAsignados.length === 0 ? (
                        <div className="text-gray-400 text-xs text-center py-2 border-2 border-dashed border-gray-300 rounded-md shadow-sm">
                          Arrastra atributos aquí
                        </div>
                      ) : (
                        clases[0].atributosAsignados.map(atributo => (
                          <div
                            key={atributo.id}
                            className={`flex items-center justify-between p-1.5 rounded-md text-xs ${
                              mostrarResultado
                                ? atributo.esCorrecto
                                  ? 'bg-green-100/50 border border-green-300'
                                  : 'bg-red-100/50 border border-red-300'
                                : atributo.claseId && ['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'].includes(atributo.id)
                                  ? 'bg-blue-100/50 border border-blue-300'
                                  : 'bg-purple-50/50 border border-purple-200'
                            }`}
                          >
                            <div>
                              <span className={`font-medium ${mostrarResultado && !atributo.esCorrecto ? 'text-red-600' : 'text-gray-700'}`}>
                                {atributo.nombre}
                              </span>
                            </div>
                            {!mostrarResultado && !['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'].includes(atributo.id) && (
                              <button
                                onClick={() => handleRemoveAttribute(clases[0].id, atributo.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-bold"
                              >
                                🗑️
                              </button>
                            )}
                            {['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'].includes(atributo.id) && (
                              <span className="text-xs text-blue-600 font-medium">Ejemplo</span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Segunda fila - Jugador */}
              <div className="col-span-1">
                {clases[1] && (
                  <div
                    key={clases[1].id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, clases[1].id)}
                    className={`border-2 rounded-lg p-1 transition-all ${
                      mostrarResultado
                        ? 'bg-gray-50/50 border-gray-300'
                        : 'bg-white/50 border-gray-400 hover:border-purple-400'
                    }`}
                  >
                    <h5 className="font-bold text-gray-800 mb-0.5 text-center text-xs">{clases[1].nombre}</h5>
                    <div className="min-h-[60px] space-y-0.5">
                      <div className="text-xs text-gray-500 mb-1 text-center">
                        Faltan: {Math.max(0, respuestasCorrectas.jugador.length - clases[1].atributosAsignados.length)} atributos
                      </div>
                      {clases[1].atributosAsignados.length === 0 ? (
                        <div className="text-gray-400 text-xs text-center py-2 border-2 border-dashed border-gray-300 rounded-md shadow-sm">
                          Arrastra atributos aquí
                        </div>
                      ) : (
                        clases[1].atributosAsignados.map(atributo => (
                          <div
                            key={atributo.id}
                            className={`flex items-center justify-between p-1.5 rounded-md text-xs ${
                              mostrarResultado
                                ? atributo.esCorrecto
                                  ? 'bg-green-100/50 border border-green-300'
                                  : 'bg-red-100/50 border border-red-300'
                                : atributo.claseId && ['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'].includes(atributo.id)
                                  ? 'bg-blue-100/50 border border-blue-300'
                                  : 'bg-purple-50/50 border border-purple-200'
                            }`}
                          >
                            <div>
                              <span className={`font-medium ${mostrarResultado && !atributo.esCorrecto ? 'text-red-600' : 'text-gray-700'}`}>
                                {atributo.nombre}
                              </span>
                            </div>
                            {!mostrarResultado && !['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'].includes(atributo.id) && (
                              <button
                                onClick={() => handleRemoveAttribute(clases[1].id, atributo.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-bold"
                              >
                                🗑️
                              </button>
                            )}
                            {['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'].includes(atributo.id) && (
                              <span className="text-xs text-blue-600 font-medium">Ejemplo</span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Tercera fila - Partido */}
              <div className="col-span-1">
                {clases[2] && (
                  <div
                    key={clases[2].id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, clases[2].id)}
                    className={`border-2 rounded-lg p-1 transition-all ${
                      mostrarResultado
                        ? 'bg-gray-50/50 border-gray-300'
                        : 'bg-white/50 border-gray-400 hover:border-purple-400'
                    }`}
                  >
                    <h5 className="font-bold text-gray-800 mb-0.5 text-center text-xs">{clases[2].nombre}</h5>
                    <div className="min-h-[60px] space-y-0.5">
                      <div className="text-xs text-gray-500 mb-1 text-center">
                        Faltan: {Math.max(0, respuestasCorrectas.partido.length - clases[2].atributosAsignados.length)} atributos
                      </div>
                      {clases[2].atributosAsignados.length === 0 ? (
                        <div className="text-gray-400 text-xs text-center py-2 border-2 border-dashed border-gray-300 rounded-md shadow-sm">
                          Arrastra atributos aquí
                        </div>
                      ) : (
                        clases[2].atributosAsignados.map(atributo => (
                          <div
                            key={atributo.id}
                            className={`flex items-center justify-between p-1.5 rounded-md text-xs ${
                              mostrarResultado
                                ? atributo.esCorrecto
                                  ? 'bg-green-100/50 border border-green-300'
                                  : 'bg-red-100/50 border border-red-300'
                                : atributo.claseId && ['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'].includes(atributo.id)
                                  ? 'bg-blue-100/50 border border-blue-300'
                                  : 'bg-purple-50/50 border border-purple-200'
                            }`}
                          >
                            <div>
                              <span className={`font-medium ${mostrarResultado && !atributo.esCorrecto ? 'text-red-600' : 'text-gray-700'}`}>
                                {atributo.nombre}
                              </span>
                            </div>
                            {!mostrarResultado && !['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'].includes(atributo.id) && (
                              <button
                                onClick={() => handleRemoveAttribute(clases[2].id, atributo.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-bold"
                              >
                                🗑️
                              </button>
                            )}
                            {['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'].includes(atributo.id) && (
                              <span className="text-xs text-blue-600 font-medium">Ejemplo</span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Cuarta fila - Estadística */}
              <div className="col-span-1">
                {clases[3] && (
                  <div
                    key={clases[3].id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, clases[3].id)}
                    className={`border-2 rounded-lg p-1 transition-all ${
                      mostrarResultado
                        ? 'bg-gray-50/50 border-gray-300'
                        : 'bg-white/50 border-gray-400 hover:border-purple-400'
                    }`}
                  >
                    <h5 className="font-bold text-gray-800 mb-0.5 text-center text-xs">{clases[3].nombre}</h5>
                    <div className="min-h-[60px] space-y-0.5">
                      <div className="text-xs text-gray-500 mb-1 text-center">
                        Faltan: {Math.max(0, respuestasCorrectas.estadistica.length - clases[3].atributosAsignados.length)} atributos
                      </div>
                      {clases[3].atributosAsignados.length === 0 ? (
                        <div className="text-gray-400 text-xs text-center py-2 border-2 border-dashed border-gray-300 rounded-md shadow-sm">
                          Arrastra atributos aquí
                        </div>
                      ) : (
                        clases[3].atributosAsignados.map(atributo => (
                          <div
                            key={atributo.id}
                            className={`flex items-center justify-between p-1.5 rounded-md text-xs ${
                              mostrarResultado
                                ? atributo.esCorrecto
                                  ? 'bg-green-100/50 border border-green-300'
                                  : 'bg-red-100/50 border border-red-300'
                                : atributo.claseId && ['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'].includes(atributo.id)
                                  ? 'bg-blue-100/50 border border-blue-300'
                                  : 'bg-purple-50/50 border border-purple-200'
                            }`}
                          >
                            <div>
                              <span className={`font-medium ${mostrarResultado && !atributo.esCorrecto ? 'text-red-600' : 'text-gray-700'}`}>
                                {atributo.nombre}
                              </span>
                            </div>
                            {!mostrarResultado && !['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'].includes(atributo.id) && (
                              <button
                                onClick={() => handleRemoveAttribute(clases[3].id, atributo.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-bold"
                              >
                                🗑️
                              </button>
                            )}
                            {['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'].includes(atributo.id) && (
                              <span className="text-xs text-blue-600 font-medium">Ejemplo</span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Quinta fila - Táctica */}
              <div className="col-span-1">
                {clases[4] && (
                  <div
                    key={clases[4].id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, clases[4].id)}
                    className={`border-2 rounded-lg p-1 transition-all ${
                      mostrarResultado
                        ? 'bg-gray-50/50 border-gray-300'
                        : 'bg-white/50 border-gray-400 hover:border-purple-400'
                    }`}
                  >
                    <h5 className="font-bold text-gray-800 mb-0.5 text-center text-xs">{clases[4].nombre}</h5>
                    <div className="min-h-[60px] space-y-0.5">
                      <div className="text-xs text-gray-500 mb-1 text-center">
                        Faltan: {Math.max(0, respuestasCorrectas.tactica.length - clases[4].atributosAsignados.length)} atributos
                      </div>
                      {clases[4].atributosAsignados.length === 0 ? (
                        <div className="text-gray-400 text-xs text-center py-2 border-2 border-dashed border-gray-300 rounded-md shadow-sm">
                          Arrastra atributos aquí
                        </div>
                      ) : (
                        clases[4].atributosAsignados.map(atributo => (
                          <div
                            key={atributo.id}
                            className={`flex items-center justify-between p-1.5 rounded-md text-xs ${
                              mostrarResultado
                                ? atributo.esCorrecto
                                  ? 'bg-green-100/50 border border-green-300'
                                  : 'bg-red-100/50 border border-red-300'
                                : atributo.claseId && ['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'].includes(atributo.id)
                                  ? 'bg-blue-100/50 border border-blue-300'
                                  : 'bg-purple-50/50 border border-purple-200'
                            }`}
                          >
                            <div>
                              <span className={`font-medium ${mostrarResultado && !atributo.esCorrecto ? 'text-red-600' : 'text-gray-700'}`}>
                                {atributo.nombre}
                              </span>
                            </div>
                            {!mostrarResultado && !['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'].includes(atributo.id) && (
                              <button
                                onClick={() => handleRemoveAttribute(clases[4].id, atributo.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-bold"
                              >
                                🗑️
                              </button>
                            )}
                            {['a3', 'a7', 'a9', 'a12', 'a11', 'a13', 'a14'].includes(atributo.id) && (
                              <span className="text-xs text-blue-600 font-medium">Ejemplo</span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CanchaBackground>
  );
};

export default Actividad2AsignarAtributos;
