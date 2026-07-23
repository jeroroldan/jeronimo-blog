---
title: 'FIGMA CITIZEN'
code: 'figma'
description: 'Master Class: Figma Citizen'
pubDate: 'Jul 23 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Figma — WAIOT App Citizen

---

## Modelos mentales para entender Figma

Si nunca usaste Figma, pensalo con estas metáforas. Cada una explica un concepto distinto.

### 1. Figma = Photoshop + CSS combinados

Figma es un programa de dibujo vectorial (como Illustrator, no como Paint: podés editar cualquier cosa en cualquier momento) pero con reglas de layout que funcionan **exactamente como CSS flexbox**. Todo lo que dibujás son capas en el panel izquierdo. Cada capa:

- **Frame** → es un `<div>`. Tiene fondo, borde, padding, y cosas adentro.
- **Rectangle (R)** → es un `<div>` con solo `background-color`.
- **Text (T)** → es un `<p>` o `<span>`. Tiene font-size, weight, color.
- **Auto Layout** → es `display: flex`. Idéntico.

Si sabés CSS, ya sabés Figma. Solo tenés que aprender dónde están los botones.

### 2. La metáfora de la pared y los estantes

Imaginá que la pantalla de iPhone (frame `390×844`) es una **pared**. Cada cosa que ponés adentro es un **estante** clavado en un lugar fijo de la pared.

- Si el estante **NO tiene Auto Layout**: los objetos adentro están sueltos. Vos los movés a mano, uno por uno, donde quieras. Como pegar post-its en un corcho.
- Si el estante **SÍ tiene Auto Layout** (`Shift+A`): los objetos adentro se ordenan solos en fila o columna, con un espacio fijo. Como libros en una biblioteca que se acomodan automáticamente.

**Cuándo usar cada uno:**
- Pocas cosas, distintas entre sí → estante común (frame sin Auto Layout)
- Varias cosas iguales en fila/columna → estante con Auto Layout

### 3. Hug vs Fill (abrazar vs rellenar)

Cuando un frame tiene Auto Layout, cada hijo puede tener dos comportamientos respecto al ancho/alto:

| Comportamiento | En Figma | En CSS | Metáfora |
|---|---|---|---|
| **Hug contents** | El frame se achica para ajustarse a lo que tiene adentro | `width: fit-content` | Un cinturón que se ajusta a la cintura |
| **Fill container** | El frame se estira para ocupar todo el espacio disponible | `width: 100%` o `flex: 1` | Un globo que se infla hasta tocar las paredes |
| **Fixed** | El frame tiene un tamaño fijo | `width: 360px` | Una caja rígida |

**Ejemplo práctico en el wizard:** La barra de progreso tiene 7 segmentos. Cada segmento usa `Fill container` en ancho para que todos midan lo mismo y ocupen todo el ancho disponible. Si usaran `Fixed`, tendrías que calcular el ancho a mano.

### 4. La pila de papeles (z-index)

Las capas en el panel izquierdo se apilan como **hojas de papel**. La que está más arriba en la lista tapa a las que están más abajo en la pantalla. No existe `z-index: 999`. El orden se controla arrastrando capas arriba/abajo en el panel.

```
Panel izquierdo (capas):     Resultado en pantalla:
┌──────────────┐             ┌────────────────────┐
│ 🟦 Card azul │ ← tapa a   │ ██████████████████ │ ← esto es lo que se ve
│ 🟥 Texto rojo│ ← tapa a   │ (texto rojo tapado) │
│ 🟩 Fondo     │             │ (fondo tapado)      │
└──────────────┘             └────────────────────┘
```

**Ejemplo real:** Cuando hacés un modal (Editar Perfil), el overlay oscuro y la card blanca tienen que estar **arriba** de todo en el panel de capas, para que tapen el contenido de atrás.

### 5. Constraints (anclas) — solo para frames sin Auto Layout

Cuando un frame **no** tiene Auto Layout, sus elementos hijos tienen "constraints" (restricciones). Es como clavar algo a un borde y decir "si el padre se agranda, vos te estirás o te quedás pegado a ese borde".

Ejemplo visual:

```
Frame padre se estira →        El hijo con constraint "Left & Right"
┌────────────┐                 se estira con él:
│ ┌────────┐ │                 ┌──────────────┐
│ │  hijo   │ │                 │ ┌──────────┐ │
│ └────────┘ │                 │ │   hijo    │ │
└────────────┘                 │ └──────────┘ │
                               └──────────────┘

El hijo con constraint "Right" se queda pegado a la derecha:
┌────────────┐                 ┌──────────────┐
│         ┌──┤                 │           ┌──┤
│         │h │                 │           │h │
│         └──┤                 │           └──┤
└────────────┘                 └──────────────┘
```

**Para este prototipo no lo vas a necesitar** porque las pantallas son fijas (390×844). Pero si algún día hacés componentes responsive, acordate de esto.

### 6. Componente = molde (no lo uses en este proyecto)

Un componente es como crear un **molde**. Hacés un botón, lo convertís en componente, y después creás copias (`instances`). Si cambiás el molde original, **todas** las copias se actualizan solas.

Una **variante** es el mismo molde pero con estados diferentes. Ej: un componente botón con variantes "Primary / Secondary / Disabled". Cambiás la variante en el panel derecho sin crear un botón nuevo.

**No vamos a usar componentes ni variantes en este prototipo** porque dijiste que no. En su lugar: copiá y pegá (`Ctrl+C` / `Ctrl+V`). Es más trabajo pero más simple de entender.

### 7. Group (Ctrl+G) = fantasma sin cuerpo

`Ctrl+G` agrupa capas visualmente pero el grupo **no tiene cuerpo**. No le podés poner fondo, ni borde, ni Auto Layout. Es solo para mover cosas juntas o para ordenar el panel izquierdo.

**Analogía:** Un group es como poner varios papeles sueltos dentro de un folio transparente. Los movés juntos, pero el folio no tiene color ni forma propia.

| Si necesito... | Usá |
|---|---|
| Mover 3 piezas sueltas juntas | `Ctrl+G` (Group) |
| Ponerle fondo blanco y borde a algo | Frame (`F`) |
| Que los elementos se ordenen solos | Frame + Auto Layout (`Shift+A`) |
| Organizar capas en el panel | Cualquiera de los dos |

**Regla práctica:** Si dudás entre Group y Frame, usá Frame. Siempre. El Group casi nunca es la respuesta correcta para layouts. El Frame te da más control.

### 8. El inspector derecho = DevTools de Chrome

El panel derecho de Figma es **exactamente como el panel de estilos del DevTools** de Chrome. Cuando seleccionás un elemento, ves:

```
DevTools (CSS)          Figma (panel Design)
─────────────           ────────────────────
background-color  →     Fill
border            →     Stroke
border-radius     →     Corner radius
box-shadow        →     Effects > Drop shadow
font-size         →     Text > Font size
font-weight       →     Text > Font weight
color             →     Text > Fill (sí, el color de texto está en Fill)
opacity           →     Layer > Opacity
width / height    →     W / H (arriba a la derecha del panel)
padding           →     Auto Layout > Padding
gap               →     Auto Layout > Gap
```

**Dato clave:** El color de texto en Figma está en la propiedad **Fill**, igual que el fondo de un rectángulo. No hay `color` separado. Si seleccionás un texto y cambiás Fill, cambiás el color de la letra.

### 9. Selección y navegación

| Acción | Atajo | Equivalente mental |
|---|---|---|
| Seleccionar elemento | Click | Click en el DOM |
| Seleccionar adentro de un frame | Doble click | `document.querySelector()` |
| Salir de un frame al padre | `Esc` o click afuera | Subir un nivel en el DOM |
| Seleccionar todo dentro de un frame | `Ctrl+A` estando dentro | `parentElement.children` |
| Mover en el canvas | Espacio + arrastrar | Scroll en el viewport |
| Zoom | `Ctrl` + rueda | `Ctrl` + rueda en el navegador |
| Ver todo el canvas | `Shift+1` | Fit to screen |

### 10. Resumen: la tabla definitiva de traducción mental

| Concepto | En tu cabeza |
|---|---|
| Figma entero | Un navegador donde diseñás en vez de codear |
| Canvas (área gris) | El viewport infinito |
| Frame | `<div>` con estilos |
| Rectángulo (R) | `<div>` solo con background |
| Texto (T) | `<p>` | 
| `Shift+A` | `display: flex` |
| Auto Layout H / V | `flex-direction: row / column` |
| Gap | `gap: 12px` |
| Padding | `padding: 16px` |
| Fill (color) | `background-color` (o `color` si es texto) |
| Stroke | `border` |
| Corner radius | `border-radius` |
| Hug contents | `fit-content` |
| Fill container | `flex: 1` o `100%` |
| Fixed W/H | `width: 360px; height: 48px` |
| Panel izquierdo (capas) | Árbol del DOM |
| Panel derecho (design) | Estilos del DevTools |
| Componente principal | Molde / `<template>` |
| Instancia de componente | Copia pegada al molde |
| Ctrl+G (Group) | `<div>` sin CSS, solo para mover junto |
| Constraints | `position: sticky` / anclas a bordes |
| Prototype (pestaña) | `onClick` + `router.push()` |

---

## Setup inicial

`F` → **iPhone 14** (`390 × 844`) → fondo `#F4F8F5`

Colores (copialos en un post-it o tenelos a mano):

| Uso | Hex |
|---|---|
| Verde principal | `#298F66` |
| Fondo pantalla | `#F4F8F5` |
| Blanco / cards | `#FFFFFF` |
| Texto principal | `#12211B` |
| Texto gris | `#677E73` |
| Borde gris | `#DBE4DE` |
| Verde clarito | `#E8F5E9` |
| Verde grisáceo | `#EAF1EC` |
| Naranja warning | `#F59E0A` |

---

## Equivalencia Figma ↔ HTML/CSS

Si venís del mundo web, pensá cada cosa de Figma como si fuera HTML/CSS:

### Elementos básicos

| Figma | HTML/CSS | Explicación |
|---|---|---|
| **Frame** | `<div>` | Caja contenedora con fondo, borde, padding |
| **Rectangle (R)** | `<div>` con fondo | Un div que solo tiene `background-color` |
| **Text (T)** | `<p>` o `<span>` | Texto con font-size, weight, color, line-height |
| **Crear Frame (F)** | Escribir `<div></div>` | Creás un contenedor vacío |
| **Seleccionar y mover** | `margin` / `position` | Decidís dónde va el elemento |

### Auto Layout = Flexbox

Auto Layout **es literalmente flexbox de CSS**:

| Figma | CSS |
|---|---|
| **Auto Layout horizontal** | `display: flex; flex-direction: row;` |
| **Auto Layout vertical** | `display: flex; flex-direction: column;` |
| **Gap** | `gap: 12px;` |
| **Padding** | `padding: 16px;` |
| **Align items (centro vertical)** | `align-items: center;` |
| **Align items (arriba)** | `align-items: flex-start;` |
| **Justify (space-between)** | `justify-content: space-between;` |
| **Fill container (ancho 100%)** | `width: 100%;` o `flex: 1;` |
| **Fixed width** | `width: 360px;` |
| **Fixed height** | `height: 48px;` |
| **Hug contents** | `width: fit-content;` |
| **Wrap** | `flex-wrap: wrap;` |

**Traducción mental:** Cada vez que en la web harías `display: flex`, en Figma hacés `Shift+A`.

### Estilos visuales

| Figma | CSS |
|---|---|
| **Fill** | `background-color: #298F66;` |
| **Stroke** | `border: 1px solid #DBE4DE;` |
| **Corner radius** | `border-radius: 12px;` |
| **Individual corners** | `border-top-left-radius: 20px;` |
| **Shadow (Drop shadow)** | `box-shadow: 0 2px 8px rgba(0,0,0,0.08);` |
| **Layer opacity** | `opacity: 0.5;` |
| **Text color** | `color: #12211B;` |
| **Font weight Regular** | `font-weight: 400;` |
| **Font weight 600 (Semibold)** | `font-weight: 600;` |
| **Font weight Bold** | `font-weight: 700;` |
| **Letter spacing** | `letter-spacing: 0.5px;` |
| **Line height** | `line-height: 22px;` |
| **Text align** | `text-align: center;` |

### Agrupamiento y jerarquía

| Figma | HTML/CSS |
|---|---|
| **Frame** | `<div>` — tiene sus propios estilos (fondo, borde, padding) |
| **Ctrl+G (Group)** | `<div>` sin CSS — solo sirve para mover cosas juntas |
| **Anidar frames** | `<div><div><div>` |
| **Clip content** | `overflow: hidden;` |
| **Absolute position** | `position: absolute;` |

### Cómo pensarlo: de CSS mental a Figma

| Quiero hacer esto en CSS | En Figma hago |
|---|---|
| `display: flex; flex-direction: column; gap: 12px` | Selecciono frame → `Shift+A` → vertical → gap `12` |
| `display: flex; flex-direction: row; gap: 8px` | Selecciono frame → `Shift+A` → horizontal → gap `8` |
| `padding: 16px` | Selecciono frame → panel derecho → padding `16` |
| `border-radius: 12px` | Selecciono frame → panel derecho → corner radius `12` |
| `align-items: center` | Selecciono Auto Layout → panel derecho → alineación vertical → centro |
| `justify-content: space-between` | Selecciono Auto Layout → panel derecho → distribución → space between |
| `<p style="font-size: 16px; font-weight: 600">` | `T` → escribo → font size `16` → weight `600` |
| `margin-top: 20px` | Muevo con mouse/flechas. `Alt` para ver distancia |
| `width: 100%; height: 48px` | Selecciono → `W: Fill`, `H: 48` |
| `opacity: 0.5` | Selecciono → panel derecho → Layer → opacity `50%` |

---

## Frame vs Auto Layout: cuándo usar cada uno

### ¿Qué es un Frame?

Es una **caja contenedora** (`<div>`). La pantalla misma es un frame. Una card es un frame. Un botón es un frame.

Creás un frame: `F` y dibujás → es un rectángulo que puede tener fondo, borde, y cosas adentro.

### ¿Qué es Auto Layout?

Es una **propiedad que le ponés a un frame** para que los elementos de adentro se organicen solos en fila (horizontal) o columna (vertical), con un espacio fijo entre ellos (`gap`).

Se activa: seleccionás un frame que ya existe → `Shift+A` → elegís dirección → ponés un número en `gap`.

### La diferencia en criollo

| Situación | Usá |
|---|---|
| Tengo 2 cosas distintas (un icono + un texto) | **Frame** a mano, las posiciono yo |
| Tengo 5 cards iguales una abajo de otra | **Frame + Auto Layout** vertical, gap 12 |
| Tengo 6 chips de filtro en fila | **Frame + Auto Layout** horizontal, gap 8 |
| Tengo un formulario con label + input + label + input... | **Frame + Auto Layout** vertical, gap 20 |
| Tengo un header con logo, texto, gear, client logo | **Frame** a mano, los posiciono yo |
| Tengo un diálogo modal con título, texto, 2 botones | **Frame** a mano (son 4 cosas distintas) |

### Cuándo SÍ usar Auto Layout

Usalo cuando tenés **3 o más elementos del mismo tipo** que van en fila o columna.

**Casos concretos en esta app:**

1. **Lista de solicitudes (SrListScreen)**: cards una abajo de otra → Auto Layout V, gap 12
2. **Dentro de cada card de solicitud**: \[icono\] \[info\] \[flecha\] → Auto Layout H, gap 12, align center
3. **Info dentro de la card**: tipo, badge, #ID, fecha, dirección → Auto Layout V, gap 4
4. **3 cards de residuos (Home)**: en fila → Auto Layout H, gap 8
5. **Chips de filtro (Mapa)**: en fila → Auto Layout H, gap 8
6. **Progress bar del wizard**: segmentos horizontales → Auto Layout H, gap 4
7. **Cards de opciones del wizard step 1**: en columna → Auto Layout V, gap 12
8. **InfoRows en detalle**: rows label|valor → Auto Layout V, gap 0
9. **Botones Cancelar/Guardar**: en fila → Auto Layout H, gap 12

### Cuándo NO usar Auto Layout

**Regla de oro**: si son 2 o menos elementos, o si son elementos distintos entre sí → a mano.

**No uses Auto Layout para:**

- La pantalla completa (es una pesadilla alinear cosas distintas)
- El header de la app (logo, texto, gear, client logo — son 4 cosas diferentes)
- La card de bienvenida del Home (es una sola)
- El mapa (es un rectángulo gris solo)
- El AppHeader del wizard (3 cosas distintas)
- Un select individual (rectángulo + placeholder + flechita)
- El diálogo de éxito (4 cosas distintas)

### Error común #1: Auto Layout para todo

"Le pongo Auto Layout a la pantalla entera."

**No.** Terminás peleándote con el alineamiento de cosas que no son iguales. Una card de bienvenida no tiene la misma altura que una fila de chips.

**Hacé en su lugar:** Nada. Posicioná cada sección a mano con el mouse. Usá `Alt` para ver distancias.

### Error común #2: No usar Auto Layout para listas

"Las 10 cards de solicitud las alineo a ojo."

**No.** Si después querés cambiar el gap de 12 a 16, tenés que mover 10 cards una por una.

**Hacé en su lugar:** Frame + Auto Layout vertical con `gap: 12`. Cambiás el gap y todo se mueve solo.

### Error común #3: Usar Ctrl+G en vez de Frame

`Ctrl+G` (Group) es como un `<div>` sin CSS. No tiene fondo, no tiene borde, no puede tener Auto Layout.

**Cuándo usar Ctrl+G:** Agrupar piezas sueltas de un ícono o partes de un logo.

**Cuándo usar Frame:** Cuando necesitás fondo, borde, recorte, o Auto Layout.

### Niveles de anidación

No anides más de 2 o 3 Auto Layouts dentro de otros. Si llegás a 4, te vas a pelear con Figma. Abrí un frame nuevo a mano.

**Bien (3 niveles):**

```
Frame pantalla
  └─ Frame + Auto Layout V (lista de cards)
       └─ Frame + Auto Layout H (card individual)
            └─ Frame + Auto Layout V (textos de la card)
```

**Mal (5 niveles):**

```
Frame pantalla + Auto Layout V
  └─ Auto Layout V
       └─ Auto Layout V
            └─ Auto Layout H
                 └─ Auto Layout V  ← demasiado
```

### Cómo pensarlo antes de empezar cada pantalla

Preguntate por cada zona:

- "¿Esto son 3+ cosas iguales en fila?" → Frame + Auto Layout H
- "¿Esto son 3+ cosas iguales en columna?" → Frame + Auto Layout V
- "¿Esto son 2 o 3 cosas distintas?" → Frame a mano (o Text/Rectangle nomás)
- "¿Esto va suelto en la pantalla?" → Rectángulo (`R`) o texto (`T`) nomás

---

## Medidas que se repiten en todo

| Elemento | Ancho × Alto | Fill | Border | Radius |
|---|---|---|---|---|
| Input / Select | `360 × 48` | `#F4F8F5` | `#DBE4DE` 1px | `12` |
| Textarea | `360 × 120` | `#F4F8F5` | `#DBE4DE` 1px | `12` |
| Botón primario | `360 × 48` | `#298F66` | — | `12` |
| Botón secundario | `360 × 48` | `#F4F8F5` | `#DBE4DE` 1px | `12` |
| Card genérica | ancho `358–360` | `#FFFFFF` | `#DBE4DE` 1px | `12` |

Margen horizontal en toda la app: `16` a cada lado.

---

## Cómo hacer un Select en Figma

En Figma no existe un componente "select". Se simula con un rectángulo y texto:

1. **Label**: `T`, escribí "Tipo de tarea", tamaño `14`, peso `600`, color `#12211B`
2. **Rectángulo**: `R`, dibujá `360×48` → Fill `#F4F8F5`, Stroke `#DBE4DE` 1px, Corner radius `12`
3. **Placeholder**: `T`, escribí "Seleccionar tipo de tarea", tamaño `16`, color `#677E73`. Adentro del rectángulo, margen izquierdo `16`
4. **Flecha**: `T`, escribí `▾`, tamaño `16`, color `#677E73`. A la derecha del rectángulo, margen `16`
5. **Agrupá**: seleccioná rectángulo + placeholder + flecha → `Ctrl+G`

Gap entre label y campo: `8`  
Gap entre campo y siguiente campo: `20`

Repetí para todos los selects (son iguales, solo cambia el texto).

---

## Colores de badges de estado

| Estado | Hex |
|---|---|
| Pendiente | `#D97706` |
| En Proceso / Asignada / En Camino / Iniciada | `#2563EB` |
| Completada / Ejecutada completamente | `#16A34A` |
| Ejecutada parcialmente | `#7C3AED` |
| Omitida | `#64748B` |
| Cancelada | `#DC2626` |
| Suspendida | `#9333EA` |

Los badges: rectángulo con paddingH `8`, paddingV `2`, radius `8`. Fondo del color al `18%` opacity, texto del color al `100%`.

---

## Guía de tipografía

| Uso | Tamaño | Peso |
|---|---|---|
| Título pantalla | `20` | Bold |
| Subtítulo / label sección | `15` / `16` | 600 |
| Texto normal | `14` / `15` | Regular |
| Texto secundario | `12` / `13` | Regular |
| Header grande | `18`–`22` | Bold |

---

## Consejos prácticos

1. **Duplicá pantallas, no las crees de cero.** Hacé la Home → `Ctrl+D` → borrá contenido → armá la siguiente. El header y el fondo ya están.

2. **Hacé un select de ejemplo y copialo.** Ponelo en una esquina de la página. Cada vez que necesites uno, `Ctrl+C` / `Ctrl+V`, cambiá el texto.

3. **Alineá con `Alt`.** Mantené `Alt` y mové el mouse sobre otro elemento. Figma te muestra la distancia en pixels.

4. **`Ctrl+G` para agrupar** cosas que van juntas (un input + su label, una card entera). Después movés el grupo entero.

5. **Para el mapa**, un rectángulo gris `#E5E7EB` que ocupe lo que sobra de la pantalla. Texto "Mapa (react-native-maps)" y emojis 📍.

6. **Para las fotos**, rectángulo gris `#D1D5DB` con texto "Foto" o 🖼. `250` alto en detalle, `80×80` en wizard.

7. **Los badges** son rectángulos chiquitos con texto adentro. Fondo del color al 18%, texto 100%.

8. **El progress bar** se hace con rectángulos finitos (ancho flexible, alto `3`, gap `4`) en Auto Layout H.

9. **Bottom sheet**: rectángulo blanco, `borderTopRadius: 20`, alto ~`200`. Handle: `40×4`, radius `2`, centrado, fill `#DBE4DE`.

10. **Placeholder**: No existe como propiedad en Figma. Simplemente escribí texto gris (`#677E73`) adentro del campo.

---

## Las 10 pantallas (orden para hacerlas)

| # | Pantalla | Complejidad |
|---|---|---|
| 1 | **Splash** | Baja |
| 2 | **Home** | Media |
| 3 | **Lista Solicitudes** | Media |
| 4 | **Mapa** | Media |
| 5 | **Detalle Solicitud** | Media |
| 6 | **Editar Perfil** | Baja |
| 7 | **Registro** | Baja |
| 8 | **Wizard (7 pasos)** | Alta |
| 9 | **Diálogo Éxito** | Baja |
| 10 | **Bottom Sheet** | Ya incluido en Mapa |

---

## Pantalla 1 — Splash

```
┌────────────────────────────┐
│                            │
│       (fondo #298F66)      │
│                            │
│         LOGO WAIOT         │  ← texto blanco bold 28 centrado
│                            │
│    Servicios de Residuos   │  ← blanco, 14
│                            │
│    Cargando...             │  ← blanco, 12
│                            │
│         ⬤ ⬤ ○             │  ← dots: 3 círculos 8×8, gap 8
│                            │
└────────────────────────────┘
```

Fondo: rectángulo `390×844`, fill `#298F66`. Todo centrado vertical y horizontalmente.

---

## Pantalla 2 — Registro / Login

```
┌────────────────────────────┐
│  Fondo: #F4F8F5            │
│                            │
│   ┌──────────────────────┐ │
│   │  ¡Bienvenido!        │ │  ← título 22 bold
│   │                      │ │
│   │  Ingresá tus datos   │ │  ← subtítulo 15, textSecondary
│   │                      │ │
│   │  Nombre              │ │  ← label 14 600
│   │  ┌─────────────────┐ │ │
│   │  │ Tu nombre       │ │ │  ← input 360×48, fill #F4F8F5
│   │  └─────────────────┘ │ │     border #DBE4DE 1px, radius 12
│   │                      │ │
│   │  Apellido            │ │
│   │  ┌─────────────────┐ │ │
│   │  │ Tu apellido     │ │ │
│   │  └─────────────────┘ │ │
│   │                      │ │
│   │  Teléfono            │ │
│   │  ┌─────────────────┐ │ │
│   │  │ 099 XXX XXX     │ │ │
│   │  └─────────────────┘ │ │
│   │                      │ │
│   │  ┌─────────────────┐ │ │
│   │  │   Continuar     │ │ │  ← botón primario 360×48
│   │  └─────────────────┘ │ │
│   └──────────────────────┘ │
│                            │
└────────────────────────────┘
```

Card blanca centrada (radius 16, padding 24), 3 inputs iguales uno abajo del otro, botón "Continuar" verde. Esta pantalla reusa el mismo formulario que Edit Profile.

### Versión full-screen (registro inicial)

Fondo `#F4F8F5`, card blanca centrada, solo botón "Continuar" (sin Cancelar).

### Versión modal (editar perfil)

Misma card pero con overlay `rgba(0,0,0,0.45)` de fondo, y 2 botones: Cancelar (borde gris) + Guardar (verde). Título "Editar perfil".

---

## Pantalla 3 — Home (Dashboard)

```
┌────────────────────────────────┐
│  Header (90 alto)              │
│  ┌──────┐                      │
│  │ LOGO │ WAIOT      ⭕  ⚙    │  ← Frame a mano, alinear left/right
│  └──────┘ Servicios de Residuos│
├────────────────────────────────┤
│  ┌──────────────────────────┐  │
│  │ Bienvenido [Nombre]      │  │  ← card: fill #298F66, radius 12, padding 24
│  │ Gestiona solicitudes y   │  │  texto blanco, bold 20 + regular 14
│  │ consulta contenedores... │  │
│  └──────────────────────────┘  │
│                                │
│  ACCIONES RÁPIDAS              │  ← label: 13, 600, textSecondary, uppercase
│                                │
│  ┌──────────────────────────┐  │
│  │ 🟧  │ Solicitudes de     │  │  ← Frame + Auto Layout H, gap 16
│  │     │ Servicios          │  │  icon square 48×48, fill #F59E0A, radius 12
│  │     │ Reclamos, bolsones │  │  bg white, border #DBE4DE, radius 12
│  └──────────────────────────┘  │     padding 16
│                                │
│  ┌──────────────────────────┐  │
│  │ 🟦  │ Contenedores       │  │  ← icon square 48×48, fill #3B82F6
│  │     │ Cercanos           │  │
│  │     │ Encuentra los mas  │  │
│  │     │ proximos a ti      │  │
│  └──────────────────────────┘  │
│                                │
│  TIPOS DE RESIDUOS             │  ← label: 13, 600, textSecondary, uppercase
│                                │
│  ┌────────┐┌────────┐┌──────┐│  ← Frame + Auto Layout H, gap 8
│  │  🗑    ││  ♻️    ││  🌳  ││  3 cards 1/3 ancho c/u
│  │Domicil.││Reciclab││ Poda ││  circulo icon 40×40, radius 20, bg #F4F8F5
│  │Residuos││Plastico││Restos││  label 11 bold, desc 10
│  │hogar   ││papel...││jardin││  bg white, border #DBE4DE, radius 12
│  └────────┘└────────┘└──────┘│     padding 8
│                                │
│  ┌──────────────────────────┐  │
│  │ Recordatorio             │  │  ← Frame a mano: fill #EAF1EC, radius 12, padding 16
│  │ Deposita los residuos... │  │  título 14 bold, texto 13
│  └──────────────────────────┘  │
│                                │
│                    Versión 1.0 │  ← texto: 12, textSecondary, alineado right
└────────────────────────────────┘
```

### Resumen de Auto Layouts en Home

| Zona | Tipo | Gap |
|---|---|---|
| Header | Frame a mano | — |
| Welcome card | Frame a mano | — |
| 2 action cards | Frame a mano (son solo 2 distintas) | — |
| 3 waste cards | **Auto Layout H** | 8 |
| Info card | Frame a mano | — |

---

## Pantalla 4 — Lista de Solicitudes

```
┌────────────────────────────────┐
│  Header (90 alto)              │
│  LOGO  WAIOT         ⭕  ⚙    │
│  Servicios de Residuos         │
├────────────────────────────────┤
│  ┌──┐                          │
│  │📋│ Solicitudes de Servicios │  ← Frame a mano
│  └──┘ Gestiona tus solicitudes │  iconWrap 44×44, bg #E8F5E9, radius 12
│                                │     título 20 bold, subtítulo 13
│                                │
│  ┌──────────────────────────┐  │
│  │  ＋  Nueva Solicitud     │  │  ← Frame a mano: botón primario
│  └──────────────────────────┘  │     paddingV 14, radius 14, full width
│  ────────────────────────────  │
│  Historial         3 solicitudes│  ← Frame a mano: título left, count right
│                                │
│  ┌──────────────────────────┐  │
│  │ ┌──┐ ┃ Reclamo  ┃ Pend.│  │  ← Lista: Auto Layout V, gap 12
│  │ │📋│ ┃ #1042    ┃  ▸   │  │
│  │ └──┘ ┃ 12/05/25 ┃      │  │  Card: Auto Layout H, gap 12, align center
│  │       ┃ Recolecc.┃     │  │    ├─ iconWrap 44×44, radius 22, bg #EAF1EC
│  │       ┃ 📍 Av. Art.   │  │    ├─ info: Auto Layout V, gap 4, fill container
│  │       ┃          ┃     │  │    │   ├─ row: tipo 15 600 + badge
│  │       ┃          ┃     │  │    │   ├─ #ID 12 bold
│  └──────────────────────────┘  │    │   ├─ fecha 12
│                                │    │   ├─ descripción 13 (opcional)
│  ┌──────────────────────────┐  │    │   └─ dirección 12 + 📍 (opcional)
│  │ (segunda card...)        │  │    └─ flecha ▸ 20, textSecondary
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │ (tercera card...)        │  │
│  └──────────────────────────┘  │
└────────────────────────────────┘
```

### Resumen de Auto Layouts en SrListScreen

| Zona | Tipo | Gap |
|---|---|---|
| Header | Frame a mano | — |
| Título sección | Frame a mano | — |
| Botón CTA | Frame a mano | — |
| Lista de cards | **Auto Layout V** | 12 |
| Cada card (contenido horizontal) | **Auto Layout H** | 12 |
| Info dentro de cada card | **Auto Layout V** | 4 |

### Estado vacío

```
┌──────────────────────────────┐
│           ┌──────┐           │  ← Frame a mano, centrado horizontal
│           │  📋  │           │  iconWrap 72×72, bg #EAF1EC, radius 36
│           └──────┘           │
│    No hay solicitudes        │  ← 17, 600
│    registradas               │
│    Crea tu primera solicitud │  ← 13, textSecondary
│    para empezar              │
│    ┌────────────────────┐    │
│    │  Crear Solicitud   │    │  ← botón primario, paddingV 10, paddingH 24, radius 10
│    └────────────────────┘    │
└──────────────────────────────┘
```

### Modal de borrador

Fondo: rectángulo full-screen `rgba(0,0,0,0.5)`. Card blanca centrada (radius 16, padding 24, maxWidth ~340).

Contenido: icono 📄 (wrap 56×56, radius 28, bg rgba(0,0,0,0.05)), título "Solicitud en progreso" (17 bold), texto (14, textSecondary, centrado), botón "Continuar solicitud" (primary, full width), botón "Empezar una nueva" (secondary, borde, full width).

### Cómo armar la lista paso a paso

```
1. Frame exterior → Auto Layout V, gap 12, padding 16
     │
     └─ Card individual → Frame (bg white, border, radius 14, padding 14)
          │
          └─ Contenido horizontal → Auto Layout H, gap 12, align center
               ├─ Icono circular → Frame 44×44, radius 22, bg #EAF1EC
               │
               ├─ Info → Auto Layout V, gap 4, width: Fill container
               │    ├─ Row superior → Auto Layout H, gap 8, space-between
               │    │    ├─ Tipo (texto 15 600)
               │    │    └─ Badge (rect + texto)
               │    ├─ #ID (texto 12 bold)
               │    ├─ Fecha (texto 12)
               │    ├─ Descripción (texto 13, opcional)
               │    └─ Dirección (texto 12, opcional)
               │
               └─ Flecha ▸ (texto 20, textSecondary)
```

---

## Pantalla 5 — Mapa de Contenedores

```
┌────────────────────────────────┐
│  Header (90 alto)              │
│  LOGO  WAIOT         ⭕  ⚙    │
│  Servicios de Residuos         │
├────────────────────────────────┤
│  Contenedores Cercanos   12 res│  ← Frame a mano: título left, count right
│                                │
│  ┌──┬──────┬──┬────┬─────┐    │  ← Auto Layout H, gap 8
│  │🏠│Recicl.│🌳│Poda │Todo │    │  Chips: pill shape, radius 20
│  └──┴──────┴──┴────┴─────┘    │  paddingH 16, paddingV 8
│                                │  selected: fill #298F66, text white
│  ┌────┬────┬────┬─────┐       │  unselected: fill white, border #DBE4DE, text #677E73
│  │50m │100m│200m│500m │       │  ← Auto Layout H, gap 8 (otro grupo de chips)
│  └────┴────┴────┴─────┘       │
│                                │
│  ┌──────────────────────────┐  │
│  │        MAPA              │  │  ← Frame a mano: rectángulo fill #E5E7EB
│  │   📍 (user location)     │  │     ocupa el espacio restante
│  │   📍 📍 (containers)     │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────┐┌──────┐┌──────┐     │  ← Auto Layout H, gap 8 (scroll horizontal)
│  │Cont.1││Cont.2││Cont.3│     │  Cards chicas de contenedores
│  │  2km ││ 500m ││  3km │     │  bg white, border, radius 12
│  └──────┘└──────┘└──────┘     │
└────────────────────────────────┘
```

### Bottom Sheet de Contenedor

```
┌──────────────────────────────────────┐
│            ━━━━ (handle)             │  ← Frame 40×4, radius 2, bg #DBE4DE, centrado
│                                      │
│  ●  Contenedor Plaza Artigas         │  ← dot 12×12 color status + título 20 bold
│                                      │
│  📍 1700 m de tu ubicación           │  ← 14, textSecondary
│                                      │
│  Estado: ─────────── Activo          │  ← Auto Layout V, gap 0
│  Distancia: ───────── 1.7 km         │     cada row: label 14 textSecondary | value 14 600
│                                      │
│  ┌──────────────────────────────────┐│
│  │            Cerrar                ││  ← botón primario, 14 paddingV, radius 12
│  └──────────────────────────────────┘│
└──────────────────────────────────────┘
```

Frame: bg white, borderTopLeftRadius 20, borderTopRightRadius 20, padding 24, paddingBottom 40. Todo a mano excepto las 2 rows de info (Auto Layout V, gap 0 con separador).

### Resumen de Auto Layouts en Mapa

| Zona | Tipo | Gap |
|---|---|---|
| Header | Frame a mano | — |
| Chips waste type | **Auto Layout H** | 8 |
| Chips radius | **Auto Layout H** | 8 |
| Mapa | Frame a mano (rectángulo) | — |
| Cards containers | **Auto Layout H** | 8 |
| Bottom sheet header | Frame a mano | — |
| Info rows | **Auto Layout V** | 0 |

---

## Pantalla 6 — Wizard Crear Solicitud

### Estructura base (se repite en los 7 pasos)

```
┌────────────────────────────────┐
│  AppHeader                     │  ← Frame a mano
│  WAIOT logo + client logo + ⚙  │
├────────────────────────────────┤
│  ←  Paso X de Y · [subtítulo]  │  ← Frame a mano (WizardHeader)
│                                │
│  ████████████████████████████  │  ← Auto Layout H, gap 4 (progress bar)
│                                │     segmentos: alto 3, fill container
│                                │     completado = #298F66, pendiente = #DBE4DE
│                                │
│  [CONTENIDO DEL PASO]          │  ← varía por paso
│                                │
│  ┌──────────────────────────┐  │
│  │      Siguiente       →   │  │  ← Frame a mano: botón primario, margen inferior
│  └──────────────────────────┘  │
└────────────────────────────────┘
```

Estrategia: creá este frame base → `Ctrl+D` 6 veces → cambiá solo el contenido de cada paso.

### Paso 1 — TypeStep (Elegir tipo de solicitud)

```
¿Qué tipo de solicitud quieres realizar?  ← 14, textSecondary

┌──────────────────────────────────┐
│  🔔  │ Reclamo                  │  ← Auto Layout V, gap 12
│      │ Reporta un problema con  │     card: Auto Layout H, gap 16, padding 16
│      │ el servicio de residuos  │     emoji 28, título 16 600, desc 13
└──────────────────────────────────┘     bg white, border #DBE4DE, radius 12
                                         selected: border #298F66, bg #E8F5E9
┌──────────────────────────────────┐
│  📦  │ Solicitud de Bolsones    │
│      │ Pedi bolsones para poda │
│      │ o residuos voluminosos   │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  💬  │ Consulta                  │
│      │ Consulta sobre el        │
│      │ servicio de residuos     │
└──────────────────────────────────┘
```

Este paso NO tiene botón Siguiente. Avanza al clickear una card.

### Paso 2 — SubtypeStep (Datos del servicio)

```
Selecciona el tipo de tarea            ← 14, textSecondary

Tipo de tarea                          ← label 14 600
┌──────────────────────────────────┐
│  Seleccionar tipo de tarea   ▾   │  ← select 360×48
└──────────────────────────────────┘

Volumen
┌──────────────────────────────────┐
│  Seleccionar volumen         ▾   │  ← select 360×48
└──────────────────────────────────┘

Comentarios
┌──────────────────────────────────┐
│                                  │
│  Escribí tus comentarios...      │  ← textarea 360×120
│                                  │
└──────────────────────────────────┘

         ┌──────────────────────┐
         │     Siguiente    →   │
         └──────────────────────┘
```

### Paso 3 — WasteTypeStep (Tipo de residuo)

```
Selecciona el tipo de residuo          ← 14, textSecondary

Tipo de residuo
┌──────────────────────────────────┐
│  Seleccionar tipo de residuo ▾   │  ← select 360×48
└──────────────────────────────────┘
```

### Paso 4 — LocationStep (Ubicación)

```
Dirección del servicio                 ← 14, textSecondary

┌──────────────────────────────────┐
│  Ingresa la direccion...         │  ← input 360×48
└──────────────────────────────────┘

┌────────────────┐ ┌────────────────┐  ← Auto Layout H, gap 8, 2 botones 50%
│ 📍 Usar mi     │ │ 🗺  Mostrar en│  cada uno: bg white, border, radius 12
│    ubicación   │ │    mapa        │  paddingV 12, texto 14 600
└────────────────┘ └────────────────┘

┌──────────────────────────────────┐
│          MAPA (300 alto)         │  ← rectángulo fill #E5E7EB, radius 12
│      📍 (marcador arrastrable)  │
│ ┌────────┐ ┌──────────┐         │  ← 2 botones debajo del mapa
│ │Satelital│ │Estandar  │         │     Auto Layout H, gap 8
│ └────────┘ └──────────┘         │
└──────────────────────────────────┘
```

### Paso 5 — PhotosStep (Evidencia)

```
Añade evidencia fotográfica           ← 14, textSecondary

┌──────────────────┐ ┌──────────────────┐  ← Auto Layout H, gap 12, 2 cards 50%
│     📷           │ │     🖼           │  bg white, border #DBE4DE (dashed opcional)
│     Cámara       │ │     Galería      │  radius 12, padding 24, centrado
└──────────────────┘ └──────────────────┘

┌──────┐ ┌──────┐ ┌──────┐              ← Auto Layout H, gap 8
│foto 1│ │foto 2│ │foto 3│              miniaturas 80×80, radius 8
│  ×   │ │  ×   │ │  ×   │              fill gris, X en esquina
└──────┘ └──────┘ └──────┘
```

### Paso 6 — ContactStep (Datos de contacto)

```
Datos de contacto del solicitante     ← 14, textSecondary

Nombre
┌──────────────────────────────────┐
│  Tu nombre                       │  ← input 360×48
└──────────────────────────────────┘

Teléfono
┌──────────────────────────────────┐
│  099 XXX XXX                     │  ← input 360×48
└──────────────────────────────────┘
```

### Paso 7 — ConfirmationStep (Resumen y enviar)

```
Confirma los datos de tu solicitud   ← 14, textSecondary

┌──────────────────────────────────┐
│  TIPO ──────────── Reclamo       │  ← Card resumen: bg white, border, radius 12, padding 16
│  ────────────────────────────    │     Auto Layout V, gap 0
│  COMENTARIOS ── Basura en calle  │     Cada row: label 13 textSecondary | value 14 600
│  ────────────────────────────    │     Separador: línea 1px #DBE4DE
│  SUBTAREA ──── Recoleccion dom.  │
│  ────────────────────────────    │
│  VOLUMEN ──────────────── Alto   │
│  ────────────────────────────    │
│  TIPO RESIDUO ──── Domiciliario  │
│  ────────────────────────────    │
│  DIRECCIÓN ── Av. Artigas 123    │
│  ────────────────────────────    │
│  FOTOS ──────── [🖼] [🖼]       │
│  ────────────────────────────    │
│  CONTACTO ─── Juan / 099123456   │
└──────────────────────────────────┘

         ┌──────────────────────┐
         │  Enviar solicitud    │  ← botón primario
         └──────────────────────┘
```

### Resumen de Auto Layouts en Wizard

| Zona | Tipo | Gap |
|---|---|---|
| AppHeader | Frame a mano | — |
| WizardHeader | Frame a mano | — |
| Progress bar | **Auto Layout H** | 4 |
| Step 1: cards de opciones | **Auto Layout V** | 12 |
| Step 4: botones ubicación/mapa | **Auto Layout H** | 8 |
| Step 4: botones satelital/estándar | **Auto Layout H** | 8 |
| Step 5: botones cámara/galería | **Auto Layout H** | 12 |
| Step 5: miniaturas | **Auto Layout H** | 8 |
| Step 7: rows resumen | **Auto Layout V** | 0 (+ separador) |

---

## Pantalla 7 — Detalle de Solicitud

```
┌────────────────────────────────┐
│  ←    #1042     ┌───────────┐ │  ← Header: Frame a mano
│                 │ Pendiente  │ │  ArrowLeft + #ID bold 20 + badge color
│                 └───────────┘ │  bg white, borderBottom, paddingV 12
├────────────────────────────────┤
│                                │
│  ┌──────────────────────────┐  │  ← Cada sección: Frame a mano
│  │ Información General      │  │  bg white, border #DBE4DE, radius 12
│  │                          │  │  margin 16, padding 16
│  │ Tipo ──────── Reclamo    │  │  título 16 bold, mb 12
│  │ Subtipo ────── Recol.    │  │
│  │ Estado ─────── Pendiente │  │  InfoRows: Auto Layout V, gap 0
│  │ Dirección ──── Av. Art.  │  │    label 14 textSecondary | value 14 600 right
│  │ Fecha conf. ─ 12/05/25   │  │    separador: línea 1px #DBE4DE, paddingV 8
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │ Detalles del Servicio    │  │  ← segunda sección (misma estructura)
│  │ Volumen est. ───── Alto  │  │
│  │ Tarea ──────── Recolec.  │  │
│  │ Duración ───── 30 min    │  │
│  │ Tipo residuo ── Domicil. │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │ Comentarios del vecino   │  │  ← sección con texto libre (sin rows)
│  │ Basura acumulada en la   │  │  texto 15, lineHeight 22
│  │ esquina, necesita reco-  │  │
│  │ lección urgente          │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │ Contacto                 │  │  ← sección con InfoRows (igual estructura)
│  │ Nombre ──── Juan Pérez   │  │
│  │ Teléfono ── 099123456    │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │ Evidencia del vecino     │  │
│  │ ┌──────────────────────┐ │  │  ← fotos: rectángulo fill #D1D5DB
│  │ │     [FOTO 1]         │ │  │     250 alto, radius 12, marginTop 8-12
│  │ │                      │ │  │
│  │ └──────────────────────┘ │  │
│  │ ┌──────────────────────┐ │  │
│  │ │     [FOTO 2]         │ │  │
│  │ └──────────────────────┘ │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │ Evidencia del conductor  │  │
│  │ ┌──────────────────────┐ │  │
│  │ │     [FOTO]           │ │  │
│  │ └──────────────────────┘ │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │ Operativa                │  │  ← sección con InfoRows (condicional)
│  │ Conductor ───── Carlos   │  │
│  │ Vehículo ───── CAM-001   │  │
│  │ SLA cumplido ──── Sí     │  │
│  │ Iniciado ───── 13/05/25  │  │
│  │ Finalizado ──── 13/05/25 │  │
│  │ Asignado ────── 12/05/25 │  │
│  └──────────────────────────┘  │
└────────────────────────────────┘
```

### Resumen de Auto Layouts en SrDetail

| Zona | Tipo | Gap |
|---|---|---|
| Header (back + #ID + badge) | Frame a mano | — |
| Cada sección (card) | Frame a mano | — |
| InfoRows dentro de secciones | **Auto Layout V** | 0 (+ separador) |
| Fotos (varias en columna) | **Auto Layout V** | 12 |

---

## Pantalla 8 — Editar Perfil (modal)

```
┌────────────────────────────────┐
│    rgba(0,0,0,0.45) overlay    │
│                                │
│  ┌──────────────────────────┐  │  ← Frame a mano: card blanca centrada
│  │ Editar perfil            │  │  radius 16, padding 24, shadow
│  │                          │  │
│  │ Actualiza tus datos      │  │  ← 15, textSecondary
│  │ básicos.                 │  │
│  │                          │  │
│  │ Nombre                   │  │  ← label 14 600
│  │ ┌──────────────────────┐ │  │
│  │ │ Juan                 │ │  │  ← input 360×48, pre-filled
│  │ └──────────────────────┘ │  │
│  │                          │  │
│  │ Apellido                 │  │
│  │ ┌──────────────────────┐ │  │
│  │ │ Pérez                │ │  │
│  │ └──────────────────────┘ │  │
│  │                          │  │
│  │ Teléfono                 │  │
│  │ ┌──────────────────────┐ │  │
│  │ │ 099123456            │ │  │
│  │ └──────────────────────┘ │  │
│  │                          │  │
│  │ ┌──────────┐┌──────────┐│  │  ← Auto Layout H, gap 12, 2 botones 50%
│  │ │ Cancelar ││ Guardar  ││  │  Cancelar: bg #F4F8F5, border #DBE4DE
│  │ └──────────┘└──────────┘│  │  Guardar: bg #298F66, text white
│  └──────────────────────────┘  │  15 600, paddingV 14, radius 12
└────────────────────────────────┘
```

### Registro (versión full-screen)

Misma card, pero fondo `#F4F8F5` (sin overlay), título "¡Bienvenido!", subtítulo "Ingresá tus datos", solo botón "Continuar" (sin Cancelar).

---

## Pantalla 9 — Diálogo de Éxito

```
┌────────────────────────────────┐
│    rgba(0,0,0,0.5) overlay     │
│                                │
│     ┌──────────────────┐       │  ← Frame a mano: bg white, radius 16
│     │                  │       │  padding 24, maxWidth ~320, centrado
│     │     ✅ (48×48)   │       │
│     │                  │       │
│     │  ¡Solicitud      │       │  ← 20 bold
│     │  creada con      │       │
│     │  éxito!          │       │
│     │                  │       │
│     │  Tu solicitud    │       │  ← 14, textSecondary
│     │  ha sido         │       │
│     │  registrada con  │       │
│     │  el número       │       │
│     │  #1042           │       │  ← 24 bold, #298F66
│     │                  │       │
│     │  ┌──────────────┐│       │
│     │  │     OK       ││       │  ← botón primario, 14 paddingV, radius 12
│     │  └──────────────┘│       │     full width
│     └──────────────────┘       │
└────────────────────────────────┘
```

Todo a mano (son 5 cosas distintas: check, título, texto, #ID, botón).

---

## Resumen: qué Auto Layout en cada pantalla

| Pantalla | Auto Layouts |
|---|---|
| **Splash** | Ninguno |
| **Registro** | Ninguno (o form entero con Auto Layout V, gap 20) |
| **Home** | 3 waste cards (H, gap 8) |
| **SrList** | Lista cards (V, gap 12), contenido card (H, gap 12), info card (V, gap 4) |
| **Mapa** | Chips waste type (H, gap 8), chips radius (H, gap 8), cards containers (H, gap 8) |
| **Wizard** | Progress bar (H, gap 4), step 1 cards (V, gap 12), step 4 botones (H, gap 8 ×2), step 5 botones (H, gap 12), step 5 miniaturas (H, gap 8), step 7 resumen (V, gap 0) |
| **SrDetail** | InfoRows (V, gap 0), fotos (V, gap 12) |
| **Edit Profile** | Botones (H, gap 12) |
| **Éxito** | Ninguno |

---

## Flujo de navegación

```
Splash
  │
  ▼
Registro / Login ────────────────────────► Editar Perfil (modal)
  │                                              │
  ▼                                              ▼
Home ◄─── Tabs ───► SrList ─────► SrDetail
  │         │           │
  │         │           ▼
  │         │      Wizard (7 pasos) ──► Diálogo Éxito
  │         │
  │         ▼
  └───────► Mapa Contenedores ──► Bottom Sheet
```

---

## Checklist final antes de empezar

- [ ] Crear frame 390×844 con fondo #F4F8F5
- [ ] Tener los colores a mano (post-it o segunda pantalla)
- [ ] Hacer primer select de ejemplo, copiarlo para reusar
- [ ] Hacer primer input de ejemplo, copiarlo para reusar
- [ ] Hacer primer botón primario de ejemplo, copiarlo para reusar
- [ ] Hacer primer badge de ejemplo, copiarlo para reusar
- [ ] Empezar por Home (es la más variada, sirve de base)
- [ ] `Ctrl+D` para cada pantalla nueva
- [ ] Auto Layout solo para 3+ elementos iguales
- [ ] `Alt` para verificar distancias
- [ ] Mapa = rectángulo gris con 📍
- [ ] Fotos = rectángulo gris con 🖼
- [ ] No anidar más de 3 Auto Layouts
- [ ] Wizard: hacer frame base, duplicar 6 veces
