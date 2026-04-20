---
title: "Guía: Infraestructura con Terraform y Observabilidad Proactiva"
description: "Domina el despliegue automatizado de recursos en Azure con Terraform y la monitorización avanzada mediante OpenTelemetry y Azure Workbooks."
pubDate: "2026-04-19"
code: "infraestructura-terraform-observabilidad"
category: "devops"
tags: ["terraform", "azure", "opentelemetry", "iac", "monitoring"]
difficulty: "avanzado"
readingTime: 18
---

# Guía: Infraestructura y Observabilidad 🏗️🔍

> 💡 **En esta guía aprenderás**: Cómo aplicar el paradigma de la Infraestructura como Código (IaC) en Azure usando Terraform, y cómo implementar un sistema de observabilidad moderno para entender qué pasa dentro de tu aplicación en producción.

---

## Parte 1: Infraestructura como Código (Terraform)

Terraform permite definir servidores, bases de datos y redes usando un lenguaje declarativo (HCL). Esto permite versionar tu infraestructura igual que tu código.

### Ejemplo: Creando un Azure Container App con Terraform
```hcl
resource "azurerm_container_app" "mi_api" {
  name                         = "mi-api-container"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  template {
    container {
      name   = "miapi"
      image  = "miusuario/miapi-prod:latest"
      cpu    = 0.5
      memory = "1Gi"
      
      env {
        name  = "DATABASE_URL"
        value = var.database_url
      }
    }
  }
}
```

> [!IMPORTANT]
> Usa **GitHub Actions** para automatizar el `terraform apply`. Esto asegura que los cambios en la infraestructura pasen por un proceso de revisión (Pull Request) igual que el código.

---

## Parte 2: Observabilidad con OpenTelemetry

La observabilidad no es solo ver logs; es entender el estado del sistema mediante Traces, Metrics y Logs. **OpenTelemetry** es el estándar de la industria.

### Implementación en .NET Core
```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .AddSource(nameof(MiApi))
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddEntityFrameworkCoreInstrumentation()
        .AddOtlpExporter(opt => opt.Endpoint = new Uri(builder.Configuration["OTEL_EXPORTER_OTLP_ENDPOINT"])));
```

---

## Parte 3: Dashboards y Análisis de Datos (Azure Workbooks) 📊

Una vez que los datos fluyen hacia la nube, necesitamos visualizarlos para tomar decisiones informadas.

1. **Azure Workbooks**: Permite crear paneles interactivos que combinan texto, consultas KQL (Kusto Query Language) y gráficos.
2. **Alertas Proactivas**: Configura alarmas que te notifiquen si el porcentaje de errores 500 sube del 5% o si la latencia supera los 200ms.

---

## Parte 4: Mejora Continua y DevOps Senior

El ciclo de DevOps se cierra cuando los datos del monitoreo regresan a la etapa de Planificación.

| Concepto | Acción DevOps | Resultado |
| :--- | :--- | :--- |
| **SLI** | Service Level Indicator. | Medición real (ej: 99.9% uptime). |
| **SLO** | Service Level Objective. | Meta del equipo (ej: < 100ms latencia). |
| **Error Budget** | Margen para fallar y aprender. | Permite innovar sin miedo a romper el SLA. |

> [!TIP]
> DevOps como diferenciador: Un desarrollador Junior "arregla bugs"; un ingeniero Senior "diseña sistemas que detectan sus propios bugs y alertan antes de que el usuario los note".

---

## Conclusión Final 🚀

Has recorrido el camino completo desde los fundamentos hasta la infraestructura automatizada y la observabilidad profunda. Este es el stack de nivel "Enterprise" que define a los mejores equipos de ingeniería de software del mundo.

---

¿Dominas ya todo el ciclo? ¡Felicidades! Sigue explorando y automatizando cada vez más.
