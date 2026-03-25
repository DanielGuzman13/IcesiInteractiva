Quiero que construyas la base visual principal de un juego web usando Next.js (App Router), TypeScript y Tailwind CSS.

El proyecto es "ICESI INTERACTIVA", una experiencia gamificada donde un partido de fútbol representa el trabajo de un equipo de desarrollo de software.

NO quiero formularios ni preguntas aún. Quiero una simulación visual realista de un partido en curso.

OBJETIVO:
Renderizar una cancha de fútbol con dos equipos mezclados en juego, donde cada jugador representa un rol de ingeniería de software.

REQUERIMIENTOS:

1. Página principal (/game)
   Debe mostrar una cancha de fútbol vista desde arriba (2D).

2. Cancha:

* Fondo verde
* Líneas blancas simuladas con CSS (mitad de cancha, área, círculo central)
* Debe ocupar gran parte de la pantalla

3. Equipos (MUY IMPORTANTE)

Debe haber 2 equipos:

* Equipo A
* Equipo B

Cada equipo debe diferenciarse por:

* color (ej: azul vs rojo)

NO deben estar separados como formación inicial.
Deben estar DISTRIBUIDOS por toda la cancha como si el partido ya estuviera en curso.

👉 Es decir:

* jugadores mezclados
* posiciones variadas
* no alineados
* sensación de movimiento aunque estén estáticos

4. Jugadores

Cada jugador representa un rol:

* Backend
* Frontend
* QA / Tester
* DevOps
* Arquitecto
* Product Owner
* Release Manager
* Team Manager

REQUISITOS:

* Los roles se pueden repetir en ambos equipos
* Cada jugador es un componente reutilizable
* Debe mostrarse:

  * nombre del rol
  * color del equipo
  * forma circular o tipo ficha

5. Capitán

Cada equipo debe tener 1 capitán:

* Debe identificarse con una "C"
* Debe verse visualmente diferente (borde, icono o badge)
* Puede ser cualquier rol

6. Posicionamiento

* Usar posiciones absolutas o grid
* Definir posiciones desde un archivo de datos
* Distribución tipo “partido en curso”, no simétrica

Ejemplo:

* algunos jugadores cerca del balón (aunque no haya balón aún)
* otros en defensa
* otros en medio campo

7. Interacción

Cada jugador debe ser clickeable:

* Al hacer click → navegar a:
  /game/reto/[rol]

Ejemplo:
/game/reto/backend

8. Rutas dinámicas

Crear:
/app/game/reto/[rol]/page.tsx

Contenido:

* título del rol
* texto: “Aquí irá el reto del rol [rol]”
* estructura base

9. Datos

Crear archivo:
/lib/roles.ts o /lib/jugadores.ts

Debe incluir:

* rol
* equipo
* posición (x, y)
* esCapitan (boolean)
* ruta

10. Componentes

Separar:

* /components/game/Cancha.tsx
* /components/game/Jugador.tsx

Jugador debe:

* recibir props (rol, equipo, posición, capitán)
* renderizar correctamente

11. Estilo

* usar Tailwind
* diseño limpio
* responsive básico

12. NO incluir aún:

* lógica de retos
* preguntas
* animaciones
* puntaje
* n8n
* Blockly

OBJETIVO FINAL:

Quiero ver una cancha con dos equipos mezclados como en un partido real, con jugadores identificados por roles, colores por equipo, capitán marcado con “C”, y que al hacer click en cualquier jugador navegue a su respectivo reto.

Entrega:

* Código completo
* Componentes separados
* Datos estructurados
* Navegación funcionando
* Breve explicación de la estructura
