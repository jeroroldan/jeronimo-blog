---
title: 'Guía Completa de Comandos NestJS CLI'
code: 'nestjs'
description: 'Guía Completa de Comandos NestJS CLI'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Guía Completa de Comandos NestJS CLI

## Instalación del CLI

```bash
# Instalación global
npm install -g @nestjs/cli

# Verificar versión
nest --version
```

## Comandos de Proyecto

### `nest new` - Crear nuevo proyecto
```bash
# Crear nuevo proyecto
nest new nombre-proyecto

# Con opciones específicas
nest new mi-app --package-manager npm
nest new mi-app --package-manager yarn
nest new mi-app --package-manager pnpm
nest new mi-app --strict          # TypeScript strict mode
nest new mi-app --skip-git        # No inicializar git
nest new mi-app --skip-install    # No instalar dependencias
```

### `nest build` - Compilar aplicación
```bash
# Compilación básica
nest build

# Compilación con opciones
nest build --watch               # Modo watch
nest build --webpack             # Usar webpack
nest build --path tsconfig.build.json  # Especificar tsconfig
```

### `nest start` - Ejecutar aplicación
```bash
# Ejecutar en modo desarrollo
nest start

# Con opciones
nest start --watch              # Modo watch (desarrollo)
nest start --debug              # Modo debug
nest start --debug 0.0.0.0:9229 # Debug con host específico
nest start --webpack            # Usar webpack
nest start --path dist/main     # Especificar path del archivo principal
```

## Comandos de Generación (`nest generate` o `nest g`)

### Componentes Principales

```bash
# Aplicación
nest g app nombre-app
nest g application nombre-app

# Biblioteca/Library
nest g lib nombre-lib
nest g library nombre-lib

# Sub-aplicación
nest g sub-app nombre-sub-app
```

### Controladores
```bash
# Controlador básico
nest g controller usuarios
nest g co usuarios               # Forma abreviada

# Con opciones
nest g controller usuarios --no-spec        # Sin archivo de test
nest g controller usuarios --flat           # Sin crear carpeta
nest g controller usuarios --dry-run        # Simular sin crear
nest g controller auth/usuarios             # En subdirectorio
```

### Servicios
```bash
# Servicio básico
nest g service usuarios
nest g s usuarios                # Forma abreviada

# Con opciones
nest g service usuarios --no-spec
nest g service usuarios --flat
nest g service auth/usuarios
```

### Módulos
```bash
# Módulo básico
nest g module usuarios
nest g mo usuarios               # Forma abreviada

# Con opciones
nest g module usuarios --no-spec
nest g module usuarios --flat
nest g module auth/usuarios
```

### Recursos Completos
```bash
# Recurso completo (controller + service + module + DTO + entities)
nest g resource usuarios
nest g res usuarios              # Forma abreviada

# Opciones de API
nest g resource usuarios --type rest        # API REST
nest g resource usuarios --type graphql-code-first  # GraphQL Code First
nest g resource usuarios --type graphql-schema-first # GraphQL Schema First
nest g resource usuarios --type microservice # Microservicio
nest g resource usuarios --type ws          # WebSocket

# Sin archivos de test
nest g resource usuarios --no-spec
```

### Middleware
```bash
# Middleware
nest g middleware auth
nest g mi auth                   # Forma abreviada

# Con opciones
nest g middleware auth --no-spec
nest g middleware auth --flat
```

### Interceptores
```bash
# Interceptor
nest g interceptor logging
nest g in logging                # Forma abreviada

# Con opciones
nest g interceptor logging --no-spec
nest g interceptor logging --flat
```

### Guards
```bash
# Guard
nest g guard auth
nest g gu auth                   # Forma abreviada

# Con opciones
nest g guard auth --no-spec
nest g guard auth --flat
```

### Pipes
```bash
# Pipe
nest g pipe validation
nest g pi validation             # Forma abreviada

# Con opciones
nest g pipe validation --no-spec
nest g pipe validation --flat
```

### Decoradores
```bash
# Decorador
nest g decorator roles
nest g d roles                   # Forma abreviada

# Con opciones
nest g decorator roles --no-spec
nest g decorator roles --flat
```

### Filtros de Excepción
```bash
# Filtro
nest g filter http-exception
nest g f http-exception          # Forma abreviada

# Con opciones
nest g filter http-exception --no-spec
nest g filter http-exception --flat
```

### Proveedores y Clases
```bash
# Proveedor
nest g provider database
nest g pr database               # Forma abreviada

# Clase
nest g class dto/create-user
nest g cl dto/create-user        # Forma abreviada

# Interface
nest g interface interfaces/user
nest g itf interfaces/user       # Forma abreviada
```

### Gateway (WebSockets)
```bash
# Gateway
nest g gateway events
nest g ga events                 # Forma abreviada

# Con opciones
nest g gateway events --no-spec
nest g gateway events --flat
```

### Resolver (GraphQL)
```bash
# Resolver
nest g resolver usuarios
nest g r usuarios                # Forma abreviada

# Con opciones
nest g resolver usuarios --no-spec
nest g resolver usuarios --flat
```

## Comandos de Información

### `nest info` - Información del sistema
```bash
# Mostrar información del entorno
nest info
nest i                          # Forma abreviada
```

### `nest --help` - Ayuda
```bash
# Ayuda general
nest --help
nest -h

# Ayuda de comando específico
nest generate --help
nest build --help
nest start --help
```

## Opciones Globales Comunes

### Opciones de Generación
```bash
--dry-run, -d          # Simular sin crear archivos
--project, -p          # Especificar proyecto en monorepo
--flat                 # No crear carpeta contenedora
--no-spec              # No generar archivos de test (.spec.ts)
--spec-file-suffix     # Sufijo para archivos de test (default: spec)
--skip-import          # No importar en módulo padre
--collection, -c       # Usar colección de esquemas específica
```

### Opciones de Construcción y Ejecución
```bash
--watch, -w           # Modo watch para recarga automática
--webpack             # Usar webpack en lugar de tsc
--path                # Especificar path personalizado
--config              # Especificar archivo de configuración
--preserveWatchOutput # Mantener output en modo watch
```

## Ejemplos Prácticos Completos

### Crear aplicación completa con autenticación
```bash
# 1. Crear proyecto
nest new mi-app

# 2. Generar módulos principales
nest g module auth
nest g module users
nest g module products

# 3. Generar recursos completos
nest g resource auth --no-spec
nest g resource users --no-spec
nest g resource products --no-spec

# 4. Generar guards y middleware
nest g guard auth/jwt-auth --no-spec
nest g middleware auth/logger --no-spec

# 5. Generar pipes y decoradores
nest g pipe common/validation --no-spec
nest g decorator auth/roles --no-spec
```

### Trabajar con monorepo
```bash
# Crear aplicación principal
nest new monorepo-app

# Generar sub-aplicaciones
nest g app admin-api
nest g app user-api

# Generar librerías compartidas
nest g lib shared
nest g lib database

# Generar recursos en aplicación específica
nest g resource users --project admin-api
```

### Comandos para desarrollo con GraphQL
```bash
# Crear aplicación GraphQL
nest new graphql-app

# Generar recursos GraphQL
nest g resource users --type graphql-code-first
nest g resource posts --type graphql-schema-first

# Generar resolvers adicionales
nest g resolver user-profile --no-spec
```

## Consejos y Mejores Prácticas

1. **Usa formas abreviadas** para comandos frecuentes:
   - `nest g co` en lugar de `nest generate controller`
   - `nest g s` en lugar de `nest generate service`

2. **Siempre usa `--dry-run`** primero para ver qué archivos se crearán

3. **Organiza tu código** usando subdirectorios:
   - `nest g controller auth/login`
   - `nest g service users/profile`

4. **Usa `--no-spec`** si no escribes tests inmediatamente

5. **Para proyectos grandes**, considera usar el comando `resource` que genera todo lo necesario de una vez

## Configuración Personalizada

### nest-cli.json
```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "webpack": true,
    "tsConfigPath": "tsconfig.build.json"
  },
  "generateOptions": {
    "spec": false,
    "flat": true
  }
}
```

Esta configuración personaliza el comportamiento por defecto del CLI para tu proyecto específico.