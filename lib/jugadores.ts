export interface JugadorType {
  id: string;
  rol: string;
  equipo: 'A' | 'B';
  color: string;
  posicion: {
    top: string;
    left: string;
  };
  esCapitan: boolean;
  ruta: string | null; // Solo Equipo A tiene ruta de reto
}

// EQUIPO A - Roles de ingeniería de software (azul, clickeables)
const equipoA: JugadorType[] = [
  {
    id: "a-portero",
    rol: "DevOps",
    equipo: "A",
    color: "bg-blue-600",
    posicion: { top: "50%", left: "5%" },
    esCapitan: false,
    ruta: "/game/reto/devops",
  },
  {
    id: "a-defensa-1",
    rol: "QA / Tester",
    equipo: "A",
    color: "bg-blue-600",
    posicion: { top: "22%", left: "18%" },
    esCapitan: false,
    ruta: "/game/reto/qa-tester",
  },
  {
    id: "a-defensa-2",
    rol: "Release Mgr",
    equipo: "A",
    color: "bg-blue-600",
    posicion: { top: "40%", left: "15%" },
    esCapitan: false,
    ruta: "/game/reto/release-manager",
  },
  {
    id: "a-defensa-3",
    rol: "QA / Tester",
    equipo: "A",
    color: "bg-blue-600",
    posicion: { top: "62%", left: "17%" },
    esCapitan: false,
    ruta: "/game/reto/qa-tester",
  },
  {
    id: "a-defensa-4",
    rol: "Team Manager",
    equipo: "A",
    color: "bg-blue-600",
    posicion: { top: "80%", left: "14%" },
    esCapitan: false,
    ruta: "/game/reto/team-manager",
  },
  {
    id: "a-medio-1",
    rol: "Backend",
    equipo: "A",
    color: "bg-blue-600",
    posicion: { top: "28%", left: "36%" },
    esCapitan: false,
    ruta: "/game/reto/backend",
  },
  {
    id: "a-medio-2",
    rol: "Arquitecto",
    equipo: "A",
    color: "bg-blue-600",
    posicion: { top: "50%", left: "33%" },
    esCapitan: true,
    ruta: "/game/reto/arquitecto",
  },
  {
    id: "a-medio-3",
    rol: "Product Owner",
    equipo: "A",
    color: "bg-blue-600",
    posicion: { top: "71%", left: "38%" },
    esCapitan: false,
    ruta: "/game/reto/product-owner",
  },
  {
    id: "a-delantero-1",
    rol: "Frontend",
    equipo: "A",
    color: "bg-blue-600",
    posicion: { top: "20%", left: "58%" },
    esCapitan: false,
    ruta: "/game/reto/frontend",
  },
  {
    id: "a-delantero-2",
    rol: "Backend",
    equipo: "A",
    color: "bg-blue-600",
    posicion: { top: "48%", left: "63%" },
    esCapitan: false,
    ruta: "/game/reto/backend",
  },
  {
    id: "a-delantero-3",
    rol: "Frontend",
    equipo: "A",
    color: "bg-blue-600",
    posicion: { top: "75%", left: "55%" },
    esCapitan: false,
    ruta: "/game/reto/frontend",
  },
];

// EQUIPO B - Equipo rival (rojo, solo visual, sin roles de ingeniería)
const equipoB: JugadorType[] = [
  {
    id: "b-portero",
    rol: "Rival",
    equipo: "B",
    color: "bg-red-600",
    posicion: { top: "50%", left: "95%" },
    esCapitan: false,
    ruta: null,
  },
  {
    id: "b-defensa-1",
    rol: "Rival",
    equipo: "B",
    color: "bg-red-600",
    posicion: { top: "18%", left: "82%" },
    esCapitan: false,
    ruta: null,
  },
  {
    id: "b-defensa-2",
    rol: "Rival",
    equipo: "B",
    color: "bg-red-600",
    posicion: { top: "37%", left: "85%" },
    esCapitan: false,
    ruta: null,
  },
  {
    id: "b-defensa-3",
    rol: "Rival",
    equipo: "B",
    color: "bg-red-600",
    posicion: { top: "63%", left: "83%" },
    esCapitan: false,
    ruta: null,
  },
  {
    id: "b-defensa-4",
    rol: "Rival",
    equipo: "B",
    color: "bg-red-600",
    posicion: { top: "81%", left: "80%" },
    esCapitan: false,
    ruta: null,
  },
  {
    id: "b-medio-1",
    rol: "Rival",
    equipo: "B",
    color: "bg-red-600",
    posicion: { top: "25%", left: "65%" },
    esCapitan: false,
    ruta: null,
  },
  {
    id: "b-medio-2",
    rol: "Rival",
    equipo: "B",
    color: "bg-red-600",
    posicion: { top: "52%", left: "68%" },
    esCapitan: true,
    ruta: null,
  },
  {
    id: "b-medio-3",
    rol: "Rival",
    equipo: "B",
    color: "bg-red-600",
    posicion: { top: "74%", left: "66%" },
    esCapitan: false,
    ruta: null,
  },
  {
    id: "b-delantero-1",
    rol: "Rival",
    equipo: "B",
    color: "bg-red-600",
    posicion: { top: "30%", left: "45%" },
    esCapitan: false,
    ruta: null,
  },
  {
    id: "b-delantero-2",
    rol: "Rival",
    equipo: "B",
    color: "bg-red-600",
    posicion: { top: "55%", left: "47%" },
    esCapitan: false,
    ruta: null,
  },
  {
    id: "b-delantero-3",
    rol: "Rival",
    equipo: "B",
    color: "bg-red-600",
    posicion: { top: "70%", left: "42%" },
    esCapitan: false,
    ruta: null,
  },
];

export const jugadoresData: JugadorType[] = [...equipoA, ...equipoB];
