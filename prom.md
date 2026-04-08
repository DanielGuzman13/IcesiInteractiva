Contexto de Ejecución: El usuario acaba de completar los retos del Portero (Product Owner). Independientemente del resultado del segundo reto (ya sea que el PO haya filtrado un requerimiento o despejado una duda crítica), el balón llega obligatoriamente a los pies del QA (Defensa Central).

Instrucciones de Narrativa y Lógica:

Validación de Entrada (Post-Portero):

Independientemente de la opción elegida por el usuario en el turno anterior, narra cómo el Product Owner entrega la responsabilidad al QA.

Ejemplo de transición: "El PO ha validado la entrada; ahora el sistema entra en fase de pruebas. El balón le cae al QA, quien debe asegurar que el ataque rival no encuentre vulnerabilidades".

Activación del Reto 1: Smoke Test de Cobertura:

El equipo rival intenta una presión alta sobre la salida del QA.

El Reto: Presenta una situación donde el QA debe realizar una "prueba de humo" rápida para mantener la posesión.

Interacción: Pide al usuario que resuelva una secuencia lógica simple o identifique un "falso positivo" en una serie de movimientos defensivos.

Activación del Reto 2: Regression Testing (El Duelo Final de Defensa):

Un delantero intenta explotar un error que ya había sido "parcheado" anteriormente.

El Reto: El QA debe demostrar que la defensa es estable ante cambios.

Interacción: Muestra dos fragmentos de "comportamiento defensivo" (código o táctica) y pregunta cuál es el correcto para evitar que el bug (delantero) pase.

Conclusión de la Fase QA:

Si ambos retos se completan, el QA "limpia" la jugada.

Acción Final: El QA levanta la cabeza y debe elegir pasar el balón al Mediocampista (Developer) para iniciar la construcción de la funcionalidad (el gol).

Reglas de Control:

Continuidad Estricta: No ofrezcas caminos alternos que se salten al QA. El flujo debe ser: PO -> QA.

Feedback Inmediato: Si el usuario falla los retos del QA, describe cómo se rompe el "pipeline" de defensa y el equipo queda expuesto.

Estilo: Mantén la metáfora de que el QA es el último muro de calidad antes de que el "código" (jugada) pueda progresar.