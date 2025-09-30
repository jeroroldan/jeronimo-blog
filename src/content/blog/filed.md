---
title: 'Master Class: Manejo de Archivos y Fotos en Laravel 12'
code: 'laravel'
description: 'Master Class: Manejo de Archivos y Fotos en Laravel 12'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

Master Class: Manejo de Archivos y Fotos en Laravel 12

Sección 1: Migrations - Estructura para Almacenar Metadatos de Archivos y Fotos
Las migrations en Laravel definen la estructura de la base de datos para almacenar metadatos de archivos (como nombre, ruta, tipo MIME). En Laravel 12, las migraciones son más rápidas con locks atómicos y soporte para columnas JSON optimizadas.
1.1 Crear una Tabla para Archivos/Fotos
¿Qué es? Usa php artisan make:migration para crear una tabla que almacene metadatos como nombre, ruta, tamaño y tipo de archivo.
Analogía: Es como un archivador de biblioteca: cada archivo tiene una ficha (registro) con título, ubicación y detalles, y puedes buscarlo rápidamente sin revolver todo.
Ejemplo:
// Genera: php artisan make:migration create_files_table

<?php
// database/migrations/2025_09_30_000000_create_files_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index(); // Nombre original del archivo
            $table->string('path'); // Ruta en storage (e.g., 'photos/abc.jpg')
            $table->string('mime_type'); // e.g., 'image/jpeg'
            $table->unsignedBigInteger('size'); // Tamaño en bytes
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relación con usuario
            $table->json('metadata')->nullable(); // Extra: resolución, etc.
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('files');
    }
};

Ejecuta: php artisan migrate. Crea la tabla files para metadatos.Consejo pro: Usa $table->index('name') para búsquedas rápidas en nombres de archivo. Agrega softDeletes() si planeas borrado lógico.
1.2 Migración para Relaciones Polimórficas (Archivos Multi-Entidad)
¿Qué es? Usa morphs para asociar archivos a múltiples modelos (e.g., User, Post) con una sola tabla.
Analogía: Como una caja fuerte universal: cualquier persona (modelo) puede guardar sus documentos (archivos) en ella, y la llave (morphs) identifica quién y qué.
Ejemplo:
// Genera: php artisan make:migration create_files_table --create=files

<?php
// database/migrations/2025_09_30_000001_create_files_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('path');
            $table->string('mime_type');
            $table->unsignedBigInteger('size');
            $table->morphs('fileable'); // Columna fileable_id + fileable_type
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('files');
    }
};

Consejo pro: morphs es ideal para apps con múltiples entidades (e.g., fotos de usuarios y posts). Usa morphMap en AppServiceProvider para aliases claros.

Sección 2: Eloquent ORM - Modelos para Gestionar Archivos y Fotos
Eloquent mapea tablas a clases PHP, permitiendo queries y relaciones fluidas. En Laravel 12, incluye métodos como fillAndInsert y carga automática para relaciones.
2.1 Modelo para Archivos/Fotos
¿Qué es? Crea un modelo File con relaciones polimórficas y casts para metadatos JSON.
Analogía: Como un bibliotecario digital: el modelo sabe dónde está cada archivo, quién lo subió y cómo mostrarlo, sin que busques manualmente.
Ejemplo:
// Genera: php artisan make:model File -m

<?php
// app/Models/File.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class File extends Model {
    protected $fillable = ['name', 'path', 'mime_type', 'size', 'fileable_id', 'fileable_type', 'metadata'];
    protected $casts = [
        'metadata' => 'array', // JSON a array
        'size' => 'integer',
    ];

    // Relación polimórfica
    public function fileable(): MorphTo {
        return $this->morphTo();
    }
}

// En modelo relacionado, e.g., User
class User extends Model {
    public function files() {
        return $this->morphMany(File::class, 'fileable');
    }
}

Usa: $user->files()->create(['name' => 'foto.jpg', 'path' => 'photos/foto.jpg']);.Consejo pro: Usa $table->json('metadata') para datos dinámicos como { "width": 1920, "height": 1080 }.
2.2 Subir y Asociar Archivos con Eloquent
¿Qué es? Usa Storage y Eloquent para subir archivos y guardar metadatos.
Analogía: Como un cartero eficiente: entrega el paquete (archivo) al almacén (disk) y registra el envío (metadatos) en el libro mayor (DB).
Ejemplo:
// En un controller
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller {
    public function upload(Request $request) {
        $request->validate(['file' => 'required|file|max:10240|mimes:jpg,png,pdf']); // 10MB max
        $file = $request->file('file');
        
        // Subir al disco (local o S3)
        $path = $file->store('uploads', 'public');
        
        // Guardar metadatos
        $user = auth()->user();
        $fileModel = $user->files()->create([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'metadata' => ['extension' => $file->extension()],
        ]);

        return response()->json(['file' => $fileModel], 201);
    }
}

Ruta: Route::post('/files', [FileController::class, 'upload'])->middleware('auth');.Consejo pro: Usa Storage::url($path) para URLs públicas: http://localhost/storage/uploads/foto.jpg.

Sección 3: Manejo de Archivos y Fotos con APIs de Laravel 12
Laravel 12 optimiza el manejo de archivos con streams mejorados, integración nativa con S3, y soporte para procesar imágenes con Intervention\Image. Incluye novedades como streamDownload y Storage::writeStream.
3.1 Subir Fotos con Procesamiento (Intervention\Image)
¿Qué es? Usa Intervention\Image para redimensionar, comprimir o aplicar filtros a fotos antes de guardarlas.
Analogía: Como un editor de fotos instantáneo: subes una imagen gigante, y él la recorta, ajusta y guarda en el tamaño perfecto, como un sastre digital.
Ejemplo:
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Storage;

public function uploadPhoto(Request $request) {
    $request->validate(['photo' => 'required|image|mimes:jpeg,png|max:5120']);
    $image = $request->file('photo');

    // Procesar imagen
    $manager = new ImageManager(['driver' => 'imagick']); // o 'gd'
    $img = $manager->read($image)->scale(width: 800)->encode('jpg', 80); // Redimensionar y comprimir

    // Guardar
    $path = 'photos/' . uniqid() . '.jpg';
    Storage::disk('public')->put($path, $img);

    // Guardar metadatos
    $fileModel = auth()->user()->files()->create([
        'name' => $image->getClientOriginalName(),
        'path' => $path,
        'mime_type' => 'image/jpeg',
        'size' => strlen($img),
        'metadata' => ['width' => 800, 'height' => $img->height()],
    ]);

    return response()->json(['file' => $fileModel], 201);
}

Instala: composer require intervention/image y configura imagick o gd en config/image.php.Consejo pro: Usa colas (queue:work) para procesar imágenes grandes: dispatch(new ProcessImageJob($image));.
3.2 Streams para Descargas Grandes (Laravel 12)
¿Qué es? streamDownload y Storage::readStream permiten descargas eficientes sin cargar todo en memoria.
Analogía: Como servir agua de una manguera: en lugar de llenar un balde gigante (memoria), dejas que fluya directo al usuario.
Ejemplo:
public function download($id) {
    $file = File::findOrFail($id);
    
    return Storage::disk('public')->streamDownload(
        $file->path,
        $file->name,
        ['Content-Type' => $file->mime_type]
    );
}

Ruta: Route::get('/files/{id}/download', [FileController::class, 'download']);.Consejo pro: Para S3, usa Storage::disk('s3')->temporaryUrl($path, now()->addMinutes(5)) para URLs efímeras.
3.3 Almacenamiento en Cloud con S3 (Optimizado en 12)
¿Qué es? Laravel 12 mejora el driver S3 con soporte para streams y metadatos nativos.
Analogía: Como enviar paquetes a un almacén en la nube: no guardas nada local, pero puedes acceder rápido con una dirección (URL).
Ejemplo:
// config/filesystems.php
'disks' => [
    's3' => [
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION'),
        'bucket' => env('AWS_BUCKET'),
        'url' => env('AWS_URL'),
        'stream_reads' => true, // Nuevo en Laravel 12
    ],
]

// En controller
public function uploadToS3(Request $request) {
    $file = $request->file('file');
    $path = $file->store('uploads', 's3');
    
    $fileModel = auth()->user()->files()->create([
        'name' => $file->getClientOriginalName(),
        'path' => $path,
        'mime_type' => $file->getMimeType(),
        'size' => $file->getSize(),
        'metadata' => ['url' => Storage::disk('s3')->url($path)],
    ]);

    return response()->json(['file' => $fileModel], 201);
}

Consejo pro: Usa flysystem-aws-s3-v3 (ya incluido) y habilita stream_reads para descargas grandes sin lag.
3.4 Limpieza de Archivos Antiguos (Eloquent + Storage)
¿Qué es? Usa Eloquent con Storage para eliminar archivos obsoletos basados en updated_at.
Analogía: Como un robot de limpieza: revisa la papelera (DB) y barre archivos olvidados (storage) para mantener todo ordenado.
Ejemplo:
use App\Models\File;
use Illuminate\Support\Facades\Storage;

public function cleanupOldFiles() {
    $files = File::where('updated_at', '<', now()->subDays(30))->get();
    
    foreach ($files as $file) {
        Storage::disk('public')->delete($file->path);
        $file->delete();
    }

    return response()->json(['message' => 'Archivos antiguos eliminados'], 200);
}

Comando Artisan: php artisan make:command CleanOldFiles para programarlo en schedule.Consejo pro: Usa softDeletes() en File y Storage::delete() en deleted event para mantener integridad.
Otras novedades: Storage::writeStream para uploads grandes, y soporte para metadata nativo en S3.

Conclusión y Siguientes Pasos
¡Listo! Ahora manejas archivos y fotos como experto: migrations para metadatos, Eloquent para relaciones, y Storage para subir/procesar. Laravel 12 hace todo más rápido con streams y cloud. Prueba: sube una foto, procesa con Intervention, y guárdala en S3.
Tarea: Crea una tabla files, un modelo con relación polimórfica, y un endpoint para subir/procesar fotos. ¿Dudas? Pregúntame. ¡A codificar! 🚀
Actualizado a 30/09/2025. Fuentes: Docs oficiales de Laravel 12, Intervention\Image.