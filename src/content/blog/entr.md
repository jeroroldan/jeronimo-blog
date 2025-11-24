---
title: 'Masterclass: Ingeniería de Agentes de IA'
code: "IA"
description: 'Aprende a construir, entrenar y orquestar cerebros digitales (LLMs) para crear agentes de IA que actúen como empleados específicos.'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

¡Me encanta el enfoque! Vamos a desmitificar esto. En 2025, cuando decimos "Entrenar un Agente", rara vez nos referimos a entrenar una red neuronal desde cero (eso cuesta millones de dólares).

Nos referimos a **Orquestar y Condicionar** un cerebro ya existente (LLM) para que actúe como un empleado específico.

Imagina que eres el **Director de Recursos Humanos** y estás contratando a un genio recién graduado (el LLM). Él sabe de todo (física, historia, código), pero no sabe cómo funciona **TU** empresa. Tu trabajo es darle el manual del empleado, sus herramientas y supervisarlo.

Aquí tienes la Masterclass. Guárdala como `Guia_Entrenamiento_Agentes_IA.md`.

***

```markdown
# Masterclass: Ingeniería de Agentes de IA
## Cómo construir, entrenar y orquestar cerebros digitales

**Por:** [Tu Especialista en IA], Arquitecto de Sistemas Autónomos.
**Concepto Central:** Un Chatbot *habla*. Un Agente *actúa*.

---

## 🦁 Introducción: La Anatomía de un Agente

Para entrenar un agente, primero debes entender que no es una sola pieza de software. Es un sistema compuesto. Vamos a usar la **Analogía del Empleado Nuevo**.

### Los 4 Componentes de un Agente
1.  **El Cerebro (El Modelo/LLM):** Es la inteligencia bruta. (GPT-4o, Claude 3.5, Llama 3).
    *   *Analogía:* Es el coeficiente intelectual (IQ) del empleado.
2.  **El Prompt del Sistema (La Personalidad):** Las instrucciones que definen quién es.
    *   *Analogía:* El "Manual del Empleado" y su descripción de puesto.
3.  **Herramientas (Function Calling):** Capacidad de tocar el mundo exterior (APIs, Calculadora, Google).
    *   *Analogía:* La laptop, el teléfono y el acceso al CRM que le das al empleado.
4.  **Memoria (Short & Long Term):** Contexto de la charla actual y base de datos vectorial (RAG).
    *   *Analogía:* Su memoria de trabajo y el archivo de expedientes de la empresa.

---

## 🎓 Módulo 1: "Entrenamiento" Conductual (Prompt Engineering Estático)

No re-entrenamos los pesos del modelo (matemática). Lo "entrenamos" dándole contexto. Esto se llama **In-Context Learning**.

### Paso 1: Definición de Rol (Persona)
Debes ser extremadamente específico.
*   *Mal Prompt:* "Eres un asistente útil."
*   *Prompt de Agente:* "Eres un **Analista Senior de Ciberseguridad** especializado en logs de servidores Linux. Tu tono es técnico, conciso y paranoico. Ante la duda, asume que es una amenaza."

### Paso 2: Few-Shot Prompting (El verdadero "Entrenamiento")
La mejor forma de enseñar es con ejemplos. En el prompt del sistema, le das ejemplos de Input/Output ideales.

**Ejemplo para un Agente de Soporte:**
> **Instrucción:** Clasifica el ticket y sugiere una respuesta.
>
> **Ejemplo 1 (Entrenamiento):**
> *Input:* "Mi internet no anda."
> *Pensamiento:* El usuario es vago. Necesito más info.
> *Acción:* Pedir reinicio de router.
>
> **Ejemplo 2 (Entrenamiento):**
> *Input:* "Error 503 en la API de pagos."
> *Pensamiento:* Crítico. Afecta facturación.
> *Acción:* Escalar a Ingeniería inmediatamente.

**¿Por qué funciona?** El modelo ve el patrón de razonamiento y lo imita. Has "entrenado" su comportamiento sin tocar una línea de código Python, solo con texto.

---

## 🛠️ Módulo 2: Dándole "Manos" (Function Calling / Tool Use)

Un agente sin herramientas es solo un filósofo. Para que sea un trabajador, debe poder ejecutar código.

### ¿Cómo funciona?
Los modelos modernos (OpenAI, Anthropic) tienen una funcionalidad nativa donde tú les describes tus funciones en formato JSON, y ellos deciden **cuándo** llamarlas.

**Analogía:** Tienes un empleado con una caja de herramientas cerrada.
1.  El usuario dice: "¿Cuánto es 453 * 23 más el clima en Bogotá?"
2.  El Agente piensa: "Soy malo en matemáticas y no tengo ventanas. Necesito herramientas."
3.  El Agente te dice a ti (el sistema): "Por favor, ejecuta `calculator.multiply(453, 23)` y `weather.get('Bogota')`".
4.  Tú ejecutas el código.
5.  Tú le devuelves el resultado al Agente.
6.  El Agente responde al usuario: "El resultado es 10419 y en Bogotá hay 18 grados".

**El "Entrenamiento" aquí consiste en:** Definir nombres de funciones claros y descripciones precisas para que el Agente sepa qué herramienta usar y cuándo.

---

## 🧠 Módulo 3: Arquitecturas Cognitivas (Cómo piensa el Agente)

Para tareas complejas, no basta con preguntar y responder. El agente debe "rumiar" la respuesta.

### 1. ReAct (Reason + Act)
Es el bucle más famoso. Forzamos al agente a seguir este esquema:
1.  **Thought (Pensamiento):** Analizo qué me piden.
2.  **Action (Acción):** Uso una herramienta.
3.  **Observation (Observación):** Veo el resultado de la herramienta.
4.  **Repeat:** Repito hasta terminar.

### 2. Plan & Execute
Para tareas largas (ej: "Escribe un libro").
1.  **Fase 1:** El agente genera un índice (Plan).
2.  **Fase 2:** El agente ejecuta cada capítulo uno por uno sin desviarse.

---

## 🤖 Módulo 4: Orquestación Multi-Agente (El Equipo)

En 2025, rara vez usamos un solo agente "Dios" que hace todo. Usamos un equipo de especialistas. Frameworks como **LangGraph** o **CrewAI** son estándar aquí.

**El Escenario:** Quieres crear una Newsletter automática sobre IA.

**Tu Equipo de Agentes (Crew):**
1.  **El Investigador (Model: Perplexity/Llama 3):**
    *   *Misión:* Buscar en la web las noticias de las últimas 24hs.
    *   *Output:* Una lista de URLs y resúmenes crudos.
2.  **El Analista (Model: Claude 3.5 Sonnet):**
    *   *Misión:* Leer lo que trajo el investigador, filtrar el ruido y elegir las 3 noticias top.
    *   *Output:* Un reporte curado.
3.  **El Redactor (Model: GPT-4o):**
    *   *Misión:* Tomar el reporte y escribirlo con tono divertido y markdown.
    *   *Output:* El post final.

**¿Cómo se entrena esto?**
Configuras cada agente por separado con su propio System Prompt ("Eres un investigador...", "Eres un redactor..."). El "Manager" (el código orquestador) pasa la pelota de uno a otro.

---

## 🧪 Ejemplo Práctico: Creando un Agente Recruiter (Pseudocódigo Conceptual)

Vamos a armar la lógica de un agente que filtra CVs.

**Paso 1: Definir las Herramientas**
```python
tools = [
    {
        "name": "leer_pdf",
        "description": "Extrae texto de un archivo PDF de currículum"
    },
    {
        "name": "enviar_email_rechazo",
        "description": "Envía un email amable diciendo que no quedó"
    },
    {
        "name": "agendar_entrevista",
        "description": "Agenda reunión en Google Calendar"
    }
]
```

**Paso 2: El System Prompt (El Cerebro)**
```text
Eres "TalentBot", un reclutador experto tech.
Tu objetivo es filtrar candidatos para un puesto de Senior React Developer.

REGLAS DE DECISIÓN (Tu entrenamiento):
1. Si el candidato tiene menos de 3 años de experiencia -> RECHAZAR.
2. Si no menciona "TypeScript" o "Next.js" -> RECHAZAR.
3. Si cumple todo -> AGENDAR ENTREVISTA.

IMPORTANTE: Antes de tomar una decisión, usa la herramienta 'leer_pdf' para analizar el archivo.
Piensa paso a paso (Chain of Thought) explicando por qué apruebas o rechazas.
```

**Paso 3: La Ejecución (El Loop)**
1.  Llega un email con `cv_juan.pdf`.
2.  El Agente lee su prompt.
3.  **Pensamiento:** "Necesito leer el PDF primero".
4.  **Acción:** Llama a `leer_pdf`.
5.  **Observación:** (Recibe el texto del CV: "Juan, 1 año de experiencia en Java...").
6.  **Pensamiento:** "Juan tiene 1 año. La regla 1 dice que necesito 3 años. Debo rechazar".
7.  **Acción:** Llama a `enviar_email_rechazo`.
8.  **Final:** Tarea completada.

---

## 🚀 Nivel Experto: Fine-Tuning (La Universidad)

Si el Prompt Engineering no basta (ej: quieres que el agente escriba en un dialecto médico muy específico o en un lenguaje de programación antiguo que casi no existe en internet), entonces vas al **Fine-Tuning**.

*   **Proceso:** Tomas un modelo Open Source (Llama 3, Mistral).
*   **Dataset:** Creas un Excel con 1000 filas de `Pregunta` | `Respuesta Ideal`.
*   **Entrenamiento:** Usas técnicas como **LoRA** (Low-Rank Adaptation) para inyectar ese conocimiento en los pesos del modelo.
*   **Resultado:** Un modelo que ya "sabe" cómo comportarse sin necesidad de un prompt gigante.

---

## 📝 Resumen para tu carrera

1.  **No pienses en "Entrenar":** Piensa en **"Diseñar Comportamiento"**.
2.  **Prompts > Pesos:** El 95% de los agentes se hacen con buenos prompts y RAG