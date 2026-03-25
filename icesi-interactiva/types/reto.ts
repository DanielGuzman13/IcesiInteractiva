export interface Opcion {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Reto {
  id: string;
  question: string;
  options: Opcion[];
}
