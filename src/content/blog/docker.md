---
title: 'Docker y DevOps'
description: 'Guía de Docker y DevOps con Analogías Cotidianas 🐳'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Guía de Docker y DevOps con Analogías Cotidianas 🐳

*Conceptos Técnicos Explicados Como la Vida Misma*

---s

## 🎯 **Introducción: El Mundo de la Tecnología Como una Ciudad**

Imagínate que desarrollar software es como construir y administrar una ciudad moderna. Docker y DevOps son las herramientas y metodologías que nos ayudan a hacer que esta ciudad funcione de manera eficiente, escalable y sin problemas.

---

## 🏠 **CAPÍTULO 1: Docker - El Arte de la Construcción Moderna**

### **¿Qué es Docker?**

**Analogía de los Apartamentos Prefabricados:** Docker es como una empresa que construye apartamentos prefabricados súper modernos. En lugar de construir cada casa desde cero en el terreno, construyes módulos completos en la fábrica y los transportas donde los necesitas.

### **Conceptos Fundamentales de Docker**

#### **1. Contenedores = Apartamentos Amueblados**

**Qué son:** Espacios completamente equipados y listos para vivir

**Características:**

* Vienen con todo lo necesario (muebles, electrodomésticos, servicios)
* Son portables (puedes moverlos a diferentes edificios)
* Están aislados (lo que pasa en tu apartamento no afecta al vecino)
* Son eficientes (comparten infraestructura como agua, luz, internet)

**En Docker:**

```bash
# Crear un apartamento (contenedor) desde un plano (imagen)
docker run -d --name mi-apartamento nginx

# Ver qué apartamentos están ocupados
docker ps

# Entrar a tu apartamento para arreglar algo
docker exec -it mi-apartamento bash
```

#### **2. Imágenes = Planos Arquitectónicos**

**Qué son:** Los diseños maestros para construir apartamentos idénticos

**Analogía del Arquitecto:** Un arquitecto crea un plano perfecto para un apartamento. Con ese plano, puedes construir 1, 10 o 1000 apartamentos exactamente iguales. Las imágenes Docker son esos planos para software.

**Ejemplo práctico:**

```bash
# Descargar un plano (imagen) de un apartamento tipo "nginx"
docker pull nginx

# Ver todos los planos que tienes
docker images

# Construir tu propio plano personalizado
docker build -t mi-app-personalizada .
```

#### **3. Dockerfile = Instrucciones de Construcción**

**Analogía del Manual IKEA:** Como cuando compras un mueble de IKEA y viene con instrucciones paso a paso. El Dockerfile es exactamente eso: un manual que dice cómo construir tu aplicación paso a paso.

**Ejemplo de Dockerfile (Manual de construcción):**

```dockerfile
# Empezar con un apartamento base (como empezar con paredes)
FROM node:16

# Establecer la dirección (directorio de trabajo)
WORKDIR /app

# Traer los materiales (copiar archivos)
COPY package*.json ./

# Instalar las comodidades (dependencias)
RUN npm install

# Traer el resto de tus cosas
COPY . .

# Decir qué puerto usar (como el número de apartamento)
EXPOSE 3000

# Instrucciones para cuando alguien "llegue a casa"
CMD ["npm", "start"]
```

#### **4. Docker Hub = Centro Comercial de Planos**

**Analogía del Home Depot:** Docker Hub es como un Home Depot gigante donde en lugar de herramientas, encuentras planos (imágenes) de todo tipo: desde apartamentos básicos hasta mansiones súper especializadas.

**Ejemplos de "productos" en Docker Hub:**

```bash
# Apartamento con servidor web (nginx)
docker pull nginx

# Casa con base de datos (PostgreSQL)
docker pull postgres

# Oficina con Node.js
docker pull node

# Búsqueda en el "catálogo"
docker search python
```

### **Ventajas de Docker vs. Métodos Tradicionales**

#### **Método Tradicional = Construir Casa Desde Cero**

**Problemas:**

* Cada casa es diferente (inconsistencias)
* Toma mucho tiempo construir
* Difícil de mover o replicar
* Problemas de "a mí me funciona" (en mi terreno sí funciona)

#### **Método Docker = Apartamentos Prefabricados**

**Ventajas:**

* Construcción rápida y consistente
* Fácil transporte y replicación
* Aislamiento perfecto
* Uso eficiente de recursos

---

## 🏗️ **CAPÍTULO 2: Docker Compose - El Director de Orquesta**

### **¿Qué es Docker Compose?**

**Analogía del Complejo Residencial:** Imagínate que necesitas construir no solo un apartamento, sino un complejo completo: apartamentos residenciales, oficinas, restaurante, gym, estacionamiento. Docker Compose es como el director general que coordina la construcción de todo el complejo.

### **docker-compose.yml = Plano Maestro del Complejo**

```yaml
version: '3.8'
services:
  # El restaurante del complejo
  web:
    image: nginx
    ports:
      - "80:80"
    depends_on:
      - api
  
  # La oficina administrativa  
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=database
    depends_on:
      - database
  
  # El banco/archivo del complejo
  database:
    image: postgres:13
    environment:
      POSTGRES_DB: miapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secreto
    volumes:
      - datos_db:/var/lib/postgresql/data

volumes:
  datos_db:
```

### **Comandos de Docker Compose**

```bash
# Construir todo el complejo
docker-compose up -d

# Ver el estado del complejo
docker-compose ps

# Renovar un edificio específico
docker-compose restart web

# Demoler todo el complejo
docker-compose down

# Ver los planos del complejo
docker-compose config
```

---

## 🚀 **CAPÍTULO 3: DevOps - La Filosofía de la Eficiencia**

### **¿Qué es DevOps?**

**Analogía de la Línea de Producción de Toyota:** DevOps es como el sistema de producción de Toyota: en lugar de que cada departamento trabaje aislado (diseño, construcción, control de calidad, entrega), todos trabajan como un equipo integrado para entregar productos de calidad de manera rápida y continua.

### **Antes de DevOps = Fábrica Tradicional**

**Problemas:**

* **Desarrollo (Diseñadores):** "Ya terminé el diseño" → lo pasan a producción
* **Operaciones (Constructores):** "Este diseño no se puede construir" → lo regresan
* **Control de Calidad:** "Tiene defectos" → de vuelta al principio
* **Resultado:** Meses para entregar, muchos errores, clientes insatisfechos

### **Con DevOps = Línea de Producción Moderna**

**Ventajas:**

* Todos trabajan juntos desde el principio
* Pruebas automáticas en cada paso
* Entrega continua de pequeñas mejoras
* Retroalimentación constante del cliente
* **Resultado:** Entregas semanales o diarias, alta calidad, clientes felices

---

## 🔄 **CAPÍTULO 4: CI/CD - La Línea de Ensamblaje Inteligente**

### **CI (Continuous Integration) = Control de Calidad Automático**

**Analogía de la Línea de Ensamblaje de Autos:** Imagínate una fábrica de autos donde cada vez que un trabajador agrega una pieza, robots automáticamente verifican que esté bien instalada, que no interfiera con otras piezas y que el auto siga funcionando.

#### **Proceso CI Paso a Paso:**

```yaml
# .github/workflows/ci.yml (Receta de control de calidad)
name: Control de Calidad Automático
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  quality_control:
    runs-on: ubuntu-latest
    steps:
    # 1. Traer el código (como traer el auto a la estación)
    - uses: actions/checkout@v2
  
    # 2. Preparar herramientas (como preparar la estación de trabajo)
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
  
    # 3. Instalar dependencias (como traer las herramientas)
    - name: Install dependencies
      run: npm install
  
    # 4. Ejecutar pruebas (como hacer inspección de calidad)
    - name: Run tests
      run: npm test
  
    # 5. Verificar estilo de código (como verificar pintura)
    - name: Lint code
      run: npm run lint
  
    # 6. Construir aplicación (como ensamblar partes finales)
    - name: Build application
      run: npm run build
```

### **CD (Continuous Deployment) = Entrega a Domicilio Automática**

**Analogía del Amazon Prime:** Una vez que tu auto pasa control de calidad, automáticamente se envía al concesionario correcto, se actualiza el inventario, se notifica al cliente y se prepara para entrega. Todo sin intervención humana.

#### **Pipeline de CD:**

```yaml
# Continuación del archivo anterior
  deploy_to_production:
    needs: quality_control
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    # 1. Preparar el paquete de entrega
    - name: Build Docker image
      run: docker build -t mi-app:${{ github.sha }} .
  
    # 2. Etiquetar para inventario
    - name: Tag image
      run: docker tag mi-app:${{ github.sha }} mi-app:latest
  
    # 3. Enviar al almacén (registry)
    - name: Push to registry
      run: docker push mi-app:latest
  
    # 4. Notificar al "concesionario" (servidor de producción)
    - name: Deploy to production
      run: |
        ssh user@production-server "
          docker pull mi-app:latest &&
          docker stop mi-app-running || true &&
          docker run -d --name mi-app-running mi-app:latest
        "
```

---

## 🎼 **CAPÍTULO 5: Kubernetes - El Director de Orquesta**

### **¿Qué es Kubernetes?**

**Analogía del Director de una Orquesta Sinfónica:** Kubernetes es como el director de una orquesta que coordina 100 músicos (contenedores) para que toquen en armonía. Si un violinista se enferma, automáticamente trae un reemplazo. Si necesita más volumen, añade más instrumentos.

### **Conceptos de Kubernetes**

#### **1. Pods = Secciones de la Orquesta**

**Qué son:** Grupos pequeños de instrumentos que tocan juntos

```yaml
# Pod de violines (grupo de contenedores relacionados)
apiVersion: v1
kind: Pod
metadata:
  name: violines-seccion
spec:
  containers:
  - name: violin-principal
    image: violin:maestro
  - name: violin-apoyo
    image: violin:estudiante
```

#### **2. Deployments = Partitura Musical**

**Qué son:** Instrucciones de cómo debe sonar la música

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: orquesta-sinfonica
spec:
  replicas: 3  # Queremos 3 secciones de violines
  selector:
    matchLabels:
      instrumento: violin
  template:
    metadata:
      labels:
        instrumento: violin
    spec:
      containers:
      - name: violin
        image: violin:profesional
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
```

#### **3. Services = Sistema de Audio**

**Qué son:** Cómo el público escucha la música

```yaml
apiVersion: v1
kind: Service
metadata:
  name: audio-publico
spec:
  selector:
    instrumento: violin
  ports:
  - port: 80      # Puerto del sistema de audio
    targetPort: 8080  # Puerto de los micrófonos en los violines
  type: LoadBalancer  # Distribución de audio equilibrada
```

### **Comandos Básicos de Kubernetes**

```bash
# Ver el estado de la orquesta
kubectl get pods

# Ver todas las secciones
kubectl get deployments

# Escuchar más fuerte (escalar)
kubectl scale deployment orquesta-sinfonica --replicas=5

# Ver los sistemas de audio
kubectl get services

# Revisar si algún músico tiene problemas
kubectl describe pod nombre-del-pod

# Ver las notas/logs de los músicos
kubectl logs nombre-del-pod
```

---

## 📊 **CAPÍTULO 6: Monitoreo y Observabilidad - El Sistema de Salud**

### **Analogía del Check-up Médico Continuo**

Imagínate un futuro donde tienes sensores que monitorean tu salud 24/7, detectan problemas antes de que te sientas mal y automáticamente te sugieren tratamientos.

### **Las 3 Dimensiones de la Observabilidad**

#### **1. Métricas = Signos Vitales**

```yaml
# Ejemplo de métricas básicas (como presión arterial, temperatura)
apiVersion: v1
kind: ConfigMap
metadata:
  name: health-metrics
data:
  config.yml: |
    metrics:
      - cpu_usage          # Como temperatura corporal
      - memory_usage       # Como presión arterial
      - response_time      # Como frecuencia cardíaca
      - error_rate         # Como nivel de estrés
```

#### **2. Logs = Historial Médico**

```bash
# Ver el historial completo
kubectl logs mi-app --since=1h

# Ver historial en tiempo real (como monitor cardíaco)
kubectl logs -f mi-app

# Buscar síntomas específicos
kubectl logs mi-app | grep ERROR
```

#### **3. Trazas = Radiografías del Sistema**

Cuando vas al doctor y te hacen una radiografía para ver exactamente dónde está el problema, las trazas hacen lo mismo con las aplicaciones.

### **Herramientas de Monitoreo**

#### **Prometheus = Doctor Especialista**

```yaml
# Configuración de chequeos médicos
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    scrape_configs:
    - job_name: 'health-checkup'
      static_configs:
      - targets: ['mi-app:8080']
      scrape_interval: 30s  # Chequeo cada 30 segundos
```

#### **Grafana = Pantalla del Hospital**

Como esas pantallas en los hospitales que muestran gráficos de los signos vitales del paciente, pero para tus aplicaciones.

---

## 🔧 **CAPÍTULO 7: Herramientas DevOps Esenciales**

### **Git = Sistema de Respaldos Inteligente**

**Analogía del Escritor con Múltiples Borradores:** Como un escritor que guarda una copia de su libro cada vez que hace cambios importantes, y puede volver a cualquier versión anterior si algo sale mal.

```bash
# Guardar un borrador (commit)
git add .
git commit -m "Capítulo 3 terminado"

# Ver historial de borradores
git log --oneline

# Volver a un borrador anterior
git checkout abc123

# Crear una versión alternativa (branch)
git checkout -b version-alternativa

# Fusionar dos versiones
git merge version-alternativa
```

### **Jenkins = Asistente Personal Robotizado**

**Analogía del Mayordomo Perfecto:** Jenkins es como tener un mayordomo que automáticamente hace todas las tareas rutinarias: revisar el correo, organizar documentos, hacer compras, preparar reportes.

```groovy
// Jenkinsfile (Instrucciones para el mayordomo)
pipeline {
    agent any
    stages {
        stage('Limpiar la casa') {
            steps {
                sh 'rm -rf build/'
            }
        }
        stage('Hacer las compras') {
            steps {
                sh 'npm install'
            }
        }
        stage('Cocinar la cena') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Servir la mesa') {
            steps {
                sh 'docker build -t mi-app .'
                sh 'docker push mi-app'
            }
        }
    }
}
```

### **Terraform = Arquitecto Virtual**

**Analogía del SimCity para la Vida Real:** Terraform es como jugar SimCity, pero en lugar de crear ciudades virtuales, creas infraestructura real en la nube con código.

```hcl
# main.tf (Planos de la ciudad)
resource "aws_instance" "mi_servidor" {
  ami           = "ami-0c55b159cbfafe1d0"  # Tipo de edificio
  instance_type = "t2.micro"              # Tamaño del edificio
  
  tags = {
    Name = "Mi-Servidor-Web"              # Nombre del edificio
  }
}

resource "aws_security_group" "web_sg" {
  name = "seguridad-web"
  
  # Reglas de seguridad (como guardias de seguridad)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Permitir visitantes por la puerta principal
  }
}
```

### **Ansible = Equipo de Decoradores**

**Analogía de los Decoradores de Interiores:** Después de que Terraform construye el edificio, Ansible llega como un equipo de decoradores para configurar todo por dentro: instalar software, configurar servicios, organizar archivos.

```yaml
# playbook.yml (Lista de tareas de decoración)
---
- hosts: servidores
  become: yes
  tasks:
    - name: Instalar Docker (como instalar un sistema de entretenimiento)
      apt:
        name: docker.io
        state: present
  
    - name: Configurar aplicación (como acomodar los muebles)
      copy:
        src: mi-app.conf
        dest: /etc/mi-app/
  
    - name: Iniciar servicios (como encender las luces)
      service:
        name: docker
        state: started
        enabled: yes
```

---

## 🏭 **CAPÍTULO 8: Arquitecturas y Patrones**

### **Microservicios vs. Monolito**

#### **Monolito = Centro Comercial Tradicional**

**Características:**

* Todo bajo un mismo techo gigante
* Si hay problema en una tienda, puede afectar todo el centro
* Fácil de construir inicialmente
* Difícil de renovar partes específicas

```dockerfile
# Monolito (Todo en una sola imagen)
FROM node:16
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]  # Una sola aplicación hace todo
```

#### **Microservicios = Plaza Comercial Moderna**

**Características:**

* Cada tienda es un edificio independiente
* Si una tienda cierra, las demás siguen funcionando
* Puedes renovar o cambiar tiendas individualmente
* Más complejo de coordinar

```yaml
# docker-compose.yml (Plaza con múltiples tiendas)
version: '3.8'
services:
  tienda-usuarios:      # Tienda especializada en usuarios
    image: usuarios-service
    ports: ["3001:3000"]
  
  tienda-productos:     # Tienda especializada en productos
    image: productos-service  
    ports: ["3002:3000"]
  
  tienda-pagos:         # Tienda especializada en pagos
    image: pagos-service
    ports: ["3003:3000"]
  
  centro-comercial:     # Directorio del centro comercial
    image: api-gateway
    ports: ["80:80"]
    depends_on:
      - tienda-usuarios
      - tienda-productos
      - tienda-pagos
```

### **Patrones de Comunicación**

#### **API Gateway = Recepcionista del Hotel**

Un recepcionista que recibe todas las solicitudes de los huéspedes y las dirige al departamento correcto.

```yaml
# nginx.conf (Configuración del recepcionista)
upstream usuarios {
    server tienda-usuarios:3000;
}
upstream productos {
    server tienda-productos:3000;
}

server {
    listen 80;
  
    location /usuarios/ {
        proxy_pass http://usuarios/;     # Dirigir a departamento usuarios
    }
  
    location /productos/ {
        proxy_pass http://productos/;    # Dirigir a departamento productos
    }
}
```

---

## 🔒 **CAPÍTULO 9: Seguridad - El Sistema de Protección**

### **Seguridad en Capas = Castillo Medieval**

La seguridad no es una sola muralla, sino múltiples capas de protección como un castillo medieval.

#### **Capa 1: El Foso (Firewall)**

```yaml
# Security Group (Reglas del foso)
apiVersion: v1
kind: NetworkPolicy
metadata:
  name: foso-protector
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          role: frontend    # Solo guardias autorizados pueden entrar
    ports:
    - protocol: TCP
      port: 8080
```

#### **Capa 2: La Muralla (Container Security)**

```dockerfile
# Dockerfile seguro (Muralla fortificada)
FROM node:16-alpine    # Usar imagen minimalista (menos vulnerabilidades)

# Crear usuario no-root (no dar llaves del castillo a cualquiera)
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copiar archivos con permisos limitados
COPY --chown=nodejs:nodejs . .

# Cambiar a usuario seguro
USER nodejs

# Solo exponer puertos necesarios
EXPOSE 3000
```

#### **Capa 3: La Torre del Homenaje (Secrets Management)**

```yaml
# secrets.yml (Bóveda del tesoro)
apiVersion: v1
kind: Secret
metadata:
  name: tesoro-secreto
type: Opaque
data:
  password: cGFzc3dvcmQtc2VjcmV0bw==    # Contraseña encriptada
  api-key: YWJjZGVmZ2hpams=              # Clave API encriptada
```

### **Herramientas de Seguridad**

#### **Vault = Banco Suizo Digital**

```bash
# Configurar la bóveda
vault auth -method=userpass username=admin

# Guardar secretos en la bóveda
vault write secret/mi-app password=super-secreto

# Obtener secretos de la bóveda
vault read secret/mi-app
```

---

## 📈 **CAPÍTULO 10: Escalabilidad - Creciendo Como Ciudad**

### **Escalabilidad Horizontal vs. Vertical**

#### **Escalabilidad Vertical = Construir Edificios Más Altos**

```yaml
# Darle más recursos a un solo contenedor
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: mi-app
        image: mi-app:latest
        resources:
          requests:
            memory: "2Gi"     # Más memoria (como agregar pisos)
            cpu: "1000m"      # Más CPU (como ascensores más rápidos)
```

#### **Escalabilidad Horizontal = Construir Más Edificios**

```yaml
# Crear múltiples instancias
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app
spec:
  replicas: 5    # 5 edificios idénticos en lugar de uno alto
  template:
    spec:
      containers:
      - name: mi-app
        image: mi-app:latest
        resources:
          requests:
            memory: "512Mi"   # Cada edificio más pequeño
            cpu: "250m"       # Pero más edificios en total
```

### **Auto-escalado = Sistema Inteligente de Construcción**

```yaml
# HPA (Horizontal Pod Autoscaler)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: constructor-inteligente
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mi-app
  minReplicas: 2      # Mínimo 2 edificios siempre
  maxReplicas: 10     # Máximo 10 edificios
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70  # Si CPU > 70%, construir más edificios
```

---

## 🎯 **CAPÍTULO 11: Casos de Uso Reales**

### **Caso 1: E-commerce Como Amazon**

**Arquitectura:**

```yaml
# E-commerce completo
version: '3.8'
services:
  # Frente de tienda (lo que ve el cliente)
  frontend:
    image: react-ecommerce
    ports: ["80:80"]
  
  # Catálogo de productos
  catalogo:
    image: productos-api
    environment:
      - DB_HOST=db-productos
  
  # Sistema de pedidos
  pedidos:
    image: pedidos-api
    environment:
      - DB_HOST=db-pedidos
      - PAYMENT_SERVICE=pagos
  
  # Procesamiento de pagos
  pagos:
    image: stripe-processor
    environment:
      - STRIPE_KEY=${STRIPE_SECRET}
  
  # Bases de datos especializadas
  db-productos:
    image: postgres:13
    environment:
      POSTGRES_DB: productos
  
  db-pedidos:
    image: postgres:13
    environment:
      POSTGRES_DB: pedidos
  
  # Sistema de caché (como memoria rápida)
  cache:
    image: redis:6
  
  # Cola de trabajos (como lista de tareas pendientes)
  queue:
    image: rabbitmq:3
```

### **Caso 2: Aplicación de Streaming Como Netflix**

**Desafíos:**

* Millones de usuarios simultáneos
* Videos en múltiples calidades
* Recomendaciones personalizadas
* Disponibilidad global

**Solución:**

```yaml
# Streaming platform
version: '3.8'
services:
  # CDN para distribución global
  cdn-proxy:
    image: nginx
    volumes:
      - ./nginx-cdn.conf:/etc/nginx/nginx.conf
  
  # Servicio de autenticación
  auth-service:
    image: auth-microservice
    replicas: 3
  
  # Catálogo de contenido
  content-catalog:
    image: catalog-service
    environment:
      - ELASTICSEARCH_HOST=search-engine
  
  # Motor de recomendaciones
  recommendations:
    image: ml-recommendations
    environment:
      - REDIS_HOST=user-cache
  
  # Transcodificación de video
  video-processor:
    image: ffmpeg-service
    volumes:
      - video-storage:/app/videos
  
  # Búsqueda avanzada
  search-engine:
    image: elasticsearch:7
  
  # Caché de usuarios
  user-cache:
    image: redis:6
```

---

## 🛠️ **CAPÍTULO 12: Ejercicios Prácticos**

### **Ejercicio 1: Tu Primera App con Docker**

**Objetivo:** Crear una aplicación web simple y containerizarla

```bash
# 1. Crear aplicación simple
mkdir mi-primera-app
cd mi-primera-app

# 2. Crear archivo de aplicación
cat > app.js << EOF
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('¡Hola desde mi primer contenedor!');
});

app.listen(3000, () => {
  console.log('App corriendo en puerto 3000');
});
EOF

# 3. Crear package.json
cat > package.json << EOF
{
  "name": "mi-primera-app",
  "version": "1.0.0",
  "main": "app.js",
  "dependencies": {
    "express": "^4.18.0"
  },
  "scripts": {
    "start": "node app.js"
  }
}
EOF

# 4. Crear Dockerfile
cat > Dockerfile << EOF
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
EOF

# 5. Construir y ejecutar
docker build -t mi-primera-app .
docker run -p 3000:3000 mi-primera-app
```

### **Ejercicio 2: Aplicación Multi-Servicio**

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports: ["3000:3000"]
    environment:
      - DB_HOST=database
      - REDIS_HOST=cache
    depends_on:
      - database
      - cache
  
  database:
    image: postgres:13
    environment:
      POSTGRES_DB: miapp
      POSTGRES_USER: usuario
      POSTGRES_PASSWORD: contraseña
    volumes:
      - db_data:/var/lib/postgresql/data
  
  cache:
    image: redis:6
  
  admin:
    image: adminer
    ports: ["8080:8080"]
    depends_on:
      - database

volumes:
  db_data:
```

### **Ejercicio 3: Pipeline CI/CD Básico**

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline
on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Run tests
      run: |
        docker-compose -f docker-compose.test.yml up --abort-on-container-exit
    
  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Build image
      run: docker build -t mi-app:${{ github.sha }} .
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment"
        # Aquí irían los comandos de deployment
```

---

## 📋 **CAPÍTULO 13: Plan de Aprendizaje de 30 Días**

### **Semana 1: Fundamentos Docker**

**Días 1-2:** Instalación y conceptos básicos

* Instalar Docker
* Ejecutar primeros contenedores
* Entender imágenes vs contenedores

**Días 3-4:** Dockerfile y construcción

* Crear Dockerfiles simples
* Construir imágenes propias
* Usar Docker Hub

**Días 5-7:** Docker Compose

* Aplicaciones multi-contenedor
* Redes y volúmenes
* Variables de entorno

### **Semana 2: DevOps Básico**

**Días 8-9:** Git y control de versiones

* Comandos básicos de Git
* Branching y merging
* GitHub/GitLab workflows

**Días 10-11:** CI/CD conceptos

* GitHub Actions básico
* Automatización de pruebas
* Pipelines simples

**Días 12-14:** Infraestructura como código

* Introducción a Terraform
* Configuración con Ansible
* Principios de IaC

### **Semana 3: Orchestración**

**Días 15-16:** Kubernetes basics

* Pods, Services, Deployments
* kubectl comandos básicos
* Manifiestos YAML

**Días 17-18:** Monitoreo

* Logs y métricas
* Prometheus y Grafana básico
* Alertas simples

**Días 19-21:** Seguridad

* Buenas prácticas Docker
* Secrets management
* Network policies

### **Semana 4: Proyectos Reales**

**Días 22-24:** Proyecto completo

* Diseñar arquitectura
* Implementar microservicios
* Pipeline completo

**Días 25-27:** Optimización

* Performance tuning
* Resource optimization
* Cost management

**Días 28-30:** Preparación producción

* High availability
* Disaster recovery
* Documentation

---

## 🏆 **RESUMEN EJECUTIVO: Las 20 Reglas de Oro**

### **Docker (1-7):**

1. **Un proceso por contenedor** - Como un inquilino por apartamento
2. **Imágenes inmutables** - Los planos no cambian, se crean nuevos
3. **Datos en volúmenes** - No guardes cosas importantes en apartamentos temporales
4. **Variables de entorno** - Configuración desde afuera
5. **Usuarios no-root** - No des llaves del castillo a todos
6. **Imágenes pequeñas** - Apartamentos eficientes, no mansiones
7. **Multi-stage builds** - Construir en fábrica, entregar solo lo necesario

### **DevOps (8-14):**

8. **Automatiza todo** - Si lo haces 2 veces, automatízalo
9. **Fail fast, learn faster** - Mejor fallar rápido y barato
10. **Infrastructure as Code** - Todo en código, nada manual
11. **Monitorea todo** - Si no lo mides, no lo puedes mejorar
12. **Security from start** - Seguridad desde el diseño, no después
13. **Small releases** - Entregas pequeñas y frecuentes
14. **Feedback loops** - Retroalimentación constante

### **Operaciones (15-20):**

15. **Immutable infrastructure** - Reemplazar, no reparar
16. **Zero downtime deployments** - Cambios sin afectar usuarios
17. **Disaster recovery plan** - Siempre tener plan B
18. **Documentation as code** - Documentar todo como código
19. **Cost optimization** - Eficiencia en recursos y costos
20. **Continuous learning** - Tecnología evoluciona, tú también

---

## 🌟 **Conclusión: El Futuro es Ahora**

Docker y DevOps no son solo tecnologías, son **filosofías de trabajo** que hacen que desarrollar y operar software sea más eficiente, confiable y escalable.

**Recuerda:**

* **Empieza pequeño** - Un contenedor simple es mejor que una arquitectura compleja que no funciona
* **Practica consistentemente** - 30 minutos diarios son mejor que 8 horas una vez al mes
* **Automatiza gradualmente** - No trates de automatizar todo de una vez
* **Documenta todo** - Tu yo del futuro te lo agradecerá

**El objetivo no es usar todas las herramientas, sino resolver problemas reales con las herramientas correctas.**

---

*"En el mundo del software, como en la vida, los que se adaptan más rápido al cambio son los que sobreviven y prosperan."*

**¡Ahora tienes el mapa para navegar el mundo de Docker y DevOps! El siguiente paso es poner las manos en el código.**
