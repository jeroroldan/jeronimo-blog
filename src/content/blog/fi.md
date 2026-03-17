---
title: "Figma — Panel Lateral"
description: "Manual de Experto: Layers, Assets & Pages"
pubDate: 2026-03-17
code: "figma"
image: "/images/blog/fi.jpg"
---

# ◆ FIGMA — Panel Lateral

### Manual de Experto: Layers, Assets & Pages

> **Nivel:** Intermedio → Avanzado  
> **Objetivo:** Dominar el panel lateral de Figma y aplicar estrategias profesionales para maximizar tu velocidad y calidad de trabajo.

---

## 📋 Índice

1. [Anatomía del Panel Lateral](#1-anatomía-del-panel-lateral)
2. [Panel de Layers — Dominio Total](#2-panel-de-layers--dominio-total)
3. [Panel de Assets — Tu Paleta de Velocidad](#3-panel-de-assets--tu-paleta-de-velocidad)
4. [Barra de Pages — Arquitectura del Archivo](#4-barra-de-pages--arquitectura-del-archivo)
5. [Atajos de Teclado Maestros](#5-atajos-de-teclado-maestros)
6. [Estrategias Profesionales](#6-estrategias-profesionales)
7. [Colaboración en Equipo](#7-colaboración-en-equipo)
8. [Checklist Pre-Handoff](#8-checklist-pre-handoff)
9. [Las 10 Reglas de Oro](#9-las-10-reglas-de-oro)

---

## 1. Anatomía del Panel Lateral

El panel lateral izquierdo de Figma tiene tres zonas principales:

```
┌─────────────────────────────────────┐
│  📄 Page 1  📄 Page 2  + (nueva)    │  ← BARRA DE PAGES
├──────────────┬──────────────────────┤
│  Layers      │  Assets              │  ← TABS
├──────────────┴──────────────────────┤
│                                     │
│  🔍 Buscar capas...                 │
│                                     │
│  ▼ 📱 Screen - Home                 │
│    ▼ 🗂️ hero-section               │
│        T  hero-heading              │
│        T  hero-subheading           │
│        ⚡ btn-primary               │
│    ▼ 🗂️ nav-bar                    │
│        ⚡ nav-logo                  │
│        ⚡ nav-links                 │
│                                     │
└─────────────────────────────────────┘
```

| Sección          | Función                                                             |
| ---------------- | ------------------------------------------------------------------- |
| **Pages**        | Pestañas del archivo. Cada una tiene su propio canvas independiente |
| **Layers tab**   | Jerarquía visual de todos los elementos del canvas activo           |
| **Assets tab**   | Componentes, estilos y variables locales y de libraries             |
| **Buscador**     | Filtro en tiempo real por nombre o tipo de capa                     |
| **Context menu** | Click derecho → acciones específicas según el tipo de capa          |

---

## 2. Panel de Layers — Dominio Total

### 2.1 Tipos de capas y sus íconos

```
📐  Frame          → Contenedor principal. Base de pantallas y componentes
📁  Group          → Agrupación simple. Evitalo en favor de Frames
⚡  Component      → Componente principal (Main Component)
◆   Instance       → Copia de un componente. Sincronizada con el main
T   Text           → Capa de texto
▭   Shape          → Rectángulo, elipse, polígono, vector
🖼️  Image          → Imagen importada o de fill
§   Section        → Contenedor organizacional del canvas (no afecta diseño)
```

> 💡 **Pro Tip:** Los Components se identifican con el ícono de rayo ⚡ en el panel. Las Instances tienen un rombo ◆. Si ves un rombo con línea discontinua, es una instancia con overrides aplicados.

---

### 2.2 Nomenclatura profesional de capas

El error más costoso en Figma es dejar los nombres por defecto (`Rectangle 47`, `Frame 12`). Un panel limpio es un diseño limpio.

**Convención recomendada — kebab-case:**

```
[categoria]-[nombre]-[modificador]

✅ Correcto:
  hero-section
  hero-heading
  hero-cta-primary
  nav-desktop
  card-product
  modal-overlay
  btn-submit-disabled

❌ Incorrecto:
  Frame 47
  Rectangle 12
  Group 89
  Text
```

**¿Por qué kebab-case?**

- Es el estándar de CSS y la mayoría de los frameworks
- Cuando el developer inspecciona el diseño, puede copiar el nombre como clase
- Es más legible en el panel porque no tiene mayúsculas que se confunden con otras capas

> ⚠️ **Atención:** Nunca entregues un archivo con capas sin nombre descriptivo. Los developers ven los nombres de capas en el Inspect Mode. Si están mal nombradas, perdés tiempo en explicaciones que el diseño debería comunicar solo.

---

### 2.3 Acciones esenciales en el panel de Layers

#### Selección avanzada

| Acción                            | Resultado                                  |
| --------------------------------- | ------------------------------------------ |
| Click en el panel                 | Selecciona la capa en el canvas            |
| `Shift + Click` en el panel       | Selección múltiple                         |
| `Click + Drag` sobre varias capas | Selecciona rango                           |
| `Ctrl/Cmd + Click` en el canvas   | Selecciona la capa exacta ignorando grupos |
| `Doble click` en el canvas        | Entra al grupo/frame y selecciona el hijo  |
| `Esc`                             | Sube un nivel en la jerarquía              |

#### Visibilidad y bloqueo

```
Hover sobre capa → aparece ícono 👁️  → click para toggle visibilidad
Hover sobre capa → aparece ícono 🔒  → click para bloquear/desbloquear
```

**Casos de uso para bloquear capas:**

- Fondos e imágenes decorativas que no deben moverse
- Grillas y guías de referencia
- Mockups de dispositivo (iPhone frame, browser chrome)
- Elementos aprobados que no se deben modificar

> 💡 **Pro Tip:** Usá la visibilidad para comparar versiones de un diseño en el mismo frame. Apilá variantes y toggleá el ojo para hacer comparativas sin páginas separadas.

#### Colapsar y expandir

```
Click en ►       → expande/colapsa un frame/group
Alt + Click ►    → expande/colapsa TODOS los hijos recursivamente
Ctrl/Cmd+Alt+L   → colapsa TODAS las capas del panel de una sola vez
```

> ✅ **Best Practice:** Siempre empezá con todo colapsado (`Ctrl/Cmd + Alt + L`) y expandí solo lo que necesitás. En proyectos grandes, un panel completamente expandido es ilegible.

---

### 2.4 Búsqueda en el panel de Layers

`Ctrl/Cmd + F` dentro del panel activa el buscador. Podés filtrar por:

- **Nombre:** búsqueda parcial funciona (`"hero"` encuentra `"hero-heading"`, `"hero-section"`, etc.)
- **Tipo:** desplegable para filtrar por Frame, Text, Component, Instance, etc.
- **Estado:** capas ocultas, bloqueadas, o con errores de componentes

> 💡 **Pro Tip:** Buscá por nombre + seleccioná todo (`Ctrl/Cmd + A` en los resultados) para editar propiedades de múltiples capas del mismo tipo de una sola vez. Por ejemplo: encontrá todos los textos que se llaman `"body-text"` y cambiá su estilo tipográfico en batch.

---

### 2.5 Organización con Sections

Las Sections (`Ctrl/Cmd + Shift + S`) son contenedores especiales que organizan el canvas sin afectar el diseño. Aparecen en el panel de Layers y son colapsables.

```
§ Onboarding Flow
  📱 Screen - Splash
  📱 Screen - Welcome
  📱 Screen - Register

§ Main App Flow
  📱 Screen - Home
  📱 Screen - Search
  📱 Screen - Detail

§ Settings Flow
  📱 Screen - Settings
  📱 Screen - Profile
```

**Ventajas de las Sections sobre páginas separadas:**

- Podés ver múltiples flujos en el mismo canvas y comparar contexto
- Las conexiones del prototipo no se rompen al reorganizar
- Podés marcarlas como `"Ready for dev"` para el handoff
- Son navegables en el panel de Layers

---

### 2.6 Orden de apilamiento desde el panel

El orden en el panel = orden visual en el canvas. Lo que está más arriba en el panel está visualmente encima.

```
Ctrl/Cmd + ]        → Traer capa hacia adelante (un nivel)
Ctrl/Cmd + [        → Enviar capa hacia atrás (un nivel)
Ctrl/Cmd + Shift+]  → Traer al frente (top del stack)
Ctrl/Cmd + Shift+[  → Enviar al fondo (bottom del stack)
```

---

## 3. Panel de Assets — Tu Paleta de Velocidad

### 3.1 Estructura del panel

```
Assets
├── 🔍 Buscar assets...
├── Components
│   ├── Local components
│   │   ├── Forms/
│   │   │   ├── Button/
│   │   │   │   ├── Primary
│   │   │   │   └── Secondary
│   │   │   └── Input/
│   │   │       ├── Default
│   │   │       └── Error
│   │   └── Navigation/
│   └── Libraries
│       └── [Nombre de la Library]
├── Styles
│   ├── Colors
│   ├── Text
│   ├── Effects
│   └── Grids
└── Variables
    ├── Primitives
    ├── Semantic
    └── Component
```

> ℹ️ **Dato clave:** A partir de 2024 Figma unificó Styles y Variables en el panel de Assets. Las Variables reemplazan gradualmente a los Styles para flujos de trabajo con Design Tokens y theming dinámico.

---

### 3.2 Vistas de componentes

El panel de Assets ofrece dos modos:

| Vista                               | Cuándo usarla                                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Grid view** (ícono de cuadrícula) | Cuando necesitás identificar componentes visualmente. Útil en Design Systems nuevos o con muchos íconos |
| **List view** (ícono de lista)      | Cuando ya conocés tus componentes y priorizás velocidad. Muestra más items en el mismo espacio          |

---

### 3.3 Insertar componentes

```
Drag & Drop desde Assets al canvas    → el método estándar
Doble click en el componente          → inserta en el centro del viewport
Ctrl/Cmd + Shift + K                  → Quick Insert con búsqueda (sin mouse)
```

> 💡 **Pro Tip:** Dominá el `Ctrl/Cmd + Shift + K` (Quick Insert). Podés insertar cualquier componente escribiendo su nombre sin tocar el mouse ni abrir el panel de Assets. En proyectos con Design Systems maduros, esta combinación es el eje de la velocidad de trabajo.

---

### 3.4 Nomenclatura de componentes con jerarquía automática

Usá `/` en el nombre del componente para crear grupos automáticos en el panel:

```
Forms/Button/Primary      → aparece en: Forms > Button > Primary
Forms/Button/Secondary    → aparece en: Forms > Button > Secondary
Forms/Input/Default       → aparece en: Forms > Input > Default
Navigation/Navbar/Desktop → aparece en: Navigation > Navbar > Desktop
Feedback/Toast/Success    → aparece en: Feedback > Toast > Success
```

**Sistema de nomenclatura completo:**

```
[Categoría]/[Nombre]/[Variante]

Categorías recomendadas:
├── Forms/        → inputs, buttons, checkboxes, radios, selects
├── Navigation/   → navbar, sidebar, breadcrumbs, tabs, pagination
├── Feedback/     → toasts, alerts, modals, tooltips, badges
├── Data Display/ → cards, tables, lists, avatars, chips
├── Layout/       → containers, dividers, spacers, grids
└── Icons/        → todos los íconos del sistema
```

> ⚠️ **Atención:** No mezcles la convención. Si empezás con `Forms/Button`, no uses `button-forms` o `ButtonForms` en otro componente. La inconsistencia rompe la jerarquía en el panel y confunde al equipo.

---

### 3.5 Styles — Tipos y uso

| Tipo              | Cómo aplicarlo                                       | Acceso en el panel        |
| ----------------- | ---------------------------------------------------- | ------------------------- |
| **Color Styles**  | Desde el fill picker de cualquier elemento           | Assets > Styles > Colors  |
| **Text Styles**   | Desde el panel de texto al seleccionar un text layer | Assets > Styles > Text    |
| **Effect Styles** | Desde el panel de Effects (sombras, blur)            | Assets > Styles > Effects |
| **Grid Styles**   | Desde el Layout Grid de cualquier Frame              | Assets > Styles > Grids   |

**Organización de Color Styles:**

```
Brand/
  Primary-500
  Primary-400 (hover)
  Primary-600 (pressed)
  Secondary-500

Neutral/
  White
  Gray-50 ... Gray-900
  Black

Semantic/
  Success-500
  Warning-500
  Error-500
  Info-500

Background/
  Default
  Subtle
  Muted
```

---

### 3.6 Libraries — Gestión desde el panel

#### Habilitar una library

1. Abrí el panel de Assets
2. Click en el ícono de libro 📚 (parte superior)
3. En "Libraries" → activá las necesarias con el toggle

> 💡 **Pro Tip:** Mantené habilitadas **solo las libraries que el proyecto usa activamente**. Demasiadas libraries activas ralentizan el panel y hacen más difícil encontrar el componente correcto.

#### Publicar tu library

1. Panel de Assets → ícono de libro 📚 → "Publish styles and components"
2. Seleccioná qué publicar
3. Escribí un mensaje de cambio (como un commit de git)
4. Click en "Publish"

#### Actualizar cuando la library cambia

Cuando una library se actualiza, aparece un banner azul en el panel de Assets:

```
"Library updates available" → "Review" → revisá los cambios → "Accept"
```

> ✅ **Best Practice:** Publicá solo componentes y estilos **finalizados y aprobados**. Usá branches para el trabajo en progreso. Publicar WIP en la library principal crea confusión en todo el equipo.

---

## 4. Barra de Pages — Arquitectura del Archivo

### 4.1 Estructura de páginas recomendada

Una arquitectura de páginas profesional y consistente hace el archivo navegable para cualquier miembro del equipo:

| Página                  | Contenido                                                               |
| ----------------------- | ----------------------------------------------------------------------- |
| `📋 00 — Cover`         | Portada: nombre del proyecto, estado, última actualización, responsable |
| `🗺️ 01 — Research & IA` | User flows, sitemaps, arquitectura de información                       |
| `📐 02 — Wireframes`    | Lo-fi y mid-fi. Sin estilos, foco en estructura y flujos                |
| `🧩 03 — Design System` | Componentes, estilos, variables. La fuente de verdad                    |
| `🎨 04 — UI Screens`    | Pantallas finales en alta fidelidad                                     |
| `📱 05 — Prototype`     | Pantallas conectadas para el prototipo interactivo                      |
| `🗃️ 06 — Archive`       | Versiones anteriores y exploraciones descartadas                        |

> ℹ️ **Dato clave:** Usá emojis al inicio del nombre de cada página. Son escaneables visualmente, funcionan en todos los sistemas operativos y comunican el propósito de cada página de un vistazo.

---

### 4.2 Operaciones en la barra de Pages

```
Click en "+"                     → crear nueva página
Doble click en el nombre         → renombrar página
Click derecho en página          → menú: duplicar, mover, borrar
Drag de una página               → reordenar en la barra
Page Up / Page Down              → navegar entre páginas con teclado
```

---

### 4.3 Mover elementos entre páginas

**Método 1 — Context menu:**

1. Seleccioná el elemento
2. Click derecho → `"Move to page"` → elegí la página destino

**Método 2 — Portapapeles con posición:**

1. Seleccioná y copiá (`Ctrl/Cmd + C`)
2. Navegá a la página destino
3. `Ctrl/Cmd + Shift + V` → pega en las coordenadas exactas originales

> ⚠️ **Atención:** Al mover frames entre páginas las conexiones del prototipo que apuntan a esos frames pueden romperse. Revisá siempre el modo Prototype después de mover elementos importantes.

---

### 4.4 Gestión del estado del proyecto con páginas

Podés usar la barra de pages para comunicar el estado de avance a todo el equipo:

```
🔴 WIP — Pantallas en las que estás trabajando activamente
🟡 Review — Listas para revisión interna o con el cliente
🟢 Approved — Aprobadas, listas para handoff
⚫ Archive — Iteraciones descartadas guardadas como referencia
```

> 💡 **Pro Tip:** Cuando movés una pantalla de "WIP" a "Approved" es una señal visual para el equipo de que ese trabajo está terminado. Elimina la clásica pregunta "¿esta es la versión final?" que paraliza los proyectos.

---

## 5. Atajos de Teclado Maestros

### Panel de Layers

| Atajo                                 | Acción                            |
| ------------------------------------- | --------------------------------- |
| `Ctrl/Cmd + Alt + L`                  | Colapsar todas las capas          |
| `F2` (con capa seleccionada en panel) | Renombrar capa                    |
| `Ctrl/Cmd + F` (foco en panel)        | Activar buscador de capas         |
| `Ctrl/Cmd + G`                        | Agrupar selección                 |
| `Ctrl/Cmd + Shift + G`                | Desagrupar                        |
| `Ctrl/Cmd + Alt + G`                  | Envolver selección en Frame       |
| `Ctrl/Cmd + Shift + H`                | Mostrar / ocultar capa            |
| `Ctrl/Cmd + Shift + L`                | Bloquear / desbloquear capa       |
| `Alt + Click ►`                       | Expandir/colapsar todos los hijos |
| `Ctrl/Cmd + ]`                        | Traer hacia adelante              |
| `Ctrl/Cmd + [`                        | Enviar hacia atrás                |
| `Ctrl/Cmd + Shift + ]`                | Traer al frente                   |
| `Ctrl/Cmd + Shift + [`                | Enviar al fondo                   |

### Panel de Assets

| Atajo                  | Acción                           |
| ---------------------- | -------------------------------- |
| `Ctrl/Cmd + Alt + O`   | Abrir / cerrar panel de Assets   |
| `Ctrl/Cmd + Shift + K` | Quick Insert de componentes      |
| `Ctrl/Cmd + Alt + K`   | Crear componente desde selección |
| `Ctrl/Cmd + Alt + B`   | Detach instance del componente   |

### Barra de Pages

| Atajo       | Acción                   |
| ----------- | ------------------------ |
| `Page Up`   | Ir a la página anterior  |
| `Page Down` | Ir a la página siguiente |

---

## 6. Estrategias Profesionales

### Estrategia 1 — Nombrá en tiempo real, no al final

Los diseñadores novatos nombran las capas "cuando tienen tiempo". Los expertos nombran cada capa en el momento en que la crean.

**Flujo correcto:**

```
Creás un Frame     → F2 → "hero-section"
Añadís un texto    → F2 → "hero-heading"
Insertás botón     → F2 → verifica que el nombre del componente sea correcto
```

Adoptá el hábito de presionar `F2` inmediatamente después de crear cualquier elemento. En dos semanas se vuelve automático.

---

### Estrategia 2 — Las layers como documentación de código

Un panel de layers bien nombrado es documentación en sí misma. Los desarrolladores ven los nombres de capas en el Dev Mode. Si están bien nombrados, entienden la estructura sin que vos expliques nada.

```
Lo ideal:
  Nombre de capa en Figma  ≈  Nombre de clase CSS  ≈  Nombre del componente en código

Ejemplo:
  Figma:    "product-card"
  CSS:      .product-card { }
  React:    <ProductCard />
```

> 💡 **Pro Tip:** Al inicio de cada proyecto, hacé una reunión de 30 minutos con el equipo de development para acordar la convención de nombres. El tiempo invertido se multiplica en eficiencia durante todo el proyecto.

---

### Estrategia 3 — Assets como paleta de velocidad (armado Lego)

Los diseñadores expertos construyen pantallas como si fueran Lego: insertan desde Assets, usan Auto Layout y ajustan propiedades. El canvas es el resultado, no el proceso.

Para lograrlo necesitás:

1. Un Design System sólido con todos los estados diseñados
2. Componentes nombrados con jerarquía (`Categoría/Nombre/Variante`)
3. Dominar el Quick Insert (`Ctrl/Cmd + Shift + K`)
4. Conocer de memoria los nombres de tus componentes más usados

> ℹ️ **Dato clave:** Un diseñador que domina el Quick Insert puede insertar un componente complejo en menos de 3 segundos sin abrir el panel de Assets ni tocar el mouse.

---

### Estrategia 4 — Sections en lugar de páginas para flujos relacionados

En lugar de crear una página nueva para cada flujo, usá Sections dentro de la misma página para flujos que comparten contexto:

```
Página: 04 — UI Screens

§ Onboarding Flow
  📱 Splash · 📱 Welcome · 📱 Register · 📱 Confirm

§ Home & Discovery
  📱 Home · 📱 Search · 📱 Search Results · 📱 Filters

§ Product & Purchase
  📱 Product Detail · 📱 Cart · 📱 Checkout · 📱 Confirmation
```

**Ventajas:**

- Podés comparar pantallas de distintos flujos en el mismo canvas
- Las conexiones del prototipo no se rompen al reorganizar
- El overview del producto completo es más fácil de presentar al cliente

---

### Estrategia 5 — El panel de Layers como mapa de navegación

En pantallas complejas usá el panel de Layers para navegar, no el canvas. Es mucho más rápido:

```
1. Ctrl/Cmd + Alt + L  → colapsá todo
2. Expandí solo el frame que necesitás
3. Click en la capa desde el panel → el canvas va a esa capa automáticamente
4. Usá Alt + Click ► para expandir toda la rama si necesitás ver la estructura completa
```

---

### Los 5 errores más comunes (y cómo evitarlos)

**Error 1 — Elementos fuera de Frames**

> ⚠️ Crear elementos directamente en el canvas sin un Frame padre. Todo debe estar dentro de un Frame. Los elementos huérfanos rompen prototipos y desordenan el panel de Layers.

**Error 2 — Componentes mezclados con pantallas**

> ⚠️ Tus componentes deben vivir en una página dedicada de Design System. Mezclarlos con las pantallas hace el archivo imposible de mantener a largo plazo.

**Error 3 — Usar Groups en lugar de Frames**

> ⚠️ Los Groups no soportan Auto Layout, no tienen Constraints propios y no pueden ser destino de prototipo. Convertí todos tus grupos con `Ctrl/Cmd + Alt + G`.

**Error 4 — No colapsar el panel de Layers**

> ⚠️ Un panel completamente expandido en proyectos grandes es ilegible. Usá `Ctrl/Cmd + Alt + L` para colapsar todo y navegar por la estructura de alto nivel primero.

**Error 5 — Libraries habilitadas que no se usan**

> ⚠️ Tener demasiadas Libraries activas ralentiza el panel de Assets y hace más difícil encontrar el componente correcto. Habilitá solo lo que el proyecto necesita.

---

## 7. Colaboración en Equipo

### Observation Mode

```
Click en el avatar de un colaborador (barra superior)
→ tu vista sigue el cursor de esa persona en tiempo real
```

Ideal para code reviews de diseño, pair designing y presentaciones en vivo.

---

### Comentarios vinculados a capas

Los comentarios (tecla `C`) aparecen en el canvas pero también podés verlos desde el panel de Layers haciendo hover sobre cada capa. Esto te permite:

- Ver qué capas tienen feedback pendiente sin navegar por el canvas
- Resolver comentarios directamente desde el panel contextual
- Hacer QA sistemático filtrando capas con comentarios sin resolver

---

### Branching y el panel lateral

En planes Organization/Enterprise podés crear branches del archivo. El panel lateral funciona igual en una branch, con la diferencia de que los cambios no afectan el main hasta hacer el merge.

**Convención para branches:**

```
En las páginas modificadas → agregá "✏️ WIP:" al nombre
Ejemplo: "✏️ WIP: 04 — UI Screens"

Así, en la merge review, el revisor sabe exactamente dónde mirar.
```

---

### Onboarding de nuevos miembros al equipo

Cuando alguien nuevo se suma, el panel lateral es lo primero que van a ver. Hacé que sea amigable:

1. **Cover page con README** — cómo está organizado el archivo, convención de nombres
2. **Convención documentada** — aunque sea un comentario en la página Cover
3. **Sections bien nombradas** — delimitan claramente los flujos del producto
4. **Components con jerarquía** — navegables sin conocer el archivo de memoria
5. **Libraries con descripción** — qué son y para qué sirven en este proyecto

---

## 8. Checklist Pre-Handoff

Antes de entregar cualquier archivo a desarrollo, pasá por estas verificaciones en el panel lateral:

### Panel de Layers

```
☐  Todas las capas tienen nombres descriptivos
☐  Ningún "Frame 47", "Rectangle 12" o "Group 89" en el panel
☐  No hay capas ocultas "olvidadas" con diseños alternativos sin revisar
☐  No hay elementos fuera de Frames (sin Frame padre)
☐  Los Sections están marcadas como "Ready for dev" donde corresponde
☐  Estructura de anidamiento no supera 6 niveles de profundidad
```

### Panel de Assets

```
☐  Todos los elementos del diseño son instancias de componentes (no copies)
☐  No hay broken links de componentes (instancias sin componente principal)
☐  Los assets exportables están marcados con el formato y escala correctos
☐  Las Libraries habilitadas están todas actualizadas (sin updates pendientes)
```

### Barra de Pages

```
☐  Estructura de páginas coherente con la convención del equipo
☐  Pantallas de Approved separadas de pantallas WIP
☐  Página de Design System actualizada y publicada
☐  Página de Archive con iteraciones descartadas (nunca borres, archivá)
```

---

## 9. Las 10 Reglas de Oro

| #      | Regla                                                                                           |
| ------ | ----------------------------------------------------------------------------------------------- |
| **1**  | Nombrá cada capa en el momento en que la creás. `F2` es tu mejor atajo.                         |
| **2**  | Todo dentro de Frames. Nunca elementos huérfanos en el canvas.                                  |
| **3**  | Usá `/` en los nombres de componentes para crear jerarquía automática en Assets.                |
| **4**  | Arquitectura de páginas consistente en todos tus proyectos. Usá emojis.                         |
| **5**  | Conocé de memoria los 10 atajos del panel lateral. 5 minutos de práctica = semanas de ganancia. |
| **6**  | Publicá Libraries solo cuando el componente está aprobado. WIP en branches.                     |
| **7**  | Colapsá todo con `Ctrl/Cmd + Alt + L` antes de buscar algo. Es tu punto de partida.             |
| **8**  | Alineá el naming de layers con el equipo de development desde el día 1.                         |
| **9**  | Usá Sections para organizar el canvas en lugar de crear páginas innecesarias.                   |
| **10** | El panel lateral es documentación. Si está desordenado, el diseño está desordenado.             |

---

> **Recordá:** El panel lateral no es un detalle. Es el esqueleto de tu trabajo en Figma. Dominarlo es dominar la forma en que pensás, organizás y comunicás el diseño.

---

_UX/UI Expert Series · Figma Mastery · 2025_
