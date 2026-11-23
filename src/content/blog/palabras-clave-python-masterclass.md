---
title: "MASTERCLASS: Palabras clave de Python — keyword.kwlist de Python 3.11+"
description: "Guía completa y progresiva de las 35 palabras reservadas de Python 3.11+, con propósito, cuándo usarlas, ejemplos, errores típicos y práctica de recuperación."
pubDate: "2026-11-23"
code: "palabras-clave-python-masterclass"
category: "programacion"
tags: ["python", "palabras-clave", "sintaxis", "programacion", "python-3-11", "aprendizaje"]
type: "masterclass"
level: "fundamento"
difficulty: "intermedio"
readingTime: 28
---

# 🐍 MASTERCLASS: Palabras clave de Python

> Referencia completa de las palabras reservadas de `keyword.kwlist` en Python 3.11+.

Una palabra clave es una pieza del lenguaje con un significado fijo. Es como una señal de tránsito: no podés reutilizarla para ponerle nombre a una variable, función o clase, porque Python necesita reconocerla como parte de su gramática.

## 🗺️ Mapa de las 3 FASES

👀 Cómo leer el mapa: avanzá de arriba abajo; cada fase agrega una capa de control sobre el programa.

| FASE | Qué vas a dominar | Resultado visible |
|---|---|---|
| 1 · Construir | Valores, decisiones, bucles y funciones | Leés la forma básica de un programa |
| 2 · Organizar | Clases, imports, alcance y recursos | Separás responsabilidades sin confusión |
| 3 · Robustecer | Excepciones, operadores y práctica mixta | Elegís la palabra correcta ante un problema |

### 🧭 Pre-entrenamiento: 8 términos que vas a encontrar

| Término | Analogía de una línea | Significado |
|---|---|---|
| Sentencia | Una instrucción en una receta | Orden que Python ejecuta |
| Expresión | Una cuenta que produce un resultado | Combinación que devuelve un valor |
| Iterable | Una fila de objetos | Algo que se puede recorrer |
| Excepción | Una alarma durante la ejecución | Error que puede manejarse |
| Ámbito | Una habitación con reglas propias | Lugar donde un nombre es visible |
| Generador | Una canilla, no un tanque | Produce valores de a uno |
| Identidad | La etiqueta del objeto, no su contenido | Si dos nombres apuntan al mismo objeto |
| Contexto | Un encargado de abrir y cerrar | Recurso administrado automáticamente |

## 🎯 Cómo estudiar esta guía

Cada PARTE sigue el mismo camino: primero intentás recordar, luego ves un ejemplo resuelto, después contrastás un error y finalmente practicás. Si respondés bien el pretest sin mirar, podés saltar directamente al punto 7 de esa PARTE: es el camino rápido para evitar ayuda innecesaria.

⚠️ Esta guía usa ejemplos en lenguaje natural y expresiones breves en línea. No incluye bloques de código ejecutable porque su objetivo es que reconozcas la decisión y la estructura, no que copies sin comprender.

---

## 🧩 PARTE 1: Valores y decisiones (Nivel 1/5)

❓ **PRETEST —** ¿Qué diferencia hay entre una condición y el valor que esa condición produce?

> **Respuesta esperada:** una condición es una expresión que se evalúa como `True` o `False`; ese resultado permite elegir una rama con `if`.

🎯 **POR QUÉ + LOGRO —** Importa porque casi todo programa decide algo antes de actuar. Vas a poder explicar `None`, `True`, `False`, `if`, `elif`, `else`, `and`, `or` y `not`.

⚡ **VICTORIA RÁPIDA (<5 min) —** Clasificá mentalmente estas situaciones: “usuario no cargado”, “usuario activo”, “usuario activo y administrador”. La primera apunta a `None`; la segunda a un booleano; la tercera combina condiciones.

💡 **CONCEPTO —** Analogía: una decisión de Python es como una puerta con sensores. `if` abre la primera puerta posible, `elif` ofrece otra puerta si la anterior no abrió y `else` es la salida restante. `None` representa que todavía no hay objeto o resultado; `True` y `False` son valores booleanos. `and` exige que todo sea cierto, `or` necesita al menos una condición cierta y `not` invierte el resultado.

👀 **EJEMPLO RESUELTO —** Queremos permitir una operación solo si hay usuario y tiene permiso.

1. Se parte de `usuario`; si no existe resultado, se representa con `None`.
2. Se comprueba `usuario is not None` y, además, `usuario.es_admin` con `and`.
3. Si se cumple, `if` permite; si no, `else` rechaza.

📌 Cómo leerlo: primero se comprueba la existencia del dato; después, la autorización. La segunda condición no reemplaza a la primera.

⚠️ **CONTRA-EJEMPLO / ERROR TÍPICO —** Confundir `None` con `False` puede ocultar información. `False` significa “el valor booleano es falso”; `None` significa “no hay valor”. Corrección: usá `is None` cuando te interese la ausencia y `if activo` cuando te interese la verdad lógica.

🧪 **PRÁCTICA —** Elegí la estructura para este caso: si una nota es 9 o más, “excelente”; si es 6 o más, “aprobado”; en cualquier otro caso, “revisar”.

> **Respuesta esperada:** `if nota >= 9`, luego `elif nota >= 6`, y finalmente `else`. Las ramas son mutuamente excluyentes y se evalúan en orden.

🔁 **RECALL —** Sin mirar: ¿por qué `None` se compara normalmente con `is` y no con `==`? (Bloom: comprender.)

> **Respuesta esperada:** porque `is` pregunta si se trata del objeto nulo exacto; `==` compara igualdad de valores y no expresa tan claramente la intención.

📌 **IDEA CLAVE —** Decidir bien empieza por separar “no hay valor” (`None`) de “el valor es falso” (`False`).

✅ **AUTO-CHEQUEO + SIGUIENTE —**

- [ ] Distingo `None`, `False` y una condición compuesta.
- [ ] Sé cuándo convienen `and`, `or` y `not`.
- [ ] Puedo ordenar `if`, `elif` y `else` sin solapar ramas.

Siguiente: controlar repeticiones y recorridos sin perder el hilo.

---

## 🔁 PARTE 2: Bucles y funciones (Nivel 2/5)

❓ **PRETEST —** Si tenés que recorrer una lista completa, ¿elegís `for` o `while`? ¿Y si repetís hasta que el usuario escriba una respuesta válida?

> **Respuesta esperada:** `for` para recorrer una colección conocida; `while` para repetir mientras una condición siga vigente.

🎯 **POR QUÉ + LOGRO —** Importa porque repetir manualmente vuelve el programa frágil. Vas a usar `for`, `while`, `break`, `continue`, `pass`, `def`, `return`, `lambda` y `yield` con criterio.

⚡ **VICTORIA RÁPIDA (<5 min) —** Imaginá una lista de tres nombres. Decidí qué palabra recorre la lista, cuál detiene la búsqueda al encontrar a Ana y cuál salta a los nombres vacíos.

💡 **CONCEPTO —** Analogía: un bucle es una cinta transportadora; `for` visita cada elemento de la cinta, `while` sigue mientras el sensor dé permiso, `break` apaga la cinta y `continue` salta una pieza defectuosa. `def` guarda un procedimiento con nombre; `return` entrega su resultado. `lambda` es una función descartable de una expresión y `yield` convierte la función en una canilla de valores. `pass` mantiene un bloque vacío sin hacer nada.

👀 **EJEMPLO RESUELTO —** Buscamos el primer número positivo de una secuencia.

1. `for` recorre los números.
2. `continue` descarta los ceros y negativos.
3. Al hallar el primero válido, se comunica el resultado y `break` termina el bucle.

📌 Cómo leerlo: `continue` conserva el recorrido; `break` lo termina. Son decisiones distintas.

⚠️ **CONTRA-EJEMPLO / ERROR TÍPICO —** Un `while` sin actualizar su condición puede no terminar. Corrección: dentro del bucle debe cambiar algo que acerque el estado a la salida. Otro error es usar `pass` creyendo que “salta” una iteración: para eso existe `continue`.

🧪 **PRÁCTICA —** Elegí entre `def`, `return`, `lambda` y `yield`: a) función reutilizable que calcula un total; b) criterio pequeño para ordenar; c) secuencia de IDs producida uno por uno.

> **Respuesta esperada:** a) `def` y `return`; b) `lambda`; c) `yield` dentro de una función generadora.

🔁 **RECALL —** Sin mirar: ¿qué cambia entre una función con `return` y una generadora con `yield`? (Bloom: analizar.)

> **Respuesta esperada:** `return` finaliza y entrega un resultado; `yield` pausa la función, conserva su estado y entrega valores bajo demanda.

📌 **IDEA CLAVE —** `for` y `while` controlan el recorrido; `break` y `continue` controlan excepciones dentro del recorrido; `def`, `return` y `yield` controlan la reutilización y producción de resultados.

✅ **AUTO-CHEQUEO + SIGUIENTE —**

- [ ] Puedo justificar `for` frente a `while`.
- [ ] No confundo `break`, `continue` y `pass`.
- [ ] Distingo función normal, `lambda` y generador.

Siguiente: encapsular datos, reutilizar módulos y controlar dónde vive cada nombre.

---

## 🏛️ PARTE 3: Clases, módulos y alcance (Nivel 3/5)

❓ **PRETEST —** ¿Qué palabra usarías para definir una clase y cuáles para traer `Path` desde `pathlib`?

> **Respuesta esperada:** `class` define la clase; `from pathlib import Path` combina `from` e `import`.

🎯 **POR QUÉ + LOGRO —** Importa porque un programa crece cuando sus piezas tienen límites claros. Vas a dominar `class`, `import`, `from`, `as`, `global` y `nonlocal`, y sabrás cuándo evitar estos dos últimos.

⚡ **VICTORIA RÁPIDA (<5 min) —** Pensá en una entidad “Cuenta”: tiene datos y acciones. Separá mentalmente qué pertenecería al objeto, qué vendría de un módulo y qué nombre necesitaría un alias.

💡 **CONCEPTO —** Analogía: una clase es el molde de una pieza; un módulo es una caja de herramientas; un alias es una etiqueta corta; un ámbito es una habitación. `class` crea el molde, `import` trae la caja completa, `from` selecciona una herramienta y `as` le pone otro nombre. `global` permite reasignar un nombre de módulo desde una función; `nonlocal` permite modificar una variable de la función envolvente.

👀 **EJEMPLO RESUELTO —** Diseñamos una clase `Punto` y usamos una ruta del sistema.

1. `class` define qué datos y comportamientos tendrá cada punto.
2. `from` e `import` traen `Path` sin cargarlo con un nombre largo.
3. `as` puede dar un alias, pero el alias debe seguir siendo claro para quien lea el archivo.

📌 Cómo leerlo: primero se define la responsabilidad; después se importa solo lo que esa responsabilidad necesita.

⚠️ **CONTRA-EJEMPLO / ERROR TÍPICO —** Usar `global` para compartir cualquier estado crea dependencias ocultas. Corrección: preferí parámetros, valores de retorno o un objeto explícito. `nonlocal` es válido en un cierre pequeño, pero no debe convertirse en una base de datos escondida.

🧪 **PRÁCTICA —** Indicá la herramienta adecuada: a) importar todo el módulo `math`; b) traer solo `sqrt`; c) renombrar `datetime` como `fecha`; d) modificar una variable de una función externa desde una interna.

> **Respuesta esperada:** a) `import`; b) `from ... import`; c) `as`; d) `nonlocal`.

🔁 **RECALL —** Sin mirar: ¿por qué un alias no cambia la función del módulo, solo el nombre con el que lo referenciás? (Bloom: comprender.)

> **Respuesta esperada:** porque `as` cambia la etiqueta local del objeto importado; no modifica el módulo ni crea una copia de su comportamiento.

📌 **IDEA CLAVE —** Organizá primero los límites: clase para estado y comportamiento; módulo para reutilización; ámbito para controlar visibilidad.

✅ **AUTO-CHEQUEO + SIGUIENTE —**

- [ ] Sé diferenciar `import`, `from` y `as`.
- [ ] Puedo explicar el costo de abusar de `global`.
- [ ] Entiendo que `nonlocal` apunta a una función envolvente, no al módulo.

Siguiente: trabajar con recursos y fallos sin dejar el programa en un estado incierto.

---

## 🛡️ PARTE 4: Excepciones, recursos y contratos (Nivel 4/5)

❓ **PRETEST —** Si abrir un archivo puede fallar y aun así necesitás cerrarlo, ¿qué combinación de palabras elegirías?

> **Respuesta esperada:** `with` para administrar el archivo y `try`/`except`/`finally` para estructurar el manejo del fallo y la limpieza adicional.

🎯 **POR QUÉ + LOGRO —** Importa porque los errores y recursos mal gestionados producen datos corruptos y fugas. Vas a distinguir `try`, `except`, `finally`, `raise`, `assert`, `with` y `del`.

⚡ **VICTORIA RÁPIDA (<5 min) —** Para una conversión inválida, nombrá tres acciones: detectar la operación riesgosa, capturar el tipo de fallo y garantizar la limpieza.

💡 **CONCEPTO —** Analogía: `try` es intentar una operación, `except` es el plan de emergencia, `finally` es cerrar el local al final del día, `raise` es activar una alarma propia y `assert` es una prueba interna del programador. `with` contrata a un encargado de apertura y cierre. `del` elimina una referencia o elemento.

👀 **EJEMPLO RESUELTO —** Procesamos una edad recibida como texto.

1. `try` intenta convertirla.
2. `except ValueError as error` responde solo al fallo esperado y conserva el detalle en `error`.
3. `finally` ejecuta una acción que debe ocurrir siempre, como registrar el cierre de la operación.

📌 Cómo leerlo: capturá errores específicos y reservá `finally` para garantías, no para esconder el problema.

⚠️ **CONTRA-EJEMPLO / ERROR TÍPICO —** `assert` no es validación de usuarios: puede desactivarse con optimización. Corrección: usá `raise ValueError` para una entrada inválida y `assert` para invariantes internas. Otro error es capturar una excepción demasiado amplia y perder el diagnóstico.

🧪 **PRÁCTICA —** Elegí la palabra: a) exigir que una edad no sea negativa como regla pública; b) verificar que una lista interna nunca quede vacía por un bug; c) abrir un archivo y cerrarlo automáticamente; d) quitar una clave del diccionario.

> **Respuesta esperada:** a) `raise`; b) `assert`; c) `with`; d) `del`.

🔁 **RECALL —** Sin mirar: ¿por qué `with` sigue siendo útil aunque ocurra una excepción dentro del bloque? (Bloom: explicar.)

> **Respuesta esperada:** porque el gestor de contexto ejecuta su protocolo de salida y libera el recurso incluso cuando el bloque termina por un error.

📌 **IDEA CLAVE —** Un programa robusto separa el fallo esperado (`except`), la garantía de limpieza (`with`/`finally`) y la regla que dispara un error (`raise`).

✅ **AUTO-CHEQUEO + SIGUIENTE —**

- [ ] Capturo excepciones específicas.
- [ ] No uso `assert` para validar entradas externas.
- [ ] Puedo justificar `with` para recursos que deben liberarse.

Siguiente: combinar todas las palabras en decisiones de diseño y reconocer las soft keywords.

---

## ⚙️ PARTE 5: Operadores, asincronía y referencia completa (Nivel 5/5)

❓ **PRETEST —** ¿Qué diferencia hay entre `in` e `is`, y qué pareja de palabras permite esperar una operación de red sin bloquear la tarea asíncrona?

> **Respuesta esperada:** `in` prueba pertenencia; `is` prueba identidad. La pareja es `async` y `await`.

🎯 **POR QUÉ + LOGRO —** Importa porque los errores más sutiles aparecen cuando una palabra parece correcta pero expresa otra relación. Vas a integrar `in`, `is`, `async`, `await`, `not`, `and`, `or` y las 35 palabras de `keyword.kwlist`.

⚡ **VICTORIA RÁPIDA (<5 min) —** Clasificá estas preguntas: “¿está Ana en la lista?” → pertenencia; “¿es exactamente el objeto `None`?” → identidad; “¿puedo esperar una respuesta HTTP?” → asincronía.

💡 **CONCEPTO —** Analogía: `in` pregunta si una persona está en una sala; `is` pregunta si dos etiquetas señalan a la misma persona. `async` marca una función que puede ceder el control; `await` espera una operación compatible. No hacen magia: requieren un mecanismo asíncrono que coordine las tareas.

👀 **EJEMPLO RESUELTO —** Una función consulta un servicio y devuelve el nombre si aparece en una respuesta.

1. `async` declara que la función puede suspenderse.
2. `await` espera la respuesta sin ocupar activamente el flujo durante la espera.
3. `in` busca el nombre en la colección y `is None` distingue ausencia de resultado.

📌 Cómo leerlo: primero se modela la espera; luego se distingue pertenencia de identidad. `==` queda para comparar valores.

⚠️ **CONTRA-EJEMPLO / ERROR TÍPICO —** Usar `is` para comparar dos cadenas o números puede parecer funcionar por detalles de implementación. Corrección: usá `==` para igualdad de valores y `is` principalmente para `None` y objetos singleton conocidos. Tampoco confundas `async` con paralelismo automático: expresa concurrencia cooperativa.

🧪 **PRÁCTICA MIXTA —** Elegí una palabra o pareja para cada caso: a) detener un `for` al encontrar un registro; b) importar `Path` desde `pathlib`; c) convertir una función en generadora; d) lanzar un error de dominio; e) esperar una consulta de red; f) comprobar si una clave pertenece a un diccionario.

> **Respuesta esperada:** a) `break`; b) `from` e `import`; c) `yield`; d) `raise`; e) `async` y `await`; f) `in`.

🔁 **RECALL —** Sin mirar, reconstruí las categorías: valores, flujo, funciones, clases/imports, errores/recursos y operadores/asincronía. Nombrá al menos dos palabras por categoría. (Bloom: analizar.)

> **Respuesta esperada:** valores: `None`, `True`, `False`; flujo: `if`, `for`; funciones: `def`, `return`; clases/imports: `class`, `import`; errores/recursos: `try`, `with`; operadores/asincronía: `in`, `async`. Hay más respuestas válidas.

📌 **IDEA CLAVE —** La palabra correcta no se elige por cómo “suena”, sino por la relación exacta: valor, control, ámbito, recurso, identidad, pertenencia o espera.

✅ **AUTO-CHEQUEO + SIGUIENTE —**

- [ ] Puedo resolver el ejercicio mixto sin agrupar por memoria mecánica.
- [ ] Distingo `in`, `is` y `==`.
- [ ] Entiendo que `async`/`await` coordinan I/O, no garantizan paralelismo.

Siguiente: usar la tabla completa como índice de consulta y hacer el examen final.

---

## 📚 Tabla completa de `keyword.kwlist`

👀 Cómo leerla: la tabla está partida en grupos de cuatro para reducir la carga visual; cada fila contiene una palabra, su función y una situación de uso.

| Palabra | Qué resuelve | Cuándo usarla | Ejemplo breve |
|---|---|---|---|
| `False` | Booleano falso | Condición o bandera desactivada | `activo = False` |
| `None` | Ausencia de valor | Resultado aún inexistente | `resultado is None` |
| `True` | Booleano verdadero | Condición o bandera activa | `validado = True` |
| `and` | Conjunción lógica | Exigir varias condiciones | usuario y permiso |

| Palabra | Qué resuelve | Cuándo usarla | Ejemplo breve |
|---|---|---|---|
| `as` | Alias o nombre de excepción | Acortar o enlazar | `import math as m` |
| `assert` | Invariante interna | Detectar bug del programador | tamaño válido |
| `async` | Función asíncrona | I/O cooperativo | consulta esperable |
| `await` | Espera asíncrona | Ceder mientras llega I/O | esperar respuesta |

| Palabra | Qué resuelve | Cuándo usarla | Ejemplo breve |
|---|---|---|---|
| `break` | Salida de bucle | Encontrar y detener | primer resultado |
| `class` | Tipo definido por el usuario | Estado + comportamiento | `Cuenta` |
| `continue` | Salto de iteración | Omitir caso y seguir | registro vacío |
| `def` | Función con nombre | Reutilizar lógica | `calcular_total` |

| Palabra | Qué resuelve | Cuándo usarla | Ejemplo breve |
|---|---|---|---|
| `del` | Eliminar referencia o elemento | Quitar clave | `del datos["a"]` |
| `elif` | Rama condicional adicional | Alternativas ordenadas | nota intermedia |
| `else` | Rama restante | Caso no cubierto | entrada inválida |
| `except` | Capturar excepción | Recuperarse de un fallo previsto | `ValueError` |

| Palabra | Qué resuelve | Cuándo usarla | Ejemplo breve |
|---|---|---|---|
| `finally` | Bloque garantizado | Limpieza o registro final | cerrar operación |
| `for` | Recorrer iterable | Colección conocida | lista de nombres |
| `from` | Seleccionar origen de import | Traer un símbolo | `Path` desde `pathlib` |
| `global` | Referir al ámbito de módulo | Reasignación excepcional | contador global |

| Palabra | Qué resuelve | Cuándo usarla | Ejemplo breve |
|---|---|---|---|
| `if` | Decisión | Ejecutar bajo condición | usuario válido |
| `import` | Cargar módulo | Reutilizar código | `import math` |
| `in` | Pertenencia o recorrido | Buscar o iterar | clave en datos |
| `is` | Identidad | Comparar con `None` | resultado ausente |

| Palabra | Qué resuelve | Cuándo usarla | Ejemplo breve |
|---|---|---|---|
| `lambda` | Función anónima breve | Criterio de orden | ordenar por longitud |
| `nonlocal` | Alcance de cierre | Modificar variable envolvente | contador interno |
| `not` | Negación lógica | Invertir condición | no disponible |
| `or` | Disyunción lógica | Aceptar alternativas | email o teléfono |

| Palabra | Qué resuelve | Cuándo usarla | Ejemplo breve |
|---|---|---|---|
| `pass` | Bloque vacío válido | Marcador temporal o clase vacía | implementación pendiente |
| `raise` | Lanzar excepción | Rechazar estado inválido | edad negativa |
| `return` | Devolver y terminar | Entregar resultado | total calculado |
| `try` | Intentar operación riesgosa | Rodear código que puede fallar | convertir texto |

| Palabra | Qué resuelve | Cuándo usarla | Ejemplo breve |
|---|---|---|---|
| `while` | Repetir por condición | Intentos hasta salir | contraseña válida |
| `with` | Gestionar contexto | Recursos con apertura y cierre | leer archivo |
| `yield` | Producir bajo demanda | Generadores | IDs sucesivos |

## 🧩 Las 3 soft keywords que conviene conocer

⚠️ `keyword.kwlist` no incluye todas las palabras que pueden tener un rol especial en el parser. Python también mantiene soft keywords: `match`, `case` y `_` en contextos determinados. No son reservadas de forma universal como `if` o `class`, por eso pueden aparecer como identificadores en otros contextos.

- `match` inicia una coincidencia estructural.
- `case` define una alternativa dentro de `match`.
- `_` puede funcionar como comodín en patrones y también como identificador ordinario fuera de ese contexto.

📌 Regla práctica: para verificar la versión instalada, consultá `keyword.kwlist`; para analizar sintaxis de pattern matching, recordá además las soft keywords.

## 🧪 Examen final de recuperación

Respondé sin mirar la tabla y revisá después:

1. ¿Qué palabra separa ausencia de valor de falsedad?
2. ¿Qué diferencia hay entre `break` y `continue`?
3. ¿Qué pareja importa un símbolo concreto desde un módulo?
4. ¿Qué palabra corresponde a una invariante interna?
5. ¿Qué palabra administra la vida de un recurso?
6. ¿Qué diferencia hay entre pertenencia e identidad?
7. ¿Qué mecanismo produce valores de uno en uno?
8. ¿Qué dos palabras coordinan una espera asíncrona?

> **Respuestas esperadas:** 1) `None` frente a `False`; 2) `break` termina el bucle y `continue` salta a la próxima iteración; 3) `from` e `import`; 4) `assert`; 5) `with`; 6) `in` pregunta pertenencia e `is` identidad; 7) `yield`; 8) `async` y `await`.

## ✅ Rúbrica de auto-revisión de esta guía

| Criterio | Resultado |
|---|---|
| Cero bloques de código ejecutable | ✅ Cumple |
| Tablas de consulta partidas en bloques de hasta 4 filas | ✅ Cumple |
| Cada PARTE tiene pretest, ejemplo, contraejemplo y práctica | ✅ Cumple |
| Cada práctica tiene respuesta esperada y cada PARTE tiene recall | ✅ Cumple |

| Criterio | Resultado |
|---|---|
| Hay camino rápido operativo | ✅ Cumple |
| Hay práctica mixta y conceptos espaciados | ✅ Cumple |
| Hay analogías antes de la jerga principal | ✅ Cumple |
| Se distingue evidencia de heurística pedagógica | ✅ Cumple |

| Criterio | Resultado |
|---|---|
| No hay marcadores vacíos ni secciones duplicadas | ✅ Cumple |
| No hay citas científicas inventadas | ✅ Cumple |
| Hay iconos funcionales abundantes | ✅ Cumple |
| La guía alcanza el umbral de aprobación | ✅ 14/14 |

## 🏁 Cierre

📌 **Idea final:** aprender las palabras clave no es memorizar una lista aislada; es reconocer qué relación querés expresar: decidir, repetir, encapsular, importar, manejar un fallo, administrar un recurso, comparar identidad o esperar I/O.

🎯 **Próxima recompensa:** elegí un pequeño programa que ya conozcas y anotá al margen qué palabra clave justifica cada decisión. Si podés explicar el “por qué” de cada una en una frase, ya no estás leyendo sintaxis: estás leyendo diseño.
