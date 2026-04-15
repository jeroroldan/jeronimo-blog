---
title: "Curso de Supabase: Construye tu Backend Moderno"
description: "Aprende a construir un backend robusto con Supabase y PostgreSQL. Desde fundamentos hasta RLS y integraciones."
pubDate: "2026-04-15"
code: "supabase"
category: "informatica"
tags: ["supabase", "backend", "postgresql", "database", "fullstack"]
difficulty: "principiante"
readingTime: 10
---

# Curso de Supabase: Guía Completa

> 💡 **En esta guía aprenderás**: A construir un backend moderno con Supabase, desde cero hasta producción.

---

## Por Qué Supabase

Supabase es un **Backend-as-a-Service** basado en PostgreSQL. En lugar de construir tu propio backend, usas APIs automáticas generadas desde tu base de datos.

> **⚠️ традиционный**: Construir backend takes months. Con Supabase: hours.

### Comparación

| Enfoque                 | Tiempo        | Complejidad |
| ----------------------- | ------------- | ----------- |
| **Backend tradicional** | Semanas/meses | Alta        |
| **Firebase**            | Rápido        | propietaria |
| **Supabase**            | Horas         | Baja        |

**Por qué PostgreSQL**:

- Base de datos relacional madura
- Potencia empresas como Instagram, Netflix
- SQL estándar = conocimiento portable

---

## Estructura del Proyecto "Vizinho Indica"

El curso usa un proyecto real: un marketplace comunitario.

### Modelo de Datos

```
┌─────────────┐     ┌─────────────┐
│   usuarios │     │ categorias  │
├─────────────┤     ├─────────────┤
│ id (PK)    │     │ id (PK)     │
│ email      │     │ nombre     │
│ nombre     │     └──────┬──────┘
│ password   │            │
└──────┬──────┘     ┌────▼──────┐
       │            │ servicios │
       │ 1:N        ├───────────┤
       └─────────▶ │ id (PK)   │
                    │ titulo    │
                    │ descripcion│
                    │ precio   │
                    │ usuario_id│ FK
                    │ categoria_id│ FK
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
      ┌────▼────┐    ┌────▼────┐    ┌───▼────┐
      │evaluaciones│   │favoritos│    │ imagenes │
      ├──────────┤   ├─────────┤   ├────────┤
      │id        │   │usuario  │   │url     │
      │puntuacion│   │servicio │   │servicio │
      │comentario│   └─────────┘   └────────┘
      │usuario  │
      │servicio │
      └─────────┘
```

---

## Paso 1: Crear Proyecto

### Configuración Inicial

1. Ve a **supabase.com**
2. Click en **"New Project"**
3. Define nombre y contraseña
4. Región más cercana

```
┌─────────────────────────────────────────┐
│  Create a new project                    │
│                                         │
│  Name: [mi-proyecto]                   │
│  Database Password: [••••••••]        │
│  Region: [South America]               │
│                                         │
│  [Create project]                     │
└─────────────────────────────────────────┘
```

---

## Paso 2: Estructurar Base de Datos

### Crear Tablas

Desde el panel de Supabase:

1. **Table Editor** → **New Table**
2. Define columnas y tipos
3. **Save**

### Tipos de Columnas

| Tipo          | Uso                      |
| ------------- | ------------------------ |
| **uuid**      | IDs únicos (recomendado) |
| **text**      | Texto largo              |
| **varchar**   | Texto corto              |
| **int**       | Números enteros          |
| **float**     | Números decimales        |
| **boolean**   | true/false               |
| **timestamp** | Fechas                   |
| **jsonb**     | Objetos JSON             |

### Ejemplo: Tabla usuarios

```sql
CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Relaciones (Foreign Keys)

```sql
-- Tabla servicios tiene relación con usuarios
ALTER TABLE servicios
ADD CONSTRAINT fk_usuario
FOREIGN KEY (usuario_id)
REFERENCES usuarios(id);
```

---

## Paso 3: Automatizaciones con Triggers

> **💡 Concepto Clave**: Los triggers ejecutan código automáticamente cuando ocurre un evento.

### Trigger de Usuario Automático

Problema: En Supabase Auth y tu tabla pública son cosas separadas.

Solución: Trigger que copia user a tu tabla cuando se registra.

```sql
-- Función que crea usuario público
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nombre)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

**Resultado**: Cuando alguien se registra en Auth, automáticamente aparece en tu tabla `usuarios`.

---

## Paso 4: Vistas (Views)

> **🔍 Para Curiosos**: Las views son consultas guardadas que funcionan como tablas virtuales.

### Para Qué Usarlas

| View                             | Propósito                          |
| -------------------------------- | ---------------------------------- |
| **Ver promedio de evaluaciones** | Mostrar rating de cada servicio    |
| **Ver detalles de servicio**     | joins con categorías y usuario     |
| **Ver favoritos de usuario**     | Servicios guardados por el usuario |

### Ejemplo: Vista de Servicios con Detalles

```sql
CREATE VIEW servicios_detalles AS
SELECT
  s.id,
  s.titulo,
  s.descripcion,
  s.precio,
  c.nombre as categoria,
  u.nombre as proveedor,
  COALESCE(
    AVG(e.puntuacion)::numeric(2,1),
    0
  ) as rating_promedio,
  COUNT(e.id) as total_resenas
FROM servicios s
LEFT JOIN categorias c ON s.categoria_id = c.id
LEFT JOIN usuarios u ON s.usuario_id = u.id
LEFT JOIN evaluaciones e ON s.id = e.servicio_id
GROUP BY s.id, c.nombre, u.nombre;
```

---

## Paso 5: Seguridad con RLS

> **⚠️ Importante**: Row Level Security protege tus datos fila por fila.

### Habilitar RLS

1. Table Editor → Tu tabla
2. **Enable RLS** toggle

### Políticas de Acceso

```sql
-- Cualquiera puede ver servicios
CREATE POLICY "servicios_publicos"
ON servicios
FOR SELECT
USING (true);

-- Solo el creador puede editar
CREATE POLICY "servicios_propietario"
ON servicios
FOR ALL
USING (auth.uid() = usuario_id);

-- Solo usuarios autenticados pueden crear
CREATE POLICY "crear_servicios"
ON servicios
FOR INSERT
WITH CHECK (auth.uid() = usuario_id);
```

### Tabla de Ejemplo RLS

| Operación | Política    | Condición               |
| --------- | ----------- | ----------------------- |
| SELECT    | Público     | true                    |
| INSERT    | Autenticado | auth.uid() = usuario_id |
| UPDATE    | Propietario | auth.uid() = usuario_id |
| DELETE    | Propietario | auth.uid() = usuario_id |

---

## Paso 6: Storage (Archivos)

Supabase tiene storage integrado para imágenes.

### Crear Bucket

1. Storage → **New Bucket**
2. Nombre: "servicios-images"
3. **Public** toggle enabled

### Usar en Aplicación

```javascript
// Subir imagen
const { data, error } = await supabase.storage
  .from("servicios-images")
  .upload("path/imagen.jpg", file);

// Obtener URL pública
const { data } = supabase.storage
  .from("servicios-images")
  .getPublicUrl("path/imagen.jpg");
```

---

## Paso 7: Integración con Frontend

### Lovable (Low Code)

El curso muestra integración con **Lovable**:

1. Conecta tu proyecto de Supabase
2. Define tabla en Lovable
3. Usa los endpoints automáticos

### API Automática

Supabase genera API REST automáticamente:

```bash
# Listar servicios
GET /rest/v1/servicios

# Crear servicio
POST /rest/v1/servicios

# Actualizar
PATCH /rest/v1/servicios?id=eq.1

# Eliminar
DELETE /rest/v1/servicios?id=eq.1
```

### Client JavaScript

```javascript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("TU_SUPABASE_URL", "TU_ANON_KEY");

// Fetch datos
const { data, error } = await supabase.from("servicios").select("*");
```

---

## Resumen: Flujo Completo

```
┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
│ 1 Crear   │→│ 2 Tablas  │→│ 3 Auto-  │→│ 4 Views  │
│ Proyecto  │  │ y relaciones│ │ maciones │  │          │
└───────────┘  └───────────┘  └───────────┘  └───────────┘
                                              │
┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
│ 7 Frontend│←│ 6 Storage │←│ 5 RLS     │  │           │
│           │  │           │  │           │←│           │
└───────────┘  └───────────┘  └───────────┘  └───────────┘
```

---

## Próximos Pasos

**Esta semana PRACTICA**:

1. [ ] Crea tu cuenta en Supabase
2. [ ] Crea 3 tablas con relaciones
3. [ ] Implementa trigger de usuario
4. [ ] Crea una view
5. [ ] Configura RLS básico
6. [ ] Sube una imagen al storage

> 🚀 **Recordatorio**: Supabase te da poder de base de datos relacional con velocidad de SaaS. Combínalo con herramientas Low Code como Lovable para resultados rápidos.

---

_¿Ya conocías Supabase? Comparte tu experiencia en los comentarios._
