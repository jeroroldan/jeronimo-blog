---
title: "Guía: Middlewares en Express - El Motor Invisible de tu API"
description: "Aprende a interceptar peticiones, registrar logs y manejar errores de forma centralizada usando el patrón Middleware."
pubDate: "2026-04-19"
code: "express-middlewares-guia"
category: "backend"
tags: ["nodejs", "express", "middlewares", "backend-security"]
difficulty: "intermedio"
readingTime: 10
---

# Guía: Middlewares en Express - El Motor Invisible ⚙️

> 💡 **En esta guía aprenderás**: Qué son los middlewares, cómo influyen en el ciclo de vida de una petición y cómo implementar un sistema robusto de logging y manejo de errores.

---

## Parte 1: ¿Qué es realmente un Middleware?

Un middleware en Express es una función que tiene acceso al objeto de solicitud (`req`), al objeto de respuesta (`res`) y a la siguiente función de middleware en el ciclo de solicitud-respuesta de la aplicación, comúnmente llamada `next`.

### El Flujo de Ejecución

```
Cliente → [ Middleware 1 ] → [ Middleware 2 ] → [ Controlador ] → Respuesta
```

**Responsabilidades principales:**
- Ejecutar cualquier código.
- Realizar cambios en los objetos de solicitud y respuesta.
- Finalizar el ciclo de solicitud-respuesta.
- Invocar el siguiente middleware en la pila con `next()`.

---

## Parte 2: Creación de un Middleware de Registro (Logging)

El registro de peticiones es esencial para el monitoreo y la depuración. Vamos a crear un middleware que imprima el método, la URL y el tiempo de respuesta.

```javascript
// middleware/logger.js
const logger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.url} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};

module.exports = logger;
```

**Uso global en la aplicación:**
```javascript
app.use(logger);
```

---

## Parte 3: Manejo de Errores Centralizado 🛠️

En lugar de llenar tus controladores con bloques `try/catch` que envían respuestas de error, Express permite definir middlewares especiales de 4 argumentos para manejar errores.

### Estructura del Middleware de Error
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Registro interno del error
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    // Solo enviar stack trace en desarrollo
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

module.exports = errorHandler;
```

> [!IMPORTANT]
> El middleware de manejo de errores siempre debe ser el **último** que se registre en tu archivo `app.js` mediante `app.use()`.

---

## Parte 4: Middlewares de Terceros

No siempre es necesario reinventar la rueda. El ecosistema de Express cuenta con middlewares potentes:

| Middleware | Propósito |
| :--- | :--- |
| **morgan** | Logging de peticiones HTTP altamente configurable. |
| **cors** | Habilitar el intercambio de recursos de origen cruzado. |
| **helmet** | Ayuda a asegurar aplicaciones Express configurando varios headers HTTP. |
| **compression** | Comprime cuerpos de respuesta para mejorar el rendimiento. |

---

## Resumen de Mejores Prácticas

1. **Mantén el orden**: Los middlewares se ejecutan en el orden en que se definen.
2. **Usa `next()`**: Si no terminas la respuesta, siempre llama a `next()` o la petición se quedará "colgada".
3. **Controladores Limpios**: Mueve la lógica de validación y autenticación a middlewares separados.

> [!TIP]
> Ahora que sabes interceptar peticiones, es hora de conectarlas a una base de datos real. Lee la guía de **Persistencia con Prisma y PostgreSQL**.

---

¿Tienes dudas sobre cómo escalar tus middlewares? Comparte tu experiencia en la sección de comentarios.
