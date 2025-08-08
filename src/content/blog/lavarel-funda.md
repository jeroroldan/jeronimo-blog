---
title: 'Conceptos Arquitectónicos de Laravel'
code: "laravarel"
description: 'Resumen Completo - Conceptos Arquitectónicos de Laravel'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Resumen Completo - Conceptos Arquitectónicos de Laravel

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Estructura de Directorios](#2-estructura-de-directorios)
3. [Ciclo de Vida de Requests](#3-ciclo-de-vida-de-requests)
4. [Arquitectura MVC](#4-arquitectura-mvc)
5. [Service Container](#5-service-container)
6. [Service Providers](#6-service-providers)
7. [Facades](#7-facades)
8. [Contracts (Interfaces)](#8-contracts-interfaces)
9. [Routing](#9-routing)
10. [Middleware](#10-middleware)
11. [Eloquent ORM](#11-eloquent-orm)
12. [Blade Template Engine](#12-blade-template-engine)
13. [Dependency Injection](#13-dependency-injection)
14. [Patrones Arquitectónicos Avanzados](#14-patrones-arquitectónicos-avanzados)
15. [Mejores Prácticas](#15-mejores-prácticas)

---

## 1. Introducción

Laravel es un framework PHP que sigue el patrón arquitectónico Model-View-Controller (MVC), separando la aplicación en tres componentes principales: Models, Views y Controllers. Esta separación mejora la organización del código, promueve la reutilización y facilita el mantenimiento.

### Principios Fundamentales de Laravel

- **Separación de responsabilidades**: Cada componente tiene un propósito específico
- **Reutilización de código**: Los componentes pueden ser reutilizados en diferentes partes
- **Mantenibilidad**: El código está organizado de forma que facilita las modificaciones
- **Escalabilidad**: La arquitectura permite que la aplicación crezca eficientemente
- **Testabilidad**: Los componentes pueden ser probados de forma aislada

---

## 2. Estructura de Directorios

Laravel tiene una estructura de directorios por defecto que proporciona un excelente punto de partida tanto para aplicaciones grandes como pequeñas.

### Directorios Principales

#### `/app` - Código Central de la Aplicación

```
app/
├── Broadcasting/      # Clases de canales de broadcast
├── Console/          # Comandos Artisan personalizados
├── Events/           # Clases de eventos
├── Exceptions/       # Excepciones personalizadas
├── Http/
│   ├── Controllers/  # Controladores
│   ├── Middleware/   # Middleware personalizado
│   └── Requests/     # Form Requests
├── Jobs/             # Jobs de cola
├── Listeners/        # Listeners de eventos
├── Mail/             # Clases de correo
├── Models/           # Modelos Eloquent
├── Notifications/    # Notificaciones
├── Policies/         # Políticas de autorización
├── Providers/        # Service Providers
└── Rules/            # Reglas de validación personalizadas
```

#### Otros Directorios Importantes

- **`/bootstrap`**: Contiene el archivo app.php que arranca el framework
- **`/config`**: Archivos de configuración
- **`/database`**: Migraciones, factories y seeders
- **`/public`**: Punto de entrada (index.php) y assets públicos
- **`/resources`**: Views, assets sin compilar, archivos de idioma
- **`/routes`**: Definición de rutas de la aplicación
- **`/storage`**: Logs, cache, sesiones y archivos compilados
- **`/tests`**: Tests automatizados

---

## 3. Ciclo de Vida de Requests

El punto de entrada para todas las requests a una aplicación Laravel es el archivo public/index.php. Todas las requests son dirigidas a este archivo por la configuración del servidor web.

### Flujo de una Request

#### 1. Punto de Entrada

```php
// public/index.php
<?php
// Carga el autoloader de Composer
require __DIR__.'/../vendor/autoload.php';

// Arranca la aplicación Laravel
$app = require_once __DIR__.'/../bootstrap/app.php';

// Maneja la request HTTP
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);
```

#### 2. Bootstrap de la Aplicación

- Se carga el autoloader de Composer
- Se obtiene una instancia de la aplicación Laravel desde `bootstrap/app.php`
- Se configura el manejo de errores, logging y environment

#### 3. HTTP Kernel

El HTTP kernel actúa como el punto central de la aplicación. Antes de que la request sea procesada, el Kernel la maneja a través de Middleware.

#### 4. Service Providers

Los Service Providers son responsables de arrancar todos los componentes diversos del framework. Todos los service providers tienen un método boot y register.

#### 5. Routing

Una vez que el middleware ha procesado la request, Laravel determina la ruta apropiada comparando la URL con las rutas definidas en routes/web.php o routes/api.php.

#### 6. Middleware

El middleware proporciona un mecanismo conveniente para filtrar o examinar las requests HTTP que ingresan a tu aplicación.

#### 7. Controller Action

La request se pasa al controlador, que procesa los datos de la request, interactúa con los modelos y prepara una respuesta.

#### 8. Response

La respuesta renderizada se pasa de vuelta a través de las capas de middleware y finalmente se devuelve al HTTP kernel.

---

## 4. Arquitectura MVC

Laravel está construido sobre el patrón de diseño Model-View-Controller (MVC), que separa la aplicación en tres componentes interconectados: Models, Views y Controllers.

### 4.1 Model (Modelo)

El Model representa los datos y la lógica de negocio de una aplicación. En Laravel, el Model es responsable de interactuar con la base de datos y encapsular las operaciones relacionadas con datos.

#### Características de los Models

- Representan entidades de la base de datos
- Manejan la lógica de negocio
- Definen relaciones entre entidades
- Validan datos
- Realizan operaciones CRUD

#### Ejemplo de Model

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    protected $fillable = [
        'title', 'content', 'author_id', 'published_at'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_published' => 'boolean'
    ];

    // Relación: Un post pertenece a un usuario
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    // Relación: Un post tiene muchos comentarios
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // Lógica de negocio
    public function publish(): void
    {
        $this->update([
            'is_published' => true,
            'published_at' => now()
        ]);
    }

    // Accessor
    public function getExcerptAttribute(): string
    {
        return Str::limit($this->content, 150);
    }
}
```

### 4.2 View (Vista)

La View representa la interfaz de usuario (UI) de la aplicación. Es responsable de presentar datos al usuario y recibir input del usuario. En Laravel, las Views típicamente se escriben usando el motor de plantillas Blade.

#### Características de las Views

- Manejan la presentación de datos
- Contienen HTML, CSS y JavaScript
- Usan el motor de plantillas Blade
- Son reutilizables y modulares
- Separan la lógica de presentación

#### Ejemplo de View (Blade)

```blade
{{-- resources/views/posts/show.blade.php --}}
@extends('layouts.app')

@section('title', $post->title)

@section('content')
<article class="post">
    <header>
        <h1>{{ $post->title }}</h1>
        <div class="meta">
            <span>Por {{ $post->author->name }}</span>
            <time>{{ $post->published_at->format('d/m/Y') }}</time>
        </div>
    </header>

    <div class="content">
        {!! nl2br(e($post->content)) !!}
    </div>

    <section class="comments">
        <h3>Comentarios ({{ $post->comments->count() }})</h3>
    
        @forelse($post->comments as $comment)
            <div class="comment">
                <strong>{{ $comment->author->name }}</strong>
                <p>{{ $comment->content }}</p>
                <small>{{ $comment->created_at->diffForHumans() }}</small>
            </div>
        @empty
            <p>No hay comentarios todavía.</p>
        @endforelse
    </section>
</article>
@endsection
```

### 4.3 Controller (Controlador)

Los Controllers manejan la interacción del usuario y orquestan el flujo de datos entre el Model y la View.

#### Responsabilidades del Controller

- Recibir y procesar requests HTTP
- Validar datos de entrada
- Interactuar con Models
- Preparar datos para las Views
- Retornar responses

#### Ejemplo de Controller

```php
<?php
namespace App\Http\Controllers;

use App\Models\Post;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class PostController extends Controller
{
    public function index(): View
    {
        $posts = Post::with('author')
            ->where('is_published', true)
            ->latest('published_at')
            ->paginate(10);

        return view('posts.index', compact('posts'));
    }

    public function show(Post $post): View
    {
        $post->load(['author', 'comments.author']);
    
        return view('posts.show', compact('post'));
    }

    public function create(): View
    {
        return view('posts.create');
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'author_id' => auth()->id(),
        ]);

        return redirect()
            ->route('posts.show', $post)
            ->with('success', 'Post creado exitosamente');
    }

    public function edit(Post $post): View
    {
        $this->authorize('update', $post);
    
        return view('posts.edit', compact('post'));
    }

    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $this->authorize('update', $post);
    
        $post->update($request->validated());

        return redirect()
            ->route('posts.show', $post)
            ->with('success', 'Post actualizado exitosamente');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $this->authorize('delete', $post);
    
        $post->delete();

        return redirect()
            ->route('posts.index')
            ->with('success', 'Post eliminado exitosamente');
    }
}
```

### 4.4 Flujo MVC en Laravel

El routing juega un papel fundamental en la arquitectura de Laravel. Las rutas definen cómo las requests entrantes deben ser manejadas.

#### Ejemplo Completo del Flujo

```php
// 1. RUTA (routes/web.php)
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');

// 2. CONTROLLER
class PostController extends Controller
{
    public function show(Post $post): View
    {
        // Interactúa con el MODEL
        $post->load(['author', 'comments']);
    
        // Pasa datos a la VIEW
        return view('posts.show', compact('post'));
    }
}

// 3. MODEL (interacciones automáticas via Eloquent)
class Post extends Model
{
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

// 4. VIEW (resources/views/posts/show.blade.php)
@extends('layouts.app')
@section('content')
    <h1>{{ $post->title }}</h1>
    <p>{{ $post->content }}</p>
@endsection
```

---

## 5. Service Container

El Service Container de Laravel es una herramienta poderosa para manejar las dependencias de clases y realizar inyección de dependencias.

### 5.1 ¿Qué es el Service Container?

El Service Container en Laravel es una herramienta poderosa para manejar las dependencias de clases y realizar inyección de dependencias. Esto significa que si una clase depende de algo más, esa dependencia se inyecta en tiempo de ejecución.

#### Características Principales

- **Dependency Injection**: Resuelve automáticamente las dependencias
- **Binding**: Registra clases y interfaces en el contenedor
- **Singleton**: Permite crear instancias únicas
- **Automatic Resolution**: Resuelve clases automáticamente via reflection

### 5.2 Binding Básico

#### Simple Binding

```php
// En un Service Provider
$this->app->bind('App\Services\PaymentService', function ($app) {
    return new PaymentService($app->make('App\Services\LoggerService'));
});

// Resolución
$paymentService = app('App\Services\PaymentService');
// O usando el helper
$paymentService = resolve('App\Services\PaymentService');
```

#### Singleton Binding

```php
$this->app->singleton('App\Services\ConfigService', function ($app) {
    return new ConfigService(config('app.settings'));
});
```

#### Interface Binding

```php
$this->app->bind(
    'App\Contracts\PaymentGateway',
    'App\Services\StripePaymentGateway'
);
```

### 5.3 Resolución Automática

Laravel puede resolver automáticamente las dependencias usando type-hints en los constructores.

```php
class OrderController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService,
        protected NotificationService $notificationService
    ) {}

    public function store(StoreOrderRequest $request)
    {
        $order = Order::create($request->validated());
    
        $this->paymentService->processPayment($order);
        $this->notificationService->sendConfirmation($order);
    
        return redirect()->route('orders.show', $order);
    }
}
```

### 5.4 Contextual Binding

A veces puedes tener dos clases que utilizan la misma interface, pero deseas inyectar diferentes implementaciones en cada clase.

```php
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\VideoController;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Storage;

$this->app->when(PhotoController::class)
    ->needs(Filesystem::class)
    ->give(function () {
        return Storage::disk('photos');
    });

$this->app->when(VideoController::class)
    ->needs(Filesystem::class)
    ->give(function () {
        return Storage::disk('videos');
    });
```

---

## 6. Service Providers

Los Service Providers son el lugar central de todo el arranque de la aplicación Laravel. Tu propia aplicación, así como todos los servicios principales de Laravel, se arrancan a través de Service Providers.

### 6.1 ¿Qué son los Service Providers?

Los Service Providers son el lugar central donde se configuran todas las aplicaciones Laravel. Se encargan de registrar cosas, incluyendo enlaces del service container, event listeners, middleware e incluso rutas.

#### Responsabilidades

- Registrar servicios en el Service Container
- Configurar la aplicación
- Arrancar servicios cuando la aplicación inicia
- Registrar event listeners y middleware
- Definir rutas

### 6.2 Estructura de un Service Provider

```php
<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\PaymentService;
use App\Services\NotificationService;
use App\Contracts\PaymentGateway;
use App\Services\StripePaymentGateway;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Solo registrar bindings aquí
        $this->app->bind(PaymentGateway::class, StripePaymentGateway::class);
    
        $this->app->singleton(PaymentService::class, function ($app) {
            return new PaymentService(
                $app->make(PaymentGateway::class),
                config('services.payment.webhook_secret')
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Arrancar servicios, event listeners, etc.
        View::composer('layouts.app', function ($view) {
            $view->with('notifications', auth()->user()?->unreadNotifications);
        });

        // Configurar validaciones personalizadas
        Validator::extend('phone', function ($attribute, $value, $parameters, $validator) {
            return preg_match('/^[0-9\-\(\)\+\s]+$/', $value);
        });
    }
}
```

### 6.3 Registro de Service Providers

Todos los Service Providers se registran en el archivo de configuración bootstrap/providers.php.

```php
// bootstrap/providers.php
<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\AuthServiceProvider::class,
    App\Providers\EventServiceProvider::class,
    App\Providers\RouteServiceProvider::class,
  
    // Custom providers
    App\Providers\PaymentServiceProvider::class,
    App\Providers\NotificationServiceProvider::class,
];
```

### 6.4 Deferred Providers

Si tu provider solo registra bindings en el service container, puedes diferir su registro hasta que uno de los bindings registrados sea realmente necesario.

```php
<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Support\DeferrableProvider;

class RiakServiceProvider extends ServiceProvider implements DeferrableProvider
{
    public function register(): void
    {
        $this->app->singleton('Riak\Connection', function ($app) {
            return new Connection(config('riak'));
        });
    }

    public function provides(): array
    {
        return ['Riak\Connection'];
    }
}
```

---

## 7. Facades

Las Facades proporcionan una interfaz "estática" a las clases que están disponibles en el service container de la aplicación. Laravel incluye muchas facades que proporcionan acceso a casi todas las características de Laravel.

### 7.1 ¿Qué son las Facades?

Las facades de Laravel sirven como "proxies estáticos" a las clases subyacentes en el service container, proporcionando el beneficio de una sintaxis concisa y expresiva mientras mantienen más testabilidad y flexibilidad que los métodos estáticos tradicionales.

#### Características

- Interfaz estática a servicios del container
- Sintaxis limpia y expresiva
- Mantenibles y testeable
- Fáciles de usar sin inyección de dependencias

### 7.2 Facades Incorporadas

```php
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

// Ejemplos de uso
Cache::put('key', 'value', 3600);
$users = DB::table('users')->where('active', 1)->get();
Mail::to($user)->send(new WelcomeMail());
Queue::push(new ProcessPayment($order));
Storage::disk('s3')->put('file.txt', $contents);
```

### 7.3 Crear Facades Personalizadas

#### 1. Crear el Servicio

```php
<?php
namespace App\Services;

class PaymentService
{
    public function __construct(
        protected PaymentGateway $gateway,
        protected string $webhookSecret
    ) {}

    public function charge(int $amount, string $token): PaymentResult
    {
        return $this->gateway->charge($amount, $token);
    }

    public function refund(string $chargeId, int $amount = null): RefundResult
    {
        return $this->gateway->refund($chargeId, $amount);
    }
}
```

#### 2. Crear la Facade

```php
<?php
namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class Payment extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'payment.service';
    }
}
```

#### 3. Registrar en Service Provider

```php
public function register(): void
{
    $this->app->singleton('payment.service', function ($app) {
        return new PaymentService(
            $app->make(PaymentGateway::class),
            config('services.payment.webhook_secret')
        );
    });
}
```

#### 4. Usar la Facade

```php
use App\Facades\Payment;

// En un controlador
class PaymentController extends Controller
{
    public function charge(Request $request)
    {
        $result = Payment::charge(
            $request->amount,
            $request->payment_token
        );
    
        if ($result->successful()) {
            return response()->json(['success' => true]);
        }
    
        return response()->json(['error' => $result->message()], 400);
    }
}
```

### 7.4 Real-Time Facades

Usando real-time facades, puedes tratar cualquier clase en tu aplicación como si fuera una facade.

```php
// En lugar de inyección de dependencias
class OrderController extends Controller
{
    public function __construct(protected PaymentService $paymentService) {}
}

// Puedes usar Real-Time Facades
use Facades\App\Services\PaymentService;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $result = PaymentService::charge($request->amount, $request->token);
    
        // ...
    }
}
```

---

## 8. Contracts (Interfaces)

Los "contracts" de Laravel son un conjunto de interfaces que definen los servicios principales proporcionados por el framework.

### 8.1 ¿Qué son los Contracts?

Los Contracts son interfaces PHP que definen los métodos que deben implementar los servicios de Laravel. Proporcionan una forma de definir APIs claras y testeable.

#### Ventajas de usar Contracts

- **Bajo acoplamiento**: Dependes de la interface, no de implementaciones concretas
- **Testabilidad**: Fácil de mockear para tests
- **Flexibilidad**: Puedes cambiar implementaciones sin afectar el código cliente
- **Claridad**: Las interfaces definen claramente qué métodos están disponibles

### 8.2 Contracts vs Facades

Las facades y funciones helper de Laravel proporcionan una forma simple de utilizar los servicios de Laravel sin necesidad de hacer type-hint y resolver contracts fuera del service container.

#### Usando Facades

```php
use Illuminate\Support\Facades\Cache;

class UserRepository
{
    public function findById(int $id): ?User
    {
        return Cache::remember("user.{$id}", 3600, function () use ($id) {
            return User::find($id);
        });
    }
}
```

#### Usando Contracts

```php
use Illuminate\Contracts\Cache\Repository as Cache;

class UserRepository
{
    public function __construct(protected Cache $cache) {}

    public function findById(int $id): ?User
    {
        return $this->cache->remember("user.{$id}", 3600, function () use ($id) {
            return User::find($id);
        });
    }
}
```

### 8.3 Contracts Principales

#### Cache Contract

```php
use Illuminate\Contracts\Cache\Repository as Cache;

class ProductService
{
    public function __construct(protected Cache $cache) {}

    public function getFeatured(): Collection
    {
        return $this->cache->remember('products.featured', 3600, function () {
            return Product::where('featured', true)->get();
        });
    }
}
```

#### Filesystem Contract

```php
use Illuminate\Contracts\Filesystem\Filesystem;

class DocumentService
{
    public function __construct(protected Filesystem $filesystem) {}

    public function store(UploadedFile $file): string
    {
        $path = 'documents/' . Str::uuid() . '.' . $file->extension();
    
        $this->filesystem->putFileAs('', $file, $path);
    
        return $path;
    }
}
```

#### Mail Contract

```php
use Illuminate\Contracts\Mail\Mailer;

class NotificationService
{
    public function __construct(protected Mailer $mailer) {}

    public function sendWelcome(User $user): void
    {
        $this->mailer->to($user->email)->send(new WelcomeMail($user));
    }
}
```

### 8.4 Crear Contracts Personalizados

#### 1. Definir el Contract

```php
<?php
namespace App\Contracts;

interface PaymentGateway
{
    public function charge(int $amount, string $token): PaymentResult;
    public function refund(string $chargeId, int $amount = null): RefundResult;
    public function createCustomer(array $data): Customer;
    public function updateCustomer(string $customerId, array $data): Customer;
}
```

#### 2. Implementar el Contract

```php
<?php
namespace App\Services;

use App\Contracts\PaymentGateway;

class StripePaymentGateway implements PaymentGateway
{
    public function __construct(protected string $secretKey) {}

    public function charge(int $amount, string $token): PaymentResult
    {
        // Implementación de Stripe
        $charge = \Stripe\Charge::create([
            'amount' => $amount,
            'currency' => 'usd',
            'source' => $token,
        ]);

        return new PaymentResult($charge);
    }

    public function refund(string $chargeId, int $amount = null): RefundResult
    {
        // Implementación del refund
    }

    // ... otros métodos
}
```

#### 3. Registrar en Service Provider

```php
public function register(): void
{
    $this->app->bind(PaymentGateway::class, function ($app) {
        return new StripePaymentGateway(config('services.stripe.secret'));
    });
}
```

---

## 9. Routing

El routing juega un papel fundamental en la arquitectura de Laravel. Las rutas definen cómo las requests entrantes deben ser manejadas.

### 9.1 Conceptos Básicos de Routing

#### Definición de Rutas Básicas

```php
// routes/web.php
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;

// Rutas básicas
Route::get('/', function () {
    return view('welcome');
});

Route::get('/about', function () {
    return view('about');
});

// Rutas con controladores
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');

// Rutas con parámetros
Route::get('/users/{user}/posts/{post}', function (User $user, Post $post) {
    return view('posts.show', compact('user', 'post'));
});

// Rutas con constraints
Route::get('/posts/{id}', [PostController::class, 'show'])->where('id', '[0-9]+');
Route::get('/users/{name}', [UserController::class, 'show'])->where('name', '[A-Za-z]+');
```

### 9.2 Resource Routes

El concepto de Resource proviene de la arquitectura REST que posiciona un recurso en el núcleo de una API. Laravel tiene una representación abreviada que simplifica la definición de rutas.

```php
// Una sola línea que crea 7 rutas
Route::resource('posts', PostController::class);

// Equivale a:
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
Route::put('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');

// Resource routes anidadas
Route::resource('posts.comments', CommentController::class);

// Resource routes limitadas
Route::resource('posts', PostController::class)->only(['index', 'show']);
Route::resource('posts', PostController::class)->except(['create', 'store']);
```

### 9.3 Route Groups

```php
// Agrupamiento por middleware
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::resource('posts', PostController::class);
});

// Agrupamiento por prefijo
Route::prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::resource('users', AdminUserController::class);
});

// Agrupamiento por subdomain
Route::domain('api.example.com')->group(function () {
    Route::get('/users', [ApiController::class, 'users']);
});

// Agrupamiento combinado
Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::resource('users', AdminUserController::class);
    });
```

### 9.4 Route Model Binding

#### Implicit Binding

```php
// Route
Route::get('/posts/{post}', [PostController::class, 'show']);

// Controller
class PostController extends Controller
{
    public function show(Post $post)  // Laravel automáticamente resuelve el modelo
    {
        return view('posts.show', compact('post'));
    }
}

// Binding personalizado
Route::get('/posts/{post:slug}', [PostController::class, 'show']);
```

#### Explicit Binding

```php
// En RouteServiceProvider
public function boot(): void
{
    Route::model('user', User::class);
  
    // O con lógica personalizada
    Route::bind('user', function ($value) {
        return User::where('name', $value)->firstOrFail();
    });
}
```

### 9.5 Route Caching

```bash
# Optimizar rutas para producción
php artisan route:cache

# Limpiar cache de rutas
php artisan route:clear

# Ver todas las rutas
php artisan route:list
```

---

## 10. Middleware

El middleware proporciona un mecanismo conveniente para filtrar o examinar las requests HTTP que ingresan a tu aplicación. A través del middleware, puedes inspeccionar y tomar acción antes y/o después de que una request específica sea manejada y procesada por Laravel.

### 10.1 ¿Qué es el Middleware?

El middleware actúa como una capa intermedia entre la request HTTP y la aplicación. Permite:

- Autenticación y autorización
- Logging de requests
- Validación de datos
- Transformación de respuestas
- Rate limiting
- CORS handling

### 10.2 Tipos de Middleware

#### Global Middleware

Se ejecuta en todas las requests HTTP.

```php
// app/Http/Kernel.php
protected $middleware = [
    \App\Http\Middleware\TrustProxies::class,
    \App\Http\Middleware\PreventRequestsDuringMaintenance::class,
    \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
    \App\Http\Middleware\TrimStrings::class,
    \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
];
```

#### Route Middleware

Se asigna a rutas específicas.

```php
// app/Http/Kernel.php
protected $middlewareAliases = [
    'auth' => \App\Http\Middleware\Authenticate::class,
    'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
    'role' => \App\Http\Middleware\CheckRole::class,
    'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
];
```

### 10.3 Crear Middleware Personalizado

```bash
php artisan make:middleware CheckRole
```

```php
<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): mixed
    {
        if (!$request->user()) {
            return redirect('/login');
        }

        if (!$request->user()->hasRole($role)) {
            abort(403, 'No tienes permisos para acceder a esta página');
        }

        return $next($request);
    }
}
```

### 10.4 Usar Middleware

#### En Rutas

```php
// Middleware simple
Route::get('/admin', [AdminController::class, 'index'])->middleware('auth');

// Múltiples middleware
Route::get('/admin', [AdminController::class, 'index'])
    ->middleware(['auth', 'role:admin']);

// Middleware con parámetros
Route::get('/admin/users', [UserController::class, 'index'])
    ->middleware('role:admin,super-admin');

// En grupos
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::resource('/admin/users', UserController::class);
});
```

#### En Controladores

```php
class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:admin')->only(['destroy']);
        $this->middleware('throttle:60,1')->except(['index']);
    }
}
```

### 10.5 Middleware Avanzado

#### Before y After Middleware

```php
class LogRequests
{
    public function handle(Request $request, Closure $next): mixed
    {
        // Before middleware - se ejecuta antes de la request
        Log::info('Request iniciada', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'ip' => $request->ip(),
        ]);

        $response = $next($request);

        // After middleware - se ejecuta después de la response
        Log::info('Request completada', [
            'status' => $response->getStatusCode(),
            'time' => microtime(true) - LARAVEL_START,
        ]);

        return $response;
    }
}
```

#### Terminable Middleware

```php
class TerminableMiddleware
{
    public function handle(Request $request, Closure $next): mixed
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        // Se ejecuta después de que la respuesta se envía al navegador
        Log::info('Response enviada al cliente');
    
        // Tareas pesadas que no afectan la respuesta
        $this->processAnalytics($request, $response);
    }
}
```

---

## 11. Eloquent ORM

Laravel incluye Eloquent, su ORM (Object-Relational Mapper). Eloquent proporciona una implementación ActiveRecord hermosa y simple para trabajar con tu base de datos.

### 11.1 ¿Qué es Eloquent?

Cada tabla de base de datos tiene un "Model" correspondiente que se usa para interactuar con esa tabla. Las relaciones son sencillas de manejar, y soporta características avanzadas como eager loading, que ayuda a resolver el problema de consultas N+1.

#### Características Principales

- ActiveRecord pattern
- Relaciones elegantes
- Query Builder integrado
- Soft deletes
- Mutators y Accessors
- Model Events
- Eager Loading

### 11.2 Modelos Básicos

#### Definición de un Model

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'posts';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'title',
        'content',
        'excerpt',
        'author_id',
        'category_id',
        'published_at',
        'featured_image'
    ];

    protected $hidden = [
        'deleted_at'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_published' => 'boolean',
        'metadata' => 'array'
    ];

    protected $dates = [
        'published_at',
        'deleted_at'
    ];
}
```

### 11.3 Operaciones CRUD

#### Create

```php
// Método create
$post = Post::create([
    'title' => 'Mi primer post',
    'content' => 'Contenido del post...',
    'author_id' => 1
]);

// New + Save
$post = new Post();
$post->title = 'Mi primer post';
$post->content = 'Contenido del post...';
$post->author_id = 1;
$post->save();

// Mass insert
Post::insert([
    ['title' => 'Post 1', 'content' => 'Contenido 1', 'author_id' => 1],
    ['title' => 'Post 2', 'content' => 'Contenido 2', 'author_id' => 1],
]);
```

#### Read

```php
// Buscar por ID
$post = Post::find(1);
$post = Post::findOrFail(1);  // Lanza excepción si no existe

// Buscar por atributos
$post = Post::where('title', 'Mi post')->first();
$posts = Post::where('author_id', 1)->get();

// Buscar múltiples IDs
$posts = Post::find([1, 2, 3]);

// Obtener todos
$posts = Post::all();

// Con condiciones
$publishedPosts = Post::where('published_at', '<=', now())
    ->where('is_published', true)
    ->orderBy('published_at', 'desc')
    ->get();
```

#### Update

```php
// Update por ID
$post = Post::find(1);
$post->update(['title' => 'Título actualizado']);

// Update con save
$post = Post::find(1);
$post->title = 'Nuevo título';
$post->save();

// Mass update
Post::where('author_id', 1)->update(['status' => 'published']);

// Update or Create
Post::updateOrCreate(
    ['slug' => 'mi-post'],
    ['title' => 'Mi Post', 'content' => 'Contenido...']
);
```

#### Delete

```php
// Delete por instancia
$post = Post::find(1);
$post->delete();

// Delete por ID
Post::destroy(1);
Post::destroy([1, 2, 3]);

// Delete con condiciones
Post::where('published_at', '<', now()->subYear())->delete();

// Soft delete (si está habilitado)
$post->delete();  // Soft delete
$post->forceDelete();  // Hard delete
$post->restore();  // Restaurar
```

### 11.4 Relaciones Eloquent

#### One to One

```php
class User extends Model
{
    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }
}

class Profile extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

// Uso
$user = User::find(1);
$profile = $user->profile;

$profile = Profile::find(1);
$user = $profile->user;
```

#### One to Many

```php
class User extends Model
{
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'author_id');
    }
}

class Post extends Model
{
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}

// Uso
$user = User::find(1);
$posts = $user->posts;

$latestPosts = $user->posts()
    ->where('published_at', '>=', now()->subWeek())
    ->latest()
    ->take(5)
    ->get();
```

#### Many to Many

```php
class Post extends Model
{
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)
            ->withPivot(['created_at', 'created_by'])
            ->withTimestamps();
    }
}

class Tag extends Model
{
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class)
            ->withPivot(['created_at', 'created_by']);
    }
}

// Uso
$post = Post::find(1);
$tags = $post->tags;

// Attach/Detach
$post->tags()->attach([1, 2, 3]);
$post->tags()->detach([1]);
$post->tags()->sync([1, 2, 4]);  // Solo mantendrá estas tags
```

#### Has Many Through

```php
class Country extends Model
{
    public function posts(): HasManyThrough
    {
        return $this->hasManyThrough(Post::class, User::class);
    }
}

// country -> users -> posts
$country = Country::find(1);
$posts = $country->posts;
```

### 11.5 Eager Loading

```php
// N+1 Problem (malo)
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name;  // 1 + N queries
}

// Eager Loading (bueno)
$posts = Post::with('author')->get();
foreach ($posts as $post) {
    echo $post->author->name;  // Solo 2 queries
}

// Múltiples relaciones
$posts = Post::with(['author', 'category', 'tags'])->get();

// Relaciones anidadas
$posts = Post::with(['author.profile', 'comments.author'])->get();

// Eager loading condicional
$posts = Post::with(['author' => function ($query) {
    $query->select('id', 'name', 'email');
}])->get();
```

### 11.6 Accessors y Mutators

#### Accessors

```php
class User extends Model
{
    // Accessor
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    // Accessor con cast
    protected $casts = [
        'preferences' => 'array'
    ];

    public function getPreferenceAttribute(string $key): mixed
    {
        return $this->preferences[$key] ?? null;
    }
}

// Uso
$user = User::find(1);
echo $user->full_name;  // Usa el accessor
```

#### Mutators

```php
class User extends Model
{
    // Mutator
    public function setPasswordAttribute(string $value): void
    {
        $this->attributes['password'] = bcrypt($value);
    }

    public function setEmailAttribute(string $value): void
    {
        $this->attributes['email'] = strtolower($value);
    }
}

// Uso
$user = new User();
$user->password = 'plain-password';  // Se encripta automáticamente
$user->email = 'USER@EMAIL.COM';    // Se convierte a minúsculas
$user->save();
```

### 11.7 Scopes

#### Local Scopes

```php
class Post extends Model
{
    public function scopePublished($query)
    {
        return $query->where('published_at', '<=', now())
                    ->where('is_published', true);
    }

    public function scopeByAuthor($query, $authorId)
    {
        return $query->where('author_id', $authorId);
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}

// Uso
$publishedPosts = Post::published()->get();
$userPosts = Post::byAuthor(1)->published()->get();
$recentPosts = Post::recent(30)->published()->get();
```

#### Global Scopes

```php
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Scope;

class PublishedScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('published_at', '<=', now())
                ->where('is_published', true);
    }
}

// Aplicar en el modelo
class Post extends Model
{
    protected static function booted(): void
    {
        static::addGlobalScope(new PublishedScope);
    }
}

// Uso
$posts = Post::all();  // Solo posts publicados
$allPosts = Post::withoutGlobalScope(PublishedScope::class)->get();
```

---

## 12. Blade Template Engine

Blade es el motor de plantillas simple pero poderoso proporcionado por Laravel. Blade permite escribir plantillas limpias y legibles con características como herencia de plantillas, secciones y directivas.

### 12.1 ¿Qué es Blade?

Blade es el motor de plantillas de Laravel, proporcionando una forma simple y expresiva de crear vistas dinámicas.

#### Características Principales

- Sintaxis simple y expresiva
- Herencia de plantillas
- Componentes reutilizables
- Directivas personalizadas
- Compilación automática a PHP
- No afecta el rendimiento

### 12.2 Sintaxis Básica

#### Mostrar Datos

```blade
{{-- Mostrar variables (escapadas automáticamente) --}}
<h1>{{ $title }}</h1>
<p>{{ $user->name }}</p>

{{-- Mostrar HTML sin escapar (¡Cuidado!) --}}
<div>{!! $htmlContent !!}</div>

{{-- Valores por defecto --}}
<p>{{ $message ?? 'No hay mensaje' }}</p>
<p>{{ $user->name ?? 'Usuario anónimo' }}</p>

{{-- Expresiones PHP --}}
<p>El precio es: ${{ number_format($price, 2) }}</p>
<p>{{ strtoupper($user->name) }}</p>
```

#### Comentarios

```blade
{{-- Este es un comentario de Blade --}}
{{--
    Este es un comentario
    de múltiples líneas
--}}
```

### 12.3 Estructuras de Control

#### Condicionales

```blade
{{-- If statements --}}
@if ($user->isAdmin())
    <p>Eres administrador</p>
@elseif ($user->isModerator())
    <p>Eres moderador</p>
@else
    <p>Eres usuario regular</p>
@endif

{{-- Unless (if not) --}}
@unless ($user->isSubscribed())
    <div class="alert">
        Por favor suscríbete para acceder a todas las funciones
    </div>
@endunless

{{-- Empty/isset --}}
@empty($posts)
    <p>No hay posts disponibles</p>
@endempty

@isset($user->profile)
    <img src="{{ $user->profile->avatar }}" alt="Avatar">
@endisset

{{-- Auth directives --}}
@auth
    <p>Estás autenticado</p>
@endauth

@guest
    <p>Por favor inicia sesión</p>
@endguest

@auth('admin')
    <p>Estás autenticado como admin</p>
@endauth
```

#### Loops

```blade
{{-- Foreach --}}
@foreach ($posts as $post)
    <article>
        <h2>{{ $post->title }}</h2>
        <p>{{ $post->excerpt }}</p>
    </article>
@endforeach

{{-- Foreach con else --}}
@forelse ($posts as $post)
    <article>
        <h2>{{ $post->title }}</h2>
        <p>{{ $post->content }}</p>
    </article>
@empty
    <p>No hay posts para mostrar</p>
@endforelse

{{-- For loop --}}
@for ($i = 0; $i < 10; $i++)
    <div>Iteración {{ $i }}</div>
@endfor

{{-- While loop --}}
@while (true)
    <p>Loop infinito (¡cuidado!)</p>
    @break
@endwhile

{{-- Loop variable --}}
@foreach ($posts as $post)
    <div>
        Post #{{ $loop->iteration }} de {{ $loop->count }}
    
        @if ($loop->first)
            Este es el primer post
        @endif
    
        @if ($loop->last)
            Este es el último post
        @endif
    
        @if ($loop->remaining > 0)
            Quedan {{ $loop->remaining }} posts
        @endif
    </div>
@endforeach
```

### 12.4 Layouts y Herencia

#### Layout Base

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Mi Aplicación')</title>
  
    {{-- Estilos --}}
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    @stack('styles')
</head>
<body>
    <header>
        @include('partials.navigation')
    </header>

    <main>
        @yield('content')
    </main>

    <footer>
        @include('partials.footer')
    </footer>

    {{-- Scripts --}}
    <script src="{{ asset('js/app.js') }}"></script>
    @stack('scripts')
</body>
</html>
```

#### Extender Layout

```blade
{{-- resources/views/posts/show.blade.php --}}
@extends('layouts.app')

@section('title', $post->title)

@push('styles')
    <link href="{{ asset('css/posts.css') }}" rel="stylesheet">
@endpush

@section('content')
    <article class="post">
        <header>
            <h1>{{ $post->title }}</h1>
            <div class="meta">
                <span>Por {{ $post->author->name }}</span>
                <time datetime="{{ $post->published_at->toISOString() }}">
                    {{ $post->published_at->format('d/m/Y') }}
                </time>
            </div>
        </header>

        <div class="content">
            {!! nl2br(e($post->content)) !!}
        </div>

        @if ($post->tags->count())
            <div class="tags">
                @foreach ($post->tags as $tag)
                    <span class="tag">{{ $tag->name }}</span>
                @endforeach
            </div>
        @endif
    </article>
@endsection

@push('scripts')
    <script>
        // JavaScript específico para posts
        console.log('Post: {{ $post->title }}');
    </script>
@endpush
```

### 12.5 Componentes

#### Componentes Anónimos

```blade
{{-- resources/views/components/alert.blade.php --}}
<div class="alert alert-{{ $type ?? 'info' }}">
    <strong>{{ $title ?? 'Información' }}</strong>
    {{ $slot }}
</div>
```

```blade
{{-- Uso del componente --}}
<x-alert type="success" title="¡Éxito!">
    El post se guardó correctamente.
</x-alert>

<x-alert type="danger">
    Ha ocurrido un error.
</x-alert>
```

#### Componentes de Clase

```bash
php artisan make:component Alert
```

```php
<?php
namespace App\View\Components;

use Illuminate\View\Component;

class Alert extends Component
{
    public function __construct(
        public string $type = 'info',
        public ?string $title = null
    ) {}

    public function render()
    {
        return view('components.alert');
    }
}
```

```blade
{{-- resources/views/components/alert.blade.php --}}
<div class="alert alert-{{ $type }}">
    @if ($title)
        <strong>{{ $title }}</strong>
    @endif
    {{ $slot }}
</div>
```

#### Componentes con Slots Múltiples

```blade
{{-- resources/views/components/card.blade.php --}}
<div class="card">
    @if (isset($header))
        <div class="card-header">
            {{ $header }}
        </div>
    @endif

    <div class="card-body">
        {{ $slot }}
    </div>

    @if (isset($footer))
        <div class="card-footer">
            {{ $footer }}
        </div>
    @endif
</div>
```

```blade
{{-- Uso --}}
<x-card>
    <x-slot name="header">
        <h3>Título de la Tarjeta</h3>
    </x-slot>

    Este es el contenido principal de la tarjeta.

    <x-slot name="footer">
        <button class="btn btn-primary">Acción</button>
    </x-slot>
</x-card>
```

### 12.6 Directivas Personalizadas

```php
// En AppServiceProvider::boot()
use Illuminate\Support\Facades\Blade;

Blade::directive('datetime', function ($expression) {
    return "<?php echo ($expression)->format('d/m/Y H:i'); ?>";
});

Blade::directive('money', function ($expression) {
    return "<?php echo number_format($expression, 2); ?>";
});

Blade::if('env', function ($environment) {
    return app()->environment($environment);
});
```

```blade
{{-- Uso de directivas personalizadas --}}
<p>Fecha: @datetime($post->created_at)</p>
<p>Precio: $@money($product->price)</p>

@env('local')
    <div class="debug">Modo desarrollo activo</div>
@endenv
```

### 12.7 Formularios

```blade
{{-- Formulario con protección CSRF --}}
<form action="{{ route('posts.store') }}" method="POST">
    @csrf
  
    <div class="form-group">
        <label for="title">Título</label>
        <input 
            type="text" 
            id="title" 
            name="title" 
            value="{{ old('title') }}"
            class="form-control @error('title') is-invalid @enderror"
        >
        @error('title')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="form-group">
        <label for="content">Contenido</label>
        <textarea 
            id="content" 
            name="content" 
            class="form-control @error('content') is-invalid @enderror"
        >{{ old('content') }}</textarea>
        @error('content')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <button type="submit" class="btn btn-primary">Guardar</button>
</form>

{{-- Formulario para actualizar (PUT/PATCH) --}}
<form action="{{ route('posts.update', $post) }}" method="POST">
    @csrf
    @method('PUT')
  
    {{-- campos del formulario --}}
</form>

{{-- Formulario para eliminar --}}
<form action="{{ route('posts.destroy', $post) }}" method="POST">
    @csrf
    @method('DELETE')
    <button type="submit" onclick="return confirm('¿Estás seguro?')">
        Eliminar
    </button>
</form>
```

---

## 13. Dependency Injection

Laravel fomenta el uso de inyección de dependencias para manejar el flujo de dependencias dentro de tu aplicación. Esto promueve bajo acoplamiento entre componentes, haciendo tu codebase más mantenible y testeable.

### 13.1 ¿Qué es Dependency Injection?

La Inyección de Dependencias es un patrón de diseño que permite que las dependencias de una clase se "inyecten" desde el exterior en lugar de crearlas internamente. Esto promueve:

- **Bajo acoplamiento**: Las clases no dependen de implementaciones concretas
- **Testabilidad**: Fácil mockeado de dependencias en tests
- **Flexibilidad**: Fácil intercambio de implementaciones
- **Mantenibilidad**: Código más limpio y organizado

### 13.2 Inyección en Constructores

#### Controladores

```php
<?php
namespace App\Http\Controllers;

use App\Services\PaymentService;
use App\Services\NotificationService;
use App\Repositories\OrderRepository;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService,
        protected NotificationService $notificationService,
        protected OrderRepository $orderRepository
    ) {}

    public function store(Request $request)
    {
        $order = $this->orderRepository->create($request->validated());
    
        $result = $this->paymentService->processPayment($order);
    
        if ($result->successful()) {
            $this->notificationService->sendOrderConfirmation($order);
            return redirect()->route('orders.show', $order);
        }
    
        return back()->withErrors(['payment' => $result->message()]);
    }
}
```

#### Servicios

```php
<?php
namespace App\Services;

use App\Contracts\PaymentGateway;
use App\Contracts\Logger;
use App\Models\Order;

class PaymentService
{
    public function __construct(
        protected PaymentGateway $gateway,
        protected Logger $logger
    ) {}

    public function processPayment(Order $order): PaymentResult
    {
        $this->logger->info('Procesando pago', ['order_id' => $order->id]);
    
        try {
            $result = $this->gateway->charge(
                $order->total_amount,
                $order->payment_token
            );
        
            $this->logger->info('Pago procesado', [
                'order_id' => $order->id,
                'charge_id' => $result->chargeId()
            ]);
        
            return $result;
        } catch (PaymentException $e) {
            $this->logger->error('Error en pago', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);
        
            throw $e;
        }
    }
}
```

### 13.3 Inyección en Métodos

#### Route Model Binding + Inyección

```php
Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);

class OrderController extends Controller
{
    public function updateStatus(
        Order $order,  // Route model binding
        UpdateOrderStatusRequest $request,  // Form request injection
        OrderStatusService $statusService  // Service injection
    ): RedirectResponse {
        $statusService->updateStatus($order, $request->status);
    
        return redirect()
            ->route('orders.show', $order)
            ->with('success', 'Estado actualizado correctamente');
    }
}
```

#### Inyección en Middleware

```php
class LogRequest
{
    public function handle(
        Request $request, 
        Closure $next,
        Logger $logger  // Inyección en middleware
    ): mixed {
        $logger->info('Request recibida', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
        ]);

        return $next($request);
    }
}
```

### 13.4 Inyección de Interfaces

#### Definir Interface

```php
<?php
namespace App\Contracts;

interface EmailService
{
    public function send(string $to, string $subject, string $content): bool;
    public function sendTemplate(string $to, string $template, array $data): bool;
}
```

#### Implementaciones

```php
<?php
namespace App\Services;

class SmtpEmailService implements EmailService
{
    public function send(string $to, string $subject, string $content): bool
    {
        // Implementación SMTP
        return mail($to, $subject, $content);
    }

    public function sendTemplate(string $to, string $template, array $data): bool
    {
        $content = view($template, $data)->render();
        return $this->send($to, $data['subject'] ?? 'Sin asunto', $content);
    }
}

class MailgunEmailService implements EmailService
{
    public function __construct(protected string $apiKey) {}

    public function send(string $to, string $subject, string $content): bool
    {
        // Implementación con Mailgun API
        return $this->mailgunClient->send($to, $subject, $content);
    }

    public function sendTemplate(string $to, string $template, array $data): bool
    {
        // Implementación con templates de Mailgun
        return $this->mailgunClient->sendTemplate($to, $template, $data);
    }
}
```

#### Registrar en Service Provider

```php
public function register(): void
{
    $this->app->bind(EmailService::class, function ($app) {
        $driver = config('mail.driver');
    
        return match($driver) {
            'smtp' => new SmtpEmailService(),
            'mailgun' => new MailgunEmailService(config('services.mailgun.secret')),
            default => throw new InvalidArgumentException("Driver {$driver} no soportado")
        };
    });
}
```

#### Usar la Interface

```php
class UserController extends Controller
{
    public function __construct(protected EmailService $emailService) {}

    public function sendWelcome(User $user): RedirectResponse
    {
        $sent = $this->emailService->sendTemplate(
            $user->email,
            'emails.welcome',
            ['user' => $user]
        );

        if ($sent) {
            return back()->with('success', 'Email enviado correctamente');
        }

        return back()->withErrors(['email' => 'Error al enviar email']);
    }
}
```

### 13.5 Method Injection Avanzado

#### Job Classes

```php
<?php
namespace App\Jobs;

use App\Services\ImageProcessor;
use App\Services\StorageService;
use App\Models\Image;

class ProcessImageUpload implements ShouldQueue
{
    public function __construct(protected Image $image) {}

    public function handle(
        ImageProcessor $processor,  // Inyección automática
        StorageService $storage    // Inyección automática
    ): void {
        $processedImage = $processor->resize($this->image->path, [800, 600]);
    
        $thumbnailPath = $processor->createThumbnail($this->image->path, [150, 150]);
    
        $storage->store($processedImage, 'images/processed/');
        $storage->store($thumbnailPath, 'images/thumbnails/');
    
        $this->image->update([
            'processed' => true,
            'thumbnail_path' => $thumbnailPath
        ]);
    }
}
```

#### Event Listeners

```php
class SendWelcomeEmail
{
    public function handle(
        UserRegistered $event,
        EmailService $emailService,  // Inyección automática
        Logger $logger              // Inyección automática
    ): void {
        try {
            $emailService->sendTemplate(
                $event->user->email,
                'emails.welcome',
                ['user' => $event->user]
            );
        
            $logger->info('Welcome email sent', ['user_id' => $event->user->id]);
        } catch (Exception $e) {
            $logger->error('Failed to send welcome email', [
                'user_id' => $event->user->id,
                'error' => $e->getMessage()
            ]);
        }
    }
}
```

### 13.6 Testing con Dependency Injection

#### Unit Test con Mocks

```php
<?php
namespace Tests\Unit;

use Tests\TestCase;
use App\Services\PaymentService;
use App\Contracts\PaymentGateway;
use App\Models\Order;
use Mockery;

class PaymentServiceTest extends TestCase
{
    public function test_can_process_payment_successfully()
    {
        // Arrange
        $mockGateway = Mockery::mock(PaymentGateway::class);
        $mockLogger = Mockery::mock(Logger::class);
    
        $order = Order::factory()->make(['total_amount' => 100]);
    
        $mockGateway->shouldReceive('charge')
            ->once()
            ->with(100, $order->payment_token)
            ->andReturn(new PaymentResult(true, 'charge_123'));
        
        $mockLogger->shouldReceive('info')->twice();
    
        $paymentService = new PaymentService($mockGateway, $mockLogger);
    
        // Act
        $result = $paymentService->processPayment($order);
    
        // Assert
        $this->assertTrue($result->successful());
        $this->assertEquals('charge_123', $result->chargeId());
    }
}
```

#### Feature Test con Service Container

```php
class OrderCreationTest extends TestCase
{
    public function test_can_create_order_with_payment()
    {
        // Mock del servicio de pago
        $this->mock(PaymentService::class, function ($mock) {
            $mock->shouldReceive('processPayment')
                 ->once()
                 ->andReturn(new PaymentResult(true, 'charge_123'));
        });
    
        $user = User::factory()->create();
    
        $response = $this->actingAs($user)
            ->post('/orders', [
                'product_id' => 1,
                'quantity' => 2,
                'payment_token' => 'tok_123'
            ]);
        
        $response->assertRedirect();
        $this->assertDatabaseHas('orders', ['user_id' => $user->id]);
    }
}
```

---

## 14. Patrones Arquitectónicos Avanzados

### 14.1 Repository Pattern

El Repository Pattern proporciona una capa de abstracción entre tu lógica de negocio y el acceso a datos.

#### Interface del Repository

```php
<?php
namespace App\Contracts;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface UserRepository
{
    public function find(int $id): ?User;
    public function findByEmail(string $email): ?User;
    public function create(array $data): User;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function paginate(int $perPage = 15): LengthAwarePaginator;
    public function getActive(): Collection;
}
```

#### Implementación Eloquent

```php
<?php
namespace App\Repositories;

use App\Contracts\UserRepository;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EloquentUserRepository implements UserRepository
{
    public function find(int $id): ?User
    {
        return User::find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(int $id, array $data): bool
    {
        return User::where('id', $id)->update($data);
    }

    public function delete(int $id): bool
    {
        return User::destroy($id);
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return User::paginate($perPage);
    }

    public function getActive(): Collection
    {
        return User::where('active', true)->get();
    }
}
```

#### Uso en Controlador

```php
class UserController extends Controller
{
    public function __construct(protected UserRepository $userRepository) {}

    public function index()
    {
        $users = $this->userRepository->paginate(20);
        return view('users.index', compact('users'));
    }

    public function show(int $id)
    {
        $user = $this->userRepository->find($id);
    
        if (!$user) {
            abort(404);
        }
    
        return view('users.show', compact('user'));
    }
}
```

### 14.2 Service Layer Pattern

Los Services encapsulan la lógica de negocio y coordinan entre múltiples repositories.

```php
<?php
namespace App\Services;

use App\Contracts\UserRepository;
use App\Contracts\EmailService;
use App\Models\User;
use App\Exceptions\UserCreationException;
use Illuminate\Support\Facades\DB;

class UserService
{
    public function __construct(
        protected UserRepository $userRepository,
        protected EmailService $emailService
    ) {}

    public function createUser(array $userData): User
    {
        // Validar si el email ya existe
        if ($this->userRepository->findByEmail($userData['email'])) {
            throw new UserCreationException('El email ya está registrado');
        }

        DB::beginTransaction();
    
        try {
            // Crear usuario
            $user = $this->userRepository->create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => bcrypt($userData['password']),
                'email_verified_at' => null
            ]);

            // Enviar email de bienvenida
            $this->emailService->sendTemplate(
                $user->email,
                'emails.welcome',
                ['user' => $user]
            );

            // Crear perfil por defecto
            $user->profile()->create([
                'bio' => '',
                'avatar' => 'default-avatar.png'
            ]);

            DB::commit();
        
            return $user;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UserCreationException('Error al crear usuario: ' . $e->getMessage());
        }
    }

    public function updateProfile(User $user, array $profileData): User
    {
        $user->update([
            'name' => $profileData['name'],
            'email' => $profileData['email']
        ]);

        $user->profile->update([
            'bio' => $profileData['bio'],
            'location' => $profileData['location']
        ]);

        return $user->fresh();
    }
}
```

### 14.3 Action Pattern

Las Actions encapsulan una sola operación de negocio.

```php
<?php
namespace App\Actions;

use App\Models\Order;
use App\Models\User;
use App\Services\PaymentService;
use App\Services\NotificationService;
use App\Services\InventoryService;

class CreateOrderAction
{
    public function __construct(
        protected PaymentService $paymentService,
        protected NotificationService $notificationService,
        protected InventoryService $inventoryService
    ) {}

    public function execute(User $user, array $orderData): Order
    {
        // Validar inventario
        if (!$this->inventoryService->hasStock($orderData['product_id'], $orderData['quantity'])) {
            throw new InsufficientStockException();
        }

        // Crear orden
        $order = Order::create([
            'user_id' => $user->id,
            'product_id' => $orderData['product_id'],
            'quantity' => $orderData['quantity'],
            'total_amount' => $orderData['total_amount'],
            'status' => 'pending'
        ]);

        // Procesar pago
        $paymentResult = $this->paymentService->processPayment($order);
    
        if (!$paymentResult->successful()) {
            $order->update(['status' => 'failed']);
            throw new PaymentFailedException($paymentResult->message());
        }

        // Actualizar inventario
        $this->inventoryService->reduceStock($orderData['product_id'], $orderData['quantity']);

        // Actualizar orden
        $order->update([
            'status' => 'paid',
            'payment_id' => $paymentResult->chargeId()
        ]);

        // Enviar notificación
        $this->notificationService->sendOrderConfirmation($order);

        return $order;
    }
}
```

#### Uso en Controlador

```php
class OrderController extends Controller
{
    public function store(StoreOrderRequest $request, CreateOrderAction $action)
    {
        try {
            $order = $action->execute(auth()->user(), $request->validated());
        
            return redirect()
                ->route('orders.show', $order)
                ->with('success', 'Orden creada exitosamente');
        } catch (PaymentFailedException $e) {
            return back()->withErrors(['payment' => $e->getMessage()]);
        } catch (InsufficientStockException $e) {
            return back()->withErrors(['stock' => 'No hay suficiente stock disponible']);
        }
    }
}
```

### 14.4 Observer Pattern

Los Observers responden a eventos del modelo.

```php
<?php
namespace App\Observers;

use App\Models\User;
use App\Services\CacheService;
use App\Services\AuditService;

class UserObserver
{
    public function __construct(
        protected CacheService $cacheService,
        protected AuditService $auditService
    ) {}

    public function created(User $user): void
    {
        // Limpiar cache relacionado
        $this->cacheService->forget('users.count');
    
        // Registrar en auditoría
        $this->auditService->log('user.created', $user);
    
        // Enviar evento
        event(new UserCreated($user));
    }

    public function updated(User $user): void
    {
        // Limpiar cache del usuario
        $this->cacheService->forget("user.{$user->id}");
    
        // Registrar cambios
        $this->auditService->log('user.updated', $user, $user->getDirty());
    }

    public function deleted(User $user): void
    {
        // Limpiar todos los caches relacionados
        $this->cacheService->forgetPattern("user.{$user->id}.*");
    
        // Registrar eliminación
        $this->auditService->log('user.deleted', $user);
    }
}
```

#### Registrar Observer

```php
// En AppServiceProvider::boot()
use App\Models\User;
use App\Observers\UserObserver;

User::observe(UserObserver::class);
```

### 14.5 Strategy Pattern

El Strategy Pattern permite intercambiar algoritmos dinámicamente.

```php
<?php
namespace App\Contracts;

interface ShippingStrategy
{
    public function calculateCost(float $weight, string $destination): float;
    public function getEstimatedDelivery(string $destination): int; // días
}
```

#### Implementaciones

```php
class StandardShippingStrategy implements ShippingStrategy
{
    public function calculateCost(float $weight, string $destination): float
    {
        $baseCost = 5.00;
        $weightCost = $weight * 0.50;
    
        return $baseCost + $weightCost;
    }

    public function getEstimatedDelivery(string $destination): int
    {
        return 7; // 7 días
    }
}

class ExpressShippingStrategy implements ShippingStrategy
{
    public function calculateCost(float $weight, string $destination): float
    {
        $baseCost = 15.00;
        $weightCost = $weight * 1.00;
    
        return $baseCost + $weightCost;
    }

    public function getEstimatedDelivery(string $destination): int
    {
        return 2; // 2 días
    }
}
```

#### Servicio de Envío

```php
class ShippingService
{
    public function calculateShipping(Order $order, string $shippingType): array
    {
        $strategy = $this->getStrategy($shippingType);
    
        $cost = $strategy->calculateCost($order->weight, $order->destination);
        $delivery = $strategy->getEstimatedDelivery($order->destination);
    
        return [
            'cost' => $cost,
            'estimated_delivery_days' => $delivery
        ];
    }

    private function getStrategy(string $type): ShippingStrategy
    {
        return match($type) {
            'standard' => new StandardShippingStrategy(),
            'express' => new ExpressShippingStrategy(),
            'overnight' => new OvernightShippingStrategy(),
            default => throw new InvalidArgumentException("Tipo de envío no válido: {$type}")
        };
    }
}
```

---

## 15. Mejores Prácticas

### 15.1 Organización del Código

#### Estructura de Directorios Personalizada

```
app/
├── Actions/           # Single-purpose business logic
├── Contracts/         # Interfaces
├── DTOs/             # Data Transfer Objects
├── Enums/            # Enumeraciones (PHP 8.1+)
├── Exceptions/       # Excepciones personalizadas
├── Helpers/          # Clases helper
├── Http/
│   ├── Controllers/
│   ├── Middleware/
│   ├── Requests/
│   └── Resources/
├── Models/
├── Observers/
├── Policies/
├── Providers/
├── Repositories/     # Repository pattern
├── Services/         # Business logic
└── Traits/          # Traits reutilizables
```

#### Data Transfer Objects (DTOs)

```php
<?php
namespace App\DTOs;

class CreateUserDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $password,
        public readonly ?string $phone = null
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            password: $data['password'],
            phone: $data['phone'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'password' => bcrypt($this->password),
            'phone' => $this->phone
        ];
    }
}
```

### 15.2 Manejo de Errores

#### Exception Handler Personalizado

```php
<?php
namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class Handler extends ExceptionHandler
{
    protected $dontReport = [
        ValidationException::class,
        ModelNotFoundException::class,
    ];

    public function render($request, Throwable $exception)
    {
        if ($request->expectsJson()) {
            return $this->handleApiException($request, $exception);
        }

        return parent::render($request, $exception);
    }

    private function handleApiException($request, Throwable $exception)
    {
        if ($exception instanceof ValidationException) {
            return response()->json([
                'message' => 'Los datos enviados no son válidos',
                'errors' => $exception->errors()
            ], 422);
        }

        if ($exception instanceof ModelNotFoundException) {
            return response()->json([
                'message' => 'Recurso no encontrado'
            ], 404);
        }

        return response()->json([
            'message' => 'Error interno del servidor'
        ], 500);
    }
}
```

#### Excepciones Personalizadas

```php
<?php
namespace App\Exceptions;

class PaymentFailedException extends Exception
{
    public function __construct(
        string $message = 'El pago no pudo ser procesado',
        public readonly ?string $paymentId = null,
        public readonly ?string $errorCode = null
    ) {
        parent::__construct($message);
    }

    public function render($request)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => $this->getMessage(),
                'payment_id' => $this->paymentId,
                'error_code' => $this->errorCode
            ], 402);
        }

        return redirect()->back()
            ->withErrors(['payment' => $this->getMessage()]);
    }
}
```

### 15.3 Validación Avanzada

#### Form Requests Complejas

```php
<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->can('create', User::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($this->user)
            ],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in(['user', 'admin', 'moderator'])],
            'profile.bio' => ['nullable', 'string', 'max:1000'],
            'profile.avatar' => ['nullable', 'image', 'max:2048']
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Este email ya está registrado en el sistema',
            'password.confirmed' => 'Las contraseñas no coinciden',
            'profile.avatar.image' => 'El avatar debe ser una imagen válida'
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => strtolower($this->email)
        ]);
    }
}
```

### 15.4 Testing

#### Test de Feature

```php
<?php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_user(): void
    {
        $admin = User::factory()->admin()->create();
    
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'user'
        ];

        $response = $this->actingAs($admin)
            ->post('/admin/users', $userData);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ]);
    }

    public function test_regular_user_cannot_create_user(): void
    {
        $user = User::factory()->create();
    
        $response = $this->actingAs($user)
            ->post('/admin/users', []);

        $response->assertForbidden();
    }
}
```

### 15.5 Configuración y Environment

#### Configuración por Ambiente

```php
// config/app.php
return [
    'name' => env('APP_NAME', 'Laravel'),
    'env' => env('APP_ENV', 'production'),
    'debug' => (bool) env('APP_DEBUG', false),
  
    // Configuración específica
    'features' => [
        'user_registration' => env('FEATURE_USER_REGISTRATION', true),
        'email_verification' => env('FEATURE_EMAIL_VERIFICATION', false),
        'two_factor_auth' => env('FEATURE_2FA', false),
    ],
  
    'limits' => [
        'upload_size' => env('UPLOAD_MAX_SIZE', 10240), // KB
        'rate_limit' => env('RATE_LIMIT_PER_MINUTE', 60),
    ]
];
```

#### Service Provider para Configuración

```php
class FeatureServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Registrar rutas condicionalmente
        if (config('app.features.user_registration')) {
            Route::middleware('web')->group(function () {
                Route::get('/register', [RegisterController::class, 'create']);
                Route::post('/register', [RegisterController::class, 'store']);
            });
        }

        // Configurar validaciones dinámicas
        Validator::extend('feature_enabled', function ($attribute, $value, $parameters) {
            $feature = $parameters[0] ?? null;
            return config("app.features.{$feature}", false);
        });
    }
}
```

---

## Conclusión

Laravel implementa una arquitectura robusta basada en MVC con componentes adicionales como Service Container, Service Providers, Facades y Contracts que proporcionan un framework poderoso para construir aplicaciones web modernas y escalables.

### Conceptos Clave Cubiertos

1. **Estructura MVC**: Model-View-Controller como base arquitectónica
2. **Service Container**: Inyección de dependencias y gestión de servicios
3. **Service Providers**: Configuración y arranque de la aplicación
4. **Facades**: Interfaces estáticas para servicios del container
5. **Contracts**: Interfaces que definen APIs claras
6. **Routing**: Sistema de rutas flexible y poderoso
7. **Middleware**: Filtrado y procesamiento de requests
8. **Eloquent ORM**: Object-Relational Mapping elegante
9. **Blade**: Motor de plantillas expresivo
10. **Dependency Injection**: Patrón para bajo acoplamiento

### Beneficios de la Arquitectura Laravel

- **Separación de responsabilidades**: Cada componente tiene un propósito específico
- **Testabilidad**: Arquitectura que facilita las pruebas automatizadas
- **Mantenibilidad**: Código organizado y fácil de modificar
- **Escalabilidad**: Estructura que permite crecimiento de la aplicación
- **Reutilización**: Componentes reutilizables en diferentes contextos
- **Flexibilidad**: Posibilidad de intercambiar implementaciones

Esta arquitectura hace que Laravel sea uno de los frameworks PHP más populares para el desarrollo de aplicaciones web modernas, proporcionando tanto simplicidad para proyectos pequeños como robustez para aplicaciones empresariales complejas.
