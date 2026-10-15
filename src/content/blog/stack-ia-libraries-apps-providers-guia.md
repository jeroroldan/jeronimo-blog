---
title: "Stack IA Sin Caos: Libraries, Apps y Providers en 3 Pasos"
description: "Guía del ecosistema de la imagen: libraries para crear, apps para correr y providers para escalar modelos sin GPU propia."
code: "stack-ia-libraries-apps-providers"
category: "ia"
tags: ["pytorch", "transformers", "ollama", "vllm", "inferencia"]
type: "guia"
level: "fundamento"
difficulty: "fundamento"
readingTime: 13
pubDate: "2026-10-15"
---

# 🧱 Stack IA Sin Caos: Libraries, Apps y Providers

La imagen muestra 3 pisos: arriba creas, en medio corres, abajo alquilas. Esta guía te enseña a elegir 1 pieza por piso sin ahogarte en logos.

## 🗺️ Mapa de 3 FASES

👀 Cómo leerlo: seguí las flechas de arriba hacia abajo, una fase por PARTE.

Crear → Correr → Escalar

1. 📚 FASE 1 Creas y empaquetas con libraries
2. 💻 FASE 2 Corres en tu PC o servidor con apps
3. ☁️ FASE 3 Escalas con providers sin comprar GPU

📌 Regla de oro en 1 línea: pesa poco, corre cerca, escala alquilando.

## 📚 Pre-training: 8 términos antes de empezar

| Término | Analogía de 1 línea |
|---------|---------------------|
| Library | Como caja de herramientas para construir muebles |
| Formato de pesos | Como tipo de enchufe: si no calza, no prende |
| App local | Como cocina casera: cocinas sin salir de casa |
| Servidor de inferencia | Como restaurante: atiende a muchos a la vez |

*Continúa la tabla (2/2).*

| Término | Analogía de 1 línea |
|---------|---------------------|
| Provider | Como delivery: alquilas cocina ajena por pedido |
| Latencia | Como espera del mozo: tiempo hasta el primer bocado |
| Cuantización | Como foto comprimida: pesa menos, se ve casi igual |
| GPU propia | Como comprar horno industrial para 2 pizzas |

✅ Ya tienes el vocabulario. Ahora a elegir.

---

## 📚 PARTE 1: Libraries para Crear (Nivel 1/5)

1. ❓ PRETEST — Quieres usar un modelo abierto y pasarlo a tu laptop. ¿Qué par te sirve?
> Respuesta esperada: Transformers para descargar más formato liviano como Safetensors, ONNX o GGUF.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque el formato decide si corre o se traba. Vas a lograr elegir base + formato en 2 minutos. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Clasifica 3 nombres de la imagen: base, uso y formato. Ejemplo: PyTorch base, Diffusers uso imagen, GGUF formato. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: las bases son como motores, los formatos como enchufes. Definición: libraries crean y empaquetan: PyTorch, TensorFlow y JAX entrenan; Transformers y Diffusers reutilizan; Safetensors, ONNX y GGUF lo hacen portable. (Pre-training + señalización | Media)

| Grupo | Ejemplos | Elige cuando |
|-------|----------|--------------|
| Base | PyTorch, JAX | Entrenas o ajustas |
| Uso | Transformers, Diffusers | Reutilizas texto o imagen |
| Formato | GGUF, ONNX | Llevas a laptop o web |

*Transformers.js y MLX son la versión para web y Mac, mismo rol.*

5. 👀 EJEMPLO RESUELTO — Caso: modelo de 8 GB no entra en tu laptop de 8 GB. Pasos: 1 Quedas con Transformers → 2 Pasas a GGUF comprimido a 4 GB → 3 Pruebas que responde igual. 👀 Cómo leerlo: izquierda a derecha, de pesado a liviano. (Worked example | Alta)

Elegir → Comprimir → Probar

¿Por qué funciona? Menos peso = misma idea útil. Falla cuando mezclas 3 bases a la vez sin dominar 1.

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Entrenar desde cero pudiendo reutilizar → Corrección: primero Transformers o Diffusers, entrena solo si no existe. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Elige stack para contexto distinto: generar 10 imágenes en tu PC con poca memoria.
> Respuesta esperada / criterio: Diffusers + Safetensors u ONNX con motivo de peso. Si pides entrenar desde cero, corrige. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué 3 roles cumplen las libraries? (Nivel Bloom: recordar) (Recuperación | Alta)
> Respuesta esperada: base que entrena, pieza que reutiliza y formato que empaqueta.

9. 📌 IDEA CLAVE — Reutiliza primero, comprime después, entrena al final. (Heurística Feynman | Heurística)

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Distingo base, uso y formato [ ] Elegí 1 base [ ] Elegí 1 formato. Siguiente: 💻 correrlo con apps en la PARTE 2. (Metacognición | Media)

---

## 💻 PARTE 2: Apps para Correr (Nivel 3/5)

1. ❓ PRETEST — Quieres chatear offline en tu laptop y luego atender a 20 usuarios. ¿Qué par usas?
> Respuesta esperada: Ollama o LM Studio en local, vLLM o TGI en servidor.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque donde corre decide costo y privacidad. Vas a lograr elegir app local vs servidor en 1 frase. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Escribe tu caso: 1 usuario offline u 20 online. Ejemplo: 1 usuario offline → Ollama con GGUF. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: app local es como cocina casera, servidor es como restaurante. Definición: apps ejecutan el formato de la PARTE 1: Ollama, LM Studio y Jan para 1 persona; llama.cpp y MLX LM para fierros chicos; vLLM y TGI para muchos. (Pre-training + señalización | Media)

| Caso | App | Formato que pide |
|------|-----|------------------|
| 1 offline | Ollama, Jan | GGUF liviano |
| Mac veloz | MLX LM | Pesos MLX |
| Muchos | vLLM, TGI | Safetensors |

*LM Studio es primo visual de Ollama para probar rápido.*

5. 👀 EJEMPLO RESUELTO — Caso: 4 GB libres y quieres chat privado. Pasos: 1 Bajas modelo GGUF de la PARTE 1 → 2 Abres en Ollama → 3 Preguntas 5 pruebas y mides espera. 👀 Cómo leerlo: de arriba abajo, del archivo al chat. (Worked example | Alta)

Bajar → Abrir → Medir

¿Por qué funciona? Formato liviano más app simple = privacidad sin GPU. Falla cuando pides vLLM para 1 usuario: restaurante para 1 plato.

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Instalar 4 apps para el mismo modelo → Corrección: 1 app por caso, borra el resto. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Elige app para contexto distinto: demo en Mac del equipo con 3 personas mirando.
> Respuesta esperada / criterio: MLX LM o LM Studio + motivo Mac y pocos usuarios. Si pides servidor multiusuario, sobra. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿cuándo conviene servidor como vLLM frente a Ollama? (Nivel Bloom: comprender) (Recuperación | Alta)
> Respuesta esperada: cuando atiendes a muchos a la vez y necesitas colas y velocidad.

9. 📌 IDEA CLAVE — Pocos usuarios van en local, multitudes van en servidor. (Heurística Feynman | Heurística)

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Sé mi caso 1 o muchos [ ] Elegí 1 app [ ] Medí la espera. Siguiente: ☁️ escalar con providers en la PARTE 3. (Metacognición | Media)

---

## ☁️ PARTE 3: Providers para Escalar (Nivel 5/5)

1. ❓ PRETEST — Tu app en vLLM se llena y no quieres comprar GPU. ¿Qué haces?
> Respuesta esperada: alquilas inferencia en un provider por pedido.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Importa porque comprar fierros te frena. Vas a lograr elegir 1 provider veloz y 1 barato con criterio. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Escribe tu pico: 10 o 1000 pedidos juntos. Ejemplo: 1000 juntos → busco veloz como Groq o Cerebras. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: el provider es como delivery con cocina gigante. Definición: alquilas cómputo por pedido: Groq, Cerebras y SambaNova apuestan a velocidad; Together AI, Novita, Hyperbolic, Nscale y fal compiten en precio y catálogo. (Pre-training + señalización | Media)

| Necesidad | Provider tipo | Ojo con |
|-----------|---------------|---------|
| Velocidad | Groq, Cerebras | Precio por pico |
| Precio | Together, Novita | Espera variable |
| Nicho | fal, Hyperbolic | Catálogo corto |

*SambaNova y Nscale entran como cocina extra cuando las otras se llenan.*

5. 👀 EJEMPLO RESUELTO — Caso: 500 preguntas en 1 minuto, tu servidor de la PARTE 2 se rinde. Pasos: 1 Mandas picos al provider veloz → 2 Dejas base en tu app → 3 Comparas costo por 1000. 👀 Cómo leerlo: izquierda a derecha, del ahogo al alivio. (Worked example | Alta)

Derivar → Mantener → Comparar

¿Por qué funciona? Combina libraries livianas de PARTE 1 con app de PARTE 2 más alquiler. Falla cuando mandas todo afuera sin medir latencia ni filtrar datos.

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Casarte con 1 provider sin medir → Corrección: prueba 2 con 100 pedidos reales y quédate con números. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Práctica mixta: arma tu stack completo con 1 library + 1 app + 1 provider para 50 usuarios con poco presupuesto.
> Respuesta esperada / criterio: formato GGUF u ONNX + Ollama o vLLM + provider barato con motivo. Si falta 1 piso, incompleto. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué 3 pisos tiene el stack y 1 ejemplo de cada uno? (Nivel Bloom: evaluar) (Recuperación | Alta)
> Respuesta esperada: libraries como PyTorch o GGUF, apps como Ollama o vLLM, providers como Groq o Together AI.

9. 📌 IDEA CLAVE — Arma liviano, corre cerca y alquila el pico. (Heurística Feynman | Heurística)

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Tengo 1 stack de 3 pisos [ ] Medí 100 pedidos [ ] Sé mi costo por 1000. Siguiente: 🎯 repite con tu próximo modelo. (Metacognición | Media)
