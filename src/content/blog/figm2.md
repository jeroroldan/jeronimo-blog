---
title: "Capas y Elementos de Figma"
code: "figm2"
description: "Resumen Completo - Conceptos Arquitectónicos de Laravel"
pubDate: "Jun 19 2024"
heroImage: "../../assets/blog-placeholder-1.jpg"
---

# 📐 Master Class: Capas y Elementos de Figma

### La guía definitiva para entender cómo se construye en Figma

---

> **Filosofía:** Figma no es solo una herramienta de diseño. Es un lenguaje. Cada tipo de capa tiene una semántica, un propósito y reglas propias. Dominarlas es la diferencia entre un archivo que escala y uno que se convierte en un caos de 200 capas sin nombre.

---

## Tabla de Contenidos

1. [Cómo Figma piensa el espacio](#1-cómo-figma-piensa-el-espacio)
2. [📐 Frame — El bloque fundamental](#2--frame--el-bloque-fundamental)
3. [📁 Group — El atajo que se convierte en trampa](#3--group--el-atajo-que-se-convierte-en-trampa)
4. [⚡ Component — El corazón del sistema de diseño](#4--component--el-corazón-del-sistema-de-diseño)
5. [◆ Instance — La copia inteligente](#5--instance--la-copia-inteligente)
6. [T Text — Tipografía como dato, no como decoración](#6-t-text--tipografía-como-dato-no-como-decoración)
7. [▭ Shape — La geometría base](#7--shape--la-geometría-base)
8. [🖼️ Image — Imágenes y fills visuales](#8-️-image--imágenes-y-fills-visuales)
9. [§ Section — Orden en el canvas](#9--section--orden-en-el-canvas)
10. [Jerarquía y naming — La disciplina que lo une todo](#10-jerarquía-y-naming--la-disciplina-que-lo-une-todo)
11. [Flujos reales — Cómo se combinan en la práctica](#11-flujos-reales--cómo-se-combinan-en-la-práctica)
12. [Errores comunes y cómo evitarlos](#12-errores-comunes-y-cómo-evitarlos)

---

## 1. Cómo Figma piensa el espacio

Antes de hablar de cada tipo de capa, hay un modelo mental que lo cambia todo: **Figma es un árbol, no un lienzo plano.**

Cada elemento que ves en el canvas es un nodo en ese árbol. Los nodos tienen padres e hijos. Lo que hagas con un padre afecta a sus hijos. Lo que hagas con un hijo puede o no afectar a su padre, dependiendo del tipo de elemento.

```
Canvas (infinito)
└── Section "Onboarding"
    ├── Frame "Screen / Login"
    │   ├── Frame "Header"
    │   │   ├── Image "Logo"
    │   │   └── Text "Bienvenido"
    │   ├── Component "Input / Email"
    │   ├── Component "Input / Password"
    │   └── Component "Button / Primary"
    └── Frame "Screen / Register"
        └── ...
```

Entender este árbol es entender Figma. Cuando algo no se mueve como esperás, cuando un resize rompe el layout, cuando los constraints no funcionan — casi siempre es un problema de árbol mal construido.

### La pregunta que siempre debés hacerte

Antes de crear cualquier capa, preguntate: **¿este elemento es un contenedor o un contenido?**

- Si va a contener otros elementos → Frame
- Si es un elemento final (texto, imagen, forma) → el tipo que corresponda
- Si se va a reusar en múltiples lugares → Component

Esta pregunta simple evita el 80% de los errores de estructura.

---

## 2. 📐 Frame — El bloque fundamental

### Qué es

El Frame es el elemento más importante de Figma. Es un contenedor rectangular que puede tener dimensiones fijas, comportamiento de resize, constraints para sus hijos, Auto Layout, clipping, y casi todo lo que necesitás para construir interfaces.

Pensalo como el equivalente a un `<div>` en HTML, pero con superpoderes de diseño.

### Por qué es tan importante

Todo en Figma vive dentro de un Frame. Las pantallas son Frames. Los componentes son Frames. Las secciones de una pantalla son Frames. Los botones, las cards, los modales — todos son Frames con contenido adentro.

Cuando entendés que el Frame es la unidad de construcción principal, dejás de tener miedo de anidar Frames dentro de Frames. Ese anidado es exactamente cómo se construyen layouts complejos.

### Cómo crear un Frame

- **Atajo:** `F` o `A` (de "Artboard")
- En la barra de herramientas, el ícono de Frame
- Seleccioná varios elementos y presioná `Cmd+Alt+G` (Mac) / `Ctrl+Alt+G` (PC) para envolverlos en un Frame

### Propiedades clave del Frame

**Clip content:** Cuando está activado, todo lo que salga del borde del Frame queda oculto. Fundamental para carruseles, imágenes con bordes redondeados, cualquier elemento que necesite overflow hidden. Cuando está desactivado, los hijos pueden "salirse" del Frame y seguir siendo visibles.

**Fill:** El Frame puede tener color de fondo, gradiente, o imagen como fill. No necesitás un rectángulo separado para el fondo.

**Stroke:** Borde propio. Tampoco necesitás una forma separada para el borde.

**Corner radius:** Bordes redondeados para el Frame completo. Podés redondear esquinas individuales haciendo click en el ícono de esquinas independientes.

**Auto Layout:** La propiedad más poderosa de los Frames. La cubre en profundidad más adelante.

### Frames y constraints

Los hijos de un Frame heredan las reglas de resize del Frame. Los **constraints** definen cómo se comporta cada hijo cuando el Frame padre cambia de tamaño.

Por defecto los hijos tienen constraint `Top Left`, lo que significa que mantienen su distancia al borde superior e izquierdo. Si el Frame crece hacia la derecha, el hijo no se mueve.

Las opciones son:

- **Left / Right / Top / Bottom:** El hijo mantiene distancia fija a ese borde
- **Center:** El hijo se mantiene centrado en ese eje
- **Left and Right / Top and Bottom:** El hijo se estira para mantener distancia a ambos lados
- **Scale:** El hijo escala proporcionalmente con el padre

Configurar bien los constraints desde el inicio ahorra horas de ajuste manual cuando cambian las dimensiones de una pantalla.

### Auto Layout — La revolución del Frame

Auto Layout convierte un Frame estático en un contenedor inteligente que organiza sus hijos automáticamente. Es el equivalente a Flexbox en CSS.

Activación: seleccioná un Frame y presioná `Shift+A`, o hacé click en el `+` junto a "Auto Layout" en el panel derecho.

**Dirección:** Los hijos se organizan horizontalmente (fila) o verticalmente (columna). También existe "Wrap" para comportamiento tipo grid.

**Gap:** Espacio entre los hijos. Podés definir un valor fijo o usar "Auto" para distribuirlos uniformemente.

**Padding:** Espacio interno entre el borde del Frame y sus hijos. Podés definirlo uniforme o con valores distintos para cada lado.

**Resizing del Frame:** Tres modos:

- **Fixed:** El Frame tiene tamaño fijo. El contenido puede sobresalir o quedar corto.
- **Hug:** El Frame abraza a sus hijos. Crece o se achica según el contenido. Ideal para botones, chips, tags.
- **Fill:** El Frame se estira para ocupar todo el espacio disponible del padre. Ideal para columnas en un layout.

**Resizing de los hijos:** Cada hijo dentro de un Auto Layout puede ser Fixed, Hug, o Fill en ambos ejes, independientemente.

### Cuándo usar Auto Layout vs constraints

| Situación                                                         | Recomendación         |
| ----------------------------------------------------------------- | --------------------- |
| Componentes que cambian de contenido (botones con texto variable) | Auto Layout           |
| Listas de items que pueden crecer                                 | Auto Layout           |
| Pantallas completas con secciones de tamaño fijo                  | Constraints           |
| Posicionamiento libre y creativo                                  | Constraints           |
| Componentes de librería reutilizables                             | Siempre Auto Layout   |
| Mockups estáticos rápidos                                         | Constraints está bien |

### Consejo de experto: Frame vs Frame de componente

Hay una diferencia sutil pero importante: un Frame normal y el Frame que forma la base de un Component se comportan igual, pero el Component agrega una capa de sincronización. No conviertas todo en Component por las dudas — los Frames simples son perfectos para estructuras de pantalla únicas.

---

## 3. 📁 Group — El atajo que se convierte en trampa

### Qué es

El Group (`Cmd+G` / `Ctrl+G`) agrupa elementos para moverlos juntos. A diferencia del Frame, un Group no tiene dimensiones propias — sus dimensiones son exactamente las del bounding box de sus contenidos. Si movés un hijo hacia afuera, el Group crece.

### El problema con los Groups

El Group parece conveniente pero tiene limitaciones importantes:

**Sin constraints:** Los hijos de un Group no pueden tener constraints individuales. Si el Group cambia de tamaño, todos los hijos escalan proporcionalmente o se comportan de forma impredecible.

**Sin Auto Layout:** No podés aplicar Auto Layout a un Group.

**Sin fill ni stroke propio:** Si necesitás un fondo detrás de los elementos agrupados, tenés que agregar un rectángulo separado al Group.

**Selección confusa:** Un click en un Group selecciona todo el Group. Para seleccionar un elemento dentro tenés que hacer doble click para "entrar" al Group. Esto es menos intuitivo que los Frames.

**Los bounds se mueven con el contenido:** Si renombrás el Group como si fuera un contenedor con posición semántica ("Header", "Footer"), esa posición no se mantiene si los hijos se mueven.

### Cuándo SÍ usar un Group

Los Groups tienen un caso de uso legítimo: **agrupar temporalmente elementos para moverlos o transformarlos juntos**, cuando esa agrupación no tiene significado semántico y no necesitás las propiedades de un Frame.

Ejemplos válidos:

- Agrupar los elementos de un ícono SVG para tratarlos como una unidad
- Agrupar decoraciones visuales que siempre se mueven juntas
- Durante exploración rápida donde no querés perder tiempo estructurando

### La regla práctica

Si tu primer instinto es crear un Group, preguntate: **¿necesito controlar el tamaño o el comportamiento de estos elementos como unidad?** Si la respuesta es sí, usá un Frame. Si solo querés moverlos juntos una vez, el Group está bien.

En un sistema de diseño maduro, los Groups casi desaparecen. Todo es Frame o Component.

---

## 4. ⚡ Component — El corazón del sistema de diseño

### Qué es

Un Component es un elemento de diseño que puede reutilizarse. Cuando modificás el Component principal (Main Component), todos los lugares donde se usa (Instances) se actualizan automáticamente.

Es la pieza que separa un archivo de diseño de un sistema de diseño.

### La metáfora correcta

Un Component es como una clase en programación orientada a objetos. El Main Component es la definición de la clase. Las Instances son los objetos instanciados. Modificar la clase cambia el comportamiento de todos los objetos. Podés sobreescribir propiedades en objetos individuales sin tocar la clase.

### Cómo crear un Component

- Seleccioná un Frame o elementos → `Cmd+Alt+K` (Mac) / `Ctrl+Alt+K` (PC)
- Click derecho → "Create component"
- En la barra de herramientas, el ícono de diamond

Al crear el Component, Figma convierte el Frame seleccionado en el Main Component y lo marca con el ícono ⚡.

### Component Properties — la evolución moderna

Figma introdujo Component Properties para hacer los componentes verdaderamente configurables sin necesidad de entrar a editarlos.

**Text Properties:** El texto de una capa puede exponerse como una propiedad editable. Cuando usás la Instance, podés cambiar ese texto desde el panel derecho sin hacer doble click.

**Boolean Properties:** Controlan la visibilidad de capas. Un ícono que aparece o desaparece, un badge que se activa o desactiva — esto es una Boolean Property.

**Variant Properties:** Definen variantes del componente. Un botón puede tener las variantes Primary, Secondary y Tertiary. Un input puede tener Default, Focus, Error y Disabled. Todas las variantes viven dentro de un Component Set.

**Instance Swap Properties:** Permiten cambiar una Instance anidada dentro del componente por otra Instance diferente. Ideal para íconos intercambiables dentro de un botón.

Para agregar propiedades: seleccioná el Main Component → panel derecho → sección "Component properties" → click en `+`.

### Component Sets y variantes

Cuando un componente tiene variantes, todas ellas viven dentro de un **Component Set** — un Frame especial con borde morado punteado.

La convención de naming para las propiedades es `Propiedad=Valor`. Por ejemplo:

- `Type=Primary`, `Type=Secondary`, `Type=Ghost`
- `State=Default`, `State=Hover`, `State=Disabled`
- `Size=Small`, `Size=Medium`, `Size=Large`

Figma detecta automáticamente cuando las propiedades tienen los mismos nombres en diferentes variantes y las organiza en una grilla de variantes interactiva.

### Dónde viven los Main Components

Los Main Components pueden vivir en cualquier parte del archivo, pero hay dos convenciones:

**En la misma página de diseño:** Cómodo para archivos pequeños. Se vuelve caótico cuando hay muchos componentes.

**En una página dedicada "Components" o "\_Base":** La práctica profesional. Los Main Components viven en una página separada (a veces prefijada con `_` para que aparezca al principio), y el diseño de pantallas usa solo Instances. Esto mantiene las páginas de diseño limpias.

**En un archivo de librería separado:** Para equipos y sistemas de diseño a escala. Los componentes viven en un archivo dedicado que se publica como librería compartida. Todos los archivos del equipo acceden a los mismos componentes.

### Consejo de experto: la estructura interna de un Component

Un Component bien construido tiene esta estructura:

```
⚡ Button / Primary / Default          ← Main Component
└── 📐 Frame (Auto Layout, horizontal)
    ├── ▭ Background                   ← Puede ser invisible, solo para el fill
    ├── 🖼️ Icon (Boolean Property)     ← Se muestra/oculta con una prop
    └── T Label (Text Property)        ← Texto editable como prop
```

Reglas para la estructura interna:

- El Main Component siempre tiene Auto Layout si el contenido puede cambiar
- Las capas importantes tienen nombres descriptivos, no "Frame 3" o "Rectangle 12"
- Los elementos opcionales son Boolean Properties, no están ocultos manualmente
- Los textos editables son Text Properties

---

## 5. ◆ Instance — La copia inteligente

### Qué es

Una Instance es una copia de un Component que permanece sincronizada con el Main Component. Es el `◆` que ves en el panel de capas.

Cuando arrastrás un Component desde el panel de Assets al canvas, creás una Instance. Cuando hacés `Cmd+D` en una Instance, creás otra Instance del mismo Main Component.

### Qué podés sobreescribir en una Instance

Por defecto, las Instances heredan todo del Main Component. Pero podés sobreescribir:

**Texto:** Podés cambiar el contenido de cualquier capa de texto dentro de la Instance. El cambio queda en esa Instance sin afectar al Main ni a otras Instances.

**Component Properties:** Cualquier propiedad que el Main Component exponga (Text, Boolean, Variant, Instance Swap) puede cambiarse en cada Instance individualmente.

**Fill de capas específicas:** Podés cambiar el color de un elemento dentro de la Instance. Útil para íconos que necesitan colores distintos en contextos diferentes.

**Visibilidad de capas:** Podés mostrar u ocultar capas dentro de la Instance.

**Lo que NO podés hacer:** Agregar o eliminar capas, cambiar la estructura, cambiar el tipo de elementos. Para eso tenés que editar el Main Component.

### Cómo navegar entre Instance y Main Component

- **Desde la Instance al Main:** Click derecho → "Go to main component", o `Cmd+Alt+B`
- **Desde el Main a todas sus Instances:** Click derecho en el Main → "Select all instances of main component"
- **Para editar el Main desde una Instance:** Hacé doble click en la Instance y vas a entrar al Main Component automáticamente

### Instance swap

Podés reemplazar la Instance que tiene un elemento por una Instance de otro Component. Esto es fundamental para patrones como "todos estos botones son del mismo tipo pero quiero cambiar uno a Ghost".

Método: con la Instance seleccionada, en el panel derecho bajo "Component" hay un buscador donde podés cambiar a qué Component apunta esa Instance.

### Overrides y cuándo resetearlos

Cuando sobreescribís propiedades en una Instance, esos cambios persisten incluso si el Main Component cambia. Si el Main cambia el texto por defecto, tu Instance mantiene su texto personalizado.

A veces querés volver al estado original. Click derecho en la Instance → "Reset all overrides" limpia todos los cambios. También podés resetear propiedades individuales.

### Detach Instance — y cuándo hacerlo

`Cmd+Alt+B` desconecta la Instance del Main Component. La Instance se convierte en un Frame normal independiente. Ya no se sincroniza con nada.

Cuándo hacerlo:

- Cuando necesitás una variación tan específica que no tiene sentido como variante del componente
- Para exploración rápida sin modificar el sistema
- Al exportar assets que necesitás totalmente independientes

Cuándo NO hacerlo:

- Para hacer cambios que deberían estar en todas las Instances → editá el Main
- Para hacer cambios que son variantes legítimas → agregalas como variante al Component Set
- Por comodidad o porque no sabés cómo modificar el Main → tomarte el tiempo de aprender cuesta menos que el caos que viene después

---

## 6. T Text — Tipografía como dato, no como decoración

### Qué es

Una capa de texto contiene tipografía editable. En Figma, el texto no es "dibujado" como en herramientas más antiguas — es texto real, con propiedades editables, que puede conectarse a estilos y variables.

### Propiedades tipográficas fundamentales

**Font family y weight:** La familia tipográfica y su peso (Regular, Medium, Bold, etc.). En equipos que usan Google Fonts, estas se cargan automáticamente si el sistema las tiene. Para fuentes personalizadas, todos los miembros del equipo necesitan tenerlas instaladas localmente.

**Size:** El tamaño en pixels. En sistemas de diseño bien estructurados, los tamaños de texto corresponden a una escala tipográfica definida: 12, 14, 16, 20, 24, 32, 40, 48 — no valores arbitrarios.

**Line height:** El espacio entre líneas. Puede ser un valor absoluto (px) o un multiplicador del tamaño de fuente (%). La práctica más robusta es usar porcentajes o valores "auto" para que escale con el tamaño.

**Letter spacing:** Espaciado entre caracteres. Se mide en porcentaje del tamaño de fuente. Valores muy pequeños (1-3%) para headings grandes crean elegancia; valores negativos (-1% a -3%) aprietan el texto y lo hace pesado.

**Text align:** Alineación horizontal (left, center, right, justified) y vertical dentro del bounding box de la capa.

**Decoration:** Subrayado y tachado. Disponibles pero usarlos directamente en capas de texto es frágil — mejor usar estilos de texto para esto.

### Los tres modos de resize de una capa de texto

Esta es una de las cosas más confusas para quienes empiezan:

**Auto width:** La caja crece horizontalmente según el contenido. Si escribís más texto, la caja se hace más ancha. La altura es siempre la de una línea. El texto nunca hace wrap.

**Auto height:** La caja tiene ancho fijo pero la altura crece según el contenido. Cuando el texto llena el ancho, hace wrap a la siguiente línea y la caja crece hacia abajo. Es el modo más común para párrafos.

**Fixed size:** Ancho y alto fijos. El texto hace wrap dentro del espacio disponible. Si el texto supera el espacio, queda recortado (pero visible en edición — puede generar confusión). Útil cuando necesitás que la caja no cambie de tamaño independientemente del contenido.

Para cambiar entre modos: seleccioná la capa de texto → en el panel derecho hay un ícono de "Text resizing" arriba del campo de texto.

### Estilos de texto — por qué son imprescindibles

Un estilo de texto es una combinación guardada de propiedades tipográficas (familia, tamaño, peso, altura de línea, etc.) que podés aplicar a cualquier capa de texto con un click.

Ventaja fundamental: si necesitás cambiar la fuente de todos los headings del proyecto, cambiás el estilo una vez y se actualiza en todas partes. Sin estilos, tendrías que cambiar cada capa individualmente.

Cómo crear un estilo: seleccioná una capa de texto con las propiedades que querés → en el panel derecho, junto a "Text" → click en el ícono de cuatro puntos → "+" para crear el estilo.

Convención de naming para estilos de texto:

```
Heading/H1
Heading/H2
Heading/H3
Body/Regular
Body/Bold
Body/Small
Caption/Regular
Caption/Bold
Label/Default
```

La barra `/` crea grupos en el panel de estilos, manteniendo todo organizado.

### Variables de texto — el siguiente nivel

Con Figma Variables podés conectar el contenido de una capa de texto a una variable de tipo String. Esto permite, por ejemplo, tener un componente con texto que cambia según el modo (idioma, tema, contexto) sin necesidad de crear variantes separadas.

### Consejo de experto: texto en componentes

Cuando un texto forma parte de un Component, siempre exponé su contenido como una **Text Property** del componente. Esto permite cambiar el texto desde el panel de la Instance sin tener que hacer doble click para "entrar" al componente. Para equipos donde los diseñadores no son los únicos que modifican los archivos, esto es la diferencia entre usabilidad y frustración.

---

## 7. ▭ Shape — La geometría base

### Qué es

Las shapes son elementos geométricos: rectángulos, elipses, polígonos, estrellas y vectores. Son la materia prima visual de Figma — los bloques con los que se construyen íconos, ilustraciones, decoraciones y elementos visuales complejos.

### Los tipos de shapes

**Rectangle (`R`):** El más común. Se usa para fondos, cards, separadores, elementos decorativos. Tiene la misma propiedad de corner radius que los Frames.

**Ellipse (`O`):** Círculos y elipses. Con `Shift` al dibujar creás un círculo perfecto. Tiene una propiedad de "arc" para crear sectores circulares (útil para gráficos de dona o progress circles).

**Polygon y Star:** Formas predefinidas con cantidad de lados configurable. El polígono puede ser triángulo, pentágono, hexágono. La estrella tiene control de "inner radius" para la profundidad de las puntas.

**Vector (`P` para Pen tool):** Formas dibujadas manualmente con el Pen tool. Ideal para íconos personalizados, ilustraciones, formas orgánicas. Los vectores tienen nodos editables — podés entrar en el modo de edición de vectores con `Enter` para mover nodos, cambiar el tipo de curva (corner, smooth, symmetric), y agregar o eliminar puntos.

**Line y Arrow:** Líneas con control de grosor, estilo (sólido, punteado, guiones), y caps (ninguno, flechas, círculos, cuadrados).

### Fill, stroke y efectos en shapes

**Fill:** Puede ser sólido (color plano), gradiente lineal, gradiente radial, gradiente angular, gradiente diamante, o imagen. Las shapes pueden tener múltiples fills apilados, con blend modes individuales para cada uno.

**Stroke:** Puede ser interior, exterior, o centrado. El tipo exterior es el más predecible porque no afecta las dimensiones de la shape.

**Efectos:** Drop shadow, inner shadow, layer blur, background blur. Los efectos se aplican al elemento completo. Para blur solo en parte de la interfaz, usá background blur en un Frame semitransparente.

### Boolean Operations — combinar shapes

Boolean Operations crean nuevas shapes combinando dos o más shapes existentes:

**Union:** Combina las areas de todas las shapes seleccionadas en una sola forma. El fill del resultado usa el del elemento más arriba en el stack.

**Subtract:** La shape de arriba "recorta" la shape de abajo. El resultado es la shape de abajo con un hueco en la forma de la de arriba.

**Intersect:** El resultado es solo el area donde las shapes se superponen.

**Exclude:** Lo opuesto a Intersect — mantiene todo excepto donde se superponen.

Acceso: seleccioná dos o más shapes → menú "Object" → Boolean Operations, o botones en la barra de herramientas superior.

Los Boolean Groups son no-destructivos: podés entrar al grupo y mover los elementos individuales para cambiar el resultado. Solo al "aplanar" (Flatten, `Cmd+E`) se convierte en un path único.

### Shapes vs Frames con fills

Una pregunta común: ¿cuándo uso un rectángulo y cuándo uso un Frame con fill de color?

**Usá una shape (Rectangle):**

- Para elementos puramente decorativos sin contenido
- Para íconos y elementos visuales complejos
- Cuando necesitás Boolean Operations
- Para separadores, líneas decorativas

**Usá un Frame con fill:**

- Para cualquier elemento que va a contener otros elementos
- Para fondos de secciones o cards
- Para elementos que van a tener Auto Layout
- Para cualquier elemento que sea parte de un componente interactivo

La regla es simple: si va a tener hijos, es un Frame. Si es él mismo el elemento final, puede ser una shape.

---

## 8. 🖼️ Image — Imágenes y fills visuales

### Cómo Figma maneja las imágenes

Las imágenes en Figma no son "objetos" independientes con su propio tipo de capa de la misma forma que las shapes. Técnicamente, una imagen es un **fill de tipo imagen** aplicado a cualquier forma (Rectángulo, Frame, elipse, etc.).

Cuando importás una imagen (arrastrando al canvas o con `Cmd+Shift+K`), Figma crea un Rectangle con esa imagen como fill. El panel de capas muestra el ícono 🖼️ para indicar que esa capa tiene un image fill.

### Modos de ajuste de imagen

Cuando la imagen no tiene las mismas proporciones que la forma que la contiene, Figma ofrece cuatro modos:

**Fill:** La imagen escala para cubrir completamente la forma, manteniendo proporciones. Puede recortar partes de la imagen. Es el modo más usado — equivale a `object-fit: cover` en CSS.

**Fit:** La imagen escala para que quepa completamente dentro de la forma, mostrando toda la imagen. Puede dejar espacio vacío en los lados. Equivale a `object-fit: contain`.

**Crop:** Te permite posicionar manualmente la imagen dentro de la forma, definiendo qué parte se muestra. Al hacer doble click en la imagen podés arrastrarla para elegir el encuadre.

**Tile:** Repite la imagen en mosaico. Útil para patterns y texturas.

### Imágenes en componentes — la práctica correcta

Cuando un componente tiene una imagen que cambia en cada instancia (por ejemplo, el avatar de un perfil de usuario o el thumbnail de una tarjeta de contenido), hay dos formas de manejarlo:

**Image como fill override:** La imagen es el fill de un Rectangle o Frame dentro del componente. En cada Instance podés cambiar el fill a una imagen diferente. Este es el enfoque simple y funciona bien para la mayoría de los casos.

**Instance Swap para imágenes:** Si las imágenes son parte de un set de assets controlados (íconos, banderas, ilustraciones del sistema), convertirlas en Components y usar Instance Swap da más control y consistencia.

### Optimización para handoff

Las imágenes grandes impactan el rendimiento del archivo de Figma y complican el handoff. Buenas prácticas:

- Importá imágenes al tamaño aproximado al que se van a usar, no a resolución máxima
- Para placeholders de contenido dinámico, usá un Rectangle con color plano y una etiqueta de texto que diga el tipo de imagen esperado
- Los assets reales de alta resolución van en los archivos de exportación, no en el archivo de diseño de trabajo

### Exportar imágenes

Figma puede exportar cualquier Frame, Component o Shape como imagen. Click derecho → "Export" o panel derecho → sección "Export".

Formatos disponibles: PNG, JPEG, SVG, PDF.

Para assets que van a desarrollo: marcalos para exportación en el panel "Export" y el equipo de desarrollo puede descargarlos todos de una vez desde el panel de inspector.

---

## 9. § Section — Orden en el canvas

### Qué es

Una Section es un contenedor organizacional del canvas. Se diferencia de todos los demás elementos en algo fundamental: **no afecta el diseño**. Sus elementos no son "hijos" en el sentido de herencia de propiedades. Una Section es solo una forma de organizar visualmente el canvas.

Creación: menú "Frame" en la barra de herramientas → Sections, o `Shift+S`.

### Para qué sirven

**Organización del canvas:** El canvas de Figma puede volverse infinitamente largo y confuso. Las Sections permiten delimitar áreas temáticas: "Onboarding", "Dashboard", "Settings", "Components", "Archive".

**Navegación rápida:** Las Sections aparecen en el panel de capas como bloques colapsables y en la navegación de páginas como marcadores. En archivos grandes con muchas pantallas, las Sections son esenciales para no perderse.

**Handoff estructurado:** Cuando el equipo de desarrollo accede al archivo en modo "View", las Sections funcionan como capítulos. Pueden navegar a "Flow de checkout" directamente sin scrollear por todo el canvas.

**Prototipado por flujos:** Podés nombrar las Sections según los flujos y mantener separadas las pantallas del flujo de registro, las del flujo de compra, las del flujo de configuración.

### Sections vs Frames — la confusión más común

La diferencia es conceptual y tiene consecuencias prácticas:

|                                | Frame            | Section          |
| ------------------------------ | ---------------- | ---------------- |
| Afecta el diseño               | ✅ Sí            | ❌ No            |
| Sus hijos heredan propiedades  | ✅ Sí            | ❌ No            |
| Aparece en el prototipo        | ✅ Sí            | ❌ No            |
| Se puede exportar              | ✅ Sí            | ❌ No            |
| Puede tener Auto Layout        | ✅ Sí            | ❌ No            |
| Visible para el dev en handoff | ✅ Como pantalla | ✅ Como marcador |
| Propósito                      | Diseño           | Organización     |

Si ponés una Section dentro de otra Section, solo obtenés organización anidada — ningún comportamiento de diseño. Si ponés un Frame dentro de una Section, el Frame sigue siendo un Frame normal.

### La convención de canvas para proyectos grandes

Para proyectos con muchas pantallas, esta estructura de canvas funciona muy bien:

```
§ _Components          ← Underscore para que aparezca primero
§ 00 / Design System   ← Tokens, colores, tipografía
§ 01 / Onboarding      ← Pantallas del flujo de onboarding
§ 02 / Home            ← Pantallas de home y dashboard
§ 03 / Settings        ← Pantallas de configuración
§ Archive              ← Explorations y versiones anteriores
```

---

## 10. Jerarquía y naming — La disciplina que lo une todo

### Por qué el naming importa tanto

Un archivo de Figma con capas sin nombre ("Frame 47", "Rectangle 12", "Group 8") es inmantenible. No podés comunicarle nada al equipo de desarrollo, no podés buscar elementos, no podés entender la estructura a simple vista.

El naming no es burocracia. Es documentación viva.

### La convención de naming con slash

La barra `/` en los nombres crea jerarquía en los paneles de Assets y Styles. Es la convención más adoptada en la industria:

```
Para Components:
Button/Primary/Default
Button/Primary/Hover
Button/Secondary/Default
Input/Text/Default
Input/Text/Error
Icon/Navigation/Home
Icon/Navigation/Settings

Para Styles:
Color/Brand/Primary
Color/Brand/Secondary
Color/Neutral/100
Color/Neutral/900
Color/Semantic/Success
Color/Semantic/Error

Para Text Styles:
Heading/Display
Heading/H1
Heading/H2
Body/Regular
Body/Bold
```

### Naming para capas de pantalla

Las capas de pantallas y secciones deben ser descriptivas y consistentes:

```
Screen / Login              ← Pantalla completa
Screen / Register
Screen / Dashboard / Home

Section / Header            ← Sección dentro de una pantalla
Section / Hero
Section / Features

Component / Card / Product  ← Componente dentro de la pantalla
Component / Button / CTA
```

### El system de naming para componentes internos

Dentro de un Component, las capas también deben nombrarse bien porque el equipo de desarrollo las ve en el handoff:

```
⚡ Card / Product
└── 📐 Container (el Frame principal con Auto Layout)
    ├── 🖼️ Thumbnail (la imagen)
    ├── 📐 Content (sección de texto)
    │   ├── T Title
    │   ├── T Description
    │   └── T Price
    └── 📐 Actions
        ├── ⚡ Button / Primary (Instance)
        └── ⚡ Icon / Wishlist (Instance)
```

---

## 11. Flujos reales — Cómo se combinan en la práctica

### Construir una pantalla desde cero

El proceso correcto cuando construís una pantalla nueva:

1. **Creá el Frame** de la pantalla con las dimensiones del dispositivo (`F` → elegir preset o dimensiones custom)
2. **Definí la estructura** con Frames anidados para las secciones principales (Header, Content, Footer)
3. **Aplicá Auto Layout** a los Frames que contienen listas o contenido variable
4. **Usá Instances** de tus componentes existentes para los elementos repetibles (botones, inputs, cards)
5. **Agregá texto** como capas independientes para los contenidos únicos de esa pantalla
6. **Ajustá constraints** en los elementos que necesitan comportamiento responsive
7. **Nombrá todo** antes de pasar al handoff

### El ciclo de vida de un Component

Los Components no nacen perfectos. El flujo natural es:

**Exploración:** Diseñás el elemento directamente en la pantalla sin convertirlo en componente todavía. Te importa la idea, no la estructura.

**Primera formalización:** Cuando estás satisfecho con el diseño, lo convertís en Component. En este punto se hace el trabajo de estructura: Auto Layout, capas bien nombradas.

**Parametrización:** Cuando lo usás en más de un contexto y empezás a necesitar variaciones, agregás Variants y Properties.

**Maduración:** Con el uso, el componente evoluciona. Se agregan variantes que no habías previsto, se refinan las propiedades, se optimiza la estructura interna.

### El problema del "todo es componente"

Existe la tentación de convertir todo en componente desde el primer momento. Resistila en etapas tempranas del diseño.

Los componentes tienen un costo: necesitan mantenimiento, documentación, y estructura pensada. Un componente mal diseñado que se usa en 50 lugares es peor que 50 frames independientes — si lo cambiás, rompe en 50 lugares.

La regla práctica: un elemento merece ser componente cuando se repite en 3 o más lugares, o cuando claramente va a repetirse en el futuro próximo.

---

## 12. Errores comunes y cómo evitarlos

### Error 1: Usar Groups cuando debería ser Frame

**El síntoma:** Las constraints no funcionan, el resize rompé el layout, no podés aplicar Auto Layout.

**La causa:** Se usó `Cmd+G` en vez de crear un Frame.

**La solución:** Seleccioná el Group → click derecho → "Frame selection" convierte el Group en Frame manteniendo los elementos dentro.

---

### Error 2: Capas sin nombre

**El síntoma:** El panel de capas muestra "Frame 12", "Rectangle 5", "Group 8", y nadie entiende qué es qué.

**La causa:** No se nombran las capas mientras se trabaja.

**La solución:** Doble click en la capa en el panel de layers para renombrar. Atajo: `Cmd+R` con la capa seleccionada. Construir el hábito de nombrar inmediatamente después de crear.

---

### Error 3: Detach de Instances por "comodidad"

**El síntoma:** Una Instance tiene un cambio específico, la solución rápida fue Detach. Ahora hay 15 versiones ligeramente distintas del mismo componente.

**La causa:** No se tomó el tiempo de entender cómo hacer el cambio en el Component o agregar una variante.

**La solución:** Antes de hacer Detach, preguntate si ese cambio debería ser una variante, una Property, o un override de fill. El Detach debería ser el último recurso.

---

### Error 4: Frames sin Auto Layout en componentes

**El síntoma:** El componente se ve bien con el texto de ejemplo pero se rompe cuando se cambia el texto a algo más largo o más corto.

**La causa:** El Frame interno del Component tiene tamaño fijo en vez de Hug.

**La solución:** Activar Auto Layout en el Frame del Component y configurar los hijos con los modos de resize correctos.

---

### Error 5: Imágenes sin el modo de ajuste correcto

**El síntoma:** Las imágenes se estiran, se distorsionan, o muestran partes indeseadas.

**La causa:** El modo de ajuste de la imagen no es el adecuado para ese contexto.

**La solución:** Seleccioná el fill de imagen → en el panel derecho cambiá el modo a "Fill" para la mayoría de los casos. Doble click en la capa para entrar al modo Crop y ajustar el encuadre manualmente.

---

### Error 6: Estructura plana de pantallas

**El síntoma:** Una pantalla es un Frame con 40 elementos directamente dentro, sin estructura jerárquica. Mover un elemento afecta todo, los constraints no funcionan bien.

**La causa:** Se fue agregando elementos sin pensar en la estructura.

**La solución:** Reorganizar la pantalla con Frames anidados que representen las secciones lógicas. Header, Content, Footer. Dentro del Content, secciones más pequeñas. Cada sección con Auto Layout cuando tiene sentido.

---

## Resumen rápido de referencia

| Elemento     | Atajo                | Cuándo usarlo                           |
| ------------ | -------------------- | --------------------------------------- |
| 📐 Frame     | `F`                  | Siempre que necesitás un contenedor     |
| 📁 Group     | `Cmd+G`              | Solo para agrupación temporal           |
| ⚡ Component | `Cmd+Alt+K`          | Elemento que se reutiliza en 3+ lugares |
| ◆ Instance   | Drag desde Assets    | Cada uso de un Component                |
| T Text       | `T`                  | Todo el texto editable                  |
| ▭ Rectangle  | `R`                  | Elementos visuales sin hijos            |
| ○ Ellipse    | `O`                  | Círculos y formas curvas                |
| 🖼️ Image     | Drag o `Cmd+Shift+K` | Imágenes como fill de una forma         |
| § Section    | `Shift+S`            | Organizar el canvas                     |

---

> **El principio final:** Un archivo de Figma bien estructurado es uno donde cualquier miembro del equipo puede navegar, entender y modificar sin preguntar. La estructura, el naming, y el uso correcto de cada tipo de elemento no son detalles — son la base sobre la que escala cualquier sistema de diseño.

---

_Master Class generada para equipos de diseño y producto._  
_Figma 2024-2026 — Variables, Dev Mode y Component Properties incluidos._
