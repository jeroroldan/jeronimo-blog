---
title: 'Guía Paso a Paso: Búsquedas con Foreign Keys en Laravel'
code: "laravel"
description: 'Guía Completa de Protocolos de Comunicación IoT'
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


# Guía Paso a Paso: Búsquedas con Foreign Keys en Laravel

## 🎯 Entendiendo tu Estructura (Basada en tu Código)

```php
// Tu estructura según tu código:
Vehicle::class
├── vehicle_category_id (FK hacia VehicleCategory)
└── unit_capacity_category_id (FK hacia UnitCapacityCategory)

VehicleCategory::class
└── Tiene muchos Vehicle

WasteType::class  
└── Relación Many-to-Many con Vehicle
```

---

## 📍 PASO 1: Verificar las Relaciones en tus Modelos

### En tu modelo Vehicle.php:

```php
class Vehicle extends Model
{
    // ✅ Relación hacia VehicleCategory (belongsTo)
    public function vehicleCategory()
    {
        return $this->belongsTo(VehicleCategory::class, 'vehicle_category_id');
    }
  
    // ✅ Relación hacia UnitCapacityCategory (belongsTo)  
    public function unitCapacityCategory()
    {
        return $this->belongsTo(UnitCapacityCategory::class, 'unit_capacity_category_id');
    }
  
    // ✅ Relación Many-to-Many con WasteType
    public function wasteTypes()
    {
        return $this->belongsToMany(WasteType::class, 'vehicle_waste')
                    ->withTimestamps();
    }
}
```

### En tu modelo VehicleCategory.php:

```php
class VehicleCategory extends Model
{
    // ✅ Relación inversa (hasMany)
    public function vehicles()
    {
        return $this->hasMany(Vehicle::class, 'vehicle_category_id');
    }
}
```

---

## 🔍 PASO 2: Tipos de Búsquedas con Foreign Keys

### 2.1 Buscar POR ID de Foreign Key (Directo)

```php
// ❌ Forma básica (sin relación)
$vehicles = Vehicle::where('vehicle_category_id', 5)->get();

// ✅ Forma recomendada (con relación cargada)
$vehicles = Vehicle::where('vehicle_category_id', 5)
    ->with('vehicleCategory')  // Evita N+1
    ->get();

// 🎯 Resultado: Todos los vehículos de la categoría con ID 5
```

### 2.2 Buscar por Campo de la Tabla Relacionada

```php
// ✅ Buscar vehículos por NOMBRE de categoría
$vehicles = Vehicle::whereHas('vehicleCategory', function ($query) {
    $query->where('name', 'Camión de Basura');
})->with('vehicleCategory')->get();

// ✅ Buscar vehículos por múltiples criterios de categoría
$vehicles = Vehicle::whereHas('vehicleCategory', function ($query) {
    $query->where('name', 'like', '%Camión%')
          ->where('active', true);
})->with('vehicleCategory')->get();
```

---

## 🎪 PASO 3: Casos Prácticos Completos

### Caso 1: Buscar desde el modelo que TIENE la FK

```php
// 🎯 OBJETIVO: Encontrar vehículos de una categoría específica

// Método 1: Por ID de categoría
$categoryId = 3;
$vehicles = Vehicle::where('vehicle_category_id', $categoryId)
    ->with(['vehicleCategory', 'unitCapacityCategory'])
    ->get();

// Método 2: Por nombre de categoría  
$categoryName = 'Camión de Basura';
$vehicles = Vehicle::whereHas('vehicleCategory', function ($query) use ($categoryName) {
    $query->where('name', $categoryName);
})
->with('vehicleCategory')
->get();

// Método 3: Por múltiples criterios
$vehicles = Vehicle::whereHas('vehicleCategory', function ($query) {
    $query->where('active', true)
          ->where('name', 'like', '%Recolector%');
})
->whereHas('unitCapacityCategory', function ($query) {
    $query->where('name', 'Toneladas');
})
->with(['vehicleCategory', 'unitCapacityCategory'])
->get();
```

### Caso 2: Buscar desde el modelo que NO TIENE la FK

```php
// 🎯 OBJETIVO: Encontrar categorías que tienen vehículos específicos

// Encontrar categorías que tienen vehículos activos
$categories = VehicleCategory::whereHas('vehicles', function ($query) {
    $query->where('active', true);
})
->withCount('vehicles')  // Bonus: contar vehículos
->get();

// Encontrar categorías con vehículos de cierta capacidad
$categories = VehicleCategory::whereHas('vehicles', function ($query) {
    $query->where('capacity', '>', 1000);
})
->with(['vehicles' => function ($query) {
    $query->where('capacity', '>', 1000);
}])
->get();
```

---

## 💡 PASO 4: Búsquedas Avanzadas

### 4.1 Buscar con Múltiples Foreign Keys

```php
// Vehículos de categoría específica Y unidad específica
$vehicles = Vehicle::where('vehicle_category_id', 2)
    ->where('unit_capacity_category_id', 1)
    ->with(['vehicleCategory', 'unitCapacityCategory'])
    ->get();

// Con nombres en lugar de IDs
$vehicles = Vehicle::whereHas('vehicleCategory', function ($query) {
    $query->where('name', 'Camión Compactador');
})
->whereHas('unitCapacityCategory', function ($query) {
    $query->where('name', 'Metros Cúbicos');
})
->with(['vehicleCategory', 'unitCapacityCategory'])
->get();
```

### 4.2 Búsquedas con Relaciones Many-to-Many

```php
// Vehículos que manejan un tipo específico de residuo
$wasteTypeName = 'Residuos Orgánicos';
$vehicles = Vehicle::whereHas('wasteTypes', function ($query) use ($wasteTypeName) {
    $query->where('name', $wasteTypeName);
})
->with(['wasteTypes', 'vehicleCategory'])
->get();

// Vehículos que manejan MÚLTIPLES tipos de residuo
$wasteTypeNames = ['Residuos Orgánicos', 'Plásticos'];
$vehicles = Vehicle::whereHas('wasteTypes', function ($query) use ($wasteTypeNames) {
    $query->whereIn('name', $wasteTypeNames);
}, '>=', count($wasteTypeNames))  // Debe tener TODOS los tipos
->with(['wasteTypes', 'vehicleCategory'])
->get();
```

---

## 🛠️ PASO 5: Funciones Helper Reutilizables

### En tu modelo Vehicle.php agrega scopes:

```php
class Vehicle extends Model
{
    // Scope para buscar por categoría
    public function scopeByCategory($query, $categoryName)
    {
        return $query->whereHas('vehicleCategory', function ($q) use ($categoryName) {
            $q->where('name', $categoryName);
        });
    }
  
    // Scope para buscar por tipo de residuo
    public function scopeByWasteType($query, $wasteTypeName)
    {
        return $query->whereHas('wasteTypes', function ($q) use ($wasteTypeName) {
            $q->where('name', $wasteTypeName);
        });
    }
  
    // Scope para cargar todas las relaciones
    public function scopeWithAllRelations($query)
    {
        return $query->with([
            'vehicleCategory',
            'unitCapacityCategory', 
            'wasteTypes'
        ]);
    }
}

// 🎯 USO SÚPER LIMPIO:
$vehicles = Vehicle::byCategory('Camión de Basura')
    ->byWasteType('Residuos Orgánicos')
    ->withAllRelations()
    ->get();
```

---

## 🎯 PASO 6: Ejemplos de Controlador Completos

### Método de Búsqueda en tu Controller:

```php
class VehicleController extends Controller
{
    public function search(Request $request)
    {
        $query = Vehicle::query();
    
        // Filtrar por categoría (por ID o nombre)
        if ($request->filled('category_id')) {
            $query->where('vehicle_category_id', $request->category_id);
        }
    
        if ($request->filled('category_name')) {
            $query->whereHas('vehicleCategory', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->category_name . '%');
            });
        }
    
        // Filtrar por tipo de residuo
        if ($request->filled('waste_type')) {
            $query->whereHas('wasteTypes', function ($q) use ($request) {
                $q->where('name', $request->waste_type);
            });
        }
    
        // Filtrar por capacidad
        if ($request->filled('min_capacity')) {
            $query->where('capacity', '>=', $request->min_capacity);
        }
    
        // Cargar relaciones y ejecutar
        $vehicles = $query->with([
                'vehicleCategory',
                'unitCapacityCategory',
                'wasteTypes'
            ])
            ->paginate(15);
        
        return response()->json($vehicles);
    }
}
```

---

## 🚨 PASO 7: Errores Comunes y Soluciones

### Error 1: Relación no definida

```php
// ❌ ERROR: Call to undefined relationship
$vehicle->category; // Si el método se llama vehicleCategory()

// ✅ CORRECTO:
$vehicle->vehicleCategory; // Usar el nombre exacto del método
```

### Error 2: N+1 Problem

```php
// ❌ PROBLEMA N+1:
$vehicles = Vehicle::where('vehicle_category_id', 5)->get();
foreach ($vehicles as $vehicle) {
    echo $vehicle->vehicleCategory->name; // Nueva consulta cada vez
}

// ✅ SOLUCIÓN:
$vehicles = Vehicle::where('vehicle_category_id', 5)
    ->with('vehicleCategory')
    ->get();
foreach ($vehicles as $vehicle) {
    echo $vehicle->vehicleCategory->name; // Sin consultas adicionales
}
```

### Error 3: Foreign Key Incorrecta

```php
// ❌ Si tu FK no sigue convenciones:
public function vehicleCategory()
{
    return $this->belongsTo(VehicleCategory::class); // Asume vehicle_category_id
}

// ✅ Especifica la FK si es diferente:
public function vehicleCategory()
{
    return $this->belongsTo(VehicleCategory::class, 'category_id', 'id');
}
```

---

## 🏆 PASO 8: Cheat Sheet de Búsquedas

```php
// 📋 PATRONES MÁS COMUNES:

// 1. Por ID de FK directo
Vehicle::where('vehicle_category_id', $id)->with('vehicleCategory')->get();

// 2. Por campo de tabla relacionada  
Vehicle::whereHas('vehicleCategory', fn($q) => $q->where('name', $name))->get();

// 3. Con múltiples condiciones
Vehicle::whereHas('vehicleCategory', fn($q) => $q->where('active', true))
    ->whereHas('wasteTypes', fn($q) => $q->where('name', $type))
    ->with(['vehicleCategory', 'wasteTypes'])
    ->get();

// 4. Desde el lado "padre"
VehicleCategory::whereHas('vehicles', fn($q) => $q->where('active', true))
    ->withCount('vehicles')
    ->get();

// 5. Con paginación
Vehicle::whereHas('vehicleCategory', fn($q) => $q->where('name', $name))
    ->with('vehicleCategory')
    ->paginate(10);
```

---

## 🎓 Resumen: Los 3 Patrones Esenciales

1. **Buscar por FK directa**: `where('foreign_key_id', $value)`
2. **Buscar por campo relacionado**: `whereHas('relacion', function($q) { ... })`
3. **Siempre usar `with()`**: Para evitar el problema N+1

### 💭 Mantra del Foreign Key:

*"Si buscas por relación, carga la relación"*

¡Con estos pasos ya puedes hacer cualquier búsqueda con foreign keys! 🚀
