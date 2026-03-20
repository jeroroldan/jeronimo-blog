---
code: "figma alineacion y centrado"
description: "Resumen Completo - Alineación y Centrado en Figma"
pubDate: "Jun 20 2024"
heroImage: "../../assets/blog-placeholder-1.jpg"
---

# 🎯 Master Class: Alineación y Centrado en Figma

### La guía definitiva para que todo esté donde tiene que estar

---

> **Premisa:** La alineación no es estética. Es precisión. Un diseño mal alineado comunica descuido antes de que el usuario lea una sola palabra. Dominar la alineación en Figma es dominar el control total sobre el espacio.

---

## Tabla de Contenidos

1. [Cómo piensa Figma la alineación](#1-cómo-piensa-figma-la-alineación)
2. [La barra de alineación — cada botón explicado](#2-la-barra-de-alineación--cada-botón-explicado)
3. [Alinear respecto a qué — el contexto lo cambia todo](#3-alinear-respecto-a-qué--el-contexto-lo-cambia-todo)
4. [Centrado — los 6 casos que existen](#4-centrado--los-6-casos-que-existen)
5. [Distribución y espaciado uniforme](#5-distribución-y-espaciado-uniforme)
6. [Alineación dentro de Auto Layout](#6-alineación-dentro-de-auto-layout)
7. [Alineación con constraints](#7-alineación-con-constraints)
8. [Smart Animate y alineación en prototipos](#8-alineación-en-contextos-especiales)
9. [Alineación tipográfica](#9-alineación-tipográfica)
10. [Grillas y columnas como sistema de alineación](#10-grillas-y-columnas-como-sistema-de-alineación)
11. [Casos reales resueltos paso a paso](#11-casos-reales-resueltos-paso-a-paso)
12. [Reglas de oro y errores comunes](#12-reglas-de-oro-y-errores-comunes)

---

## 1. Cómo piensa Figma la alineación

### El modelo mental correcto

Alinear en Figma siempre es una relación entre dos cosas: **el elemento que movés** y **la referencia contra la que lo alineás**. Sin entender cuál es la referencia en cada momento, la alineación se vuelve impredecible.

Las referencias posibles son:

- La **selección** (el bounding box de todos los elementos seleccionados)
- El **Frame padre** (el contenedor donde vive el elemento)
- El **canvas** (cuando no hay padre)
- **Otro elemento específico** (con la técnica de key element)

Antes de hacer click en cualquier botón de alineación, preguntate: **¿respecto a qué quiero alinear esto?** Esa pregunta define el método correcto.

### Por qué la alineación visual a veces "miente"

Un elemento puede verse centrado visualmente pero tener sus coordenadas levemente descentradas. Esto pasa con:

- **Íconos con padding óptico:** Un ícono de flecha tiene masa visual a la derecha. Si lo centrás por coordenadas, se ve descentrado hacia la izquierda. La corrección es intencional y va contra las coordenadas exactas.
- **Tipografía con descenders:** Las letras con partes que bajan (g, j, p, q, y) hacen que el centro geométrico del texto no coincida con el centro óptico.
- **Formas asimétricas:** Un triángulo centrado por bounding box no se ve centrado visualmente.

La alineación perfecta en Figma es el punto de partida. El ajuste óptico de 1-2px es el punto de llegada.

### Las coordenadas X e Y en Figma

Figma usa un sistema de coordenadas donde:

- **X** aumenta hacia la derecha
- **Y** aumenta hacia abajo (al revés de la matemática, igual que CSS)
- El punto de referencia por defecto es la **esquina superior izquierda** del elemento

Cuando cambiás el punto de referencia en el panel (la grilla de 9 puntos arriba a la izquierda en el panel de diseño), cambiás desde qué punto se mide X e Y. Si ponés el punto de referencia en el centro, X e Y representan la posición del centro del elemento.

---

## 2. La barra de alineación — cada botón explicado

La barra de alineación aparece en el panel derecho cuando tenés uno o más elementos seleccionados. Son 6 botones de alineación y 2 de distribución.

```
[⬛←] [⬛↔] [→⬛]   [⬛↑] [⬛↕] [↓⬛]
Left   Ctr   Right   Top   Mid  Bottom

[↔↔↔]  [↕↕↕]
H.dist  V.dist
```

### Alinear al borde izquierdo

Mueve todos los elementos seleccionados para que sus bordes izquierdos coincidan con el borde izquierdo del elemento más a la izquierda de la selección.

Uso típico: una columna de labels donde todos deben empezar en el mismo punto X.

### Centrar horizontalmente

Mueve todos los elementos para que sus centros estén en el mismo punto X.

Uso típico: centrar un título respecto a una imagen, centrar un grupo de botones entre sí.

### Alinear al borde derecho

Todos los bordes derechos coinciden con el del elemento más a la derecha.

Uso típico: una columna de valores numéricos que deben terminar en el mismo punto X (como en una tabla de precios).

### Alinear al borde superior

Todos los bordes superiores coinciden con el del elemento más arriba.

Uso típico: una fila de cards de diferente altura donde los tops deben estar alineados.

### Centrar verticalmente

Todos los centros están en el mismo punto Y.

Uso típico: ícono y label en una fila, botones de diferente altura en una barra.

### Alinear al borde inferior

Todos los bordes inferiores coinciden con el del elemento más abajo.

Uso típico: elementos que deben "tocar el piso" juntos, como columnas de una comparación.

---

## 3. Alinear respecto a qué — el contexto lo cambia todo

Este es el concepto más importante y el que más confunde. El comportamiento de los botones de alineación **cambia completamente** dependiendo de cuántos elementos tenés seleccionados y si están dentro de un Frame.

### Caso A — Un solo elemento seleccionado

Con un solo elemento seleccionado, los botones de alineación alinean ese elemento **respecto a su Frame padre**.

Si el elemento está directamente en el canvas (sin Frame padre), se alinea respecto al canvas — lo cual raramente tiene el resultado esperado porque el canvas es infinito.

Esto significa: seleccioná un botón dentro de una card → click en "Centrar horizontalmente" → el botón se centra dentro de la card. No necesitás seleccionar la card también.

### Caso B — Múltiples elementos seleccionados (sin Frame compartido)

Con múltiples elementos seleccionados, los botones alinean todos los elementos **respecto al bounding box de la selección completa**.

El bounding box es el rectángulo imaginario más pequeño que engloba todos los elementos seleccionados. Los botones de alineación mueven todos los elementos para que queden dentro de ese rectángulo de la forma indicada.

### Caso C — Múltiples elementos dentro del mismo Frame padre

Cuando seleccionás múltiples hijos del mismo Frame, los botones alinean **respecto al Frame padre**, no respecto al bounding box de la selección.

Este comportamiento es el correcto para alinear elementos dentro de un contenedor: si seleccionás tres botones dentro de una toolbar y hacés "centrar verticalmente", los tres quedan centrados respecto a la toolbar.

### El truco del Key Element

Figma permite designar un elemento como referencia fija para la alineación. Se llama "Key Element" (o elemento ancla).

Cómo funciona: seleccioná múltiples elementos → hacé click **una vez más** en el elemento que querés usar como referencia → ese elemento se resalta con un borde más grueso → ahora los botones de alineación mueven todos los **otros** elementos para alinearse con ese.

Esto resuelve el problema de "quiero centrar estos 5 elementos respecto a este card específico sin moverlo".

### Seleccionar el Frame padre para alinear respecto a él

Si querés alinear elementos respecto a un Frame específico sin que ese Frame sea el padre directo, podés incluirlo en la selección y usarlo como Key Element.

Caso real: tenés un modal centrado en la pantalla y querés centrar un botón respecto al modal, no respecto a la pantalla completa. Seleccionás el botón y el Frame del modal → hacés click extra en el Frame del modal para que sea el Key Element → centrás.

---

## 4. Centrado — los 6 casos que existen

El centrado parece simple pero tiene variantes que requieren técnicas diferentes.

### Caso 1 — Centrar un elemento dentro de su Frame padre

**Situación:** Un ícono dentro de un botón, un título dentro de un header, cualquier elemento que debe estar en el medio de su contenedor.

**Método más rápido:** Seleccioná el elemento (solo ese) → click en "Centrar horizontalmente" y/o "Centrar verticalmente" en la barra de alineación. Como hay un solo elemento, se centra automáticamente respecto al padre.

**Método con Auto Layout:** Si el Frame padre tiene Auto Layout, la alineación se controla desde la grilla de 9 puntos del padre. Seleccioná el Frame padre → en el panel de Auto Layout → elegí el punto central de la grilla. Todos los hijos quedan centrados.

**Método manual (cuando lo anterior no funciona):** Seleccioná el elemento → en el panel derecho, ponés los valores de X e Y calculados. X = (ancho del padre - ancho del elemento) / 2. Y = (alto del padre - alto del elemento) / 2.

### Caso 2 — Centrar múltiples elementos entre sí

**Situación:** Tres botones que deben estar centrados verticalmente entre ellos aunque tengan diferentes alturas.

**Método:** Seleccioná todos → click en "Centrar verticalmente". Todos quedan con el mismo punto Y central. El bounding box de la selección es la referencia.

### Caso 3 — Centrar un elemento respecto a otro elemento específico (no su padre)

**Situación:** Querés centrar un label debajo de una imagen, y tanto el label como la imagen son hijos del mismo Frame pero no querés centrar el label respecto al Frame completo.

**Método con Key Element:** Seleccioná el label y la imagen → click extra en la imagen para hacerla Key Element → click en "Centrar horizontalmente". El label se mueve para quedar centrado respecto a la imagen. La imagen no se mueve.

### Caso 4 — Centrar en el canvas (sin Frame padre)

**Situación:** Querés centrar un Frame de pantalla en el canvas para que quede en el centro de tu vista.

**Método:** Seleccioná el Frame → `Shift+1` para que Figma haga zoom y centre la vista en ese elemento. Esto no mueve el elemento, mueve la vista.

Para mover el elemento al centro del canvas: no existe un "centro de canvas" porque el canvas es infinito. Lo que podés hacer es moverlo a la posición X:0 Y:0 manualmente, o usar Sections para organizar el canvas en zonas.

### Caso 5 — Centrar texto dentro de una forma irregular

**Situación:** Texto dentro de un círculo, dentro de un hexágono, dentro de cualquier forma que no sea un rectángulo.

**El problema:** Figma centra respecto al bounding box de la forma, que es siempre un rectángulo. Para un círculo esto funciona bien. Para un triángulo o forma asimétrica, el centro del bounding box no es el centro visual de la forma.

**Método:** Alineá respecto al bounding box y luego hacé ajuste óptico manual. No hay forma automatizada de centrar respecto al centroide de una forma irregular en Figma.

### Caso 6 — Centrar en pantalla completa (el caso más común en UI)

**Situación:** Un modal, un dialog, una notificación que debe estar centrada en la pantalla del dispositivo.

**Método con constraints:** El elemento debe estar dentro del Frame de la pantalla. Seleccioná el elemento → en el panel de Constraints → configurá "Center" tanto en horizontal como en vertical. Ahora si la pantalla cambia de tamaño, el elemento sigue centrado.

**Método con Auto Layout:** Si la pantalla tiene Auto Layout vertical con alineación central, cualquier hijo queda centrado horizontalmente automáticamente. Para centrado vertical necesitás que el hijo sea el único elemento o usar Absolute Position + constraints.

---

## 5. Distribución y espaciado uniforme

### Los botones de distribución

Los dos botones de distribución (horizontal y vertical) en la barra de alineación espacian los elementos seleccionados de forma que el gap entre cada par de elementos sea idéntico.

**Distribución horizontal:** Mantiene los elementos más a la izquierda y más a la derecha en su lugar. Mueve todos los del medio para que los espacios entre ellos sean iguales.

**Distribución vertical:** Igual pero en el eje vertical. Mantiene el más arriba y el más abajo, distribuye los del medio.

### Cuándo usar distribución vs Gap de Auto Layout

**Distribución (botones de barra):** Para elementos que ya están en el canvas y querés espaciar sin cambiar la estructura. Bueno para ajustes puntuales y mockups estáticos.

**Gap de Auto Layout:** La forma correcta para componentes y layouts que deben mantenerse con ese espaciado permanentemente. El gap se mantiene automáticamente cuando el contenido cambia.

Si estás usando distribución repetidamente en el mismo conjunto de elementos, es señal de que ese conjunto debería ser un Auto Layout.

### Tidy up — el comando que ordena todo

Cuando tenés múltiples elementos desordenados en el canvas y querés organizarlos rápidamente, el comando **Tidy up** hace dos cosas: alinea en grilla y distribuye el espaciado uniformemente.

Acceso: seleccioná los elementos → en la barra de alineación aparece el ícono de Tidy up (una grilla pequeña). O click derecho → "Tidy up".

Figma detecta si los elementos están más orientados en fila o en columna y los organiza acordemente.

---

## 6. Alineación dentro de Auto Layout

### La grilla de 9 puntos del Auto Layout

Cuando un Frame tiene Auto Layout, la alineación de sus hijos se controla desde la grilla de 9 puntos en el panel de Auto Layout del Frame padre (no desde la barra de alineación superior).

```
[↖] [↑] [↗]
[←] [·] [→]
[↙] [↓] [↘]
```

Esta grilla controla la alineación en el eje secundario (perpendicular a la dirección del flujo). En un Auto Layout horizontal, controla si los hijos se alinean al top, al middle o al bottom.

### Alineación individual de hijos

En Auto Layout, podés sobrescribir la alineación de un hijo específico para que se comporte diferente al resto. Esto se llama "align self".

Caso de uso: en una fila de elementos alineados al top, querés que el último elemento esté alineado al bottom. Seleccioná ese elemento → en el panel de Auto Layout del hijo (no del padre) → configurá la alineación individual.

### Space between dentro de Auto Layout

El Gap "Auto" (space between) en Auto Layout distribuye el espacio sobrante entre los hijos. Es el equivalente a `justify-content: space-between` en CSS.

Cuándo usarlo:

- Header con logo a la izquierda y acciones a la derecha
- Barra de tabs donde los items deben ocupar todo el ancho
- Footer con información distribuida

Cuándo NO usarlo:

- Grupos de botones relacionados (el espacio variable entre ellos es visualmente confuso)
- Listas de items que deben tener consistencia con otras listas
- Cualquier lugar donde el gap variable se vería extraño con pocos o muchos items

---

## 7. Alineación con constraints

### Qué son los constraints y por qué afectan la alineación

Los constraints definen cómo se comporta un elemento cuando su Frame padre cambia de tamaño. Son la forma de mantener la alineación de forma dinámica, no solo estática.

Un elemento centrado horizontalmente con el botón de alineación está centrado en ese momento. Si el Frame padre cambia de ancho, el elemento queda donde estaba — ya no está centrado. Los constraints resuelven esto.

### Configurar constraints para centrado permanente

Para que un elemento siempre esté centrado dentro de su padre:

**Centrado horizontal permanente:**
Seleccioná el elemento → en el panel derecho → sección Constraints → primer dropdown (horizontal) → "Center".
Ahora si el padre crece o se achica, el elemento siempre está centrado horizontalmente.

**Centrado vertical permanente:**
Mismo proceso → segundo dropdown (vertical) → "Center".

**Centrado en ambos ejes:**
Ambos dropdowns en "Center". El elemento siempre está en el centro geométrico del padre.

### Constraints vs Auto Layout — cuándo usar cada uno

| Situación                                        | Usar                              |
| ------------------------------------------------ | --------------------------------- |
| Elemento que siempre está en el centro del padre | Constraint Center                 |
| Modal centrado en pantalla                       | Constraint Center en ambos ejes   |
| Watermark en esquina específica                  | Constraint Bottom + Right         |
| Lista de items que crece                         | Auto Layout                       |
| Botón que se estira con el padre                 | Auto Layout + Fill                |
| Ícono que siempre está a 16px del borde derecho  | Constraint Right                  |
| Header que se estira con la pantalla             | Constraint Left + Right (escalar) |

### Los constraints en pantallas responsivas

Para diseñar pantallas que funcionen en múltiples tamaños, los constraints son la herramienta principal.

Elementos que deben estirarse horizontalmente (headers, footers, barras de input): **Left + Right**. El elemento mantiene su distancia a ambos bordes, entonces se estira.

Elementos que deben mantenerse en el centro: **Center horizontal + Center vertical** o **Center horizontal + Top** si tienen posición vertical fija.

Elementos que deben permanecer en una esquina: **Right + Bottom** para el botón flotante de la esquina inferior derecha, por ejemplo.

---

## 8. Alineación en contextos especiales

### Alinear elementos dentro de un grupo

Los grupos no tienen las mismas opciones que los Frames. Cuando alineás elementos dentro de un grupo, la referencia es el bounding box del grupo, no un contenedor fijo.

Esto puede causar comportamiento extraño: si alineás elementos al centro dentro de un grupo y luego el grupo cambia de tamaño porque moviste uno de sus hijos, el "centro" del grupo cambia.

La solución: convertí el Group en Frame (`Seleccioná el Group → click derecho → Frame selection`). Los Frames tienen tamaño fijo y la alineación es predecible.

### Alinear componentes que tienen padding interno

Un Component puede tener padding interno que hace que su "centro visual" no coincida con su "centro geométrico". Por ejemplo, un botón con padding de 16px a los lados tiene 16px extra de espacio en su bounding box.

Cuando alineás el bounding box del componente, estás alineando incluyendo ese padding. Esto está bien para la mayoría de los casos — el padding forma parte del componente.

Pero si necesitás alinear el contenido visual (no el bounding box), tenés que entrar al componente y alinear las capas internas.

### Alineación en prototipos y transiciones

La posición de los elementos en los frames afecta directamente cómo se ven las transiciones del prototipo. Smart Animate interpola la posición entre frames: si un elemento está a X:100 en el frame A y X:300 en el frame B, Smart Animate lo mueve suavemente de izquierda a derecha.

Para transiciones de entrada lateral, de expansión desde el centro, o de cualquier movimiento intencional: la alineación de los elementos en cada frame de la animación define el movimiento. Es diseño de animación usando alineación.

---

## 9. Alineación tipográfica

### Las cuatro alineaciones de texto y cuándo usar cada una

**Left (izquierda):** La opción por defecto y la más legible para la mayoría del texto en occidental. El ojo sigue el margen izquierdo consistente. Siempre es la primera opción para párrafos, labels, listas.

**Center:** Para títulos cortos, textos en cards, calls to action, cualquier texto que funciona como elemento aislado. Pierde legibilidad en más de 2-3 líneas porque el ojo no tiene dónde anclar al inicio de cada línea.

**Right (derecha):** Para valores numéricos en columnas (permite comparar las unidades fácilmente), para elementos en la parte derecha de un layout, para el texto de un botón secundario que se alinea con otro elemento a su izquierda.

**Justified:** Llena la línea de borde a borde. Crea un bloque de texto prolijo pero genera "ríos" de espacio blanco entre palabras que lo hacen difícil de leer. Evitarlo en interfaces digitales salvo casos muy específicos.

### Baseline alignment — alinear por la línea de base

Cuando tenés elementos de texto con diferentes tamaños en la misma fila (un título grande y una etiqueta pequeña, por ejemplo), la alineación por centro geométrico a veces no es visualmente correcta. Los elementos parecen desnivelados.

La alineación por baseline hace que todas las letras "se sienten" en la misma línea imaginaria, que es como el ojo humano percibe que están alineados.

En Figma, el baseline alignment está disponible como opción en Auto Layout y también podés simularlo manualmente ajustando la posición Y de cada elemento.

La regla: cuando mezclás tamaños de texto en la misma fila, siempre revisá si el resultado visual es mejor con center o con baseline.

### Texto y alineación óptica

La tipografía tiene "espacio óptico" que no aparece en las coordenadas pero que el ojo percibe.

**Mayúsculas vs minúsculas:** Una línea de mayúsculas en el mismo tamaño que una de minúsculas se ve más grande porque llena más espacio visual. Para que se vean del mismo "peso" visual, las mayúsculas necesitan ser ligeramente más chicas.

**Números vs letras:** Los números en muchas fuentes son más chicos que las mayúsculas del mismo tamaño. Alinear un número y una letra mayúscula por centro a veces necesita ajuste óptico.

**Signos de puntuación:** Los signos como comillas, guiones y puntos tienen poco peso visual. En texto centrado, una línea que empieza con comillas puede verse "descentrada" aunque esté perfectamente alineada. La corrección óptica es mover el texto 1-2px hacia la derecha.

---

## 10. Grillas y columnas como sistema de alineación

### Por qué las grillas no son decoración

Una grilla de diseño no es solo visual. Es el sistema de reglas que hace que todos los elementos de una interfaz estén alineados entre sí, no solo con su padre directo.

Sin grilla, cada diseñador del equipo toma decisiones diferentes sobre margenes, columnas y posicionamiento. El resultado es una interfaz con alineación inconsistente que parece descuidada aunque cada elemento individual esté "bien".

Con grilla, todos siguen las mismas reglas. Los elementos se alinean no solo localmente sino globalmente.

### Tipos de grilla en Figma

Configuración: seleccioná un Frame → panel derecho → sección "Layout grid" → click en `+`.

**Grid (cuadrícula uniforme):** Una grilla de cuadrados del mismo tamaño. Útil para iconografía y espaciado preciso. Menos útil para layouts de pantalla completa.

**Columns (columnas):** El sistema más usado para diseño web y móvil. Define el número de columnas, el gutter (espacio entre columnas) y el margen (espacio en los bordes). Los elementos del diseño se alinean a estas columnas.

**Rows (filas):** Igual que columnas pero horizontal. Útil para controlar la altura de las secciones y el ritmo vertical.

### La grilla de 12 columnas — por qué 12

La grilla de 12 columnas es el estándar de la industria para web porque 12 es divisible por 1, 2, 3, 4, 6 y 12. Esto permite layouts de 2 columnas iguales (6+6), 3 columnas (4+4+4), sidebar + contenido (3+9), y muchas otras combinaciones.

Configuración típica para web desktop:

- Columns: 12
- Margin: 80px (varía según el diseño)
- Gutter: 24px

Para móvil (375px de ancho):

- Columns: 4
- Margin: 16px
- Gutter: 16px

Para tablet (768px):

- Columns: 8
- Margin: 24px
- Gutter: 24px

### Cómo usar la grilla para alinear

El principio fundamental: **los bordes de los elementos se alinean a los bordes de las columnas, no al centro de las columnas.**

Un elemento que ocupa 3 columnas empieza en el borde izquierdo de la columna 1 y termina en el borde derecho de la columna 3. El gutter queda entre ese elemento y el siguiente.

Para alinear un elemento a la grilla en Figma: activá la grilla en el Frame → con "Snap to grid" activado (View → Snap to grid), los elementos se "imantarán" a la grilla al moverlos.

### Grillas anidadas

Las pantallas complejas a veces necesitan grillas anidadas: una grilla global para el layout de la pantalla y grillas locales dentro de secciones específicas.

Ejemplo: una pantalla con grilla de 12 columnas globales. Dentro de la sección de "Features", hay 3 cards. Cada card tiene su propia grilla interna de 4 columnas para organizar su contenido.

En Figma, podés aplicar grillas a cualquier Frame, no solo a la pantalla completa. Aplicá una grilla al Frame de la sección para que el contenido de esa sección tenga su propio sistema de alineación.

---

## 11. Casos reales resueltos paso a paso

### Caso 1 — Centrar un ícono dentro de un botón

**Situación:** Tenés un Frame de botón de 120×40px y un ícono SVG de 20×20px. Querés el ícono perfectamente centrado.

**Paso 1:** Asegurate de que el ícono está dentro del Frame del botón (es hijo directo).

**Paso 2:** Seleccioná solo el ícono (un solo elemento).

**Paso 3:** Click en "Centrar horizontalmente" en la barra de alineación. Como hay un solo elemento, se centra respecto al padre.

**Paso 4:** Click en "Centrar verticalmente".

**Resultado:** El ícono está en X: 50, Y: 10 (dentro del Frame de 120×40).

**Alternativa con valores manuales:** X = (120 - 20) / 2 = 50. Y = (40 - 20) / 2 = 10.

---

### Caso 2 — Alinear una fila de cards de diferente altura

**Situación:** Tres cards con contenido de texto variable tienen alturas diferentes (180px, 220px, 195px). Deben estar alineadas al top con el mismo gap entre ellas.

**Paso 1:** Seleccioná las tres cards.

**Paso 2:** Click en "Alinear al borde superior". Todas quedan con el mismo Y.

**Paso 3:** Click en "Distribución horizontal" para que los gaps sean iguales.

**Alternativa con Auto Layout (la forma correcta para el largo plazo):**
Creá un Frame padre con Auto Layout Horizontal, Gap fijo (por ejemplo 24px), y alineación Top. Mové las tres cards adentro. El espaciado y la alineación se mantienen automáticamente aunque el contenido cambie.

---

### Caso 3 — Modal centrado en la pantalla

**Situación:** Un Frame de pantalla de 375×812px. Un Frame de modal de 320×400px que debe estar centrado.

**Paso 1:** Asegurate de que el modal está dentro del Frame de la pantalla.

**Paso 2:** Seleccioná solo el modal.

**Paso 3:** Click en "Centrar horizontalmente" → el modal se centra en X.

**Paso 4:** Click en "Centrar verticalmente" → el modal se centra en Y.

**Paso 5:** Para que el centrado se mantenga si la pantalla cambia de tamaño, configurá Constraints → Center en ambos ejes.

**Verificación:** X del modal = (375 - 320) / 2 = 27.5. Y del modal = (812 - 400) / 2 = 206.

---

### Caso 4 — Lista de labels con valores alineados en columnas

**Situación:** Una lista de especificaciones técnicas con labels a la izquierda y valores a la derecha. Los labels deben estar alineados a la izquierda entre sí. Los valores deben estar alineados a la derecha entre sí. Cada par label-valor debe estar alineado verticalmente.

**Estructura recomendada:**

```
Frame "Specs" — Auto Layout Vertical, Gap 12px
  Frame "Row 1" — Auto Layout Horizontal, Fill W, Gap Auto
    Text "Procesador" — Hug, alineado Left
    Text "M3 Pro" — Hug, alineado Right
  Frame "Row 2" — Auto Layout Horizontal, Fill W, Gap Auto
    Text "RAM" — Hug
    Text "18 GB" — Hug
  Frame "Row 3" — Auto Layout Horizontal, Fill W, Gap Auto
    Text "Almacenamiento" — Hug
    Text "512 GB SSD" — Hug
```

El Gap Auto (space between) en cada Row hace que el label quede a la izquierda y el valor a la derecha automáticamente. Si el Frame padre cambia de ancho, los valores siguen a la derecha.

---

### Caso 5 — Nav con logo y links centrados y acciones a la derecha

**Situación:** Un navbar de ancho 100% con: logo a la izquierda, links de navegación centrados respecto a toda la barra, y botones de acción a la derecha.

Este caso es clásico y tiene una trampa: si ponés logo + links + acciones en un Auto Layout con space between, los links no quedan centrados en la barra, quedan en el centro del espacio entre el logo y las acciones (que no es el centro si el logo y las acciones tienen anchos diferentes).

**La solución correcta:**

```
Frame "Navbar" — Auto Layout Horizontal, Fill W, Fixed H 64px
Alignment: Center vertical
Padding: 0 24px

  ├── Frame "Logo" — Hug, Absolute Position si necesario
  │   o: Fill W con weight 1
  │
  ├── Frame "Links" — Auto Layout Horizontal, Hug, Gap 32px
  │   (centrado absolutamente en el Frame)
  │   Position: Absolute, Center H + Center V
  │
  └── Frame "Actions" — Auto Layout Horizontal, Hug, Gap 8px
```

Con los Links en Absolute Position + Center Horizontal, siempre quedan en el centro exacto de la navbar independientemente del ancho del Logo o las Actions. El Logo y las Actions quedan en sus bordes gracias al Auto Layout del padre.

---

### Caso 6 — Texto centrado debajo de un ícono

**Situación:** Un ícono de 48px con un label debajo. El ícono puede tener padding visual (el SVG tiene espacio en blanco alrededor del trazo). Querés que el label esté centrado bajo el ícono visual, no bajo el bounding box del SVG.

**Paso 1:** Creá un Frame con Auto Layout Vertical, Hug en ambos ejes, alineación Center H.

**Paso 2:** Agregá el ícono y el texto como hijos.

**Resultado:** El texto queda centrado respecto al bounding box del ícono. Si el ícono tiene padding interno uniforme, esto también es el centro visual. Si el ícono tiene padding asimétrico, necesitás ajuste óptico manual.

**Ajuste óptico:** Seleccioná el texto → cambiá su X manualmente en 1-3px hasta que visualmente se vea centrado. Este ajuste es intencional y correcto.

---

## 12. Reglas de oro y errores comunes

### Regla 1 — La referencia primero

Antes de hacer click en cualquier botón de alineación, siempre identificá mentalmente cuál es la referencia: ¿el padre, el bounding box de la selección, o un elemento específico? Sin esta pregunta, los resultados son impredecibles.

---

### Regla 2 — Un elemento seleccionado = alinea respecto al padre

Esta regla evita el 80% de la confusión con la barra de alineación. Si solo hay un elemento seleccionado, siempre se alinea respecto a su Frame padre. No necesitás seleccionar el padre también.

---

### Regla 3 — Constraints para alineación permanente, botones para alineación puntual

Los botones de alineación son una operación de una vez. Si el contenido cambia, la alineación se rompe. Los Constraints mantienen la alineación dinámicamente. Usá botones para ajustes, constraints para reglas permanentes.

---

### Regla 4 — La alineación correcta es la que se ve correcta, no la que está en las coordenadas

El ajuste óptico de 1-2px es legítimo y profesional. Si algo se ve descentrado aunque las coordenadas digan que está centrado, el ajuste óptico es la respuesta. No estás haciendo algo mal — estás refinando.

---

### Regla 5 — Si distribuís manualmente más de una vez, usá Auto Layout

Cada vez que usás los botones de distribución para espaciar elementos, te estás perdiendo la oportunidad de usar Auto Layout. La distribución manual se rompe cuando cambia el contenido. El Gap de Auto Layout no.

---

### Error 1 — Seleccionar el Frame padre para centrar un elemento

Seleccionás el elemento y su Frame padre juntos, hacés click en centrar, y el Frame padre se mueve también. La solución: seleccioná solo el elemento hijo. Se centra automáticamente respecto al padre sin que el padre se mueva.

---

### Error 2 — Alinear elementos en el canvas sin Frame padre

Elementos sueltos en el canvas se alinean respecto al bounding box de la selección, no respecto a ningún marco de referencia fijo. Si agregás otro elemento después, ya no está alineado con nada. Siempre trabajá dentro de Frames con propósito.

---

### Error 3 — Confundir alineación del texto con alineación de la capa

El texto puede estar alineado al centro dentro de su caja de texto (propiedad de text align) pero la caja de texto puede estar alineada a la izquierda dentro del Frame. Estas son dos alineaciones independientes. Verificá ambas cuando algo no se ve como esperás.

---

### Error 4 — Usar espacio entre como gap fijo

Space between (gap auto) distribuye el espacio disponible entre los hijos. Si agregás un hijo más, el espacio disponible se divide de otra forma y todo se reposiciona. Usarlo donde querés un espaciado consistente garantizado entre cada par de elementos es el error. Para eso, usá gap fijo.

---

### Error 5 — No usar la grilla

Diseñar sin grilla es posible pero cada elemento queda en posiciones arbitrarias que no guardan relación con los demás. Cuando el sistema de diseño tiene más de 3 pantallas, la falta de grilla se hace evidente en inconsistencias sutiles que son costosas de corregir.

Activá una grilla desde el primer Frame. Aunque no la veas constantemente, el hecho de que los elementos "snappeen" a ella mantiene la consistencia automáticamente.

---

## Referencia rápida de atajos

```
Centrar horizontalmente      → Botón de barra (no tiene atajo de teclado)
Centrar verticalmente        → Botón de barra
Alinear borde superior       → Botón de barra
Distribución uniforme        → Botón de barra
Snap to grid on/off          → View → Snap to grid
Snap to pixel                → View → Snap to pixel (siempre activado)
Mover en incrementos de 1px  → Flechas del teclado
Mover en incrementos de 10px → Shift + Flechas
Ver coordenadas exactas      → Panel derecho, campos X e Y
Cambiar punto de referencia  → Grilla de 9 puntos, arriba a la izquierda del panel
```

---

> **La alineación perfecta es invisible.** Cuando todo está bien alineado, el usuario no lo nota — simplemente todo se ve correcto y profesional. Cuando hay errores de alineación, aunque el usuario no pueda articular el problema, siente que algo está mal. Dominar la alineación en Figma es dominar esa sensación de precisión que separa el diseño amateur del profesional.

---

_Master Class — Alineación y Centrado en Figma_
_Cubre Figma con Auto Layout, Variables y Dev Mode_
