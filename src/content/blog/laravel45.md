---
title: 'APIs CON LARAVEL & ELOQUENT'
code: 'laravel'
description: 'Guía Completa - Desde Cero hasta Experto'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# 🚀 MASTERCLASS: APIs CON LARAVEL & ELOQUENT
## Guía Completa - Desde Cero hasta Experto

---

## 🎯 **OBJETIVOS DE ESTA MASTERCLASS**
Al finalizar esta guía podrás:
- Crear APIs RESTful profesionales con Laravel
- Dominar Eloquent ORM y todas sus relaciones
- Implementar Actions/Services para lógica de negocio
- Manejar validaciones y responses consistentes
- Aplicar mejores prácticas de arquitectura

---

## 📋 **ÍNDICE DE CONTENIDOS**

1. [Configuración Inicial](#configuración-inicial)
2. [Estructura Base de la API](#estructura-base)
3. [Modelos y Migraciones](#modelos-y-migraciones)
4. [Relaciones Eloquent](#relaciones-eloquent)
5. [Controladores API](#controladores-api)
6. [Actions y Service Classes](#actions-y-services)
7. [Validaciones y Form Requests](#validaciones)
8. [API Resources](#api-resources)
9. [Middlewares y Autenticación](#middlewares)
10. [Ejemplo Práctico Completo](#ejemplo-completo)

---

## 🔧 **FASE 1: CONFIGURACIÓN INICIAL**

### **1.1 Instalación y Setup**

```bash
# Crear nuevo proyecto Laravel
composer create-project laravel/laravel blog-api

# Instalar dependencias para API
composer require laravel/sanctum
composer require spatie/laravel-query-builder

# Configurar base de datos
php artisan migrate
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### **1.2 Configuración API en routes/api.php**

```php
<?php
// routes/api.php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Rutas públicas
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    
    // Rutas protegidas
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('posts', PostController::class);
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('comments', CommentController::class);
        
        // Relaciones específicas
        Route::get('/users/{user}/posts', [UserController::class, 'posts']);
        Route::get('/posts/{post}/comments', [PostController::class, 'comments']);
        Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
    });
});
```

---

## 🗄️ **FASE 2: MODELOS Y MIGRACIONES**

### **2.1 Migración: Users (ya existe, modificamos)**

```php
<?php
// database/migrations/xxxx_xx_xx_create_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();
            $table->enum('role', ['admin', 'editor', 'user'])->default('user');
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
```

### **2.2 Migración: Categories**

```php
<?php
// database/migrations/xxxx_xx_xx_create_categories_table.php

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
            $table->string('color', 7)->default('#3490dc');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('categories');
    }
};
```

### **2.3 Migración: Posts**

```php
<?php
// database/migrations/xxxx_xx_xx_create_posts_table.php

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
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('featured_image')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->integer('views_count')->default(0);
            
            // Relaciones
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            
            $table->timestamps();
            
            // Índices
            $table->index(['status', 'published_at']);
            $table->index('user_id');
            $table->index('category_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('posts');
    }
};
```

### **2.4 Migración: Comments**

```php
<?php
// database/migrations/xxxx_xx_xx_create_comments_table.php

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
            $table->timestamp('approved_at')->nullable();
            
            // Relaciones
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade');
            
            $table->timestamps();
            
            // Índices
            $table->index(['post_id', 'is_approved']);
            $table->index('user_id');
            $table->index('parent_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('comments');
    }
};
```

### **2.5 Migración: Tags y Post_Tags (Many-to-Many)**

```php
<?php
// database/migrations/xxxx_xx_xx_create_tags_table.php

return new class extends Migration
{
    public function up()
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }
};
```

```php
<?php
// database/migrations/xxxx_xx_xx_create_post_tag_table.php

return new class extends Migration
{
    public function up()
    {
        Schema::create('post_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->foreignId('tag_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['post_id', 'tag_id']);
        });
    }
};
```

---

## 🔗 **FASE 3: RELACIONES ELOQUENT**

### **3.1 Modelo User**

```php
<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'bio',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    // ============ RELACIONES ============
    
    /**
     * Un usuario tiene muchos posts (One-to-Many)
     */
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    
    /**
     * Un usuario tiene muchos comentarios (One-to-Many)
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    
    /**
     * Posts publicados del usuario
     */
    public function publishedPosts()
    {
        return $this->posts()->where('status', 'published');
    }
    
    // ============ SCOPES ============
    
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }
    
    // ============ ACCESSORS ============
    
    public function getAvatarUrlAttribute()
    {
        return $this->avatar 
            ? asset('storage/avatars/' . $this->avatar)
            : 'https://ui-avatars.com/api/?name=' . urlencode($this->name);
    }
}
```

### **3.2 Modelo Category**

```php
<?php
// app/Models/Category.php

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
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // ============ RELACIONES ============
    
    /**
     * Una categoría tiene muchos posts (One-to-Many)
     */
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    
    /**
     * Posts publicados de la categoría
     */
    public function publishedPosts()
    {
        return $this->posts()->where('status', 'published');
    }
    
    // ============ SCOPES ============
    
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    // ============ ACCESSORS ============
    
    public function getPostsCountAttribute()
    {
        return $this->posts()->count();
    }
}
```

### **3.3 Modelo Post (Relaciones Complejas)**

```php
<?php
// app/Models/Post.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'status',
        'published_at',
        'views_count',
        'user_id',
        'category_id',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'views_count' => 'integer',
    ];

    // ============ RELACIONES ============
    
    /**
     * Un post pertenece a un usuario (Many-to-One)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Un post pertenece a una categoría (Many-to-One)
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    
    /**
     * Un post tiene muchos comentarios (One-to-Many)
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    
    /**
     * Comentarios aprobados
     */
    public function approvedComments()
    {
        return $this->comments()->where('is_approved', true);
    }
    
    /**
     * Un post tiene muchos tags (Many-to-Many)
     */
    public function tags()
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }
    
    /**
     * Post anterior
     */
    public function previousPost()
    {
        return $this->where('published_at', '<', $this->published_at)
                   ->where('status', 'published')
                   ->orderBy('published_at', 'desc')
                   ->first();
    }
    
    /**
     * Post siguiente
     */
    public function nextPost()
    {
        return $this->where('published_at', '>', $this->published_at)
                   ->where('status', 'published')
                   ->orderBy('published_at', 'asc')
                   ->first();
    }
    
    // ============ SCOPES ============
    
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
    }
    
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
    
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }
    
    public function scopeByAuthor($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
    
    // ============ ACCESSORS ============
    
    public function getFeaturedImageUrlAttribute()
    {
        return $this->featured_image 
            ? asset('storage/posts/' . $this->featured_image)
            : null;
    }
    
    public function getCommentsCountAttribute()
    {
        return $this->comments()->count();
    }
    
    public function getReadTimeAttribute()
    {
        $wordCount = str_word_count(strip_tags($this->content));
        return ceil($wordCount / 200); // 200 words per minute
    }
}
```

### **3.4 Modelo Comment (Self-Relationship)**

```php
<?php
// app/Models/Comment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'is_approved',
        'approved_at',
        'user_id',
        'post_id',
        'parent_id',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
    ];

    // ============ RELACIONES ============
    
    /**
     * Un comentario pertenece a un usuario
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Un comentario pertenece a un post
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
    
    /**
     * Un comentario puede tener un padre (Self-Relationship)
     */
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }
    
    /**
     * Un comentario puede tener hijos (Self-Relationship)
     */
    public function children()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }
    
    /**
     * Todos los comentarios descendientes (recursivo)
     */
    public function descendants()
    {
        return $this->children()->with('descendants');
    }
    
    // ============ SCOPES ============
    
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }
    
    public function scopeParent($query)
    {
        return $query->whereNull('parent_id');
    }
    
    public function scopeReplies($query)
    {
        return $query->whereNotNull('parent_id');
    }
}
```

### **3.5 Modelo Tag**

```php
<?php
// app/Models/Tag.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
    ];

    // ============ RELACIONES ============
    
    /**
     * Un tag puede estar en muchos posts (Many-to-Many)
     */
    public function posts()
    {
        return $this->belongsToMany(Post::class)->withTimestamps();
    }
    
    /**
     * Posts publicados con este tag
     */
    public function publishedPosts()
    {
        return $this->posts()->where('status', 'published');
    }
    
    // ============ ACCESSORS ============
    
    public function getPostsCountAttribute()
    {
        return $this->posts()->count();
    }
}
```

---

## 🎮 **FASE 4: CONTROLADORES API**

### **4.1 Base Controller**

```php
<?php
// app/Http/Controllers/Api/BaseController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class BaseController extends Controller
{
    /**
     * Respuesta exitosa
     */
    protected function successResponse($data = null, string $message = 'Success', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Respuesta de error
     */
    protected function errorResponse(string $message = 'Error', int $code = 400, $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Respuesta paginada
     */
    protected function paginatedResponse($data, string $message = 'Success'): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data->items(),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
                'has_more_pages' => $data->hasMorePages(),
            ],
        ]);
    }
}
```

### **4.2 User Controller**

```php
<?php
// app/Http/Controllers/Api/UserController.php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Http\Requests\Api\StoreUserRequest;
use App\Http\Requests\Api\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Http\Resources\PostResource;
use App\Actions\User\CreateUserAction;
use App\Actions\User\UpdateUserAction;
use App\Actions\User\DeleteUserAction;

class UserController extends BaseController
{
    /**
     * Lista de usuarios
     */
    public function index()
    {
        $users = User::active()
                    ->with(['posts' => function($query) {
                        $query->published()->latest()->take(3);
                    }])
                    ->withCount(['posts', 'comments'])
                    ->paginate(15);

        return $this->paginatedResponse(
            UserResource::collection($users),
            'Users retrieved successfully'
        );
    }

    /**
     * Mostrar usuario específico
     */
    public function show(User $user)
    {
        $user->load([
            'posts' => function($query) {
                $query->published()->latest()->take(5);
            },
            'posts.category',
            'posts.tags'
        ])->loadCount(['posts', 'comments']);

        return $this->successResponse(
            new UserResource($user),
            'User retrieved successfully'
        );
    }

    /**
     * Crear usuario
     */
    public function store(StoreUserRequest $request)
    {
        $user = app(CreateUserAction::class)->execute($request->validated());

        return $this->successResponse(
            new UserResource($user),
            'User created successfully',
            201
        );
    }

    /**
     * Actualizar usuario
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user = app(UpdateUserAction::class)->execute($user, $request->validated());

        return $this->successResponse(
            new UserResource($user),
            'User updated successfully'
        );
    }

    /**
     * Eliminar usuario
     */
    public function destroy(User $user)
    {
        app(DeleteUserAction::class)->execute($user);

        return $this->successResponse(
            null,
            'User deleted successfully'
        );
    }

    /**
     * Posts del usuario
     */
    public function posts(User $user)
    {
        $posts = $user->posts()
                     ->published()
                     ->with(['category', 'tags'])
                     ->withCount(['comments', 'approvedComments'])
                     ->latest()
                     ->paginate(10);

        return $this->paginatedResponse(
            PostResource::collection($posts),
            'User posts retrieved successfully'
        );
    }
}
```

### **4.3 Post Controller (Completo)**

```php
<?php
// app/Http/Controllers/Api/PostController.php

namespace App\Http\Controllers\Api;

use App\Models\Post;
use App\Http\Requests\Api\StorePostRequest;
use App\Http\Requests\Api\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Http\Resources\CommentResource;
use App\Actions\Post\CreatePostAction;
use App\Actions\Post\UpdatePostAction;
use App\Actions\Post\DeletePostAction;
use App\Actions\Post\PublishPostAction;
use Spatie\QueryBuilder\QueryBuilder;

class PostController extends BaseController
{
    /**
     * Lista de posts con filtros avanzados
     */
    public function index()
    {
        $posts = QueryBuilder::for(Post::class)
            ->allowedFilters([
                'title',
                'status',
                'user_id',
                'category_id',
            ])
            ->allowedSorts([
                'created_at',
                'published_at',
                'views_count',
                'title'
            ])
            ->allowedIncludes([
                'user',
                'category',
                'tags',
                'comments.user'
            ])
            ->with(['user:id,name,avatar', 'category:id,name,color'])
            ->withCount(['comments', 'approvedComments'])
            ->published()
            ->latest('published_at')
            ->paginate(12);

        return $this->paginatedResponse(
            PostResource::collection($posts),
            'Posts retrieved successfully'
        );
    }

    /**
     * Mostrar post específico
     */
    public function show(Post $post)
    {
        // Incrementar vistas
        $post->increment('views_count');

        $post->load([
            'user:id,name,avatar,bio',
            'category:id,name,color',
            'tags:id,name,slug',
            'approvedComments' => function($query) {
                $query->parent()->with(['user:id,name,avatar', 'children.user:id,name,avatar'])
                      ->latest()
                      ->take(10);
            }
        ]);

        return $this->successResponse(
            new PostResource($post),
            'Post retrieved successfully'
        );
    }

    /**
     * Crear post
     */
    public function store(StorePostRequest $request)
    {
        $post = app(CreatePostAction::class)->execute(
            $request->validated(),
            $request->user()
        );

        return $this->successResponse(
            new PostResource($post->load(['user', 'category', 'tags'])),
            'Post created successfully',
            201
        );
    }

    /**
     * Actualizar post
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);

        $post = app(UpdatePostAction::class)->execute($post, $request->validated());

        return $this->successResponse(
            new PostResource($post->load(['user', 'category', 'tags'])),
            'Post updated successfully'
        );
    }

    /**
     * Eliminar post
     */
    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        app(DeletePostAction::class)->execute($post);

        return $this->successResponse(
            null,
            'Post deleted successfully'
        );
    }

    /**
     * Publicar post
     */
    public function publish(Post $post)
    {
        $this->authorize('update', $post);

        $post = app(PublishPostAction::class)->execute($post);

        return $this->successResponse(
            new PostResource($post),
            'Post published successfully'
        );
    }

    /**
     * Comentarios del post
     */
    public function comments(Post $post)
    {
        $comments = $post->approvedComments()
                        ->parent()
                        ->with(['user:id,name,avatar', 'children.user:id,name,avatar'])
                        ->latest()
                        ->paginate(20);

        return $this->paginatedResponse(
            CommentResource::collection($comments),
            'Post comments retrieved successfully'
        );
    }
}
```

---

## ⚡ **FASE 5: ACTIONS Y SERVICE CLASSES**

### **5.1 Base Action**

```php
<?php
// app/Actions/BaseAction.php

namespace App\Actions;

abstract class BaseAction
{
    /**
     * Ejecutar la acción
     */
    abstract public function execute(...$params);

    /**
     * Validar datos antes de ejecutar
     */
    protected function validate(array $data, array $rules): array
    {
        return validator($data, $rules)->validate();
    }

    /**
     * Log de actividad
     */
    protected function logActivity(string $action, $model = null, array $properties = [])
    {
        // Implementar logging según tus necesidades
        \Log::info("Action executed: {$action}", [
            'model' => $model ? get_class($model) : null,
            'model_id' => $model?->id ?? null,
            'properties' => $properties,
            'user_id' => auth()->id(),
        ]);
    }
}
```

### **5.2 User Actions**

```php
<?php
// app/Actions/User/CreateUserAction.php

namespace App\Actions\User;

use App\Models\User;
use App\Actions\BaseAction;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class CreateUserAction extends BaseAction
{
    public function execute(array $data): User
    {
        return DB::transaction(function () use ($data) {
            // Hashear password
            $data['password'] = Hash::make($data['password']);
            
            // Crear usuario
            $user = User::create($data);
            
            // Log de actividad
            $this->logActivity('user.created', $user);
            
            return $user->fresh();
        });
    }
}
```

```php
<?php
// app/Actions/User/UpdateUserAction.php

namespace App\Actions\User;

use App\Models\User;
use App\Actions\BaseAction;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UpdateUserAction extends BaseAction
{
    public function execute(User $user, array $data): User
    {
        // Hashear password si se proporciona
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        // Manejar avatar si se proporciona
        if (isset($data['avatar'])) {
            $data['avatar'] = $this->handleAvatar($user, $data['avatar']);
        }

        // Actualizar usuario
        $user->update($data);

        // Log de actividad
        $this->logActivity('user.updated', $user, $data);

        return $user->fresh();
    }

    private function handleAvatar(User $user, $avatar): string
    {
        // Eliminar avatar anterior si existe
        if ($user->avatar) {
            Storage::disk('public')->delete('avatars/' . $user->avatar);
        }

        // Guardar nuevo avatar
        $filename = uniqid() . '.' . $avatar->getClientOriginalExtension();
        $avatar->storeAs('avatars', $filename, 'public');

        return $filename;
    }
}
```

### **5.3 Post Actions**

```php
<?php
// app/Actions/Post/CreatePostAction.php

namespace App\Actions\Post;

use App\Models\Post;
use App\Models\User;
use App\Actions\BaseAction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreatePostAction extends BaseAction
{
    public function execute(array $data, User $user): Post
    {
        return DB::transaction(function () use ($data, $user) {
            // Generar slug único
            $data['slug'] = $this->generateUniqueSlug($data['title']);
            
            // Asignar usuario
            $data['user_id'] = $user->id;
            
            // Generar excerpt si no se proporciona
            if (empty($data['excerpt'])) {
                $data['excerpt'] = Str::limit(strip_tags($data['content']), 160);
            }

            // Crear post
            $post = Post::create($data);

            // Asociar tags si se proporcionan
            if (isset($data['tags'])) {
                $post->tags()->sync($data['tags']);
            }

            // Manejar imagen destacada
            if (isset($data['featured_image'])) {
                $this->handleFeaturedImage($post, $data['featured_image']);
            }

            // Log de actividad
            $this->logActivity('post.created', $post);

            return $post;
        });
    }

    private function generateUniqueSlug(string $title): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (Post::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private function handleFeaturedImage(Post $post, $image): void
    {
        $filename = $post->id . '_' . time() . '.' . $image->getClientOriginalExtension();
        $image->storeAs('posts', $filename, 'public');
        
        $post->update(['featured_image' => $filename]);
    }
}
```

```php
<?php
// app/Actions/Post/PublishPostAction.php

namespace App\Actions\Post;

use App\Models\Post;
use App\Actions\BaseAction;
use Carbon\Carbon;

class PublishPostAction extends BaseAction
{
    public function execute(Post $post): Post
    {
        // Validar que el post puede ser publicado
        $this->validatePostCanBePublished($post);

        // Actualizar estado y fecha de publicación
        $post->update([
            'status' => 'published',
            'published_at' => Carbon::now(),
        ]);

        // Log de actividad
        $this->logActivity('post.published', $post);

        // Enviar notificaciones (si aplica)
        // event(new PostPublished($post));

        return $post->fresh();
    }

    private function validatePostCanBePublished(Post $post): void
    {
        if (empty($post->title) || empty($post->content)) {
            throw new \InvalidArgumentException('Post must have title and content to be published');
        }

        if ($post->status === 'published') {
            throw new \InvalidArgumentException('Post is already published');
        }
    }
}
```

### **5.4 Comment Actions**

```php
<?php
// app/Actions/Comment/CreateCommentAction.php

namespace App\Actions\Comment;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use App\Actions\BaseAction;
use Illuminate\Support\Facades\DB;

class CreateCommentAction extends BaseAction
{
    public function execute(array $data, Post $post, User $user, ?Comment $parentComment = null): Comment
    {
        return DB::transaction(function () use ($data, $post, $user, $parentComment) {
            // Preparar datos del comentario
            $commentData = [
                'content' => $data['content'],
                'user_id' => $user->id,
                'post_id' => $post->id,
                'parent_id' => $parentComment?->id,
                'is_approved' => $this->shouldAutoApprove($user),
                'approved_at' => $this->shouldAutoApprove($user) ? now() : null,
            ];

            // Crear comentario
            $comment = Comment::create($commentData);

            // Log de actividad
            $this->logActivity('comment.created', $comment, [
                'post_id' => $post->id,
                'parent_id' => $parentComment?->id,
            ]);

            // Enviar notificaciones
            // event(new CommentCreated($comment));

            return $comment->load(['user:id,name,avatar']);
        });
    }

    private function shouldAutoApprove(User $user): bool
    {
        // Auto-aprobar comentarios de admins y editores
        return in_array($user->role, ['admin', 'editor']);
    }
}
```

---

## ✅ **FASE 6: VALIDACIONES Y FORM REQUESTS**

### **6.1 Store User Request**

```php
<?php
// app/Http/Requests/Api/StoreUserRequest.php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // O implementar lógica de autorización
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'role' => ['sometimes', 'string', 'in:admin,editor,user'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'email.required' => 'El email es obligatorio.',
            'email.unique' => 'Este email ya está registrado.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
            'avatar.image' => 'El archivo debe ser una imagen.',
            'avatar.max' => 'La imagen no puede superar los 2MB.',
        ];
    }
}
```

### **6.2 Store Post Request**

```php
<?php
// app/Http/Requests/Api/StorePostRequest.php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'category_id' => ['required', 'exists:categories,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['exists:tags,id'],
            'featured_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'status' => ['sometimes', Rule::in(['draft', 'published', 'archived'])],
            'published_at' => ['nullable', 'date', 'after_or_equal:now'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'El título es obligatorio.',
            'content.required' => 'El contenido es obligatorio.',
            'category_id.required' => 'La categoría es obligatoria.',
            'category_id.exists' => 'La categoría seleccionada no existe.',
            'tags.*.exists' => 'Uno o más tags seleccionados no existen.',
            'featured_image.image' => 'El archivo debe ser una imagen.',
            'featured_image.max' => 'La imagen no puede superar los 5MB.',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Establecer estado por defecto
        if (!$this->has('status')) {
            $this->merge(['status' => 'draft']);
        }
    }
}
```

---

## 📦 **FASE 7: API RESOURCES**

### **7.1 User Resource**

```php
<?php
// app/Http/Resources/UserResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url,
            'bio' => $this->bio,
            'role' => $this->role,
            'is_active' => $this->is_active,
            'posts_count' => $this->whenCounted('posts'),
            'comments_count' => $this->whenCounted('comments'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            
            // Relaciones
            'posts' => PostResource::collection($this->whenLoaded('posts')),
            'recent_posts' => PostResource::collection($this->whenLoaded('posts')),
        ];
    }
}
```

### **7.2 Post Resource**

```php
<?php
// app/Http/Resources/PostResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->when($request->routeIs('posts.show'), $this->content),
            'featured_image_url' => $this->featured_image_url,
            'status' => $this->status,
            'views_count' => $this->views_count,
            'read_time' => $this->read_time,
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            
            // Contadores
            'comments_count' => $this->whenCounted('comments'),
            'approved_comments_count' => $this->whenCounted('approvedComments'),
            
            // Relaciones
            'author' => new UserResource($this->whenLoaded('user')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'comments' => CommentResource::collection($this->whenLoaded('approvedComments')),
            
            // URLs de navegación (solo en vista individual)
            'previous_post' => $this->when(
                $request->routeIs('posts.show') && $this->previousPost(),
                fn() => [
                    'id' => $this->previousPost()?->id,
                    'title' => $this->previousPost()?->title,
                    'slug' => $this->previousPost()?->slug,
                ]
            ),
            'next_post' => $this->when(
                $request->routeIs('posts.show') && $this->nextPost(),
                fn() => [
                    'id' => $this->nextPost()?->id,
                    'title' => $this->nextPost()?->title,
                    'slug' => $this->nextPost()?->slug,
                ]
            ),
        ];
    }
}
```

### **7.3 Comment Resource (Jerárquico)**

```php
<?php
// app/Http/Resources/CommentResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'is_approved' => $this->is_approved,
            'approved_at' => $this->approved_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            
            // Relaciones
            'author' => new UserResource($this->whenLoaded('user')),
            'post' => new PostResource($this->whenLoaded('post')),
            'parent' => new CommentResource($this->whenLoaded('parent')),
            'replies' => CommentResource::collection($this->whenLoaded('children')),
            'replies_count' => $this->children()->count(),
            
            // Información de jerarquía
            'is_reply' => !is_null($this->parent_id),
            'level' => $this->calculateLevel(),
        ];
    }

    private function calculateLevel(): int
    {
        $level = 0;
        $comment = $this;
        
        while ($comment->parent_id) {
            $level++;
            $comment = $comment->parent;
            
            // Evitar bucles infinitos
            if ($level > 10) break;
        }
        
        return $level;
    }
}
```

---

## 🔐 **FASE 8: MIDDLEWARES Y AUTENTICACIÓN**

### **8.1 Auth Controller**

```php
<?php
// app/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Actions\User\CreateUserAction;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends BaseController
{
    /**
     * Registro de usuario
     */
    public function register(RegisterRequest $request)
    {
        $user = app(CreateUserAction::class)->execute($request->validated());
        
        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->successResponse([
            'user' => new UserResource($user),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'User registered successfully', 201);
    }

    /**
     * Login de usuario
     */
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        if (!$user->is_active) {
            return $this->errorResponse('Tu cuenta está desactivada.', 403);
        }

        // Revocar tokens anteriores (opcional)
        $user->tokens()->delete();

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->successResponse([
            'user' => new UserResource($user),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'Login successful');
    }

    /**
     * Logout de usuario
     */
    public function logout()
    {
        auth()->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Logout successful');
    }

    /**
     * Perfil del usuario autenticado
     */
    public function profile()
    {
        $user = auth()->user()->load(['posts' => function($query) {
            $query->latest()->take(5);
        }])->loadCount(['posts', 'comments']);

        return $this->successResponse(
            new UserResource($user),
            'Profile retrieved successfully'
        );
    }
}
```

### **8.2 Policy para Posts**

```php
<?php
// app/Policies/PostPolicy.php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /**
     * Ver cualquier post
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Ver post específico
     */
    public function view(?User $user, Post $post): bool
    {
        // Si está publicado, cualquiera puede verlo
        if ($post->status === 'published') {
            return true;
        }

        // Si no está publicado, solo el autor o admin
        return $user && ($post->user_id === $user->id || $user->role === 'admin');
    }

    /**
     * Crear post
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'editor']);
    }

    /**
     * Actualizar post
     */
    public function update(User $user, Post $post): bool
    {
        return $post->user_id === $user->id || $user->role === 'admin';
    }

    /**
     * Eliminar post
     */
    public function delete(User $user, Post $post): bool
    {
        return $post->user_id === $user->id || $user->role === 'admin';
    }

    /**
     * Publicar post
     */
    public function publish(User $user, Post $post): bool
    {
        return $this->update($user, $post);
    }
}
```

---

## 🎯 **FASE 9: EJEMPLO PRÁCTICO COMPLETO**

### **9.1 Caso de Uso: Blog con Comentarios Anidados**

Vamos a crear un endpoint completo que muestre un post con todos sus comentarios anidados:

```php
<?php
// app/Http/Controllers/Api/PostDetailController.php

namespace App\Http\Controllers\Api;

use App\Models\Post;
use App\Http\Resources\PostDetailResource;

class PostDetailController extends BaseController
{
    public function show(string $slug)
    {
        $post = Post::where('slug', $slug)
                   ->published()
                   ->with([
                       'user:id,name,avatar,bio',
                       'category:id,name,color,slug',
                       'tags:id,name,slug',
                       'approvedComments' => function($query) {
                           $query->parent()
                                 ->with([
                                     'user:id,name,avatar',
                                     'children' => function($childQuery) {
                                         $childQuery->with([
                                             'user:id,name,avatar',
                                             'children.user:id,name,avatar'
                                         ]);
                                     }
                                 ])
                                 ->latest();
                       }
                   ])
                   ->firstOrFail();

        // Incrementar vistas
        $post->increment('views_count');

        // Cargar posts relacionados
        $relatedPosts = Post::published()
                          ->where('category_id', $post->category_id)
                          ->where('id', '!=', $post->id)
                          ->with(['user:id,name', 'category:id,name'])
                          ->withCount('approvedComments')
                          ->latest('published_at')
                          ->take(4)
                          ->get();

        return $this->successResponse([
            'post' => new PostDetailResource($post),
            'related_posts' => PostResource::collection($relatedPosts),
            'navigation' => [
                'previous' => $post->previousPost() ? [
                    'title' => $post->previousPost()->title,
                    'slug' => $post->previousPost()->slug,
                ] : null,
                'next' => $post->nextPost() ? [
                    'title' => $post->nextPost()->title,
                    'slug' => $post->nextPost()->slug,
                ] : null,
            ]
        ], 'Post retrieved successfully');
    }
}
```

### **9.2 Resource Específico para Post Detail**

```php
<?php
// app/Http/Resources/PostDetailResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'featured_image_url' => $this->featured_image_url,
            'status' => $this->status,
            'views_count' => $this->views_count,
            'read_time' => $this->read_time . ' min read',
            'published_at' => $this->published_at?->format('M d, Y'),
            'published_at_human' => $this->published_at?->diffForHumans(),
            
            // Autor completo
            'author' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar_url' => $this->user->avatar_url,
                'bio' => $this->user->bio,
                'posts_count' => $this->user->posts()->published()->count(),
            ],
            
            // Categoría
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
                'color' => $this->category->color,
                'posts_count' => $this->category->publishedPosts()->count(),
            ],
            
            // Tags
            'tags' => $this->tags->map(function($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'slug' => $tag->slug,
                    'posts_count' => $tag->publishedPosts()->count(),
                ];
            }),
            
            // Comentarios anidados
            'comments' => $this->buildCommentsTree($this->approvedComments),
            'comments_count' => $this->approvedComments()->count(),
            
            // Metadatos SEO
            'seo' => [
                'title' => $this->title,
                'description' => $this->excerpt ?: strip_tags(substr($this->content, 0, 160)),
                'keywords' => $this->tags->pluck('name')->join(', '),
                'canonical_url' => route('posts.show', $this->slug),
                'og_image' => $this->featured_image_url,
            ],
        ];
    }

    private function buildCommentsTree($comments)
    {
        return $comments->map(function($comment) {
            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at->format('M d, Y'),
                'created_at_human' => $comment->created_at->diffForHumans(),
                'author' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->name,
                    'avatar_url' => $comment->user->avatar_url,
                ],
                'replies' => $this->buildRepliesTree($comment->children),
                'replies_count' => $comment->children->count(),
            ];
        });
    }

    private function buildRepliesTree($replies, $level = 1)
    {
        if ($level > 3) return []; // Limitar niveles de anidación

        return $replies->map(function($reply) use ($level) {
            return [
                'id' => $reply->id,
                'content' => $reply->content,
                'created_at' => $reply->created_at->format('M d, Y'),
                'created_at_human' => $reply->created_at->diffForHumans(),
                'level' => $level,
                'author' => [
                    'id' => $reply->user->id,
                    'name' => $reply->user->name,
                    'avatar_url' => $reply->user->avatar_url,
                ],
                'replies' => $this->buildRepliesTree($reply->children, $level + 1),
            ];
        });
    }
}
```

---

## 🚀 **MEJORES PRÁCTICAS Y TIPS AVANZADOS**

### **10.1 Optimización de Consultas**

```php
// ❌ N+1 Problem
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->user->name; // Nueva consulta por cada post
}

// ✅ Eager Loading
$posts = Post::with('user')->get();
foreach ($posts as $post) {
    echo $post->user->name; // Sin consultas adicionales
}

// ✅ Conditional Eager Loading
$posts = Post::with(['user', 'category'])
            ->when($includeComments, function($query) {
                $query->with('approvedComments.user');
            })
            ->get();
```

### **10.2 Scopes Reutilizables**

```php
// En el modelo Post
public function scopeWithBasicRelations($query)
{
    return $query->with([
        'user:id,name,avatar',
        'category:id,name,color',
    ])->withCount(['comments', 'approvedComments']);
}

// Uso en controlador
$posts = Post::published()
            ->withBasicRelations()
            ->latest()
            ->paginate(12);
```

### **10.3 Actions Reutilizables**

```php
// app/Actions/Post/UpdatePostStatusAction.php
class UpdatePostStatusAction extends BaseAction
{
    public function execute(Post $post, string $status, ?Carbon $publishedAt = null): Post
    {
        $data = ['status' => $status];
        
        if ($status === 'published' && !$post->published_at) {
            $data['published_at'] = $publishedAt ?: now();
        }
        
        $post->update($data);
        
        $this->logActivity("post.status_changed_to_{$status}", $post);
        
        return $post->fresh();
    }
}
```

### **10.4 Middleware de Rate Limiting**

```php
// En RouteServiceProvider o en routes/api.php
Route::middleware(['throttle:api'])->group(function () {
    Route::apiResource('posts', PostController::class);
});

// Configuración personalizada en app/Http/Kernel.php
'api' => [
    'throttle:60,1',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

---

## 🎓 **CRONOGRAMA DE IMPLEMENTACIÓN**

### **Semana 1: Base y Configuración**
- Configuración inicial de Laravel
- Migraciones y modelos básicos
- Relaciones simples (One-to-Many)

### **Semana 2: API Structure**
- Controladores base
- Form Requests y validaciones
- API Resources básicos

### **Semana 3: Relaciones Avanzadas**
- Many-to-Many (Post-Tags)
- Self-relationships (Comments)
- Polimórficas (si aplica)

### **Semana 4: Actions y Optimización**
- Service classes y Actions
- Policies y autenticación
- Optimización de consultas

---

## 🏆 **CHECKLIST FINAL**

### ✅ **Funcionalidades Core**
- [ ] CRUD completo para todas las entidades
- [ ] Autenticación con Sanctum
- [ ] Validaciones robustas
- [ ] Responses consistentes
- [ ] Manejo de errores

### ✅ **Relaciones Implementadas**
- [ ] One-to-Many (User-Posts, Post-Comments)
- [ ] Many-to-Many (Post-Tags)
- [ ] Self-Relationship (Comment-Replies)
- [ ] Eager Loading optimizado

### ✅ **Arquitectura**
- [ ] Actions para lógica de negocio
- [ ] Policies para autorización
- [ ] Resources para transformación
- [ ] Middlewares de seguridad

### ✅ **Performance**
- [ ] Índices en migraciones
- [ ] Consultas optimizadas
- [ ] Paginación implementada
- [ ] Rate limiting configurado

---

¡Felicitaciones! Has completado la masterclass de APIs con Laravel y Eloquent. Con esta base sólida podrás crear APIs profesionales y escalables. 

**Próximos pasos recomendados:**
1. Implementar caching con Redis
2. Agregar testing automatizado
3. Documentación con OpenAPI/Swagger
4. Deploy con Docker y CI/CD