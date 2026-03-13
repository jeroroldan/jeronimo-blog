---
title: "Claude Code en Windows — Guía de Instalación Completa"
description: "Edición 2026 · Instalación nativa (recomendada) + WSL2 como alternativa"
pubDate: 2026-03-07
code: "claude"
image: "/images/blog/instscode.jpg"
---

# 🪟 Claude Code en Windows — Guía de Instalación Completa

> Edición 2026 · Instalación nativa (recomendada) + WSL2 como alternativa

---

## Índice

1. [Antes de empezar: elige tu ruta](#1-antes-de-empezar-elige-tu-ruta)
2. [Requisitos del sistema](#2-requisitos-del-sistema)
3. [Opción A — Instalación Nativa (recomendada)](#3-opción-a--instalación-nativa-recomendada)
4. [Opción B — Instalación con WSL2](#4-opción-b--instalación-con-wsl2)
5. [Autenticación: primer login](#5-autenticación-primer-login)
6. [Verificar que todo funciona](#6-verificar-que-todo-funciona)
7. [Configuración inicial post-instalación](#7-configuración-inicial-post-instalación)
8. [Terminal recomendada: Windows Terminal](#8-terminal-recomendada-windows-terminal)
9. [Integración con VS Code](#9-integración-con-vs-code)
10. [Actualizaciones](#10-actualizaciones)
11. [Solución de problemas frecuentes](#11-solución-de-problemas-frecuentes)
12. [Limitaciones conocidas en Windows](#12-limitaciones-conocidas-en-windows)

---

## 1. Antes de empezar: elige tu ruta

Desde 2025, Claude Code tiene **instalación nativa para Windows**: ya no hace falta WSL para usarlo. Aun así, WSL2 sigue siendo una opción válida para quienes prefieren un entorno Linux puro.

```
¿Cuál elegir?

Opción A — Nativa (recomendada para la mayoría):
  ✅ Sin configuración extra
  ✅ Más fácil de instalar
  ✅ Funciona en PowerShell, CMD y Git Bash
  ⚠️  Pegar imágenes con Ctrl+V tiene limitaciones (usar Alt+V)

Opción B — WSL2 (para devs con entorno Linux):
  ✅ Entorno Linux completo → máxima compatibilidad
  ✅ Soporte de sandboxing (WSL2 solamente)
  ✅ Mejor integración con herramientas Unix-native
  ⚠️  Requiere más pasos de configuración
  ⚠️  Proyectos en rutas Windows (C:\) tienen performance reducida
```

> 💡 Si recién empezás: **elegí la Opción A**. Es más simple y cubre el 95% de los casos.

---

## 2. Requisitos del sistema

| Componente       | Requisito                                                                    |
| ---------------- | ---------------------------------------------------------------------------- |
| **OS**           | Windows 10 (21H2 o superior) o Windows 11                                    |
| **Arquitectura** | x64 o ARM64                                                                  |
| **RAM**          | 4 GB mínimo, 8 GB recomendado                                                |
| **Conexión**     | Internet (requerida)                                                         |
| **Cuenta**       | Claude Pro ($20/mes), Claude Max ($100/mes), o créditos en Anthropic Console |
| **Node.js**      | ❌ No necesario con el instalador nativo                                     |
| **Git**          | ✅ Requerido (Git for Windows incluye Git Bash)                              |

### Verificar versión de Windows

Presioná `Win + R`, escribí `winver` y Enter. Necesitás ver `21H2` o superior.

---

## 3. Opción A — Instalación Nativa (recomendada)

### Paso 1: Instalar Git for Windows

Claude Code necesita Git Bash internamente. Si ya tenés Git instalado, saltá al Paso 2.

1. Descargá desde: **https://git-scm.com/downloads/win**
2. Ejecutá el instalador → opciones por defecto están bien
3. Al finalizar, verificá en PowerShell:

```powershell
git --version
# git version 2.x.x
```

### Paso 2: Instalar Claude Code

Abrí **PowerShell** (no hace falta ejecutar como Administrador) y corré:

```powershell
irm https://claude.ai/install.ps1 | iex
```

El instalador descarga el binario nativo y lo instala en `~\.local\bin`. No requiere Node.js.

**Alternativas:**

```cmd
# Desde CMD (Command Prompt):
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd

# Desde WinGet (requiere actualización manual):
winget install Anthropic.ClaudeCode
```

### Paso 3: Cerrar y reabrir la terminal

⚠️ **Obligatorio.** El instalador modifica el PATH. Sin reiniciar la terminal, el comando `claude` no se reconocerá.

Cerrá la ventana de PowerShell y abrí una nueva.

### Paso 4: Verificar instalación

```powershell
claude --version
# Debería mostrar algo como: 1.x.x
```

---

## 4. Opción B — Instalación con WSL2

### Paso 1: Habilitar WSL2

Abrí **PowerShell como Administrador** y ejecutá:

```powershell
wsl --install
```

Este comando instala WSL2 + Ubuntu automáticamente. Al terminar, **reiniciá Windows**.

> Si ya tenés WSL1, actualizarlo a WSL2:
>
> ```powershell
> wsl --set-default-version 2
> wsl --set-version Ubuntu 2
> ```

### Paso 2: Verificar que WSL2 está activo

```powershell
wsl --list --verbose
# Deberías ver Ubuntu con VERSION 2
```

### Paso 3: Abrir Ubuntu e instalar Claude Code

Abrí Ubuntu desde el menú de inicio (o escribí `ubuntu` en PowerShell) y corré:

```bash
# Dentro de la terminal Ubuntu (WSL)
curl -fsSL https://claude.ai/install.sh | bash
```

El script instala el binario en `~/.local/bin` dentro de WSL.

### Paso 4: Agregar al PATH (si es necesario)

```bash
# Verificar primero
which claude
# Si no encuentra nada, agregar al PATH:

echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Paso 5: Verificar

```bash
claude --version
```

### Configuración opcional de WSL2 (performance)

Para limitar el consumo de recursos, creá o editá `C:\Users\TuUsuario\.wslconfig`:

```ini
# %USERPROFILE%\.wslconfig
[wsl2]
memory=8GB        # Limitar RAM usada por WSL2
processors=4      # Limitar cores de CPU
swap=2GB          # Tamaño del swap
localhostForwarding=true
```

Aplicar con: `wsl --shutdown` y reabrir Ubuntu.

---

## 5. Autenticación: primer login

Al correr `claude` por primera vez, se abre automáticamente el navegador para autenticarse:

```powershell
claude
# → Se abre el browser en claude.ai para login con OAuth
# → Una vez autenticado, el browser te muestra un código
# → Pegalo en la terminal si lo pide
```

### Opciones de cuenta

| Plan               | Precio      | Para quién                             |
| ------------------ | ----------- | -------------------------------------- |
| **Claude Pro**     | $20/mes     | La mayoría de developers               |
| **Claude Max 5x**  | $100/mes    | Uso intensivo diario                   |
| **Claude Max 20x** | $200/mes    | Equipos y uso muy heavy                |
| **API Console**    | Pay-per-use | Proyectos con control de costos, CI/CD |

> 💡 Si no sabés qué elegir: empezá con **$20 en créditos de API** para testear. Si lo usás seguido, Pro resulta más económico.

---

## 6. Verificar que todo funciona

```powershell
# 1. Verificar versión
claude --version

# 2. Diagnóstico completo
claude doctor

# 3. Primer uso
claude "hola, ¿podés listar los archivos del directorio actual?"
```

`claude doctor` muestra: tipo de instalación, versión, shell detectada, Git Bash path, y problemas comunes.

---

## 7. Configuración inicial post-instalación

### Inicializar un proyecto

```powershell
# Navegar a tu proyecto
cd C:\Users\TuUsuario\proyectos\mi-app

# Dejar que Claude escanee el proyecto y cree el CLAUDE.md
claude
/init
```

### Configurar herramientas permitidas (evitar prompts constantes)

```powershell
claude config set allowedTools "Edit,Read,Write,Bash(npm*),Bash(git*)"
```

### Cambiar modelo por defecto

```powershell
claude config set model sonnet   # Balance costo/capacidad (recomendado)
# o
claude config set model opus     # Máxima capacidad (más lento)
```

---

## 8. Terminal recomendada: Windows Terminal

Windows Terminal es la mejor opción para usar Claude Code en Windows.

**Instalación:**

```powershell
winget install Microsoft.WindowsTerminal
# O desde Microsoft Store: buscar "Windows Terminal"
```

**Configurar Shift+Enter para multilínea** (muy útil para prompts largos):

Una vez instalado Windows Terminal, dentro de Claude Code ejecutá:

```
/terminal-setup
```

Esto instala el binding de `Shift+Enter` automáticamente.

### Perfil recomendado para Claude Code (settings.json de Windows Terminal)

```json
{
  "profiles": {
    "list": [
      {
        "name": "Claude Code",
        "commandline": "powershell.exe",
        "startingDirectory": "%USERPROFILE%\\proyectos",
        "colorScheme": "One Half Dark",
        "fontSize": 13,
        "fontFace": "Cascadia Code"
      }
    ]
  }
}
```

---

## 9. Integración con VS Code

### Abrir Claude Code desde el terminal integrado de VS Code

1. Abrí VS Code en tu proyecto
2. `Ctrl + `` ` (backtick) para abrir el terminal integrado
3. Escribí `claude`

### Conectar automáticamente al IDE

```powershell
claude --ide
```

Esto establece conexión entre Claude Code y VS Code para sincronización de contexto.

### Para usuarios de WSL2: abrir VS Code desde Ubuntu

```bash
# Dentro de Ubuntu (WSL), en tu directorio de proyecto:
code .
# VS Code se abre en Windows conectado a WSL automáticamente
```

---

## 10. Actualizaciones

### Instalación nativa (se actualiza sola)

La instalación nativa hace **auto-update en segundo plano**. No hace falta hacer nada.

Para actualizar manualmente o forzar la última versión:

```powershell
# Opción 1: Correr el instalador de nuevo
irm https://claude.ai/install.ps1 | iex

# Opción 2: Si instalaste con WinGet (NO auto-update)
winget upgrade Anthropic.ClaudeCode

# Opción 3: Desde dentro de Claude Code
claude update
```

### Verificar versión actual

```powershell
claude --version
```

---

## 11. Solución de problemas frecuentes

### ❌ "claude is not recognized as the name of a cmdlet"

**Causa:** `~\.local\bin` no está en el PATH del sistema.

**Solución:**

```powershell
# Verificar si el binario existe
ls "$env:USERPROFILE\.local\bin\claude.exe"

# Agregar al PATH permanentemente
[Environment]::SetEnvironmentVariable(
  "PATH",
  "$env:PATH;$env:USERPROFILE\.local\bin",
  [EnvironmentVariableTarget]::User
)

# Cerrar y reabrir la terminal
```

Si instalaste via npm (método deprecado):

```powershell
# Ver dónde instaló npm
npm config get prefix
# Agrega esa ruta al PATH si no está
```

### ❌ "Git Bash not found"

Claude Code usa Git Bash internamente. Si no lo detecta:

```powershell
# Verificar que Git está instalado
git --version

# Si no está, instalar:
winget install Git.Git
# O descargar desde https://git-scm.com/downloads/win
```

Si Git está instalado pero Claude no lo detecta, configurar el path manualmente en `~\.claude\settings.json`:

```json
{
  "gitBashPath": "C:\\Program Files\\Git\\bin\\bash.exe"
}
```

### ❌ Error de autenticación / browser no abre

```powershell
# Forzar re-autenticación
claude logout
claude login

# Alternativa: configurar API key manualmente
$env:ANTHROPIC_API_KEY = "sk-ant-tu-clave-aqui"
# Para hacerlo permanente, agregarlo en variables de entorno del sistema
```

### ❌ Performance lenta en WSL2 con archivos en C:\

Este es un problema conocido de WSL2: acceder a archivos del sistema de archivos de Windows (`/mnt/c/...`) desde Linux es notablemente más lento.

**Solución:** Mover el proyecto al filesystem de Linux:

```bash
# Copiar proyecto a la home de Ubuntu (mucho más rápido)
cp -r /mnt/c/Users/TuUsuario/mi-proyecto ~/mi-proyecto
cd ~/mi-proyecto
claude
```

### ❌ Claude Code se cierra solo / ventana flash

Problema conocido en algunas versiones de Windows. Soluciones:

1. Actualizar a la última versión: `irm https://claude.ai/install.ps1 | iex`
2. Usar Windows Terminal en lugar de la terminal por defecto
3. Ejecutar desde Git Bash directamente

### ❌ Proxy corporativo bloquea la conexión

```powershell
# Configurar proxy para Claude Code
$env:HTTPS_PROXY = "http://proxy.empresa.com:8080"
$env:HTTP_PROXY = "http://proxy.empresa.com:8080"

# Hacerlo permanente via variables de entorno del sistema:
# Panel de Control → Sistema → Variables de entorno
# Agregar: HTTPS_PROXY = http://proxy.empresa.com:8080
```

---

## 12. Limitaciones conocidas en Windows

| Limitación                                  | Estado                              | Workaround                                          |
| ------------------------------------------- | ----------------------------------- | --------------------------------------------------- |
| Pegar imágenes con `Ctrl+V`                 | ⚠️ Limitado                         | Usar `Alt+V` en su lugar                            |
| Capturas con `Win+Shift+S` no se pegan      | ⚠️ Pendiente (desde ene 2026)       | Guardar como archivo y usar `@archivo` en el prompt |
| WSL1 no soporta sandboxing                  | ℹ️ By design                        | Usar WSL2 para sandboxing                           |
| Proyectos en `C:\` desde WSL son más lentos | ℹ️ By design                        | Mover proyectos a `~/` dentro de WSL                |
| Algunas combinaciones de IME (ej. japonés)  | ✅ Corregido en versiones recientes | Actualizar al último release                        |

---

## Resumen: instalación en 3 comandos

```powershell
# 1. Instalar Git for Windows (si no está)
winget install Git.Git

# 2. Instalar Claude Code
irm https://claude.ai/install.ps1 | iex

# 3. Cerrar y reabrir la terminal, luego:
claude
# → Se abre el browser para login → listo ✅
```

---

## Tabla comparativa: Nativa vs WSL2

| Aspecto                              | Nativa     | WSL2                   |
| ------------------------------------ | ---------- | ---------------------- |
| Facilidad de instalación             | ⭐⭐⭐⭐⭐ | ⭐⭐⭐                 |
| Performance en archivos Windows      | ⭐⭐⭐⭐⭐ | ⭐⭐                   |
| Compatibilidad con herramientas Unix | ⭐⭐⭐     | ⭐⭐⭐⭐⭐             |
| Soporte de sandboxing                | ❌         | ✅                     |
| Auto-update                          | ✅         | ✅                     |
| Recomendado para                     | La mayoría | Devs con entorno Linux |

---

_Para la documentación oficial más actualizada: [docs.anthropic.com](https://docs.anthropic.com) — Página de instalación de Claude Code_
