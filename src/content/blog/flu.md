---
title: 'Diagramas de Flujos n8n + PostgreSQL'
code: "n8n"
description: ' Recolección de Datos (El Sistema Digestivo)'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---




# 📊 Diagramas de Flujos n8n + PostgreSQL

## 🔄 FLUJO 1: Recolección de Datos (El Sistema Digestivo)

```
⏰ Cron Trigger           🌐 HTTP Request         ⚙️ Code Node            🗄️ PostgreSQL
(Cada hora)        ──►    (API Externa)    ──►   (Transformar Datos) ──► (INSERT eventos)
                                                           │                     │
                                                           │                     ▼
                                                           │                📧 Notificación
                                                           │               (Solo si error)
                                                           ▼
                                                      📝 Log Error
                                                    (Tabla errores)
```

**🎯 Propósito**: Ingesta continua de datos externos
**⏱️ Frecuencia**: Cada hora
**🔑 Key**: Manejo robusto de errores con logging

---

## 🔍 FLUJO 2: Validación Diaria (El Doctor)

```
⏰ Cron Daily             🔍 Query Health         ⚙️ Analizar Resultados
(8:00 AM)          ──►    (SELECT validaciones) ──► (¿Todo OK?)
                                                           │
                                                          ╱ ╲
                                                         ╱   ╲
                                                        ╱     ╲
                                                   ✅ Todo    ❌ Hay
                                                    bien    problemas
                                                      │         │
                                                      ▼         ▼
                                               📊 Update    🚨 Generar
                                               Métricas      Alerta
                                              (HEALTHY)   (Slack/Email)
                                                      │         │
                                                      │         ▼
                                                      │    🗄️ Log Incidente
                                                      │   (Tabla alertas)
                                                      │         │
                                                      ▼         ▼
                                               📈 Dashboard Update
                                              (Vista materializada)
```

**🎯 Propósito**: Validación proactiva de la salud del sistema
**⏱️ Frecuencia**: Diaria a las 8:00 AM
**🔑 Key**: Alertas inteligentes basadas en thresholds

---

## 🧹 FLUJO 3: Limpieza Automática (El Conserje)

```
⏰ Cron Weekly            🗄️ Query Datos         🧮 Calcular Tamaño
(Domingo 2AM)      ──►    Antiguos         ──►   (¿Cuántos GB?)
                          (SELECT old)                    │
                                                         ╱ ╲
                                                        ╱   ╲
                                                       ╱     ╲
                                                   > 10GB   < 10GB
                                                      │         │
                                                      ▼         ▼
                                               🗑️ DELETE     ⏭️ Skip
                                               Archivados    Cleanup
                                              (90+ days)  (No necesario)
                                                      │         │
                                                      ▼         ▼
                                               📊 Update Stats
                                              (Cleanup metrics)
```

**🎯 Propósito**: Mantenimiento automático de la base de datos
**⏱️ Frecuencia**: Semanal (Domingos 2 AM)
**🔑 Key**: Limpieza inteligente basada en uso de espacio

---

## 🛒 CASO REAL: Monitor de E-commerce

### 📥 INGESTA DE DATOS

```
⏰ Cada 15 min ──► 🛒 Shopify API ──► ⚙️ Limpiar Datos ──► 🗄️ INSERT orders ──► 📊 UPDATE stats
   Trigger         GET /orders      Validar + Transform   ecommerce_orders     real_time_metrics
```

### 🔍 ANÁLISIS DIARIO

```
⏰ Daily 8AM ──► 🗄️ Calcular KPIs ──► 📊 ¿Performance?
   Análisis       Revenue, AOV, etc.         │
                                            ╱│╲
                                           ╱ │ ╲
                                          ╱  │  ╲
                                    📈 Arriba │ 📉 Abajo  📊 Normal
                                      10%    │   15%
                                         │   │    │        │
                                         ▼   ▼    ▼        ▼
                                    🎉 Great! ⚠️ Low   📝 Business
                                      Day!    Sales   as usual
                                         │      │        │
                                         ▼      ▼        ▼
                                      🗄️ UPDATE dashboard
                                        daily_metrics
```

### 🚨 MONITOREO CRÍTICO

```
⏰ Cada 5 min ──► 🔍 Check API Status ──► ⚡ ¿API OK?
   Health Check    Response time              │
                                            ╱│╲
                                           ╱ │ ╲
                                          ╱  │  ╲
                                    ✅ < 2seg │ ⚠️ 2-5seg ❌ > 5seg
                                         │   │    │         │
                                         ▼   ▼    ▼         ▼
                                    📝 API   ⚠️ API    🚨 CRITICAL
                                    Healthy   Slow      ALERT
                                         │     │         │
                                         │     │         ▼
                                         │     │    📞 Escalate
                                         │     │     PagerDuty
                                         ▼     ▼         │
                                      🗄️ Log Performance ◄┘
                                       api_health_checks
```

---

## 🏗️ ARQUITECTURA DE DATOS

### 📊 TABLAS PRINCIPALES

```
automation_events           ecommerce_orders           api_health_checks           daily_metrics
🗃️ Registro principal  ────► 🛒 Órdenes específicas ────► ⚡ Salud de APIs      ────► 📈 KPIs calculados
Todo lo que pasa            Datos de negocio            Monitoring                  Business Intelligence
```

### 🔄 FLUJOS DE DATOS

```
📥 APIs Externas ────► automation_events
                            │
                            ▼
🔍 Health Checks ────► ecommerce_orders ────► daily_metrics
       │                    │                      │
       ▼                    │                      │
api_health_checks ──────────┴──────────────────────┘
```

### 📱 CONSUMO

```
daily_metrics ────┬────► 📊 Grafana Dashboard
                  ├────► 📧 Email Reports
                  └────► 🚨 Slack Alerts

api_health_checks ────► 🚨 Slack Alerts

automation_events ────► 🔍 Debug Logs
```

---

## ⏱️ SECUENCIA TEMPORAL: Flujo Típico de Automatización

```
⏰ Cron Trigger  🤖 n8n Workflow  🌐 API Externa  🗄️ PostgreSQL  📱 Slack/Email
      │                │                │              │              │
      │ "Es hora!"      │                │              │              │
      │ (cada 15 min)   │                │              │              │
      ├────────────────►│                │              │              │
      │                │ GET /api/data  │              │              │
      │                ├───────────────►│              │              │
      │                │                │ Raw Data     │              │
      │                │◄───────────────┤              │              │
      │                │                │              │              │
      │         📝 Procesamiento interno │              │              │
      │         🧹 Limpiar datos        │              │              │
      │         ✅ Validar formato       │              │              │
      │         🔄 Transformar estructura│              │              │
      │                │                │              │              │
      │                │ INSERT INTO automation_events │              │
      │                ├───────────────────────────────►│              │
      │                │                │        ✅/❌ Response        │
      │                │◄───────────────────────────────┤              │
      │                │                │              │              │
      │                │                │              │              │
      │         ✅ Todo salió bien       │              │              │
      │                │ UPDATE process_states (success)│              │
      │                ├───────────────────────────────►│              │
      │                │ 📝 Log: Proceso completado    │              │
      │                │                │              │              │
      │         ❌ Algo falló            │              │              │
      │                │ INSERT error_log               │              │
      │                ├───────────────────────────────►│              │
      │                │ ALERT: "Proceso falló!"       │              │
      │                ├───────────────────────────────────────────────►│
      │                │ 📧 Email + Slack notification │              │
```

### 🔍 VALIDACIÓN DIARIA SEPARADA

```
⏰ Cron Trigger  🤖 n8n Workflow  🗄️ PostgreSQL  📱 Slack/Email
      │                │              │              │
      │ "Validación    │              │              │
      │ diaria!"       │              │              │
      │ (8 AM)         │              │              │
      ├───────────────►│              │              │
      │                │ SELECT health_metrics        │
      │                ├─────────────►│              │
      │                │              │ Estadísticas │
      │                │◄─────────────┤ del día      │
      │                │              │              │
      │         📈 Métricas normales  │              │
      │                │ "Reporte diario - Todo OK"  │
      │                ├─────────────────────────────►│
      │                │              │              │
      │         ⚠️ Anomalías detectadas│              │
      │                │ "ATENCIÓN: Métricas anómalas"│
      │                ├─────────────────────────────►│
```

---

## 🎯 GUÍA DE IMPLEMENTACIÓN

### ⚡ Paso 1: Flujo Básico (30 minutos)
1. Crear conexión PostgreSQL en n8n
2. Tabla `automation_events` 
3. Flujo simple: Cron → HTTP → PostgreSQL

### 🔧 Paso 2: Validaciones (1 hora)
1. Flujo de validación diaria
2. Queries de health check
3. Sistema de alertas básico

### 🚀 Paso 3: Caso Completo (2-3 horas)
1. Implementar ejemplo e-commerce
2. Múltiples tablas relacionadas
3. Dashboard de métricas

### 🏆 Paso 4: Optimización (Ongoing)
1. Índices en base de datos
2. Manejo avanzado de errores
3. Monitoring de performance

---

## 💡 Tips para Personalizar

### 🔄 Para tu Caso Específico:
- **Cambia las fuentes**: En lugar de Shopify, usa tu API
- **Ajusta frecuencias**: Según tus necesidades de negocio
- **Personaliza alertas**: Slack, Discord, Email, SMS
- **Modifica métricas**: KPIs específicos de tu industria

### 🎯 Patrones Reutilizables:
- **Cron → API → Transform → Store**: Para cualquier ingesta
- **Query → Analyze → Alert**: Para cualquier validación
- **Calculate → Compare → Notify**: Para cualquier monitoreo

### 🚨 Consideraciones Importantes:
- **Rate Limits**: No saturar APIs externas
- **Error Handling**: Siempre manejar fallos gracefully
- **Data Retention**: Limpiar datos antiguos automáticamente
- **Security**: Usar credenciales seguras y conexiones encriptadas

---

## 🏁 Próximos Pasos

1. **Elige un diagrama** para empezar
2. **Copia la estructura** de tablas correspondiente
3. **Implementa paso a paso** siguiendo la secuencia
4. **Personaliza** para tu caso específico
5. **Escala** agregando más flujos

¡Con estos diagramas tienes el mapa completo para construir automatizaciones robustas y escalables! 🚀