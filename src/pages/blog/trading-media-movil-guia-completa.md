---
title: "Cómo Calcular Medias Móviles en Trading: Guía Completa SMA, EMA, WMA, SMMA y HMA"
description: "Aprende las fórmulas, ejemplos numéricos, implementación en Python y configuración en TradingView, MT4/5 y Excel para usar medias móviles en trading."
pubDate: "2026-06-16"
code: "trading"
category: "trading"
tags:
  [
    "trading",
    "media-movil",
    "sma",
    "ema",
    "analisis-tecnico",
    "matematicas-financieras",
    "python",
    "tradingview",
  ]
difficulty: "intermedio"
readingTime: 25
---


## ¿Qué vas a aprender

En esta guía recorrerás los conceptos del análisis técnico aplicado a los mercados financieros:

- Cómo interpretar gráficos de precio y volumen para tomar decisiones informadas
- Las principales figuras y patrones de reversal y continuación
- Indicadores técnicos clave y cómo combinarlos para filtrar señales
- Cómo construir y validar una estrategia de trading con datos históricos
- Psicología del trading: gestión del riesgo y disciplina operativa


# Cómo Calcular Medias Móviles en Trading

> 💡 **En esta guía aprenderás**: qué es una media móvil, cómo se calculan SMA, EMA, WMA, SMMA y HMA, cómo interpretarlas sin convertirlas en señales mágicas, y cómo implementarlas en Python, TradingView, MT4/5 y Excel.

## RESUMEN EJECUTIVO

| Concepto | Idea central | Mejor uso | Riesgo principal |
|----------|--------------|-----------|------------------|
| **SMA** | Promedio aritmético simple | Contexto limpio y tendencia general | Mucho lag |
| **EMA** | Promedio con más peso a precios recientes | Entradas más sensibles y seguimiento rápido | Más señales falsas |
| **WMA** | Promedio con pesos lineales | Dar prioridad manual a datos recientes | Pesos subjetivos |
| **SMMA** | Promedio suavizado tipo Wilder | Suavizar ruido sin perder continuidad | Reacción lenta |
| **HMA** | Combinación de WMA para reducir lag | Lectura rápida de giros | Puede exagerar ruido |

> ⚠️ **Aviso importante** — Esta guía es educativa. No constituye asesoramiento financiero. Las medias móviles son herramientas de análisis, no garantías de ganancia.

---

## 🌐 PARTE 1: QUÉ ES UNA MEDIA MÓVIL Y POR QUÉ SE USA

Una **media móvil** calcula un promedio de precios que se actualiza a medida que llega nueva información. En trading, normalmente se calcula sobre el precio de cierre de cada vela, aunque también puede usarse sobre máximo, mínimo, típico o cualquier serie de datos.

La palabra clave es **móvil**: no es un promedio fijo. Cada nuevo cierre reemplaza al dato más antiguo y el resultado se recalcula.

```
Media móvil N = promedio de los últimos N cierres
```

### ¿Por qué se usan en trading?

| Necesidad del trader | Qué aporta una media móvil |
|----------------------|----------------------------|
| Ver dirección general | Filtra parte del ruido del precio |
| Comparar corto vs largo plazo | Ayuda a identificar aceleración o desaceleración |
| Medir distancia del precio | Permite detectar extensiones o zonas cercanas al promedio |
| Automatizar análisis | Es fácil de calcular en código y plataformas |

> **💡 Concepto Clave** — Una media móvil no predice el futuro. Resume el pasado reciente para que puedas tomar decisiones con menos ruido visual.

### Analogía 1: La brújula del río

Imagina un río con pequeñas olas en la superficie. El precio es cada ola: sube, baja, se rompe y cambia de forma todo el tiempo. La media móvil es la corriente principal del río: no muestra cada gota, pero sí la dirección general del agua.

Si la corriente apunta al norte, no significa que cada ola vaya perfectamente al norte. Significa que la fuerza dominante del río va en esa dirección.

### Fórmula genérica

```
MA(N) = función de suavizado(Cierre[t], Cierre[t-1], ..., Cierre[t-N+1])
```

Donde:

| Símbolo | Significado |
|---------|-------------|
| `N` | Cantidad de períodos |
| `Cierre[t]` | Precio de cierre actual |
| `Cierre[t-1]` | Precio de cierre anterior |
| `MA(N)` | Media móvil de N períodos |

---

## 📊 PARTE 2: LOS 5 TIPOS DE MEDIAS MÓVILES

Antes de ver cada fórmula, usemos el mismo dataset para comparar resultados.

### Dataset de trabajo: 10 cierres diarios

| Día | Cierre |
|-----|--------|
| 1 | 100 |
| 2 | 102 |
| 3 | 101 |
| 4 | 105 |
| 5 | 108 |
| 6 | 107 |
| 7 | 110 |
| 8 | 113 |
| 9 | 111 |
| 10 | 116 |

---

### 2.1 SMA — Simple Moving Average

La **SMA** es la media móvil simple. Suma los últimos `N` cierres y divide por `N`.

```
SMA(N) = (Cierre[t] + Cierre[t-1] + ... + Cierre[t-N+1]) / N
```

Ejemplo con `SMA-5`:

```
SMA-5 día 5 = (100 + 102 + 101 + 105 + 108) / 5
SMA-5 día 5 = 516 / 5
SMA-5 día 5 = 103.2
```

| Día | Cierres usados | Suma | SMA-5 |
|-----|----------------|------|-------|
| 5 | 100, 102, 101, 105, 108 | 516 | 103.20 |
| 6 | 102, 101, 105, 108, 107 | 523 | 104.60 |
| 7 | 101, 105, 108, 107, 110 | 531 | 106.20 |
| 8 | 105, 108, 107, 110, 113 | 543 | 108.60 |
| 9 | 108, 107, 110, 113, 111 | 549 | 109.80 |
| 10 | 107, 110, 113, 111, 116 | 557 | 111.40 |

> **💡 Concepto Clave** — La SMA trata todos los cierres del período con el mismo peso. El cierre de hoy vale lo mismo que el cierre de hace 19 días en una SMA-20.

---

### 2.2 EMA — Exponential Moving Average

La **EMA** es una media móvil exponencial. Le da más peso a los precios recientes y menos peso a los precios antiguos.

```
K = 2 / (N + 1)

EMA[t] = (Precio[t] - EMA[t-1]) × K + EMA[t-1]
```

También puede escribirse así:

```
EMA[t] = Precio[t] × K + EMA[t-1] × (1 - K)
```

Para `EMA-5`:

```
K = 2 / (5 + 1)
K = 0.3333
```

En esta guía usaremos `α = 0.4` para ver una EMA más sensible al precio reciente.

| Día | Cierre | Cálculo EMA | EMA-5 α=0.4 |
|-----|--------|-------------|-------------|
| 1 | 100 | Semilla inicial | 100.0000 |
| 2 | 102 | (102 - 100) × 0.4 + 100 | 100.8000 |
| 3 | 101 | (101 - 100.8) × 0.4 + 100.8 | 100.8800 |
| 4 | 105 | (105 - 100.88) × 0.4 + 100.88 | 102.5280 |
| 5 | 108 | (108 - 102.528) × 0.4 + 102.528 | 104.7168 |
| 6 | 107 | (107 - 104.7168) × 0.4 + 104.7168 | 105.6301 |
| 7 | 110 | (110 - 105.6301) × 0.4 + 105.6301 | 107.3780 |
| 8 | 113 | (113 - 107.3780) × 0.4 + 107.3780 | 109.6268 |
| 9 | 111 | (111 - 109.6268) × 0.4 + 109.6268 | 110.1761 |
| 10 | 116 | (116 - 110.1761) × 0.4 + 110.1761 | 112.5057 |

Comparación rápida:

| Día | Cierre | SMA-5 | EMA-5 α=0.4 | Diferencia |
|-----|--------|-------|-------------|------------|
| 5 | 108 | 103.20 | 104.72 | EMA más cerca del precio |
| 6 | 107 | 104.60 | 105.63 | EMA sigue más rápido |
| 7 | 110 | 106.20 | 107.38 | EMA acelera antes |
| 8 | 113 | 108.60 | 109.63 | EMA se pega al movimiento |
| 9 | 111 | 109.80 | 110.18 | EMA se frena antes |
| 10 | 116 | 111.40 | 112.51 | EMA responde más rápido |

### Visualización: EMA vs SMA

```
PRECIO
  ↑
  |                              Precio  . . . . . . . . . . . . . . .
  |                            . .
  |                         . .
  |                      . .
  |                   . .          EMA-5  ───── sigue más cerca
  |                . .          SMA-5  ───── va más retrasada
  |             . .
  |          . .
  |       . .
  |    . .
  | . .
  └──────────────────────────────────────────────────────────────→ TIEMPO
```

> **💡 Concepto Clave** — La EMA reacciona antes porque los cierres recientes pesan más. Esa ventaja también es su desventaja: puede generar señales falsas cuando el mercado hace ruido.

---

### 2.3 WMA — Weighted Moving Average

La **WMA** es una media móvil ponderada. A diferencia de la SMA, no todos los cierres valen lo mismo.

Ejemplo con pesos `1, 2, 3, 4, 5`:

```
WMA(N) = Σ(Precio × Peso) / Σ(Pesos)
```

Para `WMA-5`:

```
WMA-5 = (C1×1 + C2×2 + C3×3 + C4×4 + C5×5) / (1+2+3+4+5)
WMA-5 = (C1×1 + C2×2 + C3×3 + C4×4 + C5×5) / 15
```

| Día | Cierres y pesos | Suma ponderada | WMA-5 |
|-----|-----------------|----------------|-------|
| 5 | 100×1, 102×2, 101×3, 105×4, 108×5 | 1567 | 104.47 |
| 6 | 102×1, 101×2, 105×3, 108×4, 107×5 | 1586 | 105.73 |
| 7 | 101×1, 105×2, 108×3, 107×4, 110×5 | 1613 | 107.53 |
| 8 | 105×1, 108×2, 107×3, 110×4, 113×5 | 1656 | 110.40 |
| 9 | 108×1, 107×2, 110×3, 113×4, 111×5 | 1662 | 110.80 |
| 10 | 107×1, 110×2, 113×3, 111×4, 116×5 | 1690 | 112.67 |

> **💡 Concepto Clave** — La WMA es intermedia entre SMA y EMA: responde más rápido que la SMA, pero mantiene una estructura más controlada que una EMA muy sensible.

---

### 2.4 SMMA — Smoothed Moving Average

La **SMMA** es una media móvil suavizada. En su versión tipo Wilder, usa el promedio anterior y lo combina con el precio actual.

```
SMMA[t] = (SMMA[t-1] × (N - 1) + Precio[t]) / N
```

Normalmente se inicializa con una SMA:

```
SMMA inicial = SMA(N)
```

Ejemplo con `SMMA-5`, usando `103.2` como primer valor:

| Día | Cálculo SMMA | SMMA-5 |
|-----|--------------|--------|
| 5 | Semilla = SMA-5 | 103.2000 |
| 6 | (103.2 × 4 + 107) / 5 | 103.9600 |
| 7 | (103.96 × 4 + 110) / 5 | 105.1680 |
| 8 | (105.168 × 4 + 113) / 5 | 106.7344 |
| 9 | (106.7344 × 4 + 111) / 5 | 107.3875 |
| 10 | (107.3875 × 4 + 116) / 5 | 109.1100 |

Comparación al día 10:

| Media | Valor día 10 | Lectura |
|-------|--------------|---------|
| **SMA-5** | 111.40 | Promedio puro de los últimos 5 cierres |
| **EMA-5 α=0.4** | 112.51 | Más sensible al cierre reciente |
| **WMA-5** | 112.67 | Pondera linealmente los últimos 5 |
| **SMMA-5** | 109.11 | Más suave, incluye historia previa |

> **💡 Concepto Clave** — La SMMA suaviza más que la EMA porque no deja morir tan rápido la información antigua. Es útil cuando querés menos ruido, pero puede llegar tarde a los cambios fuertes.

---

### 2.5 HMA — Hull Moving Average

La **HMA** busca reducir el lag manteniendo suavidad. Usa WMA en varias etapas.

Fórmula completa:

```
HMA(N) = WMA(2 × WMA(N/2) - WMA(N), √N)
```

Desglose:

```
1. Calcular WMA con período N/2
2. Multiplicar esa WMA por 2
3. Restar la WMA con período N
4. Aplicar otra WMA usando √N como período
```

Ejemplo simplificado con `HMA-4`:

```
HMA-4 = WMA(2 × WMA-2 - WMA-4, 2)
```

| Día | Precio | WMA-2 | WMA-4 | 2×WMA-2 - WMA-4 | HMA-4 |
|-----|--------|-------|-------|------------------|-------|
| 4 | 105 | — | 103.90 | 100.77 | 100.50 |
| 5 | 108 | 106.00 | 106.70 | 105.30 | 103.79 |
| 6 | 107 | 107.67 | 107.90 | 107.43 | 106.72 |
| 7 | 110 | 108.00 | 108.70 | 107.30 | 107.34 |
| 8 | 113 | 111.00 | 110.60 | 111.40 | 110.03 |
| 9 | 111 | 112.33 | 112.20 | 112.47 | 112.11 |
| 10 | 116 | 112.67 | 113.20 | 112.13 | 112.24 |

### Analogía 2: El río con corrientes

Pensá en una media móvil como una corriente de agua. La SMA es un río ancho y profundo: cambia lento y marca dirección general. La EMA es una corriente rápida cerca de la orilla: reacciona rápido, pero también se agita con cualquier piedra. La HMA intenta tomar la velocidad de la corriente rápida sin perder la estabilidad del río profundo.

### Comparación final de tipos

| Tipo | Fórmula base | Sensibilidad | Suavidad | Lag |
|------|--------------|--------------|----------|-----|
| **SMA** | Suma / N | Baja | Alta | Alto |
| **EMA** | EMA anterior + α × diferencia | Alta | Media | Medio |
| **WMA** | Suma ponderada / suma de pesos | Media-alta | Media | Medio-bajo |
| **SMMA** | Suavizado recursivo | Baja-media | Alta | Alto |
| **HMA** | WMA de WMA ajustada | Alta | Media | Bajo |

---

## 📈 PARTE 3: CÓMO INTERPRETAR MEDIAS MÓVILES EN TRADING

Una media móvil puede ayudar a leer contexto. No debe usarse como botón automático de compra o venta.

### 3.1 Pendiente de la media

| Pendiente | Interpretación |
|-----------|----------------|
| **Subiendo** | El promedio reciente está aumentando |
| **Bajando** | El promedio reciente está disminuyendo |
| **Plana** | El mercado puede estar lateral o sin dirección clara |

```
PRECIO
  ↑
  |        MA subiendo  ╱╱╱╱╱
  |      ╱╱╱
  |    ╱
  |  ╱
  |╱
  └────────────────────────→ TIEMPO
```

### 3.2 Precio por encima o por debajo de la media

| Posición del precio | Lectura general |
|---------------------|-----------------|
| **Precio sobre la media** | Contexto alcista reciente |
| **Precio bajo la media** | Contexto bajista reciente |
| **Precio cruzando la media** | Posible cambio de momentum |
| **Precio pegado a la media** | Mercado compacto o indeciso |

> **💡 Concepto Clave** — La distancia entre precio y media importa. Un precio muy separado de su media puede estar extendido; un precio muy cercano puede estar en consolidación.

### 3.3 Distancia entre medias

| Configuración | Lectura |
|---------------|---------|
| Media corta sobre media larga | Momentum positivo |
| Media corta bajo media larga | Momentum negativo |
| Medias muy separadas | Tendencia fuerte o posible sobreextensión |
| Medias muy juntas | Compresión, posible ruptura o rango |

### 3.4 Multi-timeframe

| Timeframe | Uso recomendado |
|-----------|-----------------|
| **1m / 5m** | Scalping, lectura rápida, mucho ruido |
| **15m / 1h** | Day trading y swing intraday |
| **4h / Daily** | Tendencia principal y filtro de contexto |
| **Weekly** | Marco macro, no para timing preciso |

```
Timeframe mayor:
  └── Define contexto general

Timeframe operativo:
  └── Define timing y ejecución

Timeframe menor:
  └── Refina entrada, no reemplaza al plan
```

---

## 🧠 PARTE 4: PATRONES COMUNES QUE USAN MEDIAS MÓVILES

Esta sección describe patrones comunes. No es una estrategia lista para operar; es una forma de entender cómo se combinan las medias móviles con el resto del análisis.

### 4.1 Trend-following

El trend-following usa medias móviles para identificar dirección y persistencia.

| Elemento | Uso de la media móvil |
|----------|-----------------------|
| Dirección | Pendiente de la media |
| Fuerza | Separación entre precio y media |
| Confirmación | Alineación entre varias medias |
| Filtro | Timeframe superior |

### 4.2 Mean reversion

La reversión a la media parte de la idea de que el precio puede volver cerca de su promedio después de una extensión.

| Condición | Lectura |
|-----------|---------|
| Precio muy lejos de la media | Posible extensión |
| Media plana | Mercado lateral |
| Precio vuelve hacia la media | Reversión parcial |
| Precio rompe con volumen | Puede no haber reversión |

> ⚠️ **Cuidado** — En tendencias fuertes, el precio puede permanecer extendido durante mucho tiempo. No asumas reversión solo porque el precio está lejos de la media.

### 4.3 Crossovers

Un crossover ocurre cuando una media corta cruza una media larga.

| Cruce | Lectura habitual |
|-------|------------------|
| Media corta cruza arriba a media larga | Momentum positivo |
| Media corta cruza abajo a media larga | Momentum negativo |
| Cruces frecuentes en rango | Señales falsas probables |
| Cruce con volumen y contexto | Mayor relevancia |

### 4.4 Filtro multi-timeframe

| Timeframe mayor | Timeframe operativo | Uso |
|-----------------|---------------------|-----|
| Daily | 1h | Confirmar tendencia principal |
| 1h | 15m | Filtrar operaciones intraday |
| 15m | 5m | Refinar timing |
| 5m | 1m | Scalping de alta precisión |

---

## 💻 PARTE 5: IMPLEMENTACIÓN EN CÓDIGO Y PLATAFORMAS

### 5.1 Python con pandas

```python
import pandas as pd
import numpy as np

# df debe tener una columna 'close'
# df['SMA_20'] = df['close'].rolling(window=20).mean()
# df['EMA_20'] = df['close'].ewm(span=20, adjust=False).mean()
```

#### SMA

```python
def sma(series, window):
    return series.rolling(window=window).mean()

df['SMA_20'] = sma(df['close'], 20)
```

#### EMA

```python
def ema(series, window):
    return series.ewm(span=window, adjust=False).mean()

df['EMA_20'] = ema(df['close'], 20)
```

#### WMA

```python
def wma(series, window):
    weights = np.arange(1, window + 1)
    return series.rolling(window).apply(
        lambda prices: np.dot(prices, weights) / weights.sum(),
        raw=True
    )

df['WMA_20'] = wma(df['close'], 20)
```

#### SMMA tipo Wilder

```python
def smma(series, window):
    result = pd.Series(index=series.index, dtype=float)

    result.iloc[window - 1] = series.iloc[:window].mean()

    for i in range(window, len(series)):
        result.iloc[i] = (
            result.iloc[i - 1] * (window - 1) + series.iloc[i]
        ) / window

    return result

df['SMMA_20'] = smma(df['close'], 20)
```

#### HMA

```python
def hma(series, window):
    half_window = int(window / 2)
    sqrt_window = int(np.sqrt(window))

    raw = (
        2 * wma(series, half_window) - wma(series, window)
    )

    weights = np.arange(1, sqrt_window + 1)

    return raw.rolling(sqrt_window).apply(
        lambda prices: np.dot(prices, weights) / weights.sum(),
        raw=True
    )

df['HMA_20'] = hma(df['close'], 20)
```

#### Tabla comparativa en pandas

```python
df['SMA_20'] = sma(df['close'], 20)
df['EMA_20'] = ema(df['close'], 20)
df['WMA_20'] = wma(df['close'], 20)
df['SMMA_20'] = smma(df['close'], 20)
df['HMA_20'] = hma(df['close'], 20)

comparativa = df[['date', 'close', 'SMA_20', 'EMA_20', 'WMA_20', 'SMMA_20', 'HMA_20']].tail(10)

print(comparativa)
```

### 5.2 TradingView

| Campo | Configuración típica |
|-------|----------------------|
| Indicador | Moving Average |
| Length | 20, 50, 100 o 200 |
| Source | Close |
| MA Type | Simple, Exponential, Weighted, Smoothed |
| Color | Diferente por período |
| Alertas | Cruce, posición del precio, pendiente |

Configuración práctica:

```markdown
1. Abrir gráfico
2. Click en Indicadores
3. Buscar "Moving Average"
4. Elegir tipo: Simple, Exponential, Weighted o Smoothed
5. Configurar Length
6. Configurar Source en Close
7. Duplicar indicador para comparar períodos
```

### 5.3 MetaTrader 4 / MetaTrader 5

| Campo | Valor recomendado |
|-------|-------------------|
| Period | 20, 50, 100 o 200 |
| Shift | 0 |
| Method | Simple, Exponential, Smoothed o Linear Weighted |
| Apply to | Close |

Ruta habitual:

```markdown
Insert → Indicators → Trend → Moving Average
```

Notas:

- MT4/5 no siempre incluye HMA nativa.
- Para HMA, normalmente se instala un indicador personalizado.
- Verificar que el histórico descargado sea suficiente antes de analizar.

### 5.4 Excel

Supongamos:

| Columna | Contenido |
|---------|-----------|
| A | Fecha |
| B | Close |
| C | SMA |
| D | EMA |

#### SMA en Excel

```text
=AVERAGE(B2:B21)
```

#### EMA en Excel

Si `F1` contiene `α` y `D20` contiene la EMA anterior:

```text
=(B21-D20)*$F$1+D20
```

#### Distancia del precio a la media

```text
=(B21-C21)/C21
```

#### Pendiente aproximada

```text
=C21-C20
```

---

## ⚙️ PARTE 6: CHECKLIST PRE-ANÁLISIS Y CONFIGURACIÓN

Antes de analizar un activo, configura el entorno para evitar conclusiones basadas en datos incorrectos.

### Indicadores

```markdown
## Checklist de indicadores

- [ ] Definí qué tipo de media voy a usar: SMA, EMA, WMA, SMMA o HMA
- [ ] Definí el período principal: 20, 50, 100, 200 u otro
- [ ] Definí si usaré una sola media o varias medias
- [ ] Diferencié colores por tipo y período
- [ ] Evité superponer demasiadas medias en el mismo gráfico
```

### Timeframes

```markdown
## Checklist de timeframes

- [ ] Elegí un timeframe mayor para contexto
- [ ] Elegí un timeframe operativo para análisis
- [ ] Elegí un timeframe menor solo para refinamiento
- [ ] Verifiqué que no estoy mezclando señales incompatibles
- [ ] Anoté la sesión horaria que estoy analizando
```

### Datos verificados

```markdown
## Checklist de datos

- [ ] Los precios incluyen ajustes por splits o dividendos cuando corresponde
- [ ] El histórico tiene suficiente profundidad para el período elegido
- [ ] El broker, exchange o fuente de datos usa el mismo horario
- [ ] No estoy calculando con velas incompletas
- [ ] Revisé gaps, suspensiones o datos faltantes
```

### Configuración técnica

```markdown
## Checklist técnico

- [ ] Python usa la misma columna de cierre que TradingView
- [ ] Excel no mezcla zonas horarias
- [ ] MT4/5 descargó histórico suficiente
- [ ] Las alertas se disparan sobre velas cerradas
- [ ] El backtest no usa información futura
```

> **💡 Concepto Clave** — Un error de configuración puede parecer una señal de mercado. Antes de confiar en una media móvil, confiá en que los datos y parámetros son correctos.

---

## ⚠️ PARTE 7: VENTAJAS, DESVENTAJAS Y ERRORES COMUNES

### Ventajas y desventajas por tipo

| Tipo | Ventaja | Desventaja |
|------|---------|------------|
| **SMA** | Simple, estable, fácil de explicar | Lenta para reaccionar |
| **EMA** | Responde rápido a cambios recientes | Puede generar ruido |
| **WMA** | Permite priorizar cierres recientes | Los pesos son subjetivos |
| **SMMA** | Suaviza muy bien el ruido | Puede llegar tarde |
| **HMA** | Reduce lag y mantiene suavidad relativa | Puede exagerar movimientos cortos |

### Errores comunes

| Error | Descripción | Solución |
|-------|-------------|----------|
| **Usar velas incompletas** | Calcular con una vela que todavía se está formando | Usar solo cierres confirmados |
| **Cambiar parámetros después de ver el resultado** | Ajustar hasta que el gráfico "quede lindo" | Definir parámetros antes del análisis |
| **Mezclar timeframes sin criterio** | Una señal diaria contradice una señal de 1m | Separar contexto, ejecución y refinamiento |
| **Ignorar comisiones y slippage** | Creer que un crossover pequeño es rentable | Incluir costos reales en backtests |
| **Usar HMA como magia** | Pensar que baja latencia significa precisión | Tratarla como indicador, no como certeza |
| **No verificar datos** | Analizar precios sin ajustes o con gaps raros | Revisar fuente, horario y calidad del histórico |

### Analogía 3: La resortera

Una media móvil puede comportarse como una resortera cuando el precio se aleja demasiado. Cuanto más se estira, más atención merece. Pero una resortera no siempre vuelve al centro de inmediato: puede seguir estirándose si la fuerza externa es fuerte. Por eso, la distancia a la media sirve como alerta, no como orden automática.

---

## 🧠 CHECKPOINT DE COMPRENSIÓN

### Nivel Básico

**1. ¿Qué es una media móvil?**

Respuesta sugerida: Es un promedio de precios que se recalcula a medida que llegan nuevos datos. En trading suele calcularse sobre cierres de velas para suavizar el ruido y observar dirección.

**2. ¿Cuál es la diferencia principal entre SMA y EMA?**

Respuesta sugerida: La SMA da el mismo peso a todos los cierres del período. La EMA da más peso a los precios recientes, por eso reacciona más rápido.

**3. ¿Qué significa que una media móvil esté subiendo?**

Respuesta sugerida: Que el promedio de los últimos períodos está aumentando. Esto suele indicar que el contexto reciente tiene dirección alcista.

### Nivel Intermedio

**4. ¿Por qué la EMA puede generar más señales falsas que la SMA?**

Respuesta sugerida: Porque responde más rápido a cambios recientes. Esa sensibilidad ayuda a detectar movimientos tempranos, pero también puede reaccionar a ruido temporal.

**5. ¿Qué diferencia hay entre WMA y SMA?**

Respuesta sugerida: La SMA pondera todos los precios por igual. La WMA asigna pesos diferentes, normalmente dando más importancia a los cierres recientes.

**6. ¿Para qué sirve una SMMA?**

Respuesta sugerida: Para suavizar la serie y reducir ruido, aceptando que la media puede reaccionar más lento que una EMA.

### Nivel Avanzado

**7. ¿Qué busca resolver la HMA?**

Respuesta sugerida: La HMA intenta reducir el lag de las medias móviles tradicionales manteniendo una línea relativamente suave mediante combinaciones de WMA.

**8. ¿Por qué es peligroso calcular con velas incompletas?**

Respuesta sugerida: Porque el precio actual puede cambiar antes del cierre. Si una señal se dispara con una vela abierta, puede desaparecer antes de confirmarse.

**9. ¿Cómo evitarías look-ahead bias al implementar medias móviles?**

Respuesta sugerida: Calculando indicadores solo con datos disponibles hasta ese momento, usando cierres confirmados y evitando desplazar señales hacia atrás en el tiempo.

### Auto-evaluación Rápida

Responde cada pregunta con ✅ (sí lo entiendo), ⚠️ (parcialmente) o ❌ (no lo tengo claro):

- [ ] Puedo calcular una SMA manualmente
- [ ] Puedo calcular una EMA con α
- [ ] Entiendo la diferencia entre WMA, SMMA y HMA
- [ ] Sé configurar una media móvil en TradingView
- [ ] Sé implementar SMA y EMA en pandas
- [ ] Entiendo por qué las velas incompletas generan señales falsas
- [ ] Puedo leer pendiente, distancia y separación entre medias
- [ ] Sé usar multi-timeframe sin mezclar contextos
- [ ] Puedo completar el checklist pre-análisis antes de estudiar un activo

**Si contestaste 7+ con ✅** — Podés avanzar a practicar implementación y comparación de medias en datos reales.

**Si contestaste 4-6 con ✅** — Repasá las fórmulas de EMA, WMA y SMMA, luego volvé a hacer los ejercicios numéricos.

**Si contestaste menos de 4 con ✅** — Empezá por SMA y EMA. No avances a HMA hasta entender bien el promedio ponderado.

---

## 📚 RECURSOS ADICIONALES

### Lecturas internas

- [Day Trading Minimalista: Solo 2 Indicadores (20 SMA + 200 SMA)](./day-trading-minimalista-sma.md) — Aplicación práctica de medias móviles en una estrategia minimalista.
- [Guía: Creando tu Plan de Trading y Estrategia Ganadora](./trading-plan-estrategia.md) — Cómo convertir indicadores en reglas, gestión y validación.

### Práctica recomendada: 2 semanas

```markdown
## Semana 1: Cálculo manual y visual

- Día 1: Elegir un activo y descargar 30 cierres
- Día 2: Calcular SMA-5 manualmente
- Día 3: Calcular EMA-5 con α=0.4
- Día 4: Calcular WMA-5 con pesos 1 a 5
- Día 5: Calcular SMMA-5 usando SMA-5 como semilla
- Día 6: Comparar todas las medias en una tabla
- Día 7: Graficar precio, SMA, EMA y HMA en TradingView

## Semana 2: Implementación y revisión

- Día 8: Implementar SMA y EMA en pandas
- Día 9: Implementar WMA, SMMA y HMA en pandas
- Día 10: Comparar resultados contra TradingView
- Día 11: Probar diferentes períodos: 10, 20, 50 y 200
- Día 12: Revisar señales sobre velas cerradas
- Día 13: Anotar errores de configuración
- Día 14: Escribir conclusiones: qué media se adapta mejor a cada contexto
```

---

## CIERRE

Las medias móviles son simples de calcular, pero poderosas cuando se entienden bien. La clave no está en encontrar una media “perfecta”, sino en saber qué está calculando cada una:

- **SMA** resume el pasado con igualdad.
- **EMA** responde más al presente.
- **WMA** permite ponderar manualmente.
- **SMMA** suaviza para reducir ruido.
- **HMA** intenta combinar suavidad y baja latencia.

Una media móvil bien configurada no elimina la incertidumbre. Lo que hace es ordenar la información para que tomes decisiones con menos ruido y más disciplina.

---

**Próxima guía:** Gestión de Riesgo Avanzada — position sizing, drawdown máximo y reglas de supervivencia.

---

*Calculá antes de operar. Configurá antes de confiar. Practicá antes de arriesgar capital real.*
