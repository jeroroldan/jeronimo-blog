---
code: "fig34"
description: "Resumen Completo - Auto Layout en Figma"
pubDate: "Jun 19 2024"
heroImage: "../../assets/blog-placeholder-1.jpg"
---

# 📐 Master Class: Auto Layout en Figma

### La guía definitiva — desde el primer `Shift+A` hasta sistemas que escalan

---

> **Premisa:** Auto Layout es la característica que separa los archivos de Figma que funcionan de los que se rompen con el primer cambio de contenido. No es opcional en un sistema de diseño profesional. Es el núcleo.

---

## Tabla de Contenidos

1. [El problema que Auto Layout resuelve](#1-el-problema-que-auto-layout-resuelve)
2. [Los fundamentos — qué controla cada propiedad](#2-los-fundamentos--qué-controla-cada-propiedad)
3. [Dirección y flujo](#3-dirección-y-flujo)
4. [Spacing — Gap y Padding en profundidad](#4-spacing--gap-y-padding-en-profundidad)
5. [Resizing — el corazón del sistema](#5-resizing--el-corazón-del-sistema)
6. [Alineación dentro del Auto Layout](#6-alineación-dentro-del-auto-layout)
7. [Wrap — el comportamiento tipo grid](#7-wrap--el-comportamiento-tipo-grid)
8. [Absolute position — la excepción que confirma la regla](#8-absolute-position--la-excepción-que-confirma-la-regla)
9. [Anidado — cómo se construyen layouts complejos](#9-anidado--cómo-se-construyen-layouts-complejos)
10. [Auto Layout en Componentes](#10-auto-layout-en-componentes)
11. [Casos de uso reales](#11-casos-de-uso-reales)
12. [Mejores prácticas y reglas de oro](#12-mejores-prácticas-y-reglas-de-oro)
13. [Errores más comunes](#13-errores-más-comunes)

---

## 1. El problema que Auto Layout resuelve

### El mundo sin Auto Layout

Imaginá que diseñaste un botón. Tiene un label "Guardar", padding de 16px a los lados y 10px arriba y abajo. Se ve perfecto.

Ahora el copy cambia a "Guardar cambios". El texto crece, pero el Frame del botón tiene tamaño fijo. El texto se sale del botón o queda recortado. Tenés que ajustar manualmente el ancho del Frame, mover el ícono si hay uno, reposicionar el botón en la pantalla.

Multiplicá eso por 200 instancias del botón en el proyecto. Eso es el mundo sin Auto Layout.

### El mundo con Auto Layout

El mismo botón con Auto Layout configurado correctamente: cuando el texto cambia a "Guardar cambios", el Frame se expande automáticamente, el padding se mantiene exacto, el ícono mantiene su distancia al texto. Zero trabajo manual.

Auto Layout es la diferencia entre un diseño estático y un diseño que se comporta como código.

### La analogía con CSS

Auto Layout es básicamente Flexbox de CSS dentro de Figma. Si entendés Flexbox, Auto Layout va a hacer clic inmediatamente. Si no lo conocés, esta guía cubre todo lo que necesitás.

```
CSS Flexbox          →    Figma Auto Layout
────────────────────────────────────────────
display: flex        →    Activar Auto Layout
flex-direction: row  →    Dirección: Horizontal
flex-direction: col  →    Dirección: Vertical
gap: 8px             →    Gap: 8
padding: 16px        →    Padding: 16
align-items          →    Alineación
justify-content      →    Distribución del espacio
flex-grow: 1         →    Fill container
width: fit-content   →    Hug contents
width: 200px         →    Fixed width
flex-wrap: wrap      →    Wrap
```

---

## 2. Los fundamentos — qué controla cada propiedad

### Cómo activar Auto Layout

Seleccioná cualquier Frame → `Shift+A`

También podés seleccionar varios elementos sueltos en el canvas y presionar `Shift+A` — Figma los envuelve automáticamente en un nuevo Frame con Auto Layout.

### El panel de Auto Layout

Cuando un Frame tiene Auto Layout activado, el panel derecho muestra la sección "Auto layout" con todas sus propiedades. Es denso al principio pero con esta guía cada propiedad va a tener sentido.

```
┌─────────────────────────────────────────┐
│  Auto layout                        [≣] │
│  ─────────────────────────────────────  │
│  [→] [↓] [↻]        Gap:  [  8  ] [≡]  │
│  ─────────────────────────────────────  │
│  W: [  Hug  ▾]   H: [  Hug  ▾]        │
│  ─────────────────────────────────────  │
│  Padding: [  16  ] [  16  ]            │
│           [  10  ] [  10  ]            │
│  ─────────────────────────────────────  │
│  Alignment: [grid de 9 puntos]         │
└─────────────────────────────────────────┘
```

---

## 3. Dirección y flujo

### Los tres modos de dirección

**Horizontal (fila):** Los hijos se colocan uno al lado del otro, de izquierda a derecha. El gap es el espacio horizontal entre ellos. Es el modo para navbars, grupos de botones, filas de iconos, headers.

**Vertical (columna):** Los hijos se apilan de arriba hacia abajo. El gap es el espacio vertical entre ellos. Es el modo para listas, formularios, pantallas completas, cards con contenido apilado.

**Wrap:** Los hijos se organizan en fila pero cuando no caben más, pasan a la siguiente fila. Es el modo para tags, chips, galerías de items variables. Cubre esto en profundidad en la sección 7.

### La dirección define el eje principal y el secundario

Este concepto es clave y viene de Flexbox. En un Auto Layout horizontal:

- El **eje principal** es horizontal → el Gap actúa en este eje
- El **eje secundario** es vertical → la alineación de los hijos actúa en este eje

En un Auto Layout vertical:

- El **eje principal** es vertical → el Gap actúa en este eje
- El **eje secundario** es horizontal → la alineación de los hijos actúa en este eje

Entender esto hace que todas las demás propiedades tengan sentido.

### Canvas stacking order

Los hijos de un Auto Layout aparecen en el canvas en el orden del panel de capas: el primero en la lista es el que aparece primero en el flujo (izquierda en horizontal, arriba en vertical). Para reordenar los hijos, arrastrá las capas en el panel de layers — la posición en el canvas se actualiza automáticamente.

---

## 4. Spacing — Gap y Padding en profundidad

### Gap — el espacio entre hijos

El Gap es el espacio entre cada elemento hijo dentro del Auto Layout. Se aplica uniformemente entre todos los hijos.

**Gap fijo:** Un número específico. Todos los elementos mantienen exactamente esa distancia entre sí, sin importar cuánto cambie el contenido.

**Auto gap (Space between):** Los hijos se distribuyen para ocupar todo el espacio disponible del Frame, como `justify-content: space-between` en CSS. El gap resultante depende del tamaño del Frame y el tamaño de los hijos.

Cuándo usar cada uno:

- **Gap fijo** para la mayoría de los casos. Predecible, consistente, fácil de razonar.
- **Auto gap** para navbars donde querés que los items extremos toquen los bordes, para headers con logo a la izquierda y acciones a la derecha.

Para activar Auto gap: en el campo de Gap, cambiá el número a "Auto" haciendo click en el ícono de distribución que aparece al lado del campo.

### Padding — el espacio interno

El Padding es el espacio entre el borde del Frame y sus hijos. Es lo que da "respiración" al contenido.

Figma permite cuatro valores independientes:

- **Padding top**
- **Padding right**
- **Padding bottom**
- **Padding left**

En el panel, los valores se muestran como cuatro campos o como un campo único cuando todos son iguales. Podés hacer click en el ícono de "padding individual" para controlar cada lado por separado.

### La convención de padding en sistemas de diseño

Los valores de padding deben venir de una escala de espaciado definida, no ser valores arbitrarios. La escala más común basada en múltiplos de 4:

```
4px   → Espaciado mínimo, badges compactos
8px   → Espaciado pequeño, chips, tags
12px  → Espaciado medio-chico
16px  → Espaciado estándar, la mayoría de componentes
20px  → Espaciado medio-grande
24px  → Espaciado grande, cards
32px  → Espaciado muy grande, secciones
40px  → Espaciado extra, headers de sección
48px  → Espaciado máximo, pantallas
```

Usar valores fuera de la escala (por ejemplo 13px o 22px) casi siempre es un error de implementación. Si estás tentado a usar un valor fuera de escala, revisá si el diseño necesita ajuste o si la escala necesita un valor adicional.

### Padding asimétrico — cuándo y por qué

El padding asimétrico (valores distintos por lado) es legítimo y común:

**Padding vertical diferente al horizontal:** Botones típicamente tienen menos padding vertical que horizontal para verse bien. `padding: 10px 16px` es más natural que `padding: 16px 16px` para un botón.

**Padding con ícono:** Cuando un elemento tiene un ícono a la izquierda, a veces querés menos padding en el lado del ícono y más en el lado del texto. Aunque en la práctica esto suele resolverse mejor con la estructura interna.

**Padding de pantalla:** Las pantallas móviles típicamente tienen el mismo padding horizontal en ambos lados (16px o 24px) pero padding vertical diferente entre top y bottom.

---

## 5. Resizing — el corazón del sistema

### Los tres modos de resizing

Esta es la propiedad que más confunde y la más importante. Aplica tanto al Frame de Auto Layout como a cada hijo individual.

---

#### Fixed (Tamaño fijo)

El elemento tiene un tamaño específico en ese eje. No cambia independientemente de su contenido o de su padre.

**Cuándo usarlo en el Frame:** Cuando el elemento tiene un tamaño definido por el diseño y no debe cambiar. Una pantalla de 375px de ancho. Un sidebar de 280px. Un avatar de 40x40px.

**Cuándo usarlo en un hijo:** Cuando ese hijo específico siempre debe tener ese tamaño. Un ícono de 24px que siempre es 24px. Un thumbnail que siempre es 120x80px.

**El riesgo:** Si el contenido crece más que el tamaño fijo, el contenido se desborda o queda recortado. Siempre preguntate: ¿qué pasa si el contenido de este elemento cambia?

---

#### Hug (Abrazar el contenido)

El Frame se achica o agranda exactamente para envolver a sus hijos. El tamaño lo determina el contenido.

**Cuándo usarlo:** Botones, tags, chips, badges, tooltips, cualquier elemento que debe ajustarse a su contenido. Si el texto cambia, el elemento cambia con él.

**La regla de Hug:** Un Frame en Hug no puede tener hijos en Fill en ese mismo eje. Si el Frame "abraza" a sus hijos, no puede haber un hijo que diga "yo me estiro para llenar al padre" — es una contradicción lógica.

**Error común:** Poner Hug en el Frame y Fill en un hijo. Figma lo permite pero el resultado es impredecible. Si necesitás Fill en un hijo, el padre debe ser Fixed o Fill, no Hug.

---

#### Fill (Llenar el padre)

El elemento se estira para ocupar todo el espacio disponible del padre en ese eje, después de que los elementos Fixed y Hug ocupen su espacio.

**Cuándo usarlo:** Cuando querés que un elemento ocupe "todo el espacio que sobre". Una columna de contenido que debe ocupar el espacio entre el sidebar y el borde de la pantalla. Un campo de input que debe ocupar todo el ancho del formulario. El área de contenido de una pantalla que debe expandirse entre el header y el footer.

**Requisito:** Fill solo funciona si el padre tiene un tamaño definido (Fixed o Fill). Si el padre es Hug, Fill no tiene referencia de cuánto llenar.

**Fill en múltiples hijos:** Si hay dos hijos con Fill en el mismo eje, dividen el espacio disponible equitativamente. Para darle más espacio a uno que al otro, uno debe ser Fixed o Hug.

---

### La tabla de combinaciones más usadas

```
Padre Fixed + Hijo Hug     → El hijo se ajusta a su contenido, el padre no cambia
Padre Fixed + Hijo Fill    → El hijo llena al padre, ideal para columnas
Padre Fixed + Hijo Fixed   → Todo tiene tamaño fijo, uso para mockups estáticos
Padre Hug   + Hijo Hug     → Ambos se ajustan, se usa para contenedores dinámicos
Padre Hug   + Hijo Fill    → ❌ Contradicción, evitarlo
Padre Fill  + Hijo Fill    → Ambos llenan hacia arriba, se usa anidado
```

### Resizing en ambos ejes independientemente

El resizing W (ancho) y H (alto) son independientes. Un elemento puede ser:

- **Fixed W + Hug H:** Ancho fijo, alto que crece con el contenido. Ideal para cards de contenido que tienen ancho de columna pero texto variable.
- **Fill W + Fixed H:** Se estira horizontalmente pero mantiene altura fija. Ideal para separadores, banners.
- **Hug W + Hug H:** Se ajusta a su contenido en ambas dimensiones. Ideal para botones, tags.
- **Fill W + Fill H:** Llena el padre en ambas dimensiones. Ideal para el área de contenido principal.

---

## 6. Alineación dentro del Auto Layout

### Alineación en el eje secundario

La alineación controla cómo se posicionan los hijos en el **eje secundario** (el eje perpendicular a la dirección).

En un Auto Layout **horizontal** (hijos en fila), la alineación controla la posición vertical de los hijos:

- **Top:** Todos los hijos se alinean a la parte superior del Frame
- **Center:** Todos los hijos se centran verticalmente
- **Bottom:** Todos los hijos se alinean a la parte inferior

En un Auto Layout **vertical** (hijos en columna), la alineación controla la posición horizontal de los hijos:

- **Left:** Todos los hijos se alinean al borde izquierdo
- **Center:** Todos los hijos se centran horizontalmente
- **Right:** Todos los hijos se alinean al borde derecho

### La grilla de 9 puntos

En el panel de Auto Layout, la alineación se muestra como una grilla de 9 puntos que combina ambos ejes. Haciendo click en cada punto establecés la combinación de alineación.

```
[TL] [TC] [TR]    → Top Left / Top Center / Top Right
[ML] [MC] [MR]    → Middle Left / Middle Center / Middle Right
[BL] [BC] [BR]    → Bottom Left / Bottom Center / Bottom Right
```

Para la mayoría de los layouts, los puntos más usados son MC (centrado en ambos ejes) y ML/TL para alineación al inicio.

### Baseline alignment

Para texto con diferentes tamaños de fuente en la misma fila, la alineación Center a veces no es visualmente correcta. La alineación por **baseline** hace que todos los textos compartan la línea base tipográfica, que es visualmente más armonioso.

Figma tiene baseline alignment disponible como opción de alineación avanzada.

---

## 7. Wrap — el comportamiento tipo grid

### Qué es Wrap

Wrap activa cuando los hijos de un Auto Layout horizontal no caben en una sola fila — en vez de desbordar el Frame, pasan a la siguiente fila. El comportamiento es idéntico a `flex-wrap: wrap` en CSS.

Activación: en la dirección del Auto Layout, hay un tercer ícono después de horizontal y vertical que activa Wrap.

### Las propiedades adicionales de Wrap

Cuando Wrap está activo, aparecen propiedades adicionales:

**Horizontal gap:** El espacio entre elementos en la misma fila.

**Vertical gap:** El espacio entre filas. Puede ser diferente al gap horizontal.

**Horizontal alignment:** Cómo se distribuyen los elementos dentro de cada fila (left, center, right, space between).

**Vertical alignment:** Cómo se distribuyen las filas dentro del Frame (top, center, bottom, space between).

### Cuándo usar Wrap

**Tags y chips:** Una lista de tags que puede tener 2 o 20 items. Con Wrap, se acomodan automáticamente en múltiples filas según cuántos haya.

**Galerías de items:** Cards o thumbnails que se distribuyen en grilla responsive.

**Grupos de iconos:** Cuando no sabés cuántos iconos habrá o el espacio disponible varía.

### La limitación de Wrap

Wrap no crea una grilla perfecta con columnas alineadas. Si los elementos tienen anchos variables, las columnas no se alinean entre filas. Para una grilla con columnas perfectas, la solución correcta son múltiples Auto Layouts anidados con hijos en Fill, o usar el Grid Layout cuando sea relevante.

---

## 8. Absolute position — la excepción que confirma la regla

### Qué es

Absolute Position es una propiedad especial para hijos dentro de un Auto Layout. Cuando activás Absolute Position en un hijo, ese hijo sale del flujo normal del Auto Layout y puede posicionarse libremente dentro del Frame padre, sin afectar la posición de los demás hijos ni ser afectado por el Gap.

Activación: seleccioná un hijo dentro de un Auto Layout → en el panel derecho, sección "Auto layout" → ícono de `...` o el botón de Absolute position.

### Para qué sirve

**Badges de notificación:** Un número rojo encima de un ícono de campana. El badge no debe afectar el layout del ícono, solo se superpone encima.

**Íconos de estado:** Un checkmark o indicador de error que se superpone sobre otro elemento.

**Elementos flotantes:** Tooltips, popovers, cualquier elemento que existe "por encima" del flujo normal.

**Botones de cierre (X):** En cards o modales, el botón de cerrar generalmente está posicionado absolutamente en una esquina.

### Cómo funciona en práctica

Un hijo con Absolute Position usa las constraints del Frame para posicionarse, exactamente igual que en un Frame sin Auto Layout. Podés hacer que esté 8px desde el borde superior y 8px desde el borde derecho, y mantiene esa posición sin importar cómo cambie el contenido del Auto Layout.

### La regla: Absolute Position es la excepción

No conviertas elementos en Absolute Position para "liberarlos" del Auto Layout cuando el Auto Layout no se comporta como esperás. Si estás recurriendo a Absolute Position frecuentemente en un componente, es señal de que la estructura del Auto Layout necesita revisión.

El uso correcto es específico: elementos que visualmente deben superponerse al contenido, no participar del flujo.

---

## 9. Anidado — cómo se construyen layouts complejos

### El principio fundamental del anidado

Los layouts complejos no se construyen con un solo Auto Layout. Se construyen anidando múltiples Auto Layouts con diferentes configuraciones.

Cada nivel de anidado resuelve un problema de layout específico. El Auto Layout exterior organiza las secciones grandes. Los Auto Layouts interiores organizan el contenido de cada sección. Más adentro todavía, los componentes tienen sus propios Auto Layouts internos.

### Ejemplo: Una card de producto

```
Frame "Card" — Auto Layout Vertical, Hug H, Fixed W (320px)
│
├── Frame "Thumbnail" — Fixed 320x200px
│   └── Image (fill)
│
├── Frame "Content" — Auto Layout Vertical, Hug H, Fill W
│   Padding: 16px
│   Gap: 8px
│   │
│   ├── Frame "Header" — Auto Layout Horizontal, Hug H, Fill W
│   │   Gap: auto (space between)
│   │   │
│   │   ├── Text "Nombre del producto" — Fill W
│   │   └── Text "$99.90" — Hug W
│   │
│   ├── Text "Descripción breve" — Fill W (Auto Height)
│   │
│   └── Frame "Tags" — Auto Layout Horizontal, Hug H, Fill W, Wrap
│       Gap: 6px
│       ├── Component "Tag / Category"
│       └── Component "Tag / Sale"
│
└── Frame "Actions" — Auto Layout Horizontal, Hug H, Fill W
    Padding: 16px
    Gap: 8px
    │
    ├── Component "Button / Secondary" — Fill W
    └── Component "Button / Icon / Wishlist" — Fixed 40x40px
```

Este diseño maneja automáticamente:

- Textos de cualquier longitud
- Cualquier número de tags
- Precios de cualquier longitud
- Botones que se estiran apropiadamente

### El flujo de trabajo para layouts complejos

1. **Empezá por afuera.** El Frame contenedor más grande primero, definiendo su dirección y sizing.
2. **Avanzá hacia adentro.** Cada sección interna es un nuevo Frame con su propio Auto Layout.
3. **Los hijos Fill estiran hacia su padre.** Los hijos Hug se ajustan a su contenido.
4. **El Fixed está en los extremos.** Elementos con tamaño definido por el diseño.
5. **Probá cambiando contenido.** Hacé el texto más largo, agregá más items a una lista. Si algo se rompe, ese nivel necesita ajuste.

### Anidado horizontal dentro de vertical — el patrón más común

Un layout de pantalla típico es vertical (columnas de secciones). Dentro de cada sección puede haber layouts horizontales (filas de items). Dentro de los items puede haber layouts verticales de nuevo.

```
Pantalla — Vertical
  Header — Horizontal
    Logo
    Nav — Horizontal
    Acciones — Horizontal
  Hero — Vertical
    Título
    Subtítulo
    CTAs — Horizontal
  Features — Horizontal (o Wrap)
    Feature Card — Vertical (x3)
  Footer — Horizontal
```

Este patrón de alternancia vertical/horizontal es la base de casi cualquier layout de interfaz.

---

## 10. Auto Layout en Componentes

### Por qué los componentes necesitan Auto Layout

Un componente sin Auto Layout tiene tamaño fijo. Funciona bien si el contenido siempre es exactamente el mismo. Pero los componentes se usan en contextos variables: el botón tiene textos de diferentes longitudes, la card tiene títulos cortos o largos, el input tiene labels de diferentes tamaños.

Sin Auto Layout, cada variación de contenido rompe el componente. Con Auto Layout, el componente se adapta.

### La estructura ideal de un componente con Auto Layout

**El Frame principal del componente:** Generalmente Hug en ambos ejes (el componente se ajusta a su contenido) o Fixed W + Hug H (ancho definido, alto adaptable).

**Los hijos directos:** Mix de Fixed para elementos de tamaño definido (íconos, avatares) y Fill para elementos que deben ocupar el espacio disponible (texto, áreas de contenido).

**Las capas opcionales:** Usando Boolean Properties + Absolute Position o simplemente visibilidad, no dejando capas ocultas que ocupen espacio en el Auto Layout.

### El problema de las capas ocultas en Auto Layout

Este es uno de los errores más frecuentes en componentes: ocultar un elemento con el ojo del panel de capas, creyendo que "desaparece" del layout.

En un Auto Layout, una capa oculta **sigue ocupando espacio**. El gap y el posicionamiento actúan como si el elemento estuviera visible. Para hacer que un elemento "no exista" en el layout, debe ser removido o debe usarse una Boolean Property que controla visibilidad a nivel de sistema.

La solución correcta para elementos opcionales:

- Usar Boolean Properties del componente (se muestran u ocultan sin afectar el layout)
- O usar Absolute Position para elementos que se superponen (no participan del flujo)

### Componentes que crecen con el contenido

El patrón más poderoso: un componente que puede recibir cualquier cantidad de contenido y crearse correctamente.

Ejemplo — Lista de items en un formulario:

```
⚡ Form Section — Auto Layout Vertical, Hug H, Fixed W
  Frame "Header" — Auto Layout Horizontal, Fill W, Hug H
    Text "Título de sección" — Fill W
    Component "Icon / Info" — Fixed 20px
  Frame "Fields" — Auto Layout Vertical, Hug H, Fill W, Gap 12px
    ← Aquí van los componentes de input como Instances
  Frame "Actions" — Auto Layout Horizontal, Fill W, Hug H
    Component "Button / Secondary" — Hug
    Component "Button / Primary" — Hug
```

Al agregar más Instances de Input dentro de "Fields", el componente completo crece automáticamente. No hay nada que ajustar manualmente.

### Variantes con diferentes configuraciones de Auto Layout

Un Component Set puede tener variantes que usan diferentes configuraciones de Auto Layout. Por ejemplo:

- **Button / Icon Left:** Auto Layout Horizontal con el ícono antes del texto
- **Button / Icon Right:** Auto Layout Horizontal con el texto antes del ícono
- **Button / Icon Only:** Solo el ícono, el texto es una capa oculta

Cada variante puede tener su propia configuración de dirección, padding y gap sin problema.

---

## 11. Casos de uso reales

### Caso 1 — Botón con ícono opcional

El botón clásico que puede tener o no un ícono a la izquierda.

```
⚡ Button / Primary
Frame — Auto Layout Horizontal, Hug W, Fixed H (40px)
Padding: 10px top/bottom, 16px left/right
Gap: 8px
Alignment: Center vertical

  ├── ⚡ Icon (Boolean Property "Show icon")
  │   Fixed 20px × 20px
  └── T Label (Text Property "Label")
      Hug W
```

Cuando "Show icon" es false, el ícono desaparece del flujo y el botón se achica automáticamente. El padding y el gap manejan el espaciado sin intervención manual.

---

### Caso 2 — Navbar con logo y acciones en extremos

El header clásico con logo a la izquierda y acciones a la derecha.

```
Frame "Navbar" — Auto Layout Horizontal, Fill W, Fixed H (64px)
Padding: 0px vertical, 24px horizontal
Gap: Auto (Space between)
Alignment: Center vertical

  ├── ⚡ Logo — Hug W, Fixed H (32px)
  ├── Frame "Nav Links" — Auto Layout Horizontal, Hug W, Hug H
  │   Gap: 32px
  │   ├── T "Producto"
  │   ├── T "Precios"
  │   └── T "Blog"
  └── Frame "Actions" — Auto Layout Horizontal, Hug W, Hug H
      Gap: 8px
      ├── ⚡ Button / Ghost "Iniciar sesión"
      └── ⚡ Button / Primary "Registrarse"
```

Gap Auto distribuye el espacio entre Logo, Nav Links y Actions uniformemente. El Frame "Nav Links" y "Actions" son Hug para ajustarse a su contenido.

---

### Caso 3 — Input con label, campo y mensaje de error

Un input de formulario con todas sus partes, donde el mensaje de error aparece y desaparece sin romper el layout.

```
⚡ Input / Text
Frame — Auto Layout Vertical, Hug H, Fill W (o Fixed W)
Gap: 4px

  ├── T "Label" (Text Property)
  │   Fill W, Auto Height
  │
  ├── Frame "Field" — Auto Layout Horizontal, Fixed H (40px), Fill W
  │   Padding: 0px vertical, 12px horizontal
  │   Gap: 8px
  │   Border: 1px stroke
  │   │
  │   ├── ⚡ Icon / Left (Boolean Property "Show left icon")
  │   ├── T "Placeholder" (Text Property)
  │   │   Fill W
  │   └── ⚡ Icon / Right (Boolean Property "Show right icon")
  │
  └── T "Mensaje de error" (Boolean Property "Show error")
      Text Property "Error message"
      Fill W, Auto Height
      Color: Error red
```

Cuando "Show error" es false, el mensaje desaparece y el componente se achica. Cuando es true, el componente crece y muestra el mensaje. No hay nada que ajustar.

---

### Caso 4 — Lista de chips/tags con Wrap

Una sección de filtros con chips que hacen wrap cuando no caben en una fila.

```
Frame "Filters" — Auto Layout Horizontal, Hug H, Fill W
Wrap activado
Horizontal gap: 8px
Vertical gap: 8px

  ├── ⚡ Chip "Todos"
  ├── ⚡ Chip "Diseño"
  ├── ⚡ Chip "Desarrollo"
  ├── ⚡ Chip "Marketing"
  ├── ⚡ Chip "Producto"
  └── ⚡ Chip "Datos"
```

En pantallas anchas todos los chips caben en una fila. En pantallas angostas hacen wrap automáticamente a dos o tres filas.

---

### Caso 5 — Pantalla completa responsiva

Una pantalla de app móvil con header fijo, contenido scrolleable y footer fijo.

```
Frame "Screen / Home" — Auto Layout Vertical, Fixed W (375px), Fixed H (812px)
Gap: 0

  ├── Frame "Header" — Auto Layout Horizontal, Fill W, Fixed H (64px)
  │   (Hug en nada, Fixed en alto, Fill en ancho)
  │
  ├── Frame "Content" — Auto Layout Vertical, Fill W, Fill H
  │   Padding: 24px
  │   Gap: 16px
  │   Overflow: Scroll (en prototipo)
  │   │
  │   ├── Sección 1
  │   ├── Sección 2
  │   └── Sección 3
  │
  └── Frame "Footer / Nav" — Auto Layout Horizontal, Fill W, Fixed H (80px)
      (Tab bar de navegación)
```

Header y Footer son Fixed en altura, Fill en ancho. El Content es Fill en ambos ejes para ocupar todo el espacio restante.

---

## 12. Mejores prácticas y reglas de oro

### Regla 1 — Siempre nombrá los Frames de Auto Layout

Un Frame con Auto Layout tiene significado estructural. Debe tener un nombre que describa ese significado: "Header", "Content", "Actions", "Fields". Nunca "Frame 47".

---

### Regla 2 — Decidí el resizing antes de agregar contenido

Cuando creás un Frame de Auto Layout, lo primero que debería pasar después de activarlo es definir si es Fixed, Hug o Fill en cada eje. Si empezás a agregar contenido antes de definir esto, vas a terminar haciendo ajustes manuales constantemente.

---

### Regla 3 — Usá Hug para componentes, Fill para layouts

Los componentes (botones, inputs, cards) casi siempre deberían ser Hug — se ajustan a su contenido. Los Frames de layout (pantallas, secciones, columnas) casi siempre deberían ser Fill — llenan el espacio disponible. Esta regla simplifica el 90% de las decisiones de resizing.

---

### Regla 4 — Evitá el padding manual en hijos

Si estás seleccionando un hijo dentro de un Auto Layout y moviéndolo manualmente para darle "más espacio de un lado", estás haciendo algo mal. El espacio lo controla el padding del padre o el gap. Nunca muevas un hijo manualmente dentro de un Auto Layout.

---

### Regla 5 — Probá el componente con contenido extremo

Antes de dar por terminado un componente con Auto Layout, probalo con:

- Texto muy corto (1-2 palabras)
- Texto muy largo (que podría wrappear)
- Cero items en una lista
- Muchos items en una lista
- Boolean Properties activadas y desactivadas

Si algo se rompe con alguno de estos casos, la estructura necesita ajuste.

---

### Regla 6 — Usá Variables para los valores de spacing

Figma Variables permiten definir tokens de espaciado (`spacing/4`, `spacing/8`, `spacing/16`) y usarlos directamente en los campos de Gap y Padding. Cuando el equipo decide cambiar el espaciado base de 4px a 5px, el cambio se aplica en todo el sistema.

Sin Variables, cada valor de spacing es un número suelto que hay que buscar y cambiar manualmente.

---

### Regla 7 — Un Auto Layout por nivel de jerarquía

No intentes hacer que un solo Auto Layout maneje toda la complejidad de una pantalla. Cada nivel de jerarquía tiene su propio Auto Layout con su propia configuración. El anidado es la herramienta, no el enemigo.

---

### Regla 8 — Si necesitás Absolute Position frecuentemente, revisá la estructura

Absolute Position es para elementos que se superponen al flujo: badges, indicadores de estado, botones de cierre. Si estás usando Absolute Position para elementos que son parte del contenido normal, la estructura del Auto Layout necesita replantearse.

---

## 13. Errores más comunes

### Error 1 — Hug en el padre + Fill en el hijo

**El síntoma:** El hijo con Fill no se estira, queda en tamaño mínimo o el comportamiento es impredecible.

**La causa:** El padre en Hug no tiene referencia de tamaño para que el hijo "llene". Es una contradicción lógica.

**La solución:** Si necesitás Fill en un hijo, el padre debe ser Fixed o Fill (no Hug). Si necesitás que el padre se ajuste al contenido, los hijos deben ser Hug o Fixed, no Fill.

---

### Error 2 — Mover hijos manualmente dentro de un Auto Layout

**El síntoma:** El elemento está "en el lugar correcto" visualmente pero en el panel de posición tiene valores X/Y impredecibles. Cuando cambia el contenido, el elemento no se mueve correctamente.

**La causa:** Se arrastró el elemento dentro del Auto Layout en vez de controlar el spacing desde el padre.

**La solución:** El espaciado de los hijos se controla desde el padre (Gap, Padding). Nunca arrastres un hijo dentro de un Auto Layout. Si necesitás que un elemento esté en una posición específica independiente del flujo, usá Absolute Position.

---

### Error 3 — Ocultar capas con el ojo en lugar de Boolean Properties

**El síntoma:** El ícono está "oculto" pero sigue habiendo un espacio vacío donde debería estar.

**La causa:** La capa fue ocultada con el toggle de visibilidad del panel de capas. En Auto Layout, los elementos ocultos siguen participando del flujo.

**La solución:** Para elementos opcionales en componentes, usá Boolean Properties. Para elementos opcionales en pantallas, eliminalos del Auto Layout cuando no apliquen o usá Absolute Position si deben estar en el DOM pero invisibles.

---

### Error 4 — Auto Layout sin aplicar a componentes que se reusan

**El síntoma:** El componente se ve bien con el contenido de prueba pero cuando el texto cambia en la instancia, el Frame tiene tamaño fijo y el texto se sale o queda con espacio sobrante.

**La causa:** El componente fue diseñado con tamaños fijos sin Auto Layout.

**La solución:** Siempre aplicar Auto Layout a los componentes que van a tener contenido variable. Si el componente ya existe y tiene Instances, al agregar Auto Layout las Instances heredan el comportamiento nuevo.

---

### Error 5 — Gap 0 cuando debería ser Padding 0

**El síntoma:** Se quiere que no haya espacio entre los hijos, pero al poner Gap 0 el padding interno todavía da espacio.

**La causa:** Confusión entre Gap (espacio entre hijos) y Padding (espacio entre el borde del Frame y los hijos).

**La solución:** Son propiedades independientes. Gap controla el espacio entre elementos. Padding controla el espacio del borde hacia adentro. Para un Frame sin espacio interno de ningún tipo, tanto Gap como Padding deben ser 0.

---

### Error 6 — Frame con Auto Layout sobre elementos de tamaño inconsistente

**El síntoma:** Los elementos en una fila horizontal no se alinean bien verticalmente. Algunos parecen más altos o más bajos que otros.

**La causa:** Los elementos tienen alturas diferentes y la alineación del Auto Layout está en Top o Bottom en vez de Center.

**La solución:** Revisar la alineación del Auto Layout padre. Para filas de elementos mixtos, Center es casi siempre la opción correcta. Para casos específicos, Baseline alignment puede dar mejores resultados con textos de diferente tamaño.

---

## Referencia rápida

```
Activar Auto Layout        → Shift+A
Dirección Horizontal       → Panel Auto Layout → ícono →
Dirección Vertical         → Panel Auto Layout → ícono ↓
Wrap                       → Panel Auto Layout → ícono ↻
Gap fixed/auto             → Campo "Gap" en el panel
Padding uniforme           → Campo único de padding
Padding por lado           → Click en ícono de padding individual
Resizing Fixed             → Dropdown W o H → "Fixed"
Resizing Hug               → Dropdown W o H → "Hug contents"
Resizing Fill              → Dropdown W o H → "Fill container"
Absolute Position          → Seleccionar hijo → ícono en panel Auto Layout
Quitar Auto Layout         → Click derecho en el Frame → "Remove Auto Layout"
```

---

> **El aprendizaje definitivo:** Auto Layout no es una feature que se "usa cuando conviene". Es la forma correcta de construir en Figma. Un archivo donde el 90% de los frames tienen Auto Layout correctamente configurado es un archivo que puede cambiar, que puede escalar, y que el equipo de desarrollo puede implementar con fidelidad. Construir sin Auto Layout es construir sobre arena.

---

_Master Class — Auto Layout en Figma_
_Cubre Figma con Variables, Dev Mode y Component Properties_
