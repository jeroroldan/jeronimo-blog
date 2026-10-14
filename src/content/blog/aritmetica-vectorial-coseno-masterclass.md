---
title: "Aritmética Vectorial y Similitud Coseno: La Magia de Rey menos Hombre más Mujer"
description: "Guía sin código: sumar y restar significados con vectores y medir cercanía entre palabras con similitud coseno."
pubDate: "2026-10-14"
code: "aritmetica-vectorial-coseno"
language: "es"
category: "ia"
tags: ["vectores", "embeddings", "similitud-coseno", "pln", "ia", "fundamentos"]
type: "masterclass"
level: "intermedio"
difficulty: "intermedio"
readingTime: 25
prerequisites: ["numpy-masterclass-ia-cero"]
---

# 👑 Aritmética Vectorial y Similitud Coseno: Sumar Ideas, Medir Cercanías

> 🗺️ Dos superpoderes en una guía: operar significados como cuentas y medir qué tan cerca están dos palabras. Sin fórmulas que asusten.

## 🗺️ Mapa de 3 FASES (Niveles 1→5)

*👀 Cómo leerlo: seguí las flechas de arriba hacia abajo. Son 3 fases y 5 niveles en orden fácil → difícil.*

🗺️ FASE 1 · Intuición → 🧭 PARTE 1 Palabras como flechas + ➕ PARTE 2 Sumar y restar significados
→ 🗺️ FASE 2 · Medición → 📐 PARTE 3 Ángulo contra largo + 🎯 PARTE 4 Similitud coseno paso a paso
→ 🗺️ FASE 3 · Criterio → 🧠 PARTE 5 Cuándo fiarse y cuándo dudar

🎯 Logro final: vas a predecir analogías tipo rey menos hombre más mujer y decidir con un número si dos palabras son vecinas o extrañas.

## 📚 Pre-entrenamiento: 8 palabras antes de empezar

*👀 Cómo leerla: primera columna es la palabra nueva, segunda es la idea en simple. Son 8 ideas en 2 bloques para no saturar.*

| 🎯 Término | 💡 Idea en 1 línea |
|---|---|
| vector | flecha con rumbo y largo que guarda un significado |
| dirección | hacia dónde apunta la flecha en el mapa |
| magnitud | qué tan larga es la flecha, su tamaño |
| analogía | receta tipo A es a B como C es a incógnita |

*Continúa la tabla (2/2) — partida en bloques de ≤4 para no saturar.*

| 🎯 Término | 💡 Idea en 1 línea |
|---|---|
| ángulo | qué tan abiertas están dos flechas entre sí |
| coseno | número que resume si dos rumbos se parecen |
| frecuencia | cuántas veces aparece una palabra en textos |
| umbral | línea de corte para decir sí o no |

> ✅ Ya tenés el vocabulario. Si estas 8 ideas te suenan, la guía será fácil.

## 🧭 PARTE 1: Palabras como Flechas en un Mapa (Nivel 1/5)

1. ❓ PRETEST — Si dos ciudades están en el mismo rumbo desde tu casa pero una está al doble de distancia, ¿comparten dirección?
> Respuesta esperada: sí, mismo rumbo aunque distinto largo.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque la IA guarda palabras como posiciones, no como letras. Vas a lograr leer cualquier palabra como flecha con rumbo y largo.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Imaginá gato cerca de perro y lejos de avión. 🎉 Ya ubicaste 3 palabras en un mapa mental.

4. 💡 CONCEPTO — Analogía: vector es como flecha en un mapa del tesoro. Definición: cada palabra es una flecha desde el origen; su rumbo guarda el significado y su largo suele reflejar frecuencia. (Pre-training + señalización | Media)

5. 👀 EJEMPLO RESUELTO (I Do: yo te muestro) — Caso: ubicar rey, reina y manzana.
> Pasos: 1 Pongo rey y reina juntos por realeza → 2 Alejo manzana hacia comida → 3 Leo: vecinos son parientes de sentido.
> Diagrama: Palabras sueltas → Mapa con rumbos → Vecinos con sentido.
> *👀 Cómo leerlo: de izquierda a derecha, 3 pasos que ordenan el caos.*
> Por qué funciona: palabras en contextos parecidos terminan con rumbos parecidos. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO (We Do: lo corregimos juntos) — Error: creer que cerca en el diccionario es cerca en sentido, como banco de sentarse y banco de dinero. → Misma escritura, rumbos distintos. Corrección: la cercanía la manda el uso, no la letra. Cuándo falla: con palabras de doble sentido. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA (You Do: hacés vos, contexto distinto) — Ubicá mentalmente doctor, enfermera y tractor. ¿Cuáles quedan vecinas y cuál lejos?
> Respuesta esperada / criterio: doctor y enfermera vecinas por salud, tractor lejos en campo. Logrado si el criterio es el uso. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué guardan el rumbo y el largo de una flecha-palabra? (Nivel Bloom: recordar)
> Respuesta esperada: el rumbo guarda el significado, el largo suele reflejar frecuencia.

9. 📌 IDEA CLAVE — 📌 Cada palabra es una flecha: el rumbo dice qué es.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Leo palabras como flechas [ ] Separo rumbo de largo [ ] Agrupé por uso, no por letra. Siguiente: 🎁 vas a sumar y restar significados en la PARTE 2.

## ➕ PARTE 2: Sumar y Restar Significados (Nivel 2/5)

1. ❓ PRETEST — Si a ensalada le quitás la lechuga y le sumás fideos, ¿sigue siendo ensalada o ya es otra cosa?
> Respuesta esperada: es otra cosa, quitaste una idea y sumaste otra.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque así razona la IA con analogías famosas. Vas a lograr resolver rey menos hombre más mujer con lógica de piezas.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Tomá rey, quitale lo masculino, sumale lo femenino. ¿Qué sale? Reina. 🎉 Hiciste aritmética de ideas.

4. 💡 CONCEPTO — Analogía: sumar vectores es como mezclar ingredientes, restar es como sacar uno del plato. Definición: sumar flechas combina sus rasgos; restar quita los rasgos de una a otra. Reaparece vector de PARTE 1. (Pre-training + señalización | Media)

| 👀 Operación | 💡 Qué hace con el sentido |
|---|---|
| rey menos hombre | quita lo masculino, queda realeza pura |
| más mujer | suma lo femenino a esa realeza |
| resultado | la vecina más cercana es reina |

*👀 Cómo leerla: cada fila es un paso de la receta, de arriba hacia abajo.*

5. 👀 EJEMPLO RESUELTO (I Do) — Caso: París menos Francia más Italia.
> Pasos: 1 Quito lo francés de París → 2 Sumo lo italiano → 3 La vecina más cercana es Roma.
> Diagrama: Ciudad menos país → Más país nuevo → Ciudad hermana.
> *👀 Cómo leerlo: 3 pasos, quito una pieza y pongo otra.*
> Por qué funciona: capitales y países forman direcciones paralelas en el mapa. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO (We Do) — Error: esperar que toda resta dé una palabra exacta, como mesa menos madera más metal igual a algo obvio. → A veces no hay vecina clara y sale ruido. Corrección: la cuenta propone, la cercanía decide; si no hay vecina fuerte, no hay respuesta. Cuándo falla: con objetos sin relación direccional clara. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA (You Do, contexto distinto) — Resolvé: mañana menos día más noche. ¿Qué palabra vecina esperás?
> Respuesta esperada / criterio: noche como vecina, porque quitás lo diurno y sumás lo nocturno. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué significa restar una palabra en aritmética vectorial? (Nivel Bloom: comprender) Reaparecen vector y dirección.
> Respuesta esperada: quitar sus rasgos del resultado para quedarse con lo que no comparten.

9. 📌 IDEA CLAVE — 📌 Restar quita piezas, sumar pone piezas, la vecina canta.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Armo la receta quitar-poner [ ] Predigo la vecina [ ] Sé cuándo no hay respuesta. Siguiente: 🎁 vas a separar ángulo de largo en la PARTE 3.

## 📐 PARTE 3: Ángulo contra Largo, La Trampa (Nivel 3/5)

1. ❓ PRETEST — Dos linternas apuntan al mismo punto pero una es más potente. ¿Apuntan igual aunque una alumbre más lejos?
> Respuesta esperada: sí, mismo rumbo aunque distinto alcance.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque la frecuencia agranda flechas y engaña al ojo. Vas a lograr ignorar el largo cuando el sentido es lo que cuenta.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Pensá la palabra el repetida mil veces contra quena rara. 🎉 Viste que famosa no es sinónima.

4. 💡 CONCEPTO — Analogía: ángulo es como apertura entre dos linternas, magnitud es como potencia de cada una. Definición: el ángulo dice si dos sentidos se parecen; el largo dice cuánto pesan por frecuencia. Reaparecen dirección y magnitud. (Pre-training + señalización | Media)

5. 👀 EJEMPLO RESUELTO (I Do) — Caso: gato común contra felino raro que significan casi lo mismo.
> Pasos: 1 Miro rumbos: casi idénticos → 2 Miro largos: uno gigante → 3 Decido por ángulo: son vecinos.
> Diagrama: Dos flechas desparejas → Comparo rumbos → Fallo por ángulo.
> *👀 Cómo leerlo: 3 pasos, el largo se mira pero no vota.*
> Por qué funciona: el uso compartido alinea rumbos aunque la fama infle largos. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO (We Do) — Error: medir con regla la distancia entre puntas con palabras de fama muy distinta. → La famosa queda lejos solo por larga. Corrección: si hay desbalance de frecuencia, compará rumbos y no puntas. Cuándo falla: cuando una palabra es muchísimo más común. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA (You Do, contexto distinto) — Auto y coche significan casi igual, pero auto aparece 50 veces más. ¿Cómo los comparás bien?
> Respuesta esperada / criterio: por ángulo entre rumbos, ignorando el largo por fama. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿por qué el largo engaña al comparar palabras? (Nivel Bloom: comprender) Reaparecen vector y frecuencia.
> Respuesta esperada: porque el largo crece con la frecuencia y aleja puntas de sentidos gemelos.

9. 📌 IDEA CLAVE — 📌 El rumbo dice el sentido, el largo solo cuenta fama.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Separo ángulo de largo [ ] Detecto trampa de frecuencia [ ] Fallo por rumbo. Siguiente: 🎁 vas a calcular cercanía con un número en la PARTE 4.

## 🎯 PARTE 4: Similitud Coseno, El Termómetro (Nivel 4/5)

1. ❓ PRETEST — Si dos brújulas apuntan igual, ¿qué número simple les pondrías: 1, 0 o menos 1?
> Respuesta esperada: 1, máxima coincidencia.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque la IA ordena vecinas con este número. Vas a lograr leer similitud coseno como termómetro de cercanía entre 2 palabras.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Gemelas igual a 1, vecinas cerca de 1, nada que ver cerca de 0. 🎉 Ya leés el termómetro.

4. 💡 CONCEPTO — Analogía: coseno es como termómetro de rumbos. Definición: resume el ángulo en un número; 1 es mismo rumbo, 0 es sin relación, menos 1 es opuesto. Reaparecen ángulo y dirección. (Pre-training + señalización | Media)

| 👀 Lectura | 💡 Qué significa |
|---|---|
| cerca de 1 | rumbos gemelos, vecinas fuertes |
| cerca de 0 | rumbos cruzados, sin relación |
| cerca de menos 1 | rumbos opuestos, contrarias |

*👀 Cómo leerla: de arriba hacia abajo, del abrazo al choque.*

5. 👀 EJEMPLO RESUELTO (I Do) — Caso: ordenar vecinas de reina entre rey, mujer y tractor.
> Pasos: 1 Comparo rumbos con reina → 2 Leo termómetros: mujer alto, rey medio, tractor bajo → 3 Ordeno: mujer, rey, tractor.
> Diagrama: Palabra centro → Mido 3 rumbos → Ranking de vecinas.
> *👀 Cómo leerlo: 3 pasos que terminan en podio.*
> Por qué funciona: el número ordena sin que el largo vote. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO (We Do) — Error: leer 0.6 como nota de examen aprobada siempre. → Sin umbral del caso, el número solo no decide. Corrección: definí tu línea de corte según la tarea antes de fallar. Cuándo falla: cuando comparás números de mapas distintos. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA (You Do, contexto distinto) — Termómetros contra sol: día 0.9, luna 0.4, tenedor 0.05. Ordená y decidí vecinas con umbral 0.5.
> Respuesta esperada / criterio: día vecina, luna y tenedor fuera; orden día, luna, tenedor. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué mide la similitud coseno y qué ignora? (Nivel Bloom: analizar) Reaparecen magnitud y ángulo.
> Respuesta esperada: mide parecido de rumbos e ignora el largo de las flechas.

9. 📌 IDEA CLAVE — 📌 Coseno alto es rumbo gemelo, sin importar la fama.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Leo el termómetro 1, 0, menos 1 [ ] Ordeno vecinas [ ] Uso umbral antes de fallar. Siguiente: 🎁 vas a aprender cuándo dudar en la PARTE 5.

## 🧠 PARTE 5: Cuándo Fiarse y Cuándo Dudar (Nivel 5/5)

1. ❓ PRETEST — Si un termómetro marca 0.95 pero la palabra tiene doble sentido, ¿te fiás a ciegas?
> Respuesta esperada: no, verifico el contexto antes de fallar.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque un número alto con contexto malo es trampa elegante. Vas a lograr auditar analogías y cercanías antes de usarlas.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Pensá banco que puede ser asiento o dinero. 🎉 Viste que el mapa promedia sentidos.

4. 💡 CONCEPTO — Analogía: umbral es como altura mínima para un juego. Definición: es tu línea de corte para aceptar vecinas; dudar es pedir contexto cuando hay polisemia o fama despareja. Reaparecen frecuencia, coseno y analogía. (Pre-training + señalización | Media)

5. 👀 EJEMPLO RESUELTO (I Do) — Caso: analogía rey menos hombre más mujer que da reina con 0.8 pero banco confunde.
> Pasos: 1 Reviso receta quitar-poner → 2 Reviso termómetro y contexto → 3 Fallo: acepto reina, pido contexto para banco.
> Diagrama: Cuenta + Número → Chequeo de contexto → Fallo final.
> *👀 Cómo leerlo: 3 pasos, el número propone y el contexto dispone.*
> Por qué funciona: la cuenta capta rumbos promedio, el contexto desempata sentidos. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO (We Do) — Error: usar el mismo umbral para todo, como exigir 0.9 a sinónimos raros. → Los raros nunca pasan aunque sean correctos. Corrección: umbral flexible por tarea y verificación con ejemplos conocidos. Cuándo falla: con palabras poco frecuentes o sentidos mezclados. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA (You Do, contexto distinto) — Analogía: París menos Francia más Italia da Roma con 0.75 y tu umbral es 0.8. ¿Aceptás o pedís más pruebas?
> Respuesta esperada / criterio: pido más pruebas o bajo el umbral con justificación, no acepto a ciegas. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿por qué un coseno alto no basta para fiarse? (Nivel Bloom: evaluar) Reaparecen umbral, ángulo y frecuencia.
> Respuesta esperada: porque promedia sentidos y la fama puede inflar vecinas sin contexto.

9. 📌 IDEA CLAVE — 📌 El número propone, el contexto y el umbral disponen.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Audito receta y número [ ] Ajusto umbral por tarea [ ] Pido contexto ante doble sentido. Siguiente: 🎁 práctica mixta final para blindar todo.

## 🧪 Práctica mixta final (interleaving: mezcla todo)

*👀 Cómo leerla: 3 desafíos mezclan PARTES distintas. No los hagas en orden de la guía.*

1. 🧪 Mezcla 2+4 — Resolvé Berlín menos Alemania más España y ordená candidatas con termómetros 0.85, 0.5 y 0.1.
> Respuesta esperada: Madrid primera con 0.85; la receta propone y el número ordena.

2. 🧪 Mezcla 3+4 — Auto famoso contra coche raro dan coseno 0.95. Explicá por qué el número es alto pese a la fama despareja.
> Respuesta esperada: rumbos gemelos por mismo uso; el coseno ignora el largo por fama.

3. 🧪 Mezcla 1+5 — Banco da 0.9 con dinero y 0.88 con plaza. Decidí con umbral 0.85 y explicá tu fallo.
> Respuesta esperada: ambas pasan el umbral; pido contexto porque hay doble sentido promediado.

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
| Aritmética vectorial | Sumar y restar flechas para combinar significados |
| Similitud coseno | Número que resume parecido de rumbos |
| Umbral | Línea de corte para aceptar o rechazar vecinas |
| Polisemia | Una palabra con varios sentidos mezclados |

## ✅ Cierre: tu siguiente paso IA

📌 Cerraste el círculo: de flechas a cuentas y de cuentas a termómetro con criterio.

✅ Checklist final: [ ] Resuelvo analogías quitar-poner [ ] Leo coseno como termómetro [ ] Ignoro fama al comparar [ ] Ajusto umbral y pido contexto.

🎁 Próxima recompensa visible: con esta base podés leer embeddings reales, ordenar vecinas y auditar analogías sin tragarte el número a ciegas.
