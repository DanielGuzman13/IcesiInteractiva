'use client';

import Image from 'next/image';
import { Courier_Prime } from 'next/font/google';

const courierPrime = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
});

type RoleKey = 'arquitecto' | 'frontend' | 'devops' | 'manager' | 'qa' | 'product-owner';

interface RoleDialogueOverlayProps {
  role: RoleKey;
  activity: 1 | 2;
  onContinue: () => void;
}

const ROLE_CONTENT: Record<RoleKey, { title: string; image: string; dialogues: { 1: string; 2: string } }> = {
  arquitecto: {
    title: 'Arquitecto de Software',
    image: '/images/roles/arquitecto.png',
    dialogues: {
      1: 'Gran diseño inicial. Ya trazaste la estructura del sistema y eso facilita cada decisión del equipo.',
      2: 'Excelente trabajo. Si quieres pensar como un Arquitecto de Software de alto nivel, recuerda que yo no solo dibujo diagramas: yo defino la base sobre la que todo el equipo construye. Mi responsabilidad es organizar el sistema para que sea claro, mantenible y preparado para crecer sin volverse un caos. Cuando esta parte se hace bien, el equipo desarrolla más rápido, comete menos errores y puede agregar nuevas funcionalidades sin romper lo que ya existe. En la industria eso es clave, porque una mala arquitectura hace perder meses de trabajo y mucho dinero. Mi misión es anticipar problemas y convertir la complejidad en una estructura sólida. Ese es el estándar profesional que quiero que domines.'
    }
  },
  frontend: {
    title: 'Frontend',
    image: '/images/roles/frontend.png',
    dialogues: {
      1: 'Buena lectura del juego visual. Tu decisión mejora la claridad para que el usuario entienda qué hacer.',
      2: 'Muy bien hecho. Para llegar al nivel PRO en Frontend, debes pensar siempre en la persona que está al otro lado de la pantalla. Yo construyo la parte visible del producto, y mi objetivo es que todo sea claro, rápido y fácil de usar. No se trata solo de que “se vea bonito”, sino de que cada botón, cada texto y cada interacción ayuden al usuario a lograr su objetivo sin frustración. Mi trabajo convierte la tecnología en algo realmente útil para las personas.'
    }
  },
  devops: {
    title: 'DevOps',
    image: '/images/roles/devops.png',
    dialogues: {
      1: 'Buen centro técnico. Tu pipeline va tomando forma con decisiones más confiables y repetibles.',
      2: 'Gran cierre. Si quieres ser un DevOps completo, debes entender que yo conecto desarrollo con operación para que el software llegue a producción de forma segura y constante.Yo automatizo procesos, monitoreo el sistema y respondo rápido cuando algo falla. Eso significa que de la misma forma que ayudo a las aeronaves a circular por la pista de despliegue y todo fluya, el desarrollo de software puede sentirse igual.'
    }
  },
  manager: {
    title: 'Team Manager',
    image: '/images/roles/team-manager.png',
    dialogues: {
      1: 'Bien visto. Elegiste una jugada que ordena al equipo y evita retrabajo innecesario.',
      2: 'Para liderar como un Team Manager de verdad, debes saber que yo no solo reparto tareas: yo alineo al equipo hacia una meta común y elimino bloqueos para que todos avancen. Mi trabajo es priorizar, coordinar y asegurar que cada persona aporte donde genera más valor. Cuando esto se hace bien, hay menos retrabajo, mejor comunicación y resultados más sólidos en menos tiempo. Mi rol convierte esfuerzo individual en rendimiento colectivo.'
    }
  },
  qa: {
    title: 'QA',
    image: '/images/roles/qa.png',
    dialogues: {
      1: 'Yo pruebo el sistema para detectar errores antes de que lleguen a los usuarios. Mi trabajo es clave porque evita fallos costosos y protege la confianza en el producto.',
      2: 'Bien hecho, querido aspirante al mundo de la seguridad y la calidad. Si quieres convertirte en un PRO como yo, debes entender muy bien cuál es mi misión dentro del equipo. Yo no solo busco errores: yo protejo el producto y a los usuarios en cada cambio que hacemos. Cuando hago esto correctamente, evitamos caídas del sistema, retrabajos innecesarios, pérdidas de tiempo, costos extras y molestias para los clientes. En la industria, eso vale muchísimo, porque un pequeño fallo puede afectar a miles de personas y dañar la confianza en la empresa.'
    }
  },
  'product-owner': {
    title: 'Product Owner',
    image: '/images/roles/product-owner.png',
    dialogues: {
      1: 'Buena priorización. Elegir bien en momentos críticos mantiene al producto enfocado en valor.',
      2: 'Muy bien. Para pensar como un Product Owner profesional, debes entender que yo tomo decisiones sobre qué construir primero y por qué eso importa para el negocio y para el usuario. Mi función es convertir necesidades reales en prioridades claras para que el equipo no trabaje a ciegas. Mi trabajo asegura que cada entrega tenga impacto real, y que el producto crezca con propósito. Ese enfoque en valor es lo que diferencia un proyecto ocupado de un producto exitoso.'
    }
  }
};

export default function RoleDialogueOverlay({ role, activity, onContinue }: RoleDialogueOverlayProps) {
  const content = ROLE_CONTENT[role];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-[95vw] max-w-none rounded-3xl bg-transparent p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8">
          <div className="w-full lg:flex-1 flex justify-center bg-transparent">
            <Image
              src={content.image}
              alt={content.title}
              width={4280}
              height={4280}
              className="w-full max-w-[4320px] md:max-w-[5040px] h-auto object-contain"
              priority
            />
          </div>

          <div className="w-full lg:w-[680px] xl:w-[720px] rounded-2xl border border-gray-200 bg-gray-50 p-10 md:p-12 shrink-0">
            <h3 className={`${courierPrime.className} text-[23px] md:text-[27px] font-extrabold text-gray-800 mb-2`}>{content.title}</h3>
            <p className={`${courierPrime.className} text-[17px] md:text-[19px] text-gray-700 leading-relaxed mb-6`}>
              {content.dialogues[activity]}
            </p>
            <button
              onClick={onContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
