---
title: "LangChain Sin Dolor: Interfaz, Chains y Hooks en 3 Pasos"
description: "Guía práctica de LangChain: usa una sola interfaz para varios modelos, encadena pasos y agrega hooks sin enredarte."
code: "langchain-chains-hooks-guia"
category: "ia"
tags: ["langchain", "llm", "chains", "nlp", "python"]
type: "guia"
level: "fundamento"
difficulty: "fundamento"
readingTime: 12
pubDate: "2026-10-15"
---

# ⛓️ LangChain Sin Dolor: De Modelo Suelto a App Útil

LangChain es una biblioteca abierta de 2022 que pone una capa simple sobre modelos grandes como LLaMA y PaLM. Te deja cambiar de modelo sin reescribir todo.

## 🗺️ Mapa de 3 FASES

👀 Cómo leerlo: seguí las flechas de arriba hacia abajo, una fase por PARTE.

Unificar → Encadenar → Extender

1. 🔌 FASE 1 Unificas el acceso a cualquier modelo
2. ⛓️ FASE 2 Encadenas pasos donde uno alimenta al otro
3. 🪝 FASE 3 Extiendes con hooks y eliges bien

📌 Si cambias de modelo y se rompe todo, te falta capa unificada.

## 📚 Pre-training: 7 términos antes de empezar

| Término | Analogía de 1 línea |
|---------|---------------------|
| Modelo grande | Como motor de auto: potente pero sin volante propio |
| Interfaz unificada | Como control universal: un botón sirve para varias teles |
| Chain | Como línea de cocina: uno corta, otro cocina, otro sirve |
| Entrada / salida | Como bandeja de entrada y salida de una oficina |

*Continúa la tabla (2/2).*

| Término | Analogía de 1 línea |
|---------|---------------------|
| Hook | Como parada de control en la línea para revisar |
| Migración | Como cambiar de proveedor de luz sin cambiar cables |
| Clasificar | Como separar cartas por destino antes de repartir |

✅ Ya tienes el vocabulario. Ahora a armar.

---

## 🔌 PARTE 1: Una Interfaz para Todos (Nivel 1/5)

1. ❓ PRETEST — Quieres probar tu app con 2 modelos distintos. ¿Qué te ahorra trabajo?
> Respuesta esperada: una interfaz única que oculte las diferencias entre modelos.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque sin capa común cada cambio es reescribir. Vas a lograr elegir modelo por tarea con 1 criterio. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Escribe tu tarea + modelo candidato. Ejemplo: clasificar 20 reseñas → modelo barato y rápido. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: la interfaz unificada es como el control universal de la tele. Definición: una sola forma de pedir texto, traducir o clasificar aunque cambies el modelo de abajo. (Pre-training + señalización | Media)

| Tarea | Modelo ideal | Por qué |
|-------|--------------|---------|
| Clasificar | Liviano y barato | Muchas repeticiones |
| Generar | Potente y creativo | Pocas piezas clave |
| Traducir | Especializado | Menos errores |

5. 👀 EJEMPLO RESUELTO — Caso: tienda que clasifica 100 reseñas por día. Pasos: 1 Pides por interfaz única → 2 Pruebas con modelo barato → 3 Cambias a potente solo si falla. 👀 Cómo leerlo: izquierda a derecha, de pedido a cambio. (Worked example | Alta)

Pedir → Probar → Cambiar

¿Por qué funciona? La capa absorbe diferencias. Falla cuando atas tu app a opciones raras de un solo proveedor.

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Elegir el modelo más grande para todo → Corrección: grande para crear, chico para clasificar en volumen. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Elige modelo para contexto distinto: traducir 10 contratos legales.
> Respuesta esperada / criterio: modelo preciso aunque sea caro + razón de riesgo. Si eliges el más barato sin justificar, incompleto. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué te permite la interfaz unificada cuando migras de modelo? (Nivel Bloom: recordar) (Recuperación | Alta)
> Respuesta esperada: cambiar el modelo sin reescribir la app, solo ajustando la conexión.

9. 📌 IDEA CLAVE — Una sola puerta para muchos motores. (Heurística Feynman | Heurística)

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Describo mi tarea [ ] Elegí modelo con criterio [ ] Sé cómo migrar. Siguiente: ⛓️ encadenar pasos en la PARTE 2. (Metacognición | Media)

---

## ⛓️ PARTE 2: Chains que Trabajan en Serie (Nivel 3/5)

1. ❓ PRETEST — Necesitas resumir y luego traducir. ¿Un llamado gigante o 2 pasos en cadena?
> Respuesta esperada: 2 pasos en cadena, la salida del primero alimenta al segundo.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque lo complejo se vuelve controlable por partes. Vas a lograr una chain de 3 pasos con ejemplo numérico. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Parte tu tarea en 2: extraer y transformar. Ejemplo: extrae 5 datos → redacta ficha de 80 palabras. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: la chain es como línea de cocina con 3 cocineros. Definición: cadena donde la salida de un modelo entra como entrada del siguiente. (Pre-training + señalización | Media)

| Paso | Hace | Sale |
|------|------|------|
| 1 Extraer | Saca datos | 5 puntos |
| 2 Redactar | Arma texto | 80 palabras |
| 3 Revisar | Recorta | 60 palabras |

5. 👀 EJEMPLO RESUELTO — Caso: 200 palabras entran, 60 salen en otro idioma. Pasos: 1 Resume 200 a 80 → 2 Traduce 80 → 3 Recorta a 60. 👀 Cómo leerlo: de arriba abajo, achicando el texto. (Worked example | Alta)

Resumir → Traducir → Recortar

¿Por qué funciona? Cada paso tiene 1 trabajo y se puede medir, usando la interfaz de la PARTE 1. Falla cuando metes todo en 1 pedido gigante imposible de depurar.

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Chain de 7 pasos de golpe → Corrección: empieza con 2, mide, luego agrega el tercero. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Diseña una chain distinta: clasificar 30 tickets y luego priorizar 5 urgentes.
> Respuesta esperada / criterio: paso 1 clasifica con etiqueta, paso 2 filtra 5 con criterio. Si falta número concreto, ajusta. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué pasa con la salida del paso 1 en una chain? (Nivel Bloom: comprender) (Recuperación | Alta)
> Respuesta esperada: se convierte en la entrada del paso 2, por eso cada salida debe ser limpia.

9. 📌 IDEA CLAVE — Divide el pedido grande en pasos medibles. (Heurística Feynman | Heurística)

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Mi chain tiene 2 o 3 pasos [ ] Cada paso tiene salida contable [ ] Sé dónde falla. Siguiente: 🪝 agregar hooks en la PARTE 3. (Metacognición | Media)

---

## 🪝 PARTE 3: Hooks y Comunidad (Nivel 5/5)

1. ❓ PRETEST — Tu chain filtra datos sensibles pero a veces se escapa 1. ¿Dónde lo frenas?
> Respuesta esperada: en un hook entre pasos que revise antes de seguir.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque la lógica de negocio vive entre modelos. Vas a lograr 1 hook de control más criterio de modelo final. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Marca dónde pondrías tu revisión: antes, en medio o al final. Ejemplo: en medio, tras extraer datos. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: el hook es como la parada de control en la línea de cocina. Definición: punto personalizado entre pasos para validar, recortar o sumar lógica propia. (Pre-training + señalización | Media)

| Hook | Dónde | Qué hace |
|------|-------|----------|
| Entrada | Antes del paso 1 | Limpia texto |
| Medio | Entre pasos | Filtra sensible |
| Salida | Al final | Da formato |

5. 👀 EJEMPLO RESUELTO — Caso: de 100 fichas, 4 traían teléfono privado. Pasos: 1 Chain extrae → 2 Hook borra teléfonos → 3 Chain redacta. 👀 Cómo leerlo: izquierda a derecha, con freno en el medio. (Worked example | Alta)

Extraer → Filtrar → Redactar

¿Por qué funciona? El hook protege usando la chain de la PARTE 2 y la interfaz de la PARTE 1. Falla cuando pones lógica en todos lados sin un punto claro.

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Llenar de hooks cada paso → Corrección: 1 hook donde duele más, la comunidad ya resolvió el resto. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Práctica mixta: conecta todo con interfaz + chain + hook para clasificar 30 tickets sin filtrar datos privados.
> Respuesta esperada / criterio: interfaz única, chain de 2 pasos y 1 hook de filtro nombrado. Si falta el hook, incompleto. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué aporta la comunidad abierta además de la interfaz, la chain y el hook? (Nivel Bloom: evaluar) (Recuperación | Alta)
> Respuesta esperada: piezas probadas y migración más fácil porque muchos ya resolvieron el mismo problema.

9. 📌 IDEA CLAVE — Un buen freno en el medio salva toda la cadena. (Heurística Feynman | Heurística)

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Tengo 1 hook ubicado [ ] Mi chain sigue medible [ ] Puedo migrar de modelo. Siguiente: 🎯 publica tu mini-app con 10 casos reales. (Metacognición | Media)
