---
title: "Arquitectura de Software Profesional: Atributos, Patrones, Tácticas y Documentación"
description: "Guía paso a paso de arquitectura de software: atributos de calidad y trade-offs, patrones MVC, capas, microservicios, CQRS y hexagonal, conectores, ADD, tácticas de disponibilidad y seguridad, ATAM y documentación sostenible."
pubDate: "2026-10-06"
code: "arquitectura-software"
language: "es"
category: "arquitectura"
tags: ["arquitectura", "patrones", "microservicios", "ddd", "atam", "software"]
type: "guia"
level: "intermedio"
difficulty: "intermedio"
readingTime: 16
---

# 🏛️ Arquitectura de Software Profesional: Decide, Estructura, Valida y Documenta

Cuatro PARTES usables: mides calidad, eliges patrón, aplicas tácticas y dejas todo documentado.

## 🗺️ Mapa de 3 FASES

FASE 1 → Mides calidad (PARTE 1) → FASE 2 → Estructuras (PARTES 2 y 3) → FASE 3 → Perdurás (PARTE 4).

👀 Cómo leerlo: 3 fases de izquierda a derecha, de fácil a difícil.

### 📚 Pre-training: 7 términos antes de empezar

| Término | Significado en 1 línea |
|---------|------------------------|
| Atributo de calidad | Propiedad medible: rendimiento, seguridad, etc. |
| Trade-off | Mejorar algo empeorando otra cosa |
| Patrón | Solución probada a un problema repetido |
| Táctica | Decisión pequeña que logra 1 atributo |

*Continúa la tabla (2/2) — partida en bloques de ≤4 para no saturar.*

| Término | Significado en 1 línea |
|---------|------------------------|
| Conector | Cómo se hablan 2 partes: cola, llamada, evento |
| ADD | Diseño guiado por atributos, paso a paso |
| ATAM | Método para evaluar una arquitectura |

👀 Cómo leer las tablas: izquierda el nombre, derecha la idea corta.

## 🎯 PARTE 1: Mide la Calidad Antes de Codificar (Nivel 1/5)

1. ❓ PRETEST — Tu app tarda 8 segundos en responder y pierde ventas. ¿Qué atributo de calidad falla y cómo lo medirías? (Activa previas | Media)
> Respuesta esperada: eficiencia de ejecución; se mide con latencia p95 y throughput bajo carga.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Sin atributos medibles, toda decisión es gusto personal. Vas a lograr priorizar 3 atributos de tu proyecto y definir 1 métrica por cada uno. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Escribí tu sistema y 3 números objetivo: latencia menor a 500 ms, 99.9 por ciento de uptime, despliegue en 10 min. Ya tienes criterios. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: los atributos son el tablero del auto, sin velocímetro manejas a ciegas. Definición: un atributo de calidad es una propiedad exigible y medible del sistema, distinta de la función que cumple. Analogía de idoneidad funcional: que el auto arranque, lo mínimo esperado. Analogía de trade-off: una frazada corta, si tapas rendimiento destapas modificabilidad. Analogía de contexto de negocio: en startup priorizas velocidad de entrega, en gran escala priorizas confiabilidad. (Pre-training + señalización | Media)

| Atributo | Cómo se mide |
|----------|--------------|
| Eficiencia | Latencia p95 y peticiones por segundo |
| Confiabilidad | Uptime y tasa de fallos por mes |
| Seguridad | 5 pilares: confidencialidad e integridad más 3 |
| Mantenibilidad | Tiempo medio de cambio sin romper nada |

👀 Cómo leer la tabla: izquierda el atributo, derecha su métrica concreta. Más: usabilidad tiene 6 dimensiones y se mide con tests de tarea; adaptabilidad e instalación se miden en minutos de despliegue y reemplazo. Por qué funciona: lo medible se puede priorizar y discutir sin opiniones. Cuándo falla: si pides los 9 atributos al máximo, ningún diseño los cumple todos. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: tienda que pasa de 100 a 10 mil pedidos. I Do: priorizo eficiencia y confiabilidad sobre usabilidad fina. We Do: ¿qué métrica pones a pagos? → latencia p95 menor a 300 ms. You Do: punto 7. Visual: Negocio → 3 atributos → 1 métrica cada uno. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Pedir todo alto a la vez y medir con "se siente rápido". → Corrección: elige 3 atributos ganadores por fase y 1 número por cada uno. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Para tu proyecto real o ficticio: lista 3 atributos ganadores y 1 métrica con número para cada uno.
> Respuesta esperada: 3 atributos con métrica numérica. Ejemplo: eficiencia, p95 menor a 400 ms. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué es un atributo de calidad y qué es un trade-off? (Nivel Bloom: recordar) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Arquitectura es elegir qué 3 atributos ganan y con qué número se prueba.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Listé 3 atributos [ ] Puse 1 número a cada uno [ ] Acepté 1 trade-off. Siguiente: elegir el patrón que los sostiene. (Metacognición | Media)

## 🧩 PARTE 2: Elige el Patrón Correcto (Nivel 2/5)

1. ❓ PRETEST — Equipo de 4 con app simple de catálogo. ¿Microservicios o monolito en capas? (Activa previas | Media)
> Respuesta esperada: monolito en capas; microservicios sobran sin escala ni equipos múltiples.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — El patrón equivocado multiplica el costo por años. Vas a lograr ubicar tu sistema en 1 patrón y justificarlo con tus atributos de la PARTE 1. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Dibuja tu app en 3 cajas: Controller recibe, Service decide, Repository guarda. Ya separaste responsabilidades. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: un patrón es el plano de una casa, no sus ladrillos. Definición: estructura repetible que asigna responsabilidades y reglas de comunicación. Analogía de MVC: mostrador, cocina y despensa de un restaurante. Analogía de microkernel: enchufe con plugins, núcleo chico y extras conectados. Analogía de hexagonal: castillo con puentes levadizos, el centro no sabe qué hay fuera. Analogía de contexto delimitado: cada equipo con su dialecto y su mapa propio. (Pre-training + señalización | Media)

| Patrón | Cuándo conviene |
|--------|-----------------|
| Capas y MVC | Equipos chicos, reglas claras |
| Microkernel | Producto con plugins de terceros |
| Microservicios | Equipos múltiples y despliegue aparte |
| CQRS y eventos | Lecturas masivas o auditoría total |

👀 Cómo leer la tabla: izquierda el patrón, derecha su escenario ideal. Más: Share-Nothing escala sumando nodos que no se estorban, como MapReduce; DDD pide evolucionar del monolito a servicios por contextos, nunca al revés. Por qué funciona: el patrón encapsula decisiones que ya funcionaron en otros. Cuándo falla: si aplicas microservicios por moda con 1 equipo y sin red separada. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: red social con lecturas masivas tipo Twitter. I Do: elijo CQRS, lectura separada de escritura, más difusión por eventos. We Do: ¿dónde va el historial auditable? → Event Sourcing guarda eventos, no solo estado. You Do: punto 7. Visual: Atributos → Patrón → Regla de comunicación. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Microservicios con base compartida y llamadas en cadena síncronas. → Corrección: eso es un monolito distribuido; separa datos por contexto o vuelve a capas. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Para otro sistema distinto al ejemplo: elige 1 patrón, nómbralo y justifícalo con 1 atributo y métrica de la PARTE 1.
> Respuesta esperada: patrón + atributo + métrica coherentes. Ejemplo: capas porque el equipo es de 3 y el despliegue debe tardar 10 min. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué patrón conviene a equipo chico y cuál a lecturas masivas? (Nivel Bloom: comprender) (Recuperación | Alta)

9. 📌 IDEA CLAVE — El patrón correcto es el más simple que cumple tus 3 atributos ganadores.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Elegí 1 patrón [ ] Lo justifiqué con métrica [ ] Sé cuándo no usarlo. Siguiente: tácticas y validación fina. (Metacognición | Media)

## 🛡️ PARTE 3: Aplica Tácticas y Valida (Nivel 4/5)

1. ❓ PRETEST — Un servicio cae cada noche y nadie se entera hasta el cliente. ¿Qué táctica de disponibilidad falta? (Activa previas | Media)
> Respuesta esperada: detección, como heartbeat o ping con alerta automática.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — El patrón dibuja la casa, las tácticas evitan que se caiga. Vas a lograr asignar 1 táctica por atributo crítico y validar con 1 escenario ATAM. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Agrega 1 chequeo de salud a tu servicio y 1 reintento con tope. Ya aplicaste detección y recuperación. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: las tácticas son los extintores del edificio, chicos y ubicados donde arde. Definición: decisión puntual que mejora 1 atributo sin cambiar el patrón. Analogía de ADD: receta que diseña por rondas, cada ronda ataca 1 atributo. Analogía de conector asíncrono: dejar carta en buzón en vez de llamar y esperar. Analogía de ATAM: peritaje del plano antes de construir, con escenarios de ataque. (Pre-training + señalización | Media)

| Atributo | Táctica concreta |
|----------|------------------|
| Disponibilidad | Heartbeat, reintento con tope, réplica |
| Modificabilidad | Interfaces y capas que confinan el cambio |
| Rendimiento | Cola, caché y limitar concurrencia |
| Seguridad | Detectar, resistir y recuperarse del ataque |

👀 Cómo leer la tabla: izquierda el atributo, derecha tácticas aplicables hoy. Más: testabilidad se gana con módulos testeables por separado; conectores síncronos para respuesta inmediata, Pub/Sub y colas para picos como el timeline de Twitter. Por qué funciona: cada táctica ataca 1 riesgo medible. Cuándo falla: si agregas caché y réplicas sin medir antes, escondes el problema real. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: pagos que no pueden caerse. I Do: traduzco negocio a decisión, 99.95 por ciento uptime exige réplica + cola + idempotencia. We Do: ¿síncrono o cola para el cargo? → cola, el pico no debe tumbar el cobro. You Do: punto 7. Visual: Requisito → Táctica → Escenario ATAM. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Reintentos infinitos que amplifican la caída y tácticas sin escenario que las pruebe. → Corrección: reintento con tope y backoff, más 1 escenario ATAM que diga estímulo y respuesta medida. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Para tu sistema: elige 1 requisito, asigna 1 táctica de la tabla y escribe su escenario ATAM con número.
> Respuesta esperada: requisito + táctica + escenario medible. Ejemplo: pico de 10x tráfico, cola mediante, p95 menor a 500 ms. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿1 táctica de disponibilidad y 1 de modificabilidad, y qué valida ATAM? (Nivel Bloom: analizar) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Cada atributo crítico se gana con 1 táctica concreta y 1 escenario que la pruebe.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Asigné 1 táctica [ ] Escribí 1 escenario ATAM [ ] Elegí conector con criterio. Siguiente: que todo perdure en documentos. (Metacognición | Media)

## 📚 PARTE 4: Documenta lo que Perdura (Nivel 5/5)

1. ❓ PRETEST — Seis meses después nadie sabe por qué el pago usa cola. ¿Qué documento faltó? (Activa previas | Media)
> Respuesta esperada: la decisión registrada con contexto, alternativas y consecuencias.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — La arquitectura no documentada se erosiona en meses. Vas a lograr registrar 1 decisión y 1 regla de sincronía con el código. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Escribí en 5 líneas por qué elegiste tu patrón de la PARTE 2. Ya tienes tu primera decisión viva. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: documentar es dejar el manual del edificio, no solo fotos de la fachada. Definición: documentación sostenible explica decisiones y consecuencias, no repite el código. Analogía de erosión: el plano viejo que ya no coincide con la obra. Analogía de sincronización: espejo entre código y documento que se revisa en cada cambio grande. (Pre-training + señalización | Media)

| Práctica | Cómo se hace |
|----------|--------------|
| Decisión registrada | Contexto, opciones y consecuencia |
| Vista mínima | 1 diagrama de 4 cajas máximo |
| Revisión ligada | Se actualiza con cada cambio grande |
| Atributo visible | Cada decisión cita su métrica |

👀 Cómo leer la tabla: izquierda la práctica, derecha su forma concreta. Por qué funciona: decidir por escrito frena la erosión silenciosa. Cuándo falla: si documentas todo el código, nadie lo lee ni lo actualiza. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: pagos con cola de la PARTE 3. I Do: registro contexto de picos, opción cola vs síncrono y consecuencia de latencia extra. We Do: ¿qué vista dibujas? → 4 cajas: app, cola, worker y base. You Do: punto 7. Visual: Decisión → Vista de 4 cajas → Revisión por cambio. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Wiki de 50 páginas desactualizada que contradice el código. → Corrección: 1 página viva por decisión importante, con dueño y fecha de revisión. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA MIXTA — Mezcla las 4 PARTES: toma tu sistema, lista 1 atributo con métrica, 1 patrón, 1 táctica con escenario y 1 decisión documentada en 5 líneas.
> Respuesta esperada: los 4 elementos coherentes entre sí. Ejemplo: eficiencia p95 menor a 500 ms, CQRS, caché mediante, decisión registrada. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: explicá atributo, patrón, táctica y ATAM con 1 ejemplo de cada uno. (Nivel Bloom: evaluar) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Lo que no queda escrito con su porqué se pierde en el primer cambio de equipo.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Registré 1 decisión [ ] Dibujé vista de 4 cajas [ ] Mezclé las 4 PARTES. Siguiente: aplica el ciclo a tu proyecto real esta semana. (Metacognición | Media)
