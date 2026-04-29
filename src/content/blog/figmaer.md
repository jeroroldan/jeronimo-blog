---
title: "Figma Masterclass: El 20% que te da el 80% del resultado"
description: "Domina los fundamentos de Figma para diseñar como un profesional: Auto Layout, Componentes, Variables y sistemas de diseño escalables."
pubDate: "2026-04-28"
code: "figmaer"
category: "ux-ui"
tags: ["figma", "ux-design", "ui-design", "sistemas-de-diseño", "auto-layout"]
difficulty: "intermedio"
readingTime: 20
---

# 🎨 FIGMA MASTERCLASS

## El 20% que te da el 80% del resultado

> **Filosofía de esta guía:** No necesitás saber todo de Figma. Necesitás dominar los fundamentos que los profesionales usan el 90% del tiempo. Esta guía te lleva directo ahí.

---

## ÍNDICE

1. [El Modelo Mental Correcto](#1-el-modelo-mental-correcto)
2. [La Interfaz que Importa](#2-la-interfaz-que-importa)
3. [Frames vs Groups — La distinción más importante](#3-frames-vs-groups)
4. [Auto Layout — El superpoder de Figma](#4-auto-layout)
5. [Componentes — Diseñá una vez, usá mil veces](#5-componentes)
6. [Variables y Estilos — El sistema nervioso del diseño](#6-variables-y-estilos)
7. [Constraints y Responsive Design](#7-constraints-y-responsive-design)
8. [Prototipado que convierte](#8-prototipado-que-convierte)
9. [Organización profesional](#9-organización-profesional)
10. [Flujo de trabajo con devs](#10-flujo-de-trabajo-con-devs)
11. [Atajos de teclado que cambian todo](#11-atajos-de-teclado)
12. [Los 10 errores más comunes](#12-errores-comunes)

---

## 1. El Modelo Mental Correcto

Antes de tocar Figma, entendé esto: **Figma no es Photoshop**. Es un sistema de componentes que escala.

### La jerarquía fundamental

```
Archivo
  └── Page (pestaña)
        └── Frame (pantalla o sección)
              └── Frame / Group / Component
                    └── Layer (texto, forma, imagen)
```

### Los 3 principios que guían todo

**Principio 1: Todo es un sistema, no una pantalla**
No diseñes "la pantalla de login". Diseñá los componentes que construyen el login. La pantalla es una consecuencia.

**Principio 2: La verdad vive en el componente**
Si algo existe en más de un lugar, debe ser un componente. Si no, es deuda de diseño.

**Principio 3: Nombrar es pensar**
Un layer llamado `Rectangle 47` es un layer abandonado. Un layer llamado `card/background` es comunicación con tu yo futuro y con tu equipo.

---

## 2. La Interfaz que Importa

### Panel izquierdo — Capas y Assets

```
LAYERS          ← Tu árbol de trabajo
ASSETS          ← Componentes, estilos, variables
```

**Tip clave:** Usá `Cmd/Ctrl + \` para ocultar todos los paneles y ver solo el canvas. Ideal para presentar o revisar el diseño.

### Panel derecho — Propiedades

El panel derecho cambia según lo que tenés seleccionado. Aprendé a leerlo de arriba a abajo:

```
[ X ]  [ Y ]          ← Posición
[ W ]  [ H ]          ← Tamaño
[ Constraints ]       ← Comportamiento responsive
[ Auto Layout ]       ← Si está activado
[ Fill ]              ← Color de relleno
[ Stroke ]            ← Borde
[ Effects ]           ← Sombras, blur
[ Export ]            ← Para entregar assets
```

### El canvas

- **Scroll:** Dos dedos o barra espaciadora + drag
- **Zoom:** `Cmd/Ctrl + scroll` o `Z` para zoom tool
- **Fit to screen:** `Shift + 1`
- **Fit selection:** `Shift + 2`

---

## 3. Frames vs Groups

Esta es **la distinción más importante** que la mayoría aprende tarde.

### Group (Grupo)

```
❌ Comportamiento:
- Se adapta al contenido que tiene adentro
- Cambia de tamaño si movés los elementos internos
- No tiene clip de contenido por defecto
- Es "pasivo"
```

**Cuándo usar un Group:** Casi nunca, en diseño moderno. Sirve solo para mover elementos juntos temporalmente.

### Frame

```
✅ Comportamiento:
- Tiene dimensiones independientes del contenido
- Puede clipear el contenido (clip content)
- Soporta Auto Layout
- Soporta Constraints
- Puede ser un componente
- Es "activo" y tiene lógica propia
```

**Cuándo usar un Frame:** Siempre que necesités estructura. Una pantalla, una card, un botón, un ícono — todo es un Frame.

### Demostración práctica

```
Caso: Diseñar una card de producto

❌ Forma incorrecta:
- Rectangle (fondo)
- Text "Nombre del producto"
- Text "Precio"
- [Seleccionarlos todos → Group]
→ Resultado: si el texto crece, la card no se adapta

✅ Forma correcta:
- Frame (w:320, h:auto)
  - Image (foto producto)
  - Frame vertical (Auto Layout, gap:8)
    - Text "Nombre del producto"
    - Text "Precio"
→ Resultado: si el texto crece, la card se adapta automáticamente
```

**Atajo:** `F` crea un Frame. `Cmd/Ctrl + G` crea un Group.

---

## 4. Auto Layout

Auto Layout es **la función más transformadora de Figma**. Convierte tus diseños de estáticos a dinámicos.

### El concepto core

Auto Layout es Flexbox visual. Si conocés CSS, ya sabés cómo funciona. Si no, pensá así:

> Auto Layout le dice a un Frame: _"Organizá tus hijos automáticamente, en horizontal o vertical, con este espacio entre ellos"_

### Activar Auto Layout

```
Seleccioná un frame → Shift + A
(O click en el "+" de Auto Layout en el panel derecho)
```

### Las 4 propiedades fundamentales

**1. Dirección**

```
↔ Horizontal  — elementos uno al lado del otro
↕ Vertical    — elementos uno debajo del otro
```

**2. Gap (espacio entre elementos)**

```
Gap fijo:   siempre X píxeles entre hijos
Gap auto:   los hijos se empujan a los extremos (como space-between)
```

**3. Padding**

```
Espacio interno entre el borde del frame y sus hijos
Podés configurar: todos igual, horizontal/vertical, o cada lado por separado
```

**4. Sizing de hijos**

```
Fixed:    dimensión fija, no cambia
Hug:      se adapta al contenido (wrap en CSS)
Fill:     ocupa el espacio disponible (flex: 1 en CSS)
```

### Ejemplo real: Botón

```
Frame (Auto Layout, horizontal, padding: 12/24, gap: 8)
  └── Icon (16x16, Fixed)
  └── Text "Continuar" (Hug)

→ Si el texto cambia, el botón se agranda
→ Si sacás el ícono, el botón se ajusta solo
→ Si cambiás el padding, todo se recalcula
```

### Ejemplo real: Lista de items

```
Frame (Auto Layout, vertical, gap: 0, Fill width)
  └── Item 1 (Auto Layout, horizontal, padding: 16, Fill width)
  └── Item 2 (Auto Layout, horizontal, padding: 16, Fill width)
  └── Item 3 (Auto Layout, horizontal, padding: 16, Fill width)

→ Agregar un item es solo duplicar uno existente
→ El contenedor crece automáticamente
```

### Nested Auto Layout (la magia real)

Auto Layouts dentro de Auto Layouts. Así es como construís interfaces completas:

```
Screen (Auto Layout, vertical)
  └── Header (Auto Layout, horizontal)
      └── Logo
      └── Nav items (Auto Layout, horizontal)
      └── CTA Button
  └── Hero (Auto Layout, vertical, centered)
      └── Heading
      └── Subheading
      └── Button row (Auto Layout, horizontal)
  └── Cards grid (Auto Layout, horizontal, wrap)
      └── Card 1
      └── Card 2
      └── Card 3
```

**Consejo profesional:** Si encontrás que estás moviendo cosas manualmente con las flechas del teclado dentro de un frame, probablemente necesitás Auto Layout ahí.

---

## 5. Componentes

Los componentes son la razón por la que Figma escala donde Sketch o herramientas antiguas fallan.

### La lógica fundamental

```
Main Component  →  Instance  →  Instance  →  Instance
(La fuente de verdad)    (Copias que heredan cambios)
```

Cuando modificás el Main Component, todas las Instances se actualizan.

### Crear un componente

```
Seleccioná un frame → Cmd/Ctrl + Alt + K
(O click derecho → Create Component)
```

### Overrides: personalizar sin romper

Las Instances pueden tener **overrides** (sobreescrituras) sin desconectarse del componente:

```
Componente: Botón Primario (texto: "Action", fondo: azul)

Instance A: texto → "Guardar"     ✅ Override de texto
Instance B: texto → "Cancelar"   ✅ Override de texto
Instance C: fondo → rojo          ✅ Override de color

Si cambiás el tamaño del padding en el Main Component:
→ Los 3 instances se actualizan
→ Los overrides (texto y color) se preservan
```

### Variants — Componentes con estados

Las Variants agrupan variaciones de un componente en un solo lugar.

**Caso típico: Botón**

```
Button Component Set
  ├── Type=Primary / Size=Large / State=Default
  ├── Type=Primary / Size=Large / State=Hover
  ├── Type=Primary / Size=Large / State=Disabled
  ├── Type=Primary / Size=Small / State=Default
  ├── Type=Secondary / Size=Large / State=Default
  └── ... (todas las combinaciones)
```

**Cómo crear Variants:**

1. Creá varios componentes relacionados
2. Seleccionalos todos
3. Click en "Combine as variants" en el panel derecho
4. Nombrá las propiedades (Type, Size, State)

**Usar Variants en el diseño:**

- Insertás el componente
- En el panel derecho aparecen las propiedades
- Cambiás `State=Default` a `State=Hover` con un click

### Organizar componentes con naming

El `/` en el nombre crea categorías en el panel de Assets:

```
button/primary/large
button/primary/small
button/secondary/large
input/text/default
input/text/error
input/text/disabled
card/product/horizontal
card/product/vertical
icon/arrow/up
icon/arrow/down
```

Así, en Assets, encontrás todo bajo `button > primary > large`.

### Boolean Properties, Instance Swap, Text Properties

**Boolean Property:** Mostrar/ocultar elementos dentro del componente

```
Ejemplo: Card con badge "Nuevo" (visible u oculto según el caso)
→ Propiedad: showBadge = true/false
```

**Instance Swap:** Cambiar un ícono dentro de un componente

```
Ejemplo: Botón con ícono intercambiable
→ Desde el panel derecho, cambiás el ícono sin entrar al componente
```

**Text Property:** Controlar el texto desde el panel sin entrar al componente

```
Ejemplo: Badge con número ("5", "99+", "Nuevo")
→ Editás el texto directo desde el panel derecho de la instance
```

---

## 6. Variables y Estilos

### Estilos (Styles) — Lo básico que todos deberían usar

Los estilos son propiedades reutilizables:

```
Color Styles    → Paleta de colores del sistema
Text Styles     → Tipografías del sistema
Effect Styles   → Sombras y blurs
Grid Styles     → Grillas de layout
```

**Crear un Color Style:**

1. Seleccioná un elemento con color
2. En Fill, click en los 4 puntos ⋮⋮
3. Click en `+` → Nombrá como `brand/primary` o `neutral/100`

**La regla de oro:** Si un color aparece más de una vez en tu diseño, debería ser un Style.

### Variables — El futuro del design system

Las Variables son más poderosas que los Styles. Permiten:

```
✅ Tokens semánticos (primary = azul en light, blanco en dark)
✅ Modo oscuro / claro sin duplicar pantallas
✅ Variables numéricas (spacing, border-radius)
✅ Variables de texto
✅ Variables booleanas
```

**Estructura recomendada de variables de color:**

```
PRIMITIVAS (los valores reales):
  blue/100: #E3F2FD
  blue/500: #2196F3
  blue/900: #0D47A1

SEMÁNTICAS (el significado):
  color/brand/primary     → blue/500
  color/brand/secondary   → green/500
  color/surface/default   → white (light) / gray/900 (dark)
  color/text/primary      → gray/900 (light) / white (dark)
  color/text/secondary    → gray/600 (light) / gray/300 (dark)
```

**El poder de los modos:**
Tenés `color/surface/default` asignado a todos tus fondos. Para activar dark mode: cambiás el modo del Frame a "Dark" → Todo cambia automáticamente.

---

## 7. Constraints y Responsive Design

### Constraints — Comportamiento al redimensionar

Los Constraints definen cómo se comporta un elemento cuando su Frame padre cambia de tamaño.

```
Horizontal constraints:
  Left    → se mantiene pegado a la izquierda
  Right   → se mantiene pegado a la derecha
  Left & Right  → se estira (like width: 100%)
  Center  → se mantiene centrado
  Scale   → escala proporcionalmente

Vertical constraints:
  Top     → se mantiene pegado arriba
  Bottom  → se mantiene pegado abajo
  Top & Bottom  → se estira
  Center  → se mantiene centrado
  Scale   → escala proporcionalmente
```

**Ejemplo — Header fijo:**

```
Header Frame
  └── Logo (Left, Top) — siempre arriba a la izquierda
  └── Nav (Center, Top) — siempre centrado
  └── Button (Right, Top) — siempre arriba a la derecha
```

Si el Header se hace más ancho, el logo se queda a la izquierda, el nav se centra, y el botón se va a la derecha. Automáticamente.

### Min/Max width en Auto Layout

Para diseños responsive reales:

```
Frame con Auto Layout → Panel derecho → W:
  ✅ Min W: 320   (nunca más angosto que 320px)
  ✅ Max W: 1200  (nunca más ancho que 1200px)
```

Ideal para contenedores que deben tener un ancho máximo centrado en la pantalla.

---

## 8. Prototipado que Convierte

El prototipado en Figma sirve para **comunicar la intención de interacción**, no para construir el producto. Mantené esta expectativa clara.

### Conexiones básicas

```
Modo Prototype (click en la pestaña superior)
→ Hover sobre un elemento → aparece un punto azul
→ Drag ese punto al Frame destino
→ Configurá el trigger y la animación
```

### Triggers más usados

```
On Click      → El más común. Usuario clickea y navega
On Hover      → Para mostrar tooltips o estados hover
After delay   → Navega automáticamente después de N ms
Key press     → Para prototipos con interacción de teclado
```

### Animaciones que comunican

```
Instant       → Para cambios de estado abruptos (toggle, checkboxes)
Dissolve      → Para aparecer/desaparecer suavemente
Smart Animate → Para transiciones fluidas entre componentes similares
Move In/Out   → Para navegar entre pantallas (como native apps)
```

**Smart Animate** es la animación más poderosa: si dos frames tienen elementos con el mismo nombre de layer, Figma los anima automáticamente entre estados.

```
Caso de uso: Abrir un modal
Frame A: tarjeta pequeña, nombre="product-card"
Frame B: modal grande, nombre="product-card"
→ Smart Animate hace que la tarjeta se expanda al modal fluidamente
```

### Prototype flows

Definí puntos de inicio para distintos flujos:

```
Flow 1: Onboarding (empieza en Welcome Screen)
Flow 2: Purchase (empieza en Product Detail)
Flow 3: Settings (empieza en Profile Screen)
```

Así podés compartir links directos a cada flujo con stakeholders.

### Scrolling

```
Frame contenedor → Prototype tab → Overflow: Vertical / Horizontal / Both
```

Para listas largas o carruseles horizontales.

---

## 9. Organización Profesional

Un archivo desordenado es deuda técnica de diseño. Esto es lo que separa a un diseñador junior de un senior.

### Estructura de páginas recomendada

```
📄 🎨 Cover          ← Portada con nombre del proyecto, versión, fecha
📄 📋 Design System  ← Componentes, estilos, variables, tokens
📄 📱 Mobile         ← Pantallas mobile
📄 💻 Desktop        ← Pantallas desktop
📄 🔄 Prototype      ← Frames listos para prototipar
📄 🗺️ User Flows     ← Diagramas de flujo
📄 📦 Archive        ← Versiones viejas o explorations descartadas
```

### Naming conventions (convenciones de nombres)

**Layers:**

```
✅ header/navigation
✅ card/product/horizontal
✅ button/primary/large/default
✅ form/input/email

❌ Frame 47
❌ Rectangle copy 3
❌ Group 12
```

**Frames de pantallas:**

```
✅ [Mobile] Home - Default State
✅ [Mobile] Home - Loading
✅ [Desktop] Dashboard - Empty State
✅ [Desktop] Dashboard - With Data
```

### Secciones (Sections)

Usá Sections para organizar el canvas:

```
S → crea una Section
```

```
Canvas organizado:
┌─────────────────────┐  ┌─────────────────────┐
│ AUTHENTICATION       │  │ ONBOARDING           │
│  Login    Register   │  │  Step1  Step2  Step3 │
└─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│ DASHBOARD            │  │ PROFILE              │
│  Empty   With data   │  │  View    Edit        │
└─────────────────────┘  └─────────────────────┘
```

### Thumbnails de página

El Frame nombrado exactamente `.thumbnail` (con punto) en cualquier page se usa como preview de esa página en el panel lateral.

---

## 10. Flujo de Trabajo con Devs

Entregar un diseño bien hecho reduce el tiempo de dev a la mitad y evita el clásico "esto no se puede hacer".

### Inspect panel

Los devs usan el Inspect panel (o Dev Mode si tienen el plan). Asegurate de que muestre información correcta:

```
✅ Colores vinculados a variables/styles (no valores hex sueltos)
✅ Tipografías vinculadas a text styles
✅ Espaciados consistentes (múltiplos de 4 u 8)
✅ Layers nombrados descriptivamente
✅ Assets exportables marcados con export settings
```

### Export settings

Marcá los assets que los devs necesitan como imágenes:

```
Seleccioná el elemento → Panel derecho → Export → "+"
→ 1x, 2x, 3x para PNG
→ SVG para íconos (siempre SVG)
→ PDF para documentos
```

### Redlines vs No redlines

En 2024+ con Dev Mode, las redlines son automáticas. Pero estas reglas siguen siendo tuyas:

```
✅ Usá auto layout en vez de posicionar manualmente
  → Los devs ven gap y padding en vez de coordenadas

✅ Usá constraints correctos
  → Los devs entienden el comportamiento responsive

✅ Anotá los estados que no son obvios
  → Error state, empty state, loading state, success state

✅ Documentá las interacciones complejas
  → Con FigJam o con una nota en el archivo
```

### Handoff checklist

Antes de "entregar" a devs:

```
□ Todos los layers tienen nombres descriptivos
□ Los componentes están correctamente organizados
□ Las variables y styles están aplicadas (no colores sueltos)
□ Están los estados: default, hover, focus, error, disabled
□ Están los empty states y loading states
□ Los assets exportables tienen export settings
□ El prototipo muestra las interacciones principales
□ Hay una nota con lo que no es obvio
```

---

## 11. Atajos de Teclado

Estos son los que usás todos los días. Memorizalos en grupos.

### Selección y navegación

| Atajo              | Acción                              |
| ------------------ | ----------------------------------- |
| `V`                | Herramienta de selección            |
| `K`                | Herramienta de escala               |
| `Cmd/Ctrl + Click` | Seleccionar dentro de grupos/frames |
| `Cmd/Ctrl + A`     | Seleccionar todo                    |
| `Escape`           | Subir un nivel en la jerarquía      |
| `Enter`            | Entrar dentro de un frame/grupo     |

### Creación

| Atajo | Acción            |
| ----- | ----------------- |
| `F`   | Frame tool        |
| `R`   | Rectangle         |
| `O`   | Ellipse (círculo) |
| `L`   | Line              |
| `T`   | Text              |
| `P`   | Pen (vector)      |
| `I`   | Eyedropper        |

### Organización

| Atajo                  | Acción           |
| ---------------------- | ---------------- |
| `Cmd/Ctrl + G`         | Group            |
| `Cmd/Ctrl + Shift + G` | Ungroup          |
| `Cmd/Ctrl + Alt + K`   | Create component |
| `Shift + A`            | Add Auto Layout  |
| `Cmd/Ctrl + Alt + G`   | Frame selection  |
| `S`                    | Section tool     |

### Edición

| Atajo                  | Acción                        |
| ---------------------- | ----------------------------- |
| `Cmd/Ctrl + D`         | Duplicate                     |
| `Cmd/Ctrl + R`         | Rename layer                  |
| `Cmd/Ctrl + ]`         | Bring forward                 |
| `Cmd/Ctrl + [`         | Send backward                 |
| `Cmd/Ctrl + Shift + ]` | Bring to front                |
| `Cmd/Ctrl + Shift + [` | Send to back                  |
| `Alt + drag`           | Duplicar mientras movés       |
| `Alt + hover`          | Ver distancia entre elementos |

### Texto

| Atajo          | Acción    |
| -------------- | --------- |
| `Cmd/Ctrl + B` | Bold      |
| `Cmd/Ctrl + I` | Italic    |
| `Cmd/Ctrl + U` | Underline |

### Vista

| Atajo            | Acción                  |
| ---------------- | ----------------------- |
| `Cmd/Ctrl + +/-` | Zoom in/out             |
| `Shift + 1`      | Fit page                |
| `Shift + 2`      | Fit selection           |
| `Cmd/Ctrl + \`   | Ocultar/mostrar paneles |
| `Cmd/Ctrl + '`   | Mostrar/ocultar grilla  |

---

## 12. Los 10 Errores Más Comunes

### Error 1: Usar Groups donde deberían ir Frames

**Síntoma:** Los elementos no se comportan como esperás al redimensionar.
**Fix:** Convertí el Group en Frame con `Cmd/Ctrl + Alt + G`.

### Error 2: No usar Auto Layout

**Síntoma:** Estás moviendo elementos manualmente cada vez que cambia el contenido.
**Fix:** Si algo tiene estructura repetitiva o necesita adaptarse al contenido, aplicá Auto Layout.

### Error 3: Colores sin variables ni styles

**Síntoma:** Tenés 47 tonos ligeramente distintos de azul porque los pusiste a ojo.
**Fix:** Creá tu paleta como variables o styles antes de diseñar. Usá solo esos valores.

### Error 4: Un archivo para todo

**Síntoma:** El archivo tarda 30 segundos en abrir y los layers son un desastre.
**Fix:** Separà proyectos. Un archivo por producto o área. El Design System en un archivo aparte.

### Error 5: No nombrar los layers

**Síntoma:** Layers llamados "Rectangle 47", "Group 12", "Frame copy copy 2".
**Fix:** `Cmd/Ctrl + R` para renombrar. Cultivá el hábito desde el principio.

### Error 6: Ignorar los estados

**Síntoma:** Solo diseñaste el happy path. No hay empty states, error states, ni loading states.
**Fix:** Por cada pantalla, preguntate: ¿Qué pasa si está vacío? ¿Si hay error? ¿Si está cargando?

### Error 7: Pixelate assets

**Síntoma:** Los íconos se ven borrosos en los diseños porque son PNG.
**Fix:** Usá SVG para íconos siempre. Para Figma específicamente, usá plugins como Iconify.

### Error 8: Componentes sin variants para estados

**Síntoma:** Tenés `Button Default`, `Button Hover`, `Button Disabled` como 3 componentes separados e inconexos.
**Fix:** Creá un Component Set con Variants. Una sola fuente de verdad.

### Error 9: No testear el prototipo antes de compartir

**Síntoma:** En la reunión, el prototipo tiene links rotos, animaciones raras y flujos que no terminan.
**Fix:** Siempre hacé una pasada completa del prototipo en el modo presentación antes de compartir el link.

### Error 10: Diseñar solo para el estado perfecto

**Síntoma:** El diseño se ve increíble con "Usuario Ejemplo" y "Lorem ipsum", pero falla con nombres reales, textos largos, o datos edge case.
**Fix:** Probá tu diseño con contenido real. ¿Qué pasa si el nombre tiene 40 caracteres? ¿Si hay 1000 items en la lista?

---

## BONUS: Plugins que multiplican tu productividad

```
Iconify          → Miles de íconos SVG gratuitos
Unsplash         → Imágenes reales en un click
Lorem ipsum      → Texto de relleno sin salir de Figma
Content Reel     → Datos reales (nombres, emails, avatares)
Stark            → Accessibility checker (contraste, color blindness)
Figma to Code    → Exportar código CSS/HTML/React básico
Super Tidy       → Organizar y alinear layers automáticamente
```

---

## TU PLAN DE PRÁCTICA

Para dominar este material, seguí esta secuencia:

**Semana 1 — Fundamentos**

- Día 1-2: Frames, Auto Layout básico
- Día 3-4: Crear tu primer componente con variants
- Día 5-7: Rediseñá una pantalla app que uses, usando todo lo anterior

**Semana 2 — Sistema**

- Día 1-2: Variables de color (primitivas + semánticas)
- Día 3-4: Constraints y responsive design
- Día 5-7: Prototipado con Smart Animate

**Semana 3 — Integración**

- Tomá un proyecto real (o inventate uno simple)
- Aplicá toda la estructura: pages, naming, componentes, variables
- Mostráselo a alguien y explicá cada decisión

**La regla de las 20 horas:** Necesitás aproximadamente 20 horas de práctica deliberada para sentirte cómodo con estos fundamentos. No son 20 horas mirando tutoriales. Son 20 horas creando cosas reales, equivocándote, y arreglando.

---

> **Recordá:** Los mejores diseñadores no saben más atajos. Piensan más claro. Saben qué problema están resolviendo antes de abrir Figma.
>
> Esta guía te dio el lenguaje. El oficio lo construís diseñando.

---

_Masterclass creada con el principio de Pareto: el 20% del conocimiento que genera el 80% del resultado._
_Versión 1.0 — Figma (2024/2025)_
