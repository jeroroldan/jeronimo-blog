---
title: 'Mejores Prácticas en Laravel'
code: "laravarel"
description: 'Guía Completa de Mejores Prácticas en Laravel'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía Completa de Mejores Prácticas en Laravel

## Tabla de Contenidos

1. [Tipado y Declaraciones Estrictas](#tipado-y-declaraciones-estrictas)
2. [Consultas a la Base de Datos](#consultas-a-la-base-de-datos)
3. [Validaciones](#validaciones)
4. [Manejo de Errores y Excepciones](#manejo-de-errores-y-excepciones)
5. [Arquitectura y Organización de Clases](#arquitectura-y-organización-de-clases)
6. [DTOs y Value Objects](#dtos-y-value-objects)
7. [Services y Repositories](#services-y-repositories)
8. [Testing](#testing)
9. [Performance y Optimización](#performance-y-optimización)
10. [Logging y Debugging](#logging-y-debugging)

---

## Tipado y Declaraciones Estrictas

### Declaración de Tipos Estrictos

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\DTOs\UserData;
use Illuminate\Support\Collection;
```

### Tipado de Propiedades (PHP 7.4+)

```php
class UserService
{
    private UserRepository $userRepository;
    private EmailService $emailService;
    private ?string $defaultRole = null;
    private array $allowedRoles = [];
    private bool $isActive = true;
  
    public function __construct(
        UserRepository $userRepository,
        EmailService $emailService
    ) {
        $this->userRepository = $userRepository;
        $this->emailService = $emailService;
    }
}
```

### Tipado de Métodos Completo

```php
class UserService
{
    public function createUser(UserData $userData): User
    {
        // Implementación
    }
  
    public function getUserById(int $id): ?User
    {
        return $this->userRepository->find($id);
    }
  
    public function getAllActiveUsers(): Collection
    {
        return $this->userRepository->getActive();
    }
  
    public function updateUserEmail(User $user, string $newEmail): bool
    {
        // Implementación
        return true;
    }
  
    public function deleteUser(User $user): void
    {
        $this->userRepository->delete($user);
    }
  
    /**
     * @param array<string> $roles
     * @return Collection<User>
     */
    public function getUsersByRoles(array $roles): Collection
    {
        return $this->userRepository->findByRoles($roles);
    }
}
```

### Union Types (PHP 8.0+)

```php
class PaymentService
{
    public function processPayment(int|string $amount): bool
    {
        // Maneja tanto entero como string
    }
  
    public function getPaymentMethod(): CreditCard|PayPal|BankTransfer
    {
        // Retorna uno de los tipos especificados
    }
}
```

### Named Arguments y Constructor Property Promotion (PHP 8.0+)

```php
class UserData
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $phone = null,
        public readonly bool $isActive = true,
        public readonly array $roles = []
    ) {}
}

// Uso con named arguments
$userData = new UserData(
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+54911234567',
    roles: ['user', 'editor']
);
```

---

## Consultas a la Base de Datos

### Eloquent: Mejores Prácticas

#### Consultas Básicas Optimizadas

```php
class UserRepository
{
    public function findActiveUsersWithPosts(): Collection
    {
        return User::query()
            ->where('is_active', true)
            ->with(['posts' => function ($query) {
                $query->where('status', 'published')
                      ->orderBy('created_at', 'desc');
            }])
            ->orderBy('name')
            ->get();
    }
  
    public function findUserWithRoles(int $userId): ?User
    {
        return User::query()
            ->with('roles')
            ->find($userId);
    }
  
    public function getUsersPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return User::query()
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
}
```

#### Prevenir Consultas N+1

```php
// ❌ Incorrecto - Problema N+1
public function getPostsWithAuthors(): Collection
{
    $posts = Post::all();
  
    foreach ($posts as $post) {
        echo $post->user->name; // Nueva consulta por cada post
    }
  
    return $posts;
}

// ✅ Correcto - Eager Loading
public function getPostsWithAuthors(): Collection
{
    return Post::query()
        ->with('user')
        ->get();
}

// ✅ Más específico - Solo campos necesarios
public function getPostsWithAuthorNames(): Collection
{
    return Post::query()
        ->with('user:id,name,email')
        ->get();
}
```

#### Consultas Complejas con Subqueries

```php
public function getUsersWithLatestPost(): Collection
{
    return User::query()
        ->addSelect([
            'latest_post_title' => Post::select('title')
                ->whereColumn('user_id', 'users.id')
                ->latest()
                ->limit(1)
        ])
        ->withCount(['posts as published_posts_count' => function ($query) {
            $query->where('status', 'published');
        }])
        ->get();
}
```

#### Scopes para Reutilización

```php
// En el modelo User
class User extends Model
{
    public function scopeActive($query): Builder
    {
        return $query->where('is_active', true);
    }
  
    public function scopeWithRole($query, string $role): Builder
    {
        return $query->whereHas('roles', function ($q) use ($role) {
            $q->where('name', $role);
        });
    }
  
    public function scopeCreatedBetween($query, Carbon $startDate, Carbon $endDate): Builder
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }
}

// Uso
$adminUsers = User::active()
    ->withRole('admin')
    ->createdBetween(now()->subMonth(), now())
    ->get();
```

### Query Builder para Consultas Complejas

```php
class ReportRepository
{
    public function getMonthlyUserStats(): Collection
    {
        return DB::table('users')
            ->select([
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as total_users'),
                DB::raw('SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users')
            ])
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();
    }
  
    public function getUsersWithPostCounts(): Collection
    {
        return DB::table('users')
            ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
            ->select([
                'users.id',
                'users.name',
                'users.email',
                DB::raw('COUNT(posts.id) as posts_count')
            ])
            ->groupBy('users.id', 'users.name', 'users.email')
            ->having('posts_count', '>', 0)
            ->get();
    }
}
```

### Transacciones

```php
class UserService
{
    public function createUserWithProfile(UserData $userData, ProfileData $profileData): User
    {
        return DB::transaction(function () use ($userData, $profileData) {
            $user = User::create([
                'name' => $userData->name,
                'email' => $userData->email,
                'password' => Hash::make($userData->password),
            ]);
        
            $user->profile()->create([
                'bio' => $profileData->bio,
                'avatar' => $profileData->avatar,
            ]);
        
            $user->assignRole('user');
        
            event(new UserCreated($user));
        
            return $user;
        });
    }
  
    public function transferUserPosts(User $fromUser, User $toUser): void
    {
        DB::transaction(function () use ($fromUser, $toUser) {
            $fromUser->posts()->update(['user_id' => $toUser->id]);
            $fromUser->update(['is_active' => false]);
        
            Log::info('Posts transferred', [
                'from_user' => $fromUser->id,
                'to_user' => $toUser->id,
                'posts_count' => $fromUser->posts()->count()
            ]);
        });
    }
}
```

---

## Validaciones

### Form Requests Completos

```php
class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->can('create', User::class);
    }
  
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'min:2'],
            'email' => [
                'required',
                'email:rfc,dns',
                'max:255',
                Rule::unique('users')->ignore($this->user),
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/',
            ],
            'role' => ['required', 'string', Rule::in(['admin', 'editor', 'user'])],
            'birth_date' => ['nullable', 'date', 'before:today'],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'tags' => ['nullable', 'array', 'max:5'],
            'tags.*' => ['string', 'max:50'],
        ];
    }
  
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'email.unique' => 'Este email ya está registrado.',
            'password.regex' => 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.',
            'role.in' => 'El rol seleccionado no es válido.',
            'birth_date.before' => 'La fecha de nacimiento debe ser anterior a hoy.',
        ];
    }
  
    public function attributes(): array
    {
        return [
            'birth_date' => 'fecha de nacimiento',
            'avatar' => 'imagen de perfil',
        ];
    }
  
    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => strtolower($this->email),
            'name' => ucwords(strtolower($this->name)),
        ]);
    }
  
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            if ($this->somethingElseIsInvalid()) {
                $validator->errors()->add('field', 'Something is wrong with this field!');
            }
        });
    }
  
    private function somethingElseIsInvalid(): bool
    {
        // Lógica de validación personalizada
        return false;
    }
}
```

### Custom Validation Rules

```php
class ValidEmailDomainRule implements Rule
{
    private array $allowedDomains;
  
    public function __construct(array $allowedDomains = [])
    {
        $this->allowedDomains = $allowedDomains ?: [
            'gmail.com',
            'hotmail.com',
            'yahoo.com',
            'outlook.com'
        ];
    }
  
    public function passes($attribute, $value): bool
    {
        $domain = substr(strrchr($value, "@"), 1);
        return in_array($domain, $this->allowedDomains);
    }
  
    public function message(): string
    {
        return 'El dominio del email no está permitido. Dominios válidos: ' . 
               implode(', ', $this->allowedDomains);
    }
}

// Uso en Request
'email' => ['required', 'email', new ValidEmailDomainRule()],
```

### Validation Rules como Invokable

```php
class UniqueSlugRule
{
    private string $table;
    private ?int $ignoreId;
  
    public function __construct(string $table, ?int $ignoreId = null)
    {
        $this->table = $table;
        $this->ignoreId = $ignoreId;
    }
  
    public function __invoke($attribute, $value, $fail): void
    {
        $query = DB::table($this->table)->where('slug', $value);
    
        if ($this->ignoreId) {
            $query->where('id', '!=', $this->ignoreId);
        }
    
        if ($query->exists()) {
            $fail('El slug ya está en uso.');
        }
    }
}
```

### Validaciones Condicionales Avanzadas

```php
class CreatePostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string', 'min:100'],
            'status' => ['required', Rule::in(['draft', 'published', 'scheduled'])],
            'published_at' => [
                'nullable',
                'date',
                'after:now',
                Rule::requiredIf($this->status === 'scheduled'),
            ],
            'category_id' => [
                'required',
                'exists:categories,id',
                Rule::exists('categories', 'id')->where('is_active', true),
            ],
            'tags' => ['nullable', 'array', 'max:10'],
            'tags.*' => ['exists:tags,id'],
            'featured_image' => [
                Rule::requiredIf($this->status === 'published'),
                'image',
                'mimes:jpeg,png,webp',
                'max:5120', // 5MB
            ],
        ];
    }
  
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            if ($this->status === 'published' && !$this->hasRequiredFields()) {
                $validator->errors()->add('status', 'No se puede publicar sin completar todos los campos requeridos.');
            }
        });
    }
  
    private function hasRequiredFields(): bool
    {
        return $this->filled(['title', 'content', 'category_id', 'featured_image']);
    }
}
```

---

## Manejo de Errores y Excepciones

### Custom Exceptions

```php
namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserNotFoundException extends Exception
{
    public function __construct(int $userId)
    {
        parent::__construct("Usuario con ID {$userId} no encontrado.");
    }
  
    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'error' => 'Usuario no encontrado',
            'message' => $this->getMessage(),
        ], 404);
    }
}

class InvalidEmailException extends Exception
{
    public function __construct(string $email)
    {
        parent::__construct("El email {$email} no es válido.");
    }
}

class InsufficientPermissionsException extends Exception
{
    public function __construct(string $action)
    {
        parent::__construct("No tienes permisos para realizar la acción: {$action}");
    }
  
    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'error' => 'Permisos insuficientes',
            'message' => $this->getMessage(),
        ], 403);
    }
}
```

### Handler de Excepciones Personalizado

```php
// En App\Exceptions\Handler
class Handler extends ExceptionHandler
{
    protected $dontReport = [
        UserNotFoundException::class,
        InvalidEmailException::class,
    ];
  
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            if ($e instanceof CustomBusinessException) {
                Log::channel('business')->error('Business logic error', [
                    'exception' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'user_id' => auth()->id(),
                ]);
            }
        });
    
        $this->renderable(function (ValidationException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Los datos proporcionados no son válidos.',
                    'errors' => $e->errors(),
                ], 422);
            }
        });
    }
}
```

### Try-Catch en Services

```php
class UserService
{
    public function createUser(UserData $userData): User
    {
        try {
            DB::beginTransaction();
        
            $user = User::create([
                'name' => $userData->name,
                'email' => $userData->email,
                'password' => Hash::make($userData->password),
            ]);
        
            $this->emailService->sendWelcomeEmail($user);
        
            DB::commit();
        
            Log::info('Usuario creado exitosamente', ['user_id' => $user->id]);
        
            return $user;
        
        } catch (QueryException $e) {
            DB::rollBack();
        
            Log::error('Error de base de datos al crear usuario', [
                'error' => $e->getMessage(),
                'data' => $userData->toArray(),
            ]);
        
            throw new UserCreationException('Error al crear el usuario en la base de datos.');
        
        } catch (Exception $e) {
            DB::rollBack();
        
            Log::error('Error inesperado al crear usuario', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        
            throw new UserCreationException('Error inesperado al crear el usuario.');
        }
    }
  
    public function getUserById(int $id): User
    {
        $user = User::find($id);
    
        if (!$user) {
            throw new UserNotFoundException($id);
        }
    
        return $user;
    }
  
    public function updateUserEmail(User $user, string $newEmail): void
    {
        if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidEmailException($newEmail);
        }
    
        if (User::where('email', $newEmail)->where('id', '!=', $user->id)->exists()) {
            throw new DuplicateEmailException($newEmail);
        }
    
        try {
            $user->update(['email' => $newEmail]);
        
            Log::info('Email actualizado', [
                'user_id' => $user->id,
                'old_email' => $user->getOriginal('email'),
                'new_email' => $newEmail,
            ]);
        
        } catch (QueryException $e) {
            Log::error('Error al actualizar email', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        
            throw new UserUpdateException('Error al actualizar el email del usuario.');
        }
    }
}
```

---

## Arquitectura y Organización de Clases

### Service Layer Pattern

```php
namespace App\Services;

class UserService
{
    public function __construct(
        private UserRepository $userRepository,
        private EmailService $emailService,
        private AuditService $auditService
    ) {}
  
    public function createUser(CreateUserData $data): User
    {
        $user = $this->userRepository->create($data);
        $this->emailService->sendWelcomeEmail($user);
        $this->auditService->logUserCreation($user);
    
        return $user;
    }
  
    public function deactivateUser(User $user, string $reason): void
    {
        $this->userRepository->deactivate($user);
        $this->emailService->sendDeactivationNotice($user, $reason);
        $this->auditService->logUserDeactivation($user, $reason);
    }
}
```

### Repository Pattern

```php
namespace App\Repositories;

interface UserRepositoryInterface
{
    public function find(int $id): ?User;
    public function create(array $data): User;
    public function update(User $user, array $data): bool;
    public function delete(User $user): bool;
    public function findByEmail(string $email): ?User;
    public function getActiveUsers(): Collection;
}

class UserRepository implements UserRepositoryInterface
{
    public function find(int $id): ?User
    {
        return User::find($id);
    }
  
    public function create(array $data): User
    {
        return User::create($data);
    }
  
    public function update(User $user, array $data): bool
    {
        return $user->update($data);
    }
  
    public function delete(User $user): bool
    {
        return $user->delete();
    }
  
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
  
    public function getActiveUsers(): Collection
    {
        return User::where('is_active', true)->get();
    }
  
    public function findWithRoles(int $id): ?User
    {
        return User::with('roles')->find($id);
    }
  
    public function searchUsers(string $query): Collection
    {
        return User::where('name', 'LIKE', "%{$query}%")
            ->orWhere('email', 'LIKE', "%{$query}%")
            ->get();
    }
}
```

### Action Classes (Single Responsibility)

```php
namespace App\Actions;

class CreateUserAction
{
    public function __construct(
        private UserRepository $userRepository,
        private HashService $hashService,
        private EmailService $emailService
    ) {}
  
    public function execute(CreateUserData $data): User
    {
        $hashedPassword = $this->hashService->hash($data->password);
    
        $user = $this->userRepository->create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => $hashedPassword,
        ]);
    
        $this->emailService->sendWelcomeEmail($user);
    
        return $user;
    }
}

class UpdateUserProfileAction
{
    public function __construct(private UserRepository $userRepository) {}
  
    public function execute(User $user, UpdateProfileData $data): User
    {
        $this->userRepository->update($user, [
            'name' => $data->name,
            'bio' => $data->bio,
            'avatar' => $data->avatar,
        ]);
    
        return $user->refresh();
    }
}
```

---

## DTOs y Value Objects

### Data Transfer Objects

```php
namespace App\DTOs;

class UserData
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $password,
        public readonly ?string $phone = null,
        public readonly array $roles = []
    ) {}
  
    public static function fromRequest(Request $request): self
    {
        return new self(
            name: $request->string('name'),
            email: $request->string('email'),
            password: $request->string('password'),
            phone: $request->string('phone'),
            roles: $request->array('roles')
        );
    }
  
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            password: $data['password'],
            phone: $data['phone'] ?? null,
            roles: $data['roles'] ?? []
        );
    }
  
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
            'phone' => $this->phone,
            'roles' => $this->roles,
        ];
    }
}

class PostData
{
    public function __construct(
        public readonly string $title,
        public readonly string $content,
        public readonly string $status,
        public readonly int $categoryId,
        public readonly ?Carbon $publishedAt = null,
        public readonly array $tags = []
    ) {}
  
    public function isScheduled(): bool
    {
        return $this->status === 'scheduled' && $this->publishedAt !== null;
    }
  
    public function isPublished(): bool
    {
        return $this->status === 'published';
    }
}
```

### Value Objects

```php
namespace App\ValueObjects;

class Email
{
    private string $value;
  
    public function __construct(string $email)
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Email inválido: {$email}");
        }
    
        $this->value = strtolower($email);
    }
  
    public function getValue(): string
    {
        return $this->value;
    }
  
    public function getDomain(): string
    {
        return substr(strrchr($this->value, "@"), 1);
    }
  
    public function equals(Email $other): bool
    {
        return $this->value === $other->value;
    }
  
    public function __toString(): string
    {
        return $this->value;
    }
}

class Money
{
    private int $amount; // En centavos
    private string $currency;
  
    public function __construct(int $amount, string $currency = 'ARS')
    {
        if ($amount < 0) {
            throw new InvalidArgumentException('El monto no puede ser negativo');
        }
    
        $this->amount = $amount;
        $this->currency = $currency;
    }
  
    public static function fromFloat(float $amount, string $currency = 'ARS'): self
    {
        return new self((int) round($amount * 100), $currency);
    }
  
    public function getAmount(): int
    {
        return $this->amount;
    }
  
    public function getAmountAsFloat(): float
    {
        return $this->amount / 100;
    }
  
    public function getCurrency(): string
    {
        return $this->currency;
    }
  
    public function add(Money $other): self
    {
        $this->ensureSameCurrency($other);
        return new self($this->amount + $other->amount, $this->currency);
    }
  
    public function subtract(Money $other): self
    {
        $this->ensureSameCurrency($other);
        return new self($this->amount - $other->amount, $this->currency);
    }
  
    private function ensureSameCurrency(Money $other): void
    {
        if ($this->currency !== $other->currency) {
            throw new InvalidArgumentException('No se pueden operar montos con diferentes monedas');
        }
    }
}
```

---

## Services y Repositories

### Service Provider para Inyección de Dependencias

```php
namespace App\Providers;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(PostRepositoryInterface::class, PostRepository::class);
        $this->app->bind(OrderRepositoryInterface::class, OrderRepository::class);
    }
}
```

### Service con Múltiples Responsabilidades Organizadas

```php
namespace App\Services;

class OrderService
{
    public function __construct(
        private OrderRepository $orderRepository,
        private ProductRepository $productRepository,
        private PaymentService $paymentService,
        private InventoryService $inventoryService,
        private EmailService $emailService
    ) {}
  
    public function createOrder(CreateOrderData $data): Order
    {
        $this->validateOrderData($data);
    
        return DB::transaction(function () use ($data) {
            $order = $this->orderRepository->create([
                'user_id' => $data->userId,
                'status' => 'pending',
                'total' => $this->calculateTotal($data->items),
            ]);
        
            $this->attachOrderItems($order, $data->items);
            $this->inventoryService->reserveStock($data->items);
        
            return $order;
        });
    }
  
    public function processPayment(Order $order, PaymentData $paymentData): bool
    {
        try {
            $paymentResult = $this->paymentService->charge(
                $order->total,
                $paymentData
            );
        
            if ($paymentResult->isSuccessful()) {
                $this->orderRepository->update($order, [
                    'status' => 'paid',
                    'payment_id' => $paymentResult->getId(),
                ]);
            
                $this->emailService->sendOrderConfirmation($order);
            
                return true;
            }
        
            return false;
        
        } catch (PaymentException $e) {
            $this->orderRepository->update($order, ['status' => 'payment_failed']);
            throw $e;
        }
    }
  
    private function validateOrderData(CreateOrderData $data): void
    {
        if (empty($data->items)) {
            throw new InvalidOrderException('El pedido debe tener al menos un item');
        }
    
        foreach ($data->items as $item) {
            $product = $this->productRepository->find($item->productId);
        
            if (!$product || !$product->isAvailable()) {
                throw new ProductNotAvailableException($item->productId);
            }
        }
    }
  
    private function calculateTotal(array $items): Money
    {
        $total = Money::fromFloat(0);
    
        foreach ($items as $item) {
            $product = $this->productRepository->find($item->productId);
            $itemTotal = $product->price->multiply($item->quantity);
            $total = $total->add($itemTotal);
        }
    
        return $total;
    }
}
```

---

## Testing

### Feature Tests

```php
namespace Tests\Feature;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;
  
    public function test_can_create_user_with_valid_data(): void
    {
        $userData = [
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
        ];
    
        $response = $this->postJson('/api/users', $userData);
    
        $response->assertStatus(201)
                ->assertJsonStructure([
                    'data' => ['id', 'name', 'email', 'created_at']
                ]);
    
        $this->assertDatabaseHas('users', [
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
        ]);
    }
  
    public function test_cannot_create_user_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'existing@example.com']);
    
        $userData = [
            'name' => 'Nuevo Usuario',
            'email' => 'existing@example.com',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
        ];
    
        $response = $this->postJson('/api/users', $userData);
    
        $response->assertStatus(422)
                ->assertJsonValidationErrors('email');
    }
}
```

### Unit Tests

```php
namespace Tests\Unit;

class UserServiceTest extends TestCase
{
    private UserService $userService;
    private UserRepository $userRepository;
    private EmailService $emailService;
  
    protected function setUp(): void
    {
        parent::setUp();
    
        $this->userRepository = Mockery::mock(UserRepository::class);
        $this->emailService = Mockery::mock(EmailService::class);
    
        $this->userService = new UserService(
            $this->userRepository,
            $this->emailService
        );
    }
  
    public function test_creates_user_successfully(): void
    {
        $userData = new UserData(
            name: 'Juan Pérez',
            email: 'juan@example.com',
            password: 'password123'
        );
    
        $expectedUser = new User([
            'id' => 1,
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
        ]);
    
        $this->userRepository
            ->shouldReceive('create')
            ->once()
            ->with($userData)
            ->andReturn($expectedUser);
        
        $this->emailService
            ->shouldReceive('sendWelcomeEmail')
            ->once()
            ->with($expectedUser);
    
        $result = $this->userService->createUser($userData);
    
        $this->assertEquals($expectedUser, $result);
    }
  
    public function test_throws_exception_when_user_not_found(): void
    {
        $this->userRepository
            ->shouldReceive('find')
            ->with(999)
            ->andReturn(null);
    
        $this->expectException(UserNotFoundException::class);
    
        $this->userService->getUserById(999);
    }
}
```

---

## Performance y Optimización

### Eager Loading Inteligente

```php
class PostRepository
{
    public function getPostsForListing(): Collection
    {
        return Post::query()
            ->with([
                'user:id,name',
                'category:id,name,slug',
                'tags:id,name'
            ])
            ->withCount('comments')
            ->published()
            ->latest()
            ->get();
    }
  
    public function getPostsWithStats(): Collection
    {
        return Post::query()
            ->addSelect([
                'comments_count' => Comment::selectRaw('count(*)')
                    ->whereColumn('post_id', 'posts.id'),
                'latest_comment_date' => Comment::select('created_at')
                    ->whereColumn('post_id', 'posts.id')
                    ->latest()
                    ->limit(1)
            ])
            ->get();
    }
}
```

### Caché Estratégico

```php
class CachedUserService
{
    public function __construct(
        private UserRepository $userRepository,
        private CacheManager $cache
    ) {}
  
    public function getUser(int $id): ?User
    {
        return $this->cache->remember(
            "user.{$id}",
            now()->addHours(2),
            fn () => $this->userRepository->find($id)
        );
    }
  
    public function updateUser(User $user, array $data): User
    {
        $updatedUser = $this->userRepository->update($user, $data);
    
        // Invalidar caché
        $this->cache->forget("user.{$user->id}");
    
        return $updatedUser;
    }
  
    public function getActiveUsersCount(): int
    {
        return $this->cache->remember(
            'users.active.count',
            now()->addMinutes(30),
            fn () => User::where('is_active', true)->count()
        );
    }
}
```

### Database Optimization

```php
class OptimizedPostRepository
{
    public function getPostsWithPagination(int $page = 1, int $perPage = 15): LengthAwarePaginator
    {
        return Post::query()
            ->select(['id', 'title', 'slug', 'excerpt', 'created_at', 'user_id'])
            ->with('user:id,name')
            ->published()
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }
  
    public function searchPosts(string $query): Collection
    {
        return Post::query()
            ->whereFullText(['title', 'content'], $query)
            ->orWhere('title', 'LIKE', "%{$query}%")
            ->with('user:id,name')
            ->limit(50)
            ->get();
    }
}
```

---

## Logging y Debugging

### Structured Logging

```php
class AuditLogger
{
    public function logUserAction(User $user, string $action, array $context = []): void
    {
        Log::channel('audit')->info('User action performed', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'action' => $action,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'timestamp' => now()->toISOString(),
            'context' => $context,
        ]);
    }
  
    public function logSecurityEvent(string $event, array $data = []): void
    {
        Log::channel('security')->warning('Security event detected', [
            'event' => $event,
            'ip_address' => request()->ip(),
            'user_id' => auth()->id(),
            'timestamp' => now()->toISOString(),
            'data' => $data,
        ]);
    }
}

class PerformanceLogger
{
    public function logSlowQuery(string $sql, float $executionTime): void
    {
        if ($executionTime > 1000) { // ms
            Log::channel('performance')->warning('Slow query detected', [
                'sql' => $sql,
                'execution_time_ms' => $executionTime,
                'user_id' => auth()->id(),
                'url' => request()->fullUrl(),
            ]);
        }
    }
}
```

### Debug Helpers

```php
class DebugHelper
{
    public static function dumpSql(): void
    {
        DB::listen(function ($query) {
            Log::debug('SQL Query', [
                'sql' => $query->sql,
                'bindings' => $query->bindings,
                'time' => $query->time,
            ]);
        });
    }
  
    public static function measureExecutionTime(callable $callback): array
    {
        $start = microtime(true);
        $result = $callback();
        $end = microtime(true);
    
        return [
            'result' => $result,
            'execution_time' => ($end - $start) * 1000, // ms
        ];
    }
}
```

---

## Resumen de Mejores Prácticas

### Checklist de Calidad de Código

#### ✅ Tipado

- [ ]  Declarar `strict_types=1` en todos los archivos
- [ ]  Tipar todas las propiedades de clase
- [ ]  Tipar parámetros y valores de retorno de métodos
- [ ]  Usar tipos de unión cuando sea apropiado
- [ ]  Documentar tipos complejos con PHPDoc

#### ✅ Consultas

- [ ]  Usar eager loading para evitar N+1
- [ ]  Implementar scopes para consultas reutilizables
- [ ]  Usar transacciones para operaciones complejas
- [ ]  Paginar resultados grandes
- [ ]  Optimizar consultas con índices apropiados

#### ✅ Validaciones

- [ ]  Usar Form Requests para validaciones complejas
- [ ]  Crear custom rules para lógica específica
- [ ]  Validar datos antes de procesarlos
- [ ]  Implementar validaciones condicionales
- [ ]  Proporcionar mensajes de error claros

#### ✅ Manejo de Errores

- [ ]  Crear excepciones personalizadas para diferentes casos
- [ ]  Usar try-catch apropiadamente
- [ ]  Loggear errores con contexto suficiente
- [ ]  Proporcionar respuestas de error consistentes
- [ ]  No exponer información sensible en errores

#### ✅ Arquitectura

- [ ]  Separar lógica de negocio en services
- [ ]  Usar repositories para acceso a datos
- [ ]  Implementar DTOs para transferencia de datos
- [ ]  Aplicar principios SOLID
- [ ]  Mantener bajo acoplamiento

#### ✅ Testing

- [ ]  Escribir tests para casos críticos
- [ ]  Usar factories para datos de prueba
- [ ]  Mockear dependencias externas
- [ ]  Probar casos de error
- [ ]  Mantener cobertura de tests alta

#### ✅ Performance

- [ ]  Implementar caché estratégico
- [ ]  Optimizar consultas N+1
- [ ]  Usar lazy loading cuando corresponda
- [ ]  Monitorear queries lentas
- [ ]  Implementar paginación

---

**Esta guía debe actualizarse regularmente conforme evolucionen las mejores prácticas y las versiones de Laravel/PHP.**
