---
title: 'Nomenclatura en Laravel'
description: 'Guía Completa de Nomenclatura en Laravel'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía Completa de Nomenclatura en Laravel

## Tabla de Contenidos

1. [Modelos (Models)](#modelos-models)
2. [Controladores (Controllers)](#controladores-controllers)
3. [Rutas (Routes)](#rutas-routes)
4. [Migraciones (Migrations)](#migraciones-migrations)
5. [Variables y Propiedades](#variables-y-propiedades)
6. [Métodos y Funciones](#métodos-y-funciones)
7. [Constantes](#constantes)
8. [Middleware](#middleware)
9. [Requests](#requests-form-requests)
10. [Jobs/Events/Listeners](#jobseventslisteners)
11. [Configuración](#configuración-y-variables-de-entorno)
12. [Blade Templates](#blade-templates)
13. [Relaciones en Modelos](#relaciones-en-modelos)
14. [Malas Prácticas a Evitar](#malas-prácticas-a-evitar)

---

## Modelos (Models)

### Convención

- **Formato:** Singular, PascalCase
- **Ubicación:** `app/Models/`

### Ejemplos Correctos ✅

```php
User.php
Post.php
OrderItem.php
CategoryProduct.php
BlogPost.php
```

### Ejemplos Incorrectos ❌

```php
Users.php          // Plural
user.php           // minúsculas
order_item.php     // snake_case
```

### Dentro del Modelo

```php
class User extends Model 
{
    protected $table = 'users';        // Tabla en plural
    protected $fillable = ['name'];    // snake_case
    protected $hidden = ['password'];  // snake_case
  
    // Accessor: get + PascalCase + Attribute
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
  
    // Mutator: set + PascalCase + Attribute
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }
}
```

---

## Controladores (Controllers)

### Convención

- **Formato:** Singular + "Controller", PascalCase
- **Ubicación:** `app/Http/Controllers/`

### Ejemplos Correctos ✅

```php
UserController.php
PostController.php
OrderItemController.php
AdminUserController.php
```

### Ejemplos Incorrectos ❌

```php
UsersController.php     // Plural
userController.php      // camelCase
User_Controller.php     // snake_case
```

### Métodos de Controlador

```php
class UserController extends Controller
{
    public function index() {}          // Listar recursos
    public function create() {}         // Mostrar formulario de creación
    public function store(Request $request) {}      // Guardar nuevo recurso
    public function show(User $user) {}             // Mostrar recurso específico
    public function edit(User $user) {}             // Mostrar formulario de edición
    public function update(Request $request, User $user) {} // Actualizar recurso
    public function destroy(User $user) {}          // Eliminar recurso
  
    // Métodos personalizados en camelCase
    public function showProfile() {}
    public function updatePassword() {}
    public function sendWelcomeEmail() {}
}
```

---

## Rutas (Routes)

### URLs: kebab-case

```php
// ✅ Correcto
Route::get('/user-profile', [UserController::class, 'showProfile']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/blog-posts', [PostController::class, 'index']);
Route::get('/admin/user-management', [AdminController::class, 'users']);

// ❌ Incorrecto
Route::get('/userProfile', [UserController::class, 'showProfile']);
Route::get('/user_profile', [UserController::class, 'showProfile']);
Route::get('/UserProfile', [UserController::class, 'showProfile']);
```

### Nombres de Rutas: snake_case con puntos

```php
// ✅ Correcto
Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
Route::post('/users', [UserController::class, 'store'])->name('users.store');
Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

// Rutas anidadas
Route::get('/admin/users', [AdminController::class, 'users'])->name('admin.users.index');
Route::get('/user/profile/settings', [UserController::class, 'settings'])->name('user.profile.settings');

// ❌ Incorrecto
->name('usersIndex')
->name('users-index')
->name('Users.Index')
```

### Resource Routes

```php
// ✅ Correcto - Laravel genera automáticamente las rutas con nombres correctos
Route::resource('users', UserController::class);
Route::resource('blog-posts', BlogPostController::class);

// Para rutas anidadas
Route::resource('users.posts', UserPostController::class);
```

---

## Migraciones (Migrations)

### Convención

- **Formato:** snake_case describiendo la acción
- **Timestamp automático**

### Ejemplos Correctos ✅

```php
2024_01_15_000001_create_users_table.php
2024_01_15_000002_add_email_verified_at_to_users_table.php
2024_01_15_000003_create_password_resets_table.php
2024_01_15_000004_drop_old_posts_table.php
2024_01_15_000005_add_foreign_key_to_posts_table.php
2024_01_15_000006_rename_category_id_to_category_uuid_in_posts_table.php
```

### Ejemplos Incorrectos ❌

```php
CreateUsersTable.php
addEmailToUsers.php
create-users-table.php
Add_Email_To_Users.php
```

### Comandos Artisan para Migraciones

```bash
# Crear tabla
php artisan make:migration create_users_table

# Agregar columna
php artisan make:migration add_email_to_users_table --table=users

# Crear tabla con modelo
php artisan make:model Post -m
```

### Dentro de las Migraciones

```php
// ✅ Correcto
Schema::create('users', function (Blueprint $table) {
    $table->id();                          // Primary key
    $table->string('first_name');          // snake_case para columnas
    $table->string('last_name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->rememberToken();
    $table->timestamps();                  // created_at, updated_at
});

// Tabla de relación many-to-many (orden alfabético)
Schema::create('category_post', function (Blueprint $table) {
    $table->id();
    $table->foreignId('category_id')->constrained();
    $table->foreignId('post_id')->constrained();
    $table->timestamps();
});

// ❌ Incorrecto
Schema::create('User', function (Blueprint $table) {        // PascalCase
    $table->string('firstName');        // camelCase
    $table->string('LastName');         // PascalCase
    $table->string('Email');            // PascalCase
});
```

---

## Variables y Propiedades

### Convención: camelCase

### Variables ✅

```php
$userName = 'john_doe';
$isAuthenticated = true;
$userPreferences = [];
$totalOrderAmount = 150.50;
$currentDateTime = now();
$maxLoginAttempts = 3;
```

### Variables ❌

```php
$user_name = 'john_doe';        // snake_case
$UserName = 'john_doe';         // PascalCase
$Is_Authenticated = true;       // mixed case
$user-name = 'john_doe';        // kebab-case
```

### Propiedades de Clase

```php
class User extends Model
{
    // ✅ Correcto
    protected $fillable = ['name', 'email'];
    protected $hidden = ['password', 'remember_token'];
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];
  
    // ❌ Incorrecto
    protected $Fillable = ['name', 'email'];       // PascalCase
    protected $primary_key = 'user_id';            // snake_case para propiedades
}
```

---

## Métodos y Funciones

### Convención: camelCase, descriptivos

### Ejemplos Correctos ✅

```php
// Métodos generales
public function getUserById($id) {}
public function calculateTotalPrice() {}
public function sendWelcomeEmail() {}
public function processPayment() {}

// Métodos booleanos (prefijos: is, has, can, should)
public function isUserActive() {}
public function hasPermission($permission) {}
public function canEditPost(Post $post) {}
public function shouldSendNotification() {}

// Getters/Setters
public function getFullName() {}
public function setUserRole($role) {}

// Métodos de validación
public function validateEmail($email) {}
public function validatePasswordStrength($password) {}
```

### Ejemplos Incorrectos ❌

```php
public function get_user_by_id($id) {}      // snake_case
public function GetUserById($id) {}         // PascalCase
public function calc() {}                   // Muy corto
public function doStuff() {}                // No descriptivo
public function process() {}                // Muy genérico
public function func1() {}                  // No descriptivo
```

### Parámetros de Métodos

```php
// ✅ Correcto
public function createUser(string $firstName, string $lastName, string $email) {}
public function updateUserProfile(User $user, array $profileData) {}
public function sendEmailToUser(User $user, string $subject, string $content) {}

// ❌ Incorrecto
public function createUser($fn, $ln, $e) {}                    // Abreviaciones
public function updateUserProfile($u, $data) {}               // No descriptivo
public function sendEmailToUser($user, $s, $c) {}             // Abreviaciones
```

---

## Constantes

### Convención: UPPER_SNAKE_CASE

### Ejemplos Correctos ✅

```php
// En clases
class UserService
{
    const MAX_LOGIN_ATTEMPTS = 3;
    const DEFAULT_CURRENCY = 'USD';
    const EMAIL_VERIFICATION_TIMEOUT = 3600;
    const PASSWORD_MIN_LENGTH = 8;
    const CACHE_TTL = 300;
}

// En archivos de configuración
const API_VERSION = 'v1';
const DEFAULT_LOCALE = 'es';
const SESSION_LIFETIME = 120;
```

### Ejemplos Incorrectos ❌

```php
const maxLoginAttempts = 3;         // camelCase
const Max_Login_Attempts = 3;       // mixed case
const default-currency = 'USD';     // kebab-case
const DefaultCurrency = 'USD';      // PascalCase
```

---

## Middleware

### Convención: PascalCase + "Middleware"

### Ejemplos Correctos ✅

```php
AuthenticateMiddleware.php
CheckUserRoleMiddleware.php
ThrottleRequestsMiddleware.php
VerifyEmailMiddleware.php
CorsMiddleware.php
```

### Registro en Kernel.php

```php
protected $middlewareAliases = [
    'auth' => \App\Http\Middleware\AuthenticateMiddleware::class,
    'role' => \App\Http\Middleware\CheckUserRoleMiddleware::class,
    'verified' => \App\Http\Middleware\VerifyEmailMiddleware::class,
];
```

### Uso en Rutas

```php
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
});
```

---

## Requests (Form Requests)

### Convención: Descriptivo + "Request"

### Ejemplos Correctos ✅

```php
StoreUserRequest.php
UpdateUserRequest.php
LoginRequest.php
RegistrationRequest.php
ChangePasswordRequest.php
CreatePostRequest.php
UpdatePostRequest.php
ContactFormRequest.php
```

### Ejemplos Incorrectos ❌

```php
UserRequest.php              // Muy genérico
User_Store_Request.php       // snake_case
userRequest.php              // camelCase
RequestUser.php              // Orden incorrecto
```

### Dentro del Request

```php
class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Este email ya está registrado.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
        ];
    }
}
```

---

## Jobs/Events/Listeners

### Jobs ✅

```php
SendWelcomeEmail.php
ProcessPayment.php
GenerateInvoice.php
ResizeImage.php
SendNotification.php
BackupDatabase.php
```

### Events ✅

```php
UserRegistered.php
OrderPlaced.php
PaymentProcessed.php
PostCreated.php
UserLoggedIn.php
InventoryUpdated.php
```

### Listeners ✅

```php
SendWelcomeEmailNotification.php
UpdateInventoryQuantity.php
LogUserActivity.php
SendOrderConfirmation.php
CreateUserProfile.php
```

### Event Service Provider

```php
protected $listen = [
    UserRegistered::class => [
        SendWelcomeEmailNotification::class,
        CreateUserProfile::class,
    ],
    OrderPlaced::class => [
        SendOrderConfirmation::class,
        UpdateInventoryQuantity::class,
    ],
];
```

---

## Configuración y Variables de Entorno

### Variables de Entorno (.env): UPPER_SNAKE_CASE

```bash
# ✅ Correcto
APP_NAME="Mi Aplicación Laravel"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=hello@example.com
MAIL_FROM_NAME="${APP_NAME}"

# Variables personalizadas
CUSTOM_API_KEY=abc123
PAYMENT_GATEWAY_URL=https://api.payment.com
CACHE_DURATION=3600
```

### Variables Incorrectas ❌

```bash
appName="Mi Aplicación"         # camelCase
db-connection=mysql             # kebab-case
Mail_From_Address=test@test.com # mixed case
```

### Archivos de Configuración: snake_case

```php
// ✅ Correcto
config/app.php
config/database.php
config/mail.php
config/custom_settings.php
config/payment_gateway.php

// Acceso a configuración
config('app.name')
config('database.default')
config('mail.from.address')
config('custom_settings.api_timeout')
```

---

## Blade Templates

### Convención: kebab-case

### Ejemplos Correctos ✅

```php
// Vistas principales
resources/views/home.blade.php
resources/views/about.blade.php
resources/views/contact.blade.php

// Vistas con múltiples palabras
resources/views/user-profile.blade.php
resources/views/password-reset.blade.php
resources/views/email-verification.blade.php

// Vistas organizadas en carpetas
resources/views/auth/login.blade.php
resources/views/auth/register.blade.php
resources/views/admin/user-list.blade.php
resources/views/admin/dashboard.blade.php
resources/views/emails/welcome-email.blade.php
resources/views/errors/404.blade.php

// Layouts y componentes
resources/views/layouts/app.blade.php
resources/views/layouts/admin.blade.php
resources/views/components/alert.blade.php
resources/views/components/navigation-menu.blade.php
```

### Ejemplos Incorrectos ❌

```php
resources/views/userProfile.blade.php      // camelCase
resources/views/user_profile.blade.php     // snake_case
resources/views/UserProfile.blade.php      // PascalCase
resources/views/User-Profile.blade.php     // mixed case
```

### Variables en Blade: camelCase

```blade
{{-- ✅ Correcto --}}
@extends('layouts.app')

@section('content')
    <h1>{{ $pageTitle }}</h1>
    <p>{{ $userMessage }}</p>
  
    @if($isUserAuthenticated)
        <p>Bienvenido, {{ $currentUser->name }}!</p>
    @endif
  
    @foreach($blogPosts as $post)
        <article>
            <h2>{{ $post->title }}</h2>
            <p>{{ $post->excerpt }}</p>
        </article>
    @endforeach
@endsection

{{-- ❌ Incorrecto --}}
<h1>{{ $page_title }}</h1>        {{-- snake_case --}}
<p>{{ $PageTitle }}</p>            {{-- PascalCase --}}
```

---

## Relaciones en Modelos

### Convenciones Según Tipo de Relación

```php
class User extends Model
{
    // ✅ hasOne - singular
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
  
    // ✅ hasMany - plural
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
  
    // ✅ belongsTo - singular
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
  
    // ✅ belongsToMany - plural
    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }
  
    // ✅ hasManyThrough - plural
    public function postComments()
    {
        return $this->hasManyThrough(Comment::class, Post::class);
    }
}

class Post extends Model
{
    // ✅ belongsTo - singular
    public function user()
    {
        return $this->belongsTo(User::class);
    }
  
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
  
    // ✅ hasMany - plural
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
  
    // ✅ belongsToMany - plural
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
```

### Ejemplos Incorrectos ❌

```php
// ❌ hasMany debería ser plural
public function post()
{
    return $this->hasMany(Post::class);
}

// ❌ belongsTo debería ser singular
public function users()
{
    return $this->belongsTo(User::class);
}

// ❌ belongsToMany debería ser plural
public function category()
{
    return $this->belongsToMany(Category::class);
}
```

### Tablas Pivot: Orden Alfabético

```php
// ✅ Correcto - orden alfabético
category_post    // category viene antes que post
post_tag        // post viene antes que tag
role_user       // role viene antes que user

// ❌ Incorrecto
post_category   // debería ser category_post
tag_post        // debería ser post_tag
user_role       // debería ser role_user
```

---

## Malas Prácticas a Evitar

### ❌ Nomenclatura Incorrecta

```php
// Modelos
class users extends Model {}           // Plural y minúsculas
class USER extends Model {}            // Mayúsculas

// Controladores
class usersController {}               // Plural
class User_controller {}               // snake_case

// Variables
$User_Name = 'John';                   // mixed case
$user-name = 'John';                   // kebab-case en variables
$UN = 'John';                          // Abreviaciones sin sentido

// Métodos
public function get_user() {}          // snake_case
public function GetUser() {}           // PascalCase
public function u() {}                 // Muy corto
public function processData() {}       // Muy genérico

// Constantes
const maxUsers = 100;                  // camelCase
const Max_Users = 100;                 // mixed case

// Rutas
Route::get('/userProfile');            // camelCase
Route::get('/user_profile');           // snake_case

// Archivos Blade
user_profile.blade.php                 // snake_case
UserProfile.blade.php                  // PascalCase
```

### ❌ Inconsistencias Comunes

```php
// Mezclando convenciones en el mismo proyecto
class UserController extends Controller
{
    public function show_profile() {}      // snake_case
    public function updatePassword() {}    // camelCase - inconsistente
}

// Variables inconsistentes
$userName = 'John';
$user_email = 'john@email.com';        // Inconsistente con $userName

// Rutas inconsistentes
Route::get('/user-profile');           // kebab-case
Route::get('/userSettings');           // camelCase - inconsistente
```

---

## Comandos Artisan Útiles

### Generar Archivos con Nomenclatura Correcta

```bash
# Modelo con migración
php artisan make:model User -m

# Controlador de recursos
php artisan make:controller UserController --resource

# Request
php artisan make:request StoreUserRequest

# Middleware
php artisan make:middleware CheckUserRole

# Job
php artisan make:job SendWelcomeEmail

# Event
php artisan make:event UserRegistered

# Listener
php artisan make:listener SendWelcomeEmailNotification

# Migration
php artisan make:migration create_users_table
php artisan make:migration add_email_to_users_table --table=users
```

---

## Resumen de Convenciones


| Elemento            | Convención                       | Ejemplo                  |
| ------------------- | --------------------------------- | ------------------------ |
| **Modelos**         | Singular, PascalCase              | `User`, `BlogPost`       |
| **Controladores**   | Singular + Controller, PascalCase | `UserController`         |
| **Métodos**        | camelCase                         | `showProfile()`          |
| **Variables**       | camelCase                         | `$userName`              |
| **Constantes**      | UPPER_SNAKE_CASE                  | `MAX_LOGIN_ATTEMPTS`     |
| **Rutas (URL)**     | kebab-case                        | `/user-profile`          |
| **Rutas (nombres)** | snake_case con puntos             | `users.show`             |
| **Migraciones**     | snake_case descriptivo            | `create_users_table`     |
| **Blade**           | kebab-case                        | `user-profile.blade.php` |
| **Middleware**      | PascalCase + Middleware           | `AuthMiddleware`         |
| **Requests**        | Descriptivo + Request             | `StoreUserRequest`       |
| **Jobs/Events**     | PascalCase descriptivo            | `SendWelcomeEmail`       |
| **Config**          | snake_case                        | `custom_settings.php`    |
| **Env Variables**   | UPPER_SNAKE_CASE                  | `DB_CONNECTION`          |

---

## Consejos Finales

1. **Consistencia es clave**: Mantén la misma convención en todo el proyecto
2. **Usa nombres descriptivos**: Evita abreviaciones confusas
3. **Sigue las convenciones de Laravel**: Facilita el mantenimiento
4. **Usa herramientas**: IDE con plugins de Laravel para autocompletado
5. **Revisa el código**: Implementa code review para mantener estándares
6. **Documenta excepciones**: Si debes romper una convención, documenta por qué

Seguir estas convenciones hará que tu código sea más legible, mantenible y profesional, facilitando la colaboración en equipo y el mantenimiento a largo plazo.
