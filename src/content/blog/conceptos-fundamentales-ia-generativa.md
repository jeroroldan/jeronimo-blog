---
title: "Conceptos Fundamentales de la IA Generativa"
code: "IA"
description: "Conceptos Fundamentales de la IA Generativa"
pubDate: 2025-11-24
---

¡Claro que sí! Esta es la base de todo. Si entiendes esto, dejas de ver a la IA como "magia" y empiezas a verla como lo que realmente es: **matemática y estadística**.

Aquí tienes la **Guía de Conceptos Fundamentales de la IA Generativa** explicada para desarrolladores, sin humo.

---

## 1. LLM (Large Language Model)
**¿Qué es?**
Imagina el autocorrector de tu celular (ese que sugiere la siguiente palabra), pero que se ha leído **todo Internet** (Wikipedia, GitHub, Reddit, Libros, Papers). Eso es un LLM.

*   **No es una base de conocimiento:** No es una enciclopedia que "sabe" cosas.
*   **Es un motor de predicción:** Es una red neuronal gigante entrenada para adivinar **cuál es la siguiente pieza de texto** (token) más probable dada una secuencia anterior.

> **Para el Dev:** Cuando le pides código, no está "pensando" en la lógica. Está prediciendo: *"Después de `function calcularSuma(a, b) {`, lo más probable estadísticamente es que venga `return a + b;`"*. Por eso a veces inventa cosas (alucina): porque estadísticamente "suenan bien", aunque sean falsas.

---

## 2. Tokens (La "Moneda" de la IA)
**¿Qué son?**
Los LLMs no leen palabras ni letras; leen **tokens**. Un token es un fragmento de texto codificado en un número.

*   **La regla de oro:** 1 Token $\approx$ 0.75 palabras (en inglés). En español es un poco menos eficiente.
*   **Ejemplo:**
    *   La palabra `gato` podría ser 1 token.
    *   La palabra `implementación` podrían ser 3 tokens (ej: `im`, `ple`, `mentación`).
    *   El código `import` es 1 token.

**¿Por qué te importa como Dev?**
1.  **Límite:** Los modelos tienen un límite de memoria (Ventana de Contexto) medido en tokens.
2.  **Dinero:** Las APIs (OpenAI, Anthropic) te cobran **por millón de tokens**.
    *   *Input tokens:* Lo que tú le escribes (más barato).
    *   *Output tokens:* Lo que la IA responde (más caro).

---

## 3. Context Window (Ventana de Contexto)
**¿Qué es?**
Es la "memoria RAM" o memoria a corto plazo del modelo durante una conversación. Es la cantidad máxima de tokens (input + output) que el modelo puede "ver" a la vez.

*   **El problema:** Si la conversación supera el límite (ej: 128k tokens), el modelo **"olvida" el principio**. Es como si borraras los mensajes viejos de WhatsApp.
*   **La evolución:**
    *   *GPT-3 (2020):* ~4k tokens (unas pocas páginas).
    *   *Claude 3.5 / Gemini 1.5 (2025):* 200k a 1 millón+ de tokens (puedes pegarle libros enteros o todo tu código fuente).

> **Estrategia Dev:** Aunque la ventana sea grande, "llenarla" cuesta dinero y hace al modelo más lento. Sé eficiente con lo que le envías.

---

## 4. Parámetros (El "Cerebro")
**¿Qué son?**
Son las conexiones internas de la red neuronal (los "pesos"). Piensa en ellos como las sinapsis en un cerebro.

*   **Modelos Pequeños (7B - 8B parámetros):** Como Llama 3 8B. Son rápidos, baratos y pueden correr en tu laptop. Son "listos", pero no genios.
*   **Modelos Gigantes (1T+ parámetros):** Como GPT-4 o Claude Opus. Requieren datacenters masivos. Son capaces de razonamiento complejo y matices profundos.

> **Para el Dev:** Más parámetros = Más inteligencia = Más costo/latencia. No uses un cañón (GPT-4) para matar una mosca (clasificar un email).

---

## 5. Temperature (Temperatura)
**¿Qué es?**
Un ajuste (del 0.0 al 1.0, a veces hasta 2.0) que controla cuán "arriesgado" o "creativo" es el modelo al elegir el siguiente token.

*   **Temperatura 0.0 (Frío):** Determinista. El modelo siempre elige el token más probable.
    *   *Uso:* Código, matemáticas, JSON, extracción de datos. **(Lo que tú usarás más)**.
*   **Temperatura 1.0 (Caliente):** Creativo. El modelo a veces elige tokens menos probables para variar.
    *   *Uso:* Poemas, lluvia de ideas, escribir correos de marketing.

---

## 6. Embeddings (Vectores)
**¿Qué son?**
Esta es la clave para que la IA entienda significados. Es el proceso de convertir texto en una lista de números (vector).

*   La computadora no sabe que "Perro" y "Canino" son similares.
*   Pero si convertimos las palabras a coordenadas numéricas (embeddings), esos dos puntos estarán **cerca** en el espacio matemático.
*   "Gato" estará cerca de "Perro".
*   "Heladera" estará lejos de "Perro".

> **Para el Dev:** Así es como funcionan los buscadores modernos y el **RAG**. Buscas por "significado" (distancia matemática), no por palabra clave exacta.

---

## 7. Inferencia vs. Entrenamiento
Es vital distinguir estas dos fases:

1.  **Entrenamiento (Training):** El proceso de meses donde el modelo aprende leyendo internet. Cuesta millones de dólares. El modelo está "congelado" en el tiempo (su conocimiento llega hasta una fecha límite).
2.  **Inferencia (Inference):** Es cuando tú usas el modelo (chat). Le mandas datos, él procesa y responde. **El modelo NO aprende de lo que tú le dices en la inferencia** (a menos que la empresa guarde tus chats para un futuro entrenamiento, pero el modelo no mejora en tiempo real).

---

## Resumen Gráfico para tu Cabeza

1.  Tú escribes un **Prompt**.
2.  Ese texto se convierte en **Tokens** (números).
3.  Esos tokens entran a la **Ventana de Contexto**.
4.  El **LLM** usa sus **Parámetros** para calcular probabilidades.
5.  Según la **Temperatura**, elige el siguiente token.
6.  Te devuelve el **Output** (texto/código).