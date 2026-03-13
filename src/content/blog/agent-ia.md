---
title: "Masterclass: De Cero a Experto en Agentes de IA"
description: "El camino completo: LLMs → Embeddings → Vector DBs → LangChain → Agentes → Monetización"
pubDate: 2026-03-13
code: "agent-ia"
image: "/images/blog/agent-ia.jpg"
---

# 🧠 MASTERCLASS: De Cero a Experto en Agentes de IA

### El camino completo: LLMs → Embeddings → Vector DBs → LangChain → Agentes → Monetización

> **Nivel:** Principiante a Experto  
> **Objetivo:** Dominar los fundamentos y construir agentes de IA que generen valor real  
> **Tiempo estimado:** 20-30 horas de estudio profundo

---

## 📋 TABLA DE CONTENIDOS

1. [El Mapa Mental General](#mapa-mental)
2. [Módulo 1: LLMs — El Cerebro de Todo](#modulo-1)
3. [Módulo 2: Embeddings — El Sistema de Comprensión](#modulo-2)
4. [Módulo 3: Vector Databases — La Memoria a Largo Plazo](#modulo-3)
5. [Módulo 4: LangChain — El Sistema Nervioso](#modulo-4)
6. [Módulo 5: Agentes de IA — La Autonomía](#modulo-5)
7. [Módulo 6: Patrones Avanzados de Agentes](#modulo-6)
8. [Módulo 7: Proyectos Reales para Monetizar](#modulo-7)
9. [Cheat Sheet & Recursos](#recursos)

---

## 🗺️ EL MAPA MENTAL GENERAL {#mapa-mental}

Antes de entrar en detalle, necesitás entender cómo encajan todas las piezas:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENTE DE IA                                   │
│                                                                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │   LLM    │◄──►│ LangChain│◄──►│  Tools   │◄──►│ Memory   │   │
│  │(Cerebro) │    │(Sistema  │    │(Acciones)│    │(Historia)│   │
│  └──────────┘    │Nervioso) │    └──────────┘    └──────────┘   │
│                  └──────────┘                                     │
│                       ▲                                           │
│                       │                                           │
│  ┌──────────┐    ┌──────────┐                                    │
│  │Embeddings│───►│Vector DB │                                    │
│  │(Semántica│    │(Memoria  │                                    │
│  │numérica) │    │ larga)   │                                    │
│  └──────────┘    └──────────┘                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 🎯 La Gran Analogía: Una Empresa

Pensá en construir un agente como montar una **empresa**:

| Componente          | Rol en la empresa                                         |
| ------------------- | --------------------------------------------------------- |
| **LLM**             | El CEO inteligente que toma decisiones                    |
| **Embeddings**      | El sistema de clasificación y comprensión de documentos   |
| **Vector Database** | El archivo y biblioteca de la empresa                     |
| **LangChain**       | El organigrama y los procesos internos                    |
| **Agente**          | La empresa entera funcionando en autopiloto               |
| **Tools**           | Los departamentos especializados (ventas, finanzas, etc.) |

---

## 📦 MÓDULO 1: LLMs — El Cerebro de Todo {#modulo-1}

### ¿Qué es un LLM?

Un **Large Language Model (LLM)** es una red neuronal entrenada con cantidades masivas de texto para **predecir el siguiente token** (pieza de texto). De esa simple tarea emerge una capacidad aparentemente mágica: razonar, escribir, codificar, y mucho más.

### 🎭 Analogía: El Estudiante que Leyó Todo

Imaginate un estudiante que:

- Leyó **toda la Wikipedia** en todos los idiomas
- Leyó **miles de libros** de todas las disciplinas
- Leyó **millones de artículos**, foros, código, conversaciones
- Y después de leer todo eso, aprendió a **completar frases**

Ese estudiante es un LLM. No "sabe" cosas como una base de datos; en cambio, tiene una comprensión profunda del lenguaje y los conceptos que le permite generar respuestas coherentes.

### 🔧 Cómo funciona internamente

```
Texto de entrada (prompt)
         │
         ▼
┌─────────────────────┐
│   TOKENIZACIÓN      │ "Hola mundo" → [15496, 995]
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  EMBEDDING DE       │  Cada token → vector de 12.288 dimensiones
│   ENTRADA           │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  N CAPAS DE         │  GPT-4: ~96 capas transformer
│  TRANSFORMER        │  Cada capa: attention + feed-forward
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  PREDICCIÓN DEL     │  Distribución de probabilidad sobre
│  PRÓXIMO TOKEN      │  todo el vocabulario (~50.000 tokens)
└─────────────────────┘
         │
         ▼
    Token generado → se agrega al input → repite el proceso
```

### 🎯 Conceptos Clave de LLMs

#### 1. Tokens

Un token es la unidad mínima de texto que procesa el LLM.

```
"Hola"      → 1 token
"perro"     → 1 token
"automóvil" → 2-3 tokens (au-to-móvil)
"🚗"        → 3 tokens (los emojis son caros!)

Regla general: ~4 caracteres = 1 token
```

**¿Por qué importa?** Los LLMs tienen un límite de tokens (context window). GPT-4 tiene ~128k tokens ≈ 96.000 palabras ≈ un libro.

#### 2. Context Window (Ventana de Contexto)

```
┌─────────────────────────────────────────────┐
│              CONTEXT WINDOW                  │
│  ┌──────────┬──────────────┬─────────────┐  │
│  │ SYSTEM   │   HISTORIAL  │  NUEVO MSG  │  │
│  │ PROMPT   │ CONVERSACIÓN │    USER     │  │
│  └──────────┴──────────────┴─────────────┘  │
│  ◄────────────── N tokens ────────────────►  │
└─────────────────────────────────────────────┘
```

Todo lo que está dentro de la ventana es lo que el LLM "ve". Cuando se llena, hay que gestionar qué entra y qué no.

#### 3. Temperature (Temperatura)

Controla qué tan "creativo" o "determinístico" es el modelo:

```
Temperature = 0.0  →  Siempre elige el token más probable
                       Ideal para: código, matemáticas, SQL

Temperature = 0.7  →  Balance entre creatividad y coherencia
                       Ideal para: chatbots, análisis

Temperature = 1.5  →  Muy creativo, puede volverse incoherente
                       Ideal para: brainstorming, poesía loca
```

#### 4. System Prompt vs User Prompt

```python
messages = [
    {
        "role": "system",        # ← Instrucciones permanentes al modelo
        "content": "Eres un asistente experto en finanzas.
                    Respondes siempre en español y con datos concretos."
    },
    {
        "role": "user",          # ← Lo que dice el usuario
        "content": "¿Cuál es la diferencia entre acción y bono?"
    }
]
```

**Analogía:** El system prompt es el **contrato de trabajo** del LLM. Le dice quién es, cómo debe comportarse y qué puede/no puede hacer.

### 💻 Código: Tu primer llamado a un LLM

```python
# pip install openai anthropic
from openai import OpenAI

client = OpenAI(api_key="tu-api-key")

# Llamada básica
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "Eres un experto en inversiones."},
        {"role": "user", "content": "¿Qué es un ETF?"}
    ],
    temperature=0.7,
    max_tokens=500
)

print(response.choices[0].message.content)
# → "Un ETF (Exchange-Traded Fund) es un fondo de inversión..."

# Ver el costo
print(f"Tokens usados: {response.usage.total_tokens}")
print(f"Costo aprox: ${response.usage.total_tokens * 0.00001:.4f}")
```

### 🌟 Los LLMs más Importantes del Mercado

| Modelo            | Empresa   | Fortaleza                  | Context | Precio |
| ----------------- | --------- | -------------------------- | ------- | ------ |
| GPT-4o            | OpenAI    | Equilibrio general         | 128k    | $$$    |
| Claude 3.5 Sonnet | Anthropic | Razonamiento, código       | 200k    | $$$    |
| Gemini 1.5 Pro    | Google    | Multimodal, contexto largo | 1M      | $$     |
| Llama 3.3 70B     | Meta      | Open source, local         | 128k    | Gratis |
| Mistral Large     | Mistral   | Eficiencia, europeo        | 128k    | $$     |
| DeepSeek R1       | DeepSeek  | Razonamiento, económico    | 128k    | $      |

### 🎓 Prompt Engineering: El Arte de Hablarle al LLM

El prompt engineering es la habilidad más valiosa y subvaluada del mercado.

#### Técnicas Fundamentales

**1. Zero-Shot**

```
"Clasifica este email como SPAM o NO SPAM:
'Ganaste un iPhone gratis, haz click aquí!'"
```

**2. Few-Shot (Con ejemplos)**

```
"Clasifica emails:

Email: 'Reunión mañana a las 10am' → NO SPAM
Email: 'Ganaste un millón!' → SPAM
Email: 'Tu factura está lista' → NO SPAM

Ahora clasifica: 'Oferta exclusiva solo por hoy'"
```

**3. Chain of Thought (Razonamiento paso a paso)**

```
"Resuelve este problema PASO A PASO:

Si tengo 3 cajas con 4 manzanas cada una y regalo 5 manzanas,
¿cuántas me quedan?

Paso 1: ..."
```

**4. Role Prompting**

```
"Eres un senior software engineer con 15 años de experiencia
en Python y arquitectura de microservicios. Tu tarea es revisar
el siguiente código y señalar mejoras de performance..."
```

**5. Structured Output**

```
"Extrae la información del siguiente texto y devuélvela
SOLO como JSON con esta estructura:
{
  "nombre": string,
  "edad": number,
  "ciudad": string
}

Texto: 'Juan tiene 28 años y vive en Buenos Aires'"
```

---

## 🔢 MÓDULO 2: Embeddings — El Sistema de Comprensión Semántica {#modulo-2}

### ¿Qué es un Embedding?

Un **embedding** es la transformación de texto (o imágenes, audio, etc.) en un **vector numérico** que captura su **significado semántico**.

### 🎭 Analogía: El Sistema GPS del Significado

Imaginate que cada concepto del mundo tiene coordenadas GPS:

- "perro" → (2.3, -1.5, 0.8, ...) — 1536 coordenadas
- "gato" → (2.1, -1.4, 0.9, ...) — parecido al perro
- "automóvil" → (8.2, 5.1, -3.2, ...) — muy diferente
- "felino" → (2.0, -1.3, 0.7, ...) — muy similar a gato

**La magia:** cosas con significado similar tienen coordenadas cercanas en este espacio multidimensional.

```
        ESPACIO SEMÁNTICO (simplificado a 2D)

   animales
        │  • perro
        │    • gato
        │      • felino
        │
        │
        │─────────────────────────
        │                  • automóvil
        │                  • vehículo
        │                    • camión
        │
        └──────────────────────────────
                        objetos inanimados
```

### 🔧 Cómo se Crean los Embeddings

```
Texto de entrada
       │
       ▼
┌─────────────────────┐
│    MODELO DE        │  (ej: text-embedding-3-small de OpenAI)
│    EMBEDDING        │  Es un LLM especialmente entrenado
└─────────────────────┘
       │
       ▼
Vector de N dimensiones
[0.023, -0.157, 0.891, 0.044, -0.223, ...]
       1536 números entre -1 y 1
```

### 📐 Similitud Coseno: Midiendo Parecido

La métrica más importante para comparar embeddings:

```
similitud(A, B) = cos(θ) = (A · B) / (|A| × |B|)

Si similitud = 1.0  →  Idénticos
Si similitud = 0.0  →  Sin relación
Si similitud = -1.0 →  Opuestos
```

```python
import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Ejemplo
embed_perro = [0.8, 0.6, -0.2]
embed_gato  = [0.75, 0.65, -0.15]
embed_coche = [-0.4, 0.1, 0.9]

print(cosine_similarity(embed_perro, embed_gato))   # → 0.998 (muy similares!)
print(cosine_similarity(embed_perro, embed_coche))  # → 0.134 (poco similares)
```

### 💻 Código: Generando Embeddings Reales

```python
from openai import OpenAI
import numpy as np

client = OpenAI(api_key="tu-api-key")

def get_embedding(text: str, model="text-embedding-3-small") -> list[float]:
    """Genera embedding de un texto."""
    text = text.replace("\n", " ")  # Limpiar saltos de línea
    response = client.embeddings.create(input=[text], model=model)
    return response.data[0].embedding

def cosine_similarity(a: list, b: list) -> float:
    """Calcula similitud coseno entre dos vectores."""
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

# Ejemplo práctico: buscar documentos similares
documentos = [
    "El machine learning es una rama de la inteligencia artificial",
    "Los perros son animales domésticos muy leales",
    "Python es el lenguaje más popular para data science",
    "Las redes neuronales imitan el cerebro humano",
    "Los gatos son independientes y misteriosos"
]

consulta = "¿Qué es la inteligencia artificial?"

# Generar embeddings
embed_consulta = get_embedding(consulta)
embed_docs = [get_embedding(doc) for doc in documentos]

# Calcular similitudes
similitudes = [
    (doc, cosine_similarity(embed_consulta, embed_doc))
    for doc, embed_doc in zip(documentos, embed_docs)
]

# Ordenar por relevancia
similitudes.sort(key=lambda x: x[1], reverse=True)

print("Documentos más relevantes:")
for doc, sim in similitudes:
    print(f"  [{sim:.3f}] {doc[:60]}...")

# Output:
# [0.847] El machine learning es una rama de la inteligencia artif...
# [0.812] Las redes neuronales imitan el cerebro humano...
# [0.523] Python es el lenguaje más popular para data science...
# [0.102] Los perros son animales domésticos muy leales...
# [0.098] Los gatos son independientes y misteriosos...
```

### 🌟 Propiedades Sorprendentes de los Embeddings

Los embeddings capturan **relaciones analógicas**:

```
vector("Rey") - vector("Hombre") + vector("Mujer") ≈ vector("Reina")

vector("París") - vector("Francia") + vector("Italia") ≈ vector("Roma")

vector("Python") - vector("programación") + vector("música") ≈ vector("Bach")
```

Esto significa que el espacio de embeddings **tiene estructura matemática** que refleja la realidad conceptual.

### 📊 Modelos de Embedding Populares

| Modelo                 | Dimensiones | Ventaja          | Precio          |
| ---------------------- | ----------- | ---------------- | --------------- |
| text-embedding-3-small | 1536        | Rápido, barato   | $0.02/1M tokens |
| text-embedding-3-large | 3072        | Más preciso      | $0.13/1M tokens |
| text-embedding-ada-002 | 1536        | Legacy, estable  | $0.10/1M tokens |
| all-MiniLM-L6-v2       | 384         | Local, gratuito  | Gratis          |
| BAAI/bge-large-en      | 1024        | Open source SOTA | Gratis          |

---

## 🗄️ MÓDULO 3: Vector Databases — La Memoria a Largo Plazo {#modulo-3}

### ¿Por qué necesitamos una Vector Database?

**El problema:** Un LLM tiene una context window limitada. No podés meterle 10.000 documentos en el prompt.

**La solución:** Guardás todos los documentos como embeddings en una base de datos especializada. Cuando necesitás información, buscás los más relevantes y solo esos van al contexto del LLM.

### 🎭 Analogía: La Biblioteca con Telepata

Imaginate una biblioteca con 1 millón de libros y un bibliotecario telepático que:

1. Al recibir cada libro, **lo convierte en coordenadas GPS** (embedding)
2. Guarda el libro **junto a sus coordenadas** en el espacio
3. Cuando le preguntás algo, **entiende el significado** de tu pregunta
4. Busca los libros **más cercanos semánticamente** (no por palabras clave)
5. Te trae los más relevantes **en milisegundos**

```
                    FLUJO RAG (Retrieval Augmented Generation)

Usuario pregunta: "¿Cuál es la política de devoluciones?"
         │
         ▼
┌─────────────────┐
│ Embed la pregunta│  → [0.23, -0.15, 0.87, ...]
└─────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│            VECTOR DATABASE              │
│                                          │
│  Doc1: "Política de envíos..." [0.21,..] │◄── busca los más cercanos
│  Doc2: "Devoluciones: 30 días..[0.25,..] │    (similarity search)
│  Doc3: "Precios y ofertas..." [0.89,..] │
│  Doc4: "Contacto y soporte..."[0.77,..] │
│  ...1000 documentos más...              │
└─────────────────────────────────────────┘
         │
         │ Top 3 documentos más similares
         ▼
┌─────────────────────────────────────────┐
│              LLM                         │
│                                          │
│ System: "Responde usando estos docs:    │
│   Doc2: Devoluciones: 30 días...        │
│   Doc1: Política de envíos..."          │
│                                          │
│ User: "¿Cuál es la política            │
│         de devoluciones?"               │
└─────────────────────────────────────────┘
         │
         ▼
"Según nuestra política, podés devolver cualquier
 producto dentro de los 30 días de la compra..."
```

### 🔧 Conceptos Clave de Vector DBs

#### CRUD Vectorial

```
CREATE (Indexar):
  texto → embedding → almacenar con metadata

READ (Buscar):
  query → embedding → ANN search → top-k resultados

UPDATE:
  reemplazar embedding del documento

DELETE:
  eliminar por ID
```

#### Algoritmos de Búsqueda Aproximada (ANN)

Buscar el vector más cercano exacto en millones de documentos sería lento. Los algoritmos ANN hacen esto en milisegundos:

```
HNSW (Hierarchical Navigable Small World):
         Nivel 3:  ●─────────────────●
         Nivel 2:  ●────●────────────●
         Nivel 1:  ●──●──●──●──●──●──●
         Nivel 0:  todos los nodos

         Busca empezando desde arriba,
         va refinando hacia abajo.

IVF (Inverted File Index):
         Divide el espacio en N clusters,
         busca solo en los clusters más cercanos.
```

#### Metadata Filtering

Las vector DBs permiten combinar búsqueda semántica con filtros:

```python
results = db.similarity_search(
    query="política de devoluciones",
    filter={
        "categoria": "soporte",
        "idioma": "es",
        "fecha": {"$gte": "2024-01-01"}  # Solo docs recientes
    },
    k=5
)
```

### 💻 Código: Implementando con Chroma (local) y Pinecone (cloud)

#### Con Chroma (perfecto para desarrollo local)

```python
# pip install chromadb openai
import chromadb
from openai import OpenAI

# Inicializar
client_openai = OpenAI(api_key="tu-api-key")
chroma_client = chromadb.Client()

# Crear colección
collection = chroma_client.create_collection(
    name="mis_documentos",
    metadata={"hnsw:space": "cosine"}  # Usar similitud coseno
)

# Documentos de ejemplo (base de conocimiento de empresa)
documentos = [
    "Nuestros productos tienen garantía de 2 años desde la compra.",
    "Las devoluciones se aceptan hasta 30 días después de la compra.",
    "El envío estándar tarda 5-7 días hábiles.",
    "El envío express llega en 24-48 horas con costo adicional.",
    "Aceptamos pagos con tarjeta, transferencia y MercadoPago."
]

metadatas = [
    {"categoria": "garantia", "tipo": "politica"},
    {"categoria": "devoluciones", "tipo": "politica"},
    {"categoria": "envios", "tipo": "logistica"},
    {"categoria": "envios", "tipo": "logistica"},
    {"categoria": "pagos", "tipo": "financiero"}
]

# Generar embeddings y cargar
embeddings = []
for doc in documentos:
    resp = client_openai.embeddings.create(
        input=doc,
        model="text-embedding-3-small"
    )
    embeddings.append(resp.data[0].embedding)

collection.add(
    embeddings=embeddings,
    documents=documentos,
    metadatas=metadatas,
    ids=[f"doc_{i}" for i in range(len(documentos))]
)

# Buscar
def buscar(query: str, n_resultados: int = 3):
    query_embed = client_openai.embeddings.create(
        input=query,
        model="text-embedding-3-small"
    ).data[0].embedding

    resultados = collection.query(
        query_embeddings=[query_embed],
        n_results=n_resultados
    )
    return resultados['documents'][0]

# Prueba
docs_relevantes = buscar("¿Cuánto tiempo tengo para devolver algo?")
print(docs_relevantes)
# → ["Las devoluciones se aceptan hasta 30 días...",
#    "Nuestros productos tienen garantía de 2 años...",
#    ...]
```

#### Con Pinecone (cloud, para producción)

```python
# pip install pinecone-client
from pinecone import Pinecone, ServerlessSpec

pc = Pinecone(api_key="tu-pinecone-api-key")

# Crear índice
pc.create_index(
    name="mi-empresa",
    dimension=1536,  # dimensiones de text-embedding-3-small
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1")
)

index = pc.Index("mi-empresa")

# Upsert (insertar/actualizar)
vectors = [
    {
        "id": "doc_001",
        "values": embedding_list,  # lista de 1536 floats
        "metadata": {
            "text": "texto original",
            "categoria": "soporte",
            "fecha": "2024-01-15"
        }
    }
]

index.upsert(vectors=vectors, namespace="produccion")

# Query
results = index.query(
    vector=query_embedding,
    top_k=5,
    filter={"categoria": "soporte"},
    include_metadata=True
)

for match in results.matches:
    print(f"Score: {match.score:.3f} | {match.metadata['text'][:80]}")
```

### 🗂️ Comparativa de Vector Databases

| DB           | Tipo              | Escala    | Precio | Mejor para              |
| ------------ | ----------------- | --------- | ------ | ----------------------- |
| **Chroma**   | Local/Cloud       | <1M docs  | Gratis | Desarrollo, prototipos  |
| **Pinecone** | Cloud             | Billones  | $$     | Producción empresa      |
| **Weaviate** | Self-hosted/Cloud | Grande    | Free/$ | Features avanzados      |
| **Qdrant**   | Self-hosted/Cloud | Grande    | Free/$ | Performance alto        |
| **FAISS**    | Librería          | Ilimitado | Gratis | Research, control total |
| **pgvector** | PostgreSQL ext.   | Mediano   | Gratis | Ya tenés Postgres       |

---

## ⛓️ MÓDULO 4: LangChain — El Sistema Nervioso {#modulo-4}

### ¿Qué es LangChain?

LangChain es un **framework de orquestación** que conecta LLMs con herramientas, datos, y procesos para construir aplicaciones complejas de IA.

### 🎭 Analogía: El Sistema Operativo de la IA

LangChain es como un **sistema operativo** para LLMs:

- El LLM es el procesador
- LangChain es el OS que coordina memoria, I/O, y procesos
- Las tools son las apps
- El agente es el usuario ejecutando tareas

```
SIN LANGCHAIN:
Tu código → API LLM → Respuesta
(simple, pero no escala)

CON LANGCHAIN:
Tu código → LangChain → [
    ├── Selecciona el LLM adecuado
    ├── Gestiona el historial de conversación
    ├── Recupera contexto de la Vector DB
    ├── Ejecuta tools cuando es necesario
    ├── Maneja errores y reintentos
    └── Formatea la respuesta
] → Respuesta inteligente
```

### 🔧 Componentes Principales de LangChain

```
LANGCHAIN ECOSYSTEM
│
├── 📝 Prompts
│   ├── PromptTemplate         → Plantillas reutilizables
│   ├── ChatPromptTemplate     → Para modelos de chat
│   └── FewShotPromptTemplate  → Con ejemplos
│
├── 🤖 Models (LLMs)
│   ├── ChatOpenAI             → GPT-4, GPT-4o
│   ├── ChatAnthropic          → Claude
│   ├── ChatGoogleGenerativeAI → Gemini
│   └── Ollama                 → Modelos locales
│
├── 📤 Output Parsers
│   ├── StrOutputParser        → String simple
│   ├── JsonOutputParser       → JSON estructurado
│   └── PydanticOutputParser   → Validado con Pydantic
│
├── 🗄️ Memory
│   ├── ConversationBufferMemory → Todo el historial
│   ├── ConversationSummaryMemory → Resumen comprimido
│   └── VectorStoreRetrieverMemory → Búsqueda semántica
│
├── 📚 Document Loaders & Splitters
│   ├── PDFLoader, WebBaseLoader, etc.
│   └── RecursiveCharacterTextSplitter
│
├── 🔍 Retrievers
│   └── VectorStoreRetriever   → Busca en vector DB
│
└── 🔗 Chains & Agents
    ├── LCEL (LangChain Expression Language)
    ├── RAGChain
    └── AgentExecutor
```

### 💻 LangChain Expression Language (LCEL)

LCEL usa el operador `|` (pipe) para encadenar componentes:

```python
# pip install langchain langchain-openai
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Componentes individuales
model = ChatOpenAI(model="gpt-4o", temperature=0)
parser = StrOutputParser()

prompt = ChatPromptTemplate.from_messages([
    ("system", "Eres un experto en {dominio}. Respondes en español."),
    ("user", "{pregunta}")
])

# Encadenar con |  (como unix pipes!)
chain = prompt | model | parser

# Ejecutar
respuesta = chain.invoke({
    "dominio": "machine learning",
    "pregunta": "¿Qué es el overfitting?"
})
print(respuesta)

# También podés hacer streaming
for chunk in chain.stream({"dominio": "ml", "pregunta": "Explica backpropagation"}):
    print(chunk, end="", flush=True)
```

### 💻 RAG Chain Completo con LangChain

```python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader

# 1. CARGAR DOCUMENTOS
loader = WebBaseLoader("https://docs.tu-empresa.com/faq")
docs = loader.load()

# 2. DIVIDIR EN CHUNKS
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,      # ~750 palabras por chunk
    chunk_overlap=200,    # Superposición para no perder contexto
    separators=["\n\n", "\n", " ", ""]
)
chunks = splitter.split_documents(docs)

# ¿Por qué dividir en chunks?
# Los embeddings pierden calidad con textos muy largos.
# El overlap garantiza que el contexto no se corte.

# 3. CREAR VECTOR STORE
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(chunks, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# 4. PROMPT RAG
rag_prompt = ChatPromptTemplate.from_template("""
Eres un asistente de atención al cliente.
Responde la pregunta SOLO basándote en el siguiente contexto.
Si no sabes la respuesta, di "No tengo información sobre eso."

CONTEXTO:
{context}

PREGUNTA: {question}

RESPUESTA:""")

# 5. CHAIN RAG COMPLETA
def format_docs(docs):
    return "\n\n---\n\n".join(doc.page_content for doc in docs)

model = ChatOpenAI(model="gpt-4o", temperature=0)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | rag_prompt
    | model
    | StrOutputParser()
)

# 6. USAR
respuesta = rag_chain.invoke("¿Cuál es el horario de atención?")
print(respuesta)
```

### 💾 Memory: Haciendo que el LLM Recuerde

```python
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import ConversationChain

model = ChatOpenAI(model="gpt-4o")

# Solo recuerda las últimas 5 interacciones (para no llenar el contexto)
memory = ConversationBufferWindowMemory(k=5, return_messages=True)

conversation = ConversationChain(
    llm=model,
    memory=memory,
    verbose=True  # Muestra el prompt completo (útil para debug)
)

# Primera vuelta
resp1 = conversation.predict(input="Me llamo Carlos y tengo un startup de logística.")
# → "Hola Carlos! Cuéntame más sobre tu startup..."

# Segunda vuelta - el modelo RECUERDA
resp2 = conversation.predict(input="¿Recuerdas cómo me llamo y a qué me dedico?")
# → "Sí, te llamas Carlos y tenés un startup de logística."

# Ver la memoria almacenada
print(memory.load_memory_variables({}))
```

---

## 🤖 MÓDULO 5: Agentes de IA — La Autonomía {#modulo-5}

### ¿Qué es un Agente?

Un **agente de IA** es un sistema que usa un LLM como "cerebro" para **planificar y ejecutar acciones** de forma autónoma con el objetivo de completar tareas complejas.

La diferencia clave con un LLM normal:

```
LLM NORMAL:
  Input → Proceso → Output (una sola vez)

AGENTE:
  Input → Razona → ¿Necesita info/acción?
                          │
                    ┌─────┴─────┐
                    │    SÍ     │
                    └─────┬─────┘
                          │
                    Llama a una Tool
                          │
                    Recibe resultado
                          │
                    Razona de nuevo
                          │
                    ¿Terminó? ──No──► repetir
                          │
                         Sí
                          │
                       Output final
```

### 🎭 Analogía: El Asistente Ejecutivo Autónomo

Un agente es como un **asistente ejecutivo ultra-capacitado** que:

- Recibe una tarea ambigua ("preparame un reporte de la competencia")
- **Planifica** qué pasos necesita
- **Busca información** en Google, bases de datos, documentos
- **Realiza cálculos** si necesita
- **Redacta** el reporte
- **Verifica** el resultado
- Te entrega el reporte listo

Todo sin que vos lo guíes paso a paso.

### 🧩 Anatomía de un Agente

```
┌──────────────────────────────────────────────────────┐
│                    AGENTE                             │
│                                                       │
│  ┌────────────┐     ┌─────────────┐                  │
│  │  CEREBRO   │     │   MEMORIA   │                  │
│  │   (LLM)    │◄───►│  - Corto    │                  │
│  │            │     │  - Largo    │                  │
│  │ ReAct Loop │     │  - Entidades│                  │
│  └─────┬──────┘     └─────────────┘                  │
│        │                                              │
│        ▼                                              │
│  ┌────────────────────────────────────────────────┐  │
│  │              TOOLBOX (Herramientas)             │  │
│  │  🔍 Search  📊 Calculator  🌐 Web  📁 Files    │  │
│  │  📧 Email   📅 Calendar   🗄️ DB   🔧 API      │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### 🔄 El Ciclo ReAct (Reason + Act)

ReAct es el patrón de razonamiento más usado en agentes:

```
Thought:  "El usuario quiere saber el clima de Buenos Aires.
           Necesito buscar en la API del tiempo."

Action:   buscar_clima
Action Input: {"ciudad": "Buenos Aires"}

Observation: {"temp": 24, "condicion": "soleado", "humedad": 45}

Thought:  "Tengo la información. Ahora puedo responder."

Final Answer: "En Buenos Aires está soleado con 24°C y 45% de humedad."
```

Cada ciclo de Thought-Action-Observation se llama un **"step"** del agente.

### 💻 Tu Primer Agente con LangChain

```python
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_react_agent
from langchain.tools import tool
from langchain_core.prompts import PromptTemplate

# 1. DEFINIR TOOLS
@tool
def calcular(expresion: str) -> str:
    """Calcula expresiones matemáticas. Usa esto para cualquier cálculo."""
    try:
        result = eval(expresion)  # En producción, usar numexpr o sympy
        return str(result)
    except:
        return "Error en el cálculo"

@tool
def buscar_producto(nombre: str) -> str:
    """Busca información de productos en el catálogo de la empresa."""
    # Simulación de base de datos
    catalogo = {
        "laptop pro": {"precio": 1299, "stock": 15, "garantia": "2 años"},
        "mouse inalámbrico": {"precio": 49, "stock": 150, "garantia": "1 año"},
        "monitor 4k": {"precio": 599, "stock": 8, "garantia": "3 años"}
    }
    producto = catalogo.get(nombre.lower(), None)
    if producto:
        return str(producto)
    return f"Producto '{nombre}' no encontrado en el catálogo"

@tool
def enviar_email(destinatario: str, asunto: str, cuerpo: str) -> str:
    """Envía un email al destinatario especificado."""
    # Aquí iría la lógica real de envío
    print(f"[EMAIL ENVIADO] Para: {destinatario} | Asunto: {asunto}")
    return f"Email enviado exitosamente a {destinatario}"

tools = [calcular, buscar_producto, enviar_email]

# 2. CONFIGURAR EL LLM
llm = ChatOpenAI(model="gpt-4o", temperature=0)

# 3. PROMPT DEL AGENTE (template ReAct)
react_prompt = PromptTemplate.from_template("""
Eres un asistente de ventas inteligente y helpful.
Responde siempre en español.
Tienes acceso a las siguientes herramientas:

{tools}

Usa este formato:
Question: la pregunta que debes responder
Thought: qué necesitas hacer
Action: la acción a tomar, debe ser una de [{tool_names}]
Action Input: el input para la acción
Observation: el resultado de la acción
... (puedes repetir Thought/Action/Observation N veces)
Thought: ahora sé la respuesta final
Final Answer: la respuesta final al usuario

Begin!

Question: {input}
Thought: {agent_scratchpad}
""")

# 4. CREAR EL AGENTE
agent = create_react_agent(llm, tools, react_prompt)
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,     # Muestra el razonamiento interno
    max_iterations=5  # Máximo de pasos para evitar loops infinitos
)

# 5. EJECUTAR
resultado = agent_executor.invoke({
    "input": "¿Cuánto cuesta una laptop pro? ¿Y si compro 3, cuánto pagaría en total?"
})
print(resultado["output"])

# El agente internamente hará:
# 1. Thought: Necesito buscar el precio de la laptop
# 2. Action: buscar_producto("laptop pro") → {precio: 1299, ...}
# 3. Thought: Ahora calculo 3 × 1299
# 4. Action: calcular("3 * 1299") → 3897
# 5. Final Answer: "La laptop Pro cuesta $1299. Por 3 unidades pagarías $3897."
```

### 🛠️ Tools: El Superpoder del Agente

Las tools son **funciones que el agente puede llamar**. Son el mecanismo por el cual el agente interactúa con el mundo real.

```python
# Tipos de tools más comunes

# 1. BÚSQUEDA WEB
from langchain_community.tools import DuckDuckGoSearchRun
search = DuckDuckGoSearchRun()

# 2. EJECUCIÓN DE CÓDIGO PYTHON
from langchain_experimental.tools import PythonREPLTool
python_repl = PythonREPLTool()

# 3. INTERACCIÓN CON ARCHIVOS
from langchain_community.tools.file_management import (
    ReadFileTool, WriteFileTool, ListDirectoryTool
)

# 4. BASE DE DATOS SQL
from langchain_community.utilities import SQLDatabase
from langchain_community.tools.sql_database.tool import QuerySQLDataBaseTool
db = SQLDatabase.from_uri("postgresql://user:pass@localhost/mydb")
sql_tool = QuerySQLDataBaseTool(db=db)

# 5. API CUSTOM (estructura)
from langchain.tools import StructuredTool
from pydantic import BaseModel

class CrearTicketInput(BaseModel):
    titulo: str
    descripcion: str
    prioridad: str = "media"

def crear_ticket(titulo: str, descripcion: str, prioridad: str = "media") -> str:
    # Lógica para crear ticket en Jira/Zendesk/etc
    return f"Ticket #{hash(titulo) % 10000} creado: {titulo}"

ticket_tool = StructuredTool.from_function(
    func=crear_ticket,
    name="crear_ticket_soporte",
    description="Crea un ticket de soporte. Úsalo cuando el usuario reporte un problema.",
    args_schema=CrearTicketInput
)
```

---

## 🚀 MÓDULO 6: Patrones Avanzados de Agentes {#modulo-6}

### Patrón 1: Multi-Agent Systems (Sistema Multi-Agente)

Para tareas muy complejas, un solo agente no es suficiente. Los sistemas multi-agente dividen el trabajo:

```
┌─────────────────────────────────────────────────────┐
│                 ORCHESTRATOR AGENT                   │
│           (Coordina y delega tareas)                 │
└───────────┬───────────┬───────────────┬─────────────┘
            │           │               │
            ▼           ▼               ▼
    ┌──────────┐ ┌──────────┐   ┌──────────┐
    │ RESEARCH │ │ ANALYST  │   │ WRITER   │
    │  AGENT   │ │  AGENT   │   │  AGENT   │
    │          │ │          │   │          │
    │ Busca y  │ │ Analiza  │   │ Redacta  │
    │ recolecta│ │ los datos│   │ el informe│
    │  datos   │ │          │   │          │
    └──────────┘ └──────────┘   └──────────┘
```

```python
# Con LangGraph (evolución de LangChain para flujos complejos)
from langgraph.graph import StateGraph, END
from typing import TypedDict, List

class EstadoInvestigacion(TypedDict):
    tema: str
    datos_recolectados: List[str]
    analisis: str
    informe_final: str

def agente_investigador(estado: EstadoInvestigacion) -> EstadoInvestigacion:
    # Busca información sobre el tema
    llm = ChatOpenAI(model="gpt-4o")
    # ... lógica de búsqueda
    return {**estado, "datos_recolectados": ["dato1", "dato2"]}

def agente_analista(estado: EstadoInvestigacion) -> EstadoInvestigacion:
    # Analiza los datos recolectados
    # ...
    return {**estado, "analisis": "El análisis muestra..."}

def agente_escritor(estado: EstadoInvestigacion) -> EstadoInvestigacion:
    # Redacta el informe final
    # ...
    return {**estado, "informe_final": "## Informe..."}

# Construir el grafo de flujo
workflow = StateGraph(EstadoInvestigacion)
workflow.add_node("investigador", agente_investigador)
workflow.add_node("analista", agente_analista)
workflow.add_node("escritor", agente_escritor)

workflow.set_entry_point("investigador")
workflow.add_edge("investigador", "analista")
workflow.add_edge("analista", "escritor")
workflow.add_edge("escritor", END)

app = workflow.compile()
resultado = app.invoke({"tema": "tendencias en IA 2025"})
print(resultado["informe_final"])
```

### Patrón 2: RAG Avanzado (Advanced RAG)

El RAG básico tiene limitaciones. Las técnicas avanzadas mejoran la precisión:

```
RAG BÁSICO:
Query → Embed → Search → Top-K docs → LLM → Answer

RAG AVANZADO:
                    ┌── Query Rewriting (mejorar la query)
                    ├── HyDE (generar doc hipotético para buscar)
Query → Preprocess ┤
                    ├── Step-Back Prompting (abstraer la pregunta)
                    └── Multi-Query (múltiples variantes de la query)
                              │
                              ▼
                    Búsqueda con múltiples estrategias:
                    ├── Dense Retrieval (embeddings)
                    ├── Sparse Retrieval (BM25 keywords)
                    └── Hybrid (combinación)
                              │
                              ▼
                    Reranking (re-ordenar con cross-encoder)
                              │
                              ▼
                    Compresión del contexto
                              │
                              ▼
                    LLM → Answer + fuentes citadas
```

```python
# Ejemplo: HyDE (Hypothetical Document Embeddings)
def rag_con_hyde(query: str, vectorstore) -> str:
    """
    HyDE: En lugar de embeddear la query directamente,
    pedimos al LLM que genere un documento hipotético
    que respondería la query, y buscamos ese documento.

    Por qué funciona: los documentos "respuesta" tienen
    más similitud semántica con otros documentos que
    las preguntas cortas.
    """

    llm = ChatOpenAI(model="gpt-4o", temperature=0)

    # Paso 1: Generar documento hipotético
    hyde_prompt = f"""Escribe un párrafo técnico que respondería esta pregunta:
    "{query}"

    Escribe solo el párrafo, sin introducción."""

    documento_hipotetico = llm.invoke(hyde_prompt).content

    # Paso 2: Buscar usando el documento hipotético (no la query)
    embeddings_model = OpenAIEmbeddings()
    hyde_embedding = embeddings_model.embed_query(documento_hipotetico)

    docs_relevantes = vectorstore.similarity_search_by_vector(
        hyde_embedding, k=4
    )

    # Paso 3: RAG normal con los docs encontrados
    contexto = "\n\n".join(doc.page_content for doc in docs_relevantes)

    respuesta = llm.invoke(f"""
    Contexto: {contexto}

    Pregunta: {query}

    Respuesta basada en el contexto:""").content

    return respuesta
```

### Patrón 3: Evaluación de Agentes

No podés mejorar lo que no medís:

```python
# pip install ragas
from ragas import evaluate
from ragas.metrics import (
    answer_relevancy,    # ¿La respuesta es relevante?
    faithfulness,        # ¿Está basada en el contexto?
    context_recall,      # ¿Recuperó los docs correctos?
    context_precision,   # ¿Los docs recuperados son relevantes?
)

# Dataset de evaluación
dataset = {
    "question": ["¿Cuál es la política de devoluciones?"],
    "answer": ["Podés devolver en 30 días"],
    "contexts": [["Devoluciones hasta 30 días...", "Garantía 2 años..."]],
    "ground_truth": ["Las devoluciones se aceptan hasta 30 días"]
}

resultado = evaluate(
    dataset,
    metrics=[answer_relevancy, faithfulness, context_recall, context_precision]
)

print(resultado)
# answer_relevancy    0.92
# faithfulness        0.88
# context_recall      0.95
# context_precision   0.87
```

### Patrón 4: Guardrails y Control de Calidad

```python
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field, validator

class RespuestaControlada(BaseModel):
    respuesta: str = Field(description="La respuesta al usuario")
    confianza: float = Field(description="Confianza del 0 al 1", ge=0, le=1)
    fuentes: list[str] = Field(description="Fuentes usadas")
    requiere_humano: bool = Field(
        description="True si la consulta requiere atención humana"
    )

    @validator('respuesta')
    def no_inventar(cls, v):
        frases_problematicas = ["no estoy seguro pero", "creo que", "tal vez"]
        for frase in frases_problematicas:
            if frase in v.lower():
                raise ValueError("Respuesta contiene incertidumbre sin fuente")
        return v

parser = PydanticOutputParser(pydantic_object=RespuestaControlada)

prompt = ChatPromptTemplate.from_template("""
Responde la consulta del cliente SOLO basándote en el contexto dado.
Si no tenés información suficiente, indica que requiere atención humana.

Contexto: {contexto}
Consulta: {consulta}

{format_instructions}
""")

chain = prompt | ChatOpenAI(model="gpt-4o") | parser

try:
    resultado = chain.invoke({
        "contexto": "Devoluciones: 30 días. Garantía: 2 años.",
        "consulta": "¿Puedo devolver un producto de hace 3 semanas?",
        "format_instructions": parser.get_format_instructions()
    })

    if resultado.requiere_humano:
        escalar_a_humano(resultado)
    elif resultado.confianza < 0.7:
        pedir_confirmacion(resultado)
    else:
        enviar_respuesta(resultado.respuesta)

except Exception as e:
    # Fallback a respuesta segura
    enviar_respuesta("Por favor contactá a nuestro equipo de soporte.")
```

---

## 💰 MÓDULO 7: Proyectos Reales para Monetizar {#modulo-7}

### 🎯 La Brecha del Mercado

El mercado de IA está en un momento único:

- Las empresas **quieren** automatizar con IA
- Pocas tienen el **conocimiento interno** para hacerlo
- Los que pueden construirlo pueden **cobrar muy bien**

```
DEMANDA DE IA:     ████████████████████  100%
OFERTA DE EXPERTOS: ████░░░░░░░░░░░░░░░   20%

GAP = TU OPORTUNIDAD
```

### 📦 PROYECTO 1: RAG Chatbot para Empresas

**Descripción:** Un chatbot que responde preguntas basándose en la documentación interna de la empresa.

**Casos de uso reales:**

- Atención al cliente 24/7
- HR Bot (políticas, beneficios, onboarding)
- IT Helpdesk automatizado
- FAQ inteligente

**Stack técnico:**

```
Frontend:   Streamlit / Next.js / React
Backend:    FastAPI + LangChain
Vector DB:  Pinecone / Chroma
LLM:        GPT-4o / Claude
Deploy:     AWS / Railway / Render
```

**Arquitectura:**

```
Usuario
  │
  ▼
┌──────────┐      ┌──────────┐      ┌──────────┐
│ Frontend │─────►│ API      │─────►│ RAG      │
│(Chat UI) │      │(FastAPI) │      │ Chain    │
└──────────┘      └────┬─────┘      └────┬─────┘
                       │                 │
                       │          ┌──────┴──────┐
                       │          │  Vector DB  │
                       │          │  (Pinecone) │
                       │          └─────────────┘
                       │
                  ┌────┴─────┐
                  │   LLM    │
                  │  (GPT-4) │
                  └──────────┘
```

**Código base del backend:**

```python
# main.py - FastAPI Backend
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain.chains import RetrievalQA
import os

app = FastAPI(title="RAG Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar componentes
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = PineconeVectorStore(
    index_name=os.getenv("PINECONE_INDEX"),
    embedding=embeddings
)

class ChatRequest(BaseModel):
    pregunta: str
    session_id: str = "default"

class ChatResponse(BaseModel):
    respuesta: str
    fuentes: list[str]
    tokens_usados: int

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        llm = ChatOpenAI(model="gpt-4o", temperature=0)

        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vectorstore.as_retriever(search_kwargs={"k": 4}),
            return_source_documents=True
        )

        result = qa_chain.invoke({"query": request.pregunta})

        fuentes = list(set([
            doc.metadata.get("source", "unknown")
            for doc in result["source_documents"]
        ]))

        return ChatResponse(
            respuesta=result["result"],
            fuentes=fuentes,
            tokens_usados=0  # Implementar token counting
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ingest")
async def ingest_document(url: str):
    """Endpoint para agregar nuevos documentos al knowledge base."""
    from langchain_community.document_loaders import WebBaseLoader
    from langchain.text_splitter import RecursiveCharacterTextSplitter

    loader = WebBaseLoader(url)
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(docs)

    vectorstore.add_documents(chunks)
    return {"mensaje": f"{len(chunks)} chunks indexados exitosamente"}
```

**Modelo de precio sugerido:**

- Setup + configuración: $2,000 - $5,000
- Mantenimiento mensual: $500 - $2,000
- Por volumen de consultas: $0.01 - $0.05 por consulta

---

### 📦 PROYECTO 2: Agente de Análisis Financiero

**Descripción:** Un agente que analiza datos financieros, busca noticias, y genera reportes automáticos.

```python
from langchain_openai import ChatOpenAI
from langchain.agents import create_openai_tools_agent, AgentExecutor
from langchain.tools import tool
import yfinance as yf
import requests

@tool
def obtener_precio_accion(ticker: str) -> str:
    """Obtiene el precio actual y métricas de una acción por su ticker (ej: AAPL, GOOGL)."""
    stock = yf.Ticker(ticker)
    info = stock.info
    hist = stock.history(period="1mo")

    return f"""
    Empresa: {info.get('longName', ticker)}
    Precio actual: ${info.get('currentPrice', 'N/A')}
    P/E Ratio: {info.get('trailingPE', 'N/A')}
    Market Cap: ${info.get('marketCap', 0) / 1e9:.1f}B
    Variación 1 mes: {((hist['Close'][-1] - hist['Close'][0]) / hist['Close'][0] * 100):.2f}%
    """

@tool
def buscar_noticias_empresa(empresa: str) -> str:
    """Busca noticias recientes sobre una empresa."""
    # Usar NewsAPI, GDELT, o similar
    # Aquí va la integración real
    return f"Noticias recientes sobre {empresa}: [implementar con NewsAPI]"

@tool
def calcular_metricas(datos: str) -> str:
    """Realiza cálculos financieros. Puede calcular ratios, retornos, etc."""
    try:
        resultado = eval(datos)
        return str(resultado)
    except:
        return "Error en el cálculo"

tools = [obtener_precio_accion, buscar_noticias_empresa, calcular_metricas]

llm = ChatOpenAI(model="gpt-4o", temperature=0)

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

prompt = ChatPromptTemplate.from_messages([
    ("system", """Eres un analista financiero experto.
    Analizas datos con rigor y das recomendaciones basadas en datos.
    Siempre citas las fuentes y aclarás los riesgos.
    Respondes en español."""),
    MessagesPlaceholder(variable_name="chat_history"),
    ("user", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

agent = create_openai_tools_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# Usar el agente
respuesta = agent_executor.invoke({
    "input": "Analiza Apple (AAPL) y dime si es buena inversión ahora.",
    "chat_history": []
})
print(respuesta["output"])
```

---

### 📦 PROYECTO 3: Agente de Generación de Contenido

**Descripción:** Automatiza la creación de contenido para redes sociales, blogs, newsletters.

```
WORKFLOW AUTOMATIZADO:

Tema o keyword
    │
    ▼
Research Agent → Busca info actualizada en web
    │
    ▼
Writer Agent → Escribe el contenido
    │
    ▼
SEO Agent → Optimiza para keywords
    │
    ▼
Social Agent → Adapta para cada red social
    │
    ├── Twitter/X thread
    ├── LinkedIn post
    ├── Instagram caption
    └── Newsletter paragraph
```

**Precio de mercado:** $500-$3,000/mes por empresa

---

### 📦 PROYECTO 4: Pipeline de Procesamiento de Documentos

**Descripción:** Extrae, estructura y procesa documentos en escala (facturas, contratos, CV, etc.)

```python
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import Optional
import base64

class DatosFactura(BaseModel):
    numero_factura: str = Field(description="Número o ID de la factura")
    fecha: str = Field(description="Fecha de emisión (formato YYYY-MM-DD)")
    emisor: str = Field(description="Nombre de la empresa emisora")
    receptor: str = Field(description="Nombre del receptor")
    subtotal: float = Field(description="Subtotal sin impuestos")
    impuestos: float = Field(description="Monto de impuestos")
    total: float = Field(description="Total final")
    items: list[dict] = Field(description="Lista de items con descripción y precio")
    moneda: str = Field(description="Moneda (USD, ARS, EUR, etc.)")

parser = PydanticOutputParser(pydantic_object=DatosFactura)

def procesar_factura(imagen_path: str) -> DatosFactura:
    """Extrae datos estructurados de una imagen de factura."""

    # Leer imagen en base64
    with open(imagen_path, "rb") as f:
        imagen_b64 = base64.b64encode(f.read()).decode()

    llm = ChatOpenAI(model="gpt-4o", temperature=0)

    mensaje = {
        "role": "user",
        "content": [
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{imagen_b64}",
                    "detail": "high"
                }
            },
            {
                "type": "text",
                "text": f"""Extrae todos los datos de esta factura.
                {parser.get_format_instructions()}"""
            }
        ]
    }

    respuesta = llm.invoke([mensaje])
    return parser.parse(respuesta.content)

# Procesar múltiples facturas
import os
from pathlib import Path

def procesar_directorio(directorio: str) -> list[DatosFactura]:
    resultados = []
    for archivo in Path(directorio).glob("*.jpg"):
        try:
            factura = procesar_factura(str(archivo))
            resultados.append(factura)
            print(f"✓ {archivo.name}: ${factura.total}")
        except Exception as e:
            print(f"✗ {archivo.name}: Error - {e}")
    return resultados
```

**Valor de mercado:**

- Ahorro de 2-5 horas/día de trabajo manual
- Precio: $1,000-$5,000 setup + $200-$1,000/mes

---

### 📦 PROYECTO 5: Sales Intelligence Agent

**El más lucrativo:** Un agente que ayuda a equipos de ventas con inteligencia sobre prospects.

```
INPUTS:
  - Nombre/empresa del prospect
  - LinkedIn URL
  - Sitio web de la empresa

OUTPUTS:
  - Resumen del perfil del prospect
  - Pain points potenciales
  - Ángulos de pitch personalizados
  - Emails de outreach generados
  - Preguntas de calificación sugeridas
  - Score de fit con tu producto
```

**Precio:** $200-$500/usuario/mes → SaaS con ARR de $100k+ con 50 usuarios

---

### 💡 Framework para Monetizar tu Conocimiento

```
ESTRATEGIA DE MONETIZACIÓN EN 4 FASES:

FASE 1 (0-3 meses): APRENDER + CONSTRUIR
  └── Construir los 5 proyectos anteriores
  └── Crear tu portfolio en GitHub
  └── Documentar aprendizajes en blog/LinkedIn

FASE 2 (3-6 meses): PRIMEROS CLIENTES
  └── Ofrecer servicios freelance (Upwork, LinkedIn, network)
  └── Precio: $50-150/hora
  └── Enfocarse en 1 industria para especializarse

FASE 3 (6-12 meses): PRODUCTIZAR
  └── Identificar el proyecto más demandado
  └── Construirlo como SaaS/producto
  └── Precio: $99-$999/mes por empresa

FASE 4 (12+ meses): ESCALAR
  └── Contenido educativo (curso, YouTube, newsletter)
  └── Agencia especializada en IA
  └── Consultoría estratégica ($5,000+/proyecto)
```

---

## 📚 CHEAT SHEET & RECURSOS {#recursos}

### 🗺️ Diagrama Final: Todo Junto

```
╔══════════════════════════════════════════════════════════════════╗
║                    STACK COMPLETO DE AGENTES IA                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  INFRAESTRUCTURA                                                 ║
║  ┌────────────┐  ┌────────────┐  ┌────────────┐                ║
║  │   OpenAI   │  │ Anthropic  │  │  Google    │  ← LLMs         ║
║  │  GPT-4o    │  │  Claude    │  │  Gemini    │                 ║
║  └────────────┘  └────────────┘  └────────────┘                ║
║                                                                  ║
║  ┌────────────┐  ┌────────────┐  ┌────────────┐                ║
║  │  Pinecone  │  │   Chroma   │  │  Weaviate  │  ← Vector DBs  ║
║  └────────────┘  └────────────┘  └────────────┘                ║
║                                                                  ║
║  ORQUESTACIÓN                                                    ║
║  ┌─────────────────────────────────────────────────────────┐   ║
║  │  LangChain / LangGraph / LlamaIndex / AutoGen           │   ║
║  └─────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  DEPLOYMENT                                                      ║
║  ┌────────────┐  ┌────────────┐  ┌────────────┐                ║
║  │  FastAPI   │  │ Streamlit  │  │   Docker   │  ← Backend      ║
║  └────────────┘  └────────────┘  └────────────┘                ║
║                                                                  ║
║  MONITORING                                                      ║
║  ┌────────────┐  ┌────────────┐                                 ║
║  │ LangSmith  │  │   Ragas    │  ← Observabilidad + Eval        ║
║  └────────────┘  └────────────┘                                 ║
╚══════════════════════════════════════════════════════════════════╝
```

### ⚡ Guía Rápida de Decisiones

```
¿Qué usar cuándo?

TAREA                          →  HERRAMIENTA
─────────────────────────────────────────────────────────
Respuesta simple de LLM        →  ChatOpenAI + StrOutputParser
Output estructurado            →  PydanticOutputParser
Buscar en documentos           →  RAG con VectorStore
Múltiples pasos / tools        →  Agent + AgentExecutor
Flujo complejo condicional     →  LangGraph
Memoria corta                  →  ConversationBufferWindowMemory
Memoria larga                  →  VectorStoreRetrieverMemory
Escala pequeña                 →  Chroma (local)
Producción                     →  Pinecone / Qdrant
Modelos locales (privacidad)   →  Ollama + LangChain
Evaluación del sistema         →  RAGAS
Monitoreo en producción        →  LangSmith
```

### 📋 Checklist para Todo Proyecto de Agente

```
ANTES DE CONSTRUIR:
  □ ¿Está bien definida la tarea?
  □ ¿Qué tools necesita el agente?
  □ ¿Qué datos necesita acceder?
  □ ¿Cuál es el criterio de éxito?

DURANTE EL DESARROLLO:
  □ Definir system prompt claro
  □ Implementar guardrails básicos
  □ Agregar logging detallado
  □ Definir max_iterations para evitar loops
  □ Implementar fallbacks

ANTES DE PRODUCCIÓN:
  □ Evaluar con RAGAS o similar
  □ Testear casos edge
  □ Rate limiting implementado
  □ Costos monitoreados
  □ PII/datos sensibles protegidos
  □ Logging habilitado

EN PRODUCCIÓN:
  □ Monitoreo de latencia
  □ Alertas de costo
  □ Feedback loop con usuarios
  □ A/B testing de prompts
```

### 📚 Recursos para Seguir Aprendiendo

#### Documentación Oficial

- **LangChain Docs:** https://python.langchain.com/docs/
- **LangGraph:** https://langchain-ai.github.io/langgraph/
- **OpenAI Cookbook:** https://cookbook.openai.com/
- **Anthropic Docs:** https://docs.anthropic.com/

#### Papers Fundamentales

- **"Attention Is All You Need"** (2017) - Transformer original
- **"ReAct: Synergizing Reasoning and Acting"** (2023) - Base de agentes
- **"Retrieval-Augmented Generation"** (2020) - Base de RAG
- **"Chain-of-Thought Prompting"** (2022) - CoT reasoning

#### Cursos Recomendados

- DeepLearning.AI: "LangChain for LLM Application Development"
- DeepLearning.AI: "Building Systems with the ChatGPT API"
- DeepLearning.AI: "LangChain: Chat with Your Data"
- Fast.ai: Practical Deep Learning

#### Comunidades

- **r/LocalLLaMA** - Modelos locales
- **LangChain Discord** - Soporte y comunidad
- **Hugging Face** - Models, datasets, spaces
- **Papers With Code** - Últimos avances

### 💰 Stack Mínimo Viable para Empezar (con costos)

```
NIVEL BÁSICO (0-$20/mes):
  ├── OpenAI API: ~$10/mes (desarrollo)
  ├── Chroma: Gratis (local)
  └── Python + LangChain: Gratis

NIVEL PROFESIONAL ($50-$200/mes):
  ├── OpenAI API: ~$50/mes
  ├── Pinecone (starter): Gratis → $70/mes
  ├── Railway/Render (deploy): $10-$20/mes
  └── LangSmith: Gratis (dev tier)

NIVEL PRODUCCIÓN ($500-$2,000/mes):
  ├── OpenAI API (alto volumen): $200-$500/mes
  ├── Pinecone Standard: $70-$200/mes
  ├── AWS/GCP/Azure: $100-$500/mes
  ├── Monitoreo: $50-$200/mes
  └── Varios: $100-$500/mes
```

---

## 🎓 RESUMEN EJECUTIVO

Si tuvieras que quedarte con 5 conceptos de toda esta guía:

1. **LLMs = Predicción de siguiente token** que emergió como razonamiento general. Dominás los LLMs dominando los prompts.

2. **Embeddings = GPS del significado.** Permiten que las computadoras "entiendan" semántica y busquen por significado, no por palabras.

3. **Vector DBs = Memoria externa del LLM.** Solucionan el problema de la context window limitada mediante búsqueda semántica eficiente.

4. **LangChain = Pegamento.** Conecta LLMs, embeddings, vector DBs, tools y memoria en aplicaciones complejas con pocas líneas de código.

5. **Agentes = LLMs con autonomía.** Usan herramientas, planifican múltiples pasos, y completan tareas complejas sin intervención humana.

**La fórmula del éxito:**

```
Conocimiento técnico (esta guía)
       +
Proyectos reales (los 5 de monetización)
       +
Nicho específico (1 industria / problema)
       =
Experto bien pagado en IA
```

---

_Masterclass creada con el objetivo de llevarte de cero a experto aplicable en el mercado real._  
_Versión 1.0 — Actualizado a stack 2025_
