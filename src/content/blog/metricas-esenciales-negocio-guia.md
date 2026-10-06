---
title: "Métricas Esenciales de Negocio: Ingresos, Clientes, Suscripciones y Márgenes"
description: "Guía paso a paso de business metrics: revenue vs profit, LTV, CAC, LTV/CAC, índice Big Mac, MRR, ROI, churn, paid vs blended CAC y utilidad bruta vs neta, con fórmulas y ejemplos numéricos."
pubDate: "2026-10-06"
code: "metricas-negocio"
language: "es"
category: "negocios"
tags: ["negocios", "metricas", "ltv", "cac", "roi", "finanzas"]
type: "guia"
level: "fundamento"
difficulty: "principiante"
readingTime: 16
---

# 📊 Métricas Esenciales de Negocio: Mide, Decide y Crece

Cuatro PARTES usables: separas ingresos de ganancia, mides al cliente, mides la suscripción y cuidas retención y márgenes.

## 🗺️ Mapa de 3 FASES

FASE 1 → Entiendes dinero (PARTE 1) → FASE 2 → Mides cliente e ingreso (PARTES 2 y 3) → FASE 3 → Retienes y ganas (PARTE 4).

👀 Cómo leerlo: 3 fases de izquierda a derecha, de fácil a difícil.

### 📚 Pre-training: 7 términos antes de empezar

| Término | Significado en 1 línea |
|---------|------------------------|
| Revenue | Todo lo que entra por ventas |
| Profit | Lo que queda tras pagar costos |
| LTV | Valor total de un cliente en el tiempo |
| CAC | Lo que cuesta conseguir 1 cliente |

*Continúa la tabla (2/2) — partida en bloques de ≤4 para no saturar.*

| Término | Significado en 1 línea |
|---------|------------------------|
| MRR | Ingreso que se repite cada mes |
| Churn | Clientes que se van cada mes |
| ROI | Lo que vuelve por cada peso invertido |

👀 Cómo leer las tablas: izquierda el nombre, derecha la idea corta.

## 💵 PARTE 1: Separa Entrar de Ganar (Nivel 1/5)

1. ❓ PRETEST — Vendes 100 mil al mes pero te quedan 5 mil. ¿Cómo se llama cada número? (Activa previas | Media)
> Respuesta esperada: 100 mil es revenue, 5 mil es profit o utilidad.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Crecer en ventas quebrando es el error clásico. Vas a lograr calcular revenue y profit de 1 caso y decir qué decide cada uno. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Anota tu mes: vendiste 50 mil y gastaste 38 mil. Profit = 12 mil. Ya separaste los 2 números. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: revenue es el agua que entra al balde, profit es la que queda tras los agujeros. Definición: revenue es la entrada total por ventas; profit es revenue menos todos los costos. Analogía de business metrics: el tablero del auto, cada aguja guía 1 decisión distinta. (Pre-training + señalización | Media)

| Métrica | Fórmula en 1 línea |
|---------|-------------------|
| Revenue | Suma de todo lo vendido en el mes |
| Profit | Revenue menos costos totales |
| Margen simple | Profit dividido revenue, por 100 |
| Decisión que guía | Revenue mide tracción, profit mide salud |

👀 Cómo leer la tabla: izquierda la métrica, derecha cómo se calcula. Ejemplo numérico: revenue 200 mil menos costos 150 mil = profit 50 mil, margen 25 por ciento. Por qué funciona: 2 números separan euforia de realidad. Cuándo falla: si festejas revenue sin restar devoluciones ni impuestos. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: kiosco con revenue 80 mil y costos 60 mil. I Do: profit = 80 mil menos 60 mil = 20 mil, margen 25 por ciento. We Do: si el alquiler sube 5 mil, ¿nuevo profit? → 15 mil. You Do: punto 7. Visual: Ventas → Resta costos → Profit y margen. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Decir gané 100 mil porque vendí 100 mil, ignorando costos. → Corrección: vendiste 100 mil; ganas solo lo que queda tras restar todo. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Con otro caso: revenue 120 mil, costos 90 mil. Calcula profit y margen.
> Respuesta esperada: profit 30 mil, margen 25 por ciento. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué diferencia revenue de profit? (Nivel Bloom: recordar) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Vender mucho no es ganar mucho, la resta manda.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Calculé revenue [ ] Resté costos [ ] Saqué margen. Siguiente: cuánto vale cada cliente. (Metacognición | Media)

## 🧲 PARTE 2: Cuánto Vale y Cuesta un Cliente (Nivel 2/5)

1. ❓ PRETEST — Gastas 10 mil en ads y ganas 100 clientes que dejan 500 cada uno. ¿Fue rentable? (Activa previas | Media)
> Respuesta esperada: sí, CAC 100 contra LTV 500, relación 5 a 1.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Pagar más por un cliente de lo que deja es quebrar con sonrisa. Vas a lograr calcular LTV, CAC y su relación en 1 caso. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Divide tu gasto en ads del mes por clientes nuevos. Ese número es tu CAC aproximado. Ya lo tienes. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: LTV es la cosecha total del árbol, CAC lo que costó plantarlo. Definición: LTV es el valor que deja un cliente en toda su vida; CAC es el costo total de conseguirlo, ads más sueldos de marketing divididos por clientes nuevos. Analogía de LTV/CAC: el termómetro del negocio, 3 a 1 o más es sano. (Pre-training + señalización | Media)

| Métrica | Fórmula en 1 línea |
|---------|-------------------|
| LTV simple | Ticket promedio por compras por vida media |
| CAC | Gasto total de marketing dividido nuevos clientes |
| LTV/CAC | LTV dividido CAC, sano desde 3 a 1 |
| Alerta | Menor a 1 a 1 pierdes con cada cliente |

👀 Cómo leer la tabla: izquierda la métrica, derecha su fórmula. Ejemplo numérico: ticket 500 por 4 compras al año por 3 años = LTV 6 mil; gasto 20 mil entre 100 clientes = CAC 200; relación 30 a 1, excelente. Por qué funciona: une gasto con ingreso en 1 número comparable. Cuándo falla: si omites sueldos y herramientas del CAC, te mientes. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: SaaS de 1 mil mensual, cliente dura 20 meses. I Do: LTV = 1 mil por 20 = 20 mil; CAC 4 mil; relación 5 a 1. We Do: si el cliente dura 10 meses, ¿nuevo LTV? → 10 mil. You Do: punto 7. Visual: Ticket y vida → LTV → Divide por CAC. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Calcular CAC solo con ads y festejar 10 a 1 que en realidad es 2 a 1. → Corrección: suma sueldos, comisiones y herramientas antes de dividir. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Otro caso: LTV 9 mil, gastas 30 mil y ganas 10 clientes. Calcula CAC y relación.
> Respuesta esperada: CAC 3 mil, relación 3 a 1, sana. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué es LTV y CAC, y desde cuándo la relación es sana? (Nivel Bloom: comprender) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Si cada cliente deja 3 veces lo que costó, el negocio respira.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Calculé LTV [ ] Calculé CAC real [ ] Saqué la relación. Siguiente: precios, suscripción y retorno. (Metacognición | Media)

## 🔁 PARTE 3: Precios, Suscripción y Retorno (Nivel 3/5)

1. ❓ PRETEST — 100 clientes pagan 500 al mes y una campaña de 20 mil trae 50 mil extra. ¿MRR y ROI? (Activa previas | Media)
> Respuesta esperada: MRR 50 mil; ROI = (50 mil menos 20 mil) sobre 20 mil = 150 por ciento.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Sin MRR no ves el futuro y sin ROI repites gastos ciegos. Vas a lograr calcular MRR y ROI más ajustar precios con poder adquisitivo. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Multiplica tus clientes activos por tu precio mensual. Ese es tu MRR de hoy. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: MRR es tu sueldo mensual del negocio, sabes con qué cuentas. Definición: MRR es clientes activos por precio promedio mensual. Analogía de ROI: la balanza de cada inversión, cuánto vuelve por cada peso. Analogía de Big Mac: la misma hamburguesa revela dónde el dinero rinde más o menos. (Pre-training + señalización | Media)

| Métrica | Fórmula en 1 línea |
|---------|-------------------|
| MRR | Clientes activos por precio mensual |
| ROI | Ganancia neta sobre inversión, por 100 |
| Big Mac | Precio local sobre precio base, ajusta tarifa |
| Cuándo usar ROI | Campañas y proyectos con inicio y fin |

👀 Cómo leer la tabla: izquierda la métrica, derecha su fórmula. Ejemplo numérico: 200 clientes por 800 = MRR 160 mil; campaña de 30 mil que deja 60 mil netos = ROI 200 por ciento. Por qué funciona: MRR anticipa caja y ROI premia lo que rinde. Cuándo falla: si metes clientes de prueba gratis al MRR, inflas el futuro. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: curso con suscripción de 1 mil y 150 alumnos. I Do: MRR = 150 por 1 mil = 150 mil. We Do: inviertes 50 mil en ads y ganas 200 mil netos, ¿ROI? → 400 por ciento. You Do: punto 7. Visual: Clientes por precio → MRR → ROI por campaña. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Contar ventas únicas dentro del MRR o pedir ROI a gastos fijos como el alquiler. → Corrección: MRR solo recurrente; ROI solo donde hay inversión con retorno. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA — Otro caso: 80 clientes de 2 mil mensuales; campaña de 40 mil deja 100 mil netos. Calcula MRR y ROI.
> Respuesta esperada: MRR 160 mil; ROI 250 por ciento. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: ¿qué es MRR y ROI, y qué revela el Big Mac? (Nivel Bloom: aplicar) (Recuperación | Alta)

9. 📌 IDEA CLAVE — MRR te dice el futuro, ROI te dice qué repetir.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Calculé mi MRR [ ] Saqué 1 ROI [ ] Ajusté 1 precio. Siguiente: retener y quedarte con más. (Metacognición | Media)

## 🛡️ PARTE 4: Retén y Quédate con Más (Nivel 5/5)

1. ❓ PRETEST — Pierdes 10 de 200 clientes al mes y tu margen neto es 10 por ciento. ¿Churn y diagnóstico? (Activa previas | Media)
> Respuesta esperada: churn 5 por ciento mensual, alto; margen neto fino para reinvertir.
> Si acertás: camino rápido → andá al punto 7.

2. 🎯 POR QUÉ + LOGRO — Un balde roto no se llena por más CAC barato. Vas a lograr calcular churn, separar paid de blended CAC y comparar márgenes bruta y neta. (Motivación | Media)

3. ⚡ VICTORIA RÁPIDA (<5 min) — Divide clientes perdidos del mes por los que tenías al inicio. Ese es tu churn. Ya lo ves. (Motivación | Heurística)

4. 💡 CONCEPTO — Analogía: churn es la gotera del balde, por ahí se va tu MRR. Definición: churn es bajas del mes sobre clientes iniciales, por 100. Analogía de paid vs blended: contar solo nafta vs contar todo el viaje con peajes. Analogía de bruta vs neta: pesar la fruta con y sin cáscara y flete. (Pre-training + señalización | Media)

| Métrica | Fórmula en 1 línea |
|---------|-------------------|
| Churn mensual | Bajas del mes sobre iniciales, por 100 |
| Paid CAC | Solo gasto pago sobre clientes pagos |
| Blended CAC | Todo marketing sobre todos los clientes |
| Bruta vs neta | Bruta tras costo directo, neta tras todo |

👀 Cómo leer la tabla: izquierda la métrica, derecha su fórmula. Ejemplo numérico: 15 bajas sobre 300 = churn 5 por ciento; revenue 500 mil, costo directo 300 mil = bruta 200 mil y 40 por ciento; gastos e impuestos 120 mil = neta 80 mil y 16 por ciento. Por qué funciona: separa fuga, costo real y ganancia verdadera. Cuándo falla: si usas paid CAC para decidir presupuesto total, subestimas el costo. (Worked example | Alta)

5. 👀 EJEMPLO RESUELTO — Caso: SaaS con churn 8 por ciento. I Do: con LTV/CAC de la PARTE 2 veo que la vida corta rompe la relación. We Do: ¿paid o blended para presupuesto? → blended, incluye orgánico. You Do: punto 7. Visual: Churn → Vida media → LTV real. 👀 Cómo leerlo: 3 pasos de izquierda a derecha. (Worked example | Alta)

6. ⚠️ CONTRA-EJEMPLO / ERROR TÍPICO — Festejar bruta de 60 por ciento con neta de 2 por ciento y sin caja. → Corrección: decide con neta y flujo, la bruta solo mide producción. (Autoexplicación | Media-Alta)

7. 🧪 PRÁCTICA MIXTA — Mezcla las 4 PARTES: con revenue 400 mil, costos 250 mil, 12 bajas sobre 200 y CAC 500 con LTV 2 mil, calcula profit, churn y LTV/CAC.
> Respuesta esperada: profit 150 mil; churn 6 por ciento; LTV/CAC 4 a 1. (Práctica + feedback | Media)

8. 🔁 RECALL — Sin mirar: explicá revenue, LTV, CAC, MRR, ROI, churn y bruta vs neta con 1 fórmula cada una. (Nivel Bloom: evaluar) (Recuperación | Alta)

9. 📌 IDEA CLAVE — Retén primero, mide todo el costo y decide con la neta.

10. ✅ AUTO-CHEQUEO + SIGUIENTE — [ ] Calculé mi churn [ ] Separo paid de blended [ ] Miro la neta. Siguiente: arma tu tablero de 5 números este mes. (Metacognición | Media)
