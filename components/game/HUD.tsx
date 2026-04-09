'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const HUD: React.FC = () => {
  const [totalScore, setTotalScore] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const readScore = () => {
      try {
        const pre = localStorage.getItem('currentPlayer') || 'guest';
        const saved = parseInt(localStorage.getItem(`${pre}_total_score`) || '0', 10);
        setTotalScore(saved);
      } catch (e) {
        console.error(e);
      }
    };

    readScore(); // run once immediately

    // Refresh every second to pick up changes from Cancha
    const scoreInterval = setInterval(readScore, 1000);

    // Timer
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(scoreInterval);
    };
  }, []);

  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const s = (totalSecs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="w-full max-w-[95%] lg:max-w-[90%] mx-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between text-white font-sans mb-3 sm:mb-4 overflow-hidden relative flex-none"
    >
      {/* Resplandor decorativo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      {/* Puntaje Total */}
      <div className="flex-1 flex justify-start items-center p-2">
        <div className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Puntaje Total</span>
            <span className="text-xl font-black text-yellow-400">
              {totalScore.toLocaleString()} <span className="text-sm font-bold text-gray-300">pts</span>
            </span>
          </div>
        </div>
      </div>

      {/* Marcador Central */}
      <div className="flex-[2] flex justify-center items-center gap-6 my-4 md:my-0">
        <div className="text-right">
          <div className="text-xs text-blue-300 font-bold uppercase tracking-widest mb-1">Squad A</div>
          <div className="text-lg font-bold">Ingeniería</div>
        </div>

        <div className="flex items-center gap-3 bg-black/50 border border-gray-700 px-6 py-3 rounded-xl shadow-inner">
          <span className="text-4xl font-mono font-black text-blue-500">0</span>
          <span className="text-xl text-gray-500">:</span>
          <span className="text-4xl font-mono font-black text-red-500">0</span>
        </div>

        <div className="text-left">
          <div className="text-xs text-red-300 font-bold uppercase tracking-widest mb-1">Squad B</div>
          <div className="text-lg font-bold">Bugs</div>
        </div>
      </div>

      {/* Temporizador */}
      <div className="flex-1 flex justify-end items-center p-2">
        <div className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Desarrollo</span>
            <span className="text-xl font-mono font-black text-green-400">
              {formatTime(seconds)}
            </span>
          </div>
          <span className="text-2xl animate-pulse">⏱️</span>
        </div>
      </div>
    </motion.div>
  );
};
