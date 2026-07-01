---
title: 'Masterclass: Entrenamiento y Fine-Tuning de Modelos IA'
code: "TRAINING"
description: 'Entender la diferencia entre Pre-training, Fine-tuning y RAG. Guía paso a paso para crear tu propio dataset y entrenar un modelo a medida.'
pubDate: 'Dec 03 2025'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


## ¿Qué vas a aprender

En este contenido explorarás los pilares y aplicaciones de la inteligencia artificial moderna:

- Los fundamentos conceptuales que diferencian a cada enfoque de IA
- Cómo funcionan los modelos de lenguaje y cómo interactuar con ellos
- Técnicas de prompting y frameworks de agentes autónomos
- RAG, herramientas MCP y cómo conectar la IA con datos reales
- Aplicaciones prácticas para desarrollo, negocios y productividad


"Quiero entrenar mi propia IA".

Es la frase más común y malinterpretada de la industria. La mayoría de la gente no quiere *entrenar* (pre-training), quiere *ajustar* (fine-tuning) o simplemente *conectar* datos (RAG).

En esta masterclass, vamos a abrir el capó de los LLMs para entender cómo se cocinan y cómo puedes cocinar el tuyo.

---

## 🍰 Las 3 Capas del "Entrenamiento"

Imagina que un LLM es un empleado nuevo.

1.  **Pre-Training (La Universidad):**
    *   **Qué es:** Enseñar al modelo a *hablar* y entender el mundo. Lee todo internet (Wikipedia, GitHub, Reddit).
    *   **Costo:** Millones de dólares. Miles de GPUs. Meses.
    *   **Quién lo hace:** Google, OpenAI, Meta, Mistral.
    *   **¿Debes hacerlo tú?** **NO**. A menos que tengas el presupuesto de un país pequeño.

2.  **Fine-Tuning (La Especialización):**
    *   **Qué es:** Tomar un modelo ya entrenado (ej. Llama 3) y enseñarle una *tarea específica* o un *estilo* de respuesta.
    *   **Costo:** Desde $5 USD hasta unos miles.
    *   **Quién lo hace:** Empresas que necesitan un tono de marca específico, formatos JSON complejos o respuestas médicas muy técnicas.
    *   **¿Debes hacerlo tú?** Tal vez. Veremos cuándo.

3.  **RAG (Retrieval Augmented Generation - El Manual):**
    *   **Qué es:** Darle al modelo acceso a tus documentos PDF/Excel en tiempo real.
    *   **Costo:** Centavos.
    *   **¿Debes hacerlo tú?** **SÍ**. El 99% de los casos de "quiero que la IA sepa sobre mi empresa" se resuelven con RAG, no con entrenamiento.

---

## 🎯 ¿Cuándo hacer Fine-Tuning?

El error #1 es creer que el Fine-Tuning es para inyectar *conocimiento*.
**El Fine-Tuning es para inyectar COMPORTAMIENTO.**

*   **❌ Mal uso:** "Quiero fine-tunear GPT-4 con los manuales de mi lavadora para que sepa cómo arreglarla."
    *   *Por qué falla:* El modelo alucinará. Olvidará detalles. Es mejor usar RAG.
*   **✅ Buen uso:** "Quiero que el modelo responda siempre en formato JSON, con tono sarcástico y usando jerga legal argentina."
    *   *Por qué funciona:* Estás enseñando *forma*, no *fondo*.

---

## 🛠️ El Proceso de Fine-Tuning (Paso a Paso)

Si decidiste que necesitas Fine-Tuning, este es el camino.

### 1. El Dataset (El Oro)
El modelo será tan bueno como tus datos. Necesitas ejemplos de `Input` -> `Output Ideal`.
El formato estándar es **JSONL** (JSON Lines).

```json
{"messages": [{"role": "system", "content": "Eres un asistente médico."}, {"role": "user", "content": "Me duele la cabeza."}, {"role": "assistant", "content": "DIAGNÓSTICO: Cefalea tensional. RECOMENDACIÓN: Paracetamol 500mg."}]}
{"messages": [{"role": "system", "content": "Eres un asistente médico."}, {"role": "user", "content": "Tengo fiebre alta."}, {"role": "assistant", "content": "DIAGNÓSTICO: Posible infección viral. RECOMENDACIÓN: Reposo y acudir a guardia."}]}
```

**Regla de Oro:** Calidad > Cantidad. 50 ejemplos perfectos son mejores que 5000 mediocres.

### 2. Elegir el Modelo Base
*   **Cerrados (API):** GPT-4o-mini, GPT-3.5-turbo. Fáciles de usar, pagas por token. Tus datos van a OpenAI.
*   **Abiertos (Open Source):** Llama 3, Mistral, Gemma. Son tuyos. Privacidad total. Requieren GPU.

### 3. El Entrenamiento (The Bake)
Aquí ajustamos los "pesos" del modelo.
*   **Epochs:** Cuántas veces el modelo ve tus datos. (Usualmente 3-5). Si te pasas, el modelo "memoriza" y pierde flexibilidad (Overfitting).
*   **Learning Rate:** Qué tan rápido aprende. Muy alto y se rompe; muy bajo y no aprende nada.

### 4. Validación
No confíes ciegamente. Separa un 20% de tus datos para "Test". Si el modelo acierta en el entrenamiento pero falla en el test, hiciste Overfitting.

---

## 🧪 Herramientas Recomendadas (2025)

### Nivel Fácil: OpenAI Dashboard
Subes tu `.jsonl`, pagas unos dólares y en 20 minutos tienes tu modelo `ft:gpt-4o-...` listo para usar en la API.

### Nivel Intermedio: Unsloth / Axolotl
Librerías optimizadas para entrenar modelos Open Source (Llama 3) en tu propia máquina o en Colab.
*   **Unsloth:** Hace que el fine-tuning sea 2x más rápido y use 60% menos memoria. Magia negra matemática.

### Nivel Pro: LoRA / QLoRA
Técnicas para entrenar modelos gigantes en GPUs pequeñas. En lugar de re-entrenar todo el cerebro, entrenas una "capa fina" (adapter) que se pone encima.
*   Permite correr un modelo de 70B parámetros en una GPU de consumidor.

---

## 🚀 Resumen

1.  Si quieres que sepa datos nuevos -> **Usa RAG**.
2.  Si quieres que hable, razone o formatee de una forma muy específica -> **Haz Fine-Tuning**.
3.  Empieza pequeño: 50 ejemplos manuales de alta calidad.
4.  No entrenes desde cero (Pre-training) a menos que seas Google.

El poder ya no está en quién tiene el modelo más grande, sino en quién tiene los mejores datos para especializarlo.
