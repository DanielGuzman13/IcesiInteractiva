import { useState } from 'react';
import { Reto, Opcion } from '../types/reto';

export const useGame = (retos: Reto[]) => {
  const [currentRetoIndex, setCurrentRetoIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<Opcion | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const currentReto = retos[currentRetoIndex];
  const isFinished = currentRetoIndex >= retos.length;

  const handleSelectOption = (opcion: Opcion) => {
    // Prevent selecting another option if already answered
    if (selectedOption) return;

    setSelectedOption(opcion);
    setFeedback(opcion.isCorrect ? 'correct' : 'incorrect');
  };

  const handleNextReto = () => {
    setCurrentRetoIndex((prev) => prev + 1);
    setSelectedOption(null);
    setFeedback(null);
  };

  const resetGame = () => {
    setCurrentRetoIndex(0);
    setSelectedOption(null);
    setFeedback(null);
  };

  return {
    currentReto,
    isFinished,
    selectedOption,
    feedback,
    handleSelectOption,
    handleNextReto,
    resetGame,
  };
};
