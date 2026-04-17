'use client';

import Image from 'next/image';
import { Courier_Prime } from 'next/font/google';

const courierPrime = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
});

type RoleKey = 'arquitecto' | 'frontend' | 'backend' | 'devops' | 'manager' | 'qa' | 'product-owner';

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
      2: 'Excelente trabajo. Si quieres pensar como un Arquitecto de Software de alto nivel, diseña la estructura técnica de alto nivel, asegura la escalabilidad y toma decisiones críticas sobre las tecnologías a utilizar.'
    }
  },
  frontend: {
    title: 'Frontend',
    image: '/images/roles/frontend.png',
    dialogues: {
      1: 'Buena lectura del juego visual. Tu decisión mejora la claridad para que el usuario entienda qué hacer.',
      2: 'Muy bien hecho. Para llegar al nivel PRO en Frontend, se debe tener en cuenta la interfaz y la experiencia del usuario, traduciendo el diseño en código interactivo y funcional.'
    }
  },
  backend: {
    title: 'Backend',
    image: '/images/roles/backend.png',
    dialogues: {
      1: 'Muy bien hecho. Para ser un Backend Developer de alto nivel, debes entender que eres el motor oculto del sistema. Yo gestiono los datos, aseguro la seguridad del servidor y construyo la lógica que hace que todo funcione detrás de escena. Mi misión es que la comunicación entre las partes sea fluida, escalable y protegida contra fallos. Un backend sólido permite que miles de usuarios se conecten sin problemas, y esa es la responsabilidad que quiero que asumas.',
      2: 'Muy bien hecho. Para ser un Backend Developer de alto nivel, implementa la lógica del lado del servidor, gestiona la base de datos y garantiza que la comunicación de datos sea fluida y segura.'
    }
  },
  devops: {
    title: 'DevOps',
    image: '/images/roles/devops.png',
    dialogues: {
      1: 'Buen centro técnico. Todo va tomando forma con decisiones más confiables y repetibles.',
      2: 'Si quieres ser un DevOps completo como yo, debes saber gestionar la infraestructura, automatizar los despliegues y asegurar que el ciclo de vida del desarrollo sea ágil y eficiente.'
    }
  },
  manager: {
    title: 'Team Manager',
    image: '/images/roles/team-manager.png',
    dialogues: {
      1: 'Bien visto. Elegiste una jugada que ordena al equipo y evita retrabajo innecesario.',
      2: 'Para liderar como un Team Manager de verdad, debes saber que yo lidero y coordino al equipo, gestiono el talento y aseguro que los objetivos del proyecto se cumplan en tiempo y forma.'
    }
  },
  qa: {
    title: 'QA',
    image: '/images/roles/qa.png',
    dialogues: {
      1: 'Yo pruebo el sistema para detectar errores antes de que lleguen a los usuarios. Mi trabajo es clave porque evita fallos costosos y protege la confianza en el producto.',
      2: 'Si quieres convertirte en un PRO como yo, debes realizar pruebas exhaustivas para asegurar que el sistema esté libre de errores y cumpla con los estándares de calidad definidos.'
    }
  },
  'product-owner': {
    title: 'Product Owner',
    image: '/images/roles/product-owner.png',
    dialogues: {
      1: 'Buena priorización. Elegir bien en momentos críticos mantiene al producto enfocado en valor.',
      2: 'Mi rol como Product Owner es definir la visión del producto, priorizar los requerimientos y asegurar que el equipo genere el máximo valor para el usuario final.'
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
              width={3280}
              height={3280}
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
