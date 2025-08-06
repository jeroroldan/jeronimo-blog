---
title: 'Queries en Laravel'
cede: "laravel"
description: 'Master Class Completa: Queries en Laravel - De Principiante a Experto'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Master Class Completa: Queries en Laravel - De Principiante a Experto

## 🎯 Introducción: El Universo de las Consultas

Laravel te ofrece **3 maneras** de hacer consultas a la base de datos:

1. **Raw SQL** (SQL puro)
2. **Query Builder** (Constructor de consultas)
3. **Eloquent ORM** (Modelos orientados a objetos)

**Analogía**: Es como tener 3 formas de cocinar:

* Raw SQL = Cocinar desde cero con ingredientes básicos
* Query Builder = Usar una batidora y herramientas modernas
* Eloquent = Tener un chef personal que entiende tus gustos

---

## 📚 CAPÍTULO 1: Fundamentos y Setup

### 1.1 La Estructura de una Query en Laravel

```php
// Patrón básico de Query Builder:
DB::table('nombre_tabla')
    ->select('campos')
    ->where('condiciones')
    ->orderBy('campo')
    ->get();

// Patrón básico de Eloquent:
Modelo::select('campos')
    ->where('condiciones')
    ->orderBy('campo')
    ->get();
```

### 1.2 Imports Necesarios

```php
// Para Query Builder
use Illuminate\Support\Facades\DB;

// Para modelos Eloquent (automático)
use App\Models\Vehicle;
use App\Models\VehicleCategory;
```

---

## 🏗️ CAPÍTULO 2: Query Builder vs Eloquent

### 2.1 ¿Cuándo usar cada uno?


| Escenario            | Usar                | Razón                   |
| -------------------- | ------------------- | ------------------------ |
| CRUD simple          | Eloquent            | Más limpio y fácil     |
| Consultas complejas  | Query Builder       | Mayor control            |
| Performance crítica | Raw SQL             | Máxima eficiencia       |
| Relaciones           | Eloquent            | Funcionalidades built-in |
| Reportes pesados     | Query Builder + Raw | Flexibilidad total       |

### 2.2 Comparación Práctica

```php
// 🎯 CASO: Obtener vehículos activos con su categoría

// ✅ ELOQUENT (Recomendado para CRUD)
$vehicles = Vehicle::where('active', true)
    ->with('vehicleCategory')
    ->get();

// ✅ QUERY BUILDER (Recomendado para consultas complejas)
$vehicles = DB::table('vehicles')
    ->join('vehicle_categories', 'vehicles.vehicle_category_id', '=', 'vehicle_categories.id')
    ->where('vehicles.active', true)
    ->select('vehicles.*', 'vehicle_categories.name as category_name')
    ->get();

// ✅ RAW SQL (Para casos extremos)
$vehicles = DB::select("
    SELECT v.*, vc.name as category_name 
    FROM vehicles v 
    JOIN vehicle_categories vc ON v.vehicle_category_id = vc.id 
    WHERE v.active = ?
", [true]);
```

---

## 🎪 CAPÍTULO 3: Operaciones CRUD - Paso a Paso

### 3.1 CREATE (Crear Datos)

```php
// 🎯 CREAR UN VEHÍCULO

// Método 1: Eloquent con create()
$vehicle = Vehicle::create([
    'name' => 'Camión Recolector 001',
    'vehicle_category_id' => 1,
    'capacity' => 1500,
    'unit_capacity_category_id' => 2,
    'active' => true
]);

// Método 2: Eloquent con new + save()
$vehicle = new Vehicle();
$vehicle->name = 'Camión Recolector 002';
$vehicle->vehicle_category_id = 1;
$vehicle->capacity = 2000;
$vehicle->save();

// Método 3: Query Builder
$vehicleId = DB::table('vehicles')->insertGetId([
    'name' => 'Camión Recolector 003',
    'vehicle_category_id' => 1,
    'capacity' => 1800,
    'created_at' => now(),
    'updated_at' => now()
]);

// Método 4: Inserción masiva (Query Builder)
DB::table('vehicles')->insert([
    [
        'name' => 'Camión 001',
        'vehicle_category_id' => 1,
        'capacity' => 1500,
        'created_at' => now(),
        'updated_at' => now()
    ],
    [
        'name' => 'Camión 002', 
        'vehicle_category_id' => 2,
        'capacity' => 2000,
        'created_at' => now(),
        'updated_at' => now()
    ]
]);
```

### 3.2 READ (Leer Datos)

```php
// 🎯 LEER VEHÍCULOS

// Todos los registros
$vehicles = Vehicle::all();
$vehicles = DB::table('vehicles')->get();

// Un registro específico
$vehicle = Vehicle::find(1);
$vehicle = DB::table('vehicles')->where('id', 1)->first();

// Primer registro que cumpla condición
$vehicle = Vehicle::where('name', 'Camión 001')->first();
$vehicle = DB::table('vehicles')->where('name', 'Camión 001')->first();

// Solo ciertos campos
$vehicles = Vehicle::select('id', 'name', 'capacity')->get();
$vehicles = DB::table('vehicles')->select('id', 'name', 'capacity')->get();

// Con paginación
$vehicles = Vehicle::paginate(10);
$vehicles = DB::table('vehicles')->paginate(10);
```

### 3.3 UPDATE (Actualizar Datos)

```php
// 🎯 ACTUALIZAR VEHÍCULOS

// Método 1: Encontrar y actualizar (Eloquent)
$vehicle = Vehicle::find(1);
$vehicle->name = 'Nuevo Nombre';
$vehicle->capacity = 2500;
$vehicle->save();

// Método 2: Update directo (Eloquent)
Vehicle::where('id', 1)->update([
    'name' => 'Nuevo Nombre',
    'capacity' => 2500
]);

// Método 3: Query Builder
DB::table('vehicles')
    ->where('id', 1)
    ->update([
        'name' => 'Nuevo Nombre',
        'capacity' => 2500,
        'updated_at' => now()
    ]);

// Actualización masiva con condiciones
Vehicle::where('vehicle_category_id', 1)
    ->where('active', false)
    ->update(['active' => true]);
```

### 3.4 DELETE (Eliminar Datos)

```php
// 🎯 ELIMINAR VEHÍCULOS

// Método 1: Encontrar y eliminar
$vehicle = Vehicle::find(1);
$vehicle->delete();

// Método 2: Eliminación directa
Vehicle::where('id', 1)->delete();
Vehicle::destroy(1); // Por ID
Vehicle::destroy([1, 2, 3]); // Múltiples IDs

// Método 3: Query Builder
DB::table('vehicles')->where('id', 1)->delete();

// Soft Delete (si está configurado)
$vehicle->delete(); // Marca como eliminado
$vehicle->forceDelete(); // Elimina permanentemente
$vehicle->restore(); // Restaura un soft deleted
```

---

## 🔍 CAPÍTULO 4: Filtros y Condiciones

### 4.1 Condiciones Básicas

```php
// 🎯 FILTROS SIMPLES

// Igualdad
$vehicles = Vehicle::where('active', true)->get();
$vehicles = DB::table('vehicles')->where('active', true)->get();

// Diferentes operadores
$vehicles = Vehicle::where('capacity', '>', 1000)->get();
$vehicles = Vehicle::where('name', 'like', '%Camión%')->get();
$vehicles = Vehicle::where('created_at', '>=', '2024-01-01')->get();

// Múltiples condiciones (AND)
$vehicles = Vehicle::where('active', true)
    ->where('capacity', '>', 1000)
    ->where('vehicle_category_id', 1)
    ->get();

// Condiciones OR
$vehicles = Vehicle::where('capacity', '>', 2000)
    ->orWhere('name', 'like', '%Premium%')
    ->get();
```

### 4.2 Condiciones Avanzadas

```php
// 🎯 FILTROS COMPLEJOS

// WHERE IN
$categoryIds = [1, 2, 3];
$vehicles = Vehicle::whereIn('vehicle_category_id', $categoryIds)->get();

// WHERE NOT IN
$vehicles = Vehicle::whereNotIn('vehicle_category_id', [4, 5])->get();

// WHERE BETWEEN
$vehicles = Vehicle::whereBetween('capacity', [1000, 2000])->get();

// WHERE NULL / NOT NULL
$vehicles = Vehicle::whereNull('deleted_at')->get();
$vehicles = Vehicle::whereNotNull('last_maintenance_date')->get();

// Condiciones agrupadas
$vehicles = Vehicle::where('active', true)
    ->where(function ($query) {
        $query->where('capacity', '>', 2000)
              ->orWhere('priority', 'high');
    })->get();
  
// Equivale a: WHERE active = true AND (capacity > 2000 OR priority = 'high')
```

### 4.3 Filtros por Fechas

```php
// 🎯 FILTROS DE FECHA

// Fecha específica
$vehicles = Vehicle::whereDate('created_at', '2024-01-15')->get();

// Mes específico
$vehicles = Vehicle::whereMonth('created_at', 12)->get();

// Año específico  
$vehicles = Vehicle::whereYear('created_at', 2024)->get();

// Últimos 30 días
$vehicles = Vehicle::where('created_at', '>=', now()->subDays(30))->get();

// Entre fechas
$vehicles = Vehicle::whereBetween('created_at', [
    now()->startOfMonth(),
    now()->endOfMonth()
])->get();
```

---

## 🔗 CAPÍTULO 5: Joins y Relaciones

### 5.1 Joins con Query Builder

```php
// 🎯 UNIR TABLAS

// Inner Join básico
$vehicles = DB::table('vehicles')
    ->join('vehicle_categories', 'vehicles.vehicle_category_id', '=', 'vehicle_categories.id')
    ->select('vehicles.*', 'vehicle_categories.name as category_name')
    ->get();

// Left Join
$vehicles = DB::table('vehicles')
    ->leftJoin('vehicle_categories', 'vehicles.vehicle_category_id', '=', 'vehicle_categories.id')
    ->select('vehicles.*', 'vehicle_categories.name as category_name')
    ->get();

// Múltiples Joins
$vehicles = DB::table('vehicles')
    ->join('vehicle_categories', 'vehicles.vehicle_category_id', '=', 'vehicle_categories.id')
    ->join('unit_capacity_categories', 'vehicles.unit_capacity_category_id', '=', 'unit_capacity_categories.id')
    ->select(
        'vehicles.*',
        'vehicle_categories.name as category_name',
        'unit_capacity_categories.name as unit_name'
    )
    ->get();

// Join con condiciones adicionales
$vehicles = DB::table('vehicles')
    ->join('vehicle_categories', function ($join) {
        $join->on('vehicles.vehicle_category_id', '=', 'vehicle_categories.id')
             ->where('vehicle_categories.active', true);
    })
    ->get();
```

### 5.2 Relaciones con Eloquent (Más Fácil)

```php
// 🎯 USANDO RELACIONES ELOQUENT

// Cargar relación simple
$vehicles = Vehicle::with('vehicleCategory')->get();

// Múltiples relaciones
$vehicles = Vehicle::with(['vehicleCategory', 'unitCapacityCategory'])->get();

// Relación con condiciones
$vehicles = Vehicle::with(['vehicleCategory' => function ($query) {
    $query->where('active', true);
}])->get();

// Contar relaciones
$categories = VehicleCategory::withCount('vehicles')->get();

// Filtrar por existencia de relación
$categories = VehicleCategory::has('vehicles')->get();
$categories = VehicleCategory::whereHas('vehicles', function ($query) {
    $query->where('active', true);
})->get();
```

---

## 📊 CAPÍTULO 6: Agregaciones y Agrupaciones

### 6.1 Funciones de Agregación

```php
// 🎯 ESTADÍSTICAS Y TOTALES

// Count (contar)
$totalVehicles = Vehicle::count();
$activeVehicles = Vehicle::where('active', true)->count();

// Sum (sumar)
$totalCapacity = Vehicle::sum('capacity');
$capacityByCategory = Vehicle::where('vehicle_category_id', 1)->sum('capacity');

// Average (promedio)
$avgCapacity = Vehicle::avg('capacity');

// Min y Max
$minCapacity = Vehicle::min('capacity');
$maxCapacity = Vehicle::max('capacity');

// Múltiples agregaciones en Query Builder
$stats = DB::table('vehicles')
    ->select(
        DB::raw('COUNT(*) as total_vehicles'),
        DB::raw('SUM(capacity) as total_capacity'),
        DB::raw('AVG(capacity) as avg_capacity'),
        DB::raw('MIN(capacity) as min_capacity'),
        DB::raw('MAX(capacity) as max_capacity')
    )
    ->where('active', true)
    ->first();
```

### 6.2 Group By y Having

```php
// 🎯 AGRUPAR DATOS

// Agrupar por categoría
$capacityByCategory = DB::table('vehicles')
    ->join('vehicle_categories', 'vehicles.vehicle_category_id', '=', 'vehicle_categories.id')
    ->select(
        'vehicle_categories.name as category',
        DB::raw('COUNT(*) as vehicle_count'),
        DB::raw('SUM(vehicles.capacity) as total_capacity'),
        DB::raw('AVG(vehicles.capacity) as avg_capacity')
    )
    ->where('vehicles.active', true)
    ->groupBy('vehicle_categories.id', 'vehicle_categories.name')
    ->get();

// Con Having (filtrar grupos)
$highCapacityCategories = DB::table('vehicles')
    ->join('vehicle_categories', 'vehicles.vehicle_category_id', '=', 'vehicle_categories.id')
    ->select(
        'vehicle_categories.name as category',
        DB::raw('SUM(vehicles.capacity) as total_capacity')
    )
    ->groupBy('vehicle_categories.id', 'vehicle_categories.name')
    ->having('total_capacity', '>', 5000)
    ->get();

// Eloquent con agregaciones
$categories = VehicleCategory::withCount('vehicles')
    ->withSum('vehicles', 'capacity')
    ->withAvg('vehicles', 'capacity')
    ->get();
```

---

## 🧠 CAPÍTULO 7: Subconsultas

### 7.1 Subconsultas Básicas

```php
// 🎯 CONSULTAS ANIDADAS

// Vehículos con capacidad mayor al promedio
$vehicles = Vehicle::where('capacity', '>', function ($query) {
    $query->selectRaw('AVG(capacity)')
          ->from('vehicles')
          ->where('active', true);
})->get();

// Categorías con más de X vehículos
$categories = VehicleCategory::where('id', 'in', function ($query) {
    $query->select('vehicle_category_id')
          ->from('vehicles')
          ->groupBy('vehicle_category_id')
          ->havingRaw('COUNT(*) > ?', [5]);
})->get();
```

### 7.2 Subconsultas en Select

```php
// 🎯 CAMPOS CALCULADOS

// Eloquent con subconsultas
use Illuminate\Database\Eloquent\Builder;

$categories = VehicleCategory::select([
    'id',
    'name',
    'vehicle_count' => Vehicle::selectRaw('COUNT(*)')
        ->whereColumn('vehicle_category_id', 'vehicle_categories.id'),
    'total_capacity' => Vehicle::selectRaw('SUM(capacity)')
        ->whereColumn('vehicle_category_id', 'vehicle_categories.id'),
    'last_vehicle_created' => Vehicle::select('created_at')
        ->whereColumn('vehicle_category_id', 'vehicle_categories.id')
        ->latest()
        ->limit(1)
])->get();

// Query Builder equivalente
$categories = DB::table('vehicle_categories')
    ->select([
        'id',
        'name',
        DB::raw('(SELECT COUNT(*) FROM vehicles WHERE vehicles.vehicle_category_id = vehicle_categories.id) as vehicle_count'),
        DB::raw('(SELECT SUM(capacity) FROM vehicles WHERE vehicles.vehicle_category_id = vehicle_categories.id) as total_capacity')
    ])
    ->get();
```

---

## 🚀 CAPÍTULO 8: Optimización y Performance

### 8.1 Índices y Optimización

```php
// 🎯 CONSULTAS OPTIMIZADAS

// ✅ BUENAS PRÁCTICAS:

// 1. Seleccionar solo campos necesarios
$vehicles = Vehicle::select('id', 'name', 'capacity', 'vehicle_category_id')
    ->with('vehicleCategory:id,name')
    ->get();

// 2. Usar índices en WHERE clauses
$vehicles = Vehicle::where('vehicle_category_id', 1) // Asume índice en FK
    ->where('active', true) // Asume índice en campo active
    ->get();

// 3. Limitar resultados
$vehicles = Vehicle::where('active', true)
    ->limit(100)
    ->get();

// 4. Usar chunk para grandes datasets
Vehicle::where('active', true)
    ->chunk(200, function ($vehicles) {
        foreach ($vehicles as $vehicle) {
            // Procesar vehículo
        }
    });
```

### 8.2 Cacheo de Consultas

```php
// 🎯 CACHEAR RESULTADOS

use Illuminate\Support\Facades\Cache;

// Cachear por tiempo
$categories = Cache::remember('vehicle_categories', 3600, function () {
    return VehicleCategory::withCount('vehicles')->get();
});

// Cachear hasta que cambie
$stats = Cache::rememberForever('vehicle_stats', function () {
    return [
        'total' => Vehicle::count(),
        'active' => Vehicle::where('active', true)->count(),
        'total_capacity' => Vehicle::sum('capacity')
    ];
});

// Invalidar cache cuando sea necesario
Cache::forget('vehicle_categories');
Cache::forget('vehicle_stats');
```

### 8.3 Debugging de Queries

```php
// 🎯 DEBUG DE PERFORMANCE

// Ver queries ejecutadas
DB::enableQueryLog();

$vehicles = Vehicle::with('vehicleCategory')->get();

$queries = DB::getQueryLog();
dd($queries); // Ver todas las queries

// Ver SQL de una query sin ejecutar
$sql = Vehicle::where('active', true)
    ->with('vehicleCategory')
    ->toSql();
echo $sql;

// Usar explain para análisis
$explain = DB::select('EXPLAIN SELECT * FROM vehicles WHERE active = ?', [true]);
dd($explain);
```

---

## 🎪 CAPÍTULO 9: Casos de Uso Reales

### 9.1 Dashboard de Flotilla

```php
class FleetDashboardService 
{
    public function getDashboardData()
    {
        return [
            'overview' => $this->getOverviewStats(),
            'category_breakdown' => $this->getCategoryBreakdown(),
            'capacity_analysis' => $this->getCapacityAnalysis(),
            'recent_activity' => $this->getRecentActivity()
        ];
    }
  
    private function getOverviewStats()
    {
        return DB::table('vehicles')
            ->select([
                DB::raw('COUNT(*) as total_vehicles'),
                DB::raw('COUNT(CASE WHEN active = true THEN 1 END) as active_vehicles'),
                DB::raw('SUM(capacity) as total_capacity'),
                DB::raw('AVG(capacity) as avg_capacity')
            ])
            ->first();
    }
  
    private function getCategoryBreakdown()
    {
        return DB::table('vehicle_categories as vc')
            ->leftJoin('vehicles as v', 'vc.id', '=', 'v.vehicle_category_id')
            ->select([
                'vc.name as category',
                DB::raw('COUNT(v.id) as vehicle_count'),
                DB::raw('SUM(v.capacity) as total_capacity'),
                DB::raw('AVG(v.capacity) as avg_capacity')
            ])
            ->groupBy('vc.id', 'vc.name')
            ->orderBy('vehicle_count', 'desc')
            ->get();
    }
  
    private function getCapacityAnalysis()
    {
        return DB::table('vehicles')
            ->select([
                DB::raw('
                    CASE 
                        WHEN capacity < 1000 THEN "Pequeño"
                        WHEN capacity BETWEEN 1000 AND 2000 THEN "Mediano" 
                        ELSE "Grande"
                    END as size_category
                '),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(capacity) as total_capacity')
            ])
            ->where('active', true)
            ->groupBy('size_category')
            ->get();
    }
}
```

### 9.2 Sistema de Reportes

```php
class VehicleReportService
{
    public function generateUtilizationReport($startDate, $endDate)
    {
        return DB::table('vehicles as v')
            ->join('vehicle_categories as vc', 'v.vehicle_category_id', '=', 'vc.id')
            ->leftJoin('maintenance_records as mr', function ($join) use ($startDate, $endDate) {
                $join->on('v.id', '=', 'mr.vehicle_id')
                     ->whereBetween('mr.date', [$startDate, $endDate]);
            })
            ->select([
                'v.name as vehicle_name',
                'vc.name as category',
                'v.capacity',
                DB::raw('COUNT(mr.id) as maintenance_count'),
                DB::raw('SUM(mr.downtime_hours) as total_downtime'),
                DB::raw('
                    ROUND(
                        (1 - COALESCE(SUM(mr.downtime_hours), 0) / (24 * DATEDIFF(?, ?))) * 100, 
                        2
                    ) as utilization_percentage
                ')
            ])
            ->addBinding([$endDate, $startDate], 'select')
            ->where('v.active', true)
            ->groupBy('v.id', 'v.name', 'vc.name', 'v.capacity')
            ->orderBy('utilization_percentage', 'desc')
            ->get();
    }
}
```

---

## 🛠️ CAPÍTULO 10: Consultas Dinámicas

### 10.1 Query Builder Dinámico

```php
class VehicleSearchService
{
    public function search(array $filters)
    {
        $query = Vehicle::query();
      
        // Aplicar filtros condicionalmente
        if (!empty($filters['category_id'])) {
            $query->where('vehicle_category_id', $filters['category_id']);
        }
      
        if (!empty($filters['min_capacity'])) {
            $query->where('capacity', '>=', $filters['min_capacity']);
        }
      
        if (!empty($filters['max_capacity'])) {
            $query->where('capacity', '<=', $filters['max_capacity']);
        }
      
        if (!empty($filters['search_term'])) {
            $query->where('name', 'like', '%' . $filters['search_term'] . '%');
        }
      
        if (!empty($filters['active_only'])) {
            $query->where('active', true);
        }
      
        if (!empty($filters['waste_types'])) {
            $query->whereHas('wasteTypes', function ($q) use ($filters) {
                $q->whereIn('id', $filters['waste_types']);
            });
        }
      
        // Ordenamiento dinámico
        $sortField = $filters['sort_by'] ?? 'name';
        $sortDirection = $filters['sort_direction'] ?? 'asc';
        $query->orderBy($sortField, $sortDirection);
      
        // Cargar relaciones necesarias
        $query->with(['vehicleCategory', 'unitCapacityCategory']);
      
        return $query->paginate($filters['per_page'] ?? 15);
    }
}
```

### 10.2 Scopes Reutilizables

```php
// En tu modelo Vehicle.php
class Vehicle extends Model
{
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
  
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('vehicle_category_id', $categoryId);
    }
  
    public function scopeWithinCapacityRange($query, $min = null, $max = null)
    {
        if ($min !== null) {
            $query->where('capacity', '>=', $min);
        }
      
        if ($max !== null) {
            $query->where('capacity', '<=', $max);
        }
      
        return $query;
    }
  
    public function scopeSearch($query, $term)
    {
        return $query->where('name', 'like', '%' . $term . '%');
    }
  
    public function scopeWithFullDetails($query)
    {
        return $query->with([
            'vehicleCategory',
            'unitCapacityCategory',
            'wasteTypes'
        ]);
    }
}

// Uso súper limpio:
$vehicles = Vehicle::active()
    ->byCategory(1)
    ->withinCapacityRange(1000, 2000)
    ->search('Camión')
    ->withFullDetails()
    ->paginate(10);
```

---

## 🎯 CAPÍTULO 11: Patterns y Mejores Prácticas

### 11.1 Repository Pattern

```php
interface VehicleRepositoryInterface
{
    public function findAll(array $filters = []);
    public function findById(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
}

class VehicleRepository implements VehicleRepositoryInterface
{
    public function findAll(array $filters = [])
    {
        $query = Vehicle::query();
      
        // Aplicar filtros
        $this->applyFilters($query, $filters);
      
        return $query->with(['vehicleCategory', 'unitCapacityCategory'])
                    ->paginate($filters['per_page'] ?? 15);
    }
  
    public function findById(int $id)
    {
        return Vehicle::with(['vehicleCategory', 'unitCapacityCategory', 'wasteTypes'])
                     ->findOrFail($id);
    }
  
    private function applyFilters($query, array $filters)
    {
        collect($filters)->each(function ($value, $key) use ($query) {
            match($key) {
                'category_id' => $query->where('vehicle_category_id', $value),
                'active' => $query->where('active', $value),
                'min_capacity' => $query->where('capacity', '>=', $value),
                'max_capacity' => $query->where('capacity', '<=', $value),
                'search' => $query->where('name', 'like', '%' . $value . '%'),
                default => null
            };
        });
    }
}
```

### 11.2 Service Layer

```php
class VehicleService
{
    public function __construct(
        private VehicleRepository $vehicleRepository,
        private CacheService $cacheService
    ) {}
  
    public function getVehiclesWithStats(array $filters = [])
    {
        $cacheKey = 'vehicles_' . md5(serialize($filters));
      
        return $this->cacheService->remember($cacheKey, 3600, function () use ($filters) {
            $vehicles = $this->vehicleRepository->findAll($filters);
          
            return [
                'vehicles' => $vehicles,
                'stats' => [
                    'total' => $vehicles->total(),
                    'active' => Vehicle::where('active', true)->count(),
                    'categories' => VehicleCategory::count(),
                    'avg_capacity' => Vehicle::avg('capacity')
                ]
            ];
        });
    }
}
```

---

## 🏆 CAPÍTULO 12: Cheat Sheet Final

### 12.1 Comandos Más Usados

```php
// 📋 CRUD BÁSICO
Model::all()                          // Todos los registros
Model::find($id)                      // Por ID
Model::where('campo', 'valor')->get() // Con condición
Model::create($data)                  // Crear
Model::where('id', $id)->update($data) // Actualizar
Model::find($id)->delete()            // Eliminar

// 📋 RELACIONES
Model::with('relacion')->get()        // Eager loading
Model::whereHas('relacion')->get()    // Filtrar por relación
Model::withCount('relacion')->get()   // Contar relación

// 📋 AGREGACIONES
Model::count()                        // Contar
Model::sum('campo')                   // Sumar  
Model::avg('campo')                   // Promedio
Model::max('campo')                   // Máximo
Model::min('campo')                   // Mínimo

// 📋 FILTROS
->where('campo', 'valor')             // Igual
->where('campo', '>', 100)            // Mayor que
->where('campo', 'like', '%texto%')   // Contiene
->whereIn('campo', [1,2,3])          // En lista
->whereBetween('campo', [1, 100])    // Entre valores
->whereNull('campo')                  // Es null
->orderBy('campo', 'desc')            // Ordenar

// 📋 PAGINACIÓN Y LÍMITES
->paginate(15)                        // Paginado
->limit(10)->get()                    // Límite
->skip(10)->take(5)->get()           // Saltar y tomar
```

### 12.2 Reglas de Oro

1. **Siempre usa `with()` cuando necesites relaciones** (evita N+1)
2. **Selecciona solo campos necesarios** para mejor performance
3. **Usa índices en campos de WHERE y JOIN**
4. **Cachea consultas pesadas**
5. **Usa chunk() para datasets grandes**
6. **Prefiere Eloquent para CRUD, Query Builder para reportes**
7. **Siempre valida y sanitiza inputs del usuario**
8. **Usa transactions para operaciones múltiples**

### 12.3 El Mantra del Query Master:

*"Selecciona poco, filtra temprano, cachea inteligentemente"*

---

## 🎓 Graduación: Eres Oficialmente un Query Ninja! 🥷

Con esta guía dominas:

* ✅ CRUD completo con Eloquent y Query Builder
* ✅ Relaciones y joins optimizados
* ✅ Agregaciones y reportes complejos
* ✅ Subconsultas y queries dinámicas
* ✅ Patrones de diseño y mejores prácticas
* ✅ Optimización y debugging

**¡Ahora puedes construir cualquier consulta que necesites!** 🚀
