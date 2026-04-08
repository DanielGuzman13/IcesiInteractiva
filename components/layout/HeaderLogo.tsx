'use client';

import Link from 'next/link';
import Image from 'next/image';

const HeaderLogo = () => {
  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
      <div className="bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2">
        <Image 
          src="/Logo_universidad_icesi.svg.png" 
          alt="Logo ICESI" 
          width={32} 
          height={32} 
          className="rounded"
        />
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">ICESI</div>
          <div className="text-xs text-gray-600 font-medium">Ingeniería de Sistemas</div>
        </div>
      </div>
    </div>
  );
};

export default HeaderLogo;
