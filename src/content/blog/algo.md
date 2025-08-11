---
title: 'Masterclass Práctica: Automatizaciones'
code: 'ai'
description: 'Masterclass Práctica: Automatizaciones n8n para Cualquier Negocio'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Masterclass: Relaciones de Base de Datos en Laravel
## Dominio Completo - De Principiante a Arquitecto de Datos

---

## 🎯 **¿POR QUÉ LAS RELACIONES SON EL CORAZÓN DE LARAVEL?**

### **La Magia de Eloquent ORM:**
```php
// ❌ Sin relaciones (código repetitivo y propenso a errores)
$user = User::find(1);
$posts = Post::where('user_id', $user->id)->get();
foreach ($posts as $post) {
    $comments = Comment::where('post_id', $post->id)->get();
    // N+1 queries problem!
}

// ✅ Con relaciones (elegante y eficiente)
$user = User::with(['posts.comments'])->find(1);
foreach ($user->posts as $post) {
    foreach ($post->comments as $comment) {
        // Solo 3 queries total!
    }
}
```

**Las relaciones transforman:**
- ✅ **Código complejo** → **Sintaxis elegante**
- ✅ **Múltiples queries** → **Optimización automática**
- ✅ **Lógica repetitiva** → **Reutilización inteligente**
- ✅ **Errores de integridad** → **Consistencia garantizada**

---

## 🏗️ **METODOLOGÍA DE APRENDIZAJE: LA PIRÁMIDE RELACIONAL**

```
         🏆 ARQUITECTO RELACIONAL
        /                        \
       /    Relaciones Complejas   \
      /   (Polimórficas, Through)   \
     /______________________________ \
    /                                \
   /        Relaciones Básicas        \
  /    (One-to-One, One-to-Many)      \
 /____________________________________\
               FUNDAMENTOS
        (FK, Migrations, Índices)
```

### **Los 4 Niveles de Maestría:**
1. **🔰 Principiante:** Una tabla, sin relaciones
2. **🥉 Básico:** Relaciones simples (hasOne, hasMany)
3. **🥈 Intermedio:** Relaciones complejas (Many-to-Many, Through)
4. **🥇 Experto:** Relaciones polimórficas y arquitectura avanzada

---

## 📚 **MÓDULO 1: FUNDAMENTOS - PREPARANDO EL TERRENO**

### **1. Diseño de Schema Relacional**
```php
// Migration base para e-commerce argentino
// database/migrations/xxxx_create_base_tables.php

// Usuarios
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->string('telefono')->nullable();
    $table->date('fecha_nacimiento')->nullable();
    $table->enum('tipo', ['cliente', 'vendedor', 'admin'])->default('cliente');
    $table->timestamps();
});

// Provincias (para direcciones argentinas)
Schema::create('provincias', function (Blueprint $table) {
    $table->id();
    $table->string('nombre');
    $table->string('codigo', 2); // BA, SF, CB, etc.
    $table->timestamps();
});

// Ciudades
Schema::create('ciudades', function (Blueprint $table) {
    $table->id();
    $table->string('nombre');
    $table->string('codigo_postal', 10);
    $table->foreignId('provincia_id')->constrained('provincias')->onDelete('cascade');
    $table->timestamps();
    
    // Índice para búsquedas rápidas
    $table->index(['provincia_id', 'nombre']);
});

// Direcciones
Schema::create('direcciones', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('calle');
    $table->string('numero');
    $table->string('piso')->nullable();
    $table->string('departamento')->nullable();
    $table->foreignId('ciudad_id')->constrained()->onDelete('restrict');
    $table->boolean('es_principal')->default(false);
    $table->string('referencia')->nullable();
    $table->decimal('latitud', 10, 8)->nullable();
    $table->decimal('longitud', 11, 8)->nullable();
    $table->timestamps();
    
    // Índices para performance
    $table->index(['user_id', 'es_principal']);
    $table->index(['ciudad_id']);
});

// Categorías (con jerarquía)
Schema::create('categorias', function (Blueprint $table) {
    $table->id();
    $table->string('nombre');
    $table->string('slug')->unique();
    $table->text('descripcion')->nullable();
    $table->string('imagen')->nullable();
    $table->foreignId('parent_id')->nullable()->constrained('categorias')->onDelete('cascade');
    $table->boolean('activa')->default(true);
    $table->integer('orden')->default(0);
    $table->timestamps();
    
    // Índices
    $table->index(['parent_id', 'activa', 'orden']);
    $table->index('slug');
});

// Productos
Schema::create('productos', function (Blueprint $table) {
    $table->id();
    $table->string('nombre');
    $table->string('slug')->unique();
    $table->text('descripcion');
    $table->decimal('precio', 10, 2);
    $table->decimal('precio_oferta', 10, 2)->nullable();
    $table->integer('stock')->default(0);
    $table->string('sku')->unique();
    $table->foreignId('categoria_id')->constrained('categorias')->onDelete('restrict');
    $table->foreignId('vendedor_id')->constrained('users')->onDelete('cascade');
    $table->json('especificaciones')->nullable();
    $table->decimal('peso', 8, 2)->nullable(); // en kg
    $table->json('dimensiones')->nullable(); // {alto, ancho, largo}
    $table->boolean('envio_gratis')->default(false);
    $table->enum('estado', ['borrador', 'activo', 'pausado', 'agotado'])->default('borrador');
    $table->timestamp('publicado_at')->nullable();
    $table->timestamps();
    
    // Índices críticos para performance
    $table->index(['categoria_id', 'estado', 'publicado_at']);
    $table->index(['vendedor_id', 'estado']);
    $table->index(['precio', 'estado']);
    $table->index('sku');
    $table->fullText(['nombre', 'descripcion']); // Para búsqueda
});
```

### **2. Convenciones de Laravel (CRÍTICO)**
```php
// Convenciones que DEBES seguir para que las relaciones funcionen automáticamente

// 1. Nombres de tablas: plural, snake_case
users, productos, categorias, orden_items

// 2. Primary keys: siempre 'id'
$table->id(); // Crea columna 'id' auto-increment

// 3. Foreign keys: {tabla_singular}_id
user_id, producto_id, categoria_id

// 4. Timestamps: created_at, updated_at
$table->timestamps();

// 5. Pivot tables: alfabético
categoria_producto, post_tag, role_user

// 6. Nombres de modelos: singular, PascalCase
User, Producto, Categoria, OrdenItem
```

### **3. Configuración de Modelos Base**
```php
// app/Models/User.php
class User extends Authenticatable
{
    protected $fillable = [
        'name', 'email', 'password', 'telefono', 'fecha_nacimiento', 'tipo'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'fecha_nacimiento' => 'date',
        'password' => 'hashed',
    ];
}

// app/Models/Producto.php
class Producto extends Model
{
    protected $fillable = [
        'nombre', 'slug', 'descripcion', 'precio', 'precio_oferta',
        'stock', 'sku', 'categoria_id', 'vendedor_id', 'especificaciones',
        'peso', 'dimensiones', 'envio_gratis', 'estado'
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'precio_oferta' => 'decimal:2',
        'peso' => 'decimal:2',
        'especificaciones' => 'array',
        'dimensiones' => 'array',
        'envio_gratis' => 'boolean',
        'publicado_at' => 'datetime',
    ];
}
```

**🎯 Ejercicio Día 1:**
1. Crear las migraciones base del e-commerce
2. Configurar modelos con fillable y casts
3. Poblar con datos usando seeders

---

## 🔗 **MÓDULO 2: ONE-TO-ONE - UNA RELACIÓN, INFINITAS POSIBILIDADES**

### **Concepto:** Un registro en tabla A se relaciona con exactamente un registro en tabla B.

### **Caso Real: Usuario y Perfil**
```php
// Migration para perfiles
Schema::create('perfiles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
    $table->string('avatar')->nullable();
    $table->text('biografia')->nullable();
    $table->string('sitio_web')->nullable();
    $table->json('redes_sociales')->nullable();
    $table->boolean('recibir_newsletters')->default(true);
    $table->enum('preferencia_contacto', ['email', 'telefono', 'ambos'])->default('email');
    $table->timestamps();
});

// Modelo User
class User extends Authenticatable
{
    // hasOne: "Este usuario tiene un perfil"
    public function perfil()
    {
        return $this->hasOne(Perfil::class);
    }
    
    // Relación inversa también funciona
    public function profile() // nombre en inglés si prefieres
    {
        return $this->hasOne(Perfil::class);
    }
}

// Modelo Perfil
class Perfil extends Model
{
    protected $table = 'perfiles'; // Especificar nombre de tabla
    
    protected $fillable = [
        'user_id', 'avatar', 'biografia', 'sitio_web', 
        'redes_sociales', 'recibir_newsletters', 'preferencia_contacto'
    ];
    
    protected $casts = [
        'redes_sociales' => 'array',
        'recibir_newsletters' => 'boolean',
    ];
    
    // belongsTo: "Este perfil pertenece a un usuario"
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
```

### **Uso Práctico de One-to-One**
```php
// Crear usuario con perfil
$user = User::create([
    'name' => 'Juan Pérez',
    'email' => 'juan@email.com',
    'password' => bcrypt('password123')
]);

// Método 1: create() - Crea y asocia automáticamente
$perfil = $user->perfil()->create([
    'biografia' => 'Desarrollador Full Stack de Rosario',
    'sitio_web' => 'https://juan.dev',
    'redes_sociales' => [
        'twitter' => '@juanperez',
        'linkedin' => 'juan-perez-dev'
    ]
]);

// Método 2: save() - Para modelo existente
$perfil = new Perfil([
    'biografia' => 'Nueva biografía',
    'avatar' => 'avatars/juan.jpg'
]);
$user->perfil()->save($perfil);

// Método 3: associate() - Para asociar existente
$perfilExistente = Perfil::find(1);
$user->perfil()->associate($perfilExistente);
$user->save();

// Acceder a la relación
$user = User::find(1);
$biografia = $user->perfil->biografia; // Lazy loading
$avatar = $user->perfil?->avatar; // Safe navigation (PHP 8+)

// Verificar si existe la relación
if ($user->perfil) {
    echo "Usuario tiene perfil";
}

// Eager loading para evitar N+1
$users = User::with('perfil')->get();
foreach ($users as $user) {
    echo $user->perfil?->biografia; // Sin consulta adicional
}

// Crear usuario Y perfil en una transacción
DB::transaction(function () {
    $user = User::create([
        'name' => 'María García',
        'email' => 'maria@email.com',
        'password' => bcrypt('password123')
    ]);
    
    $user->perfil()->create([
        'biografia' => 'Diseñadora UX/UI',
        'redes_sociales' => ['instagram' => '@maria_design']
    ]);
});
```

### **One-to-One Avanzado: Múltiples Relaciones**
```php
class User extends Authenticatable
{
    // Usuario tiene un perfil
    public function perfil()
    {
        return $this->hasOne(Perfil::class);
    }
    
    // Usuario tiene una configuración
    public function configuracion()
    {
        return $this->hasOne(UserConfig::class);
    }
    
    // Usuario tiene una suscripción activa
    public function suscripcionActiva()
    {
        return $this->hasOne(Suscripcion::class)
            ->where('estado', 'activa')
            ->latest();
    }
    
    // Usuario tiene una dirección principal
    public function direccionPrincipal()
    {
        return $this->hasOne(Direccion::class)
            ->where('es_principal', true);
    }
}

// Uso con múltiples relaciones
$user = User::with([
    'perfil',
    'configuracion', 
    'suscripcionActiva',
    'direccionPrincipal.ciudad.provincia'
])->find(1);

// Acceso fluido
$provincia = $user->direccionPrincipal?->ciudad?->provincia?->nombre;
$avatar = $user->perfil?->avatar;
$tema = $user->configuracion?->tema ?? 'claro';
```

**🎯 Ejercicio Día 2:**
1. Crear relación User → Perfil
2. Implementar configuración de usuario
3. Sistema de dirección principal

---

## 📊 **MÓDULO 3: ONE-TO-MANY - LA RELACIÓN MÁS COMÚN**

### **Concepto:** Un registro en tabla A se relaciona con muchos registros en tabla B.

### **Caso Real: Usuario y Posts**
```php
// El usuario ya existe, ahora agreguemos posts
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->string('titulo');
    $table->string('slug')->unique();
    $table->text('contenido');
    $table->text('resumen')->nullable();
    $table->string('imagen_destacada')->nullable();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('categoria_id')->constrained('categorias')->onDelete('restrict');
    $table->enum('estado', ['borrador', 'publicado', 'archivado'])->default('borrador');
    $table->timestamp('publicado_at')->nullable();
    $table->integer('vistas')->default(0);
    $table->timestamps();
    
    // Índices para performance
    $table->index(['user_id', 'estado', 'publicado_at']);
    $table->index(['categoria_id', 'estado']);
    $table->index('slug');
});

// Modelo User (actualizado)
class User extends Authenticatable
{
    // hasMany: "Este usuario tiene muchos posts"
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    
    // Posts publicados solamente
    public function postsPublicados()
    {
        return $this->hasMany(Post::class)
            ->where('estado', 'publicado')
            ->whereNotNull('publicado_at')
            ->latest('publicado_at');
    }
    
    // Posts populares (muchas vistas)
    public function postsPopulares()
    {
        return $this->hasMany(Post::class)
            ->where('vistas', '>', 100)
            ->orderBy('vistas', 'desc');
    }
}

// Modelo Post
class Post extends Model
{
    protected $fillable = [
        'titulo', 'slug', 'contenido', 'resumen', 'imagen_destacada',
        'user_id', 'categoria_id', 'estado', 'publicado_at'
    ];
    
    protected $casts = [
        'publicado_at' => 'datetime',
    ];
    
    // belongsTo: "Este post pertenece a un usuario"
    public function autor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    // También pertenece a una categoría
    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }
}
```

### **Operaciones CRUD con One-to-Many**
```php
// CREAR posts para un usuario
$user = User::find(1);

// Método 1: create() - Más común
$post = $user->posts()->create([
    'titulo' => 'Mi primer post en Laravel',
    'slug' => 'mi-primer-post-laravel',
    'contenido' => 'Contenido del post...',
    'categoria_id' => 1,
    'estado' => 'publicado',
    'publicado_at' => now()
]);

// Método 2: save() - Para modelo existente
$post = new Post([
    'titulo' => 'Segundo post',
    'slug' => 'segundo-post',
    'contenido' => 'Más contenido...',
    'categoria_id' => 2
]);
$user->posts()->save($post);

// Método 3: createMany() - Múltiples registros
$user->posts()->createMany([
    [
        'titulo' => 'Post 1',
        'slug' => 'post-1',
        'contenido' => 'Contenido 1...',
        'categoria_id' => 1
    ],
    [
        'titulo' => 'Post 2', 
        'slug' => 'post-2',
        'contenido' => 'Contenido 2...',
        'categoria_id' => 2
    ]
]);

// LEER posts de un usuario
$user = User::find(1);

// Todos los posts (lazy loading)
$posts = $user->posts; // Se ejecuta la query aquí

// Posts con eager loading
$user = User::with('posts')->find(1);
$posts = $user->posts; // Sin query adicional

// Posts con condiciones
$postsPublicados = $user->posts()
    ->where('estado', 'publicado')
    ->latest()
    ->limit(10)
    ->get();

// Contar posts sin cargarlos
$cantidadPosts = $user->posts()->count();
$cantidadPublicados = $user->posts()->where('estado', 'publicado')->count();

// Posts con relaciones anidadas
$user = User::with(['posts.categoria', 'posts.comentarios'])->find(1);

// ACTUALIZAR posts de un usuario
$user = User::find(1);

// Actualizar todos los posts del usuario
$user->posts()->update(['estado' => 'archivado']);

// Actualizar posts específicos
$user->posts()
    ->where('created_at', '<', now()->subMonths(6))
    ->update(['estado' => 'archivado']);

// ELIMINAR posts de un usuario
$user = User::find(1);

// Eliminar posts específicos
$user->posts()->where('estado', 'borrador')->delete();

// Al eliminar usuario, los posts se eliminan automáticamente (cascade)
$user->delete(); // Elimina usuario y todos sus posts
```

### **One-to-Many Complejo: E-commerce**
```php
// Usuario tiene muchos productos
class User extends Authenticatable
{
    public function productos()
    {
        return $this->hasMany(Producto::class, 'vendedor_id');
    }
    
    public function productosActivos()
    {
        return $this->hasMany(Producto::class, 'vendedor_id')
            ->where('estado', 'activo')
            ->where('stock', '>', 0);
    }
    
    public function ordenes()
    {
        return $this->hasMany(Orden::class);
    }
    
    public function direcciones()
    {
        return $this->hasMany(Direccion::class);
    }
}

// Categoría tiene muchos productos
class Categoria extends Model
{
    public function productos()
    {
        return $this->hasMany(Producto::class);
    }
    
    public function productosActivos()
    {
        return $this->hasMany(Producto::class)
            ->where('estado', 'activo');
    }
    
    // Categoría padre tiene muchas subcategorías
    public function subcategorias()
    {
        return $this->hasMany(Categoria::class, 'parent_id');
    }
    
    // Categoría pertenece a una categoría padre
    public function padre()
    {
        return $this->belongsTo(Categoria::class, 'parent_id');
    }
}

// Uso práctico: Dashboard del vendedor
class VendedorController extends Controller
{
    public function dashboard()
    {
        $vendedor = auth()->user();
        
        // Cargar datos del dashboard con eager loading
        $vendedor->load([
            'productos' => function($query) {
                $query->select('id', 'vendedor_id', 'nombre', 'precio', 'stock', 'estado')
                      ->latest()
                      ->limit(5);
            },
            'ordenes' => function($query) {
                $query->select('id', 'user_id', 'total', 'estado', 'created_at')
                      ->latest()
                      ->limit(10);
            }
        ]);
        
        // Estadísticas calculadas
        $estadisticas = [
            'total_productos' => $vendedor->productos()->count(),
            'productos_activos' => $vendedor->productosActivos()->count(),
            'ventas_mes' => $vendedor->ordenes()
                ->whereMonth('created_at', now()->month)
                ->sum('total'),
            'ordenes_pendientes' => $vendedor->ordenes()
                ->where('estado', 'pendiente')
                ->count()
        ];
        
        return view('vendedor.dashboard', compact('vendedor', 'estadisticas'));
    }
}
```

**🎯 Ejercicio Día 3:**
1. Implementar User → Posts → Comentarios
2. Sistema de categorías jerárquicas
3. Dashboard del vendedor con estadísticas

---

## 🔄 **MÓDULO 4: MANY-TO-MANY - RELACIONES COMPLEJAS**

### **Concepto:** Muchos registros en tabla A se relacionan con muchos registros en tabla B.

### **Caso Real: Productos y Etiquetas**
```php
// Migration para etiquetas
Schema::create('etiquetas', function (Blueprint $table) {
    $table->id();
    $table->string('nombre');
    $table->string('slug')->unique();
    $table->string('color', 7)->default('#3490dc'); // Color hex
    $table->text('descripcion')->nullable();
    $table->timestamps();
});

// Migration para tabla pivote (intermedia)
Schema::create('producto_etiqueta', function (Blueprint $table) {
    $table->id();
    $table->foreignId('producto_id')->constrained()->onDelete('cascade');
    $table->foreignId('etiqueta_id')->constrained()->onDelete('cascade');
    $table->timestamp('asignado_at')->default(now());
    $table->foreignId('asignado_por')->nullable()->constrained('users');
    
    // Evitar duplicados
    $table->unique(['producto_id', 'etiqueta_id']);
    
    // Índices para performance
    $table->index(['producto_id', 'etiqueta_id']);
    $table->index(['etiqueta_id', 'producto_id']);
});

// Modelo Producto (actualizado)
class Producto extends Model
{
    // belongsToMany: "Este producto pertenece a muchas etiquetas"
    public function etiquetas()
    {
        return $this->belongsToMany(Etiqueta::class, 'producto_etiqueta')
            ->withPivot('asignado_at', 'asignado_por')
            ->withTimestamps();
    }
    
    // Etiquetas activas solamente
    public function etiquetasActivas()
    {
        return $this->belongsToMany(Etiqueta::class, 'producto_etiqueta')
            ->where('etiquetas.activa', true);
    }
}

// Modelo Etiqueta
class Etiqueta extends Model
{
    protected $table = 'etiquetas';
    
    protected $fillable = ['nombre', 'slug', 'color', 'descripcion'];
    
    // belongsToMany: "Esta etiqueta pertenece a muchos productos"
    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'producto_etiqueta')
            ->withPivot('asignado_at', 'asignado_por')
            ->withTimestamps();
    }
    
    // Solo productos activos
    public function productosActivos()
    {
        return $this->belongsToMany(Producto::class, 'producto_etiqueta')
            ->where('productos.estado', 'activo');
    }
}
```

### **Operaciones Many-to-Many**
```php
$producto = Producto::find(1);
$etiqueta = Etiqueta::find(1);

// ASOCIAR (attach) - Crear relación
$producto->etiquetas()->attach($etiqueta->id);

// Attach con datos adicionales en pivot
$producto->etiquetas()->attach($etiqueta->id, [
    'asignado_por' => auth()->id(),
    'asignado_at' => now()
]);

// Attach múltiples etiquetas
$producto->etiquetas()->attach([1, 2, 3]);

// Attach con diferentes datos de pivot
$producto->etiquetas()->attach([
    1 => ['asignado_por' => 1],
    2 => ['asignado_por' => 2],
    3 => ['asignado_por' => 1]
]);

// DESASOCIAR (detach) - Eliminar relación
$producto->etiquetas()->detach($etiqueta->id);
$producto->etiquetas()->detach([1, 2, 3]); // Múltiples
$producto->etiquetas()->detach(); // Todas las etiquetas

// SINCRONIZAR (sync) - Reemplazar todas las relaciones
$producto->etiquetas()->sync([1, 2, 3]); // Solo estas etiquetas
$producto->etiquetas()->sync([]); // Eliminar todas

// Sync con datos de pivot
$producto->etiquetas()->sync([
    1 => ['asignado_por' => auth()->id()],
    2 => ['asignado_por' => auth()->id()],
]);

// TOGGLE - Alternar relación
$producto->etiquetas()->toggle([1, 2]); // Si existe, la quita; si no existe, la agrega

// SYNC SIN ELIMINAR (syncWithoutDetaching)
$producto->etiquetas()->syncWithoutDetaching([4, 5]); // Agrega 4 y 5, pero no elimina las existentes

// ACTUALIZAR datos del pivot
$producto->etiquetas()->updateExistingPivot($etiqueta->id, [
    'asignado_por' => auth()->id(),
    'asignado_at' => now()
]);
```

### **Consultas Avanzadas Many-to-Many**
```php
// Productos con sus etiquetas
$productos = Producto::with('etiquetas')->get();

// Productos que tienen etiqueta específica
$productosConEtiqueta = Producto::whereHas('etiquetas', function($query) {
    $query->where('slug', 'oferta');
})->get();

// Productos con múltiples etiquetas (AND)
$productos = Producto::whereHas('etiquetas', function($query) {
    $query->where('slug', 'oferta');
})->whereHas('etiquetas', function($query) {
    $query->where('slug', 'destacado');
})->get();

// Productos con cualquiera de estas etiquetas (OR)
$productos = Producto::whereHas('etiquetas', function($query) {
    $query->whereIn('slug', ['oferta', 'destacado', 'nuevo']);
})->get();

// Productos SIN etiqueta específica
$productos = Producto::whereDoesntHave('etiquetas', function($query) {
    $query->where('slug', 'descontinuado');
})->get();

// Contar productos por etiqueta
$etiquetas = Etiqueta::withCount('productos')->get();
foreach ($etiquetas as $etiqueta) {
    echo "{$etiqueta->nombre}: {$etiqueta->productos_count} productos";
}

// Acceder a datos del pivot
$producto = Producto::with('etiquetas')->find(1);
foreach ($producto->etiquetas as $etiqueta) {
    echo "Etiqueta: {$etiqueta->nombre}";
    echo "Asignada: {$etiqueta->pivot->asignado_at}";
    echo "Por usuario: {$etiqueta->pivot->asignado_por}";
}

// Filtrar por datos del pivot
$producto = Producto::with(['etiquetas' => function($query) {
    $query->wherePivot('asignado_por', auth()->id());
}])->find(1);
```

### **Caso Real: Sistema de Roles y Permisos**
```php
// Migrations
Schema::create('roles', function (Blueprint $table) {
    $table->id();
    $table->string('nombre');
    $table->string('slug')->unique();
    $table->text('descripcion')->nullable();
    $table->timestamps();
});

Schema::create('permisos', function (Blueprint $table) {
    $table->id();
    $table->string('nombre');
    $table->string('slug')->unique();
    $table->string('modulo'); // users, products, orders
    $table->text('descripcion')->nullable();
    $table->timestamps();
});

Schema::create('user_roles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('role_id')->constrained()->onDelete('cascade');
    $table->timestamp('asignado_at')->default(now());
    $table->foreignId('asignado_por')->constrained('users');
    $table->unique(['user_id', 'role_id']);
});

Schema::create('role_permisos', function (Blueprint $table) {
    $table->id();
    $table->foreignId('role_id')->constrained()->onDelete('cascade');
    $table->foreignId('permiso_id')->constrained()->onDelete('cascade');
    $table->unique(['role_id', 'permiso_id']);
});

// Modelos
class User extends Authenticatable
{
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles')
            ->withPivot('asignado_at', 'asignado_por')
            ->withTimestamps();
    }
    
    // Permisos indirectos a través de roles
    public function permisos()
    {
        return $this->hasManyThrough(
            Permiso::class,
            Role::class,
            'id', // Foreign key en tabla roles (desde users)
            'id', // Foreign key en tabla permisos
            'id', // Local key en users
            'id'  // Local key en roles
        )->distinct();
    }
    
    // Métodos helpers
    public function hasRole($role)
    {
        return $this->roles()->where('slug', $role)->exists();
    }
    
    public function hasPermission($permiso)
    {
        return $this->roles()->whereHas('permisos', function($query) use ($permiso) {
            $query->where('slug', $permiso);
        })->exists();
    }
    
    public function assignRole($role)
    {
        $roleModel = Role::where('slug', $role)->firstOrFail();
        $this->roles()->syncWithoutDetaching([$roleModel->id => [
            'asignado_por' => auth()->id() ?? 1
        ]]);
    }
}

class Role extends Model
{
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_roles')
            ->withPivot('asignado_at', 'asignado_por')
            ->withTimestamps();
    }
    
    public function permisos()
    {
        return $this->belongsToMany(Permiso::class, 'role_permisos');
    }
}

class Permiso extends Model
{
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_permisos');
    }
}

// Uso práctico
class PermissionMiddleware
{
    public function handle($request, Closure $next, $permission)
    {
        if (!auth()->user()->hasPermission($permission)) {
            abort(403, 'No tienes permiso para realizar esta acción');
        }
        
        return $next($request);
    }
}

// En routes/web.php
Route::middleware(['auth', 'permission:manage_products'])->group(function() {
    Route::resource('productos', ProductController::class);
});
```

**🎯 Ejercicio Día 4:**
1. Sistema de etiquetas para productos
2. Roles y permisos para usuarios
3. Sistema de favoritos (users ↔ productos)

---

## 🔗 **MÓDULO 5: HAS-MANY-THROUGH - RELACIONES INDIRECTAS**

### **Concepto:** Acceder a registros distantes a través de una relación intermedia.

### **Caso Real: País → Ciudades → Usuarios**
```php
// Ya tenemos: Provincia → Ciudad → Usuario
// Queremos: Provincia → Usuarios (a través de ciudades)

class Provincia extends Model
{
    public function ciudades()
    {
        return $this->hasMany(Ciudad::class);
    }
    
    // HasManyThrough: Usuarios de esta provincia
    public function usuarios()
    {
        return $this->hasManyThrough(
            User::class,        // Modelo final que queremos
            Ciudad::class,      // Modelo intermedio
            'provincia_id',     // Foreign key en tabla intermedia (ciudades)
            'ciudad_id',        // Foreign key en tabla final (users)
            'id',               // Local key en esta tabla (provincias)
            'id'                // Local key en tabla intermedia (ciudades)
        );
    }
    
    // Usuarios activos de esta provincia
    public function usuariosActivos()
    {
        return $this->hasManyThrough(User::class, Ciudad::class)
            ->where('users.email_verified_at', '!=', null);
    }
}

// Uso
$santaFe = Provincia::where('codigo', 'SF')->first();
$usuarios = $santaFe->usuarios; // Todos los usuarios de Santa Fe
$cantidadUsuarios = $santaFe->usuarios()->count(); // Sin cargar los usuarios
```

### **Caso Complejo: Vendedor → Productos → Órdenes → Pagos**
```php
// Migrations adicionales
Schema::create('ordenes', function (Blueprint $table) {
    $table->id();
    $table->string('numero')->unique();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->decimal('subtotal', 10, 2);
    $table->decimal('impuestos', 10, 2);
    $table->decimal('envio', 10, 2)->default(0);
    $table->decimal('total', 10, 2);
    $table->enum('estado', ['pendiente', 'confirmada', 'enviada', 'entregada', 'cancelada']);
    $table->timestamps();
});

Schema::create('orden_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('orden_id')->constrained()->onDelete('cascade');
    $table->foreignId('producto_id')->constrained()->onDelete('restrict');
    $table->integer('cantidad');
    $table->decimal('precio_unitario', 10, 2); // Precio al momento de la compra
    $table->decimal('total', 10, 2);
    $table->timestamps();
    
    $table->index(['orden_id', 'producto_id']);
});

Schema::create('pagos', function (Blueprint $table) {
    $table->id();
    $table->foreignId('orden_id')->constrained()->onDelete('cascade');
    $table->string('metodo'); // mercadopago, transferencia, efectivo
    $table->string('referencia_externa')->nullable(); // ID de MercadoPago
    $table->decimal('monto', 10, 2);
    $table->enum('estado', ['pendiente', 'aprobado', 'rechazado', 'cancelado']);
    $table->json('metadata')->nullable(); // Datos adicionales del pago
    $table->timestamps();
});

// Modelos con HasManyThrough
class User extends Authenticatable
{
    // Usuario como VENDEDOR
    public function productos()
    {
        return $this->hasMany(Producto::class, 'vendedor_id');
    }
    
    // Órdenes que incluyen productos de este vendedor (a través de productos)
    public function ordenesComoVendedor()
    {
        return $this->hasManyThrough(
            Orden::class,
            OrdenItem::class,
            'producto_id',  // FK en orden_items que apunta a productos
            'id',           // FK en ordenes que apunta a orden_items.orden_id
            'id',           // Local key en users (vendedor_id en productos)
            'orden_id'      // Local key en productos (para join con orden_items)
        )->distinct();
    }
    
    // Pagos recibidos por ventas de este vendedor
    public function pagosRecibidos()
    {
        return $this->hasManyThrough(
            Pago::class,
            Orden::class,
            'user_id',      // FK en ordenes
            'orden_id',     // FK en pagos
            'id',           // Local key en users
            'id'            // Local key en ordenes
        )->where('pagos.estado', 'aprobado');
    }
    
    // Usuario como COMPRADOR
    public function ordenes()
    {
        return $this->hasMany(Orden::class);
    }
}

class Producto extends Model
{
    public function vendedor()
    {
        return $this->belongsTo(User::class, 'vendedor_id');
    }
    
    public function ordenItems()
    {
        return $this->hasMany(OrdenItem::class);
    }
    
    // Órdenes que incluyen este producto
    public function ordenes()
    {
        return $this->hasManyThrough(
            Orden::class,
            OrdenItem::class,
            'producto_id',  // FK en orden_items
            'id',           // PK en ordenes
            'id',           // PK en productos
            'orden_id'      // FK en orden_items que apunta a ordenes
        );
    }
    
    // Pagos relacionados con este producto
    public function pagos()
    {
        return $this->hasManyThrough(
            Pago::class,
            Orden::class,
            'id',           // Se relaciona a través de orden_items
            'orden_id',     // FK en pagos
            'id',           // PK en productos
            'id'            // PK en ordenes
        )->whereHas('ordenItems', function($query) {
            $query->where('producto_id', $this->id);
        });
    }
}

class Categoria extends Model
{
    public function productos()
    {
        return $this->hasMany(Producto::class);
    }
    
    // Órdenes de productos de esta categoría
    public function ordenes()
    {
        return $this->hasManyThrough(
            Orden::class,
            Producto::class,
            'categoria_id', // FK en productos
            'id',           // Se conecta a través de orden_items
            'id',           // PK en categorias
            'id'            // PK en productos
        )->whereHas('ordenItems', function($query) {
            $query->whereIn('producto_id', $this->productos()->pluck('id'));
        })->distinct();
    }
    
    // Ventas totales de esta categoría
    public function ventasTotales()
    {
        return $this->hasManyThrough(
            OrdenItem::class,
            Producto::class,
            'categoria_id', // FK en productos
            'producto_id',  // FK en orden_items
            'id',           // PK en categorias
            'id'            // PK en productos
        );
    }
}
```

### **Consultas Prácticas con HasManyThrough**
```php
// Dashboard del vendedor
class VendedorDashboard
{
    public function estadisticas($vendedorId)
    {
        $vendedor = User::find($vendedorId);
        
        return [
            // Total de productos
            'productos_total' => $vendedor->productos()->count(),
            
            // Órdenes que incluyen sus productos
            'ordenes_total' => $vendedor->ordenesComoVendedor()->count(),
            
            // Ventas del mes
            'ventas_mes' => $vendedor->ordenesComoVendedor()
                ->whereMonth('created_at', now()->month)
                ->sum('total'),
            
            // Pagos pendientes
            'pagos_pendientes' => $vendedor->pagosRecibidos()
                ->where('estado', 'pendiente')
                ->sum('monto'),
            
            // Productos más vendidos
            'productos_populares' => $vendedor->productos()
                ->withCount(['ordenItems' => function($query) {
                    $query->whereHas('orden', function($q) {
                        $q->where('estado', '!=', 'cancelada');
                    });
                }])
                ->orderBy('orden_items_count', 'desc')
                ->limit(5)
                ->get()
        ];
    }
}

// Reportes por categoría
class CategoriaReports
{
    public function ventasPorCategoria()
    {
        return Categoria::with(['productos'])
            ->withCount(['ventasTotales as total_vendido'])
            ->get()
            ->map(function($categoria) {
                return [
                    'categoria' => $categoria->nombre,
                    'productos' => $categoria->productos_count,
                    'unidades_vendidas' => $categoria->total_vendido,
                    'ingresos' => $categoria->ventasTotales()
                        ->whereHas('orden', function($query) {
                            $query->where('estado', 'entregada');
                        })
                        ->sum('total')
                ];
            });
    }
}

// Análisis geográfico
class AnalisisGeografico
{
    public function ventasPorProvincia()
    {
        return Provincia::withCount(['usuarios as compradores'])
            ->with(['usuarios' => function($query) {
                $query->withCount(['ordenes as ordenes_completadas' => function($q) {
                    $q->where('estado', 'entregada');
                }]);
            }])
            ->get()
            ->map(function($provincia) {
                $totalOrdenes = $provincia->usuarios->sum('ordenes_completadas_count');
                $promedioOrdenesPorUsuario = $provincia->compradores > 0 
                    ? $totalOrdenes / $provincia->compradores 
                    : 0;
                
                return [
                    'provincia' => $provincia->nombre,
                    'compradores' => $provincia->compradores,
                    'ordenes_totales' => $totalOrdenes,
                    'promedio_ordenes_por_usuario' => round($promedioOrdenesPorUsuario, 2)
                ];
            });
    }
}
```

**🎯 Ejercicio Día 5:**
1. Implementar sistema completo de órdenes
2. Dashboard del vendedor con HasManyThrough
3. Reportes de ventas por categoría y ubicación

---

## 🔄 **MÓDULO 6: RELACIONES POLIMÓRFICAS - LA FLEXIBILIDAD MÁXIMA**

### **Concepto:** Una tabla puede relacionarse con múltiples modelos diferentes.

### **Caso Real: Comentarios Polimórficos**
```php
// Los comentarios pueden estar en Posts, Productos, Videos, etc.
Schema::create('comentarios', function (Blueprint $table) {
    $table->id();
    $table->text('contenido');
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    
    // Campos polimórficos
    $table->morphs('comentable'); // Crea comentable_id y comentable_type
    // Equivale a:
    // $table->unsignedBigInteger('comentable_id');
    // $table->string('comentable_type');
    
    $table->boolean('aprobado')->default(false);
    $table->integer('likes')->default(0);
    $table->timestamps();
    
    // Índices para performance
    $table->index(['comentable_type', 'comentable_id']);
    $table->index(['user_id', 'aprobado']);
});

// Modelo Comentario
class Comentario extends Model
{
    protected $table = 'comentarios';
    
    protected $fillable = [
        'contenido', 'user_id', 'comentable_id', 'comentable_type', 'aprobado'
    ];
    
    protected $casts = [
        'aprobado' => 'boolean',
    ];
    
    // Relación polimórfica: este comentario pertenece a...
    public function comentable()
    {
        return $this->morphTo();
    }
    
    // Autor del comentario
    public function autor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

// Modelos que pueden tener comentarios
class Post extends Model
{
    // morphMany: este post tiene muchos comentarios
    public function comentarios()
    {
        return $this->morphMany(Comentario::class, 'comentable');
    }
    
    // Solo comentarios aprobados
    public function comentariosAprobados()
    {
        return $this->morphMany(Comentario::class, 'comentable')
            ->where('aprobado', true)
            ->latest();
    }
}

class Producto extends Model
{
    public function comentarios()
    {
        return $this->morphMany(Comentario::class, 'comentable');
    }
    
    // Comentarios como reseñas del producto
    public function resenas()
    {
        return $this->morphMany(Comentario::class, 'comentable')
            ->where('aprobado', true);
    }
}

class Video extends Model
{
    public function comentarios()
    {
        return $this->morphMany(Comentario::class, 'comentable');
    }
}
```

### **Operaciones con Relaciones Polimórficas**
```php
// CREAR comentarios
$post = Post::find(1);
$producto = Producto::find(1);

// En un post
$comentario = $post->comentarios()->create([
    'contenido' => 'Excelente artículo sobre Laravel!',
    'user_id' => auth()->id(),
    'aprobado' => true
]);

// En un producto
$resena = $producto->comentarios()->create([
    'contenido' => 'Producto de excelente calidad, lo recomiendo.',
    'user_id' => auth()->id(),
    'aprobado' => false // Requiere moderación
]);

// LEER comentarios
$post = Post::with(['comentarios.autor'])->find(1);
foreach ($post->comentarios as $comentario) {
    echo "{$comentario->autor->name}: {$comentario->contenido}";
}

// Desde el comentario, acceder al modelo relacionado
$comentario = Comentario::with('comentable')->find(1);
if ($comentario->comentable_type === 'App\\Models\\Post') {
    echo "Comentario en post: {$comentario->comentable->titulo}";
} elseif ($comentario->comentable_type === 'App\\Models\\Producto') {
    echo "Reseña de producto: {$comentario->comentable->nombre}";
}

// Consultas polimórficas
// Todos los comentarios de posts
$comentariosEnPosts = Comentario::where('comentable_type', Post::class)->get();

// Todos los posts que tienen comentarios
$postsConComentarios = Post::has('comentarios')->get();

// Posts con más de 5 comentarios aprobados
$postsPopulares = Post::whereHas('comentarios', function($query) {
    $query->where('aprobado', true);
}, '>', 5)->get();
```

### **Many-to-Many Polimórfico: Sistema de Etiquetas Universal**
```php
// Migration para etiquetas polimórficas
Schema::create('etiquetables', function (Blueprint $table) {
    $table->id();
    $table->foreignId('etiqueta_id')->constrained()->onDelete('cascade');
    
    // Campos polimórficos
    $table->morphs('etiquetable'); // etiquetable_id y etiquetable_type
    
    $table->timestamp('asignado_at')->default(now());
    $table->foreignId('asignado_por')->nullable()->constrained('users');
    
    // Evitar duplicados
    $table->unique(['etiqueta_id', 'etiquetable_id', 'etiquetable_type'], 'etiqueta_unique');
    
    // Índices
    $table->index(['etiquetable_type', 'etiquetable_id']);
    $table->index(['etiqueta_id', 'etiquetable_type']);
});

// Modelo Etiqueta (actualizado)
class Etiqueta extends Model
{
    // Relación polimórfica many-to-many
    public function posts()
    {
        return $this->morphedByMany(Post::class, 'etiquetable');
    }
    
    public function productos()
    {
        return $this->morphedByMany(Producto::class, 'etiquetable');
    }
    
    public function videos()
    {
        return $this->morphedByMany(Video::class, 'etiquetable');
    }
    
    // Obtener todos los elementos etiquetados
    public function etiquetables()
    {
        return $this->hasMany(Etiquetable::class);
    }
}

// Modelos que pueden ser etiquetados
trait Etiquetable
{
    public function etiquetas()
    {
        return $this->morphToMany(Etiqueta::class, 'etiquetable')
            ->withPivot('asignado_at', 'asignado_por')
            ->withTimestamps();
    }
    
    public function asignarEtiqueta($etiqueta, $asignadoPor = null)
    {
        $etiquetaModel = is_string($etiqueta) 
            ? Etiqueta::where('slug', $etiqueta)->firstOrFail()
            : $etiqueta;
            
        $this->etiquetas()->syncWithoutDetaching([
            $etiquetaModel->id => [
                'asignado_por' => $asignadoPor ?? auth()->id(),
                'asignado_at' => now()
            ]
        ]);
    }
    
    public function removerEtiqueta($etiqueta)
    {
        $etiquetaId = is_string($etiqueta)
            ? Etiqueta::where('slug', $etiqueta)->value('id')
            : $etiqueta->id;
            
        $this->etiquetas()->detach($etiquetaId);
    }
    
    public function tieneEtiqueta($etiqueta)
    {
        return $this->etiquetas()
            ->where('slug', is_string($etiqueta) ? $etiqueta : $etiqueta->slug)
            ->exists();
    }
}

// Usar el trait
class Post extends Model
{
    use Etiquetable;
    
    // Resto del modelo...
}

class Producto extends Model
{
    use Etiquetable;
    
    // Resto del modelo...
}

class Video extends Model
{
    use Etiquetable;
    
    // Resto del modelo...
}

// Uso práctico
$post = Post::find(1);
$post->asignarEtiqueta('tutorial');
$post->asignarEtiqueta('laravel');

$producto = Producto::find(1);
$producto->asignarEtiqueta('oferta');
$producto->asignarEtiqueta('destacado');

// Buscar contenido por etiqueta
$etiquetaLaravel = Etiqueta::where('slug', 'laravel')->first();
$postsLaravel = $etiquetaLaravel->posts;
$productosLaravel = $etiquetaLaravel->productos; // Si hay productos etiquetados como Laravel

// Búsqueda universal por etiqueta
class EtiquetaController extends Controller
{
    public function show($slug)
    {
        $etiqueta = Etiqueta::where('slug', $slug)->firstOrFail();
        
        $resultados = [
            'posts' => $etiqueta->posts()->published()->latest()->get(),
            'productos' => $etiqueta->productos()->active()->latest()->get(),
            'videos' => $etiqueta->videos()->published()->latest()->get(),
        ];
        
        return view('etiquetas.show', compact('etiqueta', 'resultados'));
    }
}
```

### **Caso Avanzado: Sistema de Archivos Polimórfico**
```php
// Archivos que pueden pertenecer a posts, productos, usuarios, etc.
Schema::create('archivos', function (Blueprint $table) {
    $table->id();
    $table->string('nombre_original');
    $table->string('nombre_archivo'); // Nombre en disco
    $table->string('ruta');
    $table->string('tipo_mime');
    $table->unsignedBigInteger('tamano'); // en bytes
    $table->string('extension');
    
    // Polimórfico
    $table->morphs('archivable');
    
    // Metadatos
    $table->json('metadatos')->nullable(); // width, height para imágenes, etc.
    $table->boolean('publico')->default(true);
    $table->foreignId('subido_por')->constrained('users');
    
    $table->timestamps();
    
    $table->index(['archivable_type', 'archivable_id']);
    $table->index(['tipo_mime', 'publico']);
});

class Archivo extends Model
{
    protected $fillable = [
        'nombre_original', 'nombre_archivo', 'ruta', 'tipo_mime',
        'tamano', 'extension', 'metadatos', 'publico', 'subido_por'
    ];
    
    protected $casts = [
        'metadatos' => 'array',
        'publico' => 'boolean',
    ];
    
    public function archivable()
    {
        return $this->morphTo();
    }
    
    public function usuario()
    {
        return $this->belongsTo(User::class, 'subido_por');
    }
    
    // Accessors útiles
    public function getUrlAttribute()
    {
        return Storage::url($this->ruta);
    }
    
    public function getTamanoHumanoAttribute()
    {
        $bytes = $this->tamano;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
    
    public function esImagen()
    {
        return str_starts_with($this->tipo_mime, 'image/');
    }
}

// Trait para modelos que pueden tener archivos
trait TieneArchivos
{
    public function archivos()
    {
        return $this->morphMany(Archivo::class, 'archivable');
    }
    
    public function imagenes()
    {
        return $this->morphMany(Archivo::class, 'archivable')
            ->where('tipo_mime', 'like', 'image/%');
    }
    
    public function documentos()
    {
        return $this->morphMany(Archivo::class, 'archivable')
            ->whereIn('tipo_mime', [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]);
    }
    
    public function subirArchivo($file, $esPublico = true)
    {
        $nombreArchivo = uniqid() . '.' . $file->getClientOriginalExtension();
        $ruta = $file->storeAs('archivos/' . class_basename($this), $nombreArchivo, 'public');
        
        return $this->archivos()->create([
            'nombre_original' => $file->getClientOriginalName(),
            'nombre_archivo' => $nombreArchivo,
            'ruta' => $ruta,
            'tipo_mime' => $file->getMimeType(),
            'tamano' => $file->getSize(),
            'extension' => $file->getClientOriginalExtension(),
            'publico' => $esPublico,
            'subido_por' => auth()->id(),
            'metadatos' => $this->extraerMetadatos($file)
        ]);
    }
    
    private function extraerMetadatos($file)
    {
        $metadatos = [];
        
        if (str_starts_with($file->getMimeType(), 'image/')) {
            $imagenInfo = getimagesize($file->getRealPath());
            $metadatos = [
                'width' => $imagenInfo[0] ?? null,
                'height' => $imagenInfo[1] ?? null,
            ];
        }
        
        return $metadatos;
    }
}

// Usar en modelos
class Post extends Model
{
    use TieneArchivos;
    
    public function imagenDestacada()
    {
        return $this->morphOne(Archivo::class, 'archivable')
            ->where('tipo_mime', 'like', 'image/%')
            ->latest();
    }
}

class Producto extends Model
{
    use TieneArchivos;
    
    public function galeria()
    {
        return $this->imagenes()->orderBy('created_at');
    }
}

class User extends Authenticatable
{
    use TieneArchivos;
    
    public function avatar()
    {
        return $this->morphOne(Archivo::class, 'archivable')
            ->where('tipo_mime', 'like', 'image/%')
            ->latest();
    }
}
```

**🎯 Ejercicio Día 6:**
1. Sistema de comentarios polimórficos completo
2. Etiquetas universales para posts y productos
3. Sistema de archivos polimórficos con subida

---

## ⚡ **MÓDULO 7: EAGER LOADING Y OPTIMIZACIÓN - PERFORMANCE MÁXIMA**

### **El Problema N+1: El Asesino Silencioso de Performance**
```php
// ❌ PROBLEMA N+1 (muy común y peligroso)
$posts = Post::all(); // 1 query

foreach ($posts as $post) {
    echo $post->autor->name; // N queries adicionales!
    echo $post->categoria->nombre; // N queries más!
    
    foreach ($post->comentarios as $comentario) { // N queries más!
        echo $comentario->autor->name; // N × M queries más!
    }
}
// Total: 1 + N + N + N + (N × M) queries ¡DESASTRE!

// ✅ SOLUCIÓN: Eager Loading
$posts = Post::with([
    'autor',
    'categoria', 
    'comentarios.autor'
])->get(); // Solo 4 queries total!

foreach ($posts as $post) {
    echo $post->autor->name; // Sin query adicional
    echo $post->categoria->nombre; // Sin query adicional
    
    foreach ($post->comentarios as $comentario) {
        echo $comentario->autor->name; // Sin query adicional
    }
}
```

### **Estrategias de Eager Loading**
```php
// 1. Eager Loading Básico
$productos = Producto::with('categoria')->get();
$productos = Producto::with(['categoria', 'vendedor'])->get();

// 2. Eager Loading Anidado
$productos = Producto::with([
    'categoria.padre', // Categoría y su categoría padre
    'vendedor.perfil', // Vendedor y su perfil
    'comentarios.autor' // Comentarios y sus autores
])->get();

// 3. Eager Loading Condicional
$productos = Producto::with([
    'comentarios' => function($query) {
        $query->where('aprobado', true)
              ->latest()
              ->limit(5);
    },
    'comentarios.autor:id,name,avatar' // Solo campos específicos
])->get();

// 4. Eager Loading Selectivo
$productos = Producto::with([
    'categoria:id,nombre,slug', // Solo estos campos de categoría
    'vendedor:id,name,email'
])->select('id', 'nombre', 'precio', 'categoria_id', 'vendedor_id')
  ->get();

// 5. Lazy Eager Loading (cargar después)
$productos = Producto::all();
$productos->load(['categoria', 'vendedor']);

// 6. Load Missing (solo si no está cargado)
$productos->loadMissing('comentarios');

// 7. Eager Loading con Agregaciones
$categorias = Categoria::withCount([
    'productos',
    'productos as productos_activos_count' => function($query) {
        $query->where('estado', 'activo');
    }
])->get();

// 8. Eager Loading con Sumas y Promedios
$vendedores = User::withSum('productos', 'precio')
    ->withAvg('productos', 'precio')
    ->withMax('productos', 'precio')
    ->withMin('productos', 'precio')
    ->where('tipo', 'vendedor')
    ->get();

foreach ($vendedores as $vendedor) {
    echo "Total inventario: $" . $vendedor->productos_sum_precio;
    echo "Precio promedio: $" . $vendedor->productos_avg_precio;
}
```

### **Optimización Avanzada de Consultas**
```php
// Ejemplo: Dashboard del vendedor optimizado
class VendedorDashboard
{
    public function datos($vendedorId)
    {
        // Una sola consulta optimizada para todo el dashboard
        $vendedor = User::select('id', 'name', 'email', 'created_at')
            ->with([
                // Productos recientes con información mínima
                'productos' => function($query) {
                    $query->select('id', 'vendedor_id', 'nombre', 'precio', 'stock', 'estado', 'created_at')
                          ->latest()
                          ->limit(5);
                },
                
                // Productos con sus categorías
                'productos.categoria:id,nombre',
                
                // Órdenes recientes
                'ordenes' => function($query) {
                    $query->select('id', 'user_id', 'numero', 'total', 'estado', 'created_at')
                          ->with(['items.producto:id,nombre'])
                          ->latest()
                          ->limit(10);
                }
            ])
            ->withCount([
                'productos',
                'productos as productos_activos' => function($query) {
                    $query->where('estado', 'activo');
                },
                'ordenes',
                'ordenes as ordenes_pendientes' => function($query) {
                    $query->where('estado', 'pendiente');
                }
            ])
            ->withSum([
                'ordenes as ingresos_totales' => function($query) {
                    $query->where('estado', 'completada');
                }
            ], 'total')
            ->findOrFail($vendedorId);
            
        return $vendedor;
    }
}

// Optimización para listados grandes
class ProductoController extends Controller
{
    public function index(Request $request)
    {
        // Solo campos necesarios para el listado
        $productos = Producto::select([
                'id', 'nombre', 'slug', 'precio', 'precio_oferta', 
                'stock', 'categoria_id', 'vendedor_id', 'estado'
            ])
            ->with([
                'categoria:id,nombre,slug',
                'vendedor:id,name'
            ])
            ->when($request->categoria, function($query, $categoria) {
                $query->whereHas('categoria', function($q) use ($categoria) {
                    $q->where('slug', $categoria);
                });
            })
            ->when($request->search, function($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('nombre', 'LIKE', "%{$search}%")
                      ->orWhere('descripcion', 'LIKE', "%{$search}%");
                });
            })
            ->where('estado', 'activo')
            ->latest()
            ->paginate(20);
            
        return view('productos.index', compact('productos'));
    }
}

// Chunk para procesar grandes cantidades
class ProductoProcessor
{
    public function actualizarPrecios()
    {
        // Procesar de a 1000 registros para no sobrecargar memoria
        Producto::with('categoria')
            ->where('estado', 'activo')
            ->chunk(1000, function($productos) {
                foreach ($productos as $producto) {
                    // Lógica de actualización
                    $nuevoPrecio = $this->calcularNuevoPrecio($producto);
                    $producto->update(['precio' => $nuevoPrecio]);
                }
            });
    }
    
    public function generarReporte()
    {
        // Lazy collections para memoria constante
        return Producto::with(['categoria', 'vendedor'])
            ->where('estado', 'activo')
            ->lazy()
            ->map(function($producto) {
                return [
                    'nombre' => $producto->nombre,
                    'categoria' => $producto->categoria->nombre,
                    'vendedor' => $producto->vendedor->name,
                    'precio' => $producto->precio,
                    'stock' => $producto->stock
                ];
            })
            ->filter(function($item) {
                return $item['stock'] > 0;
            });
    }
}
```

### **Índices de Base de Datos para Relaciones**
```php
// En las migrations, agregar índices estratégicos
Schema::table('productos', function (Blueprint $table) {
    // Índices simples
    $table->index('categoria_id');
    $table->index('vendedor_id');
    $table->index('estado');
    
    // Índices compuestos (order matters!)
    $table->index(['categoria_id', 'estado', 'created_at']);
    $table->index(['vendedor_id', 'estado']);
    $table->index(['precio', 'estado']);
    
    // Índice para búsqueda full-text
    $table->fullText(['nombre', 'descripcion']);
});

// Índices para tabla pivot
Schema::table('producto_etiqueta', function (Blueprint $table) {
    $table->index(['producto_id', 'etiqueta_id']);
    $table->index(['etiqueta_id', 'producto_id']); // Para búsquedas inversas
});

// Verificar uso de índices
// php artisan tinker
DB::listen(function ($query) {
    dump($query->sql);
    dump($query->bindings);
    dump($query->time);
});

// Analizar queries con EXPLAIN
$productos = Producto::with('categoria')
    ->where('precio', '>', 1000)
    ->explain();
dump($productos);
```

### **Cache de Relaciones**
```php
// Cache inteligente para relaciones frecuentes
class ProductoService
{
    public function getProductosDestacados()
    {
        return Cache::remember('productos.destacados', 3600, function() {
            return Producto::with(['categoria', 'vendedor'])
                ->where('destacado', true)
                ->where('estado', 'activo')
                ->latest()
                ->limit(10)
                ->get();
        });
    }
    
    public function getCategorias()
    {
        return Cache::remember('categorias.activas', 7200, function() {
            return Categoria::with(['subcategorias' => function($query) {
                    $query->where('activa', true)
                          ->orderBy('orden');
                }])
                ->whereNull('parent_id')
                ->where('activa', true)
                ->orderBy('orden')
                ->get();
        });
    }
    
    public function getProductosRelacionados($productoId)
    {
        $cacheKey = "producto.{$productoId}.relacionados";
        
        return Cache::remember($cacheKey, 1800, function() use ($productoId) {
            $producto = Producto::find($productoId);
            
            return Producto::with(['categoria', 'imagenes'])
                ->where('categoria_id', $producto->categoria_id)
                ->where('id', '!=', $productoId)
                ->where('estado', 'activo')
                ->inRandomOrder()
                ->limit(6)
                ->get();
        });
    }
}

// Invalidar cache automáticamente
class Producto extends Model
{
    protected static function booted()
    {
        static::saved(function ($producto) {
            // Limpiar cache relacionado
            Cache::forget('productos.destacados');
            Cache::forget("producto.{$producto->id}.relacionados");
            
            // Limpiar cache de categoría
            Cache::forget('categorias.activas');
        });
        
        static::deleted(function ($producto) {
            Cache::forget('productos.destacados');
            Cache::forget("producto.{$producto->id}.relacionados");
        });
    }
}
```

**🎯 Ejercicio Día 7:**
1. Optimizar todas las consultas de tu e-commerce
2. Implementar cache para relaciones frecuentes
3. Agregar índices estratégicos
4. Medir y comparar performance

---

## 🔧 **MÓDULO 8: PATRONES AVANZADOS Y BEST PRACTICES**

### **1. Repository Pattern para Relaciones**
```php
// Interface del repositorio
interface ProductoRepositoryInterface
{
    public function findWithRelations($id, array $relations = []);
    public function getByCategoria($categoriaSlug, array $filters = []);
    public function getPopulares($limit = 10);
    public function getBusqueda($termino, array $filters = []);
}

// Implementación del repositorio
class ProductoRepository implements ProductoRepositoryInterface
{
    protected $model;
    
    public function __construct(Producto $model)
    {
        $this->model = $model;
    }
    
    public function findWithRelations($id, array $relations = [])
    {
        return $this->model->with($relations)->findOrFail($id);
    }
    
    public function getByCategoria($categoriaSlug, array $filters = [])
    {
        $query = $this->model->with(['categoria', 'vendedor', 'imagenes'])
            ->whereHas('categoria', function($q) use ($categoriaSlug) {
                $q->where('slug', $categoriaSlug);
            })
            ->where('estado', 'activo');
            
        return $this->applyFilters($query, $filters)->paginate(20);
    }
    
    public function getPopulares($limit = 10)
    {
        return $this->model->with(['categoria', 'vendedor'])
            ->withCount(['ordenItems as ventas_count' => function($query) {
                $query->whereHas('orden', function($q) {
                    $q->where('estado', 'completada');
                });
            }])
            ->where('estado', 'activo')
            ->orderBy('ventas_count', 'desc')
            ->limit($limit)
            ->get();
    }
    
    public function getBusqueda($termino, array $filters = [])
    {
        $query = $this->model->with(['categoria', 'vendedor'])
            ->where(function($q) use ($termino) {
                $q->where('nombre', 'LIKE', "%{$termino}%")
                  ->orWhere('descripcion', 'LIKE', "%{$termino}%")
                  ->orWhereHas('categoria', function($query) use ($termino) {
                      $query->where('nombre', 'LIKE', "%{$termino}%");
                  })
                  ->orWhereHas('etiquetas', function($query) use ($termino) {
                      $query->where('nombre', 'LIKE', "%{$termino}%");
                  });
            })
            ->where('estado', 'activo');
            
        return $this->applyFilters($query, $filters)->paginate(20);
    }
    
    protected function applyFilters($query, array $filters)
    {
        if (isset($filters['precio_min'])) {
            $query->where('precio', '>=', $filters['precio_min']);
        }
        
        if (isset($filters['precio_max'])) {
            $query->where('precio', '<=', $filters['precio_max']);
        }
        
        if (isset($filters['vendedor_id'])) {
            $query->where('vendedor_id', $filters['vendedor_id']);
        }
        
        if (isset($filters['etiquetas'])) {
            $query->whereHas('etiquetas', function($q) use ($filters) {
                $q->whereIn('slug', $filters['etiquetas']);
            });
        }
        
        if (isset($filters['order_by'])) {
            switch ($filters['order_by']) {
                case 'precio_asc':
                    $query->orderBy('precio', 'asc');
                    break;
                case 'precio_desc':
                    $query->orderBy('precio', 'desc');
                    break;
                case 'nombre':
                    $query->orderBy('nombre', 'asc');
                    break;
                default:
                    $query->latest();
            }
        } else {
            $query->latest();
        }
        
        return $query;
    }
}

// Service que usa el repository
class ProductoService
{
    protected $productoRepo;
    
    public function __construct(ProductoRepositoryInterface $productoRepo)
    {
        $this->productoRepo = $productoRepo;
    }
    
    public function getDetalleProducto($id)
    {
        return $this->productoRepo->findWithRelations($id, [
            'categoria.padre',
            'vendedor.perfil',
            'imagenes',
            'comentarios.autor',
            'etiquetas'
        ]);
    }
    
    public function getBusquedaAvanzada($request)
    {
        $termino = $request->get('q');
        $filters = $request->only([
            'precio_min', 'precio_max', 'vendedor_id', 
            'etiquetas', 'order_by'
        ]);
        
        return $this->productoRepo->getBusqueda($termino, $filters);
    }
}
```

### **2. Service Layer para Lógica Compleja**
```php
class OrdenService
{
    protected $productoRepo;
    protected $ordenRepo;
    
    public function __construct(
        ProductoRepositoryInterface $productoRepo,
        OrdenRepositoryInterface $ordenRepo
    ) {
        $this->productoRepo = $productoRepo;
        $this->ordenRepo = $ordenRepo;
    }
    
    public function crearOrden(array $items, User $usuario)
    {
        return DB::transaction(function() use ($items, $usuario) {
            // Crear la orden
            $orden = $this->ordenRepo->create([
                'numero' => $this->generarNumeroOrden(),
                'user_id' => $usuario->id,
                'estado' => 'pendiente',
                'subtotal' => 0,
                'impuestos' => 0,
                'total' => 0
            ]);
            
            $subtotal = 0;
            
            // Procesar cada item
            foreach ($items as $item) {
                $producto = $this->productoRepo->findWithRelations(
                    $item['producto_id'], 
                    ['vendedor']
                );
                
                // Verificar stock
                if ($producto->stock < $item['cantidad']) {
                    throw new InsufficientStockException(
                        "Stock insuficiente para {$producto->nombre}"
                    );
                }
                
                // Crear item de orden
                $itemTotal = $producto->precio * $item['cantidad'];
                
                $orden->items()->create([
                    'producto_id' => $producto->id,
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $producto->precio,
                    'total' => $itemTotal
                ]);
                
                // Actualizar stock
                $producto->decrement('stock', $item['cantidad']);
                
                $subtotal += $itemTotal;
            }
            
            // Calcular impuestos (21% IVA en Argentina)
            $impuestos = $subtotal * 0.21;
            $total = $subtotal + $impuestos;
            
            // Actualizar totales
            $orden->update([
                'subtotal' => $subtotal,
                'impuestos' => $impuestos,
                'total' => $total
            ]);
            
            // Cargar relaciones para la respuesta
            $orden->load([
                'items.producto',
                'usuario'
            ]);
            
            // Disparar evento
            event(new OrdenCreada($orden));
            
            return $orden;
        });
    }
    
    public function confirmarPago(Orden $orden, array $datosPago)
    {
        return DB::transaction(function() use ($orden, $datosPago) {
            // Crear registro de pago
            $pago = $orden->pagos()->create([
                'metodo' => $datosPago['metodo'],
                'referencia_externa' => $datosPago['referencia'] ?? null,
                'monto' => $orden->total,
                'estado' => 'aprobado',
                'metadata' => $datosPago['metadata'] ?? null
            ]);
            
            // Actualizar estado de la orden
            $orden->update([
                'estado' => 'confirmada',
                'confirmada_at' => now()
            ]);
            
            // Notificar a vendedores
            $this->notificarVendedores($orden);
            
            // Disparar evento
            event(new PagoConfirmado($orden, $pago));
            
            return $pago;
        });
    }
    
    protected function notificarVendedores(Orden $orden)
    {
        // Agrupar items por vendedor
        $itemsPorVendedor = $orden->items()
            ->with(['producto.vendedor'])
            ->get()
            ->groupBy('producto.vendedor_id');
            
        foreach ($itemsPorVendedor as $vendedorId => $items) {
            $vendedor = $items->first()->producto->vendedor;
            
            // Enviar notificación
            Notification::send($vendedor, new NuevaVenta($orden, $items));
        }
    }
}
```

### **3. Event-Driven Architecture con Relaciones**
```php
// Eventos del dominio
class OrdenCreada
{
    use Dispatchable, SerializesModels;
    
    public $orden;
    
    public function __construct(Orden $orden)
    {
        $this->orden = $orden;
    }
}

class PagoConfirmado
{
    use Dispatchable, SerializesModels;
    
    public $orden;
    public $pago;
    
    public function __construct(Orden $orden, Pago $pago)
    {
        $this->orden = $orden;
        $this->pago = $pago;
    }
}

// Listeners
class EnviarConfirmacionOrden
{
    public function handle(OrdenCreada $event)
    {
        $orden = $event->orden;
        
        // Cargar relaciones necesarias
        $orden->load([
            'usuario',
            'items.producto.vendedor'
        ]);
        
        // Enviar email al comprador
        Mail::to($orden->usuario->email)
            ->send(new OrdenConfirmacionMail($orden));
    }
}

class ActualizarEstadisticas
{
    public function handle(PagoConfirmado $event)
    {
        $orden = $event->orden;
        
        // Actualizar estadísticas de vendedores
        foreach ($orden->items as $item) {
            $vendedor = $item->producto->vendedor;
            
            // Incrementar contadores
            $vendedor->increment('total_ventas', $item->total);
            $vendedor->increment('productos_vendidos', $item->cantidad);
        }
        
        // Limpiar cache relacionado
        Cache::tags(['estadisticas', 'dashboard'])->flush();
    }
}

class ActualizarPopularidad
{
    public function handle(PagoConfirmado $event)
    {
        $orden = $event->orden;
        
        // Actualizar popularidad de productos
        foreach ($orden->items as $item) {
            $producto = $item->producto;
            
            // Incrementar contador de ventas
            $producto->increment('veces_vendido', $item->cantidad);
            
            // Actualizar score de popularidad
            $nuevoScore = $this->calcularScorePopularidad($producto);
            $producto->update(['score_popularidad' => $nuevoScore]);
        }
    }
    
    protected function calcularScorePopularidad(Producto $producto)
    {
        // Algoritmo simple de popularidad
        $ventas = $producto->veces_vendido;
        $comentarios = $producto->comentarios()->count();
        $rating = $producto->comentarios()->avg('rating') ?? 0;
        $antiguedad = now()->diffInDays($producto->created_at);
        
        // Score que decae con el tiempo
        $factor_tiempo = max(0.1, 1 - ($antiguedad / 365));
        
        return ($ventas * 2 + $comentarios + $rating) * $factor_tiempo;
    }
}
```

### **4. Agregaciones Complejas**
```php
class EstadisticasService
{
    public function reporteVendedor($vendedorId, $fechaInicio, $fechaFin)
    {
        $vendedor = User::with([
            'productos' => function($query) use ($fechaInicio, $fechaFin) {
                $query->withCount(['ordenItems as ventas_periodo' => function($q) use ($fechaInicio, $fechaFin) {
                    $q->whereHas('orden', function($orden) use ($fechaInicio, $fechaFin) {
                        $orden->whereBetween('created_at', [$fechaInicio, $fechaFin])
                              ->where('estado', 'completada');
                    });
                }])
                ->withSum(['ordenItems as ingresos_periodo' => function($q) use ($fechaInicio, $fechaFin) {
                    $q->whereHas('orden', function($orden) use ($fechaInicio, $fechaFin) {
                        $orden->whereBetween('created_at', [$fechaInicio, $fechaFin])
                              ->where('estado', 'completada');
                    });
                }], 'total');
            }
        ])->findOrFail($vendedorId);
        
        // Estadísticas generales
        $estadisticas = [
            'productos_totales' => $vendedor->productos->count(),
            'productos_vendidos' => $vendedor->productos->sum('ventas_periodo'),
            'ingresos_totales' => $vendedor->productos->sum('ingresos_periodo'),
            'promedio_por_producto' => $vendedor->productos->avg('ingresos_periodo'),
        ];
        
        // Top productos
        $topProductos = $vendedor->productos
            ->sortByDesc('ventas_periodo')
            ->take(5)
            ->values();
            
        // Ventas por día
        $ventasPorDia = DB::table('ordenes')
            ->join('orden_items', 'ordenes.id', '=', 'orden_items.orden_id')
            ->join('productos', 'orden_items.producto_id', '=', 'productos.id')
            ->where('productos.vendedor_id', $vendedorId)
            ->whereBetween('ordenes.created_at', [$fechaInicio, $fechaFin])
            ->where('ordenes.estado', 'completada')
            ->selectRaw('DATE(ordenes.created_at) as fecha')
            ->selectRaw('COUNT(orden_items.id) as ventas')
            ->selectRaw('SUM(orden_items.total) as ingresos')
            ->groupBy('fecha')
            ->orderBy('fecha')
            ->get();
            
        return [
            'vendedor' => $vendedor,
            'estadisticas' => $estadisticas,
            'top_productos' => $topProductos,
            'ventas_por_dia' => $ventasPorDia
        ];
    }
    
    public function reporteGeneral($fechaInicio, $fechaFin)
    {
        return [
            'ventas_por_categoria' => $this->ventasPorCategoria($fechaInicio, $fechaFin),
            'top_vendedores' => $this->topVendedores($fechaInicio, $fechaFin),
            'productos_populares' => $this->productosPopulares($fechaInicio, $fechaFin),
            'metricas_generales' => $this->metricasGenerales($fechaInicio, $fechaFin)
        ];
    }
    
    protected function ventasPorCategoria($fechaInicio, $fechaFin)
    {
        return DB::table('categorias')
            ->leftJoin('productos', 'categorias.id', '=', 'productos.categoria_id')
            ->leftJoin('orden_items', 'productos.id', '=', 'orden_items.producto_id')
            ->leftJoin('ordenes', 'orden_items.orden_id', '=', 'ordenes.id')
            ->whereBetween('ordenes.created_at', [$fechaInicio, $fechaFin])
            ->where('ordenes.estado', 'completada')
            ->selectRaw('categorias.nombre as categoria')
            ->selectRaw('COUNT(orden_items.id) as total_ventas')
            ->selectRaw('SUM(orden_items.total) as ingresos')
            ->selectRaw('AVG(orden_items.precio_unitario) as precio_promedio')
            ->groupBy('categorias.id', 'categorias.nombre')
            ->orderByDesc('ingresos')
            ->get();
    }
    
    protected function topVendedores($fechaInicio, $fechaFin)
    {
        return User::whereHas('productos.ordenItems.orden', function($query) use ($fechaInicio, $fechaFin) {
                $query->whereBetween('created_at', [$fechaInicio, $fechaFin])
                      ->where('estado', 'completada');
            })
            ->withCount(['productos as ventas_totales' => function($query) use ($fechaInicio, $fechaFin) {
                $query->withWhereHas('ordenItems.orden', function($q) use ($fechaInicio, $fechaFin) {
                    $q->whereBetween('created_at', [$fechaInicio, $fechaFin])
                      ->where('estado', 'completada');
                });
            }])
            ->withSum(['productos as ingresos_totales' => function($query) use ($fechaInicio, $fechaFin) {
                $query->withWhereHas('ordenItems.orden', function($q) use ($fechaInicio, $fechaFin) {
                    $q->whereBetween('created_at', [$fechaInicio, $fechaFin])
                      ->where('estado', 'completada');
                });
            }], 'total')
            ->orderByDesc('ingresos_totales')
            ->limit(10)
            ->get();
    }
}
```

**🎯 Ejercicio Final:**
1. Implementar Repository pattern completo
2. Service layer para órdenes
3. Sistema de eventos para estadísticas
4. Dashboard con agregaciones complejas

---

## 🎓 **EVALUACIÓN FINAL: ¿ERES UN MAESTRO DE RELACIONES?**

### **Checklist del Experto en Relaciones Laravel**

#### **🔰 Nivel Principiante (Must