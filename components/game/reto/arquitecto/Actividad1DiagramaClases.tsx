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
  // Diagrama base con clases sin nombre (posiciones en porcentajes para ser responsive)
  const [clases, setClases] = useState<Clase[]>([
    {
      id: 'equipo',
      nombre: '',
      posicion: { x: 50, y: 8 },  // arriba centro (porcentajes)
      esCorrecta: false,
      pista: 'Representa al grupo completo que compite...'
    },
    {
      id: 'jugador',
      nombre: '',
      posicion: { x: 15, y: 30 },  // izquierda
      esCorrecta: false,
      pista: 'Cada persona que juega en el campo...'
    },
    {
      id: 'partido',
      nombre: '',
      posicion: { x: 85, y: 30 },  // derecha
      esCorrecta: false,
      pista: 'El evento completo donde se enfrentan dos equipos...'
    },
    {
      id: 'estadistica',
      nombre: '',
      posicion: { x: 25, y: 70 },  // abajo izquierda
      esCorrecta: false,
      pista: 'Los números y datos que miden el rendimiento...'
    },
    {
      id: 'tactica',
      nombre: '',
      posicion: { x: 75, y: 70 },  // abajo derecha
      esCorrecta: false,
      pista: 'El plan estratégico para ganar el juego...'
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

  // Calcular posiciones para SVG (en porcentajes)
  const getClasePos = (id: string) => {
    const clase = clases.find(c => c.id === id);
    return clase ? clase.posicion : { x: 0, y: 0 };
  };

  return (
    <CanchaBackground>
      <div className="w-full h-full flex flex-col min-h-0">
        {/* Título y enunciado - más compacto */}
        <div className="mb-3 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Actividad 1: Diseño Estructural del Sistema</h3>
          <p className="text-gray-600 text-xs">
            Arrastra los nombres correctos a cada clase del diagrama. Analiza las relaciones para identificar cada componente.
          </p>
        </div>

        {/* Layout principal - flex-col en móvil, flex-row en desktop */}
        <div className="flex flex-col lg:flex-row gap-3 flex-1 min-h-0">
          {/* Panel de opciones - arriba en móvil, izquierda en desktop */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white/60 border-2 border-gray-200 rounded-xl p-3 h-full flex flex-col">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Nombres Disponibles:</h4>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {palabras.filter(p => !p.usada).map(palabra => (
                  <div
                    key={palabra.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, palabra.id)}
                    className="bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded-md px-2 py-1 cursor-move transition-colors select-none shadow-sm text-xs"
                  >
                    <span className="font-semibold text-gray-800">{palabra.texto}</span>
                  </div>
                ))}
              </div>

              {/* Instrucciones compactas */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3 text-xs text-blue-800 flex-shrink-0">
                <strong>Analiza las relaciones:</strong> Las líneas muestran cómo se conectan las clases.
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-2 mt-auto">
                <button
                  onClick={resetActivity}
                  className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-1.5 px-4 rounded-full transition-all text-sm"
                >
                  Reiniciar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!todasCompletas || mostrarResultado}
                  className={`font-semibold py-1.5 px-4 rounded-full transition-all text-sm ${
                    todasCompletas && !mostrarResultado
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {mostrarResultado ? `Score: ${calcularScore()} pts` : 'Validar Diagrama'}
                </button>
              </div>

              {mostrarResultado && (
                <div className="mt-3 text-center">
                  <div className={`text-sm font-semibold ${calcularScore() >= 200 ? 'text-green-600' : calcularScore() >= 100 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {calcularScore() >= 200 ? '¡Perfecto! Dominaste el diseño estructural' :
                     calcularScore() >= 100 ? 'Buen trabajo! La mayoría son correctas' :
                     'Sigue practicando el análisis arquitectónico'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Diagrama de clases - abajo en móvil, derecha en desktop */}
          <div className="flex-1 min-h-0 lg:min-h-[500px]">
            <div className="relative bg-gray-50/50 border-2 border-gray-200 rounded-xl p-4 h-full" style={{ minHeight: '450px' }}>
              {/* Líneas de relaciones SVG - usando viewBox para escalado proporcional */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Equipo -> Jugador */}
                <line x1="50" y1="8" x2="15" y2="30" stroke="#9333ea" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
                <text x="32" y="17" fill="#6b21a8" fontSize="2.5" fontWeight="bold" textAnchor="middle">contiene</text>

                {/* Equipo -> Partido */}
                <line x1="50" y1="8" x2="85" y2="30" stroke="#9333ea" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
                <text x="68" y="17" fill="#6b21a8" fontSize="2.5" fontWeight="bold" textAnchor="middle">participa</text>

                {/* Jugador -> Estadistica */}
                <line x1="15" y1="30" x2="25" y2="70" stroke="#9333ea" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
                <text x="18" y="52" fill="#6b21a8" fontSize="2.5" fontWeight="bold" textAnchor="middle">genera</text>

                {/* Partido -> Tactica */}
                <line x1="85" y1="30" x2="75" y2="70" stroke="#9333ea" strokeWidth="0.3" strokeDasharray="2,1" vectorEffect="non-scaling-stroke" />
                <text x="82" y="52" fill="#6b21a8" fontSize="2.5" fontWeight="bold" textAnchor="middle">usa</text>

                {/* Partido -> Estadistica */}
                <line x1="85" y1="30" x2="25" y2="70" stroke="#9333ea" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
                <text x="57" y="52" fill="#6b21a8" fontSize="2.5" fontWeight="bold" textAnchor="middle">produce</text>

                {/* Estadistica -> Tactica */}
                <line x1="25" y1="70" x2="75" y2="70" stroke="#9333ea" strokeWidth="0.3" strokeDasharray="2,1" vectorEffect="non-scaling-stroke" />
                <text x="50" y="68" fill="#6b21a8" fontSize="2.5" fontWeight="bold" textAnchor="middle">informa</text>
              </svg>

              {/* Clases del diagrama - posicionadas con porcentajes */}
              {clases.map(clase => (
                <div
                  key={clase.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, clase.id)}
                  className={`absolute border-2 rounded-lg p-2 transition-all shadow-sm ${
                    mostrarResultado
                      ? clase.esCorrecta
                        ? 'bg-green-100 border-green-400'
                        : 'bg-red-100 border-red-400'
                      : 'bg-white/90 border-gray-400 hover:border-purple-400'
                  }`}
                  style={{
                    left: `${clase.posicion.x}%`,
                    top: `${clase.posicion.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '130px',
                    minHeight: '75px',
                    zIndex: 10
                  }}
                >
                  <div className="text-center">
                    <h5 className="font-bold text-gray-800 text-sm mb-1">{clase.nombre || '?'}</h5>
                    {clase.nombre ? (
                      <div>
                        <span className={`text-sm ${mostrarResultado && !clase.esCorrecta ? 'text-red-600' : 'text-gray-600'}`}>
                          {clase.esCorrecta ? '✓ Correcto' : mostrarResultado ? '✗ Incorrecto' : clase.nombre}
                        </span>
                        {!mostrarResultado && (
                          <button
                            onClick={() => handleRemoveWord(clase.id)}
                            className="ml-1 text-red-500 hover:text-red-700 text-xs"
                            title="Quitar"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-xs text-gray-500 italic leading-tight px-1">{clase.pista}</div>
                        <div className="text-gray-400 text-sm mt-1">Arrastra aquí</div>
                      </div>
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

export default Actividad1DiagramaClases;
