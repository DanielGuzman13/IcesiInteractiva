'use client';

import Image from 'next/image';
import Link from 'next/link';

const HeaderLogo = () => {
  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
      <div className="bg-white rounded-xl shadow-xl px-4 py-3 flex items-center gap-3 border-2 border-blue-100">
        <Image
          src="/Logo_universidad_icesi.svg.png"
          alt="Logo ICESI"
          width={64}
          height={64}
          className="rounded-lg"
        /> 
        <div className="flex flex-col">
          <div className="text-sm font-bold text-gray-700">Ingeniería de Sistemas</div>
        </div>
      </div>
    </div>
  );
};

export default HeaderLogo;
