---
title: "Guía: Pipelines de CI/CD con Docker y GitHub Actions"
description: "Lleva tu API al siguiente nivel de automatización. Crea imágenes Docker, valida Pull Requests y despliega continuamente usando GitHub Actions."
pubDate: "2026-04-19"
code: "cicd-docker-github-actions"
category: "devops"
tags: ["docker", "github-actions", "cicd", "dotnet", "containers"]
difficulty: "avanzado"
readingTime: 16
---

# Guía: Pipelines de CI/CD con Docker y Actions 🐳

> 💡 **En esta guía aprenderás**: Cómo empaquetar tu aplicación en contenedores Docker y cómo configurar un flujo de Integración y Entrega Continua (CI/CD) que valide, construya y despliegue tu código automáticamente.

---

## Parte 1: Dockerizando la API ASP.NET Core

Docker permite que tu aplicación corra igual en tu máquina, en la de tu compañero y en el servidor. El "Dockerfile" es la receta para esto.

### Ejemplo de Dockerfile Multi-Etapa (Optimizado)
```dockerfile
# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o out

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "MiApi.dll"]
```

> [!TIP]
> Usa imágenes "Multi-stage" para que tu imagen final de producción sea ligera y no contenga el SDK de desarrollo, solo el runtime necesario.

---

## Parte 2: Integración Continua (CI) con Actions

La CI se encarga de validar que el código que quieres subir a `main` no rompa nada. Usaremos un archivo YAML en `.github/workflows/`.

### Validando Pull Requests y Pruebas
```yaml
name: CI - Validar PR

on:
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x'
      - name: Restore
        run: dotnet restore
      - name: Build
        run: dotnet build --no-restore
      - name: Test
        run: dotnet test --no-build --verbosity normal
```

---

## Parte 3: Despliegue Continuo (CD) con Docker

Una vez que las pruebas pasan, el siguiente paso es construir la imagen Docker y subirla a un registro (como Docker Hub o Azure Container Registry).

### Automatizando el Push de la Imagen
```yaml
  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - name: Build and Push
        uses: docker/build-push-action@v4
        with:
          push: true
          tags: miusuario/miapi-prod:latest
```

---

## Parte 4: El Ciclo Completo (GitOps)

El despliegue continuo no termina al subir la imagen; el servidor debe "enterarse" de que hay una nueva versión y reiniciar el contenedor. Esto se puede lograr mediante:
- **Webhooks**: El registro avisa al servidor.
- **GitHub Actions**: El workflow envía un comando de actualización al servidor (vía SSH o API del Cloud).

| Fase | Herramienta | Objetivo |
| :--- | :--- | :--- |
| **Lint/Test** | xUnit / Actions | Calidad del código. |
| **Build Image** | Docker | Inmutabilidad del artefacto. |
| **Push** | Docker Hub | Almacenamiento centralizado. |
| **Deploy** | Cloud / Azure | Disponibilidad al usuario final. |

---

## Conclusión

Automatizar el pipeline de CI/CD elimina el estrés de los despliegues manuales y permite que el equipo se enfoque en lo que realmente importa: crear código que aporte valor.

---

¿Tus contenedores están listos? Aprende a gestionar la infraestructura donde correrán en la guía de **Infraestructura con Terraform y Observabilidad**.
