
---
title: ' Profesionales en PHP con Laravel'
code: 'Lavarel'
description: 'Masterclass: APIs Profesionales en PHP con Laravel'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


# 🚀 Masterclass: APIs Profesionales en PHP con Laravel
## De la Planificación al Deployment Completo



## 🎯 **Objetivos de Aprendizaje**
Al completar esta masterclass serás capaz de:
- Diseñar y planificar APIs RESTful robustas
- Crear recursos personalizados y collections avanzadas
- Implementar paginación eficiente y filtrado dinámico
- Manejar eliminación de recursos con soft deletes
- Versionar APIs profesionalmente sin romper compatibilidad
- Testear exhaustivamente con PostMan
- Desplegar APIs listas para producción

---

# 📋 **Módulo 7: Planificación y Configuración de una API en PHP**

## **¿Por qué Laravel para APIs?**

**Analogía del Arquitecto:**
Construir una API es como diseñar un edificio. Laravel es tu kit completo de herramientas de arquitecto: planos (rutas), materiales (modelos), decoración (resources), y sistemas (middleware).

### **Principios de Diseño RESTful**

#### **1. Estructura de URLs Semántica**
```php
// ✅ CORRECTO - Estructura RESTful clara
GET    /api/posts           // Listar todos los posts
POST   /api/posts           // Crear nuevo post
GET    /api/posts/{id}      // Mostrar post específico
PUT    /api/posts/{id}      // Actualizar post completo
PATCH  /api/posts/{id}      // Actualizar post parcial
DELETE /api/posts/{id}      // Eliminar post

// ✅ Recursos anidados
GET    /api/posts/{id}/comments    // Comentarios de un post
POST   /api/posts/{id}/comments    // Crear comentario en post

// ❌ INCORRECTO - No RESTful
GET    /api/getPosts
POST   /api/createPost
GET    /api/showPost/{id}
```

#### **2. Códigos de Estado HTTP Apropiados**
```php
// app/Http/Controllers/Api/BaseController.php
<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

abstract class BaseController extends Controller
{
    /**
     * Respuesta exitosa con datos
     */
    protected function successResponse($data, string $message = 'Operation successful', int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => now()->toISOString(),
        ], $status);
    }

    /**
     * Respuesta de error
     */
    protected function errorResponse(string $message, int $status = 400, array $errors = []): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
            'timestamp' => now()->toISOString(),
        ], $status);
    }

    /**
     * Respuesta de recurso creado
     */
    protected function createdResponse($data, string $message = 'Resource created successfully'): JsonResponse
    {
        return $this->successResponse($data, $message, 201);
    }

    /**
     * Respuesta de recurso no encontrado
     */
    protected function notFoundResponse(string $message = 'Resource not found'): JsonResponse
    {
        return $this->errorResponse($message, 404);
    }

    /**
     * Respuesta de validación fallida
     */
    protected function validationErrorResponse(array $errors): JsonResponse
    {
        return $this->errorResponse('Validation failed', 422, $errors);
    }

    /**
     * Respuesta sin contenido (para DELETE exitoso)
     */
    protected function noContentResponse(): JsonResponse
    {
        return response()->json(null, 204);
    }
}
```

### **Configuración Inicial del Proyecto**

#### **Paso 1: Instalación y Setup**
```bash
# Crear nuevo proyecto Laravel
composer create-project laravel/laravel blog-api

cd blog-api

# Instalar dependencias para API
composer require laravel/sanctum
composer require spatie/laravel-query-builder
composer require spatie/laravel-permission

# Instalar dependencias de desarrollo
composer require --dev laravel/telescope
composer require --dev barryvdh/laravel-debugbar

# Configurar base de datos
php artisan migrate
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

#### **Paso 2: Estructura de Base de Datos**
```php
<?php
// database/migrations/2024_01_01_000001_create_categories_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('color', 7)->default('#3B82F6');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Índices para optimización
            $table->index(['slug', 'is_active']);
            $table->index('is_active');
        });
    }

    public function down()
    {
        Schema::dropIfExists('categories');
    }
};

// database/migrations/2024_01_01_000002_create_posts_table.php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->text('excerpt')->nullable();
            $table->string('featured_image')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->integer('views_count')->default(0);
            $table->integer('likes_count')->default(0);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
            
            // Índices para rendimiento
            $table->index(['status', 'published_at']);
            $table->index(['user_id', 'status']);
            $table->index(['category_id', 'status']);
            $table->index('views_count');
            $table->fullText(['title', 'content']); // Para búsqueda full-text
        });
    }

    public function down()
    {
        Schema::dropIfExists('posts');
    }
};

// database/migrations/2024_01_01_000003_create_comments_table.php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->boolean('is_approved')->default(false);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
            
            $table->index(['post_id', 'is_approved']);
            $table->index(['user_id', 'created_at']);
            $table->index('parent_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('comments');
    }
};
```

#### **Paso 3: Modelos con Relaciones**
```php
<?php
// app/Models/Post.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'featured_image',
        'status',
        'published_at',
        'user_id',
        'category_id',
        'views_count',
        'likes_count'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'views_count' => 'integer',
        'likes_count' => 'integer',
    ];

    // Relaciones
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function approvedComments()
    {
        return $this->hasMany(Comment::class)->where('is_approved', true);
    }

    // Scopes para consultas comunes
    public function scopePublished(Builder $query)
    {
        return $query->where('status', 'published')
                    ->where('published_at', '<=', now());
    }

    public function scopeDraft(Builder $query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeByCategory(Builder $query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByAuthor(Builder $query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopePopular(Builder $query)
    {
        return $query->orderByDesc('views_count');
    }

    public function scopeRecent(Builder $query)
    {
        return $query->orderByDesc('published_at');
    }

    // Métodos auxiliares
    public function isPublished(): bool
    {
        return $this->status === 'published' && 
               $this->published_at && 
               $this->published_at->isPast();
    }

    public function canBeEditedBy(User $user): bool
    {
        return $user->id === $this->user_id || $user->hasRole('admin');
    }

    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    public function getRouteKeyName(): string
    {
        return 'slug'; // Usar slug en lugar de ID en las rutas
    }
}

// app/Models/Category.php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function publishedPosts()
    {
        return $this->hasMany(Post::class)->published();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}

// app/Models/Comment.php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'content',
        'is_approved',
        'user_id',
        'post_id',
        'parent_id'
    ];

    protected $casts = [
        'is_approved' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopeRootComments($query)
    {
        return $query->whereNull('parent_id');
    }
}
```

### **Configuración de Rutas API**

#### **Estructura de Rutas Organizadas**
```php
<?php
// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AuthController,
    PostController,
    CategoryController,
    CommentController,
    UserController
};

/*
|--------------------------------------------------------------------------
| API Routes V1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->name('api.v1.')->group(function () {
    
    // Rutas públicas (sin autenticación)
    Route::get('posts', [PostController::class, 'index'])->name('posts.index');
    Route::get('posts/{post:slug}', [PostController::class, 'show'])->name('posts.show');
    Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('categories/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');
    
    // Rutas de autenticación
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('register', [AuthController::class, 'register'])->name('register');
        Route::post('login', [AuthController::class, 'login'])->name('login');
        Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->name('forgot-password');
        Route::post('reset-password', [AuthController::class, 'resetPassword'])->name('reset-password');
    });
    
    // Rutas protegidas (requieren autenticación)
    Route::middleware('auth:sanctum')->group(function () {
        
        // Gestión de perfil
        Route::prefix('auth')->name('auth.')->group(function () {
            Route::get('user', [AuthController::class, 'user'])->name('user');
            Route::put('user', [AuthController::class, 'updateProfile'])->name('update-profile');
            Route::post('logout', [AuthController::class, 'logout'])->name('logout');
            Route::post('refresh', [AuthController::class, 'refresh'])->name('refresh');
        });
        
        // CRUD de posts (para autores)
        Route::apiResource('posts', PostController::class)->except(['index', 'show']);
        
        // Acciones especiales en posts
        Route::prefix('posts')->name('posts.')->group(function () {
            Route::post('{post}/like', [PostController::class, 'like'])->name('like');
            Route::delete('{post}/unlike', [PostController::class, 'unlike'])->name('unlike');
            Route::post('{post}/increment-views', [PostController::class, 'incrementViews'])->name('increment-views');
        });
        
        // Gestión de comentarios
        Route::apiResource('comments', CommentController::class);
        Route::prefix('comments')->name('comments.')->group(function () {
            Route::post('{comment}/approve', [CommentController::class, 'approve'])->name('approve');
            Route::post('{comment}/reject', [CommentController::class, 'reject'])->name('reject');
        });
        
        // Rutas de administración (solo para admins)
        Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
            Route::apiResource('users', UserController::class);
            Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
            
            // Dashboard y estadísticas
            Route::get('dashboard', [UserController::class, 'dashboard'])->name('dashboard');
            Route::get('analytics', [UserController::class, 'analytics'])->name('analytics');
        });
    });
});

/*
|--------------------------------------------------------------------------
| Rutas de Fallback y Manejo de Errores
|--------------------------------------------------------------------------
*/

Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Endpoint not found',
        'available_endpoints' => [
            'GET /api/v1/posts' => 'List all posts',
            'GET /api/v1/posts/{slug}' => 'Show specific post',
            'POST /api/v1/auth/login' => 'User login',
            'POST /api/v1/auth/register' => 'User registration',
        ]
    ], 404);
});
```

### **Middleware de API**

#### **Middleware Personalizado para APIs**
```php
<?php
// app/Http/Middleware/ApiResponseMiddleware.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ApiResponseMiddleware
{
    /**
     * Middleware para estandarizar respuestas de API
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Solo procesar respuestas JSON
        if (!$response instanceof JsonResponse) {
            return $response;
        }

        $data = $response->getData(true);

        // Agregar metadatos estándar a todas las respuestas
        if (!isset($data['meta'])) {
            $data['meta'] = [
                'timestamp' => now()->toISOString(),
                'version' => 'v1',
                'endpoint' => $request->path(),
                'method' => $request->method(),
            ];
        }

        // Agregar información de rate limiting si existe
        if ($response->headers->has('X-RateLimit-Limit')) {
            $data['meta']['rate_limit'] = [
                'limit' => $response->headers->get('X-RateLimit-Limit'),
                'remaining' => $response->headers->get('X-RateLimit-Remaining'),
                'reset' => $response->headers->get('X-RateLimit-Reset'),
            ];
        }

        $response->setData($data);

        return $response;
    }
}

// app/Http/Middleware/ForceJsonResponse.php
<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ForceJsonResponse
{
    /**
     * Forzar que todas las respuestas sean JSON
     */
    public function handle(Request $request, Closure $next)
    {
        $request->headers->set('Accept', 'application/json');
        return $next($request);
    }
}

// app/Http/Middleware/ApiThrottleMiddleware.php
<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class ApiThrottleMiddleware
{
    /**
     * Rate limiting personalizado por tipo de usuario
     */
    public function handle(Request $request, Closure $next, $maxAttempts = 60, $decayMinutes = 1)
    {
        $user = $request->user();
        
        // Ajustar límites según el tipo de usuario
        if ($user) {
            $maxAttempts = match ($user->role ?? 'user') {
                'admin' => $maxAttempts * 5,
                'premium' => $maxAttempts * 3,
                'verified' => $maxAttempts * 2,
                default => $maxAttempts
            };
        }

        $key = $this->resolveRequestSignature($request);

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            return $this->buildRateLimitResponse($key, $maxAttempts);
        }

        RateLimiter::hit($key, $decayMinutes * 60);

        $response = $next($request);

        return $this->addRateLimitHeaders($response, $key, $maxAttempts);
    }

    protected function resolveRequestSignature(Request $request): string
    {
        $user = $request->user();
        $identifier = $user ? $user->id : $request->ip();
        
        return sha1($identifier . '|' . $request->route()?->getName());
    }

    protected function buildRateLimitResponse($key, $maxAttempts)
    {
        $retryAfter = RateLimiter::availableIn($key);

        return response()->json([
            'success' => false,
            'message' => 'Too many requests',
            'retry_after' => $retryAfter,
            'limit_info' => [
                'max_attempts' => $maxAttempts,
                'window' => '1 minute',
                'suggestion' => 'Consider upgrading your account for higher limits'
            ]
        ], 429)->header('Retry-After', $retryAfter);
    }

    protected function addRateLimitHeaders($response, $key, $maxAttempts)
    {
        $attempts = RateLimiter::attempts($key);
        $remaining = max(0, $maxAttempts - $attempts);
        
        $response->headers->set('X-RateLimit-Limit', $maxAttempts);
        $response->headers->set('X-RateLimit-Remaining', $remaining);
        
        return $response;
    }
}
```

---

# 🎨 **Módulo 8: Creación de Recursos en Laravel para Formato Personalizado**

## **¿Qué son los API Resources?**

**Analogía del Traductor Especializado:**
Los API Resources son como traductores especializados que convierten datos "internos" de tu aplicación en un formato elegante y consistente para el mundo exterior.

### **Resources Básicos**

#### **User Resource**
```php
<?php
// app/Http/Resources/UserResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar ? asset('storage/' . $this->avatar) : null,
            'role' => $this->role,
            'is_verified' => $this->hasVerifiedEmail(),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Datos condicionales
            'posts_count' => $this->when(
                $this->relationLoaded('posts'),
                fn() => $this->posts_count
            ),
            
            // Solo para el usuario autenticado
            'settings' => $this->when(
                $request->user()?->id === $this->id,
                [
                    'notifications_enabled' => $this->notifications_enabled ?? true,
                    'theme_preference' => $this->theme_preference ?? 'light',
                    'language' => $this->language ?? 'en',
                ]
            ),
            
            // Solo para admins
            'admin_info' => $this->when(
                $request->user()?->role === 'admin',
                [
                    'last_login_at' => $this->last_login_at?->format('Y-m-d H:i:s'),
                    'login_count' => $this->login_count ?? 0,
                    'is_suspended' => $this->is_suspended ?? false,
                ]
            ),
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'version' => '1.0',
                'generated_at' => now()->toISOString(),
            ],
        ];
    }
}
```

#### **Post Resource Avanzado**
```php
<?php
// app/Http/Resources/PostResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            
            // Contenido completo solo en vista detallada
            'content' => $this->when(
                $request->routeIs('api.v1.posts.show'),
                $this->content
            ),
            
            'featured_image' => $this->getFeaturedImageUrls(),
            'status' => $this->status,
            'published_at' => $this->published_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Métricas
            'stats' => [
                'views_count' => $this->views_count,
                'likes_count' => $this->likes_count,
                'comments_count' => $this->when(
                    $this->relationLoaded('comments'),
                    fn() => $this->comments_count
                ),
                'reading_time_minutes' => $this->getReadingTime(),
            ],
            
            // Relaciones
            'author' => new UserResource($this->whenLoaded('user')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            
            // URLs útiles
            'links' => [
                'self' => route('api.v1.posts.show', $this->slug),
                'author' => route('api.v1.users.show', $this->user_id),
                'category' => route('api.v1.categories.show', $this->category->slug ?? ''),
                'edit' => $this->when(
                    $this->canBeEditedBy($request->user()),
                    route('api.v1.posts.update', $this->id)
                ),
            ],
            
            // Estados booleanos útiles
            'permissions' => [
                'can_edit' => $this->canBeEditedBy($request->user()),
                'can_delete' => $this->canBeEditedBy($request->user()),
                'can_comment' => $request->user() !== null,
                'is_liked' => $this->when(
                    $request->user(),
                    fn() => $this->isLikedBy($request->user())
                ),
            ],
        ];
    }

    /**
     * Obtener URLs de imagen destacada en diferentes tamaños
     */
    private function getFeaturedImageUrls(): ?array
    {
        if (!$this->featured_image) {
            return null;
        }

        $basePath = 'storage/' . $this->featured_image;
        
        return [
            'original' => asset($basePath),
            'large' => asset(str_replace('.', '_large.', $basePath)),
            'medium' => asset(str_replace('.', '_medium.', $basePath)),
            'thumbnail' => asset(str_replace('.', '_thumb.', $basePath)),
        ];
    }

    /**
     * Calcular tiempo de lectura estimado
     */
    private function getReadingTime(): int
    {
        $wordCount = str_word_count(strip_tags($this->content));
        return ceil($wordCount / 200); // 200 palabras por minuto
    }

    /**
     * Verificar si el post está likeado por el usuario
     */
    private function isLikedBy($user): bool
    {
        if (!$user) return false;
        
        // Aquí implementarías la lógica para verificar likes
        // return $this->likes()->where('user_id', $user->id)->exists();
        return false; // Placeholder
    }
}
```

#### **Category Resource con Estadísticas**
```php
<?php
// app/Http/Resources/CategoryResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'color' => $this->color,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            
            // Estadísticas cuando están cargadas
            'statistics' => $this->when(
                $this->relationLoaded('posts'),
                [
                    'total_posts' => $this->posts_count ?? 0,
                    'published_posts' => $this->posts()->published()->count(),
                    'total_views' => $this->posts()->sum('views_count'),
                    'avg_posts_per_month' => $this->getAveragePostsPerMonth(),
                ]
            ),
            
            // Posts recientes en vista detallada
            'recent_posts' => PostResource::collection(
                $this->whenLoaded('recentPosts')
            ),
            
            // URLs
            'links' => [
                'self' => route('api.v1.categories.show', $this->slug),
                'posts' => route('api.v1.posts.index', ['category' => $this->slug]),
            ],
        ];
    }

    private function getAveragePostsPerMonth(): float
    {
        $firstPost = $this->posts()->oldest()->first();
        if (!$firstPost) return 0;
        
        $monthsSinceFirst = $firstPost->created_at->diffInMonths(now()) + 1;
        return round($this->posts_count / $monthsSinceFirst, 2);
    }
}
```

### **Resources Contextuales**

#### **Resource que cambia según contexto**
```php
<?php
// app/Http/Resources/ContextualPostResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContextualPostResource extends JsonResource
{
    private $context;

    public function __construct($resource, string $context = 'list')
    {
        parent::__construct($resource);
        $this->context = $context;
    }

    public function toArray(Request $request): array
    {
        // Datos base comunes
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'status' => $this->status,
            'author' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar' => $this->user->avatar,
            ],
        ];

        // Añadir datos específicos según contexto
        return match ($this->context) {
            'list' => $this->getListData($data),
            'detail' => $this->getDetailData($data),
            'admin' => $this->getAdminData($data),
            'card' => $this->getCardData($data),
            'search' => $this->getSearchData($data),
            default => $data,
        };
    }

    private function getListData(array $base): array
    {
        return array_merge($base, [
            'excerpt' => $this->excerpt,
            'published_at' => $this->published_at?->format('M d, Y'),
            'reading_time' => $this->getReadingTime(),
            'stats' => [
                'views' => $this->views_count,
                'likes' => $this->likes_count,
            ],
        ]);
    }

    private function getDetailData(array $base): array
    {
        return array_merge($base, [
            'content' => $this->content,
            'excerpt' => $this->excerpt,
            'featured_image' => $this->getFeaturedImageUrls(),
            'published_at' => $this->published_at?->format('Y-m-d H:i:s'),
            'category' => new CategoryResource($this->category),
            'tags' => $this->tags->pluck('name'),
            'stats' => [
                'views' => $this->views_count,
                'likes' => $this->likes_count,
                'comments' => $this->comments_count,
            ],
            'meta' => [
                'reading_time' => $this->getReadingTime(),
                'word_count' => str_word_count(strip_tags($this->content)),
                'last_updated' => $this->updated_at->diffForHumans(),
            ],
        ]);
    }

    private function getAdminData(array $base): array
    {
        return array_merge($base, [
            'content' => $this->content,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'category' => $this->category->name,
            'admin_stats' => [
                'views' => $this->views_count,
                'likes' => $this->likes_count,
                'comments' => $this->comments_count,
                'pending_comments' => $this->comments()->where('is_approved', false)->count(),
            ],
            'seo' => [
                'title' => $this->seo_title ?? $this->title,
                'description' => $this->seo_description ?? $this->excerpt,
                'score' => $this->calculateSeoScore(),
            ],
        ]);
    }

    private function getCardData(array $base): array
    {
        return array_merge($base, [
            'excerpt' => \Str::limit($this->excerpt, 100),
            'featured_image' => $this->featured_image ? asset('storage/' . $this->featured_image) : null,
            'published_at' => $this->published_at?->format('M d'),
            'reading_time' => $this->getReadingTime(),
            'category' => [
                'name' => $this->category->name,
                'color' => $this->category->color,
            ],
        ]);
    }

    private function getSearchData(array $base): array
    {
        return array_merge($base, [
            'excerpt' => \Str::limit($this->excerpt, 150),
            'published_at' => $this->published_at?->format('Y-m-d'),
            'category' => $this->category->name,
            'relevance_score' => $this->relevance_score ?? 1, // Para ordenamiento de búsqueda
            'highlight' => $this->highlight ?? null, // Texto resaltado de búsqueda
        ]);
    }

    // Métodos helper
    private function getReadingTime(): int
    {
        return ceil(str_word_count(strip_tags($this->content)) / 200);
    }

    private function getFeaturedImageUrls(): ?array
    {
        if (!$this->featured_image) return null;
        
        return [
            'original' => asset('storage/' . $this->featured_image),
            'thumbnail' => asset('storage/thumbs/' . $this->featured_image),
        ];
    }

    private function calculateSeoScore(): int
    {
        $score = 0;
        
        // Título tiene longitud óptima (50-60 chars)
        $titleLength = strlen($this->title);
        if ($titleLength >= 50 && $titleLength <= 60) $score += 25;
        
        // Tiene descripción
        if ($this->excerpt) $score += 25;
        
        // Tiene imagen destacada
        if ($this->featured_image) $score += 25;
        
        // Tiene categoría
        if ($this->category_id) $score += 25;
        
        return $score;
    }
}

// Uso en controladores:
// return new ContextualPostResource($post, 'detail');
// return ContextualPostResource::collection($posts, 'card');
```

### **Resources con Transformaciones Dinámicas**

#### **Resource con campos dinámicos**
```php
<?php
// app/Http/Resources/FlexiblePostResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FlexiblePostResource extends JsonResource
{
    private array $includeFields = [];
    private array $excludeFields = [];

    public function includeFields(array $fields): self
    {
        $this->includeFields = $fields;
        return $this;
    }

    public function excludeFields(array $fields): self
    {
        $this->excludeFields = $fields;
        return $this;
    }

    public function toArray(Request $request): array
    {
        // Campos base
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'status' => $this->status,
            'published_at' => $this->published_at?->format('Y-m-d H:i:s'),
            'author' => new UserResource($this->user),
            'category' => new CategoryResource($this->category),
            'stats' => [
                'views' => $this->views_count,
                'likes' => $this->likes_count,
                'comments' => $this->comments_count ?? 0,
            ],
            'meta' => [
                'reading_time' => $this->getReadingTime(),
                'word_count' => str_word_count(strip_tags($this->content)),
            ],
        ];

        // Procesar campos solicitados específicamente
        if (!empty($this->includeFields)) {
            $data = array_intersect_key($data, array_flip($this->includeFields));
        }

        // Remover campos excluidos
        if (!empty($this->excludeFields)) {
            $data = array_diff_key($data, array_flip($this->excludeFields));
        }

        // Procesar parámetros de query para campos dinámicos
        $this->handleQueryParameters($request, $data);

        return $data;
    }

    private function handleQueryParameters(Request $request, array &$data): void
    {
        // ?fields=id,title,author
        if ($request->has('fields')) {
            $requestedFields = explode(',', $request->get('fields'));
            $data = array_intersect_key($data, array_flip($requestedFields));
        }

        // ?include=comments,tags
        if ($request->has('include')) {
            $includes = explode(',', $request->get('include'));
            
            if (in_array('comments', $includes)) {
                $data['comments'] = CommentResource::collection($this->comments);
            }
            
            if (in_array('tags', $includes)) {
                $data['tags'] = $this->tags->pluck('name');
            }
            
            if (in_array('related_posts', $includes)) {
                $data['related_posts'] = PostResource::collection(
                    $this->getRelatedPosts()
                );
            }
        }

        // ?exclude=content,meta
        if ($request->has('exclude')) {
            $excludes = explode(',', $request->get('exclude'));
            foreach ($excludes as $exclude) {
                unset($data[$exclude]);
            }
        }

        // ?format=minimal
        if ($request->get('format') === 'minimal') {
            $data = [
                'id' => $data['id'],
                'title' => $data['title'],
                'slug' => $data['slug'],
                'author' => $data['author']['name'] ?? null,
            ];
        }
    }

    private function getReadingTime(): int
    {
        return ceil(str_word_count(strip_tags($this->content)) / 200);
    }

    private function getRelatedPosts()
    {
        return Post::where('category_id', $this->category_id)
            ->where('id', '!=', $this->id)
            ->published()
            ->limit(3)
            ->get();
    }
}

// Uso:
// return (new FlexiblePostResource($post))->includeFields(['id', 'title', 'author']);
// return (new FlexiblePostResource($post))->excludeFields(['content', 'meta']);
```

---

# 📊 **Módulo 9: Configuración de Colecciones y Paginación en Laravel**

## **Resource Collections Avanzadas**

**Analogía del Curador de Museo:**
Una Collection es como un curador de museo que no solo organiza las piezas (recursos), sino que también proporciona contexto, estadísticas y metadatos que enriquecen la experiencia del visitante.

### **Collections Básicas con Metadatos**

#### **Post Collection**
```php
<?php
// app/Http/Resources/PostCollection.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PostCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => $this->getMeta($request),
            'links' => $this->getLinks($request),
            'filters' => $this->getAppliedFilters($request),
            'statistics' => $this->getStatistics(),
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     */
    public function with(Request $request): array
    {
        return [
            'available_filters' => [
                'status' => ['draft', 'published', 'archived'],
                'category' => $this->getAvailableCategories(),
                'author' => $this->getAvailableAuthors(),
                'date_range' => [
                    'from' => 'Y-m-d format',
                    'to' => 'Y-m-d format',
                ],
            ],
            'sort_options' => [
                'created_at' => ['asc', 'desc'],
                'published_at' => ['asc', 'desc'],
                'title' => ['asc', 'desc'],
                'views_count' => ['asc', 'desc'],
                'likes_count' => ['asc', 'desc'],
            ],
            'export_options' => [
                'csv' => route('api.v1.posts.export', ['format' => 'csv']),
                'excel' => route('api.v1.posts.export', ['format' => 'xlsx']),
                'pdf' => route('api.v1.posts.export', ['format' => 'pdf']),
            ],
        ];
    }

    private function getMeta(Request $request): array
    {
        return [
            'total_posts' => $this->collection->count(),
            'generated_at' => now()->toISOString(),
            'query_time_ms' => round((microtime(true) - LARAVEL_START) * 1000, 2),
            'user_timezone' => $request->user()?->timezone ?? 'UTC',
        ];
    }

    private function getLinks(Request $request): array
    {
        return [
            'self' => $request->url(),
            'create' => route('api.v1.posts.store'),
            'export' => route('api.v1.posts.export'),
        ];
    }

    private function getAppliedFilters(Request $request): array
    {
        return $request->only([
            'status', 'category', 'author', 'search', 
            'date_from', 'date_to', 'sort', 'direction'
        ]);
    }

    private function getStatistics(): array
    {
        $collection = $this->collection;
        
        return [
            'by_status' => [
                'published' => $collection->where('status', 'published')->count(),
                'draft' => $collection->where('status', 'draft')->count(),
                'archived' => $collection->where('status', 'archived')->count(),
            ],
            'by_category' => $collection->groupBy('category.name')->map->count()->sortDesc(),
            'by_author' => $collection->groupBy('user.name')->map->count()->sortDesc(),
            'engagement' => [
                'total_views' => $collection->sum('views_count'),
                'total_likes' => $collection->sum('likes_count'),
                'avg_views_per_post' => round($collection->avg('views_count'), 2),
                'most_viewed_post' => $collection->sortByDesc('views_count')->first()?->title,
            ],
            'date_range' => [
                'oldest_post' => $collection->min('created_at'),
                'newest_post' => $collection->max('created_at'),
                'posts_this_week' => $collection->where('created_at', '>=', now()->startOfWeek())->count(),
                'posts_this_month' => $collection->where('created_at', '>=', now()->startOfMonth())->count(),
            ],
        ];
    }

    private function getAvailableCategories(): array
    {
        return \App\Models\Category::active()
            ->orderBy('name')
            ->pluck('name', 'slug')
            ->toArray();
    }

    private function getAvailableAuthors(): array
    {
        return \App\Models\User::whereHas('posts')
            ->orderBy('name')
            ->pluck('name', 'id')
            ->toArray();
    }
}
```

### **Paginación Avanzada**

#### **Configuración de Paginación Personalizada**
```php
<?php
// app/Http/Controllers/Api/PostController.php (extracto del index)
namespace App\Http\Controllers\Api;

use App\Http\Resources\PostResource;
use App\Http\Resources\PostCollection;
use App\Models\Post;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;

class PostController extends BaseController
{
    public function index(Request $request)
    {
        // Validar parámetros de paginación
        $validated = $request->validate([
            'page' => 'integer|min:1',
            'per_page' => 'integer|min:1|max:100',
            'sort' => 'string',
            'direction' => 'in:asc,desc',
        ]);

        $posts = QueryBuilder::for(Post::class)
            ->allowedFilters([
                'title',
                'status',
                AllowedFilter::exact('category', 'category_id'),
                AllowedFilter::exact('author', 'user_id'),
                AllowedFilter::partial('search', 'title'),
                AllowedFilter::scope('published'),
                AllowedFilter::callback('content_search', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('title', 'like', "%{$value}%")
                          ->orWhere('content', 'like', "%{$value}%")
                          ->orWhere('excerpt', 'like', "%{$value}%");
                    });
                }),
                AllowedFilter::callback('date_from', function ($query, $value) {
                    $query->where('created_at', '>=', $value);
                }),
                AllowedFilter::callback('date_to', function ($query, $value) {
                    $query->where('created_at', '<=', $value);
                }),
                AllowedFilter::callback('popular', function ($query) {
                    $query->where('views_count', '>=', 1000);
                }),
                AllowedFilter::callback('trending', function ($query) {
                    $query->where('created_at', '>=', now()->subWeek())
                          ->orderByDesc('views_count');
                }),
            ])
            ->allowedSorts([
                'created_at',
                'updated_at',
                'published_at',
                'title',
                'views_count',
                'likes_count',
                AllowedSort::field('author', 'users.name'),
                AllowedSort::field('category', 'categories.name'),
            ])
            ->allowedIncludes([
                'user',
                'category',
                'comments',
                'comments.user',
            ])
            ->with(['user', 'category']) // Siempre cargar estas relaciones
            ->withCount(['comments']) // Contar comentarios
            ->defaultSort('-created_at');

        // Configurar paginación
        $perPage = min($validated['per_page'] ?? 15, 100); // Máximo 100
        $paginated = $posts->paginate($perPage);

        return new PostCollection($paginated);
    }
}
```

#### **Paginación con Cursor para Mejor Performance**
```php
<?php
// Método alternativo para datasets muy grandes
public function indexCursor(Request $request)
{
    $posts = QueryBuilder::for(Post::class)
        ->allowedFilters([
            'status',
            AllowedFilter::exact('category', 'category_id'),
            AllowedFilter::scope('published'),
        ])
        ->with(['user', 'category'])
        ->orderBy('created_at', 'desc')
        ->orderBy('id', 'desc'); // Tie-breaker importante

    // Cursor pagination - mejor para feeds en tiempo real
    $perPage = min($request->get('per_page', 15), 50);
    $paginated = $posts->cursorPaginate($perPage);

    return PostResource::collection($paginated);
}

// El response automáticamente incluirá:
/*
{
    "data": [...],
    "links": {
        "first": null,
        "last": null,
        "prev": null,
        "next": "http://localhost/api/v1/posts?cursor=eyJjcmVhdGVkX2F0IjoiMjAyNC0wMS0xNSAxMDo..."
    },
    "meta": {
        "path": "http://localhost/api/v1/posts",
        "per_page": 15,
        "next_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNC0wMS0xNSAxMDo...",
        "prev_cursor": null
    }
}
*/
```

### **Collections con Agregaciones Complejas**

#### **Dashboard Collection con Analytics**
```php
<?php
// app/Http/Resources/DashboardCollection.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class DashboardCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'overview' => $this->getOverviewStats(),
            'charts' => $this->getChartData(),
            'recent_activity' => $this->getRecentActivity(),
            'trends' => $this->getTrends(),
            'goals' => $this->getGoals($request->user()),
        ];
    }

    public function with(Request $request): array
    {
        return [
            'meta' => [
                'generated_at' => now()->toISOString(),
                'cache_duration' => '5 minutes',
                'user_role' => $request->user()->role,
                'timezone' => $request->user()->timezone ?? 'UTC',
            ],
            'refresh_endpoints' => [
                'overview' => route('api.v1.dashboard.overview'),
                'charts' => route('api.v1.dashboard.charts'),
                'activity' => route('api.v1.dashboard.activity'),
            ],
        ];
    }

    private function getOverviewStats(): array
    {
        return Cache::remember('dashboard_overview_' . auth()->id(), 300, function () {
            $user = auth()->user();
            
            $stats = [
                'total_posts' => $user->posts()->count(),
                'published_posts' => $user->posts()->published()->count(),
                'draft_posts' => $user->posts()->where('status', 'draft')->count(),
                'total_views' => $user->posts()->sum('views_count'),
                'total_likes' => $user->posts()->sum('likes_count'),
                'avg_views_per_post' => 0,
                'engagement_rate' => 0,
            ];

            // Calcular promedios
            if ($stats['total_posts'] > 0) {
                $stats['avg_views_per_post'] = round($stats['total_views'] / $stats['total_posts'], 2);
                
                $totalEngagements = $stats['total_likes'] + $user->posts()->withCount('comments')->get()->sum('comments_count');
                $stats['engagement_rate'] = $stats['total_views'] > 0 
                    ? round(($totalEngagements / $stats['total_views']) * 100, 2)
                    : 0;
            }

            return $stats;
        });
    }

    private function getChartData(): array
    {
        return Cache::remember('dashboard_charts_' . auth()->id(), 600, function () {
            $user = auth()->user();
            
            // Posts por mes en los últimos 12 meses
            $postsPerMonth = $user->posts()
                ->select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), DB::raw('count(*) as count'))
                ->where('created_at', '>=', now()->subYear())
                ->groupBy('month')
                ->orderBy('month')
                ->get()
                ->pluck('count', 'month')
                ->toArray();

            // Vistas por día en los últimos 30 días
            $viewsPerDay = $user->posts()
                ->select(DB::raw('DATE(created_at) as date'), DB::raw('sum(views_count) as views'))
                ->where('created_at', '>=', now()->subDays(30))
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->pluck('views', 'date')
                ->toArray();

            // Posts por categoría
            $postsByCategory = $user->posts()
                ->join('categories', 'posts.category_id', '=', 'categories.id')
                ->select('categories.name', DB::raw('count(*) as count'))
                ->groupBy('categories.name')
                ->get()
                ->pluck('count', 'name')
                ->toArray();

            return [
                'posts_per_month' => $postsPerMonth,
                'views_per_day' => $viewsPerDay,
                'posts_by_category' => $postsByCategory,
                'engagement_funnel' => [
                    'views' => $user->posts()->sum('views_count'),
                    'likes' => $user->posts()->sum('likes_count'),
                    'comments' => $user->posts()->withCount('comments')->get()->sum('comments_count'),
                    'shares' => 0, // Placeholder
                ],
            ];
        });
    }

    private function getRecentActivity(): array
    {
        $user = auth()->user();
        
        return [
            'recent_posts' => $user->posts()
                ->latest()
                ->take(5)
                ->get(['id', 'title', 'status', 'views_count', 'created_at'])
                ->map(function ($post) {
                    return [
                        'id' => $post->id,
                        'title' => $post->title,
                        'status' => $post->status,
                        'views' => $post->views_count,
                        'created_at' => $post->created_at->diffForHumans(),
                        'url' => route('api.v1.posts.show', $post->id),
                    ];
                }),
                
            'recent_comments' => $user->posts()
                ->with(['comments' => function ($query) {
                    $query->latest()->take(5)->with('user');
                }])
                ->get()
                ->pluck('comments')
                ->flatten()
                ->take(5)
                ->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'content' => \Str::limit($comment->content, 100),
                        'author' => $comment->user->name,
                        'post_title' => $comment->post->title,
                        'created_at' => $comment->created_at->diffForHumans(),
                    ];
                }),

            'system_notifications' => $this->getSystemNotifications($user),
        ];
    }

    private function getTrends(): array
    {
        $user = auth()->user();
        $thisMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();
        
        // Posts este mes vs mes pasado
        $postsThisMonth = $user->posts()->where('created_at', '>=', $thisMonth)->count();
        $postsLastMonth = $user->posts()
            ->whereBetween('created_at', [$lastMonth, $thisMonth])
            ->count();
        
        // Vistas este mes vs mes pasado
        $viewsThisMonth = $user->posts()
            ->where('created_at', '>=', $thisMonth)
            ->sum('views_count');
        $viewsLastMonth = $user->posts()
            ->whereBetween('created_at', [$lastMonth, $thisMonth])
            ->sum('views_count');

        return [
            'posts' => [
                'current' => $postsThisMonth,
                'previous' => $postsLastMonth,
                'change_percent' => $this->calculatePercentageChange($postsLastMonth, $postsThisMonth),
                'trend' => $postsThisMonth >= $postsLastMonth ? 'up' : 'down',
            ],
            'views' => [
                'current' => $viewsThisMonth,
                'previous' => $viewsLastMonth,
                'change_percent' => $this->calculatePercentageChange($viewsLastMonth, $viewsThisMonth),
                'trend' => $viewsThisMonth >= $viewsLastMonth ? 'up' : 'down',
            ],
        ];
    }

    private function getGoals($user): array
    {
        $currentMonth = now()->month;
        $postsThisMonth = $user->posts()->whereMonth('created_at', $currentMonth)->count();
        $viewsThisMonth = $user->posts()->whereMonth('created_at', $currentMonth)->sum('views_count');
        
        return [
            'monthly_posts' => [
                'target' => 8,
                'current' => $postsThisMonth,
                'progress_percent' => min(round(($postsThisMonth / 8) * 100), 100),
                'status' => $postsThisMonth >= 8 ? 'achieved' : 'in_progress',
            ],
            'monthly_views' => [
                'target' => 5000,
                'current' => $viewsThisMonth,
                'progress_percent' => min(round(($viewsThisMonth / 5000) * 100), 100),
                'status' => $viewsThisMonth >= 5000 ? 'achieved' : 'in_progress',
            ],
        ];
    }

    private function calculatePercentageChange($old, $new): float
    {
        if ($old == 0) {
            return $new > 0 ? 100 : 0;
        }
        
        return round((($new - $old) / $old) * 100, 2);
    }

    private function getSystemNotifications($user): array
    {
        $notifications = [];
        
        // Verificar si tiene borradores antiguos
        $oldDrafts = $user->posts()
            ->where('status', 'draft')
            ->where('updated_at', '<', now()->subDays(7))
            ->count();
            
        if ($oldDrafts > 0) {
            $notifications[] = [
                'type' => 'warning',
                'title' => 'Borradores pendientes',
                'message' => "Tienes {$oldDrafts} borradores sin actualizar en más de una semana",
                'action_url' => route('api.v1.posts.index', ['status' => 'draft']),
            ];
        }

        // Verificar inactividad
        $daysSinceLastPost = $user->posts()->latest()->first()?->created_at?->diffInDays(now());
        
        if ($daysSinceLastPost && $daysSinceLastPost > 14) {
            $notifications[] = [
                'type' => 'info',
                'title' => 'Tiempo sin publicar',
                'message' => "Han pasado {$daysSinceLastPost} días desde tu último post",
                'action_url' => route('api.v1.posts.create'),
            ];
        }

        return $notifications;
    }
}
```

### **Filtrado Dinámico y Búsqueda**

#### **Search Collection con Relevancia**
```php
<?php
// app/Http/Resources/SearchCollection.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class SearchCollection extends ResourceCollection
{
    private $query;
    private $searchTime;

    public function __construct($resource, string $query = '', float $searchTime = 0)
    {
        parent::__construct($resource);
        $this->query = $query;
        $this->searchTime = $searchTime;
    }

    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'excerpt' => $this->highlightSearchTerms($item->excerpt),
                    'type' => class_basename($item),
                    'relevance_score' => $item->relevance_score ?? 1,
                    'url' => $this->getItemUrl($item),
                    'meta' => $this->getItemMeta($item),
                ];
            }),
            'search_info' => [
                'query' => $this->query,
                'total_results' => $this->collection->count(),
                'search_time_ms' => round($this->searchTime * 1000, 2),
                'has_more' => $this->hasMoreResults(),
            ],
            'suggestions' => $this->getSearchSuggestions(),
            'filters' => $this->getAvailableFilters(),
        ];
    }

    public function with(Request $request): array
    {
        return [
            'meta' => [
                'search_tips' => [
                    'Use quotes for exact phrases: "machine learning"',
                    'Use - to exclude terms: cats -dogs',
                    'Use * for wildcards: cat*',
                    'Use type: to filter by content type: type:post',
                ],
                'popular_searches' => $this->getPopularSearches(),
            ],
        ];
    }

    private function highlightSearchTerms(string $text): string
    {
        if (empty($this->query)) {
            return $text;
        }

        $terms = explode(' ', $this->query);
        
        foreach ($terms as $term) {
            $text = preg_replace(
                '/(' . preg_quote($term, '/') . ')/i',
                '<mark>$1</mark>',
                $text
            );
        }

        return $text;
    }

    private function getItemUrl($item): string
    {
        return match (class_basename($item)) {
            'Post' => route('api.v1.posts.show', $item->slug),
            'User' => route('api.v1.users.show', $item->id),
            'Category' => route('api.v1.categories.show', $item->slug),
            default => '#',
        };
    }

    private function getItemMeta($item): array
    {
        return match (class_basename($item)) {
            'Post' => [
                'author' => $item->user->name,
                'category' => $item->category->name,
                'published_at' => $item->published_at?->format('M d, Y'),
                'views' => $item->views_count,
            ],
            'User' => [
                'role' => $item->role,
                'posts_count' => $item->posts_count ?? 0,
                'joined' => $item->created_at->format('M Y'),
            ],
            'Category' => [
                'posts_count' => $item->posts_count ?? 0,
                'description' => \Str::limit($item->description, 100),
            ],
            default => [],
        };
    }

    private function hasMoreResults(): bool
    {
        // Lógica para determinar si hay más resultados
        return $this->collection->count() >= 20; // Si devolvimos el máximo, probablemente hay más
    }

    private function getSearchSuggestions(): array
    {
        // Sugerencias basadas en la query actual
        $suggestions = [];

        if (strlen($this->query) >= 3) {
            // Buscar términos similares o populares
            $suggestions = [
                $this->query . ' tutorial',
                $this->query . ' guide',
                $this->query . ' examples',
            ];
        }

        return $suggestions;
    }

    private function getAvailableFilters(): array
    {
        $filters = [];

        // Filtros dinámicos basados en los resultados
        $types = $this->collection->map(fn($item) => class_basename($item))->unique()->values();
        
        if ($types->count() > 1) {
            $filters['type'] = $types->toArray();
        }

        // Otros filtros según el contexto
        $filters['sort'] = ['relevance', 'date', 'popularity'];

        return $filters;
    }

    private function getPopularSearches(): array
    {
        // En una implementación real, esto vendría de analytics
        return [
            'laravel tutorial',
            'api development',
            'php best practices',
            'database optimization',
            'authentication',
        ];
    }
}
```

---

# 🗑️ **Módulo 10: Eliminación de Recursos en APIs con PHP y PostMan**

## **Estrategias de Eliminación**

**Analogía del Sistema de Archivos:**
Eliminar recursos en APIs es como manejar documentos importantes: tienes la papelera de reciclaje (soft delete), eliminación permanente (hard delete), y permisos de administrador para cada acción.

### **Soft Delete Avanzado**

#### **Implementación Completa en el Modelo**
```php
<?php
// app/Models/Post.php (extensión)
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Post extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    // Scopes para soft deletes
    public function scopeOnlyTrashed(Builder $query): Builder
    {
        return $query->onlyTrashed();
    }

    public function scopeWithTrashed(Builder $query): Builder
    {
        return $query->withTrashed();
    }

    public function scopeTrashedThisWeek(Builder $query): Builder
    {
        return $query->onlyTrashed()
                    ->where('deleted_at', '>=', now()->startOfWeek());
    }

    public function scopeOldTrashed(Builder $query, int $days = 30): Builder
    {
        return $query->onlyTrashed()
                    ->where('deleted_at', '<=', now()->subDays($days));
    }

    // Métodos auxiliares
    public function canBeRestored(): bool
    {
        return $this->trashed() && 
               $this->deleted_at->diffInDays(now()) <= 30; // 30 días límite
    }

    public function getDaysInTrash(): int
    {
        return $this->trashed() ? $this->deleted_at->diffInDays(now()) : 0;
    }

    public function getAutoDeleteDate(): ?string
    {
        return $this->trashed() 
            ? $this->deleted_at->addDays(30)->format('Y-m-d H:i:s')
            : null;
    }
}
```

#### **Controller con Manejo Completo de Eliminación**
```php
<?php
// app/Http/Controllers/Api/PostController.php (métodos de eliminación)
namespace App\Http\Controllers\Api;

use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PostController extends BaseController
{
    /**
     * Soft delete - Mover a papelera
     */
    public function destroy(Post $post): JsonResponse
    {
        $this->authorize('delete', $post);

        // Verificar dependencias
        if ($post->comments()->exists()) {
            return $this->errorResponse(
                'Cannot delete post with existing comments. Archive it instead.',
                400
            );
        }

        DB::transaction(function () use ($post) {
            // Marcar comentarios como eliminados también
            $post->comments()->delete();
            
            // Soft delete del post
            $post->delete();
            
            // Log de actividad
            activity()
                ->performedOn($post)
                ->causedBy(auth()->user())
                ->log('Post moved to trash');
        });

        return $this->successResponse([
            'id' => $post->id,
            'title' => $post->title,
            'deleted_at' => $post->deleted_at->toISOString(),
            'can_restore' => true,
            'auto_delete_date' => $post->getAutoDeleteDate(),
            'days_until_permanent_deletion' => 30 - $post->getDaysInTrash(),
        ], 'Post moved to trash successfully');
    }

    /**
     * Listar posts en papelera
     */
    public function trashed(Request $request): JsonResponse
    {
        $this->authorize('viewTrashed', Post::class);

        $trashedPosts = Post::onlyTrashed()
            ->with(['user', 'category'])
            ->when($request->user()->role !== 'admin', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->orderBy('deleted_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->successResponse([
            'data' => PostResource::collection($trashedPosts->items()),
            'pagination' => [
                'current_page' => $trashedPosts->currentPage(),
                'last_page' => $trashedPosts->lastPage(),
                'per_page' => $trashedPosts->perPage(),
                'total' => $trashedPosts->total(),
            ],
            'summary' => [
                'total_trashed' => $trashedPosts->total(),
                'can_restore' => $trashedPosts->filter->canBeRestored()->count(),
                'auto_delete_soon' => $trashedPosts->filter(function ($post) {
                    return $post->getDaysInTrash() >= 25; // Próximos a eliminación automática
                })->count(),
            ],
        ]);
    }

    /**
     * Restaurar post eliminado
     */
    public function restore(int $id): JsonResponse
    {
        $post = Post::onlyTrashed()->findOrFail($id);
        
        $this->authorize('restore', $post);

        if (!$post->canBeRestored()) {
            return $this->errorResponse(
                'Post cannot be restored. It has been in trash for more than 30 days.',
                400
            );
        }

        DB::transaction(function () use ($post) {
            // Restaurar post
            $post->restore();
            
            // Restaurar comentarios asociados
            $post->comments()->restore();
            
            // Log de actividad
            activity()
                ->performedOn($post)
                ->causedBy(auth()->user())
                ->log('Post restored from trash');
        });

        return $this->successResponse([
            'data' => new PostResource($post->load(['user', 'category'])),
            'restored_at' => now()->toISOString(),
            'also_restored' => [
                'comments_count' => $post->comments()->count(),
            ],
        ], 'Post restored successfully');
    }

    /**
     * Eliminación permanente
     */
    public function forceDelete(int $id): JsonResponse
    {
        $post = Post::onlyTrashed()->findOrFail($id);
        
        $this->authorize('forceDelete', $post);

        $postData = [
            'id' => $post->id,
            'title' => $post->title,
            'author' => $post->user->name,
        ];

        DB::transaction(function () use ($post) {
            // Limpiar archivos asociados
            $this->cleanupPostFiles($post);
            
            // Eliminar relaciones
            $post->comments()->forceDelete();
            
            // Eliminación permanente
            $post->forceDelete();
            
            // Log de actividad
            activity()
                ->causedBy(auth()->user())
                ->log("Post '{$post->title}' permanently deleted");
        });

        return $this->successResponse([
            'deleted_post' => $postData,
            'permanently_deleted_at' => now()->toISOString(),
            'warning' => 'This action cannot be undone',
        ], 'Post permanently deleted');
    }

    /**
     * Operaciones en lote
     */
    public function bulkAction(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:delete,restore,force_delete',
            'post_ids' => 'required|array|min:1|max:100',
            'post_ids.*' => 'integer|exists:posts,id',
            'confirm_force_delete' => 'required_if:action,force_delete|boolean',
        ]);

        if ($validated['action'] === 'force_delete' && !$validated['confirm_force_delete']) {
            return $this->errorResponse(
                'Force delete must be explicitly confirmed',
                400
            );
        }

        $posts = $this->getPostsForBulkAction($validated['action'], $validated['post_ids']);
        
        if ($posts->isEmpty()) {
            return $this->errorResponse('No valid posts found for this action', 404);
        }

        // Verificar permisos para todos los posts
        foreach ($posts as $post) {
            $this->authorize($this->getAuthorizationMethod($validated['action']), $post);
        }

        $results = [];
        $successCount = 0;

        DB::transaction(function () use ($posts, $validated, &$results, &$successCount) {
            foreach ($posts as $post) {
                try {
                    $result = $this->executeBulkAction($post, $validated['action']);
                    $results[] = $result;
                    if ($result['status'] === 'success') {
                        $successCount++;
                    }
                } catch (\Exception $e) {
                    $results[] = [
                        'id' => $post->id,
                        'title' => $post->title,
                        'status' => 'error',
                        'message' => $e->getMessage(),
                    ];
                }
            }
        });

        return $this->successResponse([
            'action' => $validated['action'],
            'results' => $results,
            'summary' => [
                'total_processed' => count($results),
                'successful' => $successCount,
                'failed' => count($results) - $successCount,
                'success_rate' => round(($successCount / count($results)) * 100, 2) . '%',
            ],
        ], "Bulk {$validated['action']} completed");
    }

    /**
     * Limpieza automática de posts antiguos en papelera
     */
    public function autoCleanup(Request $request): JsonResponse
    {
        $this->authorize('autoCleanup', Post::class);

        $daysOld = $request->get('days_old', 30);
        $dryRun = $request->boolean('dry_run', false);

        $oldPosts = Post::oldTrashed($daysOld)->get();

        if ($oldPosts->isEmpty()) {
            return $this->successResponse([], 'No posts found for cleanup');
        }

        $cleaned = [];

        if (!$dryRun) {
            DB::transaction(function () use ($oldPosts, &$cleaned) {
                foreach ($oldPosts as $post) {
                    $this->cleanupPostFiles($post);
                    $post->comments()->forceDelete();
                    $post->forceDelete();
                    
                    $cleaned[] = [
                        'id' => $post->id,
                        'title' => $post->title,
                        'days_in_trash' => $post->getDaysInTrash(),
                    ];
                }
            });
        }

        return $this->successResponse([
            'cleanup_mode' => $dryRun ? 'dry_run' : 'executed',
            'posts_to_clean' => $oldPosts->count(),
            'cleaned_posts' => $cleaned,
            'criteria' => "Posts deleted more than {$daysOld} days ago",
        ], $dryRun ? 'Dry run completed' : 'Auto cleanup completed');
    }

    // Métodos auxiliares privados
    private function getPostsForBulkAction(string $action, array $postIds)
    {
        return match ($action) {
            'delete' => Post::whereIn('id', $postIds)->get(),
            'restore', 'force_delete' => Post::onlyTrashed()->whereIn('id', $postIds)->get(),
            default => collect(),
        };
    }

    private function getAuthorizationMethod(string $action): string
    {
        return match ($action) {
            'delete' => 'delete',
            'restore' => 'restore',
            'force_delete' => 'forceDelete',
            default => 'view',
        };
    }

    private function executeBulkAction($post, string $action): array
    {
        $result = [
            'id' => $post->id,
            'title' => $post->title,
            'status' => 'success',
        ];

        switch ($action) {
            case 'delete':
                $post->delete();
                $result['message'] = 'Moved to trash';
                $result['deleted_at'] = $post->deleted_at->toISOString();
                break;

            case 'restore':
                if (!$post->canBeRestored()) {
                    throw new \Exception('Cannot restore post older than 30 days');
                }
                $post->restore();
                $result['message'] = 'Restored successfully';
                $result['restored_at'] = now()->toISOString();
                break;

            case 'force_delete':
                $this->cleanupPostFiles($post);
                $post->comments()->forceDelete();
                $post->forceDelete();
                $result['message'] = 'Permanently deleted';
                $result['permanently_deleted_at'] = now()->toISOString();
                break;
        }

        return $result;
    }

    private function cleanupPostFiles(Post $post): void
    {
        // Eliminar imagen destacada
        if ($post->featured_image && Storage::disk('public')->exists($post->featured_image)) {
            Storage::disk('public')->delete($post->featured_image);
            
            // Eliminar también las versiones redimensionadas
            $variants = ['_large', '_medium', '_thumb'];
            foreach ($variants as $variant) {
                $variantPath = str_replace('.', $variant . '.', $post->featured_image);
                if (Storage::disk('public')->exists($variantPath)) {
                    Storage::disk('public')->delete($variantPath);
                }
            }
        }

        // Eliminar otros archivos asociados si los hay
        // Por ejemplo: attachments, cached files, etc.
    }
}
```

### **Políticas de Autorización para Eliminación**

#### **Post Policy Completa**
```php
<?php
// app/Policies/PostPolicy.php
namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    public function delete(User $user, Post $post): bool
    {
        // El autor puede eliminar sus posts, admin puede eliminar cualquiera
        return $user->id === $post->user_id || $user->role === 'admin';
    }

    public function restore(User $user, Post $post): bool
    {
        // Mismo criterio que delete
        return $user->id === $post->user_id || $user->role === 'admin';
    }

    public function forceDelete(User $user, Post $post): bool
    {
        // Solo admins pueden eliminar permanentemente
        return $user->role === 'admin';
    }

    public function viewTrashed(User $user): bool
    {
        // Usuarios pueden ver su propia papelera, admins pueden ver toda
        return true; // El filtro se hace en el controller
    }

    public function autoCleanup(User $user): bool
    {
        // Solo admins pueden ejecutar limpieza automática
        return $user->role === 'admin';
    }

    public function bulkDelete(User $user): bool
    {
        // Editores y admins pueden hacer eliminaciones en lote
        return in_array($user->role, ['admin', 'editor']);
    }
}
```

### **Testing con PostMan**

#### **Colección PostMan para Testing de Eliminación**
```json
{
  "info": {
    "name": "API Posts - Deletion Testing",
    "description": "Collection para testing completo de eliminación de posts"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{auth_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000/api/v1"
    },
    {
      "key": "auth_token",
      "value": ""
    },
    {
      "key": "test_post_id",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Setup",
      "item": [
        {
          "name": "Login Admin",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"email\": \"admin@example.com\",\n    \"password\": \"password\"\n}"
            },
            "url": "{{base_url}}/auth/login"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    var responseJson = pm.response.json();",
                  "    pm.collectionVariables.set('auth_token', responseJson.data.token);",
                  "    pm.test('Login successful', function() {",
                  "        pm.response.to.have.status(200);",
                  "    });",
                  "} else {",
                  "    pm.test('Login failed', function() {",
                  "        pm.response.to.have.status(200);",
                  "    });",
                  "}"
                ]
              }
            }
          ]
        },
        {
          "name": "Create Test Post",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"title\": \"Test Post for Deletion\",\n    \"content\": \"This post will be used to test deletion functionality\",\n    \"excerpt\": \"Test excerpt for deletion\",\n    \"status\": \"published\",\n    \"category_id\": 1\n}"
            },
            "url": "{{base_url}}/posts"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    var responseJson = pm.response.json();",
                  "    pm.collectionVariables.set('test_post_id', responseJson.data.id);",
                  "    pm.test('Post created successfully', function() {",
                  "        pm.response.to.have.status(201);",
                  "    });",
                  "}"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Soft Delete Tests",
      "item": [
        {
          "name": "Soft Delete Post",
          "request": {
            "method": "DELETE",
            "url": "{{base_url}}/posts/{{test_post_id}}"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response contains soft delete info', function () {",
                  "    var responseJson = pm.response.json();",
                  "    pm.expect(responseJson.data).to.have.property('deleted_at');",
                  "    pm.expect(responseJson.data).to.have.property('can_restore');",
                  "    pm.expect(responseJson.data.can_restore).to.be.true;",
                  "});",
                  "",
                  "pm.test('Auto delete date is set', function () {",
                  "    var responseJson = pm.response.json();",
                  "    pm.expect(responseJson.data).to.have.property('auto_delete_date');",
                  "});"
                ]
              }
            }
          ]
        },
        {
          "name": "Verify Post is Trashed",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/posts/{{test_post_id}}"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Post not found in regular listing', function () {",
                  "    pm.response.to.have.status(404);",
                  "});"
                ]
              }
            }
          ]
        },
        {
          "name": "List Trashed Posts",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/posts/trashed"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response contains trashed posts', function () {",
                  "    var responseJson = pm.response.json();",
                  "    pm.expect(responseJson.data).to.have.property('data');",
                  "    pm.expect(responseJson.data.data).to.be.an('array');",
                  "});",
                  "",
                  "pm.test('Summary information present', function () {",
                  "    var responseJson = pm.response.json();",
                  "    pm.expect(responseJson.data).to.have.property('summary');",
                  "    pm.expect(responseJson.data.summary).to.have.property('total_trashed');",
                  "});"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Restore Tests",
      "item": [
        {
          "name": "Restore Post",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/posts/{{test_post_id}}/restore"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Post restored successfully', function () {",
                  "    var responseJson = pm.response.json();",
                  "    pm.expect(responseJson.data).to.have.property('data');",
                  "    pm.expect(responseJson.data).to.have.property('restored_at');",
                  "});",
                  "",
                  "pm.test('Also restored related data', function () {",
                  "    var responseJson = pm.response.json();",
                  "    pm.expect(responseJson.data).to.have.property('also_restored');",
                  "});"
                ]
              }
            }
          ]
        },
        {
          "name": "Verify Post is Restored",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/posts/{{test_post_id}}"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Post is accessible again', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Post data is complete', function () {",
                  "    var responseJson = pm.response.json();",
                  "    pm.expect(responseJson.data).to.have.property('title');",
                  "    pm.expect(responseJson.data.title).to.equal('Test Post for Deletion');",
                  "});"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Force Delete Tests",
      "item": [
        {
          "name": "Soft Delete Before Force Delete",
          "request": {
            "method": "DELETE",
            "url": "{{base_url}}/posts/{{test_post_id}}"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Post moved to trash', function () {",
                  "    pm.response.to.have.status(200);",
                  "});"
                ]
              }
            }
          ]
        },
        {
          "name": "Force Delete Post",
          "request": {
            "method": "DELETE",
            "url": "{{base_url}}/posts/{{test_post_id}}/force-delete"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Post permanently deleted', function () {",
                  "    var responseJson = pm.response.json();",
                  "    pm.expect(responseJson.data).to.have.property('permanently_deleted_at');",
                  "    pm.expect(responseJson.data).to.have.property('warning');",
                  "});",
                  "",
                  "pm.test('Contains deletion warning', function () {",
                  "    var responseJson = pm.response.json();",
                  "    pm.expect(responseJson.data.warning).to.include('cannot be undone');",
                  "});"
                ]
              }
            }
          ]
        },
        {
          "name": "Verify Post Cannot Be Restored",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/posts/{{test_post_id}}/restore"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Restore fails for permanently deleted post', function () {",
                  "    pm.response.to.have.status(404);",
                  "});"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Bulk Operations Tests",
      "item": [
        {
          "name": "Create Multiple Test Posts",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"posts\": [\n        {\n            \"title\": \"Bulk Test Post 1\",\n            \"content\": \"Content for bulk test 1\",\n            \"status\": \"published\",\n            \"category_id\": 1\n        },\n        {\n            \"title\": \"Bulk Test Post 2\",\n            \"content\": \"Content for bulk test 2\",\n            \"status\": \"published\",\n            \"category_id\": 1\n        },\n        {\n            \"title\": \"Bulk Test Post 3\",\n            \"content\": \"Content for bulk test 3\",\n            \"status\": \"published\",\n            \"category_id\": 1\n        }\n    ]\n}"
            },
            "url": "{{base_url}}/posts/bulk-create"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    var responseJson = pm.response.json();",
                  "    var postIds = responseJson.data.created_posts.map(post => post.id);",
                  "    pm.collectionVariables.set('bulk_post_ids', postIds.join(','));",
                  "}"
                ]
              }
            }
          ]
        },
        {
          "name": "Bulk Soft Delete",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"action\": \"delete\",\n    \"post_ids\": [{{bulk_post_ids}}]\n}"
            },
            "url": "{{base_url}}/posts/bulk-action"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Bulk delete successful', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('All posts processed', function () {",
                  "    var responseJson = pm.response.json();",
                  "    pm.expect(responseJson.data.summary.successful).to.be.above(0);",
                  "});"
                ]
              }
            }
          ]
        },
        {
          "name": "Bulk Restore",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"action\": \"restore\",\n    \"post_ids\": [{{bulk_post_ids}}]\n}"
            },
            "url": "{{base_url}}/posts/bulk-action"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Bulk restore successful', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Success rate is good', function () {",
                  "    var responseJson = pm.response.json();",
                  "    var successRate = parseFloat(responseJson.data.summary.success_rate);",
                  "    pm.expect(successRate).to.be.above(90);",
                  "});"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Admin Operations Tests",
      "item": [
        {
          "name": "Auto Cleanup Dry Run",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/posts/auto-cleanup?dry_run=true&days_old=30"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Dry run completed', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Shows cleanup preview', function () {",
                  "    var responseJson = pm.response.json();",
                  "    pm.expect(responseJson.data.cleanup_mode).to.equal('dry_run');",
                  "});"
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

#### **Scripts de Pre-request para PostMan**
```javascript
// Pre-request Script Global para autenticación automática
if (!pm.collectionVariables.get('auth_token') || 
    pm.collectionVariables.get('auth_token') === '') {
    
    // Auto-login si no hay token
    pm.sendRequest({
        url: pm.collectionVariables.get('base_url') + '/auth/login',
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                email: 'admin@example.com',
                password: 'password'
            })
        }
    }, function (err, res) {
        if (res && res.code === 200) {
            var responseJson = res.json();
            pm.collectionVariables.set('auth_token', responseJson.data.token);
            console.log('Auto-login successful');
        }
    });
}

// Verificar que el endpoint esté disponible
pm.test('API is accessible', function () {
    pm.expect(pm.response.responseTime).to.be.below(5000);
});
```

#### **Tests de Validación Común**
```javascript
// Test Script común para todas las requests
pm.test('Response time is acceptable', function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test('Content-Type is JSON', function () {
    pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');
});

pm.test('Response has standard structure', function () {
    if (pm.response.code !== 404 && pm.response.code !== 500) {
        var responseJson = pm.response.json();
        pm.expect(responseJson).to.have.property('success');
        pm.expect(responseJson).to.have.property('message');
    }
});

// Logging para debugging
console.log('Request URL:', pm.request.url.toString());
console.log('Response Status:', pm.response.code);
console.log('Response Time:', pm.response.responseTime + 'ms');
```

---

# 🔄 **Módulo 11: Planificación y Configuración de API Versión 2**

## **¿Por qué Versionar APIs?**

**Analogía del iPhone:**
Versionar una API es como lanzar el iPhone 15 mientras mantienes soporte para iPhone 14. Los usuarios antiguos siguen funcionando, pero los nuevos tienen características avanzadas.

### **Estrategia de Versionado V2**

#### **Análisis de Necesidades para V2**
```php
/*
Razones para crear API v2:
1. ✅ Mejorar estructura de respuestas
2. ✅ Agregar nuevas funcionalidades (analytics, search)
3. ✅ Optimizar performance con nuevos endpoints
4. ✅ Deprecar campos obsoletos
5. ✅ Implementar mejores prácticas aprendidas

Compatibilidad:
- V1 seguirá funcionando por 12 meses
- V2 coexistirá con V1
- Migración gradual de clientes
*/
```

#### **Configuración de Namespace V2**
```php
<?php
// config/api.php
return [
    'versions' => [
        'v1' => [
            'namespace' => 'App\\Http\\Controllers\\Api\\V1',
            'middleware' => ['api', 'throttle:60,1'],
            'deprecated' => false,
            'sunset_date' => '2025-12-31',
            'supported_until' => '2025-12-31',
        ],
        'v2' => [
            'namespace' => 'App\\Http\\Controllers\\Api\\V2',
            'middleware' => ['api', 'throttle:120,1'], // Mayor rate limit
            'deprecated' => false,
            'sunset_date' => null,
            'supported_until' => null,
            'features' => [
                'advanced_search',
                'real_time_analytics',
                'bulk_operations',
                'webhook_support',
            ],
        ],
    ],
    'default_version' => 'v2',
    'latest_version' => 'v2',
];
```

### **Estructura de Directorios V2**
```php
// Nueva estructura para V2
/*
app/Http/
├── Controllers/Api/
│   ├── V1/                     <- Legacy (mantenimiento)
│   │   ├── PostController.php
│   │   └── UserController.php
│   └── V2/                     <- Nueva versión
│       ├── PostController.php      <- Mejorado
│       ├── UserController.php      <- Mejorado  
│       ├── AnalyticsController.php <- Nuevo
│       ├── SearchController.php    <- Nuevo
│       └── WebhookController.php   <- Nuevo
├── Resources/
│   ├── V1/
│   └── V2/                     <- Resources optimizados
│       ├── PostResource.php
│       ├── PostDetailResource.php
│       ├── AnalyticsResource.php
│       └── SearchResultResource.php
└── Requests/
    ├── V1/
    └── V2/                     <- Validaciones mejoradas
        ├── StorePostRequest.php
        ├── UpdatePostRequest.php
        └── SearchRequest.php
*/
```

### **Rutas V2 con Nuevas Funcionalidades**

#### **Configuración de Rutas V2**
```php
<?php
// routes/api_v2.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V2\{
    PostController,
    UserController,
    AnalyticsController,
    SearchController,
    WebhookController
};

/*
|--------------------------------------------------------------------------
| API Routes V2 - Enhanced Features
|--------------------------------------------------------------------------
*/

Route::prefix('v2')->name('api.v2.')->group(function () {
    
    // Rutas públicas mejoradas
    Route::get('posts', [PostController::class, 'index'])->name('posts.index');
    Route::get('posts/{post:slug}', [PostController::class, 'show'])->name('posts.show');
    
    // Nueva funcionalidad: Búsqueda avanzada
    Route::get('search', [SearchController::class, 'index'])->name('search');
    Route::get('search/suggestions', [SearchController::class, 'suggestions'])->name('search.suggestions');
    
    // Nueva funcionalidad: Analytics públicos
    Route::get('analytics/public', [AnalyticsController::class, 'public'])->name('analytics.public');
    
    // Autenticación (mantenida igual)
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('login', [UserController::class, 'login'])->name('login');
        Route::post('register', [UserController::class, 'register'])->name('register');
    });
    
    // Rutas protegidas con nuevas características
    Route::middleware('auth:sanctum')->group(function () {
        
        // Posts con funcionalidades extendidas
        Route::apiResource('posts', PostController::class)->except(['index', 'show']);
        
        // Nuevos endpoints para posts
        Route::prefix('posts')->name('posts.')->group(function () {
            Route::get('{post}/analytics', [PostController::class, 'analytics'])->name('analytics');
            Route::get('{post}/related', [PostController::class, 'related'])->name('related');
            Route::post('{post}/duplicate', [PostController::class, 'duplicate'])->name('duplicate');
            Route::post('bulk-update', [PostController::class, 'bulkUpdate'])->name('bulk-update');
        });
        
        // Analytics detallados
        Route::prefix('analytics')->name('analytics.')->group(function () {
            Route::get('dashboard', [AnalyticsController::class, 'dashboard'])->name('dashboard');
            Route::get('posts', [AnalyticsController::class, 'posts'])->name('posts');
            Route::get('users', [AnalyticsController::class, 'users'])->name('users');
            Route::get('trends', [AnalyticsController::class, 'trends'])->name('trends');
            Route::get('export', [AnalyticsController::class, 'export'])->name('export');
        });
        
        // Gestión de webhooks
        Route::apiResource('webhooks', WebhookController::class);
        Route::post('webhooks/{webhook}/test', [WebhookController::class, 'test'])->name('webhooks.test');
        
        // Rutas de administración expandidas
        Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
            Route::get('system-info', [UserController::class, 'systemInfo'])->name('system-info');
            Route::post('maintenance-mode', [UserController::class, 'maintenanceMode'])->name('maintenance-mode');
            Route::get('audit-logs', [UserController::class, 'auditLogs'])->name('audit-logs');
        });
    });
    
    // Webhooks endpoint (público para recibir webhooks externos)
    Route::post('webhooks/receive/{webhook}', [WebhookController::class, 'receive'])
        ->name('webhooks.receive')
        ->middleware('verify-webhook-signature');
});
```

### **Controllers V2 con Funcionalidades Avanzadas**

#### **Post Controller V2 Mejorado**
```php
<?php
// app/Http/Controllers/Api/V2/PostController.php
namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Api\V1\PostController as V1PostController;
use App\Http\Resources\V2\PostResource;
use App\Http\Resources\V2\PostCollection;
use App\Http\Resources\V2\PostAnalyticsResource;
use App\Http\Requests\V2\StorePostRequest;
use App\Http\Requests\V2\UpdatePostRequest;
use App\Models\Post;
use App\Services\V2\PostAnalyticsService;
use App\Services\V2\RecommendationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;

class PostController extends V1PostController
{
    protected PostAnalyticsService $analyticsService;
    protected RecommendationService $recommendationService;

    public function __construct(
        PostAnalyticsService $analyticsService,
        RecommendationService $recommendationService
    ) {
        $this->analyticsService = $analyticsService;
        $this->recommendationService = $recommendationService;
        parent::__construct();
    }

    /**
     * V2: Lista mejorada con filtros avanzados y optimizaciones
     */
    public function index(Request $request): JsonResponse
    {
        $posts = QueryBuilder::for(Post::class)
            ->allowedFilters([
                // Filtros básicos de V1
                'title',
                'status',
                AllowedFilter::exact('category', 'category_id'),
                AllowedFilter::exact('author', 'user_id'),
                
                // Nuevos filtros avanzados en V2
                AllowedFilter::callback('content_search', function ($query, $value) {
                    $query->whereFullText(['title', 'content'], $value);
                }),
                AllowedFilter::callback('reading_time', function ($query, $value) {
                    [$min, $max] = explode('-', $value);
                    $query->whereBetween('reading_time', [$min, $max]);
                }),
                AllowedFilter::callback('engagement_rate', function ($query, $value) {
                    $query->having('engagement_rate', '>=', $value);
                }),
                AllowedFilter::callback('trending', function ($query) {
                    $query->where('created_at', '>=', now()->subWeek())
                          ->orderByRaw('(likes_count + comments_count + views_count) DESC');
                }),
                AllowedFilter::callback('similar_to', function ($query, $postId) {
                    $this->applySimilarityFilter($query, $postId);
                }),
            ])
            ->allowedSorts([
                'created_at',
                'published_at',
                'title',
                'views_count',
                'likes_count',
                'engagement_rate', // Nuevo en V2
                'reading_time',    // Nuevo en V2
            ])
            ->allowedIncludes([
                'user',
                'category',
                'comments',
                'tags',
                'analytics', // Nuevo en V2
            ])
            ->with(['user', 'category'])
            ->withCount(['comments', 'likes'])
            ->selectRaw('
                posts.*,
                CASE 
                    WHEN views_count > 0 
                    THEN ((likes_count + comments_count) / views_count) * 100 
                    ELSE 0 
                END as engagement_rate
            ')
            ->defaultSort('-published_at');

        // Aplicar filtros de personalización si el usuario está autenticado
        if ($request->user()) {
            $this->applyPersonalizationFilters($posts, $request->user());
        }

        $paginated = $posts->paginate($request->get('per_page', 20));

        return $this->successResponse(
            new PostCollection($paginated)
        );
    }

    /**
     * V2: Vista detallada con analytics y recomendaciones
     */
    public function show(Post $post): JsonResponse
    {
        // Incrementar vistas de forma asíncrona
        dispatch(function () use ($post) {
            $post->increment('views_count');
        })->afterResponse();

        // Cargar relaciones completas para vista detallada
        $post->load([
            'user',
            'category',
            'comments.user',
            'tags',
        ]);

        // Obtener posts relacionados
        $relatedPosts = $this->recommendationService->getRelatedPosts($post, 5);

        return $this->successResponse([
            'post' => new PostResource($post),
            'related_posts' => PostResource::collection($relatedPosts),
            'reading_progress' => $this->getReadingProgress($post),
            'social_share_urls' => $this->getSocialShareUrls($post),
        ]);
    }

    /**
     * V2: Analytics detallados del post
     */
    public function analytics(Post $post): JsonResponse
    {
        $this->authorize('viewAnalytics', $post);

        $analytics = $this->analyticsService->getPostAnalytics($post);

        return $this->successResponse(
            new PostAnalyticsResource($analytics)
        );
    }

    /**
     * V2: Posts relacionados con algoritmo mejorado
     */
    public function related(Post $post): JsonResponse
    {
        $relatedPosts = $this->recommendationService->getRelatedPosts($post, 10);

        return $this->successResponse([
            'data' => PostResource::collection($relatedPosts),
            'algorithm' => 'content_similarity_v2',
            'confidence_scores' => $relatedPosts->pluck('similarity_score'),
        ]);
    }

    /**
     * V2: Duplicar post con personalización
     */
    public function duplicate(Post $post): JsonResponse
    {
        $this->authorize('create', Post::class);

        $duplicatedPost = $post->replicate([
            'slug',
            'views_count',
            'likes_count',
            'published_at'
        ]);

        $duplicatedPost->title = $post->title . ' (Copia)';
        $duplicatedPost->slug = \Str::slug($duplicatedPost->title) . '-' . uniqid();
        $duplicatedPost->status = 'draft';
        $duplicatedPost->user_id = auth()->id();
        $duplicatedPost->save();

        // Duplicar relaciones
        $duplicatedPost->tags()->attach($post->tags->pluck('id'));

        return $this->createdResponse(
            new PostResource($duplicatedPost->load(['user', 'category', 'tags'])),
            'Post duplicated successfully'
        );
    }

    /**
     * V2: Actualización en lote
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'post_ids' => 'required|array|min:1|max:50',
            'post_ids.*' => 'integer|exists:posts,id',
            'updates' => 'required|array',
            'updates.status' => 'sometimes|in:draft,published,archived',
            'updates.category_id' => 'sometimes|exists:categories,id',
            'updates.tags' => 'sometimes|array',
            'updates.tags.*' => 'string|max:50',
        ]);

        $posts = Post::whereIn('id', $validated['post_ids'])->get();
        
        // Verificar permisos para todos los posts
        foreach ($posts as $post) {
            $this->authorize('update', $post);
        }

        $updated = [];
        $errors = [];

        DB::transaction(function () use ($posts, $validated, &$updated, &$errors) {
            foreach ($posts as $post) {
                try {
                    $post->update(array_intersect_key(
                        $validated['updates'],
                        array_flip(['status', 'category_id'])
                    ));

                    // Manejar tags si están presentes
                    if (isset($validated['updates']['tags'])) {
                        $this->syncTags($post, $validated['updates']['tags']);
                    }

                    $updated[] = [
                        'id' => $post->id,
                        'title' => $post->title,
                        'status' => 'updated',
                    ];
                } catch (\Exception $e) {
                    $errors[] = [
                        'id' => $post->id,
                        'title' => $post->title,
                        'error' => $e->getMessage(),
                    ];
                }
            }
        });

        return $this->successResponse([
            'updated' => $updated,
            'errors' => $errors,
            'summary' => [
                'total_requested' => count($validated['post_ids']),
                'successful_updates' => count($updated),
                'failed_updates' => count($errors),
                'success_rate' => round((count($updated) / count($validated['post_ids'])) * 100, 2) . '%',
            ],
        ], 'Bulk update completed');
    }

    // Métodos helper privados
    private function applySimilarityFilter($query, $postId): void
    {
        $referencePost = Post::find($postId);
        if (!$referencePost) return;

        $query->where('category_id', $referencePost->category_id)
              ->where('id', '!=', $postId)
              ->whereHas('tags', function ($q) use ($referencePost) {
                  $q->whereIn('tags.id', $referencePost->tags->pluck('id'));
              });
    }

    private function applyPersonalizationFilters($query, $user): void
    {
        // Filtros basados en el historial del usuario
        $userInterests = $this->recommendationService->getUserInterests($user);
        
        if ($userInterests->isNotEmpty()) {
            $query->whereIn('category_id', $userInterests->pluck('category_id'))
                  ->orWhereHas('tags', function ($q) use ($userInterests) {
                      $q->whereIn('name', $userInterests->pluck('tag_name'));
                  });
        }
    }

    private function getReadingProgress($post): array
    {
        $wordCount = str_word_count(strip_tags($post->content));
        $readingTime = ceil($wordCount / 200); // 200 WPM

        return [
            'word_count' => $wordCount,
            'estimated_reading_time_minutes' => $readingTime,
            'reading_time_ranges' => [
                'fast_reader' => max(1, round($readingTime * 0.8)),
                'average_reader' => $readingTime,
                'slow_reader' => round($readingTime * 1.5),
            ],
        ];
    }

    private function getSocialShareUrls($post): array
    {
        $url = route('posts.show', $post->slug);
        $title = urlencode($post->title);
        $description = urlencode(\Str::limit($post->excerpt, 100));

        return [
            'facebook' => "https://www.facebook.com/sharer/sharer.php?u={$url}",
            'twitter' => "https://twitter.com/intent/tweet?url={$url}&text={$title}",
            'linkedin' => "https://www.linkedin.com/sharing/share-offsite/?url={$url}",
            'whatsapp' => "https://wa.me/?text={$title}%20{$url}",
            'telegram' => "https://t.me/share/url?url={$url}&text={$title}",
            'reddit' => "https://reddit.com/submit?url={$url}&title={$title}",
            'email' => "mailto:?subject={$title}&body={$description}%0A%0A{$url}",
        ];
    }
}
```

#### **Analytics Controller V2**
```php
<?php
// app/Http/Controllers/Api/V2/AnalyticsController.php
namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\V2\AnalyticsResource;
use App\Services\V2\AnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class AnalyticsController extends BaseController
{
    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Dashboard principal con métricas key
     */
    public function dashboard(Request $request): JsonResponse
    {
        $this->authorize('viewAnalytics', auth()->user());

        $period = $request->get('period', '30d'); // 7d, 30d, 90d, 1y
        $cacheKey = "analytics_dashboard_{$request->user()->id}_{$period}";

        $data = Cache::remember($cacheKey, 300, function () use ($period) {
            return $this->analyticsService->getDashboardData(auth()->user(), $period);
        });

        return $this->successResponse(new AnalyticsResource($data));
    }

    /**
     * Analytics específicos de posts
     */
    public function posts(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'period' => 'in:7d,30d,90d,1y',
            'post_ids' => 'sometimes|array',
            'post_ids.*' => 'integer|exists:posts,id',
            'metrics' => 'sometimes|array',
            'metrics.*' => 'in:views,likes,comments,shares,engagement_rate',
        ]);

        $data = $this->analyticsService->getPostsAnalytics(
            auth()->user(),
            $validated['period'] ?? '30d',
            $validated['post_ids'] ?? null,
            $validated['metrics'] ?? ['views', 'likes', 'comments']
        );

        return $this->successResponse([
            'analytics' => $data,
            'insights' => $this->analyticsService->generateInsights($data),
            'recommendations' => $this->analyticsService->getRecommendations($data),
        ]);
    }

    /**
     * Tendencias y comparaciones
     */
    public function trends(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'metric' => 'required|in:views,likes,comments,engagement_rate',
            'period' => 'in:daily,weekly,monthly',
            'compare_period' => 'sometimes|in:previous_period,same_period_last_year',
        ]);

        $trends = $this->analyticsService->getTrends(
            auth()->user(),
            $validated['metric'],
            $validated['period'],
            $validated['compare_period'] ?? null
        );

        return $this->successResponse([
            'trends' => $trends,
            'growth_rate' => $this->calculateGrowthRate($trends),
            'predictions' => $this->analyticsService->predictFutureTrends($trends),
        ]);
    }

    /**
     * Analytics públicos (sin autenticación)
     */
    public function public(): JsonResponse
    {
        $publicData = Cache::remember('public_analytics', 3600, function () {
            return $this->analyticsService->getPublicAnalytics();
        });

        return $this->successResponse($publicData);
    }

    /**
     * Exportar analytics en diferentes formatos
     */
    public function export(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'format' => 'required|in:csv,xlsx,pdf,json',
            'period' => 'in:7d,30d,90d,1y',
            'include' => 'sometimes|array',
            'include.*' => 'in:posts,users,categories,trends',
        ]);

        $data = $this->analyticsService->getExportData(
            auth()->user(),
            $validated['period'] ?? '30d',
            $validated['include'] ?? ['posts']
        );

        $exportService = app(\App\Services\V2\ExportService::class);
        $file = $exportService->export($data, $validated['format']);

        return $this->successResponse([
            'download_url' => $file['url'],
            'file_size' => $file['size'],
            'expires_at' => $file['expires_at'],
            'format' => $validated['format'],
        ], 'Export prepared successfully');
    }

    private function calculateGrowthRate(array $trends): array
    {
        if (count($trends) < 2) {
            return ['growth_rate' => 0, 'trend' => 'insufficient_data'];
        }

        $first = reset($trends);
        $last = end($trends);
        
        $growthRate = $first['value'] > 0 
            ? (($last['value'] - $first['value']) / $first['value']) * 100 
            : 0;

        return [
            'growth_rate' => round($growthRate, 2),
            'trend' => $growthRate > 0 ? 'upward' : ($growthRate < 0 ? 'downward' : 'stable'),
            'period_start' => $first['date'],
            'period_end' => $last['date'],
        ];
    }
}
```

#### **Search Controller V2**
```php
<?php
// app/Http/Controllers/Api/V2/SearchController.php
namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\V2\SearchResultResource;
use App\Services\V2\SearchService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SearchController extends BaseController
{
    protected SearchService $searchService;

    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Búsqueda avanzada unificada
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => 'required|string|min:2|max:100',
            'type' => 'sometimes|in:posts,users,categories,all',
            'category' => 'sometimes|string|exists:categories,slug',
            'author' => 'sometimes|string|exists:users,id',
            'date_from' => 'sometimes|date',
            'date_to' => 'sometimes|date|after_or_equal:date_from',
            'sort' => 'sometimes|in:relevance,date,popularity',
            'per_page' => 'sometimes|integer|min:1|max:50',
        ]);

        $startTime = microtime(true);
        
        $results = $this->searchService->search($validated);
        
        $searchTime = microtime(true) - $startTime;

        return $this->successResponse([
            'results' => SearchResultResource::collection($results['data']),
            'meta' => [
                'query' => $validated['q'],
                'type' => $validated['type'] ?? 'all',
                'total_results' => $results['total'],
                'search_time_ms' => round($searchTime * 1000, 2),
                'page' => $results['current_page'],
                'per_page' => $results['per_page'],
            ],
            'suggestions' => $this->searchService->getSuggestions($validated['q']),
            'related_searches' => $this->searchService->getRelatedSearches($validated['q']),
            'filters' => $this->searchService->getAvailableFilters($results['data']),
        ]);
    }

    /**
     * Sugerencias de búsqueda en tiempo real
     */
    public function suggestions(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => 'required|string|min:1|max:50',
            'limit' => 'sometimes|integer|min:1|max:10',
        ]);

        $suggestions = $this->searchService->getAutocompleteSuggestions(
            $validated['q'],
            $validated['limit'] ?? 5
        );

        return $this->successResponse([
            'suggestions' => $suggestions,
            'query' => $validated['q'],
        ]);
    }
}
```

---

# ⚙️ **Módulo 12: Configuración de Recursos en API - Manipulación y Versionado**

## **Resource Transformation Engine**

**Analogía del Traductor Universal:**
El sistema de transformación de resources es como un traductor universal que puede convertir cualquier dato interno en el formato exacto que necesita cada versión de la API.

### **Transformer Factory Pattern**

#### **Resource Factory Avanzado**
```php
<?php
// app/Http/Resources/ResourceFactory.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;

class ResourceFactory
{
    private static array $resourceMappings = [
        'V1' => [
            'Post' => 'App\\Http\\Resources\\V1\\PostResource',
            'User' => 'App\\Http\\Resources\\V1\\UserResource',
            'Category' => 'App\\Http\\Resources\\V1\\CategoryResource',
        ],
        'V2' => [
            'Post' => 'App\\Http\\Resources\\V2\\PostResource',
            'User' => 'App\\Http\\Resources\\V2\\UserResource',
            'Category' => 'App\\Http\\Resources\\V2\\CategoryResource',
        ],
    ];

    public static function create(
        Model $model, 
        string $version = null, 
        string $context = 'default',
        array $options = []
    ) {
        $version = $version ?? self::detectVersion();
        $modelName = class_basename($model);
        
        $resourceClass = self::getResourceClass($modelName, $version, $context);
        
        if (!class_exists($resourceClass)) {
            // Fallback a versión anterior o clase base
            $resourceClass = self::getFallbackResource($modelName, $version);
        }

        return new $resourceClass($model, $context, $options);
    }

    public static function collection(
        $collection, 
        string $version = null, 
        string $context = 'default',
        array $options = []
    ) {
        if ($collection->isEmpty()) {
            return collect([]);
        }

        $version = $version ?? self::detectVersion();
        $modelName = class_basename($collection->first());
        
        $collectionClass = self::getCollectionClass($modelName, $version);
        
        if (class_exists($collectionClass)) {
            return new $collectionClass($collection, $context, $options);
        }

        // Fallback a resource individual
        $resourceClass = self::getResourceClass($modelName, $version, $context);
        return $resourceClass::collection($collection);
    }

    private static function detectVersion(): string
    {
        $request = request();
        
        // 1. Header Accept personalizado
        if ($request->hasHeader('Accept-Version')) {
            return 'V' . $request->header('Accept-Version');
        }
        
        // 2. URL path
        if (preg_match('/\/api\/v(\d+)\//', $request->path(), $matches)) {
            return 'V' . $matches[1];
        }
        
        // 3. Query parameter
        if ($request->has('version')) {
            return 'V' . $request->get('version');
        }
        
        // 4. Default
        return 'V' . config('api.default_version', '1');
    }

    private static function getResourceClass(
        string $modelName, 
        string $version, 
        string $context
    ): string {
        // Para contextos específicos como 'detail', 'card', etc.
        if ($context !== 'default') {
            $contextClass = "App\\Http\\Resources\\{$version}\\{$modelName}" . 
                           ucfirst($context) . "Resource";
            
            if (class_exists($contextClass)) {
                return $contextClass;
            }
        }

        return self::$resourceMappings[$version][$modelName] ?? 
               "App\\Http\\Resources\\{$version}\\{$modelName}Resource";
    }

    private static function getCollectionClass(string $modelName, string $version): string
    {
        return "App\\Http\\Resources\\{$version}\\{$modelName}Collection";
    }

    private static function getFallbackResource(string $modelName, string $version): string
    {
        // Intentar versión anterior
        $versionNumber = (int) str_replace('V', '', $version);
        
        if ($versionNumber > 1) {
            $fallbackVersion = 'V' . ($versionNumber - 1);
            if (isset(self::$resourceMappings[$fallbackVersion][$modelName])) {
                return self::$resourceMappings[$fallbackVersion][$modelName];
            }
        }

        // Último fallback a V1
        return self::$resourceMappings['V1'][$modelName] ?? 
               "App\\Http\\Resources\\V1\\{$modelName}Resource";
    }
}
```

### **Resources V2 con Transformaciones Inteligentes**

#### **Post Resource V2 Avanzado**
```php
<?php
// app/Http/Resources/V2/PostResource.php
namespace App\Http\Resources\V2;

use App\Http\Resources\V1\PostResource as V1PostResource;
use Illuminate\Http\Request;

class PostResource extends V1PostResource
{
    private string $context;
    private array $options;

    public function __construct($resource, string $context = 'default', array $options = [])
    {
        parent::__construct($resource);
        $this->context = $context;
        $this->options = $options;
    }

    public function toArray(Request $request): array
    {
        // Datos base de V1
        $data = parent::toArray($request);
        
        // Mejoras específicas de V2
        $v2Enhancements = [
            // Métricas mejoradas
            'metrics' => [
                'views' => $this->views_count,
                'likes' => $this->likes_count,
                'comments' => $this->comments_count ?? 0,
                'shares' => $this->shares_count ?? 0,
                'engagement_rate' => $this->calculateEngagementRate(),
                'reading_time' => $this->calculateReadingTime(),
                'bounce_rate' => $this->getBounceRate(),
            ],

            // SEO mejorado
            'seo' => [
                'meta_title' => $this->seo_title ?? $this->title,
                'meta_description' => $this->seo_description ?? $this->excerpt,
                'canonical_url' => route('posts.show', $this->slug),
                'og_image' => $this->getOpenGraphImage(),
                'structured_data' => $this->getStructuredData(),
            ],

            // Contenido enriquecido
            'content_analysis' => [
                'word_count' => str_word_count(strip_tags($this->content)),
                'readability_score' => $this->calculateReadabilityScore(),
                'keyword_density' => $this->analyzeKeywordDensity(),
                'internal_links' => $this->countInternalLinks(),
            ],

            // Engagement temporal
            'engagement_trends' => $this->when(
                $this->context === 'analytics',
                fn() => $this->getEngagementTrends()
            ),

            // Personalización
            'personalization' => $this->when(
                $request->user(),
                fn() => $this->getPersonalizationData($request->user())
            ),
        ];

        // Fusionar datos según contexto
        return $this->applyContextualTransformation(
            array_merge($data, $v2Enhancements)
        );
    }

    private function applyContextualTransformation(array $data): array
    {
        return match ($this->context) {
            'list' => $this->transformForList($data),
            'detail' => $this->transformForDetail($data),
            'card' => $this->transformForCard($data),
            'search' => $this->transformForSearch($data),
            'analytics' => $this->transformForAnalytics($data),
            'feed' => $this->transformForFeed($data),
            default => $data,
        };
    }

    private function transformForList(array $data): array
    {
        // Optimizado para listados - datos esenciales
        return [
            'id' => $data['id'],
            'title' => $data['title'],
            'slug' => $data['slug'],
            'excerpt' => \Str::limit($data['excerpt'], 150),
            'published_at' => $data['published_at'],
            'author' => [
                'name' => $data['author']['name'],
                'avatar' => $data['author']['avatar'],
            ],
            'category' => $data['category']['name'],
            'featured_image' => $data['featured_image']['medium'] ?? null,
            'metrics' => [
                'views' => $data['metrics']['views'],
                'reading_time' => $data['metrics']['reading_time'],
            ],
            'urls' => [
                'self' => $data['links']['self'],
            ],
        ];
    }

    private function transformForDetail(array $data): array
    {
        // Vista completa con todos los datos
        return $data; // Mantener todos los datos
    }

    private function transformForCard(array $data): array
    {
        // Optimizado para cards/widgets
        return [
            'id' => $data['id'],
            'title' => $data['title'],
            'excerpt' => \Str::limit($data['excerpt'], 100),
            'featured_image' => $data['featured_image']['thumbnail'] ?? null,
            'author' => $data['author']['name'],
            'published_at' => $data['published_at'],
            'reading_time' => $data['metrics']['reading_time'],
            'category' => [
                'name' => $data['category']['name'],
                'color' => $data['category']['color'] ?? '#3B82F6',
            ],
            'url' => $data['links']['self'],
        ];
    }

    private function transformForSearch(array $data): array
    {
        // Optimizado para resultados de búsqueda
        return [
            'id' => $data['id'],
            'title' => $data['title'],
            'excerpt' => $data['excerpt'],
            'url' => $data['links']['self'],
            'type' => 'post',
            'relevance_score' => $this->options['relevance_score'] ?? 1,
            'match_highlights' => $this->options['highlights'] ?? [],
            'breadcrumb' => [
                $data['category']['name'],
                $data['author']['name'],
            ],
            'published_at' => $data['published_at'],
        ];
    }

    private function transformForAnalytics(array $data): array
    {
        // Enfocado en métricas y análisis
        return [
            'id' => $data['id'],
            'title' => $data['title'],
            'metrics' => $data['metrics'],
            'seo' => $data['seo'],
            'content_analysis' => $data['content_analysis'],
            'engagement_trends' => $data['engagement_trends'] ?? null,
            'performance_score' => $this->calculatePerformanceScore($data['metrics']),
            'optimization_suggestions' => $this->getOptimizationSuggestions($data),
        ];
    }

    private function transformForFeed(array $data): array
    {
        // Optimizado para feeds RSS/social
        return [
            'id' => $data['id'],
            'title' => $data['title'],
            'content' => $data['content'],
            'excerpt' => $data['excerpt'],
            'published_at' => $data['published_at'],
            'author' => $data['author'],
            'category' => $data['category'],
            'guid' => $data['links']['self'],
            'permalink' => $data['links']['self'],
        ];
    }

    // Métodos helper para cálculos
    private function calculateEngagementRate(): float
    {
        $views = $this->views_count ?: 1;
        $engagements = $this->likes_count + ($this->comments_count ?? 0) + ($this->shares_count ?? 0);
        
        return round(($engagements / $views) * 100, 2);
    }

    private function calculateReadingTime(): int
    {
        $wordCount = str_word_count(strip_tags($this->content));
        return ceil($wordCount / 200); // 200 WPM
    }

    private function calculateReadabilityScore(): array
    {
        $text = strip_tags($this->content);
        $sentences = preg_split('/[.!?]+/', $text);
        $words = str_word_count($text);
        $syllables = $this->countSyllables($text);
        
        // Flesch Reading Ease Score
        $score = 206.835 - (1.015 * ($words / count($sentences))) - (84.6 * ($syllables / $words));
        
        return [
            'score' => round($score, 1),
            'level' => $this->getReadabilityLevel($score),
            'grade_level' => $this->getGradeLevel($score),
        ];
    }

    private function analyzeKeywordDensity(): array
    {
        $text = strtolower(strip_tags($this->content));
        $words = str_word_count($text, 1);
        $totalWords = count($words);
        
        // Palabras comunes a ignorar
        $stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
        $words = array_diff($words, $stopWords);
        
        $wordCount = array_count_values($words);
        arsort($wordCount);
        
        $topKeywords = array_slice($wordCount, 0, 10, true);
        
        return array_map(function($count) use ($totalWords) {
            return [
                'count' => $count,
                'density' => round(($count / $totalWords) * 100, 2),
            ];
        }, $topKeywords);
    }

    private function getEngagementTrends(): array
    {
        // Simulated - en implementación real vendría de analytics
        return [
            'daily_views' => $this->getDailyViews(),
            'engagement_by_hour' => $this->getEngagementByHour(),
            'referral_sources' => $this->getReferralSources(),
        ];
    }

    private function getPersonalizationData($user): array
    {
        return [
            'is_bookmarked' => false, // Implementar lógica real
            'reading_progress' => 0,   // Implementar tracking
            'recommended_reason' => $this->getRecommendationReason($user),
            'similar_interests' => $this->getSimilarInterests($user),
        ];
    }

    // Métodos auxiliares adicionales
    private function getBounceRate(): float
    {
        // Implementación simulada
        return rand(20, 80) + (rand(0, 99) / 100);
    }

    private function getOpenGraphImage(): string
    {
        return $this->featured_image 
            ? asset('storage/' . $this->featured_image)
            : asset('images/default-og-image.jpg');
    }

    private function getStructuredData(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'headline' => $this->title,
            'image' => $this->getOpenGraphImage(),
            'author' => [
                '@type' => 'Person',
                'name' => $this->user->name,
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => config('app.name'),
            ],
            'datePublished' => $this->published_at?->toISOString(),
            'dateModified' => $this->updated_at->toISOString(),
        ];
    }

    private function countInternalLinks(): int
    {
        $domain = config('app.url');
        preg_match_all('/<a[^>]+href=["\']([^"\']+)["\'][^>]*>/i', $this->content, $matches);
        
        return collect($matches[1])
            ->filter(fn($url) => str_contains($url, $domain))
            ->count();
    }

    private function calculatePerformanceScore(array $metrics): float
    {
        // Algoritmo ponderado para score de performance
        $viewsScore = min($metrics['views'] / 1000, 1) * 30;
        $engagementScore = min($metrics['engagement_rate'] / 10, 1) * 40;
        $readabilityScore = 20; // Basado en readability
        $seoScore = 10; // Basado en SEO factors
        
        return round($viewsScore + $engagementScore + $readabilityScore + $seoScore, 1);
    }

    private function getOptimizationSuggestions(array $data): array
    {
        $suggestions = [];
        
        if ($data['metrics']['engagement_rate'] < 2) {
            $suggestions[] = [
                'type' => 'engagement',
                'message' => 'Consider adding more interactive elements to improve engagement',
                'priority' => 'high',
            ];
        }
        
        if ($data['content_analysis']['readability_score']['score'] < 60) {
            $suggestions[] = [
                'type' => 'readability',
                'message' => 'Simplify sentences to improve readability',
                'priority' => 'medium',
            ];
        }
        
        if (empty($data['featured_image'])) {
            $suggestions[] = [
                'type' => 'seo',
                'message' => 'Add a featured image to improve social sharing',
                'priority' => 'low',
            ];
        }
        
        return $suggestions;
    }

    // Métodos helper adicionales (implementaciones simplificadas)
    private function countSyllables(string $text): int
    {
        // Implementación simplificada de conteo de sílabas
        $words = str_word_count(strtolower($text), 1);
        return array_sum(array_map(function($word) {
            return max(1, preg_match_all('/[aeiouy]+/', $word));
        }, $words));
    }

    private function getReadabilityLevel(float $score): string
    {
        return match (true) {
            $score >= 90 => 'Very Easy',
            $score >= 80 => 'Easy',
            $score >= 70 => 'Fairly Easy',
            $score >= 60 => 'Standard',
            $score >= 50 => 'Fairly Difficult',
            $score >= 30 => 'Difficult',
            default => 'Very Difficult',
        };
    }

    private function getGradeLevel(float $score): string
    {
        return match (true) {
            $score >= 90 => '5th grade',
            $score >= 80 => '6th grade',
            $score >= 70 => '7th grade',
            $score >= 60 => '8th-9th grade',
            $score >= 50 => '10th-12th grade',
            $score >= 30 => 'College level',
            default => 'Graduate level',
        };
    }

    private function getDailyViews(): array
    {
        // Implementación simulada
        return collect(range(1, 30))->map(function($day) {
            return [
                'date' => now()->subDays(30 - $day)->format('Y-m-d'),
                'views' => rand(10, 100),
            ];
        })->toArray();
    }

    private function getEngagementByHour(): array
    {
        // Implementación simulada
        return collect(range(0, 23))->map(function($hour) {
            return [
                'hour' => $hour,
                'engagement' => rand(1, 50),
            ];
        })->toArray();
    }

    private function getReferralSources(): array
    {
        return [
            'direct' => 45,
            'google' => 30,
            'social' => 15,
            'referral' => 10,
        ];
    }

    private function getRecommendationReason($user): string
    {
        // Lógica simplificada de recomendación
        return 'Based on your reading history in ' . $this->category->name;
    }

    private function getSimilarInterests($user): array
    {
        return ['laravel', 'php', 'api development']; // Implementación simplificada
    }
}
```

### **Version Migration System**

#### **Data Transformer Service**
```php
<?php
// app/Services/V2/DataTransformerService.php
namespace App\Services\V2;

class DataTransformerService
{
    private array $transformationRules = [];

    public function __construct()
    {
        $this->loadTransformationRules();
    }

    /**
     * Transformar datos entre versiones
     */
    public function transform(array $data, string $fromVersion, string $toVersion): array
    {
        $transformationKey = "{$fromVersion}_to_{$toVersion}";
        
        if (!isset($this->transformationRules[$transformationKey])) {
            return $data; // Sin transformación necesaria
        }

        $rules = $this->transformationRules[$transformationKey];
        
        foreach ($rules as $rule) {
            $data = $this->applyTransformationRule($data, $rule);
        }

        return $data;
    }

    /**
     * Cargar reglas de transformación
     */
    private function loadTransformationRules(): void
    {
        $this->transformationRules = [
            'v1_to_v2' => [
                ['type' => 'rename_field', 'from' => 'created_at', 'to' => 'created_date'],
                ['type' => 'add_field', 'field' => 'version', 'value' => 'v2'],
                ['type' => 'transform_field', 'field' => 'status', 'transformer' => 'expandStatus'],
                ['type' => 'nest_fields', 'fields' => ['views_count', 'likes_count'], 'under' => 'metrics'],
                ['type' => 'add_calculated_field', 'field' => 'engagement_rate', 'calculator' => 'calculateEngagement'],
            ],
            'v2_to_v1' => [
                ['type' => 'rename_field', 'from' => 'created_date', 'to' => 'created_at'],
                ['type' => 'remove_field', 'field' => 'version'],
                ['type' => 'transform_field', 'field' => 'status', 'transformer' => 'simplifyStatus'],
                ['type' => 'unnest_fields', 'from' => 'metrics', 'fields' => ['views_count', 'likes_count']],
                ['type' => 'remove_field', 'field' => 'engagement_rate'],
            ],
        ];
    }

    /**
     * Aplicar regla de transformación específica
     */
    private function applyTransformationRule(array $data, array $rule): array
    {
        return match ($rule['type']) {
            'rename_field' => $this->renameField($data, $rule['from'], $rule['to']),
            'add_field' => $this->addField($data, $rule['field'], $rule['value']),
            'remove_field' => $this->removeField($data, $rule['field']),
            'transform_field' => $this->transformField($data, $rule['field'], $rule['transformer']),
            'nest_fields' => $this->nestFields($data, $rule['fields'], $rule['under']),
            'unnest_fields' => $this->unnestFields($data, $rule['from'], $rule['fields']),
            'add_calculated_field' => $this->addCalculatedField($data, $rule['field'], $rule['calculator']),
            default => $data,
        };
    }

    private function renameField(array $data, string $from, string $to): array
    {
        if (isset($data[$from])) {
            $data[$to] = $data[$from];
            unset($data[$from]);
        }
        return $data;
    }

    private function addField(array $data, string $field, $value): array
    {
        $data[$field] = $value;
        return $data;
    }

    private function removeField(array $data, string $field): array
    {
        unset($data[$field]);
        return $data;
    }

    private function transformField(array $data, string $field, string $transformer): array
    {
        if (isset($data[$field])) {
            $data[$field] = $this->$transformer($data[$field]);
        }
        return $data;
    }

    private function nestFields(array $data, array $fields, string $under): array
    {
        $data[$under] = [];
        
        foreach ($fields as $field) {
            if (isset($data[$field])) {
                $data[$under][$field] = $data[$field];
                unset($data[$field]);
            }
        }
        
        return $data;
    }

    private function unnestFields(array $data, string $from, array $fields): array
    {
        if (isset($data[$from]) && is_array($data[$from])) {
            foreach ($fields as $field) {
                if (isset($data[$from][$field])) {
                    $data[$field] = $data[$from][$field];
                }
            }
            unset($data[$from]);
        }
        
        return $data;
    }

    private function addCalculatedField(array $data, string $field, string $calculator): array
    {
        $data[$field] = $this->$calculator($data);
        return $data;
    }

    // Transformadores específicos
    private function expandStatus(string $status): array
    {
        return [
            'value' => $status,
            'label' => ucfirst($status),
            'can_edit' => in_array($status, ['draft', 'published']),
        ];
    }

    private function simplifyStatus(array $statusData): string
    {
        return $statusData['value'] ?? 'draft';
    }

    private function calculateEngagement(array $data): float
    {
        $views = $data['views_count'] ?? $data['metrics']['views_count'] ?? 1;
        $likes = $data['likes_count'] ?? $data['metrics']['likes_count'] ?? 0;
        $comments = $data['comments_count'] ?? 0;
        
        return round((($likes + $comments) / $views) * 100, 2);
    }
}
```

### **Middleware de Versionado Avanzado**

#### **Version Detection y Headers**
```php
<?php
// app/Http/Middleware/ApiVersionMiddleware.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ApiVersionMiddleware
{
    private array $supportedVersions = ['v1', 'v2'];
    private array $versionFeatures = [
        'v1' => ['basic_crud', 'simple_auth'],
        'v2' => ['basic_crud', 'simple_auth', 'analytics', 'search', 'webhooks'],
    ];

    public function handle(Request $request, Closure $next)
    {
        $version = $this->detectVersion($request);
        
        // Validar versión
        if (!$this->isValidVersion($version)) {
            return $this->versionNotSupportedResponse($version);
        }

        // Agregar información de versión al request
        $request->attributes->set('api_version', $version);
        $request->attributes->set('api_features', $this->versionFeatures[$version] ?? []);

        $response = $next($request);

        // Agregar headers de versión a la respuesta
        if ($response instanceof JsonResponse) {
            $this->addVersionHeaders($response, $version);
        }

        return $response;
    }

    private function detectVersion(Request $request): string
    {
        // 1. Header Accept-Version (preferido)
        if ($request->hasHeader('Accept-Version')) {
            return 'v' . $request->header('Accept-Version');
        }

        // 2. Header Accept con versión personalizada
        $accept = $request->header('Accept', '');
        if (preg_match('/application\/vnd\.api\+json;version=(\d+)/', $accept, $matches)) {
            return 'v' . $matches[1];
        }

        // 3. URL path
        if (preg_match('/\/api\/v(\d+)\//', $request->path(), $matches)) {
            return 'v' . $matches[1];
        }

        // 4. Query parameter
        if ($request->has('version')) {
            return 'v' . $request->get('version');
        }

        // 5. Default
        return config('api.default_version', 'v1');
    }

    private function isValidVersion(string $version): bool
    {
        return in_array($version, $this->supportedVersions);
    }

    private function addVersionHeaders(JsonResponse $response, string $version): void
    {
        $headers = [
            'API-Version' => $version,
            'API-Features' => implode(',', $this->versionFeatures[$version] ?? []),
            'API-Supported-Versions' => implode(',', $this->supportedVersions),
        ];

        // Agregar header de deprecación si aplica
        $versionConfig = config("api.versions.{$version}", []);
        if ($versionConfig['deprecated'] ?? false) {
            $headers['Deprecation'] = 'true';
            
            if (isset($versionConfig['sunset_date'])) {
                $headers['Sunset'] = $versionConfig['sunset_date'];
            }
            
            $latestVersion = config('api.latest_version');
            $headers['Link'] = '<' . url("/api/{$latestVersion}") . '>; rel="successor-version"';
        }

        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }
    }

    private function versionNotSupportedResponse(string $version): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => "API version '{$version}' is not supported",
            'error' => [
                'code' => 'UNSUPPORTED_VERSION',
                'requested_version' => $version,
                'supported_versions' => $this->supportedVersions,
                'default_version' => config('api.default_version'),
                'latest_version' => config('api.latest_version'),
            ],
            'links' => [
                'documentation' => url('/docs/api'),
                'migration_guide' => url('/docs/api/migration'),
            ],
        ], 400);
    }
}
```

---

# 📊 **Módulo 13: Configuración Avanzada de Colecciones y Recursos**

## **Collections con Funcionalidades Enterprise**

**Analogía del Centro de Comando:**
Las Collections avanzadas son como un centro de comando que no solo muestra información, sino que también analiza patrones, predice tendencias y proporciona insights accionables.

### **Smart Collections con IA**

#### **Intelligent Post Collection**
```php
<?php
// app/Http/Resources/V2/IntelligentPostCollection.php
namespace App\Http\Resources\V2;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Services\V2\{AIInsightsService, RecommendationService, TrendAnalysisService};

class IntelligentPostCollection extends ResourceCollection
{
    private AIInsightsService $aiService;
    private RecommendationService $recommendationService;
    private TrendAnalysisService $trendService;

    public function __construct(
        $resource,
        AIInsightsService $aiService = null,
        RecommendationService $recommendationService = null,
        TrendAnalysisService $trendService = null
    ) {
        parent::__construct($resource);
        $this->aiService = $aiService ?? app(AIInsightsService::class);
        $this->recommendationService = $recommendationService ?? app(RecommendationService::class);
        $this->trendService = $trendService ?? app(TrendAnalysisService::class);
    }

    public function toArray(Request $request): array
    {
        $user = $request->user();
        
        return [
            'data' => $this->collection,
            'intelligent_insights' => $this->getAIInsights(),
            'personalized_recommendations' => $this->getPersonalizedRecommendations($user),
            'trend_analysis' => $this->getTrendAnalysis(),
            'content_optimization' => $this->getContentOptimizationSuggestions(),
            'performance_predictions' => $this->getPerformancePredictions(),
            'user_behavior_analysis' => $this->getUserBehaviorAnalysis($user),
        ];
    }

    public function with(Request $request): array
    {
        return [
            'meta' => [
                'ai_powered' => true,
                'model_version' => '2.1',
                'confidence_threshold' => 0.75,
                'analysis_date' => now()->toISOString(),
            ],
            'configuration' => [
                'personalization_enabled' => $request->user() !== null,
                'trend_analysis_period' => '30d',
                'prediction_horizon' => '7d',
            ],
            'api_suggestions' => $this->getAPISuggestions($request),
        ];
    }

    private function getAIInsights(): array
    {
        $posts = $this->collection;
        
        return [
            'content_themes' => $this->aiService->extractContentThemes($posts),
            'sentiment_analysis' => $this->aiService->analyzeSentiment($posts),
            'readability_distribution' => $this->aiService->analyzeReadability($posts),
            'content_gaps' => $this->aiService->identifyContentGaps($posts),
            'viral_potential' => $this->aiService->assessViralPotential($posts),
        ];
    }

    private function getPersonalizedRecommendations($user): array
    {
        if (!$user) {
            return ['message' => 'Login for personalized recommendations'];
        }

        return [
            'next_to_read' => $this->recommendationService->getNextToRead($user, $this->collection),
            'similar_interests' => $this->recommendationService->findSimilarInterests($user),
            'content_for_you' => $this->recommendationService->getPersonalizedContent($user),
            'authors_to_follow' => $this->recommendationService->getAuthorsToFollow($user),
            'categories_to_explore' => $this->recommendationService->getCategoriesToExplore($user),
        ];
    }

    private function getTrendAnalysis(): array
    {
        return [
            'trending_topics' => $this->trendService->getTrendingTopics($this->collection),
            'engagement_patterns' => $this->trendService->analyzeEngagementPatterns($this->collection),
            'optimal_posting_times' => $this->trendService->getOptimalPostingTimes(),
            'content_lifecycle' => $this->trendService->analyzeContentLifecycle($this->collection),
            'seasonal_trends' => $this->trendService->getSeasonalTrends(),
        ];
    }

    private function getContentOptimizationSuggestions(): array
    {
        $posts = $this->collection;
        
        return [
            'title_optimization' => $this->analyzeTitle optimization($posts),
            'content_length_recommendations' => $this->analyzeContentLength($posts),
            'seo_opportunities' => $this->identifySEOOpportunities($posts),
            'engagement_boosters' => $this->suggestEngagementBoosters($posts),
            'cross_promotion_opportunities' => $this->findCrossPromotionOpportunities($posts),
        ];
    }

    private function getPerformancePredictions(): array
    {
        return [
            'next_week_projections' => $this->predictNextWeekPerformance(),
            'content_success_probability' => $this->predictContentSuccessProbability(),
            'audience_growth_forecast' => $this->forecastAudienceGrowth(),
            'engagement_trend_prediction' => $this->predictEngagementTrends(),
        ];
    }

    private function getUserBehaviorAnalysis($user): array
    {
        if (!$user) {
            return [];
        }

        return [
            'reading_patterns' => $this->analyzeReadingPatterns($user),
            'content_preferences' => $this->analyzeContentPreferences($user),
            'engagement_behavior' => $this->analyzeEngagementBehavior($user),
            'discovery_methods' => $this->analyzeDiscoveryMethods($user),
            'retention_indicators' => $this->analyzeRetentionIndicators($user),
        ];
    }

    private function getAPISuggestions(Request $request): array
    {
        $suggestions = [];
        
        // Analizar el uso de la API y sugerir mejoras
        if (!$request->has('include')) {
            $suggestions[] = [
                'type' => 'optimization',
                'message' => 'Use ?include=author,category to reduce API calls',
                'benefit' => 'Reduce N+1 queries and improve performance',
            ];
        }

        if (!$request->has('fields')) {
            $suggestions[] = [
                'type' => 'bandwidth',
                'message' => 'Use ?fields=id,title,excerpt for lighter responses',
                'benefit' => 'Reduce bandwidth usage by up to 60%',
            ];
        }

        if ($request->get('per_page', 15) > 50) {
            $suggestions[] = [
                'type' => 'performance',
                'message' => 'Consider using cursor pagination for large datasets',
                'benefit' => 'Better performance for large result sets',
            ];
        }

        return $suggestions;
    }

    // Métodos de análisis implementados (versiones simplificadas)
    private function analyzeTitleOptimization($posts): array
    {
        $analysis = [
            'average_length' => 0,
            'optimal_range' => [50, 60],
            'too_short' => 0,
            'too_long' => 0,
            'suggestions' => [],
        ];

        foreach ($posts as $post) {
            $titleLength = strlen($post->title);
            $analysis['average_length'] += $titleLength;
            
            if ($titleLength < 30) {
                $analysis['too_short']++;
            } elseif ($titleLength > 70) {
                $analysis['too_long']++;
            }
        }

        $analysis['average_length'] = round($analysis['average_length'] / $posts->count());

        if ($analysis['too_short'] > $posts->count() * 0.3) {
            $analysis['suggestions'][] = 'Consider longer, more descriptive titles';
        }

        if ($analysis['too_long'] > $posts->count() * 0.3) {
            $analysis['suggestions'][] = 'Shorten titles for better readability';
        }

        return $analysis;
    }

    private function analyzeContentLength($posts): array
    {
        $lengths = $posts->map(function ($post) {
            return str_word_count(strip_tags($post->content));
        });

        return [
            'average_words' => round($lengths->avg()),
            'optimal_range' => [300, 1200],
            'distribution' => [
                'short' => $lengths->filter(fn($l) => $l < 300)->count(),
                'medium' => $lengths->filter(fn($l) => $l >= 300 && $l <= 1200)->count(),
                'long' => $lengths->filter(fn($l) => $l > 1200)->count(),
            ],
            'recommendations' => $this->getContentLengthRecommendations($lengths->avg()),
        ];
    }

    private function identifySEOOpportunities($posts): array
    {
        $opportunities = [];
        
        foreach ($posts as $post) {
            $issues = [];
            
            if (!$post->featured_image) {
                $issues[] = 'Missing featured image';
            }
            
            if (strlen($post->excerpt) < 120) {
                $issues[] = 'Meta description too short';
            }
            
            if (!preg_match('/\bh[1-6]\b/', $post->content)) {
                $issues[] = 'No heading tags found';
            }
            
            if (count($issues) > 0) {
                $opportunities[] = [
                    'post_id' => $post->id,
                    'title' => $post->title,
                    'issues' => $issues,
                    'priority' => count($issues) > 2 ? 'high' : 'medium',
                ];
            }
        }

        return [
            'posts_with_issues' => count($opportunities),
            'total_issues' => array_sum(array_map(fn($o) => count($o['issues']), $opportunities)),
            'opportunities' => array_slice($opportunities, 0, 10), // Top 10
        ];
    }

    private function suggestEngagementBoosters($posts): array
    {
        $lowEngagementPosts = $posts->filter(function ($post) {
            $engagementRate = $post->views_count > 0 
                ? (($post->likes_count + ($post->comments_count ?? 0)) / $post->views_count) * 100
                : 0;
            return $engagementRate < 2; // Menos del 2% de engagement
        });

        return [
            'low_engagement_count' => $lowEngagementPosts->count(),
            'suggestions' => [
                'Add calls-to-action',
                'Include more interactive elements',
                'Ask questions to encourage comments',
                'Share on social media',
                'Create related content series',
            ],
            'posts_to_optimize' => $lowEngagementPosts->take(5)->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'current_engagement' => round((($post->likes_count + ($post->comments_count ?? 0)) / max($post->views_count, 1)) * 100, 2),
                ];
            }),
        ];
    }

    private function findCrossPromotionOpportunities($posts): array
    {
        // Agrupar por categoría para encontrar oportunidades de cross-promotion
        $byCategory = $posts->groupBy('category_id');
        
        $opportunities = [];
        
        foreach ($byCategory as $categoryId => $categoryPosts) {
            if ($categoryPosts->count() >= 3) {
                $opportunities[] = [
                    'category' => $categoryPosts->first()->category->name,
                    'posts_count' => $categoryPosts->count(),
                    'suggestion' => 'Create a series or collection linking these related posts',
                    'potential_uplift' => rand(15, 35) . '%',
                ];
            }
        }

        return $opportunities;
    }

    private function predictNextWeekPerformance(): array
    {
        // Implementación simplificada de predicción
        $posts = $this->collection;
        $avgViews = $posts->avg('views_count');
        
        return [
            'predicted_views' => round($avgViews * 1.1), // 10% growth prediction
            'confidence' => 0.78,
            'factors' => [
                'Historical trend: +12%',
                'Seasonal adjustment: -2%',
                'Content quality score: +5%',
            ],
        ];
    }

    private function predictContentSuccessProbability(): array
    {
        return [
            'high_success_probability' => rand(2, 5),
            'medium_success_probability' => rand(5, 10),
            'factors_for_success' => [
                'Trending topics',
                'Optimal content length',
                'Strong headlines',
                'Visual content inclusion',
            ],
        ];
    }

    private function forecastAudienceGrowth(): array
    {
        return [
            'next_30_days' => '+' . rand(5, 15) . '%',
            'growth_drivers' => [
                'Content quality improvement',
                'Increased posting frequency',
                'Better SEO optimization',
            ],
            'confidence_level' => 'medium',
        ];
    }

    private function predictEngagementTrends(): array
    {
        return [
            'next_week_trend' => 'upward',
            'predicted_increase' => rand(8, 20) . '%',
            'key_factors' => [
                'Improved content variety',
                'Better posting times',
                'Increased audience interaction',
            ],
        ];
    }

    // Métodos de análisis de usuario (simplificados)
    private function analyzeReadingPatterns($user): array
    {
        return [
            'preferred_reading_time' => 'evening',
            'average_session_duration' => '12 minutes',
            'completion_rate' => '68%',
            'preferred_content_length' => 'medium (5-8 min read)',
        ];
    }

    private function analyzeContentPreferences($user): array
    {
        return [
            'top_categories' => ['Technology', 'Business', 'Lifestyle'],
            'preferred_authors' => ['Author A', 'Author B'],
            'content_formats' => ['How-to guides', 'Case studies', 'News'],
            'engagement_types' => ['Likes', 'Shares', 'Comments'],
        ];
    }

    private function analyzeEngagementBehavior($user): array
    {
        return [
            'engagement_rate' => '12%',
            'preferred_actions' => ['Like', 'Share'],
            'comment_frequency' => 'moderate',
            'sharing_behavior' => 'active',
        ];
    }

    private function analyzeDiscoveryMethods($user): array
    {
        return [
            'primary_discovery' => 'search',
            'secondary_discovery' => 'recommendations',
            'social_discovery' => '25%',
            'direct_access' => '40%',
        ];
    }

    private function analyzeRetentionIndicators($user): array
    {
        return [
            'return_likelihood' => 'high',
            'loyalty_score' => 8.5,
            'churn_risk' => 'low',
            'engagement_trend' => 'increasing',
        ];
    }

    private function getContentLengthRecommendations($avgLength): array
    {
        $recommendations = [];
        
        if ($avgLength < 300) {
            $recommendations[] = 'Consider longer, more detailed content';
        } elseif ($avgLength > 1500) {
            $recommendations[] = 'Break long content into series or add more subheadings';
        } else {
            $recommendations[] = 'Content length is in optimal range';
        }
        
        return $recommendations;
    }
}
```

### **Real-time Collections con WebSockets**

#### **Live Analytics Collection**
```php
<?php
// app/Http/Resources/V2/LiveAnalyticsCollection.php
namespace App\Http\Resources\V2;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Services\V2\RealTimeAnalyticsService;

class LiveAnalyticsCollection extends ResourceCollection
{
    private RealTimeAnalyticsService $realTimeService;
    private string $channelName;

    public function __construct($resource, RealTimeAnalyticsService $realTimeService = null)
    {
        parent::__construct($resource);
        $this->realTimeService = $realTimeService ?? app(RealTimeAnalyticsService::class);
        $this->channelName = 'analytics.' . auth()->id();
    }

    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'live_metrics' => $this->getLiveMetrics(),
            'real_time_events' => $this->getRealTimeEvents(),
            'websocket_config' => $this->getWebSocketConfig(),
            'live_updates' => $this->getLiveUpdateConfiguration(),
        ];
    }

    public function with(Request $request): array
    {
        return [
            'meta' => [
                'is_live' => true,
                'update_frequency' => '5s',
                'last_update' => now()->toISOString(),
                'active_connections' => $this->realTimeService->getActiveConnections(),
            ],
            'websocket' => [
                'endpoint' => config('broadcasting.connections.pusher.app_host'),
                'channel' => $this->channelName,
                'events' => [
                    'analytics.updated',
                    'post.viewed',
                    'engagement.changed',
                ],
            ],
        ];
    }

    private function getLiveMetrics(): array
    {
        return [
            'current_viewers' => $this->realTimeService->getCurrentViewers(),
            'active_posts' => $this->realTimeService->getActivePosts(),
            'real_time_engagement' => $this->realTimeService->getRealTimeEngagement(),
            'live_conversions' => $this->realTimeService->getLiveConversions(),
            'geographic_distribution' => $this->realTimeService->getGeographicDistribution(),
        ];
    }

    private function getRealTimeEvents(): array
    {
        return [
            'recent_views' => $this->realTimeService->getRecentViews(50),
            'live_comments' => $this->realTimeService->getLiveComments(20),
            'engagement_spikes' => $this->realTimeService->getEngagementSpikes(),
            'trending_content' => $this->realTimeService->getTrendingContent(),
        ];
    }

    private function getWebSocketConfig(): array
    {
        return [
            'enabled' => config('broadcasting.default') !== 'log',
            'driver' => config('broadcasting.default'),
            'channel' => $this->channelName,
            'auth_endpoint' => route('broadcasting.auth'),
            'reconnect_interval' => 5000, // 5 seconds
            'max_reconnect_attempts' => 10,
        ];
    }

    private function getLiveUpdateConfiguration(): array
    {
        return [
            'auto_update' => true,
            'update_intervals' => [
                'metrics' => 5,    // 5 seconds
                'events' => 2,     // 2 seconds
                'trends' => 30,    // 30 seconds
            ],
            'pause_on_inactive' => true,
            'resume_threshold' => 10, // seconds
        ];
    }
}
```

### **Advanced Export Collections**

#### **Multi-format Export Collection**
```php
<?php
// app/Http/Resources/V2/ExportableAnalyticsCollection.php
namespace App\Http\Resources\V2;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Services\V2\ExportService;

class ExportableAnalyticsCollection extends ResourceCollection
{
    private ExportService $exportService;
    private string $exportFormat;
    private array $exportOptions;

    public function __construct(
        $resource, 
        string $exportFormat = 'json',
        array $exportOptions = [],
        ExportService $exportService = null
    ) {
        parent::__construct($resource);
        $this->exportFormat = $exportFormat;
        $this->exportOptions = $exportOptions;
        $this->exportService = $exportService ?? app(ExportService::class);
    }

    public function toArray(Request $request): array
    {
        return match ($this->exportFormat) {
            'csv' => $this->toCsvFormat(),
            'xlsx' => $this->toExcelFormat(),
            'pdf' => $this->toPdfFormat(),
            'xml' => $this->toXmlFormat(),
            'powerbi' => $this->toPowerBIFormat(),
            'tableau' => $this->toTableauFormat(),
            'google_sheets' => $this->toGoogleS",
                  "