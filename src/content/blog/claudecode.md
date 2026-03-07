---
title: "Claude Code: Master Class Completa"
description: "De usuario casual a experto en desarrollo agentico con IA"
author: "Jerónimo"
pubDate: 2026-03-07
code: "claude"
image: "/images/blog/claudecode.jpg"
---

# 🧠 Claude Code: Master Class Completa

## De usuario casual a experto en desarrollo agentico con IA

> **Audiencia:** Desarrolladores que quieren dominar Claude Code como herramienta central de su flujo de trabajo  
> **Nivel:** Intermedio → Experto  
> **Actualizado:** Marzo 2026

---

## Índice

1. [¿Qué es realmente Claude Code?](#1-qué-es-realmente-claude-code)
2. [El Modelo Mental Correcto](#2-el-modelo-mental-correcto)
3. [La Ley Fundamental: El Context Window](#3-la-ley-fundamental-el-context-window)
4. [CLAUDE.md: El Cerebro Persistente de tu Proyecto](#4-claudemd-el-cerebro-persistente-de-tu-proyecto)
5. [El Arte del Prompting para Código](#5-el-arte-del-prompting-para-código)
6. [Modos de Operación y Comandos Esenciales](#6-modos-de-operación-y-comandos-esenciales)
7. [Gestión del Contexto: La Habilidad más Crítica](#7-gestión-del-contexto-la-habilidad-más-crítica)
8. [Plan Mode: Planificar antes de Ejecutar](#8-plan-mode-planificar-antes-de-ejecutar)
9. [Permisos y Seguridad](#9-permisos-y-seguridad)
10. [Subagentes: Paralelismo e Isolación de Contexto](#10-subagentes-paralelismo-e-isolación-de-contexto)
11. [MCP Servers: Conectar Claude al Mundo Real](#11-mcp-servers-conectar-claude-al-mundo-real)
12. [Skills y Plugins: El Ecosistema Extensible](#12-skills-y-plugins-el-ecosistema-extensible)
13. [Workflows Avanzados y Patrones de Producción](#13-workflows-avanzados-y-patrones-de-producción)
14. [Git como Red de Seguridad](#14-git-como-red-de-seguridad)
15. [Anti-patrones: Lo que NO hacer](#15-anti-patrones-lo-que-no-hacer)
16. [Checklist del Experto](#16-checklist-del-experto)

---

## 1. ¿Qué es realmente Claude Code?

La mayoría de las personas instala Claude Code pensando que es "un chat más inteligente en la terminal". Eso es como pensar que un avión es "un auto que va más rápido".

**Claude Code es un framework de orquestación de agentes IA.**

Tiene acceso nativo a tu sistema de archivos, puede ejecutar comandos de terminal, leer toda tu base de código, correr tests, interactuar con Git, y —lo más importante— puede delegar subtareas a agentes especializados que trabajan en paralelo con contextos aislados.

> 💡 **Analogía del Director de Orquesta:** Claude Code no es el músico que toca todos los instrumentos. Es el director que coordina a los músicos (subagentes), tiene la partitura completa (CLAUDE.md), y sabe cuándo acelerar, pausar o cambiar de movimiento.

```
Lo que crees que es:  [Tú] ──prompt──> [Claude] ──código──> [Tu editor]

Lo que realmente es:  [Tú] ──tarea──> [Claude Orquestador]
                                              │
                              ┌───────────────┼───────────────┐
                              ▼               ▼               ▼
                       [Subagente         [Subagente      [MCP Server
                        Reviewer]          Tester]         GitHub]
```

Según Anthropic, Claude Code tiene más de 500.000 desarrolladores activos. La diferencia entre quien obtiene resultados mediocres y quien acelera su productividad entre un 40-60% radica en el dominio de las prácticas de esta guía.

---

## 2. El Modelo Mental Correcto

### ❌ El modelo equivocado: "Herramienta de autocompletado glorificada"

```
Pensamiento: "Le pido código, lo reviso, lo pego."
Resultado:   Claude como Google glorificado.
```

### ✅ El modelo correcto: "Junior Developer ultra-veloz que necesita buena dirección"

```
Pensamiento: "Soy el Tech Lead. Claude es mi junior brillante y rapidísimo."
Resultado:   Claude como multiplicador de tu expertise.
```

**Las implicaciones de este modelo:**

- **Tú defines la arquitectura**, Claude la implementa
- **Tú revisas cada PR** (diff), Claude los genera
- **Tú corriges el rumbo** cuando se desvía, Claude no sabe que se desvió
- **Tú provees contexto rico**, Claude no adivina lo que no sabe

> 💡 **Analogía del GPS:** Un GPS sin mapa actualizado te lleva por rutas obsoletas. CLAUDE.md es el mapa. Sin él, Claude navega ciego por tu proyecto.

---

## 3. La Ley Fundamental: El Context Window

**Este es el concepto más importante de toda la guía. Todo lo demás deriva de aquí.**

### ¿Qué es el context window?

Es la "memoria de trabajo" de Claude en cada sesión. Contiene absolutamente todo: tus mensajes, los archivos que leyó, los outputs de comandos que corrió, el historial de la conversación.

### ¿Por qué es tan crítico?

```
Capacidad típica de contexto: ~200.000 tokens
Una sesión de debugging intenso puede consumir: 50.000+ tokens
Una exploración de codebase: 30.000+ tokens
Cuando el contexto se llena → Claude "olvida" instrucciones tempranas y comete más errores
```

> 💡 **Analogía de la RAM:** Imagina que tu computadora tiene 8GB de RAM. Si abres 50 programas simultáneamente, todos empiezan a andar lento. El context window es la RAM de Claude. Administrarla bien es la habilidad #1 del experto.

### La degradación de performance con contexto lleno

```
Contexto al 20%: Claude sigue instrucciones de CLAUDE.md perfectamente
Contexto al 50%: Empieza a olvidar convenciones tempranas → HACER /compact aquí
Contexto al 80%: Comportamiento errático, ignora restricciones
Contexto al 95%: Modo supervivencia, calidad se desploma
```

**Regla de oro:** Hacer `/compact` manual antes de llegar al 50% de uso. Usar `/context` para monitorear.

---

## 4. CLAUDE.md: El Cerebro Persistente de tu Proyecto

### ¿Qué es?

Es el único archivo que entra automáticamente en **cada conversación** con Claude Code. Es la memoria permanente de tu proyecto: Claude sabe absolutamente nada de tu codebase al inicio de cada sesión —solo lo que esté en CLAUDE.md.

### Estructura óptima (con el principio WHAT/WHY/HOW)

```markdown
# CLAUDE.md — Proyecto: [NombreProyecto]

## WHAT: ¿Qué es este proyecto?

Sistema de e-commerce B2B construido con Next.js 14 (App Router) + PostgreSQL + Prisma.
Monorepo con apps: `/apps/web`, `/apps/api`, `/apps/admin`.
Paquetes compartidos en `/packages`.

## WHY: ¿Cuál es el propósito de cada parte?

- `apps/web`: Storefront público, renderizado SSR para SEO
- `apps/api`: REST API interna, consumida solo por apps propias
- `packages/db`: Schema de Prisma compartido entre todas las apps

## HOW: ¿Cómo trabajar en este proyecto?

### Comandos esenciales

- `npm run dev` — servidor de desarrollo (puerto 3000)
- `npm run test:watch` — tests en modo watch
- `npm run typecheck` — verificación TypeScript
- `docker-compose up -d` — levantar PostgreSQL local

### Convenciones de código

- TypeScript estricto, sin `any` permitido
- Componentes funcionales con hooks, nunca class components
- State management: Zustand (ver `packages/store`)
- Estilo: Tailwind CSS, sin CSS modules

### Flujo de verificación

Después de cada cambio: ejecutar `npm run typecheck && npm run test`

### Archivos de referencia (few-shot)

- Componente modelo: `components/ui/UserCard.tsx`
- API route modelo: `app/api/users/route.ts`
- Test modelo: `__tests__/user.test.ts`
```

### Reglas críticas para CLAUDE.md

**1. Menos es más.** Los LLMs pueden seguir ~150-200 instrucciones con consistencia. El system prompt de Claude Code ya consume ~50 instrucciones. Tu CLAUDE.md debería usar las que sobran para cosas universalmente aplicables.

**2. La paradoja de la densidad:**

```
Más instrucciones ≠ Mejor obediencia
Más instrucciones = Claude empieza a ignorar TODAS uniformemente
```

**3. Apunta a menos de 200 líneas por archivo.** En monorepos, usa CLAUDE.md en cada subdirectorio para instrucciones específicas.

**4. Los extremos del prompt tienen más peso:**

```
Claude atiende más a: [inicio del contexto] y [mensaje más reciente]
Claude atiende menos a: [medio del contexto]
→ Pon las instrucciones más críticas al principio del CLAUDE.md
```

### CLAUDE.md Global vs. de Proyecto

```bash
# Global (aplica a TODOS tus proyectos)
~/.claude/CLAUDE.md

# De proyecto (solo para este repo)
./CLAUDE.md

# De subdirectorio (para monorepos)
./apps/web/CLAUDE.md
```

Contenido sugerido para el global:

```markdown
# Preferencias globales del desarrollador

- Idioma de respuesta: español
- Siempre escribir tests cuando implementes funcionalidad nueva
- Preferir composición sobre herencia
- Antes de implementar, hacer un plan y esperar confirmación en tareas complejas
```

---

## 5. El Arte del Prompting para Código

### El framework CIPF (Contexto + Intención + Patrón + Formato)

```
❌ Prompt malo:  "Crea un componente de login"

✅ Prompt CIPF:
  [Contexto]  "Estoy trabajando en apps/web/app/auth/"
  [Intención]  "Necesito un formulario de login con validación"
  [Patrón]     "Siguiendo el mismo patrón que components/ui/UserCard.tsx"
  [Formato]    "Con TypeScript estricto y tests unitarios incluidos"

Resultado completo: "Crea un componente LoginForm en apps/web/app/auth/
siguiendo el patrón de components/ui/UserCard.tsx. Incluye validación
de email/password con zod, manejo de errores, y tests unitarios."
```

### Técnica de Few-Shot: El poder de los ejemplos

> 💡 **Analogía del aprendiz:** No le dices "cocina bien". Le muestras un plato de referencia y dices "así de bueno". Claude aprende de ejemplos mejor que de reglas abstractas.

```bash
# En lugar de describir el estilo, referencia el archivo modelo
claude "Crea un ProductCard siguiendo el mismo patrón que components/UserCard.tsx"

# Esto mejora consistencia de estilo en un 65% según benchmarks de Anthropic
```

### Técnica de Iteración por Feedback

No reescribas el prompt desde cero cuando el resultado no es perfecto. Itera:

```
Turno 1: "Implementa el módulo de autenticación"
Turno 2: "Bien, pero el manejo de errores debería usar el patrón Result,
          mira cómo lo hace services/payment.ts"
Turno 3: "Perfecto. Ahora agrega rate limiting como en middleware/apiLimiter.ts"
```

### Cuándo ser vago vs. específico

```
SÉ ESPECÍFICO cuando:          SÉ VAGO cuando:
- La tarea tiene requisitos     - Quieres explorar opciones
  técnicos claros               - La tarea es experimental
- Hay código de referencia      - Quieres ver cómo Claude
  existente a seguir              interpreta el problema
- Es código de producción       - Estás prototipando
```

---

## 6. Modos de Operación y Comandos Esenciales

### Slash Commands fundamentales

| Comando    | Función                                   | Cuándo usarlo                              |
| ---------- | ----------------------------------------- | ------------------------------------------ |
| `/clear`   | Resetea conversación (preserva CLAUDE.md) | Al cambiar de tarea                        |
| `/compact` | Comprime historial para liberar contexto  | Al 40-50% de contexto                      |
| `/context` | Muestra uso actual del contexto           | Monitoreo continuo                         |
| `/model`   | Cambia entre Opus/Sonnet                  | Opus para complejo, Sonnet para eficiencia |
| `/plan`    | Entra a Plan Mode                         | Antes de tareas complejas                  |
| `/agents`  | Gestiona subagentes                       | Configurar delegación                      |
| `/config`  | Configuración global                      | Setup inicial                              |
| `/doctor`  | Diagnóstica instalación                   | Cuando algo falla                          |

### Modelos: Opus vs. Sonnet

```
Claude Opus:   Máxima capacidad de razonamiento
               → Arquitectura, refactoring complejo, debugging difícil
               → Consume más tokens, más lento

Claude Sonnet: Balance costo/capacidad óptimo
               → Tareas de implementación, boilerplate, tests
               → Default recomendado para uso diario

Estrategia pro: Empieza con Opus para planificar, cambia a Sonnet para implementar
```

### Modo interactivo vs. modo headless (-p)

```bash
# Modo interactivo (default): conversación back-and-forth
claude

# Modo headless: ideal para scripts y CI/CD
claude -p "Ejecuta los tests y reporta errores"

# Para iterar sobre múltiples archivos
for file in src/**/*.ts; do
  claude -p "Revisa $file por vulnerabilidades de seguridad"
done

# Con herramientas permitidas específicas
claude -p "Analiza el código" --allowedTools "Read,Glob,Grep"
```

---

## 7. Gestión del Contexto: La Habilidad más Crítica

### El flujo de gestión profesional

```
Inicio de sesión nueva
        │
        ▼
[Tarea nueva o cambio de tema] ──→ /clear  (resetea conversación)
        │
        ▼
[Durante la sesión] ──→ /context (monitorear uso)
        │
        ├── < 40% → Seguir normalmente
        ├── 40-50% → /compact manual
        └── > 50% → /compact obligatorio o nueva sesión

[Tarea completada] ──→ Commit en Git antes de continuar
```

### El antipatrón "Kitchen Sink"

> ⚠️ **El error más común de principiantes:**

```
❌ Inicio con tarea A
   → Mientras espero, pregunto algo de tarea B
   → Vuelvo a tarea A
   → Hago pregunta sobre arquitectura general
   → Intento debuggear un bug en tarea C

Resultado: Contexto contaminado, Claude confuso, resultados inconsistentes
```

```
✅ Una sesión = Una tarea enfocada
   Cuando terminas: /clear o nueva sesión
```

### Cuándo NO hacer /clear

A veces el contexto acumulado es valioso:

- Cuando estás en un problema complejo y la historia de debugging es relevante
- Cuando Claude acaba de entender una arquitectura complicada de tu proyecto
- Cuando llevas 10 turnos refinando algo y el contexto previo informa cada respuesta

**Regla:** Si el contexto está sirviendo a la tarea actual, mantenlo. Si es ruido de tareas anteriores, límpialo.

---

## 8. Plan Mode: Planificar antes de Ejecutar

### ¿Por qué es no-negociable en tareas complejas?

> 💡 **Analogía del cirujano:** Un cirujano no empieza a cortar sin revisar los estudios del paciente. Claude en Plan Mode "estudia al paciente" antes de "operar el código".

El "vibe coding" (pedir y rezar) funciona para MVPs throwaway. Para código de producción, el flujo debe ser:

```
1. Entrar a Plan Mode: /plan (o shift+tab)
2. Describir la tarea de alto nivel
3. Señalar código existente relevante
4. Dejar que Claude proponga el approach
5. Revisar el plan EXHAUSTIVAMENTE → aquí capturas malentendidos baratos
6. Iterar sobre el plan si es necesario
7. Solo entonces: ejecutar
```

### Ejemplo de flujo Plan Mode

```bash
# Paso 1: Activar
/plan

# Paso 2: Describir
"Necesito agregar autenticación OAuth2 con Google a nuestra app Next.js.
 El sistema de auth actual está en apps/web/lib/auth/.
 Usa el patrón de services/payment.ts para manejo de errores."

# Claude propone:
# - Modificar 4 archivos específicos
# - Agregar 2 nuevas dependencias
# - Esquema de BD necesita 1 nueva columna
# - 3 nuevas rutas API

# Paso 3: Revisar
"El approach está bien, pero no toques el schema de BD todavía.
 Primero implementa el flujo sin persistencia y lo testeamos."

# Paso 4: Ejecutar con plan refinado
```

### Cuándo usar Plan Mode

```
✅ Usar Plan Mode:            ❌ Saltar Plan Mode:
- Cambios en 3+ archivos      - Bug fixes puntuales
- Nueva feature compleja      - Boilerplate/scaffolding
- Refactoring estructural     - Cambios de estilos/CSS
- Integraciones con servicios - Agregar un campo a un form
  externos
```

---

## 9. Permisos y Seguridad

### El sistema de permisos por niveles

```bash
# Nivel 1: Desarrollo local (permisivo)
claude config set allowedTools "Edit,Read,Write,Bash(npm*),Bash(git*)"

# Nivel 2: CI/CD (restringido)
claude config set allowedTools "Read,Bash(npm test),Bash(npm run lint)"

# Nivel 3: Solo lectura / review
claude config set allowedTools "Read,Glob,Grep"
```

### --dangerously-skip-permissions: el modo "yolo"

```bash
# ¿Qué hace?
# Elimina todos los prompts de confirmación ("¿puedo editar este archivo? ¿puedo correr lint?")

# ✅ Cuándo usarlo:
# - Lint fixes masivos
# - Generación de boilerplate
# - Refactoring mecánico
# - Cuando estás en un container sin acceso a internet (seguro)

# ⚠️ Cuándo NO usarlo:
# - En código con acceso a producción
# - Sin sandbox/container
# - Con MCPs que acceden a APIs externas

claude --dangerously-skip-permissions
```

> 💡 **Alternativa más segura:** `/sandbox` da autonomía similar con aislamiento de red y filesystem. Mejor para automatización larga.

### Permisos wildcards (más elegantes que dangerously-skip)

```bash
# Mejor práctica: wildcards específicos en lugar de skip-all
/permissions Bash(npm run *), Edit(/src/**), Read
```

---

## 10. Subagentes: Paralelismo e Isolación de Contexto

### ¿Qué son los subagentes?

Son instancias de Claude con su propio context window aislado, prompt especializado, acceso restringido a herramientas, y opcionalmente un modelo diferente al padre.

> 💡 **Analogía del equipo de consultores:** Contratas a un experto en seguridad (subagente security-reviewer) y un experto en performance (subagente performance-analyzer) para que auditen tu código simultáneamente. Cada uno trabaja en su propio despacho (contexto aislado) y al final te presentan sus reportes por separado. Tú (el orquestador) sintetizas los hallazgos.

### Subagente básico: estructura de archivo

```yaml
# .claude/agents/code-reviewer.md
---
name: code-reviewer
description: Revisa PRs buscando bugs, vulnerabilidades de seguridad y problemas de performance
tools: Read, Glob, Grep
model: sonnet
---
Eres un senior engineer especializado en code review.
Busca exclusivamente: bugs de lógica, vulnerabilidades de seguridad,
y problemas de performance. Sé conciso y directo.
NO comentes sobre estilo o naming conventions.
```

### Patrón Writer/Reviewer (el más poderoso)

```
# Sesión A (Writer):
claude "Implementa el módulo de checkout"

# Sesión B (Reviewer) — contexto fresco, sin bias:
claude "Revisa el módulo de checkout en src/checkout/.
        Busca bugs y problemas de seguridad."
```

**¿Por qué un reviewer con contexto fresco?** Claude no tendrá el bias de haber escrito el código. Encontrará errores que el "autor" pasaría por alto.

### Patrón Paralelo para features complejas

```
# En lugar de secuencial (lento):
Tú → Claude (backend) → esperas → Claude (frontend) → esperas → Claude (tests)

# Paralelo con subagentes (fast):
Tú → Claude Orquestador → [backend-agent] [frontend-agent] [test-agent]
                                  │               │              │
                             trabaja en       trabaja en    trabaja en
                            su contexto      su contexto   su contexto
                                  └───────────────┴──────────────┘
                                            Claude sintetiza
```

### Limitaciones importantes

```
❌ Los subagentes NO pueden:
   - Spawnear sus propios subagentes (no hay nesting)
   - Comunicarse directamente con otros subagentes hermanos
   - Ejecutar en modo "thinking" con output visible

✅ Los subagentes SÍ pueden:
   - Usar sus propios MCP servers
   - Tener un modelo diferente al padre
   - Ejecutar en paralelo (el padre los coordina)
```

---

## 11. MCP Servers: Conectar Claude al Mundo Real

### ¿Qué es MCP?

Model Context Protocol es el "USB-C para IA": un protocolo estándar que permite a Claude conectarse a sistemas externos —bases de datos, APIs, servicios de terceros— sin código de integración custom.

> 💡 **Analogía del electricista:** Un electricista puede conectar cualquier aparato a la red eléctrica sin importar la marca, porque el enchufe es estándar. MCP es ese estándar para conectar Claude a cualquier servicio.

### Instalación y uso básico

```bash
# Agregar un servidor MCP
claude mcp add playwright npx @playwright/mcp@latest
claude mcp add github npx @modelcontextprotocol/server-github

# Verificar servidores instalados
claude mcp list

# Usar en prompts (los comandos MCP aparecen como slash commands)
/mcp__playwright__take-screenshot
/mcp__github__list-pull-requests
```

### MCPs más útiles para desarrollo

```bash
# Testing y browser automation
claude mcp add playwright npx @playwright/mcp@latest

# Control de versiones y PRs
claude mcp add github npx @modelcontextprotocol/server-github

# Bases de datos
claude mcp add postgres npx @modelcontextprotocol/server-postgres

# Archivos y filesystem extendido
claude mcp add filesystem npx @modelcontextprotocol/server-filesystem

# Integración con Slack/comunicación
claude mcp add slack npx @modelcontextprotocol/server-slack
```

### Regla crítica de MCP y contexto

```
⚠️ Cada MCP server activo consume tokens de contexto.

Si tienes MCPs que suman más de 20.000 tokens de definiciones,
te quedan apenas 20.000 tokens para trabajo real.

→ Regla: máximo 2-3 MCP servers activos simultáneamente
→ Activar solo cuando se necesitan, desactivar después
```

### Seguridad en MCP

Los MCP servers pueden ejecutar código en tu máquina y acceder a APIs externas. En 2025 se identificaron vectores de prompt injection via MCP. Reglas básicas:

```
1. Solo instalar servidores de fuentes confiables (repos oficiales o auditados)
2. Revisar el código del servidor antes de instalarlo
3. Tener especial cuidado con MCPs que hacen fetch de contenido externo
4. No usar MCP servers de producción con --dangerously-skip-permissions
```

---

## 12. Skills y Plugins: El Ecosistema Extensible

### Skills: conocimiento reutilizable con divulgación progresiva

Las Skills son paquetes de conocimiento portable que Claude carga solo cuando los necesita:

```
Sin Skill: Claude debe inferir cómo deployar tu app cada vez
Con Skill: Claude lee SKILL.md y sabe exactamente los pasos, comandos y convenciones
```

**Estructura de una Skill:**

```markdown
<!-- .claude/skills/deploy.md -->

# Deploy Skill

## Cuándo usar esta skill

Cuando el usuario mencione deploy, release, producción, o CI/CD.

## Proceso de deploy

1. `npm run build` — verificar que buildea sin errores
2. `npm run test` — todos los tests deben pasar
3. `docker build -t app:$(git rev-parse --short HEAD) .`
4. Push a registry: `docker push registry.company.com/app:TAG`
5. Actualizar k8s: `kubectl set image deployment/app app=registry.company.com/app:TAG`

## Checklist previo

- [ ] Variables de entorno de producción verificadas en .env.production
- [ ] Migrations de BD corridas: `npx prisma migrate deploy`
```

### Plugins: paquetes de configuración para equipos

Los plugins agrupan Skills + Subagentes + Comandos en un paquete distribuible:

```bash
# Instalar plugin de la comunidad
/plugin install python-development    # 16 skills especializadas de Python
/plugin install security-scanning     # SAST con skill de seguridad
/plugin install comprehensive-review  # Análisis multi-perspectiva

# Para equipos: crear plugin interno
# → Empaqueta tu CLAUDE.md, skills y subagentes para compartir entre devs
```

### Cuándo usar qué extensión

```
┌─────────────────────────────────────────────────────────┐
│           ¿Necesitas acceso a sistema externo?           │
│                     (DB, API, GitHub)                    │
└─────────────────┬───────────────────────────────────────┘
                  │ Sí → MCP Server
                  │ No ↓
┌─────────────────────────────────────────────────────────┐
│        ¿Necesitas ejecución paralela o contexto          │
│                     aislado?                             │
└─────────────────┬───────────────────────────────────────┘
                  │ Sí → Subagente
                  │ No ↓
┌─────────────────────────────────────────────────────────┐
│    ¿Es conocimiento reutilizable que Claude debe         │
│         tener al alcance? (procedimientos, guías)        │
└─────────────────┬───────────────────────────────────────┘
                  │ Sí → Skill
                  │ No ↓
              CLAUDE.md o prompt directo
```

---

## 13. Workflows Avanzados y Patrones de Producción

### Workflow 1: Feature completa con TDD

```bash
# 1. Plan Mode: arquitectura
/plan
"Necesito implementar sistema de notificaciones por email.
 Stack actual: Next.js + Resend API. Ver services/payment.ts como referencia."

# 2. Subagente para tests (contexto aislado)
"Usa el subagente test-writer para crear los tests del módulo de notificaciones
 antes de que lo implementemos"

# 3. Implementación guiada por tests
"Ahora implementa NotificationService para que pasen todos los tests escritos"

# 4. Review con contexto fresco
/clear
"Revisa services/notifications.ts buscando bugs y problemas de seguridad"
```

### Workflow 2: Refactoring masivo paralelo

```bash
# En lugar de refactorizar archivos secuencialmente:
"Lanza subagentes paralelos para:
 1. Migrar components/legacy/ a TypeScript estricto
 2. Agregar tests a services/ que no tienen cobertura
 3. Documentar todas las interfaces en types/
 Reporta un resumen de lo que encontró cada uno."
```

### Workflow 3: PR Review automático con GitHub MCP

```bash
# Configurar una vez
/install-github-app

# Después, Claude revisa PRs automáticamente al abrirlos
# Configurar el comportamiento en .claude/claude-code-review.yml:
```

```yaml
# .claude/claude-code-review.yml
direct_prompt: |
  Revisa este PR buscando específicamente:
  1. Bugs de lógica y condiciones de carrera
  2. Vulnerabilidades de seguridad (inyección, XSS, auth bypass)
  3. Performance issues (N+1 queries, re-renders innecesarios)

  Sé conciso. Un punto por hallazgo. NO comentar sobre estilo o naming.
  Si no hay issues serios, responde "LGTM" y para.
```

### Workflow 4: Loop de monitoreo con /loop

```bash
# Para tareas de larga duración (hasta 3 días)
# Ideal para: vigilar deployments, esperar que pasen CI/CD, monitorear builds

/loop "Verifica cada 5 minutos si el deployment en staging completó
       (curl https://staging.app.com/health) y notifícame cuando esté healthy"
```

### Workflow 5: Pipeline CI/CD headless

```bash
#!/bin/bash
# ci-review.sh — ejecutar en cada PR

FILES_CHANGED=$(git diff --name-only origin/main...HEAD)

claude -p "Revisa los siguientes archivos por bugs y vulnerabilidades:
$FILES_CHANGED

Solo reporta issues críticos (bugs o seguridad). Formato JSON." \
  --allowedTools "Read,Grep" \
  --output-format json > review-output.json

# Parsear y fallar el CI si hay issues críticos
node scripts/evaluate-review.js review-output.json
```

---

## 14. Git como Red de Seguridad

> 💡 **Analogía del escalador:** Un escalador experto usa cuerda de seguridad no porque espere caerse, sino porque le permite intentar movimientos más audaces con confianza. Git es tu cuerda de seguridad con Claude Code.

### Reglas de oro de Git con Claude Code

```bash
# Regla 1: Commit antes de cada tarea grande
git add -A && git commit -m "checkpoint: antes de refactoring de auth"

# Regla 2: Commit apenas termina una tarea (no esperes)
# Target: al menos 1 commit por hora de trabajo intensivo

# Regla 3: Cuando Claude se va por las ramas, revertir fácilmente
# En Claude Code: Esc+Esc o /rewind
# En Git: git checkout -- . o git reset --hard HEAD

# Regla 4: Revisar SIEMPRE el diff antes de commitear
git diff --staged
# O en Claude Code: pide a Claude que explique qué cambió
```

### Usar Git worktrees para desarrollo paralelo

```bash
# Cada instancia de Claude trabaja en su propia rama aislada
git worktree add ../feature-auth feature/auth
git worktree add ../feature-notifications feature/notifications

# Terminal 1: Claude trabajando en auth
cd ../feature-auth && claude

# Terminal 2: Claude trabajando en notifications (simultáneo, sin conflictos)
cd ../feature-notifications && claude
```

---

## 15. Anti-patrones: Lo que NO hacer

### ❌ Anti-patrón 1: El Prompt Vago

```bash
❌ "Arregla los bugs"
✅ "En services/payment.ts línea 47, el manejo de timeout lanza
    una excepción no capturada. Agrega manejo de error siguiendo
    el patrón de services/auth.ts"
```

### ❌ Anti-patrón 2: El Kitchen Sink (sesión de todo)

```bash
❌ Una sesión donde le preguntas sobre arquitectura, debuggeas un bug,
   generas boilerplate, y discutes pros/cons de una librería.

✅ Una sesión = Una tarea. /clear entre tareas distintas.
```

### ❌ Anti-patrón 3: El Piloto Automático (no revisar diffs)

```bash
❌ Claude hace cambios → tú haces commit sin revisar
✅ Claude hace cambios → tú revisas diff → entiendes qué cambió → commit

"Soy el dueño del código. Claude es mi herramienta, no mi reemplazo."
```

### ❌ Anti-patrón 4: CLAUDE.md inflado

```bash
❌ CLAUDE.md de 500 líneas con todos los posibles comandos,
   guías de estilo completas, todos los patrones de la empresa.

✅ CLAUDE.md de <200 líneas con solo lo universalmente aplicable.
   El resto: Skills activadas on-demand.
```

### ❌ Anti-patrón 5: MCPs sin límite

```bash
❌ 10 MCP servers activos simultáneamente = 100k+ tokens consumidos
   solo en definiciones de herramientas → Claude trabaja con contexto mínimo

✅ Máximo 2-3 MCPs activos. Activar cuando se necesita, desactivar después.
```

### ❌ Anti-patrón 6: Ignorar /compact hasta que es tarde

```bash
❌ Esperar al mensaje "context window almost full" para actuar
✅ /compact proactivo al 40-50% de uso (monitorear con /context)
```

### ❌ Anti-patrón 7: Slash commands para todo

```bash
❌ Crear 30 slash commands especializados para cada workflow posible
   → Complejidad operacional alta, overhead de mantenimiento

✅ Para la mayoría de tareas: simplemente escribir en lenguaje natural.
   Slash commands para workflows que se repiten exactamente igual N veces.
```

---

## 16. Checklist del Experto

### Setup inicial de proyecto (una vez)

- [ ] Crear `CLAUDE.md` con estructura WHAT/WHY/HOW
- [ ] Identificar 2-3 archivos de referencia (few-shot) y agregarlos al CLAUDE.md
- [ ] Configurar nivel de permisos apropiado para el entorno
- [ ] Definir subagentes para roles recurrentes (reviewer, tester)
- [ ] Crear `claude-code-review.yml` si el repo usa GitHub PRs
- [ ] Instalar 1-2 MCPs esenciales (solo los que se usarán realmente)

### Por sesión de trabajo

- [ ] Comenzar sesión con `/context` para ver estado de memoria
- [ ] Si contexto > 0%: evaluar si hacer `/clear` o continuar
- [ ] Activar Plan Mode para tareas que toquen 3+ archivos
- [ ] Commit en Git antes de cada tarea grande
- [ ] Al 40-50% de contexto: `/compact` manual
- [ ] Al cambiar de tarea: `/clear`

### Por tarea completada

- [ ] Revisar diff completo antes de commitear
- [ ] Correr tests para verificar que nada se rompió
- [ ] Commit inmediato con mensaje descriptivo
- [ ] ¿Hay algo que aprendiste que debería ir al CLAUDE.md? Actualizar.

### Señales de que estás dominando Claude Code

```
✅ Claude rara vez te sorprende con cambios inesperados
   (porque planificaste bien con Plan Mode)

✅ Tus sesiones terminan con contexto limpio y código commiteado
   (gestión proactiva del contexto)

✅ Puedes interrumpir a Claude a mitad de una tarea y retomarlo
   sin perder el hilo (CLAUDE.md bien estructurado)

✅ Usas subagentes para tareas paralelas naturalmente
   (piensas en términos de agentes, no de prompts)

✅ Tus CLAUDE.md son concisos pero poderosos
   (menos instrucciones, mayor obediencia)
```

---

## Apéndice: Referencia rápida de comandos

```bash
# Inicio de sesión
claude                                    # Modo interactivo
claude --dangerously-skip-permissions     # Sin confirmaciones (en sandbox)
claude -p "tarea específica"              # Headless/scripting

# Durante la sesión (slash commands)
/clear          # Nueva conversación, contexto vacío
/compact        # Comprimir historial para liberar espacio
/context        # Ver uso del contexto
/plan           # Activar Plan Mode (shift+tab también funciona)
/model          # Cambiar entre opus/sonnet
/agents         # Gestionar subagentes
/config         # Ver/modificar configuración

# MCP
claude mcp add <nombre> <comando>         # Agregar servidor
claude mcp list                           # Ver servidores
claude mcp remove <nombre>                # Remover servidor

# Recuperación de errores
Esc + Esc                                 # Interrumpir tarea en curso
/rewind                                   # Deshacer último turno
git checkout -- .                         # Revertir cambios en archivos
```

---

_Esta guía refleja el estado de Claude Code a marzo 2026. El ecosistema evoluciona rápidamente — seguir [@anthropic](https://anthropic.com) y la documentación oficial en [docs.anthropic.com](https://docs.anthropic.com) para las últimas actualizaciones._
