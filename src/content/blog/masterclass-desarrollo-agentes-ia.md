---
title: "Masterclass: Desarrollo con Agentes de IA para Seniores Full-Stack"
code: "desarrollo-agentes-ia-senior"
description: "Del código generado por IA a sistemas autónomos supervisados: especificación, verificación determinista y arquitectura resiliente."
language: "es"
category: "ia"
tags: ["agentes-ia", "desarrollo-senior", "full-stack", "arquitectura", "verificacion"]
type: "masterclass"
level: "intermedio"
difficulty: "intermedio"
readingTime: 15
pubDate: "2026-10-28"
---

# 🧠 Desarrollo con Agentes de IA para Seniores Full-Stack

Delega con criterio, verifica con mecanismos deterministas y construye sistemas resilientes donde el humano siga al mando.

## 🗺️ Mapa de 3 FASES

👀 **Cómo leerlo:** Seguí las flechas de arriba hacia abajo, una fase por PARTE.

Especificar → Verificar → Arquitecturar

1. 🎯 **FASE 1 Especificar y planificar:** Deliga tareas con criterio sin perder el control.
2. 🛡️ **FASE 2 Verificar:** Confirma que el código generado es correcto, seguro y mantenible.
3. 🏗️ **FASE 3 Arquitecturar:** Diseña sistemas con IA como dependencia crítica, no como magia.

📌 **La tesis en 1 línea:** El agente es un junior rápido; tú eres el responsable final de todo lo que se mergea.

## 📚 Pre-training: 5 términos antes de empezar

| Término | Analogía de 1 línea |
|---------|---------------------|
| Agente | Pasante que ejecuta sin pedir permiso cada paso |
| Especificación | Receta clara antes de que cocine el pasante |
| Verificación | Prueba de sabor antes de servir el plato |
| Dependencia crítica | Motor que puede fallar; hay que tener plan B |
| Guardrail | Baranda que evita que el auto se salga de la pista |

*Continúa la tabla (2/2).*

| Término | Analogía de 1 línea |
|---------|---------------------|
| Streaming SSE | El servidor envía letras una a una como máquina de escribir |
| Edge | Código ejecutado cerca del usuario, como sucursal local |

✅ Ya tienes el vocabulario. Ahora a usarlo.

---

## 🎯 PARTE 1: Especificar y Planificar (Nivel 1/5)

### 1. ❓ PRETEST — Qué debe llevar una especificación antes de delegar a un agente

> **Pregunta:** ¿Cuál es el mínimo indispensable antes de pedirle a un agente que implemente?
> 
> Respuesta esperada: objetivo, restricciones, criterios de aceptación y qué NO tocar.
> 
> Si acertás: camino rápido → andá al punto 7.

### 2. 🎯 POR QUÉ + LOGRO — Importa porque un agente sin especificaciones produce código al azar. Vas a lograr redactar especificaciones que un agente pueda seguir sin supervisión constante.

### 3. ⚡ VICTORIA RÁPIDA (<5 min) — Escribe en 3 líneas la especificación de "cambiar el color del botón principal".

> Respuesta esperada / criterio: objetivo, qué archivos tocar, criterio de aceptación.

### 4. 💡 CONCEPTO — Analogía: especificar es como dar una receta completa antes de cocinar. Definición: una especificación incluye objetivo, restricciones, criterios de aceptación y límites de alcance.

**El bucle del agente supervisado en 4 pasos:**

1. **Planificar** → El agente propone plan; el humano lo revisa y corrige.
2. **Ejecutar** → Implementación en rama aislada.
3. **Verificar** → Tipos, tests, linter, contratos; CI en verde.
4. **Iterar** → El agente reintenta con feedback concreto.

👀 **Cómo leerlo:** de izquierda a derecha, del objetivo al merge.

**La puerta humana** cierra cada iteración: solo con revisión humana y CI en verde se mergea.

**Por qué funciona:** El agente trabaja en rama aislada y solo se mergea con CI en verde. Falla cuando se salta la verificación humana como si el agente fuera senior.

### 5. 👀 EJEMPLO RESUELTO — Caso: migrar un módulo de precios.

**Pasos:**
1. **Especificar** → El agente recibe el alcance con límites claros.
2. **Ejecutar** → Implementación en rama aislada.
3. **Verificar + Iterar** → Tests, tipos y lint en verde; si falla, el agente reintenta con feedback concreto.

**Por qué funciona:** cada paso tiene un dueño y una puerta de calidad. Falla cuando el alcance es tan grande que el agente pierde contexto.

### 6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Decir "mejora la app" sin alcance → Corrección: acota a una tarea verificable, por ejemplo "migra este módulo y mantén los tests en verde."

### 7. 🧪 PRÁCTICA — Escribe la especificación de "añadir validación de email en el registro".

> Respuesta esperada / criterio: objetivo, archivos, criterio de aceptación y qué no tocar. Si falta alguno, incompleto.

### 8. 🔁 RECALL — Sin mirar: ¿qué cierra cada iteración del bucle del agente supervisado?
> 
> Respuesta esperada: la puerta humana (revisión humana + CI en verde). (Nivel Bloom: recordar)

### 9. 📌 IDEA CLAVE — Especificar bien es más importante que escribir el código tú mismo.

### 10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Escribo especificaciones con objetivo y alcance [ ] Pido plan antes de editar [ ] Reviso como junior. Siguiente: 🛡️ verificar código generado en la PARTE 2.

---

## 🛡️ PARTE 2: Verificar (Nivel 2/5)

### 1. ❓ PRETEST — Cómo verificar código generado por IA sin confiar en su criterio

> **Pregunta:** ¿Cuál es la regla de oro para verificar código de un agente?
> 
> Respuesta esperada: usar mecanismos automáticos y deterministas, no leer con confianza.
> 
> Si acertás: camino rápido → andá al punto 7.

### 2. 🎯 POR QUÉ + LOGRO — Importa porque el agente puede alucinar APIs o paquetes. Vas a lograr aplicar tipos estrictos, tests, contratos y puertas de CI como barreras infranqueables.

### 3. ⚡ VICTORIA RÁPIDA (<5 min) — Enumera 3 puertas de calidad que debe pasar cualquier PR de un agente.

### 4. 💡 CONCEPTO — Analogía: verificar es como probar el plato antes de servir, no como confiar en que el cocinero sabe hacerlo. Definición: verificación determinista usa tipos, linter, tests y contratos que no dependen del criterio del agente.

**Pirámide de verificación (base a cima):**

1. Tipos estrictos + linter
2. Tests unitarios
3. Tests de integración y contratos
4. Revisión humana

👀 **Cómo leerlo:** de abajo arriba, de lo rápido y barato a lo caro y humano.

**Por qué funciona:** la base detiene la mayoría de errores barato; la cima filtra intención y diseño. Falla cuando solo lees el código sin ejecutar nada.

### 5. 👀 EJEMPLO RESUELTO — Caso: el agente genera una función de precios.

**Pasos:**
1. Ejecutar `pnpm check` y `pnpm test` — si fallan, no se mergea.
2. Exigir un test que falle antes del fix y pase después.
3. Revisar que no use `any`, `@ts-ignore` ni dependencias inventadas.
4. Confirmar que entiendes cada línea antes de aprobar.

**Por qué funciona:** los mecanismos automáticos son el juez, no tu confianza en el agente. Falla cuando el agente escribe tests que replican su propia implementación (tautológicos).

### 6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Leer el código y decir "se ve bien" → Corrección: ejecuta tipos, tests y linter; si algo falla, no se mergea.

### 7. 🧪 PRÁCTICA — Un agente propone un nuevo endpoint de pago.

> **Listado de comprobación:** ¿tipos pasan? ¿hay test que falle sin el cambio? ¿dependencias existen? ¿se tocó algo fuera de alcance? ¿hay manejo de errores? ¿datos sensibles?
> 
> Respuesta esperada / criterio: responder sí/no a cada ítem y justificar los no.

### 8. 🔁 RECALL — Sin mirar: ¿cuál es la regla de oro para verificar código de IA?
> 
> Respuesta esperada: verificar con mecanismos automáticos y deterministas, no con confianza. (Nivel Bloom: comprender)

### 9. 📌 IDEA CLAVE — No verificas a la IA leyendo; la verificas con pruebas que fallan si el código está mal.

### 10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Aplico tipos estrictos y linter [ ] Exijo tests de regresión [ ] Uso puertas de CI. Siguiente: 🏗️ arquitecturar con IA en la PARTE 3.

---

## 🏗️ PARTE 3: Arquitecturar con IA (Nivel 3/5)

### 1. ❓ PRETEST — Cómo tratar a un LLM en una arquitectura de producción

> **Pregunta:** ¿Cómo se integra un LLM en el sistema?
> 
> Respuesta esperada: como dependencia lenta, cara, no determinista y con fallos propios, con aislamiento y resiliencia.
> 
> Si acertás: camino rápido → andá al punto 7.

### 2. 🎯 POR QUÉ + LOGRO — Importa porque un LLM no es magia; es una dependencia crítica. Vas a lograr diseñar capas de guardrails, RAG, herramientas y observabilidad para IA.

### 3. ⚡ VICTORIA RÁPIDA (<5 min) — Dibuja en una línea el flujo: cliente → gateway → servicio IA → LLM.

### 4. 💡 CONCEPTO — Analogía: el LLM es un motor externo que puede fallar; necesitas barandas alrededor. Definición: el servicio de IA aplica guardrails de entrada, recuperación RAG, ejecutor de tools y guardrails de salida.

**Capas del servicio de IA (de fuera a adentro):**

1. Guardrails de entrada
2. Recuperación RAG
3. Ejecución del modelo y tools
4. Guardrails de salida

👀 **Cómo leerlo:** de izquierda a derecha, de la petición a la respuesta validada.

**Por qué funciona:** cada capa filtra o transforma antes de llegar al modelo o al cliente. Falla cuando el LLM tiene acceso directo a datos sensibles sin control de acceso.

### 5. 👀 EJEMPLO RESUELTO — Caso: chatbot de soporte con RAG.

**Pasos:**
1. Guardrail de entrada: valida PII e intenta de inyección.
2. RAG y LLM: recupera fragmentos con permisos y genera respuesta con citas, admite "no lo sé".
3. Guardrail de salida: valida tono, políticas y que no filtre datos internos.
4. Tool: si necesita stock real, consulta API en vivo, no el documento estático.

**Por qué funciona:** separa conocimiento estático (RAG) de datos en vivo (tools) y valida en ambos extremos. Falla cuando usa RAG para precios o stock en tiempo real.

### 6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Guardar precios actuales en la base vectorial → Corrección: precios son datos en vivo vía tool; la base vectorial es para conocimiento estático.

### 7. 🧪 PRÁCTICA — Diseña el flujo para un agente que consulta estado de pedido.

> **Capa 1:** cliente envía mensaje por WhatsApp
> **Capa 2:** gateway autentica y aplica rate limiting
> **Capa 3:** servicio IA detecta intención y llama tool de pedido
> **Capa 4:** respuesta validada por guardrail de salida
> 
> Respuesta esperada / criterio: identificar dónde va el RAG, dónde la tool y dónde los guardrails.

### 8. 🔁 RECALL — Sin mirar: ¿cómo se trata un LLM en arquitectura?
> 
> Respuesta esperada: como dependencia lenta, cara, no determinista, con aislamiento y resiliencia. (Nivel Bloom: recordar)

### 9. 📌 IDEA CLAVE — El LLM es una dependencia crítica, no una caja negra sin protección.

### 10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Separo RAG de tools en vivo [ ] Pongo guardrails en entrada y salida [ ] Instrumento observabilidad de IA.

---

## 📋 Checklist de competencias del desarrollador senior con IA

- [ ] Delego tareas a agentes con especificaciones claras, ramas aisladas y verificación automática.
- [ ] Mantengo archivos de contexto, ADRs y documentación viva en cada repositorio.
- [ ] Tengo puertas de calidad en CI (tipos estrictos, tests, contratos, SAST) que aplican igual a humanos y agentes.
- [ ] Reviso el código generado como el de un junior: entiendo cada línea antes de mergear.
- [ ] Separo conocimiento estático (RAG) de datos en vivo (tools).
- [ ] Pongo guardrails de entrada y salida en todo servicio de IA.
- [ ] Mido latencia, costo y errores de cada llamada al modelo.

---

## 🎯 Entrega final

Has completado el **Masterclass: Desarrollo con Agentes de IA para Seniores Full-Stack**.

Has dominado:

1. **Especificar y planificar:** redactar especificaciones que un agente pueda seguir, con alcance, criterios de aceptación y qué no tocar.
2. **Verificar:** aplicar tipos estrictos, linter, tests de regresión y puertas de CI como barreras deterministas.
3. **Arquitecturar:** tratar al LLM como dependencia crítica con guardrails, RAG para conocimiento estático, tools para datos en vivo y observabilidad.

Ahora puedes delegar a agentes con criterio, verificar sin confiar en su juicio y construir sistemas donde el humano siga al mando.

> **Recuerda:** el agente acelera; el criterio y la verificación siguen siendo tuyos.

---