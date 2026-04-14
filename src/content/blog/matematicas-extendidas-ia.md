---
title: "Matemáticas Profundas para IA: Álgebra Lineal, Probabilidad y Cálculo Extendidos"
code: "IA"
description: "Una extensión de los conceptos matemáticos esenciales para IA: profundizando en álgebra lineal, probabilidad, estadística y cálculo con aplicaciones prácticas."
pubDate: 2025-11-24
---

Esta es una guía extendida para aquellos que quieren profundizar en los fundamentos matemáticos de la IA. Aquí cubriremos con más rigor los tres pilares principales: Álgebra Lineal, Probabilidad y Estadística, y Cálculo.

***

## 1. Álgebra Lineal Extendida

### 1.1 Transformaciones Lineales y Matrices

Una **matriz** es simplemente una colección de vectores organizados en filas y columnas. Cuando multiplicas una matriz por un vector, estás aplicando una **transformación lineal** a ese vector: rotarlo, escalarlo, proyectarlo o deformarlo.

**Operaciones fundamentales:**
*   **Suma de matrices:** Se suman elemento a elemento. Solo funciona si tienen las mismas dimensiones.
*   **Multiplicación escalar:** Multiplicar toda la matriz por un número.
*   **Multiplicación de matrices (Dot Product):** Si tienes una matriz A de forma (m×n) y una matriz B de forma (n×p), el resultado será (m×p). Esta es la operación más importante en redes neuronales.

### 1.2 Descomposición de Matrices

Esto es crucial para entender cómo funcionan algoritmos como PCA (Análisis de Componentes Principales) y SVD (Descomposición de Valores Singulares).

**Autovalores y Autovectores:**
*   Un **autovector** es un vector que no cambia de dirección cuando le aplicas una matriz, solo se escala.
*   Un **autovalor** es el factor de escala.
*   *Aplicación:* En PCA, los autovectores de la matriz de covarianza indican las direcciones de máxima varianza (los "ejes principales" de los datos).

**SVD (Descomposición de Valores Singulares):**
*   Cualquier matriz se puede factorizar en tres matrices: U, Σ, V^T.
*   *Aplicación:* Compresión de datos, reducción de dimensionalidad, y sistemas de recomendación.

### 1.3 Normas Vectoriales

Las normas miden el "tamaño" de un vector:
*   **Norma L1 (Manhattan):** Suma de valores absolutos: ||x||₁ = Σ|xᵢ|
*   **Norma L2 (Euclidiana):** Raíz de suma de cuadrados: ||x||₂ = √(Σxᵢ²)
*   **Norma L∞ (Chebyshev):** El valor absoluto máximo: max(|xᵢ|)

*Aplicación:* Regularización en machine learning (L1 para Lasso, L2 para Ridge).

### 1.4 Ejemplo de Código: Descomposición SVD

```python
import numpy as np

# Matriz de ejemplo (usuarios x películas)
ratings = np.array([
    [5, 4, 0, 1],
    [4, 5, 1, 0],
    [0, 1, 5, 4],
    [1, 0, 4, 5]
])

# SVD
U, s, Vt = np.linalg.svd(ratings)

# Reconstruir con los k principales componentes
k = 2
U_k = U[:, :k]
s_k = s[:k]
Vt_k = Vt[:k, :]

reconstructed = np.outer(U_k * s_k, Vt_k)
print("Matriz reconstruida con k=2 componentes:")
print(reconstructed)
```

### 1.5 Espacios Vectoriales y Bases

Una **base** es un conjunto de vectores linealmente independientes que span (generan) todo el espacio. Cuando trabajas con embeddings de 1536 dimensiones, cada dimensión es un eje en este espacio.

*   **Espacio nulo (Null Space):** Vectores que mapean a cero.
*   **Rango (Rank):** Número de columnas linealmente independientes. Si el rango es menor que el número de columnas, tienes redundancia.

***

## 2. Probabilidad y Estadística Extendida

### 2.1 Distribuciones de Probabilidad

**Distribuciones Discretas:**
*   **Uniforme:** Todos los resultados igual de probables.
*   **Binomial:** Número de éxitos en n intentos.
*   **Poisson:** Eventos raros en un intervalo de tiempo/espacio.

**Distribuciones Continuas:**
*   **Normal (Gaussiana):** La más importante. Definida por μ (media) y σ² (varianza).
*   **Exponencial:** Tiempo entre eventos en proceso de Poisson.
*   **Beta y Dirichlet:** Usadas en inferencia bayesiana para modelar probabilidades.

### 2.2 Teorema de Bayes en Profundidad

P(A|B) = P(B|A) × P(A) / P(B)

Esto es el corazón de muchos algoritmos de IA:
*   **Clasificador Naive Bayes:** Asume independencia entre features.
*   **Filtros de spam:** Calcula P(email|es_spam) × P(es_spam) / P(email)
*   **Sistemas de recomendación:** P(item|usuario) = P(usuario|item) × P(item) / P(usuario)

### 2.3 Entropía e Información

**Entropía de Shannon:** Mide la incertidumbre de una distribución.
H(X) = -Σ P(x) × log₂(P(x))

*   Alta entropía = mucha incertidumbre.
*   Baja entropía = información más predecible.

**Divergencia KL (Kullback-Leibler):** Mide cuánto difiere una distribución de otra.
DKL(P || Q) = Σ P(x) × log(P(x)/Q(x))

*Aplicación:* En redes neuronales, la **cross-entropy** es equivalente a la divergencia KL entre la distribución real y la predicha.

### 2.4 Estimadores y Sesgo

*   **Sesgo (Bias):** Diferencia entre el valor estimado y el valor real.
*   **Varianza:** Qué tanto varían las estimaciones entre diferentes muestras.
*   **Trade-off Sesgo-Varianza:** El error total = sesgo² + varianza + ruido irreducible.

### 2.5 Ejemplo: Entropía y Cross-Entropy

```python
import numpy as np

def entropy(p):
    """Calcula entropía de Shannon"""
    p = np.array(p)
    return -np.sum(p * np.log2(p + 1e-10))  # epsilon evita log(0)

def cross_entropy(p, q):
    """Calcula cross-entropy: -Σ p(x) × log(q(x))"""
    p = np.array(p)
    q = np.array(q)
    return -np.sum(p * np.log2(q + 1e-10))

# Distribución real (one-hot: clase correcta)
p_real = [1, 0, 0]  # "perro"

# Predicción del modelo A (confiado)
q_a = [0.9, 0.05, 0.05]

# Predicción del modelo B (inseguro)
q_b = [0.4, 0.3, 0.3]

print(f"Entropía real: {entropy(p_real):.2f}")
print(f"Cross-entropy modelo A: {cross_entropy(p_real, q_a):.2f}")
print(f"Cross-entropy modelo B: {cross_entropy(p_real, q_b):.2f}")
# A tiene menor cross-entropy = mejor predicción
```

***

## 3. Cálculo Extendido

### 3.1 Derivadas y Gradientes

La **derivada** mide cómo cambia una función cuando cambias su输入. En ML, el gradiente es el vector de derivadas parciales respecto a cada parámetro.

**Regla de la cadena:** Si y = f(g(x)), entonces dy/dx = f'(g(x)) × g'(x). Esto es la base del **backpropagation** en redes neuronales.

### 3.2 Descenso de Gradiente Variantes

**Gradient Descent (GD):** Actualiza usando todo el dataset.
θ = θ - α × ∇J(θ)

**Stochastic Gradient Descent (SGD):** Actualiza con cada muestra.
Más rápido pero más ruidoso.

**Mini-batch GD:** Actualiza con batches de 32/64/128 muestras.
El estándar en deep learning.

**Adam (Adaptive Moment Estimation):** Combina momentum y learning rate adaptativo.
Usa m (primer momento = momentum) y v (segundo momento = varianza).

### 3.3 Funciones de Activación y sus Derivadas

```python
import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_derivative(x):
    s = sigmoid(x)
    return s * (1 - s)

def relu(x):
    return np.maximum(0, x)

def relu_derivative(x):
    return (x > 0).astype(float)

def softmax(x):
    exp_x = np.exp(x - np.max(x))  # numerical stability
    return exp_x / np.sum(exp_x)
```

### 3.4 Jacobiano y Hessiano

*   **Jacobiano:** Matriz de todas las derivadas parciales primeras. Para funciones vectoriales.
*   **Hessiano:** Matriz de derivadas parciales segundas. Usada en optimización Newton.

### 3.5 Ejemplo: Backpropagation Simplificado

```python
import numpy as np

class SimpleNeuralNetwork:
    def __init__(self):
        np.random.seed(42)
        self.weights = np.random.randn(3, 1) * 0.5
        self.bias = 0.0
    
    def sigmoid(self, x):
        return 1 / (1 + np.exp(-x))
    
    def forward(self, X):
        self.z = X @ self.weights + self.bias
        self.a = self.sigmoid(self.z)
        return self.a
    
    def backward(self, X, y, learning_rate=0.1):
        m = X.shape[0]
        dz = self.a - y.reshape(-1, 1)
        dw = (1/m) * (X.T @ dz)
        db = (1/m) * np.sum(dz)
        
        self.weights -= learning_rate * dw
        self.bias -= learning_rate * db

# Datos XOR
X = np.array([[0,0], [0,1], [1,0], [1,1]])
y = np.array([0, 1, 1, 0])

nn = SimpleNeuralNetwork()

for i in range(10000):
    output = nn.forward(X)
    nn.backward(X, y, learning_rate=0.5)

print("Predicciones finales:")
print(np.round(nn.forward(X), 2))
```

***

## 4. Temas Avanzados

### 4.1 Optimización Convexa

Una función es **convexa** si el segmento entre dos puntos está siempre por encima de la función. Esto garantiza que cualquier mínimo local es también un mínimo global.

*   **Convex Loss Functions:** Regresión lineal, regresión logística.
*   **Non-convex:** Redes neuronales profundas (múltples mínimos locales).

### 4.2 Autodiff (Diferenciación Automática)

Los frameworks (PyTorch, TensorFlow) usan **autodiff** para calcular gradientes automáticamente:
1.  **Forward pass:** Construye el grafo computacional.
2.  **Backward pass:** Calcula gradientes usando la regla de la cadena.

### 4.3 Regularización y sus Fundamentos

*   **L1 (Lasso):** Añade λ × Σ|w| → promueve sparsity (vectores dispersos).
*   **L2 (Ridge):** Añade λ × Σw² → shrink weights hacia cero.
*   **Dropout:** Introduce ruido para evitar overfitting.
*   **Early Stopping:** Detener cuando el validation loss sube.

### 4.4 Métricas de Distancia en Profundidad

| Métrica | Fórmula | Cuándo usar |
|---------|---------|-------------|
| Euclidiana | √(Σ(x-y)²) | Datos de misma escala |
| Coseno | (A·B)/(\|\|A\|\|×\|\|B\|\|) | Embeddings, texto |
| Manhattan | Σ\|x-y\| | Datos con outliers |
| Hamming | # bits diferentes | Datos categóricos binarios |
| Minkowski | (Σ\|x-y\|^p)^(1/p) | Generalización |

### 4.5 Ejemplo Completo: Sistema de Recomendación con SVD

```python
import numpy as np

# Matriz de ratings (usuarios x ítems)
R = np.array([
    [5, 4, 0, 0, 1],
    [5, 5, 4, 0, 2],
    [0, 0, 5, 4, 3],
    [0, 2, 0, 5, 4]
])

# SVD truncado para factorización de matrices
def matrix_factorization(R, k=2, learning_rate=0.01, epochs=1000):
    m, n = R.shape
    np.random.seed(42)
    P = np.random.randn(m, k) * 0.1  # usuarios latentes
    Q = np.random.randn(n, k) * 0.1  # ítems latentes
    
    for epoch in range(epochs):
        for i in range(m):
            for j in range(n):
                if R[i, j] > 0:
                    error = R[i, j] - np.dot(P[i], Q[j])
                    P[i] += learning_rate * error * Q[j]
                    Q[j] += learning_rate * error * P[i]
    
    return P, Q

P, Q = matrix_factorization(R, k=2)

# Predicciones
predictions = P @ Q.T
print("Matriz de predicciones (ratings predichos):")
print(np.round(predictions, 1))
```

***

## Resumen Ejecutivo

| Área | Conceptos Clave | Aplicación en IA |
|------|-----------------|------------------|
| **Álgebra Lineal** | Vectores, matrices, SVD, normas | Embeddings, redes neuronales, PCA |
| **Probabilidad** | Distribuciones, Bayes, entropía | LLMs, clasificación, pérdida |
| **Cálculo** | Gradientes, backprop, Adam | Entrenamiento de modelos |
| **Optimización** | Convexidad, regularización | Fine-tuning, generalización |

**Siguiente paso:** Implementa estos conceptos con NumPy y PyTorch. La mejor forma de entender las matemáticas es programmándolas.
