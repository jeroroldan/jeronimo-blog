---
title: "Guía: Despliegue de API Express y PostgreSQL en Railway"
description: "Lleva tu aplicación del entorno local a producción. Aprende a configurar Railway, conectar bases de datos en la nube y gestionar variables de entorno."
pubDate: "2026-04-19"
code: "deploy-node-railway-guia"
category: "devops"
tags: ["deployment", "railway", "postgresql", "cloud", "backend"]
difficulty: "intermedio"
readingTime: 10
---

# Guía: Despliegue en la Nube con Railway 🚀

> 💡 **En esta guía aprenderás**: Cómo realizar el "Launch" de tu aplicación Node.js. Veremos el proceso de despliegue en Railway, la configuración de una base de datos PostgreSQL productiva y el manejo de variables críticas en la nube.

---

## Parte 1: ¿Por qué Railway?

Para proyectos modernos y rápidos, Railway se ha convertido en la alternativa favorita a Heroku debido a su simplicidad, su excelente manejo de PostgreSQL y su generoso plan de inicio.

**Características Clave:**
- **Auto-Despliegue**: Se conecta a tu repositorio de GitHub y despliega en cada `git push`.
- **Base de Datos Integrada**: Crea una instancia de Postgres con un solo clic.
- **Configuración Fácil**: Panel intuitivo para variables de entorno.

---

## Parte 2: Preparando la Aplicación para Producción

Antes de subir el código, debemos asegurarnos de que la aplicación escuche en el puerto correcto y use las variables del entorno.

### 2.1 El Puerto Dinámico
Railway (y la mayoría de los hosts) asignan un puerto dinámico mediante la variable `PORT`.

```javascript
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
```

### 2.2 El Script de Inicio
Asegúrate de que tu `package.json` tenga el script `start`:
```json
"scripts": {
  "start": "node src/app.js",
  "dev": "nodemon src/app.js"
}
```

---

## Parte 3: Configuración en Railway 🛠️

### 3.1 Creación del Proyecto
1. Ve a [Railway.app](https://railway.app) e inicia sesión con GitHub.
2. Haz clic en **New Project** → **Deploy from GitHub repo**.
3. Selecciona tu repositorio.

### 3.2 Agregando PostgreSQL
1. Dentro de tu proyecto en Railway, haz clic en **+ Add** → **Database** → **Add PostgreSQL**.
2. Railway generará automáticamente las credenciales.
3. Copia el `DATABASE_URL` que aparece en la pestaña **Variables** de la base de datos.

---

## Parte 4: Variables de Entorno y Prisma

Este es el paso más crítico. Tu aplicación necesita conocer las credenciales de la base de datos en la nube.

### 4.1 Configurando Variables en Railway
Ve a la pestaña **Variables** de tu servicio de Node.js y agrega:
- `DATABASE_URL`: (La URL que copiaste de la base de datos de Railway).
- `JWT_SECRET`: Una clave larga y aleatoria.
- `NODE_ENV`: `production`.

### 4.2 Ejecutando Migraciones al Desplegar
Para que las tablas se creen en la nube, puedes modificar tu script de inicio o agregar un comando de "Build":
```bash
# En el panel de Railway, puedes configurar el comando de despliegue:
npx prisma generate && npx prisma migrate deploy && npm start
```

---

## Parte 5: Verificación y Logs

Una vez finalizado el despliegue, Railway te proporcionará una URL pública (ej: `tu-api.up.railway.app`).

**Cómo verificar:**
- Usa **Postman** o **Insomnia** para probar tus endpoints.
- Revisa la pestaña **Logs** en Railway para ver si hay errores de conexión o de escucha de puerto.

---

## Resumen de Mejores Prácticas

| Tarea | Importancia |
| :--- | :--- |
| **No subir `.env`** | Vital. Asegúrate de que esté en tu `.gitignore`. |
| **Prisma Client** | Siempre ejecuta `prisma generate` antes de iniciar. |
| **Monitoreo** | Revisa los gráficos de uso de CPU y RAM en el dashboard. |

> [!TIP]
> ¡Felicidades! Has completado el ciclo completo, desde el primer `Hello World` hasta tener una API escalable, segura y desplegada en la nube.

---

¿Tu despliegue falló? Revisa los logs de construcción y asegúrate de que todas las variables de entorno estén presentes.
