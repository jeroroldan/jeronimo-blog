---
title: "figma"
description: "figma"
pubDate: 2026-03-12
code: "Figma"
image: "../../assets/blog-placeholder-1.jpg"
---

# Figma & UX — Masterclass: Componentes Select y Dropdown

> Guía completa para implementar la sección Sites con estados, variantes, Auto Layout, prototipos y handoff a Angular.

---

## Índice

1. [Paso a paso — implementación Sites](#1-paso-a-paso--implementación-sites)
2. [Estados de un campo de formulario](#2-estados-de-un-campo-de-formulario)
3. [Select nativo vs Dropdown custom](#3-select-nativo-vs-dropdown-custom)
4. [Auto Layout — el superpoder de Figma](#4-auto-layout--el-superpoder-de-figma)
5. [Componentes en Figma](#5-componentes-en-figma)
6. [Variants — un componente, muchos estados](#6-variants--un-componente-muchos-estados)
7. [Prototype — darle vida al diseño](#7-prototype--darle-vida-al-diseño)
8. [Reglas de negocio y annotations](#8-reglas-de-negocio-y-annotations)
9. [Del diseño a Angular](#9-del-diseño-a-angular)
10. [Checklist final de cierre](#10-checklist-final-de-cierre)
11. [Buenas prácticas de Figma](#11-buenas-prácticas-de-figma)

---

## 1. Paso a paso — implementación Sites

### Frames a crear

Partís de estos frames:

| Frame                    | ID                     | Descripción                      |
| ------------------------ | ---------------------- | -------------------------------- |
| Base                     | `2353:3131`            | Frame original sin modificar     |
| Recolección              | nuevo                  | Duplicado del base               |
| Recolección Domiciliaria | `5937:11123` (revisar) | Variante ya existente, ajustar   |
| Depósito / Descarga      | nuevo                  | Duplicado del base, sin selector |

### Paso 1 — Duplicar el frame base y crear 3 estados

1. Seleccioná el frame `2353:3131`
2. Duplicá con `Ctrl + D`
3. Renombrá cada copia con nombres funcionales:
   - `site_create_recoleccion`
   - `site_create_recoleccion_domiciliaria`
   - `site_create_deposito_descarga`

> **Principio:** Nombrá capas y frames con intención funcional. Nunca dejes nombres genéricos como `Frame 405`.

### Paso 2 — Armar el campo "Tecnología del sitio"

El label ya existe en `2353:3174`. Estructurá el campo así:

```
Auto Layout vertical
├── Label: "Tecnología del sitio"
└── Field (Auto Layout horizontal)
     ├── Texto: placeholder o valor seleccionado
     └── Ícono: ▼ (caret/dropdown)
```

Propiedades del Auto Layout:

- Dirección: vertical
- Gap label → field: 4px
- Padding interno del field: 8px horizontal, 10px vertical
- Misma altura que otros selects del formulario

### Paso 3 — Crear componente Select con variantes

```
Ctrl + Alt + K → Create component
```

Estructura de variantes mínimas:

| Variant          | Cuándo usarlo                      |
| ---------------- | ---------------------------------- |
| `state=default`  | Campo vacío, esperando interacción |
| `state=selected` | Valor elegido activo               |
| `state=disabled` | Campo visible pero no editable     |
| `state=error`    | Validación fallida                 |

> `state=hidden` no hace falta como variante — simplemente ocultá el bloque desde las capas.

### Paso 4 — Definir las opciones del selector

En la versión seleccionable (RECOLECCIÓN), mostrar exactamente:

- Tag RFID
- Sensor de Nivel
- N/A

### Paso 5 — Representar cada regla de negocio en una pantalla distinta

#### RECOLECCIÓN → `site_create_recoleccion`

- Selector visible y habilitado (`state=default`)
- Las 3 opciones disponibles para elegir
- `device_category_code` = valor elegido por usuario

#### RECOLECCIÓN DOMICILIARIA → `site_create_recoleccion_domiciliaria`

- Campo visible con label "Tecnología del sitio"
- Valor fijo: **Tag RFID**
- Estilo: `state=disabled` o `readonly` visual
- **No ocultar el dato** — el usuario necesita entender que el sistema lo fija automáticamente
- `device_category_code = TAG_RFID`

#### DEPÓSITO y DESCARGA → `site_create_deposito_descarga`

- **Remover el bloque completo** del formulario
- No dejar campo vacío ni disabled — si no aplica, no existe
- Reacomodar Auto Layout para que no queden huecos
- Agregar annotation para dev: `device_category_code = NULL`

### Paso 6 — Agregar annotations funcionales

Poné notas al costado del formulario o en una página `_specs`:

```
Si tipo = DEPÓSITO o DESCARGA   → device_category_code = NULL
Si tipo = RECOLECCIÓN DOM.      → device_category_code = TAG_RFID
Si tipo = RECOLECCIÓN           → usuario elige: Tag RFID | Sensor de Nivel | N/A
```

---

## 2. Estados de un campo de formulario

> **Analogía:** Pensá en un semáforo. El mismo objeto tiene 3 estados (rojo, amarillo, verde). El campo de formulario es el semáforo — los estados son su comportamiento en distintos momentos.

Todo input o select puede estar en uno de estos estados. Diseñar solo el `default` es como pintar solo el auto en reposo.

### Estados esenciales

| Estado     | Visual                                | Cuándo ocurre                          |
| ---------- | ------------------------------------- | -------------------------------------- |
| `default`  | Borde gris, placeholder               | Campo vacío, sin foco                  |
| `hover`    | Borde morado suave                    | Mouse encima                           |
| `focused`  | Borde morado sólido 2px               | Click o Tab activo                     |
| `selected` | Valor visible, borde morado           | Opción elegida                         |
| `disabled` | Fondo gris, texto apagado, ícono lock | Campo no editable                      |
| `readonly` | Similar a disabled visualmente        | Editable en DOM, bloqueado visualmente |
| `error`    | Borde rojo, mensaje de error abajo    | Validación fallida                     |

### Error común

Diseñar solo el estado `default` y dejar que desarrollo "lo imagine". El resultado: estados inconsistentes en producción.

### Consejo pro

En Figma: creá un componente por campo y usá **Variants** para cada estado. Así cambiás el estado desde el panel de propiedades sin tocar las capas individualmente.

---

## 3. Select nativo vs Dropdown custom

> **Analogía:** El select nativo es como una persiana del sistema operativo — el SO la controla, vos solo elegís cuándo abrirla. El dropdown custom es como construirte tu propia persiana — vos controlás todo, pero también sos responsable de que funcione bien.

Son dos cosas distintas. Confundirlas genera inconsistencias entre diseño y código.

### Comparación

|                    | Select nativo `<select>` | Dropdown custom        |
| ------------------ | ------------------------ | ---------------------- |
| Dibujado por       | El navegador / SO        | Vos (CSS + JS)         |
| Apertura           | Automática del sistema   | JS manual (open/close) |
| Accesibilidad      | Gratis                   | Hay que implementarla  |
| Estilización       | Muy limitada             | Control total          |
| Íconos en opciones | No                       | Sí                     |
| Búsqueda interna   | No nativo                | Sí, con JS             |
| Esfuerzo           | Bajo                     | Alto                   |

### Lo que diseñaste en Figma

Lo que tenés ahora se parece más a un **dropdown custom abierto** (menú contextual), no a un `<select>` cerrado. Eso no es malo — es una decisión de diseño. Pero implica que en código necesitás:

- Estado abierto / cerrado (`isOpen: boolean`)
- Evento click para abrir/cerrar
- Binding del valor seleccionado (`selectedValue`)
- Manejo de teclado para accesibilidad (Esc para cerrar, Enter para seleccionar)

### Recomendación para Angular

**Opción A — Simple:** Usar `<select>` nativo con estilos básicos. Rápido, accesible, menos control visual.

**Opción B — Recomendada:** Usar `mat-select` de Angular Material. Te da un dropdown custom ya accesible, con estados y animaciones. No construís nada desde cero.

```html
<mat-form-field>
  <mat-label>Tecnología del sitio</mat-label>
  <mat-select formControlName="deviceCategory">
    <mat-option value="TAG_RFID">Tag RFID</mat-option>
    <mat-option value="SENSOR_NIVEL">Sensor de Nivel</mat-option>
    <mat-option value="NA">N/A</mat-option>
  </mat-select>
</mat-form-field>
```

---

## 4. Auto Layout — el superpoder de Figma

> **Analogía:** Auto Layout es como CSS Flexbox. Cuando sacás un hijo del DOM, los otros se reacomodan solos. Sin Auto Layout en Figma es como tener elementos con `position: absolute` — al ocultar uno, el hueco permanece.

### El problema sin Auto Layout

```
Formulario sin Auto Layout:
[ Label ] [ Input ] [ Select ]   ← todo ok
[ Label ] [ Input ] [        ]   ← ocultás Select → hueco feo
```

### La solución con Auto Layout

```
Formulario con Auto Layout:
[ Label ] [ Input ] [ Select ]   ← todo ok
[ Label ] [ Input — se expande ] ← ocultás Select → se reacomoda solo
```

### Cómo activarlo

1. Seleccioná el frame del formulario
2. `Shift + A` para activar Auto Layout
3. Configurá dirección: **vertical** (columna)
4. Gap entre campos: **16px**
5. Para ocultar un campo: seleccionalo → clic derecho → **"Remove from layout"** (o usá el ojo de visibilidad con Auto Layout activado)

### Regla de oro

> Todo contenedor que pueda perder o ganar hijos necesita Auto Layout. Si algo puede quedar vacío o con elementos variables, **siempre Auto Layout**.

### En tu caso Sites

El bloque "Tecnología del sitio" necesita Auto Layout vertical internamente (label + field). Y el formulario contenedor también necesita Auto Layout para que al remover ese bloque en DEPÓSITO/DESCARGA, los campos de abajo suban automáticamente.

---

## 5. Componentes en Figma

> **Analogía:** Un componente es el molde de una galletita. Cada vez que lo usás, creás una galletita (instancia). Si cambiás el molde (componente principal), todas las galletitas existentes se actualizan. Si le ponés chips de chocolate solo a una galletita (override), esa cambia sin afectar al molde.

### Crear un componente

```
Seleccioná el elemento → Ctrl + Alt + K
```

Aparece el ícono de diamante relleno en el panel de capas. Las instancias tienen el diamante hueco.

### Estructura recomendada para Select

```
Select/                          ← Componente principal
  ├── Label (texto)
  ├── Field/ (Auto Layout horizontal)
  │    ├── Value text (placeholder o valor)
  │    └── Caret icon (▼)
  └── Error message (opcional, oculto por default)
```

### Instanciar el componente

- Desde el panel **Assets** (Ctrl + P → buscar "Select")
- O arrastrando desde la página de componentes
- O `Ctrl + D` sobre una instancia ya colocada

### Overrides permitidos

Podés cambiar en cada instancia sin romper el componente:

- Texto del label
- Texto del valor / placeholder
- Estado (via Variants)
- Visibilidad de sub-capas

### Trampa frecuente

Nunca edites el componente principal desde una instancia. Siempre hacelo desde la página de componentes. Los cambios en instancias son overrides locales.

---

## 6. Variants — un componente, muchos estados

> **Analogía:** Pensá en una lámpara inteligente. Es la misma lámpara, pero puede estar: apagada, encendida, parpadeando o en modo nocturno. En Figma: mismo componente, distintas variants.

Las variants son como los parámetros de una función. El componente `Select` acepta `state=default`, `state=disabled`, `state=error`… y devuelve la visualización correcta.

### Cómo crear variants

1. Teniendo el componente creado: clic en **"Add variant"** en el panel de propiedades
2. Figma crea una copia dentro del Component Set (el marco morado con línea punteada)
3. Renombrá la propiedad: **State**
4. Definí los valores: `Default`, `Selected`, `Disabled`, `Error`
5. Modificá visualmente cada variante — color de borde, fondo, ícono de lock, etc.
6. En las pantallas, cambiás el estado desde el panel lateral → propiedad "State"

### Variants para tu caso Sites

| Variant          | Frame donde se usa        | Configuración visual                     |
| ---------------- | ------------------------- | ---------------------------------------- |
| `state=default`  | RECOLECCIÓN               | Borde gris, placeholder, caret ▼         |
| `state=selected` | RECOLECCIÓN (con valor)   | Borde morado, valor visible              |
| `state=disabled` | RECOLECCIÓN DOMICILIARIA  | Fondo gris, valor "Tag RFID", ícono lock |
| `state=error`    | Cualquiera con validación | Borde rojo, mensaje de error             |

DEPÓSITO/DESCARGA: el componente directamente no aparece en el frame.

### Propiedades adicionales útiles

Podés agregar más propiedades además de `State`:

```
State: Default | Selected | Disabled | Error
Size: Small | Medium | Large
HasError: True | False
```

---

## 7. Prototype — darle vida al diseño

> **Analogía:** Hacer un prototipo en Figma es como hacer un libro de "elige tu propia aventura". Cada página (frame) tiene decisiones (clicks), y según lo que elegís, saltás a otra página. No hay lógica real — solo navegación entre páginas prediseñadas.

### Flujo básico: select abre dropdown

```
[site_create — Select cerrado]
        ↓ On Click → Smart Animate 200ms
[site_create — Select abierto]
        ↓ On Click (opción elegida) → Smart Animate 150ms
[site_create — Valor elegido visible]
```

### Pasos en Figma

1. Pestaña **Prototype** en el panel derecho
2. Seleccioná el trigger (el select cerrado)
3. Arrastrá la flecha azul al frame destino (select abierto)
4. Configurar:
   - Trigger: **On Click**
   - Action: **Navigate to**
   - Animation: **Smart Animate**
   - Duration: **200ms**
   - Easing: **Ease Out**
5. Para cerrar: en el frame "abierto", conectá click en fondo o en opción → **Navigate back**
6. Presentá con `Ctrl + P` y probalo como usuario

### Overlay vs Navigate

| Técnica          | Cuándo usarla              | Resultado                     |
| ---------------- | -------------------------- | ----------------------------- |
| **Navigate to**  | Flujo completo de pantalla | Reemplaza el frame actual     |
| **Open overlay** | Dropdown, modal, tooltip   | Flota encima del frame actual |

> Para simular un select real, usá **Open Overlay**. El dropdown flotará sobre el formulario sin reemplazarlo — comportamiento idéntico al real.

### Prototipo de tipo de sitio

Si querés simular el cambio dinámico según el tipo elegido:

```
[Frame: Tipo = Recolección] ←→ clic en "Tipo de sitio" ←→ [Frame: Tipo = Depósito]
```

Creá un frame por cada combinación posible y conectalos con los triggers correctos.

---

## 8. Reglas de negocio y annotations

> **Analogía:** Un plano de arquitectura no solo muestra el dibujo — tiene acotaciones, notas de materiales y especificaciones técnicas. Las annotations en Figma son exactamente eso: las notas del plano.

### Tabla de reglas — Sites

| Tipo de sitio            | `device_category_code`    | Campo "Tecnología del sitio"      |
| ------------------------ | ------------------------- | --------------------------------- |
| Recolección              | valor elegido por usuario | Editable — 3 opciones disponibles |
| Recolección Domiciliaria | `TAG_RFID`                | Visible, read-only, valor fijo    |
| Depósito                 | `NULL`                    | No aparece en el formulario       |
| Descarga                 | `NULL`                    | No aparece en el formulario       |

### Cómo poner annotations en Figma

**Opción A — Página de specs**

Creá una página llamada `_specs` o `_annotations` en el archivo. Copiá los frames ahí y agregá notas al costado.

**Opción B — Frame lateral**

En la misma página del diseño, agregá un frame `[ANNOTATIONS]` a la derecha. Usá líneas punteadas conectando la nota con el elemento afectado.

**Opción C — Plugin**

Usá el plugin oficial **Figma Annotations** (gratuito) que genera notas numeradas con formato estándar.

### Convención de color para annotations

| Color                | Uso                                  |
| -------------------- | ------------------------------------ |
| Amarillo `#FAEEDA`   | Nota de comportamiento               |
| Rojo suave `#FCEBEB` | Restricción o regla crítica          |
| Gris `#F1EFE8`       | Referencia técnica o valor de código |

> Nunca uses los mismos colores que la UI para las annotations — tienen que distinguirse inmediatamente.

### Texto exacto de annotations para Sites

```
[RECOLECCIÓN]
device_category_code = valor seleccionado por usuario
opciones: TAG_RFID | SENSOR_NIVEL | NA

[RECOLECCIÓN DOMICILIARIA]
device_category_code = TAG_RFID (fijo, sistema)
campo visible en modo readonly — no editable

[DEPÓSITO / DESCARGA]
device_category_code = NULL
campo "Tecnología del sitio" no se renderiza
```

---

## 9. Del diseño a Angular

> **Analogía:** El diseño en Figma es como el guion de una película. Angular es la filmación. Si el guion dice "el actor entra y la puerta se cierra sola", el director sabe exactamente qué tiene que grabar. Sin buen guion, el director improvisa — y a veces mal.

### Traducción Figma → Angular Material

| Diseño (Figma)   | Código (Angular)                              |
| ---------------- | --------------------------------------------- |
| `state=default`  | sin atributos adicionales                     |
| `state=disabled` | `[disabled]="true"` o `formControl.disable()` |
| `state=readonly` | `[readonly]="true"`                           |
| `state=error`    | `mat-error` + validador en el FormControl     |
| dropdown abierto | `mat-select` (maneja apertura solo)           |
| campo oculto     | `*ngIf="showField"`                           |

### Diferencia crítica: disabled vs readonly

|               | `disabled`              | `readonly`            |
| ------------- | ----------------------- | --------------------- |
| Visual        | Campo bloqueado, gris   | Campo bloqueado, gris |
| Valor en form | **NO se envía**         | **SÍ se envía**       |
| En Angular    | `formControl.disable()` | `[readonly]="true"`   |

> **Para Recolección Domiciliaria usá `readonly`, no `disabled`.** El valor `TAG_RFID` tiene que viajar en el payload del formulario. Con `disabled`, el campo queda excluido del submit.

### Implementación completa

```typescript
// component.ts
export class SiteCreateComponent {
  form = this.fb.group({
    siteType: [""],
    deviceCategory: [""],
  });

  showDeviceField = true;

  onSiteTypeChange(type: string) {
    const deviceControl = this.form.get("deviceCategory");

    if (type === "RECOLECCION") {
      this.showDeviceField = true;
      deviceControl.enable();
      deviceControl.setValue(null);
    }

    if (type === "RECOLECCION_DOMICILIARIA") {
      this.showDeviceField = true;
      deviceControl.setValue("TAG_RFID");
      // No usar .disable() — el valor debe enviarse
    }

    if (type === "DEPOSITO" || type === "DESCARGA") {
      this.showDeviceField = false;
      deviceControl.setValue(null);
    }
  }
}
```

```html
<!-- component.html -->
<mat-form-field *ngIf="showDeviceField">
  <mat-label>Tecnología del sitio</mat-label>
  <mat-select
    formControlName="deviceCategory"
    [disabled]="form.get('siteType').value === 'RECOLECCION_DOMICILIARIA'"
  >
    <mat-option value="TAG_RFID">Tag RFID</mat-option>
    <mat-option value="SENSOR_NIVEL">Sensor de Nivel</mat-option>
    <mat-option value="NA">N/A</mat-option>
  </mat-select>
  <mat-error>Este campo es obligatorio</mat-error>
</mat-form-field>
```

> Nota: Si usás reactive forms, la forma más correcta para el readonly es manejar el estado con `FormControl` directamente y agregar estilos CSS al estado disabled del mat-select. Evaluá según la arquitectura del proyecto.

---

## 10. Checklist final de cierre

Antes de dar por cerrado el trabajo en Figma, verificá:

### Frames y estados

- [ ] Frame `site_create_recoleccion` creado desde base `2353:3131`
- [ ] Frame `site_create_recoleccion_domiciliaria` creado y ajustado
- [ ] Frame `site_create_deposito_descarga` creado desde base `2353:3131`
- [ ] Los 3 frames tienen nombres funcionales explícitos

### Campo "Tecnología del sitio"

- [ ] Componente Select creado con `Ctrl + Alt + K`
- [ ] Variante `state=default` definida
- [ ] Variante `state=selected` definida
- [ ] Variante `state=disabled` definida
- [ ] Auto Layout vertical en el bloque label + field
- [ ] Mismo alto y padding que otros selects del formulario

### Comportamiento por frame

- [ ] RECOLECCIÓN: selector habilitado, 3 opciones visibles
- [ ] RECOLECCIÓN DOMICILIARIA: valor "Tag RFID" fijo, estilo disabled/readonly
- [ ] DEPÓSITO/DESCARGA: bloque de tecnología removido del formulario
- [ ] Auto Layout reacomodado en DEPÓSITO/DESCARGA sin huecos

### Documentación

- [ ] Annotation con `device_category_code` para cada tipo de sitio
- [ ] Capas nombradas con intención funcional (sin "Frame 405" o similares)
- [ ] Consistencia visual con el resto del CRUD (tipografía, bordes, padding)

---

## 11. Buenas prácticas de Figma

### Nomenclatura de capas

```
✗ Frame 405
✗ Group 12
✗ Rectangle

✓ site_create_recoleccion
✓ field/tecnologia-sitio
✓ btn/submit-primary
```

### Jerarquía de componentes

```
Atoms (base)
  └── Select, Input, Button, Label

Molecules (combinados)
  └── FormField (Label + Input + Error)

Organisms (secciones)
  └── SiteCreateForm (todos los FormFields)

Templates (pantallas)
  └── site_create_recoleccion, etc.
```

### Resumen de atajos clave

| Acción              | Atajo              |
| ------------------- | ------------------ |
| Crear componente    | `Ctrl + Alt + K`   |
| Activar Auto Layout | `Shift + A`        |
| Presentar prototipo | `Ctrl + P`         |
| Duplicar elemento   | `Ctrl + D`         |
| Buscar en Assets    | `Ctrl + P`         |
| Agrupar             | `Ctrl + G`         |
| Desagrupar          | `Ctrl + Shift + G` |

### Reglas que nunca romper

1. **Auto Layout en todo contenedor** que pueda ganar o perder hijos
2. **Variante por estado**, no frames separados para lo mismo
3. **Annotations en specs**, no texto flotante suelto en la pantalla
4. **Readonly ≠ Disabled** — elegí según si el valor debe enviarse o no
5. **No representar lógica solo con texto** — mostrala en el estado visual correcto

---

_Guía generada a partir de los requerimientos del proyecto Sites — sección Figma UX._
