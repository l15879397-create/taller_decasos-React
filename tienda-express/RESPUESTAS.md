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

## BLOQUE 3

#### Pregunta 3.1: ¿Por qué está estrictamente prohibido usar métodos mutadores como `push`, `splice` o `sort` sobre el estado del carrito?
**Respuesta:**  
Los métodos como `push`, `pop`, `splice`, `sort` y `reverse` modifican (*mutan*) el arreglo original en la misma posición de memoria. En React, mutar el arreglo de estado impide que `Object.is` reconozca el cambio de estado, lo que anula los re-renderizados y corrompe la trazabilidad del motor de reconciliación de React. Siempre deben usarse equivalentes inmutables como `concat`, `slice`, `map`, `filter` o la sintaxis spread `[...arreglo]`.

#### Pregunta 3.2: Tabla del flujo de la cola de actualizaciones en el carrito

| Operación | Estado Anterior (Items) | Método Inmutable Aplicado | Resultado (Nuevo Estado) |
| :--- | :--- | :--- | :--- |
| **Agregar producto nuevo (ID: 1)** | `[]` | `[...anteriores, nuevoItem]` | `[{ productoId: 1, cantidad: 1 }]` |
| **Incrementar cantidad (ID: 1)** | `[{ productoId: 1, cantidad: 1 }]` | `map` con `{ ...item, cantidad: item.cantidad + 1 }` | `[{ productoId: 1, cantidad: 2 }]` |
| **Decrementar a cero (ID: 1)** | `[{ productoId: 1, cantidad: 1 }]` | `map` + `filter(item => item.cantidad > 0)` | `[]` (Fila eliminada) |
| **Quitar ítem (ID: 2)** | `[{ id: 1 }, { id: 2 }]` | `filter(item => item.productoId !== 2)` | `[{ id: 1 }]` |
| **Vaciar carrito** | `[{ id: 1 }, { id: 2 }]` | Reemplazo por arreglo vacío `[]` | `[]` |

#### Pregunta 3.3: ¿Qué efecto negativo grave tiene usar `key={index}` en listas dinámicas?
**Respuesta:**  
Cuando se elimina o reordena un elemento en una lista dinámicamente usando el índice numérico del bucle (`key={i}`), los índices de los elementos restantes cambian. React utiliza la prop `key` para asociar la identidad de cada elemento del DOM virtual con el estado de los componentes. Al cambiar el índice, React confunde la identidad de las filas, manteniendo el estado de entradas de texto o animaciones del elemento eliminado en la fila equivocada. Utilizar `item.productoId` garantiza una clave estable y única vinculada al dato de negocio.

#### Pregunta 3.4: ¿Por qué `totalVenta`, `articulosDistintos` y `unidadesTotales` deben ser valores derivados?
**Respuesta:**  
Crear estados en `useState` para `totalVenta` o `unidadesTotales` obligaría a lanzar efectos secundarios (`useEffect`) para calcularlos cada vez que el arreglo `items` cambie, provocando renderizados dobles innecesarios en cascada. Al calcularlos directamente en el cuerpo del componente mediante `reduce` y `.length`, la computación ocurre en el mismo ciclo de renderizado del carrito con costo computacional mínimo y cero desincronización.

#### Pregunta 3.5: ¿Por qué se utilizó una unión de literales `'listo' | 'enviando' | 'enviado'` para el estado de envío?
**Respuesta:**  
Usar dos booleanos independientes como `isEnviando` e `isEnviado` abre la puerta a combinaciones imposibles en el dominio del problema (por ejemplo `isEnviando = true` e `isEnviado = true` al mismo tiempo). Tipar el estado como una unión de literales `'listo' | 'enviando' | 'enviado'` impone una máquina de estados finitos donde **solo un estado es posible a la vez**, aplicando el principio de diseño de software de "hacer imposibles los estados inválidos".

## BLOQUE 4 

#### Pregunta 4.1:
**Respuesta:**  
Resuelve el problema de las **condiciones de carrera** (*race conditions*) en peticiones asíncronas HTTP. Cuando el usuario escribe rápidamente en el input de búsqueda, se disparan múltiples solicitudes de red consecutivas. Debido a la latencia variable de la red, una petición anterior (más lenta) podría responder *después* de la petición más reciente. La función de limpieza del `useEffect` (`return () => { ignorar = true; }`) cambia la bandera a `true` al desmontar o re-ejecutar el efecto, asegurando que solo los datos de la última solicitud actualicen el estado del componente.

#### Pregunta 4.2:
**Respuesta:**  
- **`useToggle` (Nivel 1):** Encapsula la lógica atómica de alternar un valor booleano, retornando una tupla `[valor, alternar] as const`.
- **`useDebounce` (Nivel 2):** Hook genérico que retrasa la actualización de cualquier valor por un tiempo determinado utilizando `setTimeout` y limpieza de temporizadores.
- **`useProducts` (Nivel 3):** Compone `useDebounce` y la función API `getProductos`, gestionando de forma integrada los estados de `productos`, `cargando`, `error` y ofreciendo una función de reintento (`refetch`).  
La composición modular permite separar los efectos secundarios de la interfaz de usuario, manteniendo los componentes limpios y facilitando la reutilización y pruebas unitarias.

#### Pregunta 4.3:
**Respuesta:**  
Esta decisión sigue el principio de **"No duplicación de estado"**. Si guardáramos el objeto `productoSeleccionado` completo en un `useState` adicional, tendríamos dos copias del mismo producto en memoria: una en el catálogo principal y otra en la selección. Si el usuario edita el producto en el formulario y guarda los cambios, el producto seleccionado mantendría la versión vieja sin editar. Al guardar únicamente el ID (`seleccionadoId`) y buscar el objeto derivado con `productos.find(p => p.id === seleccionadoId)`, el detalle siempre refleja instantáneamente la última versión editada.

#### Pregunta 4.4:
**Respuesta y Cita de Principios:**  
Para cumplir con los **Principios 3 (Evitar redundancia y estructurar el estado en la fuente adecuada)** y **4 (Evitar duplicar la misma fuente de verdad)** de React:
- La fuente de verdad del arreglo de productos editables vive como un estado local `productosLocal` en el componente raíz `App.tsx`.
- Este arreglo se inicializa y sincroniza con los datos obtenidos desde la API vía `useProducts`.
- Cuando el usuario guarda una modificación en `ProductForm`, `App` ejecuta la actualización inmutable `setProductosLocal(prev => prev.map(p => p.id === productoEditado.id ? productoEditado : p))`.
- De este modo, tanto `ProductList` como `ProductDetail` consumen la **misma y única fuente de verdad**, permitiendo editar productos y conservar los cambios en la sesión sin perder las modificaciones al filtrar o seleccionar otros elementos.

#### Pregunta 4.5:
**Respuesta:**  
El estado del carrito (`itemsCarrito`) debe alimentarse desde el botón "Agregar a la venta" presente en el detalle del producto (`ProductDetail`), pero su información necesita ser visible para el componente `Cart` e impactar la barra de navegación superior (título del documento). Dado que los componentes hermanos no pueden comunicarse entre sí directamente en React, el estado del carrito se elevó al ancestro común más cercano (`App.tsx`), pasando datos y callbacks como props hacia sus componentes hijos.

#### Pregunta 4.6
**Respuesta:**  
Modificar `document.title` es un efecto secundario que interactúa directamente con la API de la ventana del navegador (*Browser DOM*) fuera del árbol de renderizado de React Virtual DOM. Las funciones de los componentes deben ser puras durante el renderizado. Ejecutar mutaciones de `document.title` fuera de `useEffect` violaría la regla de pureza de React y ejecutaría cambios durante renderizados descartados. Incluirlo en `useEffect` con la dependencia `[unidadesTotalesCarrito]` garantiza que el título se actualice de forma limpia únicamente tras la confirmación del renderizado.
