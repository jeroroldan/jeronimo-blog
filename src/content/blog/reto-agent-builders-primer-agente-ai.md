---
title: "Reto Agent Builders: Crea tu Primer Agente AI en 3 Pasos"
description: "Guía del reto: define un agente útil, dale 1 herramienta con memoria, evalúalo y publícalo sin trabarte con frameworks."
code: "reto-agent-builders-primer-agente"
category: "ia"
tags: ["agentes", "reto", "ai-engineering", "evals"]
type: "guia"
level: "fundamento"
difficulty: "fundamento"
readingTime: 12
pubDate: "2026-10-15"
---

# 🤖 Reto Agent Builders: Tu Primer Agente AI

Un agente no es un chat que responde. Es un ayudante que percibe, decide y actúa con herramientas. En este reto construyes uno pequeño que sí termina una tarea.

## 🗺️ Mapa de 3 FASES

👀 Cómo leerlo: seguí las flechas de arriba hacia abajo, una fase por PARTE.

Definir → Equipar → Probar

1. 🎯 FASE 1 Defines una misión tiny que se pueda verificar
2. 🛠️ FASE 2 Equipas con 1 herramienta y memoria corta
3. 🧪 FASE 3 Pruebas con evals y lo publicas

📌 Si no se puede verificar en 1 minuto, no es misión de agente.

## 📚 Pre-training: 7 términos antes de empezar

| Término | Analogía de 1 línea |
|---------|---------------------|
| Agente | Como cadete con celular: recibe pedido y lo resuelve solo |
| Misión | Como ticket de soporte: tiene inicio y fin claros |
| Herramienta | Como manos del cadete: busca, calcula, reserva |
| Memoria | Como libreta del cadete: anota lo importante |

*Continúa la tabla (2/2).*

| Término | Analogía de 1 línea |
|---------|---------------------|
| Traza | Como ticket con historial: qué hizo paso a paso |
| Eval | Como prueba de manejo: pasa o falla con criterio |
| Guardrail | Como casco del cadete: evita el golpe caro |

✅ Ya tienes el vocabulario. Ahora al reto.

---

## 🎯 PARTE 1: Define una Misión Tiny (Nivel 1/5)

1. ❓ PRETEST — ¿Qué misión sirve para un primer agente: responde de todo o reserva una sala libre mañana a las 10?
> Respuesta esperada: la segunda, porque tiene éxito verificable.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque misión vaga da agente vago. Vas a lograr una misión de 1 frase verificable en 1 minuto. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Escribí tu misión así: verbo + objeto + límite. Ejemplo: resume 3 quejas en 5 balas sin inventar datos. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: la misión es como el ticket pegado en la frente del cadete. Definición: misión tiny es 1 tarea con entrada, salida y criterio de listo. (Pre-training + señalización | Media)

| Parte | Pregunta | Ejemplo |
|-------|----------|---------|
| Entrada | ¿Qué recibe? | 3 quejas |
| Salida | ¿Qué entrega? | 5 balas |
| Listo | ¿Cómo sé? | cita cada queja |

5. 👀 EJEMPLO RESUELTO — Caso: agente que agenda salas. Pasos: 1 Recibe día y hora → 2 Busca salas libres → 3 Reserva y confirma. 👀 Cómo leerlo: izquierda a derecha, del pedido a la confirmación. (Worked example | Alta)

Pedir → Buscar → Confirmar

¿Por qué funciona? Pocos pasos = pocos fallos. Falla cuando pides agenda todo mi mes sin criterio.

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Misión hazme marketing → Corrección: recorta a propone 3 títulos con precio menor a 50. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Escribe tu misión del reto con contexto distinto al ejemplo: un agente de gastos que revisa 2 tickets.
> Respuesta esperada / criterio: verbo + objeto + número + límite. Si no se verifica en 1 minuto, achica. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué 3 partes tiene una misión tiny? (Nivel Bloom: recordar) (Recuperación | Alta)
> Respuesta esperada: entrada, salida y criterio de listo.

9. 📌 IDEA CLAVE — Misión chica y verificable gana al agente gigante. (Heurística Feynman | Heurística)

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Mi misión cabe en 1 frase [ ] Sé cómo verificarla [ ] Tiene límite claro. Siguiente: 🛠️ equiparla con 1 herramienta en la PARTE 2. (Metacognición | Media)

---

## 🛠️ PARTE 2: Dale 1 Herramienta y Memoria (Nivel 3/5)

1. ❓ PRETEST — Tu agente inventa precios. ¿Qué le falta: más charla o 1 herramienta de búsqueda?
> Respuesta esperada: 1 herramienta de búsqueda con permiso acotado.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque sin herramienta el agente solo adivina. Vas a lograr un agente de 3 pasos con memoria corta. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Dibuja tu herramienta en 1 línea: nombre + cuándo se usa. Ejemplo: buscar-sala solo para ver disponibilidad. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: la herramienta son las manos, la memoria es la libreta del cadete. Definición: equipar es dar 1 acción permitida más nota corta de lo ya hecho. (Pre-training + señalización | Media)

| Pieza | Regla | Ejemplo |
|-------|-------|---------|
| Herramienta | 1 uso claro | buscar-sala |
| Permiso | Solo lo necesario | solo leer |
| Memoria | 3 líneas máx | día, hora, sala |

5. 👀 EJEMPLO RESUELTO — Caso: agente de gastos con 2 tickets. Pasos: 1 Lee tickets → 2 Usa leer-total para cada uno → 3 Suma y reporta con memoria. 👀 Cómo leerlo: de arriba abajo, del papel al reporte. (Worked example | Alta)

Leer → Usar → Reportar

¿Por qué funciona? Memoria corta evita repetir la misión de la PARTE 1. Falla cuando das 5 herramientas con acceso total.

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Darle borrar y enviar sin freno → Corrección: empieza con solo leer y agrega escribir después. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Toma tu misión de la PARTE 1 y agrega 1 herramienta + qué guarda en memoria.
> Respuesta esperada / criterio: herramienta con 1 verbo + memoria de 3 datos. Si la herramienta sirve para todo, acota el permiso. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿por qué 1 herramienta con permiso chico es mejor que 5 abiertas? (Nivel Bloom: comprender) (Recuperación | Alta)
> Respuesta esperada: menos acciones posibles, menos errores caros y traza más clara.

9. 📌 IDEA CLAVE — Una mano bien atada vale más que diez sueltas. (Heurística Feynman | Heurística)

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Tengo 1 herramienta nombrada [ ] Permiso mínimo [ ] Memoria de 3 líneas. Siguiente: 🧪 probarlo con evals en la PARTE 3. (Metacognición | Media)

---

## 🧪 PARTE 3: Evalúa y Publica (Nivel 5/5)

1. ❓ PRETEST — Tu agente acertó 9 de 10 veces. ¿Lo publicas sin más?
> Respuesta esperada: no, revisas la traza del fallo y creas un eval que lo atrape.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque publicar sin eval es lotería. Vas a lograr 1 eval pasa/falla más demo pública del reto. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Corre tu agente 3 veces con la misma misión y anota 3 resultados: pasó o falló. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: el eval es como el examen de manejo del cadete. Definición: eval es 1 chequeo binario sobre la traza más 1 guardrail antes de la acción cara. (Pre-training + señalización | Media)

| Chequeo | Pregunta sí/no | Freno |
|---------|----------------|-------|
| Citó fuente | ¿Usó herramienta? | reintentar |
| Formato | ¿5 balas? | recortar |
| Acción cara | ¿Reservó bien? | pedir ok humano |

5. 👀 EJEMPLO RESUELTO — Caso: agente reserva sala equivocada 1 vez. Pasos: 1 Lees traza → 2 Creas eval sala-libre sí/no → 3 Pides ok antes de reservar. 👀 Cómo leerlo: izquierda a derecha, del fallo al freno. (Worked example | Alta)

Fallar → Medir → Frenar

¿Por qué funciona? La traza de la PARTE 2 muestra dónde falló la misión de la PARTE 1. Falla cuando evalúas de memoria sin guardar trazas.

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Publicar por emoción tras 1 acierto → Corrección: exige 5 corridas seguidas pasando tu eval. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Práctica mixta: resume tu reto completo en 4 líneas: misión + herramienta + eval + guardrail.
> Respuesta esperada / criterio: incluye criterio de la PARTE 1, permiso de la PARTE 2 y freno humano. Si falta métrica, incompleto. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué revisas primero cuando falla y qué agregas después? (Nivel Bloom: evaluar) (Recuperación | Alta)
> Respuesta esperada: primero la traza paso a paso, después 1 eval y 1 guardrail.

9. 📌 IDEA CLAVE — Agente publicado es agente medido con freno. (Heurística Feynman | Heurística)

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Tengo 5 corridas con eval [ ] Tengo 1 guardrail [ ] Publiqué demo y traza. Siguiente: 🎯 repite el reto con misión vecina. (Metacognición | Media)
