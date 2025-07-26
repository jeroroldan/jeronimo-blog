---
title: 'Comandos Laravel'
description: 'Guía Completa de Comandos Laravel'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía Completa de Comandos Laravel

## 🚀 Comandos de Proyecto

### Crear nuevo proyecto

```bash
# Usando Composer
composer create-project laravel/laravel nombre-proyecto

# Usando Laravel Installer
laravel new nombre-proyecto

# Con versión específica
composer create-project laravel/laravel nombre-proyecto "9.*"
```

### Servidor de desarrollo

```bash
php artisan serve
php artisan serve --host=0.0.0.0 --port=8080
```

## 📁 Controladores

### Crear controladores

```bash
# Controlador básico
php artisan make:controller UserController

# Controlador con métodos CRUD
php artisan make:controller UserController --resource

# Controlador API (sin create/edit)
php artisan make:controller UserController --api

# Controlador con modelo
php artisan make:controller UserController --model=User

# Controlador invocable (single action)
php artisan make:controller ShowProfile --invokable

# En subdirectorio
php artisan make:controller Admin/UserController
```

## 🗄️ Modelos

### Crear modelos

```bash
# Modelo básico
php artisan make:model User

# Modelo con migración
php artisan make:model User -m

# Modelo completo (migración, factory, seeder, controller)
php artisan make:model User -mfsc

# Modelo con todo + requests
php artisan make:model User -a

# Opciones individuales
php artisan make:model User --migration
php artisan make:model User --factory
php artisan make:model User --seeder
php artisan make:model User --controller
php artisan make:model User --resource
```

## 🔄 Migraciones

### Crear migraciones

```bash
# Crear tabla
php artisan make:migration create_users_table

# Modificar tabla existente
php artisan make:migration add_email_to_users_table --table=users

# Renombrar tabla
php artisan make:migration rename_users_to_customers_table
```

### Ejecutar migraciones

```bash
# Ejecutar migraciones pendientes
php artisan migrate

# Ejecutar con confirmación en producción
php artisan migrate --force

# Ver estado de migraciones
php artisan migrate:status

# Rollback última migración
php artisan migrate:rollback

# Rollback específico número de pasos
php artisan migrate:rollback --step=3

# Reset todas las migraciones
php artisan migrate:reset

# Fresh (drop + migrate)
php artisan migrate:fresh

# Fresh con seeders
php artisan migrate:fresh --seed
```

## 🌱 Seeders y Factories

### Seeders

```bash
# Crear seeder
php artisan make:seeder UserSeeder

# Ejecutar seeders
php artisan db:seed

# Ejecutar seeder específico
php artisan db:seed --class=UserSeeder
```

### Factories

```bash
# Crear factory
php artisan make:factory UserFactory

# Factory para modelo específico
php artisan make:factory UserFactory --model=User
```

## 🛡️ Middleware

### Crear middleware

```bash
# Middleware básico
php artisan make:middleware CheckAge

# Registrar en Kernel.php después de crear
```

## 📮 Requests

### Form Requests

```bash
# Request de validación
php artisan make:request StoreUserRequest

# Request con autorización
php artisan make:request UpdateUserRequest
```

## 🎯 Recursos (Resources)

### API Resources

```bash
# Resource individual
php artisan make:resource UserResource

# Resource collection
php artisan make:resource UserCollection

# Resource con colección incluida
php artisan make:resource User --collection
```

## 🔧 Servicios y Providers

### Service Providers

```bash
# Service provider
php artisan make:provider PaymentServiceProvider

# Registrar en config/app.php después de crear
```

### Servicios personalizados

```bash
# No hay comando específico, crear manualmente en app/Services/
mkdir app/Services
# Luego crear clases PHP manualmente
```

## 📧 Mail y Notifications

### Mail

```bash
# Mailable class
php artisan make:mail WelcomeEmail

# Con markdown template
php artisan make:mail WelcomeEmail --markdown=emails.welcome
```

### Notifications

```bash
# Notification class
php artisan make:notification InvoicePaid

# Con markdown template
php artisan make:notification InvoicePaid --markdown=mail.notification
```

## 📋 Jobs y Queues

### Jobs

```bash
# Job class
php artisan make:job ProcessPayment

# Job sincrónico
php artisan make:job ProcessPayment --sync
```

### Queue

```bash
# Trabajar colas
php artisan queue:work

# Con timeout específico
php artisan queue:work --timeout=60

# Procesar solo una cola
php artisan queue:work --queue=high,default

# Reiniciar workers
php artisan queue:restart

# Ver trabajos fallidos
php artisan queue:failed

# Reintentar trabajo fallido
php artisan queue:retry 1

# Limpiar trabajos fallidos
php artisan queue:flush
```

## 🗃️ Cache

### Comandos de cache

```bash
# Limpiar cache de aplicación
php artisan cache:clear

# Limpiar cache de configuración
php artisan config:clear

# Cache de configuración
php artisan config:cache

# Limpiar cache de rutas
php artisan route:clear

# Cache de rutas
php artisan route:cache

# Limpiar cache de vistas
php artisan view:clear

# Cache de vistas
php artisan view:cache

# Optimizar aplicación (cache config, routes, views)
php artisan optimize

# Limpiar todas las optimizaciones
php artisan optimize:clear
```

## 🛠️ Comandos Personalizados

### Crear comandos Artisan

```bash
# Comando personalizado
php artisan make:command SendEmails

# Con signature específica
php artisan make:command SendEmails --command=email:send
```

## 🔐 Autenticación

### Auth scaffolding

```bash
# UI básica (requiere laravel/ui)
composer require laravel/ui
php artisan ui vue --auth
php artisan ui react --auth
php artisan ui bootstrap --auth

# Breeze (más moderno)
composer require laravel/breeze
php artisan breeze:install

# Fortify (backend only)
composer require laravel/fortify
php artisan vendor:publish --provider="Laravel\Fortify\FortifyServiceProvider"
```

## 🏗️ Otros Comandos Útiles

### Información y debugging

```bash
# Información del framework
php artisan --version

# Listar todas las rutas
php artisan route:list

# Información de rutas específicas
php artisan route:list --name=user

# Limpiar logs
php artisan log:clear

# Generar key de aplicación
php artisan key:generate

# Crear storage link
php artisan storage:link

# Información de la aplicación
php artisan about

# Verificar configuración
php artisan config:show database

# Tinker (REPL)
php artisan tinker
```

### Maintenance

```bash
# Modo mantenimiento
php artisan down

# Salir del modo mantenimiento
php artisan up

# Modo mantenimiento con mensaje personalizado
php artisan down --message="Actualizando sistema" --retry=60
```

### Testing

```bash
# Crear test
php artisan make:test UserTest

# Test unitario
php artisan make:test UserTest --unit

# Ejecutar tests
php artisan test

# Con coverage
php artisan test --coverage
```

## 🗂️ Estructura de Archivos Generados

```
app/
├── Console/Commands/          # Comandos personalizados
├── Http/
│   ├── Controllers/          # Controladores
│   ├── Middleware/           # Middleware
│   └── Requests/             # Form Requests
├── Mail/                     # Mailables
├── Models/                   # Modelos Eloquent
├── Notifications/            # Notificaciones
├── Providers/                # Service Providers
└── Services/                 # Servicios (manual)

database/
├── factories/                # Model Factories
├── migrations/               # Migraciones
└── seeders/                  # Seeders

resources/
├── views/                    # Vistas Blade
└── js/                       # Assets JS

tests/
├── Feature/                  # Tests de funcionalidad
└── Unit/                     # Tests unitarios
```

## 💡 Tips y Mejores Prácticas

### Combinaciones útiles

```bash
# Crear modelo completo para API
php artisan make:model Product -a

# Crear controlador con requests
php artisan make:controller ProductController -r
php artisan make:request StoreProductRequest
php artisan make:request UpdateProductRequest

# Reset completo de base de datos
php artisan migrate:fresh --seed

# Optimización para producción
php artisan optimize
php artisan view:cache
php artisan route:cache
php artisan config:cache
```

### Flags comunes

- `-m, --migration`: Crear migración
- `-f, --factory`: Crear factory
- `-s, --seeder`: Crear seeder
- `-c, --controller`: Crear controlador
- `-r, --resource`: Controlador con métodos CRUD
- `-a, --all`: Crear todo (modelo, migración, factory, seeder, controlador)
- `--api`: Para APIs (sin create/edit)
- `--force`: Forzar en producción

¡Con esta guía tienes todo lo necesario para desarrollar eficientemente en Laravel! 🚀
