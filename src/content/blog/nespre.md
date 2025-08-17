---
title: 'Prisma + PostgreSQL + Class Validators'
code: 'nestjs'
description: 'Guía Completa: Prisma + PostgreSQL + Class Validators'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


# Guía Completa: Prisma + PostgreSQL + Class Validators

## 1. Configuración Inicial de PostgreSQL

### Crear Base de Datos PostgreSQL

#### Usando psql (línea de comandos)
```bash
# Conectar a PostgreSQL como superusuario
sudo -u postgres psql

# O directamente
psql -U postgres

# Dentro de psql, crear base de datos
CREATE DATABASE mi_aplicacion;

# Crear usuario específico
CREATE USER mi_usuario WITH ENCRYPTED PASSWORD 'mi_password';

# Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE mi_aplicacion TO mi_usuario;

# Salir de psql
\q
```

#### Usando createdb (comando directo)
```bash
# Crear base de datos directamente
createdb -U postgres mi_aplicacion

# Con opciones adicionales
createdb -U postgres -O mi_usuario -E UTF8 mi_aplicacion
```

#### Con Docker
```bash
# Ejecutar PostgreSQL en Docker
docker run --name postgres-db \
  -e POSTGRES_DB=mi_aplicacion \
  -e POSTGRES_USER=mi_usuario \
  -e POSTGRES_PASSWORD=mi_password \
  -p 5432:5432 \
  -d postgres:15

# O usar docker-compose.yml
```

#### Docker Compose para desarrollo
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: mi_postgres
    environment:
      POSTGRES_DB: mi_aplicacion
      POSTGRES_USER: mi_usuario
      POSTGRES_PASSWORD: mi_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

## 2. Instalación y Configuración de Prisma

### Instalación
```bash
# Instalar Prisma CLI
npm install -D prisma

# Instalar Prisma Client
npm install @prisma/client

# Para NestJS, instalar también
npm install @nestjs/config
```

### Inicialización
```bash
# Inicializar Prisma
npx prisma init

# Con provider específico
npx prisma init --datasource-provider postgresql
```

### Configuración del archivo .env
```env
# .env
DATABASE_URL="postgresql://mi_usuario:mi_password@localhost:5432/mi_aplicacion?schema=public"

# Para producción
# DATABASE_URL="postgresql://usuario:password@host:puerto/base_datos?schema=public&sslmode=require"
```

## 3. Comandos de Prisma

### Comandos del Schema
```bash
# Formatear schema.prisma
npx prisma format

# Validar schema
npx prisma validate

# Generar Prisma Client
npx prisma generate

# Ver diferencias del schema
npx prisma diff
```

### Comandos de Base de Datos
```bash
# Crear y aplicar migración
npx prisma migrate dev --name init

# Aplicar migraciones pendientes
npx prisma migrate deploy

# Reset de base de datos (desarrollo)
npx prisma migrate reset

# Crear migración sin aplicar
npx prisma migrate dev --create-only

# Ver estado de migraciones
npx prisma migrate status

# Resolver problemas de migración
npx prisma migrate resolve --applied "20231201_init"
npx prisma migrate resolve --rolled-back "20231201_init"
```

### Comandos de Datos
```bash
# Abrir Prisma Studio (GUI)
npx prisma studio

# Hacer seed de la base de datos
npx prisma db seed

# Push del schema sin migración (desarrollo)
npx prisma db push

# Pull del schema desde la base de datos
npx prisma db pull
```

### Comandos de Generación de Cliente
```bash
# Generar cliente después de cambios en schema
npx prisma generate

# Generar con provider específico
npx prisma generate --generator client
```

## 4. Schema de Prisma - Ejemplos Completos

### Schema Básico (prisma/schema.prisma)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String   @unique
  firstName String
  lastName  String
  password  String
  isActive  Boolean  @default(true)
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  posts     Post[]
  profile   Profile?
  comments  Comment[]

  @@map("users")
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  avatar String?
  phone  String?
  userId Int     @unique
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  slug      String   @unique
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  authorId Int
  author   User      @relation(fields: [authorId], references: [id])
  comments Comment[]
  tags     Tag[]     @relation("PostTags")

  @@map("posts")
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  postId Int
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId Int
  user   User @relation(fields: [userId], references: [id])

  @@map("comments")
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[] @relation("PostTags")

  @@map("tags")
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

### Schema Avanzado con Más Características
```prisma
model Order {
  id          String      @id @default(cuid())
  orderNumber String      @unique @default(cuid())
  status      OrderStatus @default(PENDING)
  total       Decimal     @db.Decimal(10, 2)
  currency    String      @default("USD")
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relaciones
  customerId String
  customer   User     @relation("UserOrders", fields: [customerId], references: [id])
  items      OrderItem[]

  // Índices
  @@index([customerId])
  @@index([status])
  @@map("orders")
}

model OrderItem {
  id       String  @id @default(cuid())
  quantity Int
  price    Decimal @db.Decimal(10, 2)

  // Relaciones
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])

  @@map("order_items")
}

model Product {
  id          String    @id @default(cuid())
  name        String
  description String?
  price       Decimal   @db.Decimal(10, 2)
  stock       Int       @default(0)
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relaciones
  orderItems OrderItem[]
  categoryId String?
  category   Category?   @relation(fields: [categoryId], references: [id])

  // Índices de texto completo
  @@index([name])
  @@map("products")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}
```

## 5. Class Validators - Instalación y Uso

### Instalación
```bash
# Instalar dependencias
npm install class-validator class-transformer

# Para NestJS
npm install @nestjs/mapped-types
```

### DTOs con Class Validators

#### Create User DTO
```typescript
// src/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  Matches,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email debe ser válido' })
  @IsNotEmpty({ message: 'Email es requerido' })
  email: string;

  @IsString({ message: 'Username debe ser texto' })
  @IsNotEmpty({ message: 'Username es requerido' })
  @MinLength(3, { message: 'Username debe tener al menos 3 caracteres' })
  @MaxLength(20, { message: 'Username no puede exceder 20 caracteres' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username solo puede contener letras, números y guiones bajos'
  })
  username: string;

  @IsString({ message: 'Nombre debe ser texto' })
  @IsNotEmpty({ message: 'Nombre es requerido' })
  @MinLength(2, { message: 'Nombre debe tener al menos 2 caracteres' })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsString({ message: 'Apellido debe ser texto' })
  @IsNotEmpty({ message: 'Apellido es requerido' })
  @MinLength(2, { message: 'Apellido debe tener al menos 2 caracteres' })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsString({ message: 'Contraseña debe ser texto' })
  @IsNotEmpty({ message: 'Contraseña es requerida' })
  @MinLength(8, { message: 'Contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Contraseña debe contener mayúscula, minúscula, número y carácter especial'
  })
  password: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser booleano' })
  isActive?: boolean;

  @IsOptional()
  @IsEnum(Role, { message: 'Rol debe ser USER, ADMIN o MODERATOR' })
  role?: Role;
}
```

#### Update User DTO
```typescript
// src/users/dto/update-user.dto.ts
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'password'] as const)
) {
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword?: string;
}
```

#### Create Post DTO
```typescript
// src/posts/dto/create-post.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  ArrayMinSize,
  MaxLength,
  MinLength,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @IsString({ message: 'Título debe ser texto' })
  @IsNotEmpty({ message: 'Título es requerido' })
  @MinLength(5, { message: 'Título debe tener al menos 5 caracteres' })
  @MaxLength(200, { message: 'Título no puede exceder 200 caracteres' })
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsOptional()
  @IsString({ message: 'Contenido debe ser texto' })
  @MaxLength(10000, { message: 'Contenido no puede exceder 10000 caracteres' })
  content?: string;

  @IsString({ message: 'Slug debe ser texto' })
  @IsNotEmpty({ message: 'Slug es requerido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  slug: string;

  @IsOptional()
  @IsBoolean({ message: 'Published debe ser booleano' })
  published?: boolean;

  @IsOptional()
  @IsArray({ message: 'Tags debe ser un array' })
  @ArrayMinSize(1, { message: 'Debe tener al menos un tag' })
  @IsString({ each: true, message: 'Cada tag debe ser texto' })
  tags?: string[];
}
```

#### Query DTOs con Paginación
```typescript
// src/common/dto/pagination.dto.ts
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page debe ser un número entero' })
  @Min(1, { message: 'Page debe ser mayor a 0' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit debe ser un número entero' })
  @Min(1, { message: 'Limit debe ser mayor a 0' })
  @Max(100, { message: 'Limit no puede ser mayor a 100' })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'Search debe ser texto' })
  search?: string;

  @IsOptional()
  @IsString({ message: 'SortBy debe ser texto' })
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'SortOrder debe ser asc o desc' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class UserQueryDto extends PaginationDto {
  @IsOptional()
  @IsIn(['USER', 'ADMIN', 'MODERATOR'], { message: 'Role inválido' })
  role?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'isActive debe ser booleano' })
  isActive?: boolean;
}
```

## 6. Servicios con Prisma

### User Service Completo
```typescript
// src/users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          isActive: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const field = error.meta?.target as string[];
          throw new ConflictException(`${field[0]} ya está en uso`);
        }
      }
      throw error;
    }
  }

  async findAll(query: UserQueryDto) {
    const { page, limit, search, sortBy, sortOrder, role, isActive } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(role && { role: role as any }),
      ...(isActive !== undefined && { isActive }),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          isActive: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        posts: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Remover password del resultado
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updateData: any = { ...updateUserDto };

      // Hash nueva contraseña si se proporciona
      if (updateUserDto.newPassword) {
        updateData.password = await bcrypt.hash(updateUserDto.newPassword, 12);
        delete updateData.newPassword;
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          isActive: true,
          role: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        if (error.code === 'P2002') {
          const field = error.meta?.target as string[];
          throw new ConflictException(`${field[0]} ya está en uso`);
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return { message: `Usuario con ID ${id} eliminado correctamente` };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
      }
      throw error;
    }
  }

  // Métodos adicionales útiles
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async toggleActiveStatus(id: number) {
    const user = await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        isActive: true,
      },
    });
  }
}
```

## 7. Seed para Base de Datos

### Configuración del Seed
```typescript
// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos existentes
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tag.deleteMany();

  // Crear tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'javascript' } }),
    prisma.tag.create({ data: { name: 'typescript' } }),
    prisma.tag.create({ data: { name: 'nestjs' } }),
    prisma.tag.create({ data: { name: 'prisma' } }),
    prisma.tag.create({ data: { name: 'postgresql' } }),
  ]);

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('Password123!', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      password: hashedPassword,
      role: Role.ADMIN,
      profile: {
        create: {
          bio: 'Administrador del sistema',
          phone: '+1234567890',
        },
      },
    },
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'juan@example.com',
        username: 'juan123',
        firstName: 'Juan',
        lastName: 'Pérez',
        password: hashedPassword,
        profile: {
          create: {
            bio: 'Desarrollador Full Stack',
            phone: '+1234567891',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria@example.com',
        username: 'maria456',
        firstName: 'María',
        lastName: 'González',
        password: hashedPassword,
        profile: {
          create: {
            bio: 'Frontend Developer',
            phone: '+1234567892',
          },
        },
      },
    }),
  ]);

  // Crear posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Introducción a NestJS',
        content: 'NestJS es un framework para Node.js...',
        slug: 'introduccion-nestjs',
        published: true,
        authorId: users[0].id,
        tags: {
          connect: [{ id: tags[2].id }, { id: tags[1].id }],
        },
      },
    }),
    prisma.post.create({
      data: {
        title: 'Prisma con PostgreSQL',
        content: 'Aprende a usar Prisma con PostgreSQL...',
        slug: 'prisma-postgresql',
        published: true,
        authorId: users[1].id,
        tags: {
          connect: [{ id: tags[3].id }, { id: tags[4].id }],
        },
      },
    }),
  ]);

  // Crear comentarios
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Excelente artículo sobre NestJS!',
        postId: posts[0].id,
        userId: users[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Muy útil la información sobre Prisma',
        postId: posts[1].id,
        userId: users[0].id,
      },
    }),
  ]);

  console.log('✅ Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Configurar script en package.json
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  "scripts": {
    "seed": "prisma db seed"
  }
}
```

## 8. Comandos Útiles para el Desarrollo

### Flujo de trabajo típico
```bash
# 1. Crear base de datos
createdb -U postgres mi_aplicacion

# 2. Configurar .env con DATABASE_URL

# 3. Crear migración inicial
npx prisma migrate dev --name init

# 4. Generar cliente de Prisma
npx prisma generate

# 5. Ejecutar seed
npx prisma db seed

# 6. Abrir Prisma Studio para ver datos
npx prisma studio
```

### Comandos de desarrollo frecuentes
```bash
# Después de cambios en schema
npx prisma migrate dev --name "add_new_field"
npx prisma generate

# Reset completo (desarrollo)
npx prisma migrate reset

# Ver estado actual
npx prisma migrate status

# Push cambios sin migración (desarrollo rápido)
npx prisma db push
```

Esta guía te proporciona todo lo necesario para trabajar con Prisma, PostgreSQL y class-validators en NestJS. ¿Te gustaría que profundice en algún tema específico o que agregue más ejemplos?