---
title: "Figma Masterclass"
description: "Guía completa de UX/UI — De Cero a Profesional"
pubDate: 2026-03-17
code: "fig"
image: "/images/blog/fig.jpg"
---

# 🎨 FIGMA MASTERCLASS

### Guía Completa de UX/UI — De Cero a Profesional

> **Por:** Especialista en UX/UI & Figma  
> **Nivel:** Principiante → Avanzado  
> **Formato:** Masterclass paso a paso

---

## 📋 ÍNDICE

1. [¿Qué es Figma y por qué usarlo?](#1-qué-es-figma-y-por-qué-usarlo)
2. [Configuración Inicial y Entorno de Trabajo](#2-configuración-inicial-y-entorno-de-trabajo)
3. [Herramientas Esenciales](#3-herramientas-esenciales)
4. [Frames, Grupos y Componentes](#4-frames-grupos-y-componentes)
5. [Auto Layout — La Función Más Poderosa](#5-auto-layout--la-función-más-poderosa)
6. [Estilos y Variables (Design Tokens)](#6-estilos-y-variables-design-tokens)
7. [Prototipado e Interacciones](#7-prototipado-e-interacciones)
8. [Sistema de Diseño Profesional](#8-sistema-de-diseño-profesional)
9. [Plugins Imprescindibles](#9-plugins-imprescindibles)
10. [Trabajo en Equipo y Handoff](#10-trabajo-en-equipo-y-handoff)
11. [Mejores Prácticas y Flujos de Trabajo](#11-mejores-prácticas-y-flujos-de-trabajo)
12. [Atajos de Teclado Esenciales](#12-atajos-de-teclado-esenciales)
13. [Flujo Completo de un Proyecto Real](#13-flujo-completo-de-un-proyecto-real)

---

## 1. ¿Qué es Figma y por qué usarlo?

Figma es una herramienta de diseño vectorial **basada en la nube**, colaborativa en tiempo real. Es el estándar de la industria UX/UI a nivel mundial.

### ¿Por qué Figma sobre otras herramientas?

| Característica                | Figma            | Sketch       | Adobe XD     |
| ----------------------------- | ---------------- | ------------ | ------------ |
| Colaboración en tiempo real   | ✅ Nativo        | ❌ Limitado  | ⚠️ Parcial   |
| Multiplataforma (Web/Mac/Win) | ✅ Todos         | ❌ Solo Mac  | ✅ Todos     |
| Precio inicial                | ✅ Gratis        | ❌ Pago      | ❌ Pago      |
| Prototipado avanzado          | ✅ Sí            | ⚠️ Básico    | ✅ Sí        |
| Plugins / Comunidad           | ✅ Enorme        | ✅ Buena     | ⚠️ Menor     |
| Design Tokens / Variables     | ✅ Nativo (2023) | ❌ No nativo | ❌ No nativo |

### Planes disponibles

- **Starter (Gratis):** 3 proyectos, colaboradores ilimitados en modo visualización
- **Professional ($15/mes):** Proyectos ilimitados, historial de versiones
- **Organization ($45/mes):** Design Systems avanzados, SSO
- **Enterprise:** Control total, seguridad empresarial

---

## 2. Configuración Inicial y Entorno de Trabajo

### 2.1 Anatomía de la interfaz

```
┌─────────────────────────────────────────────────────────────┐
│  [☰ Menú]  [Herramientas]  [Nombre archivo]  [Colaborar] [▶]│  ← TOOLBAR
├─────────────┬───────────────────────────────┬───────────────┤
│             │                               │               │
│   LAYERS    │                               │  PROPIEDADES  │
│   PANEL     │         CANVAS               │  PANEL        │
│             │                               │               │
│  - Frame 1  │    (área de trabajo)          │  W: 375       │
│    - Header │                               │  H: 812       │
│    - Body   │                               │  X: 0  Y: 0   │
│    - Footer │                               │               │
│             │                               │  Fill: #FFF   │
│  ASSETS ▼  │                               │  Stroke: ...  │
│  Components │                               │  Effects: ... │
│  Styles     │                               │               │
└─────────────┴───────────────────────────────┴───────────────┘
```

### 2.2 Paneles principales

**Panel Izquierdo — Layers & Assets**

- **Layers:** Jerarquía de todos los elementos del diseño
- **Assets:** Componentes, estilos, plugins disponibles
- **Plugins:** Acceso a herramientas instaladas

**Canvas Central**

- Espacio infinito donde ocurre el diseño
- `Ctrl/Cmd + Shift + H` → centra la vista
- `Ctrl/Cmd + 0` → zoom al 100%
- `Ctrl/Cmd + 1` → fit to screen

**Panel Derecho — Properties**

- Propiedades del elemento seleccionado (posición, tamaño, colores, efectos)
- Cambia dinámicamente según el tipo de objeto

### 2.3 Configurar tu workspace inicial

**Paso 1:** Crea un nuevo archivo (`Ctrl/Cmd + N`)

**Paso 2:** Configura tus páginas (Pages)

```
Página 1: 🗺️ Mapa del sitio / User Flow
Página 2: 📐 Wireframes (Lo-Fi)
Página 3: 🎨 UI Diseño (Hi-Fi)
Página 4: 🧩 Design System / Components
Página 5: 📱 Prototipo
```

**Paso 3:** Define tu Frame base según el dispositivo:

| Dispositivo        | Tamaño recomendado |
| ------------------ | ------------------ |
| iPhone 14 Pro      | 393 × 852          |
| iPhone 14 Plus     | 428 × 926          |
| Android (estándar) | 360 × 800          |
| Desktop Full HD    | 1440 × 900         |
| Desktop 4K         | 2560 × 1440        |
| Tablet (iPad)      | 768 × 1024         |

---

## 3. Herramientas Esenciales

### 3.1 Herramientas del toolbar

```
V  → Selección (Move Tool)           — La más usada
F  → Frame Tool                      — Contenedores de diseño
R  → Rectangle (Rectángulo)          — Formas base
O  → Ellipse (Elipse/Círculo)        — Shift para círculo perfecto
L  → Line (Línea)
P  → Pen Tool (Pluma vectorial)      — Para ilustraciones
T  → Text (Texto)
H  → Hand Tool (Mover canvas)        — Spacebar también funciona
I  → Color Picker (Gotero)
C  → Comment Tool (Comentarios)
```

### 3.2 El Pen Tool (P) — Vectores profesionales

El Pen Tool funciona con **nodos y curvas de Bézier**:

- **Click:** Crea punto angular (esquina)
- **Click + Drag:** Crea punto curvo (curva Bézier)
- **Click en punto inicial:** Cierra el path

**Edición de vectores:**

- `Enter` → entra en modo edición vectorial
- `Doble click` → edita un vector existente
- `Alt + Drag` → rompe la simetría de un punto curvo
- `Ctrl/Cmd + Click` → elimina un nodo

### 3.3 Texto — Tipografía profesional

**Tipos de texto:**

```
Click simple     → Texto en línea (se expande horizontalmente)
Click + Drag     → Texto en caja (se ajusta al contenedor)
```

**Propiedades tipográficas:**

- **Font Family:** La familia tipográfica (Roboto, SF Pro, etc.)
- **Font Weight:** Regular, Medium, SemiBold, Bold, Black
- **Font Size:** Tamaño en píxeles
- **Line Height:** Interlineado (recomendado: 140-160% del font size)
- **Letter Spacing:** Espaciado entre caracteres
- **Paragraph Spacing:** Espacio entre párrafos

> 💡 **Best Practice:** Activa "Clip Content" en tus cajas de texto para evitar desbordamientos inesperados.

---

## 4. Frames, Grupos y Componentes

### 4.1 Frames vs Grupos — Diferencias clave

|                                | Frame (F) | Grupo (Ctrl+G) |
| ------------------------------ | --------- | -------------- |
| Tiene sus propias propiedades  | ✅ Sí     | ❌ No          |
| Puede ser destino de prototipo | ✅ Sí     | ❌ No          |
| Clip content                   | ✅ Sí     | ❌ No          |
| Auto Layout                    | ✅ Sí     | ❌ No          |
| Constraints                    | ✅ Sí     | Limitado       |
| Performance                    | Mejor     | Menor          |

> 🚨 **Regla de oro:** Siempre usa **Frames** en lugar de grupos. Los grupos son solo para organización temporal.

### 4.2 Constraints — Diseño Responsivo

Los Constraints definen cómo un elemento se comporta cuando su contenedor cambia de tamaño:

**Eje Horizontal:**

- `Left` → Fijo desde la izquierda
- `Right` → Fijo desde la derecha
- `Left & Right` → Se estira horizontalmente
- `Center` → Se mantiene centrado
- `Scale` → Escala proporcionalmente

**Eje Vertical:**

- `Top`, `Bottom`, `Top & Bottom`, `Center`, `Scale`

**Ejemplo práctico — Navbar:**

```
Logo:         Left / Top
Nav links:    Center / Top
CTA Button:   Right / Top
```

### 4.3 Componentes — El corazón de Figma

Los componentes son **elementos reutilizables** que, al modificarse, actualizan todas sus instancias.

**Crear un componente:**

1. Selecciona el elemento
2. `Ctrl/Cmd + Alt + K` → Crea componente
3. Se identifica con un ícono de rayo ⚡ en el panel

**Terminología:**

```
Main Component (Componente Principal)
    ↓ modificarlo afecta a todas las instancias
Instance (Instancia) — copia del componente
    ↓ se puede sobreescribir propiedades localmente
```

**Modificar una instancia sin afectar otras:**

- Puedes cambiar: texto, color de fill, visibility, imagen
- No puedes cambiar: estructura/layout (a menos que lo desvinculen)

**Desligar una instancia:**

- Click derecho → `Detach instance`
- ⚠️ Úsalo solo cuando sea necesario — pierdes la sincronización

### 4.4 Variants — Componentes Inteligentes

Las Variants permiten tener múltiples estados de un componente en un solo lugar.

**Ejemplo — Botón con Variants:**

```
Componente: Button
├── Variant: Type = Primary / State = Default
├── Variant: Type = Primary / State = Hover
├── Variant: Type = Primary / State = Pressed
├── Variant: Type = Primary / State = Disabled
├── Variant: Type = Secondary / State = Default
└── Variant: Type = Secondary / State = Hover
```

**Crear Variants:**

1. Crea múltiples componentes del mismo elemento
2. Selecciónalos todos
3. En el panel derecho → `Combine as variants`
4. Renombra las propiedades en el panel

**Nombrar correctamente las properties:**

```
✅ Correcto:  Type=Primary, Size=Large, State=Default
❌ Incorrecto: button-primary-large-default
```

---

## 5. Auto Layout — La Función Más Poderosa

Auto Layout convierte un Frame en un **contenedor inteligente** que organiza sus elementos automáticamente, similar a Flexbox en CSS.

### 5.1 Activar Auto Layout

```
Selecciona un Frame o elementos → Shift + A
```

O desde el panel derecho → ícono `+` junto a "Auto Layout"

### 5.2 Configuración de Auto Layout

```
┌─────────────────────────────────┐
│  Auto Layout                    │
│                                 │
│  Dirección:  [↕ Vertical]       │  ← Vertical / Horizontal / Wrap
│  Spacing:    [12]               │  ← Espacio entre elementos
│  Padding:    [16] [16]          │  ← Padding interno (H y V)
│              [16] [16]          │  ← (o cada lado por separado)
│  Alignment:  [⬛ ⬜ ⬜]         │  ← Alineación principal
│              [⬜ ⬛ ⬜]         │  ← Alineación cruzada
│                                 │
│  Resizing:   [Hug] / [Fill]     │  ← Tamaño del contenedor
└─────────────────────────────────┘
```

### 5.3 Hug vs Fill vs Fixed

| Modo               | Comportamiento                   | Cuándo usarlo                  |
| ------------------ | -------------------------------- | ------------------------------ |
| **Hug Contents**   | Se ajusta al contenido           | Botones, tags, chips           |
| **Fill Container** | Ocupa todo el espacio disponible | Elementos flexibles            |
| **Fixed**          | Tamaño fijo inamovible           | Cuando necesitas control total |

### 5.4 Ejemplo práctico — Construir un Botón con Auto Layout

```
1. Crea un Frame con el texto "Enviar"
2. Aplica Auto Layout (Shift + A)
3. Configuración:
   - Dirección: Horizontal
   - Padding: 12px (vertical) / 24px (horizontal)
   - Spacing: 8px (para ícono + texto)
   - Width: Hug Contents
   - Height: Hug Contents
4. Agrega ícono → el botón se expande automáticamente
5. Cambia el texto → el botón se redimensiona solo
```

### 5.5 Auto Layout anidado (Nested)

La verdadera potencia está en **anidar Auto Layouts**:

```
Card (Vertical AL, padding 24px)
├── Header (Horizontal AL, space-between)
│   ├── Avatar (Frame circular)
│   └── Meta info (Vertical AL)
│       ├── Nombre (texto)
│       └── Fecha (texto)
├── Imagen
├── Contenido (Vertical AL, gap 8px)
│   ├── Título
│   └── Descripción
└── Footer (Horizontal AL, space-between)
    ├── Tags (Horizontal AL, wrap)
    └── CTA Button
```

> 💡 **Pro tip:** Usa `Space Between` para push automático de elementos (navbar logo + links + cta).

---

## 6. Estilos y Variables (Design Tokens)

### 6.1 Estilos (Styles)

Los estilos son **valores reutilizables** que puedes aplicar consistentemente.

**Tipos de estilos:**

```
🎨 Color Styles    — Paleta de colores del proyecto
📝 Text Styles     — Jerarquía tipográfica
🌫️ Effect Styles   — Sombras, blur, etc.
▦  Grid Styles    — Grillas y layouts
```

**Crear un Color Style:**

1. Selecciona un elemento con color
2. En el panel de Fill → click en el ícono de 4 puntos ⋮⋮
3. Click en `+` → Nombra el estilo
4. Convención de nombre: `Brand/Primary`, `Neutral/Gray-100`

**Organización recomendada de colores:**

```
Brand/
  Primary-500 (color principal)
  Primary-400 (hover)
  Primary-600 (pressed)
  Secondary-500

Neutral/
  White
  Gray-50, Gray-100, ..., Gray-900
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

### 6.2 Variables — El futuro del Design System

Las Variables (introducidas en 2023) permiten **theming dinámico** y Design Tokens reales.

**Tipos de variables:**

- **Color:** Para temas Light/Dark
- **Number:** Espaciados, radios, tamaños
- **String:** Textos dinámicos
- **Boolean:** Visibilidad condicional

**Crear variables:**

1. `Ctrl/Cmd + Alt + V` → Abre el panel de Variables
2. Click en `+` → Elige tipo
3. Organiza en colecciones (ej: "Primitives", "Semantic", "Component")

**Sistema de variables en 3 capas:**

```
Capa 1 — Primitives (valores base)
  color/blue-500 = #3B82F6

Capa 2 — Semantic (significado)
  color/action/primary = {color/blue-500}

Capa 3 — Component (específico)
  button/background/default = {color/action/primary}
```

**Crear modo Dark/Light:**

1. En la colección → `Add mode`
2. Añade "Light" y "Dark"
3. Define el valor de cada variable para cada modo
4. Aplica el modo en el Frame → panel derecho → "Variable Mode"

### 6.3 Text Styles — Escala tipográfica

**Jerarquía recomendada:**

```
Display/
  Display-2XL  — 72px / Bold / -2% letter-spacing
  Display-XL   — 60px / Bold / -1.5%
  Display-LG   — 48px / Bold / -1%

Heading/
  H1  — 36px / Bold
  H2  — 30px / SemiBold
  H3  — 24px / SemiBold
  H4  — 20px / SemiBold
  H5  — 18px / Medium
  H6  — 16px / Medium

Body/
  Body-XL      — 20px / Regular, line-height 30px
  Body-LG      — 18px / Regular, line-height 28px
  Body-MD      — 16px / Regular, line-height 24px
  Body-SM      — 14px / Regular, line-height 20px
  Body-XS      — 12px / Regular, line-height 18px

Label/
  Label-LG     — 16px / Medium
  Label-MD     — 14px / Medium
  Label-SM     — 12px / Medium

Code/
  Code-MD      — 14px / Monospace Regular
```

---

## 7. Prototipado e Interacciones

### 7.1 Modo Prototipo

Activa el modo con el tab `Prototype` en el panel derecho.

**Crear una conexión:**

1. Selecciona un elemento (botón, card, etc.)
2. Arrastra la flecha azul que aparece al costado
3. Apunta al Frame destino
4. Configura la interacción en el panel

### 7.2 Tipos de Triggers (disparadores)

```
On Click          → Al hacer click
On Hover          → Al pasar el cursor
On Press          → Al presionar (mantener)
On Drag           → Al arrastrar
After Delay       → Después de X milisegundos
Key/Gamepad       → Al presionar una tecla
Mouse Enter/Leave → Al entrar/salir con cursor
```

### 7.3 Tipos de Animaciones

**Transitions (entre pantallas):**

| Animación     | Uso ideal                                        |
| ------------- | ------------------------------------------------ |
| Instant       | Cambios de estado rápidos                        |
| Dissolve      | Transiciones suaves generales                    |
| Smart Animate | ✨ La más poderosa — anima elementos compartidos |
| Move In/Out   | Navegación con dirección                         |
| Push          | Navegación lateral (iOS)                         |
| Slide In/Out  | Modals, drawers                                  |
| Custom Bezier | Control total de la curva                        |

**Smart Animate — cómo funciona:**

> Smart Animate detecta automáticamente elementos con el **mismo nombre** en dos frames y anima la transición entre ellos. Es la clave para prototipos que se sienten reales.

**Ejemplo — Animación de botón:**

```
Frame 1: Button (Default state)
  - Rect: background = #3B82F6, border-radius = 8

Frame 2: Button (Hover state)
  - Rect: background = #2563EB, border-radius = 12

Conexión: On Hover → Smart Animate → 200ms → Ease Out
Resultado: El botón anima suavemente entre los dos estados
```

### 7.4 Componentes Interactivos

Combina Variants + Prototype para crear componentes con estados animados sin salir del componente.

**Ejemplo — Checkbox animado:**

```
Variant 1: State = Unchecked
  - Caja vacía

Variant 2: State = Checked
  - Caja con checkmark

Dentro del componente → Prototype:
  On Click → Change To → State=Checked → Smart Animate → 150ms
  On Click (desde Checked) → Change To → State=Unchecked
```

### 7.5 Scrolling y Overflow

**Configurar scroll en un Frame:**

1. Selecciona el Frame
2. Panel derecho → `Prototype` → `Overflow Behavior`
3. Opciones: No Scroll / Scroll Vertically / Horizontally / Both

**Fixed overlays (navbar fija):**

1. Selecciona el elemento que debe quedar fijo
2. Panel derecho → `Fix position when scrolling` ✓

---

## 8. Sistema de Diseño Profesional

### 8.1 ¿Qué es un Design System?

Un Design System es la **única fuente de verdad** del diseño de un producto. Incluye:

```
Design System
├── Foundations (Fundamentos)
│   ├── Colores
│   ├── Tipografía
│   ├── Espaciado
│   ├── Iconografía
│   ├── Grillas
│   └── Sombras/Elevación
│
├── Components (Componentes)
│   ├── Atoms (Botones, Inputs, Badges...)
│   ├── Molecules (Cards, Form Groups...)
│   ├── Organisms (Navbar, Sidebar, Modals...)
│   └── Templates (Layouts de página)
│
└── Patterns (Patrones)
    ├── Navegación
    ├── Formularios
    ├── Feedback al usuario
    └── Loading states
```

### 8.2 Arquitectura de componentes (Atomic Design)

**Atoms:** Elementos indivisibles

```
Button, Input, Label, Icon, Avatar, Badge, Divider, Tag
```

**Molecules:** Combinación de átomos

```
SearchBar (Input + Icon + Button)
FormField (Label + Input + Helper text)
Card (Image + Title + Description + Button)
```

**Organisms:** Secciones completas de UI

```
Navbar (Logo + Navigation + CTA)
Hero Section (Heading + Subtext + CTA + Image)
Product Grid (múltiples Cards)
```

### 8.3 Nombrar componentes correctamente

**Convención recomendada:**

```
[Categoría] / [Nombre] / [Variante]

Ejemplos:
Forms / Button / Primary
Forms / Button / Secondary
Forms / Input / Default
Forms / Input / Error
Navigation / Navbar / Desktop
Navigation / Sidebar / Collapsed
Feedback / Toast / Success
Feedback / Modal / Confirmation
```

### 8.4 Documentar el Design System en Figma

Usa una página dedicada con:

```
┌─── COVER ────────────────────────────────────┐
│  🎨 [Nombre del Sistema]                      │
│  Versión 1.0 | Última actualización: DD/MM/YY │
└──────────────────────────────────────────────┘

┌─── FOUNDATIONS ──────────────────────────────┐
│  Colors    │  Typography  │  Spacing          │
│  Shadows   │  Border Rad. │  Icons            │
└──────────────────────────────────────────────┘

┌─── COMPONENTS ───────────────────────────────┐
│  Botones con todos sus estados               │
│  Inputs con todos sus estados                │
│  etc...                                       │
└──────────────────────────────────────────────┘
```

---

## 9. Plugins Imprescindibles

### 9.1 Productividad

| Plugin            | Para qué sirve                                                    |
| ----------------- | ----------------------------------------------------------------- |
| **Iconify**       | Acceso a millones de íconos SVG (Material, Heroicons, Feather...) |
| **Unsplash**      | Imágenes de stock gratuitas directamente en Figma                 |
| **Lorem ipsum**   | Texto de relleno rápido                                           |
| **Content Reel**  | Datos realistas (nombres, emails, avatares)                       |
| **Similayer**     | Seleccionar capas con propiedades similares                       |
| **Select Layers** | Selección avanzada por tipo/nombre                                |

### 9.2 Design System

| Plugin                      | Para qué sirve                                     |
| --------------------------- | -------------------------------------------------- |
| **Tokens Studio**           | Design Tokens avanzados, sincronización con GitHub |
| **Figma Tokens**            | Exportar tokens a JSON para developers             |
| **Style Organizer**         | Limpiar y organizar estilos                        |
| **Variables Import/Export** | Importar/exportar variables en JSON                |

### 9.3 Prototipado avanzado

| Plugin               | Para qué sirve                                  |
| -------------------- | ----------------------------------------------- |
| **Prototypr**        | Animaciones más complejas                       |
| **Figmotion**        | Animaciones tipo After Effects                  |
| **ProtoPie Connect** | Conectar con ProtoPie para prototipos avanzados |

### 9.4 Accesibilidad

| Plugin          | Para qué sirve                               |
| --------------- | -------------------------------------------- |
| **Stark**       | Verificar contraste de colores (WCAG AA/AAA) |
| **Able**        | Checker de accesibilidad completo            |
| **Color Blind** | Simular diferentes tipos de daltonismo       |

### 9.5 Handoff y exportación

| Plugin         | Para qué sirve                    |
| -------------- | --------------------------------- |
| **Zeplin**     | Handoff detallado para developers |
| **Avocode**    | Alternativa a Zeplin              |
| **SVG Export** | Exportar SVGs optimizados         |

### 9.6 Cómo instalar plugins

1. `Ctrl/Cmd + /` → busca "Plugins"
2. O: Menú → Plugins → Browse plugins in Community
3. Click en `Install`
4. Accede desde: Click derecho → Plugins o Menú principal

---

## 10. Trabajo en Equipo y Handoff

### 10.1 Colaboración en tiempo real

- **Multiplayer cursors:** Ve los cursores de todos en tiempo real
- **Observation Mode:** Sigue el cursor de otro usuario (ideal para reviews)
- **Comments:** `C` para dejar comentarios en el diseño
- **Resolving comments:** Marca comentarios como resueltos una vez implementados

**Best practice para equipos:**

```
🔒 Main Branches = Solo para versiones aprobadas
🔨 Draft Pages = Para exploración y WIP
📌 Listo para review = Menciona @teamember en comentario
✅ Aprobado = Mueve a rama main
```

### 10.2 Branching (Figma Enterprise)

Similar a Git, permite crear ramas del diseño:

1. `Main` → diseño aprobado y en producción
2. `Branch: Feature/onboarding-redesign` → trabajo en progreso
3. Merge → revisión + aprobación + merge a main

### 10.3 Handoff para Developers

**Modo Dev (Ctrl/Cmd + Shift + D):**

- Los developers pueden inspeccionar propiedades exactas
- Ver código CSS/Swift/Kotlin generado automáticamente
- Descargar assets exportables

**Preparar el diseño para handoff:**

✅ **Checklist pre-handoff:**

```
□ Todos los textos usan Text Styles
□ Todos los colores usan Color Styles o Variables
□ Todos los elementos están en Frames (no grupos)
□ Los íconos están marcados como exportables (SVG)
□ Las imágenes están en frames con clip content
□ Los nombres de capas son descriptivos
□ Todos los estados están diseñados (hover, focus, error, empty, loading)
□ Las medidas de espaciado siguen el sistema (8px grid)
□ El prototipo refleja todos los flujos principales
□ Las anotaciones especiales están documentadas con comentarios
```

**Exportar assets:**

1. Selecciona el elemento
2. Panel derecho → `Export`
3. Agrega el formato: PNG @1x @2x @3x / SVG / PDF
4. `Export [nombre]`

### 10.4 Historial de versiones

- `Ctrl/Cmd + Alt + S` → Guarda versión nombrada
- Recomendación: Guarda versiones en hitos importantes
  ```
  v0.1 — Wireframes aprobados
  v0.5 — Primera iteración UI
  v0.8 — Post-feedback usuario
  v1.0 — Listo para desarrollo
  ```

---

## 11. Mejores Prácticas y Flujos de Trabajo

### 11.1 Organización de capas

**Nomenclatura consistente:**

```
✅ Correcto:
  hero-section/
    heading
    subheading
    cta-button
    hero-image

❌ Incorrecto:
  Group 47/
    Text 12
    Rectangle 3
    Frame 89
```

**Tips de organización:**

- Nombra todas las capas (doble click en el panel)
- Usa `Ctrl/Cmd + G` para agrupar y luego convierte a Frame
- Activa `Lock` en capas que no debes modificar accidentalmente
- Usa colores en capas para categorizar (click derecho → Mark as)

### 11.2 El sistema de 8 puntos (8pt Grid)

Todo el espaciado debe ser múltiplo de 8:

```
4px  — Micro espaciado (entre ícono y texto)
8px  — Espaciado XS
12px — Espaciado SM
16px — Espaciado MD (base)
24px — Espaciado LG
32px — Espaciado XL
48px — Espaciado 2XL
64px — Espaciado 3XL
```

**Configurar la grilla:**

1. Selecciona un Frame
2. Panel derecho → `+` en Layout Grid
3. Grid: 8px / Color: rosa al 10% de opacidad

### 11.3 Flujo de trabajo recomendado

```
1. DISCOVERY
   └── User research, competitive analysis

2. INFORMATION ARCHITECTURE
   └── Sitemap en Figma (shapes + connectors)

3. WIREFRAMES (Lo-Fi)
   └── Grises, sin estilos, solo estructura
   └── Validar flujos y jerarquía

4. WIREFRAMES (Mid-Fi)
   └── Más detallados, tipografía básica
   └── Primera ronda de feedback

5. UI DESIGN (Hi-Fi)
   └── Aplicar Design System
   └── Diseñar todos los estados
   └── Micro-interacciones

6. PROTOTIPO
   └── Flujos principales interactivos
   └── User testing con Figma Prototype

7. HANDOFF
   └── Dev Mode activo
   └── Assets exportables listos
   └── Reunión de kickoff con dev team

8. QA (Quality Assurance)
   └── Comparar implementación vs diseño
   └── Red-lining si hay discrepancias
```

### 11.4 Reglas de oro en UX/UI

```
1. Diseña para mobile first, luego escala a desktop
2. Cada componente debe tener TODOS sus estados
3. Nunca diseñes en el vacío — siempre usa datos reales
4. El diseño más simple que resuelve el problema es el mejor
5. Sé consistente — usa el Design System siempre
6. Accesibilidad no es opcional (ratio mínimo AA: 4.5:1)
7. Un componente = una responsabilidad
8. Documenta tus decisiones de diseño
9. Nunca asumas — siempre testea con usuarios
10. El diseño nunca termina — itera constantemente
```

---

## 12. Atajos de Teclado Esenciales

### Navegación y Zoom

```
Ctrl/Cmd + 0          → Zoom 100%
Ctrl/Cmd + 1          → Fit to Screen
Ctrl/Cmd + 2          → Fit to Selection
Ctrl/Cmd + +/-        → Zoom In/Out
Spacebar + Drag       → Pan (mover canvas)
Z + Click             → Zoom In
Alt + Z + Click       → Zoom Out
```

### Selección

```
V                     → Herramienta de selección
Ctrl/Cmd + A          → Seleccionar todo
Ctrl/Cmd + Click      → Seleccionar dentro de grupos
Alt + Click           → Seleccionar capas superpuestas
Tab                   → Seleccionar siguiente elemento
Shift + Tab           → Seleccionar elemento anterior
```

### Edición

```
Ctrl/Cmd + D          → Duplicar
Alt + Drag            → Duplicar al mover
Ctrl/Cmd + C/V        → Copiar/Pegar
Ctrl/Cmd + Shift + V  → Pegar en el mismo lugar
Ctrl/Cmd + Z          → Deshacer
Ctrl/Cmd + Y          → Rehacer
Del / Backspace       → Eliminar
```

### Alineación

```
Alt + A               → Alinear izquierda
Alt + D               → Alinear derecha
Alt + W               → Alinear arriba
Alt + S               → Alinear abajo
Alt + H               → Centrar horizontalmente
Alt + V               → Centrar verticalmente
```

### Objetos y Frames

```
F                     → Frame Tool
R                     → Rectangle
O                     → Ellipse
L                     → Line
T                     → Text
Ctrl/Cmd + G          → Agrupar
Ctrl/Cmd + Shift + G  → Desagrupar
Ctrl/Cmd + Alt + K    → Crear componente
Ctrl/Cmd + Alt + B    → Detach instance
Shift + A             → Auto Layout
```

### Vista

```
Ctrl/Cmd + \          → Ocultar UI
Ctrl/Cmd + Shift + H  → Mostrar/ocultar sidebar
Ctrl/Cmd + '          → Mostrar/ocultar grilla
Ctrl/Cmd + .          → Mostrar/ocultar rulers
Alt                   → Ver distancias entre elementos
```

---

## 13. Flujo Completo de un Proyecto Real

### Caso: Diseñar una App de E-commerce

#### Fase 1 — Setup (30 min)

```
1. Crear nuevo proyecto: "E-commerce App"
2. Configurar páginas:
   ├── 00 Cover
   ├── 01 Research & IA
   ├── 02 Wireframes
   ├── 03 Design System
   ├── 04 UI Screens
   └── 05 Prototype

3. Configurar Design System básico:
   ├── Definir paleta (primario, secundario, neutros, semantic)
   ├── Escala tipográfica (Heading + Body + Label)
   └── Variables de espaciado (4/8/12/16/24/32/48/64)

4. Crear Frame base: iPhone 14 Pro (393×852)
```

#### Fase 2 — Wireframes (2-4 horas)

```
Pantallas a wireframear:
├── Onboarding (3 slides)
├── Login / Register
├── Home (feed de productos)
├── Product Detail
├── Cart
├── Checkout (3 pasos)
└── Order Confirmation
```

#### Fase 3 — UI Design (8-16 horas)

```
Orden recomendado:
1. Primero: Design System completo
   ├── Buttons (primary, secondary, ghost, destructive)
   ├── Inputs (default, focused, error, disabled)
   ├── Cards (product card)
   ├── Navigation (bottom nav, header)
   └── Badges, Tags, Ratings

2. Luego: Screens usando solo los componentes del DS
   └── Si necesitas algo nuevo → añádelo al DS primero
```

#### Fase 4 — Prototipo (2-3 horas)

```
Conectar flujos principales:
1. Onboarding → Login
2. Login → Home
3. Home → Product Detail
4. Product Detail → Cart (add to cart animation)
5. Cart → Checkout
6. Checkout → Order Confirmation
```

#### Fase 5 — Handoff (1 hora)

```
1. Activar Dev Mode para el equipo dev
2. Exportar todos los íconos como SVG
3. Exportar imágenes/ilustraciones como PNG @2x
4. Documentar interacciones complejas con comentarios
5. Reunión de kickoff: walkthrough del prototipo
```

---

## 🎓 Recursos para Seguir Aprendiendo

### Oficiales

- **[figma.com/resources](https://www.figma.com/resources)** — Tutoriales oficiales
- **[help.figma.com](https://help.figma.com)** — Documentación completa
- **Figma Community** — Templates y archivos de la comunidad global

### Comunidad

- **Figma Africa / Figma Latam** — Comunidades regionales
- **r/FigmaDesign** — Reddit community
- **Figma en Discord** — Server oficial

### YouTube (recomendados)

- **Figma** — Canal oficial con tutoriales
- **DesignCourse** — Gary Simon, tutoriales de UI
- **Malewicz** — Hype4Academy, tips avanzados
- **UI Collective** — Inspiración y técnicas

### Para practicar

- **Daily UI** — 100 días de desafíos de diseño
- **Dribbble** — Inspiración de diseño
- **Mobbin** — Patrones de UI de apps reales
- **Collect UI** — Diseños categorizados por componente

---

## ✅ Checklist Final del Diseñador en Figma

```
ARCHIVO
□ Nombre descriptivo del archivo
□ Páginas organizadas con emojis
□ Versiones guardadas en hitos

DISEÑO
□ Uso consistente del Design System
□ Auto Layout en todos los componentes
□ Variables / Estilos en todos los valores
□ Todos los estados diseñados
□ Grilla de 8pt respetada

COMPONENTES
□ Nombrados con convención Category/Name/Variant
□ Variants para todos los estados
□ Documentados con notas si es necesario

PROTOTIPO
□ Flujos principales conectados
□ Smart Animate para transiciones suaves
□ Scroll configurado donde corresponde

HANDOFF
□ Capas nombradas descriptivamente
□ Assets marcados para exportar
□ Dev Mode habilitado
□ Comentarios en elementos complejos
```

---

_© Masterclass Figma UX/UI | Guía elaborada para diseñadores que quieren dominar la herramienta de diseño más poderosa del mercado._

> 💬 **Recuerda:** Figma es solo una herramienta. El verdadero skill está en entender a los usuarios, resolver sus problemas y comunicar claramente tus decisiones de diseño. La herramienta te ayuda a hacerlo más rápido y en equipo.
