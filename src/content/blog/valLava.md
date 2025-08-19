---
title: 'Laravel Validation'
code: 'laravel'
description: 'Laravel Validation Masterclass'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Laravel Validation Masterclass 🚀

## 📚 Índice
1. [Fundamentos Esenciales](#fundamentos)
2. [Reglas Básicas con Analogías](#reglas-basicas)
3. [Reglas Avanzadas](#reglas-avanzadas)
4. [Validaciones Condicionales](#validaciones-condicionales)
5. [Reglas Personalizadas](#reglas-personalizadas)
6. [Form Requests Profesionales](#form-requests)
7. [Casos de Uso del Mundo Real](#casos-reales)
8. [Mejores Prácticas y Patrones](#mejores-practicas)
9. [Troubleshooting Común](#troubleshooting)

---

## 🎯 Fundamentos Esenciales {#fundamentos}

### La Filosofía de las Validaciones
Piensa en las validaciones como **porteros de discoteca**:
- Solo dejan pasar datos que cumplen los requisitos
- Verifican la "identificación" (tipo de dato)
- Revisan la "vestimenta" (formato)
- Controlan el "comportamiento" (reglas de negocio)

### Estructura Base
```php
public function rules(): array
{
    return [
        'campo' => ['regla1', 'regla2', 'regla3'],
        'otro_campo' => 'regla1|regla2|regla3', // Sintaxis alternativa
    ];
}
```

---

## 🔧 Reglas Básicas con Analogías {#reglas-basicas}

### 1. **Required** - El Guardian Inflexible
```php
'name' => ['required']
```
**Analogía**: Como un formulario gubernamental, NO PUEDES dejarlo en blanco.

**Variaciones**:
```php
'email' => ['required_if:role,admin'],        // Requerido SI eres admin
'phone' => ['required_unless:has_email,true'], // Requerido A MENOS QUE tengas email
'address' => ['required_with:shipping'],       // Requerido CON envío
'backup_email' => ['required_without:phone'],  // Requerido SIN teléfono
```

### 2. **String, Integer, Numeric** - Los Especialistas en Tipos
```php
'name' => ['string'],           // Solo texto
'age' => ['integer'],           // Solo números enteros
'price' => ['numeric'],         // Números (incluso decimales)
'is_active' => ['boolean'],     // true/false, 1/0, "1"/"0"
```

**Analogía**: Como especialistas médicos, cada uno solo acepta su "especialidad".

### 3. **Min/Max** - Los Medidores
```php
// Para strings (caracteres)
'password' => ['string', 'min:8', 'max:255'],

// Para números (valor)
'age' => ['integer', 'min:18', 'max:120'],

// Para arrays (cantidad de elementos)
'tags' => ['array', 'min:1', 'max:10'],

// Para archivos (KB)
'avatar' => ['file', 'max:2048'], // 2MB máximo
```

**Analogía**: Como límites de velocidad - mínimo y máximo permitido.

### 4. **Email** - El Validador de Direcciones
```php
'email' => ['email'],
'business_email' => ['email:rfc,dns'], // Más estricto
```

**Analogía**: Como un cartero que verifica si la dirección existe realmente.

### 5. **Unique** - El Detective de Duplicados
```php
// Básico
'email' => ['unique:users'],

// Ignorando el registro actual (útil en updates)
'email' => ['unique:users,email,' . $this->user->id],

// Con condiciones adicionales
'email' => ['unique:users,email,NULL,id,account_type,premium'],
```

**Analogía**: Como un detective que busca en toda la base de datos para asegurar que no haya duplicados.

---

## 🎛️ Reglas Avanzadas {#reglas-avanzadas}

### 1. **In/Not In** - Los Selectores Exclusivos
```php
'status' => ['in:active,inactive,pending'],
'forbidden_usernames' => ['not_in:admin,root,system'],

// Con arrays dinámicos
'category_id' => [Rule::in(Category::pluck('id'))],
```

**Analogía**: Como una lista VIP - solo ciertos valores están invitados.

### 2. **Exists** - El Verificador de Referencias
```php
'user_id' => ['exists:users,id'],
'category_id' => ['exists:categories,id,deleted_at,NULL'], // Solo no eliminados
```

**Analogía**: Como verificar que tu referencia laboral realmente exista en la empresa.

### 3. **Regex** - El Detective de Patrones
```php
'phone' => ['regex:/^\+?[1-9]\d{1,14}$/'],          // Teléfono internacional
'slug' => ['regex:/^[a-z0-9-]+$/'],                 // Solo minúsculas, números y guiones
'color_hex' => ['regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'], // Color hexadecimal
```

**Casos comunes**:
```php
// DNI argentino
'dni' => ['regex:/^\d{7,8}$/'],

// CUIT/CUIL
'cuit' => ['regex:/^\d{2}-\d{8}-\d{1}$/'],

// Código postal argentino
'postal_code' => ['regex:/^[A-Z]\d{4}[A-Z]{3}$/'],
```

### 4. **Date Validations** - Los Guardianes del Tiempo
```php
'birth_date' => ['date', 'before:today'],
'event_date' => ['date', 'after:tomorrow'],
'contract_end' => ['date', 'after:contract_start'],
'appointment' => ['date_format:Y-m-d H:i:s'],
```

**Ejemplos avanzados**:
```php
// Solo días laborables
'meeting_date' => ['date', function ($attribute, $value, $fail) {
    $date = Carbon::parse($value);
    if ($date->isWeekend()) {
        $fail('Las reuniones solo pueden ser en días laborables.');
    }
}],
```

### 5. **File Validations** - Los Inspectores de Archivos
```php
'document' => [
    'file',
    'mimes:pdf,doc,docx',
    'max:5120', // 5MB
],

'image' => [
    'image',
    'dimensions:min_width=300,min_height=200',
    'mimes:jpeg,png,jpg',
    'max:2048',
],
```

---

## 🔀 Validaciones Condicionales {#validaciones-condicionales}

### Sometimes - El Validador Ocasional
```php
'avatar' => ['sometimes', 'image', 'max:2048'],
```
**Analogía**: Como un control opcional - solo se activa si el campo está presente.

### Nullable - El Tolerante a Vacíos
```php
'middle_name' => ['nullable', 'string', 'max:255'],
```

### Validaciones Dependientes
```php
public function rules(): array
{
    return [
        'payment_method' => ['required', 'in:credit_card,bank_transfer,cash'],
        'card_number' => ['required_if:payment_method,credit_card', 'string'],
        'bank_account' => ['required_if:payment_method,bank_transfer', 'string'],
        
        // Validación múltiple
        'shipping_address' => [
            'required_if:delivery_method,shipping',
            'string',
            'max:500'
        ],
    ];
}
```

---

## 🎨 Reglas Personalizadas {#reglas-personalizadas}

### 1. Closures Inline
```php
'username' => [
    'required',
    'string',
    function ($attribute, $value, $fail) {
        if (str_contains(strtolower($value), 'admin')) {
            $fail('El username no puede contener la palabra "admin".');
        }
    },
],
```

### 2. Rule Classes Personalizadas
```php
// app/Rules/VinRule.php
class VinRule implements Rule
{
    public function passes($attribute, $value): bool
    {
        // Validación de VIN (17 caracteres alfanuméricos)
        if (strlen($value) !== 17) {
            return false;
        }
        
        // Algoritmo de validación de VIN
        return $this->validateVinChecksum($value);
    }
    
    public function message(): string
    {
        return 'El :attribute no es un VIN válido.';
    }
    
    private function validateVinChecksum($vin): bool
    {
        // Implementación del algoritmo de checksum VIN
        $weights = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
        $transliteration = [
            'A' => 1, 'B' => 2, 'C' => 3, 'D' => 4, 'E' => 5, 'F' => 6, 'G' => 7, 'H' => 8,
            'J' => 1, 'K' => 2, 'L' => 3, 'M' => 4, 'N' => 5, 'P' => 7, 'R' => 9, 'S' => 2,
            'T' => 3, 'U' => 4, 'V' => 5, 'W' => 6, 'X' => 7, 'Y' => 8, 'Z' => 9
        ];
        
        $sum = 0;
        for ($i = 0; $i < 17; $i++) {
            $char = $vin[$i];
            $value = is_numeric($char) ? intval($char) : ($transliteration[$char] ?? 0);
            $sum += $value * $weights[$i];
        }
        
        $checkDigit = $sum % 11;
        $expectedDigit = $checkDigit == 10 ? 'X' : (string)$checkDigit;
        
        return $vin[8] === $expectedDigit;
    }
}

// Uso
'vin' => ['sometimes', 'nullable', new VinRule()],
```

### 3. Reglas Complejas de Negocio
```php
class BusinessHoursRule implements Rule
{
    public function passes($attribute, $value): bool
    {
        $time = Carbon::parse($value);
        $hour = $time->hour;
        
        // Solo entre 9 AM y 6 PM, lunes a viernes
        return !$time->isWeekend() && $hour >= 9 && $hour < 18;
    }
    
    public function message(): string
    {
        return 'Las citas solo pueden agendarse en horario comercial (9 AM - 6 PM, lunes a viernes).';
    }
}
```

---

## 📋 Form Requests Profesionales {#form-requests}

### Estructura Completa
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVehicleRequest extends FormRequest
{
    private $vehicleTypes;
    
    public function __construct()
    {
        parent::__construct();
        $this->vehicleTypes = VehicleType::active()->get();
    }
    
    public function authorize(): bool
    {
        return $this->user()->can('create-vehicles');
    }
    
    public function rules(): array
    {
        return [
            'number' => [
                'required',
                'string',
                'min:2',
                'max:255',
                'regex:/^[A-Z0-9-]+$/i',
            ],
            'patent' => [
                'required',
                'string',
                'min:3',
                'max:20',
                Rule::unique('vehicles')
                    ->where('company_id', $this->user()->company_id),
            ],
            'vin' => [
                'sometimes',
                'nullable',
                new VinRule(),
            ],
            'vehicle_type_id' => [
                'required',
                'integer',
                Rule::in($this->vehicleTypes->pluck('id')),
            ],
            'functional_area_cd' => [
                'required',
                'string',
                Rule::in([
                    FunctionalAreaCategory::FIELD_SERVICE,
                    FunctionalAreaCategory::WASTE_LOGISTIC,
                ]),
            ],
            'restricted_zones' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }
    
    public function messages(): array
    {
        return [
            'patent.unique' => 'Ya existe un vehículo con esta patente en su empresa.',
            'vehicle_type_id.in' => 'El tipo de vehículo seleccionado no es válido.',
            'functional_area_cd.in' => 'El área funcional debe ser Servicio de Campo o Logística de Residuos.',
        ];
    }
    
    public function attributes(): array
    {
        return [
            'number' => 'número de vehículo',
            'patent' => 'patente',
            'vin' => 'número VIN',
            'vehicle_type_id' => 'tipo de vehículo',
            'functional_area_cd' => 'área funcional',
            'restricted_zones' => 'zonas restringidas',
        ];
    }
    
    protected function prepareForValidation(): void
    {
        $this->merge([
            'patent' => strtoupper($this->patent),
            'number' => trim($this->number),
        ]);
    }
}
```

---

## 🌍 Casos de Uso del Mundo Real {#casos-reales}

### 1. Sistema de E-commerce
```php
class StoreOrderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            // Información del cliente
            'customer_email' => ['required', 'email'],
            'customer_phone' => ['required', 'regex:/^\+?[1-9]\d{1,14}$/'],
            
            // Productos
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
            
            // Dirección de envío
            'shipping_address.street' => ['required', 'string', 'max:255'],
            'shipping_address.number' => ['required', 'string', 'max:10'],
            'shipping_address.city' => ['required', 'string', 'max:100'],
            'shipping_address.postal_code' => ['required', 'regex:/^[A-Z]\d{4}[A-Z]{3}$/'],
            
            // Pago
            'payment_method' => ['required', 'in:credit_card,debit_card,transfer'],
            'card_number' => ['required_if:payment_method,credit_card,debit_card', 'string', 'size:16'],
            'expiry_date' => ['required_with:card_number', 'date_format:m/y', 'after:today'],
            
            // Descuentos
            'coupon_code' => ['nullable', 'exists:coupons,code', new ActiveCouponRule()],
        ];
    }
}
```

### 2. Sistema de Usuarios y Roles
```php
class UpdateUserRequest extends FormRequest
{
    public function rules(): array
    {
        $userId = $this->route('user')->id;
        
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'email',
                Rule::unique('users')->ignore($userId),
            ],
            'password' => [
                'sometimes',
                'string',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/',
            ],
            'role_id' => [
                'sometimes',
                'exists:roles,id',
                new UserCanAssignRoleRule($this->user()),
            ],
            'avatar' => [
                'sometimes',
                'image',
                'max:2048',
                'dimensions:min_width=100,min_height=100,max_width=1000,max_1000',
            ],
        ];
    }
}
```

### 3. Sistema de Horarios/Citas
```php
class BookAppointmentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'service_id' => ['required', 'exists:services,id'],
            'professional_id' => [
                'required',
                'exists:professionals,id',
                new ProfessionalOffersServiceRule($this->service_id),
            ],
            'date' => [
                'required',
                'date',
                'after:today',
                'before:' . now()->addMonths(3)->toDateString(),
                new BusinessDayRule(),
            ],
            'time' => [
                'required',
                'date_format:H:i',
                new AvailableTimeSlotRule(
                    $this->professional_id,
                    $this->date,
                    $this->service_id
                ),
            ],
        ];
    }
}
```

---

## 🏆 Mejores Prácticas y Patrones {#mejores-practicas}

### 1. **Organización de Reglas**
```php
// ❌ MAL - Mezclado y confuso
'email' => ['required', 'unique:users', 'email', 'max:255'],

// ✅ BIEN - Lógico y ordenado
'email' => [
    'required',           // Existencia
    'email',             // Formato
    'max:255',           // Tamaño
    'unique:users',      // Unicidad
],
```

### 2. **Reutilización con Traits**
```php
trait HasContactValidation
{
    protected function getEmailRules(bool $required = true): array
    {
        $rules = ['email', 'max:255'];
        
        if ($required) {
            array_unshift($rules, 'required');
        } else {
            array_unshift($rules, 'nullable');
        }
        
        return $rules;
    }
    
    protected function getPhoneRules(): array
    {
        return ['regex:/^\+?[1-9]\d{1,14}$/'];
    }
}

class UserRequest extends FormRequest
{
    use HasContactValidation;
    
    public function rules(): array
    {
        return [
            'email' => $this->getEmailRules(),
            'phone' => ['nullable', ...$this->getPhoneRules()],
        ];
    }
}
```

### 3. **Factory Pattern para Validaciones Complejas**
```php
class ValidationRuleFactory
{
    public static function uniqueIgnoringCurrent(string $table, string $column, ?int $ignoreId = null): array
    {
        $rule = "unique:{$table},{$column}";
        
        if ($ignoreId) {
            $rule .= ",{$ignoreId}";
        }
        
        return [$rule];
    }
    
    public static function argentinianDocument(): array
    {
        return [
            'required',
            'string',
            'regex:/^\d{7,8}$/',
            function ($attribute, $value, $fail) {
                if (!self::validateArgentinianDni($value)) {
                    $fail('El DNI no es válido.');
                }
            },
        ];
    }
}
```

### 4. **Validaciones por Contexto**
```php
class UserRequest extends FormRequest
{
    public function rules(): array
    {
        return match($this->getRouteAction()) {
            'store' => $this->createRules(),
            'update' => $this->updateRules(),
            'register' => $this->registerRules(),
            default => [],
        };
    }
    
    private function createRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }
    
    private function updateRules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($this->route('user'))],
            'password' => ['sometimes', 'string', 'min:8', 'confirmed'],
        ];
    }
    
    private function getRouteAction(): string
    {
        return $this->route()->getActionMethod();
    }
}
```

### 5. **Mensajes Contextuales**
```php
public function messages(): array
{
    return [
        'email.unique' => $this->isUpdate() 
            ? 'Este email ya está siendo usado por otro usuario.'
            : 'Ya existe una cuenta con este email.',
            
        'password.min' => 'La contraseña debe tener al menos :min caracteres para mayor seguridad.',
    ];
}

private function isUpdate(): bool
{
    return $this->getMethod() === 'PUT' || $this->getMethod() === 'PATCH';
}
```

---

## 🐛 Troubleshooting Común {#troubleshooting}

### 1. **Problema: "The given data was invalid"**
```php
// ❌ Problema común
'items' => ['required', 'array'],
'items.product_id' => ['required'], // ¡Error! Debe ser items.*.product_id

// ✅ Solución
'items' => ['required', 'array'],
'items.*.product_id' => ['required'],
```

### 2. **Problema: Unique no funciona en updates**
```php
// ❌ Valida contra sí mismo
'email' => ['unique:users'],

// ✅ Ignora el registro actual
'email' => [Rule::unique('users')->ignore($this->user->id)],
```

### 3. **Problema: Sometimes vs Nullable**
```php
// Sometimes = solo valida si el campo está presente
'avatar' => ['sometimes', 'image'],

// Nullable = acepta null/vacío pero valida si tiene valor
'middle_name' => ['nullable', 'string', 'max:255'],
```

### 4. **Problema: Arrays anidados**
```php
// ❌ No funciona para objetos anidados
'address' => ['required'],

// ✅ Validación correcta de objetos
'address' => ['required', 'array'],
'address.street' => ['required', 'string'],
'address.number' => ['required', 'string'],
```

### 5. **Problema: Performance con Rule::in()**
```php
// ❌ Lento - consulta en cada validación
'category_id' => [Rule::in(Category::pluck('id'))],

// ✅ Mejor - cachear o precalcular
public function __construct()
{
    $this->validCategories = cache()->remember(
        'valid_categories', 
        3600, 
        fn() => Category::pluck('id')->toArray()
    );
}

public function rules(): array
{
    return [
        'category_id' => [Rule::in($this->validCategories)],
    ];
}
```

---

## 🎯 Checklist del Experto

### Antes de escribir validaciones, pregúntate:
- ✅ ¿Qué datos espero recibir?
- ✅ ¿Cuáles son obligatorios vs opcionales?
- ✅ ¿Hay reglas de negocio específicas?
- ✅ ¿Necesito validar contra la base de datos?
- ✅ ¿Hay dependencias entre campos?
- ✅ ¿Los mensajes de error son claros para el usuario?

### Al escribir reglas:
- ✅ Orden lógico: existencia → formato → tamaño → unicidad
- ✅ Usar `sometimes` para campos opcionales que pueden no estar presentes
- ✅ Usar `nullable` para campos que aceptan valores nulos
- ✅ Pensar en performance para reglas que consultan la DB
- ✅ Crear reglas personalizadas para lógica compleja
- ✅ Mensajes de error descriptivos y accionables

---

## 🚀 Próximos Pasos

Con esta guía dominas:
- ✅ Todas las reglas básicas y avanzadas
- ✅ Validaciones condicionales y dependientes
- ✅ Creación de reglas personalizadas
- ✅ Form Requests profesionales
- ✅ Patrones y mejores prácticas
- ✅ Resolución de problemas comunes

**¡Felicidades! Ahora eres un experto en validaciones Laravel! 🎉**