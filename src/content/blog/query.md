---
title: ' Laravel Query Builder'
code: 'laravel'
description: 'Guía Completa con Metodologías de Aprendizaje y Ejemplos Reales'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Masterclass: Laravel Query Builder - De Principiante a Experto
## Guía Completa con Metodologías de Aprendizaje y Ejemplos Reales

---

## 🎯 **METODOLOGÍA DE APRENDIZAJE EFECTIVA**

### **Técnica de los 4 Pilares:**
1. **Conceptualización** - Entender el "por qué"
2. **Práctica Guiada** - Ejemplos paso a paso
3. **Aplicación Real** - Casos de uso del mundo real
4. **Experimentación** - Variaciones y optimizaciones

### **Método de Retención:**
- 🧠 **Explicación conceptual** (15%)
- 👀 **Demostración visual** (25%)
- 🔨 **Práctica activa** (60%)

---

## 📚 **MÓDULO 1: FUNDAMENTOS DEL QUERY BUILDER**

### **¿Qué es Query Builder y por qué usarlo?**

**Concepto:** Es la interfaz fluida de Laravel para construir consultas SQL de manera programática.

**Ventajas:**
- Sintaxis más legible que SQL crudo
- Protección contra inyección SQL
- Compatibilidad multi-base de datos
- Integración perfecta con Eloquent

### **Ejemplo del Mundo Real: Sistema de E-commerce**
```php
// Situación: Necesitas obtener productos de una tienda online
// En lugar de SQL crudo, usas Query Builder

// ❌ SQL Crudo (propenso a errores)
$products = DB::select("SELECT * FROM products WHERE price > 100 AND stock > 0");

// ✅ Query Builder (limpio y seguro)
$products = DB::table('products')
    ->where('price', '>', 100)
    ->where('stock', '>', 0)
    ->get();
```

**🎯 Ejercicio Práctico:**
Crea 3 consultas básicas para:
1. Obtener usuarios activos
2. Productos en oferta
3. Pedidos del último mes

---

## 🔍 **MÓDULO 2: EJECUCIÓN DE CONSULTAS**

### **Métodos de Ejecución Principales**

```php
// 1. get() - Obtener múltiples registros
$users = DB::table('users')->get();

// 2. first() - Primer registro
$user = DB::table('users')->where('email', 'juan@email.com')->first();

// 3. find() - Por ID
$user = DB::table('users')->find(1);

// 4. value() - Un solo valor
$email = DB::table('users')->where('id', 1)->value('email');

// 5. count() - Contar registros
$total = DB::table('users')->count();
```

### **Caso Real: Dashboard de Administración**
```php
class DashboardController extends Controller
{
    public function index()
    {
        // Estadísticas para el dashboard
        $stats = [
            'total_users' => DB::table('users')->count(),
            'active_users' => DB::table('users')->where('status', 'active')->count(),
            'total_orders' => DB::table('orders')->count(),
            'revenue_today' => DB::table('orders')
                ->whereDate('created_at', today())
                ->sum('total_amount'),
            'latest_orders' => DB::table('orders')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
        ];
        
        return view('dashboard', $stats);
    }
}
```

**🎯 Método de Aprendizaje:**
1. Copia el código exacto
2. Ejecuta en tu proyecto
3. Modifica un parámetro a la vez
4. Observa los cambios en el resultado

---

## 📊 **MÓDULO 3: RESULTADOS DE FRAGMENTACIÓN (CHUNKING)**

### **Concepto:** Procesar grandes cantidades de datos sin sobrecargar la memoria.

### **Ejemplo Real: Envío Masivo de Emails**
```php
// ❌ Problema: Cargar 100,000 usuarios en memoria
$users = DB::table('users')->get(); // ¡Boom! Memoria agotada

// ✅ Solución: Chunking
DB::table('users')->chunk(1000, function ($users) {
    foreach ($users as $user) {
        // Enviar email
        Mail::to($user->email)->send(new NewsletterMail());
    }
});

// ✅ Chunking con condiciones
DB::table('users')
    ->where('subscribed', true)
    ->chunk(500, function ($users) {
        foreach ($users as $user) {
            // Procesar cada usuario
            $this->processUser($user);
        }
    });
```

### **Caso Real: Migración de Datos**
```php
// Migrar datos de sistema legacy
public function migrateCustomers()
{
    DB::table('legacy_customers')->chunk(100, function ($customers) {
        foreach ($customers as $customer) {
            // Transformar y insertar en nueva tabla
            DB::table('customers')->insert([
                'name' => $customer->customer_name,
                'email' => $customer->email_address,
                'phone' => $this->formatPhone($customer->phone),
                'created_at' => now()
            ]);
        }
    });
}
```

**🎯 Ejercicio Progresivo:**
1. Día 1: Chunk simple con 10 registros
2. Día 2: Chunk con condiciones
3. Día 3: Chunk con transformación de datos

---

## ⚡ **MÓDULO 4: TRANSMISIÓN PEREZOSA (LAZY LOADING)**

### **Concepto:** Cargar datos bajo demanda para optimizar memoria.

```php
// Para datasets muy grandes
DB::table('transactions')
    ->where('amount', '>', 1000)
    ->lazy()
    ->each(function ($transaction) {
        // Procesar una transacción a la vez
        $this->generateReport($transaction);
    });

// Con tamaño de chunk personalizado
DB::table('orders')
    ->lazy(500) // Chunks de 500 registros
    ->filter(function ($order) {
        return $order->status === 'pending';
    })
    ->each(function ($order) {
        $this->processOrder($order);
    });
```

### **Caso Real: Análisis de Logs**
```php
public function analyzeLogs()
{
    $errorCount = 0;
    $warningCount = 0;
    
    DB::table('application_logs')
        ->whereDate('created_at', '>=', now()->subDays(30))
        ->lazy(1000)
        ->each(function ($log) use (&$errorCount, &$warningCount) {
            if ($log->level === 'error') {
                $errorCount++;
            } elseif ($log->level === 'warning') {
                $warningCount++;
            }
        });
    
    return [
        'errors' => $errorCount,
        'warnings' => $warningCount
    ];
}
```

---

## 📈 **MÓDULO 5: FUNCIONES DE AGREGACIÓN**

### **Las 5 Funciones Esenciales**

```php
// 1. count() - Contar registros
$totalProducts = DB::table('products')->count();
$activeProducts = DB::table('products')->where('status', 'active')->count();

// 2. sum() - Sumar valores
$totalRevenue = DB::table('orders')->sum('total_amount');
$monthlyRevenue = DB::table('orders')
    ->whereMonth('created_at', now()->month)
    ->sum('total_amount');

// 3. avg() - Promedio
$averageOrderValue = DB::table('orders')->avg('total_amount');

// 4. min() y max() - Valores mínimo y máximo
$cheapestProduct = DB::table('products')->min('price');
$mostExpensive = DB::table('products')->max('price');

// 5. Agregaciones múltiples
$stats = DB::table('orders')
    ->selectRaw('
        COUNT(*) as total_orders,
        SUM(total_amount) as revenue,
        AVG(total_amount) as avg_order_value,
        MIN(total_amount) as min_order,
        MAX(total_amount) as max_order
    ')
    ->first();
```

### **Caso Real: Reporte de Ventas**
```php
public function salesReport($period = 'month')
{
    $query = DB::table('orders')
        ->join('order_items', 'orders.id', '=', 'order_items.order_id')
        ->join('products', 'order_items.product_id', '=', 'products.id');
    
    // Filtro por período
    switch ($period) {
        case 'day':
            $query->whereDate('orders.created_at', today());
            break;
        case 'week':
            $query->whereBetween('orders.created_at', [now()->startOfWeek(), now()->endOfWeek()]);
            break;
        case 'month':
            $query->whereMonth('orders.created_at', now()->month);
            break;
    }
    
    return $query->selectRaw('
        products.category,
        COUNT(DISTINCT orders.id) as total_orders,
        SUM(order_items.quantity) as items_sold,
        SUM(order_items.quantity * order_items.price) as revenue,
        AVG(orders.total_amount) as avg_order_value
    ')
    ->groupBy('products.category')
    ->orderBy('revenue', 'desc')
    ->get();
}
```

---

## 🎯 **MÓDULO 6: CLÁUSULAS DE SELECCIÓN**

### **Select Básico vs Avanzado**

```php
// Selección básica
$users = DB::table('users')
    ->select('name', 'email', 'created_at')
    ->get();

// Selección con alias
$products = DB::table('products')
    ->select('name as product_name', 'price as cost', 'stock as available')
    ->get();

// Selección con expresiones
$orders = DB::table('orders')
    ->select('id', 'total_amount')
    ->selectRaw('total_amount * 0.21 as tax_amount')
    ->selectRaw('total_amount + (total_amount * 0.21) as final_amount')
    ->get();

// addSelect() - Agregar campos dinámicamente
$query = DB::table('users')->select('name', 'email');

if ($includePhone) {
    $query->addSelect('phone');
}

if ($includeAddress) {
    $query->addSelect('address', 'city');
}

$users = $query->get();
```

### **Caso Real: API con Campos Dinámicos**
```php
public function getUsers(Request $request)
{
    $fields = $request->get('fields', ['id', 'name', 'email']);
    $includeStats = $request->boolean('include_stats');
    
    $query = DB::table('users')->select($fields);
    
    if ($includeStats) {
        $query->selectSub(
            DB::table('orders')->whereColumn('user_id', 'users.id')->count(),
            'total_orders'
        );
        
        $query->selectSub(
            DB::table('orders')->whereColumn('user_id', 'users.id')->sum('total_amount'),
            'total_spent'
        );
    }
    
    return $query->get();
}
```

---

## 🔧 **MÓDULO 7: EXPRESIONES CRUDAS (RAW EXPRESSIONS)**

### **Cuándo y Cómo Usar Raw**

```php
// selectRaw() - Para cálculos complejos
$products = DB::table('products')
    ->selectRaw('name, price, stock, (price * stock) as inventory_value')
    ->selectRaw('CASE WHEN stock > 100 THEN "High" WHEN stock > 50 THEN "Medium" ELSE "Low" END as stock_level')
    ->get();

// whereRaw() - Para condiciones complejas
$users = DB::table('users')
    ->whereRaw('MONTH(created_at) = MONTH(CURDATE())')
    ->whereRaw('YEAR(created_at) = YEAR(CURDATE())')
    ->get();

// orderByRaw() - Para ordenamiento complejo
$products = DB::table('products')
    ->orderByRaw('FIELD(category, "electronics", "clothing", "books")')
    ->orderBy('price', 'desc')
    ->get();

// havingRaw() - Para condiciones en GROUP BY
$categories = DB::table('products')
    ->select('category')
    ->selectRaw('COUNT(*) as product_count')
    ->selectRaw('AVG(price) as avg_price')
    ->groupBy('category')
    ->havingRaw('COUNT(*) > ?', [10])
    ->havingRaw('AVG(price) > ?', [100])
    ->get();
```

### **Caso Real: Reporte de Inventario Avanzado**
```php
public function inventoryReport()
{
    return DB::table('products')
        ->select('category', 'name', 'stock', 'price')
        ->selectRaw('(price * stock) as inventory_value')
        ->selectRaw('
            CASE 
                WHEN stock = 0 THEN "Out of Stock"
                WHEN stock < 10 THEN "Low Stock"
                WHEN stock < 50 THEN "Medium Stock"
                ELSE "High Stock"
            END as stock_status
        ')
        ->selectRaw('
            DATEDIFF(NOW(), updated_at) as days_since_update
        ')
        ->whereRaw('stock > 0 OR updated_at > DATE_SUB(NOW(), INTERVAL 30 DAY)')
        ->orderByRaw('
            CASE stock_status
                WHEN "Out of Stock" THEN 1
                WHEN "Low Stock" THEN 2
                WHEN "Medium Stock" THEN 3
                ELSE 4
            END
        ')
        ->get();
}
```

---

## 🔗 **MÓDULO 8: JOINS - CONECTANDO TABLAS**

### **Tipos de JOIN y Cuándo Usarlos**

```php
// INNER JOIN - Solo registros que coinciden en ambas tablas
$orders = DB::table('orders')
    ->join('users', 'orders.user_id', '=', 'users.id')
    ->select('orders.*', 'users.name as customer_name', 'users.email')
    ->get();

// LEFT JOIN - Todos los registros de la tabla izquierda
$users = DB::table('users')
    ->leftJoin('orders', 'users.id', '=', 'orders.user_id')
    ->select('users.*')
    ->selectRaw('COUNT(orders.id) as total_orders')
    ->selectRaw('COALESCE(SUM(orders.total_amount), 0) as total_spent')
    ->groupBy('users.id')
    ->get();

// RIGHT JOIN - Todos los registros de la tabla derecha
$products = DB::table('order_items')
    ->rightJoin('products', 'order_items.product_id', '=', 'products.id')
    ->select('products.*')
    ->selectRaw('COALESCE(SUM(order_items.quantity), 0) as total_sold')
    ->groupBy('products.id')
    ->get();

// MÚLTIPLES JOINS
$orderDetails = DB::table('orders')
    ->join('users', 'orders.user_id', '=', 'users.id')
    ->join('order_items', 'orders.id', '=', 'order_items.order_id')
    ->join('products', 'order_items.product_id', '=', 'products.id')
    ->select(
        'orders.id as order_id',
        'users.name as customer',
        'products.name as product',
        'order_items.quantity',
        'order_items.price'
    )
    ->get();
```

### **Caso Real: Sistema de Facturación**
```php
public function generateInvoice($orderId)
{
    // Información principal de la factura
    $invoice = DB::table('orders')
        ->join('users', 'orders.user_id', '=', 'users.id')
        ->join('addresses', 'orders.billing_address_id', '=', 'addresses.id')
        ->select(
            'orders.id',
            'orders.order_number',
            'orders.total_amount',
            'orders.tax_amount',
            'orders.created_at',
            'users.name as customer_name',
            'users.email as customer_email',
            'addresses.street',
            'addresses.city',
            'addresses.postal_code'
        )
        ->where('orders.id', $orderId)
        ->first();
    
    // Detalle de items
    $items = DB::table('order_items')
        ->join('products', 'order_items.product_id', '=', 'products.id')
        ->select(
            'products.name',
            'products.sku',
            'order_items.quantity',
            'order_items.price',
            DB::raw('(order_items.quantity * order_items.price) as line_total')
        )
        ->where('order_items.order_id', $orderId)
        ->get();
    
    return [
        'invoice' => $invoice,
        'items' => $items
    ];
}
```

---

## 🎯 **MÓDULO 9: CLÁUSULAS WHERE MAESTRAS**

### **WHERE Básico vs Avanzado**

```php
// WHERE básico
$users = DB::table('users')
    ->where('status', 'active')
    ->where('age', '>=', 18)
    ->get();

// orWhere() - Condición OR
$products = DB::table('products')
    ->where('category', 'electronics')
    ->orWhere('price', '<', 50)
    ->get();

// whereNot() - Negación
$users = DB::table('users')
    ->whereNot('status', 'banned')
    ->whereNot('email_verified_at', null)
    ->get();

// whereBetween() y whereNotBetween()
$orders = DB::table('orders')
    ->whereBetween('total_amount', [100, 500])
    ->whereBetween('created_at', [now()->subDays(30), now()])
    ->get();

// whereIn() y whereNotIn()
$products = DB::table('products')
    ->whereIn('category', ['electronics', 'books', 'clothing'])
    ->whereNotIn('status', ['discontinued', 'out_of_stock'])
    ->get();

// whereNull() y whereNotNull()
$users = DB::table('users')
    ->whereNotNull('email_verified_at')
    ->whereNull('deleted_at')
    ->get();

// whereDate(), whereMonth(), whereYear()
$orders = DB::table('orders')
    ->whereDate('created_at', '2024-01-15')
    ->whereMonth('created_at', 1)
    ->whereYear('created_at', 2024)
    ->get();
```

### **Agrupación Lógica Avanzada**
```php
// Agrupación con where()
$users = DB::table('users')
    ->where(function ($query) {
        $query->where('city', 'Rosario')
              ->orWhere('city', 'Buenos Aires');
    })
    ->where(function ($query) {
        $query->where('age', '>=', 18)
              ->where('status', 'active');
    })
    ->get();

// Caso complejo: Búsqueda de productos
public function searchProducts($filters)
{
    $query = DB::table('products');
    
    // Filtros de precio
    if (isset($filters['min_price']) || isset($filters['max_price'])) {
        $query->where(function ($q) use ($filters) {
            if (isset($filters['min_price'])) {
                $q->where('price', '>=', $filters['min_price']);
            }
            if (isset($filters['max_price'])) {
                $q->where('price', '<=', $filters['max_price']);
            }
        });
    }
    
    // Filtros de categoría
    if (!empty($filters['categories'])) {
        $query->whereIn('category', $filters['categories']);
    }
    
    // Filtros de búsqueda por texto
    if (!empty($filters['search'])) {
        $query->where(function ($q) use ($filters) {
            $q->where('name', 'LIKE', '%' . $filters['search'] . '%')
              ->orWhere('description', 'LIKE', '%' . $filters['search'] . '%')
              ->orWhere('sku', 'LIKE', '%' . $filters['search'] . '%');
        });
    }
    
    return $query->get();
}
```

---

## 📊 **MÓDULO 10: ORDENAMIENTO Y AGRUPACIÓN**

### **orderBy() Avanzado**
```php
// Ordenamiento básico
$users = DB::table('users')
    ->orderBy('name', 'asc')
    ->orderBy('created_at', 'desc')
    ->get();

// Ordenamiento condicional
$products = DB::table('products')
    ->when($sortBy === 'popularity', function ($query) {
        return $query->orderBy('views', 'desc');
    })
    ->when($sortBy === 'price_low', function ($query) {
        return $query->orderBy('price', 'asc');
    })
    ->when($sortBy === 'price_high', function ($query) {
        return $query->orderBy('price', 'desc');
    })
    ->get();

// latest() y oldest() - Shortcuts útiles
$recentOrders = DB::table('orders')->latest()->get(); // ORDER BY created_at DESC
$oldestUsers = DB::table('users')->oldest()->get();   // ORDER BY created_at ASC

// inRandomOrder() - Orden aleatorio
$featuredProducts = DB::table('products')
    ->where('featured', true)
    ->inRandomOrder()
    ->limit(5)
    ->get();
```

### **groupBy() con HAVING**
```php
// Agrupación básica
$salesByCategory = DB::table('order_items')
    ->join('products', 'order_items.product_id', '=', 'products.id')
    ->select('products.category')
    ->selectRaw('SUM(order_items.quantity * order_items.price) as total_sales')
    ->selectRaw('COUNT(*) as total_items')
    ->groupBy('products.category')
    ->having('total_sales', '>', 1000)
    ->orderBy('total_sales', 'desc')
    ->get();

// Agrupación por fecha
$dailySales = DB::table('orders')
    ->selectRaw('DATE(created_at) as sale_date')
    ->selectRaw('COUNT(*) as orders_count')
    ->selectRaw('SUM(total_amount) as daily_revenue')
    ->groupByRaw('DATE(created_at)')
    ->orderByRaw('DATE(created_at) DESC')
    ->limit(30)
    ->get();
```

---

## 🎮 **MÓDULO 11: LÍMITES, PAGINACIÓN Y OFFSET**

### **limit() y offset()**
```php
// Paginación manual
$page = 2;
$perPage = 10;
$offset = ($page - 1) * $perPage;

$products = DB::table('products')
    ->offset($offset)
    ->limit($perPage)
    ->get();

// take() y skip() - Aliases más legibles
$latestOrders = DB::table('orders')
    ->latest()
    ->take(20)  // limit(20)
    ->get();

$secondPage = DB::table('users')
    ->skip(10)  // offset(10)
    ->take(10)  // limit(10)
    ->get();
```

### **Paginación con Laravel**
```php
// Paginación automática
public function getProducts(Request $request)
{
    $perPage = $request->get('per_page', 15);
    
    $products = DB::table('products')
        ->where('status', 'active')
        ->orderBy('name')
        ->paginate($perPage);
    
    return $products;
}

// Paginación simple (sin contador total)
$products = DB::table('products')
    ->where('featured', true)
    ->simplePaginate(10);
```

---

## 🔀 **MÓDULO 12: CLÁUSULAS CONDICIONALES**

### **when() - Consultas Dinámicas**
```php
public function searchUsers($filters)
{
    return DB::table('users')
        ->when($filters['name'] ?? false, function ($query, $name) {
            return $query->where('name', 'LIKE', "%{$name}%");
        })
        ->when($filters['email'] ?? false, function ($query, $email) {
            return $query->where('email', 'LIKE', "%{$email}%");
        })
        ->when($filters['status'] ?? false, function ($query, $status) {
            return $query->where('status', $status);
        })
        ->when($filters['created_from'] ?? false, function ($query, $date) {
            return $query->whereDate('created_at', '>=', $date);
        })
        ->when($filters['created_to'] ?? false, function ($query, $date) {
            return $query->whereDate('created_at', '<=', $date);
        })
        ->get();
}
```

### **unless() - Condición Inversa**
```php
public function getProducts($includeInactive = false)
{
    return DB::table('products')
        ->unless($includeInactive, function ($query) {
            return $query->where('status', 'active');
        })
        ->orderBy('name')
        ->get();
}
```

---

## ➕ **MÓDULO 13: INSERCIÓN DE REGISTROS**

### **insert(), insertGetId(), upsert()**
```php
// Insert simple
DB::table('users')->insert([
    'name' => 'Juan Pérez',
    'email' => 'juan@email.com',
    'password' => bcrypt('password'),
    'created_at' => now()
]);

// Insert múltiple
DB::table('products')->insert([
    [
        'name' => 'Laptop HP',
        'price' => 50000,
        'category' => 'electronics',
        'created_at' => now()
    ],
    [
        'name' => 'Mouse Logitech',
        'price' => 2500,
        'category' => 'electronics',
        'created_at' => now()
    ]
]);

// insertGetId() - Obtener ID del registro insertado
$userId = DB::table('users')->insertGetId([
    'name' => 'María García',
    'email' => 'maria@email.com',
    'created_at' => now()
]);

// upsert() - Insert o Update según exista
DB::table('products')->upsert(
    [
        ['sku' => 'LAPTOP-001', 'name' => 'Laptop HP', 'price' => 50000],
        ['sku' => 'MOUSE-001', 'name' => 'Mouse Logitech', 'price' => 2500],
    ],
    ['sku'], // Columnas únicas para verificar existencia
    ['name', 'price'] // Columnas a actualizar si existe
);
```

### **Caso Real: Sistema de Importación**
```php
public function importProducts($csvFile)
{
    $products = [];
    $batchSize = 1000;
    
    foreach ($csvFile as $row) {
        $products[] = [
            'sku' => $row['sku'],
            'name' => $row['name'],
            'price' => (float) $row['price'],
            'category' => $row['category'],
            'stock' => (int) $row['stock'],
            'created_at' => now(),
            'updated_at' => now()
        ];
        
        // Insertar en lotes para optimizar rendimiento
        if (count($products) >= $batchSize) {
            DB::table('products')->insert($products);
            $products = []; // Limpiar array
        }
    }
    
    // Insertar registros restantes
    if (!empty($products)) {
        DB::table('products')->insert($products);
    }
}
```

---

## 🚀 **PLAN DE PRÁCTICA DE 30 DÍAS**

### **Semana 1: Fundamentos**
- **Día 1-2:** Conceptos básicos y primeras consultas
- **Día 3-4:** WHERE y condiciones
- **Día 5-6:** SELECT y agregaciones
- **Día 7:** Proyecto: Dashboard básico

### **Semana 2: Consultas Intermedias**
- **Día 8-9:** JOINS y relaciones
- **Día 10-11:** Agrupación y ordenamiento
- **Día 12-13:** Expresiones RAW
- **Día 14:** Proyecto: Sistema de reportes

### **Semana 3: Consultas Avanzadas**
- **Día 15-16:** Chunking y Lazy loading
- **Día 17-18:** Consultas condicionales
- **Día 19-20:** Optimización de queries
- **Día 21:** Proyecto: API con filtros avanzados

### **Semana 4: Casos Reales**
- **Día 22-23:** E-commerce queries
- **Día 24-25:** Sistema de usuarios
- **Día 26-27:** Reportes complejos
- **Día 28-30:** Proyecto final integrador

---

## 🎯 **EJERCICIOS PRÁCTICOS DIARIOS**

### **Ejercicio Día 1: Setup Inicial**
```php
// Crear estas tablas y poblar con datos de prueba
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('status')->default('active');
    $table->timestamp('email_verified_at')->nullable();
    $table->timestamps();
});

// Tu tarea: Crear 100 usuarios de prueba usando Factory
```

### **Ejercicio Día 5: Consultas de Agregación**
```php
// Resuelve estos problemas:
// 1. Total de usuarios por estado
// 2. Promedio de edad de usuarios activos
// 3. Usuarios registrados por mes
// 4. Top 5 ciudades con más usuarios
```

### **Ejercicio Día 10: JOINs Complejos**
```php
// Crear consulta que muestre:
// - Nombre del usuario
// - Total de pedidos
// - Suma total gastada
// - Producto más comprado
// - Fecha del último pedido
```

---

## 🏆 **PROYECTO FINAL: E-COMMERCE ANALYTICS**

### **Requisitos del Proyecto:**
1. Dashboard con métricas clave
2. Reportes de ventas por período
3. Análisis de productos populares
4. Sistema de búsqueda avanzada
5. Exportación de datos
6. Optimización de consultas

### **Estructura de Base de Datos:**
```sql
-- users: id, name, email, city, created_at
-- products: id, name, price, category, stock, sku
-- orders: id, user_id, total_amount, status, created_at
-- order_items: id, order_id, product_id, quantity, price
```

### **Funcionalidades a Implementar:**
```php
class EcommerceAnalytics
{
    public function dashboard()
    {
        // Métricas principales del negocio
    }
    
    public function salesReport($period, $filters = [])
    {
        // Reporte de ventas configurable
    }
    
    public function productAnalysis()
    {
        // Análisis de rendimiento de productos
    }
    
    public function customerSegmentation()
    {
        // Segmentación de clientes
    }
    
    public function inventoryReport()
    {
        // Estado del inventario
    }
}
```

---

## 🎓 **CERTIFICACIÓN DE MAESTRÍA**

### **Para Obtener tu Certificación:**
1. ✅ Completar todos los ejercicios diarios
2. ✅ Desarrollar el proyecto final
3. ✅ Optimizar al menos 3 consultas lentas
4. ✅ Crear 5 casos de uso propios
5. ✅ Documentar tu aprendizaje

### **Niveles de Maestría:**
- 🥉 **Bronce:** Fundamentos + 1 proyecto
- 🥈 **Plata:** Intermedio + 2 proyectos + optimizaciones
- 🥇 **Oro:** Avanzado + 3 proyectos + casos complejos + mentoring

---

## 📚 **RECURSOS ADICIONALES**

### **Herramientas Recomendadas:**
- **Laravel Debugbar:** Para ver queries ejecutadas
- **Laravel Telescope:** Monitoring de aplicaciones
- **DB Browser:** Para explorar base de datos
- **Tinker:** Para probar queries en tiempo real

### **Consejos de Optimización:**
1. **Usa índices** en columnas de WHERE frecuentes
2. **Evita N+1 queries** con eager loading
3. **Chunking** para grandes datasets
4. **Cache** resultados frecuentes
5. **Explica queries** lentas con EXPLAIN

---

*¿Listo para convertirte en un maestro del Query Builder? ¡Comienza hoy mismo con el Día 1!*