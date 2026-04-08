'use client';

import Link from 'next/link';

const HeaderLogo = () => {
  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
      <div className="bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-900 rounded flex items-center justify-center text-white font-bold text-xs">
          IC
        </div>
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">ICESI</div>
          <div className="text-xs text-gray-600 font-medium">Ingeniería de Sistemas</div>
        </div>
      </div>
    </div>
  );
};

export default HeaderLogo;
