---
title: 'OpenCode Master Class'
code: 'opencode'
description: 'Dominar OpenCode como un Profesional de Nivel Senior'
pubDate: 'Jun 6 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


# OpenCode Master Class
### Dominar OpenCode como un Profesional de Nivel Senior

> *"El programador del futuro no es el que escribe más código. Es el que toma las mejores decisiones sobre qué código debe existir."*

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Mentalidad Correcta](#mentalidad-correcta)
3. [Instalación Profesional](#instalación-profesional)
4. [Anatomía de OpenCode](#anatomía-de-opencode)
5. [Los 7 Niveles de Uso de OpenCode](#los-7-niveles-de-uso-de-opencode)
6. [Framework Profesional de Prompts](#framework-profesional-de-prompts)
7. [Context Engineering](#context-engineering)
8. [Desarrollo de Features](#desarrollo-de-features)
9. [Refactorización Profesional](#refactorización-profesional)
10. [Debugging con IA](#debugging-con-ia)
11. [Testing con OpenCode](#testing-con-opencode)
12. [Arquitectura de Software](#arquitectura-de-software)
13. [OpenCode + Git](#opencode--git)
14. [OpenCode + Next.js](#opencode--nextjs)
15. [OpenCode + Angular](#opencode--angular)
16. [OpenCode + Node.js](#opencode--nodejs)
17. [OpenCode + IA](#opencode--ia)
18. [Automatizaciones Avanzadas](#automatizaciones-avanzadas)
19. [Productividad Extrema](#productividad-extrema)
20. [Los 50 Prompts Más Útiles](#los-50-prompts-más-útiles)
21. [Errores que Cometen el 95% de los Desarrolladores](#errores-que-cometen-el-95-de-los-desarrolladores)
22. [Roadmap](#roadmap)
23. [Conclusión](#conclusión)

---

## Introducción

### ¿Qué es OpenCode?

Olvidate por un momento de la definición de marketing. Vamos a la definición de ingeniería.

**OpenCode es un agente de código que opera dentro de un loop de percepción-acción-validación.** No es un autocompletado glorificado. No es "ChatGPT dentro de la terminal". Es un sistema que:

1. **Percibe** el estado actual de tu proyecto (archivos, estructura, dependencias, convenciones).
2. **Razona** sobre qué cambios son necesarios para cumplir un objetivo.
3. **Actúa** ejecutando herramientas: lee archivos, escribe código, corre comandos, ejecuta tests.
4. **Valida** el resultado de sus propias acciones (¿compiló? ¿pasaron los tests? ¿hay errores de lint?).
5. **Itera** hasta que el resultado es correcto o hasta que necesita tu intervención.

Si alguna vez trabajaste con un becario brillante pero sin contexto de negocio, ya entendés la metáfora correcta: **OpenCode es ese becario, multiplicado por mil en velocidad, con memoria perfecta de la sintaxis de cientos de lenguajes, pero ciego al contexto que no le diste.**

La diferencia entre un desarrollador junior que usa OpenCode y un Staff Engineer que usa OpenCode no es la herramienta. Es **cuánto contexto, estructura y criterio le inyectan al sistema antes de pedirle resultados.**

### ¿Por qué está cambiando la forma de programar?

Durante las últimas tres décadas, la productividad de un desarrollador estuvo limitada por la **velocidad de escritura de código correcto**. Frameworks, IDEs, linters, generadores de scaffolding: toda la evolución de las herramientas de desarrollo apuntó a reducir la fricción entre "pensar la solución" y "tener la solución implementada".

OpenCode (y sus pares: Claude Code, Codex CLI, Cursor, Windsurf) representan un salto categóricamente distinto, no incremental. Por primera vez, **la fricción no está en escribir el código, está en comunicar la intención con precisión.**

Esto invierte el cuello de botella:

```
ANTES                              AHORA
─────                              ─────
Pensar la solución    (20%)        Pensar la solución    (50%)
Escribir el código    (60%)        Comunicar la intención (35%)
Debuggear             (20%)        Validar el resultado   (15%)
```

El trabajo de "teclear sintaxis" se volvió casi gratuito. El trabajo de **diseñar, especificar y validar** se volvió el verdadero diferencial. Por eso un desarrollador que no mejora su capacidad de pensar en sistemas, de comunicar requerimientos y de validar resultados, no se vuelve más productivo con OpenCode — se vuelve más rápido generando deuda técnica.

### ¿Cómo impactará el desarrollo de software en los próximos años?

Tres predicciones razonables, basadas en la trayectoria actual de la industria (no en hype):

1. **El código se convierte en un artefacto desechable y regenerable.** Cada vez más equipos van a tratar al código fuente como el resultado compilado de una especificación, no como el activo principal. La especificación (requirements, contratos de API, reglas de negocio) se vuelve el activo de mayor valor.

2. **La habilidad de "leer y juzgar código" supera en valor a la habilidad de "escribir código".** Vas a pasar más tiempo revisando, validando y corrigiendo el rumbo de un agente que escribiendo líneas vos mismo. Code review se convierte en la actividad central del día a día, no en una tarea secundaria.

3. **Los roles se fusionan.** La distancia entre developer, arquitecto, QA y product manager técnico se reduce, porque la herramienta permite ejecutar las cuatro disciplinas desde un mismo prompt bien diseñado. Esto no elimina la necesidad de especialistas — eleva el piso de lo que se espera de un generalista senior.

Esta Master Class te va a entrenar para estar del lado correcto de esa transición.

---

## Mentalidad Correcta

### Error del principiante: usar OpenCode como un chatbot

Así luce el patrón típico de un desarrollador que recién empieza:

```
> "Hazme una función para validar emails"
[recibe código]
> "ahora agrégale que también valide teléfonos"
[recibe código]
> "no funciona, arréglalo"
[recibe código]
> "sigue sin funcionar"
```

Este patrón tiene un nombre técnico: **prompting reactivo sin contexto acumulado**. Cada mensaje es una transacción aislada. No hay especificación, no hay restricciones, no hay criterio de aceptación. El resultado es exactamente lo que esperarías de delegarle una tarea ambigua a cualquier persona — humana o artificial: **resultados ambiguos.**

El problema de fondo no es que "la IA no entendió". El problema es que **nunca se le dio suficiente información para entender.** Es el equivalente a culpar a un compilador por un `NullPointerException` cuando el bug está en tu lógica.

### Mentalidad profesional: los 7 sombreros de OpenCode

Un desarrollador senior no usa OpenCode como una sola herramienta. Lo usa como **siete roles distintos**, cambiando de sombrero según la etapa del trabajo:

| Rol | Cuándo lo usás | Ejemplo de invocación |
|---|---|---|
| **Pair Programmer** | Mientras escribís código activamente | "Estoy implementando X, ¿cómo seguirías esta función?" |
| **Arquitecto** | Antes de implementar, para decidir estructura | "Dame 3 alternativas de diseño para este módulo con sus tradeoffs" |
| **Revisor de código** | Después de escribir, antes de mergear | "Revisá este PR como si fueras un Staff Engineer exigente" |
| **QA Engineer** | Para encontrar casos borde que no consideraste | "¿Qué edge cases no estoy testeando en esta función?" |
| **Technical Writer** | Para documentar decisiones y APIs | "Generá la documentación de este endpoint en formato OpenAPI" |
| **Investigador** | Para explorar trade-offs técnicos | "Compará Redis vs PostgreSQL LISTEN/NOTIFY para este caso de uso" |
| **Product Manager Técnico** | Para traducir requerimientos ambiguos en specs | "Convertí este ticket de Jira en criterios de aceptación verificables" |

**La clave conceptual (Feynman):** si no podés explicar para qué rol estás usando la herramienta en este momento, probablemente estás en modo chatbot. Antes de escribir un prompt, preguntate: *"¿qué sombrero necesito que se ponga ahora?"*

#### Caso real

Un developer mid-level pide:

> "Agregá un endpoint para crear usuarios"

Un developer senior, usando el sombrero de **Product Manager Técnico** primero y luego de **Arquitecto**, pide:

> "Necesito un endpoint POST /users. Antes de implementar: ¿qué validaciones de negocio típicas debería tener (unicidad de email, formato de password, rate limiting)? Dame las opciones y después decidimos cuáles aplican a este proyecto. No implementes todavía."

La diferencia no es la cantidad de palabras. Es que el segundo prompt **separa decisión de ejecución**, que es exactamente lo que hace un ingeniero senior con sus propios pensamientos antes de escribir una sola línea.

### Errores comunes en esta etapa

- ❌ Pedir resultados finales sin pedir alternativas primero en decisiones de alto impacto.
- ❌ Tratar cada mensaje como aislado, sin acumular contexto del proyecto.
- ❌ No corregir al agente cuando se desvía — dejar que "siga generando" en la dirección equivocada.
- ❌ Aceptar el primer resultado sin pedir una segunda opinión ("revisá esto como si lo hubiera escrito otra persona").

### Cómo lo usaría un desarrollador senior

Antes de cualquier feature de tamaño medio o grande, un senior sigue mentalmente esta secuencia, sin importar qué tan simple parezca la tarea a simple vista:

```
¿Qué problema resuelve esto?
        ↓
¿Qué restricciones tiene el proyecto que debo respetar?
        ↓
¿Qué alternativas de diseño existen?
        ↓
Elegir + justificar
        ↓
Implementar
        ↓
Validar (tests, lint, build)
        ↓
Documentar la decisión
```

Vas a ver este flujo repetirse, con variaciones, en casi todas las secciones siguientes de esta guía.

---

## Instalación Profesional

### Setup recomendado

OpenCode corre como una CLI multiplataforma. La instalación en sí no es lo importante — lo importante es la **configuración posterior**, que es donde se diferencia un setup amateur de uno profesional.

#### Windows

```powershell
# Vía winget
winget install opencode

# Vía npm (requiere Node 18+)
npm install -g opencode-ai
```

> Nota: si trabajás con WSL2, instalá OpenCode **dentro** de la distro de Linux, no en Windows nativo. Vas a evitar problemas de paths, permisos y line endings (CRLF vs LF) que generan ruido innecesario en los diffs que el agente genera.

#### macOS

```bash
brew install opencode

# o vía script oficial
curl -fsSL https://opencode.ai/install.sh | sh
```

#### Linux

```bash
curl -fsSL https://opencode.ai/install.sh | sh

# o vía paquete específico de tu distro si está disponible
```

> Verificá siempre la documentación oficial del proyecto antes de instalar, ya que los comandos de instalación de herramientas en evolución rápida cambian con frecuencia.

### Configuración ideal

Un setup amateur termina aquí: instala, abre la terminal, empieza a escribir prompts. Un setup profesional invierte 30 minutos en configurar el entorno **una sola vez** para ahorrar horas durante meses.

#### Modelos recomendados

OpenCode te permite elegir el modelo subyacente. La elección de modelo no es estética, es una decisión de ingeniería con tradeoffs reales:

| Tarea | Modelo sugerido | Por qué |
|---|---|---|
| Generación de código complejo, arquitectura | Modelo de mayor capacidad de razonamiento disponible | Las decisiones de diseño se benefician de mayor profundidad de razonamiento |
| Tareas repetitivas, scaffolding, boilerplate | Modelo más rápido/económico | No necesitás razonamiento profundo para generar un CRUD estándar |
| Revisión de seguridad, código crítico | Modelo de mayor capacidad disponible | El costo de un error aquí es mucho mayor que el costo del modelo |

**Principio general:** no uses el modelo más caro para todo, ni el más barato para todo. Igual que no usarías a tu arquitecto principal para escribir un README, ni a un junior para diseñar el esquema de base de datos de pagos.

#### Variables de entorno

Configurá tus credenciales y preferencias en variables de entorno, nunca hardcodeadas en archivos de configuración versionados:

```bash
export OPENCODE_API_KEY="tu-api-key"
export OPENCODE_DEFAULT_MODEL="modelo-preferido"
export OPENCODE_MAX_CONTEXT_TOKENS=200000
```

Y agregá siempre tus archivos de configuración local a `.gitignore`:

```gitignore
.opencode/
.opencode.local.json
*.opencode.cache
```

#### Configuración avanzada

A nivel de proyecto, OpenCode (como sus pares) soporta un archivo de reglas/contexto persistente — el equivalente a un `CLAUDE.md` o `.cursorrules`. Este archivo es, sin exagerar, **la pieza de configuración más importante de todo tu setup**, y la vamos a tratar en profundidad en la sección de Context Engineering.

Checklist de configuración avanzada profesional:

- [ ] Archivo de reglas de proyecto (convenciones, stack, estructura de carpetas).
- [ ] Comandos permitidos/bloqueados (ej. bloquear `rm -rf`, `git push --force`).
- [ ] Integración con linter y formatter del proyecto.
- [ ] Hooks de validación post-generación (build, test, lint automático).
- [ ] Exclusión de carpetas pesadas del contexto (`node_modules`, `dist`, `.next`).

---

## Anatomía de OpenCode

### Cómo funciona internamente

Para usar cualquier herramienta al máximo nivel, necesitás un modelo mental correcto de cómo funciona por debajo. No necesitás saber la implementación exacta — necesitás un **modelo conceptual útil**, como el que tenés del motor de un auto sin ser mecánico.

### Arquitectura conceptual

```
                    ┌─────────────────┐
                    │     Usuario     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │      Prompt      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Context Engine   │  ← lee archivos, git history,
                    │                   │    reglas de proyecto, memoria
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │       LLM         │  ← razona sobre la tarea
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Tool Calls      │  ← leer archivo, escribir,
                    │                   │    ejecutar comando, buscar
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Code Generation   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Validación      │  ← build, test, lint
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
           ✅ Correcto              ❌ Falla
                │                         │
                ▼                         ▼
          ┌──────────┐            ┌──────────────┐
          │ Resultado │            │ Vuelve al LLM │
          └──────────┘            │  (itera)       │
                                   └──────────────┘
```

### Por qué este modelo mental importa

Cada vez que un resultado te decepciona, este diagrama te da un mapa de diagnóstico:

- **¿El problema es de Context Engine?** → El agente no tenía la información correcta sobre tu proyecto. Solución: mejorar el contexto, no el prompt.
- **¿El problema es del LLM razonando?** → La tarea estaba mal especificada o era ambigua. Solución: mejorar el prompt, pedir alternativas antes de implementar.
- **¿El problema es de Tool Calls?** → El agente ejecutó el comando equivocado o no tenía permisos. Solución: revisar configuración de herramientas permitidas.
- **¿El problema es de Validación?** → No hay loop de feedback automático (tests, build). Solución: configurar validación automática para que el agente se autocorrija sin que intervengas.

Un desarrollador junior ve "la IA se equivocó" como un evento monolítico. Un desarrollador senior **localiza en qué etapa del pipeline ocurrió la falla** y corrige esa etapa específica.

---

## Los 7 Niveles de Uso de OpenCode

Así como existe una progresión Junior → Staff en ingeniería de software, existe una progresión equivalente en madurez de uso de agentes de código. La mayoría de los desarrolladores se queda estancada en el Nivel 2 o 3 indefinidamente, sin saber que existen niveles superiores.

### Nivel 1 — Generación simple

Pedís una pieza de código aislada: una función, un componente, un query.

```
Prompt típico: "Creá una función que valide si un string es un email válido"
```

Es el nivel de entrada. Útil, pero de bajo apalancamiento: ahorra minutos, no horas.

### Nivel 2 — Refactorización

Le pedís al agente que mejore código existente sin cambiar su comportamiento externo.

```
Prompt típico: "Refactorizá este componente para separar la lógica de negocio
de la lógica de presentación, sin cambiar el comportamiento"
```

Acá empieza a importar el contexto: el agente necesita entender el código actual antes de poder mejorarlo con criterio.

### Nivel 3 — Debugging

Usás al agente para diagnosticar y resolver fallas, no solo para escribir código nuevo.

```
Prompt típico: "Este endpoint devuelve 500 intermitentemente bajo carga.
Aquí están los logs. Generá 3 hipótesis y cómo validarías cada una."
```

### Nivel 4 — Testing

El agente diseña y escribe la estrategia de testing, no solo casos sueltos.

```
Prompt típico: "Diseñá la suite de tests para este módulo de pagos,
priorizando los casos de fraude y los edge cases de moneda"
```

### Nivel 5 — Arquitectura

Usás al agente como sparring partner de decisiones de diseño de sistemas completos.

```
Prompt típico: "Necesito diseñar el sistema de notificaciones para una
plataforma con 100k usuarios concurrentes. Dame 3 arquitecturas posibles
con sus tradeoffs de costo, latencia y complejidad operativa."
```

### Nivel 6 — Automatización

El agente deja de responder a prompts puntuales y empieza a ejecutar **flujos completos**: generar código, correr tests, hacer commit, abrir PR, generar changelog — encadenado, con mínima supervisión humana en cada paso intermedio.

### Nivel 7 — AI Development System

Este es el nivel que separa a un usuario avanzado de un **AI Engineer**. En este nivel, no usás a OpenCode como una herramienta puntual — lo integrás como **una pieza de tu sistema de desarrollo**: reglas de proyecto persistentes, agentes especializados por tipo de tarea, pipelines de CI que invocan al agente para revisión automática, generación de documentación continua, y memoria de decisiones arquitectónicas que se reutiliza en cada sesión nueva.

```
Nivel 1 ──► Nivel 2 ──► Nivel 3 ──► Nivel 4 ──► Nivel 5 ──► Nivel 6 ──► Nivel 7
 (ahorra      (mejora      (resuelve    (asegura    (decide      (orquesta    (el agente es
 minutos)     calidad)     problemas)   calidad)    sistemas)    flujos)      infraestructura)
```

**Errores comunes en esta progresión:**

- ❌ Quedarse en Nivel 1-2 indefinidamente porque "funciona para lo que necesito" — perdiendo el 80% del valor potencial.
- ❌ Saltar directo a Nivel 6-7 sin dominar Nivel 3-5 — generar automatizaciones sobre decisiones de diseño que nunca se validaron con criterio humano.
- ❌ Creer que el nivel se define por la complejidad del prompt, cuando en realidad se define por **el tipo de decisión que delegás**.


---

## Framework Profesional de Prompts

Vamos a comparar cuatro niveles de prompt para **la misma tarea**, para que veas exactamente qué información se agrega en cada salto de calidad. La tarea: *"agregar paginación a un listado de productos en una API REST"*.

### Prompt Malo

```
Agregale paginación al endpoint de productos
```

**Por qué es malo:** no especifica el estilo de paginación (offset/limit vs cursor-based), no dice qué framework usa el proyecto, no define el contrato de respuesta esperado, no menciona si hay convenciones existentes que respetar. El agente va a **inventar** todas estas decisiones, y probablemente de forma inconsistente con el resto del proyecto.

### Prompt Bueno

```
Agregale paginación al endpoint GET /products. Usá query params
?page=1&limit=20. Devolvé también el total de registros y el total
de páginas en la respuesta.
```

**Por qué mejora:** define el contrato de la API explícitamente. Ya no hay ambigüedad sobre el formato. Sigue faltando contexto sobre el proyecto (¿qué ORM usa? ¿hay un estándar de respuesta ya definido en otros endpoints?).

### Prompt Senior

```
Agregale paginación al endpoint GET /products siguiendo el mismo
patrón que ya usamos en GET /orders (revisá ese archivo como
referencia de convención). Usá query params ?page&limit con
valores default page=1, limit=20, y un máximo de limit=100 para
evitar abuso. La respuesta debe incluir metadata de paginación
(total, totalPages, hasNext, hasPrev). Si el ORM ya soporta
paginación nativa (revisá si es Prisma o TypeORM), usá esa
funcionalidad en lugar de implementarla manualmente.
```

**Por qué mejora:** ancla la implementación a una convención **existente** en el proyecto (consistencia), define límites de seguridad (rate/abuse), y delega al agente la decisión de "cómo" pero no el "qué" — que ya quedó completamente especificado.

### Prompt Staff Engineer

```
Necesito agregar paginación al endpoint GET /products.

Contexto:
- El proyecto usa Express + Prisma.
- Ya existe paginación implementada en GET /orders (src/routes/orders.ts).
  Usala como referencia de convención, no la reinventes.
- Este endpoint es de alto tráfico (es la landing de productos).

Antes de implementar:
1. Revisá si conviene paginación offset-based o cursor-based dado
   el volumen esperado (>100k productos) y explicá el tradeoff.
2. Verificá si la tabla "products" tiene un índice adecuado para
   el campo de ordenamiento por defecto.
3. Si detectás que falta un índice, indicámelo antes de continuar
   (no lo agregues sin que yo lo confirme).

Luego:
- Implementá siguiendo la convención de orders.ts.
- Generá tests de integración para: página vacía, límite excedido,
  parámetros inválidos, y comportamiento con 0 resultados.
- Documentá el contrato actualizado en el archivo OpenAPI existente.
```

**Por qué es Staff Engineer:** combina las cuatro capas de un buen prompt profesional:

1. **Contexto técnico explícito** (stack, archivos de referencia, restricciones de negocio).
2. **Separación de análisis y ejecución** (paso 1-3 antes de implementar).
3. **Punto de control explícito** ("indicámelo antes de continuar") — el agente no avanza sobre decisiones de alto impacto sin aprobación.
4. **Definición de "terminado"** (tests específicos, documentación actualizada) — no deja la validación a interpretación del agente.

### Framework reutilizable: las 5 capas de un prompt profesional

```
┌─────────────────────────────────────────┐
│ 1. ROL          → ¿Qué expertise asumo?  │
│ 2. CONTEXTO      → ¿Qué debe saber del    │
│                    proyecto/dominio?       │
│ 3. RESTRICCIONES → ¿Qué NO debe hacer?    │
│ 4. PROCESO       → ¿En qué orden debe      │
│                    pensar/actuar?          │
│ 5. CRITERIO DE   → ¿Cómo sé que terminó    │
│    ACEPTACIÓN      correctamente?          │
└─────────────────────────────────────────┘
```

No todas las tareas necesitan las 5 capas. Una tarea de Nivel 1 (generación simple) puede resolverse con rol + contexto. Una tarea de Nivel 5+ (arquitectura) casi siempre necesita las 5.

---

## Context Engineering

### Qué es

Context Engineering es la disciplina de **diseñar qué información tiene disponible el agente en el momento de razonar**, en lugar de confiar en que el prompt aislado contenga todo lo necesario.

Mientras que el Prompt Engineering optimiza *qué le pedís*, el Context Engineering optimiza *qué sabe* cuando se lo pedís.

### Por qué es más importante que el Prompt Engineering

Pensalo con esta analogía: contratás a un desarrollador freelance brillante para que trabaje en tu proyecto por un día. Podés:

- **(A)** Darle instrucciones perfectamente redactadas pero sin acceso al repositorio, sin ver el resto del código, sin saber las convenciones del equipo.
- **(B)** Darle instrucciones mediocres, pero acceso completo al repo, al historial de decisiones, a la documentación interna y a un ejemplo de cómo se resolvió algo similar antes.

La opción (B) produce mejores resultados casi siempre, incluso con peor "prompt". Esto es exactamente lo que pasa con los agentes de código: **el contexto pobre no se compensa con un prompt brillante, pero el contexto rico sí compensa un prompt mediocre.**

Esta es la razón técnica detrás del fenómeno: los modelos de lenguaje no "saben" tu proyecto. Cada conversación parte de un estado donde el modelo tiene conocimiento general (patrones, lenguajes, frameworks) pero **cero conocimiento específico** de tus decisiones, tu historial, tus convenciones — a menos que se lo proveas explícitamente, en cada sesión.

### Cómo estructurar contexto

El archivo de reglas de proyecto (equivalente a `AGENTS.md`, `CLAUDE.md`, `.cursorrules` según la herramienta) es la pieza central. Una estructura profesional típica:

```markdown
# Reglas del Proyecto

## Stack
- Backend: Node.js 20 + Express + Prisma + PostgreSQL
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind
- Testing: Vitest + Playwright

## Convenciones
- Componentes en PascalCase, hooks con prefijo "use"
- Servicios de negocio van en /src/services, nunca lógica de negocio en controllers
- Toda función pública debe tener su test correspondiente

## Restricciones
- Nunca modificar /src/legacy sin aprobación explícita
- No usar `any` en TypeScript bajo ninguna circunstancia
- No instalar dependencias nuevas sin justificación

## Arquitectura
- Seguimos arquitectura hexagonal: domain / application / infrastructure
- Los controllers solo orquestan, no contienen lógica

## Comandos útiles
- `npm run test` corre la suite completa
- `npm run db:migrate` aplica migraciones pendientes
```

### Cómo cargar proyectos grandes

En proyectos grandes (monorepos, +50k líneas), cargar "todo el contexto" no es posible ni deseable — generaría ruido y costo. La estrategia profesional es **contexto progresivo y dirigido**:

```
Nivel 0: Reglas globales del proyecto (siempre cargadas)
   ↓
Nivel 1: Estructura de carpetas del módulo relevante
   ↓
Nivel 2: Archivos directamente relacionados con la tarea
   ↓
Nivel 3: Archivos de referencia (ejemplos de convención similar)
   ↓
Nivel 4: Historial de Git relevante (solo si hay debugging de regresión)
```

Un error común es pedirle al agente que "lea todo el proyecto" para una tarea puntual. Esto no mejora la calidad — diluye la atención del modelo en información irrelevante y consume contexto que podría usarse para razonar con más profundidad sobre lo que sí importa.

### Cómo dividir información

Para tareas complejas, dividí el contexto en **capas de responsabilidad**, no en bloques arbitrarios de texto:

- **Qué existe** (estructura, archivos relevantes).
- **Qué se debe respetar** (convenciones, restricciones).
- **Qué se debe lograr** (objetivo de la tarea actual).
- **Cómo se valida** (tests, criterios de aceptación).

### Cómo mantener consistencia

La consistencia entre sesiones se logra con tres prácticas:

1. **El archivo de reglas de proyecto se actualiza como código** — vive en el repo, se versiona, se revisa en PRs igual que cualquier otro archivo.
2. **Las decisiones arquitectónicas se documentan apenas se toman** (ADRs — Architecture Decision Records), y se referencian en prompts futuros en lugar de re-explicarlas cada vez.
3. **Los ejemplos de "código de referencia"** se mantienen actualizados — si el patrón que usás como ejemplo en tus prompts queda obsoleto, todos los prompts que lo referencian heredan ese error.


---

## Desarrollo de Features

### Metodología completa

Un Staff Engineer no le pide a OpenCode "implementá la feature X" de un solo tiro, salvo que sea trivial. Sigue una metodología de seis etapas, cada una con su propio tipo de prompt:

```
1. Análisis  →  2. Diseño  →  3. Implementación  →  4. Testing  →  5. Refactor  →  6. Documentación
```

#### 1. Análisis

Objetivo: convertir un requerimiento ambiguo en una especificación verificable.

```
Prompt: "Este es el ticket: '[pegar ticket]'. Convertilo en criterios
de aceptación verificables. Identificá qué información falta para
poder implementarlo sin ambigüedad."
```

#### 2. Diseño

Objetivo: decidir el "cómo" antes de escribir código.

```
Prompt: "Dado estos criterios de aceptación, proponé 2-3 enfoques de
implementación. Para cada uno, indicá complejidad, impacto en el
código existente, y riesgo. Recomendá uno y justificá por qué."
```

#### 3. Implementación

Objetivo: ejecutar la decisión ya tomada, sin reabrir el debate de diseño.

```
Prompt: "Implementá el enfoque B que acordamos, siguiendo las
convenciones de /src/modules/orders como referencia."
```

#### 4. Testing

Objetivo: validar que el comportamiento es correcto, incluyendo casos borde.

```
Prompt: "Generá tests unitarios y de integración para esta
implementación. Priorizá los edge cases que identificamos en el
análisis: cantidad cero, usuario sin permisos, concurrencia."
```

#### 5. Refactor

Objetivo: mejorar la calidad del código sin alterar el comportamiento ya validado por tests.

```
Prompt: "Los tests pasan. Ahora revisá el código en busca de
duplicación, nombres poco claros, o violaciones de SRP. No
cambies el comportamiento — los tests deben seguir pasando."
```

#### 6. Documentación

Objetivo: dejar registro de qué se hizo y por qué, para quien lea esto en 6 meses (incluido tu yo del futuro).

```
Prompt: "Generá un resumen para el PR: qué cambia, por qué se eligió
este enfoque sobre las alternativas descartadas, y qué riesgos
quedan pendientes de monitorear post-deploy."
```

### Por qué este orden importa (Kent Beck + Fowler)

Separar diseño de implementación es el mismo principio detrás de TDD y el desarrollo incremental: **tomar decisiones reversibles antes de tomar decisiones costosas de revertir**. Pedirle código al agente antes de validar el enfoque es equivalente a escribir 500 líneas antes de dibujar el diagrama de arquitectura — técnicamente posible, profesionalmente desaconsejable.

---

## Refactorización Profesional

### Cómo pedir refactors con criterio explícito

El error más común al pedir refactors es ser vago: *"mejorá este código"*. Un agente, ante ambigüedad, va a optimizar por lo que **parezca** mejor en abstracto, no por lo que tu equipo valora específicamente. Tenés que nombrar el principio que querés aplicar.

#### Clean Code (Robert C. Martin)

```
Prompt: "Refactorizá esta función aplicando los principios de Clean
Code: nombres que revelen intención, funciones que hagan una sola
cosa, máximo 3 niveles de indentación, sin comentarios que expliquen
'qué' hace el código (el código debe ser autoexplicativo)."
```

#### SOLID

```
Prompt: "Esta clase viola SRP (tiene lógica de persistencia, validación
y notificación mezcladas). Separala en 3 clases siguiendo SRP, e
inyectá las dependencias en lugar de instanciarlas internamente
(para cumplir DIP)."
```

#### DDD (Domain-Driven Design)

```
Prompt: "Este módulo trata la lógica de negocio como simples
transacciones CRUD. Modelalo como un Agregado de DDD: identificá
las invariantes que deben protegerse, y movés la validación de
negocio al dominio en lugar de dejarla en el controller."
```

#### Hexagonal Architecture

```
Prompt: "Este servicio depende directamente de Prisma. Aislá la
lógica de dominio detrás de un puerto (interfaz), y el adaptador
de Prisma debe implementar ese puerto. El dominio no debe importar
nada de la capa de infraestructura."
```

#### Modularización

```
Prompt: "Este archivo de 800 líneas mezcla 4 responsabilidades
distintas. Proponé cómo dividirlo en módulos, mostrame el árbol de
archivos resultante antes de mover una sola línea de código."
```

### Errores comunes en refactorización con IA

- ❌ Pedir refactor sin tener tests previos que protejan el comportamiento (refactor sin red de seguridad).
- ❌ Pedir "mejorá todo" en archivos grandes — generás diffs gigantes imposibles de revisar con criterio.
- ❌ Aceptar refactors que cambian comportamiento sutilmente (ej. cambiar el orden de evaluación de un `&&` con side-effects).

### Cómo lo usaría un senior

Un senior **nunca** pide un refactor de archivo completo de una sola vez en código crítico. Divide en pasos pequeños, revisables, cada uno con su propio commit:

```
Paso 1: Extraer función pura sin cambiar comportamiento (commit)
Paso 2: Separar responsabilidades en clases distintas (commit)
Paso 3: Introducir interfaces para invertir dependencias (commit)
```

Esto no es "lento" — es la misma disciplina del *refactoring en baby steps* de Kent Beck, aplicada con un agente como ejecutor.

---

## Debugging con IA

### Cómo encontrar bugs

El antipatrón es pegar el error y pedir "arreglalo". Funciona para errores triviales, pero falla sistemáticamente en bugs reales de producción, donde la causa raíz no es obvia desde el stack trace.

### Cómo analizar logs

```
Prompt: "Acá tenés los logs de los últimos 3 incidentes de timeout
en el endpoint /checkout. Buscá patrones: ¿ocurre en un horario
específico? ¿con un tipo de usuario específico? ¿después de un
deploy específico?"
```

### Cómo reproducir errores

```
Prompt: "Basado en este stack trace y el código del módulo, escribí
un test que reproduzca el bug de forma determinística. Si no podés
reproducirlo con la información disponible, decime exactamente qué
información adicional necesitás (no asumas)."
```

### Cómo crear hipótesis (Feynman: pensar en términos de falsabilidad)

```
Prompt: "Generá 3 hipótesis posibles para esta race condition.
Para cada hipótesis, decime qué evidencia la confirmaría y qué
evidencia la refutaría, para que pueda validarlas una por una
en lugar de adivinar."
```

### Cómo validar soluciones

```
Prompt: "Antes de aplicar el fix, explicame por qué este fix
específico resuelve la causa raíz y no solo el síntoma. ¿Qué
otros lugares del código podrían tener el mismo problema
estructural?"
```

### Errores comunes en debugging con IA

- ❌ Pedir el fix antes de entender la causa raíz — produce parches que esconden el síntoma sin resolver el problema.
- ❌ No darle al agente el contexto temporal (¿cuándo empezó a pasar? ¿después de qué cambio?) — sin esto, el espacio de hipótesis es innecesariamente grande.
- ❌ Aplicar el primer fix sugerido en código de producción crítico sin pedir un análisis de impacto en otras partes del sistema.

---

## Testing con OpenCode

### Unit Tests

```
Prompt: "Generá unit tests para esta función pura. Cubrí: caso
feliz, valores límite (0, negativo, máximo), tipos inválidos,
y el comportamiento esperado ante inputs nulos o undefined."
```

### Integration Tests

```
Prompt: "Generá tests de integración para este endpoint, usando
una base de datos de test real (no mocks de Prisma). Cubrí el
flujo completo: creación, lectura con paginación, y el caso de
conflicto de unicidad."
```

### E2E

```
Prompt: "Escribí un test E2E con Playwright para el flujo de
checkout completo: agregar producto, aplicar cupón inválido,
aplicar cupón válido, confirmar pago. Priorizá legibilidad del
test sobre brevedad — otro developer debe poder entender el
flujo de negocio leyendo el test."
```

### TDD (Test-Driven Development)

```
Prompt: "Vamos a hacer TDD. Primero escribí solo el test que
describe el comportamiento esperado de '[feature]', sin
implementación todavía. Esperá mi confirmación antes de
escribir el código que lo hace pasar."
```

### BDD (Behavior-Driven Development)

```
Prompt: "Convertí estos criterios de aceptación en escenarios
Gherkin (Given/When/Then) antes de implementar, para validar
que entendemos el comportamiento de negocio igual."
```

### Prompts recomendados — checklist de cobertura

- [ ] ¿Casos felices?
- [ ] ¿Valores límite (0, negativo, máximo, vacío)?
- [ ] ¿Inputs inválidos o malformados?
- [ ] ¿Comportamiento bajo concurrencia (si aplica)?
- [ ] ¿Comportamiento ante fallas de dependencias externas (timeout, 500)?
- [ ] ¿Casos de seguridad (inyección, permisos, autenticación)?


---

## Arquitectura de Software

### Cómo usar OpenCode para decisiones de arquitectura

El valor de un agente de código en arquitectura no es que "diseñe por vos" — es que **acelera la exploración del espacio de soluciones** para que decidas con más información en menos tiempo. Martin Fowler lo resumiría así: la arquitectura es sobre las decisiones difíciles de revertir; cuanto más rápido exploras alternativas, menos costoso es el error de elegir mal.

### Diseñar SaaS

```
Prompt: "Necesito diseñar la arquitectura multi-tenant de un SaaS B2B.
Comparame 3 estrategias de aislamiento de datos: schema por tenant,
base de datos por tenant, y row-level con tenant_id. Para cada una,
indicá impacto en costo de infraestructura, complejidad operativa,
y facilidad de hacer backups/restores por cliente individual."
```

```
Esquema resultante (ejemplo):

  Estrategia A: Schema por tenant
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ tenant_1 │  │ tenant_2 │  │ tenant_3 │   (misma DB, distinto schema)
  └──────────┘  └──────────┘  └──────────┘

  Estrategia B: Row-level con tenant_id
  ┌─────────────────────────────────────┐
  │ tabla "orders" con columna tenant_id  │   (1 sola DB, 1 solo schema)
  └─────────────────────────────────────┘
```

### Diseñar Fintech

```
Prompt: "Diseñá el flujo de procesamiento de pagos considerando:
idempotencia (evitar cobros duplicados), reconciliación con el
proveedor de pagos, y manejo de webhooks que llegan fuera de orden.
Mostrame el diagrama de estados de una transacción."
```

### Diseñar Logistics Platforms

```
Prompt: "Necesito modelar el tracking de envíos en tiempo real para
10k vehículos. Compará un enfoque basado en polling vs WebSockets
vs un message broker (Kafka/RabbitMQ) para la ingesta de ubicaciones,
considerando picos de tráfico y costo de infraestructura."
```

### Diseñar AI Agents

```
Prompt: "Quiero diseñar un agente que automatice la clasificación de
tickets de soporte. Definí: qué herramientas necesita (lectura de
ticket, búsqueda en knowledge base, escalado a humano), cómo
manejamos los casos de baja confianza, y cómo medimos su precisión
en producción."
```

### Errores comunes al usar IA para arquitectura

- ❌ Aceptar la primera arquitectura propuesta sin pedir alternativas — perdés la parte más valiosa del proceso.
- ❌ No anclar la decisión a restricciones reales de negocio (presupuesto, equipo, plazos) — la "mejor" arquitectura en abstracto puede ser inviable para tu contexto.
- ❌ Pedir arquitecturas "a prueba de futuro" sin escala definida — sobre-ingeniería disfrazada de buena práctica.

---

## OpenCode + Git

### Flujo profesional

```
main
 │
 ├─── feature/checkout-coupons ──► PR ──► Code Review ──► Merge
 │
 └─── feature/user-notifications ──► PR ──► Code Review ──► Merge
```

### Feature Branches

```
Prompt: "Antes de implementar, creá una branch siguiendo nuestra
convención: feature/[ticket-id]-[descripcion-corta]. Confirmame
el nombre antes de crearla."
```

### Pull Requests

```
Prompt: "Generá la descripción del PR siguiendo nuestro template:
qué cambia, por qué, cómo se testeó, y qué riesgos quedan. Incluí
una sección de 'cómo revisar este PR' indicando el orden sugerido
de lectura de archivos."
```

### Code Reviews

```
Prompt: "Revisá este diff como si fueras un Staff Engineer exigente
pero justo. Buscá: bugs potenciales, violaciones de las convenciones
del proyecto, tests faltantes, y problemas de seguridad. No
comentes sobre estilo si ya lo cubre el linter."
```

### Commit Messages

```
Prompt: "Generá el mensaje de commit siguiendo Conventional Commits
(feat/fix/refactor/docs/test) basado en este diff. El mensaje debe
explicar el 'por qué', no repetir lo que el diff ya muestra."
```

### Release Notes

```
Prompt: "Generá el changelog de esta release agrupando por tipo
(Features, Fixes, Breaking Changes) a partir de estos commits.
Escribilo para una audiencia no técnica — son nuestros clientes,
no developers."
```

---

## OpenCode + Next.js

### Caso práctico completo

**Escenario:** agregar un dashboard de analíticas con Server Components y streaming.

```
Prompt 1 (Análisis):
"Necesito un dashboard que muestre métricas de ventas de los
últimos 30 días. Los datos vienen de una query pesada (~2s).
¿Conviene Server Component con streaming (Suspense) o Client
Component con fetch + loading state? Explicá el tradeoff
considerando que queremos buen SEO y buena percepción de
velocidad."

Prompt 2 (Implementación):
"Implementá el enfoque de Server Component con streaming.
Usá Suspense boundaries para que el layout cargue inmediato
y las métricas aparezcan progresivamente. Seguí la estructura
de app/dashboard/ que ya existe."

Prompt 3 (Validación):
"Revisá si estoy generando waterfalls de requests innecesarios
(fetches secuenciales que podrían ser paralelos con Promise.all)."
```

### Patrón de prompt recomendado para Next.js

```
Contexto que siempre conviene incluir:
- ¿App Router o Pages Router?
- ¿Dónde vive la lógica de fetching (Server Component, Route Handler,
  Server Action)?
- ¿Hay un Design System / librería de componentes ya definida
  (shadcn/ui, Radix, MUI)?
```

---

## OpenCode + Angular

### Caso práctico completo

**Escenario:** migrar un componente de NgModules a Standalone Components con Signals.

```
Prompt 1 (Análisis):
"Este componente usa NgModule, RxJS BehaviorSubject para estado
local, y change detection default. Quiero migrarlo a standalone
component con Signals. Antes de tocar código: ¿qué riesgos tiene
esta migración si otros componentes lo importan vía el módulo
actual?"

Prompt 2 (Diseño):
"Mostrame cómo quedaría la estructura del componente con Signals
para el estado local, sin implementar todavía — quiero validar
el diseño antes."

Prompt 3 (Implementación):
"Implementá la migración. Mantené el mismo Input/Output API
público para no romper a los componentes que lo consumen.
Reemplazá el NgModule por imports standalone."

Prompt 4 (Testing):
"Actualizá los tests existentes para que usen TestBed con
configuración standalone en lugar de declarations de módulo."
```

### Patrón de prompt recomendado para Angular

```
Contexto que siempre conviene incluir:
- ¿Versión de Angular? (afecta disponibilidad de Signals, control flow nuevo)
- ¿Standalone o NgModules?
- ¿Estrategia de manejo de estado (Signals, NgRx, servicios con RxJS)?
- ¿Change detection: default o OnPush en todo el proyecto?
```

---

## OpenCode + Node.js

### Caso práctico completo

**Escenario:** optimizar un endpoint que hace múltiples queries N+1.

```
Prompt 1 (Diagnóstico):
"Este endpoint hace una query por cada item de un array (problema
N+1 clásico). Con Prisma, ¿cuál es la forma idiomática de resolver
esto: include, una query batch con whereIn, o dataloader?"

Prompt 2 (Implementación):
"Implementá usando 'include' de Prisma para resolver el N+1.
Mostrame el query plan resultante o explicá cómo verificarlo
con el logging de Prisma."

Prompt 3 (Validación de performance):
"Generá un script simple de benchmark que compare el tiempo de
respuesta antes y después del fix, simulando 50 items."
```

### Patrón de prompt recomendado para Node.js

```
Contexto que siempre conviene incluir:
- ¿Framework (Express, Fastify, NestJS)?
- ¿ORM/Query builder (Prisma, TypeORM, Knex, raw SQL)?
- ¿Maneja procesos largos? (afecta si necesitás colas, workers)
- ¿Corre en serverless o servidor persistente? (afecta cold starts,
  conexiones a DB, estado en memoria)
```


---

## OpenCode + IA

### Integración con otros proveedores y protocolos

OpenCode (y agentes similares) no viven aislados — se integran con el ecosistema más amplio de IA aplicada. Entender estas piezas te permite construir flujos que van más allá de "generar código".

#### OpenAI / Anthropic / Gemini

OpenCode permite, en general, elegir el proveedor de modelo subyacente. La elección no es solo de calidad de output — también de costo, latencia y políticas de uso de datos. Para tareas de razonamiento profundo (arquitectura, debugging complejo), priorizá el modelo de mayor capacidad disponible entre los proveedores configurados; para tareas repetitivas, priorizá costo y velocidad.

#### MCP (Model Context Protocol)

MCP es un protocolo abierto que estandariza cómo un agente se conecta a herramientas externas (bases de datos, APIs internas, sistemas de tickets, repositorios). En lugar de programar manualmente cada integración, MCP te permite **exponer tus sistemas como herramientas que el agente puede invocar directamente**.

```
Agente ──MCP──► Servidor MCP de Jira ──► Lee/crea tickets
Agente ──MCP──► Servidor MCP de DB     ──► Ejecuta queries de solo lectura
Agente ──MCP──► Servidor MCP de Slack  ──► Notifica al equipo
```

Caso de uso real: un agente que, al completar un fix de bug, automáticamente actualiza el ticket de Jira asociado y notifica en el canal de Slack del equipo — sin que el desarrollador tenga que cambiar de herramienta.

#### RAG (Retrieval-Augmented Generation)

Para proyectos con documentación extensa (wikis internas, runbooks, decisiones históricas), RAG permite que el agente **busque** la información relevante en lugar de necesitar que esté toda cargada en el contexto de la conversación.

```
Pregunta del developer
        │
        ▼
  Búsqueda semántica en la base de documentación
        │
        ▼
  Se inyectan solo los fragmentos relevantes al contexto
        │
        ▼
  El agente responde con esa información específica
```

#### Agentes especializados

En sistemas maduros (Nivel 7), no usás un solo agente genérico — orquestás **agentes especializados** que colaboran:

```
Agente Orquestador
   ├── Agente de Análisis de Requerimientos
   ├── Agente de Implementación
   ├── Agente de Revisión de Seguridad
   └── Agente de Documentación
```

Cada uno con su propio contexto, restricciones y criterio de éxito — el equivalente a tener un equipo de especialistas en lugar de un generalista haciendo todo.

---

## Automatizaciones Avanzadas

### Code Generators

```
Prompt: "Creá un generador que, dado el nombre de una entidad,
genere automáticamente: el modelo de Prisma, el DTO de validación,
el repository, el service, el controller, y los tests básicos,
siguiendo exactamente la estructura de nuestro módulo 'products'
como template."
```

### Scaffolding

```
Prompt: "Generá el scaffolding completo de un nuevo microservicio
siguiendo nuestra plantilla estándar: estructura de carpetas,
Dockerfile, configuración de CI, healthcheck endpoint, y logging
estructurado ya configurado."
```

### Revisión automática (integrada a CI)

```
Configuración conceptual:
- En cada PR, un workflow invoca al agente para revisar el diff.
- El agente comenta directamente en el PR: bugs potenciales,
  violaciones de convenciones, tests faltantes.
- El review humano se enfoca en decisiones de negocio y diseño,
  no en catch de errores mecánicos.
```

### Generación de documentación continua

```
Prompt: "Cada vez que se modifique un endpoint, actualizá
automáticamente su definición en el archivo OpenAPI y regenerá
la sección correspondiente del README de la API."
```

### Auditorías de código

```
Prompt: "Hacé una auditoría del módulo de autenticación: buscá
secretos hardcodeados, validaciones de input faltantes, uso de
algoritmos de hashing débiles, y endpoints sin rate limiting.
Priorizá los hallazgos por severidad."
```

---

## Productividad Extrema

### Cómo desarrollan los equipos de élite

Los equipos de alto rendimiento no son más productivos porque escriben código más rápido — son más productivos porque **reducen el costo de las decisiones equivocadas** y **paralelizan trabajo que antes era secuencial**. Algunos patrones públicamente conocidos y ampliamente discutidos en la industria:

- **Especificación antes de implementación.** Equipos en empresas como Stripe son conocidos por su disciplina de documentar APIs y contratos antes de escribir el código de implementación — esto se traduce directamente en mejores prompts para agentes: la especificación *es* el prompt.

- **Revisión automatizada como primera línea de defensa.** Equipos de infraestructura en empresas como Vercel y Shopify usan pipelines de CI agresivos donde gran parte del code review mecánico (estilo, convenciones, tests faltantes) ocurre automáticamente, dejando el review humano para decisiones de diseño y negocio.

- **Iteración rápida con feedback loops cortos.** Netflix es conocida por su cultura de experimentación constante con feedback de producción rápido — el equivalente en desarrollo con IA es no esperar a tener "todo perfecto" antes de validar con tests reales y datos reales.

- **Documentación como código de primera clase.** Empresas con culturas de ingeniería fuertes en IA aplicada, como OpenAI y Anthropic, mantienen documentación técnica extensa y actualizada de sus propios sistemas internos — exactamente el tipo de contexto que hace que un agente de código rinda mejor.

> Nota de honestidad intelectual: estas son prácticas y culturas ampliamente reportadas en la industria y en charlas públicas de ingeniería, no afirmaciones verificadas internamente de cada empresa. Tratalas como inspiración de patrones, no como hechos certificados de cada compañía específica.

### Principio unificador

En todos los casos, el patrón de fondo es el mismo: **invertir tiempo en estructura (specs, contratos, automatización de validación) para reducir el costo de cada iteración futura.** Esto es exactamente lo que esta guía te enseñó a hacer con OpenCode: Context Engineering, separación de análisis/implementación, y validación automatizada.


---

## Los 50 Prompts Más Útiles

Clasificados por categoría, listos para adaptar a tu stack.

### Análisis y Especificación (1-8)

1. "Convertí este ticket en criterios de aceptación verificables, e identificá qué información falta."
2. "Resumí en una frase el problema real de negocio que resuelve esta feature, no la solución técnica."
3. "¿Qué casos borde no estoy considerando en este requerimiento?"
4. "Dame 3 preguntas que le harías al Product Manager antes de implementar esto."
5. "¿Esta feature tiene implicancias de seguridad o compliance que deberíamos considerar?"
6. "Estimá la complejidad relativa de estas 3 features (alta/media/baja) y justificá por qué."
7. "¿Qué parte de este requerimiento es ambigua y necesita aclaración antes de diseñar?"
8. "Traducí este requerimiento técnico a una explicación que entendería un Product Manager no técnico."

### Diseño y Arquitectura (9-16)

9. "Dame 3 alternativas de diseño para esto, con sus tradeoffs de complejidad, performance y mantenibilidad."
10. "¿Esta decisión de arquitectura es reversible o nos compromete a largo plazo?"
11. "Diseñá el modelo de datos para este dominio, identificando las invariantes que deben protegerse."
12. "¿Qué patrón de diseño resolvería mejor este problema: Strategy, Factory, o Observer? Justificá."
13. "Mostrame el diagrama de flujo de este proceso antes de implementarlo."
14. "¿Esta solución escala a 10x el volumen actual? ¿Qué se rompería primero?"
15. "Compará la complejidad operativa de mantener esto en-house vs usar un servicio managed."
16. "¿Qué parte de este diseño viola el principio de responsabilidad única?"

### Implementación (17-24)

17. "Implementá esto siguiendo exactamente la convención de [archivo de referencia]."
18. "Generá esta función priorizando legibilidad sobre brevedad."
19. "Implementá manejo de errores explícito, no silencies excepciones."
20. "Evitá introducir dependencias nuevas — resolvé esto con lo que ya está en el proyecto."
21. "Implementá esto de forma incremental: primero la versión más simple que funcione, luego optimizamos."
22. "Asegurate de que esta función sea pura (sin side-effects) donde sea posible."
23. "Implementá con feature flag para poder desactivarlo rápido si algo falla en producción."
24. "Si detectás información faltante para implementar correctamente, preguntame antes de asumir."

### Testing (25-30)

25. "Generá tests priorizando los edge cases, no solo el caso feliz."
26. "Escribí un test que reproduzca este bug de forma determinística."
27. "¿Qué porcentaje de cobertura tiene este módulo y qué ramas críticas faltan testear?"
28. "Generá tests de mutación conceptuales: ¿qué cambios sutiles en el código no detectarían los tests actuales?"
29. "Escribí el test antes de la implementación (TDD) para esta función."
30. "Convertí estos criterios de aceptación en escenarios Gherkin."

### Debugging (31-36)

31. "Generá 3 hipótesis para este bug, con cómo validar o refutar cada una."
32. "¿Qué información adicional necesitás para diagnosticar esto, en lugar de adivinar?"
33. "Analizá estos logs y buscá patrones temporales o de usuario."
34. "¿Este fix resuelve la causa raíz o solo el síntoma?"
35. "¿Qué otros lugares del código podrían tener este mismo problema estructural?"
36. "Explicame el bug como si me lo tuvieras que explicar a alguien sin contexto técnico."

### Refactorización (37-42)

37. "Refactorizá esto aplicando Clean Code: nombres claros, funciones que hacen una sola cosa."
38. "¿Esta clase viola SRP? Si es así, proponé cómo separarla."
39. "Aislá esta lógica de negocio de la dependencia de infraestructura (arquitectura hexagonal)."
40. "Identificá duplicación de lógica en estos 3 archivos y proponé cómo unificarla."
41. "Refactorizá en pasos pequeños y revisables, no en un solo cambio gigante."
42. "¿Este código es testeable? Si no, ¿qué lo está impidiendo?"

### Documentación y Comunicación (43-50)

43. "Generá la descripción de este PR: qué cambia, por qué, y qué riesgos quedan."
44. "Escribí el mensaje de commit siguiendo Conventional Commits, explicando el 'por qué'."
45. "Documentá esta decisión arquitectónica en formato ADR (contexto, decisión, consecuencias)."
46. "Generá el changelog de esta release para una audiencia no técnica."
47. "Revisá este código como si fueras un Staff Engineer exigente pero justo."
48. "Explicame este código legado como si fueras un detective reconstruyendo la intención original."
49. "Generá la documentación de este endpoint en formato OpenAPI."
50. "Resumí esta sesión de trabajo en 5 líneas para el daily standup de mañana."

---

## Errores que Cometen el 95% de los Desarrolladores

Lista detallada, ordenada de mayor a menor frecuencia observada en la práctica:

1. **Tratar cada prompt como una transacción aislada**, sin acumular contexto del proyecto entre sesiones.
2. **Pedir implementación antes de validar el diseño**, especialmente en decisiones de alto impacto y difícil reversión.
3. **No definir el "criterio de terminado"**, dejando que el agente decida cuándo algo está "completo".
4. **Aceptar el primer resultado sin pedir una segunda revisión**, incluso en código crítico (pagos, autenticación, datos sensibles).
5. **No mantener actualizado el archivo de reglas de proyecto**, generando inconsistencia progresiva entre sesiones.
6. **Pedir refactors de archivos completos sin red de seguridad de tests**, arriesgando regresiones silenciosas.
7. **Confundir velocidad de generación con calidad de la solución** — medir productividad en líneas generadas en lugar de problemas resueltos.
8. **No revisar el código generado con el mismo rigor que código escrito por un humano** — un sesgo de "si lo generó la IA, probablemente está bien".
9. **Ignorar advertencias del agente sobre información faltante**, forzando una respuesta cuando lo correcto era aclarar primero.
10. **Usar el modelo más caro para tareas triviales y el más barato para decisiones críticas** — sin criterio de cuándo cada uno aplica.
11. **No versionar las decisiones de configuración del agente**, perdiendo el porqué de configuraciones específicas con el tiempo.
12. **Delegar decisiones de seguridad y compliance sin revisión humana experta**, asumiendo que el agente conoce el contexto regulatorio específico de tu industria.
13. **No paralelizar tareas independientes**, usando el agente de forma estrictamente secuencial cuando varias tareas no tienen dependencia entre sí.
14. **Quedarse en los niveles bajos de uso (1-2) indefinidamente**, sin invertir tiempo en aprender Context Engineering o automatización.
15. **No diferenciar entre "el agente se equivocó" y "yo no especifiqué bien"** — atribuir a la herramienta fallas que son responsabilidad de la comunicación.

---

## Roadmap

### Junior → Semi Senior

```
Foco: dominar Nivel 1-2 (generación + refactor) y aprender a leer
críticamente el código generado, no solo aceptarlo.

Hito: poder identificar cuándo un resultado generado tiene un bug
sutil sin necesitar correrlo primero.
```

### Semi Senior → Senior

```
Foco: dominar Nivel 3-4 (debugging + testing) y empezar a practicar
Context Engineering — mantener un archivo de reglas de proyecto
propio, aunque sea informal.

Hito: poder diagnosticar en qué etapa del pipeline (Context → LLM →
Tool Calls → Validación) ocurrió una falla, sin necesidad de
adivinar.
```

### Senior → Staff

```
Foco: dominar Nivel 5 (arquitectura) — usar al agente como sparring
partner de decisiones de diseño, no solo de implementación.
Formalizar Context Engineering a nivel de equipo, no solo personal.

Hito: poder liderar una decisión de arquitectura compleja con el
agente como acelerador de exploración, manteniendo el criterio
final humano.
```

### Staff → Principal Engineer

```
Foco: dominar Nivel 6-7 (automatización + AI Development System) —
diseñar los flujos y la infraestructura que hacen que TODO el
equipo, no solo vos, trabaje con mayor apalancamiento.

Hito: el agente deja de ser "una herramienta que uso" y se convierte
en una pieza de la infraestructura de ingeniería que diseñaste para
tu organización.
```

```
   Junior ──► Semi Senior ──► Senior ──► Staff ──► Principal
     │             │              │          │           │
   Nivel 1-2    Nivel 2-3      Nivel 3-5  Nivel 5-6   Nivel 6-7
```

---

## Conclusión

### Cómo convertir OpenCode en una ventaja competitiva profesional

Todo lo que viste en esta guía se reduce a un solo principio, repetido bajo distintas formas en cada sección: **la calidad de lo que obtenés de OpenCode es un reflejo directo de la calidad de tu pensamiento, no de tu habilidad para escribir prompts ingeniosos.**

Un buen prompt no es un truco de redacción. Es la externalización de un proceso de pensamiento que un ingeniero senior ya hace mentalmente: analizar antes de diseñar, diseñar antes de implementar, validar antes de confiar, y documentar antes de olvidar por qué se decidió algo.

OpenCode, Claude Code, Codex CLI, Cursor, Windsurf — la herramienta específica es intercambiable. Lo que **no** es intercambiable es la disciplina de ingeniería que traés a la conversación. Esa disciplina es exactamente lo que separa a quien usa estas herramientas como un acelerador de carrera, de quien las usa como una forma elegante de generar deuda técnica más rápido.

La pregunta que vale la pena hacerte después de leer esta guía no es *"¿qué prompt debería usar?"*. Es: **"¿qué tipo de ingeniero quiero ser, ahora que la velocidad de escribir código dejó de ser el límite?"**

La respuesta a esa pregunta es tu verdadera ventaja competitiva — no la herramienta.