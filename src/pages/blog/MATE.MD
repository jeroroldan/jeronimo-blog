---
title: 'MATEMATICA'
code: 'matematica'
description: 'Desarrolla tu Mente Matemática con Desafíos Inteligentes'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# 🧮 Master Class: Matemáticas para Ingeniería de IA
### Todo lo que necesitás dominar para construir modelos reales

> *"Las matemáticas no son el obstáculo para aprender IA. Son el mapa que te dice por qué funciona lo que funciona."*

---

## 📋 Tabla de Contenidos

1. [Álgebra Lineal — El corazón de la IA](#1-álgebra-lineal--el-corazón-de-la-ia)
2. [Cálculo — El cerebro del modelo](#2-cálculo--el-cerebro-del-modelo)
3. [Probabilidad y Estadística — El lenguaje de la incertidumbre](#3-probabilidad-y-estadística--el-lenguaje-de-la-incertidumbre)
4. [Matemáticas Discretas — La lógica computacional](#4-matemáticas-discretas--la-lógica-computacional)
5. [Cómo empezar a estudiarlo](#5-cómo-empezar-a-estudiarlo)
6. [Hoja de ruta según tu nivel](#6-hoja-de-ruta-según-tu-nivel)

---

## 1. Álgebra Lineal — El corazón de la IA

> **Analogía:** Si la IA fuera un idioma, el álgebra lineal sería su alfabeto. Cada dato — una imagen, una palabra, un usuario — se convierte en una lista de números (vector). Operar con IA es operar con esos números.

Es la herramienta que permite **representar, almacenar y procesar** datos e imágenes. Los datos en IA se manejan casi exclusivamente como estructuras numéricas ordenadas.

---

### 1.1 Vectores y Matrices

Un **vector** es una lista ordenada de números. Representa un punto en el espacio, o el "significado" de algo.

```
"gato"  → [0.23, -0.81, 0.54, 0.12, ...]   ← embedding de 1536 dimensiones
"perro" → [0.25, -0.79, 0.51, 0.14, ...]   ← parecido al de "gato"
"pizza" → [-0.11, 0.92, -0.33, 0.67, ...]  ← muy diferente
```

Una **matriz** es una tabla de números. Representa una transformación del espacio o un conjunto de datos.

```
Imagen de 28×28 píxeles → Matriz de 28×28 = 784 números
Pesos de una capa neuronal → Matriz de (entradas × salidas)
```

**¿Para qué sirve en IA?**
- Cada imagen es una matriz (o tensor 3D si tiene colores RGB)
- Los pesos de una red neuronal son matrices
- Los embeddings de palabras son vectores
- Un batch de datos es una matriz de (muestras × features)

```python
import numpy as np

# Vector: representación de una palabra
vector_gato  = np.array([0.23, -0.81,  0.54,  0.12])
vector_perro = np.array([0.25, -0.79,  0.51,  0.14])
vector_pizza = np.array([-0.11, 0.92, -0.33,  0.67])

# Matriz: pesos de una capa neuronal (4 entradas → 3 neuronas)
W = np.array([
    [0.1,  0.4, -0.2],
    [0.3, -0.1,  0.5],
    [-0.4, 0.2,  0.1],
    [0.2,  0.3, -0.3]
])
print(W.shape)  # (4, 3)
```

---

### 1.2 Operaciones Matriciales

#### Producto Punto (Dot Product)

Es la operación más usada en IA. Mide cuánto "se parecen" dos vectores.

```
a · b = a₁b₁ + a₂b₂ + ... + aₙbₙ
```

**Aplicación directa:** La similitud coseno que usa RAG para encontrar documentos relevantes se basa en el producto punto:

```python
# Similitud coseno: qué tan similar es la pregunta al documento
def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

sim_gato_perro = cosine_similarity(vector_gato, vector_perro)  # ~0.99 (muy similares)
sim_gato_pizza = cosine_similarity(vector_gato, vector_pizza)  # ~-0.3 (poco relacionados)
```

#### Multiplicación de Matrices

Es lo que ocurre en **cada capa de una red neuronal**. Toma un vector de entrada y lo transforma a un nuevo espacio.

```
output = W · x + b
```

Donde `W` son los pesos, `x` la entrada y `b` el sesgo (bias).

```python
# Una "neurona" completa: transformación lineal + bias
x = np.array([1.0, 0.5, -1.0, 0.3])  # entrada
b = np.array([0.1, -0.2, 0.05])       # bias

output = W.T @ x + b  # @  es multiplicación matricial en NumPy
print(output)  # 3 valores de salida (uno por neurona)
```

> **Concepto clave:** Una red neuronal de 5 capas es simplemente 5 multiplicaciones matriciales seguidas, con una función de activación entre cada una. Eso es todo.

---

### 1.3 Transformaciones Lineales

Una matriz no es solo datos — es una **función** que transforma el espacio:

| Transformación | Efecto | Uso en IA |
|---|---|---|
| **Rotación** | Gira el espacio | Augmentación de imágenes |
| **Escala** | Agranda/achica | Normalización de datos |
| **Reflexión** | Espeja el espacio | Data augmentation |
| **Proyección** | Aplana a menor dimensión | Reducción de dimensionalidad |
| **Cizalla** | Inclina el espacio | Transformaciones afines |

```python
# Rotar una imagen 90 grados = multiplicar por la matriz de rotación
theta = np.pi / 2  # 90 grados
R = np.array([
    [np.cos(theta), -np.sin(theta)],
    [np.sin(theta),  np.cos(theta)]
])

punto = np.array([3, 1])
punto_rotado = R @ punto
print(punto_rotado)  # [-1, 3] — rotado 90°
```

---

### 1.4 Descomposición en Valores Singulares (SVD)

> **Analogía:** Tenés una foto de 1000×1000 píxeles = 1 millón de números. SVD te dice que en realidad hay solo ~50 "ideas fundamentales" que explican el 99% de la imagen. El resto es ruido.

SVD descompone cualquier matriz `A` en tres componentes:

```
A = U · Σ · Vᵀ
```

Donde `Σ` contiene los **valores singulares** ordenados de mayor a menor importancia.

**Aplicaciones en IA:**
- **PCA (Análisis de Componentes Principales):** reducción de dimensionalidad
- **Compresión de imágenes:** guardar solo los k valores singulares más importantes
- **Sistemas de recomendación:** descomponer la matriz usuarios × películas
- **Fine-tuning eficiente (LoRA):** ajustar modelos grandes con matrices de bajo rango

```python
# SVD en NumPy
A = np.random.randn(100, 50)  # dataset: 100 muestras, 50 features

U, sigma, Vt = np.linalg.svd(A, full_matrices=False)

# Comprimir: quedarse solo con las 10 componentes más importantes
k = 10
A_compressed = U[:, :k] @ np.diag(sigma[:k]) @ Vt[:k, :]
print(f"Original: {A.shape} → Comprimida: k={k} componentes")

# ¿Cuánta información preservamos?
varianza_preservada = np.sum(sigma[:k]**2) / np.sum(sigma**2)
print(f"Varianza preservada: {varianza_preservada:.1%}")
```

---

## 2. Cálculo — El cerebro del modelo

> **Analogía:** Imaginá que estás en la cima de una montaña con los ojos vendados. Solo podés tocar el suelo y sentir la inclinación. Para llegar al valle (el mínimo error), siempre das un pequeño paso en la dirección más empinada hacia abajo. Eso es **gradiente descendente** — el algoritmo que entrena toda IA moderna.

Te permite **medir y mejorar la precisión** de la IA ajustando los errores del modelo de forma sistemática.

---

### 2.1 Derivadas y Gradientes

La **derivada** de una función mide cuánto cambia su salida cuando cambias levemente su entrada.

```
f'(x) = lim[h→0] (f(x+h) - f(x)) / h
```

En IA, la pregunta es siempre: **"¿Si cambio este peso un poquito, cómo cambia el error?"**

```python
# Derivada numérica (aproximación)
def derivative_numerical(f, x, h=1e-5):
    return (f(x + h) - f(x - h)) / (2 * h)

# Función de error simple
def loss(w):
    return (w - 3)**2  # mínimo en w=3

# ¿Cuánto cambia el error si w=1?
grad = derivative_numerical(loss, w=1.0)
print(f"Gradiente en w=1: {grad:.4f}")  # ~-4.0 (bajar w aumenta el error)
print(f"Gradiente en w=5: {derivative_numerical(loss, 5.0):.4f}")  # ~4.0 (subir w aumenta el error)
```

El **gradiente** es la derivada para funciones con múltiples variables — un vector que apunta en la dirección de máximo aumento del error. Para entrenar, nos movemos en dirección **opuesta** al gradiente.

```
w_nuevo = w_actual - α · ∇L(w)
```

Donde `α` (alpha) es la **tasa de aprendizaje** (learning rate).

---

### 2.2 Derivadas Parciales y Regla de la Cadena

Una red neuronal tiene **millones de pesos**. ¿Cómo calculamos el gradiente de cada uno?

La **regla de la cadena** lo hace posible:

```
∂L/∂w₁ = (∂L/∂z₃) · (∂z₃/∂z₂) · (∂z₂/∂w₁)
```

Esto es exactamente **backpropagation** — el algoritmo de entrenamiento de toda red neuronal.

```
Forward pass:  x → capa₁ → capa₂ → capa₃ → L (error)
Backward pass: L → ∂L/∂w₃ → ∂L/∂w₂ → ∂L/∂w₁   (propagación del gradiente)
```

```python
import torch

# PyTorch calcula las derivadas automáticamente (autograd)
w = torch.tensor(1.0, requires_grad=True)

# Forward: calcular pérdida
loss = (w - 3)**2

# Backward: calcular gradiente automáticamente (usando regla de la cadena)
loss.backward()

print(f"Gradiente de la pérdida respecto a w: {w.grad:.4f}")  # -4.0
# → w debe aumentar para reducir el error
```

---

### 2.3 Integrales

Las integrales calculan **áreas bajo una curva** — esenciales para probabilidades y funciones de pérdida continuas.

```
∫ f(x) dx   ← área total bajo f(x)
```

**Aplicaciones en IA:**
- Calcular probabilidades de distribuciones continuas (e.g., P(x < 5) en una Gaussiana)
- Función de pérdida cross-entropy (logaritmo integrado)
- Normalización de distribuciones de probabilidad

```python
from scipy import integrate

# Probabilidad de que una predicción caiga entre -1 y 1 (distribución normal)
from scipy.stats import norm

prob = norm.cdf(1) - norm.cdf(-1)  # integral de -1 a 1
print(f"P(-1 < X < 1) = {prob:.4f}")  # ≈ 0.6827 → la regla del 68%
```

---

### 2.4 Optimización: Gradiente Descendente en la Práctica

Hay varias variantes del gradiente descendente, cada una con sus ventajas:

| Variante | Usa | Velocidad | Estabilidad |
|---|---|---|---|
| **SGD batch completo** | Todo el dataset | Lento | Alta |
| **Mini-batch SGD** | N muestras por paso | Equilibrado | Buena |
| **Adam** | Gradientes adaptativos | Rápido | Muy buena |
| **AdamW** | Adam + weight decay | Rápido | Excelente |

```python
# Implementación de gradiente descendente desde cero
def gradient_descent(start_w, learning_rate=0.1, epochs=50):
    w = start_w
    history = []

    for epoch in range(epochs):
        # Calcular gradiente de L = (w - 3)²
        gradient = 2 * (w - 3)

        # Actualizar peso
        w = w - learning_rate * gradient
        history.append({'epoch': epoch, 'w': w, 'loss': (w-3)**2})

    return w, history

w_final, history = gradient_descent(start_w=10.0)
print(f"Peso final: {w_final:.6f}")  # ~3.0 (convergió al mínimo!)
```

> **Consejo práctico:** En PyTorch/TensorFlow nunca implementás esto manualmente. Pero entenderlo te permite debuggear cuando el modelo no converge, explota, o aprende demasiado lento.

---

## 3. Probabilidad y Estadística — El lenguaje de la incertidumbre

> **Analogía:** Un modelo de IA nunca dice "esta foto ES un gato". Dice "hay un 94% de probabilidad de que sea un gato". La diferencia entre un modelo que sabe lo que no sabe y uno que "alucina" con confianza está en entender probabilidad.

El mundo real está lleno de ruido e incertidumbre, y los modelos de IA deben saber **tomar decisiones basadas en datos imperfectos**.

---

### 3.1 Variables Aleatorias y Distribuciones

Una **variable aleatoria** es una variable cuyo valor depende de un proceso aleatorio.

Las **distribuciones** describen cómo se comportan esas variables:

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# Distribución Normal (Gaussiana): la más importante en IA
# Aparece en: inicialización de pesos, ruido, errores
mu, sigma = 0, 1
x = np.linspace(-4, 4, 100)
pdf_normal = stats.norm.pdf(x, mu, sigma)

# Distribución Binomial: eventos sí/no
# Aparece en: clasificación binaria, dropout
n, p = 10, 0.3
x_bin = np.arange(0, 11)
pmf_binomial = stats.binom.pmf(x_bin, n, p)

# Softmax: convierte scores en distribución de probabilidad
def softmax(x):
    e_x = np.exp(x - np.max(x))  # resta el máximo para estabilidad numérica
    return e_x / e_x.sum()

scores = np.array([2.0, 1.0, 0.1])  # scores de 3 clases
probabilidades = softmax(scores)
print(probabilidades)  # [0.659, 0.242, 0.099] — suman 1.0
```

**Distribuciones que debés conocer:**

| Distribución | Cuándo aparece en IA |
|---|---|
| **Normal (Gaussiana)** | Inicialización de pesos, ruido, errores |
| **Bernoulli / Binomial** | Clasificación binaria, dropout |
| **Categorical / Softmax** | Clasificación multiclase, tokens en LLMs |
| **Uniforme** | Inicialización de pesos uniforme |
| **Exponencial** | Tiempos de eventos, algunos priors bayesianos |

---

### 3.2 Teorema de Bayes

El teorema más importante de toda la IA clásica:

```
P(A|B) = P(B|A) · P(A) / P(B)
```

Leído en español: **"la probabilidad de A dado B es proporcional a la probabilidad de B dado A, ponderada por cuánto esperábamos A de antemano"**.

> **Analogía:** Recibís un email con la frase "ganaste un millón de dólares". ¿Es spam?
> - P(spam) = 0.95 (el 95% de los emails son spam — prior)
> - P("ganaste un millón" | spam) = 0.30 (esta frase es común en spam)
> - P("ganaste un millón" | no spam) = 0.001 (muy rara en emails legítimos)
>
> Bayes te dice: P(spam | "ganaste un millón") ≈ 0.9997 → **es spam**.

```python
# Clasificador Naive Bayes para detección de spam
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer

emails = [
    "ganaste un millón gratis ahora",   # spam
    "reunión de equipo mañana a las 10", # no spam
    "oferta exclusiva solo hoy gratis",  # spam
    "el informe está adjunto al mail",   # no spam
]
labels = [1, 0, 1, 0]  # 1=spam, 0=no spam

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(emails)

clf = MultinomialNB()
clf.fit(X, labels)

nuevo = vectorizer.transform(["ganaste premio gratis exclusivo"])
print(clf.predict(nuevo))  # [1] → spam
```

---

### 3.3 Inferencia Estadística

Permite **extraer conclusiones** a partir de una muestra y generalizarlas a la población.

Los conceptos clave para IA:

**Sesgo vs. Varianza (el dilema central del ML):**

```
Error total ≈ Sesgo² + Varianza + Ruido irreducible
```

- **Sesgo alto** = modelo demasiado simple (underfitting) — sistemáticamente equivocado
- **Varianza alta** = modelo demasiado complejo (overfitting) — memoriza el training set

```python
# Diagnóstico básico de bias-variance
from sklearn.model_selection import cross_val_score

# Alta varianza: train_score >> test_score
train_score = 0.98
test_score  = 0.65
print("Overfitting: varianza alta") if train_score - test_score > 0.2 else print("OK")

# Alto sesgo: ambos scores son bajos
if train_score < 0.7 and test_score < 0.7:
    print("Underfitting: sesgo alto")
```

**Métricas estadísticas esenciales:**

```python
import numpy as np

# Media y desviación estándar: las más usadas para normalización
data = np.array([2.5, 3.1, 2.8, 3.4, 2.9])
mean = np.mean(data)
std  = np.std(data)

# Z-score normalization: llevar datos a media=0, std=1
z_scores = (data - mean) / std

# Correlación de Pearson: mide relación lineal entre variables (-1 a 1)
x = np.array([1, 2, 3, 4, 5])
y = np.array([2, 4, 5, 4, 5])
correlation = np.corrcoef(x, y)[0, 1]
print(f"Correlación: {correlation:.3f}")  # ~0.9 → fuerte relación positiva
```

---

### 3.4 Teoría de la Información

Mide la **cantidad de información** o incertidumbre en datos.

#### Entropía de Shannon

```
H(X) = -∑ p(x) · log₂(p(x))
```

- Entropía máxima = máxima incertidumbre (todas las clases equiprobables)
- Entropía cero = certeza total (una clase con probabilidad 1)

```python
import numpy as np

def entropy(probabilities):
    # Evitar log(0) con máscara
    p = np.array(probabilities)
    p = p[p > 0]
    return -np.sum(p * np.log2(p))

# Moneda justa: máxima incertidumbre
print(entropy([0.5, 0.5]))   # 1.0 bit

# Moneda trucada: poca incertidumbre
print(entropy([0.99, 0.01])) # ~0.08 bits

# 4 clases equiprobables
print(entropy([0.25]*4))     # 2.0 bits
```

#### Cross-Entropy Loss: la función de pérdida más usada en IA

Es lo que se minimiza en clasificación — mide qué tan lejos está la predicción de la realidad:

```python
def cross_entropy_loss(y_true, y_pred):
    # y_true: etiqueta real (one-hot)
    # y_pred: probabilidades predichas (softmax output)
    epsilon = 1e-15
    y_pred = np.clip(y_pred, epsilon, 1 - epsilon)
    return -np.sum(y_true * np.log(y_pred))

# Predicción perfecta
loss_buena = cross_entropy_loss(
    y_true=[1, 0, 0],      # clase 0 es la correcta
    y_pred=[0.95, 0.03, 0.02]  # modelo muy seguro y correcto
)
print(f"Pérdida perfecta: {loss_buena:.4f}")  # ~0.05

# Predicción mala
loss_mala = cross_entropy_loss(
    y_true=[1, 0, 0],
    y_pred=[0.10, 0.80, 0.10]  # modelo muy equivocado
)
print(f"Pérdida mala: {loss_mala:.4f}")  # ~2.3
```

#### Información Mutua (Mutual Information)

Mide cuánto "sabe" una variable de otra. Usada para selección de features y en árboles de decisión (como ganancia de información):

```python
from sklearn.feature_selection import mutual_info_classif

# ¿Cuánto aporta cada feature para predecir la clase?
X = np.array([[1, 0], [1, 1], [0, 0], [0, 1]])
y = np.array([1, 1, 0, 0])

mi = mutual_info_classif(X, y)
print(f"Info mutua feature 0: {mi[0]:.4f}")  # mayor = más relevante
print(f"Info mutua feature 1: {mi[1]:.4f}")
```

---

## 4. Matemáticas Discretas — La lógica computacional

> **Analogía:** Si el álgebra lineal es el lenguaje de los números continuos, las matemáticas discretas son el lenguaje de las **relaciones y conexiones**. ¿Cómo sabe Spotify que si te gusta Radiohead puede gustarte Portishead? Grafos.

Especialmente relevante en la lógica computacional y el procesamiento del lenguaje natural (NLP).

---

### 4.1 Teoría de Grafos

Un **grafo** es un conjunto de nodos (vértices) conectados por aristas (edges). Es la estructura perfecta para representar relaciones.

```
G = (V, E)
V = {usuarios, películas, palabras, neuronas}
E = {vieron, le_gustó, precede_a, está_conectada_a}
```

**Aplicaciones en IA:**

| Aplicación | Qué representan los nodos | Qué representan las aristas |
|---|---|---|
| **Sistemas de recomendación** | Usuarios y productos | "compró", "vio", "le gustó" |
| **NLP (Knowledge Graphs)** | Entidades (personas, lugares) | Relaciones semánticas |
| **Graph Neural Networks (GNNs)** | Moléculas, átomos, usuarios | Bonds, conexiones |
| **Transformers** | Tokens | Pesos de atención |
| **Redes neuronales** | Neuronas | Pesos sinápticos |

```python
import networkx as nx

# Grafo de recomendación simple
G = nx.Graph()

# Usuarios y películas como nodos
G.add_nodes_from(['Ana', 'Bob', 'Carlos'], tipo='usuario')
G.add_nodes_from(['Matrix', 'Inception', 'Interstellar'], tipo='pelicula')

# Conexiones: quién vio qué
G.add_edges_from([
    ('Ana', 'Matrix', {'rating': 5}),
    ('Ana', 'Inception', {'rating': 4}),
    ('Bob', 'Matrix', {'rating': 4}),
    ('Bob', 'Interstellar', {'rating': 5}),
    ('Carlos', 'Inception', {'rating': 5}),
])

# ¿Qué recomendar a Carlos? (vecino de Ana vía Inception)
vecinos_de_carlos = list(G.neighbors('Carlos'))
print("Carlos vio:", vecinos_de_carlos)  # ['Inception']

# Usuarios que también vieron Inception → Ana → ella vio Matrix
otros_que_vieron_inception = [n for n in G.neighbors('Inception') if n != 'Carlos']
recomendaciones = set()
for usuario in otros_que_vieron_inception:
    for pelicula in G.neighbors(usuario):
        if G.nodes[pelicula].get('tipo') == 'pelicula' and pelicula not in vecinos_de_carlos:
            recomendaciones.add(pelicula)

print("Recomendado para Carlos:", recomendaciones)  # {'Matrix'}
```

#### PageRank: el algoritmo que fundó Google

Se basa en grafos: un nodo es importante si muchos nodos importantes apuntan a él.

```python
# PageRank en una red de documentos
G_docs = nx.DiGraph()
G_docs.add_edges_from([
    ('doc_A', 'doc_B'),
    ('doc_A', 'doc_C'),
    ('doc_B', 'doc_C'),
    ('doc_C', 'doc_A'),
])

pagerank = nx.pagerank(G_docs, alpha=0.85)
for doc, score in sorted(pagerank.items(), key=lambda x: -x[1]):
    print(f"{doc}: {score:.4f}")
```

---

### 4.2 Combinatoria y Lógica

La **combinatoria** cuenta posibilidades — fundamental para entender la complejidad de los problemas de IA.

**Conceptos clave:**

```python
from math import factorial, comb, perm

# Permutaciones: ¿De cuántas formas puedo ordenar N elementos?
n = 5
print(f"5! = {factorial(n)}")  # 120 órdenes posibles

# Combinaciones: elegir k de n sin importar el orden
# Clave en: bootstrap sampling, k-fold cross validation
n, k = 10, 3
print(f"C(10,3) = {comb(n, k)}")  # 120 formas de elegir 3 de 10

# Principio fundamental: si un proceso tiene n₁ resultados y otro n₂,
# combinados tienen n₁ × n₂ resultados
# → por eso los hiperparámetros explotan combinatoriamente
learning_rates = [0.001, 0.01, 0.1]
batch_sizes = [16, 32, 64, 128]
architectures = [3, 5, 7]  # número de capas

total_combinaciones = len(learning_rates) * len(batch_sizes) * len(architectures)
print(f"Combinaciones a explorar: {total_combinaciones}")  # 36 → por eso usamos Bayesian search
```

**Lógica proposicional en IA:**

```python
# Las compuertas lógicas son la base de las neuronas artificiales
# Una neurona puede aprender funciones booleanas

import numpy as np

# El problema XOR: no es linealmente separable (necesita capas ocultas)
X_xor = np.array([[0,0], [0,1], [1,0], [1,1]])
y_xor = np.array([0, 1, 1, 0])  # XOR

# Con una capa: imposible. Con dos capas: trivial.
# Esto motivó toda la investigación en deep learning
```

---

## 5. Cómo empezar a estudiarlo

### Librerías esenciales en Python

```python
# El stack matemático de todo ingeniero de IA
import numpy as np          # Vectores, matrices, álgebra lineal
import scipy                # Optimización, estadística, procesamiento de señales
import matplotlib.pyplot as plt  # Visualización
import pandas as pd         # Manejo de datasets
import sklearn              # ML clásico + herramientas estadísticas
import torch                # Deep learning + autograd (derivadas automáticas)
```

### Mapa de conceptos → código

```
Álgebra Lineal:
  Vectores/Matrices      → numpy.array, numpy.linalg
  Producto punto         → numpy.dot, @
  SVD                    → numpy.linalg.svd, sklearn.decomposition.PCA

Cálculo:
  Derivadas automáticas  → torch.autograd
  Optimización           → torch.optim (Adam, SGD, AdamW)
  Funciones de pérdida   → torch.nn.CrossEntropyLoss, MSELoss

Probabilidad/Estadística:
  Distribuciones         → scipy.stats
  Estadísticas básicas   → numpy.mean, std, corrcoef
  Bayes                  → sklearn.naive_bayes
  Métricas               → sklearn.metrics

Grafos:
  Estructura de grafos   → networkx
  Graph Neural Networks  → torch_geometric, dgl
```

---

### Recursos recomendados por área

| Área | Recurso | Nivel |
|---|---|---|
| Álgebra Lineal | [3Blue1Brown — Essence of Linear Algebra](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab) | Principiante |
| Cálculo | [Khan Academy Calculus](https://www.khanacademy.org/math/calculus-1) | Principiante |
| Probabilidad | [StatQuest with Josh Starmer](https://www.youtube.com/@statquest) | Principiante/Intermedio |
| Todo en uno | [Mathematics for ML — DeepLearning.AI](https://www.deeplearning.ai/courses/mathematics-for-machine-learning-and-data-science/) | Intermedio |
| Libros | *Mathematics for Machine Learning* (Deisenroth, Faisal, Ong) — gratis en PDF | Avanzado |
| Práctica | [fast.ai — Practical Deep Learning](https://www.fast.ai/) | Intermedio |

---

## 6. Hoja de ruta según tu nivel

### Si venís de secundaria / sin base universitaria

```
Mes 1-2: Khan Academy → Álgebra, funciones, límites básicos
Mes 3-4: 3Blue1Brown → Álgebra Lineal (las 15 lecciones)
Mes 5-6: StatQuest → Probabilidad y estadística aplicada
Mes 7+:  Mathematics for ML (DeepLearning.AI) + NumPy en paralelo
```

### Si ya tenés base universitaria

```
Semana 1-2:  Repasar SVD, PCA, eigenvalues con NumPy
Semana 3-4:  Backpropagation desde cero en PyTorch
Semana 5-6:  Teoría de la información: entropía, cross-entropy, KL divergence
Semana 7-8:  Grafos con NetworkX, intro a GNNs
Semana 9+:   Bayesian inference, variational methods
```

### El principio del 80/20

Si solo podés estudiar un subconjunto, priorizá en este orden:

1. **Álgebra Lineal** — sin esto no entendés nada de redes neuronales
2. **Gradiente Descendente** — sin esto no entendés el entrenamiento
3. **Probabilidad básica** — sin esto no entendés las métricas ni las pérdidas
4. **El resto** — profundizás cuando los necesitás en proyectos reales

---

## 🎓 Principios para estudiar matemáticas de IA

> **Principio 1:** Siempre conectar el concepto al código. No memorices fórmulas — implementalas en NumPy/PyTorch.

> **Principio 2:** Visualizá todo. Un gráfico de gradiente descendente enseña más que 10 páginas de fórmulas.

> **Principio 3:** La intuición primero, el rigor después. Entendé qué hace el SVD antes de demostrar por qué funciona.

> **Principio 4:** Usá PyTorch como calculadora de derivadas. Cuando dudes si calculaste un gradiente bien, verificalo con autograd.

> **Principio 5:** Los proyectos reales son la mejor evaluación. Implementá un clasificador, un sistema RAG, o una red neuronal desde cero — ahí vas a usar todo esto junto.

---

*Creado como complemento del curso: IA para Developers — Claude API, RAG y Agentes con Node.js*  
*Instructor: Teddy Paz | {d/t}*