'use client';

import React, { useState, DragEvent } from 'react';
import CanchaBackground from './CanchaBackground';

interface Clase {
  id: string;
  nombre: string;
  posicion: { x: number; y: number };
  esCorrecta: boolean;
  pista: string;
}

interface Relacion {
  desde: string;
  hacia: string;
  nombre: string;
  tipo: 'asociacion' | 'dependencia' | 'composicion';
}

interface PalabraOpcion {
  id: string;
  texto: string;
  usada: boolean;
}

const Actividad1DiagramaClases: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  // Diagrama base con clases sin nombre (distribución ajustada)
  const [clases, setClases] = useState<Clase[]>([
    {
      id: 'equipo',
      nombre: '',
      posicion: { x: 475, y: 50 },  // arriba centro
      esCorrecta: false,
      pista: '🏆 Representa al grupo completo que compite...'
    },
    {
      id: 'jugador',
      nombre: '',
      posicion: { x: 120, y: 160 },  // izquierda
      esCorrecta: false,
      pista: '⚽ Cada persona que juega en el campo...'
    },
    {
      id: 'partido',
      nombre: '',
      posicion: { x: 830, y: 160 },  // derecha
      esCorrecta: false,
      pista: '📅 El evento completo donde se enfrentan dos equipos...'
    },
    {
      id: 'estadistica',
      nombre: '',
      posicion: { x: 220, y: 380 },  // abajo izquierda
      esCorrecta: false,
      pista: '📊 Los números y datos que miden el rendimiento...'
    },
    {
      id: 'tactica',
      nombre: '',
      posicion: { x: 730, y: 380 },  // abajo derecha
      esCorrecta: false,
      pista: '🧠 El plan estratégico para ganar el juego...'
    }
  ]);

  // Relaciones entre clases con nombres
  const relaciones: Relacion[] = [
    { desde: 'equipo', hacia: 'jugador', nombre: 'contiene', tipo: 'composicion' },
    { desde: 'equipo', hacia: 'partido', nombre: 'participa', tipo: 'asociacion' },
    { desde: 'jugador', hacia: 'estadistica', nombre: 'genera', tipo: 'asociacion' },
    { desde: 'partido', hacia: 'tactica', nombre: 'usa', tipo: 'dependencia' },
    { desde: 'partido', hacia: 'estadistica', nombre: 'produce', tipo: 'asociacion' },
    { desde: 'estadistica', hacia: 'tactica', nombre: 'informa', tipo: 'dependencia' }
  ];

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
    
    // 50 pts por cada correcta, -10 pts por cada incorrecta (Max 200)
    return Math.min(200, Math.max(0, (correctas * 50) - (incorrectas * 10)));
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
    <CanchaBackground>
      <div className="w-full h-full flex flex-col">
        {/* Título y enunciado en la parte superior */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Actividad 1: Diseño Estructural del Sistema</h3>
          <p className="text-gray-600 text-sm">
            Arrastra los nombres correctos a cada clase del diagrama. Analiza las relaciones y responsabilidades para identificar cada componente.
          </p>
        </div>

        {/* Layout principal más compacto */}
        <div className="flex gap-6 flex-1">
          {/* Panel de opciones - lado izquierdo */}
          <div className="w-80">
            <div className="bg-white/50 border-2 border-gray-200 rounded-xl p-4 h-full">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Nombres Disponibles:</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {palabras.filter(p => !p.usada).map(palabra => (
                  <div
                    key={palabra.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, palabra.id)}
                    className="bg-purple-100 hover:bg-purple-200 border-2 border-purple-300 rounded-lg px-3 py-2 cursor-move transition-colors select-none shadow-sm hover:shadow-md"
                  >
                    <span className="font-semibold text-gray-800 text-sm">{palabra.texto}</span>
                  </div>
                ))}
              </div>

              {/* Instrucciones */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-sm text-blue-800">
                <strong>Analiza las relaciones:</strong> Las líneas muestran cómo se conectan las clases. 
                Piensa en el sistema de un partido de fútbol - ¿qué representa cada bloque?
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-3">
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
          </div>

          {/* Diagrama de clases - lado derecho */}
          <div className="flex-1">
            <div className="relative bg-gray-50/50 border-2 border-gray-200 rounded-xl p-6 h-full" style={{ minHeight: '620px', width: '950px', margin: '0 auto' }}>
        {/* Líneas de relaciones con nombres (ajustadas para marco más grande) */}
        <svg className="absolute inset-0 pointer-events-none" style={{ width: '950px', height: '620px', left: '32px', top: '32px' }}>
          {/* Equipo -> Jugador */}
          <line x1="475" y1="90" x2="120" y2="160" stroke="#9333ea" strokeWidth="2" />
          <text x="297" y="120" fill="#6b21a8" fontSize="11" fontWeight="bold" textAnchor="middle">contiene</text>
          
          {/* Equipo -> Partido */}
          <line x1="475" y1="90" x2="830" y2="160" stroke="#9333ea" strokeWidth="2" />
          <text x="652" y="120" fill="#6b21a8" fontSize="11" fontWeight="bold" textAnchor="middle">participa</text>
          
          {/* Jugador -> Estadistica */}
          <line x1="120" y1="200" x2="220" y2="380" stroke="#9333ea" strokeWidth="2" />
          <text x="170" y="285" fill="#6b21a8" fontSize="11" fontWeight="bold" textAnchor="middle">genera</text>
          
          {/* Partido -> Tactica */}
          <line x1="830" y1="200" x2="730" y2="380" stroke="#9333ea" strokeWidth="2" strokeDasharray="5,5" />
          <text x="780" y="285" fill="#6b21a8" fontSize="11" fontWeight="bold" textAnchor="middle">usa</text>
          
          {/* Partido -> Estadistica */}
          <line x1="830" y1="200" x2="220" y2="380" stroke="#9333ea" strokeWidth="2" />
          <text x="525" y="285" fill="#6b21a8" fontSize="11" fontWeight="bold" textAnchor="middle">produce</text>
          
          {/* Estadistica -> Tactica */}
          <line x1="220" y1="420" x2="730" y2="420" stroke="#9333ea" strokeWidth="2" strokeDasharray="5,5" />
          <text x="475" y="415" fill="#6b21a8" fontSize="11" fontWeight="bold" textAnchor="middle">informa</text>
        </svg>

        {/* Clases del diagrama (posiciones fijas optimizadas) */}
        {clases.map(clase => (
          <div
            key={clase.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, clase.id)}
            className={`absolute border-2 rounded-lg p-3 transition-all ${
              mostrarResultado
                ? clase.esCorrecta
                  ? 'bg-green-100 border-green-400'
                  : 'bg-red-100 border-red-400'
                : 'bg-white border-gray-400 hover:border-purple-400'
            }`}
            style={{
              left: `${clase.posicion.x - 70}px`,
              top: `${clase.posicion.y - 40}px`,
              width: '140px',
              minHeight: '80px'
            }}
          >
            <h5 className="font-bold text-gray-800 text-center text-sm mb-2">{clase.nombre || '?'}</h5>
            {clase.nombre ? (
              <div className="text-center">
                <span className={`text-xs ${mostrarResultado && !clase.esCorrecta ? 'text-red-600' : 'text-gray-600'}`}>
                  {clase.nombre}
                </span>
                {!mostrarResultado && (
                  <button
                    onClick={() => handleRemoveWord(clase.id)}
                    className="mt-1 text-red-600 hover:text-red-800 text-sm font-bold"
                  >
                    {'\ud83d\uddd1\ufe0f'}
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
        ))}
            </div>
          </div>
        </div>
      </div>
    </CanchaBackground>
  );
};

export default Actividad1DiagramaClases;
