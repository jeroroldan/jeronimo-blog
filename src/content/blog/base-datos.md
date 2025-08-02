---
title: 'Bases de Datos SQL Relacionales'
code: 'sql'
description: 'Guía Completa de Bases de Datos SQL Relacionales'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía Completa de Bases de Datos SQL Relacionales

## Tabla de Contenidos

1. [Fundamentos y Conceptos Clave](#fundamentos-y-conceptos-clave)
2. [Diseño de Base de Datos](#diseño-de-base-de-datos)
3. [Normalización](#normalización)
4. [Tipos de Relaciones](#tipos-de-relaciones)
5. [Consultas SQL Básicas](#consultas-sql-básicas)
6. [Consultas SQL Avanzadas](#consultas-sql-avanzadas)
7. [Índices y Optimización](#índices-y-optimización)
8. [Transacciones y Concurrencia](#transacciones-y-concurrencia)
9. [Funciones y Procedimientos](#funciones-y-procedimientos)
10. [Arquitecturas Escalables](#arquitecturas-escalables)
11. [Mejores Prácticas](#mejores-prácticas)
12. [Casos de Uso Reales](#casos-de-uso-reales)
13. [Herramientas y Monitoreo](#herramientas-y-monitoreo)

---

## Fundamentos y Conceptos Clave

### ACID Properties

Las bases de datos relacionales garantizan las propiedades ACID:

- **Atomicity**: Las transacciones son todo o nada
- **Consistency**: Los datos siempre están en un estado válido
- **Isolation**: Las transacciones no interfieren entre sí
- **Durability**: Los cambios confirmados son permanentes

### Modelo Relacional

```sql
-- Ejemplo de estructura básica
-- Cada tabla representa una entidad
-- Cada fila es una instancia
-- Cada columna es un atributo
-- Las claves relacionan las tablas

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);
```

### Tipos de Datos Comunes

```sql
-- Numéricos
INT, BIGINT, DECIMAL(10,2), FLOAT, DOUBLE

-- Texto
VARCHAR(255), TEXT, CHAR(10)

-- Fecha y Tiempo
DATE, TIME, TIMESTAMP, DATETIME

-- Booleanos
BOOLEAN

-- JSON (PostgreSQL, MySQL 5.7+)
JSON, JSONB

-- Ejemplo práctico
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    categoria_id INT,
    especificaciones JSON,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);
```

---

## Diseño de Base de Datos

### Esquema de Ejemplo: Sistema E-commerce

```sql
-- 1. Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_conexion TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
  
    CONSTRAINT email_formato CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 2. Direcciones
CREATE TABLE direcciones (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo VARCHAR(20) DEFAULT 'envio', -- 'envio', 'facturacion'
    calle VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
  
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. Categorías
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    categoria_padre_id INT,
    nivel INT DEFAULT 1,
    activo BOOLEAN DEFAULT TRUE,
  
    FOREIGN KEY (categoria_padre_id) REFERENCES categorias(id)
);

-- 4. Productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    precio_oferta DECIMAL(10,2),
    costo DECIMAL(10,2),
    stock INT DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    peso DECIMAL(8,3),
    dimensiones JSON,
    categoria_id INT NOT NULL,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    especificaciones JSON,
    imagenes JSON,
    seo_titulo VARCHAR(255),
    seo_descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
  
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    CONSTRAINT precio_positivo CHECK (precio > 0),
    CONSTRAINT stock_no_negativo CHECK (stock >= 0)
);

-- 5. Pedidos
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    numero_pedido VARCHAR(20) UNIQUE NOT NULL,
    usuario_id INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    -- Estados: pendiente, confirmado, preparando, enviado, entregado, cancelado
  
    subtotal DECIMAL(10,2) NOT NULL,
    impuestos DECIMAL(10,2) DEFAULT 0,
    descuento DECIMAL(10,2) DEFAULT 0,
    envio DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
  
    direccion_envio JSON NOT NULL,
    direccion_facturacion JSON,
  
    metodo_pago VARCHAR(50),
    estado_pago VARCHAR(20) DEFAULT 'pendiente',
    -- Estados pago: pendiente, pagado, fallido, reembolsado
  
    notas TEXT,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_confirmacion TIMESTAMP,
    fecha_envio TIMESTAMP,
    fecha_entrega TIMESTAMP,
  
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT total_positivo CHECK (total > 0)
);

-- 6. Detalle de Pedidos
CREATE TABLE detalle_pedidos (
    id SERIAL PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
  
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    CONSTRAINT cantidad_positiva CHECK (cantidad > 0),
    CONSTRAINT precio_positivo CHECK (precio_unitario > 0)
);

-- 7. Carrito de Compras
CREATE TABLE carrito (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    CONSTRAINT cantidad_positiva CHECK (cantidad > 0),
    UNIQUE(usuario_id, producto_id)
);

-- 8. Reseñas
CREATE TABLE resenas (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    calificacion INT NOT NULL,
    titulo VARCHAR(255),
    comentario TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verificada BOOLEAN DEFAULT FALSE,
    util_votos INT DEFAULT 0,
  
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT calificacion_valida CHECK (calificacion BETWEEN 1 AND 5),
    UNIQUE(producto_id, usuario_id)
);

-- 9. Cupones de Descuento
CREATE TABLE cupones (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(20) NOT NULL, -- 'porcentaje', 'fijo'
    valor DECIMAL(10,2) NOT NULL,
    minimo_compra DECIMAL(10,2),
    maximo_descuento DECIMAL(10,2),
    fecha_inicio DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    usos_maximos INT,
    usos_actuales INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
  
    CONSTRAINT tipo_valido CHECK (tipo IN ('porcentaje', 'fijo')),
    CONSTRAINT valor_positivo CHECK (valor > 0)
);

-- 10. Historial de Precios
CREATE TABLE historial_precios (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL,
    precio_anterior DECIMAL(10,2),
    precio_nuevo DECIMAL(10,2) NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(255),
  
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);
```

---

## Normalización

### Primera Forma Normal (1NF)

Eliminar grupos repetitivos y valores multivaluados.

```sql
-- ❌ Violación de 1NF
CREATE TABLE productos_mal (
    id INT PRIMARY KEY,
    nombre VARCHAR(255),
    colores VARCHAR(255), -- 'rojo,azul,verde' - valores múltiples
    tallas VARCHAR(255)   -- 'S,M,L,XL' - valores múltiples
);

-- ✅ Cumple 1NF
CREATE TABLE productos (
    id INT PRIMARY KEY,
    nombre VARCHAR(255)
);

CREATE TABLE producto_variantes (
    id INT PRIMARY KEY,
    producto_id INT,
    color VARCHAR(50),
    talla VARCHAR(10),
    sku VARCHAR(50),
    stock INT,
  
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);
```

### Segunda Forma Normal (2NF)

Eliminar dependencias parciales (aplica a claves compuestas).

```sql
-- ❌ Violación de 2NF
CREATE TABLE detalle_pedidos_mal (
    pedido_id INT,
    producto_id INT,
    cantidad INT,
    precio_unitario DECIMAL(10,2),
    nombre_producto VARCHAR(255), -- Depende solo de producto_id
    categoria_producto VARCHAR(100), -- Depende solo de producto_id
  
    PRIMARY KEY (pedido_id, producto_id)
);

-- ✅ Cumple 2NF
CREATE TABLE detalle_pedidos (
    pedido_id INT,
    producto_id INT,
    cantidad INT,
    precio_unitario DECIMAL(10,2),
  
    PRIMARY KEY (pedido_id, producto_id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Los datos del producto están en su propia tabla
CREATE TABLE productos (
    id INT PRIMARY KEY,
    nombre VARCHAR(255),
    categoria_id INT
);
```

### Tercera Forma Normal (3NF)

Eliminar dependencias transitivas.

```sql
-- ❌ Violación de 3NF
CREATE TABLE pedidos_mal (
    id INT PRIMARY KEY,
    usuario_id INT,
    usuario_email VARCHAR(255), -- Depende transitivamente de usuario_id
    usuario_nombre VARCHAR(100), -- Depende transitivamente de usuario_id
    total DECIMAL(10,2)
);

-- ✅ Cumple 3NF
CREATE TABLE pedidos (
    id INT PRIMARY KEY,
    usuario_id INT,
    total DECIMAL(10,2),
  
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE usuarios (
    id INT PRIMARY KEY,
    email VARCHAR(255),
    nombre VARCHAR(100)
);
```

### Forma Normal de Boyce-Codd (BCNF)

Todo determinante debe ser super clave.

```sql
-- Ejemplo: Sistema de reservas
-- ❌ Violación de BCNF
CREATE TABLE reservas_mal (
    estudiante_id INT,
    curso_id INT,
    instructor_id INT, -- Un instructor enseña solo un curso
  
    PRIMARY KEY (estudiante_id, curso_id)
);

-- ✅ Cumple BCNF
CREATE TABLE cursos (
    id INT PRIMARY KEY,
    nombre VARCHAR(255),
    instructor_id INT UNIQUE -- Un instructor por curso
);

CREATE TABLE reservas (
    estudiante_id INT,
    curso_id INT,
  
    PRIMARY KEY (estudiante_id, curso_id),
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);
```

---

## Tipos de Relaciones

### 1. Uno a Uno (1:1)

```sql
-- Usuario y su perfil detallado
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE perfiles_usuarios (
    usuario_id INT PRIMARY KEY, -- PK y FK al mismo tiempo
    bio TEXT,
    avatar_url VARCHAR(500),
    configuracion_privacidad JSON,
    fecha_ultimo_login TIMESTAMP,
  
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Consulta con JOIN
SELECT u.email, p.bio, p.avatar_url
FROM usuarios u
LEFT JOIN perfiles_usuarios p ON u.id = p.usuario_id
WHERE u.id = 1;
```

### 2. Uno a Muchos (1:N)

```sql
-- Un usuario puede tener muchos pedidos
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    total DECIMAL(10,2),
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Consultas típicas
-- Obtener todos los pedidos de un usuario
SELECT p.*, u.email
FROM pedidos p
JOIN usuarios u ON p.usuario_id = u.id
WHERE u.id = 1
ORDER BY p.fecha_pedido DESC;

-- Obtener usuarios con su conteo de pedidos
SELECT u.email, COUNT(p.id) as total_pedidos
FROM usuarios u
LEFT JOIN pedidos p ON u.id = p.usuario_id
GROUP BY u.id, u.email;
```

### 3. Muchos a Muchos (N:M)

```sql
-- Productos y categorías (un producto puede estar en varias categorías)
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2)
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de unión/junction
CREATE TABLE producto_categorias (
    producto_id INT,
    categoria_id INT,
    es_principal BOOLEAN DEFAULT FALSE,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
    PRIMARY KEY (producto_id, categoria_id),
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- Consultas complejas
-- Productos con sus categorías
SELECT p.nombre, 
       STRING_AGG(c.nombre, ', ') as categorias
FROM productos p
LEFT JOIN producto_categorias pc ON p.id = pc.producto_id
LEFT JOIN categorias c ON pc.categoria_id = c.id
GROUP BY p.id, p.nombre;

-- Categorías con conteo de productos
SELECT c.nombre, 
       COUNT(pc.producto_id) as total_productos
FROM categorias c
LEFT JOIN producto_categorias pc ON c.id = pc.categoria_id
GROUP BY c.id, c.nombre
ORDER BY total_productos DESC;
```

### 4. Relaciones Auto-referenciadas

```sql
-- Categorías jerárquicas
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria_padre_id INT,
    nivel INT DEFAULT 1,
  
    FOREIGN KEY (categoria_padre_id) REFERENCES categorias(id)
);

-- Insertar datos jerárquicos
INSERT INTO categorias (nombre, categoria_padre_id, nivel) VALUES
('Electrónicos', NULL, 1),
('Computadoras', 1, 2),
('Laptops', 2, 3),
('Gaming', 2, 3),
('Smartphones', 1, 2);

-- Consulta recursiva para obtener jerarquía completa
WITH RECURSIVE jerarquia_categorias AS (
    -- Caso base: categorías raíz
    SELECT id, nombre, categoria_padre_id, nivel, nombre as ruta
    FROM categorias 
    WHERE categoria_padre_id IS NULL
  
    UNION ALL
  
    -- Caso recursivo: categorías hijas
    SELECT c.id, c.nombre, c.categoria_padre_id, c.nivel,
           CONCAT(jc.ruta, ' > ', c.nombre) as ruta
    FROM categorias c
    JOIN jerarquia_categorias jc ON c.categoria_padre_id = jc.id
)
SELECT * FROM jerarquia_categorias ORDER BY ruta;
```

---

## Consultas SQL Básicas

### SELECT Fundamentales

```sql
-- Selección básica
SELECT nombre, precio FROM productos;

-- Con condiciones
SELECT * FROM productos 
WHERE precio > 100 AND stock > 0;

-- Ordenamiento
SELECT nombre, precio FROM productos 
ORDER BY precio DESC, nombre ASC;

-- Limitación de resultados
SELECT * FROM productos 
ORDER BY fecha_creacion DESC 
LIMIT 10;

-- Valores únicos
SELECT DISTINCT categoria_id FROM productos;

-- Patrones de texto
SELECT * FROM usuarios 
WHERE email LIKE '%@gmail.com' 
   OR nombre ILIKE '%juan%'; -- ILIKE es case-insensitive en PostgreSQL

-- Rangos
SELECT * FROM productos 
WHERE precio BETWEEN 50 AND 200;

-- Listas de valores
SELECT * FROM productos 
WHERE categoria_id IN (1, 2, 3);

-- Valores NULL
SELECT * FROM usuarios 
WHERE telefono IS NOT NULL;
```

### Funciones de Agregación

```sql
-- Conteos
SELECT COUNT(*) as total_productos FROM productos;
SELECT COUNT(DISTINCT usuario_id) as usuarios_activos FROM pedidos;

-- Sumas y promedios
SELECT 
    SUM(total) as ventas_totales,
    AVG(total) as ticket_promedio,
    MIN(total) as venta_minima,
    MAX(total) as venta_maxima
FROM pedidos 
WHERE fecha_pedido >= '2024-01-01';

-- Agrupación
SELECT 
    categoria_id,
    COUNT(*) as cantidad_productos,
    AVG(precio) as precio_promedio,
    SUM(stock) as stock_total
FROM productos 
GROUP BY categoria_id
HAVING COUNT(*) > 5
ORDER BY precio_promedio DESC;
```

### Subconsultas

```sql
-- Subconsulta escalar
SELECT nombre, precio,
    (SELECT AVG(precio) FROM productos) as precio_promedio
FROM productos;

-- Subconsulta en WHERE
SELECT * FROM productos
WHERE precio > (
    SELECT AVG(precio) FROM productos
);

-- EXISTS
SELECT u.* FROM usuarios u
WHERE EXISTS (
    SELECT 1 FROM pedidos p 
    WHERE p.usuario_id = u.id 
    AND p.fecha_pedido >= '2024-01-01'
);

-- IN con subconsulta
SELECT * FROM productos
WHERE categoria_id IN (
    SELECT id FROM categorias 
    WHERE nombre LIKE '%Electrónicos%'
);
```

---

## Consultas SQL Avanzadas

### JOINs Avanzados

```sql
-- INNER JOIN: Solo registros que coinciden
SELECT u.nombre, p.numero_pedido, p.total
FROM usuarios u
INNER JOIN pedidos p ON u.id = p.usuario_id;

-- LEFT JOIN: Todos los usuarios, con o sin pedidos
SELECT u.nombre, COUNT(p.id) as total_pedidos
FROM usuarios u
LEFT JOIN pedidos p ON u.id = p.usuario_id
GROUP BY u.id, u.nombre;

-- RIGHT JOIN: Todos los pedidos, con información de usuario
SELECT u.nombre, p.numero_pedido
FROM usuarios u
RIGHT JOIN pedidos p ON u.id = p.usuario_id;

-- FULL OUTER JOIN: Todos los registros de ambas tablas
SELECT u.nombre, p.numero_pedido
FROM usuarios u
FULL OUTER JOIN pedidos p ON u.id = p.usuario_id;

-- CROSS JOIN: Producto cartesiano
SELECT p.nombre as producto, c.nombre as categoria
FROM productos p
CROSS JOIN categorias c;

-- SELF JOIN: Unir tabla consigo misma
SELECT 
    c1.nombre as categoria,
    c2.nombre as categoria_padre
FROM categorias c1
LEFT JOIN categorias c2 ON c1.categoria_padre_id = c2.id;
```

### Window Functions

```sql
-- ROW_NUMBER: Numeración de filas
SELECT 
    nombre,
    precio,
    ROW_NUMBER() OVER (ORDER BY precio DESC) as ranking_precio
FROM productos;

-- RANK y DENSE_RANK
SELECT 
    nombre,
    precio,
    RANK() OVER (ORDER BY precio DESC) as rank_precio,
    DENSE_RANK() OVER (ORDER BY precio DESC) as dense_rank_precio
FROM productos;

-- PARTITION BY: Ventanas por grupos
SELECT 
    nombre,
    categoria_id,
    precio,
    ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY precio DESC) as rank_en_categoria
FROM productos;

-- Funciones de agregación como ventana
SELECT 
    fecha_pedido,
    total,
    SUM(total) OVER (ORDER BY fecha_pedido) as total_acumulado,
    AVG(total) OVER (ORDER BY fecha_pedido ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) as promedio_movil
FROM pedidos
ORDER BY fecha_pedido;

-- LAG y LEAD: Valores de filas anteriores/siguientes
SELECT 
    fecha_pedido,
    total,
    LAG(total, 1) OVER (ORDER BY fecha_pedido) as venta_anterior,
    LEAD(total, 1) OVER (ORDER BY fecha_pedido) as venta_siguiente,
    total - LAG(total, 1) OVER (ORDER BY fecha_pedido) as diferencia
FROM pedidos
ORDER BY fecha_pedido;
```

### Common Table Expressions (CTEs)

```sql
-- CTE Básico
WITH ventas_mensuales AS (
    SELECT 
        DATE_TRUNC('month', fecha_pedido) as mes,
        SUM(total) as ventas_mes
    FROM pedidos
    GROUP BY DATE_TRUNC('month', fecha_pedido)
)
SELECT 
    mes,
    ventas_mes,
    LAG(ventas_mes) OVER (ORDER BY mes) as ventas_mes_anterior,
    ventas_mes - LAG(ventas_mes) OVER (ORDER BY mes) as crecimiento
FROM ventas_mensuales
ORDER BY mes;

-- CTE Recursivo: Jerarquías
WITH RECURSIVE empleados_jerarquia AS (
    -- Caso base: jefes (sin supervisor)
    SELECT id, nombre, supervisor_id, 1 as nivel, nombre as ruta
    FROM empleados
    WHERE supervisor_id IS NULL
  
    UNION ALL
  
    -- Caso recursivo: subordinados
    SELECT e.id, e.nombre, e.supervisor_id, ej.nivel + 1,
           CONCAT(ej.ruta, ' > ', e.nombre)
    FROM empleados e
    JOIN empleados_jerarquia ej ON e.supervisor_id = ej.id
)
SELECT * FROM empleados_jerarquia ORDER BY nivel, ruta;

-- Múltiples CTEs
WITH productos_populares AS (
    SELECT producto_id, SUM(cantidad) as total_vendido
    FROM detalle_pedidos
    GROUP BY producto_id
    HAVING SUM(cantidad) > 100
),
categorias_activas AS (
    SELECT DISTINCT categoria_id
    FROM productos
    WHERE activo = TRUE
)
SELECT p.nombre, pp.total_vendido, c.nombre as categoria
FROM productos_populares pp
JOIN productos p ON pp.producto_id = p.id
JOIN categorias c ON p.categoria_id = c.id
JOIN categorias_activas ca ON c.id = ca.categoria_id;
```

### Consultas Pivot

```sql
-- Pivot manual: Ventas por mes y categoría
SELECT 
    DATE_TRUNC('month', p.fecha_pedido) as mes,
    SUM(CASE WHEN c.nombre = 'Electrónicos' THEN dp.subtotal ELSE 0 END) as electronicos,
    SUM(CASE WHEN c.nombre = 'Ropa' THEN dp.subtotal ELSE 0 END) as ropa,
    SUM(CASE WHEN c.nombre = 'Hogar' THEN dp.subtotal ELSE 0 END) as hogar,
    SUM(dp.subtotal) as total_mes
FROM pedidos p
JOIN detalle_pedidos dp ON p.id = dp.pedido_id
JOIN productos pr ON dp.producto_id = pr.id
JOIN categorias c ON pr.categoria_id = c.id
GROUP BY DATE_TRUNC('month', p.fecha_pedido)
ORDER BY mes;

-- Usando CROSSTAB (PostgreSQL)
-- Primero crear la extensión: CREATE EXTENSION tablefunc;
SELECT * FROM crosstab(
    'SELECT categoria_id, EXTRACT(month FROM fecha_pedido), SUM(total)
     FROM pedidos p
     JOIN detalle_pedidos dp ON p.id = dp.pedido_id
     JOIN productos pr ON dp.producto_id = pr.id
     GROUP BY categoria_id, EXTRACT(month FROM fecha_pedido)
     ORDER BY categoria_id, EXTRACT(month FROM fecha_pedido)',
  
    'VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10), (11), (12)'
) AS resultado(categoria_id int, ene numeric, feb numeric, mar numeric, 
               abr numeric, may numeric, jun numeric, jul numeric, 
               ago numeric, sep numeric, oct numeric, nov numeric, dic numeric);
```

### Análisis de Series Temporales

```sql
-- Análisis de tendencias
WITH series_diaria AS (
    SELECT 
        DATE(fecha_pedido) as fecha,
        COUNT(*) as pedidos_dia,
        SUM(total) as ventas_dia
    FROM pedidos
    WHERE fecha_pedido >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(fecha_pedido)
),
tendencias AS (
    SELECT 
        fecha,
        pedidos_dia,
        ventas_dia,
        AVG(pedidos_dia) OVER (ORDER BY fecha ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as promedio_movil_7d,
        AVG(ventas_dia) OVER (ORDER BY fecha ROWS BETWEEN 29 PRECEDING AND CURRENT ROW) as promedio_movil_30d
    FROM series_diaria
)
SELECT 
    fecha,
    pedidos_dia,
    promedio_movil_7d,
    CASE 
        WHEN pedidos_dia > promedio_movil_7d * 1.2 THEN 'Alto'
        WHEN pedidos_dia < promedio_movil_7d * 0.8 THEN 'Bajo'
        ELSE 'Normal'
    END as categoria_actividad
FROM tendencias
ORDER BY fecha;

-- Análisis de cohortes (usuarios por mes de registro)
WITH cohorte_usuarios AS (
    SELECT 
        u.id,
        DATE_TRUNC('month', u.fecha_creacion) as mes_registro
    FROM usuarios u
),
actividad_mensual AS (
    SELECT 
        cu.mes_registro,
        DATE_TRUNC('month', p.fecha_pedido) as mes_actividad,
        COUNT(DISTINCT cu.id) as usuarios_activos
    FROM cohorte_usuarios cu
    LEFT JOIN pedidos p ON cu.id = p.usuario_id
    WHERE p.fecha_pedido IS NOT NULL
    GROUP BY cu.mes_registro, DATE_TRUNC('month', p.fecha_pedido)
)
SELECT 
    mes_registro,
    mes_actividad,
    usuarios_activos,
    EXTRACT(MONTH FROM AGE(mes_actividad, mes_registro)) as meses_desde_registro
FROM actividad_mensual
ORDER BY mes_registro, mes_actividad;
```

---

## Índices y Optimización

### Tipos de Índices

```sql
-- Índice B-Tree (por defecto)
CREATE INDEX idx_productos_precio ON productos(precio);
CREATE INDEX idx_productos_categoria ON productos(categoria_id);

-- Índice compuesto
CREATE INDEX idx_pedidos_usuario_fecha ON pedidos(usuario_id, fecha_pedido DESC);

-- Índice único
CREATE UNIQUE INDEX idx_usuarios_email ON usuarios(email);

-- Índice parcial
CREATE INDEX idx_productos_activos ON productos(categoria_id) 
WHERE activo = TRUE;

-- Índice de expresión
CREATE INDEX idx_usuarios_email_lower ON usuarios(LOWER(email));

-- Índice en columnas JSON (PostgreSQL)
CREATE INDEX idx_productos_especificaciones ON productos 
USING GIN (especificaciones);

-- Índice de texto completo
CREATE INDEX idx_productos_busqueda ON productos 
USING GIN (to_tsvector('spanish', nombre || ' ' || COALESCE(descripcion, '')));
```

### Análisis de Rendimiento

```sql
-- EXPLAIN ANALYZE: Analizar plan de ejecución
EXPLAIN ANALYZE 
SELECT p.nombre, c.nombre as categoria
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
WHERE p.precio > 100;

-- Estadísticas de uso de índices
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Consultas lentas (requiere pg_stat_statements)
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    stddev_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Optimización de Consultas

```sql
-- ❌ Consulta ineficiente
SELECT * FROM productos 
WHERE UPPER(nombre) LIKE '%LAPTOP%';

-- ✅ Consulta optimizada con índice funcional
CREATE INDEX idx_productos_nombre_upper ON productos(UPPER(nombre));
SELECT * FROM productos 
WHERE UPPER(nombre) LIKE '%LAPTOP%';

-- ❌ Subconsulta correlacionada ineficiente
SELECT * FROM usuarios u
WHERE (
    SELECT COUNT(*) FROM pedidos p 
    WHERE p.usuario_id = u.id
) > 5;

-- ✅ JOIN más eficiente
SELECT DISTINCT u.*
FROM usuarios u
JOIN (
    SELECT usuario_id
    FROM pedidos
    GROUP BY usuario_id
    HAVING COUNT(*) > 5
) p ON u.id = p.usuario_id;

-- Uso eficiente de EXISTS vs IN
-- ✅ EXISTS para verificar existencia
SELECT * FROM usuarios u
WHERE EXISTS (
    SELECT 1 FROM pedidos p 
    WHERE p.usuario_id = u.id
);

-- ✅ IN para listas pequeñas conocidas
SELECT * FROM productos
WHERE categoria_id IN (1, 2, 3);
```

### Particionamiento

```sql
-- Particionamiento por rango (fechas)
CREATE TABLE pedidos_particionado (
    id SERIAL,
    usuario_id INT NOT NULL,
    fecha_pedido DATE NOT NULL,
    total DECIMAL(10,2),
    -- otros campos...
) PARTITION BY RANGE (fecha_pedido);

-- Crear particiones
CREATE TABLE pedidos_2024_q1 PARTITION OF pedidos_particionado
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE pedidos_2024_q2 PARTITION OF pedidos_particionado
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

-- Particionamiento por hash
CREATE TABLE logs_particionado (
    id SERIAL,
    usuario_id INT,
    accion TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY HASH (usuario_id);

CREATE TABLE logs_part_0 PARTITION OF logs_particionado
    FOR VALUES WITH (modulus 4, remainder 0);

CREATE TABLE logs_part_1 PARTITION OF logs_particionado
    FOR VALUES WITH (modulus 4, remainder 1);
```

---

## Transacciones y Concurrencia

### Control de Transacciones

```sql
-- Transacción básica
BEGIN;
    INSERT INTO usuarios (email, nombre) VALUES ('nuevo@email.com', 'Nuevo Usuario');
    INSERT INTO perfiles_usuarios (usuario_id, bio) VALUES (CURRVAL('usuarios_id_seq'), 'Bio del usuario');
COMMIT;

-- Transacción con rollback condicional
BEGIN;
    UPDATE productos SET stock = stock - 1 WHERE id = 1;
  
    -- Verificar que el stock no sea negativo
    IF (SELECT stock FROM productos WHERE id = 1) < 0 THEN
        ROLLBACK;
        RAISE EXCEPTION 'Stock insuficiente';
    ELSE
        COMMIT;
    END IF;

-- Savepoints para rollback parcial
BEGIN;
    INSERT INTO usuarios (email, nombre) VALUES ('test1@email.com', 'Test 1');
    SAVEPOINT sp1;
  
    INSERT INTO usuarios (email, nombre) VALUES ('test2@email.com', 'Test 2');
    SAVEPOINT sp2;
  
    -- Si hay un error, rollback solo hasta sp1
    INSERT INTO usuarios (email, nombre) VALUES ('invalid', 'Invalid'); -- Falla por email inválido
    ROLLBACK TO sp2;
  
    -- Continuar con la transacción
    INSERT INTO usuarios (email, nombre) VALUES ('test3@email.com', 'Test 3');
COMMIT;
```

### Niveles de Aislamiento

```sql
-- READ UNCOMMITTED: Lee datos no confirmados
BEGIN TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
    SELECT * FROM productos WHERE id = 1;
COMMIT;

-- READ COMMITTED (por defecto): Solo lee datos confirmados
BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;
    SELECT * FROM productos WHERE id = 1;
    -- Otra transacción puede modificar el registro entre lecturas
    SELECT * FROM productos WHERE id = 1; -- Puede ser diferente
COMMIT;

-- REPEATABLE READ: Lecturas consistentes durante la transacción
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
    SELECT * FROM productos WHERE precio > 100; -- 10 registros
    -- Otra transacción inserta productos con precio > 100
    SELECT * FROM productos WHERE precio > 100; -- Sigue siendo 10 registros
COMMIT;

-- SERIALIZABLE: Máximo aislamiento
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    SELECT SUM(stock) FROM productos WHERE categoria_id = 1;
    UPDATE productos SET precio = precio * 1.1 WHERE categoria_id = 1;
COMMIT;
```

### Bloqueos (Locks)

```sql
-- SELECT ... FOR UPDATE: Bloqueo exclusivo para escritura
BEGIN;
    SELECT * FROM productos WHERE id = 1 FOR UPDATE;
    -- Nadie más puede modificar este registro
    UPDATE productos SET stock = stock - 1 WHERE id = 1;
COMMIT;

-- SELECT ... FOR SHARE: Bloqueo compartido para lectura
BEGIN;
    SELECT * FROM productos WHERE id = 1 FOR SHARE;
    -- Otros pueden leer pero no modificar
COMMIT;

-- LOCK TABLE: Bloquear tabla completa
BEGIN;
    LOCK TABLE productos IN EXCLUSIVE MODE;
    -- Operaciones exclusivas en la tabla
COMMIT;

-- Manejo de deadlocks
CREATE OR REPLACE FUNCTION procesar_pedido(p_usuario_id INT, p_producto_id INT, p_cantidad INT)
RETURNS BOOLEAN AS $$
DECLARE
    stock_actual INT;
BEGIN
    -- Ordenar locks por ID para evitar deadlocks
    PERFORM pg_advisory_lock(LEAST(p_usuario_id, p_producto_id), GREATEST(p_usuario_id, p_producto_id));
  
    SELECT stock INTO stock_actual FROM productos WHERE id = p_producto_id FOR UPDATE;
  
    IF stock_actual >= p_cantidad THEN
        UPDATE productos SET stock = stock - p_cantidad WHERE id = p_producto_id;
        INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad) 
        VALUES (1, p_producto_id, p_cantidad);
      
        PERFORM pg_advisory_unlock(LEAST(p_usuario_id, p_producto_id), GREATEST(p_usuario_id, p_producto_id));
        RETURN TRUE;
    ELSE
        PERFORM pg_advisory_unlock(LEAST(p_usuario_id, p_producto_id), GREATEST(p_usuario_id, p_producto_id));
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;
```

---

## Funciones y Procedimientos

### Funciones Escalares

```sql
-- Función simple
CREATE OR REPLACE FUNCTION calcular_descuento(precio DECIMAL, porcentaje DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    RETURN precio * (porcentaje / 100);
END;
$$ LANGUAGE plpgsql;

-- Uso
SELECT nombre, precio, calcular_descuento(precio, 15) as precio_descuento
FROM productos;

-- Función con validaciones
CREATE OR REPLACE FUNCTION validar_email(email_input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    IF email_input IS NULL OR email_input = '' THEN
        RETURN FALSE;
    END IF;
  
    IF email_input !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RETURN FALSE;
    END IF;
  
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Función que retorna tabla
CREATE OR REPLACE FUNCTION obtener_productos_categoria(categoria_nombre TEXT)
RETURNS TABLE(
    producto_id INT,
    producto_nombre VARCHAR,
    precio DECIMAL,
    stock INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.nombre, p.precio, p.stock
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id
    WHERE c.nombre ILIKE '%' || categoria_nombre || '%'
    ORDER BY p.nombre;
END;
$$ LANGUAGE plpgsql;

-- Uso
SELECT * FROM obtener_productos_categoria('Electrónicos');
```

### Procedimientos Almacenados

```sql
-- Procedimiento para procesar pedido completo
CREATE OR REPLACE FUNCTION procesar_pedido_completo(
    p_usuario_id INT,
    p_productos JSON,
    p_direccion_envio JSON
)
RETURNS JSON AS $$
DECLARE
    nuevo_pedido_id INT;
    producto_item JSON;
    stock_disponible INT;
    precio_actual DECIMAL;
    subtotal_pedido DECIMAL := 0;
    resultado JSON;
BEGIN
    -- Crear el pedido
    INSERT INTO pedidos (usuario_id, estado, direccion_envio, subtotal, total)
    VALUES (p_usuario_id, 'pendiente', p_direccion_envio, 0, 0)
    RETURNING id INTO nuevo_pedido_id;
  
    -- Procesar cada producto
    FOR producto_item IN SELECT * FROM json_array_elements(p_productos)
    LOOP
        -- Verificar stock
        SELECT stock, precio INTO stock_disponible, precio_actual
        FROM productos 
        WHERE id = (producto_item->>'producto_id')::INT
        FOR UPDATE;
      
        IF stock_disponible < (producto_item->>'cantidad')::INT THEN
            RAISE EXCEPTION 'Stock insuficiente para producto ID %', 
                (producto_item->>'producto_id')::INT;
        END IF;
      
        -- Actualizar stock
        UPDATE productos 
        SET stock = stock - (producto_item->>'cantidad')::INT
        WHERE id = (producto_item->>'producto_id')::INT;
      
        -- Agregar detalle del pedido
        INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
        VALUES (
            nuevo_pedido_id,
            (producto_item->>'producto_id')::INT,
            (producto_item->>'cantidad')::INT,
            precio_actual,
            precio_actual * (producto_item->>'cantidad')::INT
        );
      
        subtotal_pedido := subtotal_pedido + (precio_actual * (producto_item->>'cantidad')::INT);
    END LOOP;
  
    -- Actualizar totales del pedido
    UPDATE pedidos 
    SET subtotal = subtotal_pedido, total = subtotal_pedido
    WHERE id = nuevo_pedido_id;
  
    -- Generar número de pedido
    UPDATE pedidos 
    SET numero_pedido = 'PED-' || LPAD(nuevo_pedido_id::TEXT, 6, '0')
    WHERE id = nuevo_pedido_id;
  
    resultado := json_build_object(
        'pedido_id', nuevo_pedido_id,
        'numero_pedido', 'PED-' || LPAD(nuevo_pedido_id::TEXT, 6, '0'),
        'total', subtotal_pedido,
        'estado', 'procesado_exitosamente'
    );
  
    RETURN resultado;
  
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error procesando pedido: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Uso del procedimiento
SELECT procesar_pedido_completo(
    1, -- usuario_id
    '[{"producto_id": 1, "cantidad": 2}, {"producto_id": 3, "cantidad": 1}]'::JSON,
    '{"calle": "Av. Principal 123", "ciudad": "Buenos Aires", "codigo_postal": "1234"}'::JSON
);
```

### Triggers

```sql
-- Trigger para auditoría
CREATE TABLE auditoria_productos (
    id SERIAL PRIMARY KEY,
    producto_id INT,
    accion VARCHAR(10),
    valores_anteriores JSON,
    valores_nuevos JSON,
    usuario_sistema VARCHAR(100),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION auditoria_productos_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO auditoria_productos (producto_id, accion, valores_nuevos, usuario_sistema)
        VALUES (NEW.id, 'INSERT', row_to_json(NEW), current_user);
        RETURN NEW;
    END IF;
  
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO auditoria_productos (producto_id, accion, valores_anteriores, valores_nuevos, usuario_sistema)
        VALUES (NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), current_user);
        RETURN NEW;
    END IF;
  
    IF TG_OP = 'DELETE' THEN
        INSERT INTO auditoria_productos (producto_id, accion, valores_anteriores, usuario_sistema)
        VALUES (OLD.id, 'DELETE', row_to_json(OLD), current_user);
        RETURN OLD;
    END IF;
  
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers
CREATE TRIGGER trigger_auditoria_productos
    AFTER INSERT OR UPDATE OR DELETE ON productos
    FOR EACH ROW EXECUTE FUNCTION auditoria_productos_trigger();

-- Trigger para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_fecha_productos
    BEFORE UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

-- Trigger de validación
CREATE OR REPLACE FUNCTION validar_stock_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock < 0 THEN
        RAISE EXCEPTION 'El stock no puede ser negativo para el producto %', NEW.nombre;
    END IF;
  
    IF NEW.precio <= 0 THEN
        RAISE EXCEPTION 'El precio debe ser positivo para el producto %', NEW.nombre;
    END IF;
  
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_stock
    BEFORE INSERT OR UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION validar_stock_trigger();
```

---

## Arquitecturas Escalables

### Replicación Maestro-Esclavo

```sql
-- Configuración en postgresql.conf (Maestro)
-- wal_level = replica
-- max_wal_senders = 3
-- wal_keep_segments = 8

-- Crear usuario de replicación
CREATE USER replicator REPLICATION LOGIN CONNECTION LIMIT 1 ENCRYPTED PASSWORD 'password';

-- En pg_hba.conf
-- host replication replicator 192.168.1.0/24 md5

-- Configurar aplicación para usar múltiples conexiones
-- Escrituras van al maestro, lecturas pueden ir a esclavos
CREATE OR REPLACE FUNCTION get_connection_type(query_type TEXT)
RETURNS TEXT AS $$
BEGIN
    CASE query_type
        WHEN 'SELECT' THEN RETURN 'read_replica';
        WHEN 'INSERT', 'UPDATE', 'DELETE' THEN RETURN 'master';
        ELSE RETURN 'master';
    END CASE;
END;
$$ LANGUAGE plpgsql;
```

### Sharding Horizontal

```sql
-- Función de sharding por ID de usuario
CREATE OR REPLACE FUNCTION get_shard_name(user_id INT)
RETURNS TEXT AS $$
BEGIN
    RETURN 'shard_' || (user_id % 4)::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Tabla de configuración de shards
CREATE TABLE shard_config (
    shard_name VARCHAR(50) PRIMARY KEY,
    connection_string TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    min_user_id INT,
    max_user_id INT
);

INSERT INTO shard_config VALUES
('shard_0', 'host=shard0.db.com port=5432 dbname=ecommerce', TRUE, 0, 999999),
('shard_1', 'host=shard1.db.com port=5432 dbname=ecommerce', TRUE, 1000000, 1999999),
('shard_2', 'host=shard2.db.com port=5432 dbname=ecommerce', TRUE, 2000000, 2999999),
('shard_3', 'host=shard3.db.com port=5432 dbname=ecommerce', TRUE, 3000000, 3999999);

-- Vista unificada (usando FDW - Foreign Data Wrappers)
CREATE EXTENSION postgres_fdw;

CREATE SERVER shard_0_server
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'shard0.db.com', port '5432', dbname 'ecommerce');

CREATE FOREIGN TABLE usuarios_shard_0 (
    id INT,
    email VARCHAR(255),
    nombre VARCHAR(100)
) SERVER shard_0_server OPTIONS (schema_name 'public', table_name 'usuarios');

-- Repetir para otros shards...

-- Vista unificada
CREATE VIEW usuarios_global AS
SELECT * FROM usuarios_shard_0
UNION ALL
SELECT * FROM usuarios_shard_1
UNION ALL
SELECT * FROM usuarios_shard_2
UNION ALL
SELECT * FROM usuarios_shard_3;
```

### Cachéo con Redis

```sql
-- Función para generar claves de caché
CREATE OR REPLACE FUNCTION generate_cache_key(
    table_name TEXT,
    query_params JSON
)
RETURNS TEXT AS $$
BEGIN
    RETURN table_name || ':' || MD5(query_params::TEXT);
END;
$$ LANGUAGE plpgsql;

-- Procedimiento para invalidar caché
CREATE OR REPLACE FUNCTION invalidate_cache_trigger()
RETURNS TRIGGER AS $$
DECLARE
    cache_pattern TEXT;
BEGIN
    -- Generar patrón de caché a invalidar
    cache_pattern := TG_TABLE_NAME || ':*';
  
    -- Notificar a la aplicación para limpiar caché
    PERFORM pg_notify('cache_invalidate', cache_pattern);
  
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Crear triggers de invalidación
CREATE TRIGGER cache_invalidate_productos
    AFTER INSERT OR UPDATE OR DELETE ON productos
    FOR EACH ROW EXECUTE FUNCTION invalidate_cache_trigger();
```

### Particionamiento de Datos

```sql
-- Particionamiento por fecha para tablas grandes
CREATE TABLE logs_actividad (
    id BIGSERIAL,
    usuario_id INT,
    accion TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    datos JSON
) PARTITION BY RANGE (timestamp);

-- Crear particiones automáticamente con función
CREATE OR REPLACE FUNCTION crear_particion_mensual(
    tabla_base TEXT,
    fecha_inicio DATE
)
RETURNS VOID AS $$
DECLARE
    nombre_particion TEXT;
    fecha_fin DATE;
BEGIN
    fecha_fin := fecha_inicio + INTERVAL '1 month';
    nombre_particion := tabla_base || '_' || TO_CHAR(fecha_inicio, 'YYYY_MM');
  
    EXECUTE format('
        CREATE TABLE %I PARTITION OF %I
        FOR VALUES FROM (%L) TO (%L)',
        nombre_particion, tabla_base, fecha_inicio, fecha_fin
    );
  
    -- Crear índice en la partición
    EXECUTE format('
        CREATE INDEX %I ON %I (usuario_id, timestamp)',
        'idx_' || nombre_particion || '_usuario_timestamp',
        nombre_particion
    );
END;
$$ LANGUAGE plpgsql;

-- Automatizar creación de particiones
CREATE OR REPLACE FUNCTION mantener_particiones()
RETURNS VOID AS $$
DECLARE
    fecha_actual DATE := CURRENT_DATE;
    i INT;
BEGIN
    -- Crear particiones para los próximos 6 meses
    FOR i IN 0..5 LOOP
        PERFORM crear_particion_mensual(
            'logs_actividad',
            DATE_TRUNC('month', fecha_actual + (i || ' months')::INTERVAL)::DATE
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Ejecutar mantenimiento con cron
SELECT cron.schedule('maintain-partitions', '0 0 1 * *', 'SELECT mantener_particiones()');
```

### Connection Pooling

```sql
-- Configuración para PgBouncer (pgbouncer.ini)
/*
[databases]
ecommerce = host=localhost port=5432 dbname=ecommerce

[pgbouncer]
listen_port = 6432
listen_addr = *
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
server_reset_query = DISCARD ALL
max_client_conn = 100
default_pool_size = 25
*/

-- Monitoreo de conexiones
CREATE VIEW conexiones_activas AS
SELECT 
    datname as base_datos,
    usename as usuario,
    client_addr as ip_cliente,
    state as estado,
    query_start,
    state_change,
    query
FROM pg_stat_activity
WHERE state IS NOT NULL
ORDER BY query_start;

-- Función para matar consultas largas
CREATE OR REPLACE FUNCTION kill_long_queries(max_duration INTERVAL DEFAULT '5 minutes')
RETURNS TABLE(killed_pid INT, killed_query TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pg_terminate_backend(pid) as terminated,
        pid,
        query
    FROM pg_stat_activity
    WHERE state = 'active'
    AND query_start < CURRENT_TIMESTAMP - max_duration
    AND pid != pg_backend_pid();
END;
$$ LANGUAGE plpgsql;
```

---

## Mejores Prácticas

### Naming Conventions

```sql
-- ✅ Convenciones recomendadas
-- Tablas: plural, snake_case
CREATE TABLE usuarios (...);
CREATE TABLE detalle_pedidos (...);

-- Columnas: snake_case, descriptivo
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(255),
    fecha_creacion TIMESTAMP,
    precio_venta DECIMAL(10,2),
    esta_activo BOOLEAN
);

-- Índices: prefijo + tabla + columnas
CREATE INDEX idx_productos_categoria_precio ON productos(categoria_id, precio);
CREATE UNIQUE INDEX unq_usuarios_email ON usuarios(email);

-- Constraints: prefijo + descripción
ALTER TABLE productos ADD CONSTRAINT chk_productos_precio_positivo CHECK (precio > 0);
ALTER TABLE pedidos ADD CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id);

-- Funciones: verbo + descripción
CREATE FUNCTION calcular_descuento(...);
CREATE FUNCTION obtener_productos_categoria(...);

-- Triggers: tabla + propósito + trigger
CREATE TRIGGER productos_auditoria_trigger ...;
CREATE TRIGGER usuarios_timestamp_trigger ...;
```

### Seguridad de Datos

```sql
-- Row Level Security (RLS)
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Policy para que usuarios solo vean sus pedidos
CREATE POLICY pedidos_usuario_policy ON pedidos
    FOR ALL TO app_user
    USING (usuario_id = current_setting('app.current_user_id')::INT);

-- Roles y permisos granulares
-- Crear roles
CREATE ROLE readonly_user;
CREATE ROLE app_user;
CREATE ROLE admin_user;

-- Asignar permisos
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
GRANT SELECT, INSERT, UPDATE ON usuarios, productos, pedidos TO app_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_user;

-- Enmascaramiento de datos sensibles
CREATE OR REPLACE FUNCTION enmascarar_email(email TEXT)
RETURNS TEXT AS $$
BEGIN
    IF email IS NULL THEN RETURN NULL; END IF;
  
    RETURN SUBSTRING(email FROM 1 FOR 2) || 
           REPEAT('*', LENGTH(SPLIT_PART(email, '@', 1)) - 2) ||
           '@' || SPLIT_PART(email, '@', 2);
END;
$$ LANGUAGE plpgsql;

-- Vista con datos enmascarados para reportes
CREATE VIEW usuarios_reporte AS
SELECT 
    id,
    enmascarar_email(email) as email,
    nombre,
    fecha_creacion
FROM usuarios;
```

### Backup y Recovery

```sql
-- Estrategia de backup completa
-- 1. Backup completo diario
-- pg_dump -h localhost -U postgres -d ecommerce -f backup_completo_$(date +%Y%m%d).sql

-- 2. WAL archiving continuo
-- En postgresql.conf:
-- archive_mode = on
-- archive_command = 'cp %p /backup/wal/%f'

-- 3. Backup incremental con pg_basebackup
-- pg_basebackup -h localhost -D /backup/base -U replicator -P -W

-- Función para limpiar backups antiguos
CREATE OR REPLACE FUNCTION limpiar_backups_antiguos()
RETURNS VOID AS $$
BEGIN
    -- Lógica específica del sistema de archivos
    -- Generalmente manejado por scripts del sistema
    RAISE NOTICE 'Ejecutar limpieza de backups en el sistema de archivos';
END;
$$ LANGUAGE plpgsql;

-- Point-in-time recovery
-- pg_ctl stop -D /var/lib/postgresql/data
-- rm -rf /var/lib/postgresql/data/*
-- pg_basebackup -h backup_server -D /var/lib/postgresql/data -U replicator
-- Crear recovery.conf con target time
```

### Optimización de Consultas

```sql
-- Análisis de consultas problemáticas
CREATE VIEW consultas_lentas AS
SELECT 
    query,
    calls,
    total_time / calls as tiempo_promedio,
    total_time,
    rows / calls as filas_promedio,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
WHERE calls > 10
ORDER BY total_time DESC;

-- Función para análisis de índices no utilizados
CREATE OR REPLACE FUNCTION indices_no_utilizados()
RETURNS TABLE(
    schema_name TEXT,
    table_name TEXT,
    index_name TEXT,
    index_size TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname::TEXT,
        tablename::TEXT,
        indexname::TEXT,
        pg_size_pretty(pg_relation_size(indexrelid))::TEXT
    FROM pg_stat_user_indexes pui
    JOIN pg_index pi ON pui.indexrelid = pi.indexrelid
    WHERE idx_scan = 0
    AND NOT pi.indisunique
    AND NOT pi.indisprimary
    ORDER BY pg_relation_size(indexrelid) DESC;
END;
$$ LANGUAGE plpgsql;

-- Recopilar estadísticas automáticamente
-- En postgresql.conf:
-- shared_preload_libraries = 'pg_stat_statements'
-- pg_stat_statements.max = 10000
-- pg_stat_statements.track = all
```

### Versionado de Schema

```sql
-- Tabla de versiones de schema
CREATE TABLE schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checksum TEXT
);

-- Función para aplicar migración
CREATE OR REPLACE FUNCTION aplicar_migracion(
    p_version VARCHAR(50),
    p_description TEXT,
    p_sql TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    checksum_calculado TEXT;
BEGIN
    -- Verificar si ya fue aplicada
    IF EXISTS (SELECT 1 FROM schema_migrations WHERE version = p_version) THEN
        RAISE NOTICE 'Migración % ya aplicada', p_version;
        RETURN FALSE;
    END IF;
  
    -- Calcular checksum
    checksum_calculado := MD5(p_sql);
  
    -- Ejecutar migración en transacción
    BEGIN
        EXECUTE p_sql;
      
        INSERT INTO schema_migrations (version, description, checksum)
        VALUES (p_version, p_description, checksum_calculado);
      
        RAISE NOTICE 'Migración % aplicada exitosamente', p_version;
        RETURN TRUE;
      
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Error aplicando migración %: %', p_version, SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;

-- Ejemplo de uso
SELECT aplicar_migracion(
    '2024_01_15_001',
    'Agregar columna estado a tabla usuarios',
    'ALTER TABLE usuarios ADD COLUMN estado VARCHAR(20) DEFAULT ''activo'''
);
```

---

## Casos de Uso Reales

### Sistema de Inventario en Tiempo Real

```sql
-- Tabla de movimientos de inventario
CREATE TABLE movimientos_inventario (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo_movimiento VARCHAR(20) NOT NULL, -- 'entrada', 'salida', 'ajuste'
    cantidad INT NOT NULL,
    stock_anterior INT NOT NULL,
    stock_nuevo INT NOT NULL,
    motivo TEXT,
    usuario_id INT,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    CONSTRAINT tipo_movimiento_valido CHECK (tipo_movimiento IN ('entrada', 'salida', 'ajuste'))
);

-- Función para movimiento de stock seguro
CREATE OR REPLACE FUNCTION mover_stock(
    p_producto_id INT,
    p_tipo VARCHAR(20),
    p_cantidad INT,
    p_motivo TEXT,
    p_usuario_id INT
)
RETURNS JSON AS $$
DECLARE
    stock_actual INT;
    stock_nuevo INT;
    resultado JSON;
BEGIN
    -- Bloquear el producto para evitar condiciones de carrera
    SELECT stock INTO stock_actual 
    FROM productos 
    WHERE id = p_producto_id 
    FOR UPDATE;
  
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Producto no encontrado: %', p_producto_id;
    END IF;
  
    -- Calcular nuevo stock
    CASE p_tipo
        WHEN 'entrada' THEN
            stock_nuevo := stock_actual + p_cantidad;
        WHEN 'salida' THEN
            stock_nuevo := stock_actual - p_cantidad;
        WHEN 'ajuste' THEN
            stock_nuevo := p_cantidad;
    END CASE;
  
    -- Validar stock no negativo
    IF stock_nuevo < 0 THEN
        RAISE EXCEPTION 'Stock insuficiente. Actual: %, Solicitado: %', stock_actual, p_cantidad;
    END IF;
  
    -- Actualizar stock
    UPDATE productos 
    SET stock = stock_nuevo,
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id = p_producto_id;
  
    -- Registrar movimiento
    INSERT INTO movimientos_inventario 
    (producto_id, tipo_movimiento, cantidad, stock_anterior, stock_nuevo, motivo, usuario_id)
    VALUES (p_producto_id, p_tipo, p_cantidad, stock_actual, stock_nuevo, p_motivo, p_usuario_id);
  
    resultado := json_build_object(
        'producto_id', p_producto_id,
        'stock_anterior', stock_actual,
        'stock_nuevo', stock_nuevo,
        'movimiento', p_tipo,
        'cantidad', p_cantidad,
        'timestamp', CURRENT_TIMESTAMP
    );
  
    -- Notificar cambio de stock
    PERFORM pg_notify('stock_change', resultado::TEXT);
  
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- Vista de productos con stock bajo
CREATE VIEW productos_stock_bajo AS
SELECT 
    p.id,
    p.nombre,
    p.stock,
    p.stock_minimo,
    c.nombre as categoria,
    CASE 
        WHEN p.stock = 0 THEN 'Sin Stock'
        WHEN p.stock <= p.stock_minimo THEN 'Stock Crítico'
        ELSE 'Stock Bajo'
    END as estado_stock
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
WHERE p.stock <= p.stock_minimo
ORDER BY p.stock ASC;
```

### Sistema de Análisis de Ventas

```sql
-- Métricas de ventas por período
CREATE OR REPLACE FUNCTION metricas_ventas(
    fecha_inicio DATE,
    fecha_fin DATE,
    agrupacion TEXT DEFAULT 'day' -- 'day', 'week', 'month'
)
RETURNS TABLE(
    periodo TEXT,
    total_pedidos BIGINT,
    total_ventas DECIMAL,
    ticket_promedio DECIMAL,
    productos_vendidos BIGINT,
    clientes_unicos BIGINT
) AS $$
DECLARE
    formato_fecha TEXT;
BEGIN
    -- Determinar formato según agrupación
    CASE agrupacion
        WHEN 'day' THEN formato_fecha := 'YYYY-MM-DD';
        WHEN 'week' THEN formato_fecha := 'YYYY-"W"WW';
        WHEN 'month' THEN formato_fecha := 'YYYY-MM';
        ELSE RAISE EXCEPTION 'Agrupación no válida: %', agrupacion;
    END CASE;
  
    RETURN QUERY
    EXECUTE format('
        SELECT 
            TO_CHAR(DATE_TRUNC(%L, p.fecha_pedido), %L) as periodo,
            COUNT(p.id)::BIGINT as total_pedidos,
            SUM(p.total) as total_ventas,
            AVG(p.total) as ticket_promedio,
            SUM(dp.cantidad)::BIGINT as productos_vendidos,
            COUNT(DISTINCT p.usuario_id)::BIGINT as clientes_unicos
        FROM pedidos p
        JOIN detalle_pedidos dp ON p.id = dp.pedido_id
        WHERE p.fecha_pedido BETWEEN %L AND %L
        AND p.estado != ''cancelado''
        GROUP BY DATE_TRUNC(%L, p.fecha_pedido)
        ORDER BY DATE_TRUNC(%L, p.fecha_pedido)',
        agrupacion, formato_fecha, fecha_inicio, fecha_fin, agrupacion, agrupacion
    );
END;
$$ LANGUAGE plpgsql;

-- Análisis RFM (Recency, Frequency, Monetary)
CREATE OR REPLACE FUNCTION analisis_rfm()
RETURNS TABLE(
    usuario_id INT,
    email TEXT,
    recency_days INT,
    frequency_orders BIGINT,
    monetary_value DECIMAL,
    rfm_score TEXT,
    segmento TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH rfm_data AS (
        SELECT 
            u.id as usuario_id,
            u.email,
            EXTRACT(DAYS FROM CURRENT_DATE - MAX(p.fecha_pedido))::INT as recency_days,
            COUNT(p.id) as frequency_orders,
            SUM(p.total) as monetary_value
        FROM usuarios u
        LEFT JOIN pedidos p ON u.id = p.usuario_id AND p.estado != 'cancelado'
        GROUP BY u.id, u.email
    ),
    rfm_scores AS (
        SELECT 
            *,
            NTILE(5) OVER (ORDER BY recency_days DESC) as r_score,
            NTILE(5) OVER (ORDER BY frequency_orders) as f_score,
            NTILE(5) OVER (ORDER BY monetary_value) as m_score
        FROM rfm_data
    )
    SELECT 
        rs.usuario_id,
        rs.email,
        rs.recency_days,
        rs.frequency_orders,
        rs.monetary_value,
        CONCAT(rs.r_score, rs.f_score, rs.m_score) as rfm_score,
        CASE 
            WHEN rs.r_score >= 4 AND rs.f_score >= 4 AND rs.m_score >= 4 THEN 'Champions'
            WHEN rs.r_score >= 2 AND rs.f_score >= 3 AND rs.m_score >= 3 THEN 'Loyal Customers'
            WHEN rs.r_score >= 3 AND rs.f_score <= 2 AND rs.m_score <= 2 THEN 'Potential Loyalists'
            WHEN rs.r_score >= 4 AND rs.f_score <= 1 AND rs.m_score <= 1 THEN 'New Customers'
            WHEN rs.r_score <= 2 AND rs.f_score >= 2 AND rs.m_score >= 2 THEN 'At Risk'
            WHEN rs.r_score <= 1 AND rs.f_score >= 4 AND rs.m_score >= 4 THEN 'Cannot Lose Them'
            ELSE 'Others'
        END as segmento
    FROM rfm_scores rs;
END;
$$ LANGUAGE plpgsql;

-- Dashboard de KPIs en tiempo real
CREATE MATERIALIZED VIEW dashboard_kpis AS
WITH fecha_actual AS (SELECT CURRENT_DATE as hoy),
ventas_hoy AS (
    SELECT 
        COUNT(*) as pedidos_hoy,
        COALESCE(SUM(total), 0) as ventas_hoy
    FROM pedidos 
    WHERE DATE(fecha_pedido) = CURRENT_DATE
),
ventas_mes AS (
    SELECT 
        COUNT(*) as pedidos_mes,
        COALESCE(SUM(total), 0) as ventas_mes
    FROM pedidos 
    WHERE DATE_TRUNC('month', fecha_pedido) = DATE_TRUNC('month', CURRENT_DATE)
),
comparacion_mes_anterior AS (
    SELECT 
        COALESCE(SUM(total), 0) as ventas_mes_anterior
    FROM pedidos 
    WHERE DATE_TRUNC('month', fecha_pedido) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
)
SELECT 
    CURRENT_TIMESTAMP as ultima_actualizacion,
    vh.pedidos_hoy,
    vh.ventas_hoy,
    vm.pedidos_mes,
    vm.ventas_mes,
    cma.ventas_mes_anterior,
    CASE 
        WHEN cma.ventas_mes_anterior > 0 THEN 
            ROUND(((vm.ventas_mes - cma.ventas_mes_anterior) / cma.ventas_mes_anterior * 100)::NUMERIC, 2)
        ELSE 0 
    END as crecimiento_porcentual,
    (SELECT COUNT(*) FROM productos WHERE stock <= stock_minimo) as productos_stock_bajo,
    (SELECT COUNT(DISTINCT usuario_id) FROM pedidos WHERE DATE(fecha_pedido) = CURRENT_DATE) as clientes_activos_hoy
FROM ventas_hoy vh, ventas_mes vm, comparacion_mes_anterior cma;

-- Refrescar vista materializada automáticamente
CREATE OR REPLACE FUNCTION refresh_dashboard_kpis()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW dashboard_kpis;
    PERFORM pg_notify('dashboard_updated', 'KPIs actualizados: ' || CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

-- Programar actualización cada 15 minutos
SELECT cron.schedule('refresh-dashboard', '*/15 * * * *', 'SELECT refresh_dashboard_kpis()');
```

### Sistema de Recomendaciones

```sql
-- Tabla para almacenar interacciones de usuario
CREATE TABLE interacciones_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    tipo_interaccion VARCHAR(20) NOT NULL, -- 'view', 'cart', 'purchase', 'like'
    peso DECIMAL(3,2) DEFAULT 1.0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Función para registrar interacción
CREATE OR REPLACE FUNCTION registrar_interaccion(
    p_usuario_id INT,
    p_producto_id INT,
    p_tipo VARCHAR(20)
)
RETURNS VOID AS $$
DECLARE
    peso_interaccion DECIMAL(3,2);
BEGIN
    -- Asignar peso según tipo de interacción
    peso_interaccion := CASE p_tipo
        WHEN 'view' THEN 0.1
        WHEN 'cart' THEN 0.5
        WHEN 'purchase' THEN 1.0
        WHEN 'like' THEN 0.3
        ELSE 0.1
    END;
  
    INSERT INTO interacciones_usuario (usuario_id, producto_id, tipo_interaccion, peso)
    VALUES (p_usuario_id, p_producto_id, p_tipo, peso_interaccion)
    ON CONFLICT (usuario_id, producto_id, tipo_interaccion) 
    DO UPDATE SET 
        peso = interacciones_usuario.peso + EXCLUDED.peso,
        timestamp = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Recomendaciones basadas en comportamiento similar
CREATE OR REPLACE FUNCTION obtener_recomendaciones(
    p_usuario_id INT,
    p_limite INT DEFAULT 10
)
RETURNS TABLE(
    producto_id INT,
    nombre_producto VARCHAR,
    score DECIMAL,
    motivo TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH usuario_interacciones AS (
        -- Productos que le gustan al usuario
        SELECT producto_id, SUM(peso) as peso_total
        FROM interacciones_usuario
        WHERE usuario_id = p_usuario_id
        GROUP BY producto_id
    ),
    usuarios_similares AS (
        -- Usuarios con gustos similares
        SELECT 
            iu.usuario_id,
            SUM(iu.peso * ui.peso_total) as similitud
        FROM interacciones_usuario iu
        JOIN usuario_interacciones ui ON iu.producto_id = ui.producto_id
        WHERE iu.usuario_id != p_usuario_id
        GROUP BY iu.usuario_id
        ORDER BY similitud DESC
        LIMIT 50
    ),
    productos_recomendados AS (
        -- Productos que les gustan a usuarios similares
        SELECT 
            iu.producto_id,
            SUM(iu.peso * us.similitud) as score
        FROM interacciones_usuario iu
        JOIN usuarios_similares us ON iu.usuario_id = us.usuario_id
        WHERE iu.producto_id NOT IN (
            SELECT producto_id FROM usuario_interacciones
        )
        GROUP BY iu.producto_id
        ORDER BY score DESC
        LIMIT p_limite
    )
    SELECT 
        pr.producto_id,
        p.nombre::VARCHAR,
        pr.score,
        'Basado en usuarios similares'::TEXT
    FROM productos_recomendados pr
    JOIN productos p ON pr.producto_id = p.id
    WHERE p.activo = TRUE AND p.stock > 0;
END;
$$ LANGUAGE plpgsql;

-- Recomendaciones por categorías populares
CREATE OR REPLACE FUNCTION productos_trending(
    p_dias INT DEFAULT 7,
    p_limite INT DEFAULT 20
)
RETURNS TABLE(
    producto_id INT,
    nombre_producto VARCHAR,
    total_interacciones BIGINT,
    score_trending DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.nombre::VARCHAR,
        COUNT(iu.id) as total_interacciones,
        (COUNT(iu.id)::DECIMAL / EXTRACT(DAYS FROM AGE(CURRENT_TIMESTAMP, MIN(iu.timestamp))) * 
         AVG(iu.peso)) as score_trending
    FROM productos p
    JOIN interacciones_usuario iu ON p.id = iu.producto_id
    WHERE iu.timestamp >= CURRENT_TIMESTAMP - (p_dias || ' days')::INTERVAL
    AND p.activo = TRUE
    AND p.stock > 0
    GROUP BY p.id, p.nombre
    HAVING COUNT(iu.id) >= 10
    ORDER BY score_trending DESC
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql;
```

---

## Herramientas y Monitoreo

### Monitoreo de Performance

```sql
-- Vista de consultas activas
CREATE VIEW consultas_activas AS
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duracion,
    query,
    state,
    wait_event_type,
    wait_event
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
AND state = 'active';

-- Estadísticas de tablas
CREATE VIEW estadisticas_tablas AS
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserciones,
    n_tup_upd as actualizaciones,
    n_tup_del as eliminaciones,
    n_live_tup as filas_vivas,
    n_dead_tup as filas_muertas,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;

-- Monitoreo de locks
CREATE VIEW locks_activos AS
SELECT 
    l.pid,
    l.mode,
    l.locktype,
    l.relation::regclass as tabla,
    l.granted,
    a.query,
    a.query_start
FROM pg_locks l
JOIN pg_stat_activity a ON l.pid = a.pid
WHERE NOT l.granted
ORDER BY l.pid;

-- Función para kill de consultas problemáticas
CREATE OR REPLACE FUNCTION kill_consultas_largas(
    max_duracion INTERVAL DEFAULT '30 minutes'
)
RETURNS TABLE(killed_pid INT, duracion INTERVAL, query TEXT) AS $$
BEGIN
    RETURN QUERY
    WITH consultas_largas AS (
        SELECT 
            pid,
            now() - query_start as duracion,
            query
        FROM pg_stat_activity
        WHERE state = 'active'
        AND now() - query_start > max_duracion
        AND pid != pg_backend_pid()
        AND query NOT LIKE '%pg_stat_activity%'
    )
    SELECT 
        cl.pid,
        cl.duracion,
        cl.query
    FROM consultas_largas cl
    WHERE pg_terminate_backend(cl.pid);
END;
$$ LANGUAGE plpgsql;
```

### Alertas Automatizadas

```sql
-- Sistema de alertas
CREATE TABLE alertas_sistema (
    id SERIAL PRIMARY KEY,
    tipo_alerta VARCHAR(50) NOT NULL,
    nivel VARCHAR(20) NOT NULL, -- 'info', 'warning', 'error', 'critical'
    mensaje TEXT NOT NULL,
    metrica_valor DECIMAL,
    metrica_umbral DECIMAL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resuelta BOOLEAN DEFAULT FALSE,
    fecha_resolucion TIMESTAMP
);

-- Función para verificar métricas críticas
CREATE OR REPLACE FUNCTION verificar_metricas_criticas()
RETURNS VOID AS $$
DECLARE
    conexiones_activas INT;
    espacio_disco_pct DECIMAL;
    consultas_largas INT;
    locks_bloqueados INT;
BEGIN
    -- Verificar conexiones activas
    SELECT COUNT(*) INTO conexiones_activas
    FROM pg_stat_activity
    WHERE state = 'active';
  
    IF conexiones_activas > 80 THEN
        INSERT INTO alertas_sistema (tipo_alerta, nivel, mensaje, metrica_valor, metrica_umbral)
        VALUES ('conexiones_altas', 'warning', 
                'Alto número de conexiones activas', 
                conexiones_activas, 80);
    END IF;
  
    -- Verificar consultas largas
    SELECT COUNT(*) INTO consultas_largas
    FROM pg_stat_activity
    WHERE state = 'active'
    AND now() - query_start > interval '10 minutes';
  
    IF consultas_largas > 0 THEN
        INSERT INTO alertas_sistema (tipo_alerta, nivel, mensaje, metrica_valor, metrica_umbral)
        VALUES ('consultas_largas', 'error', 
                'Consultas ejecutándose por más de 10 minutos', 
                consultas_largas, 0);
    END IF;
  
    -- Verificar locks bloqueados
    SELECT COUNT(*) INTO locks_bloqueados
    FROM pg_locks
    WHERE NOT granted;
  
    IF locks_bloqueados > 5 THEN
        INSERT INTO alertas_sistema (tipo_alerta, nivel, mensaje, metrica_valor, metrica_umbral)
        VALUES ('locks_bloqueados', 'warning', 
                'Alto número de locks bloqueados', 
                locks_bloqueados, 5);
    END IF;
  
    -- Notificar alertas críticas
    PERFORM pg_notify('alertas_criticas', 
        'Verificación completada: ' || NOW()::TEXT);
END;
$$ LANGUAGE plpgsql;

-- Programar verificación cada minuto
SELECT cron.schedule('check-metrics', '* * * * *', 'SELECT verificar_metricas_criticas()');
```

### Scripts de Mantenimiento

```sql
-- Mantenimiento automático de la base de datos
CREATE OR REPLACE FUNCTION mantenimiento_automatico()
RETURNS TEXT AS $$
DECLARE
    resultado TEXT := '';
    tabla RECORD;
    estadisticas RECORD;
BEGIN
    resultado := 'Inicio de mantenimiento: ' || CURRENT_TIMESTAMP || E'\n';
  
    -- Actualizar estadísticas de tablas grandes
    FOR tabla IN 
        SELECT schemaname, tablename 
        FROM pg_stat_user_tables 
        WHERE n_live_tup > 1000 
        AND (last_analyze IS NULL OR last_analyze < CURRENT_DATE - INTERVAL '1 day')
    LOOP
        EXECUTE 'ANALYZE ' || quote_ident(tabla.schemaname) || '.' || quote_ident(tabla.tablename);
        resultado := resultado || 'ANALYZE ejecutado en ' || tabla.tablename || E'\n';
    END LOOP;
  
    -- VACUUM en tablas con muchas filas muertas
    FOR tabla IN
        SELECT schemaname, tablename, n_dead_tup, n_live_tup
        FROM pg_stat_user_tables
        WHERE n_dead_tup > 1000 
        AND n_dead_tup > n_live_tup * 0.1
    LOOP
        EXECUTE 'VACUUM ' || quote_ident(tabla.schemaname) || '.' || quote_ident(tabla.tablename);
        resultado := resultado || 'VACUUM ejecutado en ' || tabla.tablename || 
                    ' (filas muertas: ' || tabla.n_dead_tup || ')' || E'\n';
    END LOOP;
  
    -- Reindexar índices fragmentados
    FOR tabla IN
        SELECT schemaname, tablename, indexname
        FROM pg_stat_user_indexes pui
        JOIN pg_stat_user_tables put ON pui.relid = put.relid
        WHERE put.n_dead_tup > put.n_live_tup * 0.2
        AND pui.idx_scan > 100
    LOOP
        EXECUTE 'REINDEX INDEX ' || quote_ident(tabla.schemaname) || '.' || quote_ident(tabla.indexname);
        resultado := resultado || 'REINDEX ejecutado en ' || tabla.indexname || E'\n';
    END LOOP;
  
    resultado := resultado || 'Fin de mantenimiento: ' || CURRENT_TIMESTAMP;
  
    -- Log del mantenimiento
    INSERT INTO logs_mantenimiento (fecha, actividades) 
    VALUES (CURRENT_TIMESTAMP, resultado);
  
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- Tabla de logs de mantenimiento
CREATE TABLE IF NOT EXISTS logs_mantenimiento (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actividades TEXT
);

-- Programar mantenimiento nocturno
SELECT cron.schedule('maintenance', '0 2 * * *', 'SELECT mantenimiento_automatico()');

-- Función para limpieza de datos antiguos
CREATE OR REPLACE FUNCTION limpiar_datos_antiguos()
RETURNS TEXT AS $$
DECLARE
    filas_eliminadas INT;
    resultado TEXT := '';
BEGIN
    -- Limpiar logs antiguos (más de 90 días)
    DELETE FROM logs_actividad 
    WHERE timestamp < CURRENT_DATE - INTERVAL '90 days';
    GET DIAGNOSTICS filas_eliminadas = ROW_COUNT;
    resultado := resultado || 'Logs antiguos eliminados: ' || filas_eliminadas || E'\n';
  
    -- Limpiar carritos abandonados (más de 30 días)
    DELETE FROM carrito 
    WHERE fecha_agregado < CURRENT_DATE - INTERVAL '30 days';
    GET DIAGNOSTICS filas_eliminadas = ROW_COUNT;
    resultado := resultado || 'Carritos abandonados eliminados: ' || filas_eliminadas || E'\n';
  
    -- Limpiar alertas resueltas antiguas
    DELETE FROM alertas_sistema 
    WHERE resuelta = TRUE 
    AND fecha_resolucion < CURRENT_DATE - INTERVAL '30 days';
    GET DIAGNOSTICS filas_eliminadas = ROW_COUNT;
    resultado := resultado || 'Alertas antiguas eliminadas: ' || filas_eliminadas || E'\n';
  
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- Programar limpieza semanal
SELECT cron.schedule('cleanup', '0 3 * * 0', 'SELECT limpiar_datos_antiguos()');
```

<!-- ---

Esta guía cubre desde los conceptos fundamentales hasta implementaciones avanzadas de bases de datos SQL relacionales. Cada sección incluye ejemplos prácticos que puedes adaptar a tus necesidades específicas. La clave está en entender los principios y aplicarlos consistentemente en tus proyectos.

Recuerda que una buena base de datos no solo funciona, sino que es mantenible, escalable y performante a largo plazo. -->
