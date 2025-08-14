---
title: 'NestJS Masterclass'
code: 'nestjs'
description: 'NestJS Masterclass: Arquitecturas Limpias y Código Mantenible'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# NestJS Masterclass: Arquitecturas Limpias y Código Mantenible

## 📚 Índice

1. [¿Qué es NestJS? La analogía del restaurante](#que-es-nestjs)
2. [Arquitectura Limpia: Los pilares de un edificio sólido](#arquitectura-limpia)
3. [Configuración inicial: Preparando la cocina](#configuracion-inicial)
4. [Módulos: Los departamentos de tu empresa](#modulos)
5. [Controladores: Los recepcionistas de tu aplicación](#controladores)
6. [Servicios: Los especialistas que hacen el trabajo](#servicios)
7. [Dependency Injection: El sistema de personal de recursos humanos](#dependency-injection)
8. [Middleware: Los guardias de seguridad](#middleware)
9. [Guards: Los porteros del club VIP](#guards)
10. [Interceptors: Los editores de contenido](#interceptors)
11. [Pipes: Los traductores universales](#pipes)
12. [Manejo de errores: El departamento de atención al cliente](#manejo-errores)
13. [Testing: Los inspectores de calidad](#testing)
14. [Proyecto práctico: Construyendo una librería digital](#proyecto-practico)
15. [Mejores prácticas: Las reglas de oro](#mejores-practicas)

---

## 🍽️ ¿Qué es NestJS? La analogía del restaurante {#que-es-nestjs}

Imagina que NestJS es como gestionar un **restaurante de alta cocina**. Así como un restaurante necesita:

- **Recepcionistas** (Controladores) que reciben a los clientes
- **Chefs especialistas** (Servicios) que preparan cada plato
- **Un sistema organizado** (Módulos) que divide la cocina en estaciones
- **Protocolos de calidad** (Guards, Pipes) que aseguran la excelencia

NestJS te da la estructura y herramientas para construir aplicaciones backend escalables y mantenibles, usando **TypeScript** y siguiendo principios de **arquitectura limpia**.

### ¿Por qué NestJS?

```typescript
// Sin NestJS (Express puro) - Como una cocina caótica
app.get('/users', (req, res) => {
  // Lógica mezclada: validación, negocio, respuesta
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  // Más código mezclado...
});

// Con NestJS - Como una cocina organizada
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  @Get()
  async getUsers(@Query() query: GetUsersDto) {
    return this.usersService.findAll(query);
  }
}
```

---

## 🏗️ Arquitectura Limpia: Los pilares de un edificio sólido {#arquitectura-limpia}

La **Arquitectura Limpia** es como construir un rascacielos. Necesitas:

### 1. **Capas bien definidas** (Como pisos del edificio)

```
┌─────────────────────────────────────┐
│     🎨 PRESENTATION LAYER           │  ← Controladores, DTOs
│     (Controllers, DTOs)             │
├─────────────────────────────────────┤
│     💼 BUSINESS LAYER               │  ← Servicios, Casos de uso
│     (Services, Use Cases)           │
├─────────────────────────────────────┤
│     🗄️ DATA ACCESS LAYER            │  ← Repositorios, Entidades
│     (Repositories, Entities)        │
└─────────────────────────────────────┘
```

### 2. **Principios SOLID**

**S**ingle Responsibility: Cada clase tiene una sola razón para cambiar
**O**pen/Closed: Abierto para extensión, cerrado para modificación
**L**iskov Substitution: Los subtipos deben ser reemplazables
**I**nterface Segregation: Interfaces específicas mejor que generales
**D**ependency Inversion: Depende de abstracciones, no de concreciones

---

## ⚙️ Configuración inicial: Preparando la cocina {#configuracion-inicial}

### Instalación

```bash
# Instalar NestJS CLI (tu asistente de cocina)
npm i -g @nestjs/cli

# Crear nuevo proyecto (montar la cocina)
nest new mi-restaurante

# Entrar al proyecto
cd mi-restaurante

# Instalar dependencias adicionales
npm install @nestjs/typeorm typeorm mysql2
npm install class-validator class-transformer
npm install @nestjs/config
```

### Estructura de carpetas (Como organizar tu cocina)

```
src/
├── 📁 modules/           # Departamentos del restaurante
│   ├── 📁 auth/         # Departamento de seguridad
│   ├── 📁 users/        # Gestión de clientes
│   └── 📁 products/     # Gestión de productos
├── 📁 shared/           # Herramientas compartidas
│   ├── 📁 decorators/   # Decoradores personalizados
│   ├── 📁 filters/      # Filtros de errores
│   ├── 📁 guards/       # Guardias de seguridad
│   └── 📁 interceptors/ # Interceptores
├── 📁 config/           # Configuraciones
└── main.ts              # Punto de entrada
```

---

## 🏢 Módulos: Los departamentos de tu empresa {#modulos}

Los **módulos** son como departamentos de una empresa. Cada uno tiene responsabilidades específicas y puede comunicarse con otros de manera controlada.

### Módulo básico

```typescript
// users/users.module.ts - El departamento de usuarios
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

@Module({
  controllers: [UsersController],    // Los recepcionistas
  providers: [UsersService, UsersRepository], // Los trabajadores
  exports: [UsersService],          // Lo que ofrecemos a otros departamentos
})
export class UsersModule {}
```

### Módulo con dependencias externas

```typescript
// products/products.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { UsersModule } from '../users/users.module'; // Importamos otro departamento

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]), // Conexión a base de datos
    UsersModule, // Necesitamos el departamento de usuarios
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
```

### Módulo raíz (La empresa completa)

```typescript
// app.module.ts - La sede central
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en toda la empresa
    }),
    
    // Base de datos
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    
    // Departamentos
    AuthModule,
    UsersModule,
    ProductsModule,
  ],
})
export class AppModule {}
```

---

## 📞 Controladores: Los recepcionistas de tu aplicación {#controladores}

Los **controladores** son como los recepcionistas de un hotel de lujo. Reciben las peticiones, las entienden y las dirigen al departamento correcto.

### Controlador básico

```typescript
// users/users.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, GetUsersQueryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users') // Documentación automática
@Controller('users') // Ruta base: /users
@UseGuards(JwtAuthGuard) // Protección global del controlador
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users - Obtener todos los usuarios
  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de usuarios obtenida exitosamente' })
  async findAll(@Query() query: GetUsersQueryDto) {
    return this.usersService.findAll(query);
  }

  // GET /users/:id - Obtener un usuario específico
  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Usuario encontrado' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Usuario no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // POST /users - Crear nuevo usuario
  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // PUT /users/:id - Actualizar usuario
  @Put(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Usuario actualizado exitosamente' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // DELETE /users/:id - Eliminar usuario
  @Delete(':id')
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Usuario eliminado exitosamente' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
```

### DTOs: Los formularios estandarizados

```typescript
// users/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export class CreateUserDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan Pérez' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  name: string;

  @ApiProperty({ description: 'Email del usuario', example: 'juan@ejemplo.com' })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @ApiProperty({ description: 'Contraseña del usuario' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiProperty({ 
    description: 'Rol del usuario', 
    enum: UserRole, 
    default: UserRole.USER,
    required: false 
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser admin, user o moderator' })
  role?: UserRole = UserRole.USER;
}
```

```typescript
// users/dto/update-user.dto.ts
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// Hereda de CreateUserDto pero hace todos los campos opcionales
// y omite la contraseña (se actualiza por separado por seguridad)
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const)
) {}
```

---

## 👨‍💼 Servicios: Los especialistas que hacen el trabajo {#servicios}

Los **servicios** son como los especialistas de tu empresa. Cada uno es experto en su área y contiene toda la lógica de negocio.

### Servicio con lógica de negocio

```typescript
// users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, GetUsersQueryDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Obtener todos los usuarios con filtros y paginación
  async findAll(query: GetUsersQueryDto) {
    const { page = 1, limit = 10, search, role } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    // Filtro por búsqueda
    if (search) {
      queryBuilder.where(
        'user.name ILIKE :search OR user.email ILIKE :search',
        { search: `%${search}%` }
      );
    }

    // Filtro por rol
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    // Paginación
    const [users, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Obtener un usuario por ID
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      select: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'], // Sin password
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  // Obtener usuario por email (para autenticación)
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'], // Con password para auth
    });
  }

  // Crear nuevo usuario
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar que el email no exista
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    // Crear usuario
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    // Remover password de la respuesta
    delete savedUser.password;
    return savedUser;
  }

  // Actualizar usuario
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Verificar que el usuario existe
    const user = await this.findOne(id);

    // Si se actualiza el email, verificar que no exista
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    // Actualizar
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  // Eliminar usuario (soft delete)
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.softDelete(id);
  }

  // Cambiar contraseña
  async changePassword(id: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new ConflictException('Contraseña actual incorrecta');
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Actualizar
    await this.usersRepository.update(id, { password: hashedPassword });
  }
}
```

### Entidad (El modelo de datos)

```typescript
// users/entities/user.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { UserRole } from '../dto/create-user.dto';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ select: false }) // No se incluye por defecto en las consultas
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Hooks del ciclo de vida
  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
```

---

## 💉 Dependency Injection: El sistema de personal de recursos humanos {#dependency-injection}

La **Inyección de Dependencias** es como el departamento de RRHH de tu empresa. Se encarga de que cada empleado tenga las herramientas y compañeros que necesita para trabajar.

### ¿Cómo funciona?

```typescript
// ❌ MAL: Dependencias hardcodeadas (como hacer todo manualmente)
class UsersService {
  private database = new MySQLDatabase(); // Acoplado directamente
  private logger = new ConsoleLogger();   // No se puede cambiar fácilmente
  
  async getUser(id: number) {
    this.logger.log('Buscando usuario...');
    return this.database.findUser(id);
  }
}

// ✅ BIEN: Inyección de dependencias (RRHH hace su trabajo)
@Injectable()
class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private logger: Logger,
    private emailService: EmailService,
  ) {}
  
  async getUser(id: number) {
    this.logger.log('Buscando usuario...');
    return this.usersRepository.findOne({ where: { id } });
  }
}
```

### Tipos de providers

```typescript
// users/users.module.ts
import { Module } from '@nestjs/common';

@Module({
  providers: [
    // 1. Clase estándar (shorthand)
    UsersService,
    
    // 2. Clase explícita
    {
      provide: UsersService,
      useClass: UsersService,
    },
    
    // 3. Valor constante
    {
      provide: 'API_KEY',
      useValue: process.env.API_KEY,
    },
    
    // 4. Factory (función que crea el servicio)
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: (configService: ConfigService) => {
        return createDatabaseConnection(configService.get('DB_URL'));
      },
      inject: [ConfigService],
    },
    
    // 5. Proveedor existente (alias)
    {
      provide: 'USERS_SERVICE',
      useExisting: UsersService,
    },
    
    // 6. Proveedor asíncrono
    {
      provide: 'ASYNC_SERVICE',
      useFactory: async (httpService: HttpService) => {
        const data = await httpService.get('/config').toPromise();
        return new ConfigService(data);
      },
      inject: [HttpService],
    },
  ],
})
export class UsersModule {}
```

### Decoradores de inyección

```typescript
@Injectable()
export class NotificationService {
  constructor(
    // Inyección estándar
    private emailService: EmailService,
    
    // Inyección con token personalizado
    @Inject('API_KEY') private apiKey: string,
    
    // Inyección opcional (no falla si no existe)
    @Optional() private smsService?: SmsService,
    
    // Inyección de repositorio TypeORM
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
}
```

---

## 🛡️ Middleware: Los guardias de seguridad {#middleware}

Los **Middleware** son como los guardias de seguridad en la entrada de un edificio. Todos pasan por ellos antes de entrar.

### Middleware personalizado

```typescript
// shared/middleware/logger.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('User-Agent') || '';
    const startTime = Date.now();

    // Cuando la respuesta termine
    res.on('close', () => {
      const { statusCode } = res;
      const contentLength = res.get('Content-Length');
      const responseTime = Date.now() - startTime;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} - ${responseTime}ms`
      );
    });

    next();
  }
}
```

### Middleware funcional

```typescript
// shared/middleware/cors.middleware.ts
import { Request, Response, NextFunction } from 'express';

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}
```

### Aplicar middleware

```typescript
// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './shared/middleware/logger.middleware';
import { corsMiddleware } from './shared/middleware/cors.middleware';

@Module({
  // ... otros imports
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicar a todas las rutas
    consumer
      .apply(corsMiddleware, LoggerMiddleware)
      .forRoutes('*');
    
    // Aplicar solo a rutas específicas
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'admin/*', method: RequestMethod.ALL });
  }
}
```

---

## 🚪 Guards: Los porteros del club VIP {#guards}

Los **Guards** son como los porteros de un club VIP. Deciden quién puede entrar basándose en criterios específicos.

### Guard de autenticación JWT

```typescript
// auth/guards/jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Token inválido o expirado');
    }
    return user;
  }
}
```

### Guard de roles

```typescript
// auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No hay restricción de roles
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      return false;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
```

### Decorador personalizado para roles

```typescript
// auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

### Usar guards en controladores

```typescript
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  
  @Get('users')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async getUsers() {
    return this.usersService.findAll();
  }

  @Delete('users/:id')
  @Roles(UserRole.ADMIN) // Solo administradores
  async deleteUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
```

---

## 🔄 Interceptors: Los editores de contenido {#interceptors}

Los **Interceptors** son como editores de revista. Pueden modificar el contenido antes de publicarlo o después de recibirlo.

### Interceptor de transformación de respuestas

```typescript
// shared/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>> {
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      map(data => ({
        success: true,
        message: this.getSuccessMessage(method),
        data,
        timestamp: new Date().toISOString(),
        path: url,
      })),
    );
  }

  private getSuccessMessage(method: string): string {
    const messages = {
      GET: 'Datos obtenidos exitosamente',
      POST: 'Recurso creado exitosamente',
      PUT: 'Recurso actualizado exitosamente',
      PATCH: 'Recurso actualizado exitosamente',
      DELETE: 'Recurso eliminado exitosamente',
    };
    return messages[method] || 'Operación exitosa';
  }
}
```

### Interceptor de logging

```typescript
// shared/interceptors/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('User-Agent') || '';
    const now = Date.now();

    this.logger.log(`Incoming Request: ${method} ${url} - ${ip} - ${userAgent}`);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const delay = Date.now() - now;
          this.logger.log(
            `Outgoing Response: ${method} ${url} ${response.statusCode} - ${delay}ms`
          );
        },
        error: (error) => {
          const delay = Date.now() - now;
          this.logger.error(
            `Request Error: ${method} ${url} - ${error.message} - ${delay}ms`
          );
        },
      }),
    );
  }
}
```

### Interceptor de cache

```typescript
// shared/interceptors/cache.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, any>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    
    // Solo cachear GET requests
    if (method !== 'GET') {
      return next.handle();
    }

    const cacheKey = url;
    const cachedResponse = this.cache.get(cacheKey);

    if (cachedResponse) {
      console.log(`Cache hit for ${cacheKey}`);
      return of(cachedResponse);
    }

    return next.handle().pipe(
      tap(response => {
        this.cache.set(cacheKey, response);
        // Limpiar cache después de 5 minutos
        setTimeout(() => {
          this.cache.delete(cacheKey);
        }, 5 * 60 * 1000);
      }),
    );
  }
}
```

---

## 🔧 Pipes: Los traductores universales {#pipes}

Los **Pipes** son como traductores universales. Transforman y validan los datos que llegan antes de que lleguen a tu código.

### Pipe de validación personalizado

```typescript
// shared/pipes/parse-positive-int.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    
    if (isNaN(val)) {
      throw new BadRequestException(`${metadata.data} debe ser un número`);
    }
    
    if (val <= 0) {
      throw new BadRequestException(`${metadata.data} debe ser un número positivo`);
    }
    
    return val;
  }
}
```

### Pipe de validación global

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar ValidationPipe globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // Remover propiedades no definidas en DTO
      forbidNonWhitelisted: true, // Lanzar error si hay propiedades extra
      transform: true,          // Transformar automáticamente tipos
      disableErrorMessages: process.env.NODE_ENV === 'production',
      transformOptions: {
        enableImplicitConversion: true, // Conversión automática de tipos
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

### Usar pipes en parámetros

```typescript
@Controller('users')
export class UsersController {
  
  @Get(':id')
  async findOne(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Query('include', new DefaultValuePipe('profile')) include: string,
  ) {
    return this.usersService.findOne(id, { include });
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // El ValidationPipe automáticamente valida createUserDto
    return this.usersService.create(createUserDto);
  }
}
```

---

## 🆘 Manejo de errores: El departamento de atención al cliente {#manejo-errores}

El **manejo de errores** es como tu departamento de atención al cliente. Cuando algo sale mal, da una respuesta clara y útil.

### Filtro de excepciones global

```typescript
// shared/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception.stack,
      }),
    };

    // Log del error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }

  private getStatus(exception: any): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: any): string | object {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return typeof response === 'string' ? response : response;
    }
    return 'Error interno del servidor';
  }
}
```

### Excepciones personalizadas

```typescript
// shared/exceptions/user-not-found.exception.ts
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(identifier: string | number) {
    super(`Usuario con identificador "${identifier}" no encontrado`);
  }
}

// shared/exceptions/business.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, details?: any) {
    super(
      {
        message,
        error: 'Business Logic Error',
        details,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
```

### Aplicar filtros globalmente

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Aplicar filtro globalmente
  app.useGlobalFilters(new HttpExceptionFilter());
  
  await app.listen(3000);
}
bootstrap();
```

---

## 🧪 Testing: Los inspectores de calidad {#testing}

El **testing** es como tener inspectores de calidad en tu fábrica. Se aseguran de que todo funcione perfectamente antes de entregar el producto.

### Testing unitario de servicios

```typescript
// users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserNotFoundException } from '../shared/exceptions/user-not-found.exception';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  // Mock del repositorio
  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('debería retornar un usuario cuando existe', async () => {
      // Arrange
      const userId = 1;
      const expectedUser = {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        role: 'user',
      };

      mockRepository.findOne.mockResolvedValue(expectedUser);

      // Act
      const result = await service.findOne(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        select: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
      });
    });

    it('debería lanzar UserNotFoundException cuando el usuario no existe', async () => {
      // Arrange
      const userId = 999;
      mockRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(userId)).rejects.toThrow(UserNotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        select: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
      });
    });
  });

  describe('create', () => {
    it('debería crear un usuario exitosamente', async () => {
      // Arrange
      const createUserDto = {
        name: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        password: 'password123',
        role: 'user',
      };

      const createdUser = {
        id: 1,
        ...createUserDto,
        password: 'hashedPassword',
        createdAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(null); // Email no existe
      mockRepository.create.mockReturnValue(createdUser);
      mockRepository.save.mockResolvedValue(createdUser);

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(result).toEqual(expect.objectContaining({
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@ejemplo.com',
      }));
      expect(result.password).toBeUndefined(); // Password should be removed
    });
  });
});
```

### Testing de controladores

```typescript
// users/users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('debería retornar una lista de usuarios', async () => {
      // Arrange
      const expectedResult = {
        users: [
          { id: 1, name: 'Juan', email: 'juan@ejemplo.com' },
          { id: 2, name: 'María', email: 'maria@ejemplo.com' },
        ],
        pagination: { page: 1, limit: 10, total: 2, pages: 1 },
      };

      mockUsersService.findAll.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findAll({ page: 1, limit: 10 });

      // Assert
      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });
});
```

### Testing de integración (E2E)

```typescript
// test/users.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/modules/users/entities/user.entity';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let userRepository: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get(getRepositoryToken(User));
    
    await app.init();
  });

  afterEach(async () => {
    await userRepository.clear();
    await app.close();
  });

  describe('/users (GET)', () => {
    it('debería retornar una lista vacía inicialmente', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect({
          users: [],
          pagination: { page: 1, limit: 10, total: 0, pages: 0 },
        });
    });
  });

  describe('/users (POST)', () => {
    it('debería crear un nuevo usuario', () => {
      const createUserDto = {
        name: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe(createUserDto.name);
          expect(res.body.email).toBe(createUserDto.email);
          expect(res.body.password).toBeUndefined();
        });
    });

    it('debería rechazar datos inválidos', () => {
      const invalidUserDto = {
        name: '', // Nombre vacío
        email: 'email-invalido', // Email inválido
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(invalidUserDto)
        .expect(400);
    });
  });
});
```

---

## 📚 Proyecto práctico: Construyendo una librería digital {#proyecto-practico}

Vamos a construir una **API para una librería digital** que permita gestionar libros, autores y préstamos.

### Estructura del proyecto

```
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── authors/
│   ├── books/
│   └── loans/
├── shared/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
└── config/
```

### Entidades principales

```typescript
// modules/books/entities/book.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Author } from '../../authors/entities/author.entity';
import { Loan } from '../../loans/entities/loan.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ unique: true, length: 13 })
  isbn: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  publishedYear: number;

  @Column({ default: 1 })
  totalCopies: number;

  @Column({ default: 1 })
  availableCopies: number;

  @ManyToOne(() => Author, author => author.books)
  author: Author;

  @OneToMany(() => Loan, loan => loan.book)
  loans: Loan[];

  @CreateDateColumn()
  createdAt: Date;
}
```

### Servicio completo con lógica de negocio

```typescript
// modules/books/books.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto, UpdateBookDto, SearchBooksDto } from './dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async findAll(searchDto: SearchBooksDto) {
    const { page = 1, limit = 10, search, authorId, minYear, maxYear } = searchDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author');

    // Filtros de búsqueda
    if (search) {
      queryBuilder.where(
        'book.title ILIKE :search OR book.isbn ILIKE :search OR author.name ILIKE :search',
        { search: `%${search}%` }
      );
    }

    if (authorId) {
      queryBuilder.andWhere('book.author.id = :authorId', { authorId });
    }

    if (minYear) {
      queryBuilder.andWhere('book.publishedYear >= :minYear', { minYear });
    }

    if (maxYear) {
      queryBuilder.andWhere('book.publishedYear <= :maxYear', { maxYear });
    }

    const [books, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('book.createdAt', 'DESC')
      .getManyAndCount();

    return {
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findAvailable(searchDto: SearchBooksDto) {
    const result = await this.findAll(searchDto);
    result.books = result.books.filter(book => book.availableCopies > 0);
    return result;
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    // Verificar que el ISBN no exista
    const existingBook = await this.booksRepository.findOne({
      where: { isbn: createBookDto.isbn },
    });

    if (existingBook) {
      throw new BadRequestException('Ya existe un libro con este ISBN');
    }

    const book = this.booksRepository.create({
      ...createBookDto,
      availableCopies: createBookDto.totalCopies,
    });

    return this.booksRepository.save(book);
  }

  async loanBook(bookId: number): Promise<Book> {
    const book = await this.findOne(bookId);

    if (book.availableCopies <= 0) {
      throw new BadRequestException('No hay copias disponibles de este libro');
    }

    book.availableCopies -= 1;
    return this.booksRepository.save(book);
  }

  async returnBook(bookId: number): Promise<Book> {
    const book = await this.findOne(bookId);

    if (book.availableCopies >= book.totalCopies) {
      throw new BadRequestException('Todas las copias ya están disponibles');
    }

    book.availableCopies += 1;
    return this.booksRepository.save(book);
  }
}
```

### Controlador con documentación OpenAPI

```typescript
// modules/books/books.controller.ts
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto, SearchBooksDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('books')
@Controller('books')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los libros' })
  @ApiResponse({ status: 200, description: 'Lista de libros obtenida exitosamente' })
  async findAll(@Query() searchDto: SearchBooksDto) {
    return this.booksService.findAll(searchDto);
  }

  @Get('available')
  @ApiOperation({ summary: 'Obtener libros disponibles' })
  async findAvailable(@Query() searchDto: SearchBooksDto) {
    return this.booksService.findAvailable(searchDto);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN)
  @ApiOperation({ summary: 'Crear nuevo libro' })
  @ApiResponse({ status: 201, description: 'Libro creado exitosamente' })
  async create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Post(':id/loan')
  @ApiOperation({ summary: 'Prestar un libro' })
  async loanBook(@Param('id') id: number) {
    return this.booksService.loanBook(id);
  }

  @Post(':id/return')
  @ApiOperation({ summary: 'Devolver un libro' })
  async returnBook(@Param('id') id: number) {
    return this.booksService.returnBook(id);
  }
}
```

---

## 🏆 Mejores prácticas: Las reglas de oro {#mejores-practicas}

### 1. **Estructura de archivos consistente**

```
modules/
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   └── index.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── guards/
│   │   └── user-ownership.guard.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── users.service.spec.ts
```

### 2. **Configuración por ambientes**

```typescript
// config/database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: process.env.DB_TYPE || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nestjs_app',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
}));
```

### 3. **Validación robusta con class-validator**

```typescript
// shared/dto/pagination.dto.ts
import { IsOptional, IsPositive, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: 'La página debe ser un número positivo' })
  page?: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: 'El límite mínimo es 1' })
  @Max(100, { message: 'El límite máximo es 100' })
  limit?: number = 10;
}
```

### 4. **Logging estructurado**

```typescript
// shared/services/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }
}
```

### 5. **Documentación automática**

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Librería Digital API')
    .setDescription('API para gestión de librería digital')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticación y autorización')
    .addTag('users', 'Gestión de usuarios')
    .addTag('books', 'Gestión de libros')
    .addTag('loans', 'Gestión de préstamos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(`🚀 Aplicación corriendo en: http://localhost:3000`);
  console.log(`📚 Documentación disponible en: http://localhost:3000/api/docs`);
}
bootstrap();
```

### 6. **Scripts útiles en package.json**

```json
{
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:generate": "npm run typeorm -- migration:generate src/migrations/Migration -d src/config/typeorm.config.ts",
    "migration:run": "npm run typeorm -- migration:run -d src/config/typeorm.config.ts",
    "migration:revert": "npm run typeorm -- migration:revert -d src/config/typeorm.config.ts"
  }
}
```

## 🎯 Conclusión

Has completado la masterclass de NestJS. Ahora tienes las herramientas para:

✅ **Crear aplicaciones escalables** con arquitectura limpia
✅ **Implementar autenticación y autorización** robusta
✅ **Manejar errores** de forma profesional
✅ **Escribir tests** que garanticen calidad
✅ **Documentar APIs** automáticamente
✅ **Seguir mejores prácticas** de la industria

### 🚀 Próximos pasos

1. **Practica** creando tu propia API
2. **Explora** módulos avanzados como GraphQL, WebSockets
3. **Integra** con servicios externos (Redis, MongoDB, etc.)
4. **Despliega** en producción con Docker y CI/CD

**¡Felicidades! Ya eres un desarrollador NestJS. 🎉**