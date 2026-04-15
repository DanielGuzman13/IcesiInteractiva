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
    nombre: "Backend",
    color: "bg-blue-600",
    posicion: { top: "60%", left: "30%" },
    ruta: "/game/reto/backend",
  },
  {
    id: "frontend",
    nombre: "Frontend",
    color: "bg-teal-500",
    posicion: { top: "60%", left: "70%" },
    ruta: "/game/reto/frontend",
  },
  {
    id: "qa-tester",
    nombre: "QA/Tester",
    color: "bg-purple-600",
    posicion: { top: "80%", left: "50%" },
    ruta: "/game/reto/qa-tester",
  },
  {
    id: "devops",
    nombre: "DevOps",
    color: "bg-orange-600",
    posicion: { top: "20%", left: "20%" },
    ruta: "/game/reto/devops",
  },
  {
    id: "Arquitecto",
    nombre: "Arquitecto",
    color: "bg-red-600",
    posicion: { top: "20%", left: "80%" },
    ruta: "/game/reto/arquitecto",
  },
  {
    id: "Product-owner",
    nombre: "Product Owner",
    color: "bg-yellow-500",
    posicion: { top: "40%", left: "50%" },
    ruta: "/game/reto/product-owner",
  },
  {
    id: "team-manager",
    nombre: "Team Manager",
    color: "bg-gray-800",
    posicion: { top: "40%", left: "80%" },
    ruta: "/game/reto/team-manager",
  }
];
