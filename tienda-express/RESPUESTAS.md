Nombre=Luis Miguel Melo Muñoz
Ficha=3410385

## Missoin0
1. El proyecto abre en el navegador sin errores en consola= si

2. Existen los archivos src/types/tienda.ts y src/api/tiendaApi.ts= si ya estan creadas

3. Bootstrap está aplicando estilos (los botones se ven azules y redondeados)=Esata aplicando cambios pero aun no en botones porque no estan creados.

4. Cree el archivo RESPUESTAS.md en la raíz del proyecto con su nombre y su ficha en la primera linea=ya esta creada el archivo de respuestas
#### Pregunta 1.1: ¿Por qué `setVentas(ventas + 1)` invocado 3 veces seguidas en el mismo handler sólo incrementa en 1 en lugar de 3?
**Respuesta:**  
Cuando se ejecuta un evento handler, la variable `ventas` tiene un valor constante durante toda la ejecución de esa función (por ejemplo `0`). Invocar `setVentas(ventas + 1)` tres veces equivale a ejecutar `setVentas(0 + 1)`, `setVentas(0 + 1)` y `setVentas(0 + 1)`.

#### Pregunta 1.2: ¿Cómo resuelve la función actualizadora `setVentas(v => v + 1)` este problema?
**Respuesta:**  
En lugar de evaluar una variable fija del closure actual, React pasa como argumento `v` el estado pendiente calculado por la actualización inmediatamente anterior. De esta manera:
1. Primera llamada: `v` es 0 -> retorna 1.
2. Segunda llamada: `v` es 1 -> retorna 2.
3. Tercera llamada: `v` es 2 -> retorna 3.  
React procesa secuencialmente la cola y el contador se incrementa exactamente en 3.

#### Pregunta 1.3: ¿Qué es el batching automático en React 18 y cómo beneficia el rendimiento?
**Respuesta:** 

El batching automático (*Automatic Batching*) es un mecanismo de optimización de React 18 que agrupa múltiples actualizaciones de estado provocadas dentro del mismo turno del bucle de eventos (handlers de eventos, promesas, `setTimeout`, manejadores nativos) en un único ciclo de re-renderizado del DOM. Esto evita múltiples renderizados innecesarios en cascada, reduce el trabajo de reconciliación del DOM virtual y previene parpadeos visuales en la interfaz.

#### Pregunta 1.4: ¿Por qué es fundamental la condición `Math.max(0, v - 1)` al anular ventas?
**Respuesta:**  
Al restar valores en contadores de dominio de negocio como "ventas", existe el riesgo de llegar a valores negativos si se presiona el botón repetidamente. La expresión `Math.max(0, v - 1)` dentro de la función actualizadora garantiza de forma declarativa e inmutable que el límite inferior del estado sea `0`, evitando estados inconsistentes sin necesidad de estructuras `if` imperativas propensas a errores.

#### Pregunta 1.5: ¿Por qué en `handleCerrarCaja` se ejecutan dos `setState` pero React solo realiza un re-renderizado?
**Respuesta:**  
En `handleCerrarCaja` se invocan `setVentas(0)` y `setCajaAbierta(false)`. Gracias al batching automático de React 18, React registra ambas intenciones de cambio en la cola de trabajo del componente y dispara **un solo re-renderizado atómico** en el que se aplican ambos cambios a la interfaz simultáneamente.