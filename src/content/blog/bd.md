---
title: 'Masterclass: Bases de Datos Relacionales y Modelado'
code: "base-datos"
description: 'FUNDAMENTOS: ¿QUÉ ES UNA BASE DE DATOS RELACIONAL?'
pubDate: 'Sep 03 2025'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


# Masterclass: Bases de Datos Relacionales y Modelado

## 🗄️ FUNDAMENTOS: ¿QUÉ ES UNA BASE DE DATOS RELACIONAL?

Una base de datos relacional es un sistema que organiza datos en **tablas relacionadas entre sí** mediante **claves**. El modelo se basa en la teoría matemática de conjuntos y relaciones.

### Componentes básicos

- **Tablas** (entidades): Almacenan datos sobre un tema específico
- **Columnas** (atributos): Características de la entidad
- **Filas** (registros): Instancias individuales de la entidad
- **Claves**: Conectan las tablas entre sí

---

## 🔑 TIPOS DE CLAVES: LA BASE DE TODO

### 1. CLAVE PRIMARIA (Primary Key - PK)

**Definición:** Identifica únicamente cada registro en una tabla

**Características:**

- ✅ Única (no se repite)
- ✅ No nula (siempre tiene valor)
- ✅ Inmutable (no cambia)
- ✅ Simple y eficiente

**Ejemplos:**

```sql
-- Tabla USUARIOS
user_id (PK) | nombre    | email
1           | Juan      | juan@email.com
2           | María     | maria@email.com
3           | Carlos    | carlos@email.com
```

### 2. CLAVE FORÁNEA (Foreign Key - FK)

**Definición:** Campo que hace referencia a la clave primaria de otra tabla

**Ejemplo:**

```sql
-- Tabla PEDIDOS
pedido_id (PK) | user_id (FK) | fecha      | total
1             | 2            | 2024-01-15 | 150.00
2             | 1            | 2024-01-16 | 75.50
3             | 2            | 2024-01-17 | 200.00
```

### 3. CLAVE CANDIDATA

**Definición:** Campo(s) que podrían ser clave primaria

**Ejemplo:** En tabla USUARIOS, tanto `user_id` como `email` podrían ser PK

### 4. CLAVE COMPUESTA

**Definición:** Clave primaria formada por múltiples campos

**Ejemplo:**

```sql
-- Tabla INSCRIPCIONES
estudiante_id (PK) | curso_id (PK) | fecha_inscripcion
1                 | 101           | 2024-01-15
1                 | 102           | 2024-01-16
2                 | 101           | 2024-01-17
```

---

## 🔗 TIPOS DE RELACIONES

### 1. UNO A UNO (1:1)

**Descripción:** Un registro de tabla A se relaciona con exactamente un registro de tabla B

**Ejemplo:** Usuario ↔ Perfil

```sql
-- Tabla USUARIOS
user_id (PK) | nombre
1           | Juan
2           | María

-- Tabla PERFILES
perfil_id (PK) | user_id (FK, UNIQUE) | bio           | avatar
1             | 1                    | "Desarrollador" | img1.jpg
2             | 2                    | "Diseñadora"   | img2.jpg
```

**Cuándo usar:**

- Para dividir información por seguridad
- Para optimizar consultas (datos frecuentes vs. poco frecuentes)
- Para cumplir reglas de negocio

### 2. UNO A MUCHOS (1:N)

**Descripción:** Un registro de tabla A se relaciona con varios registros de tabla B

**Ejemplo:** Cliente → Pedidos

```sql
-- Tabla CLIENTES
cliente_id (PK) | nombre
1              | "Empresa ABC"
2              | "Empresa XYZ"

-- Tabla PEDIDOS
pedido_id (PK) | cliente_id (FK) | fecha      | monto
1             | 1               | 2024-01-15 | 1500.00
2             | 1               | 2024-01-20 | 2300.00
3             | 2               | 2024-01-18 | 890.00
```

**La más común:** ~80% de las relaciones son 1:N

### 3. MUCHOS A MUCHOS (N:M)

**Descripción:** Varios registros de tabla A se relacionan con varios registros de tabla B

**Problema:** No se puede implementar directamente
**Solución:** Tabla intermedia (tabla de unión)

**Ejemplo:** Estudiantes ↔ Cursos

```sql
-- Tabla ESTUDIANTES
estudiante_id (PK) | nombre
1                 | Juan
2                 | María
3                 | Carlos

-- Tabla CURSOS
curso_id (PK) | nombre
101          | "Matemáticas"
102          | "Historia"
103          | "Inglés"

-- Tabla INTERMEDIA: INSCRIPCIONES
estudiante_id (PK, FK) | curso_id (PK, FK) | fecha_inscripcion | calificacion
1                     | 101               | 2024-01-15        | NULL
1                     | 102               | 2024-01-16        | NULL
2                     | 101               | 2024-01-17        | 95
2                     | 103               | 2024-01-18        | 88
3                     | 102               | 2024-01-19        | 92
```

---

## 📐 PROCESO DE MODELADO: PASO A PASO

### PASO 1: ANÁLISIS DE REQUISITOS

**Preguntas clave:**

- ¿Qué información necesito almacenar?
- ¿Quiénes son los actores principales?
- ¿Qué acciones realizan?
- ¿Qué reglas de negocio existen?

### PASO 2: IDENTIFICACIÓN DE ENTIDADES

**Entidad = Tabla**

**Criterios para identificar entidades:**

- ✅ Es un "cosa" de la que necesito guardar información
- ✅ Tiene atributos propios
- ✅ Existe independientemente

**Ejemplo - Sistema de Biblioteca:**

- 📚 **LIBROS**
- 👤 **USUARIOS**
- 📋 **PRÉSTAMOS**
- 👨‍💼 **AUTORES**
- 🏢 **EDITORIALES**

### PASO 3: IDENTIFICACIÓN DE ATRIBUTOS

**Para cada entidad, define qué información guardar**

```sql
LIBROS:
- libro_id (PK)
- titulo
- isbn
- año_publicacion
- numero_paginas
- editorial_id (FK)

USUARIOS:
- usuario_id (PK)
- nombre
- apellido
- email
- telefono
- fecha_registro

PRÉSTAMOS:
- prestamo_id (PK)
- usuario_id (FK)
- libro_id (FK)
- fecha_prestamo
- fecha_devolucion_esperada
- fecha_devolucion_real
- estado
```

### PASO 4: DEFINICIÓN DE RELACIONES

**Analiza cómo se conectan las entidades**

```
USUARIO ----< PRÉSTAMOS >---- LIBRO
(1:N)                        (1:N)

LIBRO >---- EDITORIAL
(N:1)

LIBRO ----< AUTOR_LIBRO >---- AUTOR
(N:M - requiere tabla intermedia)
```

---

## 🎯 MEJORES PRÁCTICAS DE MODELADO

### 1. CONVENCIONES DE NOMBRES

#### TABLAS

- ✅ **Plural y en español:** `usuarios`, `productos`, `pedidos`
- ✅ **Snake_case:** `detalle_pedidos`, `categoria_productos`
- ❌ Evitar: `Usuario`, `user`, `tblUsuarios`

#### COLUMNAS

- ✅ **Descriptivas:** `fecha_nacimiento`, `precio_unitario`
- ✅ **Snake_case:** `fecha_creacion`, `numero_telefono`
- ❌ Evitar: `fn`, `tel`, `f1`

#### CLAVES PRIMARIAS

- ✅ **Patrón:** `tabla_id` → `usuario_id`, `producto_id`
- ✅ **Alternativa:** `id` (si es consistente en todo el sistema)

#### CLAVES FORÁNEAS

- ✅ **Mismo nombre que la PK referenciada:** `usuario_id`
- ✅ **Prefijo descriptivo si es necesario:** `cliente_id`, `vendedor_id`

### 2. TIPOS DE DATOS APROPIADOS

```sql
-- IDENTIFICADORES
usuario_id         INT AUTO_INCREMENT PRIMARY KEY
uuid               CHAR(36)  -- para sistemas distribuidos

-- TEXTOS
nombre             VARCHAR(100)     -- longitud apropiada
descripcion        TEXT            -- textos largos
codigo             CHAR(10)        -- longitud fija

-- NÚMEROS
precio             DECIMAL(10,2)   -- dinero (precisión exacta)
cantidad           INT             -- enteros
porcentaje         DECIMAL(5,2)    -- 999.99%

-- FECHAS
fecha_creacion     DATETIME        -- fecha y hora
fecha_nacimiento   DATE            -- solo fecha
hora_inicio        TIME            -- solo hora

-- BOOLEANOS
activo             BOOLEAN         -- true/false
eliminado          BOOLEAN DEFAULT FALSE
```

### 3. NORMALIZACIÓN: LAS 3 FORMAS NORMALES

#### PRIMERA FORMA NORMAL (1FN)

**Regla:** Cada campo contiene un valor atómico (no divisible)

❌ **Violación:**

```sql
usuario_id | nombre | telefonos
1         | Juan   | "123-4567, 987-6543"
```

✅ **Correcto:**

```sql
-- Tabla USUARIOS
usuario_id | nombre
1         | Juan

-- Tabla TELEFONOS
telefono_id | usuario_id | numero
1          | 1          | "123-4567"
2          | 1          | "987-6543"
```

#### SEGUNDA FORMA NORMAL (2FN)

**Regla:** Cumple 1FN + No hay dependencias parciales de la clave primaria

❌ **Violación:**

```sql
-- Clave primaria compuesta: (estudiante_id, curso_id)
estudiante_id | curso_id | nombre_estudiante | nombre_curso
1            | 101      | Juan              | Matemáticas
1            | 102      | Juan              | Historia
```

*Problema: nombre_estudiante depende solo de estudiante_id*

✅ **Correcto:** Separar en tablas independientes

#### TERCERA FORMA NORMAL (3FN)

**Regla:** Cumple 2FN + No hay dependencias transitivas

❌ **Violación:**

```sql
usuario_id | nombre | ciudad    | codigo_postal
1         | Juan   | Madrid    | 28001
2         | María  | Barcelona | 08001
```

*Problema: codigo_postal depende de ciudad, no directamente de usuario_id*

✅ **Correcto:**

```sql
-- Tabla CIUDADES
ciudad_id | nombre    | codigo_postal
1        | Madrid    | 28001
2        | Barcelona | 08001

-- Tabla USUARIOS
usuario_id | nombre | ciudad_id
1         | Juan   | 1
2         | María  | 2
```

### 4. ÍNDICES: OPTIMIZACIÓN DE RENDIMIENTO

```sql
-- ÍNDICES AUTOMÁTICOS
PRIMARY KEY    -- Siempre indexado
UNIQUE        -- Siempre indexado

-- ÍNDICES MANUALES
-- En columnas de búsqueda frecuente
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- En claves foráneas
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);

-- Índices compuestos
CREATE INDEX idx_pedidos_fecha_estado ON pedidos(fecha, estado);

-- Para consultas con WHERE, ORDER BY, JOIN
```

---

## 🛠️ EJEMPLO PRÁCTICO COMPLETO

### SISTEMA DE E-COMMERCE

#### ANÁLISIS

- **Actores:** Clientes, Productos, Pedidos
- **Relaciones:** Cliente hace Pedidos, Pedidos contienen Productos

#### MODELO

```sql
-- TABLA: CLIENTES
CREATE TABLE clientes (
    cliente_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- TABLA: CATEGORIAS
CREATE TABLE categorias (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE
);

-- TABLA: PRODUCTOS
CREATE TABLE productos (
    producto_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    categoria_id INT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id)
);

-- TABLA: PEDIDOS
CREATE TABLE pedidos (
    pedido_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    total DECIMAL(12,2) NOT NULL,
    direccion_envio TEXT NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id)
);

-- TABLA: DETALLE_PEDIDOS (Relación N:M entre Pedidos y Productos)
CREATE TABLE detalle_pedidos (
    detalle_id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id),
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id),
    UNIQUE KEY unique_pedido_producto (pedido_id, producto_id)
);

-- ÍNDICES ADICIONALES
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_precio ON productos(precio);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha_pedido);
```

---

## 🚨 ERRORES COMUNES Y CÓMO EVITARLOS

### 1. SOBRE-NORMALIZACIÓN

**Error:** Dividir tablas en exceso
**Consecuencia:** JOINs complejos y rendimiento lento
**Solución:** Encontrar equilibrio entre normalización y rendimiento

### 2. SUB-NORMALIZACIÓN

**Error:** Datos repetidos en múltiples tablas
**Consecuencia:** Inconsistencias y desperdicio de espacio
**Solución:** Aplicar al menos 3FN

### 3. CLAVES FORÁNEAS SIN ÍNDICES

**Error:** No indexar FKs
**Consecuencia:** JOINs lentos
**Solución:** Siempre indexar claves foráneas

### 4. NOMBRES INCONSISTENTES

**Error:** Mezclar idiomas y convenciones
**Consecuencia:** Código difícil de mantener
**Solución:** Definir y seguir estándares

### 5. TIPOS DE DATOS INCORRECTOS

**Error:** VARCHAR para fechas, INT para dinero
**Consecuencia:** Pérdida de precisión y validación
**Solución:** Usar tipos específicos para cada propósito

---

## 📊 HERRAMIENTAS DE MODELADO

### DIAGRAMAS ENTIDAD-RELACIÓN (ERD)

1. **MySQL Workbench** - Gratuita y potente
2. **DrawIO** - Online y gratuita
3. **Lucidchart** - Profesional
4. **ERDPlus** - Académica y gratuita

### NOTACIONES COMUNES

- **Crow's Foot:** Líneas con símbolos en los extremos
- **Chen:** Diamantes para relaciones
- **UML:** Estándar de la industria

---

## 🎯 CHECKLIST DE REVISIÓN

Antes de implementar tu modelo, verifica:

### DISEÑO

- [ ] ¿Cada tabla tiene una clave primaria?
- [ ] ¿Las relaciones están bien definidas?
- [ ] ¿Se aplican las formas normales apropiadas?
- [ ] ¿Los nombres son consistentes y descriptivos?

### RENDIMIENTO

- [ ] ¿Las claves foráneas están indexadas?
- [ ] ¿Hay índices en columnas de búsqueda frecuente?
- [ ] ¿Los tipos de datos son apropiados?
- [ ] ¿Se evitan columnas con muchos valores NULL?

### INTEGRIDAD

- [ ] ¿Hay restricciones de integridad referencial?
- [ ] ¿Se usan constraints apropiados (NOT NULL, UNIQUE)?
- [ ] ¿Hay validaciones en el nivel de aplicación?

### MANTENIBILIDAD

- [ ] ¿La documentación está actualizada?
- [ ] ¿Los cambios están versionados?
- [ ] ¿Hay scripts de migración?

---

## 🚀 SIGUIENTES PASOS

1. **Practica** modelando sistemas reales
2. **Estudia** esquemas de aplicaciones conocidas
3. **Aprende** sobre particionado y sharding
4. **Explora** bases de datos NoSQL para casos específicos
5. **Profundiza** en optimización y tuning de consultas

**Recuerda:** Un buen diseño de base de datos es la base de una aplicación exitosa. ¡La inversión en tiempo de modelado se paga multiplicada en mantenimiento!
