---
title: 'ELOQUENT RELATIONSHIPS & WITH()'
code: 'laravel'
description: 'Guía Completa: Cómo Dominar las Relaciones'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# 🎯 ELOQUENT RELATIONSHIPS & WITH() 
## Guía Completa: Cómo Dominar las Relaciones

---

## 🤔 **¿POR QUÉ ES IMPORTANTE EL with()?**

### **El Problema N+1 (Sin with)**
```php
// ❌ PROBLEMA N+1 - GENERA MÚLTIPLES CONSULTAS
$posts = Post::all(); // 1 consulta

foreach ($posts as $post) {
    echo $post->user->name;     // +1 consulta por cada post
    echo $post->category->name; // +1 consulta por cada post
}

// Si tienes 100 posts = 1 + 100 + 100 = 201 consultas! 😱
```

### **La Solución con with() (Eager Loading)**
```php
// ✅ SOLUCIÓN - SOLO 3 CONSULTAS
$posts = Post::with(['user', 'category'])->get(); // 3 consultas total

foreach ($posts as $post) {
    echo $post->user->name;     // Sin consultas adicionales
    echo $post->category->name; // Sin consultas adicionales
}

// 100 posts = 3 consultas totales! 🚀
```

---

## ⚠️ **REGLA FUNDAMENTAL: ¡NO PUEDES PONER CUALQUIER TABLA!**

### **🚫 ERROR COMÚN: Pensar que with() = Tablas de la BD**

```php
// ❌ ESTO NO FUNCIONA - No son relaciones definidas
Post::with(['users'])->get();      // Error: users no es una relación de Post
Post::with(['categories'])->get(); // Error: categories no es una relación de Post  
Post::with(['products'])->get();   // Error: products no existe como relación
Post::with(['orders'])->get();     // Error: orders no tiene relación con Post

// 🤔 ¿Por qué no funciona?
// Porque with() NO busca tablas, busca MÉTODOS DE RELACIÓN en tu modelo
```

### **✅ REGLA DE ORO: with() Solo Acepta Relaciones Definidas**

```php
// En app/Models/Post.php
class Post extends Model 
{
    // ✅ ESTAS son las únicas relaciones que puedes usar en with()
    public function user() {          // Puedes usar: 'user'
        return $this->belongsTo(User::class);
    }
    
    public function category() {      // Puedes usar: 'category'  
        return $this->belongsTo(Category::class);
    }
    
    public function tags() {          // Puedes usar: 'tags'
        return $this->belongsToMany(Tag::class);
    }
    
    // ❌ NO HAY relación definida para 'products' o 'orders'
    // Por eso no puedes usarlas en with()
}

// ✅ CORRECTO: Solo usar relaciones que existen
Post::with(['user', 'category', 'tags'])->get(); // ✅ Funciona

// ❌ ERROR: Usar nombres que no son relaciones
Post::with(['products', 'users', 'orders'])->get(); // ❌ Falla
```

### **🔍 DIFERENCIA CLAVE: Tabla vs Relación**

| Concepto | Qué Es | Ejemplo | Se Usa En |
|----------|--------|---------|-----------|
| **Tabla** | Nombre en la base de datos | `users`, `posts`, `categories` | Consultas SQL directas |
| **Relación** | Método en tu modelo | `user()`, `category()`, `tags()` | `with()` de Eloquent |

```php
// 📊 EN LA BASE DE DATOS tienes estas tablas:
// - users
// - posts  
// - categories
// - tags
// - post_tag (pivot)

// 🔗 EN TU MODELO Post tienes estas relaciones:
class Post extends Model {
    public function user()     {}  // Relación: 'user' (no 'users')
    public function category() {}  // Relación: 'category' (no 'categories') 
    public function tags()     {}  // Relación: 'tags' (sí coincide)
}

// ✅ CORRECTO: Usar nombres de RELACIONES
Post::with(['user', 'category', 'tags'])->get();

// ❌ ERROR: Usar nombres de TABLAS  
Post::with(['users', 'categories', 'posts'])->get();
```

### **🎯 CÓMO SABER QUÉ PUEDES PONER EN with()**

#### **Método 1: Lista las Relaciones de tu Modelo**
```php
// Revisa SOLO los métodos que retornan relaciones
class Post extends Model {
    // ✅ Relación - puedes usar 'user'
    public function user() {
        return $this->belongsTo(User::class);
    }
    
    // ✅ Relación - puedes usar 'comments'  
    public function comments() {
        return $this->hasMany(Comment::class);
    }
    
    // ❌ NO es relación - es un scope
    public function scopePublished($query) {
        return $query->where('status', 'published');
    }
    
    // ❌ NO es relación - es un accessor
    public function getFormattedDateAttribute() {
        return $this->created_at->format('Y-m-d');
    }
}

// ✅ PUEDES USAR: 'user', 'comments'
// ❌ NO PUEDES USAR: 'published', 'formattedDate'
```

#### **Método 2: Comando Tinker para Verificar**
```php
php artisan tinker

// Verificar si una relación existe
>>> $post = App\Models\Post::first()
>>> method_exists($post, 'user')     // true = puedes usar 'user'
>>> method_exists($post, 'users')    // false = NO puedes usar 'users'
>>> method_exists($post, 'category') // true = puedes usar 'category'
>>> method_exists($post, 'products') // false = NO puedes usar 'products'

// Ver todas las relaciones disponibles
>>> collect(get_class_methods($post))
    ->filter(fn($method) => 
        !str_starts_with($method, 'get') && 
        !str_starts_with($method, 'set') &&
        !str_starts_with($method, 'scope')
    )->values()
```

### **💡 ¿QUÉ HACER SI NECESITAS UNA TABLA SIN RELACIÓN?**

#### **Opción 1: Crear la Relación (Recomendado)**
```php
// Si necesitas conectar Post con Product
class Post extends Model {
    // Crear nueva relación
    public function relatedProducts() {
        return $this->belongsToMany(Product::class, 'post_product');
    }
}

// Crear migración para tabla pivot
php artisan make:migration create_post_product_table

// Ahora SÍ puedes usar:
Post::with(['relatedProducts'])->get();
```

#### **Opción 2: Consulta Separada (Si no hay relación lógica)**
```php
// Si NO hay relación lógica entre Post y Product
$posts = Post::with(['user', 'category'])->get();
$products = Product::where('featured', true)->get();

// Manejar por separado en tu controlador/servicio
return [
    'posts' => $posts,
    'products' => $products
];
```

#### **Opción 3: Join Manual (Para casos específicos)**
```php
// Si necesitas datos de tabla sin relación formal
$posts = Post::join('some_table', 'posts.some_id', '=', 'some_table.id')
             ->select('posts.*', 'some_table.some_field')
             ->with(['user', 'category'])
             ->get();
```

### **🚨 ERRORES TÍPICOS Y SUS SOLUCIONES**

#### **Error 1: Usar Nombre de Tabla en lugar de Relación**
```php
// ❌ ERROR
Post::with(['users'])->get();
// Error: "Call to undefined relationship [users] on model [Post]"

// ✅ SOLUCIÓN: Usar el nombre de la relación
Post::with(['user'])->get(); // 'user' es el método en el modelo
```

#### **Error 2: Inventar Relaciones que No Existen**
```php
// ❌ ERROR
User::with(['posts', 'orders', 'products'])->get();
// Si User no tiene relación 'orders' o 'products' = Error

// ✅ SOLUCIÓN: Solo usar relaciones que existen
User::with(['posts'])->get(); // Solo si exists public function posts()
```

#### **Error 3: Confundir Plural/Singular**
```php
// En tu modelo User:
public function posts() {          // ✅ Método 'posts' (plural)
    return $this->hasMany(Post::class);
}

public function profile() {        // ✅ Método 'profile' (singular)  
    return $this->hasOne(Profile::class);
}

// ❌ ERRORES COMUNES
User::with(['post'])->get();      // Error: 'post' no existe, es 'posts'
User::with(['profiles'])->get();  // Error: 'profiles' no existe, es 'profile'

// ✅ CORRECTO
User::with(['posts', 'profile'])->get();
```

### **🔍 VERIFICACIÓN RÁPIDA: ¿Puedo Usar Esta Relación?**

```php
// Pasos para verificar:

// 1. ¿Existe el método en mi modelo?
class Post extends Model {
    public function user() { ... }     // ✅ Sí = puedes usar 'user'
    // ¿Hay método products()? ❌ No = NO puedes usar 'products'
}

// 2. ¿El método retorna una relación?
public function user() {
    return $this->belongsTo(User::class); // ✅ Sí = es relación válida
}

public function getStatusAttribute() {
    return 'active'; // ❌ No = es accessor, no relación
}

// 3. Probar en tinker
>>> Post::with(['user'])->first()     // ✅ Funciona = relación válida
>>> Post::with(['products'])->first() // ❌ Error = relación no existe
```

---

## 🔍 **CÓMO IDENTIFICAR LAS RELACIONES DISPONIBLES**

### **Método 1: Revisar el Modelo**
```php
// app/Models/Post.php
class Post extends Model
{
    // ✅ Estas son las relaciones disponibles para with()
    public function user()     // Relación: 'user'
    public function category() // Relación: 'category'  
    public function tags()     // Relación: 'tags'
    public function comments() // Relación: 'comments'
    
    // ❌ Esto NO es una relación (es un scope)
    public function scopePublished($query) // No usar en with()
}
```

### **Método 2: Artisan Command para Ver Relaciones**
```bash
# Crear comando personalizado para inspeccionar modelo
php artisan make:command ShowModelRelations

# O usar tinker para explorar
php artisan tinker
>>> $post = App\Models\Post::first()
>>> $post->getRelations() // Ver relaciones cargadas
>>> collect(get_class_methods($post))->filter(function($method) {
    return method_exists($post, $method) && 
           !in_array($method, ['getRelations', 'getDirty', 'getChanges']);
})
```

### **Método 3: Usar Laravel Debugbar**
```bash
# Instalar debugbar para ver consultas
composer require barryvdh/laravel-debugbar --dev
```

---

## 📚 **SINTAXIS COMPLETA DEL with()**

### **1. Cargar Relaciones Básicas**
```php
// Cargar una relación
Post::with('user')->get();

// Cargar múltiples relaciones
Post::with(['user', 'category', 'tags'])->get();

// Sintaxis alternativa (mismo resultado)
Post::with('user', 'category', 'tags')->get();
```

### **2. Seleccionar Campos Específicos**
```php
// ✅ SINTAXIS CORRECTA: 'relacion:campo1,campo2'
Post::with(['user:id,name,email', 'category:id,name'])->get();

// ⚠️ IMPORTANTE: Siempre incluir la clave foránea
// Si Post tiene 'user_id', debes incluir 'id' en user
Post::with(['user:id,name'])->get(); // ✅ Incluye 'id'

// ❌ ERROR COMÚN: No incluir la clave primaria
Post::with(['user:name,email'])->get(); // ❌ Falta 'id'
```

### **3. Relaciones Anidadas (Nested)**
```php
// Cargar comentarios con sus usuarios
Post::with(['comments.user'])->get();

// Múltiples niveles
Post::with(['comments.user.profile'])->get();

// Con selección de campos en cada nivel
Post::with([
    'comments:id,post_id,user_id,content',
    'comments.user:id,name,avatar'
])->get();
```

### **4. Relaciones Condicionales**
```php
// Cargar solo comentarios aprobados
Post::with(['comments' => function($query) {
    $query->where('is_approved', true)
          ->orderBy('created_at', 'desc');
}])->get();

// Combinar condiciones con selección de campos
Post::with([
    'comments' => function($query) {
        $query->select('id', 'post_id', 'user_id', 'content')
              ->where('is_approved', true)
              ->with('user:id,name,avatar');
    }
])->get();
```

---

## 🔗 **GUÍA POR TIPO DE RELACIÓN**

### **ONE-TO-MANY (hasMany/belongsTo)**

```php
// Modelo User
class User extends Model 
{
    public function posts() {
        return $this->hasMany(Post::class);
    }
}

// Modelo Post  
class Post extends Model
{
    public function user() {
        return $this->belongsTo(User::class);
    }
}

// ✅ USAR EN with()
// Desde User (hasMany)
User::with(['posts:id,user_id,title,slug'])->get();

// Desde Post (belongsTo)  
Post::with(['user:id,name,email'])->get();

// ❌ CLAVES FORÁNEAS REQUERIDAS
User::with(['posts:title,slug'])->get();        // ❌ Falta 'id' y 'user_id'
Post::with(['user:name,email'])->get();         // ❌ Falta 'id'
```

### **MANY-TO-MANY (belongsToMany)**

```php
// Modelo Post
class Post extends Model
{
    public function tags() {
        return $this->belongsToMany(Tag::class);
    }
}

// Modelo Tag
class Tag extends Model  
{
    public function posts() {
        return $this->belongsToMany(Post::class);
    }
}

// ✅ USAR EN with()
Post::with(['tags:id,name,slug'])->get();
Tag::with(['posts:id,title,slug'])->get();

// ✅ Con datos de tabla pivot
Post::with(['tags:id,name'])->get();
// Acceder: $post->tags->first()->pivot->created_at

// ✅ Con campos específicos del pivot
class Post extends Model {
    public function tags() {
        return $this->belongsToMany(Tag::class)
                   ->withPivot('order', 'featured')
                   ->withTimestamps();
    }
}
```

### **SELF-RELATIONSHIP (Autoreferencia)**

```php
// Modelo Comment (comentarios anidados)
class Comment extends Model
{
    public function parent() {
        return $this->belongsTo(Comment::class, 'parent_id');
    }
    
    public function children() {
        return $this->hasMany(Comment::class, 'parent_id');
    }
}

// ✅ USAR EN with()
// Cargar comentarios padre con sus hijos
Comment::with(['children:id,parent_id,content,user_id'])->get();

// Cargar comentario con su padre
Comment::with(['parent:id,content,user_id'])->get();

// Anidación múltiple (cuidado con la profundidad)
Comment::with(['children.children'])->get();
```

---

## 🎯 **EJEMPLOS PRÁCTICOS PASO A PASO**

### **Ejemplo 1: Blog Post Completo**

```php
// 📄 Caso: Mostrar un post con toda su información

// ❌ FORMA INCORRECTA (Múltiples consultas)
$post = Post::find(1);
$author = $post->user;              // +1 consulta
$category = $post->category;        // +1 consulta  
$tags = $post->tags;               // +1 consulta
$comments = $post->comments;        // +1 consulta
foreach ($comments as $comment) {
    $commentUser = $comment->user;  // +1 consulta por comentario
}

// ✅ FORMA CORRECTA (1 sola consulta optimizada)
$post = Post::with([
    'user:id,name,email,avatar',
    'category:id,name,slug,color',
    'tags:id,name,slug',
    'comments:id,post_id,user_id,content,created_at',
    'comments.user:id,name,avatar'
])->find(1);

// Acceder a los datos (sin consultas adicionales)
echo $post->user->name;                    // ✅ Ya cargado
echo $post->category->name;                // ✅ Ya cargado  
foreach ($post->tags as $tag) {           // ✅ Ya cargado
    echo $tag->name;
}
foreach ($post->comments as $comment) {    // ✅ Ya cargado
    echo $comment->user->name;             // ✅ Ya cargado
}
```

### **Ejemplo 2: Lista de Posts para Homepage**

```php
// 📄 Caso: Mostrar lista de posts en homepage

$posts = Post::with([
    // Autor (solo datos necesarios para mostrar)
    'user:id,name,avatar',
    
    // Categoría (solo para mostrar badge)  
    'category:id,name,color',
    
    // Tags (solo nombres para mostrar)
    'tags:id,name',
    
    // NO cargar comentarios completos, solo contar
])->withCount([
    'comments',              // Cuenta total
    'comments as approved_comments_count' => function($query) {
        $query->where('is_approved', true);
    }
])->published()
  ->latest()
  ->paginate(12);

// En la vista/API puedes acceder:
foreach ($posts as $post) {
    echo $post->user->name;                 // ✅ Sin consulta adicional
    echo $post->category->name;             // ✅ Sin consulta adicional
    echo $post->comments_count;             // ✅ Ya calculado
    echo $post->approved_comments_count;    // ✅ Ya calculado
}
```

### **Ejemplo 3: Comentarios Anidados**

```php
// 📄 Caso: Sistema de comentarios con respuestas

$post = Post::with([
    // Comentarios padre (sin parent_id)
    'comments' => function($query) {
        $query->whereNull('parent_id')
              ->where('is_approved', true)
              ->orderBy('created_at', 'desc')
              ->select('id', 'post_id', 'user_id', 'content', 'created_at', 'parent_id');
    },
    
    // Usuario de cada comentario padre
    'comments.user:id,name,avatar',
    
    // Respuestas de cada comentario (hijos)
    'comments.children' => function($query) {
        $query->where('is_approved', true)
              ->orderBy('created_at', 'asc')
              ->select('id', 'post_id', 'user_id', 'content', 'created_at', 'parent_id');
    },
    
    // Usuario de cada respuesta
    'comments.children.user:id,name,avatar'
    
])->find(1);

// Estructura resultante:
/*
$post->comments (comentarios padre)
├── $comment->user (autor del comentario)
└── $comment->children (respuestas)
    └── $reply->user (autor de la respuesta)
*/
```

---

## 🛠️ **HERRAMIENTAS PARA DEBUGGEAR**

### **1. Ver las Consultas SQL Generadas**

```php
// Activar log de consultas
\DB::enableQueryLog();

// Tu consulta con with()
$posts = Post::with(['user:id,name', 'category:id,name'])->get();

// Ver las consultas ejecutadas
dd(\DB::getQueryLog());

// Resultado típico:
/*
[
    {
        "query": "select * from posts",
        "bindings": [],
        "time": 1.23
    },
    {
        "query": "select id, name from users where id in (1, 2, 3, 4, 5)",
        "bindings": [],
        "time": 0.45
    },
    {
        "query": "select id, name from categories where id in (1, 2, 3)",
        "bindings": [],
        "time": 0.32
    }
]
*/
```

### **2. Usar toSql() para Ver Query**

```php
// Ver la consulta principal (sin ejecutar)
$query = Post::with(['user:id,name'])->toSql();
echo $query; // "select * from posts"

// Para ver las consultas de relaciones, usa explain
Post::with(['user:id,name'])->explain();
```

### **3. Comando Artisan para Inspeccionar Modelos**

```php
// Crear comando personalizado
// app/Console/Commands/InspectModel.php

<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use ReflectionClass;
use ReflectionMethod;

class InspectModel extends Command
{
    protected $signature = 'model:inspect {model}';
    protected $description = 'Inspect model relationships';

    public function handle()
    {
        $modelClass = 'App\\Models\\' . $this->argument('model');
        
        if (!class_exists($modelClass)) {
            $this->error("Model {$modelClass} not found");
            return;
        }

        $reflection = new ReflectionClass($modelClass);
        $methods = $reflection->getMethods(ReflectionMethod::IS_PUBLIC);
        
        $relationships = [];
        
        foreach ($methods as $method) {
            if ($method->class === $modelClass && 
                !in_array($method->name, ['getRelations', 'relationResolver'])) {
                
                // Detectar si es una relación leyendo el código
                $source = file_get_contents($method->getFileName());
                $methodSource = $this->extractMethodSource($source, $method);
                
                if (preg_match('/return\s+\$this->(hasMany|belongsTo|hasOne|belongsToMany|morphTo|morphMany)/', $methodSource)) {
                    $relationships[] = $method->name;
                }
            }
        }
        
        $this->info("Relationships found in {$modelClass}:");
        foreach ($relationships as $relation) {
            $this->line("  - {$relation}");
        }
        
        // Ejemplo de uso
        $this->info("\nExample usage:");
        $modelName = class_basename($modelClass);
        $this->line("{$modelName}::with(['" . implode("', '", $relationships) . "'])->get();");
    }
    
    private function extractMethodSource($source, $method) {
        // Implementación simplificada para extraer código del método
        $lines = explode("\n", $source);
        $startLine = $method->getStartLine() - 1;
        $endLine = $method->getEndLine() - 1;
        
        return implode("\n", array_slice($lines, $startLine, $endLine - $startLine + 1));
    }
}
```

### **4. Usar Laravel Debugbar**

```bash
# Instalar
composer require barryvdh/laravel-debugbar --dev

# En .env
APP_DEBUG=true

# Verás en el navegador:
# - Número de consultas ejecutadas
# - Tiempo de cada consulta  
# - Consultas duplicadas
# - Problemas N+1
```

---

## ⚠️ **ERRORES COMUNES Y SOLUCIONES**

### **Error 1: Olvidar Claves Foráneas**

```php
// ❌ ERROR: No incluir claves necesarias
Post::with(['user:name,email'])->get();

// Error: "Trying to get property 'name' of non-object"
// Causa: Falta 'id' en la selección de user

// ✅ SOLUCIÓN: Siempre incluir claves primarias y foráneas
Post::with(['user:id,name,email'])->get();

// 📝 REGLA: Si Post tiene 'user_id', siempre incluir 'id' en user
```

### **Error 2: Sintaxis Incorrecta en Campos**

```php
// ❌ ERROR: Espacios en la sintaxis
Post::with(['user: id, name, email'])->get(); // Espacios después de ':'

// ✅ CORRECTO: Sin espacios
Post::with(['user:id,name,email'])->get();
```

### **Error 3: Confundir Relaciones con Scopes**

```php
// En el modelo Post
public function scopePublished($query) {        // ❌ Esto es un SCOPE
    return $query->where('status', 'published');
}

public function user() {                        // ✅ Esto es una RELACIÓN
    return $this->belongsTo(User::class);
}

// ❌ ERROR: Usar scope en with()
Post::with(['published'])->get(); // No funciona

// ✅ CORRECTO: Usar relación en with()
Post::with(['user'])->get();      // Funciona
```

### **Error 4: Relaciones Anidadas Incorrectas**

```php
// ❌ ERROR: Sintaxis incorrecta para anidadas
Post::with(['comments', 'comments->user'])->get(); // Flecha incorrecta

// ✅ CORRECTO: Usar punto para anidar
Post::with(['comments.user'])->get();
```

---

## 🚀 **TÉCNICAS AVANZADAS**

### **1. with() Condicional**

```php
// Cargar relaciones según condiciones
$posts = Post::with([
    'user:id,name,avatar',
    'category:id,name,color'
])
->when($includeComments, function($query) {
    $query->with(['comments.user:id,name']);
})
->when($includeTags, function($query) {
    $query->with(['tags:id,name']);
})
->get();
```

### **2. withCount() para Optimizar**

```php
// En lugar de cargar todas las relaciones para contar
Post::with(['comments'])->get(); // Carga TODOS los comentarios

// Usar withCount() para solo obtener el número
Post::withCount(['comments'])->get(); // Solo cuenta, no carga datos

// Combinar ambas técnicas
Post::with(['user:id,name'])
    ->withCount([
        'comments',
        'comments as approved_comments_count' => function($query) {
            $query->where('is_approved', true);
        }
    ])
    ->get();
```

### **3. Lazy Loading Específico**

```php
// Si ya tienes el modelo, cargar relaciones después
$post = Post::find(1);

// Cargar relación específica después
$post->load(['user:id,name', 'category:id,name']);

// Cargar solo si no está ya cargada
$post->loadMissing(['comments.user']);
```

### **4. Scopes Personalizados para with()**

```php
// En el modelo Post
public function scopeWithAuthorAndCategory($query)
{
    return $query->with([
        'user:id,name,avatar,bio',
        'category:id,name,slug,color'
    ]);
}

public function scopeWithBasicRelations($query)
{
    return $query->with([
        'user:id,name,avatar',
        'category:id,name',
    ])->withCount(['comments', 'views']);
}

// Uso
Post::withAuthorAndCategory()->get();
Post::withBasicRelations()->published()->latest()->get();
```

---

## 🎯 **CHECKLIST DE BUENAS PRÁCTICAS**

### ✅ **Antes de Usar with()**
- [ ] ¿Realmente necesito estos datos?
- [ ] ¿Estoy incluyendo las claves foráneas necesarias?
- [ ] ¿Puedo usar withCount() en lugar de cargar toda la relación?
- [ ] ¿Es más eficiente lazy loading en este caso?

### ✅ **Al Escribir with()**
- [ ] Incluir siempre la clave primaria (id)
- [ ] Incluir claves foráneas necesarias
- [ ] No usar espacios en la sintaxis (:)
- [ ] Verificar que las relaciones existen en el modelo

### ✅ **Optimización**
- [ ] Usar select solo los campos necesarios
- [ ] Combinar with() y withCount() inteligentemente
- [ ] Evitar cargar relaciones anidadas muy profundas
- [ ] Testear performance con Laravel Debugbar

### ✅ **Testing**
- [ ] Verificar número de consultas con enableQueryLog()
- [ ] Probar con datasets grandes
- [ ] Medir tiempo de respuesta
- [ ] Verificar que no hay problemas N+1

---

## 📖 **REFERENCIA RÁPIDA**

```php
// SINTAXIS BÁSICA
Model::with('relation')->get()
Model::with(['rel1', 'rel2'])->get()
Model::with('rel1', 'rel2')->get()

// CON CAMPOS ESPECÍFICOS  
Model::with(['relation:id,field1,field2'])->get()

// ANIDADAS
Model::with(['rel1.rel2'])->get()
Model::with(['rel1.rel2:id,field'])->get()

// CONDICIONALES
Model::with(['rel' => function($q) {
    $q->where('field', 'value')->orderBy('field');
}])->get()

// CONTADORES
Model::withCount('relation')->get()
Model::withCount(['rel as custom_count' => function($q) {
    $q->where('condition', true);
}])->get()

// COMBINADAS
Model::with(['rel1:id,name'])
     ->withCount('rel2')
     ->where('active', true)
     ->get()
```

---

¡Con esta guía dominarás completamente las relaciones de Eloquent y el uso del `with()`! 🚀

**Próximo paso recomendado:** Practicar con tu propio proyecto implementando estas técnicas paso a paso.