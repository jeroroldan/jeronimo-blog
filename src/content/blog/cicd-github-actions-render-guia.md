---
title: "CI/CD con GitHub Actions y Render: Protege tu Código en Producción"
description: "Guía paso a paso de CI/CD: integración y despliegue continuo, script de verificación, workflow en GitHub Actions, branch protection, deploy en Render solo con CI verde y preview environments."
pubDate: "2026-10-06"
code: "cicd-github-render"
language: "es"
category: "devops"
tags: ["cicd", "github-actions", "render", "devops", "testing"]
type: "guia"
level: "intermedio"
difficulty: "intermedio"
readingTime: 14
---

# 🚀 CI/CD con GitHub Actions y Render: Protege tu Código en Producción

Basada en la clase práctica de Brad Traversy. Tres FASES: verificas en tu máquina, automatizas en cada pull request y despliegas solo lo que pasa los controles.

## 🗺️ Mapa de 3 FASES

FASE 1 → Verificas local (PARTE 1) → FASE 2 → Automatizas en la nube (PARTE 2) → FASE 3 → Despliegas seguro (PARTE 3).

👀 Cómo leerlo: 3 fases de izquierda a derecha, de fácil a difícil.

### 📚 Pre-training: 7 términos antes de empezar

| Término | Significado en 1 línea |
|---------|------------------------|
| CI | Chequeos automáticos en cada cambio |
| CD | Salida a producción solo si todo pasa |
| Runner | Compu temporal que corre tus chequeos |
| Pull request | Propuesta de cambio antes de mezclar |

*Continúa la tabla (2/2) — partida en bloques de ≤4 para no saturar.*

| Término | Significado en 1 línea |
|---------|------------------------|
| Guardrail | Regla que frena lo roto antes de vivo |
| Branch protection | Candado que exige CI verde para mezclar |
| Preview environment | URL temporal para probar cada cambio |

👀 Cómo leer las tablas: izquierda el nombre, derecha la idea corta.

## 🔍 PARTE 1: Verifica Antes de Subir (Nivel 1/5)

1. ❓ PRETEST — Generaste código con IA y funciona en tu máquina. ¿Lo subes directo a producción? (Activa previas | Media)
> Respuesta esperada: no, primero corren chequeos de tipos, tests y build en tu máquina.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — El código de IA parece correcto y esconde errores de tipos. Vas a lograr un comando único de verificación con 4 chequeos encadenados. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Corre solo el chequeo de tipos de tu proyecto y confirma que termina sin errores. Ya diste el primer paso del pipeline. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: CI es el control del aeropuerto, cada valija pasa por el escáner aunque parezca inocente. Definición: integración continua es correr chequeos automáticos en cada cambio; despliegue continuo es soltar a producción solo lo que los pasa. Analogía del script verify: el checklist del piloto antes de despegar, 4 puntos o no sale. (Pre-training + señalización | Media)

| Chequeo | Qué atrapa |
|---------|------------|
| Tipos | Errores que la IA inventa en silencio |
| Tests | Lógica rota por el último cambio |
| Lint | Estilo que frena al equipo después |
| Build | Lo que compila aquí y muere allá |

👀 Cómo leer la tabla: izquierda el chequeo, derecha el error que atrapa. Caso del video: boilerplate Express con TypeScript, comando verify que encadena los 4 en orden y frena al primer fallo. Ejemplo numérico: 4 chequeos en 90 segundos te ahorran 1 rollback de 40 minutos. Por qué funciona: el fallo barato local evita el fallo caro en vivo. Cuándo falla: si corres los chequeos sueltos y omites el que incomoda. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: endpoint nuevo generado con IA. I Do: corro verify, el chequeo de tipos frena por un campo nulo no contemplado. We Do: ¿qué haces antes de subirlo? → corriges el tipo y repites verify hasta verde. You Do: punto 7. Visual: Cambio → 4 chequeos → Verde para subir. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Subir a main porque en mi máquina anda, sin correr tests. → Corrección: si verify no está verde, el cambio no existe para el equipo. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — En tu proyecto: lista tus 4 chequeos en orden y corre el primero hoy.
> Respuesta esperada: lista de 4 en orden con el primero ejecutado y su resultado. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué diferencia CI de CD y qué 4 chequeos lleva verify? (Nivel Bloom: recordar) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Nada sube sin verify verde, ni siquiera lo que parece perfecto.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Listé mis 4 chequeos [ ] Corrí 1 hoy [ ] Entiendo CI vs CD. Siguiente: que la nube lo exija en cada pull request. (Metacognición | Media)

## 🤖 PARTE 2: Automatiza Cada Pull Request (Nivel 3/5)

1. ❓ PRETEST — Un compañero abre un pull request un viernes a las 6. ¿Quién revisa que no rompa nada? (Activa previas | Media)
> Respuesta esperada: el workflow de CI en un runner temporal, antes que cualquier humano.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Los humanos se cansan, el runner no. Vas a lograr describir el workflow que corre tu verify en Ubuntu por cada pull request. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Abre tu repo y crea la carpeta de workflows con su archivo de CI vacío y nombrado. Ya existe el lugar del pipeline. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: el runner es un inspector externo que revisa cada entrega en la puerta. Definición: el workflow declara cuándo correr, en qué sistema y qué comando ejecutar. Analogía de branch protection: el candado del banco que solo abre con 2 llaves, CI verde más revisión. (Pre-training + señalización | Media)

| Pieza del workflow | Su trabajo |
|--------------------|------------|
| Disparador | Corre en cada pull request a main |
| Runner Ubuntu | Máquina limpia e idéntica siempre |
| Pasos | Instala, corre verify y reporta |
| Regla de rama | Bloquea mezclar si algo falla |

👀 Cómo leer la tabla: izquierda la pieza, derecha su trabajo. Caso del video: archivo ci punto yml que levanta Ubuntu, instala dependencias, corre verify y marca verde o rojo el pull request. Por qué funciona: entorno idéntico elimina el anda en mi máquina. Cuándo falla: si el workflow corre solo tests y omite tipos y build. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: pull request con test roto. I Do: el workflow corre, verify frena en tests y marca rojo. We Do: ¿se puede mezclar igual? → no, la protección lo bloquea hasta nuevo push verde. You Do: punto 7. Visual: Pull request → Runner corre verify → Verde o bloqueo. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Workflow que siempre da verde porque ignora fallos, más admin que mezcla saltando reglas. → Corrección: el fallo debe frenar el pipeline y nadie salta la protección, ni el dueño. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Dibuja tu workflow en 4 líneas: disparador, runner, pasos y regla de bloqueo.
> Respuesta esperada: las 4 piezas coherentes con tu verify de la PARTE 1. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué hace el runner y qué exige branch protection? (Nivel Bloom: comprender) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Cada pull request se gana la mezcla con CI verde, sin excepciones.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Describí mi workflow [ ] Incluí verify completo [ ] Definí la regla de bloqueo. Siguiente: desplegar solo lo verde y probarlo antes. (Metacognición | Media)

## 🌐 PARTE 3: Despliega Solo lo Verde (Nivel 5/5)

1. ❓ PRETEST — El CI está verde pero quieres ver el cambio en navegador antes de mezclar. ¿Cómo? (Activa previas | Media)
> Respuesta esperada: con una preview URL temporal que Render genera por pull request.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Probar en local no es probar el deploy real. Vas a lograr conectar Render para desplegar solo con CI verde y probar cada cambio en su URL temporal. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Entra a Render y conecta tu repo marcando que el deploy espere al CI. Ya pusiste el guardrail final. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: Render es el portero que solo abre si el inspector firmó el pase. Definición: el deploy se dispara con el push a main, pero únicamente si el CI previo quedó verde. Analogía de preview environment: el departamento modelo, entras y pruebas sin tocar el tuyo. (Pre-training + señalización | Media)

| Pieza del deploy | Su trabajo |
|------------------|------------|
| Conexión repo | Render mira tu rama main |
| Condición CI | Solo despliega con CI verde |
| Deploy auto | Cada mezcla verde sale a vivo |
| Preview URL | Pruebas el pull request en navegador |

👀 Cómo leer la tabla: izquierda la pieza, derecha su trabajo. Caso del video: Render configurado para esperar el chequeo, más URLs temporales por pull request para probar en navegador antes de mezclar. Por qué funciona: lo roto nunca llega a usuarios aunque alguien se apure. Cuándo falla: si activas deploy automático sin exigir el CI, el guardrail es decoración. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: feature lista un lunes. I Do: abro pull request, CI verde, pruebo la preview URL en el navegador y recién mezclo. We Do: Render ve mezcla verde y ¿qué hace? → despliega solo. You Do: punto 7. Visual: Preview probada → Mezcla verde → Deploy solo. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Mezclar sin abrir la preview y descubrir en producción que el estilo se rompió. → Corrección: preview abierta y revisada antes de cada mezcla, siempre. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA MIXTA — Mezcla las 3 PARTES: describe tu pipeline completo en 4 pasos, verify local, workflow por pull request, regla de bloqueo y deploy con condición.
> Respuesta esperada: 4 pasos coherentes de punta a punta con condición CI verde explícita. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: explicá CI, CD, runner, branch protection y preview con 1 línea cada uno. (Nivel Bloom: aplicar) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Lo verde se prueba en preview y solo lo verde toca producción.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Conecté deploy con CI [ ] Probé 1 preview [ ] Describí mi pipeline. Siguiente: aplica el ciclo a tu próximo pull request real. (Metacognición | Media)
