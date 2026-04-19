---
title: "Guía: Autenticación Maestra con JWT y Prisma"
description: "Implementa un sistema de seguridad profesional: registro de usuarios, hashing de contraseñas y validación de tokens JWT en Node.js."
pubDate: "2026-04-19"
code: "jwt-auth-guia"
category: "backend"
tags: ["jwt", "authentication", "bcrypt", "security", "prisma"]
difficulty: "avanzado"
readingTime: 14
---

# Guía: Autenticación con JWT y Prisma 🔐

> 💡 **En esta guía aprenderás**: Cómo implementar un sistema de autenticación de nivel comercial. Cubriremos el almacenamiento seguro de contraseñas, la generación de JSON Web Tokens y la protección de rutas privadas.

---

## Parte 1: El Flujo de Autenticación Moderno

En lugar de usar sesiones tradicionales guardadas en el servidor, las APIs modernas utilizan **JWT (JSON Web Tokens)**. Esto permite que el servidor sea "stateless" (sin estado), mejorando la escalabilidad.

### ¿Cómo funciona JWT?
1. El usuario envía sus credenciales (email/password).
2. El servidor valida y genera un Token firmado.
3. El cliente guarda el token (en LocalStorage o Cookies).
4. El cliente envía el token en el header `Authorization` en cada petición futura.

---

## Parte 2: Almacenamiento Seguro de Contraseñas 🛡️

**REGLA DE ORO**: Nunca guardes contraseñas en texto plano. Usaremos `bcryptjs` para realizar un hashing seguro.

### Registro de Usuario con Hashing
```javascript
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  // 1. Generar Salt y Hash
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // 2. Guardar en DB via Prisma
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Guardamos el hash, no la clave real
      }
    });
    res.status(201).json({ message: 'Usuario creado' });
  } catch (e) {
    res.status(400).json({ error: 'El email ya existe' });
  }
});
```

---

## Parte 3: Generación del JWT en el Login

Cuando el usuario inicia sesión, verificamos el hash y devolvemos el token firmado con una "Secret Key".

```javascript
const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  // Verificar password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Credenciales inválidas' });

  // Generar Token
  const token = jwt.sign(
    { userId: user.id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );

  res.json({ token });
});
```

---

## Parte 4: Protegiendo Rutas (Middleware de Autorización)

Usando lo que aprendimos en la [guía de Middlewares](file:///c:/Users/jeron/Desktop/blog-jero/src/content/blog/express-middlewares-guia.md), crearemos un interceptor para proteger rutas privadas.

```javascript
// middleware/auth.js
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) return res.status(401).json({ error: 'Acceso denegado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos el payload en el request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
```

### Aplicando la protección
```javascript
app.get('/me', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  res.json(user);
});
```

---

## Mejores Prácticas de Seguridad

| Práctica | Descripción |
| :--- | :--- |
| **Variables de Entorno** | Guarda tu `JWT_SECRET` en el `.env`, nunca en el código. |
| **Expiración Corta** | Usa tiempos de expiración cortos (15m - 1h) y Refresh Tokens para mayor seguridad. |
| **HTTPS** | Los tokens viajan en el header; sin HTTPS, son visibles para atacantes (MITM). |
| **Minimiza el Payload** | No guardes datos sensibles (como contraseñas) dentro del JWT. |

> [!CAUTION]
> Si pierdes o expones tu `JWT_SECRET`, todos los tokens de todos tus usuarios pueden ser falsificados. Cámbialo inmediatamente si se compromete.

---

¿Listo para organizar todo esto en una estructura profesional? Lee la guía sobre **Arquitectura y Organización de Aplicaciones Escalables**.
