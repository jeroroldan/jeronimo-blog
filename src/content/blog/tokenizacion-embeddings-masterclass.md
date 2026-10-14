---
title: "Tokenización y Embeddings: De Texto a Vectores que la IA Entiende"
description: "Masterclass sin código: cómo el texto se corta en tokens, se vuelve número y termina como vector con significado."
pubDate: "2026-10-14"
code: "tokenizacion-embeddings"
language: "es"
category: "ia"
tags: ["tokens", "embeddings", "pln", "ia", "fundamentos"]
type: "masterclass"
level: "fundamento"
difficulty: "fundamento"
readingTime: 25
prerequisites: ["aritmetica-vectorial-coseno"]
---

# ✂️ Tokenización y Embeddings: El Viaje del Texto al Vector

> 🗺️ Todo modelo de lenguaje hace 2 pasos antes de pensar: corta el texto en piezas y convierte cada pieza en vector. Acá los ves por dentro.

## 🗺️ Mapa de 3 FASES (Niveles 1→5)

*👀 Cómo leerlo: seguí las flechas de arriba hacia abajo. Son 3 fases y 5 niveles en orden fácil → difícil.*

🗺️ FASE 1 · Cortar → ✂️ PARTE 1 Tokenizar + 🔢 PARTE 2 El Token ID en bruto
→ 🗺️ FASE 2 · Convertir → 🧬 PARTE 3 Embeddings con sentido + 📍 PARTE 4 Vecinos que se juntan
→ 🗺️ FASE 3 · Criterio → 🧠 PARTE 5 Límites y trampas del viaje

🎯 Logro final: vas a seguir el viaje completo de una frase hasta sus vectores y explicar cada paso sin dudar.

## 📚 Pre-entrenamiento: 8 palabras antes de empezar

*👀 Cómo leerla: primera columna es la palabra nueva, segunda es la idea en simple. Son 8 ideas en 2 bloques para no saturar.*

| 🎯 Término | 💡 Idea en 1 línea |
|---|---|
| token | trozo de texto en que se corta una frase |
| tokenizar | cortar el texto en sus piezas mínimas |
| token ID | número entero que identifica a cada trozo |
| vocabulario | lista de todos los trozos que el modelo conoce |

*Continúa la tabla (2/2) — partida en bloques de ≤4 para no saturar.*

| 🎯 Término | 💡 Idea en 1 línea |
|---|---|
| embedding | vector con significado que sale de una red |
| dimensión | cuántos números trae cada vector |
| red pre-entrenada | red que ya aprendió de millones de textos |
| cercanía | qué tan juntos quedan dos vectores vecinos |

> ✅ Ya tenés el vocabulario. Si estas 8 ideas te suenan, la guía será fácil.

## ✂️ PARTE 1: Tokenizar, Cortar el Texto en Piezas (Nivel 1/5)

1. ❓ PRETEST — Para repartir una pizza entre amigos, ¿la entregás entera o la cortás en porciones?
> Respuesta esperada: la corto en porciones, una por persona.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque ningún modelo lee frases enteras, solo piezas. Vas a lograr cortar cualquier frase en sus tokens a ojo.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Cortá Hola cómo estás en 3 piezas: Hola, cómo, estás. 🎉 Tokenizaste tu primera frase.

4. 💡 CONCEPTO — Analogía: tokenizar es como cortar pizza en porciones. Definición: es partir el texto en piezas mínimas que el modelo sí conoce, que pueden ser palabras o partes de palabras. (Pre-training + señalización | Media)

5. 👀 EJEMPLO RESUELTO (I Do: yo te muestro) — Caso: la frase Hola cómo estás.
> Pasos: 1 Tomo el texto entero → 2 Lo parto donde el modelo corta → 3 Obtengo Hola, cómo, estás.
> Diagrama: Frase entera → Corte por piezas → 3 tokens listos.
> *👀 Cómo leerlo: de izquierda a derecha, 3 pasos que achican el problema.*
> Por qué funciona: piezas conocidas se pueden buscar y contar; frases enteras infinitas no. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO (We Do: lo corregimos juntos) — Error: creer que siempre corta por palabras, como esperar que paraguas quede entero. → A veces lo parte en para más guas. Corrección: el corte lo manda el vocabulario del modelo, no tu intuición. Cuándo falla: con palabras raras o inventadas. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA (You Do: hacés vos, contexto distinto) — Cortá mentalmente Me encanta programar en 3 piezas probables y marcá cuál partirías si fuera rara.
> Respuesta esperada / criterio: Me, encanta, programar; programar es la candidata a partirse si fuera rara. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué es tokenizar y por qué el modelo lo necesita? (Nivel Bloom: recordar)
> Respuesta esperada: partir el texto en piezas conocidas porque el modelo no lee frases enteras.

9. 📌 IDEA CLAVE — 📌 Tokenizar es cortar la pizza antes de repartirla.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Corto frases en piezas [ ] Acepto cortes por subpalabra [ ] Detecto palabras candidatas a partirse. Siguiente: 🎁 vas a numerar cada pieza en la PARTE 2.

## 🔢 PARTE 2: El Token ID, Número en Bruto (Nivel 2/5)

1. ❓ PRETEST — En un guardarropa te dan una ficha con número por tu campera. ¿La ficha es tu campera o solo sirve para encontrarla?
> Respuesta esperada: solo sirve para encontrarla, no es la campera.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque este paso se confunde con el vector final. Vas a lograr explicar por qué el Token ID todavía no significa nada.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Hola vale 1542, Cómo vale 873, estás vale 9921. 🎉 Numeraste 3 tokens sin darles sentido.

4. 💡 CONCEPTO — Analogía: token ID es como ficha de guardarropa. Definición: es el número entero que identifica a cada pieza en el vocabulario; sirve para indexar, no guarda significado. Reaparece token de PARTE 1. (Pre-training + señalización | Media)

| 👀 Dato | 💡 Qué es de verdad |
|---|---|
| 1542 para Hola | solo la ficha para ubicarla |
| 873 para Cómo | solo la ficha para ubicarla |
| 9921 para estás | solo la ficha para ubicarla |

*👀 Cómo leerla: cada fila repite la lección, el número no piensa.*

5. 👀 EJEMPLO RESUELTO (I Do) — Caso: convertir los 3 tokens de Hola cómo estás.
> Pasos: 1 Busco cada pieza en el vocabulario → 2 Copio su número → 3 Obtengo 1542, 873, 9921.
> Diagrama: Piezas con letras → Búsqueda en lista → Números en fila.
> *👀 Cómo leerlo: 3 pasos, las letras entran y salen números.*
> Por qué funciona: la red solo indexa con enteros, no con letras. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO (We Do) — Error: creer que 1542 y 1543 son palabras parecidas por ser números vecinos. → Los números se reparten por orden de lista, no por sentido. Corrección: la cercanía numérica no dice nada; el sentido llega después. Cuándo falla: siempre que leas sentido en el ID. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA (You Do, contexto distinto) — Si gato es 45 y gatos es 9012, ¿son vecinos de sentido por sus números? Justificá.
> Respuesta esperada / criterio: no, los ID no miden sentido; solo identifican piezas. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿por qué el Token ID no es el vector todavía? (Nivel Bloom: comprender) Reaparecen token y vocabulario.
> Respuesta esperada: porque es solo un entero para indexar, sin significado adentro.

9. 📌 IDEA CLAVE — 📌 El ID es la ficha, no la campera.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Convierto piezas en números [ ] No leo sentido en el ID [ ] Explico para qué sirve indexar. Siguiente: 🎁 vas a crear vectores con sentido en la PARTE 3.

## 🧬 PARTE 3: Embeddings, Donde Nace el Significado (Nivel 3/5)

1. ❓ PRETEST — Si un catador prueba uvas y anota dulzor y acidez de cada una, ¿el número de la hilera ya dice algo del sabor?
> Respuesta esperada: sí, cada número describe una cualidad del sabor.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque acá el número bruto se vuelve sentido. Vas a lograr explicar cómo un ID entra a la red y sale vector.

3. ⚡ VICTORIA RÁPIDA (<5 min) — El 1542 entra a la red y sale una lista tipo 0.21, menos 0.73, 1.12. 🎉 Viste nacer un embedding.

4. 💡 CONCEPTO — Analogía: embedding es como ficha de cata con puntajes. Definición: es el vector de muchos números que devuelve una red pre-entrenada para cada ID; cada número captura un rasgo del uso. Reaparecen token ID y red pre-entrenada. (Pre-training + señalización | Media)

5. 👀 EJEMPLO RESUELTO (I Do) — Caso: los ID 1542, 873 y 9921 entran a la red.
> Pasos: 1 Entra cada ID por su puerta → 2 La red busca lo aprendido → 3 Sale un vector largo por cada uno.
> Diagrama: ID que entran → Red que recuerda → Vectores que salen.
> *👀 Cómo leerlo: 3 pasos, adentro hay memoria de millones de textos.*
> Por qué funciona: la red aprendió durante el entrenamiento qué rasgos distinguen cada pieza. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO (We Do) — Error: pensar que el vector sale calculado con una formulita fija desde el ID. → No hay cuenta directa, hay memoria aprendida. Corrección: el vector se aprende entrenando, no se calcula a mano. Cuándo falla: cuando cambiás de modelo, cambian todos los vectores. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA (You Do, contexto distinto) — Entran los ID de sol y luna al mismo modelo. ¿Qué esperás de sus vectores y por qué?
> Respuesta esperada / criterio: vectores distintos pero con rasgos parecidos, porque comparten cielos y noches en los textos. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué diferencia hay entre un Token ID y un embedding? (Nivel Bloom: analizar) Reaparecen token, dimensión y red pre-entrenada.
> Respuesta esperada: el ID solo identifica, el embedding describe con muchos números aprendidos.

9. 📌 IDEA CLAVE — 📌 La red convierte fichas en fichas de cata.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Sigo el camino ID a vector [ ] Explico de dónde sale el sentido [ ] Sé que cada modelo tiene sus vectores. Siguiente: 🎁 vas a ver por qué los similares se juntan en la PARTE 4.

## 📍 PARTE 4: Similares Quedan Cerca (Nivel 4/5)

1. ❓ PRETEST — En una fiesta, ¿la gente con gustos parecidos termina junta por casualidad o por afinidad?
> Respuesta esperada: por afinidad, los gustos los acercan.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque esta cercanía es la que luego mide la similitud coseno. Vas a lograr predecir qué vectores quedan vecinos.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Hola y Chau hablan de saludos y quedan cerca; Hola y tractor no. 🎉 Leíste un vecindario.

4. 💡 CONCEPTO — Analogía: cercanía es como mesa de fiesta por afinidad. Definición: piezas que aparecen en contextos parecidos terminan con vectores vecinos en el espacio. Reaparecen embedding y cercanía. (Pre-training + señalización | Media)

| 👀 Pareja | 💡 Dónde quedan |
|---|---|
| Hola y Chau | vecinas, ambas saludan |
| Cómo y estás | vecinas, preguntan estado |
| Hola y tractor | lejos, mundos distintos |

*👀 Cómo leerla: cada fila es un vecindario, de la fiesta al campo.*

5. 👀 EJEMPLO RESUELTO (I Do) — Caso: ubicar los vectores de 1542, 873 y 9921.
> Pasos: 1 Miro en qué contextos vive cada uno → 2 Comparo sus rasgos → 3 Junto saludos y separo lo ajeno.
> Diagrama: Vectores sueltos → Comparo contextos → Vecindario armado.
> *👀 Cómo leerlo: 3 pasos que agrupan por vida en común.*
> Por qué funciona: la red entrena cada vector con sus vecinos de frase reales. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO (We Do) — Error: creer que cerca es sinónimo exacto. → Vecino es pariente de uso, no gemelo. Corrección: cerca habilita a comparar, no a reemplazar a ciegas. Cuándo falla: con ironía o saludos que cambian de tono. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA (You Do, contexto distinto) — Vectores de rey, reina y manzana. ¿Qué pareja queda más cerca y cuál se aísla?
> Respuesta esperada / criterio: rey y reina vecinas por realeza, manzana aislada en comida. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿por qué dos palabras de contextos parecidos quedan cerca? (Nivel Bloom: comprender) Reaparecen embedding y token.
> Respuesta esperada: porque la red les da rasgos parecidos al verlas en vidas parecidas.

9. 📌 IDEA CLAVE — 📌 El que convive en frases, convive en vectores.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Predigo vecindarios [ ] Distingo vecino de sinónimo [ ] Conecto con similitud coseno. Siguiente: 🎁 vas a conocer los límites del viaje en la PARTE 5.

## 🧠 PARTE 5: Límites y Trampas del Viaje (Nivel 5/5)

1. ❓ PRETEST — Si un diccionario no trae una palabra nueva, ¿la inventa o la arma con partes conocidas?
> Respuesta esperada: la arma con partes conocidas.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque todo modelo falla en los bordes. Vas a lograr detectar 3 trampas antes de confiar en un vector.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Pensá palabrota inventada tipo zarpullo. El modelo la parte y la arma. 🎉 Viste el plan B.

4. 💡 CONCEPTO — Analogía: vocabulario es como caja de piezas de armar. Definición: lo desconocido se arma con subpiezas conocidas; el vector resultante es aproximado y sensible al contexto y a la dimensión elegida. Reaparecen vocabulario, dimensión y embedding. (Pre-training + señalización | Media)

5. 👀 EJEMPLO RESUELTO (I Do) — Caso: la palabra inventada zarpullo entra al modelo.
> Pasos: 1 No está en la lista → 2 La parto en piezas conocidas → 3 Armo vector aproximado y desconfío.
> Diagrama: Palabra rara → Corte en conocidas → Vector con advertencia.
> *👀 Cómo leerlo: 3 pasos que terminan con cartel de cuidado.*
> Por qué funciona: las piezas conocidas aportan algo, pero el todo nuevo nunca se vio. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO (We Do) — Error: pedirle precisión de diccionario a un invento o a un doble sentido como banco. → El vector promedia sentidos y contexts. Corrección: ante rareza o doble sentido, pedí contexto y bajá la confianza. Cuándo falla: con jerga nueva y polisemia. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA (You Do, contexto distinto) — El modelo parte paraguas en para más guas y le da vector. ¿Confiás pleno o con cuidado? Justificá.
> Respuesta esperada / criterio: con cuidado, es un armado aproximado de piezas y no una palabra vista entera. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué 3 cosas limitan la calidad de un embedding? (Nivel Bloom: evaluar) Reaparecen vocabulario, dimensión y cercanía.
> Respuesta esperada: vocabulario que parte lo raro, dimensión que recorta rasgos y contextos que mezclan sentidos.

9. 📌 IDEA CLAVE — 📌 Pieza armada es pieza sospechosa: pedí contexto.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Detecto palabras partidas [ ] Ajusto confianza ante rareza [ ] Pido contexto ante doble sentido. Siguiente: 🎁 práctica mixta final para blindar el viaje.

## 🧪 Práctica mixta final (interleaving: mezcla todo)

*👀 Cómo leerla: 3 desafíos mezclan PARTES distintas. No los hagas en orden de la guía.*

1. 🧪 Mezcla 1+2 — Frase: Qué bueno verte. Cortala en piezas y explicá qué representa cada número ID.
> Respuesta esperada: 3 piezas probables; cada ID solo identifica, no significa.

2. 🧪 Mezcla 3+4 — Los ID de día y noche entran a la red y salen vectores vecinos. Explicá el viaje y el vecindario.
> Respuesta esperada: la red les da rasgos de tiempo compartido y por eso quedan cerca.

3. 🧪 Mezcla 2+5 — Un ID 45 y un ID 9012 son numéricamente lejanos pero sus vectores quedan cerca. ¿Contradicción? Justificá.
> Respuesta esperada: no, los ID no miden sentido; la cercanía la crean los embeddings.

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
| Tokenizar | Partir el texto en piezas que el modelo conoce |
| Token ID | Entero que identifica cada pieza para indexar |
| Embedding | Vector con rasgos aprendidos que describe cada pieza |
| Cercanía | Vecindad entre vectores de contextos parecidos |

## ✅ Cierre: tu siguiente paso IA

📌 Cerraste el círculo: de frase a piezas, de piezas a números y de números a vectores vecinos.

✅ Checklist final: [ ] Tokenizo a ojo [ ] No confundo ID con vector [ ] Explico de dónde sale el sentido [ ] Detecto piezas armadas.

🎁 Próxima recompensa visible: con este viaje claro podés entrar a similitud coseno, búsqueda semántica y atención de transformers sin perderte.
