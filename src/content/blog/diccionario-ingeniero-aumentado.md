---
title: "Diccionario del Ingeniero Aumentado (2025)"
code: "IA"
description: "Diccionario del Ingeniero Aumentado (2025)"
pubDate: 2025-11-24
---
# 📖 Diccionario del Ingeniero Aumentado (2025)
## Glosario Técnico para Dominar el Desarrollo con IA

**Uso de este diccionario:** No memorices definiciones de libro. Entiende el concepto para saber **qué pedirle** a la IA y **qué corregirle** en su código.

---

## 🏗️ Parte 1: Arquitectura y Diseño (El Criterio)

*Conceptos para estructurar el software antes de que la IA escriba una línea.*

### **Acoplamiento (Coupling)**
*   **Definición:** El grado de interdependencia entre módulos de software.
*   **La Realidad IA:** La IA tiende a crear código con *Alto Acoplamiento* (todo mezclado). Tu trabajo es forzar el *Bajo Acoplamiento*.
*   **Prompt Tip:** *"Refactoriza este código para desacoplar la lógica de negocio de la base de datos."*

### **Boilerplate**
*   **Definición:** Código repetitivo y estándar que no aporta lógica de negocio única (ej: configuraciones, imports, getters/setters).
*   **La Realidad IA:** La IA es la reina del boilerplate. Úsala para generar esto al 100% y ahorra tu energía.

### **Clean Architecture**
*   **Definición:** Organización del código en capas concéntricas (Dominio, Aplicación, Infraestructura) para aislar la lógica de negocio.
*   **Importancia:** Es el mejor antídoto contra el "código espagueti" que generan los LLMs si no se les guía.

### **DDD (Domain-Driven Design)**
*   **Definición:** Enfoque de desarrollo centrado en el modelo del negocio y su lenguaje.
*   **Concepto Clave:** *Ubiquitous Language* (Lenguaje Ubicuo). Si usas los mismos términos que el negocio en tus prompts, la IA entenderá mejor el contexto.

### **Idempotencia**
*   **Definición:** Propiedad de una operación que, al realizarse múltiples veces, produce el mismo resultado que si se hiciera una sola vez.
*   **Crítico para Agentes:** Si un Agente de IA falla y reintenta una compra, ¿cobraste dos veces? Necesitas APIs idempotentes.

### **Microservicios vs. Monolito**
*   **Definición:** Estilos de arquitectura. Muchos servicios pequeños vs. una sola base de código grande.
*   **Alerta:** La IA suele sugerir microservicios prematuramente. A veces un *Monolito Modular* es mejor para empezar. Tú decides, no ella.

### **Race Condition (Condición de Carrera)**
*   **Definición:** Error que ocurre cuando dos procesos compiten por el mismo recurso al mismo tiempo y el resultado depende del orden (impredecible).
*   **Tu Rol:** La IA rara vez detecta esto en snippets pequeños. Debes auditar el código concurrente con lupa.

### **SOLID**
*   **Definición:** 5 principios de diseño orientado a objetos.
*   **Foco:** Especialmente el principio "O" (Open/Closed) y "D" (Dependency Inversion). Úsalos para pedirle a la IA código extensible.

---

## 🧠 Parte 2: IA e Ingeniería de Prompts (La Herramienta)

*Términos para entender cómo "piensa" tu copiloto.*

### **Agente (Agent)**
*   **Definición:** Un sistema de IA que puede razonar, planificar y usar herramientas (navegador, terminal) para cumplir un objetivo autónomamente.
*   **Diferencia:** Un Chatbot *habla*. Un Agente *hace*.

### **Alucinación (Hallucination)**
*   **Definición:** Cuando un LLM genera información falsa o inventada con total confianza.
*   **Defensa:** Nunca confíes en una librería o función que la IA sugiere sin verificar que existe. Usa RAG para minimizar esto.

### **Chain-of-Thought (CoT)**
*   **Definición:** Técnica de prompting que pide al modelo explicar su "paso a paso" antes de dar la respuesta final.
*   **Uso:** Mejora drásticamente la calidad del código complejo. Prompt: *"Piensa paso a paso antes de escribir el código."*

### **Context Window (Ventana de Contexto)**
*   **Definición:** La cantidad máxima de texto (tokens) que el modelo puede "recordar" en una sola conversación.
*   **Gestión:** Saber qué archivos darle a la IA y cuáles no para no saturar su memoria ni gastar dinero innecesariamente.

### **LLM (Large Language Model)**
*   **Definición:** Modelos como GPT-4, Claude, Llama. Son motores de predicción de texto, no bases de conocimiento verídicas.

### **Prompt Injection**
*   **Definición:** Ataque de seguridad donde un usuario manipula el input para que la IA ignore sus instrucciones y haga algo indebido.
*   **Seguridad:** Debes sanitizar las entradas de los usuarios antes de pasarlas a un LLM.

### **Temperature (Temperatura)**
*   **Definición:** Parámetro que controla la creatividad del modelo (0.0 a 1.0).
*   **Uso:** Para código, usa temperatura baja (0.0 - 0.2) para precisión. Para lluvia de ideas, usa temperatura alta (0.7+).

---

## 📊 Parte 3: Datos y Vectores (La Memoria)

*Cómo conectar la IA a tu información privada.*

### **Embeddings**
*   **Definición:** Representación numérica (lista de números) de un texto que captura su significado semántico.
*   **Magia:** Permite que la computadora entienda que "perro" y "canino" son similares matemáticamente. Base de la búsqueda semántica.

### **RAG (Retrieval-Augmented Generation)**
*   **Definición:** Técnica que consiste en buscar información relevante en tus datos (Retrieval) e inyectarla en el prompt (Generation) para que la IA responda con datos actualizados y privados.
*   **Esencial:** Es la habilidad técnica #1 demandada en 2025.

### **Vector Database**
*   **Definición:** Base de datos especializada en guardar y buscar *Embeddings* (Pinecone, Milvus, pgvector).
*   **Uso:** Aquí es donde guardas la "memoria" a largo plazo de tu IA.

---

## 🛡️ Parte 4: DevOps y Fiabilidad (El Despliegue)

*Conceptos para que lo que construyas no se caiga.*

### **CAP Theorem**
*   **Definición:** En un sistema distribuido, solo puedes tener 2 de 3: Consistencia (Consistency), Disponibilidad (Availability) o Tolerancia a Particiones (Partition Tolerance).
*   **Decisión:** Debes saber qué sacrificar. La IA no tomará esta decisión de negocio por ti.

### **CI/CD (Continuous Integration/Deployment)**
*   **Definición:** Automatización de la integración y despliegue de código.
*   **Rol IA:** Pídele a la IA que escriba los scripts de GitHub Actions o GitLab CI, pero tú define los pasos de seguridad.

### **Observabilidad**
*   **Definición:** Medir qué tan bien funciona tu sistema basándose en sus outputs (logs, métricas, trazas).
*   **LLM Ops:** Ahora incluye monitorear cuántos tokens gastas, latencia de la IA y calidad de las respuestas.

### **Technical Debt (Deuda Técnica)**
*   **Definición:** El costo futuro de elegir una solución fácil y rápida ahora en lugar de un mejor enfoque que tomaría más tiempo.
*   **Peligro:** Usar IA sin supervisión genera una deuda técnica masiva. Escribe rápido, pero a veces sucio. Tú eres el cobrador de esa deuda: mantén el código limpio.

---
*Diccionario compilado para la Masterclass 2025.*