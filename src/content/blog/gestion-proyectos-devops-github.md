---
title: "Guía: Gestión de Proyectos y Desarrollo Seguro con GitHub"
description: "Aprende a planificar con GitHub Projects, blindar tu código con Branch Protection y asegurar la calidad con pruebas unitarias automáticas en .NET."
pubDate: "2026-04-19"
code: "gestion-proyectos-devops-github"
category: "devops"
tags: ["github-projects", "dotnet", "unit-testing", "git", "branch-protection"]
difficulty: "intermedio"
readingTime: 14
---

# Guía: Gestión de Proyectos y Desarrollo Seguro 🛠️

> 💡 **En esta guía aprenderás**: Cómo organizar tu flujo de trabajo usando GitHub Projects, establecer reglas de protección para tu rama principal y asegurar que cada línea de código sea validada por pruebas unitarias.

---

## Parte 1: Planificación con GitHub Projects

Antes de escribir la primera línea de código, debemos definir el alcance. Para proyectos de APIs, esto significa listar los endpoints, reglas de negocio y modelos de datos.

**Flujo en GitHub Projects:**
1. **Backlog**: Lista de todas las tareas pendientes (Issues).
2. **Ready**: Tareas refinadas y listas para ser tomadas.
3. **In Progress**: Lo que se está desarrollando actualmente.
4. **In Review**: Código que espera un Pull Request.
5. **Done**: Tareas completadas y desplegadas.

---

## Parte 2: Calidad desde el Origen (Unit Testing en .NET)

En DevOps, la calidad no se negocia al final; se construye en cada commit. Iniciaremos nuestros proyectos .NET incluyendo una capa de pruebas.

### Estructura de Proyecto Sugerida
```
MiSolucion/
├── src/
│   └── MiApi.Web/      # La API ASP.NET Core
└── tests/
    └── MiApi.Tests/    # Proyecto xUnit o NUnit
```

### Ejemplo de Prueba Unitaria Básica
```csharp
[Fact]
public void Validar_Suma_Correcta()
{
    // Arrange
    var calculadora = new Calculadora();
    // Act
    var resultado = calculadora.Sumar(2, 2);
    // Assert
    Assert.Equal(4, resultado);
}
```

---

## Parte 3: Blindaje de la Rama Main 🛡️

La rama `main` (o `master`) es sagrada: representa lo que está en producción. Nunca debe permitirse hacer "direct push".

### Reglas de Branch Protection en GitHub:
1. **Require a pull request before merging**: Nadie puede saltarse el flujo de revisión.
2. **Require status checks to pass**: Las pruebas automáticas deben dar "verde" antes de mezclar.
3. **Require signed commits**: Asegura que el código proviene de un autor verificado.
4. **Lock branch**: Impide borrados accidentales de la rama.

---

## Parte 4: Gestión de Commits y Mensajes

Un buen historial de Git es vital para la observabilidad y el retorno a versiones anteriores.

| Tipo | Uso | Ejemplo |
| :--- | :--- | :--- |
| **feat** | Nueva funcionalidad. | `feat: agregar endpoint de recuperación de contraseña` |
| **fix** | Corrección de un error. | `fix: corregir error de validación en el login` |
| **test** | Adición o cambio de pruebas. | `test: aumentar cobertura en el servicio de usuarios` |
| **docs** | Cambios en documentación. | `docs: actualizar README con instrucciones de Docker` |

> [!TIP]
> Usa el sistema de **Conventional Commits**. Esto permite automatizar la creación de Changelogs y versiones de forma sencilla.

---

## Conclusión

Una gestión sólida y un código protegido son los cimientos de cualquier pipeline exitoso. Sin orden en el origen, la automatización solo acelerará el desastre.

---

¿Tu código ya está protegido? Ahora aprende a empaquetarlo y validarlo automáticamente en la guía de **Pipelines de CI/CD con Docker y Actions**.
