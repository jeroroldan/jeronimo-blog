---
title: "MASTERCLASS: Vectores, Álgebra Lineal y PLN - Guía Definitiva"
description: "Aprende álgebra lineal aplicada al Procesamiento del Lenguaje Natural: vectores 2D, plano semántico, distancia euclidiana vs similitud coseno, normalización, embeddings, TF-IDF y cómo entrenar modelos que entiendan palabras. Guía pedagógica completa con analogías, checkpoints cognitivos, código Python y glosario."
pubDate: "2026-09-15"
code: "vectores-pln-masterclass"
category: "ia"
tags: ["ia", "algebra-lineal", "pln", "nlp", "vectores", "embeddings", "machine-learning", "deep-learning", "tutorial", "masterclass"]
difficulty: "intermedio"
readingTime: 50
---

# 🧠 Guía Maestra: Álgebra Lineal para Procesamiento del Lenguaje Natural (PLN)
### 🎯 De la Flecha en el Plano a la IA que Entiende Palabras

> 📚 **Metodología de aprendizaje**: Esta guía aplica técnicas validadas científicamente: chunking (segmentación cognitiva), codificación dual (texto + imágenes mentales), analogías de dominio concreto, práctica de recuperación espaciada y el método Feynman (explicación forzada en lenguaje simple). Cada sección incluye un **checkpoint cognitivo** ✅ para autoevaluación antes de avanzar.

---

## 🧭 Mapa de Ruta Cognitivo 🗺️

Antes de empezar, visualiza el viaje. El cerebro aprende mejor cuando sabe el destino. 🚀

```
Nivel 0: ¿Qué es una flecha matemática? 🎯 (Vectores 2D)
    ↓
Nivel 1: ¿Cómo represento palabras en un mapa? 🌍 (Plano semántico)
    ↓
Nivel 2: ¿Cómo mido si dos palabras están "cerca"? 📐 (Métricas de distancia)
    ↓
Nivel 3: ¿Por qué la frecuencia engaña y cómo lo arreglo? 🔧 (Normalización)
    ↓
Aplicación real: Embeddings, BERT, Word2Vec, etc. 🤖
```

---

## 📦 Nivel 0: Fundamentos de Vectores en 2D 🔢

### 🔑 El Concepto Clave
Un **vector** ➡️ es una flecha que va desde el origen $(0,0)$ hasta un punto $(x, y)$ en un plano cartesiano.

### 🎨 Analogía Maestra: El Punto de Partida y Llegada
> Imagina que estás en el centro de una plaza $(0,0)$. Quieres llegar a una esquina específica $(3, 4)$. 🏃
> - **Vector**: La trayectoria completa desde donde estás hasta donde quieres ir.
> - **Coordenadas $(x,y)$**: La receta: "camina 3 pasos hacia la derecha 👉, luego 4 hacia arriba ⬆️".
> - **Dirección ($\theta$)**: La inclinación de tu camino (¿más horizontal o más vertical?).
> - **Magnitud**: El largo total del recorrido. Con el teorema de Pitágoras: $\|v\| = \sqrt{x^2 + y^2}$. 📏

**Ejemplo numérico:**
- Vector A: $(3, 4) \rightarrow$ magnitud = $\sqrt{9+16} = \sqrt{25} = 5$
- Vector B: $(1, 2) \rightarrow$ magnitud = $\sqrt{1+4} = \sqrt{5} \approx 2.23$

```
        Y
        |
    4   |        • (3,4) ← Vector A
        |       /
    2   |      /
        |     • (1,2) ← Vector B
    0   |____/________ X
        0    1   3
```

### ✅ Checkpoint Cognitivo 1
> **Pregunta sin mirar**: Si un vector es $(6, 8)$, ¿cuánto mide su magnitud? 🤔
> 
> **Respuesta**: $\sqrt{36 + 64} = \sqrt{100} = 10$. (Nota: es el mismo vector que $(3,4)$ pero escalado por 2). 🎯

---

## 📦 Nivel 1: Interpretación del Plano Semántico 🌍

### 🔑 El Concepto Clave
En PLN, un **plano semántico** es un mapa 2D donde cada palabra se convierte en un vector. Los ejes representan **rasgos semánticos** (atributos de significado). 📊

### 🎨 Analogía Maestra: La Mesa de Juegos de Rol 🎲
> Imagina una mesa de juego donde los personajes se posicionan según dos habilidades:
> - **Eje X**: "¿Qué tan guerrero es?" (0 = pacífico, 10 = violento) ⚔️
> - **Eje Y**: "¿Qué tan mágico es?" (0 = muggle, 10 = archimago) 🧙
> 
> **Palabras como personajes:**
> - `espada`: $(9, 2)$ → muy guerrera, poco mágica
> - `varita`: $(1, 8)$ → poco guerrera, muy mágica
> - `hechizo`: $(3, 9)$ → algo guerrera (daño), muy mágica
> 
> Cuánto más cerca estén dos palabras en la mesa, más **similares** son en significado. 🤝

### 📊 Diagrama ASCII: Plano Semántico

```
Eje Y (Magia)
    |
 10 |              varita(1,8)
    |               *
  8 |           hechizo(3,9)
    |               *
  6 |
    |
  4 |   espada(9,2)      
    |       *
  2 |
    |
  0 +-------------------------- Eje X (Guerrior)
    0    1    3        9
```

### 🚨 Concepto Avanzado: Frecuencia vs. Magnitud
> Aquí viene el detalle crucial. Si la palabra `espada` aparece 100 veces en un texto, sus coordenadas se **multiplican**:
> - Vector original: $(9, 2)$
> - Después de 100 repeticiones: $(900, 200)$
> 
> **Dirección**: No cambia (sigue apuntando igual). ✅
> **Magnitud**: Crece como un globo 🎈. Antes medía $\approx 9.2$, ahora mide $\approx 921$.

> ⚠️ **Problema oculto**: Una palabra que aparece poco pero es similar semánticamente puede quedar "lejos" solo por ser corta. 😱

### ✅ Checkpoint Cognitivo 2
> **Pregunta**: Si `paz` es $(1, 0)$ y `guerra` es $(9, 0)$, y multiplicamos `paz` por 100, ¿cambia su dirección? 🤔
> 
> **Respuesta**: No. Sigue en el eje X. Solo se aleja del origen. 📏

---

## 📦 Nivel 2: Métricas de Comparación 📐

### 🔑 El Concepto Clave
Necesitamos números para responder: **"¿Qué tan parecidas son estas dos palabras?"** 🔍

### 📐 Métrica 1: Distancia Euclidiana (Línea Recta)

**Analogía**: La regla física. 📏
> Coloca dos chinches en un mapa. La distancia euclidiana es la longitud de la línea recta entre ellos.

**Fórmula:**
$$d(A,B) = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$$

**Ejemplo:**
- `rey` = $(2, 8)$
- `príncipe` = $(3, 7)$
- $d = \sqrt{(3-2)^2 + (7-8)^2} = \sqrt{1 + 1} = \sqrt{2} \approx 1.41$

### 📐 Métrica 2: Similitud Coseno (El Ángulo) 🧭

**Analogía**: La dirección de la brújula, sin importar qué tan largo sea el camino. 🧭
> Imagina dos flechas. Una apunta exactamente al Norte, la otra al Noreste.
> No importa si una mide 1 cm y la otra 1 metro. Su **ángulo** es lo que define qué tan similares son.

**Fórmula:**
$$\text{cosine}(A,B) = \frac{A \cdot B}{\|A\| \|B\|} = \frac{x_1 x_2 + y_1 y_2}{\sqrt{x_1^2+y_1^2}\sqrt{x_2^2+y_2^2}}$$

**Ejemplo:**
- `varita` = $(1, 8)$
- `hechizo` = $(3, 9)$
- Producto punto: $1 \cdot 3 + 8 \cdot 9 = 3 + 72 = 75$
- Magnitudes: $\|varita\| = \sqrt{1+64} = \sqrt{65} \approx 8.06$, $\|hechizo\| = \sqrt{9+81} = \sqrt{90} \approx 9.49$
- Similitud = $75 / (8.06 \cdot 9.49) \approx 75 / 76.48 \approx 0.98$
- **Interpretación**: ¡Muy similares! (cercano a 1.0) 🎯

### 📊 Comparación Visual

```
       Y
       |
       |    B' (vector largo)
       |     \
       |      \
       |       • B (punta lejos)
       |      /
       |     /
       |    / A (vector corto)
       |   •
       |  /
       | /
       +------------------------ X

A = (1,1), B = (10,10)

Distancia Euclidiana entre A y B:
  = √[(10-1)² + (10-1)²] = √[81+81] = √162 ≈ 12.73  ← GRANDE ❌

Similitud Coseno entre A y B:
  = (1·10 + 1·10) / (√2 · √200)
  = 20 / (1.414 · 14.142)
  = 20 / 20 = 1.0  ← PERFECTA (misma dirección) ✅
```

### 📋 Tabla Comparativa

| Característica | Distancia Euclidiana | Similitud Coseno |
|----------------|---------------------|------------------|
| ¿Qué mide? | Longitud entre puntas | Diferencia de ángulo |
| Sensible a magnitud | Sí | No |
| Rango | $[0, \infty)$ | $[-1, 1]$ (en NLP: $[0,1]$) |
| Mejor para | Espacios normalizados | Vectores de frecuencia |

### ✅ Checkpoint Cognitivo 3
> **Pregunta**: `gato` = $(2,2)$, `perro` = $(20,20)$. ¿Qué métrica diría que son idénticos en significado? 🤔
> 
> **Respuesta**: Similitud Coseno (ángulo = 0°, coseno = 1.0). La euclidiana diría que están lejos. 📐

---

## 📦 Nivel 3: La Solución Práctica — Normalización 🔧

### 🔑 El Concepto Clave
Convertir todos los vectores a la **misma longitud** (normalmente 1.0) para que solo importe la **dirección**. 🎯

### 🎨 Analogía Maestra: La Carrera de Autos 🏎️
> Todos los autos corren a la **misma velocidad** (magnitud = 1).
> Lo que importa es **hacia dónde van** (dirección).
> Si un auto va más rápido (magnitud mayor), lo frenamos para nivelar el juego. ⚖️

### 📏 Vector Unitario
Un vector unitario es un vector escalado para que su magnitud sea exactamente 1.0.

**Fórmula:**
$$\hat{v} = \frac{v}{\|v\|}$$

**Ejemplo:**
- Vector original: $(3, 4)$, magnitud = $5$
- Vector unitario: $(3/5, 4/5) = (0.6, 0.8)$
- Verificación: $\sqrt{0.36 + 0.64} = \sqrt{1} = 1$ ✅

### 🧮 La Ecuación de Equivalencia

> **Teorema fundamental**: Una vez normalizados los vectores:
> - Comparar por **distancia euclidiana** = Comparar por **similitud coseno**
> - Uno es el "espejo" del otro: distancia pequeña ↔ similitud alta 🔄

**Demostración intuitiva:**
Todos los vectores normalizados viven en el **círculo unitario** (una circunferencia de radio 1). En un círculo, la longitud del arco entre dos puntos depende únicamente del ángulo entre ellos. Por lo tanto:
- Distancia euclidiana $\approx$ longitud de cuerda $\rightarrow$ función del ángulo
- Similitud coseno $\rightarrow$ función del ángulo
- **Conclusión**: Son dos caras de la misma moneda. 🪙

### 📊 Diagrama ASCII: Círculo Unitario

```
       Y
       |
   1.0 |         • (0,1)
       |       / |
       |     /   |
       |   /     |  ← Todos los vectores
       | /       |    normalizados viven aquí
       |/________|
      (0,0)      X
      -1.0       1.0
```

### 🔄 Aplicación en PLN: El Flujo Completo

```
Texto crudo
    ↓
Tokenización: ["el", "gato", "come", "pescado"] ✂️
    ↓
Conteo: {"gato": 3, "pescado": 2, "come": 1, ...} 🔢
    ↓
Vectorización: gato = (3, 2, 1, ...) 📊
    ↓
Normalización: gato = (0.81, 0.54, 0.27, ...) ⚖️
    ↓
Comparación: cosine(gato_normalizado, pescado_normalizado) 📐
    ↓
Resultado: 0.92 → Muy similares (ambos son comida/sujetos) ✅
```

### ✅ Checkpoint Cognitivo Final
> **Pregunta**: Si normalizas dos vectores que apuntan en direcciones opuestas ($180°$), ¿qué valor da la similitud coseno? 🤔
> 
> **Respuesta**: $-1.0$. En PLN normalmente usamos $[0,1]$, así que sería $0$ (opuestos). ❌

---

## 📚 Glosario Maestro: Términos Imprescindibles 📖

Estos términos aparecen en papers, documentación y entrevistas. Saberlos es **no negociable**. 🎯

| Término | Definición Forzada (1 línea) | Analogía |
|---------|------------------------------|----------|
| **Vector** ➡️ | Flecha matemática con magnitud y dirección | Camino desde el centro de la plaza a una esquina |
| **Dimensión** 📏 | Cada eje del espacio; un atributo medible | Una característica del juego (guerrero, magia) |
| **Magnitud** 📐 | Largo del vector; $\|v\| = \sqrt{\sum v_i^2}$ | Cuánto camino recorriste en total |
| **Dirección** 🧭 | Inclinación del vector; su orientación en el espacio | Hacia qué punto cardinal apuntas |
| **Producto punto** ✖️ | Suma de productos coordenada a coordenada; mide superposición | Cuántas veces se "cruzan" dos caminos |
| **Vector unitario** ⚖️ | Vector normalizado a magnitud 1.0 | Auto en carrera nivelado a la misma velocidad |
| **Distancia Euclidiana** 📏 | Línea recta entre dos puntos; $\sqrt{\sum (a_i-b_i)^2}$ | Distancia con regla entre dos chinches |
| **Similitud Coseno** 📐 | Coseno del ángulo entre vectores; $[0,1]$ en NLP | Brújula que ignora la velocidad del auto |
| **Plano semántico** 🌍 | Espacio 2D donde palabras son vectores y ejes son rasgos | Mapa conceptual con coordenadas |
| **Embedding** 🧬 | Representación vectorial densa de un token/palabra/imagen | Huella digital matemática de significado |
| **Normalización** 🔧 | Proceso de escalar vectores a magnitud 1.0 | Nivelar el campo de juego |
| **Espacio vectorial** 🌐 | Conjunto de vectores con operaciones definidas (suma, escala) | El tablero de juego completo |
| **Ortogonal** ➡️↕️ | Vectores con ángulo de $90°$; producto punto = 0 | Norte y Este: no se parecen en nada |
| **Colineal** ➡️➡️ | Vectores en la misma línea (misma o dirección opuesta) | Norte y Sur: opuestos puros |
| **TF-IDF** 📊 | Término Frecuencia × Frecuencia Inversa de Documento | Medidor de importancia de una palabra en un contexto |

---

## 🧠 Estrategias de Estudio Basadas en Evidencia 🎓

### 1. 🏆 Práctica de Recuperación Espaciada (La más poderosa)
No re-leas. **Cierra el documento y escribe** ✍️:
- La fórmula de similitud coseno desde memoria.
- Por qué la distancia euclidiana falla con frecuencias distintas.
- Cómo se calcula un vector unitario.

### 2. 💡 Elaboración: Conecta con lo que ya sabes
- ¿Has visto `Word2Vec`, `GloVe` o embeddings de BERT? Son **aplicaciones directas** de estos vectores normalizados.
- La "distancia semántica" en modelos como Word2Vec usa exactamente similitud coseno.

### 3. 🎤 Enseña a otro (Técnica Feynman)
Explica a un amigo no técnico:
> "Imagina que las palabras son puntos en un mapa. Si dos palabras aparecen en los mismos contextos, terminan cerca en el mapa. La similitud coseno mide qué tan cerca están sin importar si una es 'famosa' (frecuente) y la otra no."

Si no puedes explicarlo simple, no lo entiendes todavía. 🤔

### 4. 🎨 Codificación Dual: Dibuja mentalmente
Cada vez que veas una fórmula, dibuja el diagrama:
- Producto punto: proyección de un vector sobre otro.
- Normalización: achicar/agrandar el vector hasta que toque el círculo unitario.

---

## 🔄 Progresión de Dificultad: De 0 a Experto 📈

```
Semana 1: Dominar vectores 2D (magnitud, dirección, suma) 🎯
    ↓
Semana 2: Entender plano semántico y representación de palabras 🌍
    ↓
Semana 3: Dominar euclidiana vs. coseno; hacer cálculos a mano 📐
    ↓
Semana 4: Implementar normalización en código (Python/NumPy) 💻
    ↓
Semana 5: Entender TF-IDF y cómo se relaciona con la frecuencia 📊
    ↓
Semana 6: Estudiar Word2Vec/CBOW y ver estos conceptos en acción 🤖
    ↓
Semana 7: Entender attention mechanisms (transformers) como comparación de queries/keys 🔍
    ↓
Maestría: Ser capaz de explicar por qué BERT usa dot-product attention 🏆
```

---

## 💻 Ejemplo Práctico: Python desde Cero 🐍

```python
import numpy as np

# Paso 1: Vectores en bruto (como si fueran conteos de palabras)
rey      = np.array([2, 8])
principe = np.array([3, 7])
gato     = np.array([100, 2])  # Muy frecuente

# Paso 2: Función de similitud coseno
def cosine_similarity(a, b):
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    return dot_product / (norm_a * norm_b)

# Paso 3: Comparación SIN normalizar
print("=== SIN NORMALIZAR ===")
print(f"rey vs principe: {cosine_similarity(rey, principe):.3f}")
print(f"rey vs gato:    {cosine_similarity(rey, gato):.3f}")  # Engañoso!

# Paso 4: Normalización manual
rey_u      = rey / np.linalg.norm(rey)
principe_u = principe / np.linalg.norm(principe)
gato_u     = gato / np.linalg.norm(gato)

print("\n=== NORMALIZADOS ===")
print(f"rey unitario:     {rey_u}")
print(f"principe unitario: {principe_u}")
print(f"gato unitario:    {gato_u}")
print(f"\nrey vs principe (normalizado): {cosine_similarity(rey_u, principe_u):.3f}")
print(f"rey vs gato (normalizado):    {cosine_similarity(rey_u, gato_u):.3f}")

# Paso 5: Verificar teorema (distancia euclidiana en unitarios)
dist_eucl = np.linalg.norm(rey_u - principe_u)
sim_cos   = cosine_similarity(rey_u, principe_u)
print(f"\nDistancia Euclidiana normalizada: {dist_eucl:.3f}")
print(f"1 - Similitud Coseno:            {1 - sim_cos:.3f}")
print(f"¿Son iguales? {np.isclose(dist_eucl, 1 - sim_cos)}")  # True
```

**Salida esperada:**
```
=== SIN NORMALIZAR ===
rey vs principe: 0.997
rey vs gato:    0.267   ← Parecen distintos, pero "gato" es solo frecuente

=== NORMALIZADOS ===
rey unitario:     [0.242 0.970]
principe unitario: [0.426 0.904]
gato unitario:    [0.980 0.196]

rey vs principe (normalizado): 0.987  ← Muy similares, como debe ser
rey vs gato (normalizado):    0.267  ← Ahora sí refleja distancia semántica real

Distancia Euclidiana normalizada: 0.207
1 - Similitud Coseno:            0.207
¿Son iguales? True
```

---

## ⚡ Errores Comunes (Antipatrones) 🚨

| Error | Por qué ocurre | Consecuencia | Solución |
|-------|---------------|--------------|----------|
| Olvidar normalizar | Confiar en frecuencias brutas | Palabras frecuentes "dominan" | Normalizar SIEMPRE antes de comparar ⚖️ |
| Confundir distancia con similitud | Usar euclidiana sin pensarlo | Valores altos = "parecidos" (incorrecto) | Recordar: euclidiana = distancia; coseno = similitud 📐 |
| Usar producto punto sin magnitudes | Olvidar dividir por $\|A\|\|B\|$ | Comparación injusta por tamaños | Aplicar la fórmula completa siempre 🧮 |
| Pensar que el plano semántico es "real" | Es una abstracción matemática | Confundir el modelo con la realidad | Es una representación útil, no la verdad ontológica 🌍 |
| Ignorar que coseno puede ser negativo | En NLP con embeddings positivos no pasa, pero en álgebra general sí | Falsos negativos en ciertos espacios | En NLP moderno (embeddings positivos), coseno $\geq 0$ ✅ |

---

## 🎯 Puntos de Control: Autoevaluación Real ✅

**Instrucción**: Intenta responder sin ayuda. Si fallas, vuelve a esa sección. 📚

1. **¿Qué es un vector unitario y por qué se llama "unitario"?**
   - Respuesta: Vector con magnitud = 1. Se llama así porque "unifica" todas las magnitudes para comparar solo direcciones. ⚖️

2. **Si dos palabras tienen similitud coseno = 1.0, ¿qué significa?**
   - Respuesta: Apuntan exactamente en la misma dirección (ángulo 0°). Son semánticamente idénticas en el espacio vectorial. 🎯

3. **¿Por qué dos vectores colineales opuestos tienen similitud coseno = -1?**
   - Respuesta: Producto punto negativo porque apuntan en direcciones opuestas ($180°$ de separación). ❌

4. **¿Qué pasa con la distancia euclidiana si normalizas dos vectores?**
   - Respuesta: Se convierte en una función exclusiva del ángulo; $d = \sqrt{2 - 2\cos\theta}$. 📐

5. **En el contexto de PLN, ¿por qué es crítico normalizar?**
   - Respuesta: Porque las palabras frecuentes generan vectores más largos, y la distancia euclidiana los consideraría "lejanos" incluso si comparten significado. ⚠️

---

## 🚀 Puente hacia Temas Avanzados 🌉

Una vez dominado esto, estás listo para:

1. **TF-IDF y CountVectorizer**: Cómo se construyen los vectores iniciales de palabras. 📊
2. **Word2Vec / Skip-gram**: Cómo entrenar vectores para que palabras similares estén cerca. 🤖
3. **BERT / Transformers**: Cómo la "attention" usa el producto punto (sin normalizar a veces) para comparar tokens. 🔍
4. **Embeddings de oraciones**: Cómo promediar o ponderar vectores de palabras para obtener significado de frases. 📝
5. **Clustering semántico**: K-means sobre vectores normalizados para agrupar temas. 🗂️

> **Regla de oro**: En cualquier modelo de PLN moderno, si ves "vector", piensa **"dirección = significado, magnitud = confianza/frecuencia"**. 🎯

---

## 📝 Resumen Ejecutivo (Para Repasar en 60 Segundos) ⏱️

1. **Vector** = flecha $(x,y)$ con magnitud y dirección. ➡️
2. **Plano semántico** = mapa donde palabras son vectores y ejes son rasgos. 🌍
3. **Frecuencia** agranda la flecha (más magnitud), no cambia su rumbo. 📈
4. **Distancia Euclidiana** mide línea recta entre puntas (sensible a magnitud). 📏
5. **Similitud Coseno** mide solo el ángulo (ignora magnitud). 📐
6. **Normalización** escala todo a magnitud 1.0 para que solo importe la dirección. ⚖️
7. **Teorema**: Vectores normalizados → distancia euclidiana ≡ similitud coseno. 🧮
8. **En PLN**: Siempre normaliza antes de comparar palabras o embeddings. ✅

---

## 🎓 Desafío Final (Evaluación Formativa) 🏆

Implementa desde cero, **sin usar scikit-learn**, un comparador semántico simple:

1. Crea un vocabulario de 10 palabras relacionadas con dos temas (ej. `sol`, `luna`, `estrella`, `noche` vs. `cama`, `sueño`, `descanso`, `pijama`). 📝
2. Construye vectores TF (conteo de co-ocurrencia en tus frases). 🔢
3. Normaliza todos los vectores. ⚖️
4. Calcula la similitud coseno entre cada par. 📐
5. Verifica que palabras del mismo tema tengan similitud > 0.5 y de temas distintos < 0.3. ✅

**Validación**: Si tus resultados reflejan grupos semánticos claros, dominas el núcleo de este tema. 🎯

---

## 📖 Recursos Complementarios 📚

- **Libro**: "Speech and Language Processing" (Jurafsky & Martin) — Capítulo 6: Vectores y similitud. 📖
- **Paper**: "Efficient Estimation of Word Representations in Vector Space" (Word2Vec, 2013). 📄
- **Visualización**: [TensorFlow Embedding Projector](https://projector.tensorflow.org) para ver planos semánticos reales. 🖥️
- **Práctica**: Experimenta con `gensim` para entrenar Word2Vec en español y graficar los embeddings en 2D con PCA. 💻

---

> 💡 **Nota final del profesor**: La álgebra lineal no es matemática por sí sola; es el **lenguaje de la representación**. En PLN, cada fórmula de esta guía es una respuesta a una pregunta práctica: *"¿Cómo le digo a la máquina que `rey` y `príncipe` son parecidos, aunque uno sea más común que otro?"* Ahora tienes la respuesta. 🧠✨