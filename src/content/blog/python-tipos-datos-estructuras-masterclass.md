---
title: "Masterclass: Tipos de Datos y Estructuras en Python"
description: "Domina enteros, flotantes, textos, booleanos, None, listas, tuplas, diccionarios, conjuntos, conversiones, strings y comprensiones de listas con criterio de diseño."
pubDate: "2026-11-23"
updatedDate: "2026-11-23"
code: "python-tipos-datos-estructuras-masterclass"
category: "programacion"
tags: ["python", "tipos-de-datos", "estructuras-de-datos", "strings", "list-comprehension", "fundamentos"]
type: "masterclass"
level: "fundamento"
difficulty: "principiante"
readingTime: 22
---

# 🐍 Masterclass: tipos de datos y estructuras en Python

> 🎯 Vas a aprender a elegir la representación correcta para cada dato, a convertirla sin perder información y a recorrerla sin escribir más código del necesario. No hay programas para copiar: cada forma del lenguaje se explica por su función.

## 🗺️ Mapa de la masterclass

- **FASE 1 — Representar:** PARTE 1, números, textos, valores lógicos y ausencia de valor.
- **FASE 2 — Agrupar:** PARTE 2, colecciones ordenadas, mutables y sin duplicados.
- **FASE 3 — Transformar:** PARTES 3, 4 y 5, conversión segura, tratamiento de texto y comprensiones.

### 🧠 Pre-entrenamiento: seis ideas que vas a usar

- **Tipo:** etiqueta que dice qué operaciones acepta un valor.
- **Mutable:** se puede cambiar sin crear otro objeto.
- **Inmutable:** cualquier cambio produce un valor nuevo.
- **Indexable:** se accede por posición.
- **Hashable:** tiene una huella estable que permite usarlo como clave.
- **Iterable:** puede recorrerse elemento por elemento.

---

## 🧩 PARTE 1: Los cinco tipos que representan un valor (Nivel 1/5)

1. ❓ **PRETEST** — Si guardas el texto “42” y luego lo tratas como número, ¿el valor cambia de tipo solo porque lo parece?  
   > Respuesta esperada: no; un texto sigue siendo texto hasta que lo conviertas explícitamente.  
   > Si acertaste, ve al punto 7.

2. 🎯 **POR QUÉ + LOGRO** — Importa porque el tipo decide qué operaciones funcionan y qué errores aparecen. Vas a reconocer y justificar el tipo de un dato.

3. ⚡ **VICTORIA RÁPIDA (<5 min)** — Anota cinco datos de tu vida diaria y clasifícalos como número entero, número decimal, texto, sí/no o “sin dato”.

4. 💡 **CONCEPTO** — Analogía: el tipo es el envase; no guardas líquido en una caja de cartón. Los **enteros** representan cantidades sin decimales y en Python no tienen un límite práctico pequeño. Los **flotantes** representan decimales con precisión binaria, por eso ciertas sumas no dan exactamente lo esperado. Los **textos** son secuencias inmutables de caracteres. Los **booleanos** solo admiten verdadero o falso. **None** representa ausencia intencional de valor, no cero ni texto vacío.

5. 👀 **EJEMPLO RESUELTO** — Caso: registrar una compra. I Do: unidades → entero; precio con centavos → flotante o decimal exacto; nombre → texto; pagado → booleano; fecha de pago desconocida → None. We Do: ¿el precio debería ser flotante si el dinero exige exactitud? → conviene un tipo decimal, porque el flotante arrastra redondeos. You Do: clasifica los cinco campos de una ficha de cliente.

   ```mermaid
   flowchart TD
       V["Un valor"] --> N["Número: int o float"]
       V --> T["Texto: str"]
       V --> B["Verdad: bool"]
       V --> Z["Ausencia: None"]
   ```

   *👀 Se lee en un solo nivel: cuatro familias de valores, cada una con su tipo.*

6. ⚠️ **CONTRA-EJEMPLO / ERROR TÍPICO** — Comparar None con igualdad o usar un texto vacío como si fuera ausencia. Corrección: usa la comparación de identidad para None y decide si tu modelo necesita “vacío” o realmente “sin dato”.

7. 🧪 **PRÁCTICA** — Clasifica: saldo 0, nombre vacío, descuento 0.25, “no” como respuesta y campo no informado.  
   > Respuesta esperada / criterio: entero, texto, decimal, texto o booleano según el diseño, y None respectivamente; justifica cada elección.

8. 🔁 **RECALL** — ¿Por qué 0, texto vacío y None no significan lo mismo? (Bloom: comprender)

9. 📌 **IDEA CLAVE** — Elegir tipo es decidir qué significa un dato y qué operaciones permitirá.

10. ✅ **AUTO-CHEQUEO + SIGUIENTE** — [ ] Distingo entero de flotante. [ ] Sé que el texto es inmutable. [ ] Uso None para ausencia. Siguiente: agrupa varios valores.

---

## 🧩 PARTE 2: Cuatro estructuras y una decisión de diseño (Nivel 2/5)

1. ❓ **PRETEST** — Si necesitas buscar por nombre y no por posición, ¿qué estructura te conviene más: lista o diccionario?  
   > Respuesta esperada: diccionario, porque asocia una clave con un valor y evita recorrer toda la colección.  
   > Si lo sabías, avanza al punto 7.

2. 🎯 **POR QUÉ + LOGRO** — Importa porque la estructura correcta simplifica el código y evita errores de orden o duplicados. Vas a elegir entre las cuatro con un criterio explícito.

3. ⚡ **VICTORIA RÁPIDA (<5 min)** — Ordena estas tareas y elige una estructura para cada una: lista de invitados, coordenada fija, agenda por nombre, etiquetas únicas.

4. 💡 **CONCEPTO** — Analogía: la lista es una fila, la tupla una ficha sellada, el diccionario una agenda y el conjunto una bolsa sin repetidos. Las **listas** conservan orden, admiten duplicados y se modifican. Las **tuplas** conservan orden y no se modifican; sirven para datos fijos y como claves si todos sus elementos son hashables. Los **diccionarios** asocian claves únicas con valores y mantienen orden de inserción. Los **conjuntos** no admiten duplicados ni indexación y destacan en pertenencia.

5. 👀 **EJEMPLO RESUELTO** — Caso: catálogo de productos. I Do: nombre, precio y stock forman una tupla; el catálogo es una lista; el índice por código, un diccionario; las categorías únicas, un conjunto. We Do: si dos productos comparten código, el diccionario sobrescribe; hay que validar antes. You Do: propone una estructura para pedidos con varias líneas.

   ```mermaid
   flowchart TD
       Q["¿Necesitas modificar la colección?"] -->|"Sí"| M["list o dict"]
       Q -->|"No"| I["tuple o frozenset"]
       M --> C["Elige por orden o por clave"]
   ```

   *👀 Se lee de arriba abajo: primero mutabilidad, después el criterio de acceso.*

6. ⚠️ **CONTRA-EJEMPLO / ERROR TÍPICO** — Copiar una lista con una asignación simple y creer que son independientes. Corrección: distingue alias, copia superficial y copia profunda; los objetos internos pueden seguir compartidos.

7. 🧪 **PRÁCTICA** — Elige estructura para: historial ordenado con repetidos, clave fija compuesta, búsqueda por identificador y control de duplicados.  
   > Respuesta esperada / criterio: lista, tupla, diccionario y conjunto; explica por qué el orden o la unicidad lo exigen.

8. 🔁 **RECALL** — ¿Qué sacrificas al elegir un conjunto frente a una lista? (Bloom: analizar)

9. 📌 **IDEA CLAVE** — La estructura se elige por acceso, orden, unicidad y necesidad de cambio.

10. ✅ **AUTO-CHEQUEO + SIGUIENTE** — [ ] Sé cuándo usar cada colección. [ ] Entiendo mutabilidad. [ ] No confundo copia con alias. Siguiente: convierte datos entre tipos.

---

## 🧩 PARTE 3: Conversión de tipos sin perder información (Nivel 3/5)

1. ❓ **PRETEST** — Si conviertes el decimal 3.9 a entero, ¿obtienes 4 por redondeo?  
   > Respuesta esperada: no; la conversión trunca hacia cero, así que obtienes 3.  
   > Si acertaste, ve al punto 7.

2. 🎯 **POR QUÉ + LOGRO** — Importa porque los datos llegan como texto desde formularios y archivos. Vas a convertir con validación explícita en lugar de confiar en el formato.

3. ⚡ **VICTORIA RÁPIDA (<5 min)** — Escribe tres entradas de usuario que parecen números y marca cuáles fallarían al convertirlas.

4. 💡 **CONCEPTO** — Analogía: convertir es traducir; una traducción literal puede cambiar el sentido. A entero se pasa desde texto válido o desde otro número, truncando la parte decimal. A flotante se acepta notación decimal, pero no un separador de miles. A texto se convierte casi cualquier valor, pero el resultado puede no ser reversible. A booleano, cualquier valor no vacío suele ser verdadero, incluido el texto “False”. La conversión falla con una excepción cuando el formato no corresponde.

5. 👀 **EJEMPLO RESUELTO** — Caso: edad enviada como texto “ 34 ”. I Do: quito espacios y convierto a entero. We Do: ¿basta con convertir para aceptar el dato? → no; falta validar rango y reglas del negocio. You Do: diseña la validación de un precio con dos decimales.

   ```mermaid
   flowchart TD
       D["Dato externo"] --> P["Limpiar formato"]
       P --> C["Convertir con intento controlado"]
       C --> R["Validar rango y reglas"]
   ```

   *👀 Se lee de izquierda a derecha: limpiar, convertir y recién después validar.*

6. ⚠️ **CONTRA-EJEMPLO / ERROR TÍPICO** — Convertir un texto a booleano esperando que “False” sea falso. Corrección: interpreta explícitamente los valores permitidos y rechaza el resto.

7. 🧪 **PRÁCTICA** — Convierte mentalmente: “12” a entero, 7.8 a entero, 5 a texto y “0” a booleano.  
   > Respuesta esperada / criterio: 12, 7, “5” y verdadero; el último sorprende porque el texto no está vacío.

8. 🔁 **RECALL** — ¿Por qué convertir no es lo mismo que validar? (Bloom: comprender)

9. 📌 **IDEA CLAVE** — Toda conversión necesita un formato esperado y una regla de aceptación.

10. ✅ **AUTO-CHEQUEO + SIGUIENTE** — [ ] Sé que el entero trunca. [ ] Valido después de convertir. [ ] No confío en booleanos implícitos. Siguiente: procesa texto con precisión.

---

## 🧩 PARTE 4: Trabajar con textos sin efectos colaterales (Nivel 4/5)

1. ❓ **PRETEST** — Si reemplazas una palabra en un texto, ¿se modifica el original?  
   > Respuesta esperada: no; el texto es inmutable y el método devuelve uno nuevo.  
   > Si lo sabías, avanza al punto 7.

2. 🎯 **POR QUÉ + LOGRO** — Importa porque nombres, correos y mensajes requieren limpieza y comparación confiable. Vas a normalizar entradas y a separar texto por delimitadores.

3. ⚡ **VICTORIA RÁPIDA (<5 min)** — Toma un correo escrito con mayúsculas y espacios y describe los tres pasos para normalizarlo.

4. 💡 **CONCEPTO** — Analogía: el texto es una cinta de caracteres; cortas un tramo, no editas la cinta. Puedes acceder por índice, incluso negativo, y extraer rangos con inicio, fin y paso. Los métodos de limpieza y cambio de mayúsculas devuelven copias. Para unir muchos fragmentos conviene unirlos de una vez con un separador, no acumular concatenaciones. Las cadenas con formato permiten insertar valores con control de decimales. La longitud cuenta unidades de código, no siempre lo que el ojo percibe como un carácter.

5. 👀 **EJEMPLO RESUELTO** — Caso: lista de correos pegados de una planilla. I Do: quito espacios de los extremos y paso todo a minúsculas. We Do: ¿alcanza para deduplicar? → no; también hay que validar estructura y dominio. You Do: separa una línea con comas y reconstruye una salida limpia.

   ```mermaid
   flowchart TD
       T["Texto crudo"] --> L["Limpiar extremos"]
       L --> N["Normalizar mayúsculas"]
       N --> V["Dividir o unir según formato"]
   ```

   *👀 Se lee de izquierda a derecha: del texto original al formato listo para usar.*

6. ⚠️ **CONTRA-EJEMPLO / ERROR TÍPICO** — Comparar correos sin normalizar y concluir que son distintos. Corrección: define una forma canónica y aplica la misma regla a ambos lados de la comparación.

7. 🧪 **PRÁCTICA** — Normaliza el nombre “ Ana Pérez ” y explica qué métodos aplicarías en orden.  
   > Respuesta esperada / criterio: quitar extremos, unificar mayúsculas y conservar el espacio interno; el resultado no altera el original.

8. 🔁 **RECALL** — ¿Por qué indexar un texto no permite modificarlo en esa posición? (Bloom: comprender)

9. 📌 **IDEA CLAVE** — Normalizar antes de comparar evita duplicados invisibles.

10. ✅ **AUTO-CHEQUEO + SIGUIENTE** — [ ] Sé que el texto es inmutable. [ ] Normalizo antes de comparar. [ ] Uso unión en lugar de concatenar en bucles. Siguiente: transforma colecciones en una línea legible.

---

## 🧩 PARTE 5: Comprensiones de listas con criterio (Nivel 5/5)

1. ❓ **PRETEST** — ¿Una comprensión de lista sirve para ejecutar acciones con efectos, como guardar archivos?  
   > Respuesta esperada: no es su propósito; se usa para construir una colección a partir de otra.  
   > Si acertaste, ve al punto 7.

2. 🎯 **POR QUÉ + LOGRO** — Importa porque la misma tarea puede escribirse en una línea clara o en un bloque ilegible. Vas a decidir cuándo conviene una comprensión y cuándo un bucle.

3. ⚡ **VICTORIA RÁPIDA (<5 min)** — Toma cinco números y describe en voz alta cuáles son pares y cómo los elevarías al cuadrado.

4. 💡 **CONCEPTO** — Analogía: la comprensión es una receta de una línea: recorrer, filtrar y transformar. Su forma es una expresión de salida, seguida del recorrido y, opcionalmente, una condición. Puede producir listas, conjuntos o diccionarios, y una versión generadora entrega valores bajo demanda sin construir todo en memoria. Si necesitas varias condiciones anidadas, efectos secundarios o manejo de errores, un bucle explícito comunica mejor. La legibilidad manda sobre la brevedad.

5. 👀 **EJEMPLO RESUELTO** — Caso: de 1.000 registros, obtener los nombres en mayúsculas de quienes están activos. I Do: recorro, filtro por activo y transformo el nombre. We Do: ¿conviene una sola línea si además hay que registrar errores? → no; conviene un bucle con manejo explícito. You Do: escribe en lenguaje natural la comprensión de precios con descuento.

   ```mermaid
   flowchart TD
       I["Iterable de entrada"] --> F["Filtro opcional"]
       F --> X["Transformación"]
       X --> O["Nueva colección"]
   ```

   *👀 Se lee de izquierda a derecha: cada elemento entra, se filtra, se transforma y se agrega.*

6. ⚠️ **CONTRA-EJEMPLO / ERROR TÍPICO** — Anidar tres comprensiones y dos condiciones para ahorrar líneas. Corrección: si cuesta explicarla en una frase, sepárala en pasos con nombres claros.

7. 🧪 **PRÁCTICA** — Diseña una comprensión que deje solo notas aprobadas y las redondee a un decimal; descríbela en palabras.  
   > Respuesta esperada / criterio: recorre notas, descarta las menores al umbral, redondea las restantes y devuelve una lista nueva.

8. 🔁 **RECALL** — ¿Qué dos señales indican que conviene reemplazar una comprensión por un bucle? (Bloom: evaluar)

9. 📌 **IDEA CLAVE** — Una comprensión debe leerse como una frase; si necesita explicación, no es una línea.

10. ✅ **AUTO-CHEQUEO + SIGUIENTE** — [ ] Distingo recorrido, filtro y transformación. [ ] Sé cuándo usar un generador. [ ] Priorizo legibilidad. Próximo paso: aplica estas estructuras a un proyecto real y revisa tipos antes de optimizar.

---

## 📖 Glosario esencial de tipos y estructuras

*Glosario ampliado: se parte en bloques de cuatro filas para no saturar la lectura.*

| Término | Explicación sencilla |
|---|---|
| **Entero** | Número sin parte decimal; en Python su tamaño no está limitado a 32 bits. |
| **Flotante** | Número con decimales de precisión binaria; puede acumular errores de redondeo. |
| **Texto** | Secuencia inmutable de caracteres Unicode. |
| **Booleano** | Valor de verdad: verdadero o falso. |

*Continúa el glosario (2/5).*

| Término | Explicación sencilla |
|---|---|
| **None** | Valor único que expresa ausencia intencional de dato. |
| **Mutable** | Objeto cuyo contenido puede cambiar sin reemplazarlo. |
| **Inmutable** | Objeto que no cambia; toda operación produce otro objeto. |
| **Hashable** | Objeto con huella estable que puede usarse como clave o elemento de conjunto. |

*Continúa el glosario (3/5).*

| Término | Explicación sencilla |
|---|---|
| **Lista** | Colección ordenada y mutable que admite duplicados. |
| **Tupla** | Colección ordenada e inmutable; útil para datos fijos. |
| **Diccionario** | Asociación de claves únicas con valores, con orden de inserción. |
| **Conjunto** | Colección sin duplicados ni orden garantizado, optimizada para pertenencia. |

*Continúa el glosario (4/5).*

| Término | Explicación sencilla |
|---|---|
| **Alias** | Dos nombres que apuntan al mismo objeto. |
| **Copia superficial** | Nueva colección que comparte los objetos internos. |
| **Copia profunda** | Nueva estructura con copias recursivas de sus componentes. |
| **Conversión** | Cambio explícito de tipo; puede fallar si el formato no corresponde. |

*Continúa el glosario (5/5).*

| Término | Explicación sencilla |
|---|---|
| **Normalizar** | Llevar un dato a una forma canónica para compararlo o almacenarlo. |
| **Comprensión** | Expresión que construye una colección recorriendo y transformando otra. |
| **Generador** | Iterable que produce valores bajo demanda y no guarda toda la colección. |
| **Complejidad promedio** | Costo esperado de una operación; en diccionarios y conjuntos la búsqueda suele ser constante. |

> 🧭 **Regla final:** elige el tipo por su significado, la estructura por su acceso y la expresión por su claridad. El código corto que nadie entiende es deuda técnica.
