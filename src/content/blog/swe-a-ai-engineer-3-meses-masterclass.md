---
title: "De Software a AI Engineer en 3 Meses: Masterclass Sin Teoría Innecesaria"
description: "Roadmap de 3 meses para pasar de software a AI engineer: construye, evalúa y consigue el rol con 4 brechas clave y un proyecto desplegado."
code: "swe-to-ai-engineer-3-meses"
category: "aprendizaje"
tags: ["ai-engineering", "agentes", "rag", "evals", "carrera"]
type: "masterclass"
level: "intermedio"
difficulty: "intermedio"
readingTime: 14
pubDate: "2026-10-15"
---

# 🚀 De Software a AI Engineer en 3 Meses

No necesitas un doctorado en álgebra lineal. Ya sabes API, debug y diseño de sistemas. Esta masterclass te enseña las 4 brechas que te faltan para construir sistemas IA que funcionan en producción.

## 🗺️ Mapa de 3 FASES

👀 Cómo leerlo: seguí las flechas de arriba hacia abajo, una fase por mes.

Mes 1 · Construir → Mes 2 · Confiar → Mes 3 · Conseguir

1. 🛠️ Mes 1 Construyes una mini-feature desplegada
2. 🧪 Mes 2 La vuelves confiable con evals y agentes
3. 💼 Mes 3 La conviertes en oferta laboral

📌 Ya eres ingeniero, solo te falta hablar el idioma de los modelos.

## 📚 Pre-training: 7 términos antes de empezar

| Término | Analogía de 1 línea |
|---------|---------------------|
| Token | Como una sílaba: el modelo lee a pedacitos, no palabras enteras |
| Ventana de contexto | Como una mesa chica: solo entra lo importante |
| RAG | Como llevar machete con apuntes al examen oral |
| Traza | Como la caja negra del avión de tu app |

*Continúa la tabla (2/2).*

| Término | Analogía de 1 línea |
|---------|---------------------|
| Eval | Como un test unitario para respuestas impredecibles |
| Agente | Como un pasante con herramientas y supervisor |
| Guardrail | Como baranda de escalera: no decora, evita caídas |

✅ Ya tienes el vocabulario. Ahora a usarlo.

---

## 🛠️ PARTE 1: Construye y Despliega (Nivel 2/5)

1. ❓ PRETEST — ¿Qué pasa si pasas 50 páginas a un modelo sin recortar?
> Respuesta esperada: se llena la ventana, sube el costo y alucina más.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque sin deploy no hay aprendizaje real. Vas a lograr un asistente mínimo desplegado en 30 días.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Escribí en una hoja: problema + usuario + respuesta ideal de tu asistente de soporte. Ejemplo: devolución → cliente enojado → respuesta en 3 pasos amables.

4. 💡 CONCEPTO — Analogía: el modelo es como un chef genial pero sin memoria. Definición: comportamiento del modelo son tokens, ventana y ajustes que controlan qué responde y cuánto inventa.

| Ajuste | Qué controla | Regla simple |
|--------|--------------|--------------|
| Tokens | Costo y largo | Pedí corto primero |
| Temperatura | Creatividad | 0 para soporte |
| Contexto | Datos de entrada | Menos y mejor |

5. 👀 EJEMPLO RESUELTO — Caso: asistente que responde sobre devoluciones. Pasos: 1 Pedís directo sin framework → 2 Agregás 1 documento útil → 3 Desplegás con 1 botón. 👀 Cómo leerlo: flechas de izquierda a derecha, del pedido al deploy.

Pedir → Recortar → Desplegar

¿Por qué funciona? Menos contexto = menos ruido. Falla cuando metes todo el manual sin filtrar.

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Empezar con framework pesado el día 1 → te peleas con config y no aprendes. Corrección: primero llamada directa, después herramienta, después RAG.

7. 🧪 PRÁCTICA — Describe tu feature en 3 líneas con contexto distinto: un asistente de recetas con solo 2 recetas cargadas.
> Respuesta esperada / criterio: problema claro + 2 fuentes + formato de salida. Si pide más de 2 fuentes, recorta.

8. 🔁 RECALL — Sin mirar: ¿qué 3 cosas controlan el comportamiento del modelo? (Nivel Bloom: recordar)
> Respuesta esperada: tokens, ventana de contexto y ajustes como temperatura.

9. 📌 IDEA CLAVE — Desplega chico y recortado antes de hacerlo inteligente.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Sé qué es token y ventana [ ] Elegí mi feature [ ] La desplegué mínima. Siguiente: 🎯 hacerla confiable en la PARTE 2.

---

## 🧪 PARTE 2: Evals y Agentes Confiables (Nivel 4/5)

1. ❓ PRETEST — Tu asistente falla 1 de cada 10 veces. ¿Qué miras primero?
> Respuesta esperada: las trazas de los casos fallidos, no el código.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque lo no-determinista sin evals es lotería. Vas a lograr un agente de 3 pasos con chequeo pasa/falla.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Revisá 5 respuestas viejas de tu PARTE 1 y marcá ✅ útil o ❌ invento. Ya hiciste tu primer análisis de errores.

4. 💡 CONCEPTO — Analogía: un eval es como un examen con rúbrica para un alumno creativo. Definición: eval es una prueba pasa/falla sobre trazas reales que mide si el agente usó bien contexto y herramientas.

| Paso de eval | Qué haces | Ejemplo |
|--------------|-----------|---------|
| Etiquetar | Marcar fallos | inventó política |
| Chequear | Regla simple | citó documento sí/no |
| Frenar | Guardrail humano | pedir aprobación |

5. 👀 EJEMPLO RESUELTO — Caso: el agente devuelve reembolsos sin permiso. Pasos: 1 Lees 20 trazas → 2 Creas chequeo citó-fuente → 3 Agregas aprobación humana. 👀 Cómo leerlo: de arriba abajo, del error a la baranda.

Detectar → Medir → Proteger

¿Por qué funciona? El agente con herramientas necesita supervisor. Falla cuando le das 5 herramientas sin límites.

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Crear un agente de 8 pasos de golpe → imposible saber qué falló. Corrección: 2 pasos + 1 eval, luego creces.

7. 🧪 PRÁCTICA — Mezcla con PARTE 1: tomá tu asistente de recetas y agregale 1 herramienta buscar-precio + 1 eval cita-ingrediente sí/no.
> Respuesta esperada / criterio: herramienta con 1 uso claro + eval binario. Si la herramienta se usa para todo, achica su permiso.

8. 🔁 RECALL — Sin mirar: ¿qué es una traza y por qué el eval la necesita? (Nivel Bloom: comprender)
> Respuesta esperada: registro paso a paso; sin traza no sabes dónde falló tokens, contexto o herramienta.

9. 📌 IDEA CLAVE — Sin traza etiquetada no hay agente confiable.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Etiqueté 20 trazas [ ] Tengo 1 eval pasa/falla [ ] Agregué 1 guardrail. Siguiente: 💼 convertir esto en trabajo en la PARTE 3.

---

## 💼 PARTE 3: Consigue el Rol (Nivel 5/5)

1. ❓ PRETEST — ¿Qué muestra más nivel senior: 10 demos o 1 sistema con evals?
> Respuesta esperada: 1 sistema con evals, trazas y guardrails en producción.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque te contratan por riesgo reducido, no por demos. Vas a lograr un portafolio de 1 proyecto que habla senior.

3. ⚡ VICTORIA RÁPIDA (<5 min) — Escribí tu titular: ex-backend + AI feature con evals + deploy. Ejemplo: backend 4 años → soporte IA con 90% citas correctas.

4. 💡 CONCEPTO — Analogía: tu portafolio es como un menú degustación, no buffet. Definición: posicionamiento senior es contar cómo tu experiencia software más evals resuelve problemas reales de costo y riesgo.

| Activo | Qué prueba | Frase |
|--------|------------|-------|
| Deploy | Entregas | está en producción |
| Evals | Confiabilidad | 90% pasa/falla |
| Red | Referidos | ex-compañero presenta |

5. 👀 EJEMPLO RESUELTO — Caso: aplicar a AI engineer sin PhD. Pasos: 1 Muestras demo viva → 2 Muestras tabla de evals → 3 Pides referido. 👀 Cómo leerlo: izquierda a derecha, de prueba a persona.

Demo → Números → Referido

¿Por qué funciona? Reclutador ve que ya sufriste tokens, contexto y agentes. Falla cuando solo muestras llamadas a API sin RAG ni evals.

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Postular a 100 ofertas genéricas → cero respuesta. Corrección: 10 empresas + mensaje con tu métrica de eval y tu traza favorita.

7. 🧪 PRÁCTICA — Práctica mixta: resume tu proyecto de PARTES 1 y 2 en 4 líneas: problema, contexto usado, eval y guardrail.
> Respuesta esperada / criterio: incluye ventana recortada, 1 eval binario y 1 aprobación humana. Si falta métrica, vuelve a PARTE 2.

8. 🔁 RECALL — Sin mirar: ¿cuáles son las 4 brechas y en qué mes se atacan? (Nivel Bloom: analizar)
> Respuesta esperada: comportamiento y contexto en mes 1, agentes y evals en mes 2, carrera en mes 3.

9. 📌 IDEA CLAVE — Un deploy con evals vale más que diez tutoriales.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Tengo demo viva [ ] Tengo métrica de eval [ ] Pedí 3 referidos. Siguiente: 🎯 repite el ciclo con un agente nuevo cada trimestre.
