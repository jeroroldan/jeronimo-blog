---
title: "Matemáticas para IA: Los Fundamentos Esenciales"
code: "IA"
description: "Aprende los conceptos matemáticos esenciales que necesitas antes de profundizar en IA: desde lo más básico hasta lo que realmente aplicarás."
pubDate: 2025-11-24
---

Antes de entender cómo funciona un modelo de lenguaje o una red neuronal, necesitas dominar un conjunto de herramientas matemáticas fundamentales. Esta guía te lleva desde cero absoluto hasta el nivel necesario para comprender IA.

***

## 1. Aritmética y Álgebra Básica

### 1.1 Operaciones Fundamentales

Necesitas dominar estas operaciones sin dudar:

*   **Suma, resta, multiplicación, división**
*   **Potencias y raíces:** 2³ = 8, √16 = 4
*   **Logaritmos:** log₂(8) = 3 porque 2³ = 8
    *   *Importante:* Los logits en ML son frecuentemente logaritmos de probabilidades.
*   **Notación científica:** 1.5 × 10⁶ = 1,500,000

### 1.2 Funciones

Una **función** es una relación donde cada输入 tiene exactamente una输出.

*   **f(x) = x²** → función cuadrática
*   **f(x) = eˣ** → función exponencial (crucial en redes neuronales)
*   **f(x) = log(x)** → función logarítmica

### 1.3 Ejercicios de Repaso

```python
# Calcula: 2³ + √25 - log10(100)
import math

resultado = 2**3 + math.sqrt(25) - math.log10(100)
print(resultado)  # 8 + 5 - 2 = 11
```

***

## 2. Trigonometría Básica

### 2.1 Funciones Trigonométricas

Las funciones seno, coseno y tangente relacionan los ángulos de un triángulo rectángulo con las proporciones de sus lados.

*   **sin(θ)** = opuesto / hipotenusa
*   **cos(θ)** = adyacente / hipotenusa
*   **tan(θ)** = opuesto / adyacente

### 2.2 El Círculo Unitario

Un círculo de radio 1 centrado en el origen. Cada punto (x, y) en el círculo satisfy:
x² + y² = 1

*   **sin²(θ) + cos²(θ) = 1** (identidad pitagórica fundamental)

### 2.3 ¿Por qué importa en IA?

Las funciones de activación como **sigmoid** usan exponenciales y están relacionadas con trigonometría:

```python
import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

# La derivada de sigmoid se expresa usando sigmoid misma
def sigmoid_derivative(x):
    s = sigmoid(x)
    return s * (1 - s)
```

***

## 3. Geometría Analítica

### 3.1 El Plano Cartesiano

Un plano definido por dos ejes perpendiculares:
*   **Eje X:** horizontal
*   **Eje Y:** vertical

Cada punto se representa como **(x, y)**

### 3.2 Rectas y Pendientes

*   **Pendiente (m):** "Qué tan empinada es la recta"
    *   m = (y₂ - y₁) / (x₂ - x₁)
*   **Ecuación de la recta:** y = mx + b
    *   m = pendiente
    *   b = intercepto (donde cruza el eje Y)

### 3.3 Distancia entre Puntos

La distancia entre dos puntos (x₁, y₁) y (x₂, y₂):
**d = √((x₂-x₁)² + (y₂-y₁)²)**

Esta es la **distancia euclidiana**, fundamental en ML.

```python
import numpy as np

def distancia_euclidiana(p1, p2):
    return np.sqrt(sum((a - b) ** 2 for a, b in zip(p1, p2)))

punto_a = (1, 2)
punto_b = (4, 6)

print(distancia_euclidiana(punto_a, punto_b))
# √((4-1)² + (6-2)²) = √(9 + 16) = √25 = 5
```

***

## 4. Introducción a Vectores

### 4.1 ¿Qué es un Vector?

Un **vector** es una lista ordenada de números que representa una dirección y magnitud en el espacio.

*   En 2D: **[3, 4]** representa mover 3 unidades en X y 4 en Y
*   En IA: **[0.1, -0.5, 0.8, ...]** representa un "Embedding"

### 4.2 Operaciones con Vectores

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# Suma
print(a + b)  # [5, 7, 9]

# Multiplicación por escalar
print(2 * a)  # [2, 4, 6]

# Producto punto (dot product)
print(np.dot(a, b))  # 1*4 + 2*5 + 3*6 = 32

# Magnitud (norma L2)
print(np.linalg.norm(a))  # √(1+4+9) = √14 ≈ 3.74
```

### 4.3 Producto Punto (Dot Product)

El producto punto es la operación más importante en IA.

**a · b = a₁×b₁ + a₂×b₂ + ... + aₙ×bₙ**

Mide qué tan "alineados" están dos vectores:
*   Si apuntan en la misma dirección → valor positivo alto
*   Si son perpendiculares → 0
*   Si apuntan en dirección opuesta → valor negativo

```python
import numpy as np

# Embeddings de ejemplo
embedding_perro = np.array([0.9, 0.1, 0.5])
embedding_gato = np.array([0.8, 0.2, 0.4])
embedding_auto = np.array([-0.5, 0.8, 0.1])

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

print(f"Perro vs Gato: {cosine_similarity(embedding_perro, embedding_gato):.3f}")
# Alto: 0.985 → son similares

print(f"Perro vs Auto: {cosine_similarity(embedding_perro, embedding_auto):.3f}")
# Bajo: 0.024 → no tienen relación
```

***

## 5. Introducción a Matrices

### 5.1 ¿Qué es una Matriz?

Una **matriz** es una tabla de números organizada en filas y columnas.

*   **Dimensiones:** Una matriz de 3×2 tiene 3 filas y 2 columnas
*   **Notación:** A₍ᵢⱼ₎ se refiere a la fila i, columna j

### 5.2 Operaciones con Matrices

```python
import numpy as np

A = np.array([[1, 2], [3, 4], [5, 6]])
B = np.array([[7, 8], [9, 10], [11, 12]])

# Suma (mismas dimensiones)
print(A + B)

# Multiplicación escalar
print(2 * A)

# Multiplicación de matrices
C = np.array([[1, 2], [3, 4]])
D = np.array([[5, 6], [7, 8]])

# (2x2) × (2x2) = (2x2)
print(np.dot(C, D))
```

### 5.3 Multiplicación de Matrices

Para multiplicar A × B:
*   El número de **columnas de A** debe equals the number of **filas de B**
*   Cada elemento C₍ᵢⱼ₎ = fila i de A · columna j de B

```python
# Ejemplo: Red neuronal simple (forward pass)
# Input: 2 características
# Hidden: 3 neuronas
# Output: 1 predicción

X = np.array([[0.5, 0.2]])  # 1 ejemplo, 2 features

# Pesos capa 1: 2 inputs → 3 outputs
W1 = np.random.randn(2, 3)
b1 = np.zeros((1, 3))

# Forward pass
z1 = X @ W1 + b1
a1 = 1 / (1 + np.exp(-z1))  # activación sigmoid

print("Activación capa 1:", a1)
```

***

## 6. Probabilidad Básica

### 6.1 Conceptos Fundamentales

*   **Experimento:** Un proceso con resultado incierto
*   **Espacio muestral (S):** Todos los posibles resultados
*   **Evento:** Un subconjunto de resultados
*   **Probabilidad:** P(A) = casos favorables / casos posibles

### 6.2 Reglas de Probabilidad

*   **Regla de la suma:** P(A o B) = P(A) + P(B) - P(A y B)
*   **Regla del producto:** P(A y B) = P(A) × P(B|A)
*   **Probabilidad total:** P(A) = Σ P(A|Bᵢ) × P(Bᵢ)

### 6.3 Probabilidad Condicional

P(A|B) = P(A y B) / P(B)

"La probabilidad de A dado que B ocurrió"

```python
# Ejemplo: Clasificador de spam simplificado
# P(spam|contiene "gratis")

P_spam = 0.3  # 30% de emails son spam
P(gratis|spam) = 0.8  # 80% de spam tiene "gratis"
P(gratis|no_spam) = 0.1  # 10% de no-spam tiene "gratis"

# P(gratis) = P(gratis|spam) * P(spam) + P(gratis|no_spam) * P(no_spam)
P_gratis = 0.8 * 0.3 + 0.1 * 0.7 = 0.31

# P(spam|gratis) = P(gratis|spam) * P(spam) / P(gratis)
P_spam_dado_gratis = (0.8 * 0.3) / 0.31
print(f"P(spam|gratis) = {P_spam_dado_gratis:.2%}")
```

### 6.4 Distribución Normal (Gaussiana)

La distribución más importante en estadística.

**f(x) = (1/σ√2π) × e^(-(x-μ)²/2σ²)**

*   **μ (mu):** media (centro)
*   **σ (sigma):** desviación estándar (ancho)

```python
import numpy as np
import matplotlib.pyplot as plt

mu = 0      # media
sigma = 1   # desviación estándar

x = np.linspace(-4, 4, 100)
y = (1 / (sigma * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x - mu) / sigma) ** 2)

plt.plot(x, y)
plt.title("Distribución Normal (μ=0, σ=1)")
plt.show()
```

***

## 7. Conceptos de Estadística

### 7.1 Medidas de Tendencia Central

*   **Media (μ):** Promedio de todos los valores
*   **Mediana:** El valor central cuando se ordena
*   **Moda:** El valor más frecuente

### 7.2 Medidas de Dispersión

*   **Varianza (σ²):** Qué tan dispersos están los datos
    *   σ² = Σ(xᵢ - μ)² / N
*   **Desviación estándar (σ):** Raíz cuadrada de la varianza
    *   Es más interpretable porque está en las mismas unidades que los datos

```python
import numpy as np

datos = [2, 4, 4, 4, 5, 5, 7, 9]

media = np.mean(datos)
mediana = np.median(datos)
varianza = np.var(datos)
desviacion = np.std(datos)

print(f"Media: {media}")
print(f"Mediana: {mediana}")
print(f"Varianza: {varianza:.2f}")
print(f"Desviación estándar: {desviacion:.2f}")
```

### 7.3 Correlación

Mide la relación lineal entre dos variables.

*   **r = 1:** Correlación positiva perfecta
*   **r = -1:** Correlación negativa perfecta
*   **r = 0:** Sin correlación lineal

```python
import numpy as np

x = [1, 2, 3, 4, 5]
y = [2, 4, 5, 4, 5]  # relacionada pero no perfectamente

correlacion = np.corrcoef(x, y)[0, 1]
print(f"Correlación: {correlacion:.3f}")
```

***

## 8. Introducción al Cálculo

### 8.1 Derivadas

La **derivada** mide cómo cambia una función cuando cambias su input.

*   **Notación:** f'(x) o df/dx
*   **Interpretación:** La pendiente de la tangente en un punto

```python
import sympy as sp

x = sp.symbols('x')

# Derivada de x² + 3x + 2
f = x**2 + 3*x + 2
derivada = sp.diff(f, x)
print(derivada)  # 2*x + 3
```

### 8.2 Reglas de Derivación

*   **Constante:** d/dx(k) = 0
*   **Potencia:** d/dx(xⁿ) = nxⁿ⁻¹
*   **Suma:** d/dx(f + g) = f' + g'
*   **Cadena:** d/dx(f(g(x))) = f'(g(x)) × g'(x)

### 8.3 Derivadas Importantes para IA

```python
import numpy as np

# f(x) = x² → f'(x) = 2x
def derivada_cuadratica(x):
    return 2 * x

# f(x) = eˣ → f'(x) = eˣ
def derivada_exponencial(x):
    return np.exp(x)

# f(x) = sigmoid(x) → f'(x) = sigmoid(x) × (1 - sigmoid(x))
def derivada_sigmoid(x):
    s = 1 / (1 + np.exp(-x))
    return s * (1 - s)
```

### 8.4 Integrales (Concepto)

La **integral** es lo opuesto a la derivada. Representa el área bajo la curva.

*   **∫f(x)dx** = función cuya derivada es f(x)
*   No necesitas calcular integrales a mano para IA, pero entender el concepto ayuda con las funciones de pérdida.

***

## 9. Funciones Importantes en IA

### 9.1 Función Sigmoide

σ(x) = 1 / (1 + e⁻ˣ)

*   Convierte cualquier número a un valor entre 0 y 1
*   Usada para probabilidades
*   Problema: gradientes que se "envanecen" (vanishing gradients)

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-10, 10, 100)
y = 1 / (1 + np.exp(-x))

plt.plot(x, y)
plt.title("Función Sigmoide")
plt.axhline(y=0.5, color='r', linestyle='--', alpha=0.5)
plt.show()
```

### 9.2 Función ReLU

ReLU(x) = max(0, x)

*   La función de activación más popular
*   Simple de calcular
*   No tiene el problema de gradientes vanish

```python
def relu(x):
    return np.maximum(0, x)

x = np.linspace(-5, 5, 100)
plt.plot(x, relu(x))
plt.title("Función ReLU")
plt.show()
```

### 9.3 Softmax

Softmax(xᵢ) = e^xᵢ / Σ e^xⱼ

*   Convierte un vector de números a probabilidades que suman 1
*   Usada en la capa final de clasificación

```python
def softmax(x):
    exp_x = np.exp(x - np.max(x))  # estabilidad numérica
    return exp_x / np.sum(exp_x)

logits = [2.0, 1.0, 0.1]
probs = softmax(logits)
print(probs)  # [0.7, 0.2, 0.1] aproximadamente
print(sum(probs))  # 1.0
```

***

## 10. Resumen: Tu Checklist de Matemáticas

| Tema | Lo que necesitas saber | Aplicación en IA |
|------|----------------------|------------------|
| **Aritmética** | Operaciones básicas, logaritmos | Cálculos generales |
| **Trigonometría** | sin, cos, tan, identidad pitagórica | Funciones de activación |
| **Geometría** | Distancia euclidiana, plano cartesiano | Distancia entre vectores |
| **Vectores** | Suma, producto punto, magnitud | Embeddings, redes neuronales |
| **Matrices** | Multiplicación, dimensiones | Forward pass, pesos |
| **Probabilidad** | P(A\|B), distribuciones | LLMs, clasificación |
| **Estadística** | Media, varianza, correlación | Métricas, análisis de datos |
| **Cálculo** | Derivadas, gradientes | Backpropagation, optimización |

**Siguiente paso:** Una vez que domines estos fundamentos, estás listo para el artículo de "Matemáticas Pragmáticas para IA" y luego "Matemáticas Extendidas".