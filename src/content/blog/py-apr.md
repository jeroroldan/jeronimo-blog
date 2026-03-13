---
title: "Python y Librerías para Agentes de IA"
description: "Guía completa: instalación, snippets y casos de uso reales"
pubDate: 2026-03-13
code: "py-apr"
image: "/images/blog/py-apr.jpg"
---

# 🐍 Python y Librerías para Agentes de IA

### Guía completa: instalación, snippets y casos de uso reales

> **Objetivo:** Tener a mano todas las librerías necesarias para construir agentes de IA, con código listo para copiar y usar.

---

## 📋 TABLA DE CONTENIDOS

1. [Stack Completo de un Vistazo](#stack)
2. [Instalación Rápida](#instalacion)
3. [LLMs y APIs](#llms)
4. [Embeddings](#embeddings)
5. [Vector Databases](#vectordb)
6. [LangChain y Orquestación](#langchain)
7. [Frameworks de Agentes](#agentes)
8. [Procesamiento de Datos](#datos)
9. [Deploy y APIs](#deploy)
10. [Evaluación y Monitoreo](#eval)
11. [Configuración del Entorno](#entorno)
12. [requirements.txt por Proyecto](#requirements)

---

## 🗺️ STACK COMPLETO DE UN VISTAZO {#stack}

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPA             │  LIBRERÍAS                                   │
├─────────────────────────────────────────────────────────────────┤
│  Agentes          │  langgraph · autogen · crewai               │
│  Orquestación     │  langchain · llama-index · haystack         │
│  Vector DB        │  chromadb · pinecone · qdrant · faiss       │
│  Embeddings       │  openai · sentence-transformers · cohere    │
│  LLMs             │  openai · anthropic · google-generativeai  │
│                   │  ollama · groq · together                   │
│  Datos            │  pydantic · pypdf · beautifulsoup4 · pandas │
│  Deploy           │  fastapi · streamlit · gradio · uvicorn     │
│  Eval / Monitor   │  ragas · langsmith · arize-phoenix          │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ INSTALACIÓN RÁPIDA {#instalacion}

### Instalación completa (todo en una línea)

```bash
pip install openai anthropic langchain langchain-openai langchain-community \
    langchain-anthropic chromadb pinecone-client sentence-transformers \
    fastapi uvicorn streamlit pydantic python-dotenv pypdf \
    beautifulsoup4 requests ragas langgraph google-generativeai \
    ollama groq cohere qdrant-client
```

### Instalación mínima para empezar

```bash
pip install openai langchain langchain-openai chromadb python-dotenv
```

### Entorno virtual (siempre recomendado)

```bash
# Crear entorno
python -m venv venv_agentes

# Activar (Linux/Mac)
source venv_agentes/bin/activate

# Activar (Windows)
venv_agentes\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

---

## 🤖 LLMs Y APIs {#llms}

### 1. OpenAI (`openai`)

```bash
pip install openai
```

El cliente más usado del ecosistema. Acceso a GPT-4o, GPT-4o-mini, y generación de embeddings.

```python
from openai import OpenAI

client = OpenAI(api_key="sk-...")  # o usar variable de entorno OPENAI_API_KEY

# ─── Chat básico ───────────────────────────────────────────────
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "Eres un experto en Python."},
        {"role": "user",   "content": "¿Qué es un decorador?"}
    ],
    temperature=0.7,
    max_tokens=500
)
print(response.choices[0].message.content)
print(f"Tokens usados: {response.usage.total_tokens}")

# ─── Streaming ─────────────────────────────────────────────────
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Explica recursión"}],
    stream=True
)
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)

# ─── Structured Output con JSON ─────────────────────────────────
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Dame datos de una persona ficticia"}],
    response_format={"type": "json_object"}
)
import json
datos = json.loads(response.choices[0].message.content)

# ─── Embeddings ─────────────────────────────────────────────────
embed_response = client.embeddings.create(
    model="text-embedding-3-small",  # 1536 dimensiones, más barato
    # model="text-embedding-3-large",  # 3072 dimensiones, más preciso
    input="texto a convertir en vector"
)
vector = embed_response.data[0].embedding  # lista de 1536 floats

# ─── Visión (imagen + texto) ─────────────────────────────────────
import base64
with open("imagen.jpg", "rb") as f:
    img_b64 = base64.b64encode(f.read()).decode()

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "user",
        "content": [
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}},
            {"type": "text", "text": "¿Qué hay en esta imagen?"}
        ]
    }]
)
```

**Modelos disponibles:**

| Modelo      | Velocidad | Calidad        | Precio |
| ----------- | --------- | -------------- | ------ |
| gpt-4o      | media     | muy alta       | $$$    |
| gpt-4o-mini | alta      | alta           | $      |
| o1          | lenta     | razonamiento++ | $$$$   |
| o1-mini     | media     | razonamiento   | $$     |

---

### 2. Anthropic (`anthropic`)

```bash
pip install anthropic
```

SDK para Claude. Ventana de contexto de 200k tokens, excelente para análisis de documentos largos.

```python
from anthropic import Anthropic

client = Anthropic(api_key="sk-ant-...")  # o ANTHROPIC_API_KEY

# ─── Chat básico ───────────────────────────────────────────────
message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    system="Eres un analista de negocios experto.",
    messages=[
        {"role": "user", "content": "Analiza este mercado: SaaS de RRHH en LATAM"}
    ]
)
print(message.content[0].text)
print(f"Input tokens:  {message.usage.input_tokens}")
print(f"Output tokens: {message.usage.output_tokens}")

# ─── Streaming ─────────────────────────────────────────────────
with client.messages.stream(
    model="claude-3-5-sonnet-20241022",
    max_tokens=500,
    messages=[{"role": "user", "content": "Escribe un plan de negocios"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

# ─── Conversación multi-turno ───────────────────────────────────
historial = []

def chat(mensaje: str) -> str:
    historial.append({"role": "user", "content": mensaje})
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=historial
    )
    respuesta = response.content[0].text
    historial.append({"role": "assistant", "content": respuesta})
    return respuesta

print(chat("Me llamo Carlos y tengo un startup"))
print(chat("¿Recordás cómo me llamo?"))  # → "Sí, te llamas Carlos..."
```

**Modelos Claude:**

| Modelo                     | Contexto | Uso                       |
| -------------------------- | -------- | ------------------------- |
| claude-3-5-sonnet-20241022 | 200k     | Balance calidad/velocidad |
| claude-3-5-haiku-20241022  | 200k     | Rápido y económico        |
| claude-3-opus-20240229     | 200k     | Máxima calidad            |

---

### 3. Google Generative AI (`google-generativeai`)

```bash
pip install google-generativeai
```

Acceso a Gemini con contexto de hasta 1 millón de tokens.

```python
import google.generativeai as genai

genai.configure(api_key="AIza...")  # o GOOGLE_API_KEY

model = genai.GenerativeModel("gemini-1.5-pro")

# ─── Chat básico ───────────────────────────────────────────────
response = model.generate_content("Explica cómo funciona RAG")
print(response.text)

# ─── Con imagen ─────────────────────────────────────────────────
import PIL.Image
img = PIL.Image.open("factura.jpg")
response = model.generate_content([img, "Extraé los datos de esta factura"])
print(response.text)

# ─── Chat con historial ─────────────────────────────────────────
chat = model.start_chat(history=[])
r1 = chat.send_message("Hola, soy un desarrollador Python")
r2 = chat.send_message("¿Qué librería me recomendás para hacer scraping?")
print(r2.text)

# ─── Streaming ─────────────────────────────────────────────────
for chunk in model.generate_content("Contame una historia", stream=True):
    print(chunk.text, end="", flush=True)
```

---

### 4. Ollama (`ollama`) — Modelos Locales

```bash
pip install ollama
# También instalar Ollama Desktop: https://ollama.ai
```

Corre LLMs 100% local. Sin costo por token, ideal para datos privados.

```python
import ollama

# ─── Primero descargar el modelo (una sola vez) ─────────────────
# En terminal: ollama pull llama3.2
# En terminal: ollama pull mistral
# En terminal: ollama pull codellama

# ─── Chat local ─────────────────────────────────────────────────
response = ollama.chat(
    model="llama3.2",
    messages=[{"role": "user", "content": "¿Qué es machine learning?"}]
)
print(response["message"]["content"])

# ─── Embeddings locales ─────────────────────────────────────────
embedding = ollama.embeddings(
    model="nomic-embed-text",  # ollama pull nomic-embed-text
    prompt="texto a embeddear"
)
vector = embedding["embedding"]

# ─── Compatible con cliente OpenAI ──────────────────────────────
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"  # puede ser cualquier string
)

response = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "Hola!"}]
)
```

**Modelos recomendados para agentes:**

| Modelo           | Tamaño  | Uso                     |
| ---------------- | ------- | ----------------------- |
| llama3.2         | 2B/3B   | Rápido, general         |
| llama3.1         | 8B/70B  | Mejor calidad           |
| mistral          | 7B      | Excelente instrucciones |
| codellama        | 7B/13B  | Código                  |
| nomic-embed-text | pequeño | Embeddings              |

---

### 5. Groq (`groq`) — Inferencia Ultra Rápida

```bash
pip install groq
```

~300 tokens/segundo con hardware LPU. Ideal para chatbots en tiempo real.

```python
from groq import Groq

client = Groq(api_key="gsk_...")  # o GROQ_API_KEY

# ─── Chat ───────────────────────────────────────────────────────
chat = client.chat.completions.create(
    messages=[
        {"role": "system", "content": "Eres un asistente útil."},
        {"role": "user",   "content": "Explicame qué son los transformers"}
    ],
    model="llama-3.3-70b-versatile",
    temperature=0.5,
    max_tokens=1024,
)
print(chat.choices[0].message.content)

# ─── Modelos disponibles en Groq ────────────────────────────────
# llama-3.3-70b-versatile  → mejor calidad
# llama-3.1-8b-instant     → más rápido
# mixtral-8x7b-32768       → contexto largo
# gemma2-9b-it             → Google Gemma
```

---

## 🔢 EMBEDDINGS {#embeddings}

### Sentence Transformers (`sentence-transformers`)

```bash
pip install sentence-transformers
```

Embeddings open-source de alta calidad que corren localmente. Gratis, sin límite de uso.

```python
from sentence_transformers import SentenceTransformer
import numpy as np

# ─── Cargar modelo ──────────────────────────────────────────────
# Modelos recomendados:
# "all-MiniLM-L6-v2"    → 384 dims, rápido
# "all-mpnet-base-v2"   → 768 dims, más preciso
# "BAAI/bge-large-en-v1.5" → 1024 dims, SOTA
# "paraphrase-multilingual-MiniLM-L12-v2" → multilingüe

model = SentenceTransformer("all-MiniLM-L6-v2")

# ─── Embeddear textos ───────────────────────────────────────────
sentences = [
    "El perro jugaba en el parque",
    "El can corría por la plaza",
    "El auto circulaba por la ruta"
]
embeddings = model.encode(sentences)  # shape: (3, 384)

# ─── Similitud coseno ────────────────────────────────────────────
from sklearn.metrics.pairwise import cosine_similarity

sim_matrix = cosine_similarity(embeddings)
print(f"Perro vs Can:    {sim_matrix[0][1]:.3f}")  # ≈ 0.85 (similar)
print(f"Perro vs Auto:   {sim_matrix[0][2]:.3f}")  # ≈ 0.15 (distinto)

# ─── Búsqueda semántica ──────────────────────────────────────────
from sentence_transformers import util

query = "animal jugando al aire libre"
query_embed = model.encode(query)
docs_embeds = model.encode(sentences)

scores = util.cos_sim(query_embed, docs_embeds)[0]
ranked = sorted(zip(scores, sentences), reverse=True)

for score, sentence in ranked:
    print(f"[{score:.3f}] {sentence}")

# ─── Batch encoding (más eficiente) ─────────────────────────────
large_docs = ["doc " + str(i) for i in range(1000)]
embeddings = model.encode(
    large_docs,
    batch_size=64,
    show_progress_bar=True,
    convert_to_numpy=True
)
```

---

## 🗄️ VECTOR DATABASES {#vectordb}

### 1. ChromaDB (`chromadb`) — Local/Dev

```bash
pip install chromadb
```

```python
import chromadb
from openai import OpenAI

# ─── Cliente en memoria (temporal) ──────────────────────────────
client = chromadb.Client()

# ─── Cliente persistente en disco ───────────────────────────────
client = chromadb.PersistentClient(path="./mi_chroma_db")

# ─── Crear colección ────────────────────────────────────────────
collection = client.create_collection(
    name="documentos_empresa",
    metadata={"hnsw:space": "cosine"}  # cosine | l2 | ip
)

# ─── Insertar documentos con embeddings ─────────────────────────
openai_client = OpenAI()

documentos = [
    "La garantía es de 2 años desde la compra.",
    "Las devoluciones se aceptan hasta 30 días.",
    "El envío estándar tarda 5-7 días hábiles.",
    "Aceptamos tarjeta, transferencia y MercadoPago.",
]

# Generar embeddings con OpenAI
embeddings = []
for doc in documentos:
    r = openai_client.embeddings.create(model="text-embedding-3-small", input=doc)
    embeddings.append(r.data[0].embedding)

collection.add(
    embeddings=embeddings,
    documents=documentos,
    metadatas=[
        {"categoria": "garantia"},
        {"categoria": "devoluciones"},
        {"categoria": "envios"},
        {"categoria": "pagos"}
    ],
    ids=["doc_001", "doc_002", "doc_003", "doc_004"]
)

# ─── Buscar ─────────────────────────────────────────────────────
query = "¿Cuánto tiempo tengo para devolver un producto?"
query_embed = openai_client.embeddings.create(
    model="text-embedding-3-small", input=query
).data[0].embedding

results = collection.query(
    query_embeddings=[query_embed],
    n_results=2,
    where={"categoria": "devoluciones"},  # filtro opcional
    include=["documents", "distances", "metadatas"]
)

for doc, dist in zip(results["documents"][0], results["distances"][0]):
    print(f"[distancia: {dist:.3f}] {doc}")

# ─── Actualizar y borrar ─────────────────────────────────────────
collection.update(ids=["doc_001"], documents=["Garantía de 3 años."])
collection.delete(ids=["doc_004"])

# ─── Stats ──────────────────────────────────────────────────────
print(f"Total documentos: {collection.count()}")
```

---

### 2. Pinecone (`pinecone-client`) — Producción Cloud

```bash
pip install pinecone-client
```

```python
from pinecone import Pinecone, ServerlessSpec

pc = Pinecone(api_key="pcsk_...")  # o PINECONE_API_KEY

# ─── Crear índice (una sola vez) ─────────────────────────────────
pc.create_index(
    name="mi-empresa",
    dimension=1536,              # dimensiones de text-embedding-3-small
    metric="cosine",             # cosine | euclidean | dotproduct
    spec=ServerlessSpec(
        cloud="aws",
        region="us-east-1"
    )
)

index = pc.Index("mi-empresa")

# ─── Insertar vectores ───────────────────────────────────────────
vectors = [
    {
        "id": "doc_001",
        "values": [0.1, 0.2, ...],  # lista de 1536 floats
        "metadata": {
            "texto": "La garantía es de 2 años",
            "categoria": "garantia",
            "fecha": "2024-01-15"
        }
    }
]

index.upsert(vectors=vectors, namespace="produccion")

# ─── Buscar ─────────────────────────────────────────────────────
results = index.query(
    vector=query_embedding,         # lista de 1536 floats
    top_k=5,
    filter={"categoria": "envios"}, # filtro por metadata
    include_metadata=True,
    namespace="produccion"
)

for match in results.matches:
    print(f"Score: {match.score:.3f} | {match.metadata['texto']}")

# ─── Stats e info ────────────────────────────────────────────────
stats = index.describe_index_stats()
print(f"Total vectores: {stats.total_vector_count}")
```

---

### 3. Qdrant (`qdrant-client`) — Self-hosted/Cloud

```bash
pip install qdrant-client
# Docker: docker run -p 6333:6333 qdrant/qdrant
```

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

# ─── Local (en memoria) ─────────────────────────────────────────
client = QdrantClient(":memory:")

# ─── Docker local ────────────────────────────────────────────────
client = QdrantClient(host="localhost", port=6333)

# ─── Cloud ───────────────────────────────────────────────────────
client = QdrantClient(
    url="https://xyz.qdrant.io",
    api_key="tu-api-key"
)

# ─── Crear colección ────────────────────────────────────────────
client.create_collection(
    collection_name="documentos",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
)

# ─── Insertar ────────────────────────────────────────────────────
client.upsert(
    collection_name="documentos",
    points=[
        PointStruct(
            id=1,
            vector=[0.1, 0.2, ...],  # 1536 floats
            payload={"texto": "Garantía 2 años", "cat": "garantia"}
        )
    ]
)

# ─── Buscar ─────────────────────────────────────────────────────
from qdrant_client.models import Filter, FieldCondition, MatchValue

results = client.search(
    collection_name="documentos",
    query_vector=query_embedding,
    query_filter=Filter(
        must=[FieldCondition(key="cat", match=MatchValue(value="garantia"))]
    ),
    limit=5,
    with_payload=True
)

for r in results:
    print(f"Score: {r.score:.3f} | {r.payload['texto']}")
```

---

### 4. FAISS (`faiss-cpu`) — Librería Pura, Alta Performance

```bash
pip install faiss-cpu
# GPU: pip install faiss-gpu
```

```python
import faiss
import numpy as np

dimension = 1536

# ─── Índices disponibles ─────────────────────────────────────────
# IndexFlatL2       → búsqueda exacta, lenta pero precisa
# IndexFlatIP       → producto interno (para coseno, normalizar antes)
# IndexIVFFlat      → aproximado, mucho más rápido
# IndexHNSWFlat     → grafo jerárquico, muy rápido

# ─── Crear índice básico ─────────────────────────────────────────
index = faiss.IndexFlatIP(dimension)  # Inner Product ≈ coseno si normalizados

# Normalizar para similitud coseno
def normalize(vectors: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    return vectors / norms

# ─── Agregar vectores ────────────────────────────────────────────
embeddings = np.random.rand(1000, dimension).astype("float32")
embeddings = normalize(embeddings)
index.add(embeddings)
print(f"Total en índice: {index.ntotal}")

# ─── Buscar ─────────────────────────────────────────────────────
query = normalize(np.random.rand(1, dimension).astype("float32"))
k = 5  # top-k resultados

distances, indices = index.search(query, k)
print(f"Índices más cercanos: {indices[0]}")
print(f"Distancias: {distances[0]}")

# ─── Guardar y cargar ────────────────────────────────────────────
faiss.write_index(index, "mi_indice.faiss")
index_cargado = faiss.read_index("mi_indice.faiss")
```

---

## ⛓️ LANGCHAIN Y ORQUESTACIÓN {#langchain}

### LangChain Core

```bash
pip install langchain langchain-openai langchain-anthropic langchain-community
```

```python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.messages import HumanMessage, SystemMessage

# ─── Modelos ────────────────────────────────────────────────────
llm_openai    = ChatOpenAI(model="gpt-4o", temperature=0)
llm_anthropic = ChatAnthropic(model="claude-3-5-sonnet-20241022")

# ─── Prompt Templates ───────────────────────────────────────────
prompt = ChatPromptTemplate.from_messages([
    ("system", "Eres un experto en {dominio}. Respondes en español."),
    ("user",   "{pregunta}")
])

# ─── LCEL: Encadenamiento con | ──────────────────────────────────
chain = prompt | llm_openai | StrOutputParser()

# Invocar
respuesta = chain.invoke({
    "dominio":  "machine learning",
    "pregunta": "¿Qué es el overfitting?"
})

# Streaming
for chunk in chain.stream({"dominio": "IA", "pregunta": "Explicá transformers"}):
    print(chunk, end="", flush=True)

# Batch (múltiples en paralelo)
respuestas = chain.batch([
    {"dominio": "Python", "pregunta": "¿Qué es un generador?"},
    {"dominio": "SQL",    "pregunta": "¿Qué es un JOIN?"},
])

# ─── Output Parser JSON ──────────────────────────────────────────
from pydantic import BaseModel, Field
from langchain_core.output_parsers import PydanticOutputParser

class PersonaInfo(BaseModel):
    nombre: str     = Field(description="Nombre completo")
    edad:   int     = Field(description="Edad en años")
    ciudad: str     = Field(description="Ciudad de residencia")

parser = PydanticOutputParser(pydantic_object=PersonaInfo)

prompt_json = ChatPromptTemplate.from_template(
    "Extraé la información del siguiente texto:\n{texto}\n\n{format_instructions}"
)

chain_json = prompt_json | llm_openai | parser

resultado = chain_json.invoke({
    "texto": "Juan tiene 28 años y vive en Buenos Aires",
    "format_instructions": parser.get_format_instructions()
})
print(resultado.nombre)  # → "Juan"
print(resultado.edad)    # → 28
```

---

### RAG Chain Completo con LangChain

```python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import (
    WebBaseLoader, PyPDFLoader, TextLoader, DirectoryLoader
)

# ─── 1. Cargar documentos ────────────────────────────────────────
loader_web = WebBaseLoader("https://docs.empresa.com/faq")
loader_pdf = PyPDFLoader("manual.pdf")
loader_txt = TextLoader("politicas.txt", encoding="utf-8")
loader_dir = DirectoryLoader("./docs/", glob="**/*.pdf", loader_cls=PyPDFLoader)

docs = loader_pdf.load()

# ─── 2. Dividir en chunks ────────────────────────────────────────
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,         # ~750 palabras
    chunk_overlap=200,       # superposición para no perder contexto
    separators=["\n\n", "\n", ". ", " ", ""]
)
chunks = splitter.split_documents(docs)
print(f"Total chunks: {len(chunks)}")

# ─── 3. Vector Store ─────────────────────────────────────────────
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"   # persistir en disco
)
retriever = vectorstore.as_retriever(
    search_type="similarity",         # similarity | mmr | similarity_score_threshold
    search_kwargs={"k": 4}
)

# ─── 4. Prompt RAG ───────────────────────────────────────────────
rag_prompt = ChatPromptTemplate.from_template("""
Respondé la pregunta SOLO basándote en el siguiente contexto.
Si no encontrás la respuesta en el contexto, decí "No tengo información sobre eso."
No inventes ni supongas información.

CONTEXTO:
{context}

PREGUNTA: {question}

RESPUESTA:""")

# ─── 5. Chain completa ───────────────────────────────────────────
def format_docs(docs):
    return "\n\n---\n\n".join(doc.page_content for doc in docs)

llm = ChatOpenAI(model="gpt-4o", temperature=0)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | rag_prompt
    | llm
    | StrOutputParser()
)

# ─── 6. Usar ─────────────────────────────────────────────────────
respuesta = rag_chain.invoke("¿Cuál es el plazo para devoluciones?")
print(respuesta)

# ─── Con fuentes ─────────────────────────────────────────────────
from langchain.chains import RetrievalQA

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=True
)
result = qa_chain.invoke({"query": "¿Qué garantía tienen los productos?"})
print(result["result"])
for doc in result["source_documents"]:
    print(f"  Fuente: {doc.metadata.get('source', 'desconocida')}")
```

---

### Memoria de Conversación

```python
from langchain.memory import (
    ConversationBufferMemory,
    ConversationBufferWindowMemory,
    ConversationSummaryMemory,
    ConversationSummaryBufferMemory
)
from langchain.chains import ConversationChain

llm = ChatOpenAI(model="gpt-4o")

# ─── Buffer completo (guarda todo) ───────────────────────────────
memory_full = ConversationBufferMemory(return_messages=True)

# ─── Ventana (últimas K interacciones) ───────────────────────────
memory_window = ConversationBufferWindowMemory(k=5, return_messages=True)

# ─── Resumen automático ───────────────────────────────────────────
memory_summary = ConversationSummaryMemory(llm=llm, return_messages=True)

# ─── Usar en cadena ──────────────────────────────────────────────
conversation = ConversationChain(
    llm=llm,
    memory=memory_window,
    verbose=False
)

r1 = conversation.predict(input="Me llamo Ana y tengo una startup de logística")
r2 = conversation.predict(input="¿Cómo me llamo y a qué me dedico?")
# → "Te llamas Ana y tenés una startup de logística."

# ─── Ver memoria ─────────────────────────────────────────────────
print(memory_window.load_memory_variables({}))
```

---

## 🤖 FRAMEWORKS DE AGENTES {#agentes}

### LangChain Agents

```python
from langchain.agents import AgentExecutor, create_react_agent, create_openai_tools_agent
from langchain.tools import tool, StructuredTool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from pydantic import BaseModel

# ─── Definir tools ───────────────────────────────────────────────
@tool
def calcular(expresion: str) -> str:
    """Calcula expresiones matemáticas. Ej: '2 * 1299' o '100 / 4'."""
    try:
        import ast
        result = ast.literal_eval(expresion)
        return str(result)
    except:
        return str(eval(expresion))

@tool
def buscar_producto(nombre: str) -> str:
    """Busca precio y stock de un producto en el catálogo."""
    catalogo = {
        "laptop":  {"precio": 1299, "stock": 15},
        "mouse":   {"precio": 49,   "stock": 200},
        "monitor": {"precio": 599,  "stock": 8},
    }
    return str(catalogo.get(nombre.lower(), "Producto no encontrado"))

@tool
def obtener_clima(ciudad: str) -> str:
    """Obtiene el clima actual de una ciudad."""
    # Aquí iría la llamada real a una API de clima
    return f"En {ciudad}: 22°C, parcialmente nublado"

tools = [calcular, buscar_producto, obtener_clima]

# ─── Crear agente ReAct ──────────────────────────────────────────
from langchain import hub
react_prompt = hub.pull("hwchase17/react")

llm = ChatOpenAI(model="gpt-4o", temperature=0)
agent = create_react_agent(llm, tools, react_prompt)

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    max_iterations=5,           # evitar loops infinitos
    handle_parsing_errors=True  # manejar errores de parseo
)

result = executor.invoke({
    "input": "¿Cuánto costaría comprar 3 laptops y 5 mouses?"
})
print(result["output"])

# ─── Agente con OpenAI Functions ─────────────────────────────────
prompt_fn = ChatPromptTemplate.from_messages([
    ("system", "Eres un asistente de ventas. Respondes en español."),
    MessagesPlaceholder(variable_name="chat_history"),
    ("user", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

agent_fn = create_openai_tools_agent(llm, tools, prompt_fn)
executor_fn = AgentExecutor(
    agent=agent_fn,
    tools=tools,
    verbose=True
)

result = executor_fn.invoke({
    "input": "¿Hay laptops disponibles?",
    "chat_history": []
})
```

---

### LangGraph (`langgraph`) — Flujos Complejos

```bash
pip install langgraph
```

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, List
import operator

# ─── Definir estado ──────────────────────────────────────────────
class EstadoAgente(TypedDict):
    messages: Annotated[List, operator.add]  # acumula mensajes
    siguiente_paso: str
    datos_recopilados: dict
    informe_final: str

# ─── Definir nodos (funciones) ───────────────────────────────────
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

llm = ChatOpenAI(model="gpt-4o")

def nodo_investigar(estado: EstadoAgente) -> dict:
    """Primer nodo: recopila información"""
    prompt = f"Investigá sobre: {estado['messages'][-1].content}"
    response = llm.invoke(prompt)
    return {
        "messages": [response],
        "datos_recopilados": {"investigacion": response.content}
    }

def nodo_analizar(estado: EstadoAgente) -> dict:
    """Segundo nodo: analiza los datos"""
    datos = estado["datos_recopilados"]["investigacion"]
    response = llm.invoke(f"Analizá críticamente: {datos[:500]}")
    return {
        "messages": [response],
        "datos_recopilados": {**estado["datos_recopilados"], "analisis": response.content}
    }

def nodo_redactar(estado: EstadoAgente) -> dict:
    """Tercer nodo: redacta el informe final"""
    contexto = estado["datos_recopilados"]
    response = llm.invoke(
        f"Redactá un informe ejecutivo basado en:\n"
        f"Investigación: {contexto['investigacion'][:300]}\n"
        f"Análisis: {contexto['analisis'][:300]}"
    )
    return {"informe_final": response.content}

def decidir_siguiente(estado: EstadoAgente) -> str:
    """Router condicional"""
    if "error" in estado.get("siguiente_paso", ""):
        return "investigar"  # reintentar
    return "analizar"        # continuar

# ─── Construir grafo ─────────────────────────────────────────────
workflow = StateGraph(EstadoAgente)

workflow.add_node("investigar", nodo_investigar)
workflow.add_node("analizar",   nodo_analizar)
workflow.add_node("redactar",   nodo_redactar)

workflow.set_entry_point("investigar")

# Edges secuenciales
workflow.add_edge("investigar", "analizar")
workflow.add_edge("analizar",   "redactar")
workflow.add_edge("redactar",   END)

# Edge condicional (alternativa)
# workflow.add_conditional_edges("investigar", decidir_siguiente,
#     {"analizar": "analizar", "investigar": "investigar"})

app = workflow.compile()

# ─── Ejecutar ────────────────────────────────────────────────────
resultado = app.invoke({
    "messages": [HumanMessage(content="Tendencias de IA en LATAM 2025")],
    "siguiente_paso": "",
    "datos_recopilados": {},
    "informe_final": ""
})

print(resultado["informe_final"])
```

---

### AutoGen (`pyautogen`) — Multi-Agentes Microsoft

```bash
pip install pyautogen
```

```python
import autogen

# ─── Configuración LLM ───────────────────────────────────────────
config_list = [{"model": "gpt-4o", "api_key": "sk-..."}]
llm_config = {"config_list": config_list, "temperature": 0}

# ─── Agentes ─────────────────────────────────────────────────────
asistente = autogen.AssistantAgent(
    name="Asistente",
    llm_config=llm_config,
    system_message="Eres un experto en Python que resuelve problemas paso a paso."
)

usuario = autogen.UserProxyAgent(
    name="Usuario",
    human_input_mode="NEVER",  # NEVER | TERMINATE | ALWAYS
    max_consecutive_auto_reply=3,
    code_execution_config={"work_dir": "codigo_generado"}
)

# ─── Conversación entre agentes ──────────────────────────────────
usuario.initiate_chat(
    asistente,
    message="Escribí una función Python que calcule el número de Fibonacci de forma eficiente"
)

# ─── Sistema multi-agente ────────────────────────────────────────
investigador = autogen.AssistantAgent(
    name="Investigador",
    llm_config=llm_config,
    system_message="Investigás y recopilás información. Citas siempre tus fuentes."
)

analista = autogen.AssistantAgent(
    name="Analista",
    llm_config=llm_config,
    system_message="Analizás datos y sacás conclusiones basadas en evidencia."
)

manager = autogen.GroupChatManager(
    groupchat=autogen.GroupChat(
        agents=[usuario, investigador, analista],
        messages=[],
        max_round=6
    ),
    llm_config=llm_config
)

usuario.initiate_chat(manager, message="Analizá el mercado de IA en Argentina")
```

---

### CrewAI (`crewai`) — Equipos de Agentes

```bash
pip install crewai crewai-tools
```

```python
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool, WebsiteSearchTool

search_tool = SerperDevTool()

# ─── Definir agentes del equipo ──────────────────────────────────
investigador = Agent(
    role="Investigador Senior",
    goal="Encontrá información precisa y actualizada sobre {tema}",
    backstory="Sos un investigador experto con 10 años buscando información confiable.",
    tools=[search_tool],
    verbose=True,
    allow_delegation=False,
    llm="gpt-4o"
)

redactor = Agent(
    role="Redactor de Contenido",
    goal="Redactá artículos claros y atractivos basados en la investigación",
    backstory="Sos periodista especializado en tecnología con un estilo claro y directo.",
    verbose=True,
    allow_delegation=True,
    llm="gpt-4o"
)

# ─── Definir tareas ──────────────────────────────────────────────
tarea_investigar = Task(
    description="Investigá los últimos avances en {tema}. "
                "Buscá al menos 5 fuentes confiables. "
                "Resumí los hallazgos más importantes.",
    expected_output="Lista de 5+ hallazgos clave con fuentes",
    agent=investigador
)

tarea_redactar = Task(
    description="Usando la investigación anterior, redactá un artículo de blog "
                "de 500 palabras sobre {tema} para una audiencia técnica.",
    expected_output="Artículo de blog completo y estructurado",
    agent=redactor
)

# ─── Crear y ejecutar crew ───────────────────────────────────────
crew = Crew(
    agents=[investigador, redactor],
    tasks=[tarea_investigar, tarea_redactar],
    process=Process.sequential,  # sequential | hierarchical
    verbose=True
)

resultado = crew.kickoff(inputs={"tema": "agentes de IA en 2025"})
print(resultado)
```

---

## 📊 PROCESAMIENTO DE DATOS {#datos}

### Pydantic (`pydantic`) — Validación y Estructuras

```bash
pip install pydantic
```

```python
from pydantic import BaseModel, Field, validator, model_validator
from typing import Optional, List
from datetime import datetime

# ─── Modelo de datos ─────────────────────────────────────────────
class ProductoAnalizado(BaseModel):
    nombre:         str             = Field(description="Nombre del producto")
    precio:         float           = Field(gt=0, description="Precio en USD")
    categoria:      str
    disponible:     bool            = True
    tags:           List[str]       = []
    fecha_analisis: datetime        = Field(default_factory=datetime.now)

    @validator("nombre")
    def nombre_no_vacio(cls, v):
        if not v.strip():
            raise ValueError("El nombre no puede estar vacío")
        return v.strip().title()

    @validator("precio")
    def precio_razonable(cls, v):
        if v > 100_000:
            raise ValueError("Precio parece incorrecto (>$100k)")
        return round(v, 2)

# ─── Usar con LLM para structured output ─────────────────────────
from langchain_core.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI

parser = PydanticOutputParser(pydantic_object=ProductoAnalizado)
llm    = ChatOpenAI(model="gpt-4o")

from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template(
    "Extraé la información del producto del siguiente texto:\n"
    "{texto}\n\n{format_instructions}"
)

chain = prompt | llm | parser

producto = chain.invoke({
    "texto": "Laptop Lenovo ThinkPad X1 por $1,299, disponible en electrónica",
    "format_instructions": parser.get_format_instructions()
})

print(f"Nombre: {producto.nombre}")
print(f"Precio: ${producto.precio}")
print(f"Categoría: {producto.categoria}")
```

---

### PyPDF (`pypdf`) — Lectura de PDFs

```bash
pip install pypdf
```

```python
from pypdf import PdfReader
import os

# ─── Leer PDF ────────────────────────────────────────────────────
reader = PdfReader("contrato.pdf")
print(f"Total páginas: {len(reader.pages)}")

# Texto de todo el PDF
texto_completo = "\n\n".join(
    page.extract_text() for page in reader.pages
)

# Página específica
pagina_1 = reader.pages[0].extract_text()

# ─── Metadatos ───────────────────────────────────────────────────
meta = reader.metadata
print(f"Título:  {meta.title}")
print(f"Autor:   {meta.author}")
print(f"Páginas: {len(reader.pages)}")

# ─── Procesar múltiples PDFs de una carpeta ──────────────────────
def extraer_todos_pdfs(carpeta: str) -> list[dict]:
    resultados = []
    for archivo in os.listdir(carpeta):
        if archivo.endswith(".pdf"):
            path = os.path.join(carpeta, archivo)
            reader = PdfReader(path)
            texto = "\n".join(p.extract_text() for p in reader.pages)
            resultados.append({
                "archivo": archivo,
                "texto":   texto,
                "paginas": len(reader.pages)
            })
    return resultados
```

---

### BeautifulSoup4 (`beautifulsoup4`) — Web Scraping

```bash
pip install beautifulsoup4 requests
```

```python
import requests
from bs4 import BeautifulSoup

# ─── Scraping básico ─────────────────────────────────────────────
url = "https://ejemplo.com/articulo"
headers = {"User-Agent": "Mozilla/5.0"}  # evitar bloqueos

response = requests.get(url, headers=headers, timeout=10)
soup = BeautifulSoup(response.text, "html.parser")

# Extraer texto limpio
titulo   = soup.find("h1").get_text(strip=True)
parrafos = [p.get_text(strip=True) for p in soup.find_all("p") if p.get_text(strip=True)]
texto    = "\n".join(parrafos)

# ─── Scraping estructurado ───────────────────────────────────────
def scrape_para_rag(url: str) -> dict:
    """Extrae contenido de una página web para indexar en vector DB."""
    try:
        r = requests.get(url, headers=headers, timeout=15)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")

        # Remover scripts y estilos
        for tag in soup(["script", "style", "nav", "footer"]):
            tag.decompose()

        titulo = soup.find("title")
        h1     = soup.find("h1")
        cuerpo = soup.find("main") or soup.find("article") or soup.find("body")

        return {
            "url":    url,
            "titulo": (titulo.get_text(strip=True) if titulo else ""),
            "h1":     (h1.get_text(strip=True) if h1 else ""),
            "texto":  (cuerpo.get_text(separator="\n", strip=True) if cuerpo else ""),
        }
    except Exception as e:
        return {"url": url, "error": str(e)}
```

---

## 🚀 DEPLOY Y APIs {#deploy}

### FastAPI — Backend de Producción

```bash
pip install fastapi uvicorn python-multipart
```

```python
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="AI Agent API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Modelos de datos ────────────────────────────────────────────
class ChatRequest(BaseModel):
    pregunta:   str
    session_id: str = "default"
    contexto:   str = ""

class ChatResponse(BaseModel):
    respuesta:     str
    fuentes:       list[str] = []
    tokens_usados: int = 0

# ─── Endpoints ───────────────────────────────────────────────────
@app.get("/")
def health_check():
    return {"status": "ok", "version": "1.0"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        from langchain_openai import ChatOpenAI
        llm = ChatOpenAI(model="gpt-4o", temperature=0)
        respuesta = llm.invoke(request.pregunta).content
        return ChatResponse(respuesta=respuesta)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Subir PDF e indexarlo en la vector DB."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Solo se aceptan PDFs")

    contenido = await file.read()
    # Aquí procesarías e indexarías el PDF
    return {"mensaje": f"'{file.filename}' indexado correctamente"}

# ─── Ejecutar ────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

# En terminal: uvicorn main:app --reload --port 8000
# Docs: http://localhost:8000/docs
```

---

### Streamlit — UI Rápida para Demos

```bash
pip install streamlit
```

```python
# app.py
import streamlit as st
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage

st.set_page_config(page_title="Mi Agente IA", page_icon="🤖", layout="wide")
st.title("🤖 Agente de IA")

# ─── Estado de sesión ────────────────────────────────────────────
if "messages" not in st.session_state:
    st.session_state.messages = []

if "llm" not in st.session_state:
    st.session_state.llm = ChatOpenAI(model="gpt-4o", temperature=0.7)

# ─── Mostrar historial ───────────────────────────────────────────
for msg in st.session_state.messages:
    role = "user" if isinstance(msg, HumanMessage) else "assistant"
    with st.chat_message(role):
        st.write(msg.content)

# ─── Input del usuario ───────────────────────────────────────────
if prompt := st.chat_input("Escribí tu mensaje..."):
    st.session_state.messages.append(HumanMessage(content=prompt))

    with st.chat_message("user"):
        st.write(prompt)

    with st.chat_message("assistant"):
        with st.spinner("Pensando..."):
            response = st.session_state.llm.invoke(
                st.session_state.messages
            )
            st.write(response.content)

    st.session_state.messages.append(AIMessage(content=response.content))

# ─── Sidebar con config ──────────────────────────────────────────
with st.sidebar:
    st.header("Configuración")
    model = st.selectbox("Modelo", ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"])
    temperature = st.slider("Temperatura", 0.0, 2.0, 0.7, 0.1)
    if st.button("Limpiar conversación"):
        st.session_state.messages = []
        st.rerun()

# Ejecutar: streamlit run app.py
```

---

## 📊 EVALUACIÓN Y MONITOREO {#eval}

### RAGAS — Evaluación de RAG

```bash
pip install ragas
```

```python
from ragas import evaluate
from ragas.metrics import (
    answer_relevancy,   # ¿La respuesta es relevante a la pregunta?
    faithfulness,       # ¿La respuesta está basada en el contexto?
    context_recall,     # ¿Se recuperaron los documentos correctos?
    context_precision,  # ¿Los documentos recuperados son relevantes?
)
from datasets import Dataset

# ─── Dataset de evaluación ───────────────────────────────────────
data = {
    "question": [
        "¿Cuál es la política de devoluciones?",
        "¿Cuánto dura la garantía?"
    ],
    "answer": [
        "Podés devolver productos hasta 30 días después de la compra.",
        "La garantía es de 2 años desde la fecha de compra."
    ],
    "contexts": [
        ["Devoluciones: hasta 30 días. Sin preguntas.", "Envíos en 5-7 días."],
        ["Garantía: 2 años en todos los productos.", "Servicio técnico incluido."]
    ],
    "ground_truth": [
        "Las devoluciones se aceptan hasta 30 días después de la compra.",
        "Los productos tienen 2 años de garantía."
    ]
}

dataset = Dataset.from_dict(data)

# ─── Evaluar ─────────────────────────────────────────────────────
resultados = evaluate(
    dataset,
    metrics=[answer_relevancy, faithfulness, context_recall, context_precision]
)

print(resultados)
# answer_relevancy:  0.92
# faithfulness:      0.88
# context_recall:    0.95
# context_precision: 0.87

df = resultados.to_pandas()
print(df.to_string())
```

---

### LangSmith — Observabilidad

```bash
pip install langsmith
```

```python
# En .env:
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_API_KEY=ls__...
# LANGCHAIN_PROJECT=mi-proyecto

import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"]     = "ls__..."
os.environ["LANGCHAIN_PROJECT"]     = "mi-agente-prod"

# A partir de acá, TODAS las llamadas a LangChain se tracean automáticamente
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o")
# Esta llamada aparece en LangSmith con tokens, latencia, costo
respuesta = llm.invoke("¿Qué es un agente de IA?")

# ─── Evaluación con LangSmith ────────────────────────────────────
from langsmith import Client
from langsmith.evaluation import evaluate as ls_evaluate

client = Client()

def mi_agente(inputs: dict) -> dict:
    respuesta = llm.invoke(inputs["question"]).content
    return {"output": respuesta}

def evaluar_relevancia(run, example) -> dict:
    prediccion = run.outputs["output"]
    esperado   = example.outputs["answer"]
    # Lógica de evaluación
    score = 1.0 if len(prediccion) > 50 else 0.5
    return {"key": "relevancia", "score": score}

resultados = ls_evaluate(
    mi_agente,
    data="mi-dataset",
    evaluators=[evaluar_relevancia]
)
```

---

## ⚙️ CONFIGURACIÓN DEL ENTORNO {#entorno}

### `.env` — Variables de Entorno

```bash
# .env (NUNCA subir a git)

# LLMs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
GROQ_API_KEY=gsk_...

# Vector DBs
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX=mi-indice

# Monitoreo
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls__...
LANGCHAIN_PROJECT=mi-proyecto

# App
DEBUG=false
PORT=8000
MAX_TOKENS=2000
TEMPERATURE=0.7
```

### Cargar variables en Python

```python
from dotenv import load_dotenv
import os

load_dotenv()  # carga el .env automáticamente

openai_key    = os.getenv("OPENAI_API_KEY")
anthropic_key = os.getenv("ANTHROPIC_API_KEY")
debug         = os.getenv("DEBUG", "false").lower() == "true"

# Verificar que las claves estén cargadas
required_vars = ["OPENAI_API_KEY", "PINECONE_API_KEY"]
missing = [var for var in required_vars if not os.getenv(var)]
if missing:
    raise EnvironmentError(f"Variables faltantes: {', '.join(missing)}")
```

### `.gitignore` Recomendado

```gitignore
# Entorno virtual
venv/
venv_*/
.venv/
env/

# Variables de entorno (¡MUY IMPORTANTE!)
.env
.env.local
.env.production

# Bases de datos locales
*.db
chroma_db/
faiss_index/
__pycache__/
*.pyc

# Archivos generados
outputs/
*.log
```

### `pyproject.toml` — Proyecto Moderno

```toml
[tool.poetry]
name = "mi-agente-ia"
version = "0.1.0"
description = "Agente de IA con RAG"
python = "^3.11"

[tool.poetry.dependencies]
python         = "^3.11"
openai         = "^1.50.0"
anthropic      = "^0.34.0"
langchain      = "^0.3.0"
langchain-openai     = "^0.2.0"
langchain-community  = "^0.3.0"
chromadb       = "^0.5.0"
pinecone-client = "^5.0.0"
fastapi        = "^0.115.0"
uvicorn        = "^0.31.0"
pydantic       = "^2.9.0"
python-dotenv  = "^1.0.0"
sentence-transformers = "^3.2.0"
pypdf          = "^5.0.0"

[tool.poetry.group.dev.dependencies]
pytest    = "^8.0.0"
black     = "^24.0.0"
ruff      = "^0.6.0"
ragas     = "^0.2.0"
```

---

## 📋 REQUIREMENTS.TXT POR PROYECTO {#requirements}

### Proyecto 1: RAG Chatbot Básico

```text
# requirements_rag_basico.txt
openai>=1.50.0
langchain>=0.3.0
langchain-openai>=0.2.0
langchain-community>=0.3.0
chromadb>=0.5.0
fastapi>=0.115.0
uvicorn>=0.31.0
python-dotenv>=1.0.0
pydantic>=2.9.0
pypdf>=5.0.0
```

---

### Proyecto 2: Agente con Herramientas

```text
# requirements_agente.txt
openai>=1.50.0
anthropic>=0.34.0
langchain>=0.3.0
langchain-openai>=0.2.0
langchain-community>=0.3.0
langgraph>=0.2.0
pinecone-client>=5.0.0
sentence-transformers>=3.2.0
fastapi>=0.115.0
uvicorn>=0.31.0
streamlit>=1.39.0
python-dotenv>=1.0.0
pydantic>=2.9.0
requests>=2.32.0
beautifulsoup4>=4.12.0
```

---

### Proyecto 3: Sistema Multi-Agente

```text
# requirements_multi_agente.txt
openai>=1.50.0
langchain>=0.3.0
langchain-openai>=0.2.0
langgraph>=0.2.0
crewai>=0.80.0
pyautogen>=0.3.0
pinecone-client>=5.0.0
qdrant-client>=1.12.0
ragas>=0.2.0
langsmith>=0.1.0
fastapi>=0.115.0
uvicorn>=0.31.0
python-dotenv>=1.0.0
pydantic>=2.9.0
```

---

### Proyecto 4: Producción Completa

```text
# requirements_produccion.txt
openai>=1.50.0
anthropic>=0.34.0
google-generativeai>=0.8.0
langchain>=0.3.0
langchain-openai>=0.2.0
langchain-anthropic>=0.2.0
langchain-community>=0.3.0
langgraph>=0.2.0
pinecone-client>=5.0.0
chromadb>=0.5.0
sentence-transformers>=3.2.0
faiss-cpu>=1.8.0
fastapi>=0.115.0
uvicorn[standard]>=0.31.0
gunicorn>=23.0.0
streamlit>=1.39.0
python-dotenv>=1.0.0
pydantic>=2.9.0
pypdf>=5.0.0
beautifulsoup4>=4.12.0
requests>=2.32.0
pandas>=2.2.0
ragas>=0.2.0
langsmith>=0.1.0
redis>=5.1.0
sqlalchemy>=2.0.0
alembic>=1.13.0
pytest>=8.0.0
httpx>=0.27.0
```

---

## ⚡ CHEAT SHEET RÁPIDO

```
¿Qué necesito?             → ¿Qué instalar?
───────────────────────────────────────────────────────────────────
Llamar a GPT-4o            → pip install openai
Llamar a Claude            → pip install anthropic
Llamar a Gemini            → pip install google-generativeai
LLM local (sin costo)      → pip install ollama + Ollama Desktop
LLM rápido y barato        → pip install groq
Embeddings free            → pip install sentence-transformers
Vector DB local (dev)      → pip install chromadb
Vector DB cloud (prod)     → pip install pinecone-client
Vector DB self-hosted      → pip install qdrant-client
Orquestación RAG           → pip install langchain langchain-openai
Agentes con tools          → pip install langchain langgraph
Multi-agentes              → pip install crewai  o  pyautogen
Validar salida del LLM     → pip install pydantic
Leer PDFs                  → pip install pypdf
Scraping web               → pip install beautifulsoup4 requests
Backend API                → pip install fastapi uvicorn
UI demo rápida             → pip install streamlit
Evaluar RAG                → pip install ragas
Monitoreo producción       → pip install langsmith
Variables de entorno       → pip install python-dotenv
```

---

_Guía actualizada para el stack de IA 2025 · Compatible con Python 3.11+_
