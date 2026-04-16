---
title: 'Guía de System Design para Senior Developers'
code: 'system-design-senior'
description: 'Aprende diseño de sistemas escalables con Hayk Simonyan. De infraestructura básica a APIs seguras: roadmap completo para pasar de mid-level a senior engineer.'
pubDate: 'Apr 16 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Guía de System Design para Senior Developers 🚀

## Introducción

Este curso integral de Hayk Simonyan proporciona un roadmap para desarrolladores mid-level que aspiran a roles senior. El enfoque está en tomar decisiones arquitectónicas, evaluar trade-offs y diseñar sistemas escalables desde cero, no solo escribir código.

A lo largo de esta guía, cubriremos las áreas clave: infraestructura básica, selección de bases de datos, diseño de APIs y protocolos, y seguridad con autenticación y autorización. Estos conceptos te prepararán para entrevistas de system design e implementación de software production-ready.

---

## Infraestructura Básica

### Progresión desde Setup Simple

#### Minuto 0:03:05
Comenzamos con una configuración simple de servidor único:

```
Cliente → Servidor Único → Base de Datos
```

**Problemas:**
- Punto único de falla
- Límite de capacidad
- Sin redundancia

### Escalabilidad Vertical y Horizontal

#### Minuto 0:13:32

#### Escalabilidad Vertical (Scale Up)
- Aumentar recursos del servidor existente
- CPU, RAM, almacenamiento
- Límite físico del hardware

#### Escalabilidad Horizontal (Scale Out)
- Agregar más servidores
- Distribuir carga entre instancias
- Arquitectura de microservicios

### Load Balancing

#### Minuto 0:16:22
Distribuir tráfico entre múltiples servidores.

#### Tipos de Load Balancers
- **Round Robin**: Alterna entre servidores
- **Least Connections**: Envía a servidor con menos conexiones
- **IP Hash**: Basado en IP del cliente (sesiones sticky)

#### Ejemplo con Nginx
```nginx
upstream backend {
    server server1.example.com;
    server server2.example.com;
    server server3.example.com;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

### Health Checks

#### Minuto 0:25:08
Verificar que los servidores estén funcionando.

#### Tipos
- **Active**: LB envía requests de health
- **Passive**: Monitorea respuestas fallidas

#### Implementación
```python
# Health check endpoint
@app.route('/health')
def health():
    # Verificar DB connection, servicios externos
    if db_connection_ok() and external_services_ok():
        return {'status': 'healthy'}, 200
    return {'status': 'unhealthy'}, 503
```

---

## Selección de Bases de Datos

### Minuto 0:07:12

Comparación entre bases de datos relacionales y no relacionales.

### Bases de Datos Relacionales (SQL)

#### Características
- Esquemas fijos (tablas, relaciones)
- ACID (Atomicidad, Consistencia, Aislamiento, Durabilidad)
- Consultas complejas con JOINs
- Ejemplos: PostgreSQL, MySQL, SQL Server

#### Casos de Uso
- Datos estructurados
- Transacciones financieras
- Relaciones complejas
- Reporting y analytics

### Bases de Datos No Relacionales (NoSQL)

#### Tipos

##### Document Store
- Almacena documentos JSON/BSON
- Flexible schema
- Ejemplos: MongoDB, CouchDB
- Caso: Perfiles de usuario, contenido CMS

##### Wide-Column Store
- Columnas flexibles por fila
- Alto rendimiento para analytics
- Ejemplos: Cassandra, HBase
- Caso: Time series, IoT data

##### Graph Database
- Nodos y relaciones
- Consultas de grafos eficientes
- Ejemplos: Neo4j, Amazon Neptune
- Caso: Redes sociales, recomendaciones

##### Key-Value Store
- Simple key-value pairs
- Alto rendimiento, baja latencia
- Ejemplos: Redis, DynamoDB
- Caso: Caching, sessions, configuración

### Criterios de Selección

| Criterio | SQL | NoSQL |
|----------|-----|-------|
| Consistencia | Alta | Variable (eventual) |
| Escalabilidad | Vertical | Horizontal |
| Flexibilidad Schema | Baja | Alta |
| Consultas Complejas | Excelente | Limitado |
| Transacciones | ACID | BASE |

---

## Diseño de APIs y Protocolos

### Principios para APIs Consistentes

- **RESTful**: Recursos, HTTP verbs
- **Versioning**: /v1/users, headers
- **Documentación**: OpenAPI/Swagger
- **Rate Limiting**: Evitar abuso
- **Caching**: Headers apropiados

### Protocolos de Transporte

#### Minuto 0:59:10

##### TCP (Transmission Control Protocol)
- Conexión orientada
- Reliable, ordered delivery
- Overhead mayor
- Usado en HTTP, FTP, SMTP

##### UDP (User Datagram Protocol)
- Connectionless
- No garantiza delivery
- Bajo overhead, rápido
- Usado en streaming, gaming, DNS

### RESTful APIs

#### Minuto 1:04:22

```http
# Recursos y verbs HTTP
GET    /users          # Listar usuarios
POST   /users          # Crear usuario
GET    /users/{id}     # Obtener usuario específico
PUT    /users/{id}     # Actualizar usuario
DELETE /users/{id}     # Eliminar usuario
```

#### Ventajas
- Simple, stateless
- Cacheable
- Basado en estándares web

#### Desventajas
- Over-fetching/under-fetching
- Múltiples requests para datos relacionados

### GraphQL

#### Minuto 1:19:04

```graphql
# Query específica
query {
  user(id: "123") {
    name
    email
    posts {
      title
      content
    }
  }
}
```

#### Ventajas
- Fetch exact data needed
- Single endpoint
- Strongly typed schema
- Real-time con subscriptions

#### Desventajas
- Complejidad en servidor
- Caching más difícil
- N+1 query problem

### gRPC

#### Basado en Protocol Buffers
- Alta performance
- Strongly typed
- Bi-directional streaming
- Multi-language support

```protobuf
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc ListUsers(ListUsersRequest) returns (stream User);
}
```

---

## Seguridad, Autenticación y Autorización

### Prácticas para Proteger APIs

### Autenticación

#### Minuto 1:24:52

##### JWT (JSON Web Tokens)
```json
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "userId": 123,
  "username": "john",
  "exp": 1640995200
}

// Signature
HMACSHA256(base64(header) + "." + base64(payload), secret)
```

##### OAuth 2.0
- Authorization framework
- Delegated access
- Flows: Authorization Code, Implicit, Client Credentials, Password

### Autorización

#### Minuto 1:45:51

##### RBAC (Role-Based Access Control)
- Roles: Admin, Editor, Viewer
- Permissions por rol
- Simple de implementar

##### ABAC (Attribute-Based Access Control)
- Basado en atributos: user, resource, environment
- Más granular
- Ejemplo: "Editor puede editar posts propios entre 9am-5pm"

### Rate Limiting

#### Minuto 1:57:02

```python
# Implementación simple
from flask_limiter import Limiter

limiter = Limiter(app)

@app.route("/api/data")
@limiter.limit("100 per hour")
def get_data():
    return {"data": "some data"}
```

#### Estrategias
- **Fixed Window**: 100 requests por hora
- **Sliding Window**: Más preciso
- **Token Bucket**: Límite de ráfagas

### Mejores Prácticas de Seguridad

- **HTTPS**: Siempre
- **Input Validation**: Sanitizar datos
- **CORS**: Configurar apropiadamente
- **Security Headers**: HSTS, CSP, X-Frame-Options
- **Logging & Monitoring**: Detectar ataques
- **Regular Audits**: Revisar vulnerabilidades

---

## Conclusión

Este curso de Hayk Simonyan es esencial para cualquier desarrollador que aspire a roles senior. Los conceptos de system design van más allá de la codificación: se trata de pensar en arquitectura, escalabilidad y trade-offs.

### Roadmap para Senior Developer

1. **Infraestructura**: De single-server a sistemas distribuidos
2. **Bases de Datos**: Elegir la tecnología apropiada
3. **APIs**: Diseñar interfaces consistentes y eficientes
4. **Seguridad**: Proteger sistemas y datos

### Próximos Pasos

- Practica con diagramas de arquitectura
- Implementa proyectos personales escalables
- Estudia casos reales (Netflix, Uber, etc.)
- Participa en entrevistas de system design

El camino a senior developer requiere práctica constante y pensamiento crítico. ¿Listo para diseñar sistemas que escalen?