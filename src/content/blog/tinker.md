---
title: 'Masterclass: Tinker'
code: 'tinker'
description: 'Tinker ejemplos'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# 🚀 Master Class: Laravel Tinker - De Básico a Intermedio Alto

## 📚 Índice
1. [¿Qué es Tinker?](#que-es-tinker)
2. [Instalación y Configuración](#instalacion)
3. [Conceptos Básicos](#conceptos-basicos)
4. [Trabajando con Modelos](#trabajando-con-modelos)
5. [Queries y Eloquent](#queries-y-eloquent)
6. [Relaciones entre Modelos](#relaciones)
7. [Factories y Seeders](#factories-y-seeders)
8. [Debugging y Testing](#debugging)
9. [Técnicas Avanzadas](#tecnicas-avanzadas)
10. [Casos de Uso Reales](#casos-de-uso)
11. [Tips y Trucos](#tips-y-trucos)

---

## 🎯 ¿Qué es Tinker? {#que-es-tinker}

### La Analogía del Taller

Imagina que Laravel es como un taller mecánico completo. Tinker es tu **banco de pruebas interactivo** donde puedes:
- Probar piezas individualmente antes de instalarlas en el auto
- Diagnosticar problemas sin desarmar todo el motor
- Experimentar con herramientas sin miedo a romper nada

**Tinker** es un REPL (Read-Eval-Print Loop) - una consola interactiva que te permite ejecutar código PHP y Laravel en tiempo real, línea por línea.

### ¿Por qué es importante?

```
❌ Sin Tinker:
1. Escribir código
2. Crear una ruta de prueba
3. Abrir el navegador
4. Probar
5. Ver error
6. Volver al paso 1

✅ Con Tinker:
1. Abrir Tinker
2. Probar código inmediatamente
3. Ver resultado instantáneo
4. Iterar rápidamente
```

---

## 🔧 Instalación y Configuración {#instalacion}

### Verificar Instalación

Laravel 6+ incluye Tinker por defecto. Verifica con:

```bash
php artisan tinker --version
```

### Si no está instalado:

```bash
composer require laravel/tinker
```

### Iniciar Tinker

```bash
php artisan tinker
```

Verás algo como:
```
Psy Shell v0.11.x (PHP 8.x.x — cli)
>>>
```

### Salir de Tinker

```php
exit
# o simplemente Ctrl + C
```

---

## 🌱 Conceptos Básicos {#conceptos-basicos}

### 1. Ejecutar PHP Básico

Tinker es PHP interactivo. Puedes ejecutar cualquier código PHP:

```php
>>> 2 + 2
=> 4

>>> $nombre = "Juan"
=> "Juan"

>>> echo "Hola, {$nombre}"
Hola, Juan
=> null

>>> $usuarios = ['Ana', 'Pedro', 'María']
=> [
     "Ana",
     "Pedro",
     "María",
   ]

>>> count($usuarios)
=> 3
```

**💡 Nota:** El símbolo `=>` muestra el resultado de la última expresión.

### 2. Variables Persistentes

Las variables persisten durante la sesión:

```php
>>> $total = 100
=> 100

>>> $descuento = 0.15
=> 0.15

>>> $precio_final = $total - ($total * $descuento)
=> 85.0

>>> echo "Precio final: $" . $precio_final
Precio final: $85
```

### 3. Usar Clases de Laravel

Puedes acceder a cualquier clase de Laravel:

```php
>>> use Illuminate\Support\Str;

>>> Str::slug('Hola Mundo 2024')
=> "hola-mundo-2024"

>>> Str::random(10)
=> "xK9mPqWzAb"

>>> Str::upper('laravel')
=> "LARAVEL"
```

### 4. Helpers de Laravel

```php
>>> now()
=> Illuminate\Support\Carbon @1729584000 {
     date: 2024-10-22 12:00:00.0 UTC (+00:00)
   }

>>> now()->format('d/m/Y')
=> "22/10/2024"

>>> bcrypt('mi-password')
=> "$2y$10$..."

>>> config('app.name')
=> "Laravel"

>>> env('APP_ENV')
=> "local"
```

---

## 🗃️ Trabajando con Modelos {#trabajando-con-modelos}

### Analogía: Los Modelos son como Formularios

Un **Modelo** es como un formulario inteligente que sabe cómo guardar, buscar y actualizar información en una base de datos específica.

### 1. Acceder a un Modelo

Supongamos que tienes un modelo `User`:

```php
>>> App\Models\User::count()
=> 25

>>> App\Models\User::first()
=> App\Models\User {
     id: 1,
     name: "Juan Pérez",
     email: "juan@example.com",
     email_verified_at: "2024-10-22 12:00:00",
     created_at: "2024-10-22 12:00:00",
     updated_at: "2024-10-22 12:00:00",
   }
```

### 2. Alias de Namespace (simplifica tu vida)

```php
>>> use App\Models\User;

>>> User::count()
=> 25
```

### 3. Crear Registros

**Método 1: Create (asignación masiva)**

```php
>>> User::create([
...   'name' => 'María García',
...   'email' => 'maria@example.com',
...   'password' => bcrypt('password123')
... ])
=> App\Models\User {
     name: "María García",
     email: "maria@example.com",
     updated_at: "2024-10-22 12:00:00",
     created_at: "2024-10-22 12:00:00",
     id: 26,
   }
```

**Método 2: New + Save**

```php
>>> $user = new User;
>>> $user->name = 'Pedro López';
>>> $user->email = 'pedro@example.com';
>>> $user->password = bcrypt('password123');
>>> $user->save()
=> true
```

### 4. Leer Registros

```php
// Obtener todos
>>> User::all()

// Obtener por ID
>>> User::find(1)
=> App\Models\User {...}

// Buscar por atributo
>>> User::where('email', 'juan@example.com')->first()

// Buscar o fallar (lanza excepción si no existe)
>>> User::findOrFail(999)
// Error: ModelNotFoundException

// Buscar con múltiples condiciones
>>> User::where('name', 'like', '%Juan%')
...      ->where('email_verified_at', '!=', null)
...      ->get()
```

### 5. Actualizar Registros

```php
>>> $user = User::find(1)
>>> $user->name = "Juan Carlos Pérez"
>>> $user->save()
=> true

// O de forma masiva
>>> User::where('id', 1)->update(['name' => 'Juan Carlos Pérez'])
=> 1
```

### 6. Eliminar Registros

```php
>>> $user = User::find(26)
>>> $user->delete()
=> true

// O directamente
>>> User::destroy(26)
=> 1

// Eliminar múltiples
>>> User::destroy([26, 27, 28])
=> 3

// Soft Delete (si está configurado)
>>> $user->delete()  // Marca como eliminado
>>> User::withTrashed()->find(26)  // Ver eliminados
>>> $user->restore()  // Restaurar
```

---

## 🔍 Queries y Eloquent {#queries-y-eloquent}

### Analogía: Eloquent es como un Traductor

Tú hablas en PHP, Eloquent traduce a SQL, la base de datos ejecuta, y Eloquent te devuelve objetos PHP.

### 1. Queries Básicas

```php
// SELECT * FROM users
>>> User::all()

// SELECT * FROM users WHERE id = 1
>>> User::find(1)

// SELECT * FROM users WHERE email = '...'
>>> User::where('email', 'juan@example.com')->first()

// SELECT * FROM users LIMIT 10
>>> User::take(10)->get()

// SELECT name, email FROM users
>>> User::select('name', 'email')->get()
```

### 2. Condicionales

```php
// WHERE
>>> User::where('name', 'Juan')->get()

// WHERE con operadores
>>> User::where('id', '>', 10)->get()
>>> User::where('email', 'like', '%@gmail.com')->get()

// WHERE múltiples (AND)
>>> User::where('name', 'Juan')
...      ->where('email_verified_at', '!=', null)
...      ->get()

// OR WHERE
>>> User::where('name', 'Juan')
...      ->orWhere('name', 'Pedro')
...      ->get()

// WHERE IN
>>> User::whereIn('id', [1, 2, 3])->get()

// WHERE BETWEEN
>>> User::whereBetween('id', [1, 50])->get()

// WHERE NULL
>>> User::whereNull('email_verified_at')->get()
>>> User::whereNotNull('email_verified_at')->get()
```

### 3. Ordenamiento

```php
>>> User::orderBy('name', 'asc')->get()
>>> User::orderBy('created_at', 'desc')->get()
>>> User::latest()->get()  // orderBy('created_at', 'desc')
>>> User::oldest()->get()  // orderBy('created_at', 'asc')
```

### 4. Paginación

```php
>>> User::paginate(15)
=> Illuminate\Pagination\LengthAwarePaginator {...}

>>> User::simplePaginate(15)

// Ver datos de la paginación
>>> $users = User::paginate(10)
>>> $users->total()
=> 25
>>> $users->currentPage()
=> 1
```

### 5. Agregaciones

```php
>>> User::count()
=> 25

>>> User::max('id')
=> 25

>>> User::min('id')
=> 1

>>> User::avg('id')
=> 13.0

>>> User::sum('id')
=> 325
```

### 6. Chunks (procesar grandes cantidades)

```php
>>> User::chunk(100, function($users) {
...     foreach($users as $user) {
...         echo $user->name . "\n";
...     }
... })
```

---

## 🔗 Relaciones entre Modelos {#relaciones}

### Analogía: Las Relaciones son como Contactos en tu Celular

Un usuario puede tener muchos posts (como tener varios chats), un post pertenece a un usuario (como un mensaje tiene un remitente).

### Estructura de Ejemplo

```
User (usuarios)
  - id
  - name
  - email

Post (posts)
  - id
  - user_id
  - title
  - content

Comment (comentarios)
  - id
  - post_id
  - user_id
  - content
```

### 1. Relación One-to-Many (Uno a Muchos)

```php
// Un usuario tiene muchos posts
>>> $user = User::find(1)
>>> $user->posts
=> Illuminate\Database\Eloquent\Collection {
     all: [
       App\Models\Post {...},
       App\Models\Post {...},
     ]
   }

>>> $user->posts->count()
=> 2

>>> $user->posts->first()->title
=> "Mi primer post"
```

### 2. Relación Inversa (Belongs To)

```php
// Un post pertenece a un usuario
>>> $post = Post::find(1)
>>> $post->user
=> App\Models\User {
     id: 1,
     name: "Juan Pérez",
     ...
   }

>>> $post->user->name
=> "Juan Pérez"
```

### 3. Crear Relaciones

```php
// Crear post para un usuario
>>> $user = User::find(1)
>>> $post = $user->posts()->create([
...   'title' => 'Nuevo Post desde Tinker',
...   'content' => 'Este es el contenido...'
... ])

// O asignar manualmente
>>> $post = new Post
>>> $post->title = 'Otro Post'
>>> $post->content = 'Contenido...'
>>> $post->user_id = 1
>>> $post->save()

// O usar associate
>>> $post = new Post
>>> $post->title = 'Post con Associate'
>>> $post->content = 'Contenido...'
>>> $post->user()->associate($user)
>>> $post->save()
```

### 4. Eager Loading (evitar N+1)

```php
// ❌ Malo: N+1 problem
>>> $posts = Post::all()
>>> foreach($posts as $post) {
...   echo $post->user->name;  // Query por cada post!
... }

// ✅ Bueno: Eager Loading
>>> $posts = Post::with('user')->get()
>>> foreach($posts as $post) {
...   echo $post->user->name;  // Sin queries adicionales
... }

// Ver queries ejecutadas
>>> DB::enableQueryLog()
>>> Post::with('user')->get()
>>> DB::getQueryLog()
```

### 5. Relaciones Many-to-Many

Ejemplo: Users y Roles con tabla pivot `role_user`

```php
>>> $user = User::find(1)

// Ver roles del usuario
>>> $user->roles
=> Illuminate\Database\Eloquent\Collection {...}

// Adjuntar rol
>>> $user->roles()->attach(2)

// Adjuntar con datos pivot
>>> $user->roles()->attach(2, ['expires_at' => now()->addYear()])

// Sincronizar (reemplaza todos)
>>> $user->roles()->sync([1, 2, 3])

// Desadjuntar
>>> $user->roles()->detach(2)

// Alternar
>>> $user->roles()->toggle([1, 2])
```

---

## 🏭 Factories y Seeders {#factories-y-seeders}

### Analogía: Factories son Máquinas de Fabricación

Como una máquina que produce juguetes idénticos, los Factories crean datos de prueba con estructura consistente.

### 1. Usar Factories Existentes

```php
// Crear un usuario
>>> User::factory()->create()
=> App\Models\User {
     name: "Dr. Alexis Walsh",
     email: "toy.hudson@example.net",
     ...
   }

// Crear múltiples
>>> User::factory()->count(10)->create()

// Crear con atributos específicos
>>> User::factory()->create([
...   'name' => 'Usuario de Prueba',
...   'email' => 'prueba@test.com'
... ])
```

### 2. Estados de Factory

```php
// Crear usuario no verificado
>>> User::factory()->unverified()->create()

// Crear admin (si existe el estado)
>>> User::factory()->admin()->create()
```

### 3. Crear con Relaciones

```php
// Usuario con 5 posts
>>> User::factory()
...      ->has(Post::factory()->count(5))
...      ->create()

// Post con usuario
>>> Post::factory()
...      ->for(User::factory())
...      ->create()

// Post para usuario existente
>>> $user = User::find(1)
>>> Post::factory()->count(3)->for($user)->create()
```

### 4. Caso Real: Preparar Datos de Prueba

```php
// Crear escenario completo de prueba
>>> $users = User::factory()->count(5)->create()
>>> 
>>> foreach($users as $user) {
...   Post::factory()
...     ->count(rand(1, 5))
...     ->for($user)
...     ->create();
... }
```

---

## 🐛 Debugging y Testing {#debugging}

### 1. Inspeccionar Queries SQL

```php
>>> DB::enableQueryLog()
>>> User::where('email', 'juan@example.com')->first()
>>> DB::getQueryLog()
=> [
     [
       "query" => "select * from `users` where `email` = ? limit 1",
       "bindings" => ["juan@example.com"],
       "time" => 0.5
     ]
   ]
```

### 2. Ver SQL sin Ejecutar

```php
>>> User::where('id', '>', 10)->toSql()
=> "select * from `users` where `id` > ?"

>>> User::where('id', '>', 10)->toRawSql()
=> "select * from `users` where `id` > 10"
```

### 3. Dump y DD (Die & Dump)

```php
>>> User::where('id', 1)->dump()->first()
// Muestra información de debug

>>> User::where('id', 1)->dd()
// Dump y termina ejecución
```

### 4. Probar Validaciones

```php
>>> $validator = Validator::make(
...   ['email' => 'no-es-email'],
...   ['email' => 'required|email']
... )
>>> $validator->fails()
=> true
>>> $validator->errors()
```

### 5. Probar Mutators y Accessors

```php
// Si tienes un accessor para nombre completo
>>> $user = User::find(1)
>>> $user->full_name
=> "Juan Pérez"

// Probar mutator
>>> $user->name = 'juan pérez'
>>> $user->name
=> "Juan Pérez"  // Si tienes mutator que capitaliza
```

---

## 🚀 Técnicas Avanzadas {#tecnicas-avanzadas}

### 1. Transacciones

```php
>>> DB::transaction(function() {
...   $user = User::create(['name' => 'Test', 'email' => 'test@test.com', 'password' => bcrypt('pass')]);
...   Post::create(['user_id' => $user->id, 'title' => 'Post', 'content' => 'Content']);
...   return $user;
... })
```

### 2. Raw Queries

```php
>>> DB::select('SELECT * FROM users WHERE id = ?', [1])

>>> DB::insert('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
...   ['Test', 'test@test.com', bcrypt('pass')])

>>> DB::update('UPDATE users SET name = ? WHERE id = ?', ['Nuevo Nombre', 1])

>>> DB::delete('DELETE FROM users WHERE id = ?', [1])
```

### 3. Scopes

```php
// Si tienes un scope 'active' en User
>>> User::active()->count()

// Scope con parámetros
>>> User::ofType('admin')->get()
```

### 4. Collections (métodos avanzados)

```php
>>> $users = User::all()

// Map
>>> $users->map(fn($u) => $u->email)

// Filter
>>> $users->filter(fn($u) => $u->id > 10)

// Pluck (extraer columna)
>>> $users->pluck('email')
>>> $users->pluck('name', 'id')  // [id => name]

// GroupBy
>>> Post::all()->groupBy('user_id')

// Chunk (dividir colección)
>>> $users->chunk(10)

// Each
>>> $users->each(function($user) {
...   echo $user->name . "\n";
... })
```

### 5. Cache

```php
>>> Cache::put('key', 'value', 60)
>>> Cache::get('key')
=> "value"

>>> Cache::remember('users-count', 60, function() {
...   return User::count();
... })

>>> Cache::forget('key')
>>> Cache::flush()  // Limpiar todo
```

### 6. Events y Listeners

```php
>>> event(new App\Events\UserRegistered($user))

// Escuchar eventos en tiempo real
>>> Event::listen('eloquent.created: App\Models\User', function($user) {
...   echo "Usuario creado: {$user->name}\n";
... })
```

### 7. Jobs y Queues

```php
>>> dispatch(new App\Jobs\SendWelcomeEmail($user))

// Ver jobs en cola
>>> Queue::size()

// Procesar trabajo inmediatamente
>>> $job = new App\Jobs\SendWelcomeEmail($user);
>>> $job->handle()
```

---

## 💼 Casos de Uso Reales {#casos-de-uso}

### Caso 1: Migración de Datos

**Problema:** Necesitas actualizar emails con dominio antiguo

```php
>>> $users = User::where('email', 'like', '%@oldomain.com')->get()
>>> $users->count()
=> 150

>>> foreach($users as $user) {
...   $user->email = str_replace('@olddomain.com', '@newdomain.com', $user->email);
...   $user->save();
...   echo "Actualizado: {$user->email}\n";
... }
```

### Caso 2: Limpieza de Datos

**Problema:** Eliminar usuarios sin posts y no verificados

```php
>>> $users = User::whereNull('email_verified_at')
...              ->doesntHave('posts')
...              ->get()

>>> echo "Usuarios a eliminar: {$users->count()}\n"

>>> $users->each(function($user) {
...   $user->delete();
...   echo "Eliminado: {$user->email}\n";
... })
```

### Caso 3: Reportes Rápidos

**Problema:** Estadísticas mensuales

```php
>>> $stats = DB::table('posts')
...   ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
...   ->whereMonth('created_at', now()->month)
...   ->groupBy('date')
...   ->get()

>>> foreach($stats as $stat) {
...   echo "{$stat->date}: {$stat->total} posts\n";
... }
```

### Caso 4: Debugging en Producción

**Problema:** Usuario reporta error, necesitas investigar

```php
>>> $user = User::where('email', 'usuario@ejemplo.com')->first()
>>> $user->posts()->latest()->first()  // Ver último post
>>> $user->logs()->latest()->take(10)->get()  // Ver logs
>>> $user->permissions  // Ver permisos
```

### Caso 5: Testing de Features

**Problema:** Probar nueva funcionalidad de roles

```php
>>> $user = User::factory()->create()
>>> $role = Role::where('name', 'editor')->first()
>>> $user->roles()->attach($role)
>>> $user->hasRole('editor')
=> true
>>> $user->can('edit-posts')
=> true
```

### Caso 6: Generación de Datos Demo

**Problema:** Cliente quiere ver la app con datos realistas

```php
>>> $categories = ['Tecnología', 'Deportes', 'Política', 'Entretenimiento']
>>>
>>> foreach($categories as $cat) {
...   $category = Category::create(['name' => $cat]);
...   
...   Post::factory()
...     ->count(10)
...     ->for($category)
...     ->create();
... }
```

---

## 💎 Tips y Trucos {#tips-y-trucos}

### 1. Historial de Comandos

```php
// Usa las flechas ↑ ↓ para navegar el historial
// Presiona Ctrl + R para buscar en historial
```

### 2. Autocompletado

```php
// Presiona TAB para autocompletar
>>> User::fi[TAB]
>>> User::find(
```

### 3. Multi-línea

```php
// Para escribir código multi-línea, simplemente continúa
>>> $user = User::create([
...   'name' => 'Test',
...   'email' => 'test@test.com',
...   'password' => bcrypt('pass')
... ])
```

### 4. Variable Especial: $_

```php
// $_ contiene el resultado de la última operación
>>> User::count()
=> 25
>>> $total = $_
>>> echo "Total de usuarios: {$total}"
```

### 5. Mostrar Atributos Ocultos

```php
>>> $user = User::find(1)
>>> $user->makeVisible('password')->toArray()
```

### 6. Modo Verbose (ver todas las queries)

```bash
php artisan tinker --execute="DB::enableQueryLog()"
```

### 7. Archivo de Configuración Personalizado

Crea `tinker.php` en tu proyecto:

```php
<?php
// Alias útiles
use App\Models\User;
use App\Models\Post;
use Illuminate\Support\Facades\DB;

// Funciones helper personalizadas
function findUser($email) {
    return User::where('email', $email)->first();
}

echo "Tinker listo! Usa: findUser('email@example.com')\n";
```

Carga al iniciar:
```bash
php artisan tinker < tinker.php
```

### 8. Exportar Resultados

```php
>>> $users = User::all()
>>> file_put_contents('users.json', $users->toJson())
```

### 9. Benchmark de Queries

```php
>>> $start = microtime(true)
>>> User::where('email', 'like', '%@gmail.com')->get()
>>> $time = microtime(true) - $start
>>> echo "Tiempo: {$time} segundos"
```

### 10. Limpiar Pantalla

```php
>>> system('clear')  // Linux/Mac
>>> system('cls')    // Windows
```

---

## 🎓 Ejercicios Prácticos

### Nivel Básico

1. **Crear 5 usuarios con factory y listarlos**
2. **Buscar todos los usuarios con email de Gmail**
3. **Actualizar el nombre de un usuario específico**
4. **Contar cuántos posts tiene cada usuario**

### Nivel Intermedio

1. **Crear un usuario con 3 posts y 5 comentarios por post**
2. **Encontrar los 5 usuarios más activos (más posts)**
3. **Listar posts con sus autores sin hacer N+1 queries**
4. **Mover todos los posts de un usuario a otro**

### Nivel Avanzado

1. **Crear un reporte de actividad semanal agrupado por día**
2. **Implementar una función que archive posts viejos**
3. **Crear un sistema de tags con many-to-many y asignar tags a posts**
4. **Optimizar una query lenta usando índices y eager loading**

---

## 📖 Recursos Adicionales

- **Documentación Oficial:** https://laravel.com/docs/artisan#tinker
- **PsySH (engine de Tinker):** https://psysh.org/
- **Laravel Collections:** https://laravel.com/docs/collections
- **Eloquent ORM:** https://laravel.com/docs/eloquent

---

## 🎯 Checklist de Dominio

Marca cuando te sientas cómodo con cada tema:

- [ ] Iniciar y navegar Tinker
- [ ] Ejecutar PHP básico y usar helpers
- [ ] Acceder y manipular modelos
- [ ] Crear, leer, actualizar y eliminar registros
- [ ] Construir queries complejas con Eloquent
- [ ] Trabajar con relaciones entre modelos
- [ ] Usar factories para generar datos
- [ ] Debuggear queries y código
- [ ] Aplicar técnicas avanzadas (cache, jobs, etc.)
- [ ] Resolver problemas reales con Tinker

---

## 🎉 Conclusión

**Tinker es tu mejor amigo en Laravel.** Es como tener un diálogo directo con tu aplicación. Mientras más lo uses, más productivo serás.

### Flujo de Trabajo Recomendado:

1. 🤔 **Tienes una duda:** Abre Tinker
2. 🧪 **Prueba tu hipótesis:** Ejecuta el código
3. ✅ **Verifica el resultado:** Ve si funciona
4. 💻 **Implementa en tu código:** Copia lo que funcionó
5. 🔄 **Repite:** Itera rápidamente

### Última Analogía

Tinker es como tener un **microscopio** para tu aplicación Laravel. Mientras que el navegador te muestra la "vista macro" (la interfaz), Tinker te permite examinar cada célula, cada átomo de tu aplicación en tiempo real.

**¡Practica todos los días y pronto Tinker será tu herramienta más usada!** 🚀

---

*Esta master class fue creada con 💙 para desarrolladores Laravel que quieren dominar Tinker*