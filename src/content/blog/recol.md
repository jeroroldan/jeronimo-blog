---
pubDate: 2026-05-01
title: "Feature: Recolecciones"
description: "Es un módulo de gestión y auditoría de residuos que reconcilia múltiples fuentes de datos (sensores físicos + logística humana) para validar que cada recolección de basura realmente ocurrió, cuándo y quién la hizo. Es un sistema de truth reconciliation para operaciones de saneamiento urbano."
heroImage: "../../assets/blog-placeholder-1.jpg"
code: "recol"
category: "software-design"
tags: ["software-design", "ux-ui", "database", "typescript"]
difficulty: "intermedio"
readingTime: 25
---

# Feature: Recolecciones

## ¿De qué se trata?

Es un módulo de **gestión y auditoría de residuos** que reconcilia múltiples fuentes de datos (sensores físicos + logística humana) para validar que cada recolección de basura realmente ocurrió, cuándo y quién la hizo. Es un sistema de **truth reconciliation** para operaciones de saneamiento urbano.

---

## Índice

1. [Casos de uso](#casos-de-uso)
2. [Definiciones importantes](#definiciones-importantes)
3. [Roles y acceso](#roles-y-acceso)
4. [Match types: MATCH / MISMATCH / SINGLE SOURCE](#match-types)
5. [Procesador de novedades](#procesador-de-novedades)
6. [Entidades y relaciones](#entidades-y-relaciones)
7. [Validaciones sitio / contenedor / device](#validaciones-sitio--contenedor--device)
8. [Para Figma: pantallas y componentes](#para-figma-pantallas-y-componentes)
9. [Para código: entidades de DB](#para-código-entidades-de-db)

---

## Casos de uso

- Monitoreo operativo de recolecciones en tiempo real
- Detección de inconsistencias entre sensores y logística
- Auditoría por vehículo, zona, tipo de residuo, personal (chofer / recolector) y ruta
- Búsqueda rápida (text search) por contenedor, sitio y ubicación
- Auditoría histórica
- Exportación de recolecciones

---

## Definiciones importantes

- **No puede haber sitios con contenedores mixtos en tecnología.** Si un sitio tiene tecnología TAG, todos sus contenedores deben tener TAG RFID. No puede coexistir un contenedor con sensor de nivel y otro con tag RFID en el mismo sitio.
- Los sitios tienen un campo `tecnología_del_sitio` con valores: `TAG`, `SENSOR_LEVEL`, `N/A`.
- Los sitios de tipo **RECOLECCIÓN DOMICILIARIA** solo pueden asociarse a tecnología `TAG_RFID`.
- Los sitios de tipo **RECOLECCIÓN** pueden asociarse a `TAG_RFID`, `LEVEL_SENSOR` o `N/A`.
- Los sitios de tipo **DEPÓSITO** o **DESCARGA** no requieren `tecnología_del_sitio` → `device_model_category_code = NULL`.
- Las rutas de recolección domiciliaria solo tienen recolecciones reportadas por **recolectores** (el chofer no interviene).
- Una ruta puede ser **mixta** (sitios sensorizados y no sensorizados), pero **un sitio no puede ser mixto**.

---

## Roles y acceso

| Rol        | Acceso                 | Ve % confianza |
| ---------- | ---------------------- | -------------- |
| `client`   | Visualización general  | ❌ No          |
| `provider` | Igual que client       | ❌ No          |
| `admin`    | Visualización completa | ✅ Sí          |

---

## Match types

### MATCH

- **Condición:** Dos fuentes de verdad coinciden (sensor de nivel + chofer, o lector RFID vehicular + chofer).
- **Confianza:** sube automáticamente a **100%**.
- **Timestamp:** el informado por el dispositivo de hardware siempre tiene prioridad sobre el declarado por el humano.

### MISMATCH

- **Condición:** El sensor reportó una recolección pero el chofer no la declaró, y el cliente **tiene el módulo de logística habilitado**.
- **Uso:** Funciona como alarma de inconsistencia operativa.
- También se genera MISMATCH cuando el chofer declara **Skip** o **Ignore** en un paso de ruta, pero el sensor detecta movimiento.

### SINGLE SOURCE

- **Condición:** El sensor reportó una recolección y el cliente **no tiene el módulo de logística habilitado**.
- Equivalentes: `human only` / `device only`.

---

## Procesador de novedades

### Configuración de módulos del cliente

| Módulo              | Valores          |
| ------------------- | ---------------- |
| `sensorized_module` | `TRUE` / `FALSE` |
| `logistic_module`   | `TRUE` / `FALSE` |

### Estrategia general: Upsert con ventana de ±10 minutos

Al llegar un evento, el sistema busca si ya existe una `collection` para ese `container_id` en una ventana de ±10 minutos:

- Si **no existe** → **INSERT** con la confianza de la fuente.
- Si **existe** → **UPDATE** consolidando datos (el timestamp del hardware siempre gana).

---

### Casos de procesamiento

#### 1. Dispositivos autónomos (Lector RFID Vehicular o Sensor de Nivel)

- Procesan en línea al recibir el dato.
- **Lector RFID vehicular:** confianza = **100%** (altamente fiable).
- **Sensor de nivel (Data Level):** confianza = **80%**.

#### 2. Declaración total del chofer (Route Step)

- Se procesa de forma **diferida** al finalizar la ruta.
- Se evalúa cada paso de ruta según cantidad de contenedores y estado.
- Confianza = **65%**.

#### 3. Declaración parcial del chofer (Route Step)

- El chofer reporta haber vaciado X de Y contenedores sin especificar cuáles.
- El sistema asigna contenedores **al azar**.
- Confianza = **50%**, se marca `is_random = true`.
- **Mutación posterior:** cuando el sensor o lector RFID identifica el contenedor específico, hace UPDATE sobre el registro `is_random`, reescribiendo el `container_id` correcto sin duplicar.

#### 4. Declaración por recolector (Route Step)

- El recolector escanea el tag RFID del contenedor.
- Se crea inmediatamente un paso de ruta con estado `COLLECTED` o `PARTIALLY_COLLECTED`.
- La lectura se guarda en `data_tag` con el `employee_id` y el `route_step_id`.

| Escenario                                        | Comportamiento                                                             |
| ------------------------------------------------ | -------------------------------------------------------------------------- |
| Sitio con 1 contenedor                           | Se crea la collection directamente                                         |
| Sitio con varios contenedores                    | Se crea la collection para el contenedor cuyo tag EPC coincide             |
| Contenedor no recolectable (contaminación, etc.) | Estado → `PARTIALLY_COLLECTED`, se genera un incidente en ese paso de ruta |

#### 5. Coincidencia de múltiples fuentes (Match)

- Si llegan distintos orígenes para el mismo registro → UPDATE consolidando.
- `match_type` → **MATCHED**.
- Confianza → **100%**.
- `collected_at` del hardware tiene prioridad.

#### 6. Faltante de fuentes esperadas (Mismatch)

- Si `expected_source_type = SENSOR_DRIVER` (cliente tiene ambos módulos) y solo llega una fuente → **MISMATCH**.
- Sirve como alarma operativa.

#### 7. Skip (salto de paso de ruta)

- El chofer indica que no pudo recolectar el sitio.
- **No se genera collection**, incluso si sensores reportan movimiento.
- Si los sensores reportan → se marca como **MISMATCH**.

#### 8. Ignore (ignorar paso de ruta)

- No se genera registro en `collections`.
- Si el sitio está sensorizado y los sensores reportan → **MISMATCH**.

#### 9. Abortar ruta

- Se crean collections **solo** para los pasos ejecutados como `COLLECTED` o `PARTIALLY_COLLECTED`.
- Los demás pasos quedan sin collection.

#### 10. Omitir ruta

- Los pasos de ruta quedan **pendientes**.
- No se ejecuta ninguna acción sobre ellos.

### Estados de ruta que generan collections

| Estado                  | Genera collections                      |
| ----------------------- | --------------------------------------- |
| `ABORTAR`               | Solo pasos ejecutados (total o parcial) |
| `EJECUTAR TOTALMENTE`   | Todos los pasos                         |
| `EJECUTAR PARCIALMENTE` | Los pasos marcados como recolectados    |

---

## Entidades y relaciones

```
RUTA
├── tiene → ZONA
├── tiene → TIPO DE RESIDUO
├── tiene → PASOS DE RUTA
│   └── tiene → SITIO
│       ├── tiene → CONTENEDOR
│       │   ├── puede tener → TAG RFID
│       │   └── puede tener → SENSOR DE NIVEL
│       └── puede tener → VECINO (para rec. domiciliaria)
├── tiene → CHOFER
├── tiene → VEHÍCULO
│   ├── puede tener → GPS
│   └── puede tener → LECTOR RFID EMBEBIDO (vehicular)
└── puede tener → RECOLECTOR (employee type=collector)

DEVICES (se asocian a vehículos o contenedores, nunca mixtos en un sitio)
├── GPS                    → asociado a VEHÍCULO
├── LECTOR RFID EMBEBIDO   → asociado a VEHÍCULO
├── TAG RFID               → asociado a CONTENEDOR
└── SENSOR DE NIVEL        → asociado a CONTENEDOR

MODELO DE DISPOSITIVO
└── category = GPS | SENSOR_NIVEL | TAG_RFID | LECTOR_RFID_EMBEBIDO
    (DEVICE_CATEGORY_TRUCK no puede asociarse a contenedores)
```

---

## Validaciones sitio / contenedor / device

### Regla 1 — No mezclar tecnología en un sitio

El `device_model_category` impone que todos los contenedores de un sitio usen la misma tecnología. No puede coexistir un contenedor con `SENSOR_NIVEL` y otro con `TAG_RFID` en el mismo sitio.

### Regla 2 — Creación/edición de dispositivos

Solo mostrar contenedores disponibles para asociar si: **no tienen dispositivo asociado** Y **no tienen sitio asociado**.

### Regla 3 — Edición de sitio con contenedores

Si se intenta cambiar el `device_model_category` de un sitio que ya tiene contenedores con dispositivos asociados → **error bloqueante**: "Primero deben desvincularse los contenedores para poder modificar el método de validación tecnológica del sitio."

### Regla 4 — Selector de sitios al editar contenedor

Filtrar por `load_side_category`, luego:

| Situación                      | Filtro adicional de sitios                                    |
| ------------------------------ | ------------------------------------------------------------- |
| Contenedor **con** dispositivo | `device_model_category` debe coincidir con el del dispositivo |
| Contenedor **sin** dispositivo | `device_model_category = NULL`                                |

### Regla 5 — Creación de dispositivo

No se puede asociar un contenedor a un dispositivo si ese contenedor ya tiene un sitio asociado (porque eso implicaría que el sitio tenía `device_model_category = NULL`).

### Regla 6 — Recolección domiciliaria

Los sitios de tipo `RECOLECCIÓN DOMICILIARIA` deben tener forzosamente `device_model_category = TAG_RFID`. No se puede cambiar.

---

## Para Figma: pantallas y componentes

### Pantalla 1 — Dashboard principal (monitoreo operativo)

Tabla/feed de recolecciones con las columnas:

| Columna             | Notas                                  |
| ------------------- | -------------------------------------- |
| Sitio               | Nombre y zona                          |
| Contenedor          | ID / descripción                       |
| Fecha y hora        | `collected_at` (timestamp de hardware) |
| Match type          | Chip coloreado (ver componente abajo)  |
| Fuente              | Sensor / Chofer / Recolector           |
| % Confianza         | **Solo visible para `admin`**          |
| Chofer / Recolector | Nombre                                 |
| Vehículo            | Patente / ID                           |

**Filtros:** zona, ruta, tipo de residuo, rango de fecha, match type, vehículo, chofer/recolector.

**Búsqueda rápida (text search):** por contenedor, sitio y ubicación.

---

### Componente central — Chip de Match Type

| Estado          | Color       | Descripción visible      |
| --------------- | ----------- | ------------------------ |
| `MATCH`         | 🟢 Verde    | Recolección confirmada   |
| `MISMATCH`      | 🔴 Rojo     | Inconsistencia operativa |
| `SINGLE SOURCE` | 🟡 Amarillo | Sin módulo logístico     |

---

### Pantalla 2 — Detalle de recolección

- Timeline de fuentes que llegaron y en qué orden.
- Indicador `is_random` (si el contenedor fue asignado al azar).
- Si hubo mutación posterior del `container_id`, mostrar el historial.
- Timestamp de hardware vs timestamp declarado por humano.
- Badge de confianza (solo admin).

---

### Pantalla 3 — Auditoría por vehículo / zona / ruta / personal

Vistas filtradas de la tabla principal, agrupadas por la entidad seleccionada.

---

### Pantalla 4 — Creación/edición de sitio

- Campo `tipo de sitio` condiciona las opciones de `tecnología`:
  - `RECOLECCIÓN DOMICILIARIA` → solo `TAG_RFID` (forzado).
  - `RECOLECCIÓN` → `TAG_RFID`, `LEVEL_SENSOR`, `N/A`.
  - `DEPÓSITO` / `DESCARGA` → sin campo tecnología.
- Si el sitio tiene contenedores con dispositivos y se intenta cambiar tecnología → **modal de error bloqueante**.

---

### Pantalla 5 — Creación/edición de contenedor

- Selector de sitio con filtros encadenados:
  1. Filtrar por `load_side_category`.
  2. Si el contenedor tiene dispositivo → filtrar además por `device_model_category` coincidente.
  3. Si no tiene dispositivo → filtrar por `device_model_category = NULL`.

---

### Pantalla 6 — Creación de dispositivo

- Al querer asociar un contenedor → validar que ese contenedor no tenga sitio asociado.
- Si tiene sitio → error: "No es posible asociar un contenedor a un dispositivo si ya está asociado a un sitio."

---

## Para código: entidades de DB

### Tabla `collections` (registro central)

| Campo                  | Tipo        | Descripción                                     |
| ---------------------- | ----------- | ----------------------------------------------- |
| `id`                   | UUID        | PK                                              |
| `container_id`         | UUID FK     | Contenedor recolectado                          |
| `site_id`              | UUID FK     | Sitio de la recolección                         |
| `route_step_id`        | UUID FK     | Paso de ruta asociado                           |
| `collected_at`         | timestamp   | Fecha/hora (prioridad al hardware)              |
| `match_type`           | enum        | `MATCHED` / `MISMATCH` / `SINGLE_SOURCE`        |
| `confidence`           | int (0-100) | % de confianza                                  |
| `expected_source_type` | enum        | `SENSOR_DRIVER` / `SENSOR_ONLY` / `DRIVER_ONLY` |
| `is_random`            | boolean     | Si el container_id fue asignado al azar         |
| `source_sensor`        | boolean     | Si el sensor reportó                            |
| `source_driver`        | boolean     | Si el chofer reportó                            |
| `source_collector`     | boolean     | Si el recolector reportó                        |
| `driver_id`            | UUID FK     | Chofer                                          |
| `collector_id`         | UUID FK     | Recolector (si aplica)                          |
| `vehicle_id`           | UUID FK     | Vehículo                                        |

---

### Tabla `sites`

| Campo                        | Tipo        | Descripción                                                          |
| ---------------------------- | ----------- | -------------------------------------------------------------------- |
| `id`                         | UUID        | PK                                                                   |
| `site_type`                  | enum        | `RECOLECCION` / `RECOLECCION_DOMICILIARIA` / `DEPOSITO` / `DESCARGA` |
| `device_model_category_code` | enum / NULL | `TAG_RFID` / `LEVEL_SENSOR` / `N/A` / `NULL`                         |
| `zone_id`                    | UUID FK     | Zona                                                                 |

---

### Tabla `route_steps`

| Campo      | Tipo    | Descripción                                                             |
| ---------- | ------- | ----------------------------------------------------------------------- |
| `id`       | UUID    | PK                                                                      |
| `route_id` | UUID FK | Ruta                                                                    |
| `site_id`  | UUID FK | Sitio                                                                   |
| `status`   | enum    | `COLLECTED` / `PARTIALLY_COLLECTED` / `SKIPPED` / `IGNORED` / `PENDING` |

---

### Tabla `data_tag` (log de lecturas RFID)

| Campo           | Tipo      | Descripción                    |
| --------------- | --------- | ------------------------------ |
| `id`            | UUID      | PK                             |
| `epc`           | string    | Tag EPC leído                  |
| `employee_id`   | UUID FK   | Recolector que tomó la lectura |
| `route_step_id` | UUID FK   | Paso de ruta                   |
| `read_at`       | timestamp | Momento de la lectura          |

---

### Módulos del cliente (config)

```json
{
  "sensorized_module": true,
  "logistic_module": true
}
```

Cuando `logistic_module = false` → las collections son siempre `SINGLE_SOURCE`.
Cuando ambos son `true` → `expected_source_type = SENSOR_DRIVER` y se espera conciliación.

---

### Flujo de upsert (pseudocódigo)

```ts
async function processCollectionEvent(event: CollectionEvent) {
  const existing = await findCollectionInWindow({
    container_id: event.container_id,
    from: event.timestamp - 10min,
    to: event.timestamp + 10min,
  });

  if (!existing) {
    await insert({
      ...event,
      confidence: getConfidenceBySource(event.source),
      is_random: event.isPartialDeclaration,
      match_type: resolveSingleSourceMatchType(event),
    });
  } else {
    await update(existing.id, {
      collected_at: event.source === 'hardware' ? event.timestamp : existing.collected_at,
      confidence: recalculateConfidence(existing, event),
      match_type: resolveMatchType(existing, event),
      is_random: existing.is_random && !event.confirmsContainer ? true : false,
      container_id: event.confirmsContainer ? event.container_id : existing.container_id,
    });
  }
}
```

---

_Documentación generada para handoff a Figma y desarrollo — Feature: Recolecciones_
