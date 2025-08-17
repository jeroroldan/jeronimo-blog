---
title: 'Laravel Framework Completo'
code: 'laravel'
description: 'Masterclass: Laravel Framework Completo'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


# Masterclass: Laravel Framework Completo

## Introducción

Laravel es el framework PHP más popular para desarrollo web, conocido por su sintaxis elegante y herramientas poderosas. Esta guía cubre desde conceptos básicos hasta características avanzadas con ejemplos prácticos.

## 1. Instalación y Configuración

### Requisitos del Sistema
- PHP >= 8.1
- Composer
- Node.js y NPM
- Base de datos (MySQL, PostgreSQL, SQLite)

### Instalación
```bash
# Instalar Laravel vía Composer
composer global require laravel/installer

# Crear nuevo proyecto
laravel new mi-proyecto
# O usar Composer directamente
composer create-project laravel/laravel mi-proyecto

# Navegar al proyecto
cd mi-proyecto

# Configurar permisos (Linux/Mac)
chmod -R 775 storage bootstrap/cache

# Copiar archivo de entorno
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Iniciar servidor de desarrollo
php artisan serve
```

### Configuración del Entorno (.env)
```env
APP_NAME=MiAplicacion
APP_ENV=local
APP_KEY=base64:generated_key_here
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mi_base_datos
DB_USERNAME=usuario
DB_PASSWORD=contraseña

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DRIVER=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=null
MAIL_FROM_NAME="${APP_NAME}"
```

## 2. Routing (Enrutamiento)

### Rutas Básicas
```php
<?php
// routes/web.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;

// Ruta simple
Route::get('/', function () {
    return view('welcome');
});

// Ruta con parámetros
Route::get('/usuario/{id}', function ($id) {
    return "Usuario ID: " . $id;
});

// Ruta con parámetros opcionales
Route::get('/posts/{id?}', function ($id = null) {
    if ($id) {
        return "Post ID: " . $id;
    }
    return "Todos los posts";
});

// Ruta con restricciones
Route::get('/usuario/{id}', function ($id) {
    return "Usuario: " . $id;
})->where('id', '[0-9]+');

// Rutas con nombres
Route::get('/perfil', function () {
    return view('perfil');
})->name('usuario.perfil');

// Grupos de rutas
Route::prefix('admin')->group(function () {
    Route::get('/usuarios', [UserController::class, 'index']);
    Route::get('/productos', [ProductController::class, 'index']);
});

// Rutas con middleware
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [HomeController::class, 'dashboard']);
    Route::resource('productos', ProductController::class);
});

// Rutas API
Route::prefix('api')->group(function () {
    Route::get('/usuarios', [UserController::class, 'apiIndex']);
    Route::post('/usuarios', [UserController::class, 'store']);
    Route::put('/usuarios/{id}', [UserController::class, 'update']);
    Route::delete('/usuarios/{id}', [UserController::class, 'destroy']);
});

// Resource routes (CRUD completo)
Route::resource('productos', ProductController::class);
// Genera automáticamente:
// GET /productos (index)
// GET /productos/create (create)
// POST /productos (store)
// GET /productos/{id} (show)
// GET /productos/{id}/edit (edit)
// PUT/PATCH /productos/{id} (update)
// DELETE /productos/{id} (destroy)

// API Resource routes
Route::apiResource('usuarios', UserController::class);
// Genera las mismas rutas pero sin create y edit
```

### Rutas Avanzadas
```php
<?php
// routes/web.php

// Subdominios
Route::domain('{cuenta}.miapp.com')->group(function () {
    Route::get('/', function ($cuenta) {
        return "Cuenta: " . $cuenta;
    });
});

// Rutas con cache
Route::get('/usuarios', [UserController::class, 'index'])
    ->middleware('cache.headers:public;max_age=3600');

// Fallback route (404 personalizado)
Route::fallback(function () {
    return response()->view('errors.404', [], 404);
});

// Redirecciones
Route::redirect('/old-url', '/new-url', 301);

// Vista directa sin controlador
Route::view('/terminos', 'legal.terminos');
```

## 3. Controllers (Controladores)

### Controlador Básico
```php
<?php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Mostrar lista de usuarios
     */
    public function index(Request $request)
    {
        $query = User::query();
        
        // Filtros
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
        }
        
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        // Paginación
        $usuarios = $query->orderBy('created_at', 'desc')
                         ->paginate(15);
        
        return view('usuarios.index', compact('usuarios'));
    }
    
    /**
     * Mostrar formulario de creación
     */
    public function create()
    {
        return view('usuarios.create');
    }
    
    /**
     * Almacenar nuevo usuario
     */
    public function store(Request $request)
    {
        // Validación
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()
                           ->withErrors($validator)
                           ->withInput();
        }
        
        // Procesar avatar
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }
        
        // Crear usuario
        $usuario = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'avatar' => $avatarPath,
            'status' => 'active'
        ]);
        
        // Mensaje de éxito
        return redirect()->route('usuarios.index')
                        ->with('success', 'Usuario creado exitosamente');
    }
    
    /**
     * Mostrar usuario específico
     */
    public function show(User $usuario)
    {
        // Model binding automático
        $usuario->load(['posts', 'comments']); // Eager loading
        
        return view('usuarios.show', compact('usuario'));
    }
    
    /**
     * Mostrar formulario de edición
     */
    public function edit(User $usuario)
    {
        return view('usuarios.edit', compact('usuario'));
    }
    
    /**
     * Actualizar usuario
     */
    public function update(Request $request, User $usuario)
    {
        // Validación con regla única excluyendo el usuario actual
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $usuario->id,
            'phone' => 'nullable|string|max:20',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);
        
        // Actualizar datos
        $data = $request->only(['name', 'email', 'phone']);
        
        // Actualizar avatar si se proporciona
        if ($request->hasFile('avatar')) {
            // Eliminar avatar anterior
            if ($usuario->avatar) {
                Storage::disk('public')->delete($usuario->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }
        
        $usuario->update($data);
        
        return redirect()->route('usuarios.show', $usuario)
                        ->with('success', 'Usuario actualizado exitosamente');
    }
    
    /**
     * Eliminar usuario
     */
    public function destroy(User $usuario)
    {
        // Verificar permisos
        if (auth()->user()->cannot('delete', $usuario)) {
            abort(403, 'No tienes permisos para eliminar este usuario');
        }
        
        // Eliminar avatar
        if ($usuario->avatar) {
            Storage::disk('public')->delete($usuario->avatar);
        }
        
        $usuario->delete();
        
        return redirect()->route('usuarios.index')
                        ->with('success', 'Usuario eliminado exitosamente');
    }
    
    /**
     * API: Lista de usuarios en JSON
     */
    public function apiIndex(Request $request)
    {
        $usuarios = User::when($request->search, function ($query, $search) {
                        return $query->where('name', 'like', "%{$search}%");
                    })
                    ->paginate(10);
        
        return response()->json([
            'status' => 'success',
            'data' => $usuarios
        ]);
    }
}
```

### Controlador de Recursos con Middleware
```php
<?php
// app/Http/Controllers/ProductController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Requests\ProductRequest;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Constructor con middleware
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('admin')->only(['create', 'store', 'edit', 'update', 'destroy']);
        $this->middleware('throttle:60,1')->only(['store', 'update']);
    }
    
    /**
     * Mostrar productos con filtros y búsqueda
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'user']);
        
        // Aplicar filtros
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }
        
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }
        
        // Ordenamiento
        $sortBy = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortBy, $sortDirection);
        
        $productos = $query->paginate(12)->appends($request->query());
        
        return view('productos.index', compact('productos'));
    }
    
    /**
     * Crear producto usando Form Request
     */
    public function store(ProductRequest $request)
    {
        // Los datos ya están validados por ProductRequest
        $data = $request->validated();
        
        // Procesar imágenes
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('products', 'public');
            }
            $data['images'] = json_encode($imagePaths);
        }
        
        // Crear producto
        $producto = auth()->user()->products()->create($data);
        
        return redirect()->route('productos.show', $producto)
                        ->with('success', 'Producto creado exitosamente');
    }
}
```

## 4. Models y Eloquent ORM

### Modelo Básico
```php
<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * Campos asignables en masa
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar',
        'birth_date',
        'settings',
        'status'
    ];

    /**
     * Campos ocultos en serialización
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Casting de atributos
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'birth_date' => 'date',
        'settings' => 'array',
        'is_admin' => 'boolean',
    ];

    /**
     * Dates para soft deletes
     */
    protected $dates = ['deleted_at'];

    /**
     * Relaciones
     */
    
    // Uno a muchos
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    
    // Uno a muchos
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    
    // Uno a uno
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
    
    // Muchos a muchos
    public function roles()
    {
        return $this->belongsToMany(Role::class)
                    ->withPivot(['assigned_at', 'assigned_by'])
                    ->withTimestamps();
    }
    
    // Muchos a muchos con tabla pivote personalizada
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'user_permissions')
                    ->withPivot(['granted_at', 'expires_at']);
    }
    
    /**
     * Scopes
     */
    
    // Scope local
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
    
    // Scope con parámetros
    public function scopeByRole($query, $role)
    {
        return $query->whereHas('roles', function ($q) use ($role) {
            $q->where('name', $role);
        });
    }
    
    // Scope de búsqueda
    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('email', 'like', "%{$term}%");
        });
    }
    
    /**
     * Accessors y Mutators (Laravel 9+)
     */
    
    // Accessor para nombre completo
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => $attributes['first_name'] . ' ' . $attributes['last_name']
        );
    }
    
    // Mutator para password
    protected function password(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => bcrypt($value)
        );
    }
    
    // Accessor para avatar URL
    protected function avatarUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->avatar 
                ? Storage::disk('public')->url($this->avatar)
                : asset('images/default-avatar.png')
        );
    }
    
    /**
     * Métodos personalizados
     */
    
    public function isAdmin()
    {
        return $this->roles()->where('name', 'admin')->exists();
    }
    
    public function hasPermission($permission)
    {
        return $this->permissions()
                    ->where('name', $permission)
                    ->where(function ($query) {
                        $query->whereNull('expires_at')
                              ->orWhere('expires_at', '>', now());
                    })
                    ->exists();
    }
    
    public function getActivePostsCount()
    {
        return $this->posts()->where('status', 'published')->count();
    }
    
    /**
     * Boot method para eventos del modelo
     */
    protected static function boot()
    {
        parent::boot();
        
        // Evento al crear
        static::creating(function ($user) {
            if (empty($user->uuid)) {
                $user->uuid = (string) Str::uuid();
            }
        });
        
        // Evento al eliminar
        static::deleting(function ($user) {
            // Eliminar posts relacionados
            $user->posts()->delete();
            
            // Eliminar avatar
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
        });
    }
}
```

### Modelo Complejo con Relaciones
```php
<?php
// app/Models/Post.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

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
        'meta_description',
        'meta_keywords'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'meta_keywords' => 'array'
    ];

    /**
     * Relaciones
     */
    
    // Pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    // Pertenece a una categoría
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    
    // Tiene muchos comentarios
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    
    // Comentarios aprobados
    public function approvedComments()
    {
        return $this->hasMany(Comment::class)->where('status', 'approved');
    }
    
    // Muchos a muchos con tags
    public function tags()
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }
    
    // Relación polimórfica para likes
    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }
    
    // Relación polimórfica para imágenes
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
    
    /**
     * Scopes
     */
    
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->where('published_at', '<=', now());
    }
    
    public function scopeByCategory($query, $categorySlug)
    {
        return $query->whereHas('category', function ($q) use ($categorySlug) {
            $q->where('slug', $categorySlug);
        });
    }
    
    public function scopePopular($query, $days = 30)
    {
        return $query->withCount(['likes', 'comments'])
                    ->where('created_at', '>=', now()->subDays($days))
                    ->orderByDesc('likes_count')
                    ->orderByDesc('comments_count');
    }
    
    /**
     * Accessors
     */
    
    protected function readingTime(): Attribute
    {
        return Attribute::make(
            get: function () {
                $wordCount = str_word_count(strip_tags($this->content));
                $minutes = ceil($wordCount / 200); // 200 palabras por minuto
                return $minutes . ' min de lectura';
            }
        );
    }
    
    protected function featuredImageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->featured_image 
                ? Storage::disk('public')->url($this->featured_image)
                : asset('images/default-post.jpg')
        );
    }
    
    /**
     * Mutators
     */
    
    protected function title(): Attribute
    {
        return Attribute::make(
            set: function ($value) {
                $this->attributes['slug'] = Str::slug($value);
                return $value;
            }
        );
    }
    
    /**
     * Métodos personalizados
     */
    
    public function isLikedBy(User $user)
    {
        return $this->likes()->where('user_id', $user->id)->exists();
    }
    
    public function getNextPost()
    {
        return static::published()
                    ->where('id', '>', $this->id)
                    ->orderBy('id')
                    ->first();
    }
    
    public function getPreviousPost()
    {
        return static::published()
                    ->where('id', '<', $this->id)
                    ->orderByDesc('id')
                    ->first();
    }
    
    public function getRelatedPosts($limit = 3)
    {
        return static::published()
                    ->where('id', '!=', $this->id)
                    ->where('category_id', $this->category_id)
                    ->inRandomOrder()
                    ->limit($limit)
                    ->get();
    }
}
```

## 5. Migrations y Schema Builder

### Migración Básica
```php
<?php
// database/migrations/2024_01_01_000000_create_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone', 20)->nullable();
            $table->string('avatar')->nullable();
            $table->date('birth_date')->nullable();
            $table->json('settings')->nullable();
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->boolean('is_admin')->default(false);
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['status', 'created_at']);
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

### Migración Compleja con Relaciones
```php
<?php
// database/migrations/2024_01_02_000000_create_posts_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('color', 7)->default('#000000');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
        
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('featured_image')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->text('meta_description')->nullable();
            $table->json('meta_keywords')->nullable();
            $table->integer('views_count')->default(0);
            
            // Claves foráneas
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('restrict');
            
            $table->timestamps();
            $table->softDeletes();
            
            // Índices compuestos
            $table->index(['status', 'published_at']);
            $table->index(['user_id', 'status']);
            $table->fullText(['title', 'content']); // Búsqueda de texto completo
        });
        
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('color', 7)->default('#000000');
            $table->timestamps();
        });
        
        // Tabla pivot para posts y tags
        Schema::create('post_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->foreignId('tag_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['post_id', 'tag_id']);
        });
        
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            
            // Claves foráneas
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade');
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['post_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
        Schema::dropIfExists('post_tag');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('categories');
    }
};
```

### Modificar Tablas Existentes
```php
<?php
// database/migrations/2024_01_03_000000_add_fields_to_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Agregar nuevas columnas
            $table->string('timezone', 50)->default('UTC')->after('settings');
            $table->timestamp('last_login_at')->nullable()->after('timezone');
            $table->json('preferences')->nullable()->after('last_login_at');
            
            // Modificar columnas existentes
            $table->string('phone', 25)->nullable()->change();
            
            // Agregar índices
            $table->index('last_login_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['timezone', 'last_login_at', 'preferences']);
            $table->dropIndex(['last_login_at']);
        });
    }
};
```

## 6. Seeders y Factories

### Factory para Datos de Prueba
```php
<?php
// database/factories/UserFactory.php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'phone' => fake()->phoneNumber(),
            'birth_date' => fake()->dateTimeBetween('-50 years', '-18 years')->format('Y-m-d'),
            'settings' => [
                'notifications' => fake()->boolean(),
                'theme' => fake()->randomElement(['light', 'dark']),
                'language' => fake()->randomElement(['es', 'en'])
            ],
            'status' => fake()->randomElement(['active', 'inactive']),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Estado para usuarios administradores
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);
    }

    /**
     * Estado para usuarios no verificados
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
```

### Factory para Posts
```php
<?php
// database/factories/PostFactory.php

namespace Database\Factories;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence(6, true);
        
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'excerpt' => fake()->paragraph(2),
            'content' => fake()->paragraphs(8, true),
            'status' => fake()->randomElement(['draft', 'published', 'archived']),
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'meta_description' => fake()->sentence(15),
            'meta_keywords' => fake()->words(5),
            'views_count' => fake()->numberBetween(0, 1000),
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
        ];
    }

    /**
     * Estado para posts publicados
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ]);
    }

    /**
     * Estado para posts populares
     */
    public function popular(): static
    {
        return $this->state(fn (array $attributes) => [
            'views_count' => fake()->numberBetween(500, 5000),
            'status' => 'published',
        ]);
    }
}
```

### Seeders
```php
<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            TagSeeder::class,
            PostSeeder::class,
            CommentSeeder::class,
        ]);
    }
}
```

```php
<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Usuario administrador
        $admin = User::create([
            'name' => 'Administrador',
            'email' => 'admin@miapp.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'is_admin' => true,
            'status' => 'active',
        ]);

        // Usuario de prueba
        $user = User::create([
            'name' => 'Usuario Test',
            'email' => 'user@miapp.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'status' => 'active',
        ]);

        // Usuarios aleatorios
        User::factory(50)->create();
        
        // Asignar roles
        $adminRole = Role::where('name', 'admin')->first();
        $userRole = Role::where('name', 'user')->first();
        
        $admin->roles()->attach($adminRole);
        $user->roles()->attach($userRole);
    }
}
```

```php
<?php
// database/seeders/PostSeeder.php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $categories = Category::all();
        $tags = Tag::all();

        // Posts publicados
        Post::factory(30)
            ->published()
            ->create()
            ->each(function ($post) use ($tags) {
                // Asignar tags aleatorios
                $post->tags()->attach(
                    $tags->random(rand(1, 4))->pluck('id')->toArray()
                );
            });

        // Posts borrador
        Post::factory(10)->create([
            'status' => 'draft',
            'published_at' => null,
        ]);

        // Posts populares
        Post::factory(5)
            ->popular()
            ->create()
            ->each(function ($post) use ($tags) {
                $post->tags()->attach(
                    $tags->random(rand(2, 5))->pluck('id')->toArray()
                );
            });
    }
}
```

## 7. Validación y Form Requests

### Form Request Personalizado
```php
<?php
// app/Http/Requests/ProductRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    /**
     * Determinar si el usuario está autorizado
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Reglas de validación
     */
    public function rules(): array
    {
        $productId = $this->route('product') ? $this->route('product')->id : null;
        
        return [
            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
                Rule::unique('products')->ignore($productId)
            ],
            'description' => 'required|string|min:10',
            'price' => 'required|numeric|min:0.01|max:999999.99',
            'category_id' => 'required|exists:categories,id',
            'stock' => 'required|integer|min:0',
            'sku' => [
                'required',
                'string',
                'max:50',
                Rule::unique('products')->ignore($productId)
            ],
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'specifications' => 'nullable|array',
            'specifications.*.name' => 'required_with:specifications|string|max:100',
            'specifications.*.value' => 'required_with:specifications|string|max:255',
            'is_featured' => 'boolean',
            'status' => 'required|in:active,inactive,out_of_stock',
            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
        ];
    }

    /**
     * Mensajes de error personalizados
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del producto es obligatorio.',
            'name.unique' => 'Ya existe un producto con este nombre.',
            'price.required' => 'El precio es obligatorio.',
            'price.numeric' => 'El precio debe ser un número válido.',
            'price.min' => 'El precio debe ser mayor a 0.',
            'category_id.required' => 'Debe seleccionar una categoría.',
            'category_id.exists' => 'La categoría seleccionada no es válida.',
            'images.*.image' => 'Solo se permiten archivos de imagen.',
            'images.*.max' => 'Cada imagen no debe superar los 2MB.',
            'sku.unique' => 'Este SKU ya está en uso.',
        ];
    }

    /**
     * Nombres de atributos personalizados
     */
    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'description' => 'descripción',
            'price' => 'precio',
            'category_id' => 'categoría',
            'stock' => 'inventario',
            'images.*' => 'imagen',
        ];
    }

    /**
     * Preparar datos para validación
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->name),
            'is_featured' => $this->boolean('is_featured'),
        ]);
    }

    /**
     * Configurar validador después de creación
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validación personalizada
            if ($this->stock == 0 && $this->status === 'active') {
                $validator->errors()->add(
                    'status', 
                    'No se puede activar un producto sin stock.'
                );
            }
            
            // Validar que el precio no sea muy bajo para productos premium
            if ($this->category_id && $this->isPremiumCategory() && $this->price < 100) {
                $validator->errors()->add(
                    'price',
                    'Los productos premium deben tener un precio mínimo de $100.'
                );
            }
        });
    }

    /**
     * Método auxiliar
     */
    private function isPremiumCategory(): bool
    {
        $premiumCategories = [1, 2, 3]; // IDs de categorías premium
        return in_array($this->category_id, $premiumCategories);
    }
}
```

### Validaciones Manuales en Controladores
```php
<?php
// En un controlador

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function updateProfile(Request $request)
    {
        // Validación manual básica
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore(auth()->id())
            ],
            'bio' => 'nullable|string|max:500',
            'avatar' => 'nullable|image|max:1024',
        ]);

        // Validación condicional
        $validator->sometimes('password', 'required|min:8|confirmed', function ($input) {
            return !empty($input->password);
        });

        // Reglas personalizadas
        $validator->addRules([
            'username' => [
                'required',
                'string',
                'min:3',
                'max:20',
                'regex:/^[a-zA-Z0-9_]+$/',
                Rule::unique('users')->ignore(auth()->id()),
                function ($attribute, $value, $fail) {
                    if (in_array(strtolower($value), ['admin', 'root', 'system'])) {
                        $fail('El nombre de usuario no está permitido.');
                    }
                },
            ],
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                           ->withErrors($validator)
                           ->withInput();
        }

        $validated = $validator->validated();
        
        // Procesar datos...
    }
}
```

## 8. Middleware

### Middleware Personalizado
```php
<?php
// app/Http/Middleware/CheckUserRole.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();
        
        // Verificar si el usuario tiene alguno de los roles requeridos
        $hasRole = $user->roles()->whereIn('name', $roles)->exists();
        
        if (!$hasRole) {
            abort(403, 'No tienes permisos para acceder a esta página.');
        }

        return $next($request);
    }
}
```

```php
<?php
// app/Http/Middleware/LogRequests.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogRequests
{
    public function handle(Request $request, Closure $next)
    {
        // Antes de la request
        $startTime = microtime(true);
        
        Log::info('Request iniciada', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => auth()->id(),
        ]);

        $response = $next($request);

        // Después de la request
        $endTime = microtime(true);
        $executionTime = ($endTime - $startTime) * 1000; // En milisegundos

        Log::info('Request completada', [
            'url' => $request->fullUrl(),
            'status_code' => $response->getStatusCode(),
            'execution_time' => round($executionTime, 2) . 'ms',
        ]);

        return $response;
    }
}
```

```php
<?php
// app/Http/Middleware/ApiRateLimit.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;

class ApiRateLimit
{
    public function handle(Request $request, Closure $next, $maxAttempts = 60, $decayMinutes = 1)
    {
        $key = $this->resolveRequestSignature($request);
        
        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $seconds = RateLimiter::availableIn($key);
            
            return response()->json([
                'error' => 'Demasiadas peticiones.',
                'retry_after' => $seconds
            ], 429)->header('Retry-After', $seconds);
        }
        
        RateLimiter::hit($key, $decayMinutes * 60);
        
        $response = $next($request);
        
        return $response->withHeaders([
            'X-RateLimit-Limit' => $maxAttempts,
            'X-RateLimit-Remaining' => RateLimiter::remaining($key, $maxAttempts),
        ]);
    }
    
    protected function resolveRequestSignature(Request $request)
    {
        if ($user = $request->user()) {
            return sha1('api_rate_limit:' . $user->id);
        }
        
        return sha1('api_rate_limit:' . $request->ip());
    }
}
```

### Registrar Middleware
```php
<?php
// app/Http/Kernel.php

protected $middlewareAliases = [
    'auth' => \App\Http\Middleware\Authenticate::class,
    'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
    'role' => \App\Http\Middleware\CheckUserRole::class,
    'log.requests' => \App\Http\Middleware\LogRequests::class,
    'api.rate' => \App\Http\Middleware\ApiRateLimit::class,
    // ... otros middleware
];

// Middleware global
protected $middleware = [
    \App\Http\Middleware\LogRequests::class,
    // ... otros middleware globales
];

// Middleware para grupos web
protected $middlewareGroups = [
    'web' => [
        \App\Http\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \App\Http\Middleware\VerifyCsrfToken::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],

    'api' => [
        \App\Http\Middleware\ApiRateLimit::class . ':120,1',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

## 9. Blade Templates

### Layout Principal
```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>@yield('title', 'Mi Aplicación')</title>
    
    <!-- Meta tags dinámicos -->
    @hasSection('meta_description')
        <meta name="description" content="@yield('meta_description')">
    @endif
    
    @hasSection('meta_keywords')
        <meta name="keywords" content="@yield('meta_keywords')">
    @endif
    
    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    @stack('styles')
    
    <!-- Scripts head -->
    @stack('head_scripts')
</head>
<body class="@yield('body_class')">
    <!-- Header -->
    @include('partials.header')
    
    <!-- Navigation -->
    @include('partials.navigation')
    
    <!-- Breadcrumbs -->
    @hasSection('breadcrumbs')
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                @yield('breadcrumbs')
            </ol>
        </nav>
    @endif
    
    <!-- Flash Messages -->
    @include('partials.flash-messages')
    
    <!-- Main Content -->
    <main class="main-content">
        @yield('content')
    </main>
    
    <!-- Sidebar -->
    @hasSection('sidebar')
        <aside class="sidebar">
            @yield('sidebar')
        </aside>
    @endif
    
    <!-- Footer -->
    @include('partials.footer')
    
    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}"></script>
    @stack('scripts')
</body>
</html>
```

### Componentes Blade
```blade
{{-- resources/views/components/alert.blade.php --}}
@props([
    'type' => 'info',
    'dismissible' => true,
    'icon' => null
])

@php
$classes = [
    'alert',
    'alert-' . $type,
    'dismissible' ? 'alert-dismissible' : ''
];

$icons = [
    'success' => 'check-circle',
    'error' => 'exclamation-triangle',
    'warning' => 'exclamation-circle',
    'info' => 'info-circle'
];

$iconName = $icon ?? $icons[$type] ?? 'info-circle';
@endphp

<div {{ $attributes->merge(['class' => implode(' ', array_filter($classes))]) }}>
    @if($icon !== false)
        <i class="icon icon-{{ $iconName }}"></i>
    @endif
    
    <div class="alert-content">
        {{ $slot }}
    </div>
    
    @if($dismissible)
        <button type="button" class="alert-close" data-dismiss="alert">
            <i class="icon icon-times"></i>
        </button>
    @endif
</div>
```

```blade
{{-- resources/views/components/card.blade.php --}}
@props([
    'title' => null,
    'footer' => null,
    'header' => null
])

<div {{ $attributes->merge(['class' => 'card']) }}>
    @if($header)
        <div class="card-header">
            {{ $header }}
        </div>
    @elseif($title)
        <div class="card-header">
            <h3 class="card-title">{{ $title }}</h3>
        </div>
    @endif
    
    <div class="card-body">
        {{ $slot }}
    </div>
    
    @if($footer)
        <div class="card-footer">
            {{ $footer }}
        </div>
    @endif
</div>
```

### Vista de Posts con Componentes
```blade
{{-- resources/views/posts/index.blade.php --}}
@extends('layouts.app')

@section('title', 'Blog - Posts')
@section('meta_description', 'Descubre nuestros últimos artículos y posts del blog')

@section('breadcrumbs')
    <li class="breadcrumb-item"><a href="{{ route('home') }}">Inicio</a></li>
    <li class="breadcrumb-item active">Blog</li>
@endsection

@section('content')
<div class="container">
    {{-- Filtros --}}
    <x-card title="Filtros" class="mb-4">
        <form method="GET" action="{{ route('posts.index') }}">
            <div class="row">
                <div class="col-md-4">
                    <input type="text" 
                           name="search" 
                           class="form-control" 
                           placeholder="Buscar posts..."
                           value="{{ request('search') }}">
                </div>
                <div class="col-md-3">
                    <select name="category" class="form-control">
                        <option value="">Todas las categorías</option>
                        @foreach($categorias as $categoria)
                            <option value="{{ $categoria->id }}" 
                                    {{ request('category') == $categoria->id ? 'selected' : '' }}>
                                {{ $categoria->name }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="col-md-3">
                    <select name="sort" class="form-control">
                        <option value="created_at" {{ request('sort') == 'created_at' ? 'selected' : '' }}>
                            Más recientes
                        </option>
                        <option value="title" {{ request('sort') == 'title' ? 'selected' : '' }}>
                            Título A-Z
                        </option>
                        <option value="views_count" {{ request('sort') == 'views_count' ? 'selected' : '' }}>
                            Más populares
                        </option>
                    </select>
                </div>
                <div class="col-md-2">
                    <button type="submit" class="btn btn-primary">Filtrar</button>
                </div>
            </div>
        </form>
    </x-card>

    {{-- Lista de Posts --}}
    <div class="row">
        @forelse($posts as $post)
            <div class="col-md-6 col-lg-4 mb-4">
                <x-card class="h-100">
                    @if($post->featured_image)
                        <img src="{{ $post->featured_image_url }}" 
                             class="card-img-top" 
                             alt="{{ $post->title }}"
                             style="height: 200px; object-fit: cover;">
                    @endif
                    
                    <x-slot name="header">
                        <small class="text-muted">
                            <i class="icon icon-calendar"></i>
                            {{ $post->published_at->format('d/m/Y') }}
                        </small>
                        
                        @if($post->category)
                            <span class="badge badge-primary">{{ $post->category->name }}</span>
                        @endif
                    </x-slot>
                    
                    <h5 class="card-title">
                        <a href="{{ route('posts.show', $post->slug) }}">{{ $post->title }}</a>
                    </h5>
                    
                    <p class="card-text">{{ Str::limit($post->excerpt, 120) }}</p>
                    
                    <div class="post-meta">
                        <small class="text-muted">
                            Por {{ $post->user->name }} • 
                            {{ $post->reading_time }} • 
                            {{ $post->views_count }} vistas
                        </small>
                    </div>
                    
                    <x-slot name="footer">
                        <div class="d-flex justify-content-between align-items-center">
                            <a href="{{ route('posts.show', $post->slug) }}" class="btn btn-primary btn-sm">
                                Leer más
                            </a>
                            
                            <div class="post-actions">
                                @auth
                                    <button class="btn btn-outline-danger btn-sm like-btn" 
                                            data-post-id="{{ $post->id }}">
                                        <i class="icon icon-heart {{ $post->isLikedBy(auth()->user()) ? 'text-danger' : '' }}"></i>
                                        {{ $post->likes_count }}
                                    </button>
                                @endauth
                                
                                <span class="text-muted">
                                    <i class="icon icon-comment"></i> {{ $post->comments_count }}
                                </span>
                            </div>
                        </div>
                    </x-slot>
                </x-card>
            </div>
        @empty
            <div class="col-12">
                <x-alert type="info" :dismissible="false">
                    <p class="mb-0">No se encontraron posts que coincidan con tu búsqueda.</p>
                </x-alert>
            </div>
        @endforelse
    </div>

    {{-- Paginación --}}
    <div class="d-flex justify-content-center">
        {{ $posts->links() }}
    </div>
</div>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Manejar likes con AJAX
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.dataset.postId;
            
            fetch(`/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const icon = this.querySelector('.icon-heart');
                    const countSpan = this.querySelector('span') || this;
                    
                    if (data.liked) {
                        icon.classList.add('text-danger');
                    } else {
                        icon.classList.remove('text-danger');
                    }
                    
                    countSpan.textContent = data.likes_count;
                }
            })
            .catch(error => console.error('Error:', error));
        });
    });
});
</script>
@endpush
```

## 10. APIs y Recursos

### API Resource
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
            'avatar_url' => $this->avatar_url,
            'status' => $this->status,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            
            // Campos condicionales
            'email_verified_at' => $this->when(
                $this->email_verified_at,
                $this->email_verified_at->toISOString()
            ),
            
            'phone' => $this->when(
                $request->user()?->can('view-phone', $this->resource),
                $this->phone
            ),
            
            // Relaciones
            'posts_count' => $this->whenCounted('posts'),
            'posts' => PostResource::collection($this->whenLoaded('posts')),
            'roles' => RoleResource::collection($this->whenLoaded('roles')),
            
            // Campos computados
            'is_admin' => $this->isAdmin(),
            'full_name' => $this->full_name,
            
            // Links
            'links' => [
                'self' => route('api.users.show', $this->id),
                'posts' => route('api.users.posts', $this->id),
            ],
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

### Resource Collection
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
            'links' => [
                'self' => $request->url(),
            ],
            'meta' => [
                'total' => $this->resource->total(),
                'count' => $this->resource->count(),
                'per_page' => $this->resource->perPage(),
                'current_page' => $this->resource->currentPage(),
                'total_pages' => $this->resource->lastPage(),
            ],
        ];
    }
}
```

### API Controller
```php
<?php
// app/Http/Controllers/Api/PostController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Http\Resources\PostResource;
use App\Http\Resources\PostCollection;
use App\Http\Requests\PostRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PostController extends Controller
{
    /**
     * Lista de posts con filtros
     */
    public function index(Request $request): JsonResponse
    {
        $query = Post::with(['user', 'category', 'tags'])
                    ->published();
        
        // Filtros
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }
        
        if ($request->filled('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }
        
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('content', 'like', '%' . $request->search . '%');
            });
        }
        
        // Ordenamiento
        $sortBy = $request->get('sort', 'published_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);
        
        $posts = $query->paginate($request->get('per_page', 15));
        
        return response()->json(new PostCollection($posts));
    }
    
    /**
     * Mostrar post específico
     */
    public function show(Post $post): JsonResponse
    {
        // Incrementar vistas
        $post->increment('views_count');
        
        // Cargar relaciones
        $post->load(['user', 'category', 'tags', 'comments.user']);
        
        return response()->json([
            'data' => new PostResource($post),
        ]);
    }
    
    /**
     * Crear nuevo post
     */
    public function store(PostRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        
        $post = Post::create($data);
        
        // Asignar tags si existen
        if ($request->has('tags')) {
            $post->tags()->sync($request->tags);
        }
        
        return response()->json([
            'message' => 'Post creado exitosamente',
            'data' => new PostResource($post->load(['user', 'category', 'tags'])),
        ], 201);
    }
    
    /**
     * Actualizar post
     */
    public function update(PostRequest $request, Post $post): JsonResponse
    {
        // Verificar permisos
        if (auth()->id() !== $post->user_id && !auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'No tienes permisos para editar este post'
            ], 403);
        }
        
        $post->update($request->validated());
        
        if ($request->has('tags')) {
            $post->tags()->sync($request->tags);
        }
        
        return response()->json([
            'message' => 'Post actualizado exitosamente',
            'data' => new PostResource($post->load(['user', 'category', 'tags'])),
        ]);
    }
    
    /**
     * Eliminar post
     */
    public function destroy(Post $post): JsonResponse
    {
        if (auth()->id() !== $post->user_id && !auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'No tienes permisos para eliminar este post'
            ], 403);
        }
        
        $post->delete();
        
        return response()->json([
            'message' => 'Post eliminado exitosamente'
        ]);
    }
    
    /**
     * Like/Unlike post
     */
    public function toggleLike(Post $post): JsonResponse
    {
        $user = auth()->user();
        
        $like = $post->likes()->where('user_id', $user->id)->first();
        
        if ($like) {
            $like->delete();
            $liked = false;
        } else {
            $post->likes()->create(['user_id' => $user->id]);
            $liked = true;
        }
        
        return response()->json([
            'success' => true,
            'liked' => $liked,
            'likes_count' => $post->likes()->count(),
        ]);
    }
}
```

### Rutas API
```php
<?php
// routes/api.php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

// Posts públicos
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post:slug}', [PostController::class, 'show']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Posts
    Route::apiResource('posts', PostController::class)->except(['index', 'show']);
    Route::post('/posts/{post}/like', [PostController::class, 'toggleLike']);
    
    // Usuarios
    Route::apiResource('users', UserController::class)->middleware('admin');
    
    // Perfil
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::post('/profile/avatar', [UserController::class, 'updateAvatar']);
});

// Versionado de API
Route::prefix('v2')->group(function () {
    // Rutas de la versión 2 de la API
});
```

## 11. Autenticación y Autorización

### Sistema de Autenticación Completo
```php
<?php
// app/Http/Controllers/Auth/AuthController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    /**
     * Login del usuario
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean'
        ]);

        $credentials = $request->only('email', 'password');
        
        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $user = Auth::user();
            
            // Actualizar último login
            $user->update(['last_login_at' => now()]);
            
            // Para API: crear token
            if ($request->expectsJson()) {
                $token = $user->createToken('auth-token')->plainTextToken;
                
                return response()->json([
                    'user' => $user,
                    'token' => $token,
                    'token_type' => 'Bearer',
                ]);
            }
            
            $request->session()->regenerate();
            
            return redirect()->intended(route('dashboard'))
                           ->with('success', 'Bienvenido de vuelta!');
        }

        if ($request->expectsJson()) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales no coinciden con nuestros registros.'],
            ]);
        }

        return back()->withErrors([
            'email' => 'Las credenciales no coinciden con nuestros registros.',
        ])->onlyInput('email');
    }

    /**
     * Registro de nuevo usuario
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Enviar email de verificación
        $user->sendEmailVerificationNotification();

        Auth::login($user);

        if ($request->expectsJson()) {
            $token = $user->createToken('auth-token')->plainTextToken;
            
            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Usuario registrado exitosamente',
            ], 201);
        }

        return redirect(route('dashboard'))
                       ->with('success', 'Cuenta creada exitosamente!');
    }

    /**
     * Logout del usuario
     */
    public function logout(Request $request)
    {
        if ($request->expectsJson()) {
            // Para API: revocar token actual
            $request->user()->currentAccessToken()->delete();
            
            return response()->json(['message' => 'Logout exitoso']);
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'Has cerrado sesión correctamente');
    }

    /**
     * Obtener usuario actual (API)
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load(['roles', 'permissions']),
        ]);
    }
}
```

### Sistema de Roles y Permisos
```php
<?php
// app/Models/Role.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = ['name', 'display_name', 'description'];

    public function users()
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class)->withTimestamps();
    }

    public function hasPermission($permission)
    {
        return $this->permissions()->where('name', $permission)->exists();
    }
}
```

```php
<?php
// app/Models/Permission.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $fillable = ['name', 'display_name', 'description'];

    public function roles()
    {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }

    public function users()
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}
```

### Policies (Políticas de Autorización)
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
    public function viewAny(?User $user): bool
    {
        return true; // Los posts son públicos
    }

    /**
     * Ver post específico
     */
    public function view(?User $user, Post $post): bool
    {
        return $post->status === 'published' || 
               ($user && ($user->id === $post->user_id || $user->isAdmin()));
    }

    /**
     * Crear posts
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['author', 'admin']);
    }

    /**
     * Actualizar post
     */
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->isAdmin();
    }

    /**
     * Eliminar post
     */
    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->isAdmin();
    }

    /**
     * Publicar/despublicar post
     */
    public function publish(User $user, Post $post): bool
    {
        return $user->hasRole(['editor', 'admin']) || 
               ($user->id === $post->user_id && $user->hasPermission('publish-own-posts'));
    }
}
```

### Gates Personalizados
```php
<?php
// app/Providers/AuthServiceProvider.php

namespace App\Providers;

use App\Models\Post;
use App\Models\User;
use App\Policies\PostPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Post::class => PostPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        // Gates personalizados
        Gate::define('manage-users', function (User $user) {
            return $user->hasRole('admin');
        });

        Gate::define('moderate-comments', function (User $user) {
            return $user->hasAnyRole(['admin', 'moderator']);
        });

        Gate::define('access-admin-panel', function (User $user) {
            return $user->hasAnyRole(['admin', 'editor', 'moderator']);
        });

        // Gate con parámetros
        Gate::define('edit-profile', function (User $user, User $profile) {
            return $user->id === $profile->id || $user->isAdmin();
        });

        // Gate basado en closure complejo
        Gate::define('delete-comment', function (User $user, $comment) {
            // El usuario puede eliminar sus propios comentarios
            if ($user->id === $comment->user_id) {
                return true;
            }
            
            // Los moderadores pueden eliminar cualquier comentario
            if ($user->hasRole('moderator')) {
                return true;
            }
            
            // El autor del post puede eliminar comentarios en su post
            if ($user->id === $comment->post->user_id) {
                return true;
            }
            
            return false;
        });
    }
}
```

## 12. Colas (Queues) y Jobs

### Configuración de Colas
```php
<?php
// config/queue.php - Configuración básica ya incluida

// .env
QUEUE_CONNECTION=database
# O para Redis:
# QUEUE_CONNECTION=redis
```

### Job Básico
```php
<?php
// app/Jobs/SendWelcomeEmail.php

namespace App\Jobs;

use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 60;
    public $tries = 3;
    public $maxExceptions = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public User $user
    ) {
        // Configurar cola específica
        $this->onQueue('emails');
        
        // Retrasar ejecución
        $this->delay(now()->addMinutes(5));
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->user->email)->send(new WelcomeEmail($this->user));
        
        // Log del envío
        logger()->info('Email de bienvenida enviado', [
            'user_id' => $this->user->id,
            'email' => $this->user->email,
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        logger()->error('Falló el envío de email de bienvenida', [
            'user_id' => $this->user->id,
            'error' => $exception->getMessage(),
        ]);
        
        // Notificar a administradores
        // Aquí podrías enviar una notificación Slack, etc.
    }
}
```

### Job Complejo con Progreso
```php
<?php
// app/Jobs/ProcessLargeDataset.php

namespace App\Jobs;

use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;

class ProcessLargeDataset implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 300; // 5 minutos
    public $tries = 1;

    public function __construct(
        public array $dataChunk,
        public string $batchId,
        public int $chunkIndex
    ) {
        $this->onQueue('processing');
    }

    public function handle(): void
    {
        // Verificar si el batch fue cancelado
        if ($this->batch()?->cancelled()) {
            return;
        }

        $total = count($this->dataChunk);
        $processed = 0;

        foreach ($this->dataChunk as $item) {
            // Procesar cada item
            $this->processItem($item);
            
            $processed++;
            
            // Actualizar progreso
            $this->updateProgress($processed, $total);
            
            // Verificar cancelación periódicamente
            if ($processed % 10 === 0 && $this->batch()?->cancelled()) {
                return;
            }
        }
    }

    private function processItem($item): void
    {
        // Simular procesamiento pesado
        sleep(1);
        
        // Aquí iría la lógica real de procesamiento
        logger()->info('Item procesado', ['item_id' => $item['id']]);
    }

    private function updateProgress(int $processed, int $total): void
    {
        $progress = ($processed / $total) * 100;
        
        Cache::put(
            "batch_progress_{$this->batchId}_{$this->chunkIndex}",
            $progress,
            now()->addHours(2)
        );
    }

    public function failed(\Throwable $exception): void
    {
        logger()->error('Falló el procesamiento del chunk', [
            'batch_id' => $this->batchId,
            'chunk_index' => $this->chunkIndex,
            'error' => $exception->getMessage(),
        ]);
    }
}
```

### Despachar Jobs
```php
<?php
// En un controlador o servicio

use App\Jobs\SendWelcomeEmail;
use App\Jobs\ProcessLargeDataset;
use Illuminate\Support\Facades\Bus;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $user = User::create($request->validated());
        
        // Despachar job simple
        SendWelcomeEmail::dispatch($user);
        
        // Despachar con retraso
        SendWelcomeEmail::dispatch($user)->delay(now()->addMinutes(10));
        
        // Despachar a cola específica
        SendWelcomeEmail::dispatch($user)->onQueue('high-priority');
        
        return redirect()->route('users.index');
    }
    
    public function processData(Request $request)
    {
        $data = collect($request->data);
        $chunks = $data->chunk(100); // Procesar en chunks de 100
        
        // Crear batch de jobs
        $batch = Bus::batch([])
            ->then(function () {
                // Ejecutar cuando todos los jobs terminen
                logger()->info('Todos los datos fueron procesados');
            })
            ->catch(function (\Throwable $e) {
                // Manejar fallos del batch
                logger()->error('Falló el procesamiento del batch', [
                    'error' => $e->getMessage()
                ]);
            })
            ->finally(function () {
                // Ejecutar siempre al final
                Cache::forget('processing_status');
            })
            ->dispatch();
        
        // Agregar jobs al batch
        foreach ($chunks as $index => $chunk) {
            $batch->add(new ProcessLargeDataset(
                $chunk->toArray(),
                $batch->id,
                $index
            ));
        }
        
        return response()->json([
            'batch_id' => $batch->id,
            'message' => 'Procesamiento iniciado'
        ]);
    }
}
```

## 13. Eventos y Listeners

### Evento Personalizado
```php
<?php
// app/Events/PostPublished.php

namespace App\Events;

use App\Models\Post;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PostPublished implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Post $post
    ) {}

    /**
     * Canales donde transmitir el evento
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('posts'),
            new PrivateChannel('user.' . $this->post->user_id),
        ];
    }

    /**
     * Nombre del evento para broadcast
     */
    public function broadcastAs(): string
    {
        return 'post.published';
    }

    /**
     * Datos a transmitir
     */
    public function broadcastWith(): array
    {
        return [
            'post' => [
                'id' => $this->post->id,
                'title' => $this->post->title,
                'slug' => $this->post->slug,
                'author' => $this->post->user->name,
                'published_at' => $this->post->published_at->toISOString(),
            ],
        ];
    }
}
```

### Listeners
```php
<?php
// app/Listeners/SendPostNotifications.php

namespace App\Listeners;

use App\Events\PostPublished;
use App\Jobs\SendEmailNotification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendPostNotifications implements ShouldQueue
{
    public function __construct() {}

    public function handle(PostPublished $event): void
    {
        $post = $event->post;
        
        // Obtener suscriptores del autor
        $subscribers = User::whereHas('subscriptions', function ($query) use ($post) {
            $query->where('author_id', $post->user_id);
        })->get();
        
        // Enviar notificaciones
        foreach ($subscribers as $subscriber) {
            SendEmailNotification::dispatch($subscriber, 'new-post', [
                'post' => $post,
                'author' => $post->user,
            ]);
        }
        
        // Notificar en Slack si es un post destacado
        if ($post->is_featured) {
            // Enviar a Slack
        }
    }

    public function failed(PostPublished $event, \Throwable $exception): void
    {
        logger()->error('Falló el envío de notificaciones del post', [
            'post_id' => $event->post->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
```

### Registrar Eventos
```php
<?php
// app/Providers/EventServiceProvider.php

namespace App\Providers;

use App\Events\PostPublished;
use App\Events\UserRegistered;
use App\Listeners\SendPostNotifications;
use App\Listeners\SendWelcomeEmail;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        PostPublished::class => [
            SendPostNotifications::class,
        ],
        
        UserRegistered::class => [
            SendWelcomeEmail::class,
        ],
        
        // Eventos de Eloquent
        'eloquent.created: App\Models\User' => [
            'App\Listeners\LogUserCreated',
        ],
    ];

    public function boot(): void
    {
        parent::boot();

        // Listeners de closure para eventos simples
        Event::listen(
            'user.login',
            function (string $email) {
                logger()->info('Usuario logueado', ['email' => $email]);
            }
        );
    }
}
```

## 14. Cache y Optimización

### Cache Básico
```php
<?php
// En controladores o servicios

use Illuminate\Support\Facades\Cache;

class PostController extends Controller
{
    public function index()
    {
        // Cache simple
        $posts = Cache::remember('posts.published', 3600, function () {
            return Post::published()
                      ->with(['user', 'category'])
                      ->latest()
                      ->take(10)
                      ->get();
        });
        
        return view('posts.index', compact('posts'));
    }
    
    public function show(Post $post)
    {
        // Cache con tags (Redis/Memcached)
        $relatedPosts = Cache::tags(['posts', 'category:' . $post->category_id])
            ->remember("post.{$post->id}.related", 1800, function () use ($post) {
                return $post->getRelatedPosts(5);
            });
        
        return view('posts.show', compact('post', 'relatedPosts'));
    }
    
    public function updatePost(Request $request, Post $post)
    {
        $post->update($request->validated());
        
        // Invalidar cache relacionado
        Cache::forget('posts.published');
        Cache::tags(['posts', 'category:' . $post->category_id])->flush();
        Cache::forget("post.{$post->id}.related");
        
        return redirect()->route('posts.show', $post);
    }
}
```

### Cache en Modelos
```php
<?php
// app/Models/Post.php

class Post extends Model
{
    // ... otros métodos
    
    /**
     * Cache de posts populares
     */
    public static function getPopularPosts($limit = 5)
    {
        return Cache::remember("posts.popular.{$limit}", 3600, function () use ($limit) {
            return static::published()
                         ->withCount('likes')
                         ->orderByDesc('likes_count')
                         ->limit($limit)
                         ->get();
        });
    }
    
    /**
     * Cache de estadísticas del post
     */
    public function getStatsAttribute()
    {
        return Cache::remember("post.{$this->id}.stats", 1800, function () {
            return [
                'views' => $this->views_count,
                'likes' => $this->likes()->count(),
                'comments' => $this->comments()->count(),
                'shares' => $this->shares()->count(),
            ];
        });
    }
    
    /**
     * Invalidar cache al actualizar
     */
    protected static function boot()
    {
        parent::boot();
        
        static::updated(function ($post) {
            Cache::forget("post.{$post->id}.stats");
            Cache::forget("post.{$post->id}.related");
        });
        
        static::deleted(function ($post) {
            Cache::forget("post.{$post->id}.stats");
            Cache::forget("post.{$post->id}.related");
        });
    }
}
```

### Cache de Vistas
```php
<?php
// app/Http/Controllers/HomeController.php

class HomeController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        
        // Cache específico del usuario
        $stats = Cache::remember("user.{$user->id}.dashboard.stats", 1800, function () use ($user) {
            return [
                'posts_count' => $user->posts()->count(),
                'comments_count' => $user->comments()->count(),
                'likes_received' => $user->posts()->withCount('likes')->get()->sum('likes_count'),
                'followers_count' => $user->followers()->count(),
            ];
        });
        
        // Cache global
        $recentPosts = Cache::remember('dashboard.recent_posts', 600, function () {
            return Post::published()
                      ->with('user')
                      ->latest()
                      ->take(5)
                      ->get();
        });
        
        return view('dashboard', compact('stats', 'recentPosts'));
    }
}
```

## 15. Comandos Artisan Personalizados

### Comando Básico
```php
<?php
// app/Console/Commands/SendNewsletterCommand.php

namespace App\Console\Commands;

use App\Jobs\SendNewsletterEmail;
use App\Models\User;
use Illuminate\Console\Command;

class SendNewsletterCommand extends Command
{
    protected $signature = 'newsletter:send 
                           {--dry-run : Mostrar qué se haría sin ejecutar}
                           {--chunk=100 : Cantidad de usuarios por chunk}';

    protected $description = 'Enviar newsletter a todos los usuarios suscritos';

    public function handle(): int
    {
        $this->info('Iniciando envío de newsletter...');
        
        $isDryRun = $this->option('dry-run');
        $chunkSize = (int) $this->option('chunk');
        
        // Obtener usuarios suscritos
        $query = User::where('newsletter_subscribed', true)
                    ->where('status', 'active');
        
        $totalUsers = $query->count();
        
        if ($totalUsers === 0) {
            $this->warn('No hay usuarios suscritos al newsletter.');
            return self::SUCCESS;
        }
        
        $this->info("Se enviará newsletter a {$totalUsers} usuarios");
        
        if ($isDryRun) {
            $this->warn('MODO DRY-RUN: No se enviará nada realmente');
            return self::SUCCESS;
        }
        
        if (!$this->confirm('¿Continuar con el envío?')) {
            $this->info('Operación cancelada.');
            return self::SUCCESS;
        }
        
        // Barra de progreso
        $progressBar = $this->output->createProgressBar($totalUsers);
        $progressBar->start();
        
        $sent = 0;
        $failed = 0;
        
        // Procesar en chunks
        $query->chunk($chunkSize, function ($users) use (&$sent, &$failed, $progressBar) {
            foreach ($users as $user) {
                try {
                    SendNewsletterEmail::dispatch($user);
                    $sent++;
                } catch (\Exception $e) {
                    $this->error("Error enviando a {$user->email}: " . $e->getMessage());
                    $failed++;
                }
                
                $progressBar->advance();
            }
        });
        
        $progressBar->finish();
        $this->newLine(2);
        
        $this->info("Newsletter enviado exitosamente!");
        $this->table(
            ['Métrica', 'Valor'],
            [
                ['Usuarios procesados', $totalUsers],
                ['Enviados exitosamente', $sent],
                ['Fallidos', $failed],
                ['Tasa de éxito', round(($sent / $totalUsers) * 100, 2) . '%']
            ]
        );
        
        return self::SUCCESS;
    }
}
```

### Comando Complejo con Argumentos y Opciones
```php
<?php
// app/Console/Commands/ImportDataCommand.php

namespace App\Console\Commands;

use App\Models\Post;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use League\Csv\Reader;

class ImportDataCommand extends Command
{
    protected $signature = 'data:import 
                           {type : Tipo de datos a importar (users|posts)}
                           {file : Ruta del archivo CSV}
                           {--validate : Solo validar sin importar}
                           {--batch-size=100 : Tamaño del lote}
                           {--skip-header : Omitir primera fila}';

    protected $description = 'Importar datos desde archivo CSV';

    private array $errors = [];
    private int $imported = 0;
    private int $skipped = 0;

    public function handle(): int
    {
        $type = $this->argument('type');
        $file = $this->argument('file');
        
        if (!in_array($type, ['users', 'posts'])) {
            $this->error('Tipo debe ser: users o posts');
            return self::FAILURE;
        }
        
        if (!Storage::exists($file)) {
            $this->error("Archivo no encontrado: {$file}");
            return self::FAILURE;
        }
        
        $this->info("Importando {$type} desde {$file}");
        
        try {
            $csv = Reader::createFromPath(Storage::path($file), 'r');
            
            if ($this->option('skip-header')) {
                $csv->setHeaderOffset(0);
            }
            
            $records = $csv->getRecords();
            $totalRecords = iterator_count($csv->getRecords());
            
            $this->info("Total de registros: {$totalRecords}");
            
            if ($this->option('validate')) {
                return $this->validateData($type, $records);
            }
            
            return $this->importData($type, $records, $totalRecords);
            
        } catch (\Exception $e) {
            $this->error("Error procesando archivo: " . $e->getMessage());
            return self::FAILURE;
        }
    }

    private function validateData(string $type, $records): int
    {
        $this->info('Validando datos...');
        
        $progressBar = $this->output->createProgressBar();
        $progressBar->start();
        
        foreach ($records as $index => $record) {
            $errors = $this->validateRecord($type, $record, $index + 1);
            
            if (!empty($errors)) {
                $this->errors = array_merge($this->errors, $errors);
            }
            
            $progressBar->advance();
        }
        
        $progressBar->finish();
        $this->newLine(2);
        
        if (empty($this->errors)) {
            $this->info('✅ Todos los registros son válidos');
            return self::SUCCESS;
        }
        
        $this->error('❌ Se encontraron errores de validación:');
        foreach ($this->errors as $error) {
            $this->line($error);
        }
        
        return self::FAILURE;
    }

    private function importData(string $type, $records, int $total): int
    {
        $progressBar = $this->output->createProgressBar($total);
        $progressBar->start();
        
        $batchSize = (int) $this->option('batch-size');
        $batch = [];
        
        DB::beginTransaction();
        
        try {
            foreach ($records as $index => $record) {
                $errors = $this->validateRecord($type, $record, $index + 1);
                
                if (!empty($errors)) {
                    $this->skipped++;
                    $this->errors = array_merge($this->errors, $errors);
                    continue;
                }
                
                $batch[] = $this->prepareRecord($type, $record);
                
                if (count($batch) >= $batchSize) {
                    $this->processBatch($type, $batch);
                    $batch = [];
                }
                
                $progressBar->advance();
            }
            
            // Procesar último batch
            if (!empty($batch)) {
                $this->processBatch($type, $batch);
            }
            
            DB::commit();
            
            $progressBar->finish();
            $this->newLine(2);
            
            $this->displayResults();
            
            return self::SUCCESS;
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Error durante la importación: " . $e->getMessage());
            return self::FAILURE;
        }
    }

    private function validateRecord(string $type, array $record, int $lineNumber): array
    {
        $errors = [];
        
        if ($type === 'users') {
            if (empty($record['email'])) {
                $errors[] = "Línea {$lineNumber}: Email es requerido";
            } elseif (!filter_var($record['email'], FILTER_VALIDATE_EMAIL)) {
                $errors[] = "Línea {$lineNumber}: Email inválido";
            } elseif (User::where('email', $record['email'])->exists()) {
                $errors[] = "Línea {$lineNumber}: Email ya existe";
            }
            
            if (empty($record['name'])) {
                $errors[] = "Línea {$lineNumber}: Nombre es requerido";
            }
        }
        
        return $errors;
    }

    private function prepareRecord(string $type, array $record): array
    {
        $now = now();
        
        if ($type === 'users') {
            return [
                'name' => $record['name'],
                'email' => $record['email'],
                'password' => bcrypt($record['password'] ?? 'password123'),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        
        return $record;
    }

    private function processBatch(string $type, array $batch): void
    {
        if ($type === 'users') {
            User::insert($batch);
        }
        
        $this->imported += count($batch);
    }

    private function displayResults(): void
    {
        $this->info('Importación completada!');
        
        $this->table(
            ['Métrica', 'Valor'],
            [
                ['Registros importados', $this->imported],
                ['Registros omitidos', $this->skipped],
                ['Errores encontrados', count($this->errors)],
            ]
        );
        
        if (!empty($this->errors)) {
            $this->warn('Errores encontrados:');
            foreach (array_slice($this->errors, 0, 10) as $error) {
                $this->line("- {$error}");
            }
            
            if (count($this->errors) > 10) {
                $this->line("... y " . (count($this->errors) - 10) . " errores más");
            }
        }
    }
}
```

### Programar Comandos
```php
<?php
// app/Console/Kernel.php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        Commands\SendNewsletterCommand::class,
        Commands\ImportDataCommand::class,
    ];

    protected function schedule(Schedule $schedule): void
    {
        // Backup diario
        $schedule->command('backup:run')
                 ->daily()
                 ->at('02:00')
                 ->emailOutputOnFailure('admin@miapp.com');

        // Newsletter semanal
        $schedule->command('newsletter:send')
                 ->weekly()
                 ->mondays()
                 ->at('09:00')
                 ->withoutOverlapping()
                 ->runInBackground();

        // Limpiar archivos temporales
        $schedule->command('app:cleanup-temp-files')
                 ->hourly()
                 ->between('1:00', '5:00');

        // Generar reportes mensuales
        $schedule->command('reports:monthly')
                 ->monthlyOn(1, '08:00')
                 ->timezone('America/Argentina/Buenos_Aires');

        // Tarea con closure
        $schedule->call(function () {
            // Lógica personalizada
            DB::table('analytics')->where('created_at', '<', now()->subDays(90))->delete();
        })->daily();

        // Comando condicional
        $schedule->command('posts:publish-scheduled')
                 ->everyMinute()
                 ->when(function () {
                     return Post::where('status', 'scheduled')
                               ->where('publish_at', '<=', now())
                               ->exists();
                 });
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
```

## 16. Testing

### Test de Feature
```php
<?php
// tests/Feature/PostTest.php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PostTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Crear usuario para autenticación
        $this->user = User::factory()->create();
        $this->admin = User::factory()->admin()->create();
        
        Storage::fake('public');
    }

    public function test_guest_can_view_published_posts(): void
    {
        $post = Post::factory()->published()->create();

        $response = $this->get(route('posts.show', $post->slug));

        $response->assertStatus(200)
                ->assertSee($post->title)
                ->assertSee($post->content);
    }

    public function test_guest_cannot_view_draft_posts(): void
    {
        $post = Post::factory()->create(['status' => 'draft']);

        $response = $this->get(route('posts.show', $post->slug));

        $response->assertStatus(404);
    }

    public function test_authenticated_user_can_create_post(): void
    {
        $category = Category::factory()->create();
        
        $postData = [
            'title' => 'Mi Nuevo Post',
            'content' => 'Este es el contenido del post.',
            'excerpt' => 'Resumen del post.',
            'category_id' => $category->id,
            'status' => 'published',
        ];

        $response = $this->actingAs($this->user)
                         ->post(route('posts.store'), $postData);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('posts', [
            'title' => 'Mi Nuevo Post',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_post_creation_requires_validation(): void
    {
        $response = $this->actingAs($this->user)
                         ->post(route('posts.store'), []);

        $response->assertSessionHasErrors(['title', 'content']);
    }

    public function test_user_can_upload_featured_image(): void
    {
        $category = Category::factory()->create();
        $image = UploadedFile::fake()->image('featured.jpg', 800, 600);

        $postData = [
            'title' => 'Post con Imagen',
            'content' => 'Contenido del post.',
            'category_id' => $category->id,
            'featured_image' => $image,
        ];

        $response = $this->actingAs($this->user)
                         ->post(route('posts.store'), $postData);

        $response->assertRedirect();
        
        $post = Post::where('title', 'Post con Imagen')->first();
        
        $this->assertNotNull($post->featured_image);
        Storage::disk('public')->assertExists($post->featured_image);
    }

    public function test_user_can_only_edit_own_posts(): void
    {
        $post = Post::factory()->create(['user_id' => $this->user->id]);
        $otherPost = Post::factory()->create();

        // Puede editar su propio post
        $response = $this->actingAs($this->user)
                         ->get(route('posts.edit', $post));
        $response->assertStatus(200);

        // No puede editar post de otro usuario
        $response = $this->actingAs($this->user)
                         ->get(route('posts.edit', $otherPost));
        $response->assertStatus(403);
    }

    public function test_admin_can_edit_any_post(): void
    {
        $post = Post::factory()->create();

        $response = $this->actingAs($this->admin)
                         ->get(route('posts.edit', $post));

        $response->assertStatus(200);
    }

    public function test_post_like_functionality(): void
    {
        $post = Post::factory()->published()->create();

        $response = $this->actingAs($this->user)
                         ->post(route('posts.like', $post));

        $response->assertJson(['success' => true, 'liked' => true]);
        
        $this->assertDatabaseHas('likes', [
            'user_id' => $this->user->id,
            'likeable_id' => $post->id,
            'likeable_type' => Post::class,
        ]);
    }

    public function test_search_posts_functionality(): void
    {
        $post1 = Post::factory()->published()->create(['title' => 'Laravel Tutorial']);
        $post2 = Post::factory()->published()->create(['title' => 'PHP Basics']);
        
        $response = $this->get(route('posts.index', ['search' => 'Laravel']));

        $response->assertStatus(200)
                ->assertSee($post1->title)
                ->assertDontSee($post2->title);
    }
}
```

### Test de Unit
```php
<?php
// tests/Unit/UserTest.php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Post;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_full_name_accessor(): void
    {
        $user = User::factory()->make([
            'first_name' => 'Juan',
            'last_name' => 'Pérez'
        ]);

        $this->assertEquals('Juan Pérez', $user->full_name);
    }

    public function test_user_can_have_posts(): void
    {
        $user = User::factory()->create();
        $posts = Post::factory(3)->create(['user_id' => $user->id]);

        $this->assertCount(3, $user->posts);
        $this->assertInstanceOf(Post::class, $user->posts->first());
    }

    public function test_user_can_check_if_admin(): void
    {
        $user = User::factory()->create();
        $adminRole = Role::factory()->create(['name' => 'admin']);
        
        $this->assertFalse($user->isAdmin());
        
        $user->roles()->attach($adminRole);
        $user->refresh();
        
        $this->assertTrue($user->isAdmin());
    }

    public function test_password_is_hashed_on_creation(): void
    {
        $user = User::factory()->create(['password' => 'plaintext']);

        $this->assertNotEquals('plaintext', $user->password);
        $this->assertTrue(Hash::check('plaintext', $user->password));
    }

    public function test_user_can_like_posts(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $this->assertFalse($post->isLikedBy($user));

        $post->likes()->create(['user_id' => $user->id]);

        $this->assertTrue($post->isLikedBy($user));
    }
}
```

### Test de API
```php
<?php
// tests/Feature/Api/PostApiTest.php

namespace Tests\Feature\Api;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PostApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_posts_list(): void
    {
        Post::factory(5)->published()->create();

        $response = $this->getJson('/api/posts');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'title',
                            'slug',
                            'excerpt',
                            'published_at',
                            'author' => ['name', 'email'],
                        ]
                    ],
                    'meta' => ['total', 'current_page']
                ]);
    }

    public function test_can_create_post_when_authenticated(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $postData = [
            'title' => 'Nuevo Post API',
            'content' => 'Contenido del post desde API',
            'status' => 'published',
        ];

        $response = $this->postJson('/api/posts', $postData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'data' => ['id', 'title', 'slug', 'content'],
                    'message'
                ]);

        $this->assertDatabaseHas('posts', [
            'title' => 'Nuevo Post API',
            'user_id' => $user->id,
        ]);
    }

    public function test_cannot_create_post_when_unauthenticated(): void
    {
        $response = $this->postJson('/api/posts', [
            'title' => 'Post no autorizado',
            'content' => 'Este post no debería crearse',
        ]);

        $response->assertStatus(401);
    }

    public function test_can_filter_posts_by_category(): void
    {
        $category1 = Category::factory()->create();
        $category2 = Category::factory()->create();
        
        Post::factory(3)->published()->create(['category_id' => $category1->id]);
        Post::factory(2)->published()->create(['category_id' => $category2->id]);

        $response = $this->getJson("/api/posts?category={$category1->id}");

        $response->assertStatus(200)
                ->assertJsonCount(3, 'data');
    }

    public function test_rate_limiting_works(): void
    {
        // Hacer muchas requests para activar rate limiting
        for ($i = 0; $i < 61; $i++) {
            $this->getJson('/api/posts');
        }

        $response = $this->getJson('/api/posts');
        $response->assertStatus(429);
    }
}
```

## Conclusión

Esta masterclass cubre los aspectos fundamentales y avanzados de Laravel:

### 🎯 **Conceptos Cubiertos:**
1. **Instalación y configuración**
2. **Routing avanzado**
3. **Controladores y recursos**
4. **Eloquent ORM y relaciones**
5. **Migraciones y seeders**
6. **Validación y Form Requests**
7. **Middleware personalizado**
8. **Blade templates y componentes**
9. **APIs y recursos JSON**
10. **Autenticación y autorización**
11. **Colas y jobs**
12. **Eventos y listeners**
13. **Cache y optimización**
14. **Comandos Artisan**
15. **Testing completo**

### 🚀 **Próximos Pasos:**
- **Packages adicionales**: Spatie, Laravel Nova, Livewire
- **Deployment**: Docker, AWS, Forge
- **Performance**: Query optimization, Redis
- **Microservicios**: APIs, eventos
- **Frontend**: Vue.js, React con Laravel

### 📚 **Recursos Recomendados:**
- [Documentación oficial de Laravel](https://laravel.com/docs)
- [Laracasts](https://laracasts.com)
- [Laravel News](https://laravel-news.com)
- [Spatie Packages](https://spatie.be/open-source)

Esta guía te proporciona una base sólida para desarrollar aplicaciones web robustas y escalables con Laravel. ¡Practica implementando estos ejemplos en tus propios proyectos!