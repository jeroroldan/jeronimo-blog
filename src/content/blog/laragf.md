---
title: 'Maestría en Laravel'
code: 'laravel'
description: 'La Guía Definitiva de Fundamentos - De Cero a Experto'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Cimientos Sólidos para Maestría en Laravel
## La Guía Definitiva de Fundamentos - De Cero a Experto

---

## 🎯 **FILOSOFÍA DE APRENDIZAJE: LA PIRÁMIDE DEL MAESTRO**

```
        🏆 EXPERTO LARAVEL
       /                  \
      /   Patrones         \
     /   Arquitectura       \
    /______________________ \
   /                         \
  /   Framework Features      \
 /   (Eloquent, Routing,etc)   \
/________________________________\
          CIMIENTOS SÓLIDOS
    (PHP, OOP, Web, Databases)
```

**Regla de Oro:** Nunca avances al siguiente nivel sin dominar completamente el anterior.

---

## 🔰 **NIVEL 0: PRE-REQUISITOS ESENCIALES**

### **1. PHP Sólido como Roca**
```php
// Debes dominar esto ANTES de Laravel

// 1. Sintaxis y tipos de datos
$nombre = "Juan";
$edad = 30;
$esActivo = true;
$productos = ['laptop', 'mouse', 'teclado'];
$usuario = ['nombre' => 'Juan', 'edad' => 30];

// 2. Funciones y scope
function calcularTotal($productos) {
    static $contador = 0;
    $contador++;
    return array_sum($productos) * 1.21; // IVA argentino
}

// 3. Clases y objetos (FUNDAMENTAL)
class Usuario {
    private $nombre;
    private $email;
    
    public function __construct($nombre, $email) {
        $this->nombre = $nombre;
        $this->email = $email;
    }
    
    public function getNombre() {
        return $this->nombre;
    }
    
    public function setNombre($nombre) {
        $this->nombre = $nombre;
    }
}

// 4. Herencia
class Administrador extends Usuario {
    private $permisos = [];
    
    public function agregarPermiso($permiso) {
        $this->permisos[] = $permiso;
    }
}

// 5. Interfaces y Abstract Classes
interface Notificable {
    public function enviarNotificacion($mensaje);
}

abstract class Persona {
    abstract public function getTipo();
}

// 6. Traits (muy usado en Laravel)
trait Timestampable {
    public function getCreatedAt() {
        return $this->created_at;
    }
}

// 7. Namespaces (crítico para Laravel)
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Product extends Model {
    // código
}

// 8. Composer y autoload
// composer.json, vendor/, autoload, PSR-4

// 9. Manejo de errores
try {
    $resultado = $this->operacionRiesgosa();
} catch (Exception $e) {
    logger($e->getMessage());
    throw new CustomException("Error en operación");
}
```

### **2. Conceptos Web Fundamentales**
```bash
# HTTP Methods que debes dominar
GET     - Obtener datos
POST    - Crear recursos
PUT     - Actualizar completo
PATCH   - Actualizar parcial
DELETE  - Eliminar

# Status Codes esenciales
200 - OK
201 - Created
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
422 - Validation Error
500 - Server Error

# Headers importantes
Content-Type: application/json
Authorization: Bearer token
Accept: application/json
X-Requested-With: XMLHttpRequest
```

### **3. Base de Datos Sólida**
```sql
-- SQL que DEBES dominar

-- CRUD básico
SELECT * FROM users WHERE status = 'active';
INSERT INTO users (name, email) VALUES ('Juan', 'juan@email.com');
UPDATE users SET name = 'Juan Pérez' WHERE id = 1;
DELETE FROM users WHERE id = 1;

-- JOINs (crítico para Eloquent)
SELECT u.name, p.title 
FROM users u 
INNER JOIN posts p ON u.id = p.user_id;

SELECT u.name, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id;

-- Agregaciones
SELECT category, COUNT(*) as total, AVG(price) as avg_price
FROM products 
GROUP BY category
HAVING COUNT(*) > 5;

-- Índices (performance)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_user_status ON posts(user_id, status);
```

**🎯 Test de Pre-requisitos:**
Solo avanza si podés crear sin mirar documentación:
1. Una clase PHP con herencia e interface
2. Un sistema de archivos con namespaces
3. Operaciones CRUD en MySQL
4. Una petición HTTP con cURL

---

## 🏗️ **NIVEL 1: ARQUITECTURA Y CONCEPTOS CORE DE LARAVEL**

### **1. Entender el Ciclo de Vida de Laravel**
```php
// 1. public/index.php - Punto de entrada
require_once __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

// 2. Application Bootstrap
// - Carga configuración
// - Registra service providers
// - Inicializa servicios

// 3. Kernel maneja la request
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle($request = Illuminate\Http\Request::capture());

// 4. Service Container resuelve dependencias
// 5. Routing encuentra el controlador
// 6. Middleware procesa la request
// 7. Controller maneja la lógica
// 8. Response se devuelve al usuario
```

### **2. Service Container - El Corazón de Laravel**
```php
// Binding básico
app()->bind('repositorio.usuario', function() {
    return new UsuarioRepository();
});

// Singleton (una instancia para toda la app)
app()->singleton('config.cache', function() {
    return new ConfigCache();
});

// Inyección de dependencias
class UsuarioController extends Controller {
    protected $usuarioRepo;
    
    // Laravel resuelve automáticamente
    public function __construct(UsuarioRepository $usuarioRepo) {
        $this->usuarioRepo = $usuarioRepo;
    }
}

// Binding con interface
app()->bind(UsuarioRepositoryInterface::class, UsuarioRepository::class);
```

### **3. Service Providers - Los Organizadores**
```php
// php artisan make:provider ProductServiceProvider

class ProductServiceProvider extends ServiceProvider {
    public function register() {
        // Registrar servicios en el container
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        
        $this->app->singleton('product.manager', function($app) {
            return new ProductManager($app['db'], $app['cache']);
        });
    }
    
    public function boot() {
        // Ejecutar después de que todos los providers estén registrados
        View::composer('products.*', ProductComposer::class);
        
        // Observadores de modelos
        Product::observe(ProductObserver::class);
        
        // Rutas personalizadas
        $this->loadRoutesFrom(__DIR__.'/routes/products.php');
    }
}

// Registrar en config/app.php
'providers' => [
    App\Providers\ProductServiceProvider::class,
];
```

### **4. Facades - Las Fachadas Elegantes**
```php
// Facade básico
class ProductFacade extends Facade {
    protected static function getFacadeAccessor() {
        return 'product.manager';
    }
}

// Uso
Product::create(['name' => 'Laptop']);
// En lugar de:
app('product.manager')->create(['name' => 'Laptop']);

// Facades en tiempo real
Route::get('/users', [UserController::class, 'index']);
Cache::remember('users', 3600, function() {
    return User::all();
});
DB::table('users')->where('active', true)->get();
```

---

## 🛣️ **NIVEL 2: FUNDAMENTOS DEL FRAMEWORK**

### **1. Routing - El Cerebro de tu Aplicación**
```php
// routes/web.php - Rutas básicas
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/productos', [ProductController::class, 'index'])->name('products.index');

// Parámetros de ruta
Route::get('/producto/{id}', [ProductController::class, 'show'])->name('products.show');
Route::get('/categoria/{slug}', [CategoryController::class, 'show'])->where('slug', '[a-z-]+');

// Grupos de rutas
Route::prefix('admin')->middleware('auth')->group(function() {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::resource('/productos', AdminProductController::class);
});

// Resource routes (RESTful)
Route::resource('productos', ProductController::class);
/*
GET     /productos              index
GET     /productos/create       create
POST    /productos              store
GET     /productos/{producto}   show
GET     /productos/{producto}/edit  edit
PUT     /productos/{producto}   update
DELETE  /productos/{producto}   destroy
*/

// API Routes
Route::apiResource('api/productos', Api\ProductController::class);

// Route Model Binding
Route::get('/producto/{product}', function(Product $product) {
    return $product; // Laravel busca automáticamente por ID
});

// Custom Route Model Binding
Route::get('/producto/{product:slug}', function(Product $product) {
    return $product; // Busca por slug en lugar de ID
});
```

### **2. Controllers - Los Controladores de Tráfico**
```php
// php artisan make:controller ProductController --resource

class ProductController extends Controller {
    protected $productService;
    
    public function __construct(ProductService $productService) {
        $this->productService = $productService;
        
        // Middleware específico del controlador
        $this->middleware('auth')->except(['index', 'show']);
        $this->middleware('verified')->only(['create', 'store']);
    }
    
    public function index(Request $request) {
        $products = $this->productService->getFilteredProducts($request->all());
        return view('products.index', compact('products'));
    }
    
    public function show(Product $product) {
        $relatedProducts = $this->productService->getRelatedProducts($product);
        return view('products.show', compact('product', 'relatedProducts'));
    }
    
    public function store(StoreProductRequest $request) {
        $product = $this->productService->createProduct($request->validated());
        
        return redirect()
            ->route('products.show', $product)
            ->with('success', 'Producto creado exitosamente');
    }
    
    public function destroy(Product $product) {
        $this->productService->deleteProduct($product);
        
        return response()->json(['message' => 'Producto eliminado'], 200);
    }
}
```

### **3. Middleware - Los Guardias de Seguridad**
```php
// php artisan make:middleware CheckProductOwner

class CheckProductOwner {
    public function handle(Request $request, Closure $next) {
        $product = $request->route('product');
        
        if ($product && $product->user_id !== auth()->id()) {
            abort(403, 'No tienes permiso para acceder a este producto');
        }
        
        return $next($request);
    }
}

// Registrar en app/Http/Kernel.php
protected $routeMiddleware = [
    'product.owner' => \App\Http\Middleware\CheckProductOwner::class,
];

// Usar en rutas
Route::get('/producto/{product}/edit', [ProductController::class, 'edit'])
    ->middleware('product.owner');

// Middleware con parámetros
class CheckRole {
    public function handle(Request $request, Closure $next, $role) {
        if (!auth()->user()->hasRole($role)) {
            abort(403);
        }
        return $next($request);
    }
}

// Uso: ->middleware('role:admin')
```

### **4. Request Validation - La Validación Sólida**
```php
// php artisan make:request StoreProductRequest

class StoreProductRequest extends FormRequest {
    public function authorize() {
        return auth()->check(); // Solo usuarios autenticados
    }
    
    public function rules() {
        return [
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'required|string|min:10',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'images' => 'array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'tags' => 'array',
            'tags.*' => 'string|max:50'
        ];
    }
    
    public function messages() {
        return [
            'name.unique' => 'Ya existe un producto con este nombre',
            'price.min' => 'El precio debe ser mayor a 0',
            'images.*.image' => 'Solo se permiten imágenes'
        ];
    }
    
    public function prepareForValidation() {
        $this->merge([
            'slug' => Str::slug($this->name),
            'price' => str_replace(',', '.', $this->price)
        ]);
    }
    
    protected function passedValidation() {
        // Después de validación exitosa
        $this->replace($this->validated());
    }
}

// Custom validation rules
// php artisan make:rule ValidArgentinianPhone

class ValidArgentinianPhone implements Rule {
    public function passes($attribute, $value) {
        return preg_match('/^(\+54|0)?9?\d{8,10}$/', $value);
    }
    
    public function message() {
        return 'El formato del teléfono argentino no es válido';
    }
}
```

---

## 💾 **NIVEL 3: PERSISTENCIA DE DATOS**

### **1. Migrations - Control de Versiones de BD**
```php
// php artisan make:migration create_products_table

class CreateProductsTable extends Migration {
    public function up() {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->integer('stock')->default(0);
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['draft', 'active', 'inactive'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->json('metadata')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para performance
            $table->index(['status', 'published_at']);
            $table->index(['category_id', 'status']);
            $table->fullText(['name', 'description']); // Para búsqueda
        });
    }
    
    public function down() {
        Schema::dropIfExists('products');
    }
}

// Modificar tabla existente
// php artisan make:migration add_sku_to_products_table

class AddSkuToProductsTable extends Migration {
    public function up() {
        Schema::table('products', function (Blueprint $table) {
            $table->string('sku')->unique()->after('name');
            $table->index('sku');
        });
    }
    
    public function down() {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['sku']);
            $table->dropColumn('sku');
        });
    }
}
```

### **2. Seeders - Datos de Prueba Consistentes**
```php
// php artisan make:seeder ProductSeeder

class ProductSeeder extends Seeder {
    public function run() {
        // Seeder básico
        DB::table('categories')->insert([
            'name' => 'Electrónicos',
            'slug' => 'electronicos',
            'created_at' => now(),
        ]);
        
        // Usando modelos
        $category = Category::create([
            'name' => 'Electrónicos',
            'slug' => 'electronicos'
        ]);
        
        // Con Factory
        Product::factory()
            ->count(50)
            ->for($category)
            ->create();
        
        // Seeders relacionales
        User::factory()
            ->count(10)
            ->has(Product::factory()->count(5))
            ->create();
    }
}

// DatabaseSeeder.php
class DatabaseSeeder extends Seeder {
    public function run() {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
        ]);
    }
}
```

### **3. Factories - Datos Fake Inteligentes**
```php
// php artisan make:factory ProductFactory

class ProductFactory extends Factory {
    protected $model = Product::class;
    
    public function definition() {
        return [
            'name' => $this->faker->words(3, true),
            'slug' => $this->faker->slug,
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'stock' => $this->faker->numberBetween(0, 100),
            'category_id' => Category::factory(),
            'user_id' => User::factory(),
            'status' => $this->faker->randomElement(['draft', 'active', 'inactive']),
            'is_featured' => $this->faker->boolean(20), // 20% probabilidad
            'published_at' => $this->faker->optional()->dateTimeThisYear(),
        ];
    }
    
    // States personalizados
    public function featured() {
        return $this->state(function (array $attributes) {
            return [
                'is_featured' => true,
                'status' => 'active',
            ];
        });
    }
    
    public function expensive() {
        return $this->state(function (array $attributes) {
            return [
                'price' => $this->faker->randomFloat(2, 1000, 10000),
            ];
        });
    }
    
    public function withCategory(Category $category) {
        return $this->state(function (array $attributes) use ($category) {
            return [
                'category_id' => $category->id,
            ];
        });
    }
}

// Uso en tests o seeders
Product::factory()->featured()->count(10)->create();
Product::factory()->expensive()->withCategory($electronics)->create();
```

---

## 🎨 **NIVEL 4: PRESENTACIÓN Y VIEWS**

### **1. Blade Templates - El Motor de Vistas**
```php
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Mi App') - {{ config('app.name') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('styles')
</head>
<body>
    <nav>
        @include('partials.navigation')
    </nav>
    
    <main>
        @if(session('success'))
            @include('partials.alert', ['type' => 'success', 'message' => session('success')])
        @endif
        
        @yield('content')
    </main>
    
    <footer>
        @include('partials.footer')
    </footer>
    
    @stack('scripts')
</body>
</html>

{{-- resources/views/products/index.blade.php --}}
@extends('layouts.app')

@section('title', 'Productos')

@section('content')
<div class="container">
    <h1>Productos</h1>
    
    @forelse($products as $product)
        <div class="product-card">
            <h3>{{ $product->name }}</h3>
            <p>{{ Str::limit($product->description, 100) }}</p>
            <p>Precio: ${{ number_format($product->price, 2) }}</p>
            
            @can('update', $product)
                <a href="{{ route('products.edit', $product) }}">Editar</a>
            @endcan
            
            @if($product->is_featured)
                <span class="badge featured">Destacado</span>
            @endif
        </div>
    @empty
        <p>No hay productos disponibles.</p>
    @endforelse
    
    {{ $products->links() }}
</div>
@endsection

@push('scripts')
<script>
    // JavaScript específico para esta página
</script>
@endpush
```

### **2. View Composers - Datos Consistentes**
```php
// app/Http/View/Composers/NavigationComposer.php

class NavigationComposer {
    public function compose(View $view) {
        $view->with([
            'categories' => Cache::remember('nav.categories', 3600, function() {
                return Category::active()->orderBy('name')->get();
            }),
            'cartItemCount' => auth()->check() ? auth()->user()->cartItems()->count() : 0
        ]);
    }
}

// Registrar en AppServiceProvider
public function boot() {
    View::composer('partials.navigation', NavigationComposer::class);
    
    // O con closure
    View::composer('products.*', function ($view) {
        $view->with('categories', Category::all());
    });
}
```

### **3. Custom Blade Directives**
```php
// AppServiceProvider.php
public function boot() {
    Blade::directive('money', function ($expression) {
        return "<?php echo '$' . number_format($expression, 2); ?>";
    });
    
    Blade::directive('datetime', function ($expression) {
        return "<?php echo ($expression)->format('d/m/Y H:i'); ?>";
    });
    
    Blade::if('admin', function () {
        return auth()->check() && auth()->user()->isAdmin();
    });
}

// Uso en vistas
@money($product->price)  {{-- $1,250.50 --}}
@datetime($product->created_at)  {{-- 15/08/2024 14:30 --}}

@admin
    <a href="/admin">Panel Admin</a>
@endadmin
```

---

## 🔐 **NIVEL 5: AUTENTICACIÓN Y AUTORIZACIÓN**

### **1. Authentication - Quién Es**
```php
// Sistema de auth completo

// Login
public function login(Request $request) {
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);
    
    if (Auth::attempt($credentials, $request->remember)) {
        $request->session()->regenerate();
        
        return redirect()->intended('/dashboard');
    }
    
    return back()->withErrors([
        'email' => 'Las credenciales no coinciden.',
    ]);
}

// Logout
public function logout(Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    
    return redirect('/');
}

// Middleware de auth personalizado
class CustomAuth {
    public function handle(Request $request, Closure $next, $guard = null) {
        if (!Auth::guard($guard)->check()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect()->guest(route('login'));
        }
        
        return $next($request);
    }
}
```

### **2. Authorization - Qué Puede Hacer**
```php
// Gates (permisos simples)
// AuthServiceProvider.php
public function boot() {
    Gate::define('update-product', function (User $user, Product $product) {
        return $user->id === $product->user_id || $user->isAdmin();
    });
    
    Gate::define('view-admin-panel', function (User $user) {
        return $user->role === 'admin';
    });
    
    // Gate con parámetros múltiples
    Gate::define('edit-post', function (User $user, Post $post, Category $category) {
        return $user->id === $post->user_id && $post->category_id === $category->id;
    });
}

// Policies (permisos organizados)
// php artisan make:policy ProductPolicy --model=Product

class ProductPolicy {
    public function viewAny(User $user) {
        return true; // Cualquier usuario autenticado puede ver productos
    }
    
    public function view(User $user, Product $product) {
        return $product->status === 'active' || $user->id === $product->user_id;
    }
    
    public function create(User $user) {
        return $user->email_verified_at !== null;
    }
    
    public function update(User $user, Product $product) {
        return $user->id === $product->user_id;
    }
    
    public function delete(User $user, Product $product) {
        return $user->id === $product->user_id || $user->isAdmin();
    }
    
    public function forceDelete(User $user, Product $product) {
        return $user->isAdmin();
    }
}

// Uso en controladores
public function edit(Product $product) {
    $this->authorize('update', $product);
    return view('products.edit', compact('product'));
}

// Uso en vistas
@can('update', $product)
    <a href="{{ route('products.edit', $product) }}">Editar</a>
@endcan

@cannot('delete', $product)
    <p>No puedes eliminar este producto</p>
@endcannot
```

### **3. Roles y Permisos Sistema Avanzado**
```php
// Modelo User con roles
class User extends Authenticatable {
    public function roles() {
        return $this->belongsToMany(Role::class);
    }
    
    public function hasRole($role) {
        return $this->roles()->where('name', $role)->exists();
    }
    
    public function hasPermission($permission) {
        return $this->roles()->whereHas('permissions', function($query) use ($permission) {
            $query->where('name', $permission);
        })->exists();
    }
    
    public function isAdmin() {
        return $this->hasRole('admin');
    }
}

class Role extends Model {
    public function users() {
        return $this->belongsToMany(User::class);
    }
    
    public function permissions() {
        return $this->belongsToMany(Permission::class);
    }
}

class Permission extends Model {
    public function roles() {
        return $this->belongsToMany(Role::class);
    }
}

// Middleware para permisos
class CheckPermission {
    public function handle(Request $request, Closure $next, $permission) {
        if (!auth()->user()->hasPermission($permission)) {
            abort(403, 'No tienes permiso para realizar esta acción');
        }
        
        return $next($request);
    }
}
```

---

## 🧪 **NIVEL 6: TESTING - LA BASE DE LA CONFIANZA**

### **1. Feature Tests - Pruebas de Funcionalidad**
```php
// tests/Feature/ProductTest.php

class ProductTest extends TestCase {
    use RefreshDatabase;
    
    public function test_user_can_view_products() {
        $products = Product::factory()->count(3)->create();
        
        $response = $this->get('/productos');
        
        $response->assertStatus(200);
        $response->assertViewIs('products.index');
        $response->assertSee($products[0]->name);
    }
    
    public function test_authenticated_user_can_create_product() {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        
        $productData = [
            'name' => 'Test Product',
            'description' => 'This is a test product',
            'price' => 99.99,
            'category_id' => $category->id
        ];
        
        $response = $this->actingAs($user)
            ->post('/productos', $productData);
        
        $response->assertRedirect();
        $this->assertDatabaseHas('products', [
            'name' => 'Test Product',
            'user_id' => $user->id
        ]);
    }
    
    public function test_guest_cannot_create_product() {
        $response = $this->post('/productos', []);
        
        $response->assertRedirect('/login');
    }
    
    public function test_user_can_only_edit_own_products() {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $product = Product::factory()->for($user2)->create();
        
        $response = $this->actingAs($user1)
            ->get("/productos/{$product->id}/edit");
        
        $response->assertStatus(403);
    }
}
```

### **2. Unit Tests - Pruebas de Unidad**
```php
// tests/Unit/ProductTest.php

class ProductTest extends TestCase {
    use RefreshDatabase;
    
    public function test_product_belongs_to_user() {
        $user = User::factory()->create();
        $product = Product::factory()->for($user)->create();
        
        $this->assertInstanceOf(User::class, $product->user);
        $this->assertEquals($user->id, $product->user->id);
    }
    
    public function test_product_has_formatted_price_accessor() {
        $product = Product::factory()->make(['price' => 1234.56]);
        
        $this->assertEquals('$1,234.56', $product->formatted_price);
    }
    
    public function test_product_slug_is_generated_automatically() {
        $product = Product::factory()->create(['name' => 'My Great Product']);
        
        $this->assertEquals('my-great-product', $product->slug);
    }
    
    public function test_product_scope_active_returns_only_active_products() {
        Product::factory()->create(['status' => 'active']);
        Product::factory()->create(['status' => 'inactive']);
        
        $activeProducts = Product::active()->get();
        
        $this->assertCount(1, $activeProducts);
        $this->assertEquals('active', $activeProducts->first()->status);
    }
}
```

### **3. Test Database y Factories**
```php
// phpunit.xml configuración de testing
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>

// TestCase base personalizado
abstract class TestCase extends BaseTestCase {
    use CreatesApplication;
    
    protected function setUp(): void {
        parent::setUp();
        
        // Setup común para todos los tests
        $this->artisan('migrate');
        
        // Mock servicios externos
        $this->mock(PaymentService::class);
    }
    
    protected function createUser($attributes = []) {
        return User::factory()->create($attributes);
    }
    
    protected function createAdmin() {
        return User::factory()->admin()->create();
    }
}
```

---

## 📦 **NIVEL 7: SERVICIOS Y HELPERS**

### **1. Cache - Acelerar tu Aplicación**
```php
// Cache básico
$users = Cache::remember('users.all', 3600, function() {
    return User::all();
});

// Cache con tags (Redis required)
Cache::tags(['users', 'posts'])->put('user.1', $user, 3600);
Cache::tags(['users'])->flush(); // Limpia todo el cache de users

// Cache condicional
$user = Cache::rememberForever("user.{$id}", function() use ($id) {
    return User::find($id);
});

// Invalidar cache específico
Cache::forget("user.{$id}");

// Lock para evitar cache stampede
$value = Cache::lock('expensive-operation', 10)->block(5, function () {
    return $this->expensiveOperation();
});
```

### **2. Events y Listeners - Comunicación Desacoplada**
```php
// php artisan make:event ProductCreated
class ProductCreated {
    use Dispatchable, SerializesModels;
    
    public $product;
    
    public function __construct(Product $product) {
        $this->product = $product;
    }
}

// php artisan make:listener SendProductNotification --event=ProductCreated
class SendProductNotification {
    public function handle(ProductCreated $event) {
        // Enviar email al administrador
        Mail::to('admin@tienda.com')->send(new ProductCreatedMail($event->product));
        
        // Limpiar cache
        Cache::tags(['products'])->flush();
        
        // Log de auditoría
        Log::info('Product created', ['product_id' => $event->product->id]);
    }
}

// Registrar en EventServiceProvider
protected $listen = [
    ProductCreated::class => [
        SendProductNotification::class,
        UpdateSearchIndex::class,
    ],
];

// Disparar evento
event(new ProductCreated($product));
```

### **3. Jobs y Queues - Tareas Asíncronas**
```php
// php artisan make:job ProcessProductImages
class ProcessProductImages implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    protected $product;
    
    public function __construct(Product $product) {
        $this->product = $product;
    }
    
    public function handle() {
        foreach ($this->product->images as $image) {
            // Redimensionar imagen
            $this->resizeImage($image);
            
            // Generar thumbnails
            $this->generateThumbnails($image);
            
            // Optimizar para web
            $this->optimizeForWeb($image);
        }
    }
    
    public function failed(Exception $exception) {
        // Manejar fallo del job
        Log::error('Failed to process product images', [
            'product_id' => $this->product->id,
            'error' => $exception->getMessage()
        ]);
    }
}

// Despachar job
ProcessProductImages::dispatch($product);

// Job con delay
ProcessProductImages::dispatch($product)->delay(now()->addMinutes(5));

// Job en queue específica
ProcessProductImages::dispatch($product)->onQueue('images');
```

---

## 🛠️ **NIVEL 8: HERRAMIENTAS Y ENTORNO**

### **1. Artisan Commands Personalizados**
```php
// php artisan make:command CleanupProducts
class CleanupProducts extends Command {
    protected $signature = 'products:cleanup {--days=30} {--dry-run}';
    protected $description = 'Cleanup old inactive products';
    
    public function handle() {
        $days = $this->option('days');
        $dryRun = $this->option('dry-run');
        
        $query = Product::where('status', 'inactive')
            ->where('updated_at', '<', now()->subDays($days));
        
        $count = $query->count();
        
        if ($dryRun) {
            $this->info("Would delete {$count} products");
            return;
        }
        
        if ($this->confirm("Delete {$count} products?")) {
            $query->delete();
            $this->info("Deleted {$count} products");
        }
    }
}
```

### **2. Configuration Management**
```php
// config/services.php
return [
    'mercadopago' => [
        'public_key' => env('MERCADOPAGO_PUBLIC_KEY'),
        'access_token' => env('MERCADOPAGO_ACCESS_TOKEN'),
        'sandbox' => env('MERCADOPAGO_SANDBOX', true),
    ],
    
    'mail' => [
        'from' => env('MAIL_FROM_ADDRESS', 'noreply@miapp.com'),
        'name' => env('MAIL_FROM_NAME', 'Mi App'),
    ],
];

// Uso
$mpToken = config('services.mercadopago.access_token');
$isProduction = !config('services.mercadopago.sandbox');
```

### **3. Environment Management**
```bash
# .env.example (template para el equipo)
APP_NAME="Mi Aplicación"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mi_app
DB_USERNAME=root
DB_PASSWORD=

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
```

---

## 🎯 **PLAN DE APRENDIZAJE: 90 DÍAS PARA LA MAESTRÍA**

### **Mes 1: Cimientos Sólidos (Días 1-30)**

**Semana 1: Pre-requisitos**
- Día 1-2: PHP OOP avanzado
- Día 3-4: Composer y PSR-4
- Día 5-6: SQL y bases de datos
- Día 7: HTTP y conceptos web

**Semana 2: Laravel Core**
- Día 8-9: Service Container y Providers
- Día 10-11: Facades y arquitectura
- Día 12-13: Routing completo
- Día 14: Proyecto: API básica

**Semana 3: MVC Sólido**
- Día 15-16: Controllers y middleware
- Día 17-18: Validation y Form Requests
- Día 19-20: Blade templates
- Día 21: Proyecto: CRUD completo

**Semana 4: Base de Datos**
- Día 22-23: Migrations y schemas
- Día 24-25: Seeders y factories
- Día 26-27: Query Builder básico
- Día 28-30: Proyecto: Sistema de blog

### **Mes 2: Funcionalidades Avanzadas (Días 31-60)**

**Semana 5-6: Eloquent Maestría**
- Eloquent ORM completo
- Relaciones complejas
- Scopes y accessors
- Eventos y observers

**Semana 7-8: Servicios del Framework**
- Autenticación y autorización
- Cache y performance
- Events y jobs
- Mail y notifications

### **Mes 3: Arquitectura y Patrones (Días 61-90)**

**Semana 9-10: Testing y Calidad**
- Feature y unit tests
- TDD approach
- Mock y fake
- CI/CD básico

**Semana 11-12: Patrones Avanzados**
- Repository pattern
- Service layer
- SOLID principles
- Clean architecture

**Semana 13: Proyecto Final**
- E-commerce completo
- API RESTful
- Testing 100%
- Deploy production

---

## 🏆 **PROYECTOS PRÁCTICOS PARA CADA NIVEL**

### **1. Blog Personal (Nivel Básico)**
```php
// Funcionalidades:
- Gestión de posts
- Categorías y tags
- Comentarios
- Panel de administración básico

// Tecnologías:
- Routing y controllers
- Blade templates
- Eloquent básico
- Validación
- Auth simple
```

### **2. E-commerce (Nivel Intermedio)**
```php
// Funcionalidades:
- Catálogo de productos
- Carrito de compras
- Sistema de usuarios
- Órdenes y pagos
- Panel de administración

// Tecnologías:
- Relaciones complejas
- Events y listeners
- Jobs para emails
- Cache de productos
- Roles y permisos
- API RESTful
```

### **3. Sistema de Gestión (Nivel Avanzado)**
```php
// Funcionalidades:
- Multi-tenant
- Roles granulares
- Reportes complejos
- Integración con APIs
- Real-time con WebSockets

// Tecnologías:
- Architecture patterns
- Testing completo
- Performance optimization
- Microservicios
- DevOps y deploy
```

---

## 📚 **RECURSOS ESENCIALES PARA EL MAESTRO**

### **Documentación Oficial**
- Laravel Documentation: https://laravel.com/docs
- PHP Manual: https://php.net/manual
- MySQL Documentation: https://dev.mysql.com/doc/

### **Libros Fundamentales**
1. "Laravel: Up & Running" - Matt Stauffer
2. "Domain-Driven Design in PHP" - Carlos Buenosvinos
3. "Clean Code" - Robert Martin
4. "Patterns of Enterprise Application Architecture" - Martin Fowler

### **Herramientas del Maestro**
```bash
# Desarrollo
- Laravel Valet (macOS)
- Laravel Homestead (Vagrant)
- Docker con Laravel Sail
- PhpStorm IDE
- VS Code con extensiones

# Testing y Calidad
- PHPUnit
- Laravel Dusk (E2E)
- PHP CS Fixer
- PHPStan/Larastan

# Deployment
- Laravel Forge
- Laravel Envoyer
- GitHub Actions
- Docker containers
```

### **Comunidad y Aprendizaje**
- Laracasts (premium courses)
- Laravel News
- Laravel Daily
- Comunidad Laravel Argentina
- Stack Overflow
- GitHub Laravel

---

## ✅ **CHECKLIST DEL MAESTRO LARAVEL**

### **Fundamentos (Debe dominar al 100%)**
- [ ] PHP OOP avanzado con traits e interfaces
- [ ] Composer y gestión de dependencias
- [ ] Service Container e inyección de dependencias
- [ ] Service Providers y bootstrapping
- [ ] Routing con middleware y grupos
- [ ] Controllers y Resource Controllers
- [ ] Request validation completa
- [ ] Blade templating y components
- [ ] Eloquent ORM y relaciones
- [ ] Migrations y schema building
- [ ] Authentication y authorization
- [ ] Testing feature y unit

### **Intermedio (Debe manejar cómodamente)**
- [ ] Events, listeners y observers
- [ ] Jobs y queue system
- [ ] Cache strategies
- [ ] Mail y notifications
- [ ] File storage y uploads
- [ ] API resources y transformers
- [ ] Error handling y logging
- [ ] Database transactions
- [ ] Performance optimization
- [ ] Security best practices

### **Avanzado (Debe entender profundamente)**
- [ ] Architecture patterns (Repository, Service)
- [ ] SOLID principles application
- [ ] Testing advanced (mocking, faking)
- [ ] Package development
- [ ] Custom artisan commands
- [ ] Event sourcing concepts
- [ ] Microservices with Laravel
- [ ] Deployment y DevOps
- [ ] Monitoring y debugging
- [ ] Code review y mentoring

---

## 🎖️ **CERTIFICACIÓN PERSONAL DE MAESTRÍA**

### **Para considerarte un Maestro Laravel debes:**

1. **Desarrollar 3 proyectos completos** usando diferentes patrones
2. **Contribuir a un package** open source de Laravel
3. **Mentorar a 2 developers** en su aprendizaje de Laravel
4. **Dar una charla** sobre Laravel en un meetup o conferencia
5. **Escribir 5 artículos técnicos** sobre Laravel avanzado
6. **Resolver 50 issues** en Stack Overflow sobre Laravel
7. **Participar activamente** en la comunidad Laravel

---

**¡Felicitaciones! Ahora tenés la hoja de ruta completa para convertirte en un verdadero maestro de Laravel. Recordá: la maestría no se trata de conocer todas las features, sino de entender profundamente los fundamentos y saber aplicarlos para resolver problemas reales.**

**Tu viaje comienza con el Día 1. ¿Estás listo para convertirte en un experto Laravel?** 🚀