---
title: "Algo-Trading con Fable 5 y Jesse: Guía Completa"
description: "Aprende a desarrollar, backtestear y validar estrategias de trading algorítmico automatizado usando Fable 5 y el framework Jesse."
pubDate: "2026-06-14"
code: "algo-trading-jesse-fable5"
category: "trading"
tags:
  [
    "algo-trading",
    "jesse",
    "fable5",
    "backtesting",
    "crypto",
    "trading",
    "python",
    "estrategias",
  ]
difficulty: "avanzado"
readingTime: 45
---


## ¿Qué vas a aprender

En este contenido desarrollarás los conocimientos para operar en mercados financieros con criterio:

- Tipos de activos, mercados y participantes del ecosistema financiero
- Análisis fundamental y técnico aplicado a la toma de decisiones
- Gestión de riesgo, posicionamiento y psicología del trader
- Estrategias probadas para diferentes perfiles y horizontes temporales
- Herramientas, plataformas y framework para operar de forma consistente


# Algo-Trading con Fable 5 y Jesse: Guía Completa

## INTRODUCCIÓN — EL TRADING ALGORÍTMICO AUTORIZADO POR IA

El trading algorítmico ya no es territorio exclusivo de fondos de cobertura y bancos de inversión. Con herramientas como **Jesse** (framework de backtesting para crypto) y modelos de IA como **Fable 5**, cualquier desarrollador puede diseñar, validar y optimizar estrategias de trading automatizado desde su laptop.

> **🎯 Objetivo de Aprendizaje** — Al final de esta guía, serás capaz de utilizar Fable 5 para investigar y generar estrategias de trading, implementarlas en Jesse, realizar backtesting robusto, optimizar hiperparámetros sin caer en overfitting, y validar mediante simulaciones Monte Carlo.

### ¿Por qué combinar Fable 5 + Jesse?

| Herramienta | Rol | Ventaja |
|-------------|-----|---------|
| **Fable 5** | Investigación y código | Generación de estrategia, análisis estadístico, explicación de lógica |
| **Jesse** | Backtesting y ejecución | Simulación realista, múltiples exchanges, bajo costo |

El workflow típico es:
1. **Fable 5** investiga y propone una estrategia con fundamentos estadísticos
2. **Jesse** la implementa y valida con datos históricos
3. **Monte Carlo** confirma que no es curve-fitting

---

## 🌐 PARTE 1: JESSE FRAMEWORK

### 1.1 ¿Por qué Jesse y no Backtrader o TradingView?

Jesse está diseñado específicamente para **crypto**, con soporte nativo para:

- Múltiples timeframes (1m, 5m, 15m, 30m, 1h, 4h, 6h, 12h, 1D)
- Live trading con brokers reales
- Walk-forward optimization
- Simulación de slippage y comisiones realistas

| Característica | Jesse | Backtrader | TradingView (Pine Script) |
|----------------|-------|------------|---------------------------|
| Enfoque | Crypto-native | General | Visual/charting |
| Lenguaje | Python | Python | Pine Script |
| Live trading | ✅ nativo | ✅ con broker | ❌ solo backtesting |
| Costo | Gratis | Gratis | Suscripción |
| Comunidad crypto | Activa | General | Muy activa |

### 1.2 Instalación y Configuración

```bash
# Instalación via pip
pip install jesse

# Verificar instalación
jesse --version

# Iniciar nuevo proyecto
jesse init mi-estrategia-trading

# Estructura del proyecto
mi-estrategia-trading/
├── strategies/
│   └── MiEstrategia.py
├── datas/
├── logs/
└── config.yaml
```

### 1.3 Estructura de una Estrategia en Jesse

```python
from jesse import utils
from jesse.strategies import Strategy
import jesse.indicators as ta


class TrendFollowingETH(Strategy):
    def __init__(self):
        super().__init__()

        # Hiperparámetros optimizables
        self.hp = {
            # Bollinger Bands
            'bb_period': 20,
            'bb_std': 2,

            # EMA
            'ema_fast': 12,
            'ema_slow': 26,

            # ATR para stop-loss
            'atr_period': 14,
            'atr_multiplier': 1.5,
        }

        # Solo operar en timeframe de 30 minutos
        self.timeframe = '30m'

        # Solo ETHUSDT
        self.symbol = 'ETHUSDT'

    def should_long(self) -> bool:
        # Condición de entrada: precio sobre EMA lenta + BB inferior toca mínimo
        close = self.price
        ema_slow = ta.ema(self.candles, self.hp['ema_slow'])
        bb_lower = ta.bbands(self.candles, self.hp['bb_period'], self.hp['bb_std']).lowerband

        return close > ema_slow and close <= bb_lower * 1.02

    def should_short(self) -> bool:
        return False  # Solo long por ahora

    def should_cancel(self) -> bool:
        return True

    def go_long(self):
        # Entrada con 100% del capital
        self.buy = [
            (self.price, 1.0)  # (precio, porcentaje del capital)
        ]

        # Stop-loss basado en ATR
        atr = ta.atr(self.candles, self.hp['atr_period'])
        self.stop_loss = self.price - (atr * self.hp['atr_multiplier'])

    def go_short(self):
        pass

    def update_position(self):
        # Take-profit: 2:1 ratio
        if self.position.pnl / self.position.entry_price > 0.02:
            self.liquidate()
```

### 1.4 Importar Datos Históricos

```bash
# Importar datos de Binance (requiere API key)
jesse import-candles Binance ETHUSDT 2023-01-01 2024-01-01

# Importar datos de CSV personalizado
jesse import-candles --csv ./datos/ethusdt.csv --exchange Binance --symbol ETHUSDT
```

---

## 🤖 PARTE 2: FABLE 5 PARA TRADING

### 2.1 Prompts Especializados para Investigación de Estrategias

```markdown
# Prompt para generación de estrategia
Eres un quantitative researcher especializado en trading algorítmico de crypto.
Analiza el par ETHUSDT en timeframe de 30 minutos y propón una estrategia
trend-following que:

1. Use indicadores técnicos clásicos (EMA, Bollinger Bands, RSI, ATR)
2. Tenga reglas de entrada/salida claras y ejecutables
3. Incluya gestión de riesgo con stop-loss y take-profit
4. Justifique cada decisión con datos históricos

Formata la respuesta como:
- Nombre de la estrategia
- Indicadores y parámetros sugeridos
- Lógica de entrada (condiciones exactas)
- Lógica de salida (stop-loss, take-profit, trailing)
- Métricas objetivo (Sharpe ratio, max drawdown)
```

### 2.2 Análisis de Significancia Estadística

```python
# Prompt para validar reglas internas de la estrategia
PROMPT_VALIDACION = """
Valida la significancia estadística de las siguientes reglas de trading:

Estrategia: Trend-following con EMA 12/26 + Bollinger Bands
Regla de entrada: Precio cruza encima de EMA26 Y toca banda inferior de BB

Preguntas a responder:
1. ¿Cuántas veces ocurrió esta condición en los últimos 6 meses?
2. ¿Cuál es el win rate histórico?
3. ¿La distribución de resultados es estadísticamente diferente del azar?
4. ¿Hay algún sesgo de supervivencia en los datos?

Usa test de chi-cuadrado o t-test para demostrar significancia.
"""
```

### 2.3 Explicación de Hiperparámetros

```markdown
# Prompt para explicar el código generado
Explica el siguiente código de estrategia en Jesse:

```python
class TrendFollowingETH(Strategy):
    def __init__(self):
        self.hp = {
            'bb_period': 20,
            'bb_std': 2,
            'ema_fast': 12,
            'ema_slow': 26,
            'atr_period': 14,
            'atr_multiplier': 1.5,
        }
```

Para cada hiperparámetro:
1. ¿Qué hace técnicamente?
2. ¿Qué pasa si aumentas o disminuyes el valor?
3. ¿Hay valores típicos usados en la industria?
4. ¿Cómo afecta al riesgo de la estrategia?
```

---

## 📊 PARTE 3: DESARROLLO DE ESTRATEGIA (CASO REAL)

### 3.1 El Workflow Completo (Basado en el Video)

| Fase | Herramienta | Duración | Objetivo |
|------|-------------|----------|----------|
| **Investigación** | Fable 5 | 2-4 min | Generar estrategia con lógica clara |
| **Implementación** | Jesse + Fable 5 | 5-10 min | Traducir a código Python |
| **Backtesting inicial** | Jesse | 30 seg | Ver rendimiento gross |
| **Optimización** | Jesse optimize | 2-5 min | Encontrar mejores hiperparámetros |
| **Validación Monte Carlo** | Jesse + script | 3-5 min | Confirmar robustez |

### 3.2 Implementación Paso a Paso

**Paso 1: Generación de estrategia con Fable 5**

```
Prompt: "Diseña una estrategia trend-following para ETHUSDT en 30m usando
Bollinger Bands para entry y ATR para stop-loss. Incluye parámetros específicos
con rangos de optimización."
```

**Respuesta de Fable 5 (ejemplo):**

```
Estrategia: BB-ATR Trend Follower

Indicadores:
- Bollinger Bands: period=20, std=2
- EMA: fast=12, slow=26
- ATR: period=14

Entrada long: precio > EMA26 AND close < BB lower band
Stop-loss: entry - (ATR * 1.5)
Take-profit: entry + (ATR * 3)  # 2:1 R:R

Parámetros a optimizar:
- bb_period: rango 15-30, paso 5
- bb_std: rango 1.5-2.5, paso 0.25
- atr_multiplier: rango 1.0-2.5, paso 0.25
```

**Paso 2: Implementar en Jesse**

```python
from jesse import utils
from jesse.strategies import Strategy
import jesse.indicators as ta


class BBATRTrendFollower(Strategy):
    def __init__(self):
        super().__init__()
        self.timeframe = '30m'
        self.symbol = 'ETHUSDT'

    @property
    def hyperparameters(self):
        return [
            {'name': 'bb_period', 'type': 'int', 'default': 20, 'min': 15, 'max': 30, 'step': 5},
            {'name': 'bb_std', 'type': 'float', 'default': 2.0, 'min': 1.5, 'max': 2.5, 'step': 0.25},
            {'name': 'ema_fast', 'type': 'int', 'default': 12, 'min': 8, 'max': 20, 'step': 2},
            {'name': 'ema_slow', 'type': 'int', 'default': 26, 'min': 20, 'max': 50, 'step': 4},
            {'name': 'atr_multiplier', 'type': 'float', 'default': 1.5, 'min': 1.0, 'max': 2.5, 'step': 0.25},
        ]

    def should_long(self) -> bool:
        candles = self.candles
        bb_period = self.hp['bb_period']
        bb_std = self.hp['bb_std']
        ema_slow = self.hp['ema_slow']

        close = self.price
        ema = ta.ema(candles, ema_slow)
        bbands = ta.bbands(candles, bb_period, bb_std)

        # Precio sobre EMA lenta
        price_above_ema = close > ema

        # Precio cerca o toca banda inferior (con 2% de margen)
        at_bb_lower = close <= bbands.lowerband * 1.02

        return price_above_ema and at_bb_lower

    def should_short(self) -> bool:
        return False

    def go_long(self):
        atr = ta.atr(self.candles, 14)  # ATR fijo para stop
        atr_multiplier = self.hp['atr_multiplier']

        self.buy = [(self.price, 1.0)]

        # Stop-loss: precio - (ATR * multiplier)
        self.stop_loss = self.price - (atr * atr_multiplier)

        # Take-profit: 2:1 risk-reward
        self.take_profit = self.price + (atr * atr_multiplier * 2)

    def update_position(self):
        # Trail stop cuando estamos en ganancia
        if self.position.pnl > 0:
            atr = ta.atr(self.candles, 14)
            new_stop = self.price - (atr * 1.0)
            if new_stop > self.stop_loss:
                self.stop_loss = new_stop
```

**Paso 3: Backtesting inicial**

```bash
# Ejecutar backtest
jesse backtest 2023-01-01 2024-01-01

# Resultado esperado:
# Sharpe Ratio: 1.34
# P&L: 130%
# Total trades: 47
# Win rate: 62%
```

### 3.3 Métricas de Rendimiento

| Métrica | Valor Óptimo | Valor en Ejemplo | Interpretación |
|---------|--------------|------------------|----------------|
| **Sharpe Ratio** | > 1.0 | 1.34 | Excelente riesgo-retorno |
| **P&L** | Positivo | 130% | Rentabilidad anualizada |
| **Max Drawdown** | < 20% | 12% | Caída máxima aceptable |
| **Win Rate** | > 50% | 62% | Alta probabilidad de acierto |
| **Avg Trade** | > 0 | +2.3% | Cada trade gana en promedio |
| **Total Trades** | > 30 | 47 | Muestra estadísticamente válida |

---

## 🔬 PARTE 4: BACKTESTING ROBUSTO Y OPTIMIZACIÓN

### 4.1 El Peligro del Overfitting

> **⚠️ Warning** — Una estrategia que funciona perfectamente en backtesting pero falla en live trading sufrió **overfitting** (curve-fitting). Esto ocurre cuando optimizamos tanto los hiperparámetros que la estrategia "memoriza" los datos históricos en lugar de capturar una tendencia real.

```
Overfitting en una frase: "Mi estrategia gana 500% porque encontré los 
parámetros exactos que hubieran funcionado en el pasado, pero no tienen 
ningún fundamento para el futuro."
```

### 4.2 Optimización con Walk-Forward

```bash
# Walk-forward optimization
# Divide datos en training (70%) y validation (30%)
# Optimiza en training, valida en validation

jesse optimize \
    --start 2023-01-01 \
    --end 2024-01-01 \
    --warmup 300 \
    --epochs 100 \
    --method gradient_descent
```

### 4.3 Script de Optimización Completo

```python
# optimize_strategy.py
import jesse.helpers as jh
from jesse import utils
from jesse.strategies import Strategy
import jesse.indicators as ta


class OptimizedStrategy(Strategy):
    def __init__(self):
        super().__init__()
        self.timeframe = '30m'
        self.symbol = 'ETHUSDT'

    @property
    def hyperparameters(self):
        return [
            {'name': 'bb_period', 'type': 'int', 'default': 20, 'min': 15, 'max': 30, 'step': 5},
            {'name': 'bb_std', 'type': 'float', 'default': 2.0, 'min': 1.5, 'max': 2.5, 'step': 0.25},
            {'name': 'ema_slow', 'type': 'int', 'default': 26, 'min': 20, 'max': 50, 'step': 6},
            {'name': 'atr_multiplier', 'type': 'float', 'default': 1.5, 'min': 1.0, 'max': 2.5, 'step': 0.25},
        ]

    def should_long(self) -> bool:
        candles = self.candles
        close = self.price
        ema = ta.ema(candles, self.hp['ema_slow'])
        bbands = ta.bbands(candles, self.hp['bb_period'], self.hp['bb_std'])

        return close > ema and close <= bbands.lowerband * 1.02

    def should_short(self) -> bool:
        return False

    def go_long(self):
        atr = ta.atr(self.candles, 14)
        self.buy = [(self.price, 1.0)]
        self.stop_loss = self.price - (atr * self.hp['atr_multiplier'])
        self.take_profit = self.price + (atr * self.hp['atr_multiplier'] * 2)

    def update_position(self):
        if self.position.pnl > 0:
            atr = ta.atr(self.candles, 14)
            new_stop = self.price - (atr * 1.0)
            if new_stop > self.stop_loss:
                self.stop_loss = new_stop


# Comando para optimizar
if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--start', type=str, required=True)
    parser.add_argument('--end', type=str, required=True)
    args = parser.parse_args()

    # Esta clase sería usada por Jesse en CLI
    print(f"Optimizando desde {args.start} hasta {args.end}")
```

---

## 🎲 PARTE 5: MONTE CARLO Y VALIDACIÓN

### 5.1 ¿Por qué Monte Carlo?

El análisis Monte Carlo **rompe la secuencia histórica** de trades y los reordena aleatoriamente múltiples veces. Si la estrategia sigue siendo rentable después de 1000 reordenamientos, es probable que no sea curve-fitting.

```
Ejemplo:
Secuencia real:     [+5%, -2%, +3%, +1%, -1%, +4%, +2%]
Reordenamiento 1:   [+3%, +5%, -1%, +2%, -2%, +1%, +4%]
Reordenamiento 2:   [-1%, +2%, +5%, -2%, +3%, +4%, +1%]

Si todos los reordenamientos dan positivo → estrategia robusta
```

### 5.2 Ejecutar Simulación Monte Carlo en Jesse

```bash
# Ejecutar backtest con Monte Carlo
jesse backtest 2023-01-01 2024-01-01 --monte-carlo 1000

# Output esperado:
# Monte Carlo Results (1000 simulations)
# ──────────────────────────────────────────
# Best case:     180% P&L
# Worst case:    45% P&L
# Median:        125% P&L
# Std deviation: 28%
# ──────────────────────────────────────────
# Probability of profit: 94.2%
# Probability of Sharpe > 1: 87.3%
```

### 5.3 Interpretar Resultados

| Resultado Monte Carlo | Significado | Acción |
|-----------------------|-------------|--------|
| P&L median > 0 | Estrategia rentable en general | ✅ Aceptar |
| P&L worst case > 0 | Aún rentable en peor escenario | ✅ Muy robusto |
| Probability of profit > 80% | Alta confianza | ✅ Proceder |
| Sharpe > 1 en > 70% de casos | Buen riesgo-retorno | ✅ Aceptar |

> **⚠️ Criterio del Video** — El creador del video usó un umbral de **Sharpe ratio > 1.2** como objetivo. La estrategia logró **1.34**, pero solo después de validación Monte Carlo con 1000 simulaciones confirmó que el 87.3% de las veces mantenía Sharpe > 1.

---

## 📈 PARTE 6: MÉTRICAS Y KPIs

### 6.1 Dashboard de Métricas

```python
# metrics_dashboard.py
class TradingMetrics:
    def __init__(self, trades, initial_balance=10000):
        self.trades = trades
        self.initial_balance = initial_balance
        self.balance = initial_balance

    def calculate_all(self):
        return {
            'sharpe_ratio': self.sharpe_ratio(),
            'sortino_ratio': self.sortino_ratio(),
            'max_drawdown': self.max_drawdown(),
            'calmar_ratio': self.calmar_ratio(),
            'win_rate': self.win_rate(),
            'avg_win': self.avg_win(),
            'avg_loss': self.avg_loss(),
            'profit_factor': self.profit_factor(),
            'total_trades': len(self.trades),
            'pnl_percent': self.pnl_percent(),
        }

    def sharpe_ratio(self, risk_free=0.02):
        returns = [t['pnl_percent'] for t in self.trades]
        avg_return = sum(returns) / len(returns)
        std_return = (sum((r - avg_return) ** 2 for r in returns) / len(returns)) ** 0.5
        return (avg_return - risk_free) / std_return if std_return > 0 else 0

    def max_drawdown(self):
        peak = self.initial_balance
        max_dd = 0
        for trade in self.trades:
            self.balance *= (1 + trade['pnl_percent'] / 100)
            if self.balance > peak:
                peak = self.balance
            dd = (peak - self.balance) / peak * 100
            if dd > max_dd:
                max_dd = dd
        return max_dd

    def win_rate(self):
        wins = sum(1 for t in self.trades if t['pnl_percent'] > 0)
        return wins / len(self.trades) * 100

    def profit_factor(self):
        gross_profit = sum(t['pnl_percent'] for t in self.trades if t['pnl_percent'] > 0)
        gross_loss = abs(sum(t['pnl_percent'] for t in self.trades if t['pnl_percent'] < 0))
        return gross_profit / gross_loss if gross_loss > 0 else float('inf')

    def pnl_percent(self):
        return (self.balance - self.initial_balance) / self.initial_balance * 100
```

### 6.2 Tabla de Referencia Rápida

| Métrica | Fórmula | Umbral Bueno | Umbral Excellent |
|---------|---------|--------------|------------------|
| **Sharpe Ratio** | (Return - RiskFree) / StdDev | > 1.0 | > 2.0 |
| **Sortino Ratio** | (Return - RiskFree) / DownsideStd | > 1.0 | > 1.5 |
| **Calmar Ratio** | Return / MaxDrawdown | > 1.0 | > 3.0 |
| **Win Rate** | Wins / Total | > 50% | > 60% |
| **Profit Factor** | GrossProfit / GrossLoss | > 1.5 | > 2.0 |
| **Max Drawdown** | Peak - Trough / Peak | < 20% | < 10% |

---

## ⚠️ PARTE 7: ADVERTENCIAS Y LIMITACIONES

### 7.1 Disclaimer Obligatorio

> **⚠️ AVISO IMPORTANTE** — Este contenido es exclusivamente **educativo e investigativo**. No constituye asesoramiento financiero. El trading algorítmico involucra riesgos sustanciales de pérdida. Resultados pasados no garantizan resultados futuros. Siempre realiza tu propia investigación (DYOR) y nunca inviertas más de lo que puedas permitirte perder.

### 7.2 Errores Comunes

| Error | Descripción | Solución |
|-------|-------------|----------|
| **Look-ahead bias** | Usar datos futuros en decisiones | Usar solo candles cerrados |
| **Survivorship bias** | Ignorar activos que desaparecieron | Incluir datos de assets eliminados |
| **Transaction costs ignorados** | No incluir comisiones/slippage | Configurar fees realistas |
| **Short testing period** | Solo testar en mercado alcista | Testear en múltiples períodos |
| **Single asset** | Depender solo de ETH | Diversificar entre assets |

### 7.3 Recomendaciones Pre-Live

```markdown
## Checklist Antes de Ir a Producción

- [ ] Backtesting en datos fuera de muestra (out-of-sample)
- [ ] Simulación Monte Carlo con > 500 iteraciones
- [ ] Sharpe ratio > 1.0 en múltiples períodos
- [ ] Max drawdown < 20% en estrés
- [ ] Paper trading por 2-4 semanas mínimo
- [ ] Posición pequeña inicial (max 5% del capital)
- [ ] Stop-loss siempre activo
- [ ] Monitorización diaria de métricas
```

---

## 🧠 CHECKPOINT DE COMPRENSIÓN

### Nivel Básico

**1. ¿Qué es el backtesting y por qué es esencial en algo-trading?**

Respuesta sugerida: Es la simulación de una estrategia con datos históricos para evaluar su rendimiento antes de operar con dinero real. Es esencial porque permite validar si una estrategia tiene fundamento estadístico sin arriesgar capital.

**2. ¿Cuál es la diferencia entre overfitting y una estrategia robusta?**

Respuesta sugerida: El overfitting ocurre cuando la estrategia "memoriza" datos históricos y no generaliza. Una estrategia robusta mantiene rendimiento positivo incluso cuando se reordena aleatoriamente (Monte Carlo) o se testa en datos fuera de muestra.

**3. ¿Qué indica un Sharpe Ratio mayor a 1.0?**

Respuesta sugerida: Indica que el retorno de la estrategia compensa adecuadamente el riesgo tomado. Un Sharpe de 1.0 significa que por cada unidad de riesgo, obtienes una unidad de retorno extra sobre el activo libre de riesgo.

### Nivel Intermedio

**4. ¿Por qué la simulación Monte Carlo es importante para validar una estrategia?**

Respuesta sugerida: Porque rompe la secuencia temporal de los trades y verifica si la rentabilidad depende de un orden específico de resultados o si es genuinamente robusta. Si al reordenar aleatoriamente 1000 veces la estrategia sigue siendo rentable, no es curve-fitting.

**5. ¿Qué trade-off estás aceptando al usar un stop-loss ajustado vs uno holgado?**

Respuesta sugerida: Un stop ajustado limita las pérdidas pero aumenta la probabilidad de ser detenido prematuramente por "ruido" del mercado. Un stop holgado da más margen al precio pero expone a pérdidas mayores si la operación falla.

**6. Si el mercado cambia de tendencia a lateral, ¿qué le pasaría a una estrategia trend-following?**

Respuesta sugerida: La estrategia tendería a generar más señales falsas (whipsaws), reduciendo el win rate y aumentando las pérdidas. Las estrategias trend-following funcionan mejor en mercados con tendencias claras.

### Nivel Avanzado

**7. ¿Cómo decidirías si una estrategia es apta para live trading basándote en los resultados de Monte Carlo?**

Respuesta sugerida: Buscaría que: (a) el P&L del percentil 10 sea aún positivo, (b) la probabilidad de profit sea > 80%, (c) el Sharpe ratio se mantenga > 1 en > 70% de las simulaciones. Si todos estos criterios se cumplen, la estrategia tiene base sólida para paper trading.

**8. ¿Qué cambios harías a la estrategia BB-ATR si quisieras reducir el drawdown máximo manteniendo el Sharpe ratio?**

Respuesta sugerida: Podría: (a) reducir el tamaño de posición (risk sizing), (b) agregar un trailing stop más agresivo, (c) incluir un filtro de volatilidad que evite entradas cuando el ATR está muy alto, (d) añadir exposición short en momentos de tendencia bajista. El objetivo es encontrar el balance entre drawdown y rentabilidad.

**9. ¿Por qué Jesse usa candles de 30 minutos en lugar de 1 minuto para esta estrategia?**

Respuesta sugerida: Timeframes más altos (30m, 1h, 4h) tienen menos "ruido" y señales más significativas. En 1 minuto, los movimientos aleatorios son frecuentes y generan muchos falsos positivos. El 30m es un balance entre tener suficientes datos históricos y reducir el ruido.

### Auto-evaluación Rápida

Responde cada pregunta con ✅ (sí lo entiendo), ⚠️ (parcialmente) o ❌ (no lo tengo claro):

- [ ] Puedo explicar qué es el overfitting y por qué es peligroso
- [ ] Entiendo cómo el ATR se usa para calcular stop-loss y take-profit
- [ ] Puedo interpretar los resultados de un backtest en Jesse
- [ ] Sé qué significa Sharpe Ratio > 1 y por qué es importante
- [ ] Puedo explicar qué hace la simulación Monte Carlo
- [ ] Entiendo cuándo una estrategia está lista para paper trading
- [ ] Conozco los errores comunes: look-ahead bias, survivorship bias
- [ ] Puedo diseñar una estrategia básica con Bollinger Bands + EMA + ATR

**Si contestaste 6+ con ✅** — Estás listo para pasar a los ejercicios prácticos.

**Si contestaste 3-5 con ✅** — Repasa las secciones 3 y 4 antes de continuar.

**Si contestaste menos de 3 con ✅** — Vuelve a leer la guía completa, especialmente la Parte 3 y 4.

---

## 🏋️ PARTE 8: EJERCICIOS PRÁCTICOS

### Ejercicio 1: Configuración de Ambiente (I Do)

```bash
# 1. Instalar Jesse
pip install jesse

# 2. Crear proyecto
jesse init mi-primer-backtest
cd mi-primer-backtest

# 3. Importar datos
jesse import-candles Binance BTCUSDT 2023-01-01 2024-01-01

# 4. Crear estrategia básica
# Copia el código de estrategia de la Parte 3 en strategies/BasicStrategy.py

# 5. Ejecutar backtest
jesse backtest 2023-06-01 2024-01-01
```

**Entregable:** Screenshot del output del backtest con métricas.

### Ejercicio 2: Implementar y Optimizar (We Do)

```python
# Usando Fable 5, genera una estrategia con:
# - RSI como indicador principal
# - EMA como filtro de tendencia
# - Stop-loss dinámico con ATR

# Implementa en Jesse y optimiza con:
jesse optimize --epochs 50 --method random

# Compara:
# - Sharpe ratio antes vs después de optimización
# - Max drawdown antes vs después
```

**Entregable:** Código de estrategia + resultados de optimización antes/después.

### Ejercicio 3: Validación Monte Carlo (You Do)

```bash
# 1. Elige una estrategia del video o crea una propia
# 2. Ejecuta backtest completo
jesse backtest 2023-01-01 2024-01-01

# 3. Ejecuta Monte Carlo
jesse backtest 2023-01-01 2024-01-01 --monte-carlo 1000

# 4. Responde:
# - ¿Cuál es la probabilidad de profit?
# - ¿Cuál es el Sharpe ratio en el peor percentil?
# - ¿Recomendaría esta estrategia para live trading? ¿Por qué?
```

**Entregable:** Análisis escrito de 300 palabras con conclusiones y justificación.

---

## 📚 RECURSOS ADICIONALES

### Documentación

- [Jesse Framework Docs](https://docs.jesse.trade)
- [Jesse GitHub](https://github.com/jesse-ai/jesse)
- [Fable 5 API Reference](https://docs.fable.ai)

### Videos Recomendados

- Mastering the Art of Backtesting (Jesse official)
- Quantitative Trading Strategies (Trading Latam)
- Risk Management in Algo Trading (Better SYSTEM trader)

### Comunidades

- r/algotrading (Reddit)
- Jesse Discord community
- Elite Trader Forum

---

**Próxima guía:** Machine Learning para Trading — Cómo usar modelos predictivos para mejorar señales de entrada.

---

*¿Encontraste útil esta guía? Compártela con alguien que esté comenzando en algo-trading.*