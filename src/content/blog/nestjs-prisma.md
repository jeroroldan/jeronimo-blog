---

title: 'NestJS + Prisma + PostgreSQL'
code: 'nestjs'
description: 'rquitectura Backend Moderna - De Principiante a Arquitecto'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Masterclass: NestJS + Prisma + PostgreSQL
## Arquitectura Backend Moderna - De Principiante a Arquitecto

---

## 🎯 **¿POR QUÉ ESTE STACK DOMINARÁ EL FUTURO?**

### **La Santísima Trinidad del Backend Moderno:**
```
     🏗️ NestJS
    (Arquitectura)
         ↕️
     🔧 Prisma          📊 PostgreSQL
   (ORM Moderno)       (Base de Datos)
```

**¿Por qué esta combinación es imparable?**
- ✅ **TypeScript nativo** - Type safety de punta a punta
- ✅ **Escalabilidad empresarial** - Arquitectura modular y testeable
- ✅ **DX (Developer Experience) superior** - Productividad máxima
- ✅ **Performance** - Optimizaciones automáticas
- ✅ **Ecosystem robusto** - Compatibilidad con todo el ecosistema JS

### **Analogía: Construyendo una Casa**
```
🏗️ NestJS = El Arquitecto (diseña la estructura)
🔧 Prisma = El Plomero/Electricista (conecta todo)
📊 PostgreSQL = Los Cimientos (almacena todo)
```

---

## 🔰 **MÓDULO 1: SETUP Y CONFIGURACIÓN INICIAL**

### **1. Preparando el Terreno**
```bash
# Crear proyecto NestJS
npm i -g @nestjs/cli
nest new ecommerce-argentina
cd ecommerce-argentina

# Instalar Prisma y PostgreSQL
npm install prisma @prisma/client
npm install -D prisma

# Instalar dependencias adicionales
npm install @nestjs/config class-validator class-transformer

# Inicializar Prisma
npx prisma init
```

### **2. Configuración de PostgreSQL**
```bash
# Docker para desarrollo local (recomendado)
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      - POSTGRES_USER=ecommerce_user
      - POSTGRES_PASSWORD=mi_password_seguro
      - POSTGRES_DB=ecommerce_argentina
    volumes:
      - postgres:/var/lib/postgresql/data
    ports:
      - '5432:5432'

volumes:
  postgres:

# Alternativamente, instalación local en Ubuntu
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createuser --createdb --pwprompt ecommerce_user
sudo -u postgres createdb -O ecommerce_user ecommerce_argentina
```

### **3. Configuración de Environment**
```bash
# .env
DATABASE_URL="postgresql://ecommerce_user:mi_password_seguro@localhost:5432/ecommerce_argentina?schema=public"
JWT_SECRET="mi_jwt_secret_super_seguro_para_produccion"
BCRYPT_ROUNDS=12
```

### **4. Configuración Inicial de Prisma**
```javascript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Configuración para desarrollo
generator erd {
  provider = "prisma-erd-generator"
  output   = "../docs/ERD.svg"
}
```

---

## 🏗️ **MÓDULO 2: MODELOS Y SCHEMA - LOS CIMIENTOS**

### **Analogía: Los Modelos como Planos de una Casa**
```
Un Modelo = Un Plano de Habitación
- Define qué va en cada espacio
- Establece las conexiones entre habitaciones
- Especifica materiales y restricciones
```

### **1. Modelo Base: Usuario**
```prisma
// prisma/schema.prisma

// Enum para tipos de usuario
enum TipoUsuario {
  CLIENTE
  VENDEDOR
  ADMIN
  SUPER_ADMIN
}

// Enum para estado del usuario
enum EstadoUsuario {
  ACTIVO
  INACTIVO
  SUSPENDIDO
  PENDIENTE_VERIFICACION
}

model Usuario {
  id                    String         @id @default(cuid())
  email                 String         @unique
  password              String
  nombre                String
  apellido              String
  telefono              String?
  fechaNacimiento       DateTime?
  tipo                  TipoUsuario    @default(CLIENTE)
  estado                EstadoUsuario  @default(PENDIENTE_VERIFICACION)
  emailVerificado       Boolean        @default(false)
  emailVerificadoEn     DateTime?
  
  // Timestamps automáticos
  creadoEn              DateTime       @default(now())
  actualizadoEn         DateTime       @updatedAt
  
  // Soft delete
  eliminadoEn           DateTime?
  
  // Relaciones (las veremos después)
  perfil                Perfil?
  direcciones           Direccion[]
  productos             Producto[]     // Si es vendedor
  ordenes               Orden[]        // Si es cliente
  resenas               Resena[]
  
  // Configuraciones de índices
  @@map("usuarios") // Nombre de la tabla en la BD
}
```

### **2. Perfil Extendido del Usuario**
```prisma
model Perfil {
  id                    String      @id @default(cuid())
  usuarioId             String      @unique
  avatar                String?
  biografia             String?
  sitioWeb              String?
  redesSociales         Json?       // {twitter: "@user", instagram: "@user"}
  preferencias          Json?       // Configuraciones del usuario
  configuracionPrivacidad Json?     // Settings de privacidad
  
  // Timestamps
  creadoEn              DateTime    @default(now())
  actualizadoEn         DateTime    @updatedAt
  
  // Relación
  usuario               Usuario     @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  
  @@map("perfiles")
}
```

### **3. Sistema de Ubicaciones (Argentina)**
```prisma
model Provincia {
  id            String      @id @default(cuid())
  nombre        String      @unique
  codigo        String      @unique // BA, CABA, SF, etc.
  region        String      // NOA, NEA, Cuyo, Centro, Patagonia
  
  ciudades      Ciudad[]
  
  @@map("provincias")
}

model Ciudad {
  id            String      @id @default(cuid())
  nombre        String
  codigoPostal  String
  provinciaId   String
  latitud       Float?
  longitud      Float?
  
  // Relaciones
  provincia     Provincia   @relation(fields: [provinciaId], references: [id])
  direcciones   Direccion[]
  
  // Índice compuesto para búsquedas
  @@unique([nombre, provinciaId])
  @@index([provinciaId, nombre])
  @@map("ciudades")
}

model Direccion {
  id            String      @id @default(cuid())
  usuarioId     String
  calle         String
  numero        String
  piso          String?
  departamento  String?
  ciudadId      String
  codigoPostal  String
  referencia    String?     // "Casa azul con portón negro"
  esPrincipal   Boolean     @default(false)
  esFacturacion Boolean     @default(false)
  
  // Timestamps
  creadoEn      DateTime    @default(now())
  actualizadoEn DateTime    @updatedAt
  
  // Relaciones
  usuario       Usuario     @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  ciudad        Ciudad      @relation(fields: [ciudadId], references: [id])
  ordenesEnvio  Orden[]     @relation("DireccionEnvio")
  ordenesFacturacion Orden[] @relation("DireccionFacturacion")
  
  @@index([usuarioId, esPrincipal])
  @@map("direcciones")
}
```

### **4. Catálogo de Productos**
```prisma
enum EstadoProducto {
  BORRADOR
  ACTIVO
  PAUSADO
  AGOTADO
  DESCONTINUADO
}

model Categoria {
  id            String      @id @default(cuid())
  nombre        String
  slug          String      @unique
  descripcion   String?
  imagen        String?
  icono         String?
  parentId      String?     // Para categorías anidadas
  orden         Int         @default(0)
  activa        Boolean     @default(true)
  
  // Timestamps
  creadoEn      DateTime    @default(now())
  actualizadoEn DateTime    @updatedAt
  
  // Relaciones
  parent        Categoria?  @relation("CategoriaHijos", fields: [parentId], references: [id])
  hijos         Categoria[] @relation("CategoriaHijos")
  productos     Producto[]
  
  @@index([parentId, activa, orden])
  @@map("categorias")
}

model Marca {
  id            String      @id @default(cuid())
  nombre        String      @unique
  slug          String      @unique
  descripcion   String?
  logo          String?
  sitioWeb      String?
  activa        Boolean     @default(true)
  
  // Timestamps
  creadoEn      DateTime    @default(now())
  actualizadoEn DateTime    @updatedAt
  
  // Relaciones
  productos     Producto[]
  
  @@map("marcas")
}

model Producto {
  id                String          @id @default(cuid())
  nombre            String
  slug              String          @unique
  descripcion       String
  descripcionCorta  String?
  sku               String          @unique
  codigoBarras      String?         @unique
  
  // Pricing
  precio            Decimal         @db.Money
  precioOferta      Decimal?        @db.Money
  costo             Decimal?        @db.Money // Para cálculo de margen
  
  // Inventory
  stock             Int             @default(0)
  stockMinimo       Int             @default(0)
  stockMaximo       Int?
  gestionarStock    Boolean         @default(true)
  
  // Physical properties
  peso              Float?          // en kg
  dimensiones       Json?           // {largo, ancho, alto} en cm
  
  // Categorización
  categoriaId       String
  marcaId           String?
  vendedorId        String
  
  // Estado y visibilidad
  estado            EstadoProducto  @default(BORRADOR)
  destacado         Boolean         @default(false)
  envioGratis       Boolean         @default(false)
  
  // SEO y metadata
  metaTitle         String?
  metaDescription   String?
  tags              String[]        // Array de strings
  
  // Timestamps
  creadoEn          DateTime        @default(now())
  actualizadoEn     DateTime        @updatedAt
  publicadoEn       DateTime?
  eliminadoEn       DateTime?       // Soft delete
  
  // Relaciones
  categoria         Categoria       @relation(fields: [categoriaId], references: [id])
  marca             Marca?          @relation(fields: [marcaId], references: [id])
  vendedor          Usuario         @relation(fields: [vendedorId], references: [id])
  imagenes          ProductoImagen[]
  variantes         ProductoVariante[]
  resenas           Resena[]
  ordenItems        OrdenItem[]
  carritoItems      CarritoItem[]
  
  // Índices para performance
  @@index([categoriaId, estado, publicadoEn])
  @@index([vendedorId, estado])
  @@index([precio, estado])
  @@fulltext([nombre, descripcion])
  @@map("productos")
}

model ProductoImagen {
  id            String      @id @default(cuid())
  productoId    String
  url           String
  urlThumbnail  String?
  alt           String?
  orden         Int         @default(0)
  esPrincipal   Boolean     @default(false)
  
  // Timestamps
  creadoEn      DateTime    @default(now())
  
  // Relación
  producto      Producto    @relation(fields: [productoId], references: [id], onDelete: Cascade)
  
  @@index([productoId, orden])
  @@map("producto_imagenes")
}

// Para productos con variantes (ej: talle, color)
model ProductoVariante {
  id            String      @id @default(cuid())
  productoId    String
  nombre        String      // "Talle L - Color Rojo"
  sku           String      @unique
  precio        Decimal?    @db.Money // Si tiene precio diferente
  stock         Int         @default(0)
  atributos     Json        // {talle: "L", color: "Rojo"}
  activa        Boolean     @default(true)
  
  // Timestamps
  creadoEn      DateTime    @default(now())
  actualizadoEn DateTime    @updatedAt
  
  // Relación
  producto      Producto    @relation(fields: [productoId], references: [id], onDelete: Cascade)
  ordenItems    OrdenItem[]
  
  @@index([productoId, activa])
  @@map("producto_variantes")
}
```

### **5. Sistema de Órdenes y Pagos**
```prisma
enum EstadoOrden {
  PENDIENTE
  CONFIRMADA
  PREPARANDO
  ENVIADA
  ENTREGADA
  CANCELADA
  DEVUELTA
}

enum EstadoPago {
  PENDIENTE
  PROCESANDO
  APROBADO
  RECHAZADO
  CANCELADO
  REEMBOLSADO
}

enum MetodoPago {
  MERCADO_PAGO
  TRANSFERENCIA
  EFECTIVO
  TARJETA_CREDITO
  TARJETA_DEBITO
}

model Orden {
  id                    String              @id @default(cuid())
  numero                String              @unique // ORD-2024-001
  usuarioId             String
  
  // Direcciones
  direccionEnvioId      String
  direccionFacturacionId String?
  
  // Amounts
  subtotal              Decimal             @db.Money
  descuentos            Decimal             @default(0) @db.Money
  impuestos             Decimal             @default(0) @db.Money // IVA 21%
  costoEnvio            Decimal             @default(0) @db.Money
  total                 Decimal             @db.Money
  
  // Estado y tracking
  estado                EstadoOrden         @default(PENDIENTE)
  numeroSeguimiento     String?
  transportista         String?
  
  // Notas y observaciones
  notasCliente          String?
  notasInternas         String?
  
  // Timestamps importantes
  creadoEn              DateTime            @default(now())
  actualizadoEn         DateTime            @updatedAt
  confirmadaEn          DateTime?
  enviadaEn             DateTime?
  entregadaEn           DateTime?
  
  // Relaciones
  usuario               Usuario             @relation(fields: [usuarioId], references: [id])
  direccionEnvio        Direccion           @relation("DireccionEnvio", fields: [direccionEnvioId], references: [id])
  direccionFacturacion  Direccion?          @relation("DireccionFacturacion", fields: [direccionFacturacionId], references: [id])
  items                 OrdenItem[]
  pagos                 Pago[]
  movimientos           OrdenMovimiento[]   // Historial de cambios de estado
  
  @@index([usuarioId, estado, creadoEn])
  @@index([numero])
  @@map("ordenes")
}

model OrdenItem {
  id                String              @id @default(cuid())
  ordenId           String
  productoId        String
  varianteId        String?
  cantidad          Int
  precioUnitario    Decimal             @db.Money
  descuento         Decimal             @default(0) @db.Money
  total             Decimal             @db.Money
  
  // Snapshot del producto al momento de la compra
  productoSnapshot  Json                // Guardamos nombre, descripción, etc.
  
  // Timestamps
  creadoEn          DateTime            @default(now())
  
  // Relaciones
  orden             Orden               @relation(fields: [ordenId], references: [id], onDelete: Cascade)
  producto          Producto            @relation(fields: [productoId], references: [id])
  variante          ProductoVariante?   @relation(fields: [varianteId], references: [id])
  
  @@index([ordenId])
  @@index([productoId])
  @@map("orden_items")
}

model Pago {
  id                String      @id @default(cuid())
  ordenId           String
  metodo            MetodoPago
  estado            EstadoPago  @default(PENDIENTE)
  monto             Decimal     @db.Money
  
  // Detalles del procesador de pagos
  referenciaExterna String?     // ID de MercadoPago, Stripe, etc.
  metadata          Json?       // Datos adicionales del pago
  
  // Timestamps
  creadoEn          DateTime    @default(now())
  actualizadoEn     DateTime    @updatedAt
  procesadoEn       DateTime?
  
  // Relación
  orden             Orden       @relation(fields: [ordenId], references: [id])
  
  @@index([ordenId, estado])
  @@index([referenciaExterna])
  @@map("pagos")
}

// Historial de movimientos de la orden
model OrdenMovimiento {
  id            String      @id @default(cuid())
  ordenId       String
  estadoAnterior EstadoOrden?
  estadoNuevo   EstadoOrden
  comentario    String?
  metadata      Json?       // Datos adicionales del movimiento
  
  // Timestamps
  creadoEn      DateTime    @default(now())
  
  // Relación
  orden         Orden       @relation(fields: [ordenId], references: [id], onDelete: Cascade)
  
  @@index([ordenId, creadoEn])
  @@map("orden_movimientos")
}
```

### **6. Sistema de Carrito de Compras**
```prisma
model Carrito {
  id            String        @id @default(cuid())
  usuarioId     String?       // Null para carritos de invitados
  sessionId     String?       // Para usuarios no logueados
  
  // Timestamps
  creadoEn      DateTime      @default(now())
  actualizadoEn DateTime      @updatedAt
  expiraEn      DateTime?     // Para limpiar carritos abandonados
  
  // Relaciones
  usuario       Usuario?      @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  items         CarritoItem[]
  
  @@unique([usuarioId]) // Un carrito por usuario
  @@index([sessionId])
  @@index([expiraEn])
  @@map("carritos")
}

model CarritoItem {
  id            String              @id @default(cuid())
  carritoId     String
  productoId    String
  varianteId    String?
  cantidad      Int
  
  // Timestamps
  creadoEn      DateTime            @default(now())
  actualizadoEn DateTime            @updatedAt
  
  // Relaciones
  carrito       Carrito             @relation(fields: [carritoId], references: [id], onDelete: Cascade)
  producto      Producto            @relation(fields: [productoId], references: [id], onDelete: Cascade)
  variante      ProductoVariante?   @relation(fields: [varianteId], references: [id], onDelete: Cascade)
  
  @@unique([carritoId, productoId, varianteId])
  @@map("carrito_items")
}
```

### **7. Sistema de Reseñas y Calificaciones**
```prisma
model Resena {
  id            String      @id @default(cuid())
  usuarioId     String
  productoId    String
  ordenId       String?     // Solo puede reseñar si compró el producto
  calificacion  Int         // 1-5 estrellas
  titulo        String?
  comentario    String?
  imagenes      String[]    // URLs de imágenes de la reseña
  verificada    Boolean     @default(false) // Si es de compra verificada
  moderada      Boolean     @default(false)
  aprobada      Boolean     @default(true)
  
  // Utilidad de la reseña (votos de otros usuarios)
  votosUtiles   Int         @default(0)
  votosInutiles Int         @default(0)
  
  // Timestamps
  creadoEn      DateTime    @default(now())
  actualizadoEn DateTime    @updatedAt
  
  // Relaciones
  usuario       Usuario     @relation(fields: [usuarioId], references: [id])
  producto      Producto    @relation(fields: [productoId], references: [id], onDelete: Cascade)
  
  @@unique([usuarioId, productoId]) // Un usuario, una reseña por producto
  @@index([productoId, aprobada, calificacion])
  @@map("resenas")
}
```

### **Migración y Sincronización**
```bash
# Generar migración
npx prisma migrate dev --name init

# Generar cliente Prisma
npx prisma generate

# Ver base de datos en browser
npx prisma studio

# Reset de base de datos (desarrollo)
npx prisma migrate reset

# Deploy a producción
npx prisma migrate deploy
```

---

## 🔗 **MÓDULO 3: RELACIONES - CONECTANDO EL ECOSISTEMA**

### **Analogía: Las Relaciones como Sistema Nervioso**
```
Imagina tu base de datos como un cuerpo humano:
- Las tablas son los órganos
- Las relaciones son el sistema nervioso
- Los foreign keys son las conexiones neuronales
```

### **1. One-to-One: Usuario ↔ Perfil**
```prisma
// En el schema.prisma ya definido

// Uso en el código NestJS
// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUserWithProfile(data: CreateUserDto) {
    return this.prisma.usuario.create({
      data: {
        email: data.email,
        password: data.hashedPassword,
        nombre: data.nombre,
        apellido: data.apellido,
        // Crear perfil automáticamente
        perfil: {
          create: {
            biografia: data.biografia || '',
            preferencias: {
              newsletter: true,
              tema: 'claro'
            }
          }
        }
      },
      include: {
        perfil: true
      }
    });
  }

  async getUserWithProfile(id: string) {
    return this.prisma.usuario.findUnique({
      where: { id },
      include: {
        perfil: true,
        direcciones: {
          include: {
            ciudad: {
              include: {
                provincia: true
              }
            }
          }
        }
      }
    });
  }
}
```

### **2. One-to-Many: Usuario → Productos**
```typescript
// products/products.service.ts
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(vendedorId: string, data: CreateProductDto) {
    return this.prisma.producto.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        stock: data.stock,
        sku: this.generateSKU(),
        // Conectar con vendedor
        vendedor: {
          connect: { id: vendedorId }
        },
        // Conectar con categoría
        categoria: {
          connect: { id: data.categoriaId }
        },
        // Crear imágenes
        imagenes: {
          create: data.imagenes?.map((img, index) => ({
            url: img.url,
            alt: img.alt,
            orden: index,
            esPrincipal: index === 0
          }))
        }
      },
      include: {
        categoria: true,
        marca: true,
        imagenes: true
      }
    });
  }

  async getProductsByVendedor(vendedorId: string) {
    return this.prisma.producto.findMany({
      where: { 
        vendedorId,
        eliminadoEn: null // No incluir eliminados
      },
      include: {
        categoria: true,
        imagenes: {
          where: { esPrincipal: true },
          take: 1
        },
        _count: {
          select: {
            resenas: true,
            ordenItems: true
          }
        }
      },
      orderBy: {
        creadoEn: 'desc'
      }
    });
  }

  // Consulta optimizada para catálogo
  async getCatalog(filters: ProductFiltersDto) {
    const where: any = {
      estado: 'ACTIVO',
      eliminadoEn: null
    };

    if (filters.categoriaId) {
      where.categoriaId = filters.categoriaId;
    }

    if (filters.search) {
      where.OR = [
        { nombre: { contains: filters.search, mode: 'insensitive' } },
        { descripcion: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    if (filters.precioMin || filters.precioMax) {
      where.precio = {};
      if (filters.precioMin) where.precio.gte = filters.precioMin;
      if (filters.precioMax) where.precio.lte = filters.precioMax;
    }

    return this.prisma.producto.findMany({
      where,
      include: {
        categoria: {
          select: { nombre: true, slug: true }
        },
        marca: {
          select: { nombre: true, logo: true }
        },
        imagenes: {
          where: { esPrincipal: true },
          take: 1,
          select: { url: true, alt: true }
        },
        resenas: {
          select: { calificacion: true },
          where: { aprobada: true }
        }
      },
      orderBy: this.buildOrderBy(filters.orderBy),
      take: filters.limit || 20,
      skip: ((filters.page || 1) - 1) * (filters.limit || 20)
    });
  }

  private buildOrderBy(orderBy?: string) {
    switch (orderBy) {
      case 'precio_asc': return { precio: 'asc' };
      case 'precio_desc': return { precio: 'desc' };
      case 'nombre': return { nombre: 'asc' };
      case 'popular': return { ordenItems: { _count: 'desc' } };
      default: return { creadoEn: 'desc' };
    }
  }
}
```

### **3. Many-to-Many: Productos ↔ Tags**
```prisma
// Primero, agreguemos el modelo de Tags al schema
model Tag {
  id            String      @id @default(cuid())
  nombre        String      @unique
  slug          String      @unique
  color         String      @default("#3B82F6")
  descripcion   String?
  activo        Boolean     @default(true)
  
  creadoEn      DateTime    @default(now())
  actualizadoEn DateTime    @updatedAt
  
  // Relación many-to-many
  productos     ProductoTag[]
  
  @@map("tags")
}

model ProductoTag {
  productoId    String
  tagId         String
  asignadoEn    DateTime    @default(now())
  asignadoPor   String?     // ID del usuario que asignó el tag
  
  producto      Producto    @relation(fields: [productoId], references: [id], onDelete: Cascade)
  tag           Tag         @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([productoId, tagId])
  @@map("producto_tags")
}

// Actualizar modelo Producto
model Producto {
  // ... campos existentes
  tags          ProductoTag[]
  // ... resto de relaciones
}
```

```typescript
// tags/tags.service.ts
@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async assignTagsToProduct(productoId: string, tagIds: string[], asignadoPor?: string) {
    // Primero eliminar tags existentes
    await this.prisma.productoTag.deleteMany({
      where: { productoId }
    });

    // Luego asignar los nuevos
    const tagsData = tagIds.map(tagId => ({
      productoId,
      tagId,
      asignadoPor
    }));

    return this.prisma.productoTag.createMany({
      data: tagsData
    });
  }

  async getProductsWithTags(tagSlugs: string[]) {
    return this.prisma.producto.findMany({
      where: {
        tags: {
          some: {
            tag: {
              slug: { in: tagSlugs }
            }
          }
        },
        estado: 'ACTIVO'
      },
      include: {
        categoria: true,
        imagenes: {
          where: { esPrincipal: true },
          take: 1
        },
        tags: {
          include: {
            tag: {
              select: { nombre: true, color: true, slug: true }
            }
          }
        }
      }
    });
  }

  async getPopularTags() {
    return this.prisma.tag.findMany({
      where: { activo: true },
      include: {
        _count: {
          select: {
            productos: {
              where: {
                producto: {
                  estado: 'ACTIVO'
                }
              }
            }
          }
        }
      },
      orderBy: {
        productos: {
          _count: 'desc'
        }
      },
      take: 20
    });
  }
}
```

### **4. Relaciones Complejas: Sistema de Órdenes**
```typescript
// orders/orders.service.ts
@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(usuarioId: string, data: CreateOrderDto) {
    return this.prisma.$transaction(async (prisma) => {
      // 1. Crear la orden
      const orden = await prisma.orden.create({
        data: {
          numero: await this.generateOrderNumber(),
          usuarioId,
          direccionEnvioId: data.direccionEnvioId,
          direccionFacturacionId: data.direccionFacturacionId,
          subtotal: 0,
          total: 0,
          estado: 'PENDIENTE'
        }
      });

      let subtotal = 0;

      // 2. Crear los items de la orden
      for (const item of data.items) {
        const producto = await prisma.producto.findUnique({
          where: { id: item.productoId },
          include: { variantes: true }
        });

        if (!producto) {
          throw new Error(`Producto ${item.productoId} no encontrado`);
        }

        // Verificar stock
        const stockDisponible = item.varianteId 
          ? producto.variantes.find(v => v.id === item.varianteId)?.stock || 0
          : producto.stock;

        if (stockDisponible < item.cantidad) {
          throw new Error(`Stock insuficiente para ${producto.nombre}`);
        }

        const precioUnitario = item.varianteId
          ? producto.variantes.find(v => v.id === item.varianteId)?.precio || producto.precio
          : producto.precio;

        const total = Number(precioUnitario) * item.cantidad;
        subtotal += total;

        // Crear item de la orden
        await prisma.ordenItem.create({
          data: {
            ordenId: orden.id,
            productoId: item.productoId,
            varianteId: item.varianteId,
            cantidad: item.cantidad,
            precioUnitario,
            total,
            productoSnapshot: {
              nombre: producto.nombre,
              descripcion: producto.descripcion,
              sku: producto.sku,
              imagen: producto.imagenes?.[0]?.url
            }
          }
        });

        // Actualizar stock
        if (item.varianteId) {
          await prisma.productoVariante.update({
            where: { id: item.varianteId },
            data: { stock: { decrement: item.cantidad } }
          });
        } else {
          await prisma.producto.update({
            where: { id: item.productoId },
            data: { stock: { decrement: item.cantidad } }
          });
        }
      }

      // 3. Calcular totales
      const impuestos = subtotal * 0.21; // IVA 21%
      const costoEnvio = data.costoEnvio || 0;
      const total = subtotal + impuestos + costoEnvio;

      // 4. Actualizar orden con totales
      const ordenFinal = await prisma.orden.update({
        where: { id: orden.id },
        data: {
          subtotal,
          impuestos,
          costoEnvio,
          total
        },
        include: {
          usuario: {
            select: { nombre: true, apellido: true, email: true }
          },
          direccionEnvio: {
            include: {
              ciudad: {
                include: { provincia: true }
              }
            }
          },
          items: {
            include: {
              producto: {
                select: { nombre: true, imagenes: { take: 1 } }
              },
              variante: {
                select: { nombre: true, atributos: true }
              }
            }
          }
        }
      });

      // 5. Registrar movimiento
      await prisma.ordenMovimiento.create({
        data: {
          ordenId: orden.id,
          estadoNuevo: 'PENDIENTE',
          comentario: 'Orden creada'
        }
      });

      // 6. Limpiar carrito del usuario
      await prisma.carritoItem.deleteMany({
        where: {
          carrito: { usuarioId }
        }
      });

      return ordenFinal;
    });
  }

  async updateOrderStatus(ordenId: string, nuevoEstado: EstadoOrden, comentario?: string) {
    return this.prisma.$transaction(async (prisma) => {
      const orden = await prisma.orden.findUnique({
        where: { id: ordenId }
      });

      if (!orden) {
        throw new Error('Orden no encontrada');
      }

      // Actualizar estado
      const ordenActualizada = await prisma.orden.update({
        where: { id: ordenId },
        data: {
          estado: nuevoEstado,
          ...(nuevoEstado === 'CONFIRMADA' && { confirmadaEn: new Date() }),
          ...(nuevoEstado === 'ENVIADA' && { enviadaEn: new Date() }),
          ...(nuevoEstado === 'ENTREGADA' && { entregadaEn: new Date() })
        }
      });

      // Registrar movimiento
      await prisma.ordenMovimiento.create({
        data: {
          ordenId,
          estadoAnterior: orden.estado,
          estadoNuevo: nuevoEstado,
          comentario
        }
      });

      return ordenActualizada;
    });
  }

  async getOrderWithFullDetails(ordenId: string) {
    return this.prisma.orden.findUnique({
      where: { id: ordenId },
      include: {
        usuario: {
          select: { id: true, nombre: true, apellido: true, email: true }
        },
        direccionEnvio: {
          include: {
            ciudad: {
              include: { provincia: true }
            }
          }
        },
        direccionFacturacion: {
          include: {
            ciudad: {
              include: { provincia: true }
            }
          }
        },
        items: {
          include: {
            producto: {
              select: { 
                id: true, 
                nombre: true, 
                slug: true,
                imagenes: { 
                  where: { esPrincipal: true },
                  take: 1 
                }
              }
            },
            variante: {
              select: { nombre: true, atributos: true }
            }
          }
        },
        pagos: {
          orderBy: { creadoEn: 'desc' }
        },
        movimientos: {
          orderBy: { creadoEn: 'asc' }
        }
      }
    });
  }
}
```

---

## 🔍 **MÓDULO 4: CONSULTAS AVANZADAS - EL PODER DE PRISMA**

### **Analogía: Las Consultas como Preguntas Inteligentes**
```
Una consulta básica = "¿Dónde están las llaves?"
Una consulta avanzada = "¿Dónde están las llaves del auto rojo que está en el garage, que fue usado ayer y tiene las ventanas abiertas?"
```

### **1. Agregaciones y Estadísticas**
```typescript
// analytics/analytics.service.ts
@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // Múltiples consultas paralelas para mejor performance
    const [
      totalProductos,
      productosActivos,
      totalOrdenes,
      ordenesHoy,
      ingresosMes,
      topCategorias,
      ventasPorDia
    ] = await Promise.all([
      // Total de productos
      this.prisma.producto.count(),
      
      // Productos activos
      this.prisma.producto.count({
        where: { estado: 'ACTIVO' }
      }),
      
      // Total de órdenes
      this.prisma.orden.count(),
      
      // Órdenes de hoy
      this.prisma.orden.count({
        where: {
          creadoEn: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      
      // Ingresos del mes
      this.prisma.orden.aggregate({
        where: {
          estado: 'ENTREGADA',
          creadoEn: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: {
          total: true
        }
      }),
      
      // Top categorías por ventas
      this.prisma.categoria.findMany({
        include: {
          _count: {
            select: {
              productos: {
                where: {
                  ordenItems: {
                    some: {
                      orden: {
                        estado: 'ENTREGADA'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          productos: {
            _count: 'desc'
          }
        },
        take: 5
      }),
      
      // Ventas por día (últimos 30 días)
      this.prisma.$queryRaw`
        SELECT 
          DATE(o.creado_en) as fecha,
          COUNT(o.id) as ordenes,
          SUM(o.total) as ingresos
        FROM ordenes o 
        WHERE o.estado = 'ENTREGADA'
          AND o.creado_en >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(o.creado_en)
        ORDER BY fecha DESC
      `
    ]);

    return {
      resumen: {
        totalProductos,
        productosActivos,
        totalOrdenes,
        ordenesHoy,
        ingresosMes: ingresosMes._sum.total || 0
      },
      topCategorias: topCategorias.map(cat => ({
        nombre: cat.nombre,
        ventas: cat._count.productos
      })),
      ventasPorDia
    };
  }

  async getProductAnalytics(productoId: string) {
    const [producto, estadisticas, ventasPorMes] = await Promise.all([
      // Datos del producto
      this.prisma.producto.findUnique({
        where: { id: productoId },
        include: {
          categoria: true,
          marca: true,
          vendedor: {
            select: { nombre: true, apellido: true }
          }
        }
      }),
      
      // Estadísticas generales
      this.prisma.ordenItem.aggregate({
        where: { 
          productoId,
          orden: { estado: 'ENTREGADA' }
        },
        _sum: {
          cantidad: true,
          total: true
        },
        _avg: {
          precioUnitario: true
        },
        _count: {
          id: true
        }
      }),
      
      // Ventas por mes
      this.prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', o.creado_en) as mes,
          SUM(oi.cantidad) as unidades_vendidas,
          SUM(oi.total) as ingresos
        FROM orden_items oi
        JOIN ordenes o ON oi.orden_id = o.id
        WHERE oi.producto_id = ${productoId}
          AND o.estado = 'ENTREGADA'
          AND o.creado_en >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', o.creado_en)
        ORDER BY mes DESC
      `
    ]);

    return {
      producto,
      estadisticas: {
        totalVendido: estadisticas._sum.cantidad || 0,
        ingresoTotal: estadisticas._sum.total || 0,
        precioPromedio: estadisticas._avg.precioUnitario || 0,
        numeroOrdenes: estadisticas._count.id || 0
      },
      ventasPorMes
    };
  }

  async getTopProducts(limit: number = 10) {
    return this.prisma.producto.findMany({
      include: {
        categoria: {
          select: { nombre: true }
        },
        marca: {
          select: { nombre: true }
        },
        imagenes: {
          where: { esPrincipal: true },
          take: 1,
          select: { url: true }
        },
        _count: {
          select: {
            ordenItems: {
              where: {
                orden: {
                  estado: 'ENTREGADA'
                }
              }
            }
          }
        },
        ordenItems: {
          where: {
            orden: {
              estado: 'ENTREGADA'
            }
          },
          select: {
            cantidad: true,
            total: true
          }
        }
      },
      orderBy: {
        ordenItems: {
          _count: 'desc'
        }
      },
      take: limit
    });
  }
}
```

### **2. Búsquedas Full-Text y Filtros Complejos**
```typescript
// search/search.service.ts
@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchProducts(query: SearchProductsDto) {
    const { 
      q, // término de búsqueda
      categoria,
      marca,
      precioMin,
      precioMax,
      calificacionMin,
      tags,
      vendedor,
      enStock,
      conOferta,
      ordenarPor,
      pagina = 1,
      limite = 20
    } = query;

    // Construir filtros dinámicamente
    const where: any = {
      estado: 'ACTIVO',
      eliminadoEn: null
    };

    // Búsqueda full-text
    if (q) {
      where.OR = [
        { nombre: { contains: q, mode: 'insensitive' } },
        { descripcion: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
        { 
          categoria: { 
            nombre: { contains: q, mode: 'insensitive' } 
          } 
        },
        { 
          marca: { 
            nombre: { contains: q, mode: 'insensitive' } 
          } 
        }
      ];
    }

    // Filtros específicos
    if (categoria) {
      where.categoria = {
        slug: categoria
      };
    }

    if (marca) {
      where.marca = {
        slug: marca
      };
    }

    if (vendedor) {
      where.vendedor = {
        id: vendedor
      };
    }

    // Filtros de precio
    if (precioMin || precioMax) {
      where.precio = {};
      if (precioMin) where.precio.gte = precioMin;
      if (precioMax) where.precio.lte = precioMax;
    }

    // Solo productos en stock
    if (enStock) {
      where.stock = { gt: 0 };
    }

    // Solo productos con oferta
    if (conOferta) {
      where.precioOferta = { not: null };
    }

    // Filtro por calificación mínima
    if (calificacionMin) {
      where.resenas = {
        some: {
          calificacion: { gte: calificacionMin },
          aprobada: true
        }
      };
    }

    // Filtro por tags
    if (tags && tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            slug: { in: tags }
          }
        }
      };
    }

    // Construir ordenamiento
    const orderBy = this.buildOrderBy(ordenarPor);

    // Ejecutar búsqueda con agregaciones
    const [productos, total] = await Promise.all([
      this.prisma.producto.findMany({
        where,
        include: {
          categoria: {
            select: { nombre: true, slug: true }
          },
          marca: {
            select: { nombre: true, slug: true, logo: true }
          },
          vendedor: {
            select: { id: true, nombre: true, apellido: true }
          },
          imagenes: {
            where: { esPrincipal: true },
            take: 1,
            select: { url: true, alt: true }
          },
          tags: {
            include: {
              tag: {
                select: { nombre: true, color: true, slug: true }
              }
            }
          },
          resenas: {
            where: { aprobada: true },
            select: { calificacion: true }
          },
          _count: {
            select: {
              resenas: {
                where: { aprobada: true }
              },
              ordenItems: {
                where: {
                  orden: { estado: 'ENTREGADA' }
                }
              }
            }
          }
        },
        orderBy,
        take: limite,
        skip: (pagina - 1) * limite
      }),
      
      this.prisma.producto.count({ where })
    ]);

    // Calcular estadísticas adicionales
    const productosConStats = productos.map(producto => {
      const calificaciones = producto.resenas.map(r => r.calificacion);
      const promedioCalificacion = calificaciones.length > 0
        ? calificaciones.reduce((sum, cal) => sum + cal, 0) / calificaciones.length
        : 0;

      return {
        ...producto,
        estadisticas: {
          promedioCalificacion: Math.round(promedioCalificacion * 10) / 10,
          totalResenas: producto._count.resenas,
          totalVentas: producto._count.ordenItems,
          descuento: producto.precioOferta 
            ? Math.round(((Number(producto.precio) - Number(producto.precioOferta)) / Number(producto.precio)) * 100)
            : 0
        }
      };
    });

    return {
      productos: productosConStats,
      paginacion: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
        tieneSiguiente: pagina < Math.ceil(total / limite),
        tieneAnterior: pagina > 1
      }
    };
  }

  private buildOrderBy(ordenarPor?: string) {
    switch (ordenarPor) {
      case 'precio_asc':
        return { precio: 'asc' };
      case 'precio_desc':
        return { precio: 'desc' };
      case 'nombre_asc':
        return { nombre: 'asc' };
      case 'nombre_desc':
        return { nombre: 'desc' };
      case 'fecha_asc':
        return { creadoEn: 'asc' };
      case 'fecha_desc':
        return { creadoEn: 'desc' };
      case 'popular':
        return { ordenItems: { _count: 'desc' } };
      case 'mejor_calificado':
        return { resenas: { _count: 'desc' } };
      default:
        return { creadoEn: 'desc' };
    }
  }

  async getSuggestions(query: string, limit: number = 5) {
    if (!query || query.length < 2) return [];

    const [productos, categorias, marcas] = await Promise.all([
      // Sugerencias de productos
      this.prisma.producto.findMany({
        where: {
          nombre: {
            contains: query,
            mode: 'insensitive'
          },
          estado: 'ACTIVO'
        },
        select: {
          id: true,
          nombre: true,
          slug: true,
          precio: true,
          imagenes: {
            where: { esPrincipal: true },
            take: 1,
            select: { url: true }
          }
        },
        take: limit
      }),

      // Sugerencias de categorías
      this.prisma.categoria.findMany({
        where: {
          nombre: {
            contains: query,
            mode: 'insensitive'
          },
          activa: true
        },
        select: {
          nombre: true,
          slug: true,
          imagen: true
        },
        take: 3
      }),

      // Sugerencias de marcas
      this.prisma.marca.findMany({
        where: {
          nombre: {
            contains: query,
            mode: 'insensitive'
          },
          activa: true
        },
        select: {
          nombre: true,
          slug: true,
          logo: true
        },
        take: 3
      })
    ]);

    return {
      productos,
      categorias,
      marcas
    };
  }
}
```

### **3. Optimización de Consultas**
```typescript
// Servicio optimizado para homepage
@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getHomeData() {
    // Una sola consulta optimizada para toda la homepage
    const [
      productosDestacados,
      categoriasPopulares,
      marcasDestacadas,
      productosEnOferta,
      ultimosProductos
    ] = await Promise.all([
      // Productos destacados con mínima información
      this.prisma.producto.findMany({
        where: {
          destacado: true,
          estado: 'ACTIVO',
          stock: { gt: 0 }
        },
        select: {
          id: true,
          nombre: true,
          slug: true,
          precio: true,
          precioOferta: true,
          imagenes: {
            where: { esPrincipal: true },
            take: 1,
            select: { url: true, alt: true }
          },
          resenas: {
            where: { aprobada: true },
            select: { calificacion: true },
            take: 10 // Solo para calcular promedio
          }
        },
        take: 8,
        orderBy: { creadoEn: 'desc' }
      }),

      // Categorías con más productos
      this.prisma.categoria.findMany({
        where: { 
          activa: true,
          parentId: null // Solo categorías principales
        },
        select: {
          id: true,
          nombre: true,
          slug: true,
          imagen: true,
          _count: {
            select: {
              productos: {
                where: { estado: 'ACTIVO' }
              }
            }
          }
        },
        orderBy: {
          productos: {
            _count: 'desc'
          }
        },
        take: 6
      }),

      // Marcas destacadas
      this.prisma.marca.findMany({
        where: { activa: true },
        select: {
          id: true,
          nombre: true,
          slug: true,
          logo: true
        },
        take: 12,
        orderBy: { nombre: 'asc' }
      }),

      // Productos en oferta
      this.prisma.producto.findMany({
        where: {
          precioOferta: { not: null },
          estado: 'ACTIVO',
          stock: { gt: 0 }
        },
        select: {
          id: true,
          nombre: true,
          slug: true,
          precio: true,
          precioOferta: true,
          imagenes: {
            where: { esPrincipal: true },
            take: 1,
            select: { url: true, alt: true }
          }
        },
        take: 6,
        orderBy: { creadoEn: 'desc' }
      }),

      // Últimos productos
      this.prisma.producto.findMany({
        where: {
          estado: 'ACTIVO',
          stock: { gt: 0 }
        },
        select: {
          id: true,
          nombre: true,
          slug: true,
          precio: true,
          precioOferta: true,
          imagenes: {
            where: { esPrincipal: true },
            take: 1,
            select: { url: true, alt: true }
          }
        },
        take: 8,
        orderBy: { publicadoEn: 'desc' }
      })
    ]);

    return {
      productosDestacados: productosDestacados.map(this.addProductStats),
      categoriasPopulares,
      marcasDestacadas,
      productosEnOferta: productosEnOferta.map(this.addDiscountPercentage),
      ultimosProductos: ultimosProductos.map(this.addProductStats)
    };
  }

  private addProductStats(producto: any) {
    const calificaciones = producto.resenas?.map(r => r.calificacion) || [];
    const promedioCalificacion = calificaciones.length > 0
      ? calificaciones.reduce((sum, cal) => sum + cal, 0) / calificaciones.length
      : 0;

    return {
      ...producto,
      promedioCalificacion: Math.round(promedioCalificacion * 10) / 10,
      descuento: this.calculateDiscount(producto.precio, producto.precioOferta)
    };
  }

  private addDiscountPercentage(producto: any) {
    return {
      ...producto,
      descuento: this.calculateDiscount(producto.precio, producto.precioOferta)
    };
  }

  private calculateDiscount(precio: number, precioOferta?: number): number {
    if (!precioOferta) return 0;
    return Math.round(((precio - precioOferta) / precio) * 100);
  }
}
```

---

## 🏗️ **MÓDULO 5: INTEGRACIÓN CON NESTJS - ARQUITECTURA EMPRESARIAL**

### **1. Configuración del Módulo Prisma**
```typescript
// prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Hace que esté disponible en toda la app
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

// prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'], // Para debugging
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    await this.$connect();
    
    // Middleware para logging en desarrollo
    if (process.env.NODE_ENV === 'development') {
      this.$use(async (params, next) => {
        const before = Date.now();
        const result = await next(params);
        const after = Date.now();
        
        console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
        return result;
      });
    }

    // Middleware para soft deletes automático
    this.$use(async (params, next) => {
      // Interceptar operaciones de eliminación
      if (params.action === 'delete') {
        params.action = 'update';
        params.args['data'] = { eliminadoEn: new Date() };
      }
      
      if (params.action === 'deleteMany') {
        params.action = 'updateMany';
        if (params.args.data != undefined) {
          params.args.data['eliminadoEn'] = new Date();
        } else {
          params.args['data'] = { eliminadoEn: new Date() };
        }
      }

      return next(params);
    });

    // Middleware para filtrar soft deletes en consultas
    this.$use(async (params, next) => {
      if (params.action === 'findUnique' || params.action === 'findFirst') {
        params.args.where['eliminadoEn'] = null;
      }
      if (params.action === 'findMany') {
        if (params.args.where) {
          if (params.args.where.eliminadoEn === undefined) {
            params.args.where['eliminadoEn'] = null;
          }
        } else {
          params.args['where'] = { eliminadoEn: null };
        }
      }
      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Método helper para transacciones
  async transaction<T>(fn: (prisma: PrismaService) => Promise<T>): Promise<T> {
    return this.$transaction(fn);
  }

  // Método helper para eliminación real
  async hardDelete(model: string, where: any) {
    return this[model].delete({ where });
  }

  // Método helper para incluir eliminados
  async findWithDeleted(model: string, args: any) {
    return this[model].findMany({
      ...args,
      where: {
        ...args.where,
        eliminadoEn: undefined // Remover filtro de soft delete
      }
    });
  }
}
```

### **2. DTOs y Validación**
```typescript
// dtos/create-product.dto.ts
import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsEnum, 
  IsArray, 
  ValidateNested, 
  Min, 
  Max,
  IsUUID,
  Length,
  IsDecimal,
  IsBoolean
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { EstadoProducto } from '@prisma/client';

export class CreateProductImageDto {
  @IsString()
  @Length(1, 500)
  url: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  alt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  orden?: number;

  @IsOptional()
  @IsBoolean()
  esPrincipal?: boolean;
}

export class CreateProductDto {
  @IsString()
  @Length(3, 200)
  nombre: string;

  @IsString()
  @Length(10, 2000)
  descripcion: string;

  @IsOptional()
  @IsString()
  @Length(10, 500)
  descripcionCorta?: string;

  @IsString()
  @Length(3, 50)
  sku: string;

  @IsOptional()
  @IsString()
  codigoBarras?: string;

  @IsDecimal({ decimal_digits: '0,2' })
  @Transform(({ value }) => parseFloat(value))
  precio: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  precioOferta?: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockMinimo?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  peso?: number;

  @IsOptional()
  @Type(() => Object)
  dimensiones?: {
    largo: number;
    ancho: number;
    alto: number;
  };

  @IsUUID()
  categoriaId: string;

  @IsOptional()
  @IsUUID()
  marcaId?: string;

  @IsOptional()
  @IsEnum(EstadoProducto)
  estado?: EstadoProducto;

  @IsOptional()
  @IsBoolean()
  destacado?: boolean;

  @IsOptional()
  @IsBoolean()
  envioGratis?: boolean;

  @IsOptional()
  @IsString()
  @Length(10, 100)
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @Length(10, 300)
  metaDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  imagenes?: CreateProductImageDto[];
}

// dtos/search-products.dto.ts
import { IsOptional, IsString, IsNumber, IsArray, IsEnum, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum SortBy {
  FECHA_DESC = 'fecha_desc',
  FECHA_ASC = 'fecha_asc',
  PRECIO_ASC = 'precio_asc',
  PRECIO_DESC = 'precio_desc',
  NOMBRE_ASC = 'nombre_asc',
  NOMBRE_DESC = 'nombre_desc',
  POPULAR = 'popular',
  MEJOR_CALIFICADO = 'mejor_calificado'
}

export class SearchProductsDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  q?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  precioMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  precioMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => parseInt(value))
  calificacionMin?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  vendedor?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  enStock?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  conOferta?: boolean;

  @IsOptional()
  @IsEnum(SortBy)
  ordenarPor?: SortBy;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  limite?: number = 20;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  pagina?: number = 1;
}
```

### **3. Controllers con Documentación Swagger**
```typescript
// products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../auth/get-user.decorator';
import { Usuario } from '@prisma/client';

@ApiTags('Productos')
@Controller('productos')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Crear nuevo producto',
    description: 'Permite a un vendedor crear un nuevo producto en su catálogo'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Producto creado exitosamente' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Token de autorización requerido' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'No tienes permisos para crear productos' 
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: Usuario
  ) {
    return this.productsService.create(createProductDto, user.id);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Buscar productos',
    description: 'Busca productos con filtros avanzados y paginación'
  })
  @ApiQuery({ name: 'q', required: false, description: 'Término de búsqueda' })
  @ApiQuery({ name: 'categoria', required: false, description: 'Slug de la categoría' })
  @ApiQuery({ name: 'marca', required: false, description: 'Slug de la marca' })
  @ApiQuery({ name: 'precioMin', required: false, description: 'Precio mínimo' })
  @ApiQuery({ name: 'precioMax', required: false, description: 'Precio máximo' })
  @ApiQuery({ name: 'ordenarPor', required: false, enum: SortBy })
  @ApiQuery({ name: 'pagina', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limite', required: false, description: 'Productos por página' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de productos con paginación' 
  })
  async findAll(@Query() searchDto: SearchProductsDto) {
    return this.productsService.search(searchDto);
  }

  @Get('destacados')
  @ApiOperation({ 
    summary: 'Obtener productos destacados',
    description: 'Retorna una lista de productos marcados como destacados'
  })
  @ApiQuery({ name: 'limite', required: false, description: 'Número de productos' })
  async getFeatured(@Query('limite') limite?: number) {
    return this.productsService.getFeatured(limite);
  }

  @Get('categoria/:slug')
  @ApiOperation({ 
    summary: 'Productos por categoría',
    description: 'Obtiene productos filtrados por categoría'
  })
  @ApiParam({ name: 'slug', description: 'Slug de la categoría' })
  async getByCategory(
    @Param('slug') slug: string,
    @Query() filters: SearchProductsDto
  ) {
    return this.productsService.getByCategory(slug, filters);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener producto por ID',
    description: 'Retorna los detalles completos de un producto'
  })
  @ApiParam({ name: 'id', description: 'ID único del producto' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Detalles del producto' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Producto no encontrado' 
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Actualizar producto',
    description: 'Permite actualizar un producto existente'
  })
  @ApiParam({ name: 'id', description: 'ID del producto a actualizar' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: Usuario
  ) {
    return this.productsService.update(id, updateProductDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('VENDEDOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Eliminar producto',
    description: 'Realiza eliminación suave del producto'
  })
  @ApiParam({ name: 'id', description: 'ID del producto a eliminar' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: Usuario
  ) {
    return this.productsService.remove(id, user.id);
  }

  @Get(':id/relacionados')
  @ApiOperation({ 
    summary: 'Productos relacionados',
    description: 'Obtiene productos relacionados basados en categoría y tags'
  })
  @ApiParam({ name: 'id', description: 'ID del producto base' })
  async getRelated(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getRelated(id);
  }

  @Post(':id/calificar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Calificar producto',
    description: 'Permite al usuario calificar un producto que ha comprado'
  })
  async rate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() rateDto: RateProductDto,
    @GetUser() user: Usuario
  ) {
    return this.productsService.rate(id, rateDto, user.id);
  }
}
```

### **4. Guards y Middlewares**
```typescript
// auth/jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Token de acceso inválido');
    }
    return user;
  }
}

// auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TipoUsuario } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<TipoUsuario[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    const hasRole = requiredRoles.some((role) => user.tipo === role);
    
    if (!hasRole) {
      throw new ForbiddenException(
        `Se requiere uno de los siguientes roles: ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }
}

// auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';

export const Roles = (...roles: TipoUsuario[]) => SetMetadata('roles', roles);
```

---

## 📊 **MÓDULO 6: CONSIDERACIONES PARA PRODUCCIÓN**

### **1. Indexación y Performance**
```sql
-- Índices críticos para performance
-- En el archivo schema.prisma ya están definidos, pero aquí el SQL equivalente:

-- Productos - índices compuestos para búsquedas frecuentes
CREATE INDEX CONCURRENTLY idx_productos_categoria_estado_publicado 
ON productos (categoria_id, estado, publicado_en);

CREATE INDEX CONCURRENTLY idx_productos_vendedor_estado 
ON productos (vendedor_id, estado);

CREATE INDEX CONCURRENTLY idx_productos_precio_estado 
ON productos (precio, estado);

-- Full-text search para productos
CREATE INDEX CONCURRENTLY idx_productos_busqueda 
ON productos USING GIN (to_tsvector('spanish', nombre || ' ' || descripcion));

-- Órdenes - para consultas de histórico y reportes
CREATE INDEX CONCURRENTLY idx_ordenes_usuario_estado_fecha 
ON ordenes (usuario_id, estado, creado_en);

CREATE INDEX CONCURRENTLY idx_ordenes_fecha_estado 
ON ordenes (creado_en, estado);

-- Items de orden - para reportes de productos
CREATE INDEX CONCURRENTLY idx_orden_items_producto_fecha 
ON orden_items (producto_id, (SELECT creado_en FROM ordenes WHERE id = orden_id));

-- Direcciones - para autocompletado
CREATE INDEX CONCURRENTLY idx_direcciones_usuario_principal 
ON direcciones (usuario_id, es_principal);

-- Carritos - para limpieza automática
CREATE INDEX CONCURRENTLY idx_carritos_expiracion 
ON carritos (expira_en) WHERE expira_en IS NOT NULL;
```

### **2. Configuración de Conexiones**
```typescript
// prisma/prisma.service.ts - Configuración para producción
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    const isProduction = configService.get<string>('NODE_ENV') === 'production';

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
      log: isProduction 
        ? ['error', 'warn'] 
        : ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
      
      // Configuración de pool de conexiones para producción
      connectionLimit: isProduction ? 20 : 5,
      poolTimeout: 30,
      transactionOptions: {
        maxWait: 5000, // 5 segundos máximo esperando una transacción
        timeout: 10000, // 10 segundos timeout para transacciones
      },
    });

    // Configurar eventos de conexión
    this.$on('query', (e) => {
      if (!isProduction && e.duration > 1000) {
        this.logger.warn(`Slow query detected: ${e.duration}ms - ${e.query}`);
      }
    });

    this.$on('error', (e) => {
      this.logger.error('Database error:', e);
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');

      // Verificar salud de la base de datos
      await this.healthCheck();
      
      // Solo en desarrollo
      if (this.configService.get('NODE_ENV') === 'development') {
        this.setupDevelopmentMiddleware();
      }

      // Configurar limpieza automática
      this.setupCleanupTasks();
      
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  private async healthCheck() {
    try {
      await this.$queryRaw`SELECT 1`;
      this.logger.log('Database health check passed');
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      throw error;
    }
  }

  private setupDevelopmentMiddleware() {
    // Middleware para logging de queries lentas
    this.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      
      const duration = after - before;
      if (duration > 100) { // Log queries > 100ms
        this.logger.warn(
          `Slow query: ${params.model}.${params.action} took ${duration}ms`
        );
      }
      
      return result;
    });
  }

  private setupCleanupTasks() {
    // Limpiar carritos expirados cada hora
    setInterval(async () => {
      try {
        const result = await this.carrito.deleteMany({
          where: {
            expiraEn: {
              lt: new Date()
            }
          }
        });
        
        if (result.count > 0) {
          this.logger.log(`Cleaned up ${result.count} expired carts`);
        }
      } catch (error) {
        this.logger.error('Failed to cleanup expired carts:', error);
      }
    }, 60 * 60 * 1000); // 1 hora

    // Limpiar sesiones expiradas cada 6 horas
    setInterval(async () => {
      try {
        // Implementar limpieza de sesiones si es necesario
        this.logger.log('Session cleanup completed');
      } catch (error) {
        this.logger.error('Failed to cleanup sessions:', error);
      }
    }, 6 * 60 * 60 * 1000); // 6 horas
  }

  // Método para estadísticas de performance
  async getPerformanceStats() {
    const stats = await this.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        attname,
        n_distinct,
        correlation
      FROM pg_stats 
      WHERE schemaname = 'public'
      ORDER BY tablename, attname;
    `;

    return stats;
  }

  // Método para obtener queries lentas
  async getSlowQueries() {
    const slowQueries = await this.$queryRaw`
      SELECT 
        query,
        mean_exec_time,
        calls,
        total_exec_time
      FROM pg_stat_statements 
      WHERE mean_exec_time > 100
      ORDER BY mean_exec_time DESC
      LIMIT 10;
    `;

    return slowQueries;
  }
}
```

### **3. Migraciones para Producción**
```bash
# Estrategia de deploy de migraciones
# deploy.sh

#!/bin/bash

echo "🚀 Iniciando deploy a producción..."

# 1. Backup de base de datos
echo "📦 Creando backup de base de datos..."
pg_dump $DATABASE_URL > "backup_$(date +%Y%m%d_%H%M%S).sql"

# 2. Ejecutar migraciones
echo "🔄 Ejecutando migraciones..."
npx prisma migrate deploy

# 3. Generar cliente Prisma
echo "⚙️ Generando cliente Prisma..."
npx prisma generate

# 4. Ejecutar seeders solo si es necesario
if [ "$RUN_SEEDERS" = "true" ]; then
  echo "🌱 Ejecutando seeders..."
  npx prisma db seed
fi

# 5. Verificar migración
echo "✅ Verificando migraciones..."
npx prisma migrate status

echo "🎉 Deploy completado exitosamente!"
```

### **4. Monitoring y Observabilidad**
```typescript
// monitoring/database.monitor.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseMonitorService {
  private readonly logger = new Logger(DatabaseMonitorService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  // Verificar salud de la base de datos cada 5 minutos
  @Cron(CronExpression.EVERY_5_MINUTES)
  async healthCheck() {
    try {
      const start = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const duration = Date.now() - start;

      if (duration > 1000) {
        this.logger.warn(`Database response time is slow: ${duration}ms`);
      }

      // Verificar conexiones activas
      const connections = await this.prisma.$queryRaw`
        SELECT count(*) as active_connections 
        FROM pg_stat_activity 
        WHERE state = 'active';
      `;

      const activeConnections = Number(connections[0]?.active_connections);
      if (activeConnections > 15) {
        this.logger.warn(`High number of active connections: ${activeConnections}`);
      }

    } catch (error) {
      this.logger.error('Database health check failed:', error);
      // Aquí podrías enviar una alerta (Slack, email, etc.)
      await this.sendAlert('Database health check failed', error);
    }
  }

  // Monitorear tamaño de tablas cada día
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async monitorTableSizes() {
    try {
      const tableSizes = await this.prisma.$queryRaw`
        SELECT 
          schemaname,
          tablename,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
          pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
      `;

      this.logger.log('Table sizes:', tableSizes);

      // Alertar si alguna tabla es muy grande
      const largeTables = tableSizes.filter(table => table.size_bytes > 1000000000); // > 1GB
      if (largeTables.length > 0) {
        this.logger.warn('Large tables detected:', largeTables);
      }

    } catch (error) {
      this.logger.error('Failed to monitor table sizes:', error);
    }
  }

  // Limpiar datos antiguos cada semana
  @Cron(CronExpression.EVERY_WEEK)
  async cleanupOldData() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Limpiar carritos expirados
      const deletedCarts = await this.prisma.carrito.deleteMany({
        where: {
          expiraEn: {
            lt: new Date()
          }
        }
      });

      // Limpiar logs antiguos si los hay
      const deletedLogs = await this.prisma.ordenMovimiento.deleteMany({
        where: {
          creadoEn: {
            lt: thirtyDaysAgo
          }
        }
      });

      this.logger.log(`Cleanup completed: ${deletedCarts.count} carts, ${deletedLogs.count} logs`);

    } catch (error) {
      this.logger.error('Failed to cleanup old data:', error);
    }
  }

  // Estadísticas de performance
  async getPerformanceMetrics() {
    try {
      const metrics = await this.prisma.$queryRaw`
        SELECT 
          datname as database,
          numbackends as connections,
          xact_commit as transactions_committed,
          xact_rollback as transactions_rolled_back,
          blks_read as blocks_read,
          blks_hit as blocks_hit,
          tup_returned as tuples_returned,
          tup_fetched as tuples_fetched,
          tup_inserted as tuples_inserted,
          tup_updated as tuples_updated,
          tup_deleted as tuples_deleted
        FROM pg_stat_database 
        WHERE datname = current_database();
      `;

      return metrics[0];
    } catch (error) {
      this.logger.error('Failed to get performance metrics:', error);
      return null;
    }
  }

  private async sendAlert(message: string, error: any) {
    // Implementar sistema de alertas (Slack, Discord, email, etc.)
    // Por ahora solo loggeamos
    this.logger.error(`ALERT: ${message}`, error);
  }
}
```

---

## 🎯 **MÓDULO 7: TESTING - ASEGURANDO LA CALIDAD**

### **1. Testing de Servicios con Prisma**
```typescript
// products/products.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoProducto } from '@prisma/client';

// Mock de PrismaService
const mockPrismaService = {
  producto: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  categoria: {
    findUnique: jest.fn(),
  },
  marca: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      // Arrange
      const createProductDto = {
        nombre: 'Test Product',
        descripcion: 'Test Description',
        precio: 100,
        stock: 10,
        sku: 'TEST-001',
        categoriaId: 'cat-1',
        marcaId: 'marca-1',
      };

      const vendedorId = 'user-1';

      const expectedProduct = {
        id: 'prod-1',
        ...createProductDto,
        vendedorId,
        estado: EstadoProducto.BORRADOR,
        creadoEn: new Date(),
      };

      mockPrismaService.categoria.findUnique.mockResolvedValue({
        id: 'cat-1',
        nombre: 'Test Category',
      });

      mockPrismaService.marca.findUnique.mockResolvedValue({
        id: 'marca-1',
        nombre: 'Test Brand',
      });

      mockPrismaService.producto.create.mockResolvedValue(expectedProduct);

      // Act
      const result = await service.create(createProductDto, vendedorId);

      // Assert
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.categoria.findUnique).toHaveBeenCalledWith({
        where: { id: 'cat-1' }
      });
      expect(mockPrismaService.producto.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          nombre: 'Test Product',
          vendedorId: 'user-1',
        }),
        include: expect.any(Object)
      });
    });

    it('should throw error if category not found', async () => {
      // Arrange
      const createProductDto = {
        nombre: 'Test Product',
        categoriaId: 'invalid-cat',
        // ... otros campos
      };

      mockPrismaService.categoria.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createProductDto, 'user-1'))
        .rejects
        .toThrow('Categoría no encontrada');
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const createProductDto = {
        nombre: 'Test Product',
        categoriaId: 'cat-1',
        // ... otros campos
      };

      mockPrismaService.categoria.findUnique.mockResolvedValue({ id: 'cat-1' });
      mockPrismaService.producto.create.mockRejectedValue(
        new Error('Database connection failed')
      );

      // Act & Assert
      await expect(service.create(createProductDto, 'user-1'))
        .rejects
        .toThrow('Database connection failed');
    });
  });

  describe('search', () => {
    it('should return paginated products', async () => {
      // Arrange
      const searchDto = {
        q: 'laptop',
        pagina: 1,
        limite: 10
      };

      const mockProducts = [
        { id: '1', nombre: 'Laptop HP', precio: 50000 },
        { id: '2', nombre: 'Laptop Dell', precio: 60000 }
      ];

      mockPrismaService.producto.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.producto.count.mockResolvedValue(25);

      // Act
      const result = await service.search(searchDto);

      // Assert
      expect(result.productos).toEqual(mockProducts);
      expect(result.paginacion.total).toBe(25);
      expect(result.paginacion.totalPaginas).toBe(3);
      expect(mockPrismaService.producto.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            { nombre: { contains: 'laptop', mode: 'insensitive' } }
          ])
        }),
        include: expect.any(Object),
        take: 10,
        skip: 0
      });
    });
  });
});
```

### **2. Testing de Controladores**
```typescript
// products/products.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { TipoUsuario } from '@prisma/client';

const mockProductsService = {
  create: jest.fn(),
  search: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  getFeatured: jest.fn(),
  getByCategory: jest.fn(),
  getRelated: jest.fn(),
};

const mockUser = {
  id: 'user-1',
  email: 'test@test.com',
  tipo: TipoUsuario.VENDEDOR,
};

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  describe('create', () => {
    it('should create a product', async () => {
      // Arrange
      const createProductDto = {
        nombre: 'Test Product',
        descripcion: 'Test Description',
        precio: 100,
        stock: 10,
        sku: 'TEST-001',
        categoriaId: 'cat-1',
      };

      const expectedResult = { id: 'prod-1', ...createProductDto };
      mockProductsService.create.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.create(createProductDto, mockUser);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createProductDto, 'user-1');
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      // Arrange
      const searchDto = { q: 'test', pagina: 1, limite: 10 };
      const expectedResult = {
        productos: [],
        paginacion: { total: 0, pagina: 1, limite: 10, totalPaginas: 0 }
      };

      mockProductsService.search.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findAll(searchDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(service.search).toHaveBeenCalledWith(searchDto);
    });
  });
});
```

### **3. Testing de Integración**
```typescript
// test/products.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    
    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);
    
    await app.init();

    // Configurar base de datos de test
    await prisma.$executeRaw`TRUNCATE TABLE "productos", "usuarios", "categorias" CASCADE`;
    
    // Crear usuario de test
    const testUser = await prisma.usuario.create({
      data: {
        email: 'test@test.com',
        password: 'hashedpassword',
        nombre: 'Test',
        apellido: 'User',
        tipo: 'VENDEDOR',
        emailVerificado: true,
      }
    });

    // Generar token de autenticación
    authToken = jwtService.sign({ sub: testUser.id, email: testUser.email });

    // Crear categoría de test
    await prisma.categoria.create({
      data: {
        id: 'test-category-id',
        nombre: 'Electronics',
        slug: 'electronics',
        activa: true,
      }
    });
  });

  afterAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "productos", "usuarios", "categorias" CASCADE`;
    await app.close();
  });

  describe('/productos (POST)', () => {
    it('should create a product with valid data', () => {
      return request(app.getHttpServer())
        .post('/productos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'Test Product',
          descripcion: 'A test product description',
          precio: 199.99,
          stock: 50,
          sku: 'TEST-SKU-001',
          categoriaId: 'test-category-id',
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.nombre).toBe('Test Product');
          expect(res.body.precio).toBe('199.99');
        });
    });

    it('should return 400 for invalid data', () => {
      return request(app.getHttpServer())
        .post('/productos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'T', // Muy corto
          precio: -10, // Precio negativo
        })
        .expect(400);
    });

    it('should return 401 without auth token', () => {
      return request(app.getHttpServer())
        .post('/productos')
        .send({
          nombre: 'Test Product',
          descripcion: 'Test',
          precio: 100,
        })
        .expect(401);
    });
  });

  describe('/productos (GET)', () => {
    beforeEach(async () => {
      // Crear productos de test
      await prisma.producto.createMany({
        data: [
          {
            nombre: 'Laptop HP',
            slug: 'laptop-hp',
            descripcion: 'High performance laptop',
            precio: 899.99,
            stock: 10,
            sku: 'HP-LAPTOP-001',
            categoriaId: 'test-category-id',
            vendedorId: 'test-user-id',
            estado: 'ACTIVO',
          },
          {
            nombre: 'Mouse Logitech',
            slug: 'mouse-logitech',
            descripcion: 'Wireless mouse',
            precio: 29.99,
            stock: 50,
            sku: 'LOGI-MOUSE-001',
            categoriaId: 'test-category-id',
            vendedorId: 'test-user-id',
            estado: 'ACTIVO',
          }
        ]
      });
    });

    it('should return paginated products', () => {
      return request(app.getHttpServer())
        .get('/productos')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('productos');
          expect(res.body).toHaveProperty('paginacion');
          expect(Array.isArray(res.body.productos)).toBe(true);
          expect(res.body.paginacion.total).toBeGreaterThan(0);
        });
    });

    it('should filter products by search query', () => {
      return request(app.getHttpServer())
        .get('/productos?q=laptop')
        .expect(200)
        .expect(res => {
          expect(res.body.productos.length).toBeGreaterThan(0);
          expect(res.body.productos[0].nombre.toLowerCase()).toContain('laptop');
        });
    });

    it('should filter products by price range', () => {
      return request(app.getHttpServer())
        .get('/productos?precioMin=20&precioMax=50')
        .expect(200)
        .expect(res => {
          res.body.productos.forEach(product => {
            expect(parseFloat(product.precio)).toBeGreaterThanOrEqual(20);
            expect(parseFloat(product.precio)).toBeLessThanOrEqual(50);
          });
        });
    });
  });
});
```

### **4. Database Testing Utilities**
```typescript
// test/utils/database.helper.ts
import { PrismaService } from '../../src/prisma/prisma.service';

export class DatabaseTestHelper {
  constructor(private prisma: PrismaService) {}

  async cleanDatabase() {
    // Orden importante debido a foreign keys
    const models = [
      'ordenMovimiento',
      'pago',
      'ordenItem',
      'orden',
      'carritoItem',
      'carrito',
      'resena',
      'productoTag',
      'tag',
      'productoImagen',
      'productoVariante',
      'producto',
      'direccion',
      'perfil',
      'usuario',
      'ciudad',
      'provincia',
      'marca',
      'categoria',
    ];

    for (const model of models) {
      await this.prisma[model].deleteMany();
    }
  }

  async seedBasicData() {
    // Crear datos básicos para tests
    const provincia = await this.prisma.provincia.create({
      data: {
        nombre: 'Santa Fe',
        codigo: 'SF',
        region: 'Centro',
      }
    });

    const ciudad = await this.prisma.ciudad.create({
      data: {
        nombre: 'Rosario',
        codigoPostal: '2000',
        provinciaId: provincia.id,
      }
    });

    const categoria = await this.prisma.categoria.create({
      data: {
        nombre: 'Electronics',
        slug: 'electronics',
        activa: true,
      }
    });

    const marca = await this.prisma.marca.create({
      data: {
        nombre: 'Test Brand',
        slug: 'test-brand',
        activa: true,
      }
    });

    const usuario = await this.prisma.usuario.create({
      data: {
        email: 'test@test.com',
        password: 'hashedpassword',
        nombre: 'Test',
        apellido: 'User',
        tipo: 'VENDEDOR',
        emailVerificado: true,
      }
    });

    return {
      provincia,
      ciudad,
      categoria,
      marca,
      usuario,
    };
  }

  async createTestProduct(vendedorId: string, categoriaId: string, overrides = {}) {
    return this.prisma.producto.create({
      data: {
        nombre: 'Test Product',
        slug: 'test-product',
        descripcion: 'Test product description',
        precio: 100,
        stock: 10,
        sku: `TEST-${Date.now()}`,
        categoriaId,
        vendedorId,
        estado: 'ACTIVO',
        ...overrides,
      }
    });
  }

  async createTestOrder(usuarioId: string, direccionId: string) {
    return this.prisma.orden.create({
      data: {
        numero: `ORD-${Date.now()}`,
        usuarioId,
        direccionEnvioId: direccionId,
        subtotal: 100,
        impuestos: 21,
        total: 121,
        estado: 'PENDIENTE',
      }
    });
  }
}

// test/setup.ts
import { PrismaService } from '../src/prisma/prisma.service';
import { DatabaseTestHelper } from './utils/database.helper';

export async function setupTestDatabase() {
  const prisma = new PrismaService();
  await prisma.$connect();
  
  const dbHelper = new DatabaseTestHelper(prisma);
  await dbHelper.cleanDatabase();
  
  return { prisma, dbHelper };
}

export async function teardownTestDatabase(prisma: PrismaService) {
  await prisma.$disconnect();
}
```

---

## 🚀 **MÓDULO 8: DEPLOYMENT Y DEVOPS**

### **1. Configuración para Producción**
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - app-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

### **2. Dockerfile Optimizado**
```dockerfile
# Dockerfile.prod
# Multi-stage build para optimizar tamaño de imagen

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Build de la aplicación
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app

# Copiar node_modules del stage builder
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --chown=nestjs:nodejs package*.json ./

# Instalar dumb-init para manejo correcto de señales
RUN apk add --no-cache dumb-init

# Cambiar a usuario no-root
USER nestjs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node ./dist/health-check.js

# Exponer puerto
EXPOSE 3000

# Comando de inicio
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]
```

### **3. CI/CD Pipeline**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test'

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_USER: test
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: npx prisma generate

      - name: Run database migrations
        run: npx prisma migrate deploy

      - name: Run tests
        run: npm run test

      - name: Run e2e tests
        run: npm run test:e2e

      - name: Build application
        run: npm run build

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ secrets.REGISTRY_URL }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile.prod
          push: true
          tags: ${{ secrets.REGISTRY_URL }}/ecommerce-api:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy to production
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/ecommerce
            docker-compose pull
            docker-compose down
            docker-compose up -d
            docker image prune -f
```

### **4. Configuración de Nginx**
```nginx
# nginx/nginx.conf
upstream api {
    server app:3000;
}

server {
    listen 80;
    server_name tu-dominio.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    # API routes
    location /api {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check
    location /health {
        proxy_pass http://api/health;
        access_log off;
    }

    # Static files (si los hay)
    location /static {
        root /var/www;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### **5. Monitoreo y Logging**
```typescript
// monitoring/logging.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

@Injectable()
export class LoggingService {
  private logger: winston.Logger;

  constructor(private configService: ConfigService) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    this.logger = winston.createLogger({
      level: isProduction ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { 
        service: 'ecommerce-api',
        version: process.env.npm_package_version 
      },
      transports: [
        new winston.transports.File({ 
          filename: 'logs/error.log', 
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        new winston.transports.File({ 
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    });

    if (!isProduction) {
      this.logger.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }));
    }
  }

  log(message: string, context?: string, meta?: any) {
    this.logger.info(message, { context, ...meta });
  }

  error(message: string, trace?: string, context?: string, meta?: any) {
    this.logger.error(message, { trace, context, ...meta });
  }

  warn(message: string, context?: string, meta?: any) {
    this.logger.warn(message, { context, ...meta });
  }

  debug(message: string, context?: string, meta?: any) {
    this.logger.debug(message, { context, ...meta });
  }

  // Métricas específicas del negocio
  logBusinessEvent(event: string, data: any) {
    this.logger.info('Business Event', {
      event,
      data,
      timestamp: new Date().toISOString()
    });
  }

  logPerformance(operation: string, duration: number, metadata?: any) {
    this.logger.info('Performance Metric', {
      operation,
      duration,
      metadata,
      timestamp: new Date().toISOString()
    });
  }
}

// Interceptor para logging de requests
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.loggingService.logPerformance(
          `${method} ${url}`,
          duration,
          {
            userId: user?.id,
            userAgent: request.get('User-Agent'),
            ip: request.ip
          }
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.loggingService.error(
          `${method} ${url} failed`,
          error.stack,
          'HTTP',
          {
            userId: user?.id,
            duration,
            body: body,
            error: error.message
          }
        );
        throw error;
      })
    );
  }
}
```

---

## 🎭 **MÓDULO 9: PATRONES AVANZADOS Y BEST PRACTICES**

### **1. Repository Pattern con Prisma**
```typescript
// repositories/base.repository.ts
export abstract class BaseRepository<T, CreateDto, UpdateDto> {
  constructor(protected prisma: PrismaService, protected model: string) {}

  abstract create(data: CreateDto): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
  abstract findMany(filters?: any): Promise<T[]>;
  abstract update(id: string, data: UpdateDto): Promise<T>;
  abstract delete(id: string): Promise<T>;

  protected buildWhereClause(filters: any) {
    const where: any = {};
    
    // Filtros comunes
    if (filters.search) {
      where.OR = this.buildSearchClause(filters.search);
    }
    
    if (filters.createdAfter) {
      where.creadoEn = { gte: filters.createdAfter };
    }
    
    if (filters.createdBefore) {
      where.creadoEn = { lte: filters.createdBefore };
    }
    
    return where;
  }

  protected abstract buildSearchClause(search: string): any[];

  protected buildOrderBy(orderBy?: string) {
    switch (orderBy) {
      case 'name_asc': return { nombre: 'asc' };
      case 'name_desc': return { nombre: 'desc' };
      case 'date_asc': return { creadoEn: 'asc' };
      case 'date_desc': return { creadoEn: 'desc' };
      default: return { creadoEn: 'desc' };
    }
  }
}

// repositories/product.repository.ts
@Injectable()
export class ProductRepository extends BaseRepository<Producto, CreateProductDto, UpdateProductDto> {
  constructor(prisma: PrismaService) {
    super(prisma, 'producto');
  }

  async create(data: CreateProductDto): Promise<Producto> {
    return this.prisma.producto.create({
      data: {
        ...data,
        slug: this.generateSlug(data.nombre),
      },
      include: this.getDefaultIncludes()
    });
  }

  async findById(id: string): Promise<Producto | null> {
    return this.prisma.producto.findUnique({
      where: { id },
      include: this.getDefaultIncludes()
    });
  }

  async findMany(filters: ProductFilters = {}): Promise<Producto[]> {
    const where = this.buildProductWhereClause(filters);
    
    return this.prisma.producto.findMany({
      where,
      include: this.getDefaultIncludes(),
      orderBy: this.buildOrderBy(filters.orderBy),
      take: filters.limit || 20,
      skip: ((filters.page || 1) - 1) * (filters.limit || 20)
    });
  }

  async update(id: string, data: UpdateProductDto): Promise<Producto> {
    return this.prisma.producto.update({
      where: { id },
      data: {
        ...data,
        ...(data.nombre && { slug: this.generateSlug(data.nombre) }),
        actualizadoEn: new Date()
      },
      include: this.getDefaultIncludes()
    });
  }

  async delete(id: string): Promise<Producto> {
    return this.prisma.producto.update({
      where: { id },
      data: { eliminadoEn: new Date() }
    });
  }

  // Métodos específicos del repositorio
  async findBySlug(slug: string): Promise<Producto | null> {
    return this.prisma.producto.findUnique({
      where: { slug },
      include: this.getDetailedIncludes()
    });
  }

  async findBySKU(sku: string): Promise<Producto | null> {
    return this.prisma.producto.findUnique({
      where: { sku },
      include: this.getDefaultIncludes()
    });
  }

  async findByVendedor(vendedorId: string, filters: ProductFilters = {}): Promise<Producto[]> {
    const where = {
      vendedorId,
      ...this.buildProductWhereClause(filters)
    };

    return this.prisma.producto.findMany({
      where,
      include: this.getDefaultIncludes(),
      orderBy: this.buildOrderBy(filters.orderBy)
    });
  }

  async getFeatured(limit: number = 10): Promise<Producto[]> {
    return this.prisma.producto.findMany({
      where: {
        destacado: true,
        estado: 'ACTIVO',
        stock: { gt: 0 }
      },
      include: this.getDefaultIncludes(),
      orderBy: { creadoEn: 'desc' },
      take: limit
    });
  }

  async updateStock(id: string, cantidad: number): Promise<Producto> {
    return this.prisma.producto.update({
      where: { id },
      data: {
        stock: { increment: cantidad }
      }
    });
  }

  protected buildSearchClause(search: string) {
    return [
      { nombre: { contains: search, mode: 'insensitive' } },
      { descripcion: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } }
    ];
  }

  private buildProductWhereClause(filters: ProductFilters) {
    const where: any = {
      estado: 'ACTIVO',
      eliminadoEn: null
    };

    if (filters.categoriaId) {
      where.categoriaId = filters.categoriaId;
    }

    if (filters.marcaId) {
      where.marcaId = filters.marcaId;
    }

    if (filters.precioMin || filters.precioMax) {
      where.precio = {};
      if (filters.precioMin) where.precio.gte = filters.precioMin;
      if (filters.precioMax) where.precio.lte = filters.precioMax;
    }

    if (filters.enStock) {
      where.stock = { gt: 0 };
    }

    if (filters.conOferta) {
      where.precioOferta = { not: null };
    }

    if (filters.search) {
      where.OR = this.buildSearchClause(filters.search);
    }

    return where;
  }

  private getDefaultIncludes() {
    return {
      categoria: {
        select: { id: true, nombre: true, slug: true }
      },
      marca: {
        select: { id: true, nombre: true, logo: true }
      },
      imagenes: {
        where: { esPrincipal: true },
        take: 1,
        select: { url: true, alt: true }
      },
      _count: {
        select: {
          resenas: { where: { aprobada: true } },
          ordenItems: true
        }
      }
    };
  }

  private getDetailedIncludes() {
    return {
      categoria: true,
      marca: true,
      vendedor: {
        select: { id: true, nombre: true, apellido: true }
      },
      imagenes: {
        orderBy: { orden: 'asc' }
      },
      variantes: {
        where: { activa: true }
      },
      resenas: {
        where: { aprobada: true },
        include: {
          usuario: {
            select: { nombre: true, apellido: true }
          }
        },
        orderBy: { creadoEn: 'desc' }
      }
    };
  }

  private generateSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
}
```

### **2. Service Layer con Domain Logic**
```typescript
// services/product.service.ts
@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private categoryRepository: CategoryRepository,
    private brandRepository: BrandRepository,
    private imageService: ImageService,
    private searchService: SearchService,
    private cacheService: CacheService,
    private loggingService: LoggingService
  ) {}

  async createProduct(data: CreateProductDto, vendedorId: string): Promise<Producto> {
    // Validaciones de negocio
    await this.validateProductCreation(data, vendedorId);

    try {
      const product = await this.productRepository.create({
        ...data,
        vendedorId
      });

      // Procesar imágenes de forma asíncrona
      if (data.imagenes?.length > 0) {
        this.processProductImages(product.id, data.imagenes);
      }

      // Indexar para búsqueda
      await this.searchService.indexProduct(product);

      // Limpiar cache relacionado
      await this.cacheService.invalidatePattern('products:*');

      // Log del evento de negocio
      this.loggingService.logBusinessEvent('product_created', {
        productId: product.id,
        vendedorId,
        categoria: product.categoria.nombre
      });

      return product;

    } catch (error) {
      this.loggingService.error('Failed to create product', error.stack, 'ProductService', {
        vendedorId,
        data
      });
      throw error;
    }
  }

  async updateProduct(id: string, data: UpdateProductDto, vendedorId: string): Promise<Producto> {
    // Verificar propiedad
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (existingProduct.vendedorId !== vendedorId) {
      throw new ForbiddenException('No tienes permisos para editar este producto');
    }

    // Validaciones de negocio
    await this.validateProductUpdate(data, existingProduct);

    try {
      const updatedProduct = await this.productRepository.update(id, data);

      // Actualizar índice de búsqueda
      await this.searchService.updateProductIndex(updatedProduct);

      // Invalidar cache
      await this.cacheService.delete(`product:${id}`);
      await this.cacheService.invalidatePattern('products:*');

      this.loggingService.logBusinessEvent('product_updated', {
        productId: id,
        vendedorId,
        changes: Object.keys(data)
      });

      return updatedProduct;

    } catch (error) {
      this.loggingService.error('Failed to update product', error.stack, 'ProductService', {
        productId: id,
        vendedorId,
        data
      });
      throw error;
    }
  }

  async getProductDetails(id: string): Promise<Producto> {
    // Intentar desde cache primero
    const cacheKey = `product:${id}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Incrementar contador de vistas de forma asíncrona
    this.incrementProductViews(id);

    // Cachear por 1 hora
    await this.cacheService.set(cacheKey, product, 3600);

    return product;
  }

  async searchProducts(filters: ProductSearchDto): Promise<ProductSearchResult> {
    const cacheKey = `products:search:${JSON.stringify(filters)}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const startTime = Date.now();
    
    try {
      const [products, total] = await Promise.all([
        this.productRepository.findMany(filters),
        this.productRepository.count(filters)
      ]);

      const result = {
        productos: products,
        paginacion: {
          total,
          pagina: filters.page || 1,
          limite: filters.limit || 20,
          totalPaginas: Math.ceil(total / (filters.limit || 20))
        }
      };

      // Cachear por 15 minutos
      await this.cacheService.set(cacheKey, result, 900);

      // Log de performance
      const duration = Date.now() - startTime;
      this.loggingService.logPerformance('product_search', duration, {
        filters,
        resultsCount: products.length
      });

      return result;

    } catch (error) {
      this.loggingService.error('Product search failed', error.stack, 'ProductService', {
        filters
      });
      throw error;
    }
  }

  async getRelatedProducts(productId: string, limit: number = 6): Promise<Producto[]> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Buscar productos relacionados por categoría y tags
    const related = await this.productRepository.findMany({
      categoriaId: product.categoriaId,
      exclude: [productId],
      limit
    });

    return related;
  }

  private async validateProductCreation(data: CreateProductDto, vendedorId: string) {
    // Verificar que la categoría existe
    const category = await this.categoryRepository.findById(data.categoriaId);
    if (!category) {
      throw new BadRequestException('Categoría no encontrada');
    }

    // Verificar que la marca existe (si se proporciona)
    if (data.marcaId) {
      const brand = await this.brandRepository.findById(data.marcaId);
      if (!brand) {
        throw new BadRequestException('Marca no encontrada');
      }
    }

    // Verificar SKU único
    const existingSKU = await this.productRepository.findBySKU(data.sku);
    if (existingSKU) {
      throw new BadRequestException('El SKU ya existe');
    }

    // Validaciones de negocio específicas
    if (data.precioOferta && data.precioOferta >= data.precio) {
      throw new BadRequestException('El precio de oferta debe ser menor al precio regular');
    }
  }

  private async validateProductUpdate(data: UpdateProductDto, existingProduct: Producto) {
    // Similar a validateProductCreation pero para updates
    if (data.sku && data.sku !== existingProduct.sku) {
      const existingSKU = await this.productRepository.findBySKU(data.sku);
      if (existingSKU) {
        throw new BadRequestException('El SKU ya existe');
      }
    }

    if (data.precioOferta && data.precio) {
      if (data.precioOferta >= data.precio) {
        throw new BadRequestException('El precio de oferta debe ser menor al precio regular');
      }
    }
  }

  private async processProductImages(productId: string, imagenes: any[]) {
    // Procesar imágenes de forma asíncrona
    for (const [index, imagen] of imagenes.entries()) {
      try {
        await this.imageService.processProductImage(productId, imagen, index);
      } catch (error) {
        this.loggingService.error('Failed to process product image', error.stack, 'ProductService', {
          productId,
          imageIndex: index
        });
      }
    }
  }

  private async incrementProductViews(productId: string) {
    try {
      await this.productRepository.updateViews(productId);
    } catch (error) {
      // No fallar la request principal por esto
      this.loggingService.error('Failed to increment product views', error.stack, 'ProductService', {
        productId
      });
    }
  }
}
```

---

## 🎯 **REFLEXIÓN FINAL: EL ARTE DE LA ARQUITECTURA MODERNA**

### **🏆 Lo Que Hemos Construido Juntos**

Al finalizar esta masterclass, no solo hemos aprendido tecnologías, **hemos construido una mentalidad arquitectónica**. Permíteme contarte qué significa realmente dominar este stack:

### **🧠 La Mentalidad del Arquitecto Moderno**

**1. Database-First Thinking**
```prisma
// Esto no es solo código, es el ADN de tu aplicación
model Usuario {
  id String @id @default(cuid())
  // Cada campo cuenta una historia
  // Cada relación es una decisión arquitectónica
  // Cada índice es una promesa de performance
}
```

Prisma nos enseñó que **la base de datos no es un detalle técnico, es el corazón de tu negocio**. Cuando diseñas un schema, estás diseñando la realidad de tu dominio.

**2. Type-Safety as a Philosophy**
```typescript
// TypeScript + Prisma = Confianza total
async function createOrder(data: CreateOrderDto): Promise<Order> {
  // El compilador es tu primer QA tester
  // Los tipos son documentación viviente
  // Los errores se capturan en tiempo de desarrollo, no en producción
}
```

La seguridad de tipos no es solo prevenir errores, **es comunicación entre desarrolladores a través del tiempo**.

**3. Declarative Over Imperative**
```typescript
// En lugar de "cómo hacer algo"
const users = await prisma.user.findMany({
  where: { active: true },
  include: { orders: true }
});

// Declaras "qué quieres"
// Prisma se encarga del "cómo"
```

### **🚀 Por Qué Este Stack Cambió el Juego**

**Antes de NestJS + Prisma + PostgreSQL:**
- ❌ ORMs complicados y verbosos
- ❌ SQL crudo mezclado con lógica de negocio  
- ❌ Tipos desactualizados entre base de datos y código
- ❌ Migraciones manuales propensas a errores
- ❌ Consultas N+1 por todas partes
- ❌ Testing complicado con mocks infinitos

**Con este stack moderno:**
- ✅ **Developer Experience** superior
- ✅ **Type Safety** de punta a punta
- ✅ **Performance** optimizada automáticamente
- ✅ **Escalabilidad** empresarial desde día 1
- ✅ **Mantenibilidad** a largo plazo
- ✅ **Testing** intuitivo y confiable

### **🎭 Las Analogías Que Nos Enseñaron**

**1. La Casa (Arquitectura)**
```
🏗️ NestJS = El Arquitecto (estructura y organización)
🔧 Prisma = El Plomero/Electricista (conecta todo fluidamente)
📊 PostgreSQL = Los Cimientos (sólido y confiable)
```

**2. El Sistema Nervioso (Relaciones)**
```
Las relaciones no son solo foreign keys,
son las conexiones que dan vida a tu aplicación.
Una relación mal diseñada es como un nervio pinzado:
duele todo el sistema.
```

**3. El Jardín (Mantenimiento)**
```
Una base de datos es como un jardín:
- Necesita cuidado constante (índices, limpieza)
- Crece de forma orgánica (migraciones)
- Da frutos cuando se cuida bien (performance)
```

### **💎 Las Lecciones Más Valiosas**

**1. "Convention Over Configuration"**
Prisma nos enseñó que seguir convenciones inteligentes libera energía mental para resolver problemas de negocio, no problemas técnicos.

**2. "Fail Fast, Fail Early"**
TypeScript + Prisma nos permiten capturar errores en tiempo de desarrollo. Un error que no llega a producción es un problema que no existe.

**3. "Optimize for Change"**
Las migraciones de Prisma y la arquitectura modular de NestJS nos preparan para un futuro incierto. El cambio es la única constante.

**4. "Data is the New Oil"**
PostgreSQL nos dio las herramientas para no solo almacenar datos, sino para extraer conocimiento de ellos. Cada consulta es una pregunta de negocio.

### **🌟 Tu Transformación Como Desarrollador**

**Antes de esta masterclass, eras:**
- Un desarrollador que escribía código

**Después de esta masterclass, eres:**
- Un **arquitecto** que diseña sistemas
- Un **artesano** que valora la calidad
- Un **visionario** que piensa en escalabilidad
- Un **científico** que mide y optimiza
- Un **comunicador** que documenta con tipos

### **🔮 El Futuro Que Te Espera**

Con este stack en tu arsenal:

**Próximos 6 meses:**
- Vas a construir aplicaciones que impresionen
- Tu código va a ser más limpio y mantenible
- Vas a debuggear menos y crear más
- Vas a sentir confianza en cada deploy

**Próximos 2 años:**
- Vas a liderar equipos con estas herramientas
- Vas a diseñar arquitecturas que escalen
- Vas a ser el referente técnico en tu empresa
- Vas a mentorear a otros desarrolladores

**Próximos 5 años:**
- Vas a estar en la vanguardia del desarrollo web
- Vas a adaptar fácilmente a nuevas tecnologías
- Vas a tomar decisiones arquitectónicas con sabiduría
- Vas a construir productos que cambien industrias

### **🎪 Mi Mensaje Final Para Ti**

**No solo aprendiste tecnologías, desarrollaste una filosofía.**

Cada vez que veas un modelo de Prisma, recordá que estás viendo la realidad de un negocio expresada en código.

Cada vez que escribas un servicio en NestJS, recordá que estás creando un componente reutilizable que alguien más va a usar.

Cada vez que diseñes una consulta en PostgreSQL, recordá que estás haciendo una pregunta inteligente a datos que tienen historias que contar.

**Este stack no es solo sobre escribir código mejor.**
**Es sobre pensar diferente.**
**Es sobre construir el futuro.**

### **🚀 Tu Llamada a la Acción**

1. **Construí tu primer proyecto** con este stack esta semana
2. **Enseñá a alguien más** lo que aprendiste
3. **Contribuí** a proyectos open source que usen estas tecnologías
4. **Experimentá** con patrones avanzados
5. **Medí y optimizá** constantemente

### **🌟 Palabras de Cierre**

La tecnología cambia, las modas pasan, pero **los principios fundamentales perduran:**

- **Simplicidad** sobre complejidad
- **Claridad** sobre inteligencia  
- **Consistencia** sobre novedad
- **Performance** sobre apariencia
- **Mantenibilidad** sobre rapidez inicial

Este stack encarna estos principios. Usalo no solo como herramienta, sino como filosofía.

**Construí cosas increíbles.**
**Cambiá el mundo, una línea de código a la vez.**
**El futuro del desarrollo web está en tus manos.**

---

*¿Estás listo para revolucionar tu manera de construir aplicaciones? El viaje apenas comienza...* 🚀✨