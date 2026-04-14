export interface Role {
  id: string;
  nombre: string;
  color: string;
  posicion: {
    top: string;
    left: string;
  };
  ruta: string;
}

export const rolesData: Role[] = [
  {
    id: "backend",
    nombre: "Mediocentro (Backend)",
    color: "bg-blue-600",
    posicion: { top: "60%", left: "30%" },
    ruta: "/game/reto/backend",
  },
  {
    id: "frontend",
    nombre: "Delantero (Frontend)",
    color: "bg-teal-500",
    posicion: { top: "60%", left: "70%" },
    ruta: "/game/reto/frontend",
  },
  {
    id: "qa-tester",
    nombre: "Defensa (QA)",
    color: "bg-purple-600",
    posicion: { top: "80%", left: "50%" },
    ruta: "/game/reto/qa-tester",
  },
  {
    id: "devops",
    nombre: "Lateral (DevOps)",
    color: "bg-orange-600",
    posicion: { top: "20%", left: "20%" },
    ruta: "/game/reto/devops",
  },
  {
    id: "arquitecto",
    nombre: "Técnico (Arquitecto)",
    color: "bg-red-600",
    posicion: { top: "20%", left: "80%" },
    ruta: "/game/reto/arquitecto",
  },
  {
    id: "product-owner",
    nombre: "Portero (Product Owner)",
    color: "bg-yellow-500",
    posicion: { top: "40%", left: "50%" },
    ruta: "/game/reto/product-owner",
  },
  {
    id: "release-manager",
    nombre: "Release Mgr",
    color: "bg-pink-600",
    posicion: { top: "40%", left: "20%" },
    ruta: "/game/reto/release-manager",
  },
  {
    id: "team-manager",
    nombre: "Mediocampista (Team Manager)",
    color: "bg-gray-800",
    posicion: { top: "40%", left: "80%" },
    ruta: "/game/reto/team-manager",
  }
];
