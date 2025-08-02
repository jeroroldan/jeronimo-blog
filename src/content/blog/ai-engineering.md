---
title: 'AI Engineering para Developers'
code: 'ia'
description: 'Guía Completa de AI Engineering para Developers'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía Completa de AI Engineering para Developers

## Tabla de Contenidos

1. [¿Qué es AI Engineering?](#qué-es-ai-engineering)
2. [Conceptos Fundamentales](#conceptos-fundamentales)
3. [Stack Tecnológico Esencial](#stack-tecnológico-esencial)
4. [Workflows y Metodologías](#workflows-y-metodologías)
5. [Implementación Práctica](#implementación-práctica)
6. [MLOps y Deployment](#mlops-y-deployment)
7. [Casos de Uso del Día a Día](#casos-de-uso-del-día-a-día)
8. [Herramientas y Plataformas](#herramientas-y-plataformas)
9. [Buenas Prácticas](#buenas-prácticas)
10. [Tendencias y Futuro](#tendencias-y-futuro)

---

## ¿Qué es AI Engineering?

**AI Engineering** es la disciplina que combina ingeniería de software tradicional con inteligencia artificial para crear sistemas escalables, mantenibles y confiables que incorporan capacidades de IA.

### Diferencias clave

- **Data Scientist**: Se enfoca en experimentos, modelos y análisis
- **ML Engineer**: Se especializa en infraestructura y deployment de modelos
- **AI Engineer**: Integra IA en productos completos, desde la idea hasta producción

### Responsabilidades principales

- Diseñar arquitecturas AI-native
- Integrar modelos de IA en aplicaciones
- Optimizar rendimiento y costos
- Asegurar calidad y confiabilidad
- Manejar el ciclo completo de desarrollo

---

## Conceptos Fundamentales

### 1. **Prompt Engineering**

El arte de diseñar instrucciones efectivas para modelos de lenguaje.

```python
# Ejemplo básico de prompt engineering
def create_prompt(task, context, examples=None):
    prompt = f"""
    Tarea: {task}
  
    Contexto: {context}
  
    {f"Ejemplos: {examples}" if examples else ""}
  
    Instrucciones específicas:
    - Sé preciso y conciso
    - Utiliza el formato solicitado
    - Si no estás seguro, indica tu nivel de confianza
  
    Respuesta:
    """
    return prompt

# Uso práctico
prompt = create_prompt(
    task="Clasificar el sentimiento de un texto",
    context="Análisis de reviews de productos",
    examples="Positivo: 'Me encanta este producto' | Negativo: 'Terrible calidad'"
)
```

### 2. **RAG (Retrieval-Augmented Generation)**

Combina búsqueda de información con generación de texto.

```python
import openai
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss

class RAGSystem:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.index = None
        self.documents = []
  
    def add_documents(self, docs):
        """Agregar documentos al índice de búsqueda"""
        self.documents.extend(docs)
        embeddings = self.model.encode(docs)
    
        if self.index is None:
            self.index = faiss.IndexFlatIP(embeddings.shape[1])
    
        self.index.add(embeddings.astype('float32'))
  
    def search(self, query, k=3):
        """Buscar documentos relevantes"""
        query_embedding = self.model.encode([query])
        scores, indices = self.index.search(query_embedding.astype('float32'), k)
    
        return [self.documents[i] for i in indices[0]]
  
    def generate_answer(self, question):
        """Generar respuesta usando RAG"""
        relevant_docs = self.search(question)
        context = "\n".join(relevant_docs)
    
        prompt = f"""
        Basándote en el siguiente contexto, responde la pregunta:
    
        Contexto: {context}
    
        Pregunta: {question}
    
        Respuesta:
        """
    
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
    
        return response.choices[0].message.content

# Uso del sistema RAG
rag = RAGSystem()
rag.add_documents([
    "Python es un lenguaje de programación versátil",
    "React es una librería de JavaScript para interfaces",
    "Docker facilita la containerización de aplicaciones"
])

answer = rag.generate_answer("¿Qué es Python?")
```

### 3. **Fine-tuning**

Adaptar modelos preentrenados a tareas específicas.

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
import torch
from torch.utils.data import Dataset

class CustomDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_length=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
  
    def __len__(self):
        return len(self.texts)
  
    def __getitem__(self, idx):
        text = str(self.texts[idx])
        encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )
    
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(self.labels[idx], dtype=torch.long)
        }

def fine_tune_model(train_texts, train_labels, model_name="distilbert-base-uncased"):
    """Fine-tuning de un modelo para clasificación"""
  
    # Cargar tokenizer y modelo
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(
        model_name, 
        num_labels=len(set(train_labels))
    )
  
    # Crear dataset
    train_dataset = CustomDataset(train_texts, train_labels, tokenizer)
  
    # Configurar entrenamiento
    training_args = TrainingArguments(
        output_dir='./results',
        num_train_epochs=3,
        per_device_train_batch_size=16,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
    )
  
    # Entrenar
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
    )
  
    trainer.train()
    return model, tokenizer

# Ejemplo de uso
texts = ["Este producto es excelente", "No me gustó nada", "Está bien"]
labels = [1, 0, 1]  # 1: positivo, 0: negativo

model, tokenizer = fine_tune_model(texts, labels)
```

### 4. **Vector Embeddings**

Representaciones numéricas de datos para IA.

```python
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pickle

class EmbeddingManager:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer(model_name)
        self.embeddings_cache = {}
  
    def encode_text(self, text):
        """Convertir texto a embedding"""
        if text in self.embeddings_cache:
            return self.embeddings_cache[text]
    
        embedding = self.model.encode(text)
        self.embeddings_cache[text] = embedding
        return embedding
  
    def find_similar(self, query, candidates, top_k=5):
        """Encontrar textos similares"""
        query_embedding = self.encode_text(query)
        candidate_embeddings = [self.encode_text(c) for c in candidates]
    
        similarities = cosine_similarity(
            [query_embedding], 
            candidate_embeddings
        )[0]
    
        # Obtener índices ordenados por similitud
        similar_indices = np.argsort(similarities)[::-1][:top_k]
    
        results = []
        for idx in similar_indices:
            results.append({
                'text': candidates[idx],
                'similarity': similarities[idx]
            })
    
        return results
  
    def save_cache(self, filepath):
        """Guardar cache de embeddings"""
        with open(filepath, 'wb') as f:
            pickle.dump(self.embeddings_cache, f)
  
    def load_cache(self, filepath):
        """Cargar cache de embeddings"""
        try:
            with open(filepath, 'rb') as f:
                self.embeddings_cache = pickle.load(f)
        except FileNotFoundError:
            print("Cache file not found, starting fresh")

# Uso práctico
em = EmbeddingManager()

# Buscar documentos similares
docs = [
    "Aprende Python desde cero",
    "Guía completa de JavaScript",
    "Machine Learning con Python",
    "Desarrollo web con React",
    "Inteligencia artificial básica"
]

similar = em.find_similar("tutorial de programación", docs, top_k=3)
for result in similar:
    print(f"{result['text']} - Similitud: {result['similarity']:.3f}")
```

---

## Stack Tecnológico Esencial

### **Lenguajes de Programación**

```python
# Python - El ecosistema principal
# Librerías esenciales:
import numpy as np           # Computación numérica
import pandas as pd          # Manipulación de datos
import torch                 # Deep Learning
import transformers          # Modelos de Hugging Face
import langchain            # Frameworks para LLMs
import openai               # API de OpenAI
import anthropic            # API de Anthropic (Claude)
```

```javascript
// JavaScript/TypeScript - Para aplicaciones web
import OpenAI from 'openai';
import { LangChain } from 'langchain';
import { ChromaDB } from 'chromadb';

// Framework para aplicaciones AI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
```

### **Bases de Datos Vectoriales**

```python
# Configuración de diferentes bases de datos vectoriales

# 1. Pinecone
import pinecone
pinecone.init(api_key="your-api-key", environment="us-west1-gcp")
index = pinecone.Index("example-index")

# 2. Weaviate
import weaviate
client = weaviate.Client("http://localhost:8080")

# 3. ChromaDB
import chromadb
chroma_client = chromadb.Client()
collection = chroma_client.create_collection("documents")

# Ejemplo de uso con ChromaDB
def setup_vector_store():
    collection.add(
        documents=["Document 1 content", "Document 2 content"],
        metadatas=[{"source": "web"}, {"source": "pdf"}],
        ids=["id1", "id2"]
    )
  
    results = collection.query(
        query_texts=["search query"],
        n_results=2
    )
    return results
```

---

## Workflows y Metodologías

### **1. Desarrollo Dirigido por Datos (Data-Driven Development)**

```python
class AIProjectWorkflow:
    def __init__(self, project_name):
        self.project_name = project_name
        self.stages = []
  
    def problem_definition(self, problem_description):
        """1. Definir el problema claramente"""
        self.problem = {
            'description': problem_description,
            'success_metrics': [],
            'constraints': []
        }
        return self
  
    def data_exploration(self, data_source):
        """2. Explorar y entender los datos"""
        import pandas as pd
    
        self.data = pd.read_csv(data_source) if isinstance(data_source, str) else data_source
    
        exploration_report = {
            'shape': self.data.shape,
            'columns': list(self.data.columns),
            'missing_values': self.data.isnull().sum().to_dict(),
            'data_types': self.data.dtypes.to_dict()
        }
    
        print(f"Data Exploration Report for {self.project_name}:")
        for key, value in exploration_report.items():
            print(f"{key}: {value}")
    
        return self
  
    def prototype_solution(self, approach="baseline"):
        """3. Crear prototipo rápido"""
        if approach == "baseline":
            # Implementar solución simple primero
            pass
        elif approach == "ai_powered":
            # Implementar con IA
            pass
    
        self.stages.append(f"Prototype: {approach}")
        return self
  
    def evaluate_and_iterate(self, metrics):
        """4. Evaluar y iterar"""
        self.metrics = metrics
        self.stages.append("Evaluation completed")
        return self

# Ejemplo de uso
workflow = (AIProjectWorkflow("Sentiment Analysis")
    .problem_definition("Clasificar sentimientos en reviews de productos")
    .data_exploration("reviews.csv")
    .prototype_solution("ai_powered")
    .evaluate_and_iterate(["accuracy", "f1_score"]))
```

### **2. MLOps Pipeline**

```python
import mlflow
import mlflow.sklearn
from mlflow.tracking import MlflowClient

class MLOpsManager:
    def __init__(self, experiment_name):
        mlflow.set_experiment(experiment_name)
        self.client = MlflowClient()
  
    def log_experiment(self, model, params, metrics, artifacts=None):
        """Registrar experimento en MLflow"""
        with mlflow.start_run():
            # Log parameters
            for key, value in params.items():
                mlflow.log_param(key, value)
        
            # Log metrics
            for key, value in metrics.items():
                mlflow.log_metric(key, value)
        
            # Log model
            mlflow.sklearn.log_model(model, "model")
        
            # Log artifacts
            if artifacts:
                for artifact_path in artifacts:
                    mlflow.log_artifact(artifact_path)
        
            return mlflow.active_run().info.run_id
  
    def deploy_model(self, model_uri, deployment_target="staging"):
        """Desplegar modelo"""
        model_version = mlflow.register_model(model_uri, "SentimentModel")
    
        self.client.transition_model_version_stage(
            name="SentimentModel",
            version=model_version.version,
            stage=deployment_target
        )
    
        return model_version
  
    def monitor_model(self, model_name, stage="Production"):
        """Monitorear modelo en producción"""
        model_version = self.client.get_latest_versions(
            model_name, 
            stages=[stage]
        )[0]
    
        # Implementar lógica de monitoreo
        monitoring_metrics = {
            'model_version': model_version.version,
            'stage': model_version.current_stage,
            'last_updated': model_version.last_updated_timestamp
        }
    
        return monitoring_metrics

# Uso del MLOps Manager
mlops = MLOpsManager("sentiment_analysis_experiment")

# Log de experimento
params = {"learning_rate": 0.01, "epochs": 10}
metrics = {"accuracy": 0.95, "f1_score": 0.93}
run_id = mlops.log_experiment(model, params, metrics)
```

---

## Implementación Práctica

### **1. Chatbot Inteligente con RAG**

```python
import openai
from typing import List, Dict
import json
from datetime import datetime

class IntelligentChatbot:
    def __init__(self, api_key: str, knowledge_base: List[str] = None):
        self.client = openai.OpenAI(api_key=api_key)
        self.conversation_history = []
        self.knowledge_base = knowledge_base or []
        self.rag_system = RAGSystem()  # Del ejemplo anterior
    
        if self.knowledge_base:
            self.rag_system.add_documents(self.knowledge_base)
  
    def add_to_history(self, role: str, content: str):
        """Agregar mensaje al historial de conversación"""
        self.conversation_history.append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        })
  
    def get_context_aware_response(self, user_message: str) -> str:
        """Generar respuesta con contexto y RAG"""
    
        # 1. Buscar información relevante en la base de conocimiento
        relevant_info = ""
        if self.knowledge_base:
            relevant_docs = self.rag_system.search(user_message, k=2)
            relevant_info = "\n".join(relevant_docs)
    
        # 2. Construir prompt con contexto
        system_message = f"""
        Eres un asistente AI inteligente y útil.
    
        {f"Información relevante: {relevant_info}" if relevant_info else ""}
    
        Instrucciones:
        - Sé conversacional y amigable
        - Usa la información relevante si es aplicable
        - Si no sabes algo, admítelo
        - Mantén coherencia con la conversación anterior
        """
    
        # 3. Preparar mensajes para la API
        messages = [{"role": "system", "content": system_message}]
    
        # Agregar historial reciente (últimos 5 mensajes)
        recent_history = self.conversation_history[-5:] if len(self.conversation_history) > 5 else self.conversation_history
        for msg in recent_history:
            messages.append({"role": msg["role"], "content": msg["content"]})
    
        messages.append({"role": "user", "content": user_message})
    
        # 4. Generar respuesta
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )
        
            assistant_response = response.choices[0].message.content
        
            # 5. Actualizar historial
            self.add_to_history("user", user_message)
            self.add_to_history("assistant", assistant_response)
        
            return assistant_response
        
        except Exception as e:
            return f"Lo siento, ocurrió un error: {str(e)}"
  
    def save_conversation(self, filepath: str):
        """Guardar conversación en archivo"""
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.conversation_history, f, indent=2, ensure_ascii=False)
  
    def load_conversation(self, filepath: str):
        """Cargar conversación desde archivo"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                self.conversation_history = json.load(f)
        except FileNotFoundError:
            print("No previous conversation found")

# Ejemplo de uso
knowledge_base = [
    "Nuestra empresa ofrece servicios de desarrollo web y móvil",
    "Trabajamos con React, Python, y tecnologías de IA",
    "Nuestro horario de atención es de 9:00 AM a 6:00 PM"
]

chatbot = IntelligentChatbot(
    api_key="your-openai-api-key",
    knowledge_base=knowledge_base
)

# Simular conversación
response1 = chatbot.get_context_aware_response("¿Qué servicios ofrecen?")
print("Bot:", response1)

response2 = chatbot.get_context_aware_response("¿Cuál es su horario?")
print("Bot:", response2)
```

### **2. Sistema de Análisis de Sentimientos en Tiempo Real**

```python
import asyncio
import websockets
import json
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import logging

class RealTimeSentimentAnalyzer:
    def __init__(self, model_name="cardiffnlp/twitter-roberta-base-sentiment-latest"):
        # Cargar modelo preentrenado
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.classifier = pipeline("sentiment-analysis", 
                                 model=self.model, 
                                 tokenizer=self.tokenizer)
    
        self.connected_clients = set()
        self.processed_count = 0
    
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
  
    def analyze_sentiment(self, text: str) -> Dict:
        """Analizar sentimiento de un texto"""
        try:
            # Procesar con el modelo
            result = self.classifier(text)
        
            # Mapear etiquetas a nombres más amigables
            label_mapping = {
                'LABEL_0': 'Negativo',
                'LABEL_1': 'Neutral', 
                'LABEL_2': 'Positivo'
            }
        
            processed_result = {
                'text': text,
                'sentiment': label_mapping.get(result[0]['label'], result[0]['label']),
                'confidence': round(result[0]['score'], 4),
                'timestamp': datetime.now().isoformat(),
                'processed_id': self.processed_count
            }
        
            self.processed_count += 1
            return processed_result
        
        except Exception as e:
            self.logger.error(f"Error analyzing sentiment: {e}")
            return {
                'text': text,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
  
    async def handle_client(self, websocket, path):
        """Manejar conexión de cliente WebSocket"""
        self.connected_clients.add(websocket)
        self.logger.info(f"Cliente conectado. Total: {len(self.connected_clients)}")
    
        try:
            async for message in websocket:
                data = json.loads(message)
            
                if data.get('type') == 'analyze':
                    text = data.get('text', '')
                
                    if text:
                        # Analizar sentimiento
                        result = self.analyze_sentiment(text)
                    
                        # Enviar resultado de vuelta al cliente
                        await websocket.send(json.dumps({
                            'type': 'result',
                            'data': result
                        }))
                    
                        # Broadcast a todos los clientes conectados (opcional)
                        if data.get('broadcast', False):
                            await self.broadcast_result(result)
            
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            self.connected_clients.remove(websocket)
            self.logger.info(f"Cliente desconectado. Total: {len(self.connected_clients)}")
  
    async def broadcast_result(self, result):
        """Enviar resultado a todos los clientes conectados"""
        if self.connected_clients:
            message = json.dumps({
                'type': 'broadcast',
                'data': result
            })
        
            # Enviar a todos los clientes
            disconnected = []
            for client in self.connected_clients:
                try:
                    await client.send(message)
                except websockets.exceptions.ConnectionClosed:
                    disconnected.append(client)
        
            # Limpiar clientes desconectados
            for client in disconnected:
                self.connected_clients.discard(client)
  
    def start_server(self, host="localhost", port=8765):
        """Iniciar servidor WebSocket"""
        self.logger.info(f"Iniciando servidor en ws://{host}:{port}")
    
        start_server = websockets.serve(self.handle_client, host, port)
    
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()

# Iniciar el servidor
if __name__ == "__main__":
    analyzer = RealTimeSentimentAnalyzer()
    analyzer.start_server()
```

### **3. Cliente JavaScript para el Análisis de Sentimientos**

```javascript
// Cliente web para conectar al servidor de análisis de sentimientos
class SentimentAnalyzerClient {
    constructor(serverUrl = 'ws://localhost:8765') {
        this.serverUrl = serverUrl;
        this.socket = null;
        this.isConnected = false;
        this.callbacks = {
            onResult: null,
            onBroadcast: null,
            onConnect: null,
            onDisconnect: null
        };
    }
  
    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.socket = new WebSocket(this.serverUrl);
            
                this.socket.onopen = () => {
                    this.isConnected = true;
                    console.log('Conectado al servidor de análisis de sentimientos');
                    if (this.callbacks.onConnect) this.callbacks.onConnect();
                    resolve();
                };
            
                this.socket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                
                    if (data.type === 'result' && this.callbacks.onResult) {
                        this.callbacks.onResult(data.data);
                    } else if (data.type === 'broadcast' && this.callbacks.onBroadcast) {
                        this.callbacks.onBroadcast(data.data);
                    }
                };
            
                this.socket.onclose = () => {
                    this.isConnected = false;
                    console.log('Desconectado del servidor');
                    if (this.callbacks.onDisconnect) this.callbacks.onDisconnect();
                };
            
                this.socket.onerror = (error) => {
                    console.error('Error de WebSocket:', error);
                    reject(error);
                };
            
            } catch (error) {
                reject(error);
            }
        });
    }
  
    analyzeText(text, broadcast = false) {
        if (!this.isConnected) {
            throw new Error('No conectado al servidor');
        }
    
        const message = {
            type: 'analyze',
            text: text,
            broadcast: broadcast
        };
    
        this.socket.send(JSON.stringify(message));
    }
  
    onResult(callback) {
        this.callbacks.onResult = callback;
    }
  
    onBroadcast(callback) {
        this.callbacks.onBroadcast = callback;
    }
  
    onConnect(callback) {
        this.callbacks.onConnect = callback;
    }
  
    onDisconnect(callback) {
        this.callbacks.onDisconnect = callback;
    }
  
    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

// Ejemplo de uso en una página web
document.addEventListener('DOMContentLoaded', async () => {
    const client = new SentimentAnalyzerClient();
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const results = document.getElementById('results');
  
    // Configurar callbacks
    client.onResult((result) => {
        displayResult(result);
    });
  
    client.onBroadcast((result) => {
        displayBroadcast(result);
    });
  
    // Conectar al servidor
    try {
        await client.connect();
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = 'Analizar Sentimiento';
    } catch (error) {
        console.error('Error conectando:', error);
        analyzeBtn.textContent = 'Error de conexión';
    }
  
    // Manejar clic del botón
    analyzeBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text) {
            client.analyzeText(text, true); // true para broadcast
            textInput.value = '';
        }
    });
  
    function displayResult(result) {
        const resultDiv = document.createElement('div');
        resultDiv.className = `result ${result.sentiment.toLowerCase()}`;
        resultDiv.innerHTML = `
            <p><strong>Texto:</strong> ${result.text}</p>
            <p><strong>Sentimiento:</strong> ${result.sentiment}</p>
            <p><strong>Confianza:</strong> ${(result.confidence * 100).toFixed(2)}%</p>
            <p><strong>Tiempo:</strong> ${new Date(result.timestamp).toLocaleString()}</p>
        `;
    
        results.insertBefore(resultDiv, results.firstChild);
    
        // Limitar a 10 resultados
        while (results.children.length > 10) {
            results.removeChild(results.lastChild);
        }
    }
  
    function displayBroadcast(result) {
        // Mostrar resultados de otros usuarios con estilo diferente
        displayResult({...result, broadcast: true});
    }
});
```

---

## MLOps y Deployment

### **1. Containerización con Docker**

```dockerfile
# Dockerfile para aplicación AI
FROM python:3.9-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación
COPY . .

# Exponer puerto
EXPOSE 8000

# Variables de entorno
ENV PYTHONPATH=/app
ENV MODEL_PATH=/app/models

# Crear directorio para modelos
RUN mkdir -p /app/models

# Salud del contenedor
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Comando por defecto
CMD ["python", "app.py"]
```

```yaml
# docker-compose.yml para stack completo
version: '3.8'

services:
  ai-app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - REDIS_URL=redis://redis:6379
      - POSTGRES_URL=postgresql://user:pass@postgres:5432/aidb
    depends_on:
      - redis
      - postgres
      - vector-db
    volumes:
      - ./models:/app/models
      - ./logs:/app/logs
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
  
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: aidb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  vector-db:
    image: chromadb/chroma:latest
    ports:
      - "8001:8000"
    volumes:
      - chroma_data:/chroma/chroma
  
  monitoring:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

volumes:
  redis_data:
  postgres_data:
  chroma_data:
```

### **2. Deployment en la Nube**

```python
# deploy.py - Script de deployment automatizado
import boto3
import docker
import os
from typing import Dict, Any

class AIPlatformDeployer:
    def __init__(self, platform: str = "aws"):
        self.platform = platform
        self.config = self.load_config()
  
    def load_config(self) -> Dict[str, Any]:
        """Cargar configuración de deployment"""
        return {
            "aws": {
                "region": "us-west-2",
                "ecr_repo": "your-account.dkr.ecr.us-west-2.amazonaws.com/ai-app",
                "ecs_cluster": "ai-cluster",
                "ecs_service": "ai-service"
            },
            "gcp": {
                "project_id": "your-project-id",
                "region": "us-central1",
                "service_name": "ai-service"
            }
        }
  
    def build_and_push_image(self, tag: str = "latest"):
        """Construir y subir imagen Docker"""
        client = docker.from_env()
    
        print("Construyendo imagen Docker...")
        image = client.images.build(
            path=".",
            tag=f"ai-app:{tag}",
            dockerfile="Dockerfile"
        )
    
        if self.platform == "aws":
            self._push_to_ecr(image, tag)
        elif self.platform == "gcp":
            self._push_to_gcr(image, tag)
  
    def _push_to_ecr(self, image, tag):
        """Subir imagen a Amazon ECR"""
        ecr_client = boto3.client('ecr', region_name=self.config["aws"]["region"])
    
        # Obtener token de autenticación
        token = ecr_client.get_authorization_token()
        username, password = token['authorizationData'][0]['authorizationToken'].decode('base64').split(':')
    
        # Tag y push
        repo_uri = self.config["aws"]["ecr_repo"]
        image.tag(repo_uri, tag)
    
        docker_client = docker.from_env()
        docker_client.images.push(repo_uri, tag=tag, auth_config={
            'username': username,
            'password': password
        })
    
        print(f"Imagen subida a ECR: {repo_uri}:{tag}")
  
    def deploy_to_ecs(self, image_tag: str = "latest"):
        """Desplegar a Amazon ECS"""
        ecs_client = boto3.client('ecs', region_name=self.config["aws"]["region"])
    
        # Actualizar definición de tarea
        task_definition = {
            'family': 'ai-app-task',
            'networkMode': 'awsvpc',
            'requiresCompatibilities': ['FARGATE'],
            'cpu': '512',
            'memory': '1024',
            'executionRoleArn': 'arn:aws:iam::account:role/ecsTaskExecutionRole',
            'containerDefinitions': [
                {
                    'name': 'ai-app',
                    'image': f"{self.config['aws']['ecr_repo']}:{image_tag}",
                    'portMappings': [
                        {
                            'containerPort': 8000,
                            'protocol': 'tcp'
                        }
                    ],
                    'essential': True,
                    'logConfiguration': {
                        'logDriver': 'awslogs',
                        'options': {
                            'awslogs-group': '/ecs/ai-app',
                            'awslogs-region': self.config["aws"]["region"],
                            'awslogs-stream-prefix': 'ecs'
                        }
                    },
                    'environment': [
                        {
                            'name': 'ENVIRONMENT',
                            'value': 'production'
                        }
                    ]
                }
            ]
        }
    
        # Registrar nueva revisión de la tarea
        response = ecs_client.register_task_definition(**task_definition)
    
        # Actualizar servicio
        ecs_client.update_service(
            cluster=self.config["aws"]["ecs_cluster"],
            service=self.config["aws"]["ecs_service"],
            taskDefinition=response['taskDefinition']['taskDefinitionArn']
        )
    
        print("Deployment a ECS completado")
  
    def setup_monitoring(self):
        """Configurar monitoreo y alertas"""
        cloudwatch = boto3.client('cloudwatch', region_name=self.config["aws"]["region"])
    
        # Crear alarmas
        alarms = [
            {
                'AlarmName': 'AI-App-HighCPU',
                'ComparisonOperator': 'GreaterThanThreshold',
                'EvaluationPeriods': 2,
                'MetricName': 'CPUUtilization',
                'Namespace': 'AWS/ECS',
                'Period': 300,
                'Statistic': 'Average',
                'Threshold': 80.0,
                'ActionsEnabled': True,
                'AlarmActions': ['arn:aws:sns:region:account:ai-alerts'],
                'AlarmDescription': 'High CPU usage on AI application',
                'Dimensions': [
                    {
                        'Name': 'ServiceName',
                        'Value': self.config["aws"]["ecs_service"]
                    },
                    {
                        'Name': 'ClusterName',
                        'Value': self.config["aws"]["ecs_cluster"]
                    }
                ]
            }
        ]
    
        for alarm in alarms:
            cloudwatch.put_metric_alarm(**alarm)
    
        print("Monitoreo configurado")

# Uso del deployer
if __name__ == "__main__":
    deployer = AIPlatformDeployer("aws")
  
    # Pipeline de deployment
    deployer.build_and_push_image("v1.0.0")
    deployer.deploy_to_ecs("v1.0.0")
    deployer.setup_monitoring()
```

---

## Casos de Uso del Día a Día

### **1. Automatización de Código con IA**

```python
import openai
import subprocess
import os
from typing import List, Dict

class AICodeAssistant:
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key)
  
    def generate_code(self, description: str, language: str = "python") -> str:
        """Generar código basado en descripción"""
        prompt = f"""
        Genera código {language} para: {description}
    
        Requisitos:
        - Código limpio y bien documentado
        - Manejo de errores
        - Ejemplos de uso
        - Siguiendo mejores prácticas
    
        Código:
        """
    
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.3
        )
    
        return response.choices[0].message.content
  
    def explain_code(self, code: str) -> str:
        """Explicar código existente"""
        prompt = f"""
        Explica qué hace este código de manera clara y detallada:
    
        ```
        {code}
        ```
    
        Incluye:
        - Propósito general
        - Funcionamiento paso a paso
        - Posibles mejoras
        """
    
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800
        )
    
        return response.choices[0].message.content
  
    def review_code(self, code: str) -> Dict[str, any]:
        """Revisar código y sugerir mejoras"""
        prompt = f"""
        Revisa este código y proporciona feedback constructivo:
    
        ```
        {code}
        ```
    
        Analiza:
        1. Legibilidad y estilo
        2. Eficiencia y rendimiento
        3. Seguridad
        4. Manejo de errores
        5. Mejores prácticas
    
        Formato de respuesta: JSON con campos 'rating', 'issues', 'suggestions'
        """
    
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.2
        )
    
        try:
            import json
            return json.loads(response.choices[0].message.content)
        except:
            return {"error": "No se pudo parsear la respuesta"}
  
    def generate_tests(self, code: str, framework: str = "pytest") -> str:
        """Generar tests unitarios para código"""
        prompt = f"""
        Genera tests unitarios completos usando {framework} para este código:
    
        ```
        {code}
        ```
    
        Incluye:
        - Tests para casos normales
        - Tests para casos edge
        - Tests para manejo de errores
        - Mocks si es necesario
        """
    
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1200
        )
    
        return response.choices[0].message.content
  
    def refactor_code(self, code: str, style: str = "clean") -> str:
        """Refactorizar código existente"""
        styles = {
            "clean": "Código limpio con funciones pequeñas y bien nombradas",
            "performance": "Optimizado para máximo rendimiento",
            "readable": "Máxima legibilidad y documentación",
            "minimal": "Código minimalista y conciso"
        }
    
        prompt = f"""
        Refactoriza este código siguiendo el estilo: {styles.get(style, style)}
    
        Código original:
        ```
        {code}
        ```
    
        Código refactorizado:
        """
    
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.3
        )
    
        return response.choices[0].message.content

# Ejemplo de uso
assistant = AICodeAssistant("your-api-key")

# Generar código
new_code = assistant.generate_code(
    "Función para calcular el hash SHA-256 de un archivo",
    "python"
)
print("Código generado:", new_code)

# Revisar código
existing_code = """
def calc(x, y):
    return x + y * 2
"""

review = assistant.review_code(existing_code)
print("Review:", review)
```

### **2. Análisis Automático de Documentos**

```python
import PyPDF2
import docx
from pathlib import Path
import openai
from typing import List, Dict, Any
import mimetypes

class DocumentAnalyzer:
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key)
        self.supported_formats = ['.pdf', '.docx', '.txt', '.md']
  
    def extract_text(self, file_path: str) -> str:
        """Extraer texto de diferentes tipos de archivos"""
        path = Path(file_path)
        extension = path.suffix.lower()
    
        if extension == '.pdf':
            return self._extract_from_pdf(file_path)
        elif extension == '.docx':
            return self._extract_from_docx(file_path)
        elif extension in ['.txt', '.md']:
            return self._extract_from_text(file_path)
        else:
            raise ValueError(f"Formato no soportado: {extension}")
  
    def _extract_from_pdf(self, file_path: str) -> str:
        """Extraer texto de PDF"""
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text
  
    def _extract_from_docx(self, file_path: str) -> str:
        """Extraer texto de Word"""
        doc = docx.Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
  
    def _extract_from_text(self, file_path: str) -> str:
        """Extraer texto de archivos de texto"""
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
  
    def summarize_document(self, file_path: str, max_length: int = 200) -> Dict[str, Any]:
        """Crear resumen del documento"""
        text = self.extract_text(file_path)
    
        prompt = f"""
        Crea un resumen conciso del siguiente documento (máximo {max_length} palabras):
    
        {text[:4000]}  # Limitar texto para no exceder límites de token
    
        Resumen:
        """
    
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300
        )
    
        return {
            "file_path": file_path,
            "summary": response.choices[0].message.content,
            "word_count": len(text.split()),
            "character_count": len(text)
        }
  
    def extract_key_points(self, file_path: str) -> List[str]:
        """Extraer puntos clave del documento"""
        text = self.extract_text(file_path)
    
        prompt = f"""
        Extrae los puntos clave más importantes de este documento.
        Devuelve una lista numerada de máximo 10 puntos:
    
        {text[:4000]}
    
        Puntos clave:
        """
    
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
    
        # Parsear respuesta a lista
        points = response.choices[0].message.content.split('\n')
        return [point.strip() for point in points if point.strip()]
  
    def classify_document(self, file_path: str, categories: List[str] = None) -> Dict[str, Any]:
        """Clasificar documento en categorías"""
        if categories is None:
            categories = [
                "Técnico", "Legal", "Financiero", "Marketing", 
                "Recursos Humanos", "Operacional", "Académico"
            ]
    
        text = self.extract_text(file_path)
        categories_str = ", ".join(categories)
    
        prompt = f"""
        Clasifica este documento en una de estas categorías: {categories_str}
    
        También proporciona tu nivel de confianza (0-100%) y una breve justificación.
    
        Documento:
        {text[:3000]}
    
        Formato de respuesta:
        Categoría: [categoría]
        Confianza: [porcentaje]%
        Justificación: [breve explicación]
        """
    
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
    
        result = response.choices[0].message.content
    
        # Parsear respuesta
        lines = result.split('\n')
        classification = {}
    
        for line in lines:
            if line.startswith('Categoría:'):
                classification['category'] = line.split(':', 1)[1].strip()
            elif line.startswith('Confianza:'):
                conf_str = line.split(':', 1)[1].strip().replace('%', '')
                classification['confidence'] = int(conf_str)
            elif line.startswith('Justificación:'):
                classification['justification'] = line.split(':', 1)[1].strip()
    
        return classification
  
    def answer_questions(self, file_path: str, questions: List[str]) -> Dict[str, str]:
        """Responder preguntas sobre el documento"""
        text = self.extract_text(file_path)
        answers = {}
    
        for question in questions:
            prompt = f"""
            Basándote en el siguiente documento, responde esta pregunta:
        
            Pregunta: {question}
        
            Documento:
            {text[:3500]}
        
            Si la información no está en el documento, indica "Información no disponible en el documento".
        
            Respuesta:
            """
        
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300
            )
        
            answers[question] = response.choices[0].message.content.strip()
    
        return answers
  
    def batch_analyze(self, directory_path: str) -> List[Dict[str, Any]]:
        """Analizar múltiples documentos en un directorio"""
        directory = Path(directory_path)
        results = []
    
        for file_path in directory.glob('*'):
            if file_path.suffix.lower() in self.supported_formats:
                try:
                    analysis = {
                        'file_name': file_path.name,
                        'file_path': str(file_path),
                        'summary': self.summarize_document(str(file_path)),
                        'key_points': self.extract_key_points(str(file_path)),
                        'classification': self.classify_document(str(file_path))
                    }
                    results.append(analysis)
                    print(f"Analizado: {file_path.name}")
                
                except Exception as e:
                    print(f"Error analizando {file_path.name}: {e}")
    
        return results

# Ejemplo de uso
analyzer = DocumentAnalyzer("your-api-key")

# Análisis individual
summary = analyzer.summarize_document("documento.pdf")
print("Resumen:", summary)

key_points = analyzer.extract_key_points("documento.pdf")
print("Puntos clave:", key_points)

# Responder preguntas
questions = [
    "¿Cuál es el tema principal del documento?",
    "¿Hay fechas importantes mencionadas?",
    "¿Qué conclusiones se presentan?"
]

answers = analyzer.answer_questions("documento.pdf", questions)
for q, a in answers.items():
    print(f"P: {q}")
    print(f"R: {a}\n")

# Análisis en lote
batch_results = analyzer.batch_analyze("./documents/")
```

### **3. Generador Inteligente de Contenido**

```python
import openai
import json
from datetime import datetime
from typing import List, Dict, Optional
import requests
from bs4 import BeautifulSoup

class IntelligentContentGenerator:
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key)
        self.content_templates = self.load_templates()
  
    def load_templates(self) -> Dict[str, str]:
        """Cargar plantillas de contenido"""
        return {
            "blog_post": """
            Título: {title}
        
            Introducción:
            {introduction}
        
            Desarrollo:
            {body}
        
            Conclusión:
            {conclusion}
        
            Meta descripción: {meta_description}
            Tags: {tags}
            """,
        
            "social_media": """
            Plataforma: {platform}
            Mensaje: {message}
            Hashtags: {hashtags}
            Call to action: {cta}
            """,
        
            "email_marketing": """
            Asunto: {subject}
        
            Saludo personalizado:
            {greeting}
        
            Cuerpo del email:
            {body}
        
            Call to action:
            {cta}
        
            Despedida:
            {closing}
            """
        }
  
    def generate_blog_post(self, topic: str, keywords: List[str], target_audience: str, tone: str = "profesional") -> Dict[str, str]:
        """Generar artículo de blog completo"""
    
        # Generar título
        title_prompt = f"""
        Genera 5 títulos atractivos para un artículo de blog sobre: {topic}
        Audiencia objetivo: {target_audience}
        Palabras clave a incluir: {', '.join(keywords)}
        Tono: {tone}
    
        Los títulos deben ser:
        - Llamativos y clickeables
        - SEO optimizados
        - Entre 50-60 caracteres
    
        Títulos:
        """
    
        titles_response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": title_prompt}],
            max_tokens=300
        )
    
        titles = titles_response.choices[0].message.content.split('\n')
        selected_title = titles[0].strip() if titles else f"Todo sobre {topic}"
    
        # Generar contenido principal
        content_prompt = f"""
        Escribe un artículo de blog completo sobre: {topic}
    
        Especificaciones:
        - Título: {selected_title}
        - Audiencia: {target_audience}
        - Tono: {tone}
        - Palabras clave: {', '.join(keywords)}
        - Longitud: 800-1200 palabras
        - Incluir subtítulos (H2, H3)
        - SEO optimizado
        - Incluir ejemplos prácticos
    
        Estructura:
        1. Introducción engaging (150 palabras)
        2. 3-4 secciones principales con subtítulos
        3. Conclusión con call-to-action
        4. Meta descripción (150-160 caracteres)
        5. 5-8 tags relevantes
    
        Artículo:
        """
    
        content_response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": content_prompt}],
            max_tokens=2000
        )
    
        content = content_response.choices[0].message.content
    
        # Parsear el contenido (simplificado)
        return {
            "title": selected_title,
            "content": content,
            "keywords": keywords,
            "target_audience": target_audience,
            "tone": tone,
            "generated_at": datetime.now().isoformat(),
            "word_count": len(content.split())
        }
  
    def generate_social_media_campaign(self, product: str, campaign_goal: str, platforms: List[str]) -> Dict[str, List[Dict]]:
        """Generar campaña para redes sociales"""
    
        campaign = {}
    
        platform_specs = {
            "twitter": {"char_limit": 280, "hashtag_limit": 2},
            "instagram": {"char_limit": 2200, "hashtag_limit": 10},
            "linkedin": {"char_limit": 1300, "hashtag_limit": 5},
            "facebook": {"char_limit": 500, "hashtag_limit": 3}
        }
    
        for platform in platforms:
            specs = platform_specs.get(platform, {"char_limit": 500, "hashtag_limit": 5})
        
            prompt = f"""
            Crea 5 posts para {platform} promocionando: {product}
        
            Objetivo de campaña: {campaign_goal}
            Límite de caracteres: {specs['char_limit']}
            Máximo hashtags: {specs['hashtag_limit']}
        
            Para cada post incluye:
            - Mensaje principal
            - Hashtags relevantes
            - Call to action
            - Mejor momento para publicar
        
            Formato JSON:
            [
                {{
                    "message": "texto del post",
                    "hashtags": ["#hashtag1", "#hashtag2"],
                    "cta": "call to action",
                    "best_time": "hora sugerida"
                }}
            ]
            """
        
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1000
            )
        
            try:
                posts = json.loads(response.choices[0].message.content)
                campaign[platform] = posts
            except json.JSONDecodeError:
                # Fallback si no se puede parsear JSON
                campaign[platform] = [{"message": response.choices[0].message.content}]
    
        return campaign
  
    def generate_email_sequence(self, product: str, sequence_type: str, num_emails: int = 5) -> List[Dict[str, str]]:
        """Generar secuencia de emails"""
    
        sequence_types = {
            "welcome": "secuencia de bienvenida para nuevos suscriptores",
            "nurturing": "secuencia de nutrición para leads",
            "sales": "secuencia de ventas para convertir prospects",
            "onboarding": "secuencia de onboarding para nuevos usuarios",
            "re_engagement": "secuencia para reactivar usuarios inactivos"
        }
    
        sequence_description = sequence_types.get(sequence_type, sequence_type)
    
        emails = []
    
        for i in range(num_emails):
            email_number = i + 1
        
            prompt = f"""
            Crea el email #{email_number} de {num_emails} para una {sequence_description}.
        
            Producto/Servicio: {product}
            Posición en secuencia: {email_number}/{num_emails}
        
            Incluye:
            - Asunto atractivo (50 caracteres max)
            - Preheader text (90 caracteres max)
            - Saludo personalizado
            - Cuerpo del email (200-300 palabras)
            - Call to action claro
            - Despedida
        
            Tono: amigable pero profesional
        
            Email:
            """
        
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800
            )
        
            email_content = response.choices[0].message.content
        
            # Parsear contenido del email (simplificado)
            emails.append({
                "email_number": email_number,
                "subject": f"Email {email_number} - {product}",  # Extraer del contenido
                "content": email_content,
                "send_delay": f"{email_number * 2} días"  # Ejemplo de delay
            })
    
        return emails
  
    def optimize_content_for_seo(self, content: str, target_keyword: str) -> Dict[str, Any]:
        """Optimizar contenido para SEO"""
    
        prompt = f"""
        Analiza y optimiza este contenido para SEO con la palabra clave objetivo: "{target_keyword}"
    
        Contenido:
        {content[:2000]}
    
        Proporciona:
        1. Análisis de densidad de palabra clave actual
        2. Sugerencias de mejora para SEO
        3. Títulos H2/H3 optimizados
        4. Meta descripción sugerida
        5. Palabras clave relacionadas a incluir
        6. Score SEO estimado (1-100)
    
        Formato JSON:
        {{
            "current_keyword_density": "X%",
            "seo_score": X,
            "improvements": ["mejora1", "mejora2"],
            "optimized_headings": ["h2_1", "h2_2"],
            "meta_description": "descripción",
            "related_keywords": ["keyword1", "keyword2"]
        }}
        """
    
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800
        )
    
        try:
            return json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            return {"error": "No se pudo parsear el análisis SEO"}
  
    def generate_content_calendar(self, industry: str, months: int = 3) -> List[Dict[str, Any]]:
        """Generar calendario de contenido"""
    
        prompt = f"""
        Crea un calendario de contenido para {months} meses para una empresa en la industria: {industry}
    
        Para cada mes incluye:
        - 4 ideas de blog posts
        - 8 ideas para redes sociales
        - 2 ideas para email marketing
        - Eventos/fechas importantes del mes
        - Hashtags trending sugeridos
    
        Formato JSON por mes:
        {{
            "month": "Enero",
            "blog_posts": ["idea1", "idea2", "idea3", "idea4"],
            "social_media": ["post1", "post2", ...],
            "email_campaigns": ["campaign1", "campaign2"],
            "important_dates": ["fecha1", "fecha2"],
            "trending_hashtags": ["#hashtag1", "#hashtag2"]
        }}
        """
    
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000
        )
    
        try:
            return json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            return [{"error": "No se pudo generar el calendario"}]

# Ejemplo de uso completo
generator = IntelligentContentGenerator("your-api-key")

# Generar blog post
blog_post = generator.generate_blog_post(
    topic="Inteligencia Artificial en el Marketing",
    keywords=["IA", "marketing", "automatización"],
    target_audience="profesionales de marketing",
    tone="profesional"
)
print("Blog post generado:", blog_post["title"])

# Generar campaña de redes sociales
social_campaign = generator.generate_social_media_campaign(
    product="Curso de Python",
    campaign_goal="aumentar inscripciones",
    platforms=["twitter", "linkedin", "instagram"]
)
print("Campaña generada para:", list(social_campaign.keys()))

# Generar secuencia de emails
email_sequence = generator.generate_email_sequence(
    product="Software de CRM",
    sequence_type="welcome",
    num_emails=5
)
print(f"Secuencia de {len(email_sequence)} emails generada")

# Generar calendario de contenido
content_calendar = generator.generate_content_calendar(
    industry="tecnología",
    months=3
)
print("Calendario de contenido generado para 3 meses")
```

---

## Herramientas y Plataformas

### **APIs y SDKs Esenciales**

```python
# Configuración de múltiples APIs de IA
import openai
import anthropic
import google.generativeai as genai
from typing import Dict, Any, Optional

class MultiAIProvider:
    def __init__(self, config: Dict[str, str]):
        """
        config = {
            'openai_key': 'sk-...',
            'anthropic_key': 'sk-ant-...',
            'google_key': 'AIza...'
        }
        """
        self.providers = {}
    
        if config.get('openai_key'):
            self.providers['openai'] = openai.OpenAI(api_key=config['openai_key'])
    
        if config.get('anthropic_key'):
            self.providers['anthropic'] = anthropic.Anthropic(api_key=config['anthropic_key'])
    
        if config.get('google_key'):
            genai.configure(api_key=config['google_key'])
            self.providers['google'] = genai.GenerativeModel('gemini-pro')
  
    def generate_with_fallback(self, prompt: str, preferred_provider: str = 'openai') -> str:
        """Generar respuesta con fallback a otros proveedores"""
        providers_order = [preferred_provider] + [p for p in self.providers.keys() if p != preferred_provider]
    
        for provider in providers_order:
            try:
                if provider == 'openai':
                    response = self.providers['openai'].chat.completions.create(
                        model="gpt-3.5-turbo",
                        messages=[{"role": "user", "content": prompt}],
                        max_tokens=500
                    )
                    return response.choices[0].message.content
            
                elif provider == 'anthropic':
                    response = self.providers['anthropic'].messages.create(
                        model="claude-3-sonnet-20241022",
                        max_tokens=500,
                        messages=[{"role": "user", "content": prompt}]
                    )
                    return response.content[0].text
            
                elif provider == 'google':
                    response = self.providers['google'].generate_content(prompt)
                    return response.text
                
            except Exception as e:
                print(f"Error con {provider}: {e}")
                continue
    
        return "Error: No hay proveedores disponibles"

# Uso
config = {
    'openai_key': 'your-openai-key',
    'anthropic_key': 'your-anthropic-key',
    'google_key': 'your-google-key'
}

multi_ai = MultiAIProvider(config)
response = multi_ai.generate_with_fallback("Explica qué es machine learning", 'openai')
```

### **Herramientas de Desarrollo**

```bash
# requirements.txt para proyecto AI
openai==1.0.0
anthropic==0.25.0
langchain==0.1.0
chromadb==0.4.0
pinecone-client==3.0.0
transformers==4.36.0
torch==2.1.0
sentence-transformers==2.2.2
numpy==1.24.0
pandas==2.0.0
scikit-learn==1.3.0
mlflow==2.8.0
streamlit==1.28.0
fastapi==0.104.0
uvicorn==0.24.0
redis==5.0.0
celery==5.3.0
docker==6.1.0
pytest==7.4.0
black==23.0.0
flake8==6.1.0
```

```yaml
# .github/workflows/ai-deploy.yml
name: AI Application Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
  
    steps:
    - uses: actions/checkout@v3
  
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
  
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install -r requirements-dev.txt
  
    - name: Run tests
      run: |
        pytest tests/ --cov=src --cov-report=xml
  
    - name: Lint code
      run: |
        black --check src/
        flake8 src/
  
    - name: Test model inference
      run: |
        python -m pytest tests/test_model_inference.py
      env:
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
  
    steps:
    - uses: actions/checkout@v3
  
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-west-2
  
    - name: Build and push Docker image
      run: |
        docker build -t ai-app:${{ github.sha }} .
        aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin $ECR_REGISTRY
        docker tag ai-app:${{ github.sha }} $ECR_REGISTRY/ai-app:${{ github.sha }}
        docker push $ECR_REGISTRY/ai-app:${{ github.sha }}
      env:
        ECR_REGISTRY: ${{ secrets.ECR_REGISTRY }}
  
    - name: Deploy to ECS
      run: |
        aws ecs update-service --cluster ai-cluster --service ai-service --force-new-deployment
```

---

## Buenas Prácticas

### **1. Seguridad y Privacidad**

```python
import hashlib
import os
from cryptography.fernet import Fernet
import logging
from typing import Any, Dict

class AISecurityManager:
    def __init__(self):
        self.encryption_key = self._get_or_create_key()
        self.cipher_suite = Fernet(self.encryption_key)
        self.setup_logging()
  
    def _get_or_create_key(self) -> bytes:
        """Obtener o crear clave de encriptación"""
        key_file = 'encryption.key'
        if os.path.exists(key_file):
            with open(key_file, 'rb') as f:
                return f.read()
        else:
            key = Fernet.generate_key()
            with open(key_file, 'wb') as f:
                f.write(key)
            return key
  
    def setup_logging(self):
        """Configurar logging seguro"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('ai_app.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
  
    def sanitize_input(self, user_input: str) -> str:
        """Sanitizar entrada del usuario"""
        # Remover caracteres peligrosos
        dangerous_chars = ['<', '>', '"', "'", '&', '\n', '\r', '\t']
        sanitized = user_input
    
        for char in dangerous_chars:
            sanitized = sanitized.replace(char, '')
    
        # Limitar longitud
        max_length = 1000
        if len(sanitized) > max_length:
            sanitized = sanitized[:max_length]
            self.logger.warning(f"Input truncated to {max_length} characters")
    
        return sanitized.strip()
  
    def encrypt_sensitive_data(self, data: str) -> str:
        """Encriptar datos sensibles"""
        encrypted_data = self.cipher_suite.encrypt(data.encode())
        return encrypted_data.decode()
  
    def decrypt_sensitive_data(self, encrypted_data: str) -> str:
        """Desencriptar datos sensibles"""
        decrypted_data = self.cipher_suite.decrypt(encrypted_data.encode())
        return decrypted_data.decode()
  
    def hash_user_id(self, user_id: str) -> str:
        """Hash de ID de usuario para logging"""
        return hashlib.sha256(user_id.encode()).hexdigest()[:12]
  
    def validate_api_key(self, api_key: str) -> bool:
        """Validar formato de API key"""
        if not api_key:
            return False
    
        # Validaciones básicas
        if len(api_key) < 20:
            return False
    
        if not api_key.startswith(('sk-', 'sk-ant-', 'AIza')):
            return False
    
        return True
  
    def log_ai_interaction(self, user_hash: str, prompt_hash: str, success: bool):
        """Log seguro de interacciones AI"""
        self.logger.info(f"AI Interaction - User: {user_hash}, Prompt: {prompt_hash}, Success: {success}")
  
    def rate_limit_check(self, user_id: str, window_minutes: int = 60, max_requests: int = 100) -> bool:
        """Verificar rate limiting"""
        # Implementación simplificada con Redis
        try:
            import redis
            r = redis.Redis(host='localhost', port=6379, db=0)
        
            user_hash = self.hash_user_id(user_id)
            current_count = r.get(f"rate_limit:{user_hash}")
        
            if current_count is None:
                r.setex(f"rate_limit:{user_hash}", window_minutes * 60, 1)
                return True
        
            current_count = int(current_count)
            if current_count >= max_requests:
                self.logger.warning(f"Rate limit exceeded for user: {user_hash}")
                return False
        
            r.incr(f"rate_limit:{user_hash}")
            return True
        
        except Exception as e:
            self.logger.error(f"Rate limit check failed: {e}")
            return True  # Fallar abierto por defecto

# Uso del manager de seguridad
security = AISecurityManager()

def secure_ai_endpoint(user_id: str, user_input: str, api_key: str) -> Dict[str, Any]:
    """Endpoint AI con medidas de seguridad"""
  
    # 1. Validar API key
    if not security.validate_api_key(api_key):
        return {"error": "Invalid API key format"}
  
    # 2. Rate limiting
    if not security.rate_limit_check(user_id):
        return {"error": "Rate limit exceeded"}
  
    # 3. Sanitizar input
    sanitized_input = security.sanitize_input(user_input)
  
    # 4. Hash para logging
    user_hash = security.hash_user_id(user_id)
    prompt_hash = hashlib.sha256(sanitized_input.encode()).hexdigest()[:12]
  
    try:
        # 5. Procesar con AI
        # ... lógica de AI aquí ...
    
        # 6. Log exitoso
        security.log_ai_interaction(user_hash, prompt_hash, True)
    
        return {"result": "AI response"}
    
    except Exception as e:
        # 7. Log error
        security.log_ai_interaction(user_hash, prompt_hash, False)
        security.logger.error(f"AI processing error: {e}")
        return {"error": "Processing failed"}
```

### **2. Testing y Validación**

```python
import pytest
import unittest.mock as mock
from typing import List, Dict, Any
import json

class AIModelTester:
    def __init__(self, model_interface):
        self.model = model_interface
        self.test_cases = self.load_test_cases()
  
    def load_test_cases(self) -> List[Dict[str, Any]]:
        """Cargar casos de prueba"""
        return [
            {
                "input": "¿Cuál es la capital de Francia?",
                "expected_keywords": ["París", "Francia", "capital"],
                "expected_sentiment": "neutral",
                "should_contain": ["París"]
            },
            {
                "input": "Explica qué es machine learning",
                "expected_keywords": ["machine learning", "algoritmo", "datos"],
                "min_length": 100,
                "should_not_contain": ["[ERROR]", "[INVALID]"]
            }
        ]
  
    def test_response_quality(self, input_text: str, expected_criteria: Dict) -> Dict[str, bool]:
        """Probar calidad de respuesta"""
        response = self.model.generate(input_text)
        results = {}
    
        # Test de longitud mínima
        if "min_length" in expected_criteria:
            results["length_check"] = len(response) >= expected_criteria["min_length"]
    
        # Test de palabras clave esperadas
        if "expected_keywords" in expected_criteria:
            keywords_found = sum(1 for keyword in expected_criteria["expected_keywords"] 
                               if keyword.lower() in response.lower())
            results["keywords_check"] = keywords_found >= len(expected_criteria["expected_keywords"]) * 0.5
    
        # Test de contenido que debe incluir
        if "should_contain" in expected_criteria:
            results["contains_check"] = all(item.lower() in response.lower() 
                                          for item in expected_criteria["should_contain"])
    
        # Test de contenido que NO debe incluir
        if "should_not_contain" in expected_criteria:
            results["not_contains_check"] = not any(item.lower() in response.lower() 
                                                   for item in expected_criteria["should_not_contain"])
    
        return results
  
    def test_consistency(self, input_text: str, iterations: int = 5) -> float:
        """Probar consistency de respuestas"""
        responses = []
    
        for _ in range(iterations):
            response = self.model.generate(input_text)
            responses.append(response)
    
        # Calcular similarity promedio entre respuestas
        from sentence_transformers import SentenceTransformer
        similarity_model = SentenceTransformer('all-MiniLM-L6-v2')
    
        embeddings = similarity_model.encode(responses)
        similarities = []
    
        for i in range(len(embeddings)):
            for j in range(i + 1, len(embeddings)):
                similarity = cosine_similarity([embeddings[i]], [embeddings[j]])[0][0]
                similarities.append(similarity)
    
        avg_similarity = sum(similarities) / len(similarities) if similarities else 0
        return avg_similarity
  
    def test_performance(self, test_inputs: List[str]) -> Dict[str, float]:
        """Probar rendimiento del modelo"""
        import time
    
        response_times = []
    
        for input_text in test_inputs:
            start_time = time.time()
            response = self.model.generate(input_text)
            end_time = time.time()
        
            response_times.append(end_time - start_time)
    
        return {
            "avg_response_time": sum(response_times) / len(response_times),
            "max_response_time": max(response_times),
            "min_response_time": min(response_times)
        }
  
    def run_comprehensive_test(self) -> Dict[str, Any]:
        """Ejecutar suite completa de pruebas"""
        results = {
            "quality_tests": [],
            "consistency_scores": [],
            "performance_metrics": {}
        }
    
        # Tests de calidad
        for test_case in self.test_cases:
            quality_result = self.test_response_quality(
                test_case["input"], 
                test_case
            )
            results["quality_tests"].append({
                "input": test_case["input"],
                "results": quality_result,
                "passed": all(quality_result.values())
            })
    
        # Tests de consistencia
        consistency_inputs = [tc["input"] for tc in self.test_cases[:3]]  # Limitar por tiempo
        for input_text in consistency_inputs:
            consistency_score = self.test_consistency(input_text)
            results["consistency_scores"].append({
                "input": input_text,
                "consistency_score": consistency_score
            })
    
        # Tests de rendimiento
        performance_inputs = [tc["input"] for tc in self.test_cases]
        results["performance_metrics"] = self.test_performance(performance_inputs)
    
        return results

# Tests unitarios con pytest
class TestAIFunctions:
    @pytest.fixture
    def mock_openai_client(self):
        with mock.patch('openai.OpenAI') as mock_client:
            mock_response = mock.Mock()
            mock_response.choices = [mock.Mock()]
            mock_response.choices[0].message.content = "Mock AI response"
        
            mock_client.return_value.chat.completions.create.return_value = mock_response
            yield mock_client
  
    def test_prompt_sanitization(self):
        """Test sanitización de prompts"""
        from your_ai_module import sanitize_prompt
    
        dangerous_input = "<script>alert('xss')</script>Hello"
        sanitized = sanitize_prompt(dangerous_input)
    
        assert "<script>" not in sanitized
        assert "Hello" in sanitized
  
    def test_rate_limiting(self):
        """Test rate limiting"""
        from your_ai_module import AISecurityManager
    
        security = AISecurityManager()
        user_id = "test_user"
    
        # Primeras requests deben pasar
        for _ in range(5):
            assert security.rate_limit_check(user_id, window_minutes=1, max_requests=10)
  
    def test_error_handling(self, mock_openai_client):
        """Test manejo de errores"""
        from your_ai_module import AIGenerator
    
        # Simular error de API
        mock_openai_client.return_value.chat.completions.create.side_effect = Exception("API Error")
    
        generator = AIGenerator("fake-key")
        result = generator.generate("test prompt")
    
        assert "error" in result
        assert result["error"] is not None
  
    @pytest.mark.parametrize("input_text,expected_length", [
        ("Short prompt", 50),
        ("This is a longer prompt that should generate more content", 100),
    ])
    def test_response_length_scaling(self, input_text, expected_length, mock_openai_client):
        """Test que respuestas escalen con longitud de input"""
        from your_ai_module import AIGenerator
    
        generator = AIGenerator("fake-key")
        result = generator.generate(input_text)
    
        # Verificar que la respuesta tenga longitud apropiada
        assert len(result) >= expected_length * 0.5  # Al menos 50% de la longitud esperada

# Ejecución de tests
if __name__ == "__main__":
    # Tests automáticos
    pytest.main([__file__, "-v"])
  
    # Tests de modelo específico
    class MockModel:
        def generate(self, text):
            return f"Mock response for: {text}"
  
    tester = AIModelTester(MockModel())
    comprehensive_results = tester.run_comprehensive_test()
  
    print("Resultados de pruebas comprehensivas:")
    print(json.dumps(comprehensive_results, indent=2))
```

---

## Tendencias y Futuro

### **Tecnologías Emergentes**

1. **Multimodal AI**: Modelos que procesan texto, imagen, audio y video
2. **Edge AI**: IA ejecutándose en dispositivos locales
3. **Autonomous Agents**: Sistemas AI que actúan independientemente
4. **Federated Learning**: Entrenamiento distribuido sin centralizar datos
5. **Neuromorphic Computing**: Hardware inspirado en el cerebro

### **Roadmap de Aprendizaje**

```mermaid
graph TD
    A[Fundamentos AI] --> B[Prompt Engineering]
    B --> C[RAG Systems]
    C --> D[Fine-tuning]
    D --> E[MLOps]
    E --> F[Production Deployment]
    F --> G[Advanced Topics]
  
    G --> H[Multimodal AI]
    G --> I[Agent Systems]
    G --> J[Custom Models]
```

### **Próximos Pasos Recomendados**

1. **Semana 1-2**: Dominar prompt engineering y APIs básicas
2. **Semana 3-4**: Implementar RAG system completo
3. **Mes 2**: Crear aplicación AI end-to-end
4. **Mes 3**: Implementar MLOps pipeline
5. **Mes 4-6**: Especializarse en área específica (NLP, Computer Vision, etc.)

---
