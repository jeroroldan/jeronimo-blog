---
title: 'Guía de Python para Principiantes: Curso Intensivo'
code: 'python-principiantes'
description: 'Aprende Python desde cero con esta guía completa: instalación, tipos básicos, control de flujo, funciones y tipos avanzados. Hoja de ruta para convertirte en programador.'
pubDate: 'Apr 16 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Guía de Python para Principiantes: Curso Intensivo 🚀

## Introducción

Este curso intensivo de Python, impartido por Nicolás Schurman de HolaMundo, está diseñado para llevarte desde cero hasta ser un programador apto para la industria. A lo largo de esta guía, cubriremos todos los fundamentos necesarios con un enfoque práctico y estructurado.

Esta es la base del curso Ultimate Python y te proporcionará una hoja de ruta clara para aprender a programar desde cero.

---

## Introducción y Configuración

### Instalación de Python

El primer paso es instalar Python en tu sistema. Visita el sitio oficial de Python (python.org) y descarga la versión más reciente.

#### Verificar Instalación

```bash
python --version
# o
python3 --version
```

### Configuración de VS Code

VS Code es el editor recomendado. Instala las extensiones:

- Python (Microsoft)
- Pylint (para linting)
- Python Docstring Generator

### Configuración de Linters

Los linters ayudan a mantener el código limpio. Configura PEP 8:

```json
// settings.json en VS Code
{
    "python.linting.pylintEnabled": true,
    "python.linting.enabled": true
}
```

### Funcionamiento Interno del Código

Python ejecuta el código línea por línea. Entiende el flujo básico:

```python
print("Hola, Mundo!")  # Esta línea se ejecuta primero
print("Bienvenido a Python")  # Esta segunda
```

---

## Tipos Básicos

### Variables

Las variables almacenan valores. No necesitas declarar tipos:

```python
nombre = "Juan"
edad = 25
altura = 1.75
es_estudiante = True
```

### Strings

Las strings son texto. Formateo y métodos útiles:

```python
# Formateo básico
nombre = "Ana"
mensaje = "Hola, " + nombre
print(mensaje)  # Hola, Ana

# f-strings (recomendado)
mensaje = f"Hola, {nombre}"
print(mensaje)  # Hola, Ana

# Métodos de strings
texto = "Hola Mundo"
print(texto.upper())      # HOLA MUNDO
print(texto.lower())      # hola mundo
print(texto.split())      # ['Hola', 'Mundo']
print(texto.replace("Hola", "Adiós"))  # Adiós Mundo
```

### Números

Python maneja enteros y flotantes automáticamente:

```python
# Operaciones básicas
a = 10
b = 3.14
print(a + b)   # 13.14
print(a - b)   # 6.86
print(a * b)   # 31.4
print(a / b)   # 3.184713375796178
print(a // b)  # 3 (división entera)
print(a % b)   # 0.8600000000000003 (módulo)
print(a ** 2)  # 100 (potencia)
```

### Módulo Math

Para operaciones matemáticas avanzadas:

```python
import math

print(math.sqrt(16))    # 4.0
print(math.pi)          # 3.141592653589793
print(math.sin(math.pi/2))  # 1.0
print(math.ceil(3.2))   # 4
print(math.floor(3.8))  # 3
```

---

## Control de Flujo

### Estructuras Condicionales

```python
edad = 18

if edad >= 18:
    print("Eres mayor de edad")
elif edad >= 13:
    print("Eres adolescente")
else:
    print("Eres niño")
```

### Operadores Lógicos

```python
# and, or, not
edad = 20
tiene_licencia = True

if edad >= 18 and tiene_licencia:
    print("Puedes conducir")

if edad < 18 or not tiene_licencia:
    print("No puedes conducir")
```

### Loops

#### For loops

```python
# Iterar sobre lista
frutas = ["manzana", "banana", "pera"]
for fruta in frutas:
    print(f"Me gusta la {fruta}")

# Iterar con range
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# Iterar sobre string
for letra in "Python":
    print(letra)
```

#### While loops

```python
contador = 0
while contador < 5:
    print(contador)
    contador += 1
```

### Ejercicio Práctico: Calculadora Básica

```python
def calculadora():
    print("Calculadora básica")
    print("1. Suma")
    print("2. Resta")
    print("3. Multiplicación")
    print("4. División")
    
    opcion = input("Elige una opción (1-4): ")
    num1 = float(input("Ingresa el primer número: "))
    num2 = float(input("Ingresa el segundo número: "))
    
    if opcion == "1":
        resultado = num1 + num2
        print(f"{num1} + {num2} = {resultado}")
    elif opcion == "2":
        resultado = num1 - num2
        print(f"{num1} - {num2} = {resultado}")
    elif opcion == "3":
        resultado = num1 * num2
        print(f"{num1} * {num2} = {resultado}")
    elif opcion == "4":
        if num2 != 0:
            resultado = num1 / num2
            print(f"{num1} / {num2} = {resultado}")
        else:
            print("Error: División por cero")
    else:
        print("Opción inválida")

calculadora()
```

---

## Funciones

### Definición de Funciones

```python
def saludar(nombre):
    return f"Hola, {nombre}!"

print(saludar("María"))  # Hola, María!
```

### Paso de Argumentos

#### Argumentos posicionales

```python
def sumar(a, b):
    return a + b

print(sumar(5, 3))  # 8
```

#### Argumentos con nombre (kwargs)

```python
def crear_usuario(nombre, edad, ciudad="Madrid"):
    return f"Usuario: {nombre}, Edad: {edad}, Ciudad: {ciudad}"

print(crear_usuario(edad=25, nombre="Carlos"))  # Usuario: Carlos, Edad: 25, Ciudad: Madrid
```

#### *args y **kwargs

```python
def suma_flexible(*args):
    return sum(args)

print(suma_flexible(1, 2, 3, 4))  # 10

def info_usuario(**kwargs):
    for clave, valor in kwargs.items():
        print(f"{clave}: {valor}")

info_usuario(nombre="Ana", edad=30, ciudad="Barcelona")
```

### Alcance de Variables

```python
# Variable global
mensaje = "Hola"

def funcion():
    # Variable local
    mensaje = "Adiós"
    print(mensaje)  # Adiós

funcion()
print(mensaje)  # Hola
```

### Depuración de Errores

Usa print() para debuggear:

```python
def dividir(a, b):
    print(f"Dividiendo {a} entre {b}")
    if b == 0:
        print("Error: División por cero")
        return None
    return a / b

resultado = dividir(10, 0)
print(f"Resultado: {resultado}")
```

### Ejercicio: Verificar Palíndromos

```python
def es_palindromo(palabra):
    # Convertir a minúsculas y quitar espacios
    palabra = palabra.lower().replace(" ", "")
    # Comparar con su reverso
    return palabra == palabra[::-1]

print(es_palindromo("Anita lava la tina"))  # True
print(es_palindromo("Python"))  # False
```

---

## Tipos Avanzados

### Listas

```python
# Crear lista
numeros = [1, 2, 3, 4, 5]

# Acceder elementos
print(numeros[0])   # 1
print(numeros[-1])  # 5

# Desempaquetado
primero, *medio, ultimo = [1, 2, 3, 4, 5]
print(primero)  # 1
print(medio)    # [2, 3, 4]
print(ultimo)   # 5

# Búsqueda
print(3 in numeros)  # True

# Ordenamiento
numeros.sort(reverse=True)
print(numeros)  # [5, 4, 3, 2, 1]
```

### Expresiones Lambda

```python
# Función lambda simple
cuadrado = lambda x: x ** 2
print(cuadrado(5))  # 25

# Lambda con múltiples parámetros
suma = lambda a, b: a + b
print(suma(3, 4))  # 7
```

### Comprensión de Listas

```python
# Crear lista de cuadrados
cuadrados = [x**2 for x in range(10)]
print(cuadrados)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Con condición
pares_cuadrados = [x**2 for x in range(10) if x % 2 == 0]
print(pares_cuadrados)  # [0, 4, 16, 36, 64]
```

### Funciones Map y Filter

```python
numeros = [1, 2, 3, 4, 5]

# Map: aplicar función a cada elemento
cuadrados = list(map(lambda x: x**2, numeros))
print(cuadrados)  # [1, 4, 9, 16, 25]

# Filter: filtrar elementos
pares = list(filter(lambda x: x % 2 == 0, numeros))
print(pares)  # [2, 4]
```

### Tuplas

```python
# Tuplas son inmutables
coordenadas = (10, 20)
print(coordenadas[0])  # 10

# Desempaquetado
x, y = coordenadas
print(f"x: {x}, y: {y}")
```

### Sets

```python
# Sets no permiten duplicados
numeros = {1, 2, 3, 3, 2}
print(numeros)  # {1, 2, 3}

# Operaciones
a = {1, 2, 3}
b = {3, 4, 5}
print(a | b)  # Unión: {1, 2, 3, 4, 5}
print(a & b)  # Intersección: {3}
print(a - b)  # Diferencia: {1, 2}
```

### Diccionarios

```python
# Crear diccionario
persona = {
    "nombre": "Carlos",
    "edad": 30,
    "ciudad": "Madrid"
}

# Acceder valores
print(persona["nombre"])  # Carlos
print(persona.get("edad"))  # 30

# Agregar/modificar
persona["profesion"] = "Ingeniero"
persona["edad"] = 31

# Iterar
for clave, valor in persona.items():
    print(f"{clave}: {valor}")
```

---

## Conclusión

Este curso intensivo de Python te proporciona una base sólida para convertirte en programador. Has aprendido:

1. **Configuración**: Instalación, VS Code, linters
2. **Tipos básicos**: Variables, strings, números, math
3. **Control de flujo**: Condicionales, loops, calculadora práctica
4. **Funciones**: Definición, argumentos, alcance, debugging, palíndromos
5. **Tipos avanzados**: Listas, lambda, comprensión, map/filter, tuplas, sets, diccionarios

La práctica constante es clave. Experimenta con el código, modifica los ejemplos y crea tus propios programas. Este es solo el comienzo de tu viaje como programador.

¿Listo para continuar con conceptos más avanzados en el curso Ultimate Python?