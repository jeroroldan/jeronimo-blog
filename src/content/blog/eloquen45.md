---
title: 'Eloquent ORM'
code: 'laravel'
description: 'Dominio Completo del ORM de Laravel'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Masterclass: Eloquent ORM - Dominio Completo del ORM de Laravel
## De Principiante a Arquitecto de Datos

---

## 🎯 **METODOLOGÍA DE APRENDIZAJE ELOQUENT**

### **Técnica de los 5 Pilares Eloquent:**
1. **Conceptualización** - Entender el paradigma ORM
2. **Modelado** - Diseñar entidades y relaciones
3. **Implementación** - Código práctico y patrones
4. **Optimización** - Performance y escalabilidad
5. **Arquitectura** - Patrones avanzados y mejores prácticas

### **Progresión de Aprendizaje:**
- 🔰 **Básico:** Modelos y CRUD (Semana 1)
- 🔥 **Intermedio:** Relaciones y Scopes (Semana 2)
- ⚡ **Avanzado:** Eventos y Observers (Semana 3)
- 🏗️ **Arquitecto:** Patrones y Optimización (Semana 4)

---

## 📚 **MÓDULO 1: FUNDAMENTOS DE ELOQUENT**

### **¿Qué es Eloquent y por qué es superior a Query Builder?**

**Eloquent ORM** es el mapeador objeto-relacional de Laravel que permite trabajar con bases de datos usando objetos PHP en lugar de SQL.

**Ventajas sobre Query Builder:**
- Sintaxis orientada a objetos
- Relaciones automáticas
- Validación integrada
- Eventos de modelo
- Casting automático de tipos
- Mutators y Accessors

### **Tu Primer Modelo Eloquent**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    // Tabla personalizada (opcional)
    protected $table = 'products';

    // Campos asignables en masa
    protected $fillable = [
        'name',
        'description', 
        'price',
        'stock',
        'category_id',
        'sku',
        'status'
    ];

    // Campos protegidos
    protected $guarded = ['id'];

    // Casting automático de tipos
    protected $casts = [
        'price' => 'decimal:2',
        'is_featured' => 'boolean',
        'metadata' => 'array',
        'published_at' => 'datetime'
    ];

    // Valores por defecto
    protected $attributes = [
        'status' => 'active',
        'stock' => 0
    ];
}
```

### **Ejemplo del Mundo Real: E-commerce**
```php
// ❌ Query Builder (verbose)
$products = DB::table('products')
    ->where('status', 'active')
    ->where('stock', '>', 0)
    ->orderBy('created_at', 'desc')
    ->get();

// ✅ Eloquent (elegante)
$products = Product::where('status', 'active')
    ->where('stock', '>', 0)
    ->latest()
    ->get();

// ✅ Aún mejor con Scope (lo veremos después)
$products = Product::active()->inStock()->latest()->get();
```

**🎯 Ejercicio Práctico Día 1:**
1. Crear modelo User con campos personalizados
2. Crear modelo Product con casting
3. Insertar 10 registros de cada uno

---

## 🔨 **MÓDULO 2: OPERACIONES CRUD MAESTRAS**

### **Create - Crear Registros**
```php
// Método 1: create() - Asignación masiva
$user = User::create([
    'name' => 'Juan Pérez',
    'email' => 'juan@email.com',
    'password' => bcrypt('password123')
]);

// Método 2: new + save()
$product = new Product();
$product->name = 'Laptop HP';
$product->price = 50000;
$product->stock = 10;
$product->save();

// Método 3: firstOrCreate() - Crear si no existe
$category = Category::firstOrCreate(
    ['name' => 'Electronics'],
    ['description' => 'Electronic devices and gadgets']
);

// Método 4: updateOrCreate() - Crear o actualizar
$product = Product::updateOrCreate(
    ['sku' => 'LAPTOP-001'],
    [
        'name' => 'Laptop HP Pavilion',
        'price' => 55000,
        'stock' => 5
    ]
);

// Método 5: Crear con relaciones
$user = User::create(['name' => 'María', 'email' => 'maria@test.com']);
$user->orders()->create([
    'total_amount' => 1500,
    'status' => 'pending'
]);
```

### **Read - Leer Registros**
```php
// Buscar por ID
$user = User::find(1);
$user = User::findOrFail(1); // Lanza excepción si no existe

// Buscar por múltiples IDs
$users = User::find([1, 2, 3]);

// Buscar por atributo
$user = User::where('email', 'juan@email.com')->first();
$user = User::firstWhere('email', 'juan@email.com');

// Obtener o fallar
$product = Product::where('sku', 'LAPTOP-001')->firstOrFail();

// Obtener o crear
$category = Category::firstOrNew(['name' => 'Books']);

// Múltiples condiciones
$products = Product::where('price', '>', 1000)
    ->where('stock', '>', 0)
    ->where('status', 'active')
    ->get();

// Conteo rápido
$activeUsers = User::where('status', 'active')->count();
$totalRevenue = Order::sum('total_amount');
$averagePrice = Product::avg('price');
```

### **Update - Actualizar Registros**
```php
// Actualizar un registro
$user = User::find(1);
$user->name = 'Juan Carlos Pérez';
$user->save();

// Actualización masiva con update()
User::where('city', 'Rosario')
    ->update(['timezone' => 'America/Argentina/Buenos_Aires']);

// Actualizar o crear
$product = Product::updateOrCreate(
    ['sku' => 'MOUSE-001'],
    ['price' => 2500, 'stock' => 20]
);

// Increment y Decrement
$product = Product::find(1);
$product->increment('views'); // views + 1
$product->decrement('stock', 5); // stock - 5
$product->increment('price', 100); // price + 100

// Actualización en masa
Product::whereIn('category_id', [1, 2, 3])
    ->increment('price', 500);
```

### **Delete - Eliminar Registros**
```php
// Eliminar por instancia
$user = User::find(1);
$user->delete();

// Eliminar por ID
User::destroy(1);
User::destroy([1, 2, 3]); // Múltiples IDs

// Eliminación masiva
User::where('last_login', '<', now()->subYear())->delete();

// Soft Delete (eliminación suave)
class User extends Model 
{
    use SoftDeletes;
}

$user = User::find(1);
$user->delete(); // Marca como eliminado, no borra

// Recuperar soft deleted
$user->restore();

// Forzar eliminación real
$user->forceDelete();

// Consultar incluyendo eliminados
$users = User::withTrashed()->get();
$users = User::onlyTrashed()->get(); // Solo eliminados
```

### **Caso Real: Sistema de Inventario**
```php
class InventoryController extends Controller
{
    public function processOrder($orderId)
    {
        DB::transaction(function () use ($orderId) {
            $order = Order::findOrFail($orderId);
            
            foreach ($order->items as $item) {
                $product = Product::findOrFail($item->product_id);
                
                // Verificar stock
                if ($product->stock < $item->quantity) {
                    throw new Exception("Stock insuficiente para {$product->name}");
                }
                
                // Reducir stock
                $product->decrement('stock', $item->quantity);
                
                // Actualizar vendidos
                $product->increment('total_sold', $item->quantity);
                
                // Log del movimiento
                $product->stockMovements()->create([
                    'type' => 'sale',
                    'quantity' => -$item->quantity,
                    'reference' => "Order #{$order->id}",
                    'user_id' => auth()->id()
                ]);
            }
            
            // Actualizar estado del pedido
            $order->update(['status' => 'processing']);
        });
    }
}
```

---

## 🔗 **MÓDULO 3: RELACIONES ELOQUENT MAESTRAS**

### **One-to-One (Uno a Uno)**
```php
// User tiene un Profile
class User extends Model
{
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
}

class Profile extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

// Uso práctico
$user = User::find(1);
$profile = $user->profile; // Lazy loading
$user = User::with('profile')->find(1); // Eager loading

// Crear relación
$user = User::find(1);
$user->profile()->create([
    'bio' => 'Desarrollador Full Stack',
    'website' => 'https://juan.dev'
]);
```

### **One-to-Many (Uno a Muchos)**
```php
// Category tiene muchos Products
class Category extends Model
{
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}

class Product extends Model
{
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}

// Uso avanzado
$category = Category::find(1);
$products = $category->products; // Todos los productos
$activeProducts = $category->products()->where('status', 'active')->get();

// Contar relaciones
$category = Category::withCount('products')->find(1);
echo $category->products_count; // Número de productos

// Filtrar por relación
$categories = Category::has('products')->get(); // Solo categorías con productos
$categories = Category::has('products', '>', 5)->get(); // Con más de 5 productos
```

### **Many-to-Many (Muchos a Muchos)**
```php
// User puede tener muchos Roles, Role puede tener muchos Users
class User extends Model
{
    public function roles()
    {
        return $this->belongsToMany(Role::class)
            ->withPivot('assigned_at', 'assigned_by')
            ->withTimestamps();
    }
}

class Role extends Model
{
    public function users()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('assigned_at', 'assigned_by')
            ->withTimestamps();
    }
}

// Usar la relación
$user = User::find(1);
$user->roles()->attach(2); // Asignar rol ID 2
$user->roles()->attach([1, 2, 3]); // Múltiples roles

// Con datos adicionales en pivot
$user->roles()->attach(2, [
    'assigned_at' => now(),
    'assigned_by' => auth()->id()
]);

// Sincronizar (remover no listados, agregar nuevos)
$user->roles()->sync([1, 2, 3]);

// Verificar si tiene relación
if ($user->roles()->where('name', 'admin')->exists()) {
    // Es administrador
}
```

### **Has-Many-Through (A través de)**
```php
// Country -> Users -> Orders
class Country extends Model
{
    public function orders()
    {
        return $this->hasManyThrough(Order::class, User::class);
    }
}

// Uso
$argentina = Country::where('code', 'AR')->first();
$orders = $argentina->orders; // Todos los pedidos de usuarios argentinos
```

### **Polimórficas (Polymorphic)**
```php
// Comment puede pertenecer a Post o Video
class Comment extends Model
{
    public function commentable()
    {
        return $this->morphTo();
    }
}

class Post extends Model
{
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

class Video extends Model
{
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

// Uso
$post = Post::find(1);
$post->comments()->create(['content' => 'Excelente artículo!']);

$comment = Comment::find(1);
$commentable = $comment->commentable; // Puede ser Post o Video
```

### **Caso Real: Sistema de E-learning**
```php
class Course extends Model
{
    // Un curso tiene muchas lecciones
    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('order');
    }
    
    // Un curso puede tener muchos estudiantes
    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments')
            ->withPivot('enrolled_at', 'progress', 'completed_at')
            ->withTimestamps();
    }
    
    // Instructor del curso
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }
    
    // Comentarios polimórficos
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
    
    // Scope para cursos publicados
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}

// Uso en controlador
public function showCourse($id)
{
    $course = Course::with([
        'lessons' => function($query) {
            $query->where('is_free', true)->orWhere(function($q) {
                $q->whereHas('enrollments', function($enrollment) {
                    $enrollment->where('user_id', auth()->id());
                });
            });
        },
        'instructor.profile',
        'comments.user'
    ])->findOrFail($id);
    
    return view('courses.show', compact('course'));
}
```

---

## 🎯 **MÓDULO 4: QUERY SCOPES - CONSULTAS REUTILIZABLES**

### **Local Scopes**
```php
class Product extends Model
{
    // Scope para productos activos
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
    
    // Scope para productos en stock
    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }
    
    // Scope con parámetros
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }
    
    // Scope para precio entre rangos
    public function scopePriceBetween($query, $min, $max)
    {
        return $query->whereBetween('price', [$min, $max]);
    }
    
    // Scope para productos populares
    public function scopePopular($query, $minViews = 100)
    {
        return $query->where('views', '>=', $minViews)
            ->orderBy('views', 'desc');
    }
    
    // Scope para búsqueda
    public function scopeSearch($query, $term)
    {
        return $query->where(function($q) use ($term) {
            $q->where('name', 'LIKE', "%{$term}%")
              ->orWhere('description', 'LIKE', "%{$term}%")
              ->orWhere('sku', 'LIKE', "%{$term}%");
        });
    }
}

// Uso de scopes (se pueden encadenar)
$products = Product::active()
    ->inStock()
    ->byCategory(1)
    ->priceBetween(1000, 5000)
    ->popular()
    ->search('laptop')
    ->get();
```

### **Global Scopes**
```php
// Scope global para soft deletes automático
class ActiveScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        $builder->where('status', 'active');
    }
}

// Aplicar en el modelo
class Product extends Model
{
    protected static function booted()
    {
        static::addGlobalScope(new ActiveScope);
        
        // O con closure
        static::addGlobalScope('active', function (Builder $builder) {
            $builder->where('status', 'active');
        });
    }
}

// Todas las consultas incluirán automáticamente WHERE status = 'active'
$products = Product::all(); // Solo productos activos

// Omitir global scope
$allProducts = Product::withoutGlobalScope(ActiveScope::class)->get();
$allProducts = Product::withoutGlobalScope('active')->get();
```

### **Caso Real: Sistema de Blog**
```php
class Post extends Model
{
    // Scopes locales
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->where('published_at', '<=', now());
    }
    
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
    
    public function scopeByAuthor($query, $authorId)
    {
        return $query->where('author_id', $authorId);
    }
    
    public function scopeInCategory($query, $categorySlug)
    {
        return $query->whereHas('category', function($q) use ($categorySlug) {
            $q->where('slug', $categorySlug);
        });
    }
    
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}

// Controlador del blog
class BlogController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::published()
            ->when($request->category, function($query, $category) {
                return $query->inCategory($category);
            })
            ->when($request->author, function($query, $author) {
                return $query->byAuthor($author);
            })
            ->when($request->featured, function($query) {
                return $query->featured();
            })
            ->with(['author', 'category', 'tags'])
            ->latest('published_at')
            ->paginate(10);
            
        return view('blog.index', compact('posts'));
    }
}
```

---

## 🔄 **MÓDULO 5: MUTATORS Y ACCESSORS**

### **Accessors - Modificar datos al leer**
```php
class User extends Model
{
    // Accessor para nombre completo
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }
    
    // Accessor para formatear precio
    public function getFormattedPriceAttribute()
    {
        return '$' . number_format($this->price, 2);
    }
    
    // Accessor para avatar con fallback
    public function getAvatarUrlAttribute()
    {
        return $this->avatar 
            ? Storage::url($this->avatar)
            : "https://ui-avatars.com/api/?name=" . urlencode($this->name);
    }
    
    // Accessor para fecha en español
    public function getCreatedAtSpanishAttribute()
    {
        return $this->created_at->locale('es')->diffForHumans();
    }
}

// Uso
$user = User::find(1);
echo $user->full_name; // "Juan Pérez"
echo $user->formatted_price; // "$1,250.50"
echo $user->avatar_url; // URL completa del avatar
echo $user->created_at_spanish; // "hace 2 días"
```

### **Mutators - Modificar datos al escribir**
```php
class User extends Model
{
    // Mutator para encriptar password
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }
    
    // Mutator para limpiar teléfono
    public function setPhoneAttribute($value)
    {
        // Limpiar caracteres no numéricos
        $this->attributes['phone'] = preg_replace('/[^0-9]/', '', $value);
    }
    
    // Mutator para slug automático
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }
    
    // Mutator para normalizar email
    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = strtolower(trim($value));
    }
}

// Uso automático
$user = new User();
$user->password = 'mi-password'; // Se encripta automáticamente
$user->phone = '+54 (341) 123-4567'; // Se guarda como '5434112234567'
$user->name = 'Mi Producto Genial'; // slug se genera automáticamente
$user->email = '  JUAN@EMAIL.COM  '; // Se guarda como 'juan@email.com'
```

### **Casting Avanzado**
```php
class Product extends Model
{
    protected $casts = [
        'price' => 'decimal:2',
        'is_featured' => 'boolean',
        'tags' => 'array',
        'metadata' => 'json',
        'published_at' => 'datetime',
        'settings' => 'collection'
    ];
    
    // Cast personalizado para coordenadas
    protected function casts(): array
    {
        return [
            'coordinates' => Coordinates::class,
        ];
    }
}

// Cast personalizado
class Coordinates implements CastsAttributes
{
    public function get($model, $key, $value, $attributes)
    {
        return new Coordinate(
            $attributes['latitude'],
            $attributes['longitude']
        );
    }
    
    public function set($model, $key, $value, $attributes)
    {
        return [
            'latitude' => $value->latitude,
            'longitude' => $value->longitude,
        ];
    }
}
```

### **Caso Real: Sistema de Usuario Completo**
```php
class User extends Model
{
    protected $fillable = [
        'first_name', 'last_name', 'email', 'password', 
        'phone', 'birth_date', 'preferences'
    ];
    
    protected $casts = [
        'birth_date' => 'date',
        'preferences' => 'array',
        'last_login' => 'datetime'
    ];
    
    // Accessors
    public function getFullNameAttribute()
    {
        return trim("{$this->first_name} {$this->last_name}");
    }
    
    public function getAgeAttribute()
    {
        return $this->birth_date?->age;
    }
    
    public function getInitialsAttribute()
    {
        return strtoupper(substr($this->first_name, 0, 1) . substr($this->last_name, 0, 1));
    }
    
    public function getIsOnlineAttribute()
    {
        return $this->last_login && $this->last_login->diffInMinutes() < 5;
    }
    
    // Mutators
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }
    
    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = strtolower(trim($value));
    }
    
    public function setPhoneAttribute($value)
    {
        // Formato argentino: +54 9 341 123 4567
        $clean = preg_replace('/[^0-9]/', '', $value);
        $this->attributes['phone'] = $clean;
    }
    
    // Scopes
    public function scopeAdults($query)
    {
        return $query->whereDate('birth_date', '<=', now()->subYears(18));
    }
    
    public function scopeFromCity($query, $city)
    {
        return $query->where('city', $city);
    }
}

// Uso en controlador
public function updateProfile(Request $request)
{
    $user = auth()->user();
    
    $user->update($request->validated());
    
    // Los mutators se ejecutan automáticamente
    // Los accessors están disponibles inmediatamente
    
    return response()->json([
        'message' => 'Perfil actualizado',
        'user' => [
            'full_name' => $user->full_name,
            'age' => $user->age,
            'initials' => $user->initials,
            'is_online' => $user->is_online
        ]
    ]);
}
```

---

## ⚡ **MÓDULO 6: EVENTOS Y OBSERVERS**

### **Eventos de Modelo**
```php
class Product extends Model
{
    protected static function booted()
    {
        // Evento: creando (antes de crear)
        static::creating(function ($product) {
            if (empty($product->sku)) {
                $product->sku = 'PRD-' . strtoupper(Str::random(8));
            }
        });
        
        // Evento: creado (después de crear)
        static::created(function ($product) {
            // Log de auditoría
            Log::info("Producto creado: {$product->name}", [
                'product_id' => $product->id,
                'user_id' => auth()->id()
            ]);
            
            // Notificar a administradores
            $admins = User::role('admin')->get();
            Notification::send($admins, new ProductCreated($product));
        });
        
        // Evento: actualizando
        static::updating(function ($product) {
            if ($product->isDirty('price')) {
                $product->price_changed_at = now();
                $product->price_changed_by = auth()->id();
            }
        });
        
        // Evento: actualizado
        static::updated(function ($product) {
            if ($product->wasChanged('status')) {
                // Cache invalidation
                Cache::forget("product.{$product->id}");
                Cache::tags(['products'])->flush();
            }
        });
        
        // Evento: eliminando
        static::deleting(function ($product) {
            // Verificar si tiene pedidos
            if ($product->orderItems()->exists()) {
                throw new Exception('No se puede eliminar un producto con pedidos asociados');
            }
        });
        
        // Evento: eliminado
        static::deleted(function ($product) {
            // Limpiar archivos relacionados
            if ($product->image) {
                Storage::delete($product->image);
            }
        });
    }
}
```

### **Observers - Lógica Organizada**
```php
// php artisan make:observer ProductObserver --model=Product

class ProductObserver
{
    public function creating(Product $product)
    {
        // Generar SKU automático
        if (empty($product->sku)) {
            $product->sku = $this->generateSku();
        }
        
        // Asignar usuario creador
        $product->created_by = auth()->id();
    }
    
    public function created(Product $product)
    {
        // Actualizar índice de búsqueda
        $product->searchable();
        
        // Crear entrada en historial
        $product->history()->create([
            'action' => 'created',
            'user_id' => auth()->id(),
            'changes' => $product->toArray()
        ]);
    }
    
    public function updating(Product $product)
    {
        // Trackear cambios importantes
        if ($product->isDirty('price')) {
            $this->logPriceChange($product);
        }
        
        if ($product->isDirty('stock')) {
            $this->checkStockAlert($product);
        }
    }
    
    public function updated(Product $product)
    {
        // Actualizar búsqueda si cambió info relevante
        if ($product->wasChanged(['name', 'description', 'category_id'])) {
            $product->searchable();
        }
        
        // Invalidar cache
        Cache::tags(['products', "product.{$product->id}"])->flush();
    }
    
    public function deleting(Product $product)
    {
        // Soft delete de relaciones
        $product->reviews()->delete();
        $product->images()->delete();
    }
    
    public function deleted(Product $product)
    {
        // Remover de índice de búsqueda
        $product->unsearchable();
        
        // Limpiar archivos
        $this->cleanupFiles($product);
    }
    
    private function generateSku(): string
    {
        do {
            $sku = 'PRD-' . strtoupper(Str::random(8));
        } while (Product::where('sku', $sku)->exists());
        
        return $sku;
    }
    
    private function logPriceChange(Product $product)
    {
        PriceHistory::create([
            'product_id' => $product->id,
            'old_price' => $product->getOriginal('price'),
            'new_price' => $product->price,
            'changed_by' => auth()->id(),
            'reason' => request('price_change_reason')
        ]);
    }
    
    private function checkStockAlert(Product $product)
    {
        if ($product->stock <= $product->min_stock) {
            // Disparar evento de stock bajo
            event(new LowStockAlert($product));
        }
    }
}

// Registrar el Observer en AppServiceProvider
public function boot()
{
    Product::observe(ProductObserver::class);
}
```

### **Eventos Personalizados**
```php
// php artisan make:event OrderPlaced

class OrderPlaced
{
    use Dispatchable, SerializesModels;
    
    public $order;
    public $user;
    
    public function __construct(Order $order, User $user)
    {
        $this->order = $order;
        $this->user = $user;
    }
}

// php artisan make:listener SendOrderConfirmation --event=OrderPlaced

class SendOrderConfirmation
{
    public function handle(OrderPlaced $event)
    {
        // Enviar email de confirmación
        Mail::to($event->user->email)
            ->send(new OrderConfirmationMail($event->order));
        
        // Notificación push
        $event->user->notify(new OrderPlacedNotification($event->order));
        
        // Actualizar estadísticas
        Cache::increment('orders.total');
        Cache::increment("orders.user.{$event->user->id}");
    }
}

// Uso en el controlador
public function placeOrder(Request $request)
{
    $order = Order::create($request->validated());
    
    // Disparar evento
    event(new OrderPlaced($order, auth()->user()));
    
    return response()->json(['message' => 'Pedido creado exitosamente']);
}
```

---

## 🚀 **MÓDULO 7: OPTIMIZACIÓN Y PERFORMANCE**

### **Eager Loading vs Lazy Loading**
```php
// ❌ Problema N+1: Una consulta por cada autor
$posts = Post::all(); // 1 consulta
foreach ($posts as $post) {
    echo $post->author->name; // N consultas adicionales
}

// ✅ Solución: Eager Loading
$posts = Post::with('author')->get(); // 2 consultas total

// ✅ Eager Loading múltiple
$posts = Post::with(['author', 'category', 'tags'])->get();

// ✅ Eager Loading condicional
$posts = Post::with([
    'author' => function($query) {
        $query->select('id', 'name', 'email');
    },
    'comments' => function($query) {
        $query->where('approved', true)->latest();
    }
])->get();

// ✅ Lazy Eager Loading (cargar después)
$posts = Post::all();
$posts->load('author', 'category');

// ✅ Load Missing (solo cargar si no está cargado)
$posts->loadMissing('author');
```

### **Conteo Eficiente**
```php
// ❌ Ineficiente: Carga todas las relaciones
$categories = Category::all();
foreach ($categories as $category) {
    echo $category->products->count(); // Carga todos los productos
}

// ✅ Eficiente: Solo cuenta
$categories = Category::withCount('products')->get();
foreach ($categories as $category) {
    echo $category->products_count; // Sin cargar productos
}

// ✅ Conteo con condiciones
$categories = Category::withCount([
    'products',
    'products as active_products_count' => function($query) {
        $query->where('status', 'active');
    },
    'products as expensive_products_count' => function($query) {
        $query->where('price', '>', 1000);
    }
])->get();
```

### **Chunking para Grandes Datasets**
```php
// ❌ Problema: Cargar muchos registros en memoria
$users = User::all(); // Podría usar mucha RAM

// ✅ Solución: Chunk
User::chunk(1000, function($users) {
    foreach ($users as $user) {
        // Procesar usuario
        $this->processUser($user);
    }
});

// ✅ Chunk con condiciones
User::where('last_login', '<', now()->subMonths(6))
    ->chunk(500, function($users) {
        foreach ($users as $user) {
            $this->sendReactivationEmail($user);
        }
    });

// ✅ Lazy collections para memoria constante
User::lazy()->each(function($user) {
    $this->processUser($user);
});
```

### **Optimización de Consultas**
```php
// ✅ Solo seleccionar campos necesarios
$users = User::select('id', 'name', 'email')->get();

// ✅ Usar exists() en lugar de count()
if (User::where('email', $email)->exists()) {
    // Más rápido que count() > 0
}

// ✅ Usar pluck() para arrays simples
$userNames = User::pluck('name'); // Array de nombres
$userEmails = User::pluck('email', 'id'); // Array [id => email]

// ✅ whereHas() para filtrar por relaciones
$users = User::whereHas('orders', function($query) {
    $query->where('status', 'completed')
          ->where('total_amount', '>', 1000);
})->get();

// ✅ doesntHave() para usuarios sin pedidos
$usersWithoutOrders = User::doesntHave('orders')->get();
```

### **Caso Real: Dashboard Optimizado**
```php
class DashboardController extends Controller
{
    public function index()
    {
        // Cache para 5 minutos
        $stats = Cache::remember('dashboard.stats', 300, function() {
            return [
                // Conteos eficientes
                'total_users' => User::count(),
                'active_users' => User::where('status', 'active')->count(),
                'new_users_today' => User::whereDate('created_at', today())->count(),
                
                // Agregaciones
                'total_revenue' => Order::sum('total_amount'),
                'monthly_revenue' => Order::whereMonth('created_at', now()->month)->sum('total_amount'),
                'avg_order_value' => Order::avg('total_amount'),
                
                // Top productos (solo campos necesarios)
                'top_products' => Product::select('id', 'name', 'total_sold')
                    ->orderBy('total_sold', 'desc')
                    ->limit(5)
                    ->get(),
                
                // Estadísticas por categoría
                'categories_stats' => Category::withCount([
                    'products',
                    'products as active_products_count' => function($query) {
                        $query->where('status', 'active');
                    }
                ])->get()
            ];
        });
        
        // Datos que cambian frecuentemente (sin cache)
        $recentOrders = Order::with(['user:id,name', 'items.product:id,name'])
            ->latest()
            ->limit(10)
            ->get();
        
        return view('dashboard', compact('stats', 'recentOrders'));
    }
}
```

---

## 🏗️ **MÓDULO 8: PATRONES AVANZADOS Y ARQUITECTURA**

### **Repository Pattern**
```php
// Contrato/Interface
interface ProductRepositoryInterface
{
    public function all();
    public function find($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function search(array $filters);
}

// Implementación
class ProductRepository implements ProductRepositoryInterface
{
    protected $model;
    
    public function __construct(Product $model)
    {
        $this->model = $model;
    }
    
    public function all()
    {
        return $this->model->with(['category', 'images'])->get();
    }
    
    public function find($id)
    {
        return $this->model->with(['category', 'images', 'reviews'])
            ->findOrFail($id);
    }
    
    public function create(array $data)
    {
        return $this->model->create($data);
    }
    
    public function update($id, array $data)
    {
        $product = $this->find($id);
        $product->update($data);
        return $product;
    }
    
    public function delete($id)
    {
        return $this->find($id)->delete();
    }
    
    public function search(array $filters)
    {
        $query = $this->model->newQuery();
        
        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }
        
        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }
        
        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }
        
        if (isset($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('name', 'LIKE', "%{$filters['search']}%")
                  ->orWhere('description', 'LIKE', "%{$filters['search']}%");
            });
        }
        
        return $query->with('category')->paginate(15);
    }
}

// Controlador usando Repository
class ProductController extends Controller
{
    protected $productRepository;
    
    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }
    
    public function index(Request $request)
    {
        $products = $this->productRepository->search($request->all());
        return view('products.index', compact('products'));
    }
    
    public function store(Request $request)
    {
        $product = $this->productRepository->create($request->validated());
        return response()->json($product, 201);
    }
}
```

### **Service Layer Pattern**
```php
class OrderService
{
    protected $orderRepository;
    protected $inventoryService;
    protected $paymentService;
    
    public function __construct(
        OrderRepositoryInterface $orderRepository,
        InventoryService $inventoryService,
        PaymentService $paymentService
    ) {
        $this->orderRepository = $orderRepository;
        $this->inventoryService = $inventoryService;
        $this->paymentService = $paymentService;
    }
    
    public function createOrder(array $orderData): Order
    {
        return DB::transaction(function() use ($orderData) {
            // 1. Crear orden
            $order = $this->orderRepository->create([
                'user_id' => $orderData['user_id'],
                'status' => 'pending',
                'total_amount' => 0
            ]);
            
            $totalAmount = 0;
            
            // 2. Procesar items
            foreach ($orderData['items'] as $itemData) {
                $product = Product::findOrFail($itemData['product_id']);
                
                // Verificar stock
                if (!$this->inventoryService->hasStock($product, $itemData['quantity'])) {
                    throw new InsufficientStockException("Stock insuficiente para {$product->name}");
                }
                
                // Crear item de orden
                $orderItem = $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $itemData['quantity'],
                    'price' => $product->price,
                    'total' => $product->price * $itemData['quantity']
                ]);
                
                $totalAmount += $orderItem->total;
                
                // Reservar stock
                $this->inventoryService->reserveStock($product, $itemData['quantity']);
            }
            
            // 3. Actualizar total
            $order->update(['total_amount' => $totalAmount]);
            
            // 4. Disparar eventos
            event(new OrderCreated($order));
            
            return $order;
        });
    }
    
    public function processPayment(Order $order, array $paymentData): bool
    {
        try {
            $payment = $this->paymentService->charge([
                'amount' => $order->total_amount,
                'token' => $paymentData['token'],
                'description' => "Orden #{$order->id}"
            ]);
            
            if ($payment->successful()) {
                $this->completeOrder($order, $payment);
                return true;
            }
            
            return false;
        } catch (PaymentException $e) {
            $this->failOrder($order, $e->getMessage());
            throw $e;
        }
    }
    
    protected function completeOrder(Order $order, $payment)
    {
        $order->update([
            'status' => 'completed',
            'payment_id' => $payment->id,
            'completed_at' => now()
        ]);
        
        // Confirmar reservas de stock
        foreach ($order->items as $item) {
            $this->inventoryService->confirmReservation($item->product, $item->quantity);
        }
        
        event(new OrderCompleted($order));
    }
}
```

### **Specification Pattern para Consultas Complejas**
```php
// Especificación base
abstract class Specification
{
    abstract public function apply($query);
    
    public function and(Specification $spec)
    {
        return new AndSpecification($this, $spec);
    }
    
    public function or(Specification $spec)
    {
        return new OrSpecification($this, $spec);
    }
}

// Especificaciones concretas
class ActiveProductsSpecification extends Specification
{
    public function apply($query)
    {
        return $query->where('status', 'active');
    }
}

class InStockSpecification extends Specification
{
    public function apply($query)
    {
        return $query->where('stock', '>', 0);
    }
}

class PriceRangeSpecification extends Specification
{
    protected $min, $max;
    
    public function __construct($min, $max)
    {
        $this->min = $min;
        $this->max = $max;
    }
    
    public function apply($query)
    {
        return $query->whereBetween('price', [$this->min, $this->max]);
    }
}

class CategorySpecification extends Specification
{
    protected $categoryId;
    
    public function __construct($categoryId)
    {
        $this->categoryId = $categoryId;
    }
    
    public function apply($query)
    {
        return $query->where('category_id', $this->categoryId);
    }
}

// Especificaciones compuestas
class AndSpecification extends Specification
{
    protected $left, $right;
    
    public function __construct(Specification $left, Specification $right)
    {
        $this->left = $left;
        $this->right = $right;
    }
    
    public function apply($query)
    {
        return $this->right->apply($this->left->apply($query));
    }
}

// Uso
class ProductService
{
    public function getFilteredProducts(array $filters)
    {
        $query = Product::query();
        
        $spec = new ActiveProductsSpecification();
        
        if (isset($filters['in_stock']) && $filters['in_stock']) {
            $spec = $spec->and(new InStockSpecification());
        }
        
        if (isset($filters['min_price']) && isset($filters['max_price'])) {
            $spec = $spec->and(new PriceRangeSpecification(
                $filters['min_price'], 
                $filters['max_price']
            ));
        }
        
        if (isset($filters['category_id'])) {
            $spec = $spec->and(new CategorySpecification($filters['category_id']));
        }
        
        return $spec->apply($query)->get();
    }
}
```

---

## 🎮 **PLAN DE PRÁCTICA DE 30 DÍAS - ELOQUENT**

### **Semana 1: Fundamentos y CRUD (Días 1-7)**
- **Día 1:** Setup y primer modelo
- **Día 2:** CRUD básico con User
- **Día 3:** Casting y fillable/guarded
- **Día 4:** Mutators y Accessors básicos
- **Día 5:** Scopes locales
- **Día 6:** Relaciones One-to-One y One-to-Many
- **Día 7:** Proyecto mini: Blog personal

### **Semana 2: Relaciones y Consultas (Días 8-14)**
- **Día 8:** Many-to-Many y pivot
- **Día 9:** Relaciones polimórficas
- **Día 10:** HasManyThrough
- **Día 11:** Eager Loading y N+1
- **Día 12:** Query optimization
- **Día 13:** Global Scopes
- **Día 14:** Proyecto: E-commerce básico

### **Semana 3: Eventos y Avanzado (Días 15-21)**
- **Día 15:** Model Events
- **Día 16:** Observers
- **Día 17:** Eventos personalizados
- **Día 18:** Chunking y Lazy collections
- **Día 19:** Soft Deletes avanzado
- **Día 20:** Collections y métodos útiles
- **Día 21:** Proyecto: Sistema de usuarios completo

### **Semana 4: Patrones y Arquitectura (Días 22-30)**
- **Día 22:** Repository Pattern
- **Día 23:** Service Layer
- **Día 24:** Specification Pattern
- **Día 25:** Factory Pattern
- **Día 26:** Observer Pattern avanzado
- **Día 27:** Testing con Eloquent
- **Día 28:** Performance y monitoring
- **Día 29-30:** Proyecto final: Sistema completo

---

## 🏆 **PROYECTO FINAL: SISTEMA DE GESTIÓN COMPLETO**

### **Características del Proyecto:**
1. **Gestión de Usuarios** con roles y permisos
2. **E-commerce** con productos, categorías, órdenes
3. **Blog** con posts, categorías, comentarios
4. **Dashboard** con analytics en tiempo real
5. **API RESTful** completa
6. **Sistema de notificaciones**
7. **Auditoría** de cambios
8. **Cache** inteligente

### **Modelos a Implementar:**
```php
// Core
User, Role, Permission
Profile, Address, Phone

// E-commerce
Product, Category, Brand
Order, OrderItem, Cart
Payment, Coupon, Review

// Blog
Post, Comment, Tag
Category (polimórfica)

// Sistema
Notification, Activity
Setting, File, Log
```

### **Funcionalidades Avanzadas:**
```php
// 1. Sistema de permisos dinámico
// 2. Cache inteligente con tags
// 3. Eventos y listeners completos
// 4. Observers para auditoría
// 5. API con paginación y filtros
// 6. Dashboard con métricas real-time
// 7. Sistema de notificaciones
// 8. Búsqueda full-text
```

---

## 🎓 **CERTIFICACIÓN ELOQUENT MASTER**

### **Niveles de Certificación:**

**🥉 Eloquent Developer (Bronce)**
- ✅ CRUD completo
- ✅ 3 tipos de relaciones
- ✅ 5 scopes útiles
- ✅ Mutators/Accessors
- ✅ 1 proyecto funcional

**🥈 Eloquent Expert (Plata)**
- ✅ Todo lo anterior +
- ✅ Eventos y Observers
- ✅ Optimización de consultas
- ✅ Repository Pattern
- ✅ 2 proyectos complejos

**🥇 Eloquent Architect (Oro)**
- ✅ Todo lo anterior +
- ✅ Patrones avanzados
- ✅ Sistema completo
- ✅ Performance optimization
- ✅ Mentoring a otros

### **Portfolio de Certificación:**
1. **GitHub** con todos los proyectos
2. **Documentación** de patrones usados
3. **Benchmarks** de performance
4. **Casos de estudio** reales
5. **Blog posts** sobre Eloquent

---

## 📚 **RECURSOS DE MAESTRÍA**

### **Herramientas Esenciales:**
- **Laravel Telescope:** Monitoring y debugging
- **Laravel Debugbar:** SQL queries en desarrollo
- **Clockwork:** Performance profiling
- **Laravel IDE Helper:** Autocompletado
- **Eloquent Model Generator:** Generar modelos

### **Libros Recomendados:**
- "Laravel: Up & Running" - Matt Stauffer
- "Domain-Driven Design in PHP" - Carlos Buenosvinos
- "Patterns of Enterprise Application Architecture" - Martin Fowler

### **Tips de Performance:**
```php
// 1. Usar índices de base de datos apropiados
// 2. Eager loading para evitar N+1
// 3. Cache inteligente con tags
// 4. Chunking para datasets grandes
// 5. Select solo campos necesarios
// 6. Usar exists() en lugar de count()
// 7. Queue para operaciones pesadas
// 8. Lazy collections para memoria constante
```

---

**¡Felicitaciones! Ahora tenés la guía completa para convertirte en un maestro de Eloquent ORM. Empezá por el Día 1 y transformá tu manera de trabajar con bases de datos en Laravel.**

*¿Listo para crear aplicaciones increíbles con Eloquent? ¡El viaje comienza ahora!* 🚀