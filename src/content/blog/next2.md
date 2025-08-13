---
title: 'Next.js 15 y React'
code: 'react'
description: 'Master Class Completa: Next.js 15 y React'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Master Class Completa: Next.js 15 y React
## De Principiante a Experto en Desarrollo Web Moderno

---

## 🎯 **Introducción: El Viaje del Desarrollador Moderno**

Imagina que eres un chef que quiere abrir el mejor restaurante de la ciudad. React sería como conocer las técnicas básicas de cocina - sabes preparar ingredientes, cocinar y servir platos. Pero Next.js es como tener una cocina completamente equipada con los mejores electrodomésticos, un sistema de gestión de pedidos automatizado, y hasta un equipo de marketing que promociona tu restaurante mientras duermes.

### ¿Por qué Next.js?
En el mundo del desarrollo web, crear una aplicación React pura es como construir una casa desde cero cada vez. Next.js te proporciona una estructura prefabricada, herramientas profesionales y las mejores prácticas ya implementadas.

---

## 📚 **FASE 1: FUNDAMENTOS SÓLIDOS**

### **Capítulo 1: Configuración del Entorno**

#### 1.1 Instalación y Setup Inicial

```bash
# Crear nuevo proyecto Next.js 15
npx create-next-app@latest mi-proyecto-nextjs

# Opciones recomendadas:
# ✅ TypeScript
# ✅ ESLint
# ✅ Tailwind CSS
# ✅ src/ directory
# ✅ App Router
# ❌ Turbopack (aún experimental)
```

**Analogía:** Es como mudarte a una casa nueva que ya viene con electricidad, plomería y muebles básicos instalados, pero puedes personalizar todo a tu gusto.

#### 1.2 Estructura de Proyecto Profesional

```
mi-proyecto-nextjs/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── globals.css
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx           # Página principal
│   │   ├── loading.tsx        # UI de carga
│   │   ├── error.tsx          # UI de error
│   │   └── not-found.tsx      # Página 404
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/               # Componentes básicos
│   │   ├── forms/            # Formularios
│   │   └── layout/           # Componentes de layout
│   ├── lib/                  # Utilidades y configuraciones
│   │   ├── utils.ts
│   │   ├── validations.ts
│   │   └── constants.ts
│   ├── hooks/               # Custom hooks
│   ├── store/              # Estado global (Zustand/Redux)
│   └── types/              # Definiciones TypeScript
├── public/                 # Archivos estáticos
└── package.json
```

**Analogía:** Como organizar tu casa - cada cosa tiene su lugar específico, facilitando encontrar lo que necesitas y mantener el orden.

---

### **Capítulo 2: App Router - La Nueva Era de Next.js**

#### 2.1 Entendiendo el App Router

El App Router es como el sistema de navegación GPS de tu aplicación. A diferencia del Pages Router (la forma antigua), el App Router te permite:

- **Layouts anidados** (como muñecas rusas)
- **Carga paralela** de datos
- **Streaming de UI** 
- **React Server Components** por defecto

#### 2.2 Creando Rutas

```typescript
// src/app/page.tsx - Página principal "/"
export default function HomePage() {
  return (
    <div>
      <h1>Bienvenido a mi aplicación</h1>
    </div>
  );
}

// src/app/about/page.tsx - Página "/about"
export default function AboutPage() {
  return (
    <div>
      <h1>Acerca de nosotros</h1>
    </div>
  );
}

// src/app/blog/[slug]/page.tsx - Ruta dinámica "/blog/mi-articulo"
interface BlogPostProps {
  params: { slug: string };
}

export default function BlogPost({ params }: BlogPostProps) {
  return (
    <div>
      <h1>Artículo: {params.slug}</h1>
    </div>
  );
}
```

**Analogía:** Es como organizar un edificio - cada carpeta es un piso, y el archivo `page.tsx` es la puerta principal de ese piso.

#### 2.3 Layouts Anidados - El Poder de la Composición

```typescript
// src/app/layout.tsx - Layout principal (raíz)
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mi Aplicación Increíble',
  description: 'La mejor aplicación del mundo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header>
          <nav>Navegación Global</nav>
        </header>
        <main>{children}</main>
        <footer>Footer Global</footer>
      </body>
    </html>
  );
}

// src/app/dashboard/layout.tsx - Layout específico para dashboard
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <aside>Sidebar del Dashboard</aside>
      <section>{children}</section>
    </div>
  );
}
```

**Analogía:** Como las muñecas rusas - cada layout envuelve al siguiente, heredando y añadiendo características específicas.

---

### **Capítulo 3: React Server Components vs Client Components**

#### 3.1 La Filosofía Detrás de los Server Components

Imagina un restaurante donde algunos platos se preparan en la cocina (servidor) y se sirven listos, mientras otros se preparan en tu mesa (cliente). Los Server Components son los platos pre-preparados: más rápidos, eficientes y seguros.

```typescript
// Server Component (por defecto en App Router)
// Se ejecuta en el servidor, no envía JavaScript al cliente
async function ProductList() {
  const products = await fetch('https://api.ejemplo.com/products');
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}

// Client Component (requiere 'use client')
// Se ejecuta en el navegador, puede usar hooks y eventos
'use client';

import { useState } from 'react';

function InteractiveCounter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
    </div>
  );
}
```

#### 3.2 Cuándo Usar Cada Uno

| Server Components | Client Components |
|-------------------|-------------------|
| ✅ Fetch de datos | ✅ Interactividad |
| ✅ Acceso a BD | ✅ Hooks de React |
| ✅ SEO optimal | ✅ Event listeners |
| ✅ Carga rápida | ✅ Estado local |
| ✅ Tokens secretos | ✅ Efectos del navegador |

#### 3.3 Patrón de Composición Inteligente

```typescript
// Server Component padre
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  const reviews = await getReviews(params.id);
  
  return (
    <div>
      <ProductInfo product={product} />
      <ProductReviews reviews={reviews} />
      <AddToCartButton productId={product.id} /> {/* Client Component */}
    </div>
  );
}

// Client Component para interactividad
'use client';

function AddToCartButton({ productId }: { productId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(productId);
    setIsAdding(false);
  };
  
  return (
    <button 
      onClick={handleAddToCart} 
      disabled={isAdding}
    >
      {isAdding ? 'Agregando...' : 'Agregar al Carrito'}
    </button>
  );
}
```

**Analogía:** Como un teatro donde el decorado (Server) está fijo y optimizado, pero los actores (Client Components) proporcionan la interacción dinámica.

---

## 🚀 **FASE 2: TÉCNICAS AVANZADAS**

### **Capítulo 4: Gestión Avanzada de Datos**

#### 4.1 Server Actions - La Revolución de los Formularios

```typescript
// src/app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  // Validación
  if (!title || !content) {
    throw new Error('Título y contenido son requeridos');
  }
  
  // Crear post en la base de datos
  const post = await db.post.create({
    data: { title, content }
  });
  
  // Revalidar la cache y redirigir
  revalidatePath('/posts');
  redirect(`/posts/${post.id}`);
}

// src/app/create-post/page.tsx
import { createPost } from '../actions';

export default function CreatePostPage() {
  return (
    <form action={createPost}>
      <input 
        name="title" 
        placeholder="Título del post" 
        required 
      />
      <textarea 
        name="content" 
        placeholder="Contenido del post" 
        required 
      />
      <button type="submit">Crear Post</button>
    </form>
  );
}
```

**Analogía:** Como enviar una carta por correo - escribes el mensaje (formulario), lo metes en un sobre (Server Action), y el cartero (Next.js) se encarga de entregarlo de forma segura.

#### 4.2 Streaming y Suspense - Carga Progresiva

```typescript
// src/app/dashboard/page.tsx
import { Suspense } from 'react';
import { UserProfile } from './components/UserProfile';
import { RecentOrders } from './components/RecentOrders';
import { Analytics } from './components/Analytics';

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {/* Carga inmediata */}
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfile />
      </Suspense>
      
      {/* Carga paralela */}
      <div className="grid">
        <Suspense fallback={<OrdersSkeleton />}>
          <RecentOrders />
        </Suspense>
        
        <Suspense fallback={<AnalyticsSkeleton />}>
          <Analytics />
        </Suspense>
      </div>
    </div>
  );
}

// Componente con carga de datos
async function UserProfile() {
  const user = await getUserData(); // Simulamos 500ms
  
  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
    </div>
  );
}
```

**Analogía:** Como un restaurante que sirve los aperitivos mientras prepara el plato principal - no esperas a que todo esté listo para empezar a disfrutar.

#### 4.3 Cache y Revalidación Inteligente

```typescript
// Cache estática (por defecto)
async function getStaticData() {
  const data = await fetch('https://api.ejemplo.com/static-data');
  return data.json();
}

// Cache con revalidación temporal
async function getDynamicData() {
  const data = await fetch('https://api.ejemplo.com/dynamic-data', {
    next: { revalidate: 60 } // Revalida cada 60 segundos
  });
  return data.json();
}

// Sin cache (siempre fresh)
async function getRealtimeData() {
  const data = await fetch('https://api.ejemplo.com/realtime-data', {
    cache: 'no-store'
  });
  return data.json();
}

// Revalidación bajo demanda
// src/app/actions.ts
'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

export async function updateProduct(productId: string, data: ProductData) {
  await updateProductInDB(productId, data);
  
  // Revalida todas las requests con este tag
  revalidateTag('products');
  
  // Revalida una ruta específica
  revalidatePath(`/products/${productId}`);
}
```

**Analogía:** Como un periódico - algunas secciones se actualizan diariamente (cache con revalidación), otras son eternas (cache estática), y las noticias de última hora se actualizan constantemente (no-cache).

---

### **Capítulo 5: Optimización y Performance**

#### 5.1 Image Optimization - Imágenes de Calidad Profesional

```typescript
import Image from 'next/image';

// Imagen optimizada básica
function ProductImage({ product }) {
  return (
    <Image
      src={product.imageUrl}
      alt={product.name}
      width={400}
      height={300}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      className="rounded-lg"
    />
  );
}

// Hero image con prioridad
function HeroSection() {
  return (
    <div className="hero">
      <Image
        src="/hero-image.jpg"
        alt="Hero"
        fill
        priority // Carga inmediata
        className="object-cover"
        sizes="100vw"
      />
      <div className="hero-content">
        <h1>Bienvenido</h1>
      </div>
    </div>
  );
}

// Gallery con lazy loading
function ProductGallery({ images }) {
  return (
    <div className="gallery">
      {images.map((image, index) => (
        <Image
          key={image.id}
          src={image.url}
          alt={`Producto ${index + 1}`}
          width={200}
          height={200}
          loading={index < 3 ? "eager" : "lazy"}
          className="gallery-item"
        />
      ))}
    </div>
  );
}
```

**Analogía:** Como un fotógrafo profesional que automáticamente ajusta la calidad, tamaño y formato de cada foto según dónde se va a mostrar.

#### 5.2 Dynamic Imports y Code Splitting

```typescript
// Lazy loading de componentes pesados
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <p>Cargando gráfico...</p>,
  ssr: false // No renderizar en servidor
});

const ConditionalComponent = dynamic(() => import('./ConditionalComponent'), {
  loading: () => <div>Cargando...</div>
});

function Dashboard() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      <button onClick={() => setShowChart(true)}>
        Mostrar Gráfico Avanzado
      </button>
      
      {showChart && <HeavyChart />}
    </div>
  );
}

// Import condicional de bibliotecas
async function handleExportPDF() {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  // ... generar PDF
}
```

**Analogía:** Como una biblioteca que solo trae los libros que realmente vas a leer, en lugar de cargar toda la biblioteca de una vez.

#### 5.3 Bundle Analysis y Performance Monitoring

```bash
# Analizar el bundle
npm install --save-dev @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  experimental: {
    optimizePackageImports: ['lodash', 'date-fns']
  }
});

# Comando para analizar
ANALYZE=true npm run build
```

```typescript
// Monitoring de performance
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

// Custom performance monitoring
function usePerformanceMonitoring() {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('Performance metric:', entry);
        // Enviar a servicio de analytics
      }
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation'] });
    
    return () => observer.disconnect();
  }, []);
}
```

---

### **Capítulo 6: APIs y Integración de Datos**

#### 6.1 Route Handlers - Tu API Personalizada

```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// GET /api/products
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1');
  
  try {
    const products = await getProducts({ category, page });
    
    return NextResponse.json({
      products,
      pagination: {
        page,
        total: products.length
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }
  
  try {
    const body = await request.json();
    const product = await createProduct(body);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 400 }
    );
  }
}

// src/app/api/products/[id]/route.ts
interface Params {
  params: { id: string };
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  const product = await getProduct(params.id);
  
  if (!product) {
    return NextResponse.json(
      { error: 'Producto no encontrado' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(product);
}
```

**Analogía:** Como tener un asistente personal que responde llamadas y maneja diferentes tipos de solicitudes según protocolos específicos.

#### 6.2 Middleware - El Guardián de tu Aplicación

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Redirección geográfica
  const country = request.geo?.country || 'US';
  if (pathname === '/' && country === 'ES') {
    return NextResponse.redirect(new URL('/es', request.url));
  }
  
  // Autenticación
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('auth-token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Rate limiting
  const ip = request.ip || 'unknown';
  const rateLimitResult = checkRateLimit(ip);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  // A/B Testing
  const abTestVariant = request.cookies.get('ab-test-variant')?.value;
  if (!abTestVariant && pathname === '/') {
    const variant = Math.random() > 0.5 ? 'A' : 'B';
    const response = NextResponse.next();
    response.cookies.set('ab-test-variant', variant);
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

**Analogía:** Como un portero de un edificio exclusivo que verifica identidades, dirige visitantes al piso correcto, y mantiene la seguridad.

#### 6.3 Database Integration - Prisma y Next.js

```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// src/lib/actions/posts.ts
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const authorId = formData.get('authorId') as string;
  
  await db.post.create({
    data: {
      title,
      content,
      authorId,
    },
  });
  
  revalidatePath('/posts');
}

export async function getPosts() {
  return await db.post.findMany({
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
```

**Analogía:** Como tener un bibliotecario experto que conoce exactamente dónde está cada libro y puede encontrar, organizar y actualizar la información de manera eficiente.

---

## 🔒 **FASE 3: SEGURIDAD Y PRODUCCIÓN**

### **Capítulo 7: Autenticación y Autorización**

#### 7.1 NextAuth.js - Autenticación Profesional

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './db';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = await verifyUser(
          credentials.email,
          credentials.password
        );
        return user || null;
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
});

// src/app/api/auth/[...nextauth]/route.ts
export { GET, POST } from '@/lib/auth';

// Hook personalizado para autenticación
// src/hooks/use-auth.ts
'use client';

import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
  };
}
```

#### 7.2 Role-Based Access Control (RBAC)

```typescript
// src/lib/auth/permissions.ts
export const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
} as const;

export const PERMISSIONS = {
  CREATE_POST: 'create_post',
  DELETE_POST: 'delete_post',
  MANAGE_USERS: 'manage_users',
  VIEW_ANALYTICS: 'view_analytics',
} as const;

const rolePermissions = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_POST,
    PERMISSIONS.DELETE_POST,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  [ROLES.MODERATOR]: [
    PERMISSIONS.CREATE_POST,
    PERMISSIONS.DELETE_POST,
  ],
  [ROLES.USER]: [
    PERMISSIONS.CREATE_POST,
  ],
};

export function hasPermission(
  userRole: string,
  permission: string
): boolean {
  return rolePermissions[userRole]?.includes(permission) || false;
}

// src/components/auth/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
  fallback = <div>No tienes permisos para ver este contenido</div>,
}: ProtectedRouteProps) {
  const { user } = useAuth();
  
  if (!user) {
    return <LoginPrompt />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return fallback;
  }
  
  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    return fallback;
  }
  
  return <>{children}</>;
}

// Uso en componentes
function AdminPanel() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_USERS}>
      <div>Panel de administración</div>
    </ProtectedRoute>
  );
}
```

**Analogía:** Como un sistema de llaves maestras en un hotel - cada tipo de empleado tiene acceso solo a las áreas que necesita para hacer su trabajo.

#### 7.3 Security Headers y CSP

```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.ejemplo.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

// Sanitización de datos
// src/lib/validation.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

export const createPostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(5000),
  tags: z.array(z.string()).max(10),
});

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

// Rate limiting
// src/lib/rate-limit.ts
import { LRUCache } from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        return isRateLimited ? reject() : resolve();
      }),
  };
}

// Uso en API routes
const limiter = rateLimit({
  interval: 60 * 1000, // 60 segundos
  uniqueTokenPerInterval: 500,
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  
  try {
    await limiter.check(10, ip); // 10 requests por minuto
  } catch {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  // Procesar request normal...
}
```

**Analogía:** Como instalar un sistema de seguridad completo en tu casa - cámaras (CSP), alarmas (rate limiting), y cerraduras especiales (sanitización) para proteger contra diferentes tipos de amenazas.

---

### **Capítulo 8: Testing y Quality Assurance**

#### 8.1 Testing Strategy Completa

```typescript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);

// jest.setup.js
import '@testing-library/jest-dom';
import { server } from './src/__mocks__/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// src/__tests__/components/ProductCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';
import { addToCart } from '@/lib/cart';

// Mock de la función
jest.mock('@/lib/cart');
const mockAddToCart = addToCart as jest.MockedFunction<typeof addToCart>;

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Producto Test',
    price: 99.99,
    image: '/test-image.jpg',
  };

  beforeEach(() => {
    mockAddToCart.mockClear();
  });

  it('renderiza la información del producto correctamente', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Producto Test')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByAltText('Producto Test')).toBeInTheDocument();
  });

  it('llama a addToCart cuando se hace clic en el botón', async () => {
    mockAddToCart.mockResolvedValue({ success: true });
    
    render(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /agregar al carrito/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct.id);
    });
  });

  it('muestra estado de carga durante la adición al carrito', async () => {
    mockAddToCart.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    );
    
    render(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /agregar al carrito/i });
    fireEvent.click(addButton);
    
    expect(screen.getByText(/agregando/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/agregar al carrito/i)).toBeInTheDocument();
    });
  });
});

// src/__tests__/api/products.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/products/route';

describe('/api/products', () => {
  it('GET retorna lista de productos', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('products');
    expect(Array.isArray(data.products)).toBe(true);
  });

  it('POST crea un nuevo producto', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Nuevo Producto',
        price: 149.99,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('id');
    expect(data.name).toBe('Nuevo Producto');
  });
});

// E2E Testing con Playwright
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Autenticación', () => {
  test('login exitoso redirige al dashboard', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid=email]', 'test@ejemplo.com');
    await page.fill('[data-testid=password]', 'password123');
    await page.click('[data-testid=login-button]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('login fallido muestra mensaje de error', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid=email]', 'test@ejemplo.com');
    await page.fill('[data-testid=password]', 'contraseña-incorrecta');
    await page.click('[data-testid=login-button]');
    
    await expect(page.locator('[role=alert]')).toContainText('Credenciales inválidas');
  });
});

// Storybook para components
// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'Loading...',
    disabled: true,
  },
};
```

**Analogía:** Como tener un equipo de control de calidad en una fábrica - cada componente se prueba individualmente (unit tests), luego se prueba cómo funcionan juntos (integration tests), y finalmente se prueba todo el producto final (E2E tests).

---

### **Capítulo 9: Deployment y DevOps**

#### 9.1 Configuración para Producción

```typescript
// next.config.js - Configuración optimizada para producción
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones de build
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  
  // Optimizaciones de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['ejemplo.com', 'cdn.ejemplo.com'],
    loader: 'default',
    minimumCacheTTL: 60,
  },
  
  // Experimental features
  experimental: {
    optimizePackageImports: [
      'lodash',
      'date-fns',
      '@heroicons/react',
    ],
    serverComponentsExternalPackages: ['mongoose'],
  },
  
  // Bundle analyzer en desarrollo
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(new BundleAnalyzerPlugin());
      return config;
    },
  }),
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },
};

// Dockerfile optimizado
# Dockerfile
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]

# docker-compose.yml para desarrollo
version: '3.8'
services:
  nextjs:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
      - NEXTAUTH_SECRET=your-secret
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db
      - redis
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

#### 9.2 CI/CD Pipeline con GitHub Actions

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload E2E results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  security:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Run security audit
        run: npm audit --audit-level high
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  build-and-deploy:
    runs-on: ubuntu-latest
    needs: [test, e2e, security]
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
      
      - name: Deploy to production
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            docker pull ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
            docker-compose up -d --no-deps web
            docker system prune -af
```

#### 9.3 Monitoring y Observabilidad

```typescript
// src/lib/monitoring.ts
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import * as Sentry from '@sentry/nextjs';

// Configuración de Sentry
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV === 'development',
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', /^https:\/\/tuapp\.com/],
    }),
  ],
});

// Custom error boundary
'use client';

import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: any) {
  useEffect(() => {
    // Log error to monitoring service
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="error-boundary">
      <h2>Algo salió mal</h2>
      <details style={{ whiteSpace: 'pre-wrap' }}>
        {error && error.toString()}
      </details>
      <button onClick={resetErrorBoundary}>Intentar de nuevo</button>
    </div>
  );
}

export function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error boundary caught an error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Performance monitoring
export function usePerformanceMonitoring() {
  useEffect(() => {
    // Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }, []);
}

// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
  };

  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`;
    health.database = 'connected';
  } catch (error) {
    health.database = 'disconnected';
    health.status = 'error';
  }

  const status = health.status === 'ok' ? 200 : 503;
  return NextResponse.json(health, { status });
}

// Logging estructurado
// src/lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    ...(process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
          }),
        ]
      : []),
  ],
});

export { logger };
```

**Analogía:** Como tener un centro de control de misiones de la NASA - monitoreas constantemente todos los sistemas, registras cada evento importante, y tienes protocolos para cuando algo sale mal.

---

## 🏗️ **FASE 4: ARQUITECTURA AVANZADA**

### **Capítulo 10: Micro-Frontends y Escalabilidad**

#### 10.1 Arquitectura Modular

```typescript
// Estructura para aplicaciones grandes
src/
├── apps/                          # Micro-aplicaciones
│   ├── admin/                    # Panel de administración
│   ├── customer/                 # App para clientes
│   └── vendor/                   # App para vendedores
├── packages/                     # Packages compartidos
│   ├── ui/                      # Design system
│   ├── utils/                   # Utilidades compartidas
│   ├── auth/                    # Lógica de autenticación
│   └── api-client/              # Cliente API
└── shared/                      # Recursos compartidos
    ├── types/
    ├── constants/
    └── schemas/

// nx.json o turbo.json para monorepo
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}

// packages/ui/src/Button/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

#### 10.2 State Management Avanzado con Zustand

```typescript
// src/store/slices/authSlice.ts
import { StateCreator } from 'zustand';

export interface AuthSlice {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

export const createAuthSlice: StateCreator<
  AuthSlice & CartSlice & UISlice,
  [],
  [],
  AuthSlice
> = (set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authAPI.login(credentials);
      const user = response.user;
      
      // Store token securely
      await secureStorage.setItem('authToken', response.token);
      
      set({ user, isLoading: false });
      
      // Clear cart if switching users
      if (get().cart.userId !== user.id) {
        get().clearCart();
      }
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false,
        user: null 
      });
      throw error;
    }
  },
  
  logout: () => {
    secureStorage.removeItem('authToken');
    set({ user: null, error: null });
    get().clearCart();
  },
  
  refreshToken: async () => {
    const token = await secureStorage.getItem('authToken');
    if (!token) return;
    
    try {
      const response = await authAPI.refreshToken(token);
      await secureStorage.setItem('authToken', response.token);
      set({ user: response.user });
    } catch (error) {
      get().logout();
    }
  },
  
  clearError: () => set({ error: null }),
});

// src/store/index.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createAuthSlice } from './slices/authSlice';
import { createCartSlice } from './slices/cartSlice';
import { createUISlice } from './slices/uiSlice';

export const useStore = create<AuthSlice & CartSlice & UISlice>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createAuthSlice(...a),
        ...createCartSlice(...a),
        ...createUISlice(...a),
      })),
      {
        name: 'app-store',
        partialize: (state) => ({
          // Solo persistir ciertos campos
          user: state.user,
          cart: state.cart,
          theme: state.theme,
        }),
      }
    ),
    {
      name: 'app-store',
    }
  )
);

// Hooks especializados
export const useAuth = () => useStore((state) => ({
  user: state.user,
  isLoading: state.isLoading,
  error: state.error,
  login: state.login,
  logout: state.logout,
  clearError: state.clearError,
}));

export const useCart = () => useStore((state) => ({
  items: state.cart.items,
  total: state.cart.total,
  addItem: state.addItem,
  removeItem: state.removeItem,
  updateQuantity: state.updateQuantity,
  clearCart: state.clearCart,
}));
```

#### 10.3 Real-time Features con WebSockets

```typescript
// src/lib/websocket.ts
import { io, Socket } from 'socket.io-client';

class WebSocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  connect(token: string) {
    if (this.socket?.connected) return;
    
    this.socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token },
      transports: ['websocket'],
    });
    
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });
    
    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    });
    
    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }
  
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.socket?.connect();
      }, 1000 * Math.pow(2, this.reconnectAttempts));
    }
  }
  
  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }
  
  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }
  
  off(event: string, callback?: (data: any) => void) {
    this.socket?.off(event, callback);
  }
  
  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const wsManager = new WebSocketManager();

// Hook para WebSocket
export function useWebSocket() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.token) {
      wsManager.connect(user.token);
    }
    
    return () => {
      wsManager.disconnect();
    };
  }, [user?.token]);
  
  return {
    emit: wsManager.emit.bind(wsManager),
    on: wsManager.on.bind(wsManager),
    off: wsManager.off.bind(wsManager),
  };
}

// Componente de chat en tiempo real
function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { emit, on, off } = useWebSocket();
  const { user } = useAuth();
  
  useEffect(() => {
    // Join room
    emit('join-room', { roomId });
    
    // Listen for new messages
    const handleNewMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };
    
    on('new-message', handleNewMessage);
    
    return () => {
      off('new-message', handleNewMessage);
      emit('leave-room', { roomId });
    };
  }, [roomId, emit, on, off]);
  
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      text: newMessage,
      userId: user!.id,
      userName: user!.name,
      roomId,
      timestamp: new Date().toISOString(),
    };
    
    emit('send-message', message);
    setNewMessage('');
  };
  
  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map(message => (
          <div key={message.id} className="message">
            <strong>{message.userName}:</strong> {message.text}
          </div>
        ))}
      </div>
      
      <form onSubmit={sendMessage} className="message-form">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="message-input"
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
```

---

### **Capítulo 11: Internacionalización y Accesibilidad**

#### 11.1 i18n con next-intl

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['es', 'en', 'fr'],
  defaultLocale: 'es',
  localePrefix: 'as-needed'
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

// messages/es.json
{
  "HomePage": {
    "title": "Bienvenido a nuestra aplicación",
    "description": "La mejor experiencia de usuario"
  },
  "Navigation": {
    "home": "Inicio",
    "about": "Acerca de",
    "contact": "Contacto"
  },
  "Common": {
    "loading": "Cargando...",
    "error": "Ha ocurrido un error",
    "retry": "Intentar de nuevo"
  }
}

// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// src/components/LanguageSwitcher.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const languages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <select
      value={locale}
      onChange={(e) => switchLanguage(e.target.value)}
      className="language-switcher"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}

// Hook personalizado para traducciones
export function useTranslations() {
  const t = useTranslations();
  
  return {
    t,
    formatDate: (date: Date) => {
      const locale = useLocale();
      return new Intl.DateTimeFormat(locale).format(date);
    },
    formatCurrency: (amount: number) => {
      const locale = useLocale();
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR'
      }).format(amount);
    }
  };
}
```

#### 11.2 Accesibilidad (a11y) Completa

```typescript
// src/components/accessible/Dialog.tsx
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg',
        'duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
        'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        'sm:rounded-lg md:w-full',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Cerrar</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));

// Hook para manejo de focus
function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  
  const trapFocus = useCallback((containerRef: React.RefObject<HTMLElement>) => {
    const container = containerRef.current;
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);
  
  return { trapFocus, focusedElement, setFocusedElement };
}

// Componente Skip Link
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-primary-foreground p-4 z-50"
    >
      Saltar al contenido principal
    </a>
  );
}

// Hook para anuncios de screen reader
function useScreenReaderAnnouncements() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);
  
  return { announce };
}
```

#### 11.3 SEO Avanzado y Metadata

```typescript
// src/lib/metadata.ts
import type { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image = '/og-default.jpg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors = [],
}: SEOProps): Metadata {
  const siteName = 'Mi Aplicación Increíble';
  const fullTitle = `${title} | ${siteName}`;
  const fullUrl = url ? `https://miapp.com${url}` : 'https://miapp.com';
  const fullImage = image.startsWith('http') ? image : `https://miapp.com${image}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: authors.map(name => ({ name })),
    creator: siteName,
    publisher: siteName,
    
    alternates: {
      canonical: fullUrl,
      languages: {
        'es-ES': `${fullUrl}`,
        'en-US': `${fullUrl}/en`,
        'fr-FR': `${fullUrl}/fr`,
      },
    },
    
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: fullUrl,
      siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors,
      }),
    },
    
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: '@miapp',
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    verification: {
      google: 'tu-codigo-de-verificacion-google',
      yandex: 'tu-codigo-de-verificacion-yandex',
      yahoo: 'tu-codigo-de-verificacion-yahoo',
    },
  };
}

// src/app/products/[slug]/page.tsx
import { generateSEOMetadata } from '@/lib/metadata';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  
  if (!product) {
    return generateSEOMetadata({
      title: 'Producto no encontrado',
      description: 'El producto que buscas no existe.',
    });
  }
  
  return generateSEOMetadata({
    title: product.name,
    description: product.description,
    keywords: product.tags,
    image: product.images[0],
    url: `/products/${product.slug}`,
    type: 'product',
  });
}

// JSON-LD Schema markup
function ProductSchema({ product }: { product: Product }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability: product.inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      url: `https://miapp.com/products/${product.slug}`,
    },
    aggregateRating: product.rating && {
      '@type': 'AggregateRating',
      ratingValue: product.rating.average,
      reviewCount: product.rating.count,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Sitemap dinámico
// src/app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://miapp.com';
  
  // Páginas estáticas
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];
  
  // Páginas dinámicas - productos
  const products = await getAllProducts();
  const productPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
  
  // Páginas dinámicas - blog
  const posts = await getAllPosts();
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  }));
  
  return [...staticPages, ...productPages, ...blogPages];
}
```

---

## 🎯 **REFLEXIÓN FINAL: EL MAESTRO DEVELOPER**

### **El Viaje de Transformación**

Hemos recorrido un camino extraordinario juntos. Como un artesano que domina su oficio, has aprendido no solo las técnicas, sino también la filosofía detrás del desarrollo web moderno con Next.js.

### **Las Lecciones Profundas**

**1. La Arquitectura como Arte**
Next.js no es solo un framework - es una filosofía de desarrollo que abraza la simplicidad en la superficie y la sofisticación en el núcleo. Como un iceberg, lo que ves es elegante y simple, pero debajo hay una infraestructura robusta y pensada para escalar.

**2. La Performance como Obsesión**
Cada línea de código que escribes impacta la experiencia de miles de usuarios. El Server-Side Rendering, la optimización de imágenes, el code splitting - no son características técnicas, son actos de empatía hacia tus usuarios.

**3. La Seguridad como Responsabilidad**
En un mundo digital, ser developer es ser guardián. Cada vulnerabilidad que previenes, cada validación que implementas, es un acto de protección hacia la comunidad que confía en tu código.

**4. La Accesibilidad como Inclusión**
Desarrollar no es solo crear funcionalidades - es construir puentes. Cada atributo ARIA, cada consideración de usabilidad, es una invitación para que más personas puedan participar en el mundo digital.

### **El Mindset del Expert Developer**

**Piensa en Sistemas, No en Características**
Un developer junior implementa features. Un expert diseña ecosistemas. Cuando enfrentas un problema, no pienses "¿cómo hago que esto funcione?" sino "¿cómo diseño esto para que sea mantenible, escalable y resiliente?"

**La Abstracción como Superpower**
El verdadero poder de Next.js radica en cómo abstrae la complejidad sin sacrificar el control. Server Components, App Router, automatic optimizations - son abstracciones que te permiten enfocarte en resolver problemas de negocio, no problemas técnicos.

**El Código como Comunicación**
Tu código no es solo para las máquinas - es para otros humans, incluido tu yo futuro. Cada nombre de variable, cada estructura de carpetas, cada comentario, es un acto de comunicación. Escribe código que cuente historias.

### **La Responsabilidad del Conocimiento**

Con este conocimiento viene una responsabilidad. No solo eres capaz de construir aplicaciones web - eres capaz de influir en cómo millones de personas interactúan con la tecnología cada día.

- **Usa tu poder sabiamente**: Construye experiencias que enriquezcan vidas
- **Mantente humilde**: La tecnología cambia, pero los principios fundamentales perduran
- **Comparte tu conocimiento**: Enseña a otros, contribuye a la comunidad
- **Nunca dejes de aprender**: Cada proyecto es una oportunidad de crecimiento

### **El Futuro que Construirás**

Next.js es más que un framework - es una herramienta para materializar visiones. Con React Server Components, streaming, edge computing, y las optimizaciones automáticas, tienes en tus manos el poder de crear experiencias web que antes eran imposibles.

El web development está evolucionando hacia algo más:
- **Más rápido**: Gracias a edge computing y streaming
- **Más inteligente**: Con optimizaciones automáticas y análisis predictivo
- **Más inclusivo**: A través de mejores herramientas de accesibilidad
- **Más seguro**: Con paradigmas de seguridad by design

### **Tu Legado como Developer**

Cada aplicación que construyas es un ladrillo en el futuro digital de la humanidad. Los usuarios pueden no conocer tu nombre, pero sus vidas serán un poco mejores gracias a las experiencias que creates.

No midas tu éxito solo en líneas de código o features completadas. Mídelo en:
- **Problemas reales resueltos**
- **Usuarios empoderados**
- **Barreras eliminadas**
- **Experiencias memorables creadas**

### **El Llamado a la Acción**

Ahora que dominas Next.js, tienes una decisión que tomar. Puedes usar este conocimiento para:

1. **Construir el próximo unicornio** - Crear la aplicación que cambie una industria
2. **Democratizar la tecnología** - Hacer herramientas complejas accesibles para todos
3. **Resolver problemas sociales** - Usar la tecnología para el bien común
4. **Mentorear a la próxima generación** - Ser el teacher que hubieras querido tener

### **Palabras Finales**

Recuerda: no eres solo un developer. Eres un arquitecto del futuro digital, un solucionador de problemas, un creador de experiencias. Next.js te ha dado las herramientas, pero la visión, la creatividad, y el impacto - esos vienen de ti.

El mundo necesita developers que no solo sepan cómo construir, sino que entiendan por qué construir y para quién construir. 

Ahora sal ahí afuera y construye algo increíble. El futuro está esperando.

---

*"El mejor código no es el que es más inteligente - es el que resuelve problemas reales para personas reales de la manera más elegante posible."*

**¡Que comience tu nueva era como Master de Next.js!** 🚀