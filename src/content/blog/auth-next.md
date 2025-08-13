---
title: 'NextAuth.js y Middlewares en Next.js 15'
code: 'react'
description: 'Guía Completa: NextAuth.js y Middlewares en Next.js 15'
pubDate: 'Jun 19 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---


# Guía Completa: NextAuth.js y Middlewares en Next.js 15
## Autenticación y Autorización Paso a Paso

---

## 🎯 **Introducción: La Seguridad como Fundamento**

Imagina que NextAuth.js es como el sistema de seguridad de un rascacielos moderno. No es solo una cerradura en la puerta - es un ecosistema completo que incluye recepcionistas (providers), tarjetas de acceso (tokens), cámaras de seguridad (middleware), y protocolos de emergencia (callbacks). 

El middleware, por su parte, es como el guardia de seguridad que está en cada piso, verificando credenciales, dirigiendo tráfico, y asegurándose de que solo las personas autorizadas lleguen a donde necesitan ir.

---

## 📦 **FASE 1: INSTALACIÓN Y CONFIGURACIÓN INICIAL**

### **Paso 1: Instalación de Dependencias**

```bash
# Instalar NextAuth.js v5 (Auth.js)
npm install next-auth@beta

# Instalar adaptadores para base de datos (opcional pero recomendado)
npm install @auth/prisma-adapter
npm install prisma @prisma/client

# Instalar providers específicos que usaremos
npm install @auth/google-provider
npm install @auth/github-provider

# Para encriptación y hashing de passwords
npm install bcryptjs
npm install @types/bcryptjs

# Para validación de datos
npm install zod
```

**Analogía:** Es como comprar todas las herramientas necesarias antes de construir una casa - cada paquete tiene un propósito específico en nuestro sistema de seguridad.

### **Paso 2: Configuración de Variables de Entorno**

```bash
# .env.local
# Configuración base de NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-super-secreto-muy-largo-y-complejo-aqui

# Base de datos (usando PostgreSQL como ejemplo)
DATABASE_URL="postgresql://usuario:password@localhost:5432/miapp?schema=public"

# Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=tu-github-client-id
GITHUB_CLIENT_SECRET=tu-github-client-secret

# Para emails (opcional - SendGrid como ejemplo)
SENDGRID_API_KEY=tu-sendgrid-api-key
EMAIL_FROM=noreply@tuapp.com

# Para desarrollo
NODE_ENV=development
```

**Analogía:** Como configurar las llaves maestras y códigos de acceso de nuestro edificio antes de que alguien pueda entrar.

### **Paso 3: Configuración de la Base de Datos con Prisma**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Modelos requeridos por NextAuth.js
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // Para credentials provider
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relaciones
  accounts Account[]
  sessions Session[]
  posts    Post[]
  
  @@map("users")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// Enums para roles
enum Role {
  USER
  ADMIN
  MODERATOR
}

// Modelo adicional de ejemplo
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```bash
# Generar y aplicar migraciones
npx prisma generate
npx prisma db push

# (Opcional) Semilla de datos iniciales
npx prisma db seed
```

**Analogía:** Como diseñar el plano del edificio - defines exactamente qué información se guarda, dónde, y cómo se relaciona todo.

---

## 🔐 **FASE 2: CONFIGURACIÓN DE NEXTAUTH.JS**

### **Paso 4: Configuración Principal de Auth**

```typescript
// src/lib/auth.ts
import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { loginSchema } from "@/lib/validations/auth"

// Extender los tipos de NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "USER" | "ADMIN" | "MODERATOR"
    } & DefaultSession["user"]
  }

  interface User {
    role: "USER" | "ADMIN" | "MODERATOR"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "USER" | "ADMIN" | "MODERATOR"
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // Usar Prisma como adaptador
  adapter: PrismaAdapter(db),
  
  // Configurar sesiones
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  
  // Configurar providers
  providers: [
    // Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    
    // GitHub OAuth
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    
    // Credentials (email/password)
    Credentials({
      name: "credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email", 
          placeholder: "tu@email.com" 
        },
        password: { 
          label: "Contraseña", 
          type: "password" 
        },
      },
      async authorize(credentials) {
        try {
          // Validar entrada con Zod
          const { email, password } = loginSchema.parse(credentials)
          
          // Buscar usuario en la base de datos
          const user = await db.user.findUnique({
            where: { email: email.toLowerCase() }
          })
          
          if (!user || !user.password) {
            return null
          }
          
          // Verificar contraseña
          const isPasswordValid = await bcrypt.compare(password, user.password)
          
          if (!isPasswordValid) {
            return null
          }
          
          // Retornar datos del usuario (sin la contraseña)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          console.error("Error en autorización:", error)
          return null
        }
      },
    }),
  ],
  
  // Páginas personalizadas
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  
  // Callbacks para personalizar comportamiento
  callbacks: {
    // Callback de autorización - se ejecuta en cada request
    async authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      
      // Rutas que requieren autenticación
      if (pathname.startsWith("/dashboard")) {
        return !!auth
      }
      
      // Rutas que requieren rol específico
      if (pathname.startsWith("/admin")) {
        return auth?.user?.role === "ADMIN"
      }
      
      return true
    },
    
    // Callback de JWT - se ejecuta cuando se crea/actualiza el JWT
    async jwt({ token, user, trigger, session }) {
      // Si es un nuevo login, agregar datos del usuario al token
      if (user) {
        token.role = user.role
      }
      
      // Si se actualiza la sesión desde el cliente
      if (trigger === "update" && session) {
        token.name = session.user.name
        token.email = session.user.email
      }
      
      return token
    },
    
    // Callback de sesión - moldea los datos que llegan al cliente
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role
      }
      
      return session
    },
    
    // Callback de sign-in - controla si se permite el login
    async signIn({ user, account, profile, email, credentials }) {
      // Verificar si el email está verificado (para OAuth)
      if (account?.provider === "google" || account?.provider === "github") {
        return profile?.email_verified ?? true
      }
      
      // Para credentials, ya se validó en authorize()
      if (account?.provider === "credentials") {
        return true
      }
      
      return true
    },
    
    // Callback de redirección - controla dónde va el usuario después del login
    async redirect({ url, baseUrl }) {
      // Si la URL es relativa, agregarle el baseUrl
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      
      // Si la URL pertenece al mismo sitio, permitirla
      if (new URL(url).origin === baseUrl) {
        return url
      }
      
      // Por defecto, redirigir al dashboard
      return `${baseUrl}/dashboard`
    },
  },
  
  // Eventos para logging y analytics
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`Usuario ${user.email} inició sesión con ${account?.provider}`)
      
      // Aquí puedes agregar analytics, logging, etc.
      if (isNewUser) {
        console.log(`Nuevo usuario registrado: ${user.email}`)
        // Enviar email de bienvenida, etc.
      }
    },
    
    async signOut({ session, token }) {
      console.log(`Usuario ${session?.user?.email} cerró sesión`)
    },
  },
  
  // Configuración de debug para desarrollo
  debug: process.env.NODE_ENV === "development",
})
```

**Analogía:** Como configurar el sistema central de seguridad del edificio - defines quién puede entrar, cómo se verifican las identidades, qué información se guarda, y qué sucede en diferentes situaciones.

### **Paso 5: Validaciones con Zod**

```typescript
// src/lib/validations/auth.ts
import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido")
    .transform(email => email.toLowerCase()),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre no puede tener más de 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "El nombre solo puede contener letras y espacios"),
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido")
    .transform(email => email.toLowerCase()),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "La contraseña actual es requerida"),
  newPassword: z
    .string()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmNewPassword"],
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido")
    .transform(email => email.toLowerCase()),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

// Tipos TypeScript derivados de los schemas
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
```

### **Paso 6: Configuración de la Conexión a Base de Datos**

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Funciones de utilidad para usuarios
export async function getUserByEmail(email: string) {
  try {
    return await db.user.findUnique({
      where: { email }
    })
  } catch (error) {
    console.error("Error al buscar usuario por email:", error)
    return null
  }
}

export async function getUserById(id: string) {
  try {
    return await db.user.findUnique({
      where: { id }
    })
  } catch (error) {
    console.error("Error al buscar usuario por ID:", error)
    return null
  }
}

export async function createUser(data: {
  name: string
  email: string
  password: string
}) {
  try {
    return await db.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
      }
    })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    throw error
  }
}

export async function updateUser(id: string, data: Partial<{
  name: string
  email: string
  password: string
  role: "USER" | "ADMIN" | "MODERATOR"
}>) {
  try {
    return await db.user.update({
      where: { id },
      data
    })
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    throw error
  }
}
```

---

## 🛡️ **FASE 3: CONFIGURACIÓN DE MIDDLEWARES**

### **Paso 7: Middleware Principal**

```typescript
// src/middleware.ts
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Configuración de rutas
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/auth/verify-request',
  '/api/auth/callback/google',
  '/api/auth/callback/github',
  '/api/auth/callback/credentials',
  '/api/register',
  '/api/forgot-password',
  '/api/reset-password',
]

const authRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/auth/verify-request',
]

const adminRoutes = [
  '/admin'
]

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  console.log(`🔍 Middleware ejecutándose para: ${nextUrl.pathname}`)
  console.log(`👤 Usuario logueado: ${isLoggedIn}`)
  console.log(`🎭 Rol del usuario: ${userRole || 'Sin rol'}`)

  // 1. Verificar si es una ruta de autenticación
  const isAuthRoute = authRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )
  
  if (isAuthRoute) {
    // Si está logueado y trata de acceder a rutas de auth, redirigir al dashboard
    if (isLoggedIn) {
      console.log("✅ Usuario logueado redirigido desde auth a dashboard")
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
    // Si no está logueado, permitir acceso a rutas de auth
    console.log("✅ Acceso permitido a ruta de autenticación")
    return NextResponse.next()
  }

  // 2. Verificar rutas de admin
  const isAdminRoute = adminRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )
  
  if (isAdminRoute) {
    if (!isLoggedIn) {
      console.log("❌ Acceso denegado a admin: no logueado")
      const callbackUrl = encodeURIComponent(nextUrl.pathname)
      return NextResponse.redirect(
        new URL(`/auth/signin?callbackUrl=${callbackUrl}`, nextUrl)
      )
    }
    
    if (userRole !== 'ADMIN') {
      console.log("❌ Acceso denegado a admin: rol insuficiente")
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
    
    console.log("✅ Acceso permitido a ruta de admin")
    return NextResponse.next()
  }

  // 3. Verificar rutas protegidas
  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )
  
  if (isProtectedRoute && !isLoggedIn) {
    console.log("❌ Acceso denegado a ruta protegida: no logueado")
    const callbackUrl = encodeURIComponent(nextUrl.pathname)
    return NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${callbackUrl}`, nextUrl)
    )
  }

  // 4. Verificar rutas públicas
  const isPublicRoute = publicRoutes.some(route => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route)
  )
  
  if (isPublicRoute) {
    console.log("✅ Acceso permitido a ruta pública")
    return NextResponse.next()
  }

  // 5. Si no es ninguna de las anteriores y no está logueado, redirigir a login
  if (!isLoggedIn) {
    console.log("❌ Acceso denegado: ruta no pública y usuario no logueado")
    const callbackUrl = encodeURIComponent(nextUrl.pathname)
    return NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${callbackUrl}`, nextUrl)
    )
  }

  console.log("✅ Acceso permitido por defecto")
  return NextResponse.next()
})

// Configuración del matcher
export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de request excepto las que empiezan con:
     * - api (API routes)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

**Analogía:** Como tener un guardia de seguridad súper inteligente en cada entrada del edificio que conoce las reglas exactas: quién puede entrar dónde, cuándo, y qué hacer si alguien trata de ir a un lugar prohibido.

### **Paso 8: Middleware Avanzado con Rate Limiting y Logging**

```typescript
// src/lib/middleware/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server'
import { LRUCache } from 'lru-cache'

interface RateLimitOptions {
  interval: number // tiempo en ms
  uniqueTokenPerInterval: number // máximo de tokens únicos
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: Date
}

class RateLimiter {
  private cache: LRUCache<string, number[]>

  constructor(private options: RateLimitOptions) {
    this.cache = new LRUCache({
      max: options.uniqueTokenPerInterval,
      ttl: options.interval,
    })
  }

  check(limit: number, token: string): RateLimitResult {
    const tokenCount = this.cache.get(token) || [0]
    
    if (tokenCount[0] === 0) {
      this.cache.set(token, tokenCount)
    }
    
    tokenCount[0]++
    
    const currentUsage = tokenCount[0]
    const resetTime = new Date(Date.now() + this.options.interval)
    
    return {
      success: currentUsage <= limit,
      limit,
      remaining: Math.max(0, limit - currentUsage),
      resetTime,
    }
  }
}

// Crear instancias de rate limiters para diferentes casos
export const authLimiter = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 minutos
  uniqueTokenPerInterval: 500,
})

export const apiLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minuto
  uniqueTokenPerInterval: 1000,
})

export function withRateLimit(
  limiter: RateLimiter,
  limit: number = 5,
  message: string = 'Demasiadas solicitudes'
) {
  return (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const result = limiter.check(limit, ip)
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: message,
          retryAfter: Math.ceil((result.resetTime.getTime() - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.getTime().toString(),
            'Retry-After': Math.ceil((result.resetTime.getTime() - Date.now()) / 1000).toString(),
          }
        }
      )
    }
    
    return null // Continuar con el middleware chain
  }
}

// src/lib/middleware/logger.ts
interface LogEntry {
  timestamp: string
  method: string
  url: string
  ip: string
  userAgent: string
  userId?: string
  duration: number
  status: number
}

class RequestLogger {
  private logs: LogEntry[] = []
  
  log(entry: LogEntry) {
    this.logs.push(entry)
    
    // En producción, enviarías esto a un servicio de logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`📝 ${entry.method} ${entry.url} - ${entry.status} (${entry.duration}ms)`)
    }
    
    // Limpiar logs antiguos para evitar memory leaks
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-500)
    }
  }
  
  getLogs(filter?: Partial<LogEntry>): LogEntry[] {
    if (!filter) return this.logs
    
    return this.logs.filter(log => {
      return Object.entries(filter).every(([key, value]) => {
        return log[key as keyof LogEntry] === value
      })
    })
  }
}

export const requestLogger = new RequestLogger()

export function withRequestLogging(req: NextRequest, startTime: number = Date.now()) {
  return (response: NextResponse, userId?: string) => {
    const duration = Date.now() - startTime
    
    requestLogger.log({
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      ip: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      userId,
      duration,
      status: response.status,
    })
    
    return response
  }
}

// src/lib/middleware/security.ts
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevenir ataques XSS
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // HTTPS
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  // Permissions policy
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return response
}

// Middleware compuesto - Combinando todo
// src/middleware.ts (versión avanzada)
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { withRateLimit, authLimiter, apiLimiter } from "@/lib/middleware/rate-limit"
import { withRequestLogging } from "@/lib/middleware/logger"
import { addSecurityHeaders } from "@/lib/middleware/security"

export default auth((req) => {
  const startTime = Date.now()
  const logRequest = withRequestLogging(req, startTime)
  
  // 1. Aplicar rate limiting según la ruta
  let rateLimitResponse = null
  
  if (req.nextUrl.pathname.startsWith('/api/auth/')) {
    rateLimitResponse = withRateLimit(authLimiter, 5, 'Demasiados intentos de autenticación')(req)
  } else if (req.nextUrl.pathname.startsWith('/api/')) {
    rateLimitResponse = withRateLimit(apiLimiter, 100, 'Demasiadas solicitudes a la API')(req)
  }
  
  if (rateLimitResponse) {
    return logRequest(addSecurityHeaders(rateLimitResponse))
  }

  // 2. Lógica de autenticación (igual que antes)
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role
  const userId = req.auth?.user?.id

  // ... toda la lógica de rutas que teníamos antes ...

  // 3. Si llegamos aquí, crear respuesta exitosa
  const response = NextResponse.next()
  
  // 4. Agregar headers de seguridad
  addSecurityHeaders(response)
  
  // 5. Log de la request
  logRequest(response, userId)
  
  return response
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

**Analogía:** Como tener un sistema de seguridad de múltiples capas: primero el guardia verifica si no hay demasiada gente entrando (rate limiting), luego verifica las credenciales (auth), instala cámaras de seguridad (logging), y finalmente asegura que todas las puertas tengan las cerraduras correctas (security headers).

---

## 🔗 **FASE 4: API ROUTES Y HANDLERS**

### **Paso 9: API Route para NextAuth**

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import { GET, POST } from "@/lib/auth"

export { GET, POST }
```

### **Paso 10: API Routes Personalizadas**

```typescript
// src/app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server"
import { registerSchema } from "@/lib/validations/auth"
import { db, getUserByEmail, createUser } from "@/lib/db"
import bcrypt from "bcryptjs"
import { withRateLimit, authLimiter } from "@/lib/middleware/rate-limit"

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting
    const rateLimitResponse = withRateLimit(
      authLimiter, 
      3, 
      'Demasiados intentos de registro'
    )(req)
    
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // 2. Validar datos de entrada
    const body = await req.json()
    const validatedData = registerSchema.parse(body)

    // 3. Verificar si el usuario ya existe
    const existingUser = await getUserByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe con este email" },
        { status: 400 }
      )
    }

    // 4. Hash de la contraseña
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds)

    // 5. Crear usuario en la base de datos
    const user = await createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    })

    // 6. Remover contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: "Usuario creado exitosamente",
        user: userWithoutPassword 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Error en registro:", error)
    
    // Manejar errores de validación de Zod
    if (error.name === "ZodError") {
      return NextResponse.json(
        { 
          error: "Datos inválidos", 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// src/app/api/change-password/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { changePasswordSchema } from "@/lib/validations/auth"
import { db, getUserById } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    // 1. Verificar autenticación
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // 2. Validar datos
    const body = await req.json()
    const validatedData = changePasswordSchema.parse(body)

    // 3. Obtener usuario actual
    const user = await getUserById(session.user.id)
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    // 4. Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.password
    )

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Contraseña actual incorrecta" },
        { status: 400 }
      )
    }

    // 5. Hash de la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12)

    // 6. Actualizar contraseña en la base de datos
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json(
      { message: "Contraseña actualizada exitosamente" }
    )

  } catch (error) {
    console.error("Error al cambiar contraseña:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error("Error al obtener perfil:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = updateProfileSchema.parse(body)

    // Si se está actualizando el email, verificar que no exista
    if (validatedData.email) {
      const existingUser = await db.user.findFirst({
        where: {
          email: validatedData.email,
          NOT: { id: session.user.id }
        }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "El email ya está en uso" },
          { status: 400 }
        )
      }
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({ 
      message: "Perfil actualizado exitosamente",
      user: updatedUser 
    })

  } catch (error) {
    console.error("Error al actualizar perfil:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// src/app/api/admin/users/route.ts - Solo para administradores
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    // Verificar que sea admin
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    } : {}

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              posts: true,
              sessions: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      db.user.count({ where })
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
```

---

## 🎨 **FASE 5: COMPONENTES DE UI**

### **Paso 11: Páginas de Autenticación**

```typescript
// src/app/auth/signin/page.tsx
import { Suspense } from "react"
import { SignInForm } from "@/components/auth/SignInForm"
import { OAuthButtons } from "@/components/auth/OAuthButtons"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inicia sesión en tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link 
              href="/auth/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        <div className="space-y-6">
          {/* OAuth Buttons */}
          <Suspense fallback={<div>Cargando...</div>}>
            <OAuthButtons />
          </Suspense>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                O continúa con email
              </span>
            </div>
          </div>

          {/* Credentials Form */}
          <Suspense fallback={<div>Cargando formulario...</div>}>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

// src/components/auth/SignInForm.tsx
'use client'

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setError(null)
    
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        })

        if (result?.error) {
          setError("Credenciales inválidas")
          return
        }

        router.push(callbackUrl)
        router.refresh()
      } catch (error) {
        setError("Ocurrió un error inesperado")
      }
    })
  }

  const isLoading = isSubmitting || isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          disabled={isLoading}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Tu contraseña"
            disabled={isLoading}
            {...register("password")}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link
            href="/auth/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Iniciar sesión
      </Button>
    </form>
  )
}

// src/components/auth/OAuthButtons.tsx
'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

export function OAuthButtons() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGitHubLoading, setIsGitHubLoading] = useState(false)

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    if (provider === "google") setIsGoogleLoading(true)
    if (provider === "github") setIsGitHubLoading(true)

    try {
      await signIn(provider, { callbackUrl })
    } catch (error) {
      console.error(`Error al iniciar sesión con ${provider}:`, error)
    } finally {
      if (provider === "google") setIsGoogleLoading(false)
      if (provider === "github") setIsGitHubLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthSignIn("google")}
        disabled={isGoogleLoading || isGitHubLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Continuar con Google
      </Button>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthSignIn("github")}
        disabled={isGoogleLoading || isGitHubLoading}
      >
        {isGitHubLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}
        Continuar con GitHub
      </Button>
    </div>
  )
}
```

### **Paso 12: Componentes de Protección y Hooks**

```typescript
// src/components/auth/ProtectedRoute.tsx
'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "USER" | "ADMIN" | "MODERATOR"
  fallback?: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
  redirectTo = "/auth/signin"
}: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Aún cargando

    if (!session) {
      router.push(redirectTo)
      return
    }

    if (requiredRole && session.user.role !== requiredRole) {
      if (fallback) return
      router.push("/dashboard") // Redirigir a una página segura
      return
    }
  }, [session, status, requiredRole, router, redirectTo, fallback])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null // El useEffect ya maneja la redirección
  }

  if (requiredRole && session.user.role !== requiredRole) {
    if (fallback) {
      return <>{fallback}</>
    }
    return null // El useEffect ya maneja la redirección
  }

  return <>{children}</>
}

// src/hooks/useAuth.ts
'use client'

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/")
    router.refresh()
  }

  const hasRole = (role: "USER" | "ADMIN" | "MODERATOR") => {
    return session?.user?.role === role
  }

  const hasAnyRole = (roles: ("USER" | "ADMIN" | "MODERATOR")[]) => {
    return session?.user?.role ? roles.includes(session.user.role) : false
  }

  const isAdmin = () => hasRole("ADMIN")
  const isModerator = () => hasRole("MODERATOR") || hasRole("ADMIN")

  return {
    user: session?.user,
    session,
    status,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    logout,
    hasRole,
    hasAnyRole,
    isAdmin,
    isModerator,
    updateSession: update,
  }
}

// src/components/auth/UserMenu.tsx
'use client'

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, Shield, LogOut } from "lucide-react"
import Link from "next/link"

export function UserMenu() {
  const { user, logout, isAdmin } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (!user) return null

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || undefined} alt={user.name || "Usuario"} />
            <AvatarFallback>
              {user.name ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name || "Usuario"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              Rol: {user.role}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Link>
        </DropdownMenuItem>
        
        {isAdmin() && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Administración
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## 🚀 **FASE 6: IMPLEMENTACIÓN Y TESTING**

### **Paso 13: Provider de Session**

```typescript
// src/components/providers/SessionProvider.tsx
'use client'

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

interface SessionProviderProps {
  children: React.ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  )
}

// src/app/layout.tsx
import { SessionProvider } from "@/components/providers/SessionProvider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

### **Paso 14: Testing de Autenticación**

```typescript
// src/__tests__/auth/signin.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { signIn } from 'next-auth/react'
import { SignInForm } from '@/components/auth/SignInForm'

// Mock NextAuth
jest.mock('next-auth/react')
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('SignInForm', () => {
  beforeEach(() => {
    mockSignIn.mockClear()
  })

  it('renderiza el formulario correctamente', () => {
    render(<SignInForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('muestra errores de validación', async () => {
    render(<SignInForm />)
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument()
    })
  })

  it('envía el formulario con datos válidos', async () => {
    mockSignIn.mockResolvedValue({ ok: true, error: null })
    
    render(<SignInForm />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      })
    })
  })

  it('muestra error cuando las credenciales son inválidas', async () => {
    mockSignIn.mockResolvedValue({ ok: false, error: 'CredentialsSignin' })
    
    render(<SignInForm />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'wrongpassword' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument()
    })
  })
})

// src/__tests__/middleware/auth.test.ts
import { auth } from '@/lib/auth'
import { NextRequest } from 'next/server'
import middleware from '@/middleware'

// Mock auth
jest.mock('@/lib/auth')
const mockAuth = auth as jest.MockedFunction<typeof auth>

describe('Auth Middleware', () => {
  const createRequest = (pathname: string, isAuthenticated = false, role = 'USER') => {
    const request = new NextRequest(`http://localhost:3000${pathname}`)
    
    if (isAuthenticated) {
      mockAuth.mockResolvedValue({
        user: { id: '1', email: 'test@example.com', role },
        expires: new Date(Date.now() + 1000 * 60 * 60).toISOString()
      })
    } else {
      mockAuth.mockResolvedValue(null)
    }
    
    return request
  }

  it('permite acceso a rutas públicas sin autenticación', async () => {
    const request = createRequest('/')
    const response = await middleware(request)
    
    expect(response.status).toBe(200)
  })

  it('redirige a login para rutas protegidas sin autenticación', async () => {
    const request = createRequest('/dashboard')
    const response = await middleware(request)
    
    expect(response.status).toBe(307) // Redirect
    expect(response.headers.get('location')).toContain('/auth/signin')
  })

  it('permite acceso a rutas protegidas con autenticación', async () => {
    const request = createRequest('/dashboard', true)
    const response = await middleware(request)
    
    expect(response.status).toBe(200)
  })

  it('bloquea acceso a rutas de admin sin rol de admin', async () => {
    const request = createRequest('/admin', true, 'USER')
    const response = await middleware(request)
    
    expect(response.status).toBe(307) // Redirect
    expect(response.headers.get('location')).toContain('/dashboard')
  })

  it('permite acceso a rutas de admin con rol de admin', async () => {
    const request = createRequest('/admin', true, 'ADMIN')
    const response = await middleware(request)
    
    expect(response.status).toBe(200)
  })

  it('redirige usuarios autenticados desde páginas de auth', async () => {
    const request = createRequest('/auth/signin', true)
    const response = await middleware(request)
    
    expect(response.status).toBe(307) // Redirect
    expect(response.headers.get('location')).toContain('/dashboard')
  })
})

// src/__tests__/api/auth.test.ts
import { POST } from '@/app/api/register/route'
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'

// Mock database
jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    }
  },
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
}))

describe('/api/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('crea usuario exitosamente con datos válidos', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'USER',
    }

    ;(db.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(db.user.create as jest.Mock).mockResolvedValue(mockUser)

    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.message).toBe('Usuario creado exitosamente')
    expect(data.user.email).toBe('test@example.com')
    expect(data.user.password).toBeUndefined() // Password no debe estar en la respuesta
  })

  it('rechaza usuario existente', async () => {
    ;(db.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'test@example.com'
    })

    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('El usuario ya existe con este email')
  })

  it('valida datos de entrada', async () => {
    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        email: 'invalid-email',
        password: '123',
        confirmPassword: '456',
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Datos inválidos')
    expect(data.details).toBeDefined()
  })
})
```

### **Paso 15: Ejemplo de Uso en Páginas**

```typescript
// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserMenu } from "@/components/auth/UserMenu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">
            Bienvenido de vuelta, {session.user.name}
          </p>
        </div>
        <UserMenu />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tu Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Nombre:</strong> {session.user.name}</p>
              <p><strong>Email:</strong> {session.user.email}</p>
              <p><strong>Rol:</strong> {session.user.role}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Próximamente...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a href="/profile" className="block text-blue-600 hover:underline">
                Editar perfil
              </a>
              <a href="/settings" className="block text-blue-600 hover:underline">
                Configuración
              </a>
              {session.user.role === "ADMIN" && (
                <a href="/admin" className="block text-blue-600 hover:underline">
                  Panel de administración
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// src/app/admin/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default async function AdminPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }
  
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>
            <p>Administra usuarios del sistema</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Configuración del Sistema</h2>
            <p>Ajustes generales de la aplicación</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

// src/app/profile/page.tsx
'use client'

import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, updateSession } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  if (!user) {
    return <div>Cargando...</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar perfil')
      }

      // Actualizar la sesión local
      await updateSession()
      
      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Error inesperado' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert className={`mb-4 ${message.type === 'error' ? 'border-red-200' : 'border-green-200'}`}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label>Rol</Label>
              <Input value={user.role} disabled />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar Perfil
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 🔧 **FASE 7: CONFIGURACIÓN AVANZADA Y OPTIMIZACIÓN**

### **Paso 16: Configuración de Emails (Opcional)**

```typescript
// src/lib/email.ts
import nodemailer from 'nodemailer'

// Configurar transportador de email
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
    })

    console.log('Email enviado:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error enviando email:', error)
    return { success: false, error }
  }
}

// Templates de email
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: '¡Bienvenido a nuestra aplicación!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">¡Bienvenido, ${name}!</h1>
        <p>Gracias por registrarte en nuestra aplicación.</p>
        <p>Estamos emocionados de tenerte con nosotros.</p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard" 
           style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Ir al Dashboard
        </a>
      </div>
    `,
    text: `¡Bienvenido, ${name}! Gracias por registrarte en nuestra aplicación.`
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: 'Restablecer contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Restablecer Contraseña</h1>
        <p>Hola ${name},</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
        <a href="${resetUrl}" 
           style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Restablecer Contraseña
        </a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste esto, puedes ignorar este email.</p>
      </div>
    `,
    text: `Hola ${name}, has solicitado restablecer tu contraseña. Visita: ${resetUrl}`
  })
}

// src/app/api/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server"
import { forgotPasswordSchema } from "@/lib/validations/auth"
import { db, getUserByEmail } from "@/lib/db"
import { sendEmail, emailTemplates } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Buscar usuario
    const user = await getUserByEmail(email)
    if (!user) {
      // Por seguridad, no revelar si el email existe
      return NextResponse.json(
        { message: "Si el email existe, recibirás instrucciones para restablecer tu contraseña" }
      )
    }

    // Generar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    // Guardar token en la base de datos
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      }
    })

    // Enviar email
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    const emailContent = emailTemplates.passwordReset(user.name || 'Usuario', resetUrl)
    
    await sendEmail({
      to: user.email,
      ...emailContent
    })

    return NextResponse.json(
      { message: "Si el email existe, recibirás instrucciones para restablecer tu contraseña" }
    )

  } catch (error) {
    console.error("Error en forgot password:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
```

### **Paso 17: Optimizaciones de Performance y Seguridad**

```typescript
// src/lib/cache.ts
import { unstable_cache } from 'next/cache'

// Cache para datos de usuario
export const getCachedUser = unstable_cache(
  async (userId: string) => {
    return await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      }
    })
  },
  ['user'],
  {
    tags: ['user'],
    revalidate: 300, // 5 minutos
  }
)

// Invalidar cache cuando se actualiza un usuario
export async function invalidateUserCache(userId: string) {
  revalidateTag('user')
}

// src/lib/security.ts
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

// Rate limiting más específico para diferentes endpoints
export const createRateLimit = (
  windowMs: number = 15 * 60 * 1000, // 15 minutos
  max: number = 100,
  message: string = 'Demasiadas solicitudes'
) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
})

// Slow down para ataques de fuerza bruta
export const createSlowDown = (
  windowMs: number = 15 * 60 * 1000,
  delayAfter: number = 5,
  delayMs: number = 500
) => slowDown({
  windowMs,
  delayAfter,
  delayMs,
})

// Validación adicional de sesiones
export async function validateSession(sessionToken: string) {
  try {
    const session = await db.session.findUnique({
      where: { sessionToken },
      include: { user: true }
    })

    if (!session) return null

    // Verificar si la sesión ha expirado
    if (session.expires < new Date()) {
      await db.session.delete({
        where: { sessionToken }
      })
      return null
    }

    return session
  } catch (error) {
    console.error('Error validating session:', error)
    return null
  }
}

// Logs de seguridad
export function logSecurityEvent(
  event: 'login_success' | 'login_failure' | 'password_reset' | 'account_locked',
  userId?: string,
  ip?: string,
  userAgent?: string,
  metadata?: Record<string, any>
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    userId,
    ip,
    userAgent,
    metadata,
  }

  // En producción, enviar a un servicio de logging como DataDog, Sentry, etc.
  console.log('Security Event:', JSON.stringify(logEntry))
  
  // También podrías guardar en base de datos para auditoría
  // await db.securityLog.create({ data: logEntry })
}

// src/lib/validation.ts
import { z } from 'zod'

// Validaciones adicionales para seguridad
export const securePasswordSchema = z
  .string()
  .min(12, 'La contraseña debe tener al menos 12 caracteres')
  .regex(/^(?=.*[a-z])/, 'Debe contener al menos una letra minúscula')
  .regex(/^(?=.*[A-Z])/, 'Debe contener al menos una letra mayúscula')
  .regex(/^(?=.*\d)/, 'Debe contener al menos un número')
  .regex(/^(?=.*[@$!%*?&])/, 'Debe contener al menos un símbolo especial')
  .regex(/^[^\s]+$/, 'No puede contener espacios')

// Validación de IP para geolocalización
export const ipSchema = z.string().ip({ version: 'v4' }).or(z.string().ip({ version: 'v6' }))

// Validación de User Agent
export const userAgentSchema = z.string().max(500)

// Sanitización de entrada
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres potencialmente peligrosos
    .slice(0, 1000) // Limitar longitud
}
```

---

## 🎯 **RESUMEN Y MEJORES PRÁCTICAS**

### **Checklist de Implementación Completa**

```markdown
## ✅ Configuración Base
- [ ] Variables de entorno configuradas
- [ ] Base de datos configurada con Prisma
- [ ] NextAuth.js configurado con providers
- [ ] Middleware implementado
- [ ] Tipos TypeScript extendidos

## ✅ Seguridad
- [ ] Rate limiting implementado
- [ ] Headers de seguridad configurados
- [ ] Validación de entrada con Zod
- [ ] Hashing de contraseñas con bcrypt
- [ ] Logs de seguridad implementados
- [ ] Validación de sesiones

## ✅ UI/UX
- [ ] Formularios de login/registro
- [ ] Componentes de protección de rutas
- [ ] Manejo de estados de carga
- [ ] Mensajes de error user-friendly
- [ ] Navegación basada en roles

## ✅ Testing
- [ ] Tests unitarios para componentes
- [ ] Tests de integración para API routes
- [ ] Tests del middleware
- [ ] Tests E2E para flujos críticos

## ✅ Performance
- [ ] Cache implementado donde corresponde
- [ ] Lazy loading de componentes
- [ ] Optimización de queries a BD
- [ ] Streaming de sesiones

## ✅ Monitoreo
- [ ] Logs estructurados
- [ ] Métricas de autenticación
- [ ] Alertas de seguridad
- [ ] Dashboard de administración
```

### **Analogía Final: Tu Sistema de Seguridad Digital**

Imagina que has construido un rascacielos del futuro con el sistema de seguridad más avanzado del mundo:

- **NextAuth.js** es tu **centro de comando** - coordina todo el sistema de seguridad
- **Middleware** es tu **guardia inteligente** - está en cada entrada verificando y dirigiendo
- **Providers** son tus **múltiples métodos de identificación** - huella digital, reconocimiento facial, tarjetas
- **Rate Limiting** son tus **detectores de comportamiento sospechoso** - previenen ataques
- **Validation** son tus **scanners de seguridad** - verifican que todo esté en orden
- **Testing** son tus **simulacros de emergencia** - aseguran que todo funcione cuando sea necesario

### **Principios de Oro**

1. **Nunca confíes, siempre verifica** - Valida todo en el servidor
2. **Falla de forma segura** - Si algo sale mal, protege al usuario
3. **Minimiza la superficie de ataque** - Solo expone lo necesario
4. **Registra todo** - Los logs son tu caja negra en caso de problemas
5. **Mantén la simplicidad** - La complejidad es enemiga de la seguridad

### **Próximos Pasos Avanzados**

Una vez que domines esta implementación, puedes explorar:

- **Autenticación multi-factor (2FA)**
- **OAuth personalizado**
- **Single Sign-On (SSO)**
- **Autenticación biométrica**
- **Sessions distribuidas con Redis**
- **Micro-servicios de autenticación**

---

**¡Felicidades!** 🎉 Ahora tienes un sistema de autenticación y autorización de nivel empresarial. Has construido algo que no solo es seguro y escalable, sino también user-friendly y maintible.

Recuerda: la seguridad no es un destino, es un viaje. Mantén tu sistema actualizado, monitorea constantemente, y nunca dejes de aprender sobre nuevas amenazas y mejores prácticas.

**Tu aplicación ahora está protegida como Fort Knox, pero es tan fácil de usar como abrir la puerta de tu casa.** 🔐🏠