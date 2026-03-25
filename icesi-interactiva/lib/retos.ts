import { Reto } from '../types/reto';

export const retosData: Reto[] = [
  {
    id: "reto-1",
    question: "¿En qué año se fundó la Universidad Icesi?",
    options: [
      { id: "opt-1-a", text: "1979", isCorrect: true },
      { id: "opt-1-b", text: "1985", isCorrect: false },
      { id: "opt-1-c", text: "1990", isCorrect: false },
      { id: "opt-1-d", text: "1968", isCorrect: false }
    ]
  },
  {
    id: "reto-2",
    question: "¿Qué significa ICESI?",
    options: [
      { id: "opt-2-a", text: "Instituto Colombiano de Estudios Superiores de Incolda", isCorrect: true },
      { id: "opt-2-b", text: "Instituto Central para Estudios Sociales Integrados", isCorrect: false },
      { id: "opt-2-c", text: "Institución Colombiana de Educación Sistémica", isCorrect: false },
      { id: "opt-2-d", text: "Investigación y Ciencias Educativas Superiores Internacionales", isCorrect: false }
    ]
  },
  {
    id: "reto-3",
    question: "¿Cuál de estos es un valor institucional de la Universidad Icesi?",
    options: [
      { id: "opt-3-a", text: "Excelencia", isCorrect: true },
      { id: "opt-3-b", text: "Velocidad", isCorrect: false },
      { id: "opt-3-c", text: "Conformismo", isCorrect: false },
      { id: "opt-3-d", text: "Subordinación", isCorrect: false }
    ]
  }
];
