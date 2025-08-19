---
title: 'Rule:: Masterclass'
code: 'laravel'
description: 'Rule:: Masterclass'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Rule:: Masterclass 🎯
## La Navaja Suiza de las Validaciones Laravel

---

## 📚 Índice
1. [¿Qué es Rule::?](#que-es-rule)
2. [Métodos Esenciales](#metodos-esenciales)
3. [Rule::unique() - El Maestro](#rule-unique)
4. [Rule::exists() - El Verificador](#rule-exists)
5. [Rule::in() y Rule::notIn()](#rule-in-notin)
6. [Rule::when() - Validaciones Condicionales](#rule-when)
7. [Rule::dimensions() - Para Imágenes](#rule-dimensions)
8. [Rule::file() - Para Archivos](#rule-file)
9. [Combinaciones Avanzadas](#combinaciones-avanzadas)
10. [Casos Reales del Mundo](#casos-reales)
11. [Performance y Optimización](#performance)
12. [Patrones Profesionales](#patrones-profesionales)

---

## 🎯 ¿Qué es Rule::? {#que-es-rule}

**Rule::** es una clase facade que te permite crear reglas de validación complejas de forma fluida y expresiva.

### **Analogía**: 
Piensa en `Rule::` como un **constructor de LEGO profesional**:
- Cada método es una pieza específica
- Puedes combinar piezas para crear estructuras complejas
- El resultado final es una regla de validación poderosa y legible

### **¿Por qué usar Rule:: en lugar de strings?**
```php
// ❌ String simple - limitado y difícil de leer
'email' => 'unique:users,email,10,id,account_type,premium'

// ✅ Rule:: - expresivo y flexible
'email' => [
    Rule::unique('users', 'email')
        ->ignore(10)
        ->where('account_type', 'premium')
]
```

---

## 🔧 Métodos Esenciales {#metodos-esenciales}

### **Importación**
```php
use Illuminate\Validation\Rule;
```

### **Estructura Básica**
```php
Rule::methodName($parameters)->chainedMethod($moreParameters)
```

---

## 🔐 Rule::unique() - El Maestro {#rule-unique}

### **Sintaxis Básica**
```php
Rule::unique($table, $column = null)
```

### **1. Uso Básico**
```php
// Equivale a: 'unique:users,email'
'email' => [Rule::unique('users', 'email')]

// Si no especificas columna, usa el nombre del campo
'email' => [Rule::unique('users')] // Busca en columna 'email'
```

### **2. Ignorar Registro (Update Forms)**
```php
// Ignora el registro actual en updates
'email' => [
    Rule::unique('users')
        ->ignore($this->user->id)  // Por ID
]

// Ignorar por otra columna
'email' => [
    Rule::unique('users')
        ->ignore($this->user->uuid, 'uuid')  // Por UUID
]

// Ignorar el modelo completo
'email' => [
    Rule::unique('users')
        ->ignore($this->user)  // Laravel extrae automáticamente el ID
]
```

### **3. Condiciones WHERE**
```php
// Un WHERE simple
'email' => [
    Rule::unique('users')
        ->where('account_type', 'premium')
]

// Múltiples WHEREs
'email' => [
    Rule::unique('users')
        ->where('account_type', 'premium')
        ->where('is_active', true)
        ->where('company_id', auth()->user()->company_id)
]

// WHERE con función
'email' => [
    Rule::unique('users')
        ->where(function ($query) {
            return $query->where('account_type', 'premium')
                        ->where('created_at', '>', now()->subDays(30));
        })
]
```

### **4. WHERE NOT**
```php
'username' => [
    Rule::unique('users')
        ->whereNot('status', 'deleted')
        ->whereNotNull('verified_at')
]
```

### **5. Casos Reales Complejos**
```php
// E-commerce: Email único por tienda
'email' => [
    Rule::unique('customers')
        ->where('store_id', $this->store_id)
        ->whereNull('deleted_at')
        ->ignore($this->customer_id ?? null)
]

// Multi-tenant: Usuario único por empresa
'email' => [
    Rule::unique('users')
        ->where('company_id', auth()->user()->company_id)
        ->whereNot('role', 'suspended')
        ->ignore($this->route('user'))
]

// Sistema escolar: Email único por año académico
'student_email' => [
    Rule::unique('students')
        ->where('academic_year', config('school.current_year'))
        ->where('status', 'active')
]
```

---

## ✅ Rule::exists() - El Verificador {#rule-exists}

### **Sintaxis Básica**
```php
Rule::exists($table, $column = null)
```

### **1. Uso Básico**
```php
// Verifica que el ID exista en la tabla
'category_id' => [Rule::exists('categories', 'id')]

// Columna implícita
'category_id' => [Rule::exists('categories')] // Busca en 'category_id'
```

### **2. Con Condiciones**
```php
// Solo categorías activas
'category_id' => [
    Rule::exists('categories', 'id')
        ->where('is_active', true)
]

// Categorías del usuario actual
'category_id' => [
    Rule::exists('categories', 'id')
        ->where('user_id', auth()->id())
        ->whereNull('deleted_at')
]
```

### **3. Casos Avanzados**
```php
// Verificar que el producto pertenece a la tienda
'product_id' => [
    Rule::exists('products', 'id')
        ->where('store_id', $this->store_id)
        ->where('status', 'available')
        ->where('stock', '>', 0)
]

// Verificar relación compleja
'doctor_id' => [
    Rule::exists('doctors', 'id')
        ->where('specialty', $this->required_specialty)
        ->where('is_accepting_patients', true)
        ->whereHas('schedules', function($query) {
            $query->where('available_date', '>=', now());
        })
]
```

---

## 📝 Rule::in() y Rule::notIn() {#rule-in-notin}

### **1. Rule::in() Básico**
```php
// Array estático
'status' => [Rule::in(['active', 'inactive', 'pending'])]

// Array dinámico
'category_id' => [Rule::in(Category::pluck('id'))]
```

### **2. Rule::in() Avanzado**
```php
// Solo categorías activas del usuario
'category_id' => [
    Rule::in(
        Category::where('user_id', auth()->id())
               ->where('is_active', true)
               ->pluck('id')
    )
]

// Con cache para performance
'role_id' => [
    Rule::in(
        cache()->remember('valid_roles_' . auth()->user()->company_id, 3600, function() {
            return Role::where('company_id', auth()->user()->company_id)
                      ->where('is_active', true)
                      ->pluck('id');
        })
    )
]
```

### **3. Rule::notIn()**
```php
// Usernames prohibidos
'username' => [
    Rule::notIn(['admin', 'root', 'system', 'api'])
]

// IDs bloqueados dinámicamente
'user_id' => [
    Rule::notIn(
        BlockedUser::where('blocked_by', auth()->id())
                   ->pluck('user_id')
    )
]
```

---

## 🔀 Rule::when() - Validaciones Condicionales {#rule-when}

### **Sintaxis**
```php
Rule::when($condition, $rules, $defaultRules = [])
```

### **1. Condicional Simple**
```php
'avatar' => [
    'sometimes',
    Rule::when(
        $this->is_premium_user, 
        ['image', 'max:10240'], // 10MB para premium
        ['image', 'max:2048']   // 2MB para usuarios normales
    )
]
```

### **2. Condicionales Complejas**
```php
'shipping_address' => [
    Rule::when(
        $this->delivery_method === 'home_delivery',
        ['required', 'string', 'max:500'],
        ['nullable']
    )
]

'card_number' => [
    Rule::when(
        in_array($this->payment_method, ['credit_card', 'debit_card']),
        ['required', 'string', 'size:16', new CreditCardRule()],
        ['nullable']
    )
]
```

### **3. Múltiples Condiciones**
```php
'document_upload' => [
    Rule::when(
        $this->user()->role === 'admin' && $this->document_type === 'sensitive',
        [
            'required',
            'file',
            'mimes:pdf',
            'max:5120',
            new EncryptedDocumentRule()
        ]
    )
]
```

---

## 🖼️ Rule::dimensions() - Para Imágenes {#rule-dimensions}

### **Sintaxis**
```php
Rule::dimensions()->width($value)->height($value)->minWidth($value)...
```

### **1. Dimensiones Básicas**
```php
'avatar' => [
    'image',
    Rule::dimensions()
        ->minWidth(100)
        ->minHeight(100)
        ->maxWidth(1000)
        ->maxHeight(1000)
]
```

### **2. Ratio Específico**
```php
// Para fotos de perfil cuadradas
'profile_pic' => [
    'image',
    Rule::dimensions()
        ->ratio(1/1)  // Cuadrado perfecto
]

// Para banners 16:9
'banner' => [
    'image',
    Rule::dimensions()
        ->ratio(16/9)
]
```

### **3. Combinaciones Avanzadas**
```php
'product_image' => [
    'required',
    'image',
    'mimes:jpeg,png,webp',
    'max:2048',
    Rule::dimensions()
        ->minWidth(800)
        ->minHeight(600)
        ->maxWidth(2000)
        ->maxHeight(2000)
        ->ratio(4/3)
]
```

---

## 📁 Rule::file() - Para Archivos {#rule-file}

### **1. Tipos de Archivo**
```php
'document' => [
    Rule::file()
        ->types(['pdf', 'doc', 'docx'])
        ->max(5 * 1024) // 5MB
]
```

### **2. Imágenes Específicas**
```php
'photo' => [
    Rule::file()
        ->image()
        ->types(['jpeg', 'png'])
        ->max(2048)
        ->dimensions(Rule::dimensions()->maxWidth(1920)->maxHeight(1080))
]
```

---

## 🚀 Combinaciones Avanzadas {#combinaciones-avanzadas}

### **1. Usuario Único con Múltiples Condiciones**
```php
'email' => [
    'required',
    'email',
    Rule::unique('users')
        ->where('company_id', auth()->user()->company_id)
        ->where('is_active', true)
        ->whereNull('deleted_at')
        ->ignore($this->route('user'))
]
```

### **2. Validación Contextual**
```php
public function rules(): array
{
    $isUpdate = $this->isMethod('PUT');
    $currentUser = auth()->user();
    
    return [
        'role_id' => [
            'required',
            Rule::exists('roles', 'id')
                ->where('company_id', $currentUser->company_id)
                ->where('is_active', true),
            Rule::when(
                !$currentUser->hasRole('super-admin'),
                Rule::in($currentUser->assignable_role_ids)
            )
        ],
        
        'department_id' => [
            Rule::when(
                $this->role_requires_department,
                [
                    'required',
                    Rule::exists('departments', 'id')
                        ->where('company_id', $currentUser->company_id)
                        ->where('is_hiring', true)
                ],
                ['nullable']
            )
        ]
    ];
}
```

---

## 🌍 Casos Reales del Mundo {#casos-reales}

### **1. Sistema Multi-tenant**
```php
class CreatePostRequest extends FormRequest
{
    public function rules(): array
    {
        $tenant = tenant();
        
        return [
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('posts')
                    ->where('tenant_id', $tenant->id)
                    ->whereNull('deleted_at')
            ],
            
            'category_id' => [
                'required',
                Rule::exists('categories', 'id')
                    ->where('tenant_id', $tenant->id)
                    ->where('is_active', true)
            ],
            
            'tags' => [
                'sometimes',
                'array',
                'max:10'
            ],
            
            'tags.*' => [
                Rule::exists('tags', 'id')
                    ->where('tenant_id', $tenant->id)
                    ->where('is_approved', true)
            ]
        ];
    }
}
```

### **2. E-commerce con Inventario**
```php
class AddToCartRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'product_id' => [
                'required',
                Rule::exists('products', 'id')
                    ->where('is_active', true)
                    ->where('stock', '>', 0)
                    ->whereHas('store', function($query) {
                        $query->where('is_open', true);
                    })
            ],
            
            'quantity' => [
                'required',
                'integer',
                'min:1',
                Rule::when(
                    $this->product_id,
                    function() {
                        $product = Product::find($this->product_id);
                        return $product ? "max:{$product->stock}" : 'max:1';
                    }
                )
            ],
            
            'variant_id' => [
                Rule::when(
                    $this->product_has_variants,
                    [
                        'required',
                        Rule::exists('product_variants', 'id')
                            ->where('product_id', $this->product_id)
                            ->where('is_available', true)
                    ]
                )
            ]
        ];
    }
}
```

### **3. Sistema de Reservas**
```php
class BookingRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'resource_id' => [
                'required',
                Rule::exists('resources', 'id')
                    ->where('is_bookable', true)
                    ->where('location_id', $this->location_id)
            ],
            
            'start_time' => [
                'required',
                'date',
                'after:now',
                function($attribute, $value, $fail) {
                    // Verificar disponibilidad usando Rule en closure
                    $conflicts = Booking::where('resource_id', $this->resource_id)
                        ->where('start_time', '<=', $value)
                        ->where('end_time', '>', $value)
                        ->exists();
                        
                    if ($conflicts) {
                        $fail('El recurso no está disponible en ese horario.');
                    }
                }
            ],
            
            'attendees' => [
                'sometimes',
                'array',
                'max:50'
            ],
            
            'attendees.*' => [
                Rule::exists('users', 'id')
                    ->where('is_active', true)
                    ->where('company_id', auth()->user()->company_id)
            ]
        ];
    }
}
```

---

## ⚡ Performance y Optimización {#performance}

### **1. Cache para Consultas Repetitivas**
```php
class ProductRequest extends FormRequest
{
    protected $validCategories;
    protected $validBrands;
    
    public function __construct()
    {
        parent::__construct();
        
        // Cache por 1 hora
        $this->validCategories = cache()->remember('categories_ids', 3600, function() {
            return Category::where('is_active', true)->pluck('id');
        });
        
        $this->validBrands = cache()->remember('brands_ids', 3600, function() {
            return Brand::where('is_approved', true)->pluck('id');
        });
    }
    
    public function rules(): array
    {
        return [
            'category_id' => [Rule::in($this->validCategories)],
            'brand_id' => [Rule::in($this->validBrands)],
        ];
    }
}
```

### **2. Lazy Loading de Validaciones**
```php
class UserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'department_id' => [
                Rule::when(
                    $this->filled('department_id'),
                    function() {
                        // Solo consulta si el campo está presente
                        return [
                            Rule::exists('departments', 'id')
                                ->where('company_id', auth()->user()->company_id)
                        ];
                    }
                )
            ]
        ];
    }
}
```

---

## 🏆 Patrones Profesionales {#patrones-profesionales}

### **1. Builder Pattern para Reglas Complejas**
```php
class ValidationRuleBuilder
{
    public static function uniqueForTenant($table, $column = null): Rule
    {
        return Rule::unique($table, $column)
            ->where('tenant_id', tenant()->id)
            ->whereNull('deleted_at');
    }
    
    public static function existsForUser($table, $column = 'id'): Rule
    {
        return Rule::exists($table, $column)
            ->where('user_id', auth()->id())
            ->where('is_active', true);
    }
    
    public static function inActiveRecords($model): Rule
    {
        return Rule::in(
            $model::where('is_active', true)->pluck('id')
        );
    }
}

// Uso
'category_id' => [
    'required',
    ValidationRuleBuilder::existsForUser('categories')
],

'tag_ids.*' => [
    ValidationRuleBuilder::inActiveRecords(Tag::class)
]
```

### **2. Factory Method Pattern**
```php
class RuleFactory
{
    public static function forModel(string $model, array $conditions = []): array
    {
        $rules = [
            Rule::exists($model::getTable(), 'id')
        ];
        
        foreach ($conditions as $field => $value) {
            $rules[0]->where($field, $value);
        }
        
        return $rules;
    }
}

// Uso
'user_id' => RuleFactory::forModel(User::class, [
    'is_active' => true,
    'company_id' => auth()->user()->company_id
])
```

### **3. Trait para Reutilización**
```php
trait HasAdvancedValidationRules
{
    protected function uniqueIgnoringCurrent($table, $column, $ignore = null): Rule
    {
        $rule = Rule::unique($table, $column);
        
        if ($ignore) {
            $rule->ignore($ignore);
        } elseif ($this->route() && $this->route()->parameter('id')) {
            $rule->ignore($this->route()->parameter('id'));
        }
        
        return $rule;
    }
    
    protected function existsWithConditions($table, $conditions = []): Rule
    {
        $rule = Rule::exists($table, 'id');
        
        foreach ($conditions as $field => $value) {
            if (is_callable($value)) {
                $rule->where($value);
            } else {
                $rule->where($field, $value);
            }
        }
        
        return $rule;
    }
}
```

---

## 💡 Tips de Experto

### **1. Debugging Rules**
```php
// Para debuggear qué está pasando
'email' => [
    Rule::unique('users')
        ->where('company_id', auth()->user()->company_id)
        ->ignore($this->user)
        ->tap(function($rule) {
            // Esto te ayuda a ver la query generada
            logger('Unique rule query: ' . $rule->toSql());
        })
]
```

### **2. Reglas Dinámicas Inteligentes**
```php
public function rules(): array
{
    $rules = [
        'name' => ['required', 'string'],
    ];
    
    // Añadir reglas dinámicamente
    if ($this->isCreating()) {
        $rules['email'][] = Rule::unique('users');
    } else {
        $rules['email'][] = Rule::unique('users')->ignore($this->route('user'));
    }
    
    return $rules;
}
```

### **3. Performance Monitoring**
```php
'category_ids' => [
    Rule::in(
        DB::enableQueryLog() ? 
        Category::active()->pluck('id') : 
        cache()->remember('active_categories', 3600, fn() => Category::active()->pluck('id'))
    )
]
```

---

## 🎯 Resumen Ejecutivo

**Rule::** te permite:
- ✅ **Crear validaciones expresivas y legibles**
- ✅ **Combinar múltiples condiciones fácilmente**
- ✅ **Reutilizar patrones complejos**
- ✅ **Optimizar performance con cache**
- ✅ **Manejar casos edge de forma elegante**

### **Cuándo usar Rule:: vs strings:**
- **Strings**: Validaciones simples y estáticas
- **Rule::**: Validaciones dinámicas, condicionales o complejas

### **Métodos más usados:**
1. `Rule::unique()` - Para evitar duplicados
2. `Rule::exists()` - Para verificar relaciones
3. `Rule::in()` - Para listas dinámicas
4. `Rule::when()` - Para lógica condicional

¡Ahora dominas completamente `Rule::`! 🚀