---
title: 'Laravel Backend'
code: "laravarel"
description: 'Laravel Backend Masterclass - Guía del Experto'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Laravel Backend Masterclass - Guía del Experto

## 🏗️ 1. Arquitectura Fundamental de Laravel

### El Patrón MVC - Tu Casa Organizada

Laravel implementa MVC (Model-View-Controller) como una casa bien organizada:

- **Model (Cocina)**: Donde se preparan y procesan los datos
- **View (Sala)**: Donde se presenta todo al visitante
- **Controller (Mayordomo)**: Quien coordina entre la cocina y la sala

```php
// Controller - El mayordomo que coordina
class UserController extends Controller
{
    public function show(User $user)
    {
        // Toma datos del modelo (cocina)
        $posts = $user->posts()->latest()->get();
      
        // Los presenta en la vista (sala)
        return view('users.profile', compact('user', 'posts'));
    }
}
```

### Service Container - El Contenedor Mágico

El Service Container es como un mayordomo personal que sabe exactamente qué necesitas antes de que lo pidas.

```php
// Binding - Enseñarle al contenedor qué dar
App::bind('PaymentGateway', function () {
    return new StripeGateway(config('stripe.secret'));
});

// Resolución automática - El mayordomo te lo trae
class OrderController extends Controller
{
    public function __construct(PaymentGateway $gateway)
    {
        $this->gateway = $gateway; // Laravel lo inyecta automáticamente
    }
}
```

### Service Providers - Los Arquitectos del Sistema

Los Service Providers son como arquitectos que diseñan cómo funcionará cada parte de tu aplicación.

```php
class PaymentServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Registra servicios - "Así se construye"
        $this->app->singleton('payment', function ($app) {
            return new PaymentManager($app['config']['payment']);
        });
    }
  
    public function boot()
    {
        // Configura después de construcción - "Así funciona"
        View::composer('checkout.*', PaymentComposer::class);
    }
}
```

## 🛣️ 2. Routing - Las Carreteras de tu Aplicación

### Rutas Básicas - Mapas de Carreteras

```php
// routes/web.php - Carreteras para humanos
Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::post('/users', [UserController::class, 'store'])->name('users.store');

// routes/api.php - Carreteras para máquinas
Route::apiResource('posts', PostController::class);

// Route Groups - Autopistas con mismo destino
Route::prefix('admin')
    ->middleware(['auth', 'admin'])
    ->group(function () {
        Route::get('dashboard', [AdminController::class, 'dashboard']);
        Route::resource('users', AdminUserController::class);
    });
```

### Route Model Binding - GPS Inteligente

Laravel puede encontrar automáticamente registros como un GPS inteligente:

```php
// Implicit Binding - GPS automático
Route::get('/users/{user}', function (User $user) {
    return $user; // Laravel encuentra el user por ID automáticamente
});

// Explicit Binding - GPS personalizado
Route::bind('post', function ($value) {
    return Post::where('slug', $value)->firstOrFail();
});

// Custom Key - GPS con dirección específica
Route::get('/posts/{post:slug}', function (Post $post) {
    return $post; // Busca por slug en lugar de ID
});
```

## 🎮 3. Controllers - Los Directores de Orquesta

### Resource Controllers - Directores Especializados

```php
// Artisan command para crear controlador completo
// php artisan make:controller PostController --resource

class PostController extends Controller
{
    // index() - "Muéstrame todos"
    public function index(Request $request)
    {
        $posts = Post::query()
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->paginate(15);
          
        return PostResource::collection($posts);
    }
  
    // show() - "Muéstrame este específicamente" 
    public function show(Post $post)
    {
        $this->authorize('view', $post);
        return new PostResource($post);
    }
  
    // store() - "Crea uno nuevo"
    public function store(StorePostRequest $request)
    {
        $post = Post::create($request->validated());
        return new PostResource($post);
    }
}
```

### Single Action Controllers - Especialistas

```php
// Para acciones muy específicas
class GenerateInvoiceController extends Controller
{
    public function __invoke(Order $order)
    {
        $this->authorize('generate-invoice', $order);
      
        $pdf = PDF::loadView('invoices.template', compact('order'));
      
        return $pdf->download("invoice-{$order->id}.pdf");
    }
}

// Uso en rutas
Route::post('/orders/{order}/invoice', GenerateInvoiceController::class);
```

## 🗄️ 4. Eloquent ORM - El Traductor Universal

### Modelos - Los Traductores de Datos

Eloquent es como tener un traductor que convierte entre el lenguaje humano y el de las bases de datos.

```php
class Post extends Model
{
    // Configuración básica
    protected $fillable = ['title', 'content', 'status', 'published_at'];
    protected $casts = [
        'published_at' => 'datetime',
        'meta' => 'json',
        'is_featured' => 'boolean'
    ];
  
    // Relationships - Conexiones familiares
    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
  
    public function tags()
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }
  
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
```

### Query Builder - El Constructor de Preguntas

```php
// Queries simples - Preguntas básicas
$users = User::where('active', true)
    ->orderBy('created_at', 'desc')
    ->limit(10)
    ->get();

// Queries complejas - Preguntas sofisticadas
$popularPosts = Post::withCount(['likes', 'comments'])
    ->whereHas('author', function ($query) {
        $query->where('verified', true);
    })
    ->where('created_at', '>=', now()->subDays(30))
    ->orderBy('likes_count', 'desc')
    ->take(5)
    ->get();

// Eager Loading - Cargar todo de una vez
$posts = Post::with(['author', 'tags', 'comments.user'])
    ->get(); // Una sola consulta en lugar de N+1
```

### Relationships - Las Relaciones Familiares

```php
// One to Many - Padre e hijos
class User extends Model
{
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}

// Many to Many - Grupos de amigos
class Post extends Model
{
    public function tags()
    {
        return $this->belongsToMany(Tag::class)
            ->withPivot(['created_by', 'priority'])
            ->withTimestamps();
    }
}

// Polymorphic - El camaleón
class Comment extends Model
{
    public function commentable()
    {
        return $this->morphTo(); // Puede comentar posts, videos, etc.
    }
}
```

### Mutators y Accessors - Los Transformadores

```php
class User extends Model
{
    // Accessor - Transforma al leer
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
  
    // Mutator - Transforma al guardar
    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = Hash::make($password);
    }
  
    // Cast personalizado
    protected $casts = [
        'preferences' => UserPreferences::class
    ];
}

// Uso
$user = User::find(1);
echo $user->full_name; // "John Doe" - usa el accessor
$user->password = 'secret'; // Automáticamente hasheado por el mutator
```

## 🛡️ 5. Middleware - Los Guardias de Seguridad

### Middleware Básico - Porteros Inteligentes

El middleware es como tener porteros que verifican cada solicitud antes de dejarla pasar.

```php
// Crear middleware personalizado
// php artisan make:middleware CheckUserRole

class CheckUserRole
{
    public function handle($request, Closure $next, $role)
    {
        // Verificar antes de procesar
        if (!$request->user() || !$request->user()->hasRole($role)) {
            abort(403, 'No autorizado');
        }
      
        $response = $next($request); // Procesar solicitud
      
        // Modificar después de procesar
        $response->header('X-Custom-Header', 'Processed');
      
        return $response;
    }
}

// Registrar en Kernel.php
protected $routeMiddleware = [
    'role' => \App\Http\Middleware\CheckUserRole::class,
];

// Usar en rutas
Route::group(['middleware' => 'role:admin'], function () {
    Route::get('admin/dashboard', [AdminController::class, 'index']);
});
```

### Middleware Global vs Específico

```php
// Global - Para todas las rutas
protected $middleware = [
    \App\Http\Middleware\TrustProxies::class,
    \App\Http\Middleware\CheckForMaintenanceMode::class,
];

// Grupos - Para tipos específicos de rutas
protected $middlewareGroups = [
    'api' => [
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

## ✅ 6. Validation - El Control de Calidad

### Form Requests - Inspectores Especializados

Los Form Requests son como inspectores de calidad que verifican todo antes de que llegue a tu controlador.

```php
// php artisan make:request StorePostRequest

class StorePostRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->can('create', Post::class);
    }
  
    public function rules()
    {
        return [
            'title' => 'required|string|max:200|unique:posts',
            'content' => 'required|string|min:100',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'array|max:5',
            'tags.*' => 'string|exists:tags,name',
            'image' => 'nullable|image|mimes:jpeg,png|max:2048',
            'published_at' => 'nullable|date|after:now',
        ];
    }
  
    public function messages()
    {
        return [
            'content.min' => 'El contenido debe tener al menos 100 caracteres.',
            'tags.max' => 'No puedes seleccionar más de 5 etiquetas.',
        ];
    }
  
    // Preparar datos antes de validación
    protected function prepareForValidation()
    {
        $this->merge([
            'slug' => Str::slug($this->title),
        ]);
    }
}
```

### Validación Personalizada - Inspectores Especiales

```php
// Rule personalizada
// php artisan make:rule StrongPassword

class StrongPassword implements Rule
{
    public function passes($attribute, $value)
    {
        return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', $value);
    }
  
    public function message()
    {
        return 'La :attribute debe contener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.';
    }
}

// Uso
'password' => ['required', 'confirmed', new StrongPassword],

// Validación con closure
'email' => [
    'required',
    'email',
    function ($attribute, $value, $fail) {
        if (!str_ends_with($value, '@company.com')) {
            $fail('Solo se permiten emails corporativos.');
        }
    },
],
```

## 🏭 7. Services y Dependency Injection - La Fábrica Inteligente

### Service Classes - Especialistas en su Trabajo

```php
class PaymentService
{
    protected $gateway;
    protected $logger;
  
    public function __construct(PaymentGateway $gateway, LoggerInterface $logger)
    {
        $this->gateway = $gateway;
        $this->logger = $logger;
    }
  
    public function processPayment(Order $order, array $paymentData)
    {
        try {
            $this->logger->info("Procesando pago para orden {$order->id}");
          
            $charge = $this->gateway->charge([
                'amount' => $order->total * 100, // centavos
                'currency' => 'usd',
                'source' => $paymentData['token'],
                'metadata' => ['order_id' => $order->id]
            ]);
          
            $order->update([
                'payment_status' => 'paid',
                'transaction_id' => $charge->id
            ]);
          
            event(new PaymentProcessed($order, $charge));
          
            return $charge;
          
        } catch (PaymentException $e) {
            $this->logger->error("Error procesando pago: " . $e->getMessage());
            throw $e;
        }
    }
}

// Uso en controlador
class PaymentController extends Controller
{
    public function process(Order $order, PaymentService $paymentService)
    {
        try {
            $charge = $paymentService->processPayment($order, request()->all());
            return response()->json(['success' => true, 'charge_id' => $charge->id]);
        } catch (PaymentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
```

### Repository Pattern - El Bibliotecario

```php
interface PostRepositoryInterface
{
    public function find($id);
    public function getPaginated($perPage = 15);
    public function getByAuthor(User $author);
    public function getPublished();
}

class EloquentPostRepository implements PostRepositoryInterface
{
    public function find($id)
    {
        return Post::with(['author', 'tags'])->findOrFail($id);
    }
  
    public function getPaginated($perPage = 15)
    {
        return Post::with(['author', 'tags'])
            ->latest()
            ->paginate($perPage);
    }
  
    public function getByAuthor(User $author)
    {
        return $author->posts()->with('tags')->latest()->get();
    }
  
    public function getPublished()
    {
        return Post::where('status', 'published')
            ->where('published_at', '<=', now())
            ->get();
    }
}

// Binding en ServiceProvider
$this->app->bind(PostRepositoryInterface::class, EloquentPostRepository::class);
```

## ⚡ 8. Jobs y Queues - Los Trabajadores Incansables

### Jobs - Tareas para Después

Los Jobs son como tener empleados que pueden trabajar en segundo plano mientras tú haces otras cosas.

```php
// php artisan make:job ProcessPodcastUpload

class ProcessPodcastUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
  
    protected $podcast;
  
    public function __construct(Podcast $podcast)
    {
        $this->podcast = $podcast;
    }
  
    public function handle()
    {
        // Proceso pesado que toma tiempo
        $this->extractMetadata();
        $this->generateThumbnail();
        $this->transcribeAudio();
        $this->notifyUser();
    }
  
    private function extractMetadata()
    {
        // Extraer información del archivo
        $metadata = AudioProcessor::getMetadata($this->podcast->file_path);
        $this->podcast->update([
            'duration' => $metadata['duration'],
            'size' => $metadata['size'],
        ]);
    }
  
    private function generateThumbnail()
    {
        // Generar miniatura
        $thumbnail = AudioProcessor::generateThumbnail($this->podcast->file_path);
        $this->podcast->update(['thumbnail' => $thumbnail]);
    }
  
    public function failed(Throwable $exception)
    {
        // Qué hacer si falla
        $this->podcast->update(['status' => 'failed']);
        Log::error('Falló el procesamiento del podcast: ' . $exception->getMessage());
    }
}

// Despachar el job
ProcessPodcastUpload::dispatch($podcast);

// Despachar con delay
ProcessPodcastUpload::dispatch($podcast)->delay(now()->addMinutes(5));

// Despachar a cola específica
ProcessPodcastUpload::dispatch($podcast)->onQueue('media-processing');
```

### Job Chains - Línea de Ensamblaje

```php
// Procesos que deben ejecutarse en orden
Bus::chain([
    new ProcessPodcastUpload($podcast),
    new GenerateTranscription($podcast),
    new NotifySubscribers($podcast),
])->dispatch();

// Con manejo de errores
Bus::chain([
    new ProcessVideo($video),
    new GenerateThumbnails($video),
    new PublishVideo($video),
])->catch(function (Throwable $e) {
    Log::error('Falló la cadena de procesamiento: ' . $e->getMessage());
})->dispatch();
```

## 📡 9. Events y Listeners - El Sistema de Comunicación

### Events - Mensajeros

Los Events son como mensajeros que anuncian cuando algo importante sucede.

```php
// php artisan make:event UserRegistered

class UserRegistered
{
    use Dispatchable, SerializesModels;
  
    public $user;
  
    public function __construct(User $user)
    {
        $this->user = $user;
    }
}

// php artisan make:listener SendWelcomeEmail

class SendWelcomeEmail
{
    public function handle(UserRegistered $event)
    {
        Mail::to($event->user->email)->send(new WelcomeMail($event->user));
    }
}

// Registrar en EventServiceProvider
protected $listen = [
    UserRegistered::class => [
        SendWelcomeEmail::class,
        CreateUserProfile::class,
        LogUserRegistration::class,
    ],
];

// Disparar evento
event(new UserRegistered($user));
```

### Model Events - Eventos Automáticos

```php
class Post extends Model
{
    protected static function booted()
    {
        // Cuando se crea un post
        static::created(function ($post) {
            // Notificar a seguidores
            $post->author->followers->each(function ($follower) {
                $follower->notify(new NewPostNotification($post));
            });
        });
      
        // Cuando se actualiza
        static::updated(function ($post) {
            if ($post->wasChanged('status') && $post->status === 'published') {
                event(new PostPublished($post));
            }
        });
      
        // Antes de eliminar
        static::deleting(function ($post) {
            $post->comments()->delete();
            $post->likes()->delete();
        });
    }
}
```

## 🚀 10. Caching - El Asistente de Memoria

### Cache Strategies - Estrategias de Memoria

```php
class PostService
{
    public function getFeaturedPosts()
    {
        return Cache::remember('featured_posts', 3600, function () {
            return Post::where('featured', true)
                ->with(['author', 'tags'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get();
        });
    }
  
    public function getPopularTags()
    {
        return Cache::tags(['posts', 'tags'])->remember('popular_tags', 7200, function () {
            return Tag::withCount('posts')
                ->orderBy('posts_count', 'desc')
                ->take(10)
                ->get();
        });
    }
  
    public function invalidatePostCache($postId)
    {
        Cache::forget("post.{$postId}");
        Cache::tags(['posts'])->flush(); // Limpiar todo lo relacionado con posts
    }
}

// Model Caching
class User extends Model
{
    public function getPostsCountAttribute()
    {
        return Cache::remember("user.{$this->id}.posts_count", 3600, function () {
            return $this->posts()->count();
        });
    }
}
```

### Query Caching - Cache Inteligente

```php
// Cache de queries complejas
$users = User::remember(3600) // Cache por 1 hora
    ->with('posts')
    ->where('active', true)
    ->get();

// Cache condicional
$posts = Post::when(app()->environment('production'), function ($query) {
        return $query->remember(1800); // Solo cache en producción
    })
    ->published()
    ->get();
```

## 🧪 11. Testing - El Laboratorio de Calidad

### Feature Tests - Pruebas del Usuario Real

```php
class PostManagementTest extends TestCase
{
    use RefreshDatabase;
  
    /** @test */
    public function admin_can_create_post()
    {
        // Preparar
        $admin = User::factory()->admin()->create();
        $postData = [
            'title' => 'Mi Nuevo Post',
            'content' => 'Contenido del post...',
            'status' => 'draft'
        ];
      
        // Actuar
        $response = $this->actingAs($admin)
            ->post(route('posts.store'), $postData);
      
        // Verificar
        $response->assertStatus(201);
        $this->assertDatabaseHas('posts', [
            'title' => 'Mi Nuevo Post',
            'author_id' => $admin->id
        ]);
    }
  
    /** @test */
    public function user_cannot_view_unpublished_posts()
    {
        $user = User::factory()->create();
        $draftPost = Post::factory()->draft()->create();
      
        $response = $this->actingAs($user)
            ->get(route('posts.show', $draftPost));
          
        $response->assertStatus(403);
    }
}
```

### Unit Tests - Pruebas de Componentes

```php
class PaymentServiceTest extends TestCase
{
    /** @test */
    public function it_processes_payment_successfully()
    {
        // Mock del gateway de pago
        $mockGateway = Mockery::mock(PaymentGateway::class);
        $mockGateway->shouldReceive('charge')
            ->once()
            ->with(Mockery::type('array'))
            ->andReturn((object) ['id' => 'ch_12345']);
          
        $this->app->instance(PaymentGateway::class, $mockGateway);
      
        $order = Order::factory()->create(['total' => 99.99]);
        $paymentService = app(PaymentService::class);
      
        $result = $paymentService->processPayment($order, ['token' => 'tok_visa']);
      
        $this->assertEquals('ch_12345', $result->id);
        $this->assertEquals('paid', $order->fresh()->payment_status);
    }
}
```

### Database Testing - Pruebas de Datos

```php
class PostTest extends TestCase
{
    use RefreshDatabase;
  
    /** @test */
    public function it_can_retrieve_published_posts()
    {
        Post::factory()->published()->count(3)->create();
        Post::factory()->draft()->count(2)->create();
      
        $publishedPosts = Post::published()->get();
      
        $this->assertCount(3, $publishedPosts);
        $publishedPosts->each(function ($post) {
            $this->assertEquals('published', $post->status);
        });
    }
}
```

## 📊 12. API Resources - Los Presentadores Elegantes

### Resource Classes - Transformadores de Datos

```php
// php artisan make:resource PostResource

class PostResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => Str::limit($this->content, 150),
            'content' => $this->when($request->routeIs('posts.show'), $this->content),
            'status' => $this->status,
            'published_at' => $this->published_at?->format('Y-m-d H:i:s'),
            'author' => new UserResource($this->whenLoaded('author')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'comments_count' => $this->when(isset($this->comments_count), $this->comments_count),
            'can_edit' => $request->user()?->can('update', $this->resource),
            'links' => [
                'self' => route('api.posts.show', $this->id),
                'author' => route('api.users.show', $this->author_id),
            ]
        ];
    }
}

// Resource Collection personalizado
class PostCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total_posts' => $this->collection->count(),
                'published_count' => $this->collection->where('status', 'published')->count(),
            ]
        ];
    }
}
```

## 🔐 13. Authentication & Authorization - El Sistema de Seguridad

### Gates y Policies - Reglas de Autorización

```php
// Gates - Reglas globales
Gate::define('manage-posts', function ($user) {
    return $user->hasRole(['admin', 'editor']);
});

Gate::define('publish-posts', function ($user) {
    return $user->hasRole('admin') || 
           ($user->hasRole('editor') && $user->posts()->count() >= 10);
});

// Policies - Reglas específicas para modelos
// php artisan make:policy PostPolicy --model=Post

class PostPolicy
{
    public function viewAny(User $user)
    {
        return true; // Todos pueden ver la lista
    }
  
    public function view(?User $user, Post $post)
    {
        return $post->status === 'published' || 
               $user?->id === $post->author_id ||
               $user?->hasRole('admin');
    }
  
    public function create(User $user)
    {
        return $user->hasVerifiedEmail();
    }
  
    public function update(User $user, Post $post)
    {
        return $user->id === $post->author_id || $user->hasRole('admin');
    }
  
    public function delete(User $user, Post $post)
    {
        return $user->hasRole('admin') ||
               ($user->id === $post->author_id && $post->created_at->gt(now()->subHour()));
    }
}

// Uso en controladores
class PostController extends Controller
{
    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);
      
        // Solo el admin puede cambiar el autor
        if ($request->has('author_id') && !$request->user()->hasRole('admin')) {
            unset($request['author_id']);
        }
      
        $post->update($request->validated());
      
        return new PostResource($post);
    }
}
```

### Custom Guards - Guardias Personalizados

```php
class ApiTokenGuard implements Guard
{
    protected $request;
    protected $provider;
    protected $user;
  
    public function check()
    {
        return !is_null($this->user());
    }
  
    public function user()
    {
        if (!is_null($this->user)) {
            return $this->user;
        }
      
        $token = $this->request->bearerToken();
      
        if ($token) {
            $this->user = $this->provider->retrieveByCredentials([
                'api_token' => hash('sha256', $token)
            ]);
        }
      
        return $this->user;
    }
}
```

## 🔧 14. Artisan Commands - Herramientas Personalizadas

### Custom Commands - Tus Propias Herramientas

```php
// php artisan make:command CleanupOldPosts

class CleanupOldPosts extends Command
{
    protected $signature = 'posts:cleanup 
                           {--days=30 : Number of days to keep}
                           {--dry-run : Show what would be deleted without deleting}
                           {--force : Skip confirmation}';
  
    protected $description = 'Clean up old draft posts';
  
    public function handle()
    {
        $days = $this->option('days');
        $isDryRun = $this->option('dry-run');
        $force = $this->option('force');
      
        $query = Post::where('status', 'draft')
            ->where('created_at', '<', now()->subDays($days));
          
        $count = $query->count();
      
        if ($count === 0) {
            $this->info('No hay posts para limpiar.');
            return;
        }
      
        $this->info("Se encontraron {$count} posts para limpiar.");
      
        if ($isDryRun) {
            $this->table(['ID', 'Título', 'Creado'], 
                $query->get(['id', 'title', 'created_at'])->toArray()
            );
            return;
        }
      
        if (!$force && !$this->confirm('¿Continuar con la eliminación?')) {
            $this->info('Operación cancelada.');
            return;
        }
      
        $bar = $this->output->createProgressBar($count);
        $bar->start();
      
        $query->chunk(100, function ($posts) use ($bar) {
            foreach ($posts as $post) {
                $post->delete();
                $bar->advance();
            }
        });
      
        $bar->finish();
        $this->newLine();
        $this->info("✅ {$count} posts eliminados correctamente.");
    }
}
```

## 📧 15. Mail y Notifications - El Sistema de Comunicación

### Mailable Classes - Carteros Inteligentes

```php
// php artisan make:mail OrderShipped

class OrderShipped extends Mailable
{
    use Queueable, SerializesModels;
  
    public $order;
    public $trackingNumber;
  
    public function __construct(Order $order, $trackingNumber)
    {
        $this->order = $order;
        $this->trackingNumber = $trackingNumber;
    }
  
    public function build()
    {
        return $this->from('orders@company.com', 'Company Orders')
            ->subject("Tu pedido #{$this->order->id} ha sido enviado")
            ->markdown('emails.orders.shipped')
            ->with([
                'customerName' => $this->order->customer_name,
                'shippingAddress' => $this->order->shipping_address,
                'estimatedDelivery' => now()->addDays(3)->format('d/m/Y'),
            ])
            ->attach(storage_path("app/invoices/{$this->order->id}.pdf"));
    }
}

// Uso
Mail::to($order->customer_email)
    ->cc('orders@company.com')
    ->send(new OrderShipped($order, $trackingNumber));
```

### Notifications - Notificaciones Multicanal

```php
// php artisan make:notification InvoiceOverdue

class InvoiceOverdue extends Notification implements ShouldQueue
{
    use Queueable;
  
    protected $invoice;
  
    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }
  
    public function via($notifiable)
    {
        $channels = ['database'];
      
        if ($this->invoice->amount > 1000) {
            $channels[] = 'mail';
        }
      
        if ($notifiable->wants_sms_notifications) {
            $channels[] = 'sms';
        }
      
        return $channels;
    }
  
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->error()
            ->subject('Factura Vencida - Acción Requerida')
            ->greeting("Hola {$notifiable->name},")
            ->line("Tu factura #{$this->invoice->number} está vencida.")
            ->line("Monto: \${$this->invoice->amount}")
            ->line("Vencimiento: {$this->invoice->due_date->format('d/m/Y')}")
            ->action('Ver Factura', route('invoices.show', $this->invoice))
            ->line('Por favor, procede con el pago lo antes posible.');
    }
  
    public function toArray($notifiable)
    {
        return [
            'invoice_id' => $this->invoice->id,
            'invoice_number' => $this->invoice->number,
            'amount' => $this->invoice->amount,
            'days_overdue' => $this->invoice->due_date->diffInDays(now()),
        ];
    }
}
```

## 🌟 16. Mejores Prácticas de Producción

### Performance Optimization

```php
// Configuración de producción
// config/cache.php
'default' => env('CACHE_DRIVER', 'redis'),

// config/session.php  
'driver' => env('SESSION_DRIVER', 'redis'),

// config/queue.php
'default' => env('QUEUE_CONNECTION', 'redis'),

// Optimizaciones en modelos
class Post extends Model
{
    // Índices de base de datos
    public function up()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->index(['status', 'published_at']); // Para queries frecuentes
            $table->index('author_id'); // Para relaciones
        });
    }
  
    // Eager loading por defecto
    protected $with = ['author'];
  
    // Scope para queries comunes
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->where('published_at', '<=', now());
    }
}
```

### Error Handling - Manejo de Errores

```php
// app/Exceptions/Handler.php
class Handler extends ExceptionHandler
{
    public function register()
    {
        $this->reportable(function (PaymentException $e) {
            // Log crítico para errores de pago
            Log::critical('Payment failed', [
                'exception' => $e->getMessage(),
                'user_id' => auth()->id(),
                'stack_trace' => $e->getTraceAsString()
            ]);
          
            // Notificar al equipo
            Slack::send('💳 Error de pago crítico: ' . $e->getMessage());
        });
      
        $this->renderable(function (ModelNotFoundException $e) {
            if (request()->wantsJson()) {
                return response()->json([
                    'error' => 'Recurso no encontrado',
                    'message' => 'El elemento solicitado no existe.'
                ], 404);
            }
        });
    }
}

// Custom Exception
class BusinessRuleException extends Exception
{
    protected $errors;
  
    public function __construct($message, array $errors = [])
    {
        parent::__construct($message);
        $this->errors = $errors;
    }
  
    public function getErrors()
    {
        return $this->errors;
    }
}
```

### Logging Strategy - Estrategia de Logs

```php
// config/logging.php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['daily', 'slack'],
    ],
  
    'business' => [
        'driver' => 'daily',
        'path' => storage_path('logs/business.log'),
        'level' => 'info',
    ],
  
    'payments' => [
        'driver' => 'daily', 
        'path' => storage_path('logs/payments.log'),
        'level' => 'debug',
    ],
];

// Uso en servicios
class OrderService
{
    public function processOrder(array $data)
    {
        Log::channel('business')->info('Procesando nueva orden', [
            'user_id' => auth()->id(),
            'items_count' => count($data['items']),
            'total' => $data['total']
        ]);
      
        try {
            $order = Order::create($data);
          
            Log::channel('business')->info('Orden creada exitosamente', [
                'order_id' => $order->id
            ]);
          
            return $order;
          
        } catch (Exception $e) {
            Log::channel('business')->error('Error creando orden', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
          
            throw $e;
        }
    }
}
```

## 🚀 17. Deployment y DevOps

### Environment Configuration

```bash
# .env.production
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tuapp.com

# Base de datos
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=produccion_db
DB_USERNAME=user_prod
DB_PASSWORD=secure_password

# Cache y Sesiones
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525

# Servicios externos
STRIPE_KEY=pk_live_...
STRIPE_SECRET=sk_live_...
```

### Deployment Script

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Iniciando deployment..."

# Activar modo mantenimiento
php artisan down --message="Actualizando sistema..." --retry=60

# Actualizar código
git pull origin main

# Instalar dependencias
composer install --no-dev --optimize-autoloader

# Optimizaciones
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Migraciones
php artisan migrate --force

# Limpiar cache
php artisan cache:clear

# Reiniciar queue workers
php artisan queue:restart

# Desactivar modo mantenimiento
php artisan up

echo "✅ Deployment completado!"
```

## 📚 Resumen de Conceptos Clave

### 🎯 Los 10 Principios del Maestro Laravel

1. **Single Responsibility**: Cada clase hace una sola cosa, pero la hace perfecta
2. **Dependency Injection**: Deja que Laravel te traiga lo que necesitas
3. **Eloquent Relationships**: Las relaciones son tu mejor amiga
4. **Queue Everything Heavy**: Si toma tiempo, hazlo en background
5. **Cache Intelligently**: Cache lo que consultas, no lo que cambias
6. **Test Everything**: Sin tests, no hay confianza
7. **Validate Early**: Valida en la puerta, no en la sala
8. **Log Strategically**: Log lo importante, no todo
9. **Optimize Late**: Haz que funcione, luego haz que vaya rápido
10. **Deploy Safely**: Automatiza para no llorar

### 🛠️ Comandos Artisan Esenciales

```bash
# Creación
php artisan make:model Post -mfsc      # Modelo + migración + factory + seeder + controlador
php artisan make:request StorePostRequest
php artisan make:job ProcessPayment
php artisan make:mail OrderShipped
php artisan make:command CleanupPosts

# Optimización
php artisan config:cache
php artisan route:cache  
php artisan view:cache
php artisan optimize

# Base de datos
php artisan migrate:fresh --seed
php artisan db:seed --class=UserSeeder

# Queue
php artisan queue:work --tries=3
php artisan queue:restart

# Limpieza
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

### 🏆 Patrones de Código de Elite

**Controladores Delgados**:

```php
// ❌ Controlador gordo
class PostController extends Controller
{
    public function store(Request $request)
    {
        // 50 líneas de lógica aquí...
    }
}

// ✅ Controlador delgado
class PostController extends Controller
{
    public function store(StorePostRequest $request, PostService $service)
    {
        $post = $service->create($request->validated());
        return new PostResource($post);
    }
}
```

**Queries Eficientes**:

```php
// ❌ N+1 Problem
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name; // Consulta por cada post
}

// ✅ Eager Loading
$posts = Post::with('author')->get();
foreach ($posts as $post) {
    echo $post->author->name; // Una sola consulta extra
}
```

**Manejo de Errores**:

```php
// ❌ Sin manejo
$user = User::find($id);
return $user->name; // Puede explotar

// ✅ Con manejo elegante
$user = User::findOrFail($id);
return $user->name; // Laravel maneja el error automáticamente
```

---

¡Felicidades! 🎉 Has completado la Laravel Backend Masterclass. Con estos conocimientos y prácticas, estás listo para construir aplicaciones robustas, escalables y mantenibles. Recuerda: Laravel es poderoso porque hace lo complejo simple, no porque haga lo simple complejo.
