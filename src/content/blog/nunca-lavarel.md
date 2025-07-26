---
title: 'Laravel'
description: 'Laravel: Mejores Prácticas y Errores Críticos a Evitar'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Laravel: Mejores Prácticas y Errores Críticos a Evitar

## 🚫 NUNCA HAGAS ESTO EN LARAVEL

### 1. **NUNCA pongas lógica de negocio en controladores**

```php
// ❌ MAL - Controlador sobrecargado
class UserController extends Controller
{
    public function store(Request $request)
    {
        // Validación manual
        if (!$request->email) {
            return response()->json(['error' => 'Email required'], 400);
        }
      
        // Lógica de negocio compleja
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
      
        if ($user->age > 18) {
            $user->status = 'adult';
            // Enviar email de bienvenida
            Mail::to($user->email)->send(new WelcomeEmail());
        }
      
        $user->save();
      
        // Más lógica...
        return response()->json($user);
    }
}

// ✅ BIEN - Controlador delgado
class UserController extends Controller
{
    public function store(StoreUserRequest $request, UserService $userService)
    {
        $user = $userService->createUser($request->validated());
        return new UserResource($user);
    }
}
```

### 2. **NUNCA uses consultas directas en vistas**

```php
<!-- ❌ MAL -->
@foreach(User::where('active', 1)->get() as $user)
    <p>{{ $user->name }}</p>
@endforeach

<!-- ✅ BIEN -->
@foreach($users as $user)
    <p>{{ $user->name }}</p>
@endforeach
```

### 3. **NUNCA ignores Mass Assignment**

```php
// ❌ MAL - Vulnerable a mass assignment
User::create($request->all());

// ✅ BIEN - Usa fillable o validated()
User::create($request->validated());

// En el modelo
protected $fillable = ['name', 'email'];
// o
protected $guarded = ['id', 'created_at', 'updated_at'];
```

### 4. **NUNCA hagas consultas N+1**

```php
// ❌ MAL - N+1 queries
$users = User::all();
foreach ($users as $user) {
    echo $user->posts->count(); // Consulta por cada usuario
}

// ✅ BIEN - Eager loading
$users = User::with('posts')->get();
foreach ($users as $user) {
    echo $user->posts->count();
}
```

### 5. **NUNCA hardcodees valores en el código**

```php
// ❌ MAL
if ($user->role === 'admin') {
    // lógica
}

// ✅ BIEN - Usa constantes o enums
class UserRole 
{
    const ADMIN = 'admin';
    const USER = 'user';
}

if ($user->role === UserRole::ADMIN) {
    // lógica
}
```

### 6. **NUNCA uses DB::raw() sin sanitizar**

```php
// ❌ MAL - Vulnerable a SQL injection
$users = DB::select("SELECT * FROM users WHERE name = '" . $request->name . "'");

// ✅ BIEN
$users = DB::select("SELECT * FROM users WHERE name = ?", [$request->name]);
// o mejor aún
$users = User::where('name', $request->name)->get();
```

## 🎯 MEJORES PRÁCTICAS ESENCIALES

### 1. **Estructura de Proyecto Clara**

```
app/
├── Services/           # Lógica de negocio
├── Repositories/       # Acceso a datos
├── DTOs/              # Data Transfer Objects
├── Enums/             # Enumeraciones
├── Traits/            # Código reutilizable
├── Exceptions/        # Excepciones personalizadas
└── Actions/           # Acciones específicas
```

### 2. **Usa Service Classes para Lógica de Negocio**

```php
// app/Services/UserService.php
class UserService
{
    public function createUser(array $data): User
    {
        $user = User::create($data);
      
        if ($user->isAdult()) {
            $this->sendWelcomeEmail($user);
            $this->assignDefaultRole($user);
        }
      
        return $user;
    }
  
    private function sendWelcomeEmail(User $user): void
    {
        Mail::to($user->email)->send(new WelcomeEmail($user));
    }
}
```

### 3. **Usa Form Requests para Validación**

```php
// app/Http/Requests/StoreUserRequest.php
class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
  
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ];
    }
  
    public function messages(): array
    {
        return [
            'email.unique' => 'Este email ya está registrado.',
        ];
    }
}
```

### 4. **Usa Resources para APIs**

```php
// app/Http/Resources/UserResource.php
class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->when($this->isOwner($request->user()), $this->email),
            'posts_count' => $this->whenLoaded('posts', function () {
                return $this->posts->count();
            }),
            'created_at' => $this->created_at->toDateString(),
        ];
    }
}
```

### 5. **Usa Enums (PHP 8.1+)**

```php
// app/Enums/UserStatus.php
enum UserStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case SUSPENDED = 'suspended';
  
    public function label(): string
    {
        return match($this) {
            self::ACTIVE => 'Activo',
            self::INACTIVE => 'Inactivo',
            self::SUSPENDED => 'Suspendido',
        };
    }
}

// En el modelo
protected $casts = [
    'status' => UserStatus::class,
];
```

## 🔒 SEGURIDAD - Reglas de Oro

### 1. **Siempre valida y sanitiza entrada**

```php
// ✅ BIEN
public function store(StorePostRequest $request)
{
    $post = Post::create([
        'title' => $request->validated()['title'],
        'content' => strip_tags($request->validated()['content']),
        'user_id' => auth()->id(),
    ]);
}
```

### 2. **Usa Políticas para Autorización**

```php
// app/Policies/PostPolicy.php
class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }
}

// En el controlador
public function update(Request $request, Post $post)
{
    $this->authorize('update', $post);
    // lógica de actualización
}
```

### 3. **Protege rutas sensibles**

```php
// routes/web.php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('posts', PostController::class);
});

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
});
```

### 4. **Usa HTTPS y configuración segura**

```php
// config/session.php
'secure' => env('SESSION_SECURE_COOKIE', true),
'http_only' => true,
'same_site' => 'strict',

// .env
APP_ENV=production
APP_DEBUG=false
SESSION_SECURE_COOKIE=true
```

## 🚀 PERFORMANCE - Optimizaciones Críticas

### 1. **Usa Eager Loading correctamente**

```php
// ✅ BIEN - Carga solo lo necesario
$posts = Post::with(['user:id,name', 'comments' => function ($query) {
    $query->latest()->limit(5);
}])->get();

// ✅ BIEN - Lazy Eager Loading cuando sea necesario
$posts = Post::all();
if ($needComments) {
    $posts->load('comments');
}
```

### 2. **Usa Cache inteligentemente**

```php
// ✅ BIEN - Cache con tags
class PostService
{
    public function getPopularPosts(): Collection
    {
        return Cache::tags(['posts', 'popular'])
            ->remember('popular_posts', 3600, function () {
                return Post::withCount('likes')
                    ->orderBy('likes_count', 'desc')
                    ->limit(10)
                    ->get();
            });
    }
  
    public function invalidatePostsCache(): void
    {
        Cache::tags(['posts'])->flush();
    }
}
```

### 3. **Usa Database Transactions**

```php
// ✅ BIEN
public function transferMoney(User $from, User $to, float $amount): void
{
    DB::transaction(function () use ($from, $to, $amount) {
        $from->decrement('balance', $amount);
        $to->increment('balance', $amount);
      
        Transaction::create([
            'from_user_id' => $from->id,
            'to_user_id' => $to->id,
            'amount' => $amount,
        ]);
    });
}
```

### 4. **Usa Jobs para tareas pesadas**

```php
// ✅ BIEN
public function store(StoreUserRequest $request)
{
    $user = User::create($request->validated());
  
    // Tareas pesadas en background
    SendWelcomeEmail::dispatch($user);
    ProcessUserAnalytics::dispatch($user)->delay(now()->addMinutes(5));
  
    return new UserResource($user);
}
```

## 🗃️ BASE DE DATOS - Mejores Prácticas

### 1. **Migraciones bien estructuradas**

```php
// ✅ BIEN
public function up()
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('content');
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
        $table->timestamp('published_at')->nullable();
        $table->timestamps();
      
        // Índices importantes
        $table->index(['status', 'published_at']);
        $table->index('user_id');
    });
}
```

### 2. **Usa Mutators y Accessors**

```php
// En el modelo User
public function setPasswordAttribute($value): void
{
    $this->attributes['password'] = bcrypt($value);
}

public function getFullNameAttribute(): string
{
    return "{$this->first_name} {$this->last_name}";
}

// Uso
$user = new User(['password' => 'secret123']);
echo $user->full_name;
```

### 3. **Usa Scopes para consultas comunes**

```php
// En el modelo Post
public function scopePublished($query)
{
    return $query->where('status', 'published');
}

public function scopeByAuthor($query, $authorId)
{
    return $query->where('user_id', $authorId);
}

// Uso
$posts = Post::published()->byAuthor(1)->get();
```

## 🧪 TESTING - Prácticas Esenciales

### 1. **Tests de Feature completos**

```php
// tests/Feature/PostTest.php
class PostTest extends TestCase
{
    use RefreshDatabase;
  
    public function test_user_can_create_post(): void
    {
        $user = User::factory()->create();
      
        $response = $this->actingAs($user)
            ->postJson('/api/posts', [
                'title' => 'Test Post',
                'content' => 'Test content',
            ]);
      
        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'title', 'content']]);
      
        $this->assertDatabaseHas('posts', [
            'title' => 'Test Post',
            'user_id' => $user->id,
        ]);
    }
}
```

### 2. **Usa Factories y Seeders correctamente**

```php
// database/factories/PostFactory.php
class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'content' => $this->faker->paragraphs(3, true),
            'user_id' => User::factory(),
            'status' => 'published',
        ];
    }
  
    public function draft(): static
    {
        return $this->state(['status' => 'draft']);
    }
}

// Uso en tests
$draftPosts = Post::factory()->draft()->count(5)->create();
```

## 📱 API - Mejores Prácticas

### 1. **Estructura de respuesta consistente**

```php
// app/Http/Controllers/Api/BaseController.php
class BaseController extends Controller
{
    protected function success($data = null, string $message = '', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }
  
    protected function error(string $message, int $code = 400, $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }
}
```

### 2. **Versionado de API**

```php
// routes/api.php
Route::prefix('v1')->group(function () {
    Route::apiResource('posts', PostController::class);
});

Route::prefix('v2')->group(function () {
    Route::apiResource('posts', V2\PostController::class);
});
```

### 3. **Rate Limiting**

```php
// app/Http/Kernel.php
protected $middlewareGroups = [
    'api' => [
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];

// config/auth.php - Personalizado
'api' => [
    'driver' => 'throttle',
    'max_attempts' => 60,
    'decay_minutes' => 1,
],
```

## 🎨 FRONTEND - Buenas Prácticas

### 1. **Blade Components reutilizables**

```php
// resources/views/components/alert.blade.php
@props(['type' => 'info', 'dismissible' => false])

<div {{ $attributes->merge(['class' => "alert alert-{$type}"]) }}>
    {{ $slot }}
  
    @if($dismissible)
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    @endif
</div>

<!-- Uso -->
<x-alert type="success" dismissible>
    ¡Operación exitosa!
</x-alert>
```

### 2. **Assets organizados**

```php
// webpack.mix.js
mix.js('resources/js/app.js', 'public/js')
   .sass('resources/sass/app.scss', 'public/css')
   .options({
       processCssUrls: false
   })
   .version();

// En Blade
<link href="{{ mix('css/app.css') }}" rel="stylesheet">
<script src="{{ mix('js/app.js') }}"></script>
```

## 🔧 CONFIGURACIÓN Y ENTORNO

### 1. **Variables de entorno bien organizadas**

```bash
# .env.example
APP_NAME="Mi Aplicación"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mi_app
DB_USERNAME=root
DB_PASSWORD=

# Cache
CACHE_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Queue
QUEUE_CONNECTION=redis
```

### 2. **Configuración por entorno**

```php
// config/database.php
'connections' => [
    'mysql' => [
        'driver' => 'mysql',
        'host' => env('DB_HOST', '127.0.0.1'),
        'port' => env('DB_PORT', '3306'),
        'database' => env('DB_DATABASE', 'forge'),
        'username' => env('DB_USERNAME', 'forge'),
        'password' => env('DB_PASSWORD', ''),
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
        'prefix' => '',
        'strict' => env('DB_STRICT_MODE', true),
    ],
],
```

## 🚦 ERRORES COMUNES A EVITAR

### 1. **No usar try-catch apropiadamente**

```php
// ❌ MAL
public function deleteUser($id)
{
    $user = User::findOrFail($id);
    $user->delete();
    return 'Usuario eliminado';
}

// ✅ BIEN
public function deleteUser($id)
{
    try {
        $user = User::findOrFail($id);
      
        DB::transaction(function () use ($user) {
            $user->posts()->delete();
            $user->delete();
        });
      
        return response()->json(['message' => 'Usuario eliminado']);
    } catch (ModelNotFoundException $e) {
        return response()->json(['error' => 'Usuario no encontrado'], 404);
    } catch (\Exception $e) {
        Log::error('Error eliminando usuario: ' . $e->getMessage());
        return response()->json(['error' => 'Error interno'], 500);
    }
}
```

### 2. **No manejar relaciones correctamente**

```php
// ❌ MAL
$user = User::find(1);
$posts = Post::where('user_id', $user->id)->get();

// ✅ BIEN
$user = User::with('posts')->find(1);
$posts = $user->posts;
```

## 📋 CHECKLIST DE DESARROLLO

### Antes de cada commit

- [ ]  ✅ Código sigue PSR-12
- [ ]  ✅ Tests pasan
- [ ]  ✅ No hay consultas N+1
- [ ]  ✅ Validación implementada
- [ ]  ✅ Autorización verificada
- [ ]  ✅ Variables de entorno documentadas

### Antes de producción

- [ ]  ✅ `php artisan optimize`
- [ ]  ✅ `APP_DEBUG=false`
- [ ]  ✅ HTTPS configurado
- [ ]  ✅ Logs monitoreados
- [ ]  ✅ Backups configurados
- [ ]  ✅ Rate limiting activo

## 💡 TIPS FINALES

1. **Principio DRY**: No te repitas
2. **SOLID**: Sigue los principios SOLID
3. **Convenciones**: Respeta las convenciones de Laravel
4. **Documentación**: Documenta código complejo
5. **Refactoring**: Refactoriza regularmente
6. **Testing**: Escribe tests desde el inicio
7. **Security First**: Piensa en seguridad siempre

¡Siguiendo estas prácticas tendrás aplicaciones Laravel robustas, seguras y mantenibles! 🚀
