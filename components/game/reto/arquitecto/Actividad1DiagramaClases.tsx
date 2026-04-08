'use client';

import React, { useState, DragEvent } from 'react';

interface Clase {
  id: string;
  nombre: string;
  posicion: { x: number; y: number };
  esCorrecta: boolean;
  pista: string;
}

interface PalabraOpcion {
  id: string;
  texto: string;
  usada: boolean;
}

const Actividad1DiagramaClases: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  // Diagrama base con clases sin nombre (solo posiciones y relaciones)
  const [clases, setClases] = useState<Clase[]>([
    {
      id: 'equipo',
      nombre: '',
      posicion: { x: 400, y: 100 },
      esCorrecta: false,
      pista: '🏆 Representa al grupo completo que compite...'
    },
    {
      id: 'jugador',
      nombre: '',
      posicion: { x: 150, y: 250 },
      esCorrecta: false,
      pista: '⚽ Cada persona que juega en el campo...'
    },
    {
      id: 'partido',
      nombre: '',
      posicion: { x: 650, y: 250 },
      esCorrecta: false,
      pista: '📅 El evento completo donde se enfrentan dos equipos...'
    },
    {
      id: 'estadistica',
      nombre: '',
      posicion: { x: 250, y: 400 },
      esCorrecta: false,
      pista: '📊 Los números y datos que miden el rendimiento...'
    },
    {
      id: 'tactica',
      nombre: '',
      posicion: { x: 550, y: 400 },
      esCorrecta: false,
      pista: '🧠 El plan estratégico para ganar el juego...'
    }
  ]);

  // Opciones de nombres para arrastrar
  const [palabras, setPalabras] = useState<PalabraOpcion[]>([
    { id: 'p1', texto: 'Equipo', usada: false },
    { id: 'p2', texto: 'Jugador', usada: false },
    { id: 'p3', texto: 'Partido', usada: false },
    { id: 'p4', texto: 'Estadistica', usada: false },
    { id: 'p5', texto: 'Tactica', usada: false },
    { id: 'd1', texto: 'Campo', usada: false },
    { id: 'd2', texto: 'Balon', usada: false },
    { id: 'd3', texto: 'Arbitro', usada: false },
    { id: 'd4', texto: 'Gol', usada: false },
    { id: 'd5', texto: 'Tiempo', usada: false }
  ]);

  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const respuestasCorrectas = {
    equipo: 'Equipo',
    jugador: 'Jugador',
    partido: 'Partido',
    estadistica: 'Estadistica',
    tactica: 'Tactica'
  };

  const handleDragStart = (e: DragEvent, palabraId: string) => {
    setDraggedWord(palabraId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: DragEvent, claseId: string) => {
    e.preventDefault();
    
    if (!draggedWord) return;

    const palabra = palabras.find(p => p.id === draggedWord);
    if (!palabra || palabra.usada) return;

    // Actualizar clase con el nombre
    setClases(prev => prev.map(clase => 
      clase.id === claseId 
        ? { ...clase, nombre: palabra.texto, esCorrecta: palabra.texto === respuestasCorrectas[clase.id as keyof typeof respuestasCorrectas] }
        : clase
    ));

    // Marcar palabra como usada
    setPalabras(prev => prev.map(p => 
      p.id === draggedWord ? { ...p, usada: true } : p
    ));

    setDraggedWord(null);
  };

  const handleRemoveWord = (claseId: string) => {
    const clase = clases.find(c => c.id === claseId);
    if (!clase || !clase.nombre) return;

    // Liberar palabra
    setPalabras(prev => prev.map(p => 
      p.texto === clase.nombre ? { ...p, usada: false } : p
    ));

    // Limpiar clase
    setClases(prev => prev.map(c => 
      c.id === claseId ? { ...c, nombre: '', esCorrecta: false } : c
    ));
  };

  const calcularScore = () => {
    const correctas = clases.filter(c => c.esCorrecta).length;
    const incorrectas = clases.filter(c => c.nombre && !c.esCorrecta).length;
    
    // 50 pts por cada correcta, -10 pts por cada incorrecta
    return Math.max(0, (correctas * 50) - (incorrectas * 10));
  };

  const handleSubmit = () => {
    setMostrarResultado(true);
    const score = calcularScore();
    setTimeout(() => onComplete(score), 2000);
  };

  const resetActivity = () => {
    setClases(prev => prev.map(c => ({ ...c, nombre: '', esCorrecta: false })));
    setPalabras(prev => prev.map(p => ({ ...p, usada: false })));
    setMostrarResultado(false);
    setDraggedWord(null);
  };

  const todasCompletas = clases.every(c => c.nombre !== '');

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Actividad 1: Diseño Estructural del Sistema</h3>
        <p className="text-gray-600 text-sm">
          Arrastra los nombres correctos a cada clase del diagrama. Analiza las relaciones y responsabilidades para identificar cada componente.
        </p>
      </div>

      {/* Panel de palabras disponibles */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Nombres Disponibles:</h4>
        <div className="flex flex-wrap gap-2">
          {palabras.filter(p => !p.usada).map(palabra => (
            <div
              key={palabra.id}
              draggable
              onDragStart={(e) => handleDragStart(e, palabra.id)}
              className="bg-purple-100 hover:bg-purple-200 border-2 border-purple-300 rounded-lg px-4 py-3 cursor-move transition-colors select-none shadow-sm hover:shadow-md"
            >
              <span className="font-semibold text-gray-800 text-base">{palabra.texto}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Diagrama de clases */}
      <div className="relative bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-6" style={{ height: '500px' }}>
        {/* Líneas de relaciones */}
        <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
          {/* Equipo -> Jugador */}
          <line x1="400" y1="140" x2="200" y2="250" stroke="#9333ea" strokeWidth="2" strokeDasharray="5,5" />
          {/* Equipo -> Partido */}
          <line x1="450" y1="140" x2="600" y2="250" stroke="#9333ea" strokeWidth="2" strokeDasharray="5,5" />
          {/* Jugador -> Estadistica */}
          <line x1="200" y1="290" x2="280" y2="400" stroke="#9333ea" strokeWidth="2" strokeDasharray="5,5" />
          {/* Partido -> Tactica */}
          <line x1="650" y1="290" x2="550" y2="400" stroke="#9333ea" strokeWidth="2" strokeDasharray="5,5" />
          {/* Partido -> Estadistica */}
          <line x1="600" y1="290" x2="320" y2="400" stroke="#9333ea" strokeWidth="2" strokeDasharray="5,5" />
        </svg>

        {/* Clases del diagrama */}
        {clases.map(clase => (
          <div
            key={clase.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, clase.id)}
            className={`absolute border-2 rounded-lg p-3 transition-all ${
              mostrarResultado
                ? clase.esCorrecta
                  ? 'bg-green-100 border-green-500'
                  : clase.nombre
                  ? 'bg-red-100 border-red-500'
                  : 'bg-gray-100 border-gray-300'
                : 'bg-white border-gray-400 hover:border-purple-400'
            }`}
            style={{
              left: `${clase.posicion.x - 80}px`,
              top: `${clase.posicion.y - 30}px`,
              width: '160px',
              minHeight: '60px'
            }}
          >
            <div className="text-center">
              {clase.nombre ? (
                <div className="flex flex-col items-center">
                  <span className={`font-bold text-lg ${mostrarResultado && !clase.esCorrecta ? 'text-red-600' : 'text-gray-800'}`}>
                    {clase.nombre}
                  </span>
                  {!mostrarResultado && (
                    <button
                      onClick={() => handleRemoveWord(clase.id)}
                      className="mt-1 text-red-500 hover:text-red-700 text-sm font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-xs text-gray-500 italic mb-2">{clase.pista}</div>
                  <div className="text-gray-400 text-sm font-medium">Arrastra aquí</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-sm text-blue-800">
        <strong>Analiza las relaciones:</strong> Las líneas punteadas muestran cómo se conectan las clases. 
        Piensa en el sistema de un partido de fútbol - ¿qué representa cada bloque?
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
          disabled={!todasCompletas || mostrarResultado}
          className={`font-bold py-2 px-8 rounded-full transition-all ${
            todasCompletas && !mostrarResultado
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {mostrarResultado ? `Score: ${calcularScore()} pts` : 'Validar Diagrama'}
        </button>
      </div>

      {mostrarResultado && (
        <div className="mt-6 text-center">
          <div className={`text-lg font-semibold ${calcularScore() >= 200 ? 'text-green-600' : calcularScore() >= 100 ? 'text-blue-600' : 'text-orange-600'}`}>
            {calcularScore() >= 200 ? '¡Perfecto! Dominaste el diseño estructural' :
             calcularScore() >= 100 ? 'Buen trabajo! La mayoría son correctas' :
             'Sigue practicando el análisis arquitectónico'}
          </div>
        </div>
      )}
    </div>
  );
};

export default Actividad1DiagramaClases;
