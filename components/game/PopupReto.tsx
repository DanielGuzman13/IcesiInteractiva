import React from 'react';
import { Reto, Opcion } from '../../types/reto';
import { Boton } from './Boton';

interface PopupRetoProps {
  reto: Reto;
  selectedOption: Opcion | null;
  feedback: 'correct' | 'incorrect' | null;
  onSelectOption: (opcion: Opcion) => void;
  onNext: () => void;
}

export const PopupReto: React.FC<PopupRetoProps> = ({
  reto,
  selectedOption,
  feedback,
  onSelectOption,
  onNext
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full mx-4 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {reto.question}
      </h2>

      <div className="space-y-4 mb-8">
        {reto.options.map((opcion) => {
          
          let variant: 'outline' | 'success' | 'danger' | 'primary' = 'outline';
          
          if (selectedOption) {
            if (opcion.id === selectedOption.id) {
              variant = feedback === 'correct' ? 'success' : 'danger';
            } else if (opcion.isCorrect) {
              // Highlight the correct option if the user answered incorrectly
              variant = 'success';
            }
          }

          return (
            <Boton
              key={opcion.id}
              onClick={() => onSelectOption(opcion)}
              disabled={selectedOption !== null}
              variant={selectedOption ? variant : 'outline'}
              className="text-lg py-3"
            >
              {opcion.text}
            </Boton>
          );
        })}
      </div>

      {feedback && (
        <div className="mt-8 flex flex-col items-center animate-fade-in">
          <p className={`text-xl font-bold mb-4 ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
            {feedback === 'correct' ? '¡Correcto!' : '¡Incorrecto!'}
          </p>
          <Boton onClick={onNext} variant="primary" className="w-1/2">
            Continuar
          </Boton>
        </div>
      )}
    </div>
  );
};
