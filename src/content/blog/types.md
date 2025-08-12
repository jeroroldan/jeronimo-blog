---
title: 'Master Class: Interfaces, Types y Enums en TypeScript'
code: 'typescript'
description: 'Master Class: Interfaces, Types y Enums en TypeScript'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# 🎯 Master Class: Interfaces, Types y Enums en TypeScript

## 📚 Tabla de Contenidos
1. [Introducción y Fundamentos](#introducción)
2. [Interfaces: Los Contratos de tu Código](#interfaces)
3. [Types: La Navaja Suiza de TypeScript](#types)
4. [Enums: Los Catálogos Predefinidos](#enums)
5. [Guía de Decisión: ¿Cuál Usar?](#guia-decision)
6. [Patrones Avanzados y Mejores Prácticas](#patrones-avanzados)
7. [Casos de Uso Reales](#casos-reales)

---

## 🌟 Introducción y Fundamentos {#introducción}

TypeScript nos ofrece tres herramientas poderosas para definir la forma y estructura de nuestros datos. Cada una tiene su propósito específico y entender cuándo usar cada una es crucial para escribir código limpio y mantenible.

### Analogía Principal
Imagina que estás organizando una biblioteca:
- **Interfaces**: Son como las fichas de catalogación que describen qué información debe tener cada libro
- **Types**: Son como etiquetas flexibles que puedes combinar y personalizar
- **Enums**: Son como las secciones predefinidas de la biblioteca (Ficción, No-ficción, Referencia, etc.)

---

## 🔷 Interfaces: Los Contratos de tu Código {#interfaces}

### ¿Qué son las Interfaces?

Las interfaces definen la **estructura** que debe cumplir un objeto. Son como contratos que especifican qué propiedades y métodos debe tener una entidad.

### Sintaxis Básica

```typescript
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
  fechaRegistro: Date;
}

// Implementación
const nuevoUsuario: Usuario = {
  id: 1,
  nombre: "Ana García",
  email: "ana@ejemplo.com",
  activo: true,
  fechaRegistro: new Date()
};
```

### Características Clave de las Interfaces

#### 1. **Extensibilidad mediante Herencia**
```typescript
interface Persona {
  nombre: string;
  edad: number;
}

interface Empleado extends Persona {
  numeroEmpleado: string;
  departamento: string;
}

interface Gerente extends Empleado {
  equipoACargo: string[];
  nivelAutoridad: number;
}

// Uso
const gerente: Gerente = {
  nombre: "Carlos Ruiz",
  edad: 35,
  numeroEmpleado: "EMP-001",
  departamento: "Tecnología",
  equipoACargo: ["Juan", "María", "Pedro"],
  nivelAutoridad: 3
};
```

#### 2. **Declaration Merging (Fusión de Declaraciones)**
```typescript
// Primera declaración
interface Configuracion {
  apiUrl: string;
}

// Segunda declaración (se fusiona con la primera)
interface Configuracion {
  timeout: number;
}

// TypeScript las combina automáticamente
const config: Configuracion = {
  apiUrl: "https://api.ejemplo.com",
  timeout: 5000
};
```

#### 3. **Propiedades Opcionales y Readonly**
```typescript
interface ProductoConfiguracion {
  readonly id: string;           // No se puede modificar después de crear
  nombre: string;
  descripcion?: string;          // Propiedad opcional
  precio: number;
  enStock?: boolean;             // Propiedad opcional
}

const producto: ProductoConfiguracion = {
  id: "PROD-001",
  nombre: "Laptop",
  precio: 999.99
  // descripcion y enStock son opcionales
};

// producto.id = "OTRO-ID"; // ❌ Error: Cannot assign to 'id' because it is a read-only property
```

#### 4. **Interfaces para Funciones**
```typescript
interface CalculadoraOperacion {
  (a: number, b: number): number;
}

interface Calculadora {
  sumar: CalculadoraOperacion;
  restar: CalculadoraOperacion;
  multiplicar: CalculadoraOperacion;
  dividir: CalculadoraOperacion;
}

const miCalculadora: Calculadora = {
  sumar: (a, b) => a + b,
  restar: (a, b) => a - b,
  multiplicar: (a, b) => a * b,
  dividir: (a, b) => {
    if (b === 0) throw new Error("División por cero");
    return a / b;
  }
};
```

#### 5. **Index Signatures (Firmas de Índice)**
```typescript
interface DiccionarioTraduccion {
  [key: string]: string;
}

const traducciones: DiccionarioTraduccion = {
  "hello": "hola",
  "goodbye": "adiós",
  "thank you": "gracias"
};

// Puedes agregar cualquier clave string
traducciones["welcome"] = "bienvenido";
```

### 🎯 Cuándo Usar Interfaces

✅ **USA interfaces cuando:**
- Defines la estructura de objetos, especialmente para modelos de dominio
- Necesitas herencia múltiple o extensión de contratos
- Trabajas con clases y POO (las clases pueden implementar interfaces)
- Quieres aprovechar declaration merging
- Defines contratos para APIs públicas

```typescript
// Ejemplo perfecto para interfaces: Modelo de dominio con herencia
interface Vehiculo {
  marca: string;
  modelo: string;
  año: number;
}

interface VehiculoElectrico extends Vehiculo {
  capacidadBateria: number;
  tiempoCarga: number;
}

class Tesla implements VehiculoElectrico {
  constructor(
    public marca: string,
    public modelo: string,
    public año: number,
    public capacidadBateria: number,
    public tiempoCarga: number
  ) {}
  
  obtenerAutonomia(): number {
    return this.capacidadBateria * 4.5; // Cálculo simplificado
  }
}
```

---

## 🔶 Types: La Navaja Suiza de TypeScript {#types}

### ¿Qué son los Type Aliases?

Los type aliases son más versátiles que las interfaces. Pueden representar no solo objetos, sino también uniones, intersecciones, primitivos, tuplas y más.

### Sintaxis Básica

```typescript
type ID = string | number;
type Coordenadas = [number, number];
type EstadoPedido = "pendiente" | "procesando" | "enviado" | "entregado";

// Uso
let userId: ID = "USER-123";
userId = 456; // También válido

const ubicacion: Coordenadas = [40.7128, -74.0060];
const estado: EstadoPedido = "procesando";
```

### Características Únicas de Types

#### 1. **Union Types (Tipos de Unión)**
```typescript
type Respuesta<T> = 
  | { exito: true; data: T }
  | { exito: false; error: string };

function procesarRespuesta(resp: Respuesta<string>): void {
  if (resp.exito) {
    console.log("Datos:", resp.data);
  } else {
    console.error("Error:", resp.error);
  }
}

// Ejemplo más complejo: Estados de carga
type EstadoCarga<T> = 
  | { estado: "idle" }
  | { estado: "cargando" }
  | { estado: "exito"; data: T }
  | { estado: "error"; mensaje: string };

function manejarEstado<T>(estado: EstadoCarga<T>): void {
  switch (estado.estado) {
    case "idle":
      console.log("Esperando...");
      break;
    case "cargando":
      console.log("Cargando datos...");
      break;
    case "exito":
      console.log("Datos recibidos:", estado.data);
      break;
    case "error":
      console.error("Error:", estado.mensaje);
      break;
  }
}
```

#### 2. **Intersection Types (Tipos de Intersección)**
```typescript
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type Identificable = {
  id: string;
};

type Usuario = {
  nombre: string;
  email: string;
};

// Combinando tipos con intersección
type UsuarioCompleto = Usuario & Timestamped & Identificable;

const usuario: UsuarioCompleto = {
  id: "usr_123",
  nombre: "Laura Martínez",
  email: "laura@ejemplo.com",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date()
};
```

#### 3. **Tipos Condicionales**
```typescript
type EsArray<T> = T extends any[] ? true : false;

type Test1 = EsArray<string[]>;    // true
type Test2 = EsArray<number>;      // false

// Tipo condicional más útil
type ValorOArray<T> = T extends any[] ? T[number] : T;

type Ejemplo1 = ValorOArray<string[]>;   // string
type Ejemplo2 = ValorOArray<number>;     // number

// Extraer tipos de promesas
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type ResultadoPromesa = UnwrapPromise<Promise<string>>;  // string
type ResultadoNormal = UnwrapPromise<number>;            // number
```

#### 4. **Template Literal Types**
```typescript
type Prefijo = "get" | "set" | "has";
type Sufijo = "Name" | "Age" | "Email";

type NombreMetodo = `${Prefijo}${Sufijo}`;
// Genera: "getName" | "setName" | "hasName" | "getAge" | "setAge" | "hasAge" | ...

// Caso práctico: Rutas de API
type Entidad = "user" | "product" | "order";
type Accion = "create" | "read" | "update" | "delete";

type RutaAPI = `/api/${Entidad}/${Accion}`;
// Genera todas las combinaciones posibles de rutas
```

#### 5. **Utility Types con Type Aliases**
```typescript
type Usuario = {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: string;
};

// Crear variantes usando utility types
type UsuarioPublico = Omit<Usuario, "password">;
type UsuarioActualizable = Partial<Omit<Usuario, "id">>;
type UsuarioSoloLectura = Readonly<Usuario>;

// Tipos mapped personalizados
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type UsuarioNullable = Nullable<Usuario>;
```

### 🎯 Cuándo Usar Types

✅ **USA types cuando:**
- Necesitas union types o intersection types
- Trabajas con tipos primitivos, tuplas o tipos literales
- Creas alias para tipos complejos o largos
- Necesitas tipos condicionales o mapped types
- Quieres crear tipos utilitarios reutilizables

```typescript
// Ejemplo perfecto para types: Sistema de notificaciones con múltiples variantes
type NotificacionBase = {
  id: string;
  timestamp: Date;
  leida: boolean;
};

type NotificacionTexto = NotificacionBase & {
  tipo: "texto";
  mensaje: string;
};

type NotificacionImagen = NotificacionBase & {
  tipo: "imagen";
  urlImagen: string;
  altText?: string;
};

type NotificacionAccion = NotificacionBase & {
  tipo: "accion";
  titulo: string;
  botonTexto: string;
  botonAccion: () => void;
};

type Notificacion = NotificacionTexto | NotificacionImagen | NotificacionAccion;

function renderizarNotificacion(notif: Notificacion): void {
  switch (notif.tipo) {
    case "texto":
      console.log(`Mensaje: ${notif.mensaje}`);
      break;
    case "imagen":
      console.log(`Imagen: ${notif.urlImagen}`);
      break;
    case "accion":
      console.log(`${notif.titulo} - [${notif.botonTexto}]`);
      notif.botonAccion();
      break;
  }
}
```

---

## 🔵 Enums: Los Catálogos Predefinidos {#enums}

### ¿Qué son los Enums?

Los enums son una forma de definir un conjunto de constantes nombradas. Son útiles cuando tienes un conjunto fijo de valores que representan opciones o estados.

### Tipos de Enums

#### 1. **Numeric Enums**
```typescript
enum DiaSemana {
  Lunes,      // 0
  Martes,     // 1
  Miercoles,  // 2
  Jueves,     // 3
  Viernes,    // 4
  Sabado,     // 5
  Domingo     // 6
}

// Con valores personalizados
enum HttpStatus {
  OK = 200,
  Created = 201,
  Accepted = 202,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500
}

// Uso
function manejarRespuesta(status: HttpStatus): void {
  switch (status) {
    case HttpStatus.OK:
      console.log("Solicitud exitosa");
      break;
    case HttpStatus.NotFound:
      console.log("Recurso no encontrado");
      break;
    case HttpStatus.InternalServerError:
      console.log("Error del servidor");
      break;
  }
}
```

#### 2. **String Enums**
```typescript
enum TipoLog {
  ERROR = "ERROR",
  WARNING = "WARNING",
  INFO = "INFO",
  DEBUG = "DEBUG"
}

enum Direccion {
  Norte = "NORTE",
  Sur = "SUR",
  Este = "ESTE",
  Oeste = "OESTE"
}

// Ventaja: Los valores son más legibles en logs y debugging
console.log(TipoLog.ERROR); // "ERROR" en lugar de un número
```

#### 3. **Const Enums** (Optimización)
```typescript
const enum Permiso {
  Lectura = 1,
  Escritura = 2,
  Ejecucion = 4
}

// Se compila inline, no genera objeto JavaScript
const permisoTotal = Permiso.Lectura | Permiso.Escritura | Permiso.Ejecucion;
// Se compila a: const permisoTotal = 7;
```

#### 4. **Enums con Valores Calculados**
```typescript
enum FileAccess {
  None = 0,
  Read = 1 << 1,      // 2
  Write = 1 << 2,     // 4
  Execute = 1 << 3,   // 8
  ReadWrite = Read | Write,
  All = Read | Write | Execute
}

function verificarPermiso(acceso: FileAccess, permiso: FileAccess): boolean {
  return (acceso & permiso) === permiso;
}

const miAcceso = FileAccess.ReadWrite;
console.log(verificarPermiso(miAcceso, FileAccess.Read));   // true
console.log(verificarPermiso(miAcceso, FileAccess.Execute)); // false
```

### 🎯 Cuándo Usar Enums

✅ **USA enums cuando:**
- Tienes un conjunto fijo y conocido de valores constantes
- Los valores representan opciones mutuamente exclusivas
- Necesitas mapear valores a números (códigos de estado, flags)
- Quieres mejorar la legibilidad del código con constantes nombradas

⚠️ **EVITA enums cuando:**
- Los valores pueden cambiar dinámicamente
- Prefieres tree-shaking más eficiente (usa const assertions en su lugar)
- Solo necesitas tipos string literales simples

### Alternativa Moderna: Const Assertions
```typescript
// En lugar de enum
const COLORES = {
  Rojo: "#FF0000",
  Verde: "#00FF00",
  Azul: "#0000FF"
} as const;

type Color = typeof COLORES[keyof typeof COLORES];

// Ventajas: Mejor tree-shaking, más flexible
const miColor: Color = COLORES.Rojo;
```

---

## 🎯 Guía de Decisión: ¿Cuál Usar? {#guia-decision}

### Árbol de Decisión Rápido

```
¿Qué necesitas definir?
│
├─ ¿Un conjunto fijo de constantes nombradas?
│  └─ ✅ Usa ENUM
│
├─ ¿La estructura de un objeto/clase?
│  ├─ ¿Necesitas herencia o lo implementará una clase?
│  │  └─ ✅ Usa INTERFACE
│  └─ ¿Es una estructura simple sin herencia?
│     └─ ✅ Usa TYPE o INTERFACE (ambos funcionan)
│
├─ ¿Una unión de tipos diferentes?
│  └─ ✅ Usa TYPE
│
├─ ¿Un alias para un tipo primitivo o complejo?
│  └─ ✅ Usa TYPE
│
└─ ¿Tipos condicionales o mapped types?
   └─ ✅ Usa TYPE
```

### Tabla Comparativa Detallada

| Característica | Interface | Type | Enum |
|---------------|-----------|------|------|
| **Objetos** | ✅ Excelente | ✅ Excelente | ❌ No aplica |
| **Primitivos** | ❌ No soporta | ✅ Soporta | ❌ No aplica |
| **Uniones** | ❌ No soporta | ✅ Soporta | ❌ No aplica |
| **Tuplas** | ✅ Soporta | ✅ Soporta | ❌ No aplica |
| **Herencia** | ✅ extends | ❌ No (usa &) | ❌ No aplica |
| **Declaration Merging** | ✅ Sí | ❌ No | ❌ No |
| **Implements en clases** | ✅ Sí | ✅ Sí* | ❌ No |
| **Constantes nombradas** | ❌ No | ❌ No | ✅ Sí |
| **Valores en runtime** | ❌ No | ❌ No | ✅ Sí |
| **Tree-shaking** | ✅ Óptimo | ✅ Óptimo | ⚠️ Depende |

*Los types pueden ser implementados por clases solo si representan una estructura de objeto

---

## 🚀 Patrones Avanzados y Mejores Prácticas {#patrones-avanzados}

### 1. Patrón Builder con Interfaces
```typescript
interface ConstructorCoche {
  marca: string;
  modelo: string;
  año?: number;
  color?: string;
  motor?: string;
  extras?: string[];
}

class CocheBuilder {
  private coche: ConstructorCoche = {
    marca: "",
    modelo: ""
  };

  setMarca(marca: string): this {
    this.coche.marca = marca;
    return this;
  }

  setModelo(modelo: string): this {
    this.coche.modelo = modelo;
    return this;
  }

  setAño(año: number): this {
    this.coche.año = año;
    return this;
  }

  setColor(color: string): this {
    this.coche.color = color;
    return this;
  }

  build(): ConstructorCoche {
    return this.coche;
  }
}

// Uso fluido
const miCoche = new CocheBuilder()
  .setMarca("Toyota")
  .setModelo("Camry")
  .setAño(2024)
  .setColor("Azul")
  .build();
```

### 2. Discriminated Unions con Types
```typescript
type FiguraGeometrica = 
  | { tipo: "circulo"; radio: number }
  | { tipo: "rectangulo"; ancho: number; alto: number }
  | { tipo: "triangulo"; base: number; altura: number };

function calcularArea(figura: FiguraGeometrica): number {
  switch (figura.tipo) {
    case "circulo":
      return Math.PI * figura.radio ** 2;
    case "rectangulo":
      return figura.ancho * figura.alto;
    case "triangulo":
      return (figura.base * figura.altura) / 2;
    default:
      // TypeScript garantiza que todos los casos están cubiertos
      const _exhaustive: never = figura;
      throw new Error(`Figura no manejada: ${_exhaustive}`);
  }
}
```

### 3. State Machine con Enums
```typescript
enum EstadoPedido {
  Pendiente = "PENDIENTE",
  Confirmado = "CONFIRMADO",
  EnPreparacion = "EN_PREPARACION",
  Enviado = "ENVIADO",
  Entregado = "ENTREGADO",
  Cancelado = "CANCELADO"
}

interface TransicionesPermitidas {
  [EstadoPedido.Pendiente]: [EstadoPedido.Confirmado, EstadoPedido.Cancelado];
  [EstadoPedido.Confirmado]: [EstadoPedido.EnPreparacion, EstadoPedido.Cancelado];
  [EstadoPedido.EnPreparacion]: [EstadoPedido.Enviado];
  [EstadoPedido.Enviado]: [EstadoPedido.Entregado];
  [EstadoPedido.Entregado]: [];
  [EstadoPedido.Cancelado]: [];
}

class MaquinaEstadoPedido {
  constructor(private estadoActual: EstadoPedido = EstadoPedido.Pendiente) {}

  puedeTransicionar<T extends EstadoPedido>(
    nuevoEstado: T
  ): nuevoEstado is TransicionesPermitidas[typeof this.estadoActual][number] {
    const transicionesValidas = this.obtenerTransicionesValidas();
    return transicionesValidas.includes(nuevoEstado);
  }

  private obtenerTransicionesValidas(): EstadoPedido[] {
    const mapa: TransicionesPermitidas = {
      [EstadoPedido.Pendiente]: [EstadoPedido.Confirmado, EstadoPedido.Cancelado],
      [EstadoPedido.Confirmado]: [EstadoPedido.EnPreparacion, EstadoPedido.Cancelado],
      [EstadoPedido.EnPreparacion]: [EstadoPedido.Enviado],
      [EstadoPedido.Enviado]: [EstadoPedido.Entregado],
      [EstadoPedido.Entregado]: [],
      [EstadoPedido.Cancelado]: []
    };
    return mapa[this.estadoActual];
  }

  transicionar(nuevoEstado: EstadoPedido): void {
    if (!this.puedeTransicionar(nuevoEstado)) {
      throw new Error(
        `Transición inválida de ${this.estadoActual} a ${nuevoEstado}`
      );
    }
    this.estadoActual = nuevoEstado;
  }
}
```

### 4. Patrón Repository con Generics
```typescript
interface EntidadBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Repository<T extends EntidadBase> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, keyof EntidadBase>): Promise<T>;
  update(id: string, entity: Partial<Omit<T, keyof EntidadBase>>): Promise<T>;
  delete(id: string): Promise<void>;
}

// Implementación específica
interface Usuario extends EntidadBase {
  nombre: string;
  email: string;
  rol: "admin" | "usuario" | "invitado";
}

class UsuarioRepository implements Repository<Usuario> {
  async findById(id: string): Promise<Usuario | null> {
    // Implementación
    return null;
  }

  async findAll(): Promise<Usuario[]> {
    // Implementación
    return [];
  }

  async create(usuario: Omit<Usuario, keyof EntidadBase>): Promise<Usuario> {
    // Implementación
    const nuevoUsuario: Usuario = {
      ...usuario,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return nuevoUsuario;
  }

  async update(
    id: string, 
    usuario: Partial<Omit<Usuario, keyof EntidadBase>>
  ): Promise<Usuario> {
    // Implementación
    throw new Error("No implementado");
  }

  async delete(id: string): Promise<void> {
    // Implementación
  }

  // Métodos específicos del repositorio de usuarios
  async findByEmail(email: string): Promise<Usuario | null> {
    // Implementación específica
    return null;
  }

  async findByRol(rol: Usuario["rol"]): Promise<Usuario[]> {
    // Implementación específica
    return [];
  }
}
```

---

## 💼 Casos de Uso Reales {#casos-reales}

### Caso 1: Sistema de Autenticación
```typescript
// Enums para roles y permisos
enum Rol {
  Admin = "ADMIN",
  Moderador = "MODERADOR",
  Usuario = "USUARIO",
  Invitado = "INVITADO"
}

enum Permiso {
  Leer = "READ",
  Escribir = "WRITE",
  Eliminar = "DELETE",
  Administrar = "ADMIN"
}

// Interface para el usuario
interface IUsuario {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  permisos: Permiso[];
  verificado: boolean;
  ultimoAcceso: Date;
}

// Types para respuestas de autenticación
type RespuestaAuth = 
  | { exito: true; usuario: IUsuario; token: string }
  | { exito: false; error: string; codigo: number };

// Type para el payload del JWT
type JWTPayload = Pick<IUsuario, "id" | "email" | "rol"> & {
  exp: number;
  iat: number;
};

class ServicioAuth {
  async login(email: string, password: string): Promise<RespuestaAuth> {
    try {
      // Lógica de autenticación
      const usuario: IUsuario = {
        id: "usr_123",
        email,
        nombre: "Juan Pérez",
        rol: Rol.Usuario,
        permisos: [Permiso.Leer, Permiso.Escribir],
        verificado: true,
        ultimoAcceso: new Date()
      };

      return {
        exito: true,
        usuario,
        token: "jwt_token_aqui"
      };
    } catch (error) {
      return {
        exito: false,
        error: "Credenciales inválidas",
        codigo: 401
      };
    }
  }

  puedeAcceder(usuario: IUsuario, permisoRequerido: Permiso): boolean {
    // Los admins tienen todos los permisos
    if (usuario.rol === Rol.Admin) return true;
    
    return usuario.permisos.includes(permisoRequerido);
  }
}
```

### Caso 2: Sistema de E-commerce
```typescript
// Enums para estados y tipos
enum EstadoProducto {
  Disponible = "DISPONIBLE",
  Agotado = "AGOTADO",
  Descontinuado = "DESCONTINUADO"
}

enum MetodoPago {
  TarjetaCredito = "TARJETA_CREDITO",
  PayPal = "PAYPAL",
  Transferencia = "TRANSFERENCIA",
  Efectivo = "EFECTIVO"
}

// Interfaces para entidades principales
interface IProducto {
  id: string;
  nombre: string;
  precio: number;
  estado: EstadoProducto;
  stock: number;
  categorias: string[];
}

interface ICarritoItem {
  producto: IProducto;
  cantidad: number;
  subtotal: number;
}

interface ICarrito {
  items: ICarritoItem[];
  total: number;
  descuento?: number;
  impuestos: number;
  totalFinal: number;
}

// Types para el proceso de pago
type DireccionEnvio = {
  calle: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
};

type InfoPago = 
  | { metodo: MetodoPago.TarjetaCredito; numeroTarjeta: string; cvv: string }
  | { metodo: MetodoPago.PayPal; emailPaypal: string }
  | { metodo: MetodoPago.Transferencia; numeroCuenta: string }
  | { metodo: MetodoPago.Efectivo };

type EstadoCheckout = 
  | { paso: "carrito"; data: ICarrito }
  | { paso: "envio"; data: ICarrito & { direccion: DireccionEnvio } }
  | { paso: "pago"; data: ICarrito & { direccion: DireccionEnvio; pago: InfoPago } }
  | { paso: "confirmacion"; pedidoId: string };

class ServicioCheckout {
  private estado: EstadoCheckout = { 
    paso: "carrito", 
    data: { items: [], total: 0, impuestos: 0, totalFinal: 0 } 
  };

  avanzarPaso(): void {
    switch (this.estado.paso) {
      case "carrito":
        // Validar carrito y avanzar a envío
        break;
      case "envio":
        // Validar dirección y avanzar a pago
        break;
      case "pago":
        // Procesar pago y confirmar
        break;
    }
  }

  calcularCostoEnvio(direccion: DireccionEnvio): number {
    // Lógica de cálculo basada en la dirección
    return direccion.pais === "LOCAL" ? 5.00 : 15.00;
  }
}
```

### Caso 3: Sistema de Notificaciones en Tiempo Real
```typescript
// Enum para prioridades
enum PrioridadNotificacion {
  Baja = 1,
  Media = 2,
  Alta = 3,
  Urgente = 4
}

// Interface base para todas las notificaciones
interface INotificacionBase {
  id: string;
  timestamp: Date;
  usuarioId: string;
  leida: boolean;
  prioridad: PrioridadNotificacion;
}

// Types para diferentes tipos de notificaciones
type NotificacionMensaje = INotificacionBase & {
  tipo: "mensaje";
  remitente: string;
  mensaje: string;
  conversacionId: string;
};

type NotificacionSistema = INotificacionBase & {
  tipo: "sistema";
  titulo: string;
  descripcion: string;
  icono: string;
};

type NotificacionActividad = INotificacionBase & {
  tipo: "actividad";
  actor: string;
  accion: "like" | "comment" | "share" | "follow";
  recurso: {
    tipo: "post" | "foto" | "video";
    id: string;
    titulo: string;
  };
};

type Notificacion = NotificacionMensaje | NotificacionSistema | NotificacionActividad;

// Interface para el servicio de notificaciones
interface IServicioNotificaciones {
  enviar(notificacion: Omit<Notificacion, "id" | "timestamp">): Promise<void>;
  obtenerNoLeidas(usuarioId: string): Promise<Notificacion[]>;
  marcarComoLeida(notificacionId: string): Promise<void>;
  marcarTodasComoLeidas(usuarioId: string): Promise<void>;
}

class ManejadorNotificaciones implements IServicioNotificaciones {
  private notificaciones: Map<string, Notificacion> = new Map();
  
  async enviar(notificacion: Omit<Notificacion, "id" | "timestamp">): Promise<void> {
    const nuevaNotificacion = {
      ...notificacion,
      id: crypto.randomUUID(),
      timestamp: new Date()
    } as Notificacion;
    
    this.notificaciones.set(nuevaNotificacion.id, nuevaNotificacion);
    
    // Enviar según prioridad
    if (nuevaNotificacion.prioridad >= PrioridadNotificacion.Alta) {
      await this.enviarPushNotification(nuevaNotificacion);
    }
  }
  
  async obtenerNoLeidas(usuarioId: string): Promise<Notificacion[]> {
    return Array.from(this.notificaciones.values())
      .filter(n => n.usuarioId === usuarioId && !n.leida)
      .sort((a, b) => b.prioridad - a.prioridad);
  }
  
  async marcarComoLeida(notificacionId: string): Promise<void> {
    const notif = this.notificaciones.get(notificacionId);
    if (notif) {
      notif.leida = true;
    }
  }
  
  async marcarTodasComoLeidas(usuarioId: string): Promise<void> {
    for (const notif of this.notificaciones.values()) {
      if (notif.usuarioId === usuarioId) {
        notif.leida = true;
      }
    }
  }
  
  private async enviarPushNotification(notificacion: Notificacion): Promise<void> {
    console.log(`📱 Push notification enviada:`, notificacion);
  }
  
  // Método helper para formatear notificaciones para UI
  formatearParaUI(notificacion: Notificacion): string {
    switch (notificacion.tipo) {
      case "mensaje":
        return `💬 ${notificacion.remitente}: ${notificacion.mensaje}`;
      case "sistema":
        return `🔔 ${notificacion.titulo}: ${notificacion.descripcion}`;
      case "actividad":
        const accionTexto = {
          like: "le gustó tu",
          comment: "comentó en tu",
          share: "compartió tu",
          follow: "comenzó a seguirte"
        };
        return `👤 ${notificacion.actor} ${accionTexto[notificacion.accion]} ${notificacion.recurso.tipo}`;
    }
  }
}
```

---

## 📝 Resumen de Mejores Prácticas

### ✅ DO's (Hacer)

1. **Usa interfaces para contratos de objetos y POO**
   - Define estructuras claras para tus modelos de dominio
   - Aprovecha la herencia cuando tengas jerarquías naturales

2. **Usa types para composición y tipos complejos**
   - Crea uniones discriminadas para estados mutuamente exclusivos
   - Combina tipos existentes con intersecciones

3. **Usa enums para conjuntos fijos de constantes**
   - Define códigos de estado, roles, permisos
   - Agrupa valores relacionados que no cambiarán

4. **Nombra consistentemente**
   - Interfaces: Prefijo `I` o sufijo `Interface` (opcional pero consistente)
   - Types: PascalCase descriptivo
   - Enums: PascalCase para el enum, PascalCase o UPPER_CASE para valores

5. **Documenta tipos complejos**
   ```typescript
   /**
    * Representa el estado de una transacción financiera
    * @property estado - Estado actual de la transacción
    * @property monto - Monto en centavos para evitar decimales
    */
   type TransaccionFinanciera = {
     estado: "pendiente" | "procesada" | "rechazada";
     monto: number;
     moneda: "USD" | "EUR" | "MXN";
   };
   ```

### ❌ DON'Ts (No hacer)

1. **No uses enums para valores que pueden cambiar**
   - Evita enums para listas de países, idiomas, etc.

2. **No mezcles interfaces y types sin criterio**
   - Mantén consistencia en tu codebase

3. **No abuses de `any` o `unknown`**
   - Siempre prefiere tipos específicos

4. **No ignores los utility types de TypeScript**
   - Usa `Partial`, `Required`, `Pick`, `Omit`, etc.

5. **No crees tipos demasiado genéricos**
   - Encuentra el balance entre reutilización y especificidad

---

## 🎓 Conclusión

La maestría en TypeScript viene de entender no solo **qué** hace cada herramienta, sino **cuándo** y **por qué** usar cada una:

- **Interfaces**: Tu primera opción para definir contratos de objetos, especialmente en POO
- **Types**: Tu navaja suiza para todo lo demás - uniones, intersecciones, y tipos complejos
- **Enums**: Perfectos para constantes nombradas que representan un conjunto fijo de opciones

Recuerda: No hay una respuesta "correcta" absoluta. La mejor elección depende de:
- El contexto de tu aplicación
- La consistencia con tu codebase existente
- Las necesidades específicas del problema que estás resolviendo
- La claridad y mantenibilidad del código resultante

¡Practica estos conceptos, experimenta con los ejemplos, y pronto estarás escribiendo TypeScript como un verdadero experto! 🚀