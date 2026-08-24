---
title: 'Análisis Técnico'
code: 'trading'
description: 'Masterclass de Análisis Técnico'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


## ¿Qué vas a aprender

En esta guía recorrerás los conceptos del análisis técnico aplicado a los mercados financieros:

- Cómo interpretar gráficos de precio y volumen para tomar decisiones informadas
- Las principales figuras y patrones de reversal y continuación
- Indicadores técnicos clave y cómo combinarlos para filtrar señales
- Cómo construir y validar una estrategia de trading con datos históricos
- Psicología del trading: gestión del riesgo y disciplina operativa


## Índice

1. [¿Qué es un agente de trading con IA?](#módulo-1--qué-es-un-agente-de-trading-con-ia)
2. [Stack tecnológico completo](#módulo-2--stack-tecnológico-completo)
3. [Arquitectura de memoria del agente](#módulo-3--arquitectura-de-memoria-del-agente)
4. [Guardrails y gestión de riesgo](#módulo-4--guardrails-y-gestión-de-riesgo)
5. [Las 5 rutinas diarias (Cron Jobs)](#módulo-5--las-5-rutinas-diarias-cron-jobs)
6. [Implementación paso a paso](#módulo-6--implementación-paso-a-paso)
7. [Optimización para máximo rendimiento](#módulo-7--optimización-para-máximo-rendimiento)
8. [Tu roadmap hacia la maestría](#módulo-8--tu-roadmap-hacia-la-maestría)

---

## Módulo 1 — ¿Qué es un agente de trading con IA?

> **Analogía clave:** Imagina que contratas a un analista financiero que *nunca duerme*, lee miles de noticias por minuto, recuerda todas las reglas que le diste, ejecuta operaciones sin emociones y aprende de sus errores — todo por el costo de unas APIs. Eso es un agente de trading con IA.

### ¿Qué hace exactamente?

1. **Investiga** — Lee noticias, analiza datos macroeconómicos, detecta patrones usando IA (Perplexity, web search).
2. **Decide** — Claude Opus razona qué comprar, cuánto, cuándo y por qué, siguiendo reglas estrictas que tú defines.
3. **Ejecuta** — Alpaca API envía órdenes reales al mercado sin intervención humana.
4. **Monitorea** — Revisa posiciones, stop-losses, y te avisa por ClickUp si algo importante pasa.
5. **Aprende** — Escribe sus propias notas en GitHub (archivos `.md`) y mejora su estrategia semana a semana.

### Objetivos principales

| Métrica | Valor |
|---|---|
| Superar S&P 500 | +10% anual |
| Operación | 24/7 sin intervención |
| Costo marginal | ~$0 (solo APIs) |
| Punto de partida | Paper trading (sin riesgo) |

> **Importante antes de empezar:** Ningún bot garantiza ganancias. El mercado tiene riesgo real. Siempre usa **paper trading** primero para validar antes de usar dinero real.

---

## Módulo 2 — Stack tecnológico completo

> **Analogía:** Piensa en el stack como la cocina de un restaurante de alta gama. Claude Opus es el chef principal, Alpaca es la cocina donde se sirve el plato (el trade), Perplexity es el asistente que trae ingredientes frescos (datos del mercado), y GitHub es el libro de recetas que evoluciona con cada plato.

### Las 5 capas del sistema

| Capa | Herramienta | Función |
|---|---|---|
| Orquestación | Claude Code (routines) | Scheduling y automatización |
| Razonamiento | Claude Opus 4.7 | Cerebro / toma de decisiones |
| Ejecución | Alpaca API | Broker / envío de órdenes |
| Investigación | Perplexity API | Noticias y datos de mercado |
| Memoria | GitHub + archivos .md | Logs, estrategia, aprendizajes |
| Alertas | ClickUp | Notificaciones al humano |

### Costos estimados por mes

| Herramienta | Costo aprox. | Para qué sirve |
|---|---|---|
| Claude API | $20–50/mes | Razonamiento principal del bot |
| Alpaca | $0 (paper) / $0 (real, comisión 0) | Broker donde se ejecutan trades |
| Perplexity API | $5–15/mes | Research de noticias y mercados |
| GitHub | $0 (free tier) | Memoria del agente, logs |
| ClickUp | $0–10/mes | Notificaciones y alertas |

### Ejemplo real de flujo completo

> El bot se despierta a las 8:30am (pre-market). Llama a Perplexity para buscar "NVIDIA earnings last 24h". Recibe 15 artículos resumidos. Claude Opus los analiza junto con la estrategia guardada en GitHub. Decide: "aumentar posición en NVDA 5% — señal positiva". Alpaca ejecuta la orden. ClickUp envía notificación: "Trade ejecutado: NVDA +$250".

---

## Módulo 3 — Arquitectura de memoria del agente

> **Analogía central:** Un LLM es como un genio con amnesia total después de cada conversación. La solución: darle un cuaderno (archivos `.md` en GitHub) donde escribe todo lo que aprende. Cada vez que "despierta" (un cron job), lee su propio cuaderno para recordar quién es, qué reglas sigue y qué pasó ayer.

### Los 5 archivos de memoria clave

#### 📋 STRATEGY.md — La constitución del bot

Define el carácter del bot. Contiene: objetivos a largo plazo, filosofía de inversión (value vs growth vs momentum), tolerancia al riesgo, y reglas que NUNCA puede romper.

```markdown
# Estrategia Principal
Objetivo: Superar S&P 500 en +8% anual
Horizonte: Swing trading (1–30 días)
Universo: SP500 + ETFs sectoriales
Max posición única: 15% del portafolio
Stop-loss global: -15% drawdown = pausar todo
```

#### 📊 TRADE_LOG.md — El diario de operaciones

El bot escribe aquí cada trade: por qué compró/vendió, qué datos usó, resultado. Esto le permite aprender y no repetir errores.

```markdown
## 2025-01-15 | MSFT | COMPRA
- Razón: Resultados Q4 +12% vs estimaciones
- Señal Perplexity: 8 artículos positivos / 1 negativo
- Entrada: $425.50 | Size: 8% portafolio
- Stop-loss: $400 (-5.9%)
- Resultado: +7.2% en 12 días ✅
```

#### 🧠 LEARNINGS.md — La evolución del bot

Cada semana el bot analiza sus trades y escribe aquí qué funcionó y qué no. Con el tiempo, su estrategia mejora automáticamente.

#### 📈 PORTFOLIO.md — Estado actual

Snapshot del portafolio actual. Se actualiza después de cada sesión de mercado para que la rutina siguiente sepa exactamente desde dónde parte.

#### 🚨 RISK_RULES.md — Los guardianes

Las reglas de riesgo que Claude DEBE verificar antes de cada trade. Si alguna se viola, el bot se detiene y notifica al humano.

### ¿Por qué GitHub y no una base de datos?

GitHub tiene historial de versiones (puedes ver cómo evolucionó la estrategia), es gratis, el bot puede hacer commits automáticos, y los archivos `.md` son perfectos para que Claude los entienda como texto natural. Además, si algo sale mal, puedes hacer rollback a la estrategia anterior con un solo comando.

---

## Módulo 4 — Guardrails y gestión de riesgo

> **Analogía:** Los guardrails son como los límites de velocidad en una autopista. No están ahí para hacerte ir lento — están ahí para que no choques. Un bot sin guardrails puede doblar tu dinero en un mes o perderlo todo en una semana. Con guardrails, el peor escenario es controlado.

### Las 7 reglas de hierro

- ✅ **Max 15% en una posición.** Si NVDA cae 30%, pierdes solo el 4.5% del total, no el 30%.
- ✅ **Stop-loss por posición: -7%.** Si una acción cae 7%, el bot cierra automáticamente sin emociones.
- ✅ **Max drawdown global: -15%.** Si el portafolio total cae 15%, el bot para TODO y espera instrucciones humanas.
- ✅ **No tradear earnings sin research.** El bot necesita al menos 5 artículos de Perplexity antes de operar en días de resultados.
- ✅ **Mantener siempre 20% en cash.** Para aprovechar oportunidades y cubrir margin calls inesperados.
- ✅ **No operar en VIX > 35.** Alta volatilidad = el bot entra en modo defensivo (ETFs de bonos, cash).
- ✅ **Revisión humana semanal obligatoria.** Los viernes el bot genera un reporte completo para que tú lo revises.

### Cálculo de tamaño de posición (position sizing)

**Fórmula de Kelly simplificada:**

```
Posición (%) = (Win Rate × Avg Win) − ((1 − Win Rate) × Avg Loss)
                ÷ Avg Win

Ejemplo:
Win Rate = 60% | Avg Win = +8% | Avg Loss = -4%
= (0.6 × 8) − (0.4 × 4) ÷ 8
= (4.8 − 1.6) ÷ 8 = 40% → reducir a la mitad = 20% max

Pero el guardrail dice max 15% → usamos 15%
```

> **Ejercicio:** Tu bot tiene $10,000. Una acción cae 30%. Con el guardrail de max 15% por posición y stop-loss de -7%, la pérdida real es: $10,000 × 15% = $1,500 en posición × 7% stop = **$105 de pérdida máxima** — no $3,000.

---

## Módulo 5 — Las 5 rutinas diarias (Cron Jobs)

> **Analogía:** Piensa en las rutinas como el horario de un trader de Wall Street. Tiene rituales matutinos antes de que abra el mercado, decisiones de apertura, revisión al mediodía, cierre de posiciones al final del día, y una retrospectiva semanal. Tu bot sigue exactamente ese mismo ritmo — pero automáticamente.

### El calendario del bot

#### ⏰ 8:30 AM — Rutina 1: Research matutino

Lee `STRATEGY.md` y `PORTFOLIO.md`. Llama a Perplexity: "noticias de las últimas 12h para mis posiciones actuales". Genera lista de acciones para monitorear. Detecta eventos del día (earnings, FOMC, datos económicos). Guarda resumen en `MORNING_BRIEF.md`.

#### ⏰ 9:30 AM — Rutina 2: Ejecución de apertura

Lee el `MORNING_BRIEF.md`. Consulta precios en tiempo real via Alpaca. Aplica guardrails. Decide y ejecuta órdenes de apertura. Escribe cada trade en `TRADE_LOG.md`. Envía notificación a ClickUp con las operaciones del día.

#### ⏰ 12:30 PM — Rutina 3: Scan de mediodía

Revisa P&L de posiciones abiertas. Ajusta stop-losses si hay ganancias (trailing stop). Detecta noticias breaking que requieran acción. Solo opera si hay señales muy claras.

#### ⏰ 3:45 PM — Rutina 4: Resumen del día

Calcula P&L total del día. Actualiza `PORTFOLIO.md` con estado actual. Escribe reflexión en `TRADE_LOG.md`. Verifica guardrails globales. Envía reporte diario a ClickUp.

#### ⏰ Viernes 4:30 PM — Rutina 5: Revisión semanal

Analiza todos los trades de la semana. Calcula métricas (win rate, Sharpe ratio, comparación vs SPY). Actualiza `LEARNINGS.md` con insights. Puede proponer cambios a `STRATEGY.md`. Hace commit a GitHub.

### Configuración de cron en Claude Code

```yaml
# .claude/routines.yml
routines:
  - name: pre_market_research
    schedule: "30 8 * * 1-5"   # 8:30am Lun-Vie
    prompt_file: routines/pre_market.md
    
  - name: market_open_execution
    schedule: "30 9 * * 1-5"   # 9:30am Lun-Vie
    prompt_file: routines/open_execution.md
    
  - name: midday_scan
    schedule: "30 12 * * 1-5"  # 12:30pm Lun-Vie
    prompt_file: routines/midday.md
    
  - name: eod_summary
    schedule: "45 15 * * 1-5"  # 3:45pm Lun-Vie
    prompt_file: routines/eod.md
    
  - name: weekly_review
    schedule: "30 16 * * 5"    # Viernes 4:30pm
    prompt_file: routines/weekly.md
```

---

## Módulo 6 — Implementación paso a paso

### Estructura del proyecto

```
trading-agent/
├── .claude/
│   ├── routines.yml          # Cron schedules
│   └── settings.json         # Configuración Claude Code
├── memory/
│   ├── STRATEGY.md           # La constitución
│   ├── TRADE_LOG.md          # Diario de trades
│   ├── PORTFOLIO.md          # Estado actual
│   ├── LEARNINGS.md          # Evolución
│   └── RISK_RULES.md         # Guardrails
├── routines/
│   ├── pre_market.md         # Prompt pre-market
│   ├── open_execution.md     # Prompt apertura
│   ├── midday.md             # Prompt mediodía
│   ├── eod.md                # Prompt cierre
│   └── weekly.md             # Prompt semanal
├── tools/
│   ├── alpaca_client.py      # Wrapper para Alpaca
│   ├── perplexity_client.py  # Wrapper para Perplexity
│   └── github_memory.py      # Leer/escribir archivos .md
└── README.md
```

### Pasos de implementación

1. **Crear cuenta Alpaca paper trading** — alpaca.markets → Paper Trading → conseguir API Key y Secret. Completamente gratis, sin dinero real.
2. **Instalar Claude Code** — `npm install -g @anthropic-ai/claude-code`. Requiere Node.js 18+.
3. **Crear repositorio GitHub** — Este será el "cerebro" del bot. Inicializar con los 5 archivos `.md` de memoria.
4. **Escribir STRATEGY.md** — Tu estrategia en lenguaje natural. Claude la leerá y la seguirá. Sé muy específico.
5. **Configurar variables de entorno** — NUNCA pongas API keys en el repo. Usar `.env` local o variables del sistema.
6. **Crear los prompts de rutinas** — Cada archivo `routines/*.md` es el "prompt maestro" de esa rutina.
7. **Paper trading por 4 semanas** — Ejecutar el bot en modo simulación. Revisar `TRADE_LOG.md` diariamente.
8. **Go live con capital pequeño** — Solo si el paper trading muestra resultados positivos ($500–$2000 iniciales).

### Ejemplo de prompt de rutina (pre_market.md)

```
Eres un agente de trading disciplinado. Es pre-market (8:30am ET).

PASO 1: Lee /memory/STRATEGY.md y /memory/PORTFOLIO.md
PASO 2: Lee /memory/RISK_RULES.md — verifica que no hay violaciones activas
PASO 3: Usa Perplexity para buscar:
  - "market news today premarket"
  - Noticias de cada ticker en mi portafolio actual
PASO 4: Analiza el sentimiento general del mercado
PASO 5: Crea un watchlist para hoy con tus top 5 oportunidades
PASO 6: Escribe el resumen en /memory/MORNING_BRIEF.md
PASO 7: Envía notificación a ClickUp con el brief del día

REGLA: Si el VIX es > 35, entra en modo defensivo.
REGLA: No hagas trades en esta rutina, solo research.
```

---

## Módulo 7 — Optimización para máximo rendimiento

> **Analogía:** La revisión semanal es como el entrenamiento de un deportista de élite. No solo compite — analiza sus métricas, identifica debilidades, y ajusta el plan. Tu bot hace lo mismo: cada viernes revisa sus "estadísticas de temporada" y propone mejoras. Tú apruebas los cambios, él los implementa.

### Métricas que debes rastrear

| Métrica | Qué mide | Benchmark |
|---|---|---|
| Win Rate | % de trades ganadores | > 55% es bueno |
| Sharpe Ratio | Retorno ajustado por riesgo | > 1.5 es excelente |
| Max Drawdown | Peor caída desde un pico | Mantener < 15% |
| Profit Factor | Ganancias ÷ Pérdidas | > 1.5 es sostenible |
| Alpha vs SPY | Rendimiento extra vs el índice | Objetivo: +5 a +10% |
| Avg Hold Time | Días promedio por trade | Depende de la estrategia |

### El ciclo de mejora continua

1. **El bot opera** — Ejecuta trades siguiendo la estrategia actual.
2. **Registra todo** — Cada decisión y su razonamiento en `TRADE_LOG.md`.
3. **Analiza el viernes** — La rutina semanal calcula métricas y extrae patrones: "Cuando compré en gap-up lunes por la mañana, perdí el 70% de esas veces".
4. **Propone mejoras** — Claude escribe sugerencias en `LEARNINGS.md`: "Evitar gaps de lunes hasta tener más datos".
5. **Tú apruebas** — Revisas el reporte del viernes y decides qué cambios aceptar en `STRATEGY.md`.
6. **El bot implementa** — Desde el lunes siguiente opera con la estrategia mejorada. Git commit guarda el historial.

> **Trampa común — el overfitting:** Si el bot ajusta su estrategia demasiado frecuentemente basándose en pocos trades, puede "memorizar" el pasado y fallar en el futuro. Regla práctica: necesitas mínimo **30 trades** para cambiar una regla de estrategia, no 3.

---

## Módulo 8 — Tu roadmap hacia la maestría

### Las 4 fases de un experto

#### Fase 1 — Semanas 1–4: Fundamentos y paper trading

Configura el stack completo. Escribe tu `STRATEGY.md` con una estrategia simple (momentum de alto volumen). Activa todas las rutinas en modo papel. Tu objetivo: entender el flujo completo, no ganar dinero aún. Revisa cada trade y por qué el bot lo hizo.

**Herramientas:** Setup técnico · Paper trading · Estrategia simple

#### Fase 2 — Meses 2–3: Refinamiento y primeras mejoras

El bot ya tiene > 50 trades en log. Analiza los LEARNINGS semanales. Identifica tus 2–3 mejores señales. Elimina las que tienen peor performance. Considera agregar una segunda fuente de datos (ej: fear & greed index, opciones flow).

**Herramientas:** Análisis de métricas · Refinamiento · Nuevas señales

#### Fase 3 — Meses 4–6: Capital real y múltiples estrategias

Si el Sharpe ratio > 1.5 en paper: activa con capital pequeño ($500–$2000). Empieza a construir una segunda "sub-estrategia" complementaria (ej: defensive ETFs cuando VIX sube). El bot maneja dos estilos según el régimen de mercado.

**Herramientas:** Capital real pequeño · Multi-estrategia · Gestión de régimen

#### Fase 4 — Mes 6+: Sistema autónomo y escalado

El bot ya tiene su propia "personalidad" refinada. Puede proponer cambios a su propia estrategia sin que le preguntes. Considera despliegue en la nube (AWS/GCP) para eliminar dependencia de tu computadora. Escala el capital gradualmente con los rendimientos comprobados.

**Herramientas:** Nube 24/7 · Autonomía total · Escalar capital

### Los 3 principios del experto

**1. La memoria es todo.**
Un bot bien documentado (`STRATEGY.md`, `LEARNINGS.md`) vale 10 veces más que uno con código sofisticado pero sin contexto.

**2. Los guardrails primero, los rendimientos después.**
Un bot que nunca quiebra es mejor que uno que dobla tu dinero y luego lo pierde todo en una semana.

**3. Tú eres el supervisor, no el operador.**
Tu trabajo es revisar el `LEARNINGS.md` del viernes y aprobar mejoras — no microgestionar cada trade.

### Próximo paso concreto para ti

Hoy mismo:
- Abre [alpaca.markets](https://alpaca.markets) y crea una cuenta de paper trading.
- Crea un repositorio GitHub llamado `trading-agent`.
- Escribe tu primer `STRATEGY.md` en lenguaje natural.

Eso solo ya te pone en el 5% superior de personas que toman acción.

---

*Masterclass generada con Claude — Anthropic · 2026*