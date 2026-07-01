---
title: 'Modelado de Bases de Datos'
description: 'Guía Definitiva: Modelado de Bases de Datos con Analogías de la Vida Real'
code: 'base de datos'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

## ¿Qué vas a aprender

En este contenido explorarás los conceptos clave y su aplicación práctica:

- Fundamentos teóricos y contexto necesario para entender el tema
- Aplicaciones prácticas y casos de uso reales
- Herramientas, técnicas y mejores prácticas recomendadas
- Ejemplos guiados paso a paso
- Errores comunes, anti-patrones y cómo evitarlos


# 🗃️ Guía Definitiva: Modelado de Bases de Datos con Analogías de la Vida Real

## 🏠 **Introducción: Tu Base de Datos es Como Tu Casa**

Imagina que una base de datos es como tu casa. Cada **tabla** es una habitación con un propósito específico. Las **relaciones** son los pasillos que conectan las habitaciones. Y la **normalización** es como organizar cada habitación para que sea funcional y no tengas cosas duplicadas por toda la casa.

**¿Por qué importa el buen diseño?**

- Una casa mal diseñada = buscar cosas toma horas
- Una base de datos mal diseñada = consultas lentas y datos inconsistentes

---

## 📚 **Conceptos Fundamentales: La Analogía de la Biblioteca**

### **1. Tabla = Estantería Especializada**

Imagina una biblioteca donde cada estantería tiene un propósito específico:

```sql
-- Estantería de "Usuarios" (como fichas de biblioteca)
CREATE TABLE usuarios (
    id INT PRIMARY KEY,           -- Número de carnet único
    nombre VARCHAR(100),          -- Nombre completo
    email VARCHAR(100),           -- Dirección de contacto
    fecha_registro DATE           -- Cuándo se hizo socio
);

-- Estantería de "Libros" 
CREATE TABLE libros (
    isbn VARCHAR(20) PRIMARY KEY, -- Código único del libro
    titulo VARCHAR(200),          -- Nombre del libro
    autor VARCHAR(100),           -- Quién lo escribió
    categoria VARCHAR(50),        -- Sección donde va
    año_publicacion INT           -- Cuándo se publicó
);
```

**Analogía de la vida real:**

- **Usuarios** = Fichas de socios de la biblioteca
- **Libros** = Catálogo de libros disponibles
- **Primary Key** = Número de carnet (único para cada persona)

### **2. Columnas = Información en Cada Ficha**

Como en una ficha médica, cada columna guarda un tipo específico de información:

```sql
-- Ficha médica (tabla pacientes)
CREATE TABLE pacientes (
    numero_historia INT PRIMARY KEY,    -- Como número de expediente
    nombre VARCHAR(100) NOT NULL,      -- Obligatorio, como el nombre
    fecha_nacimiento DATE,             -- Para calcular edad
    tipo_sangre VARCHAR(3),            -- A+, O-, etc.
    telefono VARCHAR(15),              -- Contacto de emergencia
    alergias TEXT                      -- Información adicional
);
```

**Analogía**: Cada columna es como un campo en un formulario que siempre completas igual.

---

## 🔗 **Tipos de Relaciones: Como las Relaciones Familiares**

### **1. Relación Uno a Uno (1:1) - "Matrimonio"**

Como en un matrimonio tradicional: una persona = un cónyuge

```sql
-- Una persona tiene UN solo pasaporte
CREATE TABLE personas (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    fecha_nacimiento DATE
);

CREATE TABLE pasaportes (
    numero VARCHAR(20) PRIMARY KEY,
    persona_id INT UNIQUE,           -- UNIQUE = solo uno por persona
    fecha_emision DATE,
    fecha_vencimiento DATE,
    FOREIGN KEY (persona_id) REFERENCES personas(id)
);
```

**Ejemplos de la vida real:**

- Persona ↔ Pasaporte
- Empleado ↔ Escritorio asignado
- Casa ↔ Medidor de luz

### **2. Relación Uno a Muchos (1:N) - "Madre e Hijos"**

Como una madre que puede tener varios hijos, pero cada hijo tiene una sola madre biológica:

```sql
-- Una madre puede tener muchos hijos
CREATE TABLE madres (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    edad INT
);

CREATE TABLE hijos (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    edad INT,
    madre_id INT,                    -- Cada hijo tiene UNA madre
    FOREIGN KEY (madre_id) REFERENCES madres(id)
);
```

**Ejemplos de la vida real:**

- Cliente → Órdenes (un cliente, muchas compras)
- Autor → Libros (un autor, varios libros)
- Departamento → Empleados (un depto, varios empleados)

### **3. Relación Muchos a Muchos (N:N) - "Estudiantes y Materias"**

Como en la universidad: un estudiante toma varias materias, y cada materia la toman varios estudiantes:

```sql
-- Muchos estudiantes pueden tomar muchas materias
CREATE TABLE estudiantes (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    carrera VARCHAR(100)
);

CREATE TABLE materias (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    creditos INT
);

-- Tabla intermedia (como la lista de inscripciones)
CREATE TABLE inscripciones (
    estudiante_id INT,
    materia_id INT,
    semestre VARCHAR(20),
    calificacion DECIMAL(3,1),
    PRIMARY KEY (estudiante_id, materia_id, semestre),
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
    FOREIGN KEY (materia_id) REFERENCES materias(id)
);
```

**Ejemplos de la vida real:**

- Actores ↔ Películas (un actor en varias películas, una película con varios actores)
- Productos ↔ Categorías (un producto en varias categorías)
- Doctores ↔ Pacientes (un doctor atiende varios pacientes, un paciente ve varios doctores)

---

## 🧹 **Normalización: Como Organizar tu Casa**

### **Sin Normalización = Casa Desordenada**

Imagina que guardas todo en una sola caja gigante:

```sql
-- ❌ MALO: Todo mezclado como un cuarto desordenado
CREATE TABLE pedidos_malo (
    id INT PRIMARY KEY,
    cliente_nombre VARCHAR(100),
    cliente_email VARCHAR(100),
    cliente_telefono VARCHAR(15),
    cliente_direccion VARCHAR(200),
    producto_nombre VARCHAR(100),
    producto_precio DECIMAL(10,2),
    producto_categoria VARCHAR(50),
    cantidad INT,
    fecha_pedido DATE
);
```

**Problemas de este diseño:**

- Si cambias el teléfono de un cliente, debes actualizarlo en TODOS sus pedidos
- Si escribes mal el nombre del cliente una vez, tendrás datos inconsistentes
- Desperdicias espacio repitiendo la misma información

### **Primera Forma Normal (1NF) - "Un lugar para cada cosa"**

Como organizar tu ropa: no mezcles calcetines con camisas en el mismo cajón.

**Regla:** Cada celda debe contener UN solo valor, no listas.

```sql
-- ❌ MALO: Mezclando información
CREATE TABLE contactos_malo (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    telefonos VARCHAR(200)  -- "555-1234, 555-5678, 555-9012" ❌
);

-- ✅ BUENO: Cada teléfono en su propia fila
CREATE TABLE contactos (
    id INT PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE telefonos (
    id INT PRIMARY KEY,
    contacto_id INT,
    numero VARCHAR(15),
    tipo VARCHAR(20),  -- casa, móvil, trabajo
    FOREIGN KEY (contacto_id) REFERENCES contactos(id)
);
```

### **Segunda Forma Normal (2NF) - "Cada cosa en su lugar correcto"**

Como no guardar herramientas de cocina en el garaje.

**Regla:** Información que no depende completamente de la clave principal debe ir en otra tabla.

```sql
-- ❌ MALO: Información del libro repetida en cada préstamo
CREATE TABLE prestamos_malo (
    usuario_id INT,
    libro_isbn VARCHAR(20),
    fecha_prestamo DATE,
    titulo_libro VARCHAR(200),      -- ❌ Se repite para cada préstamo
    autor_libro VARCHAR(100),       -- ❌ Se repite para cada préstamo
    PRIMARY KEY (usuario_id, libro_isbn, fecha_prestamo)
);

-- ✅ BUENO: Información del libro en tabla separada
CREATE TABLE libros (
    isbn VARCHAR(20) PRIMARY KEY,
    titulo VARCHAR(200),
    autor VARCHAR(100)
);

CREATE TABLE prestamos (
    id INT PRIMARY KEY,
    usuario_id INT,
    libro_isbn VARCHAR(20),
    fecha_prestamo DATE,
    fecha_devolucion DATE,
    FOREIGN KEY (libro_isbn) REFERENCES libros(isbn)
);
```

### **Tercera Forma Normal (3NF) - "Sin dependencias indirectas"**

Como no determinar el tamaño de zapatos por la altura de la persona.

**Regla:** Las columnas deben depender directamente de la clave principal, no de otras columnas.

```sql
-- ❌ MALO: El nombre del departamento depende del departamento_id, no del empleado_id
CREATE TABLE empleados_malo (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    departamento_id INT,
    departamento_nombre VARCHAR(100)  -- ❌ Depende de departamento_id, no de empleado
);

-- ✅ BUENO: Departamentos en tabla separada
CREATE TABLE departamentos (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    presupuesto DECIMAL(15,2)
);

CREATE TABLE empleados (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    departamento_id INT,
    salario DECIMAL(10,2),
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);
```

---

## 📖 **Índices: Como el Índice de un Libro**

### **¿Qué son los Índices?**

Imagina buscar la palabra "felicidad" en un libro de 500 páginas:

- **Sin índice**: Lees página por página (lento)
- **Con índice**: Vas directo a las páginas 45, 123, 289 (rápido)

```sql
-- Sin índice: buscar por email es lento
SELECT * FROM usuarios WHERE email = 'juan@email.com';

-- Con índice: buscar por email es rápido
CREATE INDEX idx_email ON usuarios(email);
```

### **Tipos de Índices con Analogías**

#### **1. Índice Simple - "Diccionario"**

Como buscar una palabra en el diccionario (ordenado alfabéticamente):

```sql
-- Para buscar rápidamente por apellido
CREATE INDEX idx_apellido ON empleados(apellido);

-- Ahora esto es súper rápido:
SELECT * FROM empleados WHERE apellido = 'García';
```

#### **2. Índice Compuesto - "Directorio Telefónico"**

Como buscar en el directorio telefónico (ordenado por apellido, luego nombre):

```sql
-- Para buscar por apellido Y nombre
CREATE INDEX idx_apellido_nombre ON empleados(apellido, nombre);

-- Optimiza estas consultas:
SELECT * FROM empleados WHERE apellido = 'García' AND nombre = 'Juan';
SELECT * FROM empleados WHERE apellido = 'García';  -- También funciona

-- Pero NO optimiza esta:
SELECT * FROM empleados WHERE nombre = 'Juan';  -- No empieza por apellido
```

#### **3. Índice Único - "Número de Cédula"**

Como el número de cédula: garantiza que no haya duplicados:

```sql
-- Garantiza que no haya emails duplicados
CREATE UNIQUE INDEX idx_email_unico ON usuarios(email);

-- Esto fallará si el email ya existe:
INSERT INTO usuarios (nombre, email) VALUES ('Juan', 'email@existe.com');
```

### **Cuándo Usar Índices: La Analogía del Estacionamiento**

**Crear índices es como hacer etiquetas en un estacionamiento:**

```sql
-- ✅ BUENO: Índice en columnas que consultas frecuentemente
CREATE INDEX idx_fecha_orden ON ordenes(fecha_creacion);  -- Reportes diarios
CREATE INDEX idx_status_orden ON ordenes(status);         -- Órdenes pendientes

-- ❌ MALO: Índice en columnas que cambian mucho
-- No hagas índice en "ultima_modificacion" si cambia constantemente
```

**Reglas prácticas:**

- **SÍ crear índice**: Columnas en WHERE, JOIN, ORDER BY frecuentes
- **NO crear índice**: Columnas que cambian mucho, tablas pequeñas

---

## 🏗️ **Patrones de Diseño: Recetas de la Abuela**

### **1. Patrón de Auditoría - "Historial Médico"**

Como mantener historial médico: nunca borras, solo agregas entradas nuevas.

```sql
-- Tabla principal
CREATE TABLE productos (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    precio DECIMAL(10,2),
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de auditoría (quién cambió qué y cuándo)
CREATE TABLE productos_auditoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT,
    accion VARCHAR(20),        -- INSERT, UPDATE, DELETE
    usuario_id INT,            -- Quién hizo el cambio
    fecha_cambio TIMESTAMP,    -- Cuándo
    valores_anteriores JSON,   -- Qué valores tenía antes
    valores_nuevos JSON,       -- Qué valores tiene ahora
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);
```

### **2. Patrón de Versionado - "Versiones de un Documento"**

Como guardar versiones de un documento de Word:

```sql
-- Documento maestro
CREATE TABLE documentos (
    id INT PRIMARY KEY,
    titulo VARCHAR(200),
    autor_id INT,
    version_actual INT DEFAULT 1
);

-- Versiones del documento
CREATE TABLE documentos_versiones (
    documento_id INT,
    version INT,
    contenido TEXT,
    fecha_creacion TIMESTAMP,
    comentarios VARCHAR(500),
    PRIMARY KEY (documento_id, version),
    FOREIGN KEY (documento_id) REFERENCES documentos(id)
);
```

### **3. Patrón de Estado - "Semáforo"**

Como un semáforo que cambia de estado (rojo → amarillo → verde):

```sql
-- Estados posibles
CREATE TABLE estados_orden (
    id INT PRIMARY KEY,
    nombre VARCHAR(50),  -- pendiente, procesando, enviado, entregado
    descripcion TEXT
);

-- Historial de cambios de estado
CREATE TABLE orden_estados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    orden_id INT,
    estado_id INT,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT,
    notas TEXT,
    FOREIGN KEY (orden_id) REFERENCES ordenes(id),
    FOREIGN KEY (estado_id) REFERENCES estados_orden(id)
);
```

### **4. Patrón de Jerarquía - "Árbol Familiar"**

Como representar un árbol familiar o estructura organizacional:

```sql
-- Estructura de empresa (jefe → gerente → empleado)
CREATE TABLE empleados (
    id INT PRIMARY KEY,
    nombre VARCHAR(100),
    jefe_id INT,                    -- Apunta a su jefe directo
    nivel_jerarquico INT,           -- 1=CEO, 2=VP, 3=Gerente, etc.
    FOREIGN KEY (jefe_id) REFERENCES empleados(id)
);

-- Para encontrar todos los subordinados de un jefe:
WITH RECURSIVE subordinados AS (
    -- Empleado inicial
    SELECT id, nombre, jefe_id, 0 as nivel
    FROM empleados 
    WHERE id = 5  -- ID del jefe
  
    UNION ALL
  
    -- Sus subordinados recursivamente
    SELECT e.id, e.nombre, e.jefe_id, s.nivel + 1
    FROM empleados e
    INNER JOIN subordinados s ON e.jefe_id = s.id
)
SELECT * FROM subordinados;
```

---

## ⚡ **Optimización: Como Mantener tu Casa Eficiente**

### **1. Particionado - "Organizar por Temporadas"**

Como guardar ropa de invierno y verano en lugares separados:

```sql
-- Particionar órdenes por año (como archivos anuales)
CREATE TABLE ordenes (
    id INT,
    fecha DATE,
    cliente_id INT,
    total DECIMAL(10,2)
) PARTITION BY RANGE (YEAR(fecha)) (
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026)
);
```

**Beneficio**: Buscar órdenes de 2024 solo mira esa "cajita", no todas las órdenes históricas.

### **2. Desnormalización Controlada - "Atajos Estratégicos"**

Como tener una calculadora en la cocina aunque tengas una en la oficina:

```sql
-- Tabla normalizada (correcta pero lenta para reportes)
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10,2)
);

-- Agregamos columna calculada para evitar SUMs constantes
ALTER TABLE orders ADD COLUMN total_calculado DECIMAL(10,2);

-- Trigger que mantiene el total actualizado
CREATE TRIGGER update_order_total 
AFTER INSERT ON order_items
FOR EACH ROW
UPDATE orders 
SET total_calculado = (
    SELECT SUM(quantity * unit_price) 
    FROM order_items 
    WHERE order_id = NEW.order_id
)
WHERE id = NEW.order_id;
```

### **3. Caché de Consultas - "Lista de Supermercado"**

Como hacer una lista de supermercado en lugar de ir y recordar sobre la marcha:

```sql
-- Vista materializada para reportes frecuentes
CREATE MATERIALIZED VIEW ventas_mensuales AS
SELECT 
    DATE_FORMAT(fecha, '%Y-%m') as mes,
    COUNT(*) as total_ordenes,
    SUM(total) as total_ventas,
    AVG(total) as promedio_orden
FROM ordenes 
GROUP BY DATE_FORMAT(fecha, '%Y-%m');

-- Refrescar cada noche
REFRESH MATERIALIZED VIEW ventas_mensuales;
```

---

## 🚨 **Errores Comunes: Cosas que NO Hacer**

### **1. Error: "Todo en una Tabla" - Como Vivir en un Solo Cuarto**

```sql
-- ❌ HORRIBLE: Todo mezclado
CREATE TABLE sistema_completo (
    id INT PRIMARY KEY,
    usuario_nombre VARCHAR(100),
    usuario_email VARCHAR(100),
    producto_nombre VARCHAR(100),
    producto_precio DECIMAL(10,2),
    orden_fecha DATE,
    orden_cantidad INT,
    pago_metodo VARCHAR(50),
    pago_fecha DATE,
    envio_direccion VARCHAR(200),
    envio_estado VARCHAR(50)
    -- ... y 50 columnas más
);
```

**Por qué es malo:**

- Como tener cocina, sala, dormitorio y baño en un solo cuarto
- Imposible mantener, lento, datos duplicados

### **2. Error: "Claves Naturales como Primary Key"**

```sql
-- ❌ MALO: Usar email como primary key
CREATE TABLE usuarios (
    email VARCHAR(100) PRIMARY KEY,  -- ¿Qué pasa si cambia su email?
    nombre VARCHAR(100)
);

-- ✅ BUENO: ID artificial como primary key
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,  -- Nunca cambia
    email VARCHAR(100) UNIQUE,          -- Puede cambiar
    nombre VARCHAR(100)
);
```

**Analogía**: Como usar tu número de teléfono como identificación principal. Si cambias de número, ¡pierdes tu identidad!

### **3. Error: "No Usar Foreign Keys"**

```sql
-- ❌ MALO: Sin restricciones
CREATE TABLE ordenes (
    id INT PRIMARY KEY,
    cliente_id INT,  -- Pero no hay FK, puede ser cualquier número
    total DECIMAL(10,2)
);

-- ✅ BUENO: Con restricciones
CREATE TABLE ordenes (
    id INT PRIMARY KEY,
    cliente_id INT,
    total DECIMAL(10,2),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)  -- Garantiza que existe
);
```

**Analogía**: Como dar llaves de tu casa sin saber a quién. Las foreign keys son como tener una lista de personas autorizadas.

### **4. Error: "Columnas VARCHAR Sin Límite"**

```sql
-- ❌ MALO: Sin límites claros
CREATE TABLE productos (
    nombre VARCHAR(10000),  -- Nadie necesita nombres de 10,000 caracteres
    descripcion TEXT        -- TEXT para descripciones largas está bien
);

-- ✅ BUENO: Límites realistas
CREATE TABLE productos (
    nombre VARCHAR(100),        -- Suficiente para nombres de productos
    descripcion_corta VARCHAR(255),  -- Para resúmenes
    descripcion_completa TEXT   -- Para descripciones largas
);
```

---

## 🎯 **Casos Reales del Mundo: Sistemas Completos**

### **Caso 1: Sistema de E-commerce (Como Amazon)**

```sql
-- 1. Usuarios (como cuentas de Amazon)
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    nombre VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- 2. Categorías (como departamentos en una tienda)
CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    categoria_padre_id INT,  -- Para subcategorías
    FOREIGN KEY (categoria_padre_id) REFERENCES categorias(id)
);

-- 3. Productos (como artículos en el catálogo)
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200),
    descripcion TEXT,
    precio DECIMAL(10,2),
    stock INT DEFAULT 0,
    categoria_id INT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- 4. Carritos (como carrito de compras temporal)
CREATE TABLE carritos (
    usuario_id INT,
    producto_id INT,
    cantidad INT,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, producto_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- 5. Órdenes (como pedidos confirmados)
CREATE TABLE ordenes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    total DECIMAL(10,2),
    estado VARCHAR(50) DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    direccion_envio TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 6. Detalles de órdenes (qué productos en cada pedido)
CREATE TABLE orden_items (
    orden_id INT,
    producto_id INT,
    cantidad INT,
    precio_unitario DECIMAL(10,2),  -- Precio al momento de la compra
    PRIMARY KEY (orden_id, producto_id),
    FOREIGN KEY (orden_id) REFERENCES ordenes(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Índices para consultas frecuentes
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_ordenes_usuario ON ordenes(usuario_id);
CREATE INDEX idx_ordenes_fecha ON ordenes(fecha_creacion);
```

### **Caso 2: Sistema de Hospital (Como Historial Médico)**

```sql
-- 1. Pacientes (como expedientes médicos)
CREATE TABLE pacientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_historia VARCHAR(20) UNIQUE,
    nombre VARCHAR(100),
    fecha_nacimiento DATE,
    tipo_sangre VARCHAR(3),
    telefono VARCHAR(15),
    direccion TEXT,
    contacto_emergencia VARCHAR(100)
);

-- 2. Doctores (como staff médico)
CREATE TABLE doctores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    especialidad VARCHAR(100),
    numero_licencia VARCHAR(50) UNIQUE,
    telefono VARCHAR(15),
    activo BOOLEAN DEFAULT TRUE
);

-- 3. Citas (como agenda médica)
CREATE TABLE citas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT,
    doctor_id INT,
    fecha_hora DATETIME,
    motivo TEXT,
    estado VARCHAR(20) DEFAULT 'programada',  -- programada, completada, cancelada
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY (doctor_id) REFERENCES doctores(id)
);

-- 4. Diagnósticos (como resultados médicos)
CREATE TABLE diagnosticos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cita_id INT,
    codigo_cie VARCHAR(10),  -- Código internacional de enfermedad
    descripcion TEXT,
    fecha_diagnostico DATE,
    FOREIGN KEY (cita_id) REFERENCES citas(id)
);

-- 5. Medicamentos
CREATE TABLE medicamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    descripcion TEXT,
    contraindicaciones TEXT
);

-- 6. Prescripciones (como recetas médicas)
CREATE TABLE prescripciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    diagnostico_id INT,
    medicamento_id INT,
    dosis VARCHAR(100),
    frecuencia VARCHAR(100),  -- "cada 8 horas", "2 veces al día"
    duracion VARCHAR(50),     -- "7 días", "hasta terminar"
    FOREIGN KEY (diagnostico_id) REFERENCES diagnosticos(id),
    FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id)
);
```

### **Caso 3: Sistema Educativo (Como Universidad)**

```sql
-- 1. Estudiantes
CREATE TABLE estudiantes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo_estudiante VARCHAR(20) UNIQUE,
    nombre VARCHAR(100),
    email VARCHAR(100),
    carrera VARCHAR(100),
    semestre_actual INT,
    fecha_ingreso DATE
);

-- 2. Profesores
CREATE TABLE profesores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    email VARCHAR(100),
    departamento VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE
);

-- 3. Materias/Cursos
CREATE TABLE materias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) UNIQUE,
    nombre VARCHAR(100),
    creditos INT,
    prerequisitos JSON  -- Lista de códigos de materias prerrequisito
);

-- 4. Secciones (como grupos de clase)
CREATE TABLE secciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    materia_id INT,
    profesor_id INT,
    semestre VARCHAR(20),  -- "2024-1", "2024-2"
    horario VARCHAR(100),  -- "Lun-Mie-Vie 8:00-9:30"
    salon VARCHAR(20),
    cupo_maximo INT,
    FOREIGN KEY (materia_id) REFERENCES materias(id),
    FOREIGN KEY (profesor_id) REFERENCES profesores(id)
);

-- 5. Inscripciones (matriculas)
CREATE TABLE inscripciones (
    estudiante_id INT,
    seccion_id INT,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'activa',
    PRIMARY KEY (estudiante_id, seccion_id),
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
    FOREIGN KEY (seccion_id) REFERENCES secciones(id)
);

-- 6. Calificaciones
CREATE TABLE calificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    inscripcion_estudiante_id INT,
    inscripcion_seccion_id INT,
    tipo_evaluacion VARCHAR(50),  -- "parcial", "final", "tarea", "proyecto"
    nota DECIMAL(4,2),
    fecha_evaluacion DATE,
    FOREIGN KEY (inscripcion_estudiante_id, inscripcion_seccion_id) 
        REFERENCES inscripciones(estudiante_id, seccion_id)
);
```

---

## 🔧 **Herramientas y Mejores Prácticas**

### **Convenciones de Nombrado: Como Etiquetar las Cajas**

```sql
-- ✅ BUENO: Nombres claros y consistentes
CREATE TABLE usuarios (          -- Tabla: plural, minúsculas
    id INT PRIMARY KEY,          -- PK: siempre "id"
    nombre_completo VARCHAR(100), -- Columnas: snake_case
    fecha_nacimiento DATE,       -- Fechas: fecha_*
    es_activo BOOLEAN           -- Booleanos: es_*, tiene_*, puede_*
);

-- Foreign Keys: tabla_id
ALTER TABLE ordenes ADD COLUMN usuario_id INT;

-- Índices: idx_tabla_columna
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- ❌ MALO: Inconsistente y confuso
CREATE TABLE User (              -- Mezcla de casos
    UserID INT,                 -- Diferentes estilos
    FullName VARCHAR(100),      -- CamelCase mezclado
    DOB DATE,                   -- Abreviaciones confusas
    Active BOOLEAN              -- Inglés mezclado
);
```

### **Documentación: Como Manual de Usuario**

```sql
-- Documenta tus tablas
COMMENT ON TABLE usuarios IS 'Almacena información de usuarios registrados del sistema';
COMMENT ON COLUMN usuarios.fecha_ultimo_login IS 'Última vez que el usuario se conectó al sistema';

-- Documenta relaciones complejas
COMMENT ON TABLE inscripciones IS 'Tabla intermedia que relaciona estudiantes con secciones de materias. Una inscripción representa que un estudiante está tomando una materia específica en un semestre dado';
```

### **Control de Versiones: Como Historial de Cambios**

```sql
-- Migrations: cambios versionados
-- V001_crear_tabla_usuarios.sql
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100)
);

-- V002_agregar_email_usuarios.sql
ALTER TABLE usuarios ADD COLUMN email VARCHAR(100);

-- V003_hacer_email_unico.sql
ALTER TABLE usuarios ADD CONSTRAINT uk_usuarios_email UNIQUE (email);
```

---

## 🎯 **Plan de Acción: De Principiante a Experto**

### **Nivel 1: Fundamentos (Semanas 1-4)**

- [ ]  Entender qué es una tabla, fila y columna
- [ ]  Practicar CREATE TABLE básico
- [ ]  Entender Primary Keys y Foreign Keys
- [ ]  Diseñar tu primera base de datos simple (blog personal)

### **Nivel 2: Relaciones (Semanas 5-8)**

- [ ]  Dominar los 3 tipos de relaciones
- [ ]  Crear tablas intermedias para relaciones N:N
- [ ]  Entender cuándo usar cada tipo de relación
- [ ]  Diseñar un sistema de tienda online básico

### **Nivel 3: Normalización (Semanas 9-12)**

- [ ]  Entender las 3 formas normales
- [ ]  Practicar normalización de tablas "mal diseñadas"
- [ ]  Saber cuándo desnormalizar estratégicamente
- [ ]  Rediseñar bases de datos existentes

### **Nivel 4: Optimización (Semanas 13-16)**

- [ ]  Crear y optimizar índices
- [ ]  Entender planes de ejecución
- [ ]  Implementar particionado
- [ ]  Optimizar consultas lentas

### **Nivel 5: Patrones Avanzados (Semanas 17-20)**

- [ ]  Implementar auditoría y versionado
- [ ]  Diseñar jerarquías y árboles
- [ ]  Crear sistemas de estados
- [ ]  Manejar datos históricos

---

## 📊 **Checklist de Diseño: Antes de Lanzar tu BD**

### **✅ Verificación de Diseño**

- [ ]  ¿Cada tabla tiene un propósito claro?
- [ ]  ¿Están definidas todas las foreign keys?
- [ ]  ¿Los nombres son consistentes y descriptivos?
- [ ]  ¿Está en al menos 3NF (a menos que haya razón específica)?
- [ ]  ¿Hay índices en columnas de búsqueda frecuente?

### **✅ Verificación de Performance**

- [ ]  ¿Las consultas más frecuentes son rápidas?
- [ ]  ¿Los índices cubren los casos de uso principales?
- [ ]  ¿No hay índices innecesarios?
- [ ]  ¿Las tablas grandes están particionadas?

### **✅ Verificación de Mantenimiento**

- [ ]  ¿Hay documentación clara?
- [ ]  ¿Las migraciones están versionadas?
- [ ]  ¿Hay respaldos automáticos?
- [ ]  ¿Hay monitoreo de performance?

---

## 💡 **Recursos Finales: Tu Biblioteca de Referencia**

### **Herramientas Recomendadas**

- **Diseño**: MySQL Workbench, pgAdmin, DBeaver
- **Documentación**: dbdocs.io, SchemaSpy
- **Versionado**: Flyway, Liquibase
- **Monitoreo**: Percona Monitoring, pgBadger

### **Libros de Referencia**

- "Database Design for Mere Mortals" - Michael Hernandez
- "Learning SQL" - Alan Beaulieu
- "High Performance MySQL" - Baron Schwartz

### **Práctica Continua**

- Rediseña sistemas existentes que conozcas
- Participa en proyectos open source
- Revisa esquemas de aplicaciones populares en GitHub

---

## 🏆 **Conclusión: Tu Nueva Superpoder**

**Recuerda las analogías clave:**

- **Base de datos = Casa** (organizada y funcional)
- **Tablas = Habitaciones** (cada una con propósito específico)
- **Relaciones = Pasillos** (conectan información relacionada)
- **Índices = Índices de libros** (encuentras información rápidamente)
- **Normalización = Organización del hogar** (cada cosa en su lugar)

**Tu mantra de diseño:**
*"Diseño simple, relaciones claras, rendimiento medible"*

**La regla de oro:**
*"Si no puedes explicar tu diseño con analogías simples de la vida real, probablemente es muy complejo"*

---

### 🚀 **¡Ahora tienes el mapa para crear bases de datos que realmente funcionen!**

*Recuerda: Un buen diseño de base de datos es como una buena casa - se nota en la comodidad diaria, no en la primera impresión.*
