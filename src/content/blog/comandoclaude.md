---
title: "Claude Code — Referencia Completa de Comandos"
description: "Edición 2026 · Todos los slash commands, flags CLI, shortcuts y notaciones especiales"
pubDate: 2026-03-07
code: "claude"
image: "/images/blog/comandoclaude.jpg"
---

# ⚡ Claude Code — Referencia Completa de Comandos

> Edición 2026 · Todos los slash commands, flags CLI, shortcuts y notaciones especiales

---

## Índice rápido

- [Instalación y arranque](#instalación-y-arranque)
- [Slash Commands (dentro de sesión)](#slash-commands-dentro-de-sesión)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Notaciones especiales en el prompt](#notaciones-especiales-en-el-prompt)
- [CLI Flags (al lanzar claude)](#cli-flags-al-lanzar-claude)
- [Comandos CLI (terminal)](#comandos-cli-terminal)
- [MCP: gestión de servidores](#mcp-gestión-de-servidores)
- [Configuración (claude config)](#configuración-claude-config)
- [Variables de entorno](#variables-de-entorno)
- [Custom Skills / Comandos](#custom-skills--comandos-personalizados)

---

## Instalación y arranque

```bash
# Instalar (una sola vez)
npm install -g @anthropic-ai/claude-code

# Modos de inicio más usados
claude                            # Sesión interactiva (modo normal)
claude "arregla el bug en auth"   # Sesión con prompt inicial
claude -p "analiza este código"   # Query puntual, sin sesión
claude -c                         # Continuar la última conversación
claude -r "abc123" "continuá"     # Retomar sesión por ID específico
```

---

## Slash Commands (dentro de sesión)

Los slash commands se usan **dentro** de una sesión activa escribiendo `/nombre`.

### 📁 Gestión del proyecto

| Comando   | Descripción                                                       |
| --------- | ----------------------------------------------------------------- |
| `/init`   | Escanea el proyecto y crea un `CLAUDE.md` inicial automáticamente |
| `/memory` | Edita los archivos de memoria `CLAUDE.md` (global o de proyecto)  |
| `/todos`  | Lista los TODOs actuales del proyecto                             |
| `/tasks`  | Muestra y gestiona tareas en segundo plano                        |

### 📊 Información y estado

| Comando    | Descripción                                                             |
| ---------- | ----------------------------------------------------------------------- |
| `/help`    | Muestra todos los comandos disponibles (incluyendo tus custom commands) |
| `/context` | Visualiza el uso actual del context window como grilla de colores       |
| `/cost`    | Muestra estadísticas detalladas de tokens usados y costo estimado       |
| `/usage`   | Muestra límites del plan y estado del rate limit                        |
| `/stats`   | Historial de sesiones, estadísticas de uso y preferencias de modelo     |
| `/status`  | Panel con versión, modelo activo e info de cuenta                       |
| `/doctor`  | Diagnostica la instalación de Claude Code y detecta problemas           |
| `/bug`     | Reporta bugs directamente al equipo de Anthropic                        |

### 🧠 Gestión del contexto

| Comando           | Descripción                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/clear`          | **★ Más usado.** Limpia el historial de conversación (preserva CLAUDE.md). Usar al cambiar de tarea.                                             |
| `/compact [foco]` | Comprime la conversación manteniendo lo relevante. Libera espacio en el context window. Aceptar parámetro de foco: `/compact solo código Python` |
| `/rewind`         | Revierte la conversación y/o el código al estado anterior. Equivalente a deshacer.                                                               |
| `/export`         | Exporta la conversación a archivo o clipboard                                                                                                    |

### 🤖 Modelo y modo

| Comando  | Descripción                                                          |
| -------- | -------------------------------------------------------------------- |
| `/model` | Cambia entre modelos: Opus, Sonnet, Haiku                            |
| `/plan`  | Activa Plan Mode (Claude planifica sin ejecutar hasta que confirmes) |
| `/vim`   | Activa modo Vim (Insert/Command) para editar prompts                 |
| `/fast`  | Cambia al modelo más rápido disponible                               |

### 🔌 Integraciones y extensiones

| Comando               | Descripción                                                |
| --------------------- | ---------------------------------------------------------- |
| `/mcp`                | Gestiona conexiones a servidores MCP y autenticación OAuth |
| `/install-github-app` | Instala la app de GitHub para reviews automáticos de PRs   |
| `/permissions`        | Muestra o actualiza los permisos de herramientas           |

### ⚙️ Configuración y entorno

| Comando           | Descripción                                                                      |
| ----------------- | -------------------------------------------------------------------------------- |
| `/config`         | Abre la interfaz de configuración (Config Tab)                                   |
| `/theme`          | Cambia el tema de colores de la interfaz                                         |
| `/terminal-setup` | Instala el binding de Shift+Enter en iTerm2 / VS Code                            |
| `/statusline`     | Configura la barra de estado de Claude Code                                      |
| `/keybindings`    | Crea o abre el archivo de configuración de atajos (`~/.claude/keybindings.json`) |
| `/rename`         | Renombra la sesión actual                                                        |

### 🔄 Sesiones remotas

| Comando     | Descripción                                                    |
| ----------- | -------------------------------------------------------------- |
| `/resume`   | Retoma una conversación previa (por ID o selector interactivo) |
| `/teleport` | Retoma una sesión remota de claude.ai localmente               |

### 🚪 Salir

| Comando | Descripción                                          |
| ------- | ---------------------------------------------------- |
| `/exit` | Sale del REPL de Claude Code                         |
| `/copy` | Copia la última respuesta del asistente al clipboard |

---

## Keyboard Shortcuts

### Operaciones generales

| Atajo       | Descripción                                                             |
| ----------- | ----------------------------------------------------------------------- |
| `Ctrl+C`    | Cancela el input o la generación en curso                               |
| `Ctrl+D`    | Termina la sesión de Claude Code (señal EOF)                            |
| `Ctrl+L`    | Limpia la pantalla del terminal (preserva el historial de conversación) |
| `Ctrl+G`    | Abre el prompt en tu editor externo (para prompts largos)               |
| `Ctrl+O`    | Alterna el output verbose (muestra/oculta detalles)                     |
| `Ctrl+R`    | Búsqueda reversa en el historial de comandos                            |
| `Ctrl+S`    | Guarda el prompt actual para más tarde (stash)                          |
| `Ctrl+T`    | Alterna visibilidad del task list                                       |
| `Ctrl+B`    | Manda la tarea actual a segundo plano                                   |
| `Esc + Esc` | Rebobina código y conversación al estado previo                         |
| `↑ / ↓`     | Navega el historial de prompts anteriores                               |

### Modelo y modo

| Atajo                 | Descripción                                         |
| --------------------- | --------------------------------------------------- |
| `Cmd+T` / `Alt+T`     | Toggle Extended Thinking (razonamiento extendido)   |
| `Cmd+P` / `Alt+P`     | Abre el model picker (cambio rápido de modelo)      |
| `Shift+Tab` / `Alt+M` | Cicla entre modos: Normal → Auto-Accept → Plan Mode |

### Imágenes y archivos

| Atajo                                | Descripción                 |
| ------------------------------------ | --------------------------- |
| `Ctrl+V` (Mac) / `Alt+V` (Linux/Win) | Pega imagen desde clipboard |

### Input multilínea

| Método           | Atajo          | Contexto                            |
| ---------------- | -------------- | ----------------------------------- |
| Escape rápido    | `\ + Enter`    | Funciona en todos los terminales    |
| macOS estándar   | `Option+Enter` | Nativo en macOS                     |
| Terminal Setup   | `Shift+Enter`  | Después de correr `/terminal-setup` |
| Control sequence | `Ctrl+J`       | Line feed para multilínea           |

---

## Notaciones especiales en el prompt

Estos prefijos y símbolos funcionan **dentro del prompt** de la sesión:

| Notación   | Descripción                                                                  | Ejemplo                             |
| ---------- | ---------------------------------------------------------------------------- | ----------------------------------- |
| `@archivo` | Referencia un archivo o directorio. Activa autocomplete de paths             | `@src/auth/login.ts`                |
| `!comando` | Ejecuta un comando bash directo sin modo conversacional (usa menos tokens)   | `!git log --oneline -10`            |
| `#texto`   | Shortcut de memoria: agrega el texto a `CLAUDE.md` (pregunta en qué archivo) | `#siempre usar TypeScript estricto` |
| `/comando` | Ejecuta un slash command                                                     | `/compact`                          |

### En Custom Skills (comandos personalizados)

| Notación            | Descripción                                    |
| ------------------- | ---------------------------------------------- |
| `$ARGUMENTS`        | Todos los argumentos pasados al comando        |
| `$1`, `$2`...       | Argumentos posicionales individuales           |
| `!`(en frontmatter) | Ejecuta bash en el template del comando        |
| `@`(en frontmatter) | Referencia archivos en el template del comando |

---

## CLI Flags (al lanzar claude)

Los flags se usan al iniciar Claude Code desde el terminal: `claude [flags] "prompt"`

### Control de sesión

| Flag               | Descripción                                           | Ejemplo                              |
| ------------------ | ----------------------------------------------------- | ------------------------------------ |
| `-p`, `--print`    | Respuesta sin sesión interactiva (headless/scripting) | `claude -p "analiza esto"`           |
| `-c`, `--continue` | Continúa la última conversación                       | `claude -c`                          |
| `-r`, `--resume`   | Retoma sesión específica por ID                       | `claude -r "abc123" "continuá"`      |
| `--session-id`     | Usa un UUID específico de sesión                      | `claude --session-id "550e8400-..."` |
| `--fork-session`   | Crea un nuevo ID al retomar (bifurca)                 | `claude -r abc123 --fork-session`    |
| `-v`, `--version`  | Muestra la versión instalada                          | `claude -v`                          |

### Modelo y sistema de prompts

| Flag                          | Descripción                                          | Ejemplo                                                   |
| ----------------------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| `--model`                     | Modelo para esta sesión                              | `claude --model opus`                                     |
| `--system-prompt`             | **Reemplaza** el system prompt completo              | `claude --system-prompt "Sos un experto en Rust"`         |
| `--system-prompt-file`        | Carga system prompt desde archivo                    | `claude --system-prompt-file ./prompt.txt`                |
| `--append-system-prompt`      | **Agrega** al system prompt por defecto (más seguro) | `claude --append-system-prompt "Siempre usar TypeScript"` |
| `--append-system-prompt-file` | Agrega desde archivo                                 | `claude --append-system-prompt-file ./extras.txt`         |

> ⚠️ `--system-prompt` y `--system-prompt-file` son mutuamente excluyentes.
> Para la mayoría de casos, usar `--append-system-prompt` es la opción más segura.

### Permisos y seguridad

| Flag                             | Descripción                                                         | Ejemplo                                               |
| -------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------- |
| `--allowedTools`                 | Herramientas permitidas sin prompt de confirmación                  | `claude --allowedTools "Bash(git:*)" "Read"`          |
| `--disallowedTools`              | Herramientas explícitamente denegadas                               | `claude --disallowedTools "Bash(curl:*)"`             |
| `--dangerously-skip-permissions` | Omite TODOS los prompts de permisos. Solo en containers confiables. | `claude --dangerously-skip-permissions`               |
| `--permission-mode`              | Inicia en modo específico: `plan`, `auto`, `normal`                 | `claude --permission-mode plan`                       |
| `--permission-prompt-tool`       | Tool MCP para manejar prompts de permisos                           | `claude -p --permission-prompt-tool mcp_tool "query"` |

### Agentes y subagentes

| Flag       | Descripción                                     | Ejemplo                        |
| ---------- | ----------------------------------------------- | ------------------------------ |
| `--agent`  | Especifica un agente predefinido para la sesión | `claude --agent code-reviewer` |
| `--agents` | Define subagentes custom en JSON inline         | Ver ejemplo abajo              |

```bash
# Ejemplo completo de --agents
claude --agents '{
  "code-reviewer": {
    "description": "Revisa cambios de código. Activar después de editar.",
    "prompt": "Sos un senior engineer. Revisá seguridad, bugs y performance.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  },
  "debugger": {
    "description": "Especialista en debugging.",
    "prompt": "Analizá errores e identificá causas raíz."
  }
}'
```

### MCP y extensiones

| Flag                  | Descripción                                        | Ejemplo                                              |
| --------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| `--mcp-config`        | Carga servidores MCP desde JSON                    | `claude --mcp-config ./mcp.json`                     |
| `--strict-mcp-config` | Usa SOLO `--mcp-config`, ignora otros              | `claude --strict-mcp-config --mcp-config ./mcp.json` |
| `--mcp-debug`         | Activa debug para servidores MCP                   | `claude --mcp-debug`                                 |
| `--plugin-dir`        | Carga plugins desde directorios                    | `claude --plugin-dir ./my-plugins`                   |
| `--betas`             | Headers beta para requests a la API (solo API key) | `claude --betas "feature-x"`                         |

### Output y formato

| Flag              | Descripción                                      | Ejemplo                                   |
| ----------------- | ------------------------------------------------ | ----------------------------------------- |
| `--output-format` | Formato de salida: `text`, `json`, `stream-json` | `claude -p "query" --output-format json`  |
| `--input-format`  | Formato de entrada: `text`, `stream-json`        | `claude -p --input-format stream-json`    |
| `--json-schema`   | Obtener JSON validado contra un schema           | `claude -p --json-schema '{...}' "query"` |

### Directorios y contexto adicional

| Flag        | Descripción                               | Ejemplo                           |
| ----------- | ----------------------------------------- | --------------------------------- |
| `--add-dir` | Agrega directorios de trabajo adicionales | `claude --add-dir ../apps ../lib` |
| `--file`    | Descarga archivos al iniciar              | `claude --file file_abc:doc.txt`  |

### Control de costo y límites

| Flag               | Descripción                                   | Ejemplo                                     |
| ------------------ | --------------------------------------------- | ------------------------------------------- |
| `--max-turns`      | Limita turnos agénticos (modo no-interactivo) | `claude -p --max-turns 3 "query"`           |
| `--max-budget-usd` | Presupuesto máximo en USD (modo print)        | `claude -p --max-budget-usd 5.00 "query"`   |
| `--fallback-model` | Modelo alternativo si hay sobrecarga          | `claude -p --fallback-model sonnet "query"` |

### Sesiones remotas

| Flag         | Descripción                            | Ejemplo                                    |
| ------------ | -------------------------------------- | ------------------------------------------ |
| `--remote`   | Crea sesión web en claude.ai           | `claude --remote "arreglá todos los bugs"` |
| `--teleport` | Retoma sesión web remotamente en local | `claude --teleport`                        |

### Debug y diagnóstico

| Flag           | Descripción                         | Ejemplo                           |
| -------------- | ----------------------------------- | --------------------------------- |
| `--debug`      | Activa debug con categoría opcional | `claude --debug "api,mcp"`        |
| `--debug-file` | Escribe logs de debug a archivo     | `claude --debug-file ./debug.log` |
| `--verbose`    | Logging verbose                     | `claude --verbose`                |

### Misceláneos

| Flag                       | Descripción                                   | Ejemplo                             |
| -------------------------- | --------------------------------------------- | ----------------------------------- |
| `--ide`                    | Conecta automáticamente al IDE al iniciar     | `claude --ide`                      |
| `--chrome`                 | Habilita integración con Claude in Chrome     | `claude --chrome`                   |
| `--settings`               | Carga settings desde archivo JSON o string    | `claude --settings ./settings.json` |
| `--disable-slash-commands` | Deshabilita todas las skills para esta sesión | `claude --disable-slash-commands`   |

> 💡 **Los flags se pueden combinar:**
> `claude --model opus --verbose --add-dir src/` inicia con Opus, logging verbose y carga la carpeta `src/`.

---

## Comandos CLI (terminal)

Estos se ejecutan directamente en el terminal, fuera de una sesión:

| Comando                     | Descripción                                        | Ejemplo                               |
| --------------------------- | -------------------------------------------------- | ------------------------------------- |
| `claude`                    | Inicia REPL interactivo                            | `claude`                              |
| `claude "query"`            | REPL con prompt inicial                            | `claude "explicá este proyecto"`      |
| `claude -p "query"`         | Query puntual vía SDK y sale                       | `claude -p "explicá esta función"`    |
| `cat file \| claude -p "q"` | Procesa contenido con pipe                         | `cat logs.txt \| claude -p "explicá"` |
| `claude update`             | Actualiza a la última versión                      | `claude update`                       |
| `claude doctor`             | Verifica salud de la instalación                   | `claude doctor`                       |
| `claude install`            | Instala build nativo (stable/latest)               | `claude install stable`               |
| `claude setup-token`        | Configura token de autenticación de larga duración | `claude setup-token`                  |
| `claude mcp`                | Gestiona servidores MCP                            | Ver sección MCP                       |
| `claude plugin`             | Instala y gestiona plugins                         | `claude plugin install my-plugin`     |

---

## MCP: gestión de servidores

```bash
# Agregar servidor MCP
claude mcp add <nombre> <comando>
claude mcp add github npx @modelcontextprotocol/server-github
claude mcp add playwright npx @playwright/mcp@latest
claude mcp add postgres npx @modelcontextprotocol/server-postgres

# Con scope específico (user = global, project = solo este repo)
claude mcp add github -s user \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=tu-token \
  -- npx -y @modelcontextprotocol/server-github

# Con transporte HTTP
claude mcp add --transport http github https://mcp.github.com

# Ver servidores instalados
claude mcp list

# Eliminar servidor
claude mcp remove <nombre>

# Debug de MCP al iniciar
claude --mcp-debug
```

---

## Configuración (claude config)

```bash
# Ver configuración actual
claude config list

# Cambiar modelo por defecto
claude config set model sonnet

# Configurar herramientas permitidas (evita prompts de confirmación)
claude config set allowedTools "Edit,Read,Write,Bash(npm*),Bash(git*)"

# Denegar herramientas específicas
claude config set disallowedTools "Bash(curl*)"

# Ver una configuración específica
claude config get model
```

### Estructura del archivo `settings.json`

```json
{
  "model": "claude-sonnet-4-20250514",
  "maxTokens": 4096,
  "permissions": {
    "allowedTools": ["Read", "Write", "Bash(git *)", "Bash(npm run *)"],
    "deny": ["Read(./.env)", "Read(./.env.*)", "Write(./production.config.*)"]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(*.py)",
        "hooks": [
          {
            "type": "command",
            "command": "python -m black $file"
          }
        ]
      }
    ]
  }
}
```

### Prioridad de configuración (de mayor a menor)

```
1. Flags CLI (--model, --allowedTools, etc.)
2. settings.json del proyecto (.claude/settings.json)
3. settings.json del usuario (~/.claude/settings.json)
4. CLAUDE.md (instrucciones en lenguaje natural)
5. Defaults del sistema
```

---

## Variables de entorno

| Variable                | Descripción                                |
| ----------------------- | ------------------------------------------ |
| `ANTHROPIC_API_KEY`     | Clave de API de Anthropic                  |
| `CLAUDE_MODEL`          | Modelo por defecto                         |
| `CLAUDE_MAX_TOKENS`     | Máximo de tokens por respuesta             |
| `CLAUDE_CONFIG_DIR`     | Directorio de configuración custom         |
| `CLAUDE_SKIP_TELEMETRY` | Desactiva telemetría (`1` para desactivar) |

---

## Custom Skills / Comandos personalizados

Las Skills son comandos personalizados que se activan con `/nombre`.

### Ubicaciones

```
.claude/skills/          ← Skills de proyecto (compartidas con el equipo)
.claude/commands/        ← Alias legacy (sigue funcionando)
~/.claude/skills/        ← Skills personales (todas tus sesiones)
~/.claude/commands/      ← Alias legacy personal
```

El nombre del archivo `.md` se convierte en el comando: `test-all.md` → `/test-all`

### Estructura de una skill

```markdown
---
name: test-all
description: Corre todos los tests y linters del proyecto
allowed-tools: Bash(npm test:*), Bash(npm run:*)
argument-hint: [suite] [flags]
model: sonnet
disable-model-invocation: false
---

Corré los siguientes tests en orden:

1. `npm test $ARGUMENTS`
2. `npm run lint`
3. `npm run typecheck`

Mostrá un resumen de los resultados. Si alguno falla, explicá el error.
```

### Ejemplos de skills útiles

```markdown
# .claude/skills/commit.md

---

description: Crea un commit con mensaje convencional
allowed-tools: Bash(git add:_), Bash(git commit:_)
argument-hint: [mensaje]
model: haiku

---

<git_diff>
!`git diff --cached`
</git_diff>

Creá un commit message siguiendo Conventional Commits.
Si $ARGUMENTS está presente, usalo como mensaje.
```

```markdown
# .claude/skills/pr.md

---

description: Crea un Pull Request con descripción automática
allowed-tools: Bash(git _), Bash(gh _)
model: sonnet

---

Analizá todos los commits en esta branch vs main.
Generá un título y descripción para el PR.
Usá: gh pr create --title "$TITLE" --body "$BODY"
```

### Alias de shell para skills frecuentes

```bash
# Agregar a ~/.zshrc o ~/.bashrc
alias cltest="claude -p '/test-all'"
alias clcommit="claude -p '/commit'"
alias clpr="claude -p '/pr'"
alias clreview="claude -p '/review'"
```

---

## Cheatsheet de referencia rápida

```
INICIAR SESIÓN
  claude                              → interactivo
  claude -p "tarea"                   → headless
  claude -c                           → continuar última sesión
  claude --model opus                 → con Opus
  claude --dangerously-skip-permissions → sin confirmaciones (sandbox)

DURANTE SESIÓN (slash commands más usados)
  /clear          → reset contexto, nueva tarea
  /compact        → comprimir historial
  /context        → ver uso del contexto
  /plan           → activar plan mode (también: Shift+Tab)
  /model          → cambiar modelo
  /memory         → editar CLAUDE.md
  /init           → crear CLAUDE.md inicial
  /rewind         → deshacer último turno
  /exit           → salir

ATAJOS MÁS IMPORTANTES
  Shift+Tab       → ciclar modos (Normal/Auto-Accept/Plan)
  Cmd+T           → Extended Thinking on/off
  Ctrl+C          → cancelar generación
  Esc+Esc         → rewind de código y conversación
  @archivo        → referenciar un archivo
  !comando        → bash directo (menos tokens)
  #texto          → agregar a CLAUDE.md

MCP
  claude mcp add <nombre> <cmd>       → instalar servidor
  claude mcp list                     → ver instalados
  claude mcp remove <nombre>          → desinstalar
```

---

_Referencia basada en Claude Code 2026. Para la documentación oficial más actualizada: [docs.anthropic.com](https://docs.anthropic.com)_
