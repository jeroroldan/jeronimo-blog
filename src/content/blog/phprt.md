---
title: 'PHP Developer Roadmap 2026 — Masterclass Completa'
code: 'php'
description: 'PHP Developer Roadmap 2026 — Masterclass Completa'
pubDate: 'Jun 01 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---



## ¿Qué vas a aprender

En este contenido dominarás la arquitectura y las prácticas del desarrollo backend moderno:

- Diseño de APIs RESTful y protocolos de comunicación
- Modelado de datos, bases de datos relacionales y NoSQL
- Arquitectura de aplicaciones, patrones y separación de responsabilidades
- Seguridad, autenticación, autorización y protección de servicios
- Escalabilidad, caching, colas y despliegue en producción


# 🐘 PHP Developer Roadmap 2026 — Masterclass Completa
### De Fundamentos a Ingeniero AI-Powered · *By a Senior PHP Engineer*

> *"El mejor código es tu próximo commit."*

---

## 📋 Tabla de Contenidos

1. [Nivel 1 — Core PHP 8.x](#nivel-1--core-php-8x)
2. [Nivel 2 — Laravel Mastery](#nivel-2--laravel-mastery)
3. [Nivel 4 — Queues & Jobs](#nivel-4--queues--jobs)
4. [Nivel 5 — Redis](#nivel-5--redis)
5. [Nivel 6 — Docker](#nivel-6--docker)
6. [Nivel 7 — AI Integration](#nivel-7--ai-integration)
7. [Nivel 8 — Cloud Deployment](#nivel-8--cloud-deployment)
8. [Nivel 9 — Senior Architecture](#nivel-9--senior-architecture)
9. [Tu Plan de Carrera](#-tu-plan-de-carrera)

---

## 🗺️ Visión General del Roadmap

Antes de arrancar, entendé la estructura del camino. El roadmap tiene **9 niveles** que se agrupan en 4 etapas de carrera:

| Etapa | Niveles | Qué hacés |
|---|---|---|
| **Junior** | 1–2 | Aprendés las bases, construís confianza |
| **Mid-Level** | 4–5 | Construís proyectos reales, ganás experiencia |
| **Senior** | 6–7 | Diseñás soluciones, liderás y escalás |
| **AI-Powered Engineer** | 8–9 | Innovás, automatizás, construís el futuro |

> 💡 **Analogía:** Es como aprender a manejar. Primero aprendés el volante y los pedales (Core PHP), luego las rutas y señales (Laravel), después a manejar en autopista (Cloud), y finalmente a ser instructor y diseñar circuitos (Architecture).

---

## Nivel 1 — Core PHP 8.x

### 🎯 ¿Por qué importa?

PHP 8.x no es "el PHP de tu abuelo". Es un lenguaje moderno, rápido y con características que lo ponen al nivel de Python o TypeScript. Todo lo demás del roadmap se construye sobre esta base.

> 💡 **Analogía:** PHP es los cimientos de un edificio. Podés poner mármol o granito arriba, pero si los cimientos están mal, todo se derrumba.

---

### 📌 OOP — Programación Orientada a Objetos

La OOP te permite modelar el mundo real en código. En lugar de funciones sueltas, agrupás datos y comportamientos en **clases**.

```php
<?php

// ❌ Enfoque procedural (el "PHP viejo")
function calcularAreaCirculo(float $radio): float {
    return M_PI * $radio ** 2;
}

// ✅ Enfoque OOP moderno
class Circulo
{
    public function __construct(
        private readonly float $radio // PHP 8.x: Constructor Property Promotion
    ) {}

    public function area(): float
    {
        return M_PI * $this->radio ** 2;
    }

    public function perimetro(): float
    {
        return 2 * M_PI * $this->radio;
    }
}

$circulo = new Circulo(radio: 5.0); // PHP 8.x: Named Arguments
echo $circulo->area();      // 78.53...
echo $circulo->perimetro(); // 31.41...
```

#### Los 4 Pilares de OOP

**1. Encapsulamiento** — Esconder los detalles internos

```php
class CuentaBancaria
{
    private float $saldo = 0;

    public function depositar(float $monto): void
    {
        if ($monto <= 0) {
            throw new \InvalidArgumentException("El monto debe ser positivo");
        }
        $this->saldo += $monto;
    }

    public function getSaldo(): float
    {
        return $this->saldo; // Solo lectura desde afuera
    }
}

$cuenta = new CuentaBancaria();
$cuenta->depositar(1000);
// $cuenta->saldo = 999999; // ❌ Error: propiedad privada
echo $cuenta->getSaldo(); // ✅ 1000
```

**2. Herencia** — Reutilizar y extender comportamiento

```php
abstract class Animal
{
    public function __construct(protected string $nombre) {}

    abstract public function hacerSonido(): string;

    public function presentarse(): string
    {
        return "Soy {$this->nombre} y hago: {$this->hacerSonido()}";
    }
}

class Perro extends Animal
{
    public function hacerSonido(): string
    {
        return "¡Guau!";
    }
}

class Gato extends Animal
{
    public function hacerSonido(): string
    {
        return "¡Miau!";
    }
}

$perro = new Perro("Rex");
echo $perro->presentarse(); // "Soy Rex y hago: ¡Guau!"
```

**3. Polimorfismo** — Muchas formas, una interfaz

```php
interface Pagable
{
    public function procesar(float $monto): bool;
    public function getDescripcion(): string;
}

class TarjetaCredito implements Pagable
{
    public function procesar(float $monto): bool
    {
        // Lógica de procesamiento de tarjeta
        return true;
    }

    public function getDescripcion(): string
    {
        return "Tarjeta de Crédito";
    }
}

class MercadoPago implements Pagable
{
    public function procesar(float $monto): bool
    {
        // Lógica de MercadoPago
        return true;
    }

    public function getDescripcion(): string
    {
        return "MercadoPago";
    }
}

// El código cliente no sabe ni le importa QUÉ método de pago es
function procesarCheckout(Pagable $metodoPago, float $monto): void
{
    if ($metodoPago->procesar($monto)) {
        echo "Pago exitoso con {$metodoPago->getDescripcion()}";
    }
}
```

**4. Abstracción** — Mostrar solo lo necesario

```php
interface RepositorioUsuario
{
    public function buscarPorId(int $id): ?Usuario;
    public function guardar(Usuario $usuario): void;
    public function eliminar(int $id): void;
}

// La implementación concreta puede cambiar (MySQL, PostgreSQL, API externa)
// sin que el resto del código cambie
class RepositorioUsuarioMySQL implements RepositorioUsuario
{
    public function buscarPorId(int $id): ?Usuario
    {
        // Implementación específica con MySQL
    }
    // ...
}
```

---

### 📌 Composer — El Gestor de Dependencias

> 💡 **Analogía:** Composer es como el gestor de paquetes de un supermercado. En lugar de ir a fabricar tu propia harina para hacer pan, vas y la comprás. Composer te trae las "cajas de ingredientes" que necesitás.

```bash
# Inicializar un proyecto
composer init

# Instalar una dependencia
composer require guzzlehttp/guzzle

# Instalar solo para desarrollo (tests, etc.)
composer require --dev phpunit/phpunit

# Autoload de tus clases (¡sin require manual!)
# composer.json
{
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

```php
// Sin Composer
require_once 'src/Usuario.php';
require_once 'src/Repositorio.php';
require_once 'vendor/guzzle/Client.php';
// ...30 líneas de require

// ✅ Con Composer
require 'vendor/autoload.php';
// ¡Listo! Todas tus clases disponibles automáticamente
```

**Estructura de proyecto recomendada:**

```
mi-proyecto/
├── src/
│   ├── Controllers/
│   ├── Models/
│   └── Services/
├── tests/
├── vendor/          # ← Generado por Composer, nunca al git
├── composer.json
└── composer.lock    # ← SÍ va al git (versiones exactas)
```

---

### 📌 SOLID — Los 5 Principios del Código Limpio

SOLID es el conjunto de principios que hacen que tu código sea mantenible, testeable y escalable.

#### S — Single Responsibility Principle

> *Cada clase debe tener una sola razón para cambiar.*

```php
// ❌ MAL: Una clase hace demasiado
class Usuario
{
    public function save(): void { /* guarda en BD */ }
    public function sendEmail(): void { /* envía email */ }
    public function generateReport(): void { /* genera PDF */ }
    public function validateAge(): bool { /* valida datos */ }
}

// ✅ BIEN: Responsabilidades separadas
class Usuario { /* solo datos del usuario */ }
class UsuarioRepository { /* solo persistencia */ }
class EmailService { /* solo emails */ }
class ReporteGenerator { /* solo reportes */ }
```

#### O — Open/Closed Principle

> *Abierto para extensión, cerrado para modificación.*

```php
// ❌ MAL: Cada nuevo descuento requiere modificar la clase
class Carrito
{
    public function calcularDescuento(string $tipo): float
    {
        if ($tipo === 'navidad') return 0.20;
        if ($tipo === 'vip') return 0.30;
        if ($tipo === 'estudiante') return 0.15;
        // Si agrego un nuevo tipo, tengo que modificar esta clase
    }
}

// ✅ BIEN: Extensible sin modificar
interface Descuento
{
    public function calcular(float $subtotal): float;
}

class DescuentoNavidad implements Descuento
{
    public function calcular(float $subtotal): float
    {
        return $subtotal * 0.20;
    }
}

class DescuentoVIP implements Descuento
{
    public function calcular(float $subtotal): float
    {
        return $subtotal * 0.30;
    }
}

class Carrito
{
    public function aplicarDescuento(Descuento $descuento): float
    {
        return $descuento->calcular($this->subtotal);
    }
}
```

#### L — Liskov Substitution Principle

> *Las subclases deben poder reemplazar a sus clases padre sin romper el programa.*

```php
class Ave
{
    public function volar(): string
    {
        return "Estoy volando";
    }
}

// ❌ MAL: Un Pingüino es un Ave pero no puede volar
class Pinguino extends Ave
{
    public function volar(): string
    {
        throw new \Exception("¡Los pingüinos no vuelan!"); // ¡Viola LSP!
    }
}

// ✅ BIEN: Separar las interfaces
interface AveVoladora
{
    public function volar(): string;
}

interface AveNadadora
{
    public function nadar(): string;
}

class Aguila implements AveVoladora
{
    public function volar(): string { return "Volando alto"; }
}

class Pinguino implements AveNadadora
{
    public function nadar(): string { return "Nadando veloz"; }
}
```

#### I — Interface Segregation Principle

> *No forzar a implementar métodos que no se necesitan.*

```php
// ❌ MAL: Interfaz "gorda"
interface Trabajador
{
    public function trabajar(): void;
    public function comer(): void;
    public function dormir(): void;
}

// Un robot no come ni duerme pero está obligado a implementarlo
class Robot implements Trabajador
{
    public function trabajar(): void { /* OK */ }
    public function comer(): void { /* ??? No aplica */ }
    public function dormir(): void { /* ??? No aplica */ }
}

// ✅ BIEN: Interfaces pequeñas y específicas
interface Trabajable { public function trabajar(): void; }
interface Comible { public function comer(): void; }
interface Dormible { public function dormir(): void; }

class Humano implements Trabajable, Comible, Dormible { /* implementa todo */ }
class Robot implements Trabajable { /* solo lo que necesita */ }
```

#### D — Dependency Inversion Principle

> *Depender de abstracciones, no de implementaciones concretas.*

```php
// ❌ MAL: Dependencia directa de implementación concreta
class NotificacionService
{
    private EmailService $emailService;

    public function __construct()
    {
        $this->emailService = new EmailService(); // Acoplamiento directo
    }
}

// ✅ BIEN: Inyección de dependencias
interface Notificador
{
    public function notificar(string $mensaje, string $destinatario): void;
}

class EmailNotificador implements Notificador { /* ... */ }
class SMSNotificador implements Notificador { /* ... */ }
class WhatsAppNotificador implements Notificador { /* ... */ }

class NotificacionService
{
    public function __construct(
        private Notificador $notificador // Dependemos de la abstracción
    ) {}

    public function enviarAlerta(string $mensaje, string $usuario): void
    {
        $this->notificador->notificar($mensaje, $usuario);
    }
}

// En producción
$service = new NotificacionService(new EmailNotificador());

// Para tests, fácil de mockear
$service = new NotificacionService(new FakeNotificador());
```

---

### ⚡ Novedades PHP 8.x que DEBES conocer

```php
// 1. Match Expression (PHP 8.0) — como switch pero con superpoderes
$status = 404;
$mensaje = match($status) {
    200, 201 => 'Éxito',
    404 => 'No encontrado',
    500 => 'Error del servidor',
    default => 'Estado desconocido'
};

// 2. Nullsafe Operator (PHP 8.0)
// ❌ Antes
$ciudad = null;
if ($user !== null) {
    $address = $user->getAddress();
    if ($address !== null) {
        $ciudad = $address->getCity();
    }
}

// ✅ Ahora
$ciudad = $user?->getAddress()?->getCity(); // null si algo falla

// 3. Union Types (PHP 8.0)
function parsearId(int|string $id): int
{
    return is_string($id) ? (int) $id : $id;
}

// 4. Named Arguments (PHP 8.0)
function crearUsuario(string $nombre, int $edad, string $email): void {}

crearUsuario(
    email: 'juan@mail.com',
    nombre: 'Juan',
    edad: 25
); // El orden no importa

// 5. Fibers (PHP 8.1) — concurrencia liviana
$fiber = new Fiber(function(): void {
    $valor = Fiber::suspend('primer valor');
    echo "Recibí: $valor\n";
});

$primerValor = $fiber->start();
$fiber->resume('hola');

// 6. Enums (PHP 8.1)
enum Estado: string
{
    case Activo = 'activo';
    case Inactivo = 'inactivo';
    case Suspendido = 'suspendido';

    public function etiqueta(): string
    {
        return match($this) {
            Estado::Activo => '✅ Activo',
            Estado::Inactivo => '⭕ Inactivo',
            Estado::Suspendido => '🚫 Suspendido',
        };
    }
}

$estado = Estado::Activo;
echo $estado->etiqueta(); // "✅ Activo"
echo $estado->value;      // "activo"

// 7. Readonly Properties (PHP 8.1)
class Punto
{
    public function __construct(
        public readonly float $x,
        public readonly float $y,
    ) {}
}

$punto = new Punto(1.5, 2.5);
// $punto->x = 3.0; // ❌ Error: no se puede modificar readonly
```

> 🏆 **Consejo Pro:** Activá el análisis estático con PHPStan o Psalm desde el día 1. Te va a ahorrar horas de debugging encontrando errores antes de que el código corra.

---

## Nivel 2 — Laravel Mastery

> 💡 **Analogía:** Si PHP es el motor de un auto, Laravel es el auto completo ensamblado, con GPS, aire acondicionado y asistente de estacionamiento incluidos.

Laravel es el framework PHP más popular del mundo. No porque sea "fácil", sino porque es **elegante** y **poderoso**.

---

### 📌 Service Container — El Corazón de Laravel

El Service Container (o IoC Container) es el sistema de inyección de dependencias de Laravel. Es lo que hace que "la magia de Laravel" funcione.

> 💡 **Analogía:** Imaginá una farmacia inteligente. Le decís "necesito un analgésico" y ella decide qué marca darte según el contexto. El Service Container es esa farmacia: vos pedís una abstracción y él decide qué implementación concreta entregarte.

```php
// Registrar un binding en AppServiceProvider
use App\Contracts\PagoGateway;
use App\Services\MercadoPagoGateway;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Cada vez que alguien pida PagoGateway, dale MercadoPago
        $this->app->bind(PagoGateway::class, MercadoPagoGateway::class);

        // Singleton: misma instancia en toda la request
        $this->app->singleton(CacheService::class, function ($app) {
            return new CacheService(
                redis: $app->make(Redis::class),
                prefix: config('cache.prefix')
            );
        });
    }
}

// En tu controlador: Laravel inyecta automáticamente
class PedidoController extends Controller
{
    public function __construct(
        private PagoGateway $pago, // Laravel resuelve la implementación
        private PedidoRepository $pedidos
    ) {}

    public function store(Request $request): JsonResponse
    {
        $pedido = $this->pedidos->crear($request->validated());
        $this->pago->cobrar($pedido->total, $pedido->tarjeta);
        return response()->json($pedido, 201);
    }
}
```

**Binding condicional según entorno:**

```php
// En tests, usar implementación falsa
if (app()->environment('testing')) {
    $this->app->bind(PagoGateway::class, FakePagoGateway::class);
}
```

---

### 📌 Eloquent — El ORM más Elegante

Eloquent convierte las filas de tu base de datos en objetos PHP. Hacés consultas complejas con código limpio y legible.

```php
// Definir un modelo
class Producto extends Model
{
    protected $fillable = ['nombre', 'precio', 'stock', 'categoria_id'];

    protected $casts = [
        'precio' => 'decimal:2',
        'activo' => 'boolean',
        'tags' => 'array',
        'publicado_en' => 'datetime',
    ];

    // Relaciones
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class);
    }

    public function imagenes(): HasMany
    {
        return $this->hasMany(Imagen::class);
    }

    public function etiquetas(): BelongsToMany
    {
        return $this->belongsToMany(Etiqueta::class);
    }

    // Scopes reutilizables
    public function scopeActivos(Builder $query): Builder
    {
        return $query->where('activo', true)->where('stock', '>', 0);
    }

    public function scopeEnPrecio(Builder $query, float $min, float $max): Builder
    {
        return $query->whereBetween('precio', [$min, $max]);
    }

    // Mutators/Accessors (PHP 8.x style)
    protected function nombre(): Attribute
    {
        return Attribute::make(
            get: fn($value) => ucwords($value),
            set: fn($value) => strtolower($value),
        );
    }
}

// Usando el modelo
$productos = Producto::activos()
    ->enPrecio(100, 500)
    ->with(['categoria', 'imagenes']) // Eager loading (evita N+1)
    ->orderBy('precio')
    ->paginate(20);

// Crear con validación
$producto = Producto::create([
    'nombre' => 'Notebook ASUS',
    'precio' => 899.99,
    'stock' => 15,
    'categoria_id' => 3,
]);

// Buscar o crear
$usuario = Usuario::firstOrCreate(
    ['email' => 'juan@mail.com'],
    ['nombre' => 'Juan', 'plan' => 'free']
);

// Upsert masivo (muy eficiente)
Producto::upsert(
    $productos, // datos
    ['sku'],    // columna única
    ['precio', 'stock'] // columnas a actualizar
);
```

**El problema N+1 y cómo resolverlo:**

```php
// ❌ N+1: 1 query para pedidos + N queries para usuarios
$pedidos = Pedido::all();
foreach ($pedidos as $pedido) {
    echo $pedido->usuario->nombre; // Query por cada iteración!
}

// ✅ Eager Loading: 2 queries totales, sin importar cuántos pedidos
$pedidos = Pedido::with('usuario')->get();
foreach ($pedidos as $pedido) {
    echo $pedido->usuario->nombre; // Ya está en memoria
}

// ✅ Lazy Eager Loading (cuando ya tenés la colección)
$pedidos = Pedido::all();
$pedidos->load('usuario');
```

---

### 📌 Middleware — La Capa de Filtros

> 💡 **Analogía:** Los middlewares son como los controles de seguridad en un aeropuerto. Antes de que llegues a la puerta de embarque (controlador), pasás por: control de documentos (auth), detector de metales (rate limiting), revisión de equipaje (validación). Podés agregar o quitar controles sin cambiar el avión.

```php
// Crear un middleware
class VerificarSuscripcion
{
    public function handle(Request $request, Closure $next): Response
    {
        $usuario = $request->user();

        if (!$usuario->tienesSuscripcionActiva()) {
            return response()->json([
                'error' => 'Tu suscripción ha expirado',
                'upgrade_url' => route('suscripcion.planes')
            ], 403);
        }

        // Agregar info al request para usarla en el controlador
        $request->merge(['plan_activo' => $usuario->plan]);

        return $next($request);
    }
}

// Registrar en bootstrap/app.php (Laravel 11) o Kernel (Laravel 10)
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'suscripcion' => VerificarSuscripcion::class,
    ]);
})

// Usar en rutas
Route::middleware(['auth:sanctum', 'suscripcion'])->group(function () {
    Route::get('/dashboard', DashboardController::class);
    Route::apiResource('/proyectos', ProyectoController::class);
});

// Middleware con parámetros
class TieneRol
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()->tieneAlgunRol($roles)) {
            abort(403, 'Sin permisos suficientes');
        }

        return $next($request);
    }
}

// Uso: 'rol:admin,editor'
Route::get('/admin', AdminController::class)->middleware('rol:admin');
```

**Pipeline de middlewares:**

```
Request → [Auth] → [RateLimit] → [CORS] → [Log] → Controller → Response
```

---

### 🏗️ Estructura de un Proyecto Laravel Profesional

```
app/
├── Console/         # Comandos artisan
├── Exceptions/      # Manejo de errores global
├── Http/
│   ├── Controllers/ # Delgados: reciben, validan, responden
│   ├── Middleware/
│   └── Requests/    # Form Requests: validación
├── Models/          # Eloquent models
├── Observers/       # Hooks de eventos del modelo
├── Policies/        # Autorización
├── Providers/       # Service providers
├── Repositories/    # Capa de acceso a datos (opcional)
└── Services/        # Lógica de negocio
```

> 🏆 **Consejo Pro:** El controlador nunca debería tener lógica de negocio. Si tu controlador tiene más de 5 líneas por método (excluyendo validación), extraé esa lógica a un Service.

---

## Nivel 4 — Queues & Jobs

### 🎯 ¿Qué problema resuelven?

> 💡 **Analogía:** Imaginá que tenés una pizzería. Cuando llega un pedido no podés hacer esperar al cliente 30 minutos parado en la caja mientras se hace la pizza. Le das un número, el pedido va a la cocina (queue), y el cliente se sienta. Las queues hacen lo mismo para tu app: procesar cosas pesadas sin bloquear la respuesta HTTP.

```php
// SIN queues: El usuario espera 10 segundos
public function register(Request $request): JsonResponse
{
    $user = User::create($request->validated());
    
    // Esto tarda 3 segundos
    Mail::to($user)->send(new BienvenidaMail($user));
    
    // Esto tarda 2 segundos
    $this->generarThumbnail($user->avatar);
    
    // Esto tarda 5 segundos
    $this->notificarSlack($user);
    
    return response()->json($user); // El usuario esperó 10 segundos 😤
}

// CON queues: Respuesta inmediata
public function register(Request $request): JsonResponse
{
    $user = User::create($request->validated());
    
    // Estos jobs se encolan y se procesan en background
    dispatch(new EnviarBienvenidaJob($user));
    dispatch(new GenerarThumbnailJob($user->avatar))->delay(now()->addSeconds(5));
    dispatch(new NotificarSlackJob($user));
    
    return response()->json($user); // Respuesta en 50ms 🚀
}
```

---

### 📌 Crear y Diseñar Jobs

```php
// php artisan make:job ProcesarPagoJob
class ProcesarPagoJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // Configuración del job
    public int $tries = 3;           // Reintentos si falla
    public int $timeout = 120;       // Máximo tiempo en segundos
    public int $backoff = 60;        // Esperar 60s entre reintentos

    public function __construct(
        private readonly Pedido $pedido,
        private readonly string $tokenTarjeta
    ) {}

    public function handle(PagoGateway $gateway): void
    {
        try {
            $resultado = $gateway->cobrar(
                monto: $this->pedido->total,
                token: $this->tokenTarjeta
            );

            $this->pedido->update([
                'estado' => 'pagado',
                'transaccion_id' => $resultado->id
            ]);

            // Encolar otro job (jobs en cadena)
            PrepararEnvioJob::dispatch($this->pedido);

        } catch (TarjetaRechazadaException $e) {
            // No reintentar, notificar usuario
            $this->pedido->update(['estado' => 'pago_rechazado']);
            $this->fail($e); // Marcar como fallido sin reintentar
        }
    }

    public function failed(\Throwable $exception): void
    {
        // Se llama cuando se agotan los reintentos
        Log::error("Pago fallido para pedido {$this->pedido->id}", [
            'error' => $exception->getMessage()
        ]);

        Notification::send(
            $this->pedido->usuario,
            new PagoFallidoNotification($this->pedido)
        );
    }
}
```

---

### 📌 Horizon — El Dashboard de tus Queues

Laravel Horizon es el panel de control para monitorear queues en tiempo real.

```bash
composer require laravel/horizon
php artisan horizon:install
php artisan horizon
```

```php
// config/horizon.php — Configuración de workers
'environments' => [
    'production' => [
        'supervisor-1' => [
            'maxProcesses' => 10,        // Workers en paralelo
            'balanceMaxShift' => 1,
            'balanceCooldown' => 3,
        ],
        'supervisor-emails' => [
            'queue' => ['emails'],       // Queue específica
            'maxProcesses' => 5,
            'timeout' => 60,
        ],
    ],
],

// Prioridades de queues
'queues' => ['critical', 'high', 'default', 'low'],
```

**Dispatch a queues específicas:**

```php
// Queue crítica: pagos, seguridad
ProcesarPagoJob::dispatch($pedido)->onQueue('critical');

// Queue normal: emails, notificaciones
EnviarEmailJob::dispatch($user)->onQueue('emails');

// Queue baja: reportes, analytics
GenerarReporteJob::dispatch($params)->onQueue('low');
```

---

### 📌 Batch Jobs — Procesamiento Masivo

```php
// Procesar 10,000 usuarios en paralelo
$batch = Bus::batch(
    collect($usuarios)->map(fn($usuario) => new EnviarPromocionJob($usuario))
)->then(function (Batch $batch) {
    Log::info("Campaña completada: {$batch->totalJobs} emails enviados");
})->catch(function (Batch $batch, \Throwable $e) {
    Log::error("Error en campaña: " . $e->getMessage());
})->finally(function (Batch $batch) {
    // Siempre se ejecuta, éxito o error
    CampañaMarketing::find($batch->name)->marcarComoFinalizada();
})->name('campana-promo-navidad')
  ->onQueue('emails')
  ->dispatch();

// Ver progreso
$batch->progress(); // 0-100
$batch->processedJobs();
$batch->totalJobs;
```

> 🏆 **Consejo Pro:** Siempre usá `ShouldBeUnique` en jobs que no deberían correr en paralelo (como generar el reporte mensual de un usuario). Sin esto, si el usuario hace click dos veces, generás el reporte dos veces.

---

## Nivel 5 — Redis

### 🎯 ¿Qué es Redis?

> 💡 **Analogía:** Redis es como tu escritorio de trabajo vs. un archivo en el sótano. Tu base de datos SQL es el sótano: tiene todo ordenado, pero bajar y subir lleva tiempo. Redis es el escritorio: lo que más usás está ahí, al alcance de la mano, instantáneo. Pero el escritorio tiene espacio limitado.

Redis es una base de datos en memoria, extremadamente rápida (microsegundos vs milisegundos de SQL).

---

### 📌 Caching — Turbochargeá tus Queries

```php
// Cache básico
$productos = Cache::remember('productos.activos', now()->addHour(), function () {
    return Producto::activos()->with('categoria')->get();
});

// Cache con tags (para invalidación granular)
$productosCat3 = Cache::tags(['productos', 'categoria:3'])
    ->remember('productos.categoria.3', 3600, function () {
        return Producto::where('categoria_id', 3)->get();
    });

// Cuando actualiza un producto de categoría 3:
Cache::tags(['categoria:3'])->flush(); // Solo borra ese cache, no todo

// Patrón Cache-Aside manual
class ProductoRepository
{
    public function buscarPorId(int $id): ?Producto
    {
        $cacheKey = "producto:{$id}";
        
        return Cache::remember($cacheKey, 3600, function () use ($id) {
            return Producto::with(['categoria', 'imagenes'])->find($id);
        });
    }

    public function actualizar(int $id, array $datos): Producto
    {
        $producto = Producto::findOrFail($id)->update($datos);
        
        // Invalidar cache
        Cache::forget("producto:{$id}");
        Cache::tags(['productos'])->flush();
        
        return $producto->fresh();
    }
}
```

**Métricas de ahorro real:**

```
Sin cache: Query SQL = 150ms
Con cache Redis: = 0.5ms
Mejora: 300x más rápido
```

---

### 📌 Sessions — Sesiones Escalables

```php
// .env
SESSION_DRIVER=redis

// config/session.php
'driver' => env('SESSION_DRIVER', 'redis'),
'lifetime' => env('SESSION_LIFETIME', 120),
'connection' => 'session', // Conexión Redis separada

// Almacenar en sesión
session(['carrito' => $items]);
session(['ultimo_acceso' => now()]);

// Recuperar
$carrito = session('carrito', []); // [] es el default
```

> 💡 **¿Por qué Redis para sessions?** Con archivos, si tenés 3 servidores PHP, cada uno tiene sus propias sesiones. El usuario que se loguea en el servidor 1 no está logueado en el servidor 2. Redis centraliza las sesiones: todos los servidores ven las mismas.

---

### 📌 Rate Limiting — Protección contra Abuso

```php
// En RouteServiceProvider o bootstrap/app.php
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('login', function (Request $request) {
    return [
        Limit::perMinute(10)->by($request->ip()),
        Limit::perMinute(5)->by($request->input('email')),
    ];
});

// Rate limiting manual con Redis
class ApiController extends Controller
{
    public function webhook(Request $request): JsonResponse
    {
        $ip = $request->ip();
        $key = "webhook:rate:{$ip}";
        
        $intentos = Redis::incr($key);
        
        if ($intentos === 1) {
            Redis::expire($key, 60); // 60 segundos ventana
        }
        
        if ($intentos > 100) {
            return response()->json(['error' => 'Rate limit exceeded'], 429);
        }
        
        // Procesar webhook...
    }
}
```

**Redis para leaderboards y contadores en tiempo real:**

```php
// Top productos más vistos
Redis::zincrby('productos:visitas', 1, $productoId);

$topProductos = Redis::zrevrange('productos:visitas', 0, 9, true);
// ['producto:15' => 1250, 'producto:3' => 987, ...]

// Usuarios online en tiempo real
Redis::setex("usuario:online:{$userId}", 300, 1); // 5 min
$usuariosOnline = Redis::keys('usuario:online:*');
```

---

## Nivel 6 — Docker

### 🎯 ¿Por qué Docker?

> 💡 **Analogía:** Docker es como un contenedor de transporte marítimo. Antes de los contenedores, cargar un barco era un caos: cada bulto tenía forma distinta. Con contenedores: todo tiene el mismo formato, se apila igual, se maneja igual, sin importar qué haya adentro. Tu app, con Docker, funciona igual en tu laptop, en el servidor de tu colega y en producción.

El mantra es: *"Works on my machine"* → "Works everywhere".

---

### 📌 Dockerfile para PHP

```dockerfile
# Dockerfile
FROM php:8.3-fpm-alpine

# Instalar extensiones necesarias
RUN docker-php-ext-install pdo pdo_mysql opcache

# Instalar extensiones adicionales
RUN apk add --no-cache $PHPIZE_DEPS redis
RUN pecl install redis && docker-php-ext-enable redis

# Opcache para producción (mejora el rendimiento)
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini
RUN echo "opcache.memory_consumption=256" >> /usr/local/etc/php/conf.d/opcache.ini

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar archivos de Composer primero (cache de layers)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copiar el resto de la app
COPY . .

RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

EXPOSE 9000
CMD ["php-fpm"]
```

---

### 📌 Docker Compose — El Orquestador Local

```yaml
# docker-compose.yml
version: '3.9'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - .:/var/www/html          # Para desarrollo: live reload
    depends_on:
      - mysql
      - redis
    environment:
      - APP_ENV=local
      - DB_HOST=mysql
      - REDIS_HOST=redis
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - .:/var/www/html
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app
    networks:
      - app-network

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: laravel
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_USER: laravel
      MYSQL_PASSWORD: secret
    volumes:
      - mysql-data:/var/lib/mysql  # Persistencia de datos
    ports:
      - "3306:3306"               # Solo para desarrollo local
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network

  queue:
    build:
      context: .
    command: php artisan queue:work --sleep=3 --tries=3
    depends_on:
      - app
      - redis
    networks:
      - app-network

volumes:
  mysql-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

```bash
# Comandos esenciales
docker-compose up -d          # Levantár en background
docker-compose down           # Bajar todo
docker-compose logs -f app    # Ver logs en tiempo real
docker-compose exec app bash  # Entrar al contenedor

# Ejecutar comandos Artisan
docker-compose exec app php artisan migrate
docker-compose exec app php artisan tinker
```

---

### 📌 Laravel Sail — Docker para Desarrolladores PHP

Sail es la abstracción de Docker de Laravel. Sin conocer Docker podés levantarlo.

```bash
# Instalar en proyecto existente
composer require laravel/sail --dev
php artisan sail:install

# Usar sail
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate
./vendor/bin/sail composer require spatie/laravel-permission
./vendor/bin/sail npm run dev

# Alias útil
alias sail='./vendor/bin/sail'
sail up -d && sail artisan migrate:fresh --seed
```

> 🏆 **Consejo Pro:** Nunca instales PHP, MySQL ni Nginx directamente en tu computadora para desarrollo. Usá Docker/Sail. Cuando cambies de proyecto o de máquina, `docker-compose up` y listo, sin conflictos de versiones.

---

## Nivel 7 — AI Integration

### 🎯 El mayor diferenciador de un developer moderno

> 💡 **Analogía:** Antes, un developer era un albañil construyendo ladrillo a ladrillo. Con AI integration, sos un arquitecto con una cuadrilla de robots que hacen el trabajo pesado. Vos diseñás, orchestrás, validás.

---

### 📌 OpenAI & Claude — Integración Básica

```php
// composer require openai-php/client
use OpenAI\Laravel\Facades\OpenAI;

class AsistenteProductoService
{
    public function generarDescripcion(Producto $producto): string
    {
        $response = OpenAI::chat()->create([
            'model' => 'gpt-4o',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Sos un experto en marketing de productos tech. 
                                  Escribís descripciones concisas, atractivas y con SEO.'
                ],
                [
                    'role' => 'user',
                    'content' => "Escribí una descripción para: {$producto->nombre}. 
                                  Especificaciones: {$producto->specs}. 
                                  Precio: \${$producto->precio}. 
                                  Máximo 150 palabras."
                ]
            ],
            'max_tokens' => 300,
            'temperature' => 0.7,
        ]);

        return $response->choices[0]->message->content;
    }

    public function clasificarReseña(string $texto): array
    {
        $response = OpenAI::chat()->create([
            'model' => 'gpt-4o-mini', // Modelo barato para clasificación
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Respondé solo con JSON válido, sin markdown.'
                ],
                [
                    'role' => 'user',
                    'content' => "Clasificá esta reseña: '{$texto}'
                                  JSON format: {\"sentimiento\": \"positivo|negativo|neutro\", 
                                               \"puntuacion\": 1-5, 
                                               \"categorias\": [\"calidad\", \"precio\", etc]}"
                ]
            ],
        ]);

        return json_decode($response->choices[0]->message->content, true);
    }
}
```

**Integración con Claude (Anthropic):**

```php
// Usando HTTP Client de Laravel
class ClaudeService
{
    public function __construct(
        private readonly \Illuminate\Http\Client\Factory $http
    ) {}

    public function analizar(string $prompt, string $contexto = ''): string
    {
        $response = $this->http
            ->withHeaders([
                'x-api-key' => config('services.anthropic.key'),
                'anthropic-version' => '2023-06-01',
            ])
            ->post('https://api.anthropic.com/v1/messages', [
                'model' => 'claude-sonnet-4-5',
                'max_tokens' => 1024,
                'system' => $contexto ?: 'Sos un asistente técnico para aplicaciones Laravel.',
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ]
            ]);

        return $response->json('content.0.text');
    }
}
```

---

### 📌 RAG — Retrieval-Augmented Generation

RAG es la técnica para darle a los LLMs conocimiento de TU negocio sin fine-tuning.

> 💡 **Analogía:** Un LLM sabe todo lo que está en internet hasta cierta fecha, pero no sabe nada de TU empresa, TUS documentos, TU base de datos. RAG es como darle un "manual de la empresa" al asistente antes de cada pregunta. Buscás los documentos relevantes y se los pasás como contexto.

```php
// 1. Vectorizar documentos (embeddings)
class DocumentoEmbeddingService
{
    public function vectorizar(Documento $documento): void
    {
        // Dividir en chunks (fragmentos manejables)
        $chunks = $this->dividirEnChunks($documento->contenido, maxTokens: 500);

        foreach ($chunks as $index => $chunk) {
            // Obtener embedding del chunk
            $response = OpenAI::embeddings()->create([
                'model' => 'text-embedding-3-small',
                'input' => $chunk,
            ]);

            $embedding = $response->embeddings[0]->embedding; // Array de 1536 floats

            // Guardar en base de datos vectorial (pgvector, Pinecone, Weaviate)
            DocumentoVector::create([
                'documento_id' => $documento->id,
                'chunk_index' => $index,
                'contenido' => $chunk,
                'embedding' => $embedding, // Se guarda como vector
            ]);
        }
    }
}

// 2. Buscar documentos similares
class BusquedaSemanticaService
{
    public function buscar(string $pregunta, int $topK = 5): array
    {
        // Vectorizar la pregunta
        $preguntaEmbedding = OpenAI::embeddings()->create([
            'model' => 'text-embedding-3-small',
            'input' => $pregunta,
        ])->embeddings[0]->embedding;

        // Búsqueda por similitud coseno en pgvector
        return DB::select("
            SELECT contenido, documento_id,
                   1 - (embedding <=> ?) AS similitud
            FROM documento_vectors
            ORDER BY embedding <=> ?
            LIMIT ?
        ", [
            json_encode($preguntaEmbedding),
            json_encode($preguntaEmbedding),
            $topK
        ]);
    }
}

// 3. Responder con contexto
class ChatbotService
{
    public function responder(string $pregunta, int $userId): string
    {
        // Buscar documentos relevantes
        $documentosRelevantes = $this->busqueda->buscar($pregunta);
        
        $contexto = collect($documentosRelevantes)
            ->pluck('contenido')
            ->join("\n---\n");

        // Historial de la conversación
        $historial = $this->obtenerHistorial($userId);

        $response = OpenAI::chat()->create([
            'model' => 'gpt-4o',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => "Respondé basándote SOLO en el siguiente contexto. 
                                  Si no encontrás la respuesta, decilo claramente.
                                  
                                  CONTEXTO:
                                  {$contexto}"
                ],
                ...$historial,
                ['role' => 'user', 'content' => $pregunta]
            ],
        ]);

        $respuesta = $response->choices[0]->message->content;
        
        // Guardar en historial
        $this->guardarMensaje($userId, $pregunta, $respuesta);
        
        return $respuesta;
    }
}
```

> 🏆 **Consejo Pro:** No uses GPT-4 para todo. Para clasificación simple, extracción de datos, resúmenes cortos, usá `gpt-4o-mini` o `claude-haiku`. Es 10x más barato y casi la misma calidad. Usá los modelos grandes solo donde realmente importa el razonamiento complejo.

---

## Nivel 8 — Cloud Deployment

### 🎯 Del "funciona en mi máquina" al "funciona para todos"

> 💡 **Analogía:** Desarrollar localmente es cocinar en tu casa. Deployar a producción es abrir un restaurante. No solo necesitás la receta (código), necesitás la cocina industrial (servidores), el personal (workers), los proveedores (servicios externos), y el sistema para que 1000 clientes coman al mismo tiempo.

---

### 📌 AWS — La Plataforma Más Potente

Los servicios AWS más usados con Laravel:

```
┌─────────────────────────────────────────────────┐
│                    AWS Stack Laravel              │
│                                                   │
│  Route 53 (DNS)                                   │
│      ↓                                            │
│  CloudFront (CDN) + WAF (Firewall)                │
│      ↓                                            │
│  ALB - Application Load Balancer                  │
│      ↓                                            │
│  ECS (Containers) / EC2 (Servidores)              │
│      ↓                                            │
│  RDS (MySQL/PostgreSQL) + ElastiCache (Redis)     │
│                                                   │
│  S3 (Archivos) + SES (Emails) + SQS (Queues)      │
└─────────────────────────────────────────────────┘
```

**Integración S3 con Laravel:**

```php
// config/filesystems.php ya tiene S3 configurado
// Solo necesitás las credenciales en .env:
// AWS_ACCESS_KEY_ID=xxx
// AWS_SECRET_ACCESS_KEY=xxx
// AWS_DEFAULT_REGION=us-east-1
// AWS_BUCKET=mi-bucket

// Subir archivo
Storage::disk('s3')->put('uploads/foto.jpg', $contenido);

// URL firmada (expira en 1 hora)
$url = Storage::disk('s3')->temporaryUrl('uploads/foto.jpg', now()->addHour());

// Mover archivos
Storage::disk('s3')->move('temp/archivo.pdf', 'definitivo/archivo.pdf');

// En un Job (procesar imagen en background)
class ProcesarImagenJob implements ShouldQueue
{
    public function handle(): void
    {
        $imagen = Storage::disk('s3')->get($this->path);
        
        // Procesar con Intervention Image
        $thumbnail = Image::make($imagen)->resize(300, 300)->encode('jpg');
        
        Storage::disk('s3')->put(
            str_replace('original/', 'thumbnails/', $this->path),
            $thumbnail
        );
    }
}
```

---

### 📌 Laravel Forge — Deploy sin Ser DevOps

Forge es el servidor manager de Laravel. Administrás servers de AWS/DigitalOcean/Linode sin saber de Linux.

```bash
# Lo que Forge hace automáticamente:
✅ Instala PHP 8.3, Nginx, MySQL, Redis
✅ Configura SSL con Let's Encrypt
✅ Configura Queue Workers y schedulers
✅ Deploy automático desde GitHub/GitLab
✅ Backups automáticos de BD

# Tu deploy script en Forge:
cd /home/forge/miapp.com
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:restart
echo "Deploy completado 🚀"
```

---

### 📌 Laravel Vapor — Serverless PHP

> 💡 **Analogía:** Con servidores tradicionales alquilás una camioneta aunque a veces solo necesités una bicicleta. Con Vapor (serverless) pagás por cada viaje: si no hay tráfico, no pagás nada; si hay 10,000 visitas simultáneas, escala automáticamente.

```php
// vapor.yml
id: 12345
name: mi-app
environments:
  production:
    memory: 1024
    timeout: 30
    runtime: 'php-8.3:al2023'
    cli-memory: 512
    
    build:
      - 'composer install --no-dev --optimize-autoloader'
      - 'php artisan config:cache'
      
    deploy:
      - 'php artisan migrate --force'
      
    queues:
      - queue: default
        memory: 1024
        timeout: 60
```

```bash
# Deploy a producción
vapor deploy production

# Variables de entorno
vapor env:pull production
vapor env:push production
```

---

### 📌 CI/CD — Automatización Total

```yaml
# .github/workflows/deploy.yml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_DATABASE: testing
          MYSQL_ROOT_PASSWORD: root
        
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: mbstring, mysql, redis
          
      - name: Install dependencies
        run: composer install --prefer-dist --optimize-autoloader
        
      - name: Run tests
        run: php artisan test --parallel
        
      - name: Static analysis
        run: ./vendor/bin/phpstan analyse --level=8

  deploy:
    needs: test  # Solo deploy si tests pasan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Forge
        uses: aglipanci/laravel-forge-deploy@v1
        with:
          forge-api-token: ${{ secrets.FORGE_API_TOKEN }}
          forge-site-id: ${{ secrets.FORGE_SITE_ID }}
```

---

## Nivel 9 — Senior Architecture

### 🎯 Diseñar sistemas que escalan y sobreviven al tiempo

> 💡 **Analogía:** Un junior construye una cabaña, un mid-level construye una casa, un senior diseña un edificio considerando los cimientos, la estructura, los sistemas de emergencia, la expansión futura y que 500 personas puedan vivir en él sin que se caiga.

---

### 📌 DDD — Domain-Driven Design

DDD organiza el código alrededor del **negocio**, no de la tecnología.

```
Bounded Contexts en un E-Commerce:
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Catálogo   │  │   Pedidos   │  │   Pagos     │
│  (Catalog)  │  │  (Orders)   │  │ (Payments)  │
│             │  │             │  │             │
│  Producto   │  │   Pedido    │  │  Factura    │
│  Categoria  │  │   LineItem  │  │  Transac.   │
│  Inventario │  │   Carrito   │  │  Reembolso  │
└─────────────┘  └─────────────┘  └─────────────┘
```

```php
// Value Object (inmutable, sin identidad)
final class Dinero
{
    public function __construct(
        public readonly int $centavos,
        public readonly string $moneda
    ) {
        if ($centavos < 0) throw new \InvalidArgumentException("No puede ser negativo");
    }

    public function sumar(Dinero $otro): self
    {
        if ($this->moneda !== $otro->moneda) {
            throw new \InvalidArgumentException("Monedas distintas");
        }
        return new self($this->centavos + $otro->centavos, $this->moneda);
    }

    public function esIgualA(Dinero $otro): bool
    {
        return $this->centavos === $otro->centavos && $this->moneda === $otro->moneda;
    }

    public static function fromFloat(float $monto, string $moneda = 'ARS'): self
    {
        return new self((int) round($monto * 100), $moneda);
    }

    public function toFloat(): float
    {
        return $this->centavos / 100;
    }
}

// Aggregate Root (entidad raíz que mantiene consistencia)
class Pedido
{
    private array $items = [];
    private array $eventos = [];
    private EstadoPedido $estado;

    private function __construct(
        private readonly PedidoId $id,
        private readonly UsuarioId $usuarioId,
    ) {
        $this->estado = EstadoPedido::Borrador;
    }

    public static function crear(UsuarioId $usuarioId): self
    {
        $pedido = new self(PedidoId::generar(), $usuarioId);
        $pedido->registrarEvento(new PedidoCreadoEvent($pedido->id, $usuarioId));
        return $pedido;
    }

    public function agregarItem(ProductoId $productoId, int $cantidad, Dinero $precio): void
    {
        if ($this->estado !== EstadoPedido::Borrador) {
            throw new \DomainException("No se puede modificar un pedido confirmado");
        }

        $this->items[] = new LineItem($productoId, $cantidad, $precio);
    }

    public function confirmar(): void
    {
        if (empty($this->items)) {
            throw new \DomainException("No se puede confirmar un pedido vacío");
        }

        $this->estado = EstadoPedido::Confirmado;
        $this->registrarEvento(new PedidoConfirmadoEvent($this->id, $this->calcularTotal()));
    }

    public function calcularTotal(): Dinero
    {
        return array_reduce(
            $this->items,
            fn(Dinero $acc, LineItem $item) => $acc->sumar($item->subtotal()),
            new Dinero(0, 'ARS')
        );
    }

    private function registrarEvento(object $evento): void
    {
        $this->eventos[] = $evento;
    }

    public function liberarEventos(): array
    {
        $eventos = $this->eventos;
        $this->eventos = [];
        return $eventos;
    }
}
```

---

### 📌 CQRS — Command Query Responsibility Segregation

> 💡 **Analogía:** En un banco, hay empleados que solo **escriben** (cajeros: reciben depósitos, hacen retiros) y empleados que solo **leen** (analistas: consultan saldos, generan reportes). Separarlos hace el sistema más rápido y escalable. CQRS hace lo mismo en código.

```php
// COMMAND — Escribe datos
class ConfirmarPedidoCommand
{
    public function __construct(
        public readonly string $pedidoId,
        public readonly string $metodoPago,
    ) {}
}

class ConfirmarPedidoHandler
{
    public function __construct(
        private PedidoRepository $pedidos,
        private EventBus $eventos,
    ) {}

    public function handle(ConfirmarPedidoCommand $command): void
    {
        $pedido = $this->pedidos->buscarPorId($command->pedidoId);
        $pedido->confirmar();
        $this->pedidos->guardar($pedido);
        
        foreach ($pedido->liberarEventos() as $evento) {
            $this->eventos->dispatch($evento);
        }
    }
}

// QUERY — Solo lee datos (puede usar una BD separada optimizada para lectura)
class ObtenerPedidosUsuarioQuery
{
    public function __construct(
        public readonly string $usuarioId,
        public readonly int $pagina = 1,
    ) {}
}

class ObtenerPedidosUsuarioHandler
{
    public function handle(ObtenerPedidosUsuarioQuery $query): array
    {
        // Puede ir directo a una vista desnormalizada, Read DB, Elasticsearch, etc.
        return DB::table('vista_pedidos_usuario')
            ->where('usuario_id', $query->usuarioId)
            ->orderBy('creado_en', 'desc')
            ->paginate(20, page: $query->pagina)
            ->toArray();
    }
}

// En el Controller
class PedidoController extends Controller
{
    public function store(ConfirmarPedidoRequest $request): JsonResponse
    {
        $this->commandBus->dispatch(
            new ConfirmarPedidoCommand($request->pedido_id, $request->metodo_pago)
        );
        
        return response()->json(['status' => 'procesando'], 202);
    }

    public function index(Request $request): JsonResponse
    {
        $resultado = $this->queryBus->ask(
            new ObtenerPedidosUsuarioQuery($request->user()->id)
        );
        
        return response()->json($resultado);
    }
}
```

---

### 📌 Event-Driven Systems — Microservicios con Eventos

```php
// Evento de dominio
class PedidoConfirmadoEvent
{
    public function __construct(
        public readonly string $pedidoId,
        public readonly string $usuarioId,
        public readonly float $total,
        public readonly \DateTimeImmutable $ocurridoEn = new \DateTimeImmutable()
    ) {}
}

// Los Listeners reaccionan al evento (desacoplados)
class EnviarEmailConfirmacionListener
{
    public function handle(PedidoConfirmadoEvent $event): void
    {
        $pedido = Pedido::find($event->pedidoId);
        Mail::to($pedido->usuario)->queue(new ConfirmacionPedidoMail($pedido));
    }
}

class ActualizarInventarioListener
{
    public function handle(PedidoConfirmadoEvent $event): void
    {
        // Reduce el stock de cada producto
        dispatch(new ActualizarStockJob($event->pedidoId));
    }
}

class NotificarAlmacenListener
{
    public function handle(PedidoConfirmadoEvent $event): void
    {
        // Notifica al sistema de logística
        Http::post(config('services.almacen.webhook'), [
            'pedido_id' => $event->pedidoId,
            'total' => $event->total,
        ]);
    }
}

// Registrar en EventServiceProvider
protected $listen = [
    PedidoConfirmadoEvent::class => [
        EnviarEmailConfirmacionListener::class,
        ActualizarInventarioListener::class,
        NotificarAlmacenListener::class,
    ],
];
```

**Event Sourcing — Guardar todos los eventos como fuente de verdad:**

```php
// En lugar de guardar el estado actual, guardás la historia de eventos
class EventStore
{
    public function guardar(string $aggregateId, array $eventos): void
    {
        foreach ($eventos as $evento) {
            DB::table('event_store')->insert([
                'aggregate_id' => $aggregateId,
                'aggregate_type' => get_class($evento),
                'evento_type' => get_class($evento),
                'payload' => json_encode($evento),
                'version' => $this->siguienteVersion($aggregateId),
                'ocurrido_en' => now(),
            ]);
        }
    }
    
    public function reconstruir(string $aggregateId): array
    {
        return DB::table('event_store')
            ->where('aggregate_id', $aggregateId)
            ->orderBy('version')
            ->pluck('payload')
            ->map(fn($e) => json_decode($e, true))
            ->toArray();
    }
}
```

---

### 📌 Testing — La Red de Seguridad

```php
// Feature Test (prueba el flujo completo)
class ConfirmarPedidoTest extends TestCase
{
    use RefreshDatabase;

    public function test_usuario_puede_confirmar_pedido(): void
    {
        // Arrange
        $usuario = User::factory()->create();
        $producto = Producto::factory()->create(['precio' => 100, 'stock' => 5]);
        
        $this->actingAs($usuario);
        
        // Act
        $response = $this->postJson('/api/pedidos', [
            'items' => [
                ['producto_id' => $producto->id, 'cantidad' => 2]
            ],
            'metodo_pago' => 'tarjeta'
        ]);
        
        // Assert
        $response->assertStatus(201)
                 ->assertJsonStructure(['id', 'total', 'estado']);
        
        $this->assertDatabaseHas('pedidos', [
            'usuario_id' => $usuario->id,
            'estado' => 'confirmado',
        ]);
        
        // Verificar que el stock bajó
        $this->assertDatabaseHas('productos', [
            'id' => $producto->id,
            'stock' => 3
        ]);
    }

    public function test_pedido_vacio_no_puede_confirmarse(): void
    {
        $usuario = User::factory()->create();
        $this->actingAs($usuario);
        
        $response = $this->postJson('/api/pedidos', ['items' => []]);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['items']);
    }
}

// Unit Test (prueba una clase aislada)
class DineroTest extends TestCase
{
    public function test_suma_dos_montos(): void
    {
        $precio = Dinero::fromFloat(100.50);
        $descuento = Dinero::fromFloat(15.00);
        
        $resultado = $precio->sumar($descuento);
        
        $this->assertEquals(11550, $resultado->centavos);
        $this->assertEquals(115.50, $resultado->toFloat());
    }

    public function test_no_puede_tener_monto_negativo(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        
        new Dinero(-100, 'ARS');
    }
}
```

---

## 🎓 Tu Plan de Carrera

### Roadmap de Tiempo Estimado

```
Mes 1-2:  Core PHP 8.x
├─ Semana 1-2: OOP (clases, interfaces, traits)
├─ Semana 3: Composer, PSR-4
└─ Semana 4-8: SOLID + PHP 8.x features + PHPStan

Mes 3-5:  Laravel Mastery
├─ Semana 1-2: Service Container, Facades, Helpers
├─ Semana 3-4: Eloquent avanzado (relaciones, scopes, observers)
└─ Semana 5-12: API REST completa + Auth + Tests

Mes 6-7:  Queues, Redis
├─ Semana 1-3: Jobs, Queues, Horizon
└─ Semana 4-8: Redis (cache, sessions, pub/sub)

Mes 8-9:  Docker + CI/CD
├─ Semana 1-4: Docker, Docker Compose, Sail
└─ Semana 5-8: GitHub Actions, Forge deploy

Mes 10-12: AI + Cloud
├─ Semana 1-4: OpenAI/Claude API, RAG básico
└─ Semana 5-8: AWS S3, SES, Vapor o Forge

Mes 13+:  Senior Architecture
└─ DDD, CQRS, Event Sourcing (aprendizaje continuo)
```

---

### ✅ Checklist por Nivel

#### Junior ✅
- [ ] PHP 8.x: OOP, tipos, enums, fibers
- [ ] Composer: autoload, require, semver
- [ ] SOLID: podés explicar y aplicar cada principio
- [ ] Laravel: CRUD completo con validación
- [ ] Eloquent: relaciones, scopes, factories
- [ ] Git: branches, PRs, rebase

#### Mid-Level ✅
- [ ] Queues y Jobs en producción
- [ ] Redis: cache con tags, sessions, rate limiting
- [ ] API REST: autenticación, versionado, documentación
- [ ] Tests: feature y unit tests, >70% coverage
- [ ] Docker: podés levantar y debuggear el stack

#### Senior ✅
- [ ] Docker: escribís Dockerfiles optimizados
- [ ] CI/CD: pipeline completo con tests automáticos
- [ ] AI: integraste al menos un LLM en un proyecto real
- [ ] Cloud: deployaste en AWS/Vapor/Forge con SSL, backup y monitoring

#### AI-Powered Engineer 🚀
- [ ] DDD: aplicás bounded contexts en proyectos grandes
- [ ] CQRS: separás lecturas y escrituras cuando tiene sentido
- [ ] Event-driven: diseñás sistemas con eventos de dominio
- [ ] Mentoring: podés explicarle todo esto a alguien más

---

### 🧰 Herramientas Esenciales del Ecosistema

| Categoría | Herramienta | Para qué |
|---|---|---|
| **Testing** | PHPUnit / Pest | Tests unitarios y de feature |
| **Análisis Estático** | PHPStan / Psalm | Errores en tiempo de desarrollo |
| **Debugging** | Xdebug / Ray | Debug sin var_dump |
| **Profiling** | Telescope / Debugbar | Performance en desarrollo |
| **Monitoreo** | Sentry / Bugsnag | Errores en producción |
| **Documentación** | Scribe / Swagger | Documentación automática de API |
| **ORM** | Eloquent + Scout | Búsqueda full-text |
| **Auth** | Sanctum / Passport | API tokens / OAuth2 |
| **Permisos** | Spatie Permission | Roles y permisos |
| **Media** | Spatie Media Library | Archivos adjuntos |
| **Jobs** | Horizon + Telescope | Monitoreo de queues |

---

### 💬 Filosofía Final

> *"Keep Learning. Keep Building. Keep Growing."*

El roadmap no es una línea recta. Vas a volver a los fundamentos cuando trabajés en arquitectura. Vas a usar Docker antes de dominar Redis. **Eso está bien.**

Los mejores developers que conozco tienen en común:

1. **Escriben código que otros pueden leer.** Claridad > Cleverness.
2. **Priorizan la solución al problema sobre la tecnología.** No usás microservicios porque está de moda, los usás cuando el problema lo justifica.
3. **Testean su código.** No "lo probé a mano", sino tests automáticos.
4. **No reinventan la rueda.** Usan paquetes bien testeados para lo común, se concentran en el negocio.
5. **Son curiosos.** Leen código de otros, contribuyen a open source, exploran nuevas herramientas.

```php
// Tu filosofía como developer:
class Developer
{
    public function resolver(Problema $problema): Solución
    {
        return $this
            ->entenderElProblema($problema)
            ->buscarSoluciones()
            ->elegirLaMásSimple()
            ->escribirCódigoLimpio()
            ->agregar(Tests::completos())
            ->documentarDecisiones()
            ->deployarConConfianza()
            ->aprender($problema->lecciones());
    }
}
```

---

*Masterclass creada con ❤️ para la comunidad PHP hispanohablante · PHP Developer Roadmap 2026*