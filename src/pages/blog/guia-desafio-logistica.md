---
title: "Guía Desafío Técnico: Plataforma de Logística"
code: "guia-desafio-logistica"
description: "Cómo resolver el desafío de arquitectura para una plataforma de despacho logístico moderna"
pubDate: "May 06 2026"
heroImage: "../../assets/blog-placeholder-2.jpg"
---


## ¿Qué vas a aprender

En este contenido explorarás los conceptos clave y su aplicación práctica:

- Fundamentos teóricos y contexto necesario para entender el tema
- Aplicaciones prácticas y casos de uso reales
- Herramientas, técnicas y mejores prácticas recomendadas
- Ejemplos guiados paso a paso
- Errores comunes, anti-patrones y cómo evitarlos


# Guía del Desafío Técnico: Plataforma de Dashboard Logístico

## Introducción

Este documento te guía paso a paso para resolver el desafío técnico de la plataforma de logística. El objetivo es evaluar tu capacidad para construir una arquitectura limpia, escalable y mantenible.

## Paso 1: Planificación Arquitectónica

### Define la estructura de módulos

```
Backend:
- auth/          # Autenticación y autorización
- drivers/       # Gestión de conductores
- vehicles/      # Gestión de vehículos
- activities/    # Gestión de actividades
- common/        # Utilidades compartidas
```

### Diseña los modelos de datos

```sql
-- Usuarios/Conductores
User: id, email, name, password, role, createdAt

-- Vehículos
Vehicle: id, plate, brand, model, capacity, status, driverId

-- Actividades
Activity: id, title, description, scheduledDate, priority, status, driverId, createdAt
```

## Paso 2: Backend con NestJS

### Configuración inicial

```bash
npm i -g @nestjs/cli
nest new backend --strict
cd backend
npm install @prisma/client prisma
npm install class-validator class-transformer
npm install @nestjs/jwt @nestjs/passport passport passport-local bcrypt
```

### Estructura de módulos

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── dto/
│   ├── drivers/
│   ├── vehicles/
│   └── activities/
├── common/
│   ├── filters/
│   ├── interceptors/
│   └── prisma/
└── app.module.ts
```

### Patrón Repository + Service

```typescript
// activities.repository.ts
@Injectable()
export class ActivitiesRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Activity[]> {
    return this.prisma.activity.findMany({ include: { driver: true } });
  }

  async create(data: CreateActivityDto): Promise<Activity> {
    return this.prisma.activity.create({ data });
  }
}

// activities.service.ts
@Injectable()
export class ActivitiesService {
  constructor(private activitiesRepository: ActivitiesRepository) {}

  getActivities(): Promise<Activity[]> {
    return this.activitiesRepository.findAll();
  }

  createActivity(dto: CreateActivityDto): Promise<Activity> {
    return this.activitiesRepository.create(dto);
  }
}
```

## Paso 3: Frontend con Next.js

### Estructura de características

```
src/
├── features/
│   ├── auth/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   └── store.ts
│   ├── activities/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   └── shared/
│       ├── components/
│       ├── lib/
│       └── ui/
├── services/
│   └── api/
└── app/
```

### Gestión de estado con React Context

```typescript
// features/auth/store.ts
interface AuthState {
  user: User | null;
  token: string | null;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthState>({});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (credentials: LoginDto) => {
    const response = await api.post('/auth/login', credentials);
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Paso 4: API Abstraction Layer

```typescript
// services/api/client.ts
class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    return response.json();
  }
}

export const apiClient = new ApiClient();
```

## Paso 5: Componentes Reutilizables

```tsx
// shared/components/Card.tsx
interface CardProps {
  title: string;
  value: number;
  trend?: number;
  icon?: React.ReactNode;
}

export function StatCard({ title, value, trend, icon }: CardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </p>
        )}
      </div>
    </div>
  );
}
```

## Paso 6: Responsive Design

```tsx
// Dashboard layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard title="Actividades" value={stats.activities} />
  <StatCard title="Completadas" value={stats.completed} />
  <StatCard title="Pendientes" value={stats.pending} />
  <StatCard title="Vehículos" value={stats.vehicles} />
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
  <div className="lg:col-span-2">
    <ActivitiesTable />
  </div>
  <div>
    <VehiclesStatus />
  </div>
</div>
```

## Paso 7: Validaciones y Manejo de Errores

```typescript
// DTOs con validación
export class CreateActivityDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  description: string;

  @IsDate()
  scheduledDate: Date;

  @IsEnum(Priority)
  priority: Priority;

  @IsUUID('4', { each: true })
  driverId?: string;
}
```

## Paso 8: Dockerización

```dockerfile
# Backend Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/logistics
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3001:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3000

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: logistics
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Buenas Prácticas de Arquitectura

1. **Separación de responsabilidades**: Cada módulo tiene una única responsabilidad
2. **Inversión de dependencias**: Usa inyección de dependencias para testabilidad
3. **Principio de abierto/cerrado**: Extiende funcionalidad sin modificar código existente
4. **Nombres descriptivos**: `ActivitiesService` vs `AS`
5. **Documentación de APIs**: Usa Swagger/OpenAPI

## Consideraciones de Escalabilidad

- **Database**: Considera índices en campos frecuentemente consultados
- **Cache**: Usa Redis para datos frecuentes (estadísticas)
- **Colas**: Para tareas asíncronas (notificaciones, emails)
- **Load balancing**: Múltiples instancias del backend
- **CDN**: Para assets estáticos del frontend

## Pruebas

```typescript
// Unit tests
describe('ActivitiesService', () => {
  it('should return activities', async () => {
    const service = new ActivitiesService(mockRepository);
    const result = await service.getActivities();
    expect(result).toEqual(mockActivities);
  });
});

// E2E tests
describe('Activities API', () => {
  it('should create an activity', async () => {
    const response = await request(app.getHttpServer())
      .post('/activities')
      .send(createActivityDto)
      .expect(201);
    
    expect(response.body.title).toEqual(createActivityDto.title);
  });
});
```

## Checklist de Entrega

- [ ] Backend funcional con CRUD completo
- [ ] Frontend responsive y funcional
- [ ] Autenticación implementada
- [ ] Documentación de API
- [ ] README con arquitectura explicada
- [ ] Docker funcionando
- [ ] Pruebas unitarias básicas
- [ ] Screenshots del dashboard

## Recursos Adicionales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma ORM](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)