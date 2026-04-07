import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-blue-50 p-6">
      <div className="text-center max-w-2xl bg-white p-10 rounded-3xl shadow-2xl">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-6 tracking-tight">
          ICESI INTERACTIVA ⚽
        </h1>
        <p className="text-xl text-gray-700 mb-10">
          ¡Aprende sobre la Universidad Icesi mientras juegas y avanzas en la cancha!
        </p>
        
        <Link 
          href="/game"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full text-xl transition-all hover:scale-105 active:scale-95 shadow-lg mr-4"
        >
          ¡Jugar Ahora!
        </Link>
        
        <Link 
          href="/futbol"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full text-xl transition-all hover:scale-105 active:scale-95 shadow-lg mr-4"
        >
          ⚽ Editor Fútbol
        </Link>
        
        <Link 
          href="/blockly"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-full text-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          Blockly Editor
        </Link>
      </div>
    </main>
  );
}