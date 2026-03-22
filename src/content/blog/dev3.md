---
title: "DevOps"
code: "dev3"
description: "DevOps Masterclass"
pubDate: "Jun 19 2024"
heroImage: "../../assets/blog-placeholder-1.jpg"
---

# 🖥️ MASTERCLASS: Servidores, Alojamiento y Nomenclatura DevOps

> Guía completa desde cero hasta producción — Todo lo que necesitás saber

---

## ÍNDICE

1. [Fundamentos: ¿Qué es un servidor?](#1-fundamentos)
2. [Tipos de alojamiento](#2-tipos-de-alojamiento)
3. [Tipos de servidores por función](#3-tipos-de-servidores-por-función)
4. [Sistemas operativos para servidores](#4-sistemas-operativos-para-servidores)
5. [Virtualización y Contenedores](#5-virtualización-y-contenedores)
6. [Cloud Computing: Proveedores y Servicios](#6-cloud-computing)
7. [Servidores Web y Proxies](#7-servidores-web-y-proxies)
8. [Bases de datos: Tipos y Motores](#8-bases-de-datos)
9. [Redes y Conectividad](#9-redes-y-conectividad)
10. [CI/CD y Automatización DevOps](#10-cicd-y-automatización)
11. [Monitoreo, Logging y Observabilidad](#11-monitoreo-y-observabilidad)
12. [Seguridad en Infraestructura](#12-seguridad)
13. [Arquitecturas modernas](#13-arquitecturas-modernas)
14. [Glosario DevOps completo](#14-glosario-devops)

---

## 1. FUNDAMENTOS

### ¿Qué es un servidor?

Un **servidor** es una computadora (física o virtual) que provee recursos, datos, servicios o programas a otras computadoras llamadas **clientes**, a través de una red. El modelo se conoce como **cliente-servidor**.

```
CLIENTE  ──── request ────►  SERVIDOR
         ◄─── response ────
```

### Métricas clave de un servidor

| Métrica       | Descripción                                                |
| ------------- | ---------------------------------------------------------- |
| **CPU**       | Capacidad de procesamiento (cores, GHz)                    |
| **RAM**       | Memoria volátil de trabajo                                 |
| **Storage**   | Disco: HDD (magnético) / SSD (flash) / NVMe (ultrarrápido) |
| **Bandwidth** | Ancho de banda de red (Mbps / Gbps)                        |
| **Latencia**  | Tiempo de respuesta en ms                                  |
| **Uptime**    | Disponibilidad del servidor (99.9% = ~8.7h de caída/año)   |
| **IOPS**      | Input/Output Operations Per Second — velocidad de disco    |

### SLA y disponibilidad

| Uptime               | Caída permitida/año |
| -------------------- | ------------------- |
| 99%                  | ~3.65 días          |
| 99.9%                | ~8.7 horas          |
| 99.99%               | ~52 minutos         |
| 99.999% (five nines) | ~5 minutos          |

---

## 2. TIPOS DE ALOJAMIENTO

### 2.1 Shared Hosting (Hosting Compartido)

Múltiples sitios web comparten los mismos recursos de un único servidor físico.

- **Ventajas:** Barato, sin gestión técnica, ideal para sitios pequeños
- **Desventajas:** Recursos limitados, efecto "vecino ruidoso", sin root access
- **Usado para:** Blogs, portfolios, sitios de empresas pequeñas
- **Proveedores:** Hostinger, SiteGround, GoDaddy, Bluehost
- **Precio:** $2–$15/mes

### 2.2 VPS — Virtual Private Server

Un servidor físico dividido en múltiples servidores virtuales aislados mediante **hipervisor**.

- **Ventajas:** Root access, recursos garantizados, escalable, aislado
- **Desventajas:** Requiere conocimiento técnico, más caro que shared
- **Usado para:** Aplicaciones web medianas, APIs, bots, proyectos propios
- **Proveedores:** DigitalOcean (Droplets), Linode/Akamai, Vultr, Hetzner, Contabo
- **Precio:** $5–$100/mes

```
Servidor Físico
├── VPS 1 (2 CPU, 4GB RAM, 80GB SSD)
├── VPS 2 (4 CPU, 8GB RAM, 160GB SSD)
└── VPS 3 (1 CPU, 2GB RAM, 40GB SSD)
```

### 2.3 Dedicated Server (Servidor Dedicado)

Un servidor físico completo asignado exclusivamente a un solo cliente.

- **Ventajas:** Máximo rendimiento, total control del hardware, sin vecinos
- **Desventajas:** Caro, requiere administración avanzada, sin escalado ágil
- **Usado para:** Grandes aplicaciones, juegos online, empresas con alta carga
- **Proveedores:** OVH, Hetzner, Liquid Web, Rackspace
- **Precio:** $80–$500+/mes

### 2.4 Cloud Hosting

Infraestructura distribuida en múltiples servidores y datacenters. Se paga por uso real.

- **Ventajas:** Escalado automático, alta disponibilidad, pay-as-you-go
- **Desventajas:** Costos impredecibles, curva de aprendizaje, vendor lock-in
- **Modelos:** IaaS, PaaS, SaaS (ver sección Cloud)
- **Proveedores:** AWS, GCP, Azure, DigitalOcean, Fly.io

### 2.5 Colocation (Colo)

El cliente lleva su propio hardware físico al datacenter del proveedor, quien provee espacio, energía, refrigeración y conectividad.

- **Ventajas:** Hardware propio, conectividad premium, sin alquiler de hardware
- **Desventajas:** Inversión inicial en hardware, sin flexibilidad de escalado rápido
- **Usado para:** Empresas que ya poseen servidores y necesitan conectividad profesional

### 2.6 Serverless / FaaS — Function as a Service

Código que se ejecuta en respuesta a eventos sin gestionar servidores. El proveedor escala automáticamente.

- **Ventajas:** Sin gestión de infraestructura, escala a cero (no pagás si no hay tráfico)
- **Desventajas:** Cold starts, límites de tiempo de ejecución, difícil de debuggear
- **Usado para:** APIs, webhooks, procesamiento de eventos, automatizaciones
- **Servicios:** AWS Lambda, Google Cloud Functions, Cloudflare Workers, Vercel Edge Functions

### 2.7 Edge Computing

Procesamiento de datos cerca del usuario final, en nodos distribuidos geográficamente.

- **Ventajas:** Latencia ultra baja, mejor experiencia de usuario global
- **Desventajas:** Limitaciones de runtime, debugging complejo
- **Servicios:** Cloudflare Workers, Fastly Compute, Vercel Edge, Deno Deploy

### 2.8 Managed Hosting

El proveedor gestiona actualizaciones, seguridad, backups y mantenimiento. Vos solo gestionás tu aplicación.

- **Ejemplos:** Heroku, Railway, Render, Fly.io, WP Engine (WordPress)
- **Ideal para:** Devs que no quieren administrar infraestructura

### 2.9 Bare Metal Cloud

Servidores físicos dedicados pero con la flexibilidad de aprovisionamiento del cloud (minutos, no días).

- **Proveedores:** Equinix Metal, AWS Bare Metal, OVH Bare Metal
- **Usado para:** HPC, ML/AI training, cargas con alto I/O

---

## 3. TIPOS DE SERVIDORES POR FUNCIÓN

### 3.1 Web Server

Sirve contenido HTTP/HTTPS a navegadores y clientes.

- **Software:** Nginx, Apache, Caddy, Lighttpd
- **Protocolo:** HTTP/1.1, HTTP/2, HTTP/3 (QUIC)

### 3.2 Application Server

Ejecuta la lógica de negocio de una aplicación (backend).

- **Ejemplos:** Node.js, Gunicorn (Python), Puma (Ruby), Tomcat (Java), PHP-FPM

### 3.3 Database Server

Almacena y gestiona bases de datos.

- **SQL:** PostgreSQL, MySQL, MariaDB, SQL Server
- **NoSQL:** MongoDB, Redis, Cassandra, DynamoDB

### 3.4 File Server / Storage Server

Almacenamiento y distribución de archivos.

- **Protocolos:** NFS, SMB/CIFS, FTP/SFTP
- **Cloud equivalentes:** AWS S3, Google Cloud Storage, Cloudflare R2

### 3.5 Mail Server

Envío y recepción de correos electrónicos.

- **Componentes:** MTA (Postfix), MDA (Dovecot), MUA (Thunderbird)
- **Protocolos:** SMTP (envío), IMAP/POP3 (recepción)
- **Servicios gestionados:** SendGrid, Mailgun, AWS SES

### 3.6 DNS Server

Resuelve nombres de dominio a direcciones IP.

- **Software:** BIND, PowerDNS, Unbound
- **Cloud:** Cloudflare DNS, AWS Route 53, Google Cloud DNS

### 3.7 Proxy Server

Intermediario entre cliente y servidor. Puede cachear, filtrar y redirigir tráfico.

- **Forward Proxy:** El cliente lo usa para salir a internet (anonimato, filtrado)
- **Reverse Proxy:** Recibe requests del internet y los redirige al backend (Nginx, HAProxy, Traefik)

### 3.8 Load Balancer

Distribuye el tráfico entre múltiples servidores para alta disponibilidad y escalado.

- **Algoritmos:** Round Robin, Least Connections, IP Hash, Weighted
- **Software:** HAProxy, Nginx, Traefik
- **Cloud:** AWS ALB/NLB, GCP Load Balancer, Azure Load Balancer

### 3.9 Cache Server

Almacena respuestas temporalmente para reducir carga y mejorar velocidad.

- **Software:** Redis, Memcached, Varnish
- **CDN:** Cloudflare, Fastly, AWS CloudFront

### 3.10 Message Broker / Queue Server

Gestiona comunicación asíncrona entre servicios mediante colas de mensajes.

- **Software:** RabbitMQ, Apache Kafka, AWS SQS/SNS, Redis Pub/Sub, NATS
- **Usado para:** Microservicios, procesamiento de tareas en background, event streaming

### 3.11 CI/CD Server

Automatiza build, test y deployment de aplicaciones.

- **Software:** Jenkins, GitLab CI, GitHub Actions, CircleCI, TeamCity

### 3.12 Monitoring Server

Recolecta métricas, logs y alertas de infraestructura.

- **Software:** Prometheus, Grafana, ELK Stack, Zabbix, Datadog

### 3.13 VPN Server

Crea redes privadas virtuales para conectar hosts de forma segura.

- **Software:** WireGuard, OpenVPN, StrongSwan, Tailscale

### 3.14 Game Server

Gestiona el estado de partidas y la sincronización entre jugadores.

- **Ejemplos:** Minecraft Server, Dedicated Server de Steam, Agones (Kubernetes para juegos)

---

## 4. SISTEMAS OPERATIVOS PARA SERVIDORES

### 4.1 Linux (dominante en servidores — ~96% del mercado)

| Distro                         | Uso principal                            | Ciclo de vida                       |
| ------------------------------ | ---------------------------------------- | ----------------------------------- |
| **Ubuntu Server**              | General, cloud, devs                     | LTS cada 2 años (5 años de soporte) |
| **Debian**                     | Estabilidad máxima, producción           | Muy largo (~5 años)                 |
| **CentOS / AlmaLinux / Rocky** | Enterprise, reemplazo de RHEL            | AlmaLinux/Rocky: 10 años            |
| **Red Hat (RHEL)**             | Enterprise con soporte pago              | 10 años                             |
| **Alpine Linux**               | Contenedores Docker (imagen mínima ~5MB) | Rolling                             |
| **Arch Linux**                 | Devs avanzados, rolling release          | Rolling                             |
| **Fedora Server**              | Testing de tecnologías nuevas            | ~13 meses                           |
| **NixOS**                      | Infraestructura reproducible             | Rolling                             |

### 4.2 Windows Server

- Windows Server 2019 / 2022
- Usado en entornos Microsoft: Active Directory, IIS, .NET apps
- Más caro en licencias, menor en servidores públicos

### 4.3 FreeBSD / OpenBSD

- Usado en firewalls (pfSense, OPNsense), CDNs (Netflix usa FreeBSD)
- Mayor enfoque en seguridad y networking

---

## 5. VIRTUALIZACIÓN Y CONTENEDORES

### 5.1 Virtualización tradicional (VMs)

Un **hipervisor** crea máquinas virtuales completas con su propio SO.

```
Hardware Físico
└── Hipervisor (Type 1)
    ├── VM 1 → OS + App A
    ├── VM 2 → OS + App B
    └── VM 3 → OS + App C
```

**Hipervisores Tipo 1 (bare-metal):** KVM, VMware ESXi, Hyper-V, Xen
**Hipervisores Tipo 2 (sobre OS):** VirtualBox, VMware Workstation, Parallels

### 5.2 Contenedores (Docker)

Los contenedores comparten el kernel del SO host, son más ligeros y rápidos que VMs.

```
Hardware Físico
└── OS Host (Linux)
    └── Container Runtime (Docker/containerd)
        ├── Contenedor 1 → App A (sin SO completo)
        ├── Contenedor 2 → App B
        └── Contenedor 3 → App C
```

**Conceptos clave de Docker:**

| Término            | Definición                                        |
| ------------------ | ------------------------------------------------- |
| **Image**          | Plantilla inmutable para crear contenedores       |
| **Container**      | Instancia en ejecución de una imagen              |
| **Dockerfile**     | Script para construir una imagen                  |
| **Registry**       | Repositorio de imágenes (Docker Hub, GHCR, ECR)   |
| **Volume**         | Almacenamiento persistente para contenedores      |
| **Network**        | Red virtual entre contenedores                    |
| **Docker Compose** | Orquestación de múltiples contenedores en un host |

**Ejemplo Dockerfile básico:**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### 5.3 Orquestación de Contenedores

#### Kubernetes (K8s)

El estándar industrial para orquestar contenedores a escala.

```
Cluster Kubernetes
├── Control Plane
│   ├── API Server
│   ├── etcd (base de datos del cluster)
│   ├── Scheduler
│   └── Controller Manager
└── Worker Nodes
    ├── Node 1 → kubelet + kube-proxy + Pods
    ├── Node 2 → kubelet + kube-proxy + Pods
    └── Node 3 → kubelet + kube-proxy + Pods
```

**Objetos Kubernetes:**

| Objeto                    | Función                                                    |
| ------------------------- | ---------------------------------------------------------- |
| **Pod**                   | Unidad mínima: 1+ contenedores que comparten red y storage |
| **Deployment**            | Gestiona réplicas y rollouts de Pods                       |
| **Service**               | Expone Pods internamente o externamente con IP estable     |
| **Ingress**               | Enrutamiento HTTP/S externo al cluster                     |
| **ConfigMap**             | Configuración no sensible en clave-valor                   |
| **Secret**                | Datos sensibles encriptados (passwords, API keys)          |
| **PersistentVolume (PV)** | Storage persistente del cluster                            |
| **Namespace**             | Aislamiento lógico dentro del cluster                      |
| **StatefulSet**           | Para apps con estado (databases)                           |
| **DaemonSet**             | Un Pod por nodo (logging, monitoring)                      |
| **CronJob**               | Tareas programadas                                         |
| **HPA**                   | Horizontal Pod Autoscaler — escala automáticamente         |

**Distribuciones K8s gestionadas (managed):**

| Proveedor    | Servicio                         |
| ------------ | -------------------------------- |
| AWS          | EKS (Elastic Kubernetes Service) |
| Google Cloud | GKE (Google Kubernetes Engine)   |
| Azure        | AKS (Azure Kubernetes Service)   |
| DigitalOcean | DOKS                             |
| Self-hosted  | k3s, k0s, RKE2, kubeadm          |

#### Alternativas a Kubernetes

- **Docker Swarm:** Orquestación nativa de Docker, más simple
- **Nomad (HashiCorp):** Orquestador multi-workload (contenedores + VMs + apps nativas)
- **Fly.io:** PaaS basado en contenedores con distribución global automática

---

## 6. CLOUD COMPUTING

### 6.1 Modelos de servicio

```
IaaS ──────────────────────────────────────── SaaS
│                                              │
Vos gestionás más                   Proveedor gestiona más
│                                              │
IaaS → PaaS → CaaS → FaaS → SaaS
```

| Modelo    | Significado                 | Qué gestionás vos            | Ejemplos                    |
| --------- | --------------------------- | ---------------------------- | --------------------------- |
| **IaaS**  | Infrastructure as a Service | OS, runtime, apps, data      | AWS EC2, GCP Compute Engine |
| **PaaS**  | Platform as a Service       | Apps y data                  | Heroku, Railway, App Engine |
| **CaaS**  | Container as a Service      | Contenedores                 | GKE, EKS, AKS               |
| **FaaS**  | Function as a Service       | Solo el código de la función | Lambda, Cloud Functions     |
| **SaaS**  | Software as a Service       | Solo la configuración        | Gmail, Slack, GitHub        |
| **DBaaS** | Database as a Service       | Solo los datos               | RDS, Cloud SQL, PlanetScale |
| **STaaS** | Storage as a Service        | Solo los archivos            | S3, GCS, R2                 |

### 6.2 Los tres grandes proveedores cloud

#### AWS — Amazon Web Services

| Categoría | Servicio       | Descripción                    |
| --------- | -------------- | ------------------------------ |
| Compute   | EC2            | Máquinas virtuales             |
| Compute   | Lambda         | Serverless functions           |
| Compute   | ECS/EKS        | Contenedores                   |
| Storage   | S3             | Object storage                 |
| Storage   | EBS            | Block storage para EC2         |
| Storage   | EFS            | File system compartido         |
| Database  | RDS            | Bases relacionales gestionadas |
| Database  | DynamoDB       | NoSQL serverless               |
| Database  | ElastiCache    | Redis/Memcached gestionado     |
| Network   | VPC            | Red virtual privada            |
| Network   | Route 53       | DNS global                     |
| Network   | CloudFront     | CDN                            |
| Network   | ALB/NLB        | Load balancers                 |
| Security  | IAM            | Identity & Access Management   |
| Security  | KMS            | Key Management Service         |
| DevOps    | CodePipeline   | CI/CD                          |
| DevOps    | CloudFormation | IaC (Infrastructure as Code)   |

#### GCP — Google Cloud Platform

| Servicio        | Equivalente AWS   |
| --------------- | ----------------- |
| Compute Engine  | EC2               |
| Cloud Run       | Fargate + Lambda  |
| GKE             | EKS               |
| Cloud Storage   | S3                |
| Cloud SQL       | RDS               |
| BigQuery        | Redshift / Athena |
| Pub/Sub         | SQS/SNS           |
| Cloud Functions | Lambda            |

#### Azure — Microsoft Azure

| Servicio         | Equivalente AWS |
| ---------------- | --------------- |
| Virtual Machines | EC2             |
| Azure Functions  | Lambda          |
| AKS              | EKS             |
| Blob Storage     | S3              |
| Azure SQL        | RDS             |
| Cosmos DB        | DynamoDB        |
| Service Bus      | SQS             |
| Azure DevOps     | CodePipeline    |

### 6.3 Regiones, Availability Zones y Edge Locations

```
Región (ej: us-east-1)
├── AZ us-east-1a (datacenter físico independiente)
├── AZ us-east-1b
└── AZ us-east-1c

Edge Locations (cientos globalmente) → CDN y DNS
```

- **Región:** Área geográfica con múltiples datacenters (ej: São Paulo, Frankfurt)
- **Availability Zone (AZ):** Datacenter físico aislado dentro de una región
- **Multi-AZ:** Desplegar en múltiples AZs para tolerancia a fallos
- **Multi-Region:** Para disaster recovery y baja latencia global

---

## 7. SERVIDORES WEB Y PROXIES

### 7.1 Nginx

El servidor web más usado en producción. Excelente como reverse proxy y load balancer.

```nginx
# Ejemplo: Reverse proxy con SSL y gzip
server {
    listen 443 ssl http2;
    server_name miapp.com;

    ssl_certificate     /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;

    gzip on;
    gzip_types text/html application/json;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

### 7.2 Apache HTTP Server

El servidor web más antiguo y con más documentación. Usa archivos `.htaccess`.

### 7.3 Caddy

Servidor web moderno con HTTPS automático (Let's Encrypt integrado).

```caddy
# Caddyfile — HTTPS automático sin configuración extra
miapp.com {
    reverse_proxy localhost:3000
}
```

### 7.4 Traefik

Reverse proxy pensado para microservicios y Docker/Kubernetes. Descubrimiento automático de servicios.

### 7.5 HAProxy

High Availability Proxy. Especializado en load balancing de alto rendimiento (L4/L7).

### 7.6 CDN — Content Delivery Network

Red global de servidores que cachean contenido estático cerca del usuario.

| Proveedor          | Características                                |
| ------------------ | ---------------------------------------------- |
| **Cloudflare**     | CDN + DDoS + DNS + WAF, tier gratuito generoso |
| **AWS CloudFront** | Integrado con S3 y AWS                         |
| **Fastly**         | Edge computing avanzado                        |
| **BunnyCDN**       | Económico, muy rápido                          |
| **Vercel Edge**    | Para proyectos Next.js                         |

---

## 8. BASES DE DATOS

### 8.1 Relacionales (SQL)

Usan tablas con esquema fijo, soportan transacciones ACID.

| Motor               | Características                                    | Mejor para                       |
| ------------------- | -------------------------------------------------- | -------------------------------- |
| **PostgreSQL**      | Open source, extensible, JSON nativo, muy completo | Apps generales, datos complejos  |
| **MySQL / MariaDB** | Rápido en lecturas, amplio soporte                 | Web tradicional, WordPress       |
| **SQLite**          | Archivo único, sin servidor                        | Apps embebidas, desarrollo local |
| **SQL Server**      | Microsoft, integración .NET                        | Entornos Windows enterprise      |
| **Oracle DB**       | Enterprise, licencias caras                        | Corporaciones grandes            |

### 8.2 No Relacionales (NoSQL)

#### Document Stores

- **MongoDB:** Documentos JSON/BSON. Flexible, escala horizontal
- **CouchDB / PouchDB:** Sincronización offline-first

#### Key-Value Stores

- **Redis:** Ultra rápido en memoria. Cache, sesiones, colas, pub/sub
- **Memcached:** Cache simple en memoria
- **DynamoDB:** Serverless, escala masiva (AWS)

#### Column Stores (Wide Column)

- **Apache Cassandra:** Alta escritura, distribuida, multi-datacenter
- **ScyllaDB:** Cassandra reescrita en C++ (más rápida)
- **HBase:** Sobre Hadoop

#### Graph Databases

- **Neo4j:** Relaciones complejas, redes sociales, fraud detection
- **ArangoDB:** Multi-modelo (document + graph)

#### Time-Series Databases

- **InfluxDB:** Métricas y eventos temporales
- **TimescaleDB:** PostgreSQL extendido para series de tiempo
- **Prometheus:** Almacenamiento de métricas (pull-based)

#### Search Engines

- **Elasticsearch:** Búsqueda full-text, análisis de logs (ELK Stack)
- **OpenSearch:** Fork open-source de Elasticsearch
- **Meilisearch:** Búsqueda rápida y simple para developers
- **Typesense:** Alternativa a Algolia self-hosted

### 8.3 NewSQL

SQL con escalabilidad horizontal distribuida.

- **CockroachDB:** Distribuida, PostgreSQL-compatible
- **TiDB:** MySQL-compatible, HTAP
- **PlanetScale:** MySQL serverless con branching de schemas

### 8.4 Conceptos de Bases de Datos

| Concepto            | Definición                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| **ACID**            | Atomicity, Consistency, Isolation, Durability                                                       |
| **BASE**            | Basically Available, Soft state, Eventually consistent                                              |
| **CAP Theorem**     | Un sistema distribuido solo puede garantizar 2 de 3: Consistency, Availability, Partition tolerance |
| **Replication**     | Copias de la DB en múltiples nodos                                                                  |
| **Sharding**        | Partición horizontal de datos entre nodos                                                           |
| **Connection Pool** | Pool de conexiones reutilizables (PgBouncer para PostgreSQL)                                        |
| **ORM**             | Object Relational Mapper (Prisma, SQLAlchemy, Hibernate)                                            |
| **Migration**       | Control de versiones del schema de DB                                                               |
| **Index**           | Estructura para acelerar consultas                                                                  |

---

## 9. REDES Y CONECTIVIDAD

### 9.1 Protocolos fundamentales

| Protocolo     | Capa           | Descripción                                |
| ------------- | -------------- | ------------------------------------------ |
| **IP**        | 3 (Red)        | Direccionamiento y routing                 |
| **TCP**       | 4 (Transporte) | Conexión confiable, orientada a stream     |
| **UDP**       | 4 (Transporte) | Sin conexión, rápido, permite pérdida      |
| **HTTP/1.1**  | 7 (Aplicación) | Web, texto plano, una req por conexión     |
| **HTTP/2**    | 7 (Aplicación) | Multiplexing, binario, headers comprimidos |
| **HTTP/3**    | 7 (Aplicación) | Sobre QUIC (UDP), ultra baja latencia      |
| **WebSocket** | 7 (Aplicación) | Comunicación bidireccional en tiempo real  |
| **gRPC**      | 7 (Aplicación) | RPC sobre HTTP/2, Protocol Buffers         |
| **MQTT**      | 7 (Aplicación) | Pub/Sub para IoT, ultra ligero             |

### 9.2 DNS y Dominios

```
FQDN: api.prod.miempresa.com
       │    │    └─ TLD
       │    └─ dominio
       │     └─ subdominio
       └─ sub-subdominio
```

**Registros DNS:**

| Registro  | Función                                    | Ejemplo                   |
| --------- | ------------------------------------------ | ------------------------- |
| **A**     | Dominio → IPv4                             | `miapp.com → 1.2.3.4`     |
| **AAAA**  | Dominio → IPv6                             | `miapp.com → 2001:db8::1` |
| **CNAME** | Alias a otro dominio                       | `www → miapp.com`         |
| **MX**    | Servidor de correo                         | `mail.miapp.com`          |
| **TXT**   | Texto arbitrario (SPF, DKIM, verificación) |                           |
| **NS**    | Name servers del dominio                   |                           |
| **SRV**   | Servicio específico (puerto, protocolo)    |                           |
| **CAA**   | Autoridades de certificados permitidas     |                           |

### 9.3 Puertos comunes

| Puerto | Protocolo / Servicio |
| ------ | -------------------- |
| 22     | SSH                  |
| 25     | SMTP                 |
| 53     | DNS (UDP/TCP)        |
| 80     | HTTP                 |
| 443    | HTTPS                |
| 3306   | MySQL/MariaDB        |
| 5432   | PostgreSQL           |
| 6379   | Redis                |
| 27017  | MongoDB              |
| 8080   | HTTP alternativo     |
| 8443   | HTTPS alternativo    |

### 9.4 Firewall y Seguridad de Red

- **iptables / nftables:** Firewall de Linux a nivel de kernel
- **ufw:** Frontend amigable para iptables (Ubuntu)
- **firewalld:** Para RHEL/CentOS
- **Security Groups (AWS):** Firewall virtual por instancia
- **Network ACLs (AWS):** Firewall a nivel de subred
- **WAF:** Web Application Firewall (filtra tráfico HTTP malicioso)

### 9.5 VPC y Redes Privadas en Cloud

```
VPC: 10.0.0.0/16
├── Subnet Pública:  10.0.1.0/24 → Internet Gateway → Internet
│   └── Load Balancer, NAT Gateway
└── Subnet Privada:  10.0.2.0/24 → Sin acceso directo a internet
    └── App servers, Databases
```

- **CIDR:** Classless Inter-Domain Routing (ej: 10.0.0.0/16)
- **NAT Gateway:** Permite que instancias privadas salgan a internet sin ser accesibles
- **Peering:** Conexión entre dos VPCs
- **VPN Gateway:** Conexión segura entre datacenter on-premise y cloud

---

## 10. CI/CD Y AUTOMATIZACIÓN

### 10.1 Pipeline CI/CD

```
Developer → Push código → CI/CD Pipeline
                              │
                    ┌─────────▼─────────┐
                    │  1. Build          │
                    │  2. Test (unit)    │
                    │  3. Test (integr.) │
                    │  4. Security scan  │
                    │  5. Build image    │
                    │  6. Push registry  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Deploy Staging   │
                    │  Smoke tests      │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Deploy Producción│
                    │  (manual o auto)  │
                    └───────────────────┘
```

### 10.2 Herramientas CI/CD

| Herramienta        | Tipo               | Características                           |
| ------------------ | ------------------ | ----------------------------------------- |
| **GitHub Actions** | SaaS/Cloud         | Integrado con GitHub, YAML, marketplace   |
| **GitLab CI/CD**   | Self-hosted/Cloud  | Completo, runners propios                 |
| **Jenkins**        | Self-hosted        | El más veterano, muy extensible, complejo |
| **CircleCI**       | SaaS               | Rápido, buena integración                 |
| **ArgoCD**         | GitOps para K8s    | Sincroniza manifiestos Git con K8s        |
| **Flux**           | GitOps para K8s    | Alternativa a ArgoCD                      |
| **Tekton**         | Cloud-native CI/CD | Pipeline nativo de K8s                    |

### 10.3 Infrastructure as Code (IaC)

Gestionar infraestructura mediante código versionable.

| Herramienta            | Tipo                     | Descripción                                 |
| ---------------------- | ------------------------ | ------------------------------------------- |
| **Terraform**          | IaC multi-cloud          | Declarativo, HCL, estado en archivo tfstate |
| **Pulumi**             | IaC multi-cloud          | Como Terraform pero con Python/TS/Go        |
| **AWS CloudFormation** | IaC AWS                  | YAML/JSON nativo de AWS                     |
| **AWS CDK**            | IaC AWS                  | CloudFormation con código real (TypeScript) |
| **Ansible**            | Configuration Management | YAML, agentless, SSH, idempotente           |
| **Chef / Puppet**      | Configuration Management | Más complejos, con agentes                  |

### 10.4 Estrategias de Deployment

| Estrategia         | Descripción                              | Pros / Contras                    |
| ------------------ | ---------------------------------------- | --------------------------------- |
| **Rolling Update** | Reemplaza instancias una a una           | Sin downtime, rollback lento      |
| **Blue/Green**     | Dos entornos idénticos, swap del tráfico | Rollback instantáneo, doble costo |
| **Canary**         | Envía % del tráfico a la nueva versión   | Reduce riesgo, complejo de medir  |
| **A/B Testing**    | Variantes para segmentos de usuarios     | Requiere feature flags            |
| **Recreate**       | Baja todo, sube la nueva versión         | Simple, tiene downtime            |
| **Shadow**         | Duplica tráfico real a la nueva versión  | Sin impacto real, costoso         |

### 10.5 GitOps

Paradigma donde el estado deseado de la infraestructura y las apps está definido en Git. Cualquier cambio se hace via PR/MR.

- **Herramientas:** ArgoCD, Flux, Weave GitOps
- **Principios:** Git como single source of truth, reconciliación continua

---

## 11. MONITOREO Y OBSERVABILIDAD

### 11.1 Los tres pilares de la Observabilidad

```
Observabilidad
├── Metrics  → ¿Qué está pasando? (números, KPIs)
├── Logs     → ¿Por qué pasó? (eventos textuales)
└── Traces   → ¿Dónde pasó? (flujo entre servicios)
```

### 11.2 Stack de Monitoreo

#### Prometheus + Grafana (el stack open-source estándar)

```
App → Exporters → Prometheus (scrape) → Grafana (visualización)
                       └→ Alertmanager → PagerDuty / Slack
```

- **Prometheus:** Base de datos de métricas time-series con PromQL
- **Grafana:** Dashboards y visualizaciones
- **Alertmanager:** Gestión de alertas

#### ELK / EFK Stack (logging)

```
App → Filebeat/Fluentd → Logstash/Fluentd → Elasticsearch → Kibana
```

- **Elasticsearch:** Motor de búsqueda e indexación de logs
- **Logstash:** Pipeline de procesamiento de logs
- **Kibana:** Visualización de logs
- **Filebeat:** Agente ligero para recolección de logs
- **Fluentd / Fluent Bit:** Alternativas a Logstash (más eficientes)

#### Distributed Tracing

- **Jaeger:** Tracing distribuido open-source
- **Zipkin:** Tracing distribuido (Twitter)
- **OpenTelemetry (OTel):** Estándar abierto para instrumentación

### 11.3 Soluciones SaaS de Observabilidad

| Plataforma        | Categoría      | Características                           |
| ----------------- | -------------- | ----------------------------------------- |
| **Datadog**       | All-in-one     | Métricas, logs, APM, trazas, muy completo |
| **New Relic**     | APM + infra    | Application Performance Monitoring        |
| **Grafana Cloud** | Hosted stack   | Prometheus + Loki + Tempo gestionados     |
| **Sentry**        | Error tracking | Captura y rastreo de errores en apps      |
| **Uptimerobot**   | Uptime         | Monitoreo de disponibilidad simple        |
| **Better Uptime** | Status pages   | Monitoreo + status page pública           |

### 11.4 Métricas clave (SLI/SLO/SLA)

| Sigla            | Significado                                      | Ejemplo                                      |
| ---------------- | ------------------------------------------------ | -------------------------------------------- |
| **SLI**          | Service Level Indicator                          | "Latencia p99 = 250ms"                       |
| **SLO**          | Service Level Objective                          | "p99 < 300ms el 99.9% del tiempo"            |
| **SLA**          | Service Level Agreement                          | Contrato formal con penalidades              |
| **Error Budget** | Margen de error permitido antes de violar el SLO |                                              |
| **MTTR**         | Mean Time To Recovery                            | Tiempo promedio para recuperarse de un fallo |
| **MTBF**         | Mean Time Between Failures                       | Tiempo promedio entre fallos                 |

---

## 12. SEGURIDAD

### 12.1 Principios fundamentales

- **Least Privilege:** Cada proceso/usuario tiene solo los permisos mínimos necesarios
- **Defense in Depth:** Múltiples capas de seguridad
- **Zero Trust:** No confiar en nadie por defecto, verificar siempre
- **Shift Left:** Integrar seguridad desde el desarrollo, no al final

### 12.2 SSL/TLS y Certificados

```
Cliente ──── TLS Handshake ────► Servidor
               (cifrado)
               └── Certificado X.509
                   ├── Dominio
                   ├── Entidad emisora (CA)
                   └── Fecha de expiración
```

- **CA (Certificate Authority):** Let's Encrypt (gratuito), DigiCert, Sectigo
- **Tipos:** DV (Domain Validation), OV (Organization), EV (Extended)
- **Wildcard cert:** `*.midominio.com` — cubre todos los subdominios

### 12.3 Autenticación y Autorización

| Mecanismo     | Descripción                                               |
| ------------- | --------------------------------------------------------- |
| **API Keys**  | Token estático para identificar clientes                  |
| **JWT**       | JSON Web Token — token firmado con claims                 |
| **OAuth 2.0** | Delegación de autorización (Login con Google)             |
| **OIDC**      | OpenID Connect — capa de identidad sobre OAuth 2.0        |
| **mTLS**      | Mutual TLS — autenticación bidireccional con certificados |
| **SSH Keys**  | Par de claves pública/privada para acceso SSH             |
| **RBAC**      | Role-Based Access Control                                 |
| **ABAC**      | Attribute-Based Access Control                            |

### 12.4 Gestión de Secretos

- **HashiCorp Vault:** Gestión de secretos, cifrado, PKI self-hosted
- **AWS Secrets Manager / Parameter Store:** Secretos gestionados en AWS
- **Doppler:** SaaS para gestión de secrets multi-entorno
- **Sealed Secrets:** Secrets encriptados para Kubernetes

### 12.5 Hardening y Seguridad de Servidores

- Deshabilitar acceso root por SSH (`PermitRootLogin no`)
- Usar SSH con llaves, no contraseñas (`PasswordAuthentication no`)
- Configurar `fail2ban` para bloquear fuerza bruta
- Mantener el sistema actualizado (`apt upgrade`, `yum update`)
- Usar firewalls (ufw, iptables) con política deny-by-default
- Monitorear con `auditd` los accesos y cambios del sistema

### 12.6 Container Security

- Usar imágenes base mínimas (Alpine, Distroless)
- No correr contenedores como root
- Escanear imágenes con Trivy, Snyk, Docker Scout
- Usar read-only filesystems donde sea posible
- Implementar Pod Security Standards en Kubernetes

---

## 13. ARQUITECTURAS MODERNAS

### 13.1 Monolito vs Microservicios vs Serverless

```
MONOLITO                MICROSERVICIOS           SERVERLESS
─────────               ──────────────           ──────────
┌─────────┐             ┌────┐ ┌────┐            λ λ λ λ
│         │             │Auth│ │Pay │            Funciones
│  Todo   │             └────┘ └────┘            individuales
│  junto  │             ┌────┐ ┌────┐            activadas
│         │             │Cart│ │Notif│           por eventos
└─────────┘             └────┘ └────┘

Simple al inicio        Escala independiente     Sin infra
Difícil de escalar      Complejidad operativa    Cold starts
Deployments lentos      Deployments ágiles       Pay per request
```

### 13.2 Event-Driven Architecture (EDA)

Las aplicaciones se comunican mediante eventos asíncronos en lugar de llamadas directas.

```
Servicio A → publica evento → Message Broker → consume → Servicio B
                                              → consume → Servicio C
```

- **Herramientas:** Kafka, RabbitMQ, AWS EventBridge, Google Pub/Sub

### 13.3 Service Mesh

Capa de infraestructura que gestiona la comunicación entre microservicios (mTLS, observabilidad, circuit breaking).

- **Istio:** El más completo, complejo
- **Linkerd:** Más simple y ligero
- **Consul Connect:** De HashiCorp

### 13.4 Patrones DevOps importantes

| Patrón              | Descripción                                                 |
| ------------------- | ----------------------------------------------------------- |
| **Circuit Breaker** | Corta llamadas a servicios fallidos para evitar cascadas    |
| **Retry + Backoff** | Reintentos con espera exponencial                           |
| **Bulkhead**        | Aislamiento de recursos por servicio                        |
| **Sidecar**         | Contenedor auxiliar junto al principal (ej: Envoy en Istio) |
| **Strangler Fig**   | Migración gradual de monolito a microservicios              |
| **Saga Pattern**    | Transacciones distribuidas mediante eventos                 |
| **CQRS**            | Command Query Responsibility Segregation                    |
| **Event Sourcing**  | El estado se reconstruye a partir de eventos                |

### 13.5 Inmutable Infrastructure

En lugar de actualizar servidores existentes, se crean nuevos con la configuración nueva y se destruyen los viejos.

```
Versión 1 ──► deploy ──► Versión 2 (nuevo servidor)
                └──► destroy Versión 1
```

- **Herramientas:** Packer (builds de imágenes), Terraform, AMIs en AWS

---

## 14. GLOSARIO DEVOPS

### A

| Término         | Definición                                                         |
| --------------- | ------------------------------------------------------------------ |
| **ACL**         | Access Control List — lista de reglas de acceso a recursos         |
| **Agentless**   | Sin agente instalado en el nodo administrado (ej: Ansible vía SSH) |
| **ALB**         | Application Load Balancer — L7, enruta por path/host               |
| **AMI**         | Amazon Machine Image — imagen de VM en AWS                         |
| **Ansible**     | Herramienta de automatización y configuration management           |
| **API Gateway** | Punto de entrada unificado para APIs (authn, rate limit, routing)  |
| **APM**         | Application Performance Monitoring                                 |
| **Artifact**    | Binario o paquete resultante de un build (JAR, Docker image, ZIP)  |
| **Autoscaling** | Escalar automáticamente recursos según demanda                     |

### B

| Término                      | Definición                                                          |
| ---------------------------- | ------------------------------------------------------------------- |
| **Bastion Host / Jump Host** | Servidor intermedio para acceder a instancias privadas via SSH      |
| **BGP**                      | Border Gateway Protocol — protocolo de routing inter-AS en internet |
| **Blue/Green**               | Estrategia de deploy con dos entornos alternados                    |
| **Build**                    | Proceso de compilar o empaquetar código en un artefacto             |

### C

| Término               | Definición                                                   |
| --------------------- | ------------------------------------------------------------ |
| **Canary Deployment** | Deploy gradual a un subconjunto de usuarios                  |
| **CDN**               | Content Delivery Network                                     |
| **CI/CD**             | Continuous Integration / Continuous Delivery (o Deployment)  |
| **CIDR**              | Classless Inter-Domain Routing — notación de rangos IP       |
| **Cluster**           | Grupo de servidores que trabajan como una unidad             |
| **CRD**               | Custom Resource Definition — extensión del API de Kubernetes |
| **cron**              | Programador de tareas basado en tiempo en Unix/Linux         |

### D

| Término        | Definición                                              |
| -------------- | ------------------------------------------------------- |
| **DaemonSet**  | Objeto K8s que corre un Pod en cada nodo del cluster    |
| **DevOps**     | Cultura y prácticas que unen desarrollo y operaciones   |
| **DevSecOps**  | DevOps con seguridad integrada desde el inicio          |
| **DKIM**       | DomainKeys Identified Mail — firma digital de correos   |
| **DNS**        | Domain Name System                                      |
| **Docker**     | Plataforma de contenedores                              |
| **Dockerfile** | Script para construir una imagen Docker                 |
| **DR**         | Disaster Recovery — plan de recuperación ante desastres |

### E

| Término      | Definición                                                   |
| ------------ | ------------------------------------------------------------ |
| **EBS**      | Elastic Block Store — disco persistente en AWS               |
| **EC2**      | Elastic Compute Cloud — VMs en AWS                           |
| **Egress**   | Tráfico que sale de la red/nodo                              |
| **Endpoint** | URL o dirección de acceso a un servicio                      |
| **etcd**     | Base de datos clave-valor distribuida, cerebro de Kubernetes |

### F

| Término          | Definición                                                  |
| ---------------- | ----------------------------------------------------------- |
| **Failover**     | Conmutación automática a sistema redundante ante fallo      |
| **Feature Flag** | Switch para activar/desactivar funcionalidades sin redeploy |
| **Fingerprint**  | Hash o firma única de una clave SSH o certificado           |
| **FTP / SFTP**   | File Transfer Protocol / Secure FTP                         |

### G

| Término          | Definición                                               |
| ---------------- | -------------------------------------------------------- |
| **GitOps**       | Paradigma donde Git es la fuente de verdad para la infra |
| **Golden Image** | Imagen base pre-configurada y aprobada para producción   |
| **gRPC**         | Framework de RPC de Google sobre HTTP/2                  |

### H

| Término                    | Definición                                               |
| -------------------------- | -------------------------------------------------------- |
| **HA (High Availability)** | Alta disponibilidad — sin SPOF (Single Point of Failure) |
| **Hardening**              | Proceso de asegurar y reducir la superficie de ataque    |
| **HCL**                    | HashiCorp Configuration Language — lenguaje de Terraform |
| **Helm**                   | Gestor de paquetes para Kubernetes (charts)              |
| **Horizontal Scaling**     | Agregar más nodos/instancias                             |
| **HPA**                    | Horizontal Pod Autoscaler en Kubernetes                  |

### I

| Término                      | Definición                                                    |
| ---------------------------- | ------------------------------------------------------------- |
| **IaC**                      | Infrastructure as Code                                        |
| **IAM**                      | Identity and Access Management                                |
| **Idempotente**              | Una operación que aplicada N veces produce el mismo resultado |
| **Image**                    | Plantilla inmutable para crear contenedores o VMs             |
| **Immutable Infrastructure** | Infraestructura que nunca se modifica, solo se reemplaza      |
| **Ingress**                  | Tráfico entrante / objeto K8s para HTTP routing externo       |
| **IOPS**                     | Input/Output Operations Per Second                            |
| **IP Whitelisting**          | Permitir acceso solo a IPs específicas                        |

### J / K

| Término     | Definición                                         |
| ----------- | -------------------------------------------------- |
| **JWT**     | JSON Web Token                                     |
| **K8s**     | Abreviatura de Kubernetes (8 letras entre K y s)   |
| **Kubelet** | Agente que corre en cada nodo Worker de Kubernetes |
| **kubectl** | CLI para interactuar con Kubernetes                |

### L

| Término             | Definición                                  |
| ------------------- | ------------------------------------------- |
| **Latency**         | Tiempo de respuesta de un sistema           |
| **LB**              | Load Balancer                               |
| **Let's Encrypt**   | CA gratuita para certificados TLS           |
| **Log Aggregation** | Centralización de logs de múltiples fuentes |

### M

| Término             | Definición                                                    |
| ------------------- | ------------------------------------------------------------- |
| **Managed Service** | Servicio donde el proveedor gestiona el mantenimiento         |
| **Manifest**        | Archivo YAML/JSON que describe el estado deseado en K8s       |
| **Message Queue**   | Cola de mensajes asíncronos entre servicios                   |
| **Microservices**   | Arquitectura de servicios pequeños independientes             |
| **Middleware**      | Software que conecta/adapta componentes de un sistema         |
| **Multi-tenancy**   | Una instancia de software sirve a múltiples clientes aislados |

### N / O

| Término                  | Definición                                                     |
| ------------------------ | -------------------------------------------------------------- |
| **Namespace**            | Aislamiento lógico de recursos (Linux, Kubernetes)             |
| **NAT**                  | Network Address Translation                                    |
| **NLB**                  | Network Load Balancer — L4, TCP/UDP, ultra baja latencia       |
| **Node**                 | Servidor físico o virtual en un cluster                        |
| **Observability**        | Capacidad de entender el estado interno desde outputs externos |
| **On-premise (on-prem)** | Infraestructura física propia del cliente                      |
| **Orchestration**        | Gestión automatizada de contenedores/servicios                 |
| **ORM**                  | Object-Relational Mapper                                       |

### P

| Término                 | Definición                                                |
| ----------------------- | --------------------------------------------------------- |
| **PaaS**                | Platform as a Service                                     |
| **Pod**                 | Unidad mínima de Kubernetes                               |
| **PodDisruptionBudget** | Garantía mínima de Pods disponibles durante mantenimiento |
| **Port Forwarding**     | Redirigir tráfico de un puerto a otro                     |
| **Prometheus**          | Sistema de monitoreo y alertas open-source                |
| **Proxy**               | Intermediario entre cliente y servidor                    |

### R

| Término             | Definición                                                |
| ------------------- | --------------------------------------------------------- |
| **RBAC**            | Role-Based Access Control                                 |
| **Redis**           | Base de datos in-memory clave-valor                       |
| **Registry**        | Repositorio de imágenes de contenedores                   |
| **Replica**         | Copia de un Pod/servicio para HA y escalado               |
| **Resource Limits** | Límites de CPU/RAM asignados a un contenedor              |
| **Reverse Proxy**   | Proxy que recibe tráfico externo y lo redirige al backend |
| **Rolling Update**  | Actualización gradual de instancias sin downtime          |
| **Runtime**         | Entorno de ejecución (Node.js runtime, container runtime) |

### S

| Término          | Definición                                             |
| ---------------- | ------------------------------------------------------ |
| **S3**           | Simple Storage Service — object storage de AWS         |
| **Scaling**      | Horizontal (más nodos) o Vertical (más CPU/RAM)        |
| **Secret**       | Dato sensible gestionado de forma segura               |
| **Service Mesh** | Infraestructura para comunicación entre microservicios |
| **Sidecar**      | Contenedor auxiliar junto al principal en un Pod       |
| **SIEM**         | Security Information and Event Management              |
| **SLA**          | Service Level Agreement                                |
| **SLI / SLO**    | Service Level Indicator / Objective                    |
| **SPOF**         | Single Point of Failure                                |
| **SSH**          | Secure Shell — protocolo de acceso remoto seguro       |
| **SSL/TLS**      | Capa de cifrado para comunicaciones                    |
| **StatefulSet**  | Objeto K8s para apps con estado (bases de datos)       |

### T / V / W

| Término              | Definición                                                  |
| -------------------- | ----------------------------------------------------------- |
| **Terraform**        | Herramienta IaC multi-cloud                                 |
| **Throughput**       | Volumen de datos o requests procesados por unidad de tiempo |
| **TTL**              | Time To Live — tiempo de vida de un registro/caché          |
| **Vertical Scaling** | Aumentar CPU/RAM de una instancia existente                 |
| **Volume**           | Almacenamiento persistente para contenedores                |
| **VPC**              | Virtual Private Cloud                                       |
| **VPN**              | Virtual Private Network                                     |
| **WAF**              | Web Application Firewall                                    |
| **Webhook**          | HTTP callback disparado por un evento                       |
| **Worker Node**      | Nodo que ejecuta Pods en Kubernetes                         |

---

## MAPA MENTAL: ¿Qué usar para cada caso?

```
¿Qué necesito alojar?
│
├── Sitio web estático (HTML/CSS/JS)
│   └── → S3 + CloudFront / Vercel / Netlify / Cloudflare Pages
│
├── App web con backend simple
│   └── → Railway / Render / Fly.io / Heroku (PaaS)
│
├── API o microservicio
│   ├── Sin infra propia → Lambda / Cloud Run / Vercel Functions
│   └── Con control → VPS (DigitalOcean) + Docker + Nginx
│
├── App con múltiples servicios
│   ├── Pequeña → Docker Compose en VPS
│   └── Grande → Kubernetes (EKS, GKE, AKS)
│
├── Base de datos
│   ├── Sin gestión → RDS / PlanetScale / Supabase / Neon
│   └── Propia → PostgreSQL / MySQL en VPS con backups
│
├── Archivos y media
│   └── → S3 / Cloudflare R2 / Backblaze B2
│
├── Alta carga / enterprise
│   └── → Dedicated servers + CDN + Multi-region + K8s
│
└── Automatizaciones / cron jobs / bots
    ├── Simple → VPS con systemd timers / cron
    ├── Cloud → AWS Lambda + EventBridge / Cloud Scheduler
    └── Complejo → Temporal.io / n8n / Airflow
```

---

_Guía creada para dominar el ecosistema DevOps desde los fundamentos hasta producción._
_Última actualización: 2026_
