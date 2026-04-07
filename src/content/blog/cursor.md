---
title: "Cursor"
code: "Cursor"
description: "Cursor IDE — Master Class Profesional"
pubDate: "Jun 19 2024"
heroImage: "../../assets/blog-placeholder-1.jpg"
---

# Cursor IDE — Master Class Profesional

> **Prerequisito mental:** Cursor no es un autocomplete mejorado. Es un sistema de razonamiento con acceso a tu base de código. Cada interacción debe tratarse como una delegación de ingeniería, no como una búsqueda en Google.

---

## Índice

1. [Indexación y Contexto](#1-indexación-y-contexto)
2. [Uso Maestro de Símbolos @](#2-uso-maestro-de-símbolos-)
3. [Estrategias de Ahorro de Tokens](#3-estrategias-de-ahorro-de-tokens)
4. [Flujo de Trabajo Agentic con Composer](#4-flujo-de-trabajo-agentic-con-composer)
5. [.cursorrules — Configuración de Alto Nivel](#5-cursorrules--configuración-de-alto-nivel)
6. [Tips Insider y Chain of Thought](#6-tips-insider-y-chain-of-thought)

---

## 1. Indexación y Contexto

### Cómo funciona el motor de indexación

Cursor indexa tu codebase generando **embeddings vectoriales** de cada archivo al abrirlo por primera vez. Estos embeddings se almacenan localmente en `~/.cursor/embeddings/` y se actualizan incrementalmente — solo re-indexa los archivos modificados, no el repo completo.

> **Mecanismo interno:** Cuando usas `@Codebase` o el chat sin símbolo, Cursor hace una búsqueda semántica (ANN — Approximate Nearest Neighbor) contra ese índice para recuperar los fragmentos más relevantes antes de enviárselos al LLM. No manda todo tu código — manda los top-K chunks más similares a tu query.

### Estructura de proyecto óptima para la IA

El motor funciona mejor cuando hay **cohesión semántica por carpeta**. Evita mezclar dominios distintos en el mismo directorio.

```
src/
  features/
    auth/          # Todo lo relacionado a autenticación junto
      domain/
      application/
      infrastructure/
  shared/
    ui/            # Componentes reutilizables separados
    utils/
  config/          # Variables de entorno y configuración
docs/
  architecture/    # ADRs (Architecture Decision Records)
  api/             # Contratos OpenAPI / tipos compartidos
```

### Archivos que debes excluir siempre

Indexar `node_modules`, builds o assets pesados consume cuota y degrada la calidad del retrieval. Configura `.cursorignore`:

```gitignore
# .cursorignore — mismo formato que .gitignore
node_modules/
dist/
build/
.next/
coverage/
*.min.js
*.map
*.lock
public/assets/
__generated__/    # GraphQL codegen, protobuf, etc.
```

> **Error crítico frecuente:** No tener un `.cursorignore` hace que el motor indexe archivos generados automáticamente (protobuf, GraphQL codegen, lockfiles). El LLM puede "aprender" patrones incorrectos de esos archivos y propagarlos a tu código.

### Verificar el estado del índice

Abre **Cursor Settings → Features → Codebase Indexing**. Verás el porcentaje indexado y puedes forzar un re-index completo. Recomendación: re-indexar manualmente después de merges grandes o cambios de arquitectura.

### Documentación semántica estratégica

Agrega comentarios JSDoc / docstrings en funciones críticas con **términos de búsqueda que usarías al pedir ayuda**. Si el sistema de pagos usa Stripe, menciona "Stripe", "webhook", "checkout" en los comentarios — eso mejora la recuperación cuando preguntes sobre pagos.

```typescript
/**
 * Procesa webhooks de Stripe para actualizar el estado de suscripción.
 * Maneja: checkout.session.completed, invoice.payment_failed,
 * customer.subscription.deleted
 * @throws {WebhookValidationError} si la firma es inválida
 */
async function handleStripeWebhook(req: Request): Promise<void> {
```

---

## 2. Uso Maestro de Símbolos 

### Tabla de decisión

| Símbolo | Cuándo usarlo | Cuándo evitarlo |
|---|---|---|
| `@Files` | Cuando el problema **está definitivamente en ese archivo** o necesitas transformar su contenido. | No lo uses "por si acaso" — manda el archivo completo al contexto. |
| `@Folders` | Para refactorizaciones de módulo completo o cuando la IA necesita entender un dominio entero. | Carpetas grandes vacían tu ventana de contexto rápidamente. |
| `@Codebase` | Bugs difusos, búsqueda de patrones, preguntas sobre arquitectura global. | No para ediciones simples — es más lento y costoso. |
| `@Web` | Documentación de terceros, errores de librerías, APIs que cambian frecuentemente. | No para código interno — la IA puede confundir versiones. |
| `@Git` | Entender qué cambió, debuggear regresiones, hacer code review de un commit o PR. | No para escribir código nuevo — el contexto de diff puede desviar la respuesta. |
| `@Docs` | Indexar docs de librerías clave (Next.js, Prisma, etc.) una vez y reutilizarlas. | Docs desactualizadas — verifica la versión antes de indexar. |

### @Codebase — Uso estratégico para bugs arquitectónicos

Este es el símbolo más poderoso y el más mal utilizado. Activa una búsqueda semántica profunda antes de enviar el prompt. La clave es redactar el prompt como una **query de búsqueda + instrucción**:

```
# Prompt débil (el LLM adivina dónde buscar):
"@Codebase por qué falla el login?"

# Prompt fuerte (guía el retrieval semántico):
"@Codebase Busca todos los lugares donde se maneja la sesión de usuario
(cookies, JWT, middleware de auth). El login retorna 200 pero la sesión
no persiste entre requests. Necesito el flujo completo desde el login
hasta la validación del token en requests subsecuentes."
```

> **Táctica avanzada:** Antes de usar `@Codebase` en un bug complejo, pregunta primero: *"¿qué archivos son responsables de X?"*. Con esa lista, usa `@Files` específicos en el siguiente prompt — reduces el costo a la mitad con la misma precisión.

### Combinando símbolos para máxima precisión

```
# Patrón: Contexto general + archivo específico + web
"@Codebase @Files src/services/payment.ts @Web
La función createCheckoutSession está fallando silenciosamente.
El error en Stripe Dashboard es 'idempotency_key already used'.
¿Cómo refactorizar el retry logic sin romper la idempotencia?"
```

### @Git para code review asistido

```
# Revisar los últimos cambios antes de hacer push
"@Git Diff HEAD~1..HEAD
Actúa como senior reviewer. Identifica: (1) posibles race conditions,
(2) casos edge no manejados, (3) violaciones del patrón de error handling
que usamos en el resto del codebase."
```

---

## 3. Estrategias de Ahorro de Tokens

### Comparativa de modos

| Modo | Atajo | Costo relativo | Cuándo usarlo |
|---|---|---|---|
| **Inline Edit** | `Cmd+K` | Mínimo | Cambios de 1–20 líneas. Renombrar, refactorizar una función, ajustar tipos. |
| **Chat** | `Cmd+L` | Medio | Preguntas, exploración, debugging conversacional. No aplica cambios automáticamente. |
| **Composer** | `Cmd+I` | Alto | Refactorizaciones multi-archivo, features nuevas, tareas que requieren editar 3+ archivos. |

> **Error más costoso:** Usar Composer para cambios de una sola línea. Composer abre una sesión multi-turn con contexto expandido — estás pagando por una excavadora para clavar un tornillo.

### Regla del 80/20 de tokens

El 80% de las interacciones deberían ser `Cmd+K` (inline). Reserva `Cmd+I` (Composer) para las tareas que realmente requieren coordinación entre archivos. Si puedes hacer el cambio en un archivo, siempre usa inline.

### Técnicas de reducción de contexto

**Selección quirúrgica:** Selecciona solo el fragmento relevante antes de `Cmd+K`, no todo el archivo. Cursor manda solo lo seleccionado + contexto mínimo.

**Conversaciones cortas:** Cada mensaje en una conversación larga re-manda el historial completo. Si el tema cambió, abre un nuevo chat.

**Modelo correcto:** Usa `cursor-small` para autocompletado y refactors triviales. Reserva Claude/GPT-4 para arquitectura y bugs complejos.

**Prompt comprimido:** En lugar de describir el contexto en texto largo, usa símbolos `@` para que Cursor lo resuelva automáticamente sin que lo escribas.

### El anti-patrón "Ping-Pong"

```
# Anti-patrón (burns tokens exponencialmente):
Tú:  "crea un componente de tabla"
IA:  [genera algo genérico]
Tú:  "agrégale paginación"
IA:  [agrega paginación]
Tú:  "ahora que soporte sorting"
IA:  [agrega sorting, posiblemente rompiendo algo]

# Patrón correcto — spec completa desde el inicio:
"Crea un componente TableWithControls en React + TypeScript que:
- Acepte columnas tipadas con Column<T>[]
- Soporte paginación server-side (page, pageSize props)
- Sorting por columna con estado local
- Loading skeleton mientras fetches
- Siga el patrón de nuestros otros componentes en @Files src/components/DataGrid.tsx"
```

---

## 4. Flujo de Trabajo Agentic con Composer

### Qué es el modo Agentic

Cuando activas **Composer en modo Agent**, Cursor puede: leer archivos arbitrarios, ejecutar comandos en terminal, crear archivos nuevos, y encadenar múltiples acciones sin que tú intervengas entre cada paso. Es un loop de razonamiento-acción autónomo.

> **Mentalidad correcta:** Trátalo como delegar a un junior engineer muy competente. Dale specs claras, checkpoints intermedios y verifica el resultado antes de hacer commit. Nunca le digas "refactoriza todo" sin contexto.

### Plantilla de prompt para Composer

```
## Objetivo
[Qué debe lograr al terminar — resultado medible]

## Archivos involucrados
@Files [lista los archivos que debe tocar o leer]

## Restricciones
- NO modificar [archivos o patrones que deben quedar intactos]
- Mantener la API pública de [función/clase X] sin cambios
- Usar el mismo patrón de error handling que en [referencia]

## Criterio de éxito
- [Tests que deben pasar]
- [Comportamiento observable esperado]

## Contexto adicional
[Solo lo que no puede inferir del codebase]
```

### Protocolo de review de diffs

Composer muestra los cambios propuestos antes de aplicarlos. El flujo recomendado:

1. Lee primero los **archivos nuevos creados** — ahí están los cambios de mayor impacto.
2. En archivos existentes, enfócate en los **deletes** (líneas rojas) — un delete inesperado suele revelar errores de comprensión.
3. Verifica que la IA no haya "simplificado" validaciones o manejo de errores al refactorizar.
4. Usa `@Git Diff` después de aplicar para hacer el review final en contexto de todo el cambio.

### Checkpoints intermedios para tareas largas

```
# En lugar de una tarea monolítica:
"Migra toda la autenticación de JWT a sessions"

# Divide en checkpoints:
"Paso 1 de 3: Crea la nueva SessionService en src/services/session.ts
con los métodos create(), validate(), destroy(). No modifiques ningún
archivo existente aún. Solo créalo y muéstramelo para revisión."

# Después de revisar y aprobar:
"Paso 2 de 3: Actualiza solo el AuthController para usar SessionService.
Mantén el comportamiento externo idéntico."
```

### Validación automática con tests

Agrega en tu prompt de Composer: *"Después de cada archivo modificado, ejecuta `npm test -- --testPathPattern=[archivo]` y detente si hay errores."* Cursor puede ejecutar los tests en terminal y auto-corregirse antes de mostrarte el resultado.

---

## 5. .cursorrules — Configuración de Alto Nivel

### Qué es y cómo funciona

`.cursorrules` es un archivo de texto en la raíz de tu proyecto que se inyecta automáticamente en el system prompt de **cada conversación** que tenga Cursor. Es tu contrato con la IA: le defines quién eres, qué stack usas, y cómo quieres que trabaje.

> **Importante:** A partir de Cursor 0.43+, el mecanismo oficial es `.cursor/rules/` (directorio con múltiples archivos). El formato antiguo `.cursorrules` sigue funcionando pero el nuevo permite reglas por contexto (aplicar distintas reglas en frontend vs backend).

### Plantilla de producción — Next.js + TypeScript

```markdown
# .cursorrules

## Stack Tecnológico
- Runtime: Node.js 20 / Next.js 14 App Router
- Lenguaje: TypeScript 5.3 (modo strict)
- Base de datos: PostgreSQL + Prisma ORM
- Auth: NextAuth.js v5
- UI: Tailwind CSS + shadcn/ui
- Testing: Vitest + Testing Library
- Deployment: Vercel

## Patrones de Arquitectura
- Arquitectura: Feature-based (src/features/{dominio})
- Patrón de datos: Repository Pattern — toda query a DB pasa por src/repositories/
- Server Actions para mutaciones (NO api routes para formularios internos)
- Zod para validación en el límite de entrada (API routes, Server Actions)

## Convenciones de Código
- Siempre usar tipos explícitos. NUNCA usar `any`. Prefiere `unknown` + narrowing.
- Exports nombrados siempre, excepto page.tsx y layout.tsx (default por Next.js)
- Error handling: usa Result<T, E> de neverthrow para funciones de dominio
- Nombres de funciones: verbos (createUser, fetchOrders), nombres de componentes: sustantivos (UserCard, OrderList)
- Comentarios en inglés, commits en inglés

## Lo que NUNCA debes hacer
- No uses `as any` para castear — explica el tipo correcto o usa type guard
- No hagas fetch directo desde componentes cliente — usa Server Components o React Query
- No uses useEffect para fetching de datos
- No importes desde src/features/X dentro de src/features/Y — usa src/shared/ para compartir
- No generes migraciones de Prisma — solo el schema. Las migraciones las corro yo.

## Estilo de Respuesta
- Sé directo y técnico. No expliques conceptos básicos.
- Cuando hay múltiples enfoques válidos, menciona el trade-off en 1 línea y elige el más adecuado para este stack.
- Si el cambio afecta tipos en múltiples archivos, muéstralos todos.
- Incluye siempre el import statement completo en los ejemplos.
```

### Reglas por contexto con el nuevo sistema

```markdown
# .cursor/rules/frontend.mdc
---
globs: ["src/app/**", "src/components/**"]
---
- Usa siempre `use client` directive cuando el componente use hooks
- Prefiere Server Components por defecto
- Tailwind classes ordenadas con prettier-plugin-tailwindcss
```

```markdown
# .cursor/rules/api.mdc
---
globs: ["src/app/api/**"]
---
- Valida siempre con Zod antes de procesar
- Retorna errores con el formato: { error: string, code: string }
- Rate limiting en todos los endpoints públicos
```

---

## 6. Tips Insider y Chain of Thought

### Atajos poco conocidos

| Atajo | Función |
|---|---|
| `Cmd+Shift+L` | Agrega el archivo actual al chat sin perder el contexto de la conversación |
| `Cmd+.` | En Composer: acepta la sugerencia actual y sigue editando el prompt |
| `Ctrl+Enter` | En Chat: envía el mensaje preservando saltos de línea |
| `Cmd+K → Cmd+K` | Abre inline edit con el contexto del error más reciente en el terminal |
| `Opt+Click` | En diff view: acepta solo ese bloque de cambio (no todo el archivo) |
| `Cmd+Shift+E` | Alterna entre el error actual en el editor y el chat |
| `@Codebase ↑` | En el input de chat: historial de prompts anteriores — reutiliza y modifica |

### La mentalidad Chain of Thought

Los ingenieros de Cursor usan internamente un patrón de tres pasos al redactar cualquier prompt complejo:

**1. CONTEXTO** — ¿Qué existe ahora? (referencias con @)  
**2. PROBLEMA** — ¿Qué está mal o qué falta? (síntomas observables, no suposiciones)  
**3. RESTRICCIONES** — ¿Qué no puede cambiar? (contratos, compatibilidad, convenciones)

```
## CONTEXTO
@Files src/hooks/useAuth.ts @Files src/middleware.ts
El sistema de auth usa NextAuth con JWT strategy.

## PROBLEMA
Los usuarios con rol "viewer" acceden a rutas protegidas con rol "admin"
después de que su token expira y se refresca. El bug es intermitente —
ocurre en el primer request post-refresh.

## RESTRICCIONES
- No cambiar la estructura del JWT payload (otros sistemas lo consumen)
- El fix debe funcionar en Edge Runtime (middleware no puede usar Node.js APIs)
- No introducir una llamada a DB en el middleware
```

### Tips de productividad extrema

**Notepads como memoria de sesión:** Cursor tiene "Notepads" (`Cmd+Shift+N`) — úsalos para guardar el contexto de una feature en desarrollo y referenciarlos con `@Notepad`. Es tu memoria persistente entre sesiones.

**Fix de errores en un teclazo:** Cuando TypeScript o ESLint muestran un error en el editor, haz clic en él y presiona `Cmd+K`. Cursor inyecta automáticamente el mensaje de error como contexto — no necesitas copiarlo.

**Reutiliza prompts de calidad:** Los mejores prompts que escribas, guárdalos en un archivo `docs/prompts.md` en tu repo. Con el tiempo construyes una librería de prompts calibrados para tu stack específico.

**Modo de debugging sistemático:** Cuando no encuentras un bug, usa este prompt:

```
"@Codebase Actúa como un debugger sistemático. Empieza desde [punto de entrada]
y traza el flujo de ejecución para el caso [X]. En cada paso, indica qué estado
entra y qué sale. Detente cuando encuentres una discrepancia."
```

---

> **Mentalidad final:** Tu trabajo no es escribir código — es especificar con precisión quirúrgica. Mientras mejor articulas el problema, mejor código produce la IA. La inversión en un prompt de 30 segundos más elaborado ahorra 15 minutos de correcciones.