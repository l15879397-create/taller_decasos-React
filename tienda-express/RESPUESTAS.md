Nombre=Luis Miguel Melo Muñoz
Ficha=3410385

## Missoin0
1. El proyecto abre en el navegador sin errores en consola= si

2. Existen los archivos src/types/tienda.ts y src/api/tiendaApi.ts= si ya estan creadas

3. Bootstrap está aplicando estilos (los botones se ven azules y redondeados)=Esata aplicando cambios pero aun no en botones porque no estan creados.

4. Cree el archivo RESPUESTAS.md en la raíz del proyecto con su nombre y su ficha en la primera linea=ya esta creada el archivo de respuestas

## Bloque 1
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

## BLOQUE 2

#### Pregunta 2.1: ¿Por qué mutar directamente un objeto de estado (ej: `producto.precio = 5000`) no provoca un re-renderizado en React?
**Respuesta:**  
React utiliza la comparación de igualdad objetiva de JavaScript (`Object.is`) para determinar si el estado ha cambiado. Si se muta una propiedad interna de un objeto (`producto.precio = 5000`), la referencia de memoria del objeto `producto` sigue siendo exactamente la misma. Al ejecutar `setProducto(producto)`, React compara la referencia previa con la actual, determina que son idénticas (`Object.is(prev, next) === true`) y omite por completo el re-renderizado del componente.

#### Pregunta 2.2: Explicación del diagnóstico `romperTodo` y comportamiento del precio vs. nombre
**Respuesta:**  
En el ejercicio de diagnóstico, al mutar directamente `producto.precio = 9999` sin usar un nuevo objeto, el formulario no se actualizaba. Sin embargo, al modificar luego el `nombre` mediante una copia inmutable spread (`setProducto({ ...producto, nombre: e.target.value })`), se creaba una nueva referencia de objeto. Durante ese nuevo renderizado forzado por el campo `nombre`, React leía el objeto completo en estado y dibujaba en pantalla el precio mutado previamente (`9999`). Esto demuestra cómo la mutación directa corrompe el estado internamente y genera inconsistencias temporales en la UI.

#### Pregunta 2.3: ¿Cómo funciona la sintaxis spread de 3 niveles en objetos anidados?
**Respuesta:**  
Para actualizar inmutablemente una propiedad profundamente anidada como `proveedor.contacto.ciudad`, se debe copiar cada nivel intermedio con la sintaxis de propagación (*spread operator* `{...}`):
```typescript
setProducto(prev => ({
  ...prev, // Nivel 1: Copia raíz (id, nombre, categoria, precio, stock)
  proveedor: {
    ...prev.proveedor, // Nivel 2: Copia de proveedor
    contacto: {
      ...prev.proveedor.contacto, // Nivel 3: Copia de contacto
      ciudad: nuevaCiudad // Reemplazo de la propiedad objetivo
    }
  }
}));
```
Esto asegura que los tres objetos en la cadena de referencias reciban una nueva dirección de memoria, permitiendo a React detectar el cambio con precisión.

#### Pregunta 2.4: ¿Por qué debemos convertir explícitamente `precio` y `stock` a `Number(value)`?
**Respuesta:**  
Los elementos HTML `<input type="number">` entregan siempre el valor de `e.target.value` como una cadena de texto (`string`). Si se almacena directo en el estado sin convertir, TypeScript o JavaScript tratarán `precio` como un texto. Esto provoca que operaciones aritméticas realicen concatenaciones accidentales (ej: `"1000" + 50 = "100050"`), corrompiendo los cálculos del carrito y el tipado estricto de la interfaz `Producto`.

#### Pregunta 2.5: ¿Por qué `hayCambios` debe ser un valor derivado en el cuerpo del componente y no un `useState` adicional?
**Respuesta:**  
`hayCambios` se calcula comparando el estado actual con la prop original: `const hayCambios = JSON.stringify(producto) !== JSON.stringify(productoInicial);`. Si se guardara en un `useState` separado, obligaría a escribir `useEffect` o manejadores adicionales para mantenerlo sincronizado, introduciendo redundancia y riesgo de desincronización. Al ser un valor derivado computado en el cuerpo de la función durante el renderizado, se evalúa de manera instantánea, atómica y 100% libre de bugs de sincronización.

