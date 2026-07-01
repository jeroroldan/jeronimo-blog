---
title: 'Master Class: Laravel 12 - Creación de Tablas en la Base de Datos con Migrations y Eloquent'
code: 'laravel'
description: 'Creación de Tablas en la Base de Datos con Migrations y Eloquent'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---



## ¿Qué vas a aprender

En este contenido dominarás los conceptos y herramientas esenciales del ecosistema Laravel:

- El ciclo de vida de una petición HTTP en Laravel y cómo funciona el framework internamente
- Eloquent ORM: consultas, relaciones, scopes y patrones avanzados
- Validaciones, Form Requests y flujos de datos seguros
- Migraciones, seeders, factories y manejo de base de datos
- Arquitectura de servicios, repositorios y pruebas automatizadas


# Master Class: Laravel 12 - Creación de Tablas en la Base de Datos con Migrations y Eloquent

¡Bienvenido a esta master class en formato guía! Como especialista en Laravel, te explicaré cómo crear y gestionar tablas en la base de datos usando **Migrations** (el sistema de versionado de esquemas) y **Eloquent ORM** (el mapeador objeto-relacional). Me enfocaré en Laravel 12 (versión actual a septiembre 2025, lanzada en febrero 2025 con actualizaciones hasta 12.30.1), incluyendo novedades como migraciones condicionales, carga eager automática y métodos optimizados para inserts masivos.

Usaré **ejemplos prácticos de código**, **analogías cotidianas** para que las APIs se sientan intuitivas, y me centraré en lo esencial para proyectos reales. Esta guía es análoga a la anterior: clara, accionable y con consejos pro.

**Requisitos previos:** PHP 8.2+, Composer instalado, y un proyecto Laravel nuevo (`composer create-project laravel/laravel MiApp`). Configura tu DB en `.env` (e.g., MySQL: `DB_CONNECTION=mysql`). Ejecuta `php artisan migrate` para probar.

La guía se divide en: Migrations (crear tablas), Eloquent (modelos y relaciones), y Novedades de Laravel 12. Cada API incluirá:
- **¿Qué es?** (explicación breve).
- **Analogía** (para visualizarlo).
- **Ejemplo** (código listo para copiar).
- **Consejo pro** (para optimizar).

---

## Sección 1: Migrations - Versionado de Esquemas como Control de Git para tu DB

Migrations en Laravel son como commits en Git: definen cambios en la estructura de la DB de forma portable y reversible. En Laravel 12, son más rápidas y seguras, con soporte para locks atómicos en despliegues.

### 1.1 Crear una Migración Básica para una Tabla
**¿Qué es?** Usa `php artisan make:migration` para generar un archivo PHP que define la tabla con `Schema::create`. Incluye columnas, índices y foreign keys.

**Analogía:** Es como dibujar un plano de casa: defines habitaciones (columnas) y conexiones (foreign keys) antes de construir, y puedes "derribar" todo con `down()` si algo sale mal.

**Ejemplo:**
```php
// Genera: php artisan make:migration create_users_table

<?php
// database/migrations/2025_09_30_000000_create_users_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // Primary key auto-increment
            $table->string('name', 100);
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps(); // created_at y updated_at
        });
    }

    public function down(): void {
        Schema::dropIfExists('users');
    }
};
```
Ejecuta: `php artisan migrate`. ¡Tabla creada!
**Consejo pro:** Usa `--create=users` en el comando para pre-rellenar el nombre: `php artisan make:migration create_users_table --create=users`.

### 1.2 Agregar/Modificar Columnas en Tablas Existentes
**¿Qué es?** `Schema::table` para alterar tablas: agregar, renombrar o dropear columnas/índices.

**Analogía:** Como reformar una casa existente: agregas una habitación sin demoler todo, pero planeas el `down()` para revertir si no te gusta.

**Ejemplo:**
```php
// Genera: php artisan make:migration add_role_to_users_table --table=users

<?php
// database/migrations/2025_09_30_000001_add_role_to_users_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'user'])->default('user')->after('password');
            $table->foreignId('team_id')->nullable()->constrained()->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'team_id']);
        });
    }
};
```
Ejecuta: `php artisan migrate`. Ahora `users` tiene `role` y FK a `teams`.
**Consejo pro:** Para previews: `php artisan migrate --pretend` muestra SQL sin ejecutar.

### 1.3 Índices y Foreign Keys
**¿Qué es?** Agrega constraints para integridad: únicos, índices y FKs con cascades.

**Analogía:** Como candados en puertas: un índice único evita duplicados (como no repetir nombres en una lista de invitados), y FKs enlazan "puertas" entre habitaciones.

**Ejemplo:**
```php
// En up() de una migración
Schema::table('posts', function (Blueprint $table) {
    $table->index('user_id'); // Índice simple
    $table->unique('slug'); // Único
    $table->foreignId('category_id')->constrained('categories')->onUpdate('cascade')->onDelete('set null');
});
```
**Consejo pro:** Nombra FKs explícitamente: `$table->foreign('user_id')->references('id')->on('users')->name('posts_user_id_fk');` para fáciles drops.

Otras comandos: `migrate:status` (ver estado), `migrate:rollback --step=1` (revertir último), `migrate:fresh --seed` (borrar todo y seed).

---

## Sección 2: Eloquent ORM - Modelos como Superhéroes de tu DB

Eloquent mapea tablas a clases PHP: cada modelo es una tabla, con métodos para queries, relaciones y casts. En Laravel 12, genera IDs UUID/ULID por default y soporta scopes con atributos auto-aplicados.

### 2.1 Crear un Modelo con Eloquent
**¿Qué es?** `php artisan make:model` genera la clase que extiende `Model`. Define fillable, casts y relaciones.

**Analogía:** Es como un avatar en un videojuego: el modelo "vive" en la DB, pero tú lo controlas con poderes (métodos) como volar (queries) o aliarse (relaciones).

**Ejemplo:**
```php
// Genera: php artisan make:model User -m (con migración)

<?php
// app/Models/User.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable {
    use HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role'];
    protected $hidden = ['password', 'remember_token'];
    protected $casts = [
        'email_verified_at' => 'datetime',
        'role' => 'string', // Cast enum
    ];

    // Relación: un user tiene muchos posts
    public function posts() {
        return $this->hasMany(Post::class);
    }
}
```
Usa: `$user = User::create(['name' => 'Juan', 'email' => 'juan@example.com']);`.
**Consejo pro:** Usa `--all` para generar factory, seeder, controller: `php artisan make:model Post --all`.

### 2.2 Queries y Relaciones Básicas
**¿Qué es?** Chain methods como `where`, `with` (eager loading) para fetches eficientes.

**Analogía:** Como pedir pizza con extras: `where` filtra toppings, `with` carga la caja (relaciones) sin pedidos extras.

**Ejemplo:**
```php
// En un controller
$users = User::with('posts') // Eager load
             ->where('role', 'admin')
             ->orderBy('created_at', 'desc')
             ->paginate(10);

foreach ($users as $user) {
    echo $user->name . ' tiene ' . $user->posts->count() . ' posts';
}
```
**Consejo pro:** Evita N+1: siempre `with()` para relaciones.

### 2.3 Soft Deletes y Timestamps
**¿Qué es?** Traits como `SoftDeletes` marcan deletes sin borrar, y `timestamps` auto-gestiona fechas.

**Analogía:** Como una papelera reciclable: "borras" pero recuperas, y timestamps son relojes automáticos que marcan "cuándo entraste/saliste".

**Ejemplo:**
```php
// En modelo
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model {
    use SoftDeletes;
    protected $dates = ['deleted_at']; // O usa casts en 12
}

// Query
$posts = Post::withTrashed()->get(); // Incluye borrados
Post::find(1)->delete(); // Soft delete
Post::withTrashed()->restore(); // Recuperar
```
**Consejo pro:** En migración: `$table->softDeletes();` para columna `deleted_at`.

---

## Sección 3: Novedades en Laravel 12 - Optimizaciones para Migrations y Eloquent

Laravel 12 acelera migraciones (locks atómicos), mejora Eloquent con inserts masivos y carga dinámica. ¡Es como un motor turbo: más rápido y con frenos inteligentes!

### 3.1 Migraciones Condicionales con `shouldRun()`
**¿Qué es?** Salta migraciones basadas en flags (e.g., features activas). Nuevo en 12.4.

**Analogía:** Como un interruptor inteligente: la migración "chequea" si la luz está on antes de encenderse, evitando cambios innecesarios.

**Ejemplo:**
```php
// En migración
public function shouldRun(): bool {
    return config('features.new_table'); // O Feature::active('NewTable')
}
```
**Consejo pro:** Ideal para A/B testing: integra con Laravel Pennant.

### 3.2 `fillAndInsert()` en Eloquent: Inserts Masivos Inteligentes
**¿Qué es?** Inserta arrays con casts y lógica interna (UUIDs, timestamps). Nuevo en 12.6.

**Analogía:** Como un conveyor belt en fábrica: arrojas ingredientes crudos (array), y sale productos listos (con casts aplicados) en lote.

**Ejemplo:**
```php
// Modelo con UUID
use HasUuids;

class User extends Model { use HasUuids; }

// Inserta
User::fillAndInsert([
    ['name' => 'Ana', 'email' => 'ana@example.com'],
    ['name' => 'Bob', 'email' => 'bob@example.com'],
]);
```
**Consejo pro:** +30% más rápido que loops de `create()`; usa para seeds grandes.

### 3.3 Carga Eager Automática con `withRelationshipAutoloading()`
**¿Qué es?** Carga relaciones nested dinámicamente sin definirlas. Nuevo en 12.8.

**Analogía:** Como un mayordomo predictivo: accede a "casa.propietario.perro" y él carga todo automáticamente, sin que pidas.

**Ejemplo:**
```php
$users = User::all()->loadMissing('posts.author'); // O autoload
$users->withRelationshipAutoloading();
foreach ($users as $user) {
    echo $user->posts->first()->author->name; // Auto-cargado
}
```
Activa global: `Model::automaticallyEagerLoadRelationships(true);` en provider.
**Consejo pro:** Reduce N+1 en loops complejos; desactiva en prod si no necesitas.

### 3.4 UUID/ULID como Primary Keys Nativos
**¿Qué es?** Traits `HasUuids`/`HasUlids` generan IDs ordenados. Mejorado en 12.

**Analogía:** Como un código QR único por nacimiento: evita colisiones y ordena cronológicamente sin números secuenciales.

**Ejemplo:**
```php
// En modelo
use HasUlids;

class Order extends Model { use HasUlids; }

// Auto-genera en create()
$order = Order::create(['amount' => 100]); // id: '01J8C5K3ABCDEF'
```
En migración: `$table->ulid('id')->primary();`.
**Consejo pro:** Para sharding distribuido; customiza con `newUniqueId()`.

Otras novedades: `ObservedBy` para observers auto, `saveQuietly()` sin eventos, y `model:show` CLI para inspeccionar modelos.

---

## Conclusión y Siguientes Pasos
¡Listo! Ahora creas tablas como un pro: migrations para estructura, Eloquent para magia. Laravel 12 hace todo más fluido y escalable. Prueba en tu proyecto: genera una migración, modelo y seed con `php artisan db:seed`.

**Tarea:** Crea un modelo `Post` con relación a `User`, migra y query con eager loading. ¿Dudas? Pregúntame. ¡A desarrollar! 🚀

*Actualizado a 30/09/2025. Fuentes: Docs oficiales de Laravel 12.*