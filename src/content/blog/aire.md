---
title: "Masterclass: AI Engineering"
code: "AI Engineering"
description: "De los modelos fundacionales a sistemas en producción"
pubDate: "Jun 23 2026"
heroImage: "../../assets/blog-placeholder-1.jpg"
---


# Masterclass: AI Engineering
### De los modelos fundacionales a sistemas en producción
*Basado en el recorrido conceptual del libro "AI Engineering" de Chip Huyen*

---

## Cómo usar esta masterclass

Este documento está organizado en **6 módulos**, cada uno correspondiente a un bloque temático del libro. Cada módulo incluye:

- 🎯 **Objetivo de aprendizaje**
- 📖 **Conceptos clave** explicados en profundidad
- 🛠️ **Aplicación práctica** (cómo se usa en el mundo real)
- ⚠️ **Errores comunes**
- ✅ **Checklist de cierre** para autoevaluarte

Al final encontrarás un **glosario**, una **hoja de ruta de aprendizaje** y **recursos** para seguir profundizando.

| Módulo | Tema | Duración aprox. en el video |
|---|---|---|
| 1 | Fundamentos del AI Engineering | 0:00 – 8:40 |
| 2 | Evaluación y Selección de Modelos | 8:40 – 23:15 |
| 3 | Prompt Engineering y RAG | 23:15 – 36:56 |
| 4 | Agentes y Memoria | 36:56 – 43:02 |
| 5 | Fine-tuning e Ingeniería de Datasets | 43:02 – 59:45 |
| 6 | Optimización de Inferencia y Arquitectura de Sistemas | 59:45 – 1:16:03 |

---

## Módulo 1 — Fundamentos del AI Engineering

### 🎯 Objetivo
Entender por qué surgió una disciplina nueva ("AI Engineering") distinta del Machine Learning tradicional, y comprender los bloques arquitectónicos que la hacen posible.

### 1.1 El cambio de paradigma: de entrenar modelos a *usar* modelos

Durante años, "hacer ML" significaba: recolectar datos etiquetados, diseñar features, entrenar un modelo desde cero y desplegarlo. El **AI Engineering** nace cuando aparecen los **modelos fundacionales (foundation models)**: modelos gigantes, entrenados una sola vez por unos pocos laboratorios (OpenAI, Anthropic, Google, Meta...) sobre cantidades masivas de datos, y que luego cualquier equipo puede **adaptar** a su problema sin volver a entrenar desde cero.

Esto invierte la pirámide de esfuerzo:

| Machine Learning clásico | AI Engineering |
|---|---|
| El esfuerzo está en *entrenar* | El esfuerzo está en *adaptar y evaluar* |
| Necesitas datos etiquetados masivos | Puedes empezar con pocos ejemplos (few-shot) o cero (zero-shot) |
| El modelo es la parte difícil | El **producto, la evaluación y los datos de uso** son la parte difícil |
| Itera sobre arquitectura | Itera sobre prompts, contexto y pipelines |

### 1.2 Self-supervision: por qué los foundation models pudieron escalar

La clave que permitió entrenar modelos con billones de parámetros sobre internet entero fue el **aprendizaje auto-supervisado (self-supervised learning)**. En lugar de necesitar humanos etiquetando cada ejemplo, el modelo genera su propia señal de entrenamiento a partir de los datos crudos:

- **Modelado de lenguaje causal**: dado un texto, predecir la siguiente palabra (token). El "label" es simplemente la palabra que ya estaba ahí.
- **Modelado de lenguaje enmascarado** (usado en modelos tipo BERT): se ocultan palabras al azar y el modelo debe reconstruirlas.

Esto significa que **cualquier texto disponible en internet** (libros, código, foros, Wikipedia) se convierte automáticamente en datos de entrenamiento, sin intervención humana de etiquetado. Esa es la razón estructural detrás de la escala actual de los modelos.

### 1.3 La arquitectura Transformer

El Transformer (Vaswani et al., 2017) es la arquitectura que hizo viable este escalamiento. Sus piezas esenciales:

1. **Tokenización**: el texto se divide en unidades (tokens) — palabras, subpalabras o caracteres — que se convierten en vectores numéricos (embeddings).
2. **Mecanismo de atención (self-attention)**: para cada token, el modelo calcula qué tan "relevante" es cada otro token de la secuencia para entender su significado en ese contexto. En vez de procesar palabra por palabra de forma secuencial (como hacían las RNN/LSTM), el Transformer mira **toda la secuencia a la vez** y aprende relaciones de largo alcance.
3. **Atención multi-cabeza (multi-head attention)**: en lugar de un único patrón de atención, el modelo aprende varios "puntos de vista" en paralelo (por ejemplo, uno puede capturar relaciones sintácticas, otro relaciones semánticas).
4. **Capas feed-forward + normalización + conexiones residuales**: refinan la representación capa por capa, permitiendo apilar decenas o cientos de capas sin que el entrenamiento se vuelva inestable.
5. **Decodificación autoregresiva**: en modelos generativos (GPT-like), el modelo produce un token, lo añade a su propio contexto, y repite — generando texto token por token.

**¿Por qué importa la atención?** Es lo que le permite al modelo entender que en la frase *"el banco estaba cerrado porque era domingo"*, "banco" se refiere a una institución y no a un asiento, usando el contexto completo de la oración en un solo paso de cómputo paralelo (a diferencia de las arquitecturas secuenciales anteriores).

### 1.4 Scaling laws: por qué "más grande" funcionó (hasta cierto punto)

Las **leyes de escalamiento (scaling laws)** son observaciones empíricas que muestran que el rendimiento de un modelo mejora de forma predecible (siguiendo una ley de potencias) en función de tres variables:

- **N** — número de parámetros del modelo
- **D** — cantidad de datos de entrenamiento (tokens)
- **C** — cómputo total usado (FLOPs)

El hallazgo clave (popularizado por el paper de Kaplan et al. y refinado por "Chinchilla" de DeepMind) es que **no basta con agrandar el modelo**: hay que escalar parámetros y datos de forma balanceada. Un modelo gigante entrenado con pocos datos rinde peor que uno más chico entrenado óptimamente con más datos para el mismo presupuesto de cómputo.

**Implicación práctica para un AI Engineer:** no necesitas entender cómo entrenar estos modelos desde cero (eso lo hacen los grandes labs), pero sí necesitas entender que el rendimiento de un modelo en tu caso de uso depende de combinaciones de tamaño/datos/cómputo que **tú no controlas** — lo que controlas es cómo lo evalúas, cómo le das contexto, y cuándo conviene adaptarlo (fine-tuning) en vez de solo usarlo "as-is".

### ⚠️ Errores comunes
- Pensar que "modelo más grande = siempre mejor resultado" para tu tarea específica (a veces un modelo chico bien evaluado y bien promptiado gana).
- Confundir self-supervision con "el modelo entiende lo que dice" — sigue siendo predicción estadística de tokens, no comprensión simbólica garantizada.

### ✅ Checklist de cierre del Módulo 1
- [ ] Puedo explicar la diferencia entre ML tradicional y AI Engineering en una frase.
- [ ] Puedo explicar qué resuelve el self-supervised learning.
- [ ] Puedo nombrar las piezas principales de un Transformer.
- [ ] Entiendo qué dicen las scaling laws y por qué no son una garantía absoluta.

---

## Módulo 2 — Evaluación y Selección de Modelos

### 🎯 Objetivo
Comprender por qué evaluar sistemas de IA generativa es fundamentalmente distinto (y más difícil) que evaluar ML clásico, y aprender marcos prácticos para elegir el modelo correcto.

### 2.1 ¿Por qué evaluar IA generativa es más difícil?

En ML clásico (clasificación, regresión), hay una **respuesta correcta objetiva**: accuracy, F1, RMSE. En IA generativa:

- **No hay una sola respuesta correcta.** Para "resume este artículo", existen infinitos resúmenes válidos.
- **Las tareas son abiertas (open-ended)**: el espacio de salidas posibles es enorme.
- **Los criterios de calidad son multidimensionales**: ¿el output es correcto? ¿coherente? ¿seguro? ¿con el tono adecuado? ¿factualmente verificable?
- **Los modelos son no deterministas** (con temperatura > 0, la misma entrada puede dar salidas distintas).
- **El "ground truth" puede no existir** o ser costoso de generar (requiere expertos humanos).

### 2.2 Métodos de evaluación

| Método | Cómo funciona | Pros | Contras |
|---|---|---|---|
| **Evaluación humana** | Expertos o usuarios califican outputs | Máxima fidelidad | Lento, costoso, no escala |
| **Métricas léxicas** (BLEU, ROUGE) | Comparan superposición de palabras con una referencia | Rápidas, baratas | No capturan significado ni calidad real |
| **AI como Juez (LLM-as-a-judge)** | Un modelo (usualmente más grande o especializado) evalúa la salida de otro modelo según un rubric | Escalable, flexible, puede evaluar criterios subjetivos | Puede tener sesgos propios, hay que validarlo contra humanos |
| **Evaluación basada en exactitud programática** | Para tareas con respuesta verificable (código, SQL, matemática): se ejecuta el output y se comprueba el resultado | Objetiva y barata | Solo aplica a tareas verificables |
| **Comparación por pares (pairwise)** | Se le pide al juez (humano o IA) que elija cuál de dos respuestas es mejor, no que puntúe en abstracto | Más confiable que puntuar de 1 a 10 directamente | Requiere más comparaciones para ordenar muchas opciones |

### 2.3 AI como Juez — cómo implementarlo bien

Usar un LLM para evaluar a otro LLM ("LLM-as-a-judge") es hoy el método más usado en producción porque escala. Buenas prácticas:

1. **Define un rubric explícito y específico** (no "¿es bueno?", sino criterios desglosados: factualidad, relevancia, tono, formato, seguridad).
2. **Pide razonamiento antes del puntaje** ("explica tu evaluación y luego da una nota de 1-5") — mejora la consistencia.
3. **Calibra el juez contra evaluaciones humanas** en una muestra, para medir su tasa de acuerdo antes de confiar en él a gran escala.
4. **Usa un modelo distinto (o más capaz) como juez** del que generó la respuesta, para reducir el sesgo de "un modelo prefiriendo su propio estilo".
5. **Evita el sesgo de posición**: si comparás dos respuestas, alterná el orden en que se presentan.

### 2.4 Framework para seleccionar un modelo

Elegir el modelo correcto no es "elegir el más potente del ranking", sino resolver una optimización con varias restricciones:

- **Calidad en la tarea específica** — medida con tu propio set de evaluación, no solo benchmarks públicos (los benchmarks públicos pueden estar contaminados o no representar tu dominio).
- **Costo** — precio por token de entrada/salida, multiplicado por volumen esperado.
- **Latencia** — tiempo de primera respuesta (time-to-first-token) y velocidad de generación (tokens/segundo); crítico en apps conversacionales en tiempo real.
- **Tamaño de contexto** — cuántos tokens puede procesar de una vez (importante para RAG y documentos largos).
- **Capacidad de usar herramientas / salida estructurada** — si tu sistema necesita function calling o JSON garantizado.
- **Restricciones de despliegue** — ¿necesitás que corra on-premise/open-weight por privacidad/regulación, o un servicio API es aceptable?

**Estrategia recomendada:** construye un pequeño *leaderboard interno* con tus propios casos de prueba reales (no genéricos) y corre los candidatos de modelos contra él, midiendo calidad (vía AI-judge + revisión humana de muestra), costo y latencia simultáneamente, antes de decidir.

### ⚠️ Errores comunes
- Confiar ciegamente en benchmarks públicos (MMLU, etc.) como predictor de rendimiento en tu tarea de negocio específica.
- Usar BLEU/ROUGE como única métrica para tareas generativas abiertas (resumen, chat).
- No validar el AI-judge contra evaluación humana antes de confiar en él en producción.

### ✅ Checklist de cierre del Módulo 2
- [ ] Puedo explicar 3 razones por las que evaluar IA generativa es más difícil que ML clásico.
- [ ] Sé describir cómo construir y calibrar un AI-judge.
- [ ] Puedo listar al menos 4 criterios (más allá de "calidad") para elegir un modelo.

---

## Módulo 3 — Prompt Engineering y RAG

### 🎯 Objetivo
Dominar las técnicas para extraer el máximo rendimiento de un modelo sin modificar sus pesos, y entender cómo conectar modelos a datos privados o actualizados mediante RAG.

### 3.1 Prompt Engineering: principios fundamentales

El prompt es la única "API de control" que tenés sobre un modelo cerrado. Técnicas clave:

- **Instrucciones claras y específicas**: define formato de salida, tono, restricciones y el rol esperado.
- **Few-shot prompting**: incluir 2-5 ejemplos de entrada→salida deseada dentro del prompt. Mejora drásticamente la consistencia de formato y estilo, especialmente en tareas con reglas implícitas difíciles de describir en palabras.
- **Prompting basado en persona/rol**: asignarle un rol al modelo ("Actuá como un editor técnico riguroso...") ayuda a anclar el tono y el nivel de detalle esperado.
- **Chain-of-thought (razonamiento paso a paso)**: pedirle al modelo que "piense en voz alta" antes de dar la respuesta final mejora el rendimiento en tareas que requieren razonamiento multi-paso (matemática, lógica, planificación).
- **Estructura explícita de salida**: pedir JSON, Markdown con secciones fijas, o un esquema específico reduce la ambigüedad y facilita el parseo automático downstream.
- **Descomposición de tareas complejas**: en vez de un prompt monolítico, dividir el problema en sub-pasos encadenados (prompt chaining) suele dar mejores resultados que pedir todo de una vez.

### 3.2 Por qué el prompting solo no alcanza

Los modelos fundacionales tienen dos límites estructurales que el prompting no puede resolver:

1. **Conocimiento congelado en el tiempo** (knowledge cutoff): no saben nada de eventos posteriores a su entrenamiento.
2. **No conocen tus datos privados**: documentación interna, bases de datos de la empresa, historiales de usuario, etc.

Ahí entra **RAG (Retrieval-Augmented Generation)**.

### 3.3 RAG: arquitectura y funcionamiento

RAG combina **recuperación de información** con **generación**, en vez de depender únicamente de lo que el modelo "memorizó" durante el entrenamiento.

**Pipeline típico:**

```
1. Indexación (offline, una sola vez o periódica):
   Documentos → Chunking (dividir en fragmentos) → Embeddings (vectores) → Base de datos vectorial

2. Consulta (en cada request del usuario):
   Pregunta del usuario → Embedding de la pregunta
       → Búsqueda de similitud en la base vectorial (top-k fragmentos más relevantes)
       → Esos fragmentos se insertan como contexto en el prompt
       → El modelo genera la respuesta usando ese contexto + la pregunta original
```

**Componentes clave:**

- **Chunking**: cómo dividís los documentos importa mucho. Chunks muy grandes traen contexto irrelevante; chunks muy chicos pierden contexto necesario. Estrategias comunes: por tamaño fijo con overlap, por estructura (párrafos, secciones), o semánticas (agrupando oraciones relacionadas).
- **Embeddings**: representaciones vectoriales del texto que capturan significado semántico, no solo coincidencia de palabras exactas.
- **Búsqueda vectorial**: encontrar los fragmentos más "cercanos" semánticamente a la pregunta (similitud de coseno u otras métricas).
- **Re-ranking** (opcional pero recomendado): un segundo modelo, más preciso pero más lento que la búsqueda vectorial inicial, reordena los top resultados para mejorar precisión final antes de pasarlos al modelo generador.
- **Búsqueda híbrida**: combinar búsqueda vectorial (semántica) con búsqueda por palabras clave (léxica, tipo BM25) suele superar a usar solo una de las dos, porque captura tanto significado como coincidencias exactas (nombres propios, códigos, IDs).

### 3.4 Cuándo RAG no es suficiente

RAG resuelve "el modelo no sabe esto", pero no resuelve "el modelo no sabe *hacer* esto" (un estilo muy específico, un formato de razonamiento particular, terminología de dominio muy especializada que requiere ajuste de comportamiento). Para eso, el siguiente paso es **fine-tuning** (Módulo 5).

### ⚠️ Errores comunes
- Chunking demasiado agresivo que corta información a la mitad de una idea.
- No evaluar la calidad del *retrieval* por separado de la calidad de la *generación* final (si la recuperación trae fragmentos irrelevantes, no importa cuán bueno sea el modelo generador).
- Asumir que RAG "elimina" las alucinaciones — las reduce, pero el modelo puede igual ignorar el contexto recuperado o combinarlo mal.

### ✅ Checklist de cierre del Módulo 3
- [ ] Puedo nombrar 4 técnicas de prompt engineering y cuándo usar cada una.
- [ ] Puedo dibujar de memoria el pipeline de indexación y consulta de un sistema RAG.
- [ ] Entiendo la diferencia entre evaluar el *retrieval* y evaluar la *generación final*.

---

## Módulo 4 — Agentes y Memoria

### 🎯 Objetivo
Entender qué transforma un modelo de "generador de texto" a "agente capaz de actuar", y cómo se le da continuidad/memoria a través de interacciones.

### 4.1 ¿Qué es un agente de IA?

Un **agente** es un sistema construido sobre un foundation model que puede:

1. **Razonar** sobre un objetivo y descomponerlo en pasos.
2. **Decidir** qué herramienta usar en cada paso (si alguna).
3. **Actuar**, invocando herramientas externas (APIs, calculadoras, motores de búsqueda, bases de datos, ejecución de código).
4. **Observar** el resultado de la acción.
5. **Iterar** repitiendo el ciclo hasta resolver la tarea o decidir que terminó.

Este patrón se conoce comúnmente como el ciclo **ReAct** (Reason + Act): el modelo alterna entre "pensar" y "actuar", usando el resultado de cada acción para decidir el siguiente paso.

### 4.2 Tool use (uso de herramientas)

La capacidad central que habilita a los agentes es el **function calling / tool use**: el modelo no solo genera texto, sino que puede generar una **llamada estructurada a una función** (con nombre y argumentos), que el sistema externo ejecuta de verdad, devolviendo el resultado al modelo para que continúe.

Ejemplos típicos de herramientas:
- **Calculadora** — para evitar errores aritméticos que los LLM cometen al "calcular mentalmente".
- **Búsqueda web** — para obtener información actualizada más allá del conocimiento congelado del modelo.
- **Ejecución de código** — para tareas de análisis de datos, verificación lógica o generación de gráficos.
- **APIs internas de negocio** — consultar inventario, crear tickets, enviar correos, etc.

**Diseño de herramientas (tool design):** las herramientas deben tener nombres y descripciones muy claras (el modelo elige cuál usar basándose en esa descripción), parámetros bien tipados, y idealmente devolver errores informativos que el agente pueda usar para reintentar o corregir el curso.

### 4.3 Memoria en sistemas agénticos

Por defecto, un LLM no tiene memoria entre llamadas: cada request es independiente salvo que vos le pases el historial. La "memoria" en sistemas agénticos se construye en distintas capas:

| Tipo de memoria | Qué guarda | Cómo se implementa |
|---|---|---|
| **Memoria de corto plazo (contexto)** | La conversación actual | Se pasa el historial de mensajes en cada llamada, dentro de la ventana de contexto |
| **Memoria de trabajo / scratchpad** | Pasos intermedios de razonamiento dentro de una tarea | Texto generado por el propio agente que se reinyecta en pasos siguientes del mismo ciclo |
| **Memoria de largo plazo** | Hechos, preferencias o eventos de sesiones pasadas | Se almacena externamente (base de datos, vector store) y se *recupera* (como en RAG) cuando es relevante para la conversación actual |

Como la ventana de contexto es finita y cara, los sistemas de memoria de largo plazo suelen funcionar como un RAG aplicado al historial del propio usuario: se resumen o indexan interacciones pasadas, y se recuperan solo los fragmentos relevantes en cada nueva conversación, en lugar de cargar todo el historial completo.

### 4.4 Riesgos específicos de los sistemas agénticos

- **Acumulación de errores**: si el agente da muchos pasos, un error temprano se propaga y se amplifica en pasos posteriores.
- **Bucles infinitos**: el agente puede quedar "atascado" repitiendo la misma acción sin converger — se necesitan límites máximos de iteraciones.
- **Acciones irreversibles**: a diferencia de generar texto, ejecutar una acción (enviar un email, borrar un registro, hacer una compra) tiene consecuencias reales — se recomienda human-in-the-loop o confirmación explícita para acciones de alto riesgo.
- **Superficie de ataque mayor**: dar acceso a herramientas reales incrementa el riesgo de *prompt injection* (instrucciones maliciosas escondidas en datos externos que el agente procesa).

### ⚠️ Errores comunes
- Dar demasiadas herramientas al agente sin descripciones claras, generando confusión sobre cuál usar.
- No poner límites de iteraciones máximas, permitiendo loops costosos e infinitos.
- Cargar todo el historial de conversación sin resumir, agotando la ventana de contexto rápidamente.

### ✅ Checklist de cierre del Módulo 4
- [ ] Puedo explicar el ciclo razonar → actuar → observar.
- [ ] Entiendo la diferencia entre memoria de corto y de largo plazo en un agente.
- [ ] Puedo nombrar al menos 2 riesgos específicos de los sistemas agénticos y cómo mitigarlos.

---

## Módulo 5 — Fine-tuning e Ingeniería de Datasets

### 🎯 Objetivo
Saber cuándo conviene pasar de "solo prompting" a ajustar los pesos del modelo, y entender las técnicas modernas para hacerlo de forma eficiente, junto con la importancia crítica de la calidad de los datos.

### 5.1 ¿Cuándo conviene hacer fine-tuning?

Antes de fine-tunear, conviene agotar alternativas más baratas y rápidas de iterar: mejor prompting, few-shot examples, y RAG. El **fine-tuning tiene sentido cuando**:

- Necesitás que el modelo adopte un **estilo, tono o formato muy específico y consistente** que el prompting no logra mantener de forma confiable.
- Necesitás **reducir latencia/costo** usando un modelo más chico fine-tuneado que igual o supere en tu tarea específica a un modelo grande genérico.
- Tenés una **tarea muy especializada** (terminología de dominio, idioma poco representado, formato de salida muy particular) donde el conocimiento general del modelo no alcanza.
- Querés **reducir la longitud del prompt** (y por ende costo y latencia) internalizando instrucciones repetitivas dentro de los pesos del modelo en lugar de repetirlas en cada llamada.

**Regla general:** *prompting y RAG primero, fine-tuning después* — el fine-tuning es más costoso de iterar (requiere datasets curados, cómputo de entrenamiento, validación) y debería usarse cuando hay evidencia clara de que el prompting llegó a su límite.

### 5.2 LoRA (Low-Rank Adaptation)

Fine-tunear *todos* los parámetros de un modelo de miles de millones de parámetros es costosísimo en memoria y cómputo. **LoRA** resuelve esto de forma elegante:

- En lugar de actualizar la matriz de pesos original completa **W** de cada capa, LoRA **congela W** y entrena dos matrices mucho más pequeñas, **A** y **B**, cuyo producto (de rango bajo) se suma a W durante la inferencia: `W' = W + A·B`.
- Como A y B tienen un rango (dimensión interna) muy bajo comparado con W, el número de parámetros entrenables se reduce en **órdenes de magnitud** (a veces menos del 1% de los parámetros originales).
- Esto permite fine-tunear modelos grandes en hardware mucho más modesto, entrenar más rápido, y — ventaja clave en producción — **guardar múltiples adaptadores LoRA pequeños** (uno por cliente, tarea o dominio) y intercambiarlos sobre el mismo modelo base, en lugar de mantener una copia completa del modelo por cada caso de uso.
- Variante popular: **QLoRA**, que combina LoRA con cuantización del modelo base (ver Módulo 6) para reducir aún más los requisitos de memoria durante el entrenamiento.

### 5.3 Ingeniería de datasets: la parte que más importa y menos se ve

Si hay un consenso fuerte en la práctica del fine-tuning moderno es este: **la calidad del dataset importa más que la cantidad y, frecuentemente, más que el algoritmo de entrenamiento elegido.**

**Principios de curación de datos:**

- **Calidad sobre cantidad**: un dataset chico (cientos o miles de ejemplos) pero cuidadosamente curado y libre de errores suele superar a un dataset masivo pero ruidoso.
- **Diversidad y cobertura**: el dataset debe representar la variedad real de casos que el modelo enfrentará en producción, incluyendo casos límite (edge cases).
- **Consistencia de formato y estilo**: ejemplos contradictorios entre sí (mismo tipo de pregunta, respuestas con formato distinto) confunden al modelo durante el entrenamiento.
- **Deduplicación**: ejemplos duplicados o casi idénticos sesgan el aprendizaje hacia esos patrones específicos y desperdician cómputo.
- **Filtrado de calidad**: remover ejemplos con errores, respuestas de baja calidad, o contenido no representativo del comportamiento deseado.

### 5.4 Datos sintéticos

Cuando los datos reales son escasos, costosos de etiquetar, o tienen problemas de privacidad, una práctica cada vez más extendida es **generar datos sintéticos** usando otro modelo (frecuentemente uno más grande/capaz) para producir ejemplos de entrenamiento:

- **Generación de pares pregunta-respuesta** a partir de documentos existentes.
- **Augmentación**: generar variaciones de ejemplos reales (paráfrasis, distintos niveles de formalidad) para aumentar diversidad.
- **Distillation**: usar las respuestas de un modelo grande y capaz como "maestro" para fine-tunear un modelo más chico ("alumno") que aprende a imitar su comportamiento con menor costo de inferencia.

**Riesgo a vigilar**: los datos sintéticos pueden heredar y amplificar los sesgos o errores del modelo generador, así que conviene siempre validar una muestra con revisión humana antes de confiar plenamente en ellos.

### ⚠️ Errores comunes
- Saltar directo a fine-tuning sin haber agotado prompting/RAG, incurriendo en costos innecesarios.
- Priorizar la cantidad de ejemplos sobre su calidad y consistencia.
- No reservar un set de evaluación separado del set de entrenamiento para medir si el fine-tuning realmente mejoró el comportamiento deseado.

### ✅ Checklist de cierre del Módulo 5
- [ ] Puedo dar 3 razones válidas para justificar pasar a fine-tuning.
- [ ] Puedo explicar la idea central de LoRA en una oración.
- [ ] Entiendo por qué la calidad del dataset suele pesar más que su tamaño.

---

## Módulo 6 — Optimización de Inferencia y Arquitectura de Sistemas

### 🎯 Objetivo
Conocer las técnicas para servir modelos de forma eficiente en producción, balanceando latencia, throughput y costo, y entender por qué la observabilidad es indispensable.

### 6.1 El trade-off central: latencia vs. throughput vs. costo

- **Latencia**: tiempo que tarda un usuario individual en recibir su respuesta (clave en chat en tiempo real).
- **Throughput**: cantidad total de requests/tokens que el sistema puede procesar por unidad de tiempo (clave para servir muchos usuarios simultáneos a bajo costo).
- **Costo**: cómputo (GPUs) consumido, que escala con ambos factores anteriores.

Optimizar inferencia consiste en mover este trade-off a tu favor sin sacrificar calidad de las respuestas.

### 6.2 Cuantización (quantization)

Los pesos de un modelo se almacenan normalmente en punto flotante de 16 o 32 bits. La **cuantización** los convierte a representaciones de menor precisión (8 bits, 4 bits, incluso menos):

- **Beneficios**: el modelo ocupa mucha menos memoria (VRAM), lo que permite servir modelos más grandes en el mismo hardware, reducir costo, y a menudo acelerar la inferencia (menos datos que mover entre memoria y cómputo).
- **Costo**: una pequeña pérdida de precisión numérica, que en general impacta poco la calidad si se hace correctamente (existen técnicas de cuantización "consciente" que minimizan la degradación).
- Es una de las optimizaciones de mayor relación beneficio/esfuerzo en producción.

### 6.3 Decodificación especulativa (speculative decoding)

La generación autoregresiva normal produce **un token a la vez**, cada uno requiriendo un paso completo por el modelo grande — esto es lento. La **decodificación especulativa** acelera esto así:

1. Un **modelo borrador (draft model)**, mucho más chico y rápido, genera de antemano una secuencia candidata de varios tokens.
2. El **modelo grande (target model)** verifica esos tokens candidatos **en paralelo, en un solo paso** (en vez de generarlos uno por uno).
3. Los tokens que el modelo grande confirma como igualmente probables se aceptan tal cual; donde diverge, se corrige a partir de ahí.

El resultado es matemáticamente equivalente a la salida del modelo grande solo, pero generada más rápido, porque se aprovecha el cómputo paralelo de verificación en lugar del cómputo secuencial de generación token por token.

### 6.4 Batching (agrupamiento de requests)

Las GPU son extremadamente eficientes procesando muchas operaciones en paralelo, pero ineficientes si se les da una sola request a la vez. El **batching** agrupa múltiples requests de distintos usuarios para procesarlas juntas:

- **Batching estático**: se espera a juntar un grupo fijo de requests antes de procesarlas — simple, pero puede generar latencia de espera.
- **Batching continuo (continuous/in-flight batching)**: técnica moderna (usada en motores como vLLM) donde nuevas requests se incorporan dinámicamente al batch en cada paso de generación, sin esperar a que termine todo el batch anterior — maximiza el uso de GPU sin penalizar tanto la latencia individual.

### 6.5 Otras optimizaciones relevantes

- **KV-cache**: durante la generación autoregresiva, se cachean los cálculos de atención de tokens ya procesados para no recalcularlos en cada nuevo token — esencial para que la generación no se vuelva cuadráticamente más lenta a medida que crece la conversación.
- **Paralelismo de modelo**: para modelos que no entran en la memoria de una sola GPU, se distribuyen sus capas o tensores entre múltiples GPUs.
- **Streaming de respuesta**: enviar tokens al usuario a medida que se generan (en vez de esperar la respuesta completa) mejora drásticamente la *latencia percibida*, aunque el tiempo total de generación sea el mismo.

### 6.6 Observabilidad y feedback de usuarios

Ningún sistema de IA en producción está completo sin instrumentación que permita detectar degradación de calidad, costos inesperados o comportamientos no deseados **después** del despliegue:

- **Logging de inputs/outputs** (con cuidado de privacidad y cumplimiento) para poder auditar y reconstruir incidentes.
- **Métricas de sistema**: latencia (p50/p95/p99), throughput, tasa de errores, costo por request.
- **Métricas de calidad continua**: muestreo de respuestas en producción evaluadas periódicamente con AI-judge + revisión humana, para detectar *drift* (degradación silenciosa de calidad con el tiempo).
- **Feedback explícito de usuarios** (likes/dislikes, correcciones) como señal directa de calidad percibida, y como insumo valioso para futuros datasets de fine-tuning.
- **Alertas y guardrails en tiempo real**: detección de respuestas potencialmente dañinas, fuera de política, o con baja confianza antes de que lleguen al usuario final.

La observabilidad cierra el ciclo: lo que se aprende monitoreando producción retroalimenta tanto el dataset de fine-tuning (Módulo 5) como los criterios de evaluación (Módulo 2), haciendo de todo el sistema un **ciclo de mejora continua**, no un proyecto de una sola vez.

### ⚠️ Errores comunes
- Optimizar solo latencia ignorando throughput (o viceversa) sin entender cuál es la restricción real del producto.
- Cuantizar agresivamente sin volver a evaluar la calidad de las respuestas tras el cambio.
- Lanzar a producción sin ningún mecanismo de monitoreo de calidad continua, descubriendo problemas solo cuando los usuarios se quejan.

### ✅ Checklist de cierre del Módulo 6
- [ ] Puedo explicar la diferencia entre latencia y throughput con un ejemplo concreto.
- [ ] Puedo explicar en qué consiste la decodificación especulativa.
- [ ] Entiendo por qué el KV-cache es necesario para una generación eficiente.
- [ ] Puedo nombrar 3 señales que debería monitorear un sistema de IA en producción.

---

## Glosario rápido

| Término | Definición breve |
|---|---|
| **Foundation model** | Modelo grande pre-entrenado de propósito general, adaptable a múltiples tareas |
| **Self-supervised learning** | Entrenamiento donde la señal de aprendizaje se genera a partir de los datos mismos, sin etiquetado humano |
| **Attention / Self-attention** | Mecanismo que pondera la relevancia de cada token respecto a los demás en una secuencia |
| **Scaling laws** | Relaciones empíricas entre tamaño de modelo, datos, cómputo y rendimiento |
| **LLM-as-a-judge** | Uso de un modelo de lenguaje para evaluar la calidad de outputs de otro modelo |
| **RAG** | Retrieval-Augmented Generation: combinar recuperación de información externa con generación de texto |
| **Chunking** | División de documentos en fragmentos para indexación y recuperación |
| **Embedding** | Representación vectorial numérica del significado de un texto |
| **Agente** | Sistema que usa un modelo para razonar, decidir y ejecutar acciones mediante herramientas |
| **Tool use / Function calling** | Capacidad de un modelo de invocar funciones externas estructuradas |
| **Fine-tuning** | Ajuste de los pesos de un modelo pre-entrenado sobre un dataset específico |
| **LoRA** | Técnica de fine-tuning eficiente que entrena matrices de bajo rango en lugar de todos los pesos |
| **Cuantización** | Reducción de la precisión numérica de los pesos de un modelo para ahorrar memoria/cómputo |
| **Speculative decoding** | Técnica de aceleración de inferencia usando un modelo borrador chico y verificación en paralelo |
| **Batching** | Agrupamiento de múltiples requests para procesarlas juntas y maximizar uso de GPU |
| **KV-cache** | Caché de cálculos de atención previos para evitar recomputarlos en cada token nuevo |

---

## Hoja de ruta de aprendizaje sugerida

1. **Semana 1–2**: Fundamentos (Módulo 1) + practicar prompt engineering (Módulo 3.1) sobre una API real.
2. **Semana 3**: Armar tu primer set de evaluación propio + experimentar con AI-as-judge (Módulo 2).
3. **Semana 4–5**: Construir un pipeline RAG simple end-to-end sobre tus propios documentos (Módulo 3.3).
4. **Semana 6**: Construir un agente básico con 1-2 herramientas (calculadora + búsqueda) (Módulo 4).
5. **Semana 7–8**: Si tu caso de uso lo justifica, experimentar con fine-tuning vía LoRA sobre un modelo open-weight chico (Módulo 5).
6. **Semana 9**: Desplegar y medir: agregar observabilidad básica (logging + métricas) y probar una optimización de inferencia simple, como cuantización (Módulo 6).

---

## Recursos para profundizar

- Libro: *AI Engineering* — Chip Huyen (O'Reilly, 2024)
- Paper original del Transformer: *"Attention Is All You Need"* (Vaswani et al., 2017)
- Paper de scaling laws: Kaplan et al. (2020) y el paper "Chinchilla" de DeepMind (Hoffmann et al., 2022)
- Paper de LoRA: Hu et al., *"LoRA: Low-Rank Adaptation of Large Language Models"* (2021)
- Documentación de motores de inferencia con batching continuo: vLLM, TensorRT-LLM
- Frameworks de RAG y agentes para experimentar: LangChain, LlamaIndex

---

*Documento generado como guía de estudio complementaria al video-resumen del libro "AI Engineering" de Chip Huyen.*