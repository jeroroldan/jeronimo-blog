---
title: 'Arrays y Strings en PHP'
code: "laravel"
description: 'Guía Completa - Arrays y Strings en PHP'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía Completa - Arrays y Strings en PHP

## Tabla de Contenidos

1. [Arrays en PHP](#1-arrays-en-php)
2. [Métodos de Arrays](#2-métodos-de-arrays)
3. [Strings en PHP](#3-strings-en-php)
4. [Métodos de Strings](#4-métodos-de-strings)
5. [Combinaciones Arrays + Strings](#5-combinaciones-arrays--strings)
6. [Casos Prácticos](#6-casos-prácticos)
7. [Mejores Prácticas](#7-mejores-prácticas)

---

## 1. Arrays en PHP

### 1.1 Tipos de Arrays

#### Arrays Indexados

```php
// ✅ Declaración de arrays indexados
$frutas = ['manzana', 'banana', 'naranja'];
$numeros = [1, 2, 3, 4, 5];
$mixto = ['Juan', 25, true, 3.14];

// Declaración alternativa
$colores = array('rojo', 'verde', 'azul');

// Acceso por índice
echo $frutas[0];  // 'manzana'
echo $frutas[1];  // 'banana'

// Agregar elementos
$frutas[] = 'uva';              // Al final
$frutas[10] = 'kiwi';          // En posición específica
array_push($frutas, 'pera');    // Al final (múltiples)
```

#### Arrays Asociativos

```php
// ✅ Arrays asociativos (clave => valor)
$persona = [
    'nombre' => 'Juan Pérez',
    'edad' => 30,
    'email' => 'juan@email.com',
    'activo' => true
];

// Declaración alternativa
$configuracion = array(
    'host' => 'localhost',
    'puerto' => 3306,
    'usuario' => 'root'
);

// Acceso por clave
echo $persona['nombre'];        // 'Juan Pérez'
echo $persona['edad'];          // 30

// Agregar/modificar elementos
$persona['telefono'] = '123-456-7890';
$persona['edad'] = 31;
```

#### Arrays Multidimensionales

```php
// ✅ Arrays multidimensionales
$usuarios = [
    [
        'id' => 1,
        'nombre' => 'Juan',
        'email' => 'juan@email.com',
        'roles' => ['admin', 'editor']
    ],
    [
        'id' => 2,
        'nombre' => 'María',
        'email' => 'maria@email.com',
        'roles' => ['user']
    ]
];

// Acceso a elementos anidados
echo $usuarios[0]['nombre'];           // 'Juan'
echo $usuarios[0]['roles'][0];         // 'admin'

// Array asociativo complejo
$empresa = [
    'nombre' => 'TechCorp',
    'empleados' => [
        'desarrollo' => [
            ['nombre' => 'Ana', 'salario' => 50000],
            ['nombre' => 'Luis', 'salario' => 55000]
        ],
        'marketing' => [
            ['nombre' => 'Carlos', 'salario' => 45000]
        ]
    ],
    'oficinas' => [
        'madrid' => ['direccion' => 'Calle Principal 123'],
        'barcelona' => ['direccion' => 'Avenida Central 456']
    ]
];
```

### 1.2 Verificación y Análisis de Arrays

```php
// ✅ Verificaciones básicas
$array = ['a', 'b', 'c'];

var_dump(is_array($array));           // bool(true)
var_dump(empty($array));              // bool(false)
var_dump(isset($array[1]));           // bool(true)
var_dump(count($array));              // int(3)
var_dump(sizeof($array));             // int(3) - alias de count()

// ✅ Verificar claves y valores
$persona = ['nombre' => 'Juan', 'edad' => 30];

var_dump(array_key_exists('nombre', $persona));    // bool(true)
var_dump(in_array('Juan', $persona));              // bool(true)
var_dump(in_array(30, $persona, true));            // bool(true) - strict

// ✅ Información del array
print_r(array_keys($persona));        // ['nombre', 'edad']
print_r(array_values($persona));      // ['Juan', 30]
print_r(array_flip($persona));        // ['Juan' => 'nombre', 30 => 'edad']
```

---

## 2. Métodos de Arrays

### 2.1 Agregar y Quitar Elementos

```php
$frutas = ['manzana', 'banana'];

// ✅ Agregar elementos
array_push($frutas, 'naranja', 'uva');     // Al final
array_unshift($frutas, 'kiwi', 'pera');   // Al principio
$frutas = array_merge($frutas, ['fresa', 'mango']);

print_r($frutas); 
// ['kiwi', 'pera', 'manzana', 'banana', 'naranja', 'uva', 'fresa', 'mango']

// ✅ Quitar elementos
$ultimo = array_pop($frutas);              // Quita y retorna el último
$primero = array_shift($frutas);           // Quita y retorna el primero
unset($frutas[2]);                         // Quita por índice específico

// ✅ Quitar por valor
$frutas = array_diff($frutas, ['banana']); // Quita todas las 'banana'
$frutas = array_filter($frutas, function($fruta) {
    return $fruta !== 'manzana';
});
```

### 2.2 Transformación de Arrays

```php
$numeros = [1, 2, 3, 4, 5];

// ✅ array_map - Transforma cada elemento
$cuadrados = array_map(function($n) {
    return $n * $n;
}, $numeros);
// Resultado: [1, 4, 9, 16, 25]

$nombres = ['juan', 'maría', 'carlos'];
$nombresMayuscula = array_map('strtoupper', $nombres);
// Resultado: ['JUAN', 'MARÍA', 'CARLOS']

// ✅ array_filter - Filtra elementos
$pares = array_filter($numeros, function($n) {
    return $n % 2 === 0;
});
// Resultado: [2, 4]

$usuarios = [
    ['nombre' => 'Juan', 'activo' => true],
    ['nombre' => 'María', 'activo' => false],
    ['nombre' => 'Carlos', 'activo' => true]
];

$usuariosActivos = array_filter($usuarios, function($usuario) {
    return $usuario['activo'];
});

// ✅ array_reduce - Reduce a un solo valor
$suma = array_reduce($numeros, function($carry, $item) {
    return $carry + $item;
}, 0);
// Resultado: 15

$concatenacion = array_reduce($nombres, function($carry, $item) {
    return $carry . $item . ' ';
}, '');
// Resultado: 'juan maría carlos '
```

### 2.3 Búsqueda y Ordenamiento

```php
// ✅ Búsqueda en arrays
$frutas = ['manzana', 'banana', 'naranja', 'banana'];

$posicion = array_search('banana', $frutas);      // 1 (primera ocurrencia)
$todasPosiciones = array_keys($frutas, 'banana'); // [1, 3]
$existe = in_array('manzana', $frutas);           // true

// ✅ Ordenamiento
$numeros = [3, 1, 4, 1, 5, 9, 2, 6];

// Ordenamiento simple
sort($numeros);          // [1, 1, 2, 3, 4, 5, 6, 9] (reindexado)
rsort($numeros);         // [9, 6, 5, 4, 3, 2, 1, 1] (reverso)

// Mantener claves
$asociativo = ['c' => 3, 'a' => 1, 'b' => 2];
asort($asociativo);      // ['a' => 1, 'b' => 2, 'c' => 3] (por valor)
ksort($asociativo);      // ['a' => 1, 'b' => 2, 'c' => 3] (por clave)

// Ordenamiento personalizado
$personas = [
    ['nombre' => 'Juan', 'edad' => 30],
    ['nombre' => 'María', 'edad' => 25],
    ['nombre' => 'Carlos', 'edad' => 35]
];

usort($personas, function($a, $b) {
    return $a['edad'] <=> $b['edad'];  // Ordenar por edad
});

// Usando array_multisort
$nombres = ['Juan', 'María', 'Carlos'];
$edades = [30, 25, 35];
array_multisort($edades, SORT_ASC, $nombres);
// $nombres ahora: ['María', 'Juan', 'Carlos']
// $edades ahora: [25, 30, 35]
```

### 2.4 Manipulación Avanzada

```php
// ✅ array_slice - Extraer porción
$numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

$porcion = array_slice($numeros, 2, 3);        // [3, 4, 5]
$desdeIndice = array_slice($numeros, -3);      // [8, 9, 10]
$conClaves = array_slice($numeros, 1, 3, true); // Preserva claves

// ✅ array_splice - Quitar/insertar elementos
$frutas = ['manzana', 'banana', 'naranja'];
$eliminados = array_splice($frutas, 1, 1, ['kiwi', 'uva']);
// $frutas: ['manzana', 'kiwi', 'uva', 'naranja']
// $eliminados: ['banana']

// ✅ array_chunk - Dividir en fragmentos
$numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];
$chunks = array_chunk($numeros, 3);
// [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

$chunkConClaves = array_chunk($numeros, 3, true); // Preserva claves

// ✅ array_combine - Combinar arrays
$claves = ['nombre', 'email', 'edad'];
$valores = ['Juan', 'juan@email.com', 30];
$combinado = array_combine($claves, $valores);
// ['nombre' => 'Juan', 'email' => 'juan@email.com', 'edad' => 30]

// ✅ array_merge vs array_merge_recursive
$array1 = ['a' => 1, 'b' => [2, 3]];
$array2 = ['b' => [4, 5], 'c' => 6];

$merge = array_merge($array1, $array2);
// ['a' => 1, 'b' => [4, 5], 'c' => 6] - Sobrescribe

$mergeRecursive = array_merge_recursive($array1, $array2);
// ['a' => 1, 'b' => [2, 3, 4, 5], 'c' => 6] - Combina arrays anidados
```

### 2.5 Arrays de Funciones Útiles

```php
// ✅ Funciones estadísticas
$numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

$suma = array_sum($numeros);                    // 55
$producto = array_product($numeros);            // 3628800
$maximo = max($numeros);                        // 10
$minimo = min($numeros);                        // 1

// ✅ array_unique - Quitar duplicados
$conDuplicados = [1, 2, 2, 3, 3, 3, 4];
$unicos = array_unique($conDuplicados);         // [1, 2, 3, 4]

// ✅ array_intersect - Intersección
$array1 = [1, 2, 3, 4];
$array2 = [3, 4, 5, 6];
$interseccion = array_intersect($array1, $array2); // [3, 4]

// ✅ array_diff - Diferencia
$diferencia = array_diff($array1, $array2);    // [1, 2]

// ✅ array_rand - Elementos aleatorios
$frutas = ['manzana', 'banana', 'naranja', 'kiwi'];
$indiceAleatorio = array_rand($frutas);         // Índice aleatorio
$elementoAleatorio = $frutas[array_rand($frutas)]; // Elemento aleatorio
$variosIndices = array_rand($frutas, 2);        // Array con 2 índices aleatorios

// ✅ shuffle - Mezclar array
$cartas = ['As', 'Rey', 'Reina', 'Jack'];
shuffle($cartas); // Mezcla el array in-place
```

---

## 3. Strings en PHP

### 3.1 Declaración y Tipos de Strings

```php
// ✅ Diferentes formas de declarar strings
$simple = 'Hola mundo';
$doble = "Hola mundo";
$variable = "Juan";
$interpolacion = "Hola $variable";          // "Hola Juan"
$concatenacion = 'Hola ' . $variable;       // "Hola Juan"

// ✅ Heredoc y Nowdoc
$heredoc = <<<EOD
Esta es una cadena heredoc.
Puede contener múltiples líneas.
Las variables como $variable son interpoladas.
EOD;

$nowdoc = <<<'EOD'
Esta es una cadena nowdoc.
Las variables como $variable NO son interpoladas.
EOD;

// ✅ Escape de caracteres
$escapado = "Línea 1\nLínea 2\tTabulación\"Comillas\"";
$raw = 'Sin escape: \n \t \"';

// ✅ Strings multilínea
$sql = "
    SELECT u.name, u.email, p.title
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
    WHERE u.active = 1
    ORDER BY u.created_at DESC
";
```

### 3.2 Información de Strings

```php
$texto = "Hola Mundo PHP";

// ✅ Longitud y verificaciones
echo strlen($texto);                    // 14
echo mb_strlen($texto, 'UTF-8');       // Para caracteres especiales
var_dump(empty($texto));               // false
var_dump(isset($texto));               // true

// ✅ Tipo de caracteres
var_dump(ctype_alpha($texto));         // false (contiene espacios)
var_dump(ctype_alnum($texto));         // false
var_dump(ctype_digit('12345'));        // true
var_dump(ctype_lower('hola'));         // true
var_dump(ctype_upper('HOLA'));         // true

// ✅ Verificaciones de contenido
var_dump(str_contains($texto, 'Mundo'));      // true (PHP 8+)
var_dump(str_starts_with($texto, 'Hola'));    // true (PHP 8+)
var_dump(str_ends_with($texto, 'PHP'));       // true (PHP 8+)

// Para versiones anteriores a PHP 8
function contiene($haystack, $needle) {
    return strpos($haystack, $needle) !== false;
}
```

---

## 4. Métodos de Strings

### 4.1 Transformación de Strings

```php
$texto = "  Hola Mundo PHP  ";

// ✅ Mayúsculas y minúsculas
echo strtoupper($texto);               // "  HOLA MUNDO PHP  "
echo strtolower($texto);               // "  hola mundo php  "
echo ucfirst(trim($texto));            // "Hola mundo php"
echo ucwords(strtolower(trim($texto))); // "Hola Mundo Php"

// ✅ Capitalización personalizada
function tituloPropio($string) {
    return ucwords(strtolower($string));
}

// ✅ Limpieza de espacios
echo trim($texto);                     // "Hola Mundo PHP"
echo ltrim($texto);                    // "Hola Mundo PHP  "
echo rtrim($texto);                    // "  Hola Mundo PHP"
echo trim($texto, " \t\n\r\0\x0B");  // Caracteres específicos

// ✅ Padding (rellenar)
echo str_pad("PHP", 10, "0", STR_PAD_LEFT);   // "0000000PHP"
echo str_pad("PHP", 10, "-", STR_PAD_RIGHT);  // "PHP-------"
echo str_pad("PHP", 10, "*", STR_PAD_BOTH);   // "***PHP****"

// ✅ Repetición
echo str_repeat("Hola ", 3);           // "Hola Hola Hola "
echo str_repeat("-", 20);              // "--------------------"
```

### 4.2 Búsqueda y Reemplazo

```php
$texto = "El PHP es genial. PHP es poderoso.";

// ✅ Búsqueda de posiciones
$posicion = strpos($texto, "PHP");              // 3 (primera ocurrencia)
$ultimaPosicion = strrpos($texto, "PHP");       // 18 (última ocurrencia)
$posicionInsensible = stripos($texto, "php");   // 3 (case-insensitive)

// ✅ Reemplazos
$reemplazado = str_replace("PHP", "JavaScript", $texto);
// "El JavaScript es genial. JavaScript es poderoso."

$reemplazoInsensible = str_ireplace("php", "Python", $texto);
// "El Python es genial. Python es poderoso."

// Reemplazo con límite
$limitado = str_replace("PHP", "Java", $texto, $count, 1);
echo "Reemplazos hechos: $count"; // 1

// ✅ Reemplazos múltiples
$buscar = ["PHP", "genial", "poderoso"];
$reemplazar = ["Python", "excelente", "increíble"];
$multiple = str_replace($buscar, $reemplazar, $texto);

// ✅ Reemplazos con arrays asociativos
$reemplazos = [
    "PHP" => "Python",
    "genial" => "fantástico",
    "poderoso" => "versátil"
];
$resultado = strtr($texto, $reemplazos);
```

### 4.3 División y Unión

```php
// ✅ Dividir strings
$emails = "juan@email.com,maria@email.com,carlos@email.com";
$listaEmails = explode(",", $emails);
// ['juan@email.com', 'maria@email.com', 'carlos@email.com']

$texto = "Hola mundo PHP";
$palabras = explode(" ", $texto);
// ['Hola', 'mundo', 'PHP']

// Dividir con límite
$limitado = explode(",", $emails, 2);
// ['juan@email.com', 'maria@email.com,carlos@email.com']

// ✅ Unir arrays en strings
$frutas = ['manzana', 'banana', 'naranja'];
$listaFrutas = implode(", ", $frutas);
// "manzana, banana, naranja"

$html = implode("", [
    "<ul>",
    "<li>Item 1</li>",
    "<li>Item 2</li>",
    "</ul>"
]);

// ✅ División avanzada con str_split
$caracteres = str_split("Hola");        // ['H', 'o', 'l', 'a']
$grupos = str_split("123456789", 3);    // ['123', '456', '789']

// ✅ Tokenización
$sql = "SELECT name, email FROM users WHERE active = 1";
$tokens = strtok($sql, " ");
while ($tokens !== false) {
    echo $tokens . "\n";
    $tokens = strtok(" ");
}
```

### 4.4 Formateo de Strings

```php
// ✅ sprintf - Formateo tipo printf
$nombre = "Juan";
$edad = 30;
$salario = 2500.50;

$mensaje = sprintf("Hola %s, tienes %d años y ganas $%.2f", $nombre, $edad, $salario);
// "Hola Juan, tienes 30 años y ganas $2500.50"

// ✅ Diferentes especificadores
$numero = 42;
echo sprintf("%d", $numero);           // "42" (decimal)
echo sprintf("%b", $numero);           // "101010" (binario)
echo sprintf("%o", $numero);           // "52" (octal)
echo sprintf("%x", $numero);           // "2a" (hexadecimal)
echo sprintf("%X", $numero);           // "2A" (hexadecimal mayúscula)

// ✅ Formateo con padding
echo sprintf("%05d", 42);              // "00042"
echo sprintf("%-10s", "PHP");          // "PHP       "
echo sprintf("%010.2f", 3.14159);      // "0000003.14"

// ✅ number_format para números
$numero = 1234567.89;
echo number_format($numero);                    // "1,234,568"
echo number_format($numero, 2);                 // "1,234,567.89"
echo number_format($numero, 2, ',', '.');       // "1.234.567,89"

// ✅ Formateo de fechas con strings
$fecha = new DateTime();
echo $fecha->format('Y-m-d H:i:s');            // "2024-07-24 15:30:45"
echo strftime('%A, %d de %B de %Y');           // "Miércoles, 24 de Julio de 2024"
```

### 4.5 Validación y Sanitización

```php
// ✅ Filtros de validación
$email = "juan@email.com";
$url = "https://www.ejemplo.com";
$ip = "192.168.1.1";

var_dump(filter_var($email, FILTER_VALIDATE_EMAIL));    // string(14) "juan@email.com"
var_dump(filter_var($url, FILTER_VALIDATE_URL));        // string(24) "https://www.ejemplo.com"
var_dump(filter_var($ip, FILTER_VALIDATE_IP));          // string(11) "192.168.1.1"

// ✅ Sanitización
$input = "<script>alert('hack')</script>Texto normal";
$sanitizado = filter_var($input, FILTER_SANITIZE_STRING);
// "alert('hack')Texto normal"

$url = "http://www.ejemplo.com/<script>";
$urlSanitizada = filter_var($url, FILTER_SANITIZE_URL);
// "http://www.ejemplo.com/script"

// ✅ Escape para HTML
$textoHtml = "<b>Negrita</b> & símbolos especiales";
echo htmlspecialchars($textoHtml);
// "<b>Negrita</b> & símbolos especiales"

echo htmlentities($textoHtml);
// Similar pero más completo

// ✅ Validaciones personalizadas
function validarTelefono($telefono) {
    $patron = '/^(\+\d{1,3}[- ]?)?\d{10}$/';
    return preg_match($patron, $telefono);
}

function validarNombre($nombre) {
    return preg_match('/^[a-zA-ZáéíóúñÑ\s]+$/', $nombre);
}
```

---

## 5. Combinaciones Arrays + Strings

### 5.1 Procesamiento de Texto con Arrays

```php
// ✅ Contar palabras
$texto = "El PHP es un lenguaje de programación muy potente";
$palabras = str_word_count($texto, 1); // Array de palabras
$conteo = array_count_values($palabras); // Frecuencia de palabras

print_r($conteo);
// ['El' => 1, 'PHP' => 1, 'es' => 1, 'un' => 1, ...]

// ✅ Buscar y reemplazar múltiples patrones
$texto = "Hola NOMBRE, tu edad es EDAD años";
$reemplazos = [
    'NOMBRE' => 'Juan',
    'EDAD' => '30'
];

$personalizado = str_replace(array_keys($reemplazos), array_values($reemplazos), $texto);
// "Hola Juan, tu edad es 30 años"

// ✅ Generar slug para URLs
function generarSlug($texto) {
    $texto = strtolower(trim($texto));
    $texto = preg_replace('/[^a-z0-9-]/', '-', $texto);
    $texto = preg_replace('/-+/', '-', $texto);
    return trim($texto, '-');
}

$titulo = "Mi Artículo Sobre PHP";
$slug = generarSlug($titulo); // "mi-articulo-sobre-php"

// ✅ Validar y limpiar lista de emails
$emailsString = "juan@email.com, maria@invalid, carlos@email.com, , ";
$emails = array_filter(
    array_map('trim', explode(',', $emailsString)),
    function($email) {
        return !empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL);
    }
);
// ['juan@email.com', 'carlos@email.com']
```

### 5.2 Parseo y Formateo de Datos

```php
// ✅ Parsear CSV manualmente
$csvString = "Juan,30,juan@email.com\nMaría,25,maria@email.com\nCarlos,35,carlos@email.com";
$lineas = explode("\n", $csvString);
$usuarios = array_map(function($linea) {
    $datos = str_getcsv($linea);
    return [
        'nombre' => $datos[0],
        'edad' => (int)$datos[1],
        'email' => $datos[2]
    ];
}, $lineas);

// ✅ Generar CSV desde array
$usuarios = [
    ['Juan', 30, 'juan@email.com'],
    ['María', 25, 'maria@email.com']
];

$csv = implode("\n", array_map(function($usuario) {
    return implode(',', $usuario);
}, $usuarios));

// ✅ Formatear números con unidades
function formatearBytes($size, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
  
    for ($i = 0; $size > 1024 && $i < count($units) - 1; $i++) {
        $size /= 1024;
    }
  
    return round($size, $precision) . ' ' . $units[$i];
}

echo formatearBytes(1048576); // "1 MB"

// ✅ Crear breadcrumbs
function generarBreadcrumbs($url) {
    $partes = array_filter(explode('/', trim($url, '/')));
    $breadcrumbs = [];
    $path = '';
  
    foreach ($partes as $parte) {
        $path .= '/' . $parte;
        $breadcrumbs[] = [
            'titulo' => ucwords(str_replace('-', ' ', $parte)),
            'url' => $path
        ];
    }
  
    return $breadcrumbs;
}

$breadcrumbs = generarBreadcrumbs('/admin/user-management/edit-user');
/*
[
    ['titulo' => 'Admin', 'url' => '/admin'],
    ['titulo' => 'User Management', 'url' => '/admin/user-management'],
    ['titulo' => 'Edit User', 'url' => '/admin/user-management/edit-user']
]
*/
```

### 5.3 Templates y Placeholders

```php
// ✅ Sistema simple de templates
class TemplateSimple {
    private $plantilla;
    private $variables = [];
  
    public function __construct($plantilla) {
        $this->plantilla = $plantilla;
    }
  
    public function asignar($clave, $valor) {
        $this->variables[$clave] = $valor;
        return $this;
    }
  
    public function asignarMultiple($variables) {
        $this->variables = array_merge($this->variables, $variables);
        return $this;
    }
  
    public function renderizar() {
        $resultado = $this->plantilla;
    
        foreach ($this->variables as $clave => $valor) {
            $placeholder = '{{' . $clave . '}}';
            $resultado = str_replace($placeholder, $valor, $resultado);
        }
    
        return $resultado;
    }
}

// Uso
$plantilla = "Hola {{nombre}}, tienes {{mensajes}} mensajes nuevos.";
$template = new TemplateSimple($plantilla);
$email = $template
    ->asignar('nombre', 'Juan')
    ->asignar('mensajes', 5)
    ->renderizar();
// "Hola Juan, tienes 5 mensajes nuevos."

// ✅ Generador de SQL dinámico
function construirSelect($tabla, $campos = ['*'], $condiciones = [], $orden = null) {
    $sql = "SELECT " . implode(', ', $campos) . " FROM " . $tabla;
  
    if (!empty($condiciones)) {
        $where = [];
        foreach ($condiciones as $campo => $valor) {
            $where[] = "$campo = '$valor'";
        }
        $sql .= " WHERE " . implode(' AND ', $where);
    }
  
    if ($orden) {
        $sql .= " ORDER BY $orden";
    }
  
    return $sql;
}

$sql = construirSelect(
    'usuarios',
    ['id', 'nombre', 'email'],
    ['activo' => 1, 'tipo' => 'admin'],
    'nombre ASC'
);
// "SELECT id, nombre, email FROM usuarios WHERE activo = '1' AND tipo = 'admin' ORDER BY nombre ASC"
```

---

## 6. Casos Prácticos

### 6.1 Validación de Formularios

```php
class ValidadorFormulario {
    private $errores = [];
    private $datos = [];
  
    public function validar($input) {
        $this->datos = $input;
        $this->errores = [];
    
        // Validar nombre
        if (empty($input['nombre'])) {
            $this->errores['nombre'] = 'El nombre es requerido';
        } elseif (strlen($input['nombre']) < 2) {
            $this->errores['nombre'] = 'El nombre debe tener al menos 2 caracteres';
        } elseif (!preg_match('/^[a-zA-ZáéíóúñÑ\s]+$/', $input['nombre'])) {
            $this->errores['nombre'] = 'El nombre solo puede contener letras y espacios';
        }
    
        // Validar email
        if (empty($input['email'])) {
            $this->errores['email'] = 'El email es requerido';
        } elseif (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            $this->errores['email'] = 'El email no tiene un formato válido';
        }
    
        // Validar teléfono
        if (!empty($input['telefono'])) {
            $telefono = preg_replace('/[^0-9]/', '', $input['telefono']);
            if (strlen($telefono) < 10) {
                $this->errores['telefono'] = 'El teléfono debe tener al menos 10 dígitos';
            }
        }
    
        // Validar edad
        if (!empty($input['edad'])) {
            if (!ctype_digit($input['edad']) || $input['edad'] < 18 || $input['edad'] > 120) {
                $this->errores['edad'] = 'La edad debe ser un número entre 18 y 120';
            }
        }
    
        return empty($this->errores);
    }
  
    public function obtenerErrores() {
        return $this->errores;
    }
  
    public function obtenerDatosLimpios() {
        $limpios = [];
        foreach ($this->datos as $campo => $valor) {
            $limpios[$campo] = htmlspecialchars(trim($valor));
        }
        return $limpios;
    }
}

// Uso
$input = [
    'nombre' => '  Juan Pérez  ',
    'email' => 'juan@email.com',
    'telefono' => '(555) 123-4567',
    'edad' => '30'
];

$validador = new ValidadorFormulario();
if ($validador->validar($input)) {
    $datosLimpios = $validador->obtenerDatosLimpios();
    // Procesar datos...
} else {
    $errores = $validador->obtenerErrores();
    // Mostrar errores...
}
```

### 6.2 Paginación de Resultados

```php
class Paginador {
    private $totalItems;
    private $itemsPorPagina;
    private $paginaActual;
    private $totalPaginas;
  
    public function __construct($totalItems, $itemsPorPagina = 10, $paginaActual = 1) {
        $this->totalItems = $totalItems;
        $this->itemsPorPagina = $itemsPorPagina;
        $this->paginaActual = max(1, (int)$paginaActual);
        $this->totalPaginas = ceil($totalItems / $itemsPorPagina);
    }
  
    public function obtenerOffset() {
        return ($this->paginaActual - 1) * $this->itemsPorPagina;
    }
  
    public function obtenerLimit() {
        return $this->itemsPorPagina;
    }
  
    public function generarEnlaces($urlBase) {
        $enlaces = [];
    
        // Enlace anterior
        if ($this->paginaActual > 1) {
            $enlaces['anterior'] = $urlBase . '?pagina=' . ($this->paginaActual - 1);
        }
    
        // Enlaces de páginas
        $inicio = max(1, $this->paginaActual - 2);
        $fin = min($this->totalPaginas, $this->paginaActual + 2);
    
        for ($i = $inicio; $i <= $fin; $i++) {
            $enlaces['paginas'][$i] = [
                'numero' => $i,
                'url' => $urlBase . '?pagina=' . $i,
                'activa' => $i === $this->paginaActual
            ];
        }
    
        // Enlace siguiente
        if ($this->paginaActual < $this->totalPaginas) {
            $enlaces['siguiente'] = $urlBase . '?pagina=' . ($this->paginaActual + 1);
        }
    
        return $enlaces;
    }
  
    public function obtenerInfo() {
        $inicio = $this->obtenerOffset() + 1;
        $fin = min($this->totalItems, $inicio + $this->itemsPorPagina - 1);
    
        return "Mostrando $inicio a $fin de {$this->totalItems} resultados";
    }
}

// Uso
$totalUsuarios = 150;
$paginador = new Paginador($totalUsuarios, 10, $_GET['pagina'] ?? 1);

// Para la consulta SQL
$offset = $paginador->obtenerOffset();
$limit = $paginador->obtenerLimit();
$sql = "SELECT * FROM usuarios LIMIT $limit OFFSET $offset";

// Para mostrar enlaces
$enlaces = $paginador->generarEnlaces('/usuarios');
$info = $paginador->obtenerInfo();
```

### 6.3 Generador de Reportes

```php
class GeneradorReportes {
    private $datos;
    private $columnas;
  
    public function __construct($datos, $columnas) {
        $this->datos = $datos;
        $this->columnas = $columnas;
    }
  
    public function generarCSV() {
        $csv = [];
    
        // Encabezados
        $encabezados = array_values($this->columnas);
        $csv[] = implode(',', array_map([$this, 'escaparCSV'], $encabezados));
    
        // Datos
        foreach ($this->datos as $fila) {
            $valores = [];
            foreach (array_keys($this->columnas) as $campo) {
                $valores[] = $this->escaparCSV($fila[$campo] ?? '');
            }
            $csv[] = implode(',', $valores);
        }
    
        return implode("\n", $csv);
    }
  
    public function generarHTML() {
        $html = ['<table class="tabla-reporte">'];
    
        // Encabezados
        $html[] = '<thead><tr>';
        foreach ($this->columnas as $titulo) {
            $html[] = '<th>' . htmlspecialchars($titulo) . '</th>';
        }
        $html[] = '</tr></thead>';
    
        // Datos
        $html[] = '<tbody>';
        foreach ($this->datos as $fila) {
            $html[] = '<tr>';
            foreach (array_keys($this->columnas) as $campo) {
                $valor = htmlspecialchars($fila[$campo] ?? '');
                $html[] = '<td>' . $valor . '</td>';
            }
            $html[] = '</tr>';
        }
        $html[] = '</tbody></table>';
    
        return implode('', $html);
    }
  
    public function generarJSON() {
        return json_encode([
            'columnas' => $this->columnas,
            'datos' => $this->datos,
            'total' => count($this->datos),
            'generado_en' => date('Y-m-d H:i:s')
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
  
    private function escaparCSV($valor) {
        if (strpos($valor, ',') !== false || strpos($valor, '"') !== false || strpos($valor, "\n") !== false) {
            return '"' . str_replace('"', '""', $valor) . '"';
        }
        return $valor;
    }
  
    public function aplicarFiltros($filtros) {
        $datosFiltrados = array_filter($this->datos, function($fila) use ($filtros) {
            foreach ($filtros as $campo => $valor) {
                if (isset($fila[$campo]) && stripos($fila[$campo], $valor) === false) {
                    return false;
                }
            }
            return true;
        });
    
        return new self($datosFiltrados, $this->columnas);
    }
  
    public function ordenarPor($campo, $direccion = 'ASC') {
        $datosOrdenados = $this->datos;
        usort($datosOrdenados, function($a, $b) use ($campo, $direccion) {
            $resultado = $a[$campo] <=> $b[$campo];
            return $direccion === 'DESC' ? -$resultado : $resultado;
        });
    
        return new self($datosOrdenados, $this->columnas);
    }
}

// Uso
$usuarios = [
    ['id' => 1, 'nombre' => 'Juan', 'email' => 'juan@email.com', 'activo' => 1],
    ['id' => 2, 'nombre' => 'María', 'email' => 'maria@email.com', 'activo' => 0],
    ['id' => 3, 'nombre' => 'Carlos', 'email' => 'carlos@email.com', 'activo' => 1]
];

$columnas = [
    'id' => 'ID',
    'nombre' => 'Nombre',
    'email' => 'Email',
    'activo' => 'Estado'
];

$reporte = new GeneradorReportes($usuarios, $columnas);

// Generar diferentes formatos
$csv = $reporte->generarCSV();
$html = $reporte->generarHTML();
$json = $reporte->generarJSON();

// Con filtros y ordenamiento
$reporteFiltrado = $reporte
    ->aplicarFiltros(['activo' => '1'])
    ->ordenarPor('nombre');
```

---

## 7. Mejores Prácticas

### 7.1 Performance y Optimización

```php
// ✅ Usar funciones nativas en lugar de loops cuando sea posible
$numeros = range(1, 1000000);

// ❌ Lento
$suma = 0;
foreach ($numeros as $numero) {
    $suma += $numero;
}

// ✅ Rápido
$suma = array_sum($numeros);

// ✅ Usar isset() en lugar de array_key_exists() para verificaciones simples
$array = ['clave' => 'valor'];

// ❌ Más lento
if (array_key_exists('clave', $array)) {
    // ...
}

// ✅ Más rápido
if (isset($array['clave'])) {
    // ...
}

// ✅ Usar implode() en lugar de concatenación en loops
$partes = ['parte1', 'parte2', 'parte3'];

// ❌ Ineficiente
$resultado = '';
foreach ($partes as $parte) {
    $resultado .= $parte . ' ';
}

// ✅ Eficiente
$resultado = implode(' ', $partes);

// ✅ Precalcular count() en loops
$items = range(1, 1000);

// ❌ Calcula count() en cada iteración
for ($i = 0; $i < count($items); $i++) {
    // ...
}

// ✅ Calcula count() una sola vez
$total = count($items);
for ($i = 0; $i < $total; $i++) {
    // ...
}
```

### 7.2 Seguridad

```php
// ✅ Sanitización de entrada
function sanitizarInput($input) {
    if (is_array($input)) {
        return array_map(__FUNCTION__, $input);
    }
  
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// ✅ Validación robusta
function validarEmail($email) {
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validarEntero($valor, $min = null, $max = null) {
    $numero = filter_var($valor, FILTER_VALIDATE_INT);
  
    if ($numero === false) {
        return false;
    }
  
    if ($min !== null && $numero < $min) {
        return false;
    }
  
    if ($max !== null && $numero > $max) {
        return false;
    }
  
    return $numero;
}

// ✅ Escape para diferentes contextos
function escaparHTML($string) {
    return htmlspecialchars($string, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function escaparURL($string) {
    return urlencode($string);
}

function escaparJS($string) {
    return json_encode($string, JSON_HEX_QUOT | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_TAG);
}
```

### 7.3 Legibilidad y Mantenimiento

```php
// ✅ Usar constantes para valores mágicos
class EstadoUsuario {
    const ACTIVO = 1;
    const INACTIVO = 0;
    const SUSPENDIDO = 2;
    const ELIMINADO = 3;
  
    const ESTADOS = [
        self::ACTIVO => 'Activo',
        self::INACTIVO => 'Inactivo',
        self::SUSPENDIDO => 'Suspendido',
        self::ELIMINADO => 'Eliminado'
    ];
  
    public static function obtenerNombre($estado) {
        return self::ESTADOS[$estado] ?? 'Desconocido';
    }
}

// ✅ Funciones pequeñas y específicas
function formatearNombre($nombre, $apellido) {
    return trim(ucwords(strtolower($nombre . ' ' . $apellido)));
}

function generarIniciales($nombre, $apellido) {
    $inicial1 = substr(trim($nombre), 0, 1);
    $inicial2 = substr(trim($apellido), 0, 1);
    return strtoupper($inicial1 . $inicial2);
}

function esMayorDeEdad($fechaNacimiento) {
    $edad = date_diff(date_create($fechaNacimiento), date_create('today'))->y;
    return $edad >= 18;
}

// ✅ Documentación con ejemplos
/**
 * Convierte un array asociativo en una cadena de consulta URL
 * 
 * @param array $parametros Array asociativo de parámetros
 * @param string $separador Separador entre parámetros (por defecto '&')
 * @return string Cadena de consulta URL
 * 
 * @example
 * $params = ['nombre' => 'Juan', 'edad' => 30];
 * echo arrayAQuery($params); // "nombre=Juan&edad=30"
 */
function arrayAQuery($parametros, $separador = '&') {
    $pares = [];
    foreach ($parametros as $clave => $valor) {
        $pares[] = urlencode($clave) . '=' . urlencode($valor);
    }
    return implode($separador, $pares);
}
```

### 7.4 Manejo de Errores

```php
// ✅ Función robusta con manejo de errores
function procesarArchiveCSV($archivo) {
    try {
        if (!file_exists($archivo)) {
            throw new InvalidArgumentException("El archivo no existe: $archivo");
        }
    
        if (!is_readable($archivo)) {
            throw new RuntimeException("No se puede leer el archivo: $archivo");
        }
    
        $contenido = file_get_contents($archivo);
        if ($contenido === false) {
            throw new RuntimeException("Error al leer el archivo: $archivo");
        }
    
        $lineas = explode("\n", trim($contenido));
        if (empty($lineas)) {
            throw new InvalidArgumentException("El archivo está vacío: $archivo");
        }
    
        $encabezados = str_getcsv(array_shift($lineas));
        $datos = [];
    
        foreach ($lineas as $numeroLinea => $linea) {
            if (empty(trim($linea))) {
                continue; // Saltar líneas vacías
            }
        
            $campos = str_getcsv($linea);
            if (count($campos) !== count($encabezados)) {
                error_log("Línea " . ($numeroLinea + 2) . " tiene número incorrecto de campos");
                continue;
            }
        
            $datos[] = array_combine($encabezados, $campos);
        }
    
        return [
            'exito' => true,
            'datos' => $datos,
            'total' => count($datos)
        ];
    
    } catch (Exception $e) {
        error_log("Error procesando CSV: " . $e->getMessage());
        return [
            'exito' => false,
            'error' => $e->getMessage(),
            'datos' => []
        ];
    }
}

// ✅ Validación con mensajes descriptivos
function validarDatosUsuario($datos) {
    $errores = [];
    $requeridos = ['nombre', 'email', 'telefono'];
  
    // Verificar campos requeridos
    foreach ($requeridos as $campo) {
        if (!isset($datos[$campo]) || empty(trim($datos[$campo]))) {
            $errores[$campo] = "El campo $campo es requerido";
        }
    }
  
    // Validaciones específicas
    if (isset($datos['email'])) {
        if (!filter_var($datos['email'], FILTER_VALIDATE_EMAIL)) {
            $errores['email'] = "El formato del email no es válido";
        }
    }
  
    if (isset($datos['telefono'])) {
        $telefono = preg_replace('/[^0-9]/', '', $datos['telefono']);
        if (strlen($telefono) < 10) {
            $errores['telefono'] = "El teléfono debe tener al menos 10 dígitos";
        }
    }
  
    return [
        'valido' => empty($errores),
        'errores' => $errores
    ];
}
```

---

## Resumen de Funciones Más Utilizadas

### Arrays

```php
// Básicas
count(), sizeof(), is_array(), empty(), isset()

// Manipulación
array_push(), array_pop(), array_shift(), array_unshift()
array_slice(), array_splice(), array_merge(), array_combine()

// Transformación
array_map(), array_filter(), array_reduce()
array_keys(), array_values(), array_flip()

// Búsqueda y ordenamiento
in_array(), array_search(), array_key_exists()
sort(), rsort(), asort(), ksort(), usort()

// Utilidades
array_unique(), array_intersect(), array_diff()
array_chunk(), array_rand(), shuffle()
```

### Strings

```php
// Información
strlen(), mb_strlen(), empty(), isset()
str_contains(), str_starts_with(), str_ends_with() // PHP 8+

// Transformación
strtoupper(), strtolower(), ucfirst(), ucwords()
trim(), ltrim(), rtrim(), str_pad(), str_repeat()

// Búsqueda y reemplazo
strpos(), strrpos(), stripos(), str_replace(), str_ireplace()
preg_match(), preg_replace()

// División y unión
explode(), implode(), str_split(), strtok()

// Formateo
sprintf(), number_format(), htmlspecialchars()
filter_var() // Para validación y sanitización
```

Esta guía cubre los aspectos más importantes del manejo de arrays y strings en PHP, con ejemplos prácticos y casos de uso reales que puedes aplicar directamente en tus proyectos.
