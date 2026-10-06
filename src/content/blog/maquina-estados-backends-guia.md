---
title: "Máquinas de Estado en Backends: Para Qué Sirven y Cómo Pensarlas"
description: "Guía paso a paso de state machines en backend: estados, eventos y transiciones, para qué sirven en pedidos, pagos y envíos, modelo mental de tabla estado por evento, transiciones atómicas e idempotencia."
pubDate: "2026-10-06"
code: "maquina-estados-backend"
language: "es"
category: "arquitectura"
tags: ["backend", "state-machine", "estados", "diseño", "concurrencia"]
type: "guia"
level: "intermedio"
difficulty: "intermedio"
readingTime: 14
---

# ⚙️ Máquinas de Estado en Backends: Para Qué Sirven y Cómo Pensarlas

Tres FASES usables: entiendes qué son, adoptas el modelo mental y las llevas a producción sin romper nada.

## 🗺️ Mapa de 3 FASES

FASE 1 → Entiendes (PARTE 1) → FASE 2 → Piensas en tabla (PARTE 2) → FASE 3 → Produces seguro (PARTE 3).

👀 Cómo leerlo: 3 fases de izquierda a derecha, de fácil a difícil.

### 📚 Pre-training: 7 términos antes de empezar

| Término | Significado en 1 línea |
|---------|------------------------|
| Estado | Situación actual de algo: pagado, enviado |
| Evento | Lo que pasa: pagan, envían, cancelan |
| Transición | Cambio permitido de un estado a otro |
| Transición ilegal | Salto prohibido: entregar sin pagar |

*Continúa la tabla (2/2) — partida en bloques de ≤4 para no saturar.*

| Término | Significado en 1 línea |
|---------|------------------------|
| Idempotencia | Repetir sin duplicar efectos |
| Atomicidad | Todo cambia junto o nada cambia |
| Condición de carrera | 2 procesos chocan por lo mismo |

👀 Cómo leer las tablas: izquierda el nombre, derecha la idea corta.

## 📦 PARTE 1: Qué Son y Para Qué Sirven (Nivel 1/5)

1. ❓ PRETEST — Un pedido pasa de pendiente a entregado sin pagar. ¿Qué faltó en tu backend? (Activa previas | Media)
> Respuesta esperada: una máquina de estados que prohíba ese salto ilegal.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Sin estados explícitos, los ifs dejan pasar imposibles. Vas a lograr dibujar los 4 estados de un pedido con sus transiciones. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Escribe en papel: pendiente, pagado, enviado y entregado, con 1 flecha entre cada uno. Ya tienes tu primera máquina. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: la máquina es el semáforo del pedido, solo deja pasar en verde y en orden. Definición: conjunto cerrado de estados más eventos que mueven de uno a otro por caminos permitidos. Sirve en pedidos, pagos, envíos, tickets y suscripciones, todo lo que nace, avanza y termina. Analogía del estado: la casilla del tablero donde está tu ficha ahora. (Pre-training + señalización | Media)

| Estado del pedido | Cómo se llega |
|-------------------|---------------|
| Pendiente | Se crea al comprar |
| Pagado | Llega el evento pagan |
| Enviado | Llega el evento envían |
| Entregado | Llega el evento entregan |

👀 Cómo leer la tabla: izquierda dónde está, derecha qué evento lo llevó. Ejemplo numérico: de 10 mil pedidos, 200 intentan saltos ilegales al mes y la máquina frena los 200. Por qué funciona: lo imposible se vuelve literalmente irrepresentable. Cuándo falla: si agregas estados genéricos tipo procesando que significan todo y nada. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: pago duplicado por doble clic. I Do: el evento pagan llega 2 veces en estado pagado y la segunda se ignora. We Do: ¿puede ir de pendiente a enviado? → no, falta el evento pagan. You Do: punto 7. Visual: Pendiente → Pagado → Enviado → Entregado. 👀 Cómo leerlo: 4 pasos de izquierda a derecha, sin saltos. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Tres booleanos sueltos tipo pagado, enviado y cancelado que permiten las 8 combinaciones, incluidas 5 absurdas. → Corrección: 1 solo campo estado con 4 valores posibles, nunca 3 banderas. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Dibuja otra máquina distinta: ticket de soporte con 3 estados y sus eventos.
> Respuesta esperada: 3 estados con 1 evento por flecha. Ejemplo: abierto, en curso y cerrado. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué son estado, evento y transición ilegal? (Nivel Bloom: recordar) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Un campo estado con caminos permitidos frena todos los imposibles.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Dibujé 4 estados [ ] Nombré 3 eventos [ ] Detecté 1 salto ilegal. Siguiente: el modelo mental de tabla. (Metacognición | Media)

## 🧠 PARTE 2: Piensa en Tabla, No en Ifs (Nivel 3/5)

1. ❓ PRETEST — Tienes 6 estados y lógica regada en 10 archivos. ¿Dónde miras para saber qué puede pasar? (Activa previas | Media)
> Respuesta esperada: en ningún lado, por eso necesitas 1 tabla central estado por evento.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Los ifs esconden reglas, la tabla las muestra. Vas a lograr escribir tu tabla estado por evento con destino o rechazo. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Toma 1 estado tuyo y lista qué eventos acepta y cuáles rechaza. Ya pensaste en tabla. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: la tabla es el reglamento del torneo pegado en la pared, todos juegan lo mismo. Definición: modelo mental de filas estado, columnas evento y celdas con destino permitido o rechazo explícito. Analogía del if regado: policías distintos con criterios distintos en cada esquina. (Pre-training + señalización | Media)

| Si está en | Y llega | Entonces va a |
|------------|---------|---------------|
| Pendiente | pagan | Pagado |
| Pendiente | envían | Rechazo, falta pago |
| Pagado | envían | Enviado |
| Enviado | cancelan | Rechazo, ya salió |

👀 Cómo leer la tabla: estado más evento definen destino o rechazo. Por qué funciona: agregar un estado es agregar 1 fila visible, no cazar ifs. Cuándo falla: si la tabla vive en un documento y el código hace otra cosa. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: piden cancelar un enviado. I Do: miro la fila enviado con evento cancelan y la celda dice rechazo. We Do: ¿y si está pagado? → la tabla permite cancelan hacia cancelado. You Do: punto 7. Visual: Estado actual → Busca evento → Aplica celda. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Permitir todo por defecto y bloquear casos sueltos cuando explotan. → Corrección: por defecto todo evento se rechaza, solo la tabla abre caminos. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Escribe la tabla de tu ticket de la PARTE 1: 3 estados por 2 eventos con destino o rechazo.
> Respuesta esperada: tabla completa sin celdas vacías ni supuestos. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué filas y columnas tiene la tabla y qué pasa por defecto? (Nivel Bloom: comprender) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Si no está en la tabla, no pasa en el sistema.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Escribí mi tabla [ ] Todo rechazo es explícito [ ] Nada vive solo en ifs. Siguiente: producción con concurrencia real. (Metacognición | Media)

## 🛡️ PARTE 3: Producción Sin Dobles ni Chokes (Nivel 5/5)

1. ❓ PRETEST — Dos cobros llegan al mismo milisegundo por el mismo pedido pendiente. ¿Cuántos pagan? (Activa previas | Media)
> Respuesta esperada: uno solo, la transición atómica con condición deja pasar al primero.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — En producción los eventos llegan dobles y juntos. Vas a lograr definir transición atómica con condición e idempotencia por evento. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Agrega a tu tabla 1 columna de condición: solo si sigue en el estado esperado. Ya blindaste la mitad. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: la atomicidad es el trueque con apretón, o se cambian las 2 cosas o ninguna. Definición: la transición lee estado, valida tabla y escribe destino en 1 paso indivisible con condición de estado esperado. Analogía de idempotencia: el timbre que suena igual lo toques 1 o 5 veces. Analogía de carrera: 2 personas por la última silla, la condición decide 1 ganadora. (Pre-training + señalización | Media)

| Riesgo real | Blindaje concreto |
|-------------|-------------------|
| Evento doble | Clave única por evento, el 2do se ignora |
| Choke simultáneo | Condición de estado esperado al escribir |
| Caída a medias | Todo junto o nada, nunca medio |
| Auditoría | Cada cambio guarda quién y cuándo |

👀 Cómo leer la tabla: izquierda el riesgo, derecha su blindaje. Ejemplo numérico: 500 pagos dobles al mes por reintentos, con clave única los 500 cuestan cero cargos extra. Por qué funciona: la base decide con datos, no con suerte de tiempos. Cuándo falla: si confías en verificar-then-escribir en 2 pasos separados. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: reintento del banco más clic del usuario. I Do: ambos traen la misma clave, el primero mueve a pagado y el segundo se reconoce repetido. We Do: ¿y si llega envían a la vez? → su condición exige pagado y pierde limpio. You Do: punto 7. Visual: Evento con clave → Valida tabla → Escribe con condición. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Leer estado, esperar y escribir después, con doble cobro en el hueco. → Corrección: condición de estado en la misma escritura, el hueco desaparece. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA MIXTA — Mezcla las 3 PARTES: toma tu ticket, agrega 1 evento doble y define clave única más condición para su transición clave.
> Respuesta esperada: evento con clave + condición explícita + rechazo del duplicado. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: explicá estado, tabla, atomicidad e idempotencia con 1 ejemplo cada uno. (Nivel Bloom: aplicar) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Tabla visible más escritura condicionada igual a cero imposibles en producción.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Puse clave a eventos [ ] Condicioné escrituras [ ] Registro cada cambio. Siguiente: aplica la tabla a tu entidad más rota esta semana. (Metacognición | Media)
