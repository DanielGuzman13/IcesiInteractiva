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
    { id: 'a1', nombre: 'nombreDelEquipo', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a2', nombre: 'integrantes', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a3', nombre: 'puntosTotales', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a4', nombre: 'nombreJugador', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a5', nombre: 'posicionCampo', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a6', nombre: 'fechaPartido', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a7', nombre: 'marcadorFinal', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a8', nombre: 'golesMarcados', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a9', nombre: 'asistenciasRealizadas', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a10', nombre: 'formacionTactica', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a11', nombre: 'estrategiaJuego', tipo: 'string', claseId: null, esCorrecto: false },
    { id: 'a12', nombre: 'minutosJugados', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a13', nombre: 'amonestaciones', tipo: 'number', claseId: null, esCorrecto: false },
    { id: 'a14', nombre: 'expulsiones', tipo: 'number', claseId: null, esCorrecto: false }
  ]);

  const [draggedAttribute, setDraggedAttribute] = useState<string | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [mensajeEmergente, setMensajeEmergente] = useState<string | null>(null);

  // Respuestas correctas para validar
  const respuestasCorrectas = {
    equipo: ['nombreDelEquipo', 'integrantes', 'puntosTotales'],
    jugador: ['nombreJugador', 'posicionCampo', 'golesMarcados', 'asistenciasRealizadas', 'minutosJugados', 'amonestaciones', 'expulsiones'],
    partido: ['fechaPartido', 'marcadorFinal', 'estadio', 'arbitro'],
    estadistica: ['golesMarcados', 'asistenciasRealizadas', 'minutosJugados'],
    tactica: ['formacionTactica', 'estrategiaJuego']
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
      { atributoId: 'a1', claseId: 'equipo' }, // nombreDelEquipo -> Equipo
      { atributoId: 'a2', claseId: 'equipo' }, // integrantes -> Equipo
      { atributoId: 'a4', claseId: 'jugador' }, // nombreJugador -> Jugador
      { atributoId: 'a5', claseId: 'jugador' }, // posicionCampo -> Jugador
      { atributoId: 'a6', claseId: 'partido' }, // fechaPartido -> Partido
      { atributoId: 'a10', claseId: 'tactica' }, // formacionTactica -> Tactica
      { atributoId: 'a8', claseId: 'estadistica' } // golesMarcados -> Estadistica
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
    setMensajeEmergente("¡Como un arquitecto que finaliza su diseño, ha organizado la estructura del sistema!");
    // No avanzar automáticamente - esperar a que el usuario dé siguiente
  };

  const handleContinue = () => {
    onComplete(calcularScore());
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
            La mayoría de los atributos ya están organizados. Solo necesitas asignar los 2 atributos restantes 
            en las clases correctas según su responsabilidad en el sistema.
          </p>
        </div>

        {/* Layout principal: opciones y guía a la izquierda, clases a la derecha */}
        <div className="flex gap-12 flex-1">
          {/* Panel lateral izquierdo - opciones y guía */}
          <div className="w-80">
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
          <div className="flex-1">
            <div className="grid grid-cols-2 grid-rows-3 gap-2 h-auto">
              {clases.map((clase, index) => (
                <div
                  key={clase.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, clase.id)}
                  className={`border-2 rounded-xl p-1.5 transition-all ${
                    index === 4 ? 'lg:col-start-1' : ''
                  } ${
                    mostrarResultado
                      ? 'bg-gray-50/50 border-gray-300'
                      : 'bg-white/50 border-gray-400 hover:border-purple-400'
                  }`}
                >
                  <h5 className="font-bold text-gray-800 mb-1 text-center text-xs">{clase.nombre}</h5>
                  <div className="min-h-[70px] space-y-1">
                    <div className="text-xs text-gray-500 mb-2 text-center">
                      Faltan: {Math.max(0, 3 - clase.atributosAsignados.length)} atributos
                    </div>
                    {clase.atributosAsignados.length === 0 ? (
                      <div className="text-gray-400 text-sm text-center py-4 border-2 border-dashed border-gray-300 rounded-lg shadow-sm">
                        Arrastra atributos aquí
                      </div>
                    ) : (
                      clase.atributosAsignados.map(atributo => (
                        <div
                          key={atributo.id}
                          className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                            mostrarResultado
                              ? atributo.esCorrecto
                                ? 'bg-green-100/50 border border-green-300'
                                : 'bg-red-100/50 border border-red-300'
                              : atributo.claseId && ['a1', 'a2', 'a4', 'a5', 'a6', 'a10', 'a8'].includes(atributo.id)
                                ? 'bg-blue-100/50 border border-blue-300'
                                : 'bg-purple-50/50 border border-purple-200'
                          }`}
                        >
                          <div>
                            <span className={`font-medium ${mostrarResultado && !atributo.esCorrecto ? 'text-red-600' : 'text-gray-700'}`}>
                              {atributo.nombre}
                            </span>
                          </div>
                          {!mostrarResultado && !['a1', 'a2', 'a4', 'a5', 'a6', 'a10', 'a8'].includes(atributo.id) && (
                            <button
                              onClick={() => handleRemoveAttribute(clase.id, atributo.id)}
                              className="text-red-500 hover:text-red-700 text-sm font-bold"
                            >
                              {'\ud83d\uddd1\ufe0f'}
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
          </div>
        </div>
      </div>
    </CanchaBackground>
  );
};

export default Actividad2AsignarAtributos;
