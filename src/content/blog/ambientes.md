---
title: 'Masterclass: Ambientes de Desarrollo IT y Mejores Prácticas'
code: 'Devops'
description: 'Masterclass: Ambientes de Desarrollo IT y Mejores Prácticas'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
# Masterclass: Ambientes de Desarrollo IT y Mejores Prácticas

## 📚 Índice

1. [¿Qué son los ambientes de desarrollo? La analogía del teatro](#que-son-ambientes)
2. [Los 4 pilares fundamentales del desarrollo profesional](#pilares-fundamentales)
3. [Ambiente Local: Tu taller personal](#ambiente-local)
4. [Ambiente de Desarrollo: El laboratorio del equipo](#ambiente-desarrollo)
5. [Ambiente de Testing/QA: La sala de pruebas](#ambiente-testing)
6. [Ambiente de Staging: El ensayo general](#ambiente-staging)
7. [Ambiente de Producción: El escenario principal](#ambiente-produccion)
8. [Control de versiones: La máquina del tiempo](#control-versiones)
9. [CI/CD: La línea de ensamblaje automatizada](#ci-cd)
10. [Configuration Management: El gestor de secretos](#configuration-management)
11. [Monitoring y Logging: Los sistemas de vigilancia](#monitoring-logging)
12. [Security: Los sistemas de seguridad](#security)
13. [Code Review: El comité de calidad](#code-review)
14. [Documentation: La biblioteca del conocimiento](#documentation)
15. [Team Collaboration: La orquesta sinfónica](#team-collaboration)
16. [Disaster Recovery: El plan de emergencia](#disaster-recovery)
17. [Performance: La optimización continua](#performance)
18. [Proyecto práctico: Configurando un pipeline completo](#proyecto-practico)
19. [Checklist de mejores prácticas](#checklist-mejores-practicas)

---

## 🎭 ¿Qué son los ambientes de desarrollo? La analogía del teatro {#que-son-ambientes}

Imagina que desarrollar software es como **producir una obra de teatro**:

### 🏠 **Local** - Tu casa/estudio personal
- Donde **practicas tu parte** individualmente
- Experimentas con nuevas ideas sin presión
- Cometes errores sin consecuencias públicas

### 🧪 **Development** - El local de ensayos del grupo
- Donde el **equipo practica junto** por primera vez
- Se integran las partes individuales
- Se detectan problemas de coordinación

### 🔍 **Testing/QA** - La sala de pruebas con director
- Donde un **director externo evalúa** la obra
- Se prueban todos los escenarios posibles
- Se refinan los detalles

### 🎪 **Staging** - El ensayo general en el teatro real
- **Réplica exacta** del ambiente de producción
- Última oportunidad para detectar problemas
- Prueba final antes del estreno

### 🎬 **Production** - El estreno ante el público
- Donde está el **público real pagando**
- Cero tolerancia a errores
- Performance y estabilidad críticas

### ¿Por qué son importantes?

```mermaid
graph TD
    A[Desarrollador] --> B[Local]
    B --> C[Development]
    C --> D[Testing/QA]
    D --> E[Staging]
    E --> F[Production]
    
    G[Bug encontrado en Local] --> H[Costo: $1]
    I[Bug encontrado en Testing] --> J[Costo: $10]
    K[Bug encontrado en Staging] --> L[Costo: $100]
    M[Bug encontrado en Production] --> N[Costo: $10,000]
```

---

## 🏛️ Los 4 pilares fundamentales del desarrollo profesional {#pilares-fundamentales}

### 1. **Consistencia** (Como un protocolo médico)
- Mismos procesos en todos los ambientes
- Configuraciones reproducibles
- Resultados predecibles

### 2. **Aislamiento** (Como departamentos de un hospital)
- Cambios en un ambiente no afectan otros
- Recursos dedicados y separados
- Fallos contenidos

### 3. **Automatización** (Como una línea de ensamblaje)
- Procesos manuales = errores humanos
- Scripts y pipelines automatizados
- Deployments con un click

### 4. **Observabilidad** (Como el panel de control de un avión)
- Métricas en tiempo real
- Logs estructurados
- Alertas proactivas

---

## 🏠 Ambiente Local: Tu taller personal {#ambiente-local}

Tu ambiente local es como tu **taller personal de carpintería**. Aquí experimentas, pruebas ideas y construyes sin molestar a nadie.

### Configuración básica

```bash
# .envrc (usando direnv para gestión automática de variables)
#!/bin/bash

# Variables de ambiente local
export NODE_ENV=development
export PORT=3000
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=myapp_dev
export DB_USER=developer
export DB_PASSWORD=dev_password

# APIs de desarrollo
export API_BASE_URL=http://localhost:3000
export EXTERNAL_API_KEY=dev_key_1234

# Configuraciones de desarrollo
export LOG_LEVEL=debug
export ENABLE_CORS=true
export JWT_SECRET=super_secret_dev_key

echo "🚀 Ambiente local configurado"
```

### Docker Compose para desarrollo local

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  # Base de datos local
  postgres:
    image: postgres:15
    container_name: myapp_postgres_dev
    environment:
      POSTGRES_DB: myapp_dev
      POSTGRES_USER: developer
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql

  # Redis para caching local
  redis:
    image: redis:7-alpine
    container_name: myapp_redis_dev
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_dev_data:/data

  # Elasticsearch local para búsquedas
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    container_name: myapp_elasticsearch_dev
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_dev_data:/usr/share/elasticsearch/data

  # Aplicación principal
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: myapp_dev
    ports:
      - "3000:3000"
      - "9229:9229" # Puerto de debugging
    volumes:
      - .:/app
      - /app/node_modules # Evitar conflictos con node_modules del host
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
      - REDIS_HOST=redis
      - ELASTICSEARCH_HOST=elasticsearch
    depends_on:
      - postgres
      - redis
      - elasticsearch
    command: npm run start:debug

volumes:
  postgres_dev_data:
  redis_dev_data:
  elasticsearch_dev_data:
```

### Scripts de desarrollo útiles

```json
// package.json
{
  "scripts": {
    "dev:setup": "docker-compose -f docker-compose.dev.yml up -d",
    "dev:start": "concurrently \"npm run dev:setup\" \"npm run start:dev\"",
    "dev:stop": "docker-compose -f docker-compose.dev.yml down",
    "dev:clean": "docker-compose -f docker-compose.dev.yml down -v",
    "dev:logs": "docker-compose -f docker-compose.dev.yml logs -f",
    "dev:shell": "docker-compose -f docker-compose.dev.yml exec app sh",
    "dev:db:seed": "npm run typeorm migration:run && npm run seed:run",
    "dev:test": "jest --watch --detectOpenHandles",
    "dev:test:e2e": "jest --config ./test/jest-e2e.json --watch",
    "dev:lint:fix": "eslint --fix . && prettier --write .",
    "dev:analyze": "npm run build && npm run bundle-analyzer"
  }
}
```

### Herramientas de desarrollo esenciales

```bash
# Makefile para comandos comunes
.PHONY: setup start stop clean test lint

setup:
	@echo "🔧 Configurando ambiente de desarrollo..."
	npm install
	docker-compose -f docker-compose.dev.yml up -d
	sleep 10
	npm run dev:db:seed
	@echo "✅ Ambiente listo!"

start:
	@echo "🚀 Iniciando aplicación..."
	npm run dev:start

stop:
	@echo "🛑 Deteniendo servicios..."
	npm run dev:stop

clean:
	@echo "🧹 Limpiando ambiente..."
	npm run dev:clean
	docker system prune -f
	npm run cache:clear

test:
	@echo "🧪 Ejecutando tests..."
	npm run test:unit
	npm run test:integration
	npm run test:e2e

lint:
	@echo "🔍 Verificando código..."
	npm run lint
	npm run type-check
	npm run security-check

health:
	@echo "🏥 Verificando salud del sistema..."
	curl -f http://localhost:3000/health || exit 1
	docker-compose -f docker-compose.dev.yml ps
```

---

## 🧪 Ambiente de Desarrollo: El laboratorio del equipo {#ambiente-desarrollo}

El ambiente de desarrollo es como un **laboratorio compartido** donde el equipo integra su trabajo y experimenta con nuevas features.

### Configuración de servidor de desarrollo

```yaml
# docker-compose.development.yml
version: '3.8'

services:
  traefik:
    image: traefik:v3.0
    container_name: traefik_dev
    command:
      - --api.insecure=true
      - --providers.docker=true
      - --entrypoints.web.address=:80
    ports:
      - "80:80"
      - "8080:8080" # Dashboard de Traefik
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    labels:
      - "traefik.enable=true"

  app:
    build:
      context: .
      dockerfile: Dockerfile.development
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`myapp.dev.local`)"
      - "traefik.http.services.app.loadbalancer.server.port=3000"
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
    depends_on:
      - postgres
    volumes:
      - .:/app
    deploy:
      replicas: 2 # Para probar load balancing

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp_development
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    labels:
      - "traefik.enable=false"

volumes:
  postgres_dev_data:
```

### Pipeline de integración continua

```yaml
# .github/workflows/development.yml
name: Development Environment

on:
  push:
    branches: [develop]
  pull_request:
    branches: [develop]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: |
          npm run lint
          npm run type-check

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Build application
        run: npm run build

      - name: Run security audit
        run: npm audit --audit-level high

  deploy-dev:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to development
        run: |
          echo "🚀 Deploying to development environment..."
          # Aquí iría tu script de deployment
          ./scripts/deploy-development.sh

      - name: Run smoke tests
        run: |
          echo "🧪 Running smoke tests..."
          npm run test:smoke -- --env=development

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#dev-notifications'
          text: |
            🚀 Development deployment completed!
            📍 Environment: https://myapp.dev.company.com
            🔗 Commit: ${{ github.sha }}
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Auto-deployment script

```bash
#!/bin/bash
# scripts/deploy-development.sh

set -e

echo "🚀 Starting development deployment..."

# Variables
APP_NAME="myapp"
ENVIRONMENT="development"
DOCKER_REGISTRY="registry.company.com"
IMAGE_TAG="${GITHUB_SHA:-latest}"

# Build y push de imagen
echo "📦 Building Docker image..."
docker build -t ${DOCKER_REGISTRY}/${APP_NAME}:${IMAGE_TAG} .
docker push ${DOCKER_REGISTRY}/${APP_NAME}:${IMAGE_TAG}

# Deployment usando Docker Swarm o Kubernetes
echo "🔄 Updating service..."
if command -v kubectl &> /dev/null; then
    # Kubernetes deployment
    kubectl set image deployment/${APP_NAME} ${APP_NAME}=${DOCKER_REGISTRY}/${APP_NAME}:${IMAGE_TAG} -n ${ENVIRONMENT}
    kubectl rollout status deployment/${APP_NAME} -n ${ENVIRONMENT}
else
    # Docker Swarm deployment
    docker service update --image ${DOCKER_REGISTRY}/${APP_NAME}:${IMAGE_TAG} ${APP_NAME}_${ENVIRONMENT}
fi

# Verificar deployment
echo "🏥 Checking health..."
sleep 30
health_check_url="https://myapp.dev.company.com/health"
if curl -f "${health_check_url}"; then
    echo "✅ Deployment successful!"
else
    echo "❌ Health check failed!"
    exit 1
fi

# Notificar en Slack
curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"🚀 Development deployment completed! Version: ${IMAGE_TAG}\"}" \
    $SLACK_WEBHOOK_URL

echo "🎉 Development deployment completed!"
```

---

## 🔍 Ambiente de Testing/QA: La sala de pruebas {#ambiente-testing}

El ambiente de testing es como una **sala de pruebas con laboratorio forense**. Aquí se detectan y analizan todos los problemas posibles.

### Configuración de testing automatizado

```yaml
# docker-compose.testing.yml
version: '3.8'

services:
  # Aplicación bajo prueba
  app:
    build:
      context: .
      dockerfile: Dockerfile.testing
    environment:
      - NODE_ENV=testing
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  # Base de datos para testing
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp_testing
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_password
    tmpfs:
      - /var/lib/postgresql/data # En memoria para rapidez

  # Redis para testing
  redis:
    image: redis:7-alpine
    command: redis-server --save ""

  # Selenium Grid para pruebas E2E
  selenium-hub:
    image: selenium/hub:4.15.0
    container_name: selenium-hub
    ports:
      - "4444:4444"

  selenium-chrome:
    image: selenium/node-chrome:4.15.0
    shm_size: 2gb
    depends_on:
      - selenium-hub
    environment:
      - HUB_HOST=selenium-hub
    scale: 2

  # WireMock para mocks de APIs externas
  wiremock:
    image: wiremock/wiremock:3.0.0
    container_name: wiremock
    ports:
      - "8089:8080"
    volumes:
      - ./test/mocks:/home/wiremock
    command: ["--global-response-templating"]
```

### Suite de pruebas completa

```typescript
// test/integration/health.test.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Health Check (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/health (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('services');
          expect(res.body.services.database).toBe('connected');
          expect(res.body.services.redis).toBe('connected');
        });
    });

    it('should include detailed service status', () => {
      return request(app.getHttpServer())
        .get('/health/detailed')
        .expect(200)
        .expect((res) => {
          expect(res.body.services).toHaveProperty('database');
          expect(res.body.services).toHaveProperty('redis');
          expect(res.body.services).toHaveProperty('externalApis');
          expect(res.body).toHaveProperty('uptime');
          expect(res.body).toHaveProperty('memory');
        });
    });
  });
});
```

```typescript
// test/e2e/user-flow.e2e.ts
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

describe('User Registration Flow (E2E)', () => {
  let driver: WebDriver;
  const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:3000';

  beforeAll(async () => {
    const chromeOptions = new Options();
    chromeOptions.addArguments('--headless');
    chromeOptions.addArguments('--no-sandbox');
    chromeOptions.addArguments('--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .usingServer('http://selenium-hub:4444/wd/hub')
      .build();
  }, 30000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('should complete user registration successfully', async () => {
    // Navegar a la página de registro
    await driver.get(`${baseUrl}/register`);

    // Llenar formulario
    await driver.findElement(By.id('name')).sendKeys('Test User');
    await driver.findElement(By.id('email')).sendKeys('test@example.com');
    await driver.findElement(By.id('password')).sendKeys('SecurePass123!');
    await driver.findElement(By.id('confirmPassword')).sendKeys('SecurePass123!');

    // Enviar formulario
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Verificar redirección exitosa
    await driver.wait(until.urlContains('/dashboard'), 10000);
    
    // Verificar mensaje de bienvenida
    const welcomeMessage = await driver.findElement(By.css('[data-testid="welcome-message"]'));
    const text = await welcomeMessage.getText();
    expect(text).toContain('Welcome, Test User');
  }, 30000);

  it('should show validation errors for invalid data', async () => {
    await driver.get(`${baseUrl}/register`);

    // Intentar enviar formulario vacío
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Verificar errores de validación
    const emailError = await driver.findElement(By.css('[data-testid="email-error"]'));
    const passwordError = await driver.findElement(By.css('[data-testid="password-error"]'));
    
    expect(await emailError.getText()).toContain('Email is required');
    expect(await passwordError.getText()).toContain('Password is required');
  });
});
```

### Pipeline de testing automático

```yaml
# .github/workflows/testing.yml
name: Comprehensive Testing

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: --health-cmd pg_isready --health-interval 10s

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Start test environment
        run: docker-compose -f docker-compose.testing.yml up -d

      - name: Wait for services
        run: |
          timeout 300 bash -c 'until curl -f http://localhost:3000/health; do sleep 5; done'

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Capture screenshots on failure
        if: failure()
        run: |
          mkdir -p test-results/screenshots
          docker cp $(docker ps -q --filter ancestor=selenium/node-chrome):/home/seluser/screenshots test-results/

      - name: Upload test artifacts
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run K6 performance tests
        uses: grafana/k6-action@v0.3.0
        with:
          filename: test/performance/load-test.js
        env:
          BASE_URL: ${{ env.BASE_URL }}
```

### Pruebas de carga con K6

```javascript
// test/performance/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 50 },  // Ramp up to 50
    { duration: '2m', target: 50 },   // Stay at 50
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% de requests bajo 500ms
    http_req_failed: ['rate<0.1'],    // Error rate bajo 10%
    errors: ['rate<0.1'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Test de login
  const loginResponse = http.post(`${BASE_URL}/auth/login`, {
    email: 'test@example.com',
    password: 'password123',
  });

  const loginSuccess = check(loginResponse, {
    'login successful': (r) => r.status === 200,
    'has token': (r) => r.json('token') !== '',
  });

  errorRate.add(!loginSuccess);

  if (loginSuccess) {
    const token = loginResponse.json('token');
    
    // Test de API autenticada
    const headers = { Authorization: `Bearer ${token}` };
    
    const profileResponse = http.get(`${BASE_URL}/users/profile`, { headers });
    
    check(profileResponse, {
      'profile fetch successful': (r) => r.status === 200,
      'response time < 200ms': (r) => r.timings.duration < 200,
    });
  }

  sleep(1);
}
```

---

## 🎪 Ambiente de Staging: El ensayo general {#ambiente-staging}

Staging es como el **ensayo general en el teatro real**. Todo debe ser idéntico a producción, pero con datos de prueba.

### Configuración de staging (réplica de producción)

```yaml
# docker-compose.staging.yml
version: '3.8'

services:
  # Load Balancer
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/staging.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

  # Aplicación (múltiples instancias)
  app:
    image: registry.company.com/myapp:${IMAGE_TAG}
    environment:
      - NODE_ENV=staging
      - DB_HOST=postgres
      - REDIS_HOST=redis
      - ELASTICSEARCH_HOST=elasticsearch
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
    depends_on:
      - postgres
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Base de datos con réplica
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp_staging
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_staging_data:/var/lib/postgresql/data
      - ./backups:/backups
    command: |
      postgres
      -c wal_level=replica
      -c max_wal_senders=3
      -c max_replication_slots=3

  # Redis Cluster
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --cluster-enabled yes
    volumes:
      - redis_staging_data:/data

  # Elasticsearch
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    environment:
      - cluster.name=staging-cluster
      - node.name=staging-node
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - elasticsearch_staging_data:/usr/share/elasticsearch/data

  # Monitoring con Prometheus
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/staging.yml:/etc/prometheus/prometheus.yml
      - prometheus_staging_data:/prometheus

  # Grafana para visualización
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_staging_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards

volumes:
  postgres_staging_data:
  redis_staging_data:
  elasticsearch_staging_data:
  prometheus_staging_data:
  grafana_staging_data:
```

### Pipeline de deployment a staging

```yaml
# .github/workflows/staging-deployment.yml
name: Staging Deployment

on:
  push:
    branches: [main]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
      - uses: actions/checkout@v4

      - name: Build and push Docker image
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker build -t registry.company.com/myapp:${{ github.sha }} .
          docker push registry.company.com/myapp:${{ github.sha }}

      - name: Deploy to staging
        run: |
          export IMAGE_TAG=${{ github.sha }}
          docker-compose -f docker-compose.staging.yml up -d

      - name: Wait for deployment
        run: |
          timeout 300 bash -c 'until curl -f https://myapp.staging.company.com/health; do sleep 10; done'

      - name: Run smoke tests
        run: |
          npm run test:smoke -- --env=staging
          npm run test:security -- --env=staging

      - name: Run regression tests
        run: |
          npm run test:regression -- --env=staging

      - name: Performance baseline check
        run: |
          k6 run --env BASE_URL=https://myapp.staging.company.com test/performance/baseline.js

      - name: Update staging database
        run: |
          npm run db:migrate -- --env=staging
          npm run db:seed -- --env=staging --data=realistic

      - name: Notify stakeholders
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#releases'
          text: |
            🎪 Staging deployment ready for testing!
            🔗 URL: https://myapp.staging.company.com
            📋 Test checklist: https://company.com/test-checklist
            🚀 Version: ${{ github.sha }}
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Datos de prueba realistas

```typescript
// scripts/seed-staging.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/modules/users/users.service';
import { BooksService } from '../src/modules/books/books.service';
import { faker } from '@faker-js/faker';

async function seedStagingData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const booksService = app.get(BooksService);

  console.log('🌱 Seeding staging environment with realistic data...');

  // Crear usuarios realistas
  const users = [];
  for (let i = 0; i < 1000; i++) {
    const user = await usersService.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'TempPassword123!',
      role: faker.helpers.weightedArrayElement([
        { weight: 85, value: 'user' },
        { weight: 10, value: 'moderator' },
        { weight: 5, value: 'admin' },
      ]),
    });
    users.push(user);
    
    if (i % 100 === 0) {
      console.log(`Created ${i} users...`);
    }
  }

  // Crear libros con datos realistas
  const bookCategories = ['Fiction', 'Science', 'History', 'Technology', 'Art'];
  for (let i = 0; i < 5000; i++) {
    await booksService.create({
      title: faker.lorem.words({ min: 2, max: 6 }),
      isbn: faker.commerce.isbn(),
      description: faker.lorem.paragraphs(3),
      publishedYear: faker.date.between({ 
        from: '1990-01-01', 
        to: '2023-12-31' 
      }).getFullYear(),
      category: faker.helpers.arrayElement(bookCategories),
      totalCopies: faker.number.int({ min: 1, max: 10 }),
      authorId: faker.helpers.arrayElement(authors).id,
    });

    if (i % 500 === 0) {
      console.log(`Created ${i} books...`);
    }
  }

  // Crear préstamos históricos
  const now = new Date();
  for (let i = 0; i < 2000; i++) {
    const user = faker.helpers.arrayElement(users);
    const book = faker.helpers.arrayElement(books);
    const loanDate = faker.date.between({
      from: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000), // 1 año atrás
      to: now
    });

    await loansService.create({
      userId: user.id,
      bookId: book.id,
      loanDate,
      dueDate: new Date(loanDate.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 días
      returnDate: faker.datatype.boolean() ? 
        faker.date.between({ from: loanDate, to: now }) : 
        null,
    });
  }

  console.log('✅ Staging data seeded successfully!');
  await app.close();
}

seedStagingData().catch(console.error);
```

---

## 🎬 Ambiente de Producción: El escenario principal {#ambiente-produccion}

Producción es como el **estreno de la obra ante el público pagante**. Aquí no hay segunda oportunidad.

### Arquitectura de producción (High Availability)

```yaml
# docker-compose.production.yml
version: '3.8'

services:
  # Load Balancer con SSL
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/production.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
      - ./logs/nginx:/var/log/nginx
    deploy:
      replicas: 2
      placement:
        constraints:
          - node.role == manager
    depends_on:
      - app

  # Aplicación con múltiples instancias
  app:
    image: registry.company.com/myapp:${IMAGE_TAG}
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres-primary
      - DB_REPLICA_HOSTS=postgres-replica-1,postgres-replica-2
      - REDIS_CLUSTER=redis-1:6379,redis-2:6379,redis-3:6379
    deploy:
      replicas: 6
      update_config:
        parallelism: 2
        delay: 30s
        failure_action: rollback
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      resources:
        limits:
          memory: 1G
          cpus: '1'
        reservations:
          memory: 512M
          cpus: '0.5'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  # Base de datos principal
  postgres-primary:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp_production
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_REPLICATION_USER: ${DB_REPLICATION_USER}
      POSTGRES_REPLICATION_PASSWORD: ${DB_REPLICATION_PASSWORD}
    volumes:
      - postgres_primary_data:/var/lib/postgresql/data
      - ./backups:/backups
      - ./scripts/postgres-primary.sh:/docker-entrypoint-initdb.d/setup-replication.sh
    command: |
      postgres
      -c wal_level=replica
      -c max_wal_senders=3
      -c max_replication_slots=3
      -c synchronous_commit=on
      -c synchronous_standby_names='replica1,replica2'
    deploy:
      placement:
        constraints:
          - node.labels.postgres == primary

  # Réplicas de base de datos
  postgres-replica-1:
    image: postgres:15
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      PGUSER: ${DB_REPLICATION_USER}
      POSTGRES_PASSWORD_FILE: /run/secrets/db_replication_password
    volumes:
      - postgres_replica1_data:/var/lib/postgresql/data
    command: |
      bash -c "
      until pg_basebackup --pgdata=/var/lib/postgresql/data --format=p --write-recovery-conf --checkpoint=fast --label=myclone --host=postgres-primary --port=5432 --username=${DB_REPLICATION_USER} --verbose --progress --wal-method=stream; do
      echo 'Waiting for primary to be available...'
      sleep 1s
      done
      echo 'Backup done, starting replica...'
      chmod 0700 /var/lib/postgresql/data
      postgres
      "
    depends_on:
      - postgres-primary

  # Redis Cluster
  redis-1:
    image: redis:7-alpine
    command: redis-server --port 6379 --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000 --appendonly yes
    volumes:
      - redis1_data:/data

  redis-2:
    image: redis:7-alpine
    command: redis-server --port 6379 --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000 --appendonly yes
    volumes:
      - redis2_data:/data

  redis-3:
    image: redis:7-alpine
    command: redis-server --port 6379 --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000 --appendonly yes
    volumes:
      - redis3_data:/data

volumes:
  postgres_primary_data:
  postgres_replica1_data:
  postgres_replica2_data:
  redis1_data:
  redis2_data:
  redis3_data:

secrets:
  db_password:
    external: true
  db_replication_password:
    external: true
```

### Blue-Green Deployment Strategy

```bash
#!/bin/bash
# scripts/blue-green-deploy.sh

set -e

ENVIRONMENT="production"
NEW_VERSION=${1:-latest}
CURRENT_COLOR=$(docker service ls --filter name=${ENVIRONMENT} --format "{{.Name}}" | grep -o 'blue\|green' | head -1)

if [ "$CURRENT_COLOR" = "blue" ]; then
    NEW_COLOR="green"
else
    NEW_COLOR="blue"
fi

echo "🚀 Starting Blue-Green deployment..."
echo "Current: $CURRENT_COLOR -> New: $NEW_COLOR"

# 1. Deploy new version to inactive environment
echo "📦 Deploying $NEW_VERSION to $NEW_COLOR environment..."
docker service update \
    --image registry.company.com/myapp:${NEW_VERSION} \
    ${ENVIRONMENT}_app_${NEW_COLOR}

# 2. Wait for new deployment to be healthy
echo "🏥 Waiting for health checks..."
sleep 60

HEALTH_URL="https://myapp-${NEW_COLOR}.company.com/health"
for i in {1..30}; do
    if curl -f "$HEALTH_URL"; then
        echo "✅ Health check passed"
        break
    else
        echo "⏳ Health check failed, retrying... ($i/30)"
        sleep 10
    fi
    
    if [ $i -eq 30 ]; then
        echo "❌ Health check failed after 5 minutes"
        exit 1
    fi
done

# 3. Run smoke tests on new environment
echo "🧪 Running smoke tests on $NEW_COLOR..."
npm run test:smoke -- --env=${NEW_COLOR}

# 4. Switch traffic to new environment
echo "🔄 Switching traffic to $NEW_COLOR..."
./scripts/switch-traffic.sh $NEW_COLOR

# 5. Monitor for 5 minutes
echo "📊 Monitoring for 5 minutes..."
for i in {1..5}; do
    ERROR_RATE=$(curl -s "https://monitoring.company.com/api/error-rate" | jq '.rate')
    if (( $(echo "$ERROR_RATE > 0.05" | bc -l) )); then
        echo "❌ Error rate too high: $ERROR_RATE"
        echo "🔙 Rolling back..."
        ./scripts/switch-traffic.sh $CURRENT_COLOR
        exit 1
    fi
    echo "✅ Error rate OK: $ERROR_RATE"
    sleep 60
done

# 6. Shutdown old environment
echo "🛑 Shutting down $CURRENT_COLOR environment..."
docker service scale ${ENVIRONMENT}_app_${CURRENT_COLOR}=0

echo "🎉 Blue-Green deployment completed successfully!"
```

### Monitoring y alertas de producción

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alerts.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'app'
    static_configs:
      - targets: ['app:3000']
    metrics_path: /metrics
    scrape_interval: 5s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx-exporter:9113']

  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
```

```yaml
# monitoring/alerts.yml
groups:
  - name: application
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time"
          description: "95th percentile response time is {{ $value }}s"

      - alert: DatabaseDown
        expr: postgres_up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database is down"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
```

---

## 🕰️ Control de versiones: La máquina del tiempo {#control-versiones}

El control de versiones es como una **máquina del tiempo** que te permite viajar entre diferentes estados de tu código.

### Git Flow para equipos

```mermaid
gitGraph
    commit id: "Initial"
    branch develop
    checkout develop
    commit id: "Setup"
    
    branch feature/user-auth
    checkout feature/user-auth
    commit id: "Add login"
    commit id: "Add register"
    
    checkout develop
    merge feature/user-auth
    commit id: "Merge auth"
    
    branch release/v1.0
    checkout release/v1.0
    commit id: "Version bump"
    commit id: "Bug fixes"
    
    checkout main
    merge release/v1.0
    commit id: "Release v1.0"
    tag: "v1.0.0"
    
    checkout develop
    merge main
```

### Configuración de Git avanzada

```bash
# .gitconfig personal optimizado
[user]
    name = Tu Nombre
    email = tu.email@company.com
    signingkey = TU_GPG_KEY_ID

[core]
    editor = code --wait
    autocrlf = input
    ignorecase = false
    precomposeunicode = true
    
[commit]
    gpgsign = true
    template = ~/.gitmessage

[push]
    default = current
    followTags = true

[pull]
    rebase = true

[rebase]
    autoStash = true

[merge]
    tool = vscode
    conflictstyle = diff3

[mergetool "vscode"]
    cmd = code --wait $MERGED

[diff]
    tool = vscode

[difftool "vscode"]
    cmd = code --wait --diff $LOCAL $REMOTE

[alias]
    # Shortcuts útiles
    co = checkout
    br = branch
    ci = commit
    st = status
    
    # Comandos avanzados
    uncommit = reset --soft HEAD~1
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = !gitk
    
    # Logs bonitos
    lg = log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
    lga = log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --all
    
    # Estadísticas
    contrib = shortlog --summary --numbered
    count = !git shortlog -sn
```

### Commit message template

```bash
# ~/.gitmessage
# <type>(<scope>): <subject>
#
# <body>
#
# <footer>

# Tipos:
# feat:     Nueva funcionalidad
# fix:      Corrección de bug
# docs:     Solo documentación
# style:    Cambios que no afectan el significado del código
# refactor: Cambio de código que no es fix ni feature
# perf:     Cambio que mejora performance
# test:     Agregar tests faltantes
# chore:    Cambios en el proceso de build o herramientas auxiliares

# Scope (opcional): auth, users, api, ui, etc.

# Subject:
# - usar imperativo: "add" no "added" ni "adds"
# - no capitalizar primera letra
# - no punto al final

# Body (opcional):
# - usar imperativo
# - incluir motivación del cambio y contraste con comportamiento anterior

# Footer (opcional):
# - referenciar issues: "Closes #123"
# - breaking changes: "BREAKING CHANGE: ..."
```

### Hooks de Git automatizados

```bash
#!/bin/sh
# .git/hooks/pre-commit
# Hook que se ejecuta antes de cada commit

echo "🔍 Running pre-commit checks..."

# Verificar que no hay conflictos sin resolver
if git diff --check --cached; then
    echo "❌ Whitespace errors found"
    exit 1
fi

# Ejecutar linting
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed"
    exit 1
fi

# Ejecutar tests unitarios
npm run test:unit
if [ $? -ne 0 ]; then
    echo "❌ Unit tests failed"
    exit 1
fi

# Verificar que no hay secrets en el código
if grep -r "password\|secret\|token" --include="*.ts" --include="*.js" src/; then
    echo "❌ Potential secrets found in code"
    exit 1
fi

echo "✅ Pre-commit checks passed"
```

```bash
#!/bin/sh
# .git/hooks/commit-msg
# Hook que valida el formato del mensaje de commit

commit_regex='^(feat|fix|docs|style|refactor|perf|test|chore)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "❌ Invalid commit message format"
    echo "Format: type(scope): description"
    echo "Example: feat(auth): add login functionality"
    exit 1
fi

echo "✅ Commit message format is valid"
```

### Branching strategy

```bash
# scripts/git-flow-init.sh
#!/bin/bash

echo "🌟 Initializing Git Flow for project..."

# Configurar branches principales
git checkout -b main
git checkout -b develop

# Configurar Git Flow
git flow init -d

# Crear template de PR
mkdir -p .github/pull_request_template.md
cat > .github/pull_request_template.md << 'EOF'
## 📝 Descripción
<!-- Describe qué hace este PR -->

## 🔧 Tipo de cambio
- [ ] 🐛 Bug fix
- [ ] ✨ Nueva funcionalidad
- [ ] 💥 Breaking change
- [ ] 📚 Documentación
- [ ] 🎨 Mejora de estilo/formato
- [ ] ♻️ Refactoring
- [ ] ⚡ Mejora de performance
- [ ] ✅ Tests

## 🧪 Testing
- [ ] Tests unitarios agregados/actualizados
- [ ] Tests de integración agregados/actualizados
- [ ] Tests manuales realizados

## 📋 Checklist
- [ ] Mi código sigue las convenciones del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código, especialmente en partes difíciles
- [ ] He actualizado la documentación correspondiente
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He agregado tests que prueban mi fix/feature
- [ ] Tests nuevos y existentes pasan localmente

## 🔗 Issues relacionados
<!-- Closes #123 -->
EOF

echo "✅ Git Flow initialized successfully!"
```

---

## 🔄 CI/CD: La línea de ensamblaje automatizada {#ci-cd}

CI/CD es como una **línea de ensamblaje automatizada** que construye, prueba y entrega tu software sin intervención manual.

### Pipeline completo de CI/CD

```yaml
# .github/workflows/cicd.yml
name: Complete CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  release:
    types: [published]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # 1. ANÁLISIS ESTÁTICO Y SEGURIDAD
  static-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Needed for SonarCloud

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint -- --format=json --output-file=eslint-report.json
        continue-on-error: true

      - name: Run Prettier check
        run: npm run prettier:check

      - name: TypeScript check
        run: npm run type-check

      - name: Security audit
        run: npm audit --audit-level=high

      - name: Dependency check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'MyApp'
          path: '.'
          format: 'JSON'

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

  # 2. TESTING MULTI-AMBIENTE
  test-matrix:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
        database: [postgres, mysql]
        
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: --health-cmd pg_isready --health-interval 10s
        
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: mysql
          MYSQL_DATABASE: test_db
        options: --health-cmd="mysqladmin ping" --health-interval=10s

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_TYPE: ${{ matrix.database }}
          DATABASE_URL: ${{ matrix.database == 'postgres' && 'postgresql://postgres:postgres@localhost:5432/test_db' || 'mysql://root:mysql@localhost:3306/test_db' }}

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-${{ matrix.node-version }}-${{ matrix.database }}

  # 3. BUILD Y CONTAINERIZACIÓN
  build:
    needs: [static-analysis, test-matrix]
    runs-on: ubuntu-latest
    outputs:
      image: ${{ steps.image.outputs.image }}
      digest: ${{ steps.build.outputs.digest }}
      
    steps:
      - uses: actions/checkout@v4

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix={{branch}}-

      - name: Build and push Docker image
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          platforms: linux/amd64,linux/arm64

      - name: Output image
        id: image
        run: |
          echo "image=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ steps.meta.outputs.version }}" >> $GITHUB_OUTPUT

  # 4. SECURITY SCANNING
  security-scan:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Scan image with Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ needs.build.outputs.image }}
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

  # 5. DEPLOYMENT A STAGING
  deploy-staging:
    needs: [build, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to staging
        run: |
          echo "🚀 Deploying to staging..."
          ./scripts/deploy.sh staging ${{ needs.build.outputs.image }}

      - name: Run smoke tests
        run: |
          sleep 60 # Wait for deployment
          npm run test:smoke -- --env=staging

      - name: Run E2E tests
        run: npm run test:e2e -- --env=staging

  # 6. DEPLOYMENT A PRODUCCIÓN
  deploy-production:
    needs: [build, security-scan]
    runs-on: ubuntu-latest
    if: github.event_name == 'release'
    environment: production
    
    steps:
      - uses: actions/checkout@v4

      - name: Blue-Green deployment
        run: |
          echo "🚀 Starting blue-green deployment..."
          ./scripts/blue-green-deploy.sh ${{ needs.build.outputs.image }}

      - name: Post-deployment verification
        run: |
          npm run test:smoke -- --env=production
          npm run test:monitoring -- --env=production

      - name: Update release notes
        uses: release-drafter/release-drafter@v5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # 7. NOTIFICACIONES
  notify:
    needs: [deploy-staging, deploy-production]
    runs-on: ubuntu-latest
    if: always()
    
    steps:
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          text: |
            🚀 Deployment completed!
            📦 Version: ${{ github.sha }}
            🎯 Environment: ${{ github.ref == 'refs/heads/develop' && 'staging' || 'production' }}
            ✅ Status: ${{ job.status }}
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Dockerfile multi-stage optimizado

```dockerfile
# Dockerfile
# Imagen base con Node.js
FROM node:18-alpine as base
WORKDIR /app
RUN apk add --no-cache dumb-init

# Dependencias de desarrollo
FROM base as deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Build de la aplicación
FROM base as build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm run test:unit

# Imagen de producción
FROM base as production
ENV NODE_ENV=production
ENV PORT=3000

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copiar dependencias y build
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/package*.json ./

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

USER nestjs
EXPOSE 3000

# Usar dumb-init para proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
```

### Scripts de deployment

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

ENVIRONMENT=$1
IMAGE=$2
NAMESPACE="myapp-${ENVIRONMENT}"

if [ -z "$ENVIRONMENT" ] || [ -z "$IMAGE" ]; then
    echo "Usage: $0 <environment> <image>"
    exit 1
fi

echo "🚀 Deploying $IMAGE to $ENVIRONMENT..."

# Kubernetes deployment
if command -v kubectl &> /dev/null; then
    # Update deployment
    kubectl set image deployment/myapp myapp=$IMAGE -n $NAMESPACE
    
    # Wait for rollout
    kubectl rollout status deployment/myapp -n $NAMESPACE --timeout=300s
    
    # Verify deployment
    kubectl get pods -n $NAMESPACE
    
# Docker Swarm deployment
elif command -v docker &> /dev/null; then
    # Update service
    docker service update --image $IMAGE myapp_${ENVIRONMENT}
    
    # Wait for update
    until docker service ps myapp_${ENVIRONMENT} | grep -q "Running.*Running"; do
        echo "Waiting for service update..."
        sleep 10
    done
fi

# Run post-deployment checks
echo "🏥 Running health checks..."
HEALTH_URL="https://myapp.${ENVIRONMENT}.company.com/health"

for i in {1..30}; do
    if curl -f "$HEALTH_URL"; then
        echo "✅ Health check passed"
        break
    else
        echo "⏳ Health check failed, retrying... ($i/30)"
        sleep 10
    fi
    
    if [ $i -eq 30 ]; then
        echo "❌ Health check failed after 5 minutes"
        exit 1
    fi
done

echo "🎉 Deployment to $ENVIRONMENT completed successfully!"
```

---

## ⚙️ Configuration Management: El gestor de secretos {#configuration-management}

La gestión de configuración es como un **gestor de secretos profesional** que mantiene toda tu información sensible segura y organizada.

### Gestión de variables de ambiente por niveles

```typescript
// src/config/configuration.ts
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

// Schema de validación
export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'testing', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  
  // Base de datos
  DATABASE_URL: Joi.string().required(),
  DATABASE_SSL: Joi.boolean().default(false),
  DATABASE_POOL_SIZE: Joi.number().default(10),
  
  // Redis
  REDIS_URL: Joi.string().required(),
  REDIS_TTL: Joi.number().default(3600),
  
  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  
  // APIs externas
  EXTERNAL_API_KEY: Joi.string().required(),
  EXTERNAL_API_URL: Joi.string().uri().required(),
  
  // Monitoreo
  SENTRY_DSN: Joi.string().uri().optional(),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),
    
  // Email
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
});

// Configuraciones por módulo
export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true',
  poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '10', 10),
  logging: process.env.NODE_ENV === 'development',
  synchronize: process.env.NODE_ENV !== 'production',
}));

export const redisConfig = registerAs('redis', () => ({
  url: process.env.REDIS_URL,
  ttl: parseInt(process.env.REDIS_TTL || '3600', 10),
  keyPrefix: `myapp:${process.env.NODE_ENV}:`,
}));

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  bcryptRounds: 12,
}));

export const emailConfig = registerAs('email', () => ({
  transport: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  defaults: {
    from: `"MyApp" <${process.env.SMTP_USER}>`,
  },
}));
```

### Archivos de configuración por ambiente

```bash
# .env.local
NODE_ENV=development
PORT=3000

# Base de datos local
DATABASE_URL=postgresql://developer:dev_password@localhost:5432/myapp_dev
DATABASE_SSL=false
DATABASE_POOL_SIZE=5

# Redis local
REDIS_URL=redis://localhost:6379

# Secrets de desarrollo (NO usar en producción)
JWT_SECRET=dev_jwt_secret_key_at_least_32_chars_long
JWT_REFRESH_SECRET=dev_refresh_secret_key_at_least_32_chars_long

# APIs de desarrollo
EXTERNAL_API_KEY=dev_api_key_1234
EXTERNAL_API_URL=https://api.dev.external.com

# Logging
LOG_LEVEL=debug

# Email (usar servicio de testing como MailHog)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=test@example.com
SMTP_PASS=test
```

```bash
# .env.staging
NODE_ENV=staging
PORT=3000

# Base de datos staging
DATABASE_URL=postgresql://staging_user:${DB_PASSWORD}@staging-db.company.com:5432/myapp_staging
DATABASE_SSL=true
DATABASE_POOL_SIZE=10

# Redis staging
REDIS_URL=redis://staging-redis.company.com:6379

# Secrets (deben ser diferentes a desarrollo)
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}

# APIs staging
EXTERNAL_API_KEY=${EXTERNAL_API_KEY}
EXTERNAL_API_URL=https://api.staging.external.com

# Monitoring
SENTRY_DSN=${SENTRY_DSN}
LOG_LEVEL=info

# Email staging
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=${SENDGRID_USER}
SMTP_PASS=${SENDGRID_PASS}
```

### Gestión de secretos con HashiCorp Vault

```typescript
// src/config/vault.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as vault from 'node-vault';

@Injectable()
export class VaultService {
  private readonly logger = new Logger(VaultService.name);
  private vaultClient: any;

  constructor(private configService: ConfigService) {
    this.initializeVault();
  }

  private async initializeVault() {
    const vaultUrl = this.configService.get('VAULT_URL');
    const vaultToken = this.configService.get('VAULT_TOKEN');

    if (!vaultUrl || !vaultToken) {
      this.logger.warn('Vault not configured, using environment variables');
      return;
    }

    this.vaultClient = vault({
      apiVersion: 'v1',
      endpoint: vaultUrl,
      token: vaultToken,
    });

    try {
      await this.vaultClient.help();
      this.logger.log('Connected to Vault successfully');
    } catch (error) {
      this.logger.error('Failed to connect to Vault', error);
    }
  }

  async getSecret(path: string): Promise<any> {
    if (!this.vaultClient) {
      // Fallback to environment variables
      return process.env;
    }

    try {
      const result = await this.vaultClient.read(path);
      return result.data;
    } catch (error) {
      this.logger.error(`Failed to read secret from path: ${path}`, error);
      throw error;
    }
  }

  async setSecret(path: string, data: Record<string, any>): Promise<void> {
    if (!this.vaultClient) {
      throw new Error('Vault not configured');
    }

    try {
      await this.vaultClient.write(path, data);
      this.logger.log(`Secret written to path: ${path}`);
    } catch (error) {
      this.logger.error(`Failed to write secret to path: ${path}`, error);
      throw error;
    }
  }
}
```

### Kubernetes ConfigMaps y Secrets

```yaml
# k8s/configmap.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp-config
  namespace: myapp-production
data:
  NODE_ENV: "production"
  PORT: "3000"
  DATABASE_SSL: "true"
  DATABASE_POOL_SIZE: "20"
  LOG_LEVEL: "info"
  EXTERNAL_API_URL: "https://api.external.com"
  
---
apiVersion: v1
kind: Secret
metadata:
  name: myapp-secrets
  namespace: myapp-production
type: Opaque
data:
  # Valores en base64
  DATABASE_URL: cG9zdGdyZXNxbDovL3VzZXI6cGFzcw==
  JWT_SECRET: bXlfc3VwZXJfc2VjcmV0X2p3dF9rZXk=
  JWT_REFRESH_SECRET: bXlfc3VwZXJfc2VjcmV0X3JlZnJlc2hfa2V5
  EXTERNAL_API_KEY: YXBpX2tleV8xMjM0NTY3ODkw

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: myapp-production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: registry.company.com/myapp:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: myapp-config
        - secretRef:
            name: myapp-secrets
        resources:
          limits:
            memory: "1Gi"
            cpu: "1000m"
          requests:
            memory: "512Mi"
            cpu: "500m"
```

### Scripts de gestión de configuración

```bash
#!/bin/bash
# scripts/config-deploy.sh

set -e

ENVIRONMENT=$1
NAMESPACE="myapp-${ENVIRONMENT}"

if [ -z "$ENVIRONMENT" ]; then
    echo "Usage: $0 <environment>"
    exit 1
fi

echo "🔧 Deploying configuration for $ENVIRONMENT..."

# Crear namespace si no existe
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Cargar secretos desde Vault o archivo encriptado
case $ENVIRONMENT in
    "development")
        CONFIG_FILE=".env.local"
        ;;
    "staging")
        CONFIG_FILE=".env.staging"
        ;;
    "production")
        CONFIG_FILE=".env.production"
        ;;
    *)
        echo "Unknown environment: $ENVIRONMENT"
        exit 1
        ;;
esac

# Crear ConfigMap desde archivo
kubectl create configmap myapp-config \
    --from-env-file=$CONFIG_FILE \
    --namespace=$NAMESPACE \
    --dry-run=client -o yaml | kubectl apply -f -

# Crear Secret desde variables específicas
kubectl create secret generic myapp-secrets \
    --from-literal=DATABASE_URL="$DATABASE_URL" \
    --from-literal=JWT_SECRET="$JWT_SECRET" \
    --from-literal=JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET" \
    --from-literal=EXTERNAL_API_KEY="$EXTERNAL_API_KEY" \
    --namespace=$NAMESPACE \
    --dry-run=client -o yaml | kubectl apply -f -

echo "✅ Configuration deployed successfully!"
```

---

## 📊 Monitoring y Logging: Los sistemas de vigilancia {#monitoring-logging}

El monitoring y logging son como los **sistemas de vigilancia y cámaras de seguridad** de tu aplicación. Te dicen qué está pasando en todo momento.

### Implementación de métricas con Prometheus

```typescript
// src/monitoring/metrics.service.ts
import { Injectable } from '@nestjs/common';
import { register, Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  // Contadores
  private readonly httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  });

  private readonly databaseQueriesTotal = new Counter({
    name: 'database_queries_total',
    help: 'Total number of database queries',
    labelNames: ['query_type', 'table', 'status'],
  });

  // Histogramas para timing
  private readonly httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  });

  private readonly databaseQueryDuration = new Histogram({
    name: 'database_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['query_type', 'table'],
    buckets: [0.001, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1.0],
  });

  // Gauges para valores actuales
  private readonly activeConnections = new Gauge({
    name: 'active_connections',
    help: 'Number of active connections',
    labelNames: ['type'],
  });

  private readonly memoryUsage = new Gauge({
    name: 'memory_usage_bytes',
    help: 'Memory usage in bytes',
    labelNames: ['type'],
  });

  constructor() {
    // Registrar métricas personalizadas
    register.registerMetric(this.httpRequestsTotal);
    register.registerMetric(this.databaseQueriesTotal);
    register.registerMetric(this.httpRequestDuration);
    register.registerMetric(this.databaseQueryDuration);
    register.registerMetric(this.activeConnections);
    register.registerMetric(this.memoryUsage);

    // Métricas de sistema cada 10 segundos
    setInterval(() => {
      this.collectSystemMetrics();
    }, 10000);
  }

  // Métodos para HTTP
  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode });
    this.httpRequestDuration.observe({ method, route }, duration);
  }

  // Métodos para base de datos
  recordDatabaseQuery(queryType: string, table: string, duration: number, success: boolean) {
    this.databaseQueriesTotal.inc({ 
      query_type: queryType, 
      table, 
      status: success ? 'success' : 'error' 
    });
    this.databaseQueryDuration.observe({ query_type: queryType, table }, duration);
  }

  // Actualizar conexiones activas
  setActiveConnections(type: string, count: number) {
    this.activeConnections.set({ type }, count);
  }

  // Recolectar métricas del sistema
  private collectSystemMetrics() {
    const memUsage = process.memoryUsage();
    this.memoryUsage.set({ type: 'rss' }, memUsage.rss);
    this.memoryUsage.set({ type: 'heap_used' }, memUsage.heapUsed);
    this.memoryUsage.set({ type: 'heap_total' }, memUsage.heapTotal);
    this.memoryUsage.set({ type: 'external' }, memUsage.external);
  }

  // Endpoint para Prometheus
  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
```

### Interceptor para capturar métricas HTTP

```typescript
// src/monitoring/metrics.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const { method, route } = request;

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = (Date.now() - startTime) / 1000;
          this.metricsService.recordHttpRequest(
            method,
            route?.path || request.url,
            response.statusCode,
            duration
          );
        },
        error: (error) => {
          const duration = (Date.now() - startTime) / 1000;
          this.metricsService.recordHttpRequest(
            method,
            route?.path || request.url,
            error.status || 500,
            duration
          );
        },
      }),
    );
  }
}
```

### Logging estructurado con Winston

```typescript
// src/logging/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const transports: winston.transport[] = [
      // Console para desarrollo
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, context, trace, ...meta }) => {
            return `${timestamp} [${context}] ${level}: ${message}${
              trace ? `\n${trace}` : ''
            }${Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : ''}`;
          }),
        ),
      }),

      // Archivo para todos los logs
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),

      // Archivo separado para errores
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ];

    // Elasticsearch en producción
    if (process.env.NODE_ENV === 'production' && process.env.ELASTICSEARCH_URL) {
      transports.push(
        new ElasticsearchTransport({
          clientOpts: {
            node: process.env.ELASTICSEARCH_URL,
            auth: {
              username: process.env.ELASTICSEARCH_USER,
              password: process.env.ELASTICSEARCH_PASSWORD,
            },
          },
          index: 'myapp-logs',
          typeName: '_doc',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      );
    }

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: {
        service: 'myapp',
        environment: process.env.NODE_ENV,
        version: process.env.APP_VERSION,
      },
      transports,
    });
  }

  log(message: string, context?: string, meta?: any) {
    this.logger.info(message, { context, ...meta });
  }

  error(message: string, trace?: string, context?: string, meta?: any) {
    this.logger.error(message, { context, trace, ...meta });
  }

  warn(message: string, context?: string, meta?: any) {
    this.logger.warn(message, { context, ...meta });
  }

  debug(message: string, context?: string, meta?: any) {
    this.logger.debug(message, { context, ...meta });
  }

  verbose(message: string, context?: string, meta?: any) {
    this.logger.verbose(message, { context, ...meta });
  }

  // Métodos específicos para diferentes tipos de eventos
  logUserAction(userId: string, action: string, details: any) {
    this.logger.info('User action', {
      context: 'UserAction',
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  logDatabaseQuery(query: string, duration: number, success: boolean) {
    this.logger.debug('Database query', {
      context: 'Database',
      query,
      duration,
      success,
      timestamp: new Date().toISOString(),
    });
  }

  logAPICall(endpoint: string, method: string, statusCode: number, duration: number) {
    this.logger.info('API call', {
      context: 'API',
      endpoint,
      method,
      statusCode,
      duration,
      timestamp: new Date().toISOString(),
    });
  }

  logSecurityEvent(event: string, details: any, severity: 'low' | 'medium' | 'high' | 'critical') {
    this.logger.warn('Security event', {
      context: 'Security',
      event,
      details,
      severity,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Health checks comprehensivos

```typescript
// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, TypeOrmHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis-health.indicator';
import { ExternalAPIHealthIndicator } from './external-api-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private redis: RedisHealthIndicator,
    private externalAPI: ExternalAPIHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.isHealthy('redis'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),   // 300MB
    ]);
  }

  @Get('detailed')
  @HealthCheck()
  checkDetailed() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.isHealthy('redis'),
      () => this.externalAPI.isHealthy('external_api'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
    ]);
  }

  @Get('readiness')
  @HealthCheck()
  checkReadiness() {
    // Checks que determinan si la app está lista para recibir tráfico
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.isHealthy('redis'),
    ]);
  }

  @Get('liveness')
  @HealthCheck()
  checkLiveness() {
    // Checks básicos que determinan si la app está viva
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
    ]);
  }
}
```

### Dashboard de Grafana

```json
{
  "dashboard": {
    "title": "MyApp - Production Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "type": "stat",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "Requests/sec"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "50th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(http_requests_total{status_code=~\"5..\"}[5m]) / rate(http_requests_total[5m]) * 100",
            "legendFormat": "Error %"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "memory_usage_bytes{type=\"heap_used\"} / 1024 / 1024",
            "legendFormat": "Heap Used (MB)"
          },
          {
            "expr": "memory_usage_bytes{type=\"rss\"} / 1024 / 1024",
            "legendFormat": "RSS (MB)"
          }
        ]
      }
    ]
  }
}
```

---

## 🛡️ Security: Los sistemas de seguridad {#security}

La seguridad es como el **sistema de seguridad de un banco**. Múltiples capas de protección que trabajan juntas.

### Implementación de autenticación segura

```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { RateLimiterService } from './rate-limiter.service';
import { SecurityLogger } from './security-logger.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private rateLimiter: RateLimiterService,
    private securityLogger: SecurityLogger,
  ) {}

  async login(email: string, password: string, ip: string, userAgent: string) {
    // Rate limiting por IP
    await this.rateLimiter.checkLoginAttempts(ip);

    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      // Log intento de login con usuario inexistente
      this.securityLogger.logFailedLogin(email, ip, 'USER_NOT_FOUND');
      await this.rateLimiter.recordFailedAttempt(ip);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar si la cuenta está bloqueada
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      this.securityLogger.logFailedLogin(email, ip, 'ACCOUNT_LOCKED');
      throw new UnauthorizedException('Cuenta temporalmente bloqueada');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Incrementar contador de intentos fallidos
      await this.usersService.incrementFailedAttempts(user.id);
      this.securityLogger.logFailedLogin(email, ip, 'INVALID_PASSWORD');
      await this.rateLimiter.recordFailedAttempt(ip);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar 2FA si está habilitado
    if (user.twoFactorEnabled) {
      return {
        requiresTwoFactor: true,
        tempToken: this.generateTempToken(user.id),
      };
    }

    // Login exitoso
    await this.usersService.resetFailedAttempts(user.id);
    this.securityLogger.logSuccessfulLogin(user.id, email, ip, userAgent);

    return this.generateTokens(user);
  }

  async verifyTwoFactor(tempToken: string, totpCode: string, ip: string) {
    const payload = this.jwtService.verify(tempToken, {
      secret: this.configService.get('JWT_TEMP_SECRET'),
    });

    const user = await this.usersService.findById(payload.sub);
    
    if (!user || !user.twoFactorSecret) {
      throw new UnauthorizedException('Token inválido');
    }

    const isValidTotp = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: totpCode,
      window: 2, // Permitir 2 ventanas de tiempo
    });

    if (!isValidTotp) {
      this.securityLogger.logFailedTwoFactor(user.id, ip);
      throw new UnauthorizedException('Código 2FA inválido');
    }

    this.securityLogger.logSuccessfulTwoFactor(user.id, ip);
    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string, ip: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findById(payload.sub);
      
      if (!user || !user.refreshTokens.includes(refreshToken)) {
        this.securityLogger.logInvalidRefreshToken(payload.sub, ip);
        throw new UnauthorizedException('Refresh token inválido');
      }

      // Rotar refresh tokens
      await this.usersService.revokeRefreshToken(user.id, refreshToken);
      
      return this.generateTokens(user);
    } catch (error) {
      this.securityLogger.logInvalidRefreshToken('unknown', ip);
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  private generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    // Guardar refresh token
    this.usersService.addRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    };
  }

  private generateTempToken(userId: string) {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get('JWT_TEMP_SECRET'),
        expiresIn: '5m',
      },
    );
  }
}
```

### Rate Limiting Service

```typescript
// src/auth/rate-limiter.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { TooManyRequestsException } from '@nestjs/common';

@Injectable()
export class RateLimiterService {
  constructor(@InjectRedis() private redis: Redis) {}

  async checkLoginAttempts(ip: string) {
    const key = `login_attempts:${ip}`;
    const attempts = await this.redis.get(key);
    
    if (attempts && parseInt(attempts) >= 5) {
      const ttl = await this.redis.ttl(key);
      throw new TooManyRequestsException(
        `Demasiados intentos de login. Intenta en ${ttl} segundos.`
      );
    }
  }

  async recordFailedAttempt(ip: string) {
    const key = `login_attempts:${ip}`;
    const current = await this.redis.incr(key);
    
    if (current === 1) {
      await this.redis.expire(key, 900); // 15 minutos
    }
  }

  async checkAPIRateLimit(userId: string, endpoint: string, limit: number = 100) {
    const key = `api_rate:${userId}:${endpoint}`;
    const current = await this.redis.incr(key);
    
    if (current === 1) {
      await this.redis.expire(key, 3600); // 1 hora
    }
    
    if (current > limit) {
      throw new TooManyRequestsException('Rate limit excedido');
    }
    
    return {
      current,
      limit,
      remaining: limit - current,
    };
  }
}
```

### Guards de seguridad avanzados

```typescript
// src/auth/guards/permissions.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

export enum Permission {
  READ_USERS = 'read:users',
  WRITE_USERS = 'write:users',
  DELETE_USERS = 'delete:users',
  MANAGE_SYSTEM = 'manage:system',
  VIEW_ANALYTICS = 'view:analytics',
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Verificar permisos basado en roles
    const userPermissions = this.getRolePermissions(user.role);
    
    const hasPermission = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      throw new ForbiddenException('Permisos insuficientes');
    }

    return true;
  }

  private getRolePermissions(role: string): Permission[] {
    const rolePermissions = {
      admin: [
        Permission.READ_USERS,
        Permission.WRITE_USERS,
        Permission.DELETE_USERS,
        Permission.MANAGE_SYSTEM,
        Permission.VIEW_ANALYTICS,
      ],
      moderator: [
        Permission.READ_USERS,
        Permission.WRITE_USERS,
        Permission.VIEW_ANALYTICS,
      ],
      user: [
        Permission.READ_USERS,
      ],
    };

    return rolePermissions[role] || [];
  }
}
```

### Validación y sanitización de inputs

```typescript
// src/common/pipes/sanitization.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { plainToClass, Transform } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import * as DOMPurify from 'isomorphic-dompurify';

@Injectable()
export class SanitizationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Sanitizar strings
    if (typeof value === 'object') {
      value = this.sanitizeObject(value);
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    
    if (errors.length > 0) {
      throw new BadRequestException('Datos de entrada inválidos');
    }
    
    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private sanitizeObject(obj: any): any {
    const sanitized = { ...obj };
    
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = DOMPurify.sanitize(sanitized[key]);
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeObject(sanitized[key]);
      }
    }
    
    return sanitized;
  }
}
```

### Middleware de seguridad

```typescript
// src/security/security.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana
    message: 'Demasiadas solicitudes desde esta IP',
    standardHeaders: true,
    legacyHeaders: false,
  });

  use(req: Request, res: Response, next: NextFunction) {
    // Headers de seguridad
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })(req, res, () => {
      // Rate limiting
      this.limiter(req, res, () => {
        // Headers adicionales
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        next();
      });
    });
  }
}
```

---

## 📝 Code Review: El comité de calidad {#code-review}

El code review es como un **comité de calidad editorial** que revisa cada artículo antes de publicarlo.

### Guías de Code Review

```markdown
# Code Review Guidelines

## 📋 Checklist del Reviewer

### ✅ Funcionalidad
- [ ] El código hace lo que se supone que debe hacer
- [ ] Los casos edge están manejados
- [ ] Los errores son manejados apropiadamente
- [ ] Las validaciones de entrada son suficientes

### 🏗️ Arquitectura y Diseño
- [ ] El código sigue los principios SOLID
- [ ] La separación de responsabilidades es clara
- [ ] No hay duplicación innecesaria
- [ ] Los patrones de diseño son apropiados

### 🔒 Seguridad
- [ ] No hay vulnerabilidades evidentes
- [ ] Los datos sensibles están protegidos
- [ ] La autenticación/autorización es correcta
- [ ] Las entradas están sanitizadas

### ⚡ Performance
- [ ] No hay operaciones N+1
- [ ] Las consultas a BD son eficientes
- [ ] El uso de memoria es razonable
- [ ] No hay memory leaks potenciales

### 🧪 Testing
- [ ] Los tests cubren los casos principales
- [ ] Los tests son claros y mantenibles
- [ ] Los mocks son apropiados
- [ ] La cobertura es adecuada

### 📚 Documentación
- [ ] El código es auto-documentado
- [ ] Los comentarios explican el "por qué", no el "qué"
- [ ] La documentación está actualizada
- [ ] Los README son claros

### 🎨 Estilo y Convenciones
- [ ] Sigue las convenciones del proyecto
- [ ] Los nombres son descriptivos
- [ ] La estructura es consistente
- [ ] No hay código comentado innecesario
```

### Template de Pull Request

```markdown
# Pull Request Template

## 📝 Descripción
<!-- Describe qué hace este PR y por qué es necesario -->

## 🔧 Tipo de cambio
- [ ] 🐛 Bug fix (cambio que arregla un issue)
- [ ] ✨ Nueva funcionalidad (cambio que agrega funcionalidad)
- [ ] 💥 Breaking change (fix o feature que causa que funcionalidad existente no funcione)
- [ ] 📚 Documentación (cambios solo en documentación)
- [ ] 🎨 Refactoring (cambio que no es fix ni feature)
- [ ] ⚡ Performance (cambio que mejora performance)
- [ ] ✅ Tests (agregar tests faltantes o corregir existentes)

## 🧪 ¿Cómo se ha probado?
<!-- Describe las pruebas que ejecutaste para verificar tus cambios -->

- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Tests manuales
- [ ] Tests E2E

## 📸 Screenshots (si aplica)
<!-- Agregar screenshots si hay cambios en UI -->

## 📋 Checklist

### Desarrollo
- [ ] Mi código sigue las guías de estilo del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código, especialmente en áreas difíciles de entender
- [ ] He hecho los cambios correspondientes en la documentación
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He agregado tests que prueban mi fix/feature
- [ ] Tests nuevos y existentes pasan localmente con mis cambios

### Seguridad
- [ ] He revisado mi código por vulnerabilidades de seguridad
- [ ] Los datos sensibles están protegidos
- [ ] Las validaciones de entrada son suficientes
- [ ] No hay secrets hardcodeados

### Performance
- [ ] He considerado el impacto en performance
- [ ] No hay operaciones N+1 introducidas
- [ ] Las consultas a BD son eficientes

## 🔗 Issues relacionados
<!-- Lista de issues que este PR resuelve -->
- Closes #(issue number)
- Fixes #(issue number)
- Resolves #(issue number)

## 🚀 Deployment Notes
<!-- Cualquier nota especial para deployment -->

## 📝 Notas adicionales para reviewers
<!-- Cualquier contexto adicional que los reviewers deberían saber -->
```

### Herramientas de Code Review automatizado

```yaml
# .github/workflows/code-review.yml
name: Automated Code Review

on:
  pull_request:
    branches: [main, develop]

jobs:
  automated-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint with annotations
        run: |
          npm run lint -- \
            --format @microsoft/eslint-formatter-sarif \
            --output-file eslint-results.sarif
        continue-on-error: true

      - name: Upload ESLint results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: eslint-results.sarif

      - name: Run SonarCloud analysis
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

      - name: Run CodeClimate analysis
        uses: codeclimate/codeclimate-action@v1
        with:
          token: ${{ secrets.CODECLIMATE_TOKEN }}

      - name: Check test coverage
        run: |
          npm run test:coverage
          npx istanbul check-coverage --statements 80 --branches 75 --functions 80 --lines 80

      - name: Check bundle size
        uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}

      - name: Comment PR with review summary
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            
            // Leer resultados de análisis
            const eslintResults = JSON.parse(fs.readFileSync('eslint-results.sarif', 'utf8'));
            const coverageReport = fs.readFileSync('coverage/text-summary.txt', 'utf8');
            
            // Crear comentario de resumen
            const comment = `
            ## 🤖 Automated Code Review Summary
            
            ### 📊 Code Quality Metrics
            - **ESLint Issues**: ${eslintResults.runs[0].results.length}
            - **Test Coverage**: 
            \`\`\`
            ${coverageReport}
            \`\`\`
            
            ### 🔍 Analysis Results
            - ✅ SonarCloud analysis completed
            - ✅ CodeClimate analysis completed
            - ✅ Bundle size check completed
            
            ### 📝 Recommendations
            ${eslintResults.runs[0].results.length > 0 ? '- Please fix ESLint issues before merging' : '- No ESLint issues found'}
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

---

## 📚 Documentation: La biblioteca del conocimiento {#documentation}

La documentación es como la **biblioteca del conocimiento** de tu proyecto. Debe ser clara, actualizada y accesible.

### Estructura de documentación

```
docs/
├── README.md                 # Introducción y setup básico
├── CONTRIBUTING.md          # Guía para contribuir
├── DEPLOYMENT.md            # Guía de deployment
├── ARCHITECTURE.md          # Arquitectura del sistema
├── API.md                   # Documentación de API
├── TROUBLESHOOTING.md       # Solución de problemas
├── CHANGELOG.md             # Historial de cambios
├── SECURITY.md              # Políticas de seguridad
├── development/             # Documentación para desarrolladores
│   ├── setup.md            # Setup del ambiente de desarrollo
│   ├── testing.md          # Guía de testing
│   ├── database.md         # Esquema y migraciones
│   └── coding-standards.md # Estándares de código
├── operations/              # Documentación para operaciones
│   ├── monitoring.md       # Guías de monitoreo
│   ├── backup.md           # Procedimientos de backup
│   └── disaster-recovery.md # Plan de recuperación
└── user/                   # Documentación para usuarios
    ├── getting-started.md  # Primeros pasos
    ├── user-guide.md       # Guía de usuario
    └── faq.md              # Preguntas frecuentes
```

### README.md comprensivo

```markdown
# MyApp - Sistema de Gestión de Librería Digital

[![Build Status](https://github.com/company/myapp/workflows/CI/badge.svg)](https://github.com/company/myapp/actions)
[![Coverage Status](https://codecov.io/gh/company/myapp/branch/main/graph/badge.svg)](https://codecov.io/gh/company/myapp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 Descripción

MyApp es una aplicación web moderna para la gestión de librerías digitales, construida con NestJS, TypeScript y PostgreSQL. Permite gestionar libros, autores, usuarios y préstamos de manera eficiente y escalable.

## ✨ Características principales

- 🔐 **Autenticación segura** con JWT y 2FA
- 📚 **Gestión completa de libros** y autores
- 👥 **Sistema de usuarios** con roles y permisos
- 📊 **Dashboard analítico** con métricas en tiempo real
- 🔍 **Búsqueda avanzada** con filtros múltiples
- 📱 **API RESTful** completamente documentada
- 🚀 **Alta performance** con cache Redis
- 📈 **Monitoreo** con Prometheus y Grafana

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (NestJS)      │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Cache         │
                       │   (Redis)       │
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerrequisitos

- Node.js >= 18.0.0
- PostgreSQL >= 13
- Redis >= 6.0
- Docker (opcional)

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/company/myapp.git
cd myapp
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de ambiente**
```bash
cp .env.example .env.local
# Editar .env.local con tus configuraciones
```

4. **Iniciar servicios de desarrollo**
```bash
# Con Docker (recomendado)
make setup

# O manualmente
npm run dev:setup
```

5. **Ejecutar migraciones y seeders**
```bash
npm run db:migrate
npm run db:seed
```

6. **Iniciar la aplicación**
```bash
npm run start:dev
```

La aplicación estará disponible en http://localhost:3000

## 📚 Documentación

- **[API Documentation](https://myapp.dev.company.com/api/docs)** - Documentación interactiva de la API
- **[Architecture Guide](docs/ARCHITECTURE.md)** - Guía de arquitectura del sistema
- **[Development Setup](docs/development/setup.md)** - Setup detallado para desarrollo
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Guía de deployment
- **[Contributing Guide](CONTRIBUTING.md)** - Cómo contribuir al proyecto

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚀 Deployment

### Staging
```bash
npm run deploy:staging
```

### Production
```bash
npm run deploy:production
```

Ver [Deployment Guide](docs/DEPLOYMENT.md) para más detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

Ver [Contributing Guide](CONTRIBUTING.md) para más detalles.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Tech Lead**: [@johndoe](https://github.com/johndoe)
- **Backend Lead**: [@janesmith](https://github.com/janesmith)
- **DevOps**: [@bobwilson](https://github.com/bobwilson)

## 📞 Soporte

- 📧 Email: support@company.com
- 💬 Slack: #myapp-support
- 🐛 Issues: [GitHub Issues](https://github.com/company/myapp/issues)
```

### Documentación de API con OpenAPI

```typescript
// src/main.ts - Configuración de Swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('MyApp API')
  .setDescription(`
# MyApp API Documentation

Esta es la documentación completa de la API de MyApp.

## Autenticación

La API utiliza JWT Bearer tokens para autenticación:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Rate Limiting

- **General**: 100 requests por 15 minutos por IP
- **Login**: 5 intentos por 15 minutos por IP
- **API Keys**: 1000 requests por hora por usuario

## Códigos de Estado

- **200**: OK
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **422**: Unprocessable Entity
- **429**: Too Many Requests
- **500**: Internal Server Error

## Ejemplos de Uso

### Autenticación
\`\`\`bash
curl -X POST /auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com", "password": "password123"}'
\`\`\`

### Obtener libros
\`\`\`bash
curl -X GET /books \\
  -H "Authorization: Bearer <token>" \\
  -G -d "page=1&limit=10&search=javascript"
\`\`\`
  `)
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .addTag('auth', 'Autenticación y autorización')
  .addTag('users', 'Gestión de usuarios')
  .addTag('books', 'Gestión de libros')
  .addTag('authors', 'Gestión de autores')
  .addTag('loans', 'Gestión de préstamos')
  .addTag('analytics', 'Métricas y analíticas')
  .addServer('https://api.myapp.com', 'Production')
  .addServer('https://api.staging.myapp.com', 'Staging')
  .addServer('http://localhost:3000', 'Development')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document, {
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true,
    syntaxHighlight: {
      activate: true,
      theme: 'tomorrow-night',
    },
  },
  customSiteTitle: 'MyApp API Docs',
  customfavIcon: '/favicon.ico',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
  ],
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
});
```

---

## 🎭 Team Collaboration: La orquesta sinfónica {#team-collaboration}

La colaboración en equipo es como una **orquesta sinfónica**. Cada músico tiene su parte, pero todos tocan la misma partitura.

### Metodología Agile/Scrum

```markdown
# Sprint Planning Template

## 🎯 Sprint Goal
<!-- Objetivo principal del sprint -->

## 📅 Sprint Details
- **Duration**: 2 semanas
- **Start Date**: [Fecha de inicio]
- **End Date**: [Fecha de fin]
- **Sprint Master**: [Nombre]
- **Product Owner**: [Nombre]

## 👥 Team Capacity
- **Total Story Points**: 50
- **Available Developers**: 4
- **Holidays/Vacations**: [Detalles]

## 📋 Sprint Backlog

### 🔥 High Priority
- [ ] **US-001**: Como usuario, quiero poder registrarme (5 pts)
- [ ] **US-002**: Como admin, quiero gestionar usuarios (8 pts)
- [ ] **BUG-001**: Corregir problema de login (3 pts)

### 🔸 Medium Priority
- [ ] **US-003**: Como usuario, quiero buscar libros (5 pts)
- [ ] **TECH-001**: Implementar cache Redis (13 pts)

### 🔹 Low Priority
- [ ] **US-004**: Como usuario, quiero recibir notificaciones (8 pts)

## 🎯 Definition of Done
- [ ] Código revisado y aprobado
- [ ] Tests unitarios con 80%+ cobertura
- [ ] Tests de integración pasando
- [ ] Documentación actualizada
- [ ] Deployed en staging
- [ ] QA sign-off
- [ ] Product Owner acceptance

## 🚧 Risks and Dependencies
- **Risk**: API externa puede estar inestable
- **Dependency**: Equipo de UX debe entregar diseños
```

### Daily Standup Format

```markdown
# Daily Standup - [Fecha]

## 👨‍💻 [Nombre del Developer]

### ✅ Yesterday
- Completé la implementación de autenticación JWT
- Revisé PR de gestión de usuarios
- Participé en session de troubleshooting

### 🎯 Today
- Implementar rate limiting para API
- Escribir tests de integración para auth
- Code review de feature de búsqueda

### 🚧 Blockers
- Necesito clarificación sobre requisitos de 2FA
- Esperando respuesta del equipo de DevOps sobre configuración

### 📊 Sprint Progress
- **Completed**: 13 pts / 50 pts
- **In Progress**: US-002 (8 pts)
- **Confidence Level**: 🟢 High
```

### Branch Strategy y Git Workflow

```mermaid
gitGraph:
    commit id: "Initial"
    branch develop
    checkout develop
    commit id: "Setup"
    
    branch feature/auth
    checkout feature/auth
    commit id: "Add login"
    commit id: "Add 2FA"
    checkout develop
    merge feature/auth
    commit id: "Auth complete"
    
    branch feature/books
    checkout feature/books
    commit id: "Book model"
    commit id: "Book API"
    checkout develop
    merge feature/books
    commit id: "Books complete"
    
    branch release/v1.0
    checkout release/v1.0
    commit id: "Version bump"
    commit id: "Bug fixes"
    
    checkout main
    merge release/v1.0
    commit id: "Release v1.0"
    tag: "v1.0.0"
    
    checkout develop
    merge main
    commit id: "Sync main"
```

### Communication Guidelines

```markdown
# Communication Guidelines

## 📱 Communication Channels

### Slack Channels
- **#general**: Anuncios generales y noticias del equipo
- **#development**: Discusiones técnicas y dudas de código
- **#deployments**: Notificaciones de deployments y releases
- **#bugs**: Reporte y seguimiento de bugs
- **#random**: Conversaciones casuales y team building

### Email
- **Formal communications**: Comunicaciones con stakeholders externos
- **Weekly reports**: Reportes semanales de progreso
- **Policy changes**: Cambios en políticas y procedimientos

### Meetings
- **Daily Standup**: 9:00 AM (15 min max)
- **Sprint Planning**: Lunes cada 2 semanas (2 horas)
- **Sprint Review**: Viernes cada 2 semanas (1 hora)
- **Retrospective**: Viernes cada 2 semanas (45 min)

## 🔔 Notification Protocols

### Severity Levels
- **🚨 P0 - Critical**: Producción down, seguridad comprometida
- **⚠️ P1 - High**: Feature principal no funciona
- **🔸 P2 - Medium**: Bug menor, performance degradada
- **🔹 P3 - Low**: Mejoras, feature requests

### Response Times
- **P0**: Immediate response (< 15 min)
- **P1**: Within 2 hours
- **P2**: Within 24 hours
- **P3**: Within 3 business days

### Escalation Path
1. **Developer** → Team Lead
2. **Team Lead** → Engineering Manager
3. **Engineering Manager** → CTO
4. **CTO** → CEO (P0 only)
```

---

## 🚨 Disaster Recovery: El plan de emergencia {#disaster-recovery}

El disaster recovery es como el **plan de emergencia de un hospital**. Esperamos nunca usarlo, pero debe estar perfecto cuando lo necesitemos.

### Plan de Recuperación de Desastres

```markdown
# Disaster Recovery Plan

## 🎯 Objetivos
- **RTO (Recovery Time Objective)**: 4 horas
- **RPO (Recovery Point Objective)**: 1 hora
- **Uptime Target**: 99.9%

## 🚨 Clasificación de Incidentes

### Severity 1 - Critical
- **Descripción**: Servicio completamente down
- **Tiempo de respuesta**: 15 minutos
- **Escalación**: Inmediata al CTO

### Severity 2 - High
- **Descripción**: Funcionalidad principal afectada
- **Tiempo de respuesta**: 1 hora
- **Escalación**: Team Lead después de 2 horas

### Severity 3 - Medium
- **Descripción**: Funcionalidad menor afectada
- **Tiempo de respuesta**: 4 horas
- **Escalación**: Durante horas de oficina

## 🔄 Procedimientos de Recovery

### Database Recovery
1. **Identificar el problema**
2. **Verificar backups disponibles**
3. **Ejecutar recovery desde backup**
4. **Validar integridad de datos**
5. **Reanudar operaciones**

### Application Recovery
1. **Identificar el componente afectado**
2. **Verificar logs y métricas**
3. **Ejecutar rollback si es necesario**
4. **Restart de servicios**
5. **Validar funcionalidad**
```

### Scripts de Backup automatizados

```bash
#!/bin/bash
# scripts/backup.sh

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
RETENTION_DAYS=30

echo "🔄 Starting backup process at $(date)"

# Database backup
echo "📊 Backing up database..."
pg_dump $DATABASE_URL | gzip > "${BACKUP_DIR}/db_backup_${TIMESTAMP}.sql.gz"

# Redis backup
echo "💾 Backing up Redis..."
redis-cli --rdb "${BACKUP_DIR}/redis_backup_${TIMESTAMP}.rdb"

# Application files backup
echo "📁 Backing up application files..."
tar -czf "${BACKUP_DIR}/app_backup_${TIMESTAMP}.tar.gz" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='logs' \
    /app

# Upload to S3
echo "☁️ Uploading to S3..."
aws s3 cp "${BACKUP_DIR}/" "s3://${S3_BACKUP_BUCKET}/$(date +%Y/%m/%d)/" --recursive

# Cleanup old backups
echo "🧹 Cleaning up old backups..."
find "${BACKUP_DIR}" -name "*.gz" -mtime +${RETENTION_DAYS} -delete
find "${BACKUP_DIR}" -name "*.rdb" -mtime +${RETENTION_DAYS} -delete
find "${BACKUP_DIR}" -name "*.tar.gz" -mtime +${RETENTION_DAYS} -delete

# Verify backup integrity
echo "✅ Verifying backup integrity..."
gunzip -t "${BACKUP_DIR}/db_backup_${TIMESTAMP}.sql.gz"
tar -tzf "${BACKUP_DIR}/app_backup_${TIMESTAMP}.tar.gz" > /dev/null

echo "✅ Backup completed successfully at $(date)"

# Send notification
curl -X POST $SLACK_WEBHOOK \
    -H 'Content-type: application/json' \
    --data "{\"text\":\"✅ Backup completed: ${TIMESTAMP}\"}"
```

### Recovery Testing

```bash
#!/bin/bash
# scripts/test-recovery.sh

set -e

echo "🧪 Testing disaster recovery procedures..."

# Test database recovery
echo "📊 Testing database recovery..."
./scripts/restore-db.sh test_backup.sql.gz test_db
psql test_db -c "SELECT COUNT(*) FROM users;" > /dev/null
echo "✅ Database recovery test passed"

# Test application recovery
echo "🚀 Testing application recovery..."
docker-compose -f docker-compose.test.yml up -d
sleep 30
curl -f http://localhost:3000/health || exit 1
docker-compose -f docker-compose.test.yml down
echo "✅ Application recovery test passed"

# Test backup integrity
echo "🔍 Testing backup integrity..."
./scripts/verify-backups.sh
echo "✅ Backup integrity test passed"

echo "🎉 All recovery tests passed!"
```

---

## ⚡ Performance: La optimización continua {#performance}

La optimización de performance es como **sintonizar un auto de carreras**. Pequeños ajustes pueden marcar grandes diferencias.

### Monitoreo de Performance

```typescript
// src/performance/performance.service.ts
import { Injectable } from '@nestjs/common';
import { MetricsService } from '../monitoring/metrics.service';
import * as cluster from 'cluster';
import * as os from 'os';

@Injectable()
export class PerformanceService {
  constructor(private metricsService: MetricsService) {
    this.startPerformanceMonitoring();
  }

  private startPerformanceMonitoring() {
    // Monitor cada 30 segundos
    setInterval(() => {
      this.collectPerformanceMetrics();
    }, 30000);
  }

  private collectPerformanceMetrics() {
    // CPU Usage
    const cpuUsage = process.cpuUsage();
    this.metricsService.recordCPUUsage(cpuUsage.user, cpuUsage.system);

    // Memory Usage
    const memUsage = process.memoryUsage();
    this.metricsService.recordMemoryUsage(memUsage);

    // Event Loop Lag
    const start = process.hrtime.bigint();
    setImmediate(() => {
      const lag = Number(process.hrtime.bigint() - start) / 1000000; // ms
      this.metricsService.recordEventLoopLag(lag);
    });

    // GC Statistics
    if (global.gc) {
      const before = process.memoryUsage();
      global.gc();
      const after = process.memoryUsage();
      const freed = before.heapUsed - after.heapUsed;
      this.metricsService.recordGCStats(freed);
    }
  }

  async measureAsyncOperation<T>(
    operation: () => Promise<T>,
    operationName: string,
  ): Promise<T> {
    const start = process.hrtime.bigint();
    
    try {
      const result = await operation();
      const duration = Number(process.hrtime.bigint() - start) / 1000000;
      this.metricsService.recordOperationDuration(operationName, duration, true);
      return result;
    } catch (error) {
      const duration = Number(process.hrtime.bigint() - start) / 1000000;
      this.metricsService.recordOperationDuration(operationName, duration, false);
      throw error;
    }
  }
}
```

### Optimización de Base de Datos

```typescript
// src/database/query-optimizer.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class QueryOptimizerService {
  constructor(private dataSource: DataSource) {}

  // Detectar consultas lentas
  async analyzeSlowQueries() {
    const slowQueries = await this.dataSource.query(`
      SELECT 
        query,
        calls,
        total_time,
        mean_time,
        min_time,
        max_time
      FROM pg_stat_statements 
      WHERE mean_time > 100 -- consultas que toman más de 100ms en promedio
      ORDER BY mean_time DESC 
      LIMIT 20;
    `);

    return slowQueries;
  }

  // Sugerir índices faltantes
  async suggestMissingIndexes() {
    const suggestions = await this.dataSource.query(`
      SELECT 
        schemaname,
        tablename,
        attname,
        n_distinct,
        correlation
      FROM pg_stats
      WHERE schemaname = 'public'
        AND n_distinct > 100
        AND abs(correlation) < 0.1;
    `);

    return suggestions;
  }

  // Analizar uso de índices
  async analyzeIndexUsage() {
    const indexStats = await this.dataSource.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        idx_tup_read,
        idx_tup_fetch,
        idx_scan
      FROM pg_stat_user_indexes
      WHERE idx_scan = 0  -- índices no utilizados
      ORDER BY schemaname, tablename;
    `);

    return indexStats;
  }
}
```

### Cache Strategy

```typescript
// src/cache/cache.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@InjectRedis() private redis: Redis) {}

  // Cache con TTL automático
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    const serializedValue = JSON.stringify(value);
    await this.redis.setex(key, ttl, serializedValue);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  // Cache con refresh automático
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = 3600,
  ): Promise<T> {
    let value = await this.get<T>(key);
    
    if (value === null) {
      value = await factory();
      await this.set(key, value, ttl);
    }
    
    return value;
  }

  // Cache con invalidación inteligente
  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // Cache multi-level
  async getWithFallback<T>(
    primaryKey: string,
    fallbackKey: string,
    factory: () => Promise<T>,
    primaryTTL: number = 300,  // 5 minutos
    fallbackTTL: number = 3600, // 1 hora
  ): Promise<T> {
    // Intentar cache principal
    let value = await this.get<T>(primaryKey);
    if (value !== null) return value;

    // Intentar cache fallback
    value = await this.get<T>(fallbackKey);
    if (value !== null) {
      // Refresh cache principal en background
      this.refreshCacheInBackground(primaryKey, factory, primaryTTL);
      return value;
    }

    // Generar valor y cachear en ambos niveles
    value = await factory();
    await Promise.all([
      this.set(primaryKey, value, primaryTTL),
      this.set(fallbackKey, value, fallbackTTL),
    ]);

    return value;
  }

  private async refreshCacheInBackground<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number,
  ): Promise<void> {
    // No esperar, ejecutar en background
    setImmediate(async () => {
      try {
        const value = await factory();
        await this.set(key, value, ttl);
      } catch (error) {
        console.error(`Failed to refresh cache for key ${key}:`, error);
      }
    });
  }
}
```

---

## 🛠️ Proyecto práctico: Configurando un pipeline completo {#proyecto-practico}

Vamos a implementar un pipeline completo de CI/CD para una aplicación real.

### Estructura del proyecto final

```
myapp/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd.yml
│       └── security.yml
├── docker/
│   ├── Dockerfile.development
│   ├── Dockerfile.production
│   └── docker-compose.yml
├── k8s/
│   ├── namespace.yml
│   ├── configmap.yml
│   ├── secret.yml
│   ├── deployment.yml
│   ├── service.yml
│   └── ingress.yml
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   ├── backup.sh
│   └── test.sh
├── monitoring/
│   ├── prometheus.yml
│   ├── grafana/
│   └── alerts.yml
├── docs/
│   ├── README.md
│   ├── DEPLOYMENT.md
│   └── TROUBLESHOOTING.md
├── src/
│   ├── modules/
│   ├── shared/
│   ├── config/
│   └── main.ts
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

### Script de setup completo

```bash
#!/bin/bash
# scripts/setup.sh

set -e

PROJECT_NAME="myapp"
ENVIRONMENT=${1:-development}

echo "🚀 Setting up $PROJECT_NAME for $ENVIRONMENT environment..."

# Verificar prerrequisitos
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required"; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo "❌ kubectl is required"; exit 1; }

# Instalar dependencias
echo "📦 Installing dependencies..."
npm ci

# Configurar variables de ambiente
if [ ! -f ".env.${ENVIRONMENT}" ]; then
    echo "⚙️ Creating environment configuration..."
    cp .env.example ".env.${ENVIRONMENT}"
    echo "📝 Please edit .env.${ENVIRONMENT} with your configuration"
fi

# Setup Docker
echo "🐳 Setting up Docker environment..."
docker-compose -f "docker-compose.${ENVIRONMENT}.yml" up -d

# Esperar a que los servicios estén listos
echo "⏳ Waiting for services to be ready..."
timeout 300 bash -c 'until docker-compose -f docker-compose.'"${ENVIRONMENT}"'.yml exec postgres pg_isready; do sleep 5; done'

# Ejecutar migraciones
echo "🗄️ Running database migrations..."
npm run typeorm:migration:run

# Ejecutar seeders
if [ "$ENVIRONMENT" != "production" ]; then
    echo "🌱 Seeding database..."
    npm run db:seed
fi

# Verificar instalación
echo "🔍 Verifying installation..."
npm run test:unit
npm run lint

# Generar documentación
echo "📚 Generating documentation..."
npm run docs:generate

echo "✅ Setup completed successfully!"
echo "🔗 Application: http://localhost:3000"
echo "📊 Monitoring: http://localhost:3001"
echo "📚 Docs: http://localhost:3000/api/docs"
```

---

## ✅ Checklist de mejores prácticas {#checklist-mejores-practicas}

### 🛠️ Desarrollo

#### Código
- [ ] Código sigue convenciones establecidas
- [ ] Variables y funciones tienen nombres descriptivos
- [ ] Funciones son pequeñas y hacen una sola cosa
- [ ] No hay código duplicado
- [ ] Comentarios explican el "por qué", no el "qué"
- [ ] No hay código comentado o TODO antiguos

#### Testing
- [ ] Cobertura de tests > 80%
- [ ] Tests unitarios para lógica de negocio
- [ ] Tests de integración para APIs
- [ ] Tests E2E para flujos críticos
- [ ] Tests son mantenibles y legibles
- [ ] Mocks son apropiados y no excesivos

#### Seguridad
- [ ] Validación de inputs en todos los endpoints
- [ ] Sanitización de datos de salida
- [ ] Autenticación y autorización implementadas
- [ ] Rate limiting configurado
- [ ] Headers de seguridad establecidos
- [ ] No hay secrets hardcodeados

### 🏗️ Arquitectura

#### Estructura
- [ ] Separación clara de responsabilidades
- [ ] Principios SOLID aplicados
- [ ] Arquitectura por capas definida
- [ ] Patrones de diseño apropiados
- [ ] Dependencias bien gestionadas

#### Performance
- [ ] Consultas de base de datos optimizadas
- [ ] Cache implementado donde corresponde
- [ ] Recursos estáticos optimizados
- [ ] Memory leaks identificados y corregidos
- [ ] Profiling de performance realizado

### 🚀 DevOps

#### CI/CD
- [ ] Pipeline de CI configurado
- [ ] Tests automáticos en CI
- [ ] Build automático exitoso
- [ ] Deployment automático a staging
- [ ] Rollback automático en caso de fallo
- [ ] Notificaciones configuradas

#### Infraestructura
- [ ] Ambientes aislados y consistentes
- [ ] Configuración como código
- [ ] Monitoreo y alertas configurados
- [ ] Backups automáticos
- [ ] Plan de disaster recovery
- [ ] Escalabilidad horizontal posible

### 📊 Monitoreo

#### Métricas
- [ ] Métricas de aplicación configuradas
- [ ] Métricas de infraestructura configuradas
- [ ] Dashboards informativos
- [ ] Alertas proactivas
- [ ] SLIs y SLOs definidos

#### Logs
- [ ] Logging estructurado implementado
- [ ] Diferentes niveles de log
- [ ] Correlación de logs por request
- [ ] Centralización de logs
- [ ] Retención apropiada de logs

### 📚 Documentación

#### Código
- [ ] README.md completo y actualizado
- [ ] Documentación de API actualizada
- [ ] Guía de instalación clara
- [ ] Ejemplos de uso incluidos
- [ ] Changelog mantenido

#### Procesos
- [ ] Guía de contribución
- [ ] Procedimientos de deployment
- [ ] Guía de troubleshooting
- [ ] Documentación de arquitectura
- [ ] Runbooks para operaciones

### 🤝 Colaboración

#### Git
- [ ] Commits descriptivos y atómicos
- [ ] Branching strategy definida
- [ ] Pull requests con descripción clara
- [ ] Code review obligatorio
- [ ] Historial de Git limpio

#### Comunicación
- [ ] Canales de comunicación claros
- [ ] Ceremonias ágiles establecidas
- [ ] Documentación de decisiones
- [ ] Escalación definida para incidentes
- [ ] Knowledge sharing regular

---

## 🎯 Conclusión

Has completado la masterclass de ambientes de desarrollo IT y mejores prácticas. Ahora tienes las herramientas para:

### ✅ **Gestionar ambientes profesionalmente**
- Configurar ambientes locales, desarrollo, staging y producción
- Implementar CI/CD pipelines robustos
- Automatizar deployments con confianza

### ✅ **Implementar seguridad de clase empresarial**
- Autenticación y autorización robusta
- Rate limiting y protección contra ataques
- Gestión segura de secretos y configuraciones

### ✅ **Monitorear y optimizar sistemas**
- Métricas y logs estructurados
- Dashboards y alertas proactivas
- Optimización de performance continua

### ✅ **Colaborar efectivamente en equipo**
- Code review y documentación
- Metodologías ágiles
- Comunicación clara y eficiente

### ✅ **Manejar crisis y recuperación**
- Plans de disaster recovery
- Backups automatizados
- Procedimientos de escalación

### 🚀 Próximos pasos

1. **Implementa** estos conceptos en tu proyecto actual
2. **Experimenta** con diferentes herramientas y tecnologías
3. **Contribuye** a proyectos open source
4. **Comparte** tu conocimiento con el equipo
5. **Mantente actualizado** con las últimas tendencias

**¡Felicidades! Ya eres un desarrollador con mentalidad DevOps. 🎉**