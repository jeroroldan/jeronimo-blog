---
title: "Máquina de Estados de Service Requests con Laravel: del Diagrama al Código"
description: "Guía paso a paso para entender la máquina de estados de un Service Request de logística y llevarla a Laravel: estados de gestión y campo, validación, asignación, finales y cancelaciones, con un solo campo estado y transiciones controladas."
pubDate: "2026-10-06"
code: "maquina-estados-sr-laravel"
language: "es"
category: "backend"
tags: ["laravel", "state-machine", "service-request", "backend", "logistica"]
type: "guia"
level: "intermedio"
difficulty: "intermedio"
readingTime: 15
---

# 🚚 Máquina de Estados de Service Requests con Laravel: del Diagrama al Código

Tu diagrama tiene 2 carriles y 5 pasos. Tres FASES: lees el diagrama, dominas sus reglas y lo bajas a Laravel sin romperlo.

## 🗺️ Mapa de 3 FASES

FASE 1 → Lees el diagrama (PARTE 1) → FASE 2 → Dominas reglas (PARTE 2) → FASE 3 → Bajas a Laravel (PARTE 3).

👀 Cómo leerlo: 3 fases de izquierda a derecha, de fácil a difícil.

### 📚 Pre-training: 7 términos antes de empezar

| Término | Significado en 1 línea |
|---------|------------------------|
| SR | Pedido de servicio de logística |
| Estado | Situación actual del SR |
| Transición | Cambio permitido entre estados |
| Carril | Zona del diagrama: gestión o campo |

*Continúa la tabla (2/2) — partida en bloques de ≤4 para no saturar.*

| Término | Significado en 1 línea |
|---------|------------------------|
| Estado final | No sale más: finalizada o cancelada |
| Validación | Chequeo de datos antes de avanzar |
| Dispatcher | Quien asigna y reasigna trabajo |

👀 Cómo leer las tablas: izquierda el nombre, derecha la idea corta.

## 🗺️ PARTE 1: Lee Tu Diagrama en 2 Carriles (Nivel 1/5)

1. ❓ PRETEST — Un SR nace y termina entregado. ¿Cuántos carriles cruza y cuáles son sus finales? (Activa previas | Media)
> Respuesta esperada: 2 carriles, gestión y trabajo en campo; finales como finalizada, cancelada o no finalizada.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Sin leer el diagrama construyes estados que no existen. Vas a lograr listar los estados por carril y los 5 pasos de vida del SR. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Recorre tu imagen con el dedo: borrador, confirmado, asignación, en camino e iniciada. Ya caminaste la ruta feliz. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: el diagrama es el mapa del subte, cada estación es un estado y solo viajas por vías dibujadas. Definición: carril gestión cubre borrador, confirmado, sincronizado, validación, cancelada, duplicada y finalizada; carril campo cubre pendiente de asignación, en asignación, asignado, en camino, iniciada, finalizada, no finalizada y suspendida. Analogía de confirmado: sala de espera interna, si algo falla vuelve ahí. (Pre-training + señalización | Media)

| Paso de vida | Qué pasa |
|--------------|----------|
| 1 Se crea | Nace con datos mínimos de integración |
| 2 Se actualiza | Suma datos para distribuir por zona |
| 3 Se valida | IA verifica petición y subtipo completos |
| 4 Se asigna | Dispatcher da chofer y vehículo |

👀 Cómo leer la tabla: izquierda el paso, derecha su efecto. El paso 5 es se ejecuta, el trabajo en campo hasta finalizar. Por qué funciona: 5 pasos ordenan 15 estados en historia lineal. Cuándo falla: si lees estados sueltos sin su carril, mezclas gestión con campo. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: SR de descarga con vehículo. I Do: nace en borrador, se confirma, se valida, cae a pendiente de despacho y avanza por campo. We Do: ¿dónde vive el chofer? → en campo, desde asignado en adelante. You Do: punto 7. Visual: Borrador → Confirmado → Asignado → En camino. 👀 Cómo leerlo: 4 pasos de izquierda a derecha, ruta feliz. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Tratar duplicada como error y borrarla, o activar suspendida que dice no se implementa esto. → Corrección: duplicada es final informativo que cierra el duplicado; suspendida no se usa hasta nuevo aviso. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Lista de memoria los estados de campo en orden sin mirar el diagrama.
> Respuesta esperada: pendiente de asignación, en asignación, asignado, en camino e iniciada. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué 2 carriles hay y qué 5 pasos vive un SR? (Nivel Bloom: recordar) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Dos carriles y cinco pasos ordenan todos los estados del diagrama.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Caminé la ruta feliz [ ] Separo carriles [ ] Ubico los 5 pasos. Siguiente: las reglas que mandan. (Metacognición | Media)

## 📏 PARTE 2: Las Reglas que Mandan (Nivel 3/5)

1. ❓ PRETEST — Un SR en camino recibe orden de cancelar y otro pide volver a borrador. ¿Cuál pasa? (Activa previas | Media)
> Respuesta esperada: cancelar sí por su vía; volver a borrador solo desde sincronizado.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Las reglas evitan estados imposibles como entregado sin chofer. Vas a lograr tu tabla estado por evento con las 4 reglas de oro. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Escribe 1 regla de tu diagrama: sin tipo de consulta no avanza, va a finalizada. Ya capturaste lógica real. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: las reglas son los guardias del subte, sin boleto válido no pasas el molinete. Definición: validar exige datos completos; asignar exige validado previo; desasignar libera para otros dispatchers; cancelar archiva con motivo. Analogía de warm up dispatch: el calentamiento antes del partido, prepara sin jugar. (Pre-training + señalización | Media)

| Regla de oro | Qué exige |
|--------------|-----------|
| Validar antes de asignar | Petición y subtipo completos |
| Asignar con recursos | Chofer y vehículo definidos |
| Desasignar libera | Vuelve a bolsa para dispatchers |
| Cancelar archiva | Siempre con motivo registrado |

👀 Cómo leer la tabla: izquierda la regla, derecha su exigencia. Más: sin tipo de consulta finaliza directo; duplicado cierra como duplicada; reasignar mueve entre dispatchers sin perder historia. Por qué funciona: cada regla cierra 1 agujero de imposibles. Cuándo falla: si permites cancelar sin motivo, nadie sabe por qué murió. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: SR validado sin vehículo libre. I Do: la regla de asignar frena, queda en pendiente de asignación visible para todos. We Do: ¿puede ir a en camino? → no, falta asignado con recursos. You Do: punto 7. Visual: Validado → Pendiente → Asignado con recursos. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Asignar a mano por fuera del flujo y que el SR figure en 2 estados a la vez. → Corrección: toda asignación pasa por la misma transición con sus exigencias. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Escribe la tabla de 1 estado de campo con 3 eventos: destino o rechazo cada uno.
> Respuesta esperada: tabla sin celdas vacías. Ejemplo: en camino más cancelan va a cancelada. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué exigen validar, asignar, desasignar y cancelar? (Nivel Bloom: comprender) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Cada transición exige su boleto, sin excepciones por apuro.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Tengo 4 reglas [ ] Mi tabla no tiene vacíos [ ] Sé qué no implementar. Siguiente: bajarlo a Laravel. (Metacognición | Media)

## 🔷 PARTE 3: Bajada a Laravel (Nivel 5/5)

1. ❓ PRETEST — Tu tabla service requests ya trae status lov id más 5 fechas. ¿Cuántos campos estado necesitas? (Activa previas | Media)
> Respuesta esperada: uno solo, status lov id manda y las fechas son historia.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Laravel sin centro de transiciones esparce reglas por controladores. Vas a lograr el diseño: 1 campo estado, 1 servicio que transiciona y fechas automáticas. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Lista los valores permitidos de status lov id copiados de tu diagrama. Ya tienes tu enumeración. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: el servicio de transiciones es la única boletería, nadie entra al subte por la ventana. Definición: 1 servicio central valida tabla, escribe estado y sella fecha en 1 paso con condición; observadores del modelo solo registran historia, nunca deciden. Analogía de timestamps: el pasaporte sellado en cada estación del viaje. (Pre-training + señalización | Media)

| Pieza Laravel | Su trabajo |
|---------------|------------|
| status lov id | Único campo que dice dónde está |
| Servicio central | Valida regla y mueve el estado |
| Fechas auto | oriented, assigned, planned, started y finished |
| Políticas | Quién puede pedir cada transición |

👀 Cómo leer la tabla: izquierda la pieza, derecha su trabajo. Más: driver id y vehicle id se exigen al asignar; zone id y service type id al distribuir; duplicada se detecta comparando origen y datos. Ejemplo numérico: 15 estados en 1 campo contra 15 banderas que daban miles de combinaciones absurdas. Por qué funciona: 1 puerta con guardia frena lo imposible en todos lados. Cuándo falla: si un controlador escribe status directo saltando el servicio. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: asignar SR validado. I Do: el servicio pide chofer y vehículo, valida pendiente, escribe asignado más fecha y sella quién. We Do: ¿y si llega duplicado? → misma clave de origen, se marca duplicada sin tocar el original. You Do: punto 7. Visual: Pide transición → Valida regla → Escribe con sello. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Actualizar status desde 5 controladores y que suspendida aparezca aunque no se implementa. → Corrección: solo el servicio escribe estado y suspendida queda fuera de la enumeración. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA MIXTA — Mezcla las 3 PARTES: elige 1 transición de tu diagrama y define estado origen, evento, exigencias y sello que deja.
> Respuesta esperada: origen más evento más exigencias más sello coherentes. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: explicá carriles, tabla de reglas, servicio central y timestamps con 1 línea cada uno. (Nivel Bloom: aplicar) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Un estado, un servicio y sellos automáticos sostienen todo el diagrama.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Enumeré estados [ ] Centralicé transiciones [ ] Sello fechas auto. Siguiente: implementa 1 transición real esta semana. (Metacognición | Media)
