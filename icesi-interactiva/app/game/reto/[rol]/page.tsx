import React from 'react';
import Link from 'next/link';

export default async function RetoPage({ params }: { params: Promise<{ rol: string }> }) {
  const { rol } = await params;
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-blue-50 p-6">
      <div className="text-center max-w-2xl bg-white p-10 rounded-3xl shadow-2xl border-t-8 border-blue-600 w-full">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 capitalize">
          Rol: {rol.replace("-", " ")}
        </h1>
        <div className="bg-gray-100 rounded-lg p-8 my-8 border border-gray-200">
          <p className="text-xl text-gray-600 italic">
            "Aquí irá el reto del rol {rol.replace("-", " ")}"
          </p>
        </div>
        
        <Link 
          href="/game"
          className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md"
        >
          &larr; Volver a la cancha
        </Link>
      </div>
    </main>
  );
}
