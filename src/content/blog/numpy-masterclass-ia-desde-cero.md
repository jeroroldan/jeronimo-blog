---
title: "NumPy desde Cero: Masterclass para Entrar a la IA"
description: "Masterclass sin código: arrays, formas, vectorización, filtros y estadística con NumPy para entender datos de IA."
pubDate: "2026-10-14"
code: "numpy-masterclass-ia-cero"
language: "es"
category: "ia"
tags: ["numpy", "python", "ia", "datos", "fundamentos"]
type: "masterclass"
level: "fundamento"
difficulty: "fundamento"
readingTime: 25
heroImage: '../../assets/numpyimg.jpg'
---

# 🚀 NumPy desde Cero: Tu Base para la IA

> 🗺️ Esta guía es tu mapa antes de modelos, redes y prompts complejos. Sin NumPy, la IA parece magia. Con NumPy, ves los datos moverse.

## 🗺️ Mapa de 3 FASES (Niveles 1→5)

*👀 Cómo leerlo: seguí las flechas de arriba hacia abajo. Son 3 fases y 5 niveles en orden fácil → difícil.*

🗺️ FASE 1 · Cimientos → 🧩 PARTE 1 El array + 📦 PARTE 2 Formas
→ 🗺️ FASE 2 · Poder → ⚡ PARTE 3 Operar sin bucles + 🔍 PARTE 4 Filtrar datos
→ 🗺️ FASE 3 · Puente a IA → 🧠 PARTE 5 Resumir datos por ejes

🎯 Logro final: vas a leer cualquier dato de IA como filas, columnas y resúmenes, sin miedo.

## 📚 Pre-entrenamiento: 8 palabras antes de empezar

*👀 Cómo leerla: primera columna es la palabra nueva, segunda es la idea en simple. Son 8 ideas en 2 bloques para no saturar.*

| 🎯 Término | 💡 Idea en 1 línea |
|---|---|
| array | fila de cajas ordenadas que se operan juntas |
| dimensión | cuántos pisos tiene el edificio de datos |
| forma | cuántas filas por cuántas columnas hay |
| eje | la dirección donde mirás: filas o columnas |

*Continúa la tabla (2/2) — partida en bloques de ≤4 para no saturar.*

| 🎯 Término | 💡 Idea en 1 línea |
|---|---|
| vectorización | operar todo junto en vez de uno por uno |
| máscara | colador que deja pasar solo lo que cumple una condición |
| slicing | cortar una rebanada del pastel de datos |
| broadcasting | estirar un dato chico para que alcance al grande |

> ✅ Ya tenés el vocabulario. Si estas 8 ideas te suenan, la guía será fácil.

## 🧩 PARTE 1: El Array, Tu Caja Ordenada (Nivel 1/5)

1. ❓ PRETEST — ¿Qué diferencia hay entre una bolsa de compras y una cubitera de hielo?
> Respuesta esperada: la bolsa mezcla todo sin orden, la cubitera tiene lugares fijos e iguales.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque la IA solo aprende de datos ordenados e iguales. Vas a lograr distinguir lista suelta de array ordenado en 1 minuto.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Pensá 20, 22, 24. Subiles 2 a las 3 a la vez. 🎉 Ya pensaste como NumPy.

4. 💡 CONCEPTO — Analogía: lista es como bolsa de compras, array es como cubitera. Definición: array es una colección ordenada donde todo es del mismo tipo y se opera junto. (Pre-training + señalización | Media)

5. 👀 EJEMPLO RESUELTO (I Do: yo te muestro) — Caso: notas 4, 6, 8 y querés sumar 2 a cada una.
> Pasos: 1 Tomo la fila completa → 2 Aplico sumar 2 a toda la fila → 3 Obtengo 6, 8, 10.
> Diagrama: Fila inicial → Orden única → Fila nueva.
> *👀 Cómo leerlo: de izquierda a derecha, 3 pasos sin vueltas.*
> Por qué funciona: al ser todo igual, una orden sirve para todos. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO (We Do: lo corregimos juntos) — Error: mezclar texto con números, como manzana, 10, 20. → Todo se vuelve texto y no suma. Corrección: números para calcular, texto aparte. Cuándo falla: cuando mezclás tipos. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA (You Do: hacés vos, contexto distinto) — Tenés ventas de 3 días: 100, 150, 200. Querés calcular el doble de cada día con una sola orden mental.
> Respuesta esperada / criterio: 200, 300, 400. Logrado si das los 3 sin calcular uno por uno. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿por qué un array calcula más rápido que una lista suelta? (Nivel Bloom: comprender)
> Respuesta esperada: porque todo es igual y ordenado, entonces una orden aplica a todos.

9. 📌 IDEA CLAVE — 📌 Array es cubitera, no bolsa: todo igual y junto.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Distingo array de lista [ ] Explico por qué opera junto [ ] Hice la práctica sin bucle mental. Siguiente: 🎁 vas a doblar tablas enteras en la PARTE 2.

## 📦 PARTE 2: Forma y Dimensiones, El Mapa del Dato (Nivel 2/5)

1. ❓ PRETEST — Si tenés 6 huevos y una caja de 2 filas por 3 columnas, ¿cambian los huevos si los reordenás?
> Respuesta esperada: no, cambian de lugar pero siguen siendo 6.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque en IA una imagen es una tabla de números con forma exacta. Vas a lograr leer cualquier forma como filas por columnas.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Contá esta fila: 1, 2, 3, 4, 5, 6. Ahora partila en 2 filas de 3. 🎉 Reordenaste sin perder datos.

4. 💡 CONCEPTO — Analogía: dimensión es como pisos de un edificio, forma es como puertas por piso. Definición: forma dice cuántos hay por dirección, dimensión dice cuántas direcciones hay. Reaparece array de PARTE 1. (Pre-training + señalización | Media)

5. 👀 EJEMPLO RESUELTO (I Do) — Caso: 6 puntajes en fila que quiero ver como 2 filas de 3.
> Pasos: 1 Cuento total: 6 → 2 Elijo forma 2 por 3 → 3 Reubico sin perder ninguno.
> Diagrama: Fila de 6 → Elijo 2x3 → Tabla 2x3.
> *👀 Cómo leerlo: de izquierda a derecha, el total nunca cambia.*
> Por qué funciona: reordenar no crea ni borra datos. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO (We Do) — Error: querer pasar 5 datos a forma 2 por 3. → Sobran o faltan huecos, imposible. Corrección: solo reordenar si filas por columnas da el total exacto. Cuándo falla: cuando el total no coincide. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA (You Do, contexto distinto) — Tenés 12 fotos numeradas en fila. Querés verlas como 3 filas de 4. ¿Se puede? ¿Por qué?
> Respuesta esperada / criterio: sí, porque 3 por 4 da 12 justo. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué dos datos te da la forma de un array? (Nivel Bloom: recordar) Reaparece array.
> Respuesta esperada: cuántas filas y columnas hay en cada dirección.

9. 📌 IDEA CLAVE — 📌 La forma reordena el mapa, nunca inventa datos.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Leo forma como filas por columnas [ ] Verifico total antes de reordenar [ ] Resolví el caso de 12 fotos. Siguiente: 🎁 vas a operar miles de datos sin bucles en la PARTE 3.

## ⚡ PARTE 3: Operar Todo Junto sin Bucles (Nivel 3/5)

1. ❓ PRETEST — Si querés regar 100 plantas, ¿vas con un vaso una por una o abrís un aspersor?
> Respuesta esperada: aspersor, una acción riega todas.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque entrenar IA es aplicar la misma operación a millones de números. Vas a lograr predecir resultados de operaciones masivas sin calcular uno por uno.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Tomá 10, 20, 30 y sumales 5 de golpe: 15, 25, 35. 🎉 Vectorizaste.

4. 💡 CONCEPTO — Analogía: vectorización es como aspersor, broadcasting es como estirar salsa para 4. Definición: vectorizar es operar todo junto; broadcasting adapta un dato chico al grande. Reaparecen array y forma. (Pre-training + señalización | Media)

| 👀 Caso | 💡 Qué pasa |
|---|---|
| Fila más 10 | cada caja sube 10 a la vez |
| Fila más fila | cada caja se suma con su gemela |
| Una tabla más un número | el número se estira a toda la tabla |

*👀 Cómo leerla: cada fila es un caso distinto, de menor a mayor estiramiento.*

5. 👀 EJEMPLO RESUELTO (I Do) — Caso: precios 100, 200, 300 con 10 de descuento.
> Pasos: 1 Tomo tabla de 3 → 2 Estiro el 10 a tamaño 3 → 3 Resto junto: 90, 190, 290.
> Diagrama: Tabla + Dato chico → Estiramiento → Tabla nueva.
> *👀 Cómo leerlo: 3 pasos, el chico se adapta al grande.*

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO (We Do) — Error: sumar fila de 3 con fila de 4. → Sin gemelo por caja, choca. Corrección: igualar tamaños o estiramiento limpio. Cuándo falla: formas incompatibles. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA (You Do, contexto distinto) — Puntajes 5, 5, 5 y bonus 2, 4, 6. Sumá parejas gemelas. Luego sumá 1 extra a todos.
> Respuesta esperada / criterio: primero 7, 9, 11; luego 8, 10, 12. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué hace broadcasting cuando sumás una tabla más un número? (Nivel Bloom: comprender) Reaparecen forma y array.
> Respuesta esperada: estira el número al tamaño de la tabla y opera todo junto.

9. 📌 IDEA CLAVE — 📌 Una orden riega todo el campo si las formas encajan.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Distingo operar junto de ir uno por uno [ ] Explico el estiramiento [ ] Resolví bonus por parejas. Siguiente: 🎁 vas a cazar datos con filtros ninja en la PARTE 4.

## 🔍 PARTE 4: Cortar y Filtrar como Detective (Nivel 4/5)

1. ❓ PRETEST — Para quedarte con las páginas 5 a 8 de un libro, ¿arrancás el libro o marcás el rango?
> Respuesta esperada: marco el rango, no rompo nada.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque en IA el 80 por ciento del trabajo es elegir datos buenos. Vas a lograr cortar rebanadas y filtrar solo lo útil sin tocar el original.

3. ⚡ VICTORIA RÁPIDA (<5 min) — De 10, 20, 30, 40, 50 quedate con mayores a 25. 🎉 Filtraste: 30, 40, 50.

4. 💡 CONCEPTO — Analogía: slicing es rebanar pan, máscara es colador, índice es número de asiento. Definición: slicing corta por posición; máscara deja pasar por condición. Reaparecen array y eje. (Pre-training + señalización | Media)

5. 👀 EJEMPLO RESUELTO (I Do) — Caso: edades 15, 22, 30, 17, 40, quiero mayores de 17.
> Pasos: 1 Pregunto quién pasa de 17 → 2 Armo colador → 3 Dejo pasar 22, 30, 40.
> Diagrama: Fila total → Colador de condición → Fila filtrada.
> *👀 Cómo leerlo: de izquierda a derecha, el colador decide quién pasa.*
> Por qué funciona: la condición se prueba en todas las cajas a la vez. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO (We Do) — Error: pensar que la rebanada es una copia separada y rayarla sin miedo. → A veces es una ventana al original y lo manchás. Corrección: si vas a romper, pedí copia explícita antes. Cuándo falla: cuando editás sin copiar. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA (You Do, contexto distinto) — Temperaturas: 18, 21, 25, 30, 16. Quedate con días de calor mayor a 20 y cortá los 3 primeros datos como rebanada.
> Respuesta esperada / criterio: calor: 21, 25, 30; rebanada: 18, 21, 25. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué diferencia hay entre rebanar por posición y filtrar por condición? (Nivel Bloom: analizar) Reaparece broadcasting como operación masiva.
> Respuesta esperada: rebanar corta por lugar, filtrar deja pasar por cumplir una regla.

9. 📌 IDEA CLAVE — 📌 Rebaná por lugar, colá por condición, copiá si vas a romper.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Corto rangos sin perderme [ ] Filtro con condición [ ] Sé cuándo pedir copia. Siguiente: 🎁 vas a resumir miles de datos en 1 número para IA en la PARTE 5.

## 🧠 PARTE 5: Resumir Datos para que la IA Aprenda (Nivel 5/5)

1. ❓ PRETEST — Con notas 4, 6, 10, ¿qué número resume mejor el grupo y cuál muestra el riesgo?
> Respuesta esperada: promedio 6.6 resume, el mínimo 4 muestra riesgo.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque ningún modelo mira millón por millón, mira resúmenes. Vas a lograr resumir cualquier tabla por filas o columnas con promedio y picos.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Promediá 2, 4, 6: 12 entre 3 da 4. 🎉 Resumiste 3 en 1.

4. 💡 CONCEPTO — Analogía: eje es mirar el edificio de frente o costado, promedio es repartir torta igual. Definición: resumir por eje es colapsar una dirección para un número por fila o columna. Reaparecen forma, eje y vectorización. (Pre-training + señalización | Media)

| 👀 Resumen | 💡 Qué te dice |
|---|---|
| promedio | el centro repartido del grupo |
| máximo y mínimo | los bordes y picos del grupo |
| suma por eje | el total mirando filas o columnas |

*👀 Cómo leerla: cada fila es un resumen distinto, del centro a los bordes.*

5. 👀 EJEMPLO RESUELTO (I Do) — Caso: ventas de 2 locales: fila 1 con 10 y 30, fila 2 con 20 y 40.
> Pasos: 1 Miro por columnas → 2 Promedio mañana con mañana y tarde con tarde → 3 Obtengo 15 y 35.
> Diagrama: Tabla 2x2 → Elijo dirección → Fila resumen.
> *👀 Cómo leerlo: 3 pasos, la dirección elegida se colapsa.*
> Por qué funciona: colapsar un eje conserva la otra dirección intacta. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO (We Do) — Error: promediar todo sin eje. → Mezclás turnos y perdés la historia. Corrección: ¿resumen por local o por turno? Cuándo falla: sin dirección. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA (You Do, contexto distinto) — Notas de 2 alumnos en 3 pruebas: Ana 6, 8, 10 y Bruno 4, 4, 10. Calculá promedio por alumno y máximo por prueba.
> Respuesta esperada / criterio: Ana 8, Bruno 6; máximos por prueba: 6, 8, 10. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿por qué resumir por eje es clave antes de entrenar una IA? (Nivel Bloom: evaluar) Reaparecen máscara y forma.
> Respuesta esperada: porque convierte miles de datos en señales comparables sin perder la dirección que importa.

9. 📌 IDEA CLAVE — 📌 Sin eje no hay resumen, sin resumen no hay IA.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Elijo eje antes de resumir [ ] Distingo promedio de picos [ ] Resolví caso Ana y Bruno. Siguiente: 🎁 práctica mixta final para blindar todo.

## 🧪 Práctica mixta final (interleaving: mezcla todo)

*👀 Cómo leerla: 3 desafíos mezclan PARTES distintas. No los hagas en orden de la guía.*

1. 🧪 Mezcla 1+4 — Tenés 8, 12, 15, 20. Filtrá mayores a 10 y sumales 5 a todos juntos.
> Respuesta esperada: filtrados 12, 15, 20; más 5 dan 17, 20, 25.

2. 🧪 Mezcla 2+5 — Tenés 6 datos en fila. Pasalos a 2 filas de 3 y sacá promedio de cada fila.
> Respuesta esperada: dos filas de 3; cada promedio resume su fila en 1 número.

3. 🧪 Mezcla 3+4 — Tenés tabla más un número extra. Explicá cuándo se puede estirar y qué colador usarías para quedarte con los grandes.
> Respuesta esperada: se puede si el chico se repite limpio; colador mayor a un umbral deja pasar grandes.

## 📖 Glosario (exceptuado y declarado: se permite partir en bloques ≤4)

*Continúa la tabla (1/2) — partida en bloques de ≤4 para no saturar.*

| 🎯 Término | 💡 Definición |
|---|---|
| Recuperación | Evocar sin mirar; fortalece memoria más que releer |
| Espaciado | Repartir repasos en el tiempo en vez de amontonar |
| Interleaving | Mezclar temas en la práctica en vez de bloquearlos |
| Elaboración | Preguntarse por qué algo funciona y cuándo falla |

*Continúa la tabla (2/2) — partida en bloques de ≤4 para no saturar.*

| 🎯 Término | 💡 Definición |
|---|---|
| Vectorización | Operar todo junto en vez de uno por uno |
| Eje | Dirección donde resumís: filas o columnas |
| Máscara | Condición que deja pasar solo lo útil |
| Forma | Tamaño por dirección: filas por columnas |

## ✅ Cierre: tu siguiente paso IA

📌 Cerraste el círculo: de cubitera a resumen por ejes, ya pensás en tablas.

✅ Checklist final: [ ] Opero sin bucles [ ] Reordeno sin perder datos [ ] Filtro sin romper [ ] Resumo por eje.

🎁 Próxima recompensa visible: con esta base podés entrar a promedios por lotes, imágenes como tablas y tu primera red simple sin miedo.
