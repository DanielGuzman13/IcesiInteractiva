'use client';

interface ArquitectoGuideProps {
  currentStep: number;
}

const ArquitectoGuide: React.FC<ArquitectoGuideProps> = ({ currentStep }) => {
  const steps = [
    {
      title: "Paso 1: Identificar Clases",
      description: "Como un arquitecto que diseña los planos, primero identifica las entidades principales del sistema.",
      example: "Analiza el diagrama y arrastra los nombres correctos a cada clase."
    },
    {
      title: "Paso 2: Asignar Atributos", 
      description: "Cada clase necesita sus propiedades específicas, como cada jugador tiene sus habilidades únicas.",
      example: "Arrastra los atributos restantes a las clases correspondientes."
    },
    {
      title: "Paso 3: Validar Diseño",
      description: "Un buen arquitecto siempre revisa su trabajo antes de construir.",
      example: "Revisa los errores y corrige antes de finalizar."
    }
  ];

  return (
    <div className="fixed right-4 top-20 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-40">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-purple-800 mb-2 flex items-center gap-2">
           Guía del Arquitecto
        </h3>
        <div className="text-xs text-gray-500 mb-3">
          Rol: Diseñador Estructural del Sistema
        </div>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg border-2 transition-all ${
              index === currentStep 
                ? 'bg-purple-100 border-purple-400 shadow-md' 
                : index < currentStep 
                  ? 'bg-green-50 border-green-300'
                  : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              <div className={`text-lg font-bold ${
                index === currentStep ? 'text-purple-700' : 
                index < currentStep ? 'text-green-600' : 'text-gray-400'
              }`}>
                {index === currentStep ? '🔄' : index < currentStep ? '✅' : '⏸️'}
              </div>
              <div className="flex-1">
                <div className={`font-semibold text-sm mb-1 ${
                  index === currentStep ? 'text-purple-800' : 
                  index < currentStep ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className={`text-xs ${
                  index === currentStep ? 'text-purple-600' : 
                  index < currentStep ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </div>
                <div className="text-xs text-gray-500 mt-1 italic">
                  {step.example}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-semibold text-blue-800 mb-1">
          💡 Consejo del Arquitecto:
        </div>
        <div className="text-xs text-blue-700">
          {currentStep === 0 && "Piensa como un técnico: ¿qué posiciones necesitas en el campo?"}
          {currentStep === 1 && "Cada atributo es como una habilidad específica que define el rol."}
          {currentStep === 2 && "Un buen diseño es como una formación táctica perfecta."}
        </div>
      </div>
    </div>
  );
};

export default ArquitectoGuide;
