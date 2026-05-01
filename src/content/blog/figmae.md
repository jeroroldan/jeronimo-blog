---
title: "Guía Maestra de Figma: De Cero a Profesional"
code: "figma"
description: "Guía Maestra de Figma: De Cero a Profesional"
pubDate: "Jun 19 2024"
heroImage: "../../assets/blog-placeholder-1.jpg"
---

# 🎨 Figma Masterclass: De Cero a Profesional

> **Objetivo:** Aprender Figma desde cero mediante teoría breve + práctica intensiva.
> **Metodología:** Aprende haciendo. Cada módulo = teoría esencial + ejercicios progresivos + reto integrador.
> **Duración estimada:** 40–60 horas de práctica

---

## 📋 Índice General

- [Nivel 1 — Principiante](#nivel-1--principiante)
  - [Módulo 1: Conociendo Figma](#módulo-1-conociendo-figma)
  - [Módulo 2: Herramientas Básicas](#módulo-2-herramientas-básicas)
  - [Módulo 3: Texto y Tipografía](#módulo-3-texto-y-tipografía)
  - [Módulo 4: Colores y Estilos](#módulo-4-colores-y-estilos)
- [Nivel 2 — Intermedio](#nivel-2--intermedio)
  - [Módulo 5: Auto Layout](#módulo-5-auto-layout)
  - [Módulo 6: Componentes y Variantes](#módulo-6-componentes-y-variantes)
  - [Módulo 7: Prototipado](#módulo-7-prototipado)
- [Nivel 3 — Avanzado](#nivel-3--avanzado)
  - [Módulo 8: Sistemas de Diseño](#módulo-8-sistemas-de-diseño)
  - [Módulo 9: Proyecto Real — App Móvil](#módulo-9-proyecto-real--app-móvil)
  - [Módulo 10: Proyecto Real — Dashboard Web](#módulo-10-proyecto-real--dashboard-web)
- [Extras](#-extras)
  - [Atajos de Teclado](#atajos-de-teclado)
  - [Buenas Prácticas UX/UI](#buenas-prácticas-uxui)
  - [Recursos Recomendados](#recursos-recomendados)

---

# NIVEL 1 — PRINCIPIANTE

---

## Módulo 1: Conociendo Figma

### 📖 Teoría

Figma es una herramienta de diseño basada en el navegador (también tiene app de escritorio). Todo se guarda automáticamente en la nube y puedes colaborar en tiempo real.

**Conceptos clave:**

- **Canvas:** El espacio infinito de trabajo donde diseñas
- **Frame:** El "lienzo" donde vive tu diseño (equivale a una pantalla)
- **Layer Panel (izquierda):** Muestra todos los elementos organizados
- **Properties Panel (derecha):** Controla posición, tamaño, color, etc.
- **Toolbar (arriba):** Herramientas principales de dibujo

**Tipos de archivos:**

- **Design File:** Donde diseñas
- **FigJam:** Para brainstorming y wireframes rápidos

---

### 🏋️ Ejercicios

#### Ejercicio 1.1 — Navegación básica _(Dificultad: Alta)_

**Objetivo:** Dominar la navegación en el canvas antes de dibujar nada.

**Instrucciones:**

1. Abre Figma y crea un nuevo archivo Design
2. Practica zoom: `Ctrl/Cmd + scroll` para acercar y alejar
3. Usa `Space + arrastrar` para desplazarte por el canvas
4. Presiona `Shift + 1` para ver todo el contenido
5. Presiona `Shift + 2` para ver la selección actual

**Resultado esperado:** Navegar fluidamente sin perder la orientación en el canvas.

> 💡 **Tip:** El atajo `Z` activa la herramienta Zoom. `Shift+Z` hace zoom out.
> ⚠️ **Error común:** Usar solo el scroll sin conocer los atajos — te volverás lento.

---

#### Ejercicio 1.2 — Tu primer Frame _(Dificultad: Media)_

**Objetivo:** Crear y nombrar frames correctamente.

**Instrucciones:**

1. Presiona `F` para activar la herramienta Frame
2. En el panel derecho, elige el preset `iPhone 14 Pro` (390×844px)
3. Crea 3 frames usando ese preset
4. Nómbralos: `Pantalla 1 - Inicio`, `Pantalla 2 - Lista`, `Pantalla 3 - Detalle`
5. En el Layer Panel, organízalos en orden

**Resultado esperado:** 3 frames nombrados y ordenados visibles en el canvas.

> 💡 **Tip:** Doble clic sobre el nombre del layer para renombrarlo.
> ⚠️ **Error común:** Usar rectángulos en lugar de frames. Los frames tienen propiedades especiales (clip content, auto layout, etc.)

---

#### Ejercicio 1.3 — Exploración de paneles _(Dificultad: Baja)_

**Objetivo:** Familiarizarte con todos los paneles.

**Instrucciones:**

1. Selecciona uno de tus frames
2. En el panel derecho, cambia sus dimensiones manualmente
3. Explora las secciones: **Design**, **Prototype**, **Inspect**
4. Activa y desactiva el Layer Panel con `Ctrl/Cmd + \`
5. Busca el panel de Assets con `Shift + I` — solo explorarlo

**Resultado esperado:** Identificar todos los paneles y sus funciones básicas.

---

### 🚀 Reto Integrador del Módulo 1

**Diseña una "mapa de pantallas" básico:**

- Crea 5 frames con preset de tu elección (web o móvil)
- Nómbralos según el flujo de una app simple (ej: Login → Home → Búsqueda → Resultado → Perfil)
- Alinéalos en fila con `Tidy Up` (aparece al seleccionar varios frames)
- Agrega una nota de texto entre ellos explicando el flujo

---

## Módulo 2: Herramientas Básicas

### 📖 Teoría

Las herramientas fundamentales de Figma se activan con una sola tecla:

| Tecla | Herramienta                |
| ----- | -------------------------- |
| `V`   | Selección (Move)           |
| `F`   | Frame                      |
| `R`   | Rectángulo                 |
| `O`   | Elipse/Círculo             |
| `L`   | Línea                      |
| `P`   | Pluma (Pen)                |
| `T`   | Texto                      |
| `I`   | Cuentagotas (Color Picker) |
| `K`   | Escala                     |

**Constrains:** Definen cómo se comporta un elemento cuando su contenedor cambia de tamaño.

**Boolean Operations:** Combinar formas: Union, Subtract, Intersect, Exclude.

---

### 🏋️ Ejercicios

#### Ejercicio 2.1 — Formas básicas _(Dificultad: Alta)_

**Objetivo:** Crear y combinar formas con precisión.

**Instrucciones:**

1. Crea un frame de 800×600px
2. Dibuja un rectángulo de exactamente 200×100px (usa el panel derecho para el tamaño exacto)
3. Agrega un corner radius de 12px
4. Crea un círculo perfecto de 80px (mantén `Shift` al dibujar)
5. Alinea ambos al centro vertical usando los íconos de alineación del panel derecho
6. Combínalos con **Union Selection** (`Ctrl/Cmd + E` en la sección de Boolean)

**Resultado esperado:** Una forma unida, redondeada, con círculo fusionado.

> 💡 **Tip:** `Shift` al dibujar = proporciones perfectas. `Alt` al dibujar = desde el centro.
> ⚠️ **Error común:** No agrupar (`Ctrl/Cmd + G`) antes de mover varios elementos juntos.

---

#### Ejercicio 2.2 — Íconos con la Pluma _(Dificultad: Media)_

**Objetivo:** Usar la herramienta Pen para crear formas vectoriales.

**Instrucciones:**

1. Activa la herramienta Pluma con `P`
2. Crea un triángulo simple (3 clics + clic en el punto inicial para cerrar)
3. Crea una flecha usando la Pluma (4 puntos, sin cerrar)
4. Selecciona los puntos con `A` (Edit Mode) y ajusta las curvas arrastrando los handles
5. Usa `Stroke` en lugar de `Fill` para la flecha

**Resultado esperado:** Un triángulo sólido y una flecha con trazo visible.

> 💡 **Tip:** `Enter` o doble clic para entrar al modo edición de vectores.
> ⚠️ **Error común:** Olvidar cerrar el path — haz clic en el primer punto para cerrar.

---

#### Ejercicio 2.3 — Copiar y organizar _(Dificultad: Baja)_

**Objetivo:** Dominar duplicación y organización de elementos.

**Instrucciones:**

1. Crea un rectángulo cualquiera
2. Duplícalo con `Ctrl/Cmd + D` (5 veces)
3. Usa `Tidy Up` para distribuirlos uniformemente
4. Agrúpalos con `Ctrl/Cmd + G`
5. Renombra el grupo como `Tarjetas`

**Resultado esperado:** 6 rectángulos distribuidos uniformemente en un grupo.

---

### 🚀 Reto Integrador del Módulo 2

**Diseña un conjunto de íconos simples:**

- Crea 6 íconos usando solo formas básicas + Boolean Operations
- Sugerencias: casa, usuario, corazón, búsqueda, menú (hamburguesa), notificación
- Todos deben tener 24×24px
- Organízalos en un frame de 200×40px en fila con separación uniforme

---

## Módulo 3: Texto y Tipografía

### 📖 Teoría

El texto en Figma tiene dos modos:

- **Click** → texto de ancho fijo que crece hacia abajo
- **Click + arrastrar** → caja de texto con dimensiones definidas

**Propiedades clave de texto:**

- Font Family, Font Weight, Font Size
- Line Height (interlineado), Letter Spacing
- Alignment (izq, centro, der, justificado)
- Text Decoration (subrayado, tachado)

**Escala tipográfica recomendada (base 16px):**

| Uso     | Tamaño  | Peso     |
| ------- | ------- | -------- |
| Display | 48–64px | Bold     |
| H1      | 32px    | Bold     |
| H2      | 24px    | SemiBold |
| H3      | 20px    | SemiBold |
| Body    | 16px    | Regular  |
| Caption | 12px    | Regular  |

---

### 🏋️ Ejercicios

#### Ejercicio 3.1 — Jerarquía tipográfica _(Dificultad: Alta)_

**Objetivo:** Crear una jerarquía visual con texto.

**Instrucciones:**

1. Crea un frame de 375×812px (iPhone)
2. Agrega los siguientes textos con el estilo correcto:
   - Título principal: 28px, Bold, `#111111`
   - Subtítulo: 18px, SemiBold, `#444444`
   - Párrafo: 15px, Regular, `#666666`, line-height 1.5
   - Etiqueta/Caption: 11px, Regular, `#999999`
3. Alinéalos al margen izquierdo con 16px de padding

**Resultado esperado:** Una sección de texto con jerarquía visual clara.

> 💡 **Tip:** Crea Text Styles para reutilizarlos (panel derecho → "+" junto a Text)
> ⚠️ **Error común:** Usar muchas fuentes distintas. Usa 1 familia tipográfica con diferentes pesos.

---

#### Ejercicio 3.2 — Texto en componentes _(Dificultad: Media)_

**Objetivo:** Integrar texto dentro de elementos de UI.

**Instrucciones:**

1. Diseña una tarjeta (card) de 340×120px con:
   - Título: 16px Bold
   - Descripción: 13px Regular, máx 2 líneas con `...`
   - Etiqueta de categoría: 11px, fondo de color, border radius 4px
2. Aplica overflow a la descripción (`Text truncate` configurando la caja de texto)

**Resultado esperado:** Tarjeta con texto correctamente jerarquizado y truncado.

---

#### Ejercicio 3.3 — Estilos de texto _(Dificultad: Baja)_

**Objetivo:** Crear y aplicar Text Styles reutilizables.

**Instrucciones:**

1. Crea 4 Text Styles: `Heading/H1`, `Heading/H2`, `Body/Regular`, `Label/Small`
2. Aplícalos a 4 textos diferentes en tu frame
3. Cambia el color global de `Body/Regular` desde los estilos — observa cómo cambian todos

**Resultado esperado:** 4 Text Styles funcionales que se actualizan en cascada.

---

### 🚀 Reto Integrador del Módulo 3

**Diseña una pantalla de artículo de blog:**

- Frame móvil (375px de ancho)
- Debe incluir: categoría (label), título principal, autor + fecha, imagen placeholder (rectángulo), cuerpo de texto (3 párrafos de lorem ipsum), botón de "Leer más"
- Usa tipografía jerarquizada correctamente

---

## Módulo 4: Colores y Estilos

### 📖 Teoría

**Fill types:**

- **Solid:** Color sólido
- **Linear/Radial Gradient:** Degradados
- **Image:** Imagen de fondo
- **Pattern:** Patrón repetido (nuevo en Figma 2024)

**Color Styles:** Sistema centralizado de colores. Al cambiarlos, se actualiza en todo el archivo.

**Paleta básica recomendada:**

```
Primary:   #3B82F6 (azul)
Secondary: #8B5CF6 (violeta)
Success:   #22C55E
Warning:   #F59E0B
Danger:    #EF4444
Neutral:   #111111 → #FFFFFF (escala de grises)
Background:#F8FAFC
```

---

### 🏋️ Ejercicios

#### Ejercicio 4.1 — Paleta de colores con Color Styles _(Dificultad: Alta)_

**Objetivo:** Crear un sistema de colores completo.

**Instrucciones:**

1. Crea los siguientes Color Styles organizados por grupos:
   - `Brand/Primary`, `Brand/Secondary`
   - `Status/Success`, `Status/Warning`, `Status/Danger`
   - `Neutral/900` al `Neutral/100` (en pasos de 100, usando grises)
   - `Background/Default`, `Background/Surface`
2. Crea rectángulos de 48×48px para cada color y aplica el estilo
3. Etiqueta cada rectángulo con el nombre del estilo

**Resultado esperado:** Una paleta visual con 12+ colores como Color Styles.

> 💡 **Tip:** Nombra con `/` para crear grupos: `Brand/Primary` aparece bajo "Brand".
> ⚠️ **Error común:** Poner colores hardcodeados en los diseños en vez de usar Color Styles.

---

#### Ejercicio 4.2 — Gradientes y efectos _(Dificultad: Media)_

**Objetivo:** Aplicar gradientes y sombras correctamente.

**Instrucciones:**

1. Crea un banner de 375×200px
2. Aplica un gradiente linear de `#3B82F6` → `#8B5CF6`
3. Agrega texto blanco encima con una sombra de texto sutil
4. Agrega un efecto Drop Shadow al banner: `0px 8px 24px rgba(0,0,0,0.12)`
5. Agrega un segundo fill semitransparente encima del gradiente (para oscurecer la parte inferior)

**Resultado esperado:** Banner atractivo con gradiente, texto legible y sombra sutil.

---

#### Ejercicio 4.3 — Dark mode básico _(Dificultad: Baja)_

**Objetivo:** Crear variantes de color para light/dark mode.

**Instrucciones:**

1. Duplica tu frame del ejercicio anterior
2. Cambia todos los Color Styles de fondo por equivalentes oscuros:
   - Background: `#0F172A`, Surface: `#1E293B`, texto: `#F1F5F9`
3. Observa cómo al usar Color Styles, los cambios se propagan

**Resultado esperado:** Dos versiones (light/dark) del mismo diseño.

---

### 🚀 Reto Integrador del Módulo 4

**Diseña una pantalla de onboarding:**

- 3 slides de onboarding (3 frames de 390×844px)
- Cada slide con: ilustración (formas geométricas de colores), título, descripción, indicadores de paginación (dots), botón CTA
- Usa una paleta coherente con Color Styles
- Progresión visual: cada slide debe tener una variación de color del fondo

---

---

# NIVEL 2 — INTERMEDIO

---

## Módulo 5: Auto Layout

### 📖 Teoría

Auto Layout convierte frames en contenedores inteligentes que se adaptan automáticamente al contenido.

**Cuándo usarlo:** Casi siempre. Botones, cards, listas, navbars, formularios.

**Propiedades clave:**

- **Direction:** Horizontal / Vertical / Grid (nuevo)
- **Spacing:** Espacio entre elementos hijos
- **Padding:** Espacio interno (Top, Bottom, Left, Right)
- **Alignment:** Cómo se alinean los hijos
- **Resizing:** Fixed / Hug contents / Fill container

**Atajo:** Selecciona elementos → `Shift + A`

---

### 🏋️ Ejercicios

#### Ejercicio 5.1 — Botón adaptable _(Dificultad: Alta)_

**Objetivo:** Crear un botón que se adapte a su contenido.

**Instrucciones:**

1. Crea un texto que diga "Iniciar sesión"
2. Agrega un rectángulo detrás y aplica Auto Layout al conjunto con `Shift + A`
3. Configura: Padding horizontal 24px, vertical 12px, sin spacing (solo 1 elemento)
4. Cambia el texto a "Guardar cambios en el perfil" — el botón debe expandirse
5. Agrega un ícono (rectángulo 16×16px) antes del texto, ajusta spacing a 8px

**Resultado esperado:** Botón que se expande/contrae al cambiar el texto.

> 💡 **Tip:** Usa `Hug contents` en ancho y alto para que se ajuste automáticamente.
> ⚠️ **Error común:** Poner width/height fijo en el botón — pierde la flexibilidad del auto layout.

---

#### Ejercicio 5.2 — Lista de items _(Dificultad: Media)_

**Objetivo:** Crear una lista dinámica con Auto Layout.

**Instrucciones:**

1. Diseña un item de lista (row): ícono + texto principal + texto secundario + chevron
2. Aplica Auto Layout horizontal con: padding 16px, spacing entre elementos 12px
3. El texto central debe tener `Fill container` en ancho
4. Duplica el item 5 veces con `Ctrl/Cmd + D`
5. Envuelve todos los items en un nuevo Auto Layout vertical con spacing 0
6. Agrega un separador (línea 1px) entre cada item

**Resultado esperado:** Lista de 5 items uniforme y editable.

---

#### Ejercicio 5.3 — Navigation Bar _(Dificultad: Baja)_

**Objetivo:** Construir una nav bar adaptable.

**Instrucciones:**

1. Crea un frame de 390×56px
2. Agrega: flecha atrás (izquierda) + título centrado + botón de acción (derecha)
3. Aplica Auto Layout horizontal con `Space between` en la alineación
4. Verifica que el título permanezca centrado al cambiar los textos laterales

**Resultado esperado:** Nav bar que mantiene su estructura al editar cualquier elemento.

---

### 🚀 Reto Integrador del Módulo 5

**Diseña una pantalla de carrito de compras:**

- Lista de productos (mínimo 3) con: imagen, nombre, precio, cantidad (+/-), eliminar
- Subtotal, impuestos y total calculados visualmente (no reales, solo diseño)
- Botón de "Proceder al pago" en la parte inferior
- Todo usando Auto Layout — el contenido debe reorganizarse si agregas/quitas items

---

## Módulo 6: Componentes y Variantes

### 📖 Teoría

Los **Componentes** son elementos reutilizables. Cambias el componente principal (Main Component) y todos los usos (Instances) se actualizan.

**Las Variantes** agrupan diferentes estados de un componente:

- Botón: Default / Hover / Pressed / Disabled
- Input: Empty / Filled / Error / Focused
- Card: Small / Medium / Large

**Propiedades de Componentes (Component Properties):**

- **Boolean:** Mostrar/ocultar un elemento
- **Text:** Cambiar un texto desde la instancia
- **Instance Swap:** Cambiar un sub-componente
- **Variant:** Cambiar de variante

**Cómo crear un componente:** Seleccionar frame/grupo → `Ctrl/Cmd + Alt + K`

---

### 🏋️ Ejercicios

#### Ejercicio 6.1 — Sistema de botones _(Dificultad: Alta)_

**Objetivo:** Crear un componente de botón con 4 variantes.

**Instrucciones:**

1. Diseña el botón en su estado **Default** (Primary, azul, texto blanco)
2. Conviértelo en componente: `Ctrl/Cmd + Alt + K`
3. Agrega variantes: clic derecho → "Add variant"
4. Crea las variantes: `Default`, `Hover` (más oscuro), `Pressed` (aún más oscuro), `Disabled` (gris, 40% opacidad)
5. Agrega una Component Property Boolean llamada `Icon` para mostrar/ocultar un ícono
6. Usa el componente 3 veces en un frame y prueba cambiar las variantes desde el panel

**Resultado esperado:** Componente con 4 variantes y toggle de ícono funcional.

> 💡 **Tip:** Nombra las variantes con "Tipo=Valor" para que Figma las reconozca como propiedades.
> ⚠️ **Error común:** Editar una instancia directamente en lugar de editar el Main Component.

---

#### Ejercicio 6.2 — Input Field con estados _(Dificultad: Media)_

**Objetivo:** Crear un campo de formulario con todos sus estados.

**Instrucciones:**

1. Diseña un input field con: label, campo, placeholder text, ícono opcional
2. Crea variantes para: `Empty`, `Focused` (borde de color), `Filled` (texto real), `Error` (borde rojo + mensaje de error)
3. Agrega Text Property para el "label" y el "placeholder"
4. Agrega Boolean Property para mostrar/ocultar el ícono
5. Construye un formulario de login usando instancias de este componente

**Resultado esperado:** Formulario con inputs reutilizables y configurables.

---

#### Ejercicio 6.3 — Avatar component _(Dificultad: Baja)_

**Objetivo:** Crear un componente simple con Instance Swap.

**Instrucciones:**

1. Crea un avatar circular de 40px con imagen placeholder
2. Agrega un indicador de estado (punto verde/rojo/gris de 10px)
3. Crea variante para el tamaño: `Small` (32px), `Medium` (40px), `Large` (56px)
4. Agrega Boolean Property para el indicador de estado

**Resultado esperado:** Componente de avatar con 3 tamaños y toggle de estado.

---

### 🚀 Reto Integrador del Módulo 6

**Construye una UI Kit básica:**

- Componentes: Botón (Primary, Secondary, Danger) con variantes
- Input Field (con variantes de estado)
- Card (con variantes de contenido)
- Badge/Tag (con variantes de color/estado)
- Avatar (con variantes de tamaño)
- Organiza todo en una página llamada "UI Kit" con una grilla limpia

---

## Módulo 7: Prototipado

### 📖 Teoría

El prototipado en Figma conecta frames para simular flujos de usuario sin código.

**Tipos de conexiones:**

- **On Click / On Tap:** Acción al hacer clic
- **On Hover:** Acción al pasar el cursor
- **On Drag:** Acción al arrastrar
- **After Delay:** Se ejecuta automáticamente después de X tiempo

**Tipos de transición:**

- **Instant:** Sin animación
- **Dissolve:** Fundido entre pantallas
- **Smart Animate:** Figma detecta elementos iguales y los anima suavemente
- **Slide In/Out, Push:** Transiciones de dirección

**Cómo prototipar:** Panel `Prototype` → arrastrar el nodo azul de un elemento al frame destino.

---

### 🏋️ Ejercicios

#### Ejercicio 7.1 — Flujo de login _(Dificultad: Alta)_

**Objetivo:** Crear un flujo de autenticación completo.

**Instrucciones:**

1. Crea 4 frames: `Login`, `Forgot Password`, `Check Email`, `Home`
2. En Login: conecta el botón "Iniciar sesión" → Home (Smart Animate)
3. Conecta "¿Olvidaste tu contraseña?" → Forgot Password (Slide In desde derecha)
4. En Forgot Password: botón "Enviar" → Check Email (Dissolve)
5. En Check Email: botón "Volver al inicio" → Login (Slide In desde izquierda)
6. Previsualiza con `Ctrl/Cmd + P` o el botón "Play" arriba a la derecha

**Resultado esperado:** Flujo navegable de 4 pantallas con transiciones apropiadas.

> 💡 **Tip:** Smart Animate funciona mejor cuando los elementos tienen el mismo nombre en ambos frames.
> ⚠️ **Error común:** Olvidar establecer el Frame inicial (Starting point) del prototipo.

---

#### Ejercicio 7.2 — Menú y overlay _(Dificultad: Media)_

**Objetivo:** Crear overlays y modales interactivos.

**Instrucciones:**

1. Diseña una pantalla con un botón "+"
2. Crea un modal/bottom sheet con opciones
3. En el botón "+": conexión con tipo **Open overlay** → Bottom Sheet
4. Configura el overlay: posición "Bottom center", fondo semitransparente
5. Agrega botón de cerrar dentro del modal que lo descarte

**Resultado esperado:** Modal que aparece y desaparece correctamente sobre la pantalla.

---

#### Ejercicio 7.3 — Microinteracciones con hover _(Dificultad: Baja)_

**Objetivo:** Animar estados hover con Smart Animate.

**Instrucciones:**

1. Diseña una tarjeta en estado normal
2. Duplícala y modifícala: sombra más grande, sube 4px (y: -4px), escala al 101%
3. Conecta: tarjeta original → On Hover → tarjeta modificada (Smart Animate, 200ms, Ease Out)
4. Agrega conexión de regreso: Mouse Leave → original

**Resultado esperado:** Tarjeta con efecto hover fluido al pasar el cursor.

---

### 🚀 Reto Integrador del Módulo 7

**Prototipa una app de e-commerce básica:**

- Pantallas: Home → Lista de productos → Detalle de producto → Carrito → Confirmación
- El flujo debe ser navegable de inicio a fin
- Incluye: transición de vuelta (back), al menos 1 overlay/modal, al menos 1 transición Smart Animate
- Comparte el prototipo como link (View only) para probarlo en el móvil

---

---

# NIVEL 3 — AVANZADO

---

## Módulo 8: Sistemas de Diseño

### 📖 Teoría

Un **Design System** es una colección de componentes reutilizables + guías de uso que permite construir productos de forma consistente y eficiente.

**Capas de un Design System:**

```
1. Tokens (primitivos)
   └── Colores: #3B82F6
   └── Tipografía: Inter, 16px
   └── Espaciado: 4, 8, 12, 16, 24, 32, 48...
   └── Radios: 4, 8, 12, 16, 999

2. Estilos (semánticos)
   └── Color Primary → apunta a token de color
   └── Text/Body → apunta a token tipográfico
   └── Space/M → apunta a token de espacio

3. Componentes
   └── Button (usa estilos semánticos)
   └── Input (usa estilos semánticos)
   └── Card...

4. Patrones
   └── Formulario de login (usa Button + Input)
   └── Product Card (usa Card + Badge + Button)
```

**Design Tokens en Figma:**
Figma Variables (Feature 2023+) permite crear tokens reales y vincularlos a componentes.

---

### 🏋️ Ejercicios

#### Ejercicio 8.1 — Variables y tokens _(Dificultad: Alta)_

**Objetivo:** Implementar Variables de Figma para tokens de diseño.

**Instrucciones:**

1. Abre el panel de Variables: `Ctrl/Cmd + L` → ícono de variables
2. Crea una colección "Primitives":
   - `color/blue/500` = `#3B82F6`
   - `color/blue/600` = `#2563EB`
   - `spacing/xs` = 4, `sm` = 8, `md` = 16, `lg` = 24, `xl` = 32
3. Crea una colección "Semantic":
   - `color/brand/primary` → alias de `color/blue/500`
   - `color/brand/primary-hover` → alias de `color/blue/600`
4. Aplica `color/brand/primary` al fill de un botón
5. Cambia el valor de `color/blue/500` y observa el cambio en el botón

**Resultado esperado:** Botón cuyo color se controla por un token semántico.

> 💡 **Tip:** Usa aliases (referencias) en los tokens semánticos, no valores hardcodeados.
> ⚠️ **Error común:** No separar tokens primitivos de semánticos — mezclarlos hace el sistema inflexible.

---

#### Ejercicio 8.2 — Theming: Light & Dark _(Dificultad: Media)_

**Objetivo:** Crear un design system con soporte para dos temas.

**Instrucciones:**

1. En tu colección "Semantic", crea dos **modes**: `Light` y `Dark`
2. En Light: `bg/default` = `#FFFFFF`, `text/primary` = `#111111`
3. En Dark: `bg/default` = `#0F172A`, `text/primary` = `#F1F5F9`
4. Aplica estas variables a un frame
5. Cambia el modo del frame desde el panel derecho (Mode selector)
6. Verifica que el frame cambie completamente con 1 clic

**Resultado esperado:** Frame que alterna entre light y dark mode cambiando solo el modo de variables.

---

#### Ejercicio 8.3 — Documentación del sistema _(Dificultad: Baja)_

**Objetivo:** Crear documentación visual de tu design system.

**Instrucciones:**

1. Crea una nueva página llamada "🎨 Design System"
2. Organiza secciones con frames titulados: Colors, Typography, Spacing, Components
3. En Colors: muestra cada color con su nombre y valor HEX
4. En Typography: muestra cada estilo de texto en uso real
5. En Spacing: visualiza la escala de espaciado con rectángulos de colores
6. En Components: arrastra instancias de cada componente con sus variantes

**Resultado esperado:** Página de documentación lista para compartir con el equipo.

---

### 🚀 Reto Integrador del Módulo 8

**Construye un Design System completo:**

- Variables: colores (light/dark), espaciado, tipografía, radios
- Componentes: Button, Input, Card, Badge, Avatar, Modal, Navigation Bar, Tab Bar
- Página de documentación
- Página de componentes (UI Kit)
- Aplica el sistema en un diseño real de 3 pantallas que usen variables y componentes

---

## Módulo 9: Proyecto Real — App Móvil

### 📖 Teoría

En este módulo aplicarás todo lo aprendido en un proyecto completo: una app de **finanzas personales**.

**Pantallas a diseñar:**

1. Splash Screen
2. Onboarding (3 slides)
3. Login / Registro
4. Dashboard / Home
5. Lista de transacciones
6. Detalle de transacción
7. Agregar gasto
8. Perfil de usuario

**Proceso UX recomendado:**

```
1. Definir usuarios → 2. Wireframes (low-fi) → 3. UI Design (high-fi) → 4. Prototipo → 5. Testing
```

---

### 🏋️ Ejercicios / Fases del Proyecto

#### Fase 9.1 — Wireframes _(Dificultad: Alta)_

**Objetivo:** Definir la estructura antes de diseñar.

**Instrucciones:**

1. Usa el preset iPhone 14 Pro (390×844)
2. En escala de grises, crea wireframes de las 8 pantallas
3. Usa solo rectángulos, texto simple y líneas
4. Foco en: ¿qué información va en cada pantalla? ¿cómo se navega?
5. Conecta los wireframes como prototipo navegable básico

**Resultado esperado:** 8 wireframes navegables que definen el flujo completo.

---

#### Fase 9.2 — UI Design _(Dificultad: Media)_

**Objetivo:** Convertir los wireframes en diseño visual.

**Instrucciones:**

1. Define la identidad visual: nombre de la app, paleta (usa Variables), tipografía
2. Diseña el Home primero — es la pantalla más compleja
3. Aplica todos tus componentes del UI Kit donde corresponda
4. Sigue las guías de HIG (iOS) o Material Design (Android) para patrones comunes
5. Revisa consistencia: ¿mismos márgenes? ¿misma tipografía? ¿componentes reutilizados?

**Resultado esperado:** 8 pantallas en alta fidelidad con identidad visual coherente.

---

#### Fase 9.3 — Prototipo y entrega _(Dificultad: Baja)_

**Objetivo:** Preparar el archivo para entrega a desarrollo.

**Instrucciones:**

1. Conecta todas las pantallas en un prototipo fluido
2. Usa Smart Animate para las transiciones principales
3. Activa el modo **Inspect** y verifica que los valores sean correctos
4. Organiza el archivo: páginas claras, layers nombrados, componentes en su página
5. Comparte el archivo como "View only" y prueba el prototipo en tu móvil con Figma Mirror

**Resultado esperado:** Prototipo completo listo para presentar o entregar.

---

## Módulo 10: Proyecto Real — Dashboard Web

### 📖 Teoría

Un **dashboard** es una pantalla de resumen que muestra datos clave. En UX/UI, el reto es organizar mucha información de forma clara y usable.

**Principios clave para dashboards:**

- **Jerarquía visual:** Lo más importante, más grande y prominente
- **Agrupación:** Información relacionada junta (Ley de proximidad)
- **Escaneabilidad:** El usuario escanea antes de leer
- **Densidad de información:** Ni muy vacío ni demasiado cargado

**Layout típico de dashboard:**

```
┌─────────────────────────────────────────────────┐
│  Sidebar Nav  │  Header (breadcrumb + usuario)  │
│               ├─────────────────────────────────│
│               │  KPI Cards (4 columnas)         │
│               ├─────────────────────────────────│
│               │  Gráfico grande  │  Lista        │
│               ├─────────────────────────────────│
│               │  Tabla de datos                 │
└─────────────────────────────────────────────────┘
```

---

### 🏋️ Ejercicios / Fases del Proyecto

#### Fase 10.1 — Layout y estructura _(Dificultad: Alta)_

**Objetivo:** Construir el layout base del dashboard.

**Instrucciones:**

1. Crea un frame de 1440×900px (Desktop)
2. Diseña la sidebar: 240px de ancho, con logo, items de navegación (5 items), perfil al fondo
3. Diseña el header: breadcrumb, barra de búsqueda, notificaciones, avatar
4. Agrega 4 KPI Cards en fila: Ingresos, Usuarios, Conversión, Tickets abiertos
5. Usa Auto Layout en todo — el layout debe ser flexible

**Resultado esperado:** Estructura completa del dashboard con navegación funcional visualmente.

---

#### Fase 10.2 — Datos y visualizaciones _(Dificultad: Media)_

**Objetivo:** Añadir gráficos y tablas de datos.

**Instrucciones:**

1. Diseña un gráfico de líneas (placeholder vectorial) para mostrar tendencia mensual
2. Diseña un gráfico de barras para comparar categorías
3. Diseña una tabla de datos: encabezados, 5 filas, columna de acciones, checkbox
4. Agrega un componente de "Recent Activity" (lista de eventos con timestamp)
5. Todo debe tener estados: empty state, loading state (skeleton)

**Resultado esperado:** Dashboard con sección de datos y visualizaciones completa.

---

#### Fase 10.3 — Responsive y entrega _(Dificultad: Baja)_

**Objetivo:** Adaptar el dashboard a pantallas menores.

**Instrucciones:**

1. Duplica el frame y ajústalo a 768px (tablet)
2. La sidebar se convierte en una barra inferior de iconos
3. Las 4 KPI cards se reorganizan en grilla de 2×2
4. Los gráficos se apilan verticalmente
5. Documenta en una página "Specs" los espaciados, colores y tipografía usados

**Resultado esperado:** Dashboard responsive en 2 breakpoints con documentación de specs.

---

---

# 🔧 EXTRAS

---

## Atajos de Teclado

### Herramientas

| Acción     | Mac     | Windows |
| ---------- | ------- | ------- |
| Mover      | `V`     | `V`     |
| Frame      | `F`     | `F`     |
| Rectángulo | `R`     | `R`     |
| Elipse     | `O`     | `O`     |
| Línea      | `L`     | `L`     |
| Pluma      | `P`     | `P`     |
| Texto      | `T`     | `T`     |
| Escala     | `K`     | `K`     |
| Mano (pan) | `Space` | `Space` |

### Edición

| Acción         | Mac   | Windows        |
| -------------- | ----- | -------------- |
| Duplicar       | `⌘D`  | `Ctrl+D`       |
| Copiar         | `⌘C`  | `Ctrl+C`       |
| Pegar en lugar | `⌘⇧V` | `Ctrl+Shift+V` |
| Deshacer       | `⌘Z`  | `Ctrl+Z`       |
| Agrupar        | `⌘G`  | `Ctrl+G`       |
| Desagrupar     | `⌘⇧G` | `Ctrl+Shift+G` |
| Componente     | `⌘⌥K` | `Ctrl+Alt+K`   |
| Auto Layout    | `⇧A`  | `Shift+A`      |

### Vista

| Acción        | Mac  | Windows   |
| ------------- | ---- | --------- |
| Zoom in       | `⌘+` | `Ctrl++`  |
| Zoom out      | `⌘-` | `Ctrl+-`  |
| Zoom 100%     | `⌘0` | `Ctrl+0`  |
| Fit all       | `⇧1` | `Shift+1` |
| Fit selection | `⇧2` | `Shift+2` |
| Toggle layers | `⌘\` | `Ctrl+\`  |
| Toggle rulers | `⌘R` | `Ctrl+R`  |
| Preview       | `⌘P` | `Ctrl+P`  |

### Texto

| Acción          | Mac   | Windows        |
| --------------- | ----- | -------------- |
| Bold            | `⌘B`  | `Ctrl+B`       |
| Italic          | `⌘I`  | `Ctrl+I`       |
| Underline       | `⌘U`  | `Ctrl+U`       |
| Aumentar tamaño | `⌘⇧>` | `Ctrl+Shift+>` |
| Reducir tamaño  | `⌘⇧<` | `Ctrl+Shift+<` |

---

## Buenas Prácticas UX/UI

### Organización del archivo

- ✅ Nombra **todos** los layers — nunca dejes "Rectangle 12"
- ✅ Usa páginas para separar: Wireframes / Design / Components / Prototype
- ✅ Los componentes siempre en su propia página
- ✅ Usa grids consistentes (8px base grid)
- ✅ Versiona con fechas en el nombre del archivo: `Mi App — 2024-11`

### Diseño visual

- ✅ Sigue una escala de 8px para todos los espaciados (8, 16, 24, 32...)
- ✅ Contraste mínimo de 4.5:1 para texto (WCAG AA)
- ✅ Toca mínima de 44×44px para elementos interactivos en móvil
- ✅ Máximo 2 fuentes por proyecto
- ✅ Alinea todo — evita posiciones arbitrarias

### Componentes

- ✅ Todo elemento que se repite más de 2 veces → debe ser componente
- ✅ Nombra variantes de forma consistente: `Size=Large`, `State=Hover`
- ✅ El Main Component nunca en el canvas principal — ponlo en la página de componentes
- ✅ Usa Component Properties en vez de capas ocultas para toggles

### Colaboración

- ✅ Usa comentarios (`C`) para feedback, no mensajes externos
- ✅ Comparte siempre como "View only" para stakeholders
- ✅ Activa el modo Dev para entregas a desarrollo
- ✅ Documenta decisiones de diseño en el mismo archivo

---

## Recursos Recomendados

### Aprender más

- **[Figma Learn](https://help.figma.com/hc/en-us/categories/360002042553)** — Documentación oficial, siempre actualizada
- **[Figma YouTube](https://www.youtube.com/@Figma)** — Tutoriales oficiales de características nuevas
- **[DesignCourse (YouTube)](https://www.youtube.com/@DesignCourse)** — Tutoriales prácticos de UI/UX
- **[Flux Academy](https://www.flux-academy.com/)** — Cursos completos de diseño web con Figma

### Inspiración UI

- **[Dribbble](https://dribbble.com)** — Explorar diseños de alta calidad
- **[Mobbin](https://mobbin.com)** — Referencia de UI de apps reales
- **[UI Sources](https://www.uisources.com/)** — Patrones de UI categorizados
- **[Screenlane](https://screenlane.com/)** — Inspiración de mobile UI

### Recursos de Figma Community

- **Material Design 3** — Kit oficial de Google en Figma Community
- **Apple Design Resources** — Kit oficial de Apple (iOS UI)
- **Iconify** — Plugin con 200.000+ íconos gratuitos
- **Unsplash** — Plugin para imágenes reales en tus diseños
- **Stark** — Plugin de accesibilidad (contraste, daltonismo)

### Sistemas de diseño de referencia

- [Material Design 3](https://m3.material.io/) — Google
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — Apple
- [Atlassian Design System](https://atlassian.design/) — Atlassian
- [Carbon Design System](https://carbondesignsystem.com/) — IBM

---

## 🗺️ Hoja de Ruta Post-Curso

```
Semana 1-2:  Módulos 1-4  → Dominar herramientas básicas
Semana 3-4:  Módulos 5-6  → Auto Layout + Componentes
Semana 5:    Módulo 7     → Prototipado
Semana 6-7:  Módulo 8     → Design System
Semana 8-10: Módulos 9-10 → Proyectos reales completos
Semana 11+:  Portfolio con 3 proyectos propios
```

---

> 🎯 **Consejo final:** La mejor forma de aprender Figma es rediseñar apps que ya usas. Toma tu app favorita y rediseña 3 pantallas desde cero. Aprenderás más en 2 horas que en 10 horas de tutoriales.

---

_Guía creada con ❤️ — Última actualización: 2025_
