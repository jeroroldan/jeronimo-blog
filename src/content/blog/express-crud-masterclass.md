---
title: "Master Class: Fundamentos de CRUD con Node.js y Express.js"
description: "Domina la creación de APIs RESTful: desde métodos HTTP hasta validaciones avanzadas y persistencia en archivos."
pubDate: "2026-04-19"
code: "express-crud-masterclass"
category: "backend"
tags: ["nodejs", "express", "crud", "api-rest", "javascript"]
difficulty: "intermedio"
readingTime: 12
---

# Master Class: Fundamentos de CRUD y Express.js 🚀

> 💡 **En esta guía aprenderás**: Cómo construir los cimientos de una API RESTful profesional, manejando el ciclo completo de los datos (Crear, Leer, Actualizar, Borrar) y validando la integridad de la información.

---

## Parte 1: El Protocolo HTTP y Express.js

Para construir una API, el primer paso es entender cómo se comunica el cliente con el servidor. Express.js simplifica este proceso mediante una sintaxis intuitiva para manejar métodos HTTP.

| Método | Acción CRUD | Descripción |
| :--- | :--- | :--- |
| **GET** | Read | Obtener recursos (lista o item único). |
| **POST** | Create | Crear un nuevo recurso en el servidor. |
| **PUT** | Update | Reemplazar un recurso existente. |
| **DELETE** | Delete | Eliminar un recurso del servidor. |

### Configuración Inicial de la API
```javascript
const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
```

---

## Parte 2: Persistencia Simple con FS y Path

Antes de saltar a bases de datos complejas, es fundamental entender cómo manipular archivos localmente usando los módulos nativos de Node.js: `fs` (File System) y `path`.

> [!NOTE]
> Usar el sistema de archivos es ideal para prototipos rápidos o configuraciones, pero para aplicaciones escalables usaremos bases de datos (ver guía de Prisma).

### Lectura y Escritura de Archivos
```javascript
const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'users.json');

// Función para leer usuarios
async function readUsers() {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}
```

---

## Parte 3: Implementando el CRUD de Usuarios

### 3.1 Creación de Usuarios (POST)
El método POST recibe datos en el `req.body`. Es vital generar un ID único y persistir el nuevo registro.

```javascript
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const users = await readUsers();
  
  const newUser = { id: Date.now(), name, email };
  users.push(newUser);
  
  await fs.writeFile(filePath, JSON.stringify(users));
  res.status(201).json(newUser);
});
```

### 3.2 Actualización y Validación (PUT)
No solo se trata de cambiar los datos, sino de asegurar que lo que recibimos es correcto antes de guardar.

```javascript
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  
  // Validación simple
  if (!name || !email) {
    return res.status(400).json({ error: 'Nombre y Email son obligatorios' });
  }

  // Lógica de actualización...
});
```

---

## Parte 4: Eliminación Segura (DELETE)

Eliminar un recurso requiere identificarlo correctamente mediante parámetros de ruta (`req.params.id`) y filtrar la colección para removerlo.

```javascript
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  let users = await readUsers();
  
  users = users.filter(user => user.id !== parseInt(id));
  
  await fs.writeFile(filePath, JSON.stringify(users));
  res.status(204).send();
});
```

---

## Mejores Prácticas de CRUD

1. **Códigos de Estado**: Usa `201` para creaciones exitosas, `200` para lecturas/actualizaciones y `204` para eliminaciones.
2. **Validación de Datos**: Nunca confíes en el cliente. Valida siempre que los campos requeridos estén presentes.
3. **Manejo de Errores**: Envuélvelo todo en bloques `try/catch` para evitar que el servidor se caiga ante un error de lectura de archivo.

> [!TIP]
> En la siguiente guía veremos cómo automatizar estas validaciones usando **Middlewares**, manteniendo nuestros controladores limpios y legibles.

---

¿Listo para el siguiente nivel? Revisa la guía de **Middlewares en Express** para profesionalizar tu manejo de errores y registros.
